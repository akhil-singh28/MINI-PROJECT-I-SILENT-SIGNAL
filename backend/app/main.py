from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AlertData(BaseModel):
    user_id: int
    location: str
history = []
@app.get("/")
def home():
    return {"message": "Backend Running"}
@app.post("/send-alert")
def send_alert(data: AlertData):
    history.append({
        "user_id": data.user_id,
        "location": data.location
    })
    return {
        "success": True,
        "message": "Alert Stored"
    }
@app.get("/history")
def get_history():
    return history
