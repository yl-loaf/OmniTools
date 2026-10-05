import React, { useState } from 'react';

export default function GraphingCalculator() {
  const [equations, setEquations] = useState([{ id: 1, value: 'x^2' }]);

  return (
    <div className="flex h-[600px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Sidebar for equations */}
      <div className="w-1/3 p-4 border-r border-slate-800 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-100">Equations</h2>
        {equations.map((eq, i) => (
          <input
            key={eq.id}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
            value={eq.value}
            onChange={(e) => {
                const newEqs = [...equations];
                newEqs[i].value = e.target.value;
                setEquations(newEqs);
            }}
            placeholder="y = ..."
          />
        ))}
      </div>
      
      {/* Canvas/Graph Area */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-4">
        <div className="text-slate-500 text-center">
            <p>Graph Area Placeholder</p>
            <p className="text-sm">Function: {equations.map(e => e.value).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
