/* ============================================================
   Footer — Late Night Ltd.
   Minimal footer with copyright only
   ============================================================ */

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.08_0.005_285)] border-t border-white/5">
      {/* Copyright */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 border-t border-white/5">
        <p className="text-white/25 text-xs font-['ButlerCustom'] text-center">
          © {new Date().getFullYear()} Late Night Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
