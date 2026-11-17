# Audit helper: print visible body text of a saved page. Usage: python3 -I scripts/text.py <file.html> [maxchars]
import sys,re
from bs4 import BeautifulSoup
s=BeautifulSoup(open(sys.argv[1],encoding='utf-8',errors='ignore').read(),'html.parser')
for t in s(['script','style','noscript','svg']): t.decompose()
for sel in ['footer','header','nav','.fl-page-header','[data-type=header]','[data-type=footer]']:
  for t in s.select(sel): t.decompose()
txt=s.body.get_text('\n',strip=True)
lines=[]; 
for l in txt.split('\n'):
  if not lines or lines[-1]!=l: lines.append(l)
print('\n'.join(lines)[:int(sys.argv[2]) if len(sys.argv)>2 else 8000])
