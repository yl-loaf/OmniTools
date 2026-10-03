import React, { useState, useMemo } from 'react';
import { FileText, Copy, Check, Sparkles, RefreshCw, Layers } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim'
];

export const LoremIpsumGenerator: React.FC = () => {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatedText = useMemo(() => {
    const generateSentence = (isFirst: boolean) => {
      const len = Math.floor(Math.random() * 8 + 6);
      const words: string[] = [];

      if (isFirst && startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }

      while (words.length < len) {
        const w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        words.push(w);
      }

      const sentence = words.join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };

    if (type === 'words') {
      const words: string[] = [];
      if (startWithLorem) words.push('Lorem', 'ipsum', 'dolor');
      while (words.length < count) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      return words.slice(0, count).join(' ');
    }

    if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(i === 0));
      }
      return sentences.join(' ');
    }

    // Paragraphs
    const paras: string[] = [];
    for (let p = 0; p < count; p++) {
      const sentenceCount = Math.floor(Math.random() * 3 + 4);
      const sentences: string[] = [];
      for (let s = 0; s < sentenceCount; s++) {
        sentences.push(generateSentence(p === 0 && s === 0));
      }
      paras.push(sentences.join(' '));
    }

    if (asHtml) {
      return paras.map(p => `<p>${p}</p>`).join('\n\n');
    }

    return paras.join('\n\n');
  }, [type, count, startWithLorem, asHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Lorem Ipsum & Mock Copy Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold">
                Typography Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate placeholder paragraphs, sentences, words, and formatted HTML tags.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Generate Unit</label>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-1 rounded-lg capitalize font-semibold transition ${
                    type === t ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Quantity</span>
              <span className="font-mono text-amber-400 font-bold">{count} {type}</span>
            </div>
            <input
              type="range"
              min="1"
              max={type === 'words' ? 100 : 15}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded text-amber-500"
            />
            <span className="text-slate-200">Start with "Lorem ipsum..."</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={asHtml}
              onChange={(e) => setAsHtml(e.target.checked)}
              className="rounded text-amber-500"
            />
            <span className="text-slate-200">Wrap with &lt;p&gt; tags</span>
          </label>
        </div>

        {/* Output Box */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Generated Placeholder Output</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {generatedText.split(/\s+/).length} words • {generatedText.length} characters
            </span>
          </div>
          <textarea
            readOnly
            value={generatedText}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-serif text-sm text-slate-200 focus:outline-hidden leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
};
