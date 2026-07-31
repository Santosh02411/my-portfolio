# Santosh Madannavar — Portfolio

A full rebuild of the original portfolio: dark (true black) + light theme toggle,
an animated "ML pipeline" hero visual (Ingest → Train → Explain → Ship — a nod to
your actual ML pipeline work), scroll reveals, and content pulled from your GitHub
README and résumé.

## Structure
```
index.html      → all page content
style.css       → design system (CSS variables for both themes) + layout + animations
script.js       → theme toggle, mobile nav, scroll reveal, contact form
assets/         → resume PDF + images
```

## Run it locally
Just open `index.html` in a browser, or serve it:
```
python3 -m http.server 8000
```

## Deploy for free
- **GitHub Pages**: push this folder to a repo (e.g. `Santosh02411.github.io`), enable
  Pages in repo settings → done.
- **Vercel / Netlify**: drag-and-drop this folder in their dashboard.

## Things to double check before you publish
1. **Contact form** — it currently posts to `formsubmit.co/santoshmadannavar@gmail.com`.
   FormSubmit needs you to send one test message and click the confirmation link it
   emails you the first time, or messages won't arrive. It's free and needs no backend.
2. **"Delivery Sync"** is marked "in active development" per your GitHub README — update
   the status/description once it ships.
3. **Live demos** — Malware Detection now links to its Render deployment. Add more live
   demo links the same way as other projects go live: give the card's `.project-links`
   a second `<a class="demo-link">` pointing at the URL.
4. The "missing persons network" project you mentioned isn't in your public repos or
   README — send me the repo link/description and I'll add it as a proper project card.

## Theme system
Both themes are pure CSS variables in `style.css` under `html[data-theme="dark"]` and
`html[data-theme="light"]`. Change any hex value there to retheme the whole site instantly.
