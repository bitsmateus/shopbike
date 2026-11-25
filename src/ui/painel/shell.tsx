"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { LogoSistema } from "@/ui/brand";
import { Icon, type IconName } from "@/ui/icons";
import { filaRevisao } from "@/mock/operacao";

const nav = [
  { href: "/admin", rotulo: "Visão geral" },
  { href: "/admin/pedidos", rotulo: "Pedidos" },
  { href: "/admin/antifraude", rotulo: "Antifraude", badge: filaRevisao.length },
  { href: "/admin/catalogo", rotulo: "Catálogo" },
  { href: "/admin/links", rotulo: "Links de pagamento" },
  { href: "/admin/integracoes", rotulo: "Integrações" },
];

const dock: { icon: IconName; rotulo: string; href?: string }[] = [
  { icon: "search", rotulo: "Buscar (⌘K)" },
  { icon: "link", rotulo: "Novo link de pagamento", href: "/admin/links" },
  { icon: "shield", rotulo: "Fila do antifraude", href: "/admin/antifraude" },
  { icon: "sync", rotulo: "Integração Bruning", href: "/admin/integracoes" },
  { icon: "store", rotulo: "Abrir a loja", href: "/" },
  { icon: "gear", rotulo: "Configurações" },
];

export function PainelShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [busca, setBusca] = useState(false);
  const ativo = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setBusca((v) => !v);
      }
      if (e.key === "Escape") setBusca(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className="painel-bg">
      <a href="#painel" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 px-[clamp(12px,1.6vw,28px)] pt-3">
        <div className="mx-auto flex max-w-[1840px] flex-wrap items-center gap-3 xl:flex-nowrap">
          <Link href="/admin" className="glass flex h-14 shrink-0 items-center rounded-full px-5" aria-label="Painel ShopBike">
            <LogoSistema compact />
          </Link>
          <nav aria-label="Áreas do painel" className="glass scrollbar-none order-3 flex h-14 w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 xl:order-none xl:mx-auto xl:w-auto">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={ativo(n.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-full shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition",
                  ativo(n.href) ? "bg-ink text-white shadow-[0_6px_16px_-8px_#1a191799]" : "text-ink-2 hover:bg-white/70",
                )}
              >
                {n.rotulo}
                {n.badge ? <span className={cn("grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold", ativo(n.href) ? "bg-red text-white" : "bg-red text-white")}>{n.badge}</span> : null}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <button onClick={() => setBusca(true)} className="glass grid size-12 place-items-center rounded-full" aria-label="Buscar">
              <Icon name="search" />
            </button>
            <button className="glass relative grid size-12 place-items-center rounded-full" aria-label="Notificações, 3 novas">
              <Icon name="bell" />
              <span className="absolute top-3 right-3.5 size-2 rounded-full bg-red ring-2 ring-white" />
            </button>
            <button className="glass flex h-12 items-center gap-2 rounded-full pr-4 pl-1.5" aria-label="Conta">
              <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-bold text-white">GE</span>
              <span className="hidden text-left text-sm leading-tight sm:block">
                <span className="block font-semibold">Gerência</span>
                <span className="text-xs text-muted">Administrador</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Dock: vertical no desktop, rodapé no celular */}
      <nav
        aria-label="Atalhos"
        className="glass fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-full p-1.5 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-5 md:-translate-y-1/2 md:flex-col md:gap-1"
      >
        {dock.map((d) => {
          const cls = "group relative grid size-11 place-items-center rounded-full text-ink-2 transition hover:bg-white";
          const tip = (
            <span className="pointer-events-none absolute left-[calc(100%+12px)] hidden rounded-full bg-ink px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100 md:block">
              {d.rotulo}
            </span>
          );
          return d.href ? (
            <Link key={d.rotulo} href={d.href} className={cls} aria-label={d.rotulo}>
              <Icon name={d.icon} />
              {tip}
            </Link>
          ) : (
            <button key={d.rotulo} className={cls} aria-label={d.rotulo} onClick={d.icon === "search" ? () => setBusca(true) : undefined}>
              <Icon name={d.icon} />
              {tip}
            </button>
          );
        })}
      </nav>

      <main id="painel" className="mx-auto max-w-[1840px] px-[clamp(12px,1.6vw,28px)] pt-6 pb-28 md:pl-[100px] md:pb-12">
        {children}
      </main>

      {busca && <BuscaGlobal fechar={() => setBusca(false)} />}
    </div>
  );
}

function BuscaGlobal({ fechar }: { fechar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-ink/25 p-4 pt-[12vh] backdrop-blur-sm" role="dialog" aria-modal aria-label="Busca global">
      <button className="absolute inset-0" aria-label="Fechar busca" onClick={fechar} />
      <div className="glass-strong rise relative mx-auto w-full max-w-2xl rounded-[26px] p-2">
        <label className="flex h-14 items-center gap-3 px-4">
          <Icon name="search" className="text-faint" />
          <input autoFocus placeholder="Buscar pedido, cliente, CPF, produto ou SKU…" className="h-full flex-1 bg-transparent text-lg outline-none placeholder:text-faint" />
          <kbd className="rounded-md bg-snow px-2 py-1 text-xs text-muted">Esc</kbd>
        </label>
        <div className="border-t border-line p-2">
          <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-faint uppercase">Sugestões</p>
          {[
            ["doc", "Pedido #48212 · Lucas Ferreira Antunes", "Em análise"],
            ["shield", "Fila do antifraude", "2 pedidos"],
            ["box", "Oggi Big Wheel 7.0", "SKU OGBW7"],
            ["users", "Jéssica Pacheco", "Cliente · Laguna/SC"],
          ].map(([i, t, s]) => (
            <button key={t} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-snow">
              <span className="grid size-9 place-items-center rounded-full bg-snow">
                <Icon name={i as IconName} className="size-4" />
              </span>
              <span className="flex-1 font-medium">{t}</span>
              <span className="text-sm text-muted">{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
