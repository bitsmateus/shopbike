import Link from "next/link";
import type { Metadata } from "next";
import { areas } from "@/ui/painel/navegacao";
import { Icon } from "@/ui/icons";
import { Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Mapa do sistema" };

/** O que cada tela faz e de qual seção da especificação ela vem. */
const sobre: Record<string, [string, string]> = {
  "/admin": ["Vendas, metas, antifraude, pedidos que pedem ação e integração", "5.19"],
  "/admin/pedidos": ["Lista com filtros, nota de risco, próxima ação e detalhe em abas", "5.9"],
  "/admin/expedicao": ["Quadro separar → NF → etiqueta → pronto → enviado, PLP e etiquetas em lote", "5.9 · 5.10"],
  "/admin/trocas": ["Fluxo solicitado → aprovado → recebido → concluído, etiqueta reversa e motivos", "5.11"],
  "/admin/links": ["Vendedor monta o pedido com itens reais e envia o link de 21x", "5.15"],
  "/admin/antifraude": ["Fila de revisão, regras e pesos, lista de bloqueio, chargebacks e relatório", "5.8"],
  "/admin/clientes": ["Clientes PF/PJ, grupos, perfil com pedidos, conversas NX e LGPD", "5.12"],
  "/admin/leads": ["Leads do pop-up e do avise-me, envio ao CRM NX", "5.13"],
  "/admin/avaliacoes": ["Moderação de avaliações e respostas a perguntas", "5.13"],
  "/admin/oficina": ["Agenda da oficina e lembretes de revisão de 30 e 180 dias", "5.18"],
  "/admin/b2b": ["Aprovação de lojistas, lista de preço própria e pedido mínimo", "5.20"],
  "/admin/catalogo": ["Produtos, nota de qualidade do cadastro e editor completo", "5.1"],
  "/admin/precos": ["Promoção em massa, regras de parcelamento, desconto à vista e listas", "5.2"],
  "/admin/categorias": ["Árvore de categorias, marcas, tabelas de tamanho, etiquetas e tags", "5.1"],
  "/admin/busca": ["Sinônimos, produtos fixados por termo, relevância e termos sem resultado", "5.5"],
  "/admin/importacao": ["Planilha XLSX, fotos em ZIP, exportações e feeds", "5.1 · 10"],
  "/admin/seminovas": ["Seminovas com laudo e avaliação de bike usada como parte do pagamento", "5.18"],
  "/admin/cupons": ["Cupons por valor, %, frete grátis, automáticos e de primeira compra", "5.13"],
  "/admin/promocoes": ["Campanhas com período, vitrine, banner e frete grátis", "5.13"],
  "/admin/vitrine": ["Home por blocos, banners, menus e aparência da loja", "5.4"],
  "/admin/conteudo": ["Páginas institucionais, lojas e horários, blog e formulários", "5.21"],
  "/admin/recuperacao": ["Carrinho abandonado e Pix não pago pelo WhatsApp", "5.14"],
  "/admin/afiliados": ["Link com código, comissão e pagamento de afiliados", "5.13"],
  "/admin/relatorios": ["Vendas, curva ABC, comportamento, cadastros, clientes e logs", "5.19"],
  "/admin/vendedores": ["Ranking, metas e comissão por vendedor", "5.16"],
  "/admin/configuracoes": ["Loja, Rede e Pix, frete, SEO e 301, rastreamento e LGPD", "5.23 · 5.24"],
  "/admin/notificacoes": ["Templates WhatsApp NX e e-mail por evento, alertas internos e log", "5.14"],
  "/admin/usuarios": ["Usuários, convites, 2FA e matriz de permissões por perfil", "4 · 5.22"],
  "/admin/auditoria": ["Quem alterou o quê, antes e depois, e log de acessos", "5.22"],
  "/admin/integracoes": ["Bruning, Rede, Pix, Correios, NX e tokens da API", "5.3 · 5.17"],
  "/admin/conta": ["Perfil, senha, 2FA, sessões e alertas pessoais", "5.22"],
};

const loja: [string, string, string][] = [
  ["/", "Home montada por blocos", "5.4"],
  ["/c/mtb", "Categoria com filtros (marca, aro, tamanho, preço, cor)", "5.4"],
  ["/busca?q=bike", "Busca com sinônimos e tolerância a erro", "5.5"],
  ["/p/oggi-big-wheel-7-0-2027", "Produto com variações, frete por CEP, avaliações", "5.4"],
  ["/carrinho", "Carrinho com barra de frete grátis", "5.6"],
  ["/checkout", "Checkout transparente (cartão, Pix, 2 cartões, Pix + cartão)", "5.6 · 5.7"],
  ["/pedido/48214?forma=pix", "Pedido concluído com QR Code do Pix", "5.6"],
  ["/pagar/Xa81Pd", "Link de pagamento do vendedor", "5.15"],
  ["/conta", "Área do cliente: login por WhatsApp, pedidos, trocas", "5.12"],
  ["/oficina", "Página da oficina", "5.21"],
  ["/admin/login", "Login do painel com 2FA", "5.22"],
];

export default function MapaPage() {
  const telas = areas.flatMap((a) => (a.subs ?? [{ href: a.href, rotulo: a.rotulo }]).filter((s) => s.href !== "/admin/mapa"));
  const f2 = telas.filter((t) => "fase" in t && t.fase === 2).length;
  return (
    <>
      <Cabecalho
        titulo="Mapa do sistema"
        kpis={[
          { icon: "menu", rotulo: "Telas do painel", valor: `${telas.length}` },
          { icon: "check", rotulo: "Fase 1", valor: `${telas.length - f2}` },
          { icon: "clock", rotulo: "Fase 2", valor: `${f2}` },
        ]}
      />
      <p className="mb-5 max-w-3xl text-muted">Todas as telas do sistema, agrupadas como aparecem no menu. Telas da Fase 2 entram depois da virada da Climba; aqui elas já aparecem para a loja conhecer o sistema inteiro.</p>
      <div className="gap-4 md:columns-2 2xl:columns-3">
        {areas
          .filter((a) => a.href !== "/admin/mapa")
          .map((a) => (
            <Card key={a.rotulo} titulo={a.rotulo} className="mb-4 break-inside-avoid">
              <ul className="space-y-1">
                {(a.subs ?? [{ href: a.href, rotulo: a.rotulo }]).map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-white">
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-semibold">
                          {s.rotulo}
                          {"fase" in s && s.fase === 2 && <Chip tom="info">Fase 2</Chip>}
                        </span>
                        <span className="block text-sm text-muted">{sobre[s.href]?.[0]}</span>
                      </span>
                      <span className="shrink-0 pt-0.5 text-xs text-faint tabular">{sobre[s.href]?.[1]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        <Card titulo="Loja (site)" className="mb-4 break-inside-avoid">
          <ul className="space-y-1">
            {loja.map(([href, t, sec]) => (
              <li key={href}>
                <Link href={href} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-white">
                  <Icon name="store" className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span className="flex-1 text-sm font-medium">{t}</span>
                  <span className="shrink-0 text-xs text-faint tabular">{sec}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
