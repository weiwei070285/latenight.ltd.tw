/* ============================================================
   Home Page — Late Night Ltd.
   Minimal hero with background image + contact section
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";

const HERO_BG = asset("images/hero-bg.webp");

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
        className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover image-fade-in"
            style={{ transform: "scale(1.05)" }}
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
