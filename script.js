"use strict";

/* ================= Данные ================= */
const GENRES = ["Художественная", "Научная", "Фантастика", "Детективы", "Бизнес", "Учебная литература", "Психология"];
const STATUS_LABEL = { none: "Не в списке", reading: "Читаю сейчас", read: "Прочитано", planned: "В планах", postponed: "Отложено" };
const STORAGE_KEY = "e-library-v1";

// b(id, название, автор, жанр, поджанр, рейтинг, отзывы, год, страниц, цвет1, цвет2, цвет текста, описание)
function b(id, title, author, genre, tag, rating, reviews, year, pages, c1, c2, fg, desc) {
  return { id, title, author, genre, tag, rating, reviews, year, pages, c1, c2, fg, desc,
    format: pages % 2 ? "PDF, EPUB" : "EPUB, FB2", lang: "Русский", size: (1.2 + pages / 220).toFixed(1) + " МБ",
    status: "none", fav: false, progress: 0, notes: "" };
}
const SEED = [
  b(1, "Мастер и Маргарита", "М.А. Булгаков", "Художественная", "Классика", 4.8, 1240, 1967, 480, "#3b2a1a", "#a8742f", "#ffe7b0", "Роман «Мастер и Маргарита» — одно из самых известных произведений Михаила Булгакова. Это философская история о любви, добре и зле, свободе творчества и человеческом выборе."),
  b(2, "1984", "Дж. Оруэлл", "Фантастика", "Антиутопия", 4.7, 892, 1949, 320, "#1a1a1f", "#b3141c", "#ffffff", "Мрачная антиутопия о тоталитарном обществе, где за каждым следят, а история переписывается в угоду власти. История Уинстона Смита и его попытки сохранить личную свободу."),
  b(3, "Гарри Поттер и философский камень", "Дж. К. Роулинг", "Фантастика", "Фэнтези", 4.9, 2341, 1997, 400, "#12285a", "#3d79d6", "#ffe9a8", "Мальчик-сирота узнаёт, что он волшебник, и отправляется учиться в школу чародейства Хогвартс, где его ждут друзья, тайны и первое столкновение с тёмным магом."),
  b(4, "Дюна", "Ф. Герберт", "Фантастика", "Фантастика", 4.8, 1102, 1965, 704, "#6b3d12", "#e8a24c", "#fff3d6", "Эпическая сага о далёкой планете-пустыне Арракис, где добывают самый ценный ресурс во Вселенной, и о борьбе знатных домов за власть."),
  b(5, "Sapiens. Краткая история человечества", "Ю. Н. Харари", "Научная", "Научная", 4.8, 956, 2011, 512, "#efe6d2", "#d9c9a3", "#3b2f1d", "Как маленький вид обезьян стал хозяином планеты? Автор прослеживает путь человечества от каменных орудий до современных технологий."),
  b(6, "Чистый код", "Р. Мартин", "Учебная литература", "Программирование", 4.7, 674, 2008, 464, "#0d1b3f", "#2a5dc4", "#e8f0ff", "Практическое руководство о том, как писать понятный, поддерживаемый программный код, и как превращать плохой код в хороший."),
  b(7, "Психология влияния", "Р. Чалдини", "Психология", "Психология", 4.7, 721, 1984, 336, "#1b1230", "#5b3fa0", "#ffffff", "Классическая работа о механизмах убеждения: почему люди соглашаются и как распознать приёмы манипуляции в повседневной жизни."),
  b(8, "Убийство в Восточном экспрессе", "А. Кристи", "Детективы", "Детективы", 4.8, 839, 1934, 288, "#1d2a44", "#7d1f2e", "#f6e6c8", "Поезд застревает в снегах, а один из пассажиров найден мёртвым. Эркюль Пуаро должен выяснить, кто из попутчиков скрывает правду."),
  b(9, "Преступление и наказание", "Ф.М. Достоевский", "Художественная", "Классика", 4.8, 1520, 1866, 592, "#2b2b2b", "#6a6a6a", "#f1e8d8", "Психологический роман о бедном студенте Раскольникове, который решается на убийство ради «великой идеи», и о цене этого выбора."),
  b(10, "Идиот", "Ф.М. Достоевский", "Художественная", "Классика", 4.6, 640, 1869, 640, "#3a1f2b", "#a34d62", "#fde8ee", "История князя Мышкина — доброго и искреннего человека, который сталкивается с жестокостью и страстями петербургского света."),
  b(11, "Братья Карамазовы", "Ф.М. Достоевский", "Художественная", "Классика", 4.8, 980, 1880, 824, "#1f2d2a", "#4f7d6f", "#e9f5ef", "Последний роман Достоевского: семейная драма, убийство отца и спор о вере, свободе и ответственности."),
  b(12, "Собачье сердце", "М.А. Булгаков", "Художественная", "Сатира", 4.7, 870, 1925, 160, "#33261a", "#8f6a3c", "#fff1d4", "Профессор Преображенский превращает бродячего пса в человека — и получает неожиданные последствия."),
  b(13, "Белая гвардия", "М.А. Булгаков", "Художественная", "Классика", 4.6, 410, 1925, 352, "#1c2437", "#53648f", "#eef2ff", "Роман о семье Турбиных в Киеве времён Гражданской войны, о долге, чести и надежде на дом."),
  b(14, "Ночной дозор", "С.В. Лукьяненко", "Фантастика", "Фэнтези", 4.5, 760, 1998, 448, "#0b1020", "#2b3f8c", "#d8e2ff", "Современная Москва, где рядом с людьми живут Иные — светлые и тёмные. Между ними — хрупкое перемирие и Дозоры."),
  b(15, "Лабиринт отражений", "С.В. Лукьяненко", "Фантастика", "Киберпанк", 4.5, 520, 1997, 416, "#0d2a2a", "#1d8a8a", "#d6fff7", "Погружение в виртуальную сеть будущего, где опасность настоящая, а выйти из игры не так просто."),
  b(16, "Сияние", "С. Кинг", "Фантастика", "Хоррор", 4.7, 1130, 1977, 512, "#102030", "#5a8fb8", "#ffffff", "Зимний сторож остаётся с семьёй в пустом отеле, а древнее зло шаг за шагом подчиняет его себе."),
  b(17, "Зелёная миля", "С. Кинг", "Художественная", "Драма", 4.8, 1040, 1996, 416, "#18321f", "#46a05a", "#ecfff0", "Тюремная драма о надзирателе блока смертников и необыкновенном заключённом, которому не место за решёткой."),
  b(18, "Азазель", "Б. Акунин", "Детективы", "Историческая проза", 4.6, 930, 1998, 352, "#2a1230", "#8a3a6a", "#ffe9f6", "Первое дело Эраста Фандорина: загадочное самоубийство в парке ведёт к международному заговору."),
  b(19, "Турецкий гамбит", "Б. Акунин", "Детективы", "Историческая проза", 4.6, 710, 1998, 352, "#3a1a12", "#b0583a", "#ffeadf", "Русско-турецкая война и шпионская интрига: Фандорин ищет предателя в штабе русской армии."),
  b(20, "Краткая история времени", "С. Хокинг", "Научная", "Физика", 4.7, 590, 1988, 256, "#05091f", "#2a2f7a", "#d8dcff", "От Большого взрыва до чёрных дыр: понятный рассказ о том, как устроена Вселенная."),
  b(21, "Богатый папа, бедный папа", "Р. Кийосаки", "Бизнес", "Финансы", 4.4, 1320, 1997, 336, "#3a2f06", "#d9b22b", "#fffbe0", "Две модели отношения к деньгам и основы финансовой грамотности в историях из жизни автора."),
  b(22, "От хорошего к великому", "Дж. Коллинз", "Бизнес", "Менеджмент", 4.6, 480, 2001, 400, "#132a18", "#3f8a4f", "#e9ffee", "Исследование того, что отличает компании, совершившие прорыв, от остальных."),
  b(23, "Бизнес с нуля", "Э. Рис", "Бизнес", "Стартапы", 4.6, 605, 2011, 304, "#2c0f0f", "#c04040", "#fff0f0", "Метод «бережливого стартапа»: как быстро проверять идеи и строить продукт, нужный людям."),
  b(24, "Грокаем алгоритмы", "А. Бхаргава", "Учебная литература", "Программирование", 4.7, 520, 2016, 288, "#0f2a40", "#2a8ccf", "#ffffff", "Иллюстрированное введение в алгоритмы для тех, кто хочет понять основы без тяжёлой математики."),
  b(25, "Думай медленно… решай быстро", "Д. Канеман", "Психология", "Психология", 4.7, 880, 2011, 624, "#2a1c0a", "#b57a2a", "#fff3dd", "Нобелевский лауреат объясняет, как работают два режима мышления и почему мы совершаем одни и те же ошибки."),
  b(26, "Атомные привычки", "Дж. Клир", "Психология", "Саморазвитие", 4.8, 1410, 2018, 320, "#e8e3d6", "#c8bfa5", "#2e2a20", "Небольшие изменения, которые приводят к большим результатам: как строить хорошие привычки и избавляться от плохих.")
];

