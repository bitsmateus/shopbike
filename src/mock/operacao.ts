/*
 * Dados fictícios do painel (Etapa 0): pedidos, antifraude, links, integração e dashboard.
 * Nomes e documentos são inventados.
 */
import { calcularNota } from "@/modules/antifraude/nota";

export type StatusPedido =
  | "Aguardando pagamento"
  | "Em análise"
  | "Pago"
  | "Em separação"
  | "Faturado"
  | "Autorizado"
  | "Enviado"
  | "Entregue"
  | "Cancelado"
  | "Bloqueado";

export type Canal = "Site" | "Link" | "IA";

export type Pedido = {
  numero: string;
  data: string; // ISO
  cliente: { nome: string; cpf: string; email: string; tel: string; cidade: string; uf: string; pedidosAnteriores: number };
  canal: Canal;
  vendedor?: string;
  pagamento: { forma: "Cartão" | "Pix" | "2 cartões" | "Pix + cartão"; parcelas: number; bandeira?: string; final?: string; tid?: string; nsu?: string; autorizacao?: string; tresDS: boolean };
  itens: { nome: string; sku: string; qtd: number; preco: number }[];
  frete: { servico: string; valor: number; prazo: string; rastreio?: string };
  total: number;
  status: StatusPedido;
  risco: ReturnType<typeof calcularNota>;
  proximaAcao: string;
  nf?: string;
  vinculos: { tipo: string; valor: string; alerta?: string }[];
  historico: { status: string; quando: string; quem: string }[];
};

const hoje = new Date("2026-11-25T14:00:00-03:00");
const dias = (d: number, h = 10) => new Date(hoje.getTime() - d * 86400000 - (14 - h) * 3600000).toISOString();

function pedido(p: Omit<Pedido, "risco" | "historico" | "vinculos"> & { regras: string[]; historico?: Pedido["historico"]; vinculos?: Pedido["vinculos"] }): Pedido {
  const { regras, ...rest } = p;
  return {
    ...rest,
    risco: calcularNota(regras),
    vinculos: p.vinculos ?? [
      { tipo: "CPF", valor: p.cliente.cpf },
      { tipo: "E-mail", valor: p.cliente.email },
      { tipo: "Telefone", valor: p.cliente.tel },
    ],
    historico: p.historico ?? [{ status: "Pedido criado", quando: p.data, quem: "Sistema" }],
  };
}

