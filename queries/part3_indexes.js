
/*
  Частина 3. Індекси та оптимізація MongoDB
  База даних: spotify_analytics

  Додаткова частина домашнього завдання.
  Перевіряю використання індексів за допомогою explain().
  Код призначений для запуску в mongosh.

  Для першого завдання порівняння потрібно
  виконувати на базі без відповідного індексу.
*/

db = db.getSiblingDB("spotify_analytics");

// ========================================
// Завдання 1. Оптимізація пошуку
// ========================================

const partyFilter = {
  "track.genre": "pop",
  "audio_features.danceability": { $gte: 0.7 }
};

const partySort = {
  "track.popularity": -1
};

// Перевірка без індексу.
// hint({ $natural: 1 }) примусово використовує
// сканування колекції для порівняння.
const before = db.tracks
  .find(partyFilter)
  .sort(partySort)
  .hint({ $natural: 1 })
  .explain("executionStats");

print("=== Завдання 1: До індексу ===");

printjson({
  executionTimeMillis: before.executionStats.executionTimeMillis,
  totalDocsExamined: before.executionStats.totalDocsExamined,
  totalKeysExamined: before.executionStats.totalKeysExamined,
  nReturned: before.executionStats.nReturned
});

// Створення складеного індексу
db.tracks.createIndex(
  {
    "track.genre": 1,
    "audio_features.danceability": 1,
    "track.popularity": -1
  },
  {
    name: "idx_genre_danceability_popularity"
  }
);

// Перевірка з індексом
const after = db.tracks
  .find(partyFilter)
  .sort(partySort)
  .hint("idx_genre_danceability_popularity")
  .explain("executionStats");

print("=== Завдання 1: Після індексу ===");

printjson({
  executionTimeMillis: after.executionStats.executionTimeMillis,
  totalDocsExamined: after.executionStats.totalDocsExamined,
  totalKeysExamined: after.executionStats.totalKeysExamined,
  nReturned: after.executionStats.nReturned
});

// ========================================
// Завдання 2. Індекс для музики для роботи
// ========================================

db.tracks.createIndex(
  {
    "track.explicit": 1,
    "audio_features.instrumentalness": 1,
    "audio_features.speechiness": 1
  },
  {
    name: "idx_work_music"
  }
);

const workExplain = db.tracks.find({
  "audio_features.loudness": { $lt: -10 },
  "audio_features.speechiness": { $lt: 0.1 },
  "audio_features.instrumentalness": { $gt: 0.5 },
  "track.explicit": false
}).explain("executionStats");

print("=== Завдання 2: Музика для роботи ===");

printjson({
  executionTimeMillis: workExplain.executionStats.executionTimeMillis,
  totalDocsExamined: workExplain.executionStats.totalDocsExamined,
  totalKeysExamined: workExplain.executionStats.totalKeysExamined,
  nReturned: workExplain.executionStats.nReturned,
  winningPlan: workExplain.queryPlanner.winningPlan
});

// ========================================
// Завдання 3. Covered Query
// ========================================

db.tracks.createIndex(
  {
    "track.genre": 1,
    "track.popularity": -1
  },
  {
    name: "idx_genre_popularity_covered"
  }
);

// Проєкція містить лише поля з індексу.
// Поле _id виключене, щоб не читати документи.
const covered = db.tracks.find(
  {
    "track.genre": "pop",
    "track.popularity": { $gte: 70 }
  },
  {
    _id: 0,
    "track.genre": 1,
    "track.popularity": 1
  }
)
.hint("idx_genre_popularity_covered")
.explain("executionStats");

print("=== Завдання 3: Covered Query ===");

printjson({
  executionTimeMillis: covered.executionStats.executionTimeMillis,
  totalDocsExamined: covered.executionStats.totalDocsExamined,
  totalKeysExamined: covered.executionStats.totalKeysExamined,
  nReturned: covered.executionStats.nReturned,
  winningPlan: covered.queryPlanner.winningPlan
});

/*
  Мої результати перевірки:

  Завдання 1:
  До індексу:
  - Час: 74 мс
  - Перевірено документів: 114000
  - Знайдено: 354

  Після індексу:
  - Час: 2 мс
  - Перевірено документів: 354
  - Перевірено ключів: 354
  - Знайдено: 354

  Завдання 2:
  - Час: 51 мс
  - Перевірено документів: 16141
  - Перевірено ключів: 16602
  - Знайдено: 9324
  - Використано IXSCAN та FETCH

  Завдання 3:
  - Час: 2 мс
  - Перевірено документів: 0
  - Перевірено ключів: 317
  - Знайдено: 317
  - Використано IXSCAN без FETCH

  Висновок:
  Індекси допомагають MongoDB перевіряти менше
  документів під час пошуку.

  Covered Query дозволяє отримати потрібні
  дані без читання документів із колекції.

  Час виконання може відрізнятися між запусками.
*/
