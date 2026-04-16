/** Matches the Holdings API response shape exactly */
export interface Holding {
  id: string;           // generated client-side (coin + index)
  coin: string;         // symbol, e.g. "ETH"
  coinName: string;     // full name, e.g. "Ethereum"
  logo: string;         // direct image URL from API
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: { balance: number; gain: number };
  ltcg: { balance: number; gain: number };
}

/** Capital Gains API shape */
export interface CapitalGains {
  stcg: { profits: number; losses: number };
  ltcg: { profits: number; losses: number };
}

export interface HarvestingResult {
  afterGains: {
    stcg: { profits: number; losses: number };
    ltcg: { profits: number; losses: number };
    /** (stcg.profits - stcg.losses) + (ltcg.profits - ltcg.losses) */
    totalCapitalGains: number;
  };
  savings: number;
}
