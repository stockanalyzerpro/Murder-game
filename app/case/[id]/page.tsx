'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SCENARIOS, SUSPECT_PROFILES, EVIDENCE_TYPES, CRIME_SCENE_TILES, STORY_CARDS } from '@/lib/data';
import type { GameState } from '@/types';

const TIMER_PRESETS = [
  { label: 'Beginner', minutes: 120 },
  { label: 'Standard', minutes: 90 },
  { label: 'Hard', minutes: 75 },
  { label: 'Cold Case', minutes: 60 },
];

function DifficultyStars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 tracking-wider">
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

function formatElapsed(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CaseBriefingPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const [timerMinutes, setTimerMinutes] = useState<number>(
    scenario?.defaultTimerMinutes ?? 90
  );
  const [activeGame, setActiveGame] = useState<GameState | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`gameState_${scenarioId}`);
      if (raw) {
        const parsed: GameState = JSON.parse(raw);
        if (!parsed.submitted) {
          setActiveGame(parsed);
        }
      }
    } catch {
      // ignore corrupt state
    }
  }, [scenarioId]);

  if (!scenario) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-red-400">Case Not Found</h1>
        <Link href="/" className="text-blue-400 hover:underline text-sm">
          ← Return to Case Files
        </Link>
      </main>
    );
  }

  const suspects = scenario.suspectAssignments.map((assignment) => {
    const profile = SUSPECT_PROFILES.find((p) => p.id === assignment.profileId);
    return { ...assignment, profile };
  });
  const evidence = scenario.evidenceContent.map((ce) => {
    const evType = EVIDENCE_TYPES.find((et) => et.id === ce.typeId);
    return { ...ce, evType };
  });
  const tiles = scenario.tileConfiguration.map((tc) => {
    const tile = CRIME_SCENE_TILES.find((t) => t.id === tc.tileId);
    return { ...tc, tile };
  });
  const storyCards = STORY_CARDS.filter((sc) => scenario.storyCardIds.includes(sc.id));

  function handleResume() {
    router.push(`/case/${scenarioId}/play`);
  }

  function handleStart() {
    if (typeof window !== 'undefined') {
      const statuses = JSON.parse(localStorage.getItem('caseStatuses') || '{}');
      statuses[scenarioId] = 'IN_PROGRESS';
      localStorage.setItem('caseStatuses', JSON.stringify(statuses));

      const gameState: GameState = {
        selectedScenarioId: scenarioId,
        timerMinutes,
        startedAt: Date.now(),
        pendingTests: [],
        completedTests: [],
        submitted: false,
      };
      localStorage.setItem(`gameState_${scenarioId}`, JSON.stringify(gameState));
    }
    router.push(`/case/${scenarioId}/play`);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <Link href="/" className="text-gray-400 hover:text-white text-sm transition">
        ← Back to Case Files
      </Link>

      {/* Case Header */}
      <header className="border-b border-gray-700 pb-4 space-y-2">
        <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
          <span>Case #{scenario.id.replace('scenario_', '')}</span>
          <span>•</span>
          <DifficultyStars rating={scenario.difficulty} />
          <span>•</span>
          <span>~{scenario.defaultTimerMinutes} min</span>
          <span>•</span>
          <span>{scenario.playerCount} Players</span>
        </div>
        <h1 className="text-3xl font-bold text-red-400 tracking-wide uppercase">
          {scenario.title}
        </h1>
        <p className="text-gray-400 italic">{scenario.tagline}</p>
      </header>

      {/* Tile Configuration */}
      <section className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-red-400 font-semibold uppercase text-sm tracking-wider">
          Crime Scene Setup
        </h2>
        <p className="text-gray-400 text-sm">Lay out the following crime scene tiles from the box:</p>
        <ul className="space-y-2">
          {tiles.map((tc) => (
            <li key={tc.tileId} className="text-gray-300 text-sm flex items-center gap-2">
              <span className="text-red-400">▸</span>
              <span className="text-white font-semibold">{tc.tile?.name ?? tc.tileId}</span>
              <span className="text-gray-500 text-xs">({tc.tile?.physicalTileNumber})</span>
              {tc.hasVictim && <span className="text-red-400 text-xs ml-2 bg-red-900/40 px-2 py-0.5 rounded">VICTIM</span>}
            </li>
          ))}
        </ul>
        {storyCards.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Read these Story Cards:</h3>
            <ul className="space-y-1">
              {storyCards.map((sc) => (
                <li key={sc.id} className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="text-yellow-400">▸</span>
                  <span className="text-white">{sc.title}</span>
                  <span className="text-gray-500 text-xs">({sc.physicalCardNumber})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Setup Instructions */}
      <section className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-5">
        <h2 className="text-yellow-400 font-semibold uppercase text-sm tracking-wider">
          Prepare Your Case File
        </h2>

        <div>
          <h3 className="text-gray-300 text-sm font-semibold mb-2">
            Pull these Suspect Dossiers from the box:
          </h3>
          <ul className="space-y-1">
            {suspects.map((s) => (
              <li key={s.profileId} className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-red-400">▸</span>
                <span className="text-white">{s.profile?.name ?? s.profileId}</span>
                <span className="text-gray-500">— {s.roleInCase}</span>
                <span className="text-gray-600 text-xs">({s.profileId})</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-300 text-sm font-semibold mb-2">
            Pull these Evidence Cards:
          </h3>
          <ul className="space-y-1">
            {evidence.map((e) => (
              <li key={e.typeId} className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-red-400">▸</span>
                <span className="text-white">{e.evType?.category ?? e.typeId}</span>
                <span className="text-gray-500 text-xs">({e.evType?.physicalCardNumber})</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-300 text-sm font-semibold mb-2">
            Grab from the box:
          </h3>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li className="flex items-center gap-2"><span className="text-red-400">▸</span> 1× Timeline Board</li>
            <li className="flex items-center gap-2"><span className="text-red-400">▸</span> 1× Evidence Log Sheet</li>
            <li className="flex items-center gap-2"><span className="text-red-400">▸</span> 1× DA Charging Packet</li>
          </ul>
        </div>
      </section>

      {/* Rules Quick Reference */}
      <section className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-gray-300 font-semibold uppercase text-sm tracking-wider mb-3">
          Rules Quick Reference
        </h2>
        <ol className="list-decimal list-inside text-gray-400 text-sm space-y-1">
          <li>Investigate — review evidence cards and suspect dossiers</li>
          <li>Test Evidence — submit items to the lab and wait for real-time results</li>
          <li>Interview Suspects — read their statements for this case</li>
          <li>File Charges — accuse a suspect before the timer runs out</li>
        </ol>
      </section>

      {/* Timer Selection */}
      <section className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-3">
        <h2 className="text-gray-300 font-semibold uppercase text-sm tracking-wider">
          Timer Selection
        </h2>
        <p className="text-gray-500 text-xs">
          Default for this difficulty: {scenario.defaultTimerMinutes} minutes. Adjust if desired.
        </p>
        <div className="flex flex-wrap gap-2">
          {TIMER_PRESETS.map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => setTimerMinutes(preset.minutes)}
              className={`px-4 py-2 rounded text-sm border transition ${
                timerMinutes === preset.minutes
                  ? 'bg-red-700 border-red-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              {preset.label} ({preset.minutes} min)
            </button>
          ))}
        </div>
      </section>

      {/* Resume Investigation */}
      {activeGame && (() => {
        const elapsed = Date.now() - activeGame.startedAt;
        const totalMs = activeGame.timerMinutes * 60 * 1000;
        const remaining = Math.max(0, totalMs - elapsed);
        return (
          <section className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 space-y-4">
            <h2 className="text-yellow-400 font-semibold uppercase text-sm tracking-wider">
              Active Investigation In Progress
            </h2>
            <p className="text-gray-300 text-sm">You have an active investigation in progress.</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Time elapsed: <span className="text-white">{formatElapsed(elapsed)}</span></p>
              <p>Time remaining: <span className={remaining === 0 ? 'text-red-400' : 'text-green-400'}>{formatElapsed(remaining)}</span></p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleResume}
                className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg transition"
              >
                Resume Investigation
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem(`gameState_${scenarioId}`);
                  }
                  handleStart();
                }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold px-6 py-3 rounded-lg transition"
              >
                Start New Investigation
              </button>
            </div>
          </section>
        );
      })()}

      {/* Start Button */}
      {!activeGame && (
        <div className="text-center py-4">
          <button
            onClick={handleStart}
            className="bg-red-700 hover:bg-red-600 text-white text-lg font-bold tracking-widest uppercase px-12 py-4 rounded-lg transition shadow-lg shadow-red-900/30"
          >
            Start Investigation
          </button>
        </div>
      )}
    </main>
  );
}
