import type { Metadata } from "next";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { AreaPrevia } from "@/ui/painel/fase";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Afiliados" };

const afiliados = [
  { nome: "Pedal Sul Assessoria", codigo: "PEDALSUL", comissao: "5%", cliques: 1_240, vendas: 14, valor: 3_980_000, aPagar: 199_000, status: "Ativo" },
  { nome: "@trilhasdotubarao", codigo: "TRILHAS", comissao: "4%", cliques: 3_810, vendas: 9, valor: 2_410_000, aPagar: 96_400, status: "Ativo" },
  { nome: "Equipe XCO Laguna", codigo: "XCOLAG", comissao: "5%", cliques: 402, vendas: 2, valor: 312_000, aPagar: 15_600, status: "Ativo" },
  { nome: "Blog Bike Sul", codigo: "BIKESUL", comissao: "3%", cliques: 96, vendas: 0, valor: 0, aPagar: 0, status: "Aguardando aprovação" },
];

export default function AfiliadosPage() {
  return (
    <>
      <Cabecalho
        titulo="Afiliados"
        kpis={[
          { icon: "users", rotulo: "Afiliados ativos", valor: "3" },
          { icon: "cart", rotulo: "Vendas (mês)", valor: "25" },
          { icon: "card", rotulo: "Comissão a pagar", valor: reais(311_000) },
        ]}
      />
      <AreaPrevia>
      <Card titulo="Afiliados" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Convidar afiliado</Botao>} className="overflow-hidden">
        <div className="-mx-5 overflow-x-auto">
          <table className="tabela min-w-[900px]">
            <thead>
              <tr>
                <th>Afiliado</th>
                <th>Link</th>
                <th>Comissão</th>
                <th className="text-right">Cliques</th>
                <th className="text-right">Vendas</th>
                <th className="text-right">Faturado</th>
                <th className="text-right">A pagar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {afiliados.map((a) => (
                <tr key={a.codigo}>
                  <td className="font-semibold">{a.nome}</td>
                  <td className="font-mono text-xs">shopbike.com.br/?ref={a.codigo}</td>
                  <td>{a.comissao}</td>
                  <td className="text-right tabular">{a.cliques.toLocaleString("pt-BR")}</td>
                  <td className="text-right tabular">{a.vendas}</td>
                  <td className="text-right tabular">{reais(a.valor)}</td>
                  <td className="text-right font-bold tabular">{reais(a.aPagar)}</td>
                  <td>
                    <Chip tom={a.status === "Ativo" ? "ok" : "warn"}>{a.status}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">Comissão só é liberada depois do prazo de troca (7 dias após a entrega) e se o pedido não tiver chargeback.</p>
      </Card>
      </AreaPrevia>
    </>
  );
}
