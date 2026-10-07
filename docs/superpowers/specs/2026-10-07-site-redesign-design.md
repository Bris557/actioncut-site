# actioncut.io — редизайн сайта в стиле приложения

**Дата:** 2026-10-07
**Статус:** дизайн согласован в обсуждении по частям (направление, структура, части 1–4); ждёт ревью письменной спецификации.
**Источники истины:**
- Android-приложение `/Volumes/devssd/dev/actioncut-app` (снимок `9d81ae3`): поведение, тексты интерфейса, числа. Код важнее `SPEC.md`: тот устарел (сессии, склейка в один ролик, `DCIM/ActionCutClips`).
- Дизайн приложения: `actioncut-app/docs/superpowers/specs/2026-10-03-m3-expressive-redesign-design.md`, `2026-10-04-tags-design.md`, макеты-артборды в артефакте «ActionCut Redesign» (https://claude.ai/artifact/BHBTSeLbNYfbdXo4iYNACX).
- iOS-версия: `/Volumes/devssd/dev/actioncut-ios`, спецификация `docs/superpowers/specs/2026-10-06-actioncut-ios-design.md`.
- Визуальное направление и схема главной: макеты визуального компаньона в `.superpowers/brainstorm/` (`visual-direction.html`, вариант B; `landing-structure.html`).

## 1. Цель

Заменить шаблонный Docusaurus-сайт (тёмный, голубой, Poppins, заглушки вместо картинок, выдуманный changelog за 2024 год, обещание склейки в один ролик) на современный, динамичный сайт actioncut.io в дизайне последней версии Android-приложения. Сайт подробно объясняет сценарии использования и выгоды и ведёт к скачиванию.

**Аудитория:** родители, которые снимают игры и тренировки детей; также тренеры и любительские команды. Язык сайта — **только английский** (интерфейс приложения тоже английский).

**Успех:** человек за минуту понимает механику («снимаешь своей камерой, жмёшь кнопку, получаешь клипы»), видит свой сценарий, доверяет (честно о приватности), скачивает APK. Сайт выглядит как продолжение приложения, а не как шаблон.

## 2. Решения

| # | Решение |
|---|---|
| D1 | Остаёмся на **Docusaurus 3.8.1** (вариант A). Лендинг — своя React-страница; Guide — docs-плагин; анимации — библиотека **`motion`** + CSS. |
| D2 | Визуальное направление **B · Matchday**: светлая тема приложения, тёплый кремовый фон, крупные формы M3 Expressive, пружинящая анимация. Ритм за счёт чередования фонов секций (кремовый / белый / оранжевый / голубой / тёмно-коричневый). |
| D3 | Только светлая тема: `colorMode.defaultMode: 'light'`, `disableSwitch: true`, `respectPrefersColorScheme: false`. |
| D4 | Только английский язык, без i18n. |
| D5 | Домен **https://actioncut.io**, `baseUrl: '/'`. Способ хостинга выбирается позже; деплой не входит в эту работу. |
| D6 | Android: основная кнопка — **APK с сайта** (`/actioncut-latest.apk`), рядом неактивный бейдж **«Google Play — coming soon»**. |
| D7 | iOS: секция и бейдж **«App Store — coming soon»**, без сбора контактов. |
| D8 | Приложение **бесплатное** — «Free» на CTA и в выгодах. Тизер будущих платных функций без цен и сроков: облачное хранение клипов, карточка спортсмена. |
| D9 | Страницы: главная, Guide (11 статей), Changelog, Privacy Policy. Шаблонные blog/docs и дубликат `/actioncut` удаляются. |
| D10 | Статьи Guide лежат в **`guide/`** (`docs.path: 'guide'`, `routeBasePath: 'guide'`), чтобы внутренние документы в `docs/superpowers/` не публиковались. |
| D11 | Макеты экранов приложения в hero и демо — **HTML/CSS-реконструкции** артбордов «ActionCut Redesign» (чёткие, анимируемые). **Реальные скриншоты** пользователя — в Guide и вкладках сценариев; до их появления — заглушки того же размера. |
| D12 | Контактный email и издатель — одна константа в `src/data/site.ts`; пока не заданы пользователем — **открытый вопрос**, сайт не публикуется с заглушкой. |
| D13 | Тексты обещают только то, что есть в коде приложения (раздел 9). Нет склейки в один ролик, нет «zero data collection». |

## 3. Визуальная основа

### 3.1 Цвета (CSS-переменные в `:root`, `src/css/custom.css`)

Токены светлой схемы приложения (Fidelity от `#FF7A1A`):

| Токен | Значение | Применение |
|---|---|---|
| `--ac-orange` | `#FF7A1A` | заливки CTA, бейджи, оранжевые секции, кнопка-прицел |
| `--ac-on-orange` | `#5E2700` | текст на оранжевом |
| `--ac-primary` | `#9C4500` | ссылки и акцентный текст на светлом (6.4:1) |
| `--ac-surface` | `#FFF8F6` | фон страницы |
| `--ac-cream` | `#FFF1EB` | кремовые секции (screen) |
| `--ac-item` | `#FFFFFF` | карточки, белые секции |
| `--ac-container-high` | `#FBE3D8` | тонкие заливки, hover |
| `--ac-ink` / `--ac-ink-2` | `#251912` / `#584236` | основной / вторичный текст |
| `--ac-outline` / `--ac-outline-variant` | `#8C7264` / `#E0C0B1` | рамки, разделители |
| `--ac-secondary-container` / `--ac-on-secondary-container` | `#FEAB7C` / `#783D17` | номера шагов, тональные кнопки |
| `--ac-blue` / `--ac-on-blue` | `#00AAF2` / `#003B57` | голубая секция, Interval |
| `--ac-brown` / `--ac-on-brown` | `#3B2D26` / `#FFEDE5` | iPhone-секция, live-плашки |
| `--ac-live` | `#FF5A4F` | точка LIVE |
| `--ac-info` / `--ac-on-info` | `#DDEFFA` / `#004C6E` | подсказки в Guide |
| `--ac-favorite` | `#D93A3A` | сердечко |

Палитра тегов (как в приложении): Orange `#FF7A1A`, Amber `#F2A100`, Red `#E5484D`, Pink `#E5489A`, Purple `#8E4EC6`, Indigo `#5B5BD6`, Blue `#0090FF`, Teal `#12A594`, Green `#30A46C`, Brown `#8D5A3B`. Теги по умолчанию: Goal (orange), Save (blue), Assist (purple), Skill (teal), Funny (pink).

Infima-переменные (`--ifm-color-primary*`, `--ifm-font-family-base`, фон, navbar, ссылки) переназначаются на эти токены.

### 3.2 Шрифт

**Google Sans Flex** (переменный, Google Fonts, оси `opsz 6..144, wdth 25..151, wght 100..1000, ROND 0..100`), `display=swap`, `preconnect` к `fonts.gstatic.com`. **Onest** — только для кириллицы внутри макетов приложения (как в приложении).

| Роль | Параметры |
|---|---|
| Display (hero) | `clamp(52px, 9vw, 120px)`, wght 760, ROND 100, line-height 0.95, letter-spacing −0.02em |
| H2 секций | `clamp(36px, 5vw, 64px)`, wght 720, ROND 100 |
| H3 | 22–26px, wght 650 |
| Body | 17px / 1.55, wght 400; вторичный текст `--ac-ink-2` |
| Label | 14px, wght 600 |
| Числа (таймеры, счётчики) | `font-variant-numeric: tabular-nums` |

### 3.3 Формы

- Радиусы: 12 / 20 / 28 / 9999. Сгруппированные списки: внешние углы 20, внутренние 6, зазор 2px (правило `GroupShapes` приложения).
- Секции — скруглённые «листы» радиуса 40px с внешним отступом 12px (на телефоне радиус 28, отступ 8).
- Декоративные фигуры M3 Expressive (SVG, фирменные цвета): «печенька» (9 и 12 лепестков), пилюля, клевер, мягкая звезда. Медленно вращаются/плывут.

### 3.4 Движение

- Пружины (`motion`): быстрые пространственные, лёгкий перелёт (`stiffness ≈ 380, damping ≈ 30`); эффекты — без перелёта.
- Появление при прокрутке (`Reveal`): подъём 24px + масштаб 0.96 → 1, дети по очереди с шагом 60 мс, один раз.
- Привязанные к прокрутке: закреплённый телефон в How it works, сжатие полосы записи в Problem, оси `wdth/wght` слов в Benefits.
- Кнопки: при нажатии форма морфит из пилюли в скруглённый квадрат (pressed shape M3 Expressive).
- `prefers-reduced-motion: reduce` — все анимации и параллакс выключены, показываются конечные состояния; демо-кнопка работает, но без пульсации.

### 3.5 Иконки и логотип

Линейные SVG-иконки (стиль Lucide, как в макетах), без эмодзи. Логотип: оранжевый скруглённый квадрат с белым прицелом (глиф `ic_crosshair`) + слово «ActionCut» (Google Sans Flex 700). Тот же глиф — favicon (SVG + ICO/PNG) и картинка `og-card.png` 1200×630.

## 4. Главная страница (`src/pages/index.tsx`)

Порядок секций и фонов. Тексты — черновики, тон: короткие спортивные фразы, обращение к родителю на «you».

| # | Секция | Фон | Содержание | Движение |
|---|---|---|---|---|
| 0 | Navbar | плавающая «пилюля» | Логотип · How it works · Use cases · Features · iPhone · FAQ · Guide · кнопка **Download** | тень появляется при прокрутке |
| 1 | **Hero** | кремовый | H1 **«Tap. Tag. Done.»** Sub: «Film your kid’s game with your usual camera. Tap the floating button at every great play — ActionCut cuts the clips for you.» CTA `Download for Android · Free` + бейджи Google Play / App Store «coming soon». Строка доверия: «No account · Videos stay on your phone · Works with your camera app». Справа — телефон: видоискатель камеры (каток/поле), плавающая кнопка со счётчиком, чипы быстрых тегов | вращается «печенька», кнопка пульсирует, теги всплывают по одному, счётчик тикает, H1 пружинит по оси ширины |
| 2 | **Problem** | белый | «A 90-minute game. Five moments you’ll actually rewatch.» Пример: запись 1h 39m → 10 moments → 10 clips × 7 s | полоса записи сжимается при прокрутке, метки падают, превращаются в плитки |
| 3 | **How it works** | кремовый | 4 шага: Start an event → Film as usual → Tap at great plays (hold for a longer play) → Review, save, share. Детали: вибрация и пульс кнопки, счётчик, клипы режутся автоматически, альбом «ActionCut» | телефон закреплён, экран в нём меняется по шагам (переход shared axis) |
| 4 | **Try the button** | оранжевый | «Go on — tap it. Or hold it.» Интерактивная кнопка: тап → Instant (метка на таймлайне), удержание ≥ 0.5 s → Interval (полоса растёт до отпускания); затем на 5 s чипы Goal / Save / Assist с полосой отсчёта, тап по чипу ставит тег; ниже — «нарезанные» плитки | реакция на клик/удержание/клавиатуру |
| 5 | **Use cases** | белый | 5 вкладок, в каждой история 3–4 шага + скриншот: *Match day*; *Practice* (интервалы, разбор техники); *Tournament day* (событие на игру, Resume / Switch here); *Two phones, two angles* (Scan this phone, версии клипа); *Season highlights* (Favorites + фильтр тегов, Save all) | индикатор вкладок пружинит, контент сменяется с fade+slide |
| 6 | **Features** | кремовый | Бенто из 12 карточек разной формы: Quick tags · Clip length (Instant / Interval, 0–30 s) · Custom clip · Several angles → versions · Favorites · Smart import · Save to the ActionCut album · Share anywhere · Practice mode · Button size / opacity / color · Export & import events · Light & dark | мини-анимация в карточке при наведении/появлении |
| 7 | **What you get** | голубой | Крупные выгоды, по одной на экран: «Watch the game, not your screen.» · «Clips ready by the final whistle.» · «Your camera, your quality.» · «Nothing to upload.» · «A season you can find.» — каждая с одной строкой пояснения | оси `wdth/wght` слов меняются с прокруткой |
| 8 | **iPhone** | тёмно-коричневый | «Coming soon to iPhone.» Камера в приложении с кнопкой Mark; метки из Пункта управления, Action Button, экрана блокировки; Live Activity с таймером, Mark и Interval; «Your events move between Android and iPhone.» Бейдж App Store «coming soon» | макет iPhone с Live Activity, пульсирующий Mark |
| 9 | **Free + Coming later** | белый | «ActionCut is free.» Тизер: «Later: optional extras like cloud storage for your clips and athlete profiles.» | — |
| 10 | **Privacy + FAQ** | кремовый | Коротко: видео и клипы остаются на телефоне, аккаунт не нужен; отчёты о сбоях и статистика использования — ссылка на Privacy. FAQ ~8 вопросов (раздел 9) | аккордеон с плавным раскрытием |
| 11 | **Final CTA** + футер | оранжевый | «Ready for the next game?» + те же CTA. Футер: Guide · Changelog · Privacy · Contact · © 2026 ActionCut | фоновые прицелы медленно плывут |

Якоря: `#how-it-works`, `#use-cases`, `#features`, `#iphone`, `#faq`, `#download`. Плавная прокрутка (`scroll-behavior: smooth`, выключается при reduced motion), `scroll-margin-top` под navbar.

### 4.1 Демо-кнопка (`ButtonDemo` + `src/lib/markGesture.ts`)

Чистая логика, копирующая правила `OverlayService` / `QuickTagsPopup`:
- `pointerdown` → старт; если отпустили раньше **500 мс** → Instant в момент нажатия; иначе с 500 мс идёт Interval до `pointerup`/`pointercancel`.
- После каждой метки открывается окно быстрых тегов на **5000 мс** (полоса отсчёта); новая метка переносит окно на неё; тап по чипу переключает тег у последней метки.
- Клавиатура: `Space`/`Enter` keydown–keyup = то же, что pointer; `aria-live="polite"`: «Moment marked · Instant» / «Interval · 4 s» / «Tagged Goal».
- Таймлайн демо — 2 минуты «матча», метки ставятся по текущему времени демо; до 12 меток, дальше старые сдвигаются.

## 5. Guide (`guide/`, адрес `/guide`)

Стиль Matchday: сайдбар как сгруппированный список, admonitions (`:::tip`, `:::info`, `:::caution`) — плашки info/secondary-container, навигация «назад/вперёд» — карточки. Статьи (MDX):

1. **Getting started** — установка APK (разрешить установку из этого источника), Android 14 or newer, разрешения: Display over other apps, Photos and videos, Notifications (необязательно) — зачем каждое.
2. **Your first event** — + New event → кнопка → съёмка → Stop; live bar; Resume (в течение 24 h на Home), Switch here.
3. **The floating button** — тап / удержание, вибрация, пульс, счётчик; быстрые теги (5 s, до 5 тегов); Adjust button position (тренировочный режим); Size 32–96 dp, Opacity 20–100 %, Color; Only while the camera is in use (Experimental); Open camera when an event starts.
4. **Reviewing moments** — сетка события, значки плиток, экран момента, версии, полный экран, названия.
5. **Clip length & custom clips** — Instant 5 s + 2 s и Interval 3 s + 3 s по умолчанию, 0–30 s, перенарезка; Edit clip: Mark start / Mark end, Reset to event default.
6. **Tags & favorites** — Goal / Save / Assist / Skill / Funny; Quick access до 5; теги события; фильтры; Favorites по месяцам и событиям, Select all.
7. **Videos from another camera** — Sources, Scan this phone (оценённое время старта — отдельно), Choose a file + «When was it filmed?», метки задним числом в плеере, Adjust recording time, перепривязка вернувшихся видео, Remove from event.
8. **Saving & sharing** — Save all / Save N, альбом ActionCut (`Movies/ActionCut`), повторное сохранение перезаписывает, Share.
9. **Moving & backing up events** — Move to event, Export event data / Export all events / Import (JSON, без видео).
10. **Troubleshooting** — кнопка не появляется (разрешение), «Video not on this phone», время камеры не совпадает с часами телефона, клипы ещё готовятся.
11. **iPhone (coming soon)** — что будет по-другому.

Компонент `<Screen src? name caption />`: телефонная рамка; без `src` — заглушка «Screenshot: <name>» тех же пропорций (сборка не падает). Скриншоты кладутся в `static/img/screens/` (ширина до 1080 px, сжатые PNG/WebP).

## 6. Changelog (`src/pages/changelog.tsx`, данные `src/data/changelog.ts`)

- Выдуманные v1.1–1.2 (2024) удаляются. Записи собираются из git-истории Android-приложения: версия (`1.5.x`; схема `1.5.(коммиты − 376)`), дата, 3–6 пунктов «что нового» человеческим языком (не список коммитов). Ранние версии — по крупным вехам истории.
- Сверху карточка последней версии + Download APK + «Android 14 or newer». Ниже лента, сгруппированная по месяцам.
- Тип записи: `{version, date (ISO), title?, highlights: string[]}`; массив отсортирован по дате по убыванию (проверяется тестом).

## 7. Privacy Policy (`src/pages/privacy.mdx`)

Короткая и честная, на фактах из кода приложения (перед написанием проверить `app/build.gradle.kts`, манифест и вызовы Firebase в коде):
- На телефоне остаются видео, клипы, моменты, теги, названия; аккаунта нет; приложение не загружает видео.
- Передаётся: отчёты о сбоях (Firebase Crashlytics) и статистика использования (Firebase Analytics) — что именно, по коду.
- Android Auto Backup может копировать данные приложения в резервную копию Google пользователя.
- Разрешения и зачем.
- Видео с детьми: приложение их не публикует; пользователь сам решает, чем делиться.
- Будущие облачные функции будут описаны в этой политике до запуска.
- Контакт (константа из `site.ts`), дата обновления. Пометка в отчёте пользователю: текст стоит показать юристу.

## 8. Архитектура

```
docusaurus.config.ts   url, baseUrl, metadata/OG, stylesheets (Google Fonts), headTags (preconnect),
                       docs { path: 'guide', routeBasePath: 'guide', sidebarPath }, blog: false,
                       colorMode (D3), navbar items; themeConfig.prism удаляется (кода в Guide нет)
sidebars.ts            guideSidebar — явный порядок 11 статей
src/css/custom.css     токены, Infima-переопределения, navbar-«пилюля», стили docs
src/data/site.ts       apkUrl, version, minAndroid, contactEmail, publisher, store statuses
src/data/changelog.ts  релизы
src/data/features.ts, useCases.ts, faq.ts, benefits.ts — тексты лендинга
src/lib/markGesture.ts чистая логика демо (+ markGesture.test.ts)
src/components/brand/  Logo, CrosshairIcon, Shapes
src/components/ui/     Button, StoreBadge, TagChip, Section, Reveal
src/components/phone/  PhoneFrame, Screen, CameraOverlayMock, HomeMock, EventMock, MomentMock, IphoneLiveMock
src/components/landing/ Hero, Problem, HowItWorks, ButtonDemo, UseCases, Features, Benefits,
                       IphoneSoon, FreeLater, PrivacyFaq, FinalCta (+ *.module.css)
src/theme/Footer/      свой футер (swizzle eject)
src/pages/             index.tsx, changelog.tsx, privacy.mdx
guide/                 11 статей .mdx
static/img/            logo.svg, favicon.svg/.ico, og-card.png, screens/
```

- Navbar остаётся штатным Docusaurus (мобильное меню docs продолжает работать), превращается в «пилюлю» через CSS.
- Каждый компонент секции самодостаточен: получает данные из `src/data/*`, стили — CSS-модуль рядом.
- Компоненты с `window`/`IntersectionObserver`/`motion` scroll-хуками безопасны для SSR (Docusaurus генерирует статический HTML): код браузера — только в эффектах или под `BrowserOnly`.
- Удаляются: `blog/`, `docs/intro.md`, `docs/tutorial-*`, `src/pages/actioncut.tsx`, `src/pages/markdown-page.md`, `src/pages/index.module.css`, `src/components/HomepageFeatures/`, `static/img/undraw_*`, `docusaurus*.{png,jpg}`, `site.md`. `.superpowers/` — в `.gitignore`. CLAUDE.md: исправить путь (`my-website/` → корень репозитория), описать новую структуру.
- APK-файлы в `static/` остаются как есть (обновит пользователь); перенос в GitHub Releases — отдельная задача.
- Зависимости: `motion` (dependencies), `vitest` (devDependencies), скрипт `npm test`.

## 9. Факты для текстов (проверены по коду приложения)

| Факт | Значение | Где в приложении |
|---|---|---|
| Android | 14 or newer (minSdk 34) | `app/build.gradle.kts` |
| Версия | 1.5.x (на `9d81ae3` — 1.5.41) | `app/build.gradle.kts` |
| Видео записывает | **нет**, пользователь снимает своей камерой | `HomeOnboarding.kt` |
| Тап / удержание | тап = Instant; удержание ≥ 0.5 s = Interval | `OverlayService.kt` |
| Вибрация | 50 мс тап, 100 мс начало удержания | `OverlayService.kt` |
| Быстрые теги | 5 s, до 5 тегов, подпись до 10 символов | `QuickTagsPopup.kt` |
| Клип по умолчанию | Instant 5 s до + 2 s после; Interval 3 s + 3 s; диапазон 0–30 s | `data/entity/Session.kt` |
| Кнопка | 32–96 dp (60), прозрачность 20–100 % (45 %), цвета Orange/Blue/Gray/Custom | `utils/OverlaySettings.kt` |
| Сохранение | альбом «ActionCut» (`Movies/ActionCut`), повтор перезаписывает | `utils/GallerySaveRules.kt` |
| Склейка в один ролик | **нет** — каждый момент отдельным клипом | — |
| Аккаунт / облако | нет | — |
| Аналитика | Firebase Analytics + Crashlytics включены | `app/build.gradle.kts` |
| Resume на Home | в течение 24 h после последней активности | `EventControls.kt` |
| Интерфейс | только английский | `ui/component/Formatters.kt` |
| iOS | iOS 26+, iPhone; своя камера с Mark, Control, Live Activity; JSON совместим с Android | iOS-спецификация, D3, D12, D13, D18 |

FAQ (черновик вопросов): Does ActionCut record video? · Which phones does it work on? · Does it work with any camera app? · I forgot to start an event — can I still mark moments? (Choose a file → метки в плеере) · Can I use a second phone or camera? · Where do my clips go? · Can I change clip length after the game? · Do I need internet? (нарезка — на телефоне; формулировка без «fully offline», т. к. аналитика ходит в сеть).

## 10. Доступность и производительность

- Семантика: один `h1` на страницу, иерархия заголовков, `<button>`/`<a>` вместо div; видимый фокус (кольцо `--ac-primary` 3px).
- Контраст ≥ 4.5:1 для текста (токены приложения уже проверены его тестами); текст на оранжевом — `--ac-on-orange`, на голубом — `--ac-on-blue`.
- Вкладки сценариев — паттерн WAI-ARIA Tabs (стрелки, `aria-selected`); FAQ — `<details>/<summary>` или кнопки с `aria-expanded`.
- `prefers-reduced-motion` (3.4).
- Картинки: `loading="lazy"`, явные `width/height`; шрифты `display=swap`; декоративные SVG — `aria-hidden`.
- Вёрстка работает от 360 px: без горизонтальной прокрутки, отступ по краям ≥ 16 px.

## 11. Проверка

1. `npm test` (vitest): `markGesture` (порог 500 мс, Interval до отпускания, окно тегов 5 s и перенос на новую метку, переключение тега), сортировка changelog.
2. `npm run typecheck` — без ошибок.
3. `npm run build` — без ошибок; `onBrokenLinks: 'throw'`, `onBrokenMarkdownLinks` → `'throw'`.
4. Playwright по `npm run serve`: главная, каждая статья Guide (выборочно 3), Changelog, Privacy — скриншоты 1440×900 и 390×844; нет ошибок в консоли; `scrollWidth <= clientWidth`; демо-кнопка: клик → появилась метка и чипы; прогон с `reducedMotion: 'reduce'`.
5. Скриншоты показываются пользователю.

## 12. Не входит и открытые вопросы

**Не входит:** деплой на actioncut.io и выбор хостинга; сборка/подпись свежего APK; перенос APK в GitHub Releases; реальные скриншоты (добавляются по мере поступления); русская версия; сбор email для iOS.

**Открыто (до публикации):**
- Контактный email и издатель (`site.ts`).
- Актуальный `actioncut-latest.apk` (в репозитории — сборка июля 2025).
- Реальные скриншоты и, по желанию, запись экрана 10–15 s для hero.
- Юридическая проверка Privacy Policy.
