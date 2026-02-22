import type { Suspect, Evidence, LabTest, Scenario } from '@/types';

export const SUSPECTS: Suspect[] = [
  {
    id: 'spouse',
    name: 'Margaret Voss',
    role: 'Spouse',
    baseProfile: 'Married to the victim for 12 years. Recently discovered financial irregularities in joint accounts.',
  },
  {
    id: 'brother',
    name: 'David Voss',
    role: 'Brother',
    baseProfile: 'Estranged sibling who contested the family will two years ago. Returned to town last month.',
  },
  {
    id: 'daughter',
    name: 'Claire Voss',
    role: 'Daughter',
    baseProfile: 'College student with a troubled relationship with the victim. Recently asked for a large cash transfer.',
  },
  {
    id: 'business_partner',
    name: 'Leonard Holt',
    role: 'Business Partner',
    baseProfile: 'Co-founder of Voss & Holt Industries. Audit revealed discrepancies in company accounts linked to Holt.',
  },
  {
    id: 'employee',
    name: 'Renata Suarez',
    role: 'Employee',
    baseProfile: 'Long-time assistant at Voss & Holt. Recently passed over for a promotion that went to an outside hire.',
  },
];

export const EVIDENCE: Evidence[] = [
  {
    id: 'weapon',
    title: 'Blunt Force Weapon',
    description: 'A heavy crystal decanter recovered near the scene. Blood and possible biological trace on handle.',
  },
  {
    id: 'fiber',
    title: 'Fabric Fiber Sample',
    description: 'Microscopic fiber fragments collected from the victim\'s clothing. Unusual weave pattern.',
  },
  {
    id: 'phone_records',
    title: 'Phone Records',
    description: 'Victim\'s call log and GPS data from the night of the incident.',
  },
  {
    id: 'financial_docs',
    title: 'Financial Documents',
    description: 'Bank statements and wire transfer records flagged by forensic accountant.',
  },
  {
    id: 'security_footage',
    title: 'Security Footage',
    description: 'Partial CCTV capture from the building entrance. Time-stamped but partially corrupted.',
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
    briefing: `At 11:52 PM on a quiet Tuesday night, paramedics responded to a 911 call at the Voss family estate on Birchwood Lane. The caller — housekeeper Maria Delgado — reported finding the body of Richard Voss, 54, in his private study on the ground floor. Voss was pronounced dead at the scene.\n\nThe victim was discovered slumped beside his desk with severe blunt force trauma to the head. A heavy crystal decanter lay nearby, shattered and stained with blood. There were no signs of forced entry, and the home security system was disarmed from inside at 11:31 PM.\n\nInitial canvass revealed that several family members and associates had been in contact with the victim that evening. Financial records subpoenaed from Voss & Holt Industries suggest a web of debts, disputes, and hidden motives. Your task force has been assigned the case — review the evidence, run forensic tests, interview the suspects, and file charges before the trail goes cold.`,
    suspectIds: ['spouse', 'brother', 'daughter', 'business_partner', 'employee'],
    evidenceIds: ['weapon', 'fiber', 'phone_records', 'financial_docs', 'security_footage'],
    killerId: 'spouse',
    motive: 'Financial desperation',
    forensicResults: {
      dna_test: 'DNA on weapon matches Margaret Voss (spouse). Profile is conclusive — no mixture detected.',
      fiber_analysis: 'Fibers are synthetic blend consistent with mass-market upholstery. Inconclusive.',
      gps_triangulation: 'Phone GPS places victim at home until 11:47 PM. No anomalous third-party pings detected.',
      financial_audit: 'Victim had secretly changed beneficiary of $2.1M life insurance policy — Margaret remains sole beneficiary.',
      footage_enhancement: 'Enhanced footage shows a figure matching Margaret Voss entering the property at 11:32 PM.',
    },
    plantedEvidence: ['financial_docs'],
    forensicAnchor: {
      testId: 'dna_test',
      evidenceId: 'weapon',
      supportsSuspectId: 'spouse',
      strength: 'strong',
    },
    interviewVariations: {
      spouse: 'Margaret claims she was at a charity dinner until midnight. Alibi partially corroborated.',
      brother: 'David states he was out of state. Flight records confirm departure two days prior.',
      daughter: 'Claire was at university dormitory. Campus security log confirms card swipe at 10 PM.',
      business_partner: 'Leonard claims the audit discrepancies are clerical errors currently under internal review.',
      employee: 'Renata says she left the office at 6 PM. Building access log confirms exit.',
    },
  },
  {
    id: 'scenario_2',
    title: 'Blood Inheritance',
    tagline: 'When the will changes, old grudges turn deadly — and the prodigal brother returns just in time.',
    difficulty: 3,
    defaultTimerMinutes: 90,
    playerCount: '1-4',
    briefing: `Richard Voss was found dead at his estate under circumstances that point to a deeply personal killing. The victim had recently updated his will — a change that disinherited his younger brother David entirely, redirecting a multi-million-dollar estate to his daughter Claire.\n\nDavid Voss, estranged from the family for over two years following a bitter legal dispute over their late father's trust, had returned to town one month prior. Witnesses at local establishments reported seeing David drinking heavily and making veiled threats about "getting what's owed."\n\nThe crime scene showed signs of a confrontation in the study. A GPS trace on the victim's phone reveals an unexpected late-night drive to a rural property — one registered under David's name. Fiber evidence collected from the victim's jacket may link to an out-of-town source. Dig deep, detective — this family's secrets run darker than they appear.`,
    suspectIds: ['spouse', 'brother', 'daughter', 'business_partner', 'employee'],
    evidenceIds: ['weapon', 'fiber', 'phone_records', 'financial_docs', 'security_footage'],
    killerId: 'brother',
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
      supportsSuspectId: 'brother',
      strength: 'strong',
    },
    interviewVariations: {
      spouse: 'Margaret says David called the house repeatedly in the week before the death. She felt threatened.',
      brother: 'David denies returning to town. Phone records show a local cell tower ping contradicting this claim.',
      daughter: 'Claire mentions overhearing a heated argument between her father and David two weeks ago.',
      business_partner: 'Leonard was unaware of the will update. He found out when contacted by the estate attorney.',
      employee: 'Renata recalls David coming to the office unannounced the morning of the incident.',
    },
  },
  {
    id: 'scenario_3',
    title: 'The Silent Ledger',
    tagline: 'Embezzlement, shell companies, and a partner with everything to lose — follow the money before time runs out.',
    difficulty: 4,
    defaultTimerMinutes: 75,
    playerCount: '1-4',
    briefing: `The murder of Richard Voss has all the hallmarks of a carefully planned execution. The victim — co-founder of Voss & Holt Industries — was found in the company's downtown office after hours, not at his home estate as initially reported by media.\n\nA forensic accountant engaged by the DA's office has flagged nearly $870,000 in unauthorized wire transfers routed through a series of shell accounts. The money trail leads to a holding entity with connections to Leonard Holt, the victim's business partner of 18 years.\n\nGPS data from Holt's personal phone places him near the scene at 11:05 PM — just 22 minutes before the emergency call. Enhanced security footage reveals a vehicle matching Holt's registered BMW in the building's parking structure. But Holt's attorney insists his client was miles away, and the phone was "left in his car by his driver." Someone is lying — and the clock is ticking.`,
    suspectIds: ['spouse', 'brother', 'daughter', 'business_partner', 'employee'],
    evidenceIds: ['weapon', 'fiber', 'phone_records', 'financial_docs', 'security_footage'],
    killerId: 'business_partner',
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
      supportsSuspectId: 'business_partner',
      strength: 'strong',
    },
    interviewVariations: {
      spouse: 'Margaret notes that Leonard was behaving erratically in recent months and avoided direct conversations with her husband.',
      brother: 'David says he had no recent contact with Leonard and considers him untrustworthy.',
      daughter: 'Claire found printed financial documents in her father\'s briefcase that she did not understand — now believed to be evidence of fraud.',
      business_partner: 'Leonard denies being near the property that night. He claims his phone was left in his car by his driver.',
      employee: 'Renata overheard a tense phone call between the victim and Leonard two days before the incident.',
    },
  },
];
