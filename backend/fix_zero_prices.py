import sqlite3
import random

def fix_prices():
    conn = sqlite3.connect('backend/ecommerce.db')
    cursor = conn.cursor()
    
    # Get all products with price 0
    cursor.execute("SELECT id, category FROM products WHERE price = 0")
    products = cursor.fetchall()
    
    print(f"Found {len(products)} products with price 0. Fixing...")
    
    # Categories and their typical price ranges
    price_ranges = {
        'beauty & hygiene': (50, 450),
        'snacks & branded foods': (20, 200),
        'cleaning & household': (40, 600),
        'beverages': (20, 300),
        'gourmet & world food': (100, 1200),
        'eggs meat  fish': (150, 800),
        'bakery cakes  dairy': (30, 250),
        'foodgrains oil  masala': (40, 500),
        'kitchen garden  pets': (50, 1000),
        'baby care': (100, 1500)
    }
    
    count = 0
    for pid, category in products:
        # Get range for category or use default
        cat_key = category.lower().strip()
        # Handle cases where category name in DB might be slightly different
        min_p, max_p = (40, 300) # default
        for key, r in price_ranges.items():
            if key in cat_key:
                min_p, max_p = r
                break
        
        new_price = random.randint(min_p, max_p)
        cursor.execute("UPDATE products SET price = ? WHERE id = ?", (float(new_price), pid))
        count += 1
        
        if count % 1000 == 0:
            conn.commit()
            print(f"Updated {count} products...")
            
    conn.commit()
    conn.close()
    print(f"Successfully fixed {count} product prices!")

if __name__ == "__main__":
    fix_prices()
