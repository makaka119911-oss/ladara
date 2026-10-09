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
    title: 'Приложения, сайты, \nботы',
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
      urlLabel: 'Открыть приложение',
      /* Схема «как это устроено» — отдельная страница (собрана инструментом archify по этому же
         репозиторию). В зале появляется кнопка, схема открывается слоем поверх и грузится
         только по нажатию: файл ~750 КБ, в разворот его тянуть нельзя. */
      scheme: 'schemes/zhenskiy-mir.html'
    },

    /* Зал IV — не работа, а приглашение: вместо картины пустая рама того же багета, а в табличке
       под ней — что здесь может висеть. Так экспозиция кончается не тупиком, а свободным местом.
       Числа и название в перечне работ на обложке появляются сами (см. script.js). */
    {
      num: '04', hall: 'IV',
      title: 'Ваш проект',
      line: 'Сайт, приложение или бот. Эта рама пока пустая — в неё встанет ваша работа.',
      accent: '#7a5a2e',
      art: null, shot: null, invite: true,    // приглашение: пустая рама вместо картины
      facts: {
        what: 'сайт, приложение, бот — то, что нужно вам',
        made: 'вручную, от идеи до живого адреса',
        state: 'место свободно'
      },
      url: 'https://t.me/LADAR888',
      urlLabel: 'Обсудить проект'
    }

    /* Новый зал добавляется так же — и всё: разметку и стили трогать не нужно.
    ,{
      num: '05', hall: 'V',
      title: 'Название',
      line: 'Одна строка, что это и для кого.',
      accent: '#7a5a2e',
      art: null, shot: null, stub: true,      // заглушка: без картинки
      facts: { what: '…', made: '…', state: '…' },
      url: ''
    }
    */
  ],

  /* --- ENGLISH ------------------------------------------------------------------
     Всё, что переводится, лежит здесь: словарь интерфейса (ui) и тексты тех же разделов.
     Русский остаётся основным: если языка нет или в переводе чего-то не хватает, показываем
     русское. Массивы (works, posters.items, leaflet) сливаются ПО ПОРЯДКУ — порядок в обоих
     языках должен совпадать. Картинки, адреса, ссылки и числа здесь не повторяются — они общие. */
  en: {
    ui: {
      brand: 'studio',
      cap: 'Exhibition',            /* ЭКСПОЗИЦИЯ на обложке */
      hall: 'Hall',                 /* «Зал» в счётчике и табличках */
      of: 'of',                     /* «из 4» */
      cover: 'Cover',
      about: 'About',
      end: 'Colophon',
      planLabel: 'Halls',
      planAria: 'Plan of the halls',
      factsWhat: 'What it is',
      factsMade: 'Made with',
      factsState: 'State',
      zoom: 'Take a closer look',
      emptyPlate: 'your work will hang here',
      stub: 'exhibit in preparation',
      open: 'Open',
      scheme: 'How it is built',
      schemeCcap: 'how it is built',
      schemeTab: 'Open in a new tab',
      flipBack: 'Reverse side',
      flipFront: 'Front side',
      hintCoarse: 'Tap to zoom · two fingers to move · tap again to reset',
      hintFine: 'Click to zoom · wheel to move · Esc to close',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      noscript: 'Exhibits: Seven Crafts · Sexology and Psychology · Women’s World · Your project',
      title: 'LADARA — websites, apps and bots',
      description: 'I build websites, apps and chat bots myself, without site builders. The works can be examined up close — like in a museum.'
    },
    hero: {
      kicker: 'Selected work',
      title: 'Apps, websites, \nbots',
      offer: 'I build digital things: websites, apps and bots. By hand, no site builders.',
      cta: 'Enter the gallery'
    },
    author: {
      kicker: 'The keeper',
      title: 'About the maker',
      photoAlt: 'Portrait of the maker',
      text: [
        'I build websites, apps and bots. I work with Cursor and AI agents: they take the routine, the decisions stay with me.',
        'I hand-code everything, without site builders — the code stays under control. What matters to me is that it works quietly, precisely and lasts.'
      ]
    },
    outro: {
      kicker: 'End of the exhibition',
      title: 'Need something like this?',
      text: 'Tell me the task — I will build it the same way: from an idea to a live address. A website, an app, a bot, a landing page for a launch.',
      note: 'The exhibits are live: the links on the labels lead to real projects.'
    },
    posters: {
      kicker: 'Print room',
      title: 'Posters',
      lead: 'Posters for events — retreats, meditations, women’s circles. Composition and light come from an AI generator; the type is always set in real fonts.',
      items: [
        { title: 'Time to slow down',            note: 'meditation in a castle · 11 October 2026' },
        { title: 'Find yourself within',         note: 'retreat · 17 October 2026 · Nemchinovka' },
        { title: 'Castle Barbecue',              note: 'queens’ evening · 25 October' },
        { title: 'Opening to trust',             note: 'castle in Nemchinovka · 31 October 2026' },
        { title: 'Diving into sensuality',       note: 'level 2 · 31 October' },
        { title: 'Castle Barbecue',              note: 'queens’ evening · 4 October' },
        { title: 'Keys to the Enchanted Castle', note: 'three doors · 4 July 2026' },
        { title: 'Goddesses of Nikiforovka',     note: 'open photo session · July 2026' },
        { title: 'Photo session in Nikiforovka', note: 'macramé collection · July' },
        { title: 'Fire massage',                 note: 'ceremony with singing bowls · Reutov' },
        { title: 'Mystery of sensuality',        note: 'private castle · 29 March' }
      ],
      leaflet: [
        { title: 'Fire ceremony', note: 'flyer, two sides · fire massage · Reutov' },
        { title: 'Booklet',       note: 'what the treatments include · massage, oils, bowls · Reutov and Nemchinovka' }
      ]
    },
    works: [
      {
        title: 'Seven Crafts',
        line: 'A landing page for handcraft video courses: seven crafts, shown calmly and to the point.',
        facts: { what: 'a landing page for handcraft video courses', made: 'HTML, CSS, JavaScript — a static site', state: 'live' },
        urlLabel: 'Open the site'
      },
      {
        title: 'Sexology and Psychology',
        line: 'A sex-therapy site for women: areas of work, a poster of meetings, booking.',
        facts: { what: 'a sex-therapy site for women', made: 'HTML, CSS, JavaScript; content from JSON', state: 'live' },
        urlLabel: 'Open the site'
      },
      {
        title: 'Women’s World',
        line: 'An app for women: cycle, diary, circle, calls and an assistant — all in one place.',
        facts: { what: 'an app for women (PWA), closed beta', made: 'React, Node.js, PostgreSQL, Redis, Docker', state: 'live' },
        urlLabel: 'Open the app',
        scheme: 'schemes/zhenskiy-mir-en.html'
      },
      {
        title: 'Your project',
        line: 'A website, an app or a bot. This frame is empty for now — your work will hang here.',
        facts: { what: 'a website, an app, a bot — whatever you need', made: 'by hand, from an idea to a live address', state: 'space available' },
        urlLabel: 'Discuss a project'
      }
    ]
  },

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
