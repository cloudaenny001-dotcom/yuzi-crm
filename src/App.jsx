import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import {
  LayoutDashboard, Users, Briefcase, KanbanSquare, CalendarDays,
  CheckCircle2, UsersRound, BarChart3, Plus, X, AlertTriangle,
  ChevronDown, Search, Paperclip, MessageSquare, ArrowRight, Flame,
  ThumbsUp, ThumbsDown, RotateCcw, Building2, Plane, Check, LogOut,
  Sparkles, Bell, ArrowUpRight
} from "lucide-react";

/* ---------------------------------------------------------
   Yuzi Marketing Media — CRM (Supabase-connected version)
--------------------------------------------------------- */
const C = {
  ink: "#161A24", inkSoft: "#232838", paper: "#F5F3ED", card: "#FFFFFF",
  line: "#E4E0D5", amber: "#D99A3D", amberSoft: "#F3E3C6", teal: "#2F7D6B",
  tealSoft: "#DCEDE8", red: "#C1483C", redSoft: "#F5DEDB", slate: "#6B7280", slateSoft: "#EDECE7",
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`;
const APP_STYLES = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #f2f3f8; }
  button, input, select, textarea { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
  button:not(:disabled):hover { transform: translateY(-1px); }
  .agency-shell { min-height: 100vh; background: radial-gradient(circle at 87% 8%, rgba(211, 120, 255, .16), transparent 21rem), radial-gradient(circle at 56% 84%, rgba(73, 199, 179, .15), transparent 25rem), #f4f5fa; }
  .agency-sidebar { position: sticky; top: 0; height: 100vh; background: linear-gradient(160deg, #111525 0%, #1c1533 52%, #0e2330 100%); box-shadow: 14px 0 42px rgba(18, 20, 35, .15); overflow-y: auto; }
  .agency-brand-mark { box-shadow: 0 8px 24px rgba(255, 184, 77, .32); }
  .agency-nav button { position: relative; overflow: hidden; }
  .agency-nav button:before { content: ""; position: absolute; left: 0; width: 3px; height: 18px; border-radius: 0 8px 8px 0; background: #ffbd5e; opacity: 0; transition: opacity .2s ease; }
  .agency-nav button:hover:before, .agency-nav button[data-active="true"]:before { opacity: 1; }
  .agency-content { width: 100%; max-width: 1360px; padding: 24px 34px 46px; }
  .agency-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
  .agency-topbar-title { font: 800 12px Sora, sans-serif; color: #7b8095; letter-spacing: .12em; text-transform: uppercase; }
  .live-status { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.72); border: 1px solid rgba(226,228,238,.9); box-shadow: 0 7px 20px rgba(49,54,81,.06); border-radius: 999px; padding: 8px 12px; color: #5e6377; font-size: 12px; font-weight: 700; }
  .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #35c49a; box-shadow: 0 0 0 4px rgba(53,196,154,.13); animation: pulse 2s infinite; }
  .crm-card { box-shadow: 0 10px 30px rgba(53, 57, 82, .055); transition: transform .22s ease, box-shadow .22s ease; }
  .crm-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px rgba(53, 57, 82, .1); }
  .dashboard-hero { position: relative; overflow: hidden; color: #fff; padding: 29px 30px; border-radius: 22px; margin-bottom: 22px; background: linear-gradient(115deg, #171a31 0%, #302258 53%, #126c70 135%); box-shadow: 0 20px 45px rgba(36, 29, 78, .22); animation: enter .5s ease both; }
  .dashboard-hero:after { content: ""; position: absolute; width: 230px; height: 230px; border-radius: 50%; right: -52px; top: -95px; background: radial-gradient(circle, rgba(255,194,104,.72) 0 4%, rgba(255,194,104,.16) 5% 42%, transparent 43%); }
  .dashboard-hero:before { content: ""; position: absolute; width: 155px; height: 155px; border-radius: 30px; right: 105px; bottom: -95px; border: 1px solid rgba(255,255,255,.24); transform: rotate(28deg); }
  .hero-grid { display: flex; gap: 22px; align-items: end; justify-content: space-between; position: relative; z-index: 1; }
  .hero-eyebrow { display: flex; gap: 7px; align-items: center; color: #ffc469; font-size: 11px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
  .hero-title { margin: 7px 0 6px; font: 800 clamp(25px, 3.2vw, 38px)/1.08 Sora, sans-serif; letter-spacing: -.05em; }
  .hero-copy { max-width: 500px; color: #c9c8de; font-size: 13.5px; line-height: 1.55; }
  .hero-chip { padding: 12px 15px; white-space: nowrap; border-radius: 13px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(8px); color: #fff; font-size: 12px; font-weight: 700; }
  .hero-chip b { color: #ffca74; font: 800 21px Sora, sans-serif; margin-right: 5px; }
  @keyframes enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 50% { transform: scale(.72); opacity: .65; } }
  @media (max-width: 760px) { .agency-shell { display: block !important; } .agency-sidebar { position: relative; height: auto; width: 100% !important; min-height: auto !important; } .agency-nav { flex-direction: row !important; overflow-x: auto; padding-bottom: 4px; } .agency-nav button { flex: 0 0 auto; } .agency-profile { display: none; } .agency-content { padding: 18px 16px 32px !important; } .hero-grid { align-items: flex-start; flex-direction: column; } .agency-topbar { margin-bottom: 16px; } }
`;
const AUTH_STYLES = `
  .auth-page { position: relative; min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(370px, .8fr); overflow: hidden; background: #111428; color: #fff; }
  .auth-page:before, .auth-page:after { content: ""; position: absolute; border-radius: 50%; filter: blur(2px); pointer-events: none; }
  .auth-page:before { width: 35rem; height: 35rem; top: -18rem; left: -12rem; background: radial-gradient(circle, rgba(251, 165, 75, .38), rgba(251, 165, 75, 0) 68%); animation: drift 10s ease-in-out infinite alternate; }
  .auth-page:after { width: 42rem; height: 42rem; bottom: -26rem; right: 20%; background: radial-gradient(circle, rgba(91, 111, 255, .38), rgba(91, 111, 255, 0) 67%); animation: drift 12s ease-in-out infinite alternate-reverse; }
  .auth-showcase { position: relative; z-index: 1; padding: clamp(32px, 5vw, 74px); display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid rgba(255,255,255,.1); }
  .auth-brand { display: inline-flex; align-items: center; gap: 11px; font: 800 18px Sora, sans-serif; letter-spacing: -.04em; }
  .auth-brand-logo { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; color: #171526; background: linear-gradient(135deg, #ffe084, #f59253); box-shadow: 0 12px 30px rgba(246, 159, 78, .28); }
  .auth-kicker { display: inline-flex; align-items: center; gap: 7px; color: #ffcb7b; font-size: 11px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
  .auth-headline { margin: 16px 0; max-width: 620px; font: 800 clamp(42px, 5.3vw, 74px)/.99 Sora, sans-serif; letter-spacing: -.075em; }
  .auth-headline .gradient-text { background: linear-gradient(95deg, #fff 15%, #d5ccff 45%, #ffca7e 96%); background-clip: text; -webkit-background-clip: text; color: transparent; }
  .auth-copy { max-width: 480px; color: #b5b8cb; font-size: 15px; line-height: 1.65; }
  .auth-orbit { position: absolute; right: 7%; bottom: 11%; width: clamp(185px, 23vw, 310px); aspect-ratio: 1; border: 1px solid rgba(255,255,255,.13); border-radius: 50%; animation: spin 24s linear infinite; }
  .auth-orbit:before, .auth-orbit:after { content: ""; position: absolute; border-radius: 50%; }
  .auth-orbit:before { width: 17px; height: 17px; top: 17%; left: 7%; background: #ffc467; box-shadow: 0 0 0 8px rgba(255,196,103,.12); }
  .auth-orbit:after { width: 9px; height: 9px; bottom: 11%; right: 7%; background: #9d91ff; box-shadow: 0 0 0 7px rgba(157,145,255,.14); }
  .auth-proof { display: flex; align-items: center; gap: 10px; color: #9296af; font-size: 12px; font-weight: 600; }
  .proof-line { width: 40px; height: 1px; background: #ffbf67; }
  .auth-panel { position: relative; z-index: 2; display: grid; place-items: center; padding: 26px; background: linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.035)); backdrop-filter: blur(18px); }
  .auth-card { width: min(100%, 400px); padding: 33px; border: 1px solid rgba(255,255,255,.17); border-radius: 26px; background: rgba(24,27,51,.67); box-shadow: 0 28px 70px rgba(0,0,0,.31); animation: auth-in .65s cubic-bezier(.2,.8,.2,1) both; }
  .auth-card-title { margin: 13px 0 7px; font: 800 25px Sora, sans-serif; letter-spacing: -.05em; }
  .auth-field-label { display: block; color: #b4b7cc; font-size: 11.5px; font-weight: 700; margin: 16px 0 6px; }
  .auth-input { width: 100%; color: #fff; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.13); padding: 12px 13px; border-radius: 11px; outline: none; font: 13.5px Inter, sans-serif; }
  .auth-input:focus { border-color: #ffc56c; box-shadow: 0 0 0 4px rgba(255,197,108,.12); }
  .auth-input::placeholder { color: #8589a1; }
  .auth-submit { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 22px; padding: 12px; border: 0; border-radius: 11px; color: #282033; cursor: pointer; font: 800 13px Inter, sans-serif; background: linear-gradient(100deg, #ffd16d, #ee935d); box-shadow: 0 12px 25px rgba(235,147,75,.24); }
  .auth-submit:hover { box-shadow: 0 16px 32px rgba(235,147,75,.38); }
  .auth-switch { width: 100%; border: 0; background: transparent; color: #bdbfd0; cursor: pointer; padding: 16px 0 0; font: 600 12.5px Inter, sans-serif; }
  .auth-switch span { color: #ffca72; }
  .auth-secure { margin-top: 23px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.1); color: #8186a1; font-size: 11px; text-align: center; }
  @keyframes drift { to { transform: translate(55px, 35px) scale(1.1); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes auth-in { from { opacity: 0; transform: translateY(25px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @media (max-width: 820px) { .auth-page { grid-template-columns: 1fr; } .auth-showcase { min-height: 315px; padding: 28px; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.1); } .auth-headline { max-width: 460px; font-size: clamp(37px, 10vw, 55px); } .auth-orbit { right: -40px; bottom: -55px; } .auth-proof { display: none; } .auth-panel { padding: 28px 16px; } }
`;

const STAGES = ["New", "Meeting", "Proposal", "Negotiation", "Won", "Lost"];
const CONTENT_STAGES = ["Idea", "Script", "Approval", "Shoot", "Editing", "QC", "Client Review", "Revision", "Final Approval", "Publish"];
const CONTENT_TYPES = ["Reel", "Post", "Carousel", "Story", "Ad", "Video", "Other"];
const LEAVE_TYPES = ["Casual", "Sick", "Paid", "Unpaid"];
const ROLES = ["Owner", "Management", "Employee", "Client"];

function normaliseRole(role) {
  const matchedRole = ROLES.find(item => item.toLowerCase() === String(role || "").trim().toLowerCase());
  return matchedRole || "Employee";
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function daysUntil(dateStr) { return Math.round((new Date(dateStr) - new Date(todayStr())) / 86400000); }
function isOverdue(t) { return daysUntil(t.due) < 0 && t.status !== "Done"; }
function overlapsToday(l) { return l.status === "Approved" && new Date(todayStr()) >= new Date(l.from_date) && new Date(todayStr()) <= new Date(l.to_date); }

/* ============================================================
   AUTH GATE — sabse pehle ye check karta hai user login hai ya nahi
============================================================ */
export default function Root() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setSession(data?.session || null);
      if (error) setProfileError("Your login session could not be read. Please log in again.");
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setProfileError("");
      setLoading(false);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    if (!session) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        setProfile(data ? { ...data, role: normaliseRole(data.role) } : null);
        setProfileError(error ? "Your account details could not be loaded. Please try again." : "");
        setLoading(false);
      });
    return () => { active = false; };
  }, [session]);

  if (loading) return <div style={{ padding: 40, fontFamily: "Inter" }}>Loading...</div>;
  if (!session) return <Login />;
  if (!profile) return <AccountSetup error={profileError} />;

  return <App profile={profile} />;
}

