/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Language } from "../types";
import { translations } from "../translations";
import { Globe, Menu, X, Activity, ShieldAlert } from "lucide-react";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({
  language,
  setLanguage,
  currentTab,
  setCurrentTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const navItems = [
    { id: "home", label: t("nav.home") },
    { id: "departments", label: t("nav.departments") },
    { id: "doctors", label: t("nav.doctors") },
    { id: "book", label: t("nav.book") },
    { id: "portal", label: t("nav.portal") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <header id="hospital-header" className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Branding */}
          <div 
            id="brand-logo"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setCurrentTab("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200 flex items-center justify-center animate-pulse">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-blue-900 leading-tight tracking-tight">
                {t("nav.brand")}
              </h1>
              <p className="text-[10px] font-mono tracking-wider text-blue-500 uppercase font-medium">
                West Hararghe • Oromia • Ethiopia
              </p>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav id="desktop-nav" className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 font-sans ${
                  currentTab === item.id
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Widgets (Language Selector & Booking Shortcut) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Elegant Language Pill Picker */}
            <div id="language-picker" className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 space-x-1.5 shadow-inner">
              <Globe className="h-4 w-4 text-slate-400" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="om">Afaan Oromoo</option>
                <option value="am">አማርኛ (Amharic)</option>
                <option value="en">English</option>
              </select>
            </div>

            <button
              id="header-cta-book"
              onClick={() => setCurrentTab("book")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-200 hover:shadow-lg transition-all"
            >
              {t("home.hero.cta.book")}
            </button>
            
          </div>

          {/* Mobile responsive triggers */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Quick Lang menu for Mobile */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-500 mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="om">OM</option>
                <option value="am">AM</option>
                <option value="en">EN</option>
              </select>
            </div>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 mr-1 text-slate-600 hover:text-blue-600 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Slide-open Menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden border-t border-slate-100 bg-white shadow-lg animate-fadeIn">
          <div className="px-2 pt-3 pb-6 space-y-1.5 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold font-sans transition-colors ${
                  currentTab === item.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-slate-100 px-4">
              <button
                onClick={() => {
                  setCurrentTab("book");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold shadow-md"
              >
                {t("home.hero.cta.book")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
