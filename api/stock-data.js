// api/stock-data.js

export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: 'Missing symbols parameter' });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  const symbolList = symbols.split(',').slice(0, 5); // Limit to 5 to avoid overloading

  try {
    const quotes = await Promise.all(
      symbolList.map(async (symbol) => {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );
        const data = await response.json();
        return { symbol, ...data };
      })
    );

    res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}
