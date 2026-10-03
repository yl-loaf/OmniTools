import React, { useState } from 'react';
import { FirebaseCustomConfig } from '../types';
import {
  saveFirebaseConfig,
  getSavedFirebaseConfig,
  clearFirebaseConfig,
  initFirebase,
  testFirestoreConnection
} from '../services/firebase';
import { X, CheckCircle2, AlertCircle, Database, ShieldCheck, ExternalLink } from 'lucide-react';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const existingConfig = getSavedFirebaseConfig();
  const [apiKey, setApiKey] = useState(existingConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(existingConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(existingConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(existingConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(existingConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(existingConfig?.appId || '');
  const [databaseId, setDatabaseId] = useState(existingConfig?.databaseId || '');
  const [pasteJson, setPasteJson] = useState('');

  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleJsonPaste = (text: string) => {
    setPasteJson(text);
    try {
      // Find object inside script or raw json
      const cleaned = text.trim();
      let obj: any = null;
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        obj = JSON.parse(cleaned);
      } else {
        const match = cleaned.match(/const\s+firebaseConfig\s*=\s*(\{[\s\S]*?\});/);
        if (match && match[1]) {
          // parse loose JS object keys
          const jsonLike = match[1]
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/,\s*}/g, '}');
          obj = JSON.parse(jsonLike);
        }
      }

      if (obj) {
        if (obj.apiKey) setApiKey(obj.apiKey);
        if (obj.authDomain) setAuthDomain(obj.authDomain);
        if (obj.projectId) setProjectId(obj.projectId);
        if (obj.storageBucket) setStorageBucket(obj.storageBucket);
        if (obj.messagingSenderId) setMessagingSenderId(obj.messagingSenderId);
        if (obj.appId) setAppId(obj.appId);
        setStatusMessage({ type: 'success', text: 'Firebase config parsed successfully from JSON!' });
      }
    } catch {
      // Ignore parse failure on typing
    }
  };

  const handleSaveAndTest = async () => {
    if (!apiKey.trim() || !projectId.trim()) {
      setStatusMessage({ type: 'error', text: 'API Key and Project ID are required.' });
      return;
    }

    const config: FirebaseCustomConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      databaseId: databaseId.trim() || undefined,
    };

    setTesting(true);
    setStatusMessage({ type: 'info', text: 'Initializing and testing Firestore connection...' });

    try {
      const initialized = saveFirebaseConfig(config);
      if (initialized.db) {
        const testRes = await testFirestoreConnection(initialized.db);
        if (testRes.success) {
          setStatusMessage({ type: 'success', text: `Connected! ${testRes.message}` });
        } else {
          setStatusMessage({ type: 'error', text: `Config saved, but Firestore test note: ${testRes.message}` });
        }
      } else {
        setStatusMessage({ type: 'success', text: 'Firebase configuration saved successfully!' });
      }
      onConfigUpdated();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error: ${err?.message || 'Failed to initialize'}` });
    } finally {
      setTesting(false);
    }
  };

  const handleResetToLocal = () => {
    clearFirebaseConfig();
    setApiKey('');
    setAuthDomain('');
    setProjectId('');
    setStorageBucket('');
    setMessagingSenderId('');
    setAppId('');
    setPasteJson('');
    setStatusMessage({ type: 'info', text: 'Reset to local browser storage mode.' });
    onConfigUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Custom Firebase Configuration</h2>
              <p className="text-xs text-slate-400">Use any Firebase project from your other Google account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-300 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>Quick Guide:</strong> In your other account's{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-400 inline-flex items-center gap-0.5"
              >
                Firebase Console <ExternalLink className="w-3 h-3" />
              </a>
              , go to <em>Project Settings &gt; General &gt; Your apps &gt; Web App</em>. Copy the <code>firebaseConfig</code> object and paste it below.
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Quick Paste <code>firebaseConfig</code> (JSON or code snippet)
            </label>
            <textarea
              rows={3}
              value={pasteJson}
              onChange={(e) => handleJsonPaste(e.target.value)}
              placeholder='Paste { "apiKey": "...", "projectId": "..." } here to auto-fill'
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">API Key *</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Project ID *</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-vex-project"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Auth Domain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="my-vex-project.firebaseapp.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/50 text-rose-300 border border-rose-800/40'
                  : 'bg-blue-950/50 text-blue-300 border border-blue-800/40'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleSaveAndTest}
              disabled={testing}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {testing ? 'Testing Connection...' : 'Save & Connect to Firebase'}
            </button>
            {existingConfig && (
              <button
                onClick={handleResetToLocal}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition border border-slate-700"
              >
                Use Local Storage Mode
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
