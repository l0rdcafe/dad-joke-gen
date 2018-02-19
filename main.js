const DadJokeAPI = (function() {
  const fetchRandJoke = function() {
    const url = "http://icanhazdadjoke.com/";
    return fetch(url, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));
  };

  return {
    fetchRandJoke
  };
})();

const model = (function() {
  let jokes = [];
  let count = 0;
  let currentQuery = "";

  const state = {
    jokes,
    count,
    currentQuery
  };

  const appendJokes = function(jokesArr) {
    jokesArr.forEach(joke => {
      jokes.push(joke);
    });
  };

  const incrementJokeCount = function() {
    count += 1;
  };

  const resetJokes = function() {
    jokes = [];
    count = 0;
    currentQuery = "";
  };

  const setJoke = function(query) {
    currentQuery = query;
  };

  return {
    state,
    setJoke,
    resetJokes,
    appendJokes,
    incrementJokeCount
  };
})();

const view = (function() {
  const render = function(joke) {
    const jokeText = document.getElementById("jokeText");
    jokeText.innerHTML = joke;
  };

  const drawSpinner = function() {
    const jokeText = document.getElementById("jokeText");
    const spinnerSpan = document.createElement("span");
    const spinnerIcon = document.createElement("i");
    spinnerIcon.className = "fa fa-spinner fa-spin fa-lg";
    spinnerSpan.className = "has-text-centered loading";
    spinnerSpan.appendChild(spinnerIcon);
    jokeText.appendChild(spinnerSpan);
  };
  const clearText = function() {
    document.getElementById("jokeText").textContent = "";
  };

  return {
    render,
    drawSpinner,
    clearText
  };
})();

const handlers = (function() {
  const getJoke = function() {
    DadJokeAPI.fetchRandJoke()
      .then(res => {
        model.appendJokes([res.joke]);
        view.render(res.joke);
      })
      .catch(err => console.error(err));
  };

  const randJoke = function() {
    view.clearText();
    view.drawSpinner();
    getJoke();
  };

  const fetchJoke = function() {
    const randBtn = document.getElementById("randJoke");
    randBtn.addEventListener("click", randJoke);
  };

  return {
    fetchJoke,
    randJoke
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  handlers.randJoke();
  handlers.fetchJoke();
});
