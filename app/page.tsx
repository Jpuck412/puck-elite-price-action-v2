const tools = [
  ["01", "Symbol Evidence", "Pressure, volume, speed, spread, buyer control, support and resistance."],
  ["02", "Risk Engine", "Defined invalidation and maximum-dollar-risk position sizing."],
  ["03", "Catalyst Intel", "Catalyst classification with primary-source and dilution verification flags."],
  ["04", "Structure", "Float and price-location context without invented data."],
];

export default function Home() {
  return <main className="shell">
    <nav><div className="brand"><span className="orb" /> PUCK <b>ELITE</b></div><div className="status"><i /> MCP ONLINE</div></nav>
    <section className="hero"><div className="eyebrow">V2 • EVIDENCE-FIRST MARKET INTELLIGENCE</div><h1>Pressure before <span>prediction.</span></h1><p>A production MCP command center for disciplined small-cap momentum analysis. Every conclusion is separated into confirmed evidence, warnings, and missing proof.</p><div className="chips"><span>LIVE-DATA READY</span><span>SEC-READY</span><span>RISK DEFINED</span></div></section>
    <section className="grid">{tools.map(([n,t,d]) => <article key={n}><small>{n}</small><h2>{t}</h2><p>{d}</p><div className="line" /></article>)}</section>
    <section className="architecture"><div><small>ARCHITECTURE</small><h2>ChatGPT → MCP → Evidence Engine</h2><p>V2 is deliberately modular. Market providers, news, SEC data and execution infrastructure can be attached without rewriting the analysis engine.</p></div><div className="endpoint"><span>ENDPOINT</span><code>/api/mcp</code><em>STREAMABLE HTTP</em></div></section>
    <footer><span>PUCK ELITE PRICE ACTION V2</span><span>NO DATA FABRICATION • NO PREDICTION AS PROOF</span></footer>
  </main>;
}