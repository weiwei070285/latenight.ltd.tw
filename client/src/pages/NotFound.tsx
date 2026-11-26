/* ============================================================
   404 Not Found — Late Night Ltd.
   ============================================================ */
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[oklch(0.70_0.02_280)] text-xs tracking-[0.4em] font-['ButlerCustom'] mb-4">
            Error
          </p>
          <h1 className="font-['ButlerCustom'] text-[8rem] lg:text-[12rem] text-white/10 font-900 leading-none mb-4">
            404
          </h1>
          <p className="font-['ButlerCustom'] text-2xl text-white mb-3">
            頁面不存在
          </p>
          <p className="text-white/40 text-sm font-['ButlerCustom'] mb-8">
            您所尋找的頁面可能已移除或從未存在。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[oklch(0.70_0.02_280)] text-[oklch(0.10_0.005_285)] text-xs font-['ButlerCustom'] font-600 tracking-[0.15em] hover:bg-[oklch(0.75_0.02_280)] transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回首頁
          </Link>
        </div>
      </div>
    </Layout>
  );
}
