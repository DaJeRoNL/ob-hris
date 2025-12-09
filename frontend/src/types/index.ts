export interface Client {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface Person {
  clientId: string;
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Onboarding' | 'Inactive';
  loc: string;
  visa: string;
}

export interface HiringCandidate {
  clientId: string;
  name: string;
  role: string;
  stage: 'Screening' | 'Interview' | 'Offer';
}

export interface TimeEntry {
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  notes: string;
}

// Global App State (for your Context if needed)
export interface AppState {
  currentClientId: string;
}