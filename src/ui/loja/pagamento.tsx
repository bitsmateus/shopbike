"use client";

import { useState } from "react";
import { cn, reais } from "@/lib/format";
import { precoAVista, tabelaParcelas } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";

export type FormaPagamento = "cartao" | "pix" | "dois" | "pixcartao";

const formas: { id: FormaPagamento; rotulo: string; sub: string; icon: "card" | "pix" }[] = [
  { id: "cartao", rotulo: "Cartão de crédito", sub: "até 21x sem juros", icon: "card" },
  { id: "pix", rotulo: "Pix", sub: "10% off, aprovação na hora", icon: "pix" },
  { id: "dois", rotulo: "2 cartões", sub: "divida o valor", icon: "card" },
  { id: "pixcartao", rotulo: "Pix + cartão", sub: "parte em cada", icon: "pix" },
];

/** Bloco de pagamento: mesmo componente no checkout e no link do vendedor. */
export function Pagamento({
  total,
  forma,
  setForma,
  limiteParcelas,
}: {
  total: number;
  forma: FormaPagamento;
  setForma: (f: FormaPagamento) => void;
  limiteParcelas?: number;
}) {
  const [parte1, setParte1] = useState(Math.round(total / 2));
  return (
    <div>
      <div role="radiogroup" aria-label="Forma de pagamento" className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {formas.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={forma === f.id}
            onClick={() => setForma(f.id)}
            className={cn("rounded-2xl p-3 text-left ring-1 transition", forma === f.id ? "bg-white ring-2 ring-ink" : "bg-snow ring-transparent hover:ring-line-2")}
          >
            <Icon name={f.icon} className={cn("size-5", forma === f.id ? "text-red" : "text-muted")} />
            <span className="mt-2 block text-sm font-semibold">{f.rotulo}</span>
            <span className="block text-xs text-muted">{f.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        {forma === "cartao" && <Cartao valor={total} limiteParcelas={limiteParcelas} />}
        {forma === "pix" && <PixInfo valor={precoAVista(total)} />}
        {forma === "dois" && (
          <div className="space-y-5">
            <Divisao total={total} parte1={parte1} setParte1={setParte1} rotulo1="1º cartão" rotulo2="2º cartão" />
            <Cartao valor={parte1} titulo="1º cartão" limiteParcelas={limiteParcelas} />
            <Cartao valor={total - parte1} titulo="2º cartão" limiteParcelas={limiteParcelas} />
            <p className="text-xs text-muted">Se um dos cartões for recusado, o outro é estornado automaticamente.</p>
          </div>
        )}
        {forma === "pixcartao" && (
          <div className="space-y-5">
            <Divisao total={total} parte1={parte1} setParte1={setParte1} rotulo1="No Pix" rotulo2="No cartão" />
            <PixInfo valor={parte1} />
            <Cartao valor={total - parte1} titulo="Cartão" limiteParcelas={limiteParcelas} />
            <p className="text-xs text-muted">O cartão só é cobrado depois que o Pix for confirmado. Se o Pix não for pago em 30 min, nada é cobrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Divisao({ total, parte1, setParte1, rotulo1, rotulo2 }: { total: number; parte1: number; setParte1: (n: number) => void; rotulo1: string; rotulo2: string }) {
  return (
    <div className="rounded-2xl bg-snow p-4">
      <div className="flex justify-between text-sm">
        <span>
          {rotulo1}: <strong className="tabular">{reais(parte1)}</strong>
        </span>
        <span>
          {rotulo2}: <strong className="tabular">{reais(total - parte1)}</strong>
        </span>
      </div>
      <input
        type="range"
        min={Math.round(total * 0.1)}
        max={Math.round(total * 0.9)}
        step={100}
        value={parte1}
        onChange={(e) => setParte1(Number(e.target.value))}
        aria-label="Dividir valor"
        className="mt-3 w-full accent-[var(--color-red)]"
      />
    </div>
  );
}

export function Campo({ label, className = "", ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <input {...rest} className="h-12 w-full rounded-xl bg-white px-4 text-[15px] ring-1 ring-line-2 outline-none transition placeholder:text-faint focus:ring-2 focus:ring-ink" />
    </label>
  );
}

function Cartao({ valor, titulo, limiteParcelas }: { valor: number; titulo?: string; limiteParcelas?: number }) {
  const opcoes = tabelaParcelas(valor, limiteParcelas);
  const [num, setNum] = useState("");
  return (
    <fieldset className="space-y-3">
      {titulo && <legend className="mb-2 text-sm font-bold">{titulo}</legend>}
      <Campo
        label="Número do cartão"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        value={num}
        onChange={(e) =>
          setNum(
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 16)
              .replace(/(\d{4})(?=\d)/g, "$1 "),
          )
        }
      />
      <Campo label="Nome impresso no cartão" autoComplete="cc-name" placeholder="Como está no cartão" />
      <div className="grid grid-cols-2 gap-3">
        <Campo label="Validade" autoComplete="cc-exp" placeholder="MM/AA" inputMode="numeric" />
        <Campo label="CVV" autoComplete="cc-csc" placeholder="123" inputMode="numeric" />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-2">Parcelas</span>
        <select className="h-12 w-full rounded-xl bg-white px-4 text-[15px] ring-1 ring-line-2 outline-none focus:ring-2 focus:ring-ink">
          {opcoes.map((o) => (
            <option key={o.parcelas}>
              {o.parcelas === 1 ? `1x de ${reais(o.valor)} à vista` : `${o.parcelas}x de ${reais(o.valor)} sem juros`}
            </option>
          ))}
        </select>
      </label>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Icon name="lock" className="size-3.5" /> Os dados do cartão vão direto para a Rede e não ficam salvos.
      </p>
    </fieldset>
  );
}

function PixInfo({ valor }: { valor: number }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-ok-50 p-4 text-sm">
      <Icon name="pix" className="mt-0.5 size-5 shrink-0 text-ok" />
      <div>
        <p className="font-semibold">
          Pague <span className="tabular">{reais(valor)}</span> no Pix
        </p>
        <p className="mt-0.5 text-muted">O QR Code aparece no próximo passo. A confirmação é automática e o pagamento precisa sair de uma conta no CPF do comprador.</p>
      </div>
    </div>
  );
}

/** Simulação do fluxo pós-clique: antifraude → 3DS → conclusão. */
export function Processando({ etapa }: { etapa: "antifraude" | "3ds" }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" role="alertdialog" aria-live="polite" aria-label="Processando pagamento">
      <div className="rise w-full max-w-sm rounded-[28px] bg-white p-7 text-center shadow-[var(--shadow-pop)]">
        {etapa === "antifraude" ? (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-snow">
              <Icon name="shield" className="size-7 animate-pulse text-ink" />
            </div>
            <p className="mt-4 font-bold">Verificando a segurança da compra</p>
            <p className="mt-1 text-sm text-muted">Isso leva poucos segundos.</p>
          </>
        ) : (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-50">
              <Icon name="device" className="size-7 text-red" />
            </div>
            <p className="mt-4 font-bold">Confirme no app do seu banco</p>
            <p className="mt-1 text-sm text-muted">Seu banco pediu uma confirmação (3D Secure). Abra o app ou digite o código recebido por SMS.</p>
            <div className="mx-auto mt-5 flex w-fit gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="grid size-10 place-items-center rounded-lg font-bold ring-1 ring-line-2 tabular">
                  {i < 3 ? "•" : ""}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
