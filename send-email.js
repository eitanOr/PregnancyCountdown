// send-email.js
// Computes the countdown to maternity leave and emails it.
// Designed to run from GitHub Actions on a daily schedule (10:00 Asia/Jerusalem).

const nodemailer = require('nodemailer');
const { quoteForDate } = require('./quotes');

// ==================== CONFIG ====================
const TARGET_DATE = new Date(Date.UTC(2026, 5, 25, 0, 0, 0)); // 25 June 2026 (month is 0-indexed)
const HOURS_PER_WORK_DAY = 24;
const NON_WORK_DAYS = [5, 6]; // Fri, Sat
const HOLIDAYS = [
  // 'YYYY-MM-DD' — add personal vacation days here
  // (No Israeli public holidays fall between 25 May – 25 June 2026)
];

// URL to the live website (set this in GitHub Actions secret WEBSITE_URL,
// or leave empty to skip the link in the email).
const WEBSITE_URL = process.env.WEBSITE_URL || '';

// ==================== DATE HELPERS ====================
// We work in Asia/Jerusalem local time for "today" so the countdown matches
// what she'd see on her phone.

function jerusalemToday() {
  // Get the current date in Asia/Jerusalem as an object {y, m, d}
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t) => parseInt(parts.find(p => p.type === t).value, 10);
  // Construct as UTC date at 00:00 to avoid TZ math; we only compare dates.
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
}

