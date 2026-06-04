/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from "./types";

export interface TranslationDictionary {
  [key: string]: {
    om: string;
    am: string;
    en: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation
  "nav.brand": {
    om: "Hospitaala Ciroo Waliigalaa",
    am: "የጭሮ አጠቃላይ ሆስፒታል",
    en: "Chiro General Hospital"
  },
  "nav.home": {
    om: "Dhaabbata",
    am: "ዋና ገጽ",
    en: "Home"
  },
  "nav.departments": {
    om: "Kutaleen & Tajaajila",
    am: "ክፍሎች እና አገልግሎቶች",
    en: "Departments"
  },
  "nav.doctors": {
    om: "Ogeeyyiin Fayyaa",
    am: "ሐኪሞች",
    en: "Doctors"
  },
  "nav.book": {
    om: "Qabannoo Qorannoo",
    am: "ቀጠሮ መያዣ",
    en: "Book Appointment"
  },
  "nav.contact": {
    om: "Quunnamtii",
    am: "እውቂያ",
    en: "Contact"
  },
  "nav.admin": {
    om: "Kutaa Bulchiinsaa",
    am: "የአስተዳደር ፓነል",
    en: "Admin Dashboard"
  },

  // Emergency Section
  "emergency.title": {
    om: "Atattama Ogeessa Fayyaa",
    am: "የአስቸኳይ ጊዜ አገልግሎት",
    en: "Emergency Support"
  },
  "emergency.phone": {
    om: "Lakk. Bilbila Atattamaa (Kutaa Ciroo)",
    am: "የአስቸኳይ ጊዜ ስልክ ቁጥር",
    en: "Emergency Hotline"
  },
  "emergency.desc": {
    om: "Gargaarsa nagaa fi atattamaa sa'aatii 24 argachuuf bilbila kana fayyadamaa. Ambulance Hospitalichaa qophiidha.",
    am: "ለ 24 ሰዓት ድንገተኛ ህክምና እርዳታ እና ለአምቡላንስ አገልግሎት በቀጥታ ይደውሉ።",
    en: "For 24/7 critical care or rapid ambulance response in West Hararghe region, dial our dispatch center immediately."
  },
  "emergency.location": {
    om: "Iddoo: Ciroo, Harargee Dhihaa, Oromiyaa, Itoophiyaa",
    am: "አድራሻ፡ ጭሮ፣ ምዕራብ ሐረርጌ፣ ኦሮሚያ፣ ኢትዮጵያ",
    en: "Address: Chiro, West Hararghe, Oromia, Ethiopia"
  },

  // Home Page
  "home.hero.title": {
    om: "Fayyaa Keessaniif Tajaajila Qulqullina Qabu fi Amansiisaa",
    am: "ለጤናዎ ጥራት ያለው እና እምነት የሚጣልበት የህክምና አገልግሎት",
    en: "Trusted Healthcare Services Excellence for Our Community"
  },
  "home.hero.subtitle": {
    om: "Hospitaalli Waliigalaa Ciroo teessoo Harargee Dhihaa keessatti tekinoolojii ammayyaa fi ogeeyyii beekamoodhaan ummata keenya tajaajilaa jira.",
    am: "የጭሮ አጠቃላይ ሆስፒታል በምዕራብ ሐረርጌ ዞን ዘመናዊ መሣሪያዎችን እና ልምድ ያላቸውን ሐኪሞች በመጠቀም ማህበረሰቡን በታማኝነት ያገለግላል።",
    en: "Chiro General Hospital has been serving West Hararghe with specialized clinical services, modern diagnostics, and compassionate healthcare professionals."
  },
  "home.hero.cta.book": {
    om: "Qabannoo Ergi",
    am: "ቀጠሮ ይያዙ",
    en: "Book Now"
  },
  "home.hero.cta.more": {
    om: "Tajaajila Keenya",
    am: "አገልግሎታችን",
    en: "Our Services"
  },
  "home.stats.patients": {
    om: "Dhukkubsatoo Waggaa",
    am: "ዓመታዊ ታካሚዎች",
    en: "Annual Patients Managed"
  },
  "home.stats.doctors": {
    om: "Ogeeyyii Fayyaa Specialists",
    am: "ስፔሻሊስት ሐኪሞች",
    en: "Specialist Staff"
  },
  "home.stats.beds": {
    om: "Sireewwan Qophii",
    am: "የመኝታ ክፍሎች",
    en: "Inpatient Beds"
  },
  "home.stats.experience": {
    om: "Tajaajila Waggoota",
    am: "የአገልግሎት ዘመናት",
    en: "Years of Service"
  },
  "home.values.title": {
    om: "Gaddoomina keenya fi Kaayyoowwan Keenya",
    am: "የሆስፒታሉ እሴቶች",
    en: "Core Clinical Values"
  },
  "home.values.patience": {
    om: "Dhukkubsataa Dursuu",
    am: "ታካሚን ማስቀደም",
    en: "Patient-Centered Care"
  },
  "home.values.patience.desc": {
    om: "Tajaajila hunda dursinee nageenya fi bilchina dhukkubsatoota keenyaaf xiyyeeffannoo kennina.",
    am: "የታካሚዎቻችንን ምቾት፣ ጤና እና ሰብአዊ ክብር ከሁሉም በላይ እናስቀድማለን።",
    en: "We align treatment plans strictly around safety, personal comfort, and high clinical outcomes for all patients."
  },
  "home.values.tech": {
    om: "Teknoolojii Ammayyaa",
    am: "ዘመናዊ ቴክኖሎጂ",
    en: "Advanced Diagnostics"
  },
  "home.values.tech.desc": {
    om: "Qorannoowwan Laboraatoorii fi Raadiyooloojii guutuu ta'an meeshaalee ammayyaatiin gaggeessina.",
    am: "ትክክለኛ ምርመራዎችን ለመስጠት የላቁ የላቦራቶሪ እና የራጅ (Radiology) መሳሪያዎችን እንጠቀማለን።",
    en: "Equipped with state-of-the-art laboratory, CT scan, and precision ultrasound to provide immediate diagnosis."
  },

  // Departments Section
  "dept.title": {
    om: "Kutalee Qorannoo fi Tajaajila Keenya",
    am: "የህክምና ክፍሎች እና የምርመራ አገልግሎቶች",
    en: "Clinical Departments & Diagnostic Services"
  },
  "dept.subtitle": {
    om: "Hospitaalli keenya tajaajiloota raawwii garaa garaa qaban kutalee adda addaatti qoodee dhiyeessa.",
    am: "ሆስፒታላችን ለተለያዩ የህክምና ዘርፎች ልዩ የሆኑ ዘመናዊ ክፍሎችን እና ላቦራቶሪዎችን አደራጅቷል።",
    en: "Explore Chiro General Hospital's multidisciplinary specialties dedicated to primary, trauma, and inpatient healthcare."
  },
  "dept.services.included": {
    om: "Tajaajiloota Kennaman:",
    am: "የሚሰጡ አገልግሎቶች፡",
    en: "Included Services:"
  },

  // Doctors Section
  "doc.title": {
    om: "Ogeeyyii Fayyaa Beekamoo",
    am: "የስፔሻሊስት ሐኪሞቻችን ማውጫ",
    en: "Our Medical Specialists Directory"
  },
  "doc.subtitle": {
    om: "Miseensonni ogeessota keenyaa muuxannoo fi bilchina olaanaadhaan isiniif qophiidha.",
    am: "በታማኝነት እና በላቀ እውቀት ሊያገለግሉዎት የተዘጋጁ የመምሪያ ስፔሻሊስቶች ዝርዝር።",
    en: "Consult our highly qualified resident and visiting physicians specializing in advanced community healthcare."
  },
  "doc.search.placeholder": {
    om: "Maqaa ykn ogummaan barbaadi...",
    am: "በስም ወይም በህክምና ዘርፍ ፈልግ...",
    en: "Search doctor by name or specialization..."
  },
  "doc.filter.all": {
    om: "Hunda",
    am: "ሁሉም",
    en: "All Specialties"
  },
  "doc.experience": {
    om: "Muuxannoo:",
    am: "የስራ ልምድ፡",
    en: "Experience:"
  },
  "doc.years": {
    om: "Waggoota",
    am: "ዓመታት",
    en: "years"
  },
  "doc.availability": {
    om: "Sa'aatii Hojii:",
    am: "የስራ ሰዓት፡",
    en: "Availability:"
  },
  "doc.book.btn": {
    om: "Qabannoo Qabi",
    am: "ቀጠሮ ያዝ",
    en: "Book Slot"
  },

  // Appointment Form
  "book.title": {
    om: "Qabannoo Wal'aansaa Guuti",
    am: "የህክምና ቀጠሮ መያዣ ቅፅ",
    en: "Schedule Clinical Appointment"
  },
  "book.subtitle": {
    om: "Maaloo odeeffannoo sirrii ta'e guutuudhaan sa'aatii fi ogeessa marihachuu barbaaddan bahaa.",
    am: "እባክዎን ትክክለኛውን መረጃ በመሙላት ቀጠሮዎን ያስይዙ። ሰራተኞቻችን በስልክ ያረጋግጣሉ።",
    en: "Secure your consultation slot in seconds. Fill in the digital slip below, and our registration desk will prioritize your arrival."
  },
  "book.form.name": {
    om: "Maqaa Guutuu",
    am: "ሙሉ ስም",
    en: "Patient's Full Name"
  },
  "book.form.phone": {
    om: "Lakk. Bilbilaa",
    am: "የስልክ ቁጥር",
    en: "Phone Number"
  },
  "book.form.email": {
    om: "Imeelii (Yoo jiraate)",
    am: "ኢሜይል (ካለ)",
    en: "Email Address (Optional)"
  },
  "book.form.dept": {
    om: "Kutaa Wal'aansaa",
    am: "የህክምና ክፍል መምረጫ",
    en: "Select Clinical Department"
  },
  "book.form.doctor": {
    om: "Marii Ogeessichaa",
    am: "ሀኪም መምረጫ",
    en: "Select Medical Doctor"
  },
  "book.form.date": {
    om: "Guyyaa Marii",
    am: "የቀጠሮ ቀን",
    en: "Preferred Date & Time"
  },
  "book.form.reason": {
    om: "Sabaaba Qabannoo (Dhibee)",
    am: "የበሽታው ምልክት ወይም ቅሬታ",
    en: "Brief Symptoms or Reason of Visit"
  },
  "book.form.submit": {
    om: "Milkeessi Qabannoo",
    am: "ቀጠሮውን መዝግብ",
    en: "Confirm & Schedule Appointment"
  },
  "book.success": {
    om: "Milkaa'ina! Qabannoon keessan galmeeffameera. Lakk. Tikkeetii keessan: ",
    am: "ቀጠሮዎ በተሳካ ሁኔታ ተመዝግቧል! የቀጠሮ መለያ ቁጥር፡  ",
    en: "Appointment request filed successfully! Your Booking Reference ID is: "
  },
  "book.success.sub": {
    om: "Ogeessi keenya bilbila keessaniin quunnamtii isiniif godha. Galatoomaa!",
    am: "ክሊኒካል ረዳታችን በቅርቡ በስልክ ቁጥርዎ ደውሎ ቀጠሮውን ያረጋግጣል። እናመሰግናለን!",
    en: "A registration clinical helper will call your phone number shortly to finalize your arrival desk check-in. Thank you!"
  },

  // Contact Page
  "contact.title": {
    om: "Quunnamtii fi Teessoo Keenya",
    am: "እውቂያ እና የሆስፒታሉ አድራሻ",
    en: "Get in Touch & Hospital Directory"
  },
  "contact.subtitle": {
    om: "Gafiilee, yaada ykn kutaalee keenya quunnamuuf odeeffannoowwan bilbilaa fi faksii gadii fayyadamaa.",
    am: "ለጥያቄዎች፣ አስተያየቶች ወይም ተጨማሪ መረጃዎችን ለማግኘት ከታች ያለውን የመገናኛ ዘዴ ይጠቀሙ።",
    en: "Connect with our prompt administrative team in West Hararghe for inquiries, feedbacks, or corporate partnerships."
  },
  "contact.info": {
    om: "Odeeffannoo Teessoo",
    am: "የአድራሻ መረጃ",
    en: "Location Details"
  },
  "contact.hours": {
    om: "Sa'aatii Hojii Dhaabbataa",
    am: "መደበኛ የስራ ሰዓት",
    en: "Standard Working Hours"
  },
  "contact.hours.emergency": {
    om: "Kutaa Atattamaa: Sa'aatii 24 / Guyyoota 7",
    am: "ድንገተኛ ክፍል፡ 24 ሰዓት / 7 ቀናት ንቁ",
    en: "Emergency & Trauma: 24/7 Fully Functional"
  },
  "contact.hours.general": {
    om: "Tajaajila Idilee: Wiixata - Jimaata (2:00 AM - 11:30 PM)",
    am: "መደበኛ ክሊኒኮች፡ ከሰኞ እስከ አርብ (ከጠዋቱ 2:00 እስከ ማታ 11:30)",
    en: "Outpatient Services: Mon - Fri, 8:00 AM - 5:30 PM"
  },
  "contact.form.title": {
    om: "Ergaa Nuuf Ergi",
    am: "መልእክት ይላኩልን",
    en: "Send Clinical Inquiry Slip"
  },
  "contact.form.subject": {
    om: "Dhimma Ergaa",
    am: "ርዕሰ ጉዳይ",
    en: "Subject"
  },
  "contact.form.message": {
    om: "Ergaa Keessan",
    am: "መልእክትዎ",
    en: "Your Message"
  },
  "contact.form.send": {
    om: "Ergaa Ergi",
    am: "መልእክቱን ላክ",
    en: "Submit Inquiry"
  },
  "contact.form.success": {
    om: "Yaadni keessan fudhatameera. Galatoomaa!",
    am: "መልእክትዎ ደርሶናል። እናመሰግናለን!",
    en: "Your inquiry has been logged successfully. The clinical affairs officer will review your email shortly!"
  },

  // Admin Dashboard
  "admin.login.title": {
    om: "Seensa Ogeessota Hospitaalaa",
    am: "የአስተዳዳሪ መግቢያ",
    en: "Administrator Access Portal"
  },
  "admin.login.desc": {
    om: "Kuni kutaa dhuunfaa bulchitootaati. Jecha darbii 'chiro123' galchi.",
    am: "ይህ የተጠበቀ ገጽ ነው። እባክዎን የይለፍ ቃል 'chiro123' ያስገቡ።",
    en: "Authorized clinical staff area. Enter hospital access credential (default: 'chiro123') below to resume."
  },
  "admin.login.pass": {
    om: "Jecha Darbii (Passcode)",
    am: "የይለፍ ቃል",
    en: "Hospital Admin Password"
  },
  "admin.login.btn": {
    om: "Seeni",
    am: "ግባ",
    en: "Authenticate Access"
  },
  "admin.login.error": {
    om: "Jecha darbii dogoggora!",
    am: "ያልተፈቀደ የይለፍ ቃል!",
    en: "Authentication Error. Please enter the correct passcode."
  },
  "admin.welcome": {
    om: "Baga Nagaan Dhuftan, Bulchaa Hospitaalaa!",
    am: "እንኳን ደህና መጡ፣ የሆስፒታሉ አስተዳዳሪ!",
    en: "Administrative Dashboard — Chiro General Medical Board"
  },
  "admin.tab.appointments": {
    om: "Galmeewwan Qabannoo",
    am: "የቀጠሮዎች ሁኔታ",
    en: "Manage Appointments"
  },
  "admin.tab.doctors": {
    om: "Haala Ogeessotaa",
    am: "የዶክተሮች ማውጫ መቆጣጠሪያ",
    en: "Manage Speciality Directory"
  },
  "admin.tab.banners": {
    om: "Miidiyaalee & Banners",
    am: "የሚዲያ ፋይሎች እና ባነር",
    en: "Media Center & Banners"
  },
  "admin.appoint.patient": {
    om: "Dhukkubsataa",
    am: "ታካሚ",
    en: "Patient"
  },
  "admin.appoint.phone": {
    om: "Bilbila",
    am: "ስልክ",
    en: "Phone"
  },
  "admin.appoint.dept": {
    om: "Kutaa",
    am: "ክፍል",
    en: "Department"
  },
  "admin.appoint.doctor": {
    om: "Doktora",
    am: "ዶክተር",
    en: "Consultant"
  },
  "admin.appoint.dateTime": {
    om: "Guyya/Sa'a",
    am: "ቀነ-ቀጠሮ",
    en: "Date & Time"
  },
  "admin.appoint.status": {
    om: "Haala",
    am: "ሁኔታ",
    en: "Status"
  },
  "admin.appoint.actions": {
    om: "Gochaalee",
    am: "እርምጃዎች",
    en: "Actions"
  },
  "admin.doctor.add": {
    om: "Ogeessa Haaraa Galmeessi",
    am: "አዲስ ሀኪም መዝግብ",
    en: "Add New Specialty Practitioner"
  },
  "admin.doctor.name": {
    om: "Maqaa Doktoraa",
    am: "የሀኪሙ ስም",
    en: "Practitioner Name"
  },
  "admin.doctor.spec.om": {
    om: "Ogummaa (Afaan Oromoo)",
    am: "ልዩ ሙያ (በአፋን ኦሮሞ)",
    en: "Specialty (Afaan Oromoo)"
  },
  "admin.doctor.spec.am": {
    om: "Ogummaa (Amharic)",
    am: "ልዩ ሙያ (በአማርኛ)",
    en: "Specialty (Amharic)"
  },
  "admin.doctor.spec.en": {
    om: "Ogummaa (English)",
    am: "ልዩ ሙያ (በእንግሊዝኛ)",
    en: "Specialty (English)"
  },
  "admin.doctor.exp": {
    om: "Muuxannoo Hojii (Waggoota)",
    am: "የስራ ልምድ (በአመታት)",
    en: "Clinical Experience (Years)"
  },
  "admin.doctor.photo": {
    om: "Suura (Upload Custom Image)",
    am: "የሀኪሙ ፎቶ መጫኛ",
    en: "Practitioner Photo (Upload Image)"
  },
  "admin.doctor.photo.upload": {
    om: "Suura Haaraa Kaasi / Suura Filadhu",
    am: "ፎቶ ይጫኑ (Drag & Drop or Search)",
    en: "Drag & drop image or click to select photo"
  },
  "admin.doctor.submit": {
    om: "Doktora Galmeessi",
    am: "አስቀምጥ",
    en: "Register Recipient"
  },
  "admin.signout": {
    om: "Ba'i",
    am: "ውጣ",
    en: "Log Out Portal"
  },

  // Patient Portal translations
  "nav.portal": {
    om: "Kutaa Dhukkubsataa",
    am: "የታካሚ መግቢያ",
    en: "Patient Portal"
  },
  "portal.title": {
    om: "Seensa Portaalii Dhukkubsataa",
    am: "የታካሚ መግቢያ በር (Portal)",
    en: "Patient Self-Service Portal"
  },
  "portal.subtitle": {
    om: "Odeeffannoo yaalaa, kootaa beeksisaa, fi qabannoowwan keessan asitti salphumatti hordofaa.",
    am: "የቀጠሮዎችዎን ዝርዝር፣ ያለፉ ህክምናዎችዎን እና የታካሚ መለያ ወረቀትዎን በቀላሉ እዚህ ያግኙ።",
    en: "Securely review your active bookings, past appointment schedules, official clinic card MRN, and access non-sensitive hospital bulletins."
  },
  "portal.login": {
    om: "Seendi Akkaawuntii",
    am: "መግቢያ (Login)",
    en: "Sign In"
  },
  "portal.register": {
    om: "Galmee Haaraa",
    am: "አዲስ ምዝገባ (Register)",
    en: "Create Account"
  },
  "portal.email": {
    om: "Imeelii",
    am: "ኢሜይል አድራሻ",
    en: "Email Address"
  },
  "portal.password": {
    om: "Jecha Darbii (Password)",
    am: "የይለፍ ቃል (Password)",
    en: "Account Password"
  },
  "portal.name": {
    om: "Maqaa Guutuu",
    am: "ሙሉ ስም (የታካሚው)",
    en: "Patient Full Name"
  },
  "portal.phone": {
    om: "Lakk. Bilbilaa",
    am: "የስልክ ቁጥር",
    en: "Mobile Phone Number"
  },
  "portal.dob": {
    om: "Guyyaa Dhalootaa",
    am: "የትውልድ ቀን (DOB)",
    en: "Date of Birth"
  },
  "portal.gender": {
    om: "Saala",
    am: "ጾታ",
    en: "Gender"
  },
  "portal.gender.male": {
    om: "Dhiira",
    am: "ወንድ",
    en: "Male"
  },
  "portal.gender.female": {
    om: "Dubartii",
    am: "ሴት",
    en: "Female"
  },
  "portal.gender.other": {
    om: "Kan biraa",
    am: "ሌላ",
    en: "Other"
  },
  "portal.mrun": {
    om: "Lakk. Galmee Yaalaa (MRN)",
    am: "የህክምና መለያ ቁጥር (MRN)",
    en: "Medical Record Card ID"
  },
  "portal.btn.login": {
    om: "Seensa Portaalii",
    am: "አረጋግጠህ ግባ",
    en: "Authenticate & Log In"
  },
  "portal.btn.register": {
    om: "Galmaahi fi Seeni",
    am: "መዝግብና አካውንት ፍጠር",
    en: "Register & Issue MRN"
  },
  "portal.error.login": {
    om: "Imeelii ykn jecha darbii dogoggora! Maaloo irra deebi'ii yaali.",
    am: "ኢሜይል ወይም የይለፍ ቃል አልተዛመደም። እባክዎ እንደገና ይሞክሩ።",
    en: "Incorrect email credentials or invalid password. Please review your details."
  },
  "portal.error.register": {
    om: "Imeeliin kuni kanaan dura galmeeffameera. Maaloo biroo fayyadamaa.",
    am: "ይህ ኢሜይል አስቀድሞ ጥቅም ላይ ውሏል። እባክዎ ሌላ ኢሜይል ያስገቡ።",
    en: "This email address is already linked to an existing patient profile."
  },
  "portal.welcome": {
    om: "Baga Nagaan Deebitee Dhufta,",
    am: "እንኳን ደህና መለሱ፣",
    en: "Welcome back to Chiro Portal,"
  },
  "portal.tab.dashboard": {
    om: "Daashboordii Koo",
    am: "የታካሚው ዳሽቦርድ",
    en: "My Health Board"
  },
  "portal.tab.appointments": {
    om: "Qabannoowwan Koo",
    am: "የቀጠሮዎች ሁኔታ",
    en: "Appointment Registry"
  },
  "portal.tab.announcements": {
    om: "Beeksisa Fayyaa",
    am: "የሆስፒታል አጠቃላይ ማስታወቂያዎች",
    en: "Hospital Board Bulletins"
  },
  "portal.card.title": {
    om: "Kardii Dhukkubsataa CGH",
    am: "የጭሮ አጠቃላይ ሆስፒታል የታካሚ ካርድ",
    en: "Chiro General Digital Clinic Card"
  },
  "portal.announcements.empty": {
    om: "Hamma yoonaatti beeksisi haaraan hin jiru.",
    am: "እስካሁን ምንም አይነት አዲስ ማስታወቂያ የለም።",
    en: "No new public clinical announcements published yet."
  },
  "portal.appointments.empty": {
    om: "Qabannoon galmeeffame tokkollee hin jiru.",
    am: "እስካሁን ምንም አይነት ቀጠሮ አልተያዘልዎትም።",
    en: "No active or historic appointment lists loaded on this card."
  },
  "portal.appointments.book_new": {
    om: "Marii Haaraa Qabadhu",
    am: "አዲስ ቀጠሮ ያዙ",
    en: "Book New Consultation"
  },
  "portal.recent_news": {
    om: "Beeksisa fi Oduu Saffisaa",
    am: "አዳዲስ የሆስፒታሉ ማስታወቂያዎች",
    en: "Recent Public Bulletins"
  },

  // Social Share
  "social.title": {
    om: "Itti Quunnamuuf Nu Hordofaa",
    am: "በማህበራዊ ሚዲያ ይከተሉን",
    en: "Community Broadcast & Feeds"
  },
  "social.desc": {
    om: "Odeeffannoo fayyaa fi gorsa adda addaa dhiyeenyaan argachuuf miidiyaalee keenya hordofaa.",
    am: "ለታማሚዎች ጠቃሚ ምክር እና የጤና ዜናዎችን ለማጋራት በማህበራዊ ሚዲያችን ይገናኙን።",
    en: "Stay informed with continuous local updates, free health campaign clinics, and wellness advices in West Hararghe."
  },
  "social.share": {
    om: "Odeeffannoo kana qoodi (Share):",
    am: "ስለ ጤና መረጃዎችን ያጋሩ፡",
    en: "Share General Health Portal:"
  },
  "social.copied": {
    om: "Linkiin qophaa'eera!",
    am: "ሊንኩ ተገልብጧል!",
    en: "Hospital portal link copied to clipboard!"
  },

  // Notifications & Realtime Alerts
  "portal.tab.notifications": {
    om: "Dhegayaa & Of-eeggannoo",
    am: "ክሊኒካዊ መልእክቶች እና ማሳሰቢያዎች",
    en: "Health Alerts & Notifications"
  },
  "portal.notifications.empty": {
    om: "Ergaan ykn dhegayaan haaraan hin jiru.",
    am: "በአሁኑ ሰዓት ምንም አዲስ ማሳሰቢያ የለም።",
    en: "No new health alerts or announcements at this time."
  },
  "portal.notifications.unread": {
    om: "Dubbifamebira",
    am: "ያልተነበበ",
    en: "Unread"
  },
  "portal.notifications.mark_all_read": {
    om: "Hunda Dubbifame Garas",
    am: "ሁሉንም የተነበቡ አድርግ",
    en: "Mark All Read"
  },
  "portal.notifications.trigger_test": {
    om: "Dhegayaa Yaalii Kassasuu",
    am: "የሙከራ ማስጠንቀቂያ ይፍጠሩ",
    en: "Trigger Demo Alert"
  },
  "portal.notifications.alert": {
    om: "Dhegayaa Ariifachiisaa",
    am: "አስቸኳይ ማስጠንቀቂያ",
    en: "Health Alert"
  },
  "portal.notifications.announcement": {
    om: "Beeksisa Hospitaalaa",
    am: "የሆስፒታል ማስታወቂያ",
    en: "Hospital Update"
  },
  "portal.notifications.clinical": {
    om: "Ergaa Yaalaa Dhuunfaa",
    am: "የግል ህክምና መረጃ",
    en: "Personal Health Update"
  },
  "portal.notifications.high_priority": {
    om: "Dhiphina Ol'aana",
    am: "ከፍተኛ ቅድሚያ",
    en: "High Priority"
  },
  "portal.notifications.auto_refresh": {
    om: "Haaromsi Saffisaa Gireen",
    am: "ማሻሻያ ንቁ ነው",
    en: "Auto-refresh active (10s)"
  },
  "portal.notifications.fetching": {
    om: "Dhegayaa fidaa jira...",
    am: "መልእክቶችን በመጫን ላይ...",
    en: "Refreshing alert streams..."
  },

  // Medical History tab
  "portal.tab.medical_history": {
    om: "Seenaa Yaalaa",
    am: "የሕክምና ታሪክ ማህደር",
    en: "Medical History"
  },
  "portal.history.empty": {
    om: "Seenaan yaalaa duraanii hin argamne.",
    am: "ምንም ያለፈ የሕክምና ማህደር አልተገኘም።",
    en: "No past medical history records found."
  },
  "portal.history.title": {
    om: "Seenaa Yaalaa fi Gabaasa Laboratoorii",
    am: "የቀደሙ የሕክምና ጥቅሎች እና የላብራቶሪ ውጤቶች",
    en: "Secure Medical History & Lab Reports"
  },
  "portal.history.date": {
    om: "Guyyaa Yaalaa",
    am: "የታየበት ቀን",
    en: "Consultation Date"
  },
  "portal.history.doctor": {
    om: "Ogeessa Yaalaa",
    am: "የሕክምና ባለሙያ",
    en: "Attending Practitioner"
  },
  "portal.history.department": {
    om: "Kutaa Yaalaa",
    am: "የሕክምና ክፍል",
    en: "Clinical Department"
  },
  "portal.history.diagnosis": {
    om: "Dhibee Adda Bahe",
    am: "ምርመራ / በሽታ",
    en: "Diagnosed Condition"
  },
  "portal.history.treatment": {
    om: "Ibsa Wal'aansaa",
    am: "የሕክምና ማጠቃለያ",
    en: "Treatment Summary"
  },
  "portal.history.medications": {
    om: "Qoricha Kennaman",
    am: "የታዘዙ መድኃኒቶች",
    en: "Prescribed Medications"
  },
  "portal.history.lab_results": {
    om: "Bu'aa Laboratoorii",
    am: "የላብራቶሪ ምርመራ ውጤቶች",
    en: "Diagnostic Lab Results"
  },
  "portal.history.lab_test": {
    om: "Qorannoo",
    am: "የምርመራ ዓይነት",
    en: "Test Name"
  },
  "portal.history.lab_value": {
    om: "Bu'aa Lab",
    am: "የምርመራ ውጤት",
    en: "Observed Value"
  },
  "portal.history.lab_range": {
    om: "Safartuu Giddugaleessaa",
    am: "መደበኛ ክልል",
    en: "Reference Range"
  },
  "portal.history.lab_status": {
    om: "Haala Bu'aa",
    am: "ሁኔታ",
    en: "Status"
  },
  "portal.history.dosage": {
    om: "Akaakuu fi Safara",
    am: "የመድኃኒት መጠን",
    en: "Dosage & Intake"
  },
  "portal.history.instructions": {
    om: "Ajaja Fudhannaa",
    am: "አጠቃቀም መመሪያ",
    en: "Intake Directions"
  },

  // Billing and Payments tab
  "portal.tab.billing": {
    om: "Kafaltii & Herrega",
    am: "ክፍያ እና ደረሰኞች",
    en: "Billing & Payments"
  },
  "portal.billing.title": {
    om: "Kafaltii fi Herrega Nageenya Qabu",
    am: "ደህንነቱ የተጠበቀ ክፍያ እና የክፍያ መጠየቂያዎች",
    en: "Billing Invoices & Secure Payments"
  },
  "portal.billing.empty": {
    om: "Kofaltiidhaan walqabatee herregni hin argamne.",
    am: "ምንም የክፍያ መጠየቂያ ደረሰኝ አልተገኘም።",
    en: "No medical billing invoices found."
  },
  "portal.billing.invoice_id": {
    om: "Lakk Herregaa",
    am: "የደረሰኝ መለያ ቁጥር",
    en: "Invoice Reference"
  },
  "portal.billing.date": {
    om: "Guyyaa Bahe",
    am: "የወጣበት ቀን",
    en: "Billing Date"
  },
  "portal.billing.amount": {
    om: "Gatii Guutuu",
    am: "አጠቃላይ ክፍያ",
    en: "Total Amount"
  },
  "portal.billing.status": {
    om: "Haala Kafaltii",
    am: "የክፍያ ሁኔታ",
    en: "Payment Status"
  },
  "portal.billing.paid": {
    om: "Kafalameera",
    am: "ተከፍሏል",
    en: "Paid"
  },
  "portal.billing.unpaid": {
    om: "Kafalamne",
    am: "ያልተከፈለ",
    en: "Outstanding"
  },
  "portal.billing.pay_now": {
    om: "Amma Kafali",
    am: "አሁን ክፈል",
    en: "Pay Invoice Securely"
  },
  "portal.billing.success": {
    om: "Kafaltiin milkiidhaan raawwatameera! Nagaheen keessan qophaa'eera.",
    am: "ክፍያዎ በተሳካ ሁኔታ ተፈጽሟል! ደረሰኝዎ ተዘጋጅቷል።",
    en: "Payment completed successfully! Official receipt generated."
  },
  "portal.billing.gateway_secure": {
    om: "Haala Karaa Kafaltii",
    am: "የክፍያ መተላለፊያ ሁኔታ",
    en: "Secure Payment Gateway"
  },
  "portal.billing.payment_method": {
    om: "Mala Kafaltii",
    am: "የክፍያ ዘዴ",
    en: "Payment Method"
  },

  // Health Trends translations
  "portal.tab.trends": {
    om: "Haala Fayyaa",
    am: "የጤና ሁኔታ ሂደቶች",
    en: "Health Trends"
  },
  "portal.trends.title": {
    om: "Trendii Gabaasa Lab & Sakatta'iinsa Fayyaa",
    am: "የምርመራ ውጤቶች የጤና ሂደቶች ግራፍ",
    en: "Historical Lab & Health Trends"
  },
  "portal.trends.subtitle": {
    om: "Gabaasa sakatta'iinsa dhiigaa, sukkaaraa fi ho'a qaamaa keessan yeroo keessatti ilaalaa.",
    am: "የደም ግፊት፣ የስኳር መጠን እና የቀድሞ ምርመራ ውጤቶችዎን ሂደት በምስል ይተንትኑ።",
    en: "Visualize historical changes in blood pressure, glucose, temperature, and other vital lab values over time."
  },
  "portal.trends.blood_pressure": {
    om: "Dhiba Dhiigaa (BP)",
    am: "የደም ግፊት (BP)",
    en: "Blood Pressure (mmHg)"
  },
  "portal.trends.glucose": {
    om: "Sukkaara Dhiigaa",
    am: "የደም ስኳር መጠን (Glucose)",
    en: "Blood Glucose (mg/dL)"
  },
  "portal.trends.systolic": {
    om: "Dhibbaa Sistoliik",
    am: "ሲስቶሊክ",
    en: "Systolic BP"
  },
  "portal.trends.diastolic": {
    om: "Dhibbaa Diyaastoliik",
    am: "ዲያስተሊክ",
    en: "Diastolic BP"
  },
  "portal.trends.fasting_glucose": {
    om: "Sukkaara Dorgommii",
    am: "የስኳር መጠን",
    en: "Fasting Glucose"
  }
};