function AccountSetup({ error }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: C.paper, padding: 24, fontFamily: "Inter, sans-serif" }}>
      <style>{FONT}</style>
      <Card style={{ width: "min(440px, 100%)", padding: 26 }}>
        <div style={{ fontFamily: "Sora", fontSize: 19, fontWeight: 700, marginBottom: 8 }}>Account setup is incomplete</div>
        <div style={{ color: C.slate, fontSize: 13.5, lineHeight: 1.55 }}>
          {error || "Your login worked, but this user does not yet have a CRM profile."} Ask the admin to add your row in the <b>profiles</b> table and assign a role, then refresh.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button style={btnAmber} onClick={() => window.location.reload()}>Refresh</button>
          <button style={btnGhost} onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </Card>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err?.message || "Login failed. Please check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <style>{FONT}{AUTH_STYLES}</style>
      <section className="auth-showcase">
        <div className="auth-brand"><div className="auth-brand-logo">Y</div> Yuzi <span style={{ color: "#9194ac", fontWeight: 600 }}>Media</span></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="auth-kicker"><Sparkles size={14} fill="currentColor" /> Ideas into impact</div>
          <h1 className="auth-headline">Where brave brands <span className="gradient-text">become unforgettable.</span></h1>
          <p className="auth-copy">The creative command centre for Yuzi Marketing Media—built to make every campaign sharper, faster, and more extraordinary.</p>
        </div>
        <div className="auth-proof"><span className="proof-line" /> Strategy · Creativity · Momentum</div>
        <div className="auth-orbit" />
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-kicker"><Sparkles size={14} fill="currentColor" /> Studio access</div>
          <h2 className="auth-card-title">Welcome back.</h2>
          <div style={{ color: "#aeb1c5", fontSize: 13, lineHeight: 1.5 }}>Sign in to continue shaping great work.</div>
          <label className="auth-field-label" htmlFor="login-email">Email address</label>
          <input id="login-email" className="auth-input" required type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="auth-field-label" htmlFor="login-password">Password</label>
          <input id="login-password" className="auth-input" required type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div role="alert" style={{ color: "#ff9c95", fontSize: 12.5, marginTop: 13, lineHeight: 1.45 }}>{error}</div>}
          <button className="auth-submit" type="submit" disabled={submitting} style={{ opacity: submitting ? .7 : 1, cursor: submitting ? "wait" : "pointer" }}>
            {submitting ? "Opening your workspace..." : "Enter creative workspace"} {!submitting && <ArrowRight size={16} />}
          </button>
          <div className="auth-secure">Secure workspace access · Yuzi Marketing Media</div>
        </form>
      </section>
    </div>
  );
}

