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


 // Завдання 1. Знаходжу треки, які підходять для вечірки
db.getCollection("tracks").find(
  {
    "audio_features.danceability": { $gt: 0.7 },
    "audio_features.energy": { $gt: 0.7 },
    "track.duration_ms": { $gte: 180000, $lte: 300000 }
  },
  {
    _id: 0,
    "track.name": 1,
    "track.duration_ms": 1,
    "audio_features.danceability": 1,
    "audio_features.energy": 1
  }
).limit(20);


 // Завдання 2. Знаходжу виконавців, у яких усі треки популярні
db.getCollection("tracks").aggregate([
  {
    $unwind: "$artists"
  },
  {
    $group: {
      _id: "$artists",
      track_count: { $sum: 1 },
      min_popularity: { $min: "$track.popularity" },
      avg_popularity: { $avg: "$track.popularity" }
    }
  },
  {
    $match: {
      track_count: { $gte: 3 },
      min_popularity: { $gte: 60 }
    }
  },
  {
    $project: {
      _id: 0,
      artist: "$_id",
      track_count: 1,
      min_popularity: 1,
      avg_popularity: { $round: ["$avg_popularity", 1] }
    }
  },
  {
    $sort: {
      avg_popularity: -1
    }
  },
  {
    $limit: 20
  }
]);


 // Завдання 3. Шукаю треки з незвично високим темпом
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      avg_tempo: { $avg: "$audio_features.tempo" },
      std_tempo: { $stdDevPop: "$audio_features.tempo" },
      tracks: {
        $push: {
          _id: "$_id",
          track_name: "$track.name",
          popularity: "$track.popularity",
          artists: "$artists",
          audio_features: {
            tempo: "$audio_features.tempo"
          }
        }
      }
    }
  },
  {
    $addFields: {
      outlier_threshold: {
        $add: ["$avg_tempo", { $multiply: [2, "$std_tempo"] }]
      }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      avg_tempo: { $round: ["$avg_tempo", 1] },
      outlier_threshold: { $round: ["$outlier_threshold", 1] },
      outlier_tracks: {
        $filter: {
          input: "$tracks",
          as: "track",
          cond: {
            $gt: [
              "$$track.audio_features.tempo",
              "$outlier_threshold"
            ]
          }
        }
      }
    }
  },
  {
    $match: {
      "outlier_tracks.0": { $exists: true }
    }
  },
  {
    $sort: { genre: 1 }
  }
]);


 // Завдання 4. Шукаю спокійну музику для роботи
db.getCollection("tracks").find(
  {
    "audio_features.loudness": { $lt: -10 },
    "audio_features.speechiness": { $lt: 0.1 },
    "audio_features.instrumentalness": { $gt: 0.5 },
    "track.explicit": false
  },
  {
    _id: 0,
    "track.name": 1,
    "track.genre": 1,
    artists: 1,
    "audio_features.loudness": 1,
    "audio_features.speechiness": 1,
    "audio_features.instrumentalness": 1
  }
).limit(20);
