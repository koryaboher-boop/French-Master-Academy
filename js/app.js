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
const ICON_ALIAS = {
  pen: 'edit',
  users: 'user',
  '📖': 'book',
  '📚': 'layers',
  '✏️': 'edit',
  '🗣️': 'chat',
  '🎧': 'headphones',
  '✒️': 'edit',
  '💼': 'briefcase'
};
const ic = (n, s) => {
  const key = ICON_ALIAS[n] || n;
  return '<svg class="ic" width="' + (s || 16) + '" height="' + (s || 16) +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[key] || '') + '</svg>';
};

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

/* ============================================================
   ROUTER + VIEWS
   ============================================================ */
let currentRoute = '';
function navigate() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
  const view = parts[0] || 'home';
  currentRoute = view;
  applyTheme();
  const root = appEl();
  let html = '';
  try {
    if (view === 'home') html = viewHome();
    else if (view === 'levels') html = viewLevels();
    else if (view === 'level' && parts[1]) html = viewLevel(decodeURIComponent(parts[1]).toUpperCase());
    else if (view === 'track' && parts[1]) html = viewTrack(decodeURIComponent(parts[1]));
    else if (view === 'lesson' && parts[1]) html = viewLesson(parts[1]);
    else if (view === 'ex' && parts[1]) html = viewEx(parts[1]);
    else if (view === 'review') html = viewReview();
    else if (view === 'placement') html = viewPlacement();
    else if (view === 'settings') html = viewSettings();
    else if (view === 'continue') { goContinue(); return; }
    else html = viewHome();
  } catch (e) {
    html = '<div class="card soon-banner"><div class="orn">✻</div><h3>عذرًا، حدث خطأ</h3><p>' + esc(e.message) + '</p><p style="margin-top:12px"><a class="btn btn-primary" href="#/">العودة للرئيسية</a></p></div>';
  }
  root.innerHTML = '<div class="shell">' + sidebar(view) + '<div class="main-col">' + topbar() + '<div class="view">' + html + foot() + '</div></div></div>';
  const tb = $('#themeBtn');
  if (tb) tb.addEventListener('click', toggleTheme);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (view === 'ex') bindEx();
  if (view === 'review') bindReview();
  if (view === 'placement') bindEx();
  if (view === 'settings') bindSettings();
  updateTabbar(view);
}
function updateTabbar(view) {
  $$('#tabbar .tab').forEach((a) => a.classList.toggle('on', a.dataset.nav === view));
}
function goContinue() {
  if (S.last) {
    const r = lessonById(S.last.lessonId);
    if (r) { location.hash = '#/lesson/' + S.last.lessonId; return; }
  }
  const nx = nextIncomplete();
  if (nx) { location.hash = '#/lesson/' + nx.lesson.id; return; }
  location.hash = '#/';
  setTimeout(() => toast('أكملت كل الدروس المتاحة — برافو!'), 300);
}

/* ---------- view: home ---------- */
function viewHome() {
  const g = globalStats();
  const st = S.streak || { count: 0 };
  const continueCard = (() => {
    let target = null;
    if (S.last) { const r = lessonById(S.last.lessonId); if (r) target = r; }
    if (!target) target = nextIncomplete();
    if (!target) return '';
    return '<a class="card continue-card" href="#/lesson/' + target.lesson.id + '">' +
      '<span class="cc-ic">' + ic('play', 20) + '</span>' +
      '<span class="cc-main"><b>متابعة التعلم</b><small>' + esc(target.level.code + ' · ' + target.track.ar) + ' — ' + esc(target.lesson.ar) + '</small></span>' +
      '<span class="li-side">' + ic('chevL', 18) + '</span></a>';
  })();

  const levelCards = LEVELS.map((lv) => {
    const pct = levelPct(lv);
    const totalLessons = lv.tracks.reduce((a, t) => a + t.lessons.length, 0);
    const doneLessons = lv.tracks.reduce((a, t) => a + trackDone(t), 0);
    const nTracks = lv.tracks.length;
    return '<a class="card track-card" href="#/level/' + lv.code + '">' +
      '<span class="tc-band" style="background:' + lv.color + '"></span>' +
      '<span class="tc-icon" style="background:' + grad(lv.color) + '">' + esc(lv.code) + '</span>' +
      '<h3>' + esc(lv.ar) + ' <small style="font-weight:600;color:var(--muted)">· ' + esc(lv.fr) + '</small></h3>' +
      '<p>' + esc(lv.desc) + '</p>' +
      '<span class="tc-meta">' +
      '<span class="chip">' + nTracks + ' مسارات</span>' +
      '<span class="chip">' + totalLessons + ' درسًا</span>' +
      '<span class="chip ' + (pct === 100 ? 'chip-ok' : 'chip-gold') + '">' + (pct === 100 ? 'مكتمل' : pct + '%') + '</span>' +
      '</span>' +
      '<span class="cr-bar" style="display:flex;align-items:center;gap:8px;margin-top:10px">' +
      bar(pct) + '<span class="pct" style="font-size:11px;font-weight:600;color:var(--gold-deep)">' + doneLessons + '/' + totalLessons + '</span></span>' +
      '</a>';
  }).join('');

  const curLevel = S.level ? LEVELS.find((x) => x.code === S.level) : null;

  return '<section class="hero">' +
    '<span class="kicker">' + ic('grad', 12) + ' French Master Academy</span>' +
    '<h1>أتقن الفرنسية من <em>الصفر إلى الاحتراف</em></h1>' +
    '<p>ستة مستويات (A0 → C1) بشرح عربي كامل، 235+ فيديو تعليمي مدمج وموثّق، تمارين تفاعلية، ومراجعة ذكية بالمفاتيح المتقاربة — كل ذلك يعمل دون إنترنت.</p>' +
    '<span class="hero-actions"><a class="btn btn-gold" href="#/levels">' + ic('layers', 16) + ' ابدأ رحلتك</a>' +
    '<a class="btn btn-ghost" style="background:rgba(240,253,250,.12);border-color:rgba(240,253,250,.3);color:#ECFDF5" href="#/placement">' + ic('target', 15) + ' حدّد مستواك</a></span>' +
    '</section>' +
    (continueCard ? '<div class="sec"><div class="sec-head">' + ORN + '<h2>أكمل من حيث توقفت</h2></div>' + continueCard + '</div>' : '') +
    '<div class="sec"><div class="stat-row">' +
    '<div class="stat card"><b>' + g.done + '</b><small>درسًا مكتملًا</small></div>' +
    '<div class="stat card"><b>' + (S.xp || 0) + '</b><small>نقطة خبرة</small></div>' +
    '<div class="stat card"><b>' + (st.count || 0) + '</b><small>يوم متتالٍ</small></div>' +
    '<div class="stat card"><b>' + (g.avg == null ? '—' : g.avg + '%') + '</b><small>متوسط الدرجات</small></div>' +
    '</div></div>' +
    '<div class="sec"><div class="sec-head">' + ORN + '<h2>المستويات الستة</h2><a class="more" href="#/levels">عرض الكل</a></div>' +
    '<div class="grid">' + levelCards + '</div></div>' +
    (curLevel ? '<div class="strip-note"><b>مستواك الحالي:</b> ' + levelTag(curLevel.code) + ' — يمكنك تغييره من <a href="#/placement">اختبار تحديد المستوى</a> أو من الإعدادات.</div>' : '');
}

/* ---------- view: levels ---------- */
function viewLevels() {
  const rows = LEVELS.map((lv) => {
    const pct = levelPct(lv);
    const totalLessons = lv.tracks.reduce((a, t) => a + t.lessons.length, 0);
    const doneLessons = lv.tracks.reduce((a, t) => a + trackDone(t), 0);
    return '<a class="card course-row" href="#/level/' + lv.code + '">' +
      '<span class="cr-cover" style="background:' + grad(lv.color) + '">' + esc(lv.code) + '</span>' +
      '<span class="cr-main"><b>' + esc(lv.ar) + ' <small dir="ltr" style="color:var(--muted)">' + esc(lv.fr) + '</small></b>' +
      '<span class="by">' + esc(lv.desc) + '</span>' +
      '<span class="cr-bar">' + bar(pct) + '<span class="pct">' + doneLessons + '/' + totalLessons + '</span></span></span>' +
      '<span class="cr-side"><span class="go">' + ic('chevL', 18) + '</span></span></a>';
  }).join('');
  const ladder = LEVELS.map((lv, i) =>
    '<div class="lv"><span class="lv-n" style="background:' + lv.color + '">' + (i + 1) + '</span><b>' + esc(lv.ar) + '</b><small dir="ltr">' + esc(lv.code) + ' · ' + esc(lv.fr) + '</small></div>').join('');
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">المستويات الستة</h1>' +
    '<p style="margin:0;color:var(--muted);font-size:13px">سلّم تعلّم متكامل: ابدأ من الصفر تماماً واصعد حتى الطلاقة المهنية والأكاديمية.</p></section>' +
    '<div class="sec"><div class="sec-head">' + ORN + '<h2>سلّم المستويات</h2></div><div class="ladder">' + ladder + '</div></div>' +
    '<div class="sec"><div class="grid">' + rows + '</div></div>';
}

