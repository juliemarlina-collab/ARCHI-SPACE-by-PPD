# Page 02 update — patch notes (2026-09-01)

This zip is your real repo files (app.js, story.css, styles.css, index.html) with
four changes applied directly, plus six replacement/new images. Everything else is
untouched — diff only these files against your current repo before pushing if
you want to double check.

## 1. Fixed: baked-in "Figure 1 / Figure 3" captions cut off on Page 02

**What was wrong:** `assets/archi-kit-product.png` and `assets/archi-kit-classroom.png`
had a caption baked into the bottom of the photo itself, duplicating the real
`<figcaption>` text already rendered below each image. Because `.media-proof img`
used a fixed `height:260px` with `object-fit:cover`, that baked-in caption got
sliced in half.

**What changed:**
- `assets/archi-kit-product.png` — recropped to remove the embedded caption strip.
- `assets/archi-kit-classroom.png` — same.
- `story.css` — `.media-proof img` height changed from `260px` to `420px` (matches
  `.archikit-outcome-grid img`, the gallery further down the page that never had
  this problem), so more of each photo shows and nothing is tightly cropped.

## 2. Added: ARCHI-KIT × ARCHI-SPACE synergy section on Page 02

A new section, `archiKitSpaceSynergy()`, now renders between the ARCHI-KIT
outcome gallery and the existing DCA30364 bridge section on Page 02 (`why()`).
It makes the Blended (Teradun) argument explicit: ARCHI-KIT as the face-to-face
concept input, ARCHI-SPACE as the VR practical delivery — with each side tagged
to the AKRI sub-criteria it supports (Pendekatan; Pendekatan + Keterlibatan) and
linked to real evidence already used elsewhere on your site (the DCA30364
course outline, and the DCA40462 CORR).

No new visual language was introduced — the panel reuses the exact gradient
already used by `.archikit-dca-bridge` right next to it, and the lime/teal
accents already used throughout your site. All new CSS is under its own
`as-synergy-*` class names, so nothing else on the page is touched.

The existing 4-step ARCHI-KIT → DCA30364 → DCA40462 → ARCHI-SPACE pipeline
(`.archikit-story-path`, inside the DCA bridge section right after this one)
was left as-is — this new section doesn't repeat it, it answers a different
question ("what is each half, and which AKRI criteria does it support") before
the reader reaches that more detailed pipeline.

## 3. Fixed: ARCHI-KIT outcome gallery was cropping off the actual outcome

**What was wrong:** `assets/implementation/archi-kit-outcome-01.jpg` and
`archi-kit-outcome-02.jpg` (the "Physical–digital construction outcome" /
"Micro-to-macro illustration" cards) are portrait photos (498×1080, a tall
AR building model shot). `.archikit-outcome-grid img` forced a fixed
landscape `height:420px` with `object-fit:cover`, which on desktop widths
crops out roughly 3/4 of each photo — the AR structure's roof and much of
its height was being cut off, hiding the actual construction outcome the
photo exists to document. (A mobile media query already sets `height:auto`
for narrow screens, so this only showed up at desktop width — which is
exactly what you were seeing.)

**What changed:**
- `story.css` — `.archikit-outcome-grid img` changed from
  `height:420px;object-fit:cover` to `height:auto;object-fit:contain`, so
  the full photo always renders at its natural aspect ratio — nothing gets
  silently cropped off, matching how it already behaved on mobile. The
  cards will look noticeably taller now since these two photos are
  portrait-oriented; that's the honest trade-off for showing the whole
  outcome instead of a slice of it.
- `assets/implementation/archi-kit-outcome-01.jpg` and `-02.jpg` — replaced
  with the full versions you shared, matching exactly what should now
  display in full.

## 4. Fixed: video previews were reusing the product/classroom photos as posters

**What was wrong:** the two video preview cards ("Video Product_ARCHI KIT" and
"How to use ARCHI-KIT") used `poster="assets/archi-kit-product.png"` and
`poster="assets/archi-kit-classroom.png"` — the same two photos already used
elsewhere on the page — as their paused-state thumbnail, instead of a frame
from each video itself.

**What changed:** cropped a clean still of each video's own opening title
card (the "ARCHI-KIT · FROM TIMBER TO TECHNOLOGY" branded intro, from the
screenshot you sent, with the browser chrome and the player's own control bar
removed) and added them as new files:
- `assets/video/archi-kit-product-demo-poster.jpg`
- `assets/video/archi-kit-how-to-use-poster.jpg`

`app.js` now points each `<video poster="...">` at its own new file instead
of the reused photos. Update: `archi-kit-how-to-use-poster.jpg` was replaced again with a more
distinctive frame you sent (0:10 into that video) — the actual physical
ARCHI-KIT product boxes/kit on the yellow table — so the two video cards now
show visibly different thumbnails rather than the same title card twice.

## 5. Cache-busting bump

`index.html` — `story.css` and `app.js` query strings bumped from
`?v=20260831-phase-a` to `?v=20260901-synergy`, so browsers don't serve a
stale cached copy after you push.

## 6. Diagnosed: video thumbnails showing blank/black with 0:00 on the live site

**Root cause found (not a code bug):** I fetched your LIVE deployed files directly.
`app.js` and `story.css` on your live site are correct and match everything in
this zip — the poster attributes are right, the synergy section is live, the
outcome-gallery CSS fix is live. But `assets/video/archi-kit-product-demo-poster.jpg`,
`assets/video/archi-kit-how-to-use-poster.jpg`, and even the two `.mp4` files
themselves (`archi-kit-product-demo.mp4`, `archi-kit-how-to-use.mp4`) all return
**404 Not Found** on the live site. The whole `assets/video/` folder is missing
from your GitHub repo — that's why the cards show a blank box with a 0:00 timer:
the browser can't find the poster image OR the video file, so there's nothing to
display at all.

**This means the videos likely never played on the live site**, even before this
round of fixes — this isn't something my changes broke. The most common cause is
uploading through GitHub's web "Add file → Upload files" screen: it doesn't
create a new nested folder like `assets/video/` unless you drag files in while
already inside that folder in the repo view, and video files are also large
enough to occasionally get silently skipped by that same upload flow.

