// Перетворюю плоскі дані на вкладені документи
db.getCollection("tracks_raw").aggregate([
  {
    $project: {
      _id: 0,
      track_id: 1,
      track: {
        name: "$track_name",
        genre: "$track_genre",
        popularity: "$popularity",
        duration_ms: "$duration_ms",
        explicit: "$explicit"
      },
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
      album: {
        name: "$album_name"
      },
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
  {
    $out: "tracks"
  }
]);