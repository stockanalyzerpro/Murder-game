import { SCENARIOS, LAB_TESTS } from './data';
import type { GameState, PendingTest, CompletedTest, SubmitResult } from '@/types';

export const MAX_DAYS = 10;

export function initGame(): GameState {
  const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
  return {
    currentDay: 1,
    selectedScenarioId: SCENARIOS[randomIndex].id,
    pendingTests: [],
    completedTests: [],
    submitted: false,
  };
}

export function requestLabTest(
  state: GameState,
  testId: string,
  evidenceId: string
): { success: boolean; error?: string; newState?: GameState } {
  const test = LAB_TESTS.find((t) => t.id === testId);
  if (!test) {
    return { success: false, error: 'Unknown lab test.' };
  }

  if (!test.evidenceRequired.includes(evidenceId)) {
    return {
      success: false,
      error: `Evidence "${evidenceId}" is not compatible with test "${test.name}".`,
    };
  }

  const alreadyPending = state.pendingTests.some(
    (p) => p.testId === testId && p.evidenceId === evidenceId
  );
  const alreadyCompleted = state.completedTests.some(
    (c) => c.testId === testId && c.evidenceId === evidenceId
  );
  if (alreadyPending || alreadyCompleted) {
    return { success: false, error: 'This test has already been requested.' };
  }

  if (state.currentDay >= MAX_DAYS) {
    return { success: false, error: 'No time remaining to submit new tests.' };
  }

  const entry: PendingTest = {
    testId,
    evidenceId,
    readyDay: state.currentDay + test.duration,
  };

  return {
    success: true,
    newState: {
      ...state,
      pendingTests: [...state.pendingTests, entry],
    },
  };
}

export function advanceDay(state: GameState): GameState {
  if (state.currentDay >= MAX_DAYS || state.submitted) return state;

  const scenario = SCENARIOS.find((s) => s.id === state.selectedScenarioId)!;
  const nextDay = state.currentDay + 1;

  const nowReady = state.pendingTests.filter((p) => p.readyDay <= nextDay);
  const stillPending = state.pendingTests.filter((p) => p.readyDay > nextDay);

  const newCompleted: CompletedTest[] = nowReady.map((p) => ({
    testId: p.testId,
    evidenceId: p.evidenceId,
    result: scenario.forensicResults[p.testId] ?? 'No result recorded for this test.',
  }));

  return {
    ...state,
    currentDay: nextDay,
    pendingTests: stillPending,
    completedTests: [...state.completedTests, ...newCompleted],
  };
}

export function submitCase(
  state: GameState,
  accusedSuspectId: string,
  providedMotive: string,
  referencedEvidence: string[]
): { newState: GameState; result: SubmitResult } {
  const scenario = SCENARIOS.find((s) => s.id === state.selectedScenarioId)!;

  let score = 0;
  const correctSuspect = accusedSuspectId === scenario.killerId;
  const motiveMatch =
    providedMotive.toLowerCase().includes(scenario.motive.toLowerCase()) ||
    scenario.motive.toLowerCase().includes(providedMotive.toLowerCase());

  // Count forensic anchors: completed tests whose evidence is referenced
  const forensicAnchorEvidence = state.completedTests.map((c) => c.evidenceId);
  const referencedForensicAnchor = referencedEvidence.filter((e) =>
    forensicAnchorEvidence.includes(e)
  );
  const forensicAnchorCount = referencedForensicAnchor.length;

  // Check if planted evidence was used
  const plantedEvidenceUsed = referencedEvidence.some((e) =>
    scenario.plantedEvidence.includes(e)
  );

  if (correctSuspect) score += 40;
  if (motiveMatch) score += 20;
  if (forensicAnchorCount >= 2) score += 20;
  if (plantedEvidenceUsed) score -= 20;

  let verdict: string;
  if (score >= 80) {
    verdict = 'Indictment Secured';
  } else if (score >= 60) {
    verdict = 'Weak Case';
  } else {
    verdict = 'Case Collapse';
  }

  return {
    newState: { ...state, submitted: true },
    result: {
      score,
      verdict,
      details: {
        correctSuspect,
        motiveMatch,
        forensicAnchors: forensicAnchorCount,
        plantedEvidenceUsed,
      },
    },
  };
}
