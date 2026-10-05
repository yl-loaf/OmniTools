import React, { useState, useMemo } from 'react';
import { ToolRequest, UserProfile, RequestStatus, RequestCategory, ADMIN_EMAIL } from '../types';
import {
  MessageSquarePlus,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Check,
  Clock,
  AlertTriangle,
  Send,
  Filter,
  Search,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  FolderSync
} from 'lucide-react';
import { fetchRequestsFromGoogleSheet, syncPromptToGoogleSheet } from '../services/googleSheets';
import { GoogleGenAI } from '@google/genai';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

interface ToolRequestHubProps {
  requests: ToolRequest[];
  currentUser: UserProfile | null;
  isGuest: boolean;
  onSubmitRequest: (req: Omit<ToolRequest, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voters' | 'pointsAwarded'>) => void;
  onUpdateStatus: (requestId: string, status: RequestStatus, version?: string, rejectionReason?: string) => void;
  onVote: (requestId: string, delta: number) => void;
  onOpenAuth: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onImportRequests?: (reqs: ToolRequest[]) => void;
  setActiveTab?: (tab: string) => void;
}

export const ToolRequestHub: React.FC<ToolRequestHubProps> = ({
  requests,
  currentUser,
  isGuest,
  onSubmitRequest,
  onUpdateStatus,
  onVote,
  onOpenAuth,
  isAdminMode,
  onToggleAdminMode,
  onImportRequests,
  setActiveTab,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RequestCategory>('productivity');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMyIdeas, setOnlyMyIdeas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  // Admin ship modal state
  const [shippingReqId, setShippingReqId] = useState<string | null>(null);
  const [shippedVersion, setShippedVersion] = useState('v1.1.0');

  // Admin reject modal state
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Duplicate or inappropriate submission');

  const isOwnerAdmin = currentUser?.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const GEMINI_IDEA_BANK = [
    {
      title: "SVG Path Morphing Studio",
      description: "Visualize and interpolate between two SVG path strings with real-time Bézier curve animation controls for UI designers.",
      category: "developer" as RequestCategory
    },
    {
      title: "Regex Visualizer & AST Tree",
      description: "Generate an interactive syntax tree and state machine diagram from any regular expression in real-time.",
      category: "developer" as RequestCategory
    },
    {
      title: "Tailwind Gradient Mesh Generator",
      description: "Create stunning multi-color fluid gradient meshes with customizable blur and mesh nodes, exporting instant clean Tailwind CSS classes.",
      category: "conversion" as RequestCategory
    },
    {
      title: "JSON to TypeScript Interface Gen",
      description: "Instantly paste any JSON payload or API response and generate strict TypeScript interfaces and Zod validation schemas with one click.",
      category: "developer" as RequestCategory
    },
    {
      title: "Pomodoro Ambient Soundscape Mixer",
      description: "Mix customizable binaural brown noise, fireplace crackles, and coffee shop ambiance while running your focus sprints.",
      category: "productivity" as RequestCategory
    },
    {
      title: "SQL Query Visual Explain",
      description: "Paste SQL EXPLAIN JSON plans and view an interactive visual bottleneck graph highlighting missing indexes and slow joins.",
      category: "math" as RequestCategory
    },
    {
      title: "CSS Grid Visual Template Builder",
      description: "Interactive drag-and-drop CSS Grid area layout generator with instant production-ready CSS and HTML code export.",
      category: "utility" as RequestCategory
    },
    {
      title: "JWT Claims & Permissions Auditor",
      description: "Decode JWT tokens, inspect expiration timers, and audit OAuth scope permissions with cryptographic signature verification helper.",
      category: "developer" as RequestCategory
    }
  ];

  const handleGeminiSuggest = async () => {
    setIsGeneratingIdea(true);
    try {
      const apiKey = localStorage.getItem('omnitools_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert('Please configure your Gemini API key in Workspace Settings (⚙️ Settings -> Gemini AI) to use live AI idea generation.');
        setIsGeneratingIdea(false);
        const availableIdeaBank = GEMINI_IDEA_BANK.filter(idea => {
          const titleLower = idea.title.toLowerCase();
          const existsInQueue = requests.some(r => r.title.toLowerCase() === titleLower || titleLower.includes(r.title.toLowerCase()));
          const existsInRegistry = TOOLS_REGISTRY.some(t => t.name.toLowerCase() === titleLower || titleLower.includes(t.name.toLowerCase()));
          return !existsInQueue && !existsInRegistry;
        });
        const ideaPool = availableIdeaBank.length > 0 ? availableIdeaBank : GEMINI_IDEA_BANK;
        const randomIdea = ideaPool[Math.floor(Math.random() * ideaPool.length)];
        setTitle(randomIdea.title);
        setDescription(randomIdea.description);
        setCategory(randomIdea.category);
        return;
      }

      const model = localStorage.getItem('omnitools_gemini_model') || 'gemini-3.5-flash-lite';
      const ai = new GoogleGenAI({ apiKey });
      
      const existingToolsSummary = TOOLS_REGISTRY.map(t => `- ${t.name}: ${t.desc}`).join('\n');
      const queueSummary = requests && requests.length > 0
        ? requests.map(r => `- [${r.status.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')
        : 'None';

      const promptText = `Here is a list of existing tools already built into our web utility suite:
${existingToolsSummary}

Here is a list of tool suggestions and feature requests currently in the community queue (do NOT repeat, overlap with, or recreate any of these queued ideas):
${queueSummary}

Generate a creative, highly useful web developer tool or browser utility idea that is COMPLETELY UNIQUE and different from any of the existing tools and queued feature requests listed above. Avoid any duplication or redundancy. Return ONLY valid JSON with keys: title (string, short punchy name), description (string, 2 sentences explaining its value), category (one of: productivity, math, text, conversion, developer, utility, other).`;

      let res;
      try {
        res = await ai.models.generateContent({
          model,
          contents: promptText,
        });
      } catch (firstErr) {
        // Fallback model retry if primary model name fails
        console.warn('Primary Gemini model failed, retrying with gemini-3.5-flash-lite:', firstErr);
        res = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: promptText,
        });
      }

      const text = res.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title && parsed.description) {
          setTitle(parsed.title);
          setDescription(parsed.description);
          if (parsed.category) setCategory(parsed.category as RequestCategory);
          setIsGeneratingIdea(false);
          return;
        }
      }
      throw new Error('Could not parse JSON from Gemini response.');
    } catch (err: unknown) {
      console.error('Gemini AI Generation Error:', err);
      const errMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Gemini AI generation failed: ${errMessage}\n\nFalling back to idea bank template.`);
      
      const availableIdeaBank = GEMINI_IDEA_BANK.filter(idea => {
        const titleLower = idea.title.toLowerCase();
        const existsInQueue = requests.some(r => r.title.toLowerCase() === titleLower || titleLower.includes(r.title.toLowerCase()));
        const existsInRegistry = TOOLS_REGISTRY.some(t => t.name.toLowerCase() === titleLower || titleLower.includes(t.name.toLowerCase()));
        return !existsInQueue && !existsInRegistry;
      });
      const ideaPool = availableIdeaBank.length > 0 ? availableIdeaBank : GEMINI_IDEA_BANK;
      const randomIdea = ideaPool[Math.floor(Math.random() * ideaPool.length)];
      setTitle(randomIdea.title);
      setDescription(randomIdea.description);
      setCategory(randomIdea.category);
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const authorId = currentUser ? currentUser.uid : `guest-${Date.now()}`;
    const authorName = currentUser ? currentUser.displayName : 'Guest Contributor';

    onSubmitRequest({
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'pending',
      authorId,
      authorName,
      authorPhoto: currentUser?.photoURL,
      isGuest: isGuest || !currentUser,
    });

    setTitle('');
    setDescription('');
    setIsSubmitting(false);
  };

  const handleSyncSheet = async () => {
    setIsSyncingSheet(true);
    setSyncStatusMsg(null);
    try {
      const items = await fetchRequestsFromGoogleSheet();
      if (items.length > 0) {
        if (onImportRequests) {
          onImportRequests(items);
        }
        setSyncStatusMsg(`Successfully extracted ${items.length} requests from your Google Sheet!`);
      } else {
        setSyncStatusMsg('Connected to Google Sheet, but no rows were found.');
      }
    } catch {
      setSyncStatusMsg('Failed to sync. Please ensure Google Apps Script is deployed as a Web App.');
    } finally {
      setIsSyncingSheet(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      const matchAuthor = !onlyMyIdeas || (currentUser && r.authorId === currentUser.uid);
      return matchSearch && matchStatus && matchCategory && matchAuthor;
    });
  }, [requests, searchQuery, statusFilter, categoryFilter, onlyMyIdeas, currentUser]);

  const myFriendIds = currentUser?.friendIds || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-extrabold text-white">Community Tool Request & Feature Queue</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Request custom browser utilities or widgets to be built directly onto this website.
            Public users can upvote and downvote ideas. You earn <strong className="text-emerald-400">+2 CP</strong> when your idea is built!
          </p>
          {syncStatusMsg && (
            <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('auto-gemini-bot')}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-700/80 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-900/20"
              title="Buy and configure Auto Gemini Tool Idea Bot automation for 20 CP"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>🤖 Auto Gemini Bot (20 CP)</span>
            </button>
          )}

          <button
            onClick={handleSyncSheet}
            disabled={isSyncingSheet}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            title="Sync requests from connected Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncingSheet ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheet ? 'Syncing Sheet...' : 'Sync Google Sheet'}</span>
          </button>

          {isOwnerAdmin && (
            <button
              onClick={onToggleAdminMode}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isAdminMode
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdminMode ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Submit New Feature Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Propose a New Tool</span>
            </h3>

            {!currentUser ? (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3">
                <p className="text-xs text-slate-400">
                  Sign in with Google to earn contribution points (<strong className="text-emerald-400">+2 CP</strong>) and save your submitted ideas.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
                >
                  Sign In with Google
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={handleGeminiSuggest}
                  disabled={isGeneratingIdea}
                  className="w-full py-2 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-blue-900/60 hover:from-purple-800/80 hover:to-blue-800/80 text-purple-200 border border-purple-700/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  title="Use Gemini AI to instantly generate a brilliant tool idea"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${isGeneratingIdea ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingIdea ? 'Gemini is thinking...' : '✨ Ask Gemini to Suggest Idea'}</span>
                </button>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tool Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SVG Icon Sprite Sheet Generator"
                    maxLength={100}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RequestCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="productivity">Productivity & Time</option>
                    <option value="math">Math & Finance</option>
                    <option value="text">Text & String</option>
                    <option value="conversion">Units & Conversion</option>
                    <option value="developer">Developer & Code</option>
                    <option value="utility">General Utility</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Detailed Description & Specifications</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how the tool should work, inputs required, and expected outputs..."
                    maxLength={1500}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-purple-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Public Queue</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Search, Filters & Request Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requested features or tags..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Category Dropdown Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="productivity">Productivity & Time</option>
                  <option value="math">Math & Finance</option>
                  <option value="text">Text & String</option>
                  <option value="conversion">Units & Conversion</option>
                  <option value="developer">Developer & Code</option>
                  <option value="utility">General Utility</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {currentUser && (
                <button
                  onClick={() => setOnlyMyIdeas(!onlyMyIdeas)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 border ${
                    onlyMyIdeas
                      ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{onlyMyIdeas ? 'Showing My Ideas Only' : 'Filter: My Ideas Only'}</span>
                </button>
              )}
            </div>

            {/* Quick status tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'pending', label: 'Pending Review' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Shipped (+2 CP)' },
                { id: 'rejected', label: 'Rejected (-5 CP)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Item Cards */}
          {filteredRequests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <MessageSquarePlus className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <h4 className="text-sm font-semibold text-slate-300">No requests found in this view</h4>
              <p className="text-xs text-slate-500 mt-1">Be the first to submit a new feature proposal!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isAuthor = currentUser && req.authorId === currentUser.uid;
                const isFriend = myFriendIds.includes(req.authorId);
                const displayName = isAuthor ? 'Your Submitted Idea' : isFriend ? req.authorName : 'Community Contributor';

                return (
                  <div
                    key={req.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                            {req.category}
                          </span>

                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            req.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : req.status === 'in_progress'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : req.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-bold text-white leading-snug flex items-center gap-2">
                            <span>{req.title}</span>
                            {req.status === 'completed' && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full flex items-center gap-1 font-mono">
                                <Check className="w-3 h-3" /> Live in Website
                              </span>
                            )}
                          </h4>
                        </div>
                        
                        {/* For completed tools, only show the feature name for public users (hide raw details) */}
                        {req.status === 'completed' ? (
                          isAdminMode || isAuthor ? (
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed whitespace-pre-line bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 font-mono">
                              <span className="text-slate-500 text-[10px] block uppercase font-bold mb-0.5">Original Proposal Details:</span>
                              {req.description}
                            </p>
                          ) : null
                        ) : (
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                            {req.description}
                          </p>
                        )}
                      </div>

                      {/* Vote Count & Action */}
                      <div className="flex flex-col items-center bg-slate-950 border border-slate-800 rounded-xl p-2 min-w-[64px] shrink-0">
                        <button
                          onClick={() => onVote(req.id, 1)}
                          className="p-1 hover:text-emerald-400 text-slate-400 transition"
                          title="Upvote"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-mono font-black text-white my-0.5">{req.votes}</span>
                        <button
                          onClick={() => onVote(req.id, -1)}
                          className="p-1 hover:text-rose-400 text-slate-400 transition"
                          title="Downvote"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Rejection Notice */}
                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-900/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Rejection Notice (-5 CP Penalty):</strong> {req.rejectionReason}
                        </div>
                      </div>
                    )}

                    {/* Footer Row - Show name if friend or author */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-300">{displayName}</span>
                        {isFriend && !isAuthor && (
                          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded-xs">
                            Friend
                          </span>
                        )}
                        {isAuthor && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded-xs font-semibold">
                            Your Idea
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Submitted on {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
