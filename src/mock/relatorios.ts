/*
 * Catálogo de relatórios (seção 5.19) e gerador de dados fictícios para o protótipo.
 * F1 = necessários para desligar a Climba; F2 = evolução.
 */
import { produtos } from "./catalogo";

export type Relatorio = { slug: string; titulo: string; grupo: string; fase: 1 | 2; dimensao: string; itens: string[]; abc?: boolean };

const produtosNomes = produtos.map((p) => p.nome);
const estados = ["SC", "RS", "PR", "SP", "RJ", "MG"];
const cidades = ["Tubarão", "Criciúma", "Florianópolis", "Laguna", "Imbituba", "Braço do Norte", "Gravatal", "Capivari de Baixo"];
const clientesNomes = ["Bike Point Criciúma", "Pedal Sul Assessoria", "Marcos Vieira", "Tiago Rocha", "Rafael Medeiros", "Camila Souza", "Jéssica Pacheco", "Gabriela Nunes"];

export const relatorios: Relatorio[] = [
  { slug: "vendas-por-periodo", titulo: "Vendas por período", grupo: "Vendas", fase: 1, dimensao: "Semana", itens: ["27/10 a 02/11", "03/11 a 09/11", "10/11 a 16/11", "17/11 a 23/11", "24/11 a 25/11"] },
  { slug: "vendas-por-cliente", titulo: "Vendas por cliente", grupo: "Vendas", fase: 1, dimensao: "Cliente", itens: clientesNomes },
  { slug: "vendas-por-estado", titulo: "Vendas por estado", grupo: "Vendas", fase: 1, dimensao: "Estado", itens: estados },
  { slug: "vendas-por-cidade", titulo: "Vendas por cidade", grupo: "Vendas", fase: 1, dimensao: "Cidade", itens: cidades },
  { slug: "faturamento-por-origem", titulo: "Faturamento por origem do pedido", grupo: "Vendas", fase: 1, dimensao: "Origem", itens: ["Site", "Link do vendedor", "IA no WhatsApp", "Google orgânico", "Meta Ads", "Google Ads"] },
  { slug: "taxa-de-conversao", titulo: "Taxa de conversão", grupo: "Vendas", fase: 1, dimensao: "Dispositivo", itens: ["Celular", "Computador", "Tablet"] },
  { slug: "desempenho-de-produtos", titulo: "Desempenho de produtos", grupo: "Vendas", fase: 1, dimensao: "Produto", itens: produtosNomes },
  { slug: "relatorio-de-pedidos", titulo: "Relatório de pedidos", grupo: "Vendas", fase: 1, dimensao: "Status", itens: ["Entregue", "Enviado", "Faturado", "Em separação", "Pago", "Cancelado", "Bloqueado"] },
  { slug: "curva-abc-quantidade", titulo: "Curva ABC por quantidade", grupo: "Curva ABC", fase: 1, dimensao: "Produto", itens: produtosNomes, abc: true },
  { slug: "curva-abc-valor", titulo: "Curva ABC por valor", grupo: "Curva ABC", fase: 1, dimensao: "Produto", itens: produtosNomes, abc: true },
  { slug: "top-produtos", titulo: "Top produtos", grupo: "Curva ABC", fase: 1, dimensao: "Produto", itens: produtosNomes.slice(0, 10) },
  { slug: "categorias-mais-vendidas", titulo: "Categorias mais vendidas", grupo: "Curva ABC", fase: 1, dimensao: "Categoria", itens: ["Mountain bike", "Peças", "Acessórios", "Speed", "Elétricas", "Vestuário", "Infantil", "Seminovas"] },
  { slug: "marcas-mais-vendidas", titulo: "Marcas mais vendidas", grupo: "Curva ABC", fase: 1, dimensao: "Marca", itens: ["Oggi", "Specialized", "Caloi", "Shimano", "Sram", "Pirelli", "Absolute"] },
  { slug: "analise-de-canal", titulo: "Análise de canal", grupo: "Comportamento", fase: 1, dimensao: "Canal", itens: ["Site", "Link do vendedor", "IA no WhatsApp"] },
  { slug: "formas-de-pagamento", titulo: "Formas de pagamento", grupo: "Comportamento", fase: 1, dimensao: "Forma", itens: ["Cartão 13x a 21x", "Cartão 2x a 12x", "Pix", "Cartão 1x", "2 cartões", "Pix + cartão"] },
  { slug: "tipo-de-frete", titulo: "Tipo de frete", grupo: "Comportamento", fase: 1, dimensao: "Frete", itens: ["Retirada na loja", "PAC", "Sedex", "Entrega ShopBike", "Jamef Econômico", "Rodonaves"] },
  { slug: "cupons", titulo: "Cupons", grupo: "Comportamento", fase: 1, dimensao: "Cupom", itens: ["FRETESUL", "BLACKSB", "PRIMEIRA", "DIEGO10", "PEDAL5", "OGGI300"] },
  { slug: "tentativa-sem-estoque", titulo: "Tentativa de compra sem estoque", grupo: "Comportamento", fase: 1, dimensao: "Produto", itens: produtosNomes.slice(4, 10) },
  { slug: "relatorio-de-frete", titulo: "Relatório de frete", grupo: "Comportamento", fase: 2, dimensao: "Região", itens: ["Sul", "Sudeste", "Centro-Oeste", "Nordeste"] },
  { slug: "interesse-em-produtos", titulo: "Interesse em produtos", grupo: "Comportamento", fase: 2, dimensao: "Produto", itens: produtosNomes.slice(0, 8) },
  { slug: "trocas-por-produto", titulo: "Trocas por produto", grupo: "Comportamento", fase: 2, dimensao: "Produto", itens: ["Camisa ShopBike Team", "Capacete Align II", "Bermuda Absolute Pro"] },
  { slug: "listas-de-favoritos", titulo: "Listas de favoritos", grupo: "Comportamento", fase: 2, dimensao: "Produto", itens: produtosNomes.slice(2, 9) },
  { slug: "estatisticas-de-cadastro", titulo: "Estatísticas de cadastro", grupo: "Cadastros", fase: 2, dimensao: "Categoria", itens: ["Bicicletas", "Peças", "Acessórios", "Vestuário"] },
  { slug: "estoque-agrupado", titulo: "Estoque agrupado", grupo: "Cadastros", fase: 2, dimensao: "Marca", itens: ["Shimano", "Sram", "Oggi", "Specialized", "Caloi"] },
  { slug: "relatorio-de-clientes", titulo: "Relatório de clientes", grupo: "Clientes", fase: 2, dimensao: "Grupo", itens: ["Varejo", "Ciclista frequente", "Equipe de pedal", "Lojista (B2B)"] },
  { slug: "aniversariantes", titulo: "Aniversariantes", grupo: "Clientes", fase: 2, dimensao: "Mês", itens: ["Novembro", "Dezembro", "Janeiro"] },
  { slug: "cadastros-incompletos", titulo: "Cadastros com dados incompletos", grupo: "Clientes", fase: 2, dimensao: "Falta", itens: ["Sem telefone", "Sem data de nascimento", "Sem endereço"] },
];

/** Números fictícios estáveis por item (mesmo resultado a cada render). */
export function linhasDe(r: Relatorio) {
  const h = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const linhas = r.itens.map((rotulo, i) => {
    const base = h(r.slug + rotulo);
    const pedidos = Math.max(1, Math.round((base % 40) + 60 / (i + 1)));
    const ticket = 20_000 + (base % 400_000);
    return { rotulo, pedidos, vendas: pedidos * ticket, visitas: pedidos * (30 + (base % 50)) };
  });
  linhas.sort((a, b) => b.vendas - a.vendas);
  const total = linhas.reduce((s, l) => s + l.vendas, 0);
  let acumulado = 0;
  return linhas.map((l) => {
    acumulado += l.vendas;
    const pct = acumulado / total;
    return { ...l, part: l.vendas / total, classe: pct <= 0.8 ? "A" : pct <= 0.95 ? "B" : "C" };
  });
}
