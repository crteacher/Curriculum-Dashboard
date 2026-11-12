/*!
 * mathcheck.js  —  MathCheck: shared answer checker for the Curriculum Dashboard.
 *
 * WHAT IT DOES
 *   Decides whether a typed answer is mathematically right, even when it is typed in a
 *   different form (3/2 vs 1.5, x(x+3) vs x^2+3x, "x=3 or x=-2" vs "-2, 3"), and can also
 *   insist on a particular form ("factor completely" rejects the expanded polynomial).
 *
 * HOW A PRACTICE PROBLEM USES IT
 *   Old style (unchanged):   { latex:..., answer:['(x+2)(x+3)'], hint:..., step:... }
 *   New style (opt in):      add ONE line   check:{ type:'expr', value:'(x+2)(x+3)', form:'factored' }
 *
 *   MathCheck.ok(userText, problem)      -> true / false   (drop-in for the old ok())
 *   MathCheck.grade(userText, problem)   -> { ok, reason }  reason = short student-safe feedback
 *   MathCheck.check(userText, spec)      -> { ok, reason }  when you only have a spec
 *   A problem with no `check` line is graded by the old exact-match rules (see legacyOk).
 *
 * SPEC TYPES  (every spec may add  quiet:true  to switch feedback text off)
 *   {type:'number',   value:1.5}                 3/2, 1.5, 1 1/2, 1½, 6/4 ...
 *        options: tol:0.01 (allowed error)   exact:true (no rounded decimals)
 *                 form:'simplified' (reduced fraction / simplified radical)
 *   {type:'expr',     value:'x^2+3x'}            any algebraically equal form
 *        options: form:'factored' | 'expanded' | 'simplified'
 *                 domain:'strict'  (default 'lenient': (x^2-1)/(x-1) counts as x+1)
 *                 plusC:true       (antiderivatives: any constant letter, and "+C" is required)
 *                 vars:['x','e']   (force letters to be variables, e.g. treat e as a variable)
 *   {type:'set',      values:[3,-2]}             "x=3 or x=-2", "3,-2", "{-2,3}", "x=±3"
 *        values:[] means "no solution" (accepts none / no solution / DNE)
 *   {type:'interval', value:'(-inf,0)u(0,inf)'}  inf/∞/infinity, u/U/∪/union, "all real numbers"
 *        options: acceptInequality:true  (also accept  x<0 or x>0)
 *   {type:'inequality', value:'(-inf,4]', var:'x'}   expects x<=4, 4>=x, 1<x<=3, x<1 or x>2 ...
 *   {type:'point',    value:[2,-3]}              (2,-3)      {type:'pointlist', values:[[0,1],[2,5]]}
 *   {type:'equation', value:'y=2x+1'}            y=1+2x, 2x-y=-1, 2y=4x+2 (same line)
 *        options: form:'slope-intercept'   allowExpression:true (accept just "2x+1")
 *   {type:'choice',   value:'yes'}               yes/y/true, no/n/false, none/DNE/no solution, letters
 *        options: aliases:{ up:['up','upward','opens up'] }
 *   {type:'text',     value:'abc'}               exact match after tidying (the old behaviour)
 *   {anyOf:[spec, spec, ...]}                    right if any one of the specs accepts it
 *
 * READING RULES (worth knowing)
 *   - Implied multiplication is fine: 2x, 3(x+1), (x+1)(x-1), 2sqrt(3), xy.
 *   - 1/2x means (1/2)*x and e^2x means (e^2)*x.  Use brackets: 1/(2x), e^(2x).
 *   - sqrt 3x (or √3x) means sqrt(3)*x; sin 2x means sin(2x).  Brackets remove all doubt.
 *   - log is base 10, ln is natural; log_2(8) works.  sin^2 x and |x| work.
 *   - Letters are case-insensitive.  e and pi are constants unless listed in vars.
 *
 * ALSO
 *   MathCheck.fn('x^2-3x','x')  -> a JavaScript function f(x)   (used by graphkit.js)
 *   MathCheck.toTeX('3x^2/(x+1)') -> TeX string, to show the student how their typing was read
 *
 * Nothing here uses eval or Function on what a student types.  No storage, no dependencies.
 * Tests: Downloads/Site Libraries/tests/  (node run_all.js)
 */
(function (root) {
'use strict';

var MC = { version: '1.0.0' };

/* ══════════════════════════ 1. Tidying text ══════════════════════════ */
var FRACS = {'½':'1/2','⅓':'1/3','⅔':'2/3','¼':'1/4','¾':'3/4','⅕':'1/5','⅖':'2/5','⅗':'3/5','⅘':'4/5','⅙':'1/6','⅚':'5/6','⅛':'1/8','⅜':'3/8','⅝':'5/8','⅞':'7/8'};
var SUPS  = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};

function clean(s) {
  s = String(s == null ? '' : s);
  s = s.replace(/[−–—‐‑﹣－]/g, '-')
       .replace(/[×·⋅∙•]/g, '*').replace(/÷/g, '/').replace(/ /g, ' ')
       .replace(/π/g, ' pi ').replace(/∞/g, ' inf ').replace(/√/g, ' sqrt ')
       .replace(/≤|⩽|=</g, '<=').replace(/≥|⩾|=>/g, '>=').replace(/≠/g, '!=')
       .replace(/\*\*/g, '^').replace(/\+\s*\/\s*-/g, '±').replace(/∪/g, ' u ');
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function (m) {
    return '^(' + m.split('').map(function (c) { return SUPS[c]; }).join('') + ')';
  });
  s = s.replace(/(\d+(?:\.\d+)?)?\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, function (m, d, f) {
    return d ? '(' + d + '+' + FRACS[f] + ')' : '(' + FRACS[f] + ')';
  });
  return s.trim();
}

function Err(msg) { this.mc = true; this.message = msg; }
function fail(msg) { throw new Err(msg); }

/* ══════════════════════════ 2. Tokens ══════════════════════════ */
var FUNCS = ['arcsin','arccos','arctan','asin','acos','atan','sqrt','cbrt','abs','exp','sin','cos','tan','sec','csc','cot','log','ln'];
var WORDS = FUNCS.concat(['infinity','inf','pi']).sort(function (a, b) { return b.length - a.length; });

function tokenize(s, opts) {
  var forced = (opts && opts.vars) || [];
  var out = [], i = 0, n = s.length, m;
  while (i < n) {
    var c = s[i];
    if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
    if ((m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)))) { out.push({k:'num', v:parseFloat(m[1]), raw:m[1]}); i += m[1].length; continue; }
    if (/[a-zA-Z]/.test(c)) {
      m = /^[a-zA-Z]+/.exec(s.slice(i))[0].toLowerCase(); i += m.length;
      var j = 0;
      while (j < m.length) {
        var hit = null;
        for (var w = 0; w < WORDS.length; w++) {
          if (m.substr(j, WORDS[w].length) === WORDS[w] && forced.indexOf(WORDS[w]) < 0) { hit = WORDS[w]; break; }
        }
        if (hit) {
          if (hit === 'pi') out.push({k:'const', v:'pi'});
          else if (hit === 'inf' || hit === 'infinity') out.push({k:'const', v:'inf'});
          else out.push({k:'fn', v: ({arcsin:'asin', arccos:'acos', arctan:'atan'})[hit] || hit});
          j += hit.length;
        } else {
          var ch = m[j];
          if (ch === 'e' && forced.indexOf('e') < 0) out.push({k:'const', v:'e'});
          else out.push({k:'id', v:ch});
          j++;
        }
      }
      continue;
    }
    if ('[{'.indexOf(c) >= 0) { out.push({k:'op', v:'('}); i++; continue; }
    if (']}'.indexOf(c) >= 0) { out.push({k:'op', v:')'}); i++; continue; }
    if ('+-*/^(),|_'.indexOf(c) >= 0) { out.push({k:'op', v:c}); i++; continue; }
    fail('char');
  }
  return out;
}

