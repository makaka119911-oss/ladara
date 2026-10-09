/* =========================================================================
   LADARA — музей работ. ДАННЫЕ.
   Всё, что меняется при наполнении, живёт ЗДЕСЬ — разметка и стили не трогаются.
   Добавить новый зал = добавить объект в массив works.
   ========================================================================= */

window.MUSEUM = {

  studio: 'LADARA',

  /* --- ВХОД --- */
  hero: {
    kicker: 'Галерея работ',
    /* перенос — жёсткий, для большого экрана. ПРОБЕЛ перед переносом обязателен:
       на телефоне <br> гасится, и без пробела «приложения,» и «боты» слипаются
       в одно непереносимое слово 253 px — оно вылезало за 62 % и заезжало на раму на 45 px */
    title: 'Сайты, приложения, \nботы',
    offer: 'Собираю цифровые вещи: сайты, приложения, ботов. Вручную, без конструкторов.',
    cta: 'Войти в галерею',
    image: 'img/hero-phone.jpg',     // телефон
    imageDesk: 'img/hero-desk.jpg'   // десктоп
  },

  /* --- ОБ АВТОРЕ --- */
  author: {
    kicker: 'Смотритель',
    title: 'Об авторе',
    photo: 'img/autor.webp',
    photoAlt: 'Фото автора',
    workshop: 'img/about-workshop.webp',
    text: [
      'Делаю сайты, приложения и ботов. Работаю с Cursor и ИИ-агентами: они берут рутину, решения остаются за мной.',
      'Верстаю сам, без конструкторов — код остаётся под контролем. Мне важно, чтобы сделанная вещь работала тихо, точно и долго.'
    ]
  },

  /* --- ФИНАЛ --- */
  outro: {
    kicker: 'Конец экспозиции',
    title: 'Нужно похожее?',
    text: 'Расскажите задачу — соберу так же: от идеи до живого адреса. Сайт, приложение, бот, лендинг под запуск.',
    image: 'img/outro.jpg',
    note: 'Экспонаты живые: ссылки в табличках ведут на настоящие проекты.'
  },

  /* --- КОНТАКТ --- */
  contact: {
    telegram: 'https://t.me/LADAR888',
    telegramLabel: '@LADAR888',
    email: 'makaka119911@gmail.com'
  },


  /* --- ПЕЧАТНЫЕ РАБОТЫ: афиши событий --- */
  posters: {
    kicker: 'Кабинет гравюр',
    title: 'Афиши',
    lead: 'Плакаты для событий — ретриты, медитации, женские круги. Композиция и свет — вместе с ИИ-генератором, текст всегда набран настоящими шрифтами.',
    items: [
      /* Порядок — от ближайшего события к прошедшим: у стены афиш первым идёт то, куда ещё можно успеть.
         art — лёгкая версия для стены, big — крупная, её показываем только при открытии. */
      { art: 'img/posters/vremya-zamedlitsya.webp',           big: 'img/posters/big/vremya-zamedlitsya.webp',           title: 'Время замедлиться',            note: 'медитация в замке · 11 октября 2026' },
      { art: 'img/posters/naydi-v-sebe-sebya.webp',           big: 'img/posters/big/naydi-v-sebe-sebya.webp',           title: 'Найди в себе себя',            note: 'ретрит · 17 октября 2026 · Немчиновка' },
      { art: 'img/posters/zamok-barbekyu-25-oktyabrya.webp',  big: 'img/posters/big/zamok-barbekyu-25-oktyabrya.webp',  title: 'Замок Барбекю',                note: 'вечер королев · 25 октября' },
      { art: 'img/posters/otkrytie-doveriya.webp',            big: 'img/posters/big/otkrytie-doveriya.webp',            title: 'Открытие доверия',             note: 'замок в Немчиновке · 31 октября 2026' },
      { art: 'img/posters/pogruzhenie-v-seksualnost-2.webp',  big: 'img/posters/big/pogruzhenie-v-seksualnost-2.webp',  title: 'Погружение в сексуальность',   note: 'уровень 2 · 31 октября' },
      { art: 'img/posters/zamok-barbekyu-4-oktyabrya.webp',   big: 'img/posters/big/zamok-barbekyu-4-oktyabrya.webp',   title: 'Замок Барбекю',                note: 'вечер королев · 4 октября' },
      { art: 'img/posters/klyuchi-4-iyulya.webp',             big: 'img/posters/big/klyuchi-4-iyulya.webp',             title: 'Ключи от Зачарованного замка', note: 'три двери · 4 июля 2026' },
      { art: 'img/posters/bogini-nikiforovki.webp',           big: 'img/posters/big/bogini-nikiforovki.webp',           title: 'Богини Никифоровки',           note: 'открытая фотосессия · июль 2026' },
      { art: 'img/posters/fotosessiya-v-nikiforovke.webp',    big: 'img/posters/big/fotosessiya-v-nikiforovke.webp',    title: 'Фотосессия в Никифоровке',     note: 'коллекция макраме · июль' },
      { art: 'img/posters/ognennyy-massazh.webp',             big: 'img/posters/big/ognennyy-massazh.webp',             title: 'Огненный массаж',              note: 'церемония с поющими чашами · Реутово' },
      { art: 'img/posters/misteriya-chuvstvennosti.webp',     big: 'img/posters/big/misteriya-chuvstvennosti.webp',     title: 'Мистерия чувственности',       note: 'частный замок · 29 марта' }
    ],
    /* Не афиши событий, а работы без даты (перечень услуг, листовка) — поэтому не в стене,
       а карточками под ней. Их может быть несколько: на телефоне встают колонкой,
       на большом экране — рядом. Двусторонняя листовка открывается лицевой стороной,
       в просмотре её можно перевернуть (кнопка «Обратная сторона»). */
    leaflet: [
      {
        art: 'img/posters/ognennaya-ceremoniya.webp',
        big: 'img/posters/big/ognennaya-ceremoniya.webp',
        back: 'img/posters/ognennaya-ceremoniya-2.webp',
        backBig: 'img/posters/big/ognennaya-ceremoniya-2.webp',
        title: 'Огненная церемония',
        note: 'листовка, две стороны · массаж огнём · Реутов'
      },
      {
        art: 'img/posters/chto-tebya-zhdet.webp',
        big: 'img/posters/big/chto-tebya-zhdet.webp',
        title: 'Буклет',
        note: 'что входит в процедуры · массаж, масла, чаши · Реутов и Немчиновка'
      }
    ]
  },
  /* --- ЗАЛЫ. Акцент у каждого — из палитры самого проекта ---
     art    — что висит в зале (атмосфера зала)
     shot   — настоящий вид работы; появится на этапе 2, тогда art уйдёт на фон
     stub   — true: зал-заглушка, только номер, название и строка
  */
  works: [
    {
      num: '01',
      hall: 'I',
      title: 'Семь ремёсел',
      line: 'Лендинг видеокурсов ручной работы: семь ремёсел, показанных спокойно и по делу.',
      accent: '#4568d0',
      art: 'img/hall-remesla.jpg',
      shot: null,
      stub: false,
      facts: {
        what: 'лендинг видеокурсов ручной работы',
        made: 'HTML, CSS, JavaScript — статический сайт',
        state: 'в сети'
      },
      url: 'https://makaka119911-oss.github.io/sem-remesel/',
      urlLabel: 'Открыть сайт'
    },
    {
      num: '02',
      hall: 'II',
      title: 'Сексология и психология',
      line: 'Сайт секс-терапии для женщин: направления работы, афиша встреч, запись.',
      accent: '#6e2b2b',
      art: 'img/hall-sexology.jpg',
      shot: null,
      stub: false,
      facts: {
        what: 'сайт секс-терапии для женщин',
        made: 'HTML, CSS, JavaScript; содержание — из JSON',
        state: 'в сети'
      },
      url: 'https://xn--c1adkgfrbtc9l.com/',
      urlLabel: 'Открыть сайт'
    },
    {
      num: '03',
      hall: 'III',
      title: 'Женский мир',
      line: 'Приложение для женщин: цикл, дневник, круг, звонки и ассистентка — в одном месте.',
      accent: '#5b4fb0',
      art: 'img/hall-zh.jpg',
      shot: null,
      stub: false,
      facts: {
        what: 'приложение для женщин (PWA), закрытая бета',
        made: 'React, Node.js, PostgreSQL, Redis, Docker',
        state: 'в сети'
      },
      url: 'https://zhenskiy-mir.139-100-237-242.sslip.io/',
      urlLabel: 'Открыть приложение'
    }

    /* Новый зал добавляется так же — и всё: разметку и стили трогать не нужно.
    ,{
      num: '04', hall: 'IV',
      title: 'Название',
      line: 'Одна строка, что это и для кого.',
      accent: '#7a5a2e',
      art: null, shot: null, stub: true,      // заглушка: без картинки
      facts: { what: '…', made: '…', state: '…' },
      url: ''
    }
    */
  ],

  /* --- ЭФФЕКТЫ ЗАЛА ---
     Пыль в свете на обложке. Рисуется на канвасе поверх фотографии зала; на телефоне
     это стоит почти ничего (замер: 59,5 к/с, кадров длиннее 33 мс — 0,3 %).
     Карта света снята с самой фотографии, поэтому мошки видны там, где свет.

     Как выключить: dust: false — канвас не создаётся вовсе, страница выглядит как раньше.
     Как убрать совсем: удалить <canvas id="coverDust"> и <script src="dust.js"> из index.html.

     Тонкая настройка — только эти числа, код трогать не нужно:
       count    600…3200   сколько мошек (заметность растёт в основном отсюда)
       size     0.8…2.2    крупность
       strength 0.5…2.5    сила; выше ~1,6 почти не видно разницы — ядро упирается в яркость
       res      0.35…1     разрешение канваса; 0,5 на глаз не отличить, а точек вчетверо меньше
       fps      0 или 30   ограничение кадров: 30 — беречь батарею на слабых телефонах
  */
  effects: {
    dust: true,
    count: 2400,
    size: 1.6,          // крупность — брат выбрал на стенде глазами 08.10
    strength: 1.2,      // сила — поднята после «слабовато» (плотность + крупность)
    res: 0.5,
    speed: 1.0,
    fps: 0
  }
};
