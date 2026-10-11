# Baut die HTML-Seiten von RivetTrail auf Deutsch (site/) und Englisch (site/en/)
# aus gemeinsamen Teilen (Kopf, Fuß) mit Sprachtexten (T) und je einem Seiteninhalt pro Sprache.
# Deutsche Inhalte: *.body.html, englische Inhalte: en/*.body.html.
import pathlib, posixpath, sys

HERE = pathlib.Path(__file__).parent
SITE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (HERE / "../../site").resolve()
BASE = "https://rivettrail.de/"

LOGO_R = (HERE / "logo-r.txt").read_text().strip()
LOGO_WORD = (HERE / "logo-word.txt").read_text().strip()
GEARS = dict(l.split(" ", 1) for l in (HERE / "gears-hero.txt").read_text().splitlines())
GEAR_ONE = (HERE / "gear-one.txt").read_text().strip()

INLINE_JS = 'document.documentElement.classList.add("js")'

# ---------- Sprachtexte für Kopf, Fuß und Metadaten ----------
T = {
    "de": dict(
        html_lang="de", og_locale="de_DE", og_alt_locale="en_GB",
        og_image="assets/og-image.png",
        og_title="RivetTrail · Das Wissen über Ihre Maschinen. Verknüpft und sofort da.",
        og_desc=("RivetTrail verbindet Anlagen, Teile, Dokumente, Störungen und Ansprechpartner zu einer Wissensbasis, "
                 "gespeist aus ERP, MES, Excel und Handbüchern. Jede Antwort mit Quelle."),
        og_img_alt=("RivetTrail. Das Wissen über Ihre Maschinen. Verknüpft und sofort da. Daneben ein Wissensnetz: "
                    "die Anlage CNC-003, verbunden mit einem Teil, einem Handbuch, der letzten Störung, einem Ansprechpartner "
                    "und den Anlagen CNC-004 und CNC-007."),
        skip="Zum Inhalt springen", main_id="inhalt",
        nav_label="Hauptnavigation", menu="Menü",
        nav=[("fragen", "Wissensbasis"), ("ablauf", "Einrichtung")], cta=("kontakt", "Pilotgespräch anfragen"),
        lang_label="Sprache",
        claim="RivetTrail ergänzt ERP, MES und Instandhaltungssoftware. Ersetzt keines davon.",
        pdf="downloads/RivetTrail_Onepager.pdf", pdf_name="RivetTrail_Onepager.pdf", pdf_link="Onepager (PDF)",
        legal="Impressum", privacy="Datenschutz",
    ),
    "en": dict(
        html_lang="en-GB", og_locale="en_GB", og_alt_locale="de_DE",
        og_image="assets/og-image-en.png",
        og_title="RivetTrail · Your machine knowledge. Connected and on hand.",
        og_desc=("RivetTrail links machines, parts, documents, faults and contacts in one knowledge base, "
                 "fed from ERP, MES, Excel and manuals. Every answer with its source."),
        og_img_alt=("RivetTrail. Your machine knowledge. Connected and on hand. Alongside it, a knowledge network: "
                    "machine CNC-003, linked to a part, a manual, the last fault, a contact "
                    "and machines CNC-004 and CNC-007."),
        skip="Skip to content", main_id="content",
        nav_label="Main navigation", menu="Menu",
        nav=[("questions", "Knowledge base"), ("setup", "Setup")], cta=("contact", "Request a pilot call"),
        lang_label="Language",
        claim="RivetTrail complements ERP, MES and maintenance software. It replaces none of them.",
        pdf="downloads/RivetTrail_Onepager_EN.pdf", pdf_name="RivetTrail_One-pager_EN.pdf", pdf_link="One-pager (PDF)",
        legal="Legal notice", privacy="Privacy policy",
    ),
}
LANG_NAMES = {"de": ("DE", "Deutsch"), "en": ("EN", "English")}

# ---------- Seitenpaare ----------
# path: Datei relativ zu site/; addr: Adresse, unter der Cloudflare Pages die Seite ausliefert (ohne .html,
# Startseiten mit Schrägstrich); url: kanonische Adresse (None = keine, 404-Seiten).
PAIRS = {
    "index":   {"de": dict(path="index.html", addr="", url=""),
                "en": dict(path="en/index.html", addr="en/", url="en/")},
    "legal":   {"de": dict(path="impressum.html", addr="impressum", url="impressum"),
                "en": dict(path="en/legal-notice.html", addr="en/legal-notice", url="en/legal-notice")},
    "privacy": {"de": dict(path="datenschutz.html", addr="datenschutz", url="datenschutz"),
                "en": dict(path="en/privacy.html", addr="en/privacy", url="en/privacy")},
    "404":     {"de": dict(path="404.html", addr="404", url=None),
                "en": dict(path="en/404.html", addr="en/404", url=None)},
}

