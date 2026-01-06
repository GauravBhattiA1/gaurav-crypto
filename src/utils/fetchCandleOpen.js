export async function fetchCandleOpen(symbol, interval) {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    // kline format: [openTime, open, high, low, close, volume, ...]
    return parseFloat(data[0][1]);
  } catch (err) {
    console.error("fetchCandleOpen error:", symbol, err);
    return null;
  }
}
