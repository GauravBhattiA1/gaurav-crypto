// src/utils/timeframes.js

export const TIMEFRAMES = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "8h", value: "8h" },
  { label: "1d", value: "1d" },
  { label: "1w", value: "1w" },

  // 🔥 MONTHS (ROLLING)
  { label: "1M", value: "custom-43200" },   // 30 days
  { label: "3M", value: "custom-129600" },  // 90 days
  { label: "6M", value: "custom-259200" },  // 180 days
];