PAGES = [
    dict(kind="index", lang="de", body="index.body.html",
         title=T["de"]["og_title"], desc=T["de"]["og_desc"]),
    dict(kind="legal", lang="de", body="impressum.body.html",
         title="Impressum · RivetTrail", desc="Impressum von RivetTrail, Angaben nach § 5 DDG."),
    dict(kind="privacy", lang="de", body="datenschutz.body.html",
         title="Datenschutz · RivetTrail",
         desc="Datenschutzerklärung von RivetTrail. Keine Cookies, kein Tracking, keine externen Dienste."),
    dict(kind="404", lang="de", body="404.body.html", noindex=True,
         title="Seite nicht gefunden · RivetTrail", desc="Diese Seite gibt es auf rivettrail.de nicht."),
    dict(kind="index", lang="en", body="en/index.body.html",
         title=T["en"]["og_title"], desc=T["en"]["og_desc"]),
    dict(kind="legal", lang="en", body="en/legal-notice.body.html",
         title="Legal notice · RivetTrail", desc="Legal notice for RivetTrail, information under Section 5 DDG."),
    dict(kind="privacy", lang="en", body="en/privacy.body.html",
         title="Privacy policy · RivetTrail",
         desc="Privacy policy of RivetTrail. No cookies, no tracking, no external services."),
    dict(kind="404", lang="en", body="en/404.body.html", noindex=True,
         title="Page not found · RivetTrail", desc="This page does not exist on rivettrail.de."),
]


def rel(from_addr, to_addr):
    """Relativer Link zwischen zwei Adressen (relativ zur Domain, z. B. "en/legal-notice" -> "impressum")."""
    from_dir = from_addr.rsplit("/", 1)[0] if "/" in from_addr else "."
    is_dir = to_addr == "" or to_addr.endswith("/")
    target = (to_addr.rstrip("/") or ".") if is_dir else to_addr
    out = posixpath.relpath(target, from_dir or ".")
    if is_dir:
        out = "./" if out == "." else out + "/"
    return out


def links_for(p):
    """Pfade dieser Seite: root (gemeinsame Dateien), Seiten derselben Sprache, Gegenstück der anderen Sprache.
    Die 404-Seiten werden an beliebigen Adressen ausgeliefert und nutzen deshalb Stammpfade."""
    here = PAIRS[p["kind"]][p["lang"]]["addr"]
    f = (lambda t: "/" + t) if p["kind"] == "404" else (lambda t: rel(here, t))
    lg = p["lang"]
    a = lambda kind, l=lg: f(PAIRS[kind][l]["addr"])
    return dict(
        root="/" if p["kind"] == "404" else "../" * here.count("/"),
        home=a("index"),
        anchor="" if p["kind"] == "index" else a("index"),
        legal=a("legal"),
        privacy=a("privacy"),
        alt={l: a(p["kind"], l) for l in ("de", "en")},
    )


def logo(cls):
    return (f'<svg class="logo {cls}" viewBox="0 0 138 32" width="138" height="32" role="img" aria-label="RivetTrail">'
            f'<rect class="logo-sq" width="32" height="32" rx="7"/>{LOGO_R}'
            f'<circle class="logo-dot" cx="23.5" cy="21" r="2.4"/>{LOGO_WORD}</svg>')


def head(p, L):
    t = T[p["lang"]]
    r = L["root"]
    urls = {l: PAIRS[p["kind"]][l]["url"] for l in ("de", "en")}
    canon_url = urls[p["lang"]]
    canon = alts = og = robots = ""
    if canon_url is not None:
        canon = f'<link rel="canonical" href="{BASE}{canon_url}">\n'
        alts = (f'<link rel="alternate" hreflang="de" href="{BASE}{urls["de"]}">\n'
                f'<link rel="alternate" hreflang="en" href="{BASE}{urls["en"]}">\n'
                f'<link rel="alternate" hreflang="x-default" href="{BASE}{urls["de"]}">\n')
        og = f"""<meta property="og:type" content="website">
<meta property="og:locale" content="{t["og_locale"]}">
<meta property="og:locale:alternate" content="{t["og_alt_locale"]}">
<meta property="og:site_name" content="RivetTrail">
<meta property="og:title" content="{p["title"]}">
<meta property="og:description" content="{p["desc"]}">
<meta property="og:url" content="{BASE}{canon_url}">
<meta property="og:image" content="{BASE}{t["og_image"]}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{t["og_img_alt"]}">
<meta name="twitter:card" content="summary_large_image">
"""
    if p.get("noindex"):
        robots = '<meta name="robots" content="noindex">\n'
    return f"""<!doctype html>
<html lang="{t["html_lang"]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]}</title>
<meta name="description" content="{p["desc"]}">
{robots}{canon}{alts}<script>{INLINE_JS}</script>
<link rel="preload" href="{r}fonts/barlow-condensed-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{r}fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{r}css/style.css">
<link rel="icon" href="{r}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{r}assets/apple-touch-icon.png">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#101317">
{og}<script src="{r}js/main.js" defer></script>
</head>
"""


def lang_switch(p, L):
    t = T[p["lang"]]
    items = []
    for l in ("de", "en"):
        short, name = LANG_NAMES[l]
        cur = ' aria-current="page"' if l == p["lang"] else ""
        items.append(f'<li><a class="lang-link" href="{L["alt"][l]}" hreflang="{l}" lang="{l}" aria-label="{name}"{cur}>{short}</a></li>')
    return (f'<li class="nav-lang"><ul class="lang-switch" role="list" aria-label="{t["lang_label"]}">'
            + "".join(items) + "</ul></li>")


