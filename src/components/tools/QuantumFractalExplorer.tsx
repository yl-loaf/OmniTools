import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Download, ZoomIn, ZoomOut, Settings, Sparkles, Palette } from 'lucide-react';

export const QuantumFractalExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fractalType, setFractalType] = useState<'mandelbrot' | 'julia'>('mandelbrot');
  const [maxIterations, setMaxIterations] = useState<number>(100);
  const [colorPalette, setColorPalette] = useState<string>('electric');
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [juliaConstant, setJuliaConstant] = useState<{ cReal: number; cImag: number }>({ cReal: -0.7, cImag: 0.27015 });
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderTime, setRenderTime] = useState<number>(0);

  const drawFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = performance.now();
    setIsRendering(true);

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const scale = 3 / (zoom * Math.min(width, height));
    const xOffset = -width / 2 * scale + offset.x;
    const yOffset = -height / 2 * scale + offset.y;

    const maxIter = maxIterations;
    const cRe = juliaConstant.cReal;
    const cIm = juliaConstant.cImag;

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        let x0 = px * scale + xOffset;
        let y0 = py * scale + yOffset;

        let zx = fractalType === 'mandelbrot' ? 0 : x0;
        let zy = fractalType === 'mandelbrot' ? 0 : y0;
        let cx = fractalType === 'mandelbrot' ? x0 : cRe;
        let cy = fractalType === 'mandelbrot' ? y0 : cIm;

        let iter = 0;
        while (zx * zx + zy * zy <= 4 && iter < maxIter) {
          const temp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = temp;
          iter++;
        }

        const idx = (py * width + px) * 4;
        if (iter === maxIter) {
          data[idx] = 0;     // R
          data[idx + 1] = 0; // G
          data[idx + 2] = 0; // B
          data[idx + 3] = 255; // A
        } else {
          const t = iter / maxIter;
          let r = 0, g = 0, b = 0;

          if (colorPalette === 'electric') {
            r = Math.floor(9 * (1 - t) * t * t * t * 255);
            g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
            b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
          } else if (colorPalette === 'fire') {
            r = Math.floor(255 * Math.sqrt(t));
            g = Math.floor(255 * (t * t));
            b = Math.floor(Math.max(0, 255 * (1 - t * 2)));
          } else if (colorPalette === 'emerald') {
            r = Math.floor(20 * t);
            g = Math.floor(255 * Math.pow(t, 0.4));
            b = Math.floor(50 * t);
          } else {
            // Rainbow
            r = Math.floor(Math.sin(t * Math.PI * 2) * 127 + 128);
            g = Math.floor(Math.sin(t * Math.PI * 2 + 2) * 127 + 128);
            b = Math.floor(Math.sin(t * Math.PI * 2 + 4) * 127 + 128);
          }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const endTime = performance.now();
    setRenderTime(Math.round(endTime - startTime));
    setIsRendering(false);
  }, [fractalType, maxIterations, colorPalette, zoom, offset, juliaConstant]);

  useEffect(() => {
    drawFractal();
  }, [drawFractal]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 3 / (zoom * Math.min(width, height));
    const xOffset = -width / 2 * scale + offset.x;
    const yOffset = -height / 2 * scale + offset.y;

    const newX = clickX * scale + xOffset;
    const newY = clickY * scale + yOffset;

    setOffset({ x: newX, y: newY });
    setZoom((prev) => prev * 2);
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setMaxIterations(100);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${fractalType}-fractal-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-slate-100">Quantum Fractal Mandelbrot & Julia Explorer</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Explore infinite chaotic complex dynamics with real-time gradient mapping and zoom navigation. Click canvas to zoom into coordinates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset View
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" /> Export PNG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Controls Panel */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" /> Fractal Parameters
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Set Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFractalType('mandelbrot')}
                  className={`py-2 text-xs font-semibold rounded-lg transition ${
                    fractalType === 'mandelbrot'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Mandelbrot
                </button>
                <button
                  onClick={() => setFractalType('julia')}
                  className={`py-2 text-xs font-semibold rounded-lg transition ${
                    fractalType === 'julia'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Julia Set
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Max Iterations: {maxIterations}</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Color Palette</label>
              <select
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="electric">Electric Deep Blue</option>
                <option value="fire">Solar Flare</option>
                <option value="emerald">Emerald Matrix</option>
                <option value="rainbow">Psychedelic Rainbow</option>
              </select>
            </div>

            {fractalType === 'julia' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-xs font-medium text-slate-300">Julia Constant (c)</span>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Real: {juliaConstant.cReal.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.005"
                    value={juliaConstant.cReal}
                    onChange={(e) => setJuliaConstant((prev) => ({ ...prev, cReal: Number(e.target.value) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Imag: {juliaConstant.cImag.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.005"
                    value={juliaConstant.cImag}
                    onChange={(e) => setJuliaConstant((prev) => ({ ...prev, cImag: Number(e.target.value) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div>Zoom Level: {zoom.toFixed(1)}x</div>
              <div>Render Time: {renderTime}ms</div>
              {isRendering && <div className="text-indigo-400 animate-pulse">Rendering fractal...</div>}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="lg:col-span-3 flex items-center justify-center bg-black rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
            <canvas
              ref={canvasRef}
              width={650}
              height={500}
              onClick={handleCanvasClick}
              className="cursor-crosshair max-w-full h-auto"
            />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-slate-300 border border-slate-700 pointer-events-none">
              Click anywhere to zoom in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
