import Link from "next/link";
import { produtos, corHex } from "@/mock/catalogo";
import { dashboard, equipe, filaRevisao, integracaoLog, pedidos, resumoAntifraude } from "@/mock/operacao";
import { reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { BarrasHorizontais } from "@/ui/painel/graficos";
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
  const af = resumoAntifraude;
  const faixasAf = [
    { rotulo: "Aprovados", valor: af.aprovadosAuto, cor: "bg-ok" },
    { rotulo: "Revisão", valor: af.analisados30d - af.aprovadosAuto - af.bloqueados, cor: "bg-[#e7a33e]" },
    { rotulo: "Bloqueados", valor: af.bloqueados, cor: "bg-red" },
  ];
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

        <Card titulo="Antifraude · 30 dias" tom="red" className="self-start xl:col-span-4" ferramentas={<Link href="/admin/antifraude" className="text-sm font-semibold text-red">Abrir fila</Link>}>
          {/* Decisões: barra empilhada em vez de anel */}
          <div className="flex items-baseline justify-between gap-2">
            <p>
              <span className="text-2xl font-bold tabular">{Math.round((af.aprovadosAuto / af.analisados30d) * 100)}%</span>
              <span className="ml-1.5 text-xs font-medium text-muted">aprovados sem revisão</span>
            </p>
            <span className="text-xs text-muted tabular">{af.analisados30d} analisados</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-black/5" aria-hidden>
            {faixasAf.map((f) => (
              <span key={f.rotulo} className={f.cor} style={{ width: `${(f.valor / af.analisados30d) * 100}%` }} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-muted">
            {faixasAf.map((f) => (
              <span key={f.rotulo} className="inline-flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${f.cor}`} />
                {f.rotulo} <strong className="text-ink tabular">{f.valor}</strong>
              </span>
            ))}
          </div>

          <dl className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-white/70 px-2 py-2 text-center">
            {[
              ["Fraudes evitadas", String(af.fraudesEvitadas), ""],
              ["Valor barrado", reaisCurto(af.valorEvitado), ""],
              ["Tempo médio", af.tempoMedioRevisao, ""],
              ["Chargebacks", String(af.chargebacks), "text-ok"],
            ].map(([k, v, cor]) => (
              <div key={k}>
                <dt className="text-[10px] leading-tight text-muted">{k}</dt>
                <dd className={`text-sm font-bold tabular ${cor}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-3 mb-1.5 flex items-center justify-between text-xs font-semibold">
            Aguardando revisão
            <span className="rounded-full bg-red px-1.5 text-[10px] text-white tabular">{filaRevisao.length}</span>
          </p>
          {/* mostra 3 e rola o resto */}
          <ul className="fila-scroll -mr-1.5 max-h-[9.25rem] space-y-1.5 overflow-y-auto pr-1.5" aria-label="Pedidos aguardando revisão">
            {filaRevisao.map((p) => (
              <li key={p.numero}>
                <Link href={`/admin/antifraude?pedido=${p.numero}`} className="tile flex h-11 items-center gap-2 px-2">
                  <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[13px] font-semibold">
                      #{p.numero} · {p.cliente.nome}
                    </span>
                    <span className="block truncate text-[11px] text-muted">{p.risco.motivos[0]?.descricao}</span>
                  </span>
                  <span className="text-xs font-semibold tabular">{reaisCurto(p.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
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
