"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/ui/icons";

export function WhatsFlutuante() {
  return (
    <a
      href="https://wa.me/"
      className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#1f9d55] py-3 pr-5 pl-4 font-semibold text-white shadow-[var(--shadow-pop)] transition hover:brightness-110"
      aria-label="Comprar pelo WhatsApp"
    >
      <Icon name="whatsapp" className="size-6" />
      <span className="hidden sm:inline">Compre pelo WhatsApp</span>
    </a>
  );
}

const CHAVE = "shopbike:cookies";

export function AvisoCookies() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lê o consentimento salvo
      if (!localStorage.getItem(CHAVE)) setVisivel(true);
    } catch {}
  }, []);
  if (!visivel) return null;
  const responder = (v: string) => {
    try {
      localStorage.setItem(CHAVE, v);
    } catch {}
    setVisivel(false);
  };
  return (
    <div className="rise fixed inset-x-4 bottom-20 z-30 mx-auto max-w-xl rounded-3xl bg-white p-4 shadow-[var(--shadow-pop)] ring-1 ring-line sm:bottom-6">
      <p className="text-sm text-muted">
        Usamos cookies para melhorar sua experiência e medir campanhas. Você escolhe o que aceita. <a className="font-semibold text-ink underline" href="#">Política de privacidade</a>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => responder("todos")} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Aceitar todos
        </button>
        <button onClick={() => responder("essenciais")} className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line-2 hover:bg-snow">
          Só essenciais
        </button>
      </div>
    </div>
  );
}
