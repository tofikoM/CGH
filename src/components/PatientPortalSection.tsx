/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, Department, Doctor, Appointment, Announcement, Patient } from "../types";
import { translations } from "../translations";
import { 
  Lock, 
  User, 
  Mail, 
  Calendar, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  LogOut, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Info, 
  ChevronDown, 
  FileText,
  Activity,
  Heart,
  TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

interface PatientPortalSectionProps {
  language: Language;
  departments: Department[];
  doctors: Doctor[];
}

export default function PatientPortalSection({ language, departments, doctors }: PatientPortalSectionProps) {
  // Authentication states
  const [patient, setPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem("cgh-patient-profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("cgh-patient-token");
  });

  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other"
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Portal dashboard navigation
  const [activeTab, setActiveTab] = useState<"summary" | "appointments" | "announcements" | "notifications" | "history" | "billing" | "book" | "profile" | "trends">("summary");

  // Portal data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Checkout flow states
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CBE Birr");

  // New secure portal appointment form
  const [bookingForm, setBookingForm] = useState({
    departmentId: "",
    doctorId: "",
    dateTime: "",
    reason: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Profile update form elements
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other"
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Real-time notifications and alerts states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationsFilter, setNotificationsFilter] = useState<"all" | "unread">("all");

  // Translation helper
  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const getTranslatedString = (obj: any): string => {
    if (!obj) return "";
    return obj[language] || obj["en"] || "";
  };

  // Fetch secure patient notifications
  const fetchNotifications = async (activeToken?: string | null) => {
    const currentToken = activeToken || token;
    if (!currentToken) return;
    try {
      const resp = await fetch("/api/patient/notifications", {
        headers: { "Authorization": `Bearer ${currentToken}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setNotifications(data);
        const unreads = data.filter((n: any) => !n.read);
        setUnreadCount(unreads.length);
      }
    } catch (err) {
      console.error("Error fetching patient notifications list:", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      const resp = await fetch(`/api/patient/notifications/${id}/read`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed marking single alert as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const resp = await fetch("/api/patient/notifications/read-all", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed marking all alerts as read:", err);
    }
  };

  const [triggerLoading, setTriggerLoading] = useState(false);
  const handleTriggerDemo = async (type: "alert" | "announcement" | "clinical") => {
    if (!token) return;
    setTriggerLoading(true);
    try {
      const resp = await fetch("/api/patient/notifications/test-trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });
      if (resp.ok) {
        await fetchNotifications(token);
      }
    } catch (err) {
      console.error("Failed triggering test notification alert:", err);
    } finally {
      setTriggerLoading(false);
    }
  };

  const handlePayInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeInvoice) return;
    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(null);
    try {
      const resp = await fetch(`/api/patient/invoices/${activeInvoice.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod,
          cardHolder,
          cardNumber
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Payment process failed.");
      }
      setPaymentSuccess(t("portal.billing.success"));
      setCardNumber("");
      setCardHolder("");
      setCardExpiry("");
      setCardCvv("");
      
      // Update local invoice list status
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === activeInvoice.id ? { ...inv, status: "paid", paidAt: new Date().toISOString(), paymentMethod } : inv))
      );

      // Re-trigger patient info reload to update banners/notifications
      await fetchPortalData(token);

      setTimeout(() => {
        setActiveInvoice(null);
        setPaymentSuccess(null);
      }, 2000);
    } catch (err: any) {
      setPaymentError(err.message || "An unexpected gate error occurred.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Fetch secure patient portal info
  const fetchPortalData = async (activeToken: string) => {
    setDashboardLoading(true);
    try {
      // 1. Fetch secure patient appointments
      const apptResp = await fetch("/api/patient/appointments", {
        headers: { "Authorization": `Bearer ${activeToken}` }
      });
      if (apptResp.ok) {
        const data = await apptResp.json();
        setAppointments(data);
      }

      // 2. Fetch public Announcements
      const annResp = await fetch("/api/announcements");
      if (annResp.ok) {
        const data = await annResp.json();
        setAnnouncements(data);
      }

      // 3. Fetch notifications
      await fetchNotifications(activeToken);

      // 4. Fetch secure medical history
      const historyResp = await fetch("/api/patient/medical-history", {
        headers: { "Authorization": `Bearer ${activeToken}` }
      });
      if (historyResp.ok) {
        const data = await historyResp.json();
        setMedicalHistory(data);
      }

      // 5. Fetch secure invoices
      const invoicesResp = await fetch("/api/patient/invoices", {
        headers: { "Authorization": `Bearer ${activeToken}` }
      });
      if (invoicesResp.ok) {
        const data = await invoicesResp.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error("Error loading patient portal datasets:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortalData(token);
      
      // Set up real-time 10s interval polling
      const pollId = setInterval(() => {
        fetchNotifications(token);
      }, 10000);
      return () => clearInterval(pollId);
    }
  }, [token]);

  // Initializing profile edit form when user loads tab
  useEffect(() => {
    if (patient) {
      setProfileForm({
        name: patient.name,
        phone: patient.phone,
        dob: patient.dob,
        gender: patient.gender
      });
    }
  }, [patient, activeTab]);

  // Handle Authentication actions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const apiPath = authView === "login" ? "/api/patient/login" : "/api/patient/register";
    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (authView === "login" ? t("portal.error.login") : t("portal.error.register")));
      }

      // Save credentials session values safely
      localStorage.setItem("cgh-patient-token", data.token);
      localStorage.setItem("cgh-patient-profile", JSON.stringify(data.patient));
      setToken(data.token);
      setPatient(data.patient);
      setActiveTab("summary");
    } catch (err: any) {
      setAuthError(err.message || "Credential authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle patient profile updates
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileLoading(true);

    try {
      const response = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Profile updates failed.");
      }

      const updatedPatient = data.patient;
      localStorage.setItem("cgh-patient-profile", JSON.stringify(updatedPatient));
      setPatient(updatedPatient);
      setProfileMessage(language === "om" ? "Eebbi! Faayilli keessan sirreeffameera." : language === "am" ? "የታካሚ መረጃዎ በተሳካ ሁኔታ ተሻሽሏል!" : "Success! Your profile record has been synchronized.");
    } catch (err: any) {
      setProfileMessage(`Error: ${err.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle quick booking inside the secure portal
  const handlePortalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);
    setBookingLoading(true);

    try {
      const response = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingForm)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Securing reservation schedule failed.");
      }

      // File success message and reset booking inputs
      setBookingSuccess(data.appointment.id);
      setBookingForm({
        departmentId: "",
        doctorId: "",
        dateTime: "",
        reason: ""
      });

      // Reload appointments lists
      if (token) fetchPortalData(token);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Logout
  const handleSignOut = () => {
    localStorage.removeItem("cgh-patient-token");
    localStorage.removeItem("cgh-patient-profile");
    setToken(null);
    setPatient(null);
    setBookingSuccess(null);
    setBookingError(null);
    setAppointments([]);
  };

  // Safe helper to match select options correctly
  const doctorsFiltered = bookingForm.departmentId 
    ? doctors 
    : doctors;

  if (!patient || !token) {
    return (
      <div id="patient-auth-section" className="max-w-md mx-auto my-8 md:my-16 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden font-sans transition-all duration-300">
        
        {/* Banner Design */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 px-6 py-8 text-white relative">
          <div className="absolute right-4 top-4 opacity-15">
            <Heart className="w-24 h-24 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Activity className="w-6 h-6 animate-pulse" />
            {t("portal.title")}
          </h2>
          <p className="text-xs text-blue-100 font-medium">
            {t("portal.subtitle")}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => { setAuthView("login"); setAuthError(null); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              authView === "login"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {t("portal.login")}
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => { setAuthView("register"); setAuthError(null); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              authView === "register"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {t("portal.register")}
          </button>
        </div>

        {/* Authenticated Forms */}
        <form onSubmit={handleAuthSubmit} id="patient-auth-form" className="p-6 space-y-4">
          {authError && (
            <div id="auth-error-alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authView === "register" && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block" htmlFor="reg-name">
                  {t("portal.name")} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="reg-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mahammed Mureta"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block" htmlFor="reg-phone">
                  {t("portal.phone")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="reg-phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +251 911 22 33 44"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Flex Grid for DOB and Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block" htmlFor="reg-dob">
                    {t("portal.dob")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="reg-dob"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block" htmlFor="reg-gender">
                    {t("portal.gender")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="reg-gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white appearance-none transition-all"
                    >
                      <option value="Male">{t("portal.gender.male")}</option>
                      <option value="Female">{t("portal.gender.female")}</option>
                      <option value="Other">{t("portal.gender.other")}</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block" htmlFor="auth-email">
              {t("portal.email")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="auth-email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Account Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block" htmlFor="auth-password">
              {t("portal.password")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="auth-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={authLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 pr-4 pl-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-100 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : authView === "login" ? (
              t("portal.btn.login")
            ) : (
              t("portal.btn.register")
            )}
          </button>

          {/* Pre-filled Account Suggestion for Instant Sandbox testing */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              {language === "om" 
                ? "Mirkaneessuuf lakk. herrega kanaan dura qophaaye kanaan deemi:" 
                : language === "am"
                ? "ለመፈተሽ የተዘጋጀውን የታካሚ መለያ መጠቀም ይችላሉ፡"
                : "Sandbox testing? Sign in with default pre-configured credentials:"}
            </p>
            <div className="inline-block bg-slate-50 border border-slate-150 rounded-lg px-3 py-2 text-[10px] text-slate-600 font-mono text-left">
              <div><strong className="text-slate-700">Email:</strong> mahammedmureta@gmail.com</div>
              <div><strong className="text-slate-700">Password:</strong> patient123</div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Extract and sort diagnostic trends
  const parsedTrends = [...medicalHistory]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => {
      let fastingGlucose: number | null = null;
      let systolic: number | null = null;
      let diastolic: number | null = null;

      if (record.labResults) {
        record.labResults.forEach((lab: any) => {
          const testNameEn = lab.testName?.en?.toLowerCase() || "";
          const testNameOm = lab.testName?.om?.toLowerCase() || "";
          const testNameAm = lab.testName?.am?.toLowerCase() || "";

          const isGlucose = testNameEn.includes("glucose") || testNameEn.includes("fbg") || testNameOm.includes("sukkaara") || testNameAm.includes("የስኳር") || testNameEn.includes("fasting");
          if (isGlucose) {
            const num = parseFloat(lab.value);
            if (!isNaN(num)) fastingGlucose = num;
          }

          const isBP = testNameEn.includes("blood pressure") || testNameEn.includes("bp") || testNameOm.includes("dhiibbaa dhiigaa") || testNameAm.includes("የደም ግፊት");
          if (isBP) {
            const match = lab.value?.match(/(\d+)\/(\d+)/);
            if (match) {
              const sys = parseInt(match[1]);
              const dia = parseInt(match[2]);
              if (!isNaN(sys)) systolic = sys;
              if (!isNaN(dia)) diastolic = dia;
            }
          }
        });
      }

      return {
        formattedDate: new Date(record.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        date: record.date,
        fastingGlucose,
        systolic,
        diastolic,
        diagnosis: record.diagnosis?.[language] || record.diagnosis?.en || ""
      };
    });

  const latestRecord = medicalHistory[0];
  let latestGlucose: number | null = null;
  let latestSystolic: number | null = null;
  let latestDiastolic: number | null = null;
  let latestGlucoseStatus = "Normal";
  let latestBPStatus = "Normal";

  if (latestRecord && latestRecord.labResults) {
    latestRecord.labResults.forEach((lab: any) => {
      const testNameEn = lab.testName?.en?.toLowerCase() || "";
      const testNameOm = lab.testName?.om?.toLowerCase() || "";
      const testNameAm = lab.testName?.am?.toLowerCase() || "";

      const isGlucose = testNameEn.includes("glucose") || testNameEn.includes("fbg") || testNameOm.includes("sukkaara") || testNameAm.includes("የስኳር") || testNameEn.includes("fasting");
      if (isGlucose) {
        const num = parseFloat(lab.value);
        if (!isNaN(num)) latestGlucose = num;
        latestGlucoseStatus = lab.status || "Normal";
      }

      const isBP = testNameEn.includes("blood pressure") || testNameEn.includes("bp") || testNameOm.includes("dhiibbaa dhiigaa") || testNameAm.includes("የደም ግፊት");
      if (isBP) {
        const match = lab.value?.match(/(\d+)\/(\d+)/);
        if (match) {
          const sys = parseInt(match[1]);
          const dia = parseInt(match[2]);
          if (!isNaN(sys)) latestSystolic = sys;
          if (!isNaN(dia)) latestDiastolic = dia;
          latestBPStatus = lab.status || "Normal";
        }
      }
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-left text-xs font-sans space-y-1">
          <p className="font-mono text-[10px] text-slate-400">{label}</p>
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-bold">{item.name}:</span>
              <span className="font-mono text-sky-300 font-extrabold">{item.value} {item.unit || ""}</span>
            </div>
          ))}
          {payload[0]?.payload?.diagnosis && (
            <div className="pt-1.5 mt-1 border-t border-slate-800 text-slate-300 text-[11px] leading-snug">
              <strong className="text-slate-400">Diagnosis:</strong> {payload[0].payload.diagnosis}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Group appointments into upcoming vs past
  const nowTime = new Date().getTime();
  const upcomingAppointments = appointments.filter(appt => {
    // Upcoming includes Pending, Approved status as long as not cancelled
    return appt.status !== "Cancelled" && new Date(appt.dateTime).getTime() >= (nowTime - 2 * 60 * 60 * 1000);
  });

  const pastAppointments = appointments.filter(appt => {
    return appt.status === "Cancelled" || new Date(appt.dateTime).getTime() < (nowTime - 2 * 60 * 60 * 1000);
  });

  return (
    <div id="patient-dashboard-section" className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. Dashboard Header */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 stroke-[2]" />
            {t("portal.dashboard")}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {t("portal.welcome")} <span className="text-blue-700">{patient.name}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t("portal.mrun")}: <strong className="font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">{patient.mrun}</strong>
          </p>
        </div>

        {/* Quick logout & language metrics layout */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            type="button"
            id="portal-sync-btn"
            onClick={() => fetchPortalData(token)}
            disabled={dashboardLoading}
            className="p-2.5 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Sync Data"
          >
            <RefreshCw className={`w-4 h-4 ${dashboardLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          
          <button
            type="button"
            id="portal-signout-btn"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t("admin.signout")}
          </button>
        </div>
      </div>

      {/* 2. Grid Dashboard Section split into Sidebar and Main Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Rail Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Bento Medical Clinic ID Card Card */}
          <div id="portal-digital-id-card" className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <Activity className="w-40 h-40 stroke-[1]" />
            </div>
            
            {/* Chip graphic & Logo banner */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {t("portal.card.title")}
              </div>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>

            {/* Smart Chip representation */}
            <div className="w-8 h-6 bg-gradient-to-r from-amber-400 to-yellow-250 rounded-md mb-6 relative overflow-hidden opacity-85">
              <div className="absolute inset-0 grid grid-cols-3 gap-0.5 border-r border-b border-amber-600/30">
                <div className="border-r border-b border-amber-600/30"></div>
                <div className="border-r border-b border-amber-600/30"></div>
                <div className="border-b border-amber-600/30"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest">
                  {t("portal.name")}
                </div>
                <div className="text-sm font-bold tracking-tight">
                  {patient.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest">
                    {t("portal.mrun")}
                  </div>
                  <div className="text-xs font-bold font-mono tracking-wider text-sky-300">
                    {patient.mrun}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest">
                    {t("portal.gender")}
                  </div>
                  <div className="text-xs font-medium">
                    {patient.gender === "Male" ? t("portal.gender.male") : patient.gender === "Female" ? t("portal.gender.female") : t("portal.gender.other")}
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Barcode overlay */}
            <div className="mt-8 border-t border-slate-800 pt-4 flex flex-col items-center">
              <div className="w-full h-8 bg-slate-900 border border-slate-800 rounded flex gap-0.5 px-3 py-1.5 justify-center items-center select-none overflow-hidden hover:opacity-100 transition">
                {/* Simulated high fidelity styled barcode bars */}
                <div className="w-1 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1.5 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1 h-full bg-slate-100"></div>
                <div className="w-2 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1 h-full bg-slate-100"></div>
                <div className="w-1.5 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1 h-full bg-slate-100"></div>
                <div className="w-0.5 h-full bg-slate-100"></div>
                <div className="w-1 h-full bg-slate-100"></div>
              </div>
              <div className="text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                VERIFIED HOSPITAL RECORD
              </div>
            </div>
          </div>

          {/* Routing Navigation Links */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-subtle space-y-1">
            <button
              type="button"
              id="portal-nav-summary"
              onClick={() => setActiveTab("summary")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "summary"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Activity className="w-4 h-4" />
              {t("portal.tab.dashboard")}
            </button>

            <button
              type="button"
              id="portal-nav-appointments"
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t("portal.tab.appointments")}
              {appointments.length > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {appointments.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="portal-nav-announcements"
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "announcements"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              {t("portal.tab.announcements")}
              {announcements.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {announcements.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="portal-nav-notifications"
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Bell className="w-4 h-4" />
              {t("portal.tab.notifications")}
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse absolute right-3">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              id="portal-nav-history"
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                activeTab === "history"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {t("portal.tab.medical_history")}
              {medicalHistory.length > 0 && (
                <span className="ml-auto bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold absolute right-3">
                  {medicalHistory.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="portal-nav-trends"
              onClick={() => setActiveTab("trends")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                activeTab === "trends"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-violet-500" />
              {t("portal.tab.trends")}
            </button>

            <button
              type="button"
              id="portal-nav-billing"
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                activeTab === "billing"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-500" />
              {t("portal.tab.billing")}
              {invoices.filter(i => i.status === "unpaid").length > 0 && (
                <span className="ml-auto bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold absolute right-3">
                  {invoices.filter(i => i.status === "unpaid").length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="portal-nav-book"
              onClick={() => setActiveTab("book")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "book"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              {t("portal.appointments.book_new")}
            </button>

            <button
              type="button"
              id="portal-nav-profile"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4" />
              {language === "om" ? "Odeeffannoo Koo" : language === "am" ? "የግል መረጃ ሁኔታ" : "Edit Profile Record"}
            </button>
          </div>
        </div>

        {/* Dynamic Inner Tab Sheet Content Area */}
        <div className="lg:col-span-3 min-h-[450px]">
          
          {dashboardLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Synchronizing Secure Records...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: SUMMARY BOARD */}
              {activeTab === "summary" && (
                <div className="space-y-6" id="view-dashboard-summary">
                  
                  {/* Real-time Health Alerts banner on Summary board */}
                  {unreadCount > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-150 p-5 rounded-2xl flex items-start justify-between gap-4 shadow-xs relative overflow-hidden animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                          <Bell className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-red-800">
                            {language === "om" ? "Dhegayaa Ariifachiisaa!" : language === "am" ? "አስቸኳይ የጤና ማሳሰቢያ!" : "Critical Health Alert!"}
                          </h4>
                          <p className="text-xs font-medium text-slate-750 leading-normal">
                            {language === "om"
                              ? `Ergawwan haaraa fii dhegayaa fayyaa dubbifamne hin jirre ${unreadCount} sadii qabdu. Maaloo asirra ilaalaa.`
                              : language === "am"
                              ? `ለእርስዎ የተላኩ ${unreadCount} አዳዲስ አስቸኳይ ክሊኒካዊ መልእክቶች እና ማሳሰቢያዎች አሉ።`
                              : `You have ${unreadCount} unread health alerts or clinical updates pending in your notification stream.`}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab("notifications")}
                            className="text-xs text-red-700 hover:text-red-900 font-bold underline inline-flex items-center gap-1 cursor-pointer pt-0.5"
                          >
                            {language === "om" ? "Ergawwan Ilaali" : language === "am" ? "መልእክቶቹን እይ" : "View Critical Notifications"} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic notification on nearest upcoming checkup if exists */}
                  {upcomingAppointments.length > 0 ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-150 p-5 rounded-2xl flex items-start gap-4">
                      <div className="p-3 bg-blue-100 text-blue-700 rounded-xl relative">
                        <Calendar className="w-6 h-6 stroke-[2]" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                          {language === "om" ? "Qabannoo Isa Dhiyoo" : language === "am" ? "የቅርብ ጊዜ ቀጠሮዎ" : "Upcoming Medical Consultation"}
                        </h4>
                        <p className="text-sm font-bold text-slate-800 leading-tight">
                          {getTranslatedString(departments.find(d => d.id === upcomingAppointments[0].departmentId)?.name)} - {upcomingAppointments[0].patientName}
                        </p>
                        <div className="text-xs text-slate-500 font-medium flex flex-wrap gap-x-4 gap-y-1 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {new Date(upcomingAppointments[0].dateTime).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-blue-600" />
                            {doctors.find(d => d.id === upcomingAppointments[0].doctorId)?.name || "Assigned Consultant"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                      <p className="text-xs text-slate-500 font-semibold">
                        {language === "om" 
                          ? "Qabannoo dhiyoo isin eeggatu hin jiru." 
                          : language === "am" 
                          ? "የቅርብ ጊዜ ቀጠሮ የሎትም።" 
                          : "No upcoming consultations scheduled currently."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("book")}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {t("portal.appointments.book_new")}
                      </button>
                    </div>
                  )}

                  {/* Dual Grid for Appointments review and News board */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Tiny Appointments summary container */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {t("portal.tab.appointments")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab("appointments")}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                        >
                          {language === "om" ? "Hunda Ilaali" : language === "am" ? "ሁሉንም እይ" : "View All"}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {appointments.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 space-y-2">
                          <Calendar className="w-8 h-8 mx-auto opacity-45" />
                          <p className="text-xs font-semibold">{t("portal.appointments.empty")}</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {appointments.slice(0, 3).map((appt) => {
                            const deptName = getTranslatedString(departments.find(d => d.id === appt.departmentId)?.name);
                            return (
                              <div key={appt.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150 flex items-center justify-between gap-3 transition">
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                                    {deptName || "Clinical Consult"}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {new Date(appt.dateTime).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                  </div>
                                </div>
                                
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                                  appt.status === "Approved"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : appt.status === "Pending"
                                    ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse"
                                    : "bg-rose-50 border-rose-200 text-rose-700"
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Announcements Board list widget */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-600" />
                          {t("portal.recent_news")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab("announcements")}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                        >
                          {language === "om" ? "Hunda Ilaali" : language === "am" ? "ሁሉንም እይ" : "View All"}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {announcements.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 space-y-2">
                          <Bell className="w-8 h-8 mx-auto opacity-45" />
                          <p className="text-xs font-semibold">{t("portal.announcements.empty")}</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {announcements.slice(0, 3).map((ann) => {
                            const titleStr = getTranslatedString(ann.title);
                            return (
                              <div key={ann.id} className="p-3 bg-slate-50 hover:bg-slate-150 rounded-xl border border-slate-150 space-y-1 transition text-left cursor-pointer" onClick={() => setActiveTab("announcements")}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    ann.category === "Clinical"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : ann.category === "Campaign"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-slate-150 text-slate-700 border border-slate-300"
                                  }`}>
                                    {ann.category}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-medium">
                                    {new Date(ann.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {titleStr}
                                </h4>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: FULL APPOINTMENTS REGISTRY VIEW */}
              {activeTab === "appointments" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-appointments-registry">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1 text-left">
                      <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        {t("portal.tab.appointments")}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium font-sans">
                        {language === "om" 
                          ? "Qabannoowwan keessan gosaan asitti argattu." 
                          : language === "am" 
                          ? "የቀጠሮዎችዎን ሁኔታ እና የወጪ ዝርዝሮችን እዚህ ይቆጣጠሩ።" 
                          : "Explore your upcoming consultations, past visits, and canceled allocations."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("book")}
                      className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {t("portal.appointments.book_new")}
                    </button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">{t("portal.appointments.empty")}</p>
                        <p className="text-[11px] text-slate-400">
                          {language === "om" ? "Tajaajila haaraa qorannoo qabachuuf galmaahi." : "Use the button above to secure a clinical scheduling slot instantly."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Section 1: Upcoming appointments */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {t("portal.appointments.upcoming")} ({upcomingAppointments.length})
                        </h3>
                        
                        {upcomingAppointments.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                            {language === "om" ? "Hamma yoonaatti qabannoon fassiraa hin jiru." : "No upcoming reservations scheduled presently."}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {upcomingAppointments.map((appt) => {
                              const dept = departments.find(d => d.id === appt.departmentId);
                              const doctor = doctors.find(d => d.id === appt.doctorId);
                              return (
                                <div key={appt.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm relative overflow-hidden transition flex flex-col justify-between text-left">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                          {appt.id}
                                        </span>
                                        <h4 className="text-xs font-extrabold text-slate-800 pt-1">
                                          {getTranslatedString(dept?.name) || "Consultation Routine"}
                                        </h4>
                                      </div>
                                      <span className="bg-amber-50 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 border border-amber-250 animate-pulse">
                                        {appt.status}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-slate-500 font-medium space-y-1">
                                      <div><strong className="text-slate-600">{t("admin.appoint.doctor")}:</strong> {doctor?.name || "Medical Board Coordinator"}</div>
                                      <div><strong className="text-slate-600">{t("admin.appoint.dateTime")}:</strong> {new Date(appt.dateTime).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>
                                      {appt.reason && (
                                        <div className="italic text-slate-400 pt-1 border-t border-slate-100 text-[10px]">
                                          "{appt.reason}"
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Past appointments */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          {t("portal.appointments.past")} ({pastAppointments.length})
                        </h3>

                        {pastAppointments.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                            {language === "om" ? "Seenaan dabarsitanii asirratti hin argamne." : "No historic or past clinical records saved."}
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {pastAppointments.map((appt) => {
                              const dept = departments.find(d => d.id === appt.departmentId);
                              const doctor = doctors.find(d => d.id === appt.doctorId);
                              return (
                                <div key={appt.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 opacity-80 hover:opacity-100 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono font-semibold text-slate-500">
                                        {appt.id}
                                      </span>
                                      <h4 className="text-xs font-bold text-slate-700">
                                        {getTranslatedString(dept?.name) || "Clinic Routine Checkup"}
                                      </h4>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium flex flex-wrap gap-x-4">
                                      <div><span className="text-slate-400">{t("admin.appoint.doctor")}:</span> {doctor?.name || "MD Consultant"}</div>
                                      <div><span className="text-slate-400">{t("admin.appoint.dateTime")}:</span> {new Date(appt.dateTime).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</div>
                                    </div>
                                  </div>

                                  <span className={`text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full self-start md:self-auto border ${
                                    appt.status === "Approved"
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : appt.status === "Cancelled"
                                      ? "bg-rose-50 border-rose-250 text-rose-700"
                                      : "bg-slate-100 border-slate-350 text-slate-700"
                                  }`}>
                                    {appt.status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PUBLIC BULLETINS NEWS SHEET */}
              {activeTab === "announcements" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-public-announcements">
                  <div className="border-b border-slate-100 pb-4 text-left">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      {t("portal.tab.announcements")}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {t("portal.subtitle")}
                    </p>
                  </div>

                  {announcements.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Bell className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">{t("portal.announcements.empty")}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {announcements.map((ann) => {
                        const titleStr = getTranslatedString(ann.title);
                        const contentStr = getTranslatedString(ann.content);
                        return (
                          <div key={ann.id} className="p-5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-2xl space-y-3 transition text-left">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded border ${
                                ann.category === "Clinical"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                  : ann.category === "Campaign"
                                  ? "bg-blue-50 text-blue-700 border-blue-250"
                                  : ann.category === "Outbreak"
                                  ? "bg-rose-50 text-rose-700 border-rose-250 animate-bounce"
                                  : "bg-slate-200 text-slate-700 border-slate-350"
                              }`}>
                                {ann.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(ann.publishedAt).toLocaleString(undefined, { dateStyle: "long" })}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <h3 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">
                                {titleStr}
                              </h3>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans whitespace-pre-line">
                                {contentStr}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SECURE CLINICAL NOTIFICATIONS & HEALTH ALERTS FEED */}
              {activeTab === "notifications" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-patient-notifications">
                  
                  {/* Top Header Row with dynamic refresh and Mark All as Read button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-500 animate-bounce" />
                        {t("portal.tab.notifications")}
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 pt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                        {t("portal.notifications.auto_refresh")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllAsRead()}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-700 rounded-xl transition cursor-pointer"
                        >
                          {t("portal.notifications.mark_all_read")}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filters selector row */}
                  <div className="flex items-center gap-2 text-xs border-b border-slate-100 pb-3">
                    <button
                      type="button"
                      onClick={() => setNotificationsFilter("all")}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        notificationsFilter === "all"
                          ? "bg-slate-100 text-slate-800"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {language === "om" ? "Hunda" : language === "am" ? "ሁሉንም" : "All Alerts"} ({notifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotificationsFilter("unread")}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        notificationsFilter === "unread"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "text-slate-500 hover:text-red-750"
                      }`}
                    >
                      {language === "om" ? "Hin Dubbifamne" : language === "am" ? "ያልተነበቡ" : "Unread"}
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Cards Feed */}
                  {(() => {
                    const filtered = notifications.filter(n => notificationsFilter === "all" || !n.read);

                    if (filtered.length === 0) {
                      return (
                        <div className="py-20 text-center space-y-4">
                          <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <Bell className="w-8 h-8 opacity-45" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">
                            {t("portal.notifications.empty")}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {filtered.map((notif) => {
                          const titleStr = getTranslatedString(notif.title);
                          const contentStr = getTranslatedString(notif.content);
                          
                          // Style based on priority/type
                          const isHigh = notif.priority === "high";
                          const isAlert = notif.type === "alert";
                          const isClinical = notif.type === "clinical";

                          return (
                            <div
                              key={notif.id}
                              className={`p-5 rounded-2xl border text-left transition relative flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                                !notif.read
                                  ? isHigh
                                    ? "bg-red-50/40 border-red-200 shadow-xs"
                                    : "bg-amber-50/20 border-amber-205 shadow-xs"
                                  : "bg-white border-slate-200 opacity-85"
                              }`}
                            >
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  {/* Type Badge */}
                                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    isAlert
                                      ? "bg-red-50 text-red-800 border-red-200"
                                      : isClinical
                                      ? "bg-blue-50 text-blue-800 border-blue-200"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                  }`}>
                                    {notif.type === "alert"
                                      ? t("portal.notifications.alert")
                                      : notif.type === "clinical"
                                      ? t("portal.notifications.clinical")
                                      : t("portal.notifications.announcement")}
                                  </span>

                                  {/* High Priority Flag */}
                                  {isHigh && (
                                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                      {t("portal.notifications.high_priority")}
                                    </span>
                                  )}

                                  {/* Unread Indicator dot */}
                                  {!notif.read && (
                                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full" title="Unread Alert" />
                                  )}

                                  {/* Timestamp */}
                                  <span className="text-[10px] text-slate-400 font-medium ml-auto md:ml-0 md:pl-2">
                                    {new Date(notif.publishedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h3 className={`text-sm md:text-base font-extrabold tracking-tight ${notif.read ? "text-slate-700" : "text-slate-900"}`}>
                                    {titleStr}
                                  </h3>
                                  <p className="text-xs text-slate-650 font-medium leading-relaxed font-sans whitespace-pre-line">
                                    {contentStr}
                                  </p>
                                </div>
                              </div>

                              {/* Actions on the card */}
                              <div className="flex items-center gap-2 self-end md:self-start">
                                {!notif.read && (
                                  <button
                                    type="button"
                                    onClick={() => markAsRead(notif.id)}
                                    className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-705 rounded-lg transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                    {language === "om" ? "Siri" : language === "am" ? "አንብቤዋለሁ" : "Mark Read"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Simulator Box to help test the notifications pipeline easily */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4 text-left shadow-xs mt-10">
                    <div className="space-y-1">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 font-sans">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Clinical Demonstration Control Board
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight">
                        Trigger mock alerts on the Express server database to witness rapid, real-time client sync and locale transitions:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                      <button
                        type="button"
                        disabled={triggerLoading}
                        onClick={() => handleTriggerDemo("alert")}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-left border border-rose-700 transition cursor-pointer disabled:opacity-50"
                      >
                        <div className="text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1 opacity-90">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          Health Alert
                        </div>
                        <div className="text-[11px] font-bold truncate">Trigger Epidemic Advisory</div>
                      </button>

                      <button
                        type="button"
                        disabled={triggerLoading}
                        onClick={() => handleTriggerDemo("announcement")}
                        className="px-3 py-2 bg-amber-550 hover:bg-amber-600 text-white rounded-xl text-left border border-amber-600 transition cursor-pointer disabled:opacity-50"
                      >
                        <div className="text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1 opacity-90">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          Hospital News
                        </div>
                        <div className="text-[11px] font-bold truncate">Trigger Specialized Clinic</div>
                      </button>

                      <button
                        type="button"
                        disabled={triggerLoading}
                        onClick={() => handleTriggerDemo("clinical")}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-left border border-blue-700 transition cursor-pointer disabled:opacity-50"
                      >
                        <div className="text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1 opacity-90">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          Clinical Update
                        </div>
                        <div className="text-[11px] font-bold truncate">Trigger Lab Pathology Results</div>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: SECURE MEDICAL HISTORY & LAB RESULTS */}
              {activeTab === "history" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-patient-history">
                  
                  {/* Top Header Row with dynamic refresh and HIPAA logo */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                        {t("portal.history.title")}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium pt-0.5">
                        {language === "om" 
                          ? "Gabaasa fayyaa fi yaala keessan duraanii asitti ilaaluu dandeessu." 
                          : language === "am" 
                          ? "የቀድሞ የሕክምና ውጤቶችዎን እና የህክምና ማጠቃለያዎን ደህንነቱ በተጠበቀ ሁኔታ እዚህ ይመልከቱ።" 
                          : "Review your past clinical treatment summaries, prescriptions, and lab test reports securely."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {language === "om" ? "Eegumsa Qaba" : language === "am" ? "የተጠበቀ" : "Verified HIPAA Secure"}
                      </span>
                    </div>
                  </div>

                  {/* Cards Feed */}
                  {medicalHistory.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Heart className="w-8 h-8 opacity-45 text-rose-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-705">
                        {t("portal.history.empty")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {medicalHistory.map((record) => {
                        const diagnosisStr = getTranslatedString(record.diagnosis);
                        const treatmentStr = getTranslatedString(record.treatmentSummary);
                        
                        return (
                          <div
                            key={record.id}
                            className="bg-white border border-slate-205 rounded-2xl overflow-hidden hover:shadow-subtle transition-all duration-200 text-left"
                          >
                            {/* Card Top Info strip */}
                            <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="flex items-center flex-wrap gap-2 text-xs">
                                <span className="font-extrabold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded uppercase tracking-wider text-[9px] font-mono">
                                  {record.id}
                                </span>
                                <span className="text-slate-500 font-medium font-mono text-[11px] flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-450" />
                                  {new Date(record.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                                </span>
                              </div>
                              <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
                                <span className="text-slate-500 font-medium">
                                  {t("portal.history.department")}:
                                </span>
                                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-10 border-indigo-100">
                                  {getTranslatedString(departments.find(d => d.id === record.departmentId)?.name) || record.departmentId}
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-5">
                              {/* Practitioner and Primary Diagnosis row */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                                    {t("portal.history.doctor")}
                                  </h4>
                                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                    {record.doctorName}
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                                    {t("portal.history.diagnosis")}
                                  </h4>
                                  <p className="text-sm font-extrabold text-slate-900 bg-rose-50/50 text-rose-850 px-2.5 py-1 rounded-xl inline-block border border-rose-100">
                                    {diagnosisStr}
                                  </p>
                                </div>
                              </div>

                              {/* Treatment Summary text block */}
                              <div className="space-y-1 border-t border-slate-100 pt-4">
                                <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                                  {t("portal.history.treatment")}
                                </h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans whitespace-pre-line bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                  {treatmentStr}
                                </p>
                              </div>

                              {/* Medication and lab results details */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 border-t border-slate-100 pt-4">
                                
                                {/* Medications list column */}
                                <div className="space-y-3 text-left">
                                  <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-1.5">
                                    <span>💊</span>
                                    <span>{t("portal.history.medications")}</span>
                                  </h4>

                                  {record.medications && record.medications.length > 0 ? (
                                    <div className="space-y-2.5">
                                      {record.medications.map((med: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-extrabold text-indigo-955 leading-tight">
                                              {getTranslatedString(med.name)}
                                            </span>
                                            <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase border border-indigo-100">
                                              {getTranslatedString(med.dosage)}
                                            </span>
                                          </div>
                                          <div className="text-[11px] text-slate-500 font-medium leading-normal flex items-start gap-1 pb-0.5">
                                            <span className="text-indigo-400 font-sans mt-0.5">&bull;</span>
                                            <span>
                                              <strong>{t("portal.history.instructions")}:</strong> {getTranslatedString(med.instructions)}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs italic text-slate-400 font-medium p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                      {language === "om" ? "Qorichi hin ajajamne" : language === "am" ? "የታዘዘ መድኃኒት የለም" : "No active medications prescribed for this visit."}
                                    </p>
                                  )}
                                </div>

                                {/* Lab reports column */}
                                <div className="space-y-3 text-left">
                                  <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-1.5">
                                    <span>🔬</span>
                                    <span>{t("portal.history.lab_results")}</span>
                                  </h4>

                                  {record.labResults && record.labResults.length > 0 ? (
                                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-150">
                                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                        <div>{t("portal.history.lab_test")}</div>
                                        <div className="text-center">{t("portal.history.lab_value")}</div>
                                        <div className="text-right">{t("portal.history.lab_range")}</div>
                                      </div>

                                      {record.labResults.map((lab: any, idx: number) => {
                                        const isNormal = lab.status === "Normal";
                                        const isHigh = lab.status === "High" || lab.status === "Abnormal";
                                        
                                        return (
                                          <div key={idx} className="grid grid-cols-3 gap-2 p-2.5 items-center text-xs">
                                            <div className="font-bold text-slate-800 leading-tight">
                                              {getTranslatedString(lab.testName)}
                                            </div>
                                            <div className="text-center">
                                              <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                                                isNormal 
                                                  ? "bg-green-50 text-green-700" 
                                                  : isHigh 
                                                  ? "bg-red-50 text-red-700 font-extrabold" 
                                                  : "bg-amber-50 text-amber-700"
                                              }`}>
                                                {lab.value}
                                              </span>
                                            </div>
                                            <div className="text-right text-[10px] font-mono text-slate-400 font-medium">
                                              {lab.referenceRange}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className="text-xs italic text-slate-400 font-medium p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                      {language === "om" ? "Qorannoon lab hin ajajamne" : language === "am" ? "የላብራቶሪ ምርመራ አልተደረገም" : "No lab test investigation ordered for this visit."}
                                    </p>
                                  )}
                                </div>

                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* TAB: SECURE CLINICAL TRENDS VISUALIZATIONS */}
              {activeTab === "trends" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-patient-trends">
                  
                  {/* Top Header Row with Verified HIPAA Secured badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-violet-600 animate-pulse" />
                        {t("portal.trends.title")}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium pt-0.5 animate-pulse">
                        {t("portal.trends.subtitle")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-emerald-750 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 label-confidential">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        HIPAA Secure Analytics
                      </span>
                    </div>
                  </div>

                  {medicalHistory.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 opacity-45 text-slate-350" />
                      </div>
                      <p className="text-xs font-bold text-slate-705">
                        {language === "om" 
                          ? "Gabaasoonni dhibee madaalawaa hin jiran." 
                          : language === "am" 
                          ? "እስካሁን ምንም ዓይነት የምርመራ ውጤት የለም" 
                          : "No historical lab results found to visualize health trends."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Bento Cards for Latest Readings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Blood Pressure Bento */}
                        <div id="trends-card-bp-bento" className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-violet-300 transition-colors duration-200">
                          <div className="space-y-2 text-left">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">
                              {t("portal.trends.blood_pressure")}
                            </span>
                            {latestSystolic && latestDiastolic ? (
                              <div className="space-y-1">
                                <div className="text-3xl font-black text-slate-800 font-mono tracking-tight">
                                  {latestSystolic} / {latestDiastolic}{" "}
                                  <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest font-sans">
                                    mmHg
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  {language === "om" ? "Koreen dhiyoo" : language === "am" ? "የመጨረሻ ምርመራ" : "Last measured"}: <strong className="text-slate-600">{new Date(latestRecord.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</strong>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No measurement recorded</p>
                            )}
                          </div>

                          {latestSystolic && latestDiastolic && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              latestBPStatus === "Normal"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-705 border-red-200 animate-pulse"
                            }`}>
                              {latestBPStatus}
                            </span>
                          )}
                        </div>

                        {/* Fasting Glucose Bento */}
                        <div id="trends-card-glucose-bento" className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-amber-300 transition-colors duration-200">
                          <div className="space-y-2 text-left">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">
                              {t("portal.trends.glucose")}
                            </span>
                            {latestGlucose ? (
                              <div className="space-y-1">
                                <div className="text-3xl font-black text-slate-800 font-mono tracking-tight">
                                  {latestGlucose}{" "}
                                  <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest font-sans">
                                    mg/dL
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  {language === "om" ? "Koreen dhiyoo" : language === "am" ? "የመጨረሻ ምርመራ" : "Last measured"}: <strong className="text-slate-600">{new Date(latestRecord.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</strong>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No measurement recorded</p>
                            )}
                          </div>

                          {latestGlucose && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              latestGlucoseStatus === "Normal"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-705 border-red-200 animate-pulse"
                            }`}>
                              {latestGlucoseStatus}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Charts Grid Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                        {/* 1. BP Chart */}
                        <div id="trends-card-bp-chart" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-subtle transition-shadow duration-200">
                          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                            <h3 className="text-xs md:text-sm font-extrabold text-slate-700 uppercase tracking-wider font-sans">
                              {language === "om" ? "Adeemsa Dhiibbaa Dhiigaa" : language === "am" ? "የደም ግፊት ክትትል" : "Systolic / Diastolic Trend"}
                            </h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider font-sans">
                              <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                {t("portal.trends.systolic")}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                {t("portal.trends.diastolic")}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-80 pt-2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={parsedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                                <XAxis 
                                  dataKey="formattedDate" 
                                  stroke="#94A3B8" 
                                  fontSize={10} 
                                  fontWeight={600}
                                  tickLine={false} 
                                  axisLine={false} 
                                  dy={10}
                                />
                                <YAxis 
                                  stroke="#94A3B8" 
                                  fontSize={10} 
                                  fontWeight={600}
                                  tickLine={false} 
                                  axisLine={false} 
                                  domain={[60, 180]} 
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={120} stroke="#EF4444" strokeDasharray="5 5" strokeWidth={1} label={{ value: "Systolic Limit (120)", position: "insideBottomLeft", fill: "#EF4444", fontSize: 9, fontWeight: 700 }} />
                                <ReferenceLine y={80} stroke="#3B82F6" strokeDasharray="5 5" strokeWidth={1} label={{ value: "Diastolic Limit (80)", position: "insideBottomLeft", fill: "#3B82F6", fontSize: 9, fontWeight: 700 }} />
                                <Line 
                                  name={t("portal.trends.systolic")}
                                  type="monotone" 
                                  dataKey="systolic" 
                                  stroke="#ef4444" 
                                  strokeWidth={3} 
                                  dot={{ r: 5, stroke: "#ef4444", strokeWidth: 2, fill: "#ffffff" }} 
                                  activeDot={{ r: 7 }}
                                  unit=" mmHg"
                                />
                                <Line 
                                  name={t("portal.trends.diastolic")}
                                  type="monotone" 
                                  dataKey="diastolic" 
                                  stroke="#3b82f6" 
                                  strokeWidth={3} 
                                  dot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }} 
                                  activeDot={{ r: 7 }}
                                  unit=" mmHg"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* 2. Fasting Blood Glucose Chart */}
                        <div id="trends-card-glucose-chart" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-subtle transition-shadow duration-200">
                          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                            <h3 className="text-xs md:text-sm font-extrabold text-slate-700 uppercase tracking-wider font-sans">
                              {language === "om" ? "Adeemsa Sukkaara Saliina" : language === "am" ? "የደም ስኳር ክትትል" : "Fasting Blood Glucose Trend"}
                            </h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider font-sans">
                              <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                {t("portal.trends.fasting_glucose")}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-80 pt-2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={parsedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                                <XAxis 
                                  dataKey="formattedDate" 
                                  stroke="#94A3B8" 
                                  fontSize={10} 
                                  fontWeight={600}
                                  tickLine={false} 
                                  axisLine={false} 
                                  dy={10}
                                />
                                <YAxis 
                                  stroke="#94A3B8" 
                                  fontSize={10} 
                                  fontWeight={600}
                                  tickLine={false} 
                                  axisLine={false} 
                                  domain={[60, 160]} 
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={100} stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={1} label={{ value: "Normal Limit (100)", position: "insideBottomLeft", fill: "#F59E0B", fontSize: 9, fontWeight: 700 }} />
                                <Line 
                                  name={t("portal.trends.fasting_glucose")}
                                  type="monotone" 
                                  dataKey="fastingGlucose" 
                                  stroke="#f59e0b" 
                                  strokeWidth={3} 
                                  dot={{ r: 5, stroke: "#f59e0b", strokeWidth: 2, fill: "#ffffff" }} 
                                  activeDot={{ r: 7 }}
                                  unit=" mg/dL"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB: SECURE BILLING & PAYMENTS */}
              {activeTab === "billing" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6 text-left animate-fade-in" id="view-patient-billing">
                  
                  {/* Top Header Row with Secure Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-500 animate-pulse" />
                        {t("portal.billing.title")}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium pt-0.5">
                        {language === "om" 
                          ? "Invooyisiiwwan kaffaltii fi seenaa kaffaltii keessan nageenya qabuun asitti to'adhaa." 
                          : language === "am" 
                          ? "የክፍያ መጠየቂያ ደረሰኞችዎን እና የክፍያ ታሪክዎን ደህንነቱ በተጠበቀ ሁኔታ እዚህ ያስተዳድሩ።" 
                          : "Manage your outstanding clinical invoices and view your secure online payment receipts."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-emerald-750 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        {language === "om" ? "Eegumsa Qaba SSL" : language === "am" ? "ደህንነቱ የተጠበቀ" : "Verified SSL Gateway"}
                      </span>
                    </div>
                  </div>

                  {/* Operational Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Unpaid Balance */}
                    <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-2xl text-left space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 font-mono block">
                        {language === "om" ? "Idaa Guutuu" : language === "am" ? "የሚጠበቅ ክፍያ" : "Outstanding Balance"}
                      </span>
                      <div className="text-2xl font-black text-amber-800 font-mono">
                        ETB {invoices.filter(i => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                      </div>
                      <p className="text-[10px] text-amber-600 font-medium font-sans">
                        {invoices.filter(i => i.status === "unpaid").length} {language === "om" ? "Invooyisota Kaffalamne" : language === "am" ? "ያልተከፈሉ ደረሰኞች" : "pending invoices total"}
                      </p>
                    </div>

                    {/* Settled/Paid Balance */}
                    <div className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-2xl text-left space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 font-mono block">
                        {language === "om" ? "Kafaltii Raawwatame" : language === "am" ? "የተከፈለው አጠቃላይ" : "Settled Payments"}
                      </span>
                      <div className="text-2xl font-black text-emerald-800 font-mono">
                        ETB {invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-medium font-sans">
                        {invoices.filter(i => i.status === "paid").length} {language === "om" ? "nagaheewwan mirkaneeffaman" : language === "am" ? "ደረሰኞች" : "settled receipts"}
                      </p>
                    </div>

                    {/* Total invoices */}
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono block">
                        {language === "om" ? "Invooyisii Waliigalaa" : language === "am" ? "ጠቅላላ ደረሰኞች" : "Issued Invoices"}
                      </span>
                      <div className="text-2xl font-black text-slate-800 font-mono">
                        {invoices.length}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium font-sans">
                        {language === "om" ? "Waliigala herrega koo" : language === "am" ? "አጠቃላይ" : "invoices in register"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Dialog Overlay if checkout is active */}
                  {activeInvoice && (
                    <div className="bg-slate-50 border border-emerald-105 rounded-2xl p-5 space-y-4 text-left shadow-xs relative" id="portal-checkout">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveInvoice(null);
                          setPaymentError(null);
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-605 p-1.5 bg-white rounded-full border border-slate-200 cursor-pointer text-xs"
                      >
                        &times;
                      </button>

                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-100 tracking-wider uppercase font-mono inline-block">
                          {t("portal.billing.gateway_secure")}
                        </span>
                        <h3 className="text-base font-black text-slate-800">
                          {language === "om" ? "Kafaltii Raawwadhu" : language === "am" ? "የሂሳብ ክፍያ ፈጽም" : "Settle Treatment Invoice Secured"}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {language === "om" ? "Lakk herregaa" : language === "am" ? "ደረሰኝ ቁጥር" : "Invoicing Reference ID"}: 
                          <strong className="font-mono text-slate-700 ml-1 bg-slate-200/50 px-1.5 py-0.5 rounded text-[10px]">{activeInvoice.id}</strong>
                          <span className="ml-1 text-slate-400 font-sans">| {getTranslatedString(activeInvoice.description)}</span>
                        </p>
                      </div>

                      <div className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Total Amount Surcharged:</span>
                        <span className="text-lg font-black text-emerald-700 font-mono">ETB {activeInvoice.amount.toFixed(2)}</span>
                      </div>

                      {paymentError && (
                        <div className="p-3 bg-red-50 border border-red-105 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      {paymentSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-105 text-emerald-705 text-xs rounded-xl font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 animate-bounce" />
                          <span>{paymentSuccess}</span>
                        </div>
                      )}

                      {!paymentSuccess && (
                        <form onSubmit={handlePayInvoiceSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block font-sans">
                              {t("portal.billing.payment_method")}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {["CBE Birr", "Telebirr", "Credit/Debit Card"].map((method) => (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => setPaymentMethod(method)}
                                  className={`p-3 rounded-xl text-center border font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                                    paymentMethod === method
                                      ? "border-blue-600 bg-blue-50 text-blue-700 font-extrabold"
                                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {method === "Credit/Debit Card" ? "💳" : method === "Telebirr" ? "📲" : "🏛️"}
                                  <span className="text-[10px] font-sans font-extrabold">{method}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {paymentMethod === "Credit/Debit Card" ? (
                            <div className="space-y-3 bg-white p-4 border border-slate-150 rounded-2xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">
                                    Cardholder Name
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                    placeholder="Mahammed Mureta"
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">
                                    Debit/Credit Card Number
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="4000 1234 5678 9012"
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-medium"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">
                                    Expiry Month/Year
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="09/28"
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-medium text-center"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">
                                    CVV Code
                                  </label>
                                  <input
                                    type="password"
                                    required
                                    maxLength={4}
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    placeholder="***"
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-medium text-center"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-blue-50/50 p-3.5 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1 flex items-start gap-2.5">
                              <span className="text-base mt-0.5">📟</span>
                              <div className="space-y-1 font-sans text-left">
                                <p className="font-extrabold text-blue-950">Mobile Banking API Hook Active</p>
                                <p className="text-slate-600 font-medium font-sans leading-normal">
                                  {paymentMethod === "Telebirr"
                                    ? "Confirm receipt invitation request on your mobile device inside the Telebirr App, or dial *127# immediately. System matches payment instantly."
                                    : "Authorize this clinical treatment ledger transaction on your CBE Birr terminal, or dial *847# to complete the payment instantly."}
                                </p>
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={paymentLoading}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 hover:shadow-subtle active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                          >
                            {paymentLoading ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                                {language === "om" ? "Kafaltiin raawwatamaa jira..." : "Authorizing secure ledger clearance..."}
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-emerald-100" />
                                {t("portal.billing.pay_now")}
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* List of Issued Invoices */}
                  {invoices.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <CreditCard className="w-8 h-8 opacity-45 text-slate-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {t("portal.billing.empty")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {invoices.map((inv) => {
                        const descriptionStr = getTranslatedString(inv.description);
                        const isPaid = inv.status === "paid";
                        
                        return (
                          <div
                            key={inv.id}
                            className={`bg-white border rounded-2xl overflow-hidden hover:shadow-subtle transition-all duration-200 text-left ${
                              isPaid ? "border-slate-200" : "border-amber-200 shadow-sm"
                            }`}
                          >
                            {/* Card Top Strip */}
                            <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="flex items-center flex-wrap gap-2 text-xs">
                                <span className="font-extrabold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded uppercase tracking-wider text-[9px] font-mono justify-self-start">
                                  {inv.id}
                                </span>
                                <span className="text-slate-500 font-medium font-mono text-[11px] flex items-center gap-1.5 label-invoice-date">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {t("portal.billing.date")}: {new Date(inv.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                                </span>
                              </div>
                              <div>
                                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${
                                  isPaid 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                                }`}>
                                  {isPaid ? t("portal.billing.paid") : t("portal.billing.unpaid")}
                                </span>
                              </div>
                            </div>

                            {/* Card Details Body */}
                            <div className="p-5 space-y-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider font-sans block">
                                  Clinical Treatment Summary
                                </span>
                                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                                  {descriptionStr}
                                </h3>
                              </div>

                              {/* Interactive details box */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                                <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100 font-sans">
                                  Clinical Service Charges Description
                                </div>
                                {inv.items && inv.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-xs text-slate-650 font-sans">
                                    <span className="font-medium text-slate-600">{getTranslatedString(item.name)}</span>
                                    <span className="font-mono font-bold text-slate-800">ETB {item.cost.toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="border-t border-slate-100 pt-2 flex justify-between items-center font-bold text-xs text-slate-800 font-sans">
                                  <span>Total Bill Amount Due:</span>
                                  <span className="font-mono text-sm font-black text-rose-700">ETB {inv.amount.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Footer row action buttons */}
                              <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100/60">
                                {isPaid ? (
                                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 font-sans">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>
                                      Settled on {new Date(inv.paidAt).toLocaleDateString(undefined, { dateStyle: "long" })} via <strong>{inv.paymentMethod}</strong>
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1.5 font-sans col-span-3">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Due Date: {new Date(inv.dueDate).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
                                  </div>
                                )}

                                {!isPaid && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveInvoice(inv);
                                      setPaymentSuccess(null);
                                      setPaymentError(null);
                                      window.scrollTo({ top: 300, behavior: "smooth" });
                                    }}
                                    className="px-4.5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-750 hover:shadow-subtle active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto font-sans"
                                  >
                                    <span>💸</span>
                                    {t("portal.billing.pay_now")}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: SECURE APPOINTMENT BOOKING FORM */}
              {activeTab === "book" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-portal-booking">
                  
                  <div className="border-b border-slate-100 pb-4 text-left">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      {t("portal.appointments.book_new")}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium font-sans">
                      {language === "om" 
                        ? "Odeeffannoon koo gufatee sirritti ofii guuta. Kutaa fi ogeessa filadhu." 
                        : "Your patient administrative credentials are securely auto-filled. Select medical specialty to submit ticket."}
                    </p>
                  </div>

                  {bookingSuccess ? (
                    <div id="booking-success-box" className="p-8 text-center bg-green-50 border border-green-200 rounded-2xl space-y-4 max-w-lg mx-auto">
                      <div className="p-3 bg-green-100 text-green-700 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-green-900">
                          {t("book.success").trim()}
                        </h3>
                        <div className="inline-block bg-white border border-green-250 rounded-xl px-4 py-2 font-mono text-sm font-bold text-green-800">
                          {bookingSuccess}
                        </div>
                        <p className="text-xs text-green-700 font-medium leading-relaxed">
                          {t("book.success.sub")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setBookingSuccess(null); setActiveTab("appointments"); }}
                        className="mt-2 text-xs text-blue-700 font-bold border border-blue-200 bg-white hover:bg-blue-50 px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        {language === "om" ? "Qabannoowwan Koo" : "Go to Registry"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePortalBooking} className="space-y-4 text-left">
                      {bookingError && (
                        <div className="p-3 bg-rose-50 border border-rose-250 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{bookingError}</span>
                        </div>
                      )}

                      {/* Read-Only Prepopulated Patient Headers for absolute user security */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-150 p-4 rounded-xl">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">{t("book.form.name")}</div>
                          <div className="text-xs font-bold text-slate-700">{patient.name}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">{t("book.form.phone")}</div>
                          <div className="text-xs font-bold text-slate-700">{patient.phone}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">{t("portal.mrun")}</div>
                          <div className="text-xs font-bold text-slate-700 font-mono text-blue-700">{patient.mrun}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Clinical Department selection */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block" htmlFor="portal-book-dept">
                            {t("book.form.dept")} <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="portal-book-dept"
                              required
                              value={bookingForm.departmentId}
                              onChange={(e) => setBookingForm({ ...bookingForm, departmentId: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white appearance-none transition-all"
                            >
                              <option value="">-- Choose Department --</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {getTranslatedString(dept.name)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Clinical Medical Doctor selection */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block" htmlFor="portal-book-doc">
                            {t("book.form.doctor")} <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="portal-book-doc"
                              required
                              value={bookingForm.doctorId}
                              onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white appearance-none transition-all"
                            >
                              <option value="">-- Choose Doctor --</option>
                              {doctorsFiltered.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                  {doc.name} ({getTranslatedString(doc.specialization)})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Date selection */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block" htmlFor="portal-book-date">
                          {t("book.form.date")} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          id="portal-book-date"
                          required
                          value={bookingForm.dateTime}
                          onChange={(e) => setBookingForm({ ...bookingForm, dateTime: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Briefly description reason */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block" htmlFor="portal-book-reason">
                          {t("book.form.reason")}
                        </label>
                        <textarea
                          id="portal-book-reason"
                          rows={3}
                          value={bookingForm.reason}
                          onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                          placeholder="Please describe symptoms, e.g. routine maternity checkup..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        id="portal-book-submit"
                        disabled={bookingLoading}
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 pr-4 pl-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-100 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {bookingLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          t("book.form.submit")
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 5: PROFILE EDIT PANEL */}
              {activeTab === "profile" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6" id="view-portal-profile-update">
                  <div className="border-b border-slate-100 pb-4 text-left">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      {language === "om" ? "Mirkaneessa Odeeffannoo" : language === "am" ? "የግል መረጃ ማሻሻያ" : "Update Profile Records"}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium font-sans">
                      {language === "om" 
                        ? "Odeeffannoo keessan asuma irratti jijjiiranii haalatti sirreessu dandeessu." 
                        : "Synchronize your latest contact coordinates, registered identification values, and age flags."}
                    </p>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4 text-left max-w-xl">
                    {profileMessage && (
                      <div id="profile-response-alert" className={`p-3 text-xs font-semibold rounded-xl flex items-start gap-2.5 border ${
                        profileMessage.startsWith("Error") 
                          ? "bg-rose-50 border-rose-200 text-rose-700" 
                          : "bg-emerald-50 border-emerald-250 text-emerald-800"
                      }`}>
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{profileMessage}</span>
                      </div>
                    )}

                    {/* Gender and Full Name fields */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block" htmlFor="prof-name">
                        {t("portal.name")}
                      </label>
                      <input
                        type="text"
                        id="prof-name"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mobile Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block" htmlFor="prof-phone">
                          {t("portal.phone")}
                        </label>
                        <input
                          type="tel"
                          id="prof-phone"
                          required
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* DOB */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block" htmlFor="prof-dob">
                          {t("portal.dob")}
                        </label>
                        <input
                          type="date"
                          id="prof-dob"
                          required
                          value={profileForm.dob}
                          onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Gender selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block" htmlFor="prof-gender">
                        {t("portal.gender")}
                      </label>
                      <div className="relative">
                        <select
                          id="prof-gender"
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white appearance-none transition-all"
                        >
                          <option value="Male">{t("portal.gender.male")}</option>
                          <option value="Female">{t("portal.gender.female")}</option>
                          <option value="Other">{t("portal.gender.other")}</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Immutable profile properties for complete records consistency */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl select-none">
                      <div>
                        <div className="text-[10px] text-slate-450 font-bold uppercase">{t("portal.email")}</div>
                        <div className="text-xs font-medium text-slate-500">{patient.email}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-455 font-bold uppercase">{t("portal.mrun")}</div>
                        <div className="text-xs font-mono font-medium text-slate-500 text-blue-600">{patient.mrun}</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="profile-save-btn"
                      disabled={profileLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 pr-4 pl-4 rounded-xl text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {profileLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        language === "om" ? "Faayila Yooqi" : language === "am" ? "ለውጦችን መዝግብ" : "Save Changes"
                      )}
                    </button>
                  </form>
                </div>
              )}

            </>
          )}

        </div>
      </div>

    </div>
  );
}
