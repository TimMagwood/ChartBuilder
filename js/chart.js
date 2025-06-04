document.addEventListener('DOMContentLoaded', () => {
  const stockOptionsContainer = document.getElementById('stock-options');

  fetch('http://localhost:3001/api/popular-stocks')
    .then(res => res.json())
    .then(data => {
      stockOptionsContainer.innerHTML = '';
      data.forEach(stock => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" value="${stock.symbol}" />
          ${stock.symbol}
        `;
        stockOptionsContainer.appendChild(label);
      });
    })
    .catch(err => {
      console.error('Error fetching stocks:', err);
      stockOptionsContainer.innerHTML = `<p style="color:red;">Error loading stocks.</p>`;
    });
});


function renderChart(type, data, stocks) {
    d3.select("#chart").selectAll("*").remove();
    if (type === "line") {
      renderLineChart(data, stocks);
    } else if (type === "bar") {
      renderBarChart(data, stocks);
    }
    // Add more types as needed
  }