import { useState, useEffect, useRef, Fragment } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";

const C = {
  bg:"#F8F7F4",bg2:"#EFEDE8",white:"#FFFFFF",dark:"#0C0C0C",dark2:"#151515",darkBorder:"#282828",
  text:"#111110",textMid:"#3D3D3A",textSoft:"#7A7A72",textFaint:"#B0AFA8",
  accent:"#3730A3",accentMid:"#4F46E5",accentBright:"#6366F1",accentLight:"#A5B4FC",accentSoft:"#EEF2FF",accentGlow:"rgba(99,102,241,0.15)",
  warm:"#92400E",warmMid:"#B45309",warmSoft:"#FFFBEB",
  teal:"#115E59",tealMid:"#0D9488",tealLight:"#5EEAD4",tealSoft:"#F0FDFA",
  rose:"#9F1239",roseSoft:"#FFF1F2",
  border:"#E2E0DA",borderLight:"#F0EDE7",
  glass:"rgba(255,255,255,0.6)",glassBorder:"rgba(255,255,255,0.3)",
  shadow:"0 1px 2px rgba(0,0,0,0.03),0 4px 16px rgba(0,0,0,0.05)",
  shadowLg:"0 4px 6px rgba(0,0,0,0.02),0 12px 40px rgba(0,0,0,0.08)",
  shadowGlow:"0 0 60px rgba(99,102,241,0.08)",success:"#22C55E",
};
const F = {serif:"'Cormorant Garamond',Georgia,serif",sans:"'Outfit',system-ui,sans-serif",mono:"'IBM Plex Mono',monospace"};

const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.accentSoft};color:${C.accent}}html{scroll-behavior:smooth}
.grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.022;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:0;transform:scale(2.2)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes wave{0%{transform:scaleY(.3)}100%{transform:scaleY(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
`;

/* ── Scroll to top on route change ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function useReveal(t = 0.12) {
  const r = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = r.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: t });
    o.observe(el); return () => o.disconnect();
  }, [t]);
  return [r, vis];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [r, v] = useReveal();
  return <div ref={r} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(40px)", transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}s`, ...style }}>{children}</div>;
}

const Label = ({ children, light }) => <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: light ? "rgba(255,255,255,0.55)" : C.textSoft, display: "block", marginBottom: 16 }}>{children}</span>;

const Heading = ({ children, s = "lg", style: st = {}, light }) => {
  const m = { hero: { fontSize: "clamp(52px,7.5vw,100px)", lineHeight: 0.97, letterSpacing: "-0.04em", fontWeight: 400 }, lg: { fontSize: "clamp(38px,5vw,66px)", lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 400 }, md: { fontSize: "clamp(28px,3.5vw,46px)", lineHeight: 1.1, letterSpacing: "-0.03em", fontWeight: 400 }, sm: { fontSize: "clamp(21px,2.2vw,29px)", lineHeight: 1.16, letterSpacing: "-0.02em", fontWeight: 500 } };
  return <h2 style={{ fontFamily: F.serif, color: light ? "#fff" : C.text, margin: 0, ...m[s], ...st }}>{children}</h2>;
};

const Txt = ({ children, style: st = {}, light }) => <p style={{ fontFamily: F.sans, fontSize: 16, lineHeight: 1.78, color: light ? "rgba(255,255,255,0.7)" : C.textSoft, margin: 0, fontWeight: 350, ...st }}>{children}</p>;

const Sec = ({ children, style: st = {}, dark, id }) => <section id={id} style={{ padding: "140px 48px", background: dark ? C.dark : "transparent", position: "relative", overflow: "hidden", ...st }}><div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>{children}</div></section>;

function Btn({ children, v = "primary", style: st = {}, onClick }) {
  const [h, sH] = useState(false);
  const base = { fontFamily: F.sans, fontSize: 13, fontWeight: 600, borderRadius: 100, padding: "13px 30px", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", letterSpacing: "0.01em" };
  const vs = { primary: { background: h ? C.dark2 : C.text, color: C.bg, border: "none", boxShadow: h ? "0 8px 28px rgba(0,0,0,0.22)" : "0 2px 8px rgba(0,0,0,0.1)" }, secondary: { background: h ? C.bg2 : "transparent", color: C.text, border: `1.5px solid ${h ? C.textSoft : C.border}` }, accent: { background: h ? C.accent : C.accentMid, color: "#fff", border: "none", boxShadow: h ? `0 8px 32px ${C.accentGlow}` : "none" }, ghost: { background: "transparent", color: C.accentMid, border: "none", padding: "8px 4px", textDecoration: "underline", textUnderlineOffset: 4 } };
  return <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)} style={{ ...base, ...vs[v], transform: h ? "translateY(-2px)" : "translateY(0)", ...st }}>{children}</button>;
}

