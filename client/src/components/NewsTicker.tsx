/* ============================================================
   NewsTicker — 首頁導覽列下方的「最新消息」跑馬燈
   ------------------------------------------------------------
   要更新消息，只要改下面的 NEWS 清單：
     text：顯示的文字
     href：點了要去的地方（可省略）
       - 站內頁面寫 "/shop"、"/tour" 這種格式
       - 外部網站寫完整網址 "https://..."
   ============================================================ */
import { Link } from "wouter";

type NewsItem = { text: string; href?: string };

const NEWS: NewsItem[] = [
  { text: "LEIGHT NINE 實體專輯《AREA NIGHT》卡帶開賣", href: "/shop" },
  { text: "LATE NIGHT CLUB LIVE", href: "/video" },
  { text: "LEIGHT NINE 近期演出", href: "/tour" },
];

/** 捲動速度：每個字大約幾秒，數字越大越慢 */
const SECONDS_PER_CHAR = 0.32;
/** 消息太少時自動重複，確保大螢幕上也能填滿整條、不會出現空白 */
const MIN_CHARS_PER_LOOP = 130;

function Item({ item }: { item: NewsItem }) {
  const cls =
    "whitespace-nowrap font-['ButlerCustom'] text-[12px] tracking-[1px] text-white/80 transition-colors hover:text-white";
  if (!item.href) return <span className={cls}>{item.text}</span>;
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={`${cls} underline-offset-4 hover:underline`}>
        {item.text}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${cls} underline-offset-4 hover:underline`}>
      {item.text} ↗
    </a>
  );
}

function Track({ items, ariaHidden = false }: { items: NewsItem[]; ariaHidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <Item item={item} />
          <span className="mx-8 text-[10px] text-[#ff0000]" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
}

export default function NewsTicker() {
  if (NEWS.length === 0) return null;
  const charsPerRound = NEWS.reduce((n, item) => n + item.text.length + 6, 0);
  const repeat = Math.max(1, Math.ceil(MIN_CHARS_PER_LOOP / charsPerRound));
  const loop = Array.from({ length: repeat }, () => NEWS).flat();
  const duration = Math.max(20, Math.round(charsPerRound * repeat * SECONDS_PER_CHAR));

  return (
    <div className="border-t border-white/5 bg-[oklch(0.08_0.005_285/0.85)] backdrop-blur-md" role="region" aria-label="最新消息">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center px-6 lg:px-10">
        <span className="mr-4 flex shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-['ButlerCustom'] text-[10px] tracking-[0.3em] text-[#ff0000]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff0000]" aria-hidden="true" />
          LATEST
        </span>
        <div className="news-ticker-mask relative flex-1 overflow-hidden">
          <div className="news-ticker-track flex w-max" style={{ animationDuration: `${duration}s` }}>
            <Track items={loop} />
            <Track items={loop} ariaHidden />
          </div>
        </div>
      </div>
    </div>
  );
}
