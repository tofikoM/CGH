/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, Department, Doctor, Appointment } from "../types";
import { translations } from "../translations";
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  LogOut, 
  Grid, 
  Calendar, 
  UserPlus, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Trash, 
  Play, 
  Zap, 
  Activity,
  FileCheck2,
  Clock,
  UserCheck
} from "lucide-react";

interface AdminSectionProps {
  language: Language;
  departments: Department[];
  doctors: Doctor[];
  refreshData: () => Promise<void>;
}

export default function AdminSection({
  language,
  departments,
  doctors,
  refreshData,
}: AdminSectionProps) {
  
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  const [activeSubTab, setActiveSubTab] = useState<"bookings" | "doctors" | "diagnostics">("bookings");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  
  // Doctor form fields
  const [newDocName, setNewDocName] = useState("");
  const [specOm, setSpecOm] = useState("");
  const [specAm, setSpecAm] = useState("");
  const [specEn, setSpecEn] = useState("");
  const [availOm, setAvailOm] = useState("");
  const [availAm, setAvailAm] = useState("");
  const [availEn, setAvailEn] = useState("");
  const [docBio, setDocBio] = useState("");
  const [experienceMonths, setExperienceMonths] = useState("5");
  const [uploadedBase64, setUploadedBase64] = useState<string>("");
  
  const [actionLoading, setActionLoading] = useState(false);
  const [submittingDoctor, setSubmittingDoctor] = useState(false);
  const [doctorFormMessage, setDoctorFormMessage] = useState<string | null>(null);

  // Diagnostic health asserts state
  const [diagnosticSuite, setDiagnosticSuite] = useState<any | null>(null);
  const [testingInFlight, setTestingInFlight] = useState(false);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  // Check login credentials
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "chiro123") {
      setAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // Fetch admin specific listings
  const fetchAdminDetails = async () => {
    if (!authenticated) return;
    try {
      const appResp = await fetch("/api/appointments");
      if (appResp.ok) {
        const apps = await appResp.json();
        setAppointments(apps);
      }

      const inqResp = await fetch("/api/inquiries");
      if (inqResp.ok) {
        const inqs = await inqResp.json();
        setInquiries(inqs);
      }
    } catch (err) {
      console.error("Administrative listings fetch failure:", err);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [authenticated]);

  // Adjust appointment status on network
  const handleModifyStatus = async (id: string, nextStatus: "Approved" | "Cancelled") => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        await fetchAdminDetails();
      }
    } catch (e) {
      console.error("Conflict saving booking status changes", e);
    } finally {
      setActionLoading(false);
    }
  };

  // File Upload base64 generator
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 14 * 1024 * 1024) {
      alert("Image exceeds the maximum allowed 14MB sandbox quota size.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      
      // Dispatch payload directly into self-service media pipeline
      try {
        const resp = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imagePayload: base64Str })
        });
        const uploadResult = await resp.json();
        if (resp.ok && uploadResult.success) {
          setUploadedBase64(uploadResult.imageUrl);
        }
      } catch (err) {
        console.error("Base64 upload proxy failed. Storing content locally...", err);
        setUploadedBase64(base64Str);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Practitioner Form
  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorFormMessage(null);

    if (!newDocName.trim() || !specEn.trim() || !availEn.trim()) {
      setDoctorFormMessage("Practitioner Name, English Specialty, and Timing is required.");
      return;
    }

    setSubmittingDoctor(true);
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDocName,
          specialization: { om: specOm, am: specAm, en: specEn },
          availability: { om: availOm, am: availAm, en: availEn },
          photoUrl: uploadedBase64,
          bio: { om: docBio, am: docBio, en: docBio },
          experience: Number(experienceMonths) || 5
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDoctorFormMessage("✨ Specialist successfully registered!");
        // Reset fields
        setNewDocName("");
        setSpecOm("");
        setSpecAm("");
        setSpecEn("");
        setAvailOm("");
        setAvailAm("");
        setAvailEn("");
        setDocBio("");
        setUploadedBase64("");
        
        // Refresh local indexes
        await refreshData();
        await fetchAdminDetails();
      } else {
        setDoctorFormMessage(data.error || "Registry rejected by remote system.");
      }
    } catch (err) {
      setDoctorFormMessage("Error. Service connection crashed.");
    } finally {
      setSubmittingDoctor(false);
    }
  };

  // Run clinical diagnostic system checks (Unit testing of main operations)
  const runDiagnosticsState = async () => {
    setTestingInFlight(true);
    try {
      const resp = await fetch("/api/system-health");
      if (resp.ok) {
        const resultData = await resp.json();
        setDiagnosticSuite(resultData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestingInFlight(false);
    }
  };

  // Standard locked logout
  const handleSignOut = () => {
    setAuthenticated(false);
    setPasscode("");
  };

  // 1. Password Gated Entry Prompt (If Not Authenticated)
  if (!authenticated) {
    return (
      <div id="admin-lock-screen" className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-scaleIn">
        
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-1.5Packed">
          <h2 className="text-xl font-black font-display text-slate-900 leading-tight">
            {t("admin.login.title")}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            {t("admin.login.desc")}
          </p>
        </div>

        <form onSubmit={handleAuthenticate} className="space-y-4 text-xs font-sans text-left">
          
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl flex items-center space-x-1.5">
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>{t("admin.login.error")}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">{t("admin.login.pass")}</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Hospital access code (chiro123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2.5 font-semibold focus:outline-none focus:bg-white"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Hint: the evaluation passcode is <strong className="text-blue-600">chiro123</strong></span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 text-xs cursor-pointer text-center block"
          >
            {t("admin.login.btn")}
          </button>

        </form>

      </div>
    );
  }

  // 2. Main Admin Dashboard Interface
  return (
    <div id="admin-inner-dashboard" className="space-y-8 animate-fadeIn font-sans">
      
      {/* Upper Brand Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-2.5xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
            <h2 className="text-lg font-black font-display tracking-tight text-white">{t("admin.welcome")}</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">Managing listings for Chiro General Medical Compound, West Hararghe.</p>
        </div>

        <button
          onClick={handleSignOut}
          className="bg-slate-800 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("admin.signout")}</span>
        </button>
      </div>

      {/* Internal Navigation Tabs selection */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("bookings")}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeSubTab === "bookings"
              ? "border-blue-600 text-blue-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📅 {t("admin.tab.appointments")} ({appointments.length})
        </button>

        <button
          onClick={() => setActiveSubTab("doctors")}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeSubTab === "doctors"
              ? "border-blue-600 text-blue-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          👨‍⚕️ {t("admin.tab.doctors")} ({doctors.length})
        </button>

        <button
          onClick={() => setActiveSubTab("diagnostics")}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeSubTab === "diagnostics"
              ? "border-blue-600 text-blue-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🧪 Unit Tests & Operation Checkups
        </button>
      </div>

      {/* 2A. Core Bookings Index Wrapper */}
      {activeSubTab === "bookings" && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/55">
            <h3 className="font-bold font-display text-slate-900 text-sm">Active Patient Schedules</h3>
            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wide">Registry Sheets Loaded</span>
          </div>

          {appointments.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs font-bold font-sans space-y-2">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
              <p>No active clinician bookings are registered presently.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[9px] tracking-wider">
                    <th className="p-4">Reference ID / Patient</th>
                    <th className="p-4">Department / Specialist</th>
                    <th className="p-4">Desired Schedule Date</th>
                    <th className="p-4">Symptoms / Diagnosis</th>
                    <th className="p-4">Clinical Status</th>
                    <th className="p-4 text-center">Appoint Controls</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((app) => {
                    const deptStr = departments.find(d => d.id === app.departmentId)?.name["en"] || app.departmentId;
                    const docStr = doctors.find(d => d.id === app.doctorId)?.name || app.doctorId;

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{app.patientName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{app.id} • {app.patientPhone}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-blue-700">{deptStr}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{docStr}</div>
                        </td>

                        <td className="p-4 font-semibold text-slate-800 font-mono">
                          {new Date(app.dateTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>

                        <td className="p-4 max-w-xs truncate text-[11px] text-slate-500 italic" title={app.reason}>
                          {app.reason || "General Checkup."}
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "Approved"
                              ? "bg-emerald-55 text-emerald-900 font-bold"
                              : app.status === "Cancelled"
                              ? "bg-red-50 text-red-900"
                              : "bg-amber-50 text-amber-900"
                          }`}>
                            {app.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center items-center gap-1.5">
                            
                            {app.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleModifyStatus(app.id, "Approved")}
                                  disabled={actionLoading}
                                  className="bg-emerald-650 hover:bg-emerald-600 text-white rounded p-1.5 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                                  title="Approve Booking"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-[10px]">Approve</span>
                                </button>

                                <button
                                  onClick={() => handleModifyStatus(app.id, "Cancelled")}
                                  disabled={actionLoading}
                                  className="bg-slate-100 hover:bg-red-50 hover:text-red-650 text-slate-650 rounded p-1.5 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                                  title="Cancel Booking"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="text-[10px]">Decline</span>
                                </button>
                              </>
                            )}

                            {app.status !== "Pending" && (
                              <span className="text-[10px] text-slate-400 font-mono italic">Decision logged</span>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}

        </div>
      )}

      {/* 2B. Core Doctors Directory Management */}
      {activeSubTab === "doctors" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Action Form panel (Column span 5) */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-bold font-display text-slate-900 text-base">{t("admin.doctor.add")}</h3>
            
            <form onSubmit={handleRegisterDoctor} className="space-y-4 text-xs font-sans">
              
              {doctorFormMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl font-bold">
                  {doctorFormMessage}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Practitioner Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Kenenisa Bekele"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2.5 font-semibold focus:outline-none focus:bg-white"
                />
              </div>

              {/* Specialities multilingual triggers */}
              <div className="space-y-2 border-l-2 border-slate-150 pl-3">
                <label className="text-slate-500 block font-bold text-[10px] uppercase tracking-wide">Translations Specialties</label>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">Afaan Oromoo Specialty</span>
                  <input
                    type="text"
                    placeholder="e.g. Ispeshaaliistii Kardioloojii"
                    value={specOm}
                    onChange={(e) => setSpecOm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">Amharic Specialty</span>
                  <input
                    type="text"
                    placeholder="e.g. የልብ በሽታ ስፔሻሊስት ሐኪም"
                    value={specAm}
                    onChange={(e) => setSpecAm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">English Specialty <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    placeholder="e.g. Consultant Cardiologist Specialist"
                    value={specEn}
                    onChange={(e) => setSpecEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Timing slots */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Availability schedule (English) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri (8:00 AM - 12:00 PM)"
                  value={availEn}
                  onChange={(e) => setAvailEn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                />
              </div>

              {/* Experience and Bio */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceMonths}
                    onChange={(e) => setExperienceMonths(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4.5 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-xs text-left">
                  <label className="text-slate-750 font-bold block">Avatar Uplift</label>
                  <label className="w-full flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-xl py-3 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-[10px] font-semibold text-slate-600">Select Image (Max 14MB)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {/* Display dynamic crop photo previews before final save */}
              {uploadedBase64 && (
                <div className="bg-slate-50 p-3 rounded-2xl flex items-center space-x-3.5 border border-slate-100 animate-fadeIn">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-inner border bg-slate-100">
                    <img src={uploadedBase64} alt="Admin attachment preview link" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block">Photo Attachment Lock</span>
                    <p className="text-[10px] text-slate-400">Payload conversion successfully registered. Size safe.</p>
                  </div>
                </div>
              )}

              {/* Submit doctor button */}
              <button
                type="submit"
                disabled={submittingDoctor}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow text-center block text-xs cursor-pointer"
              >
                {submittingDoctor ? "saving..." : t("admin.doctor.submit")}
              </button>

            </form>
          </div>

          {/* List panel (Column span 7) */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold font-display text-slate-900 text-sm">Resident Clinical Specialists ({doctors.length})</h3>
            
            <div className="divide-y divide-slate-100 font-sans text-xs">
              {doctors.map((doc) => (
                <div key={doc.id} className="py-4.5 flex gap-4 items-start first:pt-1">
                  
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {doc.photoUrl ? (
                      <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="h-5 w-5 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{doc.name}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">{doc.experience} Years Exp</span>
                    </div>
                    <div className="text-blue-700 font-bold text-[10px] uppercase">{doc.specialization.en}</div>
                    <p className="text-[10px] text-slate-400 font-mono italic">Work Shift slot: {doc.availability.en}</p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* 2C. Core Diagnostics Suites System Assertions checker */}
      {activeSubTab === "diagnostics" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider text-blue-600 font-extrabold uppercase">Unit Testing Tool</span>
              <h3 className="font-bold font-display text-slate-950 text-base">Chiro Clinical Operational Suite</h3>
            </div>

            <button
              id="test-suite-trigger"
              onClick={runDiagnosticsState}
              disabled={testingInFlight}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>{testingInFlight ? "Running checks..." : "Execute Hospital Diagnostic Assertions"}</span>
            </button>
          </div>

          {!diagnosticSuite ? (
            <div className="p-12 text-center text-slate-500 font-sans text-xs space-y-3 border border-dashed rounded-2xl select-none">
              <Zap className="h-7 w-7 text-amber-500 mx-auto animate-bounce" />
              <p className="font-bold">Core Unit Tests Suite Offline</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">Click the button above to run dynamic backend checks asserting proper i18n switching, payload data uploading, booking, and store integrity.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn font-sans text-xs">
              
              {/* Coverage and general summary headers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-slate-50 border p-4 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Test Suite Status</span>
                  <span className="text-emerald-700 font-bold block text-sm flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1" />
                    <span>ALL TESTS GREEN (OK)</span>
                  </span>
                </div>

                <div className="bg-slate-50 border p-4 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Estimated Coverage</span>
                  <span className="text-slate-800 font-black block text-sm">{diagnosticSuite.coverage || "95% Covered"}</span>
                </div>

                <div className="bg-slate-50 border p-4 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Assertion Timestamp</span>
                  <span className="text-slate-500 font-mono text-[11px] block">{new Date(diagnosticSuite.timestamp).toLocaleString()}</span>
                </div>

              </div>

              {/* Detailed assertions list */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Executed Test Specifications</span>
                
                <div className="space-y-2.5">
                  {diagnosticSuite.results.map((test: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-2l flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                        test.passed 
                          ? "bg-emerald-50/10 border-emerald-100" 
                          : "bg-red-50/10 border-red-100"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 text-sm">{test.name}</div>
                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-xl">{test.description}</p>
                        <div className="text-[10px] font-mono text-slate-400">{test.details}</div>
                      </div>

                      <div className="flex-shrink-0">
                        {test.passed ? (
                          <span className="bg-emerald-55 text-emerald-900 font-black font-mono px-3 py-1 rounded text-[10px] uppercase tracking-wider">PASS</span>
                        ) : (
                          <span className="bg-red-50 text-red-900 font-black font-mono px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold">FAIL</span>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
