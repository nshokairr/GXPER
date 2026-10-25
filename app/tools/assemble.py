"""
Build the single-file prototype: inlines source/app.css, source/screens.json and
source/app.js into source/template.html and writes prototype/index.html.

Run from anywhere:  python3 app/tools/assemble.py
"""
import os

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = lambda f: open(os.path.join(APP, 'source', f), encoding='utf-8').read()

html = (src('template.html')
        .replace('/*CSS*/', src('app.css'))
        .replace('/*DATA*/', src('screens.json'))
        .replace('/*JS*/', src('app.js')))
out = os.path.join(APP, 'prototype', 'index.html')
open(out, 'w', encoding='utf-8').write(html)
print(f'wrote {out} ({len(html) // 1000} KB)')