/* ---------- view: level (tracks of a level) ---------- */
function viewLevel(code) {
  const lv = LEVELS.find((x) => x.code === code);
  if (!lv) throw new Error('المستوى غير موجود');
  const pct = levelPct(lv);
  const rows = lv.tracks.map((t) => trackRow(t)).join('');
  return '<section class="lesson-header"><div class="crumb"><a href="#/levels">المستويات</a> ' + ic('chevL', 11) + ' <a href="#/level/' + lv.code + '">' + esc(lv.code) + '</a></div></section>' +
    '<section class="course-hero" style="background:' + grad(lv.color) + '">' +
    '<span class="kicker on-glass" style="position:relative;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;background:rgba(240,253,250,.14);border:1px solid rgba(240,253,250,.28);padding:5px 12px;border-radius:999px;color:#ECFDF5">' + ic('grad', 12) + ' المستوى ' + esc(lv.code) + ' · ' + esc(lv.fr) + '</span>' +
    '<h1>' + esc(lv.ar) + '</h1>' +
    '<div class="desc">' + esc(lv.desc) + '</div>' +
    '<div class="ch-meta"><span class="chip on-glass">' + lv.tracks.length + ' مسارات</span>' +
    '<span class="chip on-glass">' + lv.tracks.reduce((a, t) => a + t.lessons.length, 0) + ' درسًا</span>' +
    '<span class="chip on-glass">' + (pct === 100 ? 'مكتمل' : 'إنجاز ' + pct + '%') + '</span></div>' +
    '</section>' +
    '<div class="sec"><div class="sec-head">' + ORN + '<h2>مسارات هذا المستوى</h2></div>' + rows + '</div>';
}
function trackRow(t) {
  const done = trackDone(t);
  const pct = trackPct(t);
  const full = t.lessons.length && done === t.lessons.length;
  return '<a class="card course-row" href="#/track/' + t.id + '">' +
    '<span class="cr-cover" style="background:' + grad(t.color) + '">' + ic(t.icon, 22) + '</span>' +
    '<span class="cr-main"><b>' + esc(t.ar) + ' <small dir="ltr" style="color:var(--muted)">' + esc(t.fr) + '</small></b>' +
    '<span class="by">' + esc(t.desc) + '</span>' +
    '<span class="cr-bar">' + bar(pct, full) + '<span class="pct">' + (full ? 'مكتمل' : pct + '%') + '</span></span></span>' +
    '<span class="cr-side"><span class="go">' + ic('chevL', 18) + '</span></span></a>';
}

/* ---------- view: track (lessons list) ---------- */
function viewTrack(tid) {
  let hit = null;
  LEVELS.forEach((lv) => lv.tracks.forEach((t) => { if (t.id === tid) hit = { lv: lv, t: t }; }));
  if (!hit) throw new Error('المسار غير موجود');
  const lv = hit.lv, t = hit.t;
  const pct = trackPct(t);
  const lessons = t.lessons.map((l, i) => {
    const ref = { track: t, li: i };
    const lk = lessonLocked(ref);
    const dn = isDone(l.id);
    const sc = scoreOf(l.id);
    const active = !dn && !lk;
    const nv = l.sections.filter((s) => s.video).length;
    return '<a class="lesson-item' + (dn ? ' done' : '') + (active ? ' active' : '') + (lk ? ' locked' : '') + '" href="' + (lk ? 'javascript:void(0)' : '#/lesson/' + l.id) + '"' + (lk ? ' data-locked="1"' : '') + '>' +
      '<span class="li-num">' + (dn ? ic('check', 16) : (lk ? ic('lock', 14) : (i + 1))) + '</span>' +
      '<span class="li-main"><b>' + esc(l.ar) + '</b><small dir="ltr">' + esc(l.fr) + '</small><small>' + ic('video', 10) + ' ' + nv + ' فيديو · ' + l.vocab.length + ' مفردة · ' + l.exercises.length + ' تمرينًا</small></span>' +
      '<span class="li-side">' + (sc != null ? '<span class="score">' + sc + '%</span>' : (lk ? '<span style="color:var(--faint)">' + ic('lock', 15) + '</span>' : ic('chevL', 16))) + '</span>' +
      '</a>';
  }).join('');
  return '<section class="lesson-header"><div class="crumb"><a href="#/levels">المستويات</a> ' + ic('chevL', 11) + ' <a href="#/level/' + lv.code + '">' + esc(lv.ar) + '</a> ' + ic('chevL', 11) + ' <a href="#/track/' + t.id + '">' + esc(t.ar) + '</a></div></section>' +
    '<section class="course-hero" style="background:' + grad(t.color) + '">' +
    '<span class="kicker on-glass" style="position:relative;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;background:rgba(240,253,250,.14);border:1px solid rgba(240,253,250,.28);padding:5px 12px;border-radius:999px;color:#ECFDF5">' + ic(t.icon, 12) + ' ' + esc(lv.code) + ' · مسار ' + esc(t.ar) + '</span>' +
    '<h1>' + esc(t.ar) + '</h1>' +
    '<div class="by" dir="ltr">' + esc(t.fr) + '</div>' +
    '<div class="desc">' + esc(t.desc) + '</div>' +
    '<div class="ch-meta"><span class="chip on-glass">' + t.lessons.length + ' درسًا</span>' +
    '<span class="chip on-glass">' + (pct === 100 ? 'مكتمل' : 'إنجاز ' + pct + '%') + '</span></div>' +
    '</section>' +
    '<div class="sec"><div class="sec-head">' + ORN + '<h2>دروس المسار</h2><span class="more">' + pct + '%</span></div>' + bar(pct, pct === 100) + '<div style="height:14px"></div>' +
    lessons + '</div>';
}

/* ---------- online video player ---------- */
function ytId(url) {
  const m = String(url || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/);
  return m ? m[1] : null;
}
function videoPlayerHTML(v, idx, mode) {
  const online = navigator.onLine;
  const id = v.id || ytId(v.url);
  if (!id) return '';
  const isMain = mode === 'main' || v.main === true;
  const isExtra = mode === 'extra';
  const stage = online
    ? '<img class="vp-thumb" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" onerror="this.style.display=\'none\'"/>'
    : '<div class="vp-offline"><span class="orn">✻</span><b>لا يوجد اتصال بالإنترنت</b><small>الفيديو يعمل عند توفر الاتصال — وباقي أقسام الدرس تعمل دون اتصال</small></div>';
  const badge = isMain
    ? '<span class="vp-badge vp-badge-main">★ الفيديو الأساسي</span>'
    : (isExtra ? '<span class="vp-badge vp-badge-extra">مكمّل</span>' : '');
  const st = parseInt(v.t, 10) || 0;
  const stq = st ? '&start=' + st : '';
  const stLink = st ? '&t=' + st + 's' : '';
  const ext = '<a class="vp-ext" href="https://www.youtube.com/watch?v=' + id + stLink + '" target="_blank" rel="noopener">' + ic('play', 12) + ' فتح الفيديو في يوتيوب</a>';
  const meta = [];
  if (v.channel) meta.push(esc(v.channel));
  if (v.dur) meta.push(v.dur + ' د');
  if (st) meta.push('يبدأ عند ' + Math.floor(st / 60) + ':' + String(st % 60).padStart(2, '0'));
  if (v.lang) meta.push(v.lang === 'ar' ? 'شرح عربي' : (v.lang === 'fr' ? 'فرنسي' : 'إنجليزي'));
  return '<div class="video-player' + (isMain ? ' vp-main' : '') + '" data-yt="' + id + '" data-vt="' + st + '" data-vtitle="' + esc(v.title || 'الدرس المرئي') + '">' +
    '<div class="vp-stage">' + stage + badge +
    '<button class="vp-play" type="button" aria-label="تشغيل الفيديو">' + ic('play', 26) + '</button></div>' +
    '<div class="vp-meta"><b>' + esc(v.title || 'الدرس المرئي') + '</b>' +
    '<small>' + meta.join(' · ') + (online ? ' — اضغط للتشغيل' : ' — غير متصل') + '</small>' + ext + '</div></div>';
}
function vpInject(vp, autoplay) {
  const id = vp.dataset.yt, t = vp.dataset.vtitle || 'الدرس المرئي';
  const vt = parseInt(vp.dataset.vt, 10) || 0;
  const stage = $('.vp-stage', vp);
  if (!stage || !id) return;
  stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=' + (autoplay ? 1 : 0) + '&rel=0&modestbranding=1' + (vt ? '&start=' + vt : '') + '" title="' + esc(t) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  vp.classList.add('playing');
}

