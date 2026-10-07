/* Галерея: счётчик залов, появление при входе, режим рассматривания с ГЛУБОКИМ ЗУМОМ.
   Без библиотек. Учтено: во встроенном просмотре приложения кадровый цикл и
   IntersectionObserver могут не работать — поэтому везде есть аварийная страховка. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var halls = [].slice.call(document.querySelectorAll('.hall[data-hall]'));
  var inner = [].slice.call(document.querySelectorAll('.hall__inner'));
  var rail = document.getElementById('railFill');
  var numEl = document.getElementById('hallNum');
  var totalEl = document.getElementById('hallTotal');

  totalEl.textContent = 'из ' + halls.length;
  var w = document.getElementById('countWord');
  if (w){
    var words = ['Ноль','Один','Два','Три','Четыре','Пять','Шесть','Семь','Восемь','Девять'];
    w.textContent = words[halls.length] || String(halls.length);
  }

  /* ---------- появление при входе в зал ---------- */
  function reveal(el){ el.classList.add('is-in'); }
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: .18 });
    inner.forEach(function(el){ io.observe(el); });
  }
  setTimeout(function(){
    inner.forEach(function(el, i){ setTimeout(function(){ reveal(el); }, i * 60); });
  }, 1600);

  /* ---------- счётчик залов и нить прогресса ---------- */
  function frame(){
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
    rail.style.height = (p * 100).toFixed(2) + '%';
    var mid = scrollY + innerHeight * .5, current = null;
    halls.forEach(function(el){
      if (mid >= el.offsetTop && mid < el.offsetTop + el.offsetHeight) current = el;
    });
    var label = current ? 'Зал ' + current.getAttribute('data-hall') : (scrollY < 60 ? 'Вход' : 'Выход');
    if (numEl.textContent !== label) numEl.textContent = label;
  }
  var tick = null;
  function onScroll(){
    if (reduce){ frame(); return; }
    if (tick) return;
    tick = true;
    requestAnimationFrame(function(){ frame(); tick = null; });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();
  setInterval(frame, 500);

  /* ---------- данные экспонатов ---------- */
  var queue = halls.map(function(el){
    var canvas = el.querySelector('.canvas');
    var title = el.querySelector('.plaque h2');
    var info = el.querySelector('.plaque dl');
    return {
      html: canvas ? canvas.innerHTML.replace(/<button[\s\S]*?<\/button>/, '') : '',
      title: title ? title.textContent : '',
      hall: (el.querySelector('.hall__label') || { textContent: '' }).textContent,
      info: info ? info.innerHTML : ''
    };
  });

  /* ---------- рассматривание с зумом ---------- */
  var viewer = document.getElementById('viewer');
  var stage = document.getElementById('viewerStage');
  var art = document.getElementById('viewerArt');
  var cap = document.getElementById('viewerCaption');
  var infoBox = document.getElementById('viewerInfo');
  var hint = document.getElementById('viewerHint');
  var idx = 0;
  var scale = 1, tx = 0, ty = 0;
  var MIN = 1, MAX = 6;

  var coarse = matchMedia('(hover:none)').matches;
  hint.textContent = coarse
    ? 'Тап — приблизить · двумя пальцами — свободно · ещё тап — вернуть'
    : 'Клик — приблизить · колесо — свободно · Esc — закрыть';

  function apply(animate){
    art.style.transition = animate ? 'transform .42s cubic-bezier(.22,1,.36,1)' : 'none';
    art.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
    art.classList.toggle('is-zoomed', scale > 1.02);
    viewer.classList.toggle('is-zoomed', scale > 1.02);
  }

  function limits(){
    var st = stage.getBoundingClientRect();
    return {
      x: Math.max(0, (art.offsetWidth * scale - st.width) / 2),
      y: Math.max(0, (art.offsetHeight * scale - st.height) / 2)
    };
  }
  function clampPan(){
    var l = limits();
    tx = Math.min(l.x, Math.max(-l.x, tx));
    ty = Math.min(l.y, Math.max(-l.y, ty));
  }

  /* увеличение к точке (координаты относительно центра сцены) */
  function zoomAt(k, px, py, animate){
    var target = Math.min(MAX, Math.max(MIN, scale * k));
    k = target / scale;
    if (k === 1) return;
    tx = px - (px - tx) * k;
    ty = py - (py - ty) * k;
    scale = target;
    if (scale <= MIN + .001){ scale = 1; tx = 0; ty = 0; }
    clampPan();
    apply(animate !== false);
  }

  function resetZoom(){ scale = 1; tx = 0; ty = 0; apply(true); }

  function centerOf(e){
    var st = stage.getBoundingClientRect();
    return { x: e.clientX - (st.left + st.width / 2), y: e.clientY - (st.top + st.height / 2) };
  }

  /* ---- указатели: перетаскивание, тап, щипок ---- */
  var pointers = {}, lastDist = 0, moved = 0, downAt = null, multi = false;

  function pointerList(){ return Object.keys(pointers).map(function(k){ return pointers[k]; }); }
  function dist(){
    var p = pointerList();
    return Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y);
  }

  stage.addEventListener('pointerdown', function(e){
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    moved = 0; downAt = { x: e.clientX, y: e.clientY, t: Date.now() };
    if (pointerList().length === 1) multi = false;          // новый жест одним пальцем
    if (pointerList().length === 2){ multi = true; lastDist = dist(); art.style.transition = 'none'; }
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* синтетические события */ }
  });

  stage.addEventListener('pointermove', function(e){
    if (!pointers[e.pointerId]) return;
    var prev = pointers[e.pointerId];
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var two = pointerList().length === 2;

    if (two){
      var d = dist();
      if (lastDist > 0 && d > 0){
        var mid = pointerList();
        var st = stage.getBoundingClientRect();
        zoomAt(d / lastDist,
               (mid[0].x + mid[1].x) / 2 - (st.left + st.width / 2),
               (mid[0].y + mid[1].y) / 2 - (st.top + st.height / 2),
               false);
      }
      lastDist = d;
      return;
    }
    if (scale > 1.02){
      tx += e.clientX - prev.x;
      ty += e.clientY - prev.y;
      moved += Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
      clampPan();
      apply(false);
    }
  });

  function endPointer(e){
    delete pointers[e.pointerId];
    if (pointerList().length === 0 && downAt){
      var quick = Date.now() - downAt.t < 400;
      // короткий тап — переключатель: приблизили к точке касания, ещё тап — вернули.
      // (двойной тап отдельно считать не нужно: получается сам собой и не сбивается)
      // после щипка жест НЕ считается тапом — иначе зум сбрасывался бы сразу
      if (!multi && moved < 8 && quick){
        var c = centerOf({ clientX: downAt.x, clientY: downAt.y });
        if (scale > 1.02) resetZoom();
        else zoomAt(2.6, c.x, c.y, true);
      }
      downAt = null;
    }
    lastDist = 0;
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('pointerleave', endPointer);

  stage.addEventListener('wheel', function(e){
    e.preventDefault();
    var c = centerOf(e);
    zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, c.x, c.y, false);
  }, { passive: false });

  stage.addEventListener('dblclick', function(e){ e.preventDefault(); resetZoom(); });

  /* ---- открытие и закрытие ---- */
  function paint(){
    var w = queue[idx];
    art.innerHTML = w ? w.html : '';
    art.style.transition = 'none';
    resetZoom();
    cap.textContent = (w ? w.title : '') + ' · ' + (w ? w.hall : '');
    infoBox.innerHTML = w ? w.info : '';
    hint.classList.remove('is-faded');
    requestAnimationFrame(function(){ hint.classList.add('is-faded'); });
    // подгружаем соседний экспонат, чтобы листалось без ожидания
    var nextImg = document.querySelector('#viewerArt img');
    if (nextImg && queue[idx + 1]){
      var m = queue[idx + 1].html.match(/src="([^"]+)"/);
      if (m) new Image().src = m[1];
    }
  }

  function open(i){
    idx = Math.max(0, Math.min(queue.length - 1, i));
    paint();
    viewer.hidden = false;
    requestAnimationFrame(function(){ viewer.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }
  function close(){
    resetZoom();
    viewer.classList.remove('is-open');
    setTimeout(function(){ viewer.hidden = true; }, 320);
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.canvas').forEach(function(canvas){
    canvas.style.cursor = 'zoom-in';
    canvas.addEventListener('click', function(){
      open(halls.indexOf(canvas.closest('.hall')));
    });
  });
  document.getElementById('viewerClose').addEventListener('click', close);
  document.getElementById('viewerPrev').addEventListener('click', function(){ open(idx - 1); });
  document.getElementById('viewerNext').addEventListener('click', function(){ open(idx + 1); });
  viewer.addEventListener('click', function(e){
    if (e.target === viewer || e.target === stage) close();
  });

  addEventListener('keydown', function(e){
    if (viewer.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
    if (e.key === '+' || e.key === '=') zoomAt(1.4, 0, 0, true);
    if (e.key === '-') zoomAt(1 / 1.4, 0, 0, true);
    if (e.key === '0') resetZoom();
  });

  /* ---- тихий параллакс холстов (только сдвиг) ---- */
  if (!reduce){
    var canvases = [].slice.call(document.querySelectorAll('.canvas'));
    var raf = null;
    function parallax(){
      canvases.forEach(function(c){
        var r = c.getBoundingClientRect();
        var t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        c.style.transform = 'translateY(' + (t * -18).toFixed(1) + 'px)';
      });
      raf = null;
    }
    addEventListener('scroll', function(){
      if (raf) return;
      raf = requestAnimationFrame(parallax);
    }, { passive: true });
  }
})();
