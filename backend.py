from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import shutil
import os
import sqlite3
from fastapi.staticfiles import StaticFiles

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


try:
    db = sqlite3.connect("./src/data.db", check_same_thread=False)  
    cursor = db.cursor()
    print("✅ SQLite 연결 성공!")
except sqlite3.Error as err:
    print(f"❌ SQLite 연결 실패: {err}")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"/uploads/{file.filename}"}


class BattleRequest(BaseModel):
    players: list[str]  

@app.post("/battle/")
async def battle(request: BattleRequest):
    if len(request.players) < 2:
        raise HTTPException(status_code=400, detail="두 명 이상의 플레이어가 필요합니다.")
    
    winner = random.choice(request.players)
    return {"winner": winner}

class Character(BaseModel):
    name: str
    wins: int = 0
    img_url: str

@app.post("/save_character/")
async def save_character(character: Character):
    try:
        print(f"Saving character: {character.name}, Wins: {character.wins}, Image URL: {character.img_url}")

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='wins'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Database table 'wins' does not exist!")

        cursor.execute("SELECT * FROM wins WHERE name = ?", (character.name,))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("UPDATE wins SET count = count + 1 WHERE name = ?", (character.name,))
        else:
            cursor.execute("INSERT INTO wins (name, count, img_url) VALUES (?, ?, ?)",
                           (character.name, character.wins, character.img_url))

        db.commit()
        return {"message": "Character saved successfully!"}

    except sqlite3.Error as e:
        db.rollback()
        print(f"SQLite error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.get("/ranking/")
async def get_ranking():
    try:
        cursor.execute("SELECT name, count, img_url FROM wins ORDER BY count DESC")
        ranking_data = [{"name": row[0], "wins": row[1], "image": row[2]} for row in cursor.fetchall()]
        
        return ranking_data

    except sqlite3.Error as e:
        print(f"SQLite error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
