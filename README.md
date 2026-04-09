# Portfolio site

Static personal site for Chibuike Onuoha. Plain HTML + CSS, no build step,
no framework, no JavaScript dependencies. Designed to drop into a GitHub
Pages repo and just work.

## What's in here

```
portfolio/
├── index.html              home page (hero, selected work, stack, contact)
├── about.html              longer personal intro and work philosophy
├── now.html                what I'm working on right now
├── cv.html                 on-page CV, print-to-PDF friendly
├── colophon.html           how the site is built
├── css/
│   └── style.css           single stylesheet
├── assets/
│   └── favicon.svg         svg favicon
└── writing/
    ├── index.html                      case studies index
    ├── eks-migration-zeeh.html         ★ anchor case study, 8-week migration
    ├── karpenter-incident.html         postmortem: HPA vs Karpenter
    ├── terraform-gitops-rollout.html   click-ops to GitOps in a quarter
    ├── cost-25-percent.html            AWS bill cut 25%, how and why
    ├── observability-stack.html        Datadog vs Prometheus+Grafana+Loki
    ├── iam-least-privilege.html        practical IAM workflow
    └── job-bot.html                    write-up of this very project
```

Total size: ~120 KB of HTML + 6 KB of CSS. Loads instantly on any connection.

## How to deploy to GitHub Pages

The existing repo is `buik1/devops-portfolio-website`. You have two options.

### Option 1: replace everything

1. Clone the repo locally.
   ```
   git clone https://github.com/buik1/devops-portfolio-website.git
   ```
2. Delete everything inside (except `.git/` and any `CNAME` file if you have a custom domain).
3. Copy the contents of this `portfolio/` folder into the repo root.
4. Commit and push.
   ```
   git add .
   git commit -m "Rebuild portfolio as static site"
   git push
   ```
5. GitHub Pages should redeploy automatically. Check the Settings → Pages
   tab to confirm the branch is `main` and the folder is `/ (root)`.

### Option 2: put it in a subfolder

If you want to keep your existing site and add this as a subdirectory:

1. Copy the `portfolio/` folder into the repo as-is.
2. Change the repo's GitHub Pages source to serve from `/portfolio`.
3. The site will then live at `buik1.github.io/devops-portfolio-website/portfolio/`.

I recommend **Option 1**.

## How to run it locally

No build. Just open `index.html` in a browser.

If you want a proper local server (so relative paths and the writing
subdirectory work cleanly):

```
cd portfolio
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## How to edit

Everything is plain HTML. To change a headline, open the file in any
text editor and change the text. The styling is driven by CSS variables
at the top of `css/style.css` — change the accent colour or the fonts
there once and the whole site updates.

### Adding a new writing piece

1. Copy an existing file in `writing/` that has the structure you want
   (the karpenter-incident.html or cost-25-percent.html files are good
   templates).
2. Rename it, edit the content.
3. Add a link to it from `writing/index.html` and optionally from
   `index.html` under "Selected work".

## Things I deliberately didn't do

- No analytics. Nothing is tracking your visitors.
- No web fonts. The site uses your system's fonts. It loads instantly
  and it respects your system settings.
- No JavaScript for content. A couple of `javascript:` links for printing,
  nothing else.
- No dark mode yet. On the list.
- No framework. Because the JS framework you pick today has a shorter
  half-life than the writing on the site.