const REVIEW_POOL = [
  ["Анна К.", 5, "Перечитываю не в первый раз — каждый раз нахожу что-то новое."],
  ["Игорь М.", 5, "Отличное издание, удобно читать с телефона."],
  ["Мария С.", 4, "Сильное начало, финал немного затянут, но в целом очень достойно."],
  ["Дмитрий П.", 5, "Рекомендую всем, кто ещё не знаком с этой книгой."],
  ["Елена В.", 4, "Хорошая книга, оставила много мыслей."]
];

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(raw) && raw.length) return raw;
  } catch (e) {}
  return JSON.parse(JSON.stringify(SEED));
}
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch (e) {} }

let books = load();
const state = {
  genres: new Set(), authors: new Set(), status: "all", search: "", authorQ: "",
  sort: "popular", view: "grid", nav: "home", selectedId: books[0] ? books[0].id : null,
  dTab: "desc", genreAll: false, authorAll: false, editId: null
};

/* ================= Утилиты ================= */
const $ = id => document.getElementById(id);
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
const nf = new Intl.NumberFormat("ru-RU");
function plural(n, one, few, many) { const a = n % 100, r = n % 10; if (a > 10 && a < 20) return many; if (r === 1) return one; if (r >= 2 && r <= 4) return few; return many; }
let toastTimer;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400); }
const NAV_ICONS = { home: "home", catalog: "library", mine: "bookmark", fav: "heart", reading: "clock", read: "check-circle", collections: "grid", settings: "settings" };
const NAV = [
  ["home", "Главная", "Электронная библиотека", "Открывай новые книги. Читай. Развивайся. Сохраняй любимое."],
  ["catalog", "Каталог", "Каталог", "Все книги библиотеки в одном месте."],
  ["mine", "Мои книги", "Мои книги", "Книги, которые ты читаешь, прочитал или запланировал."],
  ["fav", "Избранное", "Избранное", "Книги, которые ты отметил сердечком."],
  ["reading", "Читаю сейчас", "Читаю сейчас", "Продолжай с того места, где остановился."],
  ["read", "Прочитанные", "Прочитанные", "Твоя личная полка завершённых книг."],
  ["collections", "Библиотечные подборки", "Библиотечные подборки", "Книги с самым высоким рейтингом — от 4.8."],
  ["settings", "Настройки", "Настройки", ""]
];
const NAV_STATUS = { home: "all", catalog: "all", mine: "mine", fav: "fav", reading: "reading", read: "read", collections: "top" };
const STATUS_FILTERS = [["all", "Все книги"], ["reading", "Читаю сейчас"], ["read", "Прочитанные"], ["fav", "В избранном"], ["planned", "Планирую прочитать"]];

