import React from 'react';
import { RouteItem } from '../../../shared/types';
import { Compass, Clock, Milestone } from 'lucide-react';

interface RoutesSectionProps {
  routes: RouteItem[];
  onOpenModule: () => void;
  onSelectRoute: (route: RouteItem) => void;
}

export const RoutesSection: React.FC<RoutesSectionProps> = ({
  routes,
  onOpenModule,
  onSelectRoute,
}) => {
  return (
    <section id="rutas" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Rutas e Itinerarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Circuitos turísticos, presas y senderos recomendados por la cámara
            </p>
          </div>
          <button
            onClick={onOpenModule}
            className="bg-[#0d2c54] hover:bg-[#173b6b] text-white font-medium px-6 py-2 rounded-full text-xs sm:text-sm shadow-sm transition-all duration-200"
          >
            Módulo Rutas
          </button>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-[#f05423] font-semibold text-xs mb-2">
                <Compass size={16} />
                <span>{route.difficulty}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-[#0d2c54] transition-colors">
                {route.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {route.description}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-3">
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {route.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Milestone size={13} /> {route.stops}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
