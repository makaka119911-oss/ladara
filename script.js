/* =========================================================================
   LADARA — каталог работ. Логика.
   Всё, что про содержание, приходит из data.js. Здесь только механика:
   обложка, развороты, свет зала, план, рассматривание с зумом.
   ========================================================================= */
(function () {
  'use strict';
  var M = window.MUSEUM || {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(hover:none)').matches;

  function txt(id, v){ var e = document.getElementById(id); if (e && v != null) e.textContent = v; }
  function html(id, v){ var e = document.getElementById(id); if (e && v != null) e.innerHTML = v; }

  var works = (M.works || []).filter(function (w) { return w && w.title; });
  // настоящий вид работы (shot) важнее атмосферы зала — этап 2 только дописывает поле
  works.forEach(function (w) { if (w.shot) w.art = w.shot; });

  /* ---------- тексты ---------- */
  txt('coverKicker', M.hero && M.hero.kicker);
  html('coverTitle', M.hero && M.hero.title.replace(/\n/g, '<br>'));
  txt('coverOffer', M.hero && M.hero.offer);
  txt('coverCta', M.hero && M.hero.cta);
  txt('aboutKicker', M.author && M.author.kicker);
  txt('aboutTitle', M.author && M.author.title);
  html('aboutBody', (M.author && M.author.text || []).map(function (p, i) {
    return '<p class="rv" style="--rv-d:' + (140 + i * 80) + 'ms">' + p + '</p>';
  }).join(''));
  var P = M.posters || {};
  txt('postersKicker', P.kicker);
  txt('postersTitle', P.title);
  txt('postersLead', P.lead);
  txt('outroKicker', M.outro && M.outro.kicker);
  txt('outroTitle', M.outro && M.outro.title);
  txt('outroText', M.outro && M.outro.text);
  txt('outroNote', M.outro && M.outro.note);
  txt('contactTg', M.contact && M.contact.telegramLabel);
  txt('contactMail', M.contact && M.contact.email);
  var tg = document.getElementById('contactTg');
  if (tg && M.contact) tg.href = M.contact.telegram;
  txt('colophonYear', String(new Date().getFullYear()));
  txt('colophonCount', works.length ? works.length + ' / ' + works.length : '');

  /* ---------- перечень работ на обложке ---------- */
  var coverIndex = document.getElementById('coverIndex');
  if (coverIndex) {
    coverIndex.innerHTML = '<p class="index__cap">Экспозиция</p>' + works.map(function (w, i) {
      return '<a class="rv rv--fast" style="--rv-d:' + (i * 40) + 'ms" href="#hall-' + (i + 1) + '">' +
        '<span class="index__n">' + (w.num || ('0' + (i + 1))) + '</span>' +
        '<span class="index__t">' + w.title + '<span class="index__l">' + (w.line || '') + '</span></span>' +
      '</a>';
    }).join('');
  }

  /* ---------- развороты ---------- */
  var spreads = document.getElementById('spreads');
  works.forEach(function (w, i) {
    var sec = document.createElement('section');
    sec.className = 'spread';
    sec.id = 'hall-' + (i + 1);
    sec.setAttribute('data-accent', w.accent || '#7a5a2e');
    sec.setAttribute('data-hall', w.hall || String(i + 1));

    var plate;
    if (w.stub || !w.art) {
      plate = '<div class="stub rv" style="--rv-d:0ms"><span class="stub__num">' + (w.num || '') + '</span>' +
              '<span class="stub__note">экспонат готовится</span></div>';
    } else {
      plate = '<figure class="plate rv" style="--rv-d:0ms"><img src="' + w.art + '" alt="' + w.title + '" loading="lazy">' +
              '<button class="plate__zoom" aria-label="Рассмотреть">Рассмотреть</button></figure>';
    }

    var f = w.facts || {};
    var facts = [['Что это', f.what], ['Из чего сделано', f.made], ['Состояние', f.state]]
      .filter(function (x) { return x[1]; })
      .map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('');

    var link = w.url
      ? '<a class="cta label__link" href="' + w.url + '" target="_blank" rel="noopener">' + (w.urlLabel || 'Открыть') + '</a>'
      : '';

    sec.innerHTML =
      '<div class="spread__inner">' +
        '<p class="spread__num rv" style="--rv-d:80ms">Зал ' + (w.hall || '') + ' · ' + (w.num || '') + (w.year ? ' · ' + w.year : '') + '</p>' +
        plate +
        '<div class="label rv" style="--rv-d:160ms">' +
          '<h2 class="label__title">' + w.title + '</h2>' +
          '<p class="label__line">' + (w.line || '') + '</p>' +
          '<div class="label__facts">' + facts + '</div>' +
          link +
        '</div>' +
      '</div>';
    spreads.appendChild(sec);
  });

  /* ---------- стена афиш ---------- */
  var wall = document.getElementById('postersWall');
  var posterItems = (P.items || []).filter(function (x) { return x && x.art; });
  if (wall) {
    wall.innerHTML = posterItems.map(function (p, i) {
      return '<figure class="poster rv" style="--rv-d:' + ((i % 3) * 70) + 'ms" id="poster-' + i + '">' +
        '<img src="' + p.art + '" data-big="' + (p.big || '') + '" alt="' + p.title + '" loading="lazy">' +
        '<figcaption class="poster__cap"><b>' + p.title + '</b>' + (p.note || '') + '</figcaption>' +
      '</figure>';
    }).join('');
  }

  /* Карточка-буклет: не афиша события, а перечень услуг — стоит отдельно под стеной. */
  var leafBox = document.getElementById('posterLeaflet');
  var leaf = P.leaflet;
  if (leafBox && leaf && leaf.art) {
    leafBox.innerHTML = '<figure class="leaflet rv" id="leaflet">' +
      '<img src="' + leaf.art + '" data-big="' + (leaf.big || '') + '" alt="' + leaf.title + '" loading="lazy">' +
      '<figcaption class="poster__cap"><b>' + leaf.title + '</b>' + (leaf.note || '') + '</figcaption>' +
    '</figure>';
  }

  var halls = [].slice.call(document.querySelectorAll('.spread'));
  var about = document.getElementById('about');
  var colophon = document.getElementById('contact');

  /* ---------- план залов ---------- */
  var plan = document.getElementById('plan');
  if (plan && works.length) {
    plan.innerHTML = '<span class="plan__lbl">Залы</span>' + works.map(function (w, i) {
      return '<a href="#hall-' + (i + 1) + '">' + (w.num || (i + 1)) + '</a>';
    }).join('');
  }
  var planLinks = plan ? [].slice.call(plan.querySelectorAll('a')) : [];

  /* плашка залов показывается по делу и гаснет: иначе висит поверх текста этикетки */
  var planT = null;
  function revealPlan(hold) {
    if (!plan) return;
    plan.classList.add('is-on');
    if (planT) clearTimeout(planT);
    planT = setTimeout(function () { plan.classList.remove('is-on'); }, hold || 2400);
  }

  /* ---------- появление ---------- */
  var toReveal = [].slice.call(document.querySelectorAll('.rv'));
  var pending = toReveal.slice();        // ещё не показанные
  function reveal(el) {
    el.classList.add('is-in');
    var k = pending.indexOf(el);
    if (k > -1) pending.splice(k, 1);
  }
  // Страховка. Прежняя версия раскрывала ВСЁ через 1,6 с и убивала появление при прокрутке.
  // Новая двойная: (1) если наблюдатель вообще не отозвался за 1,2 с — раскрыть ступенькой
  // (иначе на телефоне, где IntersectionObserver молчит, страница осталась бы невидимой);
  // (2) на каждом кадре прокрутки показывать то, что уже попало в кадр. Второе гарантирует,
  // что контент никогда не «залипнет» невидимым.
  function sweep() {
    if (!pending || !pending.length) return;
    for (var i = pending.length - 1; i >= 0; i--) {
      var r = pending[i].getBoundingClientRect();
      if (r.top < innerHeight * .94 && r.bottom > 0) reveal(pending[i]);
    }
  }
  if ('IntersectionObserver' in window && !reduce) {
    // Наблюдатель первичен: элемент проявляется, когда его правда видно.
    // Раньше здесь стояла страховка, которая через 1,6 с раскрывала ВСЁ подряд —
    // из-за неё появление при прокрутке не работало вообще (замер: 9 из 9 раскрыты,
    // ни один не был в кадре).
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    toReveal.forEach(function (el) { io.observe(el); });
  }
  // Страховки «раскрыть всё через N секунд» здесь НЕТ намеренно — дважды проверил, что она вредит:
  // первая версия раскрывала всё через 1,6 с и убивала появление при прокрутке, вторая — через 1,2 с,
  // если наблюдатель не отозвался (на живой сети его первый отклик приходит позже). Обе раскрывали
  // страницу целиком заранее.
  // Вместо этого работают два независимых пути, и оба ведут к нужному поведению:
  //   1) наблюдатель — штатный путь;
  //   2) sweep() в каждом кадре прокрутки и раз в 500 мс — раскрывает только то, что реально в кадре.
  // Если наблюдатель сломан, содержимое всё равно проявится по мере прокрутки, а невидимым не залипнет.
  // При prefers-reduced-motion содержимое видно сразу через CSS (.rv{opacity:1}), JS тут не нужен.

  /* ---------- лёгкий параллакс (приём ScrollTrigger: движение от позиции, не от времени) ----------
     Ставим только там, где структура уже готова: у обложки и колофона слой медиа лежит
     position:absolute с overflow:hidden, поэтому сдвиг ничего не обнажает.
     На карточках залов и на портрете параллакс сознательно НЕ делаем: там картинка занимает
     ровно свою рамку (а у портрета ещё и растворённые края — масштаб срезал бы перо). */
  var parallax = [];
  if (!reduce) {
    [['.cover__media img', '.cover__media'], ['.colophon__media img', '.colophon__media']]
      .forEach(function (pair) {
        var img = document.querySelector(pair[0]), box = document.querySelector(pair[1]);
        if (img && box) parallax.push({ img: img, box: box });
      });
  }
  function moveParallax() {
    if (!parallax || !parallax.length) return;
    var vh = innerHeight;
    for (var i = 0; i < parallax.length; i++) {
      var box = parallax[i].box.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      var p = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2);
      if (p < -1) p = -1; if (p > 1) p = 1;
      parallax[i].img.style.setProperty('--py', (p * 26).toFixed(1) + 'px');
    }
  }

  /* ---------- счётчик кадров: включается только флагом ?diag=1 ----------
     Нужен, чтобы плавность можно было измерить НА ТЕЛЕФОНЕ, а не в headless-среде. */
  if (/[?&]diag=1/.test(location.search)) {
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:8px;top:8px;z-index:99;padding:6px 8px;border-radius:8px;' +
      'background:rgba(18,15,12,.88);color:#f2ece2;font:500 12px/1.35 monospace;pointer-events:none';
    box.textContent = 'счётчик: прокрутите страницу';
    document.body.appendChild(box);
    var dn = 0, dlong = 0, dworst = 0, dt = performance.now(), dlast = dt;
    (function dloop(now) {
      var d = now - dlast; dlast = now;
      if (d > 0) {
        dn++;
        if (d > 33) dlong++;
        if (d > dworst) dworst = d;
        if (now - dt >= 1000) {
          box.textContent = Math.round(dn * 1000 / (now - dt)) + ' fps · >33мс ' +
            Math.round(dlong / dn * 100) + '% · худший ' + Math.round(dworst) + 'мс';
          dn = 0; dlong = 0; dworst = 0; dt = now;
        }
      }
      requestAnimationFrame(dloop);
    })(performance.now());
  }

  /* ---------- счётчик, свет зала, нить ---------- */
  var rail = document.getElementById('railFill');
  var numEl = document.getElementById('hallNum');
  var totalEl = document.getElementById('hallTotal');
  if (totalEl) totalEl.textContent = 'из ' + works.length;

  var lastState = '';
  function frame() {
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
    if (rail) rail.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    moveParallax();
    sweep();

    var mid = scrollY + innerHeight * .5;
    var current = null, state = 'cover', label = 'Обложка';

    halls.forEach(function (el, i) {
      if (mid >= el.offsetTop && mid < el.offsetTop + el.offsetHeight) {
        current = el; state = 'hall'; label = 'Зал ' + el.getAttribute('data-hall');
        var accent = el.getAttribute('data-accent');
        // на тёмной стене отсвет зала должен быть заметнее, чем на светлой
        // 20% оказалось мало: на бою залы почти не различались по цвету (замер тестировщика)
        if (document.body.style.getPropertyValue('--hall-glow') !== accent + '59') {
          document.body.style.setProperty('--hall-glow', accent + '59');
        }
        planLinks.forEach(function (a, k) {
          var on = k === i;
          a.classList.toggle('on', on);
          a.setAttribute('aria-current', on ? 'true' : 'false');
        });
      }
    });
    if (!current && about && mid >= about.offsetTop && mid < about.offsetTop + about.offsetHeight) {
      state = 'wall'; label = 'Мастер';
    }
    if (!current && colophon && mid >= colophon.offsetTop) { state = 'end'; label = 'Колофон'; }

    if (numEl && numEl.textContent !== label) numEl.textContent = label;

    if (state !== lastState) {
      lastState = state;
      document.body.classList.toggle('on-wall', state === 'wall' || state === 'hall');
      document.body.classList.toggle('show-plan', state === 'hall');
      document.body.classList.toggle('is-lit', state === 'hall');
      if (state === 'hall') revealPlan(3200);   // пришёл новый зал — показали и следом погасили
    }
  }
  var tick = null;
  addEventListener('scroll', function () {
    if (reduce) { frame(); return; }
    if (document.body.classList.contains('show-plan')) revealPlan(1800);
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { frame(); tick = null; });
  }, { passive: true });
  addEventListener('resize', frame);
  frame();
  setInterval(frame, 500);        // страховка: счётчик жив и там, где кадры заморожены

  /* ---------- рассматривание: глубокий зум ---------- */
  var viewer = document.getElementById('viewer');
  var stage = document.getElementById('viewerStage');
  var artBox = document.getElementById('viewerArt');
  var cap = document.getElementById('viewerCaption');
  var infoBox = document.getElementById('viewerInfo');
  var hint = document.getElementById('viewerHint');

  // единый порядок просмотра: сначала развороты работ, потом афиши
  var book = [];
  works.forEach(function (w, i) {
    if (w.stub || !w.art) return;
    var plate = document.querySelector('#hall-' + (i + 1) + ' .plate');
    if (plate) book.push({ el: plate, art: w.art, title: w.title,
                           cap: w.title + ' · Зал ' + (w.hall || ''), facts: w.facts });
  });
  posterItems.forEach(function (p, i) {
    var card = document.getElementById('poster-' + i);
    if (card) book.push({ el: card, art: p.art, big: p.big, title: p.title,
                          cap: p.title + (p.note ? ' · ' + p.note : ''), facts: null });
  });
  // буклет листается сразу после афиш — он логично закрывает «Кабинет гравюр»
  (function () {
    var el = document.getElementById('leaflet');
    if (el && leaf && leaf.art) {
      book.push({ el: el, art: leaf.art, big: leaf.big, title: leaf.title,
                  cap: leaf.title + (leaf.note ? ' · ' + leaf.note : ''), facts: null });
    }
  })();
  var zoomable = book;

  var idx = 0, scale = 1, tx = 0, ty = 0, MIN = 1, MAX = 6;
  // Трение за пределами допуска — как в PhotoSwipe (верх 0,05, низ 0,15):
  // жест не «прилипает» к границе, а при отпускании возвращается в допуск.
  var FRICTION_UP = .05;
  // Ниже «единицы» трения нет — там жёсткий стоп: кадр меньше сцены оставил бы пустые поля,
  // поэтому щипок ниже 1 сразу возвращает в 1× с нулевым сдвигом.

  if (hint) hint.textContent = coarse
    ? 'Тап — приблизить · двумя пальцами — свободно · ещё тап — вернуть'
    : 'Клик — приблизить · колесо — свободно · Esc — закрыть';

  function apply(animate) {
    artBox.style.transition = animate ? 'transform .42s cubic-bezier(.22,1,.36,1)' : 'none';
    artBox.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
    artBox.classList.toggle('is-zoomed', scale > 1.02);
    viewer.classList.toggle('is-zoomed', scale > 1.02);
  }
  function resetZoom() { scale = 1; tx = 0; ty = 0; apply(true); }
  function clampPan() {
    var st = stage.getBoundingClientRect();
    var mx = Math.max(0, (artBox.offsetWidth * scale - st.width) / 2);
    var my = Math.max(0, (artBox.offsetHeight * scale - st.height) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }
  function zoomAt(k, px, py, animate) {
    var target = Math.min(MAX, Math.max(MIN, scale * k));
    k = target / scale;
    if (k === 1) return;
    tx = px - (px - tx) * k;
    ty = py - (py - ty) * k;
    scale = target;
    if (scale <= MIN + .001) { scale = 1; tx = 0; ty = 0; }
    clampPan(); apply(animate !== false);
  }
  function centerOf(e) {
    var st = stage.getBoundingClientRect();
    return { x: e.clientX - (st.left + st.width / 2), y: e.clientY - (st.top + st.height / 2) };
  }

  var pointers = {}, pinch = null, moved = 0, downAt = null, multi = false;
  function pointerList() { return Object.keys(pointers).map(function (k) { return pointers[k]; }); }
  function dist() { var p = pointerList(); return Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y); }

  stage.addEventListener('pointerdown', function (e) {
    if (growing) { growing = false; artBox.style.transition = 'none'; apply(false); }
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    moved = 0; downAt = { x: e.clientX, y: e.clientY, t: Date.now() };
    if (pointerList().length === 1) multi = false;
    if (pointerList().length === 2) {
      // Щипок привязываем к НАЧАЛУ жеста (приём PhotoSwipe): масштаб считается от исходного
      // расстояния между пальцами, а не накоплением отношений шаг за шагом. При накоплении
      // упор рассинхронизирует жест: свести и развести пальцы обратно давало 5x вместо 1x,
      // а после верхнего упора возврат давал 1,71 вместо 2,00.
      var p2 = pointerList(), st2 = stage.getBoundingClientRect();
      pinch = { d0: Math.max(1, dist()), s0: scale, tx0: tx, ty0: ty,
                mx: (p2[0].x + p2[1].x) / 2 - (st2.left + st2.width / 2),
                my: (p2[0].y + p2[1].y) / 2 - (st2.top + st2.height / 2) };
      multi = true; artBox.style.transition = 'none';
    }
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* синтетические события */ }
  });

  stage.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId]) return;
    var prev = pointers[e.pointerId];
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };

    if (pointerList().length === 2) {
      var d = dist();
      if (pinch && d > 1 && pinch.d0 > 1) {
        var p = pointerList(), sr = stage.getBoundingClientRect();
        var raw = pinch.s0 * (d / pinch.d0);            // масштаб — функция расстояния пальцев
        var target = raw > MAX ? MAX + (raw - MAX) * FRICTION_UP : raw;
        var k = target / pinch.s0;
        var cur = { x: (p[0].x + p[1].x) / 2 - (sr.left + sr.width / 2),
                    y: (p[0].y + p[1].y) / 2 - (sr.top + sr.height / 2) };
        scale = target;
        // панорама: точка, которая была под серединой пальцев в начале жеста, держится под ней и сейчас
        tx = cur.x - (pinch.mx - pinch.tx0) * k;
        ty = cur.y - (pinch.my - pinch.ty0) * k;
        if (scale <= MIN + .001) { scale = 1; tx = 0; ty = 0; }
        clampPan(); apply(false);
      }
      return;
    }
    if (scale > 1.02) {
      tx += e.clientX - prev.x;
      ty += e.clientY - prev.y;
      moved += Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
      clampPan(); apply(false);
    }
  });

  // Отпустили пальцы: если щипок ушёл за допуск (трение), возвращаем в допуск анимацией.
  // Масштабируем вокруг центра сцены — то, что видно, остаётся на месте.
  function settlePinch() {
    if (!pinch) return;
    pinch = null;
    var clamped = Math.min(MAX, Math.max(MIN, scale));
    if (Math.abs(clamped - scale) < .001) return;
    if (clamped <= MIN + .001) { resetZoom(); return; }
    var k = clamped / scale;
    tx *= k; ty *= k;
    scale = clamped;
    clampPan(); apply(true);
  }

  function endPointer(e) {
    delete pointers[e.pointerId];
    if (pointerList().length < 2) settlePinch();
    if (pointerList().length === 0 && downAt) {
      var quick = Date.now() - downAt.t < 400;
      // после щипка жест НЕ считается тапом — иначе зум сбрасывался бы сразу
      if (!multi && moved < 8 && quick) {
        var c = centerOf({ clientX: downAt.x, clientY: downAt.y });
        if (scale > 1.02) resetZoom(); else zoomAt(2.6, c.x, c.y, true);
      }
      downAt = null;
    }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('pointerleave', function (e) {
    // пока палец захвачен (setPointerCapture), уход за границу сцены не должен рвать жест:
    // иначе перетаскивание обрывалось бы у самого края кадра
    var held = false;
    try { held = !!(stage.hasPointerCapture && stage.hasPointerCapture(e.pointerId)); } catch (err) { held = false; }
    if (held) return;
    endPointer(e);
  });
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    var c = centerOf(e);
    zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, c.x, c.y, false);
  }, { passive: false });
  stage.addEventListener('dblclick', function (e) { e.preventDefault(); resetZoom(); });

  function paint() {
    var item = zoomable[idx];
    if (!item) return;
    // Сначала показываем лёгкую версию — она уже в кэше, поэтому открытие мгновенное.
    // Крупную подгружаем и подменяем: пропорции те же, поэтому скачка не видно.
    artBox.innerHTML = '<img src="' + item.art + '" alt="' + item.title + '">';
    var shown = artBox.querySelector('img');
    if (item.big) {
      var bigImg = new Image();
      bigImg.onload = function () {
        shown.src = item.big;
        MAX = zoomLimitFor(bigImg);          // предел зума — по разрешению: где резко, там и предел
      };
      bigImg.src = item.big;
    } else {
      shown.addEventListener('load', function () { MAX = zoomLimitFor(shown); });
    }
    artBox.style.transition = 'none';
    resetZoom();
    cap.textContent = item.cap;
    var f = item.facts || {};
    infoBox.innerHTML = [['Что это', f.what], ['Из чего сделано', f.made], ['Состояние', f.state]]
      .filter(function (x) { return x[1]; })
      .map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('');
    hint.classList.remove('is-faded');
    requestAnimationFrame(function () { hint.classList.add('is-faded'); });
    if (zoomable[idx + 1]) { var im = new Image(); im.src = zoomable[idx + 1].art; }
  }

  /* Предел зума считаем от разрешения картинки, а не одной цифрой на всех.
     Нужно на весь экран примерно столько точек: ширина сцены × плотность экрана.
     Разрешаем растянуть не больше чем в 1,25 раза — дальше начинается мыло. */
  function zoomLimitFor(img) {
    var nat = (img && img.naturalWidth) || 0;
    if (!nat) return 3;
    var dpr = window.devicePixelRatio || 2;
    var stageW = stage.getBoundingClientRect().width || 1;
    var lim = nat / (stageW * dpr) * 1.25;
    return Math.max(1.15, Math.min(6, lim));
  }

  /* Плавное открытие: картинка вырастает из своего места на стене в центр экрана.
     Только transform — ни ширины, ни положения в потоке. */
  var growing = false;
  function growFrom(fromRect) {
    if (reduce) return;                       // просили меньше движения — не разворачиваем
    var img = artBox.querySelector('img');
    if (!img || !fromRect || !fromRect.width) return;
    var to = img.getBoundingClientRect();
    if (!to.width) return;
    var sx = fromRect.width / to.width;
    var dx = (fromRect.left + fromRect.width / 2) - (to.left + to.width / 2);
    var dy = (fromRect.top + fromRect.height / 2) - (to.top + to.height / 2);
    growing = true;
    artBox.style.transition = 'none';
    artBox.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + sx.toFixed(3) + ')';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        artBox.style.transition = 'transform .44s cubic-bezier(.22,1,.36,1)';
        artBox.style.transform = 'none';
        growing = false;
      });
    });
  }
  function shrinkTo(toRect) {
    if (reduce) return false;
    var img = artBox.querySelector('img');
    if (!img || !toRect) return false;
    var from = img.getBoundingClientRect();
    if (!from.width) return false;
    var sx = toRect.width / from.width;
    var dx = (toRect.left + toRect.width / 2) - (from.left + from.width / 2);
    var dy = (toRect.top + toRect.height / 2) - (from.top + from.height / 2);
    artBox.style.transition = 'transform .34s cubic-bezier(.4,0,.6,1)';
    artBox.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + sx.toFixed(3) + ')';
    return true;
  }

  function open(i) {
    if (!zoomable.length) return;
    var from = null;
    var next = zoomable[Math.max(0, Math.min(zoomable.length - 1, i))];
    if (next && next.el && next.el.getBoundingClientRect) from = next.el.getBoundingClientRect();
    idx = Math.max(0, Math.min(zoomable.length - 1, i));
    paint();
    viewer.hidden = false;
    requestAnimationFrame(function () {
      viewer.classList.add('is-open');
      growFrom(from);
    });
    document.body.style.overflow = 'hidden';
  }
  function close() {
    var back = null;
    var item = zoomable[idx];
    if (item && item.el && item.el.getBoundingClientRect) back = item.el.getBoundingClientRect();
    resetZoom();
    if (shrinkTo(back)) {
      viewer.classList.remove('is-open');
      setTimeout(function () { viewer.hidden = true; artBox.style.transition = 'none'; artBox.style.transform = 'none'; }, 340);
    } else {
      viewer.classList.remove('is-open');
      setTimeout(function () { viewer.hidden = true; }, 320);
    }
    document.body.style.overflow = '';
  }

  zoomable.forEach(function (item, i) {
    item.el.addEventListener('click', function () { open(i); });
  });
  if (viewer) {
    document.getElementById('viewerClose').addEventListener('click', close);
    document.getElementById('viewerPrev').addEventListener('click', function () { open(idx - 1); });
    document.getElementById('viewerNext').addEventListener('click', function () { open(idx + 1); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer || e.target === stage) close(); });
    addEventListener('keydown', function (e) {
      if (viewer.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(idx - 1);
      if (e.key === 'ArrowRight') open(idx + 1);
      if (e.key === '+' || e.key === '=') zoomAt(1.4, 0, 0, true);
      if (e.key === '-') zoomAt(1 / 1.4, 0, 0, true);
      if (e.key === '0') resetZoom();
    });
  }
})();
