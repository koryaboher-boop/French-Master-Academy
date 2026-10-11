/* ============================================================
   French Master Academy — أكاديمية إتقان الفرنسية
   تطبيق مستقل يعمل دون إنترنت (النسخة الثابتة HTML)
   Vanilla JS SPA · Hash Router · localStorage · PWA-ready
   المحتوى: 6 مستويات (A0→C1) · فيديوهات موثّقة · تمارين تفاعلية
   ============================================================ */
(() => {
'use strict';

/* ---------- shortcuts ---------- */
const $ = (sel, el) => (el || document).querySelector(sel);
const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const appEl = () => $('#app');
const ORN = '<span class="orn" aria-hidden="true">✻</span>';

/* ---------- inline SVG icons (feather-style) ---------- */
const P = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  quote: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  rotate: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grad: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
};
const ic = (n, s) => '<svg class="ic" width="' + (s || 16) + '" height="' + (s || 16) +
  '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';

/* ---------- helpers ---------- */
function shade(hex, pct) {
  try {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = pct < 0 ? 0 : 255, p = Math.abs(pct) / 100;
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch (e) { return hex; }
}
const grad = (hex) => 'linear-gradient(145deg,' + hex + ' 0%,' + shade(hex, -45) + ' 130%)';
function normFr(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[.,!?;:«»"']/g, '').replace(/\s+/g, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function todayStr() { return new Date().toISOString().slice(0, 10); }
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

/* ---------- TTS (النطق الفرنسي) ---------- */
function speak(text, rate) {
  if (!('speechSynthesis' in window)) { toast('النطق الصوتي غير مدعوم في هذا المتصفح'); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text || ''));
    u.lang = 'fr-FR'; u.rate = rate || S.rate || 0.95;
    const vs = speechSynthesis.getVoices();
    const v = vs.find((x) => x.lang === 'fr-FR') || vs.find((x) => x.lang && x.lang.indexOf('fr') === 0);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { toast('تعذر تشغيل النطق الصوتي'); }
}
if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = () => {}; }

/* ---------- progress store ---------- */
const STORE_KEY = 'fma.static.v1';
let S = {
  done: {}, last: null, theme: 'light', free: true,
  xp: 0, streak: { count: 0, last: null },
  review: {}, level: null, placement: null, rate: 0.95,
};
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) S = Object.assign(S, JSON.parse(raw));
} catch (e) { /* private mode */ }
function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
function save() { persist(); }
function isDone(id) { return !!S.done[id]; }
function scoreOf(id) { const r = S.done[id]; return r ? r.s : null; }
function recordDone(id, score) {
  const first = !S.done[id];
  S.done[id] = { s: score, d: todayStr() };
  save();
  return first;
}
function setLast(lessonId) { S.last = { lessonId: lessonId }; save(); }
function touchStreak() {
  const t = todayStr();
  if (S.streak.last === t) return;
  const y = addDays(-1);
  S.streak = { count: S.streak.last === y ? (S.streak.count || 0) + 1 : 1, last: t };
  save();
}
function addXp(n) { S.xp = (S.xp || 0) + n; save(); }

/* ---------- data model ---------- */
const DATA = window.FMA_DATA || { levels: [] };
const LEVELS = DATA.levels || [];
const LEVEL_AR = {};
LEVELS.forEach((l) => { LEVEL_AR[l.code] = l.ar; });

const FLAT = [];   // [{level, track, lesson, ti, li}]
LEVELS.forEach((lv) => lv.tracks.forEach((t, ti) => t.lessons.forEach((l, li) => FLAT.push({ level: lv, track: t, lesson: l, ti: ti, li: li }))));
function lessonById(id) { for (const r of FLAT) if (r.lesson.id === id) return r; return null; }
function lessonLocked(ref) {
  if (S.free) return false;
  if (ref.li > 0) {
    const prev = ref.track.lessons[ref.li - 1];
    if (!isDone(prev.id)) return true;
  }
  return false;
}
function trackDone(t) { return t.lessons.filter((l) => isDone(l.id)).length; }
function trackPct(t) { return t.lessons.length ? Math.round(trackDone(t) / t.lessons.length * 100) : 0; }
function levelPct(lv) {
  let L = 0, D = 0;
  lv.tracks.forEach((t) => { L += t.lessons.length; D += trackDone(t); });
  return L ? Math.round(D / L * 100) : 0;
}
function nextIncomplete() {
  for (const r of FLAT) {
    if (isDone(r.lesson.id)) continue;
    if (lessonLocked(r)) continue;
    return r;
  }
  return null;
}
function globalStats() {
  let total = 0, done = 0, tracksFull = 0, sum = 0, n = 0, vocab = 0, ex = 0;
  LEVELS.forEach((lv) => lv.tracks.forEach((t) => {
    if (!t.lessons.length) return;
    total += t.lessons.length; done += trackDone(t);
    if (trackDone(t) === t.lessons.length) tracksFull++;
    t.lessons.forEach((l) => { vocab += l.vocab.length; ex += l.exercises.length; });
  }));
  for (const k of Object.keys(S.done)) { sum += S.done[k].s; n++; }
  return { total: total, done: done, tracksFull: tracksFull, avg: n ? Math.round(sum / n) : null, vocab: vocab, ex: ex };
}

