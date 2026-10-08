# ActionCut: 10 коротких рекламных роликов про детский хоккей

Рабочая версия от 7 октября 2026 года. Язык рекламы: английский. Все произносимые реплики, титры, CTA и промпты для генерации — на английском; режиссёрские пояснения — на русском. Используется нейтральный разговорный английский с американским написанием Mom и Favorites. Формат: вертикальное видео 9:16, 24–28 секунд. Документ содержит сценарии, текстовую раскадровку и задания для генерации отдельных сцен; сами видео и графические кадры пока не создавались.

## Основа: что показали сайт и исходники

В этой рабочей среде папка `../actioncut-app` отсутствует. Найдено приложение ActionCut в `../metka-app2`: название подтверждено `res/values/strings.xml`, идентификатор `io.actioncut.app` — `app/build.gradle.kts`. Проверены исходники ключевых функций, руководство сайта и реальные скриншоты. Приложение на устройстве в рамках этой работы не запускалось.

Сайт хорошо объясняет механику: обычная камера → отметка → отдельный клип. Сильные доказательства — реальные хоккейные видео, экраны приложения и история «сделано родителями для родителей». В рекламе стоит вывести на первый план конкретную семейную ситуацию: ребёнок хочет снова увидеть свой успех, родитель может сразу его показать. Функция становится объяснением того, как это получилось.

**Предлагаемая идея серии: “Small wins. Big memories.”**

Повторяемая конструкция: узнаваемая ситуация в первые 2–3 секунды → одна функция в действии → реакция ребёнка и родителя → короткий призыв. Ценность включает первый точный пас, освоенное упражнение и радость от игры, а не только голы и победу команды.

### Границы рекламных обещаний

- ActionCut не снимает видео сам. Родитель запускает событие и отдельно запись в обычной камере. Отметки имеют смысл, когда есть исходная запись.
- Короткое нажатие по умолчанию даёт 5 секунд до отметки и 2 после. Удержание отмечает интервал с запасом по 3 секунды с каждой стороны. Эти настройки можно менять.
- Отметки и теги ставит человек. Не показывать автоматическое распознавание голов, ребёнка, номера на форме или спортивного прогресса.
- Подготовка клипа требует времени. В рекламе переход между экранами может сокращать ожидание; нельзя подписывать его «мгновенно», «за секунду» или выдавать монтаж за измерение скорости.
- Для отправки во время матча: остановить запись камеры в перерыве → открыть момент → дождаться клипа → поделиться. Само событие может продолжаться.
- Второй ракурс появляется после переноса исходного видео на основной телефон и импорта. Сопоставление идёт по времени записи; неверное время может потребовать поправки. Это не прямая связь между камерами.
- Избранное собирает отдельные клипы. Автоматический фильм сезона с музыкой и склейками здесь не обещаем.
- По текущему сайту продукт доступен через бесплатную Android-бету, Android 14+. Ссылок на опубликованные приложения в магазинах нет. Перед выпуском рекламы проверить актуальность CTA.

### Общий финальный кадр

Последние 3 секунды каждого ролика: логотип ActionCut, строка **“Keep their best moments.”**, кнопка **“Join the beta”**, `actioncut.io`, небольшая читаемая строка `Android 14+`. Голос: **“ActionCut. Join the beta.”** Целевая ссылка объявления: `https://actioncut.io/#beta`.

Фон — кремовый `#FFF1EB`, акцент — оранжевый `#FF7A1A`, текст — тёмный `#251912`; голубой `#00AAF2` второстепенный. Логотип и интерфейс берём из проекта. Английские подписи существующего UI сохраняем. В готовых роликах русского текста нет. Субтитры повторяют английскую речь, короткие смысловые титры также английские.

## Карта серии

| № | Название | Одна главная функция / выгода | Эмоциональный результат | Длина |
|---|---|---|---|---|
| 01 | “Mom, did you get it?” | Отметка → отдельный клип | Можно снова пережить первый гол | 26 с |
| 02 | “Cheer. Then tap.” | В клип входят секунды до нажатия | Важный эпизод остался в кадре | 24 с |
| 03 | “Dad saw it too” | Поделиться клипом в перерыве | Родитель вдали тоже рядом | 26 с |
| 04 | “What about my pass?” | Быстрые теги и фильтр Assist | Вклад ребёнка замечен | 26 с |
| 05 | “I did it!” | Удержание для целого упражнения | Сохранён освоенный навык | 26 с |
| 06 | “Keep the celebration” | Свои начало и конец клипа | Сохранена история вокруг гола | 26 с |
| 07 | “Look how far you’ve come” | Избранное по месяцам и событиям | Семья видит путь ребёнка | 28 с |
| 08 | “One goal. Two angles.” | Несколько версий одного момента | Один успех можно увидеть иначе | 28 с |
| 09 | “That’s my first tournament!” | Отметки в ранее снятом видео | Старые записи становятся доступными моментами | 26 с |
| 10 | “Room for what’s next” | Подготовить клипы и удалить исходник | Освободить память, сохранить важное | 26 с |

