/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, Department, Doctor } from "./types";
import { translations } from "./translations";

// Imports extracted modular sections
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import DepartmentsSection from "./components/DepartmentsSection";
import DoctorsSection from "./components/DoctorsSection";
import BookingForm from "./components/BookingForm";
import ContactSection from "./components/ContactSection";
import AdminSection from "./components/AdminSection";
import PatientPortalSection from "./components/PatientPortalSection";

export default function App() {
  
  // Set default language to Afaan Oromoo matching regional Oromia context, check localStorage.
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("cgh-portal-lang");
    return (saved as Language) || "om";
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const savedTab = localStorage.getItem("cgh-portal-tab");
    return savedTab || "home";
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Deeply link category and physician selects across tabs
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("cgh-portal-lang", lang);
  };

  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    localStorage.setItem("cgh-portal-tab", tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pull initial clinical listings from Express database
  const refreshClinicalData = async () => {
    try {
      const deptResp = await fetch("/api/departments");
      if (deptResp.ok) {
        const depts = await deptResp.json();
        setDepartments(depts);
      }

      const docResp = await fetch("/api/doctors");
      if (docResp.ok) {
        const docs = await docResp.json();
        setDoctors(docs);
      }
    } catch (err) {
      console.error("Clinical dataset synchronization fault", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshClinicalData();
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  // Render the matching UI screen based on selected menu
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="py-24 text-center space-y-3 font-sans">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Syncing Chiro Database...</p>
        </div>
      );
    }

    switch (currentTab) {
      case "home":
        return (
          <HomeSection 
            language={language} 
            setCurrentTab={handleSetTab} 
          />
        );
      case "departments":
        return (
          <DepartmentsSection
            language={language}
            departments={departments}
            setSelectedDeptId={setSelectedDeptId}
            setCurrentTab={handleSetTab}
          />
        );
      case "doctors":
        return (
          <DoctorsSection
            language={language}
            doctors={doctors}
            setSelectedDocId={setSelectedDocId}
            setCurrentTab={handleSetTab}
          />
        );
      case "book":
        return (
          <BookingForm
            language={language}
            departments={departments}
            doctors={doctors}
            selectedDeptId={selectedDeptId}
            setSelectedDeptId={setSelectedDeptId}
            selectedDocId={selectedDocId}
            setSelectedDocId={setSelectedDocId}
          />
        );
      case "contact":
        return (
          <ContactSection 
            language={language} 
          />
        );
      case "portal":
        return (
          <PatientPortalSection
            language={language}
            departments={departments}
            doctors={doctors}
          />
        );
      case "admin":
        return (
          <AdminSection
            language={language}
            departments={departments}
            doctors={doctors}
            refreshData={refreshClinicalData}
          />
        );
      default:
        return (
          <HomeSection 
            language={language} 
            setCurrentTab={handleSetTab} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Header Toolbar Navigation */}
      <Header
        language={language}
        setLanguage={setLanguage}
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
      />

      {/* 2. Main Body Content (rendered dynamically) */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderTabContent()}
      </main>

      {/* 3. Footer Links Area */}
      <Footer
        language={language}
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
      />

    </div>
  );
}
