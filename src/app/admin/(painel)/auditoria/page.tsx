"use client";

import { useState } from "react";
import { acessos, auditoria } from "@/mock/painel";
import { Icon } from "@/ui/icons";
import { Abas } from "@/ui/painel/controles";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

const abas = ["Ações sensíveis", "Acessos ao painel"] as const;

export default function AuditoriaPage() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Ações sensíveis");
  const [q, setQ] = useState("");
  const lista = auditoria.filter((a) => !q || `${a.quem} ${a.acao} ${a.alvo} ${a.detalhe}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Cabecalho
        titulo="Auditoria"
        kpis={[
          { icon: "doc", rotulo: "Ações registradas (7d)", valor: "1.284" },
          { icon: "alert", rotulo: "Logins bloqueados (7d)", valor: "3" },
          { icon: "clock", rotulo: "Guardado por", valor: "5 anos" },
        ]}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
        <span className="flex-1" />
        <label className="glass flex h-11 min-w-[260px] items-center gap-2 rounded-full px-4">
          <Icon name="search" className="size-4 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pessoa, ação, pedido ou produto" className="flex-1 bg-transparent text-sm outline-none" aria-label="Buscar na auditoria" />
        </label>
        <Botao tom="ghost">
          <Icon name="arrowDown" className="size-4" /> Exportar
        </Botao>
      </div>

      {aba === "Ações sensíveis" && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[960px]">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Quem</th>
                  <th>Ação</th>
                  <th>Onde</th>
                  <th>Detalhe (antes → depois)</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((a) => (
                  <tr key={a.quando + a.acao}>
                    <td className="tabular">{a.quando}</td>
                    <td className="font-semibold">{a.quem}</td>
                    <td>
                      <Chip tom={a.acao.includes("Estorn") || a.acao.includes("Desativ") || a.acao.includes("bloqueio") ? "red" : a.acao.includes("regra") || a.acao.includes("preço") ? "warn" : "neutro"}>{a.acao}</Chip>
                    </td>
                    <td>{a.alvo}</td>
                    <td className="max-w-[280px] text-sm">{a.detalhe}</td>
                    <td className="text-xs text-muted">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {aba === "Acessos ao painel" && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[760px]">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Quem</th>
                  <th>Evento</th>
                  <th>IP</th>
                  <th>Local</th>
                </tr>
              </thead>
              <tbody>
                {acessos.map((a) => (
                  <tr key={a.quando + a.quem}>
                    <td className="tabular">{a.quando}</td>
                    <td className="font-semibold">{a.quem}</td>
                    <td>
                      <Chip tom={a.ok ? (a.evento.includes("sem 2FA") ? "warn" : "ok") : "red"}>{a.evento}</Chip>
                    </td>
                    <td className="text-xs text-muted">{a.ip}</td>
                    <td>{a.local}</td>
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
