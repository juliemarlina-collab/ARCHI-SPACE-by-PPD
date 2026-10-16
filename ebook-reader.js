/* ARCHI SPACE · interactive eBook reader (self-hosted, Kotobee-style)
   Mounts into any #ebook-reader element rendered by app.js. */
(function () {
  'use strict';
  var BASE = 'ebook/';
  var TOTAL = 65;
  var YT = 'S5u1iQeVmVY';
  var CH = [
    { id: '00', en: 'Initiative & eligibility', bm: 'Maklumat & kelayakan', mark: '', from: 1, to: 10, items: [[1, 'Kulit', 'Cover'], [2, 'Panduan hakim', 'Judges’ guide'], [3, 'Kandungan', 'Contents'], [4, 'Profil institusi', 'Institution profile'], [5, 'Pasukan & penasihat', 'Team & advisor'], [7, 'Butiran penyertaan', 'Entry details'], [8, 'Semakan syarat Imersif Teradun', 'Blended immersive eligibility'], [9, 'Pembelajaran teradun', 'Blended learning'], [10, 'SDG', 'SDGs']] },
    { id: '01', en: 'Initiative rationale', bm: 'Rasional inisiatif', mark: '10%', from: 11, to: 15, items: [[12, 'Faktor pendorong', 'Driving factors'], [13, 'Penjajaran nasional', 'National alignment'], [14, 'Suara arkitek', 'Architects’ voice'], [15, 'Objektif SMART', 'SMART objectives']] },
    { id: '02', en: 'Approach', bm: 'Pendekatan', mark: '30%', from: 16, to: 28, items: [[17, 'Latihan BIMind', 'BIMind training'], [18, 'Projek V2V (CDIO)', 'V2V project (CDIO)'], [19, 'Ekosistem ARCHI SPACE', 'ARCHI SPACE ecosystem'], [20, 'Apa yang baharu', 'What is new'], [21, 'Kronologi pelaksanaan', 'Implementation timeline'], [22, 'Proses PdP sebenar (RMS)', 'Actual delivery (RMS)'], [23, 'Matriks 14 minggu', '14-week matrix'], [24, 'Pedagogi SMART SPACE × CDIO', 'SMART SPACE × CDIO pedagogy'], [25, 'Struktur DCA40462', 'DCA40462 structure'], [26, 'ARCHI-KIT & harta intelek', 'ARCHI-KIT & IP'], [27, 'Pindahan & skala', 'Transfer & scale'], [28, 'Pakej guna semula', 'Reuse package']] },
    { id: '03', en: 'Student engagement', bm: 'Keterlibatan pelajar', mark: '30%', from: 29, to: 39, items: [[30, 'Studio TECC 4.0', 'TECC 4.0 studio'], [31, 'Perjalanan pelajar', 'Student journey'], [34, 'Empat langkah sesi VR', 'Four-step VR session'], [35, 'E-portfolio', 'E-portfolio'], [36, 'Galeri e-portfolio', 'E-portfolio gallery'], [37, 'Kes “Lape House”', '“Lape House” case'], [38, 'Kritik & semakan', 'Critique & revision'], [39, 'Penglibatan aktif & refleksi', 'Active engagement & reflection']] },
    { id: '04', en: 'Sustained impact', bm: 'Kelestarian impak', mark: '30%', from: 40, to: 57, items: [[41, 'Jalan cerita impak', 'Impact story'], [42, 'Kaedah & had', 'Method & limits'], [43, 'Kadar lulus kohort', 'Cohort pass rates'], [44, 'Ujian statistik', 'Statistical tests'], [45, 'Indikator CLO', 'CLO indicators'], [46, 'PLO3 Sem 3 → 4', 'PLO3 Sem 3 → 4'], [47, 'Dua elektif', 'Two electives'], [48, 'Operate Sem 5', 'Operate, Sem 5'], [49, 'ArchiFest 2026', 'ArchiFest 2026'], [50, 'Rekod kohort 2026', '2026 cohort record'], [51, 'Berita CArT', 'CArT news'], [52, 'Projek industri', 'Industry projects'], [53, 'Pengiktirafan', 'Recognition'], [54, 'Galeri kejayaan', 'Achievement gallery'], [55, 'Nilai tambah', 'Added value'], [56, 'Penguasaan imersif', 'Immersive mastery'], [57, 'Kisah pelajar', 'Student stories']] },
    { id: '05', en: 'Closing, index & declaration', bm: 'Penutup, indeks & deklarasi', mark: '', from: 58, to: 65, items: [[58, 'Hala tuju', 'Way forward'], [59, 'Indeks bukti', 'Evidence index'], [62, 'Rujukan', 'References'], [63, 'Deklarasi & perakuan', 'Declaration'], [65, 'Kulit belakang', 'Back cover']] }
  ];

  var S = { page: 1, zoom: 1, spread: null, data: null, loading: null, root: null, showLinks: false, search: '' };
  try { var saved = parseInt(sessionStorage.getItem('archiEbookPage'), 10); if (saved >= 1 && saved <= TOTAL) S.page = saved; } catch (e) {}

  function bm() { return (document.documentElement.lang || '').indexOf('ms') === 0; }
  function L(en, ms) { return bm() ? ms : en; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function chapterOf(n) { for (var i = 0; i < CH.length; i++) if (n >= CH[i].from && n <= CH[i].to) return CH[i]; return CH[0]; }
  function wide() { return window.matchMedia('(min-width: 1100px)').matches; }
  function useSpread() { return (S.spread === null ? wide() : S.spread) && !S.root.classList.contains('is-narrow'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function visiblePages() {
    var n = S.page;
    if (!useSpread() || n === 1 || n === TOTAL) return [n];
    var left = n % 2 === 0 ? n : n - 1; // spreads: [2,3] [4,5] ...
    return left + 1 <= TOTAL ? [left, left + 1] : [left];
  }
  function loadData() {
    if (S.data || S.loading) return S.loading;
    S.loading = fetch(BASE + 'ebook-data.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { S.data = d; d.pages.forEach(function (p) { p.flat = (p.text + ' ' + p.text.replace(/\s+/g, '')).toLowerCase(); }); return d; })
      .catch(function () { S.data = { pages: [] }; });
    return S.loading;
  }
  function icon(name) {
    var p = {
      menu: 'M4 6h16M4 12h16M4 18h16', prev: 'M15 18l-6-6 6-6', next: 'M9 18l6-6-6-6', search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16-4.3-4.3',
      plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5', spread: 'M3 5h8v14H3zM13 5h8v14h-8z', single: 'M7 4h10v16H7z',
      link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', play: 'M8 5l11 7-11 7z', close: 'M6 6l12 12M18 6 6 18', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'
    }[name];
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="' + (name === 'play' ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + p + '"/></svg>';
  }
  function btn(act, ic, label, extra) { return '<button type="button" class="er-btn" data-er="' + act + '" aria-label="' + esc(label) + '" title="' + esc(label) + '"' + (extra || '') + '>' + icon(ic) + '</button>'; }

  function shell() {
    var r = S.root;
    r.innerHTML =
      '<div class="er-bar">' +
        btn('toc', 'menu', L('Contents', 'Kandungan'), ' aria-expanded="false" aria-controls="er-side"') +
        '<div class="er-title"><strong>ARCHI SPACE · AKRI 2026</strong><span class="er-chapter"></span></div>' +
        '<div class="er-tools">' +
          btn('video', 'play', L('Play the 2-minute video', 'Main video 2 minit')) +
          btn('search', 'search', L('Search the eBook', 'Cari dalam eBook'), ' aria-expanded="false"') +
          btn('links', 'link', L('Highlight clickable links', 'Tonjolkan pautan boleh klik'), ' aria-pressed="false"') +
          btn('zoomout', 'minus', L('Zoom out', 'Zum keluar')) +
          '<span class="er-zoom" aria-live="polite">100%</span>' +
          btn('zoomin', 'plus', L('Zoom in', 'Zum masuk')) +
          btn('layout', 'spread', L('One page / two pages', 'Satu halaman / dua halaman')) +
          btn('full', 'full', L('Full screen', 'Skrin penuh')) +
        '</div>' +
      '</div>' +
      '<div class="er-body">' +
        '<nav class="er-side" id="er-side" aria-label="' + L('eBook contents', 'Kandungan eBook') + '"><div class="er-side-head">' + L('Contents', 'Kandungan') + btn('toc', 'close', L('Close contents', 'Tutup kandungan')) + '</div><div class="er-toc"></div></nav>' +
        '<div class="er-searchpanel" hidden><label class="er-searchbox">' + icon('search') + '<input type="search" placeholder="' + L('Search, e.g. CORR, ArchiFest, V2V', 'Cari, cth. CORR, ArchiFest, V2V') + '" aria-label="' + L('Search the eBook', 'Cari dalam eBook') + '"></label><div class="er-results" aria-live="polite"></div></div>' +
        '<div class="er-main">' +
          '<button type="button" class="er-nav er-nav-prev" data-er="prev" aria-label="' + L('Previous page', 'Halaman sebelumnya') + '">' + icon('prev') + '</button>' +
          '<div class="er-stage" tabindex="0" aria-label="' + L('eBook pages. Use the arrow keys to turn pages.', 'Halaman eBook. Gunakan kekunci anak panah untuk menyelak halaman.') + '"><div class="er-spread"></div></div>' +
          '<button type="button" class="er-nav er-nav-next" data-er="next" aria-label="' + L('Next page', 'Halaman seterusnya') + '">' + icon('next') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="er-foot">' +
        '<div class="er-pager"><button type="button" class="er-btn er-small" data-er="prev" aria-label="' + L('Previous page', 'Halaman sebelumnya') + '">' + icon('prev') + '</button>' +
        '<label class="er-goto"><span class="sr">' + L('Go to page', 'Pergi ke halaman') + '</span><input type="number" min="1" max="' + TOTAL + '" inputmode="numeric"></label><span class="er-of">/ ' + TOTAL + '</span>' +
        '<button type="button" class="er-btn er-small" data-er="next" aria-label="' + L('Next page', 'Halaman seterusnya') + '">' + icon('next') + '</button></div>' +
        '<input class="er-range" type="range" min="1" max="' + TOTAL + '" aria-label="' + L('Page slider', 'Gelangsar halaman') + '">' +
        '<div class="er-thumbs" role="list"></div>' +
      '</div>' +
      '<div class="er-modal" hidden><div class="er-modal-box" role="dialog" aria-modal="true" aria-label="' + L('ARCHI SPACE video', 'Video ARCHI SPACE') + '">' + btn('closevideo', 'close', L('Close video', 'Tutup video')) + '<div class="er-video"></div></div></div>';

    // contents
    r.querySelector('.er-toc').innerHTML = CH.map(function (c) {
      return '<section class="er-ch" data-ch="' + c.id + '"><button type="button" class="er-ch-head" data-go="' + c.from + '"><span class="er-ch-no">' + c.id + '</span><span class="er-ch-name">' + esc(L(c.en, c.bm)) + '</span>' + (c.mark ? '<span class="er-ch-mark">' + c.mark + '</span>' : '') + '<span class="er-ch-pg">' + c.from + '–' + c.to + '</span></button><ol>' +
        c.items.map(function (it) { return '<li><button type="button" data-go="' + it[0] + '"><span>' + esc(L(it[2], it[1])) + '</span><em>' + it[0] + '</em></button></li>'; }).join('') + '</ol></section>';
    }).join('');
    // thumbnails
    var th = '';
    for (var i = 1; i <= TOTAL; i++) th += '<button type="button" role="listitem" class="er-thumb" data-go="' + i + '" aria-label="' + L('Page ', 'Halaman ') + i + '"><img loading="lazy" src="' + BASE + 'thumbs/t' + pad(i) + '.webp" alt=""><span>' + i + '</span></button>';
    r.querySelector('.er-thumbs').innerHTML = th;
    bind();
  }

  function pageHTML(n) {
    var d = S.data && S.data.pages[n - 1];
    var links = (d && d.links) || [];
    var ratio = (S.data && S.data.ratio) || 1.41604;
    return '<figure class="er-page" data-n="' + n + '" style="aspect-ratio:1/' + ratio + '"><img src="' + BASE + 'pages/p' + pad(n) + '.webp" alt="' + esc(L('eBook page ', 'Halaman eBook ') + n) + '" decoding="async"' + (n === S.page ? ' fetchpriority="high"' : '') + '>' +
      links.map(function (l) {
        var internal = l.h.charAt(0) === '#';
        var tgt = internal ? parseInt(l.h.slice(1), 10) : 0;
        var label = internal ? L('Go to page ', 'Pergi ke halaman ') + tgt : L('Open link: ', 'Buka pautan: ') + l.h;
        return '<a class="er-hot' + (internal ? ' er-int' : '') + '" style="left:' + l.x + '%;top:' + l.y + '%;width:' + l.w + '%;height:' + l.ht + '%"' +
          (internal ? ' href="#media" data-go="' + tgt + '"' : ' href="' + esc(l.h) + '" target="_blank" rel="noopener"') + ' aria-label="' + esc(label) + '" title="' + esc(internal ? label : l.h) + '"></a>';
      }).join('') + '</figure>';
  }
  function preload(n) { if (n >= 1 && n <= TOTAL) { var im = new Image(); im.src = BASE + 'pages/p' + pad(n) + '.webp'; } }

  function draw(focusStage) {
    var r = S.root; if (!r) return;
    r.classList.toggle('is-narrow', r.clientWidth < 760);
    var vis = visiblePages();
    var sp = r.querySelector('.er-spread');
    sp.className = 'er-spread' + (vis.length === 2 ? ' is-two' : '');
    var stage = r.querySelector('.er-stage');
    var ratio = (S.data && S.data.ratio) || 1.41604;
    var cs = getComputedStyle(stage), padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    var ph = Math.max(200, stage.clientHeight - padY), aw = Math.max(160, stage.clientWidth - padX);
    if ((ph / ratio) * vis.length > aw) ph = (aw / vis.length) * ratio;
    sp.style.setProperty('--ph', Math.floor(ph) + 'px');
    sp.style.setProperty('--z', S.zoom);
    sp.innerHTML = vis.map(pageHTML).join('');
    stage.classList.toggle('is-zoomed', S.zoom > 1);
    if (focusStage) stage.focus({ preventScroll: true });
    stage.scrollTop = 0;
    var c = chapterOf(S.page);
    r.querySelector('.er-chapter').textContent = c.id + ' · ' + L(c.en, c.bm) + (c.mark ? ' · ' + c.mark : '');
    r.querySelector('.er-goto input').value = S.page;
    r.querySelector('.er-range').value = S.page;
    r.querySelector('.er-zoom').textContent = Math.round(S.zoom * 100) + '%';
    r.querySelectorAll('[data-er="prev"]').forEach(function (b) { b.disabled = S.page <= 1; });
    r.querySelectorAll('[data-er="next"]').forEach(function (b) { b.disabled = vis[vis.length - 1] >= TOTAL; });
    var lay = r.querySelector('[data-er="layout"]');
    lay.innerHTML = icon(useSpread() ? 'single' : 'spread');
    lay.hidden = r.classList.contains('is-narrow');
    r.querySelectorAll('.er-thumb').forEach(function (t) { var on = vis.indexOf(+t.dataset.go) > -1; t.classList.toggle('is-on', on); if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
    var cur = r.querySelector('.er-thumb.is-on'); if (cur) { var strip = r.querySelector('.er-thumbs'); strip.scrollTo({ left: cur.offsetLeft - strip.clientWidth / 2 + cur.clientWidth / 2, behavior: 'smooth' }); }
    r.querySelectorAll('.er-ch').forEach(function (s) { s.classList.toggle('is-on', s.dataset.ch === c.id); });
    r.querySelectorAll('.er-toc [data-go]').forEach(function (b) { b.classList.toggle('is-on', +b.dataset.go === S.page); });
    preload(vis[vis.length - 1] + 1); preload(vis[vis.length - 1] + 2); preload(vis[0] - 1);
    try { sessionStorage.setItem('archiEbookPage', S.page); } catch (e) {}
  }

  function go(n, focusStage) { n = Math.max(1, Math.min(TOTAL, n | 0)); if (!n) return; S.page = n; if (S.root.classList.contains('is-narrow') || window.matchMedia('(max-width: 1099px)').matches) { toggleToc(false); toggleSearch(false); } draw(focusStage); }
  function step(dir) { var vis = visiblePages(); go(dir > 0 ? vis[vis.length - 1] + 1 : vis[0] - (useSpread() && vis[0] > 2 ? 2 : 1)); }
  function setZoom(z) { S.zoom = Math.max(1, Math.min(3, Math.round(z * 4) / 4)); draw(); }
  function toggleToc(force) {
    var r = S.root, open = typeof force === 'boolean' ? force : !r.classList.contains('toc-open');
    r.classList.toggle('toc-open', open);
    r.querySelectorAll('[data-er="toc"]').forEach(function (b) { b.setAttribute('aria-expanded', open); });
  }
  function toggleSearch(force) {
    var r = S.root, p = r.querySelector('.er-searchpanel'), open = typeof force === 'boolean' ? force : p.hidden;
    p.hidden = !open; r.querySelector('[data-er="search"]').setAttribute('aria-expanded', open);
    if (open) { loadData().then(runSearch); setTimeout(function () { p.querySelector('input').focus(); }, 30); }
  }
  function runSearch() {
    var r = S.root, q = r.querySelector('.er-searchpanel input').value.trim().toLowerCase(), out = r.querySelector('.er-results');
    S.search = q;
    if (q.length < 2) { out.innerHTML = '<p class="er-hint">' + L('Type at least 2 letters.', 'Taip sekurang-kurangnya 2 huruf.') + '</p>'; return; }
    var hits = (S.data.pages || []).filter(function (p) { return p.flat.indexOf(q) > -1 || p.flat.indexOf(q.replace(/\s+/g, '')) > -1; });
    if (!hits.length) { out.innerHTML = '<p class="er-hint">' + L('No pages found.', 'Tiada halaman ditemui.') + '</p>'; return; }
    out.innerHTML = '<p class="er-hint">' + hits.length + L(' pages found', ' halaman ditemui') + '</p>' + hits.slice(0, 40).map(function (p) {
      var t = p.text, i = t.toLowerCase().indexOf(q);
      var snip = i > -1
        ? (i > 40 ? '…' : '') + esc(t.slice(Math.max(0, i - 40), i)) + '<mark>' + esc(t.substr(i, q.length)) + '</mark>' + esc(t.slice(i + q.length, i + q.length + 70)) + '…'
        : esc(t.slice(0, 100)) + '…';
      var c = chapterOf(p.n);
      return '<button type="button" class="er-hit" data-go="' + p.n + '"><strong>' + L('Page ', 'Halaman ') + p.n + ' · ' + esc(L(c.en, c.bm)) + '</strong><span>' + snip + '</span></button>';
    }).join('');
  }
  function fullscreen() {
    var r = S.root, on = !r.classList.contains('is-full');
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (on) {
      var req = r.requestFullscreen || r.webkitRequestFullscreen;
      if (req) { try { var pr = req.call(r); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
    } else if (fs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    r.classList.toggle('is-full', on); document.documentElement.classList.toggle('er-lock', on);
    setTimeout(function () { draw(); }, 60);
  }
  function video(open) {
    var m = S.root.querySelector('.er-modal'), v = m.querySelector('.er-video');
    if (open) { v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + YT + '?autoplay=1&rel=0" title="' + L('ARCHI SPACE explainer video', 'Video penerangan ARCHI SPACE') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'; m.hidden = false; m.querySelector('[data-er="closevideo"]').focus(); }
    else { v.innerHTML = ''; m.hidden = true; }
  }

  function bind() {
    var r = S.root;
    r.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]');
      if (g) { e.preventDefault(); go(+g.dataset.go, true); return; }
      var b = e.target.closest('[data-er]'); if (!b) { if (e.target.classList.contains('er-modal')) video(false); return; }
      switch (b.dataset.er) {
        case 'prev': step(-1); break; case 'next': step(1); break;
        case 'toc': toggleToc(); break; case 'search': toggleSearch(); break;
        case 'zoomin': setZoom(S.zoom + 0.5); break; case 'zoomout': setZoom(S.zoom - 0.5); break;
        case 'layout': S.spread = !useSpread(); draw(); break;
        case 'full': fullscreen(); break;
        case 'links': S.showLinks = !S.showLinks; r.classList.toggle('show-links', S.showLinks); b.setAttribute('aria-pressed', S.showLinks); break;
        case 'video': video(true); break; case 'closevideo': video(false); break;
      }
    });
    r.querySelector('.er-goto input').addEventListener('change', function (e) { go(+e.target.value); });
    r.querySelector('.er-range').addEventListener('input', function (e) { go(+e.target.value); });
    var si = r.querySelector('.er-searchpanel input'), tmr;
    si.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(runSearch, 160); });
    r.addEventListener('keydown', function (e) {
      if (e.target.matches('input')) { if (e.key === 'Escape') toggleSearch(false); return; }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); go(1); }
      else if (e.key === 'End') { e.preventDefault(); go(TOTAL); }
      else if (e.key === 'Escape') { if (!r.querySelector('.er-modal').hidden) video(false); else if (r.classList.contains('is-full')) fullscreen(); else toggleToc(false); }
    });
    var sx = 0, sy = 0, st = 0;
    var stage = r.querySelector('.er-stage');
    stage.addEventListener('touchstart', function (e) { if (e.touches.length !== 1) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (S.zoom > 1 || !st) return; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; st = 0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    stage.addEventListener('dblclick', function (e) { if (e.target.closest('a')) return; setZoom(S.zoom > 1 ? 1 : 2); });
  }
  function onFsChange() { if (S.root && !(document.fullscreenElement || document.webkitFullscreenElement) && S.root.classList.contains('is-full') && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) { S.root.classList.remove('is-full'); document.documentElement.classList.remove('er-lock'); draw(); } }
  document.addEventListener('fullscreenchange', onFsChange); document.addEventListener('webkitfullscreenchange', onFsChange);

  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (S.root && document.body.contains(S.root)) draw(); }, 150); });

  function mount() {
    var el = document.getElementById('ebook-reader');
    if (!el || el.dataset.ready) return;
    el.dataset.ready = '1'; S.root = el; S.zoom = 1;
    document.documentElement.classList.remove('er-lock');
    shell(); draw();
    loadData().then(function () { if (S.root === el) draw(); });
  }
  function watch() {
    var c = document.getElementById('content'); if (!c) return;
    new MutationObserver(mount).observe(c, { childList: true });
    mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
