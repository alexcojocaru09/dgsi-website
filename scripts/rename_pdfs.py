#!/usr/bin/env python3
"""
rename_pdfs.py — DGSI Welding drawings pipeline
Redenumeste PDF-urile din public/welding-docs/ din <ref>.pdf in <sku>.pdf,
citind maparea din src/data/weldingProducts.json.

Usage:
    python scripts/rename_pdfs.py                  # dry-run: arata ce s-ar face
    python scripts/rename_pdfs.py --apply          # aplica redenumirea
    python scripts/rename_pdfs.py --apply --copy   # copiaza in loc de rename (pastreaza originale)

Cand un ref e folosit pentru mai multe SKU-uri (duplicate cataloguri),
copiaza PDF-ul cu toate SKU-urile relevante.
Genereaza un raport in scripts/rename_report.txt.
"""
import sys, json, shutil
from pathlib import Path
from collections import defaultdict

JSON_PATH = Path('src/data/weldingProducts.json')
PDF_DIR   = Path('public/welding-docs')
REPORT    = Path('scripts/rename_report.txt')

def main():
    apply = '--apply' in sys.argv
    use_copy = '--copy' in sys.argv

    if not JSON_PATH.exists():
        sys.exit(f'ERROR: nu gasesc {JSON_PATH}. Ruleaza intai `npm run catalog`.')
    if not PDF_DIR.exists():
        sys.exit(f'ERROR: nu gasesc {PDF_DIR}.')

    products = json.loads(JSON_PATH.read_text(encoding='utf-8'))

    # ref -> [sku1, sku2, ...]  (un ref poate corespunde mai multor SKU-uri)
    ref_to_skus = defaultdict(list)
    # aliases -> sku (backup: daca clientul foloseste alias intr-un fisier)
    alias_to_skus = defaultdict(list)
    for p in products:
        if p.get('ref'):
            ref_to_skus[p['ref']].append(p['sku'])
        for a in p.get('aliases', []) or []:
            alias_to_skus[a].append(p['sku'])

    existing_pdfs = {f.stem: f for f in PDF_DIR.glob('*.pdf')}
    existing_stems = set(existing_pdfs.keys())
    existing_skus = {p['sku'] for p in products}

    plan = []       # (source_pdf, target_sku)
    unmatched_pdfs  = []  # PDF-uri fara mapare
    missing_skus    = []  # SKU-uri fara PDF sursa
    already_named   = []  # PDF-uri deja denumite cu SKU

    # PDF-uri deja denumite cu SKU
    for stem in existing_stems:
        if stem in existing_skus:
            already_named.append(stem)

    # Mapare PDF sursa -> SKU-uri tinta
    for stem, path in existing_pdfs.items():
        if stem in existing_skus:
            continue  # deja SKU
        skus = ref_to_skus.get(stem) or alias_to_skus.get(stem)
        if skus:
            for sku in skus:
                plan.append((path, sku))
        else:
            unmatched_pdfs.append(stem)

    # SKU-uri fara PDF sursa
    covered_skus = {sku for _, sku in plan} | set(already_named)
    for p in products:
        if p['sku'] not in covered_skus:
            missing_skus.append((p['sku'], p.get('ref') or '-'))

    # ─── Raport ──────────────────────────────────────────────────────────
    lines = []
    lines.append(f"DGSI PDF rename plan")
    lines.append(f"  JSON:  {JSON_PATH}  ({len(products)} products)")
    lines.append(f"  PDFs:  {PDF_DIR}     ({len(existing_pdfs)} files)")
    lines.append(f"  Mode:  {'APPLY ' + ('copy' if use_copy else 'rename') if apply else 'DRY-RUN (no changes)'}")
    lines.append("")
    lines.append(f"[TO PROCESS]  {len(plan)} operations")
    for src, sku in plan:
        arrow = '=>' if not use_copy else '->'
        lines.append(f"  {src.name}  {arrow}  {sku}.pdf")
    lines.append("")
    lines.append(f"[ALREADY SKU-NAMED]  {len(already_named)}")
    for s in sorted(already_named): lines.append(f"  {s}.pdf")
    lines.append("")
    lines.append(f"[UNMATCHED PDFS — no mapping in JSON]  {len(unmatched_pdfs)}")
    for s in sorted(unmatched_pdfs): lines.append(f"  {s}.pdf")
    lines.append("")
    lines.append(f"[MISSING PDFS — SKU has no source drawing]  {len(missing_skus)}")
    for sku, ref in sorted(missing_skus):
        lines.append(f"  {sku}   (client ref: {ref})")

    report_text = '\n'.join(lines)
    print(report_text)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(report_text, encoding='utf-8')
    print(f"\nReport saved: {REPORT}")

    if not apply:
        print("\nDry-run finished. Add --apply to execute (add --copy to keep originals).")
        return

    # ─── Executare ───────────────────────────────────────────────────────
    done, failed = 0, 0
    for src, sku in plan:
        target = PDF_DIR / f'{sku}.pdf'
        if target.exists():
            continue  # nu suprascriem
        try:
            if use_copy:
                shutil.copy2(src, target)
            else:
                if len(ref_to_skus.get(src.stem, [])) > 1 or len(alias_to_skus.get(src.stem, [])) > 1:
                    # sursa are mai multe target-uri => trebuie copiat, nu redenumit
                    shutil.copy2(src, target)
                else:
                    src.rename(target)
            done += 1
        except Exception as e:
            print(f"FAILED: {src.name} -> {target.name}: {e}")
            failed += 1

    print(f"\nDone: {done} ok, {failed} failed.")

if __name__ == '__main__':
    main()
