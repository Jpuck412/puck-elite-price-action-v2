import type { MarketMover } from "@/src/providers/market-movers";

export type ScannerCandidate = MarketMover & {
  score: number;
  reasons: string[];
};

export function rankCandidates(
  movers: MarketMover[],
  opts: { minPrice: number; maxPrice: number; minChangePct: number; minVolume: number; limit: number }
): ScannerCandidate[] {
  const filtered = movers.filter((m) =>
    m.price >= opts.minPrice &&
    m.price <= opts.maxPrice &&
    m.changePct >= opts.minChangePct &&
    m.volume >= opts.minVolume
  );

  const maxVol = Math.max(...filtered.map((x) => x.volume), 1);
  return filtered
    .map((m) => {
      const reasons: string[] = [];
      const gainScore = Math.min(m.changePct / 100, 1) * 45;
      const volumeScore = Math.min(Math.log10(m.volume + 1) / Math.log10(maxVol + 1), 1) * 35;
      const priceControl = m.price <= 3.99 ? 20 : 0;
      if (m.changePct >= 20) reasons.push("strong percentage expansion");
      if (m.volume >= 500000) reasons.push("meaningful volume");
      if (m.price <= 3.99) reasons.push("inside preferred sub-$4 range");
      return { ...m, score: Math.round(gainScore + volumeScore + priceControl), reasons };
    })
    .sort((a,b) => b.score - a.score)
    .slice(0, opts.limit);
}
