const inputField = document.querySelector('.cryptoDropdown'); //input
const dropdown = document.querySelector('.cryptoList'); //ul
const dropdownArray = [... document.querySelectorAll('li')]; //li
const table = document.querySelector('#portfolio-data'); //<tbody>

const allCoinsIdArray = []; //array to store all coin ids
const allCoinsArray = []; //array to store all coins names
const allCoinsPriceArray = []; //array to store all coins prices

/*
/* function that's called on load
/* populates dropdown with supported
/* cryptocurrencies.
*/
async function populateDropdown() {
  const allCoins = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=249"
                   "&page=1&sparkline=false&price_change_percentage=24h";
  const response = await fetch(allCoins, {});
  const response_1 = await response.json();
  const dropdownFragment = document.createDocumentFragment();
  response_1.forEach((item) => {
    //add all coins id's & names to arrays
    allCoinsIdArray.push(item.id);
    allCoinsArray.push(item.name.toLowerCase());
    allCoinsPriceArray.push(item.current_price);

    //add every item to the dropdown as a list element
    const newCoin = document.createElement('li');
    newCoin.innerHTML = item.name;
    dropdownFragment.appendChild(newCoin);

    //add new list elements to list elements array
    dropdownArray.push(newCoin);
  });
  dropdown.appendChild(dropdownFragment);    
};

