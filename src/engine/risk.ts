export type RiskPlan = { entry: number; invalidation: number; maxRiskDollars: number; shares: number; riskPerShare: number; target?: number; rewardRisk?: number };

export function calculateRisk(entry: number, invalidation: number, maxRiskDollars: number, target?: number): RiskPlan {
  if (![entry, invalidation, maxRiskDollars].every(Number.isFinite) || entry <= invalidation || maxRiskDollars <= 0) throw new Error("Invalid risk inputs");
  const riskPerShare = entry - invalidation;
  const shares = Math.floor(maxRiskDollars / riskPerShare);
  return { entry, invalidation, maxRiskDollars, shares, riskPerShare, target, rewardRisk: target !== undefined ? (target - entry) / riskPerShare : undefined };
}