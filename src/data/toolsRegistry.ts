import {
  Calculator,
  Timer,
  Type,
  ArrowRightLeft,
  QrCode,
  FileText,
  Braces,
  Database,
  GitCompare,
  Code,
  ShieldCheck,
  Terminal,
  Clock,
  Keyboard,
  Palette,
  Layers,
  Maximize,
  Globe,
  Image,
  Lock,
  Key,
  FileSpreadsheet,
  Code2,
  Server,
  Gauge,
  DollarSign,
  Waves,
  Heart,
  CloudSun,
  Award,
  Users,
  Box
} from 'lucide-react';
import { TOP_CONVERSION_PERMUTATIONS } from './fileConversions';
import { ThemeConfig, ThemeId } from '../types';

export interface ToolMeta {
  id: string;
  name: string;
  shortLabel: string;
  desc: string;
  icon: any;
  category: 'Developer' | 'Design' | 'Data & Security' | 'Math & Finance' | 'Productivity' | 'Daily Life' | 'File Conversion';
  badge?: string;
}

// Map all top 100 conversion permutations as dedicated tools
const CONVERSION_TOOLS: ToolMeta[] = [
  {
    id: 'file-converter',
    name: 'Universal File Converter Suite (100+ Formats)',
    shortLabel: 'File Converter',
    desc: 'Universal client-side file conversion engine for images, documents, audio, spreadsheets & data',
    icon: ArrowRightLeft,
    category: 'File Conversion',
    badge: '100+ Formats',
  },
  ...TOP_CONVERSION_PERMUTATIONS.map((pair) => ({
    id: pair.id,
    name: pair.name,
    shortLabel: pair.shortLabel,
    desc: pair.desc,
    icon: ArrowRightLeft,
    category: 'File Conversion' as const,
    badge: pair.badge || 'Fast',
  })),
];

