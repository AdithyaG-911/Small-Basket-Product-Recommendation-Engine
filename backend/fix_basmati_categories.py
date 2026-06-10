#!/usr/bin/env python3
"""
Scan backend/models/final_dataset.csv for products mentioning 'basmati'
and move likely raw rice items into the 'foodgrains oil & masala' category
while leaving obvious ready-meals/biryani/pulao entries untouched.

Outputs:
- backend/models/final_dataset_fixed.csv (updated file)
- backend/models/basmati_fix_log.txt (summary of changes and samples)

This is a conservative, heuristic-based script — review `basmati_fix_log.txt`.
"""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
IN_CSV = ROOT / 'models' / 'final_dataset.csv'
OUT_CSV = ROOT / 'models' / 'final_dataset_fixed.csv'
LOG = ROOT / 'models' / 'basmati_fix_log.txt'

if not IN_CSV.exists():
    print(f"Input CSV not found: {IN_CSV}")
    raise SystemExit(1)

keywords_basmati = re.compile(r'\bbasmati\b', re.IGNORECASE)
keywords_ready = re.compile(r'ready to eat|ready\s?meal|heat & eat|ready meals|ready-to-eat|ready meal|rtc|ready|pulao|biryani|dum biryani|instant', re.IGNORECASE)

# canonical target for raw rice
TARGET_MAIN = 'foodgrains oil & masala'
TARGET_SUB = 'Rice & Rice Products'

changed = []
total = 0
with IN_CSV.open(newline='', encoding='utf-8') as inp, OUT_CSV.open('w', newline='', encoding='utf-8') as out:
    reader = csv.reader(inp)
    writer = csv.writer(out)
    for row in reader:
        total += 1
        if len(row) < 6:
            writer.writerow(row)
            continue
        main_cat = row[0].strip() if row[0] else ''
        sub_cat = row[1].strip() if len(row) > 1 and row[1] else ''
        name = row[5].strip() if len(row) > 5 and row[5] else ''
        desc = ''
        # attempt to get a description-like field (often after index 6 or 7)
        if len(row) > 8:
            desc = ' '.join(row[8:12])

        if keywords_basmati.search(name) or keywords_basmati.search(desc):
            # If name/desc contains basmati and NOT obviously a ready meal / biryani / pulao
            if not keywords_ready.search(name) and not keywords_ready.search(desc):
                # Only change if current main_cat is not already the target
                if main_cat.lower() != TARGET_MAIN:
                    orig = (main_cat, sub_cat)
                    row[0] = TARGET_MAIN
                    # ensure subcategory exists
                    if len(row) > 1:
                        row[1] = TARGET_SUB
                    changed.append((total, name, orig, (row[0], row[1])))
        writer.writerow(row)

with LOG.open('w', encoding='utf-8') as f:
    f.write(f"Scanned rows: {total}\n")
    f.write(f"Updated rows: {len(changed)}\n\n")
    if changed:
        f.write('Sample updates (first 40):\n')
        for i, (rownum, name, orig, new) in enumerate(changed[:40], start=1):
            f.write(f"{i}. row {rownum}: '{name}'\n   from: {orig}\n   to:   {new}\n")

print(f"Done. Scanned {total} rows, updated {len(changed)} rows.")
print(f"Output written to: {OUT_CSV}")
print(f"Log written to: {LOG}")