/* ================= Обложка ================= */
function cover(book) {
  const d = el("div", "cover");
  const src = COVER_IMAGES[book.id] || book.img;
  const art = () => { d.innerHTML = coverSVG(book); };
  if (src) {
    const img = document.createElement("img");
    img.alt = book.title; img.loading = "lazy"; img.src = src;
    img.addEventListener("error", art);
    d.appendChild(img);
  } else art();
  return d;
}
function pseudoBook(title, author) {
  const h = [...(title + author)].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) % 360, 7);
  return { title: title || "Название книги", author: author || "Автор", c1: `hsl(${h},45%,22%)`, c2: `hsl(${(h + 40) % 360},55%,46%)`, fg: "#fff" };
}

/* ================= Фильтрация ================= */
function isFiltered() {
  return state.genres.size || state.authors.size || state.search || state.status !== "all";
}
function matchStatus(bk) {
  switch (state.status) {
    case "mine": return bk.status !== "none";
    case "fav": return bk.fav;
    case "top": return bk.rating >= 4.8;
    case "all": return true;
    default: return bk.status === state.status;
  }
}
function getVisible() {
  const q = state.search.toLowerCase();
  const list = books.filter(bk => {
    if (state.genres.size && !state.genres.has(bk.genre)) return false;
    if (state.authors.size && !state.authors.has(bk.author)) return false;
    if (!matchStatus(bk)) return false;
    if (q && ![bk.title, bk.author, bk.genre, bk.tag].some(s => s.toLowerCase().includes(q))) return false;
    return true;
  });
  const s = state.sort;
  list.sort((x, y) => s === "rating" ? y.rating - x.rating || y.reviews - x.reviews :
    s === "title" ? x.title.localeCompare(y.title, "ru") :
    s === "year" ? y.year - x.year : y.reviews - x.reviews);
  return list;
}

