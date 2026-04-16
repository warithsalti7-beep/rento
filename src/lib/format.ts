const priceFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function formatKr(value: number): string {
  return `${priceFormatter.format(value)} kr`;
}

export function formatKrPerDay(value: number): string {
  return `${formatKr(value)}/dag`;
}

export function formatKrPerMonth(value: number): string {
  return `${formatKr(value)}/mnd`;
}

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}
