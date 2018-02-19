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

export default { fetchRandJoke };