/* ============================================================
   MAIN APP — profile.role bataata hai kaunsa view dikhana hai
============================================================ */
function App({ profile }) {
  const role = normaliseRole(profile.role); // Owner | Management | Employee | Client
  const me = profile.employee_name;      // sirf Employee role ke liye
  const myClientId = profile.client_id;  // sirf Client role ke liye

  const [nav, setNav] = useState("Dashboard");
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showAddLead, setShowAddLead] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [filterClient, setFilterClient] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [employees, setEmployees] = useState([]);

  // ---- INITIAL LOAD + REALTIME SYNC ----
  useEffect(() => {
    fetchAll();
    const channel = supabase.channel("crm-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchLeads)
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, fetchClients)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .on("postgres_changes", { event: "*", schema: "public", table: "leaves" }, fetchLeaves)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchAll() { await Promise.all([fetchLeads(), fetchClients(), fetchTasks(), fetchLeaves(), fetchEmployees()]); }
  async function fetchLeads() { const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); setLeads(data || []); }
  async function fetchClients() { const { data } = await supabase.from("clients").select("*").order("created_at"); setClients(data || []); }
  async function fetchTasks() { const { data } = await supabase.from("tasks").select("*").order("due"); setTasks(data || []); }
  async function fetchLeaves() { const { data } = await supabase.from("leaves").select("*").order("created_at", { ascending: false }); setLeaves(data || []); }
  async function fetchEmployees() {
    const { data } = await supabase.from("profiles").select("employee_name").eq("role", "Employee").not("employee_name", "is", null);
    setEmployees((data || []).map(d => d.employee_name));
  }

  const navItemsByRole = {
    Owner: ["Dashboard", "Leads", "Clients", "Projects", "Content Calendar", "Approvals", "Team", "Leave", "Reports"],
    Management: ["Dashboard", "Leads", "Clients", "Projects", "Content Calendar", "Approvals", "Team", "Leave", "Reports"],
    Employee: ["Dashboard", "Projects", "Content Calendar", "Leave"],
    Client: ["Dashboard", "Content Calendar", "Approvals", "Files"],
  };
  const icons = {
    Dashboard: LayoutDashboard, Leads: KanbanSquare, Clients: Users, Projects: Briefcase,
    "Content Calendar": CalendarDays, Approvals: CheckCircle2, Team: UsersRound, Reports: BarChart3, Files: Paperclip, Leave: Plane,
  };

  const visibleTasks = useMemo(() => {
    if (role === "Employee") return tasks.filter(t => t.assignee === me);
    if (role === "Client") return tasks.filter(t => t.client_id === myClientId);
    return tasks;
  }, [role, tasks, me, myClientId]);

  const overdue = tasks.filter(isOverdue);
  const blocked = tasks.filter(t => t.status === "Blocked");
  const pendingApprovals = tasks.filter(t => t.content_stage === "Client Review");
  const wonLeadsThisMonth = leads.filter(l => l.stage === "Won").length;

  // ---- WRITE FUNCTIONS (all go straight to Supabase) ----
  async function updateTask(id, patch) { await supabase.from("tasks").update(patch).eq("id", id); }
  async function addLead(lead) { await supabase.from("leads").insert([lead]); }
  async function moveLeadStage(id, stage) { await supabase.from("leads").update({ stage }).eq("id", id); }
  async function convertLeadToClient(lead) {
    const { data: newClient } = await supabase.from("clients").insert([{
      name: lead.company, status: "Onboarding", account_manager: lead.salesperson,
      team: [lead.salesperson], services: ["Social Media"], monthly_value: lead.value, onboarding: 10,
    }]).select().single();
    await moveLeadStage(lead.id, "Won");
    return newClient;
  }
  async function addLeave(leave) { await supabase.from("leaves").insert([leave]); }
  async function updateLeaveStatus(id, status) { await supabase.from("leaves").update({ status }).eq("id", id); }

  return (
    <div className="agency-shell" style={{ fontFamily: "Inter, sans-serif", color: C.ink, display: "flex" }}>
      <style>{FONT}{APP_STYLES}</style>

      <div className="agency-sidebar" style={{ width: 254, color: "#fff", padding: "24px 16px", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 22px" }}>
          <div className="agency-brand-mark" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #FFC465, #E8843C)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 800, color: C.ink }}>Y</div>
          <div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, lineHeight: 1.1, letterSpacing: "-.03em" }}>Yuzi</div>
            <div style={{ fontSize: 10.5, color: "#ABAEC2", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>Creative Studio</div>
          </div>
        </div>

        <div className="agency-nav" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: "#858AA4", fontSize: 10, fontWeight: 800, letterSpacing: ".13em", padding: "0 12px 7px", textTransform: "uppercase" }}>Workspace</div>
          {navItemsByRole[role].map(item => {
            const Icon = icons[item];
            const active = nav === item;
            return (
              <button data-active={active} key={item} onClick={() => { setNav(item); setActiveClient(null); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: active ? "linear-gradient(100deg, rgba(255,255,255,.16), rgba(255,255,255,.07))" : "transparent", color: active ? "#fff" : "#B7BBC7", border: active ? "1px solid rgba(255,255,255,.09)" : "1px solid transparent", cursor: "pointer", fontSize: 13.5, fontWeight: 700, textAlign: "left" }}>
                <Icon size={16} strokeWidth={2} /> {item}
              </button>
            );
          })}
        </div>

        <div className="agency-profile" style={{ marginTop: "auto", padding: "16px 8px 0", borderTop: "1px solid rgba(255,255,255,.11)" }}>
          <div style={{ fontSize: 12, color: "#B7BBC7", fontWeight: 600 }}>{profile.full_name || "You"}</div>
          <div style={{ fontSize: 11.5, color: "#7E8494", marginBottom: 10 }}>{role}</div>
          <button onClick={() => supabase.auth.signOut()} style={{ ...btnGhost, width: "100%", justifyContent: "center", background: "rgba(255,255,255,.09)", color: "#fff" }}>
            <LogOut size={13} /> Log out
          </button>
        </div>
      </div>

      <div className="agency-content">
        <div className="agency-topbar">
          <div className="agency-topbar-title">Yuzi / {nav}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button aria-label="Notifications" style={{ border: "1px solid #e3e5ee", background: "rgba(255,255,255,.72)", color: C.ink, width: 34, height: 34, borderRadius: 11, display: "grid", placeItems: "center", cursor: "pointer" }}><Bell size={15} /></button>
            <div className="live-status"><span className="live-dot" /> Live workspace</div>
          </div>
        </div>
        {nav === "Dashboard" && <DashboardView role={role} clients={clients} tasks={visibleTasks} leads={leads} overdue={overdue} blocked={blocked} pendingApprovals={pendingApprovals} wonLeadsThisMonth={wonLeadsThisMonth} me={me} />}
        {nav === "Leads" && <LeadsView leads={leads} setShowAddLead={setShowAddLead} moveLeadStage={moveLeadStage} convertLeadToClient={convertLeadToClient} />}
        {nav === "Clients" && !activeClient && <ClientsView clients={clients} tasks={tasks} onOpen={setActiveClient} />}
        {nav === "Clients" && activeClient && <ClientProfile client={activeClient} tasks={tasks.filter(t => t.client_id === activeClient.id)} onBack={() => setActiveClient(null)} />}
        {nav === "Projects" && <ProjectsView tasks={visibleTasks} clients={clients} updateTask={updateTask} role={role} filterClient={filterClient} setFilterClient={setFilterClient} filterEmployee={filterEmployee} setFilterEmployee={setFilterEmployee} employees={employees} />}
        {nav === "Content Calendar" && <CalendarView tasks={visibleTasks} clients={clients} />}
        {nav === "Approvals" && <ApprovalsView tasks={role === "Client" ? tasks.filter(t => t.client_id === myClientId && t.content_stage === "Client Review") : pendingApprovals} clients={clients} updateTask={updateTask} role={role} />}
        {nav === "Team" && <TeamView tasks={tasks} leaves={leaves} employees={employees} />}
        {nav === "Leave" && <LeaveView role={role} me={me} leaves={leaves} addLeave={addLeave} updateLeaveStatus={updateLeaveStatus} employees={employees} />}
        {nav === "Reports" && <ReportsView leads={leads} tasks={tasks} clients={clients} />}
        {nav === "Files" && <FilesView client={clients.find(c => c.id === myClientId)} />}
      </div>

      {showAddLead && <AddLeadModal employees={employees} onClose={() => setShowAddLead(false)} onAdd={l => { addLead(l); setShowAddLead(false); }} />}
    </div>
  );
}

