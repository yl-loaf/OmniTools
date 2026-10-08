import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Sparkles, Award, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  earned: number; // percentage scored (0-100)
  weight: number; // weight percentage (0-100)
}

export const ExamGradeCalculator: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([
    { id: '1', name: 'Midterm Exam 1', earned: 85, weight: 25 },
    { id: '2', name: 'Midterm Exam 2', earned: 78, weight: 25 },
    { id: '3', name: 'Quizzes & Homework', earned: 92, weight: 20 },
    { id: '4', name: 'Final Exam (Remaining)', earned: 0, weight: 30 },
  ]);

  const [newName, setNewName] = useState<string>('');
  const [newEarned, setNewEarned] = useState<string>('85');
  const [newWeight, setNewWeight] = useState<string>('15');
  const [targetOverall, setTargetOverall] = useState<number>(90);

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const earnedNum = parseFloat(newEarned) || 0;
    const weightNum = parseFloat(newWeight) || 0;
    if (weightNum <= 0) return;

    setAssessments([
      ...assessments,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        earned: Math.min(100, Math.max(0, earnedNum)),
        weight: weightNum,
      },
    ]);
    setNewName('');
    setNewEarned('80');
    setNewWeight('10');
  };

  const handleRemoveAssessment = (id: string) => {
    setAssessments(assessments.filter((a) => a.id !== id));
  };

  const handleUpdate = (id: string, field: 'earned' | 'weight' | 'name', val: any) => {
    setAssessments(
      assessments.map((a) => {
        if (a.id === id) {
          return { ...a, [field]: field === 'name' ? val : Number(val) };
        }
        return a;
      })
    );
  };

  // Calculations
  const totalWeight = assessments.reduce((sum, a) => sum + a.weight, 0);

  // Completed weight vs remaining weight
  // For items where earned > 0 or specified as completed, let's calculate current score earned so far
  // Or let's treat any item with weight as part of the total.
  // Current weighted score = sum(earned * (weight / 100)) for all items
  const currentWeightedScore = assessments.reduce((sum, a) => sum + (a.earned * (a.weight / 100)), 0);
  const completedWeight = assessments.reduce((sum, a) => sum + (a.weight > 0 ? a.weight : 0), 0);

  // If we want to know what score is needed on a specific remaining item (or remaining weight),
  // let's identify items with 0 earned (or select a target item, e.g. Final Exam)
  const remainingAssessments = assessments.filter((a) => a.earned === 0);
  const remainingWeight = remainingAssessments.reduce((sum, a) => sum + a.weight, 0);

  // Score needed on remaining assessments to reach target overall
  // Target = currentEarnedPoints + (remainingNeeded * (remainingWeight/100))
  const pointsAlreadyEarned = assessments.reduce((sum, a) => sum + (a.earned > 0 ? a.earned * (a.weight / 100) : 0), 0);
  const pointsNeeded = targetOverall - pointsAlreadyEarned;
  const scoreNeededOnRemaining = remainingWeight > 0 ? (pointsNeeded / (remainingWeight / 100)) : 0;

  const getLetterGrade = (pct: number) => {
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-slate-100">Exam Weightage & Target Grade Calculator</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Add exams, quizzes, and assignments with custom percentage weights to calculate current standing and required final scores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Assessment List & Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" /> Course Assessments & Weightages
              </h3>

              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1 w-full md:w-auto">
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => handleUpdate(a.id, 'name', e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 w-full"
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Earned (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={a.earned}
                          onChange={(e) => handleUpdate(a.id, 'earned', e.target.value)}
                          className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Weight (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={a.weight}
                          onChange={(e) => handleUpdate(a.id, 'weight', e.target.value)}
                          className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAssessment(a.id)}
                        className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition mt-4 md:mt-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Assessment Form */}
              <form onSubmit={handleAddAssessment} className="pt-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Assessment name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 md:col-span-2"
                />
                <input
                  type="number"
                  placeholder="Earned %"
                  value={newEarned}
                  onChange={(e) => setNewEarned(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Weight %"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" /> Grade Performance Summary
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Current Weighted Grade</div>
                  <div className="text-3xl font-bold text-indigo-400 mt-1">
                    {currentWeightedScore.toFixed(1)}%
                    <span className="text-lg font-normal text-slate-300 ml-2">({getLetterGrade(currentWeightedScore)})</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Total Weight Accounted: {totalWeight}%</div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                    <Target className="w-3.5 h-3.5 text-indigo-400" /> Target Overall Grade (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={targetOverall}
                    onChange={(e) => setTargetOverall(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono"
                  />
                </div>

                <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-900/60 space-y-2">
                  <div className="text-xs font-semibold text-indigo-300">Required on Remaining ({remainingWeight}% weight):</div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {remainingWeight > 0 ? `${scoreNeededOnRemaining.toFixed(1)}%` : 'All Graded'}
                  </div>
                  <div className="text-[11px] text-indigo-200/80">
                    {scoreNeededOnRemaining > 100
                      ? '⚠️ Target exceeds 100% possible score.'
                      : scoreNeededOnRemaining < 0
                      ? '🎉 Already secured target grade!'
                      : `You need an average of ${scoreNeededOnRemaining.toFixed(1)}% on remaining tasks to achieve your ${targetOverall}% goal.`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
