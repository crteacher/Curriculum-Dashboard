/* Monthly Skills Check — settings. This is the only file that changes month to month. */
window.MQ_CONFIG = {
  /* Paste the Google Apps Script web-app URL here (see setup steps). Leave '' until then. */
  scriptUrl: '',

  /* Which month's quiz students get by default. */
  current: '2026-11',

  /* After submitting, show students the correct answers? (true/false) */
  showAnswers: true,

  /* Course names shown in the course picker. */
  courses: {
    alg: 'College Algebra',
    precalc: 'Precalculus',
    calc1: 'Calculus 1',
    calc2: 'Calculus 2'
  },

  /* Each month: 5 skill IDs per course (skills live in skills.js).
     SAMPLE skills for now — swap in the assistant principal's real list when it arrives. */
  months: {
    '2026-11': {
      label: 'November 2026',
      skills: {
        alg:    ['alg.linear', 'alg.slope', 'alg.vertex', 'alg.linear', 'alg.slope'],
        precalc:['pc.endbehavior', 'pc.bounce', 'pc.logeval', 'pc.endbehavior', 'pc.bounce'],
        calc1:  ['c1.power', 'c1.limit', 'c1.chain', 'c1.power', 'c1.chain'],
        calc2:  ['c2.integral', 'c2.geoseries', 'c2.integral', 'c2.geoseries', 'c2.integral']
      }
    }
  }
};
