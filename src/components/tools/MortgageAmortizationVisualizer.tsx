import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export function MortgageAmortizationVisualizer() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(300);

  const downPayment = (homePrice * downPaymentPct) / 100;
  const loanAmount = homePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  // Standard Monthly Payment (P&I)
  const standardMonthlyPayment =
    monthlyInterestRate === 0
      ? loanAmount / totalPayments
      : (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalPayments)) /
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  // Amortization calculation with extra payment
  const computeAmortization = (extra: number) => {
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let months = 0;

    while (balance > 0 && months < totalPayments * 2) {
      months++;
      const interestPayment = balance * monthlyInterestRate;
      let principalPayment = standardMonthlyPayment - interestPayment + extra;

      if (balance < principalPayment) {
        principalPayment = balance;
      }

      totalInterestPaid += interestPayment;
      balance -= principalPayment;

      if (balance <= 0) break;
    }

    return { months, totalInterestPaid };
  };

  const standardPlan = computeAmortization(0);
  const extraPlan = computeAmortization(extraMonthlyPayment);

  const monthsSaved = standardPlan.months - extraPlan.months;
  const interestSaved = standardPlan.totalInterestPaid - extraPlan.totalInterestPaid;
  const yearsToPayoff = (extraPlan.months / 12).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl text-white shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Compound Mortgage Amortization & Extra Payment Visualizer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Model long-term mortgage schedules and discover the massive interest savings and accelerated debt freedom of extra principal payments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" /> Loan Parameters
          </h2>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Home Price</span>
              <span className="font-mono text-emerald-300">${homePrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="1500000"
              step="10000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Down Payment ({downPaymentPct}%)</span>
              <span className="font-mono text-emerald-300">${downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Interest Rate</span>
              <span className="font-mono text-emerald-300">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Loan Term</label>
            <div className="grid grid-cols-2 gap-2">
              {[15, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTermYears(term)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    loanTermYears === term
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {term} Years
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Extra Monthly Principal</span>
              <span className="font-mono text-emerald-300">${extraMonthlyPayment}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={extraMonthlyPayment}
              onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400">Standard Monthly P&I</div>
              <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
                ${standardMonthlyPayment.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-900 border border-emerald-800/60 p-4 rounded-xl">
              <div className="text-xs text-emerald-400 font-semibold">Total Interest Saved</div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                ${Math.round(interestSaved).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 border border-teal-800/60 p-4 rounded-xl">
              <div className="text-xs text-teal-400 font-semibold">Time to Debt Freedom</div>
              <div className="text-2xl font-bold font-mono text-teal-300 mt-1">
                {yearsToPayoff} Years <span className="text-xs text-slate-400 font-normal">({monthsSaved} mos faster)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Amortization Comparison Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-300">Standard {loanTermYears}-Year Schedule</div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Payments:</span>
                  <span className="font-mono text-slate-200">${Math.round(loanAmount + standardPlan.totalInterestPaid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Interest:</span>
                  <span className="font-mono text-rose-400">${Math.round(standardPlan.totalInterestPaid).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-emerald-900/50">
                <div className="font-semibold text-emerald-300">Accelerated with +${extraMonthlyPayment}/mo</div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Payments:</span>
                  <span className="font-mono text-slate-200">${Math.round(loanAmount + extraPlan.totalInterestPaid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Interest:</span>
                  <span className="font-mono text-emerald-400">${Math.round(extraPlan.totalInterestPaid).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
