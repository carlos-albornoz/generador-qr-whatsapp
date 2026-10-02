#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar-idiomas.py — crea index.html (español) y en.html (inglés) con todo el
texto ya escrito en el HTML, a partir del diccionario de lib/i18n.js.

Solo hace falta ejecutarlo si cambias textos en lib/i18n.js o la estructura de
index.html. Usa únicamente Python 3 (sin instalar nada):

    python tools/generar-idiomas.py

index.html es a la vez la plantilla y la versión en español: el script lee sus
atributos data-i18n*, rellena los textos y escribe las dos páginas.
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
        "param", "source", "track", "wbr"}
PAGES = {"es": "index.html", "en": "en.html"}

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def load_dict():
    src = (ROOT / "lib" / "i18n.js").read_text(encoding="utf-8")
    m = re.search(r"/\*DICT-START\*/\s*var DICT = (.*?);\s*/\*DICT-END\*/", src, re.S)
    if not m:
        sys.exit("No encuentro el diccionario en lib/i18n.js")
    return json.loads(m.group(1))


def load_base():
    src = (ROOT / "lib" / "manifest.js").read_text(encoding="utf-8")
    m = re.search(r'B\.siteUrl\s*=\s*"([^"]*)"', src)
    return m.group(1) if m else ""


class Builder(HTMLParser):
    def __init__(self, lang, d, base):
        super().__init__(convert_charrefs=False)
        self.lang, self.d, self.base = lang, d, base
        self.out, self.skip, self.missing = [], 0, set()

    # --- utilidades ---
    def t(self, key):
        val = self.d[self.lang].get(key)
        if val is None:
            self.missing.add(key)
            val = self.d["es"].get(key, key)
        return val.replace("{base}", self.base)

    def jsonld(self, kind):
        t = self.t
        if kind == "app":
            obj = {"@context": "https://schema.org", "@type": "WebApplication",
                   "name": t("ld.appName"), "url": t("meta.canonical"),
                   "description": t("ld.appDesc"), "applicationCategory": "BusinessApplication",
                   "operatingSystem": t("ld.os"), "inLanguage": self.lang, "isAccessibleForFree": True,
                   "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}}
        else:
            items, i = [], 1
            while ("faq.q%d" % i) in self.d["es"]:
                items.append({"@type": "Question", "name": t("faq.q%d" % i),
                              "acceptedAnswer": {"@type": "Answer", "text": t("faq.a%d" % i)}})
                i += 1
            obj = {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": self.lang,
                   "mainEntity": items}
        txt = json.dumps(obj, ensure_ascii=False, indent=2).replace("</", "<\\/")
        return "\n" + "\n".join("  " + line for line in txt.split("\n")) + "\n  "

    @staticmethod
    def set_attr(raw, name, value):
        value = html.escape(value, quote=True)
        pat = re.compile(r'(\s%s=")[^"]*(")' % re.escape(name))
        if pat.search(raw):
            return pat.sub(lambda m: m.group(1) + value + m.group(2), raw, count=1)
        return re.sub(r"(\s*/?>)$", ' %s="%s"\\1' % (name, value), raw, count=1)

    @staticmethod
    def del_attr(raw, name):
        return re.sub(r'\s%s="[^"]*"' % re.escape(name), "", raw)

    def rewrite(self, tag, raw, a):
        if tag == "html":
            raw = self.set_attr(raw, "lang", self.lang)
            raw = self.set_attr(raw, "data-page-lang", self.lang)
        if "data-i18n-attr" in a:
            for pair in a["data-i18n-attr"].split(";"):
                if ":" in pair:
                    attr, key = [p.strip() for p in pair.split(":", 1)]
                    raw = self.set_attr(raw, attr, self.t(key))
        if "data-lang" in a:
            raw = self.del_attr(raw, "aria-current")
            if a["data-lang"] == self.lang:
                raw = self.set_attr(raw, "aria-current", "true")
        return raw

    # --- eventos del parser ---
    def handle_decl(self, decl):
        if not self.skip: self.out.append("<!%s>" % decl)

    def handle_starttag(self, tag, attrs):
        if self.skip:
            if tag not in VOID: self.skip += 1
            return
        a = {k: (v or "") for k, v in attrs}
        self.out.append(self.rewrite(tag, self.get_starttag_text(), a))
        if tag in VOID:
            return
        if "data-i18n" in a:
            self.out.append(html.escape(self.t(a["data-i18n"]), quote=False)); self.skip = 1
        elif "data-i18n-html" in a:
            self.out.append(self.t(a["data-i18n-html"])); self.skip = 1
        elif "data-i18n-jsonld" in a:
            self.out.append(self.jsonld(a["data-i18n-jsonld"])); self.skip = 1

    def handle_startendtag(self, tag, attrs):
        if self.skip: return
        a = {k: (v or "") for k, v in attrs}
        self.out.append(self.rewrite(tag, self.get_starttag_text(), a))

    def handle_endtag(self, tag):
        if self.skip:
            self.skip -= 1
            if self.skip: return
        self.out.append("</%s>" % tag)

    def handle_data(self, data):
        if not self.skip: self.out.append(data)

    def handle_entityref(self, name):
        if not self.skip: self.out.append("&%s;" % name)

    def handle_charref(self, name):
        if not self.skip: self.out.append("&#%s;" % name)

    def handle_comment(self, data):
        if not self.skip: self.out.append("<!--%s-->" % data)


def main():
    d = load_dict()
    base = load_base()
    missing = set(d["es"]) ^ set(d["en"])
    if missing:
        sys.exit("Claves que faltan en un idioma: %s" % ", ".join(sorted(missing)))
    template = (ROOT / "index.html").read_text(encoding="utf-8")
    for lang, name in PAGES.items():
        b = Builder(lang, d, base)
        b.feed(template)
        b.close()
        if b.missing:
            sys.exit("Claves usadas en el HTML pero no en el diccionario: %s" % ", ".join(sorted(b.missing)))
        (ROOT / name).write_text("".join(b.out), encoding="utf-8", newline="\n")
        print("[OK] %s generado (%s)" % (name, lang))


if __name__ == "__main__":
    main()
