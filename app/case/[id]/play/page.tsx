'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SCENARIOS, SUSPECTS, EVIDENCE, LAB_TESTS } from '@/lib/data';
import { initGame, requestLabTest, resolveReadyTests, submitCase } from '@/lib/engine';
import type { GameState, SubmitResult } from '@/types';

type Tab = 'evidence' | 'lab' | 'interviews' | 'results';

function formatTime(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayPage() {
  const params = useParams();
  const scenarioId = params.id as string;
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('evidence');
  const [selectedTestId, setSelectedTestId] = useState<string>(LAB_TESTS[0].id);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(EVIDENCE[0].id);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(-1);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [accusedId, setAccusedId] = useState<string>(SUSPECTS[0].id);
  const [motive, setMotive] = useState('');
  const [referencedEvidence, setReferencedEvidence] = useState<string[]>([]);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [viewedResults, setViewedResults] = useState<Set<string>>(new Set());
  const [expandedSuspect, setExpandedSuspect] = useState<string | null>(null);

  // Load game state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(`gameState_${scenarioId}`);
    if (saved) {
      setGameState(JSON.parse(saved));
    } else if (scenario) {
      const fresh = initGame(scenarioId, scenario.defaultTimerMinutes);
      setGameState(fresh);
      localStorage.setItem(`gameState_${scenarioId}`, JSON.stringify(fresh));
    }
  }, [scenarioId, scenario]);

  // Persist game state
  const persistState = useCallback(
    (state: GameState) => {
      setGameState(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`gameState_${scenarioId}`, JSON.stringify(state));
      }
    },
    [scenarioId]
  );

  // Countdown timer + auto-resolve tests
  useEffect(() => {
    if (!gameState || gameState.submitted) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - gameState.startedAt;
      const total = gameState.timerMinutes * 60 * 1000;
      setTimeRemaining(Math.max(0, total - elapsed));

      // Resolve any ready tests
      const resolved = resolveReadyTests(gameState);
      if (resolved !== gameState) {
        persistState(resolved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, persistState]);

  if (!scenario) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-400">Case Not Found</h1>
        <Link href="/" className="text-blue-400 hover:underline text-sm">← Return to Case Files</Link>
      </main>
    );
  }

  if (!gameState) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <p className="text-gray-400">Loading case...</p>
      </main>
    );
  }

  const suspects = SUSPECTS.filter((s) => scenario.suspectIds.includes(s.id));
  const evidence = EVIDENCE.filter((e) => scenario.evidenceIds.includes(e.id));
  const timerReady = timeRemaining >= 0;
  const isTimeCritical = timerReady && timeRemaining > 0 && timeRemaining < 10 * 60 * 1000;
  const isTimeExpired = timerReady && timeRemaining <= 0 && !gameState.submitted;

  function handleSubmitTest() {
    if (!gameState) return;
    const result = requestLabTest(gameState, selectedTestId, selectedEvidenceId);
    if (result.success && result.newState) {
      persistState(result.newState);
      setError(null);
    } else {
      setError(result.error ?? 'Unknown error');
    }
  }

  function handleToggleEvidence(evidenceId: string) {
    setReferencedEvidence((prev) =>
      prev.includes(evidenceId) ? prev.filter((e) => e !== evidenceId) : [...prev, evidenceId]
    );
  }

  function handleFileCharges() {
    if (!gameState) return;
    if (!motive.trim()) {
      setError('Please enter a motive before submitting.');
      return;
    }
    const { newState, result } = submitCase(gameState, accusedId, motive, referencedEvidence);
    persistState(newState);
    setSubmitResult(result);
    setShowChargeModal(false);
    setError(null);

    // Mark case as solved
    if (typeof window !== 'undefined') {
      const statuses = JSON.parse(localStorage.getItem('caseStatuses') || '{}');
      statuses[scenarioId] = 'SOLVED';
      localStorage.setItem('caseStatuses', JSON.stringify(statuses));
    }
  }

  function getEvidenceStatus(evidenceId: string): string {
    const isPending = gameState!.pendingTests.some((p) => p.evidenceId === evidenceId);
    const isCompleted = gameState!.completedTests.some((c) => c.evidenceId === evidenceId);
    if (isCompleted) return 'Results Ready';
    if (isPending) return 'Sent to Lab';
    return 'In Hand';
  }

  function markResultViewed(key: string) {
    setViewedResults((prev) => new Set(prev).add(key));
  }

  const newResultsCount = gameState.completedTests.filter(
    (c) => !viewedResults.has(`${c.testId}-${c.evidenceId}`)
  ).length;

  // Verdict screen
  if (submitResult) {
    return (
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <section className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-8 text-center space-y-4">
          <h2 className="text-yellow-400 text-3xl font-bold uppercase tracking-widest">
            {submitResult.verdict}
          </h2>
          <div className="text-6xl font-bold text-white">{submitResult.score}</div>
          <p className="text-gray-400 text-sm">Prosecution Score</p>

          <div className="grid grid-cols-2 gap-2 mt-6 text-sm max-w-md mx-auto">
            <div className={`rounded p-2 ${submitResult.details.correctSuspect ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {submitResult.details.correctSuspect ? '✓' : '✗'} Correct Suspect
            </div>
            <div className={`rounded p-2 ${submitResult.details.motiveMatch ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {submitResult.details.motiveMatch ? '✓' : '✗'} Motive Match
            </div>
            <div className={`rounded p-2 ${submitResult.details.anchorSupportsAccused ? 'bg-green-900 text-green-300' : submitResult.details.anchorDiscovered ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-400'}`}>
              {submitResult.details.anchorSupportsAccused ? '✓' : submitResult.details.anchorDiscovered ? '✗' : '—'} Forensic Anchor
            </div>
            <div className={`rounded p-2 ${submitResult.details.plantedEvidenceUsed ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
              {submitResult.details.plantedEvidenceUsed ? '✗' : '✓'} No Planted Evidence
            </div>
            <div className={`rounded p-2 col-span-2 ${submitResult.details.timeExpired ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
              {submitResult.details.timeExpired ? '✗ Time Expired (−15)' : '✓ Time Bonus (+10)'}
            </div>
          </div>

          <Link
            href="/"
            className="inline-block mt-6 bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded text-sm font-semibold transition"
          >
            Return to Case Files
          </Link>
        </section>
      </main>
    );
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'evidence', label: 'Evidence' },
    { id: 'lab', label: 'Lab Terminal' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'results', label: 'Results', badge: newResultsCount > 0 ? newResultsCount : undefined },
  ];

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-4">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-gray-950 border-b border-gray-700 -mx-4 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`text-2xl font-bold tabular-nums ${
              isTimeCritical ? 'text-red-400 animate-pulse' : isTimeExpired ? 'text-red-600' : 'text-green-400'
            }`}
          >
            {!timerReady ? '--:--' : isTimeExpired ? '0:00' : formatTime(timeRemaining)}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Active Case</div>
            <div className="text-sm text-white font-semibold">{scenario.title}</div>
          </div>
        </div>
        <button
          onClick={() => setShowChargeModal(true)}
          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold tracking-wider transition uppercase"
        >
          File Charges
        </button>
      </div>

      {isTimeExpired && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded px-4 py-2 text-sm">
          ⚠ Time has expired — you may still file charges, but a time penalty will apply.
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded px-4 py-2 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-700 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold transition relative ${
              activeTab === tab.id
                ? 'text-red-400 border-b-2 border-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Evidence Panel */}
        {activeTab === 'evidence' && (
          <section className="space-y-3">
            <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider">
              Evidence in Play
            </h2>
            <ul className="space-y-2">
              {evidence.map((e) => {
                const status = getEvidenceStatus(e.id);
                const statusStyle =
                  status === 'Results Ready'
                    ? 'bg-green-700 text-green-100'
                    : status === 'Sent to Lab'
                    ? 'bg-yellow-700 text-yellow-100'
                    : 'bg-gray-700 text-gray-300';
                return (
                  <li key={e.id} className="bg-gray-900 border border-gray-700 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-white text-sm">{e.title}</span>
                        <p className="text-gray-400 text-xs mt-1">{e.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${statusStyle}`}>
                        {status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Lab Terminal */}
        {activeTab === 'lab' && (
          <section className="space-y-4">
            <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider">
              Lab Terminal
            </h2>

            {/* Submit Test */}
            <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-3">
              <h3 className="text-gray-300 text-sm font-semibold">Submit Evidence for Testing</h3>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Select Test</label>
                  <select
                    value={selectedTestId}
                    onChange={(e) => setSelectedTestId(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white"
                  >
                    {LAB_TESTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.delayMinutes} min)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Submit Evidence</label>
                  <select
                    value={selectedEvidenceId}
                    onChange={(e) => setSelectedEvidenceId(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white"
                  >
                    {evidence.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSubmitTest}
                  className="bg-green-700 hover:bg-green-600 px-4 py-1.5 rounded text-sm font-semibold transition"
                >
                  Submit to Lab
                </button>
              </div>
            </div>

            {/* Available Tests Reference */}
            <div className="bg-gray-900 border border-gray-700 rounded p-4">
              <h3 className="text-gray-300 text-sm font-semibold mb-2">Available Lab Tests</h3>
              <ul className="space-y-1 text-sm">
                {LAB_TESTS.map((t) => (
                  <li key={t.id} className="flex justify-between text-gray-400">
                    <span>{t.name}</span>
                    <span className="text-yellow-400">{t.delayMinutes} min</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pending Tests */}
            {gameState.pendingTests.length > 0 && (
              <div className="bg-gray-900 border border-yellow-700 rounded p-4 space-y-2">
                <h3 className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
                  Processing ({gameState.pendingTests.length})
                </h3>
                {gameState.pendingTests.map((p) => {
                  const test = LAB_TESTS.find((t) => t.id === p.testId);
                  const ev = EVIDENCE.find((e) => e.id === p.evidenceId);
                  const remaining = Math.max(0, p.readyAt - Date.now());
                  return (
                    <div
                      key={`${p.testId}-${p.evidenceId}`}
                      className="border border-gray-700 rounded p-2 text-sm flex justify-between items-center"
                    >
                      <div>
                        <span className="text-white">{test?.name}</span>
                        <span className="text-gray-400"> — {ev?.title}</span>
                      </div>
                      <span className="text-yellow-400 text-xs font-mono tabular-nums">
                        {remaining > 0 ? formatTime(remaining) : 'READY'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Suspect Interviews */}
        {activeTab === 'interviews' && (
          <section className="space-y-3">
            <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider">
              Suspect Interviews
            </h2>
            <ul className="space-y-2">
              {suspects.map((s) => {
                const isExpanded = expandedSuspect === s.id;
                const statement = scenario.interviewVariations[s.id];
                return (
                  <li key={s.id} className="bg-gray-900 border border-gray-700 rounded overflow-hidden">
                    <button
                      onClick={() => setExpandedSuspect(isExpanded ? null : s.id)}
                      className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-800 transition"
                    >
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <span className="text-xs text-gray-400 ml-2 bg-gray-800 px-2 py-0.5 rounded">
                          {s.role}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {isExpanded ? '▲ Hide' : '▼ View Statement'}
                      </span>
                    </button>
                    {isExpanded && statement && (
                      <div className="border-t border-gray-700 p-4 bg-gray-950">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Interview Transcript — {s.name}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed italic">
                          &ldquo;{statement}&rdquo;
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Completed Results */}
        {activeTab === 'results' && (
          <section className="space-y-3">
            <h2 className="text-green-400 font-semibold uppercase text-sm tracking-wider">
              Completed Lab Results ({gameState.completedTests.length})
            </h2>
            {gameState.completedTests.length === 0 ? (
              <p className="text-gray-500 text-sm">No results yet. Submit evidence to the lab to begin testing.</p>
            ) : (
              <ul className="space-y-2">
                {gameState.completedTests.map((c) => {
                  const test = LAB_TESTS.find((t) => t.id === c.testId);
                  const ev = EVIDENCE.find((e) => e.id === c.evidenceId);
                  const key = `${c.testId}-${c.evidenceId}`;
                  const isNew = !viewedResults.has(key);
                  return (
                    <li
                      key={key}
                      onClick={() => markResultViewed(key)}
                      className={`border rounded p-3 text-sm cursor-pointer transition ${
                        isNew
                          ? 'border-green-600 bg-green-900/20'
                          : 'border-gray-700 bg-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-green-300">
                          {test?.name} — {ev?.title}
                        </div>
                        {isNew && (
                          <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-xs mt-1">{c.result}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>

      {/* File Charges Modal */}
      {showChargeModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-yellow-400 font-bold uppercase text-lg tracking-wider">
              File Charges with the DA
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Accuse Suspect</label>
              <select
                value={accusedId}
                onChange={(e) => setAccusedId(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white"
              >
                {suspects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Proposed Motive</label>
              <textarea
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="e.g. Financial desperation"
                rows={3}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Reference Evidence</label>
              <div className="flex flex-wrap gap-2">
                {evidence.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleToggleEvidence(e.id)}
                    className={`px-3 py-1 rounded text-xs border transition ${
                      referencedEvidence.includes(e.id)
                        ? 'bg-yellow-700 border-yellow-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleFileCharges}
                className="bg-red-700 hover:bg-red-600 px-6 py-2 rounded text-sm font-bold tracking-wider transition flex-1"
              >
                Submit to DA
              </button>
              <button
                onClick={() => setShowChargeModal(false)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-sm font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
