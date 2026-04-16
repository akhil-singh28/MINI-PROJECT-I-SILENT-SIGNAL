from fastapi import FastAPI
from pydantic import BaseModel
import pymysql

app = FastAPI()

# DB Connection
connection = pymysql.connect(
    host="localhost",
    user="root",
    password="___________________________________",          
    
    #write MySQL password
    database="emergency_db"
)

class Alert(BaseModel):
    user_id: int
    location: str

@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}

@app.post("/send-alert")
def send_alert(alert: Alert):
    print(" ALERT RECEIVED ")

    cursor = connection.cursor()

    query = "INSERT INTO emergency_alerts (user_id, location) VALUES (%s, %s)"
    cursor.execute(query, (alert.user_id, alert.location))

    connection.commit()

    return {"message": "Alert saved in database"}
