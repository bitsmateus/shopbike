"use client";

import { useState } from "react";
import { eventosNotificacao, logEnvios } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, InterruptorLocal } from "@/ui/painel/controles";
import { Cabecalho, Card, Chip } from "@/ui/painel/ui";

const abas = ["Para o cliente", "Alertas internos", "Log de envios"] as const;

const textos: Record<string, string> = {
  pedido_recebido_v2: "Olá, {{nome}}! Recebemos seu pedido #{{pedido}} na ShopBike. Assim que o pagamento for confirmado, avisamos por aqui. 🚲",
  pagamento_aprovado: "{{nome}}, pagamento aprovado! Seu pedido #{{pedido}} já está em separação.",
  pix_lembrete: "{{nome}}, seu Pix de {{valor}} ainda está aguardando. Copie o código aqui: {{link}}",
  nf_emitida: "Nota fiscal do pedido #{{pedido}} emitida: {{link_nf}}",
  pedido_enviado_rastreio: "Seu pedido #{{pedido}} saiu! Rastreie aqui: {{rastreio}}",
  saiu_entrega: "Hoje é o dia! Seu pedido #{{pedido}} saiu para entrega.",
  pronto_retirada: "{{nome}}, seu pedido #{{pedido}} está pronto para retirada. Traga um documento com foto do titular.",
  troca_status: "Atualização da sua troca {{troca}}: {{status}}.",
  confirma_compra_seguranca: "{{nome}}, para sua segurança: você fez uma compra de {{valor}} na ShopBike? Responda SIM ou NÃO.",
  carrinho_abandonado: "{{nome}}, ficou alguma dúvida sobre {{produto}}? Dá para pagar em até 21x. Seu carrinho: {{link}}",
};

export default function NotificacoesPage() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Para o cliente");
  const [sel, setSel] = useState(eventosNotificacao[0].whatsapp);
  return (
    <>
      <Cabecalho
        titulo="Notificações"
        kpis={[
          { icon: "whatsapp", rotulo: "WhatsApp (mês)", valor: "2.418" },
          { icon: "mail", rotulo: "E-mails (mês)", valor: "1.902" },
          { icon: "eye", rotulo: "Taxa de leitura WhatsApp", valor: "91%" },
        ]}
      />
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>

      {aba === "Para o cliente" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="tabela min-w-[700px]">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Template WhatsApp (NX)</th>
                    <th>E-mail</th>
                    <th>Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosNotificacao.map((e) => (
                    <tr key={e.evento} onClick={() => setSel(e.whatsapp)} className={cn("cursor-pointer", sel === e.whatsapp && "bg-white")}>
                      <td className="font-semibold">{e.evento}</td>
                      <td>
                        <Chip tom="ok">
                          <Icon name="check" className="size-3" /> {e.whatsapp}
                        </Chip>
                      </td>
                      <td onClick={(ev) => ev.stopPropagation()}>
                        <InterruptorLocal inicial={e.email} rotulo={`E-mail: ${e.evento}`} />
                      </td>
                      <td onClick={(ev) => ev.stopPropagation()}>
                        <InterruptorLocal inicial={e.ativo} rotulo={`Ativar ${e.evento}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card titulo="Prévia no WhatsApp">
            <div className="rounded-[22px] bg-[#efe7dd] p-4">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white p-3 text-sm shadow-sm">
                {textos[sel]}
                <p className="mt-1 text-right text-[10px] text-faint">14:02 ✓✓</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              Template <strong>{sel}</strong> aprovado na Meta, enviado pela API da NX. Variáveis entre chaves são preenchidas pelo pedido.
            </p>
          </Card>
        </div>
      )}

      {aba === "Alertas internos" && (
        <Card titulo="Quem recebe o quê" className="max-w-4xl overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
            <table className="tabela min-w-[640px]">
              <thead>
                <tr>
                  <th>Alerta</th>
                  <th>Para</th>
                  <th>Canal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Novo pedido pago", "Operação/expedição", "Painel + WhatsApp do grupo"],
                  ["Pedido em análise no antifraude", "Analista de risco", "Painel + WhatsApp"],
                  ["Integração Bruning parada há 30 min", "Administrador + NX", "WhatsApp"],
                  ["Estoque baixo (≤ 1 unidade)", "Cadastro/catálogo", "Painel"],
                  ["Site fora do ar", "NX (suporte)", "WhatsApp + e-mail"],
                  ["Pedido de troca aberto", "Operação/expedição", "Painel"],
                ].map(([a, p, c]) => (
                  <tr key={a}>
                    <td className="font-semibold">{a}</td>
                    <td>{p}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {aba === "Log de envios" && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[720px]">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Evento</th>
                  <th>Canal</th>
                  <th>Destino</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logEnvios.map((l, i) => (
                  <tr key={i}>
                    <td className="tabular">{l.quando}</td>
                    <td className="font-medium">{l.evento}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name={l.canal === "WhatsApp" ? "whatsapp" : "mail"} className="size-4 text-muted" /> {l.canal}
                      </span>
                    </td>
                    <td>{l.destino}</td>
                    <td>
                      <Chip tom={l.status === "Falhou" ? "red" : l.status === "Respondeu" ? "warn" : "ok"}>{l.status}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