## 01. “Mom, did you get it?” — 26 секунд

**Задача:** первый, самый понятный ролик знакомства с продуктом. Герои: мальчик 9 лет и мама. Весь ролик строится вокруг его просьбы пересмотреть гол.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–3 | Крупный план ребёнка у выхода со льда. Он ищет мамин взгляд; шлем ещё на нём. | Child: “Mom, did you get my goal?” | “Their first goal.” |
| 3–7 | Возврат к игре. Мама на трибуне снимает обычной камерой. Через плечо виден REC и кнопка ActionCut; событие уже запущено. | VO: “Film with your usual camera.” Шум катка. | “Film.” |
| 7–11 | Короткий бросок у ворот → шайба в сетке → палец мамы нажимает плавающую кнопку. Два простых монтажных плана. | VO: “Tap when it matters.” Щелчок клюшки, вибрация. | “Tap.” |
| 11–17 | После игры: запись камеры и событие завершены. Мама открывает событие, видна подготовка, затем готовый клип. | VO: “ActionCut turns that moment into a clip.” | “After the game” → “Your moment. Your clip.” |
| 17–23 | Мама приседает рядом с ребёнком у скамейки. Они смотрят гол, ребёнок улыбается. | Child: “One more time!” Мама тихо смеётся. | “Worth watching again.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс для вставки:** камера с реальным оверлеем → `event.webp` → `moment.webp`. В игровых экранах нужен один и тот же эпизод; существующие скриншоты — референс оформления, не готовая замена истории.

**Промпты отдельных планов** — добавить к общему промпту ниже; каждый ID генерировать отдельно:

- **01-A:** “Medium close-up of K1 at the rink exit, still wearing his helmet with a full cage. He looks up toward his mother with an excited, expectant expression. Static camera.”
- **01-B:** “Over P1’s shoulder in the stands. She films the rink, holding a black phone steadily with both hands. Subtle camera push-in. Keep the screen suitable for replacement.”
- **01-C1:** “Side view near the goal. K1 makes one short controlled shot toward the net. One puck, one stick, one simple action. Static camera.”
- **01-C2:** “Medium shot of K1 immediately after scoring, smiling behind his helmet cage and lifting one glove in a small celebration.”
- **01-D:** “Medium two-shot of P1 and K1 sitting on a lobby bench, watching her phone together. K1 smiles and looks up at his mother; she smiles back.”

UI и финальный кадр собираются отдельно. План C1 используется только если траектория шайбы получилась физически убедительной; иначе подставить подходящую реальную запись.

**Монтаж:** голос ребёнка можно положить на кадр со спины или в три четверти; сложная синхронизация губ не нужна. Повтор гола берётся из того же исходного фрагмента.

## 02. “Cheer. Then tap.” — 24 секунды

**Задача:** объяснить ценность секунд до отметки. Камера снимает непрерывно ещё до начала эпизода. Герои: мальчик и папа.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–3 | Ребёнок забивает. Папа радостно реагирует, продолжая держать снимающий телефон. | Dad: “Yes!” Живой звук льда. | “Cheer.” |
| 3–6 | Через секунду после гола палец папы нажимает кнопку ActionCut. | VO: “Tapped just after the goal?” | “Then tap.” |
| 6–11 | Рекламная графика поверх стоп-кадра: отметка, слева выделены 5 секунд, справа 2. В левую часть попадает гол. | VO: “Keep five seconds before your tap…” | “5 seconds before” |
| 11–16 | Переход с титром “After the game”. Готовый клип в ActionCut: бросок, гол, радость. | VO: “…and two after, from your recording.” | “After the game” → “2 seconds after” |
| 16–21 | Ребёнок и папа смотрят клип; ребёнок кивает на момент броска. | Child: “There it is!” | “Ready to watch again.” |
| 21–24 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** камера с REC → момент. Полоса «−5 / отметка / +2» — поясняющая рекламная графика, не выдуманный экран приложения. В данном примере оставляем настройки по умолчанию.

**Промпты отдельных планов:**

- **02-A:** “Medium shot of P2 in the stands. He reacts to a goal with a delighted smile while keeping his filming phone steady in both hands. Natural restrained excitement.”
- **02-B:** “Close-up of P2’s hands holding a black phone steadily. His thumb makes one brief tap on the screen, then lifts. Screen content will be replaced in post.”
- **02-C:** “Medium two-shot of K1 and P2 on a bench after the game. K1 points at the phone in his father’s hand and grins. His father watches with him.”

