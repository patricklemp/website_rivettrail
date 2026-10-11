import re,sys,html
from html.parser import HTMLParser
def texts(path, sep_tags=()):
    class P(HTMLParser):
        def __init__(s): super().__init__(); s.buf=[]; s.out=[]; s.skip=0
        def handle_starttag(s,t,a):
            if t in('style','script'): s.skip+=1
            if t in ('p','h1','h2','h3','li','td','th','text','span','figcaption','a','strong','textarea','button','sup'): s.flush()
        def handle_endtag(s,t):
            if t in('style','script'): s.skip-=1
            s.flush()
        def handle_data(s,d):
            if not s.skip: s.buf.append(d)
        def flush(s):
            t=re.sub(r'\s+',' ',''.join(s.buf).replace('\xa0',' ')).strip(); s.buf=[]
            if t: s.out.append(t)
    p=P(); p.feed(open(path).read()); p.flush(); return p.out
site=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',open(sys.argv[2]).read())).replace('\xa0',' '))
site_l=site.lower()
for t in dict.fromkeys(texts(sys.argv[1])):
    if t.strip('.·,?') and t.lower() not in site_l: print('NOT ON SITE:', repr(t))
