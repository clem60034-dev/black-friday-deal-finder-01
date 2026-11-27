// The "is it really a deal" signal. A verdict is read off the discount
// against the usual (ticketed / RRP) price the store or roundup showed:
// the deeper the cut, the stronger the signal. A routine sale is one you
// would see often at that price; a new low is the deepest cut on the board.
// The rule is stated on the site so a shopper can see how it is judged.

export function discountPercent(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saving(deal) {
  return deal.was - deal.price;
}

export function verdict(deal) {
  const pct = discountPercent(deal);
  if (pct >= 70) return { key: "new-low", label: "NEW LOW", note: `${pct}% off the usual price — the deepest cut on this board.` };
  if (pct >= 50) return { key: "strong", label: "STRONG DEAL", note: `${pct}% off the usual price — well below what it usually sells for.` };
  if (pct >= 30) return { key: "good", label: "GOOD PRICE", note: `${pct}% off the usual price — a solid saving, not a record one.` };
  return { key: "routine", label: "ROUTINE", note: `Only ${pct}% off the usual price — a sale you would see often.` };
}

export function aud(n) {
  return `A$${n.toLocaleString("en-AU", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

export function checkedWhen(iso) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  }) + " AEDT";
}
