/* ============================================================
   Footer — Late Night Ltd.
   左：版權文字 + 公司 Instagram
   右：LEIGHT NINE（藝人）各平台連結
   ============================================================ */
import { socialLinks } from "@/lib/socialLinks";

const companyLinks = socialLinks.filter((s) => s.label.includes("Late Night Ltd."));
const artistLinks = socialLinks.filter((s) => !s.label.includes("Late Night Ltd."));

function Icon({ s }: { s: (typeof socialLinks)[number] }) {
  return (
    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} className="social-icon">
      {s.icon}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.08_0.005_285)] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* 公司 */}
        <div className="flex items-center gap-3">
          <p className="text-white/25 text-xs font-['ButlerCustom']">
            © {new Date().getFullYear()} Late Night Ltd. All rights reserved.
          </p>
          <div className="flex items-center">
            {companyLinks.map((s) => <Icon key={s.label} s={s} />)}
          </div>
        </div>

        {/* 藝人 LEIGHT NINE */}
        <div className="flex items-center gap-3">
          <span className="font-['ButlerCustom'] text-[10px] tracking-[0.3em] text-[#ff0000]">LEIGHT NINE</span>
          <div className="flex items-center gap-0.5">
            {artistLinks.map((s) => <Icon key={s.label} s={s} />)}
          </div>
        </div>
      </div>
    </footer>
  );
}
