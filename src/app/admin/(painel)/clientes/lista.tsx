"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { clientes } from "@/mock/painel";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas } from "@/ui/painel/controles";
import { Botao, Card, Chip } from "@/ui/painel/ui";

const grupos = ["Todos", "Varejo", "Ciclista frequente", "Equipe de pedal", "Lojista (B2B)"] as const;

export function ListaClientes() {
  const [q, setQ] = useState("");
  const [grupo, setGrupo] = useState<(typeof grupos)[number]>("Todos");
  const lista = useMemo(
    () => clientes.filter((c) => (grupo === "Todos" || c.grupo === grupo) && (!q || `${c.nome} ${c.email} ${c.doc} ${c.cidade} ${c.tel}`.toLowerCase().includes(q.toLowerCase()))),
    [q, grupo],
  );
  const contagem = Object.fromEntries(grupos.map((g) => [g, g === "Todos" ? clientes.length : clientes.filter((c) => c.grupo === g).length]));

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Abas abas={grupos} ativa={grupo} onChange={setGrupo} contagem={contagem} />
        <span className="flex-1" />
        <Botao tom="ghost">
          <Icon name="arrowDown" className="size-4" /> Exportar
        </Botao>
        <Botao tom="ink">
          <Icon name="plus" className="size-4" /> Novo cliente
        </Botao>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-black/5 p-3">
          <label className="flex h-10 items-center gap-2 rounded-full bg-snow px-4 campo">
            <Icon name="search" className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, CPF/CNPJ, e-mail, telefone ou cidade" className="flex-1 bg-transparent text-sm outline-none" aria-label="Buscar clientes" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[980px]">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Cidade</th>
                <th>Grupo</th>
                <th className="text-right">Pedidos</th>
                <th className="text-right">Total gasto</th>
                <th>Última compra</th>
                <th>Marketing</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/clientes/${c.id}`} className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                        {c.nome
                          .split(" ")
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")}
                      </span>
                      <span>
                        <span className="block font-semibold hover:underline">{c.nome}</span>
                        <span className="text-xs text-muted">
                          {c.tipo} · {c.doc}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="block">{c.tel}</span>
                    <span className="text-xs text-muted">{c.email}</span>
                  </td>
                  <td>
                    {c.cidade}/{c.uf}
                  </td>
                  <td>
                    <Chip tom={c.grupo === "Lojista (B2B)" ? "ink" : "neutro"}>{c.grupo}</Chip>
                  </td>
                  <td className="text-right tabular">{c.pedidos}</td>
                  <td className="text-right font-semibold tabular">{reais(c.totalGasto)}</td>
                  <td className="tabular">{c.ultimaCompra}</td>
                  <td>{c.marketing ? <Chip tom="ok">Aceita</Chip> : <Chip tom="apagado">Não aceita</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 px-5 py-3 text-xs text-muted">Amostra de 10 clientes. Os cadastros e pedidos da Climba entram na migração.</p>
      </Card>
    </>
  );
}
