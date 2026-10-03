import React, { useState, useEffect } from 'react';
import { ToolRequest } from '../types';
import {
  Search,
  X,
  Calculator,
  Timer,
  Type,
  ArrowRightLeft,
  QrCode,
  MessageSquarePlus,
  Trophy,
  FileText,
  Braces,
  Palette,
  Lock,
  Code,
  Key,
  DollarSign,
  Layers,
  Clock,
  Maximize,
  Database,
  GitCompare,
  Globe,
  Code2,
  FileSpreadsheet,
  ShieldCheck,
  Image,
  Terminal,
  Server,
  Keyboard,
  Waves
} from 'lucide-react';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const staticTools = [
    { id: 'markdown', name: 'Markdown Studio & Previewer', desc: 'GFM live preview, table editor & HTML export', icon: FileText, category: 'Developer' },
    { id: 'json-studio', name: 'JSON & TypeScript Studio', desc: 'Format, validate, tree explorer & TS interfaces', icon: Braces, category: 'Developer' },
    { id: 'sql-formatter', name: 'SQL Query Beautifier', desc: 'Format ANSI, MySQL & Postgres database queries', icon: Database, category: 'Developer' },
    { id: 'diff-checker', name: 'Text & Code Diff Inspector', desc: 'Side-by-side comparison, additions & deletions', icon: GitCompare, category: 'Developer' },
    { id: 'regex-tester', name: 'Regex Lab & Tester', desc: 'Pattern tester, replace studio & preset library', icon: Code, category: 'Developer' },
    { id: 'jwt-debugger', name: 'JWT Debugger & Inspector', desc: 'Decode header, payload claims & timestamps', icon: ShieldCheck, category: 'Developer' },
    { id: 'curl-builder', name: 'cURL & API Code Builder', desc: 'cURL to Fetch, Python & Axios code generator', icon: Terminal, category: 'Developer' },
    { id: 'cron-gen', name: 'Cron Expression Scheduler', desc: '5-field visual builder & plain English translation', icon: Clock, category: 'Developer' },
    { id: 'chmod-calc', name: 'Linux chmod Calculator', desc: 'Numeric octal 755/644 & symbolic permissions', icon: Terminal, category: 'Developer' },
    { id: 'keycode-tester', name: 'KeyCode & Event Tester', desc: 'Inspect JS key, code, which & modifier flags', icon: Keyboard, category: 'Developer' },
    { id: 'color-studio', name: 'Color & Contrast Studio', icon: Palette, desc: 'Harmonies, WCAG 2.1 contrast & gradients', category: 'Design' },
    { id: 'css-generator', name: 'CSS Glass & Shadow Studio', icon: Layers, desc: 'Glassmorphism, multi-shadows & clip paths', category: 'Design' },
    { id: 'dimension-calc', name: 'Aspect Ratio & DPI Solver', icon: Maximize, desc: 'Resolution solver, print sizing & video size', category: 'Design' },
    { id: 'meta-gen', name: 'SEO & Meta Card Studio', icon: Globe, desc: 'OpenGraph, Twitter card & search preview', category: 'Design' },
    { id: 'svg-optimizer', name: 'SVG Vector Cleaner', icon: Image, desc: 'Minify vector paths & generate Data URIs', category: 'Design' },
    { id: 'qr-generator', name: 'QR Code Generator', icon: QrCode, desc: 'Scannable URLs, Wi-Fi & vCards', category: 'Utilities' },
    { id: 'barcode-gen', name: 'Barcode Studio', icon: QrCode, desc: 'Code 128 scannable vector barcodes', category: 'Utilities' },
    { id: 'crypto-encoder', name: 'Base64 & Crypto Hashes', icon: Lock, desc: 'Base64 images/text & SHA-256 / SHA-512', category: 'Security' },
    { id: 'password-gen', name: 'Password & UUID Generator', icon: Key, desc: 'NIST passwords, passphrases & UUID v4', category: 'Security' },
    { id: 'csv-viewer', name: 'CSV Data Grid & JSON', icon: FileSpreadsheet, desc: 'Spreadsheet viewer, search & markdown', category: 'Data' },
    { id: 'html-entities', name: 'HTML Entity Encoder', icon: Code2, desc: 'Escape special symbols & unicode codes', category: 'Data' },
    { id: 'http-lookup', name: 'HTTP Status Lookup', icon: Server, desc: 'REST API 2xx, 3xx, 4xx, 5xx guide', category: 'Developer' },
    { id: 'finance-calc', name: 'Finance & Loan Studio', icon: DollarSign, desc: 'Mortgage amortization & compound interest', category: 'Math' },
    { id: 'calculator', name: 'Omni Scientific Calculator', icon: Calculator, desc: 'Trig, exponents, parentheses & memory', category: 'Math' },
    { id: 'time-converter', name: 'Time & World Clocks', icon: Clock, desc: 'Unix timestamps & world timezones', category: 'Time' },
    { id: 'timer', name: 'Pomodoro & Timer', icon: Timer, desc: 'Focus intervals & lap stopwatch', category: 'Productivity' },
    { id: 'text-tools', name: 'Text & String Tools', icon: Type, desc: 'Case conversions, word count & diff', category: 'Productivity' },
    { id: 'lorem-gen', name: 'Lorem Ipsum Generator', icon: FileText, desc: 'Mock copy paragraphs, words & HTML tags', category: 'Productivity' },
    { id: 'sound-synth', name: 'Binaural & Noise Synth', icon: Waves, desc: 'White/pink noise & theta focus waves', category: 'Productivity' },
    { id: 'unit-converter', name: 'Universal Unit Converter', icon: ArrowRightLeft, desc: 'Convert length, weight, data & speed', category: 'Math' },
    { id: 'request-hub', name: 'Tool Request Hub & Queue', icon: MessageSquarePlus, desc: 'Propose new features & earn points', category: 'Community' },
    { id: 'leaderboard', name: 'Leaderboard & Badges', icon: Trophy, desc: 'Contributor rankings & milestone badges', category: 'Community' },
  ];

  const filteredTools = staticTools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRequests = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name, command, or category..."
            className="w-full bg-transparent text-sm text-white focus:outline-hidden placeholder:text-slate-500"
          />
          <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Static Tools List */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Tools & Utilities ({filteredTools.length})</span>
              <span className="text-[10px] text-slate-500">25+ available</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTab(tool.id);
                      onClose();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left group border border-transparent hover:border-slate-700/60"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-blue-400 group-hover:text-white transition shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white group-hover:text-blue-300 truncate">
                        {tool.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{tool.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Community Requests Match */}
          {filteredRequests.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Community Proposals ({filteredRequests.length})
              </div>
              <div className="space-y-1">
                {filteredRequests.slice(0, 5).map((req) => (
                  <button
                    key={req.id}
                    onClick={() => {
                      onSelectTab('request-hub');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left border border-slate-800/60"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-medium text-purple-300 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{req.description}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase shrink-0">
                      {req.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or click</span>
          <span className="text-[11px] text-slate-500">25+ Utilities Available</span>
        </div>
      </div>
    </div>
  );
};
