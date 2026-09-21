import React from 'react';
import { LogIn, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdminPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onNavigateSection,
  onOpenAdminPanel,
}) => {
  // Verificación estricta de rol devuelto por la base de datos
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 bg-[#0d2c54] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateSection('hero')}>
          <div className="bg-white p-2 rounded shadow-sm flex items-center justify-center">
            <div className="border border-[#0d2c54] px-2 py-1 text-[#0d2c54] font-black tracking-tighter text-sm flex items-center gap-1">
              <span className="text-blue-700 font-extrabold text-base">▲</span> CANACO SERVYTUR
            </div>
          </div>
          <span className="hidden md:inline-block text-xs uppercase tracking-wider text-slate-300 font-semibold border-l border-slate-600 pl-3">
            Huauchinango
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button
            onClick={() => onNavigateSection('turismo')}
            className="text-slate-200 hover:text-white transition-colors uppercase tracking-wider text-xs md:text-sm"
          >
            ZONAS TURÍSTICAS
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => onNavigateSection('eventos')}
            className="text-slate-200 hover:text-white transition-colors uppercase tracking-wider text-xs md:text-sm"
          >
            EVENTOS
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => onNavigateSection('rutas')}
            className="text-slate-200 hover:text-white transition-colors uppercase tracking-wider text-xs md:text-sm"
          >
            RUTAS
          </button>
        </nav>

        {/* Auth Action */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Botón dinámico exclusivo cuando la base de datos certifica rol ADMIN */}
              {isAdmin && onOpenAdminPanel && (
                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-1.5 bg-[#f05423] hover:bg-[#d94416] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all duration-200"
                  title="Panel de Control Institucional"
                >
                  <Shield size={13} />
                  <span>Panel Control</span>
                </button>
              )}

              <div className="flex items-center gap-2 bg-[#173b6b] px-3 py-1.5 rounded-full text-xs text-slate-200">
                <UserIcon size={14} className={isAdmin ? 'text-amber-400' : 'text-[#f05423]'} />
                <span className="font-semibold truncate max-w-[120px]">{currentUser.fullName}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-full hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 border border-white/80 hover:border-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-[#0d2c54] transition-all duration-200"
            >
              <LogIn size={15} />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
