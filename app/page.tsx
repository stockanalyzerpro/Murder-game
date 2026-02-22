'use client';

import { useState } from 'react';
import { initGame, requestLabTest, advanceDay, submitCase, MAX_DAYS } from '@/lib/engine';
import { SUSPECTS, EVIDENCE, LAB_TESTS } from '@/lib/data';
import type { GameState, SubmitResult } from '@/types';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() => initGame());
  const [selectedTestId, setSelectedTestId] = useState<string>(LAB_TESTS[0].id);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(EVIDENCE[0].id);
  const [accusedId, setAccusedId] = useState<string>(SUSPECTS[0].id);
  const [motive, setMotive] = useState<string>('');
  const [referencedEvidence, setReferencedEvidence] = useState<string[]>([]);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRequestTest() {
    const result = requestLabTest(gameState, selectedTestId, selectedEvidenceId);
    if (result.success && result.newState) {
      setGameState(result.newState);
      setError(null);
    } else {
      setError(result.error ?? 'Unknown error');
    }
  }

  function handleAdvanceDay() {
    setGameState((prev) => advanceDay(prev));
    setError(null);
  }

  function handleToggleEvidence(evidenceId: string) {
    setReferencedEvidence((prev) =>
      prev.includes(evidenceId) ? prev.filter((e) => e !== evidenceId) : [...prev, evidenceId]
    );
  }

  function handleSubmit() {
    if (!motive.trim()) {
      setError('Please enter a motive before submitting.');
      return;
    }
    const { newState, result } = submitCase(gameState, accusedId, motive, referencedEvidence);
    setGameState(newState);
    setSubmitResult(result);
    setError(null);
  }

  function handleReset() {
    setGameState(initGame());
    setSubmitResult(null);
    setError(null);
    setMotive('');
    setReferencedEvidence([]);
    setAccusedId(SUSPECTS[0].id);
    setSelectedTestId(LAB_TESTS[0].id);
    setSelectedEvidenceId(EVIDENCE[0].id);
  }

  const dayExhausted = gameState.currentDay >= MAX_DAYS;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-red-400 tracking-widest uppercase">
          ⚖ Murder Investigation Engine
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          DA Homicide Task Force — Active Case File
        </p>
      </header>

      {/* Day tracker */}
      <section className="flex items-center gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded px-4 py-2">
          <span className="text-gray-400 text-xs uppercase tracking-wider">Investigation Day</span>
          <div className="text-3xl font-bold text-yellow-400">
            {gameState.currentDay}
            <span className="text-gray-500 text-lg"> / {MAX_DAYS}</span>
          </div>
        </div>
        {!gameState.submitted && (
          <button
            onClick={handleAdvanceDay}
            disabled={dayExhausted}
            className="bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold transition"
          >
            Advance Day →
          </button>
        )}
        {dayExhausted && !gameState.submitted && (
          <span className="text-red-400 text-sm">Time limit reached — submit or review findings.</span>
        )}
      </section>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded px-4 py-2 text-sm">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suspect List */}
        <section className="bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Suspects
          </h2>
          <ul className="space-y-3">
            {SUSPECTS.map((s) => (
              <li key={s.id} className="border border-gray-700 rounded p-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                    {s.role}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">{s.baseProfile}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Evidence List */}
        <section className="bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Evidence
          </h2>
          <ul className="space-y-3">
            {EVIDENCE.map((e) => (
              <li key={e.id} className="border border-gray-700 rounded p-3">
                <div className="font-semibold text-white text-sm">{e.title}</div>
                <p className="text-gray-400 text-xs mt-1">{e.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Lab Test Panel */}
      {!gameState.submitted && (
        <section className="bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Lab Test Request
          </h2>
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
                    {t.name} ({t.duration}d)
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
                {EVIDENCE.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRequestTest}
              disabled={dayExhausted}
              className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded text-sm font-semibold transition"
            >
              Submit to Lab
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Tests must match evidence requirements. Results available after test duration (days).
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Tests */}
        <section className="bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-yellow-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Pending Tests ({gameState.pendingTests.length})
          </h2>
          {gameState.pendingTests.length === 0 ? (
            <p className="text-gray-500 text-sm">No tests in progress.</p>
          ) : (
            <ul className="space-y-2">
              {gameState.pendingTests.map((p) => {
                const test = LAB_TESTS.find((t) => t.id === p.testId);
                const ev = EVIDENCE.find((e) => e.id === p.evidenceId);
                return (
                  <li key={`${p.testId}-${p.evidenceId}`} className="border border-gray-700 rounded p-2 text-sm">
                    <span className="text-white">{test?.name}</span>
                    <span className="text-gray-400"> — {ev?.title}</span>
                    <span className="text-yellow-400 ml-2 text-xs">Ready Day {p.readyDay}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Completed Results */}
        <section className="bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-green-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Completed Results ({gameState.completedTests.length})
          </h2>
          {gameState.completedTests.length === 0 ? (
            <p className="text-gray-500 text-sm">No results yet.</p>
          ) : (
            <ul className="space-y-2">
              {gameState.completedTests.map((c) => {
                const test = LAB_TESTS.find((t) => t.id === c.testId);
                const ev = EVIDENCE.find((e) => e.id === c.evidenceId);
                return (
                  <li key={`${c.testId}-${c.evidenceId}`} className="border border-green-900 rounded p-2 text-sm">
                    <div className="font-semibold text-green-300">
                      {test?.name} — {ev?.title}
                    </div>
                    <p className="text-gray-300 text-xs mt-1">{c.result}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Submit Case */}
      {!gameState.submitted && (
        <section className="bg-gray-900 border border-yellow-700 rounded p-4">
          <h2 className="text-yellow-400 font-semibold uppercase text-sm tracking-wider mb-3">
            Submit Case to DA
          </h2>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Accuse Suspect</label>
              <select
                value={accusedId}
                onChange={(e) => setAccusedId(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white max-w-xs"
              >
                {SUSPECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Proposed Motive</label>
              <input
                type="text"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="e.g. Financial desperation"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white max-w-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Reference Evidence (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {EVIDENCE.map((e) => (
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
            <button
              onClick={handleSubmit}
              className="bg-red-700 hover:bg-red-600 px-6 py-2 rounded text-sm font-bold tracking-wider transition"
            >
              FILE CHARGES →
            </button>
          </div>
        </section>
      )}

      {/* Verdict */}
      {submitResult && (
        <section className="bg-gray-900 border-2 border-yellow-500 rounded p-6 text-center space-y-3">
          <h2 className="text-yellow-400 text-2xl font-bold uppercase tracking-widest">
            {submitResult.verdict}
          </h2>
          <div className="text-5xl font-bold text-white">{submitResult.score}</div>
          <p className="text-gray-400 text-sm">Prosecution Score</p>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm max-w-sm mx-auto">
            <div className={`rounded p-2 ${submitResult.details.correctSuspect ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {submitResult.details.correctSuspect ? '✓' : '✗'} Correct Suspect
            </div>
            <div className={`rounded p-2 ${submitResult.details.motiveMatch ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {submitResult.details.motiveMatch ? '✓' : '✗'} Motive Match
            </div>
            <div className={`rounded p-2 ${submitResult.details.forensicAnchors >= 2 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {submitResult.details.forensicAnchors >= 2 ? '✓' : '✗'} Forensic Evidence ({submitResult.details.forensicAnchors}/2)
            </div>
            <div className={`rounded p-2 ${submitResult.details.plantedEvidenceUsed ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
              {submitResult.details.plantedEvidenceUsed ? '✗' : '✓'} No Planted Evidence
            </div>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-sm font-semibold transition"
          >
            New Investigation
          </button>
        </section>
      )}
    </main>
  );
}
