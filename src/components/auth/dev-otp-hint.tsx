"use client";

import { useEffect, useState } from "react";

/**
 * En mode émulateur (développement local), aucun vrai SMS n'est envoyé :
 * cet encart affiche le code OTP pour pouvoir tester. Invisible en production
 * (variable d'environnement absente et route /api/dev/otp désactivée).
 */
export function DevOtpHint({ phone }: { phone: string | null }) {
  const [code, setCode] = useState<string | null>(null);
  const enabled = !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

  useEffect(() => {
    if (!enabled || !phone) return;
    fetch(`/api/dev/otp?phone=${encodeURIComponent(phone)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setCode(data?.code ?? null))
      .catch(() => {});
  }, [enabled, phone]);

  if (!code) return null;

  return (
    <p className="rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
      Mode développement : aucun vrai SMS n&apos;est envoyé. Votre code est{" "}
      <span className="font-bold tracking-widest">{code}</span>.
    </p>
  );
}