export const TOOLS_REGISTRY: ToolMeta[] = [
  // 3D & CAD Previewer
  {
    id: '3d-viewer',
    name: '3D File Previewer & CAD Inspector (STL, OBJ, 3MF)',
    shortLabel: '3D File Previewer',
    desc: 'Interactive WebGL previewer for 3D printing STL, Wavefront OBJ, 3MF, and PLY meshes with wireframes & stats',
    icon: Box,
    category: 'Design',
    badge: '3D / CAD',
  },

  // Daily Life & 30+ Features Suites
  { id: 'health-suite', name: 'Health, Fitness & Tip Calculator Suite', shortLabel: 'Health & Tips', desc: 'Tip splitter, BMI, TDEE calories, hydration & sleep', icon: Heart, category: 'Daily Life', badge: 'New' },
  { id: 'finance-suite', name: 'Finance, Recipe & Savings Suite', shortLabel: 'Finance & Recipe', desc: 'Recipe scaler, road trip fuel, markup & compound growth', icon: DollarSign, category: 'Daily Life', badge: 'New' },
  { id: 'productivity-suite', name: 'Productivity & Meeting Planner Suite', shortLabel: 'Productivity Suite', desc: 'Timezone world clocks, ETA travel, todo matrix & reading time', icon: Clock, category: 'Daily Life', badge: 'New' },
  { id: 'home-suite', name: 'Home, Travel & Packing Suite', shortLabel: 'Home & Travel', desc: 'Parking meter timer, packing volume & weather heat index', icon: CloudSun, category: 'Daily Life', badge: 'New' },
  { id: 'quick-utils-suite', name: 'GPA, Sale Discount & Quote Suite', shortLabel: 'Quick Utils Suite', desc: 'GPA calculator, stacked sale discounts, egg timer & quotes', icon: Award, category: 'Daily Life', badge: 'New' },

  // Developer
  { id: 'markdown', name: 'Markdown Studio & Live Previewer', shortLabel: 'Markdown Studio', desc: 'GFM live preview, table editor & HTML export', icon: FileText, category: 'Developer', badge: 'Popular' },
  { id: 'json-studio', name: 'JSON & TypeScript Studio', shortLabel: 'JSON Studio', desc: 'Format, validate, tree explorer & TS interfaces', icon: Braces, category: 'Developer', badge: 'Essential' },
  { id: 'sql-formatter', name: 'SQL Query Beautifier', shortLabel: 'SQL Formatter', desc: 'Format ANSI, MySQL & Postgres queries', icon: Database, category: 'Developer' },
  { id: 'diff-checker', name: 'Text & Code Diff Inspector', shortLabel: 'Diff Checker', desc: 'Side-by-side line & char diff comparison', icon: GitCompare, category: 'Developer' },
  { id: 'regex-tester', name: 'Regex Lab & Tester', shortLabel: 'Regex Lab', desc: 'Pattern tester, replace & regex presets', icon: Code, category: 'Developer' },
  { id: 'jwt-debugger', name: 'JWT Debugger & Inspector', shortLabel: 'JWT Debugger', desc: 'Decode header, payload claims & timestamps', icon: ShieldCheck, category: 'Developer' },
  { id: 'curl-builder', name: 'cURL & API Code Builder', shortLabel: 'cURL Builder', desc: 'cURL to Fetch, Python & Axios generator', icon: Terminal, category: 'Developer' },
  { id: 'cron-gen', name: 'Cron Expression Scheduler', shortLabel: 'Cron Scheduler', desc: '5-field visual builder & plain English', icon: Clock, category: 'Developer' },
  { id: 'chmod-calc', name: 'Linux chmod Calculator', shortLabel: 'chmod Calculator', desc: 'Numeric octal 755/644 & symbolic perms', icon: Terminal, category: 'Developer' },
  { id: 'keycode-tester', name: 'KeyCode & Event Tester', shortLabel: 'KeyCode Tester', desc: 'Inspect JS key, code, which & modifiers', icon: Keyboard, category: 'Developer' },

  // Design
  { id: 'color-studio', name: 'Color Harmony & Contrast Studio', shortLabel: 'Color Studio', desc: 'Harmonies, WCAG 2.1 contrast & gradients', icon: Palette, category: 'Design', badge: 'Design' },
  { id: 'css-generator', name: 'CSS Glass & Shadow Studio', shortLabel: 'CSS Generator', desc: 'Glassmorphism, multi-shadows & clip paths', icon: Layers, category: 'Design' },
  { id: 'dimension-calc', name: 'Aspect Ratio & DPI Solver', shortLabel: 'Aspect Ratio & DPI', desc: 'Resolution solver, print DPI & video size', icon: Maximize, category: 'Design' },
  { id: 'meta-gen', name: 'SEO & Meta Card Studio', shortLabel: 'Meta Tags / OG', desc: 'OpenGraph, Twitter card & search preview', icon: Globe, category: 'Design' },
  { id: 'svg-optimizer', name: 'SVG Vector Cleaner', shortLabel: 'SVG Cleaner', desc: 'Minify vector paths & generate Data URIs', icon: Image, category: 'Design' },
  { id: 'qr-generator', name: 'QR Code Generator', shortLabel: 'QR Generator', desc: 'Scannable URLs, Wi-Fi & vCards', icon: QrCode, category: 'Design', badge: 'Utility' },
  { id: 'barcode-gen', name: 'Universal Barcode Studio', shortLabel: 'Barcode Studio', desc: 'Code 128 scannable vector barcodes', icon: QrCode, category: 'Design' },

  // Data & Security
  { id: 'crypto-encoder', name: 'Base64 & Hash Crypto Suite', shortLabel: 'Base64 & Hashes', desc: 'Base64 images/text & SHA-256 / SHA-512', icon: Lock, category: 'Data & Security', badge: 'Crypto' },
  { id: 'password-gen', name: 'Password & UUID Generator', shortLabel: 'Password & UUID', desc: 'NIST passwords, passphrases & UUID v4', icon: Key, category: 'Data & Security', badge: 'Security' },
  { id: 'csv-viewer', name: 'CSV Data Grid & JSON Studio', shortLabel: 'CSV Viewer', desc: 'Spreadsheet viewer, search & markdown', icon: FileSpreadsheet, category: 'Data & Security' },
  { id: 'html-entities', name: 'HTML Entity Encoder', shortLabel: 'HTML Entities', desc: 'Escape special symbols & unicode codes', icon: Code2, category: 'Data & Security' },
  { id: 'http-lookup', name: 'HTTP Status Code Lookup', shortLabel: 'HTTP Codes', desc: 'REST API 2xx, 3xx, 4xx, 5xx definitions', icon: Server, category: 'Data & Security' },

  // Math & Finance
  { id: 'calculator', name: 'Omni Scientific Calculator', shortLabel: 'Calculator', desc: 'Trig, exponents, parentheses & memory', icon: Calculator, category: 'Math & Finance', badge: 'Math' },
  { id: 'finance-calc', name: 'Financial & Loan Studio', shortLabel: 'Finance Studio', desc: 'Mortgage amortization & compound growth', icon: DollarSign, category: 'Math & Finance', badge: 'Finance' },
  { id: 'unit-converter', name: 'Universal Unit Converter', shortLabel: 'Unit Converter', desc: 'Convert length, weight, data & speed', icon: ArrowRightLeft, category: 'Math & Finance' },

  // Productivity
  { id: 'speed-test', name: 'Network & Bulk Speed Test', shortLabel: 'Speed Test', desc: 'Download/upload bandwidth & raw bulk data transfer', icon: Gauge, category: 'Productivity', badge: 'New' },
  { id: 'typing-test', name: 'Typing Speed Test (WPM)', shortLabel: 'Typing Test', desc: 'Real-time WPM, accuracy & character metrics', icon: Keyboard, category: 'Productivity', badge: 'New' },
  { id: 'precision-timer', name: 'High-Precision Percentage Timer', shortLabel: 'Precision Timer', desc: 'Timer with dynamic decimal progress bar ticking 10x/sec', icon: Timer, category: 'Productivity', badge: 'New' },
  { id: 'countdown', name: 'Event Countdown Timer', shortLabel: 'Countdown Timer', desc: 'Real-time countdown in mm:dd:hh:mm:ss format', icon: Clock, category: 'Productivity', badge: 'New' },
  { id: 'time-converter', name: 'Time & World Clocks', shortLabel: 'Time & Clocks', desc: 'Unix timestamps & world timezones', icon: Clock, category: 'Productivity' },
  { id: 'timer', name: 'Pomodoro & Lap Timer', shortLabel: 'Pomodoro Timer', desc: 'Focus intervals & lap stopwatch', icon: Timer, category: 'Productivity', badge: 'Focus' },
  { id: 'text-tools', name: 'Text & String Transformation', shortLabel: 'Text Tools', desc: 'Case conversions, word count & diff', icon: Type, category: 'Productivity' },
  { id: 'lorem-gen', name: 'Lorem Ipsum Generator', shortLabel: 'Lorem Ipsum', desc: 'Mock copy paragraphs, words & HTML tags', icon: FileText, category: 'Productivity' },
  { id: 'sound-synth', name: 'Binaural Beats & White Noise', shortLabel: 'Noise & Binaural', desc: 'White/pink noise & theta focus waves', icon: Waves, category: 'Productivity', badge: 'Audio' },
  { id: 'friends-hub', name: 'Friends & Social Network', shortLabel: 'Friends Hub', desc: 'Add friends & view names across contributions', icon: Users, category: 'Productivity', badge: 'Social' },

  // File Conversion Suite & 100+ Permutation Tools
  ...CONVERSION_TOOLS,
];

export const DEFAULT_FAVORITE_IDS = ['3d-viewer', 'file-converter', 'health-suite', 'finance-suite', 'productivity-suite', 'calculator', 'markdown', 'json-studio', 'color-studio', 'password-gen'];

export const THEMES: Record<ThemeId, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBgClass: 'bg-slate-900',
    borderClass: 'border-slate-800',
    accentClass: 'from-blue-600 via-indigo-600 to-purple-600',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bgClass: 'bg-black text-pink-50',
    cardBgClass: 'bg-neutral-950',
    borderClass: 'border-pink-900/60',
    accentClass: 'from-pink-600 via-purple-600 to-cyan-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    bgClass: 'bg-[#021008] text-emerald-50',
    cardBgClass: 'bg-[#041c10]',
    borderClass: 'border-emerald-900/60',
    accentClass: 'from-emerald-600 via-teal-600 to-green-500',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Dark',
    bgClass: 'bg-[#121212] text-zinc-100',
    cardBgClass: 'bg-[#1a1a1a]',
    borderClass: 'border-zinc-800',
    accentClass: 'from-zinc-700 via-zinc-600 to-zinc-500',
  },
};
