
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
function videoPlayerHTML(v, idx) {
  const online = navigator.onLine;
  const id = v.id || ytId(v.url);
  if (!id) return '';
  const stage = online
    ? '<img class="vp-thumb" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" onerror="this.style.display=\'none\'"/>'
    : '<div class="vp-offline"><span class="orn">✻</span><b>لا يوجد اتصال بالإنترنت</b><small>الفيديو يعمل عند توفر الاتصال — وباقي أقسام الدرس تعمل دون اتصال</small></div>';
  const ext = '<a class="vp-ext" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">' + ic('play', 12) + ' فتح الفيديو في يوتيوب</a>';
  const meta = [];
  if (v.channel) meta.push(esc(v.channel));
  if (v.dur) meta.push(v.dur + ' د');
  if (v.lang) meta.push(v.lang === 'ar' ? 'شرح عربي' : (v.lang === 'fr' ? 'فرنسي' : 'إنجليزي'));
  return '<div class="video-player" data-yt="' + id + '" data-vtitle="' + esc(v.title || 'الدرس المرئي') + '">' +
    '<div class="vp-stage">' + stage +
    '<button class="vp-play" type="button" aria-label="تشغيل الفيديو">' + ic('play', 26) + '</button></div>' +
    '<div class="vp-meta"><b>' + esc(v.title || 'الدرس المرئي') + '</b>' +
    '<small>' + meta.join(' · ') + (online ? ' — اضغط للتشغيل' : ' — غير متصل') + '</small>' + ext + '</div></div>';
}
function vpInject(vp, autoplay) {
  const id = vp.dataset.yt, t = vp.dataset.vtitle || 'الدرس المرئي';
  const stage = $('.vp-stage', vp);
  if (!stage || !id) return;
  stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=' + (autoplay ? 1 : 0) + '&rel=0&modestbranding=1" title="' + esc(t) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
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
      if (s.video) h += videoPlayerHTML(s.video, i) + (s.video.why ? '<div class="why-note">' + ic('info', 11) + ' لماذا هذا الفيديو؟ ' + esc(s.video.why) + '</div>' : '');
      if (s.p && s.p.length) h += '<div class="prose">' + s.p.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>';
      return h + '</div>';
    }).join('');
    secs.push(['lesson', 'شرح الدرس', 'book', body]);
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
        '<div class="src-item"><b dir="ltr">' + esc(sr.title) + '</b>' + (sr.channel ? '<span>' + esc(sr.channel) + '</span>' : '') +
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
    ? '<button class="speak-btn speak-big" data-pl-speak="' + esc(q.spoken) + '">' + ic('volume', 18) + ' استمع</button>'
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
