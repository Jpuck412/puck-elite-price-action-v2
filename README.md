# Puck Elite Price Action V2

Professional MCP command center for evidence-first small-cap momentum analysis.

## Architecture

`ChatGPT → MCP → Evidence Engine → Market / News / SEC Providers`

V2 separates the reasoning engine from external providers so live data can be attached without contaminating the core analysis logic.

## MCP endpoint

`/api/mcp`

## Tools

- puck_market_scan — turns the MCP server into a live market scanner by pulling current top gainers/active names and filtering/ranking them by price, percentage change, and volume.

- `puck_check_symbol` — pressure, volume, speed, spread, buyer control, support and structure evidence.
- `puck_risk_plan` — defined invalidation and maximum-dollar-risk sizing.
- `puck_catalyst_check` — catalyst classification and source/dilution verification flags.
- `puck_structure_check` — support, resistance and float context.
- `puck_historical_pattern_scan` — scans historical intraday OHLCV for windows that resemble the current setup and reports what those prior patterns looked like and what happened afterward.

## Historical fingerprint engine

The pattern engine compares normalized price path, returns, volume intensity, candle-range intensity, and acceleration. It returns the closest historical windows plus their subsequent move, maximum favorable excursion, and maximum drawdown. This is pattern matching, not a prediction engine.

### Data provider

Set `ALPHA_VANTAGE_API_KEY` in Vercel environment variables. Alpha Vantage's intraday endpoint supports 1/5/15/30/60-minute OHLCV and extended-hours historical data; access to historical intraday data is plan-dependent.

## Operating rules

Evidence over prediction. Missing data stays missing. Catalyst headlines require source verification. Risk must be defined before treating a setup as actionable.

## Production roadmap

1. Attach live market-data provider.
2. Add news/PR provider with source URLs.
3. Add SEC EDGAR filing retrieval and dilution parser.
4. Add historical runner-pattern storage.
5. Add real-time pressure/acceleration stream.
6. Add authenticated user-specific settings and audit logging.

This repository is an analysis infrastructure project, not an execution or order-routing system.