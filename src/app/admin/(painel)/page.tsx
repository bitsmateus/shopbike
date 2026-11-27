import Link from "next/link";
import { produtos, corHex } from "@/mock/catalogo";
import { dashboard, equipe, filaRevisao, integracaoLog, pedidos, resumoAntifraude } from "@/mock/operacao";
import { expedicao } from "@/mock/painel";
import { reaisCurto } from "@/lib/format";
import { ProductArt } from "@/ui/product-art";
import { BarrasHorizontais } from "@/ui/painel/graficos";
import { CardVendas } from "@/ui/painel/card-vendas";
import { Cabecalho, Card, LinkCard, NotaRisco, StatusChip, Vazio, nomeCanal } from "@/ui/painel/ui";

/** Para onde cada indicador leva ao ser clicado. */
const destinoKpi: Record<string, string> = {
  Vendas: "/admin/relatorios/vendas-por-periodo",
  "Pedidos pagos": "/admin/pedidos",
  "Ticket médio": "/admin/relatorios/relatorio-de-pedidos",
  Conversão: "/admin/relatorios/taxa-de-conversao",
  Visitas: "/admin/relatorios/analise-de-canal",
  "Carrinhos abandonados": "/admin/recuperacao",
};

/** Quantos casos da fila do antifraude aparecem direto no card; acima disso, "Ver todos". */
const FILA_VISIVEL = 5;

