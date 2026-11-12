/*!
 * graphkit.js  —  GraphKit: shared graph builder for the Curriculum Dashboard.
 *
 * TWO JOBS
 *   A) Draw a graph:            GraphKit.svg(config)        -> an SVG string (use it as a problem's `svg` field)
 *   B) Let a student answer on a graph:
 *                               var g = GraphKit.mount(element, config);
 *                               g.grade()  -> {ok, score, detail}     g.showAnswer()     g.reset()
 *
 * THE RULE: a graph shows only what its config asks for.  Nothing appears "because it exists".
 *   The student toolbar is built from the input mode alone (often just Undo / Clear).
 *   Extra helpers (coordinates read-out, snap switch, zoom) appear only if you list them in  more:[...]
 *   and even then they sit folded away under a small "More" link.
 *
 * QUICK START (one line each)
 *   GraphKit.svg({ preset:'read-graph', draw:[{type:'fn', f:'x^2-4'}] })
 *   GraphKit.svg({ preset:'two-lines', lines:[{m:2,b:1},{m:-1,b:4}], markIntersection:true })
 *   GraphKit.svg({ preset:'piecewise', pieces:[{f:'x+2', domain:[-5,0], right:'open'},{f:'x^2', domain:[0,3], left:'closed'}] })
 *   GraphKit.svg({ preset:'number-line', intervals:'(-inf,2)u[4,inf)' })
 *   GraphKit.mount(el, { preset:'plot-points', expected:[[2,3],[-1,0]] })
 *   GraphKit.mount(el, { preset:'plot-line', expected:{m:2,b:-1} })
 *   GraphKit.mount(el, { preset:'shade-inequality', expected:{m:1,b:2,op:'<='} })
 *   GraphKit.mount(el, { preset:'number-line', expected:'[2,inf)' })
 *   GraphKit.mount(el, { preset:'sketch-curve', window:{x:[-4,4],y:[-6,6]}, sketch:{ fn:..., expected:{keypoints:[...],vertex:[...]} } })
 *   GraphKit.mount(el, { preset:'pick-graph', options:[config, config, config], expected:1 })
 *
 * COMMON SETTINGS (all optional)
 *   window:{x:[-6,6], y:[-4,8]}   leave out to fit the drawing automatically
 *   size:{w:380, h:320}           ticks:{x:1, y:2}        axisLabels:{x:'t', y:'s(t)'}
 *   show:[...] / hide:[...]       from: 'grid','axes','ticks','numbers','arrows','legend','border'
 *   equalAspect:true              one unit looks the same length on both axes
 *   draw:[ ...things... ]         answer:[ ...things shown in gold by showAnswer()... ]
 *   more:['coords','snap','zoom'] optional helpers, folded under "More"
 *
 * THINGS YOU CAN DRAW   (each also takes color, dash:true, width, label)
 *   {type:'fn', f:'x^2-3' or function, domain:[a,b], left:'open'|'closed'|'arrow', right:...}
 *   {type:'line', m:2, b:1} | {type:'line', through:[[0,1],[2,5]]} | {type:'line', point:[1,3], slope:2} | {type:'line', x:3} | {type:'line', y:-2}
 *   {type:'segment', from:[..], to:[..]}   {type:'ray', from:[..], through:[..]}   {type:'vector', from:[..], to:[..]}
 *   {type:'point', at:[2,3], label:'A', open:true}     {type:'points', at:[[..],[..]]}     {type:'hole', at:[1,2]}
 *   {type:'asymptote', x:2} | {type:'asymptote', y:0} | {type:'asymptote', m:1, b:0}
 *   {type:'piecewise', pieces:[{f, domain:[a,b], left:'closed', right:'open'}, ...]}
 *   {type:'area', f:'x^2', g:0, from:0, to:2}          {type:'riemann', f:'x^2', from:0, to:2, n:4, method:'left'|'right'|'mid'|'trap'}
 *   {type:'inequality', m:1, b:2, op:'<='} | {type:'inequality', x:3, op:'>'} | {type:'inequality', f:'x^2', op:'>='}
 *   {type:'tangent', f:'x^2', at:1}   {type:'secant', f:'x^2', x1:0, x2:2}   {type:'riseRun', from:[0,1], to:[2,5]}
 *   {type:'circle', center:[0,0], r:3}   {type:'parametric', x:'3cos(t)', y:'2sin(t)', t:[0,6.2832]}   {type:'polar', r:'1+cos(t)', t:[0,6.2832]}
 *   {type:'label', at:[2,3], text:'vertex'}   {type:'arrow', from:[..], to:[..]}
 *   {type:'table', columns:['x','y'], rows:[[0,1],[1,3]]}      (shown beside a mounted graph)
 *
 * INPUT MODES  (set by the preset, or  input:{mode:..., ...})
 *   points      click to place points; click a point to remove it        expected:[[x,y],...]   options: n, snap, tol, allowOpen
 *   line        two clicks make a line; a third click moves the nearer point   expected: any line form above
 *   inequality  two clicks make the boundary, choose Solid/Dashed, click a side to shade   expected:{m,b,op} or {x,op}
 *   numberline  place closed/open points, then Shade and click the parts to shade   expected:'[2,inf)' (interval text)
 *   sketch      key-point curve sketching (uses sketch-widget.js, same grading as before)
 *   choose      pick one of several small graphs                         expected: index (0-based)
 *   Keyboard: Tab to the graph, arrow keys move the cursor, Enter or Space clicks.
 *
 * Function text ('x^2-3') is read by mathcheck.js, so load mathcheck.js first.  JS functions always work.
 * Colours: navy #1e3a5c and gold #7a5c1e only.  No storage, no outside dependencies.
 * Tests: Downloads/Site Libraries/tests/  (node run_all.js).   Gallery: js/graphkit-demo.html
 */
