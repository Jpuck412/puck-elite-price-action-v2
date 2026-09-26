export type MarketMover = {
  ticker: string;
  price: number;
  changePct: number;
  volume: number;
  previousClose?: number;
  source: string;
};

type MoversResponse = {
  top_gainers?: Array<Record<string, string>>;
  top_losers?: Array<Record<string, string>>;
  most_actively_traded?: Array<Record<string, string>>;
  Information?: string;
  Note?: string;
  ["Error Message"]?: string;
};

function key(k: Record<string,string>, ...names: string[]) {
  for (const name of names) if (k[name] !== undefined) return k[name];
  return undefined;
}

export async function fetchTopGainersLosers(): Promise<MarketMover[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error("ALPHA_VANTAGE_API_KEY is not configured");

  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "TOP_GAINERS_LOSERS");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("entitlement", process.env.ALPHA_VANTAGE_ENTITLEMENT ?? "realtime");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`);
  const json = (await res.json()) as MoversResponse;

  if (json["Error Message"]) throw new Error(json["Error Message"]);
  if (json.Information) throw new Error(json.Information);
  if (json.Note) throw new Error(json.Note);

  const rows = [
    ...(json.top_gainers ?? []),
    ...(json.most_actively_traded ?? [])
  ];

  return rows.map((r) => ({
    ticker: key(r, "ticker", "symbol") ?? "",
    price: Number(key(r, "price") ?? 0),
    changePct: Number(String(key(r, "change_percentage", "change percent") ?? "0").replace("%","")),
    volume: Number(key(r, "volume") ?? 0),
    previousClose: Number(key(r, "prev_close", "previous close") ?? 0) || undefined,
    source: "Alpha Vantage TOP_GAINERS_LOSERS"
  })).filter((x) => x.ticker && Number.isFinite(x.price));
}
