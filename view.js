const render = function(joke) {
  const jokeText = document.getElementById("jokeText");
  jokeText.innerHTML = joke;
};

const drawSpinner = function() {
  const jokeText = document.getElementById("jokeText");
};

export default { render, drawSpinner };
