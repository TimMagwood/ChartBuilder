document.addEventListener('DOMContentLoaded', () => {
  const stockOptionsContainer = document.getElementById('stock-options');
  const renderBtn = document.getElementById('render-btn');

  // Fetch top stocks from your Vercel API
  fetch('/api/popular-stocks')
    .then(res => res.json())
    .then(stocks => {
      stockOptionsContainer.innerHTML = '';
      stocks.forEach(stock => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" value="${stock.symbol}" />
          ${stock.symbol}
        `;
        stockOptionsContainer.appendChild(label);
      });
    })
    .catch(err => {
      console.error('Error loading stocks:', err);
      stockOptionsContainer.innerHTML = '<p style="color:red;">Failed to load stock options.</p>';
    });

  // Render chart when button is clicked
  renderBtn.addEventListener('click', async () => {
    const selectedSymbols = Array.from(document.querySelectorAll('#stock-options input:checked')).map(cb => cb.value);
    if (selectedSymbols.length === 0) return alert('Select at least one stock.');

    try {
      const query = selectedSymbols.join(',');
      const res = await fetch(`/api/stock-history?symbols=${query}&days=30`);
      const stockData = await res.json();

      renderLineChart(stockData); // call D3 rendering
    } catch (err) {
      console.error('Chart render error:', err);
    }
  });
});


// === D3 Line Chart Rendering ===
function renderLineChart(data) {
  const margin = { top: 20, right: 60, bottom: 40, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Clear previous chart
  d3.select("#chart").html('');

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Flatten and format data
  const allDates = new Set();
  data.forEach(stock => {
    stock.prices.forEach(d => {
      d.date = new Date(d.time * 1000);
      allDates.add(d.date);
    });
  });

  const x = d3.scaleTime()
    .domain(d3.extent(Array.from(allDates)))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([
      d3.min(data, s => d3.min(s.prices, d => d.close)),
      d3.max(data, s => d3.max(s.prices, d => d.close))
    ])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(6));
  svg.append("g")
    .call(d3.axisLeft(y));

  // Lines
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

  data.forEach((stock, i) => {
    svg.append("path")
      .datum(stock.prices)
      .attr("fill", "none")
      .attr("stroke", color(stock.symbol))
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add label
    svg.append("text")
      .attr("transform", `translate(${width}, ${y(stock.prices[stock.prices.length - 1].close)})`)
      .attr("x", 5)
      .attr("dy", "0.35em")
      .style("fill", color(stock.symbol))
      .text(stock.symbol);
  });
}
