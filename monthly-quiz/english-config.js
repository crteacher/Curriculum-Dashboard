/* English Monthly Skills Check — settings. Edit this file (not english-skills.js) to change who sees the quiz and what each month covers.
   Results go to the English Google Sheet (separate from the math Sheet). */
window.MQ_CONFIG = {
  /* Paste the English Sheet's own Apps Script web-app URL here (a separate Sheet and deployment from the math quiz). If this is ever blank, students cannot start the quiz; teachers can still preview with ?preview=1. */
  scriptUrl: 'https://script.google.com/macros/s/AKfycbwwOAjW8sjSRMqp8g20CWtqCn9rLud-TTByCXjNtreu7od70j4hVlii4kJpeiQGNA88pQ/exec',

  /* Which month's quiz students get from the plain link. */
  current: '2026-11',

  /* After submitting, show students the correct answer and a one-line reason? (true/false) */
  showAnswers: true,

  /* Teachers and class sections shown in the pickers (recorded in the Sheet). Edit these lists to change the pickers. */
  teachers: ['Mickey', 'Muschal', 'Mason', 'Jackson', 'Bender'],
  sections: ['A1', 'A2', 'A3', 'A4', 'B5', 'B6', 'B7', 'B8'],

  /* Each month: 5 skill IDs, the same for every class. Skill IDs:
       Punctuation:   en.comma  en.semi  en.runon  en.apos  en.extra
       Clarity:       en.agree  en.pronoun  en.tense  en.concise  en.modifier
       Rhetorical:    en.transition  en.addelete  en.order  en.goal
     Preview a month without saving results:  english.html?preview=1&month=2026-12  */
  months: {
    '2026-11': { label: 'November 2026', skills: ['en.comma', 'en.runon', 'en.agree', 'en.concise', 'en.transition'] },
    '2026-12': { label: 'December 2026', skills: ['en.semi', 'en.apos', 'en.pronoun', 'en.tense', 'en.addelete'] },
    '2027-01': { label: 'January 2027', skills: ['en.extra', 'en.comma', 'en.modifier', 'en.concise', 'en.order'] },
    '2027-02': { label: 'February 2027', skills: ['en.runon', 'en.semi', 'en.agree', 'en.pronoun', 'en.goal'] },
    '2027-03': { label: 'March 2027', skills: ['en.apos', 'en.extra', 'en.tense', 'en.modifier', 'en.transition'] },
    '2027-04': { label: 'April 2027', skills: ['en.comma', 'en.semi', 'en.concise', 'en.agree', 'en.addelete'] },
    '2027-05': { label: 'May 2027', skills: ['en.runon', 'en.pronoun', 'en.tense', 'en.order', 'en.goal'] }
  }
};
