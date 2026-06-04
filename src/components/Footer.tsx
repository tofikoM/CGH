/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Language } from "../types";
import { translations } from "../translations";
import { MapPin, PhoneCall, Mail, Shield, ShieldCheck } from "lucide-react";

interface FooterProps {
  language: Language;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Footer({
  language,
  currentTab,
  setCurrentTab,
}: FooterProps) {
  
  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert(t("social.copied"));
  };

  return (
    <footer id="hospital-footer" className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo Brand / Info */}
          <div className="col-span-1 md:col-span-1.5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <span className="font-bold text-lg font-display">CGH</span>
              </div>
              <span className="text-lg font-bold text-white font-display">
                {t("nav.brand")}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {t("home.hero.subtitle")}
            </p>

            <div className="pt-2 text-xs text-slate-400 font-mono space-y-1">
              <p>📍 Chiro, West Hararghe, Oromia, Ethiopia</p>
              <p>📞 Emergency Hotline: +251 25 551 0134</p>
              <p>📠 Admin Office: +251 25 551 0982</p>
            </div>
          </div>

          {/* Core Portals Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              {t("nav.departments")}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentTab("departments")}
                  className="hover:text-blue-400 hover:underline text-left cursor-pointer"
                >
                  Maternity & Infants Clinic
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("departments")}
                  className="hover:text-blue-400 hover:underline text-left cursor-pointer"
                >
                  Trauma & Surgical Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("departments")}
                  className="hover:text-blue-400 hover:underline text-left cursor-pointer"
                >
                  Outpatient Diagnostics & Pharmacy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("doctors")}
                  className="hover:text-blue-400 hover:underline text-left cursor-pointer"
                >
                  {t("nav.doctors")}
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Schedules */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              {t("contact.hours")}
            </h3>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                <strong className="text-red-400 uppercase tracking-wide text-[10px] block">
                  {t("contact.hours.emergency")}
                </strong>
                Available 24/7 every single day including holidays.
              </p>
              <p>
                <strong className="text-blue-400 uppercase tracking-wide text-[10px] block">
                  {t("contact.hours.general")}
                </strong>
                Walk-ins, specialized counseling, and pharmacy billing.
              </p>
            </div>
          </div>

          {/* Social Community & Share */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              {t("social.title")}
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
              {t("social.desc")}
            </p>
            
            {/* Real social sharing vectors */}
            <div className="flex flex-col space-y-3.5">
              <div className="flex items-center space-x-2">
                <a
                  href="https://t.me/OromiaHealth" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <span>Telegram Channel</span>
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-blue-700 hover:text-white transition-colors text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Facebook
                </a>
              </div>
              
              <button
                id="footer-share-portal"
                onClick={handleShare}
                className="w-full text-center border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition-colors py-2 text-xs rounded-lg font-semibold cursor-pointer"
              >
                🔗 {t("social.share")}
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-sans">
          
          <p>© 2026 Chiro General Hospital. All rights reserved. Oromia Health Bureau Department Portal.</p>
          
          {/* Secured administrative and patient access points */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2.5 items-center">
            <button
              id="patient-portal-footer-trigger"
              onClick={() => {
                setCurrentTab("portal");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800/60 border hover:bg-slate-800 hover:text-blue-400 transition-all font-mono text-[11px] ${
                currentTab === "portal"
                  ? "border-blue-500 text-blue-400 shadow-sm"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              <span>{t("nav.portal")}</span>
            </button>

            <button
              id="admin-dashboard-footer-trigger"
              onClick={() => {
                setCurrentTab("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800/60 border hover:bg-slate-800 hover:text-blue-400 transition-all font-mono text-[11px] ${
                currentTab === "admin"
                  ? "border-blue-500 text-blue-400 shadow-sm"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t("nav.admin")} (passcode: chiro123)</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
