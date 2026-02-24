import type { SuspectProfile, EvidenceType, LabTest, Scenario, StoryCard, CrimeSceneTile } from '@/types';

export const SUSPECT_PROFILES: SuspectProfile[] = [
  {
    id: 'S-001',
    name: 'Margaret Voss',
    age: 46,
    occupation: 'Philanthropist',
    education: 'BA in Art History',
    psychologicalProfile: ['Highly composed under pressure', 'Prone to emotional suppression'],
    background: 'Married to the victim for 12 years. Active in the local charity circuit. Recently discovered financial irregularities in joint accounts.',
  },
  {
    id: 'S-002',
    name: 'David Voss',
    age: 48,
    occupation: 'Real Estate Developer',
    education: 'MBA',
    psychologicalProfile: ['Impulsive', 'Holds grudges', 'Charismatic'],
    background: 'Estranged sibling who contested the family will two years ago. Returned to town last month under unclear circumstances.',
  },
  {
    id: 'S-003',
    name: 'Claire Voss',
    age: 21,
    occupation: 'College Student',
    education: 'Pursuing BA in Psychology',
    psychologicalProfile: ['Anxious', 'Highly intelligent', 'Conflict-avoidant'],
    background: 'College student with a troubled relationship with the victim. Recently asked for a large cash transfer that was denied.',
  },
  {
    id: 'S-004',
    name: 'Leonard Holt',
    age: 56,
    occupation: 'Business Executive',
    education: 'JD / MBA',
    psychologicalProfile: ['Calculating', 'Risk-tolerant', 'Highly organized'],
    background: 'Co-founder of Voss & Holt Industries. Audit revealed discrepancies in company accounts linked to Holt.',
  },
  {
    id: 'S-005',
    name: 'Renata Suarez',
    age: 34,
    occupation: 'Executive Assistant',
    education: 'Associate Degree in Business Admin',
    psychologicalProfile: ['Loyal', 'Observant', 'Quietly resentful'],
    background: 'Long-time assistant at Voss & Holt. Recently passed over for a promotion that went to an outside hire.',
  },
];

export const EVIDENCE_TYPES: EvidenceType[] = [
  {
    id: 'weapon',
    category: 'Weapon',
    physicalCardNumber: 'E-001',
    canBeTestedWith: ['dna_test'],
  },
  {
    id: 'fiber',
    category: 'Trace Evidence',
    physicalCardNumber: 'E-002',
    canBeTestedWith: ['fiber_analysis'],
  },
  {
    id: 'phone_records',
    category: 'Digital Records',
    physicalCardNumber: 'E-003',
    canBeTestedWith: ['gps_triangulation'],
  },
  {
    id: 'financial_docs',
    category: 'Financial Documents',
    physicalCardNumber: 'E-004',
    canBeTestedWith: ['financial_audit'],
  },
  {
    id: 'security_footage',
    category: 'Surveillance',
    physicalCardNumber: 'E-005',
    canBeTestedWith: ['footage_enhancement'],
  },
];

export const STORY_CARDS: StoryCard[] = [
  {
    id: 'SC-001',
    title: 'Hidden Affair',
    description: 'A secret romantic relationship that could destroy reputations.',
    clueTypes: ['digital_device', 'handwritten_note'],
    physicalCardNumber: 'STORY-01',
  },
  {
    id: 'SC-002',
    title: 'Insurance Fraud',
    description: 'A life insurance policy with a suspicious beneficiary change.',
    clueTypes: ['financial_docs', 'phone_records'],
    physicalCardNumber: 'STORY-02',
  },
  {
    id: 'SC-003',
    title: 'Family Grudge',
    description: 'A long-standing inheritance dispute tearing the family apart.',
    clueTypes: ['financial_docs', 'handwritten_note'],
    physicalCardNumber: 'STORY-03',
  },
  {
    id: 'SC-004',
    title: 'Embezzlement Scheme',
    description: 'Corporate funds siphoned through a web of shell companies.',
    clueTypes: ['financial_docs', 'digital_device'],
    physicalCardNumber: 'STORY-04',
  },
];

