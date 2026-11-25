/*
 * Nota de risco (0 a 100), seção 5.8 da especificação.
 * Base de 8 pontos; cada regra disparada soma (ou subtrai) o seu peso e grava o motivo.
 * Regras, pesos e faixas serão editáveis no painel (tabela regra_risco).
 */

export type RegraRisco = {
  codigo: string;
  descricao: string;
  peso: number;
  ativa: boolean;
};

export const BASE_NOTA = 8;

export const FAIXAS = { aprova: 29, revisao: 59 } as const; // 0–29 aprova, 30–59 revisão, 60+ bloqueia

export const REGRAS_PADRAO: RegraRisco[] = [
  { codigo: "lista_bloqueio", descricao: "Dado em lista de bloqueio (CPF, e-mail, telefone, endereço, aparelho, cartão)", peso: 60, ativa: true },
  { codigo: "titular_diferente", descricao: "Titular do cartão diferente do comprador", peso: 25, ativa: true },
  { codigo: "muitos_cartoes", descricao: "Mais de 2 cartões tentados no mesmo pedido ou aparelho", peso: 25, ativa: true },
  { codigo: "pix_cpf_diferente", descricao: "Pix pago por CPF diferente do comprador", peso: 30, ativa: true },
  { codigo: "endereco_compartilhado", descricao: "Endereço de entrega usado por outros CPFs", peso: 20, ativa: true },
  { codigo: "primeira_compra_alta", descricao: "Primeira compra acima de R$ 3.000", peso: 15, ativa: true },
  { codigo: "estado_diferente", descricao: "Acesso de um estado e entrega em outro", peso: 15, ativa: true },
  { codigo: "vpn_proxy", descricao: "Acesso por VPN ou proxy", peso: 15, ativa: true },
  { codigo: "contato_recente", descricao: "E-mail ou telefone criado há menos de 30 dias", peso: 10, ativa: true },
  { codigo: "autenticado_3ds", descricao: "Compra autenticada no banco (3DS)", peso: -30, ativa: true },
  { codigo: "cliente_recorrente", descricao: "Cliente com compras anteriores sem problema", peso: -15, ativa: true },
];

export type Faixa = "aprova" | "revisao" | "bloqueia";

export function calcularNota(disparadas: string[], regras: RegraRisco[] = REGRAS_PADRAO) {
  const motivos = regras.filter((r) => r.ativa && disparadas.includes(r.codigo)).map((r) => ({ codigo: r.codigo, descricao: r.descricao, peso: r.peso }));
  const bruta = motivos.reduce((s, m) => s + m.peso, BASE_NOTA);
  const nota = Math.max(0, Math.min(100, bruta));
  return { nota, faixa: faixaDaNota(nota), motivos };
}

export function faixaDaNota(nota: number): Faixa {
  if (nota <= FAIXAS.aprova) return "aprova";
  if (nota <= FAIXAS.revisao) return "revisao";
  return "bloqueia";
}
