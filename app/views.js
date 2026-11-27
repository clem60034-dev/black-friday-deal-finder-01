// HTML for each page, built from the deal data. Every value is escaped
// before it goes into the page, and every store link opens in a new tab.

import { aud, checkedWhen, discountPercent, saving, verdict } from "./verdict.js";

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function dealCard(d) {
  const v = verdict(d);
  return `<article class="card">
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="meta">${escape(d.store)} · ${escape(d.category)}</p>
  <p class="price">${aud(d.price)} <s>${aud(d.was)}</s> <span class="off">${discountPercent(d)}% off</span></p>
  <p class="save">You save ${aud(saving(d))}</p>
  <p><span class="badge ${v.key}">${v.label}</span></p>
  <p class="checked">Checked ${checkedWhen(d.checked)}</p>
  <p class="links"><a href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} ↗</a> · <a href="#/deal/${encodeURIComponent(d.id)}">Details</a></p>
</article>`;
}

export function listPage(deals, state, counts) {
  const shown = deals.length;
  const total = counts.total;
  return `<h1>Black Friday deals, checked one by one</h1>
<p class="lede">Every price below was read from a deals source or the store itself on 27 Nov 2026, with the usual price beside it and a verdict on whether it is really a deal. Prices are Australian dollars.</p>
<section class="stats" aria-label="Board totals">
  <div><strong>${total}</strong><span>deals checked</span></div>
  <div><strong>${counts.newLow}</strong><span>new lows</span></div>
  <div><strong>${counts.best}%</strong><span>biggest cut</span></div>
  <div><strong>${aud(counts.saved)}</strong><span>total saving</span></div>
</section>
<section class="controls" aria-label="Search and filter">
  <label>Search <input id="q" type="search" placeholder="Product, store or category…" value="${escape(state.q)}"></label>
  <label>Category
    <select id="cat">
      <option value="">All categories</option>
      ${counts.categories.map((c) => `<option value="${escape(c)}"${state.cat === c ? " selected" : ""}>${escape(c)}</option>`).join("")}
    </select>
  </label>
  <label>Store
    <select id="store">
      <option value="">All stores</option>
      ${counts.stores.map((s) => `<option value="${escape(s)}"${state.store === s ? " selected" : ""}>${escape(s)}</option>`).join("")}
    </select>
  </label>
  <label>Discount
    <select id="minoff">
      <option value="0"${state.minoff === 0 ? " selected" : ""}>Any discount</option>
      <option value="30"${state.minoff === 30 ? " selected" : ""}>30% off or more</option>
      <option value="50"${state.minoff === 50 ? " selected" : ""}>50% off or more</option>
      <option value="70"${state.minoff === 70 ? " selected" : ""}>70% off or more</option>
    </select>
  </label>
  <label>Sort by
    <select id="sort">
      <option value="verdict"${state.sort === "verdict" ? " selected" : ""}>Best deal first</option>
      <option value="discount"${state.sort === "discount" ? " selected" : ""}>Biggest discount</option>
      <option value="saving"${state.sort === "saving" ? " selected" : ""}>Biggest saving</option>
      <option value="price-asc"${state.sort === "price-asc" ? " selected" : ""}>Lowest price</option>
      <option value="price-desc"${state.sort === "price-desc" ? " selected" : ""}>Highest price</option>
    </select>
  </label>
</section>
<p class="count" id="count" role="status">Showing ${shown} of ${total} deals</p>
<section class="grid" id="grid">${deals.map(dealCard).join("")}</section>
<section class="legend" aria-label="How the verdict works">
  <h2>How the verdict works</h2>
  <p>Each deal is judged on its discount against the usual (ticketed or RRP) price the store or roundup showed: <span class="badge new-low">NEW LOW</span> 70% off or more, <span class="badge strong">STRONG DEAL</span> 50–69% off, <span class="badge good">GOOD PRICE</span> 30–49% off, <span class="badge routine">ROUTINE</span> under 30% off. A routine sale is one you would see often at that price — it is still a saving, just not a rare one.</p>
</section>`;
}

export function dealPage(d) {
  const v = verdict(d);
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${escape(d.title)}</h1>
  <p class="meta">${escape(d.store)} · ${escape(d.category)}</p>
  <p class="price big">${aud(d.price)} <s>${aud(d.was)}</s> <span class="off">${discountPercent(d)}% off</span></p>
  <p class="save">You save ${aud(saving(d))} on the usual price.</p>
  <p><span class="badge ${v.key}">${v.label}</span></p>
  <p class="verdict-note">${escape(v.note)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${aud(d.price)}</dd>
    <dt>Usual price</dt><dd>${aud(d.was)}</dd>
    <dt>Checked</dt><dd>${checkedWhen(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p class="cta"><a href="${escape(d.url)}" target="_blank" rel="noopener">Buy it at ${escape(d.store)} ↗</a></p>
  <p class="fine">Prices were correct when checked; the store may change them or sell out. The usual price is the ticketed or RRP price the source showed.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}

export function emptyGrid() {
  return `<p class="empty">No deal matches those filters. <a href="#/" id="clear">Clear the filters</a>.</p>`;
}
