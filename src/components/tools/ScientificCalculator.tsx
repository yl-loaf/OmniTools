import React, { useState } from 'react';
import { Calculator, Copy, Check, RotateCcw, History, Percent, ArrowRightLeft } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [memory, setMemory] = useState<number>(0);
  const [lastAns, setLastAns] = useState<number>(0);
  const [fractionMode, setFractionMode] = useState<boolean>(true); // Fraction display by default
  const [rawDecimalResult, setRawDecimalResult] = useState<number | null>(null);
  const [showAsDecimal, setShowAsDecimal] = useState<boolean>(false);

  // Helper to convert decimal to simplified fraction string
  const toFraction = (decimal: number): string => {
    if (!isFinite(decimal) || isNaN(decimal)) return 'Error';
    if (decimal === 0) return '0';

    const sign = decimal < 0 ? '-' : '';
    let abs = Math.abs(decimal);

    if (Number.isInteger(abs)) {
      return sign + abs.toString();
    }

    let tolerance = 1.05e-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = abs;
    let invDecimal, a;

    do {
      a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      invDecimal = b - a;
      if (invDecimal < tolerance) break;
      b = 1 / invDecimal;
    } while (Math.abs(abs - h1 / k1) > abs * tolerance && k1 < 10000);

    const numerator = h1;
    const denominator = k1;

    if (denominator === 1) {
      return sign + numerator;
    }

    if (numerator > denominator && fractionMode) {
      const whole = Math.floor(numerator / denominator);
      const rem = numerator % denominator;
      return `${sign}${whole} ${rem}/${denominator}`;
    }

    return `${sign}${numerator}/${denominator}`;
  };

  const handleButtonClick = (val: string) => {
    if (val === 'AC' || val === 'C') {
      setDisplay('0');
      setRawDecimalResult(null);
    } else if (val === 'DEL' || val === 'CE') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === 'Ans') {
      setDisplay((prev) => (prev === '0' ? String(lastAns) : prev + lastAns));
    } else if (val === 'SD') {
      if (rawDecimalResult !== null) {
        setShowAsDecimal(!showAsDecimal);
        if (!showAsDecimal) {
          setDisplay(String(rawDecimalResult));
        } else {
          setDisplay(toFraction(rawDecimalResult));
        }
      }
    } else if (val === 'M+') {
      try {
        const valNum = Function(`"use strict"; return (${display})`)();
        setMemory((m) => m + Number(valNum));
      } catch {
        // ignore
      }
    } else if (val === 'M-') {
      try {
        const valNum = Function(`"use strict"; return (${display})`)();
        setMemory((m) => m - Number(valNum));
      } catch {
        // ignore
      }
    } else if (val === 'MR') {
      setDisplay((prev) => (prev === '0' ? String(memory) : prev + memory));
    } else if (val === 'MC') {
      setMemory(0);
    } else if (val === '=') {
      try {
        let expr = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/sin\(/g, angleMode === 'DEG' ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
          .replace(/cos\(/g, angleMode === 'DEG' ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
          .replace(/tan\(/g, angleMode === 'DEG' ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
          .replace(/asin\(/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.asin(' : 'Math.asin(')
          .replace(/acos\(/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.acos(' : 'Math.acos(')
          .replace(/atan\(/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.atan(' : 'Math.atan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/cbrt\(/g, 'Math.cbrt(')
          .replace(/abs\(/g, 'Math.abs(')
          .replace(/(\d+)!/g, (match, n) => {
            let num = parseInt(n, 10);
            let p = 1;
            for (let i = 2; i <= num; i++) p *= i;
            return String(p);
          })
          .replace(/\^/g, '**');

        const res = Function(`"use strict"; return (${expr})`)();
        setLastAns(res);
        setRawDecimalResult(res);
        setShowAsDecimal(false);

        let outputVal = String(res);
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          if (fractionMode && !Number.isInteger(res) && Math.abs(res) < 10000 && Math.abs(res) > 0.000001) {
            outputVal = toFraction(res);
          } else {
            outputVal = Number.isInteger(res) ? String(res) : Number(res).toFixed(6).replace(/\.?0+$/, '');
          }
        }

        setHistory([`${display} = ${outputVal}`, ...history.slice(0, 9)]);
        setDisplay(outputVal);
      } catch {
        setDisplay('Error');
      }
    } else {
      if (display === '0' || display === 'Error') {
        setDisplay(val);
      } else {
        setDisplay((prev) => prev + val);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render display value (supporting beautiful stacked fractions)
  const renderDisplay = () => {
    const trimmed = display.trim();
    const mixedMatch = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const [, whole, num, den] = mixedMatch;
      return (
        <div className="flex items-center justify-end gap-2 text-3xl sm:text-5xl font-mono font-bold text-white">
          <span className="text-4xl">{whole}</span>
          <div className="inline-flex flex-col items-center justify-center text-center px-1.5">
            <span className="border-b-3 border-emerald-400 pb-1 px-1.5 leading-none text-2xl sm:text-3xl text-emerald-300">{num}</span>
            <span className="pt-1 px-1.5 leading-none text-2xl sm:text-3xl text-emerald-300">{den}</span>
          </div>
        </div>
      );
    }

    const fracMatch = trimmed.match(/^(-?\d+)\/(\d+)$/);
    if (fracMatch) {
      const [, num, den] = fracMatch;
      const isNegative = num.startsWith('-');
      return (
        <div className="flex items-center justify-end gap-1 text-4xl sm:text-5xl font-mono font-bold text-white">
          {isNegative && <span>-</span>}
          <div className="inline-flex flex-col items-center justify-center text-center px-1.5">
            <span className="border-b-3 border-emerald-400 pb-1 px-1.5 leading-none text-3xl sm:text-4xl text-emerald-300">{num.replace('-', '')}</span>
            <span className="pt-1 px-1.5 leading-none text-3xl sm:text-4xl text-emerald-300">{den}</span>
          </div>
        </div>
      );
    }

    return <span className="text-4xl sm:text-6xl font-mono font-bold text-white tracking-tight">{display}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white">Advanced Scientific Calculator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Natural textbook display with stacked vertical fractions by default. Use S&hArr;D to toggle decimal format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-mono font-bold border border-slate-700 transition"
          >
            {angleMode}
          </button>
          <button
            onClick={() => {
              setFractionMode(!fractionMode);
              if (rawDecimalResult !== null && !fractionMode) {
                setDisplay(toFraction(rawDecimalResult));
              } else if (rawDecimalResult !== null) {
                setDisplay(String(rawDecimalResult));
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              fractionMode ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            Fraction Mode: {fractionMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calculator Pad */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          {/* Screen Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-right min-h-[110px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-1">
              <span className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{angleMode}</span>
                {memory !== 0 && <span className="text-amber-400 font-bold">M ({memory})</span>}
                {fractionMode && <span className="text-emerald-400 font-bold">Frac Mode</span>}
              </span>
              <span className="truncate text-slate-400">{history[0] || ''}</span>
            </div>
            <div className="flex justify-between items-center overflow-x-auto">
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-md transition text-xs flex items-center gap-1 font-sans shrink-0"
                title="Copy result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <div className="py-1">{renderDisplay()}</div>
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-6 gap-1.5 text-xs font-bold">
            {/* Row 1: Memory & Clear */}
            {['MC', 'MR', 'M+', 'M-', 'AC', 'DEL'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-2.5 rounded-lg transition ${
                  btn === 'AC' || btn === 'DEL'
                    ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700/60 font-mono text-[11px]'
                }`}
              >
                {btn}
              </button>
            ))}

            {/* Row 2: Trig & Roots */}
            {['sin(', 'cos(', 'tan(', 'sqrt(', 'cbrt(', '^'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700/60 font-mono text-[11px]"
              >
                {btn}
              </button>
            ))}

            {/* Row 3: Inverse Trig & Log */}
            {['asin(', 'acos(', 'atan(', 'log(', 'ln(', '!'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700/60 font-mono text-[11px]"
              >
                {btn}
              </button>
            ))}

            {/* Row 4: Constants & Operators */}
            {['(', ')', 'π', 'e', 'Ans', '÷'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-2.5 rounded-lg transition ${
                  btn === '÷'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                }`}
              >
                {btn}
              </button>
            ))}

            {/* Row 5: 7 8 9 × */}
            {['7', '8', '9', '×'].map((btn, idx) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-3 rounded-lg transition ${
                  idx === 3 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60'
                }`}
              >
                {btn}
              </button>
            ))}
            <div className="col-span-2 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleButtonClick('abs(')}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 font-mono text-xs"
              >
                |x|
              </button>
              <button
                onClick={() => handleButtonClick('SD')}
                className="p-3 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-lg border border-indigo-700/60 font-mono text-xs font-bold"
                title="Toggle Standard (Fraction) <=> Decimal"
              >
                S&hArr;D
              </button>
            </div>

            {/* Row 6: 4 5 6 - */}
            {['4', '5', '6', '-'].map((btn, idx) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-3 rounded-lg transition ${
                  idx === 3 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60'
                }`}
              >
                {btn}
              </button>
            ))}
            <div className="col-span-2 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleButtonClick('1/')}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 font-mono text-xs"
              >
                1/x
              </button>
              <button
                onClick={() => handleButtonClick('%')}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 font-mono text-xs"
              >
                %
              </button>
            </div>

            {/* Row 7: 1 2 3 + */}
            {['1', '2', '3', '+'].map((btn, idx) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-3 rounded-lg transition ${
                  idx === 3 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60'
                }`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleButtonClick('=')}
              className="col-span-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/30 text-base"
            >
              =
            </button>

            {/* Row 8: 0 . */}
            {['0', '00', '.'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700/60 font-mono text-sm"
              >
                {btn}
              </button>
            ))}
            <div className="col-span-3 text-center text-[10px] text-slate-500 self-center">
              Stacked Vertical Fractions & S&hArr;D Toggle
            </div>
          </div>
        </div>

        {/* History & Info */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              Textbook Fraction Rendering
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fractions are rendered vertically with a clear horizontal divider bar, exactly like a textbook. Click <code className="text-indigo-300">S&hArr;D</code> anytime to switch to decimal format.
            </p>
          </div>

          {history.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pb-1 border-b border-slate-800">
                <span>Recent History</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {history.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const res = h.split(' = ')[1];
                      if (res) setDisplay(res);
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer flex justify-between items-center transition border border-slate-800"
                  >
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
