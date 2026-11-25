/*
 * Parcelamento e desconto à vista. Valores sempre em centavos.
 * Mesma regra do sbplace (lib/installments.js): o número de parcelas é o menor
 * entre o limite global, o limite da regra (categoria/marca/produto) e o que
 * respeita a parcela mínima. À vista (1x) sempre pode.
 *
 * TODO(confirmar): regras personalizadas por categoria/marca/produto (2 categorias,
 * 9 marcas e 3.338 produtos na Climba) e acima de 12x no PV da ShopBike.
 */

export const LIMITE_GLOBAL_PARCELAS = 21;
export const PARCELA_MINIMA_CENTAVOS = 5_000; // R$ 50,00 — protótipo
export const DESCONTO_A_VISTA = 0.1; // 10% no Pix ou cartão 1x

export function parcelasPermitidas(totalCentavos: number, limiteRegra = LIMITE_GLOBAL_PARCELAS): number {
  let max = Math.min(LIMITE_GLOBAL_PARCELAS, Math.max(1, Math.round(limiteRegra)));
  if (PARCELA_MINIMA_CENTAVOS > 0 && totalCentavos > 0) {
    max = Math.min(max, Math.floor(totalCentavos / PARCELA_MINIMA_CENTAVOS));
  }
  return Math.max(1, max);
}

/** Valor de cada parcela, sem juros, arredondando para cima o centavo. */
export function valorParcela(totalCentavos: number, parcelas: number): number {
  return Math.ceil(totalCentavos / Math.max(1, parcelas));
}

export function precoAVista(totalCentavos: number): number {
  return Math.round(totalCentavos * (1 - DESCONTO_A_VISTA));
}

export function tabelaParcelas(totalCentavos: number, limiteRegra?: number) {
  const n = parcelasPermitidas(totalCentavos, limiteRegra);
  return Array.from({ length: n }, (_, i) => ({ parcelas: i + 1, valor: valorParcela(totalCentavos, i + 1) }));
}
