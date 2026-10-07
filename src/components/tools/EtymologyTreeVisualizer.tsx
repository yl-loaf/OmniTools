import React, { useState } from 'react';
import { Bookmark, Search, Sparkles, GitBranch, Globe } from 'lucide-react';

export const EtymologyTreeVisualizer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Algorithm');
  const [etymologyData, setEtymologyData] = useState({
    word: 'Algorithm',
    origin: 'Arabic / Persian (9th Century)',
    root: 'Al-Khwarizmi (Name of Persian mathematician Muhammad ibn Musa al-Khwarizmi)',
    evolution: [
      { era: '9th Century (Persian)', text: 'Al-Khwarizmi ("native of Khwarizm") - treatise on Hindu-Arabic numerals' },
      { era: '13th Century (Medieval Latin)', text: 'Algorismus - arithmetic using Hindu-Arabic numerals' },
      { era: '17th Century (English)', text: 'Algorism / Algorithm - rule of procedure in mathematics' },
      { era: '20th Century (Modern Computer Science)', text: 'Algorithm - finite sequence of rigorous instructions for computation' },
    ],
    semanticShift: 'Shifted from the name of a mathematician to decimal calculation rules, and finally to general computational logic procedures in modern digital systems.'
  });

  const sampleWords: Record<string, any> = {
    Algorithm: {
      word: 'Algorithm',
      origin: 'Arabic / Persian (9th Century)',
      root: 'Al-Khwarizmi (Mathematician)',
      evolution: [
        { era: '9th Century (Persian)', text: 'Al-Khwarizmi - mathematician from Khwarizm' },
        { era: '13th Century (Latin)', text: 'Algorismus - arithmetic procedures' },
        { era: 'Modern Computing', text: 'Step-by-step computational instruction set' },
      ],
      semanticShift: 'From a mathematician’s toponymic surname to automated digital logic instructions.'
    },
    Zenith: {
      word: 'Zenith',
      origin: 'Arabic (Medieval)',
      root: 'Samt ar-ra\'s (Path above the head)',
      evolution: [
        { era: 'Medieval Arabic', text: 'Samt - path or direction' },
        { era: '14th Century Old Spanish / Latin', text: 'Zenit - highest point in the sky' },
        { era: 'Modern English', text: 'Zenith - peak or acme of success or power' },
      ],
      semanticShift: 'Mistranslation of Arabic astronomical texts led to "zenith" representing the apex of celestial objects.'
    },
    Robot: {
      word: 'Robot',
      origin: 'Czech (1920)',
      root: 'Robota (forced labor / corvée)',
      evolution: [
        { era: 'Old Church Slavonic', text: 'Rabota - servitude, hard labor' },
        { era: '1920 (Karel Čapek play R.U.R.)', text: 'Robot - artificial biological workers' },
        { era: 'Modern Engineering', text: 'Programmable autonomous mechanical machine' },
      ],
      semanticShift: 'From feudal forced peasant labor to science-fiction androids and automated mechanical systems.'
    }
  };

  const handleSelectWord = (w: string) => {
    setSearchTerm(w);
    if (sampleWords[w]) {
      setEtymologyData(sampleWords[w]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h1 className="text-2xl font-bold text-slate-100">Lexicon Etymology & Semantic Tree Visualizer</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Trace historical origins, morphological roots, and semantic shifts of global vocabulary across centuries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(sampleWords).map((w) => (
              <button
                key={w}
                onClick={() => handleSelectWord(w)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  searchTerm === w ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Summary Card */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Etymological Profile
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400">Target Word</span>
                <div className="text-xl font-bold text-cyan-400">{etymologyData.word}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Primary Origin</span>
                <div className="text-sm font-semibold text-slate-200">{etymologyData.origin}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Morphological Root</span>
                <div className="text-sm text-slate-300">{etymologyData.root}</div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Semantic Shift Summary</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{etymologyData.semanticShift}</p>
              </div>
            </div>
          </div>

          {/* Timeline Tree */}
          <div className="lg:col-span-2 space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-cyan-400" /> Historical Lineage & Evolution Tree
            </h3>

            <div className="space-y-6 relative pl-6 border-l-2 border-cyan-500/30">
              {etymologyData.evolution.map((ev, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border-4 border-slate-950" />
                  <div className="text-xs font-bold text-cyan-400">{ev.era}</div>
                  <div className="text-sm text-slate-200 mt-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    {ev.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