/* ================= everything below is UI-only (unchanged from the demo) ================= */

function Pill({ children, tone = "slate" }) {
  const tones = { slate: { bg: C.slateSoft, fg: C.slate }, amber: { bg: C.amberSoft, fg: "#8A5A16" }, teal: { bg: C.tealSoft, fg: C.teal }, red: { bg: C.redSoft, fg: C.red } };
  const t = tones[tone];
  return <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>;
}
function Card({ children, style, className = "", ...rest }) { return <div className={`crm-card ${className}`} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, ...style }} {...rest}>{children}</div>; }
function StatCard({ label, value, sub, tone }) {
  return (
    <Card style={{ padding: "18px 20px", flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 13, color: C.slate, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "Sora", fontSize: 30, fontWeight: 700, color: C.ink, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, color: tone === "red" ? C.red : C.slate, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </Card>
  );
}
function SectionTitle({ children, action }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <h2 style={{ fontFamily: "Sora", fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>{children}</h2>{action}
  </div>;
}
function EmptyNote({ text }) { return <div style={{ color: C.slate, fontSize: 13, padding: "10px 0" }}>{text}</div>; }
function Row({ label, children }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13.5, borderTop: `1px solid ${C.line}` }}>
    <span style={{ color: C.slate }}>{label}</span><span style={{ fontWeight: 600 }}>{children}</span>
  </div>;
}
function TaskRow({ t, hideAssignee }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${C.line}`, fontSize: 13.5 }}>
      <div><div style={{ fontWeight: 600 }}>{t.title}</div>
        <div style={{ color: C.slate, fontSize: 12, marginTop: 2 }}>{t.type} · {t.content_stage}{!hideAssignee ? ` · ${t.assignee}` : ""}</div></div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {isOverdue(t) && <Pill tone="red">Overdue</Pill>}
        <Pill tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "slate"}>{t.priority}</Pill>
      </div>
    </div>
  );
}

function DashboardView({ role, clients, tasks, leads, overdue, blocked, pendingApprovals, wonLeadsThisMonth, me }) {
  const greetings = { Owner: "Agency overview", Management: "Today across the agency", Employee: `Hey ${me}, here's your day`, Client: "Your content, at a glance" };
  return (
    <div>
      <div className="dashboard-hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow"><Sparkles size={14} fill="currentColor" /> Creative operations</div>
            <div className="hero-title">{role === "Owner" ? "Make every campaign matter." : greetings[role]}</div>
            <div className="hero-copy">One elegant command centre for bold ideas, smooth delivery, and client work that gets remembered.</div>
          </div>
          <div className="hero-chip"><b>{tasks.filter(t => t.status !== "Done").length}</b> active moves <ArrowUpRight size={15} style={{ verticalAlign: "middle", marginLeft: 4 }} /></div>
        </div>
      </div>
      <SectionTitle>{greetings[role]}</SectionTitle>
      {(role === "Owner" || role === "Management") && (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            <StatCard label="Active clients" value={clients.filter(c => c.status !== "Onboarding").length} />
            <StatCard label="Leads in pipeline" value={leads.filter(l => !["Won", "Lost"].includes(l.stage)).length} />
            <StatCard label="Overdue tasks" value={overdue.length} sub={overdue.length ? "Needs attention" : "All on track"} tone={overdue.length ? "red" : "teal"} />
            <StatCard label="Pending approvals" value={pendingApprovals.length} />
            <StatCard label="Blocked work" value={blocked.length} tone={blocked.length ? "red" : "teal"} />
          </div>
          {blocked.length > 0 && (
            <Card style={{ padding: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><AlertTriangle size={16} color={C.red} /><div style={{ fontWeight: 700, fontSize: 14.5 }}>At-risk work — needs a decision</div></div>
              {blocked.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 13.5 }}>
                  <span><b>{t.title}</b> · {clients.find(c => c.id === t.client_id)?.name}</span><Pill tone="red">{t.delay_reason || "Blocked"}</Pill>
                </div>
              ))}
            </Card>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
            <Card style={{ padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14.5 }}>Sales pipeline snapshot</div>
              {STAGES.map(s => {
                const count = leads.filter(l => l.stage === s).length;
                return <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 90, fontSize: 12.5, color: C.slate, fontWeight: 600 }}>{s}</div>
                  <div style={{ flex: 1, height: 8, background: C.slateSoft, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, count * 22)}%`, height: "100%", background: s === "Won" ? C.teal : s === "Lost" ? C.slate : C.amber }} />
                  </div><div style={{ width: 18, fontSize: 12.5, fontWeight: 700 }}>{count}</div>
                </div>;
              })}
              <div style={{ fontSize: 12.5, color: C.slate, marginTop: 8 }}>{wonLeadsThisMonth} lead(s) converted to clients this cycle.</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14.5 }}>Client health</div>
              {clients.map(c => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: `1px solid ${C.line}`, fontSize: 13.5 }}>
                <span>{c.name}</span><Pill tone={c.status === "Active" ? "teal" : c.status === "At Risk" ? "red" : "amber"}>{c.status}</Pill>
              </div>)}
            </Card>
          </div>
        </>
      )}
      {role === "Employee" && (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <StatCard label="Your tasks" value={tasks.length} />
            <StatCard label="Due this week" value={tasks.filter(t => daysUntil(t.due) <= 7 && daysUntil(t.due) >= 0).length} />
            <StatCard label="Overdue" value={tasks.filter(isOverdue).length} tone="red" />
          </div>
          <Card style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14.5 }}>Today &amp; priorities</div>
            {[...tasks].sort((a, b) => daysUntil(a.due) - daysUntil(b.due)).map(t => <TaskRow key={t.id} t={t} />)}
            {tasks.length === 0 && <EmptyNote text="Nothing assigned yet — check back soon." />}
          </Card>
        </>
      )}
      {role === "Client" && (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <StatCard label="Pending your approval" value={pendingApprovals.length} />
            <StatCard label="In production" value={tasks.filter(t => !["Publish", "Final Approval"].includes(t.content_stage)).length} />
            <StatCard label="Published this month" value={tasks.filter(t => t.content_stage === "Publish").length} />
          </div>
          <Card style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14.5 }}>Upcoming for you</div>
            {tasks.map(t => <TaskRow key={t.id} t={t} hideAssignee />)}
            {tasks.length === 0 && <EmptyNote text="No content scheduled yet." />}
          </Card>
        </>
      )}
    </div>
  );
}

function LeadsView({ leads, setShowAddLead, moveLeadStage, convertLeadToClient }) {
  return (
    <div>
      <SectionTitle action={<button onClick={() => setShowAddLead(true)} style={btnAmber}><Plus size={15} /> Add lead</button>}>Sales pipeline</SectionTitle>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {STAGES.map(stage => (
          <div key={stage} style={{ minWidth: 220, flexShrink: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.slate, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>{stage}</span><span>{leads.filter(l => l.stage === stage).length}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leads.filter(l => l.stage === stage).map(l => (
                <Card key={l.id} style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{l.company}</div>
                  <div style={{ fontSize: 12, color: C.slate, marginBottom: 6 }}>{l.name} · {l.source}</div>
                  <div style={{ fontSize: 12.5, marginBottom: 6 }}>₹{Number(l.value).toLocaleString("en-IN")} · {l.salesperson}</div>
                  <div style={{ fontSize: 11.5, color: C.slate, marginBottom: 8 }}>{l.notes}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {stage !== "Won" && stage !== "Lost" && (<>
                      {STAGES.indexOf(stage) < 3 && <button onClick={() => moveLeadStage(l.id, STAGES[STAGES.indexOf(stage) + 1])} style={btnGhost}>Advance <ArrowRight size={12} /></button>}
                      {stage === "Negotiation" && <button onClick={() => convertLeadToClient(l)} style={btnTeal}>Convert to client</button>}
                      <button onClick={() => moveLeadStage(l.id, "Lost")} style={btnGhostRed}>Mark lost</button>
                    </>)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onAdd, employees }) {
  const [form, setForm] = useState({ name: "", company: "", source: "Instagram DM", salesperson: employees[0] || "", value: "", notes: "" });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <Card style={{ width: 420, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 17 }}>Add a lead</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <input placeholder="Contact name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={input} />
        <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={input} />
        <input placeholder="Deal value (₹)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} style={input} />
        <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={input}>
          {["Instagram DM", "Referral", "Website", "Cold Call", "Other"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={form.salesperson} onChange={e => setForm({ ...form, salesperson: e.target.value })} style={input}>
          {employees.map(s => <option key={s}>{s}</option>)}
        </select>
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...input, height: 60 }} />
        <button style={{ ...btnAmber, width: "100%", justifyContent: "center", marginTop: 6 }}
          onClick={() => form.name && form.company && onAdd({ ...form, value: Number(form.value) || 0, stage: "New", last_contact: todayStr() })}>
          Add lead
        </button>
      </Card>
    </div>
  );
}

function ClientsView({ clients, tasks, onOpen }) {
  return (
    <div>
      <SectionTitle>Clients</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {clients.map(c => {
          const cTasks = tasks.filter(t => t.client_id === c.id);
          const overdueCount = cTasks.filter(isOverdue).length;
          return (
            <Card key={c.id} style={{ padding: 18, cursor: "pointer" }} onClick={() => onOpen(c)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15.5 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: C.slate, marginTop: 3 }}>{(c.services || []).join(" · ")}</div></div>
                <Pill tone={c.status === "Active" ? "teal" : c.status === "At Risk" ? "red" : "amber"}>{c.status}</Pill>
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 12.5, color: C.slate }}>
                <div><b style={{ color: C.ink }}>{c.account_manager}</b> · manager</div>
                <div><b style={{ color: C.ink }}>{cTasks.length}</b> tasks</div>
                <div><b style={{ color: overdueCount ? C.red : C.ink }}>{overdueCount}</b> overdue</div>
              </div>
              {c.status === "Onboarding" && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ height: 6, background: C.slateSoft, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${c.onboarding}%`, height: "100%", background: C.amber }} /></div>
                  <div style={{ fontSize: 11.5, color: C.slate, marginTop: 4 }}>Onboarding {c.onboarding}%</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ClientProfile({ client, tasks, onBack }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Projects", "Content Calendar", "Files", "Notes"];
  return (
    <div>
      <button onClick={onBack} style={{ ...btnGhost, marginBottom: 14 }}>← Back to clients</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: C.amberSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={20} color="#8A5A16" /></div>
        <div><div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 19 }}>{client.name}</div>
          <div style={{ fontSize: 12.5, color: C.slate }}>{(client.services || []).join(" · ")} · Manager: {client.account_manager}</div></div>
      </div>
      <div style={{ display: "flex", gap: 4, margin: "18px 0", borderBottom: `1px solid ${C.line}` }}>
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} style={{ border: "none", background: "none", cursor: "pointer", padding: "8px 4px", marginRight: 18, fontWeight: 600, fontSize: 13.5, color: tab === t ? C.ink : C.slate, borderBottom: tab === t ? `2px solid ${C.amber}` : "2px solid transparent" }}>{t}</button>)}
      </div>
      {tab === "Overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ padding: 16 }}><div style={{ fontWeight: 700, marginBottom: 8 }}>Details</div>
            <Row label="Status"><Pill tone={client.status === "Active" ? "teal" : "amber"}>{client.status}</Pill></Row>
            <Row label="Monthly value">₹{Number(client.monthly_value).toLocaleString("en-IN")}</Row>
            <Row label="Team">{(client.team || []).join(", ")}</Row></Card>
          <Card style={{ padding: 16 }}><div style={{ fontWeight: 700, marginBottom: 8 }}>Work summary</div>
            <Row label="Active tasks">{tasks.length}</Row>
            <Row label="Overdue">{tasks.filter(isOverdue).length}</Row>
            <Row label="Pending client review">{tasks.filter(t => t.content_stage === "Client Review").length}</Row></Card>
        </div>
      )}
      {tab === "Projects" && <Card style={{ padding: 16 }}>{tasks.map(t => <TaskRow key={t.id} t={t} />)}{tasks.length === 0 && <EmptyNote text="No tasks for this client yet." />}</Card>}
      {tab === "Content Calendar" && <Card style={{ padding: 16 }}>{tasks.map(t => <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 13.5 }}><span>{t.title}</span><span style={{ color: C.slate }}>{t.due}</span></div>)}</Card>}
      {tab === "Files" && <FilesView client={client} />}
      {tab === "Notes" && <Card style={{ padding: 16, fontSize: 13.5, color: C.slate }}>No notes added yet.</Card>}
    </div>
  );
}

