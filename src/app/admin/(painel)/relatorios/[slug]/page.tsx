import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { linhasDe, relatorios, type Relatorio } from "@/mock/relatorios";
import { numero, pct, reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { BadgeFase2 } from "@/ui/painel/fase";
import { Botao, Card, Chip } from "@/ui/painel/ui";

type Props = { params: Promise<{ slug: string }> };

const pesquisas: Relatorio = {
  slug: "pesquisas",
  titulo: "Pesquisas na loja",
  grupo: "Logs",
  fase: 1,
  dimensao: "Termo buscado",
  itens: ["mtb aro 29", "capacete", "pedal clip", "bike eletrica", "camara 29", "sapatilha", "selim", "speed carbono", "bike infantil aro 20", "oggi 7.2"],
};
const todos = [...relatorios, pesquisas];

export function generateStaticParams() {
  return todos.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: todos.find((r) => r.slug === slug)?.titulo ?? "Relatório" };
}

export default async function RelatorioPage({ params }: Props) {
  const { slug } = await params;
  const r = todos.find((x) => x.slug === slug);
  if (!r) notFound();
  const linhas = linhasDe(r);
  const total = linhas.reduce((s, l) => s + l.vendas, 0);
  const pedidos = linhas.reduce((s, l) => s + l.pedidos, 0);
  const visitas = linhas.reduce((s, l) => s + l.visitas, 0);
  const max = Math.max(...linhas.map((l) => l.vendas));
  const ehBusca = r.slug === "pesquisas";

  return (
    <>
      <Link href="/admin/relatorios" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <Icon name="chevronLeft" className="size-4" /> Relatórios
      </Link>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <p className="text-sm text-muted">{r.grupo}</p>
          <h1 className="text-[clamp(28px,3vw,44px)] leading-none font-bold tracking-tight">{r.titulo}</h1>
        </div>
        {r.fase === 2 && <BadgeFase2 />}
        <label className="glass flex h-11 items-center gap-2 rounded-full px-4 text-sm">
          <Icon name="clock" className="size-4 text-muted" />
          <select className="bg-transparent font-semibold outline-none" aria-label="Período" defaultValue="Este mês">
            {["Hoje", "Últimos 7 dias", "Este mês", "Mês passado", "Últimos 12 meses", "Personalizado…"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="glass flex h-11 items-center gap-2 rounded-full px-4 text-sm">
          <input type="checkbox" defaultChecked className="size-4 accent-[var(--color-ink)]" /> Comparar com período anterior
        </label>
        <Botao tom="ink">
          <Icon name="arrowDown" className="size-4" /> Exportar XLSX
        </Botao>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(ehBusca
          ? [
              ["Buscas", numero(visitas)],
              ["Termos diferentes", numero(linhas.length * 112)],
              ["Sem resultado", "6,4%"],
              ["Buscas que viraram venda", "8,1%"],
            ]
          : [
              ["Vendas", reaisCurto(total)],
              ["Pedidos", numero(pedidos)],
              ["Ticket médio", reaisCurto(Math.round(total / pedidos))],
              ["Conversão", pct((pedidos / visitas) * 100, 2)],
            ]
        ).map(([k, v], i) => (
          <div key={k} className="glass rounded-[18px] p-4">
            <p className="text-sm text-muted">{k}</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight tabular">{v}</p>
            <p className={`text-xs font-semibold ${i === 3 ? "text-red" : "text-ok"}`}>{i === 3 ? "↓ 0,2 p.p." : `↑ ${8 + i * 3}%`} vs. período anterior</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Card titulo={`Por ${r.dimensao.toLowerCase()}`}>
          <ul className="space-y-3">
            {linhas.slice(0, 8).map((l, i) => (
              <li key={l.rotulo}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{l.rotulo}</span>
                  <span className="font-semibold tabular">{ehBusca ? numero(l.visitas) : reaisCurto(l.vendas)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-black/5">
                  <div className="h-full rounded-full" style={{ width: `${(l.vendas / max) * 100}%`, background: i === 0 ? "#e30618" : "#1a1917" }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[640px]">
              <thead>
                <tr>
                  <th>{r.dimensao}</th>
                  {ehBusca ? (
                    <>
                      <th className="text-right">Buscas</th>
                      <th className="text-right">Resultados</th>
                      <th className="text-right">Viraram venda</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right">Pedidos</th>
                      <th className="text-right">Vendas</th>
                      <th className="text-right">Ticket</th>
                      <th className="text-right">% do total</th>
                      {r.abc && <th>Classe</th>}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {linhas.map((l, i) => (
                  <tr key={l.rotulo}>
                    <td className="font-medium">{l.rotulo}</td>
                    {ehBusca ? (
                      <>
                        <td className="text-right tabular">{numero(l.visitas)}</td>
                        <td className="text-right tabular">{i === 4 || i === 7 ? <Chip tom="red">0 · sem resultado</Chip> : l.pedidos}</td>
                        <td className="text-right tabular">{pct((l.pedidos / l.visitas) * 100, 1)}</td>
                      </>
                    ) : (
                      <>
                        <td className="text-right tabular">{numero(l.pedidos)}</td>
                        <td className="text-right font-semibold tabular">{reais(l.vendas)}</td>
                        <td className="text-right tabular">{reaisCurto(Math.round(l.vendas / l.pedidos))}</td>
                        <td className="text-right tabular">{pct(l.part * 100, 1)}</td>
                        {r.abc && (
                          <td>
                            <Chip tom={l.classe === "A" ? "ink" : l.classe === "B" ? "neutro" : "apagado"}>{l.classe}</Chip>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {ehBusca && <p className="mt-3 text-sm text-muted">Termos sem resultado viram sinônimo ou produto fixado na curadoria da busca.</p>}
    </>
  );
}
