import { SCENARIOS, LAB_TESTS } from './data';
import type { GameState, PendingTest, CompletedTest, SubmitResult } from '@/types';

export function initGame(scenarioId: string, timerMinutes: number): GameState {
  return {
    selectedScenarioId: scenarioId,
    timerMinutes,
    startedAt: Date.now(),
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

  const now = Date.now();
  const entry: PendingTest = {
    testId,
    evidenceId,
    submittedAt: now,
    readyAt: now + test.delayMinutes * 60 * 1000,
  };

  return {
    success: true,
    newState: {
      ...state,
      pendingTests: [...state.pendingTests, entry],
    },
  };
}

export function resolveReadyTests(state: GameState): GameState {
  const scenario = SCENARIOS.find((s) => s.id === state.selectedScenarioId);
  if (!scenario) return state;

  const now = Date.now();
  const nowReady = state.pendingTests.filter((p) => p.readyAt <= now);
  const stillPending = state.pendingTests.filter((p) => p.readyAt > now);

  if (nowReady.length === 0) return state;

  const newCompleted: CompletedTest[] = nowReady.map((p) => ({
    testId: p.testId,
    evidenceId: p.evidenceId,
    result: scenario.forensicResults[p.testId] ?? 'No result recorded for this test.',
  }));

  return {
    ...state,
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
  const scenario = SCENARIOS.find((s) => s.id === state.selectedScenarioId);
  if (!scenario) {
    return {
      newState: { ...state, submitted: true },
      result: {
        score: 0,
        verdict: 'Case Collapse',
        details: {
          correctSuspect: false,
          motiveMatch: false,
          anchorDiscovered: false,
          anchorSupportsAccused: false,
          plantedEvidenceUsed: false,
          timeExpired: false,
        },
      },
    };
  }

  let score = 0;
  const correctSuspect = accusedSuspectId === scenario.killerId;
  const motiveMatch =
    providedMotive.toLowerCase().includes(scenario.motive.toLowerCase()) ||
    scenario.motive.toLowerCase().includes(providedMotive.toLowerCase());

  let anchorDiscovered = false;
  let anchorSupportsAccused = false;

  if (scenario.forensicAnchor) {
    const anchor = scenario.forensicAnchor;
    const testCompleted = state.completedTests.some(
      (c) => c.testId === anchor.testId
    );
    const evidenceReferenced = referencedEvidence.includes(anchor.evidenceId);
    anchorDiscovered = testCompleted && evidenceReferenced;
    anchorSupportsAccused =
      anchorDiscovered && accusedSuspectId === anchor.supportsSuspectId;
  }

  const plantedEvidenceUsed = referencedEvidence.some((e) =>
    scenario.plantedEvidence.includes(e)
  );

  const now = Date.now();
  const elapsed = now - state.startedAt;
  const timerMs = state.timerMinutes * 60 * 1000;
  const timeExpired = elapsed > timerMs;

  if (correctSuspect) score += 40;
  if (motiveMatch) score += 20;
  if (anchorSupportsAccused) score += 25;
  if (anchorDiscovered && !anchorSupportsAccused) score -= 25;
  if (plantedEvidenceUsed) score -= 20;
  if (timeExpired) {
    score -= 15;
  } else {
    score += 10;
  }

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
        anchorDiscovered,
        anchorSupportsAccused,
        plantedEvidenceUsed,
        timeExpired,
      },
    },
  };
}
