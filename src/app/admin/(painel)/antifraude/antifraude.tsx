"use client";

import { useMemo, useState } from "react";
import { calcularNota, REGRAS_PADRAO, type RegraRisco } from "@/modules/antifraude/nota";
import { filaRevisao, listaBloqueio as bloqueioInicial, pedidos, type Pedido } from "@/mock/operacao";
import { cn, reais, reaisCurto } from "@/lib/format";
import { Icon, type IconName } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { AnaliseRisco } from "@/ui/painel/pedido-drawer";
import { Botao, Card, Chip, NotaRisco, RiscoNumero, plural, type Tom } from "@/ui/painel/ui";

const abas = ["Fila de revisão", "Regras", "Lista de bloqueio", "Chargebacks", "Relatório"] as const;

/* "Agora" do protótipo (último pedido da base) e validade da pré-autorização do cartão.
   A validade real depende do adquirente (Rede): confirmar e trocar aqui. */
const AGORA = Date.parse("2026-11-25T17:00:00Z");
const VALIDADE_PRE_AUTORIZACAO_H = 7 * 24;

const horasDesde = (data: string) => Math.max(1, Math.round((AGORA - Date.parse(data)) / 3_600_000));
const ehCartao = (p: Pedido) => /cart/i.test(p.pagamento.forma);
/** Horas até a pré-autorização expirar (só cartão). */
const horasParaCaptura = (p: Pedido) => (ehCartao(p) ? VALIDADE_PRE_AUTORIZACAO_H - horasDesde(p.data) : null);
const emTexto = (h: number) => (h < 24 ? plural(h, "hora", "horas") : plural(Math.floor(h / 24), "dia", "dias"));
/** "há 3 h" até 24 h; depois "há 4 dias". */
const espera = (h: number) => (h < 24 ? `há ${h} h` : `há ${plural(Math.floor(h / 24), "dia", "dias")}`);
/** Lucas Ferreira Antunes → Lucas F. Antunes */
const abreviar = (nome: string) => {
  const p = nome.split(" ");
  return p.length <= 2 ? nome : `${p[0]} ${p.slice(1, -1).map((x) => x[0] + ".").join(" ")} ${p.at(-1)}`;
};

