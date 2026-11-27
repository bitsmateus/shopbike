"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { leads as iniciais } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, plural } from "@/ui/painel/ui";

/** Leads da semana na base (a lista do protótipo é uma amostra). */
const TOTAL_SEMANA = 148;

export function ListaLeads() {
  const [lista, setLista] = useState(iniciais.map((l) => ({ ...l })));
  const [q, setQ] = useState("");
  const [origem, setOrigem] = useState("Todas");
  const [interesse, setInteresse] = useState("Todos");
  const [revelados, setRevelados] = useState<string[]>([]);
  const { avisar, aviso } = useAviso();

  const origens = ["Todas", ...new Set(iniciais.map((l) => l.origem.replace(/ \(.+\)$/, "")))];
  const interesses = ["Todos", ...new Set(iniciais.map((l) => l.interesse).filter((x) => x !== "—"))];
  const vis = useMemo(
    () =>
      lista.filter(
        (l) => (origem === "Todas" || l.origem.startsWith(origem)) && (interesse === "Todos" || l.interesse === interesse) && (!q || `${l.nome} ${l.completo} ${l.origem}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [lista, q, origem, interesse],
  );
  const pendentes = lista.filter((l) => l.crm === "Pendente");
  const filtrando = q || origem !== "Todas" || interesse !== "Todos";

  const revelar = (nome: string) => {
    setRevelados((r) => [...r, nome]);
    avisar(`Contato de ${nome} revelado · registrado na auditoria`);
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-line p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto px-1 text-base font-bold">Captados no site</h2>
          <Botao tom="ghost" onClick={() => avisar("Leads exportados (CSV)")}>
            <Icon name="download" className="size-4" /> Exportar
          </Botao>
          {/* Só aparece com pendentes, e diz quantos */}
          {pendentes.length > 0 && (
            <Botao
              tom="ink"
              onClick={() => {
                setLista((ls) => ls.map((l) => (l.crm === "Pendente" ? { ...l, crm: "Enviado", motivo: undefined } : l)));
                avisar(`${plural(pendentes.length, "lead reenviado", "leads reenviados")} ao CRM NX`);
              }}
            >
              <Icon name="send" className="size-4" /> Reenviar {plural(pendentes.length, "pendente", "pendentes")}
            </Botao>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="campo flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-full px-4">
            <Icon name="search" className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, contato ou origem" className="flex-1 bg-transparent text-sm font-medium" aria-label="Buscar leads" />
          </label>
          <select value={origem} onChange={(e) => setOrigem(e.target.value)} className="campo h-11 rounded-xl px-3 text-sm" aria-label="Origem">
            {origens.map((o) => (
              <option key={o} value={o}>
                {o === "Todas" ? "Todas as origens" : o}
              </option>
            ))}
          </select>
          <select value={interesse} onChange={(e) => setInteresse(e.target.value)} className="campo h-11 rounded-xl px-3 text-sm" aria-label="Interesse">
            {interesses.map((o) => (
              <option key={o} value={o}>
                {o === "Todos" ? "Todos os interesses" : o}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="tabela min-w-[900px]">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Origem</th>
              <th>Interesse</th>
              <th>Quando</th>
              <th>CRM NX</th>
              <th>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vis.map((l) => {
              const visivel = revelados.includes(l.nome);
              const ehTelefone = l.completo.startsWith("(");
              return (
                <tr key={l.nome}>
                  <td className="font-semibold whitespace-nowrap">{l.nome}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 tabular">
                      {visivel ? l.completo : l.contato}
                      {!visivel && (
                        <button onClick={() => revelar(l.nome)} className="grid size-7 place-items-center rounded-full text-muted hover:bg-snow hover:text-ink" aria-label={`Revelar contato de ${l.nome}`} title="Revelar (fica registrado na auditoria)">
                          <Icon name="eye" className="size-4" />
                        </button>
                      )}
                    </span>
                  </td>
                  <td>{l.origem}</td>
                  <td>{l.interesse}</td>
                  <td className="whitespace-nowrap tabular">{l.quando}</td>
                  <td>
                    <Chip tom={l.crm === "Enviado" ? "ok" : "warn"}>{l.crm}</Chip>
                    {"motivo" in l && l.motivo && <span className="mt-0.5 block text-xs text-muted">{l.motivo}</span>}
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      {ehTelefone && (
                        <button onClick={() => avisar(`Conversa com ${l.nome} aberta na NX`)} className="grid size-8 place-items-center rounded-full ring-1 ring-line hover:bg-snow" aria-label={`Conversar com ${l.nome} no WhatsApp`} title="Conversar no WhatsApp">
                          <Icon name="whatsapp" className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => avisar(l.crm === "Enviado" ? `Lead de ${l.nome} aberto no CRM NX` : `${l.nome} ainda não está no CRM: reenvie primeiro`)}
                        className={cn("inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-semibold hover:bg-snow", l.crm !== "Enviado" && "text-faint")}
                      >
                        Abrir no CRM <Icon name="chevronRight" className="size-3.5" />
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {vis.length === 0 && <p className="p-10 text-center text-sm text-muted">Nenhum lead com esses filtros.</p>}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-sm">
        <span className="text-muted tabular">
          {vis.length ? `1–${vis.length}` : "0"} de {filtrando ? vis.length : TOTAL_SEMANA}
        </span>
        <span className="flex gap-1.5">
          <Botao tom="ghost" tamanho="card" disabled aria-label="Página anterior">
            <Icon name="chevronLeft" className="size-4" /> Anterior
          </Botao>
          <Botao tom="ghost" tamanho="card" disabled={!!filtrando} onClick={() => avisar("Próxima página: a lista completa vem do servidor na Etapa 1")} aria-label="Próxima página">
            Próxima <Icon name="chevronRight" className="size-4" />
          </Botao>
        </span>
      </div>
      {aviso}
    </Card>
  );
}

/** Configuração do pop-up de captação, com prévia como o cliente vê. */
export function CardPopup() {
  return (
    <Card
      titulo="Pop-up de captação"
      ferramentas={
        <Link href="/admin/vitrine" className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-sm font-semibold ring-1 ring-black/10 hover:bg-snow">
          Editar pop-up
        </Link>
      }
    >
      <div className="rounded-[var(--radius-tile)] bg-white p-4 ring-1 ring-line">
        <p className="text-xs font-semibold text-faint">Prévia</p>
        <p className="mt-2 text-lg leading-tight font-bold">Ganhe 5% na primeira compra</p>
        <p className="mt-1 text-sm text-muted">Deixe seu WhatsApp e receba ofertas de bikes e peças.</p>
        <div className="mt-3 flex h-10 items-center rounded-xl border border-borda-campo px-3 text-sm text-faint" aria-hidden>
          Seu WhatsApp
        </div>
        {/* botão da loja: vermelho da marca é o CTA primário do site */}
        <div className="mt-2 grid h-10 place-items-center rounded-full bg-red text-sm font-semibold text-white" aria-hidden>
          Quero meu cupom
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-[140px_1fr] gap-x-3 gap-y-2 text-sm">
        {[
          ["Aparece após", "20 segundos"],
          ["Frequência", "1 vez a cada 7 dias"],
          ["Cupom", "PRIMEIRA"],
          ["Conversão do pop-up", "3,4%"],
        ].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
