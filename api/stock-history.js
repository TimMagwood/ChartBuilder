// api/stock-history.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  const { symbols, resolution = 'D', days = 30 } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: 'Missing symbols parameter' });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  const symbolList = symbols.split(',').slice(0, 5); // max 5 stocks for performance

  const now = Math.floor(Date.now() / 1000);
  const from = now - (days * 24 * 60 * 60); // X days ago

  try {
    const results = await Promise.all(
      symbolList.map(async (symbol) => {
        const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.s !== 'ok') {
          throw new Error(`Failed to fetch data for ${symbol}`);
        }

        const prices = data.t.map((timestamp, i) => ({
          time: timestamp,
          close: data.c[i]
        }));

        return { symbol, prices };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical stock data' });
  }
}
