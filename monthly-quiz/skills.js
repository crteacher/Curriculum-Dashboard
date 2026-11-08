/* Monthly Skills Check — skill bank.
   Each skill: MQ.def(id, course, title, gen). gen(r) gets a seeded RNG and returns one question.
   Add a new skill = add one MQ.def block here. A month's quiz = a list of skill IDs in config.js. */
(function () {
  var MQ = window.MQ = { skills: {} };

  /* ---------- seeded RNG (same seed => same question, every time) ---------- */
  MQ.rng = function (seed) {
    var a = seed >>> 0;
    function f() {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var r = { f: f };
    r.int = function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); };
    r.nz = function (lo, hi) { var v; do { v = r.int(lo, hi); } while (v === 0); return v; };
    r.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    r.shuffle = function (arr) {
      var x = arr.slice();
      for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)); var t = x[i]; x[i] = x[j]; x[j] = t; }
      return x;
    };
    return r;
  };
  MQ.def = function (id, course, title, gen) { MQ.skills[id] = { id: id, course: course, title: title, gen: gen }; };

  /* ---------- answer reading + grading ---------- */
  MQ.parseNum = function (s) {
    s = String(s == null ? '' : s).replace(/[\u2212\u2013]/g, '-').trim().replace(/%$/, '');
    var mx = s.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);            // mixed number: 1 1/12
    if (mx) { var dd = parseFloat(mx[4]); return dd === 0 ? NaN : (mx[1] === '-' ? -1 : 1) * (parseFloat(mx[2]) + parseFloat(mx[3]) / dd); }
    s = s.replace(/\s+/g, '');
    if (!s) return NaN;
    var m = s.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
    if (m) { var d = parseFloat(m[2]); return d === 0 ? NaN : parseFloat(m[1]) / d; }
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
    return NaN;
  };
  MQ.grade = function (q, given) {
    if (q.type === 'mc') return given === q.correct;
    var v = MQ.parseNum(given);
    return isFinite(v) && Math.abs(v - q.ans) <= q.tol;
  };

  /* ---------- display helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function reduce(n, d) { var g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return [n, d]; }
  function mi(n) { return n < 0 ? '−' + (-n) : String(n); }              // signed integer with a true minus
  function frac(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function pw(p) { return p === 0 ? '' : p === 1 ? '<i>x</i>' : '<i>x</i><sup>' + p + '</sup>'; }
  function termStr(c, p, first) {
    var a = Math.abs(c), body = (p === 0) ? String(a) : ((a === 1 ? '' : a) + pw(p));
    if (first) return (c < 0 ? '−' : '') + body;
    return (c < 0 ? ' − ' : ' + ') + body;
  }
  function polyStr(cs) {                      // cs[p] = coefficient of x^p, printed high -> low
    var out = '', first = true;
    for (var p = cs.length - 1; p >= 0; p--) { if (!cs[p]) continue; out += termStr(cs[p], p, first); first = false; }
    return out || '0';
  }
  function lin(a, b) { return termStr(a, 1, true) + (b ? termStr(b, 0, false) : ''); }
  function xminus(a) { return a === 0 ? '<i>x</i>' : '<i>x</i> ' + (a > 0 ? '− ' + a : '+ ' + (-a)); }
  function fshow(n, d) { return d === 1 ? String(n) : n + '/' + d; }
  function numQ(html, ans, show, meta) {
    var isInt = Math.abs(ans - Math.round(ans)) < 1e-9;
    return {
      type: 'num', html: html, ans: ans, tol: isInt ? 1e-6 : 0.0051,
      show: show || String(ans),
      hint: isInt ? 'Enter a number.' : 'Enter a fraction (like 3/4) or a decimal rounded to at least 2 places.',
      meta: meta
    };
  }
  function mcQ(html, choices, correct, meta) {
    return { type: 'mc', html: html, choices: choices, correct: correct, show: choices[correct], meta: meta };
  }

  /* =====================================================================
     ALGEBRA
     ===================================================================== */
  MQ.def('alg.linear', 'alg', 'Solve a linear equation (variable on both sides)', function (r) {
    var x = r.nz(-9, 9), a = r.int(2, 9), c = r.nz(-6, 6);
    if (c === a) c = -a;
    var b = r.nz(-12, 12), d = a * x + b - c * x;
    return numQ('Solve for <i>x</i>.<div class="eq">' + lin(a, b) + ' = ' + lin(c, d) + '</div>', x, null,
      { lhs: function (v) { return a * v + b; }, rhs: function (v) { return c * v + d; } });
  });

  MQ.def('alg.slope', 'alg', 'Slope from two points', function (r) {
    var x1 = r.int(-6, 6), dx = r.nz(-6, 6), y1 = r.int(-8, 8), dy = r.nz(-9, 9);
    var x2 = x1 + dx, y2 = y1 + dy, f = reduce(dy, dx);
    return numQ('Find the slope of the line through (' + mi(x1) + ', ' + mi(y1) + ') and (' + mi(x2) + ', ' + mi(y2) + ').',
      f[0] / f[1], fshow(f[0], f[1]), { x1: x1, y1: y1, x2: x2, y2: y2 });
  });

  MQ.def('alg.vertex', 'alg', 'Vertex of a parabola', function (r) {
    var h = r.nz(-6, 6), a = r.pick([1, 2, 3, -1, -2, -3]), b = -2 * a * h, c = r.int(-9, 9);
    return numQ('What is the <i>x</i>-coordinate of the vertex of the parabola <i>y</i> = ' + polyStr([c, b, a]) + '?', h, null,
      { f: function (v) { return a * v * v + b * v + c; }, a: a });
  });

  /* =====================================================================
     PRECALCULUS
     ===================================================================== */
  MQ.def('pc.endbehavior', 'precalc', 'End behavior of a polynomial', function (r) {
    var deg = r.int(3, 6), lc = r.nz(-5, 5);
    var pows = []; for (var p = 0; p < deg; p++) pows.push(p);
    pows = r.shuffle(pows).slice(0, r.int(2, 3));
    var terms = [[lc, deg]]; pows.forEach(function (p) { terms.push([r.nz(-9, 9), p]); });
    terms = r.shuffle(terms);
    var s = terms.map(function (t, i) { return termStr(t[0], t[1], i === 0); }).join('');
    var right = lc > 0 ? 'rises' : 'falls', left = (deg % 2 === 0) ? right : (lc > 0 ? 'falls' : 'rises');
    var all = [['Rises', 'rises'], ['Falls', 'falls'], ['Rises', 'falls'], ['Falls', 'rises']]
      .map(function (c) { return { t: c[0] + ' to the left, ' + c[1] + ' to the right', l: c[0].toLowerCase(), rt: c[1] }; });
    all = r.shuffle(all);
    var idx = 0; all.forEach(function (c, i) { if (c.l === left && c.rt === right) idx = i; });
    return mcQ('Which describes the end behavior of <i>f</i>(<i>x</i>) = ' + s + '?',
      all.map(function (c) { return c.t; }), idx,
      { terms: terms, deg: deg, lc: lc, left: left, right: right });
  });

  MQ.def('pc.bounce', 'precalc', 'Zeros: cross or bounce (multiplicity)', function (r) {
    var zs = []; while (zs.length < 3) { var z = r.int(-6, 6); if (zs.indexOf(z) < 0) zs.push(z); }
    var bounce = zs[0], mult = [{ z: bounce, m: r.pick([2, 4]) }, { z: zs[1], m: r.pick([1, 3]) }, { z: zs[2], m: r.pick([1, 3]) }];
    var k = r.pick([1, 1, 2, -1, -3]);
    var fs = r.shuffle(mult).map(function (t) {
      var base = t.z === 0 ? '<i>x</i>' : '(<i>x</i> ' + (t.z > 0 ? '− ' + t.z : '+ ' + (-t.z)) + ')';
      return base + (t.m > 1 ? '<sup>' + t.m + '</sup>' : '');
    }).join('');
    var pre = k === 1 ? '' : (k === -1 ? '−' : String(Math.abs(k) === k ? k : mi(k)));
    var decoy = -bounce; if (zs.indexOf(decoy) >= 0 || decoy === bounce) { do { decoy = r.int(-7, 7); } while (zs.indexOf(decoy) >= 0); }
    var vals = zs.concat([decoy]).sort(function (a, b) { return a - b; });
    var choices = vals.map(function (v) { return '<i>x</i> = ' + mi(v); });
    return mcQ('The graph of <i>f</i>(<i>x</i>) = ' + pre + fs + ' touches the <i>x</i>-axis and turns around (it does not cross) at which <i>x</i>-value?',
      choices, vals.indexOf(bounce),
      { k: k, mult: mult, vals: vals, bounce: bounce, f: function (v) { return mult.reduce(function (p, t) { return p * Math.pow(v - t.z, t.m); }, k); } });
  });

  MQ.def('pc.logeval', 'precalc', 'Evaluate logarithm expressions', function (r) {
    var b = r.pick([2, 2, 3, 5]), top = b === 5 ? 3 : 4;
    var e1 = r.int(1, top), e2 = r.int(1, top), e3 = r.int(1, top);
    function L(e) { return 'log<sub>' + b + '</sub> ' + Math.pow(b, e); }
    return numQ('Evaluate without a calculator: ' + L(e1) + ' + ' + L(e2) + ' − ' + L(e3), e1 + e2 - e3, null,
      { b: b, e: [e1, e2, e3] });
  });

  /* =====================================================================
     CALCULUS 1
     ===================================================================== */
  MQ.def('c1.power', 'calc1', 'Derivative of a polynomial at a point', function (r) {
    var n = r.int(3, 5), m = r.pick([1, 2]), a = r.nz(-6, 6), b = r.nz(-9, 9), c = r.nz(-9, 9);
    var cs = []; for (var i = 0; i <= n; i++) cs.push(0);
    cs[n] = a; cs[m] = b; cs[0] = c;
    var k = r.pick([-2, -1, 1, 2, 3]);
    return numQ('Let <i>f</i>(<i>x</i>) = ' + polyStr(cs) + '. Find <i>f</i>′(' + mi(k) + ').',
      a * n * Math.pow(k, n - 1) + b * m * Math.pow(k, m - 1), null,
      { f: function (v) { return a * Math.pow(v, n) + b * Math.pow(v, m) + c; }, k: k });
  });

  MQ.def('c1.limit', 'calc1', 'Limit of a 0/0 rational expression', function (r) {
    var a = r.nz(-5, 5), b = r.nz(-6, 6), c = a * a + a * b;
    return numQ('Evaluate <span class="lim">lim<sub><i>x</i>→' + mi(a) + '</sub></span> ' +
      frac('<i>x</i><sup>2</sup>' + termStr(b, 1, false) + (c ? termStr(-c, 0, false) : ''), xminus(a)),
      2 * a + b, null,
      { f: function (v) { return (v * v + b * v - c) / (v - a); }, a: a });
  });

  MQ.def('c1.chain', 'calc1', 'Chain rule at a point', function (r) {
    var n = r.pick([3, 4, 5]), a = r.pick([2, 3, 4, -2, -3]), k = r.int(-2, 2), u0 = r.pick([-2, -1, 1, 2, 3]);
    var b = u0 - a * k;
    return numQ('Let <i>f</i>(<i>x</i>) = (' + lin(a, b) + ')<sup>' + n + '</sup>. Find <i>f</i>′(' + mi(k) + ').',
      n * a * Math.pow(u0, n - 1), null,
      { f: function (v) { return Math.pow(a * v + b, n); }, k: k });
  });

  /* =====================================================================
     CALCULUS 2
     ===================================================================== */
  MQ.def('c2.integral', 'calc2', 'Definite integral of a polynomial', function (r) {
    var p = r.pick([1, 2, 3, -1, -2]), q = r.nz(-4, 4), c = r.nz(-6, 6), k = r.int(1, 4);
    return numQ('Evaluate <span class="intw"><span class="isign">∫</span><span class="lims"><sup>' + k + '</sup><sub>0</sub></span></span> (' +
      polyStr([c, 2 * q, 3 * p]) + ') <i>dx</i>', p * k * k * k + q * k * k + c * k, null,
      { f: function (v) { return 3 * p * v * v + 2 * q * v + c; }, k: k });
  });

  MQ.def('c2.geoseries', 'calc2', 'Sum of a geometric series', function (r) {
    var m = r.int(2, 5), s = r.pick([1, -1]), a = r.int(1, 8);
    var f = s === 1 ? reduce(a * m, m - 1) : reduce(a * m, m + 1);
    return numQ('Find the sum of the series <span class="sumw"><small>∞</small><span class="big">Σ</span><small><i>n</i>=0</small></span> ' +
      '<span class="nw">' + a + ' (' + frac(s === 1 ? '1' : '−1', m) + ')<sup><i>n</i></sup></span>',
      f[0] / f[1], fshow(f[0], f[1]),
      { term: function (n) { return a * Math.pow(s / m, n); } });
  });
  /* =====================================================================
     NOVEMBER FUNDAMENTALS (same five for every class)
     ===================================================================== */
  MQ.def('ns.fracadd', 'core', 'Add and subtract fractions', function (r) {
    var ds = [2, 3, 4, 5, 6, 8, 10, 12], b, d, n1, n2, op, num, den, tries = 0;
    do {
      b = r.pick(ds); d = r.pick(ds);
      n1 = r.int(1, b - 1); n2 = r.int(1, d - 1); op = r.pick(['+', '−']);
      if (op === '−' && n1 * d < n2 * b) { var t = n1; n1 = n2; n2 = t; t = b; b = d; d = t; }   // keep the answer positive
      num = op === '+' ? n1 * d + n2 * b : n1 * d - n2 * b; den = b * d; tries++;
    } while ((b === d || num <= 0) && tries < 200);
    var f = reduce(num, den), q = numQ(frac(n1, b) + ' ' + op + ' ' + frac(n2, d), f[0] / f[1], fshow(f[0], f[1]),
      { n1: n1, b: b, n2: n2, d: d, op: op });
    q.html = 'Compute.<div class="eq">' + q.html + '</div>';
    q.hint = 'Enter a fraction like 7/12 (or a mixed number like 1 1/12), or a decimal rounded to at least 2 places.';
    return q;
  });

  MQ.def('ns.orderops', 'core', 'Order of operations with negatives', function (r) {
    var t = r.int(1, 3), a, b, c, d, e, html, ans;
    if (t === 1) {
      a = r.int(2, 9); b = r.int(2, 6); c = r.int(2, 6); d = r.int(2, 5);
      html = a + ' − ' + b + '·(−' + c + ') + ' + d + '<sup>2</sup>'; ans = a + b * c + d * d;
    } else if (t === 2) {
      do { a = r.int(1, 9); b = r.int(1, 9); } while (a === b);
      c = r.int(2, 6); e = r.int(2, 5); d = e * r.int(2, 6);
      html = '(' + a + ' − ' + b + ')·(−' + c + ') + ' + d + ' ÷ ' + e; ans = (a - b) * (-c) + d / e;
    } else {
      a = r.int(2, 6); b = r.int(2, 5); do { c = r.int(1, 9); d = r.int(1, 9); } while (c === d);
      html = '−' + a + '<sup>2</sup> + ' + b + '·(' + c + ' − ' + d + ')'; ans = -a * a + b * (c - d);
    }
    return numQ('Evaluate.<div class="eq">' + html + '</div>', ans, null, { html: html });
  });

  MQ.def('ns.percent', 'core', 'Percents: part of a number and percent change', function (r) {
    var v = r.int(1, 3), q, p, N, old, nw;
    if (v === 1) {
      p = r.pick([10, 15, 20, 25, 30, 35, 40, 60, 75, 80]); N = 20 * r.int(2, 12);
      q = numQ('What is ' + p + '% of ' + N + '?', p * N / 100, null, { p: p, N: N, v: v });
    } else {
      old = r.pick([20, 40, 60, 80, 100, 120, 200]);
      if (v === 2) { p = r.pick([5, 10, 15, 20, 25, 50, 75]); nw = old + old * p / 100; }
      else { p = r.pick([5, 10, 15, 20, 25, 50]); nw = old - old * p / 100; }
      q = numQ('The price of a jacket ' + (v === 2 ? 'went up' : 'dropped') + ' from $' + old + ' to $' + nw + '. By what percent did the price ' +
        (v === 2 ? 'increase' : 'decrease') + '?', p, null, { old: old, nw: nw, v: v });
    }
    q.hint = 'Enter a number (the % sign is optional).';
    return q;
  });

  MQ.def('alg.twostep', 'core', 'Solve a two-step equation', function (r) {
    var v = r.int(1, 3), a, b, c, x, t, html, meta;
    if (v === 1) {
      a = r.pick([2, 3, 4, 5, -2, -3, -4]); b = r.nz(-12, 12); x = r.nz(-8, 8); c = a * x + b;
      html = lin(a, b) + ' = ' + mi(c); meta = { lhs: function (z) { return a * z + b; }, rhs: function () { return c; } };
    } else if (v === 2) {
      a = r.pick([2, 3, 4, 5, -2, -3, -4]); b = r.nz(-9, 9); t = r.nz(-6, 6); x = a * t; c = t + b;
      html = (a < 0 ? '\u2212' : '') + frac('<i>x</i>', Math.abs(a)) + (b < 0 ? ' − ' + (-b) : ' + ' + b) + ' = ' + mi(c);
      meta = { lhs: function (z) { return z / a + b; }, rhs: function () { return c; } };
    } else {
      a = r.pick([2, 3, 4, 5]); b = r.nz(-12, 12); x = r.nz(-8, 8); c = b - a * x;
      html = mi(b) + ' − ' + a + '<i>x</i> = ' + mi(c); meta = { lhs: function (z) { return b - a * z; }, rhs: function () { return c; } };
    }
    return numQ('Solve for <i>x</i>.<div class="eq">' + html + '</div>', x, null, meta);
  });

  /* ---------- easy graph reading: labeled grid + line-segment graph through lattice points ---------- */
  function graphSvg(pts) {
    var W = 360, H = 360, u = 30, ox = W / 2, oy = H / 2, i, s;
    function X(x) { return ox + x * u; } function Y(y) { return oy - y * u; }
    s = '<svg class="gp" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Graph of y equals f of x on a grid from negative 5 to 5">';
    for (i = -5; i <= 5; i++) {
      s += '<line class="gp-grid" x1="' + X(i) + '" y1="' + Y(-5) + '" x2="' + X(i) + '" y2="' + Y(5) + '"/>';
      s += '<line class="gp-grid" x1="' + X(-5) + '" y1="' + Y(i) + '" x2="' + X(5) + '" y2="' + Y(i) + '"/>';
    }
    s += '<line class="gp-axis" x1="' + X(-5) + '" y1="' + Y(0) + '" x2="' + X(5) + '" y2="' + Y(0) + '"/>';
    s += '<line class="gp-axis" x1="' + X(0) + '" y1="' + Y(-5) + '" x2="' + X(0) + '" y2="' + Y(5) + '"/>';
    for (i = -5; i <= 5; i++) {
      s += '<text x="' + X(i) + '" y="' + (Y(-5) + 15) + '" text-anchor="middle">' + mi(i) + '</text>';
      s += '<text x="' + (X(-5) - 6) + '" y="' + (Y(i) + 4) + '" text-anchor="end">' + mi(i) + '</text>';
    }
    s += '<text class="gp-l" x="' + (X(5.4) - 4) + '" y="' + (Y(0) - 6) + '" text-anchor="end">x</text><text class="gp-l" x="' + (X(0) + 8) + '" y="' + (Y(5.4) + 8) + '">y</text>';
    s += '<polyline class="gp-line" points="' + pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '"/>';
    pts.forEach(function (p) { s += '<circle class="gp-dot" cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4.2"/>'; });
    return s + '</svg>';
  }

  MQ.def('gr.readvalue', 'core', 'Read a value from a graph', function (r) {
    var ys = [r.int(-3, 3)], i, y, tries;
    for (i = 1; i < 9; i++) {
      tries = 0; do { y = ys[i - 1] + r.pick([-3, -2, -1, 1, 2, 3]); tries++; } while ((y < -5 || y > 5) && tries < 50);
      if (y < -5 || y > 5) y = ys[i - 1] + (ys[i - 1] > 0 ? -1 : 1);
      ys.push(y);
    }
    var pts = ys.map(function (v, k) { return [k - 4, v]; });
    function hits(m) { var c = 0; for (var k = 0; k < 9; k++) { if (ys[k] === m) c++; if (k < 8 && (ys[k] - m) * (ys[k + 1] - m) < 0) c++; } return c; }
    var cand = []; for (i = 0; i < 9; i++) if (hits(ys[i]) === 1) cand.push(i);
    var fig = '<div class="fig">' + graphSvg(pts) + '</div>', q;
    if (cand.length && r.f() < 0.5) {
      var j = r.pick(cand);
      q = numQ('The graph of <i>y</i> = <i>f</i>(<i>x</i>) is shown. For what value of <i>x</i> is <i>f</i>(<i>x</i>) = ' + mi(ys[j]) + '?' + fig, j - 4, null, { pts: pts, mode: 'x', m: ys[j] });
    } else {
      var k = r.int(-4, 4);
      q = numQ('The graph of <i>y</i> = <i>f</i>(<i>x</i>) is shown. What is <i>f</i>(' + mi(k) + ')?' + fig, ys[k + 4], null, { pts: pts, mode: 'val', k: k });
    }
    q.hint = 'Enter a number. Read it from the grid; the dots sit on grid intersections.';
    return q;
  });

  /* =====================================================================
     MLS COMMON ASSESSMENT BANK (Missouri Learning Standards challenge areas)
     ---------------------------------------------------------------------
     Shared helpers first, then one section per area:
       rp.* ratios & proportions   un.* units & rates    wp.* word problems/equations
       st.* mean/median/mode/range py.* Pythagorean       pav.* perimeter/area/volume
       co.* symmetry & congruence  in.* inequalities      pr.* probability    da.* data & graphs
     ===================================================================== */
  function money(v) { return '$' + (Number.isInteger(v) ? v : v.toFixed(2)); }
  function gcdn(a, b) { return gcd(a, b); }
  function ptStr(x, y) { return '(' + mi(x) + ', ' + mi(y) + ')'; }
  function mcShuffle(r, html, correct, wrongs, meta) {          // correct answer + up to 3 distinct wrong ones, shuffled
    var seen = {}, list = [correct]; seen[correct] = 1;
    wrongs.forEach(function (w) { if (!seen[w] && list.length < 4) { seen[w] = 1; list.push(w); } });
    var order = r.shuffle(list);
    return mcQ(html, order, order.indexOf(correct), meta);
  }
  function fracQ(html, n, d, meta) {                              // probability-style answer, shown as a reduced fraction
    var f = reduce(n, d), q = numQ(html, f[0] / f[1], fshow(f[0], f[1]), meta);
    q.hint = 'Enter a fraction like 3/8 (or a decimal rounded to at least 2 places).';
    return q;
  }
  function dtab(rows, colHead) {                                  // rows[0] is a header row, unless colHead (then only the first column is a header)
    return '<div class="dtw"><table class="dt">' + rows.map(function (row, i) {
      return '<tr>' + row.map(function (c, j) { return ((i === 0 && !colHead) || j === 0) ? '<th>' + c + '</th>' : '<td>' + c + '</td>'; }).join('') + '</tr>';
    }).join('') + '</table></div>';
  }
  /* coordinate plane; o: x0,x1,y0,y1,ux,uy,gs (grid step),ts (label step),xl,yl,label. Returns {X,Y,W,H,wrap(inner)} */
  function plane(o) {
    var ux = o.ux || o.u, uy = o.uy || o.u, pl = 36, pb = 40, pt = 12, pr = 14, i, s = '', gs = o.gs || 1, ts = o.ts || 1;
    var W = pl + (o.x1 - o.x0) * ux + pr, H = pt + (o.y1 - o.y0) * uy + pb;
    function X(x) { return pl + (x - o.x0) * ux; }
    function Y(y) { return pt + (o.y1 - y) * uy; }
    for (i = o.x0; i <= o.x1; i += gs) s += '<line class="gp-grid" x1="' + X(i) + '" y1="' + Y(o.y0) + '" x2="' + X(i) + '" y2="' + Y(o.y1) + '"/>';
    for (i = o.y0; i <= o.y1; i += gs) s += '<line class="gp-grid" x1="' + X(o.x0) + '" y1="' + Y(i) + '" x2="' + X(o.x1) + '" y2="' + Y(i) + '"/>';
    var ax = (o.x0 < 0 && o.x1 > 0) ? 0 : o.x0, ay = (o.y0 < 0 && o.y1 > 0) ? 0 : o.y0;
    s += '<line class="gp-axis" x1="' + X(o.x0) + '" y1="' + Y(ay) + '" x2="' + X(o.x1) + '" y2="' + Y(ay) + '"/>';
    s += '<line class="gp-axis" x1="' + X(ax) + '" y1="' + Y(o.y0) + '" x2="' + X(ax) + '" y2="' + Y(o.y1) + '"/>';
    for (i = o.x0; i <= o.x1; i += ts) s += '<text x="' + X(i) + '" y="' + (Y(o.y0) + 15) + '" text-anchor="middle">' + mi(i) + '</text>';
    for (i = o.y0; i <= o.y1; i += ts) s += '<text x="' + (X(o.x0) - 6) + '" y="' + (Y(i) + 4) + '" text-anchor="end">' + mi(i) + '</text>';
    if (o.xl) s += '<text class="gp-l" x="' + (X(o.x0) + (o.x1 - o.x0) * ux / 2) + '" y="' + (H - 3) + '" text-anchor="middle">' + o.xl + '</text>';
    if (o.yl) s += '<text class="gp-l" transform="rotate(-90 11 ' + (Y(o.y0) - (o.y1 - o.y0) * uy / 2) + ')" x="11" y="' + (Y(o.y0) - (o.y1 - o.y0) * uy / 2 + 4) + '" text-anchor="middle">' + o.yl + '</text>';
    return {
      X: X, Y: Y, W: W, H: H,
      wrap: function (inner) { return '<div class="fig"><svg class="gp" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Graph') + '">' + s + inner + '</svg></div>'; }
    };
  }
  function svgBox(w, h, label, inner) { return '<div class="fig"><svg class="sv" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + inner + '</svg></div>'; }

  /* =====================================================================
     RATIOS & PROPORTIONS  (8.RP.A.1)
     ===================================================================== */
  var RP_CTX = [
    { x: 'Hours worked', y: 'Dollars earned', pu: 'dollars per hour' },
    { x: 'Gallons of gas', y: 'Miles driven', pu: 'miles per gallon' },
    { x: 'Minutes', y: 'Pages read', pu: 'pages per minute' },
    { x: 'Pounds of apples', y: 'Cost (dollars)', pu: 'dollars per pound' },
    { x: 'Seconds', y: 'Meters run', pu: 'meters per second' }
  ];
  var RATES = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8];

  MQ.def('rp.unitrate', 'core', 'Constant of proportionality from a table', function (r) {
    var c = r.pick(RP_CTX), k = r.pick(RATES), xs = r.shuffle([2, 4, 6, 8, 10, 12]).slice(0, 4).sort(function (a, b) { return a - b; });
    var ys = xs.map(function (x) { return k * x; });
    var q = numQ('The table shows a proportional relationship. What is the unit rate, in ' + c.pu + '?' +
      dtab([[c.x].concat(xs), [c.y].concat(ys)], true), k, null, { xs: xs, ys: ys, k: k });
    q.hint = 'Enter a number (a decimal like 2.5 is fine).';
    return q;
  });

  var PROP_CTX = [
    ['gallons of paint', 'rooms', 'It takes {Q} gallons of paint to cover {N} identical rooms. At the same rate, how many gallons are needed to cover {M} rooms?'],
    ['cups of flour', 'batches', 'A recipe uses {Q} cups of flour for {N} batches of muffins. At this rate, how many cups of flour are needed for {M} batches?'],
    ['miles', 'hours', 'A cyclist rides {Q} miles in {N} hours. At the same steady pace, how many miles does the cyclist ride in {M} hours?'],
    ['dollars', 'hours', 'Jordan earns {Q} dollars for {N} hours of work. At the same hourly rate, how many dollars does Jordan earn in {M} hours?'],
    ['gallons', 'minutes', 'A tank fills with {Q} gallons of water in {N} minutes. At this rate, how many gallons will it hold after {M} minutes?']
  ];
  MQ.def('rp.proportion', 'core', 'Solve a proportion in context', function (r) {
    var t = r.pick(PROP_CTX), u = r.int(2, 9), N = r.pick([2, 3, 4, 5, 6]), M;
    do { M = r.int(2, 12) * (r.pick([1, 1, 2])); } while (M === N || M < 2);
    var Q = u * N, s = t[2].replace('{Q}', Q).replace('{N}', N).replace('{M}', M);
    return numQ(s, u * M, null, { Q: Q, N: N, M: M });
  });

  MQ.def('rp.graph', 'core', 'Unit rate from the graph of a proportional relationship', function (r) {
    var c = r.pick(RP_CTX), k = r.pick([0.5, 1, 1.5, 2, 2.5, 3]), ymax = 4 * k + 2;
    ymax = Math.ceil(ymax / 2) * 2;
    var P = plane({ x0: 0, x1: 6, y0: 0, y1: ymax, ux: 40, uy: ymax > 8 ? 18 : 26, gs: 1, ts: ymax > 8 ? 2 : 1, xl: c.x, yl: c.y, label: 'Graph of a line through the origin' });
    var inner = '<line class="gp-line" x1="' + P.X(0) + '" y1="' + P.Y(0) + '" x2="' + P.X(Math.min(6, ymax / k)) + '" y2="' + P.Y(Math.min(6, ymax / k) * k) + '"/>';
    [2, 4].forEach(function (x) { inner += '<circle class="gp-dot" cx="' + P.X(x) + '" cy="' + P.Y(k * x) + '" r="4.2"/>'; });
    var q = numQ('The graph shows a proportional relationship. What is the unit rate, in ' + c.pu + '?' + P.wrap(inner), k, null, { k: k, ymax: ymax });
    q.hint = 'Enter a number. The line passes through the origin; find the value of <i>y</i> when <i>x</i> = 1.';
    return q;
  });

  MQ.def('rp.compare', 'core', 'Compare two proportional relationships', function (r) {
    var RS = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7], ka = r.pick(RS), kb, i, same = r.f() < 0.12;
    kb = same ? ka : r.pick(RS.filter(function (v) { return v !== ka; }));
    var xs = r.pick([[2, 4, 6], [2, 4, 8], [4, 6, 8], [2, 6, 10]]);
    var html = 'Store A sells by the pound. The cost <i>y</i> (in dollars) of <i>x</i> pounds is given by <i>y</i> = ' + ka + '<i>x</i>.<br>Store B’s prices are shown in the table.' +
      dtab([['Pounds'].concat(xs), ['Cost (dollars)'].concat(xs.map(function (x) { return kb * x; }))], true) +
      'Which store charges less per pound?';
    var ch = ['Store A', 'Store B', 'The stores charge the same amount per pound'];
    return mcQ(html, ch, same ? 2 : (ka < kb ? 0 : 1), { ka: ka, kb: kb, xs: xs });
  });

  /* =====================================================================
     UNITS & RATES  (A1.NQ.B.3.c)
     ===================================================================== */
  MQ.def('un.convert', 'core', 'Convert units (rates, areas, volumes)', function (r) {
    var v = r.int(1, 3), q, M, G, s, w, l;
    if (v === 1) {
      M = r.pick([15, 30, 45, 60, 75, 90]);
      q = numQ('A car travels at ' + M + ' miles per hour. How many feet per second is that? (1 mile = 5,280 feet; 1 hour = 3,600 seconds)', M * 5280 / 3600, null, { v: v, M: M });
    } else if (v === 2) {
      G = r.int(2, 9); s = r.pick([8, 16, 32]);
      q = numQ('A jug holds ' + G + ' gallons of juice. One gallon is 128 fluid ounces. How many ' + s + '-ounce cups can be filled from the jug?', G * 128 / s, null, { v: v, G: G, s: s });
    } else {
      w = r.pick([9, 12, 15, 18, 21]); l = r.pick([9, 12, 15, 18, 24]);
      q = numQ('A room is ' + w + ' feet wide and ' + l + ' feet long. Carpet is sold by the square yard. How many square yards of carpet cover the whole floor? (1 yard = 3 feet)', w * l / 9, null, { v: v, w: w, l: l });
    }
    q.hint = 'Enter a number.';
    return q;
  });

  MQ.def('un.bestbuy', 'core', 'Unit price: which is the better buy?', function (r) {
    var items = [['juice', 'ounces', 'a bottle'], ['rice', 'pounds', 'a bag'], ['cereal', 'ounces', 'a box'], ['laundry soap', 'ounces', 'a jug'], ['trail mix', 'ounces', 'a bag']];
    var it = r.pick(items), n1, n2, p1, p2, u1, u2, tries = 0;
    do {
      n1 = r.pick([12, 16, 24, 32]); n2 = r.pick([20, 30, 36, 48, 64]);
      u1 = r.pick([0.12, 0.15, 0.18, 0.2, 0.25, 0.3, 0.35, 0.4]); u2 = u1 * (r.f() < 0.5 ? 0.86 : 1.16);
      p1 = Math.round(u1 * n1 * 100) / 100; p2 = Math.round(u2 * n2 * 100) / 100;
      u1 = p1 / n1; u2 = p2 / n2; tries++;
    } while ((Math.abs(u1 - u2) / Math.min(u1, u2) < 0.06) && tries < 200);
    var ch = ['The ' + n1 + '-' + it[1].replace(/s$/, '') + ' ' + it[2].replace('a ', '') + ' (' + money(p1) + ')', 'The ' + n2 + '-' + it[1].replace(/s$/, '') + ' ' + it[2].replace('a ', '') + ' (' + money(p2) + ')'];
    return mcQ('A store sells ' + it[0] + ' two ways: ' + it[2] + ' with ' + n1 + ' ' + it[1] + ' for ' + money(p1) + ', and ' + it[2] + ' with ' + n2 + ' ' + it[1] + ' for ' + money(p2) + '. Which is the better buy (lower price per ' + it[1].replace(/s$/, '') + ')?',
      ch, u1 < u2 ? 0 : 1, { n1: n1, p1: p1, n2: n2, p2: p2 });
  });

  MQ.def('un.units', 'core', 'Use units to check an answer', function (r) {
    var c = r.int(1, 5), T, k, R, D, C, P, L, W, H, html, good, alts;
    if (c === 1) { T = r.pick([2, 3, 4, 5]); k = r.int(3, 9); R = T * k; html = 'A cyclist rides at ' + R + ' miles per hour for ' + T + ' hours. How far does the cyclist ride?'; good = [R * T, 'miles']; alts = [[R * T, 'miles per hour'], [k, 'miles'], [R * T, 'hours']]; }
    else if (c === 2) { T = r.pick([2, 3, 4, 5]); k = r.int(12, 20) * 3; D = T * k; html = 'A car travels ' + D + ' miles in ' + T + ' hours. What is its average speed?'; good = [k, 'miles per hour']; alts = [[k, 'hours per mile'], [D * T, 'miles per hour'], [k, 'miles']]; }
    else if (c === 3) { P = r.pick([2, 3, 4, 5, 6]); k = r.int(2, 9); C = P * k; html = 'Peaches cost ' + money(C) + ' for ' + P + ' pounds. What is the cost per pound?'; good = [k, 'dollars per pound']; alts = [[k, 'pounds per dollar'], [C * P, 'dollars per pound'], [k, 'dollars']]; }
    else if (c === 4) { L = r.int(6, 15); W = r.int(3, L - 1); html = 'A rectangular patio is ' + L + ' feet long and ' + W + ' feet wide. What is its area?'; good = [L * W, 'square feet']; alts = [[L * W, 'feet'], [2 * (L + W), 'square feet'], [L * W, 'cubic feet']]; }
    else { L = r.int(4, 9); W = r.int(3, 8); H = r.int(2, 7); html = 'A box is ' + L + ' inches long, ' + W + ' inches wide, and ' + H + ' inches tall. What is its volume?'; good = [L * W * H, 'cubic inches']; alts = [[L * W * H, 'square inches'], [L + W + H, 'cubic inches'], [L * W * H, 'inches']]; }
    function f(a) { return a[0] + ' ' + a[1]; }
    return mcShuffle(r, html + ' Choose the answer with the correct value <b>and</b> units.', f(good), alts.map(f), { c: c, good: good, alts: alts });
  });

  /* =====================================================================
     WORD PROBLEMS & EQUATIONS  (7.EEI.B.4, A1.CED.A.1, A1.CED.A.3)
     ===================================================================== */
  MQ.def('wp.equation', 'core', 'Write and solve an equation from a situation', function (r) {
    var ctxs = [
      function (f, m, T) { return 'A taxi company charges a flat fee of ' + money(f) + ' plus ' + money(m) + ' per mile. A ride costs ' + money(T) + ' in all. '; },
      function (f, m, T) { return 'A gym charges a ' + money(f) + ' sign-up fee plus ' + money(m) + ' per month. Maria has paid ' + money(T) + ' in total. '; },
      function (f, m, T) { return 'A plumber charges ' + money(f) + ' for a house call plus ' + money(m) + ' for each hour of work. One job cost ' + money(T) + '. '; }
    ];
    var unit = ['miles', 'months', 'hours'], ci = r.int(0, 2), f = r.pick([3, 4, 5, 6, 8, 10, 12]), m = r.pick([2, 3, 4, 5, 7]), n = r.int(3, 15), T = f + m * n;
    var intro = ctxs[ci](f, m, T);
    if (r.f() < 0.5) {
      return numQ(intro + 'How many ' + unit[ci] + ' were there?', n, null, { f: f, m: m, n: n, T: T, mode: 'solve' });
    }
    var good = m + '<i>x</i> + ' + f + ' = ' + T;
    return mcShuffle(r, intro + 'Let <i>x</i> be the number of ' + unit[ci] + '. Which equation can be used to find <i>x</i>?', good,
      [m + '(<i>x</i> + ' + f + ') = ' + T, f + '<i>x</i> + ' + m + ' = ' + T, m + '<i>x</i> − ' + f + ' = ' + T], { f: f, m: m, n: n, T: T, mode: 'mc' });
  });

  MQ.def('wp.plans', 'core', 'Break-even between two plans', function (r) {
    var m2 = r.int(5, 15), d = r.int(2, 6), m1 = m2 + d, n = r.int(2, 10), f1 = r.pick([0, 5, 10, 15, 20]), f2 = f1 + d * n;
    var nm = r.pick([['Gym A', 'Gym B', 'month', 'membership'], ['Plan A', 'Plan B', 'month', 'phone plan']]);
    return numQ(nm[0] + ' charges ' + money(f1) + ' to join plus ' + money(m1) + ' per ' + nm[2] + '. ' + nm[1] + ' charges ' + money(f2) + ' to join plus ' + money(m2) +
      ' per ' + nm[2] + '. After how many ' + nm[2] + 's will the total cost of the two be the same?', n, null, { f1: f1, m1: m1, f2: f2, m2: m2, n: n });
  });

  MQ.def('wp.geom', 'core', 'Set up and solve: perimeter and consecutive integers', function (r) {
    var v = r.int(1, 2), w, k, S, n;
    if (v === 1) {
      w = r.int(3, 15); k = r.int(1, 8);
      return numQ('The length of a rectangle is ' + k + ' more than twice its width. The perimeter is ' + (6 * w + 2 * k) + ' units. What is the width?', w, null, { v: v, w: w, k: k, P: 6 * w + 2 * k });
    }
    n = r.int(4, 40); S = 3 * n + 3;
    return numQ('The sum of three consecutive integers is ' + S + '. What is the smallest of the three integers?', n, null, { v: v, n: n, S: S });
  });

  /* =====================================================================
     MEAN, MEDIAN, MODE, RANGE  (7.DSP.B.3, B.4)
     ===================================================================== */
  var ST_CTX = ['quiz scores', 'points scored in games', 'minutes of homework each night', 'books read each month', 'daily high temperatures (°F)'];
  function listStr(a) { return a.join(', '); }
  function dataSet(r, n, lo, hi, meanInt) {
    var a = [], i, s = 0;
    for (i = 0; i < n; i++) { a.push(r.int(lo, hi)); }
    if (meanInt) {
      s = a.reduce(function (p, c) { return p + c; }, 0); var rem = s % n;
      if (rem) { if (a[n - 1] - rem >= lo) a[n - 1] -= rem; else a[n - 1] += n - rem; }
    }
    return a;
  }
  MQ.def('st.mean', 'core', 'Find the mean', function (r) {
    var n = r.int(5, 8), a = dataSet(r, n, 60, 98, true);
    return numQ('Find the mean of these ' + r.pick(ST_CTX) + ':<div class="eq">' + listStr(a) + '</div>', a.reduce(function (p, c) { return p + c; }, 0) / n, null, { a: a });
  });
  MQ.def('st.median', 'core', 'Find the median', function (r) {
    var n = r.pick([7, 8, 9, 10]), pool = [], i, a;
    for (i = 5; i <= 60; i++) pool.push(i);
    a = r.shuffle(pool).slice(0, n);
    var s = a.slice().sort(function (x, y) { return x - y; }), med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    return numQ('Find the median of this data set:<div class="eq">' + listStr(a) + '</div>', med, null, { a: a });
  });
  MQ.def('st.missing', 'core', 'Find the missing value for a target mean', function (r) {
    var a, m, miss, tries = 0;
    do {
      m = r.int(80, 90); a = [r.int(68, 96), r.int(68, 96), r.int(68, 96), r.int(68, 96)];
      miss = 5 * m - a.reduce(function (p, c) { return p + c; }, 0); tries++;
    } while ((miss < 60 || miss > 100) && tries < 300);
    return numQ('Dana’s scores on her first four tests are ' + listStr(a) + '. What score does she need on the fifth test to have a mean of exactly ' + m + '?', miss, null, { a: a, m: m });
  });
  MQ.def('st.compare', 'core', 'Compare two data sets (center and spread)', function (r) {
    var v = r.int(1, 3), A, B, ans, ask, tries = 0, n, f;
    function sum(x) { return x.reduce(function (p, c) { return p + c; }, 0); }
    function med(x) { var s = x.slice().sort(function (p, q) { return p - q; }); return s[(s.length - 1) / 2]; }
    function rng(x) { return Math.max.apply(null, x) - Math.min.apply(null, x); }
    do {
      n = v === 2 ? 6 : (v === 1 ? 7 : 6);
      A = dataSet(r, n, 55, 99, v === 2); B = dataSet(r, n, 55, 99, v === 2);
      f = v === 1 ? med : (v === 2 ? function (x) { return sum(x) / x.length; } : rng);
      ans = f(A) - f(B); tries++;
      if (ans < 0) { var t = A; A = B; B = t; ans = -ans; }
    } while ((ans <= 0 || ans > 30) && tries < 400);
    ask = v === 1 ? 'median' : (v === 2 ? 'mean' : 'range');
    return numQ('Two classes took the same test. Scores:<div class="eq">Class A: ' + listStr(A) + '<br>Class B: ' + listStr(B) + '</div>The ' + ask + ' of Class A is how many points greater than the ' + ask + ' of Class B?',
      ans, null, { A: A, B: B, v: v });
  });
  function dotSvg(counts, lo, xlabel) {
    var n = counts.length, step = Math.min(34, 300 / Math.max(1, n - 1)), pad = 24, W = pad * 2 + step * (n - 1), maxc = Math.max.apply(null, counts), base = 16 + maxc * 17 + 6, H = base + 40, i, j, s = '';
    s += '<line class="gp-axis" x1="' + (pad - 12) + '" y1="' + base + '" x2="' + (W - pad + 12) + '" y2="' + base + '"/>';
    for (i = 0; i < n; i++) {
      var x = pad + i * step;
      s += '<line class="gp-axis" x1="' + x + '" y1="' + base + '" x2="' + x + '" y2="' + (base + 5) + '"/><text x="' + x + '" y="' + (base + 19) + '" text-anchor="middle">' + (lo + i) + '</text>';
      for (j = 0; j < counts[i]; j++) s += '<circle class="gp-dot" cx="' + x + '" cy="' + (base - 9 - j * 17) + '" r="6.5"/>';
    }
    s += '<text class="gp-l" x="' + (W / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + xlabel + '</text>';
    return '<div class="fig"><svg class="gp" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Dot plot of ' + xlabel + '">' + s + '</svg></div>';
  }
  MQ.def('st.dotplot', 'core', 'Mode, median, or range from a dot plot', function (r) {
    var v = r.int(1, 3), lo = r.int(0, 3), len = 8, counts, tot, i, tries = 0, mx, nmax;
    do {
      counts = []; tot = 0; for (i = 0; i < len; i++) { counts.push(r.pick([0, 1, 1, 2, 2, 3, 4, 5])); tot += counts[i]; }
      mx = Math.max.apply(null, counts); nmax = counts.filter(function (c) { return c === mx; }).length; tries++;
    } while ((tot < 9 || tot > 17 || counts[0] === 0 || counts[len - 1] === 0 || nmax !== 1 || mx < 3 || (v === 2 && tot % 2 === 0)) && tries < 1000);
    var vals = []; counts.forEach(function (c, k) { for (var j = 0; j < c; j++) vals.push(lo + k); });
    var fig = dotSvg(counts, lo, 'Number of books read'), q, ask;
    if (v === 1) { q = numQ('The dot plot shows the number of books read by each student in a class. What is the mode?' + fig, lo + counts.indexOf(mx), null, { counts: counts, lo: lo, v: v }); }
    else if (v === 2) { q = numQ('The dot plot shows the number of books read by each student in a class. What is the median?' + fig, vals[(vals.length - 1) / 2], null, { counts: counts, lo: lo, v: v }); }
    else { q = numQ('The dot plot shows the number of books read by each student in a class. What is the range?' + fig, vals[vals.length - 1] - vals[0], null, { counts: counts, lo: lo, v: v }); }
    q.hint = 'Enter a number. Each dot is one student.';
    return q;
  });

  /* =====================================================================
     PYTHAGOREAN THEOREM  (8.GM.B.6, B.7, B.8)
     ===================================================================== */
  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [15, 20, 25], [20, 21, 29], [10, 24, 26], [9, 40, 41], [12, 35, 37]];
  /* right triangle, right angle at bottom-left (or bottom-right when flip). la = bottom leg label, lb = vertical leg label, lc = hypotenuse label */
  function triSvg(a, b, la, lb, lc, flip) {
    var s = Math.min(190 / a, 150 / b), L = 72, W = L + a * s + 92, B = 20 + b * s, H = B + 36, i;
    function fx(x) { return flip ? W - x : x; }
    var p0 = [fx(L), B], p1 = [fx(L + a * s), B], p2 = [fx(L), B - b * s];
    var dir = flip ? -1 : 1, m = 12, out = '';
    out += '<polygon class="sv-f" points="' + p0.join(',') + ' ' + p1.join(',') + ' ' + p2.join(',') + '"/>';
    out += '<polyline class="sv-s" points="' + (p0[0] + dir * m) + ',' + p0[1] + ' ' + (p0[0] + dir * m) + ',' + (p0[1] - m) + ' ' + p0[0] + ',' + (p0[1] - m) + '"/>';
    out += '<text x="' + ((p0[0] + p1[0]) / 2) + '" y="' + (B + 20) + '" text-anchor="middle">' + la + '</text>';
    out += '<text x="' + (p0[0] - dir * 8) + '" y="' + (B - b * s / 2 + 4) + '" text-anchor="' + (flip ? 'start' : 'end') + '">' + lb + '</text>';
    var mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, nx = dir * b, ny = -a, nl = Math.sqrt(nx * nx + ny * ny);
    // normal pointing away from the right-angle corner
    out += '<text x="' + (mx + dir * 0 + (nx / nl) * 16) + '" y="' + (my + (ny / nl) * 12 + 4) + '" text-anchor="' + (flip ? 'end' : 'start') + '">' + lc + '</text>';
    return svgBox(W, H, 'A right triangle with its side lengths labeled', out);
  }
  var UNITS = ['cm', 'in', 'ft', 'm'];
  MQ.def('py.hyp', 'core', 'Find the hypotenuse', function (r) {
    var t = r.pick(TRIPLES), u = r.pick(UNITS), legs = r.f() < 0.5 ? [t[0], t[1]] : [t[1], t[0]];
    return numQ('Find the length of the hypotenuse, <i>x</i>.' + triSvg(legs[0], legs[1], legs[0] + ' ' + u, legs[1] + ' ' + u, '<tspan font-style="italic">x</tspan>', r.f() < 0.5), t[2], null, { legs: legs, c: t[2] });
  });
  MQ.def('py.leg', 'core', 'Find a missing leg', function (r) {
    var t = r.pick(TRIPLES), u = r.pick(UNITS), hz = r.f() < 0.5, a = hz ? t[0] : t[1], b = hz ? t[1] : t[0];
    var q = hz
      ? numQ('Find the length of the missing leg, <i>x</i>.' + triSvg(a, b, '<tspan font-style="italic">x</tspan>', b + ' ' + u, t[2] + ' ' + u, r.f() < 0.5), a, null, { a: a, b: b, c: t[2] })
      : numQ('Find the length of the missing leg, <i>x</i>.' + triSvg(a, b, a + ' ' + u, '<tspan font-style="italic">x</tspan>', t[2] + ' ' + u, r.f() < 0.5), b, null, { a: a, b: b, c: t[2] });
    return q;
  });
  MQ.def('py.converse', 'core', 'Is it a right triangle? (converse)', function (r) {
    var kind = r.pick(['right', 'right', 'acute', 'obtuse']), a, b, c, t, k, tries = 0, u = r.pick(UNITS);
    if (kind === 'right') { t = r.pick(TRIPLES); a = t[0]; b = t[1]; c = t[2]; }
    else {
      do {
        a = r.int(4, 15); b = r.int(a, 20); var h = Math.sqrt(a * a + b * b);
        c = kind === 'acute' ? Math.floor(h) : Math.ceil(h) + r.int(0, 1);
        tries++;
      } while ((c * c === a * a + b * b || (kind === 'acute' ? (c * c >= a * a + b * b || c < b) : (c * c <= a * a + b * b || c >= a + b))) && tries < 500);
    }
    var sides = r.shuffle([a, b, c]).map(function (v) { return v + ' ' + u; }).join(', ');
    var ch = ['Yes — the squares of the two shorter sides add up to the square of the longest side',
      'No — the squares of the two shorter sides add up to less than the square of the longest side',
      'No — the squares of the two shorter sides add up to more than the square of the longest side'];
    var good = a * a + b * b === c * c ? 0 : (a * a + b * b < c * c ? 1 : 2);
    return mcQ('A triangle has side lengths ' + sides + '. Is it a right triangle?', ch, good, { a: a, b: b, c: c, kind: kind });
  });
  MQ.def('py.distance', 'core', 'Distance between two points on the coordinate plane', function (r) {
    var d = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9]]), sx = r.pick([1, -1]), sy = r.pick([1, -1]);
    var dx = d[0] * sx, dy = d[1] * sy, x1, y1;
    x1 = dx > 0 ? r.int(-7, 7 - d[0]) : r.int(-7 + d[0], 7); y1 = dy > 0 ? r.int(-7, 7 - d[1]) : r.int(-7 + d[1], 7);
    var x2 = x1 + dx, y2 = y1 + dy, P = plane({ x0: -7, x1: 7, y0: -7, y1: 7, u: 22, label: 'Two points on a coordinate grid' });
    var inner = '<line class="gp-line" x1="' + P.X(x1) + '" y1="' + P.Y(y1) + '" x2="' + P.X(x2) + '" y2="' + P.Y(y2) + '"/>' +
      '<circle class="gp-dot" cx="' + P.X(x1) + '" cy="' + P.Y(y1) + '" r="4.5"/><circle class="gp-dot" cx="' + P.X(x2) + '" cy="' + P.Y(y2) + '" r="4.5"/>' +
      '<text class="sv-t" x="' + (P.X(x1) + (dx > 0 ? -8 : 8)) + '" y="' + (P.Y(y1) + (dy > 0 ? 16 : -8)) + '" text-anchor="' + (dx > 0 ? 'end' : 'start') + '">A</text>' +
      '<text class="sv-t" x="' + (P.X(x2) + (dx > 0 ? 8 : -8)) + '" y="' + (P.Y(y2) + (dy > 0 ? -8 : 16)) + '" text-anchor="' + (dx > 0 ? 'start' : 'end') + '">B</text>';
    return numQ('Points <i>A</i>(' + mi(x1) + ', ' + mi(y1) + ') and <i>B</i>(' + mi(x2) + ', ' + mi(y2) + ') are graphed. What is the distance from <i>A</i> to <i>B</i>, in grid units?' + P.wrap(inner),
      Math.sqrt(dx * dx + dy * dy), null, { x1: x1, y1: y1, x2: x2, y2: y2 });
  });
  MQ.def('py.applied', 'core', 'Pythagorean theorem in context', function (r) {
    var t = r.pick(TRIPLES), v = r.int(1, 3), k, q;
    if (v === 1) {
      q = numQ('A ladder leans against a vertical wall. The base of the ladder is ' + t[0] + ' feet from the wall, and the top reaches ' + t[1] + ' feet up the wall. How long is the ladder?' + triSvg(t[0], t[1], 'ground: ' + t[0] + ' ft', 'wall: ' + t[1] + ' ft', 'ladder', false), t[2], null, { v: v, t: t });
    } else if (v === 2) {
      q = numQ('A ' + t[2] + '-foot ladder leans against a wall and reaches ' + t[1] + ' feet up the wall. How many feet is the base of the ladder from the wall?' + triSvg(t[0], t[1], 'ground: ?', 'wall: ' + t[1] + ' ft', 'ladder: ' + t[2] + ' ft', true), t[0], null, { v: v, t: t });
    } else {
      q = numQ('A rectangular field is ' + t[0] + ' meters wide and ' + t[1] + ' meters long. How many meters long is a straight path from one corner to the opposite corner?', t[2], null, { v: v, t: t });
    }
    return q;
  });

  /* =====================================================================
     PERIMETER, AREA, VOLUME  (G.GMD.A.1, A.3, B.4)
     ===================================================================== */
  function circleSvg(lab, diam) {
    return svgBox(180, 160, 'A circle with its ' + (diam ? 'diameter' : 'radius') + ' labeled',
      '<circle class="sv-f" cx="90" cy="80" r="60"/><circle cx="90" cy="80" r="3" fill="var(--ink)"/>' +
      '<line class="sv-s" x1="' + (diam ? 30 : 90) + '" y1="80" x2="150" y2="80"/><text x="' + (diam ? 90 : 120) + '" y="70" text-anchor="middle">' + lab + '</text>');
  }
  function cylSvg(rl, hl) {
    return svgBox(270, 200, 'A cylinder with radius and height labeled',
      '<path class="sv-f" d="M50 44 L50 150 A60 16 0 0 0 170 150 L170 44 A60 16 0 0 0 50 44 Z"/><ellipse class="sv-f" cx="110" cy="44" rx="60" ry="16"/>' +
      '<path class="sv-d" d="M50 150 A60 16 0 0 1 170 150"/><line class="sv-d" x1="110" y1="44" x2="170" y2="44"/>' +
      '<text x="176" y="48">' + rl + '</text><line class="sv-d" x1="188" y1="70" x2="188" y2="166"/><text x="196" y="122">' + hl + '</text>');
  }
  function coneSvg(rl, hl) {
    return svgBox(270, 200, 'A cone with radius and height labeled',
      '<path class="sv-f" d="M110 14 L50 150 A60 16 0 0 0 170 150 Z"/><path class="sv-d" d="M50 150 A60 16 0 0 1 170 150"/>' +
      '<line class="sv-d" x1="110" y1="14" x2="110" y2="150"/><line class="sv-d" x1="110" y1="150" x2="170" y2="150"/>' +
      '<text x="176" y="146">' + rl + '</text><text x="102" y="90" text-anchor="end">' + hl + '</text>');
  }
  function sphereSvg(rl) {
    return svgBox(270, 190, 'A sphere with its radius labeled',
      '<circle class="sv-f" cx="100" cy="95" r="70"/><path class="sv-d" d="M30 95 A70 18 0 0 0 170 95"/><path class="sv-s" d="M30 95 A70 18 0 0 1 170 95" style="opacity:.35"/>' +
      '<line class="sv-d" x1="100" y1="95" x2="170" y2="95"/><circle cx="100" cy="95" r="3" fill="var(--ink)"/><text x="176" y="99">' + rl + '</text>');
  }
  MQ.def('pav.circle', 'core', 'Circle: area or circumference in terms of π', function (r) {
    var v = r.int(1, 3), R = r.int(2, 12), D = 2 * R, q;
    if (v === 1) q = numQ('The diameter of a circle is ' + D + ' cm. What is its area? Give the answer in terms of π: enter the number that multiplies π.' + circleSvg('d = ' + D + ' cm', true), R * R, null, { v: v, R: R });
    else if (v === 2) q = numQ('The radius of a circle is ' + R + ' cm. What is its circumference? Give the answer in terms of π: enter the number that multiplies π.' + circleSvg('r = ' + R + ' cm'), 2 * R, null, { v: v, R: R });
    else q = numQ('The radius of a circle is ' + R + ' inches. What is its area? Give the answer in terms of π: enter the number that multiplies π.' + circleSvg('r = ' + R + ' in'), R * R, null, { v: v, R: R });
    q.hint = 'Enter a whole number. For example, if the answer is 36π, enter 36.';
    return q;
  });
  MQ.def('pav.cylinder', 'core', 'Volume of a cylinder', function (r) {
    var R = r.int(2, 8), h = r.int(3, 14), u = r.pick(['cm', 'in', 'ft']);
    var q = numQ('Find the volume of the cylinder. Give the answer in terms of π: enter the number that multiplies π.' + cylSvg('r = ' + R + ' ' + u, 'h = ' + h + ' ' + u), R * R * h, null, { R: R, h: h });
    q.hint = 'Enter a whole number. For example, if the answer is 144π, enter 144.';
    return q;
  });
  MQ.def('pav.conesphere', 'core', 'Volume of a cone or sphere', function (r) {
    var v = r.int(1, 3), R, h, q, u = r.pick(['cm', 'in', 'ft']);
    if (v === 1) { R = r.int(2, 8); h = 3 * r.int(1, 5); q = numQ('Find the volume of the cone. Give the answer in terms of π: enter the number that multiplies π.' + coneSvg('r = ' + R + ' ' + u, 'h = ' + h + ' ' + u), R * R * h / 3, null, { v: v, R: R, h: h }); }
    else if (v === 2) { R = r.pick([3, 6]); q = numQ('Find the volume of the sphere. Give the answer in terms of π: enter the number that multiplies π.' + sphereSvg('r = ' + R + ' ' + u), 4 * R * R * R / 3, null, { v: v, R: R }); }
    else { R = r.pick([3, 6]); q = numQ('A hemisphere (half of a sphere) has a radius of ' + R + ' ' + u + '. Find its volume. Give the answer in terms of π: enter the number that multiplies π.', 2 * R * R * R / 3, null, { v: v, R: R }); }
    q.hint = 'Enter a whole number. For example, if the answer is 36π, enter 36.';
    return q;
  });
  /* cross-sections and solids of revolution (G.GMD.B.4) */
  MQ.def('pav.slice', 'core', 'Cross-section of a solid', function (r) {
    var cases = [
      { s: 'cylinder', how: 'parallel to its bases', ans: 'Circle' },
      { s: 'cylinder', how: 'perpendicular to its bases, through the center of the bases', ans: 'Rectangle' },
      { s: 'cone', how: 'parallel to its base', ans: 'Circle' },
      { s: 'cone', how: 'perpendicular to its base, through the tip (apex)', ans: 'Triangle' },
      { s: 'sphere', how: 'at any angle', ans: 'Circle' },
      { s: 'rectangular prism', how: 'parallel to one of its faces', ans: 'Rectangle' },
      { s: 'square pyramid', how: 'parallel to its base', ans: 'Square' },
      { s: 'square pyramid', how: 'perpendicular to its base, through the apex and the midpoints of two opposite base edges', ans: 'Triangle' }
    ];
    var c = r.pick(cases), fig = '';
    if (c.s === 'cylinder') fig = c.ans === 'Circle'
      ? svgBox(240, 190, 'A cylinder cut by a horizontal plane', '<path class="sv-f" d="M50 44 L50 140 A60 16 0 0 0 170 140 L170 44 A60 16 0 0 0 50 44 Z"/><ellipse class="sv-f" cx="110" cy="44" rx="60" ry="16"/><ellipse class="sv-cut" cx="110" cy="92" rx="60" ry="16"/>')
      : svgBox(240, 190, 'A cylinder cut by a vertical plane', '<path class="sv-f" d="M50 44 L50 140 A60 16 0 0 0 170 140 L170 44 A60 16 0 0 0 50 44 Z"/><ellipse class="sv-f" cx="110" cy="44" rx="60" ry="16"/><rect class="sv-cut" x="110" y="44" width="1" height="112" style="stroke-width:3"/>');
    else if (c.s === 'cone') fig = c.ans === 'Circle'
      ? svgBox(240, 190, 'A cone cut by a horizontal plane', '<path class="sv-f" d="M110 12 L50 140 A60 16 0 0 0 170 140 Z"/><ellipse class="sv-cut" cx="110" cy="90" rx="36.5" ry="9"/>')
      : svgBox(240, 190, 'A cone cut by a vertical plane', '<path class="sv-f" d="M110 12 L50 140 A60 16 0 0 0 170 140 Z"/><rect class="sv-cut" x="110" y="12" width="1" height="144" style="stroke-width:3"/>');
    else if (c.s === 'sphere') fig = svgBox(200, 190, 'A sphere cut by a plane', '<circle class="sv-f" cx="100" cy="95" r="70"/><ellipse class="sv-cut" cx="100" cy="80" rx="62" ry="14"/>');
    else if (c.s === 'rectangular prism') fig = svgBox(240, 190, 'A rectangular prism cut by a plane parallel to a face', '<polygon class="sv-f" points="40,60 150,60 150,150 40,150"/><polygon class="sv-f" points="150,60 200,30 200,120 150,150"/><polygon class="sv-f" points="40,60 90,30 200,30 150,60"/><polygon class="sv-cut" points="40,105 150,105 200,75 90,75" style="fill:none"/>');
    else if (c.ans === 'Square') fig = svgBox(240, 190, 'A square pyramid cut by a plane parallel to the base', '<polygon class="sv-f" points="120,14 40,150 140,170 205,130"/><polygon class="sv-cut" points="80,90 130,98 162,72 112,64" style="fill:none"/>');
    else fig = svgBox(240, 190, 'A square pyramid cut by a vertical plane', '<polygon class="sv-f" points="120,14 40,150 140,170 205,130"/><line class="sv-cut" x1="120" y1="14" x2="90" y2="160" style="stroke-width:3"/>');
    var all = ['Circle', 'Rectangle', 'Triangle', 'Square', 'Trapezoid'];
    var dim = r.int(3, 12); var desc = c.s === 'sphere' ? 'sphere with radius ' + dim + ' cm' : (c.s === 'cylinder' ? 'cylinder with radius ' + dim + ' cm' : (c.s === 'cone' ? 'cone with radius ' + dim + ' cm' : c.s + ' with base edges of ' + dim + ' cm'));
    return mcShuffle(r, 'A plane slices a ' + desc + ' ' + c.how + '. What shape is the cross-section?' + fig, c.ans, all.filter(function (a) { return a !== c.ans; }), { s: c.s, how: c.how });
  });
  MQ.def('pav.rotate', 'core', 'Solid formed by rotating a 2-D shape', function (r) {
    var cases = [
      { shape: 'rectangle', axis: 'one of its sides', ans: 'Cylinder', svg: '<rect class="sv-f" x="70" y="30" width="70" height="110"/><line class="sv-d" x1="70" y1="14" x2="70" y2="156"/>' },
      { shape: 'right triangle', axis: 'one of its legs', ans: 'Cone', svg: '<polygon class="sv-f" points="70,30 70,140 150,140"/><line class="sv-d" x1="70" y1="14" x2="70" y2="156"/>' },
      { shape: 'semicircle', axis: 'its straight edge (diameter)', ans: 'Sphere', svg: '<path class="sv-f" d="M70 30 A55 55 0 0 1 70 140 Z"/><line class="sv-d" x1="70" y1="14" x2="70" y2="156"/>' },
      { shape: 'isosceles triangle', axis: 'the line through its apex and the midpoint of its base', ans: 'Cone', svg: '<polygon class="sv-f" points="110,30 60,140 160,140"/><line class="sv-d" x1="110" y1="14" x2="110" y2="156"/>' },
      { shape: 'circle', axis: 'a line through its center (a diameter)', ans: 'Sphere', svg: '<circle class="sv-f" cx="110" cy="85" r="55"/><line class="sv-d" x1="110" y1="14" x2="110" y2="156"/>' }
    ];
    var c = r.pick(cases), all = ['Cylinder', 'Cone', 'Sphere', 'Pyramid', 'Prism'], d1 = r.int(3, 9), d2 = r.int(3, 9);
    c.shape = c.shape === 'rectangle' ? 'rectangle ' + d1 + ' cm by ' + d2 + ' cm' : (c.shape === 'right triangle' ? 'right triangle with legs ' + d1 + ' cm and ' + d2 + ' cm' : (c.shape === 'semicircle' ? 'semicircle with radius ' + d1 + ' cm' : (c.shape === 'circle' ? 'circle with radius ' + d1 + ' cm' : c.shape + ' with base ' + 2 * d1 + ' cm and height ' + d2 + ' cm')));
    return mcShuffle(r, 'A ' + c.shape + ' is rotated 360° around the dashed line (' + c.axis + '). What solid does it form?' + svgBox(220, 170, 'A ' + c.shape + ' next to its axis of rotation', c.svg), c.ans, all.filter(function (a) { return a !== c.ans; }), { shape: c.shape });
  });
  MQ.def('pav.composite', 'core', 'Area or perimeter of a composite figure', function (r) {
    var W = r.int(9, 16), H = r.int(8, 14), w = r.int(3, W - 4), h = r.int(3, H - 4), fx = r.pick([1, -1]), fy = r.pick([1, -1]);
    var s = 14, ox = 50, oy = 30, PW = W * s, PH = H * s;
    function T(x, y) { var X = fx > 0 ? x : W - x, Y = fy > 0 ? y : H - y; return [ox + X * s, oy + (H - Y) * s]; }
    var pts = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]].map(function (p) { return T(p[0], p[1]); });
    var cx = ox + PW / 2, cy = oy + PH / 2;
    var cc = T(W, H);                                               // the corner that was cut away
    function lab(p, q, txt, notch) {
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, horiz = Math.abs(p[1] - q[1]) < 1e-6, sx, sy;
      if (notch === 'body') { sx = cc[0] > mx ? -1 : 1; sy = cc[1] > my ? -1 : 1; }
      else if (notch) { sx = cc[0] > mx ? 1 : -1; sy = cc[1] > my ? 1 : -1; }
      else { sx = mx > cx ? 1 : -1; sy = my > cy ? 1 : -1; }
      return '<text x="' + (mx + (horiz ? 0 : sx * 9)) + '" y="' + (my + (horiz ? sy * 11 + (sy > 0 ? 6 : -2) : 4)) + '" text-anchor="' + (horiz ? 'middle' : (sx > 0 ? 'start' : 'end')) + '">' + txt + '</text>';
    }
    var fig = svgBox(ox * 2 + PW, oy * 2 + PH, 'A composite figure made by removing a rectangle from a corner of a larger rectangle',
      '<polygon class="sv-f" points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '"/>' +
      lab(pts[0], pts[1], W + ' ft') + lab(pts[5], pts[0], H + ' ft') + lab(pts[3], pts[4], h + ' ft', true) + lab(pts[2], pts[3], w + ' ft', 'body'));
    // note: pts[2]->pts[3] is the horizontal cut edge (length w); pts[3]->pts[4] is the vertical cut edge (length h)
    var area = r.f() < 0.5;
    return numQ('The figure is a large rectangle with a smaller rectangle cut out of one corner. All corners are right angles. ' + (area ? 'What is the area of the figure, in square feet?' : 'What is the perimeter of the figure, in feet?') + fig,
      area ? W * H - w * h : 2 * (W + H), null, { W: W, H: H, w: w, h: h, area: area });
  });

  /* =====================================================================
     SYMMETRY & CONGRUENCE  (G.CO.A.3, A.5, B.6, B.7)
     ===================================================================== */
  function regPoly(n, cx, cy, R, off) {
    var pts = [], i;
    for (i = 0; i < n; i++) { var a = -Math.PI / 2 + (off || 0) + 2 * Math.PI * i / n; pts.push((cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1)); }
    return pts.join(' ');
  }
  var POLY_NAMES = { 3: 'equilateral triangle', 4: 'square', 5: 'regular pentagon', 6: 'regular hexagon', 8: 'regular octagon', 9: 'regular nonagon', 10: 'regular decagon', 12: 'regular dodecagon' };
  MQ.def('co.symmetry', 'core', 'Lines of symmetry and rotations', function (r) {
    var v = r.int(1, 3), n, q, fig, off = r.pick([0, 0.5, 1]) * Math.PI / 6 * r.pick([0, 1]);
    if (v === 1) {
      n = r.pick([3, 4, 5, 6, 8]);
      fig = svgBox(200, 170, 'A ' + POLY_NAMES[n], '<polygon class="sv-f" points="' + regPoly(n, 100, 88, 68, off) + '"/>');
      q = numQ('How many lines of symmetry does a ' + POLY_NAMES[n] + ' have?' + fig, n, null, { v: v, n: n });
    } else if (v === 2) {
      n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]);
      fig = svgBox(200, 170, 'A ' + POLY_NAMES[n], '<polygon class="sv-f" points="' + regPoly(n, 100, 88, 68, off) + '"/><circle cx="100" cy="88" r="3" fill="var(--ink)"/>');
      q = numQ('What is the smallest positive angle of rotation (in degrees) about its center that maps a ' + POLY_NAMES[n] + ' onto itself?' + fig, 360 / n, null, { v: v, n: n });
    } else {
      var shapes = [
        { name: 'rectangle (not a square)', lines: 2, svg: '<rect class="sv-f" x="35" y="45" width="130" height="80"/>' },
        { name: 'isosceles triangle (not equilateral)', lines: 1, svg: '<polygon class="sv-f" points="100,25 45,135 155,135"/>' },
        { name: 'rhombus (not a square)', lines: 2, svg: '<polygon class="sv-f" points="100,20 160,85 100,150 40,85"/>' },
        { name: 'parallelogram (not a rectangle or rhombus)', lines: 0, svg: '<polygon class="sv-f" points="60,45 170,45 140,125 30,125"/>' },
        { name: 'kite', lines: 1, svg: '<polygon class="sv-f" points="100,20 150,70 100,150 50,70"/>' }
      ];
      var sh = r.pick(shapes);
      if (sh.name === 'kite') sh = { name: 'kite', lines: 1, svg: '<polygon class="sv-f" points="100,15 155,60 100,155 45,60"/>' };
      q = numQ('How many lines of symmetry does this ' + sh.name + ' have?' + svgBox(200, 170, 'A ' + sh.name, sh.svg), sh.lines, null, { v: v, name: sh.name });
    }
    q.hint = 'Enter a whole number.';
    return q;
  });

  function triPts(r, lo, hi) {                                   // scalene lattice triangle with area >= 4
    var p, tries = 0;
    do {
      p = [[r.int(lo, hi), r.int(lo, hi)], [r.int(lo, hi), r.int(lo, hi)], [r.int(lo, hi), r.int(lo, hi)]];
      var cr = (p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[1][1] - p[0][1]) * (p[2][0] - p[0][0]);
      var d = [0, 1, 2].map(function (i) { var a = p[i], b = p[(i + 1) % 3]; return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]); });
      var distinct = d[0] !== d[1] && d[1] !== d[2] && d[0] !== d[2];
      var dup = (p[0][0] === p[1][0] && p[0][1] === p[1][1]);
      tries++;
      if (Math.abs(cr) >= 8 && distinct && !dup) return p;
    } while (tries < 500);
    return [[1, 1], [4, 2], [2, 5]];
  }
  function tr(kind, p, t) {
    var x = p[0], y = p[1];
    if (kind === 'tx') return [x, -y];
    if (kind === 'ty') return [-x, y];
    if (kind === 'r90') return [-y, x];
    if (kind === 'r180') return [-x, -y];
    return [x + t[0], y + t[1]];
  }
  function triSvgP(P, pts, cls, names) {
    var s = '<polygon class="' + cls + '" points="' + pts.map(function (p) { return P.X(p[0]) + ',' + P.Y(p[1]); }).join(' ') + '"/>';
    if (names) pts.forEach(function (p, i) {
      var cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
      var dx = p[0] - cx, dy = p[1] - cy, l = Math.sqrt(dx * dx + dy * dy) || 1;
      s += '<text class="sv-t" x="' + (P.X(p[0]) + (dx / l) * 13) + '" y="' + (P.Y(p[1]) - (dy / l) * 13 + 4) + '" text-anchor="middle">' + names[i] + '</text>';
    });
    return s;
  }
  MQ.def('co.transform', 'core', 'Image of a point after a transformation', function (r) {
    var kinds = [['tx', 'reflected across the <i>x</i>-axis'], ['ty', 'reflected across the <i>y</i>-axis'], ['r90', 'rotated 90° counterclockwise about the origin'], ['r180', 'rotated 180° about the origin'], ['t', null]];
    var k = r.pick(kinds), P0 = triPts(r, -5, 5), t = [0, 0], idx = r.int(0, 2), names = ['A', 'B', 'C'];
    var desc = k[1];
    if (k[0] === 't') {
      t = [r.pick([-3, -2, 2, 3]), r.pick([-3, -2, 2, 3])];
      var tdx = t[0] < 0 ? Math.abs(t[0]) + ' units left' : t[0] + ' units right', tdy = t[1] < 0 ? Math.abs(t[1]) + ' units down' : t[1] + ' units up';
      desc = 'translated ' + tdx + ' and ' + tdy;
    }
    var P = plane({ x0: -8, x1: 8, y0: -8, y1: 8, u: 20, ts: 2, label: 'Triangle ABC on a coordinate grid' });
    var v = P0[idx], img = tr(k[0], v, t), name = names[idx];
    var wrong = [];
    ['tx', 'ty', 'r90', 'r180'].forEach(function (kk) { if (kk !== k[0]) wrong.push(ptStr.apply(null, tr(kk, v, t))); });
    wrong.push(ptStr(v[1], v[0])); wrong.push(ptStr(-v[1], -v[0]));
    if (k[0] === 't') { wrong.push(ptStr(v[0] - t[0], v[1] - t[1])); wrong.push(ptStr(v[0] + t[0], v[1] - t[1])); }
    var good = ptStr(img[0], img[1]);
    [[1, 0], [0, 1], [-1, 0], [0, -1], [2, 0], [0, 2]].forEach(function (d) { wrong.push(ptStr(img[0] + d[0], img[1] + d[1])); });
    return mcShuffle(r, 'Triangle <i>ABC</i> is ' + desc + '. What are the coordinates of <i>' + name + '</i>′, the image of vertex <i>' + name + '</i>?' + P.wrap(triSvgP(P, P0, 'sv-f', names)),
      good, wrong.filter(function (w) { return w !== good; }), { P0: P0, kind: k[0], t: t, idx: idx });
  });

  MQ.def('co.identify', 'core', 'Identify a rigid motion from a picture', function (r) {
    var T0, kinds = ['tx', 'ty', 'r180', 't'], k = r.pick(kinds), t = [0, 0], img, tries = 0, ok;
    function key(a) { return a.map(function (p) { return p.join(','); }).sort().join(';'); }
    do {
      T0 = triPts(r, 1, 5); t = [r.pick([-7, -6, -5, -4, 4, 5, 6, 7]), r.pick([-3, -2, 0, 2, 3])];
      img = T0.map(function (p) { return tr(k, p, t); });
      ok = img.every(function (p) { return Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8; });
      ['tx', 'ty', 'r180'].concat(['t']).forEach(function (kk) { if (kk !== k && key(T0.map(function (p) { return tr(kk, p, t); })) === key(img)) ok = false; });
      if (k === 't' && key(img) === key(T0)) ok = false;
      tries++;
    } while (!ok && tries < 400);
    var P = plane({ x0: -8, x1: 8, y0: -8, y1: 8, u: 20, ts: 2, label: 'Triangle and its image on a coordinate grid' });
    var inner = triSvgP(P, T0, 'sv-f', null) + triSvgP(P, img, 'sv-f2', null);
    var ch = ['Translation', 'Reflection across the <i>x</i>-axis', 'Reflection across the <i>y</i>-axis', 'Rotation of 180° about the origin'];
    var good = k === 't' ? 0 : (k === 'tx' ? 1 : (k === 'ty' ? 2 : 3));
    return mcQ('The blue triangle is moved to the red triangle by one rigid motion. Which motion is it?' + P.wrap(inner), ch, good, { T0: T0, img: img, kind: k });
  });

  MQ.def('co.criteria', 'core', 'Triangle congruence criteria', function (r) {
    var cases = [
      { given: 'AB = DE, BC = EF, and AC = DF', ans: 0 },
      { given: 'AB = DE, ∠B = ∠E, and BC = EF', ans: 1 },
      { given: '∠A = ∠D, AB = DE, and ∠B = ∠E', ans: 2 },
      { given: '∠A = ∠D, ∠B = ∠E, and BC = EF', ans: 3 },
      { given: 'AB = DE, BC = EF, and ∠A = ∠D', ans: 4 },
      { given: '∠A = ∠D, ∠B = ∠E, and ∠C = ∠F', ans: 4 },
      { given: 'AC = DF, ∠C = ∠F, and BC = EF', ans: 1 },
      { given: '∠B = ∠E, BC = EF, and ∠C = ∠F', ans: 2 }
    ];
    var c = r.pick(cases), sets = [['A', 'B', 'C', 'D', 'E', 'F'], ['P', 'Q', 'R', 'X', 'Y', 'Z'], ['J', 'K', 'L', 'M', 'N', 'O'], ['G', 'H', 'I', 'S', 'T', 'U'], ['T', 'U', 'V', 'W', 'X', 'Y']], ls = r.pick(sets), L6 = ['A', 'B', 'C', 'D', 'E', 'F'];
    function relabel(s) { return s.replace(/[A-F]/g, function (ch) { return ls[L6.indexOf(ch)]; }); }
    c = { given: relabel(c.given), ans: c.ans, names: [ls[0] + ls[1] + ls[2], ls[3] + ls[4] + ls[5]] };
    var ch = ['SSS (side-side-side)', 'SAS (side-angle-side)', 'ASA (angle-side-angle)', 'AAS (angle-angle-side)', 'The triangles cannot be proven congruent from this information'];
    return mcQ('In △<i>' + c.names[0] + '</i> and △<i>' + c.names[1] + '</i>, ' + c.given + '. Which congruence criterion proves △<i>' + c.names[0] + '</i> ≅ △<i>' + c.names[1] + '</i>?', ch, c.ans, { given: c.given, names: c.names });
  });

  MQ.def('co.corresp', 'core', 'Corresponding parts of congruent triangles', function (r) {
    var perm = r.shuffle(['D', 'E', 'F']), L = ['A', 'B', 'C'], v = r.int(1, 2), q, a, b;
    var stmt = '△<i>ABC</i> ≅ △<i>' + perm.join('') + '</i>';
    if (v === 1) {
      a = r.int(30, 80); do { b = r.int(30, 80); } while (b === a || a + b > 140);
      q = numQ('Given ' + stmt + ', m∠<i>A</i> = ' + a + '° and m∠<i>B</i> = ' + b + '°. Find m∠<i>' + perm[2] + '</i>.', 180 - a - b, null, { v: v, perm: perm, a: a, b: b });
    } else {
      var sides = [r.int(5, 8), r.int(9, 12), r.int(13, 16)];
      sides = r.shuffle(sides);                                    // AB, BC, CA
      var pair = r.pick([[0, 1, 'AB'], [1, 2, 'BC'], [2, 0, 'CA']]);
      var letters = r.shuffle([perm[pair[0]], perm[pair[1]]]).join('');
      var pi = pair[2] === 'AB' ? 0 : (pair[2] === 'BC' ? 1 : 2);
      q = numQ('Given ' + stmt + ', with <i>AB</i> = ' + sides[0] + ', <i>BC</i> = ' + sides[1] + ', and <i>CA</i> = ' + sides[2] + '. What is the length of <i>' + letters + '</i>?', sides[pi], null, { v: v, perm: perm, sides: sides, pair: pair[2], letters: letters });
    }
    q.hint = 'Enter a number. Match the letters in order: the first letters correspond, the second letters correspond, and so on.';
    return q;
  });

  /* =====================================================================
     INEQUALITIES  (A1.CED.A.1, A.3, A1.REI.A.1, C.1)
     ===================================================================== */
  var FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
  function ineq(op, v) { return '<i>x</i> ' + op + ' ' + mi(v); }
  MQ.def('in.solve', 'core', 'Solve a two-step inequality', function (r) {
    var op = r.pick(['<', '>', '≤', '≥']), a = r.pick([2, 3, 4, 5, -2, -3, -4, -5]), x0 = r.nz(-8, 8), b = r.nz(-12, 12), c = a * x0 + b;
    var lhs = lin(a, b), real = a > 0 ? op : FLIP[op], good = ineq(real, x0);
    var wrong = [ineq(FLIP[real], x0), ineq(real, -x0), ineq(FLIP[real], -x0)];
    return mcShuffle(r, 'Solve the inequality.<div class="eq">' + lhs + ' ' + op + ' ' + mi(c) + '</div>', good, wrong, { a: a, b: b, c: c, op: op, x0: x0 });
  });
  MQ.def('in.write', 'core', 'Write an inequality from a situation', function (r) {
    var v = r.int(1, 2), B, F, p, good, wrong, html;
    if (v === 1) {
      F = r.int(8, 20); p = r.int(2, 5); B = F + p * r.int(4, 9) + r.int(0, p - 1) + 5;
      html = 'Leah has ' + money(B) + ' to spend at a fair. She buys a ' + money(F) + ' ticket and then spends ' + money(p) + ' on each ride. Let <i>x</i> be the number of rides. Which inequality shows how many rides she can afford?';
      good = p + '<i>x</i> + ' + F + ' ≤ ' + B; wrong = [p + '<i>x</i> + ' + F + ' ≥ ' + B, F + '<i>x</i> + ' + p + ' ≤ ' + B, p + '<i>x</i> + ' + F + ' < ' + B];
    } else {
      F = r.int(40, 70); p = r.int(3, 9); B = 100;
      html = 'Marcus has ' + F + ' points in a class and needs at least ' + B + ' points to earn an A. Each quiz is worth ' + p + ' points. Let <i>x</i> be the number of quizzes he still takes. Which inequality shows how many quizzes he needs?';
      good = F + ' + ' + p + '<i>x</i> ≥ ' + B; wrong = [F + ' + ' + p + '<i>x</i> ≤ ' + B, F + ' + ' + p + '<i>x</i> > ' + B, p + ' + ' + F + '<i>x</i> ≥ ' + B];
    }
    return mcShuffle(r, html, good, wrong, { v: v, B: B, F: F, p: p });
  });
  MQ.def('in.graph', 'core', 'Match a number-line graph to an inequality', function (r) {
    var b = r.int(-5, 5), op = r.pick(['<', '>', '≤', '≥']), closed = (op === '≤' || op === '≥'), right = (op === '>' || op === '≥');
    var u = 26, ox = 30, W = ox * 2 + u * 12, H = 78, X = function (v) { return ox + (v + 6) * u; }, s = '', i;
    s += '<line class="gp-axis" x1="' + X(-6) + '" y1="38" x2="' + X(6) + '" y2="38"/>';
    for (i = -6; i <= 6; i++) s += '<line class="gp-axis" x1="' + X(i) + '" y1="33" x2="' + X(i) + '" y2="43"/><text x="' + X(i) + '" y="60" text-anchor="middle">' + mi(i) + '</text>';
    var ex = right ? X(6) : X(-6), dir = right ? 1 : -1;
    s += '<line class="sv-ray" x1="' + X(b) + '" y1="38" x2="' + ex + '" y2="38"/><polygon class="sv-arrow" points="' + ex + ',38 ' + (ex - dir * 9) + ',32 ' + (ex - dir * 9) + ',44"/>';
    s += '<circle class="' + (closed ? 'sv-pt' : 'sv-open') + '" cx="' + X(b) + '" cy="38" r="6.5"/>';
    var fig = '<div class="fig"><svg class="gp" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="A number line graph of an inequality">' + s + '</svg></div>';
    var good = ineq(op, b), wrong = ['<', '>', '≤', '≥'].filter(function (o) { return o !== op; }).map(function (o) { return ineq(o, b); });
    return mcShuffle(r, 'Which inequality is graphed on the number line?' + fig, good, wrong, { b: b, op: op });
  });
  MQ.def('in.max', 'core', 'How many can you afford? (constraint)', function (r) {
    var v = r.int(1, 2), q, B, F, p, n, extra;
    if (v === 1) {
      p = r.pick([3, 4, 5, 6, 7, 8]); F = r.int(5, 15); n = r.int(5, 12); extra = r.int(1, p - 1); B = F + p * n + extra;
      q = numQ('Sam has ' + money(B) + ' to spend at an arcade. Entry costs ' + money(F) + ', and each game costs ' + money(p) + '. What is the greatest number of games Sam can play?', n, null, { v: v, B: B, F: F, p: p });
    } else {
      p = r.pick([12, 15, 18, 20, 25]); var have = r.pick([30, 45, 60, 75, 90]); n = r.int(4, 14); extra = r.int(1, p - 1); var goal = have + p * (n - 1) + extra;
      q = numQ('Ana wants to save at least ' + money(goal) + ' for a trip. She already has ' + money(have) + ' and earns ' + money(p) + ' for each lawn she mows. What is the least number of lawns she must mow?', n, null, { v: v, goal: goal, have: have, p: p });
    }
    q.hint = 'Enter a whole number.';
    return q;
  });
  MQ.def('in.justify', 'core', 'Justify a step in solving an equation', function (r) {
    var a = r.int(2, 6), b = r.nz(-8, 8), x0 = r.int(-6, 9), c = a * (x0 + b), step = r.int(2, 4);
    var lines = [a + '(<i>x</i> ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ') = ' + mi(c),
      a + '<i>x</i> ' + (a * b < 0 ? '− ' + (-a * b) : '+ ' + (a * b)) + ' = ' + mi(c),
      a + '<i>x</i> = ' + mi(c - a * b),
      '<i>x</i> = ' + mi(x0)];
    var reasons = ['Distributive Property', a * b > 0 ? 'Subtraction Property of Equality' : 'Addition Property of Equality', 'Division Property of Equality'];
    var all = ['Distributive Property', 'Addition Property of Equality', 'Subtraction Property of Equality', 'Division Property of Equality', 'Multiplication Property of Equality'];
    var good = reasons[step - 2];
    var html = 'A student solves an equation. Each step is shown.<div class="steps">' + lines.map(function (l, i) { return '<div><span class="sn">Step ' + (i + 1) + '</span> ' + l + '</div>'; }).join('') +
      '</div>Which property justifies <b>Step ' + step + '</b>?';
    return mcShuffle(r, html, good, all.filter(function (x) { return x !== good; }), { a: a, b: b, c: c, x0: x0, step: step });
  });

  /* =====================================================================
     PROBABILITY  (7.DSP.C.6, C.7, C.8)
     ===================================================================== */
  MQ.def('pr.simple', 'core', 'Probability of a simple event', function (r) {
    var R = r.int(2, 7), B = r.int(2, 7), G = r.int(1, 6), T = R + B + G, v = r.int(1, 3), n, html;
    var bag = 'A bag contains ' + R + ' red, ' + B + ' blue, and ' + G + ' green marbles. One marble is chosen at random. ';
    if (v === 1) { n = R; html = bag + 'What is the probability that it is red?'; }
    else if (v === 2) { n = B + G; html = bag + 'What is the probability that it is <b>not</b> red?'; }
    else { n = B + R; html = bag + 'What is the probability that it is red <b>or</b> blue?'; }
    return fracQ(html, n, T, { R: R, B: B, G: G, v: v });
  });
  MQ.def('pr.experimental', 'core', 'Experimental probability and predictions', function (r) {
    var T = r.pick([20, 25, 40, 50]), h = r.int(3, T - 5), v = r.int(1, 2), k, q;
    var thing = r.pick([['spinner', 'landed on blue', 'spins'], ['number cube', 'showed a 6', 'rolls'], ['coin-toss machine', 'landed heads', 'tosses']]);
    if (v === 1) {
      k = r.int(2, 6);
      q = numQ('A ' + thing[0] + ' was tested. In ' + T + ' ' + thing[2] + ', it ' + thing[1] + ' ' + h + ' times. Based on these results, about how many times would you expect it to have ' + thing[1].replace('landed', 'landed').replace('showed', 'shown') + ' in ' + T * k + ' ' + thing[2] + '?', h * k, null, { v: v, T: T, h: h, k: k });
      q.html = 'A ' + thing[0] + ' was tested. In ' + T + ' ' + thing[2] + ', the result was “' + thing[1].replace(/^(landed on|showed a|landed) /, '') + '” ' + h + ' times. Based on these results, about how many times would you expect that result in ' + T * k + ' ' + thing[2] + '?';
      q.hint = 'Enter a whole number.';
    } else {
      q = fracQ('A ' + thing[0] + ' was tested. In ' + T + ' ' + thing[2] + ', the result was “' + thing[1].replace(/^(landed on|showed a|landed) /, '') + '” ' + h + ' times. What is the experimental probability of that result?', h, T, { v: v, T: T, h: h });
    }
    return q;
  });
  MQ.def('pr.compound', 'core', 'Probability of a compound event', function (r) {
    var v = r.int(1, 3), n, d, html, a, b, t, k, ev;
    if (v === 1) {
      ev = r.pick([['a number greater than 4', 2], ['an even number', 3], ['a number less than 3', 2], ['a multiple of 3', 2], ['a number greater than 2', 4]]);
      html = 'A fair coin is tossed and a fair six-sided number cube is rolled. What is the probability of getting heads <b>and</b> ' + ev[0] + '?'; n = ev[1]; d = 12;
    } else if (v === 2) {
      a = r.pick([4, 5, 6, 8]); b = r.pick([3, 4, 5, 6]); var ra = r.int(1, a - 1), gb = r.int(1, b - 1);
      html = 'Spinner 1 has ' + a + ' equal sections, ' + ra + ' of them red. Spinner 2 has ' + b + ' equal sections, ' + gb + ' of them green. Each spinner is spun once. What is the probability that spinner 1 lands on red <b>and</b> spinner 2 lands on green?'; n = ra * gb; d = a * b;
    } else {
      t = r.pick([4, 5, 6, 8, 10]); k = r.int(1, t - 1);
      html = 'A bag has ' + t + ' marbles, ' + k + ' of them red. A marble is drawn, <b>put back</b>, and a second marble is drawn. What is the probability that both marbles are red?'; n = k * k; d = t * t;
    }
    return fracQ(html, n, d, { v: v });
  });
  MQ.def('pr.counting', 'core', 'Counting outcomes (sample space)', function (r) {
    var v = r.int(1, 3), a, b, c, q;
    if (v === 1) { a = r.int(3, 6); b = r.int(2, 5); c = r.int(2, 4); q = numQ('An outfit is one shirt, one pair of pants, and one pair of shoes. Kai has ' + a + ' shirts, ' + b + ' pairs of pants, and ' + c + ' pairs of shoes. How many different outfits are possible?', a * b * c, null, { v: v, a: a, b: b, c: c }); q.hint = 'Enter a whole number.'; }
    else if (v === 2) { a = r.int(3, 5); b = r.int(3, 5); c = r.int(2, 3); q = numQ('A lunch special lets you pick 1 of ' + a + ' sandwiches, 1 of ' + b + ' sides, and 1 of ' + c + ' drinks. How many different lunches are possible?', a * b * c, null, { v: v, a: a, b: b, c: c }); q.hint = 'Enter a whole number.'; }
    else { a = r.int(2, 4); b = r.int(3, 5); q = fracQ('A game picks one of ' + a + ' colors and one of ' + b + ' numbers at random, each equally likely. What is the probability that it picks one specific color-and-number pair?', 1, a * b, { v: v, a: a, b: b }); }
    return q;
  });
  MQ.def('pr.nonreplace', 'core', 'Probability without replacement', function (r) {
    var t = r.int(5, 10), R = r.int(2, t - 2), B = r.int(1, t - R), v = r.int(1, 2), n, d = t * (t - 1), html;
    var bag = 'A bag has ' + R + ' red marbles and ' + (t - R) + ' blue marbles. Two marbles are drawn one after the other <b>without</b> putting the first one back. ';
    if (v === 1) { html = bag + 'What is the probability that both are red?'; n = R * (R - 1); }
    else { html = bag + 'What is the probability that the first is red and the second is blue?'; n = R * (t - R); }
    return fracQ(html, n, d, { t: t, R: R, v: v });
  });
  MQ.def('pr.simulate', 'core', 'Choose a simulation for a probability', function (r) {
    var v = r.int(1, 2), k, html, good, wrong;
    if (v === 1) {
      k = r.int(2, 8);
      var who = r.pick([['A basketball player', 'her free throws', 'her shot', 'free throw'], ['A soccer player', 'her penalty kicks', 'her kick', 'penalty kick'], ['A baseball player', 'his at-bats', 'his at-bat', 'at-bat'], ['A volleyball player', 'her serves', 'her serve', 'serve']]);
      html = who[0] + ' succeeds on ' + (k * 10) + '% of ' + who[1] + '. To simulate one ' + who[3] + ', you use a random digit from 0 to 9. Which assignment models ' + who[2] + ' correctly (success = make)?';
      var rng = function (m) { return m === 1 ? 'the digit 0' : 'digits 0–' + (m - 1); };
      var rest = function (m) { return m === 9 ? 'the digit 9' : 'digits ' + m + '–9'; };
      good = rng(k) + ' = make, ' + rest(k) + ' = miss';
      wrong = [k < 9 ? rng(k + 1) + ' = make, ' + rest(k + 1) + ' = miss' : '', k > 2 ? rng(k - 1) + ' = make, ' + rest(k - 1) + ' = miss' : '', rng(10 - k) + ' = make, ' + rest(10 - k) + ' = miss', rng(Math.min(9, k + 2)) + ' = make, ' + rest(Math.min(9, k + 2)) + ' = miss'].filter(function (x) { return x; });
    } else {
      k = r.pick([1, 2, 3, 4, 5]);
      html = 'A weather forecast says there is a ' + k + ' in 6 chance of rain on a given day. To simulate one day, you roll a fair six-sided number cube. Which assignment models the chance of rain correctly?';
      var nums = function (m) { return m === 1 ? 'a roll of 1' : 'rolls of 1–' + m; };
      var oth = function (m) { return m === 5 ? 'a roll of 6' : (m === 6 ? 'nothing' : 'rolls of ' + (m + 1) + '–6'); };
      good = nums(k) + ' = rain, ' + oth(k) + ' = no rain';
      wrong = [];
      [k + 1, k - 1, 6 - k].forEach(function (m) { if (m >= 1 && m <= 5 && m !== k) wrong.push(nums(m) + ' = rain, ' + oth(m) + ' = no rain'); });
      [2, 3, 1, 4].forEach(function (m) { if (m !== k && wrong.length < 4) { var s = nums(m) + ' = rain, ' + oth(m) + ' = no rain'; if (wrong.indexOf(s) < 0) wrong.push(s); } });
    }
    return mcShuffle(r, html, good, wrong, { v: v, k: k });
  });

  /* =====================================================================
     DATA ORGANIZATION & GRAPHS  (8.DSP.A.1, A.2, A.4)
     ===================================================================== */
  function pearson(xs, ys) {
    var n = xs.length, mx = 0, my = 0, i; for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; } mx /= n; my /= n;
    var sxy = 0, sxx = 0, syy = 0; for (i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); syy += (ys[i] - my) * (ys[i] - my); }
    return sxy / Math.sqrt(sxx * syy);
  }
  function quadR2(xs, ys) {                                      // R² of the best quadratic fit (normal equations, 3x3)
    var n = xs.length, S = [0, 0, 0, 0, 0], T = [0, 0, 0], i;
    for (i = 0; i < n; i++) { var x = xs[i], y = ys[i]; S[0] += 1; S[1] += x; S[2] += x * x; S[3] += x * x * x; S[4] += x * x * x * x; T[0] += y; T[1] += x * y; T[2] += x * x * y; }
    var M = [[S[0], S[1], S[2], T[0]], [S[1], S[2], S[3], T[1]], [S[2], S[3], S[4], T[2]]], k, j, m;
    for (k = 0; k < 3; k++) { var p = k; for (j = k + 1; j < 3; j++) if (Math.abs(M[j][k]) > Math.abs(M[p][k])) p = j; var tmp = M[k]; M[k] = M[p]; M[p] = tmp;
      for (j = k + 1; j < 3; j++) { var f = M[j][k] / M[k][k]; for (m = k; m < 4; m++) M[j][m] -= f * M[k][m]; } }
    var c = [0, 0, 0]; for (k = 2; k >= 0; k--) { var sum = M[k][3]; for (j = k + 1; j < 3; j++) sum -= M[k][j] * c[j]; c[k] = sum / M[k][k]; }
    var my = T[0] / n, ssr = 0, sst = 0; for (i = 0; i < n; i++) { var e = ys[i] - (c[0] + c[1] * xs[i] + c[2] * xs[i] * xs[i]); ssr += e * e; sst += (ys[i] - my) * (ys[i] - my); }
    return 1 - ssr / sst;
  }
  function clip(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function scatter(P, xs, ys) { var s = ''; for (var i = 0; i < xs.length; i++) s += '<circle class="gp-dot" cx="' + P.X(xs[i]) + '" cy="' + P.Y(ys[i]) + '" r="4.4"/>'; return s; }
  var DA_CTX = [
    { x: 'Hours studied', y: 'Test score' }, { x: 'Hours of sleep', y: 'Reaction time (ms)' }, { x: 'Daily screen time (hours)', y: 'Books read per month' }, { x: 'Temperature (°F)', y: 'Cups of cocoa sold' }
  ];
  MQ.def('da.assoc', 'core', 'Describe the association in a scatter plot', function (r) {
    var kind = r.pick(['pos', 'neg', 'none', 'curve']), xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ys, tries = 0, ok, i;
    do {
      ys = xs.map(function (x) {
        var e = r.pick([-1, 0, 0, 1]);
        if (kind === 'pos') return clip(Math.round(0.9 * x + 0.4 + e), 0, 10);
        if (kind === 'neg') return clip(Math.round(10.4 - 0.9 * x + e), 0, 10);
        if (kind === 'none') return r.int(1, 9);
        var up = r.f() < 0.5;
        return clip(Math.round((9 - 0.4 * (x - 5.5) * (x - 5.5)) + (kind === 'curve' ? e : 0)), 0, 10);
      });
      var rr = pearson(xs, ys), q2 = quadR2(xs, ys);
      ok = kind === 'pos' ? rr > 0.88 : kind === 'neg' ? rr < -0.88 : kind === 'none' ? (Math.abs(rr) < 0.3 && q2 < 0.45) : (Math.abs(rr) < 0.35 && q2 > 0.92);
      tries++;
    } while (!ok && tries < 3000);
    var c = r.pick(DA_CTX), P = plane({ x0: 0, x1: 11, y0: 0, y1: 10, ux: 26, uy: 26, xl: c.x, yl: c.y, label: 'Scatter plot of ' + c.y + ' versus ' + c.x });
    var ch = ['Positive linear association', 'Negative linear association', 'No association', 'Nonlinear association'];
    return mcQ('The scatter plot shows a data set. Which statement best describes the association between the two variables?' + P.wrap(scatter(P, xs, ys)), ch, { pos: 0, neg: 1, none: 2, curve: 3 }[kind], { kind: kind, xs: xs, ys: ys });
  });
  MQ.def('da.trend', 'core', 'Use a trend line to make a prediction', function (r) {
    var lines = [[0.5, 1], [0.5, 2], [0.5, 3], [1, 1], [1, 2], [-0.5, 8], [-0.5, 9], [-1, 11], [0.5, 4], [1, 0]], L = r.pick(lines), m = L[0], b = L[1];
    var xs = [1, 2, 3, 4, 5, 6, 7, 8, 9], ys = xs.map(function (x) { return clip(m * x + b + r.pick([-1, -0.5, 0, 0.5, 1]), 0, 12); });
    var ks = [2, 4, 6, 8].filter(function (k) { return Number.isInteger(m * k + b) && m * k + b >= 0 && m * k + b <= 12; }), k = r.pick(ks);
    var c = r.pick(DA_CTX), P = plane({ x0: 0, x1: 10, y0: 0, y1: 12, ux: 28, uy: 22, gs: 1, ts: 2, xl: c.x, yl: c.y, label: 'Scatter plot with a trend line' });
    var x2 = m > 0 ? Math.min(10, (12 - b) / m) : 10, inner = '<line class="gp-line" x1="' + P.X(0) + '" y1="' + P.Y(b) + '" x2="' + P.X(x2) + '" y2="' + P.Y(m * x2 + b) + '"/>' + scatter(P, xs, ys);
    var q = numQ('The scatter plot shows data and a trend line (line of best fit). Use the trend line to predict the value of <i>y</i> when <i>x</i> = ' + k + '.' + P.wrap(inner), m * k + b, null, { m: m, b: b, k: k, xs: xs, ys: ys });
    q.hint = 'Enter a number. Find ' + k + ' on the horizontal axis, go up to the line, then across to the vertical axis.';
    return q;
  });
  var MODEL_CTX = [
    { x: 'hours', xs: 'hour', y: 'cost of renting a bike', u: 'dollars', pre: '$' },
    { x: 'weeks', xs: 'week', y: 'height of a plant', u: 'centimeters', pre: '' },
    { x: 'weeks', xs: 'week', y: 'amount saved', u: 'dollars', pre: '$' },
    { x: 'minutes', xs: 'minute', y: 'distance a runner has covered', u: 'meters', pre: '' }
  ];
  MQ.def('da.model', 'core', 'Interpret the slope and intercept of a linear model', function (r) {
    var c = r.pick(MODEL_CTX), m = r.pick([2, 3, 4, 5, 6, 8, 12]), b = r.pick([5, 8, 10, 12, 15, 20, 25]), ask = r.pick(['slope', 'int']);
    var eq = '<i>y</i> = ' + m + '<i>x</i> + ' + b, per = 'each additional ' + c.xs;
    var ctx = 'A scatter plot of the ' + c.y + ' (<i>y</i>, in ' + c.u + ') after <i>x</i> ' + c.x + ' is modeled by the line ' + eq + '. ';
    var sMean = 'The ' + c.y + ' increases by ' + m + ' ' + c.u + ' for ' + per, iMean = 'The ' + c.y + ' when <i>x</i> = 0 (at the start) is ' + b + ' ' + c.u;
    var sw = 'The ' + c.y + ' when <i>x</i> = 0 (at the start) is ' + m + ' ' + c.u, iw = 'The ' + c.y + ' increases by ' + b + ' ' + c.u + ' for ' + per;
    var html = ctx + 'What does the ' + (ask === 'slope' ? 'slope, ' + m : 'y-intercept, ' + b) + ', mean in this situation?';
    var good = ask === 'slope' ? sMean : iMean, wrong = ask === 'slope'
      ? [sw, 'The number of ' + c.x + ' needed for the ' + c.y + ' to reach ' + m + ' ' + c.u, 'The total ' + c.y + ' after ' + m + ' ' + c.x]
      : [iw, 'The number of ' + c.x + ' needed for the ' + c.y + ' to reach ' + b + ' ' + c.u, 'The total ' + c.y + ' after ' + b + ' ' + c.x];
    return mcShuffle(r, html, good, wrong, { m: m, b: b, ask: ask });
  });
  MQ.def('da.twoway', 'core', 'Two-way frequency table: relative frequency', function (r) {
    var T = r.pick([20, 25, 50]), a = r.int(2, T - 3), tr_ = r.pick([20, 25, 40, 50]), b = tr_ === 40 ? 2 * r.int(1, 19) : r.int(2, tr_ - 3);
    var rows = [[a, T - a], [b, tr_ - b]], byRow = r.f() < 0.5;
    var ctx = r.pick([['8th graders', '9th graders', 'play a sport', 'do not play a sport'], ['students with a pet', 'students without a pet', 'ride the bus', 'do not ride the bus']]);
    var tbl, q;
    // layout: rows = two groups, columns = two yes/no categories
    var R1 = rows[0][0] + rows[0][1], R2 = rows[1][0] + rows[1][1];
    var C1 = rows[0][0] + rows[1][0], C2 = rows[0][1] + rows[1][1];
    tbl = dtab([['', ctx[2], ctx[3], 'Total'], [ctx[0], rows[0][0], rows[0][1], R1], [ctx[1], rows[1][0], rows[1][1], R2], ['Total', C1, C2, C1 + C2]]);
    var pick = r.int(0, 1), num = rows[pick][0], den = pick ? R2 : R1;
    q = numQ('The two-way table shows survey results.' + tbl + 'Of the <b>' + ctx[pick] + '</b>, what percent ' + ctx[2] + '?', 100 * num / den, null, { rows: rows, pick: pick });
    q.hint = 'Enter a number (the % sign is optional). Use the row total as the whole.';
    return q;
  });
  MQ.def('da.outlier', 'core', 'Find the outlier in a scatter plot', function (r) {
    var LN = r.pick([[0.5, 1], [0.5, 2], [0.5, 3], [1, 0], [-0.5, 9], [-0.5, 10], [-1, 10]]), m = LN[0], b = LN[1], xs = [1, 2, 3, 4, 5, 6, 7, 8, 9], xo = r.int(2, 8), ys, up = r.f() < 0.5;
    ys = xs.map(function (x) { return clip(Math.round(m * x + b + r.pick([-1, 0, 0, 1])), 0, 10); });
    var base = Math.round(m * xo + b), yo, cand = up ? [6, -6, 5, -5] : [-6, 6, -5, 5]; for (var ci = 0; ci < 4; ci++) { yo = base + cand[ci]; if (yo >= 0 && yo <= 10) break; }
    ys[xo - 1] = yo;
    var c = r.pick(DA_CTX), P = plane({ x0: 0, x1: 10, y0: 0, y1: 10, ux: 28, uy: 26, xl: c.x, yl: c.y, label: 'Scatter plot with one outlier' });
    var askx = r.f() < 0.5;
    var q = numQ('Most points in the scatter plot follow a pattern, but one point is an outlier. What is the ' + (askx ? '<i>x</i>' : '<i>y</i>') + '-value of the outlier?' + P.wrap(scatter(P, xs, ys)), askx ? xo : yo, null, { xs: xs, ys: ys, xo: xo, yo: yo, askx: askx });
    q.hint = 'Enter a number. Read it from the grid.';
    return q;
  });
})();