**What to do:** in your GitHub repo, navigate into `assets/`, create a `video`
folder if it doesn't already exist, and upload these four files into it directly:
`archi-kit-product-demo.mp4`, `archi-kit-how-to-use.mp4` (your existing video
files), and the two poster jpgs included in this zip's `assets/video/` folder.
If you're not sure your two `.mp4` files are sitting anywhere in your project
folder either, that's the first thing to locate before uploading.

## 7. Fixed: outcome-gallery photos were too tall ("white space gap too big")

**What was wrong:** the fix in item 3 (above) set `.archikit-outcome-grid img` to
`height:auto`, which stopped the cropping but let each photo render at its full
natural size. Since these two photos are portrait (498×1080) and the grid column
is much wider than that, `height:auto` blew each image up to roughly 1700–1900px
tall — far taller than the card was ever meant to be, which is what created the
oversized empty-feeling gap in the page flow.

**What changed:** `.archikit-outcome-grid img` is now `height:420px` (back to the
original card height) with `object-fit:contain` kept (not `cover`). `contain`
never crops — it fits the whole photo inside the 420px-tall box, letterboxed on
the sides if needed — so you still see the complete, uncropped outcome photo,
just at the compact card size instead of an oversized one.

## 8. Added: lime-green AKRI highlights on Page 02, matching Page 03's style

Per your request to highlight important information in lime, matching the style
already used on Page 03 (the solid-lime "Best Commercialisation Award" card, the
lime data callouts):

- A lime **"AKRI · Pendekatan – Kreativiti"** tag now sits beside the "ARCHI-KIT
  evidence: product, AR and classroom use." heading, and a smaller matching tag
  sits next to each of the two video labels. This is the real AKRI sub-criterion
  these three evidence items are mapped to in your evidence audit (Video
  Product_ARCHI KIT.mp4, the product/classroom photos, and the ARCHI-KIT assembly
  materials are all logged there as Pendekatan — Kreativiti).
- In the ARCHI-KIT → DCA30364 → DCA40462 → ARCHI-SPACE pipeline (just below the
  synergy section), the final step — **ARCHI-SPACE**, the payoff/destination of
  the pipeline — is now filled solid lime, the same "this is the one that
  matters most" treatment your site already uses for a highlighted grid item
  (e.g. the recognition-grid award card, the continuation step in the connected
  journey).

No new colors were introduced — everything uses the site's existing `#caff32`
lime, already used throughout Pages 03–06 for exactly this purpose.

## 9. Added: Pedagogical Model & Curriculum Alignment section on Page 03

You shared Gemini's comments on Page 03, saying it was "missing" a pedagogy model,
a CLO/SLT/MQF matrix, a pre-2024 baseline stat, and a 360°/VR embed, with a
copy-paste Tailwind/dark-mode/lucide-react prompt for v0.dev/Bolt/Cursor.

Two of those four were real gaps worth closing — but not with invented numbers,
and not with that prompt (your site is plain HTML/CSS/JS, not React/Tailwind, and
its palette is light lavender + lime, not `bg-slate-950` + cyan — pasting that
prompt into an AI builder would generate a disconnected file that does not plug
into your language toggle, hash-routing or design tokens at all).

What I checked before building anything:
- **Pedagogy model**: your own theoretical-foundation review already recommends
  Kolb's Experiential Learning Cycle as the model behind your two-phase ARCHI-KIT
  → ARCHI-SPACE pipeline, and had a "Kolb stage-mapping" item marked as drafted
  but never finalized. I finished that mapping using your real two-phase
  structure (Fasa 1 DCA30364 physical / Fasa 2 DCA40462 VR), not the "physical
  studio time vs digital time inside one timetable" framing Gemini suggested,
  which doesn't match how your courses are actually structured.
- **CLO/SLT/MQF matrix**: real, exact numbers exist for this — the DCA40462
  Course Information's own SLT table (Section 9: 14h lecture, 26h practical, 32h
  independent learning, 8h assessment = 80h total, 100% classified as
  immersive/virtual per Section 13), plus domain-tagged CLO attainment already
  confirmed from signed CORRs (DCA30364 CLO1 Cognitive 73.0%; DCA40462 CLO1
  Psikomotor 89.0%, CLO2 Afektif 91.0%). Built as a real SLT table plus three
  CLO/domain cards, each captioned with its exact source document and date.
- **"42% of students struggled" baseline stat**: this is fabricated — I checked,
  and your own evidence-mapping notes explicitly flag that no pre-intervention
  baseline was ever collected for this project; the problem statement is
  currently supported by literature only (Kieferle & Wössner, 2019; Lee, 2025).
  I did **not** add Gemini's number. Instead the new section cites that real
  literature and explicitly labels it as supporting literature, not a measured
  statistic for this cohort — matching the "disclose, don't blur" standard the
  rest of Page 03 already holds itself to.
- **360°/VR embed**: you weren't sure whether real footage/a 3D export exists.
  I did not build a placeholder for this — an empty or fake "Launch 360° View"
  button would hurt more than help. If you find or record real footage later,
  this is easy to add as a follow-up.

New section sits between the "Evidence boundary" limitations panel and the
"External recognition" panel on Page 03, using only existing site components
(`storyCard`, `table`, `.card`/`.grid2`/`.grid3`, the `badge` pill) — no new CSS
was needed for this one.

## 10. Page 06 — student attribution, registration numbers, and a recovered link

You shared a large batch of new evidence (software/hardware stack, named student
portfolios with registration numbers and scores, and several links that came
through as "[link removed]"). Before touching anything I checked what was
actually already in your real, live app.js rather than assuming the "[link
removed]" items were all genuinely missing:

- **SeVRa video → confirmed as Nur Shasha's own work.** Your site already had
  two YouTube links buried under a generic "Group outputs" label. I checked
  both via YouTube's own metadata: `HOucPkX37jw` is titled "SeVRa : VR And
  Design Options" on a channel called "Shasha Sumaizi" — almost certainly the
  real source of the SeVRa case study your site already uses anonymously. You
  confirmed attributing it to her, so the SeVRa video card on Page 06 now
  credits **Nur Shasha Binti Sumaizi (06DSB24F1042)** by name, links her
  original YouTube upload, and ties it to her "Sukoon" project.
- **The other video is unconfirmed — do not assume it's Nur Batrisyia's.** The
  second link, `3lEedAJunqM` ("IMMERSIVE TECHNOLOGY (PROJECT TOUR)" on a channel
  called "BUY IT OR SKIP IT?"), doesn't read as her work — the channel name
  doesn't match. I did not attribute it to her. It's still linked on Page 06,
  now clearly labeled "not yet individually attributed — pending confirmation"
  instead of the old generic "Group sample 2." Link, as requested:
  https://www.youtube.com/watch?v=3lEedAJunqM — please confirm whether this is
  actually hers before I attribute it.
