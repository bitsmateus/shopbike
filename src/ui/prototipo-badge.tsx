"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Atalho entre loja e painel, só no protótipo. Na loja fica à esquerda (o WhatsApp está à direita);
 * no painel, à direita (o dock está à esquerda). Ao rolar, recolhe para um ponto para não cobrir
 * a última coluna das tabelas; passar o mouse ou focar abre de novo.
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

  const recolhido = rolou && !aberto;

  return (
    <div
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      onFocus={() => setAberto(true)}
      onBlur={() => setAberto(false)}
      className={`fixed bottom-4 z-30 hidden items-center gap-2 rounded-full bg-ink/90 text-xs text-white shadow-[var(--shadow-pop)] backdrop-blur sm:flex ${destino === "painel" ? "left-4" : "right-4"} ${recolhido ? "size-7 justify-center p-0" : "py-1.5 pr-1.5 pl-3.5"}`}
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
