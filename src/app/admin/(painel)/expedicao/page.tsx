import type { Metadata } from "next";
import { expedicao } from "@/mock/painel";
import { Cabecalho } from "@/ui/painel/ui";
import { QuadroExpedicao } from "./quadro";

export const metadata: Metadata = { title: "Expedição" };

export default function ExpedicaoPage() {
  const n = (e: string) => expedicao.filter((x) => x.etapa === e).length;
  return (
    <>
      <Cabecalho
        titulo="Expedição"
        kpis={[
          { icon: "box", rotulo: "Para separar", valor: `${n("Separar")}` },
          { icon: "doc", rotulo: "Aguardando NF", valor: `${n("Aguardando NF")}` },
          { icon: "truck", rotulo: "Enviados hoje", valor: `${n("Enviado")}` },
        ]}
      />
      <QuadroExpedicao />
    </>
  );
}
