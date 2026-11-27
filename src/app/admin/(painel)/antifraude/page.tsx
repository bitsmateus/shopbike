import type { Metadata } from "next";
import { filaRevisao, resumoAntifraude } from "@/mock/operacao";
import { reaisCurto } from "@/lib/format";
import { Cabecalho } from "@/ui/painel/ui";
import { Antifraude } from "./antifraude";

export const metadata: Metadata = { title: "Antifraude" };

export default async function AntifraudePage({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams;
  return (
    <>
      <Cabecalho
        titulo="Antifraude"
        kpis={[
          { icon: "shield", rotulo: "Em revisão", valor: `${filaRevisao.length}` },
          { icon: "ban", rotulo: "Bloqueados (30d)", valor: `${resumoAntifraude.bloqueados}` },
          { icon: "check", rotulo: "Valor barrado (30d)", valor: reaisCurto(resumoAntifraude.valorEvitado) },
        ]}
      />
      <Antifraude inicial={pedido} />
    </>
  );
}
