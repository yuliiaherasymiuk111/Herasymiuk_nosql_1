// Обчислюю середню популярність треків за жанрами
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      average_popularity: {
        $avg: "$track.popularity"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_popularity: -1
    }
  },
  {
    $limit: 10
  }
]);

// Обчислюю середню енергійність треків за жанрами
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      average_energy: {
        $avg: "$audio_features.energy"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_energy: -1
    }
  },
  {
    $limit: 10
  }
]);

// Рахую кількість треків у кожному жанрі
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      tracks_count: { $sum: 1 }
    }
  },
  {
    $sort: {
      tracks_count: -1,
      _id: 1
    }
  },
  {
    $limit: 10
  }
]);

// Обчислюю середню танцювальність треків за жанрами
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      average_danceability: {
        $avg: "$audio_features.danceability"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_danceability: -1
    }
  },
  {
    $limit: 10
  }
]);

// Знаходжу виконавців із найвищою середньою популярністю
db.getCollection("tracks").aggregate([
  {
    $unwind: "$artists"
  },
  {
    $group: {
      _id: "$artists",
      average_popularity: {
        $avg: "$track.popularity"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $match: {
      tracks_count: { $gte: 5 }
    }
  },
  {
    $sort: {
      average_popularity: -1
    }
  },
  {
    $limit: 10
  }
]);

// Обчислюю середню тривалість треків у хвилинах
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      average_duration_minutes: {
        $avg: {
          $divide: ["$track.duration_ms", 60000]
        }
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_duration_minutes: -1
    }
  },
  {
    $limit: 10
  }
]);

// Знаходжу альбоми з найвищою середньою популярністю
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$album.name",
      average_popularity: {
        $avg: "$track.popularity"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $match: {
      tracks_count: { $gte: 3 }
    }
  },
  {
    $sort: {
      average_popularity: -1
    }
  },
  {
    $limit: 10
  }
]);

// Знаходжу найпопулярніші жанри серед танцювальних треків
db.getCollection("tracks").aggregate([
  {
    $match: {
      "audio_features.danceability": { $gte: 0.7 }
    }
  },
  {
    $group: {
      _id: "$track.genre",
      average_popularity: {
        $avg: "$track.popularity"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_popularity: -1
    }
  },
  {
    $limit: 10
  }
]);

// Знаходжу жанри з найвищою середньою гучністю
db.getCollection("tracks").aggregate([
  {
    $group: {
      _id: "$track.genre",
      average_loudness: {
        $avg: "$audio_features.loudness"
      },
      tracks_count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      average_loudness: -1
    }
  },
  {
    $limit: 10
  }
]);

// Знаходжу жанри з найбільшою кількістю енергійних треків
db.getCollection("tracks").aggregate([
  {
    $match: {
      "audio_features.energy": { $gte: 0.8 }
    }
  },
  {
    $group: {
      _id: "$track.genre",
      tracks_count: {
        $sum: 1
      },
      average_energy: {
        $avg: "$audio_features.energy"
      }
    }
  },
  {
    $sort: {
      tracks_count: -1
    }
  },
  {
    $limit: 10
  }
]);