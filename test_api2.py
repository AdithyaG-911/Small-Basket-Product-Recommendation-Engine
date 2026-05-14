import requests
import json

resp = requests.get('http://localhost:8000/api/products')
if resp.status_code == 200:
    products = resp.json()
    print(f'Total Products: {len(products)}')
    # Find products with image URLs
    products_with_urls = [p for p in products if p.get('image_url')]
    print(f'Products with image URLs: {len(products_with_urls)}')
    if products_with_urls:
        print("\nFirst 5 products with image URLs:")
        for p in products_with_urls[:5]:
            print(f"  {p['name']}: {p['image_url']}")
else:
    print(f'Error: {resp.status_code}')