- **"SeVRa project demo" was never actually missing** — it's a local file
  already embedded in your repo (`assets/sevra.mp4`), not an external link.
- **"ARCHI-KIT Online Hub" was genuinely missing** — it was never linked
  anywhere in your real app.js. I found the real file from earlier project
  work (ARCHI KIT - ASSEMBLE INSTRUCTION.pdf) and added it as a third button in
  the "Complete evidence repositories" section on Page 06, alongside the two
  Drive folders already there.
- **Portfolio names, registration numbers and scores** — you confirmed you're
  comfortable publishing these. The Page 06 portfolio cards now show full names
  (Nur Shasha Binti Sumaizi / Nur Batrisyia Binti Mohd Asri), registration
  numbers, DCA40462 Online Portfolio scores (96% / 98%), project names ("Sukoon"
  / "Lentera Rimba"), and Nur Shasha's ARCHIfest 2025 award. I updated the
  section's own caption, which previously said registration numbers were
  "intentionally excluded" — that line would have directly contradicted the
  numbers now shown, so it's been reworded. I kept the existing "subject to
  confirmed student permission" caveat rather than removing it, since your
  go-ahead is the project owner's decision, not documented confirmation from
  the students themselves — worth keeping in mind before the AKRI submission
  goes final.
- **Sukoon's AR marker experience and Lentera Rimba's walkthrough** are
  reached through the two portfolio links already on the site (they live
  inside each student's own Canva page) — not built as separate links, since
  nothing suggested they need their own entry point outside the portfolios.
- The software/hardware stack list and the Integrated Learning Hub SharePoint
  link were not built into the site this round — no placement decision was
  made for the stack list, and the SharePoint link requires your own Microsoft
  login so I can't verify its contents from here.

## 11. Confirmed: the second video is also Nur Shasha's

You confirmed the previously-unattributed YouTube video (`3lEedAJunqM`, "IMMERSIVE
TECHNOLOGY (PROJECT TOUR)") is Nur Shasha's own VR project submission — not
Nur Batrisyia's. Since it shares its exact title with the "Immersive Technology"
project-tour card that was already on Page 06 (linking a Drive copy of the same
video), I merged them into one attributed card rather than keep two separate
listings for what looks like the same submission: "Project Tour · Nur Shasha
Binti Sumaizi," with buttons to both the Drive copy and her YouTube upload. The
old "not yet attributed" card is gone.

I did **not** add the separate "Student Achievement Portfolio" document (the
POLYCCSkills Gold Medal / LinkedIn / CDIO field course content) — that's still
pending your confirmation, since I couldn't verify any of it independently (see
my last message). Nothing from that document is on the site.

## 12. Verified and added: Nur Shasha's PolyCCSkills 2026 Gold Medal

You sent event photos and screenshots of the official Jabatan Kejuruteraan Awam
(JKA), Politeknik Port Dickson Facebook post (7 Aug 2026), which explicitly
names "pelajar Diploma Senibina (DSB), Nur Shasha Binti Sumaizi" as the Gold
Medal winner in the Digital Construction category at PolyCCSkills 2026
(Pertandingan Kemahiran Politeknik dan Kolej Komuniti), held 6 Aug 2026 at
Politeknik Sultan Salahuddin Abdul Aziz Shah. That's a real, dated, named,
official department announcement — a different standard from the earlier
"Student Achievement Portfolio" document, which is still not added (its other
claims — LinkedIn competency matrix, CDIO field course, Design Fest "33
jurors" — remain unverified and are not on the site).

Added to Nur Shasha's portfolio card on Page 06, alongside her existing
ARCHIfest 2025 award, with the event, category, date, venue and source cited,
plus a link to the Instagram announcement as a "View Gold Medal announcement"
button.

## Sanity checks already run here

- `node -c app.js` — syntax OK.
- story.css brace count balanced (509 open / 509 close).
- Confirmed the new section sits between `archiKitOutcomeGallery()` and
  `archiKitDesignStudioBridge()` in `why()`, and every new CSS class used in
  the HTML has a matching rule.

## What I did NOT touch

- Page 01 (your Rasional Inisiatif content) — untouched.
- Everything else on Page 02 below the DCA bridge (the 4-step usage
  instructions, video reveal panel) — untouched.
- Pages 03–07 — untouched.
- The two draft-presentation / implementation photo galleries further down
  Page 06 use the same `object-fit:cover` pattern — not touched here since
  you haven't flagged those, but if any of those photos are portrait-shaped
  too they'll have the same cropping problem. Say the word if you want me
  to check those next.

## 13. Page 03 content/link audit (2026-09-02)

Requested: clean up Page 03's evidence content and verify its links.

**Broken link found and removed:** `assets/evidence-study-cover.jpg`, referenced in the
"Inspect the evidence behind the numbers" panel (`publication-proof` section), returns
a 404 on the live site. Verified `evidence/archi-kit-study-2026.pdf` right next to it
still loads fine and genuinely contains the cited 4.26 / 4.18 / 4.20 ratings — only the
cover image is missing. Since no replacement image was available, the `<figure><img>`
was removed and the section now runs as a single-column card (new `.no-figure`
modifier added to `.publication-proof` in `story.css` so the layout doesn't leave an
empty column). The PDF button remains the proof link. If you find the original cover
screenshot later, it's a one-line re-add.

**RESPEX'25 card upgraded** in `archiKitRecognition()`: previously read "Recognition
record" with a note that the award category couldn't be confirmed. The newly supplied
"Ebook 2 · Bahagian G" PDF (p.18) shows the actual certificate — Best Product Gold
Award, RESPEX'25, 9th Regional Educators and Students' Product Exhibition, 18–19 June
2025, awarded by Politeknik Negeri Medan (Indonesia) to Norul Fazlina Khashim, Zurika
Amnah @ Salmi Mohtar and Ahmad Qusyairi Ahmad Khairiri for ARCHI-KIT. The card now
names the award and event instead of hedging. Same Drive link
(`Award_Respex25-063.jpg`) — verified via Drive metadata that it's the right file.

**Verified, no change needed:**
- POLYCCOM Gold Medal and Best Commercialisation Award cards — Drive links confirmed
  against file metadata (`SIJIL ANUGERAH PINGAT EMAS POLYCCOM 2025.pdf`,
  `SIJIL ANUGERAH PENGKOMERSIALAN TERBAIK KATEGORI 7.pdf`), content matches.
- CORR/CLO figures in the pedagogy-alignment table (98.1% Sem 3, 100% Sem 4, CLO1 89%,
  CLO2 91%) — cross-checked against the same figures in the new ebook's own CORR pages
  (p.7). No discrepancy.

**Scope note:** other new evidence from the same ebook (Nur Batrisyia's Dean's List
award, the BIM JKR 2025 award, the n=24 student reflection survey) does NOT belong on
Page 03 — that page is scoped to evidence that names ARCHI-KIT directly. Those items
are student- or cohort-level evidence that belongs on Page 06 instead, pending a
separate decision on which of them to add.

## 14. Page 03 nav tab renamed; Page 04 rebuilt with the TECC 4.0 studio overview (2026-09-02)

**Tab rename:** `pages` array entry for `evidence` changed from "ARCHI-KIT evidence" /
"Bukti ARCHI-KIT" to **"ARCHI-KIT Validation"** / "Pengesahan ARCHI-KIT" — this drives
both the nav bar link and the browser tab title. Note: the on-page hero eyebrow on
Page 03 itself still reads "ARCHI-KIT EVIDENCE" — only the nav/tab label was in scope
for this request; say the word if you want the on-page eyebrow aligned too.

**Page 04 ("The Evolution") substantially expanded.** Previously this page was only
the micro-to-macro progression diagram and the DCA30364→DCA40462 curriculum banner.
Added, in order:

1. A one-line framing sentence at the top, explicitly linking back to Page 03
   ("Page 03 established that ARCHI-KIT is real, published and recognised...").
2. A new section, `tecc40StudioOverview()`, inserted after the existing "What
   develops across the journey?" block and before the curriculum banner:
   - Names the actual room — **TECC 4.0 (Technology-Enabled Collaborative
     Classroom) · DigitalEyez** — a national programme by BIPD (Bahagian
     Instruksional dan Pembelajaran Digital), JPPKK (Jabatan Pendidikan
     Politeknik dan Kolej Komuniti), and states it was awarded to Politeknik
     Port Dickson through a competitive pitching process, per what you told me.
   - One establishing photo, reusing the already-live
     `assets/implementation/archi-space-lab-overview.jpg` (no new asset needed).
   - Three zone cards (Immersive Investigation Area, Collaboration Area,
     Presentation Arena) — named exactly as the national guideline defines them,
     each tied to what DCA40462 students actually do there.
   - A source note limiting the equipment claims to only what's cross-checked
     against this project's own implementation photos (VR devices, Smart TV
     displays, workstations, the green-screen/motion-capture/turf zone) —
     deliberately NOT the guideline's full generic equipment list (e.g. no
     claim about laser cutters or prototyping machines, which aren't evidenced
     here).
   - A button linking the actual guideline PDF you supplied (Drive id
     `1DWGIbLyiwfbqyIChhZT5gr-0Ik_pm8it`, "04 USAGE & GUIDELINES_DigitalEyez_.pdf",
     BIPD/JPPKK, 2024, ISBN 978-967-0099-28-6).
   - A software/hardware stack table using exactly the list you gave in an
     earlier session (SketchUp/Unity/Unreal Engine; Twinmotion/Enscape/Reality
     Composer/WorldCast; AutoCAD/Revit/Vectorworks; VR headsets, AR/MR smart
     glasses, workstations, phones as AR devices) — captioned "as specified by
     the DCA40462 teaching team," since it isn't drawn from a signed document
     the way the SLT table on Page 05 is.