/* ══════════════════════════ 3. Parser → tree ══════════════════════════ */
function N(t, a, b) { return {t:t, a:a, b:b}; }
function num(v) { return {t:'num', v:v}; }

function Parser(toks) { this.t = toks; this.i = 0; this.abs = 0; }
Parser.prototype.peek = function () { return this.t[this.i]; };
Parser.prototype.isOp = function (v) { var p = this.t[this.i]; return !!p && p.k === 'op' && p.v === v; };
Parser.prototype.eat = function (v) { if (!this.isOp(v)) fail('expected ' + v); this.i++; };
Parser.prototype.startsFactor = function () {
  var p = this.peek(); if (!p) return false;
  if (p.k !== 'op') return true;
  if (p.v === '(') return true;
  if (p.v === '|') return this.abs === 0;
  return false;
};
Parser.prototype.expr = function () {
  var left = this.term();
  while (this.isOp('+') || this.isOp('-')) {
    var op = this.t[this.i++].v, right = this.term();
    left = N(op === '+' ? 'add' : 'sub', left, right);
  }
  return left;
};
Parser.prototype.term = function () {
  var left = this.unary();
  for (;;) {
    if (this.isOp('*')) { this.i++; left = N('mul', left, this.unary()); }
    else if (this.isOp('/')) { this.i++; left = N('div', left, this.unary()); }
    else if (this.startsFactor()) { left = N('mul', left, this.power()); }
    else break;
  }
  return left;
};
Parser.prototype.unary = function () {
  if (this.isOp('-')) { this.i++; return N('neg', this.unary()); }
  if (this.isOp('+')) { this.i++; return this.unary(); }
  return this.power();
};
Parser.prototype.power = function () {
  var base = this.atom();
  if (this.isOp('^')) { this.i++; return N('pow', base, this.unary()); }
  return base;
};
Parser.prototype.atom = function () {
  var p = this.peek();
  if (!p) fail('end');
  if (p.k === 'num') { this.i++; return num(p.v); }
  if (p.k === 'const') { this.i++; return {t:'const', n:p.v}; }
  if (p.k === 'id') { this.i++; return {t:'var', n:p.v}; }
  if (p.k === 'fn') {
    this.i++;
    var name = p.v, pw = null, base = null, arg;
    if (name === 'log' && this.isOp('_')) { this.i++; base = this.atom(); }
    if (this.isOp('^')) {                       // sin^2 x   or   sin^-1 x
      this.i++;
      var neg = false; if (this.isOp('-')) { neg = true; this.i++; }
      var q = this.peek(); if (!q || q.k !== 'num') fail('fn power'); this.i++;
      pw = neg ? -q.v : q.v;
    }
    if (this.isOp('(')) { this.i++; arg = this.expr(); this.eat(')'); }
    else if (this.isOp('|')) { arg = this.atom(); }
    else {
      var q2 = this.peek();
      if (!q2 || (q2.k !== 'num' && q2.k !== 'id' && q2.k !== 'const')) fail('fn arg');
      arg = this.power();
      for (;;) {
        if (name === 'sqrt' || name === 'cbrt') break;      // √3x means (√3)·x; write sqrt(3x) for the other meaning
        var r = this.peek();
        if (r && (r.k === 'num' || r.k === 'id' || r.k === 'const')) arg = N('mul', arg, this.power());
        else break;
      }
    }
    var node;
    if (pw === -1 && (name === 'sin' || name === 'cos' || name === 'tan')) { node = {t:'fn', n:'a' + name, a:arg}; pw = null; }
    else if (base) node = {t:'logb', a:arg, b:base};
    else node = {t:'fn', n:name, a:arg};
    return pw === null ? node : N('pow', node, num(pw));
  }
  if (p.v === '(') { this.i++; var e = this.expr(); this.eat(')'); return e; }
  if (p.v === '|' && this.abs === 0) {
    this.i++; this.abs++; var inner = this.expr(); this.abs--; this.eat('|');
    return {t:'fn', n:'abs', a:inner};
  }
  fail('atom');
};

function parse(str, opts) {
  var s = clean(str);
  if (!s) fail('empty');
  var p = new Parser(tokenize(s, opts));
  var ast = p.expr();
  if (p.i < p.t.length) fail('extra');
  return ast;
}

/* ══════════════════════════ 4. Evaluating a tree ══════════════════════════ */
function realPow(b, e) {
  if (b >= 0) return Math.pow(b, e);
  if (Math.abs(e - Math.round(e)) < 1e-12) return Math.pow(b, Math.round(e));
  for (var q = 3; q <= 15; q += 2) {            // odd roots of negatives: (-8)^(1/3) = -2
    var pq = e * q;
    if (Math.abs(pq - Math.round(pq)) < 1e-9) {
      var r = Math.pow(-b, e);
      return (Math.abs(Math.round(pq)) % 2 === 1) ? -r : r;
    }
  }
  return NaN;
}
var FN = {
  sqrt: function (x) { return x < 0 ? NaN : Math.sqrt(x); },
  cbrt: function (x) { return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3); },
  abs: Math.abs, exp: Math.exp,
  ln:  function (x) { return x <= 0 ? NaN : Math.log(x); },
  log: function (x) { return x <= 0 ? NaN : Math.log(x) / Math.LN10; },
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  sec: function (x) { return 1 / Math.cos(x); }, csc: function (x) { return 1 / Math.sin(x); },
  cot: function (x) { return Math.cos(x) / Math.sin(x); },
  asin: function (x) { return Math.abs(x) > 1 ? NaN : Math.asin(x); },
  acos: function (x) { return Math.abs(x) > 1 ? NaN : Math.acos(x); },
  atan: Math.atan
};
function ev(n, env) {
  switch (n.t) {
    case 'num': return n.v;
    case 'const': return n.n === 'pi' ? Math.PI : n.n === 'e' ? Math.E : Infinity;
    case 'var': return (env && n.n in env) ? env[n.n] : NaN;
    case 'neg': return -ev(n.a, env);
    case 'add': return ev(n.a, env) + ev(n.b, env);
    case 'sub': return ev(n.a, env) - ev(n.b, env);
    case 'mul': return ev(n.a, env) * ev(n.b, env);
    case 'div': var d = ev(n.b, env); return d === 0 ? NaN : ev(n.a, env) / d;
    case 'pow': return realPow(ev(n.a, env), ev(n.b, env));
    case 'fn':  return FN[n.n](ev(n.a, env));
    case 'logb': var x = ev(n.a, env), bb = ev(n.b, env); return (x <= 0 || bb <= 0 || bb === 1) ? NaN : Math.log(x) / Math.log(bb);
  }
  return NaN;
}
function varsOf(n, acc) {
  acc = acc || {};
  if (!n) return acc;
  if (n.t === 'var') acc[n.n] = 1;
  if (n.a) varsOf(n.a, acc);
  if (n.b) varsOf(n.b, acc);
  return acc;
}
function hasVar(n) { for (var k in varsOf(n)) return true; return false; }
function rename(n, from, to) {
  if (!n) return n;
  if (n.t === 'var') return {t:'var', n: n.n === from ? to : n.n};
  var o = {t:n.t}; if ('v' in n) o.v = n.v; if ('n' in n) o.n = n.n;
  if (n.a) o.a = rename(n.a, from, to); if (n.b) o.b = rename(n.b, from, to);
  return o;
}

/* ══════════════════════════ 5. "Are these equal?" by sampling ══════════════════════════ */
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
var RANGES = [[-4.3, 4.7], [0.15, 3.9], [1.05, 7.3], [-2.9, -0.12], [0.02, 0.98], [-9.5, 9.5]];
function close(x, y, tol) { return Math.abs(x - y) <= (tol || 1e-7) * Math.max(1, Math.abs(x), Math.abs(y)); }

