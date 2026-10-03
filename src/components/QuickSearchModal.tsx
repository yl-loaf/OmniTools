import React, { useState, useEffect } from 'react';
import { ToolRequest } from '../types';
import { Search, X, Calculator, Timer, Type, ArrowRightLeft, QrCode, MessageSquarePlus, Trophy, ExternalLink } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  requests: ToolRequest[];
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  requests,
}) => {
  const [query, setQuery] = useState('');

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const staticTools = [
    { id: 'calculator', name: 'Omni Scientific Calculator', desc: 'Standard arithmetic, trigonometry & percentage math', icon: Calculator },
    { id: 'timer', name: 'Pomodoro & Multi-Timer', desc: 'Focus timer intervals & lap stopwatch', icon: Timer },
    { id: 'text-tools', name: 'Text & String Utilities', desc: 'Word counter, case formatter & JSON beautifier', icon: Type },
    { id: 'unit-converter', name: 'Universal Unit Converter', desc: 'Convert length, weight, data storage & speed', icon: ArrowRightLeft },
    { id: 'qr-generator', name: 'QR Code Generator', desc: 'Generate scannable QR codes for URLs & Wi-Fi', icon: QrCode },
    { id: 'request-hub', name: 'Tool Request Hub & Queue', desc: 'Propose new features and earn Contribution Points', icon: MessageSquarePlus },
    { id: 'leaderboard', name: 'Leaderboard & Milestone Badges', desc: 'Community contributor rankings & tiered badges', icon: Trophy },
  ];

  const filteredTools = staticTools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRequests = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, calculators, or feature requests (press Esc to close)..."
            className="w-full bg-transparent text-sm text-white focus:outline-hidden placeholder:text-slate-500 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1.5">
              Built-in Tools ({filteredTools.length})
            </div>
            {filteredTools.length === 0 ? (
              <div className="text-xs text-slate-500 px-3 py-2">No tools match your query</div>
            ) : (
              <div className="space-y-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTab(tool.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-950/80 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{tool.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        Launch
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {filteredRequests.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                Feature Request Queue ({filteredRequests.length})
              </div>
              <div className="space-y-1">
                {filteredRequests.slice(0, 5).map((req) => (
                  <button
                    key={req.id}
                    onClick={() => {
                      onSelectTab('request-hub');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{req.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">{req.description}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                      req.status === 'completed' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">Esc</kbd> to close anytime</span>
          <span>OmniTools Command Palette</span>
        </div>
      </div>
    </div>
  );
};
