import type { CapitalGains } from '@/types';

// Exact values from the assignment spec Capital Gains API
export const mockCapitalGains: CapitalGains = {
  stcg: { profits: 70200.88, losses: 1548.53 },
  ltcg: { profits: 5020, losses: 3050 },
};

// Derived: Net ST = 68652.35, Net LT = 1970, Realised = 70622.35