/* ---------- view: lesson ---------- */
function lessonSections(l) {
  const secs = [];
  if (l.objectives && l.objectives.length)
    secs.push(['objectives', 'الأهداف', 'target', '<ol class="obj-list">' + l.objectives.map((o) => '<li>' + esc(o) + '</li>').join('') + '</ol>']);
  if (l.sections && l.sections.length) {
    const body = l.sections.map((s, i) => {
      let h = '<div class="sec-block' + (i ? ' sec-gap' : '') + '"><h4 class="sec-h">' + esc(s.h) + '</h4>';
      if (s.video) h += videoPlayerHTML(s.video, i, s.video.main ? 'main' : undefined) + (s.video.why ? '<div class="why-note">' + ic('info', 11) + ' لماذا هذا الفيديو؟ ' + esc(s.video.why) + '</div>' : '');
      if (s.p && s.p.length) h += '<div class="prose">' + s.p.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>';
      if (s.sub && s.sub.length) h += s.sub.map((b) =>
        '<h5 class="sub-h5">' + esc(b.h) + '</h5>' +
        (b.p && b.p.length ? '<div class="prose">' + b.p.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>' : '')).join('');
      return h + '</div>';
    }).join('');
    secs.push(['lesson', 'شرح الدرس', 'book', body]);
  }
  if (l.supplements && l.supplements.length) {
    const body = l.supplements.map((v, i) =>
      '<div class="sec-block' + (i ? ' sec-gap' : '') + '">' +
      videoPlayerHTML(v, i, 'extra') +
      (v.why ? '<div class="why-note">' + ic('info', 11) + ' لماذا هذا الفيديو؟ ' + esc(v.why) + '</div>' : '') +
      '</div>').join('');
    secs.push(['supp', 'فيديوهات إثرائية', 'video', body]);
  }
  if ((l.examples && l.examples.length) || (l.pron && l.pron.length)) {
    let h = '';
    if (l.examples && l.examples.length)
      h += '<div class="ex-grid">' + l.examples.map((e) => '<div class="ex-item"><div class="ex-fr">' + frTxt(e.fr) +
        '<button class="speak-btn" data-speak="' + esc(e.fr) + '" aria-label="نطق">' + ic('volume', 13) + '</button></div>' +
        '<div class="ex-ar">' + esc(e.ar) + '</div>' + (e.note ? '<div class="ex-note">' + esc(e.note) + '</div>' : '') + '</div>').join('') + '</div>';
    if (l.pron && l.pron.length)
      h += '<h4 class="sub-h">' + ic('mic', 14) + ' جدول النطق</h4><table class="stable pron-table"><thead><tr><th>الكلمة/الحرف</th><th>IPA</th><th>نطق approx</th><th>ملاحظة</th><th></th></tr></thead><tbody>' +
        l.pron.map((p) => '<tr><td><b>' + frTxt(p.w) + '</b></td><td dir="ltr">' + esc(p.ipa || '') + '</td><td>' + esc(p.approx || '') + '</td><td>' + esc(p.note || '') + '</td>' +
        '<td><button class="speak-btn" data-speak="' + esc(p.w) + '" aria-label="نطق">' + ic('volume', 13) + '</button></td></tr>').join('') + '</tbody></table>';
    secs.push(['examples', 'أمثلة ونطق', 'quote', h]);
  }
  if (l.vocab && l.vocab.length)
    secs.push(['vocab', 'المفردات (' + l.vocab.length + ')', 'list', '<div class="vocab-grid">' + l.vocab.map((v, vi) =>
      '<div class="vocab-card" data-vi="' + vi + '"><div class="v-top"><b class="v-fr">' + frTxt(v.fr) +
      '<button class="speak-btn" data-speak="' + esc(v.fr) + '" aria-label="نطق">' + ic('volume', 13) + '</button></b>' +
      (v.ipa ? '<span class="v-ipa" dir="ltr">' + esc(v.ipa) + '</span>' : '') + '</div>' +
      '<div class="v-ar">' + esc(v.ar) + '</div>' +
      '<div class="v-tags">' + (v.pos ? '<span class="chip chip-mini">' + esc(v.pos) + '</span>' : '') + (v.g ? '<span class="chip chip-mini">' + (v.g === 'm' ? 'مذكر' : v.g === 'f' ? 'مؤنث' : 'مذكّر ومؤنث') + '</span>' : '') + (v.pl ? '<span class="chip chip-mini" dir="ltr">' + esc(v.pl) + '</span>' : '') + '</div>' +
      (v.exFr ? '<div class="v-ex"><span dir="ltr">' + esc(v.exFr) + '</span><small>' + esc(v.exAr || '') + '</small></div>' : '') +
      '</div>').join('') + '</div>']);
  if (l.grammar && l.grammar.length)
    secs.push(['grammar', 'القواعد', 'edit', l.grammar.map((g) => '<div class="gr-card"><h4>' + esc(g.tAr) + ' <small dir="ltr">' + esc(g.tFr) + '</small></h4>' +
      '<div class="prose">' + g.body.map((b) => '<p>' + esc(b) + '</p>').join('') + '</div>' +
      (g.ex && g.ex.length ? '<div class="ex-grid">' + g.ex.map((e) => '<div class="ex-item"><div class="ex-fr">' + frTxt(e.fr) + '</div><div class="ex-ar">' + esc(e.ar) + '</div></div>').join('') + '</div>' : '') + '</div>').join('')]);
  if (l.mistakes && l.mistakes.length)
    secs.push(['mistakes', 'أخطاء شائعة', 'x', l.mistakes.map((m) => '<div class="mist-card"><div class="m-row bad"><span class="m-badge">✗</span> ' + frTxt(m.wrong) + '</div>' +
      '<div class="m-row good"><span class="m-badge">✓</span> ' + frTxt(m.right) + '</div><div class="m-why">' + esc(m.why) + '</div></div>').join('')]);
  if (l.dialogues && l.dialogues.length)
    secs.push(['dialogues', 'حوارات', 'chat', l.dialogues.map((d) => '<div class="dlg-card"><h4>' + esc(d.title) + '</h4>' + (d.ctx ? '<p class="dlg-ctx">' + esc(d.ctx) + '</p>' : '') +
      '<div class="dlg-lines">' + d.lines.map((ln) => '<div class="dlg-line"><b class="dlg-who">' + esc(ln.who) + '</b><div class="dlg-body">' + frTxt(ln.fr) + '<button class="speak-btn" data-speak="' + esc(ln.fr) + '">' + ic('volume', 12) + '</button><small>' + esc(ln.ar) + '</small></div></div>').join('') + '</div></div>').join('')]);
  if (l.homework || (l.sources && l.sources.length)) {
    let h = '';
    if (l.homework) h += '<div class="hw-card"><h4>' + ic('edit', 14) + ' واجب الدرس</h4><p>' + esc(l.homework) + '</p></div>';
    if (l.sources && l.sources.length) {
      h += '<h4 class="sub-h">' + ic('info', 14) + ' مصادر الفيديو (توثيق)</h4><div class="src-list">' + l.sources.map((sr) =>
        '<div class="src-item"><b dir="ltr">' + esc(sr.title) + '</b>' +
        (sr.main === true ? ' <span class="src-role src-role-main">★ أساسي</span>' : (sr.extra === true ? ' <span class="src-role src-role-extra">مكمّل</span>' : '')) +
        (sr.channel ? '<span>' + esc(sr.channel) + '</span>' : '') +
        (sr.videoId ? '<a href="https://www.youtube.com/watch?v=' + sr.videoId + '" target="_blank" rel="noopener" dir="ltr">youtube.com/watch?v=' + sr.videoId + '</a>' : '') +
        (sr.why ? '<small>' + esc(sr.why) + '</small>' : '') + '</div>').join('') + '</div>';
    }
    secs.push(['hw', 'الواجب والمصادر', 'file', h]);
  }
  return secs;
}
function viewLesson(id) {
  const r = lessonById(id);
  if (!r) throw new Error('الدرس غير موجود');
  const { level: lv, track: t, lesson: l, li: idx } = r;
  if (lessonLocked(r)) {
    return '<div class="card soon-banner" style="margin-top:40px"><div class="orn">' + ic('lock', 26) + '</div><h3>هذا الدرس مقفل</h3><p>فعّل «التصفح الحر» من الإعدادات، أو أكمل الدرس السابق.</p><p style="margin-top:14px"><a class="btn btn-primary" href="#/track/' + t.id + '">عودة إلى المسار</a></p></div>';
  }
  setLast(l.id);
  const prev = idx > 0 ? t.lessons[idx - 1] : null;
  const next = idx < t.lessons.length - 1 ? t.lessons[idx + 1] : null;
  const done = isDone(l.id);
  const sc = scoreOf(l.id);
  const nextUnlocked = !next || !lessonLocked({ track: t, li: idx + 1 });
  const secs = lessonSections(l);
  const chips = secs.map((s, i) => '<button class="tab-chip' + (i === 0 ? ' on' : '') + '" data-target="sec-' + s[0] + '">' + esc(s[1]) + '</button>').join('');
  const sections = secs.map((s, i) => '<section class="lsec" id="sec-' + s[0] + '" style="' + (i === 0 ? '' : 'margin-top:18px') + '"><div class="card lsec-card"><h3>' + ORN + ' ' + s[1] + '</h3>' + s[3] + '</div></section>').join('');
  const quizBtnLabel = done ? ('أعد التمارين' + (sc != null ? ' (' + sc + '%)' : '')) : 'ابدأ التمارين (' + l.exercises.length + ')';
  return '<section class="lesson-header">' +
    '<div class="crumb"><a href="#/levels">المستويات</a> ' + ic('chevL', 11) + ' <a href="#/level/' + lv.code + '">' + esc(lv.ar) + '</a> ' + ic('chevL', 11) + ' <a href="#/track/' + t.id + '">' + esc(t.ar) + '</a></div>' +
    '<h1>' + esc(l.ar) + '</h1>' +
    '<div class="lmeta"><span class="chip chip-gold" dir="ltr">' + esc(l.fr) + '</span>' +
    '<span class="chip">الدرس ' + (idx + 1) + ' من ' + t.lessons.length + '</span>' +
    '<span class="chip">' + levelTag(lv.code) + '</span>' +
    (done && sc != null ? '<span class="chip chip-ok">' + ic('check', 11) + ' اجتزته بدرجة ' + sc + '%</span>' : '') + '</div>' +
    '</section>' +
    '<div class="lesson-layout">' +
    '<nav class="tabs" aria-label="أقسام الدرس">' + chips + '</nav>' +
    '<div class="lesson-main">' +
    sections +
    '<div class="lesson-foot">' +
    (prev ? '<a class="btn btn-ghost" href="#/lesson/' + prev.id + '">' + ic('chevR', 15) + ' السابق</a>' : '<span style="flex:1"></span>') +
    '<a class="btn btn-gold" href="#/ex/' + l.id + '" style="flex:1.4">' + ic('award', 16) + ' ' + quizBtnLabel + '</a>' +
    (next ? ('<a class="btn btn-ghost" href="#/lesson/' + next.id + '"' + (nextUnlocked ? '' : ' disabled') + '>التالي ' + ic('chevL', 15) + '</a>') : '<span style="flex:1"></span>') +
    '</div>' +
    '</div></div>';
}

/* ---------- view: placement (تحديد المستوى) ---------- */
let PL = null;
function buildPlacementBank() {
  const bank = [];
  LEVELS.forEach((lv) => {
    let taken = 0;
    for (const t of lv.tracks) {
      for (const l of t.lessons) {
        for (const ex of l.exercises) {
          if (taken >= 2) break;
          if ((ex.t === 'mcq' || ex.t === 'listen') && ex.opts && ex.opts.length >= 3 && typeof ex.a === 'number') {
            bank.push({ lvCode: lv.code, lvAr: lv.ar, ex: ex, spoken: ex.t === 'listen' ? (ex.audio || ex.opts[ex.a]) : null });
            taken++;
          }
        }
        if (taken >= 2) break;
      }
      if (taken >= 2) break;
    }
  });
  return bank;
}
function viewPlacement() {
  if (PL && PL.bank && PL.finished) { /* keep result until re-enter */ }
  const bank = buildPlacementBank();
  if (!bank.length) return '<div class="card soon-banner">لا توجد أسئلة كافية</div>';
  EXQ = null;
  PL = { bank: bank, i: 0, sel: null, confirmed: false, correct: 0, byLevel: {}, finished: false };
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">اختبار تحديد المستوى</h1>' +
    '<p style="margin:0;color:var(--muted);font-size:13px">' + bank.length + ' سؤالاً سريعاً من كل المستويات — أجب دون تردد طويل، النتيجة تقترح عليك نقطة البداية المناسبة.</p></section>' +
    '<div class="quiz-wrap" id="quizWrap">' + plQuestion() + '</div>';
}
function plQuestion() {
  const q = PL.bank[PL.i];
  const total = PL.bank.length;
  const pct = Math.round(PL.i / total * 100);
  const opts = q.ex.opts.map((o, j) => {
    let cls = 'opt';
    if (PL.confirmed) {
      if (j === q.ex.a) cls += ' right';
      else if (j === PL.sel) cls += ' wrong';
    } else if (j === PL.sel) cls += ' sel';
    return '<button class="' + cls + '" data-opt="' + j + '" ' + (PL.confirmed ? 'disabled' : '') + '><span class="ol">' + ['أ', 'ب', 'ج', 'د'][j] + '</span><span>' + esc(o) + '</span></button>';
  }).join('');
  const spoken = q.spoken
    ? '<button class="speak-btn speak-big" id="exSpeak" data-pl-speak="' + esc(q.spoken) + '">' + ic('volume', 18) + ' استمع</button>'
    : '';
  const lvTag = '<span class="chip chip-mini" style="opacity:.75">سؤال من مستوى ' + q.lvCode + '</span>';
  const action = !PL.confirmed
    ? '<div class="quiz-act"><button class="btn btn-primary btn-block" id="qConfirm" ' + (PL.sel == null ? 'disabled' : '') + '>تأكيد الإجابة</button></div>'
    : '<div class="quiz-act"><button class="btn btn-gold btn-block" id="qNext">' + (PL.i + 1 < total ? 'السؤال التالي ' : 'عرض النتيجة ') + ic('chevL', 15) + '</button></div>';
  return '<div class="quiz-top"><span class="qnum">' + (PL.i + 1) + ' / ' + total + '</span><span class="qbar">' + bar(pct) + '</span></div>' +
    '<div class="card quiz-card">' + lvTag + '<p class="quiz-q">' + esc(q.ex.q || 'اختر الإجابة الصحيحة') + '</p>' + spoken + opts + action + '</div>';
}
function plResult() {
  const total = PL.bank.length;
  const c = PL.correct;
  const map = [
    [0.34, 'A0'], [0.5, 'A1'], [0.67, 'A2'], [0.84, 'B1'], [0.97, 'B2'], [2, 'C1']
  ];
  let lvCode = 'A0';
  for (const m of map) { if (c / total < m[0]) { lvCode = m[0] === map[0][0] ? 'A0' : m[1]; break; } lvCode = m[1]; }
  const lv = LEVELS.find((x) => x.code === lvCode);
  PL.finished = true;
  S.placement = { score: c, total: total, level: lvCode, date: todayStr() };
  S.level = lvCode; save();
  return '<div class="card result-card">' +
    '<div class="result-ring" style="background:conic-gradient(var(--ok) ' + Math.round(c / total * 100) + '%, var(--bg-soft) 0)"><div style="width:96px;height:96px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center"><b style="color:var(--ok)">' + c + '/' + total + '</b></div></div>' +
    '<h2>المستوى المقترح لك: ' + esc(lvCode) + ' · ' + esc(lv ? lv.ar : '') + '</h2>' +
    '<p>يمكنك البدء من هذا المستوى مباشرة، أو استكشاف المستويات كلها بحرية — تقدّمك يُحفظ تلقائياً على جهازك.</p>' +
    '<div class="result-actions">' +
    '<a class="btn btn-gold btn-block" href="#/level/' + lvCode + '">' + ic('play', 16) + ' ابدأ من مستوى ' + esc(lvCode) + '</a>' +
    '<a class="btn btn-ghost btn-block" href="#/levels">استكشاف كل المستويات</a>' +
    '</div></div>';
}

/* ============================================================
   EXERCISES ENGINE — 8 أنواع تمارين
   ============================================================ */
let EXQ = null;
const EX_TYPE_AR = { mcq: 'اختيار من متعدد', fill: 'املأ الفراغ', order: 'رتّب الجملة', translate: 'ترجم', listen: 'استماع', correct: 'صحّح الخطأ', writing: 'كتابة حرة', speaking: 'تكرار نطق' };
const SKILL_AR = {
  grammar: 'قواعد',
  vocabulary: 'مفردات',
  vocab: 'مفردات',
  reading: 'قراءة',
  listening: 'استماع',
  writing: 'كتابة',
  speaking: 'محادثة',
  pronunciation: 'نطق',
  culture: 'ثقافة',
  conversation: 'محادثة',
  argumentation: 'حجاج ونقاش',
  analysis: 'تحليل'
};

function viewEx(id) {
  const r = lessonById(id);
  if (!r || !r.lesson.exercises.length) throw new Error('التمارين غير موجودة');
  PL = null;
  EXQ = { ref: r, qs: r.lesson.exercises, i: 0, sel: null, confirmed: false, correct: 0, inputVal: '', orderSel: [], shuffled: null, self: false, finished: false };
  return '<section class="lesson-header">' +
    '<div class="crumb"><a href="#/levels">المستويات</a> ' + ic('chevL', 11) + ' <a href="#/level/' + r.level.code + '">' + esc(r.level.ar) + '</a> ' + ic('chevL', 11) + ' <a href="#/track/' + r.track.id + '">' + esc(r.track.ar) + '</a> ' + ic('chevL', 11) + ' <a href="#/lesson/' + r.lesson.id + '">' + esc(r.lesson.ar) + '</a></div>' +
    '<h1>تمارين الدرس</h1>' +
    '<div class="lmeta"><span class="chip chip-gold">' + esc(r.lesson.ar) + '</span><span class="chip">' + r.lesson.exercises.length + ' تمارين</span>' +
    (isDone(r.lesson.id) ? '<span class="chip chip-ok">' + ic('check', 11) + ' درجتك السابقة ' + scoreOf(r.lesson.id) + '%</span>' : '') + '</div>' +
    '</section>' +
    '<div class="quiz-wrap" id="quizWrap">' + exQuestion() + '</div>';
}
function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function exHead(q) {
  const total = EXQ.qs.length;
  const pct = Math.round(EXQ.i / total * 100);
  return '<div class="quiz-top"><span class="qnum">' + (EXQ.i + 1) + ' / ' + total + '</span>' +
    '<span class="chip chip-mini">' + EX_TYPE_AR[q.t] + '</span>' +
    (q.skill ? '<span class="chip chip-mini chip-skill">' + esc(SKILL_AR[q.skill] || q.skill) + '</span>' : '') +
    '<span class="qbar">' + bar(pct) + '</span></div>';
}
function frStemHTML(q) {
  if (!q.fr) return '';
  const withBlank = String(q.fr).replace(/_{2,}/g, '<span class="blank">______</span>');
  return '<p class="fr-stem" dir="ltr">' + withBlank + '</p>';
}
function optsHTML(q) {
  return q.opts.map((o, j) => {
    let cls = 'opt';
    if (EXQ.confirmed) {
      if (j === q.a) cls += ' right';
      else if (j === EXQ.sel) cls += ' wrong';
    } else if (j === EXQ.sel) cls += ' sel';
    return '<button class="' + cls + '" data-opt="' + j + '" ' + (EXQ.confirmed ? 'disabled' : '') + '><span class="ol">' + ['أ', 'ب', 'ج', 'د'][j] + '</span><span>' + esc(o) + '</span></button>';
  }).join('');
}
function inputHTML() {
  return '<div class="ex-input-row"><input class="ex-input" id="exInput" dir="ltr" autocomplete="off" spellcheck="false" placeholder="اكتب إجابتك بالفرنسية…" value="' + esc(EXQ.inputVal || '') + '" ' + (EXQ.confirmed ? 'disabled' : '') + '/></div>';
}
function orderHTML(q) {
  if (!EXQ.shuffled) EXQ.shuffled = shuffleArr(q.words.map((w, wi) => ({ w: w, wi: wi })));
  const selSet = new Set(EXQ.orderSel);
  const bank = EXQ.shuffled.map((o, bi) => {
    if (selSet.has(bi)) return '';
    return '<button class="word-chip" data-bank="' + bi + '" ' + (EXQ.confirmed ? 'disabled' : '') + '>' + esc(o.w) + '</button>';
  }).join('');
  const line = EXQ.orderSel.map((bi) => '<button class="word-chip picked" data-unpick="' + bi + '" ' + (EXQ.confirmed ? 'disabled' : '') + '>' + esc(EXQ.shuffled[bi].w) + '</button>').join('');
  const lineCls = 'order-line' + (EXQ.confirmed ? (EXQ.orderSel.map((bi) => EXQ.shuffled[bi].w).join(' ') === q.words.join(' ') ? ' good' : ' bad') : '');
  return '<div class="' + lineCls + '" id="orderLine">' + (line || '<span class="order-hint">اضغط الكلمات بالترتيب…</span>') + '</div>' +
    '<div class="word-bank" id="wordBank">' + bank + '</div>';
}
function feedbackHTML(q) {
  if (!EXQ.confirmed) return '';
  let good, rightText;
  if (q.t === 'mcq' || q.t === 'listen') { good = EXQ.sel === q.a; rightText = q.opts[q.a]; }
  else if (q.t === 'order') { good = EXQ.orderSel.map((bi) => EXQ.shuffled[bi].w).join(' ') === q.words.join(' '); rightText = q.words.join(' '); }
  else { good = normFr(EXQ.inputVal) && q.ans && (normFr(EXQ.inputVal) === normFr(q.ans) || (q.alts || []).some((x) => normFr(x) === normFr(EXQ.inputVal))); rightText = q.ans; }
  let h = '<div class="quiz-feedback ' + (good ? 'good' : 'bad') + '">' +
    (good ? ic('check', 13) + ' إجابة صحيحة — très bien!' : ic('x', 13) + ' الإجابة الصحيحة: <b dir="ltr">' + esc(rightText) + '</b>') + '</div>';
  if (q.why) h += '<div class="why-note">' + ic('info', 11) + ' ' + esc(q.why) + '</div>';
  return h;
}
function exQuestion() {
  const q = EXQ.qs[EXQ.i];
  let body = '';
  if (q.t === 'mcq') body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') + frStemHTML(q) + optsHTML(q);
  else if (q.t === 'listen') {
    const spoken = q.audio || q.opts[q.a];
    body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') +
      '<button class="speak-btn speak-big" id="exSpeak">' + ic('volume', 18) + ' استمع إلى الجملة</button>' + optsHTML(q);
  } else if (q.t === 'fill') body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') + frStemHTML(q) + inputHTML();
  else if (q.t === 'translate') body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') + frStemHTML(q) + inputHTML();
  else if (q.t === 'correct') body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') + frStemHTML(q) + inputHTML();
  else if (q.t === 'order') body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') + frStemHTML(q) + orderHTML(q);
  else if (q.t === 'writing') {
    body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') +
      '<div class="ex-input-row"><textarea class="ex-input ex-textarea" id="exInput" rows="3" placeholder="اكتب إجابتك بالفرنسية…" ' + (EXQ.confirmed ? 'disabled' : '') + '>' + esc(EXQ.inputVal || '') + '</textarea></div>' +
      (q.min ? '<small class="ex-hint">الحد الأدنى: ' + q.min + ' كلمات</small>' : '');
    if (EXQ.confirmed) {
      const words = String(EXQ.inputVal || '').trim().split(/\s+/).filter(Boolean);
      const kws = (q.kw || []).map((k) => k.toLowerCase());
      const hits = kws.filter((k) => words.some((w) => normFr(w).indexOf(normFr(k)) === 0));
      body += '<div class="quiz-feedback ' + (hits.length ? 'good' : 'bad') + '">' + ic('info', 13) + ' كلمات مفتاحية وجدناها: ' + (hits.length ? hits.join(' · ') : 'لا شيء بعد') + '</div>' +
        '<div class="sample-box"><b>إجابة نموذجية:</b><div dir="ltr">' + esc(q.sample || '') + '</div></div>' +
        '<div class="quiz-act"><button class="btn btn-primary btn-block" id="exSelfGood">' + ic('check', 15) + ' إجابتي قريبة من النموذج</button>' +
        '<button class="btn btn-ghost btn-block" id="exSelfBad" style="margin-top:8px">سأراجع هذا الجزء لاحقاً</button></div>';
      return exHead(q) + '<div class="card quiz-card">' + body + '</div>';
    }
  } else if (q.t === 'speaking') {
    body = (q.q ? '<p class="quiz-q">' + esc(q.q) + '</p>' : '') +
      '<div class="sample-box speak-box"><b>الجملة المستهدفة:</b><div dir="ltr" class="big-fr">' + esc(q.target || '') + '</div>' +
      '<button class="speak-btn" id="exSpeak">' + ic('volume', 15) + ' استمع إلى النموذج</button></div>' +
      '<p class="ex-hint">' + ic('mic', 12) + ' كرّر الجملة بصوت عالٍ ثم قيّم نفسك بصدق.</p>' +
      (EXQ.confirmed
        ? '<div class="quiz-act"><button class="btn btn-primary btn-block" id="exSelfGood">' + ic('check', 15) + ' نطقتها بنجاح</button>' +
          '<button class="btn btn-ghost btn-block" id="exSelfBad" style="margin-top:8px">لم تنجح بعد</button></div>'
        : '<div class="quiz-act"><button class="btn btn-primary btn-block" id="qConfirm">أنا جاهز للتقييم</button></div>');
    return exHead(q) + '<div class="card quiz-card">' + body + '</div>';
  }
  const fb = feedbackHTML(q);
  const isSelfPending = (q.t === 'writing' || q.t === 'speaking') && EXQ.confirmed;
  const action = !EXQ.confirmed
    ? '<div class="quiz-act"><button class="btn btn-primary btn-block" id="qConfirm" ' + ((q.t === 'mcq' || q.t === 'listen' || q.t === 'order') ? (canConfirm(q) ? '' : 'disabled') : '') + '>تأكيد الإجابة</button></div>'
    : isSelfPending ? '' :
    '<div class="quiz-act"><button class="btn btn-gold btn-block" id="qNext">' + (EXQ.i + 1 < EXQ.qs.length ? 'التمرين التالي ' : 'عرض النتيجة ') + ic('chevL', 15) + '</button></div>';
  return exHead(q) + '<div class="card quiz-card">' + body + fb + action + '</div>';
}
function canConfirm(q) {
  if (q.t === 'mcq' || q.t === 'listen') return EXQ.sel != null;
  if (q.t === 'order') return EXQ.orderSel.length === q.words.length;
  return String(EXQ.inputVal || '').trim().length > 0;
}
function exAdvance() {
  if (EXQ.i + 1 < EXQ.qs.length) {
    EXQ.i++; EXQ.sel = null; EXQ.confirmed = false; EXQ.inputVal = ''; EXQ.orderSel = []; EXQ.shuffled = null;
    $('#quizWrap').innerHTML = exQuestion(); bindEx();
  } else { EXQ.finished = true; finishEx(); }
}
function finishEx() {
  const total = EXQ.qs.length;
  const pct = Math.round(EXQ.correct / total * 100);
  const passed = pct >= 60;
  const r = EXQ.ref;
  const first = passed ? recordDone(r.lesson.id, pct) : false;
  if (passed) {
    addXp(EXQ.correct * 2 + (first ? 15 : 0));
    touchStreak();
    r.lesson.vocab.forEach((v, vi) => {
      const vid = r.lesson.id + '#' + vi;
      if (!S.review[vid]) S.review[vid] = { b: 1, d: todayStr() };
    });
    save();
  }
  const nextLi = r.li + 1;
  const next = nextLi < r.track.lessons.length ? r.track.lessons[nextLi] : null;
  const msg = pct >= 90 ? 'ما شاء الله! تفوقٌ واضح — excellently fait!' : pct >= 80 ? 'أحسنت! أداء قوي' : passed ? 'اجتزت التمارين — واصل التقدم' : 'لم تجتز هذه المرة — راجع الدرس وأعد المحاولة';
  const ringColor = passed ? 'var(--ok)' : '#B3452F';
  $('#quizWrap').innerHTML =
    '<div class="card result-card">' +
    '<div class="result-ring" style="background:conic-gradient(' + ringColor + ' ' + pct + '%, var(--bg-soft) 0)"><div style="width:96px;height:96px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center"><b style="color:' + ringColor + '">' + pct + '%</b></div></div>' +
    '<h2>' + esc(msg) + '</h2>' +
    '<p>' + EXQ.correct + ' من ' + total + ' إجابات صحيحة' +
    (passed ? (first ? ' — تم تسجيل اكتمال الدرس (+15 XP) وإضافة مفرداته إلى بطاقات المراجعة' : ' — تم تحديث درجتك') : ' — درجة النجاح 60% فأعلى') + '</p>' +
    '<div class="result-actions">' +
    (!passed ? '<button class="btn btn-primary btn-block" id="qRetry">' + ic('rotate', 16) + ' إعادة التمارين</button>' : '') +
    (passed && next ? '<a class="btn btn-gold btn-block" href="#/lesson/' + next.id + '">الدرس التالي ' + ic('chevL', 15) + '</a>' : '') +
    '<a class="btn btn-ghost btn-block" href="#/lesson/' + r.lesson.id + '">عودة إلى الدرس</a>' +
    '</div></div>';
  bindEx();
  if (passed) setTimeout(() => toast(first ? 'تم تسجيل الدرس كمكتمل' : 'تم تحديث درجتك'), 250);
}
function bindEx() {
  const wrap = $('#quizWrap');
  if (!wrap) return;
  const isPlacement = PL && !PL.finished && !EXQ;
  const isExSelf = EXQ && EXQ.confirmed && (EXQ.qs[EXQ.i].t === 'writing' || EXQ.qs[EXQ.i].t === 'speaking');
  $$('.opt', wrap).forEach((b) => b.addEventListener('click', () => {
    if (isPlacement) { PL.sel = parseInt(b.dataset.opt, 10); wrap.innerHTML = plQuestion(); bindEx(); }
    else { EXQ.sel = parseInt(b.dataset.opt, 10); wrap.innerHTML = exQuestion(); bindEx(); }
  }));
  const speakBtn = $('#exSpeak');
  if (speakBtn) speakBtn.addEventListener('click', () => {
    if (isPlacement) { const q = PL.bank[PL.i]; speak(q.spoken || q.ex.opts[q.ex.a]); }
    else { const q = EXQ.qs[EXQ.i]; speak(q.audio || q.opts[q.a] || q.target || ''); }
  });
  const inp = $('#exInput');
  if (inp) inp.addEventListener('input', () => {
    EXQ.inputVal = inp.value;
    const cb = $('#qConfirm');
    if (cb && !EXQ.confirmed) cb.disabled = !canConfirm(EXQ.qs[EXQ.i]);
  });
  $$('[data-bank]', wrap).forEach((b) => b.addEventListener('click', () => {
    EXQ.orderSel.push(parseInt(b.dataset.bank, 10));
    wrap.innerHTML = exQuestion(); bindEx();
  }));
  $$('[data-unpick]', wrap).forEach((b) => b.addEventListener('click', () => {
    const bi = parseInt(b.dataset.unpick, 10);
    EXQ.orderSel = EXQ.orderSel.filter((x) => x !== bi);
    wrap.innerHTML = exQuestion(); bindEx();
  }));
  const confirmBtn = $('#qConfirm');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    if (isPlacement) {
      const q = PL.bank[PL.i];
      PL.confirmed = true;
      if (PL.sel === q.ex.a) PL.correct++;
      wrap.innerHTML = plQuestion(); bindEx();
    } else {
      const q = EXQ.qs[EXQ.i];
      if (q.t === 'speaking') { EXQ.confirmed = true; wrap.innerHTML = exQuestion(); bindEx(); return; }
      if (!canConfirm(q)) { toast('أكمل إجابتك أولاً'); return; }
      EXQ.confirmed = true;
      let good = false;
      if (q.t === 'mcq' || q.t === 'listen') good = EXQ.sel === q.a;
      else if (q.t === 'order') good = EXQ.orderSel.map((bi) => EXQ.shuffled[bi].w).join(' ') === q.words.join(' ');
      else good = normFr(EXQ.inputVal) && q.ans && (normFr(EXQ.inputVal) === normFr(q.ans) || (q.alts || []).some((x) => normFr(x) === normFr(EXQ.inputVal)));
      if (good) EXQ.correct++;
      wrap.innerHTML = exQuestion(); bindEx();
    }
  });
  const selfGood = $('#exSelfGood');
  if (selfGood) selfGood.addEventListener('click', () => { EXQ.correct++; exAdvance(); });
  const selfBad = $('#exSelfBad');
  if (selfBad) selfBad.addEventListener('click', () => { exAdvance(); });
  const nextBtn = $('#qNext');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (isPlacement) {
      const total = PL.bank.length;
      if (PL.i + 1 < total) { PL.i++; PL.sel = null; PL.confirmed = false; wrap.innerHTML = plQuestion(); bindEx(); }
      else { wrap.innerHTML = plResult(); }
    } else exAdvance();
  });
  const retryBtn = $('#qRetry');
  if (retryBtn) retryBtn.addEventListener('click', () => {
    if (isPlacement) { location.reload(); return; }
    EXQ.i = 0; EXQ.sel = null; EXQ.confirmed = false; EXQ.correct = 0; EXQ.inputVal = ''; EXQ.orderSel = []; EXQ.shuffled = null; EXQ.finished = false;
    wrap.innerHTML = exQuestion(); bindEx();
  });
}

