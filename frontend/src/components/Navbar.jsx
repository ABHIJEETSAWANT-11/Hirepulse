import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NAV_LINKS = ["Home", "Features", "Pricing", "Company", "Blog"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — HireFlow-style mark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">Hire Pulse.</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          {NAV_LINKS.map((item) => (
            <li
              key={item}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Login & CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-ink"
          >
            Log In
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="rounded-full bg-ink px-6 py-2.5 text-white shadow-none hover:bg-gray-800"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-ink text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              className="text-lg font-medium text-gray-500 hover:text-ink transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="w-full justify-center rounded-full"
            >
              Log In
            </Button>
            <Button
              onClick={() => {
                navigate("/register");
                setIsOpen(false);
              }}
              className="w-full justify-center rounded-full bg-ink text-white hover:bg-gray-800"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
