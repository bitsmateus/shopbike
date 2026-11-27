"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Atalho entre loja e painel, só no protótipo.
 * Na loja: canto inferior esquerdo (o WhatsApp está à direita), recolhe ao rolar.
 * No painel: sempre recolhido num ponto, no canto inferior esquerdo ao lado da barra lateral.
 * O canto direito fica livre para barras de ação (decisão do antifraude, lote, painéis).
 * Passar o mouse ou focar abre de novo.
 */
export function PrototipoBadge({ destino }: { destino: "loja" | "painel" }) {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const ver = () => setRolou(window.scrollY > 80);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, []);

  const recolhido = (destino === "loja" || rolou) && !aberto;

  return (
    <div
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      onFocus={() => setAberto(true)}
      onBlur={() => setAberto(false)}
      className={`fixed bottom-4 z-30 hidden items-center gap-2 rounded-full bg-ink/90 text-xs text-white shadow-[var(--shadow-pop)] backdrop-blur ${destino === "painel" ? "left-4 sm:flex" : "left-[84px] md:flex"} ${recolhido ? "size-7 justify-center p-0" : "py-1.5 pr-1.5 pl-3.5"}`}
      title={recolhido ? "Protótipo · dados fictícios" : undefined}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-red" />
      {recolhido ? (
        <span className="sr-only">Protótipo · dados fictícios</span>
      ) : (
        <>
          Protótipo · dados fictícios
          <Link href={destino === "painel" ? "/admin" : "/"} className="rounded-full bg-white px-3 py-1 font-semibold text-ink">
            {destino === "painel" ? "Ver painel" : "Ver loja"}
          </Link>
        </>
      )}
    </div>
  );
}
