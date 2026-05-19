"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palmtree, Moon, Sun, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/meal-planning", label: "Meals" },
  { href: "/map", label: "Map" },
  { href: "/beaches", label: "Beaches" },
  { href: "/trails", label: "Trails" },
  { href: "/food", label: "Food" },
  { href: "/farmers-markets", label: "Markets" },
  { href: "/made-in-hawaii", label: "Made in HI" },
  { href: "/golf", label: "Golf" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/memory", label: "📸 Memory" },
];

export function Navbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <nav className="sticky top-0 z-50 px-4 pt-3 pb-1 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/78 px-4 py-3 shadow-soft backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <Palmtree className="text-palm" /> Oahu Family Planner
        </Link>
        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                pathname === link.href ? "bg-reef text-white" : "text-ink/70 hover:bg-sand hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl bg-white/95 p-3 shadow-soft backdrop-blur-xl lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  pathname === link.href ? "bg-reef text-white" : "text-ink hover:bg-sand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
