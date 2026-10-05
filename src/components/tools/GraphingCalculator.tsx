import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RotateCcw, ZoomIn, ZoomOut, HelpCircle, Sparkles } from 'lucide-react';

interface Equation {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const PRESETS = [
  { name: 'Parabola', expr: 'x^2 - 4' },
  { name: 'Sine Wave', expr: 'sin(x)' },
  { name: 'Cubic Polynomial', expr: 'x^3 - 3*x' },
  { name: 'Damped Oscillation', expr: 'exp(-0.2*x) * cos(2*x)' },
  { name: 'Circle (Upper/Lower)', expr: 'sqrt(16 - x^2)' },
  { name: 'Rational Function', expr: '1 / (x^2 + 1)' },
];

export default function GraphingCalculator() {
  const [equations, setEquations] = useState<Equation[]>([
    { id: '1', expr: 'x^2 - 4', color: '#3b82f6', visible: true },
    { id: '2', expr: 'sin(x)', color: '#10b981', visible: true },
  ]);

  // Viewport state (Center coordinates and scale)
  const [view, setView] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  });

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Add equation
  const handleAddEquation = () => {
    if (equations.length >= 6) return;
    const newColor = PRESET_COLORS[equations.length % PRESET_COLORS.length];
    setEquations([...equations, { id: Date.now().toString(), expr: 'x', color: newColor, visible: true }]);
  };

  const handleUpdateExpr = (id: string, expr: string) => {
    setEquations(equations.map(eq => (eq.id === id ? { ...eq, expr } : eq)));
  };

  const handleToggleVisible = (id: string) => {
    setEquations(equations.map(eq => (eq.id === id ? { ...eq, visible: !eq.visible } : eq)));
  };

  const handleDelete = (id: string) => {
    if (equations.length <= 1) return;
    setEquations(equations.filter(eq => eq.id !== id));
  };

  const handleResetView = () => {
    setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  };

  const handleZoom = (factor: number) => {
    const xCenter = (view.xMin + view.xMax) / 2;
    const yCenter = (view.yMin + view.yMax) / 2;
    const xSpan = (view.xMax - view.xMin) * factor;
    const ySpan = (view.yMax - view.yMin) * factor;
    setView({
      xMin: xCenter - xSpan / 2,
      xMax: xCenter + xSpan / 2,
      yMin: yCenter - ySpan / 2,
      yMax: yCenter + ySpan / 2,
    });
  };

  // Compile expression into a safe evaluator function
  const compileExpr = (expr: string) => {
    try {
      // Clean expression: replace ^ with **, support standard math functions
      let sanitized = expr
        .replace(/\^/g, '**')
        .replace(/([0-9])\s*([a-zA-Z(])/g, '$1*$2'); // e.g. 2x -> 2*x

      const fn = new Function('x', `with(Math) { try { return ${sanitized}; } catch(e) { return NaN; } }`);
      // Test execution
      fn(1);
      return fn;
    } catch {
      return null;
    }
  };

  // Draw canvas graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Coordinate conversions
    const toScreenX = (x: number) => ((x - view.xMin) / (view.xMax - view.xMin)) * width;
    const toScreenY = (y: number) => height - ((y - view.yMin) / (view.yMax - view.yMin)) * height;
    const toMathX = (px: number) => view.xMin + (px / width) * (view.xMax - view.xMin);
    const toMathY = (py: number) => view.yMin + ((height - py) / height) * (view.yMax - view.yMin);

    // Draw Grid Lines & Axis Numbers
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';

    // X grid lines
    const xRange = view.xMax - view.xMin;
    let xStep = Math.pow(10, Math.floor(Math.log10(xRange))) / 2;
    if (xRange / xStep > 20) xStep *= 2;
    if (xRange / xStep < 5) xStep /= 2;

    let startX = Math.ceil(view.xMin / xStep) * xStep;
    for (let x = startX; x <= view.xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // Number label
      if (Math.abs(x) > 0.0001) {
        const sy = Math.min(Math.max(toScreenY(0) + 15, 15), height - 10);
        ctx.fillText(x.toFixed(xStep < 1 ? 1 : 0), sx - 10, sy);
      }
    }

    // Y grid lines
    const yRange = view.yMax - view.yMin;
    let yStep = Math.pow(10, Math.floor(Math.log10(yRange))) / 2;
    if (yRange / yStep > 20) yStep *= 2;
    if (yRange / yStep < 5) yStep /= 2;

    let startY = Math.ceil(view.yMin / yStep) * yStep;
    for (let y = startY; y <= view.yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      // Number label
      if (Math.abs(y) > 0.0001) {
        const sx = Math.min(Math.max(toScreenX(0) + 8, 10), width - 35);
        ctx.fillText(y.toFixed(yStep < 1 ? 1 : 0), sx, sy + 4);
      }
    }

    // Draw Main X and Y Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // Y-axis (x = 0)
    const zeroX = toScreenX(0);
    if (zeroX >= 0 && zeroX <= width) {
      ctx.beginPath();
      ctx.moveTo(zeroX, 0);
      ctx.lineTo(zeroX, height);
      ctx.stroke();
    }

    // X-axis (y = 0)
    const zeroY = toScreenY(0);
    if (zeroY >= 0 && zeroY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(width, zeroY);
      ctx.stroke();
    }

    // Plot each equation
    equations.forEach(eq => {
      if (!eq.visible || !eq.expr.trim()) return;
      const fn = compileExpr(eq.expr);
      if (!fn) return;

      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let isDrawing = false;
      const numPoints = width; // 1 point per pixel for smooth curve

      for (let px = 0; px <= numPoints; px++) {
        const x = toMathX(px);
        const y = fn(x);

        if (isNaN(y) || !isFinite(y)) {
          isDrawing = false;
          continue;
        }

        const py = toScreenY(y);

        // Clip out of bounds points slightly beyond canvas to prevent stray lines
        if (py < -height || py > height * 2) {
          isDrawing = false;
          continue;
        }

        if (!isDrawing) {
          ctx.moveTo(px, py);
          isDrawing = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    });

    // Draw Mouse Coordinates Inspector Crosshair
    if (mousePos) {
      const mathX = toMathX(mousePos.x);
      const mathY = toMathY(mousePos.y);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(width, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Coordinate tooltip badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      const text = `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
      ctx.font = '11px monospace';
      const textWidth = ctx.measureText(text).width;
      
      const boxX = Math.min(Math.max(mousePos.x + 12, 10), width - textWidth - 25);
      const boxY = Math.max(mousePos.y - 28, 10);

      ctx.fillRect(boxX, boxY, textWidth + 16, 22);
      ctx.strokeRect(boxX, boxY, textWidth + 16, 22);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(text, boxX + 8, boxY + 15);
    }
  }, [equations, view, mousePos]);

  // Handle Mouse Pan & Zoom
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setMousePos({ x: px, y: py });

    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const width = canvas.width;
    const height = canvas.height;
    const xSpan = view.xMax - view.xMin;
    const ySpan = view.yMax - view.yMin;

    const xChange = (dx / width) * xSpan;
    const yChange = (dy / height) * ySpan;

    setView({
      xMin: view.xMin - xChange,
      xMax: view.xMax - xChange,
      yMin: view.yMin + yChange,
      yMax: view.yMax + yChange,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    handleZoom(factor);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[720px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Sidebar: Equation Editor & Controls */}
      <div className="w-full lg:w-96 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Graphing Calculator</h2>
          </div>
          <button
            onClick={handleResetView}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Presets Quickbar */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Quick Presets</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (equations.length < 6) {
                    const newColor = PRESET_COLORS[equations.length % PRESET_COLORS.length];
                    setEquations([...equations, { id: Date.now().toString(), expr: p.expr, color: newColor, visible: true }]);
                  } else {
                    handleUpdateExpr(equations[0].id, p.expr);
                  }
                }}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700/60 transition"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Equations List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {equations.map((eq, idx) => (
            <div key={eq.id} className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 shadow-sm">
              <input
                type="color"
                value={eq.color}
                onChange={(e) => {
                  const updated = [...equations];
                  updated[idx].color = e.target.value;
                  setEquations(updated);
                }}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                title="Line Color"
              />
              <span className="text-xs font-mono font-bold text-slate-400">y{idx + 1}=</span>
              <input
                type="text"
                value={eq.expr}
                onChange={(e) => handleUpdateExpr(eq.id, e.target.value)}
                placeholder="e.g. sin(x) or x^2"
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 px-3 py-1.5 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleToggleVisible(eq.id)}
                className={`text-xs px-2 py-1 rounded font-semibold transition ${
                  eq.visible ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'bg-slate-700 text-slate-400'
                }`}
                title="Toggle Visibility"
              >
                {eq.visible ? 'Show' : 'Hide'}
              </button>
              {equations.length > 1 && (
                <button
                  onClick={() => handleDelete(eq.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition"
                  title="Remove Equation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Equation Button */}
        {equations.length < 6 && (
          <button
            onClick={handleAddEquation}
            className="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" /> Add Expression
          </button>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Tip: Use <code>x^2</code> for powers, <code>sin(x)</code>, <code>cos(x)</code>, <code>sqrt(x)</code>, or scroll to zoom & drag to pan.</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-slate-950 flex flex-col">
        {/* Floating Zoom Controls Bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-lg shadow-xl">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-0.5" />
          <button
            onClick={handleResetView}
            className="p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={720}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setMousePos(null);
          }}
          onWheel={handleWheel}
          className="w-full h-full cursor-crosshair block"
        />
      </div>
    </div>
  );
}