/* ================= Рендер ================= */
function render() {
  renderNav(); renderHeader(); renderTabs(); renderFilters(); renderCards(); renderDetail();
  $("favCount").textContent = books.filter(x => x.fav).length;
  $("favBtn").classList.toggle("active", state.status === "fav");
}

function renderNav() {
  const ul = $("nav");
  ul.innerHTML = "";
  NAV.forEach(([key, label]) => {
    const li = document.createElement("li");
    const btn = el("button", "nav-item" + (state.nav === key ? " active" : ""));
    btn.innerHTML = ic(NAV_ICONS[key], 20);
    btn.append(label);
    btn.addEventListener("click", () => goNav(key));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function renderHeader() {
  const n = NAV.find(x => x[0] === state.nav) || NAV[0];
  $("pageTitle").textContent = n[2];
  $("pageSub").textContent = n[3];
}

function renderTabs() {
  const box = $("tabs");
  box.innerHTML = "";
  const mk = (label, active, fn) => {
    const t = el("button", "tab" + (active ? " active" : ""), label);
    t.setAttribute("role", "tab"); t.setAttribute("aria-selected", active);
    t.addEventListener("click", fn); box.appendChild(t);
  };
  mk(`Все книги (${nf.format(books.length)})`, state.genres.size === 0, () => { state.genres = new Set(); render(); });
  GENRES.forEach(g => {
    const n = books.filter(x => x.genre === g).length;
    mk(g, state.genres.size === 1 && state.genres.has(g), () => { state.genres = new Set([g]); render(); });
  });
}

function checkRow(label, count, checked, type, onChange) {
  const l = el("label", "check");
  const i = document.createElement("input");
  i.type = type; i.checked = checked; i.addEventListener("change", onChange);
  l.append(i, el("span", "", label));
  if (count !== null) l.append(el("span", "n", `(${count})`));
  return l;
}

function renderFilters() {
  // Жанры
  const gBox = $("genreChecks"); gBox.innerHTML = "";
  const gList = state.genreAll ? GENRES : GENRES.slice(0, 5);
  gList.forEach(g => {
    const n = books.filter(x => x.genre === g).length;
    gBox.appendChild(checkRow(g, n, state.genres.has(g), "checkbox", ev => {
      ev.target.checked ? state.genres.add(g) : state.genres.delete(g); render();
    }));
  });
  $("genreMore").innerHTML = state.genreAll ? "Свернуть " + ic("chevron-up", 14) : "Показать ещё " + ic("chevron-down", 14);
  $("genreMore").hidden = GENRES.length <= 5;

  // Авторы
  const counts = {};
  books.forEach(x => counts[x.author] = (counts[x.author] || 0) + 1);
  let authors = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, "ru"));
  const q = state.authorQ.toLowerCase();
  if (q) authors = authors.filter(a => a.toLowerCase().includes(q));
  const showAll = state.authorAll || q;
  const aBox = $("authorChecks"); aBox.innerHTML = "";
  (showAll ? authors : authors.slice(0, 5)).forEach(a => {
    aBox.appendChild(checkRow(a, counts[a], state.authors.has(a), "checkbox", ev => {
      ev.target.checked ? state.authors.add(a) : state.authors.delete(a); render();
    }));
  });
  if (!authors.length) aBox.appendChild(el("span", "n", "Авторы не найдены"));
  $("authorMore").innerHTML = state.authorAll ? "Свернуть " + ic("chevron-up", 14) : "Показать ещё " + ic("chevron-down", 14);
  $("authorMore").hidden = !!q || authors.length <= 5;

  // Статус
  const sBox = $("statusChecks"); sBox.innerHTML = "";
  STATUS_FILTERS.forEach(([key, label]) => {
    sBox.appendChild(checkRow(label, null, state.status === key, "checkbox", () => {
      state.status = (state.status === key) ? "all" : key;
      state.nav = Object.keys(NAV_STATUS).find(k => NAV_STATUS[k] === state.status && k !== "catalog") || "home";
      render();
    }));
  });
}

function statusButton(bk) {
  const html = { none: ic("book-open", 15) + " Читать", reading: ic("check", 15) + " Читаю", read: ic("check-circle", 15) + " Прочитано",
    planned: ic("bookmark", 15) + " В планах", postponed: ic("clock", 15) + " Отложено" }[bk.status];
  const btn = el("button", "read-btn " + bk.status);
  btn.innerHTML = html;
  btn.addEventListener("click", ev => {
    ev.stopPropagation();
    if (bk.status === "none") { bk.status = "reading"; save(); render(); toast(`«${bk.title}» добавлена в «Читаю сейчас»`); }
    else openStatus(bk.id);
  });
  return btn;
}

function renderCards() {
  const vis = getVisible();
  const ul = $("cards");
  ul.className = "cards " + state.view;
  ul.innerHTML = "";

  vis.forEach(bk => {
    const li = el("li", "card" + (bk.id === state.selectedId ? " selected" : ""));
    li.tabIndex = 0;
    const select = () => { state.selectedId = bk.id; state.dTab = "desc"; render(); $("detail").classList.add("open"); };
    li.addEventListener("click", select);
    li.addEventListener("keydown", ev => { if (ev.key === "Enter") select(); });

    const art = el("div", "card-art"); art.appendChild(cover(bk));
    const heart = el("button", "heart" + (bk.fav ? " on" : ""));
    heart.innerHTML = ic("heart", 16);
    heart.setAttribute("aria-label", bk.fav ? "Убрать из избранного" : "В избранное");
    heart.addEventListener("click", ev => { ev.stopPropagation(); toggleFav(bk.id); });

    const body = el("div", "card-body");
    const rating = el("div", "rating");
    rating.innerHTML = '<span class="star">' + ic("star", 13) + '</span>';
    rating.append(el("b", "", bk.rating ? String(bk.rating) : "—"), bk.reviews ? `(${nf.format(bk.reviews)})` : "");
    body.append(el("div", "card-title", bk.title), el("div", "card-author", bk.author), el("span", "tag", bk.tag), rating, statusButton(bk));

    if (state.view === "list") li.append(art, body, heart);
    else li.append(art, heart, body);
    ul.appendChild(li);
  });

  $("found").textContent = `Найдено ${nf.format(vis.length)} ${plural(vis.length, "книга", "книги", "книг")}`;

  const empty = $("empty");
  empty.hidden = vis.length > 0;
  empty.innerHTML = "";
  if (!vis.length) {
    empty.append(el("p", "", books.length ? "По выбранным условиям книг не найдено. Измените запрос или сбросьте фильтры." : "В библиотеке пока нет книг. Добавьте первую."));
    const bt = el("button", "btn btn-secondary", "Сбросить фильтры");
    bt.addEventListener("click", resetAll);
    empty.appendChild(bt);
  }
}

function renderDetail() {
  const box = $("detail");
  box.innerHTML = "";
  const bk = books.find(x => x.id === state.selectedId);
  if (!bk) { box.append(el("div", "detail-placeholder", "Выберите книгу в списке, чтобы увидеть подробности.")); return; }

  const top = el("div", "detail-top");
  const cw = el("div", "cover-wrap"); cw.appendChild(cover(bk));
  const info = el("div", "d-info");
  const rating = el("div", "rating"); rating.innerHTML = '<span class="star">' + ic("star", 13) + '</span>';
  rating.append(el("b", "", bk.rating ? String(bk.rating) : "—"), bk.reviews ? `(${nf.format(bk.reviews)} ${plural(bk.reviews, "отзыв", "отзыва", "отзывов")})` : "(нет отзывов)");
  const tags = el("div", "d-tags"); tags.append(el("span", "tag", bk.genre), el("span", "tag", bk.tag));
  const props = el("div", "props");
  [["calendar", "Год издания:", bk.year], ["files", "Страниц:", bk.pages], ["file", "Формат:", bk.format], ["globe", "Язык:", bk.lang], ["hard-drive", "Размер:", bk.size]]
    .forEach(([icon, k, v]) => { const lab = el("span", "prop-k"); lab.innerHTML = ic(icon, 14) + " " + k; props.append(lab, el("span", "", String(v))); });
  info.append(el("h2", "", bk.title), el("div", "d-author", bk.author), rating, tags, props);
  const close = el("button", "close-x"); close.innerHTML = ic("x", 18);
  close.setAttribute("aria-label", "Закрыть");
  close.addEventListener("click", () => { $("detail").classList.remove("open"); if (window.innerWidth > 1200) { state.selectedId = null; render(); } });
  top.append(cw, info, close);

  const actions = el("div", "d-actions");
  const readBtn = el("button", "btn btn-primary"); readBtn.innerHTML = ic("book-open", 17) + " " + (bk.status === "reading" ? "Продолжить чтение" : "Читать онлайн");
  readBtn.addEventListener("click", () => {
    if (bk.status !== "reading") { bk.status = "reading"; save(); render(); toast(`«${bk.title}» добавлена в «Читаю сейчас»`); }
    else toast(`Продолжаем с ${bk.progress}%`);
  });
  const favBtn = el("button", "btn btn-secondary fav-btn" + (bk.fav ? " on" : "")); favBtn.innerHTML = ic("heart", 17) + " " + (bk.fav ? "В избранном" : "Добавить в избранное");
  favBtn.addEventListener("click", () => toggleFav(bk.id));
  const split = el("div", "split");
  const planBtn = el("button", "btn btn-secondary"); planBtn.innerHTML = ic("bookmark", 17) + " " + (bk.status === "planned" ? "В планах" : bk.status === "none" ? "В планы" : STATUS_LABEL[bk.status]);
  planBtn.addEventListener("click", () => {
    if (bk.status === "none") { bk.status = "planned"; save(); render(); toast("Добавлено в планы"); }
    else if (bk.status === "planned") { bk.status = "none"; save(); render(); toast("Убрано из планов"); }
    else openStatus(bk.id);
  });
  const chev = el("button", "btn btn-secondary"); chev.innerHTML = ic("chevron-down", 18);
  chev.setAttribute("aria-label", "Изменить статус");
  chev.addEventListener("click", () => openStatus(bk.id));
  split.append(planBtn, chev);
  actions.append(readBtn, favBtn, split);

  let pr = null;
  if (bk.status === "reading" || bk.progress > 0) {
    pr = el("div", "d-text");
    pr.append(`Прогресс: ${bk.progress}%`);
    const line = el("div", "progress-line"); const i = document.createElement("i"); i.style.width = bk.progress + "%"; line.appendChild(i);
    pr.appendChild(line);
  }

  const tabs = el("div", "d-tabs");
  [["desc", "Описание"], ["toc", "Содержание"], ["rev", `Отзывы (${nf.format(bk.reviews)})`]].forEach(([k, l]) => {
    const t = el("button", "d-tab" + (state.dTab === k ? " active" : ""), l);
    t.addEventListener("click", () => { state.dTab = k; renderDetail(); });
    tabs.appendChild(t);
  });

  const content = el("div", "d-text");
  if (state.dTab === "desc") {
    content.textContent = bk.desc || "Описание отсутствует.";
    if (bk.notes) { const n = el("p", "", "Мои заметки: " + bk.notes); content.appendChild(n); }
  } else if (state.dTab === "toc") {
    const ol = el("ol", "toc");
    const n = Math.max(4, Math.min(12, Math.round(bk.pages / 40)));
    for (let i = 1; i <= n; i++) ol.appendChild(el("li", "", i === 1 ? "Введение" : `Глава ${i - 1}`));
    content.appendChild(ol);
  } else {
    if (!bk.reviews) content.textContent = "Отзывов пока нет.";
    for (let i = 0; i < 3; i++) {
      const [name, st, text] = REVIEW_POOL[(bk.id + i) % REVIEW_POOL.length];
      const r = el("div", "review");
      const h = el("b", "", name); const s = el("span", "star", " " + "★".repeat(st)); h.appendChild(s);
      r.append(h, text);
      if (bk.reviews) content.appendChild(r);
    }
  }
  box.append(top);
  if (pr) box.append(pr);
  box.append(actions, tabs, content);
}

/* ================= Действия ================= */
function toggleFav(id) {
  const bk = books.find(x => x.id === id);
  if (!bk) return;
  bk.fav = !bk.fav; save(); render();
  toast(bk.fav ? "Добавлено в избранное" : "Убрано из избранного");
}
function resetAll() {
  state.genres = new Set(); state.authors = new Set(); state.status = "all"; state.search = ""; state.authorQ = ""; state.nav = "home";
  $("search").value = ""; $("authorSearch").value = "";
  render();
}
function goNav(key) {
  closeSidebar();
  if (key === "settings") {
    if (confirm("Вернуть исходный список книг? Ваши статусы, избранное и добавленные книги будут сброшены.")) {
      books = JSON.parse(JSON.stringify(SEED)); state.selectedId = books[0].id; save(); resetAll(); toast("Данные сброшены");
    }
    return;
  }
  state.nav = key; state.status = NAV_STATUS[key]; state.genres = new Set(); state.authors = new Set();
  render();
}

/* ================= Окно: добавить книгу ================= */
const addDialog = $("addDialog");
GENRES.forEach(g => { const o = document.createElement("option"); o.value = g; o.textContent = g; $("aGenre").appendChild(o); });
for (let y = new Date().getFullYear(); y >= 1800; y--) { const o = document.createElement("option"); o.value = y; o.textContent = y; $("aYear").appendChild(o); }

function setErr(input, msg) { input.closest(".field").classList.toggle("invalid", !!msg); $(input.id + "Error").textContent = msg; }
function refreshAddCover() { const c = $("addCover"); c.innerHTML = ""; c.appendChild(cover(pseudoBook($("aTitle").value.trim(), $("aAuthor").value.trim()))); }
["aTitle", "aAuthor"].forEach(id => $(id).addEventListener("input", refreshAddCover));

$("addBtn").addEventListener("click", () => {
  $("addForm").reset();
  ["aTitle", "aAuthor", "aGenre"].forEach(id => setErr($(id), ""));
  $("aYear").value = String(new Date().getFullYear());
  refreshAddCover();
  addDialog.showModal();
  $("aTitle").focus();
});
$("addForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const title = $("aTitle").value.trim(), author = $("aAuthor").value.trim(), genre = $("aGenre").value;
  setErr($("aTitle"), title ? "" : "Введите название книги.");
  setErr($("aAuthor"), author ? "" : "Укажите автора.");
  setErr($("aGenre"), genre ? "" : "Выберите жанр.");
  if (!title || !author || !genre) return;
  const pb = pseudoBook(title, author);
  const id = books.reduce((m, x) => Math.max(m, x.id), 0) + 1;
  const fmt = document.querySelector('input[name="aFormat"]:checked').value;
  books.unshift({ id, title, author, genre, tag: genre, rating: 0, reviews: 0, year: +$("aYear").value, pages: 250, c1: pb.c1, c2: pb.c2, fg: "#fff",
    desc: $("aDesc").value.trim(), format: fmt, lang: "Русский", size: "—", status: "none", fav: false, progress: 0, notes: "" });
  save(); state.selectedId = id; state.dTab = "desc";
  resetAll(); addDialog.close(); toast(`Книга «${title}» добавлена`);
});