const Orb = ({ color, size, top, left, right, bottom, opacity = 0.5, blur = 70 }) => <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle,${color} 0%,transparent 65%)`, top, left, right, bottom, opacity, pointerEvents: "none", filter: `blur(${blur}px)` }} />;
const Blob = ({ color, size = 300, top, left, right, opacity = 0.1 }) => <div style={{ position: "absolute", width: size, height: size, background: color, top, left, right, opacity, pointerEvents: "none", animation: "morphBlob 14s ease-in-out infinite", filter: "blur(55px)" }} />;
const GridBg = () => <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.022 }}>{Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: `${20 * (i + 1)}%`, top: 0, bottom: 0, width: 1, background: C.text }} />)}</div>;

/* ── Icons ── */
function Icon({ name, size = 24, color = C.textSoft, strokeWidth = 1.5 }) {
  const s = { width: size, height: size, display: "block" };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    tooth: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 2C9.5 2 7.5 3.5 7 6C6.3 9.5 5 11 4.5 14C4 17 5.5 22 8 22C10 22 10.5 18 12 18C13.5 18 14 22 16 22C18.5 22 20 17 19.5 14C19 11 17.7 9.5 17 6C16.5 3.5 14.5 2 12 2Z" /></svg>,
    urgentcare: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="3" y="3" width="18" height="18" rx="4" /><line {...p} x1="12" y1="8" x2="12" y2="16" /><line {...p} x1="8" y1="12" x2="16" y2="12" /></svg>,
    brain: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 2C9 2 7 4 7 6.5C5.5 7 4 8.5 4 10.5C4 12 5 13.5 6 14C6 16 7.5 18 9.5 18.5L12 22L14.5 18.5C16.5 18 18 16 18 14C19 13.5 20 12 20 10.5C20 8.5 18.5 7 17 6.5C17 4 15 2 12 2Z" /><path {...p} d="M12 2V22" opacity="0.3" /></svg>,
    bone: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M18.5 3.5C17.5 2.5 16 2.5 15 3.5C14.2 4.3 14.1 5.5 14.7 6.4L6.4 14.7C5.5 14.1 4.3 14.2 3.5 15C2.5 16 2.5 17.5 3.5 18.5C4.5 19.5 6 19.5 7 18.5C7.8 17.7 7.9 16.5 7.3 15.6L15.6 7.3C16.5 7.9 17.7 7.8 18.5 7C19.5 6 19.5 4.5 18.5 3.5Z" /></svg>,
    sparkle: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 3L13.5 8.5L19 7L14.5 11L19 15L13.5 13.5L12 19L10.5 13.5L5 15L9.5 11L5 7L10.5 8.5L12 3Z" /></svg>,
    ear: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M6 12C6 8.7 8.7 6 12 6C15.3 6 18 8.7 18 12" /><path {...p} d="M18 12C18 14 17 15.5 15.5 16.5C14 17.5 13 19 13 21" /><path {...p} d="M9 12C9 10.3 10.3 9 12 9C13.7 9 15 10.3 15 12C15 13.2 14 14 13 14.5" /></svg>,
    paw: <svg viewBox="0 0 24 24" style={s}><ellipse {...p} cx="12" cy="16" rx="4" ry="3.5" /><circle {...p} cx="7" cy="10" r="2" /><circle {...p} cx="17" cy="10" r="2" /><circle {...p} cx="9" cy="6" r="1.8" /><circle {...p} cx="15" cy="6" r="1.8" /></svg>,
    eye: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" /><circle {...p} cx="12" cy="12" r="3" /></svg>,
    fertility: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9.5 4C10.9 4 12 5 12 5C12 5 13.1 4 14.5 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z" /><path {...p} d="M12 8V14M9 11H15" /></svg>,
    phone: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M22 16.9V19.9C22 20.5 21.5 21 20.9 21C10.6 21 3 13.4 3 3.1C3 2.5 3.5 2 4.1 2H7.1C7.6 2 8 2.4 8.1 2.9C8.3 4 8.7 5.1 9.2 6.1L7.5 7.8C9.1 10.9 13.1 14.9 16.2 16.5L17.9 14.8C18.9 15.3 20 15.7 21.1 15.9C21.6 16 22 16.4 22 16.9Z" /></svg>,
    growth: <svg viewBox="0 0 24 24" style={s}><polyline {...p} points="22,7 13.5,15.5 8.5,10.5 2,17" /><polyline {...p} points="16,7 22,7 22,13" /></svg>,
    lightning: <svg viewBox="0 0 24 24" style={s}><polygon {...p} points="13,2 3,14 12,14 11,22 21,10 12,10" /></svg>,
    link: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M10 13C10.9 14.2 12.4 15 14 15C16.8 15 19 12.8 19 10C19 7.2 16.8 5 14 5C12.4 5 10.9 5.8 10 7" /><path {...p} d="M14 11C13.1 9.8 11.6 9 10 9C7.2 9 5 11.2 5 14C5 16.8 7.2 19 10 19C11.6 19 13.1 18.2 14 17" /></svg>,
    star: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 3L14.5 9L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 9L12 3Z" /></svg>,
    chat: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M21 12C21 16.4 16.9 20 12 20C10.6 20 9.2 19.7 8 19.2L3 21L4.8 16.8C3.7 15.4 3 13.8 3 12C3 7.6 7.1 4 12 4C16.9 4 21 7.6 21 12Z" /></svg>,
    lock: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="5" y="11" width="14" height="10" rx="2" /><path {...p} d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" /><circle cx="12" cy="16" r="1.5" fill={color} stroke="none" /></svg>,
    shield: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 2L3 7V12C3 17.5 6.8 22 12 22C17.2 22 21 17.5 21 12V7L12 2Z" /><path {...p} d="M9 12L11 14L15 10" /></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="3" y="4" width="18" height="18" rx="3" /><line {...p} x1="3" y1="10" x2="21" y2="10" /><line {...p} x1="8" y1="2" x2="8" y2="6" /><line {...p} x1="16" y1="2" x2="16" y2="6" /></svg>,
    pill: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M10.5 3.5L3.5 10.5C1.5 12.5 1.5 15.8 3.5 17.8L6.2 20.5C8.2 22.5 11.5 22.5 13.5 20.5L20.5 13.5C22.5 11.5 22.5 8.2 20.5 6.2L17.8 3.5C15.8 1.5 12.5 1.5 10.5 3.5Z" /><line {...p} x1="7" y1="17" x2="17" y2="7" /></svg>,
    card: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="2" y="5" width="20" height="14" rx="3" /><line {...p} x1="2" y1="10" x2="22" y2="10" /><line {...p} x1="6" y1="15" x2="10" y2="15" /></svg>,
    refresh: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M1 4V10H7" /><path {...p} d="M23 20V14H17" /><path {...p} d="M20.5 9C19.4 5.9 16 3.5 12 3.5C7.3 3.5 3.5 7 3 11.5" /><path {...p} d="M3.5 15C4.6 18.1 8 20.5 12 20.5C16.7 20.5 20.5 17 21 12.5" /></svg>,
    clipboard: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="5" y="3" width="14" height="19" rx="2" /><path {...p} d="M9 3V2C9 1.4 9.4 1 10 1H14C14.6 1 15 1.4 15 2V3" /><line {...p} x1="9" y1="9" x2="15" y2="9" /><line {...p} x1="9" y1="13" x2="15" y2="13" /></svg>,
    mic: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="9" y="2" width="6" height="12" rx="3" /><path {...p} d="M5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10" /><line {...p} x1="12" y1="17" x2="12" y2="22" /></svg>,
    clock: <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="9" /><polyline {...p} points="12,7 12,12 16,14" /></svg>,
    chart: <svg viewBox="0 0 24 24" style={s}><rect {...p} x="4" y="13" width="4" height="8" rx="1" /><rect {...p} x="10" y="8" width="4" height="13" rx="1" /><rect {...p} x="16" y="3" width="4" height="18" rx="1" /></svg>,
    check: <svg viewBox="0 0 24 24" style={s}><polyline {...p} points="4,12 9,17 20,6" /></svg>,
    cross: <svg viewBox="0 0 24 24" style={s}><line {...p} x1="6" y1="6" x2="18" y2="18" /><line {...p} x1="18" y1="6" x2="6" y2="18" /></svg>,
    medical: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 2C10.3 2 9 3.3 9 5V8H7C5.3 8 4 9.3 4 11C4 12.7 5.3 14 7 14H9V18C9 19.7 10.3 21 12 21C13.7 21 15 19.7 15 18V14H17C18.7 14 20 12.7 20 11C20 9.3 18.7 8 17 8H15V5C15 3.3 13.7 2 12 2Z" /></svg>,
    heart: <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9.5 4C10.9 4 12 5 12 5C12 5 13.1 4 14.5 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z" /></svg>,
  };
  return icons[name] || null;
}

function WaveAnim({ color = C.accentMid, bars = 28 }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 2, height: 30 }}>{Array.from({ length: bars }).map((_, i) => <div key={i} style={{ width: 2.5, borderRadius: 3, background: color, height: 6 + Math.sin(i * 0.5) * 12 + Math.random() * 10, opacity: 0.25 + (i / bars) * 0.75, animation: `wave .9s ease-in-out ${i * 0.04}s infinite alternate` }} />)}</div>;
}

function BadgeRotate({ size = 78 }) {
  return <div style={{ width: size, height: size, animation: "spin 30s linear infinite" }}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><defs><path id="bp" d={`M ${size / 2} ${size / 2} m -${size / 2 - 10} 0 a ${size / 2 - 10} ${size / 2 - 10} 0 1 1 ${size - 20} 0 a ${size / 2 - 10} ${size / 2 - 10} 0 1 1 -${size - 20} 0`} /></defs><text fontSize="7" fill={C.textFaint} fontFamily="IBM Plex Mono,monospace" letterSpacing="4"><textPath href="#bp">VAKLAB AI · VAKLAB AI · VAKLAB AI · </textPath></text></svg></div>;
}

function Glass({ children, style: st = {}, hover = true, onClick }) {
  const [h, sH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => hover && sH(true)} onMouseLeave={() => hover && sH(false)} style={{ background: h ? "rgba(255,255,255,0.88)" : C.glass, backdropFilter: "blur(24px) saturate(1.3)", border: `1px solid ${h ? C.border : C.glassBorder}`, borderRadius: 22, transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)", boxShadow: h ? C.shadowLg : C.shadow, transform: h ? "translateY(-5px)" : "translateY(0)", ...st }}>{children}</div>;
}

/* Stethoscope Logo */
const Logo = ({ size = 17 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M7 2C7 2 7 6 7 8C7 10.5 9 12 12 12C15 12 17 10.5 17 8C17 6 17 2 17 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M12 12V16C12 18.2 13.8 20 16 20C18.2 20 20 18.2 20 16V15" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><circle cx="20" cy="14" r="2.5" stroke="white" strokeWidth="1.8" fill="none" /><circle cx="20" cy="14" r="0.8" fill="white" /></svg>;

/* ═══════ NAV ═══════ */
function Nav() {
  const [sc, sSc] = useState(false);
  const [dr, sDr] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { const h = () => sSc(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (p) => { navigate(p); sDr(false); };
  const scrollToDemo = () => {
    go("/");
    const scroll = () => { const el = document.getElementById("live-demo"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); else setTimeout(scroll, 100); };
    setTimeout(scroll, 200);
  };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: sc ? "rgba(248,247,244,0.82)" : "transparent", backdropFilter: sc ? "blur(28px) saturate(1.5)" : "none", borderBottom: sc ? `1px solid rgba(226,224,218,0.45)` : "none", transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.accentBright})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 12px ${C.accentGlow}`, transition: "transform 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "rotate(-8deg) scale(1.06)"} onMouseLeave={e => e.currentTarget.style.transform = "rotate(0) scale(1)"}>
            <Logo />
          </div>
          <span style={{ fontFamily: F.serif, fontSize: 25, fontWeight: 500, color: C.text, letterSpacing: "-0.02em" }}>vaklab<span style={{ fontStyle: "italic", opacity: 0.35, fontWeight: 400 }}>ai</span></span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <span onClick={() => go("/product")} style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: location.pathname === "/product" ? C.text : C.textSoft, cursor: "pointer", transition: "color 0.25s" }} onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = location.pathname === "/product" ? C.text : C.textSoft}>Product</span>
          <div style={{ position: "relative" }} onMouseEnter={() => sDr(true)} onMouseLeave={() => sDr(false)}>
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: C.textSoft, cursor: "pointer" }}>Specialty ▾</span>
            {dr && <div style={{ position: "absolute", top: "100%", left: -20, paddingTop: 10, zIndex: 300 }}>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: 8, boxShadow: C.shadowLg, minWidth: 210 }}>
                {[{ l: "Dentistry", p: "/specialty/dentist" }, { l: "Urgent Care", p: "/specialty/urgent-care" }, { l: "Mental Health", p: "/specialty/mental-health" }, { l: "Fertility", p: "/specialty/fertility" }].map(s =>
                  <div key={s.p} onClick={() => go(s.p)} style={{ fontFamily: F.sans, fontSize: 13.5, fontWeight: 450, padding: "11px 20px", borderRadius: 10, cursor: "pointer", color: C.textMid, transition: "all 0.2s", letterSpacing: "0.005em" }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.accentSoft; e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMid; }}>{s.l}</div>
                )}
              </div>
            </div>}
          </div>
          <Btn v="ghost" onClick={scrollToDemo} style={{ fontSize: 12.5 }}>Try Sierra</Btn>
          <Btn style={{ padding: "11px 26px" }}>Book a Call</Btn>
        </div>
      </div>
    </nav>
  );
}

