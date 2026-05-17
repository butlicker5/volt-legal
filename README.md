# Volt — Legal site

Public Terms of Service and Privacy Policy for the **Volt** Discord bot, ready to host on GitHub Pages.

```
volt-legal/
├─ index.html                  → landing page (links to both)
├─ terms-of-service/index.html → Terms of Service
├─ privacy-policy/index.html   → Privacy Policy
└─ README.md                   → this file
```

## One-time setup (≈3 minutes)

1. Go to <https://github.com/new> and create a **new PUBLIC repository** named **`volt-legal`**
   (must be public so Discord and users can reach the pages — it does **not** contain bot code).
2. Upload the contents of this `volt-legal` folder to the repo:
   - Easiest: on the new repo page click **"uploading an existing file"**, then drag in
     `index.html`, the `terms-of-service` folder, and the `privacy-policy` folder, and commit.
   - Or via git:
     ```bash
     cd volt-legal
     git init
     git add .
     git commit -m "Add Volt legal pages"
     git branch -M main
     git remote add origin https://github.com/butlicker5/volt-legal.git
     git push -u origin main
     ```
3. In the repo: **Settings → Pages**. Under **Build and deployment → Source**, choose
   **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute. Your live URLs will be:

   | Field in Discord Developer Portal | URL |
   |---|---|
   | **Terms of Service URL** | `https://butlicker5.github.io/volt-legal/terms-of-service/` |
   | **Privacy Policy URL**   | `https://butlicker5.github.io/volt-legal/privacy-policy/` |

   (Landing page: `https://butlicker5.github.io/volt-legal/`)

5. Paste those two URLs into the Discord Developer Portal → your app → **General Information**
   (the *Terms of Service URL* and *Privacy Policy URL* fields), then **Save Changes**.

## Updating later

Edit the HTML files, change the "Last updated" date in each, commit/push — GitHub Pages
redeploys automatically within a minute.

## Notes

- These documents are tailored to Volt's actual features (economy/BPconomy, casino-style
  games, leveling, anti-nuke/moderation, media commands) but are **not legal advice**. If you
  need formal legal cover, have a professional review them.
- Contact listed on the pages: **y810944@gmail.com** / Discord **@aexu**. Change these in all
  three HTML files if they ever change.
