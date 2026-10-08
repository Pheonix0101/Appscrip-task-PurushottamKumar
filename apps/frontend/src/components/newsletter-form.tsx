"use client";

import { FormEvent, useEffect, useState } from "react";

type Notice = { kind: "success" | "error"; title: string; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setNotice(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? "Please try again in a moment.");
      }

      setEmail("");
      setNotice({ kind: "success", title: "You're on the list!", message: "Look out for updates from mettā muse." });
    } catch (error) {
      setNotice({
        kind: "error",
        title: "We couldn't subscribe you",
        message: error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setPending(false);
    }
  }

  return <>
    <form className="footer-subscribe" aria-label="Newsletter signup" aria-busy={pending} onSubmit={subscribe}>
      <label className="visually-hidden" htmlFor="footer-email">Email address</label>
      <input id="footer-email" type="email" placeholder="Enter your e-mail..." autoComplete="email" maxLength={254} required value={email} onChange={(event) => { setEmail(event.target.value); setNotice(null); }} disabled={pending} />
      <button type="submit" disabled={pending}>{pending ? "Subscribing…" : "Subscribe"}</button>
    </form>
    {notice && <div className={`newsletter-notice newsletter-notice-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
      <span className="newsletter-notice-icon" aria-hidden="true">{notice.kind === "success" ? "✓" : "!"}</span>
      <span className="newsletter-notice-copy"><strong>{notice.title}</strong><span>{notice.message}</span></span>
      <button type="button" className="newsletter-notice-dismiss" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
    </div>}
  </>;
}
