import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d2c54] text-white pt-12 pb-8 border-t border-[#173b6b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="bg-white p-2 rounded inline-block mb-3">
              <span className="text-[#0d2c54] font-black tracking-tight text-sm">
                ▲ CANACO SERVYTUR
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cámara Nacional de Comercio, Servicios y Turismo de Huauchinango. Impulsando el desarrollo económico, comercial y turístico de la Sierra Norte de Puebla.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">
              Atención Ciudadana
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Centro Histórico de Huauchinango, Puebla</li>
              <li>Teléfono Institucional: (776) 762 0000</li>
              <li>Horario: Lunes a Viernes de 9:00 a 17:00 hrs</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">
              Compromiso Institucional
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plataforma oficial para la promoción turística de presas, cascadas y ferias tradicionales. Protegida con estándares de seguridad y trazabilidad.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700/60 pt-6 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} CANACO Servytur Huauchinango. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
