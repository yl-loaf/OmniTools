import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  PieChart,
  BarChart3,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FinanceCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'loan' | 'compound'>('loan');
  const [currency, setCurrency] = useState('$');

  // Loan State
  const [loanAmount, setLoanAmount] = useState(250000);
  const [loanInterestRate, setLoanInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);

  // Compound Interest State
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [investmentYears, setInvestmentYears] = useState(20);
  const [annualReturnRate, setAnnualReturnRate] = useState(8.0);

  // Loan Calculation
  const loanStats = useMemo(() => {
    const principal = Number(loanAmount) || 0;
    const ratePerMonth = (Number(loanInterestRate) || 0) / 100 / 12;
    const totalMonths = (Number(loanTermYears) || 0) * 12;

    if (principal <= 0 || totalMonths <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, amortization: [] };
    }

    let monthlyPayment = 0;
    if (ratePerMonth > 0) {
      monthlyPayment = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths)) / (Math.pow(1 + ratePerMonth, totalMonths) - 1);
    } else {
      monthlyPayment = principal / totalMonths;
    }

    // Generate yearly breakdown
    let balance = principal;
    const amortization: Array<{ year: number; interestPaid: number; principalPaid: number; balance: number }> = [];

    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interestMonth = balance * ratePerMonth;
      const principalMonth = Math.min(balance, monthlyPayment - interestMonth + extraPayment);
      balance = Math.max(0, balance - principalMonth);
      yearlyInterest += interestMonth;
      yearlyPrincipal += principalMonth;

      if (m % 12 === 0 || balance <= 0 || m === totalMonths) {
        amortization.push({
          year: Math.ceil(m / 12),
          interestPaid: Math.round(yearlyInterest),
          principalPaid: Math.round(yearlyPrincipal),
          balance: Math.round(balance),
        });
        yearlyInterest = 0;
        yearlyPrincipal = 0;
      }
      if (balance <= 0) break;
    }

    const totalInterest = amortization.reduce((acc, row) => acc + row.interestPaid, 0);
    const totalPayment = principal + totalInterest;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      amortization,
    };
  }, [loanAmount, loanInterestRate, loanTermYears, extraPayment]);

  // Compound Interest Calculation
  const compoundStats = useMemo(() => {
    const p = Number(initialInvestment) || 0;
    const pmt = Number(monthlyContribution) || 0;
    const r = (Number(annualReturnRate) || 0) / 100 / 12;
    const n = (Number(investmentYears) || 0) * 12;

    let balance = p;
    let totalInvested = p;

    const yearlyData: Array<{ year: number; invested: number; interest: number; total: number }> = [];

    for (let m = 1; m <= n; m++) {
      balance = balance * (1 + r) + pmt;
      totalInvested += pmt;

      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          invested: Math.round(totalInvested),
          interest: Math.round(Math.max(0, balance - totalInvested)),
          total: Math.round(balance),
        });
      }
    }

    return {
      finalBalance: Math.round(balance),
      totalInvested: Math.round(totalInvested),
      totalInterestEarned: Math.round(Math.max(0, balance - totalInvested)),
      yearlyData,
    };
  }, [initialInvestment, monthlyContribution, investmentYears, annualReturnRate]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Financial & Loan Growth Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                Amortization Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Calculate loan repayments, mortgage schedules, and compound investment wealth growth.
            </p>
          </div>
        </div>

        {/* Currency & Mode Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden"
          >
            <option value="$">$ USD / CAD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
            <option value="¥">¥ JPY / CNY</option>
            <option value="₹">₹ INR</option>
            <option value="₱">₱ PHP</option>
          </select>

          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setCalcMode('loan')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                calcMode === 'loan' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Loan & Mortgage
            </button>
            <button
              onClick={() => setCalcMode('compound')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                calcMode === 'compound' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Compound Growth
            </button>
          </div>
        </div>
      </div>

      {/* 1. Loan Calculator */}
      {calcMode === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Inputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Loan Parameters</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Principal Loan Amount</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-500 font-bold mr-2">{currency}</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Annual Interest Rate (%)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Percent className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="number"
                  step="0.1"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Loan Term (Years)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="number"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Extra Monthly Payment</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-500 font-bold mr-2">{currency}</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Results & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Monthly Payment</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {currency}{loanStats.monthlyPayment.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Interest Paid</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                  {currency}{loanStats.totalInterest.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Cost of Loan</div>
                <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                  {currency}{loanStats.totalPayment.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Annual Amortization Schedule</span>
                <span className="text-[11px] text-slate-400 font-normal">Yearly principal vs interest</span>
              </div>

              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2">Year</th>
                      <th className="p-2">Principal</th>
                      <th className="p-2">Interest</th>
                      <th className="p-2 text-right">Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {loanStats.amortization.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-800/40">
                        <td className="p-2 font-bold text-white">Yr {row.year}</td>
                        <td className="p-2 text-emerald-400">{currency}{row.principalPaid.toLocaleString()}</td>
                        <td className="p-2 text-amber-400">{currency}{row.interestPaid.toLocaleString()}</td>
                        <td className="p-2 text-right text-cyan-300">{currency}{row.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compound Growth Simulator */}
      {calcMode === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Inputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Investment Plan</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Initial Deposit</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-500 font-bold mr-2">{currency}</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Monthly Contribution</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-500 font-bold mr-2">{currency}</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Investment Horizon (Years)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="number"
                  value={investmentYears}
                  onChange={(e) => setInvestmentYears(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Estimated Annual Return (%)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Percent className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="number"
                  step="0.5"
                  value={annualReturnRate}
                  onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Future Wealth Balance</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {currency}{compoundStats.finalBalance.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Invested Principal</div>
                <div className="text-xl font-bold text-blue-400 font-mono mt-1">
                  {currency}{compoundStats.totalInvested.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Compound Interest Earned</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                  {currency}{compoundStats.totalInterestEarned.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Growth Schedule */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Yearly Portfolio Trajectory</span>
                <span className="text-[11px] text-slate-400 font-normal">Principal vs Compounded Gains</span>
              </div>

              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2">Year</th>
                      <th className="p-2">Principal Invested</th>
                      <th className="p-2">Compound Interest</th>
                      <th className="p-2 text-right">Total Portfolio Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {compoundStats.yearlyData.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-800/40">
                        <td className="p-2 font-bold text-white">Yr {row.year}</td>
                        <td className="p-2 text-blue-400">{currency}{row.invested.toLocaleString()}</td>
                        <td className="p-2 text-amber-400">+{currency}{row.interest.toLocaleString()}</td>
                        <td className="p-2 text-right text-emerald-400 font-bold">{currency}{row.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
