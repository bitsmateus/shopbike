import type { Metadata } from "next";
import { recuperacoes, type Recuperacao } from "@/mock/painel";
import { cn, reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Cabecalho, Card, Chip, type Tom } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Recuperação de vendas" };

const tom: Record<Recuperacao["etapa"], Tom> = { Aguardando: "neutro", "Mensagem enviada": "info", Lida: "info", "Respondeu · com vendedor": "warn", Recuperado: "ok", Perdido: "apagado" };

export default function RecuperacaoPage() {
  return (
    <>
      <Cabecalho
        titulo="Recuperação de vendas"
        kpis={[
          { icon: "cart", rotulo: "Carrinhos abandonados (mês)", valor: "312" },
          { icon: "check", rotulo: "Recuperados", valor: "41 · 13%" },
          { icon: "chart", rotulo: "Valor recuperado", valor: reaisCurto(9_480_000) },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card titulo="Em andamento" className="overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
            <table className="tabela min-w-[760px]">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th className="text-right">Valor</th>
                  <th>Quando</th>
                  <th>Etapa</th>
                </tr>
              </thead>
              <tbody>
                {recuperacoes.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Chip tom={r.tipo === "Pix" ? "ok" : "neutro"}>
                        <Icon name={r.tipo === "Pix" ? "pix" : "cart"} className="size-3" /> {r.tipo === "Pix" ? "Pix não pago" : "Carrinho"}
                      </Chip>
                    </td>
                    <td className="font-semibold">{r.cliente}</td>
                    <td className="max-w-[220px] truncate">{r.itens}</td>
                    <td className="text-right font-semibold tabular">{reais(r.valor)}</td>
                    <td className="text-muted">{r.quando}</td>
                    <td>
                      <Chip tom={tom[r.etapa]}>{r.etapa}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-4">
          <Card titulo="Régua de mensagens">
            <ol className="relative space-y-4 border-l border-black/10 pl-5 text-sm">
              {[
                ["15 min", "Pix gerado e não pago", "Lembrete com o copia e cola"],
                ["30 min", "Carrinho abandonado", "“Ficou alguma dúvida?” + link do carrinho"],
                ["24 h", "Carrinho abandonado", "Lembrete + parcelamento em 21x"],
                ["Resposta", "Cliente respondeu", "Conversa cai para um vendedor na NX"],
              ].map(([q, ev, msg]) => (
                <li key={q + ev} className="relative">
                  <span className="absolute top-1 -left-[25px] size-2.5 rounded-full bg-red ring-4 ring-white" />
                  <p className="font-semibold">
                    {q} · {ev}
                  </p>
                  <p className="text-muted">{msg}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">Só para quem aceitou contato no WhatsApp. Substitui o CartStack.</p>
          </Card>
          <Card titulo="Funil (30 dias)">
            <ul className="space-y-2.5 text-sm">
              {[
                ["Abandonos", 312],
                ["Mensagem enviada", 268],
                ["Lida", 201],
                ["Respondeu", 74],
                ["Recuperado", 41],
              ].map(([k, v]) => (
                <li key={k as string}>
                  <div className="flex justify-between">
                    <span>{k}</span>
                    <span className="font-bold tabular">{v}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-black/5">
                    <div className={cn("h-full rounded-full", k === "Recuperado" ? "bg-ok" : "bg-ink")} style={{ width: `${((v as number) / 312) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
