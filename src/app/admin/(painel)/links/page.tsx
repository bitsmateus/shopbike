import type { Metadata } from "next";
import { links } from "@/mock/operacao";
import { reaisCurto } from "@/lib/format";
import { Cabecalho } from "@/ui/painel/ui";
import { Links } from "./links";

export const metadata: Metadata = { title: "Links de pagamento" };

export default function LinksPage() {
  const pagos = links.filter((l) => l.status === "pago");
  return (
    <>
      <Cabecalho
        titulo="Links de pagamento"
        kpis={[
          { icon: "link", rotulo: "Ativos", valor: `${links.filter((l) => l.status === "ativo" || l.status === "em_uso").length}` },
          { icon: "check", rotulo: "Pagos no mês", valor: reaisCurto(pagos.reduce((s, l) => s + l.total, 0) + 7_191_000) },
          { icon: "card", rotulo: "Parcelamento", valor: "até 21x" },
        ]}
      />
      <Links />
    </>
  );
}
