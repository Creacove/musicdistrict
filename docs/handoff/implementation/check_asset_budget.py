#!/usr/bin/env python3
"""Static budget lint for THE SCENE runtime assets.
Usage: python scripts/check_asset_budget.py /path/to/app/dist
This checks file sizes under a runtime directory, not screenshots in references/.
It is deliberately best-effort: only a real browser Network panel knows what transfers.
"""
from pathlib import Path
import sys, gzip, json

root=Path(sys.argv[1]) if len(sys.argv)>1 else None
if root is None or not root.exists():
 print('Usage: python scripts/check_asset_budget.py /path/to/runtime/assets'); raise SystemExit(2)
files=[f for f in root.rglob('*') if f.is_file()]
fs=sorted([(f.stat().st_size, f) for f in files],reverse=True)
print(f'{len(fs)} files, {sum(s for s,_ in fs)/1048576:.2f} MiB uncompressed on disk')
for n,f in fs[:25]: print(f'{n/1024:8.0f} KiB  {f.relative_to(root)}')
large=[(n,f) for n,f in fs if f.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.avif','.ktx2','.glb','.gltf','.mp3','.m4a','.mp4','.woff2'} and n>800_000]
if large:
 print('\nREVIEW: large individually loadable assets:')
 for n,f in large[:30]:print(f' {f.relative_to(root)}: {n/1024:.0f} KiB')
js=[(n,f) for n,f in fs if f.suffix.lower() in {'.js','.css'}]
print(f'JS+CSS (uncompressed total): {sum(n for n,_ in js)/1024:.0f} KiB; does not equal actual initial transfer.')
print('\nNEXT: verify actual initial-request waterfall and full route downloads on iPhone Safari and entry Android Chrome. An asset repository can be huge yet a user should only fetch one room and one chosen song.')
