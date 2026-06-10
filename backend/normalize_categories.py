#!/usr/bin/env python3
"""Backfill normalized category columns for existing product records."""

from main import SessionLocal, Product, normalize_category_path, ensure_product_columns


def normalize_existing_products(batch_size=100):
    ensure_product_columns()
    db = SessionLocal()
    try:
        total = db.query(Product).count()
        print(f"Found {total} products to normalize.")
        updated = 0
        for index, product in enumerate(db.query(Product).yield_per(batch_size), start=1):
            main_cat, sub_cat, sub_sub_cat = normalize_category_path(product.category)
            changed = False
            if product.category != main_cat:
                product.category = main_cat
                changed = True
            if product.subcategory != sub_cat:
                product.subcategory = sub_cat
                changed = True
            if product.sub_subcategory != sub_sub_cat:
                product.sub_subcategory = sub_sub_cat
                changed = True
            if changed:
                updated += 1
            if index % batch_size == 0:
                db.commit()
                print(f"Normalized {index} products, updated {updated} so far...")
        db.commit()
        print(f"Normalization complete. Products processed: {total}. Updated: {updated}.")
    finally:
        db.close()


if __name__ == '__main__':
    normalize_existing_products()
