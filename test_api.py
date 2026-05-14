import requests
import json

resp = requests.get('http://localhost:8000/api/products')
if resp.status_code == 200:
    products = resp.json()
    print(f'Total Products: {len(products)}')
    if products:
        print(f'First product has image_url: {"image_url" in products[0]}')
        print(json.dumps(products[0], indent=2))
else:
    print(f'Error: {resp.status_code}')