Гол можно повторно использовать из 01, если внешность и форма совпадают.

**Монтаж:** не показывать большой временной разрыв между голом и нажатием. Нельзя создавать впечатление, что ActionCut восстановит эпизод, который камера вообще не записала.

## 03. “Dad saw it too” — 26 секунд

**Задача:** показать отправку клипа ещё до конца матча. Герои: ребёнок, мама на игре и папа дома.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | Ребёнок у борта обращается к маме после смены. | Child: “Can we send it to Dad?” | “Dad couldn’t make it today.” |
| 4–8 | Короткое воспоминание: мама снимает гол и отмечает его кнопкой. | VO: “Mark the goal while you film.” | “Mark the moment.” |
| 8–12 | Перерыв. Мама явно останавливает запись в камере и открывает момент ActionCut. | Свисток. VO: “Stop recording at the break…” | “At the break” |
| 12–17 | Клип подготовлен. Нажатие Share, выбор семейного чата, отправка одного видео. | VO: “…then share the clip with family.” | “Send the highlight.” |
| 17–23 | Папа дома смотрит гол и записывает короткий ответ. Склейка на маму, показывающую ответ ребёнку. | Dad, voice message: “Saw your goal! What a shot!” | “Different places. Same proud moment.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** кнопка остановки камеры → момент → системное меню Share → подготовленный демонстрационный чат. Приложение не отправляет ничего самостоятельно.

**Промпты отдельных планов:**

- **03-A:** “Medium two-shot during a pause in play. K1 stands safely beside the rink exit and looks toward P1 on the spectator side of the barrier. An expectant, hopeful look.”
- **03-B:** “Over P1’s shoulder in the stands during a break. She looks down at her phone and taps once, calmly. Keep the phone screen steady for replacement.”
- **03-C:** “Medium close-up of P2 sitting in a warm, ordinary home kitchen. He watches a video on his phone; his focused expression turns into a proud smile.”
- **03-D:** “Medium two-shot of P1 and K1 in the rink lobby, leaning toward a phone to listen to a voice message. K1 smiles when he recognizes his father’s voice. Generate silent video.”

**Монтаж:** уведомление и голосовое — созданные элементы постановки. Отправка предполагает доступную связь; офлайн-работу нарезки не смешиваем с обещанием офлайн-доставки.

## 04. “What about my pass?” — 26 секунд

**Задача:** показать, что успех — это и вклад в команду. Функция: тег Assist и фильтр. Герои: девочка 10 лет и папа.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–3 | После игры девочка садится рядом с папой. | Girl: “Did you get my pass?” | “Every goal starts somewhere.” |
| 3–7 | Возврат к игре: девочка делает короткую передачу партнёру перед воротами. Папа снимает. | Звук скольжения и касания шайбы. | “That pass.” |
| 7–12 | Сразу после передачи папа нажимает плавающую кнопку, затем появившийся Assist. | VO: “Mark the moment. Add a tag.” | “Tap → Assist” |
| 12–17 | После игры на экране события папа нажимает фильтр Assist. Остаются отмеченные передачи; он открывает нужную. | VO: “Find their assists after the game.” | “Filter by Assist.” |
| 17–23 | Дочь и папа пересматривают пас. Она улыбается, папа отвечает на её взгляд. | Dad: “Of course. Watch this.” | “Their part in the play.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** быстрый тег Assist → фильтр Assist в событии → момент. Тег выбирает папа; фильтр показывает все так помеченные моменты, без автоматического распознавания игрока. Для этого демонстрационного события папа отмечает передачи своей дочери.

**Промпты отдельных планов:**

- **04-A:** “Medium two-shot in the rink lobby. K2, wearing her teal hockey uniform, sits beside P2 and looks up at him, curious and hopeful.”
- **04-B:** “Wide side view on the ice. K2 makes one short sideways pass to a teammate. One puck follows a clear straight path. Static camera, no collision.”
- **04-C:** “Medium shot of P2 filming from the stands with a black phone in both hands, concentrating on the play.”
- **04-D:** “Medium two-shot of K2 and P2 watching his phone on a lobby bench. K2 gives a small proud smile and exchanges a warm glance with her father.”

**Монтаж:** быстрый тег нажимается в течение пяти секунд после отметки. Не уводить внимание в статистику, рейтинг или сравнение детей.

## 05. “I did it!” — 26 секунд

