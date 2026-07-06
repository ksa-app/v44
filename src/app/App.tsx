import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Stethoscope, FileText, Plane, UserCheck,
  Settings, Bell, Search, ChevronRight, TrendingUp, TrendingDown,
  Plus, Eye, Edit2, Trash2, Globe, Briefcase, Menu, X, LogOut,
  FileBarChart, MapPin, Award, AlertTriangle, CheckCircle, Clock,
  XCircle, Lock, Mail, Building, Shield, RefreshCw, ChevronDown,
  Fingerprint, BookOpen,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "dashboard"|"candidate"|"medical"|"mofa"|"visa"|"takamul"|"passport"|"manpower"|"flight"|"reports"|"user"|"setting"|"agents"|"agencies"|"police"|"fingerprint"|"notifications";

interface Candidate { id:string; sl:number; name:string; passport_no:string; received_date:string|null; agent:string|null; country:string|null; is_deleted:boolean; created_at:string; updated_at:string; }
interface Medical { id:string; candidate_id:string; sl:number; medical_date:string|null; fit_date:string|null; status:string; mofa_update:boolean; created_at:string; updated_at:string; }
interface Mofa { id:string; sl:number; candidate:string; application_number:string|null; agency:string|null; med_update:boolean; trade:string|null; aplication_date:string|null; created_at:string; updated_at:string; }
interface Visa { id:string; candidate_id:string; visa_sl:number; issue_date:string|null; expiry_date:string|null; flight_date:string|null; visa_type:string|null; iqamah_number:string|null; status:string; agency:string|null; manpower:boolean; created_at:string; updated_at:string; }
interface Takamul { id:string; candidate_id:string; mofa_id:string|null; trade:string|null; test_center:string|null; test_date:string|null; result:string|null; result_date:string|null; certificate_no:string|null; issue_date:string|null; expiry_date:string|null; status:string; notes:string|null; created_at:string; updated_at:string; }
interface PassportTracking { id:string; candidate_id:string; location:string; held_by:string|null; phone:string|null; received_date:string|null; expected_return:string|null; returned_date:string|null; notes:string|null; created_at:string; updated_at:string; }
interface Agent { id:string; full_name:string; CODE:string|null; }
interface Agency { uuid:string; name:string|null; rl:number|null; }
interface AgentFull { id:string; full_name:string; CODE:string|null; phone:string|null; email:string|null; address:string|null; status:string; created_at:string; }
interface AgencyFull { uuid:string; name:string|null; rl:number|null; country:string|null; contact_person:string|null; phone:string|null; email:string|null; status:string; created_at:string; }
interface PoliceClearance { id:string; candidate_id:string; reference_no:string|null; issue_date:string|null; expiry_date:string|null; status:string; notes:string|null; created_at:string; updated_at:string; }
interface Fingerprint { id:string; candidate_id:string; enrollment_date:string|null; center:string|null; reference_no:string|null; status:string; notes:string|null; created_at:string; }
interface FlightRecord { id:string; airline:string; flight_no:string; origin:string; destination:string; date:string; seats:number; booked:number; status:string; }
interface ManpowerOrder { id:string; client:string; country:string; position:string; qty:number; filled:number; deadline:string; status:string; }
interface SystemUser { id:string; name:string; email:string; role:string; dept:string; status:string; last_active:string; }

// ─── Seed Data ────────────────────────────────────────────────────────────────
const AGENTS: Agent[] = [
  { id:"ag-1", full_name:"Tariq Mahmoud",  CODE:"TM-001" },
  { id:"ag-2", full_name:"Priya Nair",     CODE:"PN-002" },
  { id:"ag-3", full_name:"Ahmed Saleh",    CODE:"AS-003" },
];

const AGENCIES: Agency[] = [
  { uuid:"ac-1", name:"Gulf Construction LLC",    rl:1201 },
  { uuid:"ac-2", name:"Saudi Aramco Services",    rl:1305 },
  { uuid:"ac-3", name:"Doha Metro Project",       rl:1410 },
  { uuid:"ac-4", name:"Kuwait Oil Company",       rl:1522 },
  { uuid:"ac-5", name:"Muscat Infra Ltd.",        rl:1618 },
];

const INIT_CANDIDATES: Candidate[] = [
  { id:"c-001", sl:1,  name:"Mohammad Al-Rashid",  passport_no:"BD4821901", received_date:"2026-05-10", agent:"ag-1", country:"Bangladesh", is_deleted:false, created_at:"2026-05-10", updated_at:"2026-05-10" },
  { id:"c-002", sl:2,  name:"Raju Kumar Singh",    passport_no:"IN7293041", received_date:"2026-05-18", agent:"ag-2", country:"India",      is_deleted:false, created_at:"2026-05-18", updated_at:"2026-05-18" },
  { id:"c-003", sl:3,  name:"Laxman Tamang",       passport_no:"NP5021938", received_date:"2026-05-22", agent:"ag-1", country:"Nepal",      is_deleted:false, created_at:"2026-05-22", updated_at:"2026-05-22" },
  { id:"c-004", sl:4,  name:"Arjun Thapa Magar",   passport_no:"NP6318204", received_date:"2026-06-01", agent:"ag-3", country:"Nepal",      is_deleted:false, created_at:"2026-06-01", updated_at:"2026-06-01" },
  { id:"c-005", sl:5,  name:"Md. Jahangir Alam",   passport_no:"BD9103827", received_date:"2026-06-05", agent:"ag-1", country:"Bangladesh", is_deleted:false, created_at:"2026-06-05", updated_at:"2026-06-05" },
  { id:"c-006", sl:6,  name:"Suresh Patel",        passport_no:"IN3041928", received_date:"2026-06-10", agent:"ag-2", country:"India",      is_deleted:false, created_at:"2026-06-10", updated_at:"2026-06-10" },
  { id:"c-007", sl:7,  name:"Bikram Rai",          passport_no:"NP7182039", received_date:"2026-06-15", agent:"ag-3", country:"Nepal",      is_deleted:false, created_at:"2026-06-15", updated_at:"2026-06-15" },
  { id:"c-008", sl:8,  name:"Santosh Shrestha",    passport_no:"NP4920183", received_date:"2026-06-20", agent:"ag-1", country:"Nepal",      is_deleted:false, created_at:"2026-06-20", updated_at:"2026-06-20" },
];

const INIT_MEDICALS: Medical[] = [
  { id:"m-001", candidate_id:"c-001", sl:1, medical_date:"2026-05-20", fit_date:"2026-05-21", status:"Fit",     mofa_update:true,  created_at:"2026-05-20", updated_at:"2026-05-20" },
  { id:"m-002", candidate_id:"c-002", sl:2, medical_date:"2026-05-28", fit_date:"2026-05-29", status:"Fit",     mofa_update:false, created_at:"2026-05-28", updated_at:"2026-05-28" },
  { id:"m-003", candidate_id:"c-003", sl:3, medical_date:"2026-06-02", fit_date:"2026-06-03", status:"Fit",     mofa_update:true,  created_at:"2026-06-02", updated_at:"2026-06-02" },
  // fit_date 2026-04-28 → expiry 2026-07-27 → 22 days left → ALERT
  { id:"m-004", candidate_id:"c-004", sl:4, medical_date:"2026-04-27", fit_date:"2026-04-28", status:"Fit",     mofa_update:false, created_at:"2026-04-27", updated_at:"2026-04-27" },
  { id:"m-005", candidate_id:"c-005", sl:5, medical_date:"2026-06-15", fit_date:null,         status:"Pending", mofa_update:false, created_at:"2026-06-15", updated_at:"2026-06-15" },
  { id:"m-006", candidate_id:"c-007", sl:6, medical_date:"2026-06-20", fit_date:"2026-06-22", status:"Unfit",   mofa_update:false, created_at:"2026-06-20", updated_at:"2026-06-20" },
  // fit_date 2026-04-10 → expiry 2026-07-09 → 4 days left → ALERT
  { id:"m-007", candidate_id:"c-008", sl:7, medical_date:"2026-04-09", fit_date:"2026-04-10", status:"Fit",     mofa_update:false, created_at:"2026-04-09", updated_at:"2026-04-09" },
];

const INIT_MOFAS: Mofa[] = [
  { id:"mf-001", sl:1, candidate:"c-001", application_number:"MOFA-2026-0481", agency:"ac-1", med_update:true,  trade:"Mason",        aplication_date:"2026-06-01", created_at:"2026-06-01", updated_at:"2026-06-01" },
  { id:"mf-002", sl:2, candidate:"c-003", application_number:"MOFA-2026-0482", agency:"ac-2", med_update:true,  trade:"Electrician",  aplication_date:"2026-06-05", created_at:"2026-06-05", updated_at:"2026-06-05" },
  { id:"mf-003", sl:3, candidate:"c-004", application_number:"MOFA-2026-0483", agency:"ac-3", med_update:false, trade:"Driver",       aplication_date:"2026-06-10", created_at:"2026-06-10", updated_at:"2026-06-10" },
  { id:"mf-004", sl:4, candidate:"c-006", application_number:"MOFA-2026-0484", agency:"ac-4", med_update:true,  trade:"Welder",       aplication_date:"2026-06-15", created_at:"2026-06-15", updated_at:"2026-06-15" },
  { id:"mf-005", sl:5, candidate:"c-002", application_number:null,             agency:"ac-5", med_update:false, trade:"Plumber",      aplication_date:null,         created_at:"2026-06-20", updated_at:"2026-06-20" },
];

const INIT_VISAS: Visa[] = [
  // expiry 2026-09-10 → 67 days → ALERT
  { id:"v-001", candidate_id:"c-001", visa_sl:1, issue_date:"2026-06-10", expiry_date:"2026-09-10", flight_date:"2026-07-15", visa_type:"Work Visa", iqamah_number:"IQ-29183",  status:"Active",   agency:"ac-1", manpower:true,  created_at:"2026-06-10", updated_at:"2026-06-10" },
  { id:"v-002", candidate_id:"c-003", visa_sl:2, issue_date:"2026-06-18", expiry_date:"2026-12-18", flight_date:"2026-07-20", visa_type:"Work Visa", iqamah_number:"IQ-29184",  status:"Active",   agency:"ac-2", manpower:true,  created_at:"2026-06-18", updated_at:"2026-06-18" },
  { id:"v-003", candidate_id:"c-004", visa_sl:3, issue_date:"2026-06-25", expiry_date:"2026-12-25", flight_date:"2026-07-22", visa_type:"Work Visa", iqamah_number:null,        status:"Stamped",  agency:"ac-3", manpower:false, created_at:"2026-06-25", updated_at:"2026-06-25" },
  { id:"v-004", candidate_id:"c-006", visa_sl:4, issue_date:"2026-07-01", expiry_date:"2026-07-25", flight_date:null,         visa_type:"Work Visa", iqamah_number:null,        status:"Pending",  agency:"ac-4", manpower:true,  created_at:"2026-07-01", updated_at:"2026-07-01" },
  // expiry 2026-06-01 → already expired → ALERT
  { id:"v-005", candidate_id:"c-002", visa_sl:5, issue_date:"2025-12-01", expiry_date:"2026-06-01", flight_date:null,         visa_type:"Work Visa", iqamah_number:null,        status:"Expired",  agency:"ac-5", manpower:false, created_at:"2025-12-01", updated_at:"2026-06-01" },
];

const INIT_TAKAMUL: Takamul[] = [
  { id:"tk-001", candidate_id:"c-001", mofa_id:"mf-001", trade:"Mason",       test_center:"GAMCA Dhaka",     test_date:"2026-06-05", result:"Pass", result_date:"2026-06-06", certificate_no:"TK-2026-0391", issue_date:"2026-06-08", expiry_date:"2028-06-08", status:"Certified", notes:null,              created_at:"2026-06-05", updated_at:"2026-06-05" },
  { id:"tk-002", candidate_id:"c-002", mofa_id:"mf-005", trade:"Plumber",     test_center:"GAMCA Mumbai",    test_date:"2026-06-10", result:"Pass", result_date:"2026-06-11", certificate_no:"TK-2026-0392", issue_date:"2026-06-13", expiry_date:"2028-06-13", status:"Certified", notes:null,              created_at:"2026-06-10", updated_at:"2026-06-10" },
  { id:"tk-003", candidate_id:"c-003", mofa_id:"mf-002", trade:"Electrician", test_center:"GAMCA Kathmandu", test_date:"2026-06-15", result:"Fail", result_date:"2026-06-16", certificate_no:null,          issue_date:null,         expiry_date:null,         status:"Failed",    notes:"Re-test needed.", created_at:"2026-06-15", updated_at:"2026-06-15" },
  { id:"tk-004", candidate_id:"c-004", mofa_id:"mf-003", trade:"Driver",      test_center:"GAMCA Kathmandu", test_date:"2026-06-20", result:null,   result_date:null,         certificate_no:null,          issue_date:null,         expiry_date:null,         status:"Pending",   notes:null,              created_at:"2026-06-20", updated_at:"2026-06-20" },
];

