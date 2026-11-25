import type { Metadata } from "next";
import { clientes } from "@/mock/painel";
import { numero } from "@/lib/format";
import { Cabecalho } from "@/ui/painel/ui";
import { ListaClientes } from "./lista";

export const metadata: Metadata = { title: "Clientes" };

export default function ClientesPage() {
  return (
    <>
      <Cabecalho
        titulo="Clientes"
        kpis={[
          { icon: "users", rotulo: "Cadastrados", valor: numero(28_412) },
          { icon: "plus", rotulo: "Novos em novembro", valor: "386" },
          { icon: "star", rotulo: "Aniversariantes da semana", valor: `${clientes.filter((c) => ["26/11", "29/11", "30/11"].includes(c.aniversario)).length}` },
        ]}
      />
      <ListaClientes />
    </>
  );
}