**Задача:** сохранить целое упражнение через удержание. Герои: девочка и мама; тренировка без соревновательного давления.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–3 | Девочка готовится к упражнению у двух тренировочных конусов и смотрит на маму. | Girl: “Mom, watch this!” | “Today, it clicked.” |
| 3–7 | Мама уже снимает. Палец нажимает кнопку ActionCut и остаётся на ней. | VO: “Hold the button to mark the whole drill.” | “Press and hold.” |
| 7–12 | Девочка выполняет один контролируемый объезд конуса с шайбой. В короткой вставке палец продолжает удержание. | Музыка, ритм коньков. Без речи. | “Keep holding.” |
| 12–16 | Девочка завершает упражнение; мама отпускает кнопку. После остановки записи — переход к готовому интервалу. | VO: “Let go when they’re done.” | “Release to finish.” |
| 16–23 | Мама и дочь смотрят весь проход на телефоне у выхода со льда. | Girl: “I kept the puck the whole way!” | “A little win worth keeping.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** удерживаемая кнопка → момент-интервал. Удержание длится не меньше 0,5 секунды; приложение добавляет предусмотренный настройками запас до и после. Здесь не нужно перегружать рекламный кадр цифрами.

**Промпты отдельных планов:**

- **05-A:** “Medium-wide shot of K2 at the start of a simple hockey drill. She stands beside a training cone, looks toward her mother, then begins to skate forward.”
- **05-B:** “Over P1’s shoulder as she films the rink. Her thumb presses one point on the phone screen and stays there. Hold the phone steady; screen replacement in post.”
- **05-C:** “Wide side view of K2 making one smooth turn around a single training cone while controlling one puck. Slow believable youth practice speed. Static camera.”
- **05-D:** “Medium two-shot of P1 and K2 on a lobby bench, watching a phone together. K2 looks pleased and a little surprised at her own success.”

**Монтаж:** движение игрока остаётся одним непрерывным простым действием. Для более длинного упражнения взять реальную запись; не просить генератор в одном кадре выполнить сложную цепочку финтов.

## 06. “Keep the celebration” — 26 секунд

**Задача:** показать изменение границ одного клипа. Герои: мальчик и папа. Самое дорогое в записи — ещё и реакция ребёнка.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | Мальчик смотрит на телефоне свой гол. Клип заканчивается до его жеста в сторону трибуны. | Child: “Where’s the bit where I wave?” | “There’s more after the goal.” |
| 4–8 | Папа открывает меню момента → Edit clip. На исходной записи виден эпизод после гола. | VO: “Want to keep a little more?” | “Adjust your clip.” |
| 8–13 | Экран Custom clip: папа перемещается к нужному окончанию, нажимает Mark end, затем Save. | VO: “Choose exactly where your clip ends.” | “Mark end → Save” |
| 13–18 | Новый клип включает гол и короткий взмах перчаткой в сторону папы. | Child, in the clip: “Yes!” | “Keep the celebration.” |
| 18–23 | Папа и сын обмениваются улыбками, сын касается папиного плеча. | Child: “Keep that part.” | “The whole moment.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** момент → меню Edit clip → Custom clip с Mark end и Save → обновлённый момент. Исходная запись обязательно включает жест; приложение не достраивает отсутствующие секунды.

**Промпты отдельных планов:**

- **06-A:** “Medium two-shot of P2 and K1 in everyday clothes at a home table, watching a phone. K1 looks up with mild surprise when the video ends.”
- **06-B:** “Medium shot of K1 on the ice after a goal, in full hockey gear. He gives one brief happy wave with his glove toward his father in the stands.”
- **06-C:** “Close two-shot of P2 and K1 at the home table, smiling at each other over the phone. K1 gently touches his father’s shoulder.”

Экран настройки — отдельная запись реального UI.

**Монтаж:** не рисовать выдуманные перетаскиваемые ручки редактирования, если в демонстрируемом интерфейсе используются Mark start / Mark end. Это корректировка существующей записи, а не генеративное продолжение.

## 07. “Look how far you’ve come” — 28 секунд

**Задача:** эмоциональный ролик про историю сезона. Функция: избранные моменты, сгруппированные по месяцам и событиям. Герои: мальчик и мама.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | На телефоне старая запись: ребёнок осторожно ведёт шайбу. В кадре мама и сын на диване. | Child: “Was I really that slow?” | “The start of the season.” |
| 4–8 | Воспоминание: мама на экране момента нажимает сердечко. Две короткие склейки с другими датами. | VO: “Tap the heart on moments you love.” | “Save a favorite.” |
| 8–13 | Реальный экран Favorites: группы разных месяцев и событий. Мама открывает более ранний момент. | VO: “Find them by month and game.” | “A season of memories.” |
| 13–19 | Два последовательных клипа: осторожное ведение в начале сезона, уверенный проход позже. Это рекламный монтаж двух сохранённых видео. | VO: “See how far they’ve come, together.” | “Then” → “Now” |
| 19–25 | Ребёнок оборачивается к маме и сияет; она мягко обнимает его за плечи. | Mom: “Look at you now.” | “Every little step.” |
| 25–28 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** сердце на моменте → Favorites с группировкой → последовательное открытие клипов. Использовать события с датами, соответствующими истории. Приложение не оценивает прогресс и не создаёт этот рекламный монтаж автоматически.

