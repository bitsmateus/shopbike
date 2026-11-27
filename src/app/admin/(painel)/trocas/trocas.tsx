"use client";

import { useState } from "react";
import { motivosTroca, trocas as iniciais, type Troca } from "@/mock/painel";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, Gaveta, useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, SelectPainel, type Tom } from "@/ui/painel/ui";

const fluxo: Troca["status"][] = ["Solicitado", "Aprovado", "Em trânsito", "Recebido", "Concluído"];
const tomStatus: Record<Troca["status"], Tom> = { Solicitado: "warn", Aprovado: "info", "Em trânsito": "info", Recebido: "neutro", Concluído: "ok", Recusado: "apagado" };
const filtros = ["Abertas", "Todas", "Concluídas"] as const;

export function Trocas() {
  const [lista, setLista] = useState(iniciais);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Abertas");
  const [aberta, setAberta] = useState<Troca | null>(null);
  const { avisar, aviso } = useAviso();
  const fechada = (t: Troca) => t.status === "Concluído" || t.status === "Recusado";
  const vis = lista.filter((t) => (filtro === "Todas" ? true : filtro === "Abertas" ? !fechada(t) : fechada(t)));
  const max = Math.max(...motivosTroca.map((m) => m.qtd));

  const avancar = (t: Troca) => {
    const i = fluxo.indexOf(t.status);
    const novo = { ...t, status: fluxo[Math.min(i + 1, fluxo.length - 1)], reversa: t.reversa ?? (i === 0 ? "LR88204" + t.id.slice(-4) + "BR" : undefined) };
    setLista(lista.map((x) => (x.id === t.id ? novo : x)));
    setAberta(novo);
    avisar(`${t.id}: ${novo.status.toLowerCase()} · cliente avisado no WhatsApp`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Abas abas={filtros} ativa={filtro} onChange={setFiltro} />
          <span className="flex-1" />
          <Botao tom="ink">
            <Icon name="plus" className="size-4" /> Abrir troca pelo painel
          </Botao>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[880px]">
              <thead>
                <tr>
                  <th>Troca</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Motivo</th>
                  <th>Resolução</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vis.map((t) => (
                  <tr key={t.id} onClick={() => setAberta(t)} className="cursor-pointer">
                    <td>
                      <span className="font-bold">{t.id}</span>
                      <span className="block text-xs text-muted">
                        pedido #{t.pedido} · {t.aberto}
                      </span>
                    </td>
                    <td className="font-medium">{t.cliente}</td>
                    <td className="max-w-[220px] truncate">{t.produto}</td>
                    <td>{t.motivo}</td>
                    <td>
                      <Chip tom={t.tipo === "Devolução" ? "red" : "neutro"}>{t.tipo}</Chip> <span className="text-xs text-muted">{t.resolucao}</span>
                    </td>
                    <td>
                      <Chip tom={tomStatus[t.status]}>{t.status}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card titulo="Motivos (30 dias)">
          <ul className="space-y-3">
            {motivosTroca.map((m) => (
              <li key={m.motivo}>
                <div className="flex justify-between text-sm">
                  <span>{m.motivo}</span>
                  <span className="font-bold tabular">{m.qtd}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(m.qtd / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-snow p-3 text-xs text-muted">
            “Tamanho não serviu” lidera. A calculadora de tamanho de quadro (Fase 2) deve reduzir esse número.
          </p>
        </Card>
        <Card titulo="Mais trocados">
          <ol className="space-y-2 text-sm">
            {[
              ["Camisa ShopBike Team", 6],
              ["Capacete Align II", 4],
              ["Bermuda Absolute Pro", 3],
            ].map(([n, q], i) => (
              <li key={n as string} className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-white text-xs font-bold ring-1 ring-black/5">{i + 1}</span>
                <span className="flex-1">{n}</span>
                <span className="font-semibold tabular">{q}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {aberta && (
        <Gaveta
          titulo={`${aberta.id} · ${aberta.tipo}`}
          sub={
            <>
              Pedido #{aberta.pedido} · {aberta.cliente} · aberto {aberta.aberto}
            </>
          }
          fechar={() => setAberta(null)}
          rodape={
            !fechada(aberta) && (
              <>
                <Botao
                  tom="ghost"
                  className="text-red"
                  onClick={() => {
                    setLista(lista.map((x) => (x.id === aberta.id ? { ...x, status: "Recusado" } : x)));
                    setAberta(null);
                    avisar(`${aberta.id} recusada`);
                  }}
                >
                  Recusar
                </Botao>
                <Botao tom="ink" onClick={() => avancar(aberta)}>
                  {aberta.status === "Solicitado" ? "Aprovar e gerar etiqueta reversa" : aberta.status === "Recebido" ? "Concluir" : `Marcar como ${fluxo[fluxo.indexOf(aberta.status) + 1]?.toLowerCase()}`}
                </Botao>
              </>
            )
          }
        >
          <ol className="mb-6 flex items-center">
            {fluxo.map((s, i) => {
              const feito = fluxo.indexOf(aberta.status) >= i && aberta.status !== "Recusado";
              return (
                <li key={s} className="flex flex-1 items-center last:flex-none">
                  <span className="flex flex-col items-center gap-1">
                    <span className={cn("grid size-8 place-items-center rounded-full text-xs font-bold", feito ? "bg-ink text-white" : "bg-white text-faint ring-1 ring-black/10")}>
                      {feito ? <Icon name="check" className="size-4" /> : i + 1}
                    </span>
                    <span className="text-[11px] whitespace-nowrap text-muted">{s}</span>
                  </span>
                  {i < fluxo.length - 1 && <span className={cn("mx-1 mb-5 h-0.5 flex-1 rounded", feito ? "bg-ink" : "bg-black/10")} />}
                </li>
              );
            })}
          </ol>
          <dl className="space-y-3 text-sm">
            {[
              ["Produto", aberta.produto],
              ["Motivo", aberta.motivo],
              ["Valor", reais(aberta.valor)],
              ["Etiqueta reversa", aberta.reversa ?? "Gerada ao aprovar"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-black/5 pb-2">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-2xl bg-snow text-xs text-faint">
                <Icon name="eye" className="size-5" />
                Foto {i}
              </div>
            ))}
          </div>
          <div className="mt-5">
            <SelectPainel label="Resolução" opcoes={["Troca por outro tamanho", "Vale-compra", "Estorno", "A definir"]} defaultValue={aberta.resolucao} />
          </div>
          <p className="mt-3 text-xs text-muted">Estorno no cartão volta pela Rede; no Pix, pela chave do comprador. A ação fica registrada na auditoria.</p>
        </Gaveta>
      )}
      {aviso}
    </div>
  );
}
