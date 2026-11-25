import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { Configuracoes } from "./configuracoes";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <>
      <Cabecalho titulo="Configurações" />
      <Configuracoes />
    </>
  );
}
