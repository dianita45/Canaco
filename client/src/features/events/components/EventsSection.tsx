import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { EventItem } from '../../../shared/types';

interface EventsSectionProps {
  events: EventItem[];
  onOpenModule: () => void;
  onRequestParticipation: (event: EventItem) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onOpenModule,
  onRequestParticipation,
}) => {
  return (
    <section id="eventos" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Cartelera de Eventos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ferias, exposiciones comerciales y actividades oficiales de CANACO
            </p>
          </div>
          <button
            onClick={onOpenModule}
            className="bg-[#f05423] hover:bg-[#d94416] text-white font-medium px-6 py-2 rounded-full text-xs sm:text-sm shadow-sm transition-all duration-200"
          >
            Módulo Eventos
          </button>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Event Badge / Graphic Box */}
              <div className="w-full md:w-36 h-48 bg-[#0d2c54] rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-white p-4 text-center shadow-inner relative overflow-hidden">
                <Calendar size={32} className="text-[#f05423] mb-2" />
                <span className="text-xs uppercase tracking-wider text-slate-300">CANACO</span>
                <span className="text-lg font-bold text-white mt-1">EXPO</span>
                <span className="text-[10px] text-slate-400 mt-2">Sierra Norte</span>
              </div>

              {/* Event Content & Action */}
              <div className="flex-1 flex flex-col justify-between w-full h-full py-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{new Date(event.startDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400" />
                      <span>Cupo: {event.currentAcceptedCount} / {event.capacityLimit} comerciantes</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onRequestParticipation(event)}
                    className="bg-[#0d2c54] hover:bg-[#173b6b] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow"
                  >
                    Solicitar Participación
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