/* ============================================================
   REVIEW — المراجعة المتباعدة (صناديق لايتنر)
   ============================================================ */
let RV = null;
const BOX_DAYS = [1, 2, 4, 8, 16];
function reviewPool() {
  const pool = [];
  LEVELS.forEach((lv) => lv.tracks.forEach((t) => t.lessons.forEach((l) => {
    const anyIn = l.vocab.some((v, vi) => S.review[l.id + '#' + vi]);
    if (!isDone(l.id) && !anyIn) return;
    l.vocab.forEach((v, vi) => {
      const vid = l.id + '#' + vi;
      pool.push({ vid: vid, fr: v.fr, ar: v.ar, ipa: v.ipa, exFr: v.exFr, exAr: v.exAr, lessonId: l.id, lessonAr: l.ar, lvCode: lv.code, entry: S.review[vid] || null });
    });
  })));
  return pool;
}
function viewReview() {
  const pool = reviewPool();
  const due = pool.filter((c) => !c.entry || c.entry.d <= todayStr());
  const mastered = pool.filter((c) => c.entry && c.entry.b >= 5).length;
  if (!pool.length) {
    return '<section class="lesson-header"><h1 style="margin:6px 0 2px">المراجعة الذكية</h1></section>' +
      '<div class="card soon-banner"><div class="orn">' + ic('rotate', 26) + '</div><h3>لا توجد بطاقات بعد</h3>' +
      '<p>أكمل تمارين أي درس، وستُبنى بطاقات مراجعة من مفرداته تلقائياً — ونظام الصناديق المتقاربة (Leitner) يجدولها ذكياً: كلما تذكرت بطاقة أبعدنا موعد إعادتها.</p>' +
      '<p style="margin-top:14px"><a class="btn btn-gold" href="#/levels">' + ic('layers', 15) + ' ابدأ درساً الآن</a></p></div>';
  }
  const queue = due.sort((a, b) => (a.entry ? a.entry.b : 0) - (b.entry ? b.entry.b : 0)).slice(0, 12);
  RV = { queue: queue, i: 0, revealed: false, good: 0, bad: 0, poolSize: pool.length };
  if (!queue.length) {
    return '<section class="lesson-header"><h1 style="margin:6px 0 2px">المراجعة الذكية</h1></section>' +
      '<div class="card result-card"><div class="result-ring" style="background:conic-gradient(var(--ok) 100%, var(--bg-soft) 0)"><div style="width:96px;height:96px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center"><b style="color:var(--ok)">✓</b></div></div>' +
      '<h2>لا بطاقات مستحقة اليوم — bravo!</h2>' +
      '<p>أتممت ' + pool.length + ' بطاقة (منها ' + mastered + ' في الصندوق الخامس). عد لاحقاً حسب الجدولة، أو أكمل درساً جديداً لبناء بطاقات أكثر.</p>' +
      '<div class="result-actions"><a class="btn btn-gold btn-block" href="#/levels">' + ic('layers', 15) + ' متابعة درس جديد</a></div></div>';
  }
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">المراجعة الذكية</h1>' +
    '<p style="margin:0;color:var(--muted);font-size:13px">' + queue.length + ' بطاقة مستحقة اليوم من أصل ' + pool.length + ' — الصناديق: 1→2→4→8→16 يوماً.</p></section>' +
    '<div id="reviewWrap">' + reviewCard() + '</div>';
}
function reviewCard() {
  const c = RV.queue[RV.i];
  const e = c.entry;
  const boxLabel = e ? ('الصندوق ' + e.b) : 'بطاقة جديدة';
  let h = '<div class="quiz-top"><span class="qnum">' + (RV.i + 1) + ' / ' + RV.queue.length + '</span><span class="chip chip-mini">' + boxLabel + '</span><span class="chip chip-mini">' + c.lvCode + '</span><span class="qbar">' + bar(Math.round(RV.i / RV.queue.length * 100)) + '</span></div>';
  h += '<div class="card review-card"><div class="rv-front">' +
    '<div class="rv-fr" dir="ltr">' + esc(c.fr) + '<button class="speak-btn" data-rv-speak="' + esc(c.fr) + '">' + ic('volume', 15) + '</button></div>' +
    (c.ipa ? '<div class="v-ipa" dir="ltr">' + esc(c.ipa) + '</div>' : '') +
    (!RV.revealed
      ? '<button class="btn btn-primary btn-block" id="rvReveal" style="margin-top:16px">' + ic('eye', 15) + ' اكشف المعنى</button>'
      : '<div class="rv-back"><div class="v-ar">' + esc(c.ar) + '</div>' +
        (c.exFr ? '<div class="v-ex"><span dir="ltr">' + esc(c.exFr) + '</span><small>' + esc(c.exAr || '') + '</small></div>' : '') +
        '<small class="rv-from">من درس: ' + esc(c.lessonAr) + '</small></div>') +
    '</div>';
  if (RV.revealed) {
    h += '<div class="quiz-act rv-actions">' +
      '<button class="btn btn-ghost btn-block" id="rvBad" style="border-color:#B3452F;color:#B3452F">' + ic('x', 15) + ' لم أتذكر (الصندوق 1)</button>' +
      '<button class="btn btn-gold btn-block" id="rvGood" style="margin-top:8px">' + ic('check', 15) + ' تذكرت (صندوق أعلى)</button>' +
      '</div>';
  }
  h += '</div>';
  return h;
}
function bindReview() {
  const wrap = $('#reviewWrap');
  if (!wrap) return;
  const sp = $('[data-rv-speak]', wrap);
  if (sp) sp.addEventListener('click', () => speak(sp.dataset.rvSpeak));
  const rev = $('#rvReveal');
  if (rev) rev.addEventListener('click', () => { RV.revealed = true; wrap.innerHTML = reviewCard(); bindReview(); });
  const rate = (good) => {
    const c = RV.queue[RV.i];
    const cur = S.review[c.vid] || { b: 0, d: todayStr() };
    const nb = good ? Math.min(5, cur.b + 1) : 1;
    S.review[c.vid] = { b: nb, d: addDays(BOX_DAYS[nb - 1]) };
    if (good) { RV.good++; addXp(1); } else RV.bad++;
    save();
    RV.i++; RV.revealed = false;
    if (RV.i < RV.queue.length) { wrap.innerHTML = reviewCard(); bindReview(); }
    else {
      touchStreak();
      wrap.innerHTML = '<div class="card result-card"><div class="result-ring" style="background:conic-gradient(var(--ok) ' + Math.round(RV.good / RV.queue.length * 100) + '%, var(--bg-soft) 0)"><div style="width:96px;height:96px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center"><b style="color:var(--ok)">' + RV.good + '/' + RV.queue.length + '</b></div></div>' +
        '<h2>انتهت جلسة المراجعة</h2><p>تذكرت ' + RV.good + ' بطاقة (+1 XP لكل بطاقة) — البطاقات التي نسيتها ستعود غداً، والمتقنة جُدولت حسب صندوقها.</p>' +
        '<div class="result-actions"><a class="btn btn-gold btn-block" href="#/levels">' + ic('layers', 15) + ' متابعة التعلم</a><a class="btn btn-ghost btn-block" href="#/">الرئيسية</a></div></div>';
      setTimeout(() => toast('تم تحديث جدولة البطاقات'), 300);
    }
  };
  const g = $('#rvGood');
  if (g) g.addEventListener('click', () => rate(true));
  const b = $('#rvBad');
  if (b) b.addEventListener('click', () => rate(false));
}

