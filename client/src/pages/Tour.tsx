/* ============================================================
   Live Page — Late Night Ltd.
   Upcoming shows + past shows archive.
   Shows are sorted automatically: a show whose date is today or later
   appears under "即將演出 Upcoming"; once the date passes it moves to
   "過去演出場次 Past Shows" (under its group).
   To add a show, add one line to a group below: { date, place, note }.
   ============================================================ */
import Layout from "@/components/Layout";
import { ArrowUpRight } from "lucide-react";

const BANDSINTOWN_URL = "https://www.bandsintown.com/a/15587598?noindex=1";

type Show = { date: string; place: string; note?: string };
type ShowGroup = { title: string; shows: Show[] };

const showGroups: ShowGroup[] = [
  {
    title: "AREA NIGHT TOUR（2026）",
    shows: [
      { date: "2026/11/10", place: "Oriental Force, Tokyo", note: "LATENIGHTCLUB#015" },
      { date: "2026/11/05", place: "Paramount Bar, Kaohsiung", note: "LATENIGHTCLUB#014" },
      { date: "2026/10/28", place: "Lido Connect, Bangkok", note: "LATENIGHTCLUB#013" },
      { date: "2026/10/01", place: "Revolver, Taipei", note: "LATENIGHTCLUB#012" },
    ],
  },
  {
    title: "2026 / Live Shows",
    shows: [
      { date: "2026/09/05", place: "Taipei 樂悠悠游擊隊 w Montonn(TH)", note: "LATENIGHTCLUB#011" },
      { date: "2026/07/04", place: "Taipei hof (EVERYDAY OBJECT)", note: "LATENIGHTCLUB#010" },
      { date: "2026/03/22", place: "Kaohsiung 大港開唱 MEGAPORT FEST", note: "LATENIGHTCLUB#009" },
      { date: "2026/02/19", place: "Tainan TCRC Live House", note: "LATENIGHTCLUB#008" },
      { date: "2026/01/28", place: "Taipei Sunday Morning", note: "LATENIGHTCLUB#007" },
      { date: "2026/01/24", place: "Tainan Seety", note: "LATENIGHTCLUB#006" },
    ],
  },
  {
    title: "2025 / Live Shows",
    shows: [
      { date: "2025/12/19", place: "Taipei PIPE Live House", note: "LATENIGHTCLUB#005" },
      { date: "2025/10/26", place: "Kaohsiung 小水坑WOMB", note: "LATENIGHTCLUB#004" },
      { date: "2025/08/14", place: "Taipei KONDO Bar", note: "LATENIGHTCLUB#003" },
      { date: "2025/07/13", place: "Taipei 山屋口口", note: "LATENIGHTCLUB#002" },
      { date: "2025/05/15", place: "Taipei Revolver", note: "LATENIGHTCLUB#001" },
    ],
  },
  {
    title: "2024 / Live Shows",
    shows: [
      { date: "2024/11/24", place: "Taipei The Wall Livehouse", note: "LITE(JP) feat. LEIGHT NINE (VJ set)" },
      { date: "2024/11/23", place: "Taichung Roving Nation Festival", note: "P!SCO feat. LEIGHT NINE" },
      { date: "2024/09/06", place: "JAPAN TOKYO Tower Records Shibuya", note: "塔音渋谷『台湾音市』音楽祭 Vol.1" },
      { date: "2024/03/30", place: "Kaohsiung 大港開唱 MEGAPORT FEST.", note: "Easy Shen x L89" },
    ],
  },
  {
    title: "2023 / Live Shows",
    shows: [
      { date: "2023/12/08", place: "Thailand CampYard", note: "Mahaheretonight：L89 x 拍謝少年" },
      { date: "2023/10/25", place: "Taipei The Wall Livehouse", note: "Folk9(TH) Tour in Taiwan (Guest)" },
      { date: "2023/10/21", place: "Kaohsiung 百樂門酒館", note: "臺灣文化科技大會音造工程第四期：L89 x 野莓玻璃罐" },
      { date: "2023/09/08", place: "JAPAN TOKYO duo MUSIC EXCHANGE", note: "浮現祭日本篇 開場嘉賓 (Guest)" },
      { date: "2023/09/02", place: "Kaohsiung 後台BakeStage", note: "Random隨性 《中年病》發片巡迴專場 (Guest)" },
    ],
  },
];

/** Today's date in Taiwan time as "YYYY/MM/DD", so it compares directly with show dates. */
function todayTaipei() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts.replace(/-/g, "/");
}

function SectionTitle({ zh, en }: { zh: string; en: string }) {
  return (
    <h2 className="border-b border-white/10 pb-6 text-3xl text-white sm:text-4xl">
      <span className="font-semibold tracking-[0.12em]">{zh}</span>{" "}
      <span className="whitespace-nowrap font-['ButlerCustom'] tracking-[0.12em]">{en}</span>
    </h2>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 font-['ButlerCustom'] text-sm uppercase tracking-[0.35em] text-[oklch(0.70_0.02_280)] sm:text-base">
      {children}
    </h3>
  );
}

function ShowRow({ show }: { show: Show }) {
  return (
    <li className="grid grid-cols-1 gap-1 border-b border-white/10 py-6 sm:grid-cols-[180px_1fr] sm:gap-8 lg:grid-cols-[240px_1fr]">
      <span className="font-['ButlerCustom'] text-base tracking-[0.06em] text-white/50 sm:text-lg">
        {show.date}
      </span>
      <div>
        <p className="font-['ButlerCustom'] text-lg text-white sm:text-xl">{show.place}</p>
        {show.note && (
          <p className="mt-2 font-['ButlerCustom'] text-sm tracking-[0.02em] text-white/40 sm:text-base">
            {show.note}
          </p>
        )}
      </div>
    </li>
  );
}

export default function Tour() {
  const today = todayTaipei();
  const upcoming = showGroups
    .flatMap((g) => g.shows.map((s) => ({ ...s, group: g.title })))
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date)); // soonest first
  const past = showGroups
    .map((g) => ({
      ...g,
      shows: g.shows.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .filter((g) => g.shows.length > 0);

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
        <div className="mx-auto max-w-[1400px] space-y-24 px-6 lg:px-10">
          {/* 即將演出 Upcoming */}
          <section>
            <SectionTitle zh="即將演出" en="Upcoming" />
            {upcoming.length > 0 ? (
              <ul className="mt-6">
                {upcoming.map((show) => (
                  <ShowRow key={show.date + show.place} show={show} />
                ))}
              </ul>
            ) : (
              <p className="mt-8 font-['ButlerCustom'] text-base text-white/50 sm:text-lg">
                目前沒有已公布的演出，追蹤 Bandsintown 搶先收到最新場次通知。
              </p>
            )}
            <a
              href={BANDSINTOWN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 border border-white/30 px-6 py-3 font-['ButlerCustom'] text-sm tracking-[0.15em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              追蹤 Bandsintown
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>

          {/* 過去演出場次 Past Shows */}
          <section>
            <SectionTitle zh="過去演出場次" en="Past Shows" />
            <div className="mt-14 space-y-16">
              {past.map((group) => (
                <div key={group.title}>
                  <GroupLabel>{group.title}</GroupLabel>
                  <ul>
                    {group.shows.map((show) => (
                      <ShowRow key={show.date + show.place} show={show} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}
