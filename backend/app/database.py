import pymysql

connection = pymysql.connect(
    host="localhost",
    user="root",
    password="Akhil|2805",
    database="emergency_db",
    cursorclass=pymysql.cursors.DictCursor
)