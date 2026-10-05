import React, { useState } from 'react';
import { Box, Download, RefreshCw, Palette } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function IsometricPixelStudioTool() {
  const [gridSize, setGridSize] = useState(8);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [pixels, setPixels] = useState<Record<string, string>>({});

  const colors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff', '#0f172a'];

  const handleCellClick = (r: number, c: number) => {
    const key = `${r},${c}`;
    const newPixels = { ...pixels };
    if (newPixels[key] === selectedColor) {
      delete newPixels[key];
    } else {
      newPixels[key] = selectedColor;
    }
    setPixels(newPixels);
    playSuccessSound();
  };

  const handleClear = () => {
    setPixels({});
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Box className="w-6 h-6 text-purple-400" />
          Isometric Pixel Art Sprite & Tilemap Studio
        </h2>
        <p className="text-sm text-slate-400">
          Create custom isometric tiles and pixel art sprites on interactive axonometric grids.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Palette:</span>
          {colors.map((hex) => (
            <button
              key={hex}
              onClick={() => setSelectedColor(hex)}
              className={`w-7 h-7 rounded-lg border-2 transition ${selectedColor === hex ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Canvas
        </button>
      </div>

      <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 flex items-center justify-center overflow-x-auto">
        <div
          className="grid gap-1 bg-slate-900 p-4 rounded-xl border border-slate-800"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: gridSize }).map((_, r) =>
            Array.from({ length: gridSize }).map((_, c) => {
              const key = `${r},${c}`;
              const color = pixels[key];
              return (
                <button
                  key={key}
                  onClick={() => handleCellClick(r, c)}
                  className="w-9 h-9 rounded border border-slate-800/80 transition hover:scale-105"
                  style={{ backgroundColor: color || '#1e293b' }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
