//https://css-tricks.com/video-screencasts/150-hey-designers-know-one-thing-javascript-recommend/
// Selects the FIRST occurance of <button>;
var button = document.querySelector("#toggle");
var element = document.querySelector("#collapse");

button.addEventListener("click", function() {
  element.classList.toggle("-open");
  button.classList.toggle("-open");
});