/* ═══════ HOME PAGE ═══════ */
function HomeHero() {
  const [v, sV] = useState(false);
  useEffect(() => { setTimeout(() => sV(true), 120); }, []);
  const a = (d) => ({ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(48px)", transition: `all 1.2s cubic-bezier(0.22,1,0.36,1) ${d}s` });
  const [hov, sHov] = useState(false);
  return <Sec style={{ paddingTop: 170, paddingBottom: 80, minHeight: "100vh", display: "flex", alignItems: "center" }}>
    <GridBg /><Orb color={C.accentSoft} size={900} top={-400} right={-350} opacity={0.45} blur={100} /><Blob color={C.accentLight} size={300} top={150} right={250} opacity={0.05} /><Orb color={C.warmSoft} size={500} bottom={-250} left={-200} opacity={0.3} blur={80} />
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <div style={a(0)}><Label>The voice of modern healthcare</Label></div>
      <div style={a(0.06)}><Heading s="hero">Never Miss a{"\n"}Patient Again.{"\n"}<span style={{ fontStyle: "italic", color: C.accentMid }}>Deliver better care.</span></Heading></div>
      <div style={{ ...a(0.18), maxWidth: 500, margin: "40px auto 0" }}><Txt style={{ fontSize: 18 }}>The enterprise healthcare AI assistant that handles the whole conversation across voice, and text.</Txt></div>
      <div style={{ ...a(0.32), marginTop: 72, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Label>MEET SIERRA</Label>
        <button onMouseEnter={() => sHov(true)} onMouseLeave={() => sHov(false)} onClick={() => { const el = document.getElementById("live-demo"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{ display: "inline-flex", alignItems: "center", gap: 14, background: hov ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)", border: `1.5px solid ${hov ? C.accentLight : C.border}`, borderRadius: 100, padding: "20px 52px", fontFamily: F.sans, fontSize: 16.5, fontWeight: 500, color: C.text, cursor: "pointer", boxShadow: hov ? `0 16px 56px ${C.accentGlow}, ${C.shadowGlow}` : "0 4px 24px rgba(0,0,0,0.04)", transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)", backdropFilter: "blur(20px)", transform: hov ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: C.accentMid, position: "relative" }}><div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `2px solid ${C.accentLight}`, animation: "pulse 2.5s ease-in-out infinite" }} /></div>Start Talking
        </button>
        <div style={{ animation: "fadeIn 1.5s ease 1.2s both" }}><WaveAnim bars={40} /></div>
      </div>
    </div>
  </Sec>;
}

const DEMO_AGENT_URL = "wss://dev.vaklabai.com";

function HomeLiveDemo() {
  const specs = ["Urgent Care", "Dentist", "Mental Health", "Fertility"];
  const slugs = ["urgent-care", "dentist", "mental-health", "fertility"];
  const [ac, sAc] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const playCtxRef = useRef(null);
  const nextPlayTime = useRef(0);
  const transcriptRef = useRef(null);

  const formatTime = (s) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `00:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const playAudio = (arrayBuf) => {
    if (!playCtxRef.current) playCtxRef.current = new AudioContext({ sampleRate: 24000 });
    const ctx = playCtxRef.current;
    const int16 = new Int16Array(arrayBuf);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
    const buf = ctx.createBuffer(1, float32.length, 24000);
    buf.copyToChannel(float32, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    const now = ctx.currentTime;
    const startAt = Math.max(now, nextPlayTime.current);
    src.start(startAt);
    nextPlayTime.current = startAt + buf.duration;
  };

  const startMic = async (ws) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    mediaStreamRef.current = stream;
    const ctx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;
    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const float32 = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) int16[i] = Math.max(-32768, Math.min(32767, Math.round(float32[i] * 32768)));
      ws.send(int16.buffer);
    };
    source.connect(processor);
    processor.connect(ctx.destination);
  };

  const startStream = async () => {
    if (wsRef.current) return;
    const ws = new WebSocket(`${DEMO_AGENT_URL}/api/voice-stream?specialty=${slugs[ac]}`);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";
    setStreaming(true);
    setTranscript([]);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "start", specialty: slugs[ac] }));
      // Delay mic start so Sierra greets first without picking up background noise
      setTimeout(() => { if (wsRef.current) startMic(ws); }, 2000);
    };
    ws.onmessage = (e) => {
      if (typeof e.data === "string") {
        try {
          const data = JSON.parse(e.data);
          if (data.transcript) {
            const speaker = data.role === "user" ? "Guest" : "Sierra";
            const isFinal = data.is_final !== false;
            setTranscript(prev => {
              const last = prev[prev.length - 1];
              // If same speaker and not final, update the last line (streaming)
              if (last && last.speaker === speaker && !last.final) {
                return [...prev.slice(0, -1), { speaker, text: data.transcript, final: isFinal }];
              }
              // New line
              return [...prev, { speaker, text: data.transcript, final: isFinal }];
            });
          }
        } catch {}
      } else {
        playAudio(e.data);
      }
    };
    ws.onclose = () => stopStream();
    ws.onerror = () => stopStream();
  };

  const stopStream = () => {
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    if (playCtxRef.current) { playCtxRef.current.close(); playCtxRef.current = null; nextPlayTime.current = 0; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null; }
    setStreaming(false);
  };

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript]);

  useEffect(() => () => stopStream(), []);

  return <Sec id="live-demo" style={{ background: C.white }}>
    <Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><Label>Hearing is believing</Label><Heading s="lg">Experience a live call<br />with Sierra, our AI agent</Heading></div></Reveal>
    <Reveal delay={0.08}><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 48 }}>{specs.map((s, i) => <button key={s} onClick={() => { if (!streaming) { sAc(i); setTranscript([]); setElapsed(0); } }} style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, padding: "7px 18px", borderRadius: 100, cursor: streaming ? "default" : "pointer", border: `1.5px solid ${i === ac ? C.accentMid : C.border}`, background: i === ac ? C.accentSoft : "transparent", color: i === ac ? C.accentMid : C.textSoft, opacity: streaming && i !== ac ? 0.4 : 1, transition: "all 0.3s" }}>{s}</button>)}</div></Reveal>
    <Reveal delay={0.14}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, maxWidth: 760, margin: "0 auto" }}>
      <Glass hover={false} style={{ padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 340 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: streaming ? C.success : C.textFaint, boxShadow: streaming ? `0 0 8px ${C.tealLight}` : "none", transition: "all 0.3s" }} /><span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.14em", color: C.textSoft }}>{streaming ? "LIVE TRANSCRIPT" : "READY"}</span><span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", color: C.textFaint }}>{formatTime(elapsed)}</span></div>
        {transcript.length > 0 && <div ref={transcriptRef} style={{ fontFamily: F.sans, fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 20, minHeight: 120, maxHeight: 280, overflow: "auto", textAlign: "left", width: "100%", padding: "16px 20px", background: C.bg, borderRadius: 14, border: `1px solid ${C.borderLight}` }}>{transcript.map((t, i) => <div key={i} style={{ marginBottom: 10 }}><span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, color: t.speaker === "Sierra" ? C.accentMid : C.tealMid, marginRight: 10 }}>{t.speaker}</span><span>{t.text}{!t.final && <span style={{ display: "inline-block", width: 6, height: 14, background: C.accentMid, marginLeft: 2, animation: "pulse 1s ease-in-out infinite", verticalAlign: "text-bottom" }} />}</span></div>)}</div>}
        <div style={{ marginBottom: 36 }}><WaveAnim bars={36} /></div>
        <Btn v="accent" style={{ padding: "14px 38px", fontSize: 14.5 }} onClick={streaming ? stopStream : startStream}>{streaming ? "Stop" : "Start Talking"}</Btn>
        <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: "0.16em", color: C.textFaint, marginTop: 24, textTransform: "uppercase" }}>{specs[ac]}</div>
      </Glass>
      <Glass style={{ padding: "52px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Heading s="sm" style={{ marginBottom: 10 }}>Prefer to text?</Heading><Txt>Sierra does that, too.</Txt>
        <div style={{ display: "flex", marginTop: 24, border: `1.5px solid ${C.border}`, borderRadius: 100, overflow: "hidden", background: C.white }}>
          <span style={{ padding: "12px 14px", fontFamily: F.sans, fontSize: 13, color: C.textSoft, borderRight: `1px solid ${C.border}` }}>+1</span>
          <input placeholder="000-000-0000" style={{ border: "none", outline: "none", padding: "12px 14px", fontFamily: F.sans, fontSize: 13, flex: 1, background: "transparent" }} />
          <button style={{ background: C.text, color: C.bg, border: "none", padding: "12px 22px", fontFamily: F.sans, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Text Me</button>
        </div>
      </Glass>
    </div></Reveal>
  </Sec>;
}

function HomeValueProps() {
  const cards = [
    { tag: "Run Leaner", stat: "100%", desc: "answer rates across calls, texts, and chat. 25% more than most front desks.", grad: `linear-gradient(145deg,${C.warmSoft},${C.bg})` },
    { tag: "Grow Faster", stat: "18%", desc: "more appointments booked. ~3 more per location, per day.", grad: `linear-gradient(145deg,${C.accentSoft},${C.bg})` },
    { tag: "Improve Care", stat: "95%", desc: "reduction in patient wait times. Higher NPS, happier patients.", grad: `linear-gradient(145deg,${C.tealSoft},${C.bg})` },
  ];
  return <Sec>
    <Reveal><div style={{ textAlign: "center", marginBottom: 88 }}><Label>You know the chaos. So do we.</Label><Heading s="lg">Built for high-volume<br />healthcare</Heading></div></Reveal>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{cards.map((c, i) => <Reveal key={i} delay={i * 0.08}><Glass style={{ padding: "48px 32px", background: c.grad, height: "100%" }}>
      <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.16em", color: C.textSoft, marginBottom: 24, textTransform: "uppercase" }}>{c.tag}</div>
      <div style={{ fontFamily: F.serif, fontSize: 82, color: C.text, letterSpacing: "-0.05em", lineHeight: 0.88, marginBottom: 18, fontWeight: 400 }}>{c.stat}</div>
      <Txt style={{ fontSize: 14.5 }}>{c.desc}</Txt>
    </Glass></Reveal>)}</div>
    <Reveal delay={0.3}><div style={{ textAlign: "center", marginTop: 48 }}><Btn v="ghost">Book a Call →</Btn></div></Reveal>
  </Sec>;
}

function DashboardShowcase() {
  const [tab, setTab] = useState(0);
  const tabs = ["Call Analytics", "Intake Invitations", "Intake Messages"];
  return <Sec style={{ background: C.white }}>
    <Reveal><div style={{ textAlign: "center", marginBottom: 64 }}><Label>Analytics & reporting</Label><Heading s="lg">Actionable insights,<br /><span style={{ fontStyle: "italic" }}>not just data.</span></Heading><Txt style={{ maxWidth: 480, margin: "20px auto 0" }}>Every call, message, and patient interaction — tracked, measured, and optimized in real time.</Txt></div></Reveal>
    <Reveal delay={0.1}>
      <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 20, overflow: "hidden", background: C.bg, boxShadow: C.shadowLg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${C.borderLight}`, background: C.white }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${C.accent},${C.accentBright})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Logo size={14} /></div><span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>VaklabAI</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F87171" }} /><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24" }} /><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399" }} /></div>
        </div>
        <div style={{ display: "flex", minHeight: 480 }}>
          <div style={{ width: 200, borderRight: `1px solid ${C.borderLight}`, padding: "20px 0", background: C.white, flexShrink: 0 }}>
            <div style={{ padding: "8px 20px", marginBottom: 8 }}><div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: C.text }}>UTHealth Clinic</div><div style={{ fontFamily: F.sans, fontSize: 10, color: C.textFaint }}>Austin</div></div>
            <div style={{ fontFamily: F.mono, fontSize: 8.5, letterSpacing: "0.14em", color: C.textFaint, padding: "16px 20px 8px", textTransform: "uppercase" }}>Dashboard</div>
            {tabs.map((t, i) => <div key={t} onClick={() => setTab(i)} style={{ fontFamily: F.sans, fontSize: 12.5, fontWeight: i === tab ? 600 : 400, color: i === tab ? C.accentMid : C.textSoft, padding: "9px 20px", cursor: "pointer", background: i === tab ? C.accentSoft : "transparent", borderRight: i === tab ? `2px solid ${C.accentMid}` : "2px solid transparent", transition: "all 0.2s" }}>{t}</div>)}
          </div>
          <div style={{ flex: 1, padding: "24px 28px", animation: "fadeIn 0.4s ease" }} key={tab}>
            {tab === 0 && <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 600, color: C.text }}>Call Analytics</div><div style={{ fontFamily: F.mono, fontSize: 10, color: C.textFaint, border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: "5px 12px" }}>Dec 29 – Mar 29</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>{[{ label: "Incoming Calls", val: "243", color: "#4F46E5", bg: "#EEF2FF" }, { label: "Outreach Calls", val: "194", color: "#F97316", bg: "#FFF7ED" }, { label: "Collection Calls", val: "215", color: "#0D9488", bg: "#F0FDFA" }, { label: "Collections", val: "$27,941", color: "#EAB308", bg: "#FEFCE8" }].map((s, i) => <div key={i} style={{ border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "16px 18px", background: C.white }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={["phone", "growth", "phone", "chart"][i]} size={16} color={s.color} /></div><span style={{ fontFamily: F.mono, fontSize: 9, color: C.tealMid, background: C.tealSoft, padding: "2px 6px", borderRadius: 4 }}>+100%</span></div><div style={{ fontFamily: F.sans, fontSize: 10.5, color: C.textSoft, marginBottom: 4 }}>{s.label}</div><div style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 700, color: C.text }}>{s.val}</div></div>)}</div>
              <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "20px 24px", background: C.white }}><div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Calls Outcome Statistics</div>
                <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>{[{ l: "All Calls", v: "652", c: "#4F46E5" }, { l: "Booked", v: "153", c: "#3B82F6" }, { l: "Cancelled", v: "128", c: "#F97316" }, { l: "Rescheduled", v: "114", c: "#EAB308" }, { l: "No Action", v: "144", c: "#9CA3AF" }].map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: s.c }} /><span style={{ fontFamily: F.sans, fontSize: 10, color: C.textSoft }}>{s.l}</span><span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: C.text }}>{s.v}</span></div>)}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 40, height: 160, paddingLeft: 28 }}>{["Jan", "Feb", "Mar"].map((month, mi) => <div key={month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}><div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140 }}>{[{ h: [55, 60, 25], c: "#3B82F6" }, { h: [50, 48, 18], c: "#F97316" }, { h: [35, 40, 12], c: "#EAB308" }, { h: [30, 32, 10], c: "#D1D5DB" }].map((bar, bi) => <div key={bi} style={{ width: 14, height: bar.h[mi], background: bar.c, borderRadius: "3px 3px 0 0" }} />)}</div><span style={{ fontFamily: F.sans, fontSize: 10, color: C.textFaint, marginTop: 8 }}>{month}</span></div>)}</div>
              </div></>}
            {tab === 1 && <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 600, color: C.text }}>Intake Invitations</div><div style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: C.white, background: C.accentMid, borderRadius: 8, padding: "7px 14px" }}>+ New Invitation</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>{[{ label: "Invitations Sent", val: "12", color: "#4F46E5", bg: "#EEF2FF" }, { label: "Link Opened", val: "9", color: "#0D9488", bg: "#F0FDFA" }, { label: "Completed", val: "7", color: "#22C55E", bg: "#F0FDF4" }].map((s, i) => <div key={i} style={{ border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "16px 18px", background: C.white }}><div style={{ width: 32, height: 32, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon name={["clipboard", "link", "check"][i]} size={16} color={s.color} /></div><div style={{ fontFamily: F.sans, fontSize: 10.5, color: C.textSoft, marginBottom: 4 }}>{s.label}</div><div style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 700, color: C.text }}>{s.val}</div></div>)}</div>
              <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 14, overflow: "hidden", background: C.white }}><div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr", padding: "12px 18px", borderBottom: `1px solid ${C.borderLight}`, background: C.bg }}>{["Code", "Created", "Patient", "Provider", "Status"].map(h => <span key={h} style={{ fontFamily: F.sans, fontSize: 10.5, fontWeight: 600, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</span>)}</div>
                {[{ code: "8f504217...", date: "3/28/2026", patient: "Alexander Gonzalez", provider: "John Smith", status: "Completed", sc: "#22C55E", sb: "#F0FDF4" }, { code: "e06c579c...", date: "3/28/2026", patient: "Mark Tsecansky", provider: "Sarah Johnson", status: "Active", sc: "#3B82F6", sb: "#EFF6FF" }, { code: "629cf0aa...", date: "3/26/2026", patient: "Raju Nekadi", provider: "Sarah Johnson", status: "Active", sc: "#3B82F6", sb: "#EFF6FF" }, { code: "e88e0cf8...", date: "3/26/2026", patient: "Raju Nekadi", provider: "John Smith", status: "Pending", sc: "#F59E0B", sb: "#FFFBEB" }].map((row, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr", padding: "11px 18px", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none", alignItems: "center" }}><span style={{ fontFamily: F.mono, fontSize: 11, color: C.textFaint }}>{row.code}</span><span style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft }}>{row.date}</span><span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: C.text }}>{row.patient}</span><span style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft }}>{row.provider}</span><span style={{ fontFamily: F.sans, fontSize: 10.5, fontWeight: 600, color: row.sc, background: row.sb, padding: "3px 10px", borderRadius: 100, display: "inline-block", width: "fit-content" }}>{row.status}</span></div>)}</div></>}
            {tab === 2 && <><div style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 24 }}>Intake Messages</div>
              <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 14, overflow: "hidden", background: C.white }}><div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr", padding: "12px 18px", borderBottom: `1px solid ${C.borderLight}`, background: C.bg }}>{["Patient", "Completed", "Provider", "Actions"].map(h => <span key={h} style={{ fontFamily: F.sans, fontSize: 10.5, fontWeight: 600, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</span>)}</div>
                {[{ patient: "Alexander Gonzalez", date: "3/28/2026", provider: "John Smith" }, { patient: "Local Demo", date: "3/16/2026", provider: "John Smith" }, { patient: "Portal Demo", date: "3/16/2026", provider: "John Smith" }, { patient: "Avery Complete", date: "3/9/2026", provider: "John Smith" }, { patient: "EndToEnd Flow", date: "3/9/2026", provider: "John Smith" }].map((row, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr", padding: "11px 18px", borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none", alignItems: "center" }}><span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: C.text }}>{row.patient}</span><span style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft }}>{row.date}</span><span style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft }}>{row.provider}</span><div style={{ display: "flex", gap: 8 }}>{["Transcript", "Summary"].map(a => <span key={a} style={{ fontFamily: F.sans, fontSize: 10.5, fontWeight: 500, color: C.accentMid, border: `1px solid ${C.accentLight}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Icon name="clipboard" size={10} color={C.accentMid} />{a}</span>)}</div></div>)}</div></>}
          </div>
        </div>
      </div>
    </Reveal>
  </Sec>;
}

function HomeIntegrations() {
  const logos = [{ name: "Zenoti", w: 80 }, { name: "NextGen", w: 90 }, { name: "AdvancedMD", w: 100 }, { name: "eClinicalWorks", w: 105 }, { name: "athenahealth", w: 95 }, { name: "DrChrono", w: 75 }];
  return <Sec style={{ background: C.white, paddingTop: 80, paddingBottom: 80 }}>
    <Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><Label>Works with what you've got</Label><Heading s="md">Seamlessly integrates with<br />your EHR and CRM</Heading></div></Reveal>
    <Reveal delay={0.1}><div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>{logos.map(l => <div key={l.name} style={{ padding: "18px 28px", borderRadius: 14, border: `1px solid ${C.borderLight}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.35s", minWidth: l.w + 40 }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentLight; e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.children[0].style.opacity = "0.7"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.children[0].style.opacity = "0.25"; }}><span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.text, opacity: 0.25, transition: "opacity 0.35s" }}>{l.name}</span></div>)}</div></Reveal>
    <Reveal delay={0.2}><div style={{ textAlign: "center", marginTop: 40 }}><Txt style={{ fontSize: 13.5, maxWidth: 420, margin: "0 auto" }}>Don't see yours? We integrate with most major healthcare platforms through our flexible API layer.</Txt></div></Reveal>
  </Sec>;
}

function HomeFeatures() {
  const secs = [{ icon: "phone", c: C.warmSoft, ac: C.warm, title: "Streamline your front office", sub: "100% of calls answered, start to finish.", items: ["Schedule appointments 24/7", "Verify insurance upfront", "RCM assistant on autopilot", "Reconnect no-shows"] }, { icon: "growth", c: C.tealSoft, ac: C.tealMid, title: "Grow your practice", sub: "Smart, targeted outreach — no manual lift.", items: ["Convert warm leads instantly", "Targeted recall campaigns", "Close care gaps proactively", "Smart upsell recommendations"] }];
  return <Sec style={{ background: C.white }}>
    <Reveal><div style={{ textAlign: "center", marginBottom: 80 }}><Label>What we handle</Label><Heading s="lg">Take these off your<br />team's plate</Heading></div></Reveal>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{secs.map((s, i) => <Reveal key={i} delay={i * 0.1}><Glass hover={false} style={{ padding: "52px 56px" }}><div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}><div style={{ width: 56, height: 56, borderRadius: 16, background: s.c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={s.icon} size={26} color={s.ac} /></div><div style={{ flex: 1 }}><Heading s="sm" style={{ marginBottom: 6 }}>{s.title}</Heading><Txt>{s.sub}</Txt><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28 }}>{s.items.map((it, j) => <div key={j} style={{ fontFamily: F.sans, fontSize: 13.5, lineHeight: 1.7, color: C.textSoft, paddingLeft: 16, borderLeft: `2px solid ${s.ac}`, fontWeight: 350 }}>{it}</div>)}</div></div></div></Glass></Reveal>)}</div>
  </Sec>;
}

function WhyDifferent() {
  const navigate = useNavigate();
  const items = [{ icon: "lightning", t: "Scales like software, feels like staff" }, { icon: "link", t: "Plays nice with your tools" }, { icon: "star", t: "No IT team required" }, { icon: "chat", t: "Conversations, not phone trees" }];
  return <Sec><Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}><div><Label>Better access, better experience</Label><Heading s="md">Why Vaklab AI<br />is different</Heading><div style={{ marginTop: 36 }}><Btn v="secondary" onClick={() => navigate("/product")}>Explore the product</Btn></div></div><div>{items.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 8px", borderBottom: i < items.length - 1 ? `1px solid ${C.borderLight}` : "none", transition: "all 0.3s", borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.background = C.bg2; }} onMouseLeave={e => { e.currentTarget.style.paddingLeft = "8px"; e.currentTarget.style.background = "transparent"; }}><span style={{ width: 32, display: "flex", justifyContent: "center" }}><Icon name={item.icon} size={20} color={C.accentMid} /></span><span style={{ fontFamily: F.serif, fontSize: 22, color: C.text, fontWeight: 400 }}>{item.t}</span></div>)}</div></div></Reveal></Sec>;
}

function Security() {
  return <Sec style={{ background: C.white }}><Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}><div><Label>Privacy & security at our core</Label><Heading s="md">Medical interactions are the most private thing an AI can do.</Heading><Txt style={{ marginTop: 16 }}>Best-in-class privacy standards, always.</Txt><div style={{ display: "flex", gap: 12, marginTop: 28 }}>{["HIPAA Compliant", "SOC 2 Type II"].map(b => <span key={b} style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.12em", border: `1.5px solid ${C.border}`, borderRadius: 100, padding: "8px 20px", color: C.textSoft }}>{b}</span>)}</div></div>
    <div style={{ display: "flex", justifyContent: "center" }}><div style={{ position: "relative", width: 260, height: 260 }}>{[65, 92, 120].map((r, i) => <div key={i} style={{ position: "absolute", left: 130 - r, top: 130 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `1px ${i === 0 ? "solid" : "dashed"} ${C.accentLight}`, opacity: 0.45 - i * 0.1, animation: `spin ${22 + i * 10}s linear infinite${i % 2 ? " reverse" : ""}` }} />)}<div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${C.accentSoft},${C.white})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadowGlow }}><Icon name="lock" size={28} color={C.accentMid} /></div></div></div></div></Reveal></Sec>;
}

function HomeSolutions() {
  const navigate = useNavigate();
  const items = [{ n: "Dentistry", ic: "tooth", l: "Get more smiles through the door", p: "/specialty/dentist" }, { n: "Urgent Care", ic: "urgentcare", l: "Make every minute count", p: "/specialty/urgent-care" }, { n: "Mental Health", ic: "brain", l: "Grow your practice with empathy", p: "/specialty/mental-health" }, { n: "Orthopedics", ic: "bone", l: "Keep patients moving forward", p: "/specialty/orthopedics" }, { n: "Dermatology", ic: "sparkle", l: "Clear schedules, clear skin" }, { n: "ENT", ic: "ear", l: "Hear the difference" }, { n: "Veterinary", ic: "paw", l: "Less phone tag" }, { n: "Optometry", ic: "eye", l: "A clear vision for care" }];
  return <Sec style={{ background: C.white }}><Reveal><div style={{ textAlign: "center", marginBottom: 64 }}><Label>Specialty</Label><Heading s="lg">Purpose-built for<br />your practice</Heading></div></Reveal>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>{items.map((s, i) => <Reveal key={s.n} delay={i * 0.04}><Glass style={{ padding: "32px 24px", cursor: s.p ? "pointer" : "default" }} onClick={() => s.p && navigate(s.p)}><Icon name={s.ic} size={28} color={C.textSoft} /><div style={{ fontFamily: F.serif, fontSize: 19, color: C.text, margin: "14px 0 6px", fontWeight: 500 }}>{s.n}</div><Txt style={{ fontSize: 12.5 }}>{s.l}</Txt></Glass></Reveal>)}</div>
  </Sec>;
}

function CtaBlock() {
  const navigate = useNavigate();
  const scrollToDemo = () => { navigate("/"); const scroll = () => { const el = document.getElementById("live-demo"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); else setTimeout(scroll, 100); }; setTimeout(scroll, 200); };
  return <Sec><Reveal><div style={{ borderRadius: 28, padding: "108px 56px", textAlign: "center", position: "relative", overflow: "hidden", background: C.bg2 }}><Orb color={C.accentSoft} size={500} top={-250} left={-150} opacity={0.5} blur={90} /><Orb color={C.warmSoft} size={400} bottom={-200} right={-100} opacity={0.45} blur={80} /><Blob color={C.accentLight} size={200} top={-50} right={100} opacity={0.06} /><div style={{ position: "relative", zIndex: 1 }}><Label>Let Vaklab AI handle it</Label><Heading s="lg">Free your team.<br /><span style={{ fontStyle: "italic" }}>Delight your patients.</span></Heading><div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 48 }}><Btn onClick={scrollToDemo}>Try Sierra</Btn><Btn v="secondary">Book a Call</Btn></div></div></div></Reveal></Sec>;
}

