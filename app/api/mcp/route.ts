import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { buildEvidence } from "@/src/engine/evidence";
import { calculateRisk } from "@/src/engine/risk";
import { classifyCatalyst } from "@/src/engine/catalyst";
import { readStructure } from "@/src/engine/structure";
import { fetchIntraday } from "@/src/providers/alpha-vantage";
import { scanHistoricalPatterns } from "@/src/engine/patterns";

const handler = createMcpHandler((server) => {
  server.tool("puck_check_symbol", "Evidence-first small-cap momentum setup check. Missing data remains missing.", {
    symbol: z.string(), price: z.number().optional(), changePct: z.number().optional(), volume: z.number().optional(), relativeVolume: z.number().optional(), spreadPct: z.number().optional(), speed: z.number().optional(), buyerControl: z.number().optional(), support: z.number().optional(), resistance: z.number().optional(), floatShares: z.number().optional()
  }, async (input) => ({ content: [{ type: "text", text: JSON.stringify(buildEvidence(input as never), null, 2) }] }));

  server.tool("puck_risk_plan", "Defined-risk position sizing. Calculates shares from maximum dollar risk.", {
    entry: z.number(), invalidation: z.number(), maxRiskDollars: z.number(), target: z.number().optional()
  }, async ({ entry, invalidation, maxRiskDollars, target }) => ({ content: [{ type: "text", text: JSON.stringify(calculateRisk(entry, invalidation, maxRiskDollars, target), null, 2) }] }));

  server.tool("puck_catalyst_check", "Classify catalyst language and flag primary-source and dilution verification needs.", {
    headline: z.string()
  }, async ({ headline }) => ({ content: [{ type: "text", text: JSON.stringify(classifyCatalyst(headline), null, 2) }] }));

  server.tool("puck_historical_pattern_scan", "Compare the current intraday price/volume shape against historical windows and show what those prior setups looked like and what happened afterward.", {
    symbol: z.string(), interval: z.enum(["1min","5min","15min","30min","60min"]).default("5min"), month: z.string().regex(/^\\d{4}-\\d{2}$/).optional(), windowBars: z.number().int().min(6).max(60).default(12), forwardBars: z.number().int().min(3).max(60).default(12), topN: z.number().int().min(3).max(20).default(8)
  }, async ({ symbol, interval, month, windowBars, forwardBars, topN }) => {
    const bars = await fetchIntraday(symbol, interval, month, "full");
    const result = scanHistoricalPatterns(bars, windowBars, forwardBars, topN);
    return { content: [{ type: "text", text: JSON.stringify({ symbol, interval, barsLoaded: bars.length, ...result }, null, 2) }] };
  });

  server.tool("puck_structure_check", "Read support, resistance and float context without inventing missing values.", {
    price: z.number().optional(), support: z.number().optional(), resistance: z.number().optional(), floatShares: z.number().optional()
  }, async ({ price, support, resistance, floatShares }) => ({ content: [{ type: "text", text: JSON.stringify(readStructure(price, support, resistance, floatShares), null, 2) }] }));
}, { maxDuration: 60 });

export { handler as GET, handler as POST, handler as DELETE };