/* ============================================================
   SETTINGS
   ============================================================ */
function viewSettings() {
  const g = globalStats();
  return '<section class="lesson-header"><h1 style="margin:6px 0 2px">الإعدادات</h1><p style="margin:0;color:var(--muted);font-size:13px">خصّص تجربتك — تُحفظ إعداداتك تلقائياً على هذا الجهاز.</p></section>' +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('moon', 17) + '</span><span class="sm"><b>الوضع الليلي</b><small>مناسب للقراءة الليلية ومراعاة للعين</small></span><button class="switch' + (S.theme === 'dark' ? ' on' : '') + '" id="setDark" role="switch" aria-checked="' + (S.theme === 'dark') + '" aria-label="الوضع الليلي"></button></div>' +
    '<div class="set-row"><span class="si">' + ic('lock', 17) + '</span><span class="sm"><b>التصفح الحر</b><small>فتح كل الدروس دون الالتزام بترتيب المسارات — عند الإيقاف يُفتح كل درس بعد إتمام سابقه</small></span><button class="switch' + (S.free ? ' on' : '') + '" id="setFree" role="switch" aria-checked="' + S.free + '" aria-label="التصفح الحر"></button></div>' +
    '<div class="set-row"><span class="si">' + ic('volume', 17) + '</span><span class="sm"><b>سرعة النطق الصوتي</b><small>صوت فرنسي آلي (TTS) للمفردات والأمثلة والتمارين الصوتية</small></span><select class="sel" id="setRate"><option value="0.8"' + (S.rate === 0.8 ? ' selected' : '') + '>بطيء</option><option value="0.95"' + (S.rate === 0.95 || !S.rate ? ' selected' : '') + '>عادي</option><option value="1.1"' + (S.rate === 1.1 ? ' selected' : '') + '>سريع</option></select></div>' +
    '</div></div>' +
    '<div class="sec"><div class="sec-head">' + ORN + '<h2>النسخ الاحتياطي</h2></div><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('save', 17) + '</span><span class="sm"><b>تصدير التقدّم</b><small>تنزيل ملف JSON يضم درجاتك وبطاقات المراجعة والنقاط — انقله لأي جهاز</small></span><button class="btn btn-ghost" id="setExport" style="min-height:38px;padding:7px 14px;font-size:12.5px">' + ic('save', 14) + ' تصدير</button></div>' +
    '<div class="set-row"><span class="si">' + ic('upload', 17) + '</span><span class="sm"><b>استيراد التقدّم</b><small>استعادة ملف تقدّم مُصدَّر سابقاً (يُدمج مع الحالي)</small></span><button class="btn btn-ghost" id="setImport" style="min-height:38px;padding:7px 14px;font-size:12.5px">' + ic('upload', 14) + ' استيراد</button><input type="file" id="importFile" accept="application/json" hidden/></div>' +
    '</div></div>' +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('target', 17) + '</span><span class="sm"><b>مستواي الحالي</b><small>' + (S.level ? esc(S.level + ' · ' + (LEVEL_AR[S.level] || '')) : 'لم تُحدد بعد — جرّب اختبار تحديد المستوى') + '</small></span>' +
    '<div style="display:flex;gap:8px"><a class="btn btn-ghost" href="#/placement" style="min-height:38px;padding:7px 14px;font-size:12.5px">الاختبار</a><button class="btn btn-ghost" id="setClrLevel" style="min-height:38px;padding:7px 14px;font-size:12.5px">مسح</button></div></div>' +
    '<div class="set-row"><span class="si">' + ic('rotate', 17) + '</span><span class="sm"><b>إعادة تعيين التقدّم</b><small>مسح كل الدروس المكتملة والدرجات والبطاقات — لا يمكن الرجوع</small></span><button class="btn btn-ghost" id="setReset" style="min-height:38px;padding:7px 14px;font-size:12.5px">مسح</button></div>' +
    '</div></div>' +
    '<div class="sec"><div class="card set-group">' +
    '<div class="set-row"><span class="si">' + ic('info', 17) + '</span><span class="sm"><b>عن التطبيق</b><small>«أكاديمية إتقان الفرنسية» — نسخة ويب مستقلة تعمل دون إنترنت (باستثناء الفيديوهات المدمجة من يوتيوب مع توثيق مصادرها داخل كل درس). ' + g.total + ' درسًا · ' + g.ex + ' تمرينًا · ' + g.vocab + ' مفردة · ' + LEVELS.reduce((a, lv) => a + lv.tracks.length, 0) + ' مساراً في 6 مستويات.</small></span></div>' +
    '<div class="set-row"><span class="si" style="font-family:Georgia,serif;font-weight:700;color:var(--primary)">Fr</span><span class="sm"><b>الإصدار 1.0 (Static)</b><small>Vanilla JS · localStorage · PWA · بيانات مدمجة v' + (DATA.version || 1) + ' (' + esc(DATA.generated || '') + ')</small></span></div>' +
    '</div></div>';
}
function bindSettings() {
  const d = $('#setDark');
  if (d) d.addEventListener('click', () => { toggleTheme(); navigate(); });
  const f = $('#setFree');
  if (f) f.addEventListener('click', () => {
    S.free = !S.free; save(); navigate();
    toast(S.free ? 'فُتحت كل الدروس — التصفح الحر مفعّل' : 'عاد التطبيق إلى التدرج التدريجي');
  });
  const rt = $('#setRate');
  if (rt) rt.addEventListener('change', () => { S.rate = parseFloat(rt.value) || 0.95; save(); toast('تم حفظ سرعة النطق'); });
  const rs = $('#setReset');
  if (rs) rs.addEventListener('click', () => {
    if (rs.dataset.armed) {
      S.done = {}; S.last = null; S.review = {}; S.xp = 0; S.streak = { count: 0, last: null }; save(); navigate(); toast('أُعيد تعيين التقدّم بالكامل');
    } else {
      rs.dataset.armed = '1'; rs.textContent = 'تأكيد المسح؟'; rs.style.color = '#B3452F'; rs.style.borderColor = '#B3452F';
      setTimeout(() => { if (rs.isConnected) { rs.dataset.armed = ''; rs.textContent = 'مسح'; rs.style.color = ''; rs.style.borderColor = ''; } }, 3000);
    }
  });
  const cl = $('#setClrLevel');
  if (cl) cl.addEventListener('click', () => { S.level = null; S.placement = null; save(); navigate(); toast('تم مسح المستوى الحالي'); });
  const ex = $('#setExport');
  if (ex) ex.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify({ app: 'french-master-academy', exported: new Date().toISOString(), state: S }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'fma-progress-' + todayStr() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      toast('تم تصدير ملف التقدّم');
    } catch (e) { toast('تعذر التصدير في هذا المتصفح'); }
  });
  const im = $('#setImport');
  const file = $('#importFile');
  if (im && file) {
    im.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const j = JSON.parse(String(reader.result || '{}'));
          const st = j.state || j;
          if (st.done) S.done = Object.assign(S.done, st.done);
          if (st.review) S.review = Object.assign(S.review, st.review);
          if (typeof st.xp === 'number') S.xp = Math.max(S.xp || 0, st.xp);
          if (st.streak) S.streak = st.streak.count >= (S.streak.count || 0) ? st.streak : S.streak;
          if (st.last) S.last = st.last;
          save(); navigate(); toast('تم استيراد التقدّم ودمجه');
        } catch (e) { toast('الملف غير صالح'); }
      };
      reader.readAsText(f);
    });
  }
}

