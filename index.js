const coinBody = document.querySelector(".coin-body");
const nextBtn = document.querySelector(".next-button");
const prevBtn = document.querySelector(".prev-button");
const priceUp = document.querySelector("#sort-up-price");
const priceDown = document.querySelector("#sort-down-price");
const volumnUp = document.querySelector("#sort-up-volumn");
const volumnDown = document.querySelector("#sort-down-volumn");
const marketUp = document.querySelector("#sort-up-market");
const marketDown = document.querySelector("#sort-down-market");

let cryptoData = []; // Store fetched data
let currentPage = 0;
const coinsPerPage = 20;

// Fetch Coin Data
async function fetchCoin() {
  try {
    coinBody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
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
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>
        <img src="${coin.image}" width="30" alt="${
      coin.name
    }" class="coin-image" data-coin-id="${coin.id}" />
      </td>
      <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td><i class="ri-star-fill"></i></td>
    `;

    coinBody.appendChild(row);
  });

  // Add event listener for coin image click
  document.querySelectorAll(".coin-image").forEach((img) => {
    img.addEventListener("click", (e) => {
      const coinId = e.target.getAttribute("data-coin-id");
      window.location.href = `crypto-details.html?coinId=${coinId}`;
    });
  });

  // Disable/Enable Buttons based on the page number
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = end >= cryptoData.length;

  // Change button styles when disabled
  prevBtn.style.backgroundColor = prevBtn.disabled ? "grey" : "#007bff";
  nextBtn.style.backgroundColor = nextBtn.disabled ? "grey" : "#007bff";
}

// Pagination Buttons
nextBtn.addEventListener("click", () => {
  if ((currentPage + 1) * coinsPerPage < cryptoData.length) {
    coinBody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
    currentPage++;
    setTimeout(() => {
      displayCoins();
    }, 300);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    coinBody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
    setTimeout(() => {
      displayCoins();
    }, 300);
  }
});

function sortData(key, ascending = true) {
  cryptoData.sort((a, b) => (ascending ? a[key] - b[key] : b[key] - a[key]));
  displayCoins();
}

priceUp.addEventListener("click", () => sortData("current_price", true));
priceDown.addEventListener("click", () => sortData("current_price", false));
volumnUp.addEventListener("click", () => sortData("total_volume", true));
volumnDown.addEventListener("click", () => sortData("total_volume", false));
marketUp.addEventListener("click", () => sortData("market_cap", true));
marketDown.addEventListener("click", () => sortData("market_cap", false));

const searchInput = document.querySelector(".input-search");
const searchResultsDiv = document.getElementById("searchResults");

// Function to filter coins and display in separate div
function searchCoins() {
  const query = searchInput.value.toLowerCase();
  searchResultsDiv.innerHTML = ""; // Clear previous search results

  if (!query) {
    searchResultsDiv.style.display = "none";
    return;
  }

  const filteredCoins = cryptoData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );

  if (filteredCoins.length === 0) {
    searchResultsDiv.innerHTML = "<p>No results found</p>";
  } else {
    filteredCoins.forEach((coin) => {
      const coinElement = document.createElement("div");
      coinElement.classList.add("search-item");
      coinElement.innerHTML = `
      <div class="image-span">
      <img src="${coin.image}" width="30" alt="${coin.name}"/>
        <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
        </div>
        
      `;
      searchResultsDiv.appendChild(coinElement);
    });
  }

  searchResultsDiv.style.display = "block"; // Show results
}

// Event listener for dynamic search
searchInput.addEventListener("input", searchCoins);

// Fetch Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
  fetchCoin();
});
