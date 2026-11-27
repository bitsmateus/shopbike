"use client";

import { useEffect, useState } from "react";
import { motivosTroca, trocas as iniciais, type Troca } from "@/mock/painel";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, Gaveta, useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, SelectPainel, type Tom } from "@/ui/painel/ui";

const fluxo: Troca["status"][] = ["Solicitado", "Aprovado", "Em trânsito", "Recebido", "Concluído"];

/* Status pelo mapa de significado: âmbar = pede ação da loja (aprovar, conferir),
   azul = em andamento, verde = concluído, cinza = recusado. */
const tomStatus: Record<Troca["status"], Tom> = { Solicitado: "warn", Aprovado: "info", "Em trânsito": "info", Recebido: "warn", Concluído: "ok", Recusado: "apagado" };

/* Próxima ação na lista (mesmo estilo de Pedidos): tarefa = botão; espera = texto cinza. */
const proximaAcao: Record<Troca["status"], { texto: string; tarefa: boolean }> = {
  Solicitado: { texto: "Aprovar ou recusar", tarefa: true },
  Aprovado: { texto: "Aguardando envio do cliente", tarefa: false },
  "Em trânsito": { texto: "Aguardando chegada", tarefa: false },
  Recebido: { texto: "Conferir produto", tarefa: true },
  Concluído: { texto: "—", tarefa: false },
  Recusado: { texto: "—", tarefa: false },
};

const filtros = ["Abertas", "Todas", "Concluídas"] as const;

