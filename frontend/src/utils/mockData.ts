import { Client, Person, HiringCandidate, FinanceRecord } from '../types';

export const MOCK_DB = {
  clients: [
    { id: 'c1', name: "Acme Corp", initial: "A", color: "indigo" },
    { id: 'c2', name: "Globex Inc", initial: "G", color: "emerald" },
    { id: 'c3', name: "Stark Ind", initial: "S", color: "amber" }
  ] as Client[],
  
  people: [
    { clientId: 'c1', id: 'u1', name: "Alice Johnson", role: "Sr. Engineer", status: "Active", loc: "USA", visa: "Citizen" },
    { clientId: 'c1', id: 'u2', name: "Bob Smith", role: "Sales Lead", status: "Active", loc: "UK", visa: "T2 General" },
    { clientId: 'c1', id: 'u3', name: "Charlie Davis", role: "Contractor", status: "Onboarding", loc: "Brazil", visa: "N/A" },
    { clientId: 'c1', id: 'u4', name: "Diana Prince", role: "Product Mgr", status: "Active", loc: "USA", visa: "H1B" },
    { clientId: 'c1', id: 'u5', name: "Elena G.", role: "Support", status: "Active", loc: "Philippines", visa: "Citizen" },
    { clientId: 'c1', id: 'u6', name: "Frank M.", role: "DevOps", status: "Active", loc: "Germany", visa: "Citizen" },
    { clientId: 'c2', id: 'u7', name: "Hank Scorpio", role: "CEO", status: "Active", loc: "USA", visa: "Citizen" },
  ] as Person[],

  hiring: [
    { clientId: 'c1', id: 'h1', name: "Mike Ross", role: "Legal Ops", stage: "Screening" },
    { clientId: 'c1', id: 'h2', name: "Rachel Zane", role: "Paralegal", stage: "Interview" },
    { clientId: 'c1', id: 'h3', name: "Louis Litt", role: "Partner", stage: "Offer" },
    // New Additions
    { clientId: 'c1', id: 'h4', name: "Sarah Connor", role: "Security Lead", stage: "Interview" },
    { clientId: 'c1', id: 'h5', name: "John Wick", role: "Contractor", stage: "Screening" },
    { clientId: 'c1', id: 'h6', name: "Ellen Ripley", role: "Ops Manager", stage: "Offer" },
    { clientId: 'c1', id: 'h7', name: "Neo Anderson", role: "Lead Architect", stage: "Hired" },
    { clientId: 'c1', id: 'h8', name: "Trinity Moss", role: "Backend Dev", stage: "Interview" },
    { clientId: 'c1', id: 'h9', name: "Morpheus King", role: "Team Lead", stage: "Screening" },
    { clientId: 'c1', id: 'h10', name: "Tony Stark", role: "Eng Director", stage: "Screening" },
  ] as HiringCandidate[],

  finance: [
    { clientId: 'c1', id: "INV-001", entity: "Acme HQ", amount: "$42,500", status: "Paid", date: "Oct 01" },
    { clientId: 'c1', id: "INV-002", entity: "Acme UK", amount: "$12,200", status: "Pending", date: "Oct 15" },
  ] as FinanceRecord[]
};