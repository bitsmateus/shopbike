import type { Metadata } from "next";
import { integracaoLog } from "@/mock/operacao";
import { tokensApi } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "@/ui/icons";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Integrações" };

const servicos: { nome: string; uso: string; status: "ok" | "aviso" | "pendente"; detalhe: string; icon: IconName }[] = [
  { nome: "ERP Bruning", uso: "Produtos, estoque, preços, pedidos e NF", status: "aviso", detalhe: "1 erro na última hora", icon: "sync" },
  { nome: "e.Rede", uso: "Cartão até 21x, 3DS", status: "ok", detalhe: "Sandbox · token válido", icon: "card" },
  { nome: "Pix", uso: "QR dinâmico e baixa automática", status: "pendente", detalhe: "Provedor a definir", icon: "pix" },
  { nome: "Correios", uso: "Preço, prazo, etiqueta e rastreio", status: "pendente", detalhe: "Aguardando credenciais do contrato", icon: "truck" },
  { nome: "NX · WhatsApp oficial", uso: "Notificações e recuperação", status: "ok", detalhe: "8 templates aprovados", icon: "whatsapp" },
  { nome: "Agente de IA (n8n)", uso: "Catálogo e status de pedido", status: "ok", detalhe: "312 consultas hoje", icon: "users" },
];

const tom = { ok: "bg-ok", aviso: "bg-[#e7a33e]", pendente: "bg-line-2" } as const;

export default function IntegracoesPage() {
  return (
    <>
      <Cabecalho
        titulo="Integrações"
        kpis={[
          { icon: "sync", rotulo: "Última sincronização", valor: "13:58" },
          { icon: "box", rotulo: "SKUs atualizados hoje", valor: "1.284" },
          { icon: "alert", rotulo: "Erros (24 h)", valor: "1" },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {servicos.map((s) => (
          <Card key={s.nome} className="p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/5">
                <Icon name={s.icon} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{s.nome}</span>
                  <span className={cn("size-2 rounded-full", tom[s.status])} />
                </div>
                <p className="text-sm text-muted">{s.uso}</p>
                <p className="mt-1.5 text-xs font-semibold">{s.detalhe}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card titulo="Log da integração Bruning" className="mt-4 overflow-hidden" ferramentas={<Botao tom="ghost">Exportar</Botao>}>
        <p className="-mt-2 mb-4 text-sm text-muted">
          A Bruning chama a API compatível com a Climba V1 (<code className="rounded bg-white px-1.5 py-0.5 text-xs">/api/v1</code>, cabeçalho <code className="rounded bg-white px-1.5 py-0.5 text-xs">x-idcommerce-api-token</code>). Do lado dela,
          muda só a URL e o token.
        </p>
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-y border-black/5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                <th className="py-3 pl-5">Quando</th>
                <th>Origem</th>
                <th>Chamada</th>
                <th>Resultado</th>
                <th className="pr-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {integracaoLog.map((l, i) => (
                <tr key={i} className={cn("border-b border-black/5 last:border-0", l.resultado === "erro" && "bg-danger-50/60")}>
                  <td className="py-3 pl-5 tabular">{l.quando}</td>
                  <td>{l.origem}</td>
                  <td>
                    <code className="text-xs">{l.endpoint}</code>
                  </td>
                  <td>
                    <span className={cn("inline-flex items-center gap-1.5", l.resultado === "erro" ? "font-semibold text-danger" : "text-ink-2")}>
                      <Icon name={l.resultado === "erro" ? "alert" : "check"} className="size-4" />
                      {l.detalhe}
                    </span>
                  </td>
                  <td className="pr-5 text-right">{l.resultado === "erro" && <Botao tom="ink">Reprocessar</Botao>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card titulo="Tokens de API" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Novo token</Botao>} className="overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
            <table className="tabela min-w-[720px]">
              <thead>
                <tr>
                  <th>Integração</th>
                  <th>Pode acessar</th>
                  <th>Limite</th>
                  <th>Último uso</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tokensApi.map((t) => (
                  <tr key={t.nome}>
                    <td>
                      <span className="block font-semibold">{t.nome}</span>
                      <span className="font-mono text-xs text-muted">sb_live_••••••••{t.nome.length}f2</span>
                    </td>
                    <td className="max-w-[260px] text-sm">{t.escopo}</td>
                    <td>
                      <Chip>{t.limite}</Chip>
                    </td>
                    <td className="text-sm">{t.ultimoUso}</td>
                    <td className="text-right">
                      <button className="text-sm font-semibold text-danger">Revogar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">O token aparece uma única vez, na criação. Cada chamada fica no log com data, rota e resultado.</p>
        </Card>
        <Card titulo="API para a IA de vendas">
          <ul className="space-y-2 font-mono text-xs">
            {[
              ["GET", "/api/ia/produtos?q=mtb aro 29&max=5000"],
              ["GET", "/api/ia/produtos/{slug}"],
              ["GET", "/api/ia/pedidos/{numero}?cpf=…"],
              ["POST", "/api/ia/links (com aprovação do vendedor)"],
            ].map(([m, r]) => (
              <li key={r} className="tile flex items-center gap-2 p-2.5">
                <span className={cn("rounded-md px-1.5 py-0.5 font-bold", m === "GET" ? "bg-ok-50 text-ok" : "bg-info-50 text-info")}>{m}</span>
                {r}
              </li>
            ))}
          </ul>
          <Botao tom="ghost" className="mt-3">
            <Icon name="doc" className="size-4" /> Documentação (OpenAPI)
          </Botao>
        </Card>
      </div>
    </>
  );
}
