import type { Metadata } from "next";
import { cupons } from "@/mock/painel";
import { Cabecalho } from "@/ui/painel/ui";
import { Cupons } from "./cupons";

export const metadata: Metadata = { title: "Cupons" };

export default function CuponsPage() {
  return (
    <>
      <Cabecalho
        titulo="Cupons"
        kpis={[
          { icon: "tag", rotulo: "Ativos", valor: `${cupons.filter((c) => c.ativo).length}` },
          { icon: "check", rotulo: "Usos em novembro", valor: "622" },
          { icon: "chart", rotulo: "Vendas com cupom", valor: "R$ 61.240" },
        ]}
      />
      <Cupons />
    </>
  );
}
