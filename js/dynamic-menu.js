/*
* Event listener that responds to menu icon being clicked (in smaller devices)
*/
menuToggler.addEventListener('click', () => {
	menu.classList.toggle('open');
	menuToggler.textContent = menuToggler.textContent === "×" ? "≡" : "×";
});