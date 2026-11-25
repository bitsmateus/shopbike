import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { Categorias } from "./categorias";

export const metadata: Metadata = { title: "Categorias e marcas" };

export default function CategoriasPage() {
  return (
    <>
      <Cabecalho
        titulo="Categorias e marcas"
        kpis={[
          { icon: "tag", rotulo: "Categorias", valor: "42" },
          { icon: "star", rotulo: "Marcas", valor: "118" },
          { icon: "doc", rotulo: "Tabelas de tamanho", valor: "6" },
        ]}
      />
      <Categorias />
    </>
  );
}
