/* ============================================================
   Live Page — Late Night Ltd.
   Live shows and performance archive
   ============================================================ */
import Layout from "@/components/Layout";

const showGroups = [
  {
    title: "AREA NIGHT TOUR（2026）",
    shows: [
      "2026/10/01 @ Revolver, Taipei",
      "2026/10/28 @ Lido Connect, Bangkok",
      "2026/11/05 @ Paramount Bar, Kaohsiung",
      "2026/11/10 @ Oriental Force, Tokyo",
    ],
  },
  {
    title: "2026 / Live Shows",
    shows: [
      "2026/09/05 @Taipei 樂悠悠游擊隊 w Montonn(TH)  / LATENIGHTCLUB#011",
      "2026/07/04 @Taipei hof (EVERYDAY OBJECT)  / LATENIGHTCLUB#010",
      "2026/03/22 @Kaohsiung 大港開唱 MEGAPORT FEST / LATENIGHTCLUB#009",
      "2026/02/19 @Tainan TCRC Live House / LATENIGHTCLUB#008",
      "2026/01/28 @Taipei Sunday Morning / LATENIGHTCLUB#007",
      "2026/01/24 @Tainan Seety / LATENIGHTCLUB#006",
    ],
  },
  {
    title: "2025 / Live Shows",
    shows: [
      "2025/12/19 @Taipei PIPE Live House / LATENIGHTCLUB#005",
      "2025/10/26 @Kaohsiung 小水坑WOMB / LATENIGHTCLUB#004",
      "2025/08/14 @Taipei KONDO Bar / LATENIGHTCLUB#003",
      "2025/07/13 @Taipei 山屋口口 / LATENIGHTCLUB#002",
      "2025/05/15 @Taipei Revolver / LATENIGHTCLUB#001",
    ],
  },
  {
    title: "2024 / Live Shows",
    shows: [
      "2024/11/24 @Taipei The Wall Livehouse / LITE(JP) feat. LEIGHT NINE (VJ set)",
      "2024/11/23 @Taichung Roving Nation Festival / P!SCO feat. LEIGHT NINE",
      "2024/09/06 @JAPAN TOKYO Tower Records Shibuya / 塔音渋谷『台湾音市』音楽祭 Vol.1",
      "2024/03/30 @Kaohsiung 大港開唱 MEGAPORT FEST. / Easy Shen x L89",
    ],
  },
  {
    title: "2023 / Live Shows",
    shows: [
      "2023/12/08 @Thailand CampYard / Mahaheretonight：L89 x 拍謝少年",
      "2023/10/25 @Taipei The Wall Livehouse / Folk9(TH) Tour in Taiwan (Guest)",
      "2023/10/21 @Kaohsiung 百樂門酒館 / 臺灣文化科技大會音造工程第四期：L89 x 野莓玻璃罐",
      "2023/09/08 @JAPAN TOKYO duo MUSIC EXCHANGE / 浮現祭日本篇 開場嘉賓 (Guest)",
      "2023/09/02 @Kaohsiung 後台BakeStage / Random隨性 《中年病》發片巡迴專場 (Guest)",
    ],
  },
];

export default function Tour() {
  return (
    <Layout>
      <section className="relative overflow-hidden bg-black px-6 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,oklch(0.70_0.02_280/0.14),transparent_38%)]" />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[oklch(0.70_0.02_280)]">
            LEIGHT NINE
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="space-y-16">
            {showGroups.map((group) => (
              <section key={group.title} className="border-t border-white/10 pt-8">
                <h2 className="font-['ButlerCustom'] text-3xl text-white sm:text-4xl">
                  {group.title}
                </h2>
                <div className="mt-6">
                  {group.shows.map((show) => (
                    <p
                      key={show}
                      className="py-2 font-['ButlerCustom'] text-sm leading-7 text-white/65 sm:text-base"
                    >
                      {show}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
