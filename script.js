/* Галерея: счётчик залов, появление при входе, режим рассматривания.
   Всё без библиотек. Учтено: во встроенном просмотре приложения кадровый цикл
   и IntersectionObserver могут не работать — поэтому есть аварийная страховка. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var halls = [].slice.call(document.querySelectorAll('.hall[data-hall]'));
  var inner = [].slice.call(document.querySelectorAll('.hall__inner'));
  var rail = document.getElementById('railFill');
  var numEl = document.getElementById('hallNum');
  var totalEl = document.getElementById('hallTotal');

  totalEl.textContent = 'из ' + halls.length;
  // число экспонатов в подводке берём из разметки, чтобы не расходилось
  var w = document.getElementById('countWord');
  if (w){
    var words = ['Ноль','Один','Два','Три','Четыре','Пять','Шесть','Семь','Восемь','Девять'];
    w.textContent = words[halls.length] || String(halls.length);
  }

  /* ---- появление при входе в зал ---- */
  function reveal(el){ el.classList.add('is-in'); }
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: .18 });
    inner.forEach(function(el){ io.observe(el); });
  }
  // аварийная страховка: если наблюдатель не сработал — показать всё
  setTimeout(function(){
    inner.forEach(function(el, i){ setTimeout(function(){ reveal(el); }, i * 60); });
  }, 1600);

  /* ---- счётчик залов и нить ---- */
  var lastY = -1;
  function frame(){
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
    rail.style.height = (p * 100).toFixed(2) + '%';

    var mid = scrollY + innerHeight * .5, current = null;
    halls.forEach(function(el){
      var top = el.offsetTop, bottom = top + el.offsetHeight;
      if (mid >= top && mid < bottom) current = el;
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
  setInterval(frame, 500);   // страховка: счётчик живёт даже там, где кадры заморожены

  /* ---- режим рассматривания ---- */
  var viewer = document.getElementById('viewer');
  var art = document.getElementById('viewerArt');
  var cap = document.getElementById('viewerCaption');
  var queue = halls.map(function(el){
    var canvas = el.querySelector('.canvas');
    var title = el.querySelector('.plaque h2');
    return {
      html: canvas ? canvas.innerHTML.replace(/<button[\s\S]*?<\/button>/, '') : '',
      caption: (title ? title.textContent : '') + ' · ' + (el.querySelector('.hall__label') || {textContent:''}).textContent
    };
  });
  var idx = 0;

  function paint(){
    art.innerHTML = queue[idx] ? queue[idx].html : '';
    cap.textContent = queue[idx] ? queue[idx].caption : '';
  }
  function open(i){
    idx = Math.max(0, Math.min(queue.length - 1, i));
    paint();
    viewer.hidden = false;
    requestAnimationFrame(function(){ viewer.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }
  function close(){
    viewer.classList.remove('is-open');
    setTimeout(function(){ viewer.hidden = true; }, 320);
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.canvas').forEach(function(canvas){
    canvas.style.cursor = 'zoom-in';
    canvas.addEventListener('click', function(){
      var hall = canvas.closest('.hall');
      open(halls.indexOf(hall));
    });
  });
  document.getElementById('viewerClose').addEventListener('click', close);
  document.getElementById('viewerPrev').addEventListener('click', function(){ open(idx - 1); });
  document.getElementById('viewerNext').addEventListener('click', function(){ open(idx + 1); });

  addEventListener('keydown', function(e){
    if (viewer.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
  });

  /* свайп между экспонатами */
  var x0 = null;
  viewer.addEventListener('pointerdown', function(e){ x0 = e.clientX; });
  viewer.addEventListener('pointerup', function(e){
    if (x0 === null) return;
    var dx = e.clientX - x0;
    if (Math.abs(dx) > 50) open(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* ---- тихий параллакс холстов (только сдвиг, без масштаба) ---- */
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
  /* ---- примерка стены: включается адресом ?wall=demo, обычным гостям не видна ---- */
  if (/[?&]wall=demo/.test(location.search)) {
    var pick = document.createElement('div');
    pick.className = 'wallpick is-on';
    pick.innerHTML = '<b>Стена</b>';
    [{ n: 'A', f: 'img/wall.jpg' }, { n: 'B', f: 'img/wall-2.jpg' }].forEach(function(w, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = w.n;
      if (i === 0) b.className = 'is-on';
      b.addEventListener('click', function(){
        document.body.style.backgroundImage = "url('" + w.f + "')";
        [].slice.call(pick.querySelectorAll('button')).forEach(function(x){ x.classList.remove('is-on'); });
        b.classList.add('is-on');
      });
      pick.appendChild(b);
    });
    document.body.appendChild(pick);
  }
})();