function samplePoints(names, count, seed) {
  var r = rng(seed || 20261111), pts = [];
  for (var i = 0; i < count; i++) {
    var env = {}, rg = RANGES[i % RANGES.length];
    for (var j = 0; j < names.length; j++) env[names[j]] = rg[0] + (rg[1] - rg[0]) * r();
    pts.push(env);
  }
  return pts;
}
/* returns {eq:bool, valid:int}   strict = a point where only one side is defined counts as a mismatch */
function equivalent(a, b, strict, extraEnv) {
  var vs = varsOf(a); varsOf(b, vs);
  var names = Object.keys(vs).sort();
  if (!names.length) {
    var x = ev(a, {}), y = ev(b, {});
    if (!isFinite(x) || !isFinite(y)) return {eq: x === y && !isNaN(x), valid: 0};
    return {eq: close(x, y, 1e-9), valid: 1};
  }
  var pts = samplePoints(names, 90), valid = 0, need = 8;
  for (var i = 0; i < pts.length && valid < 24; i++) {
    var env = pts[i]; if (extraEnv) for (var k in extraEnv) env[k] = extraEnv[k];
    var p = ev(a, env), q = ev(b, env), fp = isFinite(p), fq = isFinite(q);
    if (!fp && !fq) continue;
    if (fp !== fq) { if (strict) return {eq:false, valid:valid}; continue; }
    if (Math.abs(p) > 1e9 || Math.abs(q) > 1e9) continue;
    if (!close(p, q)) return {eq:false, valid:valid};
    valid++;
  }
  return {eq: valid >= need, valid: valid};
}

/* ══════════════════════════ 6. Polynomials (for form checks) ══════════════════════════ */
function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = a % b; a = b; b = t; } return a; }
function trim(p) { p = p.slice(); while (p.length > 1 && Math.abs(p[p.length - 1]) < 1e-10) p.pop(); return p; }
function pAdd(a, b, s) { var o = []; for (var i = 0; i < Math.max(a.length, b.length); i++) o.push((a[i] || 0) + (s || 1) * (b[i] || 0)); return o; }
function pMul(a, b) { if (a.length + b.length > 80) return null; var o = []; for (var i = 0; i < a.length + b.length - 1; i++) o.push(0); for (i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) o[i + j] += a[i] * b[j]; return o; }
function toPoly(n, v) {
  var a, b;
  switch (n.t) {
    case 'num': return [n.v];
    case 'const': return n.n === 'inf' ? null : [ev(n)];
    case 'var': return n.n === v ? [0, 1] : null;
    case 'neg': a = toPoly(n.a, v); return a && a.map(function (c) { return -c; });
    case 'add': case 'sub': a = toPoly(n.a, v); b = toPoly(n.b, v); return a && b && pAdd(a, b, n.t === 'sub' ? -1 : 1);
    case 'mul': a = toPoly(n.a, v); b = toPoly(n.b, v); return a && b && pMul(a, b);
    case 'div': a = toPoly(n.a, v); b = toPoly(n.b, v); if (!a || !b) return null; b = trim(b);
      return (b.length === 1 && Math.abs(b[0]) > 1e-12) ? a.map(function (c) { return c / b[0]; }) : null;
    case 'pow':
      if (hasVar(n.b)) return null;
      var e = ev(n.b); if (!isInt(e) || e < 0 || e > 30) { if (!hasVar(n.a)) { var cv = ev(n, {}); return isFinite(cv) ? [cv] : null; } return null; }
      a = toPoly(n.a, v); if (!a) return null;
      var o = [1]; for (var i = 0; i < Math.round(e); i++) { o = pMul(o, a); if (!o) return null; }
      return o;
    default:
      if (hasVar(n)) return null; var c0 = ev(n, {}); return isFinite(c0) ? [c0] : null;
  }
}
function toRat(n, v) {                         // rational function {n:poly, d:poly} or null
  var a, b, o;
  switch (n.t) {
    case 'neg': a = toRat(n.a, v); return a && {n: a.n.map(function (c) { return -c; }), d: a.d};
    case 'add': case 'sub': a = toRat(n.a, v); b = toRat(n.b, v); if (!a || !b) return null;
      var x = pMul(a.n, b.d), y = pMul(b.n, a.d), d = pMul(a.d, b.d); return x && y && d && {n: pAdd(x, y, n.t === 'sub' ? -1 : 1), d: d};
    case 'mul': a = toRat(n.a, v); b = toRat(n.b, v); if (!a || !b) return null; o = {n: pMul(a.n, b.n), d: pMul(a.d, b.d)}; return o.n && o.d && o;
    case 'div': a = toRat(n.a, v); b = toRat(n.b, v); if (!a || !b) return null; o = {n: pMul(a.n, b.d), d: pMul(a.d, b.n)}; return o.n && o.d && o;
    case 'pow':
      if (hasVar(n.b)) return null; var e = ev(n.b); if (!isInt(e) || Math.abs(e) > 20) return null;
      a = toRat(n.a, v); if (!a) return null; o = {n:[1], d:[1]};
      for (var i = 0; i < Math.abs(Math.round(e)); i++) { o = {n: pMul(o.n, a.n), d: pMul(o.d, a.d)}; if (!o.n || !o.d) return null; }
      return e < 0 ? {n: o.d, d: o.n} : o;
    default: a = toPoly(n, v); return a && {n: a, d: [1]};
  }
}
function pDivRem(a, b) { a = trim(a); b = trim(b); var r = a.slice(); while (r.length >= b.length && !(r.length === 1 && Math.abs(r[0]) < 1e-9)) { var f = r[r.length - 1] / b[b.length - 1], s = r.length - b.length; for (var i = 0; i < b.length; i++) r[i + s] -= f * b[i]; r.pop(); if (!r.length) { r = [0]; break; } } return trim(r); }
function pGcdDeg(a, b) {
  a = trim(a); b = trim(b);
  for (var guard = 0; guard < 80; guard++) {
    var scale = Math.max.apply(null, b.map(Math.abs));
    if (b.length === 1 && scale < 1e-7) return a.length - 1;
    if (b.length === 1) return 0;
    var r = pDivRem(a, b), rs = Math.max.apply(null, r.map(Math.abs)), as = Math.max.apply(null, a.map(Math.abs));
    if (rs < 1e-7 * Math.max(1, as)) return b.length - 1;
    a = b; b = r.map(function (c) { return c / rs; });
  }
  return 0;
}
function hasRationalRoot(p) {                  // integer-coefficient poly
  var a0 = Math.abs(Math.round(p[0])), an = Math.abs(Math.round(p[p.length - 1]));
  if (a0 === 0) return true;
  if (a0 > 5000 || an > 5000) return false;
  function val(x) { var s = 0; for (var i = p.length - 1; i >= 0; i--) s = s * x + p[i]; return s; }
  for (var q = 1; q <= an; q++) { if (an % q) continue;
    for (var pp = 1; pp <= a0; pp++) { if (a0 % pp) continue;
      var x = pp / q; if (Math.abs(val(x)) < 1e-7 * Math.max(1, Math.pow(Math.abs(x), p.length - 1) * an) || Math.abs(val(-x)) < 1e-7 * Math.max(1, Math.pow(Math.abs(x), p.length - 1) * an)) return true; } }
  return false;
}