function HomePage() {
  return <><HomeHero /><HomeLiveDemo /><HomeValueProps /><DashboardShowcase /><HomeIntegrations /><HomeFeatures /><WhyDifferent /><Security /><HomeSolutions /><CtaBlock /></>;
}

/* ═══════ PRODUCT PAGE ═══════ */
function ProductPage() {
  const [v, sV] = useState(false); useEffect(() => { setTimeout(() => sV(true), 80); }, []);
  const a = (d) => ({ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(36px)", transition: `all 1s cubic-bezier(0.22,1,0.36,1) ${d}s` });
  const features = [{ icon: "link", title: "Secure integration", desc: "Safe, seamless API connection to your EHR, CRM, and PMS." }, { icon: "clock", title: "24/7 availability", desc: "Answers calls & texts anytime. Only paid when working." }, { icon: "mic", title: "Customizable voices", desc: "Tailor personality, accent, speed to match your practice." }, { icon: "chart", title: "Analytics & reporting", desc: "Actionable insights — a crystal ball for your ops." }];
  const cases = ["Scheduling & Reminders", "Medication Adherence", "Insurance Verification", "Patient Retention", "Enrollment & Intake", "Inbound Call Management"];
  const sps = ["Chiropractic", "Concierge", "Dentistry", "Dermatology", "Fertility", "Home Health", "Imaging", "Med Spa", "Mental Health", "Optometry", "Orthopedics", "Pediatrics", "Physical Therapy", "Primary Care", "Veterinary Care", "Virtual Care", "Women's Health"];
  return <>
    <Sec style={{ paddingTop: 160, minHeight: "88vh" }}><Orb color={C.accentSoft} size={600} top={-200} left={-200} blur={80} /><Blob color={C.warmSoft} size={250} top={200} right={0} opacity={0.05} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}><div><div style={a(0)}><Label>Show don't tell</Label></div><div style={a(0.06)}><Heading s="hero" style={{ fontSize: "clamp(44px,5.5vw,74px)" }}>Meet Sierra.<br /><span style={{ fontStyle: "italic", color: C.accentMid }}>The AI assistant</span><br />purpose-built for<br />healthcare.</Heading></div><div style={{ ...a(0.2), marginTop: 36 }}><Btn v="accent" style={{ padding: "16px 38px", fontSize: 15 }}>Try it Out</Btn></div></div>
      <div style={{ ...a(0.25), display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}><Glass style={{ padding: "36px 40px", textAlign: "center", width: "100%" }}><Heading s="sm">Vaklab AI in action:</Heading><div style={{ width: 60, height: 60, borderRadius: "50%", border: `2px solid ${C.border}`, margin: "24px auto", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: C.bg, transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentMid; e.currentTarget.style.boxShadow = C.shadowGlow; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}><span style={{ fontSize: 18, marginLeft: 3, color: C.accentMid }}>▶</span></div><Label>Watch it work</Label></Glass></div></div></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ textAlign: "center", marginBottom: 72 }}><Label>Features</Label><Heading s="lg">Vaklab AI offers:</Heading></div></Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{features.map((f, i) => <Reveal key={i} delay={i * 0.05}><Glass style={{ padding: "48px 40px", height: "100%" }}><div style={{ display: "block", marginBottom: 16 }}><Icon name={f.icon} size={28} color={C.accentMid} /></div><Heading s="sm" style={{ marginBottom: 8 }}>{f.title}</Heading><Txt style={{ fontSize: 14.5 }}>{f.desc}</Txt></Glass></Reveal>)}</div></Sec>
    <Sec><Reveal><div style={{ textAlign: "center", marginBottom: 64 }}><Label>Get results</Label><Heading s="lg">Vaklab AI delivers:</Heading></div></Reveal><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{[{ c: `linear-gradient(160deg,${C.warmSoft},${C.bg})`, t: "More revenue", s: "without more headcount" }, { c: `linear-gradient(160deg,${C.accentSoft},${C.bg})`, t: "Patient-first timelines", s: "not staff timelines" }, { c: `linear-gradient(160deg,${C.tealSoft},${C.bg})`, t: "Exemplary care", s: "for every patient" }].map((item, i) => <Reveal key={i} delay={i * 0.06}><Glass style={{ padding: "52px 28px", textAlign: "center", background: item.c, height: "100%" }}><Heading s="sm" style={{ marginBottom: 8 }}>{item.t}</Heading><Txt style={{ fontSize: 13.5 }}>{item.s}</Txt></Glass></Reveal>)}</div></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}><div><Label>Use Cases</Label><Heading s="lg">Sierra handles:</Heading><div style={{ marginTop: 28 }}><Btn v="accent">Try it Out</Btn></div></div><div>{cases.map((c, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0", borderBottom: `1px solid ${C.borderLight}`, transition: "padding-left 0.3s" }} onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"} onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}><div style={{ width: 36, height: 36, borderRadius: 10, background: C.warmSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={["calendar", "pill", "card", "refresh", "clipboard", "phone"][i]} size={18} color={C.warmMid} /></div><span style={{ fontFamily: F.serif, fontSize: 20, color: C.text, fontWeight: 400 }}>{c}</span></div>)}</div></div></Reveal></Sec>
    <Sec><Reveal><div style={{ textAlign: "center" }}><Label>About you</Label><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 22px", maxWidth: 700, margin: "24px auto 0" }}>{sps.map((s, i) => <span key={s} style={{ fontFamily: F.serif, fontSize: 20, color: C.text, opacity: 0.15 + Math.abs(Math.sin(i * 0.55)) * 0.55, cursor: "pointer", transition: "all 0.4s", padding: "4px 0", fontWeight: 400 }} onMouseEnter={e => { e.target.style.opacity = "1"; e.target.style.color = C.accentMid; }} onMouseLeave={e => { e.target.style.opacity = String(0.15 + Math.abs(Math.sin(i * 0.55)) * 0.55); e.target.style.color = C.text; }}>{s}{i < sps.length - 1 && <span style={{ margin: "0 4px", opacity: 0.2 }}>·</span>}</span>)}</div></div></Reveal></Sec>
    <Sec style={{ background: C.white, paddingTop: 64, paddingBottom: 64 }}><Reveal><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48 }}>{[{ ic: "shield", t: "HIPAA Compliant", s: "End-to-end encryption" }, { ic: "lock", t: "SOC 2 Type II", s: "Audited security controls" }, { ic: "medical", t: "BAA Ready", s: "Business associate agreements" }].map((b, i) => <Fragment key={i}>{i > 0 && <div style={{ width: 1, height: 36, background: C.border }} />}<div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}><Icon name={b.ic} size={22} color={C.textSoft} /></div><div><div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>{b.t}</div><div style={{ fontFamily: F.sans, fontSize: 11, color: C.textFaint, fontWeight: 350 }}>{b.s}</div></div></div></Fragment>)}</div></Reveal></Sec>
    <CtaBlock />
  </>;
}

