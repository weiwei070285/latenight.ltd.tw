/* ============================================================
   Video Page — Late Night Ltd.
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowUpRight, Play, X, Youtube } from "lucide-react";

/** YouTube thumbnail with fallback: maxres (HD) is missing on some videos,
 *  where YouTube returns a 120x90 gray placeholder — step down to sd, then hq (always exists). */
const THUMB_SIZES = ["maxresdefault", "sddefault", "hqdefault"];
function nextThumb(img: HTMLImageElement) {
  const m = img.src.match(/\/vi\/([^/]+)\/(\w+)\.jpg/);
  if (!m) return;
  const i = THUMB_SIZES.indexOf(m[2]);
  if (i >= 0 && i < THUMB_SIZES.length - 1) {
    img.src = `https://i.ytimg.com/vi/${m[1]}/${THUMB_SIZES[i + 1]}.jpg`;
  }
}
const thumbHandlers = {
  onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth <= 120) nextThumb(e.currentTarget);
  },
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => nextThumb(e.currentTarget),
};



const videos: any[] = [
  {
    id: "D3vUK1pZYzw",
    title: "Tokyo Burst & Electric Town (Live, 2026)",
    type: "LIVE",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/D3vUK1pZYzw/maxresdefault.jpg",
    sortDate: 20261017,
  },
  {
    id: "gz6wFqm4dBk",
    title: "Safe House (Live, 2026)",
    type: "LIVE",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/gz6wFqm4dBk/maxresdefault.jpg",
    sortDate: 20260917,
  },
  {
    id: "9BPcAKUNu6Q",
    title: "Area Night (Live, 2026)",
    type: "LIVE",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/9BPcAKUNu6Q/maxresdefault.jpg",
    sortDate: 20260717,
  },
  {
    id: "FZjzI5ZERXQ",
    title: "Dead Line (Visualizer, 2026)",
    type: "Visualizer",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/FZjzI5ZERXQ/maxresdefault.jpg",
    sortDate: 202600,
  },
  {
    id: "rcQkVTj452c",
    title: "Electric Town (Live, Instrumental, 2026)",
    type: "LIVE",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/rcQkVTj452c/maxresdefault.jpg",
    sortDate: 202600,
  },
  {
    id: "Dk1u-7eD7aw",
    title: "Walden (Live, 2026)",
    type: "LIVE",
    year: "2026",
    thumb: "https://i.ytimg.com/vi/Dk1u-7eD7aw/maxresdefault.jpg",
    sortDate: 202600,
  },
  {
    id: "8n-vGaIIOF0",
    title: "WAKEN (Visualizer, 2025)",
    type: "Visualizer",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/8n-vGaIIOF0/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "eLqGCM3lsbc",
    title: "Electric Town (Live, 2025)",
    type: "LIVE",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/eLqGCM3lsbc/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "Q9KODWFOeTE",
    title: "NAIHE (Live, 2025)",
    type: "LIVE",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/Q9KODWFOeTE/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "54E2f_VBs-U",
    title: "Safe House (Live, 2025)",
    type: "LIVE",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/54E2f_VBs-U/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "ev9U6ru7mmg",
    title: "Buddy (Live, Instrumental, 2025)",
    type: "LIVE",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/ev9U6ru7mmg/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "4AnH15AYPtw",
    title: "Tokyo Burst (Live, 2025)",
    type: "LIVE",
    year: "2025",
    thumb: "https://i.ytimg.com/vi/4AnH15AYPtw/maxresdefault.jpg",
    sortDate: 202500,
  },
  {
    id: "0o2F8F5Ftu8",
    title: "Don't Say Goodnight Girl (Visualizer, 2024)",
    type: "Visualizer",
    year: "2024",
    thumb: "https://i.ytimg.com/vi/0o2F8F5Ftu8/maxresdefault.jpg",
    sortDate: 202400,
  },
];

const videoTypes = ["ALL", "MUSIC VIDEO", "LIVE", "Visualizer"];

export default function Video() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Sort videos by date (newest first)
  const filtered = [...videos].sort((a, b) => (b.sortDate || 0) - (a.sortDate || 0));

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative pt-32 pb-6 lg:pt-40 lg:pb-8 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[oklch(0.70_0.02_280)] text-xs tracking-[0.4em] font-['ButlerCustom'] mb-4">
            VIDEO
          </p>

          <div className="w-16 h-px bg-[oklch(0.70_0.02_280)] mt-6" />
        </div>
      </section>

      {/* Video Content */}
      <section className="page-section pt-6! lg:pt-8!">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Subscribe button */}
          <div className="mb-10">
            <a
              href="https://www.youtube.com/@leightnine"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-scale inline-flex items-center gap-2 bg-[#ff0000] px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              <Youtube className="h-4 w-4" aria-hidden="true" />
              SUBSCRIBE ON YOUTUBE
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((video, i) => (
              <div
                key={i}
                className="group cursor-pointer fade-in-up"
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => setActiveVideo(video.id)}
              >
                <div className="relative aspect-video overflow-hidden mb-3">
                  <img
                    src={video.thumb}
                  {...thumbHandlers}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 image-fade-in"
                  />
                  <div className="absolute inset-0 bg-[oklch(0.10_0.005_285/0.4)] group-hover:bg-[oklch(0.10_0.005_285/0.3)] transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <span className="text-[oklch(0.70_0.02_280)] text-[0.6rem] tracking-[0.3em] font-['ButlerCustom'] block mb-1">
                  {video.type} · {video.year}
                </span>
                <h3 className="font-['ButlerCustom'] text-base text-white group-hover:text-[oklch(0.88_0.14_88)] transition-colors duration-200 leading-snug">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-200"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Video"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