export const pedidos: Pedido[] = [
  pedido({
    numero: "48213",
    data: dias(0, 13),
    cliente: { nome: "Rafael Medeiros", cpf: "***.482.119-**", email: "rafa.med@gmail.com", tel: "(48) 9 9812-4410", cidade: "Tubarão", uf: "SC", pedidosAnteriores: 3 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 21, bandeira: "Visa", final: "4421", tid: "1032611251334", nsu: "882104", autorizacao: "A91K2", tresDS: true },
    itens: [{ nome: "Oggi Big Wheel 7.0 · 17 · Preto", sku: "OGBW7-17-PRE", qtd: 1, preco: 449_900 }],
    frete: { servico: "Retirada na loja", valor: 0, prazo: "Hoje" },
    total: 449_900,
    status: "Pago",
    regras: ["autenticado_3ds", "cliente_recorrente"],
    proximaAcao: "Separar pedido",
  }),
  pedido({
    numero: "48212",
    data: dias(0, 11),
    cliente: { nome: "Lucas Ferreira Antunes", cpf: "***.903.441-**", email: "lucas.antunes.br@outlook.com", tel: "(11) 9 4410-2287", cidade: "Guarulhos", uf: "SP", pedidosAnteriores: 0 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 10, bandeira: "Mastercard", final: "0093", tid: "1032611251122", tresDS: false },
    itens: [{ nome: "Specialized Turbo Vado SL 4.0 · L · Preto", sku: "SPTV-L-PRE", qtd: 1, preco: 2_499_900 }],
    frete: { servico: "Jamef Econômico", valor: 38_900, prazo: "8 dias úteis" },
    total: 2_538_800,
    status: "Em análise",
    regras: ["titular_diferente", "primeira_compra_alta", "contato_recente"],
    proximaAcao: "Revisar no antifraude",
    vinculos: [
      { tipo: "CPF", valor: "***.903.441-**" },
      { tipo: "E-mail", valor: "lucas.antunes.br@outlook.com", alerta: "Criado há 6 dias" },
      { tipo: "Telefone", valor: "(11) 9 4410-2287" },
      { tipo: "Cartão", valor: "5502 09•• •••• 0093", alerta: "Titular: M. SOUZA" },
      { tipo: "Aparelho", valor: "fp_7c1e…a90" },
    ],
  }),
  pedido({
    numero: "48211",
    data: dias(0, 10),
    cliente: { nome: "Jéssica Pacheco", cpf: "***.118.702-**", email: "jessica.pacheco@hotmail.com", tel: "(48) 9 9134-0091", cidade: "Laguna", uf: "SC", pedidosAnteriores: 1 },
    canal: "Link",
    vendedor: "Diego",
    pagamento: { forma: "Pix", parcelas: 1, tresDS: false },
    itens: [
      { nome: "Caloi Explorer Comp 29 · 17 · Grafite", sku: "CLEX-17-GRA", qtd: 1, preco: 299_900 },
      { nome: "Capacete Specialized Align II · M · Preto", sku: "SPAG-M-PRE", qtd: 1, preco: 39_900 },
    ],
    frete: { servico: "Entrega ShopBike", valor: 0, prazo: "2 dias" },
    total: 305_820,
    status: "Aguardando pagamento",
    regras: [],
    proximaAcao: "Aguarde confirmação do pagamento",
  }),
  pedido({
    numero: "48210",
    data: dias(0, 9),
    cliente: { nome: "Paulo H. Castro", cpf: "***.664.230-**", email: "phc.compras@proton.me", tel: "(21) 9 7720-1180", cidade: "Duque de Caxias", uf: "RJ", pedidosAnteriores: 0 },
    canal: "Site",
    pagamento: { forma: "2 cartões", parcelas: 12, bandeira: "Visa / Elo", final: "1180 / 7741", tresDS: false },
    itens: [{ nome: "Specialized Allez E5 · 56 · Vermelho", sku: "SPAL-56-VER", qtd: 2, preco: 689_900 }],
    frete: { servico: "Sedex", valor: 21_400, prazo: "4 dias úteis" },
    total: 1_401_200,
    status: "Bloqueado",
    regras: ["lista_bloqueio", "muitos_cartoes", "vpn_proxy", "primeira_compra_alta"],
    proximaAcao: "Pedido bloqueado pelo antifraude",
    vinculos: [
      { tipo: "CPF", valor: "***.664.230-**" },
      { tipo: "Endereço", valor: "R. Sete, 120 — Duque de Caxias/RJ", alerta: "Em lista de bloqueio (chargeback 09/2026)" },
      { tipo: "Aparelho", valor: "fp_02bd…11f", alerta: "4 cartões tentados em 20 min" },
      { tipo: "IP", valor: "185.220.•••", alerta: "VPN / Tor" },
    ],
  }),
  pedido({
    numero: "48209",
    data: dias(1, 17),
    cliente: { nome: "Ana Clara Bez", cpf: "***.390.551-**", email: "anaclarabez@gmail.com", tel: "(48) 9 9988-1020", cidade: "Criciúma", uf: "SC", pedidosAnteriores: 0 },
    canal: "IA",
    pagamento: { forma: "Pix", parcelas: 1, tresDS: false },
    itens: [{ nome: "Caloi Cecci Aro 16 · Vermelho", sku: "CLCC-Único-VER", qtd: 1, preco: 89_900 }],
    frete: { servico: "PAC", valor: 3_890, prazo: "5 dias úteis" },
    total: 84_800,
    status: "Faturado",
    nf: "NF 21.884",
    regras: [],
    proximaAcao: "Imprimir etiqueta",
  }),
  pedido({
    numero: "48208",
    data: dias(1, 15),
    cliente: { nome: "Marcos Vieira", cpf: "***.002.981-**", email: "marcosvieira.mtb@gmail.com", tel: "(48) 9 9601-3344", cidade: "Florianópolis", uf: "SC", pedidosAnteriores: 5 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 1, bandeira: "Elo", final: "3320", tid: "1032611241551", nsu: "771022", autorizacao: "77QX1", tresDS: true },
    itens: [
      { nome: "Cassete Shimano Deore M6100 12v", sku: "SHM6100-10-51-GRA", qtd: 1, preco: 64_900 },
      { nome: "Corrente Sram GX Eagle 12v", sku: "SRGX-126-PRE", qtd: 1, preco: 32_900 },
    ],
    frete: { servico: "Sedex", valor: 2_590, prazo: "2 dias úteis", rastreio: "QB120044871BR" },
    total: 90_610,
    status: "Enviado",
    nf: "NF 21.880",
    regras: ["autenticado_3ds", "cliente_recorrente"],
    proximaAcao: "Acompanhar entrega",
  }),
  pedido({
    numero: "48207",
    data: dias(1, 11),
    cliente: { nome: "Gabriela Nunes", cpf: "***.771.664-**", email: "gabi.nunes@yahoo.com.br", tel: "(48) 9 8810-7712", cidade: "Imbituba", uf: "SC", pedidosAnteriores: 0 },
    canal: "Link",
    vendedor: "Carla",
    pagamento: { forma: "Pix + cartão", parcelas: 6, bandeira: "Visa", final: "8812", tresDS: true },
    itens: [{ nome: "Oggi Hacker Sport 29 · 15 · Vermelho", sku: "OGHS-15-VER", qtd: 1, preco: 219_900 }],
    frete: { servico: "Retirada na loja", valor: 0, prazo: "Hoje" },
    total: 219_900,
    status: "Em separação",
    regras: ["autenticado_3ds"],
    proximaAcao: "Aguardando NF da Bruning",
  }),
  pedido({
    numero: "48206",
    data: dias(2, 16),
    cliente: { nome: "Tiago Rocha", cpf: "***.230.118-**", email: "tiago.rocha@empresa.com.br", tel: "(48) 9 9142-8811", cidade: "Tubarão", uf: "SC", pedidosAnteriores: 2 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 18, bandeira: "Mastercard", final: "5510", tresDS: true },
    itens: [{ nome: "Specialized Rockhopper Sport 29 · L · Verde", sku: "SPRH-L-VER", qtd: 1, preco: 649_900 }],
    frete: { servico: "Entrega ShopBike", valor: 0, prazo: "1 dia" },
    total: 649_900,
    status: "Entregue",
    nf: "NF 21.861",
    regras: ["autenticado_3ds", "cliente_recorrente", "primeira_compra_alta"],
    proximaAcao: "—",
  }),
  pedido({
    numero: "48205",
    data: dias(2, 12),
    cliente: { nome: "Bruna Silveira", cpf: "***.551.002-**", email: "bru.silveira@gmail.com", tel: "(51) 9 9311-0021", cidade: "Porto Alegre", uf: "RS", pedidosAnteriores: 0 },
    canal: "Site",
    pagamento: { forma: "Pix", parcelas: 1, tresDS: false },
    itens: [{ nome: "Caloi E-Vibe Easy Rider · Grafite", sku: "CLEV-Único-GRA", qtd: 1, preco: 699_900 }],
    frete: { servico: "Translovato", valor: 18_900, prazo: "6 dias úteis" },
    total: 648_810,
    status: "Em análise",
    regras: ["pix_cpf_diferente", "primeira_compra_alta"],
    proximaAcao: "Revisar no antifraude",
    vinculos: [
      { tipo: "CPF comprador", valor: "***.551.002-**" },
      { tipo: "CPF pagador (Pix)", valor: "***.019.774-**", alerta: "Diferente do comprador" },
      { tipo: "E-mail", valor: "bru.silveira@gmail.com" },
    ],
  }),
  pedido({
    numero: "48204",
    data: dias(3, 10),
    cliente: { nome: "Henrique Lopes", cpf: "***.440.903-**", email: "henrique.lopes@gmail.com", tel: "(48) 9 9900-4412", cidade: "Braço do Norte", uf: "SC", pedidosAnteriores: 1 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 3, bandeira: "Visa", final: "0041", tresDS: false },
    itens: [{ nome: "Pneu Pirelli Scorpion XC RC 29x2.2", sku: "PRXC-29-PRE", qtd: 2, preco: 39_900 }],
    frete: { servico: "PAC", valor: 3_290, prazo: "4 dias úteis" },
    total: 83_090,
    status: "Cancelado",
    regras: [],
    proximaAcao: "Última tentativa de pagamento negada",
  }),
  pedido({
    numero: "48197",
    data: dias(3, 16),
    cliente: { nome: "Renata Duarte", cpf: "***.208.337-**", email: "renata.duarte88@gmail.com", tel: "(47) 9 9620-1185", cidade: "Joinville", uf: "SC", pedidosAnteriores: 0 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 12, bandeira: "Visa", final: "6621", tresDS: false },
    itens: [{ nome: "Specialized Rockhopper Sport 29 · M · Preto", sku: "SPRH-M-PRE", qtd: 1, preco: 649_900 }],
    frete: { servico: "Jamef Econômico", valor: 4_900, prazo: "5 dias úteis" },
    total: 654_800,
    status: "Em análise",
    regras: ["endereco_compartilhado", "contato_recente"],
    proximaAcao: "Revisar no antifraude",
    vinculos: [
      { tipo: "CPF", valor: "***.208.337-**" },
      { tipo: "Endereço", valor: "R. das Palmeiras, 410 — Joinville/SC", alerta: "Usado por outros 3 CPFs" },
      { tipo: "E-mail", valor: "renata.duarte88@gmail.com", alerta: "Criado há 12 dias" },
    ],
  }),
  pedido({
    numero: "48194",
    data: dias(4, 14),
    cliente: { nome: "Fábio Martins", cpf: "***.771.902-**", email: "fabio.m.compras@outlook.com", tel: "(41) 9 8830-2219", cidade: "Curitiba", uf: "PR", pedidosAnteriores: 0 },
    canal: "Site",
    pagamento: { forma: "Cartão", parcelas: 18, bandeira: "Mastercard", final: "2208", tresDS: false },
    itens: [{ nome: "Oggi Big Wheel 7.0 · 19 · Preto", sku: "OGBW7-19-PRE", qtd: 1, preco: 449_900 }],
    frete: { servico: "Sedex", valor: 12_490, prazo: "4 dias úteis" },
    total: 462_390,
    status: "Em análise",
    regras: ["estado_diferente", "primeira_compra_alta", "contato_recente"],
    proximaAcao: "Revisar no antifraude",
  }),
  pedido({
    numero: "48192",
    data: dias(4, 9),
    cliente: { nome: "Diego Albuquerque", cpf: "***.064.513-**", email: "d.albuquerque@yahoo.com", tel: "(48) 9 9177-0034", cidade: "Palhoça", uf: "SC", pedidosAnteriores: 0 },
    canal: "Link",
    vendedor: "Carla",
    pagamento: { forma: "2 cartões", parcelas: 10, bandeira: "Visa / Visa", final: "1902 / 7713", tresDS: false },
    itens: [{ nome: "Caloi E-Vibe Easy Rider · Branco", sku: "CLEV-Único-BRA", qtd: 1, preco: 699_900 }],
    frete: { servico: "Entrega ShopBike", valor: 0, prazo: "2 dias" },
    total: 699_900,
    status: "Em análise",
    regras: ["titular_diferente", "vpn_proxy"],
    proximaAcao: "Revisar no antifraude",
  }),
];