**Промпты отдельных планов:**

- **07-A:** “Medium two-shot of P1 and K1 in everyday clothes on a sofa in warm evening light, watching a phone together. K1 looks curious and amused.”
- **07-B:** “Wide static shot of K1 at an early practice, slowly guiding one puck along a straight path. Careful, tentative but safe skating. Match the rink reference.”
- **07-C:** “Use the same framing and rink as 07-B. K1 confidently guides a puck along the same straight path at a slightly quicker, controlled pace. Keep his face and body consistent.”
- **07-D:** “Medium two-shot on the sofa. K1 looks proudly toward P1. She gently puts an arm around his shoulders while they keep watching the phone.”

**Монтаж:** сохранить лицо ребёнка, не делать искусственное резкое взросление за несколько месяцев. Разницу передают уверенность движений и даты, а не изменение тела. Экранного «графика развития» нет.

## 08. “One goal. Two angles.” — 28 секунд

**Задача:** показать несколько ракурсов одного момента. Герои: ребёнок, мама и папа, снимающие с разных мест.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | Два быстрых плана трибуны: мама у середины площадки, папа ближе к воротам. Оба снимают. | Mom, off camera: “Did you get it from your side?” | “One goal. Two angles.” |
| 4–8 | Ребёнок забивает; мама на своём телефоне отмечает момент. | VO: “Mark the moment on your phone.” | “One mark.” |
| 8–13 | После игры родители сидят рядом. Показать передачу оригинального файла с телефона папы на мамин и завершение копирования. | VO: “Copy the other recording to your phone…” | “Copy the original video.” |
| 13–18 | На мамином телефоне: Sources → Import video → Scan this phone. Импорт второй записи. | VO: “…then import it into the event.” | “Import the second angle.” |
| 18–25 | Экран момента: переход между двумя версиями. Потом ребёнок между родителями смотрит результат. | Child: “Now show me Dad’s!” | “Pick your view.” |
| 25–28 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** камера → перенос оригинального видео средствами телефона → Sources → Import video → Scan this phone → момент с двумя версиями. Процесс показан монтажными сокращениями, без обещания скорости переноса или импорта.

**Промпты отдельных планов:**

- **08-A:** “Medium side view of P1 filming from seats near the center of the rink, with the ice visible behind her phone. Natural community arena atmosphere.”
- **08-B:** “Medium side view of P2 filming from a safe spectator position near the end of the rink. Match the same rink, lighting and time as 08-A.”
- **08-C:** “Medium two-shot of P1 and P2 at a table after the game, each holding a phone. They sit side by side and look at the screens, relaxed and focused.”
- **08-D:** “Medium three-shot of K1 seated between P1 and P2, watching one phone together. K1 points toward the screen, eager to see another view.”

**Монтаж и исходники:** два угла должны изображать один и тот же гол: одинаковые позиции игроков, форма, ворота и последовательность действия. Предпочтительно взять настоящую пару синхронных записей одного эпизода. Два независимо сгенерированных гола не выдавать за документальное доказательство точности синхронизации. На сайте готового реального скриншота момента с двумя версиями пока нет; его потребуется снять в приложении.

**Условие:** у импортированного файла должно быть корректное время записи. При необходимости оно исправляется в Sources. Не показывать автоматический обмен видео между телефонами средствами ActionCut.

## 09. “That’s my first tournament!” — 26 секунд

**Задача:** объяснить, что приложение полезно и для старых записей. Герои: мальчик и папа.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | Папа листает старые записи в галерее; сын узнаёт кадр. | Child: “That’s my first tournament!” | “Already filmed it?” |
| 4–9 | Переход в заранее созданное и завершённое событие. Sources → Import video → Choose a file; выбор старой записи и подтверждение времени. | VO: “Import an older video into an event.” | “Import your video.” |
| 9–14 | В плеере папа сам находит гол, нажимает + Instant, затем Save. На шкале появляется отметка. | VO: “Find the moment. Mark it as you watch.” | “Mark as you watch.” |
| 14–19 | Экран отдельного момента: воспроизводится короткий клип из этого видео. | VO: “ActionCut turns it into a short clip.” | “A moment worth finding.” |
| 19–23 | Папа передаёт телефон ребёнку, тот придвигается ближе. | Child: “Can we show Mom?” | “Old game. Same big smile.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** подготовить новое событие, запустить и завершить его → Sources → Choose a file → время записи → плеер с + Instant и Save → момент. Первые два подготовительных действия можно не включать в экранный хронометраж, но они нужны в демонстрационном проекте.

