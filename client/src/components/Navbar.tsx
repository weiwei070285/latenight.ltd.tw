/* ============================================================
   Navbar — Late Night Ltd.
   Design: Transparent top nav → frosted glass on scroll
   Font: Butler Custom 500, 0.75rem, letter-spacing 0.12em,
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { requestCheckoutScroll, useCartCount } from "@/lib/cartStore";
import { socialLinks } from "@/lib/socialLinks";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PROJECT", href: "/project" },
  { label: "LIVE", href: "/tour" },
  { label: "DISCOGRAPHY", href: "/discography" },
  { label: "VIDEO", href: "/video" },
  { label: "SHOP", href: "/shop" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartCount();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-[oklch(0.10_0.005_285/0.96)] backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Social icons — left (desktop) */}
          <div className="hidden lg:flex items-center gap-0.5">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Logo — center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none group">
            <span className="font-['ButlerCustom'] font-bold text-white text-base lg:text-lg tracking-[0.15em] group-hover:text-[oklch(0.70_0.02_280)] transition-colors duration-200">
              LATE NIGHT LTD.
            </span>
            <span className="font-['ButlerCustom'] text-[0.55rem] tracking-[0.22em] text-white/35 mt-0.5">
              夢迴夜行有限公司
            </span>
          </Link>

          {/* Cart + mobile menu — right */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              onClick={() => { if (cartCount > 0) requestCheckoutScroll(); }}
              className={`social-icon relative ${cartCount > 0 ? "flex" : "hidden lg:flex"}`}
              aria-label={cartCount > 0 ? `購物車 ${cartCount} 件，前往結帳` : "Shop"}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span
                  key={cartCount /* 數字改變時重新播放跳動動畫 */}
                  className="cart-badge-bump absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff0000] px-1 text-[10px] font-semibold leading-none text-white"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden social-icon"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav bar */}
        <nav className="hidden lg:flex items-center justify-center gap-8 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${location === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-[oklch(0.10_0.005_285/0.98)] backdrop-blur-md border-t border-white/5">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3.5 text-xs font-medium tracking-[0.12em] font-['ButlerCustom'] transition-colors duration-200 border-b border-white/5 ${
                  location === item.href
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center flex-wrap gap-2 px-6 py-5 border-t border-white/5">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
