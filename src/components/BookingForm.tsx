/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, Department, Doctor, Appointment } from "../types";
import { translations } from "../translations";
import { 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Building,
  Printer,
  RefreshCw
} from "lucide-react";

interface BookingFormProps {
  language: Language;
  departments: Department[];
  doctors: Doctor[];
  selectedDeptId: string | null;
  setSelectedDeptId: (id: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
}

export default function BookingForm({
  language,
  departments,
  doctors,
  selectedDeptId,
  setSelectedDeptId,
  selectedDocId,
  setSelectedDocId,
}: BookingFormProps) {
  
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<Appointment | null>(null);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  // Get early tomorrow's ISO block for calendar min date constraint
  const getMinDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0] + "T08:00";
  };

  // Dynamically filter matching physicians based on chosen department
  const filteredDoctors = doctors.filter((doc) => {
    if (!selectedDeptId) return true;
    
    // Core specialty classification tags mapped to department IDs
    const specEn = (doc.specialization.en || "").toLowerCase();
    
    if (selectedDeptId === "maternity-pediatric") {
      return specEn.includes("gynecologist") || specEn.includes("obstetrician") || specEn.includes("pediatric");
    }
    if (selectedDeptId === "surgery-trauma") {
      return specEn.includes("surgeon") || specEn.includes("surgery") || specEn.includes("trauma");
    }
    if (selectedDeptId === "outpatient-diagnostics") {
      return true; // diagnostics maps to overall clinics
    }
    return true;
  });

  // Keep physician in sync: if selected doctor isn't in filtered slot, reset doc allocation
  useEffect(() => {
    if (selectedDocId && selectedDeptId) {
      const isValid = filteredDoctors.some((d) => d.id === selectedDocId);
      if (!isValid) {
        setSelectedDocId(null);
      }
    }
  }, [selectedDeptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!patientName.trim()) {
      setFormError(language === "om" ? "Maaloo maqaa guutuu barreessi." : language === "am" ? "እባክዎን ስምዎን በትክክል ያስገቡ።" : "Full Name is required.");
      return;
    }
    if (!patientPhone.trim()) {
      setFormError(language === "om" ? "Lakk. bilbilaa atattamaa!" : language === "am" ? "እባክዎን ስልክ ቁጥር ያስገቡ።" : "Phone number is required.");
      return;
    }
    // Simple phone validator matching Ethiopian grids (09... or 07... or +251...)
    const phoneRegex = /^(?:\+251|0)[79]\d{8}$/;
    if (!phoneRegex.test(patientPhone.replace(/\s+/g, ""))) {
      setFormError(language === "om" ? "Lakk. bilbilaa dogoggora! (Fkn: 0912345678)" : language === "am" ? "ያልተፈቀደ ስልክ ቁጥር! (ምሳሌ፡ 0912345678)" : "Invalid Ethiopian phone format. (e.g. 0912345678 or +251912345678)");
      return;
    }
    if (!selectedDeptId) {
      setFormError(language === "om" ? "Maaloo kutaa hospitaalaa filadhu." : language === "am" ? "እባክዎን የህክምና ክፍል ይምረጡ።" : "Please select a department.");
      return;
    }
    if (!selectedDocId) {
      setFormError(language === "om" ? "Maaloo doktora dhuunfaa filadhu." : language === "am" ? "እባክዎን የህክምና ባለሙያ ይምረጡ።" : "Please allocate a specialist consultant.");
      return;
    }
    if (!dateTime) {
      setFormError(language === "om" ? "Guyyaa fi sa'aatii marii filadhu." : language === "am" ? "እባክዎን የቀጠሮ ቀን እና ሰዓት ይምረጡ።" : "Please select date and slot timing.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientPhone,
          patientEmail,
          departmentId: selectedDeptId,
          doctorId: selectedDocId,
          dateTime,
          reason,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessReceipt(data.appointment);
        // Clear inputs
        setPatientName("");
        setPatientPhone("");
        setPatientEmail("");
        setDateTime("");
        setReason("");
        setSelectedDeptId(null);
        setSelectedDocId(null);
      } else {
        setFormError(data.error || "A collection-registry fault occurred in our servers.");
      }
    } catch (err) {
      setFormError("Server connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPrintReceipt = () => {
    window.print();
  };

  const handleResetForm = () => {
    setSuccessReceipt(null);
    setFormError(null);
  };

  // Success Sheet Markup Printer
  if (successReceipt) {
    const deptObject = departments.find(d => d.id === successReceipt.departmentId);
    const docObject = doctors.find(d => d.id === successReceipt.doctorId);
    
    const displayDept = deptObject ? (deptObject.name[language] || deptObject.name["en"]) : successReceipt.departmentId;
    const displayDoc = docObject ? docObject.name : successReceipt.doctorId;

    return (
      <div id="booking-success-container" className="max-w-2xl mx-auto bg-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-500/5 animate-scaleIn print:border-none print:shadow-none">
        <div className="text-center space-y-4 print:space-y-2">
          
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner print:hidden">
            <CheckCircle className="h-10 w-10" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black font-display text-emerald-900 leading-snug">
              {t("book.success.sub")}
            </h2>
            <p className="text-xs text-slate-500 font-sans print:hidden">
              {t("book.success")}
            </p>
          </div>

          {/* Core Reciept Design */}
          <div id="printable-receipt" className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 text-left font-sans space-y-4 print:bg-white print:border-solid print:p-0">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold font-display text-slate-900 uppercase text-xs tracking-wider">Chiro General Hospital</h3>
                <p className="text-[10px] text-slate-400 font-mono">Official Admission Ticket</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-emerald-600 text-white font-mono text-xs px-2.5 py-1 rounded-lg font-bold">
                  {successReceipt.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Patient Name</span>
                <span className="text-slate-800 font-bold">{successReceipt.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Cell Contact</span>
                <span className="text-slate-800 font-semibold font-mono">{successReceipt.patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Department Block</span>
                <span className="text-slate-800 font-bold text-blue-700">{displayDept}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Allocated Practitioner</span>
                <span className="text-slate-800 font-bold">{displayDoc}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Reserved Date & Slot Time</span>
                <span className="text-slate-800 font-bold font-mono text-amber-700">
                  {new Date(successReceipt.dateTime).toLocaleString(language === "om" ? "om" : language === "am" ? "am" : "en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Current Status</span>
                <span className="inline-flex items-center space-x-1 font-extrabold text-[10px] text-amber-600 uppercase">
                  <span>● Pending Desk Confirmation</span>
                </span>
              </div>
            </div>

            {successReceipt.reason && (
              <div className="border-t border-slate-200 pt-3 text-xs">
                <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wide">Declared Reason / Symptoms</span>
                <p className="text-slate-600 italic leading-relaxed">{successReceipt.reason}</p>
              </div>
            )}

            <div className="text-[10px] text-slate-400/80 leading-relaxed border-t border-slate-200 pt-3 text-center">
              Please present this reference ID block or show this screen to the reception terminal in Chiro General Hospital upon physical checkin.
            </div>

          </div>

          {/* Receipt Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden justify-center">
            <button
              onClick={triggerPrintReceipt}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
            >
              <Printer className="h-4 w-4" />
              <span>Print Local Receipt</span>
            </button>
            
            <button
              onClick={handleResetForm}
              className="bg-blue-50 text-blue-800 border border-blue-100 hover:bg-blue-100 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Schedule Another Session</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="booking-form-wrapper" className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Dynamic Introductions */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black font-display text-slate-950 tracking-tight">
          {t("book.title")}
        </h2>
        <p className="text-sm text-slate-500 font-sans max-w-xl mx-auto leading-relaxed">
          {t("book.subtitle")}
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="patient-name" className="text-xs font-bold text-slate-700 block">
                {t("book.form.name")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="patient-name"
                  type="text"
                  placeholder="e.g. Mahammed Mureta"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Contact Phone Input */}
            <div className="space-y-1.5">
              <label htmlFor="patient-phone" className="text-xs font-bold text-slate-700 block">
                {t("book.form.phone")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="patient-phone"
                  type="tel"
                  placeholder="e.g. 0912345678"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Requires Ethiopian phone prefix formats.</span>
            </div>

            {/* Optional Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="patient-email" className="text-xs font-bold text-slate-700 block">
                {t("book.form.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="patient-email"
                  type="email"
                  placeholder="e.g. medical@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Selecting Hospital Department */}
            <div className="space-y-1.5">
              <label htmlFor="booking-dept" className="text-xs font-bold text-slate-700 block">
                {t("book.form.dept")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="booking-dept"
                  value={selectedDeptId || ""}
                  onChange={(e) => setSelectedDeptId(e.target.value || null)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Choose Speciality unit --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name[language] || dept.name["en"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selecting Doctor Consultant (filtered dynamically!) */}
            <div className="space-y-1.5">
              <label htmlFor="booking-doctor" className="text-xs font-bold text-slate-700 block">
                {t("book.form.doctor")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="booking-doctor"
                  value={selectedDocId || ""}
                  onChange={(e) => setSelectedDocId(e.target.value || null)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Choose clinician specialist --</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - ({doc.specialization[language] || doc.specialization["en"]})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Physician list updates relative to chosen department branch.</span>
            </div>

            {/* Preferred Appointment Date & Time */}
            <div className="space-y-1.5">
              <label htmlFor="booking-datetime" className="text-xs font-bold text-slate-700 block">
                {t("book.form.date")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="booking-datetime"
                  type="datetime-local"
                  min={getMinDateString()}
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Reason for Appointment (Brief Symptoms) */}
          <div className="space-y-1.5">
            <label htmlFor="booking-reason" className="text-xs font-bold text-slate-700 block">
              {t("book.form.reason")}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <textarea
                id="booking-reason"
                rows={3}
                placeholder="Declare brief symptoms or reason (e.g., severe joint pain, regular antenatal evaluation, minor cut dressing change)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit booking button */}
          <button
            id="book-form-submit-trigger"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-blue-100 hover:shadow-lg text-xs tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-1">
                <span>Saving Ticket...</span>
              </span>
            ) : (
              <span>{t("book.form.submit")}</span>
            )}
          </button>

        </form>
      </div>

    </div>
  );
}
