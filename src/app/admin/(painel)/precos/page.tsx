import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { Precos } from "./precos";

export const metadata: Metadata = { title: "Preços e parcelamento" };

export default function PrecosPage() {
  return (
    <>
      <Cabecalho
        titulo="Preços e parcelamento"
        kpis={[
          { icon: "card", rotulo: "Parcelamento geral", valor: "até 21x" },
          { icon: "pix", rotulo: "Desconto à vista", valor: "10%" },
          { icon: "tag", rotulo: "Em promoção agora", valor: "214" },
        ]}
      />
      <Precos />
    </>
  );
}