export const filaRevisao = pedidos.filter((p) => p.status === "Em análise");

export const listaBloqueio = [
  { tipo: "Endereço", valor: "R. Sete, 120 — Duque de Caxias/RJ", origem: "Chargeback pedido 47102", quem: "Sistema", quando: "12/09/2026" },
  { tipo: "CPF", valor: "***.301.884-**", origem: "Fraude confirmada", quem: "Mateus", quando: "30/10/2026" },
  { tipo: "Cartão", valor: "4984 12•• •••• 7710", origem: "Teste de cartão (18 tentativas)", quem: "Sistema", quando: "02/11/2026" },
  { tipo: "Aparelho", valor: "fp_02bd…11f", origem: "Vínculo com pedido 47102", quem: "Sistema", quando: "02/11/2026" },
  { tipo: "Telefone", valor: "(21) 9 6611-••••", origem: "Golpe relatado pela loja", quem: "Gerência", quando: "05/11/2026" },
  { tipo: "E-mail", valor: "compras.rapida2026@•••", origem: "Fraude confirmada", quem: "Mateus", quando: "08/11/2026" },
];

export const resumoAntifraude = {
  analisados30d: 412,
  aprovadosAuto: 371,
  emRevisao: filaRevisao.length,
  bloqueados: 19,
  tempoMedioRevisao: "14 min",
  fraudesEvitadas: 6,
  valorEvitado: 4_218_000,
  chargebacks: 0,
};

