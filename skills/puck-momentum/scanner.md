# Puck Scanner Workflow

When the user says check, scan, find runners, or asks what is moving, use puck_market_scan first.

Default scanner profile:
- price: $0.01-$3.99
- minimum change: 10%
- minimum volume: 100,000
- return up to 8 candidates

Then deepen the strongest candidates with puck_check_symbol, puck_catalyst_check, puck_structure_check, and puck_historical_pattern_scan.

The historical tool is descriptive: it shows prior windows that resembled the current price/volume shape and what followed. Similarity is not a guarantee or forecast.

Prioritize: Top Gainers → Speed → Spread → Volume → Entry → Exit.

Never invent tape, Level 2, spread, float, catalyst, or SEC facts. Missing data remains missing.
