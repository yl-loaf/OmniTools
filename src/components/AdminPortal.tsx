import React, { useState, useMemo } from 'react';
import {
  ToolRequest,
  UserProfile,
  RequestStatus,
  RequestCategory,
  ADMIN_EMAIL,
  ShippedToolRecord
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
  RefreshCw
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: UserProfile | null;
  requests: ToolRequest[];
  users: UserProfile[];
  onUpdateStatus: (requestId: string, status: RequestStatus, version?: string, rejectionReason?: string) => void;
  onPurgeOldRequests: () => Promise<number>;
  onDeleteRequest: (requestId: string) => Promise<void>;
  onLoginGoogle: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  requests,
  users,
  onUpdateStatus,
  onPurgeOldRequests,
  onDeleteRequest,
  onLoginGoogle,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccessMsg, setPurgeSuccessMsg] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Duplicate or inappropriate submission');

  // Version assignment
  const [customVersion, setCustomVersion] = useState(`v${APP_VERSION}`);
  const [selectedReqForShip, setSelectedReqForShip] = useState<string | null>(null);

  const isAuthorized = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  // Metrics
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending').length;
    const inProgress = requests.filter((r) => r.status === 'in_progress').length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;
    return {
      total: requests.length,
      pending,
      inProgress,
      completed,
      rejected,
      purgeEligible: oldShippedRequests.length,
    };
  }, [requests, oldShippedRequests]);

  const handleCopyIdeaPrompt = (req: ToolRequest) => {
    const prompt = `FEATURE REQUEST PROMPT:
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

  const handleCopyTitleOnly = (title: string, id: string) => {
    navigator.clipboard.writeText(title);
    setCopiedId(`title-${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShipFeature = (requestId: string) => {
    onUpdateStatus(requestId, 'completed', customVersion);
    setSelectedReqForShip(null);
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
            This dashboard is exclusively accessible by the platform architect (<code className="text-amber-300 font-mono font-semibold">{ADMIN_EMAIL}</code>) to copy feature requests, manage deployment versions, and run database retention maintenance.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2 text-left font-mono">
          <div>Status: <span className="text-rose-400 font-bold">Unauthorized</span></div>
          <div>Current Email: <span className="text-slate-400">{currentUser?.email || 'Not signed in'}</span></div>
          <div>Required Account: <span className="text-amber-300 font-bold">{ADMIN_EMAIL}</span></div>
        </div>

        <button
          onClick={onLoginGoogle}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In with {ADMIN_EMAIL}</span>
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
                {ADMIN_EMAIL}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Copy user proposals, assign shipping versions, award +2 CP rewards, and purge 7-day-old deployed submissions.
            </p>
          </div>
        </div>

        {/* 7-Day Storage Purge Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExecutePurge}
            disabled={isPurging || stats.purgeEligible === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-md shadow-rose-950/40"
            title="Deletes submissions deployed for more than 7 days from Firebase to save space. User profile points remain intact!"
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
          <div className="text-[11px] font-semibold text-rose-400">Spam / Rejected</div>
          <div className="text-xl font-black text-rose-300 mt-1">{stats.rejected}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-purple-400">7-Day Purge Ready</div>
          <div className="text-xl font-black text-purple-300 mt-1">{stats.purgeEligible}</div>
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
            placeholder="Search proposals, details, authors..."
            className="w-full bg-transparent text-xs text-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Dev' },
            { id: 'completed', label: 'Shipped' },
            { id: 'rejected', label: 'Rejected' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
                statusFilter === st.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Proposals List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No submissions found matching criteria.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isOld = oldShippedRequests.some((o) => o.id === req.id);
            const daysSinceDeployed = req.deployedAt
              ? Math.floor((Date.now() - new Date(req.deployedAt).getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      req.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : req.status === 'in_progress'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : req.status === 'rejected'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{req.id}</span>
                    <span className="text-xs text-slate-400">• Category: <strong className="text-slate-300 capitalize">{req.category}</strong></span>
                    {req.completedVersion && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        Shipped in {req.completedVersion}
                      </span>
                    )}
                    {isOld && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Deployed {daysSinceDeployed}d ago (Eligible for Purge)
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    By <strong className="text-white">{req.authorName}</strong> ({req.isGuest ? 'Guest' : 'Registered User'})
                  </div>
                </div>

                {/* Proposal Title & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-white">{req.title}</h3>
                    <button
                      onClick={() => handleCopyTitleOnly(req.title, req.id)}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                      title="Copy Feature Name"
                    >
                      {copiedId === `title-${req.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Name</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 font-mono">
                    {req.description}
                  </p>
                </div>

                {/* Ship / Version Drawer */}
                {selectedReqForShip === req.id && (
                  <div className="p-4 bg-slate-950 border border-blue-800/60 rounded-xl space-y-3 animate-in fade-in">
                    <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Ship & Deploy Feature (+2 CP will be awarded to {req.authorName})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customVersion}
                        onChange={(e) => setCustomVersion(e.target.value)}
                        placeholder="Version (e.g. v1.2.0)"
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => handleShipFeature(req.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-md"
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

                {/* Reject drawer */}
                {rejectingReqId === req.id && (
                  <div className="p-4 bg-slate-950 border border-rose-800/60 rounded-xl space-y-3 animate-in fade-in">
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Reject Proposal (-5 CP Penalty)</span>
                    </div>
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
            );
          })
        )}
      </div>
    </div>
  );
};