3. A short wayfinding note before the final bridge, pointing to Page 05 for
   curriculum documents/CDIO framework and Page 06 for real implementation
   photos and named student work — so Page 04 stays lean on purpose instead of
   duplicating either page.

**Deliberately not built:** the earlier AI-generated "Page 4" suggestion's dark-mode
redesign, its "100% spatial scale comprehension" metric, its "real-time critique vs
traditional red-line method" comparison framework, and its claimed 3-minute VR demo
video — none of these had a source, and the metric in particular read as invented.
Also not touched: the Kolb-stage labelling already on Page 03 (Concrete Experience →
Reflective Observation + Active Experimentation) — the new Page 04 content doesn't
introduce a conflicting Kolb framing.

Cache-busting bumped to `?v=20260902-page4tecc`. `node -c app.js` passed.

## 15. Page 05 content/link audit — all 8 Drive documents verified, one broken image fixed

Full audit of `model()` (Page 05) and its five sub-functions
(`curriculumProgressionEvidence`, `courseResultEvidence`, `cdioRecognition`,
`curriculumEvidence`, `sltScaffolding`):

- All 8 Google Drive documents cited on the page were checked against the live
  page text via `get_file_metadata`. Every figure and quote matched its source
  exactly: the DCA30364 CORR 68.3% PLO0103 result, the CDIO integrated module
  (DCA30114+DCA30123+DCA30132), the DCA40462 CIST 65%/35% CLO split, the
  DCA40462 project brief (4 scope options, "VR gears optional," YouTube
  submission requirement, DCA30364 model-reuse instruction), and the CDIO
  award certificate details. No wording or figure changes were needed — this
  page was clean before today's fix.
- Of the 4 local evidence files linked on the page, 3 loaded correctly on the
  live site (`evidence/dca40462-corr-2025-2026.pdf`,
  `evidence/dca40452-landscape-corr-2025-2026.pdf`,
  `evidence/cdio-programme-award-2025.pdf`). The 4th —
  `assets/cdio-programme-award.jpg`, the certificate photo in the
  `cdioRecognition()` panel — returned a 404 on the live site, same broken-image
  pattern as the RESPEX section fixed on Page 03.