export type LinkPagamento = {
  token: string;
  cliente: string;
  vendedor: string;
  itens: string;
  total: number;
  parcelas: number;
  status: "ativo" | "em_uso" | "pago" | "expirado" | "cancelado";
  validade: string;
  criado: string;
};

export const links: LinkPagamento[] = [
  { token: "k7Qp2x", cliente: "Jéssica Pacheco", vendedor: "Diego", itens: "Explorer Comp 29 + Capacete Align II", total: 339_800, parcelas: 21, status: "em_uso", validade: "26/11 18:00", criado: "25/11 10:12" },
  { token: "9fLm3a", cliente: "Gabriela Nunes", vendedor: "Carla", itens: "Hacker Sport 29", total: 219_900, parcelas: 6, status: "pago", validade: "25/11 18:00", criado: "24/11 11:02" },
  { token: "Xa81Pd", cliente: "Rodrigo Mendes", vendedor: "Diego", itens: "Big Wheel 7.0 + revisão", total: 469_900, parcelas: 21, status: "ativo", validade: "27/11 18:00", criado: "25/11 09:40" },
  { token: "c2Rt0z", cliente: "Fernanda Lima", vendedor: "Carla", itens: "Rockhopper Sport 29", total: 649_900, parcelas: 18, status: "expirado", validade: "22/11 18:00", criado: "20/11 15:21" },
  { token: "Mm4Lq8", cliente: "João P. Martins", vendedor: "Diego", itens: "Allez E5", total: 689_900, parcelas: 12, status: "cancelado", validade: "21/11 18:00", criado: "20/11 08:55" },
];

