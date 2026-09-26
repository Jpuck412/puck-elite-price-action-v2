# Puck Elite Price Action V2

Professional MCP command center for evidence-first small-cap momentum analysis.

## Architecture

`ChatGPT → MCP → Evidence Engine → Market / News / SEC Providers`

V2 separates the reasoning engine from external providers so live data can be attached without contaminating the core analysis logic.

## MCP endpoint

`/api/mcp`

## Tools

- `puck_check_symbol` — pressure, volume, speed, spread, buyer control, support and structure evidence.
- `puck_risk_plan` — defined invalidation and maximum-dollar-risk sizing.
- `puck_catalyst_check` — catalyst classification and source/dilution verification flags.
- `puck_structure_check` — support, resistance and float context.

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