def header(p, L):
    t = T[p["lang"]]
    a = L["anchor"]
    nav = "\n".join(f'        <li><a class="nav-link" href="{a}#{i}">{label}</a></li>' for i, label in t["nav"])
    return f"""<body>
<a class="skip" href="#{t["main_id"]}">{t["skip"]}</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="{L["home"]}">{logo("logo-header")}</a>
    <nav class="nav" aria-label="{t["nav_label"]}">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list"><svg class="nav-toggle-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M3 6h14M3 10h14M3 14h14"/></svg><span>{t["menu"]}</span></button>
      <ul class="nav-list" id="nav-list" role="list">
{nav}
        <li class="nav-cta"><a class="btn btn-primary" href="{a}#{t["cta"][0]}">{t["cta"][1]}</a></li>
        {lang_switch(p, L)}
      </ul>
    </nav>
  </div>
</header>
"""


def footer(p, L):
    t = T[p["lang"]]
    r = L["root"]
    return f"""
<footer class="site-footer">
  <div class="wrap footer-inner">
    <div class="footer-top">
      <a class="brand" href="{L["home"]}">{logo("logo-footer")}</a>
      <p class="footer-claim">{t["claim"]}</p>
      <ul class="footer-links" role="list">
        <li><a href="{r}{t["pdf"]}" download="{t["pdf_name"]}">{t["pdf_link"]}</a></li>
        <li><a href="mailto:kontakt@rivettrail.de">kontakt@rivettrail.de</a></li>
      </ul>
    </div>
    <div class="footer-bottom">
      <p>© 2026 RivetTrail</p>
      <ul class="footer-links" role="list">
        <li><a href="{L["legal"]}">{t["legal"]}</a></li>
        <li><a href="{L["privacy"]}">{t["privacy"]}</a></li>
      </ul>
    </div>
  </div>
</footer>
</body>
</html>
"""


for p in PAGES:
    L = links_for(p)
    body = (HERE / p["body"]).read_text()
    body = (body.replace("{{GEAR_BIG}}", GEARS["BIG"]).replace("{{GEAR_SMALL}}", GEARS["SMALL"])
                .replace("{{GEAR_ONE}}", GEAR_ONE).replace("{{ROOT}}", L["root"])
                .replace("{{HOME}}", L["home"]))
    html = head(p, L) + header(p, L) + body.rstrip() + "\n" + footer(p, L)
    bad_list = ["Akte", "—", " – ", 'style="', "{{"]
    if p["lang"] == "en":
        bad_list += ["–"]
    for bad in bad_list:
        if bad in html:
            sys.exit(f"{p['lang']}/{p['body']}: verbotenes Muster {bad!r}")
    out = SITE / PAIRS[p["kind"]][p["lang"]]["path"]
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print("geschrieben", out.relative_to(SITE), len(html))


# ---------- Cloudflare Pages: Header, Sitemap, robots.txt ----------
# .htaccess wertet Pages nicht aus; Header stehen in _headers. Referrer-Policy und nosniff setzt Pages selbst,
# Caching ebenfalls (deshalb kein eigenes Cache-Control).
import base64, hashlib
SCRIPT_HASH = base64.b64encode(hashlib.sha256(INLINE_JS.encode()).digest()).decode()
CSP = ("default-src 'self'; img-src 'self' data:; style-src 'self'; "
       f"script-src 'self' 'sha256-{SCRIPT_HASH}'; font-src 'self'; base-uri 'self'; "
       "form-action 'none'; frame-ancestors 'none'")
HEADERS = f"""# Cloudflare Pages: Header für alle Antworten (erzeugt von build.py)
# Der sha256-Wert erlaubt das einzige Inline-Skript im <head>: {INLINE_JS}
/*
  Content-Security-Policy: {CSP}
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000
  Cross-Origin-Opener-Policy: same-origin
  ! Access-Control-Allow-Origin
"""
(SITE / "_headers").write_text(HEADERS)

sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for kind in ("index", "legal", "privacy"):
    de, en = PAIRS[kind]["de"]["url"], PAIRS[kind]["en"]["url"]
    for loc in (de, en):
        sm += ["  <url>", f"    <loc>{BASE}{loc}</loc>", "    <lastmod>2026-10-11</lastmod>",
               f'    <xhtml:link rel="alternate" hreflang="de" href="{BASE}{de}"/>',
               f'    <xhtml:link rel="alternate" hreflang="en" href="{BASE}{en}"/>',
               f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE}{de}"/>', "  </url>"]
sm.append("</urlset>")
(SITE / "sitemap.xml").write_text("\n".join(sm) + "\n")
(SITE / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n")
for old in ("_headers", "sitemap.xml", "robots.txt"):
    print("geschrieben", old)
for ht in (SITE / ".htaccess", SITE / "en" / ".htaccess"):
    if ht.exists():
        sys.exit(f"{ht} ist in Cloudflare Pages wirkungslos und soll nicht im Ausgabeverzeichnis liegen")
