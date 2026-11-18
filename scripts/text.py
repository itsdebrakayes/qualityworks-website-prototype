# Audit helper: print visible body text of a saved page. Usage: python3 -I scripts/text.py <file.html> [maxchars]
#
# WHAT: quick reading aid for the audit. Prints the visible text of one saved HTML page (scripts,
#   styles, SVG, header, footer and nav removed), one line per text block, so page copy can be read
#   or copied without markup.
#
# ARGUMENTS: <file.html> the saved page; [maxchars] optional output limit (default 8000 characters).
# OUTPUT: stdout only; writes nothing.
# REQUIRES: Python 3 with BeautifulSoup (bs4); run with -I as in the usage line.
import sys,re
from bs4 import BeautifulSoup
s=BeautifulSoup(open(sys.argv[1],encoding='utf-8',errors='ignore').read(),'html.parser')
for t in s(['script','style','noscript','svg']): t.decompose()
for sel in ['footer','header','nav','.fl-page-header','[data-type=header]','[data-type=footer]']:
  for t in s.select(sel): t.decompose()
txt=s.body.get_text('\n',strip=True)
# Drop a line when it repeats the line directly before it (keeps the output short and readable).
lines=[]; 
for l in txt.split('\n'):
  if not lines or lines[-1]!=l: lines.append(l)
print('\n'.join(lines)[:int(sys.argv[2]) if len(sys.argv)>2 else 8000])
