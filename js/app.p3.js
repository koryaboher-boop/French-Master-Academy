
/* ============================================================
   EXERCISES ENGINE — 8 أنواع تمارين
   ============================================================ */
let EXQ = null;
const EX_TYPE_AR = { mcq: 'اختيار من متعدد', fill: 'املأ الفراغ', order: 'رتّب الجملة', translate: 'ترجم', listen: 'استماع', correct: 'صحّح الخطأ', writing: 'كتابة حرة', speaking: 'تكرار نطق' };
const SKILL_AR = { grammar: 'قواعد', vocabulary: 'مفردات', reading: 'قراءة', listening: 'استماع', writing: 'كتابة', speaking: 'محادثة', pronunciation: 'نطق' };

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
    (q.skill ? '<span class="chip chip-mini chip-skill">' + SKILL_AR[q.skill] + '</span>' : '') +
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
    '<div class="set-row"><span class="si">' + ic('info', 17) + '</span><span class="sm"><b>عن التطبيق</b><small>«أكاديمية إتقان الفرنسية» — نسخة ويب مستقلة تعمل دون إنترنت (باستثناء الفيديوهات المدمجة من يوتيوب مع توثيق مصادرها داخل كل درس). ' + g.total + ' درسًا · ' + g.ex + ' تمرينًا · ' + g.vocab + ' مفردة · 47 مساراً في 6 مستويات.</small></span></div>' +
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
