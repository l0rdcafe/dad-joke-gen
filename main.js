const DadJokeAPI = (function() {
  const defaultUrl = "https://icanhazdadjoke.com/";
  function getJSON(url) {
    return fetch(url, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .catch(err => err);
  }
  const fetchRandJoke = function() {
    return getJSON(defaultUrl);
  };

  const fetchJokesByTerm = function(term) {
    const url = `${defaultUrl}/search?term=${term}`;
    return getJSON(url);
  };

  return {
    fetchRandJoke,
    fetchJokesByTerm
  };
})();

const model = (function() {
  let jokes = [];
  let currentQuery = "";

  const state = {
    jokes,
    currentQuery
  };

  const appendJokes = function(jokesArr) {
    jokesArr.forEach(joke => {
      state.jokes.push(joke);
    });
  };

  const resetJokes = function() {
    jokes = [];
    currentQuery = "";
  };

  const setJoke = function(query) {
    state.currentQuery = query;
  };

  return {
    state,
    setJoke,
    resetJokes,
    appendJokes
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

  const drawError = function(message) {
    const errorNotif = document.createElement("div");
    errorNotif.className = "is-danger notification";
    errorNotif.textContent = message;
    const cont = document.querySelector(".container");
    cont.insertBefore(errorNotif, cont.firstChild);
    setTimeout(() => {
      errorNotif.parentNode.removeChild(errorNotif);
    }, 2500);
  };

  const drawNextBtn = function() {
    const searchBtn = document.getElementById("searchTerm");
    const nextBtnParent = searchBtn.parentNode;
    const nextBtn = document.createElement("button");
    nextBtn.className = "button is-warning";
    nextBtn.style.display = "block";
    nextBtn.style.margin = "auto";
    nextBtn.setAttribute("id", "nextJoke");
    nextBtn.textContent = "Next Joke";
    searchBtn.parentNode.removeChild(searchBtn);
    nextBtnParent.appendChild(nextBtn);
  };

  const drawNewSearchBtn = function() {
    const nextBtn = document.getElementById("nextJoke");
    const searchBtn = document.createElement("button");
    const searchBtnParent = nextBtn.parentNode;
    searchBtn.className = "button is-warning";
    searchBtn.style.display = "block";
    searchBtn.style.margin = "auto";
    searchBtn.setAttribute("id", "searchTerm");
    searchBtn.textContent = "Search Term";
    nextBtn.parentNode.removeChild(nextBtn);
    searchBtnParent.appendChild(searchBtn);
  };

  return {
    render,
    drawSpinner,
    clearText,
    drawError,
    drawNextBtn,
    drawNewSearchBtn
  };
})();

const handlers = (function() {
  const getJoke = function() {
    model.resetJokes();
    DadJokeAPI.fetchRandJoke()
      .then(res => {
        model.appendJokes([res.joke]);
        view.render(res.joke);
      })
      .catch(view.drawError);
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

  const nextJoke = function() {
    const nextBtn = document.getElementById("nextJoke");

    function getNext() {
      if (model.state.jokes.pop()) {
        view.render(model.state.jokes.pop().joke);
      } else {
        view.drawError("Out of jokes!");
        view.drawNewSearchBtn();
        handlers.searchQuery();
      }
    }
    nextBtn.addEventListener("click", getNext);
  };

  const searchQuery = function() {
    const searchBtn = document.getElementById("searchTerm");
    const searchJoke = function() {
      const searchField = document.getElementById("searchField");

      if (searchField.value === "") {
        view.drawError("Please search a term.");
      } else {
        model.setJoke(searchField.value);
        view.clearText();
        view.drawSpinner();
        view.drawNextBtn();
        DadJokeAPI.fetchJokesByTerm(model.state.currentQuery).then(res => {
          if (res.results.length > 0) {
            model.appendJokes([...res.results]);
            view.render(model.state.jokes.pop().joke);
          } else {
            view.drawError(`Could not find results for ${model.state.currentQuery}`);
            view.clearText();
            view.drawNewSearchBtn();
            handlers.searchQuery();
          }
        });
        nextJoke();
      }
    };
    searchBtn.addEventListener("click", searchJoke);
  };

  return {
    fetchJoke,
    randJoke,
    searchQuery,
    nextJoke
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  handlers.randJoke();
  handlers.fetchJoke();
  handlers.searchQuery();
});