function ProjectsView({ tasks, clients, updateTask, role, filterClient, setFilterClient, filterEmployee, setFilterEmployee, employees }) {
  const filtered = tasks.filter(t => (filterClient === "all" || t.client_id === filterClient) && (filterEmployee === "all" || t.assignee === filterEmployee));
  const canEdit = role !== "Client";
  return (
    <div>
      <SectionTitle>Projects &amp; tasks</SectionTitle>
      {role !== "Employee" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={{ ...input, width: 180, marginBottom: 0 }}>
            <option value="all">All clients</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} style={{ ...input, width: 180, marginBottom: 0 }}>
            <option value="all">All employees</option>{employees.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
      )}
      <Card style={{ padding: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "10px 14px", fontSize: 11.5, fontWeight: 700, color: C.slate, borderBottom: `1px solid ${C.line}` }}>
          <span>TASK</span><span>CLIENT</span><span>STAGE</span><span>ASSIGNEE</span><span>DUE</span><span>STATUS</span></div>
        {filtered.map(t => (
          <div key={t.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "11px 14px", fontSize: 13, borderBottom: `1px solid ${C.line}`, alignItems: "center" }}>
            <div><div style={{ fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: 11.5, color: C.slate }}>{t.type} {t.delay_reason && <span style={{ color: C.red }}>· {t.delay_reason}</span>}</div></div>
            <span>{clients.find(c => c.id === t.client_id)?.name}</span>
            {canEdit ? <select value={t.content_stage} onChange={e => updateTask(t.id, { content_stage: e.target.value })} style={miniSelect}>{CONTENT_STAGES.map(s => <option key={s}>{s}</option>)}</select> : <span>{t.content_stage}</span>}
            <span>{t.assignee}</span>
            <span style={{ color: isOverdue(t) ? C.red : C.slate, fontWeight: isOverdue(t) ? 700 : 400 }}>{t.due}</span>
            {canEdit ? <select value={t.status} onChange={e => updateTask(t.id, { status: e.target.value, delay_reason: e.target.value === "Blocked" ? (t.delay_reason || "Needs reason") : t.delay_reason })} style={miniSelect}>{["Todo", "In Progress", "Review", "Blocked", "Done"].map(s => <option key={s}>{s}</option>)}</select> : <Pill tone={t.status === "Blocked" ? "red" : t.status === "Done" ? "teal" : "amber"}>{t.status}</Pill>}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 16 }}><EmptyNote text="No tasks match this filter." /></div>}
      </Card>
    </div>
  );
}

