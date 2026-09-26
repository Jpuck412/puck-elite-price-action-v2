import { z } from "zod";
import { buildEvidence } from "../engine/evidence";
import { calculateRisk } from "../engine/risk";
import { classifyCatalyst } from "../engine/catalyst";
import { readStructure } from "../engine/structure";

export const toolDefinitions = [
  { name: "puck_check_symbol", description: "Run an evidence-first setup check from supplied market observations.", inputSchema: z.object({ symbol: z.string(), price: z.number().optional(), changePct: z.number().optional(), volume: z.number().optional(), relativeVolume: z.number().optional(), spreadPct: z.number().optional(), speed: z.number().optional(), buyerControl: z.number().optional(), support: z.number().optional(), resistance: z.number().optional(), floatShares: z.number().optional() }) },
  { name: "puck_risk_plan", description: "Calculate position size from entry, invalidation and maximum dollar risk.", inputSchema: z.object({ entry: z.number(), invalidation: z.number(), maxRiskDollars: z.number(), target: z.number().optional() }) },
  { name: "puck_catalyst_check", description: "Classify a catalyst headline and flag source/dilution verification needs.", inputSchema: z.object({ headline: z.string() }) },
  { name: "puck_structure_check", description: "Read price/support/resistance/float structure without pretending missing data exists.", inputSchema: z.object({ price: z.number().optional(), support: z.number().optional(), resistance: z.number().optional(), floatShares: z.number().optional() }) }
];

export function executeTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "puck_check_symbol": return buildEvidence(args as never);
    case "puck_risk_plan": return calculateRisk(args.entry as number, args.invalidation as number, args.maxRiskDollars as number, args.target as number | undefined);
    case "puck_catalyst_check": return classifyCatalyst(args.headline as string);
    case "puck_structure_check": return readStructure(args.price as number | undefined, args.support as number | undefined, args.resistance as number | undefined, args.floatShares as number | undefined);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}