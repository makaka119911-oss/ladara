/* =========================================================================
   LADARA — пыль в свете зала: на обложке и в колофоне.

   Одна и та же вещь в двух местах: вошёл в зал с пылью — вышел из зала с пылью.
   Больше нигде её нет, и это осознанно: пыль живёт там, где есть свет. В залах фон —
   ровная обоями текстура стены без источника света, и пыль там превращается в «снег».

   Настройки — в data.js, блок effects. Карта света снята с самих фотографий зала
   (яркость сеткой 12×12 по кадру), поэтому мошки видны там, где свет, и их почти нет
   в тёмных местах, где лежит текст.

   Чего здесь НЕ делается сознательно:
   — нет библиотек и CDN: ~12 КБ своего кода вместо 693 КБ (библиотека Shaders требует
     WebGPU, а он на телефоне выключен — проверено 08.10.2026);
   — нет блюра и mix-blend-mode, нет ничего поверх читаемого текста;
   — канвас живёт внутри медиа-слоя, ниже вуали и ниже текста, поэтому вёрстку сдвинуть
     или перехватить нажатие не может;
   — канвас рисуется только пока его секция на экране.

   Без WebGL2 (или при «меньше движения») не рисуется ничего: страница выглядит как раньше.
   ========================================================================= */
(function () {
  'use strict';

  /* яркость фотографии зала по сетке 12×12, снятая с кадра секции
     (phone — кадр 390×844, desk — кадр 16:9) */
  var MAPS = {
    coverDust: {
      phone: [18,19,19,20,23,24,24,27,41,58,61,53, 16,18,20,22,26,32,40,53,62,61,57,59,
        17,20,24,30,39,51,61,60,52,47,54,72, 21,18,21,43,65,63,55,45,41,49,70,91,
        22,15,22,50,69,55,43,39,46,64,79,81, 18,15,20,36,46,46,43,44,56,75,79,72,
        10,10,10,11,15,28,42,47,57,63,59,64, 9,9,9,8,9,15,32,45,47,44,43,57,
        13,13,12,12,14,16,26,38,40,39,39,54, 20,19,19,19,20,20,25,34,39,39,35,38,
        28,28,27,26,25,26,29,38,45,48,49,55, 36,35,34,33,32,32,36,43,47,50,51,55],
      desk: [8,10,10,11,13,17,22,35,58,88,87,49, 9,10,11,12,15,20,31,52,89,126,112,58,
        10,11,13,14,19,29,49,83,133,170,139,69, 10,12,16,19,26,45,74,116,168,197,149,72,
        11,13,18,25,36,61,94,132,177,198,140,66, 13,14,19,29,44,70,98,123,158,175,121,56,
        15,16,19,30,46,69,86,98,125,145,101,47, 16,18,20,30,45,60,66,71,95,117,85,41,
        19,20,20,31,45,52,53,55,76,95,69,37, 24,24,23,32,44,48,47,51,68,79,55,33,
        31,30,28,34,42,45,45,50,64,69,48,33, 36,35,32,34,39,42,43,49,59,60,44,36]
    },
    colophonDust: {
      /* outro.jpg: мягкое свечение в центре, низ тёмный — там лежит текст колофона */
      phone: [35,35,36,36,37,37,37,37,36,36,37,37, 27,28,28,29,30,30,30,30,29,28,28,28,
        20,21,22,24,25,25,26,25,24,23,22,22, 15,17,20,21,23,25,24,23,20,19,18,17,
        13,17,22,26,36,48,48,37,26,21,19,17, 17,22,27,32,45,69,74,52,36,29,25,21,
        17,23,27,30,36,43,46,40,34,30,26,21, 16,21,23,27,36,54,58,42,30,25,24,20,
        12,16,19,23,36,61,65,41,26,21,18,16, 9,11,14,17,23,32,34,26,20,17,14,12,
        8,9,11,13,17,24,25,20,16,13,10,8, 7,8,10,12,15,21,22,18,15,13,10,8],
      desk: [30,31,31,32,32,32,32,32,31,31,31,31, 24,25,25,25,26,26,26,26,25,25,25,24,
        18,19,19,20,21,21,21,21,20,19,19,18, 14,15,17,18,20,21,21,20,18,17,16,15,
        12,15,19,22,30,40,40,31,22,18,16,14, 15,19,23,27,38,58,62,44,30,24,21,18,
        15,20,23,25,30,36,39,34,29,25,22,18, 14,18,20,23,30,45,49,35,25,21,20,17,
        11,14,16,19,30,51,55,35,22,18,15,14, 8,9,12,14,19,27,29,22,17,14,12,10,
        7,8,9,11,14,20,21,17,13,11,9,7, 6,7,8,10,13,18,19,15,13,11,9,7]
    }
  };

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

  var E = (window.MUSEUM && window.MUSEUM.effects) || {};
  if (E.dust === false) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var dbg = /[?&]dustdbg=1/.test(location.search);
  var MAX_COUNT = 3200;
  var COUNT = Math.max(1, Math.min(MAX_COUNT, E.count || 1200));
  var SIZE = E.size || 1.0;
  var POWER = E.strength || 1.2;
  var RES = E.res || 0.5;
  var SPEED = E.speed || 1.0;
  var FPS = E.fps || 0;
  var debugAPI = {};

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  /* заводим один зал: свой канвас, своя карта света, свой цикл кадров */
  function mount(id) {
    var cv = document.getElementById(id);
    if (!cv || !MAPS[id]) return;

    var gl = cv.getContext('webgl2', {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: true, powerPreference: 'low-power',
      preserveDrawingBuffer: dbg
    });
    if (!gl) { cv.style.display = 'none'; return; }

    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS_MOTES));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS_MOTES));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) {
      cv.style.display = 'none';    /* не собралось — отдаём странице её обычный вид */
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
    function pickMask() { uploadMask(innerWidth >= 768 ? MAPS[id].desk : MAPS[id].phone); }
    pickMask();

    function rnd(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    var R = rnd(20261008);
    var uv = new Float32Array(MAX_COUNT * 2), phase = new Float32Array(MAX_COUNT),
        scale = new Float32Array(MAX_COUNT), seedA = new Float32Array(MAX_COUNT);
    for (var i = 0; i < MAX_COUNT; i++) {
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
    var bUv = makeBuffer(uv), bPhase = makeBuffer(phase),
        bScale = makeBuffer(scale), bSeed = makeBuffer(seedA);
    var lUv = attr('a_uv'), lPhase = attr('a_phase'), lScale = attr('a_scale'), lSeed = attr('a_seed');
    var uTime = gl.getUniformLocation(prog, 'u_time'), uSpeed = gl.getUniformLocation(prog, 'u_speed'),
        uPx = gl.getUniformLocation(prog, 'u_px'), uSize = gl.getUniformLocation(prog, 'u_size'),
        uMask = gl.getUniformLocation(prog, 'u_mask'), uRes = gl.getUniformLocation(prog, 'u_res'),
        uOp = gl.getUniformLocation(prog, 'u_opacity'), uTw = gl.getUniformLocation(prog, 'u_twinkle');

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

    /* секция на экране? Цикл кадров не останавливаем никогда — только пропускаем рисование:
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

    resize();
    requestAnimationFrame(frame);
    cv.style.opacity = 1;

    var rt = 0;
    addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { pickMask(); resize(); }, 150);
    });

    if (dbg) {
      debugAPI[id] = {
        frame: function (t) { draw(t); },
        sum: function () {
          var p = new Uint8Array(cv.width * cv.height * 4);
          gl.readPixels(0, 0, cv.width, cv.height, gl.RGBA, gl.UNSIGNED_BYTE, p);
          var n = 0, top = 0;
          for (var k = 3; k < p.length; k += 4) { if (p[k] > 0) { n++; if (p[k] > top) top = p[k]; } }
          return { точек: n, максимум: top, всего: p.length / 4 };
        },
        /* перебор настроек без правки data.js — только в служебном режиме */
        set: function (o) {
          if (o.count) COUNT = Math.max(1, Math.min(MAX_COUNT, o.count));
          if (o.size) SIZE = o.size;
          if (o.power) POWER = o.power;
        }
      };
    }
  }

  function boot() { mount('coverDust'); mount('colophonDust'); }
  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot, { once: true });

  /* совместимость с прежним одиночным хуком: ?dustdbg=1&… смотрит на обложку */
  if (dbg) {
    Object.defineProperty(window, '__dustFrame', { get: function () { return debugAPI.coverDust && debugAPI.coverDust.frame; } });
    Object.defineProperty(window, '__dustSum', { get: function () { return debugAPI.coverDust && debugAPI.coverDust.sum; } });
    Object.defineProperty(window, '__dustSet', { get: function () { return debugAPI.coverDust && debugAPI.coverDust.set; } });
    window.__dust = debugAPI;
  }
})();
