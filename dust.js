/* =========================================================================
   LADARA — пыль в свете зала на обложке.
   Рисуется на канвасе поверх фотографии зала. Настройки — в data.js, блок effects.
   Карта света снята с самой фотографии: мошки видны там, где свет, и их почти нет
   в тёмном углу за текстом.

   Чего здесь НЕ делается сознательно:
   — нет библиотек и CDN: ~5 КБ своего кода вместо 693 КБ (WebGPU-библиотека Shaders
     на телефоне вообще не запускается, замер 08.10.2026);
   — нет блюра, нет mix-blend-mode, нет ничего поверх читаемого текста;
   — нет ни одного обращения к DOM сайта: канвас живёт внутри .cover__media,
     ниже вуали и текста, поэтому вёрстку сдвинуть не может.

   Без WebGL2 (или при «меньше движения») не рисуется ничего: страница выглядит
   ровно как раньше, канвас пуст и прозрачен.
   ========================================================================= */
(function () {
  'use strict';

  var cv = document.getElementById('coverDust');
  if (!cv) return;

  var E = (window.MUSEUM && window.MUSEUM.effects) || {};
  if (E.dust === false) { cv.style.display = 'none'; return; }

  var COUNT = Math.max(1, Math.min(3200, E.count || 1200));
  var SIZE = E.size || 1.0;
  var POWER = E.strength || 1.2;
  var RES = E.res || 0.5;
  var SPEED = E.speed || 1.0;
  var FPS = E.fps || 0;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.style.display = 'none'; return; }

  /* ?dustdbg=1 — служебный режим для проверок: держит кадр в буфере, чтобы его можно было
     прочитать (readPixels) и посчитать, сколько мошек реально нарисовано. На обычной
     странице не включается и ничего не стоит. */
  var dbg = /[?&]dustdbg=1/.test(location.search);

  var gl = cv.getContext('webgl2', {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: true, powerPreference: 'low-power',
    preserveDrawingBuffer: dbg
  });
  if (!gl) { cv.style.display = 'none'; return; }

  /* яркость фотографии зала по сетке 12×12, снятая с кадра обложки
     (phone — hero-phone.webp, кадр 390×844; desk — hero-desk.webp, кадр 16:9) */
  var MASK_PHONE = [8,7,8,9,10,11,11,14,18,23,41,75,8,8,6,6,8,10,14,19,29,54,99,138,4,8,8,8,11,15,22,38,70,108,118,105,3,5,6,9,13,21,35,48,72,88,71,51,6,7,7,11,18,30,53,53,57,59,49,38,6,7,8,12,22,38,55,52,48,41,35,31,5,6,7,10,20,32,43,50,56,53,39,28,13,13,15,21,31,44,61,81,87,70,47,32,19,21,24,30,39,50,68,80,81,68,47,34,15,14,16,19,21,29,48,49,54,56,42,31,20,21,19,18,18,24,39,48,76,88,58,37,21,23,24,25,26,28,30,43,99,124,73,40];
  var MASK_DESK = [2,2,2,3,5,10,16,29,64,108,92,45,1,1,2,3,6,12,21,43,76,98,72,36,0,1,2,4,7,14,32,68,91,81,49,26,1,1,3,5,8,17,42,88,95,62,34,20,2,3,3,5,9,19,44,88,83,45,24,17,3,4,3,5,9,18,40,72,63,33,19,14,3,4,3,5,9,18,36,57,47,26,16,12,3,4,4,6,11,22,42,55,42,24,15,11,5,6,6,10,18,32,60,72,50,28,17,12,7,8,10,15,25,44,79,94,67,38,23,17,8,10,12,18,27,45,80,104,81,47,29,21,8,10,13,18,24,38,69,101,86,49,30,22];

  var VS_MOTES =
    '#version 300 es\n' +
    'in vec2 a_uv; in float a_phase; in float a_scale; in float a_seed;\n' +
    'uniform float u_time, u_speed, u_px, u_size;\n' +
    'out float v_phase; out float v_w;\n' +
    'void main(){\n' +
    '  float t = u_time;\n' +
    '  float y = fract(a_uv.y - t * (0.004 + 0.010 * a_seed) * u_speed);\n' +
    '  float x = a_uv.x + sin(t * 0.11 + a_phase * 6.2831) * 0.010 + sin(t * 0.053 + a_seed * 9.0) * 0.006;\n' +
    '  gl_Position = vec4(x * 2.0 - 1.0, 1.0 - y * 2.0, 0.0, 1.0);\n' +
    '  gl_PointSize = a_scale * u_px * u_size * (1.0 + 0.18 * sin(t * 0.45 + a_phase * 6.2831));\n' +
    '  v_phase = a_phase; v_w = 0.75 + 0.5 * a_seed;\n' +
    '}';

  var FS_MOTES =
    '#version 300 es\n' +
    'precision highp float;\n' +
    'in float v_phase; in float v_w;\n' +
    'uniform sampler2D u_mask; uniform vec2 u_res;\n' +
    'uniform float u_time, u_opacity, u_twinkle;\n' +
    'out vec4 outColor;\n' +
    'void main(){\n' +
    '  float r = length(gl_PointCoord - 0.5) * 2.0;\n' +
    '  float a = pow(smoothstep(1.0, 0.0, r), 1.3) + pow(max(1.0 - r, 0.0), 6.0) * 0.55;\n' +
    '  vec2 suv = vec2(gl_FragCoord.x / u_res.x, 1.0 - gl_FragCoord.y / u_res.y);\n' +
    '  float m = texture(u_mask, suv).r;\n' +
    '  float w = mix(0.04, 1.0, pow(m, 1.75));\n' +
    '  float tw = mix(1.0, 0.40 + 0.60 * sin(u_time * 0.85 + v_phase * 6.2831), u_twinkle);\n' +
    '  float al = clamp(a * w * tw * v_w * u_opacity, 0.0, 1.0);\n' +
    '  outColor = vec4(vec3(0.949, 0.925, 0.886) * al, al);\n' +
    '}';

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS_MOTES));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS_MOTES));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    cv.style.display = 'none';      /* не собралось — молча отдаём странице её обычный вид */
    return;
  }

  var maskTex = gl.createTexture();
  function uploadMask(arr) {
    var max = 1, data = new Uint8Array(arr.length);
    for (var i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
    for (var j = 0; j < arr.length; j++) data[j] = Math.round(arr[j] / max * 255);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 12, 12, 0, gl.RED, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  function pickMask() { uploadMask(innerWidth >= 768 ? MASK_DESK : MASK_PHONE); }
  pickMask();

  /* детерминированный набор мошек: прогон повторяем, картинка не «прыгает» между загрузками */
  function rnd(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var R = rnd(20261008);
  var uv = new Float32Array(COUNT * 2), phase = new Float32Array(COUNT),
      scale = new Float32Array(COUNT), seedA = new Float32Array(COUNT);
  for (var i = 0; i < COUNT; i++) {
    uv[i * 2] = R(); uv[i * 2 + 1] = R();
    phase[i] = R();
    scale[i] = 1.0 + Math.pow(R(), 2) * 2.5;
    seedA[i] = R();
  }

  function attr(name) { return gl.getAttribLocation(prog, name); }
  function makeBuffer(data) {
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  }
  function bind(buf, loc, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  var bUv, bPhase, bScale, bSeed;
  var lUv = attr('a_uv'), lPhase = attr('a_phase'), lScale = attr('a_scale'), lSeed = attr('a_seed');
  var uTime = gl.getUniformLocation(prog, 'u_time'), uSpeed = gl.getUniformLocation(prog, 'u_speed'),
      uPx = gl.getUniformLocation(prog, 'u_px'), uSize = gl.getUniformLocation(prog, 'u_size'),
      uMask = gl.getUniformLocation(prog, 'u_mask'), uRes = gl.getUniformLocation(prog, 'u_res'),
      uOp = gl.getUniformLocation(prog, 'u_opacity'), uTw = gl.getUniformLocation(prog, 'u_twinkle');

  function build() {
    bUv = makeBuffer(uv); bPhase = makeBuffer(phase);
    bScale = makeBuffer(scale); bSeed = makeBuffer(seedA);
  }

  var px = 3;
  function resize() {
    var r = cv.parentElement.getBoundingClientRect();
    var dpr = Math.min(devicePixelRatio || 1, 3);
    var w = Math.max(1, Math.round(r.width * dpr * RES));
    var h = Math.max(1, Math.round(r.height * dpr * RES));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    px = h / Math.max(1, r.height);
  }

  function draw(t) {
    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.uniform1i(uMask, 0);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uSpeed, SPEED);
    gl.uniform1f(uPx, px);
    gl.uniform1f(uSize, SIZE);
    gl.uniform1f(uOp, 0.9 * POWER);
    gl.uniform1f(uTw, 0.55);
    gl.uniform2f(uRes, cv.width, cv.height);
    bind(bUv, lUv, 2); bind(bPhase, lPhase, 1); bind(bScale, lScale, 1); bind(bSeed, lSeed, 1);
    gl.drawArrays(gl.POINTS, 0, COUNT);
  }

  /* Видима ли обложка. Цикл кадров не останавливаем никогда — только пропускаем рисование:
     остановленный цикл в некоторых просмотрщиках оставляет пустой канвас (проверено). */
  var onScreen = true;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; },
      { rootMargin: '120px' }).observe(cv);
  }

  var start = 0, lastDraw = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    if (FPS && now - lastDraw < (1000 / FPS) - 2) return;
    lastDraw = now;
    if (!start) start = now;
    draw((now - start) / 1000);
  }

  function init() {
    if (!bUv) build();
    resize();
    requestAnimationFrame(frame);
  }

  cv.style.opacity = 1;
  if (dbg) {
    window.__dustFrame = function (t) { draw(t); };
    window.__dustSum = function () {
      var p = new Uint8Array(cv.width * cv.height * 4);
      gl.readPixels(0, 0, cv.width, cv.height, gl.RGBA, gl.UNSIGNED_BYTE, p);
      var n = 0, top = 0;
      for (var i = 3; i < p.length; i += 4) { if (p[i] > 0) { n++; if (p[i] > top) top = p[i]; } }
      return { точек: n, максимум: top, всего: p.length / 4 };
    };
  }
  if (document.readyState === 'complete') init();
  else addEventListener('load', init, { once: true });

  var t = 0;
  addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { pickMask(); resize(); }, 150);
  });
})();
