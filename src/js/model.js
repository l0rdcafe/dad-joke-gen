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

export default model;