function hasQuadFactor(p) {                    // integer poly of degree >= 4: is there a factor d x^2 + a x + b ?
  var a0 = Math.abs(Math.round(p[0])), an = Math.abs(Math.round(p[p.length - 1])), big = 0;
  p.forEach(function (c) { big += Math.abs(c); });
  if (!a0 || a0 > 3000 || an > 3000 || p.length > 9) return false;
  var A = Math.min(60, Math.round(big));
  for (var d = 1; d <= an; d++) { if (an % d) continue;
    for (var bb = 1; bb <= a0; bb++) { if (a0 % bb) continue;
      for (var sg = -1; sg <= 1; sg += 2) for (var a = -A; a <= A; a++) {
        var q = [sg * bb, a, d], r = pDivRem(p, q);
        if (r.length === 1 && Math.abs(r[0]) < 1e-6 || r.every(function (c) { return Math.abs(c) < 1e-6; })) return true;
      } } }
  return false;
}
/* split a tree into  coef * base1^e1 * base2^e2 ...  */
function flatten(n, exp, out) {
  if (!hasVar(n)) { out.coef *= Math.pow(ev(n, {}), exp); return out; }
  switch (n.t) {
    case 'neg': out.coef *= (Math.abs(exp) % 2 ? -1 : 1); return flatten(n.a, exp, out);
    case 'mul': flatten(n.a, exp, out); return flatten(n.b, exp, out);
    case 'div': flatten(n.a, exp, out); return flatten(n.b, -exp, out);
    case 'pow':
      if (!hasVar(n.b)) { var k = ev(n.b, {}); if (isInt(k) && Math.round(k) !== 0) return flatten(n.a, exp * Math.round(k), out); }
      out.fs.push({b:n, e:exp}); return out;
    default: out.fs.push({b:n, e:exp}); return out;
  }
}
function flat(n) { return flatten(n, 1, {coef:1, fs:[]}); }
function factorCount(f) { var c = 0; f.fs.forEach(function (x) { c += Math.abs(x.e); }); return c; }

function checkFactored(u, expd) {              // returns '' if fine, else a reason code
  var f = flat(u), unverifiable = false, single = (f.fs.length === 1 && Math.abs(f.fs[0].e) === 1);
  for (var i = 0; i < f.fs.length; i++) {
    var b = f.fs[i].b; if (b.t === 'var') continue;
    var vs = Object.keys(varsOf(b));
    var p = vs.length === 1 ? toPoly(b, vs[0]) : null;
    if (!p) { if (b.t === 'add' || b.t === 'sub') unverifiable = true; continue; }
    p = trim(p); var deg = p.length - 1; if (deg <= 0) continue;
    var allInt = p.every(isInt);
    if (allInt) { var g = 0; p.forEach(function (c) { g = gcd(g, c); }); if (g > 1) return single && deg > 1 ? 'notfactored' : 'common'; }
    if (deg >= 2 && Math.abs(p[0]) < 1e-10) return single ? 'notfactored' : 'further';
    if (allInt && deg === 2) { var disc = p[1] * p[1] - 4 * p[2] * p[0]; if (disc >= 0 && isInt(Math.sqrt(disc))) return single ? 'notfactored' : 'further'; }
    if (allInt && deg >= 3 && hasRationalRoot(p)) return single ? 'notfactored' : 'further';
    if (allInt && deg >= 4 && hasQuadFactor(p)) return single ? 'notfactored' : 'further';
  }
  if (unverifiable && expd) { var cu = factorCount(f), ce = factorCount(flat(expd)); if (cu < ce) return cu <= 1 ? 'notfactored' : 'further'; }
  return '';
}
function containsSum(n) {                      // an add/sub that is not hidden inside a function or exponent
  if (!n) return false;
  if (n.t === 'add' || n.t === 'sub') return true;
  if (n.t === 'fn' || n.t === 'logb' || n.t === 'num' || n.t === 'var' || n.t === 'const') return false;
  if (n.t === 'pow') return containsSum(n.a);
  return containsSum(n.a) || containsSum(n.b);
}
function termsOf(n, sign, out) {
  if (n.t === 'add') { termsOf(n.a, sign, out); termsOf(n.b, sign, out); }
  else if (n.t === 'sub') { termsOf(n.a, sign, out); termsOf(n.b, -sign, out); }
  else out.push(n);
  return out;
}
function checkExpanded(u) {
  var bad = false;
  (function walk(n) {
    if (!n || bad) return;
    if (n.t === 'mul' && (containsSum(n.a) || containsSum(n.b)) && hasVar(n)) { bad = true; return; }
    if (n.t === 'pow' && containsSum(n.a) && hasVar(n.a) && !hasVar(n.b)) { var e = ev(n.b, {}); if (isInt(e) && e >= 2) { bad = true; return; } }
    if (n.t === 'div' && containsSum(n.a) && hasVar(n.b)) { /* rational: leave alone */ }
    if (n.t === 'fn' || n.t === 'logb') return;
    walk(n.a); walk(n.b);
  })(u);
  if (bad) return 'notexpanded';
  var seen = {}, dup = false;
  termsOf(u, 1, []).forEach(function (t) {
    var f = flat(t), sig = [], okk = true;
    f.fs.forEach(function (x) { if (x.b.t === 'var') sig.push(x.b.n + '^' + x.e); else okk = false; });
    if (!okk) return;
    var key = sig.sort().join('*'); var m = {}; sig = [];
    f.fs.forEach(function (x) { m[x.b.n] = (m[x.b.n] || 0) + x.e; });
    key = Object.keys(m).sort().map(function (k) { return k + '^' + m[k]; }).join('*');
    if (seen[key]) dup = true; seen[key] = 1;
  });
  return dup ? 'liketerms' : '';
}
function checkSimplified(u) {                  // fractions reduced, radicals simplified, like terms combined, common factors cancelled
  var why = '';
  (function walk(n) {
    if (!n || why) return;
    if (n.t === 'div') {
      var na = n.a, nb = n.b;
      while (na.t === 'neg') na = na.a;
      while (nb.t === 'neg') nb = nb.a;
      if (na.t === 'num' && nb.t === 'num' && isInt(na.v) && isInt(nb.v) && (Math.round(nb.v) === 1 || gcd(na.v, nb.v) > 1)) { why = 'reduce'; return; }
      if (nb.t === 'num' && isInt(nb.v) && nb.v > 1 && na.t === 'mul') {        // 2pi/6, 6sqrt(3)/3 : integer coefficient shares a factor with the denominator
        var cf = 1; (function ic(m) { while (m.t === 'neg') m = m.a; if (m.t === 'mul') { ic(m.a); ic(m.b); } else if (m.t === 'num' && isInt(m.v)) cf *= Math.abs(Math.round(m.v)); })(na);
        if (cf > 1 && gcd(cf, Math.round(nb.v)) > 1) { why = 'reduce'; return; }
      }
    }
    if (n.t === 'fn' && n.n === 'sqrt' && n.a.t === 'num' && isInt(n.a.v) && n.a.v >= 0) {
      var v = Math.round(n.a.v);
      for (var k = 2; k * k <= v; k++) if (v % (k * k) === 0) { why = 'radical'; return; }
      if (v === 0 || v === 1) { why = 'radical'; return; }
    }
    walk(n.a); walk(n.b);
  })(u);
  if (why) return why;
  var vs = Object.keys(varsOf(u));
  if (vs.length === 1) {
    var poly = toPoly(u, vs[0]);
    if (poly) return checkExpanded(u) === 'liketerms' ? 'liketerms' : '';
    var r = toRat(u, vs[0]);
    if (r && trim(r.d).length > 1 && pGcdDeg(r.n, r.d) >= 1) return 'cancel';
  }
  return checkExpanded(u) === 'liketerms' ? 'liketerms' : '';
}

