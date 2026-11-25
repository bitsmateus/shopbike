import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { Vitrine } from "./vitrine";

export const metadata: Metadata = { title: "Vitrine da loja" };

export default function VitrinePage() {
  return (
    <>
      <Cabecalho titulo="Vitrine da loja" />
      <Vitrine />
    </>
  );
}
