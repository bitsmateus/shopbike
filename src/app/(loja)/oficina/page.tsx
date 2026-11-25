import type { Metadata } from "next";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";

export const metadata: Metadata = { title: "Oficina" };

const servicos = [
  ["Revisão completa", "Limpeza, regulagem de câmbio e freios, aperto geral e lubrificação.", "R$ 189"],
  ["Revisão de suspensão", "Troca de óleo e retentores do garfo.", "R$ 249"],
  ["Sangria de freio hidráulico", "Por roda, com fluido incluso.", "R$ 79"],
  ["Montagem de bike", "Para bikes compradas em outro lugar.", "R$ 149"],
];

export default function OficinaPage() {
  return (
    <div className="container-loja pt-8">
      <div className="grid items-center gap-6 overflow-hidden rounded-[28px] bg-snow md:grid-cols-2">
        <div className="p-7 md:p-10">
          <span className="text-xs font-semibold tracking-[0.14em] text-red uppercase">Oficina ShopBike</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Sua bike nas mãos de quem entende.</h1>
          <p className="mt-3 text-lg text-muted">Agende pelo site ou pelo WhatsApp e receba lembretes de revisão aos 30 e 180 dias.</p>
          <a href="https://wa.me/" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-6 font-semibold text-white">
            <Icon name="whatsapp" className="size-5" /> Agendar pelo WhatsApp
          </a>
        </div>
        <ProductArt kind="pecas" color="#e30618" className="mx-auto w-3/4" />
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {servicos.map(([t, d, v]) => (
          <div key={t} className="flex items-start gap-4 rounded-3xl p-5 ring-1 ring-line">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-red">
              <Icon name="wrench" className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </div>
            <span className="font-bold tabular">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
