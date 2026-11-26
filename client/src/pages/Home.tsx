/* ============================================================
   Home Page — Late Night Ltd.
   Minimal hero with background image + contact section
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";

const HERO_BG = asset("images/hero-logo-landscape.webp");
const LOOP_VIDEO = asset("leight-nine-loop.mp4");
const LOOP_POSTER = asset("images/leight-nine-loop-poster.webp");

/** Silent looping video that links to DISCOGRAPHY.
 *  Desktop: a small "LEIGHT NINE →" tag follows the cursor while hovering.
 *  Touch screens: the tag sits fixed in the bottom-left corner. */
function DiscographyVideo() {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="border-t border-white/5">
      <Link
        href="/discography"
        aria-label="LEIGHT NINE — Discography"
        className="group relative block aspect-video max-h-[85vh] w-full overflow-hidden bg-black md:cursor-none"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setCursor(null)}
      >
        <video
          className="h-full w-full object-cover"
          src={LOOP_VIDEO}
          poster={LOOP_POSTER}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/0" />

        {/* Touch screens / no hover: fixed label */}
        <span className="pointer-events-none absolute bottom-5 left-6 font-['ButlerCustom'] text-xs tracking-[0.35em] text-white/80 md:hidden">
          LEIGHT NINE →
        </span>

        {/* Desktop: label follows the cursor */}
        {cursor && (
          <span
            className="pointer-events-none absolute hidden whitespace-nowrap border border-white/40 bg-black/40 px-3 py-1.5 font-['ButlerCustom'] text-xs tracking-[0.3em] text-white backdrop-blur-sm md:block"
            style={{ left: cursor.x, top: cursor.y, transform: "translate(-50%, -50%)" }}
          >
            LEIGHT NINE →
          </span>
        )}
      </Link>
    </section>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[75svh] min-h-[480px] md:h-screen md:min-h-[600px] flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            /* Landscape 16:9 logo on black; the artwork is the middle ~30% of the width.
               Phones: show the whole image, enlarged so the artwork fills most of the width.
               Desktop: fill the screen. */
            className="w-full h-full object-contain scale-[3] md:object-cover md:scale-100 image-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.005_285/0.5)] via-[oklch(0.10_0.005_285/0.3)] to-[oklch(0.10_0.005_285/0.9)]" />
        </div>

        {/* Empty hero content area */}
        <div
          className="relative z-10 text-center px-6"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1), transform 1000ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </section>

      {/* ── LEIGHT NINE video → Discography ── */}
      <DiscographyVideo />

      {/* Footer Info */}
      <section className="page-section py-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center space-y-4">
            <p className="text-white/40 text-xs font-['ButlerCustom'] tracking-[0.1em]">
              ☪︎* ☁︎.₊ ｡˚𖤐◝˚☽⊹
            </p>
            <p className="text-white/40 text-sm font-['ButlerCustom'] leading-relaxed">
              𝘝𝘪𝘴𝘶𝘢𝘭 𝘔𝘦𝘥𝘪𝘢／𝘔𝘶𝘴𝘪𝘤 𝘗𝘳𝘰𝘥𝘶𝘤𝘵𝘪𝘰𝘯 / 𝘌𝘷𝘦𝘯𝘵 𝘊𝘰𝘰𝘳𝘥𝘪𝘯𝘢𝘵𝘪𝘰𝘯／𝘗𝘳𝘰𝘫𝘦𝘤𝘵 𝘔𝘢𝘯𝘢𝘨𝘦𝘮𝘦𝘯𝘵
            </p>
            <p className="text-white/40 text-xs font-['ButlerCustom'] tracking-[0.1em]">
              📩 latenight.ltd.tw@gmail.com
            </p>
          </div>
        </div>
      </section>

    </Layout>
  );
}
