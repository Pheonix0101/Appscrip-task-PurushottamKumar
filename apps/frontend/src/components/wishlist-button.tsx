"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "./icons";

const storageKey = "appscrip-wishlist";

export function WishlistButton({ id, title }: { id: number; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as number[];
      setSaved(ids.includes(id));
    } catch { /* Ignore unavailable or malformed local storage. */ }
  }, [id]);

  function toggle() {
    try {
      const ids = new Set<number>(JSON.parse(localStorage.getItem(storageKey) ?? "[]") as number[]);
      if (ids.has(id)) ids.delete(id); else ids.add(id);
      localStorage.setItem(storageKey, JSON.stringify([...ids]));
      setSaved(ids.has(id));
    } catch { setSaved((current) => !current); }
  }

  return <button className={`wishlist-button${saved ? " is-saved" : ""}`} type="button" aria-label={`${saved ? "Remove" : "Add"} ${title} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} onClick={toggle}><HeartIcon /></button>;
}
