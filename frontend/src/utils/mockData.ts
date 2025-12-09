import { Client, Person, HiringCandidate, TimeEntry } from '../types';

export const MOCK_DB = {
  clients: [
    { id: 'c1', name: "Acme Corp", initial: "A", color: "indigo" },
    { id: 'c2', name: "Globex Inc", initial: "G", color: "emerald" },
    { id: 'c3', name: "Stark Ind", initial: "S", color: "amber" }
  ] as Client[],
  
  people: [
    { clientId: 'c1', id: 'u1', name: "Alice Johnson", role: "Sr. Engineer", status: "Active", loc: "USA", visa: "Citizen" },
    { clientId: 'c1', id: 'u2', name: "Bob Smith", role: "Sales Lead", status: "Active", loc: "UK", visa: "T2 General" },
    // ... add the rest from index.html
  ] as Person[],

  hiring: [
    { clientId: 'c1', name: "Mike Ross", role: "Legal Ops", stage: "Screening" },
    // ... rest of hiring
  ] as HiringCandidate[],

  timeEntries: [] as TimeEntry[]
};