function ymd(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function weekday(d) {
  return d.getUTCDay(); // 0=Sun .. 6=Sat
}

function isWorkingDay(d) {
  if (NON_WORK_DAYS.includes(weekday(d))) return false;
  if (HOLIDAYS.includes(ymd(d))) return false;
  return true;
}

function countWorkingDays(from, to) {
  // Count working days strictly between `from` (exclusive) and `to` (exclusive).
  let count = 0;
  const cur = new Date(from);
  cur.setUTCDate(cur.getUTCDate() + 1);
  while (cur < to) {
    if (isWorkingDay(cur)) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

function calendarDaysBetween(from, to) {
  return Math.max(0, Math.ceil((to - from) / (1000 * 60 * 60 * 24)));
}

// ==================== COMPUTE ====================
const today = jerusalemToday();
const workDays = countWorkingDays(today, TARGET_DATE);
const workHours = workDays * HOURS_PER_WORK_DAY;
const calDays = calendarDaysBetween(today, TARGET_DATE);
const arrived = today >= TARGET_DATE;
const dailyQuote = quoteForDate(today);

const targetStr = new Date(TARGET_DATE).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});
const todayStr = new Date(today).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

// ==================== EMAIL HTML ====================
function buildHtml() {
  if (arrived) {
    return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5ecdf;font-family:Georgia,serif;">
<div style="max-width:520px;margin:0 auto;padding:40px 24px;text-align:center;color:#2a2520;">
  <div style="font-style:italic;color:#c97b63;font-size:18px;margin-bottom:12px;">good morning, my love</div>
  <h1 style="font-weight:300;font-size:36px;margin:0 0 24px;line-height:1.1;">
    <em style="color:#c97b63;">Today is the day.</em>
  </h1>
  <div style="background:linear-gradient(180deg,#fdf8ef,#e9b8a7);border-radius:24px;padding:36px 24px;margin:20px 0;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6b5d52;margin-bottom:14px;">maternity leave</div>
    <div style="font-size:46px;font-style:italic;color:#2a2520;">has arrived ✿</div>
  </div>
  <p style="font-style:italic;color:#6b5d52;font-size:15px;line-height:1.6;">
    You did it. Every working day, you showed up. Now rest, soften, breathe.
    <br>I love you. ❤
  </p>
</div></body></html>`;
  }

  const linkBlock = WEBSITE_URL ? `
    <div style="text-align:center;margin:24px 0 8px;">
      <a href="${WEBSITE_URL}" style="display:inline-block;padding:12px 26px;background:#c97b63;color:#fff;text-decoration:none;border-radius:100px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Open the countdown</a>
    </div>` : '';

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5ecdf;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:520px;margin:0 auto;padding:32px 22px;color:#2a2520;">

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;font-size:12px;color:#6b5d52;">
    <span style="font-style:italic;">For my love</span>
    <span style="letter-spacing:0.14em;text-transform:uppercase;">${todayStr}</span>
  </div>

  <div style="text-align:center;margin-bottom:24px;">
    <div style="font-style:italic;color:#c97b63;font-size:16px;margin-bottom:6px;">a small countdown,</div>
    <h1 style="font-weight:300;font-size:32px;margin:0 0 10px;line-height:1.1;">
      until <em style="color:#c97b63;">maternity leave</em>
    </h1>
    <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b5d52;">
      target · <strong style="color:#2a2520;">${targetStr}</strong>
    </div>
  </div>

  <div style="background:linear-gradient(180deg,#fdf8ef,#f8eedd);border:1px solid rgba(42,37,32,0.12);border-radius:24px;padding:38px 24px;text-align:center;margin-bottom:14px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6b5d52;margin-bottom:14px;">Working days remaining</div>
    <div style="font-size:96px;font-weight:300;line-height:0.9;letter-spacing:-0.04em;color:#2a2520;">${workDays}</div>
    <div style="font-style:italic;color:#c97b63;font-size:18px;margin-top:6px;">${workDays === 1 ? 'day of work left' : 'days of work left'}</div>
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:18px;border-collapse:separate;border-spacing:8px;">
    <tr>
      <td style="background:rgba(253,248,239,0.7);border:1px solid rgba(42,37,32,0.12);border-radius:16px;padding:18px 12px;text-align:center;width:50%;">
        <div style="font-size:30px;font-weight:300;color:#2a2520;">${workHours.toLocaleString()}</div>
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b5d52;margin-top:6px;">Working hours</div>
      </td>
      <td style="background:rgba(253,248,239,0.7);border:1px solid rgba(42,37,32,0.12);border-radius:16px;padding:18px 12px;text-align:center;width:50%;">
        <div style="font-size:30px;font-weight:300;color:#2a2520;">${calDays}</div>
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b5d52;margin-top:6px;">Calendar days</div>
      </td>
    </tr>
  </table>

  <div style="background:linear-gradient(135deg,rgba(233,184,167,0.25),rgba(138,154,123,0.18));border:1px solid rgba(42,37,32,0.12);border-radius:18px;padding:22px 22px 20px;margin:6px 0 4px;position:relative;">
    <div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b5d52;margin-bottom:8px;">For you, today</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:17px;line-height:1.5;color:#2a2520;">${dailyQuote}</div>
    <div style="margin-top:10px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#c97b63;">— with love ❤</div>
  </div>

  ${linkBlock}

  <p style="text-align:center;font-style:italic;color:#6b5d52;font-size:14px;line-height:1.6;margin-top:24px;">
    Every day closer is a day softer. <span style="color:#c97b63;">❤</span><br>
    You've got this, mama-to-be.
  </p>

</div></body></html>`;
}

function buildText() {
  if (arrived) {
    return `Good morning, my love.\n\nToday is the day — maternity leave has arrived. ✿\nI love you.\n`;
  }
  return [
    `Good morning, my love.`,
    ``,
    `Countdown to maternity leave (${targetStr}):`,
    ``,
    `  ${workDays} working ${workDays === 1 ? 'day' : 'days'} remaining`,
    `  ${workHours.toLocaleString()} working hours`,
    `  ${calDays} calendar days`,
    ``,
    `For you, today:`,
    `  "${dailyQuote}"`,
    ``,
    WEBSITE_URL ? `Open the countdown: ${WEBSITE_URL}` : '',
    ``,
    `Every day closer is a day softer. ❤`,
    `You've got this, mama-to-be.`,
  ].filter(Boolean).join('\n');
}

// ==================== SEND ====================
async function main() {
  const {
    SMTP_HOST = 'smtp.gmail.com',
    SMTP_PORT = '465',
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
    EMAIL_TO,
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
    console.error('Missing required env vars: SMTP_USER, SMTP_PASS, EMAIL_TO');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = arrived
    ? `🌸 Today's the day — maternity leave!`
    : `${workDays} working ${workDays === 1 ? 'day' : 'days'} until maternity leave 🌸`;

  const info = await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to: EMAIL_TO,
    subject,
    text: buildText(),
    html: buildHtml(),
  });

  console.log('Sent:', info.messageId);
  console.log(`Working days remaining: ${workDays}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
