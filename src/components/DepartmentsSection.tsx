/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Language, Department } from "../types";
import { translations } from "../translations";
import { 
  Baby, 
  Activity, 
  Heart, 
  ArrowRight, 
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

interface DepartmentsSectionProps {
  language: Language;
  departments: Department[];
  setSelectedDeptId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
}

export default function DepartmentsSection({
  language,
  departments,
  setSelectedDeptId,
  setCurrentTab,
}: DepartmentsSectionProps) {

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "baby":
        return <Baby className="h-6 w-6 text-pink-600" />;
      case "activity":
        return <Activity className="h-6 w-6 text-red-600" />;
      case "heart":
        return <Heart className="h-6 w-6 text-blue-600" />;
      default:
        return <Heart className="h-6 w-6 text-blue-600" />;
    }
  };

  const localDepts: Department[] = departments && departments.length > 0 ? departments : [];

  const handleBookShortcut = (deptId: string) => {
    setSelectedDeptId(deptId);
    setCurrentTab("book");
  };

  return (
    <div id="departments-section" className="space-y-8 animate-fadeIn">
      
      {/* 1. Introductory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-black font-display text-slate-950 tracking-tight">
          {t("dept.title")}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">
          {t("dept.subtitle")}
        </p>
      </div>

      {/* 2. Structured Grid List */}
      <div id="departments-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {localDepts.map((dept) => {
          const name = dept.name[language] || dept.name["en"];
          const desc = dept.description[language] || dept.description["en"];
          const serviceList = dept.services[language] || dept.services["en"] || [];

          return (
            <div 
              key={dept.id} 
              id={`dept-card-${dept.id}`}
              className="bg-white border border-slate-100 rounded-2.5xl p-6.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                
                {/* Badge Icon Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-50 rounded-2xl shadow-inner inline-block">
                    {getIcon(dept.icon)}
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                    Active Specialism
                  </span>
                </div>

                {/* Info Text */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black font-display text-slate-900 leading-snug">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {desc}
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Sub-services Index */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("dept.services.included")}
                  </div>
                  <ul className="space-y-1.5">
                    {serviceList.map((srv, idx) => (
                      <li key={idx} className="flex items-center text-xs text-slate-600 space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-semibold">{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Patient pathway shortcut */}
              <div className="pt-6">
                <button
                  onClick={() => handleBookShortcut(dept.id)}
                  className="w-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>{t("doc.book.btn")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. General Secondary Medical Services Overview Banner */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6.5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="col-span-1 md:col-span-3 space-y-2">
            <h4 className="font-bold text-slate-900 text-base font-display">
              Pharmacy & Ambulance Backups
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We operate an on-site, fully stocked pharmaceuticals dispensary linked directly to the outpatient ward, alongside 3 active, radio-equipped ambulances for immediate trauma callouts in the Hararghe region. No registration required for emergency.
            </p>
          </div>
          
          <button
            onClick={() => setCurrentTab("contact")}
            className="w-full bg-white hover:bg-slate-100 font-bold text-slate-700 py-3 rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer"
          >
            Emergency Guidelines
          </button>
        </div>
      </div>

    </div>
  );
}
