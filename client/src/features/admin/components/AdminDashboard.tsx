import React, { useState, useEffect } from 'react';
import { TouristSpot, EventItem } from '../../../shared/types';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, CheckCircle2, XCircle, ShieldCheck, MapPin, Calendar, Users } from 'lucide-react';

interface AdminDashboardProps {
  spots: TouristSpot[];
  events: EventItem[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  spots,
  events,
  onRefreshData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'spots' | 'events' | 'requests'>('spots');
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Estados de formularios modales
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [spotTitle, setSpotTitle] = useState('');
  const [spotDescription, setSpotDescription] = useState('');
  const [spotLocation, setSpotLocation] = useState('');
  const [spotCategory, setSpotCategory] = useState('DAM');
  const [spotImageUrl, setSpotImageUrl] = useState('');

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventCapacity, setEventCapacity] = useState(40);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await AdminService.getRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('Error al cargar solicitudes:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  // Manejo de Atractivos: Alta
  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await AdminService.createSpot({
        title: spotTitle,
        description: spotDescription,
        location: spotLocation,
        category: spotCategory,
        imageUrl: spotImageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
      });
      setFeedback('Atractivo guardado exitosamente en la base de datos.');
      setShowSpotModal(false);
      setSpotTitle('');
      setSpotDescription('');
      setSpotLocation('');
      setSpotImageUrl('');
      onRefreshData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert('Error al registrar el atractivo: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Manejo de Atractivos: Baja
  const handleDeleteSpot = async (id: string, title: string) => {
    if (!confirm(`¿Confirma la eliminación del atractivo "${title}" de la base de datos?`)) return;
    try {
      await AdminService.deleteSpot(id);
      setFeedback(`Atractivo "${title}" eliminado.`);
      onRefreshData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  // Manejo de Eventos: Alta
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await AdminService.createEvent({
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        startDate: new Date(eventStartDate).toISOString(),
        endDate: new Date(eventEndDate).toISOString(),
        capacityLimit: Number(eventCapacity),
      });
      setFeedback('Evento registrado exitosamente en la cartelera oficial.');
      setShowEventModal(false);
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventStartDate('');
      setEventEndDate('');
      onRefreshData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert('Error al registrar evento: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Manejo de Eventos: Baja
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`¿Confirma la eliminación del evento "${title}"?`)) return;
    try {
      await AdminService.deleteEvent(id);
      setFeedback(`Evento "${title}" eliminado.`);
      onRefreshData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  // Manejo de Solicitudes: Aprobar o Rechazar
  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const remark = prompt(
      status === 'APPROVED'
        ? 'Observaciones para el comerciante (opcional):'
        : 'Motivo del rechazo (opcional):'
    );
    try {
      await AdminService.updateRequestStatus(id, status, remark || undefined);
      fetchRequests();
      onRefreshData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar el estado');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header Institucional */}
      <header className="bg-[#081c36] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide flex items-center gap-2">
              PANEL DE GESTIÓN INSTITUCIONAL <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-mono uppercase">Privado</span>
            </h1>
            <p className="text-xs text-slate-400">CANACO Servytur Huauchinango</p>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition"
        >
          Volver al Portal Público
        </button>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {feedback && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} /> {feedback}
          </div>
        )}

        {/* Pestañas de Navegación */}
        <div className="flex gap-4 border-b border-slate-300 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('spots')}
            className={`text-xs sm:text-sm font-semibold pb-2 transition-colors ${
              activeTab === 'spots'
                ? 'text-[#0d2c54] border-b-2 border-[#0d2c54]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Gestión de Atractivos Turísticos ({spots.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`text-xs sm:text-sm font-semibold pb-2 transition-colors ${
              activeTab === 'events'
                ? 'text-[#0d2c54] border-b-2 border-[#0d2c54]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Gestión de Eventos y Expos ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`text-xs sm:text-sm font-semibold pb-2 transition-colors ${
              activeTab === 'requests'
                ? 'text-[#0d2c54] border-b-2 border-[#0d2c54]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Control de Solicitudes ({requests.filter((r) => r.status === 'PENDING').length} pendientes)
          </button>
        </div>

        {/* ==================================================== */}
        {/* PESTAÑA 1: ATRACTIVOS TURÍSTICOS (CRUD) */}
        {/* ==================================================== */}
        {activeTab === 'spots' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-700">Catálogo de Atractivos Turísticos</h3>
                <p className="text-xs text-slate-500">Registrados en la base de datos de PostgreSQL</p>
              </div>
              <button
                onClick={() => setShowSpotModal(true)}
                className="flex items-center gap-1.5 bg-[#289643] hover:bg-[#1e7834] text-white text-xs px-3.5 py-2 rounded-lg font-medium shadow-sm transition"
              >
                <Plus size={14} /> Registrar Nuevo Atractivo
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {spots.map((spot) => (
                <div key={spot.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <img src={spot.imageUrl} alt={spot.title} className="w-16 h-12 object-cover rounded-md" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{spot.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} /> {spot.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteSpot(spot.id, spot.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar de la Base de Datos"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PESTAÑA 2: EVENTOS (CRUD) */}
        {/* ==================================================== */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-700">Cartelera de Eventos y Expos Oficiales</h3>
                <p className="text-xs text-slate-500">Con cupos y fechas sincronizados en la nube</p>
              </div>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-1.5 bg-[#f05423] hover:bg-[#d94416] text-white text-xs px-3.5 py-2 rounded-lg font-medium shadow-sm transition"
              >
                <Plus size={14} /> Registrar Nuevo Evento
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{evt.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {evt.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(evt.startDate).toLocaleDateString('es-MX')}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users size={12} /> Cupo: {evt.currentAcceptedCount} / {evt.capacityLimit}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar Evento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PESTAÑA 3: CONTROL DE SOLICITUDES (RF09) */}
        {/* ==================================================== */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-700">Solicitudes de Participación de Comerciantes</h3>
              <p className="text-xs text-slate-500">Aprobar o rechazar espacios conforme al cupo disponible</p>
            </div>

            {loadingRequests ? (
              <div className="p-8 text-center text-xs text-slate-400">Consultando solicitudes...</div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No hay solicitudes registradas actualmente.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{req.user?.fullName}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {req.user?.businessName || 'Comercio Local'}
                        </span>
                        <span className="text-xs text-slate-400">Tel: {req.user?.phone || 'Sin registrar'}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Evento: <span className="font-semibold text-slate-800">{req.event?.title}</span> | Giro: {req.standType}
                      </p>
                      {req.notes && (
                        <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-100 italic">
                          "{req.notes}"
                        </p>
                      )}
                      {req.adminRemarks && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          Nota de dictamen: <span className="font-medium">{req.adminRemarks}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {req.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            <CheckCircle2 size={14} /> Aprobar Espacio
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            <XCircle size={14} /> Rechazar
                          </button>
                        </>
                      ) : req.status === 'APPROVED' ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
                          <CheckCircle2 size={14} /> Aceptado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-3 py-1 rounded-full font-medium border border-red-200">
                          <XCircle size={14} /> Rechazado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL: ALTA DE ATRACTIVO TURÍSTICO */}
      {/* ==================================================== */}
      {showSpotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Registrar Atractivo Turístico</h3>
            <form onSubmit={handleCreateSpot} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Atractivo</label>
                <input
                  type="text"
                  required
                  value={spotTitle}
                  onChange={(e) => setSpotTitle(e.target.value)}
                  placeholder="Ej. Cascadas de Totolapa"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#289643]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  required
                  value={spotLocation}
                  onChange={(e) => setSpotLocation(e.target.value)}
                  placeholder="Ej. Huauchinango, Puebla"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#289643]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  value={spotCategory}
                  onChange={(e) => setSpotCategory(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#289643]"
                >
                  <option value="DAM">Presas y Embalses</option>
                  <option value="WATERFALL">Cascadas y Ríos</option>
                  <option value="HISTORIC">Centro Histórico y Patrimonio</option>
                  <option value="ECOTOURISM">Ecoturismo y Parques</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL de Imagen (Opcional)</label>
                <input
                  type="url"
                  value={spotImageUrl}
                  onChange={(e) => setSpotImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#289643]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={spotDescription}
                  onChange={(e) => setSpotDescription(e.target.value)}
                  placeholder="Detalles sobre paisaje, accesos y actividades..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#289643]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="text-xs px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs px-4 py-2 bg-[#289643] hover:bg-[#1e7834] text-white font-semibold rounded-lg shadow"
                >
                  {submitting ? 'Guardando...' : 'Guardar en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ALTA DE EVENTO / EXPO */}
      {/* ==================================================== */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Registrar Evento o Exposición</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Evento</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ej. Expo Floricultura Huauchinango"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sede / Ubicación</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ej. Recinto Ferial"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Fin</label>
                  <input
                    type="date"
                    required
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cupo Límite de Comerciantes</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Detalles del programa, actividades y convocatoria..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f05423]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="text-xs px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs px-4 py-2 bg-[#f05423] hover:bg-[#d94416] text-white font-semibold rounded-lg shadow"
                >
                  {submitting ? 'Guardando...' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
