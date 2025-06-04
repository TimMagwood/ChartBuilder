import fetch from 'node-fetch'; // or native fetch in Node 18+

export default function handler(req, res) {
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)' },
    { symbol: 'TSLA', name: 'Tesla Inc.' }
  ];

  res.status(200).json(popularStocks);
}
