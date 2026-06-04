/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "om" | "am" | "en";

export interface TranslatedString {
  om: string;
  am: string;
  en: string;
}

export interface TranslatedArray {
  om: string[];
  am: string[];
  en: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: TranslatedString;
  availability: TranslatedString;
  photoUrl: string;
  bio: TranslatedString;
  experience: number;
}

export interface Department {
  id: string;
  name: TranslatedString;
  description: TranslatedString;
  icon: string; // Refers to Lucide-react icon name
  services: TranslatedArray;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  departmentId: string;
  doctorId: string;
  dateTime: string;
  reason: string;
  status: "Pending" | "Approved" | "Cancelled";
  createdAt: string;
  patientId?: string; // Optional patient identifier for secured lookup
}

export interface Patient {
  id: string;
  email: string;
  name: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  mrun: string; // Medical Record Unique Number (e.g., CGH-MRN-92182)
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: TranslatedString;
  content: TranslatedString;
  category: "General" | "Outbreak" | "Campaign" | "Clinical";
  publishedAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface HospitalBanner {
  id: string;
  title: TranslatedString;
  subtitle: TranslatedString;
  imageUrl: string;
  active: boolean;
}
