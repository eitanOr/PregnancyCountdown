# Maternity Leave Countdown 🌸

A daily countdown to **25 June 2026** that:

- Sends a beautifully designed email every morning at **10:00 Israel time**
- Hosts a live countdown website your wife can open any time
- **Skips Fridays, Saturdays, and Israeli public holidays** (no national holidays fall in the 25 May – 25 June 2026 window, so only weekends are excluded)
- Counts both **working days** and **working hours** (24h × workdays)

---

## What's in this project

```
pregnancy-countdown/
├── index.html                       ← the website (open in browser, or host)
├── send-email.js                    ← the daily email sender
├── package.json
└── .github/workflows/daily-email.yml ← runs the email every day at 10:00 IST
```

---

## Setup (≈10 minutes)

### 1. Create a GitHub repo and push this folder

```bash
cd pregnancy-countdown
git init
git add .
git commit -m "Initial commit"
gh repo create pregnancy-countdown --private --source=. --push
```
(or create the repo on github.com manually and push)

### 2. Host the website (free, via GitHub Pages)

In your repo on GitHub: **Settings → Pages → Source: `main` branch → `/ (root)` → Save**.

After ~1 minute your site is live at:
```
https://<your-username>.github.io/pregnancy-countdown/
```
Copy that URL. You'll paste it into the secrets in step 4.

### 3. Get a Gmail App Password

1. Make sure 2-Step Verification is on for your Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Create a new app password (label it "Countdown"). You'll get a 16-character password — copy it.

### 4. Add secrets to the repo

In your repo on GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

Add these six secrets:

| Name          | Value                                      |
|---------------|--------------------------------------------|
| `SMTP_HOST`   | `smtp.gmail.com`                           |
| `SMTP_PORT`   | `465`                                      |
| `SMTP_USER`   | your Gmail address (e.g. `you@gmail.com`)  |
| `SMTP_PASS`   | the 16-char app password from step 3       |
| `EMAIL_FROM`  | how it shows up, e.g. `"Your Husband <you@gmail.com>"` |
| `EMAIL_TO`    | your wife's email                          |
| `WEBSITE_URL` | the GitHub Pages URL from step 2           |

### 5. Test it now

In your repo: **Actions tab → "Daily Countdown Email" → Run workflow**.

Within ~30 seconds the email should arrive. If it works, you're done — it'll fire automatically every day at 10:00 Israel time.

---

## Tweaks

**Add a personal vacation day:** open `send-email.js` AND `index.html`, find the `HOLIDAYS` array, and add a date in `'YYYY-MM-DD'` format:
```js
const HOLIDAYS = [
  '2026-06-10', // we're traveling
];
```

**Change the target date:** edit `TARGET_DATE` in both files.

**Daylight Savings note:** Israel switches off IDT at the end of October. Since the countdown ends in June, you don't need to worry about it — but if you keep using this beyond October, change the cron to `0 8 * * *` (= 10:00 IST, UTC+2).

---

Made with care. ❤
# PregnancyCountdown
