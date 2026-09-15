# fernandez-legacy.family

A celebration of the life of **Armando Fernandez** — June 3, 1954 – September 13, 2026.

The gathering is **Saturday, September 26, 2026, 3:00–7:00 PM, in Guttenberg, New Jersey.**

Static site, no build step, hosted on GitHub Pages at
[fernandez-legacy.family](https://fernandez-legacy.family/).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire page: hero, remembrance, the invitation, the reply form, photographs |
| `style.css` | All styling. The tokens at the top control colour, type, and spacing |
| `app.js` | Nav highlighting, reply submission, photo gallery. Enhancement only — the page works without it |
| `photos.json` | Photo list. The Photographs section stays hidden while this is empty |
| `celebration.ics` | The "Save the date" download |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Serve files as-is, without Jekyll processing |

## Before you share the link

**Connect the reply form.** It currently has no destination — submitting shows an inline
message saying so, rather than failing silently.

1. Sign up at [formspree.io](https://formspree.io) and create a form (free tier is about
   50 submissions a month, which should be ample).
2. Copy the form ID — the `xxxxxxxx` from `https://formspree.io/f/xxxxxxxx`.
3. In `index.html`, replace `YOUR_FORM_ID` in the `<form action="...">` attribute.

The form collects a **name**, **how many people are coming**, and an optional
**memory of Armando**. Each reply is emailed to you and kept in the Formspree dashboard.

## Going live

**1. Turn on GitHub Pages.** In the repository: **Settings → Pages → Source: Deploy from a
branch → `main` / `/ (root)`**. It publishes first at `joeybutton.github.io/armando-legacy`.

**2. Point the domain at GitHub.** At your DNS provider for `fernandez-legacy.family`:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
AAAA  @    2606:50c0:8000::153
AAAA  @    2606:50c0:8001::153
AAAA  @    2606:50c0:8002::153
AAAA  @    2606:50c0:8003::153
CNAME www  joeybutton.github.io.
```

**3.** Back in **Settings → Pages**, confirm the custom domain reads
`fernandez-legacy.family`, then tick **Enforce HTTPS** once the certificate is issued.
That can take up to an hour after DNS propagates.

## Still to come

- **A photograph of Armando.** Save it to `images/armando-fernandez/portrait.jpg` and
  uncomment the `<img class="portrait">` line in the hero. It is framed with an arched
  top; a vertical portrait suits it best.
- **The remembrance.** The page currently says a fuller remembrance is still being
  written, which is honest and reads fine in the meantime. Replace the two paragraphs and
  the italic note under *Remembering Armando* when you have the text.
- **The venue.** The invitation says the venue is being arranged and asks people to leave
  their name for the address. Once it is settled, replace `Guttenberg, New Jersey` in the
  invitation, delete the `.where-note` paragraph, and update `LOCATION` in
  `celebration.ics` and the `address` in the JSON-LD block at the foot of `index.html`.
- **Attire**, if the family wants to state it — add a line to the invitation.
- **A share image** at `images/armando-fernandez/share.jpg` (1200×630), then uncomment the
  `og:image` meta tag. This controls the preview when the link is sent by text or posted.

## Adding photographs

Put the files in `images/gallery/`, then list them in `photos.json`:

```json
{
  "photos": [
    { "src": "images/gallery/armando-shore.jpg", "alt": "Armando at the shore", "caption": "Summer, 1998" },
    { "src": "images/gallery/armando-kids.jpg",  "alt": "Armando with Justin and Paige" }
  ]
}
```

`alt` and `caption` are optional. The Photographs section appears on its own as soon as
there is at least one entry.

## Design notes

For anyone editing this later:

- **One typeface**, Newsreader, at optical sizes. Inter appears only in small functional
  text — the nav, field hints, the venue note.
- **One accent**, the deep olive `--olive`, used only for actions, the rule under
  Armando's name, and focus rings. Adding a second accent will cheapen it.
- **The date is the one loud thing on the page.** Everything else stays quiet so it lands.
  If something new needs emphasis, take emphasis away from somewhere else.
- No cards, no drop shadows. Content sits on the paper.
- All text meets WCAG AA against the paper (the lightest, `--ink-soft` at 13px, is 5.3:1),
  and interactive edges use `--rule-firm` to clear the 3:1 required of UI boundaries.
- One animation only: the hero's entrance on load. It is disabled under
  `prefers-reduced-motion`.

## Local preview

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. A server is needed rather than opening the file directly,
because `photos.json` is fetched.
