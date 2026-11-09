import os
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

# Знаходжу головну папку проєкту
project_dir = Path(__file__).resolve().parent.parent

# Завантажую налаштування підключення
load_dotenv(project_dir / ".env")

mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DB")

if not mongo_uri or not db_name:
    raise ValueError("Перевір MONGO_URI та MONGO_DB у файлі .env")

# Читаю датасет Spotify
csv_path = project_dir / "dataset.csv"
df = pd.read_csv(csv_path)

print("Кількість рядків у CSV:", len(df))
print("Кількість колонок:", len(df.columns))

# Підключаюся до MongoDB Atlas
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)

try:
    client.admin.command("ping")

    db = client[db_name]
    collection = db["tracks_raw"]

    # Очищую колекцію перед завантаженням
    collection.delete_many({})

    # Завантажую дані частинами по 1000 записів
    batch_size = 1000

    for start in range(0, len(df), batch_size):
        batch = df.iloc[start:start + batch_size]

        # Перетворюю рядки таблиці на документи
        documents = batch.where(pd.notna(batch), None).to_dict(
            orient="records"
        )

        collection.insert_many(documents)

        print(f"Завантажено: {min(start + batch_size, len(df))}")

    # Перевіряю результат
    total = collection.count_documents({})
    print(f"\nГотово! У tracks_raw збережено {total} документів.")

finally:
    client.close()