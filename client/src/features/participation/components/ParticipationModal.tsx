import React, { useState } from 'react';
import { X, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { EventItem, User } from '../../../shared/types';
import { ParticipationService } from '../../../services/api';

interface ParticipationModalProps {
  isOpen: boolean;
  event: EventItem | null;
  currentUser: User | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSubmitSuccess?: () => void;
}

export const ParticipationModal: React.FC<ParticipationModalProps> = ({
  isOpen,
  event,
  currentUser,
  onClose,
  onOpenAuth,
  onSubmitSuccess,
}) => {
  const [standType, setStandType] = useState('Artesanías y Productos Típicos');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setError(null);

    try {
      await ParticipationService.submitRequest({
        userId: currentUser.id,
        eventId: event.id,
        notes,
        standType,
      });
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-[#0d2c54] p-5 text-white flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold">Solicitud de Participación a Evento</h3>
            <p className="text-xs text-slate-300 truncate max-w-xs">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#f05423]" />
              <span className="font-semibold text-slate-800">Fecha:</span>{' '}
              {new Date(event.startDate).toLocaleDateString('es-MX')} - {new Date(event.endDate).toLocaleDateString('es-MX')}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#f05423]" />
              <span className="font-semibold text-slate-800">Sede:</span> {event.location}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="mx-auto text-emerald-500 mb-3" />
              <h4 className="text-base font-bold text-slate-800">¡Solicitud Registrada con Éxito!</h4>
              <p className="text-xs text-slate-500 mt-1">
                La administración institucional evaluará la solicitud y te notificará la asignación del espacio.
              </p>
            </div>
          ) : !currentUser ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold">Vista previa del formulario:</span> Para solicitar un espacio dentro de la expo o feria debes iniciar sesión como comerciante local.
                </div>
              </div>

              <div className="opacity-60 pointer-events-none space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giro Comercial / Tipo de Stand</label>
                  <input
                    type="text"
                    disabled
                    value="Gastronomía, Artesanías, Comercio General..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción de Productos</label>
                  <textarea
                    disabled
                    rows={3}
                    placeholder="Detalla los productos que exhibirás..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full bg-[#f05423] hover:bg-[#d94416] text-white font-semibold py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-md"
                >
                  Registrarse o Iniciar Sesión para Solicitar Espacio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Stand / Categoría
                </label>
                <select
                  value={standType}
                  onChange={(e) => setStandType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f05423] outline-none"
                >
                  <option>Artesanías y Productos Típicos</option>
                  <option>Gastronomía y Bebidas Tradicionales</option>
                  <option>Comercio y Servicios Generales</option>
                  <option>Joyería y Textiles Regionales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción de Productos a Exhibir
                </label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe brevemente tus productos o giro comercial..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f05423] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold bg-[#f05423] hover:bg-[#d94416] text-white rounded-lg shadow transition"
                >
                  {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
