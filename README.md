# fernandez-legacy.family

A celebration of the life of **Armando Fernandez** — June 3, 1954 – September 13, 2026.

The gathering is **Saturday, September 26, 2026, 3:00–7:00 PM, in Guttenberg, New Jersey.**

Static site, no build step, hosted on GitHub Pages at
[fernandez-legacy.family](https://fernandez-legacy.family/).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire page: hero, remembrance, the invitation, the RSVP form, photographs |
| `style.css` | All styling. The tokens at the top control colour, type, and spacing |
| `app.js` | Nav highlighting, RSVP submission, photo gallery. Enhancement only — the page works without it |
| `photos.json` | Ordered photo list driving the gallery. The Photographs section stays hidden while this is empty |
| `celebration.ics` | The "Save the date" download |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Serve files as-is, without Jekyll processing |

## The RSVP form

Live, posting to Formspree form `mzezpell`, and verified end to end.

It collects a **name**, an **email**, **how many people are coming**, and an optional
**memory of Armando**. Each RSVP is emailed to you and kept in the Formspree dashboard.
The field is named `email` so Formspree sets `Reply-To` — you can answer a guest by
replying to the notification.

Name, email and head count are required; the memory is not. To make email optional
instead, drop `required` from the `#f-email` input in `index.html` — but note the
invitation promises to email the venue address, so without it there is no way to reach
that guest.

The free tier allows about 50 submissions a month. If more are expected, upgrade before
sharing the link widely, because submissions over the cap are rejected.

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
- **Attire**, if the family wants to state it — add a line to the invitation.
- **A share image** at `images/armando-fernandez/share.jpg` (1200×630), then uncomment the
  `og:image` meta tag. This controls the preview when the link is sent by text or posted.

## Adding photographs

Photographs live in two sizes: `images/gallery/thumb/` (500x500 squares for the grid) and
`images/gallery/full/` (1200px longest side for the lightbox). `photos.json` lists them
**in display order**. That order is currently shuffled — one pass with a fixed seed, so it
is stable for every visitor rather than changing per page load. Rearranging the entries in
the file is all it takes to impose a deliberate order later.

```json
{
  "photos": [
    { "thumb": "images/gallery/thumb/wedding-three.jpg",
      "full":  "images/gallery/full/wedding-three.jpg",
      "alt":   "Armando with the bride and groom at Paige and Joey's wedding" }
  ]
}
```

To add one, produce both sizes and append an entry. The photographs carry no
descriptions: gallery images are marked decorative (`alt=""`) and each thumbnail button is
labelled by position instead, so it still has an accessible name. The lightbox caption
shows only the position in the set.

```sh
magick SOURCE -auto-orient -resize 500x500^ -gravity center -extent 500x500 \
  -strip -quality 78 images/gallery/thumb/NAME.jpg
magick SOURCE -auto-orient -resize 1200x1200\> -strip -quality 80 \
  images/gallery/full/NAME.jpg
```

`-auto-orient` bakes in any EXIF rotation, which phone photographs rely on, and `-strip`
removes the remaining EXIF **including GPS coordinates** — worth keeping, since these go
on a public page.

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
- `[hidden] { display: none !important }` sits in the reset on purpose. Several elements
  here are toggled with the `hidden` attribute while also carrying a `display` of their
  own, and an author `display` silently beats the browser's `[hidden]` rule.
- One animation only: the hero's entrance on load. It is disabled under
  `prefers-reduced-motion`.

## Analytics

Page counts come from [GoatCounter](https://www.goatcounter.com), the same free,
privacy-friendly counter used on the other family sites. No cookies, no personal data, and
nothing that needs a consent banner.

The snippet at the foot of `index.html` reports to site code **`fernandez-legacy`**. That
code has to exist before anything is recorded — sign in at goatcounter.com and add a site
with exactly that code. Until then the script 404s harmlessly and the page is unaffected.
If you choose a different code, update the `data-goatcounter` URL to match.

Stats are then at <https://fernandez-legacy.goatcounter.com>.

## Local preview

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. A server is needed rather than opening the file directly,
because `photos.json` is fetched.
