/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Language, Doctor } from "../types";
import { translations } from "../translations";
import { 
  Search, 
  Filter, 
  Clock, 
  GraduationCap, 
  CalendarCheck, 
  UserRound,
  CheckCircle,
  Briefcase
} from "lucide-react";

interface DoctorsSectionProps {
  language: Language;
  doctors: Doctor[];
  setSelectedDocId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
}

export default function DoctorsSection({
  language,
  doctors,
  setSelectedDocId,
  setCurrentTab,
}: DoctorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const handleBookDoctor = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentTab("book");
  };

  // Get unique specializations for filtering based on English tags (for stability)
  const uniqueSpecialties = ["all", "gnecologist", "pediatric", "surgeon", "emergency"];

  // Mapping tags to friendly translations
  const specialtyLabel = (specKey: string) => {
    if (specKey === "all") return t("doc.filter.all");
    if (specKey === "gnecologist") return language === "om" ? "Deessiftuu (OB/GYN)" : language === "am" ? "የማህፀን ህክምና" : "OB/GYN Specialisms";
    if (specKey === "pediatric") return language === "om" ? "Daa'imman (Pediatrics)" : language === "am" ? "የህጻናት ህክምና" : "Pediatric Care";
    if (specKey === "surgeon") return language === "om" ? "Baqaqsanii (Surgery)" : language === "am" ? "ቀዶ ጥገና" : "Surgery Unit";
    if (specKey === "emergency") return language === "om" ? "Atattama (Emergency)" : language === "am" ? "ድንገተኛ ህክምና" : "Emergency Medicine";
    return specKey;
  };

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const specOm = (doc.specialization.om || "").toLowerCase();
    const specAm = (doc.specialization.am || "").toLowerCase();
    const specEn = (doc.specialization.en || "").toLowerCase();
    
    const specMatch = 
      specOm.includes(searchQuery.toLowerCase()) || 
      specAm.includes(searchQuery.toLowerCase()) || 
      specEn.includes(searchQuery.toLowerCase());

    const queryMatch = nameMatch || specMatch;

    if (selectedSpecialty === "all") return queryMatch;
    
    // Check keyword within English specialty for stable category mappings
    if (selectedSpecialty === "gnecologist") {
      return queryMatch && (specEn.includes("gynecologist") || specEn.includes("obstetrician"));
    }
    if (selectedSpecialty === "pediatric") {
      return queryMatch && specEn.includes("pediatric");
    }
    if (selectedSpecialty === "surgeon") {
      return queryMatch && specEn.includes("surgeon");
    }
    if (selectedSpecialty === "emergency") {
      return queryMatch && (specEn.includes("emergency") || specEn.includes("trauma"));
    }

    return queryMatch;
  });

  return (
    <div id="doctors-section" className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Information */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-black font-display text-slate-950 tracking-tight">
          {t("doc.title")}
        </h2>
        <p className="text-sm text-slate-500 font-sans leading-relaxed">
          {t("doc.subtitle")}
        </p>
      </div>

      {/* 2. Interactive Search & Filters Panel */}
      <div id="search-filter-panel" className="bg-slate-50 p-4 border border-slate-200/60 rounded-2.5xl grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Dynamic Text Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="doctor-search-input"
            type="text"
            placeholder={t("doc.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none"
          />
        </div>

        {/* Specialty Category Selector */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            id="doctor-specialty-filter"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none appearance-none cursor-pointer"
          >
            {uniqueSpecialties.map((item) => (
              <option key={item} value={item}>
                {specialtyLabel(item)}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* 3. Render Card Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
          <UserRound className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500 font-bold font-sans">No matching specialist was found in our directory.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedSpecialty("all"); }}
            className="text-xs text-blue-600 font-extrabold hover:underline"
          >
            Clear Filters & Try Again
          </button>
        </div>
      ) : (
        <div id="doctors-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const spec = doc.specialization[language] || doc.specialization["en"];
            const av = doc.availability[language] || doc.availability["en"];
            const bio = doc.bio[language] || doc.bio["en"];

            return (
              <div 
                key={doc.id} 
                id={`doctor-card-${doc.id}`}
                className="bg-white border border-slate-100 rounded-2.5xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Avatar / Portrait Frame */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-200/50 flex items-center justify-center border border-blue-50 shadow-inner">
                    {doc.photoUrl ? (
                      <img 
                        src={doc.photoUrl} 
                        alt={doc.name} 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center space-y-1 text-blue-800">
                        <div className="p-4 bg-white/80 rounded-full shadow-sm inline-block">
                          <UserRound className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-[10px] font-mono tracking-wider uppercase font-extrabold block">Resident Clinician</p>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-lg px-2.5 py-1 text-[11px] font-extrabold shadow-sm flex items-center space-x-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{doc.experience} {t("doc.years")}</span>
                    </div>
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-black font-display text-slate-950 flex items-center space-x-1.5">
                      <span>{doc.name}</span>
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
                    </h3>
                    <div className="text-blue-700 font-extrabold text-xs tracking-tight uppercase">
                      {spec}
                    </div>
                  </div>

                  {/* Bio brief */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                    {bio}
                  </p>

                  <hr className="border-slate-100" />

                  {/* Shift slot availability and duration info */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans text-xs">
                    <div className="flex items-center text-slate-700 space-x-2">
                      <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[10px] block text-slate-400 uppercase tracking-wider">{t("doc.availability")}</span>
                        <span className="font-semibold text-slate-700">{av}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Booking Trigger Slot */}
                <div className="pt-5">
                  <button
                    onClick={() => handleBookDoctor(doc.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-100 hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>{t("doc.book.btn")}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
