# The Eyes of the Eagle — website

A static, bilingual (Traditional Chinese / English) website for
《鷹眼中的榮耀》 / *The Eyes of the Eagle: See the Glory* by 郭景光 (Chris Kuo).

The site defaults to the **Chinese** edition at the root URL; English lives under `/en/`.

## What's here

```
index.html                  Chinese home page (default / root)
about.html                   Chinese preface + author's note
chapters/chapter-01.html … chapter-12.html   Chinese chapters

en/index.html                English home page
en/about.html                 English preface + author's note
en/chapters/chapter-01.html … chapter-12.html  English chapters

assets/css/style.css        All styling (day/night reading themes)
assets/js/main.js           Chapter drawer + day/night toggle
assets/images/               Cover, hero background, author photo, chapter illustrations
                              (shared between both languages — same artwork)
```

Every page has a bold "中文 / EN" switcher in the header that jumps to the same
chapter in the other language. No build step — it's plain HTML/CSS/JS, so it
runs as-is on GitHub Pages.

## Deploy on GitHub Pages (new repo, separate from Econ-news-site)

1. Create a new repository, e.g. `eyes-of-the-eagle` (keep it separate from `Econ-news-site` —
   they don't interact at all).
2. Push everything in this folder to the repo's `main` branch, at the repo root.
3. In the repo: **Settings → Pages → Source**, choose the `main` branch and `/ (root)` folder, then save.
4. Your site publishes at `https://<your-username>.github.io/eyes-of-the-eagle/`.

`Econ-news-site`'s own GitHub Pages site (if enabled) keeps its own separate URL —
enabling Pages on this repo has no effect on it.

## Customizing later

- Swap `assets/images/hero-bg.jpg` or `assets/images/cover.jpg` for a different cover crop.
- Edit chapter text directly in `chapters/chapter-NN.html` (Chinese) or `en/chapters/chapter-NN.html`
  (English) — each paragraph is a `<p>` tag.
- Colors and fonts are defined as CSS variables at the top of `assets/css/style.css`.
- To make English the default instead, swap `DEFAULT_LANG` if you regenerate from source, or simply
  swap the contents of `index.html`/`about.html`/`chapters/` with `en/index.html`/`en/about.html`/`en/chapters/`.

## A note on the Chinese text

Your `.tex` files didn't include a Chinese "Author's Note" (the back-cover blurb), so I translated
the English one myself for `about.html`. Worth a quick read-through if you have preferred official wording.

