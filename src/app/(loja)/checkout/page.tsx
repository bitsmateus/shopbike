"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { corHex, produtoPorSlug } from "@/mock/catalogo";
import { cn, reais } from "@/lib/format";
import { precoAVista } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { useCarrinho } from "@/ui/loja/carrinho";
import { Campo, Pagamento, Processando, type FormaPagamento } from "@/ui/loja/pagamento";

const fretes = [
  { id: "retirada", nome: "Retirar na loja (Tubarão)", prazo: "Hoje, após a montagem", valor: 0 },
  { id: "pac", nome: "PAC", prazo: "4 dias úteis", valor: 0 },
  { id: "sedex", nome: "Sedex", prazo: "2 dias úteis", valor: 2_190 },
  { id: "jamef", nome: "Jamef Econômico", prazo: "5 dias úteis", valor: 4_900 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { itens, subtotal, limpar } = useCarrinho();
  const [frete, setFrete] = useState("pac");
  const [forma, setForma] = useState<FormaPagamento>("cartao");
  const [cep, setCep] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomOk, setCupomOk] = useState(false);
  const [etapa, setEtapa] = useState<null | "antifraude" | "3ds">(null);

  const valorFrete = fretes.find((f) => f.id === frete)!.valor;
  const descontoCupom = cupomOk ? Math.round(subtotal * 0.05) : 0;
  const bruto = subtotal - descontoCupom + valorFrete;
  const total = forma === "pix" ? precoAVista(subtotal - descontoCupom) + valorFrete : bruto;

  const finalizar = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa("antifraude");
    setTimeout(() => {
      if (forma === "pix") return concluir();
      setEtapa("3ds");
      setTimeout(concluir, 1800);
    }, 1400);
  };
  const concluir = () => {
    limpar();
    router.push(`/pedido/48214?forma=${forma}`);
  };

  if (itens.length === 0) {
    return (
      <div className="container-loja grid min-h-[50vh] place-items-center pt-10 text-center">
        <div>
          <p className="text-xl font-bold">Seu carrinho está vazio</p>
          <Link href="/c/mtb" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 font-semibold text-white">
            Ver bikes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={finalizar} className="container-loja pt-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Finalizar compra</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-snow px-3 py-1 text-xs font-semibold text-muted">
          <Icon name="lock" className="size-3.5" /> Ambiente seguro
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Secao n={1} titulo="Seus dados" sub="Não precisa criar conta: a gente cria por você para acompanhar o pedido.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="E-mail" type="email" autoComplete="email" placeholder="voce@email.com" className="sm:col-span-2" />
              <Campo label="Nome completo" autoComplete="name" placeholder="Seu nome" />
              <Campo label="CPF ou CNPJ" inputMode="numeric" placeholder="000.000.000-00" />
              <Campo label="WhatsApp" type="tel" autoComplete="tel" placeholder="(48) 9 0000-0000" className="sm:col-span-2" />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" defaultChecked className="size-4 accent-[var(--color-red)]" /> Quero receber o status do pedido no WhatsApp
            </label>
          </Secao>

          <Secao n={2} titulo="Entrega">
            <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
              <Campo
                label="CEP"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2"))}
              />
              <Campo label="Endereço" placeholder="Rua, avenida" defaultValue={cep.length === 9 ? "Rua Lauro Müller" : ""} key={cep.length === 9 ? "e1" : "e0"} />
              <Campo label="Número" placeholder="123" />
              <Campo label="Complemento e bairro" placeholder="Apto, bloco, bairro" defaultValue={cep.length === 9 ? "Centro · Tubarão/SC" : ""} key={cep.length === 9 ? "b1" : "b0"} />
            </div>
            <div className="mt-4 space-y-2" role="radiogroup" aria-label="Frete">
              {fretes.map((f) => (
                <label key={f.id} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 ring-1 transition", frete === f.id ? "ring-2 ring-ink" : "ring-line hover:ring-line-2")}>
                  <input type="radio" name="frete" checked={frete === f.id} onChange={() => setFrete(f.id)} className="size-4 accent-[var(--color-ink)]" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{f.nome}</span>
                    <span className="text-xs text-muted">{f.prazo}</span>
                  </span>
                  <span className={cn("text-sm font-semibold tabular", f.valor === 0 && "text-ok")}>{f.valor === 0 ? "Grátis" : reais(f.valor)}</span>
                </label>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" className="size-4 accent-[var(--color-red)]" /> Endereço de cobrança diferente do de entrega
            </label>
          </Secao>

          <Secao n={3} titulo="Pagamento">
            <Pagamento total={bruto} forma={forma} setForma={setForma} />
          </Secao>
        </div>

        <aside className="lg:sticky lg:top-[150px] lg:self-start">
          <div className="rounded-[28px] bg-snow p-5">
            <h2 className="font-bold">Resumo</h2>
            <ul className="mt-4 space-y-3">
              {itens.map((i) => {
                const p = produtoPorSlug(i.slug);
                return (
                  <li key={i.sku} className="flex gap-3">
                    <span className="relative grid size-16 shrink-0 place-items-center rounded-xl bg-white">
                      {p && <ProductArt kind={p.art} color={corHex(p, i.cor)} className="size-14" />}
                      <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{i.qtd}</span>
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="line-clamp-2 font-medium">{i.nome}</span>
                      <span className="text-xs text-muted">
                        {i.tamanho} · {i.cor}
                      </span>
                    </span>
                    <span className="text-sm font-semibold tabular">{reais(i.preco * i.qtd)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex gap-2">
              <input
                value={cupom}
                onChange={(e) => setCupom(e.target.value.toUpperCase())}
                placeholder="Cupom de desconto"
                aria-label="Cupom de desconto"
                className="h-11 flex-1 rounded-full bg-white px-4 text-sm ring-1 ring-line-2 outline-none focus:ring-ink"
              />
              <button type="button" onClick={() => setCupomOk(cupom === "PEDAL5")} className="h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white">
                Aplicar
              </button>
            </div>
            <p className="mt-1.5 pl-4 text-xs text-faint">{cupomOk ? "Cupom PEDAL5 aplicado (5%)." : "Dica do protótipo: PEDAL5"}</p>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm tabular">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{reais(subtotal)}</dd>
              </div>
              {descontoCupom > 0 && (
                <div className="flex justify-between text-ok">
                  <dt>Cupom</dt>
                  <dd>− {reais(descontoCupom)}</dd>
                </div>
              )}
              {forma === "pix" && (
                <div className="flex justify-between text-ok">
                  <dt>10% no Pix</dt>
                  <dd>− {reais(subtotal - descontoCupom - precoAVista(subtotal - descontoCupom))}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Frete</dt>
                <dd className={valorFrete === 0 ? "text-ok" : ""}>{valorFrete === 0 ? "Grátis" : reais(valorFrete)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
                <dt>Total</dt>
                <dd>{reais(total)}</dd>
              </div>
            </dl>
            <button className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-red py-3.5 font-semibold text-white transition hover:bg-red-600">
              <Icon name="lock" className="size-4" />
              {forma === "pix" ? "Gerar Pix" : "Pagar agora"}
            </button>
            <p className="mt-3 text-center text-xs text-muted">Ao finalizar, você concorda com os termos e a política de privacidade.</p>
          </div>
        </aside>
      </div>
      {etapa && <Processando etapa={etapa} />}
    </form>
  );
}

function Secao({ n, titulo, sub, children }: { n: number; titulo: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] p-5 ring-1 ring-line md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">{n}</span>
        <div>
          <h2 className="text-lg font-bold">{titulo}</h2>
          {sub && <p className="text-sm text-muted">{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
