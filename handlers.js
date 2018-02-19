import * as DadJokeAPI from "./dad-jokes";
import * as model from "./model";
import * as view from "./view";

const initJoke = function() {
  const jokePromise = DadJokeAPI.fetchRandJoke();
  jokePromise
    .then(joke => {
      model.appendJokes([joke.joke]);
      view.render(joke.joke);
    })
    .catch(err => console.error(err));
};

document.addEventListener("DOMContentLoaded", () => {
  initJoke();
});
