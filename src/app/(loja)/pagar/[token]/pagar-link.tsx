"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LinkPagamento } from "@/mock/operacao";
import { produtos } from "@/mock/catalogo";
import { reais } from "@/lib/format";
import { precoAVista } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Campo, Pagamento, Processando, type FormaPagamento } from "@/ui/loja/pagamento";

export function PagarLink({ link }: { link: LinkPagamento }) {
  const router = useRouter();
  const [forma, setForma] = useState<FormaPagamento>("cartao");
  const [etapa, setEtapa] = useState<null | "antifraude" | "3ds">(null);
  const fechado = link.status === "pago" || link.status === "expirado" || link.status === "cancelado";
  const bike = produtos[0];
  const total = forma === "pix" ? precoAVista(link.total) : link.total;

  const pagar = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa("antifraude");
    setTimeout(() => {
      if (forma === "pix") return router.push(`/pedido/48215?forma=pix`);
      setEtapa("3ds");
      setTimeout(() => router.push(`/pedido/48215?forma=${forma}`), 1800);
    }, 1400);
  };

  return (
    <div className="container-loja max-w-5xl pt-8">
      <div className="flex flex-wrap items-center gap-3 rounded-[28px] bg-snow p-5">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-lg font-bold text-white">{link.vendedor[0]}</span>
        <div className="flex-1">
          <p className="text-sm text-muted">Pedido montado por {link.vendedor}, vendedor da ShopBike</p>
          <p className="text-lg font-bold">Olá, {link.cliente.split(" ")[0]}! Confira e pague com segurança.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-line">
          <Icon name="clock" className="size-3.5" /> Válido até {link.validade}
        </span>
      </div>

      {fechado ? (
        <div className="mt-8 rounded-[28px] p-10 text-center ring-1 ring-line">
          <p className="text-xl font-bold">{link.status === "pago" ? "Este link já foi pago." : link.status === "expirado" ? "Este link expirou." : "Este link foi cancelado."}</p>
          <p className="mt-2 text-muted">Fale com {link.vendedor} no WhatsApp para gerar um novo.</p>
        </div>
      ) : (
        <form onSubmit={pagar} className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-[28px] p-5 ring-1 ring-line md:p-6">
              <h2 className="text-lg font-bold">Confirme seus dados</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Campo label="Nome completo" defaultValue={link.cliente} />
                <Campo label="CPF" placeholder="000.000.000-00" inputMode="numeric" />
                <Campo label="E-mail" type="email" placeholder="voce@email.com" />
                <Campo label="WhatsApp" type="tel" placeholder="(48) 90000-0000" />
              </div>
            </section>
            <section className="rounded-[28px] p-5 ring-1 ring-line md:p-6">
              <h2 className="mb-4 text-lg font-bold">Pagamento</h2>
              <Pagamento total={link.total} forma={forma} setForma={setForma} limiteParcelas={link.parcelas} />
            </section>
          </div>
          <aside className="lg:sticky lg:top-[150px] lg:self-start">
            <div className="rounded-[28px] bg-snow p-5">
              <h2 className="font-bold">Seu pedido</h2>
              <div className="mt-4 flex gap-3">
                <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-white">
                  <ProductArt kind={bike.art} color={bike.cores[0].hex} className="size-14" />
                </span>
                <span className="text-sm">
                  <span className="font-medium">{link.itens}</span>
                  <span className="block text-xs text-muted">Itens reais do catálogo · estoque reservado</span>
                </span>
              </div>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm tabular">
                <div className="flex justify-between">
                  <dt className="text-muted">Entrega</dt>
                  <dd>Retirada na loja</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Parcelamento</dt>
                  <dd>até {link.parcelas}x sem juros</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
                  <dt>Total</dt>
                  <dd>{reais(total)}</dd>
                </div>
              </dl>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-red py-3.5 font-semibold text-white hover:bg-red-600">
                <Icon name="lock" className="size-4" /> {forma === "pix" ? "Gerar Pix" : "Pagar agora"}
              </button>
              <p className="mt-3 text-center text-xs text-muted">Pagamento processado pela Rede com 3D Secure. Link de uso único.</p>
            </div>
          </aside>
        </form>
      )}
      {etapa && <Processando etapa={etapa} />}
    </div>
  );
}
