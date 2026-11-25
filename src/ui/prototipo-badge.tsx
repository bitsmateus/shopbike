import Link from "next/link";

/** Atalho entre loja e painel, só no protótipo. Na loja fica à esquerda (o WhatsApp está à direita); no painel, à direita (o dock está à esquerda). */
export function PrototipoBadge({ destino }: { destino: "loja" | "painel" }) {
  return (
    <div
      className={`fixed bottom-4 z-30 hidden items-center gap-2 rounded-full bg-ink/90 py-1.5 pr-1.5 pl-3.5 text-xs text-white shadow-[var(--shadow-pop)] backdrop-blur sm:flex ${destino === "painel" ? "left-4" : "right-4"}`}
    >
      <span className="size-1.5 rounded-full bg-red" />
      Protótipo · dados fictícios
      <Link href={destino === "painel" ? "/admin" : "/"} className="rounded-full bg-white px-3 py-1 font-semibold text-ink">
        {destino === "painel" ? "Ver painel" : "Ver loja"}
      </Link>
    </div>
  );
}