/* ═══════ SPECIALTY TEMPLATE ═══════ */
function FaqItem({ q, a, color, last }) { const [o, sO] = useState(false); return <div style={{ borderBottom: last ? "none" : `1px solid ${C.borderLight}` }}><div onClick={() => sO(!o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", cursor: "pointer", transition: "padding-left 0.2s" }} onMouseEnter={e => e.currentTarget.style.paddingLeft = "6px"} onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}><span style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 500, color: C.text }}>{q}</span><span style={{ fontFamily: F.serif, fontSize: 26, color: C.textSoft, transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)", transform: o ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 16 }}>+</span></div><div style={{ maxHeight: o ? 200 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)" }}><Txt style={{ fontSize: 14, paddingBottom: 24, paddingLeft: 14, borderLeft: `2px solid ${color}` }}>{a}</Txt></div></div>; }

function SpecialtyPage({ config: cf }) {
  const [v, sV] = useState(false); const [locs, sL] = useState(20); const [calls, sC2] = useState(3750); const [cost, sCo] = useState(cf.avgCost);
  useEffect(() => { setTimeout(() => sV(true), 80); sL(20); sC2(3750); sCo(cf.avgCost); }, [cf]);
  const a = (d) => ({ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(36px)", transition: `all 1s cubic-bezier(0.22,1,0.36,1) ${d}s` });
  const annual = Math.round(locs * (calls / locs) * 0.15 * cost * 52 / locs * 0.1) * locs;

  return <>
    <Sec style={{ paddingTop: 160 }}><Orb color={cf.orbColor} size={650} top={-280} right={-250} opacity={0.4} blur={80} /><Blob color={cf.accentColor} size={200} top={300} left={-60} opacity={0.04} /><GridBg /><div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}><div style={a(0)}><Label>{cf.label}</Label></div><div style={a(0.06)}><Heading s="hero" style={{ fontSize: "clamp(42px,6vw,72px)" }}>{cf.headline}</Heading></div><div style={{ ...a(0.16), maxWidth: 480, margin: "28px auto 0" }}><Txt style={{ fontSize: 17 }}>{cf.subhead}</Txt></div><div style={{ ...a(0.26), marginTop: 40 }}><Btn v="accent" style={{ padding: "15px 38px" }}>Run The Numbers</Btn></div></div><div style={{ ...a(0.34), marginTop: 48, display: "flex", justifyContent: "center" }}><WaveAnim color={cf.accentColor} bars={64} /></div></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><Heading s="md">The admin load is real. <span style={{ fontStyle: "italic" }}>So is the upside.</span></Heading></div></Reveal><Reveal delay={0.08}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}><Glass hover={false} style={{ padding: "48px 40px" }}><div style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft, marginBottom: 4 }}>Your annual increase *</div><div style={{ fontFamily: F.serif, fontSize: 56, color: C.text, letterSpacing: "-0.03em", marginBottom: 32, fontWeight: 400 }}>${annual.toLocaleString()}</div>{[{ label: "Number of locations", val: locs, set: sL }, { label: "Total weekly calls", val: calls, set: sC2 }, { label: "Average visit cost", val: cost, set: sCo, prefix: "$" }].map((f, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft, marginBottom: 5 }}>{f.label}</div><div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "11px 16px", background: C.white }}>{f.prefix && <span style={{ fontFamily: F.sans, fontSize: 14, color: C.textSoft, marginRight: 4 }}>{f.prefix}</span>}<input type="number" value={f.val} onChange={e => f.set(Number(e.target.value) || 0)} style={{ border: "none", outline: "none", fontFamily: F.sans, fontSize: 14, color: C.text, width: "100%", background: "transparent", fontWeight: 450 }} /></div></div>)}<div style={{ fontFamily: F.sans, fontSize: 11, color: C.textFaint, marginTop: 8 }}>*Estimates. <span style={{ textDecoration: "underline", cursor: "pointer", color: C.textSoft }}>Connect for details.</span></div></Glass><div><Txt style={{ fontWeight: 500, color: C.text, fontSize: 17, marginBottom: 24 }}>With Vaklab AI, {cf.practiceType} can:</Txt>{cf.benefits.map((b, i) => <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}><div style={{ width: 28, height: 28, borderRadius: 8, background: cf.softColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><Icon name={["calendar", "phone", "refresh"][i]} size={14} color={cf.accentColor} /></div><Txt style={{ fontSize: 14.5 }}><strong style={{ color: C.text, fontWeight: 600 }}>{b.bold}</strong> {b.rest}</Txt></div>)}<div style={{ marginTop: 28 }}><Btn v="accent">Book a Call</Btn></div></div></div></Reveal></Sec>
    <Sec><Reveal><div style={{ textAlign: "center", marginBottom: 16 }}><Heading s="md">{cf.featureHeadline}</Heading></div></Reveal><div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 56 }}>{cf.features.map((f, i) => <Reveal key={i} delay={i * 0.08}><Glass hover={false} style={{ padding: "48px 52px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" }}><div style={{ order: i % 2 }}><div style={{ background: C.bg2, borderRadius: 18, padding: 24, border: `1px solid ${C.borderLight}` }}><div style={{ display: "flex", gap: 5, marginBottom: 14 }}>{f.tags.map(t => <span key={t} style={{ fontFamily: F.mono, fontSize: 8.5, background: cf.softColor, color: cf.accentColor, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.04em" }}>{t}</span>)}</div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 26, height: 26, borderRadius: "50%", background: cf.softColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 13, color: cf.accentColor, fontWeight: 600 }}>S</div><span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: C.text }}>Sierra</span><WaveAnim color={cf.accentColor} bars={10} /></div><div style={{ fontFamily: F.sans, fontSize: 12.5, color: C.textMid, lineHeight: 1.65, background: C.white, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.borderLight}`, fontWeight: 350 }}>{f.sampleMsg}</div></div></div><div style={{ order: i % 2 === 0 ? 1 : 0 }}><Heading s="sm" style={{ marginBottom: 10 }}>{f.title}</Heading><Txt style={{ fontSize: 14.5 }}>{f.desc}</Txt><div style={{ marginTop: 24 }}><Btn v="ghost">Book a Call →</Btn></div></div></div></Glass></Reveal>)}</div></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 64, alignItems: "center" }}><div><Label>Trusted by leaders in care</Label><Heading s="md">Don't just take<br />our word for it.</Heading></div><div style={{ borderLeft: `2px solid ${cf.accentColor}`, paddingLeft: 36 }}><Label>Complete game-changer</Label><p style={{ fontFamily: F.serif, fontSize: 21, lineHeight: 1.55, color: C.text, margin: "14px 0 24px", fontStyle: "italic", fontWeight: 400 }}>"{cf.testimonial}"</p><span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.12em", color: C.textSoft, textTransform: "uppercase" }}>CEO</span><br /><span style={{ fontFamily: F.sans, fontSize: 13, color: C.textSoft, fontWeight: 350 }}>{cf.testimonialOrg}</span><div style={{ marginTop: 20 }}><BadgeRotate /></div></div></div></Reveal></Sec>
    <Sec dark><Orb color="rgba(99,102,241,0.1)" size={500} top={-200} right={-100} blur={100} /><Reveal><div style={{ textAlign: "center", marginBottom: 52 }}><Label light>{cf.statsLabel}</Label><Heading s="md" light>Real results. Happy teams. {cf.statsTagline}</Heading></div></Reveal><Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, textAlign: "center" }}>{[{ v: "95%", l: "LESS patient wait time" }, { v: "100%", l: "Call answer rate" }, { v: "20%", l: "More appointments" }].map((d, i) => <div key={i} style={{ padding: "52px 24px", borderRadius: 18, border: `1px solid ${C.darkBorder}`, background: "rgba(255,255,255,0.015)", transition: "all 0.4s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.boxShadow = C.shadowGlow; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.darkBorder; e.currentTarget.style.boxShadow = "none"; }}><div style={{ fontFamily: F.serif, fontSize: 64, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: 8, fontWeight: 400 }}>{d.v}</div><div style={{ fontFamily: F.sans, fontSize: 12.5, color: "rgba(255,255,255,0.55)", fontWeight: 350 }}>{d.l}</div></div>)}</div></Reveal></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><Label>A tale of two practices</Label><Heading s="md">Vaklab AI vs the status quo</Heading></div><Glass hover={false} style={{ overflow: "hidden", padding: 0, borderRadius: 20 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${C.borderLight}` }}><div style={{ padding: "18px 36px", fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>With Vaklab AI</div><div style={{ padding: "18px 36px", fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: C.textSoft }}>Without</div></div>{[["Every call answered", "Messy phone trees"], ["Staff focused on patients", "Staff pulled from care"], ["Automatic outbound comms", "Juggling spreadsheets"], ["Seamless branded outreach", "Manual billing reminders"], ["24/7/365 support", "Limited 9-5 availability"]].map((row, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none" }}><div style={{ padding: "16px 36px", display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 22, height: 22, borderRadius: "50%", background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} color={C.tealMid} strokeWidth={2.5} /></span><span style={{ fontFamily: F.sans, fontSize: 13.5, color: C.text, fontWeight: 450 }}>{row[0]}</span></div><div style={{ padding: "16px 36px", display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 22, height: 22, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="cross" size={12} color={C.rose} strokeWidth={2.5} /></span><span style={{ fontFamily: F.sans, fontSize: 13.5, color: C.textSoft, fontWeight: 350 }}>{row[1]}</span></div></div>)}</Glass></Reveal></Sec>
    <Sec><Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><Label>{cf.onboardLabel}</Label><Heading s="md">Your AI Assistant in three easy steps</Heading></div><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{[{ n: "1", t: "Team up", d: "We learn your workflows and prep for a seamless start." }, { n: "2", t: "Meet Sierra", d: "We tailor Sierra to answer, route, schedule, and text like staff." }, { n: "3", t: "Go Live", d: "Results on day one — more calls, fewer tasks, happier patients." }].map((step, i) => <Glass key={i} style={{ padding: "44px 28px", textAlign: "center" }}><div style={{ width: 48, height: 48, borderRadius: 100, border: `2px solid ${cf.accentColor}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 20, color: cf.accentColor, marginBottom: 20, fontWeight: 500 }}>{step.n}</div><Heading s="sm" style={{ marginBottom: 10 }}>{step.t}</Heading><Txt style={{ fontSize: 13.5 }}>{step.d}</Txt></Glass>)}</div></Reveal></Sec>
    <Sec style={{ background: C.white }}><Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}><div><Heading s="md">{cf.pricingTitle}</Heading><Txt style={{ marginTop: 14 }}>Your plan scales to the volume of your practice.</Txt><div style={{ marginTop: 28 }}><Btn v="accent">Book a Call</Btn></div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{[{ ic: "check", t: "3-month risk-free pilot" }, { ic: "shield", t: "Flat monthly rate" }, { ic: "refresh", t: "Ongoing support & tuning" }, { ic: "growth", t: "No questions exit clause" }].map((p, i) => <Glass key={i} style={{ padding: "24px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}><span style={{ flexShrink: 0, marginTop: 1 }}><Icon name={p.ic} size={16} color={cf.accentColor} /></span><span style={{ fontFamily: F.sans, fontSize: 13, color: C.text, fontWeight: 500 }}>{p.t}</span></Glass>)}</div></div></Reveal></Sec>
    <Sec><Reveal><div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64 }}><div><Heading s="md">Questions?<br /><span style={{ fontStyle: "italic" }}>Answers.</span></Heading><div style={{ marginTop: 24 }}><Btn v="accent">Book a Call</Btn></div></div><div>{cf.faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} color={cf.accentColor} last={i === cf.faqs.length - 1} />)}</div></div></Reveal></Sec>
    <CtaBlock />
  </>;
}

/* ═══════ CONFIGS ═══════ */
const SP = {
  "dentist": { label: "Dentistry", headline: "Helping busy dental practices get more smiles through the door", subhead: "Sierra handles calls, texts, and tasks. Your team handles the dentistry.", practiceType: "dental practices", avgCost: 150, orbColor: C.warmSoft, accentColor: C.warmMid, softColor: C.warmSoft, benefits: [{ bold: "Book more appointments,", rest: "day or night" }, { bold: "Free up staff", rest: "from phones and follow-ups" }, { bold: "Keep patients coming back", rest: "on time" }], featureHeadline: "Let your team focus on treatments, not tasks", features: [{ title: "24/7/365 Appointment scheduling", desc: "Book appointments anytime. No missed windows or overworked staff.", tags: ["Inbound Call", "Patient Verified"], sampleMsg: "Hi Vincent, time to schedule your next cleaning. Dr. DeLuc is available Friday." }, { title: "Patient Recall Campaigns", desc: "Gentle nudges for routine cleanings, preventive care, and follow-ups.", tags: ["6-mo Recall", "SMS Delivered"], sampleMsg: "It's been 6 months since your last cleaning. Shall I book you?" }, { title: "Smart upselling", desc: "Turn single services into comprehensive care plans with targeted add-ons.", tags: ["Add-On Services", "Upsell"], sampleMsg: "Since you're in for a cleaning Tuesday, would you like to add whitening?" }], testimonial: "Having every call answered within 5 seconds, 24/7, means we never miss a patient's call. The AI is incredibly natural about triaging calls.", testimonialOrg: "46-location dental practice", statsLabel: "From missed calls to brighter results", statsTagline: "Beaming patients.", onboardLabel: "Faster than a fluoride treatment", pricingTitle: "Crystal clear pricing", faqs: [{ q: "Will it sound human?", a: "Yes — natural language with customizable voice, tone, and pacing for your practice." }, { q: "Do I need to retrain my staff?", a: "No. Sierra works alongside your team. We handle setup and ongoing tuning." }, { q: "What if we use a niche EHR?", a: "We integrate with all major dental EHRs plus niche systems via our API." }, { q: "What languages do you support?", a: "English and Spanish natively, more on request." }] },
  "urgent-care": { label: "Urgent Care", headline: "Helping busy urgent care practices make every minute count", subhead: "Sierra handles calls, texts, and tasks. Your team handles care.", practiceType: "urgent care centers", avgCost: 150, orbColor: C.tealSoft, accentColor: C.tealMid, softColor: C.tealSoft, benefits: [{ bold: "Book more appointments,", rest: "day or night" }, { bold: "Free up staff", rest: "from phones and follow-ups" }, { bold: "Keep patients flowing", rest: "through your doors" }], featureHeadline: "Let your team focus on vitals, not voicemails", features: [{ title: "24/7/365 Appointment scheduling", desc: "Book anytime. No missed windows or overworked staff.", tags: ["Inbound Call", "Patient Verified"], sampleMsg: "We have a 15-minute wait at Main Street. Want to reserve a spot?" }, { title: "Post visit follow-ups", desc: "Proactive follow-up care that tracks recovery and concerns.", tags: ["Post-Visit", "Recovery Check"], sampleMsg: "Hi Cara, has the fever improved? Have you started the new prescription?" }, { title: "Automated billing", desc: "Autopilot RCM assistant that boosts collection rates.", tags: ["Bill Finalized", "SMS Delivered"], sampleMsg: "Your visit balance of $45 is ready. Pay securely via the link we texted." }], testimonial: "Every call answered within 5 seconds means we never miss a patient, even at 2 AM. The AI is incredibly natural.", testimonialOrg: "46-location urgent care", statsLabel: "From missed calls to rapid response", statsTagline: "Happier patients.", onboardLabel: "Faster than a strep test", pricingTitle: "Pricing with no surprises", faqs: [{ q: "Will it sound human?", a: "Yes — customized for urgent care workflows and patient expectations." }, { q: "Do I need to retrain my staff?", a: "Not at all. Seamless integration from day one." }, { q: "What if we use a niche EHR?", a: "We support major urgent care EHRs with a flexible integration layer." }, { q: "What languages do you support?", a: "English and Spanish out of the box, more on request." }] },
  "mental-health": { label: "Mental Health", headline: "Helping busy mental health clinicians grow their practice", subhead: "Sierra handles calls, texts, and tasks. Your team handles therapeutic care.", practiceType: "mental health practices", avgCost: 200, orbColor: C.accentSoft, accentColor: C.accentMid, softColor: C.accentSoft, benefits: [{ bold: "Book more appointments,", rest: "day or night" }, { bold: "Free up staff", rest: "from phones and follow-ups" }, { bold: "Keep clients coming back", rest: "on time" }], featureHeadline: "Let your team focus on care, not call management", features: [{ title: "Around-the-clock triage", desc: "Assess urgent calls from existing clients anytime with immediate evaluation.", tags: ["Inbound Call", "Crisis Assessed"], sampleMsg: "Thank you for calling. I've scheduled an urgent session tomorrow at 9am with Dr. Martinez." }, { title: "Reduce treatment gaps", desc: "Compassionate re-engagement encourages clients to continue therapy.", tags: ["3-wk followup", "Empathetic response"], sampleMsg: "Hi Serah, how're you feeling since we paused? Mondays still work? How's 2pm?" }, { title: "Referral conversion", desc: "Convert referrals into ongoing therapeutic relationships with personalized follow-up.", tags: ["Referral Received", "Intake Complete"], sampleMsg: "See you Tue, Aug 19 @ 10am, Cora. We look forward to meeting you!" }], testimonial: "Sierra freed our staff to focus on care while ensuring every patient gets the attention they deserve.", testimonialOrg: "46-location mental health practice", statsLabel: "From missed calls to breakthroughs", statsTagline: "Empowered patients.", onboardLabel: "Up and running in no time", pricingTitle: "Crystal clear pricing", faqs: [{ q: "Will it sound human?", a: "Absolutely. Trained for empathetic, sensitive communication." }, { q: "Do I need to retrain my staff?", a: "No. We handle all configuration." }, { q: "What if we use a niche EHR?", a: "We work with TherapyNotes, SimplePractice, and more." }, { q: "What languages do you support?", a: "English and Spanish natively, more on request." }] },
  "orthopedics": { label: "Orthopedics", headline: "Helping orthopedic practices keep patients moving forward", subhead: "Sierra handles calls, texts, and tasks. Your team handles the care.", practiceType: "orthopedic practices", avgCost: 250, orbColor: C.warmSoft, accentColor: "#B45309", softColor: "#FEF3C7", benefits: [{ bold: "Book more appointments,", rest: "day or night" }, { bold: "Free up staff", rest: "from phones and follow-ups" }, { bold: "Keep patients on track", rest: "with recovery" }], featureHeadline: "Let your team focus on recovery, not phone trees", features: [{ title: "24/7 Appointment scheduling", desc: "Book consults, follow-ups, and imaging anytime.", tags: ["Inbound Call", "Schedule Updated"], sampleMsg: "Hi Mark, your post-op follow-up with Dr. Chen is set for Thursday at 10am." }, { title: "Post-surgical follow-up", desc: "Proactive outreach ensures patients stay on recovery plans.", tags: ["2-wk Post-Op", "PT Reminder"], sampleMsg: "How's the knee two weeks post-surgery? Your next PT is Friday at 2pm — confirm?" }, { title: "Insurance pre-auth", desc: "Streamline pre-authorization and manage referral intake.", tags: ["Pre-Auth Approved", "Referral Done"], sampleMsg: "Great news — your MRI pre-auth is approved. Openings tomorrow or Friday." }], testimonial: "Sierra answers every call instantly and manages complex scheduling across surgeons, imaging, and PT.", testimonialOrg: "28-location orthopedic group", statsLabel: "From missed calls to stronger outcomes", statsTagline: "Patients moving.", onboardLabel: "Smoother than a joint replacement", pricingTitle: "Straightforward pricing", faqs: [{ q: "Will it sound human?", a: "Yes — natural voice with appropriate orthopedic terminology." }, { q: "Can it handle multi-provider scheduling?", a: "Absolutely. Coordinates surgeons, imaging, PT, and follow-ups." }, { q: "What if we use a niche EHR?", a: "We integrate with orthopedic-focused and all major platforms." }, { q: "What languages do you support?", a: "English and Spanish, more on request." }] },
  "fertility": { label: "Fertility", headline: "Helping fertility clinics nurture every patient journey", subhead: "Sierra handles calls, texts, and tasks. Your team handles the care that matters most.", practiceType: "fertility clinics", avgCost: 350, orbColor: C.roseSoft, accentColor: "#BE185D", softColor: "#FFF1F2", benefits: [{ bold: "Book more consultations,", rest: "day or night" }, { bold: "Free up staff", rest: "from phones and follow-ups" }, { bold: "Keep patients engaged", rest: "through every cycle" }], featureHeadline: "Let your team focus on care, not coordination", features: [{ title: "24/7 Appointment scheduling", desc: "Book initial consults, monitoring visits, and follow-ups around the clock.", tags: ["Inbound Call", "Consult Booked"], sampleMsg: "Hi Sarah, I've booked your initial consultation with Dr. Rivera for Monday at 9am." }, { title: "Cycle monitoring coordination", desc: "Proactive outreach keeps patients on track with time-sensitive monitoring.", tags: ["Cycle Day 3", "Monitoring Set"], sampleMsg: "Good morning — your Day 10 monitoring is confirmed for tomorrow at 7:30am." }, { title: "Compassionate follow-up", desc: "Sensitive, timely follow-up after procedures, ensuring patients feel supported.", tags: ["Post-Transfer", "Check-in Sent"], sampleMsg: "Hi Sarah, just checking in after your transfer. How are you feeling?" }], testimonial: "Sierra handles the complexity of our scheduling while our nurses focus entirely on patient care and support.", testimonialOrg: "14-location fertility network", statsLabel: "From missed calls to growing families", statsTagline: "Hopeful patients.", onboardLabel: "Up and running in no time", pricingTitle: "Crystal clear pricing", faqs: [{ q: "Will it sound human?", a: "Yes — trained for compassionate, sensitive communication essential in fertility care." }, { q: "Can it handle cycle-based scheduling?", a: "Absolutely. Coordinates monitoring, procedures, consults, and follow-ups." }, { q: "What if we use a niche EHR?", a: "We integrate with fertility-specific platforms and all major EHR systems." }, { q: "What languages do you support?", a: "English and Spanish natively, more on request." }] },
};

function SpecialtyRoute() {
  const { slug } = useParams();
  const config = SP[slug];
  if (!config) return <div style={{ padding: "200px 48px", textAlign: "center" }}><Heading s="md">Specialty not found</Heading></div>;
  return <SpecialtyPage config={config} />;
}

/* ═══════ FOOTER ═══════ */
function Footer() {
  const navigate = useNavigate();
  const go = (p) => navigate(p);
  const cols = [
    { title: "Product", items: [{ l: "Meet the Product", p: "/product" }, { l: "Book a Call" }] },
    { title: "Specialty", items: [{ l: "Dentistry", p: "/specialty/dentist" }, { l: "Urgent Care", p: "/specialty/urgent-care" }, { l: "Mental Health", p: "/specialty/mental-health" }, { l: "Fertility", p: "/specialty/fertility" }] },
    { title: "Company", items: [{ l: "Email Us", href: "mailto:support@vaklabai.com" }] },
  ];
  return (
    <footer style={{ background: "linear-gradient(180deg, #1E1B4B 0%, #1a1744 100%)", padding: "96px 48px 44px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3,1fr)", gap: 44, marginBottom: 80 }}>
          <div>
            <Label light>Join the conversation</Label>
            <p style={{ fontFamily: F.serif, fontSize: 28, color: "rgba(255,255,255,0.85)", lineHeight: 1.35, margin: "0 0 28px", fontWeight: 400 }}>Share in what we're learning & what's new in healthcare AI.</p>
            <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.accentLight, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = C.accentLight}>Follow on LinkedIn →</span>
          </div>
          {cols.map(c => <div key={c.title}><div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 22 }}>{c.title}</div>
            {c.items.map(i => i.href
                ? <a key={i.l} href={i.href} style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.55)", padding: "5px 0", display: "block", textDecoration: "none", transition: "all 0.3s", fontWeight: 350 }} onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{i.l}</a>
                : <div key={i.l} onClick={() => i.p && go(i.p)} style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.55)", padding: "5px 0", cursor: i.p ? "pointer" : "default", transition: "all 0.3s", fontWeight: 350 }} onMouseEnter={e => { e.target.style.color = "rgba(255,255,255,0.9)"; if (i.p) e.target.style.paddingLeft = "4px"; }} onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.55)"; e.target.style.paddingLeft = "0"; }}>{i.l}</div>)}</div>)}
        </div>
        <div style={{ borderTop: "1px solid rgba(165,180,252,0.15)", paddingTop: 24, display: "flex", justifyContent: "space-between", fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 350 }}><span>© 2025 Vaklab AI</span><div style={{ display: "flex", gap: 24 }}><span style={{ cursor: "pointer" }}>Privacy Policy</span><span style={{ cursor: "pointer" }}>Cookie Settings</span></div></div>
      </div>
    </footer>
  );
}

/* ═══════ APP WITH ROUTES ═══════ */

export default function App() {
  return (
    <div style={{ fontFamily: F.sans, color: C.text, background: C.bg, minHeight: "100vh", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      <style>{GCSS}</style>
      <div className="grain" />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/specialty/:slug" element={<SpecialtyRoute />} />
      </Routes>
      <Footer />
    </div>
  );
}
