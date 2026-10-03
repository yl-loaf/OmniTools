import React, { useState } from 'react';
import { ToolIssue, UserProfile } from '../types';
import { AlertCircle, X, Send, Bug } from 'lucide-react';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolName: string;
  currentUser: UserProfile | null;
  isGuest: boolean;
  onSubmitIssue: (issue: Omit<ToolIssue, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'pointsAwarded'>) => void;
  onOpenAuth: () => void;
}

export const ReportBugModal: React.FC<ReportBugModalProps> = ({
  isOpen,
  onClose,
  toolId,
  toolName,
  currentUser,
  isGuest,
  onSubmitIssue,
  onOpenAuth,
}) => {
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (!currentUser || isGuest) {
      onOpenAuth();
      return;
    }

    onSubmitIssue({
      toolId,
      toolName,
      description: description.trim(),
      reporterId: currentUser.uid,
      reporterName: currentUser.displayName,
    });

    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Report Broken Feature</h3>
              <p className="text-[11px] text-slate-400">Tool: {toolName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-xl text-xs text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Earn +3 CP Reward!
            </div>
            <p className="text-[11px] text-slate-300">
              If the platform architect successfully fixes the bug you reported on the admin page, you will be awarded <strong className="text-emerald-400">+3 Contribution Points (+3 CP)</strong>!
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Describe the issue or bug</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What went wrong? Steps to reproduce, error messages, or unexpected behavior..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Bug Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