export default function VisaoGeral() {
  const af = resumoAntifraude;
  const faixasAf = [
    { rotulo: "Aprovados", valor: af.aprovadosAuto, cor: "bg-ok" },
    { rotulo: "Revisão", valor: af.analisados30d - af.aprovadosAuto - af.bloqueados, cor: "bg-warn-400" },
    { rotulo: "Bloqueados", valor: af.bloqueados, cor: "bg-danger" },
  ];
  const acao = pedidos.filter((p) => !["Entregue", "Cancelado", "Enviado"].includes(p.status));
  const top = [...produtos].sort((a, b) => b.vendidos30d - a.vendidos30d).slice(0, 5);
  const ultimaSync = integracaoLog[0];
  const aExpedir = expedicao.filter((e) => e.etapa !== "Enviado").length;

  return (
    <>
      <Cabecalho
        titulo="Visão geral"
        kpis={[
          { icon: "arrowUp", rotulo: "Projeção de novembro", valor: reaisCurto(dashboard.projecaoMes), href: "/admin/relatorios/vendas-por-periodo" },
          { icon: "truck", rotulo: "A expedir hoje", valor: `${aExpedir} pedidos`, href: "/admin/expedicao" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <CardVendas kpis={dashboard.kpis.map((k) => ({ ...k, href: destinoKpi[k.rotulo] }))} serie={dashboard.serie} />

        <Card titulo="Antifraude · 30 dias" tom="red" className="flex flex-col xl:col-span-4" ferramentas={<LinkCard href="/admin/antifraude">Abrir fila</LinkCard>}>
          {/* Decisões dos últimos 30 dias */}
          <div className="flex items-baseline justify-between gap-2">
            <p>
              <span className="text-2xl font-bold tabular">{Math.round((af.aprovadosAuto / af.analisados30d) * 100)}%</span>
              <span className="ml-1.5 text-[13px] font-medium text-muted">aprovados sem revisão</span>
            </p>
            <span className="text-xs text-muted tabular">{af.analisados30d} analisados</span>
          </div>
          <div className="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden>
            {faixasAf.map((f) => (
              <span key={f.rotulo} className={f.cor} style={{ width: `${(f.valor / af.analisados30d) * 100}%` }} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-muted">
            {faixasAf.map((f) => (
              <span key={f.rotulo} className="inline-flex items-center gap-1">
                <span className={`size-2 rounded-full ${f.cor}`} />
                {f.rotulo} <strong className="text-ink tabular">{f.valor}</strong>
              </span>
            ))}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-snow px-3 py-2.5">
            {[
              ["Fraudes evitadas", String(af.fraudesEvitadas), ""],
              ["Valor barrado", reaisCurto(af.valorEvitado), ""],
              ["Tempo médio", af.tempoMedioRevisao, ""],
              ["Chargebacks", String(af.chargebacks), "text-ok"],
            ].map(([k, v, cor]) => (
              <div key={k} className="flex items-baseline justify-between gap-2">
                <dt className="text-xs font-medium text-muted">{k}</dt>
                <dd className={`text-sm font-bold whitespace-nowrap tabular ${cor}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 mb-2 flex items-center justify-between text-[13px] font-semibold">
            Aguardando revisão
            <span className="text-xs font-medium text-muted tabular">{filaRevisao.length} pedidos</span>
          </p>
          {filaRevisao.length === 0 ? (
            <p className="rounded-xl bg-snow px-3 py-4 text-center text-[13px] text-muted">Nenhum pedido esperando revisão.</p>
          ) : (
            <ul className="space-y-1.5" aria-label="Pedidos aguardando revisão">
              {filaRevisao.slice(0, FILA_VISIVEL).map((p) => (
                <li key={p.numero}>
                  <Link href={`/admin/antifraude?pedido=${p.numero}`} className="tile flex min-h-12 items-center gap-2.5 px-2.5 py-1.5">
                    <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[13px] font-semibold">{p.cliente.nome}</span>
                      <span className="block truncate text-xs text-muted">
                        #{p.numero} · {p.risco.motivos[0]?.descricao}
                      </span>
                    </span>
                    <span className="text-[13px] font-semibold tabular">{reaisCurto(p.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {filaRevisao.length > FILA_VISIVEL && (
            <div className="mt-2">
              <LinkCard href="/admin/antifraude">Ver todos os {filaRevisao.length}</LinkCard>
            </div>
          )}
        </Card>

        <Card titulo="Pedidos que pedem ação" className="xl:col-span-5" ferramentas={<LinkCard href="/admin/pedidos">Ver todos</LinkCard>}>
          {acao.length === 0 ? (
            <Vazio titulo="Nada pendente" texto="Todos os pedidos estão em dia." />
          ) : (
            <ul className="space-y-2">
              {acao.slice(0, 6).map((p) => (
                <li key={p.numero}>
                  <Link href={`/admin/pedidos?pedido=${p.numero}`} className="tile flex items-center gap-3 px-3 py-2.5">
                    <span className="w-14 text-[13px] font-medium text-muted tabular">#{p.numero}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.proximaAcao}</span>
                      <span className="block truncate text-xs text-muted">
                        {p.cliente.nome} · {nomeCanal[p.canal]}
                      </span>
                    </span>
                    <StatusChip status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card titulo="Vendas por canal" className="xl:col-span-4" ferramentas={<LinkCard href="/admin/relatorios/analise-de-canal">Relatório</LinkCard>}>
          <BarrasHorizontais itens={dashboard.canais.map((c) => ({ rotulo: c.canal, valor: c.valor, sub: `${c.pedidos} pedidos` }))} />
          <div className="mt-5 border-t border-line pt-3">
            <LinkCard href="/admin/vendedores">Vendedores</LinkCard>
            <ol className="mt-1 space-y-2">
              {equipe.map((e, i) => (
                <li key={e.nome} className="flex items-center gap-3 text-sm">
                  <span className="grid size-7 place-items-center rounded-full bg-snow text-xs font-bold ring-1 ring-line">{i + 1}</span>
                  <span className="flex-1 font-medium">{e.nome}</span>
                  <span className="text-muted">{e.pedidos} pedidos</span>
                  <span className="w-20 text-right font-semibold tabular">{reaisCurto(e.vendas)}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <div className="grid min-w-0 gap-4 xl:col-span-3">
          <Card titulo="Mais vendidos" ferramentas={<LinkCard href="/admin/relatorios/top-produtos">Ver todos</LinkCard>}>
            <p className="-mt-2 mb-2 text-xs text-muted">Unidades vendidas nos últimos 30 dias</p>
            <ul className="space-y-1.5">
              {top.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/catalogo/${p.id}`} className="clicavel -mx-2 flex items-center gap-3 rounded-xl px-2 py-1">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-snow">
                      <ProductArt kind={p.art} color={corHex(p)} className="size-10" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.nome}</span>
                    <span className="text-sm font-bold whitespace-nowrap tabular">
                      {p.vendidos30d} <span className="text-xs font-medium text-muted">un.</span>
                    </span>
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
            <div className="mt-2">
              <LinkCard href="/admin/integracoes" tom="erro" icone="alert">
                1 erro para revisar
              </LinkCard>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
