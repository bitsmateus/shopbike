import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { Moderacao } from "./moderacao";

export const metadata: Metadata = { title: "Avaliações e perguntas" };

export default function AvaliacoesPage() {
  return (
    <>
      <Cabecalho
        titulo="Avaliações e perguntas"
        kpis={[
          { icon: "star", rotulo: "Nota média da loja", valor: "4,8" },
          { icon: "doc", rotulo: "Aguardando moderação", valor: "4" },
          { icon: "clock", rotulo: "Tempo de resposta", valor: "3 h" },
        ]}
      />
      <Moderacao />
    </>
  );
}
