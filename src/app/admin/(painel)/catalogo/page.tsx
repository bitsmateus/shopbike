import type { Metadata } from "next";
import { produtos, estoqueTotal } from "@/mock/catalogo";
import { numero } from "@/lib/format";
import { Cabecalho } from "@/ui/painel/ui";
import { Catalogo } from "./catalogo";

export const metadata: Metadata = { title: "Catálogo" };

export default function CatalogoPage() {
  return (
    <>
      <Cabecalho
        titulo="Catálogo"
        kpis={[
          { icon: "box", rotulo: "Produtos ativos", valor: numero(7395) },
          { icon: "tag", rotulo: "Sem estoque (amostra)", valor: `${produtos.filter((p) => estoqueTotal(p) === 0).length}` },
          { icon: "alert", rotulo: "Cadastro fraco (amostra)", valor: `${produtos.filter((p) => p.qualidade.nota < 80).length}` },
        ]}
      />
      <Catalogo />
    </>
  );
}
