/* ============================================================
   Discography Page — Late Night Ltd.
   ============================================================ */
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";
import { ExternalLink, Music } from "lucide-react";
import { toast } from "sonner";



const releases = [
  {
    year: "2026",
    type: "ALBUM",
    title: "AREA NIGHT",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-area-night.webp"),
    color: "oklch(0.70_0.02_280)",
    date: "2026.05.27",
    coverLink: "https://bfan.link/area-night",
    aboutLink: "https://leightnine-lju2pj4n.manus.space/",
  },
  {
    year: "2025",
    type: "COLLAB",
    title: "WAKEN",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-waken.webp"),
    color: "oklch(0.88_0.14_88)",
    date: "2025.07.09",
    coverLink: "https://open.spotify.com/track/4PHpGTmwgYXXoxjCRm3Plr?si=f182243686794fb7",
  },
  {
    year: "2025",
    type: "EP",
    title: "LATENIGHT2024",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-latenight2024.webp"),
    color: "oklch(0.70_0.02_280)",
    date: "2025.01.28",
    coverLink: "https://bfan.link/LATENIGHT2024",
  },
  {
    year: "2024",
    type: "SINGLE",
    title: "WALDEN",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-walden.webp"),
    color: "oklch(0.88_0.14_88)",
    date: "2024.11.22",
    coverLink: "https://bfan.link/Walden",
  },
  {
    year: "2024",
    type: "SINGLE",
    title: "Don't Say Goodnight Girl",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-goodnight.webp"),
    color: "oklch(0.70_0.02_280)",
    date: "2024.10.01",
    coverLink: "https://open.spotify.com/track/1kaYmxL5gNfYhD5UDA2BvS?si=1994b08440b048ba",
  },
  {
    year: "2024",
    type: "EP",
    title: "RED SIDE",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-redside.webp"),
    color: "oklch(0.88_0.14_88)",
    date: "2024.09.13",
    coverLink: "https://bfan.link/RED-SIDE",
  },
  {
    year: "2024",
    type: "SINGLE",
    title: "NAI HE",
    subtitle: "",
    tracks: [],
    cover: asset("images/cover-naihe.webp"),
    color: "oklch(0.70_0.02_280)",
    date: "2024.05.27",
    coverLink: "https://bfan.link/NAI-HE",
  },
];

const streamingLinks = [
  { label: "Spotify", href: "https://open.spotify.com/artist/38sVAbWd44wDnLHL1cdKcw?si=6LhYfHw0Q_CJ38IvOzAEEQ" },
  { label: "Apple Music", href: "https://music.apple.com/us/artist/leight-nine/1748490593" },
  { label: "Bandcamp", href: "https://leightnine.bandcamp.com/" },
  { label: "YouTube", href: "https://www.youtube.com/@LEIGHTNINE" },
];

export default function Discography() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[oklch(0.70_0.02_280)] text-xs tracking-[0.4em] font-['ButlerCustom'] mb-4">
            LEIGHT NINE
          </p>

          <div className="w-16 h-px bg-[oklch(0.70_0.02_280)] mt-6" />
        </div>
      </section>

      {/* Streaming links */}
      <section className="py-8 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/30 text-xs font-['ButlerCustom'] tracking-widest mr-2">Stream on:</span>
            {streamingLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-4 py-1.5 border border-white/10 text-white/50 text-[0.65rem] tracking-[0.15em] font-['ButlerCustom'] hover:border-[oklch(0.70_0.02_280)/50] hover:text-[oklch(0.70_0.02_280)] transition-colors duration-200"
              >
                {link.label}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Releases */}
      <section className="page-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="space-y-16">
            {releases.map((release, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start fade-in-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Cover */}
                <div className="relative group">
                  {release.coverLink ? (
                    <a href={release.coverLink} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="aspect-square overflow-hidden w-32 h-32 lg:w-40 lg:h-40 cursor-pointer">
                        <img
                          src={release.cover}
                          alt={release.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div
                        className="absolute -bottom-2 -right-2 w-32 h-32 lg:w-40 lg:h-40 border opacity-20"
                        style={{ borderColor: release.color }}
                      />
                    </a>
                  ) : (
                    <>
                      <div className="aspect-square overflow-hidden w-32 h-32 lg:w-40 lg:h-40">
                        <img
                          src={release.cover}
                          alt={release.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div
                        className="absolute -bottom-2 -right-2 w-32 h-32 lg:w-40 lg:h-40 border opacity-20"
                        style={{ borderColor: release.color }}
                      />
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[0.6rem] tracking-[0.3em] font-['ButlerCustom'] px-2 py-0.5"
                      style={{ color: release.color, border: `1px solid ${release.color}40` }}
                    >
                      {release.type}
                    </span>
                    <span className="text-white/25 text-xs font-['ButlerCustom']">{release.year}</span>
                  </div>
                  <h2 className="font-['ButlerCustom'] text-4xl text-white font-700 mb-1">
                    {release.title}
                  </h2>
                  {release.date && (
                    <p className="text-white/40 text-sm font-['ButlerCustom'] mb-6">{release.date}</p>
                  )}
                  {release.subtitle && (
                    <p className="text-white/40 text-sm font-['ButlerCustom'] italic mb-6">{release.subtitle}</p>
                  )}
                  <div className="w-12 h-px mb-6" style={{ background: release.color }} />

                  {/* Track list */}
                  {release.tracks.length > 0 && (
                    <div className="space-y-2 mb-8">
                      {release.tracks.map((track, j) => (
                        <div key={j} className="flex items-center gap-3 group/track cursor-pointer">
                          <Music className="w-3 h-3 text-white/20 group-hover/track:text-[oklch(0.70_0.02_280)] transition-colors duration-200" />
                          <span className="text-white/50 text-sm font-['ButlerCustom'] group-hover/track:text-white transition-colors duration-200">
                            {track}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* About button for AREA NIGHT */}
                  {release.aboutLink && (
                    <a
                      href={release.aboutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF0000] text-white text-xs font-['ButlerCustom'] font-semibold tracking-[0.15em] hover:bg-[#CC0000] transition-colors duration-200"
                    >
                      about {release.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
