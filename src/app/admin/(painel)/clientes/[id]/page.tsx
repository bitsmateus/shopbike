import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clientes, conversasCliente } from "@/mock/painel";
import { pedidos } from "@/mock/operacao";
import { cn, reais, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Botao, Card, Chip, StatusChip } from "@/ui/painel/ui";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return clientes.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = clientes.find((x) => x.id === id);
  return { title: c?.nome ?? "Cliente" };
}

export default async function PerfilCliente({ params }: Props) {
  const { id } = await params;
  const c = clientes.find((x) => x.id === id);
  if (!c) notFound();
  const doCliente = pedidos.filter((p) => p.cliente.nome === c.nome);
  // completa com pedidos fictícios até o total do cadastro (o último vem da Climba)
  const extras = pedidos
    .filter((p) => ["Entregue", "Enviado", "Faturado"].includes(p.status) && !doCliente.includes(p))
    .slice(0, Math.max(0, c.pedidos - 1 - doCliente.length))
    .map((p) => ({ ...p, cliente: { ...p.cliente, nome: c.nome } }));
  const historico = [...doCliente, ...extras];
  const iniciais = c.nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <>
      <Link href="/admin/clientes" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <Icon name="chevronLeft" className="size-4" /> Clientes
      </Link>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        {/* Identidade */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-full bg-ink text-xl font-bold text-white">{iniciais}</span>
              <div>
                <h1 className="text-2xl leading-tight font-bold tracking-tight">{c.nome}</h1>
                <p className="text-sm text-muted">
                  Cliente desde {c.desde} · via {c.origem}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip tom={c.grupo === "Lojista (B2B)" ? "ink" : "neutro"}>{c.grupo}</Chip>
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
                  <span className="grid size-8 place-items-center rounded-full bg-white ring-1 ring-black/5">
                    <Icon name={i as "user"} className="size-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs text-muted">{k}</span>
                    <span className="font-medium">{v}</span>
                  </span>
                </div>
              ))}
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Botao tom="ink">
                <Icon name="whatsapp" className="size-4" /> Conversar
              </Botao>
              <Botao tom="ghost">
                <Icon name="link" className="size-4" /> Gerar link
              </Botao>
            </div>
          </Card>

          <Card titulo="Endereços">
            <ul className="space-y-2 text-sm">
              <li className="tile p-3">
                <span className="flex items-center gap-2 font-semibold">
                  Principal <Chip tom="info">Cobrança e entrega</Chip>
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
            <div className="mt-4 flex flex-wrap gap-2">
              <Botao tom="ghost">Exportar dados</Botao>
              <Botao tom="ghost" className="text-red">
                Excluir dados
              </Botao>
            </div>
            <p className="mt-2 text-xs text-muted">Cada abertura deste perfil fica registrada na auditoria.</p>
          </Card>
        </div>

        {/* Atividade */}
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Total gasto", reaisCurto(c.totalGasto)],
              ["Pedidos", String(c.pedidos)],
              ["Ticket médio", reaisCurto(Math.round(c.totalGasto / Math.max(1, c.pedidos)))],
              ["Última compra", c.ultimaCompra],
            ].map(([k, v]) => (
              <div key={k} className="glass rounded-[18px] p-4">
                <p className="text-sm text-muted">{k}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight tabular">{v}</p>
              </div>
            ))}
          </div>

          <Card titulo="Últimos pedidos" ferramentas={<span className="text-xs text-muted">inclui pedidos migrados da Climba</span>}>
            <ul className="space-y-2">
              {historico.map((p) => (
                <li key={p.numero}>
                  <Link href={`/admin/pedidos?pedido=${p.numero}`} className="tile flex items-center gap-3 p-3 transition hover:bg-white">
                    <span className="w-16 font-bold tabular">#{p.numero}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.itens.map((i) => i.nome).join(" + ")}</span>
                    <span className="text-sm text-muted">{p.canal}</span>
                    <span className="w-24 text-right font-semibold tabular">{reais(p.total)}</span>
                    <StatusChip status={p.status} />
                  </Link>
                </li>
              ))}
              <li className="tile flex items-center gap-3 p-3 opacity-80">
                <span className="w-16 font-bold tabular">C-88120</span>
                <span className="min-w-0 flex-1 truncate text-sm">Specialized Rockhopper 2024 · pedido da Climba</span>
                <span className="text-sm text-muted">Climba</span>
                <span className="w-24 text-right font-semibold tabular">R$ 1.299,00</span>
                <Chip tom="apagado">Histórico</Chip>
              </li>
            </ul>
          </Card>

          <div className="grid gap-4 2xl:grid-cols-2">
            <Card titulo="Conversas no WhatsApp (NX)" ferramentas={<Chip tom="info">CRM NX</Chip>}>
              <ol className="space-y-2.5">
                {conversasCliente.map((m, i) => (
                  <li key={i} className={cn("flex", m.quem === "Cliente" ? "justify-start" : "justify-end")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2 text-sm", m.quem === "Cliente" ? "bg-white ring-1 ring-black/5" : m.quem === "Sistema" ? "bg-ok-50 text-ok" : "bg-ink text-white")}>
                      <p className={cn("text-[11px] font-semibold", m.quem === "Cliente" ? "text-muted" : "opacity-70")}>
                        {m.quem} · {m.quando}
                      </p>
                      {m.texto}
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <Card titulo="Interesses e comportamento">
              <ul className="space-y-3 text-sm">
                {[
                  ["Viu 6 vezes", "Specialized Allez E5 · 54"],
                  ["Favoritos", "Capacete Align II · Garrafa ShopBike"],
                  ["Avise-me", "Turbo Vado SL 4.0 · L"],
                  ["Última busca", "“pedal clip shimano”"],
                  ["Carrinho aberto", "Nenhum"],
                ].map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-3 border-b border-black/5 pb-2">
                    <span className="text-muted">{k}</span>
                    <span className="text-right font-medium">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-2xl bg-white/80 p-3 text-sm">
                <p className="font-semibold">Observações da equipe</p>
                <p className="mt-1 text-muted">Pedala no grupo de quarta. Prefere retirar na loja. Revisão da Big Wheel em 25/12.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
