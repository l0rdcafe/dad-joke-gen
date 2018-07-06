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

export default DadJokeAPI;
