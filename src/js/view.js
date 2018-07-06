import { qs, $parent, $on } from "./helpers";

const view = (function() {
  const render = function(joke) {
    const jokeText = qs("#jokeText");
    jokeText.innerHTML = joke;
  };

  const drawSpinner = function() {
    const jokeText = qs("#jokeText");
    const spinner = `<span class="text-c loading"><i class="fa fa-spinner fa-spin fa-lg"></i></span>`;
    jokeText.innerHTML = spinner;
  };

  const clearText = function() {
    qs("#jokeText").textContent = "";
  };

  const drawError = function(message) {
    const errorNotif = `<div class="notif error text-c animated fadeInDown">${message}</div>`;
    const sect = qs(".section");
    sect.insertAdjacentHTML("afterbegin", errorNotif);
    setTimeout(() => {
      const notif = qs(".notif");
      notif.classList.remove("fadeInDown");
      notif.classList.add("fadeOutUp");

      $on(notif, "animationend", () => {
        notif.parentNode.removeChild(notif);
      });
    }, 2000);
  };

  const drawNextBtn = function() {
    const searchBtn = qs("#searchTerm");
    const nextBtnParent = searchBtn.parentNode;
    const nextBtn = `<button class="button--info" id="nextJoke">Next Joke</button>`;
    nextBtnParent.removeChild(searchBtn);
    nextBtnParent.insertAdjacentHTML("beforeend", nextBtn);
  };

  const drawNewSearchBtn = function() {
    const nextBtn = qs("#nextJoke");
    const searchBtn = `<button class="button--info" id="searchTerm">Search Term</button>`;
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

export default view;
