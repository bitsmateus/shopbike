import Link from "next/link";
import { LogoNX, LogoShopBike } from "@/ui/brand";
import { Icon } from "@/ui/icons";

const colunas = [
  { titulo: "Comprar", links: [["Mountain bike", "/c/mtb"], ["Speed", "/c/speed"], ["Elétricas", "/c/eletrica"], ["Seminovas", "/c/seminovas"], ["Peças", "/c/pecas"], ["Acessórios", "/c/acessorios"]] },
  { titulo: "Atendimento", links: [["Como comprar", "#"], ["Trocas e devoluções", "#"], ["Entrega e retirada", "#"], ["Minha conta", "/conta"], ["Rastrear pedido", "/conta"]] },
  { titulo: "ShopBike", links: [["Quem somos", "#"], ["Nossas lojas", "#"], ["Oficina", "/oficina"], ["Trabalhe conosco", "#"], ["Privacidade (LGPD)", "#"]] },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-snow">
      <div className="container-loja grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <LogoShopBike className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Bikes, peças, acessórios e vestuário em Tubarão/SC desde sempre. Oficina própria e atendimento pelo WhatsApp.</p>
          <div className="mt-5 flex gap-2">
            {(["whatsapp", "mail", "pin"] as const).map((i) => (
              <span key={i} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line">
                <Icon name={i} className="size-5" />
              </span>
            ))}
          </div>
        </div>
        {colunas.map((c) => (
          <div key={c.titulo}>
            <h3 className="text-sm font-bold">{c.titulo}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {c.links.map(([rotulo, href]) => (
                <li key={rotulo}>
                  <Link href={href} className="hover:text-ink">
                    {rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-loja flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Mastercard", "Elo", "Amex", "Hipercard", "Pix"].map((b) => (
              <span key={b} className="rounded-md bg-white px-2 py-1 font-semibold text-ink-2 ring-1 ring-line">
                {b}
              </span>
            ))}
            <span className="ml-2 inline-flex items-center gap-1">
              <Icon name="lock" className="size-3.5" /> Compra protegida com 3D Secure
            </span>
          </div>
          <div className="flex items-center gap-2">
            © 2026 ShopBike · Tubarão/SC
            <span className="mx-2 h-4 w-px bg-line-2" />
            Plataforma <LogoNX className="h-3.5 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
