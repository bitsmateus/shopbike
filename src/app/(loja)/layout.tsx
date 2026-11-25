import { CarrinhoProvider } from "@/ui/loja/carrinho";
import { AvisoCookies, WhatsFlutuante } from "@/ui/loja/extras";
import { Footer } from "@/ui/loja/footer";
import { Header } from "@/ui/loja/header";
import { MiniCarrinho } from "@/ui/loja/mini-carrinho";
import { PrototipoBadge } from "@/ui/prototipo-badge";

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <MiniCarrinho />
      <WhatsFlutuante />
      <AvisoCookies />
      <PrototipoBadge destino="painel" />
    </CarrinhoProvider>
  );
}
