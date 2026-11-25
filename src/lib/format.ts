const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCompact = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("pt-BR");

/** Centavos → "R$ 1.234,56" */
export function reais(centavos: number) {
  return brl.format(centavos / 100);
}

/** Centavos → "R$ 1.235" */
export function reaisCurto(centavos: number) {
  return brlCompact.format(centavos / 100);
}

export function numero(n: number) {
  return num.format(n);
}

export function pct(n: number, casas = 1) {
  return `${n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}

export function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}
