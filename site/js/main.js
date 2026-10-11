/* RivetTrail: Menü auf dem Handy, aktiver Navigationspunkt, Kopieren-Button, Beispielfragen, Tabellen-Hinweis.
   Die Seite funktioniert vollständig ohne diese Datei. Keine Cookies, kein Speicher, keine Anfragen. */
(function () {
  "use strict";

  /* Texte je Seitensprache (<html lang="de"> bzw. "en-GB") */
  var EN = /^en\b/i.test(document.documentElement.lang);
  var TXT = EN
    ? { copied: "Copied", copyFailed: "Copying isn’t available. Please select the address manually.", question: "Question: " }
    : { copied: "Kopiert", copyFailed: "Kopieren nicht möglich. Bitte die Adresse markieren.", question: "Frage: " };

  /* ---------- Menü auf dem Handy ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("nav-list");
  var mobile = window.matchMedia("(max-width: 899px)");

  function setMenu(open, returnFocus) {
    if (!toggle || !list) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    list.classList.toggle("is-open", open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && list) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".nav")) setMenu(false);
    });
    // Menü schließen, wenn der Fokus per Tab Knopf und Liste verlässt
    toggle.parentNode.addEventListener("focusout", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (e.relatedTarget && !toggle.parentNode.contains(e.relatedTarget)) setMenu(false);
    });
    var onMq = function () { if (!mobile.matches) setMenu(false); };
    if (mobile.addEventListener) mobile.addEventListener("change", onMq);
  }

  /* ---------- Aktiver Abschnitt in der Navigation ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  // Alle Abschnitte in Dokumentreihenfolge; Abschnitte ohne eigenen Navigationspunkt heben die Markierung auf.
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section"));

  function linkFor(id) {
    if (!id) return null;
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      // nur Sprungmarken auf dieser Seite
      if (href.charAt(0) === "#" && href.slice(1) === id) return links[i];
    }
    return null;
  }

  function updateActive() {
    var line = window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s;
    });
    var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atEnd && sections.length) current = sections[sections.length - 1];
    var active = current ? linkFor(current.id) : null;
    links.forEach(function (a) {
      var on = a === active;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  if (links.length && sections.length) {
    // Gedrosselt bei Scrollen und Größenänderung; erfasst auch das Ende eines sanften Sprungs und das Seitenende.
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; updateActive(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActive();
  }

  /* ---------- E-Mail-Adresse kopieren ---------- */
  var copyBtn = document.querySelector(".btn-copy");
  var status = document.querySelector(".copy-status");
  if (copyBtn) {
    copyBtn.hidden = false;
    var timer;
    var report = function (msg) {
      if (!status) return;
      status.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(function () { status.textContent = ""; }, 4000);
    };
    var fallback = function (text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      copyBtn.focus();
      return ok;
    };
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function () { report(TXT.copied); };
      var failed = function () {
        if (fallback(text)) done();
        else report(TXT.copyFailed);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, failed);
      } else {
        failed();
      }
    });
  }

  /* ---------- Beispielfragen ----------
     Vier feste Fragen-Knöpfe; der gewählte ist aria-pressed und steht im Suchfeld.
     Die Demo-Ergebnisse stehen im HTML (je .ask-result mit data-q) und liegen übereinander;
     nur das passende ist sichtbar, die Karte bleibt immer gleich hoch. */
  var askInput = document.getElementById("ask-q");
  var askLive = document.getElementById("ask-live");
  var results = Array.prototype.slice.call(document.querySelectorAll(".ask-result[data-q]"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".q-chip"));
  if (askInput && askLive && results.length && chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var q = chip.textContent;
        askInput.value = q;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        var shown = null;
        results.forEach(function (r) {
          var on = r.getAttribute("data-q") === q;
          r.classList.toggle("is-off", !on);
          if (on) shown = r;
        });
        var count = shown ? shown.querySelector(".ask-count").textContent.replace(/\s+/g, " ").trim() : "";
        askLive.textContent = TXT.question + q + " " + count + ".";
      });
    });
  }

  /* ---------- Vergleichstabelle: nur scrollbar beschriften, wenn sie es ist ---------- */
  var tWrap = document.querySelector(".table-wrap");
  var tScroll = tWrap && tWrap.querySelector(".table-scroll");
  if (tScroll) {
    var label = tScroll.getAttribute("aria-label");
    var tTick = false;
    var checkTable = function () {
      tTick = false;
      var scrollable = tScroll.scrollWidth > tScroll.clientWidth + 1;
      if (scrollable) {
        tScroll.setAttribute("tabindex", "0");
        tScroll.setAttribute("role", "region");
        tScroll.setAttribute("aria-label", label);
      } else {
        tScroll.removeAttribute("tabindex");
        tScroll.removeAttribute("role");
        tScroll.removeAttribute("aria-label");
      }
      var atEnd = tScroll.scrollLeft + tScroll.clientWidth >= tScroll.scrollWidth - 2;
      tWrap.classList.toggle("can-scroll", scrollable && !atEnd);
    };
    var onTable = function () {
      if (tTick) return;
      tTick = true;
      requestAnimationFrame(checkTable);
    };
    tScroll.addEventListener("scroll", onTable, { passive: true });
    window.addEventListener("resize", onTable);
    if ("ResizeObserver" in window) new ResizeObserver(onTable).observe(tScroll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onTable);
    checkTable();
  }
})();