/* ══════════════════════════ 7. Small readers shared by several types ══════════════════════════ */
function splitTop(s, sepRe) {                  // split on separators that are outside brackets
  var out = [], depth = 0, cur = '';
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if ('([{'.indexOf(c) >= 0) depth++;
    if (')]}'.indexOf(c) >= 0) depth--;
    if (depth === 0 && sepRe.test(c)) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out;
}
function readValue(str, opts) {                // -> {v:number} or {ast:tree}
  var s = clean(str), m;
  if (!s) fail('empty');
  if ((m = /^([+-]?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s))) {
    var val = (+m[2]) + (+m[3]) / (+m[4]); return {v: m[1] === '-' ? -val : val, mixed: true};
  }
  var ast = parse(s, opts);
  if (hasVar(ast)) return {ast: ast};
  var v = ev(ast, {});
  if (isNaN(v)) fail('nan');
  return {v: v, ast: ast};
}
function sameValue(a, b, tol) {
  if ('v' in a && 'v' in b) {
    if (!isFinite(a.v) || !isFinite(b.v)) return a.v === b.v;
    return tol != null ? Math.abs(a.v - b.v) <= tol + 1e-12 : close(a.v, b.v, 1e-9);
  }
  if (a.ast && b.ast) return equivalent(a.ast, b.ast, false).eq;
  return false;
}
function asValue(x, opts) { return typeof x === 'number' ? {v:x} : readValue(String(x), opts); }

var NONE_RE = /^(none|no\s*(real\s*)?solutions?|dne|does\s*not\s*exist|undefined|n\/?a|∅|ø|empty(\s*set)?|\(\s*\)|no\s*answer)$/;

/* ══════════════════════════ 8. The answer types ══════════════════════════ */
var REASONS = {
  unreadable: "I couldn't read that. Check for a missing bracket or symbol.",
  empty: 'Type an answer first.',
  notfactored: "That is equal to the answer, but it isn't factored yet.",
  further: 'Close: that can be factored further.',
  common: 'Close: there is still a common number you can factor out.',
  notexpanded: 'That is equal to the answer, but multiply it out.',
  liketerms: 'That is equal to the answer, but combine like terms.',
  reduce: 'Right value, but reduce the fraction.',
  radical: 'Right value, but simplify the radical.',
  cancel: 'That is equal to the answer, but it can be simplified further.',
  exact: 'Give the exact value, not a rounded decimal.',
  needEquation: 'The question wants an equation (with an = sign).',
  noEquals: 'Just the expression here, without an = sign.',
  slopeForm: 'Right line, but write it in the form y = ...',
  plusC: "Don't forget the constant of integration.",
  brackets: 'The numbers look right. Check your brackets: [ ] versus ( ).',
  infBracket: 'Infinity always gets a round bracket.',
  order: 'Write the smaller number first.',
  needInterval: 'Write this in interval notation.',
  needInequality: 'Write this as an inequality.',
  missing: 'What you have is right so far, but there is more to the answer.',
  extra: 'One of the values you listed is not part of the answer.',
  swapped: 'Check the order of your coordinates.',
  needPoint: 'Write this as an ordered pair, like (x, y).'
};
function R(okk, code) { return okk ? {ok:true} : {ok:false, code:code || '', reason: REASONS[code] || ''}; }

function checkNumber(user, spec) {
  var target = asValue(spec.value, spec), u = readValue(user, spec);
  if (u.ast && !('v' in u)) return R(false);
  if (!sameValue(u, target, spec.tol)) return R(false);
  if (spec.exact && /\d\.\d|\.\d/.test(clean(user))) {
    var typed = parseFloat(clean(user)); if (!(isFinite(typed) && Math.abs(typed - target.v) < 1e-12)) return R(false, 'exact');
  }
  if (spec.form === 'simplified' && u.ast) { var why = checkSimplified(u.ast); if (why) return R(false, why); }
  if (spec.form === 'simplified' && u.mixed) { var mm = /(\d+)\s*\/\s*(\d+)$/.exec(clean(user)); if (mm && gcd(+mm[1], +mm[2]) > 1) return R(false, 'reduce'); }
  return R(true);
}

