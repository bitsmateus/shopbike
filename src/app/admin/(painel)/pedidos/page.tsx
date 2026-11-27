import type { Metadata } from "next";
import { pedidos } from "@/mock/operacao";
import { reaisCurto } from "@/lib/format";
import { Cabecalho } from "@/ui/painel/ui";
import { ListaPedidos } from "./lista-pedidos";

export const metadata: Metadata = { title: "Pedidos" };

export default async function PedidosPage({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams;
  const pagos = pedidos.filter((p) => !["Aguardando pagamento", "Cancelado", "Bloqueado", "Em análise"].includes(p.status));
  const desde = pedidos.map((p) => p.data).sort()[0];
  const desdeTxt = new Date(desde).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return (
    <>
      <Cabecalho
        titulo="Pedidos"
        kpis={[
          { icon: "doc", rotulo: "Hoje", valor: `${pedidos.filter((p) => p.data.startsWith("2026-11-25")).length} pedidos` },
          { icon: "check", rotulo: `Pagos desde ${desdeTxt}`, valor: reaisCurto(pagos.reduce((s, p) => s + p.total, 0)) },
          { icon: "truck", rotulo: "Para despachar", valor: `${pedidos.filter((p) => ["Pago", "Em separação", "Faturado"].includes(p.status)).length} pedidos`, href: "/admin/expedicao" },
        ]}
      />
      <ListaPedidos inicial={pedido} />
    </>
  );
}