- Fix: rather than dropping the image (the Page 03 approach), you supplied the
  actual certificate as a Drive PDF (id `15Ziz1c95QlEfxf1GQbaR4zSo5ZyudNbO`,
  "17. MOST CONSISTENT CDIO PRACTITIONER BY ACADEMIC PROGRAMME AWARD.pdf") —
  this is the same file already cited by the "Open original in Drive" button
  in that section. Page 1 (the certificate itself) was rendered out of the PDF
  and saved as `assets/cdio-programme-award.jpg` (1000px wide, ~170KB). Visually
  confirmed it matches the page copy exactly: Most Consistent CDIO Practitioner
  by Academic Programme Award, Diploma in Architecture, Politeknik Port
  Dickson, 9 September 2025, KSL Hotel Johor Bahru, signed by Ir. Dr. Mohamad
  Tarmizi Abu Seman (Malaysian Technical Doctorate Association).
- No app.js code change was needed — the `<img>` tag already pointed at the
  correct path; only the missing asset file was supplied. No cache-busting
  bump needed for this fix (image assets aren't versioned via the query
  string in this codebase).
- Not yet reviewed: the `stages`/`stageContent()` SPACE-cycle copy block —
  pending your call on whether to review that too.

## 16. Page 01 — national/departmental policy alignment section added

New function `nationalPolicyAlignment()`, inserted into `overview()` right
after `initiativeRationale()`. Two sourced strategic documents, both supplied
directly by you rather than pulled from the open web:

- **Ministry level (KPT):** "Kerangka Dasar Pendigitalan Pendidikan Tinggi
  2025–2030" (Rajah 2) — the chart you uploaded. Saved as
  `assets/policy/kerangka-dasar-pendigitalan-2025-2030.jpg` and shown in full
  (not cropped — added a `.media-proof.chart` CSS modifier so the dense
  infographic text stays legible instead of being cover-cropped to 420px like
  photo figures). Cites two of its bidang fokus — Kompetensi Digital and
  Infrastruktur dan Infostruktur — as the direct match to what ARCHI-SPACE
  does.
- **Department level (JPPKK):** "Pelan Strategik Politeknik dan Kolej
  Komuniti (PSPKK) 2026–2035," verified against the official 8-page "Rujukan
  Ringkas Hala Tuju Strategik POLYCC 2026-2035" you supplied (JPPKK Unit
  Strategik, Bahagian Koordinasi TVET, 11 Mei 2026; approved by MP JPPKK Bil
  6/2026, 8 Mei 2026). Saved as
  `evidence/pspkk-2026-2035-rujukan-ringkas.pdf` and linked directly. Quotes
  two of its 32 Objektif Strategik verbatim: T2.OS4 ("Mengintegrasikan
  teknologi memuncul dan digital termaju dalam kurikulum POLYCC") and T6.OS2
  ("Mempertingkatkan infrastruktur dan infostruktur digital").

**Deliberately not used:** an earlier AI-generated summary of the PSPKK plan
that named specific initiatives — "Digital Twin Campus," "Zero-Server
Initiative," "AI-Enabled Educators," "Smart Hub," "Industrial Sandbox" — with
T-codes like T1.OS2.I1. I read the actual 8-page official rujukan ringkas
end to end; it stops at the Objektif Strategik level and none of those
initiative names appear anywhere in it. The OS-level codes the summary used
(T6.OS2, T4.OS1, etc.) do map to real objectives, which is likely why it read
as credible, but the specific initiative names attached to them are not
confirmed by any JPPKK source I could access and are not on the site.

Tagged `AKRI · Rasional Inisiatif`, matching the specific AKRI rubric
criterion (10%) this section supports. Both source documents are self-hosted
in the zip rather than linked externally, since neither was shared with a
Drive link this time.

Cache-busting bumped to `?v=20260902-page1policy`. `node -c app.js` passed;
story.css brace balance verified.

## 17. Page 05 — collapsed into dropdowns to cut clutter, two sections kept open

You said Page 05 had a lot going on and asked for collapsible sections, but
wanted the important part left open. Asked which section(s) counted as
important; you chose the SPACE learning cycle and the CDIO curriculum
connection. Everything else on the page is now wrapped in `<details
class="reveal-panel">` dropdowns (same expand/collapse style already used on
Page 03), closed by default:

- **Stays fully open:** the CDIO curriculum connection (Conceive+Design /
  Implement / Operate cards, the source-note, and the cdio-flow-panel table),
  and the SPACE cycle (the "From the brief..." scope-options card, the
  section intro, the 5-stage Sense/Perceive/Analyse/Create/Evaluate button
  picker, and its stage detail panel).
- **Now collapsed:** "See the documented curriculum pipeline and
  methodology" (the ARCHI-KIT→DCA30364→DCA40462→ARCHI-SPACE pipeline cards
  plus the Phase B methodology strip); "See the assessment structure and
  course results" (CIST/CLO cards, the assessment-chain, and the
  DCA30364/DCA40462/DCA40452 course-results comparison); "See Student
  Learning Time and the scaffolding guides" (the 80-hour SLT table and the
  two studio reference books); "See the CDIO award recognition" (the
  Most Consistent CDIO Practitioner panel). The pre-existing "Explore the
  curriculum evidence" dropdown (course outline/CIST/brief links) was already
  collapsed and is unchanged.

No content was removed or reworded — every fact, figure, table and source
link is still on the page, just inside a closed-by-default disclosure. Added
two small CSS rules (`.reveal-panel>.assessment-chain` and
`.reveal-panel>.section-head` margins, in both the desktop and the
existing 620px mobile breakpoint) so the newly-nested bare grids/headings get
the same left/right spacing as the reveal-panel's existing p/grid2 children,
instead of sitting flush against the panel edge.

Cache-busting bumped to `?v=20260902-page5collapse`. `node -c app.js` passed;
story.css brace balance verified.

## 18. Page 05 — interactive 14-week ArchiLens timeline, with the full table in a dropdown

You asked where the week-by-week technical-skills schedule for ARCHI-KIT and
ARCHI-SPACE lives, then asked for a timeline illustration or interactive
version once we found it. The source is your own "ArchiLens: SPACE-Based
Immersive Learning Framework Integrated with CDIO" document — confirmed from
**two independent copies you supplied**: the 12-page PDF ("ARCHI SPACE.pdf",
rendered page-by-page and read visually to rule out column-scrambling) and
the `ArchiLens_14_Week_Pedagogical_Matrix.xlsx` spreadsheet you linked
afterwards. Both matched exactly across all 14 weeks and all 9 columns, so
the transcription below is cross-verified, not single-sourced.

**What was built**, inserted right after the SPACE cycle (so it reads as
"here is how SPACE plays out week by week"):

