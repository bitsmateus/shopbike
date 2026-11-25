import type { Metadata } from "next";
import { reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { BadgeFase2 } from "@/ui/painel/fase";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Vendedores e metas" };

const vendedores = [
  { nome: "Diego", vendas: 4_890_000, meta: 5_500_000, pedidos: 11, links: 18, conversao: 61, comissao: 146_700 },
  { nome: "Carla", vendas: 2_520_900, meta: 4_000_000, pedidos: 7, links: 12, conversao: 58, comissao: 75_627 },
  { nome: "Rogério", vendas: 1_180_000, meta: 3_000_000, pedidos: 4, links: 9, conversao: 44, comissao: 35_400 },
  { nome: "IA (WhatsApp)", vendas: 2_268_200, meta: 2_000_000, pedidos: 7, links: 7, conversao: 100, comissao: 0 },
];

export default function VendedoresPage() {
  return (
    <>
      <Cabecalho
        titulo="Vendedores e metas"
        kpis={[
          { icon: "users", rotulo: "Vendas da equipe (mês)", valor: reaisCurto(10_859_100) },
          { icon: "chart", rotulo: "Meta da loja", valor: "75%" },
          { icon: "card", rotulo: "Comissão prevista", valor: reais(257_727) },
        ]}
        acoes={<BadgeFase2 />}
      />
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card titulo="Ranking de novembro" ferramentas={<Botao tom="ghost">Novembro ▾</Botao>}>
          <ol className="space-y-3">
            {vendedores.map((v, i) => {
              const p = Math.round((v.vendas / v.meta) * 100);
              return (
                <li key={v.nome} className="tile p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                    <span className="flex-1 text-lg font-bold">{v.nome}</span>
                    <span className="text-sm text-muted">
                      {v.pedidos} pedidos · {v.links} links · conversão {v.conversao}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5">
                      <div className={`h-full rounded-full ${p >= 100 ? "bg-ok" : "bg-red"}`} style={{ width: `${Math.min(100, p)}%` }} />
                    </div>
                    <span className="w-44 text-right text-sm tabular">
                      <strong>{reaisCurto(v.vendas)}</strong> de {reaisCurto(v.meta)}
                    </span>
                    <Chip tom={p >= 100 ? "ok" : "neutro"}>{p}%</Chip>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
        <div className="space-y-4">
          <Card titulo="Comissão do mês" className="overflow-hidden">
            <div className="-mx-5 overflow-x-auto">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Vendedor</th>
                    <th className="text-right">Base</th>
                    <th className="text-right">Comissão</th>
                  </tr>
                </thead>
                <tbody>
                  {vendedores
                    .filter((v) => v.comissao > 0)
                    .map((v) => (
                      <tr key={v.nome}>
                        <td className="font-semibold">{v.nome}</td>
                        <td className="text-right tabular">{reais(v.vendas)}</td>
                        <td className="text-right font-bold tabular">{reais(v.comissao)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Botao tom="ghost" className="mt-3">
              <Icon name="arrowDown" className="size-4" /> Exportar fechamento
            </Botao>
          </Card>
          <Card titulo="Regras de comissão">
            <ul className="space-y-2 text-sm">
              {[
                ["Bicicletas", "3%"],
                ["Peças e acessórios", "5%"],
                ["Seminovas", "2%"],
                ["Venda com desconto acima de 3%", "comissão −1 p.p."],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-black/5 pb-2">
                  <span>{k}</span>
                  <span className="font-bold">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Regras reais a confirmar com a loja. A venda é atribuída por link de pagamento, cupom do vendedor ou indicação no pedido.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
