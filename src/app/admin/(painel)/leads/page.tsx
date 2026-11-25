import type { Metadata } from "next";
import { leads } from "@/mock/painel";
import { Icon } from "@/ui/icons";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

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
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-black/5 p-3">
            <span className="px-2 text-sm font-semibold">Captados no site</span>
            <span className="flex-1" />
            <Botao tom="ghost">
              <Icon name="arrowDown" className="size-4" /> Exportar
            </Botao>
            <Botao tom="ink">
              <Icon name="send" className="size-4" /> Reenviar pendentes ao CRM
            </Botao>
          </div>
          <div className="overflow-x-auto">
            <table className="tabela min-w-[760px]">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Origem</th>
                  <th>Interesse</th>
                  <th>Quando</th>
                  <th>CRM NX</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.nome}>
                    <td className="font-semibold">{l.nome}</td>
                    <td>{l.contato}</td>
                    <td>{l.origem}</td>
                    <td>{l.interesse}</td>
                    <td className="tabular">{l.quando}</td>
                    <td>
                      <Chip tom={l.crm === "Enviado" ? "ok" : "warn"}>{l.crm}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card titulo="Pop-up de captação">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <p className="text-xs font-semibold tracking-wide text-red uppercase">Prévia</p>
            <p className="mt-2 text-lg leading-tight font-bold">Ganhe 5% na primeira compra</p>
            <p className="mt-1 text-sm text-muted">Deixe seu WhatsApp e receba ofertas de bikes e peças.</p>
            <div className="mt-3 h-10 rounded-xl bg-snow" />
            <div className="mt-2 h-10 rounded-full bg-red" />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {[
              ["Aparece após", "20 segundos"],
              ["Frequência", "1 vez a cada 7 dias"],
              ["Cupom", "PRIMEIRA"],
              ["Conversão do pop-up", "3,4%"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-black/5 pb-2">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