- A horizontal, click-through timeline of all 14 weeks (`.week-timeline`),
  colour-coded by CDIO project role (Conceive/Design/Implement/Operate).
  Clicking a week updates a detail card below with that week's CDIO role,
  its ArchiLens/SPACE stage, the pedagogical intention, the immersive
  learning experience, the learner action, the learning artefact, the
  evidence of learning, the scalability mechanism, and the technology/
  delivery — reusing the same interaction pattern as the SPACE 5-stage
  picker (`data-week`, mirroring `data-stage`).
- Below that, a closed-by-default `<details class="reveal-panel">` — "See
  the full 14-week table" — with the complete 9-column × 14-row table for
  anyone who wants to see everything at once, per your "condensed version
  first, full table in a dropdown" preference.
- Framed explicitly as **the project's own designed curriculum-planning
  document** ("AKRI · Pendekatan" badge, and a lead paragraph stating this
  is a planning/curriculum-design artefact cross-referenced against the
  signed CIST/CORR evidence above it — not itself a signed institutional
  syllabus), consistent with how the SPACE 5-stage cycle is already labelled
  "Proposed activity sequence."
- Full bilingual (EN/BM) content for all 14 weeks, all 9 columns.

**One naming discrepancy worth knowing about, not yet acted on:** the
ArchiLens source document's own SPACE cycle is **SEE → PERCEIVE → ANALYSE →
CREATE → EVALUATE → SEE AGAIN** (six states, with an explicit return loop).
The site's existing 5-stage SPACE picture (further up this page) uses
**Sense → Perceive → Analyse → Create → Evaluate** — five states, first
stage named "Sense" rather than "See," no "SEE AGAIN" loop. Both are
legitimate — the 5-stage version was likely an earlier articulation — but
they're not word-for-word identical. Left the existing 5-stage cycle
untouched; the new 14-week timeline uses the source document's own SPACE
labels as-is. Flag if you'd like these reconciled.

New CSS: `.archilens-timeline`, `.week-timeline`, `.week-detail`, and
`.pill.phase-*`/`.pill.space-tag` colour variants, plus a matching 620px
mobile rule. Cache-busting bumped to `?v=20260902-page5timeline`. `node -c
app.js` passed; story.css brace balance verified; visually tested in a
headless browser (button strip, week-switching, and the full-table
dropdown all confirmed rendering correctly).

## 19. Page 06 — content/link audit, one link fixed, two new photo galleries added

You asked for a full content/link audit of Page 06 — every Drive link,
student portfolio link, video and asset. Checked all of it:

