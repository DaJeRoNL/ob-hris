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
  id: string;
  name: string;
  role: string;
  stage: 'Screening' | 'Interview' | 'Offer';
}

export interface TimeEntry {
  clientId: string;
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  notes: string;
  isManual?: boolean; // New Flag
}

export interface FinanceRecord {
  clientId: string;
  id: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  entity: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}