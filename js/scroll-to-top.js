// When the user scrolls down 20px from the top of the document, show the button
function showBtn() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }; 
};

//event listener for scrolling to show to top btn
window.addEventListener('scroll', () => {
  showBtn();
});

//Event listener for when user clicks to-top button
toTopBtn.addEventListener('click', () => {
  // When the user clicks on the button, scroll to the top of the document
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});