// Bargain Beacon: a Black Friday deal finder. Two hash routes:
//
//   #/            the board, with search and filters
//   #/deal/<id>   one deal, with its verdict and store link
//
// The board re-renders in place as the shopper types or changes a filter,
// so a filter never needs a page load. window.__shotReady is false while a
// page renders and true once it is on screen, so a screenshot script knows
// when to capture.

import { deals } from "./data.js";
import { applyFilters, boardCounts, defaultState } from "./filters.js";
import { dealPage, emptyGrid, listPage, missingPage, dealCard } from "./views.js";

const app = document.getElementById("app");
const counts = boardCounts(deals);
const state = defaultState();

function renderBoard() {
  const shown = applyFilters(deals, state);
  app.innerHTML = listPage(shown, state, counts);
  const grid = app.querySelector("#grid");
  if (shown.length === 0) grid.innerHTML = emptyGrid();
  const count = app.querySelector("#count");
  count.textContent = `Showing ${shown.length} of ${counts.total} deals`;
  const q = app.querySelector("#q");
  q.addEventListener("input", () => {
    state.q = q.value;
    refreshGrid();
  });
  for (const [id, key] of [["cat", "cat"], ["store", "store"], ["minoff", "minoff"], ["sort", "sort"]]) {
    const el = app.querySelector(`#${id}`);
    el.addEventListener("change", () => {
      state[key] = key === "minoff" ? Number(el.value) : el.value;
      refreshGrid();
    });
  }
  const clear = app.querySelector("#clear");
  if (clear) clear.addEventListener("click", (e) => { e.preventDefault(); Object.assign(state, defaultState()); renderBoard(); });
}

function refreshGrid() {
  const shown = applyFilters(deals, state);
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  grid.innerHTML = shown.length === 0 ? emptyGrid() : shown.map(dealCard).join("");
  count.textContent = `Showing ${shown.length} of ${counts.total} deals`;
  const clear = document.getElementById("clear");
  if (clear) clear.addEventListener("click", (e) => { e.preventDefault(); Object.assign(state, defaultState()); renderBoard(); });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | Bargain Beacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "Bargain Beacon — Black Friday deals, checked";
    renderBoard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
