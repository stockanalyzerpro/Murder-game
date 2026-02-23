'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SCENARIOS } from '@/lib/data';

type CaseStatus = 'NEW' | 'IN_PROGRESS' | 'SOLVED';

function getCaseStatuses(): Record<string, CaseStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('caseStatuses');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function DifficultyStars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 tracking-wider" aria-label={`${rating} out of 5 difficulty`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const styles: Record<CaseStatus, string> = {
    NEW: 'bg-blue-700 text-blue-100',
    IN_PROGRESS: 'bg-yellow-700 text-yellow-100',
    SOLVED: 'bg-green-700 text-green-100',
  };
  const labels: Record<CaseStatus, string> = {
    NEW: 'NEW',
    IN_PROGRESS: 'IN PROGRESS',
    SOLVED: 'SOLVED',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function Home() {
  const [statuses, setStatuses] = useState<Record<string, CaseStatus>>({});

  useEffect(() => {
    setStatuses(getCaseStatuses());
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-red-400 tracking-widest uppercase">
          ⚖ DA Homicide Task Force — Case Files
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Select a case to begin your investigation. Physical evidence cards, suspect dossiers, and charging packets required.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SCENARIOS.map((scenario) => {
          const status: CaseStatus = statuses[scenario.id] || 'NEW';
          return (
            <Link
              key={scenario.id}
              href={`/case/${scenario.id}`}
              className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-red-700 hover:bg-gray-900/80 transition group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Case #{scenario.id.replace('scenario_', '')}
                </span>
                <StatusBadge status={status} />
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-red-400 transition mb-2">
                {scenario.title}
              </h2>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {scenario.tagline}
              </p>

              {status === 'IN_PROGRESS' && (
                <p className="text-yellow-400 text-xs mb-3 italic">
                  Active — click to resume
                </p>
              )}

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Difficulty</span>
                  <DifficultyStars rating={scenario.difficulty} />
                </div>
                <div className="flex justify-between">
                  <span>Est. Time</span>
                  <span className="text-gray-300">~{scenario.defaultTimerMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Players</span>
                  <span className="text-gray-300">{scenario.playerCount} Players</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
