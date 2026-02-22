export interface Suspect {
  id: string;
  name: string;
  role: string;
  baseProfile: string;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
}

export interface LabTest {
  id: string;
  name: string;
  duration: number;
  evidenceRequired: string[];
}

export interface ForensicAnchor {
  testId: string;
  evidenceId: string;
  supportsSuspectId: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface Scenario {
  id: string;
  killerId: string;
  motive: string;
  forensicResults: Record<string, string>;
  plantedEvidence: string[];
  interviewVariations: Record<string, string>;
  forensicAnchor?: ForensicAnchor;
}

export interface PendingTest {
  testId: string;
  evidenceId: string;
  readyDay: number;
}

export interface CompletedTest {
  testId: string;
  evidenceId: string;
  result: string;
}

export interface GameState {
  currentDay: number;
  selectedScenarioId: string;
  pendingTests: PendingTest[];
  completedTests: CompletedTest[];
  submitted: boolean;
}

export interface SubmitResult {
  score: number;
  verdict: string;
  details: {
    correctSuspect: boolean;
    motiveMatch: boolean;
    anchorDiscovered: boolean;
    anchorSupportsAccused: boolean;
    plantedEvidenceUsed: boolean;
  };
}