- **15 local assets** (`assets/studio.jpg`, `assets/sevra.mp4`,
  `assets/base-model.jpg`, `assets/design-options.jpg`, and all 11
  `assets/implementation/*.jpg` files referenced by the two existing
  galleries) — confirmed live on your GitHub Pages site (fetched each URL;
  none 404'd).
- **9 Google Drive files/folders** (project-tour video, both sample
  e-portfolio PDFs, the reflection journal, the reflection survey Google
  Sheet, the survey instrument PDF, the impact poster, and both repository
  folders) — confirmed accessible via Drive metadata, and confirmed all are
  shared "anyone with the link can view," so external AKRI judges won't hit
  a login wall.
- **One link fixed:** the third "repository" button, "ARCHI-KIT assembly
  instructions," used an org-scoped URL format
  (`drive.google.com/a/polipd.edu.my/open?id=...`). The file itself is
  shared publicly, but this URL shape is a known source of unnecessary
  Google account/login friction for outside visitors. Changed it to the
  same `drive.google.com/file/d/<id>/view` format used by every other Drive
  link on the page.
- **Both student Canva portfolio sites** (`nurshasha.my.canva.site`,
  `katanamaammm.my.canva.site/batrisyiaasri`) resolve and serve real pages
  (confirmed live, though their content is JS-rendered so an automated
  fetch can't read it — the URLs match exactly what's printed inside the
  students' own sample e-portfolio PDFs, which is strong corroboration).
- **Both YouTube links** — could not get a clean automated read (YouTube
  rate-limited/blocked the fetch tool on repeated tries); URLs are
  well-formed and match what you originally supplied. Worth a manual
  click-check on your end since this is the one item I couldn't verify
  directly.
- **Instagram post link** — blocked by Instagram's own robots.txt, as
  expected (same as every other Instagram link checked this project); not
  independently verifiable by automated fetch.

**New photos added**, after you shared 15 more and we sorted through them
together: 6 went into a new "More from the lab" gallery (an AR-overlay
phone photo next to the physical ARCHI-KIT model, a page from the
department's own student-activity record showing AR-overlaid ARCHI-KIT
photos, and four more ARCHI-SPACE VR lab-session photos), and 5 went into a
new "Arkio: real-time collaborative design review" section documenting a
collaborative VR/AR-adjacent design tool used in lab sessions — explicitly
captioned as photographic evidence of use, **not** a claim that Arkio is
part of the signed DCA40462 course outline. Three of the fifteen photos
were held back by mutual agreement pending more context (a house exterior
render, an apartment-block render, and a presentation-to-a-panel photo) —
none had a confirmed connection to DCA40462/ARCHI-KIT/ARCHI-SPACE specific
enough to caption honestly, so they were left out rather than guessed at.
Both new galleries carry the same "confirm public-use permission, avoid
naming students without written consent" note already used on the existing
galleries.

Cache-busting bumped to `?v=20260902-page6photos`. `node -c app.js`
passed; story.css brace balance verified; visually tested in a headless
browser (both new galleries confirmed rendering with the real photos and
correct captions).

## 20. Page 01 — implementation semester corrected to Semester 4

You flagged that the "Implementation" period shown on Page 01 said
"Semester 2 · Session 2025/2026" and should read Semester 4 (briefly set
to Semester 3 first, then corrected). Updated both places this appears —
the "Initiative at a glance" panel and the SMART Innovation Objective's
"Period" line — in both English and Bahasa Melayu (4 strings total;
confirmed via grep this was the only place "Semester 2" appeared anywhere
on the site, so nothing else needed touching). Note: Page 05's DCA40462
assessment panel already said "Semester 4 · Year 2" for a different
purpose (course-outline metadata) — that was untouched and is now simply
consistent with this change.

Cache-busting bumped to `?v=20260902-page1sem4`. `node -c app.js` passed.

## 21. Page 06 — live-portfolio screenshots added to Nur Batrisyia's card

You shared 2 screenshots taken from Nur Batrisyia's own live Canva
portfolio (the cover/title slide and the "A Glimpse of Me" bio slide) and
asked to add them to her portfolio entry. You confirmed you wanted them as
inline thumbnails inside her existing card in the "Evidence 02 · Design
Process e-portfolios" section, rather than a separate expandable gallery.

Both images were resized/compressed to web-friendly JPGs and added to a
new `assets/portfolio/` folder (`batrisyia-portfolio-cover.jpg`,
`batrisyia-portfolio-glimpse.jpg`). They sit side by side above her
existing "Open live portfolio" / "Inspect PDF sample" buttons, captioned
honestly as screenshots of the live site ("shown here so evaluators can
preview the content without leaving this page") — not new implementation
evidence, just a visual preview of what the linked portfolio contains.
Nur Shasha's card was left unchanged since no equivalent screenshots were
supplied for her.

Cache-busting bumped to `?v=20260902-page6portfolio`. `node -c app.js`
passed; story.css brace balance verified; visually tested in a headless
browser (both thumbnails confirmed rendering correctly in her card).

## 22. Page 06 — new "Design Studio Project 1" gallery (the 3 held-back photos)

You confirmed the 3 photos held back from the earlier 15-photo batch (a
two-storey house render, a multi-storey building render, and a photo of
students presenting a timber-construction diagram to a review panel) are
student Design Studio Project 1 outputs — the same DCA40462 e-portfolio
component already reflected in Nur Shasha's and Nur Batrisyia's 96%/98%
online-portfolio scores on this page. You asked for these as their own
standalone gallery rather than folded into the two existing portfolio
cards.

Added a new `studioProject1Gallery()` section, in a separate collapsed
`<details>` block placed right after the Evidence 02 portfolio cards (so
it stays visually and thematically tied to the e-portfolio evidence,
without disturbing the two existing featured-student cards). Captioned
honestly as design-studio deliverables and an assessment review session —
**not** immersive AR/VR tool use — consistent with how Arkio was
labelled. One caveat flagged directly in the on-page source-note: the two
design-render photos were supplied at low source resolution (155×129 and
281×195px) and look soft once enlarged in the gallery card; swap in
higher-resolution originals if you have them.

Assets added to `/assets/implementation/`: `studio-project1-house-render.jpg`,
`studio-project1-apartment-render.jpg`, `studio-project1-panel-presentation.jpg`.

Cache-busting bumped to `?v=20260902-page6studio1`. `node -c app.js`
passed; visually confirmed in a headless browser (gallery expands and all
three photos load, no new 404s introduced).

## 23. Page 06 — misattribution fix + class-wide video wall (7 groups)

You shared the official DCA40462 assessment spreadsheet (Session 2,
2025/2026) — the lecturer's rubric sheet covering both the online
portfolio (Project 1) and the group walkthrough videos (Project 2) for
the full DSB4A/DSB4B class (29 students). Cross-checking it against the
site turned up a **real error**, fixed regardless of anything else this
item covers:

**Fix:** Nur Shasha's second Evidence-01 card ("Immersive Technology" —
full project tour) previously paired a Drive link with
`youtube.com/watch?v=3lEedAJunqM`, captioned as her own video on her own
channel. Per the official rubric sheet, that video actually belongs to
**Umairah Binti Kamaruzaman** (group "ECO DIGITAL"), not Nur Shasha — its
own title is "IMMERSIVE TECHNOLOGY (PROJECT TOUR)" and it sits on a
channel called "BUY IT OR SKIP IT?", not a channel of hers. Removed the
misattributed YouTube button and the "on her own YouTube channel" claim;
kept the Drive project-tour link, which the sheet doesn't speak to either
way.

**New section — "Class-wide immersive project videos":** the sheet shows
the class was split into 7 project groups (ARCHVIZ, HELIOVISION,
TECHNO-VISION, ECO DIGITAL, VR VISION, LAYAR, SEVRA), each submitting a
VR/AR walkthrough video — much stronger breadth-of-engagement evidence
than the 1-2 previously featured students. Added `classVideoWall()`
right after Evidence 01 (before the Evidence 02 portfolio section),
listing all 7: group name, student name + registration number, the
lecturer's brief rubric comment, and a verified YouTube link. Every
video was independently checked via YouTube's oEmbed endpoint (title +
channel) against the sheet before inclusion — this is also how the
Nur Shasha misattribution above was caught. Raw numeric rubric scores
were deliberately left off the public page (more conservative than
strictly necessary) — only group name, student name/ID and a qualitative
comment are shown.

Source-note on the new section flags, same as every other named-student
gallery on this page: confirm public-use permission for each of these
students before final external publication.

Assets: none (all links only, no new images). Cache-busting bumped to
`?v=20260902-page6videowall`. `node -c app.js` passed; story.css brace
balance verified; both the fix and the new section visually confirmed in
a headless browser.

## 24. Page 06 — Nur Shasha portfolio screenshot + DCA30364 document review

You uploaded a screenshot from Nur Shasha's own live Canva portfolio
(title slide + "Project achievements" panel, listing her Visual
Communication Excellence Award and the "E-loq (The Inception Shelter)"
project) and asked to add it to her card, the same treatment given to
Nur Batrisyia's screenshots earlier. Added
`assets/portfolio/shasha-portfolio-achievements.jpg` as a full-width
inline preview in her Evidence 02 card, above her action buttons, with
an honest caption. Because the E-loq project shown belongs to Design
Studio 3 (DCA30364) — a different course from the DCA40462
immersive-technology work featured everywhere else on this page — the
caption says so explicitly, so evaluators don't read it as DCA40462
evidence. (Added `.portfolio-preview img:only-child{width:100%}` to
story.css so a single-image card, like this one, fills the full card
width instead of sitting at half-width like the two-image layout.)

You also shared 4 official DCA30364 (Design Studio 3) documents — the
course outline, the CI (detailed course information/SLT breakdown), and
two assessment records (RPB/RPA continuous-assessment marks for DSB3A,
and a CORR performance-review report covering DSB3A+DSB3B, 54 students)
— asking where this could be added to the site. Reviewed in full;
findings written up in the project doc "DCA30364 Design Studio 3 —
Document Review & Eligibility Assessment" — no site changes made yet,
pending your decision (see below).

Cache-busting bumped to `?v=20260903-page6shashaportfolio`. `node -c
app.js` passed; story.css brace balance verified; visually confirmed in
a headless browser.

## 25. Page 05 — official DCA40462 topic structure (VR→AR→MR) added; two other requested changes found already live

You asked what changes were needed to enhance the site based on a batch of
new material: the RESPEx 2025 compilation PDF (confirming ARCHI-KIT's award
and which OTHER exhibition entries were and weren't PPD's own work), the
official signed Programme Information for the Diploma in Architecture, and
the official DCA40462 Course Information + Course Outline (effective 10 Jan
2026). Along the way I also checked and corrected your "Working Drawing 3 /
Augmented Reality then Virtual Reality" recollection: no such course exists
in any of the 4 official documents reviewed (2020 CDIO booklet, the current
Programme Structure, the DCA40462 CI, the DCA40462 Course Outline), and the
real official DCA40462 sequence is the reverse of what you recalled —
**Virtual Reality first (Weeks 1–4), then Augmented Reality (Weeks 5–9),
then Mixed Reality (Weeks 10–14)**. Nothing based on "Working Drawing 3" was
added to the site.

You approved three changes. Before building anything, I re-checked the live
app.js against each one:

1. **ARCHI-KIT's RESPEx 2025 recognition** — already fully implemented.
   `archiKitRecognition()` on Page 03 already includes a "RESPEX'25 Best
   Product Gold Award" card (9th Regional Educators and Students' Product
   Exhibition, 18–19 June 2025, Politeknik Negeri Medan, all 3 authors named),
   added in item 13 above. No change made — adding it again would have
   duplicated it.
