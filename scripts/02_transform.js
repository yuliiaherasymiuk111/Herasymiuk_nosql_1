
 // Перетворюю плоскі дані на вкладені документи
// Додаю тривалість у секундах та категорію популярності

db.getCollection("tracks_raw").aggregate([
  {
    $project: {
      _id: 0,
      track_id: 1,

      // Основна інформація про трек
      track: {
        name: "$track_name",
        genre: "$track_genre",
        popularity: "$popularity",
        duration_ms: "$duration_ms",
        explicit: "$explicit"
      },

      // Перетворюю виконавців із рядка на масив
      artists: {
        $map: {
          input: {
            $split: [
              {
                $convert: {
                  input: "$artists",
                  to: "string",
                  onError: "",
                  onNull: ""
                }
              },
              ";"
            ]
          },
          as: "artist",
          in: {
            $trim: {
              input: "$$artist"
            }
          }
        }
      },

      // Інформація про альбом
      album: {
        name: "$album_name"
      },

      // Тривалість треку в секундах
      duration_sec: {
        $round: [
          { $divide: ["$duration_ms", 1000] },
          1
        ]
      },

      // Категорія популярності треку
      popularity_tier: {
        $switch: {
          branches: [
            {
              case: { $gte: ["$popularity", 70] },
              then: "high"
            },
            {
              case: { $gte: ["$popularity", 40] },
              then: "medium"
            }
          ],
          default: "low"
        }
      },

      // Аудіохарактеристики треку
      audio_features: {
        danceability: "$danceability",
        energy: "$energy",
        key: "$key",
        loudness: "$loudness",
        mode: "$mode",
        speechiness: "$speechiness",
        acousticness: "$acousticness",
        instrumentalness: "$instrumentalness",
        liveness: "$liveness",
        valence: "$valence",
        tempo: "$tempo",
        time_signature: "$time_signature"
      }
    }
  },

  // Зберігаю результат у колекцію tracks
  {
    $out: "tracks"
  }
]);
