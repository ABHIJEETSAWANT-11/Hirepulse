import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#scheduler" },
  { label: "Privacy", href: "#privacy" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" aria-label="HirePulse home">
          <Logo size={28} />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 text-[14px] font-medium text-black/50 md:flex">
          {NAV_LINKS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollTo(item.href)}
                className="transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Login & CTA (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/login")}
            className="h-9 rounded-full px-4 text-[13px] font-semibold text-black/60 transition-colors hover:text-ink"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="h-9 rounded-full bg-ink px-5 text-[13px] font-semibold text-white shadow-real-sm transition-all hover:-translate-y-px hover:bg-black hover:shadow-real"
          >
            Get started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-ink md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-black/5 bg-paper p-6 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="rounded-lg py-2.5 text-left text-[15px] font-medium text-black/60 hover:text-ink"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="h-10 rounded-full border border-black/10 bg-white text-[13px] font-semibold text-ink shadow-real-sm"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
                className="h-10 rounded-full bg-ink text-[13px] font-semibold text-white shadow-real-sm"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
