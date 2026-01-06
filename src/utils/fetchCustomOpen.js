export async function fetchCustomOpen(symbol, minutesAgo) {
  try {
    const now = Date.now();
    const startTime = now - minutesAgo * 60 * 1000;

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&startTime=${startTime}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return parseFloat(data[0][1]);
  } catch (err) {
    console.error("fetchCustomOpen error:", symbol, err);
    return null;
  }
}
