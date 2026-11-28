/* ============================================================
   About Page — Late Night Ltd.
   Company introduction with bilingual content
   ============================================================ */
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="relative pt-32 pb-6 lg:pt-40 lg:pb-8 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-white/40 text-xs tracking-[0.4em] font-['ButlerCustom'] mb-4">
            ABOUT
          </p>
          <div className="w-16 h-px bg-[oklch(0.70_0.02_280)] mt-6" />
        </div>
      </section>

      {/* Company Intro */}
      <section className="page-section pt-6! lg:pt-8!">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <div className="fade-in-up">
              <h1 className="font-['ButlerCustom'] text-[12pt] text-white font-700 mb-8 leading-tight">
                夢迴夜行有限公司
              </h1>
              
              <div className="space-y-8">
                <div>
                  <p className="text-white/70 text-base lg:text-lg font-['ButlerCustom'] leading-relaxed mb-4">
                    主力於跨領域創意實踐的幕後協作。以影像視訊、音樂製作、活動專案統籌與現場執行為核心，延展出多元的合作模式與執行場域。
                  </p>
                  <p className="text-white/70 text-base lg:text-lg font-['ButlerCustom'] leading-relaxed">
                    夢迴夜行選擇行於黑暗，專注在不被看見之處支撐每一次創作。我們期待在默默耕耘之中，能讓感動持續發生、讓美好的夢成為現實。
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="font-['ButlerCustom'] text-[12pt] text-white font-500 mb-6 tracking-widest">
                    𝙇𝙖𝙩𝙚 𝙉𝙞𝙜𝙝𝙩 𝙇𝙩𝙙.
                  </p>
                  <p className="text-white/70 text-base lg:text-lg font-['ButlerCustom'] leading-relaxed mb-4">
                    Specializing in cross-disciplinary creative practices and backstage collaboration. With a focus on video production, music creation, event coordination, and on-site execution, we extend into diverse modes of partnership and fields of realization.
                  </p>
                  <p className="text-white/70 text-base lg:text-lg font-['ButlerCustom'] leading-relaxed">
                    𝙇𝙖𝙩𝙚 𝙉𝙞𝙜𝙝𝙩 𝙇𝙩𝙙. chooses to move through the shadows, dedicating itself to supporting each creation from behind the scenes. In our quiet persistence, we hope to keep moments of inspiration alive, and to turn beautiful dreams into reality.
                  </p>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
