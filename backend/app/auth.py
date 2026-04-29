from fastapi import APIRouter
from database import connection
from models import UserSignup, UserLogin

router = APIRouter()

# Signup
@router.post("/signup")
def signup(user: UserSignup):
    cursor = connection.cursor()

    query = """
    INSERT INTO users (name, phone, password, guardian_name, guardian_phone)
    VALUES (%s,%s,%s,%s,%s)
    """

    cursor.execute(query, (
        user.name,
        user.phone,
        user.password,
        user.guardian_name,
        user.guardian_phone
    ))

    connection.commit()

    return {"message": "User Registered Successfully"}


# Login
@router.post("/login")
def login(user: UserLogin):
    cursor = connection.cursor()

    query = "SELECT * FROM users WHERE phone=%s AND password=%s"
    cursor.execute(query, (user.phone, user.password))

    data = cursor.fetchone()

    if data:
        return {"success": True, "user": data}
    else:
        return {"success": False, "message": "Invalid Credentials"}