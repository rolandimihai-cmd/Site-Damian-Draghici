# Damian Drăghici & Brothers — Landing Page

Landing page pentru trupa **Damian Drăghici & Brothers**. Concept vizual: **FOC**. Fundal de noapte caldă, gradient de flacără, scântei animate, roata de car din scenografia trupei și motive de cusătură tradițională.

## Journey-ul paginii

| # | Secțiune | Rol |
|---|----------|-----|
| — | **Hero** | Numele trupei, „Sunetul petrecerii tale. Energia pe care n-o uiți.”, butoane „Contactează trupa” și „Bilete DESTIN” |
| 01 | **Trupa** | Povestea pe scurt, plus cifre-cheie (2006, 20+ ani, 6 albume, Sala Palatului) |
| 02 | **Experiența** | „Adu spectacolul la tine”: 3 oferte (concerte & festivaluri, evenimente private & corporate, proiecte speciale) |
| 03 | **Destin** | Următorul concert (31.03.2027, Sala Palatului): countdown, link iaBilet, „Adaugă în calendar” (.ics) |
| 04 | **Muzica** | „Muzica noastră”: 6 albume, cu vinil care iese din copertă la hover, plus linkuri Spotify, YouTube și Apple Music |
| 05 | **Video** | Videoul crește de la un cadru la ecran complet la scroll; pornește fără sunet, cu butoane pentru sunet, pauză și ecran complet |
| 06 | **Booking** (`#contact`) | „Cere o ofertă”: formular care deschide emailul cu cererea precompletată |

## Tehnic

- HTML/CSS/JS simplu, fără build și fără dependențe (doar Google Fonts: Anton, Fraunces, Manrope).
- Imagini WebP optimizate în 2 dimensiuni (`*-sm.webp` pentru mobil), lazy-loading.
- Animațiile respectă `prefers-reduced-motion`; conținutul e vizibil și fără JavaScript.
- SEO: meta, Open Graph, JSON-LD (`MusicGroup` + `MusicEvent` pentru DESTIN).

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/          # fotografii din Drive „Damian & Brothers / Poze site”
assets/video/        # damian-brothers.mp4 (1080p) și damian-brothers-720.mp4 (mobil)
```

### Rulare locală

```bash
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

### Publicare

Merge pe orice hosting static: GitHub Pages (Settings → Pages → branch), Netlify, Vercel, Cloudflare Pages.

## De completat înainte de lansare

- [ ] **Videoul de prezentare**: clientul a cerut înlocuirea cu varianta modificată (`assets/video/`).
- [ ] **Spotify și Apple Music**: linkurile duc acum la căutarea „Damian & Brothers”; trebuie înlocuite cu profilurile oficiale (în `index.html`, secțiunea Muzica și footer).
- [ ] **Email de rezervări**: acum e `booking@damiandraghici.ro`, o adresă **provizorie**. Se schimbă în `index.html` (`data-email` pe formular și linkul din secțiunea Booking).
- [ ] **Instagram / Facebook**: nu sunt încă în footer, pentru că nu am putut confirma conturile oficiale.
- [ ] **Coperțile albumelor**: coperțile din pagină sunt ilustrații CSS. Coperțile reale pot înlocui `.sleeve`.
- [ ] **Open Graph**: după alegerea domeniului, `og:image` trebuie trecut ca URL absolut.
- [ ] **Fotografii**: fotografiile folosite nu au încă credite de fotograf.