**Промпты отдельных планов:**

- **09-A:** “Medium two-shot of P2 and K1 in everyday clothes at a kitchen table. K1 recognizes an old video on his father’s phone and leans closer with a delighted expression.”
- **09-B:** “Wide static shot at a small youth hockey tournament. K1 in full gear makes one simple controlled shot near the goal. Match the established character and rink references.”
- **09-C:** “Medium two-shot at the kitchen table. P2 hands his phone to K1 carefully. Both smile at a rediscovered memory.”

**Монтаж:** старую запись человек просматривает сам. Не обещать, что приложение без предварительных отметок самостоятельно найдёт все голы в архиве.

## 10. “Room for what’s next” — 26 секунд

**Задача:** показать освобождение памяти после подготовки клипов. Герои: ребёнок и мама, следующий тренировочный день.

| Время | Кадр и действие | Речь / звук | Титр |
|---|---|---|---|
| 0–4 | Перед новой тренировкой ребёнок машет маме с площадки. На её телефоне — предупреждение, что свободного места мало. | Child: “Are you filming today, Mom?” | “Storage almost full?” |
| 4–9 | Мама открывает Sources прошлого события, выбирает длинную запись: Remove from event и Also delete the files from this phone. | VO: “Remove the long recording through ActionCut.” | “Keep the moments that matter.” |
| 9–14 | Реальное состояние Preparing clips before deleting. Следующий монтажный кадр — подготовка завершена. | VO: “It prepares your marked clips first.” | “Prepare clips first.” |
| 14–19 | Системное подтверждение Android; мама подтверждает удаление. Затем открывает сохранившийся момент прошлого матча. | VO: “Then confirm deletion of the original.” | “Keep your clips.” |
| 19–23 | Мама снова снимает ребёнка на тренировке. Он начинает новый проход. | Mom: “I’m filming!” | “Room for what’s next.” |
| 23–26 | Общий финальный кадр. | VO: “ActionCut. Join the beta.” | “Keep their best moments.” / “Join the beta” / actioncut.io / Android 14+ |

**Интерфейс:** предупреждение о небольшом остатке памяти, когда её ещё хватает на подготовку клипов → Sources → штатное удаление с подготовкой → системное подтверждение → оставшийся клип. Никаких придуманно точных значений освобождённых гигабайт.

**Промпты отдельных планов:**

- **10-A:** “Medium shot of K1 in full hockey gear beside the boards before practice. He gives a small wave toward P1 in the stands, ready to begin.”
- **10-B:** “Medium close-up of P1 seated in the stands, calmly working on her phone. Focused expression, no exaggerated frustration.”
- **10-C:** “Medium shot of P1 raising her phone into a stable filming position with both hands and smiling toward the ice.”
- **10-D:** “Wide side view of K1 beginning a short confident skate with one puck during practice. One simple forward movement, static camera.”

**Условие:** показываем успешную подготовку. Если клипы не удалось подготовить, приложение предупреждает пользователя; ролик не должен создавать обещание сохранности при любой ошибке. Удаление делается через ActionCut, не напрямую из галереи. Сохраняются отмеченные отрезки, остальная исходная запись удаляется.

## Пакет для генерации сцен

### Герои и визуальная непрерывность

Предлагаемый вымышленный состав: мальчик 9 лет, девочка 10 лет, их мама и папа. Одну семью можно использовать во всей серии, чтобы ролики узнавались. Имена в рекламе не нужны.

| Референс | Постоянные признаки | Где используется |
|---|---|---|
| K1 — мальчик | Короткие каштановые волосы, бирюзовая тренировочная форма, тёмно-синие перчатки, чёрный шлем с полной решёткой | 01–03, 06–10 |
| K2 — девочка | Каштановые волосы собраны, бирюзовая форма, чёрный шлем с полной решёткой | 04–05 |
| P1 — мама | Около 35 лет, тёмные волосы до плеч, бежевая куртка на катке; дома однотонный светлый свитер | 01, 03, 05, 07, 08, 10 |
| P2 — папа | Около 38 лет, короткие тёмные волосы, синяя куртка; дома однотонный тёмный свитер | 02–04, 06, 08, 09 |
| R1 — каток | Небольшая крытая арена, белый лёд, синие сиденья, красные ворота, нейтральные борта | Все спортивные сцены |
| H1 — дом | Обычная светлая кухня и диван, спокойный вечерний свет | 03, 06, 07, 09 |

Сначала зафиксировать референсы персонажей: лицо, полный рост, экипировка, одежда родителя. Затем использовать одни и те же референсы в сценах. На форме — без клубных логотипов и читаемых фамилий. На льду у детей полная экипировка; домашние сцены — в обычной одежде. Родители остаются в зрительской зоне.

