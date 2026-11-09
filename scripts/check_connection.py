import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

# Завантажую налаштування з файлу .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise ValueError("Не знайдено MONGO_URI у файлі .env")

# Підключаюся до MongoDB Atlas
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)

try:
    client.admin.command("ping")
    print("Підключення до MongoDB Atlas успішне!")
    print("База даних:", os.getenv("MONGO_DB"))
finally:
    client.close()