import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './shared/components/Navbar';
import { Hero } from './shared/components/Hero';
import { Footer } from './shared/components/Footer';
import { TouristSection } from './features/tourism/components/TouristSection';
import { EventsSection } from './features/events/components/EventsSection';
import { RoutesSection } from './features/routes/components/RoutesSection';
import { AuthModal } from './features/auth/components/AuthModal';
import { ParticipationModal } from './features/participation/components/ParticipationModal';
import { TouristSpot, EventItem, RouteItem, User } from './shared/types';
import { TourismService, EventsService, AuthService } from './services/api';

const AdminDashboard = lazy(() =>
  import('./features/admin/components/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);

const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'route-1',
    title: 'Circuito de las Grandes Presas',
    description: 'Recorrido por la Presa Tenango y Presa Necaxa con paradas gastronómicas y artesanales.',
    difficulty: 'Fácil',
    duration: 'Medio día',
    stops: '3 Paradas',
    imageUrl: '',
  },
  {
    id: 'route-2',
    title: 'Ruta del Café y Cascadas Totolapa',
    description: 'Senderismo ecológico a través de cafetales de altura y cascadas de aguas cristalinas.',
    difficulty: 'Moderada',
    duration: '4 horas',
    stops: '4 Paradas',
    imageUrl: '',
  },
  {
    id: 'route-3',
    title: 'Ruta Cultural y Gastronómica del Centro',
    description: 'Paseo guiado por monumentos coloniales, talleres de bordado y cata de tamales de puñete.',
    difficulty: 'Fácil',
    duration: '2.5 horas',
    stops: '5 Paradas',
    imageUrl: '',
  },
];

export function App() {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [routes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedEventForParticipation, setSelectedEventForParticipation] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Carga de datos directamente sincronizados desde Supabase
  const loadData = async () => {
    try {
      const [fetchedSpots, fetchedEvents] = await Promise.all([
        TourismService.getSpots(),
        EventsService.getEvents(),
      ]);
      setSpots(fetchedSpots);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error al sincronizar datos institucionales:', err);
    }
  };

  const checkSession = async () => {
    try {
      const user = await AuthService.getProfile();
      if (user) {
        setCurrentUser(user);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadData();
    checkSession();
  }, []);

  // Atajo de teclado reservado (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (currentUser?.role === 'ADMIN') {
          setShowAdminPanel(true);
        } else {
          setIsAuthOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser]);

  const handleScrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = spots.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      setSpots(filtered);
      handleScrollToSection('turismo');
    } else {
      alert(`No se encontraron resultados para "${searchQuery}".`);
      loadData();
    }
  };

  if (showAdminPanel && currentUser?.role === 'ADMIN') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100 text-xs text-slate-500">Cargando panel de gestión...</div>}>
        <AdminDashboard
          spots={spots}
          events={events}
          onRefreshData={loadData}
          onExitAdmin={() => setShowAdminPanel(false)}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthOpen(true)}
        onLogout={() => {
          AuthService.logout();
          setCurrentUser(null);
          setShowAdminPanel(false);
        }}
        onNavigateSection={handleScrollToSection}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
      />

      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <TouristSection
        spots={spots}
        onOpenModule={() => handleScrollToSection('turismo')}
        onSelectSpot={(spot) => alert(`Atractivo: ${spot.title}\n${spot.description}`)}
      />

      <EventsSection
        events={events}
        onOpenModule={() => handleScrollToSection('eventos')}
        onRequestParticipation={(event) => setSelectedEventForParticipation(event)}
      />

      <RoutesSection
        routes={routes}
        onOpenModule={() => handleScrollToSection('rutas')}
        onSelectRoute={(route) => alert(`Ruta: ${route.title}\nDuración: ${route.duration}`)}
      />

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(_token, user) => {
          setCurrentUser(user);
          if (user.role === 'ADMIN') {
            setShowAdminPanel(true);
          }
        }}
      />

      <ParticipationModal
        isOpen={!!selectedEventForParticipation}
        event={selectedEventForParticipation}
        currentUser={currentUser}
        onClose={() => setSelectedEventForParticipation(null)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSubmitSuccess={loadData}
      />
    </div>
  );
}

export default App;
