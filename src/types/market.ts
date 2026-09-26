export type MarketSnapshot = {
  symbol: string;
  price?: number;
  changePct?: number;
  volume?: number;
  relativeVolume?: number;
  spreadPct?: number;
  speed?: number;
  buyerControl?: number;
  support?: number;
  resistance?: number;
  floatShares?: number;
  timestamp?: string;
};

export type Evidence = {
  key: string;
  status: "confirmed" | "warning" | "missing";
  value?: string | number;
  note: string;
};

export type SetupReport = {
  symbol: string;
  evidence: Evidence[];
  confirmed: string[];
  missingProof: string[];
  warnings: string[];
  invalidation?: number;
};