"use client";

import { useState } from "react";
import { cupons as iniciais, type Cupom } from "@/mock/painel";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Gaveta, Interruptor, InterruptorLocal, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const valorCupom = (c: Cupom) => (c.tipo === "%" ? `${c.valor}%` : c.tipo === "R$" ? reais(c.valor) : "Frete grátis");

export function Cupons() {
  const [lista, setLista] = useState(iniciais);
  const [editando, setEditando] = useState<Cupom | "novo" | null>(null);
  const { avisar, aviso } = useAviso();
  const c = editando === "novo" ? null : editando;

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Botao tom="ink" onClick={() => setEditando("novo")}>
          <Icon name="plus" className="size-4" /> Novo cupom
        </Botao>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="tabela min-w-[980px]">
            <thead>
              <tr>
                <th>Código</th>
                <th>Desconto</th>
                <th>Regra</th>
                <th className="text-right">Mínimo</th>
                <th>Usos</th>
                <th>Validade</th>
                <th>Ativo</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((x) => (
                <tr key={x.codigo} onClick={() => setEditando(x)} className="cursor-pointer">
                  <td>
                    <span className="rounded-lg bg-ink px-2 py-1 font-mono text-xs font-bold text-white">{x.codigo}</span>
                    <span className="mt-1 block text-xs text-muted">{x.descricao}</span>
                  </td>
                  <td className="font-bold">{valorCupom(x)}</td>
                  <td className="max-w-[240px] text-sm">
                    {x.regra} {x.automatico && <Chip tom="info">Automático</Chip>}
                  </td>
                  <td className="text-right tabular">{x.minimo ? reais(x.minimo) : "—"}</td>
                  <td className="w-40">
                    <span className="text-sm tabular">
                      {x.usos}
                      {x.limite ? ` / ${x.limite}` : ""}
                    </span>
                    {x.limite && (
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5">
                        <div className="h-full rounded-full bg-red" style={{ width: `${(x.usos / x.limite) * 100}%` }} />
                      </div>
                    )}
                  </td>
                  <td className="tabular">{x.validade}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Interruptor
                      ligado={x.ativo}
                      rotulo={`Ativar ${x.codigo}`}
                      onChange={(v) => {
                        setLista(lista.map((y) => (y.codigo === x.codigo ? { ...y, ativo: v } : y)));
                        avisar(`${x.codigo} ${v ? "ativado" : "pausado"}`);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editando && (
        <Gaveta
          titulo={c ? `Cupom ${c.codigo}` : "Novo cupom"}
          sub={c ? `${c.usos} usos · ${c.descricao}` : "Defina o código, o desconto e as regras."}
          fechar={() => setEditando(null)}
          rodape={
            <>
              <Botao tom="ghost" onClick={() => setEditando(null)}>
                Cancelar
              </Botao>
              <Botao
                tom="ink"
                onClick={() => {
                  setEditando(null);
                  avisar("Cupom salvo");
                }}
              >
                Salvar cupom
              </Botao>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CampoPainel label="Código" defaultValue={c?.codigo ?? ""} placeholder="EX.: NATAL10" />
            <CampoPainel label="Descrição interna" defaultValue={c?.descricao ?? ""} />
            <SelectPainel label="Tipo de desconto" opcoes={["%", "R$", "Frete grátis"]} defaultValue={c?.tipo} />
            <CampoPainel label="Valor" defaultValue={c ? String(c.tipo === "R$" ? c.valor / 100 : c.valor) : ""} />
            <SelectPainel label="Vale para" opcoes={["Todo o site", "Categoria", "Marca", "Produtos específicos", "Faixa de CEP"]} />
            <CampoPainel label="Pedido mínimo" defaultValue={c?.minimo ? reais(c.minimo) : ""} placeholder="R$ 0,00" />
            <CampoPainel label="Limite total de usos" defaultValue={c?.limite ? String(c.limite) : ""} placeholder="Sem limite" />
            <CampoPainel label="Usos por cliente (CPF)" defaultValue="1" />
            <CampoPainel label="Início" type="date" defaultValue="2026-11-20" />
            <CampoPainel label="Fim" type="date" defaultValue="2026-11-30" />
          </div>
          <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-black/5">
            {[
              ["Automático (aplica sem digitar)", c?.automatico ?? false],
              ["Só na primeira compra", c?.codigo === "PRIMEIRA"],
              ["Acumula com desconto do Pix", false],
              ["Atribui a venda a um vendedor", c?.codigo === "DIEGO10"],
            ].map(([t, v]) => (
              <label key={t as string} className="flex items-center justify-between gap-3">
                {t}
                <InterruptorLocal inicial={v as boolean} rotulo={t as string} />
              </label>
            ))}
          </div>
        </Gaveta>
      )}
      {aviso}
    </>
  );
}
