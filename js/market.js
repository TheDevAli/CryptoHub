/*
/* Trending Coins
/* Uses the API to fetch the top 3
/* trending coins and displays
/* their BTC value
*/
function trendingCoins() {    
  fetch("https://api.coingecko.com/api/v3/search/trending")
  .then(response => response.json())
  .then(response => {
    //get the top 3 coins from the response
    for (let i = 0; i < 3; i++) {
      const coin = response.coins[i];
      //populate the html elements accordingly
      document.getElementById(`icon-coin-${i+1}`).src = coin.item.small;
      document.getElementById(`name-coin-${i+1}`).innerHTML = `${coin.item.name} (${coin.item.symbol})`;
      document.getElementById(`price-coin-${i+1}`).innerHTML = `${coin.item.price_btc} BTC`;

      //event listener for hovering over the trending coin containers
      //displays price of the coin while hiding the name
      document.getElementById(`trending-${i+1}`).addEventListener('mouseover', ev => {
        document.getElementById(`name-coin-${i+1}`).style.display = "none";
        document.getElementById(`price-coin-${i+1}`).style.display = "block";
      });

      //event listener for hovering out of the trending coin containers
      //displays name of the coin while hiding the price
      document.getElementById(`trending-${i+1}`).addEventListener('mouseout', ev => {
        document.getElementById(`name-coin-${i+1}`).style.display = "block";
        document.getElementById(`price-coin-${i+1}`).style.display = "none";
      });
    };
  }); 
};

/*
/* populateMarket()
/* Uses the API to fetch coins
/* and fetches their data
/* to be updated & displayed 
/* creates popup for smaller devices
/* with data populated
*/
let pricePopup;
let popup;
function populateMarket() {
  const mobileVerAPI = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";
  fetch(mobileVerAPI)
  .then(response => response.json())
  .then(response => {
    const table = document.getElementById("market-data-table"); //<tbody>
    response.forEach((item) => {
      const row = table.insertRow();
      const rank = row.insertCell(-1);
      const name = row.insertCell(-1);
      const price = row.insertCell(-1);
      const additionalInfo = row.insertCell(-1);
      const twentyFourHourPct = row.insertCell(-1);
      const marketCap = row.insertCell(-1);
      const volume = row.insertCell(-1);
      const circulatingSupply = row.insertCell(-1);

      rank.innerHTML = item.market_cap_rank;
      name.innerHTML = `${item.name} (${item.symbol.toUpperCase()})`;
      price.innerHTML = `$${item.current_price}`;

      price.style.textDecoration = "underline";
      price.style.backgroundColor = "orange";
      price.style.cursor = "pointer";
      price.setAttribute('aria-label', `Current price of ${item.name} and prices in the last week.`);

      twentyFourHourPct.innerHTML = `${item.price_change_percentage_24h}%`;
      marketCap.innerHTML = `$${item.market_cap}`;
      volume.innerHTML = `$${item.total_volume}`;
      circulatingSupply.innerHTML = `${item.circulating_supply} ${item.symbol.toUpperCase()}`;

      pricePopup = document.querySelector('.priceDataPopup');
      price.addEventListener('click', ev => {
        pricePopup.style.display = "block";
        coinPastPrices(item.id);
      }); 

      if (item.price_change_percentage_24h < 0) {
        twentyFourHourPct.setAttribute("style", "color: red");
      } else {
        twentyFourHourPct.setAttribute("style", "color: green");
      };

      //create a new "+" button element to populate table with
      const additionalInfoBtn = document.createElement('input');
      additionalInfoBtn.setAttribute('type', 'button');
      additionalInfoBtn.setAttribute('name', 'name');
      additionalInfoBtn.setAttribute('value', '+');
      additionalInfoBtn.setAttribute('id', 'moreInfoBtn');
      additionalInfoBtn.setAttribute('aria-label', `More information about ${item.name}`);
      additionalInfo.appendChild(additionalInfoBtn);

      //Display pop-up window with extra info when + btn is clicked
      popup = document.getElementById("infoPopup");
      const header = document.getElementById("more-info-header");
      const twentyFourPopup = document.getElementById("popup-24-val");
      const marketCapPopup = document.getElementById("popup-market-val");
      const volumePopup = document.getElementById("popup-vol-val");
      const popupCirculating = document.getElementById("popup-circ-val");

      //event listener for when "+" btn is clicked
      //opens a popup with extra info on target coin
      additionalInfoBtn.addEventListener('click', () => {
        popup.style.display = "block";
        header.innerHTML = `${item.name} (${item.symbol.toUpperCase()})`;
        marketCapPopup.innerHTML = `$${item.market_cap}`;
        volumePopup.innerHTML = `$${item.total_volume}`;
        popupCirculating.innerHTML = `${item.circulating_supply} ${item.symbol.toUpperCase()}`;

        //if 24h% < 0 make text red else green
        if (item.price_change_percentage_24h < 0) {
          twentyFourPopup.innerHTML = `&#x25BC ${item.price_change_percentage_24h}%`;
          twentyFourPopup.setAttribute("style", "color: red");
        } else {
          twentyFourPopup.innerHTML = `&#x25B2 ${item.price_change_percentage_24h}%`;
          twentyFourPopup.setAttribute("style", "color: green");
        };
      });
    });
  });
};

/*
/* function that displays the
/* cost of a coin in the last week
/* called by clicking the price in live market
*/
function coinPastPrices(coinId) {
  const API = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`;
  fetch(API)
  .then(response => response.json())
  .then(response => {
    for (let i = 0; i < response.prices.length-1; i++) {
      //get unix date from response and format it for display
      const date = new Date(response.prices[i][0]);
      const displayDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      //get the price and format it according to its value
      let price = response.prices[i][1];
      if (price > 1) {
        price = price.toFixed(2);
      };
      //populate the html elements using the index
      document.getElementById(`popup-minus${i}`).innerHTML = `${displayDate} : $${price}`;
    };
  });
};

//add event listener for when user clicks outside of  either popup
//closes popup
window.addEventListener('click', ev => {
  if (ev.target == popup) {
    popup.style.display = "none";
  } else if (ev.target == pricePopup) {
    pricePopup.style.display = "none";
  }; 
}); 

/* function that checks 
/if user resizes window from 768px (desktop +) to tablet/mobile view
/scroll to top as the smaller views have a fixed viewport (unscrollable)
/set scroll to top button as display none */
function checkWindow() {
  if (window.innerWidth < 768) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    toTopBtn.style.display = "none";
  };
};

//call checkWindow when window has been resized
window.addEventListener('resize', ev => {
  checkWindow();
});

//add event listener for close button in the popups
//closes popup
morePopupCloseBtn.addEventListener('click', () => {
  popup.style.display = "none";
});

pricePopupCloseBtn.addEventListener('click', () => {
  pricePopup.style.display = "none";
});

//populate trending coins and live market on load
window.addEventListener('load', () => {
  trendingCoins();
  populateMarket();
});