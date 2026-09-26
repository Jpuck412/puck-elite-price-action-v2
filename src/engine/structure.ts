export type StructureRead = { floatRisk: "known" | "unknown"; priceLocation: "above-support" | "below-support" | "unknown"; resistanceRisk: boolean; note: string };

export function readStructure(price?: number, support?: number, resistance?: number, floatShares?: number): StructureRead {
  const priceLocation = price !== undefined && support !== undefined ? (price > support ? "above-support" : "below-support") : "unknown";
  return { floatRisk: floatShares !== undefined ? "known" : "unknown", priceLocation, resistanceRisk: price !== undefined && resistance !== undefined && price >= resistance, note: "Float, support and resistance are context; they never replace tape or confirmation." };
}