export function Trocas() {
  const [lista, setLista] = useState(iniciais);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Abertas");
  const [aberta, setAberta] = useState<Troca | null>(null);
  const [foto, setFoto] = useState<number | null>(null);
  const { avisar, aviso } = useAviso();
  const fechada = (t: Troca) => t.status === "Concluído" || t.status === "Recusado";
  const vis = lista.filter((t) => (filtro === "Todas" ? true : filtro === "Abertas" ? !fechada(t) : fechada(t)));
  const max = Math.max(...motivosTroca.map((m) => m.qtd));
  const lider = motivosTroca.reduce((a, b) => (b.qtd > a.qtd ? b : a));

  useEffect(() => {
    if (foto == null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setFoto(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [foto]);

  const atualizar = (novo: Troca) => {
    setLista((l) => l.map((x) => (x.id === novo.id ? novo : x)));
    setAberta(novo);
  };

  const avancar = (t: Troca) => {
    const i = fluxo.indexOf(t.status);
    const novo = { ...t, status: fluxo[Math.min(i + 1, fluxo.length - 1)], reversa: t.reversa ?? (i === 0 ? "LR88204" + t.id.slice(-4) + "BR" : undefined) };
    atualizar(novo);
    avisar(`${t.id}: ${novo.status.toLowerCase()} · cliente avisado no WhatsApp`);
  };

  return (
    <div className="grid gap-4 2xl:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Abas abas={filtros} ativa={filtro} onChange={setFiltro} />
          <span className="flex-1" />
          <Botao tom="ink" onClick={() => avisar("Abertura de troca pelo painel: formulário chega na Etapa 1")}>
            <Icon name="plus" className="size-4" /> Abrir troca pelo painel
          </Botao>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[960px]">
              <thead>
                <tr>
                  <th>Troca</th>
                  <th>Cliente</th>
                  <th>Produto e motivo</th>
                  <th>Resolução</th>
                  <th>Status</th>
                  <th>Próxima ação</th>
                </tr>
              </thead>
              <tbody>
                {vis.map((t) => {
                  const acao = proximaAcao[t.status];
                  return (
                    <tr key={t.id} onClick={() => setAberta(t)} className="cursor-pointer">
                      <td className="whitespace-nowrap">
                        <span className="font-semibold">{t.id}</span>
                        <span className="block text-xs text-muted">
                          pedido #{t.pedido} · {t.aberto}
                        </span>
                      </td>
                      <td className="min-w-[160px] font-medium whitespace-nowrap">{t.cliente}</td>
                      <td className="max-w-[260px]">
                        <span className="block truncate font-medium" title={t.produto}>
                          {t.produto}
                        </span>
                        <span className="block truncate text-xs text-muted">{t.motivo}</span>
                      </td>
                      <td className="whitespace-nowrap">
                        {/* Tipo é neutro (com ícone); cor só no status */}
                        <Chip>
                          <Icon name={t.tipo === "Troca" ? "sync" : "devolver"} className="size-3.5" />
                          {t.tipo}
                        </Chip>
                        <span className="mt-0.5 block text-xs text-muted">{t.resolucao}</span>
                      </td>
                      <td>
                        <Chip tom={tomStatus[t.status]}>{t.status}</Chip>
                      </td>
                      <td className="whitespace-nowrap">
                        {acao.tarefa ? (
                          <span className="-ml-2.5 inline-flex h-8 items-center gap-1 rounded-full px-2.5 font-semibold text-ink hover:bg-fundo-painel">
                            {acao.texto} <Icon name="chevronRight" className="size-3.5" />
                          </span>
                        ) : (
                          <span className="text-faint">{acao.texto}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {vis.length === 0 && <p className="p-10 text-center text-sm text-muted">Nenhuma troca neste filtro.</p>}
          </div>
        </Card>
      </div>

      <div className="grid content-start gap-4 md:grid-cols-2 2xl:grid-cols-1">
        <Card titulo="Motivos (30 dias)">
          <ul className="space-y-3">
            {motivosTroca.map((m) => (
              <li key={m.motivo}>
                <div className="flex justify-between text-sm">
                  <span>{m.motivo}</span>
                  <span className="font-semibold tabular">{m.qtd}</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-fundo-painel">
                  <div className={cn("h-full rounded-full", m === lider ? "bg-ink" : "bg-barra")} style={{ width: `${(m.qtd / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[var(--radius-tile)] bg-snow p-3 text-xs text-muted">“{lider.motivo}” é o motivo mais comum nos últimos 30 dias.</p>
        </Card>
        <Card titulo="Mais trocados">
          <ol className="space-y-2 text-sm">
            {[
              ["Camisa ShopBike Team", 6],
              ["Capacete Align II", 4],
              ["Bermuda Absolute Pro", 3],
            ].map(([n, q], i) => (
              <li key={n as string} className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-snow text-xs font-bold ring-1 ring-line">{i + 1}</span>
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
                  className="text-danger ring-danger/30 hover:bg-danger-50"
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
          {/* Etapas: feitas = preto com ✓ · atual = contorno forte · futuras = contorno claro */}
          <ol className="mb-5 flex items-center" aria-label="Etapas da troca">
            {fluxo.map((s, i) => {
              const atual = fluxo.indexOf(aberta.status);
              const feito = aberta.status !== "Recusado" && (i < atual || aberta.status === "Concluído");
              const eAtual = aberta.status !== "Recusado" && aberta.status !== "Concluído" && i === atual;
              return (
                <li key={s} className="flex flex-1 items-center last:flex-none" aria-current={eAtual ? "step" : undefined}>
                  <span className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full text-xs font-bold",
                        feito ? "bg-ink text-white" : eAtual ? "bg-white text-ink ring-2 ring-ink" : "bg-white text-faint ring-1 ring-line-2",
                      )}
                    >
                      {feito ? <Icon name="check" className="size-4" /> : i + 1}
                    </span>
                    <span className={cn("text-xs whitespace-nowrap", eAtual ? "font-semibold text-ink" : "text-muted")}>{s}</span>
                  </span>
                  {i < fluxo.length - 1 && <span className={cn("mx-1 mb-5 h-0.5 flex-1 rounded", feito ? "bg-ink" : "bg-line")} />}
                </li>
              );
            })}
          </ol>

          {/* Rótulo e valor próximos: grade 140px + resto */}
          <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2.5 text-sm">
            {[
              ["Produto", aberta.produto],
              ["Motivo", aberta.motivo],
              ["Valor", reais(aberta.valor)],
              ["Etiqueta reversa", aberta.reversa ?? "Gerada ao aprovar"],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 mb-2 text-sm font-medium">Fotos enviadas pelo cliente</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setFoto(i)}
                className="grid size-24 place-items-center rounded-[var(--radius-tile)] bg-snow text-xs text-faint ring-1 ring-line hover:ring-ink"
                aria-label={`Ver foto ${i} em tela cheia`}
              >
                <span className="grid justify-items-center gap-1">
                  <Icon name="eye" className="size-5" />
                  Foto {i}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <SelectPainel
              label="Resolução"
              opcoes={["Troca por outro tamanho", "Vale-compra", "Estorno", "A definir"]}
              value={aberta.resolucao}
              onChange={(e) => atualizar({ ...aberta, resolucao: e.target.value as Troca["resolucao"] })}
            />
          </div>
          {aberta.resolucao === "Estorno" && <p className="mt-3 text-xs text-muted">Estorno no cartão volta pela Rede; no Pix, pela chave do comprador. A ação fica registrada na auditoria.</p>}
        </Gaveta>
      )}

      {foto != null && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/80 p-6" role="dialog" aria-modal aria-label={`Foto ${foto}`} onClick={() => setFoto(null)}>
          <div className="grid aspect-[4/3] w-full max-w-3xl place-items-center rounded-[var(--radius-card)] bg-snow text-faint">
            <span className="grid justify-items-center gap-2">
              <Icon name="eye" className="size-8" />
              Foto {foto} (no protótipo, sem imagem real)
            </span>
          </div>
          <button onClick={() => setFoto(null)} className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white" aria-label="Fechar foto">
            <Icon name="close" />
          </button>
        </div>
      )}
      {aviso}
    </div>
  );
}
