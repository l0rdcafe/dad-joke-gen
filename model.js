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

export { state, appendJokes, incrementJokeCount, resetJokes, setJoke };
