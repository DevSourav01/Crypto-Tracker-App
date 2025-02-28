function getCoinIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const coinId = urlParams.get("coinId"); // Should return the coinId from URL
  console.log("Extracted Coin ID from URL:", coinId); // Debugging log
  return coinId;
}

// Fetch and display the crypto details
async function fetchCryptoDetails(coinId) {
  if (!coinId) return; // Prevent fetching if no valid coinId is provided

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
    );
    const data = await response.json();
    console.log("API Response Data:", data); // Check if correct data is received

    if (data.length > 0) {
      updateCryptoDetails(data[0]); // Update UI with coin data
    } else {
      console.error("No data found for the specified coin.");
    }
  } catch (error) {
    console.error("Error fetching crypto details:", error);
  }
}

// Update UI with fetched coin data
function updateCryptoDetails(coin) {
  console.log("Updating UI with:", coin); // Debugging log
  document.querySelector(".image-title img").src = coin.image;
  document.querySelector(".image-title img").alt = coin.name;
  document.querySelector(".crypto-title").textContent = coin.name;
  document.querySelector(".rank").textContent = coin.market_cap_rank || "N/A";
  document.querySelector(".price").textContent = `$${coin.current_price.toLocaleString()}`;
  document.querySelector(".market-cap").textContent = `$${coin.market_cap.toLocaleString()}`;
}

// Get the selected coin ID from URL and fetch details
const selectedCoinId = getCoinIdFromURL();
fetchCryptoDetails(selectedCoinId); // Fetch details for the selected coin

// Get canvas context for chart
const ctx = document.querySelector(".coin-chart").getContext("2d");
let cryptoChart; // Store chart instance globally

// Function to fetch cryptocurrency price data for the chart
async function fetchCryptoChartData(coinId, days) {
  if (!coinId) return; // Prevent fetching if no valid coinId is provided

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await response.json();

    // Extract timestamps & prices
    const timestamps = data.prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    );
    const prices = data.prices.map((price) => price[1]);

    updateChart(timestamps, prices, `${coinId.toUpperCase()} Price (USD)`);
  } catch (error) {
    console.error("Error fetching crypto chart data:", error);
  }
}

// Function to create/update the chart
function updateChart(labels, data, label) {
  if (cryptoChart) {
    cryptoChart.destroy(); // Destroy existing chart before creating a new one
  }

  cryptoChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: "#f8d210",
          backgroundColor: "rgba(248, 210, 16, 0.2)",
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: true } },
        y: { beginAtZero: false },
      },
    },
  });
}

// Fetch chart data for selected coin with default time range (7 days)
fetchCryptoChartData(selectedCoinId, 7);

// Handle time range selection dynamically
document.querySelectorAll(".time-range-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const timeRange = event.target.dataset.range; // Get selected range from data attribute
    fetchCryptoChartData(selectedCoinId, timeRange);
  });
});