var PREFIX_RE = /^\s*(?:[a-zA-Z]\s*'*\s*(?:\(\s*[a-zA-Z]\s*\))?|d[a-zA-Z]\s*\/\s*d[a-zA-Z])\s*=(?!=)/;
function countEquals(s) { return (s.replace(/<=|>=|!=/g, '').match(/=/g) || []).length; }

function checkExpr(user, spec) {
  var us = clean(user);
  if (countEquals(us)) { us = us.replace(PREFIX_RE, ''); if (countEquals(us)) return R(false, 'noEquals'); }
  var u = parse(us, spec), e = parse(String(spec.value).replace(PREFIX_RE, ''), spec);
  var form = spec.form || (spec.mode !== 'equivalent' && spec.mode !== 'form' ? spec.mode : null);
  if (spec.plusC) {
    var ev_ = varsOf(e), uv = varsOf(u), extra = Object.keys(uv).filter(function (k) { return !(k in ev_); });
    if (!('c' in uv) && extra.length === 1) u = rename(u, extra[0], 'c');
    if (!('c' in varsOf(u))) {
      return R(false, equivalent(u, e, false, {c:0}).eq ? 'plusC' : '');
    }
  }
  var eq = equivalent(u, e, spec.domain === 'strict');
  if (!eq.eq) return R(false);
  var why = '';
  if (form === 'factored') why = checkFactored(u, e);
  else if (form === 'expanded') why = checkExpanded(u);
  else if (form === 'simplified') why = checkSimplified(u);
  return why ? R(false, why) : R(true);
}

function readSet(user, spec) {
  var s = clean(user).toLowerCase().replace(/^\s*\{([\s\S]*)\}\s*$/, '$1').trim();
  if (!s || NONE_RE.test(s)) return [];
  s = s.replace(/\b(or|and)\b/g, ',');
  var parts = splitTop(s, /[,;]/), out = [];
  parts.forEach(function (p) {
    p = p.trim(); if (!p) return;
    p = p.replace(/^[a-z](?:_?\d+)?\s*=\s*/, '');
    p = p.replace(/^\+-/, '±');
    if (p.indexOf('±') >= 0) { out.push(readValue(p.replace('±', '+'), spec)); out.push(readValue(p.replace('±', '-'), spec)); }
    else out.push(readValue(p, spec));
  });
  return out;
}
function checkSet(user, spec) {
  var got = readSet(user, spec), want = (spec.values || []).map(function (x) { return asValue(x, spec); });
  var uniq = [];
  got.forEach(function (g) { if (!uniq.some(function (h) { return sameValue(g, h, spec.tol); })) uniq.push(g); });
  var used = uniq.map(function () { return false; }), matched = 0;
  want.forEach(function (w) {
    for (var i = 0; i < uniq.length; i++) if (!used[i] && sameValue(uniq[i], w, spec.tol)) { used[i] = true; matched++; return; }
  });
  var extras = used.filter(function (x) { return !x; }).length;
  if (matched === want.length && !extras) return R(true);
  if (extras && matched === want.length) return R(false, 'extra');
  if (!extras && matched < want.length && matched > 0) return R(false, 'missing');
  return R(false);
}

/* ---- intervals ---- */
function readEndpoint(s, spec) {
  s = s.trim().toLowerCase();
  if (/^\+?\s*(inf|infinity|oo)$/.test(s)) return Infinity;
  if (/^-\s*(inf|infinity|oo)$/.test(s)) return -Infinity;
  var v = readValue(s, spec); if (!('v' in v)) fail('endpoint'); return v.v;
}
function readIntervals(user, spec) {           // -> {pieces:[{lo,hi,lc,hc}], flag}
  var s = clean(user).toLowerCase().replace(/\s+/g, ' ').trim();
  if (!s) fail('empty');
  if (/^(all real numbers|all reals|all real|r|ℝ|reals|\(-\s*(inf|infinity|oo)\s*,\s*\+?\s*(inf|infinity|oo)\))$/.test(s)) return {pieces:[{lo:-Infinity, hi:Infinity, lc:false, hc:false}]};
  if (NONE_RE.test(s) || s === '{}' || s === '{ }') return {pieces:[]};
  s = s.replace(/\bunion\b/g, 'u').replace(/\bor\b/g, 'u');
  var pieces = [], flag = '', i = 0, n = s.length;
  while (i < n) {
    var c = s[i];
    if (c === ' ' || c === 'u' || c === ',') { i++; continue; }
    if (c === '{') {                            // single points {a} or {a,b}
      var j = s.indexOf('}', i); if (j < 0) fail('brace');
      s.slice(i + 1, j).split(',').forEach(function (t) { var v = readEndpoint(t, spec); pieces.push({lo:v, hi:v, lc:true, hc:true}); });
      i = j + 1; continue;
    }
    if (c !== '(' && c !== '[') fail('interval');
    var depth = 0, k = i;
    for (; k < n; k++) { if ('(['.indexOf(s[k]) >= 0) depth++; if (')]'.indexOf(s[k]) >= 0) { depth--; if (depth === 0) break; } }
    if (k >= n) fail('interval');
    var inner = splitTop(s.slice(i + 1, k), /,/);
    if (inner.length !== 2) fail('interval');
    var lo = readEndpoint(inner[0], spec), hi = readEndpoint(inner[1], spec), lc = c === '[', hc = s[k] === ']';
    if ((!isFinite(lo) && lc) || (!isFinite(hi) && hc)) flag = flag || 'infBracket';
    if (lo > hi) flag = flag || 'order';
    pieces.push({lo:lo, hi:hi, lc:lc, hc:hc});
    i = k + 1;
  }
  if (!pieces.length) fail('interval');
  return {pieces:pieces, flag:flag};
}
function mergePieces(ps) {
  ps = ps.filter(function (p) { return p.lo < p.hi || (p.lo === p.hi && p.lc && p.hc); })
         .map(function (p) { return {lo:p.lo, hi:p.hi, lc:p.lc, hc:p.hc}; })
         .sort(function (a, b) { return a.lo - b.lo || (a.lc === b.lc ? 0 : a.lc ? -1 : 1); });
  var out = [];
  ps.forEach(function (p) {
    var q = out[out.length - 1];
    if (q && (p.lo < q.hi || (p.lo === q.hi && (p.lc || q.hc)))) {
      if (p.lo === q.lo && p.lc) q.lc = true;
      if (p.hi > q.hi) { q.hi = p.hi; q.hc = p.hc; } else if (p.hi === q.hi && p.hc) q.hc = true;
    } else out.push(p);
  });
  return out;
}
function sameEnd(a, b) { return (!isFinite(a) || !isFinite(b)) ? a === b : close(a, b, 1e-9); }
function comparePieces(a, b) {                 // 'same' | 'brackets' | 'diff'
  if (a.length !== b.length) return 'diff';
  var br = false;
  for (var i = 0; i < a.length; i++) {
    if (!sameEnd(a[i].lo, b[i].lo) || !sameEnd(a[i].hi, b[i].hi)) return 'diff';
    if (a[i].lc !== b[i].lc || a[i].hc !== b[i].hc) br = true;
  }
  return br ? 'brackets' : 'same';
}
function intersect(a, b) {
  var out = [];
  a.forEach(function (p) { b.forEach(function (q) {
    var lo = Math.max(p.lo, q.lo), hi = Math.min(p.hi, q.hi);
    var lc = (p.lo > q.lo ? p.lc : q.lo > p.lo ? q.lc : p.lc && q.lc), hc = (p.hi < q.hi ? p.hc : q.hi < p.hi ? q.hc : p.hc && q.hc);
    if (lo < hi || (lo === hi && lc && hc)) out.push({lo:lo, hi:hi, lc:lc, hc:hc});
  }); });
  return out;
}
function readInequality(user, spec) {          // -> pieces, or throws
  var v = (spec.var || 'x').toLowerCase();
  var s = clean(user).toLowerCase().replace(/\s+/g, ' ').trim();
  if (!s) fail('empty');
  if (/^(all real numbers|all reals|all real|r|ℝ|reals)$/.test(s)) return [{lo:-Infinity, hi:Infinity, lc:false, hc:false}];
  if (NONE_RE.test(s)) return [];
  if (!/[<>]|!=/.test(s)) fail('noineq');
  function clause(c) {
    var parts = c.split(/(<=|>=|!=|<|>)/).map(function (t) { return t.trim(); });
    function isVar(t) { return t === v; }
    function val(t) { var q = readValue(t, spec); if (!('v' in q)) fail('ineq'); return q.v; }
    function half(left, op, right) {            // returns pieces for  left op right  with one side the variable
      var flip = {'<':'>', '>':'<', '<=':'>=', '>=':'<=', '!=':'!='};
      if (!isVar(left)) { if (!isVar(right)) fail('ineq'); var t = left; left = right; right = t; op = flip[op]; }
      var a = val(right);
      if (op === '<')  return [{lo:-Infinity, hi:a, lc:false, hc:false}];
      if (op === '<=') return [{lo:-Infinity, hi:a, lc:false, hc:true}];
      if (op === '>')  return [{lo:a, hi:Infinity, lc:false, hc:false}];
      if (op === '>=') return [{lo:a, hi:Infinity, lc:true, hc:false}];
      return [{lo:-Infinity, hi:a, lc:false, hc:false}, {lo:a, hi:Infinity, lc:false, hc:false}];
    }
    if (parts.length === 3) return half(parts[0], parts[1], parts[2]);
    if (parts.length === 5) return intersect(half(parts[0], parts[1], parts[2]), half(parts[2], parts[3], parts[4]));
    fail('ineq');
  }
  var all = [];
  s.split(/\bor\b|,|\bu\b/).forEach(function (grp) {
    grp = grp.trim(); if (!grp) return;
    var acc = null;
    grp.split(/\band\b/).forEach(function (c) { var ps = clause(c.trim()); acc = acc ? intersect(acc, ps) : ps; });
    all = all.concat(acc || []);
  });
  return all;
}
function targetPieces(spec) { return mergePieces(readIntervals(String(spec.value), spec).pieces); }
function checkInterval(user, spec) {
  var want = targetPieces(spec), got;
  try { got = readIntervals(user, spec); }
  catch (e) {
    if (!e.mc) throw e;
    var alt; try { alt = mergePieces(readInequality(user, spec)); } catch (e2) { if (!e2.mc) throw e2; throw e; }
    if (comparePieces(alt, want) !== 'same') return R(false, spec.acceptInequality ? '' : 'needInterval');
    return spec.acceptInequality ? R(true) : R(false, 'needInterval');
  }
  if (got.flag) return R(false, got.flag);
  var cmp = comparePieces(mergePieces(got.pieces), want);
  return cmp === 'same' ? R(true) : R(false, cmp === 'brackets' ? 'brackets' : '');
}
function checkInequality(user, spec) {
  var want = targetPieces(spec), got;
  try { got = mergePieces(readInequality(user, spec)); }
  catch (e) {
    if (!e.mc) throw e;
    if (e.message === 'noineq') {
      try { var iv = readIntervals(user, spec); if (comparePieces(mergePieces(iv.pieces), want) === 'same') return spec.acceptInterval ? R(true) : R(false, 'needInequality'); } catch (e2) { if (!e2.mc) throw e2; }
      return R(false, 'needInequality');
    }
    throw e;
  }
  return R(comparePieces(got, want) === 'same');
}

/* ---- points ---- */
function readPointGroups(user) {
  var s = clean(user), groups = [], depth = 0, start = -1;
  for (var i = 0; i < s.length; i++) {
    if (s[i] === '(') { if (depth === 0) start = i; depth++; }
    else if (s[i] === ')') { depth--; if (depth === 0 && start >= 0) { groups.push(s.slice(start + 1, i)); start = -1; } if (depth < 0) fail('paren'); }
  }
  if (depth !== 0) fail('paren');
  return groups;
}
function readPoint(inner, spec) { return splitTop(inner, /,/).map(function (t) { var v = readValue(t, spec); return v; }); }
function samePoint(a, b, tol) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (!sameValue(a[i], b[i], tol)) return false; return true; }
function checkPoint(user, spec) {
  var want = spec.value.map(function (x) { return asValue(x, spec); });
  var s = clean(user), groups = readPointGroups(s), got;
  if (groups.length === 1 && /^\s*\(/.test(s) && /\)\s*$/.test(s) && splitTop(groups[0], /,/).length > 1) got = readPoint(groups[0], spec);
  else if (!spec.strict && splitTop(s, /,/).length === want.length) got = readPoint(s, spec);
  else return R(false, 'needPoint');
  if (samePoint(got, want, spec.tol)) return R(true);
  if (got.length === 2 && samePoint([got[1], got[0]], want, spec.tol) && !samePoint(got, [want[1], want[0]].reverse(), spec.tol)) return R(false, 'swapped');
  return R(false);
}
function checkPointList(user, spec) {
  var want = (spec.values || []).map(function (p) { return p.map(function (x) { return asValue(x, spec); }); });
  var s = clean(user).toLowerCase();
  if (!want.length) return R(NONE_RE.test(s.trim()));
  var got = readPointGroups(s).filter(function (g) { return splitTop(g, /,/).length > 1; }).map(function (g) { return readPoint(g, spec); });
  if (!got.length) return R(false, 'needPoint');
  var uniq = [];
  got.forEach(function (g) { if (!uniq.some(function (h) { return samePoint(g, h, spec.tol); })) uniq.push(g); });
  if (spec.ordered) { if (uniq.length !== want.length) return R(false); for (var i = 0; i < want.length; i++) if (!samePoint(uniq[i], want[i], spec.tol)) return R(false); return R(true); }
  var used = uniq.map(function () { return false; }), matched = 0;
  want.forEach(function (w) { for (var i = 0; i < uniq.length; i++) if (!used[i] && samePoint(uniq[i], w, spec.tol)) { used[i] = true; matched++; return; } });
  var extras = used.filter(function (x) { return !x; }).length;
  if (matched === want.length && !extras) return R(true);
  if (extras && matched === want.length) return R(false, 'extra');
  if (!extras && matched > 0) return R(false, 'missing');
  return R(false);
}

