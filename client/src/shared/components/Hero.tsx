import React from 'react';
import { Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-[460px] md:min-h-[520px] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 44, 84, 0.38), rgba(13, 44, 84, 0.5)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Main Heading exact as picture */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#f05423] tracking-wide uppercase drop-shadow-md">
          DESCUBRE LA SIERRA NORTE DE PUEBLA
        </h1>

        {/* Subheading */}
        <p className="mt-3 text-lg sm:text-xl md:text-2xl text-white font-medium drop-shadow">
          Con nosotros CANACO Servytur Huauchinango
        </p>

        {/* Floating Search Bar */}
        <form
          onSubmit={onSearchSubmit}
          className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-full p-1.5 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-[#f05423]"
        >
          <div className="flex items-center pl-4 pr-2 text-slate-400 flex-1">
            <Search size={20} className="mr-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar atractivos, eventos, rutas..."
              className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#f05423] hover:bg-[#d94416] text-white font-semibold px-6 sm:px-8 py-2.5 rounded-full text-sm transition-all duration-200 shadow-sm"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
};
