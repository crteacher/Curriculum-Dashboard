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
})();
