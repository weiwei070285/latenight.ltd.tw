/* ============================================================
   Layout — Late Night Ltd.
   Wraps all pages with Navbar + Footer + grain overlay
   ============================================================ */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  // Scroll to top on route change
  useEffect(() => {
    if (prevLocation.current !== location) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevLocation.current = location;
    }
  }, [location]);

  // Intersection observer for fade-in-up animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location]);

  return (
    <div className="min-h-screen bg-background grain-overlay">
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