2. **DCA30364 → DCA40462 → ARCHI-SPACE pipeline with Zurika Amnah's
   continuity as both course coordinator and published co-author** — already
   fully implemented. `archiKitDesignStudioBridge()` and the published-study
   citation in `evidenceEnhanced()` already carry this narrative. No change
   made.
3. **The official DCA40462 unit structure (VR→AR→MR)** — this was the one
   genuine gap. The site's Page 05 only had the project's own self-designed
   "ArchiLens 14-week matrix," explicitly labelled as a planning document,
   not the signed syllabus. Added a new section, `officialTopicStructure()`,
   directly after the ArchiLens timeline: a 3-row table (Topic 1.0 Virtual
   Reality in Architecture, Weeks 1–4, Project assessment; Topic 2.0
   Augmented Reality in Architecture, Weeks 5–9, E-Portfolio assessment;
   Topic 3.0 Mixed Reality in Architecture, Weeks 10–14, contributes to
   both), badged "Signed 10 Jan 2026," sourced directly from the newly
   supplied Course Outline. A source-note ties Zurika Amnah's dual role
   (course coordinator + ARCHI-KIT study co-author) together and names Nur
   Hidayah Binti Rosman as the verifying Head of Programme. A button links
   the new evidence file, `evidence/dca40462-course-outline-2025-2026.pdf`
   (the actual signed document you uploaded).

**What this means for you:** most of the approved scope turned out to
already be on the site from earlier rounds — this update is smaller than the
three-item approval might suggest, because two of the three were redundant
with existing work. If you still want the RESPEx recognition also folded
directly into the DCA40462 evidence table (rather than only its existing
standalone card in `archiKitRecognition()`), say so and I'll draft that as a
separate addition.

New CSS: `.official-topic-panel`, `.official-topic-panel .tablewrap`,
`.official-topic-panel .button`. New asset:
`evidence/dca40462-course-outline-2025-2026.pdf`. Cache-busting bumped to
`?v=20260903-officialtopics`. `node -c app.js` passed; story.css brace
balance verified (565 open / 565 close).

## 26. Page 02 / Page 03 reorganisation — ARCHI-KIT evidence consolidated to Page 03; Page 02 rebuilt around ARCHI-SPACE

You set a standing rule: ARCHI-KIT-related evidence lives on Page 03 only, and ARCHI-SPACE (the immersive continuation) needs a stronger "how/what" showcase for AKRI. Before this, Page 02 ("The starting point," titled "THE ARCHI-KIT FOUNDATION") duplicated evidence that Page 03 ("ARCHI-KIT Validation") already covered:

**Moved from Page 02 to Page 03** (no content rewritten — moved as-is):
- The product/classroom photo evidence grid (`archi-kit-product.png`, `archi-kit-classroom.png`) and its two-video reveal panel.
- `archiKitOutcomeGallery()` — the physical–digital construction outcome photos.
- The "How students use ARCHI-KIT" 4-step process panel.

These now render on Page 03, directly before the recognition/pedagogy section, under a new heading ("ARCHI-KIT product, AR and classroom evidence") with a badge noting it moved from Page 02.

**Kept on Page 02** (this is relationship/continuation content, not ARCHI-KIT evidence itself): the ARCHI-KIT×ARCHI-SPACE synergy panel and the ARCHI-KIT→DCA30364→DCA40462→ARCHI-SPACE pipeline bridge — both are about how ARCHI-KIT leads into ARCHI-SPACE, which is exactly the continuation story you asked to strengthen.

**New on Page 02** — `archiSpaceShowcase()`, replacing the space the moved content left behind: a "WHAT COMES NEXT · ARCHI-SPACE" panel answering where/what/how/proof in four cards, each linking deeper into the site rather than repeating it:
- WHERE: TECC 4.0 · DigitalEyez studio (links to Page 04).
- WHAT: the official VR→AR→MR topic sequence from the signed DCA40462 Course Outline (links to Page 05's new official-topics table, item 25).
- HOW: CDIO + the SPACE cycle (links to Page 05).
- PROOF: real sessions, class-wide videos, e-portfolios, reflection data (links to Page 06).

Everything in these four cards is drawn from facts already verified elsewhere on the site — nothing new was asserted.

**Not touched:** the old, unused `challenge()` function (superseded by `challengeEnhanced()`, which is what actually renders for the "challenge" route) — this is pre-existing dead code from an earlier iteration, unrelated to this request. Flagging it here in case you want it removed later to shrink the file; it isn't rendered anywhere so it's harmless as-is.

Verified: `node -c app.js` passed; story.css brace balance (569/569); headless-browser check confirms Page 02 no longer contains the product/classroom evidence heading and now shows the new showcase panel, while Page 03 now contains all three moved blocks; no console/page errors on Pages 02, 03 or 05.

Cache-busting bumped to `?v=20260903-page02page03reorg`.
