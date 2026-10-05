import React, { useState, useMemo } from 'react';
import {
  ToolRequest,
  UserProfile,
  RequestStatus,
  RequestCategory,
  ADMIN_EMAIL,
  isAdminEmail,
  ShippedToolRecord,
  ToolIssue
} from '../types';
import { APP_VERSION } from '../../version.js';
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Lock,
  LogIn,
  Send,
  Calendar,
  Layers,
  Archive,
  RefreshCw,
  Bug,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: UserProfile | null;
  requests: ToolRequest[];
  issues: ToolIssue[];
  users: UserProfile[];
  onUpdateStatus: (requestId: string, status: RequestStatus, version?: string, rejectionReason?: string) => void;
  onResolveIssue: (issueId: string, fixNotes: string) => void;
  onPurgeOldRequests: () => Promise<number>;
  onDeleteRequest: (requestId: string) => Promise<void>;
  onLoginGoogle: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  requests,
  issues,
  users,
  onUpdateStatus,
  onResolveIssue,
  onPurgeOldRequests,
  onDeleteRequest,
  onLoginGoogle,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'requests' | 'bugs'>('requests');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccessMsg, setPurgeSuccessMsg] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Duplicate or inappropriate submission');

  // Fix bug resolution modal state
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [fixNotes, setFixNotes] = useState('Bug patched and verified in live build.');

  // Version assignment
  const [customVersion, setCustomVersion] = useState(`v${APP_VERSION}`);
  const [selectedReqForShip, setSelectedReqForShip] = useState<string | null>(null);

  const isAuthorized = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.email && isAdminEmail(currentUser.email)) {
      return true;
    }
    return false;
  }, [currentUser]);

  // Requests older than 7 days that are completed
  const oldShippedRequests = useMemo(() => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return requests.filter((r) => {
      if (r.status !== 'completed') return false;
      const refTime = r.deployedAt ? new Date(r.deployedAt).getTime() : new Date(r.updatedAt).getTime();
      return now - refTime > SEVEN_DAYS_MS;
    });
  }, [requests]);

  // Filtered requests (Sorted oldest to newest by default)
  const filteredRequests = useMemo(() => {
    const list = requests.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [requests, searchQuery, statusFilter]);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((i) =>
      i.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [issues, searchQuery]);

  // Metrics
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending').length;
    const inProgress = requests.filter((r) => r.status === 'in_progress').length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;
    const openBugs = issues.filter((i) => i.status === 'open').length;
    return {
      total: requests.length,
      pending,
      inProgress,
      completed,
      rejected,
      openBugs,
      purgeEligible: oldShippedRequests.length,
    };
  }, [requests, oldShippedRequests, issues]);

  const handleCopyIdeaPrompt = (req: ToolRequest) => {
    const prompt = `SYSTEM INSTRUCTION: First, filter out any inappropriate content or spam. Next, bump up the website version in version.js. Provide description for the tool. Then implement the following feature request:

FEATURE REQUEST PROMPT:
Title: ${req.title}
Category: ${req.category}
Submitted by: ${req.authorName} (${req.isGuest ? 'Guest' : 'Registered User'})
Date: ${req.createdAt}

Specifications & Details:
${req.description}

Requirement:
Build this tool with a sleek, responsive UI, interactive inputs, and real-time outputs for OmniTools.`;

    navigator.clipboard.writeText(prompt);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBatchCopyRequests = (n: number | 'All') => {
    const pendingRequests = filteredRequests.filter((r) => r.status === 'pending');
    const targets = n === 'All' ? pendingRequests : pendingRequests.slice(0, n as number);
    if (targets.length === 0) return;
    const bodyText = targets
      .map(
        (r, idx) =>
          `### ${idx + 1}. ${r.title} (${r.category})\n- Submitted by: ${r.authorName}\n- Description:\n${r.description}\n`
      )
      .join('\n---\n\n');

    const prompt = `SYSTEM INSTRUCTION: First, filter out any inappropriate content or spam from the list below. Next, bump up the website version in version.js. Provide description for each tool. Then implement the approved feature requests:\n\n${bodyText}`;

    navigator.clipboard.writeText(prompt);
    setCopiedId(`batch-req-${n}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBatchCopyBugs = (n: number | 'All') => {
    const openBugs = filteredIssues.filter((i) => i.status === 'open');
    const targets = n === 'All' ? openBugs : openBugs.slice(0, n as number);
    if (targets.length === 0) return;
    const bodyText = targets
      .map(
        (i, idx) =>
          `### ${idx + 1}. Bug Report on Tool: ${i.toolName}\n- Reporter: ${i.reporterName}\n- Status: ${i.status}\n- Description:\n${i.description}\n`
      )
      .join('\n---\n\n');

    const prompt = `SYSTEM INSTRUCTION: First, filter out any inappropriate content or spam from the bug reports below. Next, bump up the website version in version.js. Then patch and resolve these bugs:\n\n${bodyText}`;

    navigator.clipboard.writeText(prompt);
    setCopiedId(`batch-bug-${n}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleMarkAllPendingAsInDev = () => {
    const pendingRequests = requests.filter((r) => r.status === 'pending');
    if (pendingRequests.length === 0) {
      alert('No pending requests found to mark as In Development.');
      return;
    }
    if (window.confirm(`Mark all ${pendingRequests.length} pending feature requests as In Development?`)) {
      pendingRequests.forEach((r) => {
        onUpdateStatus(r.id, 'in_progress');
      });
    }
  };

  const handleExecutePurge = async () => {
    setIsPurging(true);
    try {
      const count = await onPurgeOldRequests();
      setPurgeSuccessMsg(`Successfully purged ${count} deployed requests (>7 days old) from Firebase. User profiles retained all points!`);
    } catch {
      setPurgeSuccessMsg('Purge operation completed.');
    } finally {
      setIsPurging(false);
      setTimeout(() => setPurgeSuccessMsg(null), 5000);
    }
  };

  // If unauthorized, show lock gate
  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-700/60 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Administrator Portal Restricted</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            This dashboard is exclusively accessible by the platform architect to copy feature requests, manage deployment versions, and run database retention maintenance.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2 text-left font-mono">
          <div>Status: <span className="text-rose-400 font-bold">Unauthorized</span></div>
          <div>Current Account: <span className="text-slate-400">{currentUser?.email ? 'Non-admin user' : 'Not signed in'}</span></div>
          <div>Access Level: <span className="text-amber-300 font-bold">Authorized Administrator Required</span></div>
        </div>

        <button
          onClick={onLoginGoogle}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In with Admin Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Executive Administrator Portal</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Sorted: Oldest to Newest
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Batch copy new pending features & open bugs (1/2/5/10/20/25), resolve bug reports (+3 CP), and purge old submissions.
            </p>
          </div>
        </div>

        {/* 7-Day Storage Purge Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExecutePurge}
            disabled={isPurging || stats.purgeEligible === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-md shadow-rose-950/40"
            title="Deletes submissions deployed for more than 7 days from Firebase to save space."
          >
            <Archive className="w-4 h-4 text-rose-400" />
            <span>{isPurging ? 'Purging Firebase...' : `Purge Old Shipped (${stats.purgeEligible})`}</span>
          </button>
        </div>
      </div>

      {purgeSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{purgeSuccessMsg}</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400">Total in Queue</div>
          <div className="text-xl font-black text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-amber-400">Pending Review</div>
          <div className="text-xl font-black text-amber-300 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-cyan-400">In Development</div>
          <div className="text-xl font-black text-cyan-300 mt-1">{stats.inProgress}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-emerald-400">Shipped Live</div>
          <div className="text-xl font-black text-emerald-300 mt-1">{stats.completed}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-rose-400">Open Bug Reports</div>
          <div className="text-xl font-black text-rose-300 mt-1">{stats.openBugs}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-purple-400">7-Day Purge Ready</div>
          <div className="text-xl font-black text-purple-300 mt-1">{stats.purgeEligible}</div>
        </div>
      </div>

      {/* Admin Tab Switcher: Requests vs Bug Reports */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === 'requests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Feature Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('bugs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === 'bugs'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bug className="w-4 h-4 text-rose-400" />
            <span>Broken Feature Reports ({issues.length})</span>
            {stats.openBugs > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 font-mono text-[10px]">
                {stats.openBugs} open
              </span>
            )}
          </button>
        </div>

        {/* Batch Copy & Mark All In Dev */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeAdminTab === 'requests' && stats.pending > 0 && (
            <button
              onClick={handleMarkAllPendingAsInDev}
              className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              title="Mark all pending feature requests as In Development"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mark All Pending In Dev ({stats.pending})</span>
            </button>
          )}

          <div className="flex items-center gap-1 flex-wrap bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">
              Copy {activeAdminTab === 'requests' ? 'Pending' : 'Open'}:
            </span>
            {[1, 2, 5, 10, 20, 25, 50, 'All' as const].map((n) => {
              const batchKey = `batch-${activeAdminTab === 'requests' ? 'req' : 'bug'}-${n}`;
              const isCopied = copiedId === batchKey;

              return (
                <button
                  key={n}
                  onClick={() => activeAdminTab === 'requests' ? handleBatchCopyRequests(n) : handleBatchCopyBugs(n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border flex items-center gap-1 ${
                    isCopied
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title={`Copy ${n === 'All' ? 'all' : `first ${n}`} new/pending ${activeAdminTab === 'requests' ? 'features' : 'bugs'} to clipboard`}
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400" />}
                  <span>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeAdminTab === 'requests' ? 'Search requests...' : 'Search bug reports...'}
            className="w-full bg-transparent text-xs text-white focus:outline-hidden"
          />
        </div>

        {activeAdminTab === 'requests' && (
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            {['all', 'pending', 'in_progress', 'completed', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT AREA: BUG REPORTS */}
      {activeAdminTab === 'bugs' ? (
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              No bug reports found.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Tool: {issue.toolName}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        issue.status === 'resolved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex-wrap gap-2">
                  <div>
                    Reported by <strong className="text-white">{issue.reporterName}</strong> on {new Date(issue.createdAt).toLocaleDateString()}
                  </div>

                  {issue.status === 'open' ? (
                    <div className="flex items-center gap-2">
                      {resolvingIssueId === issue.id ? (
                        <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <input
                            type="text"
                            value={fixNotes}
                            onChange={(e) => setFixNotes(e.target.value)}
                            placeholder="Fix description notes..."
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white font-mono"
                          />
                          <button
                            onClick={() => {
                              onResolveIssue(issue.id, fixNotes);
                              setResolvingIssueId(null);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            Confirm Fix (+3 CP)
                          </button>
                          <button
                            onClick={() => setResolvingIssueId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingIssueId(issue.id)}
                          className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Resolve Bug & Award +3 CP</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Fixed (+3 CP Awarded)
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* CONTENT AREA: FEATURE REQUESTS */
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              No feature requests match your search filter.
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-400">#{req.id.slice(-6)}</span>
                      <h3 className="text-base font-bold text-white">{req.title}</h3>
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
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {req.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {req.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-amber-400 font-mono">▲ {req.votes}</div>
                    <div className="text-[10px] text-slate-500">Votes</div>
                  </div>
                </div>

                {/* Author & Date metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <span>Submitted by <strong className="text-slate-200">{req.authorName}</strong> {req.isGuest && '(Guest)'}</span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>

                  {req.completedVersion && (
                    <div className="text-emerald-400 font-mono font-bold">
                      Shipped in {req.completedVersion} (+2 CP)
                    </div>
                  )}
                </div>

                {/* Version Selector for Shipping */}
                {selectedReqForShip === req.id && (
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-2.5">
                    <div className="text-xs font-bold text-emerald-300">Assign Version for Deployment (+2 CP Reward):</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customVersion}
                        onChange={(e) => setCustomVersion(e.target.value)}
                        placeholder="v1.1.0"
                        className="bg-slate-900 border border-emerald-700/60 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-32"
                      />
                      <button
                        onClick={() => {
                          onUpdateStatus(req.id, 'completed', customVersion);
                          setSelectedReqForShip(null);
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                      >
                        Confirm Ship & Award +2 CP
                      </button>
                      <button
                        onClick={() => setSelectedReqForShip(null)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejection Reason Selector */}
                {rejectingReqId === req.id && (
                  <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-2.5">
                    <div className="text-xs font-bold text-rose-300">Reason for Rejection (-5 CP Penalty):</div>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection (e.g. spam, duplicate, inappropriate)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onUpdateStatus(req.id, 'rejected', undefined, rejectionReason);
                          setRejectingReqId(null);
                        }}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setRejectingReqId(null)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleCopyIdeaPrompt(req)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/60 rounded-xl text-xs font-bold transition shadow-xs"
                    title="Copy full idea specification to feed into AI"
                  >
                    {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{copiedId === req.id ? 'Idea Prompt Copied!' : 'Copy Idea for AI / Dev'}</span>
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {req.status !== 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(req.id, 'in_progress')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                      >
                        Mark In Dev
                      </button>
                    )}

                    {req.status !== 'completed' && (
                      <button
                        onClick={() => setSelectedReqForShip(req.id)}
                        className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold transition"
                      >
                        Ship & Deploy (+2 CP)
                      </button>
                    )}

                    {req.status !== 'rejected' && (
                      <button
                        onClick={() => setRejectingReqId(req.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteRequest(req.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete document immediately from Firebase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