export const integracaoLog = [
  { quando: "25/11 13:58", endpoint: "PUT /api/v1/estoque", origem: "Bruning", resultado: "ok", detalhe: "142 SKUs atualizados" },
  { quando: "25/11 13:45", endpoint: "GET /api/v1/pedidos?status=pago", origem: "Bruning", resultado: "ok", detalhe: "3 pedidos entregues" },
  { quando: "25/11 13:45", endpoint: "PUT /api/v1/pedidos/48209/nota", origem: "Bruning", resultado: "ok", detalhe: "NF 21.884 vinculada" },
  { quando: "25/11 13:30", endpoint: "PUT /api/v1/precos", origem: "Bruning", resultado: "ok", detalhe: "18 preços alterados" },
  { quando: "25/11 13:15", endpoint: "PUT /api/v1/produtos", origem: "Bruning", resultado: "erro", detalhe: "SKU OGVL-58-PRE sem produto pai — aguardando cadastro" },
  { quando: "25/11 13:00", endpoint: "PUT /api/v1/estoque", origem: "Bruning", resultado: "ok", detalhe: "97 SKUs atualizados" },
  { quando: "25/11 12:44", endpoint: "POST /webhooks/pix", origem: "Pix", resultado: "ok", detalhe: "Pedido 48203 pago" },
  { quando: "25/11 12:30", endpoint: "POST /oauth2/token", origem: "Rede", resultado: "ok", detalhe: "Token renovado" },
];

export const dashboard = {
  periodo: "1 a 25 de novembro",
  kpis: [
    { rotulo: "Vendas", valor: 29_481_200, tipo: "dinheiro" as const, variacao: 12.4, meta: 36_000_000 },
    { rotulo: "Pedidos pagos", valor: 71, tipo: "numero" as const, variacao: 8.1 },
    { rotulo: "Ticket médio", valor: 415_200, tipo: "dinheiro" as const, variacao: 3.9 },
    { rotulo: "Conversão", valor: 0.27, tipo: "pct" as const, variacao: -0.03 },
    { rotulo: "Visitas", valor: 26_420, tipo: "numero" as const, variacao: 6.2 },
    { rotulo: "Carrinhos abandonados", valor: 312, tipo: "numero" as const, variacao: -14.5 },
  ],
  projecaoMes: 35_377_400,
  // vendas por dia (centavos) por canal
  serie: Array.from({ length: 25 }, (_, i) => {
    const base = 700_000 + Math.round(Math.sin(i / 2.3) * 260_000 + (i % 7 === 5 ? 520_000 : 0) + i * 9_000);
    return { dia: i + 1, site: base, link: Math.round(base * (0.28 + (i % 4) * 0.04)), ia: Math.round(base * (0.08 + (i % 3) * 0.03)) };
  }),
  canais: [
    { canal: "Site", valor: 19_802_100, pedidos: 46 },
    { canal: "Link do vendedor", valor: 7_410_900, pedidos: 18 },
    { canal: "IA no WhatsApp", valor: 2_268_200, pedidos: 7 },
  ],
  dispositivos: [
    { nome: "Celular", pct: 74 },
    { nome: "Computador", pct: 23 },
    { nome: "Tablet", pct: 3 },
  ],
};

export const equipe = [
  { nome: "Diego", vendas: 4_890_000, pedidos: 11 },
  { nome: "Carla", vendas: 2_520_900, pedidos: 7 },
  { nome: "IA (WhatsApp)", vendas: 2_268_200, pedidos: 7 },
];
