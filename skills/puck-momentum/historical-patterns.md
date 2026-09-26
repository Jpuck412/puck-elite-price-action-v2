# Historical Pattern Scan

Use the historical pattern tool when the user asks whether a current runner resembles prior runners or asks what the setup looked like before similar moves.

Workflow:
1. Fetch historical intraday OHLCV with extended hours.
2. Build a fingerprint from normalized price path, returns, volume intensity, candle range and acceleration.
3. Compare the current window against earlier non-overlapping historical windows.
4. Return the closest matches with exact timestamps and what happened over the following bars.
5. Show the actual prior paths/outcomes. Never convert historical similarity into a prediction or guarantee.
6. State data limitations, especially if only 1m/5m OHLCV is available; this is not tape, Level 2, bid/ask, or trade-direction data.

Preferred user command: "Scan the history for runners that looked like this."
