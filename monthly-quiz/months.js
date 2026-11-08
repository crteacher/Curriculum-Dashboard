/* Monthly Skills Check — the common-assessment schedule (Missouri Learning Standards challenge areas).
   This file changes month to month:
     1) "current" = the month students get when they open the plain quiz link.
     2) "months"  = the 5 skills for each month (skill IDs live in skills.js; each month is the same for every class).
   To move a question to a different month, just move its ID. To preview any month without saving results,
   open the quiz link with  ?preview=1&month=2026-12  (use the month key shown below).                        */
window.MQ_CONFIG.current = '2026-11';
window.MQ_CONFIG.months = {
  '2026-11': {
    label: 'November 2026',
    skills: ['rp.unitrate', 'wp.equation', 'st.mean', 'py.hyp', 'pr.simple']
  },
  '2026-12': {
    label: 'December 2026',
    skills: ['un.convert', 'st.median', 'pav.composite', 'in.solve', 'da.assoc']
  },
  '2027-01': {
    label: 'January 2027',
    skills: ['rp.proportion', 'wp.plans', 'py.converse', 'co.symmetry', 'pr.experimental']
  },
  '2027-02': {
    label: 'February 2027',
    skills: ['st.dotplot', 'pav.cylinder', 'co.transform', 'in.write', 'da.twoway']
  },
  '2027-03': {
    label: 'March 2027',
    skills: ['rp.graph', 'wp.geom', 'py.applied', 'co.identify', 'pr.compound']
  },
  '2027-04': {
    label: 'April 2027',
    skills: ['un.bestbuy', 'st.compare', 'pav.slice', 'in.graph', 'da.trend']
  },
  '2027-05': {
    label: 'May 2027',
    skills: ['py.distance', 'pav.conesphere', 'in.justify', 'pr.nonreplace', 'da.outlier']
  }
};
