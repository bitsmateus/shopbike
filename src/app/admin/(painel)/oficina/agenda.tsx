"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "@/ui/icons";
import { Gaveta } from "@/ui/painel/controles";
import { Botao, Card, Chip } from "@/ui/painel/ui";

import { ABRE, AGORA, FECHA, HOJE, PX_MIN, agenda, dias, lembretes, servicos, type Agendamento, type Origem } from "./dados";

const iconeOrigem: Record<Origem, IconName> = { Site: "device", WhatsApp: "whatsapp", Loja: "store" };
const minutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
const hora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const duracao = (a: Agendamento) => servicos.find((s) => s.nome === a.servico)!.min * (a.qtd ?? 1);
const fmtDuracao = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`);
const fmtPreco = (c: number) => (c === 0 ? "Cortesia" : `R$ ${(c / 100).toLocaleString("pt-BR")}`);

export function AgendaOficina() {
  const [aberto, setAberto] = useState<Agendamento | null>(null);
  const altura = (FECHA - ABRE) * PX_MIN;
  const horasGrade = Array.from({ length: (FECHA - ABRE) / 60 }, (_, i) => ABRE + i * 60);

  return (
    <Card
      titulo="Agenda · 23 a 28 de novembro"
      className="min-w-0"
      ferramentas={
        <Botao tom="ink">
          <Icon name="plus" className="size-4" /> Agendar
        </Botao>
      }
    >
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[52px_repeat(6,1fr)] gap-1.5">
            <span />
            {dias.map((d) => (
              <span key={d} className={cn("rounded-full py-1.5 text-center text-sm font-semibold", d === HOJE ? "bg-ink text-white" : "text-ink-2")}>
                {d}
                {d === HOJE && <span className="sr-only"> (hoje)</span>}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[52px_repeat(6,1fr)] gap-1.5">
            {/* régua de horas */}
            <div className="relative" style={{ height: altura }}>
              {horasGrade.map((m) => (
                <span key={m} className="absolute right-1 -translate-y-1/2 text-xs text-muted tabular" style={{ top: (m - ABRE) * PX_MIN }}>
                  {hora(m)}
                </span>
              ))}
            </div>
            {dias.map((d) => (
              <div key={d} className={cn("relative rounded-[var(--radius-tile)]", d === HOJE && "bg-snow")} style={{ height: altura }}>
                {/* linhas de hora e espaço livre: só aparece "+ Agendar" no hover */}
                {horasGrade.map((m) => (
                  <button
                    key={m}
                    className="group absolute inset-x-0 border-t border-cloud text-left"
                    style={{ top: (m - ABRE) * PX_MIN, height: 60 * PX_MIN }}
                    aria-label={`Agendar ${d}, ${hora(m)}`}
                  >
                    <span className="px-2 text-xs font-medium text-muted opacity-0 group-hover:opacity-100">+ Agendar</span>
                  </button>
                ))}
                {d === HOJE && (
                  <span className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-ink" style={{ top: (minutos(AGORA) - ABRE) * PX_MIN }} aria-label={`Agora, ${AGORA}`}>
                    <span className="absolute -top-1 -left-1 size-2.5 rounded-full bg-ink" />
                  </span>
                )}
                {agenda
                  .filter((a) => a.dia === d)
                  .map((a) => {
                    const ini = minutos(a.inicio);
                    const dur = duracao(a);
                    const h = dur * PX_MIN;
                    const curto = h < 60;
                    return (
                      <button
                        key={a.cliente + a.inicio}
                        data-leitura
                        onClick={() => setAberto(a)}
                        className={cn(
                          "absolute inset-x-1 overflow-hidden rounded-lg px-2 py-1 text-left text-xs ring-1 transition hover:shadow-[var(--shadow-soft)]",
                          a.confirmado ? "bg-white ring-line hover:ring-ink" : "bg-warn-50 ring-warn/30 hover:ring-warn",
                        )}
                        style={{ top: (ini - ABRE) * PX_MIN + 1, height: h - 2 }}
                        title={`${a.cliente} · ${a.servico} · ${a.inicio}–${hora(ini + dur)}`}
                      >
                        <span className="block truncate text-[13px] font-semibold text-ink">{a.cliente}</span>
                        {/* bloco curto e não confirmado: a situação vem antes da hora, para não ser cortada */}
                        {curto && !a.confirmado ? (
                          <span className="block truncate text-muted tabular">
                            <span className="font-semibold text-warn">A confirmar</span> · {a.inicio}
                          </span>
                        ) : (
                          <span className="block truncate text-muted tabular">
                            {a.inicio}–{hora(ini + dur)}
                            {curto && ` · ${a.servico}`}
                          </span>
                        )}
                        {!curto && (
                          <>
                            <span className="block truncate text-ink-2">
                              {a.servico}
                              {a.qtd ? ` (${a.qtd} bikes)` : ""}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1 text-faint">
                              <Icon name={iconeOrigem[a.origem]} className="size-3.5" aria-hidden /> {a.origem}
                              {!a.confirmado && <span className="ml-auto font-semibold text-warn">Não confirmado</span>}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {aberto && (
        <Gaveta
          titulo={aberto.cliente}
          sub={`${aberto.dia.replace(" ", ", ")}/11 · ${aberto.inicio}–${hora(minutos(aberto.inicio) + duracao(aberto))}`}
          fechar={() => setAberto(null)}
          rodape={
            <>
              <Botao tom="ghost" className="text-danger ring-danger/40 hover:bg-danger-50">
                Cancelar agendamento
              </Botao>
              <Botao tom="ghost">Remarcar</Botao>
              {!aberto.confirmado && <Botao>Confirmar</Botao>}
            </>
          }
        >
          <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2.5 text-sm">
            {(
              [
                ["Cliente", aberto.clienteId ? <Link key="c" href={`/admin/clientes/${aberto.clienteId}`} className="font-semibold underline-offset-4 hover:underline">{aberto.cliente}</Link> : aberto.cliente],
                ["Bike", aberto.bike],
                ["Serviço", `${aberto.servico}${aberto.qtd ? ` (${aberto.qtd} bikes)` : ""}`],
                ["Duração", fmtDuracao(duracao(aberto))],
                ["Preço", fmtPreco(servicos.find((s) => s.nome === aberto.servico)!.preco * (aberto.qtd ?? 1))],
                ["Origem", aberto.origem],
                ["Situação", <Chip key="s" tom={aberto.confirmado ? "ok" : "warn"}>{aberto.confirmado ? "Confirmado" : "Não confirmado"}</Chip>],
              ] as [string, React.ReactNode][]
            ).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Gaveta>
      )}
    </Card>
  );
}

export function LembretesRevisao() {
  return (
    <Card titulo="Lembretes de revisão">
      <ul className="space-y-2 text-sm">
        {lembretes.map((l) => (
          <li key={l.cliente} className="tile flex items-center gap-2 p-2.5">
            <span className="min-w-0 flex-1">
              {"clienteId" in l ? (
                <Link href={`/admin/clientes/${l.clienteId}`} className="block truncate font-semibold underline-offset-4 hover:underline">
                  {l.cliente}
                </Link>
              ) : (
                <span className="block truncate font-semibold">{l.cliente}</span>
              )}
              <span className="text-xs text-muted">
                {l.bike} · {l.prazo}
              </span>
            </span>
            {/* "Sem resposta" pede ação: âmbar e Reenviar na linha */}
            <Chip tom={l.status === "Agendou" ? "ok" : l.status === "Enviado" ? "info" : "warn"}>{l.status}</Chip>
            {l.status === "Sem resposta" && (
              <button className="inline-flex h-8 items-center rounded-full px-2.5 text-sm font-semibold hover:bg-white">Reenviar</button>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Enviados pelo WhatsApp oficial 30 e 180 dias depois da compra de bike.</p>
    </Card>
  );
}

export function ServicosPrecos() {
  return (
    <Card titulo="Serviços e preços">
      <ul className="divide-y divide-line text-sm">
        {servicos.map((s) => (
          <li key={s.nome} className="flex items-center gap-3 py-2">
            <span className="flex-1">{s.nome}</span>
            <span className="text-muted tabular">{fmtDuracao(s.min)}</span>
            <strong className="w-20 text-right tabular">{fmtPreco(s.preco)}</strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}

