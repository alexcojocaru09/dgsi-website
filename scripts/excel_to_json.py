#!/usr/bin/env python3
"""
excel_to_json.py — DGSI Welding catalog pipeline
Citeste Catalog_v3 din Welding_database.xlsx si genereaza src/data/weldingProducts.json

Usage:
    python scripts/excel_to_json.py [path/to/Welding_database.xlsx]

Default input:  ./Welding_database.xlsx (radacina proiectului)
Output:         ./src/data/weldingProducts.json
"""
import sys, json, math
from pathlib import Path

import pandas as pd

SHEET = 'Catalog_v3'

def clean(v):
    if v is None: return None
    if isinstance(v, float) and math.isnan(v): return None
    if isinstance(v, str):
        s = v.strip()
        return s if s else None
    return v

def to_num(v):
    v = clean(v)
    if v is None: return None
    try:
        f = float(v)
        return int(f) if f.is_integer() else round(f, 2)
    except (TypeError, ValueError):
        return None

def split_aliases(v):
    v = clean(v)
    if not v: return []
    parts = [p.strip() for p in str(v).replace(';', '/').split('/')]
    return [p for p in parts if p]

def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('Welding_database.xlsx')
    if not src.exists():
        sys.exit(f'ERROR: nu gasesc {src}')

    df = pd.read_excel(src, sheet_name=SHEET, dtype={'compat': str, 'Mx': str})

    products = []
    for _, r in df.iterrows():
        sku = clean(r['sku'])
        if not sku: continue
        products.append({
            'sku':      sku,
            'ref':      clean(r['referinta_client']),
            'aliases':  split_aliases(r['aliases']),
            'category': clean(r['categorie']),
            'name':     clean(r['denumire_comerciala']),
            'compat':   clean(r['compat']),
            'mx':       clean(r['Mx']),
            'dCorp':    to_num(r['d_corp_mm']),
            'dVarf':    to_num(r['d_varf_mm']),
            'L':        to_num(r['lungime_mm']),
            'mat':      clean(r['material']),
            'notes':    clean(r['observatii']),
        })

    out = Path('src/data/weldingProducts.json')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')

    # sanity report
    skus = [p['sku'] for p in products]
    dupes = {s for s in skus if skus.count(s) > 1}
    cats = {}
    for p in products: cats[p['category']] = cats.get(p['category'], 0) + 1
    print(f'OK: {len(products)} produse -> {out}')
    print(f'Categorii: {cats}')
    print(f'Duplicate SKU: {sorted(dupes) if dupes else "0"}')

if __name__ == '__main__':
    main()
