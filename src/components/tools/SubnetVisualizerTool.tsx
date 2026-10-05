import React, { useState } from 'react';
import { Network, Server, Globe, Shield, Copy, Check } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

export function SubnetVisualizerTool() {
  const [ipInput, setIpInput] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [copied, setCopied] = useState(false);

  // Calculate subnet details
  const parseIpToInt = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet || '0', 10), 0) >>> 0;
  };

  const intToIp = (int: number) => {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
  };

  const ipInt = parseIpToInt(ipInput);
  const maskInt = cidr === 0 ? 0 : (~((1 << (32 - cidr)) - 1)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
  const firstHostInt = cidr >= 31 ? networkInt : networkInt + 1;
  const lastHostInt = cidr >= 31 ? broadcastInt : broadcastInt - 1;

  const subnetMask = intToIp(maskInt);
  const wildcardMask = intToIp(wildcardInt);
  const networkAddress = intToIp(networkInt);
  const broadcastAddress = intToIp(broadcastInt);
  const firstHost = intToIp(firstHostInt);
  const lastHost = intToIp(lastHostInt);

  const summaryText = `CIDR: /${cidr}
IP Address: ${ipInput}
Subnet Mask: ${subnetMask}
Network Address: ${networkAddress}
Broadcast Address: ${broadcastAddress}
Usable Host Range: ${firstHost} - ${lastHost}
Total Usable Hosts: ${usableHosts.toLocaleString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            Subnet & CIDR Mask Visualizer
          </h2>
          <p className="text-sm text-slate-400">
            Calculate IPv4 subnet allocations, broadcast addresses, and usable host ranges for infrastructure planning.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          Copy Summary
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300">IPv4 Address</label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="192.168.1.0"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">CIDR Prefix ( /0 - /32 )</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="flex-1 accent-cyan-500 cursor-pointer"
            />
            <span className="font-mono text-sm font-bold bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-cyan-400 w-14 text-center">
              /{cidr}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Subnet Mask</div>
          <div className="font-mono text-sm font-bold text-slate-200">{subnetMask}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Wildcard Mask</div>
          <div className="font-mono text-sm font-bold text-slate-200">{wildcardMask}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Network Address</div>
          <div className="font-mono text-sm font-bold text-cyan-400">{networkAddress}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Broadcast Address</div>
          <div className="font-mono text-sm font-bold text-amber-400">{broadcastAddress}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Usable Host Range</div>
          <div className="font-mono text-xs font-bold text-emerald-400 truncate">{firstHost} - {lastHost}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Total Usable Hosts</div>
          <div className="font-mono text-sm font-bold text-indigo-400">{usableHosts.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
