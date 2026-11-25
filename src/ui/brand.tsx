import Image from "next/image";

/** Logo da loja (vitrine). */
export function LogoShopBike({ className = "h-10 w-auto", white = false }: { className?: string; white?: boolean }) {
  return (
    <Image
      src={white ? "/brand/shopbike-white.png" : "/brand/shopbike.png"}
      alt="ShopBike — Bikes e acessórios"
      width={530}
      height={226}
      priority
      className={className}
    />
  );
}

export function LogoNX({ className = "h-5 w-auto" }: { className?: string }) {
  return <Image src="/brand/nx.png" alt="NX Digital" width={850} height={323} className={className} />;
}

/** Logo do sistema (painel e login): ShopBike + NX juntas. */
export function LogoSistema({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoShopBike className={compact ? "h-8 w-auto" : "h-11 w-auto"} />
      <span aria-hidden className="h-7 w-px bg-line-2" />
      <span className="inline-flex flex-col items-start leading-none">
        <LogoNX className={compact ? "h-4 w-auto" : "h-5 w-auto"} />
        {!compact && <span className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-faint uppercase">Plataforma</span>}
      </span>
    </span>
  );
}
