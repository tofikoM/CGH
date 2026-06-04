/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Language } from "../types";
import { translations } from "../translations";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface ContactSectionProps {
  language: Language;
}

export default function ContactSection({ language }: ContactSectionProps) {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setFormError(language === "om" ? "Maaloo odeeffannoo guutuu guuti." : language === "am" ? "እባክዎን ስም፣ ስልክ እና መልእክት በትክክል ያስገቡ።" : "Name, Phone, and Message are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setFormError(data.error || "Inquiry dispatch failed on our network.");
      }
    } catch (err) {
      setFormError("Connection anomaly detected. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-section" className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Introductions */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-black font-display text-slate-950 tracking-tight">
          {t("contact.title")}
        </h2>
        <p className="text-sm text-slate-500 font-sans leading-relaxed">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. Physical Details, Maps, and Guidelines (Left Side - Column Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-display">
              {t("contact.info")}
            </h3>

            <div className="space-y-4 text-xs font-sans">
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Hospital Location</span>
                  <span className="font-semibold text-slate-700 leading-snug block">
                    Chiro General Road, West Hararghe Zone, Oromia Region, Ethiopia. (Opposite Oromia Water Works site).
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg flex-shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Emergency Lines</span>
                  <span className="font-extrabold text-red-700 font-mono text-xs block">+251 25 551 0134</span>
                  <span className="font-semibold text-slate-500 text-[10px]">Active for ambulance coordinates and ICU admissions.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg flex-shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Digital Mailing</span>
                  <span className="font-semibold text-slate-700 font-mono">info@chirogeneralhospital.gov.et</span>
                </div>
              </div>

            </div>
          </div>

          {/* Location Interactive Mapping Simulator Container */}
          <div className="bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden h-72 relative flex items-center justify-center">
            
            {/* Embedded high quality mapping coordinate illustration or Leaflet custom simulation */}
            <div className="absolute inset-0 bg-blue-50/50 print:hidden">
              {/* Using a highly robust open street map widget for premium experience */}
              <iframe
                title="Chiro General Hospital Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15730.07639534575!2d40.86016738520336!3d9.083321946853765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1634fe7d781b23c9%3A0x6b09be88aee8c5bc!2sChiro%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1717524900000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90"
              />
            </div>

            {/* Custom Location Overlay badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200/50 p-3 rounded-xl shadow-md space-y-1 max-w-[240px] pointer-events-none">
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Chiro General Hospital</span>
              <p className="text-[10px] text-slate-500 leading-tight">Secured parking and medical compound entrance opposite Central Highway gate.</p>
            </div>

          </div>

        </div>

        {/* 3. Inquiry Sender (Right Side - Column Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black font-display text-slate-950">
              {t("contact.form.title")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Enter your inquiries or community feedback. An administrative officer reviews submissions daily during normal office hours.
            </p>
          </div>

          {success ? (
            <div className="p-6 border border-emerald-100 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-4 animate-scaleIn">
              <div className="w-12 h-12 bg-white text-emerald-500 rounded-full flex items-center justify-center shadow-sm mx-auto">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm">{t("contact.form.success")}</h4>
                <p className="text-xs text-slate-500">We appreciate your communication support feedback.</p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs font-sans">
              
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-name" className="text-slate-700 font-bold block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    placeholder="e.g. Abebe Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 font-semibold focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-phone" className="text-slate-700 font-bold block">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    placeholder="e.g. 0912121212"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 font-semibold focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-email" className="text-slate-700 font-bold block">
                    Email Address (Optional)
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    placeholder="e.g. abebe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 font-semibold focus:outline-none"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-subject" className="text-slate-700 font-bold block">
                    {t("contact.form.subject")}
                  </label>
                  <input
                    id="inquiry-subject"
                    type="text"
                    placeholder="e.g. Health vaccination query"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 font-semibold focus:outline-none"
                  />
                </div>

              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="inquiry-message" className="text-slate-700 font-bold block">
                  {t("contact.form.message")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  rows={4}
                  placeholder="Summarize your description here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 font-semibold focus:outline-none resize-none"
                />
              </div>

              {/* Dispatch Trigger */}
              <button
                id="contact-form-submit-trigger"
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow shadow-blue-100 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{t("contact.form.send")}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
