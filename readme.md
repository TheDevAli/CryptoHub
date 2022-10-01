# CryptoHub - A crypto market tracker with a portfolio simulator

## Target Audience
* This site primarily targets the crypto enthusiasts demographic.

## Four Pages
* Homepage - An introductory page displaying the purpose of the site and what it offers
* Market - An API-heavy page that displays top three trending coins as well as a live table of supported cryptocurrencies and relevant information
* Portfolio Simulator - A page that allows users to simulate a virtual crypto wallet, using cryptocurrencies and setting their amounts.
* About Cryptohub - A page that talks about the backstory of CryptoHub, why and how it was created.

## Considerations
#### CryptoHub has been developed for different screen sizes, using mobile-first design whilst handling tablets and larger devices. This ensures that regardless of the size of the device, the site is compatible and will maintain its complete functionality.
* This has been implemented using CSS media queries and modifying elements specifically to fit.
* The website is developed for sizes of 320px minimum-width and upwards.

## Guidance
### How to use Market:
* For mobile and tablet sized devices, click on a trending coin to view its bitcoin value, larger devices must hover over the coin.
* Display the price of a coin within the last week by clicking the price value of a coin.
### How to use Portfolio Simulator:
1. Use the dropdown to select any supported cryptocurrency, then update the amount of the crypto using the table Amount input field
    * By updating Amount, the table will automatically update and display the value in USD whilst updating the Portfolio Total container.
2. Use the Save button to save your current portfolio wallet to local storage, and the next time you revisit CryptoHub, the current state of your portfolio will be restored.
3. Use the Clear button if you wish to start over (you will be asked to confirm before the system empties your portfolio)

## References
### CoinGecko API - https://www.coingecko.com/en/api
### Mozilla Developer - https://developer.mozilla.org/en-US/
### w3Schools - https://www.w3schools.com/ (Also provided the code for a custom scrollbar)
### StackOverflow - https://www.stackoverflow.com
### https://www.30secondsofcode.org/css/s/rotating-card - for rotating card (Portfolio Simulator Heading)
