import React from 'react';
import { MapPin } from 'lucide-react';
import { TouristSpot } from '../../../shared/types';

interface TouristSectionProps {
  spots: TouristSpot[];
  onOpenModule: () => void;
  onSelectSpot: (spot: TouristSpot) => void;
}

export const TouristSection: React.FC<TouristSectionProps> = ({
  spots,
  onOpenModule,
  onSelectSpot,
}) => {
  return (
    <section id="turismo" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Zonas y Atractivos Turísticos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cascadas, miradores y patrimonio natural de Huauchinango
            </p>
          </div>
          <button
            onClick={onOpenModule}
            className="bg-[#289643] hover:bg-[#1e7834] text-white font-medium px-6 py-2 rounded-full text-xs sm:text-sm shadow-sm transition-all duration-200"
          >
            Módulo Turismo
          </button>
        </div>

        {/* Spot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src={spot.imageUrl}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-[#0d2c54] transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-400">
                  <MapPin size={14} className="mr-1 text-slate-400" />
                  <span className="truncate">{spot.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
