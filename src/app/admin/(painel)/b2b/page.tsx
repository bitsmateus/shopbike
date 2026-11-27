import Link from "next/link";
import type { Metadata } from "next";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { AreaPrevia } from "@/ui/painel/fase";
import { Cabecalho, Card, Chip } from "@/ui/painel/ui";
import { CadastrosB2B } from "./cadastros";

export const metadata: Metadata = { title: "Lojistas B2B" };

const TOTAL_LOJISTAS = 11;

const lojistas = [
  { id: "c4", empresa: "Bike Point Criciúma Ltda", desde: "08/2022", lista: "Lojista (B2B)", pedidos: 11, total: 4_812_300, credito: "Boleto 28 dias" },
  { id: "c9", empresa: "Pedal Sul Assessoria Esportiva", desde: "03/2020", lista: "Equipes de pedal", pedidos: 7, total: 2_290_000, credito: "À vista" },
];

export default function B2BPage() {
  return (
    <>
      <Cabecalho
        titulo="Lojistas B2B"
        kpis={[
          { icon: "store", rotulo: "Lojistas ativos", valor: `${TOTAL_LOJISTAS}` },
          { icon: "clock", rotulo: "Cadastros para aprovar", valor: "2" },
          { icon: "cart", rotulo: "Pedido mínimo", valor: "R$ 2.000" },
        ]}
      />
      <AreaPrevia>
        <div className="grid gap-4 xl:grid-cols-2">
          <CadastrosB2B />
          <Card titulo="Lojistas" className="overflow-hidden">
            <div className="-mx-4 overflow-x-auto">
              <table className="tabela min-w-[560px]">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Lista de preço</th>
                    <th className="text-right">Comprado</th>
                    <th>Condição</th>
                  </tr>
                </thead>
                <tbody>
                  {lojistas.map((l) => (
                    <tr key={l.empresa}>
                      <td>
                        <Link href={`/admin/clientes/${l.id}`} className="block font-semibold underline-offset-4 hover:underline">
                          {l.empresa}
                        </Link>
                        <span className="text-xs text-muted">
                          desde {l.desde} · {l.pedidos} pedidos
                        </span>
                      </td>
                      <td>
                        <Chip>{l.lista}</Chip>
                      </td>
                      <td className="text-right font-semibold tabular">{reais(l.total)}</td>
                      <td>{l.credito}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="my-3 text-xs text-muted">Lojista aprovado vê os preços da lista própria no site, depois de entrar na conta. Lista de presentes e produtos personalizados chegam em breve.</p>
            <div className="-mx-4 -mb-4 flex items-center justify-between border-t border-line px-4 py-2.5 text-sm">
              <span className="text-muted tabular">
                {lojistas.length} de {TOTAL_LOJISTAS}
              </span>
              <Link href="/admin/clientes" className="inline-flex min-h-8 items-center gap-1 rounded-full px-2 text-[13px] font-semibold hover:bg-snow">
                Ver todos <Icon name="chevronRight" className="size-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </AreaPrevia>
    </>
  );
}
