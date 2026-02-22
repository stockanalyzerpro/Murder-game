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
    duration: 3,
    evidenceRequired: ['weapon'],
  },
  {
    id: 'fiber_analysis',
    name: 'Fiber Spectrometry',
    duration: 2,
    evidenceRequired: ['fiber'],
  },
  {
    id: 'gps_triangulation',
    name: 'GPS Triangulation',
    duration: 1,
    evidenceRequired: ['phone_records'],
  },
  {
    id: 'financial_audit',
    name: 'Forensic Financial Audit',
    duration: 4,
    evidenceRequired: ['financial_docs'],
  },
  {
    id: 'footage_enhancement',
    name: 'Digital Footage Enhancement',
    duration: 2,
    evidenceRequired: ['security_footage'],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario_1',
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
