import React, { useState } from 'react';

export default function RegexPlayground() {
  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">RegEx Playground & Visualizer</h2>
      <input className="w-full p-2 border" placeholder="Enter Regex..." value={regex} onChange={(e) => setRegex(e.target.value)} />
      <textarea className="w-full p-2 border" placeholder="Enter Test Text..." value={text} onChange={(e) => setText(e.target.value)} />
      <div>Visualizer placeholder: Regex '{regex}' testing against '{text}'</div>
    </div>
  );
}
