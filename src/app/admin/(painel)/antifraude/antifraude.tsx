"use client";

import { useMemo, useState } from "react";
import { calcularNota, REGRAS_PADRAO, type RegraRisco } from "@/modules/antifraude/nota";
import { filaRevisao, listaBloqueio as bloqueioInicial, pedidos, resumoAntifraude } from "@/mock/operacao";
import { cn, reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { AnaliseRisco } from "@/ui/painel/pedido-drawer";
import { Botao, Card, NotaRisco } from "@/ui/painel/ui";

const abas = ["Fila de revisão", "Regras", "Lista de bloqueio", "Chargebacks", "Relatório"] as const;

export function Antifraude({ inicial }: { inicial?: string }) {
  const [aba, setAba] = useState<(typeof abas)[number]>("Fila de revisão");
  return (
    <>
      <div className="glass scrollbar-none mb-3 inline-flex max-w-full overflow-x-auto rounded-full p-1" role="tablist">
        {abas.map((a) => (
          <button key={a} role="tab" aria-selected={aba === a} onClick={() => setAba(a)} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition", aba === a ? "bg-ink text-white" : "text-ink-2 hover:bg-snow")}>
            {a}
            {a === "Fila de revisão" && <span className="ml-2 rounded-full bg-red px-1.5 py-0.5 text-[11px] text-white">{filaRevisao.length}</span>}
          </button>
        ))}
      </div>
      {aba === "Fila de revisão" && <Fila inicial={inicial} />}
      {aba === "Regras" && <Regras />}
      {aba === "Lista de bloqueio" && <Bloqueio />}
      {aba === "Chargebacks" && <Chargebacks />}
      {aba === "Relatório" && <Relatorio />}
    </>
  );
}

function Fila({ inicial }: { inicial?: string }) {
  const [fila, setFila] = useState(filaRevisao);
  const [selecionado, setSelecionado] = useState(inicial && fila.some((p) => p.numero === inicial) ? inicial : fila[0]?.numero);
  const [aviso, setAviso] = useState("");
  const p = fila.find((x) => x.numero === selecionado);
  const bloqueado = pedidos.find((x) => x.status === "Bloqueado")!;

  const decidir = (texto: string) => {
    if (!p) return;
    const resto = fila.filter((x) => x.numero !== p.numero);
    setFila(resto);
    setSelecionado(resto[0]?.numero);
    setAviso(`Pedido #${p.numero}: ${texto}. Registrado na auditoria.`);
    setTimeout(() => setAviso(""), 3500);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <div className="space-y-3">
        <Card titulo="Aguardando decisão" className="p-4">
          {fila.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              <Icon name="check" className="mx-auto mb-2 size-8 text-ok" />
              Fila zerada.
            </div>
          ) : (
            <ul className="space-y-2">
              {fila.map((x) => (
                <li key={x.numero}>
                  <button
                    onClick={() => setSelecionado(x.numero)}
                    aria-pressed={selecionado === x.numero}
                    className={cn("tile flex w-full items-center gap-3 p-3 text-left transition", selecionado === x.numero ? "bg-white ring-2 ring-ink" : "hover:bg-white")}
                  >
                    <NotaRisco nota={x.risco.nota} faixa={x.risco.faixa} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        #{x.numero} · {x.cliente.nome}
                      </span>
                      <span className="block text-xs text-muted">
                        {x.pagamento.forma} · {reaisCurto(x.total)} · há {Math.max(1, Math.round((Date.parse("2026-11-25T17:00:00Z") - Date.parse(x.data)) / 3600000))} h
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card titulo="Bloqueado automaticamente" className="p-4">
          <div className="tile flex items-center gap-3 p-3">
            <NotaRisco nota={bloqueado.risco.nota} faixa={bloqueado.risco.faixa} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                #{bloqueado.numero} · {bloqueado.cliente.nome}
              </span>
              <span className="block text-xs text-muted">Endereço em lista de bloqueio · VPN</span>
            </span>
          </div>
        </Card>
        <Card titulo="Últimos 30 dias" className="p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Num k="Aprovação automática" v={`${Math.round((resumoAntifraude.aprovadosAuto / resumoAntifraude.analisados30d) * 100)}%`} />
            <Num k="Tempo médio de revisão" v={resumoAntifraude.tempoMedioRevisao} />
            <Num k="Fraudes evitadas" v={`${resumoAntifraude.fraudesEvitadas}`} />
            <Num k="Chargebacks" v={`${resumoAntifraude.chargebacks}`} />
          </dl>
        </Card>
      </div>

      {p ? (
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">
                Pedido #{p.numero} · {p.canal} · {new Date(p.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">{p.cliente.nome}</h2>
              <p className="text-sm text-muted">
                {p.itens.map((i) => i.nome).join(" + ")} · <strong className="text-ink tabular">{reais(p.total)}</strong> · {p.pagamento.forma} {p.pagamento.parcelas > 1 && `${p.pagamento.parcelas}x`}
              </p>
            </div>
            <span className="rounded-full bg-warn-50 px-3 py-1.5 text-xs font-semibold text-warn">Cartão pré-autorizado · captura pendente</span>
          </div>

          <div className="mt-6">
            <AnaliseRisco p={p} />
          </div>

          <div className="mt-6 rounded-2xl bg-snow p-4 text-sm">
            <p className="font-semibold">Conferência ativa</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <span className="flex items-center gap-2 rounded-xl bg-white p-3">
                <Icon name="whatsapp" className="size-4 text-[#1f9d55]" /> Confirmação no WhatsApp
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-white p-3">
                <Icon name="doc" className="size-4" /> Documento + selfie
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-white p-3">
                <Icon name="shield" className="size-4" /> Forçar 3DS
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-black/5 pt-5">
            <Botao tom="ink" onClick={() => decidir("aprovado, cartão capturado")}>
              <Icon name="check" className="size-4" /> Aprovar e capturar
            </Botao>
            <Botao tom="ghost" onClick={() => decidir("pedido de documento enviado no WhatsApp")}>
              <Icon name="doc" className="size-4" /> Pedir documento
            </Botao>
            <Botao tom="red" onClick={() => decidir("recusado, autorização cancelada e dados bloqueados")}>
              <Icon name="ban" className="size-4" /> Recusar e bloquear
            </Botao>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="py-16 text-center text-muted">Nenhum pedido selecionado.</p>
        </Card>
      )}

      {aviso && (
        <div role="status" className="rise fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-pop)] md:bottom-8">
          {aviso}
        </div>
      )}
    </div>
  );
}

function Num({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="text-lg font-bold tabular">{v}</dd>
    </div>
  );
}

function Regras() {
  const [regras, setRegras] = useState<RegraRisco[]>(REGRAS_PADRAO);
  const amostra = useMemo(
    () =>
      pedidos.slice(0, 6).map((p) => ({
        p,
        nova: calcularNota(
          p.risco.motivos.map((m) => m.codigo),
          regras,
        ),
      })),
    [regras],
  );
  const mudou = JSON.stringify(regras) !== JSON.stringify(REGRAS_PADRAO);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
      <Card titulo="Regras e pesos" ferramentas={mudou && <Botao tom="ink">Salvar e recalcular</Botao>}>
        <p className="-mt-2 mb-4 text-sm text-muted">Base de 8 pontos. Nota de 0 a 100. Cada alteração fica registrada na auditoria.</p>
        <ul className="divide-y divide-black/5">
          {regras.map((r, i) => (
            <li key={r.codigo} className="flex items-center gap-3 py-3">
              <button
                role="switch"
                aria-checked={r.ativa}
                aria-label={`Ativar regra: ${r.descricao}`}
                onClick={() => setRegras(regras.map((x, j) => (j === i ? { ...x, ativa: !x.ativa } : x)))}
                className={cn("relative h-6 w-11 shrink-0 rounded-full transition", r.ativa ? "bg-ink" : "bg-line-2")}
              >
                <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition", r.ativa ? "left-[22px]" : "left-0.5")} />
              </button>
              <span className={cn("flex-1 text-sm", !r.ativa && "text-faint line-through")}>{r.descricao}</span>
              <label className="flex items-center gap-1">
                <span className="sr-only">Peso</span>
                <input
                  type="number"
                  value={r.peso}
                  onChange={(e) => setRegras(regras.map((x, j) => (j === i ? { ...x, peso: Number(e.target.value) } : x)))}
                  className={cn("h-9 w-16 rounded-lg bg-white text-center font-bold ring-1 ring-black/10 outline-none tabular focus:ring-ink", r.peso > 0 ? "text-red" : "text-ok")}
                />
              </label>
            </li>
          ))}
        </ul>
        <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
          <Icon name="plus" className="size-4" /> Nova regra (ex.: padrão do último golpe)
        </button>
      </Card>
      <div className="space-y-4">
        <Card titulo="Faixas">
          <div className="flex h-3 overflow-hidden rounded-full">
            <span className="bg-ok" style={{ width: "30%" }} />
            <span className="bg-[#e7a33e]" style={{ width: "30%" }} />
            <span className="bg-red" style={{ width: "40%" }} />
          </div>
          <div className="mt-2 grid grid-cols-3 text-xs">
            <span>
              <strong>0–29</strong>
              <br />
              aprova sozinho
            </span>
            <span>
              <strong>30–59</strong>
              <br />
              revisão
            </span>
            <span>
              <strong>60+</strong>
              <br />
              bloqueia
            </span>
          </div>
          <p className="mt-4 text-sm text-muted">3DS obrigatório acima de</p>
          <input defaultValue="R$ 3.000,00" className="mt-1 h-10 w-full rounded-xl bg-white px-3 font-semibold ring-1 ring-black/10" aria-label="Valor mínimo para 3DS obrigatório" />
        </Card>
        <Card titulo="Simulação nos últimos pedidos">
          <ul className="space-y-2">
            {amostra.map(({ p, nova }) => (
              <li key={p.numero} className="flex items-center gap-2 text-sm">
                <span className="w-14 font-semibold tabular">#{p.numero}</span>
                <span className="min-w-0 flex-1 truncate text-muted">{p.cliente.nome}</span>
                <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
                <Icon name="chevronRight" className="size-3.5 text-faint" />
                <NotaRisco nota={nova.nota} faixa={nova.faixa} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Bloqueio() {
  const [lista, setLista] = useState(bloqueioInicial);
  const [tipo, setTipo] = useState("CPF");
  const [valor, setValor] = useState("");
  return (
    <Card titulo="Lista de bloqueio" ferramentas={<span className="text-sm text-muted">{lista.length} itens</span>}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valor.trim()) return;
          setLista([{ tipo, valor, origem: "Inclusão manual", quem: "Gerência", quando: "25/11/2026" }, ...lista]);
          setValor("");
        }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-10 rounded-full bg-white px-4 text-sm ring-1 ring-black/10" aria-label="Tipo">
          {["CPF", "E-mail", "Telefone", "Endereço", "Cartão", "Aparelho"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor a bloquear" className="h-10 min-w-[220px] flex-1 rounded-full bg-white px-4 text-sm ring-1 ring-black/10 outline-none focus:ring-ink" aria-label="Valor" />
        <Botao tom="ink">
          <Icon name="ban" className="size-4" /> Bloquear
        </Botao>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
              <th className="py-2">Tipo</th>
              <th>Valor</th>
              <th>Origem</th>
              <th>Quem incluiu</th>
              <th>Quando</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((b, i) => (
              <tr key={i} className="border-b border-black/5 last:border-0">
                <td className="py-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold ring-1 ring-black/5">{b.tipo}</span>
                </td>
                <td className="font-medium">{b.valor}</td>
                <td className="text-muted">{b.origem}</td>
                <td>{b.quem}</td>
                <td className="text-muted tabular">{b.quando}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Chargebacks() {
  const lista = [
    { pedido: "47102", data: "12/09/2026", valor: 1_189_000, motivo: "Fraude: cartão clonado", status: "Perdido", origem: "Pedido aprovado sem 3DS (ClearSale)" },
    { pedido: "46880", data: "28/08/2026", valor: 89_900, motivo: "Não reconhece a compra", status: "Contestado com sucesso", origem: "Entrega com assinatura do titular" },
    { pedido: "46210", data: "02/07/2026", valor: 329_000, motivo: "Mercadoria não recebida", status: "Em disputa", origem: "Rastreio mostra entregue" },
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <Card titulo="Chargebacks e fraudes confirmadas" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Registrar chargeback</Botao>} className="overflow-hidden">
        <div className="-mx-5 overflow-x-auto">
          <table className="tabela min-w-[760px]">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th className="text-right">Valor</th>
                <th>Motivo</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.pedido}>
                  <td>
                    <span className="font-bold">#{c.pedido}</span>
                    <span className="block text-xs text-muted">{c.origem}</span>
                  </td>
                  <td className="tabular">{c.data}</td>
                  <td className="text-right font-semibold tabular">{reais(c.valor)}</td>
                  <td>{c.motivo}</td>
                  <td>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", c.status === "Perdido" ? "bg-red-50 text-red" : c.status === "Em disputa" ? "bg-warn-50 text-warn" : "bg-ok-50 text-ok")}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card titulo="O que acontece ao marcar fraude" tom="red">
        <ol className="space-y-2.5 text-sm">
          {["CPF, e-mail, telefone, endereço, cartão e aparelho do pedido vão para a lista de bloqueio", "Todo pedido ligado a esses dados trava na hora", "A regra que deixou passar aparece no relatório", "Sem 3DS, o prejuízo é da loja; com 3DS, a responsabilidade vai para o banco"].map((t, i) => (
            <li key={t} className="flex gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Relatorio() {
  const semanas = [
    { s: "27/10", aprov: 88, rev: 9, bloq: 3 },
    { s: "03/11", aprov: 90, rev: 7, bloq: 3 },
    { s: "10/11", aprov: 89, rev: 8, bloq: 3 },
    { s: "17/11", aprov: 91, rev: 6, bloq: 3 },
    { s: "24/11", aprov: 90, rev: 6, bloq: 4 },
  ];
  const regras = [
    ["Titular do cartão diferente do comprador", 38, "6 fraudes"],
    ["Primeira compra acima de R$ 3.000", 61, "2 fraudes"],
    ["Acesso por VPN ou proxy", 22, "4 fraudes"],
    ["Mais de 2 cartões tentados", 17, "5 fraudes"],
    ["Pix pago por CPF diferente", 9, "1 fraude"],
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card titulo="Decisões por semana (%)">
        <ul className="space-y-3">
          {semanas.map((w) => (
            <li key={w.s} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-muted tabular">{w.s}</span>
              <div className="flex h-5 flex-1 overflow-hidden rounded-full">
                <span className="bg-ok" style={{ width: `${w.aprov}%` }} />
                <span className="bg-[#e7a33e]" style={{ width: `${w.rev}%` }} />
                <span className="bg-red" style={{ width: `${w.bloq}%` }} />
              </div>
              <span className="w-10 text-right font-semibold tabular">{w.aprov}%</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-ok" /> Aprovado sozinho</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#e7a33e]" /> Revisão</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-red" /> Bloqueado</span>
        </div>
      </Card>
      <Card titulo="Indicadores (30 dias)">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Num k="Pedidos analisados" v="412" />
          <Num k="Revisões manuais" v="22" />
          <Num k="Tempo médio de revisão" v="14 min" />
          <Num k="Aprovados na revisão" v="77%" />
          <Num k="Pedidos com 3DS" v="68%" />
          <Num k="Chargebacks" v="0" />
        </dl>
      </Card>
      <Card titulo="Regras que mais pegaram fraude" className="xl:col-span-2 overflow-hidden">
        <div className="-mx-5 overflow-x-auto">
          <table className="tabela min-w-[600px]">
            <thead>
              <tr>
                <th>Regra</th>
                <th className="text-right">Disparos (30d)</th>
                <th>Fraudes confirmadas</th>
              </tr>
            </thead>
            <tbody>
              {regras.map(([r, n, f]) => (
                <tr key={r as string}>
                  <td className="font-medium">{r}</td>
                  <td className="text-right tabular">{n}</td>
                  <td>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
