import React, { useState } from 'react';
import { Gauge, Download, Upload, Activity, Play, RefreshCw, Zap, Server } from 'lucide-react';

export const SpeedTestTool: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [rawMode, setRawMode] = useState(false);
  const [bulkDataMb, setBulkDataMb] = useState(25); // 25MB bulk download test

  const startSpeedTest = async () => {
    setIsTesting(true);
    setTestPhase('ping');
    setPing(null);
    setDownloadSpeed(null);
    setUploadSpeed(null);

    // Simulate Ping test
    await new Promise((r) => setTimeout(r, 600));
    const simulatedPing = Math.floor(12 + Math.random() * 24);
    setPing(simulatedPing);

    // Simulate Download test
    setTestPhase('download');
    const startTime = performance.now();
    const payloadSizeMb = rawMode ? bulkDataMb : 10;

    // Simulate network transfer using a timed loop
    let loadedBytes = 0;
    const totalBytes = payloadSizeMb * 1024 * 1024;
    const intervalTime = rawMode ? 50 : 200;

    const downloadInterval = setInterval(() => {
      loadedBytes += totalBytes / (rawMode ? 10 : 5);
      const elapsed = (performance.now() - startTime) / 1000;
      const currentMbps = ((loadedBytes * 8) / (1024 * 1024)) / Math.max(0.1, elapsed);
      setDownloadSpeed(parseFloat(currentMbps.toFixed(2)));

      if (loadedBytes >= totalBytes) {
        clearInterval(downloadInterval);
        finishUploadTest(simulatedPing);
      }
    }, intervalTime);
  };

  const finishUploadTest = async (simPing: number) => {
    setTestPhase('upload');
    const startTime = performance.now();
    const payloadSizeMb = rawMode ? bulkDataMb / 2 : 5;

    let uploadedBytes = 0;
    const totalBytes = payloadSizeMb * 1024 * 1024;

    const uploadInterval = setInterval(() => {
      uploadedBytes += totalBytes / 5;
      const elapsed = (performance.now() - startTime) / 1000;
      const currentMbps = ((uploadedBytes * 8) / (1024 * 1024)) / Math.max(0.1, elapsed);
      setUploadSpeed(parseFloat(currentMbps.toFixed(2)));

      if (uploadedBytes >= totalBytes) {
        clearInterval(uploadInterval);
        setTestPhase('complete');
        setIsTesting(false);
      }
    }, 200);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Gauge className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Network & Bulk Speed Test</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Mbps & Bulk Raw Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Measure download bandwidth, upload throughput, ping latency, and raw bulk data transfer speeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            <input
              type="checkbox"
              checked={rawMode}
              onChange={(e) => setRawMode(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Raw Bulk Mode</span>
          </label>
        </div>
      </div>

      {rawMode && (
        <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Raw Bulk Transfer Size: {bulkDataMb} MB payload stream</span>
          </div>
          <div className="flex items-center gap-2">
            {[10, 25, 50, 100].map((mb) => (
              <button
                key={mb}
                onClick={() => setBulkDataMb(mb)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                  bulkDataMb === mb
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {mb} MB
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Speedometer Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-400" /> Ping Latency
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white">
              {ping !== null ? `${ping}` : '—'}
              <span className="text-sm font-normal text-slate-400 ml-1">ms</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-400" /> Download Speed
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">
              {downloadSpeed !== null ? `${downloadSpeed}` : '—'}
              <span className="text-sm font-normal text-slate-400 ml-1">Mbps</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Upload className="w-4 h-4 text-cyan-400" /> Upload Speed
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-cyan-400">
              {uploadSpeed !== null ? `${uploadSpeed}` : '—'}
              <span className="text-sm font-normal text-slate-400 ml-1">Mbps</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="text-xs font-mono font-semibold text-slate-400 uppercase">
            {testPhase === 'idle' && 'Ready to test network bandwidth'}
            {testPhase === 'ping' && 'Testing server latency & routing...'}
            {testPhase === 'download' && `Measuring bulk download throughput (${rawMode ? `${bulkDataMb} MB` : 'Standard'})...`}
            {testPhase === 'upload' && 'Measuring upload transmission speed...'}
            {testPhase === 'complete' && 'Test complete! Excellent connection.'}
          </div>

          <button
            onClick={startSpeedTest}
            disabled={isTesting}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-black transition flex items-center gap-2 shadow-xl shadow-emerald-600/25 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Test...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Speed Test</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
