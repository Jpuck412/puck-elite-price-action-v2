import type { Evidence, MarketSnapshot, SetupReport } from "../types/market";

export function buildEvidence(snapshot: MarketSnapshot): SetupReport {
  const evidence: Evidence[] = [];
  const confirmed: string[] = [];
  const missingProof: string[] = [];
  const warnings: string[] = [];

  const check = (key: string, ok: boolean | undefined, value: string | number | undefined, note: string) => {
    if (ok === undefined) { evidence.push({ key, status: "missing", value, note }); missingProof.push(key); return; }
    evidence.push({ key, status: ok ? "confirmed" : "warning", value, note });
    (ok ? confirmed : warnings).push(key);
  };

  check("speed", snapshot.speed !== undefined && snapshot.speed > 0, snapshot.speed, "Positive speed is required; absence is not evidence.");
  check("volume", snapshot.volume !== undefined && snapshot.volume > 0, snapshot.volume, "Volume must be present and expanding enough to matter.");
  check("spread", snapshot.spreadPct !== undefined, snapshot.spreadPct, "Prefer stable or tightening spreads; wide spreads increase execution risk.");
  check("buyerControl", snapshot.buyerControl !== undefined && snapshot.buyerControl >= 0.6, snapshot.buyerControl, "Buyer-control threshold is 60% for confirmation, not prediction.");
  check("support", snapshot.support !== undefined && snapshot.price !== undefined && snapshot.support < snapshot.price, snapshot.support, "Support must be identified below current price before risk can be defined.");
  check("volumeAcceleration", snapshot.relativeVolume !== undefined && snapshot.relativeVolume >= 1, snapshot.relativeVolume, "Relative volume is a context signal, not a standalone trigger.");

  const invalidation = snapshot.support;
  return { symbol: snapshot.symbol.toUpperCase(), evidence, confirmed, missingProof, warnings, invalidation };
}