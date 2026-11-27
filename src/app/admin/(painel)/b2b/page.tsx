import type { Metadata } from "next";
import { reais } from "@/lib/format";
import { BadgeFase2 } from "@/ui/painel/fase";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Lojistas B2B" };

const pedidosCadastro = [
  { empresa: "Ciclo Norte Bikes ME", cnpj: "41.***.***/0001-22", cidade: "Joinville/SC", enviado: "24/11", docs: "Contrato social, cartão CNPJ" },
  { empresa: "Pedal Forte Comércio", cnpj: "18.***.***/0001-03", cidade: "Lages/SC", enviado: "22/11", docs: "Cartão CNPJ" },
];

const lojistas = [
  { empresa: "Bike Point Criciúma Ltda", desde: "08/2022", lista: "Lojista (B2B)", pedidos: 11, total: 4_812_300, credito: "Boleto 28 dias" },
  { empresa: "Pedal Sul Assessoria Esportiva", desde: "03/2020", lista: "Equipes de pedal", pedidos: 7, total: 2_290_000, credito: "À vista" },
];

export default function B2BPage() {
  return (
    <>
      <Cabecalho
        titulo="Lojistas B2B"
        kpis={[
          { icon: "store", rotulo: "Lojistas ativos", valor: "11" },
          { icon: "clock", rotulo: "Cadastros para aprovar", valor: `${pedidosCadastro.length}` },
          { icon: "cart", rotulo: "Pedido mínimo", valor: "R$ 2.000" },
        ]}
        acoes={<BadgeFase2 />}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card titulo="Cadastros aguardando aprovação" tom="red">
          <ul className="space-y-2">
            {pedidosCadastro.map((p) => (
              <li key={p.empresa} className="tile p-3.5">
                <p className="font-semibold">{p.empresa}</p>
                <p className="text-sm text-muted">
                  {p.cnpj} · {p.cidade} · enviado {p.enviado}
                </p>
                <p className="mt-1 text-xs text-muted">Documentos: {p.docs}</p>
                <div className="mt-3 flex gap-2">
                  <Botao tom="ink">Aprovar com lista Lojista</Botao>
                  <Botao tom="ghost" className="text-danger">
                    Recusar
                  </Botao>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card titulo="Lojistas" className="overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
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
                      <span className="block font-semibold">{l.empresa}</span>
                      <span className="text-xs text-muted">
                        desde {l.desde} · {l.pedidos} pedidos
                      </span>
                    </td>
                    <td>
                      <Chip tom="ink">{l.lista}</Chip>
                    </td>
                    <td className="text-right font-semibold tabular">{reais(l.total)}</td>
                    <td className="text-sm">{l.credito}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Lojista aprovado vê os preços da lista própria no site, depois de entrar na conta. Lista de presentes e produtos personalizados também ficam na Fase 2.</p>
        </Card>
      </div>
    </>
  );
}
