/*
   Project Page — Late Night Ltd.
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";
import { ArrowRight, X } from "lucide-react";

const projects: any[] = [
  {
    id: 16,
    title: "楊乃文 - JAM JAM ASIA 亞洲音樂節",
    category: "Visual Media",
    images: [asset("images/project-jja-yang-naiwen.webp")],
    link: "https://www.instagram.com/p/DcvZaGEh7We/",
    description: "2026.08.29 @ JAM JAM ASIA 亞洲音樂節\n視訊設計製作與現場執行",
    sortDate: 20260829,
    shortDesc: "視訊設計製作與現場執行"
  },
  {
    id: 15,
    title: "JAM JAM ASIA 亞洲音樂節 視訊執行",
    category: "Visual Media",
    images: [asset("images/project-jja-2026.webp")],
    link: "https://www.instagram.com/p/Dc3H02lCFGQ/",
    description: "2026.08.29-30 @ 台北流行音樂中心\n【2026 TRENDY TAIPEI 潮臺北 – JAM JAM ASIA亞洲音樂節 】\nBig Wave Stage @ 表演廳 Concert Hall\nEcho Stage @ 戶外表演空間 Plaza\n官方設計後期協助與現場執行",
    sortDate: 20260830,
    shortDesc: "官方視訊設計與現場執行"
  },
  {
    id: 14,
    title: "回聲樂團《靈魂的回聲》專輯首演",
    category: "Visual Media",
    images: [asset("images/project-echo-2026.webp")],
    link: "https://www.instagram.com/p/DcqEdCmoAfb/?img_index=1",
    description: "2026.08.29 @ Legacy Taipei\n【 回聲樂團《靈魂的回聲》專輯首演 】\n視訊製作、現場執行",
    sortDate: 20260829,
    shortDesc: "視訊製作、現場執行"
  },
  {
    id: 11,
    title: "2024 LITE 視訊合作",
    category: "Visual Media",
    images: [asset("images/project-lite-2024.webp")],
    link: "https://www.instagram.com/p/DCt0HlYTC7W/",
    description: "2024.11.24 @ THE WALL LIVE HOUSE\n【 cinema staff x LITE Coupling Tour in Taipei \"Strike Zone\" 】\nLITE（JP）日本數搖樂團現場即時互動視訊",
    sortDate: 20241124,
    shortDesc: "日本數搖樂團現場即時互動視訊"
  },
  {
    id: 9,
    title: "2026 浮現祭 視訊執行",
    category: "Visual Media",
    cover: asset("images/project-emerge-2026-misio-03.webp"),
    images: [
      asset("images/project-emerge-2026-01.webp"),
      asset("images/project-emerge-2026-02.webp"),
      asset("images/project-emerge-2026-03.webp"),
      asset("images/project-emerge-2026-04.webp"),
      asset("images/project-emerge-2026-05.webp")
    ],
    link: "https://www.instagram.com/p/DVf-LKeDrF5/",
    description: "2026.02.28-03.01 @ 台中清水鰲峰山運動公園\n【 浮現祭 𝐄𝐌𝐄𝐑𝐆𝐄 𝐅𝐄𝐒𝐓 𝟐𝟎𝟐𝟔：冒險新基地 】\n浮現舞台／光景舞台 官方視訊設計與現場執行",
    sortDate: 20260301,
    shortDesc: "官方視訊設計與現場執行"
  },
  {
    id: 10,
    title: "灣島皇后【 阮趴 】",
    category: "Visual Media",
    images: [asset("images/project-wanisland-sonia.webp")],
    link: "https://www.vogue.com.tw/article/lifestyle/%E9%98%AE%E8%B6%B4%E7%81%A3%E5%B3%B6%E7%9A%87%E5%90%8E%E6%B4%BE%E5%B0%8D",
    description: "2025.10.11 @ 臺北流行音樂中心 LIVE HOUSE D\n【 阮趴 】變裝皇后 x 對嘴對決 x 派對音樂\nDJ Sonia Calico 視訊設計與活動現場執行",
    sortDate: 20251011,
    shortDesc: "視訊設計與活動現場執行"
  },
  {
    id: 8,
    title: "2025 美秀集團TOUR 視訊統籌",
    category: "Visual Media",
    images: [asset("images/project-misio-tour-2025.webp")],
    link: "https://www.facebook.com/share/p/18gHgD3PHp/",
    description: "2025.11-12月 @ 中國巡迴\n廣州/深圳/長沙/青島/杭州/南京/鄭州/廈門/上海/北京\n【 美秀集團《AS= =》TOUR 】\n視訊統籌、設計製作、現場執行",
    sortDate: 20251130,
    shortDesc: "視訊統籌、設計製作、現場執行"
  },
  {
    id: 13,
    title: "2025搖滾台中 視訊執行",
    category: "Visual Media",
    images: [asset("images/project-rock-taichung-2025.webp")],
    link: "https://www.instagram.com/p/DPthqCHCYLG/",
    description: "2025.10.11-12 @ 台中文心森林公園\n【 搖滾台中 𝘙𝘖𝘊𝘒 𝘐𝘕 𝘛𝘈𝘐𝘊𝘏𝘜𝘕𝘎 】\n能量舞台（主舞台）官方視訊設計與現場執行",
    sortDate: 20251012,
    shortDesc: "官方視訊設計與現場執行"
  },
  {
    id: 12,
    title: "2025美秀集團香港專場視訊統籌",
    category: "Visual Media",
    images: [asset("images/project-misio-hk-2025.webp")],
    link: "https://www.facebook.com/share/p/18gHgD3PHp/",
    description: "2025.09.29-30 @ 麥花臣場館\n【 美秀集團《AS= =》巡迴香港站 】\n視訊統籌、設計製作、現場執行",
    sortDate: 20250930,
    shortDesc: "視訊統籌、設計製作、現場執行"
  },
  {
    id: 5,
    title: "2025浮現祭 視訊統籌",
    category: "Visual Media",
    images: [asset("images/project-emerge-2025-03.webp"), asset("images/project-emerge-2025-01.webp"), asset("images/project-emerge-2025-02.webp"), asset("images/project-emerge-2025-04.webp"), asset("images/project-emerge-2025-05.webp"), asset("images/project-emerge-2025-06.webp")],
    link: "https://www.instagram.com/p/DHYHV7EOiK8/?img_index=1",
    description: "2025.02.22-23 @ 台中清水鰲峰山運動公園\n【 浮現祭EMERGE FEST 2025：冒險遊樂園 】\n主舞台視訊統籌與執行",
    sortDate: 20250223,
    shortDesc: "主舞台視訊統籌與執行"
  },
  {
    id: 6,
    title: "LEIGHT NINE",
    category: "Music Production",
    images: [asset("images/leight-nine-performance.webp")],
    link: asset("discography"),
    description: "LEIGHT NINE 音樂製作\n《 AREA NIGHT 》ALBUM, 2026\n《 LATENIGHT2024 》EP, 2025\n《 RED SIDE 》EP, 2024\n〈 Walden 〉Single, 2024\n〈 Don't Say Goodnight Girl 〉Single, 2024\n〈 NAI HE 〉Single, 2024",
    sortDate: 20260101,
    shortDesc: "音樂製作"
  },
  {
    id: 4,
    title: "塔音澀谷 台灣音市  活動統籌",
    category: "Project Management",
    images: [asset("images/project-tower-shibuya-2024.webp")],
    link: "https://towershibuya.jp/history/news/2024/8/16/202618",
    description: "2024.09.06-08 @JAPAN TOKYO Tower Records Shibuya\n【 塔音澀谷 台灣音市 音樂祭 Vol.1 】\n活動統籌，含演出邀約、現場規劃、唱片上架聯繫等",
    sortDate: 20240908,
    shortDesc: "活動統籌、演出邀約、現場規劃"
  }
];

const categories = ["ALL", "Visual Media", "Music Production", "Event Coordination", "Project Management"];

// Helper function to extract date from description
function extractDate(description: string): string {
  const lines = description.split('\n');
  return lines[0] || '';
}

export default function Project() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);


  const filtered = [...projects].sort((a, b) => b.sortDate - a.sortDate);

  const handleProjectClick = (project: any, index: number) => {
    setSelectedProject(project);
    setSelectedIndex(index);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      handleProjectClick(filtered[newIndex], newIndex);
    }
  };

  const handleNext = () => {
    if (selectedIndex < filtered.length - 1) {
      const newIndex = selectedIndex + 1;
      handleProjectClick(filtered[newIndex], newIndex);
    }
  };



  return (
    <Layout>
      {/* Page Header */}
      <section className="relative pt-32 pb-6 lg:pt-40 lg:pb-8 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-white/40 text-xs tracking-[0.4em] font-['ButlerCustom'] mb-4">
            PROJECT
          </p>
          <div className="w-16 h-px bg-[oklch(0.70_0.02_280)] mt-6" />
        </div>
      </section>

      {/* Project Content */}
      <section className="page-section pt-6! lg:pt-8!">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Projects grid */}
          {filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <div
                  key={i}
                  className="group fade-in-up motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="overflow-hidden bg-white/5 border border-white/10 hover:border-[oklch(0.70_0.02_280)/50] transition-all duration-300 motion-safe:group-hover:shadow-[0_18px_40px_-24px_oklch(0.70_0.02_280/0.85)]">
                    {/* Image - Clickable for preview */}
                    {project.images && project.images.length > 0 && (
                      <div 
                        className="relative aspect-video overflow-hidden cursor-pointer group/image"
                        onClick={() => handleProjectClick(project, i)}
                      >
                        <img
                          src={project.cover ?? project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105 image-fade-in"
                        />
                        {/* Hover overlay with date and description */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.005_285/0.95)] via-[oklch(0.10_0.005_285/0.6)] to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          {/* Date */}
                          <div className="text-[oklch(0.70_0.02_280)] text-xs tracking-[0.2em] font-['ButlerCustom'] mb-2">
                            {extractDate(project.description)}
                          </div>
                          {/* Short description */}
                          <p className="text-white/90 text-sm leading-relaxed font-['ButlerCustom'] line-clamp-2">
                            {project.shortDesc}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-['ButlerCustom'] text-lg text-white flex-1">
                          {project.title}
                        </h3>
                      </div>

                      {/* Category badge */}
                      <span className="inline-block text-[oklch(0.70_0.02_280)] text-[0.6rem] tracking-[0.3em] font-['ButlerCustom']">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/40 font-['ButlerCustom']">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          {/* Previous project button */}
          <button
            onClick={handlePrevious}
            disabled={selectedIndex === 0}
            className="absolute left-4 z-50 p-2 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Previous project"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="bg-[oklch(0.15_0.01_280)] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <div className="sticky top-0 flex justify-end p-4 bg-[oklch(0.15_0.01_280)] border-b border-white/10">
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-8">
              {/* Image carousel */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="mb-8 rounded-lg overflow-hidden relative">
                  <img
                    src={selectedProject.images[0]}
                    alt={`${selectedProject.title} - Image 1`}
                    className="w-full h-auto image-fade-in"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="font-['ButlerCustom'] text-3xl text-white mb-2">
                {selectedProject.title}
              </h2>

              {/* Category badge */}
              <span className="inline-block text-[oklch(0.70_0.02_280)] text-[0.6rem] tracking-[0.3em] font-['ButlerCustom'] mb-6">
                {selectedProject.category}
              </span>

              {/* Description */}
              <div className="text-white/70 text-base leading-relaxed whitespace-pre-line font-['ButlerCustom'] mb-8">
                {selectedProject.description}
              </div>

              {/* Link button */}
              {selectedProject.link && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.70_0.02_280)] text-[oklch(0.10_0.005_285)] hover:bg-[oklch(0.75_0.02_280)] transition-all duration-300 font-['ButlerCustom'] text-sm tracking-[0.1em] hover:shadow-lg hover:shadow-[oklch(0.70_0.02_280)/0.3] hover:scale-105 active:scale-95"
                >
                  MORE ABOUT
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              {/* Additional images */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="mt-8 space-y-4">
                  {selectedProject.images.slice(1).map((image: string, idx: number) => {
                    const imageTexts: string[] = [];
                    return (
                      <div
                        key={idx}
                        className="relative w-full aspect-video overflow-hidden rounded group/img transition-all duration-200"
                      >
                        <img
                          src={image}
                          alt={`${selectedProject.title} - Image ${idx + 2}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        />
                        {/* Hover text overlay */}
                        {imageTexts[idx] && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-center text-lg font-['ButlerCustom'] tracking-wide">
                              {imageTexts[idx]}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Photo credit text for 2026 Emerge Fest */}
                  {selectedProject.id === 9 && (
                    <p className="text-center text-sm text-[oklch(0.60_0.01_280)] mt-6 font-['ButlerCustom'] tracking-wide">
                      照片來源 浮現祭官方Facebook
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Next project button */}
          <button
            onClick={handleNext}
            disabled={selectedIndex === filtered.length - 1}
            className="absolute right-4 z-50 p-2 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Next project"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </Layout>
  );
}
