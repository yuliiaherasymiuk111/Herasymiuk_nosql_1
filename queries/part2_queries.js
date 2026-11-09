// Знаходжу популярні треки з високою енергійністю
db.getCollection("tracks").find(
  {
    "track.popularity": { $gte: 80 },
    "audio_features.energy": { $gte: 0.8 }
  },
  {
    _id: 0,
    "track.name": 1,
    "track.popularity": 1,
    "audio_features.energy": 1
  }
).limit(10);

// Шукаю треки конкретного виконавця
db.getCollection("tracks").find(
  {
    artists: "Billie Eilish"
  },
  {
    _id: 0,
    "track.name": 1,
    artists: 1,
    "track.popularity": 1
  }
).limit(10);

// Шукаю треки за темпом і танцювальністю
db.getCollection("tracks").find(
  {
    "audio_features.tempo": { $gte: 100, $lte: 130 },
    "audio_features.danceability": { $gte: 0.7 }
  },
  {
    _id: 0,
    "track.name": 1,
    "audio_features.tempo": 1,
    "audio_features.danceability": 1
  }
).limit(10);

// Знаходжу 10 найпопулярніших треків
db.getCollection("tracks").find(
  {},
  {
    _id: 0,
    "track.name": 1,
    "track.genre": 1,
    "track.popularity": 1
  }
).sort({ "track.popularity": -1 }).limit(10);

// Шукаю популярні треки жанру pop
db.getCollection("tracks").find(
  {
    "track.genre": "pop",
    "track.popularity": { $gte: 80 }
  },
  {
    _id: 0,
    track_id: 1,
    "track.name": 1,
    "track.genre": 1,
    "track.popularity": 1
  }
);

// Шукаю треки тривалістю від 3 до 4 хвилин
db.getCollection("tracks").find({
  "track.duration_ms": {
    $gte: 180000,
    $lte: 240000
  }
});

// Шукаю популярні треки без нецензурного контенту
db.getCollection("tracks").find({
  "track.explicit": false,
  "track.popularity": { $gte: 70 }
});

// Шукаю треки Billie Eilish
db.getCollection("tracks").find({
  artists: "Billie Eilish"
});

// Шукаю треки кількох жанрів
db.getCollection("tracks").find({
  "track.genre": {
    $in: ["rock", "pop", "hip-hop"]
  }
});

// Шукаю треки з низькою енергійністю
db.getCollection("tracks").find({
  "audio_features.energy": { $lt: 0.3 }
});