export const CRIME_SCENE_TILES: CrimeSceneTile[] = [
  {
    id: 'tile_study',
    name: 'Study',
    physicalTileNumber: 'TILE-01',
    inspectableAreas: ['desk', 'bookshelf', 'window', 'floor'],
  },
  {
    id: 'tile_kitchen',
    name: 'Kitchen',
    physicalTileNumber: 'TILE-02',
    inspectableAreas: ['counter', 'drawer', 'pantry', 'sink'],
  },
  {
    id: 'tile_master_bedroom',
    name: 'Master Bedroom',
    physicalTileNumber: 'TILE-03',
    inspectableAreas: ['bed', 'nightstand', 'closet', 'dresser'],
  },
  {
    id: 'tile_office',
    name: 'Office',
    physicalTileNumber: 'TILE-04',
    inspectableAreas: ['desk', 'filing_cabinet', 'safe', 'window'],
  },
  {
    id: 'tile_parking_lot',
    name: 'Parking Lot',
    physicalTileNumber: 'TILE-05',
    inspectableAreas: ['entrance', 'camera', 'dumpster', 'vehicle'],
  },
];

export const LAB_TESTS: LabTest[] = [
  {
    id: 'dna_test',
    name: 'DNA Analysis',
    delayMinutes: 8,
    evidenceRequired: ['weapon'],
  },
  {
    id: 'fiber_analysis',
    name: 'Fiber Spectrometry',
    delayMinutes: 5,
    evidenceRequired: ['fiber'],
  },
  {
    id: 'gps_triangulation',
    name: 'GPS Triangulation',
    delayMinutes: 3,
    evidenceRequired: ['phone_records'],
  },
  {
    id: 'financial_audit',
    name: 'Forensic Financial Audit',
    delayMinutes: 10,
    evidenceRequired: ['financial_docs'],
  },
  {
    id: 'footage_enhancement',
    name: 'Digital Footage Enhancement',
    delayMinutes: 6,
    evidenceRequired: ['security_footage'],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario_1',
    title: 'Small Town Betrayal',
    tagline: 'A prominent businessman is found dead in his study — and everyone in the family had a reason to want him gone.',
    difficulty: 2,
    defaultTimerMinutes: 90,
    playerCount: '1-4',
    tileConfiguration: [
      { tileId: 'tile_study', position: { x: 0, y: 0 }, hasVictim: true, evidenceMarkers: ['weapon', 'fiber'] },
      { tileId: 'tile_master_bedroom', position: { x: 1, y: 0 }, evidenceMarkers: ['phone_records'] },
      { tileId: 'tile_office', position: { x: 0, y: 1 }, evidenceMarkers: ['financial_docs'] },
      { tileId: 'tile_parking_lot', position: { x: 1, y: 1 }, evidenceMarkers: ['security_footage'] },
    ],
    storyCardIds: ['SC-002', 'SC-003'],
    suspectAssignments: [
      { profileId: 'S-001', roleInCase: "Victim's Spouse", motive: 'Financial desperation', relationshipToVictim: 'Married to victim for 12 years', hasAccess: true },
      { profileId: 'S-002', roleInCase: 'Estranged Brother', motive: 'Inheritance dispute', relationshipToVictim: 'Estranged sibling', hasAccess: false },
      { profileId: 'S-003', roleInCase: "Victim's Daughter", motive: 'Cash desperation', relationshipToVictim: 'Daughter', hasAccess: true },
      { profileId: 'S-004', roleInCase: 'Business Partner', motive: 'Embezzlement cover-up', relationshipToVictim: 'Co-founder of Voss & Holt Industries', hasAccess: true },
      { profileId: 'S-005', roleInCase: 'Employee / Witness', relationshipToVictim: 'Long-time assistant', hasAccess: true },
    ],
    sceneInspections: {
      study_desk: {
        areaId: 'study_desk',
        description: 'The victim\'s desk is cluttered with financial papers. A heavy crystal decanter lies shattered nearby, stained with blood.',
        evidenceFound: ['weapon', 'financial_docs'],
      },
      study_bookshelf: {
        areaId: 'study_bookshelf',
        description: 'Several leather-bound books are slightly askew. Behind one, you find a hidden compartment — empty.',
        evidenceFound: [],
      },
      study_floor: {
        areaId: 'study_floor',
        description: 'Microscopic fiber fragments are visible on the victim\'s clothing under UV light.',
        evidenceFound: ['fiber'],
      },
      master_bedroom_nightstand: {
        areaId: 'master_bedroom_nightstand',
        description: 'The victim\'s personal phone rests on the nightstand, still powered on.',
        evidenceFound: ['phone_records'],
      },
      parking_lot_camera: {
        areaId: 'parking_lot_camera',
        description: 'A CCTV camera covers the entrance. The footage is partially corrupted but time-stamped.',
        evidenceFound: ['security_footage'],
      },
    },
    evidenceContent: [
      { typeId: 'weapon', locationFound: 'study_desk', content: 'A heavy crystal decanter recovered near the scene. Blood and possible biological trace on handle.' },
      { typeId: 'fiber', locationFound: 'study_floor', content: 'Microscopic fiber fragments collected from the victim\'s clothing. Unusual weave pattern.' },
      { typeId: 'phone_records', locationFound: 'master_bedroom_nightstand', content: 'Victim\'s call log and GPS data from the night of the incident.' },
      { typeId: 'financial_docs', locationFound: 'study_desk', content: 'Bank statements and wire transfer records flagged by forensic accountant.' },
      { typeId: 'security_footage', locationFound: 'parking_lot_camera', content: 'Partial CCTV capture from the building entrance. Time-stamped but partially corrupted.' },
    ],
    killerId: 'S-001',
    motive: 'Financial desperation',
    forensicResults: {
      dna_test: 'DNA on weapon matches Margaret Voss (S-001). Profile is conclusive — no mixture detected.',
      fiber_analysis: 'Fibers are synthetic blend consistent with mass-market upholstery. Inconclusive.',
      gps_triangulation: 'Phone GPS places victim at home until 11:47 PM. No anomalous third-party pings detected.',
      financial_audit: 'Victim had secretly changed beneficiary of $2.1M life insurance policy — Margaret remains sole beneficiary.',
      footage_enhancement: 'Enhanced footage shows a figure matching Margaret Voss entering the property at 11:32 PM.',
    },
    plantedEvidence: ['financial_docs'],
    forensicAnchor: {
      testId: 'dna_test',
      evidenceId: 'weapon',
      supportsSuspectId: 'S-001',
      strength: 'strong',
    },
  },
  {
    id: 'scenario_2',
    title: 'Blood Inheritance',
    tagline: 'When the will changes, old grudges turn deadly — and the prodigal brother returns just in time.',
    difficulty: 3,
    defaultTimerMinutes: 90,
    playerCount: '1-4',
    tileConfiguration: [
      { tileId: 'tile_study', position: { x: 0, y: 0 }, hasVictim: true, evidenceMarkers: ['weapon'] },
      { tileId: 'tile_master_bedroom', position: { x: 1, y: 0 }, evidenceMarkers: ['fiber'] },
      { tileId: 'tile_office', position: { x: 0, y: 1 }, evidenceMarkers: ['financial_docs'] },
      { tileId: 'tile_parking_lot', position: { x: 1, y: 1 }, evidenceMarkers: ['security_footage', 'phone_records'] },
    ],
    storyCardIds: ['SC-003'],
    suspectAssignments: [
      { profileId: 'S-001', roleInCase: "Victim's Spouse", relationshipToVictim: 'Married to victim', hasAccess: true },
      { profileId: 'S-002', roleInCase: 'Estranged Brother', motive: 'Inheritance dispute', relationshipToVictim: 'Estranged sibling who contested the will', hasAccess: false },
      { profileId: 'S-003', roleInCase: "Victim's Daughter", relationshipToVictim: 'Daughter and new sole heir', hasAccess: true },
      { profileId: 'S-004', roleInCase: 'Business Partner', relationshipToVictim: 'Co-founder of Voss & Holt Industries', hasAccess: true },
      { profileId: 'S-005', roleInCase: 'Employee / Witness', relationshipToVictim: 'Long-time assistant', hasAccess: true },
    ],
    sceneInspections: {
      study_desk: {
        areaId: 'study_desk',
        description: 'The study shows signs of a violent confrontation. Furniture is overturned.',
        evidenceFound: ['weapon'],
      },
      study_floor: {
        areaId: 'study_floor',
        description: 'The victim\'s jacket lies crumpled on the floor with fiber residue.',
        evidenceFound: ['fiber'],
      },
      office_filing_cabinet: {
        areaId: 'office_filing_cabinet',
        description: 'A recently updated will document is filed here, disinheriting David Voss entirely.',
        evidenceFound: ['financial_docs'],
      },
      parking_lot_vehicle: {
        areaId: 'parking_lot_vehicle',
        description: 'GPS data and partial security footage can be recovered from the parking area.',
        evidenceFound: ['phone_records', 'security_footage'],
      },
    },
    evidenceContent: [
      { typeId: 'weapon', locationFound: 'study_desk', content: 'A heavy crystal decanter with degraded biological trace. The weapon was found near the overturned desk.' },
      { typeId: 'fiber', locationFound: 'study_floor', content: 'Rare cashmere blend fibers on the victim\'s jacket. Unusual weave pattern not from local sources.' },
      { typeId: 'phone_records', locationFound: 'parking_lot_vehicle', content: 'Victim\'s GPS shows a late-night drive to an off-grid rural property.' },
      { typeId: 'financial_docs', locationFound: 'office_filing_cabinet', content: 'Recently updated will removing David Voss entirely. Multi-million-dollar estate redirected to daughter.' },
      { typeId: 'security_footage', locationFound: 'parking_lot_vehicle', content: 'Partially corrupted footage from building entrance. Enhancement may reveal more.' },
    ],
    killerId: 'S-002',
    motive: 'Inheritance dispute',
    forensicResults: {
      dna_test: 'DNA profile on weapon is degraded. Cannot produce conclusive match from available sample.',
      fiber_analysis: 'Fiber match identified — rare cashmere blend sourced to a boutique retailer in David Voss\'s city of residence.',
      gps_triangulation: 'Victim\'s GPS shows a drive to an off-grid location at 10:15 PM. Location matches a property owned by David Voss.',
      financial_audit: 'Company accounts are clean. Victim recently updated will to remove David Voss entirely.',
      footage_enhancement: 'Footage enhancement incomplete — file corruption prevents clear identification.',
    },
    plantedEvidence: ['financial_docs'],
    forensicAnchor: {
      testId: 'fiber_analysis',
      evidenceId: 'fiber',
      supportsSuspectId: 'S-002',
      strength: 'strong',
    },
  },
  {
    id: 'scenario_3',
    title: 'The Silent Ledger',
    tagline: 'Embezzlement, shell companies, and a partner with everything to lose — follow the money before time runs out.',
    difficulty: 4,
    defaultTimerMinutes: 75,
    playerCount: '1-4',
    tileConfiguration: [
      { tileId: 'tile_office', position: { x: 0, y: 0 }, hasVictim: true, evidenceMarkers: ['weapon', 'financial_docs'] },
      { tileId: 'tile_parking_lot', position: { x: 1, y: 0 }, evidenceMarkers: ['security_footage', 'phone_records'] },
      { tileId: 'tile_study', position: { x: 0, y: 1 }, evidenceMarkers: ['fiber'] },
    ],
    storyCardIds: ['SC-004'],
    suspectAssignments: [
      { profileId: 'S-001', roleInCase: "Victim's Spouse", relationshipToVictim: 'Married to victim', hasAccess: false },
      { profileId: 'S-002', roleInCase: 'Estranged Brother', relationshipToVictim: 'No recent contact', hasAccess: false },
      { profileId: 'S-003', roleInCase: "Victim's Daughter", relationshipToVictim: 'Daughter', hasAccess: false },
      { profileId: 'S-004', roleInCase: 'Business Partner', motive: 'Embezzlement cover-up', relationshipToVictim: 'Co-founder, 18-year partnership', hasAccess: true },
      { profileId: 'S-005', roleInCase: 'Employee / Witness', relationshipToVictim: 'Long-time assistant at the company', hasAccess: true },
    ],
    sceneInspections: {
      office_desk: {
        areaId: 'office_desk',
        description: 'The victim was found slumped beside the desk. Financial documents are scattered everywhere.',
        evidenceFound: ['weapon', 'financial_docs'],
      },
      office_safe: {
        areaId: 'office_safe',
        description: 'The office safe is open but appears undisturbed. No signs of theft.',
        evidenceFound: [],
      },
      parking_lot_camera: {
        areaId: 'parking_lot_camera',
        description: 'Security cameras in the parking structure captured vehicle movements that evening.',
        evidenceFound: ['security_footage'],
      },
      parking_lot_entrance: {
        areaId: 'parking_lot_entrance',
        description: 'Phone GPS data can be cross-referenced with building access logs.',
        evidenceFound: ['phone_records'],
      },
      study_floor: {
        areaId: 'study_floor',
        description: 'Fibers found on the victim\'s clothing appear consistent with the victim\'s own wardrobe.',
        evidenceFound: ['fiber'],
      },
    },
    evidenceContent: [
      { typeId: 'weapon', locationFound: 'office_desk', content: 'A heavy crystal decanter with mixed DNA — victim dominant, secondary profile insufficient.' },
      { typeId: 'fiber', locationFound: 'study_floor', content: 'Fiber sample consistent with the victim\'s own clothing. No external contributor identified.' },
      { typeId: 'phone_records', locationFound: 'parking_lot_entrance', content: 'Leonard Holt\'s personal phone was GPS-tracked near the scene at 11:05 PM.' },
      { typeId: 'financial_docs', locationFound: 'office_desk', content: '$870,000 in unauthorized transfers traced through shell accounts to a holding entity linked to Leonard Holt.' },
      { typeId: 'security_footage', locationFound: 'parking_lot_camera', content: 'Enhanced footage reveals a vehicle matching Leonard Holt\'s registered BMW at 10:58 PM.' },
    ],
    killerId: 'S-004',
    motive: 'Embezzlement cover-up',
    forensicResults: {
      dna_test: 'DNA on weapon is a mixture — victim\'s profile dominant, secondary profile insufficient for database match.',
      fiber_analysis: 'Fiber sample is consistent with the victim\'s own clothing. No external contributor identified.',
      gps_triangulation: 'Leonard Holt\'s personal phone was GPS-tracked near the scene at 11:05 PM — 22 minutes before emergency call.',
      financial_audit: '$870,000 in unauthorized transfers traced through shell accounts to a holding entity linked to Leonard Holt.',
      footage_enhancement: 'Enhanced footage reveals a vehicle matching Leonard Holt\'s registered BMW parked outside the building at 10:58 PM.',
    },
    plantedEvidence: ['fiber'],
    forensicAnchor: {
      testId: 'financial_audit',
      evidenceId: 'financial_docs',
      supportsSuspectId: 'S-004',
      strength: 'strong',
    },
  },
];
