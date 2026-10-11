#!/usr/bin/env python3
"""Lokaler Testserver, der Cloudflare Pages für eine statische Seite nachbildet.

Aufruf: python3 serve.py [port] [site-dir]   (Standard: Port 8800, Verzeichnis ./site)

Nachgebildet:
- /x liefert x.html, /dir/ liefert dir/index.html, /dir ohne Schrägstrich -> 308 auf /dir/
- /x.html -> 308 /x, /dir/index.html -> 308 /dir/ (Query bleibt erhalten)
- unbekannte Pfade: nächstgelegene 404.html im Verzeichnisbaum, Status 404
- Header aus _headers (Pfadmuster mit * als Platzhalter, "! Name" entfernt einen Header,
  mehrfach gesetzte Header werden mit ", " verbunden), dazu die Pages-Standardheader
- Cache-Control: no-store (nur lokal, damit Änderungen sofort sichtbar sind)
"""
import http.server, mimetypes, os, posixpath, re, sys, urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8800
ROOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "site")

mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/javascript", ".js")

PAGES_DEFAULTS = [
    ("Access-Control-Allow-Origin", "*"),
    ("Referrer-Policy", "strict-origin-when-cross-origin"),
    ("X-Content-Type-Options", "nosniff"),
]


def parse_headers_file():
    """Liest _headers: Liste von (regex, [(name, wert) | ("!", name)])."""
    rules, cur = [], None
    path = os.path.join(ROOT, "_headers")
    if not os.path.exists(path):
        return rules
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            pat = "^" + re.escape(line.strip()).replace(r"\*", ".*") + "$"
            cur = (re.compile(pat), [])
            rules.append(cur)
        elif cur is not None:
            item = line.strip()
            if item.startswith("!"):
                cur[1].append(("!", item[1:].strip()))
            else:
                name, _, value = item.partition(":")
                cur[1].append((name.strip(), value.strip()))
    return rules


def headers_for(url_path):
    hdrs = {}  # Kleinschreibung -> (Name, Wert)
    for name, value in PAGES_DEFAULTS:
        hdrs[name.lower()] = (name, value)
    added = {}
    for rx, items in parse_headers_file():
        if not rx.match(url_path):
            continue
        for a, b in items:
            if a == "!":
                hdrs.pop(b.lower(), None)
            else:
                key = a.lower()
                if key in added:
                    hdrs[key] = (a, hdrs[key][1] + ", " + b)
                else:
                    hdrs[key] = (a, b)
                    added[key] = True
    return list(hdrs.values())


class Handler(http.server.BaseHTTPRequestHandler):
    server_version = "PagesLike/1.0"

    def log_message(self, *a):
        pass

    def send(self, status, body=b"", ctype=None, extra=()):
        url_path = urllib.parse.urlsplit(self.path).path
        self.send_response(status)
        if ctype:
            self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for n, v in list(extra) + headers_for(url_path):
            self.send_header(n, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def file(self, rel):
        full = os.path.normpath(os.path.join(ROOT, rel))
        if not full.startswith(ROOT) or not os.path.isfile(full):
            return None
        return full

    def serve_file(self, full, status=200):
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "image/svg+xml", "application/xml"):
            ctype += "; charset=utf-8"
        with open(full, "rb") as fh:
            self.send(status, fh.read(), ctype)

    def not_found(self, path):
        d = posixpath.dirname(path)
        while True:
            f = self.file(posixpath.join(d.lstrip("/"), "404.html"))
            if f:
                return self.serve_file(f, 404)
            if d in ("", "/"):
                break
            d = posixpath.dirname(d.rstrip("/"))
        self.send(404, b"Not found", "text/plain; charset=utf-8")

    def redirect(self, loc, query):
        if query:
            loc += "?" + query
        self.send(308, b"", None, [("Location", loc)])

    def do_GET(self):
        parts = urllib.parse.urlsplit(self.path)
        path = urllib.parse.unquote(parts.path) or "/"
        if path.endswith("/index.html"):
            return self.redirect(path[: -len("index.html")], parts.query)
        if path.endswith(".html"):
            return self.redirect(path[: -len(".html")], parts.query)
        rel = path.lstrip("/")
        if path.endswith("/"):
            f = self.file(posixpath.join(rel, "index.html"))
            return self.serve_file(f) if f else self.not_found(path)
        if os.path.basename(rel) in ("_headers", "_redirects"):
            return self.not_found(path)
        f = self.file(rel)
        if f and not f.endswith(".html"):
            return self.serve_file(f)
        f = self.file(rel + ".html")
        if f:
            return self.serve_file(f)
        if self.file(posixpath.join(rel, "index.html")):
            return self.redirect(path + "/", parts.query)
        return self.not_found(path)

    do_HEAD = do_GET


if __name__ == "__main__":
    print(f"Pages-ähnlicher Server: http://127.0.0.1:{PORT}/  ({ROOT})")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