/*
/* function that adds a coin to the portfolio
/* table using the api call. Creates appropriate
/* rows, and updates its values.
*/
function addCoinToTable(coin) {
  //fetch data from api to populate table
  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}
         &order=market_cap_desc&per_page=250&page=1&sparkline=false`)
  .then(response => response.json())
  .then(response => {  
    response.forEach((item) => {
      const coinName = item.name;
      const coinSymbol = item.symbol;
      const coinPrice = item.current_price;
 
      //create row and cells
      const row = table.insertRow();
      const crypto = row.insertCell(-1);
      const price = row.insertCell(-1);
      const amount = row.insertCell(-1);
      const amountUSD = row.insertCell(-1);
      const removeCoin = row.insertCell(-1);

      //update cells
      crypto.innerHTML = `${coinName} (${coinSymbol.toUpperCase()})`; 
      price.innerHTML = coinPrice;
      amountUSD.innerHTML = "0";

      //create a number input for amount
      const amountInput = document.createElement('input');
      amountInput.setAttribute('type', 'number');
      amountInput.setAttribute('name', 'amountUSD');
      amountInput.setAttribute('value', '0.00');
      amountInput.setAttribute('min', '0.00');
      amountInput.setAttribute('step', 'any');
      amountInput.setAttribute('id', 'amountInputField');
      amountInput.setAttribute('aria-label', `Input amount of ${coinName}`);
      amount.appendChild(amountInput);

      //update amountUSD when amount is updated
      amountInput.addEventListener("change", ev => {
        if (amountInput.value < 0) {
          amountInput.value = 0.00;
          amountUSD.innerHTML = "0";
          alert("You cannot use negative values!");
        } else {
          const coinUsdTotal = coinPrice * amountInput.value;
          amountUSD.innerHTML = coinUsdTotal.toFixed(2);
        };
        //calculate portfolio total
        calcTotal(table);
      });   
 
      //create a remove button
      const removeBtn = document.createElement('input');
      removeBtn.setAttribute('type', 'button');
      removeBtn.setAttribute('name', 'name');
      removeBtn.setAttribute('value', '×');
      removeBtn.setAttribute('id', 'removeCoinBtn');
      removeBtn.setAttribute('aria-label', `remove ${coinName} from portfolio`);
      removeCoin.appendChild(removeBtn); 
      removeBtn.addEventListener('click', ev => {
        row.remove();
        //call calcTotal to calculate new total
        calcTotal(table);
        checkTable(table);
      }); 
 
      //show portfolio total & save/clear button
      portfolioTotal.removeAttribute('hidden');
      saveBtn.removeAttribute('hidden');
      clearBtn.removeAttribute('hidden');
    });
  });
};

/*
/* function saveData which
/* iterates the table and 
/* saves data accordingly as objects
/* in local storage
*/
function saveData() {
  //clear localstorage
  localStorage.clear();
  localStorage.setItem("portfolio", JSON.stringify([]));

  let newCrypto;

  for (let i = 0, row; row = table.rows[i]; i++) {
    const crypto = row.cells[0].innerHTML;
    const price = row.cells[1].innerHTML;
    const amount = row.cells[2].querySelector("#amountInputField").value;
    const amountUSD = row.cells[3].innerHTML;
    const total = totalValue.innerHTML;

    newCrypto = {
      "crypto" : crypto,
      "price" : parseFloat(price),
      "amount" : parseFloat(amount),
      "amountUSD" : parseFloat(amountUSD),
      "portfolioTotal" : total
    };

    //get correct array from localStorage
    const array = JSON.parse(localStorage.getItem("portfolio"));
    array.push(newCrypto);
    localStorage.setItem("portfolio", JSON.stringify(array));
  };
};

/*
/* function that reads the table
/* gets the coins, compares to the arrays
/* gets the index of the coin in price array
/* and updates the row cell with new price
*/
function updatePrices(table) {
   for (let i = 0, row; row = table.rows[i]; i++) {
    //get lowercase name so can compare to the array
    const cryptoNameRaw = row.cells[0].innerHTML.toLowerCase();
    //seperate crypto name from symbol
    const cryptoName = cryptoNameRaw.split(" (");
    //get the cell that holds the price
    const currentPrice = row.cells[1];
    //get the cell that holds the input amount
    const amountInput = row.cells[2].querySelector("#amountInputField").value;
    //get the cell that holds the amountUsd
    const amountUsd = row.cells[3];
    //var to hold total
    let total = 0.00;

    //compare coin to array with all names
    if (allCoinsArray.includes(cryptoName[0])) {
      //grab index of the coin and obtain price of coin from price array
      const index = allCoinsArray.indexOf(cryptoName[0]);
      const coinPrice = allCoinsPriceArray[index];
      //update the row cell with the new updated price
      currentPrice.innerHTML = coinPrice;
      //calculate new total using new price and saved amount input
      total = parseFloat(currentPrice.innerHTML) * parseFloat(amountInput);
      amountUsd.innerHTML = total.toFixed(2);
    }; 
  };
  //calculate new portfolio total
  calcTotal(table);
  //save data to local storage
  saveData();
};

/*
/* function that reads saved data
/* from local storage, creates table
/* elements and populates with data
*/
function loadData() {
  const data = JSON.parse(localStorage.getItem("portfolio"));

  data.forEach(coin => {
    const row = table.insertRow();
    const cryptoName = row.insertCell(-1);
    const price = row.insertCell(-1);
    const amount = row.insertCell(-1);
    const amountUsd = row.insertCell(-1);
    const removeCrypto = row.insertCell(-1);

    if (table.rows.length > 0) {
      portfolioTotal.removeAttribute('hidden');
      saveBtn.removeAttribute('hidden');
      clearBtn.removeAttribute('hidden');
    };
    
    //create a number input for amount
    const amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'number');
    amountInput.setAttribute('name', 'amountUSD');
    amountInput.setAttribute('step', 'any');
    amountInput.setAttribute('id', 'amountInputField');  
    amountInput.setAttribute('aria-label', 'Input amount of cryptocurrency');

    if (localStorage.getItem('amount') !== "") {
      const amountValue = parseFloat(coin.amount);
      amountInput.setAttribute('value', amountValue);
    } else {
      amountInput.setAttribute('value', '0.00');
    };

    amountInput.addEventListener('change', ev => {
      if (amountInput.value < 0) {
        amountInput.value = 0.00;
        amountUsd.innerHTML = "0";
        alert("You cannot use negative values!");
      } else {
        amountInput.style.borderColor = "green";
        amountInput.style.borderWidth = "2px";
        const coinUsdTotal = coin.price * amountInput.value;
        amountUsd.innerHTML = coinUsdTotal.toFixed(2);
      };
      //calculate portfolio total
      calcTotal(table);
    });

    const removeCryptoBtn = document.createElement('input');
    removeCryptoBtn.setAttribute('type', 'button');
    removeCryptoBtn.setAttribute('name', 'name');
    removeCryptoBtn.setAttribute('value', '×');
    removeCryptoBtn.setAttribute('id', 'removeCoinBtn');
    removeCryptoBtn.setAttribute('aria-label', 'remove cryptocurrency from portfolio');
    removeCrypto.appendChild(removeCryptoBtn);
    removeCryptoBtn.addEventListener('click', ev => {
      row.remove();
      calcTotal(table);
      checkTable(table);
    }); 
        
    cryptoName.innerHTML = coin.crypto;
    price.innerHTML = coin.price;
    amount.appendChild(amountInput);
    amountUsd.innerHTML = parseFloat(coin.amountUSD).toFixed(2);
    removeCrypto.appendChild(removeCryptoBtn);

    calcTotal(table);
  }); 
  //call updatePrices so new data is applied to the existing saved data on the table
  updatePrices(table);
};

/*
/* Function that iterates
/* table to calculate 
/* amountUSD column total
/* populates portfolio total
*/
function calcTotal(table) {
  const totalText = document.querySelector('#totalValue');
  let total = 0.00;
  //iterate through table rows index
  for (let i = 0, row; row = table.rows[i]; i++) {
    const amountUsdText = row.cells[3].innerHTML;
    const amountUsdNumber = parseFloat(amountUsdText);
    total += amountUsdNumber;
    totalFormatted = total.toFixed(2);
    totalText.innerHTML = `Portfolio Total: $${totalFormatted}`;
  };
};

//function to check if table has no data
//if no data, clear local storage, and hide appropriate
//elements
function checkTable(table) {
  if (table.rows.length === 0) {
    localStorage.clear();
    totalValue.innerHTML = "Portfolio Total: $0.00";
    portfolioTotal.setAttribute('hidden', 'true');
    saveBtn.setAttribute('hidden', 'true');
    clearBtn.setAttribute('hidden', 'true');
  };
};

/*
/*function to clear the table
/*call checkTable to validate.
*/
function clearTable(table) {
  table.innerHTML = "";
  checkTable(table);
};

/*
/* dropdown event listener which 
/* calls addCoinToTable() depending
/* on dropdown selection
*/
dropdown.addEventListener('click', ev => {  
  //reset dropdown attributes       
  dropdown.classList.add('closed');
  inputField.value = '';
  inputField.placeholder = "Add Crypto";

  const selectedCoin = ev.target.innerText.toLowerCase();
  const rawCoinName = selectedCoin.split(" (");
    
  //compare selected coin to array with all names
  if (allCoinsArray.includes(rawCoinName[0])) {
    //grab index of the coin and obtain other data from other arrays using index
    const index = allCoinsArray.indexOf(rawCoinName[0]);
    const coinId = allCoinsIdArray[index];
    //call function to append data to table
    addCoinToTable(coinId);
  };
});

//event listeners for dropdown
inputField.addEventListener('focus', () => {
  inputField.placeholder = 'Type to filter';
  dropdown.classList.add('open');
  dropdownArray.forEach(dropdown => {
    dropdown.classList.remove('closed');
  });
});

inputField.addEventListener('blur', () => {
  inputField.value = '';
  inputField.placeholder = 'Add Crypto';
  dropdown.classList.remove('open');
});

document.addEventListener('click', ev => {
  const isDropdown = dropdown.contains(ev.target);
  const isInput = inputField.contains(ev.target);
    if (!isDropdown && !isInput) {
      dropdown.classList.remove('open');
    };
});

inputField.addEventListener('input', () => {           
  let inputValue = inputField.value.toLowerCase();
  if (inputValue.length > 0) {
    allCoinsArray.forEach((item, index) => {
      if (!(inputValue.substring(0, inputValue.length) === item.substring(0, inputValue.length))) {
        //if doesn't match
        dropdownArray[index].classList.add('closed');
      } else {
        //if matches
        dropdownArray[index].classList.remove('closed');
      };
    });
  } else {
    for (let i = 0; i < dropdownArray.length; i++) {
      dropdownArray[i].classList.remove('closed');
    };  
  };
});

//save button event listener to call saveData();
saveBtn.addEventListener('click', () => {
  saveData();
});

//clear button that will ask for confirmation and clear the portfolio
clearBtn.addEventListener('click', () => {
  if (confirm("By clearing your portfolio, all data will be reset and you'll have to start over.", 
              "Press Ok if you wish to proceed.")) {
    clearTable(table);
  } else {
    //do nothing
  };
});

//first time user uses site, generate local storage key:value pair
//populateDropdown() then loadData from local storage
//this makes it so that when the data is displayed on the table
//the saved cryptocurrencies are updated with their current price,
//amount in USD and the portfolio total.
window.addEventListener('load', () => {
  if (localStorage.length === 0) {
    localStorage.setItem("portfolio", JSON.stringify([]));
  };
  populateDropdown()
  .then(() => loadData());
});