const INIT_PASSPORT: PassportTracking[] = [
  { id:"pt-001", candidate_id:"c-001", location:"Agency Office", held_by:"Tariq Mahmoud", phone:"01711-223344", received_date:"2026-05-10", expected_return:"2026-07-10", returned_date:null,        notes:"Submitted for visa stamping.", created_at:"2026-05-10", updated_at:"2026-05-10" },
  { id:"pt-002", candidate_id:"c-002", location:"Embassy",       held_by:"Ahmed Saleh",   phone:"01812-334455", received_date:"2026-05-18", expected_return:"2026-07-18", returned_date:null,        notes:null,                          created_at:"2026-05-18", updated_at:"2026-05-18" },
  { id:"pt-003", candidate_id:"c-003", location:"With Candidate",held_by:null,            phone:null,           received_date:"2026-06-25", expected_return:null,         returned_date:"2026-06-25",notes:"Returned after stamping.",     created_at:"2026-05-22", updated_at:"2026-06-25" },
  { id:"pt-004", candidate_id:"c-005", location:"MOFA Office",   held_by:"Priya Nair",    phone:"01612-445566", received_date:"2026-06-05", expected_return:"2026-08-05", returned_date:null,        notes:null,                          created_at:"2026-06-05", updated_at:"2026-06-05" },
];

const INIT_AGENTS_FULL: AgentFull[] = [
  { id:"ag-1", full_name:"Tariq Mahmoud", CODE:"TM-001", phone:"01711-223344", email:"tariq@manpower.com", address:"Dhaka, Bangladesh", status:"Active", created_at:"2024-01-01" },
  { id:"ag-2", full_name:"Priya Nair",    CODE:"PN-002", phone:"9822334455",   email:"priya@manpower.com", address:"Mumbai, India",     status:"Active", created_at:"2024-01-05" },
  { id:"ag-3", full_name:"Ahmed Saleh",   CODE:"AS-003", phone:"01812-334455", email:"ahmed@manpower.com", address:"Kathmandu, Nepal",  status:"Active", created_at:"2024-01-10" },
  { id:"ag-4", full_name:"Kamal Hossain", CODE:"KH-004", phone:"01912-445566", email:"kamal@manpower.com", address:"Chittagong, Bangladesh", status:"Inactive", created_at:"2024-02-01" },
];

const INIT_AGENCIES_FULL: AgencyFull[] = [
  { uuid:"ac-1", name:"Gulf Construction LLC",   rl:1201, country:"UAE",    contact_person:"Hassan Al-Marzouqi", phone:"+971-4-2234567", email:"hr@gulfcon.ae",    status:"Active",   created_at:"2023-06-01" },
  { uuid:"ac-2", name:"Saudi Aramco Services",   rl:1305, country:"KSA",    contact_person:"Abdullah Al-Ghamdi", phone:"+966-13-8765432",email:"recruit@aramco.sa", status:"Active",   created_at:"2023-07-01" },
  { uuid:"ac-3", name:"Doha Metro Project",      rl:1410, country:"Qatar",  contact_person:"Mohammed Al-Thani",  phone:"+974-4444-5555", email:"hr@dohametro.qa",  status:"Active",   created_at:"2023-08-15" },
  { uuid:"ac-4", name:"Kuwait Oil Company",      rl:1522, country:"Kuwait", contact_person:"Fahad Al-Sabah",     phone:"+965-2234-5678", email:"hr@koc.com.kw",    status:"Active",   created_at:"2023-09-01" },
  { uuid:"ac-5", name:"Muscat Infra Ltd.",       rl:1618, country:"Oman",   contact_person:"Said Al-Balushi",    phone:"+968-2440-1234", email:"info@muscatinfra.om",status:"Inactive",created_at:"2024-01-20" },
];

const INIT_POLICE: PoliceClearance[] = [
  { id:"pc-001", candidate_id:"c-001", reference_no:"PCC-2026-08812", issue_date:"2026-05-15", expiry_date:"2027-05-15", status:"Cleared",  notes:null,              created_at:"2026-05-15", updated_at:"2026-05-15" },
  { id:"pc-002", candidate_id:"c-002", reference_no:"PCC-2026-08813", issue_date:"2026-05-20", expiry_date:"2027-05-20", status:"Cleared",  notes:null,              created_at:"2026-05-20", updated_at:"2026-05-20" },
  { id:"pc-003", candidate_id:"c-003", reference_no:null,             issue_date:null,         expiry_date:null,         status:"Pending",  notes:"Applied on 2026-06-01", created_at:"2026-06-01", updated_at:"2026-06-01" },
  { id:"pc-004", candidate_id:"c-004", reference_no:"PCC-2026-09001", issue_date:"2026-06-10", expiry_date:"2027-06-10", status:"Cleared",  notes:null,              created_at:"2026-06-10", updated_at:"2026-06-10" },
  { id:"pc-005", candidate_id:"c-005", reference_no:null,             issue_date:null,         expiry_date:null,         status:"Pending",  notes:null,              created_at:"2026-06-15", updated_at:"2026-06-15" },
  { id:"pc-006", candidate_id:"c-007", reference_no:"PCC-2026-09100", issue_date:"2026-06-18", expiry_date:"2027-06-18", status:"Rejected", notes:"Case under review", created_at:"2026-06-18", updated_at:"2026-06-20" },
];

const INIT_FINGERS: Fingerprint[] = [
  { id:"fp-001", candidate_id:"c-001", enrollment_date:"2026-05-12", center:"BMET Dhaka",     reference_no:"FP-BD-29183", status:"Enrolled", notes:null,              created_at:"2026-05-12" },
  { id:"fp-002", candidate_id:"c-002", enrollment_date:"2026-05-20", center:"BMET Mumbai",    reference_no:"FP-IN-29184", status:"Enrolled", notes:null,              created_at:"2026-05-20" },
  { id:"fp-003", candidate_id:"c-003", enrollment_date:"2026-05-25", center:"DOFE Kathmandu", reference_no:"FP-NP-29185", status:"Enrolled", notes:null,              created_at:"2026-05-25" },
  { id:"fp-004", candidate_id:"c-004", enrollment_date:null,         center:null,             reference_no:null,          status:"Pending",  notes:"Appointment pending", created_at:"2026-06-01" },
  { id:"fp-005", candidate_id:"c-005", enrollment_date:null,         center:null,             reference_no:null,          status:"Pending",  notes:null,              created_at:"2026-06-05" },
  { id:"fp-006", candidate_id:"c-006", enrollment_date:"2026-06-12", center:"BMET Chennai",   reference_no:"FP-IN-29186", status:"Enrolled", notes:null,              created_at:"2026-06-12" },
];

const INIT_FLIGHTS: FlightRecord[] = [
  { id:"fl-001", airline:"Emirates",  flight_no:"EK-612", origin:"Kathmandu", destination:"Dubai",       date:"2026-07-08", seats:48, booked:41, status:"Confirmed" },
  { id:"fl-002", airline:"Air Arabia",flight_no:"G9-441", origin:"Dhaka",     destination:"Sharjah",     date:"2026-07-09", seats:60, booked:53, status:"Confirmed" },
  { id:"fl-003", airline:"IndiGo",    flight_no:"6E-198", origin:"Mumbai",    destination:"Riyadh",      date:"2026-07-11", seats:52, booked:34, status:"Open"      },
  { id:"fl-004", airline:"Biman BD",  flight_no:"BG-022", origin:"Dhaka",     destination:"Kuwait City", date:"2026-07-14", seats:44, booked:44, status:"Full"      },
];

const INIT_ORDERS: ManpowerOrder[] = [
  { id:"mp-001", client:"Gulf Construction LLC",  country:"UAE",    position:"Mason",       qty:25, filled:18, deadline:"2026-08-01", status:"Active" },
  { id:"mp-002", client:"Saudi Aramco Services",  country:"KSA",    position:"Electrician", qty:40, filled:40, deadline:"2026-07-20", status:"Full"   },
  { id:"mp-003", client:"Doha Metro Project",     country:"Qatar",  position:"Welder",      qty:30, filled:12, deadline:"2026-09-15", status:"Active" },
  { id:"mp-004", client:"Kuwait Oil Company",     country:"Kuwait", position:"Driver",      qty:15, filled:0,  deadline:"2026-10-01", status:"Open"   },
];

const INIT_USERS: SystemUser[] = [
  { id:"u-001", name:"Tariq Mahmoud",  email:"tariq@manpower.com",  role:"Super Admin",  dept:"Management", status:"Active",   last_active:"2026-07-05" },
  { id:"u-002", name:"Priya Nair",     email:"priya@manpower.com",  role:"HR Manager",   dept:"HR",         status:"Active",   last_active:"2026-07-04" },
  { id:"u-003", name:"Ahmed Saleh",    email:"ahmed@manpower.com",  role:"Visa Officer", dept:"Visa",       status:"Active",   last_active:"2026-07-05" },
  { id:"u-004", name:"Suman Gurung",   email:"suman@manpower.com",  role:"Operations",   dept:"Operations", status:"Inactive", last_active:"2026-06-20" },
];

const CHART_RECRUIT = [
  { month:"Feb", placed:42, applied:120 },
  { month:"Mar", placed:58, applied:145 },
  { month:"Apr", placed:71, applied:160 },
  { month:"May", placed:65, applied:138 },
  { month:"Jun", placed:89, applied:195 },
  { month:"Jul", placed:103,applied:210 },
];

const COUNTRIES = ["Bangladesh","India","Nepal","Pakistan","Sri Lanka","Philippines"];
const TRADES    = ["Mason","Electrician","Plumber","Driver","Welder","Carpenter","Helper","Painter","Technician"];
const LOCATIONS = ["Agency Office","Embassy","MOFA Office","Medical Center","With Candidate","Courier"];

// ─── Utilities ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];

const daysUntil = (d: string | null): number | null => {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
};

const addDays = (d: string, n: number) => {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—";

const candidateName = (candidates: Candidate[], id: string) => candidates.find(c => c.id === id)?.name ?? "Unknown";
const agentName = (id: string | null) => AGENTS.find(a => a.id === id)?.full_name ?? "—";
const agencyName = (id: string | null) => AGENCIES.find(a => a.uuid === id)?.name ?? "—";

// ─── UI Primitives ────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  Fit:"bg-green-100 text-green-700", Unfit:"bg-red-100 text-red-700", Pending:"bg-yellow-100 text-yellow-700",
  Active:"bg-green-100 text-green-700", Expired:"bg-red-100 text-red-700", Stamped:"bg-blue-100 text-blue-700",
  Approved:"bg-green-100 text-green-700", Rejected:"bg-red-100 text-red-700", Processing:"bg-blue-100 text-blue-700",
  Certified:"bg-green-100 text-green-700", Failed:"bg-red-100 text-red-700",
  Confirmed:"bg-green-100 text-green-700", Open:"bg-blue-100 text-blue-700", Full:"bg-purple-100 text-purple-700",
  "Medical Cleared":"bg-green-100 text-green-700", "Visa Pending":"bg-yellow-100 text-yellow-700",
  "Flight Booked":"bg-indigo-100 text-indigo-700", Deployed:"bg-green-100 text-green-700",
  "In Office":"bg-gray-100 text-gray-600", "With Candidate":"bg-teal-100 text-teal-700",
  Returned:"bg-green-100 text-green-700",
};

