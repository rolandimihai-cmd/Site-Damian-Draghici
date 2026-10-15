# Damian Drăghici & Brothers — Landing Page

Landing page pentru trupa **Damian Drăghici & Brothers**. Concept vizual: **FOC**. Fundal de noapte caldă, gradient de flacără, scântei animate, roata de car din scenografia trupei și motive de cusătură tradițională.

## Journey-ul paginii

| # | Secțiune | Rol |
|---|----------|-----|
| — | **Hero** | Prima impresie: numele trupei, „Focul nu se stinge. Se cântă.”, CTA-uri către rezervare și bilete |
| 01 | **Trupa** | Info structurat: Rădăcini, Lumea, Frăția, plus cifre-cheie |
| 02 | **Experiența** | Sales: „Cum se aprinde focul” în 4 timpi (scroll sticky + „temperatura sălii”), apoi 3 oferte (concerte, evenimente private/corporate, branduri) |
| 03 | **Destin** | Următorul concert (31.03.2027, Sala Palatului): countdown, link iaBilet, „Adaugă în calendar” (.ics) |
| 04 | **Muzica** | Discografia în 5 albume, cu vinil care iese din copertă la hover |
| 05 | **Legacy** | „Peste 20 de ani de foc aprins”: timeline cu fitil care arde la scroll |
| 06 | **Galerie** | Masonry + lightbox (tastatură și swipe) |
| 07 | **Rezervări** | Formular care deschide emailul cu cererea precompletată |

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
```

### Rulare locală

```bash
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

### Publicare

Merge pe orice hosting static: GitHub Pages (Settings → Pages → branch), Netlify, Vercel, Cloudflare Pages.

## De completat înainte de lansare

- [ ] **Email de rezervări**: acum e `booking@damiandraghici.ro`, o adresă **provizorie**. Se schimbă în `index.html` (`data-email` pe formular și linkul din secțiunea Rezervări).
- [ ] **Instagram / Facebook**: nu sunt încă în footer, pentru că nu am putut confirma conturile oficiale.
- [ ] **Coperțile albumelor**: coperțile din pagină sunt ilustrații CSS. Coperțile reale pot înlocui `.sleeve`.
- [ ] **Open Graph**: după alegerea domeniului, `og:image` trebuie trecut ca URL absolut.
- [ ] **Fotografii**: creditele UNTOLD (Julien Duval, RK) sunt luate din numele fișierelor. Restul fotografiilor nu au credit.