(function (root) {
'use strict';

var GK = { version: '1.0.0' };
var NAVY = '#1e3a5c', GOLD = '#7a5c1e', GRIDC = '#e1e5ec', AXISC = '#3b4654', NUMC = '#666', OKC = '#3a7a3a', BADC = '#b03030', GRAY = '#555';
var MC = root.MathCheck || null;
if (!MC && typeof module !== 'undefined' && typeof require === 'function') { try { MC = require('./mathcheck.js'); } catch (e) { MC = null; } }
var UID = 0;

/* ══════════════════════════ 1. Small helpers ══════════════════════════ */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function attrs(o) { var s = ''; for (var k in o) { if (o[k] == null || o[k] === false) continue; s += ' ' + k + '="' + esc(o[k]) + '"'; } return s; }
function tag(name, a, inner) { return '<' + name + attrs(a || {}) + (inner == null ? '/>' : '>' + inner + '</' + name + '>'); }
function r2(v) { return Math.round(v * 100) / 100; }
function fmt(v) { var s = String(Math.round(v * 1e6) / 1e6); return s.replace('-', '−'); }
function plain(v) { return String(Math.round(v * 1e6) / 1e6); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function toFn(f, v) {
  if (typeof f === 'function') return f;
  if (typeof f === 'number') return function () { return f; };
  if (!MC) throw new Error('GraphKit: load mathcheck.js to use function text like "' + f + '"');
  return MC.fn(String(f), v || 'x');
}
function has(list, k) { return !!list && list.indexOf(k) >= 0; }

/* ══════════════════════════ 2. Geometry (no browser needed) ══════════════════════════ */
GK.niceStep = function (span, target) {
  if (!(span > 0)) return 1;
  var raw = span / (target || 8), p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
};
/* any line description -> {vertical:true, x} or {m, b} */
GK.lineOf = function (o) {
  if (!o) return null;
  if (o.vertical) return {vertical: true, x: o.x};
  if (o.through) { var p = o.through[0], q = o.through[1]; if (Math.abs(q[0] - p[0]) < 1e-12) return {vertical: true, x: p[0]}; var m = (q[1] - p[1]) / (q[0] - p[0]); return {m: m, b: p[1] - m * p[0]}; }
  if (o.point && o.slope != null) return {m: o.slope, b: o.point[1] - o.slope * o.point[0]};
  if (o.m != null) return {m: o.m, b: o.b || 0};
  if (o.x != null && o.y == null) return {vertical: true, x: o.x};
  if (o.y != null) return {m: 0, b: o.y};
  return null;
};
GK.intersect = function (a, b) {
  a = GK.lineOf(a); b = GK.lineOf(b); if (!a || !b) return null;
  if (a.vertical && b.vertical) return null;
  if (a.vertical) return [a.x, b.m * a.x + b.b];
  if (b.vertical) return [b.x, a.m * b.x + a.b];
  if (Math.abs(a.m - b.m) < 1e-12) return null;
  var x = (b.b - a.b) / (a.m - b.m); return [x, a.m * x + a.b];
};
/* sample y=f(x) into unbroken pieces (splits at gaps, asymptotes and jumps) */
GK.sample = function (f, a, b, n, yLo, yHi) {
  var out = [], cur = [], span = (yHi - yLo) || 1, lim = 4 * span, prev = null;
  n = n || 240;
  for (var i = 0; i <= n; i++) {
    var x = a + (b - a) * i / n, y = f(x);
    if (!isFinite(y) || y > yHi + lim || y < yLo - lim) { if (cur.length) out.push(cur); cur = []; prev = null; continue; }
    if (prev !== null && Math.abs(y - prev) > 1.5 * span) { if (cur.length) out.push(cur); cur = []; }
    cur.push([x, y]); prev = y;
  }
  if (cur.length) out.push(cur);
  return out.filter(function (s) { return s.length > 1; });
};
function quantile(sorted, q) { if (!sorted.length) return 0; var i = (sorted.length - 1) * q, lo = Math.floor(i), hi = Math.ceil(i); return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo); }
function roundOut(lo, hi, step) { return [Math.floor(lo / step + 1e-9) * step, Math.ceil(hi / step - 1e-9) * step]; }

/* choose a window that fits everything drawn */
GK.fitWindow = function (cfg) {
  var w = cfg.window || {}, xs = [], ys = [], objs = (cfg.draw || []).concat(cfg.answer || []);
  function pt(p) { if (p && isFinite(p[0]) && isFinite(p[1])) { xs.push(p[0]); ys.push(p[1]); } }
  objs.forEach(function (o) {
    if (Array.isArray(o.at)) { if (typeof o.at[0] === 'number') pt(o.at); else o.at.forEach(pt); }
    ['from', 'to', 'through', 'center', 'point'].forEach(function (k) { if (Array.isArray(o[k])) { if (typeof o[k][0] === 'number') pt(o[k]); else o[k].forEach(pt); } });
    if (o.type === 'circle') { pt([o.center[0] - o.r, o.center[1] - o.r]); pt([o.center[0] + o.r, o.center[1] + o.r]); }
    if (o.domain) { xs.push(o.domain[0]); xs.push(o.domain[1]); }
    if (o.pieces) o.pieces.forEach(function (p) { if (p.domain) { xs.push(p.domain[0]); xs.push(p.domain[1]); } });
    if ((o.type === 'area' || o.type === 'riemann') && o.from != null && typeof o.from === 'number') { xs.push(o.from); xs.push(o.to); }
    if (o.x != null && typeof o.x === 'number' && (o.type === 'line' || o.type === 'asymptote' || o.type === 'inequality')) xs.push(o.x);
    if (o.type === 'tangent') xs.push(o.at);
    if (o.type === 'secant') { xs.push(o.x1); xs.push(o.x2); }
    if (o.type === 'parametric' || o.type === 'polar') {
      var t0 = o.t ? o.t[0] : 0, t1 = o.t ? o.t[1] : 2 * Math.PI, fx, fy;
      if (o.type === 'polar') { var rr = toFn(o.r, 't'); fx = function (t) { return rr(t) * Math.cos(t); }; fy = function (t) { return rr(t) * Math.sin(t); }; }
      else { fx = toFn(o.x, 't'); fy = toFn(o.y, 't'); }
      for (var i = 0; i <= 120; i++) { var t = t0 + (t1 - t0) * i / 120; pt([fx(t), fy(t)]); }
    }
  });
  var X = w.x ? w.x.slice() : null, Y = w.y ? w.y.slice() : null;
  if (!X) {
    xs = xs.filter(isFinite);
    if (xs.length) { var lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), pad = Math.max(1, (hi - lo) * 0.15); lo -= pad; hi += pad; if (lo > 0 && lo < (hi - lo)) lo = Math.min(lo, -1); if (hi < 0 && -hi < (hi - lo)) hi = Math.max(hi, 1); X = roundOut(lo, hi, GK.niceStep(hi - lo, 8)); }
    else X = [-6, 6];
    if (objs.some(function (o) { return (/^(fn|line|inequality|tangent|secant)$/.test(o.type) && !o.domain) || (o.type === 'asymptote'); })) { X[0] = Math.min(X[0], -6); X[1] = Math.max(X[1], 6); }
    if (X[1] - X[0] < 4) { X[0] -= 2; X[1] += 2; }
  }
  if (!Y) {
    var vals = ys.filter(isFinite).slice(), bulk = [];
    objs.forEach(function (o) {
      var fs = [];
      if (o.type === 'fn' || o.type === 'area' || o.type === 'riemann' || o.type === 'tangent' || o.type === 'secant' || (o.type === 'inequality' && o.f != null)) fs.push({f: toFn(o.f), d: o.domain || (o.from != null && typeof o.from === 'number' ? [o.from, o.to] : null)});
      if (o.type === 'area' && o.g != null) fs.push({f: toFn(o.g), d: [o.from, o.to]});
      if (o.type === 'piecewise') o.pieces.forEach(function (p) { fs.push({f: toFn(p.f), d: p.domain}); });
      if (o.type === 'line' || o.type === 'asymptote' || (o.type === 'inequality' && o.f == null)) { var L = GK.lineOf(o); if (L && !L.vertical) fs.push({f: function (x) { return L.m * x + L.b; }, d: null, line: true}); }
      fs.forEach(function (q) {
        var a = q.d ? Math.max(q.d[0], X[0]) : X[0], b = q.d ? Math.min(q.d[1], X[1]) : X[1], n = 200, tmp = [], i, y;
        for (i = 0; i <= n; i++) { y = q.f(a + (b - a) * i / n); tmp.push(isFinite(y) ? y : NaN); }
        var fin = tmp.filter(isFinite); if (!fin.length) return;
        fin.sort(function (p, s) { return p - s; });
        bulk.push(quantile(fin, 0.5));
        if (q.line) { vals.push(q.f(a + (b - a) * 0.25)); vals.push(q.f(a + (b - a) * 0.75)); if (a <= 0 && b >= 0) vals.push(q.f(0)); return; }
        var interest = [], xs_ = X[1] - X[0], smooth = 0.25 * xs_;       // "smooth" tells real turning points from asymptote spikes
        function keep(v, lim) { if (isFinite(v) && Math.abs(v) <= lim) interest.push(v); }
        for (i = 1; i < n; i++) {                                  // turning points and x-intercepts
          var y0 = tmp[i - 1], y1 = tmp[i], y2 = tmp[i + 1];
          if (!isFinite(y0) || !isFinite(y1) || !isFinite(y2)) continue;
          var calm = Math.abs(y1 - y0) < smooth && Math.abs(y2 - y1) < smooth;
          if (calm && (y1 - y0) * (y2 - y1) < 0) keep(y1, 1e9);
          if (calm && y0 * y1 <= 0) keep(0, 1);
        }
        if (a <= 0 && b >= 0) keep(q.f(0), 4 * xs_);
        if (q.d) { keep(q.f(a), 10 * xs_); keep(q.f(b), 10 * xs_); }
        if (interest.length < 2) { interest.push(quantile(fin, 0.3)); interest.push(quantile(fin, 0.7)); }
        vals = vals.concat(interest);
      });
    });
    if (vals.length) {
      var ylo = Math.min.apply(null, vals), yhi = Math.max.apply(null, vals), minH = X[1] - X[0];
      var grown = yhi - ylo < minH;
      if (grown) {                                                  // too flat: grow toward where the curve goes
        var extra = minH - (yhi - ylo), bm = bulk.length ? bulk.reduce(function (p, s) { return p + s; }, 0) / bulk.length : (ylo + yhi) / 2;
        var slack = 0.05 * (X[1] - X[0]), up = bm > yhi + slack ? 0.8 : bm < ylo - slack ? 0.2 : 0.5; yhi += extra * up; ylo -= extra * (1 - up);
      }
      var sp = Math.max(yhi - ylo, 1), yp = grown ? 0 : sp * 0.12;
      ylo -= yp; yhi += yp;
      if (ylo > 0 && ylo < 1.5 * sp) ylo = Math.min(ylo, -sp * 0.1);
      if (yhi < 0 && -yhi < 1.5 * sp) yhi = Math.max(yhi, sp * 0.1);
      Y = roundOut(ylo, yhi, GK.niceStep(yhi - ylo, 8));
    } else Y = [-6, 6];
    if (Y[1] - Y[0] < 4) { Y[0] -= 2; Y[1] += 2; }
  }
  return {x: X, y: Y};
};

/* ══════════════════════════ 3. Presets and defaults ══════════════════════════ */
var PRESETS = {
  'read-graph': {}, 'plot-points': {input: {mode: 'points'}}, 'plot-line': {input: {mode: 'line'}},
  'shade-inequality': {input: {mode: 'inequality'}}, 'sketch-curve': {input: {mode: 'sketch'}},
  'two-lines': {}, 'piecewise': {}, 'number-line': {kind: 'numberline'}, 'pick-graph': {input: {mode: 'choose'}},
  'poly-sketch': {input: {mode: 'polysketch'}, qualitative: true, window: {x: [-6, 6], y: [-1.35, 1.35]}, size: {w: 440, h: 230}, ticks: {x: 1, y: 1}}
};
GK.presets = Object.keys(PRESETS);
var DEFAULT_SHOW = ['grid', 'axes', 'ticks', 'numbers', 'arrows'];

function resolve(cfg) {
  var c = {}, k, p = cfg.preset ? PRESETS[cfg.preset] : {};
  if (cfg.preset && !p) throw new Error('GraphKit: unknown preset "' + cfg.preset + '"');
  for (k in p) c[k] = clone(p[k]);
  for (k in cfg) { if (k === 'input' && c.input && cfg.input && typeof cfg.input === 'object') { for (var j in cfg.input) c.input[j] = cfg.input[j]; } else c[k] = cfg[k]; }
  c.draw = (c.draw || []).slice(); c.answer = (c.answer || []).slice();
  if (cfg.preset === 'two-lines' && c.lines) {
    c.lines.forEach(function (L, i) { var o = {type: 'line'}; for (var q in L) o[q] = L[q]; if (!o.color) o.color = i ? GOLD : NAVY; c.draw.push(o); });
    if (c.markIntersection && c.lines.length === 2) { var P = GK.intersect(c.lines[0], c.lines[1]); if (P) c.draw.push({type: 'point', at: P, color: AXISC, label: c.intersectionLabel}); }
  }
  if (cfg.preset === 'piecewise' && c.pieces) c.draw.push({type: 'piecewise', pieces: c.pieces});
  if (c.kind === 'numberline') { if (c.intervals) c.draw.push({type: 'interval', value: c.intervals}); if (c.expected != null && c.input !== false && !c.input) c.input = {mode: 'numberline'}; }
  if (c.input === false) c.input = null;
  if (c.input && c.expected != null && c.input.expected == null) c.input.expected = c.expected;
  var show = (c.show || DEFAULT_SHOW).slice();
  (c.hide || []).forEach(function (h) { var i = show.indexOf(h); if (i >= 0) show.splice(i, 1); });
  c.show = show;
  // make sure a graded graph's window contains the expected answer
  if (c.input && c.input.expected != null && !(c.window && c.window.x && c.window.y) && c.kind !== 'numberline') {
    var e = c.input.expected, gp = [];
    if (c.input.mode === 'points') gp = e;
    if (c.input.mode === 'line' || c.input.mode === 'inequality') { var gl = GK.lineOf(e); gp = gl.vertical ? [[gl.x, 0]] : [[0, gl.b], [1, gl.m + gl.b], [-1, gl.b - gl.m]]; }
    if (gp.length) {                           // at least -6..6 both ways, and room around the answer (so the window gives nothing away)
      var gx = gp.map(function (p) { return p[0]; }), gy = gp.map(function (p) { return p[1]; }), wv = c.window || {};
      c.window = {x: wv.x || [Math.min(-6, Math.floor(Math.min.apply(null, gx)) - 2), Math.max(6, Math.ceil(Math.max.apply(null, gx)) + 2)],
                  y: wv.y || [Math.min(-6, Math.floor(Math.min.apply(null, gy)) - 2), Math.max(6, Math.ceil(Math.max.apply(null, gy)) + 2)]};
    }
  }
  return c;
}

function layout(c) {
  var nl = c.kind === 'numberline';
  var size = c.size || (nl ? {w: 440, h: 86} : {w: 380, h: 320});
  var win;
  if (nl) {
    var X = c.window && c.window.x ? c.window.x.slice() : null;
    if (!X) {
      var vals = [];
      c.draw.forEach(function (o) { if (o.type === 'interval') pieces(o.value).forEach(function (p) { if (isFinite(p.lo)) vals.push(p.lo); if (isFinite(p.hi)) vals.push(p.hi); }); if (o.type === 'point') vals.push(typeof o.at === 'number' ? o.at : o.at[0]); });
      if (c.input && c.input.expected != null) pieces(c.input.expected).forEach(function (p) { if (isFinite(p.lo)) vals.push(p.lo); if (isFinite(p.hi)) vals.push(p.hi); });
      if (vals.length) { var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pad = Math.max(3, Math.ceil((hi - lo) * 0.4)); X = [Math.floor(lo - pad), Math.ceil(hi + pad)]; } else X = [-10, 10];
    }
    win = {x: X, y: [-1, 1]};
  } else {
    win = GK.fitWindow(c);
  }
  var numbers = has(c.show, 'numbers');
  var pad = nl ? {l: 16, r: 16, t: 8, b: 8} : {l: numbers && !c.qualitative ? 34 : 12, r: 16, t: 14, b: numbers ? 26 : 12};
  var W = size.w, H = size.h, iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  if (c.equalAspect && !nl) {
    var ux = iw / (win.x[1] - win.x[0]), uy = ih / (win.y[1] - win.y[0]), u = Math.min(ux, uy);
    var needX = iw / u, needY = ih / u, cx = (win.x[0] + win.x[1]) / 2, cy = (win.y[0] + win.y[1]) / 2;
    win = {x: [cx - needX / 2, cx + needX / 2], y: [cy - needY / 2, cy + needY / 2]};
  }
  var tk = c.ticks || {};
  var L = {
    win: win, W: W, H: H, pad: pad, iw: iw, ih: ih, nl: nl,
    stepX: tk.x || GK.niceStep(win.x[1] - win.x[0], nl ? 12 : 10), stepY: tk.y || GK.niceStep(win.y[1] - win.y[0], 9)
  };
  L.sx = function (x) { return pad.l + (x - win.x[0]) / (win.x[1] - win.x[0]) * iw; };
  L.sy = nl ? function () { return pad.t + ih * 0.42; } : function (y) { return pad.t + (win.y[1] - y) / (win.y[1] - win.y[0]) * ih; };
  L.ix = function (px) { return win.x[0] + (px - pad.l) / iw * (win.x[1] - win.x[0]); };
  L.iy = function (py) { return win.y[1] - (py - pad.t) / ih * (win.y[1] - win.y[0]); };
  return L;
}
function pieces(v) {
  if (Array.isArray(v)) return v;
  if (!MC) throw new Error('GraphKit: load mathcheck.js to use interval text');
  return MC.intervals(String(v));
}

/* ══════════════════════════ 4. Drawing ══════════════════════════ */
function pathOf(L, segs) {
  return segs.map(function (s) { return s.map(function (p, i) { return (i ? 'L' : 'M') + r2(L.sx(p[0])) + ' ' + r2(L.sy(p[1])); }).join(''); }).join('');
}
function dot(L, p, color, open, r) {
  return tag('circle', {cx: r2(L.sx(p[0])), cy: r2(L.sy(p[1])), r: r || 4.2, fill: open ? '#fff' : color, stroke: color, 'stroke-width': open ? 2 : 1});
}
function text(x, y, s, o) {
  o = o || {};
  return tag('text', {x: r2(x), y: r2(y), 'font-size': o.size || 11, 'font-family': 'Georgia,serif', fill: o.fill || NAVY, 'text-anchor': o.anchor || 'start',
    'font-style': o.italic ? 'italic' : null, 'font-weight': o.bold ? 700 : null,
    stroke: o.halo === false ? null : '#fff', 'stroke-width': o.halo === false ? null : 3, 'paint-order': o.halo === false ? null : 'stroke', 'stroke-linejoin': o.halo === false ? null : 'round'}, esc(s));
}
function stroke(o, color, extra) {
  var a = {fill: 'none', stroke: o.color || color, 'stroke-width': o.width || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash ? '6 5' : null};
  for (var k in extra || {}) a[k] = extra[k];
  return a;
}
function lineEnds(L, ln) {                     // the two points where a line leaves the window (generously)
  var w = L.win, m = 0.02 * (w.x[1] - w.x[0]);
  if (ln.vertical) return [[ln.x, w.y[0]], [ln.x, w.y[1]]];
  return [[w.x[0] - m, ln.m * (w.x[0] - m) + ln.b], [w.x[1] + m, ln.m * (w.x[1] + m) + ln.b]];
}
function lineText(ln) {
  if (ln.vertical) return 'vertical line x = ' + plain(ln.x);
  if (Math.abs(ln.m) < 1e-12) return 'horizontal line y = ' + plain(ln.b);
  return 'line with slope ' + plain(ln.m) + ' and y-intercept ' + plain(ln.b);
}

/* qualitative polynomial sketch: zeros [{r,m}] and the sign s of the leading coefficient give a curve squeezed into (-1, 1) so every bump shows */
function asinh(v) { var a = Math.abs(v), r = Math.log(a + Math.sqrt(a * a + 1)); return v < 0 ? -r : r; }
GK.polyShape = function (zs, s) {
  var rs = zs.map(function (z) { return z.r; }), rmin = Math.min.apply(null, rs), rmax = Math.max.apply(null, rs), ref = 0, x;
  function g(xx) { var v = s; zs.forEach(function (z) { v *= Math.pow(xx - z.r, z.m); }); return v; }
  for (x = rmin - 0.5; x <= rmax + 0.5; x += 0.02) ref = Math.max(ref, Math.abs(g(x)));
  if (ref === 0) ref = 1;
  var C = 20, den = asinh(C);
  return function (xx) { return asinh(C * g(xx) / ref) / den; };
};
GK.polyEnds = function (deg, s) { return {left: (deg % 2 ? -s : s) > 0 ? 'up' : 'down', right: s > 0 ? 'up' : 'down'}; };
GK.polySign = function (zs, left, right) {                 // leading-coefficient sign implied by the ends the student chose (left end wins)
  var deg = zs.reduce(function (t, z) { return t + z.m; }, 0), p = deg % 2 === 0 ? 1 : -1;
  return left ? (left === 'up' ? p : -p) : right ? (right === 'up' ? 1 : -1) : 0;
};
function polyPath(L, zs, s) {
  var f = GK.polyShape(zs, s), w = L.win, pp = [], i, n = 320;
  for (i = 0; i <= n; i++) { var x = w.x[0] + (w.x[1] - w.x[0]) * i / n; pp.push([x, f(x)]); }
  return pathOf(L, [pp]);
}

function drawObject(L, o, color, out) {
  var w = L.win, f, segs, a, b, ln, P, Q, i, s = '', col = o.color || color;
  switch (o.type) {
    case 'polysketch':
      var pz = o.zeros || [];
      if (pz.length) out.curves += tag('path', stroke(o, color, {d: polyPath(L, pz, o.a || 1), 'clip-path': out.clip}));
      pz.forEach(function (z) { out.points += dot(L, [z.r, 0], col, z.m % 2 === 0, 5.5); });
      out.desc.push('sketch of a polynomial with ' + pz.map(function (z) { return 'a zero at x = ' + plain(z.r) + (z.m % 2 === 0 ? ' where it touches and turns around' : ' where it crosses'); }).join(', '));
      break;
    case 'fn':
      f = toFn(o.f); a = o.domain ? Math.max(o.domain[0], w.x[0]) : w.x[0]; b = o.domain ? Math.min(o.domain[1], w.x[1]) : w.x[1];
      segs = GK.sample(f, a, b, o.samples || 260, w.y[0], w.y[1]);
      out.curves += tag('path', stroke(o, color, {d: pathOf(L, segs), 'clip-path': out.clip}));
      if (o.domain) [['left', o.domain[0]], ['right', o.domain[1]]].forEach(function (e) { var y = f(e[1]); if ((o[e[0]] === 'open' || o[e[0]] === 'closed') && isFinite(y)) out.points += dot(L, [e[1], y], col, o[e[0]] === 'open'); });
      if (o.label) {                           // put the name beside a part of the curve that is actually in view
        var lx = o.labelAt, ly, my = 0.08 * (w.y[1] - w.y[0]);
        if (lx == null) for (var t = 0.86; t > 0.05; t -= 0.03) { var cx = a + (b - a) * t, cy = f(cx); if (isFinite(cy) && cy > w.y[0] + my && cy < w.y[1] - my) { lx = cx; break; } }
        if (lx != null) { ly = f(lx); if (isFinite(ly)) out.labels += text(L.sx(lx) + 7, L.sy(ly) - 7, o.label, {fill: col, italic: true}); }
      }
      out.desc.push('curve' + (typeof o.f === 'string' ? ' y = ' + o.f : '') + (o.domain ? ' for x from ' + plain(o.domain[0]) + ' to ' + plain(o.domain[1]) : ''));
      break;
    case 'piecewise':
      o.pieces.forEach(function (p) { drawObject(L, {type: 'fn', f: p.f, domain: p.domain, left: p.left, right: p.right, color: p.color || o.color, dash: p.dash, width: o.width}, color, out); });
      break;
    case 'line': case 'asymptote':
      ln = GK.lineOf(o); if (!ln) break; P = lineEnds(L, ln);
      out.curves += tag('line', stroke(o.type === 'asymptote' ? {color: o.color || GRAY, dash: true, width: o.width || 1.4} : o, color, {x1: r2(L.sx(P[0][0])), y1: r2(L.sy(P[0][1])), x2: r2(L.sx(P[1][0])), y2: r2(L.sy(P[1][1])), 'clip-path': out.clip}));
      if (o.label) { var px = ln.vertical ? ln.x : w.x[0] + (w.x[1] - w.x[0]) * 0.78, py = ln.vertical ? w.y[0] + (w.y[1] - w.y[0]) * 0.85 : ln.m * px + ln.b; out.labels += text(L.sx(px) + 6, L.sy(py) - 6, o.label, {fill: o.type === 'asymptote' ? GRAY : col, italic: true}); }
      out.desc.push((o.type === 'asymptote' ? 'dashed asymptote, ' : '') + lineText(ln));
      break;
    case 'segment': case 'vector': case 'arrow': case 'ray':
      P = o.from; Q = o.type === 'ray' ? null : o.to;
      if (o.type === 'ray') { var dx = o.through[0] - P[0], dy = o.through[1] - P[1], far = 3 * Math.max(w.x[1] - w.x[0], w.y[1] - w.y[0]) / Math.max(1e-9, Math.sqrt(dx * dx + dy * dy)); Q = [P[0] + dx * far, P[1] + dy * far]; }
      out.curves += tag('line', stroke(o, color, {x1: r2(L.sx(P[0])), y1: r2(L.sy(P[1])), x2: r2(L.sx(Q[0])), y2: r2(L.sy(Q[1])), 'clip-path': out.clip,
        'marker-end': (o.type === 'vector' || o.type === 'arrow' || o.arrow) ? 'url(#' + out.arrowId(col) + ')' : null}));
      if (o.type === 'ray' || o.endpoints) out.points += dot(L, P, col, o.open);
      if (o.endpoints) out.points += dot(L, o.to, col, o.openEnd);
      out.desc.push(o.type + ' from (' + plain(P[0]) + ', ' + plain(P[1]) + ')' + (o.to ? ' to (' + plain(o.to[0]) + ', ' + plain(o.to[1]) + ')' : ''));
      break;
    case 'point': case 'hole':
      P = o.at; out.points += dot(L, P, col, o.open || o.type === 'hole');
      if (o.label) out.labels += text(L.sx(P[0]) + (o.dx != null ? o.dx : 7), L.sy(P[1]) + (o.dy != null ? o.dy : -7), o.label, {fill: col, bold: true});
      out.desc.push((o.open || o.type === 'hole' ? 'open point' : 'point') + ' at (' + plain(P[0]) + ', ' + plain(P[1]) + ')' + (o.label ? ' labelled ' + o.label : ''));
      break;
    case 'points':
      o.at.forEach(function (p) { out.points += dot(L, p, col, o.open); });
      out.desc.push('points at ' + o.at.map(function (p) { return '(' + plain(p[0]) + ', ' + plain(p[1]) + ')'; }).join(', '));
      break;
    case 'circle':
      out.curves += tag('ellipse', stroke(o, color, {cx: r2(L.sx(o.center[0])), cy: r2(L.sy(o.center[1])), rx: r2(Math.abs(L.sx(o.r) - L.sx(0))), ry: r2(Math.abs(L.sy(o.r) - L.sy(0))), 'clip-path': out.clip}));
      out.desc.push('circle centred (' + plain(o.center[0]) + ', ' + plain(o.center[1]) + ') radius ' + plain(o.r));
      break;
    case 'parametric': case 'polar':
      var t0 = o.t ? o.t[0] : 0, t1 = o.t ? o.t[1] : 2 * Math.PI, fx, fy, pts = [], n = o.samples || 360;
      if (o.type === 'polar') { var rr = toFn(o.r, 't'); fx = function (t) { return rr(t) * Math.cos(t); }; fy = function (t) { return rr(t) * Math.sin(t); }; }
      else { fx = toFn(o.x, 't'); fy = toFn(o.y, 't'); }
      segs = [];
      for (i = 0; i <= n; i++) { var t = t0 + (t1 - t0) * i / n, X = fx(t), Y = fy(t); if (isFinite(X) && isFinite(Y)) pts.push([X, Y]); else { if (pts.length > 1) segs.push(pts); pts = []; } }
      if (pts.length > 1) segs.push(pts);
      out.curves += tag('path', stroke(o, color, {d: pathOf(L, segs), 'clip-path': out.clip}));
      out.desc.push(o.type + ' curve');
      break;
    case 'area':
      f = toFn(o.f); var g = toFn(o.g == null ? 0 : o.g), top = [], bot = [], N = 120;
      for (i = 0; i <= N; i++) { var x = o.from + (o.to - o.from) * i / N, y1 = f(x), y2 = g(x); if (isFinite(y1) && isFinite(y2)) { top.push([x, y1]); bot.push([x, y2]); } }
      if (top.length > 1) out.shade += tag('path', {d: pathOf(L, [top.concat(bot.reverse())]) + 'Z', fill: col, 'fill-opacity': o.opacity || 0.18, stroke: 'none', 'clip-path': out.clip});
      out.desc.push('shaded region from x = ' + plain(o.from) + ' to x = ' + plain(o.to));
      break;
    case 'riemann':
      f = toFn(o.f); var nn = o.n || 4, dxr = (o.to - o.from) / nn;
      for (i = 0; i < nn; i++) {
        var xa = o.from + i * dxr, xb = xa + dxr, h1, h2;
        if (o.method === 'trap') { h1 = f(xa); h2 = f(xb); } else { h1 = h2 = f(o.method === 'right' ? xb : o.method === 'mid' ? (xa + xb) / 2 : xa); }
        if (!isFinite(h1) || !isFinite(h2)) continue;
        out.shade += tag('path', {d: pathOf(L, [[[xa, 0], [xa, h1], [xb, h2], [xb, 0]]]) + 'Z', fill: col, 'fill-opacity': o.opacity || 0.16, stroke: col, 'stroke-width': 1, 'clip-path': out.clip});
      }
      out.desc.push(nn + ' ' + (o.method === 'trap' ? 'trapezoids' : (o.method || 'left') + '-endpoint rectangles') + ' from x = ' + plain(o.from) + ' to x = ' + plain(o.to));
      break;
    case 'inequality':
      var strict = o.op === '<' || o.op === '>', above = o.op === '>' || o.op === '>=', poly;
      if (o.f != null) {
        f = toFn(o.f); segs = GK.sample(f, w.x[0], w.x[1], 260, w.y[0], w.y[1]);
        var edge = above ? w.y[1] + 1 : w.y[0] - 1, all = []; segs.forEach(function (sg) { all = all.concat(sg); });
        if (all.length > 1) out.shade += tag('path', {d: pathOf(L, [all.concat([[all[all.length - 1][0], edge], [all[0][0], edge]])]) + 'Z', fill: col, 'fill-opacity': 0.14, stroke: 'none', 'clip-path': out.clip});
        out.curves += tag('path', stroke({color: col, dash: strict, width: o.width}, color, {d: pathOf(L, segs), 'clip-path': out.clip}));
        out.desc.push('region ' + (above ? 'above' : 'below') + ' the curve, ' + (strict ? 'dashed' : 'solid') + ' boundary');
      } else {
        ln = GK.lineOf(o); P = lineEnds(L, ln);
        if (ln.vertical) { var xe = above ? w.x[1] + 1 : w.x[0] - 1; poly = [P[0], P[1], [xe, w.y[1]], [xe, w.y[0]]]; }
        else { var ye = above ? Math.max(w.y[1], P[0][1], P[1][1]) + 1 : Math.min(w.y[0], P[0][1], P[1][1]) - 1; poly = [P[0], P[1], [P[1][0], ye], [P[0][0], ye]]; }
        out.shade += tag('path', {d: pathOf(L, [poly]) + 'Z', fill: col, 'fill-opacity': 0.14, stroke: 'none', 'clip-path': out.clip});
        out.curves += tag('line', stroke({color: col, dash: strict, width: o.width}, color, {x1: r2(L.sx(P[0][0])), y1: r2(L.sy(P[0][1])), x2: r2(L.sx(P[1][0])), y2: r2(L.sy(P[1][1])), 'clip-path': out.clip}));
        out.desc.push('half-plane ' + (ln.vertical ? (above ? 'right of' : 'left of') : (above ? 'above' : 'below')) + ' the ' + lineText(ln) + ', ' + (strict ? 'dashed' : 'solid') + ' boundary');
      }
      break;
    case 'tangent': case 'secant':
      f = toFn(o.f);
      if (o.type === 'tangent') { var h = 1e-5 * Math.max(1, Math.abs(o.at)), sl = (f(o.at + h) - f(o.at - h)) / (2 * h); ln = {m: sl, b: f(o.at) - sl * o.at}; out.points += dot(L, [o.at, f(o.at)], o.color || GOLD); }
      else { ln = GK.lineOf({through: [[o.x1, f(o.x1)], [o.x2, f(o.x2)]]}); out.points += dot(L, [o.x1, f(o.x1)], o.color || GOLD) + dot(L, [o.x2, f(o.x2)], o.color || GOLD); }
      P = lineEnds(L, ln);
      out.curves += tag('line', stroke({color: o.color || GOLD, dash: o.dash, width: o.width || 1.8}, color, {x1: r2(L.sx(P[0][0])), y1: r2(L.sy(P[0][1])), x2: r2(L.sx(P[1][0])), y2: r2(L.sy(P[1][1])), 'clip-path': out.clip}));
      out.desc.push(o.type + ' line, slope ' + plain(Math.round(ln.m * 1000) / 1000));
      break;
    case 'riseRun':
      P = o.from; Q = o.to;
      out.curves += tag('path', {d: pathOf(L, [[P, [Q[0], P[1]], Q]]), fill: 'none', stroke: o.color || GOLD, 'stroke-width': 1.6, 'stroke-dasharray': '5 4'});
      out.labels += text((L.sx(P[0]) + L.sx(Q[0])) / 2, L.sy(P[1]) + (Q[1] >= P[1] ? 14 : -6), 'run = ' + fmt(Q[0] - P[0]), {fill: o.color || GOLD, anchor: 'middle'});
      out.labels += text(L.sx(Q[0]) + 6, (L.sy(P[1]) + L.sy(Q[1])) / 2 + 4, 'rise = ' + fmt(Q[1] - P[1]), {fill: o.color || GOLD});
      out.desc.push('rise ' + plain(Q[1] - P[1]) + ' over run ' + plain(Q[0] - P[0]));
      break;
    case 'label':
      out.labels += text(L.sx(o.at[0]), L.sy(o.at[1]), o.text, {fill: col, anchor: o.anchor || 'start', size: o.size, bold: o.bold, italic: o.italic});
      break;
    case 'interval':                           // number line only
      pieces(o.value).forEach(function (p) {
        var lo = Math.max(p.lo, w.x[0]), hi = Math.min(p.hi, w.x[1]), y = L.sy(0) - (o.lift || 0);
        if (hi > lo) out.curves += tag('line', {x1: r2(L.sx(lo)), y1: y, x2: r2(L.sx(hi)), y2: y, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'butt',
          'marker-start': !isFinite(p.lo) ? 'url(#' + out.arrowId(col, true) + ')' : null, 'marker-end': !isFinite(p.hi) ? 'url(#' + out.arrowId(col) + ')' : null});
        var lift = o.lift || 0, cy = function (x) { return tag('circle', {cx: r2(L.sx(x[0])), cy: y, r: 5.5, fill: x[1] ? '#fff' : col, stroke: col, 'stroke-width': x[1] ? 2 : 1}); };
        if (isFinite(p.lo)) out.points += cy([p.lo, !p.lc]);
        if (isFinite(p.hi) && p.hi !== p.lo) out.points += cy([p.hi, !p.hc]);
        out.desc.push(p.lo === p.hi ? 'point at ' + plain(p.lo) : 'shaded from ' + (isFinite(p.lo) ? plain(p.lo) + (p.lc ? ' (included)' : ' (not included)') : 'negative infinity') + ' to ' + (isFinite(p.hi) ? plain(p.hi) + (p.hc ? ' (included)' : ' (not included)') : 'infinity'));
      });
      break;
    case 'table': break;
    default: throw new Error('GraphKit: unknown thing to draw: "' + o.type + '"');
  }
  return s;
}

function frame(L, c, out) {
  var w = L.win, s = '', x, y, k, show = c.show, eps = 1e-9;
  if (L.nl) {
    var yy = L.sy(0);
    s += tag('line', {x1: L.pad.l - 8, y1: yy, x2: L.W - L.pad.r + 8, y2: yy, stroke: AXISC, 'stroke-width': 1.5, 'marker-start': 'url(#' + out.arrowId(AXISC, true) + ')', 'marker-end': 'url(#' + out.arrowId(AXISC) + ')'});
    for (k = Math.ceil(w.x[0] / L.stepX - eps); k * L.stepX <= w.x[1] + eps; k++) {
      x = k * L.stepX;
      s += tag('line', {x1: r2(L.sx(x)), y1: yy - 5, x2: r2(L.sx(x)), y2: yy + 5, stroke: AXISC, 'stroke-width': 1.2});
      if (has(show, 'numbers')) s += text(L.sx(x), yy + 22, fmt(x), {fill: NUMC, anchor: 'middle', size: 11, halo: false});
    }
    return s;
  }
  s += tag('rect', {x: L.pad.l, y: L.pad.t, width: L.iw, height: L.ih, fill: '#fff', stroke: has(show, 'border') ? '#c9ced6' : 'none'});
  var x0 = L.sx(0), y0 = L.sy(0), xin = w.x[0] <= 0 && w.x[1] >= 0, yin = w.y[0] <= 0 && w.y[1] >= 0;
  var nx = (w.x[1] - w.x[0]) / L.stepX, ny = (w.y[1] - w.y[0]) / L.stepY, everyX = nx > 14 ? 2 : 1, everyY = ny > 14 ? 2 : 1;
  if (has(show, 'grid')) {
    for (k = Math.ceil(w.x[0] / L.stepX - eps); k * L.stepX <= w.x[1] + eps; k++) { x = L.sx(k * L.stepX); s += tag('line', {x1: r2(x), y1: L.pad.t, x2: r2(x), y2: L.pad.t + L.ih, stroke: GRIDC, 'stroke-width': 1}); }
    if (!c.qualitative) for (k = Math.ceil(w.y[0] / L.stepY - eps); k * L.stepY <= w.y[1] + eps; k++) { y = L.sy(k * L.stepY); s += tag('line', {x1: L.pad.l, y1: r2(y), x2: L.pad.l + L.iw, y2: r2(y), stroke: GRIDC, 'stroke-width': 1}); }
  }
  var arrows = has(show, 'arrows');
  if (has(show, 'axes')) {
    if (yin) s += tag('line', {x1: L.pad.l, y1: r2(y0), x2: L.pad.l + L.iw, y2: r2(y0), stroke: AXISC, 'stroke-width': 1.5, 'marker-end': arrows ? 'url(#' + out.arrowId(AXISC) + ')' : null});
    if (xin) s += tag('line', {x1: r2(x0), y1: L.pad.t + L.ih, x2: r2(x0), y2: L.pad.t, stroke: AXISC, 'stroke-width': 1.5, 'marker-end': arrows ? 'url(#' + out.arrowId(AXISC) + ')' : null});
    var al = c.axisLabels || {};
    if (yin) s += text(L.pad.l + L.iw - 2, y0 - 6, al.x || 'x', {anchor: 'end', italic: true, fill: AXISC});
    if (xin) s += text(x0 + 6, L.pad.t + 9, al.y || 'y', {italic: true, fill: AXISC});
  }
  var bx = yin ? y0 : L.pad.t + L.ih, by = xin ? x0 : L.pad.l;
  for (k = Math.ceil(w.x[0] / L.stepX - eps); k * L.stepX <= w.x[1] + eps; k++) {
    var xv = k * L.stepX; if (Math.abs(xv) < eps && xin && yin) continue; x = L.sx(xv);
    if (has(show, 'ticks') && has(show, 'axes')) s += tag('line', {x1: r2(x), y1: bx - 3, x2: r2(x), y2: bx + 3, stroke: AXISC, 'stroke-width': 1});
    if (has(show, 'numbers') && k % everyX === 0 && x < L.pad.l + L.iw - 6) s += text(x, Math.min(bx + 14, L.H - 3), fmt(xv), {fill: NUMC, anchor: 'middle', size: 10});
  }
  if (!c.qualitative) for (k = Math.ceil(w.y[0] / L.stepY - eps); k * L.stepY <= w.y[1] + eps; k++) {
    var yv = k * L.stepY; if (Math.abs(yv) < eps && xin && yin) continue; y = L.sy(yv);
    if (has(show, 'ticks') && has(show, 'axes')) s += tag('line', {x1: by - 3, y1: r2(y), x2: by + 3, y2: r2(y), stroke: AXISC, 'stroke-width': 1});
    if (has(show, 'numbers') && k % everyY === 0 && y > L.pad.t + 8) s += text(Math.max(by - 6, 3), y + 3.5, fmt(yv), {fill: NUMC, anchor: by - 6 < 12 ? 'start' : 'end', size: 10});
  }
  return s;
}

/* build everything static.  Returns {svg, L, c, desc} */
function build(cfg, opts) {
  opts = opts || {};
  var c = cfg._resolved ? cfg : resolve(cfg); c._resolved = true;
  var L = layout(c), id = 'gk' + (++UID), markers = {};
  L.clipRef = L.nl ? null : 'url(#' + id + 'c)';
  var out = {curves: '', shade: '', points: '', labels: '', desc: [], clip: L.nl ? null : 'url(#' + id + 'c)',
    arrowId: function (color, start) { var key = id + 'a' + color.replace('#', '') + (start ? 's' : ''); markers[key] = {color: color, start: start}; return key; }};
  var fr = frame(L, c, out), ai = 0;
  c.draw.forEach(function (o) {
    var curve = /^(fn|line|piecewise|parametric|polar|circle|segment|ray|vector)$/.test(o.type);
    drawObject(L, o, curve ? [NAVY, GOLD, GRAY][ai++ % 3] : NAVY, out);
  });
  var main = {curves: out.curves, shade: out.shade, points: out.points, labels: out.labels};
  out.curves = out.shade = out.points = out.labels = ''; var d0 = out.desc.slice();
  c.answer.forEach(function (o) { var q = {}; for (var k in o) q[k] = o[k]; if (!q.color) q.color = GOLD; drawObject(L, q, GOLD, out); });
  out.desc = d0;
  var ans = out.shade + out.curves + out.points + out.labels;
  var legend = '';
  if (has(c.show, 'legend')) {
    var items = c.draw.filter(function (o) { return o.label && /^(fn|line|piecewise|parametric|polar)$/.test(o.type); }), li = 0;
    items.forEach(function (o, i) { var yy = L.pad.t + 12 + i * 15, col = o.color || [NAVY, GOLD, GRAY][i % 3]; legend += tag('line', {x1: L.pad.l + 8, y1: yy - 4, x2: L.pad.l + 26, y2: yy - 4, stroke: col, 'stroke-width': 2.2, 'stroke-dasharray': o.dash ? '5 4' : null}) + text(L.pad.l + 31, yy, o.label, {fill: col, size: 10.5}); li++; });
  }
  var defs = L.nl ? '' : tag('clipPath', {id: id + 'c'}, tag('rect', {x: L.pad.l, y: L.pad.t, width: L.iw, height: L.ih}));
  Object.keys(markers).forEach(function (k) {
    var m = markers[k];
    defs += tag('marker', {id: k, viewBox: '0 0 10 10', refX: m.start ? 2 : 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto', markerUnits: 'userSpaceOnUse'},
      tag('path', {d: m.start ? 'M10 0L0 5L10 10z' : 'M0 0L10 5L0 10z', fill: m.color}));
  });
  var desc = (L.nl ? 'Number line from ' + plain(L.win.x[0]) + ' to ' + plain(L.win.x[1]) : 'Graph with x from ' + plain(L.win.x[0]) + ' to ' + plain(L.win.x[1]) + ' and y from ' + plain(L.win.y[0]) + ' to ' + plain(L.win.y[1])) + (out.desc.length ? '. Shows: ' + out.desc.join('; ') + '.' : '.');
  if (c.alt) desc = c.alt;
  var body = tag('title', {}, esc(desc)) + tag('defs', {}, defs) + fr + main.shade + main.curves + legend + main.points + main.labels
    + tag('g', {'class': 'gk-answer', style: opts.showAnswer ? null : 'display:none'}, ans) + tag('g', {'class': 'gk-input'}, '');
  var svg = tag('svg', {xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 ' + L.W + ' ' + L.H, width: L.W, height: L.H, role: 'img', 'aria-label': desc,
    style: 'max-width:100%;height:auto;display:block', 'class': 'gk-svg'}, body);
  return {svg: svg, L: L, c: c, desc: desc};
}
GK.svg = function (cfg, opts) { return build(cfg, opts).svg; };
GK.describe = function (cfg) { return build(cfg).desc; };
GK.window = function (cfg) { return build(cfg).L.win; };

/* ══════════════════════════ 5. Student input: state, actions, grading (no browser needed) ══════════════════════════ */
GK.newState = function (mode) { return {mode: mode, pts: [], dashed: false, side: null, shade: [], tool: mode === 'numberline' ? 'closed' : 'point', marks: null, choice: null, zs: {}, left: null, right: null, zok: null}; };

function nearest(pts, x, y, hx, hy) {
  var best = -1, bd = Infinity;
  pts.forEach(function (p, i) { var dx = (p.x - x) / hx, dy = hy ? ((p.y || 0) - y) / hy : 0, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } });
  return {i: best, d: Math.sqrt(bd)};
}
function regionOf(sortedXs, x) { var i = 0; while (i < sortedXs.length && x > sortedXs[i]) i++; return i; }  // 0 .. n
/* action: {type:'click', x, y, hx, hy} (hx,hy = "close enough" distances in graph units) | {type:'tool', tool} | {type:'dashed', value} | {type:'clear'} | {type:'choose', index} */
GK.act = function (input, st, a) {
  st = clone(st); st.marks = null; st.zok = null;
  var mode = st.mode, hx = a.hx || 0.3, hy = a.hy || 0.3, n, near;
  if (a.type === 'end') { if (a.side === 'left' || a.side === 'right') st[a.side] = a.dir === 'down' ? 'down' : 'up'; return st; }
  if (mode === 'polysketch' && a.type === 'click') {         // one click = crosses, second = touches, third = removes
    var zr = Math.round(a.x), zc = st.zs[zr];
    if (!zc) st.zs[zr] = 1; else if (zc === 1) st.zs[zr] = 2; else delete st.zs[zr];
    return st;
  }
  if (a.type === 'clear') { var fresh = GK.newState(mode); fresh.tool = mode === 'numberline' ? 'closed' : 'point'; return fresh; }
  if (a.type === 'tool') { st.tool = a.tool; return st; }
  if (a.type === 'dashed') { st.dashed = !!a.value; return st; }
  if (a.type === 'choose') { st.choice = a.index; return st; }
  if (a.type !== 'click') return st;
  if (mode === 'points') {
    near = nearest(st.pts, a.x, a.y, hx, hy); n = input.n || (input.expected ? input.expected.length : null) || input.max;
    if (near.i >= 0 && near.d <= 1) { st.pts.splice(near.i, 1); return st; }
    var np = {x: a.x, y: a.y}; if (st.tool === 'open') np.open = true;
    if (n && st.pts.length >= n) st.pts[near.i] = np; else st.pts.push(np);
    return st;
  }
  if (mode === 'line' || mode === 'inequality') {
    near = nearest(st.pts, a.x, a.y, hx, hy);
    if (st.pts.length < 2) { if (near.i >= 0 && near.d <= 1) return st; st.pts.push({x: a.x, y: a.y}); return st; }
    if (mode === 'line' || st.tool === 'move' || (near.d <= 1)) {
      var other = st.pts[1 - near.i]; if (Math.abs(other.x - a.x) < 1e-12 && Math.abs(other.y - a.y) < 1e-12) return st;
      st.pts[near.i] = {x: a.x, y: a.y}; if (mode === 'inequality') st.side = null; return st;
    }
    var ln = GK.lineOf({through: [[st.pts[0].x, st.pts[0].y], [st.pts[1].x, st.pts[1].y]]});
    var raw = a.rawX != null ? [a.rawX, a.rawY] : [a.x, a.y];
    var v = ln.vertical ? raw[0] - ln.x : raw[1] - (ln.m * raw[0] + ln.b);
    if (Math.abs(v) > 1e-9) st.side = v > 0 ? 1 : -1;
    return st;
  }
  if (mode === 'numberline') {
    if (st.tool === 'shade') {
      var xs = st.pts.map(function (p) { return p.x; }).sort(function (p, q) { return p - q; });
      var rx = a.rawX != null ? a.rawX : a.x, reg = regionOf(xs, rx), before = st.shade.length;
      st.shade = st.shade.filter(function (s) { return regionOf(xs, s) !== reg; });
      if (st.shade.length === before) { var lo = reg ? xs[reg - 1] : -Infinity, hi = reg < xs.length ? xs[reg] : Infinity; st.shade.push(!isFinite(lo) && !isFinite(hi) ? 0 : !isFinite(lo) ? hi - 1 : !isFinite(hi) ? lo + 1 : (lo + hi) / 2); }
      return st;
    }
    near = nearest(st.pts, a.x, 0, hx, 0);
    var open = st.tool === 'open';
    if (near.i >= 0 && near.d <= 1) { if (!!st.pts[near.i].open === open) st.pts.splice(near.i, 1); else st.pts[near.i].open = open; return st; }
    st.pts.push({x: a.x, open: open}); return st;
  }
  return st;
};

/* what the student's number line says, as pieces */
GK.numberlinePieces = function (st) {
  var pts = st.pts.slice().sort(function (p, q) { return p.x - q.x; }), xs = pts.map(function (p) { return p.x; }), out = [], used = {};
  st.shade.forEach(function (s) {
    var reg = regionOf(xs, s); if (used[reg]) return; used[reg] = 1;
    var L = reg ? pts[reg - 1] : null, R = reg < pts.length ? pts[reg] : null;
    out.push({lo: L ? L.x : -Infinity, hi: R ? R.x : Infinity, lc: !!L && !L.open, hc: !!R && !R.open});
  });
  pts.forEach(function (p, i) { if (!p.open && !used[i] && !used[i + 1]) out.push({lo: p.x, hi: p.x, lc: true, hc: true}); });
  return mergeP(out);
};
function mergeP(ps) {
  if (MC && MC._internals) return MC._internals.mergePieces(ps);
  return ps.slice().sort(function (a, b) { return a.lo - b.lo; });
}
function samePieces(a, b, tol) {
  if (a.length !== b.length) return false;
  function eq(u, v) { return (!isFinite(u) || !isFinite(v)) ? u === v : Math.abs(u - v) <= tol; }
  for (var i = 0; i < a.length; i++) if (!eq(a[i].lo, b[i].lo) || !eq(a[i].hi, b[i].hi) || a[i].lc !== b[i].lc || a[i].hc !== b[i].hc) return false;
  return true;
}
function lineClose(u, e, win, tol) {
  if (!u || !e) return false;
  if (u.vertical || e.vertical) return !!u.vertical && !!e.vertical && Math.abs(u.x - e.x) <= tol;
  return Math.abs((u.m * win.x[0] + u.b) - (e.m * win.x[0] + e.b)) <= tol && Math.abs((u.m * win.x[1] + u.b) - (e.m * win.x[1] + e.b)) <= tol;
}
/* grade(input, state, window) -> {ok, score, detail}   (also fills state.marks for point colouring) */
GK.gradeState = function (input, st, win) {
  var e = input.expected, mode = st.mode, span = win ? Math.max(win.x[1] - win.x[0], win.y ? win.y[1] - win.y[0] : 0) : 20;
  var tol = input.tol != null ? input.tol : (input.snap === false ? 0.03 * span : 1e-6 + 0.012 * span);
  if (mode === 'points') {
    var used = st.pts.map(function () { return false; }), hit = 0;
    (e || []).forEach(function (q) {
      for (var i = 0; i < st.pts.length; i++) { var p = st.pts[i]; if (!used[i] && Math.abs(p.x - q[0]) <= tol && Math.abs(p.y - q[1]) <= tol && (q[2] === undefined || !!p.open === (q[2] === 'open'))) { used[i] = true; hit++; return; } }
    });
    st.marks = used;
    var extra = used.filter(function (u) { return !u; }).length, ok = hit === e.length && !extra;
    return {ok: ok, score: e.length ? Math.max(0, hit - extra) / e.length : 0, detail: ok ? '' : !st.pts.length ? 'Click the graph to place a point.' : hit + ' of ' + e.length + ' points correct' + (extra ? ', ' + extra + ' extra' : '') + '.'};
  }
  if (mode === 'line' || mode === 'inequality') {
    if (st.pts.length < 2) return {ok: false, score: 0, detail: 'Click two points to make the line.'};
    var u = GK.lineOf({through: [[st.pts[0].x, st.pts[0].y], [st.pts[1].x, st.pts[1].y]]}), ex = GK.lineOf(e), lineOk = lineClose(u, ex, win, tol);
    if (mode === 'line') return {ok: lineOk, score: lineOk ? 1 : 0, detail: lineOk ? '' : 'That is not the right line yet.'};
    var strict = e.op === '<' || e.op === '>', above = e.op === '>' || e.op === '>=';
    var styleOk = st.dashed === strict, sideOk = st.side === (above ? 1 : -1), parts = (lineOk ? 1 : 0) + (styleOk ? 1 : 0) + (sideOk ? 1 : 0);
    return {ok: parts === 3, score: parts / 3, detail: parts === 3 ? '' : !lineOk ? 'Check the boundary line.' : st.side === null ? 'Now click the side to shade.' : !styleOk ? 'Boundary is right. Should it be solid or dashed?' : 'Boundary is right. Check which side is shaded.',
      parts: {line: lineOk, style: styleOk, side: sideOk}};
  }
  if (mode === 'numberline') {
    var got = GK.numberlinePieces(st), want = pieces(e), good = samePieces(got, want, input.tol != null ? input.tol : 1e-6);
    var ends = function (ps) { var o = []; ps.forEach(function (p) { if (isFinite(p.lo)) o.push(p.lo); if (isFinite(p.hi)) o.push(p.hi); }); return o.join(','); };
    return {ok: good, score: good ? 1 : 0, detail: good ? '' : (!st.pts.length && !st.shade.length) ? 'Place a point, then shade.' : ends(got) === ends(want) && got.length === want.length ? 'The numbers are right. Check open versus closed circles, and what is shaded.' : 'Not quite. Check your endpoints and shading.'};
  }
  if (mode === 'polysketch') {                                   // zeros, crosses-or-touches at each, and both ends: 4 parts
    var tr = {}, ex = {}, mk = st.zs || {}, deg = 0, got = 0, issues = [], zok = {}, trK, mkK, k, miss, extra;
    (e.zeros || []).forEach(function (z) { tr[z.r] = z.m % 2 === 0 ? 2 : 1; ex[z.r] = z.m; deg += z.m; });
    trK = Object.keys(tr).sort(); mkK = Object.keys(mk).sort();
    mkK.forEach(function (q) { zok[q] = false; });
    if (trK.join() === mkK.join()) {
      got++; var badK = null;
      trK.forEach(function (q) { zok[q] = tr[q] === mk[q]; if (!zok[q] && badK === null) badK = q; });
      if (badK === null) got++; else issues.push('Recheck x = ' + fmt(+badK) + ': does that factor\'s exponent make the graph cross or touch?');
    } else if (!mkK.length) issues.push('Click the grid to mark the zeros first.');
    else {
      miss = trK.filter(function (q) { return mkK.indexOf(q) < 0; }); extra = mkK.filter(function (q) { return trK.indexOf(q) < 0; });
      trK.forEach(function (q) { if (mk[q] !== undefined) zok[q] = tr[q] === mk[q]; });
      issues.push((miss.length ? 'You are missing a zero. ' : '') + (extra.length ? 'x = ' + fmt(+extra[0]) + ' is not a zero of f. ' : '') + 'Each factor (x − r) gives a zero at x = r.');
    }
    var en = e.ends || GK.polyEnds(deg, e.a || 1);
    if (!st.left || !st.right) issues.push('Choose both end behaviors.');
    else { if (st.left === en.left) got++; else issues.push('Recheck the left end.'); if (st.right === en.right) got++; else issues.push('Recheck the right end.'); }
    st.zok = zok;
    return {ok: got === 4, score: got / 4, detail: got === 4 ? '' : issues.join(' ')};
  }
  if (mode === 'choose') { var c = st.choice === e; return {ok: c, score: c ? 1 : 0, detail: st.choice == null ? 'Pick one of the graphs.' : ''}; }
  return {ok: false, score: 0, detail: ''};
};

function autoAnswer(mode, e) {
  var q = {color: GOLD}, k;
  if (mode === 'points') return [{type: 'points', at: e.map(function (p) { return [p[0], p[1]]; }), color: GOLD}];
  if (mode === 'line') { q.type = 'line'; for (k in e) q[k] = e[k]; return [q]; }
  if (mode === 'inequality') { q.type = 'inequality'; for (k in e) q[k] = e[k]; return [q]; }
  if (mode === 'numberline') return [{type: 'interval', value: e, color: GOLD, lift: 16}];
  if (mode === 'polysketch') return [{type: 'polysketch', zeros: e.zeros, a: e.a || 1, color: GOLD}];
  return [];
}
/* drawing of the student's marks */
function drawInput(L, c, st) {
  var s = '', w = L.win, input = c.input || {};
  function col(i) { return st.marks ? (st.marks[i] ? OKC : BADC) : NAVY; }
  if (st.mode === 'points') st.pts.forEach(function (p, i) { s += dot(L, [p.x, p.y], col(i), p.open, 5.5); });
  if (st.mode === 'line' || st.mode === 'inequality') {
    if (st.pts.length === 2) {
      var ln = GK.lineOf({through: [[st.pts[0].x, st.pts[0].y], [st.pts[1].x, st.pts[1].y]]}), P = lineEnds(L, ln);
      if (st.mode === 'inequality' && st.side) {
        var poly, up = st.side > 0;
        if (ln.vertical) { var xe = up ? w.x[1] + 1 : w.x[0] - 1; poly = [P[0], P[1], [xe, w.y[1]], [xe, w.y[0]]]; }
        else { var ye = up ? Math.max(w.y[1], P[0][1], P[1][1]) + 1 : Math.min(w.y[0], P[0][1], P[1][1]) - 1; poly = [P[0], P[1], [P[1][0], ye], [P[0][0], ye]]; }
        s += tag('path', {d: pathOf(L, [poly]) + 'Z', fill: NAVY, 'fill-opacity': 0.14, 'clip-path': L.clipRef});
      }
      s += tag('line', {x1: r2(L.sx(P[0][0])), y1: r2(L.sy(P[0][1])), x2: r2(L.sx(P[1][0])), y2: r2(L.sy(P[1][1])), stroke: NAVY, 'stroke-width': 2.2, 'stroke-dasharray': st.mode === 'inequality' && st.dashed ? '7 5' : null, 'clip-path': L.clipRef});
    }
    st.pts.forEach(function (p) { s += dot(L, [p.x, p.y], NAVY, false, 5); });
  }
  if (st.mode === 'polysketch') {
    var zl = Object.keys(st.zs || {}).map(Number).sort(function (p, q) { return p - q; }).map(function (r) { return {r: r, m: st.zs[r]}; }), sg = GK.polySign(zl, st.left, st.right);
    if (zl.length && sg) s += tag('path', {d: polyPath(L, zl, sg), fill: 'none', stroke: NAVY, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'clip-path': L.clipRef});
    zl.forEach(function (z) { s += dot(L, [z.r, 0], st.zok ? (st.zok[z.r] ? OKC : BADC) : NAVY, z.m === 2, 5.5); });
  }
  if (st.mode === 'numberline') {
    var y = L.sy(0);
    GK.numberlinePieces({pts: st.pts, shade: st.shade}).forEach(function (p) {
      var lo = Math.max(p.lo, w.x[0] - 0.4), hi = Math.min(p.hi, w.x[1] + 0.4);
      if (hi > lo) s += tag('line', {x1: r2(L.sx(lo)), y1: y, x2: r2(L.sx(hi)), y2: y, stroke: NAVY, 'stroke-width': 5});
      if (!isFinite(p.lo)) s += tag('path', {d: 'M' + r2(L.sx(lo) - 7) + ' ' + y + 'l9 -6v12z', fill: NAVY});
      if (!isFinite(p.hi)) s += tag('path', {d: 'M' + r2(L.sx(hi) + 7) + ' ' + y + 'l-9 -6v12z', fill: NAVY});
    });
    st.pts.forEach(function (p) { s += dot(L, [p.x, 0], NAVY, p.open, 6); });
  }
  if (st.cursor) s += tag('path', {d: 'M' + r2(L.sx(st.cursor.x) - 8) + ' ' + r2(L.sy(st.cursor.y || 0)) + 'h16M' + r2(L.sx(st.cursor.x)) + ' ' + r2(L.sy(st.cursor.y || 0) - 8) + 'v16', stroke: GOLD, 'stroke-width': 1.6, fill: 'none'});
  return s;
}
GK._drawInput = drawInput; GK._build = build; GK._resolve = resolve;

/* ══════════════════════════ 6. In the page: mount() ══════════════════════════ */
GK.css =
  '.gk{font-family:sans-serif;font-size:13px;color:#1a1a1a;max-width:100%}' +
  '.gk-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start}' +
  '.gk-svg{touch-action:manipulation;border-radius:6px}' +
  '.gk-svg[tabindex]{cursor:crosshair}.gk-svg[tabindex]:focus{outline:2px solid #7a5c1e;outline-offset:2px}' +
  '.gk-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 8px}' +
  '.gk-btn{font:600 13px sans-serif;padding:7px 14px;min-height:36px;border-radius:18px;border:1.5px solid #1e3a5c;background:#fff;color:#1e3a5c;cursor:pointer}' +
  '.gk-btn:hover,.gk-btn[aria-pressed="true"]{background:#1e3a5c;color:#fff}' +
  '.gk-btn.gk-quiet{border-color:#bbb;color:#555;font-weight:400}.gk-btn.gk-quiet:hover{background:#eee;color:#111}' +
  '.gk-hint{color:#666;font-size:12px;flex:1;min-width:140px}' +
  '.gk-fb{min-height:1.4em;margin-top:6px;font-size:13px}.gk-fb.ok{color:#3a7a3a;font-weight:700}.gk-fb.bad{color:#b03030}' +
  '.gk-more{margin-top:6px;font-size:12px;color:#666}.gk-more summary{cursor:pointer;color:#888;width:max-content}' +
  '.gk-more-body{display:flex;gap:12px;flex-wrap:wrap;align-items:center;padding:6px 0}' +
  '.gk-table{border-collapse:collapse;font:13px sans-serif}.gk-table th,.gk-table td{border:1px solid #b9c7da;padding:3px 10px;text-align:center}.gk-table th{background:#e4edf7;color:#1e3a5c}' +
  '.gk-options{display:flex;gap:10px;flex-wrap:wrap}.gk-opt{border:2px solid #ddd;border-radius:10px;padding:6px;background:#fff;cursor:pointer}' +
  '.gk-opt:hover{border-color:#7a5c1e}.gk-opt[aria-pressed="true"]{border-color:#1e3a5c;box-shadow:0 0 0 2px #1e3a5c inset}.gk-opt.ok{border-color:#3a7a3a}.gk-opt.bad{border-color:#b03030}' +
  '.gk-opt-label{font:700 12px sans-serif;color:#1e3a5c;margin-bottom:2px}' +
  '.sk-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:.8rem;align-items:center}' +
  '.sk-type{font-family:sans-serif;font-size:12px;padding:4px 12px;border-radius:16px;border:1.5px solid #1e3a5c;background:#fff;color:#1e3a5c;cursor:pointer}' +
  '.sk-type.sk-active,.sk-type:hover{background:#1e3a5c;color:#fff}.sk-type[data-sktype="vertex"]{border-color:#7a5c1e;color:#7a5c1e}' +
  '.sk-type[data-sktype="vertex"].sk-active,.sk-type[data-sktype="vertex"]:hover{background:#7a5c1e;color:#fff}' +
  '.sk-fb{margin-top:.8rem;font-family:sans-serif;font-size:13px;min-height:1.5rem}.sk-feat{display:flex;gap:.5rem;padding:.15rem 0;line-height:1.4}.sk-feat.hit{color:#3f7a52}.sk-feat.miss{color:#b3413a}' +
  '@media print{.gk-tools,.gk-more,.gk-fb{display:none}}';
function ensureCss(doc) { if (doc.getElementById('gk-css')) return; var st = doc.createElement('style'); st.id = 'gk-css'; st.textContent = GK.css; doc.head.appendChild(st); }

var TOOLBARS = {      // the ONLY buttons each mode ever shows
  points: function (input) { return (input.allowOpen ? [{tool: 'point', label: '● Closed'}, {tool: 'open', label: '○ Open'}] : []).concat([{act: 'undo', label: 'Undo', quiet: true}, {act: 'clear', label: 'Clear', quiet: true}]); },
  line: function () { return [{act: 'undo', label: 'Undo', quiet: true}, {act: 'clear', label: 'Clear', quiet: true}]; },
  inequality: function () { return [{dashed: false, label: 'Solid line'}, {dashed: true, label: 'Dashed line'}, {act: 'undo', label: 'Undo', quiet: true}, {act: 'clear', label: 'Clear', quiet: true}]; },
  numberline: function () { return [{tool: 'closed', label: '● Closed point'}, {tool: 'open', label: '○ Open point'}, {tool: 'shade', label: 'Shade'}, {act: 'undo', label: 'Undo', quiet: true}, {act: 'clear', label: 'Clear', quiet: true}]; },
  polysketch: function () { return [{end: {side: 'left', dir: 'up'}, label: 'Left end ↑'}, {end: {side: 'left', dir: 'down'}, label: 'Left end ↓'}, {end: {side: 'right', dir: 'up'}, label: 'Right end ↑'}, {end: {side: 'right', dir: 'down'}, label: 'Right end ↓'}, {act: 'undo', label: 'Undo', quiet: true}, {act: 'clear', label: 'Clear', quiet: true}]; }
};
GK.toolbarFor = function (cfg) { var c = resolve(cfg), m = c.input && c.input.mode; return TOOLBARS[m] ? TOOLBARS[m](c.input).map(function (b) { return b.label; }) : m === 'sketch' ? ((c.sketch && c.sketch.tools) || ['keypoint', 'vertex']) : []; };
var HINTS = { points: 'Click to place a point. Click a point again to remove it.', line: 'Click two points on the line. Click again to move the nearer point.',
  polysketch: 'Click a zero once if the graph crosses there, twice if it touches and turns around, a third time to remove it. Then choose both ends.',
  inequality: 'Click two points for the boundary, choose solid or dashed, then click the side to shade.', numberline: 'Place your point(s), then choose Shade and click the part(s) of the line to shade.' };

GK.mount = function (el, cfg) {
  if (typeof el === 'string') el = document.getElementById(el);
  var doc = el.ownerDocument; ensureCss(doc);
  var c = resolve(cfg); c._resolved = true;
  var input = c.input, mode = input && input.mode;
  el.innerHTML = ''; el.classList.add('gk');
  var api = {el: el, config: c, mode: mode || 'read'};

  if (mode === 'choose') return mountChoose(el, c, api);
  if (mode === 'sketch') return mountSketch(el, c, api);

  if (mode && !c.answer.length && input.expected != null) c.answer = autoAnswer(mode, input.expected);   // gold answer layer, hidden until showAnswer()
  var B = build(c), L = B.L;
  var st = mode ? GK.newState(mode) : null, history = [], snapOn = !(input && input.snap === false), zoom = 1;
  var tools = mode && TOOLBARS[mode] ? TOOLBARS[mode](input) : [];
  var bar = null, hint = null;
  if (tools.length) {
    bar = doc.createElement('div'); bar.className = 'gk-tools'; bar.setAttribute('role', 'toolbar');
    tools.forEach(function (t) {
      var b = doc.createElement('button'); b.type = 'button'; b.className = 'gk-btn' + (t.quiet ? ' gk-quiet' : ''); b.textContent = t.label;
      b.addEventListener('click', function () {
        if (t.act === 'undo') { if (history.length) { st = history.pop(); refresh(); } return; }
        history.push(clone(st));
        if (t.act === 'clear') st = GK.act(input, st, {type: 'clear'});
        else if (t.tool) st = GK.act(input, st, {type: 'tool', tool: t.tool});
        else if ('dashed' in t) st = GK.act(input, st, {type: 'dashed', value: t.dashed});
        else if (t.end) st = GK.act(input, st, {type: 'end', side: t.end.side, dir: t.end.dir});
        refresh();
      });
      b._t = t; bar.appendChild(b);
    });
    el.appendChild(bar);
  }
  var row = doc.createElement('div'); row.className = 'gk-row'; el.appendChild(row);
  var holder = doc.createElement('div'); holder.innerHTML = B.svg; row.appendChild(holder);
  var svg = holder.firstChild;
  c.draw.filter(function (o) { return o.type === 'table'; }).forEach(function (t) {
    var h = '<table class="gk-table"><tr>' + t.columns.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr>' + t.rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(typeof x === 'number' ? fmt(x) : x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    var d = doc.createElement('div'); d.innerHTML = h; row.appendChild(d);
  });
  var fb = doc.createElement('div'); fb.className = 'gk-fb'; fb.setAttribute('aria-live', 'polite');
  if (mode) {
    hint = doc.createElement('div'); hint.className = 'gk-hint'; hint.textContent = input.prompt || HINTS[mode] || '';
    if (bar) bar.appendChild(hint); else el.insertBefore(hint, row);
    el.appendChild(fb);
    svg.setAttribute('tabindex', '0'); svg.setAttribute('role', 'application');
  }
  var readout = null;
  if (c.more && c.more.length) {
    var det = doc.createElement('details'); det.className = 'gk-more'; det.innerHTML = '<summary>More</summary>';
    var body = doc.createElement('div'); body.className = 'gk-more-body'; det.appendChild(body);
    if (has(c.more, 'coords')) { readout = doc.createElement('span'); readout.textContent = 'Move over the graph to read coordinates.'; body.appendChild(readout); }
    if (has(c.more, 'snap') && mode) { var lab = doc.createElement('label'); lab.innerHTML = '<input type="checkbox" checked> Snap to grid'; lab.firstChild.addEventListener('change', function (e) { snapOn = e.target.checked; }); body.appendChild(lab); }
    if (has(c.more, 'zoom') && !L.nl) {
      [['Zoom in', 0.8], ['Zoom out', 1.25], ['Reset view', 0]].forEach(function (z) {
        var b = doc.createElement('button'); b.type = 'button'; b.className = 'gk-btn gk-quiet'; b.textContent = z[0];
        b.addEventListener('click', function () { zoom = z[1] ? zoom * z[1] : 1; rebuild(); }); body.appendChild(b);
      });
    }
    el.appendChild(det);
  }
  var baseWin = {x: L.win.x.slice(), y: L.win.y.slice()};
  function rebuild() {
    var cx = (baseWin.x[0] + baseWin.x[1]) / 2, cy = (baseWin.y[0] + baseWin.y[1]) / 2, hw = (baseWin.x[1] - baseWin.x[0]) / 2 * zoom, hh = (baseWin.y[1] - baseWin.y[0]) / 2 * zoom;
    var c2 = {}; for (var k in c) c2[k] = c[k]; c2.window = {x: [cx - hw, cx + hw], y: [cy - hh, cy + hh]}; c2.ticks = null;
    var shown = svg.querySelector('.gk-answer') && svg.querySelector('.gk-answer').style.display !== 'none';
    B = build(c2, {showAnswer: shown}); L = B.L;
    holder.innerHTML = B.svg; svg = holder.firstChild; if (mode) { svg.setAttribute('tabindex', '0'); svg.setAttribute('role', 'application'); wire(); } else if (readout) wire();
    refresh();
  }
  function snap(v, step) { return snapOn ? Math.round(v / step) * step : v; }
  function steps() { var s = input && typeof input.snap === 'number' ? input.snap : null; return {x: s || Math.min(L.stepX, 1), y: s || Math.min(L.stepY, 1)}; }
  function fromEvent(e) { var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * L.W / r.width, py = (e.clientY - r.top) * L.H / r.height; return {x: L.ix(px), y: L.nl ? 0 : L.iy(py)}; }
  function click(raw) {
    if (!st || api.locked) return;
    var sp = steps(), hx = 13 / L.iw * (L.win.x[1] - L.win.x[0]), hy = L.nl ? 0 : 13 / L.ih * (L.win.y[1] - L.win.y[0]);
    var x = snap(raw.x, sp.x), y = L.nl ? 0 : snap(raw.y, sp.y);
    if (!L.nl && (raw.x < L.win.x[0] - hx || raw.x > L.win.x[1] + hx || raw.y < L.win.y[0] - hy || raw.y > L.win.y[1] + hy)) return;
    history.push(clone(st)); if (history.length > 60) history.shift();
    var cur = st.cursor; st = GK.act(input, st, {type: 'click', x: x, y: y, rawX: raw.x, rawY: raw.y, hx: hx, hy: hy}); st.cursor = cur;
    fb.textContent = ''; fb.className = 'gk-fb';
    refresh(); if (typeof c.onChange === 'function') c.onChange(api);
  }
  function refresh() {
    var g = svg.querySelector('.gk-input'); if (g && st) g.innerHTML = drawInput(L, c, st);
    if (bar) Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
      var t = b._t; if (t.tool) b.setAttribute('aria-pressed', String(st.tool === t.tool)); if ('dashed' in t) b.setAttribute('aria-pressed', String(st.dashed === t.dashed));
      if (t.end) b.setAttribute('aria-pressed', String(st[t.end.side] === t.end.dir));
    });
  }
  function wire() {
    if (mode) {
      svg.addEventListener('click', function (e) { click(fromEvent(e)); });
      svg.addEventListener('keydown', function (e) {
        var sp = steps(), k = e.key; if (!st.cursor) st.cursor = {x: snap((L.win.x[0] + L.win.x[1]) / 2, sp.x), y: L.nl ? 0 : snap((L.win.y[0] + L.win.y[1]) / 2, sp.y)};
        if (k === 'ArrowLeft') st.cursor.x = Math.max(L.win.x[0], st.cursor.x - sp.x); else if (k === 'ArrowRight') st.cursor.x = Math.min(L.win.x[1], st.cursor.x + sp.x);
        else if (k === 'ArrowUp' && !L.nl) st.cursor.y = Math.min(L.win.y[1], st.cursor.y + sp.y); else if (k === 'ArrowDown' && !L.nl) st.cursor.y = Math.max(L.win.y[0], st.cursor.y - sp.y);
        else if (k === 'Enter' || k === ' ') { e.preventDefault(); click({x: st.cursor.x, y: st.cursor.y}); return; } else return;
        e.preventDefault(); svg.setAttribute('aria-label', 'Cursor at ' + plain(st.cursor.x) + (L.nl ? '' : ', ' + plain(st.cursor.y)) + '. Press Enter to click here.'); refresh();
      });
      svg.addEventListener('blur', function () { if (st.cursor) { st.cursor = null; refresh(); } });
    }
    if (readout) svg.addEventListener('pointermove', function (e) { var p = fromEvent(e); readout.textContent = L.nl ? 'x = ' + fmt(Math.round(p.x * 10) / 10) : '(' + fmt(Math.round(p.x * 10) / 10) + ', ' + fmt(Math.round(p.y * 10) / 10) + ')'; });
  }
  wire(); refresh();

  api.grade = function () {
    if (!mode) return {ok: true, score: 1, detail: ''};
    var res = GK.gradeState(input, st, L.win); refresh();
    if (!c.quietFeedback) { fb.className = 'gk-fb ' + (res.ok ? 'ok' : 'bad'); fb.textContent = res.ok ? '✓ Correct!' : '✗ ' + (res.detail || 'Not quite.'); }
    return res;
  };
  api.showAnswer = function () { var a = svg.querySelector('.gk-answer'); if (a) a.style.display = ''; };
  api.reset = function () { if (st) { st = GK.newState(mode); history = []; } fb.textContent = ''; fb.className = 'gk-fb'; var a = svg.querySelector('.gk-answer'); if (a) a.style.display = 'none'; api.locked = false; refresh(); };
  api.getState = function () { return st ? clone(st) : null; };
  api.setState = function (s) { st = clone(s); refresh(); };
  api.lock = function (v) { api.locked = v !== false; };
  api.click = function (x, y) { click({x: x, y: y || 0}); };   // for tests and demos
  api.svg = function () { return svg; };
  return api;
};