### Общий промпт для игровых и семейных сцен

К этому блоку добавляется один английский промпт из раздела «Промпты отдельных планов» соответствующего ролика и нужные референсы:

> Vertical 9:16, realistic family commercial about youth sports. Match the supplied character and location references exactly: same faces, clothing, hockey equipment and rink. An ordinary family at a small indoor community ice rink. Natural proportions, believable movement, warm understated emotion. Cool rink lighting with natural warm skin tones. One continuous shot, one simple action, 4–6 seconds. Camera: [framing and movement]. Child: [one action, if visible]. Parent: [one action, if visible]. If a phone screen is visible, keep it flat and steady for screen replacement in post-production. No generated text, subtitles, logos, watermarks or invented app interface. No changes of face, uniform, location or time within the shot. No elaborate camera moves. No spoken dialogue; voices will be added separately.

Необязательно заполнять действие обоих персонажей: для хоккейного прохода достаточно одного ребёнка в кадре. Титры, UI, логотип, реплики и музыку добавляем на монтаже. Графику CTA делаем средствами видеоредактора.

### Готовый пример промпта для первого ролика, кадр 01-D

> Vertical 9:16 realistic video, 6 seconds, one continuous medium two-shot at seated eye level. Match character references K1 and P1 exactly. On a bench in the public lobby of a small indoor ice rink, a mother wearing a beige jacket sits beside her nine-year-old son in a teal hockey uniform. They have left the ice. His helmet is off and rests on the bench beside him. She holds a black Android phone steadily with the screen facing them, mostly hidden from the viewer. They watch a short video together. The boy looks focused, then smiles and looks up at his mother. She answers with a warm smile. Very slow, subtle camera push-in. Natural light, quiet rink background, no foreground passersby. No dialogue, text, logos, cuts or exaggerated acting.

Для короткой реплики “One more time!” использовать отдельную дорожку в момент, когда рот не виден фронтально, либо подготовить отдельный синхронизированный дубль. VO — спокойный разговорный голос взрослого, нейтральное английское произношение; детские реплики короткие, естественные, без дикторской интонации.

### Сборка и звук

1. Генерировать планы по отдельности, с запасом для обрезки. Не пытаться одним запросом получить весь ролик с шестью сценами, интерфейсом и титрами.
2. Игровые действия разбивать на простые планы: передача, бросок, шайба в воротах, реакция. Для шайбы и двух совпадающих ракурсов предпочтительны реальные подходящие записи. В проекте есть `static/video/game-1.mp4` … `game-6.mp4`; перед использованием выбрать нужный эпизод и проверить, что его можно публиковать в рекламе.
3. Снимать реальный UI на тестовом событии с тем же игровым материалом. Вставлять через замену экрана или показывать отдельным полноэкранным планом. Телефон не должен закрывать действие рукой.
4. Рекламный ролик вертикальный, но запись матча и телефон в руках могут иметь естественную ориентацию. Не растягивать горизонтальную запись до вертикальной: использовать экран телефона, поля или осмысленную обрезку.
5. Для каждого клипа выдержать одну понятную последовательность: действие родителя → видимое изменение UI → результат. При переходе к просмотру обозначать паузу или “After the game”, если это нужно для логики.
6. Оставить узнаваемые звуки: скольжение, касание клюшки, шум трибуны, короткий отклик кнопки. Музыка поддерживает сцену и не перекрывает голоса. Никакой агрессивной «погони за чемпионом».
7. Все реплики дублировать читаемыми субтитрами. Рекламные титры короткие; смысл должен быть понятен и без звука. Не класть титры поверх ключевых кнопок или шайбы.
8. Рабочий мастер — 1080 × 1920. Субтитры, лицо, кнопку и CTA держать ближе к центру; проверить размещение в превью конкретной рекламной площадки. Последний кадр выдержать все три секунды.

## Какие экраны подготовить

| Ролик | Существующие материалы сайта | Что дополнительно записать |
|---|---|---|
| 01 | `home.webp`, `event.webp`, `moment.webp`; оверлей камеры в компонентах сайта | Запуск события, реальная отметка, подготовка клипа, гол выбранного героя |
| 02 | `moment.webp`; значения по умолчанию в руководстве | Нажатие через секунду после гола; графику −5 / +2 сделать на монтаже |
| 03 | `moment.webp` | Остановка камеры, подготовка, системное меню Share и демонстрационный семейный чат |
| 04 | `event-tag.webp`, `tags-sheet.webp`, `event-filter.webp` | Быстрый Assist и фильтрация именно по Assist |
| 05 | `moment.webp`, `clip-length-interval.webp` | Удержание и отпускание кнопки, просмотр интервала |
| 06 | `edit-clip.webp` | Открытие Edit clip, выбор Mark end, Save и новое окончание |
| 07 | `favorites-dark.webp`, `favorites-save.webp` | Избранное с двумя разными месяцами и узнаваемым ребёнком |
| 08 | `sources.webp`, `import-video-dark.webp` | Импорт второй записи и настоящий экран момента с двумя версиями |
| 09 | `video-moments.webp`, `import-video-dark.webp` | Выбор файла, время записи, + Instant, Save и готовый момент |
| 10 | `sources.webp` | Подготовка перед удалением, подтверждение Android, воспроизведение оставшегося клипа |