/* ================= Окно: статус ================= */
const statusDialog = $("statusDialog");
const ST_OPTIONS = [["reading", "Читаю сейчас"], ["read", "Прочитано"], ["planned", "В планах"], ["postponed", "Отложено"]];

function openStatus(id) {
  const bk = books.find(x => x.id === id);
  if (!bk) return;
  state.editId = id;
  const c = $("stCover"); c.innerHTML = ""; c.appendChild(cover(bk));
  $("stTitle").textContent = bk.title; $("stAuthor").textContent = bk.author;
  const cur = $("stCurrent"); cur.textContent = STATUS_LABEL[bk.status]; cur.className = "status-badge" + (bk.status === "none" ? " neutral" : "");
  const box = $("stRadios"); box.innerHTML = "";
  ST_OPTIONS.forEach(([v, l]) => {
    const lab = el("label"); const i = document.createElement("input");
    i.type = "radio"; i.name = "stNew"; i.value = v; i.checked = (bk.status === v) || (bk.status === "none" && v === "reading");
    lab.append(i, l); box.appendChild(lab);
  });
  $("stRange").value = bk.progress; $("stPage").max = bk.pages; $("stPage").value = Math.round(bk.progress / 100 * bk.pages);
  $("stPercent").textContent = bk.progress + "%"; $("stOf").textContent = `из ${bk.pages} страниц`;
  $("stNotes").value = bk.notes || "";
  statusDialog.showModal();
}
$("stRange").addEventListener("input", () => {
  const bk = books.find(x => x.id === state.editId); if (!bk) return;
  const p = +$("stRange").value; $("stPercent").textContent = p + "%"; $("stPage").value = Math.round(p / 100 * bk.pages);
});
$("stPage").addEventListener("input", () => {
  const bk = books.find(x => x.id === state.editId); if (!bk) return;
  let pg = Math.max(0, Math.min(bk.pages, +$("stPage").value || 0));
  const p = Math.round(pg / bk.pages * 100); $("stRange").value = p; $("stPercent").textContent = p + "%";
});
$("statusForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const bk = books.find(x => x.id === state.editId); if (!bk) return;
  const st = document.querySelector('input[name="stNew"]:checked').value;
  bk.status = st; bk.progress = st === "read" ? 100 : +$("stRange").value; bk.notes = $("stNotes").value.trim();
  save(); statusDialog.close(); render(); toast("Статус сохранён");
});

