/* ============================================================
   Live Page — Late Night Ltd.
   Upcoming shows + past shows archive.
   Shows are sorted automatically: a show whose date is today or later
   appears under "即將演出 Upcoming"; once the date passes it moves to
   "過去演出場次 Past Shows" (under its group).
   To add a show, add one line to a group below: { date, place, note }.

   Show images: put files in client/src/assets/live/ named by the show date,
   e.g. 2026-11-10.jpg, or 2026-11-10-1.webp, 2026-11-10-2.webp for several
   (number 1 is the key visual). They are matched to shows automatically;
   a show with images becomes clickable and opens a popup.
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";

const BANDSINTOWN_URL = "https://www.bandsintown.com/a/15587598?noindex=1";

type Show = { date: string; place: string; note?: string };

/* ---------- Show images, matched by file name (YYYY-MM-DD[-N].ext) ---------- */
const imageFiles = import.meta.glob("../assets/live/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const showImages: Record<string, string[]> = (() => {
  const found: Record<string, { n: number; url: string }[]> = {};
  for (const [path, url] of Object.entries(imageFiles)) {
    const m = path.match(/(\d{4})-(\d{2})-(\d{2})(?:-(\d+))?\.\w+$/);
    if (!m) continue;
    const key = `${m[1]}/${m[2]}/${m[3]}`;
    (found[key] ||= []).push({ n: Number(m[4] ?? 1), url });
  }
  return Object.fromEntries(
    Object.entries(found).map(([k, list]) => [k, list.sort((a, b) => a.n - b.n).map((x) => x.url)]),
  );
})();
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
      { date: "2026/09/04", place: "Taipei 樂悠悠游擊隊 w Montonn(TH)", note: "LATENIGHTCLUB#011" },
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
    <h2 className="border-b border-white/10 pb-5 text-[22px] leading-tight text-white">
      <span className="font-semibold tracking-[1px]">{zh}</span>{" "}
      <span className="whitespace-nowrap font-['ButlerCustom'] tracking-[1px]">{en}</span>
    </h2>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 font-['ButlerCustom'] text-[10px] uppercase tracking-[1px] text-[oklch(0.70_0.02_280)]">
      {children}
    </h3>
  );
}

function ShowRow({ show, onOpen }: { show: Show; onOpen?: (show: Show) => void }) {
  const hasImages = !!showImages[show.date]?.length && !!onOpen;
  return (
    <li className="grid grid-cols-1 gap-1 border-b border-white/10 py-4 sm:grid-cols-[140px_1fr] sm:gap-8 lg:grid-cols-[160px_1fr]">
      <span className="font-['ButlerCustom'] text-[12px] tracking-[1px] text-white/50">
        {show.date}
      </span>
      <div>
        {hasImages ? (
          <button
            type="button"
            onClick={() => onOpen!(show)}
            className="group inline-flex items-center gap-2 text-left font-['ButlerCustom'] text-[14px] tracking-[1px] text-white underline decoration-white/0 underline-offset-4 transition-colors duration-300 hover:decoration-white/70"
            aria-label={`${show.place} — 查看圖片`}
          >
            {show.place}
            <ImageIcon className="h-3 w-3 shrink-0 text-white/40 transition-colors duration-300 group-hover:text-white" />
          </button>
        ) : (
          <p className="font-['ButlerCustom'] text-[14px] tracking-[1px] text-white">{show.place}</p>
        )}
        {show.note && (
          <p className="mt-1 font-['ButlerCustom'] text-[10px] tracking-[1px] text-white/40">
            {show.note}
          </p>
        )}
      </div>
    </li>
  );
}

function ShowModal({
  show,
  onClose,
  onPrev,
  onNext,
}: {
  show: Show;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const images = showImages[show.date] ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${show.date} ${show.place}`}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
        disabled={!onPrev}
        className="absolute left-2 z-50 p-2 text-white/40 transition-colors duration-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-20 sm:left-4"
        aria-label="上一場"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-[oklch(0.15_0.01_280)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end border-b border-white/10 bg-[oklch(0.15_0.01_280)] p-4">
          <button type="button" onClick={onClose} className="text-white/50 transition-colors hover:text-white" aria-label="關閉">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <p className="font-['ButlerCustom'] text-[12px] tracking-[1px] text-white/50">{show.date}</p>
          <h2 className="mt-2 font-['ButlerCustom'] text-[22px] tracking-[1px] text-white">{show.place}</h2>
          {show.note && (
            <p className="mt-2 font-['ButlerCustom'] text-[10px] tracking-[1px] text-white/40">{show.note}</p>
          )}
          <div className="mt-8 space-y-4">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${show.place} ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-auto w-full rounded image-fade-in"
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext?.(); }}
        disabled={!onNext}
        className="absolute right-2 z-50 p-2 text-white/40 transition-colors duration-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-20 sm:right-4"
        aria-label="下一場"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
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

  // Shows with images, in the order they appear on the page (for prev/next in the popup)
  const clickable = [...upcoming, ...past.flatMap((g) => g.shows)].filter(
    (s) => showImages[s.date]?.length,
  );
  const [openDate, setOpenDate] = useState<string | null>(null);
  const openIndex = clickable.findIndex((s) => s.date === openDate);
  const openShow = useCallback((s: Show) => setOpenDate(s.date), []);
  const close = useCallback(() => setOpenDate(null), []);
  const prev = openIndex > 0 ? () => setOpenDate(clickable[openIndex - 1].date) : undefined;
  const next =
    openIndex >= 0 && openIndex < clickable.length - 1
      ? () => setOpenDate(clickable[openIndex + 1].date)
      : undefined;

  return (
    <Layout>
      <section className="relative overflow-hidden bg-black px-6 pb-6 pt-32 lg:px-10 lg:pb-8 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,oklch(0.70_0.02_280/0.14),transparent_38%)]" />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[#ff0000]">
            LEIGHT NINE
          </p>
          <div className="mt-6 h-px w-16 bg-[oklch(0.70_0.02_280)]" />
        </div>
      </section>

      <section className="page-section pt-6! lg:pt-8!">
        <div className="mx-auto max-w-[1400px] space-y-20 px-6 lg:px-10">
          {/* 即將演出 Upcoming */}
          <section>
            <SectionTitle zh="即將演出" en="Upcoming" />
            {upcoming.length > 0 ? (
              <ul className="mt-6">
                {upcoming.map((show) => (
                  <ShowRow key={show.date + show.place} show={show} onOpen={openShow} />
                ))}
              </ul>
            ) : (
              <p className="mt-6 font-['ButlerCustom'] text-[12px] tracking-[1px] text-white/50">
                目前沒有已公布的演出，追蹤 Bandsintown 搶先收到最新場次通知。
              </p>
            )}
            <a
              href={BANDSINTOWN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 font-['ButlerCustom'] text-[10px] tracking-[1px] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              追蹤 Bandsintown
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </section>

          {/* 過去演出場次 Past Shows */}
          <section>
            <SectionTitle zh="過去演出場次" en="Past Shows" />
            <div className="mt-10 space-y-12">
              {past.map((group) => (
                <div key={group.title}>
                  <GroupLabel>{group.title}</GroupLabel>
                  <ul>
                    {group.shows.map((show) => (
                      <ShowRow key={show.date + show.place} show={show} onOpen={openShow} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {openIndex >= 0 && (
        <ShowModal show={clickable[openIndex]} onClose={close} onPrev={prev} onNext={next} />
      )}
    </Layout>
  );
}
