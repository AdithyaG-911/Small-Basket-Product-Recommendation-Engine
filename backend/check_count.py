from main import SessionLocal, Product
db = SessionLocal()
count = db.query(Product).count()
print(f"Total products in DB: {count}")
db.close()
