// Search, filter and sort. Pure functions over the deal list, so the list
// page can re-render them without touching the address bar.

import { discountPercent, saving, verdict } from "./verdict.js";

export function boardCounts(deals) {
  const categories = [...new Set(deals.map((d) => d.category))].sort();
  const stores = [...new Set(deals.map((d) => d.store))].sort();
  return {
    total: deals.length,
    newLow: deals.filter((d) => verdict(d).key === "new-low").length,
    best: Math.max(...deals.map(discountPercent)),
    saved: deals.reduce((sum, d) => sum + saving(d), 0),
    categories,
    stores,
  };
}

export function applyFilters(deals, state) {
  const q = state.q.trim().toLowerCase();
  let shown = deals.filter((d) => {
    if (state.cat && d.category !== state.cat) return false;
    if (state.store && d.store !== state.store) return false;
    if (discountPercent(d) < state.minoff) return false;
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const rank = { "new-low": 0, strong: 1, good: 2, routine: 3 };
  const by = {
    verdict: (a, b) => rank[verdict(a).key] - rank[verdict(b).key] || discountPercent(b) - discountPercent(a),
    discount: (a, b) => discountPercent(b) - discountPercent(a),
    saving: (a, b) => saving(b) - saving(a),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  shown = [...shown].sort(by[state.sort] || by.verdict);
  return shown;
}

export function defaultState() {
  return { q: "", cat: "", store: "", minoff: 0, sort: "verdict" };
}
