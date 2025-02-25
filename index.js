const coinBody = document.querySelector(".coin-body");
const nextBtn = document.querySelector(".next-button");
const prevBtn = document.querySelector(".prev-button");

let cryptoData = []; // Store fetched data
let currentPage = 0;
const coinsPerPage = 25;

// Fetch Coin Data
async function fetchCoin() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    cryptoData = await response.json();
    console.log(cryptoData);
    displayCoins(); // Show first 25 coins
  } catch (e) {
    console.log(`Fetching error:`, e);
  }
}

// Display Coins (Handles Pagination)
function displayCoins() {
  coinBody.innerHTML = "";

  const start = currentPage * coinsPerPage;
  const end = start + coinsPerPage;
  const paginatedCoins = cryptoData.slice(start, end);

  paginatedCoins.forEach((coin, index) => {
    coinBody.innerHTML += `
      <tr>
        <td>${start + index + 1}</td>
        <td><img src="${coin.image}" width="30" alt="${coin.name}"/></td>
        <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td><i class="ri-star-fill"></i></td>
      </tr>
    `;
  });

  // Disable/Enable Buttons based on the page number
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = end >= cryptoData.length;
}

// Pagination Buttons
nextBtn.addEventListener("click", () => {
  if ((currentPage + 1) * coinsPerPage < cryptoData.length) {
    currentPage++;
    displayCoins();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    displayCoins();
  }
});

// Fetch Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
    fetchCoin();
  });

