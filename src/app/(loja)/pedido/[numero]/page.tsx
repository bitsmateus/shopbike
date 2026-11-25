import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/ui/icons";
import { QrFalso } from "@/ui/qr-falso";
import { CopiarPix } from "./copiar-pix";

export const metadata: Metadata = { title: "Pedido recebido" };

type Props = { params: Promise<{ numero: string }>; searchParams: Promise<{ forma?: string }> };

export default async function PedidoConcluido({ params, searchParams }: Props) {
  const { numero } = await params;
  const { forma = "cartao" } = await searchParams;
  const pix = forma === "pix" || forma === "pixcartao";

  const etapas = pix
    ? [
        ["Pedido recebido", true],
        ["Aguardando Pix", true],
        ["Pagamento confirmado", false],
        ["Em separação", false],
        ["Enviado", false],
      ]
    : [
        ["Pedido recebido", true],
        ["Pagamento aprovado", true],
        ["Em separação", false],
        ["Nota fiscal", false],
        ["Enviado", false],
      ];

  return (
    <div className="container-loja max-w-3xl pt-10">
      <div className="text-center">
        <div className={`mx-auto grid size-16 place-items-center rounded-full ${pix ? "bg-snow" : "bg-ok-50"}`}>
          <Icon name={pix ? "pix" : "check"} className={`size-8 ${pix ? "text-ink" : "text-ok"}`} />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{pix ? "Falta só pagar o Pix" : "Pedido confirmado!"}</h1>
        <p className="mt-2 text-muted">
          Pedido <strong className="text-ink">#{numero}</strong> · enviamos os detalhes para o seu e-mail e WhatsApp.
        </p>
      </div>

      {pix && (
        <div className="mt-8 grid items-center gap-6 rounded-[28px] p-6 ring-1 ring-line md:grid-cols-[220px_1fr]">
          <QrFalso className="mx-auto w-[220px] rounded-2xl ring-1 ring-line" />
          <div>
            <p className="text-sm text-muted">Valor</p>
            <p className="text-3xl font-bold tabular">R$ 4.049,10</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-warn-50 px-3 py-1 text-xs font-semibold text-warn">
              <Icon name="clock" className="size-3.5" /> Expira em 29:41
            </p>
            <ol className="mt-4 space-y-1.5 text-sm text-muted">
              <li>1. Abra o app do seu banco e escolha Pix.</li>
              <li>2. Leia o QR Code ou use o copia e cola.</li>
              <li>3. Pague de uma conta no seu CPF. A confirmação é automática.</li>
            </ol>
            <CopiarPix />
          </div>
        </div>
      )}

      <div className="mt-8 rounded-[28px] bg-snow p-6">
        <h2 className="font-bold">Acompanhe seu pedido</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-5">
          {etapas.map(([t, feito], i) => (
            <li key={t as string} className="flex items-center gap-3 sm:flex-col sm:text-center">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${feito ? "bg-ink text-white" : "bg-white text-faint ring-1 ring-line-2"}`}>
                {feito ? <Icon name="check" className="size-4" /> : i + 1}
              </span>
              <span className={`text-sm ${feito ? "font-semibold" : "text-muted"}`}>{t}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/conta" className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">
          Ver meus pedidos
        </Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-full px-6 font-semibold ring-1 ring-line-2">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
