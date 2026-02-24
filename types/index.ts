export interface EvidenceType {
  id: string;
  category: string;
  physicalCardNumber: string;
  canBeTestedWith: string[];
}

export interface CaseEvidence {
  typeId: string;
  locationFound: string;
  content: string;
  imageUrl?: string;
}

export interface SuspectProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  education: string;
  psychologicalProfile: string[];
  background: string;
  imageUrl?: string;
}

export interface CaseSuspect {
  profileId: string;
  roleInCase: string;
  motive?: string;
  relationshipToVictim: string;
  hasAccess: boolean;
}

export interface StoryCard {
  id: string;
  title: string;
  description: string;
  clueTypes: string[];
  physicalCardNumber: string;
}

export interface CrimeSceneTile {
  id: string;
  name: string;
  physicalTileNumber: string;
  imageUrl?: string;
  inspectableAreas: string[];
}

export interface InspectionResult {
  areaId: string;
  description: string;
  evidenceFound: string[];
}

export interface TileConfiguration {
  tileId: string;
  position?: { x: number; y: number };
  hasVictim?: boolean;
  evidenceMarkers?: string[];
}

export interface LabTest {
  id: string;
  name: string;
  delayMinutes: number;
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
  title: string;
  tagline: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  defaultTimerMinutes: number;
  playerCount: string;

  // Physical component setup
  tileConfiguration: TileConfiguration[];
  storyCardIds: string[];
  suspectAssignments: CaseSuspect[];

  // Interactive content
  sceneInspections: Record<string, InspectionResult>;
  evidenceContent: CaseEvidence[];

  // Case resolution
  killerId: string;
  motive: string;
  forensicResults: Record<string, string>;
  plantedEvidence: string[];
  forensicAnchor?: ForensicAnchor;
}

export interface PendingTest {
  testId: string;
  evidenceId: string;
  submittedAt: number;
  readyAt: number;
}

export interface CompletedTest {
  testId: string;
  evidenceId: string;
  result: string;
}

export interface GameState {
  selectedScenarioId: string;
  timerMinutes: number;
  startedAt: number;
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
    timeExpired: boolean;
  };
}
