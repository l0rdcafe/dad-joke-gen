function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function gId(selector, scope) {
  return (scope || document).getElementById(selector);
}

function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}

function $on(target, type, cb, useCapture) {
  target.addEventListener(type, cb, !!useCapture);
}

function $delegate(target, selector, type, handler) {
  const useCapture = type === "blur" || type === "focus";

  function dispatchEvent(event) {
    const targetElement = event.target;
    const potentialElements = qsa(selector, target);
    if (Array.from(potentialElements).includes(targetElement)) {
      handler.call(targetElement, event);
    }
  }
  $on(target, type, dispatchEvent, useCapture);
}

function $parent(element, tagName) {
  if (!element.parentNode) {
    return undefined;
  }

  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }
  return $parent(element.parentNode, tagName);
}

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
  const state = {
    jokes: [],
    currentQuery: ""
  };

  const appendJokes = function(jokesArr) {
    jokesArr.forEach(joke => {
      state.jokes.push(joke);
    });
  };

  const resetJokes = function() {
    state.jokes = [];
    state.currentQuery = "";
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
    const jokeText = gId("jokeText");
    jokeText.innerHTML = joke;
  };

  const drawSpinner = function() {
    const jokeText = gId("jokeText");
    const spinner = `<span class="has-text-centered loading"><i class="fa fa-spinner fa-spin fa-lg"></i></span>`;
    jokeText.innerHTML = spinner;
  };

  const clearText = function() {
    gId("jokeText").textContent = "";
  };

  const drawError = function(message) {
    const errorNotif = `<div class="is-danger notification has-text-centered" style="width: 30%; display: block; margin: auto; margin-bottom: 1.25em;">${message}</div>`;
    const sect = qs(".section");
    sect.insertAdjacentHTML("afterbegin", errorNotif);
    setTimeout(() => {
      const notif = qs(".notification");
      $parent(notif, "section").removeChild(notif);
    }, 2000);
  };

  const drawNextBtn = function() {
    const searchBtn = gId("searchTerm");
    const nextBtnParent = $parent(searchBtn, "h1");
    const nextBtn = `<button class="button is-warning" style="border-bottom-left-radius: 0; border-top-left-radius: 0;" id="nextJoke">Next Joke</button>`;
    nextBtnParent.removeChild(searchBtn);
    nextBtnParent.insertAdjacentHTML("beforeend", nextBtn);
  };

  const drawNewSearchBtn = function() {
    const nextBtn = gId("nextJoke");
    const searchBtn = `<button class="button is-warning" style="border-bottom-left-radius: 0; border-top-left-radius: 0;" id="searchTerm">Search Term</button>`;
    const searchBtnParent = $parent(nextBtn, "h1");
    searchBtnParent.removeChild(nextBtn);
    searchBtnParent.insertAdjacentHTML("beforeend", searchBtn);
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
    const randBtn = gId("randJoke");
    $on(randBtn, "click", randJoke);
  };

  const nextJoke = function() {
    const nextBtn = gId("nextJoke");

    function getNext() {
      if (model.state.jokes.pop() !== undefined) {
        view.render(model.state.jokes.pop().joke);
      } else {
        view.drawError("Out of jokes!");
        view.drawNewSearchBtn();
        handlers.searchQuery();
      }
    }
    $on(nextBtn, "click", getNext);
  };

  const searchQuery = function() {
    const searchBtn = gId("searchTerm");
    const searchJoke = function() {
      const searchField = gId("searchField");

      if (searchField.value === "") {
        view.drawError("Please search a term.");
      } else {
        model.resetJokes();
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
    $on(searchBtn, "click", searchJoke);
  };

  return {
    fetchJoke,
    randJoke,
    searchQuery,
    nextJoke
  };
})();

$on(document, "DOMContentLoaded", () => {
  handlers.randJoke();
  handlers.fetchJoke();
  handlers.searchQuery();
});
