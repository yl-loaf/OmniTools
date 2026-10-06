import React, { useState } from 'react';
import { BookOpen, Search, GitBranch, Globe, Sparkles } from 'lucide-react';

interface EtymologyNode {
  word: string;
  language: string;
  period: string;
  meaning: string;
  desc: string;
  children?: EtymologyNode[];
}

const ETYMOLOGY_DATABASE: Record<string, EtymologyNode> = {
  democracy: {
    word: 'Democracy',
    language: 'Modern English',
    period: '16th Century',
    meaning: 'Government by the people',
    desc: 'Derived from French démocratie, via Late Latin democratia.',
    children: [
      {
        word: 'Demokratia',
        language: 'Ancient Greek',
        period: '5th Century BCE',
        meaning: 'Popular government',
        desc: 'Composed of demos (people, district) + kratos (power, rule).',
        children: [
          {
            word: 'Demos',
            language: 'Proto-Indo-European',
            period: 'PIE Root',
            meaning: 'Division of land, people',
            desc: 'Root meaning a district or tract of land, later applied to the populace inhabiting it.'
          },
          {
            word: 'Kratos',
            language: 'Proto-Indo-European',
            period: 'PIE Root',
            meaning: 'Strength, power',
            desc: 'Root denoting physical strength, dominion, or sovereign power.'
          }
        ]
      }
    ]
  },
  technology: {
    word: 'Technology',
    language: 'Modern English',
    period: '17th Century',
    meaning: 'Discourse or treatise on an art or craft',
    desc: 'Originally coined to mean systematic treatment of grammar or applied arts.',
    children: [
      {
        word: 'Technologia',
        language: 'New Latin / Greek',
        period: '16th Century',
        meaning: 'Systematic treatment',
        desc: 'From techne (art, craft, skill) + logia (branch of learning, speech).',
        children: [
          {
            word: 'Techne',
            language: 'Ancient Greek',
            period: 'Classical Era',
            meaning: 'Art, skill, craft',
            desc: 'Denoting craftsmanship, art, or a method/system of making.'
          },
          {
            word: 'Logia',
            language: 'Ancient Greek',
            period: 'Classical Era',
            meaning: 'Speaking, study',
            desc: 'From logos (word, reason, principle).'
          }
        ]
      }
    ]
  },
  algorithm: {
    word: 'Algorithm',
    language: 'Modern English',
    period: '17th Century',
    meaning: 'Process or set of rules to be followed',
    desc: 'Altered by pseudo-etymological association with Greek arithmos (number).',
    children: [
      {
        word: 'Algorismus',
        language: 'Medieval Latin',
        period: '13th Century',
        meaning: 'System of decimal calculation',
        desc: 'Latinized corruption of the name of the 9th-century Persian mathematician al-Khwarizmi.',
        children: [
          {
            word: 'Al-Khwarizmi',
            language: 'Arabic',
            period: '9th Century CE',
            meaning: 'Native of Khwarazm',
            desc: 'Surname of Muhammad ibn Musa al-Khwarizmi, polymath who introduced Hindu-Arabic numerals to the West.'
          }
        ]
      }
    ]
  }
};

export function EtymologyTreeVisualizer() {
  const [selectedKey, setSelectedKey] = useState<string>('democracy');
  const [searchTerm, setSearchTerm] = useState('');

  const currentRoot = ETYMOLOGY_DATABASE[selectedKey] || ETYMOLOGY_DATABASE['democracy'];

  const filteredKeys = Object.keys(ETIMOLOGY_DATABASE).filter((k) =>
    k.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ETIMOLOGY_DATABASE[k].word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              Lexicon Etymology & Root Word Tree Visualizer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Trace the historical origins, ancestral roots, and semantic shifts of words across ancient languages through dynamic family trees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Featured Words</span>
            {filteredKeys.map((key) => {
              const item = ETIMOLOGY_DATABASE[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedKey === key
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{item.word}</div>
                    <div className="text-xs text-slate-400">{item.meaning}</div>
                  </div>
                  <GitBranch className="w-4 h-4 text-purple-400" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" /> Etymological Descent Tree: {currentRoot.word}
            </h2>

            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-purple-900/60">
              {/* Root / Modern Word */}
              <div className="relative pl-10">
                <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-950" />
                <div className="bg-slate-900 border border-purple-800/60 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-purple-300">{currentRoot.word}</span>
                    <span className="text-xs px-2 py-0.5 bg-purple-950 border border-purple-800 rounded-md text-purple-200 font-mono">
                      {currentRoot.period} • {currentRoot.language}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 italic">"{currentRoot.meaning}"</div>
                  <p className="text-xs text-slate-400 mt-1">{currentRoot.desc}</p>
                </div>
              </div>

              {/* Children Nodes */}
              {currentRoot.children?.map((child, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-950" />
                  <div className="bg-slate-900 border border-indigo-800/60 p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-indigo-300">{child.word}</span>
                      <span className="text-xs px-2 py-0.5 bg-indigo-950 border border-indigo-800 rounded-md text-indigo-200 font-mono">
                        {child.period} • {child.language}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 italic">"{child.meaning}"</div>
                    <p className="text-xs text-slate-400 mt-1">{child.desc}</p>
                  </div>

                  {/* Grandchildren */}
                  {child.children?.map((grand, gIdx) => (
                    <div key={gIdx} className="relative pl-10 mt-4">
                      <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-teal-950" />
                      <div className="bg-slate-900 border border-teal-800/60 p-4 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-teal-300">{grand.word}</span>
                          <span className="text-xs px-2 py-0.5 bg-teal-950 border border-teal-800 rounded-md text-teal-200 font-mono">
                            {grand.period} • {grand.language}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 italic">"{grand.meaning}"</div>
                        <p className="text-xs text-slate-400 mt-1">{grand.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