/* ---- equations ---- */
function splitEq(s, spec) {
  var parts = clean(s).split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return null;
  return {l: parse(parts[0], spec), r: parse(parts[1], spec)};
}
function sameEquation(u, e) {                  // (uL-uR) is a constant nonzero multiple of (eL-eR)
  var F = N('sub', u.l, u.r), G = N('sub', e.l, e.r);
  var vs = varsOf(F); varsOf(G, vs); var names = Object.keys(vs).sort();
  if (!names.length) return false;
  var pts = samplePoints(names, 90, 777), r0 = null, valid = 0;
  for (var i = 0; i < pts.length && valid < 16; i++) {
    var f = ev(F, pts[i]), g = ev(G, pts[i]);
    if (!isFinite(f) || !isFinite(g) || Math.abs(f) > 1e9 || Math.abs(g) > 1e9) continue;
    if (Math.abs(g) < 1e-7) { if (Math.abs(f) < 1e-7) continue; return false; }
    var r = f / g;
    if (r0 === null) { if (Math.abs(r) < 1e-9) return false; r0 = r; }
    else if (!close(r, r0, 1e-6)) return false;
    valid++;
  }
  return valid >= 6;
}
function checkEquation(user, spec) {
  var e = splitEq(String(spec.value), spec); if (!e) fail('spec');
  var us = clean(user), ne = countEquals(us);
  if (ne === 0) {
    if (spec.allowExpression && e.l.t === 'var') { var ua = parse(us, spec); return R(equivalent(ua, e.r, false).eq); }
    parse(us, spec); return R(false, 'needEquation');
  }
  var u = splitEq(us, spec); if (!u) fail('eq');
  if (!sameEquation(u, e)) return R(false);
  if (spec.form === 'slope-intercept') {
    var yv = (spec.solvedFor || 'y').toLowerCase();
    if (!(u.l.t === 'var' && u.l.n === yv && !(yv in varsOf(u.r)))) return R(false, 'slopeForm');
  }
  return R(true);
}

/* ---- choices / text ---- */
var ALIASES = {
  yes: ['yes','y','true','t','yep','yeah'], no: ['no','n','false','f','nope'],
  none: ['none','no solution','no solutions','no real solution','no real solutions','dne','does not exist','undefined','n/a','na','∅','ø','empty set','nobody','no one','noone']
};
function tidy(s) { return clean(s).toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ').trim(); }
function canon(s, spec) {
  var t = tidy(s), k, table = {};
  for (k in ALIASES) table[k] = ALIASES[k];
  if (spec && spec.aliases) for (k in spec.aliases) table[k.toLowerCase()] = spec.aliases[k].map(function (x) { return String(x).toLowerCase(); });
  for (k in table) if (k === t || table[k].indexOf(t) >= 0) return k;
  return t;
}
function checkChoice(user, spec) {
  var wants = (spec.values || [spec.value]).map(function (x) { return canon(String(x), spec); });
  return R(wants.indexOf(canon(user, spec)) >= 0);
}

/* ══════════════════════════ 9. The old exact-match rules (kept so nothing regresses) ══════════════════════════ */
function legacyNorm(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/∞/g, 'inf').replace(/∪/g, 'u')
    .replace(/infinity/g, 'inf').replace(/union/g, 'u');
}
function legacyPoly(s) {
  s = String(s).replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/x²/g, 'x^2');
  if (!s) return null;
  var parts = s.match(/([+-]?[^+-]+)/g) || [], a2 = 0, a1 = 0, a0 = 0, found = false;
  for (var i = 0; i < parts.length; i++) {
    var t = parts[i], c; if (!t) continue;
    if (t.indexOf('x^2') >= 0) { c = t.replace('x^2', ''); a2 = (!c || c === '+') ? 1 : c === '-' ? -1 : Number(c); if (!isNaN(a2)) found = true; }
    else if (t.indexOf('x') >= 0) { c = t.replace('x', ''); a1 = (!c || c === '+') ? 1 : c === '-' ? -1 : Number(c); if (!isNaN(a1)) found = true; }
    else { var v = Number(t); if (!isNaN(v)) { a0 = v; found = true; } }
  }
  return found ? {a2:a2, a1:a1, a0:a0} : null;
}
function legacyOk(user, acc) {
  acc = acc == null ? [] : [].concat(acc);
  var u = legacyNorm(user);
  if (acc.some(function (a) { return legacyNorm(a) === u; })) return true;
  var up = legacyPoly(user); if (!up) return false;
  return acc.some(function (a) { var ap = legacyPoly(a); return !!ap && up.a2 === ap.a2 && up.a1 === ap.a1 && up.a0 === ap.a0; });
}

/* ══════════════════════════ 10. Public functions ══════════════════════════ */
var TYPES = { number:checkNumber, expr:checkExpr, set:checkSet, interval:checkInterval, inequality:checkInequality,
              point:checkPoint, pointlist:checkPointList, equation:checkEquation, choice:checkChoice,
              text: function (user, spec) { return R(legacyOk(user, spec.values || [spec.value])); } };

MC.check = function (user, spec) {
  if (Array.isArray(spec)) spec = {anyOf: spec};
  if (!spec) return {ok:false, reason:''};
  if (user == null || !String(user).trim()) return {ok:false, code:'empty', reason: spec.quiet ? '' : REASONS.empty, empty:true};
  if (spec.anyOf) {
    var first = null;
    for (var i = 0; i < spec.anyOf.length; i++) { var r = MC.check(user, spec.anyOf[i]); if (r.ok) return r; if (!first || (!first.reason && r.reason && r.code !== 'unreadable')) first = r; }
    return first || {ok:false, reason:''};
  }
  var fnc = TYPES[spec.type]; if (!fnc) return {ok:false, reason:'', error:'unknown type ' + spec.type};
  var res;
  try { res = fnc(String(user), spec); }
  catch (e) { if (!e || !e.mc) throw e; res = {ok:false, code:'unreadable', reason:REASONS.unreadable}; }
  if (!res.reason || spec.quiet || MC.config.reasons === false) res.reason = '';
  return res;
};
MC.grade = function (user, problem) {
  if (Array.isArray(problem)) return {ok: legacyOk(user, problem), reason:''};
  if (problem && problem.check) return MC.check(user, problem.check);
  return {ok: legacyOk(user, problem ? problem.answer : []), reason:''};
};
MC.ok = function (user, problem) { return MC.grade(user, problem).ok; };

