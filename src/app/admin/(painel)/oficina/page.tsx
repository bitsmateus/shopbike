import type { Metadata } from "next";
import { AreaPrevia } from "@/ui/painel/fase";
import { Cabecalho } from "@/ui/painel/ui";
import { AgendaOficina, LembretesRevisao, ServicosPrecos } from "./agenda";
import { agenda } from "./dados";

export const metadata: Metadata = { title: "Oficina e pós-venda" };

export default function OficinaPage() {
  return (
    <>
      <Cabecalho
        titulo="Oficina e pós-venda"
        kpis={[
          { icon: "wrench", rotulo: "Agendados na semana", valor: `${agenda.length}` },
          { icon: "whatsapp", rotulo: "Lembretes enviados (mês)", valor: "86" },
          { icon: "check", rotulo: "Viraram agendamento", valor: "34%" },
        ]}
      />
      <AreaPrevia>
        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <AgendaOficina />
          <div className="space-y-4">
            <LembretesRevisao />
            <ServicosPrecos />
          </div>
        </div>
      </AreaPrevia>
    </>
  );
}
