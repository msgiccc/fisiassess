import React from 'react';
import Latex from 'react-latex-next';

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
}

const symbolCategories = [
  {
    name: 'Dasar & Pecahan',
    symbols: [
      { label: '\\frac{a}{b}', value: '\\frac{}{} ' },
      { label: '\\sqrt{x}', value: '\\sqrt{} ' },
      { label: '\\sqrt[n]{x}', value: '\\sqrt[]{} ' },
      { label: 'x^2', value: '^2 ' },
      { label: 'x^3', value: '^3 ' },
      { label: 'x^n', value: '^{} ' },
      { label: 'x_n', value: '_{} ' },
    ]
  },
  {
    name: 'Alfabet Yunani',
    symbols: [
      { label: '\\alpha', value: '\\alpha ' },
      { label: '\\beta', value: '\\beta ' },
      { label: '\\gamma', value: '\\gamma ' },
      { label: '\\theta', value: '\\theta ' },
      { label: '\\mu', value: '\\mu ' },
      { label: '\\pi', value: '\\pi ' },
      { label: '\\rho', value: '\\rho ' },
      { label: '\\tau', value: '\\tau ' },
      { label: '\\omega', value: '\\omega ' },
      { label: '\\Sigma', value: '\\Sigma ' },
      { label: '\\Delta', value: '\\Delta ' },
      { label: '\\Omega', value: '\\Omega ' }
    ]
  },
  {
    name: 'Kalkulus & Matriks',
    symbols: [
      { label: '\\int', value: '\\int ' },
      { label: '\\int_{a}^{b}', value: '\\int_{}^{} ' },
      { label: '\\iint', value: '\\iint ' },
      { label: '\\oint', value: '\\oint ' },
      { label: '\\sum', value: '\\sum_{}^{} ' },
      { label: '\\prod', value: '\\prod_{}^{} ' },
      { label: '\\lim_{x \\to \\infty}', value: '\\lim_{ \\to } ' },
      { label: '\\partial', value: '\\partial ' },
      { label: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', value: '\\begin{pmatrix}  &  \\\\  &  \\end{pmatrix}' }
    ]
  },
  {
    name: 'Operasi & Relasi',
    symbols: [
      { label: '\\pm', value: '\\pm ' },
      { label: '\\times', value: '\\times ' },
      { label: '\\div', value: '\\div ' },
      { label: '\\approx', value: '\\approx ' },
      { label: '\\neq', value: '\\neq ' },
      { label: '\\le', value: '\\le ' },
      { label: '\\ge', value: '\\ge ' },
      { label: '\\infty', value: '\\infty ' },
      { label: '\\propto', value: '\\propto ' },
      { label: '\\sim', value: '\\sim ' },
      { label: '\\equiv', value: '\\equiv ' }
    ]
  },
  {
    name: 'Vektor & Fisika',
    symbols: [
      { label: '\\vec{v}', value: '\\vec{} ' },
      { label: '\\hat{i}', value: '\\hat{} ' },
      { label: '^\\circ', value: '^\\circ ' },
      { label: '\\text{kg}', value: '\\text{kg} ' },
      { label: '\\text{m/s}^2', value: '\\text{m/s}^2 ' },
      { label: '\\text{N}', value: '\\text{N} ' },
      { label: '\\text{J}', value: '\\text{J} ' },
      { label: '\\text{W}', value: '\\text{W} ' }
    ]
  }
];

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3">
      <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center justify-between">
        <span>Kalkulator & Simbol Fisika (LaTeX)</span>
        <span className="text-[10px] text-slate-400 font-normal">Klik untuk menyisipkan</span>
      </div>
      <div className="flex flex-col gap-4 max-h-56 overflow-y-auto custom-scrollbar pr-2">
        {symbolCategories.map((cat, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{cat.name}</div>
            <div className="flex flex-wrap gap-2">
              {cat.symbols.map((sym, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onInsert(sym.value)}
                  title={sym.value}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary-pale hover:text-primary hover:border-primary/30 transition-colors shadow-sm flex items-center justify-center min-w-[40px]"
                >
                  <Latex>{`$${sym.label}$`}</Latex>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