/* smart(user, acc, opts) — one-line upgrade for pages that only have an answer list.
   1) anything the old exact-match accepts still passes;  2) otherwise each stored answer is read
   and an equivalent-form check is built from it (interval / number / list of numbers / yes-no /
   algebraic expression).  Answers it can't read (points, words, equations with two sides) stay exact-match.
   opts: {form:'simplified'|'factored'|'expanded'}  applies to algebraic expressions only. */
function inferSpec(a, opts) {
  var s = String(a == null ? '' : a).trim(); if (!s) return null;
  var cs = clean(s).toLowerCase();
  if (/^(yes|no|true|false)$/.test(cs)) return {type:'choice', value:cs};
  if (/inf|∞/.test(cs) && /[\[\(]/.test(cs)) return {type:'interval', value:s};
  var plusC = /\+\s*c$/i.test(s), body = plusC ? s.replace(/\s*\+\s*c$/i, '') : s;
  try {
    var parts = splitTop(clean(body), /[,;]/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (!parts.length) return null;
    if (parts.length > 1) {
      var vals = [];
      for (var i = 0; i < parts.length; i++) { if (hasVar(parse(parts[i]))) return null; vals.push(parts[i]); }
      return {type:'set', values:vals};
    }
    var ast = parse(clean(body).replace(PREFIX_RE, ''));
    if (!hasVar(ast)) {
      var oneTerm = !/[a-z0-9)]\s*[+-]/i.test(body.replace(/^\s*[-+]/, ''));   // sums stay lenient (e^2/4+1/4 is fine)
      var simp = oneTerm && /\/|sqrt|√/.test(body) ? {form:'simplified'} : {};
      return Object.assign({type:'number', value:body}, simp);
    }
    var spec = {type:'expr', value:body};
    if (plusC) spec.plusC = true;
    if (opts && opts.form) spec.form = opts.form;
    return spec;
  } catch (e) { if (e && e.mc) return null; throw e; }
}
function hasRadDenom(n) {
  if (!n) return false;
  if (n.t === 'div') { var found = false; (function w(m) { if (!m || found) return; if (m.t === 'fn' && m.n === 'sqrt' && m.a && m.a.t === 'num' && Math.abs(Math.sqrt(m.a.v) - Math.round(Math.sqrt(m.a.v))) > 1e-12) { found = true; return; } w(m.a); w(m.b); })(n.b); if (found) return true; }
  return hasRadDenom(n.a) || hasRadDenom(n.b);
}
MC.smart = function (user, acc, opts) {
  acc = acc == null ? [] : [].concat(acc);
  if (legacyOk(user, acc)) return {ok:true, reason:''};
  if (user == null || !String(user).trim()) return {ok:false, reason:''};
  var specs = [];
  acc.forEach(function (a) { var sp = inferSpec(a, opts); if (sp) { sp.quiet = true; specs.push(sp); } });
  if (!specs.length) return {ok:false, reason:''};
  var r = MC.check(user, {anyOf: specs});
  var isSet = specs.some(function (sp) { return sp.type === 'set'; }), isNum = specs.some(function (sp) { return sp.type === 'number'; });
  if (r.ok && (isSet || isNum)) {     // exact values: no radicals left in a denominator (1/sqrt(2) is not sqrt(2)/2); in lists, each value simplified too (2pi/6 is not pi/3)
    try {
      var parts = isSet ? splitTop(clean(String(user)).toLowerCase().replace(/\b(or|and)\b/g, ','), /[,;]/) : [clean(String(user))];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].trim().replace(/^[a-z](?:_?\d+)?\s*=\s*/, '');
        if (!p || p.indexOf('±') >= 0) continue;
        var pa = parse(p);
        if (hasRadDenom(pa) || (isSet && checkSimplified(pa))) return {ok: false, reason: ''};
      }
    } catch (e) { if (!e || !e.mc) throw e; }
  }
  return {ok: !!r.ok, reason: ''};
};
MC.legacyOk = legacyOk; MC.legacyNorm = legacyNorm;
MC.config = { reasons: true };
MC.REASONS = REASONS;

MC.parse = function (str, opts) { return parse(str, opts); };
MC.evaluate = function (ast, env) { return ev(ast, env || {}); };
MC.value = function (str) { try { var v = readValue(str); return 'v' in v ? v.v : NaN; } catch (e) { if (e && e.mc) return NaN; throw e; } };
MC.fn = function (str, v) {
  var ast = parse(str), name = (v || 'x').toLowerCase();
  return function (x) { var env = {}; env[name] = x; var y = ev(ast, env); return isFinite(y) ? y : NaN; };
};
MC.equal = function (a, b, strict) { try { return equivalent(parse(a), parse(b), !!strict).eq; } catch (e) { if (e && e.mc) return false; throw e; } };
MC.intervals = function (str) { return mergePieces(readIntervals(str, {}).pieces); };
MC._internals = { toPoly:toPoly, toRat:toRat, flat:flat, checkFactored:checkFactored, checkExpanded:checkExpanded, checkSimplified:checkSimplified, mergePieces:mergePieces, readInequality:readInequality, clean:clean };

/* TeX, so a page can show "we read your answer as ..." */
function fmtNum(v) { var s = String(Math.round(v * 1e10) / 1e10); return s; }
function tex(n, p) {
  var s;
  switch (n.t) {
    case 'num': return fmtNum(n.v);
    case 'const': return n.n === 'pi' ? '\\pi' : n.n === 'e' ? 'e' : '\\infty';
    case 'var': return n.n;
    case 'neg': s = '-' + tex(n.a, 2); return p >= 1 ? '\\left(' + s + '\\right)' : s;
    case 'add': s = tex(n.a, 0) + '+' + tex(n.b, 0); return p > 0 ? '\\left(' + s + '\\right)' : s;
    case 'sub': s = tex(n.a, 0) + '-' + tex(n.b, 1); return p > 0 ? '\\left(' + s + '\\right)' : s;
    case 'mul': var l = tex(n.a, 1), r = tex(n.b, 1); s = l + (/^[\d-]/.test(r) ? '\\cdot ' : ' ') + r; return p > 2 ? '\\left(' + s + '\\right)' : s;
    case 'div': s = '\\frac{' + tex(n.a, 0) + '}{' + tex(n.b, 0) + '}'; return p > 2 ? '\\left(' + s + '\\right)' : s;
    case 'pow': return tex(n.a, 3) + '^{' + tex(n.b, 0) + '}';
    case 'logb': return '\\log_{' + tex(n.b, 0) + '}\\left(' + tex(n.a, 0) + '\\right)';
    case 'fn':
      if (n.n === 'sqrt') return '\\sqrt{' + tex(n.a, 0) + '}';
      if (n.n === 'cbrt') return '\\sqrt[3]{' + tex(n.a, 0) + '}';
      if (n.n === 'abs') return '\\left|' + tex(n.a, 0) + '\\right|';
      s = ({asin:'\\arcsin', acos:'\\arccos', atan:'\\arctan'})[n.n] || '\\' + n.n;
      s = s + '\\left(' + tex(n.a, 0) + '\\right)'; return p > 2 ? '\\left(' + s + '\\right)' : s;
  }
  return '';
}
MC.toTeX = function (str) { try { return tex(parse(str), 0); } catch (e) { if (e && e.mc) return ''; throw e; } };

if (typeof module !== 'undefined' && module.exports) module.exports = MC;
root.MathCheck = MC;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
