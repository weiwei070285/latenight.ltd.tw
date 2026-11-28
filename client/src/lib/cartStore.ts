/* ============================================================
   Shared shopping cart — used by the SHOP page and the navbar badge.
   Keeps { productId: quantity } in memory and in localStorage, so the
   cart survives moving between pages and reloading.
   ============================================================ */
import { useSyncExternalStore } from "react";

export type Cart = Record<number, number>;

const STORAGE_KEY = "lnl-cart-v1";
const listeners = new Set<() => void>();

function load(): Cart {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return {};
    const clean: Cart = {};
    for (const [k, v] of Object.entries(parsed)) {
      const qty = Math.floor(Number(v));
      if (Number.isFinite(qty) && qty > 0) clean[Number(k)] = Math.min(qty, 99);
    }
    return clean;
  } catch {
    return {};
  }
}

let cart: Cart = typeof window === "undefined" ? {} : load();

function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable (private mode etc.) — cart still works for this visit */
  }
}

export function setCart(next: Cart | ((current: Cart) => Cart)) {
  cart = typeof next === "function" ? next(cart) : next;
  save();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // keep several open tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cart = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): [Cart, typeof setCart] {
  const value = useSyncExternalStore(subscribe, () => cart, () => cart);
  return [value, setCart];
}

export function useCartCount(): number {
  const [c] = useCart();
  return Object.values(c).reduce((sum, q) => sum + q, 0);
}

/* ---- "go to checkout" from the navbar ---- */
let pendingCheckoutScroll = false;
const CHECKOUT_EVENT = "lnl:go-checkout";

/** Ask the SHOP page to scroll to its checkout section (now if open, or right after it opens). */
export function requestCheckoutScroll() {
  pendingCheckoutScroll = true;
  window.dispatchEvent(new Event(CHECKOUT_EVENT));
}

/** Used by the SHOP page: runs `scroll` now if a request is pending, and on future requests. */
export function onCheckoutRequest(scroll: () => void) {
  const run = () => {
    if (!pendingCheckoutScroll) return;
    pendingCheckoutScroll = false;
    scroll();
  };
  run();
  window.addEventListener(CHECKOUT_EVENT, run);
  return () => window.removeEventListener(CHECKOUT_EVENT, run);
}
