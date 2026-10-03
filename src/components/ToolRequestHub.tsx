import React, { useState } from 'react';
import { ToolRequest, UserProfile, RequestCategory, RequestStatus, CompletionStats } from '../types';
import { APP_VERSION } from '../../version.js';
import {
  syncPromptToGoogleSheet,
  formatRequestsForSheetsClipboard,
  downloadRequestsCSV,
  getSavedSheetsWebhookUrl,
  saveSheetsWebhookUrl,
  GOOGLE_APPS_SCRIPT_TEMPLATE
} from '../services/googleSheets';
import {
  MessageSquarePlus,
  Send,
  Filter,
  CheckCircle2,
  Clock,
  Code2,
  AlertTriangle,
  ThumbsUp,
  FileSpreadsheet,
  Copy,
  Download,
  Search,
  Sparkles,
  Tag,
  Check,
  Ban,
  Wrench,
  CheckSquare
} from 'lucide-react';

interface ToolRequestHubProps {
  requests: ToolRequest[];
  currentUser: UserProfile | null;
  isGuest: boolean;
  onSubmitRequest: (newReq: Omit<ToolRequest, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voters' | 'pointsAwarded'>) => void;
  onUpdateStatus: (requestId: string, status: RequestStatus, version?: string, rejectionReason?: string) => void;
  onVote: (requestId: string) => void;
  onOpenAuth: () => void;
}

export const ToolRequestHub: React.FC<ToolRequestHubProps> = ({
  requests,
  currentUser,
  isGuest,
  onSubmitRequest,
  onUpdateStatus,
  onVote,
  onOpenAuth,
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RequestCategory>('productivity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queue Filters
  const [onlyMyIdeas, setOnlyMyIdeas] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sheets Sync UI state
  const [showSheetsConfig, setShowSheetsConfig] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(getSavedSheetsWebhookUrl());
  const [copySuccess, setCopySuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Rejection modal
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Inappropriate or spam proposal');

  // Calculate completion statistics
  const stats: CompletionStats = {
    total: requests.length,
    completed: requests.filter((r) => r.status === 'completed').length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in_progress').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    completionRate: requests.length > 0
      ? Math.round((requests.filter((r) => r.status === 'completed').length / requests.length) * 100)
      : 0,
    totalPointsDistributed: requests.reduce((acc, curr) => acc + (curr.pointsAwarded || 0), 0),
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (onlyMyIdeas && currentUser) {
      if (req.authorId !== currentUser.uid) return false;
    }
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.authorName.toLowerCase().includes(q) ||
        (req.completedVersion && req.completedVersion.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const authorName = currentUser?.displayName || (isGuest ? 'Guest User' : 'Anonymous');
    const authorId = currentUser?.uid || `guest-${Date.now().toString().slice(-4)}`;

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

  const handleCopyForSheets = () => {
    const tsv = formatRequestsForSheetsClipboard(requests);
    navigator.clipboard.writeText(tsv);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSaveWebhook = () => {
    saveSheetsWebhookUrl(webhookUrl);
    setSyncStatus('Webhook saved! Prompts will sync automatically with Google Sheets.');
    setTimeout(() => setSyncStatus(null), 3000);
  };

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
            Every generated feature is published live. You earn <strong className="text-emerald-400">+2 CP</strong> when your idea is built, and lose <strong className="text-rose-400">-5 CP</strong> if rejected for spam/inappropriate content.
          </p>
        </div>
      </div>

      {/* Completion Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Ideas</span>
          <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
          <span className="text-[10px] text-slate-500">Community pool</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Shipped in App</span>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.completed}</div>
          <span className="text-[10px] text-emerald-500/80">v{APP_VERSION} active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">In Progress</span>
          <div className="text-xl font-bold text-cyan-400 mt-0.5">{stats.inProgress}</div>
          <span className="text-[10px] text-cyan-500/80">Under development</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Pending Queue</span>
          <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.pending}</div>
          <span className="text-[10px] text-amber-500/80">Awaiting triage</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Completion Rate</span>
          <div className="text-xl font-bold text-purple-400 mt-0.5">{stats.completionRate}%</div>
          <span className="text-[10px] text-purple-500/80">Shipped velocity</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">CP Distributed</span>
          <div className="text-xl font-bold text-amber-300 mt-0.5">{stats.totalPointsDistributed} CP</div>
          <span className="text-[10px] text-amber-500/80">+2 per tool</span>
        </div>
      </div>

      {/* Main Layout: Form + Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Request a Custom Tool
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Have a tool in mind? Submit your idea! Features are built publicly into the app.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tool Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. JSON Diff & Schema Validator"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RequestCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
                >
                  <option value="productivity">Productivity & Time</option>
                  <option value="math">Math & Financial Calculations</option>
                  <option value="text">Text & String Processing</option>
                  <option value="conversion">Units & Data Conversions</option>
                  <option value="developer">Developer & Code Tools</option>
                  <option value="utility">General Everyday Utility</option>
                  <option value="other">Other Community Concept</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  User Prompt & Requirements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain inputs, outputs, calculation steps, and how you want the tool to work..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Guest vs Member Callout */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
                {currentUser && !isGuest ? (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Logged in as <strong>{currentUser.displayName}</strong>. You earn +2 CP if generated!</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-amber-400 font-semibold">Submitting as Guest.</span>{' '}
                    Points will only be credited to registered accounts.{' '}
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-blue-400 underline font-semibold hover:text-blue-300 ml-1"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Public Queue</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Queue & Tracking */}
        <div className="lg:col-span-2 space-y-4">
          {/* Queue Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
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

              {/* Requirement: Only show user's idea in a queue for easy tracking and prioritization */}
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
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {onlyMyIdeas
                  ? "You haven't submitted any ideas yet under this filter. Create one on the left!"
                  : 'Try modifying your search or filter settings.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isAuthor = currentUser?.uid === req.authorId;
                const statusStyles = {
                  completed: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50',
                  in_progress: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/50',
                  pending: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
                  rejected: 'bg-rose-950/70 text-rose-300 border-rose-700/50',
                }[req.status];

                return (
                  <div
                    key={req.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg transition space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusStyles}`}>
                          {req.status === 'completed' ? `Shipped (${req.completedVersion || 'Live'})` : req.status.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 capitalize">
                          {req.category}
                        </span>
                        {req.pointsAwarded !== 0 && (
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            req.pointsAwarded > 0
                              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-900/40 text-rose-400 border border-rose-800'
                          }`}>
                            {req.pointsAwarded > 0 ? `+${req.pointsAwarded} CP` : `${req.pointsAwarded} CP`}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">{req.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                        {req.description}
                      </p>
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

                    {/* Footer Row */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-300">{req.authorName}</span>
                        {req.isGuest ? (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-xs">Guest</span>
                        ) : (
                          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/40 px-1.5 py-0.2 rounded-xs">
                            Member
                          </span>
                        )}
                        {isAuthor && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded-xs font-semibold">
                            Your Idea
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Upvote Button */}
                        <button
                          onClick={() => onVote(req.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{req.votes || 0}</span>
                        </button>

                        {/* Maintainer Actions */}
                        <div className="flex items-center gap-1">
                          {req.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateStatus(req.id, 'completed', `v${APP_VERSION}`)}
                              title={`Mark Done & Ship in website version v${APP_VERSION} (+2 CP)`}
                              className="px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ship (+2 CP)</span>
                            </button>
                          )}

                          {req.status !== 'in_progress' && req.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateStatus(req.id, 'in_progress')}
                              title="Mark as in development"
                              className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-medium transition"
                            >
                              In Dev
                            </button>
                          )}

                          {req.status !== 'rejected' && (
                            <button
                              onClick={() => setRejectingReqId(req.id)}
                              title="Reject for inappropriate purposes / spam (-5 CP penalty)"
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-medium transition flex items-center gap-1"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectingReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Rejection (-5 CP Penalty)</span>
            </div>
            <p className="text-xs text-slate-300">
              Rejecting this request for spam or inappropriate purposes will deduct <strong>5 Contribution Points</strong> from the author (if logged in) to maintain community quality.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Reason for Rejection</label>
              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingReqId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(rejectingReqId, 'rejected', undefined, rejectionReason);
                  setRejectingReqId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-600/30"
              >
                Confirm Reject & Penalize 5 CP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
