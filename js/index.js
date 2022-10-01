/*
/* BigThreeCoins()
/* Fetches USD value of the three coins
/* Populates content of <p> elements in the html
*/
function bigThreeCoins() {
  const btc = document.getElementById("bitcoin");
  const eth = document.getElementById("ethereum");
  const ltc = document.getElementById("litecoin");
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Clitecoin&vs_currencies=usd")
  .then(response => response.json())
  .then(response => {
    btc.innerHTML = `$${response.bitcoin.usd}`;
    eth.innerHTML = `$${response.ethereum.usd}`;
    ltc.innerHTML = `$${response.litecoin.usd}`;
  });

  //Display a popup alert when clicking either info buttons in the big three
  const cardHyperlinks = document.querySelectorAll(".card");
  cardHyperlinks.forEach(e=>{e.addEventListener('click', ev => {
    if (confirm("You will be redirected to the official website of the coin, do you wish to proceed?")) {
      //leave site
    } else {
      ev.preventDefault();
    };
  }); 
  });    
};

//populate big three coins on page load
window.addEventListener('load', () => {
  bigThreeCoins();
});