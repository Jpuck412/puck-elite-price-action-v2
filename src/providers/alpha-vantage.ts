export type Bar={timestamp:string;open:number;high:number;low:number;close:number;volume:number};

export async function fetchIntraday(symbol:string, interval:string, month?:string, outputsize="full"):Promise<Bar[]> {
  const key=process.env.ALPHA_VANTAGE_API_KEY;
  if(!key) throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
  const url=new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function","TIME_SERIES_INTRADAY");
  url.searchParams.set("symbol",symbol.toUpperCase());
  url.searchParams.set("interval",interval);
  url.searchParams.set("outputsize",outputsize);
  url.searchParams.set("extended_hours","true");
  url.searchParams.set("adjusted","false");
  url.searchParams.set("datatype","json");
  url.searchParams.set("apikey",key);
  if(month) url.searchParams.set("month",month);
  const res=await fetch(url.toString(),{cache:"no-store"});
  if(!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`);
  const data=await res.json();
  if(data["Error Message"]) throw new Error(data["Error Message"]);
  if(data["Note"]) throw new Error(data["Note"]);
  const keyName=Object.keys(data).find(k=>k.toLowerCase().includes("time series"));
  if(!keyName) throw new Error("No intraday time-series returned");
  return Object.entries(data[keyName] as Record<string,Record<string,string>>)
    .map(([timestamp,v])=>({timestamp,open:+v["1. open"],high:+v["2. high"],low:+v["3. low"],close:+v["4. close"],volume:+v["5. volume"]}))
    .filter(b=>Number.isFinite(b.close)&&Number.isFinite(b.volume))
    .sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
}
