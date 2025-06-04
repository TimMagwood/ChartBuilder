import fetch from 'node-fetch'; // or native fetch in Node 18+

export default async function handler(req, res) {
  try {
    // Your logic to fetch stocks from Finnhub or elsewhere
    const response = await fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=' + process.env.FINNHUB_API_KEY);
    const data = await response.json();

    // Filter or transform data as needed
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
}
