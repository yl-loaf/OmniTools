import React, { useState } from 'react';
import { DollarSign, PieChart, RefreshCw, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export const CryptoPortfolioSimulator: React.FC = () => {
  const [totalCapital, setTotalCapital] = useState<number>(10000);
  const [allocations, setAllocations] = useState({
    btc: 50,
    eth: 30,
    sol: 15,
    usdc: 5,
  });
  const [driftThreshold, setDriftThreshold] = useState<number>(5);
  const [volatility, setVolatility] = useState<number>(25);
  const [simulatedMonths, setSimulatedMonths] = useState<number>(12);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const handleAllocationChange = (coin: string, val: number) => {
    setAllocations(prev => ({ ...prev, [coin]: val }));
  };

  const runSimulation = () => {
    const sum = allocations.btc + allocations.eth + allocations.sol + allocations.usdc;
    if (sum !== 100) {
      alert('Allocations must total exactly 100%');
      return;
    }

    let btcValue = totalCapital * (allocations.btc / 100);
    let ethValue = totalCapital * (allocations.eth / 100);
    let solValue = totalCapital * (allocations.sol / 100);
    let usdcValue = totalCapital * (allocations.usdc / 100);

    let rebalanceCount = 0;
    const history = [];

    let currentPortfolio = totalCapital;
    let hodlPortfolio = totalCapital;

    for (let m = 1; m <= simulatedMonths; m++) {
      // simulate random market shocks
      const btcReturn = 1 + (Math.random() - 0.48) * (volatility / 100);
      const ethReturn = 1 + (Math.random() - 0.47) * (volatility / 100 * 1.2);
      const solReturn = 1 + (Math.random() - 0.45) * (volatility / 100 * 1.6);
      const usdcReturn = 1.003; // stable yield

      btcValue *= btcReturn;
      ethValue *= ethReturn;
      solValue *= solReturn;
      usdcValue *= usdcReturn;

      const currentTotal = btcValue + ethValue + solValue + usdcValue;
      hodlPortfolio *= ((btcReturn * (allocations.btc/100)) + (ethReturn * (allocations.eth/100)) + (solReturn * (allocations.sol/100)) + (usdcReturn * (allocations.usdc/100)));

      // check drift
      const btcActualPct = (btcValue / currentTotal) * 100;
      const drift = Math.abs(btcActualPct - allocations.btc);

      let rebalancedThisMonth = false;
      if (drift > driftThreshold) {
        btcValue = currentTotal * (allocations.btc / 100);
        ethValue = currentTotal * (allocations.eth / 100);
        solValue = currentTotal * (allocations.sol / 100);
        usdcValue = currentTotal * (allocations.usdc / 100);
        rebalanceCount++;
        rebalancedThisMonth = true;
      }

      history.push({
        month: m,
        value: Math.round(currentTotal),
        hodl: Math.round(hodlPortfolio),
        rebalanced: rebalancedThisMonth
      });
    }

    const finalVal = history[history.length - 1].value;
    const finalHodl = history[history.length - 1].hodl;

    setSimulationResult({
      finalVal,
      finalHodl,
      rebalanceCount,
      history,
      roi: (((finalVal - totalCapital) / totalCapital) * 100).toFixed(2),
      hodlRoi: (((finalHodl - totalCapital) / totalCapital) * 100).toFixed(2),
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold text-slate-100">Crypto Asset Portfolio Rebalancer & Yield Simulator</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Simulate automated portfolio rebalancing strategies over historical volatility intervals and track risk-adjusted performance.
            </p>
          </div>
          <button
            onClick={runSimulation}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Run Monte Carlo Simulation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Inputs */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Portfolio Settings
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Total Initial Capital ($)</label>
              <input
                type="number"
                value={totalCapital}
                onChange={(e) => setTotalCapital(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Target Asset Allocations (%)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">BTC (%)</label>
                  <input
                    type="number"
                    value={allocations.btc}
                    onChange={(e) => handleAllocationChange('btc', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">ETH (%)</label>
                  <input
                    type="number"
                    value={allocations.eth}
                    onChange={(e) => handleAllocationChange('eth', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">SOL (%)</label>
                  <input
                    type="number"
                    value={allocations.sol}
                    onChange={(e) => handleAllocationChange('sol', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">USDC (%)</label>
                  <input
                    type="number"
                    value={allocations.usdc}
                    onChange={(e) => handleAllocationChange('usdc', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                Total: {allocations.btc + allocations.eth + allocations.sol + allocations.usdc}%
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Drift Rebalance Threshold ({driftThreshold}%)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={driftThreshold}
                  onChange={(e) => setDriftThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Market Volatility Index ({volatility}%)</label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={volatility}
                  onChange={(e) => setVolatility(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Simulation Horizon ({simulatedMonths} Months)</label>
                <input
                  type="range"
                  min="3"
                  max="36"
                  value={simulatedMonths}
                  onChange={(e) => setSimulatedMonths(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-2 space-y-6">
            {simulationResult ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Rebalanced Portfolio</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">${simulationResult.finalVal.toLocaleString()}</div>
                    <div className="text-xs text-emerald-500 font-medium mt-1">ROI: {simulationResult.roi}%</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Buy & Hold (HODL)</div>
                    <div className="text-2xl font-bold text-slate-200 mt-1">${simulationResult.finalHodl.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 font-medium mt-1">ROI: {simulationResult.hodlRoi}%</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Rebalance Actions</div>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">{simulationResult.rebalanceCount} times</div>
                    <div className="text-xs text-slate-400 font-medium mt-1">Drift controlled</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-200 mb-4">Monthly Trajectory Comparison</h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {simulationResult.history.map((h: any) => (
                      <div key={h.month} className="flex items-center justify-between text-xs py-2 border-b border-slate-900">
                        <span className="text-slate-400">Month {h.month}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-emerald-400 font-mono">Rebalanced: ${h.value.toLocaleString()}</span>
                          <span className="text-slate-400 font-mono">HODL: ${h.hodl.toLocaleString()}</span>
                          {h.rebalanced && <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded text-[10px]">Rebalanced</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-8">
                <TrendingUp className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-base font-semibold text-slate-300">Ready to simulate portfolio performance</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Configure your starting capital and asset weights on the left, then click run to evaluate historical volatility resilience.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