Все пути изображений в таблице — относительно `static/img/screens/`. Изображения с сайта фиксируют дизайн; готовые рекламные вставки должны соответствовать действию, выбранным героям и версии приложения.

## Как адаптировать на другие виды спорта

Сохраняются семейная ситуация, функция приложения, схема монтажа и финальный CTA. Меняются спортивное действие, среда, экипировка и при необходимости пользовательский тег.

| Хоккейный элемент | Футбол | Баскетбол | Плавание |
|---|---|---|---|
| Первый гол | Первый гол | Первое попадание | Первый уверенный финиш |
| Голевая передача, Assist | Голевая передача | Результативная передача | Пользовательский тег «Поворот» вместо Assist |
| Упражнение с шайбой | Ведение мяча | Ведение и бросок | Отрезок дорожки или старт |
| Мама / папа по разные стороны катка | Разные места у поля | Трибуна и место у щита | Старт и финиш, если обе камеры покрывают нужный момент |
| Прогресс катания | Контроль мяча | Техника броска | Уверенность в воде |

Для каждого спорта использовать естественный конкретный успех. Например, не переносить хоккейный «сейв» в сюжет о плавании механической заменой слов. Автоматические измерения скорости, техники и результатов не добавляются.

## Порядок первой тестовой серии

Начать с **01**, **03** и **07**: они раскрывают три разные причины заинтересоваться — понятная польза, связь с близкими и память о взрослении. Затем **02**, **04**, **05**, **06** объясняют действия в приложении; **08**, **09**, **10** раскрывают дополнительные возможности.

Для ролика 01 можно сделать два первых кадра при одинаковом остальном монтаже:

- Эмоциональный: ребёнок — “Mom, did you get my goal?”
- Практический: мама листает длинную запись; титр “Where’s their goal in all this footage?”

Выбор победителя делать по результатам размещения, а не по заранее обещанной эффективности. Сравнивать удержание первых секунд, досмотры и переходы; целевое действие сейчас — обращение за доступом к бете.

## Проверенные источники в проектах

Пути приложения указаны относительно `../metka-app2`; Kotlin-файлы находятся в `app/src/main/java/com/farbrikai/metkaapp2/`.

| Что проверено | Источник сайта | Источник приложения |
|---|---|---|
| Идентичность, платформа, текущий CTA | `src/data/site.ts`, `src/components/landing/Beta.tsx` | `app/build.gradle.kts`, `app/src/main/res/values/strings.xml` |
| Запись обычной камерой и отметки | `guide/first-event.mdx`, `guide/floating-button.mdx` | `service/OverlayService.kt` |
| Запасы 5/2 и 3/3 секунды | `guide/clip-length.mdx` | `data/entity/Session.kt` |
| Быстрые теги и пять секунд | `guide/tags-and-favorites.mdx` | `service/QuickTagsPopup.kt`, `data/database/TagSeeds.kt` |
| Избранное по месяцам и событиям | `guide/tags-and-favorites.mdx` | `utils/FavoriteGrouping.kt` |
| Границы отдельного клипа | `guide/clip-length.mdx` | `ui/screen/CustomClipWindowScreen.kt` |
| Импорт по времени и версии | `guide/other-cameras.mdx` | `utils/SmartImportPlan.kt`, `utils/MomentVariantResolver.kt` |
| Отметки в уже снятом видео | `guide/other-cameras.mdx` | `ui/screen/videos/VideoPlayerScreen.kt` |
| Системная отправка клипа | `guide/saving-and-sharing.mdx` | `ui/screen/MomentScreen.kt` |
| Подготовка клипов перед удалением | `guide/other-cameras.mdx` | `service/PrepareBeforeDelete.kt` |
| Визуальный стиль | `src/css/custom.css`, `static/img/screens/` | Реальные скриншоты приложения, опубликованные в проекте сайта |

В старом описании приложения встречается упоминание объединённого видео, но актуальное руководство сайта запрещает обещать склейку клипов в один фильм. В эти сценарии такое обещание не включено. Проверка исходников подтверждает наличие показанных механизмов, но не заменяет финальную проверку демонстрационных действий на устройстве перед производством рекламы.