function CalendarView({ tasks, clients }) {
  const [filterType, setFilterType] = useState("all");
  const sorted = [...tasks].filter(t => filterType === "all" || t.type === filterType).sort((a, b) => new Date(a.due) - new Date(b.due));
  const grouped = sorted.reduce((acc, t) => { (acc[t.due] = acc[t.due] || []).push(t); return acc; }, {});
  return (
    <div>
      <SectionTitle action={<select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...input, width: 160, marginBottom: 0 }}><option value="all">All content types</option>{CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}</select>}>Content calendar</SectionTitle>
      {Object.keys(grouped).length === 0 && <EmptyNote text="Nothing scheduled." />}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.slate, marginBottom: 6 }}>{date} {new Date(date) < new Date(todayStr()) && <span style={{ color: C.red }}>· overdue</span>}</div>
          <Card style={{ padding: 4 }}>
            {items.map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${C.line}`, fontSize: 13.5 }}>
                <div><b>{t.title}</b><div style={{ fontSize: 11.5, color: C.slate }}>{clients.find(c => c.id === t.client_id)?.name} · {t.type} · {t.assignee}</div></div>
                <Pill tone="amber">{t.content_stage}</Pill>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function ApprovalsView({ tasks, clients, updateTask, role }) {
  return (
    <div>
      <SectionTitle>Client approvals</SectionTitle>
      {tasks.length === 0 && <EmptyNote text="Nothing waiting on approval right now." />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.map(t => (
          <Card key={t.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.title}</div><div style={{ fontSize: 12.5, color: C.slate, marginTop: 2 }}>{clients.find(c => c.id === t.client_id)?.name} · {t.type} · due {t.due}</div></div>
              <Pill tone="amber">Awaiting client</Pill>
            </div>
            <div style={{ marginTop: 12, height: 100, background: C.slateSoft, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.slate, fontSize: 12.5 }}>Content preview</div>
            {role === "Client" && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <button style={btnTeal} onClick={() => updateTask(t.id, { content_stage: "Final Approval" })}><ThumbsUp size={13} /> Approve</button>
                <button style={btnGhostRed} onClick={() => updateTask(t.id, { content_stage: "Revision" })}><ThumbsDown size={13} /> Reject</button>
                <button style={btnGhost} onClick={() => updateTask(t.id, { content_stage: "Revision" })}><RotateCcw size={13} /> Request revision</button>
                <button style={btnGhost}><MessageSquare size={13} /> Comment</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeamView({ tasks, leaves, employees }) {
  const onLeaveToday = leaves.filter(overlapsToday);
  return (
    <div>
      <SectionTitle>Team &amp; workload</SectionTitle>
      {onLeaveToday.length > 0 && (
        <Card style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Plane size={14} color={C.amber} /> On leave today</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{onLeaveToday.map(l => <Pill key={l.id} tone="amber">{l.employee} · {l.type}</Pill>)}</div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {employees.map(emp => {
          const t = tasks.filter(x => x.assignee === emp);
          const overdueCount = t.filter(isOverdue).length;
          const load = t.filter(x => x.status !== "Done").length;
          const onLeave = onLeaveToday.some(l => l.employee === emp);
          return (
            <Card key={emp} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{emp}</div>
                {onLeave ? <Pill tone="amber">On leave</Pill> : load >= 4 && <Pill tone="red"><Flame size={11} style={{ marginRight: 2, display: "inline" }} />Overloaded</Pill>}
              </div>
              <Row label="Active tasks">{load}</Row><Row label="Overdue">{overdueCount}</Row>
              <Row label="Blocked">{t.filter(x => x.status === "Blocked").length}</Row>
              <Row label="Completed">{t.filter(x => x.status === "Done").length}</Row>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function LeaveView({ role, me, leaves, addLeave, updateLeaveStatus, employees }) {
  const [showForm, setShowForm] = useState(false);
  const isEmployee = role === "Employee";
  const myLeaves = leaves.filter(l => l.employee === me);
  const pending = leaves.filter(l => l.status === "Pending");
  return (
    <div>
      <SectionTitle action={<button onClick={() => setShowForm(true)} style={btnAmber}><Plus size={15} /> {isEmployee ? "Apply for leave" : "Add leave for employee"}</button>}>Leave</SectionTitle>
      {!isEmployee && (
        <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          <StatCard label="Pending requests" value={pending.length} sub={pending.length ? "Awaiting your decision" : "All clear"} tone={pending.length ? "red" : undefined} />
          <StatCard label="Approved this month" value={leaves.filter(l => l.status === "Approved").length} />
          <StatCard label="On leave today" value={leaves.filter(overlapsToday).length} />
        </div>
      )}
      {isEmployee && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>Your leave history</div>
          <Card style={{ padding: 4, marginBottom: 22 }}>
            {myLeaves.length === 0 && <div style={{ padding: 16 }}><EmptyNote text="No leave requests yet." /></div>}
            {myLeaves.map(l => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: `1px solid ${C.line}`, fontSize: 13.5 }}>
                <div><b>{l.type} leave</b><div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{l.from_date} → {l.to_date} · {l.reason}</div></div>
                <Pill tone={l.status === "Approved" ? "teal" : l.status === "Rejected" ? "red" : "amber"}>{l.status}</Pill>
              </div>
            ))}
          </Card>
        </>
      )}
      <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>{isEmployee ? "Team leave calendar" : "All employee leave"}</div>
      <Card style={{ padding: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 1.6fr 1fr 1fr", padding: "10px 14px", fontSize: 11.5, fontWeight: 700, color: C.slate, borderBottom: `1px solid ${C.line}` }}>
          <span>EMPLOYEE</span><span>TYPE</span><span>DATES</span><span>REASON</span><span>APPLIED BY</span><span>STATUS</span></div>
        {leaves.map(l => (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 1.6fr 1fr 1fr", padding: "11px 14px", fontSize: 13, borderBottom: `1px solid ${C.line}`, alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>{l.employee}</span><span>{l.type}</span><span>{l.from_date} → {l.to_date}</span>
            <span style={{ color: C.slate }}>{l.reason}</span><span>{l.applied_by}</span>
            {!isEmployee && l.status === "Pending" ? (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btnTeal, padding: "5px 9px" }} onClick={() => updateLeaveStatus(l.id, "Approved")}><Check size={12} /></button>
                <button style={{ ...btnGhostRed, padding: "5px 9px" }} onClick={() => updateLeaveStatus(l.id, "Rejected")}><X size={12} /></button>
              </div>
            ) : <Pill tone={l.status === "Approved" ? "teal" : l.status === "Rejected" ? "red" : "amber"}>{l.status}</Pill>}
          </div>
        ))}
        {leaves.length === 0 && <div style={{ padding: 16 }}><EmptyNote text="No leave records yet." /></div>}
      </Card>
      {showForm && <AddLeaveModal isEmployee={isEmployee} me={me} employees={employees} onClose={() => setShowForm(false)} onAdd={l => { addLeave(l); setShowForm(false); }} />}
    </div>
  );
}

function AddLeaveModal({ isEmployee, me, employees, onClose, onAdd }) {
  const [form, setForm] = useState({ employee: isEmployee ? me : (employees[0] || ""), type: "Casual", from_date: todayStr(), to_date: todayStr(), reason: "" });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <Card style={{ width: 420, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 17 }}>{isEmployee ? "Apply for leave" : "Add leave for employee"}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        {!isEmployee && <select value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} style={input}>{employees.map(e => <option key={e}>{e}</option>)}</select>}
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={input}>{LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}</select>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11.5, color: C.slate, marginBottom: 4 }}>From</div><input type="date" value={form.from_date} onChange={e => setForm({ ...form, from_date: e.target.value })} style={input} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11.5, color: C.slate, marginBottom: 4 }}>To</div><input type="date" value={form.to_date} onChange={e => setForm({ ...form, to_date: e.target.value })} style={input} /></div>
        </div>
        <textarea placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ ...input, height: 60 }} />
        <button style={{ ...btnAmber, width: "100%", justifyContent: "center", marginTop: 6 }}
          onClick={() => form.reason && onAdd({ ...form, status: isEmployee ? "Pending" : "Approved", applied_by: isEmployee ? form.employee : "Owner" })}>
          {isEmployee ? "Submit request" : "Add leave"}
        </button>
      </Card>
    </div>
  );
}

function ReportsView({ leads, tasks, clients }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const matchedClients = clients.filter(c => c.name.toLowerCase().includes(q));
  const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(q));
  const wonValue = leads.filter(l => l.stage === "Won").reduce((s, l) => s + Number(l.value), 0);
  const conversion = Math.round((leads.filter(l => l.stage === "Won").length / (leads.length || 1)) * 100);
  return (
    <div>
      <SectionTitle>Search &amp; reports</SectionTitle>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: C.slate }} />
        <input placeholder="Search clients, tasks, content..." value={query} onChange={e => setQuery(e.target.value)} style={{ ...input, paddingLeft: 34, marginBottom: 0 }} />
      </div>
      {query && (
        <Card style={{ padding: 14, marginBottom: 18 }}>
          {matchedClients.map(c => <div key={c.id} style={{ padding: "6px 0", fontSize: 13.5 }}>Client — <b>{c.name}</b></div>)}
          {matchedTasks.map(t => <div key={t.id} style={{ padding: "6px 0", fontSize: 13.5 }}>Task — <b>{t.title}</b></div>)}
          {matchedClients.length + matchedTasks.length === 0 && <EmptyNote text="No matches." />}
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Lead conversion" value={`${conversion}%`} />
        <StatCard label="Won value" value={`₹${wonValue.toLocaleString("en-IN")}`} />
        <StatCard label="Delayed tasks" value={tasks.filter(isOverdue).length} tone="red" />
        <StatCard label="Content published" value={tasks.filter(t => t.content_stage === "Publish").length} />
      </div>
      <Card style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Delay reasons on record</div>
        {tasks.filter(t => t.delay_reason).map(t => <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 13.5 }}><span>{t.title}</span><span style={{ color: C.red }}>{t.delay_reason}</span></div>)}
        {tasks.filter(t => t.delay_reason).length === 0 && <EmptyNote text="No delays logged." />}
      </Card>
    </div>
  );
}

function FilesView({ client }) {
  const sample = ["Brand guidelines.pdf", "Logo pack.zip", "September shoot — raw files", "Final deliverables — Aug"];
  return (
    <div>
      <SectionTitle>Files{client ? ` — ${client.name}` : ""}</SectionTitle>
      <Card style={{ padding: 4 }}>{sample.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: i < sample.length - 1 ? `1px solid ${C.line}` : "none", fontSize: 13.5 }}><Paperclip size={15} color={C.slate} /> {f}</div>)}</Card>
      <div style={{ fontSize: 12, color: C.slate, marginTop: 10 }}>Real file upload/download uses Supabase Storage — README ke "File uploads" section mein steps hain.</div>
    </div>
  );
}

const input = { width: "100%", padding: "9px 11px", borderRadius: 8, border: `1px solid ${C.line}`, marginBottom: 9, fontSize: 13.5, fontFamily: "Inter", boxSizing: "border-box" };
const miniSelect = { border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12.5, fontFamily: "Inter", background: C.card };
const btnBase = { display: "inline-flex", alignItems: "center", gap: 5, border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Inter" };
const btnAmber = { ...btnBase, background: C.amber, color: "#3A2708" };
const btnTeal = { ...btnBase, background: C.teal, color: "#fff" };
const btnGhost = { ...btnBase, background: C.slateSoft, color: C.ink };
const btnGhostRed = { ...btnBase, background: C.redSoft, color: C.red };
