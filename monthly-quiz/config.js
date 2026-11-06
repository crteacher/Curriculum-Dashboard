/* Monthly Skills Check — settings. This is the only file that changes month to month. */
window.MQ_CONFIG = {
  /* Paste the Google Apps Script web-app URL here (see setup steps). Leave '' until then. */
  scriptUrl: 'https://script.google.com/a/macros/cardinalritterprep.org/s/AKfycbzZ8o5CtgXgPmmlTBgmRQ7q_oTFCruZ0tlM7eaYBPaOP3SmLP-v5o0iPoIg0LMODDRcGA/exec',

  /* Which month's quiz students get by default. */
  current: '2026-11',

  /* After submitting, show students the correct answers? (true/false) */
  showAnswers: true,

  /* Teachers shown in the Teacher picker (recorded in the Sheet). */
  teachers: ['Halverson', 'Ofori', 'Stock', 'Adams', 'Bedard'],

  /* Class sections shown in the Class picker (recorded in the Sheet). */
  sections: ['A1', 'A2', 'A3', 'A4', 'B5', 'B6', 'B7', 'B8'],

  /* Each month: one list of 5 skill IDs, the same for every class (skills live in skills.js).
     SAMPLE skills for now — swap in the assistant principal's real list when it arrives. */
  months: {
    '2026-11': {
      label: 'November 2026',
      skills: ['alg.linear', 'pc.logeval', 'c1.power', 'c1.chain', 'c2.integral']
    }
  }
};
