export type CatalystResult = { category: "clinical" | "regulatory" | "contract" | "earnings" | "offering" | "corporate" | "macro" | "unknown"; sourceRequired: boolean; dilutionWarning: boolean; note: string };

export function classifyCatalyst(headline = ""): CatalystResult {
  const text = headline.toLowerCase();
  if (/offering|atm|warrant|convertible|registered direct/.test(text)) return { category: "offering", sourceRequired: true, dilutionWarning: true, note: "Financing language requires primary-source verification." };
  if (/fda|approval|clinical|trial|phase [123]/.test(text)) return { category: "clinical", sourceRequired: true, dilutionWarning: false, note: "Clinical/regulatory claims should be verified against the issuer or regulator." };
  if (/contract|agreement|order|partnership/.test(text)) return { category: "contract", sourceRequired: true, dilutionWarning: false, note: "Commercial claims should be verified against the original release or filing." };
  if (/earnings|revenue|guidance|quarter/.test(text)) return { category: "earnings", sourceRequired: true, dilutionWarning: false, note: "Financial claims require the filing or earnings release." };
  return { category: "unknown", sourceRequired: true, dilutionWarning: false, note: "No catalyst classification is accepted without source verification." };
}