export function Antifraude({ inicial }: { inicial?: string }) {
  const [aba, setAba] = useState<(typeof abas)[number]>("Fila de revisão");
  return (
    <>
      {/* Mesma subnavegação das outras áreas (pílula branca na ativa) */}
      <div className="scrollbar-none -mx-1 mb-3 flex gap-1 overflow-x-auto px-1 py-1" role="tablist" aria-label="Seções do antifraude">
        {abas.map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={aba === a}
            onClick={() => setAba(a)}
            className={cn("inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-sm font-semibold transition", aba === a ? "bg-white text-ink shadow-[var(--shadow-soft)] ring-1 ring-black/5" : "text-muted hover:text-ink")}
          >
            {a}
            {a === "Fila de revisão" && <span className="ml-2 grid min-w-5 place-items-center rounded-full bg-red px-1 text-xs font-bold text-white">{filaRevisao.length}</span>}
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

/* ---------- Conferência ativa: cada forma tem estado, não é só texto ---------- */
type EstadoConf = "Não solicitado" | "Aguardando" | "Confirmado" | "Falhou";
const tomConf: Record<EstadoConf, Tom> = { "Não solicitado": "apagado", Aguardando: "warn", Confirmado: "ok", Falhou: "red" };
type Conferencia = { id: "whatsapp" | "3ds"; rotulo: string; icone: IconName; acao: string; soCartao?: boolean };
const conferencias: Conferencia[] = [
  { id: "whatsapp", rotulo: "Confirmação no WhatsApp", icone: "whatsapp", acao: "Enviar confirmação" },
  { id: "3ds", rotulo: "Autenticação 3DS do banco", icone: "shield", acao: "Pedir 3DS", soCartao: true },
];
/* Estado inicial do protótipo: a confirmação do #48212 já foi enviada (aparece no log de notificações às 11:22). */
const confInicial: Record<string, { estado: EstadoConf; hora: string }> = { "48212:whatsapp": { estado: "Aguardando", hora: "enviada 11:22" } };

function Fila({ inicial }: { inicial?: string }) {
  // Mais antigo primeiro: é o que está mais perto de perder a pré-autorização do cartão
  const [fila, setFila] = useState(() => [...filaRevisao].sort((a, b) => Date.parse(a.data) - Date.parse(b.data)));
  const [selecionado, setSelecionado] = useState(inicial && fila.some((p) => p.numero === inicial) ? inicial : fila[0]?.numero);
  const [conf, setConf] = useState(confInicial);
  const [confirmarRecusa, setConfirmarRecusa] = useState(false);
  const { avisar, aviso } = useAviso();
  const p = fila.find((x) => x.numero === selecionado);
  const bloqueado = pedidos.find((x) => x.status === "Bloqueado")!;

  const decidir = (texto: string) => {
    if (!p) return;
    const resto = fila.filter((x) => x.numero !== p.numero);
    setFila(resto);
    setSelecionado(resto[0]?.numero);
    setConfirmarRecusa(false);
    avisar(`Pedido #${p.numero}: ${texto}. Registrado na auditoria.`);
  };

  const pedirConferencia = (c: Conferencia) => {
    if (!p) return;
    setConf((s) => ({ ...s, [`${p.numero}:${c.id}`]: { estado: "Aguardando", hora: "agora" } }));
    avisar(c.id === "whatsapp" ? `Confirmação enviada no WhatsApp de ${p.cliente.nome}` : `3DS será exigido na próxima tentativa de #${p.numero}`);
  };

  const captura = p ? horasParaCaptura(p) : null;

  return (
    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <div className="space-y-3">
        <Card titulo="Aguardando decisão" ferramentas={<span className="text-xs text-muted">mais antigo primeiro</span>}>
          {fila.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              <Icon name="check" className="mx-auto mb-2 size-8 text-ok" />
              Nenhum caso para revisar.
            </div>
          ) : (
            <ul className="space-y-2">
              {fila.map((x) => {
                const ativo = selecionado === x.numero;
                const h = horasDesde(x.data);
                const cap = horasParaCaptura(x);
                return (
                  <li key={x.numero}>
                    {/* Seleção = preto (borda 2px + barra à esquerda). Foco = anel azul do sistema, só pelo teclado. */}
                    <button
                      onClick={() => setSelecionado(x.numero)}
                      aria-current={ativo ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[var(--radius-tile)] p-3 text-left transition",
                        ativo ? "border-2 border-ink bg-white p-[11px] shadow-[inset_3px_0_0_var(--color-ink)]" : "border border-borda-card bg-snow hover:bg-white",
                      )}
                    >
                      <NotaRisco nota={x.risco.nota} faixa={x.risco.faixa} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          #{x.numero} · {x.cliente.nome}
                        </span>
                        <span className="block text-xs text-muted">
                          {x.pagamento.forma} · {reaisCurto(x.total)} ·{" "}
                          <span className={cn(cap != null && cap < 48 ? "font-semibold text-danger" : h >= 24 && "font-semibold text-warn")}>{espera(h)}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Só leitura: não é um caso a revisar, então não tem cara de card clicável */}
        <Card titulo="Bloqueado automaticamente">
          <div className="flex items-center gap-3 text-sm">
            <NotaRisco nota={bloqueado.risco.nota} faixa={bloqueado.risco.faixa} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">
                #{bloqueado.numero} · {bloqueado.cliente.nome}
              </span>
              <span className="block text-xs text-muted">Endereço em lista de bloqueio · VPN</span>
            </span>
          </div>
        </Card>
      </div>

      {p ? (
        <Card className="pb-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">
                Pedido #{p.numero} · {p.canal} · {new Date(p.data).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">{p.cliente.nome}</h2>
              <p className="text-sm text-muted">
                {p.itens.map((i) => i.nome).join(" + ")} · <strong className="text-ink tabular">{reais(p.total)}</strong> · {p.pagamento.forma} {p.pagamento.parcelas > 1 && `${p.pagamento.parcelas}x`}
              </p>
            </div>
            {captura != null ? (
              <Chip tom={captura < 48 ? "red" : "warn"}>
                <Icon name="clock" className="size-3.5" /> Cartão pré-autorizado · captura expira em {emTexto(Math.max(0, captura))}
              </Chip>
            ) : (
              <Chip tom="info">Pix recebido · devolvido se recusar</Chip>
            )}
          </div>

          <div className="mt-6">
            <AnaliseRisco p={p} />
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Conferência ativa</p>
            <ul className="divide-y divide-line rounded-[var(--radius-tile)] ring-1 ring-line">
              {conferencias
                .filter((c) => !c.soCartao || ehCartao(p))
                .map((c) => {
                  const s = conf[`${p.numero}:${c.id}`] ?? { estado: "Não solicitado" as EstadoConf, hora: "" };
                  return (
                    <li key={c.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
                      <Icon name={c.icone} className="size-4 text-muted" />
                      <span className="min-w-0 flex-1 font-medium">{c.rotulo}</span>
                      <Chip tom={tomConf[s.estado]}>{s.estado}</Chip>
                      {s.hora && <span className="text-xs text-muted">{s.hora}</span>}
                      {s.estado === "Não solicitado" && (
                        <Botao tom="ghost" tamanho="card" onClick={() => pedirConferencia(c)}>
                          {c.acao}
                        </Botao>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Barra de decisão fixa no rodapé do painel: resumo à esquerda; destrutivo, 24px, secundário e primário */}
          <div className="sticky bottom-20 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-2 rounded-b-[var(--radius-card)] border-t border-line bg-paper px-4 py-3 md:bottom-0">
            <p className="mr-auto min-w-0 text-sm text-muted">
              <strong className="text-ink">#{p.numero}</strong> · {abreviar(p.cliente.nome)} · <span className="tabular">{reais(p.total)}</span> · nota <strong className="text-ink tabular">{p.risco.nota}</strong>
            </p>
            <Botao tom="ghost" className="mr-4 text-danger ring-danger/40 hover:bg-danger-50" onClick={() => setConfirmarRecusa(true)}>
              <Icon name="ban" className="size-4" /> Recusar e bloquear
            </Botao>
            <Botao tom="ghost" onClick={() => decidir("pedido de documento e selfie enviado no WhatsApp")}>
              <Icon name="doc" className="size-4" /> Pedir documento
            </Botao>
            <Botao tom="ink" onClick={() => decidir(ehCartao(p) ? "aprovado, cartão capturado" : "aprovado, Pix liberado")}>
              <Icon name="check" className="size-4" /> {ehCartao(p) ? "Aprovar e capturar" : "Aprovar pedido"}
            </Botao>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="py-16 text-center text-muted">Nenhum caso selecionado.</p>
        </Card>
      )}

      {/* Confirmação: recusar é irreversível e bloqueia os dados ligados */}
      {p && confirmarRecusa && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="alertdialog" aria-modal aria-labelledby="titulo-recusa">
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="Voltar" onClick={() => setConfirmarRecusa(false)} />
          <div className="rise relative w-full max-w-md rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-pop)]">
            <h2 id="titulo-recusa" className="text-lg font-bold">
              Recusar #{p.numero} e bloquear os dados?
            </h2>
            <p className="mt-1 text-sm text-muted">
              {ehCartao(p) ? "A pré-autorização do cartão é cancelada" : "O Pix é devolvido ao pagador"} e estes dados entram na lista de bloqueio. Todo pedido ligado a eles trava na hora.
            </p>
            <ul className="mt-3 space-y-1.5 rounded-[var(--radius-tile)] bg-snow p-3 text-sm">
              {p.vinculos.map((v) => (
                <li key={v.tipo + v.valor} className="flex gap-3">
                  <span className="w-24 shrink-0 text-muted">{v.tipo}</span>
                  <span className="min-w-0 truncate font-medium">{v.valor}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-end gap-2">
              <Botao tom="ghost" autoFocus onClick={() => setConfirmarRecusa(false)}>
                Voltar
              </Botao>
              <Botao tom="perigo" onClick={() => decidir(`recusado, ${ehCartao(p) ? "autorização cancelada" : "Pix devolvido"} e ${plural(p.vinculos.length, "dado bloqueado", "dados bloqueados")}`)}>
                <Icon name="ban" className="size-4" /> Recusar e bloquear
              </Botao>
            </div>
          </div>
        </div>
      )}
      {aviso}
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
  const invalido = (peso: number) => Number.isNaN(peso) || Math.abs(peso) > 100;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
      <Card titulo="Regras e pesos" ferramentas={mudou && <Botao tom="ink">Salvar e recalcular</Botao>}>
        <p className="-mt-2 mb-4 text-sm text-muted">Base de 8 pontos. Nota de 0 a 100. Cada alteração fica registrada na auditoria.</p>
        <ul className="divide-y divide-line">
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
                {/* Peso não é erro: número em preto; vermelho só se o valor for inválido */}
                <input
                  type="number"
                  value={r.peso}
                  onChange={(e) => setRegras(regras.map((x, j) => (j === i ? { ...x, peso: Number(e.target.value) } : x)))}
                  aria-invalid={invalido(r.peso)}
                  className={cn("campo h-9 w-16 rounded-lg text-center text-sm font-semibold tabular", invalido(r.peso) ? "border-danger text-danger" : "text-ink")}
                />
              </label>
            </li>
          ))}
        </ul>
        <button className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-full px-2 text-sm font-semibold hover:bg-snow">
          <Icon name="plus" className="size-4" /> Nova regra (ex.: padrão do último golpe)
        </button>
      </Card>
      <div className="space-y-4">
        <Card titulo="Faixas">
          <div className="flex h-1.5 overflow-hidden rounded-full">
            <span className="bg-ok" style={{ width: "30%" }} />
            <span className="bg-warn-400" style={{ width: "30%" }} />
            <span className="bg-danger" style={{ width: "40%" }} />
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
          <label className="mt-4 block">
            <span className="text-sm text-muted">3DS obrigatório acima de</span>
            <input defaultValue="R$ 3.000,00" className="campo mt-1 h-11 w-full rounded-xl px-3 text-sm font-semibold" />
          </label>
        </Card>
        <Card titulo="Simulação nos últimos pedidos">
          <ul className="space-y-2">
            {amostra.map(({ p, nova }) => (
              <li key={p.numero} className="flex items-center gap-2 text-sm">
                <span className="w-14 font-semibold tabular">#{p.numero}</span>
                <span className="min-w-0 flex-1 truncate text-muted">{p.cliente.nome}</span>
                {/* Mostra só o que muda */}
                {nova.nota === p.risco.nota ? (
                  <span className="text-xs text-faint">sem alteração</span>
                ) : (
                  <>
                    <RiscoNumero nota={p.risco.nota} />
                    <Icon name="chevronRight" className="size-3.5 text-faint" />
                    <RiscoNumero nota={nova.nota} />
                  </>
                )}
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
  const { avisar, aviso } = useAviso();
  return (
    <Card titulo="Lista de bloqueio" className="overflow-hidden" ferramentas={<span className="text-sm text-muted">{plural(lista.length, "item", "itens")}</span>}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valor.trim()) return;
          setLista([{ tipo, valor, origem: "Inclusão manual", quem: "Gerência", quando: "25/11/2026" }, ...lista]);
          setValor("");
        }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="campo h-11 rounded-xl px-3 text-sm" aria-label="Tipo">
          {["CPF", "E-mail", "Telefone", "Endereço", "Cartão", "Aparelho"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor a bloquear" className="campo h-11 min-w-[220px] flex-1 rounded-xl px-3 text-sm" aria-label="Valor" />
        <Botao tom="ink">
          <Icon name="ban" className="size-4" /> Bloquear
        </Botao>
      </form>
      <div className="-mx-4 overflow-x-auto">
        <table className="tabela min-w-[720px]">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Origem</th>
              <th>Quem incluiu</th>
              <th>Quando</th>
              <th>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((b, i) => (
              <tr key={i} className="group">
                <td>
                  <Chip>{b.tipo}</Chip>
                </td>
                <td className="font-medium">{b.valor}</td>
                <td className="text-muted">{b.origem}</td>
                <td>{b.quem}</td>
                <td className="text-muted tabular">{b.quando}</td>
                <td className="text-right">
                  {/* aparece no hover da linha e no foco do teclado */}
                  <button
                    onClick={() => {
                      setLista(lista.filter((_, j) => j !== i));
                      avisar(`${b.tipo} removido da lista de bloqueio · registrado na auditoria`);
                    }}
                    className="inline-flex h-8 items-center rounded-full px-2.5 text-sm font-semibold text-ink opacity-0 group-hover:opacity-100 hover:bg-fundo-painel focus-visible:opacity-100"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {aviso}
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
        <div className="-mx-4 overflow-x-auto">
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
                    <span className="font-semibold">#{c.pedido}</span>
                    <span className="block text-xs text-muted">{c.origem}</span>
                  </td>
                  <td className="tabular">{c.data}</td>
                  <td className="text-right font-semibold tabular">{reais(c.valor)}</td>
                  <td>{c.motivo}</td>
                  <td>
                    <Chip tom={c.status === "Perdido" ? "red" : c.status === "Em disputa" ? "warn" : "ok"}>{c.status}</Chip>
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
  const regras: [string, number, number][] = [
    ["Titular do cartão diferente do comprador", 38, 6],
    ["Primeira compra acima de R$ 3.000", 61, 2],
    ["Acesso por VPN ou proxy", 22, 4],
    ["Mais de 2 cartões tentados", 17, 5],
    ["Pix pago por CPF diferente", 9, 1],
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
                <span className="bg-warn-400" style={{ width: `${w.rev}%` }} />
                <span className="bg-danger" style={{ width: `${w.bloq}%` }} />
              </div>
              <span className="w-10 text-right font-semibold tabular">{w.aprov}%</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-ok" /> Aprovado sozinho</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-warn-400" /> Revisão</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-danger" /> Bloqueado</span>
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
        <div className="-mx-4 overflow-x-auto">
          <table className="tabela min-w-[600px]">
            <thead>
              <tr>
                <th>Regra</th>
                <th className="text-right">Disparos (30d)</th>
                <th className="text-right">Fraudes confirmadas</th>
              </tr>
            </thead>
            <tbody>
              {regras.map(([r, n, f]) => (
                <tr key={r}>
                  <td className="font-medium">{r}</td>
                  <td className="text-right tabular">{n}</td>
                  <td className="text-right font-semibold tabular">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