/* ============================================================
   BOOT & GLOBAL EVENTS
   ============================================================ */
document.addEventListener('click', (e) => {
  const vpPlay = e.target.closest('.vp-play');
  if (vpPlay) {
    const wrap2 = vpPlay.closest('.video-player');
    if (!navigator.onLine) { toast('الفيديو يتطلب اتصالاً بالإنترنت — باقي الدرس يعمل دون اتصال'); return; }
    if (wrap2) vpInject(wrap2, true);
    return;
  }
  const spk = e.target.closest('[data-speak]');
  if (spk) { speak(spk.dataset.speak); return; }
  const chip = e.target.closest('.tab-chip');
  if (chip) {
    $$('.tab-chip').forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
    const sec = document.getElementById(chip.dataset.target);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const lockedRow = e.target.closest('[data-locked="1"]');
  if (lockedRow) {
    e.preventDefault();
    toast('أكمل الدرس السابق لفتح هذا — أو فعّل التصفح الحر من الإعدادات');
  }
});
window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  navigate();
  window.addEventListener('online', () => { toast('عاد الاتصال بالإنترنت — الفيديوهات متاحة الآن'); if (currentRoute === 'lesson') navigate(); });
  window.addEventListener('offline', () => { toast('انقطع الاتصال — التطبيق يعمل دون إنترنت، الفيديو فقط متوقف'); });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
})();