function mountChoose(el, c, api) {
  var doc = el.ownerDocument, st = GK.newState('choose'), wrap = doc.createElement('div'); wrap.className = 'gk-options'; wrap.setAttribute('role', 'group');
  var fb = doc.createElement('div'); fb.className = 'gk-fb'; fb.setAttribute('aria-live', 'polite');
  var btns = (c.options || []).map(function (opt, i) {
    var o = {}; for (var k in opt) o[k] = opt[k]; if (!o.size) o.size = {w: 190, h: 170};
    var b = doc.createElement('button'); b.type = 'button'; b.className = 'gk-opt'; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<div class="gk-opt-label">' + String.fromCharCode(65 + i) + '</div>' + GK.svg(o);
    b.addEventListener('click', function () { if (api.locked) return; st.choice = i; btns.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); x.classList.remove('ok', 'bad'); }); fb.textContent = ''; if (typeof c.onChange === 'function') c.onChange(api); });
    wrap.appendChild(b); return b;
  });
  el.appendChild(wrap); el.appendChild(fb);
  api.grade = function () { var r = GK.gradeState(c.input, st); if (st.choice != null) btns[st.choice].classList.add(r.ok ? 'ok' : 'bad'); if (!c.quietFeedback) { fb.className = 'gk-fb ' + (r.ok ? 'ok' : 'bad'); fb.textContent = r.ok ? '✓ Correct!' : '✗ ' + (r.detail || 'Not quite.'); } return r; };
  api.showAnswer = function () { btns.forEach(function (b, j) { b.classList.toggle('ok', j === c.input.expected); }); };
  api.reset = function () { st = GK.newState('choose'); btns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.classList.remove('ok', 'bad'); }); fb.textContent = ''; api.locked = false; };
  api.getState = function () { return clone(st); }; api.lock = function (v) { api.locked = v !== false; };
  api.click = function (i) { btns[i].click(); };
  return api;
}

