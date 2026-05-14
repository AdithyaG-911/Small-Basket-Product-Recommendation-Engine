#!/usr/bin/env python3
"""
Seed database with products from CSV or generate synthetic products.
Run this before starting the app when you want fresh catalog data.
"""

import csv
import os
from main import SessionLocal, Product, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)


def get_image_url(category, product_name, index):
    """Generate fallback image URL based on category and product name with variety."""
    # Using Picsum Photos for varied, consistent product-like images
    image_ids = {
        'beauty & hygiene': [201, 202, 203, 204, 205, 206, 207, 208, 209, 210],
        'bath & hand wash': [211, 212, 213, 214, 215, 216, 217, 218, 219, 220],
        'cosmetics': [221, 222, 223, 224, 225, 226, 227, 228, 229, 230],
        'skincare': [231, 232, 233, 234, 235, 236, 237, 238, 239, 240],
        'haircare': [241, 242, 243, 244, 245, 246, 247, 248, 249, 250],
        'nutrition': [251, 252, 253, 254, 255, 256, 257, 258, 259, 260],
        'groceries': [261, 262, 263, 264, 265, 266, 267, 268, 269, 270],
        'fresh produce': [271, 272, 273, 274, 275, 276, 277, 278, 279, 280],
        'fruits': [281, 282, 283, 284, 285, 286, 287, 288, 289, 290],
        'electronics': [291, 292, 293, 294, 295, 296, 297, 298, 299, 300],
        'fashion': [301, 302, 303, 304, 305, 306, 307, 308, 309, 310],
        'home': [311, 312, 313, 314, 315, 316, 317, 318, 319, 320],
        'sports': [321, 322, 323, 324, 325, 326, 327, 328, 329, 330],
        'books': [331, 332, 333, 334, 335, 336, 337, 338, 339, 340],
        'toys': [341, 342, 343, 344, 345, 346, 347, 348, 349, 350],
        'food': [351, 352, 353, 354, 355, 356, 357, 358, 359, 360],
    }
    
    category_lower = category.lower()
    ids = image_ids.get(category_lower, [101, 102, 103, 104, 105])
    img_id = ids[index % len(ids)]
    return f"https://picsum.photos/400/300?random={img_id}"


def pick_csv_path(csv_file=None):
    preferred_files = [
        csv_file,
        'models/lastcleaned_data.csv',
        'models/final_dataset.csv',
    ]

    for candidate in preferred_files:
        if candidate and os.path.exists(candidate):
            return candidate
    return None


def seed_from_csv(csv_file=None, limit=50, replace=False):
    """Load products from CSV file with real image URLs and product links."""
    db = SessionLocal()

    try:
        csv_path = pick_csv_path(csv_file)
        if not csv_path:
            print('CSV file not found in expected locations.')
            print('Using synthetic data instead...')
            return seed_synthetic()

        if replace:
            deleted = db.query(Product).delete()
            db.commit()
            print(f'Cleared {deleted} existing products before reseeding.')

        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            count = 0

            for row in reader:
                if limit and count >= limit:
                    break

                try:
                    category = row.get('Category', 'General') or row.get('category', 'General')
                    sku_name = row.get('SKU Name', 'Product') or row.get('name', 'Product')
                    price = row.get('MRP', '100') or row.get('price', '100')
                    description = row.get('About the Product', '') or row.get('description', '')
                    image_url = row.get('Image Link') or row.get('image_url') or get_image_url(category, sku_name, count)
                    product_url = row.get('Product Link') or row.get('product_url')

                    parsed_price = float(price) if price else 100.0
                    if parsed_price <= 0:
                        parsed_price = 100.0  # Never allow zero or negative prices

                    product = Product(
                        name=sku_name[:200],
                        category=category[:100],
                        description=description[:500],
                        price=parsed_price,
                        image_url=image_url,
                        product_url=product_url,
                    )
                    db.add(product)
                    count += 1

                    if count % 10 == 0:
                        db.commit()
                        print(f'Loaded {count} products...')
                except Exception as error:
                    print(f'Skipping row: {error}')
                    continue

            db.commit()
            print(f"Loaded {count} products from {os.path.basename(csv_path)} with real media links")

    except Exception as error:
        print(f'Error loading CSV: {error}')
        db.rollback()
    finally:
        db.close()


def seed_synthetic(num_products=100):
    """Generate synthetic product data for testing with images."""
    db = SessionLocal()

    categories = ['beauty & hygiene', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Groceries', 'Toys']
    product_types = ['Premium', 'Professional', 'Ultra', 'Pro', 'Standard', 'Deluxe', 'Elite', 'Essential']

    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f'Database already has {existing} products, skipping seed')
            return

        for i in range(num_products):
            category = categories[i % len(categories)]
            product_type = product_types[i % len(product_types)]
            product_name = f"{product_type} {category.split()[0]} Item {i + 1}"
            image_url = get_image_url(category, product_name, i)

            product = Product(
                name=product_name,
                category=category,
                description=f'High quality {category.lower()} product with amazing features. Perfect for daily use. Best seller in its category.',
                price=float(50 + (i % 500)),
                image_url=image_url,
                product_url=None,
            )
            db.add(product)

            if (i + 1) % 50 == 0:
                db.commit()
                print(f'Created {i + 1} synthetic products with images...')

        db.commit()
        print(f'Successfully created {num_products} synthetic products with images')

    except Exception as error:
        print(f'Error creating synthetic data: {error}')
        db.rollback()
    finally:
        db.close()


if __name__ == '__main__':
    import sys

    print('Seeding database...')

    limit = None if '--all' in sys.argv else 2000
    replace = '--replace' in sys.argv

    if '--all' not in sys.argv:
        print('Loading first 2000 products for quick testing...')
        print('Use: python seed_data.py --all (to load the full catalog)')

    seed_from_csv(limit=limit, replace=replace)

    print('\nDatabase ready! Start the server with: python main.py')
