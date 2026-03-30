"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Menu, X, Sun, Moon, Sparkles, ChevronRight,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features",  href: "#features"  },
  { label: "Modules",   href: "#modules"   },
  { label: "Pricing",   href: "#pricing"   },
  { label: "Docs",      href: "#docs"      },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const { theme, setTheme }         = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Shimmer bar at very top */}
      {/* <div className="shimmer-bar fixed top-0 inset-x-0 z-60" /> */}

      {/* Floating capsule nav */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center  px-4 pointer-events-none">
        <nav
          className={`
            nav-capsule pointer-events-auto
            flex items-center gap-2 px-4 py-2.5
            transition-all duration-500 backdrop-blur-md bg-white/5 dark:bg-black/40
            ${scrolled
              ? "w-full max-w-3xl shadow-2xl border-white/10"
              : "w-full max-w-2xl shadow-lg border-white/5"}
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mr-2 group flex-shrink-0"
          >
            <div
              className="
                relative w-8 h-8 rounded-xl flex items-center justify-center
                font-display font-black text-sm text-white
                bg-gradient-to-br from-[var(--uc-purple)] to-[var(--uc-pink)]
                shadow-md group-hover:scale-110 transition-transform duration-300
              "
            >
              <Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-[var(--uc-amber)] pulse-dot" />
              U
            </div>
            <span className="font-display font-bold text-base tracking-tight hidden sm:block"
              style={{ color: "var(--text-primary)" }}>
              UNICORE
            </span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 mx-1"
            style={{ background: "var(--border-medium)" }} />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="
                  px-3.5 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 hover:bg-[var(--uc-purple)]/10
                "
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e =>
                  (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-all duration-200
                  hover:bg-[var(--uc-purple)]/10
                "
                style={{ color: "var(--text-muted)" }}
                aria-label="Toggle theme"
              >
                {theme === "dark"
                  ? <Sun  className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* CTA */}
            <Link
              href="/register"
              className="btn-primary !py-2 !px-4 !text-sm hidden sm:inline-flex"
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center
                hover:bg-[var(--uc-purple)]/10 transition"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="
              pointer-events-auto absolute top-16 left-4 right-4 rounded-2xl p-4
              shadow-xl border
            "
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-medium)",
            }}
          >
            <div className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium
                    hover:bg-[var(--uc-purple)]/10 transition"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <Link
              href="/register"
              className="btn-primary w-full justify-center !text-sm !py-2.5"
              onClick={() => setMenuOpen(false)}
            >
              Get Started Free <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