const SBadge = ({ s }: { s: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${STATUS_COLORS[s] ?? "bg-gray-100 text-gray-600"}`}>{s}</span>
);

const StatCard = ({ label, value, delta, up, icon: Icon, color }: { label:string; value:string; delta:string; up:boolean; icon:React.ElementType; color:string }) => (
  <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
      </div>
      <div className={`p-2.5 rounded-lg ${color}`}><Icon size={18} className="text-white" /></div>
    </div>
    <div className="flex items-center gap-1 text-xs">
      {up ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
      <span className={up ? "text-green-600 font-medium" : "text-red-500 font-medium"}>{delta}</span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </div>
);

// Modal
const Modal = ({ title, onClose, onSave, children, wide }: { title:string; onClose:()=>void; onSave:()=>void; children:React.ReactNode; wide?:boolean }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`bg-card rounded-xl border border-border shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] flex flex-col`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={16} /></button>
      </div>
      <div className="px-6 py-5 space-y-4 overflow-y-auto">{children}</div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-border flex-shrink-0">
        <button onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save</button>
      </div>
    </div>
  </div>
);

const DelModal = ({ name, onClose, onConfirm }: { name:string; onClose:()=>void; onConfirm:()=>void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Trash2 size={18} className="text-red-600" /></div>
        <div><h3 className="font-semibold text-foreground">Delete Record</h3><p className="text-xs text-muted-foreground">Cannot be undone</p></div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Delete <span className="font-semibold text-foreground">{name}</span>?</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

const ViewRow = ({ label, value }: { label:string; value:React.ReactNode }) => (
  <div className="flex gap-3">
    <span className="text-xs text-muted-foreground w-36 flex-shrink-0 mt-0.5">{label}</span>
    <span className="text-sm text-foreground font-medium">{value ?? "—"}</span>
  </div>
);

// Form fields
const FField = ({ label, children }: { label:string; children:React.ReactNode }) => (
  <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>{children}</div>
);
const FInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
);
const FSelect = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...props} className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">{children}</select>
);
const FTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
);
const FCheck = ({ label, checked, onChange }: { label:string; checked:boolean; onChange:(v:boolean)=>void }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded border-border text-primary" />
    <span className="text-sm text-foreground">{label}</span>
  </label>
);

// Table shell
const TablePage = ({ title, subtitle, search, setSearch, filter, setFilter, filterOpts, addBtn, children }: {
  title:string; subtitle:string; search:string; setSearch:(v:string)=>void;
  filter:string; setFilter:(v:string)=>void; filterOpts:string[];
  addBtn?:React.ReactNode; children:React.ReactNode;
}) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-card text-sm text-muted-foreground w-48">
          <Search size={13} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-xs w-full" />
        </div>
        {filterOpts.length > 0 && (
          <FSelect value={filter} onChange={e => setFilter(e.target.value)} style={{ width:130 }}>
            <option value="">All Status</option>
            {filterOpts.map(o => <option key={o}>{o}</option>)}
          </FSelect>
        )}
        {addBtn}
      </div>
    </div>
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wide whitespace-nowrap">{children}</th>
);
const Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <td className={`px-4 py-3 text-sm ${mono ? "font-mono text-xs text-muted-foreground" : "text-foreground"}`}>{children ?? "—"}</td>
);

const RowActs = ({ onView, onEdit, onDelete }: { onView:()=>void; onEdit:()=>void; onDelete:()=>void }) => (
  <td className="px-4 py-3">
    <div className="flex items-center gap-1">
      <button onClick={onView}   className="p-1.5 rounded hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"><Eye size={13} /></button>
      <button onClick={onEdit}   className="p-1.5 rounded hover:bg-yellow-50 text-muted-foreground hover:text-yellow-600 transition-colors"><Edit2 size={13} /></button>
      <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
    </div>
  </td>
);

// Pipeline Alert Card
const PipelineAlert = ({ title, count, items, color, icon: Icon }: { title:string; count:number; items:string[]; color:string; icon:React.ElementType }) => (
  <div className={`rounded-xl border p-4 ${color}`}>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} />
      <span className="text-sm font-semibold">{title}</span>
      <span className="ml-auto text-xs font-mono font-bold">{count}</span>
    </div>
    <div className="space-y-1">
      {items.slice(0,4).map((it, i) => (
        <div key={i} className="text-xs opacity-80 truncate">• {it}</div>
      ))}
      {items.length > 4 && <div className="text-xs opacity-60">+{items.length-4} more</div>}
      {items.length === 0 && <div className="text-xs opacity-60">No alerts</div>}
    </div>
  </div>
);

// ─── Auth Page ────────────────────────────────────────────────────────────────
const AuthPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail]   = useState("admin@manpower.com");
  const [pass,  setPass]    = useState("password");
  const [err,   setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !pass) { setErr("Please fill all fields."); return; }
    setLoading(true); setErr("");
    setTimeout(() => { setLoading(false); onLogin(); }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Briefcase size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ManpowerERP</h1>
          <p className="text-sm text-white/50 mt-1">Recruitment Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-6">Sign in to your account</h2>

          {err && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 mb-4 text-red-400 text-sm">
              <AlertTriangle size={14} />{err}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Email Address</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 focus-within:border-primary/60 focus-within:bg-white/8 transition-colors">
                <Mail size={14} className="text-white/40" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 focus-within:border-primary/60 transition-colors">
                <Lock size={14} className="text-white/40" />
                <input value={pass} onChange={e => setPass(e.target.value)} type="password" className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30" placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-white/50 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5" /> Remember me
              </label>
              <button className="text-primary hover:underline">Forgot password?</button>
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <RefreshCw size={14} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Gulf Manpower Services Ltd. · License MAN-2019-04812
        </p>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardPage = ({ candidates, medicals, visas, mofas }: { candidates:Candidate[]; medicals:Medical[]; visas:Visa[]; mofas:Mofa[] }) => {
  // Pipeline alerts
  const medAlerts = medicals.filter(m => {
    if (!m.fit_date || m.status !== "Fit") return false;
    const expiry = addDays(m.fit_date, 90);
    const days = daysUntil(expiry);
    return days !== null && days < 90;
  }).map(m => {
    const c = candidates.find(x => x.id === m.candidate_id);
    const expiry = addDays(m.fit_date!, 90);
    const days = daysUntil(expiry);
    return `${c?.name ?? "?"} — ${days !== null && days < 0 ? "Expired" : `${days}d left`}`;
  });

  const visaAlerts = visas.filter(v => {
    if (!v.expiry_date) return false;
    const days = daysUntil(v.expiry_date);
    return days !== null && days < 90;
  }).map(v => {
    const c = candidates.find(x => x.id === v.candidate_id);
    const days = daysUntil(v.expiry_date);
    return `${c?.name ?? "?"} — ${days !== null && days < 0 ? "Expired" : `${days}d left`}`;
  });

  const mofaPending = mofas.filter(m => !m.med_update).map(m => {
    const c = candidates.find(x => x.id === m.candidate);
    return `${c?.name ?? "?"} — med update pending`;
  });

  const noVisa = candidates.filter(c => !visas.find(v => v.candidate_id === c.id)).map(c => c.name);

  const pieData = [
    { name:"Fit",     value: medicals.filter(m=>m.status==="Fit").length,     color:"#22c55e" },
    { name:"Unfit",   value: medicals.filter(m=>m.status==="Unfit").length,   color:"#ef4444" },
    { name:"Pending", value: medicals.filter(m=>m.status==="Pending").length, color:"#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value={String(candidates.length)} delta="+12%" up icon={Users}     color="bg-blue-500" />
        <StatCard label="Medicals Done"    value={String(medicals.length)}   delta="+8%"  up icon={Stethoscope} color="bg-green-500" />
        <StatCard label="Visas Active"     value={String(visas.filter(v=>v.status==="Active"||v.status==="Stamped").length)} delta="+5%" up icon={Globe} color="bg-indigo-500" />
        <StatCard label="MOFAs Filed"      value={String(mofas.length)}      delta="+15%" up icon={FileText} color="bg-purple-500" />
      </div>

      {/* Pipeline Alerts */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><AlertTriangle size={15} className="text-amber-500" /> Pipeline Alerts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <PipelineAlert title="Medical Expiring (90d)" count={medAlerts.length}   items={medAlerts}   color="border-amber-200 bg-amber-50 text-amber-800"   icon={Stethoscope} />
          <PipelineAlert title="Visa Expiring (90d)"    count={visaAlerts.length}  items={visaAlerts}  color="border-red-200 bg-red-50 text-red-800"          icon={Globe}       />
          <PipelineAlert title="MOFA Med Pending"       count={mofaPending.length} items={mofaPending} color="border-blue-200 bg-blue-50 text-blue-800"        icon={FileText}    />
          <PipelineAlert title="No Visa Yet"            count={noVisa.length}      items={noVisa}      color="border-purple-200 bg-purple-50 text-purple-800"  icon={Clock}       />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Recruitment Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Applications vs placements</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_RECRUIT}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}} />
              <Area type="monotone" dataKey="applied" stroke="#3b82f6" strokeWidth={2} fill="url(#gA)" name="Applied" />
              <Area type="monotone" dataKey="placed"  stroke="#22c55e" strokeWidth={2} fill="url(#gP)" name="Placed"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Medical Status</h3>
          <p className="text-xs text-muted-foreground mb-3">Current breakdown</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{fontSize:12,borderRadius:8}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{background:d.color}} /><span className="text-muted-foreground">{d.name}</span></div>
                <span className="font-mono font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Candidates Page ──────────────────────────────────────────────────────────
type CandModal = null | "add" | "edit" | "view" | "del";

const CandidatesPage = ({ candidates, setCandidates }: { candidates:Candidate[]; setCandidates:React.Dispatch<React.SetStateAction<Candidate[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<CandModal>(null);
  const [sel,   setSel]     = useState<Candidate | null>(null);
  const blank = (): Candidate => ({ id:uid(), sl:candidates.length+1, name:"", passport_no:"", received_date:null, agent:null, country:null, is_deleted:false, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<Candidate>(blank());

  const rows = useMemo(() => candidates.filter(c => !c.is_deleted && (
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.passport_no.toLowerCase().includes(search.toLowerCase())
  ) && (filter === "" || c.country === filter)), [candidates, search, filter]);

  const openAdd  = () => { setForm(blank()); setModal("add"); };
  const openEdit = (c: Candidate) => { setForm({...c}); setSel(c); setModal("edit"); };
  const openView = (c: Candidate) => { setSel(c); setModal("view"); };
  const openDel  = (c: Candidate) => { setSel(c); setModal("del"); };
  const close    = () => setModal(null);

  const save = () => {
    if (!form.name || !form.passport_no) return;
    if (modal === "add") setCandidates(p => [...p, {...form, updated_at:today()}]);
    else setCandidates(p => p.map(c => c.id === form.id ? {...form, updated_at:today()} : c));
    close();
  };
  const del = () => { setCandidates(p => p.map(c => c.id === sel!.id ? {...c, is_deleted:true} : c)); close(); };

  return (
    <>
      <TablePage title="Candidates" subtitle="All registered worker candidates" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={COUNTRIES}
        addBtn={<button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>SL</Th><Th>Passport No</Th><Th>Name</Th><Th>Country</Th><Th>Agent</Th><Th>Received</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td mono>{c.sl}</Td>
                <Td mono>{c.passport_no}</Td>
                <Td><span className="font-medium">{c.name}</span></Td>
                <Td>{c.country}</Td>
                <Td>{agentName(c.agent)}</Td>
                <Td mono>{fmtDate(c.received_date)}</Td>
                <RowActs onView={() => openView(c)} onEdit={() => openEdit(c)} onDelete={() => openDel(c)} />
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Candidate" : "Edit Candidate"} onClose={close} onSave={save}>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Full Name *"><FInput value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} /></FField>
            <FField label="Passport No *"><FInput value={form.passport_no} onChange={e => setForm(p=>({...p,passport_no:e.target.value}))} /></FField>
            <FField label="Country"><FSelect value={form.country??""} onChange={e=>setForm(p=>({...p,country:e.target.value}))}><option value="">Select…</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</FSelect></FField>
            <FField label="Agent"><FSelect value={form.agent??""} onChange={e=>setForm(p=>({...p,agent:e.target.value}))}><option value="">Select…</option>{AGENTS.map(a=><option key={a.id} value={a.id}>{a.full_name}</option>)}</FSelect></FField>
            <FField label="Received Date"><FInput type="date" value={form.received_date??""} onChange={e=>setForm(p=>({...p,received_date:e.target.value||null}))} /></FField>
            <FField label="Serial No"><FInput type="number" value={form.sl} onChange={e=>setForm(p=>({...p,sl:Number(e.target.value)}))} /></FField>
          </div>
        </Modal>
      )}
      {modal === "view" && sel && (
        <Modal title="Candidate Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Serial No"      value={sel.sl} />
            <ViewRow label="Name"           value={sel.name} />
            <ViewRow label="Passport No"    value={sel.passport_no} />
            <ViewRow label="Country"        value={sel.country} />
            <ViewRow label="Agent"          value={agentName(sel.agent)} />
            <ViewRow label="Received Date"  value={fmtDate(sel.received_date)} />
            <ViewRow label="Created At"     value={fmtDate(sel.created_at)} />
          </div>
        </Modal>
      )}
      {modal === "del" && sel && <DelModal name={sel.name} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Medical Page ─────────────────────────────────────────────────────────────
const MedicalPage = ({ candidates, medicals, setMedicals }: { candidates:Candidate[]; medicals:Medical[]; setMedicals:React.Dispatch<React.SetStateAction<Medical[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel,   setSel]     = useState<Medical | null>(null);
  const blankM = (): Medical => ({ id:uid(), candidate_id:"", sl:medicals.length+1, medical_date:null, fit_date:null, status:"Pending", mofa_update:false, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<Medical>(blankM());

  const rows = useMemo(() => medicals.filter(m => {
    const c = candidates.find(x => x.id === m.candidate_id);
    return (!search || c?.name.toLowerCase().includes(search.toLowerCase())) && (!filter || m.status === filter);
  }), [medicals, candidates, search, filter]);

  const getMedExpiry = (m: Medical) => m.fit_date ? addDays(m.fit_date, 90) : null;
  const getDaysLeft  = (m: Medical) => { const e = getMedExpiry(m); return e ? daysUntil(e) : null; };

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id) return;
    if (modal === "add") setMedicals(p => [...p, {...form, updated_at:today()}]);
    else setMedicals(p => p.map(m => m.id === form.id ? {...form, updated_at:today()} : m));
    close();
  };
  const del = () => { setMedicals(p => p.filter(m => m.id !== sel!.id)); close(); };

  return (
    <>
      <TablePage title="Medical" subtitle="GAMCA medical examination records" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Fit","Unfit","Pending"]}
        addBtn={<button onClick={() => { setForm(blankM()); setModal("add"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>SL</Th><Th>Candidate</Th><Th>Medical Date</Th><Th>Fit Date</Th><Th>Expiry (90d)</Th><Th>Days Left</Th><Th>Status</Th><Th>MOFA Upd.</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(m => {
              const days = getDaysLeft(m);
              const expiry = getMedExpiry(m);
              const urgent = days !== null && days < 30;
              const warn   = days !== null && days >= 30 && days < 90;
              return (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Td mono>{m.sl}</Td>
                  <Td><span className="font-medium">{candidateName(candidates, m.candidate_id)}</span></Td>
                  <Td mono>{fmtDate(m.medical_date)}</Td>
                  <Td mono>{fmtDate(m.fit_date)}</Td>
                  <Td mono>{fmtDate(expiry)}</Td>
                  <td className="px-4 py-3">
                    {days !== null ? (
                      <span className={`text-xs font-mono font-semibold ${urgent?"text-red-600":warn?"text-amber-600":"text-green-600"}`}>
                        {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                      </span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3"><SBadge s={m.status} /></td>
                  <td className="px-4 py-3">{m.mofa_update ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-muted-foreground" />}</td>
                  <RowActs onView={() => { setSel(m); setModal("view"); }} onEdit={() => { setForm({...m}); setSel(m); setModal("edit"); }} onDelete={() => { setSel(m); setModal("del"); }} />
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Medical Record" : "Edit Medical Record"} onClose={close} onSave={save}>
          <FField label="Candidate *">
            <FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}>
              <option value="">Select candidate…</option>
              {candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name} ({c.passport_no})</option>)}
            </FSelect>
          </FField>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Medical Date"><FInput type="date" value={form.medical_date??""} onChange={e=>setForm(p=>({...p,medical_date:e.target.value||null}))} /></FField>
            <FField label="Fit Date"><FInput type="date" value={form.fit_date??""} onChange={e=>setForm(p=>({...p,fit_date:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Fit</option><option>Unfit</option><option>Pending</option></FSelect></FField>
            <FField label="SL"><FInput type="number" value={form.sl} onChange={e=>setForm(p=>({...p,sl:Number(e.target.value)}))} /></FField>
          </div>
          <FCheck label="MOFA Updated" checked={form.mofa_update} onChange={v=>setForm(p=>({...p,mofa_update:v}))} />
        </Modal>
      )}
      {modal === "view" && sel && (
        <Modal title="Medical Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"   value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Medical Date"value={fmtDate(sel.medical_date)} />
            <ViewRow label="Fit Date"    value={fmtDate(sel.fit_date)} />
            <ViewRow label="Expiry (90d)"value={fmtDate(getMedExpiry(sel))} />
            <ViewRow label="Days Left"   value={getDaysLeft(sel) !== null ? `${getDaysLeft(sel)}d` : "—"} />
            <ViewRow label="Status"      value={<SBadge s={sel.status} />} />
            <ViewRow label="MOFA Update" value={sel.mofa_update ? "Yes" : "No"} />
          </div>
        </Modal>
      )}
      {modal === "del" && sel && <DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── MOFA Page ────────────────────────────────────────────────────────────────
const MofaPage = ({ candidates, mofas, setMofas }: { candidates:Candidate[]; mofas:Mofa[]; setMofas:React.Dispatch<React.SetStateAction<Mofa[]>> }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<Mofa|null>(null);
  const blank = (): Mofa => ({ id:uid(), sl:mofas.length+1, candidate:"", application_number:null, agency:null, med_update:false, trade:null, aplication_date:null, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<Mofa>(blank());

  const rows = useMemo(() => mofas.filter(m => {
    const c = candidates.find(x => x.id === m.candidate);
    return !search || c?.name.toLowerCase().includes(search.toLowerCase()) || (m.application_number??"").toLowerCase().includes(search.toLowerCase());
  }), [mofas, candidates, search]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate) return;
    if (modal === "add") setMofas(p => [...p, {...form, updated_at:today()}]);
    else setMofas(p => p.map(m => m.id === form.id ? {...form, updated_at:today()} : m));
    close();
  };
  const del = () => { setMofas(p => p.filter(m => m.id !== sel!.id)); close(); };

  return (
    <>
      <TablePage title="MOFA" subtitle="Ministry of Foreign Affairs attestation" search={search} setSearch={setSearch}
        filter="" setFilter={() => {}} filterOpts={[]}
        addBtn={<button onClick={() => { setForm(blank()); setModal("add"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>SL</Th><Th>Candidate</Th><Th>App. No</Th><Th>Agency</Th><Th>Trade</Th><Th>App. Date</Th><Th>Med Upd.</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(m => (
              <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td mono>{m.sl}</Td>
                <Td><span className="font-medium">{candidateName(candidates, m.candidate)}</span></Td>
                <Td mono>{m.application_number}</Td>
                <Td>{agencyName(m.agency)}</Td>
                <Td>{m.trade}</Td>
                <Td mono>{fmtDate(m.aplication_date)}</Td>
                <td className="px-4 py-3">{m.med_update ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-muted-foreground" />}</td>
                <RowActs onView={() => { setSel(m); setModal("view"); }} onEdit={() => { setForm({...m}); setSel(m); setModal("edit"); }} onDelete={() => { setSel(m); setModal("del"); }} />
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No records</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit") && (
        <Modal title={modal==="add"?"Add MOFA":"Edit MOFA"} onClose={close} onSave={save}>
          <FField label="Candidate *"><FSelect value={form.candidate} onChange={e=>setForm(p=>({...p,candidate:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</FSelect></FField>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Application No"><FInput value={form.application_number??""} onChange={e=>setForm(p=>({...p,application_number:e.target.value||null}))} /></FField>
            <FField label="Agency"><FSelect value={form.agency??""} onChange={e=>setForm(p=>({...p,agency:e.target.value||null}))}><option value="">Select…</option>{AGENCIES.map(a=><option key={a.uuid} value={a.uuid}>{a.name}</option>)}</FSelect></FField>
            <FField label="Trade"><FSelect value={form.trade??""} onChange={e=>setForm(p=>({...p,trade:e.target.value||null}))}><option value="">Select…</option>{TRADES.map(t=><option key={t}>{t}</option>)}</FSelect></FField>
            <FField label="Application Date"><FInput type="date" value={form.aplication_date??""} onChange={e=>setForm(p=>({...p,aplication_date:e.target.value||null}))} /></FField>
          </div>
          <FCheck label="Medical Updated" checked={form.med_update} onChange={v=>setForm(p=>({...p,med_update:v}))} />
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="MOFA Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"       value={candidateName(candidates, sel.candidate)} />
            <ViewRow label="Application No"  value={sel.application_number} />
            <ViewRow label="Agency"          value={agencyName(sel.agency)} />
            <ViewRow label="Trade"           value={sel.trade} />
            <ViewRow label="Application Date"value={fmtDate(sel.aplication_date)} />
            <ViewRow label="Medical Updated" value={sel.med_update?"Yes":"No"} />
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Visa Page ────────────────────────────────────────────────────────────────
const VisaPage = ({ candidates, visas, setVisas }: { candidates:Candidate[]; visas:Visa[]; setVisas:React.Dispatch<React.SetStateAction<Visa[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<Visa|null>(null);
  const blank = (): Visa => ({ id:uid(), candidate_id:"", visa_sl:visas.length+1, issue_date:null, expiry_date:null, flight_date:null, visa_type:"Work Visa", iqamah_number:null, status:"Pending", agency:null, manpower:false, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<Visa>(blank());

  const rows = useMemo(() => visas.filter(v => {
    const c = candidates.find(x => x.id === v.candidate_id);
    return (!search || c?.name.toLowerCase().includes(search.toLowerCase())) && (!filter || v.status === filter);
  }), [visas, candidates, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id) return;
    if (modal==="add") setVisas(p=>[...p,{...form,updated_at:today()}]);
    else setVisas(p=>p.map(v=>v.id===form.id?{...form,updated_at:today()}:v));
    close();
  };
  const del = () => { setVisas(p=>p.filter(v=>v.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Visa" subtitle="Work visa applications & expiry pipeline" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Active","Pending","Stamped","Expired"]}
        addBtn={<button onClick={() => { setForm(blank()); setModal("add"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>SL</Th><Th>Candidate</Th><Th>Type</Th><Th>Issue</Th><Th>Expiry</Th><Th>Days Left</Th><Th>Iqamah No</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(v => {
              const days = daysUntil(v.expiry_date);
              return (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Td mono>{v.visa_sl}</Td>
                  <Td><span className="font-medium">{candidateName(candidates, v.candidate_id)}</span></Td>
                  <Td>{v.visa_type}</Td>
                  <Td mono>{fmtDate(v.issue_date)}</Td>
                  <Td mono>{fmtDate(v.expiry_date)}</Td>
                  <td className="px-4 py-3">
                    {days !== null ? (
                      <span className={`text-xs font-mono font-semibold ${days<0?"text-red-600":days<90?"text-amber-600":"text-green-600"}`}>
                        {days<0?`${Math.abs(days)}d ago`:`${days}d`}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <Td mono>{v.iqamah_number}</Td>
                  <td className="px-4 py-3"><SBadge s={v.status} /></td>
                  <RowActs onView={() => { setSel(v); setModal("view"); }} onEdit={() => { setForm({...v}); setSel(v); setModal("edit"); }} onDelete={() => { setSel(v); setModal("del"); }} />
                </tr>
              );
            })}
            {rows.length===0&&<tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-sm">No records</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Visa":"Edit Visa"} onClose={close} onSave={save} wide>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><FField label="Candidate *"><FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</FSelect></FField></div>
            <FField label="Agency"><FSelect value={form.agency??""} onChange={e=>setForm(p=>({...p,agency:e.target.value||null}))}><option value="">Select…</option>{AGENCIES.map(a=><option key={a.uuid} value={a.uuid}>{a.name}</option>)}</FSelect></FField>
            <FField label="Visa Type"><FInput value={form.visa_type??""} onChange={e=>setForm(p=>({...p,visa_type:e.target.value||null}))} /></FField>
            <FField label="Issue Date"><FInput type="date" value={form.issue_date??""} onChange={e=>setForm(p=>({...p,issue_date:e.target.value||null}))} /></FField>
            <FField label="Expiry Date"><FInput type="date" value={form.expiry_date??""} onChange={e=>setForm(p=>({...p,expiry_date:e.target.value||null}))} /></FField>
            <FField label="Flight Date"><FInput type="date" value={form.flight_date??""} onChange={e=>setForm(p=>({...p,flight_date:e.target.value||null}))} /></FField>
            <FField label="Iqamah No"><FInput value={form.iqamah_number??""} onChange={e=>setForm(p=>({...p,iqamah_number:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Active</option><option>Pending</option><option>Stamped</option><option>Expired</option></FSelect></FField>
          </div>
          <FCheck label="Manpower Order" checked={form.manpower} onChange={v=>setForm(p=>({...p,manpower:v}))} />
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Visa Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"   value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Agency"      value={agencyName(sel.agency)} />
            <ViewRow label="Visa Type"   value={sel.visa_type} />
            <ViewRow label="Issue Date"  value={fmtDate(sel.issue_date)} />
            <ViewRow label="Expiry Date" value={fmtDate(sel.expiry_date)} />
            <ViewRow label="Days Left"   value={daysUntil(sel.expiry_date) !== null ? `${daysUntil(sel.expiry_date)}d` : "—"} />
            <ViewRow label="Flight Date" value={fmtDate(sel.flight_date)} />
            <ViewRow label="Iqamah No"   value={sel.iqamah_number} />
            <ViewRow label="Status"      value={<SBadge s={sel.status} />} />
            <ViewRow label="Manpower"    value={sel.manpower?"Yes":"No"} />
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Takamul Page ─────────────────────────────────────────────────────────────
const TakamulPage = ({ candidates, takamul, setTakamul }: { candidates:Candidate[]; takamul:Takamul[]; setTakamul:React.Dispatch<React.SetStateAction<Takamul[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<Takamul|null>(null);
  const blank = (): Takamul => ({ id:uid(), candidate_id:"", mofa_id:null, trade:null, test_center:null, test_date:null, result:null, result_date:null, certificate_no:null, issue_date:null, expiry_date:null, status:"Pending", notes:null, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<Takamul>(blank());

  const rows = useMemo(() => takamul.filter(t => {
    const c = candidates.find(x => x.id === t.candidate_id);
    return (!search || c?.name.toLowerCase().includes(search.toLowerCase())) && (!filter || t.status === filter);
  }), [takamul, candidates, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id) return;
    if (modal==="add") setTakamul(p=>[...p,{...form,updated_at:today()}]);
    else setTakamul(p=>p.map(t=>t.id===form.id?{...form,updated_at:today()}:t));
    close();
  };
  const del = () => { setTakamul(p=>p.filter(t=>t.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Takamul" subtitle="Skills & competency certification records" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Pending","Certified","Failed"]}
        addBtn={<button onClick={() => { setForm(blank()); setModal("add"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Candidate</Th><Th>Trade</Th><Th>Test Center</Th><Th>Test Date</Th><Th>Result</Th><Th>Cert. No</Th><Th>Expiry</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(t => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td><span className="font-medium">{candidateName(candidates, t.candidate_id)}</span></Td>
                <Td>{t.trade}</Td>
                <Td>{t.test_center}</Td>
                <Td mono>{fmtDate(t.test_date)}</Td>
                <td className="px-4 py-3">{t.result ? <SBadge s={t.result} /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                <Td mono>{t.certificate_no}</Td>
                <Td mono>{fmtDate(t.expiry_date)}</Td>
                <td className="px-4 py-3"><SBadge s={t.status} /></td>
                <RowActs onView={() => { setSel(t); setModal("view"); }} onEdit={() => { setForm({...t}); setSel(t); setModal("edit"); }} onDelete={() => { setSel(t); setModal("del"); }} />
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-sm">No records</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Takamul":"Edit Takamul"} onClose={close} onSave={save} wide>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><FField label="Candidate *"><FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</FSelect></FField></div>
            <FField label="Trade"><FSelect value={form.trade??""} onChange={e=>setForm(p=>({...p,trade:e.target.value||null}))}><option value="">Select…</option>{TRADES.map(t=><option key={t}>{t}</option>)}</FSelect></FField>
            <FField label="Test Center"><FInput value={form.test_center??""} onChange={e=>setForm(p=>({...p,test_center:e.target.value||null}))} /></FField>
            <FField label="Test Date"><FInput type="date" value={form.test_date??""} onChange={e=>setForm(p=>({...p,test_date:e.target.value||null}))} /></FField>
            <FField label="Result"><FSelect value={form.result??""} onChange={e=>setForm(p=>({...p,result:e.target.value||null}))}><option value="">Select…</option><option>Pass</option><option>Fail</option></FSelect></FField>
            <FField label="Result Date"><FInput type="date" value={form.result_date??""} onChange={e=>setForm(p=>({...p,result_date:e.target.value||null}))} /></FField>
            <FField label="Certificate No"><FInput value={form.certificate_no??""} onChange={e=>setForm(p=>({...p,certificate_no:e.target.value||null}))} /></FField>
            <FField label="Issue Date"><FInput type="date" value={form.issue_date??""} onChange={e=>setForm(p=>({...p,issue_date:e.target.value||null}))} /></FField>
            <FField label="Expiry Date"><FInput type="date" value={form.expiry_date??""} onChange={e=>setForm(p=>({...p,expiry_date:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Pending</option><option>Certified</option><option>Failed</option></FSelect></FField>
          </div>
          <FField label="Notes"><FTextarea value={form.notes??""} onChange={e=>setForm(p=>({...p,notes:e.target.value||null}))} /></FField>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Takamul Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"     value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Trade"         value={sel.trade} />
            <ViewRow label="Test Center"   value={sel.test_center} />
            <ViewRow label="Test Date"     value={fmtDate(sel.test_date)} />
            <ViewRow label="Result"        value={sel.result ? <SBadge s={sel.result} /> : "—"} />
            <ViewRow label="Certificate"   value={sel.certificate_no} />
            <ViewRow label="Issue Date"    value={fmtDate(sel.issue_date)} />
            <ViewRow label="Expiry Date"   value={fmtDate(sel.expiry_date)} />
            <ViewRow label="Status"        value={<SBadge s={sel.status} />} />
            {sel.notes && <ViewRow label="Notes" value={sel.notes} />}
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Passport Tracking Page ───────────────────────────────────────────────────
const PassportPage = ({ candidates, passports, setPassports }: { candidates:Candidate[]; passports:PassportTracking[]; setPassports:React.Dispatch<React.SetStateAction<PassportTracking[]>> }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<PassportTracking|null>(null);
  const blank = (): PassportTracking => ({ id:uid(), candidate_id:"", location:"Agency Office", held_by:null, phone:null, received_date:null, expected_return:null, returned_date:null, notes:null, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<PassportTracking>(blank());

  const rows = useMemo(() => passports.filter(p => {
    const c = candidates.find(x => x.id === p.candidate_id);
    return !search || c?.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
  }), [passports, candidates, search]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id || !form.location) return;
    if (modal==="add") setPassports(p=>[...p,{...form,updated_at:today()}]);
    else setPassports(p=>p.map(x=>x.id===form.id?{...form,updated_at:today()}:x));
    close();
  };
  const del = () => { setPassports(p=>p.filter(x=>x.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Passport Tracking" subtitle="Current location and custody of passports" search={search} setSearch={setSearch}
        filter="" setFilter={() => {}} filterOpts={[]}
        addBtn={<button onClick={() => { setForm(blank()); setModal("add"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Candidate</Th><Th>Passport No</Th><Th>Current Location</Th><Th>Held By</Th><Th>Phone</Th><Th>Received</Th><Th>Exp. Return</Th><Th>Returned</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(p => {
              const c = candidates.find(x => x.id === p.candidate_id);
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Td><span className="font-medium">{c?.name ?? "—"}</span></Td>
                  <Td mono>{c?.passport_no}</Td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-sm text-foreground"><MapPin size={12} className="text-primary" />{p.location}</div></td>
                  <Td>{p.held_by}</Td>
                  <Td mono>{p.phone}</Td>
                  <Td mono>{fmtDate(p.received_date)}</Td>
                  <Td mono>{fmtDate(p.expected_return)}</Td>
                  <td className="px-4 py-3">{p.returned_date ? <span className="text-xs font-mono text-green-600">{fmtDate(p.returned_date)}</span> : <span className="text-xs text-amber-600 font-medium">In transit</span>}</td>
                  <RowActs onView={() => { setSel(p); setModal("view"); }} onEdit={() => { setForm({...p}); setSel(p); setModal("edit"); }} onDelete={() => { setSel(p); setModal("del"); }} />
                </tr>
              );
            })}
            {rows.length===0&&<tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-sm">No records</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Passport Tracking":"Edit Passport Tracking"} onClose={close} onSave={save} wide>
          <FField label="Candidate *"><FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name} ({c.passport_no})</option>)}</FSelect></FField>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Current Location *"><FSelect value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))}>{LOCATIONS.map(l=><option key={l}>{l}</option>)}</FSelect></FField>
            <FField label="Held By"><FInput value={form.held_by??""} onChange={e=>setForm(p=>({...p,held_by:e.target.value||null}))} /></FField>
            <FField label="Phone"><FInput value={form.phone??""} onChange={e=>setForm(p=>({...p,phone:e.target.value||null}))} /></FField>
            <FField label="Received Date"><FInput type="date" value={form.received_date??""} onChange={e=>setForm(p=>({...p,received_date:e.target.value||null}))} /></FField>
            <FField label="Expected Return"><FInput type="date" value={form.expected_return??""} onChange={e=>setForm(p=>({...p,expected_return:e.target.value||null}))} /></FField>
            <FField label="Returned Date"><FInput type="date" value={form.returned_date??""} onChange={e=>setForm(p=>({...p,returned_date:e.target.value||null}))} /></FField>
          </div>
          <FField label="Notes"><FTextarea value={form.notes??""} onChange={e=>setForm(p=>({...p,notes:e.target.value||null}))} /></FField>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Passport Tracking" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"       value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Location"        value={sel.location} />
            <ViewRow label="Held By"         value={sel.held_by} />
            <ViewRow label="Phone"           value={sel.phone} />
            <ViewRow label="Received Date"   value={fmtDate(sel.received_date)} />
            <ViewRow label="Expected Return" value={fmtDate(sel.expected_return)} />
            <ViewRow label="Returned Date"   value={sel.returned_date ? fmtDate(sel.returned_date) : "Still in transit"} />
            {sel.notes && <ViewRow label="Notes" value={sel.notes} />}
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Reports Page ─────────────────────────────────────────────────────────────
const ReportsPage = ({ candidates, medicals, visas, mofas, takamul }: { candidates:Candidate[]; medicals:Medical[]; visas:Visa[]; mofas:Mofa[]; takamul:Takamul[] }) => {
  const byCountry = COUNTRIES.map(c => ({ country:c, count:candidates.filter(x=>x.country===c&&!x.is_deleted).length })).filter(x=>x.count>0);
  const medStatus = [
    { label:"Fit",     count:medicals.filter(m=>m.status==="Fit").length,     color:"text-green-600" },
    { label:"Unfit",   count:medicals.filter(m=>m.status==="Unfit").length,   color:"text-red-600"   },
    { label:"Pending", count:medicals.filter(m=>m.status==="Pending").length, color:"text-amber-600" },
  ];
  const visaStatus = ["Active","Pending","Stamped","Expired"].map(s=>({ label:s, count:visas.filter(v=>v.status===s).length }));
  const expiringMeds = medicals.filter(m => { if(!m.fit_date||m.status!=="Fit") return false; return (daysUntil(addDays(m.fit_date,90))??999) < 90; });
  const expiringVisa = visas.filter(v => (daysUntil(v.expiry_date)??999) < 90);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-foreground">Reports</h2><p className="text-sm text-muted-foreground">Summary and export</p></div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><FileBarChart size={14}/> Print / Export</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Candidates", value:candidates.filter(c=>!c.is_deleted).length, icon:Users, color:"bg-blue-500" },
          { label:"Total Medicals",   value:medicals.length,  icon:Stethoscope, color:"bg-green-500" },
          { label:"Total Visas",      value:visas.length,     icon:Globe,       color:"bg-indigo-500" },
          { label:"Takamul Certified",value:takamul.filter(t=>t.status==="Certified").length, icon:Award, color:"bg-purple-500" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center flex-shrink-0`}><s.icon size={18} className="text-white" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* By Country */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Candidates by Country</h3>
          <div className="space-y-3">
            {byCountry.map(b => (
              <div key={b.country} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-24">{b.country}</span>
                <div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all" style={{width:`${(b.count/candidates.length)*100}%`}}/></div>
                <span className="font-mono text-xs font-semibold text-foreground w-4 text-right">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Medical Status</h3>
          <div className="space-y-3">
            {medStatus.map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <span className={`font-mono font-bold text-lg ${m.color}`}>{m.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4">
            <h4 className="text-xs text-muted-foreground mb-3">Expiring within 90 days</h4>
            {expiringMeds.length === 0 ? <p className="text-xs text-green-600">✓ No expiring medicals</p> :
              expiringMeds.map(m => <div key={m.id} className="text-xs text-amber-700 flex justify-between"><span>{candidateName(candidates, m.candidate_id)}</span><span className="font-mono">{fmtDate(addDays(m.fit_date!,90))}</span></div>)
            }
          </div>
        </div>

        {/* Visa Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Visa Status</h3>
          <div className="space-y-3">
            {visaStatus.map(v => (
              <div key={v.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{v.label}</span>
                <span className="font-mono font-bold text-lg text-foreground">{v.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4">
            <h4 className="text-xs text-muted-foreground mb-3">Expiring within 90 days</h4>
            {expiringVisa.length === 0 ? <p className="text-xs text-green-600">✓ No expiring visas</p> :
              expiringVisa.map(v => <div key={v.id} className="text-xs text-red-700 flex justify-between"><span>{candidateName(candidates, v.candidate_id)}</span><span className="font-mono">{fmtDate(v.expiry_date)}</span></div>)
            }
          </div>
        </div>
      </div>

      {/* MOFA summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">MOFA Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Filed", value:mofas.length },
            { label:"Med Updated", value:mofas.filter(m=>m.med_update).length },
            { label:"Pending Med", value:mofas.filter(m=>!m.med_update).length },
            { label:"With Agency", value:mofas.filter(m=>m.agency).length },
          ].map(s=>(
            <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Manpower & Flight pages (simplified but functional) ──────────────────────
const ManpowerPage = () => {
  const [orders, setOrders] = useState<ManpowerOrder[]>(INIT_ORDERS);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState<null|"add"|"del">(null);
  const [sel, setSel]       = useState<ManpowerOrder|null>(null);
  const [form, setForm]     = useState({ client:"",country:"",position:"",qty:0,deadline:"",status:"Open" });
  const rows = orders.filter(o => o.client.toLowerCase().includes(search.toLowerCase()) || o.position.toLowerCase().includes(search.toLowerCase()));
  const save = () => { setOrders(p=>[...p,{id:uid(),...form,filled:0}]); setModal(null); };
  return (
    <>
      <TablePage title="Manpower Orders" subtitle="Client demand and fulfillment" search={search} setSearch={setSearch} filter="" setFilter={()=>{}} filterOpts={[]}
        addBtn={<button onClick={()=>setModal("add")} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> New Order</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30"><Th>ID</Th><Th>Client</Th><Th>Country</Th><Th>Position</Th><Th>Qty</Th><Th>Filled</Th><Th>Deadline</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {rows.map(o=>(
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td mono>{o.id}</Td><Td><span className="font-medium">{o.client}</span></Td><Td>{o.country}</Td><Td>{o.position}</Td>
                <Td mono>{o.qty}</Td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-muted rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{width:`${(o.filled/o.qty)*100}%`}}/></div><span className="font-mono text-xs">{o.filled}</span></div></td>
                <Td mono>{fmtDate(o.deadline)}</Td>
                <td className="px-4 py-3"><SBadge s={o.status}/></td>
                <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={()=>{setSel(o);setModal("del");}} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"><Trash2 size={13}/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TablePage>
      {modal==="add"&&(
        <Modal title="New Manpower Order" onClose={()=>setModal(null)} onSave={save}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><FField label="Client Name"><FInput value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))} /></FField></div>
            <FField label="Country"><FSelect value={form.country} onChange={e=>setForm(p=>({...p,country:e.target.value}))}><option value="">Select…</option>{["UAE","KSA","Qatar","Kuwait","Oman"].map(c=><option key={c}>{c}</option>)}</FSelect></FField>
            <FField label="Position"><FSelect value={form.position} onChange={e=>setForm(p=>({...p,position:e.target.value}))}><option value="">Select…</option>{TRADES.map(t=><option key={t}>{t}</option>)}</FSelect></FField>
            <FField label="Quantity"><FInput type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:Number(e.target.value)}))} /></FField>
            <FField label="Deadline"><FInput type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} /></FField>
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={sel.client} onClose={()=>setModal(null)} onConfirm={()=>{setOrders(p=>p.filter(o=>o.id!==sel.id));setModal(null);}} />}
    </>
  );
};

const FlightPage = () => {
  const [flights, setFlights] = useState<FlightRecord[]>(INIT_FLIGHTS);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<null|"add"|"del">(null);
  const [sel, setSel]         = useState<FlightRecord|null>(null);
  const [form, setForm]       = useState({ airline:"",flight_no:"",origin:"",destination:"",date:"",seats:0,status:"Open" });
  const rows = flights.filter(f => f.airline.toLowerCase().includes(search.toLowerCase()) || f.flight_no.toLowerCase().includes(search.toLowerCase()));
  const save = () => { setFlights(p=>[...p,{id:uid(),...form,booked:0}]); setModal(null); };
  return (
    <>
      <TablePage title="Flight Bookings" subtitle="Group flight scheduling & seat allocation" search={search} setSearch={setSearch} filter="" setFilter={()=>{}} filterOpts={[]}
        addBtn={<button onClick={()=>setModal("add")} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add Flight</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30"><Th>Ref</Th><Th>Airline</Th><Th>Flight No</Th><Th>Origin</Th><Th>Destination</Th><Th>Date</Th><Th>Capacity</Th><Th>Status</Th><Th>Action</Th></tr></thead>
          <tbody>
            {rows.map(f=>(
              <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td mono>{f.id}</Td><Td><span className="font-medium">{f.airline}</span></Td><Td mono>{f.flight_no}</Td><Td>{f.origin}</Td><Td>{f.destination}</Td>
                <Td mono>{fmtDate(f.date)}</Td><Td mono>{f.booked}/{f.seats}</Td>
                <td className="px-4 py-3"><SBadge s={f.status}/></td>
                <td className="px-4 py-3"><button onClick={()=>{setSel(f);setModal("del");}} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TablePage>
      {modal==="add"&&(
        <Modal title="Add Flight" onClose={()=>setModal(null)} onSave={save}>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Airline"><FInput value={form.airline} onChange={e=>setForm(p=>({...p,airline:e.target.value}))} /></FField>
            <FField label="Flight No"><FInput value={form.flight_no} onChange={e=>setForm(p=>({...p,flight_no:e.target.value}))} /></FField>
            <FField label="Origin"><FInput value={form.origin} onChange={e=>setForm(p=>({...p,origin:e.target.value}))} /></FField>
            <FField label="Destination"><FInput value={form.destination} onChange={e=>setForm(p=>({...p,destination:e.target.value}))} /></FField>
            <FField label="Date"><FInput type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></FField>
            <FField label="Total Seats"><FInput type="number" value={form.seats} onChange={e=>setForm(p=>({...p,seats:Number(e.target.value)}))} /></FField>
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={`${sel.airline} ${sel.flight_no}`} onClose={()=>setModal(null)} onConfirm={()=>{setFlights(p=>p.filter(f=>f.id!==sel.id));setModal(null);}} />}
    </>
  );
};

// ─── Users Page ───────────────────────────────────────────────────────────────
const UsersPage = () => {
  const [users, setUsers] = useState<SystemUser[]>(INIT_USERS);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState<null|"add"|"del">(null);
  const [sel, setSel]       = useState<SystemUser|null>(null);
  const [form, setForm]     = useState({ name:"",email:"",role:"HR Manager",dept:"HR",status:"Active" });
  const rows = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const save = () => { setUsers(p=>[...p,{id:uid(),...form,last_active:today()}]); setModal(null); };
  return (
    <>
      <TablePage title="System Users" subtitle="Staff accounts and access control" search={search} setSearch={setSearch} filter="" setFilter={()=>{}} filterOpts={[]}
        addBtn={<button onClick={()=>setModal("add")} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add User</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30"><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Department</Th><Th>Status</Th><Th>Last Active</Th><Th>Action</Th></tr></thead>
          <tbody>
            {rows.map(u=>(
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="font-medium text-foreground">{u.name}</span></div></td>
                <Td>{u.email}</Td><Td>{u.role}</Td><Td>{u.dept}</Td>
                <td className="px-4 py-3"><SBadge s={u.status}/></td>
                <Td mono>{fmtDate(u.last_active)}</Td>
                <td className="px-4 py-3"><button onClick={()=>{setSel(u);setModal("del");}} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TablePage>
      {modal==="add"&&(
        <Modal title="Add User" onClose={()=>setModal(null)} onSave={save}>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Full Name"><FInput value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></FField>
            <FField label="Email"><FInput type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} /></FField>
            <FField label="Role"><FSelect value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>{["Super Admin","HR Manager","Visa Officer","Operations","Finance"].map(r=><option key={r}>{r}</option>)}</FSelect></FField>
            <FField label="Department"><FInput value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))} /></FField>
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={sel.name} onClose={()=>setModal(null)} onConfirm={()=>{setUsers(p=>p.filter(u=>u.id!==sel.id));setModal(null);}} />}
    </>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [cfg, setCfg] = useState({ company:"Gulf Manpower Services Ltd.", license:"MAN-2019-04812", country:"Bangladesh", email:"info@gulfmanpower.com", medExpiry:"90", visaExpiry:"90", flightAlert:"48" });
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-2xl">
      <div><h2 className="text-lg font-semibold text-foreground">Settings</h2><p className="text-sm text-muted-foreground">System and company preferences</p></div>
      {[
        { title:"Company Information", fields:[
          { label:"Company Name",  key:"company" as const },
          { label:"License No.",   key:"license" as const },
          { label:"Country",       key:"country" as const },
          { label:"Contact Email", key:"email" as const },
        ]},
        { title:"Pipeline Alert Thresholds", fields:[
          { label:"Medical Expiry Alert (days)", key:"medExpiry" as const },
          { label:"Visa Expiry Alert (days)",    key:"visaExpiry" as const },
          { label:"Flight Reminder (hours)",     key:"flightAlert" as const },
        ]},
      ].map(s=>(
        <div key={s.title} className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm">{s.title}</h3></div>
          <div className="p-5 space-y-4">
            {s.fields.map(f=>(
              <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <label className="text-sm text-muted-foreground w-52 flex-shrink-0">{f.label}</label>
                <FInput value={cfg[f.key]} onChange={e=>setCfg(p=>({...p,[f.key]:e.target.value}))} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-3 items-center">
        <button onClick={save} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save Changes</button>
        {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Saved!</span>}
      </div>
    </div>
  );
};

// ─── Agents Page ─────────────────────────────────────────────────────────────
const AgentsPage = ({ agents, setAgents }: { agents:AgentFull[]; setAgents:React.Dispatch<React.SetStateAction<AgentFull[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<AgentFull|null>(null);
  const blank = (): AgentFull => ({ id:uid(), full_name:"", CODE:null, phone:null, email:null, address:null, status:"Active", created_at:today() });
  const [form, setForm]     = useState<AgentFull>(blank());

  const rows = useMemo(() => agents.filter(a =>
    (a.full_name.toLowerCase().includes(search.toLowerCase()) || (a.CODE??"").toLowerCase().includes(search.toLowerCase())) &&
    (filter === "" || a.status === filter)
  ), [agents, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.full_name) return;
    if (modal==="add") setAgents(p=>[...p,{...form}]);
    else setAgents(p=>p.map(a=>a.id===form.id?{...form}:a));
    close();
  };
  const del = () => { setAgents(p=>p.filter(a=>a.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Agents" subtitle="Registered recruitment agents" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Active","Inactive"]}
        addBtn={<button onClick={()=>{setForm(blank());setModal("add");}} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Name</Th><Th>Code</Th><Th>Phone</Th><Th>Email</Th><Th>Address</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(a=>(
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td><span className="font-medium">{a.full_name}</span></Td>
                <Td mono>{a.CODE}</Td>
                <Td mono>{a.phone}</Td>
                <Td>{a.email}</Td>
                <Td>{a.address}</Td>
                <td className="px-4 py-3"><SBadge s={a.status}/></td>
                <RowActs onView={()=>{setSel(a);setModal("view");}} onEdit={()=>{setForm({...a});setSel(a);setModal("edit");}} onDelete={()=>{setSel(a);setModal("del");}} />
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Agent":"Edit Agent"} onClose={close} onSave={save} wide>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Full Name *"><FInput value={form.full_name} onChange={e=>setForm(p=>({...p,full_name:e.target.value}))} /></FField>
            <FField label="Code"><FInput value={form.CODE??""} onChange={e=>setForm(p=>({...p,CODE:e.target.value||null}))} /></FField>
            <FField label="Phone"><FInput value={form.phone??""} onChange={e=>setForm(p=>({...p,phone:e.target.value||null}))} /></FField>
            <FField label="Email"><FInput type="email" value={form.email??""} onChange={e=>setForm(p=>({...p,email:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Active</option><option>Inactive</option></FSelect></FField>
          </div>
          <FField label="Address"><FTextarea value={form.address??""} onChange={e=>setForm(p=>({...p,address:e.target.value||null}))} /></FField>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Agent Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Full Name"  value={sel.full_name} />
            <ViewRow label="Code"       value={sel.CODE} />
            <ViewRow label="Phone"      value={sel.phone} />
            <ViewRow label="Email"      value={sel.email} />
            <ViewRow label="Address"    value={sel.address} />
            <ViewRow label="Status"     value={<SBadge s={sel.status}/>} />
            <ViewRow label="Created At" value={fmtDate(sel.created_at)} />
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={sel.full_name} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Agencies Page ────────────────────────────────────────────────────────────
const AgenciesPage = ({ agencies, setAgencies }: { agencies:AgencyFull[]; setAgencies:React.Dispatch<React.SetStateAction<AgencyFull[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<AgencyFull|null>(null);
  const blank = (): AgencyFull => ({ uuid:uid(), name:null, rl:null, country:null, contact_person:null, phone:null, email:null, status:"Active", created_at:today() });
  const [form, setForm]     = useState<AgencyFull>(blank());

  const rows = useMemo(() => agencies.filter(a =>
    ((a.name??"").toLowerCase().includes(search.toLowerCase()) || (a.country??"").toLowerCase().includes(search.toLowerCase())) &&
    (filter === "" || a.status === filter)
  ), [agencies, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.name) return;
    if (modal==="add") setAgencies(p=>[...p,{...form}]);
    else setAgencies(p=>p.map(a=>a.uuid===form.uuid?{...form}:a));
    close();
  };
  const del = () => { setAgencies(p=>p.filter(a=>a.uuid!==sel!.uuid)); close(); };

  return (
    <>
      <TablePage title="Agencies" subtitle="Client agencies and their details" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Active","Inactive"]}
        addBtn={<button onClick={()=>{setForm(blank());setModal("add");}} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Name</Th><Th>RL No</Th><Th>Country</Th><Th>Contact Person</Th><Th>Phone</Th><Th>Email</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(a=>(
              <tr key={a.uuid} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <Td><span className="font-medium">{a.name}</span></Td>
                <Td mono>{a.rl}</Td>
                <Td>{a.country}</Td>
                <Td>{a.contact_person}</Td>
                <Td mono>{a.phone}</Td>
                <Td>{a.email}</Td>
                <td className="px-4 py-3"><SBadge s={a.status}/></td>
                <RowActs onView={()=>{setSel(a);setModal("view");}} onEdit={()=>{setForm({...a});setSel(a);setModal("edit");}} onDelete={()=>{setSel(a);setModal("del");}} />
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Agency":"Edit Agency"} onClose={close} onSave={save} wide>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><FField label="Agency Name *"><FInput value={form.name??""} onChange={e=>setForm(p=>({...p,name:e.target.value||null}))} /></FField></div>
            <FField label="RL No"><FInput type="number" value={form.rl??""} onChange={e=>setForm(p=>({...p,rl:Number(e.target.value)||null}))} /></FField>
            <FField label="Country"><FSelect value={form.country??""} onChange={e=>setForm(p=>({...p,country:e.target.value||null}))}><option value="">Select…</option>{["UAE","KSA","Qatar","Kuwait","Oman","Bahrain"].map(c=><option key={c}>{c}</option>)}</FSelect></FField>
            <FField label="Contact Person"><FInput value={form.contact_person??""} onChange={e=>setForm(p=>({...p,contact_person:e.target.value||null}))} /></FField>
            <FField label="Phone"><FInput value={form.phone??""} onChange={e=>setForm(p=>({...p,phone:e.target.value||null}))} /></FField>
            <FField label="Email"><FInput type="email" value={form.email??""} onChange={e=>setForm(p=>({...p,email:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Active</option><option>Inactive</option></FSelect></FField>
          </div>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Agency Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Name"           value={sel.name} />
            <ViewRow label="RL No"          value={sel.rl} />
            <ViewRow label="Country"        value={sel.country} />
            <ViewRow label="Contact Person" value={sel.contact_person} />
            <ViewRow label="Phone"          value={sel.phone} />
            <ViewRow label="Email"          value={sel.email} />
            <ViewRow label="Status"         value={<SBadge s={sel.status}/>} />
            <ViewRow label="Created At"     value={fmtDate(sel.created_at)} />
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={sel.name??""} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Police Clearance Page ────────────────────────────────────────────────────
const PoliceClearancePage = ({ candidates, police, setPolice }: { candidates:Candidate[]; police:PoliceClearance[]; setPolice:React.Dispatch<React.SetStateAction<PoliceClearance[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<PoliceClearance|null>(null);
  const blank = (): PoliceClearance => ({ id:uid(), candidate_id:"", reference_no:null, issue_date:null, expiry_date:null, status:"Pending", notes:null, created_at:today(), updated_at:today() });
  const [form, setForm]     = useState<PoliceClearance>(blank());

  const rows = useMemo(() => police.filter(p => {
    const c = candidates.find(x=>x.id===p.candidate_id);
    return (!search || c?.name.toLowerCase().includes(search.toLowerCase()) || (p.reference_no??"").toLowerCase().includes(search.toLowerCase())) &&
      (filter===""||p.status===filter);
  }), [police, candidates, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id) return;
    if (modal==="add") setPolice(p=>[...p,{...form,updated_at:today()}]);
    else setPolice(p=>p.map(x=>x.id===form.id?{...form,updated_at:today()}:x));
    close();
  };
  const del = () => { setPolice(p=>p.filter(x=>x.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Police Clearance" subtitle="Police clearance certificate tracking" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Pending","Cleared","Rejected"]}
        addBtn={<button onClick={()=>{setForm(blank());setModal("add");}} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Candidate</Th><Th>Passport No</Th><Th>Reference No</Th><Th>Issue Date</Th><Th>Expiry Date</Th><Th>Days Left</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(p=>{
              const c = candidates.find(x=>x.id===p.candidate_id);
              const days = daysUntil(p.expiry_date);
              const urgent = days !== null && days < 30;
              const warn   = days !== null && days >= 30 && days < 90;
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Td><span className="font-medium">{c?.name??"—"}</span></Td>
                  <Td mono>{c?.passport_no}</Td>
                  <Td mono>{p.reference_no}</Td>
                  <Td mono>{fmtDate(p.issue_date)}</Td>
                  <Td mono>{fmtDate(p.expiry_date)}</Td>
                  <td className="px-4 py-3">
                    {days !== null ? (
                      <span className={`text-xs font-mono font-semibold ${urgent?"text-red-600":warn?"text-amber-600":"text-green-600"}`}>
                        {days<0?`${Math.abs(days)}d ago`:`${days}d`}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3"><SBadge s={p.status}/></td>
                  <RowActs onView={()=>{setSel(p);setModal("view");}} onEdit={()=>{setForm({...p});setSel(p);setModal("edit");}} onDelete={()=>{setSel(p);setModal("del");}} />
                </tr>
              );
            })}
            {rows.length===0&&<tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Police Clearance":"Edit Police Clearance"} onClose={close} onSave={save} wide>
          <FField label="Candidate *"><FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name} ({c.passport_no})</option>)}</FSelect></FField>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Reference No"><FInput value={form.reference_no??""} onChange={e=>setForm(p=>({...p,reference_no:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Pending</option><option>Cleared</option><option>Rejected</option></FSelect></FField>
            <FField label="Issue Date"><FInput type="date" value={form.issue_date??""} onChange={e=>setForm(p=>({...p,issue_date:e.target.value||null}))} /></FField>
            <FField label="Expiry Date"><FInput type="date" value={form.expiry_date??""} onChange={e=>setForm(p=>({...p,expiry_date:e.target.value||null}))} /></FField>
          </div>
          <FField label="Notes"><FTextarea value={form.notes??""} onChange={e=>setForm(p=>({...p,notes:e.target.value||null}))} /></FField>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Police Clearance Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"    value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Reference No" value={sel.reference_no} />
            <ViewRow label="Issue Date"   value={fmtDate(sel.issue_date)} />
            <ViewRow label="Expiry Date"  value={fmtDate(sel.expiry_date)} />
            <ViewRow label="Days Left"    value={daysUntil(sel.expiry_date)!==null?`${daysUntil(sel.expiry_date)}d`:"—"} />
            <ViewRow label="Status"       value={<SBadge s={sel.status}/>} />
            {sel.notes&&<ViewRow label="Notes" value={sel.notes} />}
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Fingerprint Page ─────────────────────────────────────────────────────────
const FingerprintPage = ({ candidates, fingers, setFingers }: { candidates:Candidate[]; fingers:Fingerprint[]; setFingers:React.Dispatch<React.SetStateAction<Fingerprint[]>> }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal]   = useState<null|"add"|"edit"|"view"|"del">(null);
  const [sel, setSel]       = useState<Fingerprint|null>(null);
  const blank = (): Fingerprint => ({ id:uid(), candidate_id:"", enrollment_date:null, center:null, reference_no:null, status:"Pending", notes:null, created_at:today() });
  const [form, setForm]     = useState<Fingerprint>(blank());

  const rows = useMemo(() => fingers.filter(f => {
    const c = candidates.find(x=>x.id===f.candidate_id);
    return (!search || c?.name.toLowerCase().includes(search.toLowerCase()) || (f.reference_no??"").toLowerCase().includes(search.toLowerCase())) &&
      (filter===""||f.status===filter);
  }), [fingers, candidates, search, filter]);

  const close = () => setModal(null);
  const save  = () => {
    if (!form.candidate_id) return;
    if (modal==="add") setFingers(p=>[...p,{...form}]);
    else setFingers(p=>p.map(x=>x.id===form.id?{...form}:x));
    close();
  };
  const del = () => { setFingers(p=>p.filter(x=>x.id!==sel!.id)); close(); };

  return (
    <>
      <TablePage title="Fingerprint" subtitle="Biometric fingerprint enrollment records" search={search} setSearch={setSearch}
        filter={filter} setFilter={setFilter} filterOpts={["Pending","Enrolled","Failed"]}
        addBtn={<button onClick={()=>{setForm(blank());setModal("add");}} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"><Plus size={13}/> Add</button>}>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <Th>Candidate</Th><Th>Passport No</Th><Th>Center</Th><Th>Enrollment Date</Th><Th>Reference No</Th><Th>Status</Th><Th>Actions</Th>
          </tr></thead>
          <tbody>
            {rows.map(f=>{
              const c = candidates.find(x=>x.id===f.candidate_id);
              return (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <Td><span className="font-medium">{c?.name??"—"}</span></Td>
                  <Td mono>{c?.passport_no}</Td>
                  <Td>{f.center}</Td>
                  <Td mono>{fmtDate(f.enrollment_date)}</Td>
                  <Td mono>{f.reference_no}</Td>
                  <td className="px-4 py-3"><SBadge s={f.status}/></td>
                  <RowActs onView={()=>{setSel(f);setModal("view");}} onEdit={()=>{setForm({...f});setSel(f);setModal("edit");}} onDelete={()=>{setSel(f);setModal("del");}} />
                </tr>
              );
            })}
            {rows.length===0&&<tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No records found</td></tr>}
          </tbody>
        </table>
      </TablePage>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Fingerprint Record":"Edit Fingerprint Record"} onClose={close} onSave={save} wide>
          <FField label="Candidate *"><FSelect value={form.candidate_id} onChange={e=>setForm(p=>({...p,candidate_id:e.target.value}))}><option value="">Select…</option>{candidates.filter(c=>!c.is_deleted).map(c=><option key={c.id} value={c.id}>{c.name} ({c.passport_no})</option>)}</FSelect></FField>
          <div className="grid grid-cols-2 gap-4">
            <FField label="Enrollment Date"><FInput type="date" value={form.enrollment_date??""} onChange={e=>setForm(p=>({...p,enrollment_date:e.target.value||null}))} /></FField>
            <FField label="Center"><FInput value={form.center??""} onChange={e=>setForm(p=>({...p,center:e.target.value||null}))} /></FField>
            <FField label="Reference No"><FInput value={form.reference_no??""} onChange={e=>setForm(p=>({...p,reference_no:e.target.value||null}))} /></FField>
            <FField label="Status"><FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}><option>Pending</option><option>Enrolled</option><option>Failed</option></FSelect></FField>
          </div>
          <FField label="Notes"><FTextarea value={form.notes??""} onChange={e=>setForm(p=>({...p,notes:e.target.value||null}))} /></FField>
        </Modal>
      )}
      {modal==="view"&&sel&&(
        <Modal title="Fingerprint Details" onClose={close} onSave={close}>
          <div className="space-y-2.5">
            <ViewRow label="Candidate"       value={candidateName(candidates, sel.candidate_id)} />
            <ViewRow label="Center"          value={sel.center} />
            <ViewRow label="Enrollment Date" value={fmtDate(sel.enrollment_date)} />
            <ViewRow label="Reference No"    value={sel.reference_no} />
            <ViewRow label="Status"          value={<SBadge s={sel.status}/>} />
            {sel.notes&&<ViewRow label="Notes" value={sel.notes} />}
          </div>
        </Modal>
      )}
      {modal==="del"&&sel&&<DelModal name={candidateName(candidates, sel.candidate_id)} onClose={close} onConfirm={del} />}
    </>
  );
};

// ─── Notifications Page ───────────────────────────────────────────────────────
const NotificationsPage = ({ candidates, medicals, visas, police, fingers }: { candidates:Candidate[]; medicals:Medical[]; visas:Visa[]; police:PoliceClearance[]; fingers:Fingerprint[] }) => {
  type AlertItem = { candidateName:string; passportNo:string; subject:string; daysLeft:number|null; severity:"critical"|"warning"|"info"; };

  const alerts: AlertItem[] = [];

  // Medical expiring < 90 days
  medicals.forEach(m => {
    if (!m.fit_date || m.status !== "Fit") return;
    const expiry = addDays(m.fit_date, 90);
    const days = daysUntil(expiry);
    if (days !== null && days < 90) {
      const c = candidates.find(x=>x.id===m.candidate_id);
      alerts.push({ candidateName:c?.name??"—", passportNo:c?.passport_no??"—", subject:`Medical expiring (${fmtDate(expiry)})`, daysLeft:days, severity: days<30?"critical":"warning" });
    }
  });

  // Visa expiring < 90 days
  visas.forEach(v => {
    if (!v.expiry_date) return;
    const days = daysUntil(v.expiry_date);
    if (days !== null && days < 90) {
      const c = candidates.find(x=>x.id===v.candidate_id);
      alerts.push({ candidateName:c?.name??"—", passportNo:c?.passport_no??"—", subject:`Visa expiring (${fmtDate(v.expiry_date)})`, daysLeft:days, severity: days<30?"critical":"warning" });
    }
  });

  // Police clearance expiring < 90 days
  police.forEach(p => {
    if (!p.expiry_date || p.status!=="Cleared") return;
    const days = daysUntil(p.expiry_date);
    if (days !== null && days < 90) {
      const c = candidates.find(x=>x.id===p.candidate_id);
      alerts.push({ candidateName:c?.name??"—", passportNo:c?.passport_no??"—", subject:`Police clearance expiring (${fmtDate(p.expiry_date)})`, daysLeft:days, severity: days<30?"critical":"warning" });
    }
  });

  // Police clearance Pending
  police.filter(p=>p.status==="Pending").forEach(p => {
    const c = candidates.find(x=>x.id===p.candidate_id);
    alerts.push({ candidateName:c?.name??"—", passportNo:c?.passport_no??"—", subject:"Police clearance pending", daysLeft:null, severity:"info" });
  });

  // Fingerprint Pending
  fingers.filter(f=>f.status==="Pending").forEach(f => {
    const c = candidates.find(x=>x.id===f.candidate_id);
    alerts.push({ candidateName:c?.name??"—", passportNo:c?.passport_no??"—", subject:"Fingerprint enrollment pending", daysLeft:null, severity:"info" });
  });

  const critical = alerts.filter(a=>a.severity==="critical");
  const warning  = alerts.filter(a=>a.severity==="warning");
  const info     = alerts.filter(a=>a.severity==="info");

  const SeveritySection = ({ title, items, color, iconColor, icon:Icon }: { title:string; items:AlertItem[]; color:string; iconColor:string; icon:React.ElementType }) => (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={iconColor}/>
        <span className="font-semibold text-sm">{title}</span>
        <span className="ml-auto text-xs font-mono font-bold bg-white/30 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      {items.length===0 ? <p className="text-xs opacity-60">No alerts</p> : (
        <div className="space-y-2">
          {items.map((a,i)=>(
            <div key={i} className="flex items-start justify-between gap-2 text-xs p-2 rounded-lg bg-white/30">
              <div>
                <p className="font-semibold">{a.candidateName}</p>
                <p className="opacity-70 font-mono">{a.passportNo}</p>
                <p className="mt-0.5 opacity-80">{a.subject}</p>
              </div>
              {a.daysLeft!==null&&(
                <span className="font-mono font-bold flex-shrink-0">
                  {a.daysLeft<0?`${Math.abs(a.daysLeft)}d ago`:`${a.daysLeft}d`}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Pipeline alerts and pending actions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
          <Bell size={16}/>
          <span className="font-bold text-sm">{alerts.length} total alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SeveritySection title="Critical (< 30 days / expired)" items={critical} color="border-red-200 bg-red-50 text-red-800"     iconColor="text-red-600"    icon={AlertTriangle} />
        <SeveritySection title="Warning (30–90 days)"           items={warning}  color="border-amber-200 bg-amber-50 text-amber-800" iconColor="text-amber-600"  icon={Clock}         />
        <SeveritySection title="Info (Pending items)"           items={info}     color="border-blue-200 bg-blue-50 text-blue-800"    iconColor="text-blue-600"   icon={CheckCircle}   />
      </div>
    </div>
  );
};

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV: { group:string; items:{ id:Page; label:string; icon:React.ElementType }[] }[] = [
  { group:"Records", items:[
    { id:"dashboard",     label:"Dashboard",        icon:LayoutDashboard },
    { id:"candidate",     label:"Candidates",       icon:Users           },
    { id:"medical",       label:"Medical",          icon:Stethoscope     },
    { id:"mofa",          label:"MOFA",             icon:FileText        },
    { id:"visa",          label:"Visa",             icon:Globe           },
    { id:"takamul",       label:"Takamul",          icon:Award           },
    { id:"police",        label:"Police Clearance", icon:Shield          },
    { id:"fingerprint",   label:"Fingerprint",      icon:Fingerprint     },
  ]},
  { group:"Operations", items:[
    { id:"manpower",  label:"Manpower",         icon:Briefcase       },
    { id:"flight",    label:"Flight",           icon:Plane           },
    { id:"passport",  label:"Passport",         icon:MapPin          },
  ]},
  { group:"Masters", items:[
    { id:"agents",    label:"Agents",           icon:UserCheck       },
    { id:"agencies",  label:"Agencies",         icon:Building        },
  ]},
  { group:"Admin", items:[
    { id:"notifications", label:"Notifications",    icon:Bell            },
    { id:"reports",       label:"Reports",          icon:FileBarChart    },
    { id:"user",          label:"Users",            icon:UserCheck       },
    { id:"setting",       label:"Settings",         icon:Settings        },
  ]},
];

const PAGE_LABELS: Record<Page,string> = {
  dashboard:"Dashboard", candidate:"Candidates", medical:"Medical", mofa:"MOFA", visa:"Visa",
  takamul:"Takamul", manpower:"Manpower Orders", flight:"Flight Bookings",
  passport:"Passport Tracking", reports:"Reports", user:"Users", setting:"Settings",
  agents:"Agents", agencies:"Agencies", police:"Police Clearance", fingerprint:"Fingerprint",
  notifications:"Notifications",
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed]   = useState(false);
  const [page,   setPage]     = useState<Page>("dashboard");
  const [sideOpen, setSideOpen] = useState(false);

  // Shared state (mock DB)
  const [candidates, setCandidates] = useState<Candidate[]>(INIT_CANDIDATES);
  const [medicals,   setMedicals]   = useState<Medical[]>(INIT_MEDICALS);
  const [mofas,      setMofas]      = useState<Mofa[]>(INIT_MOFAS);
  const [visas,      setVisas]      = useState<Visa[]>(INIT_VISAS);
  const [takamul,    setTakamul]    = useState<Takamul[]>(INIT_TAKAMUL);
  const [passports,  setPassports]  = useState<PassportTracking[]>(INIT_PASSPORT);
  const [agentsFull, setAgentsFull] = useState<AgentFull[]>(INIT_AGENTS_FULL);
  const [agenciesFull, setAgenciesFull] = useState<AgencyFull[]>(INIT_AGENCIES_FULL);
  const [police,     setPolice]     = useState<PoliceClearance[]>(INIT_POLICE);
  const [fingers,    setFingers]    = useState<Fingerprint[]>(INIT_FINGERS);

  // Count pipeline alerts for sidebar badge
  const alertCount = useMemo(() => {
    const medExp = medicals.filter(m => { if(!m.fit_date||m.status!=="Fit") return false; return (daysUntil(addDays(m.fit_date,90))??999)<90; }).length;
    const visaExp = visas.filter(v => (daysUntil(v.expiry_date)??999)<90).length;
    const policePending = police.filter(p=>p.status==="Pending").length;
    const fingerPending = fingers.filter(f=>f.status==="Pending").length;
    return medExp + visaExp + policePending + fingerPending;
  }, [medicals, visas, police, fingers]);

  if (!authed) return <AuthPage onLogin={() => setAuthed(true)} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage candidates={candidates} medicals={medicals} visas={visas} mofas={mofas} />;
      case "candidate": return <CandidatesPage candidates={candidates} setCandidates={setCandidates} />;
      case "medical":   return <MedicalPage candidates={candidates} medicals={medicals} setMedicals={setMedicals} />;
      case "mofa":      return <MofaPage candidates={candidates} mofas={mofas} setMofas={setMofas} />;
      case "visa":      return <VisaPage candidates={candidates} visas={visas} setVisas={setVisas} />;
      case "takamul":   return <TakamulPage candidates={candidates} takamul={takamul} setTakamul={setTakamul} />;
      case "passport":  return <PassportPage candidates={candidates} passports={passports} setPassports={setPassports} />;
      case "manpower":  return <ManpowerPage />;
      case "flight":    return <FlightPage />;
      case "reports":       return <ReportsPage candidates={candidates} medicals={medicals} visas={visas} mofas={mofas} takamul={takamul} />;
      case "user":          return <UsersPage />;
      case "setting":       return <SettingsPage />;
      case "agents":        return <AgentsPage agents={agentsFull} setAgents={setAgentsFull} />;
      case "agencies":      return <AgenciesPage agencies={agenciesFull} setAgencies={setAgenciesFull} />;
      case "police":        return <PoliceClearancePage candidates={candidates} police={police} setPolice={setPolice} />;
      case "fingerprint":   return <FingerprintPage candidates={candidates} fingers={fingers} setFingers={setFingers} />;
      case "notifications": return <NotificationsPage candidates={candidates} medicals={medicals} visas={visas} police={police} fingers={fingers} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{fontFamily:"'Inter',sans-serif"}}>
      {sideOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={()=>setSideOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-56 flex flex-col bg-[#0f172a] transition-transform duration-200 ${sideOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"><Briefcase size={14} className="text-white" /></div>
          <div className="min-w-0"><p className="text-sm font-bold text-white truncate">ManpowerERP</p><p className="text-[10px] text-white/40 font-mono">v2.5.0</p></div>
          <button className="ml-auto lg:hidden text-white/60 hover:text-white" onClick={()=>setSideOpen(false)}><X size={15}/></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
          {NAV.map(group => (
            <div key={group.group}>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest px-2 pb-1">{group.group}</p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={()=>{ setPage(id); setSideOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all mb-0.5 ${page===id ? "bg-primary text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/8"}`}>
                  <Icon size={13} className="flex-shrink-0" />
                  <span>{label}</span>
                  {id === "dashboard" && alertCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{alertCount}</span>
                  )}
                  {page === id && alertCount === 0 && <ChevronRight size={11} className="ml-auto opacity-50" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Agent info */}
        <div className="px-2 pb-3 border-t border-white/10 pt-3">
          <div className="px-2 mb-2">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1.5">Logged in as</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">TM</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Tariq Mahmoud</p>
                <p className="text-[10px] text-white/40 font-mono">Agent · TM-001</p>
              </div>
            </div>
          </div>
          <button onClick={()=>setAuthed(false)} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/8 transition-colors">
            <LogOut size={12}/> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={()=>setSideOpen(true)}><Menu size={18}/></button>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">{PAGE_LABELS[page]}</h1>
            <p className="text-[10px] text-muted-foreground font-mono">{new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-background text-xs text-muted-foreground w-44">
              <Search size={12}/><input placeholder="Quick search…" className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-xs w-full" />
            </div>
            <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Bell size={16} className="text-muted-foreground"/>
              {alertCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"/>}
            </button>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold cursor-pointer">TM</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
