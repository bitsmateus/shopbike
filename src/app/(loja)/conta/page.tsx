import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/ui/icons";

export const metadata: Metadata = { title: "Minha conta" };

const meusPedidos = [
  { numero: "48213", data: "25/11/2026", total: "R$ 4.499,00", status: "Pago", passo: "Em separação para retirada" },
  { numero: "47011", data: "02/08/2026", total: "R$ 649,00", status: "Entregue", passo: "Entregue em 05/08" },
  { numero: "C-88120", data: "14/03/2025", total: "R$ 1.299,00", status: "Entregue", passo: "Pedido da loja antiga (Climba)" },
];

export default function ContaPage() {
  return (
    <div className="container-loja grid gap-8 pt-8 lg:grid-cols-[380px_1fr]">
      <section className="rounded-[28px] p-6 ring-1 ring-line">
        <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="mt-1 text-sm text-muted">Acompanhe pedidos, trocas e favoritos.</p>
        <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f9d55] font-semibold text-white">
          <Icon name="whatsapp" className="size-5" /> Receber código no WhatsApp
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-faint">
          <span className="h-px flex-1 bg-line" /> ou com e-mail <span className="h-px flex-1 bg-line" />
        </div>
        <div className="space-y-3">
          <input className="h-12 w-full rounded-xl px-4 ring-1 ring-line-2 outline-none focus:ring-2 focus:ring-ink" placeholder="E-mail" aria-label="E-mail" />
          <input type="password" className="h-12 w-full rounded-xl px-4 ring-1 ring-line-2 outline-none focus:ring-2 focus:ring-ink" placeholder="Senha" aria-label="Senha" />
          <button className="h-12 w-full rounded-full bg-ink font-semibold text-white">Entrar</button>
        </div>
        <p className="mt-4 text-xs text-muted">Comprou na loja antiga? Use o mesmo e-mail e crie uma nova senha no primeiro acesso.</p>
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Meus pedidos</h2>
          <span className="rounded-full bg-snow px-3 py-1 text-xs text-muted">Exemplo de área logada</span>
        </div>
        <ul className="mt-4 space-y-3">
          {meusPedidos.map((p) => (
            <li key={p.numero} className="flex flex-wrap items-center gap-4 rounded-3xl p-5 ring-1 ring-line">
              <div className="flex-1">
                <p className="font-semibold">Pedido #{p.numero}</p>
                <p className="text-sm text-muted">
                  {p.data} · {p.total}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "Pago" ? "bg-info-50 text-info" : "bg-ok-50 text-ok"}`}>{p.status}</span>
              <span className="w-full text-sm text-muted sm:w-auto">{p.passo}</span>
              <div className="flex gap-2">
                <Link href={`/pedido/${p.numero}`} className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line-2">
                  Detalhes
                </Link>
                {p.status === "Entregue" && <button className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line-2">Pedir troca</button>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
