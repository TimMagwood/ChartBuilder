// state.js
window.AppState = {
    getChartType: () => localStorage.getItem('chartType'),
    setChartType: (type) => localStorage.setItem('chartType', type),
    getSelectedStocks: () => JSON.parse(localStorage.getItem('selectedStocks')),
    setSelectedStocks: (stocks) => localStorage.setItem('selectedStocks', JSON.stringify(stocks)),
  };