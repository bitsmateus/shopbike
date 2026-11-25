import { filaRevisao } from "@/mock/operacao";

export type Sub = { href: string; rotulo: string; fase?: 2 };
export type Area = { rotulo: string; href: string; subs?: Sub[]; badge?: number; noMenu?: boolean };

/** Mapa de navegação do painel. Cada área tem submenu próprio. fase 2 = evolução (depois da virada). */
export const areas: Area[] = [
  { rotulo: "Visão geral", href: "/admin" },
  {
    rotulo: "Pedidos",
    href: "/admin/pedidos",
    subs: [
      { href: "/admin/pedidos", rotulo: "Pedidos" },
      { href: "/admin/expedicao", rotulo: "Expedição" },
      { href: "/admin/trocas", rotulo: "Trocas e devoluções" },
      { href: "/admin/links", rotulo: "Links de pagamento" },
    ],
  },
  { rotulo: "Antifraude", href: "/admin/antifraude", badge: filaRevisao.length },
  {
    rotulo: "Clientes",
    href: "/admin/clientes",
    subs: [
      { href: "/admin/clientes", rotulo: "Clientes" },
      { href: "/admin/leads", rotulo: "Leads" },
      { href: "/admin/avaliacoes", rotulo: "Avaliações e perguntas" },
      { href: "/admin/oficina", rotulo: "Oficina e pós-venda", fase: 2 },
      { href: "/admin/b2b", rotulo: "Lojistas B2B", fase: 2 },
    ],
  },
  {
    rotulo: "Catálogo",
    href: "/admin/catalogo",
    subs: [
      { href: "/admin/catalogo", rotulo: "Produtos" },
      { href: "/admin/precos", rotulo: "Preços e parcelamento" },
      { href: "/admin/categorias", rotulo: "Categorias e marcas" },
      { href: "/admin/busca", rotulo: "Busca da loja" },
      { href: "/admin/importacao", rotulo: "Importação e exportação" },
      { href: "/admin/seminovas", rotulo: "Seminovas e bike na troca", fase: 2 },
    ],
  },
  {
    rotulo: "Marketing",
    href: "/admin/cupons",
    subs: [
      { href: "/admin/cupons", rotulo: "Cupons" },
      { href: "/admin/promocoes", rotulo: "Promoções" },
      { href: "/admin/vitrine", rotulo: "Vitrine da loja" },
      { href: "/admin/conteudo", rotulo: "Conteúdo" },
      { href: "/admin/recuperacao", rotulo: "Recuperação de vendas" },
      { href: "/admin/afiliados", rotulo: "Afiliados", fase: 2 },
    ],
  },
  {
    rotulo: "Relatórios",
    href: "/admin/relatorios",
    subs: [
      { href: "/admin/relatorios", rotulo: "Relatórios" },
      { href: "/admin/vendedores", rotulo: "Vendedores e metas", fase: 2 },
    ],
  },
  {
    rotulo: "Configurações",
    href: "/admin/configuracoes",
    noMenu: true,
    subs: [
      { href: "/admin/configuracoes", rotulo: "Loja, pagamento e frete" },
      { href: "/admin/notificacoes", rotulo: "Notificações" },
      { href: "/admin/usuarios", rotulo: "Usuários e perfis" },
      { href: "/admin/auditoria", rotulo: "Auditoria" },
      { href: "/admin/integracoes", rotulo: "Integrações e API" },
      { href: "/admin/conta", rotulo: "Minha conta" },
    ],
  },
  { rotulo: "Mapa do sistema", href: "/admin/mapa", noMenu: true },
];

