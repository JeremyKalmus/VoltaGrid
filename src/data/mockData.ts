export interface BatteryBank {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: 'healthy' | 'warning' | 'critical';
  soh: number; // State of Health percentage
  capacity: number; // kWh
  usableCapacity: number; // kWh
  cycleCount: number;
  temperature: number;
  voltage: number;
  current: number;
  lastMaintenance: string;
  nextMaintenance: string;
  installDate: string;
  expectedReplacement: string;
  replacementCost: number;
}

export interface FleetKPIs {
  avgSoH: number;
  totalUsableCapacity: number;
  totalCycles: number;
  forecastedReplacements: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface Anomaly {
  id: string;
  bankId: string;
  bankName: string;
  type: 'temperature' | 'efficiency' | 'current' | 'voltage';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  timestamp: string;
  status: 'open' | 'assigned' | 'resolved';
  assignedTo?: string;
}

// Mock data
export const batteryBanks: BatteryBank[] = [
  {
    id: 'battery-bank-001',
    name: 'Permian Basin Energy Hub',
    location: 'Midland, TX',
    lat: 31.9973,
    lng: -102.0779,
    status: 'healthy',
    soh: 96.8,
    capacity: 7500,
    usableCapacity: 7260,
    cycleCount: 987,
    temperature: 23.5,
    voltage: 392.7,
    current: 134.2,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    installDate: '2023-02-15',
    expectedReplacement: '2033-02-15',
    replacementCost: 3750000
  },
  {
    id: 'battery-bank-002',
    name: 'Mojave Solar Complex',
    location: 'Barstow, CA',
    lat: 34.8958,
    lng: -117.0228,
    status: 'warning',
    soh: 89.3,
    capacity: 6000,
    usableCapacity: 5358,
    cycleCount: 1654,
    temperature: 31.2,
    voltage: 381.9,
    current: 102.4,
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    installDate: '2022-06-10',
    expectedReplacement: '2032-06-10',
    replacementCost: 3000000
  },
  {
    id: 'battery-bank-003',
    name: 'Columbia River Grid Station',
    location: 'The Dalles, OR',
    lat: 45.5945,
    lng: -121.1787,
    status: 'critical',
    soh: 81.7,
    capacity: 5500,
    usableCapacity: 4493.5,
    cycleCount: 2156,
    temperature: 35.8,
    voltage: 368.2,
    current: 145.3,
    lastMaintenance: '2024-01-30',
    nextMaintenance: '2024-04-30',
    installDate: '2021-11-08',
    expectedReplacement: '2029-11-08',
    replacementCost: 2750000
  },
  {
    id: 'battery-bank-004',
    name: 'Great Plains Wind Storage',
    location: 'Garden City, KS',
    lat: 37.9717,
    lng: -100.8727,
    status: 'healthy',
    soh: 94.2,
    capacity: 4500,
    usableCapacity: 4239,
    cycleCount: 1234,
    temperature: 22.8,
    voltage: 385.2,
    current: 127.3,
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-08-15',
    installDate: '2022-09-22',
    expectedReplacement: '2032-09-22',
    replacementCost: 2250000
  },
  {
    id: 'battery-bank-005',
    name: 'Atlantic Offshore Hub',
    location: 'Virginia Beach, VA',
    lat: 36.8529,
    lng: -75.9780,
    status: 'warning',
    soh: 87.6,
    capacity: 8000,
    usableCapacity: 7008,
    cycleCount: 1789,
    temperature: 26.4,
    voltage: 378.1,
    current: 156.7,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-07-20',
    installDate: '2022-04-18',
    expectedReplacement: '2032-04-18',
    replacementCost: 4000000
  }
];

export const fleetKPIs: FleetKPIs = {
  avgSoH: 89.9,
  totalUsableCapacity: 28358.5,
  totalCycles: 7820,
  forecastedReplacements: 2
};

export const generateSoHTimeSeries = (days: number): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const baseValue = 89.2;
    const variation = Math.sin(i / 10) * 2 + Math.random() * 1.5 - 0.75;
    const trend = -i * 0.01; // Slight downward trend
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      value: Math.max(75, Math.min(100, baseValue + variation + trend))
    });
  }
  
  return data;
};

export const anomalies: Anomaly[] = [
  {
    id: 'anom-001',
    bankId: 'battery-bank-003',
    bankName: 'Arizona Solar B1',
    type: 'temperature',
    severity: 'critical',
    description: 'Temperature spike detected: 38.7°C exceeds threshold',
    timestamp: '2024-01-25T14:32:00Z',
    status: 'assigned',
    assignedTo: 'John Martinez'
  },
  {
    id: 'anom-002',
    bankId: 'battery-bank-002',
    bankName: 'California Wind A2',
    type: 'efficiency',
    severity: 'major',
    description: 'Charge efficiency dropped below 85%',
    timestamp: '2024-01-24T09:15:00Z',
    status: 'open'
  },
  {
    id: 'anom-003',
    bankId: 'battery-bank-005',
    bankName: 'Colorado Wind D1',
    type: 'current',
    severity: 'minor',
    description: 'Current fluctuations detected during charge cycle',
    timestamp: '2024-01-23T16:45:00Z',
    status: 'resolved',
    assignedTo: 'Sarah Chen'
  }
];

export const maintenancePriorities = [
  { bank: 'Arizona Solar B1', priority: 'Critical', issue: 'Temperature monitoring system repair', dueDate: '2024-02-01' },
  { bank: 'California Wind A2', priority: 'High', issue: 'Scheduled capacity testing', dueDate: '2024-02-05' },
  { bank: 'Colorado Wind D1', priority: 'Medium', issue: 'Preventive maintenance inspection', dueDate: '2024-02-10' },
  { bank: 'Texas Solar Farm A1', priority: 'Low', issue: 'Firmware update', dueDate: '2024-02-15' },
  { bank: 'Nevada Storage C1', priority: 'Low', issue: 'Quarterly inspection', dueDate: '2024-02-20' }
];

export const costScenarios = {
  baseline: { multiplier: 1.0, description: 'Current replacement schedule' },
  optimistic: { multiplier: 0.8, description: 'Extended lifespan through better maintenance' },
  aggressive: { multiplier: 1.3, description: 'Accelerated replacement due to high usage' }
};