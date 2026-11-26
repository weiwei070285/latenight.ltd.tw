/* ============================================================
   Contact Page — Late Night Ltd.
   Contact info, services, and inquiry form
   ============================================================ */
import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import Layout from "@/components/Layout";

const contactEmail = "latenight.ltd.tw@gmail.com";

const services = [
  { en: "Visual Media Cooperation", zh: "影像視訊" },
  { en: "Music Production", zh: "音樂製作" },
  { en: "Music Licensing", zh: "音樂授權" },
  { en: "Live Performance", zh: "演出聯繫" },
  { en: "Music/Video Cooperation", zh: "影音合作" },
  { en: "Event Coordination", zh: "活動統籌" },
  { en: "Project Management", zh: "專案管理" },
  { en: "Business Inquiry", zh: "其他合作" },
];

export default function Contact() {
  const [service, setService] = useState(services[0].zh);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const subject = `[合作詢問] ${service}${name ? `｜${name}` : ""}`;
    const body = `姓名：${name}\nEmail：${email}\n合作類型：${service}\n\n需求內容：\n${message}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <section className="page-section pt-32 lg:pt-40">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:px-10">
          <div className="fade-in-up">
            <h1 className="mb-5 font-['ButlerCustom'] text-3xl leading-tight text-white sm:text-4xl">
              Work with us
            </h1>
            <p className="mt-6 max-w-xl font-['ButlerCustom'] text-sm leading-7 text-white/50">
              <span className="block">Contact with Late Night Ltd.</span>
              <span className="block">相關合作歡迎直接聯繫 {contactEmail}</span>
            </p>

            <div className="mt-12 border-t border-white/10 pt-8">
              <h2 className="font-['ButlerCustom'] text-3xl text-white sm:text-4xl">Service</h2>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((item) => (
                  <div key={item.en} className="border-l border-white/15 pl-4">
                    <p className="font-['ButlerCustom'] text-sm font-semibold text-white">{item.zh}</p>
                    <p className="mt-1 font-['ButlerCustom'] text-xs tracking-[0.08em] text-white/35">{item.en}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <Mail className="h-5 w-5 text-[oklch(0.70_0.02_280)]" aria-hidden="true" />
              <h2 className="font-['ButlerCustom'] text-2xl text-white">Start a conversation</h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">Name</span>
                <input name="name" required autoComplete="name" className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[oklch(0.70_0.02_280)]" placeholder="Your name" />
              </label>
              <label className="block">
                <span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">Email</span>
                <input name="email" type="email" required autoComplete="email" className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[oklch(0.70_0.02_280)]" placeholder="you@example.com" />
              </label>
              <label className="block">
                <span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">Service</span>
                <select name="service" value={service} onChange={(event) => setService(event.target.value)} className="w-full border-b border-white/20 bg-[oklch(0.15_0.005_285)] px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors focus:border-[oklch(0.70_0.02_280)]">
                  {services.map((item) => <option key={item.en} value={item.zh}>{item.zh} — {item.en}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">Message</span>
                <textarea name="message" required rows={5} className="w-full resize-y border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-[oklch(0.70_0.02_280)]" placeholder="Tell us about your project..." />
              </label>
            </div>

            <button type="submit" className="btn-scale mt-8 inline-flex items-center gap-2 bg-black px-6 py-3 font-['ButlerCustom'] text-xs font-semibold tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black">
              Compose email
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="border-t border-white/10 pt-8">
            <h2 className="font-['ButlerCustom'] text-3xl text-white sm:text-4xl">Subscribe LEIGHT NINE</h2>
            <p className="mt-4 font-['ButlerCustom'] text-sm leading-7 text-white/50">訂閱電子報獲得最新消息</p>
            <p className="font-['ButlerCustom'] text-sm leading-7 text-white/50">Click subscribe to get the latest news!</p>
            <a href="https://leightnine.komi.io/" target="_blank" rel="noopener noreferrer" className="btn-scale mt-6 inline-flex items-center gap-2 bg-[#FF0000] px-6 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white transition-colors hover:bg-[#CC0000]">
              Subscribe Now
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
