import Link from "next/link";
import { produtos, corHex } from "@/mock/catalogo";
import { dashboard, equipe, filaRevisao, integracaoLog, pedidos, resumoAntifraude } from "@/mock/operacao";
import { reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Anel, BarrasHorizontais } from "@/ui/painel/graficos";
import { CardVendas } from "@/ui/painel/card-vendas";
import { Cabecalho, Card, NotaRisco, StatusChip } from "@/ui/painel/ui";

/** Para onde cada indicador leva ao ser clicado. */
const destinoKpi: Record<string, string> = {
  Vendas: "/admin/relatorios/vendas-por-periodo",
  "Pedidos pagos": "/admin/pedidos",
  "Ticket médio": "/admin/relatorios/relatorio-de-pedidos",
  Conversão: "/admin/relatorios/taxa-de-conversao",
  Visitas: "/admin/relatorios/analise-de-canal",
  "Carrinhos abandonados": "/admin/recuperacao",
};

export default function VisaoGeral() {
  const acao = pedidos.filter((p) => !["Entregue", "Cancelado", "Enviado"].includes(p.status));
  const top = [...produtos].sort((a, b) => b.vendidos30d - a.vendidos30d).slice(0, 5);
  const ultimaSync = integracaoLog[0];

  return (
    <>
      <Cabecalho
        titulo="Visão geral"
        kpis={[
          { icon: "chart", rotulo: "Vendas no mês", valor: reaisCurto(dashboard.kpis[0].valor), href: "/admin/relatorios/vendas-por-periodo" },
          { icon: "arrowUp", rotulo: "Projeção de novembro", valor: reaisCurto(dashboard.projecaoMes), href: "/admin/relatorios/vendas-por-periodo" },
          { icon: "shield", rotulo: "Em análise", valor: `${filaRevisao.length} pedidos`, href: "/admin/antifraude" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <CardVendas kpis={dashboard.kpis.map((k) => ({ ...k, href: destinoKpi[k.rotulo] }))} serie={dashboard.serie} />

        <Card titulo="Antifraude · 30 dias" tom="red" className="xl:col-span-4" ferramentas={<Link href="/admin/antifraude" className="text-sm font-semibold text-red">Abrir fila</Link>}>
          <div className="flex items-center gap-4">
            <Anel valor={resumoAntifraude.aprovadosAuto} total={resumoAntifraude.analisados30d} rotulo="aprovados sozinhos" />
            <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              <div>
                <dt className="text-muted">Analisados</dt>
                <dd className="text-base font-bold tabular">{resumoAntifraude.analisados30d}</dd>
              </div>
              <div>
                <dt className="text-muted">Bloqueados</dt>
                <dd className="text-base font-bold tabular">{resumoAntifraude.bloqueados}</dd>
              </div>
              <div>
                <dt className="text-muted">Fraudes evitadas</dt>
                <dd className="text-base font-bold tabular">{resumoAntifraude.fraudesEvitadas}</dd>
              </div>
              <div>
                <dt className="text-muted">Chargebacks</dt>
                <dd className="text-base font-bold text-ok tabular">{resumoAntifraude.chargebacks}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs">
            <strong className="tabular">{reais(resumoAntifraude.valorEvitado)}</strong> em pedidos fraudulentos barrados. Tempo médio de revisão: <strong>{resumoAntifraude.tempoMedioRevisao}</strong>.
          </p>
          <div className="mt-3 space-y-1.5">
            {filaRevisao.map((p) => (
              <Link key={p.numero} href={`/admin/antifraude?pedido=${p.numero}`} className="tile flex items-center gap-2.5 px-2.5 py-2 transition hover:bg-white">
                <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    #{p.numero} · {p.cliente.nome}
                  </span>
                  <span className="block truncate text-xs text-muted">{p.risco.motivos[0]?.descricao}</span>
                </span>
                <span className="text-sm font-semibold tabular">{reaisCurto(p.total)}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card titulo="Pedidos que pedem ação" className="xl:col-span-5" ferramentas={<Link href="/admin/pedidos" className="text-sm font-semibold">Ver todos</Link>}>
          <ul className="space-y-2">
            {acao.slice(0, 6).map((p) => (
              <li key={p.numero}>
                <Link href={`/admin/pedidos?pedido=${p.numero}`} className="tile flex items-center gap-3 p-3">
                  <span className="w-14 text-sm font-bold tabular">#{p.numero}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.proximaAcao}</span>
                    <span className="block truncate text-xs text-muted">
                      {p.cliente.nome} · {p.canal}
                    </span>
                  </span>
                  <StatusChip status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Vendas por canal" className="xl:col-span-4" ferramentas={<Link href="/admin/relatorios/analise-de-canal" className="text-sm font-semibold">Relatório</Link>}>
          <BarrasHorizontais itens={dashboard.canais.map((c) => ({ rotulo: c.canal, valor: c.valor, sub: `${c.pedidos} pedidos` }))} />
          <div className="mt-5 border-t border-black/5 pt-4">
            <Link href="/admin/vendedores" className="mb-2 inline-flex items-center gap-1 text-sm font-semibold hover:text-red">
              Vendedores <Icon name="chevronRight" className="size-4" />
            </Link>
            <ol className="space-y-2">
              {equipe.map((e, i) => (
                <li key={e.nome} className="flex items-center gap-3 text-sm">
                  <span className="grid size-7 place-items-center rounded-full bg-white text-xs font-bold ring-1 ring-black/5">{i + 1}</span>
                  <span className="flex-1 font-medium">{e.nome}</span>
                  <span className="text-muted">{e.pedidos} pedidos</span>
                  <span className="w-20 text-right font-semibold tabular">{reaisCurto(e.vendas)}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <div className="grid min-w-0 gap-4 xl:col-span-3">
          <Card titulo="Mais vendidos" ferramentas={<Link href="/admin/relatorios/top-produtos" className="text-sm font-semibold">Ver todos</Link>}>
            <ul className="space-y-2.5">
              {top.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/catalogo/${p.id}`} className="clicavel -mx-2 flex items-center gap-3 rounded-xl px-2 py-1">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/80">
                    <ProductArt kind={p.art} color={corHex(p)} className="size-10" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.nome}</span>
                  <span className="text-sm font-bold tabular">{p.vendidos30d}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card titulo="Integração Bruning">
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-50" />
                <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
              </span>
              <span className="font-semibold">Sincronizando</span>
              <span className="text-muted">· última {ultimaSync.quando.split(" ")[1]}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{ultimaSync.detalhe}</p>
            <Link href="/admin/integracoes" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
              1 erro para revisar <Icon name="chevronRight" className="size-4" />
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