/* Закрытие окон */
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => $(b.dataset.close).close()));
[addDialog, statusDialog].forEach(d => d.addEventListener("click", ev => { if (ev.target === d) d.close(); }));

/* ================= События страницы ================= */
$("search").addEventListener("input", ev => { state.search = ev.target.value.trim(); render(); });
$("authorSearch").addEventListener("input", ev => { state.authorQ = ev.target.value.trim(); renderFilters(); });
$("sort").addEventListener("change", ev => { state.sort = ev.target.value; render(); });
function setView(v) { state.view = v; $("gridBtn").classList.toggle("active", v === "grid"); $("listBtn").classList.toggle("active", v === "list"); render(); }
$("gridBtn").addEventListener("click", () => setView("grid"));
$("listBtn").addEventListener("click", () => setView("list"));
$("resetBtn").addEventListener("click", resetAll);
$("genreMore").addEventListener("click", () => { state.genreAll = !state.genreAll; renderFilters(); });
$("authorMore").addEventListener("click", () => { state.authorAll = !state.authorAll; renderFilters(); });
$("favBtn").addEventListener("click", () => goNav(state.status === "fav" ? "home" : "fav"));
$("filtersToggle").addEventListener("click", () => $("filters").classList.toggle("open"));
function closeSidebar() { $("sidebar").classList.remove("open"); $("backdrop").classList.remove("show"); }
$("burger").addEventListener("click", () => { $("sidebar").classList.add("open"); $("backdrop").classList.add("show"); });
$("backdrop").addEventListener("click", closeSidebar);

document.querySelectorAll("[data-ic]").forEach(n => { n.innerHTML = ic(n.dataset.ic, +n.dataset.size || 18); });
render();
