import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clientes } from "@/mock/painel";
import { pedidos, type Pedido } from "@/mock/operacao";
import { cn, iniciaisDe, reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Botao, Card, Chip, StatusChip, nomeCanal } from "@/ui/painel/ui";
import { AcoesLgpd, ObservacoesEquipe } from "./acoes";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return clientes.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = clientes.find((x) => x.id === id);
  return { title: c?.nome ?? "Cliente" };
}

/** Situações em que o pedido conta como compra (entra no total gasto). */
const PAGOS = ["Pago", "Em separação", "Faturado", "Autorizado", "Enviado", "Entregue"];

/* Itens dos pedidos antigos, migrados da Climba (só para o protótipo). */
/* Item escolhido pela faixa de valor, para o pedido antigo fazer sentido. */
const ITENS_HISTORICO = {
  bike: ["Specialized Rockhopper 2024", "Caloi Elite Carbon Sport", "Oggi Big Wheel 7.2"],
  medio: ["Revisão completa + troca de relação", "Roda Shimano MT500 + pneus", "Garmin Edge 540"],
  barato: ["Capacete Specialized Align II", "Pneu Pirelli Scorpion XC RC 29", "Sapatilha Shimano RC1", "Bermuda Absolute Pro"],
};
const itemPorValor = (centavos: number, i: number) => {
  const l = centavos >= 250_000 ? ITENS_HISTORICO.bike : centavos >= 80_000 ? ITENS_HISTORICO.medio : ITENS_HISTORICO.barato;
  return l[i % l.length];
};

type Linha = { numero: string; itens: string; canal: string; total: number; data: string; pedido?: Pedido };

