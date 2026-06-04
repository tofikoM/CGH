/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Language } from "../types";
import { translations } from "../translations";
import { 
  Phone, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Users, 
  Bed, 
  Stethoscope, 
  Award,
  ArrowRight,
  Heart,
  BriefcaseMedical
} from "lucide-react";

interface HomeSectionProps {
  language: Language;
  setCurrentTab: (tab: string) => void;
}

export default function HomeSection({ language, setCurrentTab }: HomeSectionProps) {
  
  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const localStats = [
    {
      id: "stat-patients",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      value: "45,000+",
      label: t("home.stats.patients")
    },
    {
      id: "stat-doctors",
      icon: <Stethoscope className="h-6 w-6 text-emerald-600" />,
      value: "25+",
      label: t("home.stats.doctors")
    },
    {
      id: "stat-beds",
      icon: <Bed className="h-6 w-6 text-teal-600" />,
      value: "160+",
      label: t("home.stats.beds")
    },
    {
      id: "stat-experience",
      icon: <Award className="h-6 w-6 text-amber-500" />,
      value: "35+",
      label: t("home.stats.experience")
    }
  ];

  return (
    <div id="home-section" className="space-y-12 animate-fadeIn">
      
      {/* 1. Hero Spotlight Block */}
      <section id="hero-banner" className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white rounded-3xl shadow-xl shadow-blue-900/10 py-16 px-6 sm:px-12 lg:px-16">
        
        {/* Ambient abstract background overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 bg-blue-400 rounded-full animate-ping" />
            <span>Official Hospital Portal</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display leading-[1.1] tracking-tight">
            {t("home.hero.title")}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentTab("book")}
              className="bg-white hover:bg-blue-50 text-blue-900 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 border-b-2 border-blue-200 cursor-pointer"
            >
              <span>{t("home.hero.cta.book")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setCurrentTab("departments")}
              className="bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-xl font-semibold text-sm transition-all text-center cursor-pointer"
            >
              {t("home.hero.cta.more")}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Emergency Dispatch Red Alert Bar */}
      <section 
        id="emergency-quick-alert" 
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 sm:p-6 shadow-md shadow-red-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse-slow"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 flex-shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-red-900 text-lg font-display flex items-center space-x-1.5">
              <span>{t("emergency.title")}</span>
              <span className="text-[10px] uppercase font-semibold bg-red-600 text-white px-2 py-0.5 rounded">24/7 Active</span>
            </h3>
            <p className="text-xs text-red-700 max-w-xl leading-relaxed">
              {t("emergency.desc")}
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            href="tel:+251255510134"
            className="bg-red-600 hover:bg-red-700 text-white text-center py-3 px-6 rounded-xl font-bold text-sm shadow-md shadow-red-200 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Dial: +251 25 551 0134</span>
          </a>
          
          <button
            onClick={() => setCurrentTab("contact")}
            className="bg-white hover:bg-slate-50 border border-red-200 text-red-700 font-semibold py-3 px-5 text-center text-xs rounded-xl transition-all"
          >
            {t("emergency.location")}
          </button>
        </div>
      </section>

      {/* 3. Core Hospital Statistics Grid */}
      <section id="statistics-panel" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {localStats.map((stat) => (
          <div 
            key={stat.id} 
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4"
          >
            <div className="p-2.5 bg-slate-50 rounded-xl flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 font-display tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 font-medium leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Core Clinical Values Panel */}
      <section id="clinical-values" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-black font-display text-slate-800">
            {t("home.values.title")}
          </h3>
          <p className="text-xs text-slate-500">
            Guiding healthcare deliverance based on ethics, modern facilities, and compassion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Patient-Centered Care */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Heart className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base font-display">
              {t("home.values.patience")}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("home.values.patience.desc")}
            </p>
          </div>

          {/* Card 2: Advanced Equipment */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base font-display">
              {t("home.values.tech")}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("home.values.tech.desc")}
            </p>
          </div>

          {/* Card 3: 24/7 Out Of Hours Availability */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base font-display">
              Maternal & Trauma Emergency Response
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chiro General handles around-the-clock urgent trauma, orthopedics, and inpatient deliveries immediately under standard guidelines.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Regional Community Health Commitment banner */}
      <section className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 font-mono">Governed Health Policy</span>
          <h4 className="text-xl font-bold font-display text-slate-800">
            Serving Oromia Region & Surrounds
          </h4>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Chiro General Hospital functions strictly in unison with the Oromia Regional Health Bureau to improve medical access, reduce maternal mortality rates, and distribute vaccines in the West Hararghe region.
          </p>
        </div>
        
        <button
          onClick={() => setCurrentTab("departments")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
        >
          <span>See Medical Capabilities</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

    </div>
  );
}
