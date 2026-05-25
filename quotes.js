// Empowering daily statements for pregnant women.
// Picked deterministically per calendar day so the website and email
// both show the same quote on a given day.

const QUOTES = [
  "Your body is doing something extraordinary — trust every cell of it.",
  "You are growing a whole person while still being one. That is power.",
  "Softness is strength. You can be both gentle and unshakeable.",
  "Rest is productive. Today, slowing down is the work.",
  "Every breath you take, your baby takes with you. Breathe deeply, mama.",
  "You don't have to be perfect — you only have to be present.",
  "The fact that you're tired means you're doing a tremendous amount.",
  "Your intuition is a compass. You already know more than you think.",
  "Strong is not loud. Strong is showing up, day after day, like you do.",
  "You are not just preparing to be a mother — you already are one.",
  "Your worth is not measured by what you produce. You are enough as you are.",
  "Today, ask for what you need. You deserve to be cared for, too.",
  "Bodies change. Strength stays. Beauty deepens.",
  "Hard days are not failures. They are part of the becoming.",
  "You are allowed to take up space — physically, emotionally, all of it.",
  "Your baby feels your love before they ever meet your face.",
  "Slow mornings are also victories.",
  "You are carrying a future. Be patient with the present.",
  "Tears are not weakness. They are pressure finding its way out.",
  "Your nervous system is theirs. Be tender with yourself today.",
  "There is no right way to feel. All of it is allowed.",
  "Every working day you finish is a gift to your future self.",
  "Pregnancy is not something to get through. It is something to be in.",
  "You are softer than you were, and stronger than you know.",
  "The world is brighter because you are growing in it.",
  "Your body holds an ancient wisdom. Let it lead.",
  "It is okay to slow down. The river still reaches the sea.",
  "You are doing brave, quiet, holy work.",
  "Your baby is lucky — they already have you.",
  "Even on the hard days, you are building something beautiful.",
  "Lean on the people who love you. That, too, is strength.",
  "You don't have to earn rest. It is already yours.",
  "What you feel matters. What you need matters. You matter.",
  "You are exactly the mother your baby needs.",
  "The ache, the joy, the weariness — all of it is sacred.",
  "Trust the timing. Your body knows what it is doing.",
  "Be kind to the woman in the mirror. She is doing something incredible.",
  "Your light has not dimmed — it has multiplied.",
  "You are not behind. You are exactly on time.",
  "Every kick is a tiny hello. Every breath is a tiny promise.",
  "You are not alone. Generations of women are with you.",
  "What an honor to be the first home your baby ever knows.",
  "You are allowed to feel everything and still be okay.",
  "Today, soften your shoulders. Today, soften your jaw. You're safe.",
  "Your courage is quiet, and it is enormous.",
];

function quoteForDate(date) {
  const d = date || new Date();
  // Days since epoch in local time
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = (d - start) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / 86400000);
  const idx = ((dayOfYear + d.getFullYear() * 7) % QUOTES.length + QUOTES.length) % QUOTES.length;
  return QUOTES[idx];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUOTES, quoteForDate };
}
if (typeof window !== 'undefined') {
  window.PregnancyQuotes = { QUOTES, quoteForDate };
}