export default async function PerfilCliente({ params }: Props) {
  const { id } = await params;
  const c = clientes.find((x) => x.id === id);
  if (!c) notFound();

  // Só pedidos deste cliente. Para completar o número de pedidos do cadastro, entram pedidos
  // antigos migrados da Climba (marcados "Histórico"), somando o que falta do total gasto.
  const proprios = pedidos.filter((p) => p.cliente.nome === c.nome);
  const pagoProprio = proprios.filter((p) => PAGOS.includes(p.status)).reduce((s, p) => s + p.total, 0);
  const qtdHistorico = Math.max(0, c.pedidos - proprios.length);
  const restante = Math.max(0, c.totalGasto - pagoProprio);
  const pesos = Array.from({ length: qtdHistorico }, (_, i) => 3 + ((i * 5 + c.nome.length) % 4));
  const somaPesos = pesos.reduce((s, x) => s + x, 0) || 1;
  const historico: Linha[] = pesos.map((w, i) => {
    const valor = i === pesos.length - 1 ? restante - pesos.slice(0, -1).reduce((s, x) => s + Math.round((restante * x) / somaPesos), 0) : Math.round((restante * w) / somaPesos);
    return { numero: `C-${88120 - i * 317 - c.id.length * 41}`, itens: itemPorValor(valor, i + c.nome.length), canal: "Climba", total: valor, data: `${String(5 + i * 7).padStart(2, "0")}/${String(Math.max(1, 10 - i * 2)).padStart(2, "0")}/2026` };
  });
  const linhas: Linha[] = [...proprios.map((p) => ({ numero: p.numero, itens: p.itens.map((i) => i.nome).join(" + "), canal: nomeCanal[p.canal], total: p.total, data: p.data, pedido: p })), ...historico];
  const totalGasto = pagoProprio + historico.reduce((s, h) => s + h.total, 0);
  const pagos = proprios.filter((p) => PAGOS.includes(p.status)).length + historico.length;

  // Conversa do próprio cliente (antes, uma conversa fixa de outro cliente aparecia em todo perfil)
  const primeiro = c.nome.split(" ")[0];
  const ultimo = proprios[0];
  const produto = ultimo?.itens[0]?.nome ?? historico[0]?.itens ?? "uma bike";
  const vendedor = c.origem.match(/\((.+)\)/)?.[1] ?? "Diego";
  const conversa = [
    { quando: "25/11, 10:02", quem: "Cliente", texto: `Oi! Vocês têm ${produto} disponível?` },
    { quando: "25/11, 10:02", quem: "IA", texto: "Temos sim, com pronta entrega. Dá para parcelar em até 21x. Quer que um vendedor monte o pedido para você?" },
    { quando: "25/11, 10:05", quem: "Cliente", texto: "Quero, por favor." },
    ...(ultimo
      ? [
          { quando: "25/11, 10:09", quem: "Vendedor", texto: `${primeiro}, segue o link de pagamento do pedido #${ultimo.numero}: shopbike.com.br/pagar/…` },
          { quando: "25/11, 13:34", quem: "Sistema", texto: PAGOS.includes(ultimo.status) ? `Pagamento aprovado · pedido #${ultimo.numero}` : `Link aberto pelo cliente · pedido #${ultimo.numero} aguardando pagamento` },
        ]
      : []),
  ];
  /* Bolhas: cliente = branco com contorno · IA = azul claro com ícone · vendedor = preto · sistema = verde claro */
  const bolha: Record<string, string> = {
    Cliente: "bg-white text-ink ring-1 ring-line",
    IA: "bg-info-50 text-ink",
    Vendedor: "bg-ink text-white",
    Sistema: "bg-ok-50 text-ok",
  };
  const rotuloMsg: Record<string, string> = { Cliente: primeiro, IA: "IA ShopBike", Vendedor: `${vendedor} (vendedor)`, Sistema: "Sistema" };

  const acoes = (
    <>
      <Botao tom="ink" tamanho="card">
        <Icon name="whatsapp" className="size-4" /> Conversar
      </Botao>
      <Link href="/admin/links" className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold ring-1 ring-black/10 hover:bg-snow">
        <Icon name="link" className="size-4" /> Gerar link
      </Link>
    </>
  );

  return (
    <>
      <Link href="/admin/clientes" className="mb-3 inline-flex min-h-8 items-center gap-1 rounded-full pr-2 text-sm font-semibold text-muted hover:text-ink">
        <Icon name="chevronLeft" className="size-4" /> Clientes
      </Link>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        {/* Identidade */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-cloud text-xl font-bold text-ink" aria-hidden>
                {iniciaisDe(c.nome)}
              </span>
              <div>
                <h1 className="text-xl leading-tight font-bold tracking-tight">{c.nome}</h1>
                <p className="text-sm text-muted">
                  Cliente desde {c.desde} · via {c.origem}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip>{c.grupo}</Chip>
              <Chip tom="ok">Sem ocorrências no antifraude</Chip>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["user", c.tipo === "PF" ? "CPF" : "CNPJ", c.doc],
                ["mail", "E-mail", c.email],
                ["whatsapp", "WhatsApp", c.tel],
                ["pin", "Cidade", `${c.cidade}/${c.uf}`],
                ["star", "Aniversário", c.aniversario],
              ].map(([i, k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-snow ring-1 ring-line">
                    <Icon name={i as "user"} className="size-4" />
                  </span>
                  <span className="flex-1">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </span>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">{acoes}</div>
          </Card>

          <Card titulo="Endereços">
            <ul className="space-y-2 text-sm">
              <li className="tile p-3">
                <span className="flex items-center gap-2 font-semibold">
                  Principal <Chip>Cobrança e entrega</Chip>
                </span>
                <span className="mt-1 block text-muted">Rua Lauro Müller, 1.234 · Centro · {c.cidade}/{c.uf} · 88701-100</span>
              </li>
              <li className="tile p-3">
                <span className="font-semibold">Trabalho</span>
                <span className="mt-1 block text-muted">Av. Marcolino Martins Cabral, 900 · Vila Moema · Tubarão/SC</span>
              </li>
            </ul>
          </Card>

          <Card titulo="Privacidade (LGPD)">
            <ul className="space-y-2 text-sm">
              {[
                ["Termos e privacidade", true, "aceito em 03/2021"],
                ["Marketing por WhatsApp", c.marketing, c.marketing ? "aceito" : "recusado"],
                ["Marketing por e-mail", c.marketing, c.marketing ? "aceito" : "recusado"],
                ["Cookies de medição", true, "aceito"],
              ].map(([k, ok, s]) => (
                <li key={k as string} className="flex items-center gap-2">
                  <Icon name={ok ? "check" : "close"} className={cn("size-4", ok ? "text-ok" : "text-faint")} />
                  <span className="flex-1">{k}</span>
                  <span className="text-xs text-muted">{s}</span>
                </li>
              ))}
            </ul>
            <AcoesLgpd nome={c.nome} />
            <p className="mt-2 text-xs text-muted">Cada abertura deste perfil fica registrada na auditoria.</p>
          </Card>
        </div>

        {/* Atividade */}
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Total gasto", reaisCurto(totalGasto), "pedidos pagos"],
              ["Pedidos", String(linhas.length), `${pagos} pagos`],
              ["Ticket médio", reaisCurto(Math.round(totalGasto / Math.max(1, pagos))), "por pedido pago"],
              ["Última compra", c.ultimaCompra, ""],
            ].map(([k, v, sub]) => (
              <div key={k} className="glass rounded-[var(--radius-tile)] px-4 py-3">
                <p className="text-[13px] font-medium text-muted">{k}</p>
                <p className="mt-0.5 text-xl font-bold tabular">{v}</p>
                {sub && <p className="text-xs text-muted">{sub}</p>}
              </div>
            ))}
          </div>

          <Card titulo="Últimos pedidos" ferramentas={<span className="text-xs text-muted">inclui pedidos migrados da Climba</span>}>
            <ul className="space-y-2">
              {linhas.map((l) =>
                l.pedido ? (
                  <li key={l.numero}>
                    <Link href={`/admin/pedidos?pedido=${l.numero}`} className="tile flex items-center gap-3 p-3">
                      <span className="w-16 font-semibold tabular">#{l.numero}</span>
                      <span className="min-w-0 flex-1 truncate text-sm">{l.itens}</span>
                      <span className="text-sm text-muted">{l.canal}</span>
                      <span className="w-24 text-right font-semibold tabular">{reais(l.total)}</span>
                      <StatusChip status={l.pedido.status} />
                    </Link>
                  </li>
                ) : (
                  <li key={l.numero} className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-line p-3">
                    <span className="w-16 font-semibold text-muted tabular">{l.numero}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {l.itens} <span className="text-muted">· {l.data}</span>
                    </span>
                    <span className="text-sm text-muted">{l.canal}</span>
                    <span className="w-24 text-right font-semibold tabular">{reais(l.total)}</span>
                    <Chip tom="apagado">Histórico</Chip>
                  </li>
                ),
              )}
            </ul>
          </Card>

          <div className="grid gap-4 2xl:grid-cols-2">
            {/* As ações se repetem no topo da conversa: quem lê a conversa não precisa rolar de volta */}
            <Card titulo="Conversas no WhatsApp (NX)" ferramentas={acoes}>
              <ol className="space-y-2.5">
                {conversa.map((m, i) => (
                  <li key={i} className={cn("flex", m.quem === "Cliente" ? "justify-start" : "justify-end")}>
                    <div className={cn("max-w-[85%] rounded-[var(--radius-tile)] px-3.5 py-2 text-sm", bolha[m.quem])}>
                      <p className={cn("mb-0.5 inline-flex items-center gap-1 text-xs font-semibold", m.quem === "Vendedor" ? "text-white/75" : m.quem === "Sistema" ? "text-ok" : m.quem === "IA" ? "text-info" : "text-muted")}>
                        {m.quem === "IA" && <Icon name="ia" className="size-3.5" />}
                        {rotuloMsg[m.quem]} · {m.quando}
                      </p>
                      <p>{m.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <Card titulo="Interesses e comportamento">
              {/* rótulo e valor próximos: grade 140px + resto */}
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2.5 text-sm">
                {[
                  ["Viu 6 vezes", "Specialized Allez E5 · 54"],
                  ["Favoritos", "Capacete Align II · Garrafa ShopBike"],
                  ["Avise-me", "Turbo Vado SL 4.0 · L"],
                  ["Última busca", "“pedal clip shimano”"],
                  ["Carrinho aberto", "Nenhum"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <ObservacoesEquipe inicial="Pedala no grupo de quarta. Prefere retirar na loja." autor="Mateus" data="20/11" />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
