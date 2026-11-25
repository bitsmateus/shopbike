import type { Metadata, Viewport } from "next";
import "@fontsource-variable/urbanist";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ShopBike | Bikes e acessórios em Tubarão/SC",
    template: "%s | ShopBike",
  },
  description:
    "Bicicletas, peças, acessórios e vestuário. Specialized, Oggi, Caloi, Shimano e Sram. Em até 21x no cartão e 10% off no Pix.",
  robots: { index: false, follow: false }, // protótipo
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