/* sketch-curve: hands the work to the existing SketchWidget so its behaviour and grading stay exactly the same */
function mountSketch(el, c, api) {
  var doc = el.ownerDocument, SW = root.SketchWidget || (typeof SketchWidget !== 'undefined' ? SketchWidget : null), id = 'gksk' + (++UID), sk = c.sketch || {}, prob = {}, k;
  if (!SW) { el.innerHTML = '<div class="gk-fb bad">The sketch tool (sketch-widget.js) is not loaded on this page.</div>'; api.grade = function () { return {ok: false, score: 0, detail: 'sketch tool missing'}; }; api.showAnswer = api.reset = function () {}; return api; }
  for (k in sk) prob[k] = sk[k];
  var win = c.window && c.window.x && c.window.y ? c.window : GK.fitWindow({window: c.window, draw: c.draw.concat(sk.fn ? [{type: 'fn', f: sk.fn}] : [])});
  if (prob.xMin == null) { prob.xMin = win.x[0]; prob.xMax = win.x[1]; prob.yMin = win.y[0]; prob.yMax = win.y[1]; }
  if (typeof prob.fn === 'string') prob.fn = toFn(prob.fn);
  if (typeof prob.staticFn === 'string') prob.staticFn = toFn(prob.staticFn);
  var names = {keypoint: '○ Key point', vertex: '◆ Vertex'}, labels = sk.toolLabels || {}, tools = sk.tools || ['keypoint', 'vertex'];
  var bar = doc.createElement('div'); bar.className = 'sk-toolbar';
  tools.forEach(function (t, i) { var b = doc.createElement('button'); b.type = 'button'; b.className = 'sk-type' + (i ? '' : ' sk-active'); b.setAttribute('data-sktype', t); b.innerHTML = labels[t] || names[t] || t; bar.appendChild(b); });
  if (tools.length < 2) bar.style.display = 'none';
  var holder = doc.createElement('div'); holder.innerHTML = '<svg id="' + id + '" width="480" height="280" viewBox="0 0 480 280" style="max-width:100%;height:auto"></svg><div class="sk-fb" id="' + id + 'fb" aria-live="polite"></div>';
  el.appendChild(bar); el.appendChild(holder);
  var w = new SW(id, id + 'fb', prob, bar); w.activeType = tools[0];
  api.widget = w;
  api.grade = function () {
    w.checkSketch();
    var exp = prob.expected || {}, total = 0, hit = 0; for (var key in exp) total += exp[key].length;
    w.markers.forEach(function (m) { if (m.correct === true) hit++; });
    var need = prob.passThreshold != null ? prob.passThreshold : total, okk = hit >= need && !/adjust the curve shape|only \d+\/\d+ sampled/.test(w.fbEl.innerHTML);
    return {ok: okk, score: total ? hit / total : 0, detail: hit + ' of ' + total + ' key features'};
  };
  api.showAnswer = function () { w.showAnswer(); };
  api.reset = function () { w.reset(); w.activeType = tools[0]; };
  api.getState = function () { return {markers: w.markers.length}; }; api.lock = function () {};
  return api;
}

if (typeof module !== 'undefined' && module.exports) module.exports = GK;
root.GraphKit = GK;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
