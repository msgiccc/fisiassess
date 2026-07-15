import React from 'react';

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
}

const symbolCategories = [
  {
    name: 'Yunani',
    symbols: ['\\alpha', '\\beta', '\\gamma', '\\theta', '\\mu', '\\pi', '\\rho', '\\Sigma', '\\Delta', '\\Omega']
  },
  {
    name: 'Operasi & Relasi',
    symbols: ['+', '-', '\\pm', '\\times', '\\div', '=', '\\approx', '\\neq', '<', '>', '\\le', '\\ge', '\\infty', '\\propto']
  },
  {
    name: 'Fisika & Kalkulus',
    symbols: ['^2', '^3', '\\sqrt{}', '\\int', '\\partial', '\\vec{}', '\\hat{}', '^\\circ', '\\text{kg}', '\\text{m/s}^2', '\\text{N}']
  },
  {
    name: 'Struktur LaTeX',
    symbols: ['_{}', '^{}', '\\frac{}{}']
  }
];

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2">
      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-between">
        <span>Math & Physics Toolbar (LaTeX)</span>
        <span className="text-[10px] text-slate-400 font-normal">Klik untuk menyisipkan ke dalam jawaban</span>
      </div>
      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
        {symbolCategories.map((cat, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{cat.name}</div>
            <div className="flex flex-wrap gap-1.5">
              {cat.symbols.map((sym, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onInsert(sym)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary-pale hover:text-primary hover:border-primary/30 transition-colors shadow-sm"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
