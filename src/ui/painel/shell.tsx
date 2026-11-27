"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import { LogoSistema } from "@/ui/brand";
import { Icon, type IconName } from "@/ui/icons";
import { notificacoesInternas } from "@/mock/painel";
import { areas } from "./navegacao";

const casa = (path: string, href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));
const areaDe = (path: string) => areas.find((a) => casa(path, a.href) || a.subs?.some((s) => casa(path, s.href)));

const dock: { icon: IconName; rotulo: string; href?: string }[] = [
  { icon: "search", rotulo: "Buscar (Ctrl K)" },
  { icon: "link", rotulo: "Novo link de pagamento", href: "/admin/links" },
  { icon: "truck", rotulo: "Expedição", href: "/admin/expedicao" },
  { icon: "chart", rotulo: "Relatórios", href: "/admin/relatorios" },
  { icon: "menu", rotulo: "Mapa do sistema", href: "/admin/mapa" },
  { icon: "store", rotulo: "Abrir a loja", href: "/" },
  { icon: "gear", rotulo: "Configurações", href: "/admin/configuracoes" },
];

export function PainelShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [busca, setBusca] = useState(false);
  const [avisos, setAvisos] = useState(false);
  const area = areaDe(path);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setBusca((v) => !v);
      }
      if (e.key === "Escape") {
        setBusca(false);
        setAvisos(false);
      }
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
          <Link href="/admin" className="glass flex h-12 shrink-0 items-center rounded-full px-4" aria-label="Painel ShopBike">
            <LogoSistema compact />
          </Link>
          <nav aria-label="Áreas do painel" className="glass scrollbar-none order-3 flex h-12 w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full p-1 xl:order-none xl:mx-auto xl:w-auto">
            {areas
              .filter((a) => !a.noMenu)
              .map((a) => {
                const ativa = area === a;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    aria-current={ativa ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-full shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition",
                      ativa ? "bg-ink text-white shadow-[0_6px_16px_-8px_#1a191799]" : "text-ink-2 hover:bg-white/70",
                    )}
                  >
                    {a.rotulo}
                    {a.badge ? <span className="grid min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] font-bold text-white">{a.badge}</span> : null}
                  </Link>
                );
              })}
          </nav>
          <div className="relative ml-auto flex items-center gap-2 xl:ml-0">
            <button onClick={() => setBusca(true)} className="glass grid size-11 place-items-center rounded-full" aria-label="Buscar">
              <Icon name="search" />
            </button>
            <button onClick={() => setAvisos((v) => !v)} aria-expanded={avisos} className="glass relative grid size-11 place-items-center rounded-full" aria-label="Notificações, 3 novas">
              <Icon name="bell" />
              <span className="absolute top-3 right-3.5 size-2 rounded-full bg-red ring-2 ring-white" />
            </button>
            <Link href="/admin/conta" className="glass flex h-11 items-center gap-2 rounded-full pr-1.5 pl-1.5 2xl:pr-4" aria-label="Minha conta">
              <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-bold text-white">GE</span>
              <span className="hidden text-left text-sm leading-tight 2xl:block">
                <span className="block font-semibold">Gerência</span>
                <span className="text-xs text-muted">Administrador</span>
              </span>
            </Link>
            {avisos && <CentralAvisos fechar={() => setAvisos(false)} />}
          </div>
        </div>
      </header>

      {/* Dock: vertical no desktop, rodapé no celular */}
      <nav
        aria-label="Atalhos"
        className="glass fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-full p-1.5 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-5 md:-translate-y-1/2 md:flex-col md:gap-1"
      >
        {dock.map((d) => {
          const ativo = d.href && d.href !== "/" && (d.href === "/admin/configuracoes" ? area?.href === "/admin/configuracoes" : casa(path, d.href));
          const cls = cn("group relative grid size-11 place-items-center rounded-full transition", ativo ? "bg-ink text-white" : "text-ink-2 hover:bg-white");
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
            <button key={d.rotulo} className={cls} aria-label={d.rotulo} onClick={() => setBusca(true)}>
              <Icon name={d.icon} />
              {tip}
            </button>
          );
        })}
      </nav>

      <main id="painel" className="mx-auto max-w-[1840px] px-[clamp(12px,1.6vw,28px)] pt-4 pb-28 md:pl-[96px] md:pb-12">
        {area?.subs && (
          <nav aria-label={`Seções de ${area.rotulo}`} className="scrollbar-none mb-3 flex gap-1 overflow-x-auto">
            {area.subs.map((s) => {
              const ativa = casa(path, s.href);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={ativa ? "page" : undefined}
                  className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition", ativa ? "bg-white text-ink shadow-[var(--shadow-soft)] ring-1 ring-black/5" : "text-muted hover:text-ink")}
                >
                  {s.rotulo}
                  {s.fase === 2 && <span className="ml-1.5 rounded-full bg-info-50 px-1.5 py-0.5 text-[10px] font-bold text-info">F2</span>}
                </Link>
              );
            })}
          </nav>
        )}
        {children}
      </main>

      {busca && <BuscaGlobal fechar={() => setBusca(false)} />}
    </div>
  );
}

function CentralAvisos({ fechar }: { fechar: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) fechar();
    };
    setTimeout(() => document.addEventListener("mousedown", f));
    return () => document.removeEventListener("mousedown", f);
  }, [fechar]);
  return (
    <div ref={ref} className="glass-strong rise absolute top-[calc(100%+10px)] right-0 z-50 w-[min(380px,calc(100vw-24px))] rounded-[22px] p-2" role="dialog" aria-label="Notificações">
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <p className="font-bold">Notificações</p>
        <button className="text-xs font-semibold text-muted hover:text-ink">Marcar todas como lidas</button>
      </div>
      <ul>
        {notificacoesInternas.map((n) => (
          <li key={n.texto} className="flex gap-3 rounded-2xl px-3 py-2.5 hover:bg-snow">
            <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-snow">
              <Icon name={n.icone} className="size-4" />
              {n.nova && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red ring-2 ring-white" />}
            </span>
            <span className="text-sm">
              <span className={n.nova ? "font-semibold" : ""}>{n.texto}</span>
              <span className="block text-xs text-muted">{n.quando}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link href="/admin/notificacoes" onClick={fechar} className="block rounded-2xl px-3 py-2.5 text-center text-sm font-semibold hover:bg-snow">
        Configurar alertas
      </Link>
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
          {(
            [
              ["doc", "Pedido #48212 · Lucas Ferreira Antunes", "Em análise", "/admin/pedidos?pedido=48212"],
              ["shield", "Fila do antifraude", "2 pedidos", "/admin/antifraude"],
              ["box", "Oggi Big Wheel 7.0", "SKU OGBW7", "/admin/catalogo"],
              ["users", "Rafael Medeiros", "Cliente · Tubarão/SC", "/admin/clientes/c1"],
              ["truck", "Expedição", "2 para separar", "/admin/expedicao"],
            ] as const
          ).map(([i, t, s, href]) => (
            <Link key={t} href={href} onClick={fechar} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-snow">
              <span className="grid size-9 place-items-center rounded-full bg-snow">
                <Icon name={i} className="size-4" />
              </span>
              <span className="flex-1 font-medium">{t}</span>
              <span className="text-sm text-muted">{s}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
