import DadJokeAPI from "./dadjoke-api";
import model from "./model";
import view from "./view";
import { $on, qs } from "./helpers";

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
    const randBtn = qs("#randJoke");
    $on(randBtn, "click", randJoke);
  };

  const nextJoke = function() {
    const nextBtn = qs("#nextJoke");

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
    const searchBtn = qs("#searchTerm");
    const searchJoke = function() {
      const searchField = qs("#searchField");

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
    $on(document, "keydown", e => {
      const isEnterKey = e.which === 13 || e.keyCode === 13;
      if (isEnterKey) {
        searchJoke();
      }
    });
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