/* ---------- toast ---------- */
function toast(msg) {
  const w = $('#toastWrap');
  if (!w) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, 2600);
}

/* ---------- theme ---------- */
function applyTheme() {
  document.documentElement.classList.toggle('dark', S.theme === 'dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', S.theme === 'dark' ? '#0B3B36' : '#0D9488');
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  save(); applyTheme();
  const b = $('#themeBtn');
  if (b) b.innerHTML = ic(S.theme === 'dark' ? 'sun' : 'moon', 18);
}

/* ---------- shared blocks ---------- */
function topbar() {
  const st = S.streak || { count: 0 };
  return '<header class="topbar">' +
    '<a class="brand" href="#/"><span class="logo">Fr</span><span>إتقان الفرنسية<small>من A0 إلى C1 بالعربية</small></span></a>' +
    '<span class="spacer"></span>' +
    '<span class="xp-chip" title="نقاط الخبرة">' + ic('zap', 13) + ' ' + (S.xp || 0) + '</span>' +
    '<span class="xp-chip streak" title="أيام متتالية">' + ic('flame', 13) + ' ' + (st.count || 0) + '</span>' +
    '<button class="icon-btn" id="themeBtn" aria-label="تبديل الوضع الليلي">' + ic(S.theme === 'dark' ? 'sun' : 'moon', 18) + '</button>' +
    '<a class="icon-btn" href="#/settings" aria-label="الإعدادات">' + ic('cog', 18) + '</a>' +
    '</header>';
}
function sidebar(view) {
  const nav = [
    ['home', '#/', 'home', 'الرئيسية'],
    ['levels', '#/levels', 'layers', 'المستويات'],
    ['review', '#/review', 'rotate', 'المراجعة'],
    ['placement', '#/placement', 'target', 'تحديد مستواي'],
    ['settings', '#/settings', 'cog', 'الإعدادات']
  ];
  const links = nav.map((n) => '<a class="sb-link' + (view === n[0] ? ' on' : '') + '" href="' + n[1] + '">' + ic(n[2], 17) + '<span>' + n[3] + '</span></a>').join('');
  const rows = LEVELS.map((lv) => {
    const pct = levelPct(lv);
    const on = view === 'level' && location.hash.indexOf('#/level/' + lv.code) === 0;
    return '<a class="sb-track' + (on ? ' on' : '') + '" href="#/level/' + lv.code + '">' +
      '<span class="sbt-dot" style="background:' + lv.color + '"></span>' +
      '<span class="sbt-nm">' + lv.code + ' · ' + esc(lv.ar) + '</span><span class="sbt-pct">' + pct + '%</span></a>';
  }).join('');
  const g = globalStats();
  const st = S.streak || { count: 0 };
  return '<aside class="sidebar" aria-label="التنقل الجانبي">' +
    '<a class="sb-brand" href="#/"><span class="logo">Fr</span><span>إتقان الفرنسية<small>French Master Academy</small></span></a>' +
    '<nav class="sb-nav">' + links + '</nav>' +
    '<div class="sb-label">مستوياتي</div>' +
    '<nav class="sb-tracks">' + rows + '</nav>' +
    '<div class="sb-foot">' +
    '<div class="sb-acct"><span class="acct-av big">Fr</span><div class="sba-tx"><b>نسخة مستقلة</b><small>تقدّمك محفوظ على جهازك</small></div></div>' +
    '<div class="sb-stat"><span><b>' + g.done + '</b> درسًا مكتملًا</span><span><b>' + (S.xp || 0) + '</b> نقطة خبرة</span><span><b>' + (st.count || 0) + '</b> يوم متتالٍ</span></div>' +
    '</div></aside>';
}
function foot() {
  const g = globalStats();
  return '<footer class="appfoot"><span class="orn">✻ ✻ ✻</span><br/>' +
    'أكاديمية إتقان الفرنسية — من A0 إلى C1 بشرح عربي<br/>' +
    g.total + ' درسًا · ' + g.ex + ' تمرينًا · ' + g.vocab + ' مفردة · الفيديوهات التعليمية مدمجة من يوتيوب مع توثيق مصادرها · يعمل دون إنترنت</footer>';
}
function bar(pct, green) {
  return '<div class="bar' + (green ? ' bar-green' : '') + '"><i style="width:' + pct + '%"></i></div>';
}
function levelTag(code) {
  const lv = LEVELS.find((x) => x.code === code);
  return '<span class="tag-level" style="background:' + (lv ? lv.color : '#0D9488') + '">' + esc(code + ' · ' + (lv ? lv.ar : '')) + '</span>';
}
function firstGlyph(title) {
  const t = String(title || '').replace(/^[«(\s]+/, '');
  return t ? t[0] : 'F';
}
function frTxt(s) { return '<span class="fr-txt" dir="ltr">' + esc(s) + '</span>'; }
