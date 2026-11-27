import type { Metadata } from "next";
import { Cabecalho } from "@/ui/painel/ui";
import { CardPopup, ListaLeads } from "./lista-leads";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <>
      <Cabecalho
        titulo="Leads"
        kpis={[
          { icon: "users", rotulo: "Novos (7 dias)", valor: "148" },
          { icon: "send", rotulo: "Enviados ao CRM NX", valor: "97%" },
          { icon: "chart", rotulo: "Viraram venda (30d)", valor: "11%" },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <ListaLeads />
        <CardPopup />
      </div>
    </>
  );
}
