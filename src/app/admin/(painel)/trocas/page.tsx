import type { Metadata } from "next";
import { trocas } from "@/mock/painel";
import { Cabecalho } from "@/ui/painel/ui";
import { Trocas } from "./trocas";

export const metadata: Metadata = { title: "Trocas e devoluções" };

export default function TrocasPage() {
  const abertas = trocas.filter((t) => !["Concluído", "Recusado"].includes(t.status));
  return (
    <>
      <Cabecalho
        titulo="Trocas e devoluções"
        kpis={[
          { icon: "sync", rotulo: "Abertas", valor: `${abertas.length}` },
          { icon: "clock", rotulo: "Tempo médio", valor: "4,2 dias" },
          { icon: "chart", rotulo: "Taxa de troca (30d)", valor: "2,1%" },
        ]}
      />
      <Trocas />
    </>
  );
}
