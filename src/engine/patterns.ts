import type { Bar } from "@/src/providers/alpha-vantage";

type Feature={path:number[];returns:number[];volZ:number[];rangeZ:number[];accel:number[]};

const mean=(a:number[])=>a.reduce((s,v)=>s+v,0)/(a.length||1);
const sd=(a:number[])=>{const m=mean(a);return Math.sqrt(mean(a.map(v=>(v-m)**2)))||1};
const z=(v:number,m:number,s:number)=> (v-m)/(s||1);

function fingerprint(bars:Bar[]):Feature{
  const closes=bars.map(b=>b.close);
  const rets=closes.map((c,i)=>i?Math.log(c/closes[i-1]):0);
  const ranges=bars.map(b=>(b.high-b.low)/Math.max(b.close,1e-9));
  const vols=bars.map(b=>Math.log1p(b.volume));
  const path=closes.map(c=>c/closes[0]-1);
  const vm=mean(vols),vs=sd(vols),rm=mean(ranges),rs=sd(ranges);
  const volZ=vols.map(v=>z(v,vm,vs));
  const rangeZ=ranges.map(v=>z(v,rm,rs));
  const accel=rets.map((r,i)=>i? r-rets[i-1]:0);
  return {path,returns:rets,volZ,rangeZ,accel};
}

function distance(a:Feature,b:Feature){
  const n=Math.min(a.path.length,b.path.length);
  let s=0;
  for(let i=0;i<n;i++){
    s += (a.path[i]-b.path[i])**2*2;
    s += (a.returns[i]-b.returns[i])**2;
    s += (a.volZ[i]-b.volZ[i])**2*.35;
    s += (a.rangeZ[i]-b.rangeZ[i])**2*.35;
    s += (a.accel[i]-b.accel[i])**2*.75;
  }
  return Math.sqrt(s/n);
}

export function scanHistoricalPatterns(all:Bar[], windowBars=12, forwardBars=12, topN=8){
  if(all.length < windowBars+forwardBars+20) throw new Error("Not enough historical bars for pattern scan");
  const current=all.slice(-windowBars);
  const target=fingerprint(current);
  const matches:{start:string;end:string;distance:number;similarity:number;moveAfter:number;maxGain:number;maxDrawdown:number;path:number[]}[]=[];
  const maxStart=all.length-windowBars-forwardBars-1;
  for(let i=0;i<=maxStart;i++){
    const candidate=all.slice(i,i+windowBars);
    const d=distance(target,fingerprint(candidate));
    const base=candidate[candidate.length-1].close;
    const future=all.slice(i+windowBars,i+windowBars+forwardBars);
    const highs=future.map(b=>b.high), lows=future.map(b=>b.low);
    const end=future[future.length-1]?.close??base;
    matches.push({
      start:candidate[0].timestamp,end:candidate[candidate.length-1].timestamp,
      distance:d,similarity:1/(1+d),moveAfter:(end/base-1)*100,
      maxGain:((Math.max(...highs)/base)-1)*100,
      maxDrawdown:((Math.min(...lows)/base)-1)*100,
      path:candidate.map(b=>b.close/candidate[0].close-1)
    });
  }
  matches.sort((a,b)=>a.distance-b.distance);
  const top=matches.slice(0,topN);
  const avg=(key:"moveAfter"|"maxGain"|"maxDrawdown")=>top.reduce((s,x)=>s+x[key],0)/(top.length||1);
  return {
    windowBars,forwardBars,sampleCount:matches.length,
    currentStart:current[0].timestamp,currentEnd:current[current.length-1].timestamp,
    currentPath:target.path,
    matches:top,
    aggregate:{avgMoveAfterPct:avg("moveAfter"),avgMaxGainPct:avg("maxGain"),avgMaxDrawdownPct:avg("maxDrawdown"),
      positiveFollowThroughPct:top.length?top.filter(x=>x.maxGain>0).length/top.length*100:0},
    methodology:"Similarity uses normalized price path, returns, volume intensity, candle-range intensity and acceleration. Historical matches are descriptive; they are not forecasts."
  };
}
