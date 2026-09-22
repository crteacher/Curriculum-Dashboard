// AUTO-GENERATED — do not hand-edit; rebuild with build_calc1_spiral.py
// Calc 1 spiral-review generator bundle
// BANK entries return a fixed {latex,answer,hint,step} object.
// Generator entries call _rf() so each student gets different numbers.
(function(global) {

  // ── Shared RNG + array helpers ──────────────────────────────────────────
  function _rf() {
    const b = new Uint32Array(1);
    crypto.getRandomValues(b);
    return b[0] / 4294967296;
  }
  function rInt(n)   { return Math.floor(_rf() * n); }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // Pick one element at random from an array  e.g. choose([1,4,9])
  function choose(arr) { return arr[rInt(arr.length)]; }

  // Answer normaliser
  function norm(s) { return String(s).replace(/−/g,'-').replace(/\s+/g,'').toLowerCase(); }

  global.CALC1_SPIRAL = {};

  // §Calc_1_1: Introduction to Limits
  CALC1_SPIRAL["Calc_1_1"] = {
    title: "Introduction to Limits",
    index: 0,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // ── Graph SVG helpers ────────────────────────────────────────────────────────
      // Coordinate system: plot x∈[0,6], y∈[0,6] → SVG canvas 280×185
      // px(x)=30+x*40  [0→30, 1→70, 2→110, 3→150, 4→190, 5→230, 6→270]
      // py(y)=165-y*25 [0→165, 1→140, 2→115, 3→90, 4→65, 5→40, 6→15]
      const _GW=280, _GH=185;
      const _gpx = x => 30+x*40;
      const _gpy = y => 165-y*25;
      function _gAxes(hx) {
        let s='';
        s+=`<line x1="30" y1="165" x2="270" y2="165" stroke="#aaa" stroke-width="1.5"/>`;
        s+=`<line x1="30" y1="15"  x2="30"  y2="165" stroke="#aaa" stroke-width="1.5"/>`;
        for(let i=1;i<=5;i++){
          const sx=_gpx(i), c=(i===hx)?'#c03030':'#555';
          s+=`<line x1="${sx}" y1="163" x2="${sx}" y2="167" stroke="#aaa"/>`;
          s+=`<text x="${sx}" y="179" text-anchor="middle" font-size="11" fill="${c}">${i}</text>`;
        }
        for(let i=1;i<=5;i++){
          const sy=_gpy(i);
          s+=`<line x1="27" y1="${sy}" x2="33" y2="${sy}" stroke="#aaa"/>`;
          s+=`<text x="22" y="${sy+4}" text-anchor="end" font-size="11" fill="#555">${i}</text>`;
        }
        return s;
      }
      function _gSeg(x1,y1,x2,y2) {
        return `<line x1="${_gpx(x1)}" y1="${_gpy(y1)}" x2="${_gpx(x2)}" y2="${_gpy(y2)}" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>`;
      }
      function _gDot(x,y)  { return `<circle cx="${_gpx(x)}" cy="${_gpy(y)}" r="5" fill="#2563eb"/>`; }
      function _gHole(x,y) { return `<circle cx="${_gpx(x)}" cy="${_gpy(y)}" r="5" fill="white" stroke="#2563eb" stroke-width="2"/>`; }
      function _gDash(x1,y1,x2,y2) {
        return `<line x1="${_gpx(x1)}" y1="${_gpy(y1)}" x2="${_gpx(x2)}" y2="${_gpy(y2)}" stroke="#aaa" stroke-width="1" stroke-dasharray="4,3"/>`;
      }
      function _gSvgWrap(inner) {
        return `<svg width="${_GW}" height="${_GH}" style="display:block;margin:4px auto;background:#f8fafc;border-radius:6px">${inner}</svg>`;
      }
      function _limHeader(a) {
        return `<div style="text-align:center;font-size:15px;margin-bottom:2px">Find lim<sub style="font-size:10px;margin-left:1px">x&#8594;${a}</sub> f(x)&ensp;<span style="font-size:12px;color:#666">— enter the value, or <em>DNE</em></span></div>`;
      }

      // gen1: Removable discontinuity on line y=x
      //   Open circle at (a,a) — the limit. Filled dot at (a,b) — the function value.
      function gen1() {
        const cases = [
          {a:2, b:4, lim:2},
          {a:3, b:5, lim:3},
          {a:4, b:2, lim:4},
          {a:3, b:1, lim:3},
          {a:2, b:5, lim:2},
          {a:4, b:6, lim:4},
        ];
        const {a, b, lim} = choose(cases);
        const body =
          _gAxes(a) +
          _gDash(a, 0, a, lim) +
          _gDash(0, lim, a, lim) +
          _gSeg(0.5, 0.5, a-0.25, a-0.25) +
          _gSeg(a+0.25, a+0.25, 5.5, 5.5) +
          _gHole(a, lim) +
          _gDot(a, b);
        return {
          svg: _limHeader(a) + _gSvgWrap(body),
          answer: [String(lim)],
          hint:  `A limit is about where the curve is heading as x→${a}, not what f(${a}) equals. Which circle marks the approach?`,
          step:  `\\lim_{x\\to ${a}}f(x)=${lim}\\quad\\text{(curve approaches the open circle at }y=${lim}\\text{)}`
        };
      }

      // gen2: Jump discontinuity — two horizontal pieces, limit = DNE
      function gen2() {
        const cases = [
          {a:3, L1:4, L2:2},
          {a:3, L1:2, L2:4},
          {a:2, L1:4, L2:2},
          {a:4, L1:2, L2:4},
          {a:3, L1:5, L2:3},
          {a:2, L1:3, L2:5},
        ];
        const {a, L1, L2} = choose(cases);
        const body =
          _gAxes(a) +
          _gSeg(0.5, L1, a-0.25, L1) +
          _gSeg(a+0.25, L2, 5.5, L2) +
          _gHole(a, L1) +
          _gHole(a, L2);
        return {
          svg: _limHeader(a) + _gSvgWrap(body),
          answer: ['DNE','dne','does not exist'],
          hint:  `Trace the curve from the left of x=${a} and from the right. Do they approach the same height?`,
          step:  `\\text{Left side}\\to ${L1},\\quad\\text{right side}\\to ${L2}.\\quad${L1}\\neq${L2}\\Rightarrow\\text{DNE}`
        };
      }

      // gen3: Removable discontinuity on descending line y = −x+7
      //   lim = −a+7. Open circle at (a, lim). Filled dot at (a, b).
      function gen3() {
        const cases = [
          {a:2, b:1, lim:5},
          {a:3, b:6, lim:4},
          {a:4, b:6, lim:3},
          {a:5, b:1, lim:2},
          {a:2, b:3, lim:5},
          {a:3, b:1, lim:4},
        ];
        const {a, b, lim} = choose(cases);
        const body =
          _gAxes(a) +
          _gDash(a, 0, a, lim) +
          _gDash(0, lim, a, lim) +
          _gSeg(1, 6, a-0.25, lim+0.25) +
          _gSeg(a+0.25, lim-0.25, 5.5, 1.5) +
          _gHole(a, lim) +
          _gDot(a, b);
        return {
          svg: _limHeader(a) + _gSvgWrap(body),
          answer: [String(lim)],
          hint:  `Follow the decreasing curve toward x=${a} from both sides. What height does it approach?`,
          step:  `\\lim_{x\\to ${a}}f(x)=${lim}\\quad\\text{(curve approaches the open circle at }y=${lim}\\text{)}`
        };
      }

      // gen4: Piecewise function — both sides agree → integer limit
      function gen4() {
        const cases = [
          {e1:'2x+1', e2:'x+4',  a:3, L:7,  lv:'2(3)+1=7',  rv:'(3)+4=7'},
          {e1:'x+2',  e2:'2x-1', a:3, L:5,  lv:'(3)+2=5',   rv:'2(3)-1=5'},
          {e1:'3x',   e2:'x+4',  a:2, L:6,  lv:'3(2)=6',    rv:'(2)+4=6'},
          {e1:'x+1',  e2:'3x-5', a:3, L:4,  lv:'(3)+1=4',   rv:'3(3)-5=4'},
          {e1:'x',    e2:'2x-4', a:4, L:4,  lv:'(4)=4',     rv:'2(4)-4=4'},
          {e1:'2x-2', e2:'x+1',  a:3, L:4,  lv:'2(3)-2=4',  rv:'(3)+1=4'},
        ];
        const {e1, e2, a, L, lv, rv} = choose(cases);
        return {
          latex:  `f(x)=\\begin{cases}${e1}&x<${a}\\\\\\\\${e2}&x\\geq ${a}\\end{cases}\\quad\\text{Find }\\lim_{x\\to${a}}f(x).`,
          answer: [String(L)],
          hint:   `Evaluate each piece as x approaches ${a} — one from the left, one from the right. Do the two values agree?`,
          step:   `\\text{Left: }${lv}\\qquad\\text{Right: }${rv}\\qquad\\Rightarrow\\lim_{x\\to${a}}f(x)=${L}`
        };
      }

      // gen5: Direct substitution — lim x→a (mx+b) = ma+b
      function gen5() {
        const m   = rInt(4)+2;    // m in {2,3,4,5}
        const b   = rInt(5)+1;    // b in {1,2,3,4,5}
        const a   = rInt(4)+1;    // a in {1,2,3,4}
        const ans = m*a + b;
        return {
          latex:  `\\lim_{x\\to${a}}(${m}x+${b})`,
          answer: [String(ans)],
          hint:   `For a polynomial, can you substitute x=${a} directly? What stops that from working here?`,
          step:   `${m}(${a})+${b}=${ans}`
        };
      }

      // gen6: Direct substitution — lim x→a (x²+bx) = a²+ba
      function gen6() {
        const a   = rInt(3)+1;    // a in {1,2,3}
        const b   = rInt(4)+1;    // b in {1,2,3,4}
        const ans = a*a + b*a;
        return {
          latex:  `\\lim_{x\\to${a}}(x^2+${b}x)`,
          answer: [String(ans)],
          hint:   `For polynomials, direct substitution always works. Which value of x goes into the expression?`,
          step:   `(${a})^2+${b}(${a})=${a*a}+${b*a}=${ans}`
        };
      }

      // gen7: Factor and cancel — (x²-a²)/(x-a) = x+a → 2a
      function gen7() {
        const a   = rInt(4)+2;    // a in {2,3,4,5}
        const ans = 2*a;
        return {
          latex:  `\\lim_{x\\to${a}}\\frac{x^2-${a*a}}{x-${a}}`,
          answer: [String(ans)],
          hint:   `Direct substitution gives 0/0. Does the numerator factor? Which pattern applies to x²−${a*a}?`,
          step:   `\\frac{(x-${a})(x+${a})}{x-${a}}=x+${a}\\to${a}+${a}=${ans}`
        };
      }

      // gen8: Factor and cancel — (x-a)(x+b)/(x-a) = x+b → a+b
      function gen8() {
        const cases = [
          {a:2, b:3, ans:5, num:'x^2+x-6'},
          {a:3, b:2, ans:5, num:'x^2-x-6'},
          {a:1, b:4, ans:5, num:'x^2+3x-4'},
          {a:2, b:4, ans:6, num:'x^2+2x-8'},
          {a:3, b:4, ans:7, num:'x^2+x-12'},
          {a:4, b:2, ans:6, num:'x^2-2x-8'},
        ];
        const {a, b, ans, num} = choose(cases);
        return {
          latex:  `\\lim_{x\\to${a}}\\frac{${num}}{x-${a}}`,
          answer: [String(ans)],
          hint:   `Direct substitution gives 0/0 — try factoring the numerator. Does the same factor as the denominator appear?`,
          step:   `\\frac{(x-${a})(x+${b})}{x-${a}}=x+${b}\\to${a}+${b}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_1_1_5: One-Sided Limits (bank)
  CALC1_SPIRAL["Calc_1_1_5"] = {
    title: "One-Sided Limits",
    index: 1,
    generators: (function() {
      function gen1() { return {"graph":"A","prompt":"Find $\\displaystyle\\lim_{x \\to 1^-}f(x)$.","answer":["4"],"hint":"Trace the curve from the left toward x = 1 — what height does it approach?","step":"\\text{Approaching from the left, the curve heads toward the open circle at height }4."}; }
      function gen2() { return {"graph":"A","prompt":"Find $\\displaystyle\\lim_{x \\to 1^+}f(x)$.","answer":["-2","−2"],"hint":"Trace the curve from the right toward x = 1.","step":"\\text{Approaching from the right, the curve heads toward the open circle at height }-2."}; }
      function gen3() { return {"graph":"A","prompt":"Does $\\displaystyle\\lim_{x \\to 1}f(x)$ exist? Enter its value, or DNE.","answer":["dne","DNE"],"hint":"Compare the left-hand and right-hand limits.","step":"4 \\neq -2 \\;\\Rightarrow\\; \\lim_{x\\to1}f(x)\\text{ is DNE}"}; }
      function gen4() { return {"graph":"B","prompt":"Find $\\displaystyle\\lim_{x \\to 4^-}f(x)$.","answer":["6"],"hint":"The limit follows the open circle, not the filled dot.","step":"\\text{Both branches approach the open circle at height }6."}; }
      function gen5() { return {"graph":"B","prompt":"Find $\\displaystyle\\lim_{x \\to 4^+}f(x)$.","answer":["6"],"hint":"Same open circle, approached from the right.","step":"\\text{The right branch also approaches }6."}; }
      function gen6() { return {"graph":"B","prompt":"Does $\\displaystyle\\lim_{x \\to 4}f(x)$ exist? Enter its value, or DNE.","answer":["6"],"hint":"Left and right limits agree — the filled dot is a distraction.","step":"\\lim_{x\\to4^-}f(x)=6=\\lim_{x\\to4^+}f(x)\\;\\Rightarrow\\;\\lim_{x\\to4}f(x)=6"}; }
      function gen7() { return {"graph":"C","prompt":"Find $\\displaystyle\\lim_{x \\to -2^-}f(x)$.","answer":["-1","−1"],"hint":"Trace from the left toward x = -2.","step":"\\text{From the left, the curve approaches height }-1."}; }
      function gen8() { return {"graph":"C","prompt":"Find $\\displaystyle\\lim_{x \\to -2^+}f(x)$.","answer":["3"],"hint":"Trace from the right toward x = -2.","step":"\\text{From the right, the curve approaches height }3."}; }
      function gen9() { return {"graph":"C","prompt":"Does $\\displaystyle\\lim_{x \\to -2}f(x)$ exist? Enter its value, or DNE.","answer":["dne","DNE"],"hint":"Compare the two one-sided limits.","step":"-1 \\neq 3 \\;\\Rightarrow\\; \\lim_{x\\to-2}f(x)\\text{ is DNE}"}; }
      function gen10() { return {"graph":"D","prompt":"Find $\\displaystyle\\lim_{x \\to 5^-}f(x)$.","answer":["4"],"hint":"What height does the graph sit at just before x = 5?","step":"\\text{For }4\\le x<5,\\;f(x)=4"}; }
      function gen11() { return {"graph":"D","prompt":"Find $\\displaystyle\\lim_{x \\to 5^+}f(x)$.","answer":["5"],"hint":"What height does the graph jump to right after x = 5?","step":"\\text{For }5\\le x<6,\\;f(x)=5"}; }
      function gen12() { return {"graph":"D","prompt":"Does $\\displaystyle\\lim_{x \\to 5}f(x)$ exist? Enter its value, or DNE.","answer":["dne","DNE"],"hint":"Compare the step heights on each side of x = 5.","step":"4 \\neq 5 \\;\\Rightarrow\\; \\lim_{x\\to5}f(x)\\text{ is DNE}"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11, gen12];
    })()
  };

  // §Calc_1_2: Limit Rules (bank)
  CALC1_SPIRAL["Calc_1_2"] = {
    title: "Limit Rules",
    index: 2,
    generators: (function() {
      function gen1() { return {"latex":"\\lim_{x \\to 3} (2x^2 - 4x + 1)","answer":["7"],"hint":"Direct substitution — polynomial, so continuous everywhere.","step":"2(3)^2-4(3)+1=18-12+1=7"}; }
      function gen2() { return {"latex":"\\lim_{x \\to 1} \\dfrac{x^2-1}{x-1}","answer":["2"],"hint":"Factor x²−1 = (x−1)(x+1).","step":"\\frac{(x-1)(x+1)}{x-1}=x+1\\;\\xrightarrow{x\\to1}\\;2"}; }
      function gen3() { return {"latex":"\\lim_{x \\to -2} \\dfrac{x^2+5x+6}{x+2}","answer":["1"],"hint":"Factor x²+5x+6.","step":"\\frac{(x+2)(x+3)}{x+2}=x+3\\;\\xrightarrow{x\\to-2}\\;1"}; }
      function gen4() { return {"latex":"\\lim_{x \\to 4} \\dfrac{\\sqrt{x}-2}{x-4}","answer":["0.25","1/4"],"hint":"Multiply by (√x+2)/(√x+2).","step":"\\frac{\\sqrt{x}-2}{x-4}\\cdot\\frac{\\sqrt{x}+2}{\\sqrt{x}+2}=\\frac{1}{\\sqrt{x}+2}\\;\\xrightarrow{x\\to4}\\;\\frac{1}{4}"}; }
      function gen5() { return {"latex":"\\lim_{x \\to 9} \\dfrac{\\sqrt{x}-3}{x-9}","answer":["1/6","0.1667","0.167"],"hint":"Rationalize: multiply by (√x+3)/(√x+3).","step":"\\frac{1}{\\sqrt{x}+3}\\;\\xrightarrow{x\\to9}\\;\\frac{1}{6}"}; }
      function gen6() { return {"latex":"\\lim_{h \\to 0} \\dfrac{(5+h)^2 - 25}{h}","answer":["10"],"hint":"Expand (5+h)², then simplify.","step":"\\frac{25+10h+h^2-25}{h}=\\frac{10h+h^2}{h}=10+h\\;\\xrightarrow{h\\to0}\\;10"}; }
      function gen7() { return {"latex":"\\lim_{h \\to 0} \\dfrac{(3+h)^3 - 27}{h}","answer":["27"],"hint":"Expand (3+h)³, cancel constant terms, divide by h.","step":"\\frac{27+27h+9h^2+h^3-27}{h}=27+9h+h^2\\;\\xrightarrow{h\\to0}\\;27"}; }
      function gen8() { return {"latex":"\\lim_{x \\to 2} \\dfrac{x^3-8}{x-2}","answer":["12"],"hint":"Factor x³−8 as a difference of cubes.","step":"x^3-8=(x-2)(x^2+2x+4)\\;\\Rightarrow\\;x^2+2x+4\\;\\xrightarrow{x\\to2}\\;12"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_1_3: Continuity (bank)
  CALC1_SPIRAL["Calc_1_3"] = {
    title: "Continuity",
    index: 3,
    generators: (function() {
      function gen1() { return {"latex":"\\text{Is } f(x)=\\dfrac{1}{x-1} \\text{ continuous at } x=2?","answer":["yes","Yes","YES","y"],"hint":"Check: f(2) exists? Limit exists? They're equal?","step":"f(2)=1,\\;\\lim_{x\\to2}f(x)=1,\\;\\text{equal}\\;\\Rightarrow\\;\\textbf{Yes}"}; }
      function gen2() { return {"latex":"\\text{Is } f(x)=\\dfrac{x^2-1}{x-1} \\text{ continuous at } x=1?","answer":["no","No","NO","n"],"hint":"Is f(1) defined?","step":"f(1)\\text{ undefined}\\;\\Rightarrow\\;\\textbf{No}\\text{ (removable discontinuity)}"}; }
      function gen3() { return {"latex":"\\text{Find }k\\text{ so } f(x)=\\begin{cases}kx+1&x\\le2\\\\x^2&x>2\\end{cases}\\text{ is continuous}","answer":["3/2","1.5"],"hint":"Set left-hand value equal to right-hand value at x = 2.","step":"k(2)+1=4\\;\\Rightarrow\\;2k=3\\;\\Rightarrow\\;k=\\tfrac{3}{2}"}; }
      function gen4() { return {"latex":"\\text{Find }b\\text{ so } f(x)=\\begin{cases}3x+b&x<1\\\\x^2&x\\ge1\\end{cases}\\text{ is continuous}","answer":["-2","−2"],"hint":"Continuity at x=1: left limit = f(1).","step":"3(1)+b=1\\;\\Rightarrow\\;b=-2"}; }
      function gen5() { return {"latex":"\\text{Where is } f(x)=\\dfrac{1}{x^2-4} \\text{ discontinuous?}","answer":["x=2andx=-2","x=±2","x=2,x=-2","+-2","±2","-2and2"],"hint":"Set the denominator equal to zero.","step":"x^2-4=0\\;\\Rightarrow\\;x=\\pm2\\;\\text{(infinite discontinuities)}"}; }
      function gen6() { return {"latex":"\\lim_{x\\to2^+}\\dfrac{1}{x-2}","answer":["inf","infinity","∞","+inf","+infinity"],"hint":"What sign does 1/(x−2) have for x just above 2?","step":"x-2\\to0^+\\;\\Rightarrow\\;\\frac{1}{x-2}\\to+\\infty"}; }
      function gen7() { return {"latex":"\\text{Does IVT guarantee a root of }x^3-x-1=0\\text{ on }(1,2)?","answer":["yes","Yes","YES","y"],"hint":"Evaluate f(1) and f(2) and check signs.","step":"f(1)=-1<0,\\;f(2)=5>0,\\;f\\text{ continuous}\\;\\Rightarrow\\;\\textbf{Yes}"}; }
      function gen8() { return {"latex":"\\text{Classify the discontinuity of } f(x)=\\dfrac{x^2-4}{x-2} \\text{ at }x=2","answer":["removable","Removable","REMOVABLE"],"hint":"Can the discontinuity be 'filled in' with a single point?","step":"\\frac{(x-2)(x+2)}{x-2}=x+2;\\;\\lim=4\\text{ but }f(2)\\text{ undefined}\\;\\Rightarrow\\;\\text{Removable}"}; }
      function gen9() { return {"latex":"\\text{Classify the discontinuity of }f(x)=\\begin{cases}x+2&x<1\\\\4x&x\\ge1\\end{cases}\\text{ at }x=1","answer":["jump","Jump","JUMP"],"hint":"Compute the left-hand and right-hand limits separately. Do they agree?","step":"\\lim_{x\\to1^-}f(x)=1+2=3,\\;\\lim_{x\\to1^+}f(x)=4(1)=4;\\;3\\neq4\\;\\Rightarrow\\;\\text{Jump}"}; }
      function gen10() { return {"latex":"\\text{Classify the discontinuity of }f(x)=\\dfrac{x+2}{x-1}\\text{ at }x=1","answer":["infinite","Infinite","INFINITE"],"hint":"Does the numerator also equal zero at that x-value, or just the denominator?","step":"\\text{Numerator}=1+2=3\\neq0\\text{ at }x=1,\\text{ denominator}=0\\;\\Rightarrow\\;\\text{Infinite}"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10];
    })()
  };

  // §Calc_1_4: Limits at Infinity (bank)
  CALC1_SPIRAL["Calc_1_4"] = {
    title: "Limits at Infinity",
    index: 4,
    generators: (function() {
      function gen1() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{3x^2 - x}{x^2 + x}","answer":["3"],"hint":"Equal degrees — ratio of leading coefficients.","step":"\\frac{3 - 1/x}{1 + 1/x} \\xrightarrow{x\\to\\infty} \\frac{3}{1} = 3"}; }
      function gen2() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{5x^3 - 2}{x^3 + 1}","answer":["5"],"hint":"Equal degrees — what are the leading coefficients?","step":"\\frac{5 - 2/x^3}{1 + 1/x^3} \\to \\frac{5}{1} = 5"}; }
      function gen3() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{7x + 3}{2x - 1}","answer":["7/2","3.5","3.50"],"hint":"Equal degrees — ratio of leading coefficients.","step":"\\frac{7 + 3/x}{2 - 1/x} \\to \\frac{7}{2}"}; }
      function gen4() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{6x^4 + x}{2x^4 - 1}","answer":["3"],"hint":"Equal degrees — ratio of leading coefficients.","step":"\\frac{6 + 1/x^3}{2 - 1/x^4} \\to \\frac{6}{2} = 3"}; }
      function gen5() { return {"latex":"\\lim_{x \\to -\\infty} \\dfrac{2x^2 + 1}{x^2 - 3}","answer":["2"],"hint":"Equal degrees. Does the sign of x matter here?","step":"\\frac{2 + 1/x^2}{1 - 3/x^2} \\to \\frac{2}{1} = 2"}; }
      function gen6() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{x^2 - 4}{3x^2 + x}","answer":["1/3","0.333","0.33"],"hint":"Equal degrees — ratio of leading coefficients.","step":"\\frac{1 - 4/x^2}{3 + 1/x} \\to \\frac{1}{3}"}; }
      function gen7() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{4x^2 + 1}{x^3 - 2}","answer":["0"],"hint":"Denominator degree is higher — the fraction shrinks to zero.","step":"\\frac{4/x + 1/x^3}{1 - 2/x^3} \\to \\frac{0}{1} = 0"}; }
      function gen8() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{x + 5}{x^2 + x}","answer":["0"],"hint":"Denominator degree is higher.","step":"\\frac{1/x + 5/x^2}{1 + 1/x} \\to \\frac{0}{1} = 0"}; }
      function gen9() { return {"latex":"\\lim_{x \\to 0^+} \\dfrac{1}{x}","answer":["inf","infinity","+inf","+infinity"],"hint":"Small positive x in the denominator — which way does this blow up?","step":"x \\to 0^+ \\Rightarrow \\tfrac{1}{x} \\to +\\infty"}; }
      function gen10() { return {"latex":"\\lim_{x \\to 0^-} \\dfrac{1}{x}","answer":["-inf","-infinity"],"hint":"Small negative x in the denominator — which sign does the result have?","step":"x \\to 0^- \\Rightarrow \\tfrac{1}{x} \\to -\\infty"}; }
      function gen11() { return {"latex":"\\lim_{x \\to 0} \\dfrac{1}{x^2}","answer":["inf","infinity","+inf","+infinity"],"hint":"x² is always positive — what happens to 1/x² as x → 0?","step":"x^2 > 0 \\text{ on both sides} \\Rightarrow \\tfrac{1}{x^2} \\to +\\infty"}; }
      function gen12() { return {"latex":"\\lim_{x \\to 2^+} \\dfrac{1}{x - 2}","answer":["inf","infinity","+inf","+infinity"],"hint":"Approach x = 2 from the right — what sign is x − 2?","step":"x \\to 2^+ \\Rightarrow x-2 \\to 0^+ \\Rightarrow \\tfrac{1}{x-2} \\to +\\infty"}; }
      function gen13() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{\\sqrt{16x^4 + 3}}{2x^2}","answer":["2"],"hint":"Factor x⁴ out of the radical. x² > 0 for x > 0.","step":"\\frac{\\sqrt{x^4(16 + 3/x^4)}}{2x^2} = \\frac{x^2 \\cdot 4}{2x^2} = 2"}; }
      function gen14() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{x + 1}{\\sqrt{x^2 + 1}}","answer":["1"],"hint":"Factor x from the numerator and x² from under the radical.","step":"\\frac{x(1 + 1/x)}{x\\sqrt{1 + 1/x^2}} \\to \\frac{1 \\cdot 1}{1 \\cdot 1} = 1"}; }
      function gen15() { return {"latex":"\\lim_{x \\to -\\infty} \\dfrac{\\sqrt{9x^2 + 1}}{x}","answer":["-3"],"hint":"For x → −∞, x is negative. Factor x² from under the root carefully.","step":"\\sqrt{9x^2+1} \\approx 3|x| = -3x \\text{ (since } x<0\\text{)},\\; \\frac{-3x}{x} = -3"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11, gen12, gen13, gen14, gen15];
    })()
  };

  // §Calc_1_5: Squeeze Theorem and IVT (bank)
  CALC1_SPIRAL["Calc_1_5"] = {
    title: "Squeeze Theorem and IVT",
    index: 5,
    generators: (function() {
      function gen1() { return {"latex":"\\lim_{x \\to 0} x^2 \\sin(x)","answer":["0"],"hint":"Bound sin(x) between −1 and 1, then multiply by x².","step":"-x^2 \\le x^2\\sin x \\le x^2;\\;\\text{both} \\to 0 \\Rightarrow \\lim = 0"}; }
      function gen2() { return {"latex":"\\lim_{x \\to 0} x \\sin\\!\\left(\\tfrac{1}{x}\\right)","answer":["0"],"hint":"sin(1/x) stays bounded between −1 and 1 for all x ≠ 0.","step":"-|x| \\le x\\sin\\!\\tfrac{1}{x} \\le |x|;\\;|x|\\to0 \\Rightarrow \\lim = 0"}; }
      function gen3() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{\\sin x}{x}","answer":["0"],"hint":"sin(x) stays bounded while x grows without bound.","step":"-\\tfrac{1}{x} \\le \\tfrac{\\sin x}{x} \\le \\tfrac{1}{x} \\to 0"}; }
      function gen4() { return {"latex":"\\lim_{x \\to 0} x^2 \\cos\\!\\left(\\tfrac{1}{x}\\right)","answer":["0"],"hint":"cos(1/x) is bounded between −1 and 1.","step":"-x^2 \\le x^2\\cos\\!\\tfrac{1}{x} \\le x^2 \\to 0"}; }
      function gen5() { return {"latex":"\\lim_{x \\to 0} \\dfrac{\\tan x}{x}","answer":["1"],"hint":"Write tan(x) = sin(x)/cos(x), then use the known limit sin(x)/x → 1.","step":"\\frac{\\tan x}{x} = \\frac{\\sin x}{x}\\cdot\\frac{1}{\\cos x} \\to 1 \\cdot 1 = 1"}; }
      function gen6() { return {"latex":"\\lim_{x \\to \\infty} \\dfrac{\\cos x}{x}","answer":["0"],"hint":"cos(x) is bounded. What happens when you divide a bounded quantity by x → ∞?","step":"-\\tfrac{1}{x} \\le \\tfrac{\\cos x}{x} \\le \\tfrac{1}{x} \\to 0"}; }
      function gen7() { return {"latex":"\\lim_{x \\to 0^+} \\sqrt{x}\\,\\sin\\!\\left(\\tfrac{1}{x}\\right)","answer":["0"],"hint":"sin(1/x) is bounded. What's the squeezing function here?","step":"-\\sqrt{x} \\le \\sqrt{x}\\sin\\!\\tfrac{1}{x} \\le \\sqrt{x};\\;\\sqrt{x}\\to0 \\Rightarrow \\lim = 0"}; }
      function gen8() { return {"latex":"\\text{Does } x^3 + x - 1 = 0 \\text{ have a root on } (0,1)\\,?","answer":["yes","Yes","YES","y"],"hint":"Let g(x) = x³ + x − 1. Check the signs at x = 0 and x = 1.","step":"g(0)=-1<0,\\;g(1)=1>0;\\;g \\text{ continuous} \\Rightarrow \\exists\\,c\\in(0,1)"}; }
      function gen9() { return {"latex":"\\text{Does } \\cos x = x \\text{ have a solution on } (0,2)\\,?","answer":["yes","Yes","YES","y"],"hint":"Let g(x) = cos(x) − x. Check signs at the endpoints.","step":"g(0)=1>0,\\;g(2)=\\cos2-2\\approx-2.42<0 \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen10() { return {"latex":"\\text{Does } e^x = 3 \\text{ have a solution on } (0,2)\\,?","answer":["yes","Yes","YES","y"],"hint":"Is 3 between e⁰ and e²? Is the function continuous?","step":"e^0=1<3<e^2\\approx7.4;\\;e^x \\text{ continuous} \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen11() { return {"latex":"\\text{Does } 3x^5 - 4x^2 = 3 \\text{ have a solution on } [0,2]\\,?","answer":["yes","Yes","YES","y"],"hint":"Let g(x) = 3x⁵ − 4x² − 3. Check g(0) and g(2).","step":"g(0)=-3<0,\\;g(2)=77>0 \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen12() { return {"latex":"\\text{Does } e^x - x = 2 \\text{ have a solution on } (0,4)\\,?","answer":["yes","Yes","YES","y"],"hint":"Let h(x) = eˣ − x − 2. Check signs at x = 0 and x = 4.","step":"h(0)=-1<0,\\;h(4)=e^4-6\\approx48.6>0 \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen13() { return {"latex":"\\text{Does } x^5 - 2x = 1 \\text{ have a root on } (1,2)\\,?","answer":["yes","Yes","YES","y"],"hint":"Let g(x) = x⁵ − 2x − 1. Evaluate at both endpoints.","step":"g(1)=1-2-1=-2<0,\\;g(2)=32-4-1=27>0 \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen14() { return {"latex":"\\text{Does } 2^x - 3x = 0 \\text{ have a root on } (1,4)\\,?","answer":["yes","Yes","YES","y"],"hint":"Let g(x) = 2ˣ − 3x. Check g(1) and g(4).","step":"g(1)=2-3=-1<0,\\;g(4)=16-12=4>0 \\Rightarrow \\text{Yes, by IVT}"}; }
      function gen15() { return {"latex":"\\text{Does } x^3 - 5x + 1 = 0 \\text{ have a root on } (0,1)\\,?","answer":["yes","Yes","YES","y"],"hint":"Evaluate g(x) = x³ − 5x + 1 at both endpoints.","step":"g(0)=1>0,\\;g(1)=1-5+1=-3<0 \\Rightarrow \\text{Yes, by IVT}"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11, gen12, gen13, gen14, gen15];
    })()
  };

  // §Calc_2_1: Derivative Preliminaries (bank)
  CALC1_SPIRAL["Calc_2_1"] = {
    title: "Derivative Preliminaries",
    index: 6,
    generators: (function() {
      function gen1() { return {"latex":"\\text{Avg. rate of change of } f(x)=x^2 \\text{ on } [1,3]","answer":["4"],"hint":"Use (f(3) − f(1)) / (3 − 1).","step":"\\frac{9-1}{3-1} = \\frac{8}{2} = 4"}; }
      function gen2() { return {"latex":"\\text{Avg. rate of change of } f(x)=x^3 \\text{ on } [1,3]","answer":["13"],"hint":"Use (f(3) − f(1)) / (3 − 1).","step":"\\frac{27-1}{3-1} = \\frac{26}{2} = 13"}; }
      function gen3() { return {"latex":"\\text{Avg. rate of change of } f(x)=x^2 \\text{ on } [2,5]","answer":["7"],"hint":"Use (f(5) − f(2)) / (5 − 2).","step":"\\frac{25-4}{5-2} = \\frac{21}{3} = 7"}; }
      function gen4() { return {"latex":"\\text{Avg. rate of change of } f(x)=x^2+1 \\text{ on } [0,3]","answer":["3"],"hint":"Use (f(3) − f(0)) / (3 − 0).","step":"\\frac{10-1}{3-0} = \\frac{9}{3} = 3"}; }
      function gen5() { return {"latex":"\\text{Avg. rate of change of } f(x)=2x^2-x \\text{ on } [1,4]","answer":["9"],"hint":"Use (f(4) − f(1)) / (4 − 1).","step":"\\frac{(32-4)-(2-1)}{3} = \\frac{28-1}{3} = 9"}; }
      function gen6() { return {"latex":"\\text{Avg. rate of change of } f(x)=\\ln x \\text{ on } [1,e]","answer":["1/(e-1)","0.582","0.58"],"hint":"Use (f(e) − f(1)) / (e − 1). Recall ln(1) = 0 and ln(e) = 1.","step":"\\frac{1-0}{e-1} = \\frac{1}{e-1} \\approx 0.582"}; }
      function gen7() { return {"latex":"\\text{Secant slope of } f(x)=\\sqrt{x} \\text{ on } [1,9]","answer":["0.25","1/4"],"hint":"Use (f(9) − f(1)) / (9 − 1).","step":"\\frac{3-1}{9-1} = \\frac{2}{8} = \\frac{1}{4}"}; }
      function gen8() { return {"latex":"\\text{Secant slope of } f(x)=\\tfrac{1}{x} \\text{ on } [1,4]","answer":["-1/4","-0.25"],"hint":"Use (f(4) − f(1)) / (4 − 1).","step":"\\frac{\\frac{1}{4}-1}{4-1} = \\frac{-\\frac{3}{4}}{3} = -\\frac{1}{4}"}; }
      function gen9() { return {"latex":"\\text{Secant slope of } f(x)=x^3 \\text{ on } [0,2]","answer":["4"],"hint":"Use (f(2) − f(0)) / (2 − 0).","step":"\\frac{8-0}{2-0} = \\frac{8}{2} = 4"}; }
      function gen10() { return {"latex":"\\text{Secant slope of } f(x)=\\sqrt{x} \\text{ on } [4,9]","answer":["0.2","1/5"],"hint":"Use (f(9) − f(4)) / (9 − 4).","step":"\\frac{3-2}{9-4} = \\frac{1}{5}"}; }
      function gen11() { return {"latex":"\\text{Secant slope of } f(x)=e^x \\text{ on } [0,1]","answer":["e-1","1.718","1.72"],"hint":"Use (f(1) − f(0)) / (1 − 0). Recall e⁰ = 1.","step":"\\frac{e^1 - e^0}{1-0} = e - 1 \\approx 1.718"}; }
      function gen12() { return {"latex":"\\text{Secant slope of } f(x)=x^2-2x \\text{ on } [1,3]","answer":["2"],"hint":"Use (f(3) − f(1)) / (3 − 1).","step":"\\frac{(9-6)-(1-2)}{3-1} = \\frac{3-(-1)}{2} = \\frac{4}{2} = 2"}; }
      function gen13() { return {"latex":"\\text{Estimate } f'(2) \\text{ given } f(1.9)=3.61,\\; f(2.1)=4.41","answer":["4"],"hint":"Use the symmetric difference: (f(2.1) − f(1.9)) / (2.1 − 1.9).","step":"\\frac{4.41-3.61}{0.2} = \\frac{0.80}{0.2} = 4"}; }
      function gen14() { return {"latex":"\\text{Estimate } f'(1) \\text{ given } f(0.9)=0.81,\\; f(1.1)=1.21","answer":["2"],"hint":"Use the symmetric difference: (f(1.1) − f(0.9)) / (1.1 − 0.9).","step":"\\frac{1.21-0.81}{0.2} = \\frac{0.40}{0.2} = 2"}; }
      function gen15() { return {"latex":"\\text{Avg. rate of change of } f(x)=\\tfrac{1}{x} \\text{ on } [1,2]","answer":["-1/2","-0.5","-0.50"],"hint":"Use (f(2) − f(1)) / (2 − 1).","step":"\\frac{\\frac{1}{2}-1}{2-1} = \\frac{-\\frac{1}{2}}{1} = -\\frac{1}{2}"}; }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11, gen12, gen13, gen14, gen15];
    })()
  };

  // §Calc_2_2: Derivative at a Point
  CALC1_SPIRAL["Calc_2_2"] = {
    title: "Derivative at a Point",
    index: 7,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: Constant function  f(x) = d,  f'(x) = 0
      function gen1() {
        const d = rInt(8)+2;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${d}`,
          answer: ['0'],
          hint: `A constant never changes. What is the slope of a horizontal line?`,
          step: `\\lim_{h\\to0}\\frac{${d}-${d}}{h}=\\lim_{h\\to0}0=0`
        };
      }

      // Slot 2: Linear  f(x) = ax + b,  f'(x) = a
      function gen2() {
        const a = rInt(4)+2, b = rInt(7)-3;
        const bStr = b===0?'':(b>0?` + ${b}`:` - ${Math.abs(b)}`);
        return {
          latex: `f'(x) \\text{ for } f(x) = ${a}x${bStr}`,
          answer: [String(a)],
          hint: `Linear functions have constant slope equal to the coefficient of x.`,
          step: `\\lim_{h\\to0}\\frac{${a}(x+h)${bStr}-(${a}x${bStr})}{h}=\\lim_{h\\to0}\\frac{${a}h}{h}=${a}`
        };
      }

      // Slot 3: Pure quadratic  f(x) = ax²,  f'(x) = 2ax  (symbolic answer)
      function gen3() {
        const a = rInt(4)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2`,
          answer: [`${coeff}x`],
          hint: `Expand ${a===1?'':a}(x+h)², subtract ${a===1?'':a}x², factor out h. Answer is an expression in x.`,
          step: `\\lim_{h\\to0}\\frac{${a}(x+h)^2-${a}x^2}{h}=\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2}{h}=${coeff}x`
        };
      }

      // Slot 4: Full quadratic  f(x) = ax² + bx,  f'(x) = 2ax + b  (symbolic)
      function gen4() {
        const a = rInt(3)+1, b = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2 + ${b}x`,
          answer: [`${coeff}x+${b}`, `${coeff}x + ${b}`],
          hint: `After expanding and subtracting, numerator = ${coeff}xh + ${a}h² + ${b}h. Factor out h.`,
          step: `\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2+${b}h}{h}=\\lim_{h\\to0}(${coeff}x+${a}h+${b})=${coeff}x+${b}`
        };
      }

      // Slot 5: Quadratic + constant  f(x) = ax² + bx + d,  f'(x) = 2ax + b  (d vanishes)
      function gen5() {
        const a = rInt(3)+1, b = rInt(5)+1, d = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2 + ${b}x + ${d}`,
          answer: [`${coeff}x+${b}`, `${coeff}x + ${b}`],
          hint: `The constant ${d} appears in both f(x+h) and f(x), so it cancels. Factor out h.`,
          step: `\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2+${b}h}{h}=${coeff}x+${b}`
        };
      }

      // Slot 6: Evaluate f'(c) from f(x) = ax² + bx  (numeric)
      function gen6() {
        const a = rInt(2)+1, b = rInt(4)+1, c = rInt(4)+1;
        const ans = 2*a*c+b;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2+${b}x,\\text{ find } f'(${c})`,
          answer: [String(ans)],
          hint: `First find f'(x) = ${2*a}x + ${b}, then substitute x = ${c}.`,
          step: `f'(x)=${2*a}x+${b};\\quad f'(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 7: Find x where f'(x) = 0  for  f(x) = ax² + bx,  answer = -k (integer)
      function gen7() {
        const a = rInt(3)+1, k = rInt(3)+1;
        const b = 2*a*k;   // ensures x = -k is exact integer solution
        const ans = -k;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2+${b}x,\\text{ find } x \\text{ where } f'(x)=0`,
          answer: [String(ans)],
          hint: `Find f'(x) = ${2*a}x + ${b}, set it equal to 0, solve for x.`,
          step: `f'(x)=${2*a}x+${b}=0\\Rightarrow x=${ans}`
        };
      }

      // Slot 8: Pure quadratic numeric eval  f(x) = ax²,  find f'(c) = 2ac
      function gen8() {
        const a = rInt(3)+1, c = rInt(4)+1;
        const ans = 2*a*c;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2,\\text{ find } f'(${c})`,
          answer: [String(ans)],
          hint: `f'(x) = ${2*a}x. Substitute x = ${c}.`,
          step: `f'(x)=${2*a}x;\\quad f'(${c})=${2*a}\\cdot${c}=${ans}`
        };
      }

      // Slot 9 (GRAPH): Read increasing/decreasing directly from the graph of f.
      function gen9() {
        const isPeak = choose([true,false]);
        const side = choose(['left','right']);
        const W=280,H=150;
        const Ax=30, Ay=105, Bx=250, By=105, Cx=140;
        const Cy = isPeak ? 25 : 185;
        const t = side==='left' ? 0.3 : 0.7;
        const qx = t => (1-t)*(1-t)*Ax + 2*(1-t)*t*Cx + t*t*Bx;
        const qy = t => (1-t)*(1-t)*Ay + 2*(1-t)*t*Cy + t*t*By;
        const px = qx(t), py = qy(t);
        const answer = isPeak
          ? (side==='left' ? 'increasing' : 'decreasing')
          : (side==='left' ? 'decreasing' : 'increasing');
        const sign = answer==='increasing' ? 'positive' : 'negative';
        const svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <path d="M ${Ax},${Ay} Q ${Cx},${Cy} ${Bx},${By}" stroke="#1a1a1a" stroke-width="2" fill="none"/>
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="#1e3a5c" stroke="white" stroke-width="1.3"/>
        <text x="${px.toFixed(1)}" y="${(py-10).toFixed(1)}" font-size="10" font-family="sans-serif" fill="#1e3a5c" text-anchor="middle" font-weight="bold">P</text>
      </svg>`;
        return {
          svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Based on the graph of f shown, is f increasing or decreasing at the marked point P?</div>${svg}`,
          answer: [answer],
          hint: `Read the graph left to right through P. Is the curve going up or down there?`,
          step: `\\text{At }P\\text{ the curve is }\\text{${answer}}\\text{, so }f'(x)\\text{ is }\\text{${sign}}\\text{ there.}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9];
    })()
  };

  // §Calc_2_2_5: Derivative as a Function
  CALC1_SPIRAL["Calc_2_2_5"] = {
    title: "Derivative as a Function",
    index: 8,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: Constant function  f(x) = d,  f'(x) = 0
      function gen1() {
        const d = rInt(8)+2;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${d}`,
          answer: ['0'],
          hint: `A constant never changes. What is the slope of a horizontal line?`,
          step: `\\lim_{h\\to0}\\frac{${d}-${d}}{h}=\\lim_{h\\to0}0=0`
        };
      }

      // Slot 2: Linear  f(x) = ax + b,  f'(x) = a
      function gen2() {
        const a = rInt(4)+2, b = rInt(7)-3;
        const bStr = b===0?'':(b>0?` + ${b}`:` - ${Math.abs(b)}`);
        return {
          latex: `f'(x) \\text{ for } f(x) = ${a}x${bStr}`,
          answer: [String(a)],
          hint: `Linear functions have constant slope equal to the coefficient of x.`,
          step: `\\lim_{h\\to0}\\frac{${a}(x+h)${bStr}-(${a}x${bStr})}{h}=\\lim_{h\\to0}\\frac{${a}h}{h}=${a}`
        };
      }

      // Slot 3: Pure quadratic  f(x) = ax²,  f'(x) = 2ax  (symbolic answer)
      function gen3() {
        const a = rInt(4)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2`,
          answer: [`${coeff}x`],
          hint: `Expand ${a===1?'':a}(x+h)², subtract ${a===1?'':a}x², factor out h. Answer is an expression in x.`,
          step: `\\lim_{h\\to0}\\frac{${a}(x+h)^2-${a}x^2}{h}=\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2}{h}=${coeff}x`
        };
      }

      // Slot 4: Full quadratic  f(x) = ax² + bx,  f'(x) = 2ax + b  (symbolic)
      function gen4() {
        const a = rInt(3)+1, b = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2 + ${b}x`,
          answer: [`${coeff}x+${b}`, `${coeff}x + ${b}`],
          hint: `After expanding and subtracting, numerator = ${coeff}xh + ${a}h² + ${b}h. Factor out h.`,
          step: `\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2+${b}h}{h}=\\lim_{h\\to0}(${coeff}x+${a}h+${b})=${coeff}x+${b}`
        };
      }

      // Slot 5: Quadratic + constant  f(x) = ax² + bx + d,  f'(x) = 2ax + b  (d vanishes)
      function gen5() {
        const a = rInt(3)+1, b = rInt(5)+1, d = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `f'(x) \\text{ for } f(x) = ${fc(a)}x^2 + ${b}x + ${d}`,
          answer: [`${coeff}x+${b}`, `${coeff}x + ${b}`],
          hint: `The constant ${d} appears in both f(x+h) and f(x), so it cancels. Factor out h.`,
          step: `\\lim_{h\\to0}\\frac{${coeff}xh+${a}h^2+${b}h}{h}=${coeff}x+${b}`
        };
      }

      // Slot 6: Evaluate f'(c) from f(x) = ax² + bx  (numeric)
      function gen6() {
        const a = rInt(2)+1, b = rInt(4)+1, c = rInt(4)+1;
        const ans = 2*a*c+b;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2+${b}x,\\text{ find } f'(${c})`,
          answer: [String(ans)],
          hint: `First find f'(x) = ${2*a}x + ${b}, then substitute x = ${c}.`,
          step: `f'(x)=${2*a}x+${b};\\quad f'(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 7: Find x where f'(x) = 0  for  f(x) = ax² + bx,  answer = -k (integer)
      function gen7() {
        const a = rInt(3)+1, k = rInt(3)+1;
        const b = 2*a*k;   // ensures x = -k is exact integer solution
        const ans = -k;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2+${b}x,\\text{ find } x \\text{ where } f'(x)=0`,
          answer: [String(ans)],
          hint: `Find f'(x) = ${2*a}x + ${b}, set it equal to 0, solve for x.`,
          step: `f'(x)=${2*a}x+${b}=0\\Rightarrow x=${ans}`
        };
      }

      // Slot 8: Pure quadratic numeric eval  f(x) = ax²,  find f'(c) = 2ac
      function gen8() {
        const a = rInt(3)+1, c = rInt(4)+1;
        const ans = 2*a*c;
        return {
          latex: `\\text{For } f(x)=${fc(a)}x^2,\\text{ find } f'(${c})`,
          answer: [String(ans)],
          hint: `f'(x) = ${2*a}x. Substitute x = ${c}.`,
          step: `f'(x)=${2*a}x;\\quad f'(${c})=${2*a}\\cdot${c}=${ans}`
        };
      }

      // Slot 9 (GRAPH): Read increasing/decreasing directly from the graph of f.
      function gen9() {
        const isPeak = choose([true,false]);
        const side = choose(['left','right']);
        const W=280,H=150;
        const Ax=30, Ay=105, Bx=250, By=105, Cx=140;
        const Cy = isPeak ? 25 : 185;
        const t = side==='left' ? 0.3 : 0.7;
        const qx = t => (1-t)*(1-t)*Ax + 2*(1-t)*t*Cx + t*t*Bx;
        const qy = t => (1-t)*(1-t)*Ay + 2*(1-t)*t*Cy + t*t*By;
        const px = qx(t), py = qy(t);
        const answer = isPeak
          ? (side==='left' ? 'increasing' : 'decreasing')
          : (side==='left' ? 'decreasing' : 'increasing');
        const sign = answer==='increasing' ? 'positive' : 'negative';
        const svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <path d="M ${Ax},${Ay} Q ${Cx},${Cy} ${Bx},${By}" stroke="#1a1a1a" stroke-width="2" fill="none"/>
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="#1e3a5c" stroke="white" stroke-width="1.3"/>
        <text x="${px.toFixed(1)}" y="${(py-10).toFixed(1)}" font-size="10" font-family="sans-serif" fill="#1e3a5c" text-anchor="middle" font-weight="bold">P</text>
      </svg>`;
        return {
          svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Based on the graph of f shown, is f increasing or decreasing at the marked point P?</div>${svg}`,
          answer: [answer],
          hint: `Read the graph left to right through P. Is the curve going up or down there?`,
          step: `\\text{At }P\\text{ the curve is }\\text{${answer}}\\text{, so }f'(x)\\text{ is }\\text{${sign}}\\text{ there.}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9];
    })()
  };

  // §Calc_2_2_6: Differentiability
  CALC1_SPIRAL["Calc_2_2_6"] = {
    title: "Differentiability",
    index: 9,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: Piecewise smoothly joined (quadratic meets its own tangent line) → "yes"
      function gen1() {
        const c = rInt(3)+1;  // c in {1,2,3}
        const slope = 2*c, intercept = -(c*c);
        const intStr = intercept < 0 ? String(intercept) : '+' + intercept;
        return {
          latex: `\\text{Is } f(x)=\\begin{cases}x^2 & x\\le${c}\\\\${slope}x${intStr} & x>${c}\\end{cases} \\text{ differentiable at } x=${c}\\text{?}`,
          answer: ['yes', 'y'],
          hint: `Check: (1) are the values equal at x=${c}? (2) are the slopes equal at x=${c}?`,
          step: `f(${c}^-)=${c}^2=${c*c};\\;f(${c}^+)=${slope}(${c})${intStr}=${c*c}\\;\\checkmark\\quad f'(${c}^-)=2(${c})=${slope};\\;f'(${c}^+)=${slope}\\;\\checkmark`
        };
      }

      // Slot 2: Piecewise with slope mismatch → "no"
      function gen2() {
        const a = rInt(3)+2, b = a + rInt(3)+1;  // b > a, so slopes differ
        return {
          latex: `\\text{Is } f(x)=\\begin{cases}${a}x & x\\le0\\\\${b}x & x>0\\end{cases} \\text{ differentiable at } x=0\\text{?}`,
          answer: ['no', 'n'],
          hint: `Check continuity first — do the two pieces agree at x=0? Then compare the slopes from each side.`,
          step: `f'(0^-)=${a},\\;f'(0^+)=${b};\\quad ${a}\\ne${b}\\Rightarrow\\text{not differentiable (corner)}`
        };
      }

      // Slot 3: Absolute value — always a corner → "no"
      function gen3() {
        const a = rInt(4)+1;  // shift: |x - a|
        return {
          latex: `\\text{Is } f(x)=|x-${a}| \\text{ differentiable at } x=${a}\\text{?}`,
          answer: ['no', 'n'],
          hint: `Compute left and right derivatives at x=${a} using the limit definition.`,
          step: `f'(${a}^-)=\\lim_{h\\to0^-}\\frac{|h|}{h}=-1;\\quad f'(${a}^+)=1;\\quad -1\\ne1`
        };
      }

      // Slot 4: Smooth polynomial — always differentiable → "yes"
      function gen4() {
        const a = rInt(3)+1, b = rInt(5)-2, c = rInt(5)-2;
        const bStr = b===0?'':(b>0?` + ${b}`:` - ${Math.abs(b)}`);
        const cStr = c===0?'':(c>0?` + ${c}`:` - ${Math.abs(c)}`);
        const pt = rInt(5)-2;
        return {
          latex: `\\text{Is } f(x)=${fc(a)}x^2${bStr}x${cStr} \\text{ differentiable at } x=${pt}\\text{?}`,
          answer: ['yes', 'y'],
          hint: `Think about what the graph of this function looks like. What kinds of functions are differentiable everywhere?`,
          step: `\\text{Polynomials are differentiable everywhere.}\\;f'(${pt})\\text{ exists.}`
        };
      }

      // Slot 5 (GRAPH): Usually a corner (unequal slopes meeting at x=c → "no"), but
      // sometimes a smooth curve with no corner at all → "yes". Previously this slot
      // was always "no", which meant neither graph question ever tested the "yes"
      // case (2026-09-02 instructor request).
      function gen5() {
        const c  = rInt(5) - 2;     // c in {-2,-1,0,1,2}
        const W=280, H=160, cx=140, cy=80, dx=35;
        if (rInt(2) === 0) {
          // Smooth curve through the marked point — no corner, so differentiable.
          const bulge = choose([-40, -30, 30, 40]);
          const x0=cx-dx, y0=cy, x2=cx+dx, y2=cy, ctrlx=cx, ctrly=cy+bulge;
          const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <line x1="15" y1="${cy}" x2="${W-15}" y2="${cy}" stroke="#ccc" stroke-width="1"/>
        <line x1="${cx}" y1="5" x2="${cx}" y2="${H-22}" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>
        <path d="M ${x0},${y0} Q ${ctrlx},${ctrly} ${x2},${y2}" stroke="#1e3a5c" stroke-width="2.5" fill="none"/>
        <circle cx="${cx}" cy="${(y0+2*ctrly+y2)/4}" r="4" fill="#1e3a5c"/>
        <text x="${cx}" y="${H-6}" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#555">x = ${c}</text>
      </svg>`;
          return {
            svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Is <em>f</em> differentiable at <em>x</em> = ${c}?</div>${svg}`,
            answer: ['yes', 'y'],
            hint: `Look at the slopes on each side of x = ${c}. Is there any corner, jump, or break in the curve?`,
            step: `\\text{Yes — the curve is smooth at }x=${c}\\text{: no corner, no jump, no vertical tangent.}`
          };
        }
        const mL = rInt(2) + 1;     // left slope: 1 or 2
        const mR = -(rInt(2) + 1);  // right slope: -1 or -2
        const x0=cx-dx, y0=cy+mL*dx;   // left endpoint (below corner in SVG)
        const x2=cx+dx, y2=cy-mR*dx;   // right endpoint (mR<0 so -mR>0, also below corner)
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <line x1="15" y1="${cy}" x2="${W-15}" y2="${cy}" stroke="#ccc" stroke-width="1"/>
        <line x1="${cx}" y1="5" x2="${cx}" y2="${H-22}" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>
        <polyline points="${x0},${y0} ${cx},${cy} ${x2},${y2}" stroke="#1e3a5c" stroke-width="2.5" fill="none" stroke-linejoin="miter"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#1e3a5c"/>
        <text x="${cx}" y="${H-6}" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#555">x = ${c}</text>
      </svg>`;
        return {
          svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Is <em>f</em> differentiable at <em>x</em> = ${c}?</div>${svg}`,
          answer: ['no', 'n'],
          hint: `Look at the slopes on each side of x = ${c}. Do the left and right sides match?`,
          step: `\\text{No — corner at }x=${c}.\\text{ Left slope}=${mL},\\text{ right slope}=${mR}.`
        };
      }

      // Slot 6 (GRAPH): Usually a jump discontinuity → "no", but sometimes a
      // continuous straight line through the marked point → "yes" (same fix as
      // gen5 above — this slot was always "no" before 2026-09-02).
      function gen6() {
        const c    = rInt(5) - 2;       // c in {-2,-1,0,1,2}
        const W=280, H=130, cx=140, cy=65, dx=55;
        if (rInt(2) === 0) {
          const m = choose([-0.6, -0.3, 0, 0.3, 0.6]);
          const y0 = cy - m*dx, y2 = cy + m*dx;
          const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <line x1="15" y1="${cy}" x2="${W-15}" y2="${cy}" stroke="#ccc" stroke-width="1"/>
        <line x1="${cx}" y1="5" x2="${cx}" y2="${H-20}" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>
        <line x1="${cx-dx}" y1="${y0}" x2="${cx+dx}" y2="${y2}" stroke="#1e3a5c" stroke-width="2.5"/>
        <circle cx="${cx}" cy="${cy}" r="4.5" fill="#1e3a5c"/>
        <text x="${cx}" y="${H-4}" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#555">x = ${c}</text>
      </svg>`;
          return {
            svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Is <em>f</em> differentiable at <em>x</em> = ${c}?</div>${svg}`,
            answer: ['yes', 'y'],
            hint: `Is f continuous at x = ${c}? Check whether the left and right limits agree, and whether the slopes match too.`,
            step: `\\text{Yes — the line passes straight through }x=${c}\\text{: no jump, no corner.}`
          };
        }
        const jsgn = rInt(2)*2 - 1;     // +1 or -1 (jump direction)
        const jump = 32;                 // pixel height of jump
        const yL = cy;                   // left piece y (limit from left)
        const yR = cy - jsgn*jump;      // right piece y (actual value)
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border:1px solid #e8e4dc;border-radius:6px;background:#fafaf8">
        <line x1="15" y1="${cy}" x2="${W-15}" y2="${cy}" stroke="#ccc" stroke-width="1"/>
        <line x1="${cx}" y1="5" x2="${cx}" y2="${H-20}" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>
        <line x1="${cx-dx}" y1="${yL}" x2="${cx-5}" y2="${yL}" stroke="#1e3a5c" stroke-width="2.5"/>
        <circle cx="${cx}" cy="${yL}" r="4.5" fill="white" stroke="#1e3a5c" stroke-width="2.5"/>
        <circle cx="${cx}" cy="${yR}" r="4.5" fill="#1e3a5c"/>
        <line x1="${cx}" y1="${yR}" x2="${cx+dx}" y2="${yR}" stroke="#1e3a5c" stroke-width="2.5"/>
        <text x="${cx}" y="${H-4}" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#555">x = ${c}</text>
      </svg>`;
        return {
          svg: `<div style="font-family:sans-serif;font-size:14px;margin-bottom:6px">Is <em>f</em> differentiable at <em>x</em> = ${c}?</div>${svg}`,
          answer: ['no', 'n'],
          hint: `Is f even continuous at x = ${c}? Check whether the left and right limits agree.`,
          step: `\\text{No — jump discontinuity at }x=${c}.\\text{ Not continuous, so not differentiable.}`
        };
      }

      // Slot 7: Find parameter a so piecewise is differentiable at x=c
      // f(x) = {ax - c², x≤c ; x², x>c}  →  a = 2c (matches slope AND continuity)
      function gen7() {
        const c = rInt(3)+1;
        const a = 2*c, b = -(c*c);
        const bStr = b < 0 ? String(b) : '+'+b;
        return {
          latex: `\\text{Find } a \\text{ so } f(x)=\\begin{cases}ax${bStr} & x\\le${c}\\\\x^2 & x>${c}\\end{cases} \\text{ is differentiable at } x=${c}`,
          answer: [String(a)],
          hint: `For differentiability, slopes from both sides must match. What is the slope of x² at x=${c}? What must the left side\\'s slope equal?`,
          step: `f'(${c}^+)=2(${c})=${a};\\quad\\text{need left slope }a=${a}\\quad\\checkmark\\text{ (also continuous)}`
        };
      }

      // Slot 8: Vertical tangent — sqrt at 0 → "no"
      function gen8() {
        const a = rInt(3)+1;
        return {
          latex: `\\text{Is } f(x)=\\sqrt{x} \\text{ differentiable at } x=0\\text{?}`,
          answer: ['no', 'n'],
          hint: `Write out the limit definition of f\\'(0) using a one-sided limit. What does the expression simplify to, and what happens as h→0⁺?`,
          step: `\\lim_{h\\to0^+}\\frac{\\sqrt{h}}{h}=\\lim_{h\\to0^+}\\frac{1}{\\sqrt{h}}=+\\infty\\Rightarrow\\text{vertical tangent, not differentiable}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_2_3: Power Rule
  CALC1_SPIRAL["Calc_2_3"] = {
    title: "Power Rule",
    index: 10,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }

      // General term formatter for answer/step strings. exp is a string:
      // '0' (constant), '1' (plain x), a plain positive integer ('2','3',...), or a
      // negative/fractional exponent ('-1/2','-2','-3','-2/3', ...). Negative and
      // fractional exponents are always wrapped in parentheses: x^(-1/2). Plain
      // positive integer exponents are not: x^2.
      function fmtTerm(c, exp) {
        const neg = c < 0, abs = Math.abs(c);
        const isPlainPositiveInt = /^\d+$/.test(exp) && exp !== '0';
        const cs = (abs === 1 && exp !== '0') ? '' : String(abs);
        let xs;
        if (exp === '0') xs = '';
        else if (exp === '1') xs = 'x';
        else if (isPlainPositiveInt) xs = 'x^' + exp;
        else xs = 'x^(' + exp + ')';
        return (neg ? '-' : '') + cs + xs;
      }
      function fmtTail(c, exp) {
        if (c === 0) return '';
        const sign = c > 0 ? '+' : '-';
        return sign + fmtTerm(Math.abs(c), exp);
      }

      // ── Problem generators — every problem asks for f'(x) ──────────────────────────
      // Progression: sum + constant multiple (review) → pure root → root + sum →
      // pure fraction-power → fraction + sum → root + fraction → everything combined.

      // gen1: f(x) = ax^3 + bx^2
      function gen1() {
        const a = rInt(4) + 1, b = rInt(6) + 1;
        const ans = fmtTerm(3 * a, '2') + fmtTail(2 * b, '1');
        return {
          latex: `f'(x) \\text{ for } f(x)=${fc(a)}x^3+${b}x^2`,
          answer: [ans],
          hint: `Differentiate each term separately using the power rule.`,
          step: `f'(x)=${3 * a}x^2+${2 * b}x`
        };
      }

      // gen2: f(x) = ax^4 + bx + c  (constant term vanishes)
      function gen2() {
        const a = rInt(3) + 1, b = rInt(6) + 1, c = rInt(9) + 1;
        const ans = fmtTerm(4 * a, '3') + fmtTail(b, '0');
        return {
          latex: `f'(x) \\text{ for } f(x)=${fc(a)}x^4+${b}x+${c}`,
          answer: [ans],
          hint: `Differentiate term by term — the constant term disappears.`,
          step: `f'(x)=${4 * a}x^3+${b}`
        };
      }

      // gen3: f(x) = a√x  (pure root)
      function gen3() {
        const a = choose([2, 4, 6, 8]);
        const c3 = a / 2;
        const ans = fmtTerm(c3, '-1/2');
        return {
          latex: `f'(x) \\text{ for } f(x)=${a}\\sqrt{x}`,
          answer: [ans],
          hint: `Rewrite √x as x^(1/2), then apply the power rule.`,
          step: `f(x)=${a}x^{1/2}\\Rightarrow f'(x)=${a}\\cdot\\tfrac12x^{-1/2}=${c3}x^{-1/2}`
        };
      }

      // gen4: f(x) = a√x + bx  (root + sum)
      function gen4() {
        const a = choose([2, 4, 6]), b = rInt(5) + 1;
        const c4 = a / 2;
        const ans = fmtTerm(c4, '-1/2') + fmtTail(b, '0');
        return {
          latex: `f'(x) \\text{ for } f(x)=${a}\\sqrt{x}+${b}x`,
          answer: [ans],
          hint: `Rewrite √x as x^(1/2) first, then differentiate each term separately.`,
          step: `f(x)=${a}x^{1/2}+${b}x\\Rightarrow f'(x)=${c4}x^{-1/2}+${b}`
        };
      }

      // gen5: f(x) = a / x^n  (pure fraction-power)
      function gen5() {
        const a = choose([2, 3, 4, 6]), n = choose([2, 3]);
        const c5 = -a * n, newExp = -(n + 1);
        const ans = fmtTerm(c5, String(newExp));
        return {
          latex: `f'(x) \\text{ for } f(x)=\\dfrac{${a}}{x^{${n}}}`,
          answer: [ans],
          hint: `Rewrite the fraction as x raised to a negative power, then apply the power rule.`,
          step: `f(x)=${a}x^{-${n}}\\Rightarrow f'(x)=${a}\\cdot(-${n})x^{-${n}-1}=${c5}x^{${newExp}}`
        };
      }

      // gen6: f(x) = ax^2 + b/x  (fraction + sum)
      function gen6() {
        const a = rInt(3) + 1, b = rInt(8) + 2;
        const ans = fmtTerm(2 * a, '1') + fmtTail(-b, '-2');
        return {
          latex: `f'(x) \\text{ for } f(x)=${fc(a)}x^2+\\dfrac{${b}}{x}`,
          answer: [ans],
          hint: `Rewrite ${b}/x as ${b}x^(-1), then differentiate each term.`,
          step: `f(x)=${a}x^2+${b}x^{-1}\\Rightarrow f'(x)=${2 * a}x-${b}x^{-2}`
        };
      }

      // gen7: f(x) = a∛x - b/x^n  (root + fraction)
      function gen7() {
        const a = choose([3, 6, 9]), b = choose([2, 3, 4, 6]), n = choose([1, 2]);
        const c7a = a / 3, c7b = b * n, newExp = -(n + 1);
        const ans = fmtTerm(c7a, '-2/3') + fmtTail(c7b, String(newExp));
        return {
          latex: `f'(x) \\text{ for } f(x)=${a}\\sqrt[3]{x}-\\dfrac{${b}}{x^{${n}}}`,
          answer: [ans],
          hint: `Rewrite the cube root and the fraction as powers of x, then differentiate each term.`,
          step: `f(x)=${a}x^{1/3}-${b}x^{-${n}}\\Rightarrow f'(x)=${a}\\cdot\\tfrac13x^{-2/3}-${b}\\cdot(-${n})x^{-${n}-1}=${c7a}x^{-2/3}+${c7b}x^{${newExp}}`
        };
      }

      // gen8: f(x) = ax^2 + b√x - c/x^2  (everything combined)
      function gen8() {
        const a = rInt(3) + 1, b = choose([2, 4, 6]), c = choose([2, 3, 4, 6]);
        const c8b = b / 2, c8c = 2 * c;
        const ans = fmtTerm(2 * a, '1') + fmtTail(c8b, '-1/2') + fmtTail(c8c, '-3');
        return {
          latex: `f'(x) \\text{ for } f(x)=${fc(a)}x^2+${b}\\sqrt{x}-\\dfrac{${c}}{x^{2}}`,
          answer: [ans],
          hint: `Rewrite the root and the fraction as powers of x first, then differentiate term by term.`,
          step: `f(x)=${a}x^2+${b}x^{1/2}-${c}x^{-2}\\Rightarrow f'(x)=${2 * a}x+${c8b}x^{-1/2}+${c8c}x^{-3}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_2_4: Trig, Exp, and Log Derivatives
  CALC1_SPIRAL["Calc_2_4"] = {
    title: "Trig, Exp, and Log Derivatives",
    index: 11,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: s(t)=at²+bt, find v(t)=2at+b — symbolic
      function gen1() {
        const a = rInt(4)+1, b = rInt(6)+1;
        const coeff = 2*a;
        return {
          latex: `v(t) \\text{ for } s(t)=${fc(a)}t^2+${b}t`,
          answer: [coeff+'t+'+b, coeff+'t + '+b],
          hint: `v(t)=s'(t). Differentiate using the power rule.`,
          step: `v(t)=s'(t)=${coeff}t+${b}`
        };
      }

      // Slot 2: s(t)=at²+bt, find v(c) — integer
      function gen2() {
        const a = rInt(3)+1, b = rInt(4)+1, c = rInt(3)+1;
        const ans = 2*a*c + b;
        return {
          latex: `v(${c}) \\text{ for } s(t)=${fc(a)}t^2+${b}t`,
          answer: [String(ans)],
          hint: `Find v(t)=s\\'(t) first using the power rule, then substitute t=${c}.`,
          step: `v(t)=${2*a}t+${b};\\quad v(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 3: s(t)=at³+bt², find a(t)=6at+2b — symbolic
      function gen3() {
        const a = rInt(3)+1, b = rInt(4)+1;
        const c1 = 6*a, c2 = 2*b;
        return {
          latex: `a(t) \\text{ for } s(t)=${fc(a)}t^3+${b}t^2`,
          answer: [c1+'t+'+c2, c1+'t + '+c2],
          hint: `Differentiate twice: v(t)=s\\'(t), then a(t)=v\\'(t). Apply power rule each time.`,
          step: `v(t)=${3*a}t^2+${2*b}t;\\quad a(t)=${c1}t+${c2}`
        };
      }

      // Slot 4: v(t)=at+b, find a(t)=a — integer (constant)
      function gen4() {
        const a = rInt(5)+1, b = rInt(6)+1;
        return {
          latex: `a(t) \\text{ for } v(t)=${a}t+${b}`,
          answer: [String(a)],
          hint: `a(t)=v\\'(t). Differentiate the velocity function — what happens to each term?`,
          step: `a(t)=v'(t)=${a}`
        };
      }

      // Slot 5: s(t)=at²-2ak·t, v=0 at t=k — integer
      function gen5() {
        const a = rInt(3)+1, k = rInt(4)+1;
        const b = 2*a*k;
        return {
          latex: `\\text{Find } t \\text{ when } v(t)=0 \\text{ for } s(t)=${fc(a)}t^2-${b}t`,
          answer: [String(k)],
          hint: `Find v(t)=s\\'(t), then think about what v(t)=0 means physically. Solve for t.`,
          step: `v(t)=${2*a}t-${b}=0\\Rightarrow t=${k}`
        };
      }

      // Slot 6: s(t)=at²-bt, find boundary t where v>0 — integer
      function gen6() {
        const a = rInt(3)+1, k = rInt(4)+1;
        const b = 2*a*k;
        return {
          latex: `\\text{For } s(t)=${fc(a)}t^2-${b}t, \\text{ find } t \\text{ when object moves forward}`,
          answer: [String(k), 't>'+k],
          hint: `"Moving forward" means v(t)>0. Find v(t)=s\\'(t), then solve the inequality.`,
          step: `v(t)=${2*a}t-${b}>0\\Rightarrow t>${k}`
        };
      }

      // Slot 7: C(x)=ax²+bx, find C'(x) — symbolic
      function gen7() {
        const a = rInt(3)+1, b = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `C'(x) \\text{ for } C(x)=${fc(a)}x^2+${b}x`,
          answer: [coeff+'x+'+b, coeff+'x + '+b],
          hint: `Marginal cost = C'(x). Apply the power rule.`,
          step: `C'(x)=${coeff}x+${b}`
        };
      }

      // Slot 8: C(x)=ax²+bx, evaluate C'(c) — integer
      function gen8() {
        const a = rInt(3)+1, b = rInt(5)+1, c = rInt(4)+1;
        const ans = 2*a*c + b;
        return {
          latex: `C'(${c}) \\text{ for } C(x)=${fc(a)}x^2+${b}x`,
          answer: [String(ans)],
          hint: `Differentiate C(x) using the power rule to get marginal cost, then substitute x=${c}.`,
          step: `C'(x)=${2*a}x+${b};\\quad C'(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 9: Physics word problem — velocity at time t
      function gen9() {
        const a = rInt(3)+1, b = rInt(5)+2, c = rInt(3)+1;
        const ans = 2*a*c + b;
        return {
          latex: `\\text{A car's position is } s(t)=${fc(a)}t^2+${b}t \\text{ ft. Find its velocity at } t=${c} \\text{ sec.}`,
          answer: [String(ans)],
          hint: `Velocity is the derivative of position. Find s\\'(t), then substitute t=${c}. Don\\'t forget units.`,
          step: `v(t)=${2*a}t+${b};\\quad v(${c})=${2*a}(${c})+${b}=${ans}\\text{ ft/sec}`
        };
      }

      // Slot 10: Marginal cost word problem
      function gen10() {
        const a = rInt(3)+1, b = rInt(5)+2, c = rInt(4)+1;
        const ans = 2*a*c + b;
        return {
          latex: `\\text{Cost to produce } x \\text{ items: } C(x)=${fc(a)}x^2+${b}x \\text{ dollars. Find marginal cost at } x=${c}.`,
          answer: [String(ans)],
          hint: `Marginal cost means C\\'(x). Differentiate, then substitute x=${c}.`,
          step: `C'(x)=${2*a}x+${b};\\quad C'(${c})=${2*a}(${c})+${b}=${ans}\\text{ dollars}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10];
    })()
  };

  // §Calc_2_4_5: Rates of Change
  CALC1_SPIRAL["Calc_2_4_5"] = {
    title: "Rates of Change",
    index: 12,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: s(t)=at²+bt, find v(t)=2at+b — symbolic
      function gen1() {
        const a = rInt(4)+1, b = rInt(6)+1;
        const coeff = 2*a;
        return {
          latex: `v(t) \\text{ for } s(t)=${fc(a)}t^2+${b}t`,
          answer: [coeff+'t+'+b, coeff+'t + '+b],
          hint: `v(t)=s'(t). Differentiate using the power rule.`,
          step: `v(t)=s'(t)=${coeff}t+${b}`
        };
      }

      // Slot 2: s(t)=at²+bt, find v(c) — integer
      function gen2() {
        const a = rInt(3)+1, b = rInt(4)+1, c = rInt(3)+1;
        const ans = 2*a*c + b;
        return {
          latex: `v(${c}) \\text{ for } s(t)=${fc(a)}t^2+${b}t`,
          answer: [String(ans)],
          hint: `Find v(t)=s\\'(t) first using the power rule, then substitute t=${c}.`,
          step: `v(t)=${2*a}t+${b};\\quad v(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 3: s(t)=at³+bt², find a(t)=6at+2b — symbolic
      function gen3() {
        const a = rInt(3)+1, b = rInt(4)+1;
        const c1 = 6*a, c2 = 2*b;
        return {
          latex: `a(t) \\text{ for } s(t)=${fc(a)}t^3+${b}t^2`,
          answer: [c1+'t+'+c2, c1+'t + '+c2],
          hint: `Differentiate twice: v(t)=s\\'(t), then a(t)=v\\'(t). Apply power rule each time.`,
          step: `v(t)=${3*a}t^2+${2*b}t;\\quad a(t)=${c1}t+${c2}`
        };
      }

      // Slot 4: v(t)=at+b, find a(t)=a — integer (constant)
      function gen4() {
        const a = rInt(5)+1, b = rInt(6)+1;
        return {
          latex: `a(t) \\text{ for } v(t)=${a}t+${b}`,
          answer: [String(a)],
          hint: `a(t)=v\\'(t). Differentiate the velocity function — what happens to each term?`,
          step: `a(t)=v'(t)=${a}`
        };
      }

      // Slot 5: s(t)=at²-2ak·t, v=0 at t=k — integer
      function gen5() {
        const a = rInt(3)+1, k = rInt(4)+1;
        const b = 2*a*k;
        return {
          latex: `\\text{Find } t \\text{ when } v(t)=0 \\text{ for } s(t)=${fc(a)}t^2-${b}t`,
          answer: [String(k)],
          hint: `Find v(t)=s\\'(t), then think about what v(t)=0 means physically. Solve for t.`,
          step: `v(t)=${2*a}t-${b}=0\\Rightarrow t=${k}`
        };
      }

      // Slot 6: s(t)=at²-bt, find boundary t where v>0 — integer
      function gen6() {
        const a = rInt(3)+1, k = rInt(4)+1;
        const b = 2*a*k;
        return {
          latex: `\\text{For } s(t)=${fc(a)}t^2-${b}t, \\text{ find } t \\text{ when object moves forward}`,
          answer: [String(k), 't>'+k],
          hint: `"Moving forward" means v(t)>0. Find v(t)=s\\'(t), then solve the inequality.`,
          step: `v(t)=${2*a}t-${b}>0\\Rightarrow t>${k}`
        };
      }

      // Slot 7: C(x)=ax²+bx, find C'(x) — symbolic
      function gen7() {
        const a = rInt(3)+1, b = rInt(5)+1;
        const coeff = 2*a;
        return {
          latex: `C'(x) \\text{ for } C(x)=${fc(a)}x^2+${b}x`,
          answer: [coeff+'x+'+b, coeff+'x + '+b],
          hint: `Marginal cost = C'(x). Apply the power rule.`,
          step: `C'(x)=${coeff}x+${b}`
        };
      }

      // Slot 8: C(x)=ax²+bx, evaluate C'(c) — integer
      function gen8() {
        const a = rInt(3)+1, b = rInt(5)+1, c = rInt(4)+1;
        const ans = 2*a*c + b;
        return {
          latex: `C'(${c}) \\text{ for } C(x)=${fc(a)}x^2+${b}x`,
          answer: [String(ans)],
          hint: `Differentiate C(x) using the power rule to get marginal cost, then substitute x=${c}.`,
          step: `C'(x)=${2*a}x+${b};\\quad C'(${c})=${2*a}(${c})+${b}=${ans}`
        };
      }

      // Slot 9: Physics word problem — velocity at time t
      function gen9() {
        const a = rInt(3)+1, b = rInt(5)+2, c = rInt(3)+1;
        const ans = 2*a*c + b;
        return {
          latex: `\\text{A car's position is } s(t)=${fc(a)}t^2+${b}t \\text{ ft. Find its velocity at } t=${c} \\text{ sec.}`,
          answer: [String(ans)],
          hint: `Velocity is the derivative of position. Find s\\'(t), then substitute t=${c}. Don\\'t forget units.`,
          step: `v(t)=${2*a}t+${b};\\quad v(${c})=${2*a}(${c})+${b}=${ans}\\text{ ft/sec}`
        };
      }

      // Slot 10: Marginal cost word problem
      function gen10() {
        const a = rInt(3)+1, b = rInt(5)+2, c = rInt(4)+1;
        const ans = 2*a*c + b;
        return {
          latex: `\\text{Cost to produce } x \\text{ items: } C(x)=${fc(a)}x^2+${b}x \\text{ dollars. Find marginal cost at } x=${c}.`,
          answer: [String(ans)],
          hint: `Marginal cost means C\\'(x). Differentiate, then substitute x=${c}.`,
          step: `C'(x)=${2*a}x+${b};\\quad C'(${c})=${2*a}(${c})+${b}=${ans}\\text{ dollars}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10];
    })()
  };

  // §Calc_2_5: Product and Quotient Rules
  CALC1_SPIRAL["Calc_2_5"] = {
    title: "Product and Quotient Rules",
    index: 13,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: (ax+b)(cx+d), find f'(x) at x=0 — integer
      function gen1() {
        const a=rInt(3)+1, b=rInt(4)+1, c=rInt(3)+1, d=rInt(4)+1;
        // f'(x) = a(cx+d) + (ax+b)c = acx+ad + acx+bc = 2acx + ad+bc
        // f'(0) = ad + bc
        const ans = a*d + b*c;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${a}x+${b})(${c}x+${d})`,
          answer: [String(ans)],
          hint: `Apply product rule — what are your two factors and their derivatives? Then substitute x=0.`,
          step: `f'(x)=${a}(${c}x+${d})+(${a}x+${b})(${c});\\quad f'(0)=${a*d}+${b*c}=${ans}`
        };
      }

      // Slot 2: (ax+b)·e^x, find f'(0) — integer
      function gen2() {
        const a=rInt(4)+1, b=rInt(5)+1;
        // f'(x) = a·e^x + (ax+b)·e^x = (ax+a+b)e^x
        // f'(0) = a + b
        const ans = a + b;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${a}x+${b})e^x`,
          answer: [String(ans)],
          hint: `Apply product rule. What is the derivative of e^x? Then substitute x=0 — what does e⁰ equal?`,
          step: `f'(x)=(${a}x+${a+b})e^x;\\quad f'(0)=${a+b}\\cdot1=${ans}`
        };
      }

      // Slot 3: (ax+b)·sin(x), find f'(0) — integer
      function gen3() {
        const a=rInt(4)+1, b=rInt(5)+1;
        // f'(x) = a·sin(x) + (ax+b)·cos(x)
        // f'(0) = a·0 + b·1 = b
        const ans = b;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${a}x+${b})\\sin x`,
          answer: [String(ans)],
          hint: `Apply product rule. After differentiating, substitute x=0. What do sin(0) and cos(0) equal?`,
          step: `f'(x)=${a}\\sin x+(${a}x+${b})\\cos x;\\quad f'(0)=0+${b}\\cdot1=${ans}`
        };
      }

      // Slot 4: ax²·e^x, find f'(0) — integer (always 0 since f'=2ax·e^x+ax²·e^x → f'(0)=0)
      // Use ax²+bx to get nonzero answer: f'(x)=(2ax+b)e^x+(ax²+bx)e^x; f'(0)=b
      function gen4() {
        const a=rInt(3)+1, b=rInt(4)+1;
        const ans = b;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${fc(a)}x^2+${b}x)e^x`,
          answer: [String(ans)],
          hint: `Apply product rule — one factor is the polynomial, one is e^x. After differentiating, substitute x=0.`,
          step: `f'(x)=(${fc(a)}x^2+${2*a+b}x+${b})e^x;\\quad f'(0)=${b}`
        };
      }

      // Slot 5: (ax+b)/(cx+d), find f'(0) — integer  (if ad-bc is integer)
      // f'(x) = [a(cx+d) - (ax+b)c] / (cx+d)^2 = (ad-bc)/(cx+d)^2
      // f'(0) = (ad-bc)/d^2  — pick params so this is integer
      // Strategy: fix d, pick a,b,c so ad-bc is multiple of d^2
      // Simplest: pick c=1, d=a, then ad-bc=a^2-ba. Need a^2-ba = k*a^2 for some int... complex.
      // Instead: just pick params and compute, accept fraction answers too
      function gen5() {
        const a=rInt(3)+1, b=rInt(4)+1, c=rInt(2)+1, d=rInt(3)+2;
        const num = a*d - b*c;
        const den = d*d;
        // Simplify the fraction
        function gcd(x,y){return y===0?x:gcd(y,x%y);}
        const g = gcd(Math.abs(num), den);
        const sNum = num/g, sDen = den/g;
        const ansStr = sDen===1 ? String(sNum) : sNum+'/'+sDen;
        return {
          latex: `f'(0) \\text{ for } f(x)=\\frac{${a}x+${b}}{${c}x+${d}}`,
          answer: [ansStr, String(sNum/sDen)],
          hint: `Set up quotient rule — what are the numerator and denominator functions? After applying it, substitute x=0.`,
          step: `f'(x)=\\frac{${num}}{(${c}x+${d})^2};\\quad f'(0)=\\frac{${num}}{${den}}=${ansStr}`
        };
      }

      // Slot 6: x^n / (ax+b), find f'(0) — integer
      // f = x^2, g = ax+b: f'=(2x(ax+b)-ax^2)/(ax+b)^2; f'(0)=0/b^2=0 — boring
      // Use f=x^2+c: f'(0) = (0*(b)-c*a)/b^2 = -ca/b^2. Need b^2 | ca.
      // Simplest: just pick n=1, f=x+c: f'=(1*(ax+b)-(x+c)*a)/(ax+b)^2 = (b-ac)/(ax+b)^2
      // f'(0) = (b-ac)/b^2
      function gen6() {
        const a=rInt(3)+1, b=rInt(4)+2, c=rInt(3)+1;
        // f(x)=(x+c)/(ax+b), f'(0)=(b-ac)/b^2
        const num = b - a*c;
        const den = b*b;
        function gcd(x,y){return y===0?x:gcd(y,x%y);}
        const g = gcd(Math.abs(num), den);
        const sNum = num/g, sDen = den/g;
        const ansStr = sDen===1 ? String(sNum) : sNum+'/'+sDen;
        return {
          latex: `f'(0) \\text{ for } f(x)=\\frac{x+${c}}{${a}x+${b}}`,
          answer: [ansStr],
          hint: `Apply quotient rule. The numerator will simplify nicely — then substitute x=0.`,
          step: `f'(x)=\\frac{${num}}{(${a}x+${b})^2};\\quad f'(0)=\\frac{${num}}{${den}}=${ansStr}`
        };
      }

      // Slot 7: x·cos(x), find f'(0) — integer
      // f'(x) = cos(x) - x·sin(x);  f'(0) = 1
      // Generalize: (ax+b)·cos(x), f'(0)=a·cos(0)·... let's do (ax)·cos(x)
      // f'(x) = a·cos(x) - ax·sin(x); f'(0) = a
      function gen7() {
        const a = rInt(4)+1;
        const ans = a;
        return {
          latex: `f'(0) \\text{ for } f(x)=${fc(a)}x\\cos x`,
          answer: [String(ans)],
          hint: `Apply product rule. After differentiating, substitute x=0. What do cos(0) and sin(0) equal?`,
          step: `f'(x)=${a}\\cos x-${fc(a)}x\\sin x;\\quad f'(0)=${a}\\cdot1-0=${ans}`
        };
      }

      // Slot 8: (ax+b)^2 evaluated differently — use product rule on (ax+b)(ax+b), find f'(c) — integer
      function gen8() {
        const a=rInt(3)+1, b=rInt(4)+1, c=rInt(3)+1;
        // f(x)=(ax+b)^2, f'(x)=2a(ax+b), f'(c)=2a(ac+b)
        const ans = 2*a*(a*c+b);
        return {
          latex: `f'(${c}) \\text{ for } f(x)=(${a}x+${b})^2 \\text{ using product rule}`,
          answer: [String(ans)],
          hint: `Rewrite as a product of two identical factors, then apply product rule. After differentiating, substitute x=${c}.`,
          step: `f'(x)=2\\cdot${a}(${a}x+${b});\\quad f'(${c})=2\\cdot${a}\\cdot${a*c+b}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_2_7: Chain Rule
  CALC1_SPIRAL["Calc_2_7"] = {
    title: "Chain Rule",
    index: 14,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: f(x)=(ax+b)^n, find f'(x) — symbolic
      function gen1() {
        const n = rInt(3)+2, a = rInt(3)+1, b = rInt(4)+1;
        const coeff = a*n;
        const inner = fc(a)+'x+'+b;
        const expStr = n-1===1 ? '' : '^'+(n-1);
        const ans = coeff+'('+inner+')'+expStr;
        const ansAlt = coeff+'('+inner+')^1';  // accept with explicit ^1 when n=2
        return {
          latex: `f'(x) \\text{ for } f(x)=(${fc(a)}x+${b})^{${n}}`,
          answer: n===2 ? [ans, ansAlt] : [ans],
          hint: `Identify the outer function and the inner function. What do you bring down, and what do you multiply by at the end?`,
          step: `f'(x)=${n}(${fc(a)}x+${b})^{${n-1}}\\cdot${a}=${coeff}(${fc(a)}x+${b})^{${n-1}}`
        };
      }

      // Slot 2: f(x)=(x²+b)^2, find f'(1) — integer
      function gen2() {
        const b = rInt(4)+1;
        const ans = 4*(1+b);
        return {
          latex: `f'(1) \\text{ for } f(x)=(x^2+${b})^2`,
          answer: [String(ans)],
          hint: `Apply chain rule to find f'(x) — outer is ( )², inner is x²+${b}. Then substitute x=1.`,
          step: `f'(x)=4x(x^2+${b});\\quad f'(1)=4(1+${b})=${ans}`
        };
      }

      // Slot 3: f(x)=sin(ax+b), find f'(x) — symbolic
      function gen3() {
        const a = rInt(4)+1, b = rInt(4)+1;
        const inner = fc(a)+'x+'+b;
        const ans = a===1 ? 'cos(x+'+b+')' : a+'cos('+a+'x+'+b+')';
        return {
          latex: `f'(x) \\text{ for } f(x)=\\sin(${fc(a)}x+${b})`,
          answer: [ans],
          hint: `What does d/dx[sin(u)] give you? Identify the inner function, then multiply by its derivative.`,
          step: `f'(x)=\\cos(${fc(a)}x+${b})\\cdot${a}=${a===1?'':a}\\cos(${fc(a)}x+${b})`
        };
      }

      // Slot 4: f(x)=cos(ax), find f'(x) — symbolic
      function gen4() {
        const a = rInt(4)+1;
        const ans = a===1 ? '-sin(x)' : '-'+a+'sin('+a+'x)';
        return {
          latex: `f'(x) \\text{ for } f(x)=\\cos(${fc(a)}x)`,
          answer: [ans],
          hint: `What does d/dx[cos(u)] give you? Don\\'t forget to multiply by the derivative of the inside.`,
          step: `f'(x)=-\\sin(${fc(a)}x)\\cdot${a}=${a===1?'-':'-'+a}\\sin(${fc(a)}x)`
        };
      }

      // Slot 5: f(x)=e^(ax+b), find f'(x) — symbolic
      function gen5() {
        const a = rInt(4)+1, b = rInt(4)+1;
        const exp = fc(a)+'x+'+b;
        const ans = a===1 ? 'e^(x+'+b+')' : a+'e^('+a+'x+'+b+')';
        return {
          latex: `f'(x) \\text{ for } f(x)=e^{${fc(a)}x+${b}}`,
          answer: [ans],
          hint: `The derivative of e^u is e^u times something. What is the inner function, and what is its derivative?`,
          step: `f'(x)=e^{${fc(a)}x+${b}}\\cdot${a}=${a===1?'':a}e^{${fc(a)}x+${b}}`
        };
      }

      // Slot 6: f(x)=e^(ax), find f'(0) — integer (always = a)
      function gen6() {
        const a = rInt(5)+2;
        return {
          latex: `f'(0) \\text{ for } f(x)=e^{${a}x}`,
          answer: [String(a)],
          hint: `Differentiate using chain rule first, then substitute x=0. What does e⁰ simplify to?`,
          step: `f'(x)=${a}e^{${a}x};\\quad f'(0)=${a}\\cdot1=${a}`
        };
      }

      // Slot 7: f(x)=ln(ax+b), find f'(x) — symbolic
      function gen7() {
        const a = rInt(4)+1, b = rInt(4)+1;
        const inner = fc(a)+'x+'+b;
        const ans = a===1 ? '1/(x+'+b+')' : a+'/('+a+'x+'+b+')';
        return {
          latex: `f'(x) \\text{ for } f(x)=\\ln(${fc(a)}x+${b})`,
          answer: [ans],
          hint: `The chain rule form for ln is u\\'/u. What is the inner function here, and what is its derivative?`,
          step: `f'(x)=\\frac{${a}}{${fc(a)}x+${b}}`
        };
      }

      // Slot 8: f(x)=(ax+b)^2, find f'(c) — integer
      function gen8() {
        const a = rInt(2)+1, b = rInt(4)+1, c = rInt(3)+1;
        const ans = 2*a*(a*c+b);
        return {
          latex: `f'(${c}) \\text{ for } f(x)=(${fc(a)}x+${b})^2`,
          answer: [String(ans)],
          hint: `Apply chain rule to find f'(x) — it\\'s a power with a linear inside. Then substitute x=${c}.`,
          step: `f'(x)=${2*a}(${fc(a)}x+${b});\\quad f'(${c})=${2*a}\\cdot${a*c+b}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_2_8: General Derivative Strategies
  CALC1_SPIRAL["Calc_2_8"] = {
    title: "General Derivative Strategies",
    index: 15,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: (ax+b)^2·(cx+d), find f'(0) — integer  [Product + Chain/Power]
      // f'(x)=2a(ax+b)(cx+d)+(ax+b)^2·c  →  f'(0)=2abd+b²c
      function gen1() {
        const a=rInt(3)+1, b=rInt(3)+1, c=rInt(3)+1, d=rInt(3)+1;
        const ans = 2*a*b*d + b*b*c;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${fc(a)}x+${b})^2(${fc(c)}x+${d})`,
          answer: [String(ans)],
          hint: `What rule handles the overall structure? Identify the two factors — don\\'t forget the left factor also needs chain rule when you differentiate it.`,
          step: `f'(x)=${2*a}(${fc(a)}x+${b})(${fc(c)}x+${d})+(${fc(a)}x+${b})^2\\cdot${c};\\quad f'(0)=${2*a*b*d}+${b*b*c}=${ans}`
        };
      }

      // Slot 2: (ax+b)·e^(cx), find f'(0) — integer  [Product + Chain/Exp]
      // f'(x)=a·e^(cx)+(ax+b)·ce^(cx)=e^(cx)(acx+a+bc)  →  f'(0)=a+bc
      function gen2() {
        const a=rInt(4)+1, b=rInt(4)+1, c=rInt(3)+1;
        const ans = a + b*c;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${fc(a)}x+${b})e^{${c}x}`,
          answer: [String(ans)],
          hint: `Identify the two factors and apply product rule. One factor needs chain rule — which one? Then substitute x=0. What does e⁰ equal?`,
          step: `f'(x)=e^{${c}x}(${fc(a*c)}x+${a+b*c});\\quad f'(0)=1\\cdot${ans}=${ans}`
        };
      }

      // Slot 3: e^(ax)/(bx+1), find f'(0) — integer  [Quotient + Chain/Exp]
      // f'(0) = a - b
      function gen3() {
        const a=rInt(4)+2, b=rInt(3)+1;
        const ans = a - b;
        return {
          latex: `f'(0) \\text{ for } f(x)=\\frac{e^{${a}x}}{${b}x+1}`,
          answer: [String(ans)],
          hint: `Set up quotient rule. What do e⁰ and the denominator simplify to at x=0? Don\\'t forget chain rule on the numerator.`,
          step: `f'(0)=\\frac{${a}\\cdot1\\cdot1-1\\cdot${b}}{1^2}=${ans}`
        };
      }

      // Slot 4: e^(ax²+bx), find f'(0) — integer  [Nested chain]
      // f'(x)=(2ax+b)e^(ax²+bx)  →  f'(0)=b
      function gen4() {
        const a=rInt(3)+1, b=rInt(5)+1;
        return {
          latex: `f'(0) \\text{ for } f(x)=e^{${a}x^2+${b}x}`,
          answer: [String(b)],
          hint: `Chain rule: outer is e^(·), inner is the exponent. Find u and u\\', then evaluate at x=0. What does e⁰ equal?`,
          step: `f'(x)=(${2*a}x+${b})e^{${a}x^2+${b}x};\\quad f'(0)=${b}\\cdot1=${b}`
        };
      }

      // Slot 5: ax^n·ln(x), find f'(1) — integer  [Product + Log]
      // f'(x)=anx^(n-1)ln(x)+ax^(n-1)  →  f'(1)=a (since ln(1)=0)
      function gen5() {
        const a=rInt(4)+1, n=rInt(2)+2;
        return {
          latex: `f'(1) \\text{ for } f(x)=${fc(a)}x^${n}\\ln x`,
          answer: [String(a)],
          hint: `Product rule: what are the two factors and their derivatives? Then substitute x=1. What does ln(1) equal, and how does that simplify things?`,
          step: `f'(x)=${a*n}x^{${n-1}}\\ln x+${fc(a)}x^{${n-1}};\\quad f'(1)=0+${a}=${a}`
        };
      }

      // Slot 6: (ax+b)·ln(cx+1), find f'(0) — integer  [Product + Chain/Log]
      // f'(x)=a·ln(cx+1)+(ax+b)·c/(cx+1)  →  f'(0)=a·0+b·c/1=bc
      function gen6() {
        const a=rInt(3)+1, b=rInt(4)+1, c=rInt(3)+1;
        const ans = b*c;
        return {
          latex: `f'(0) \\text{ for } f(x)=(${fc(a)}x+${b})\\ln(${c}x+1)`,
          answer: [String(ans)],
          hint: `Set up product rule. At x=0, what does ln(1) equal? How does that simplify the first term?`,
          step: `f'(x)=${a}\\ln(${c}x+1)+\\frac{(${fc(a)}x+${b})\\cdot${c}}{${c}x+1};\\quad f'(0)=0+${ans}=${ans}`
        };
      }

      // Slot 7: (e^(ax)+b)^2, find f'(0) — integer  [Nested chain: power of exp]
      // f'(x)=2(e^(ax)+b)·ae^(ax)  →  f'(0)=2(1+b)·a
      function gen7() {
        const a=rInt(3)+1, b=rInt(4)+1;
        const ans = 2*a*(1+b);
        return {
          latex: `f'(0) \\text{ for } f(x)=(e^{${a}x}+${b})^2`,
          answer: [String(ans)],
          hint: `There are two layers — work outside in. What\\'s the outermost function? The inside also needs chain rule. What does e⁰ equal at x=0?`,
          step: `f'(x)=2(e^{${a}x}+${b})\\cdot${a}e^{${a}x};\\quad f'(0)=2(1+${b})\\cdot${a}=${ans}`
        };
      }

      // Slot 8: sin(ax)·cos(ax), find f'(0) — integer  [Product + two Chain instances]
      // f'(x)=a·cos(ax)·cos(ax)+sin(ax)·(-a·sin(ax))=a(cos²(ax)-sin²(ax))=a·cos(2ax)
      // f'(0)=a·cos(0)=a
      function gen8() {
        const a=rInt(5)+1;
        return {
          latex: `f'(0) \\text{ for } f(x)=\\sin(${a}x)\\cos(${a}x)`,
          answer: [String(a)],
          hint: `Apply product rule — each factor then needs chain rule for its own derivative. After differentiating, substitute x=0. What do sin(0) and cos(0) equal?`,
          step: `f'(x)=${a}\\cos^2(${a}x)-${a}\\sin^2(${a}x)=${a}\\cos(${2*a}x);\\quad f'(0)=${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_1: Implicit Differentiation
  CALC1_SPIRAL["Calc_3_1"] = {
    title: "Implicit Differentiation",
    index: 16,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: x²+y²=r², find dy/dx — symbolic "-x/y"
      function gen1() {
        const r2 = (rInt(4)+2)*(rInt(4)+2);
        return {
          latex: `\\text{Find }\\frac{dy}{dx}\\text{ for }x^2+y^2=${r2}`,
          answer: ['-x/y'],
          hint: `Differentiate both sides w.r.t. x. Every y-term gets a dy/dx factor (chain rule).`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^2+y^2]&=\\frac{d}{dx}[${r2}]\\\\2x+2y\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{x}{y}\\end{aligned}`
        };
      }

      // Slot 2: ax²+by²=c, find dy/dx — symbolic  (a≠b, both > 0)
      function gen2() {
        const a = rInt(3)+2, b = rInt(3)+1;
        const c = a*(rInt(2)+1)*(rInt(2)+1) + b*(rInt(2)+1)*(rInt(2)+1);
        function gcd(p,q){return q===0?p:gcd(q,p%q);}
        const g = gcd(a, b);
        const ra = a/g, rb = b/g;
        const ans = rb===1 ? `-${ra===1?'':ra}x/y` : `-${ra===1?'':ra}x/(${rb}y)`;
        const ansAlt = `-${a}x/(${b}y)`;
        return {
          latex: `\\text{Find }\\frac{dy}{dx}\\text{ for }${a}x^2+${b}y^2=${c}`,
          answer: [ans, ansAlt],
          hint: `Differentiate both sides — remember y is a function of x, so every y-term needs a dy/dx factor. Then solve for dy/dx.`,
          step: `\\begin{aligned}\\frac{d}{dx}[${a}x^2+${b}y^2]&=\\frac{d}{dx}[${c}]\\\\${2*a}x+${2*b}y\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{${a}x}{${b}y}\\end{aligned}`
        };
      }

      // Slot 3: x²+y²=r², slope at (x0,y0) — simple fraction
      function gen3() {
        const x0 = rInt(4)+1, y0 = rInt(4)+1;
        const r2 = x0*x0 + y0*y0;
        function gcd(p,q){return q===0?p:gcd(q,p%q);}
        const g = gcd(x0, y0);
        const sNum = -(x0/g), sDen = y0/g;
        const ans = sDen===1 ? String(sNum) : sNum+'/'+sDen;
        return {
          latex: `\\text{Slope of }x^2+y^2=${r2}\\text{ at }(${x0},${y0})`,
          answer: [ans],
          hint: `Differentiate implicitly to find dy/dx, then substitute the given point.`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^2+y^2]&=0\\\\2x+2y\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{x}{y}\\\\\\text{slope}&=-\\frac{${x0}}{${y0}}=${ans}\\end{aligned}`
        };
      }

      // Slot 4: ax²+by²=c, slope at constructed point — fraction
      function gen4() {
        const a=rInt(3)+1, b=rInt(3)+1, x0=rInt(3)+1, y0=rInt(3)+1;
        const c = a*x0*x0 + b*y0*y0;
        function gcd(p,q){return q===0?p:gcd(q,p%q);}
        const num = a*x0, den = b*y0;
        const g = gcd(num, den);
        const sNum = -(num/g), sDen = den/g;
        const ans = sDen===1 ? String(sNum) : sNum+'/'+sDen;
        const ansAlt = `-${num}/${den}`;
        return {
          latex: `\\text{Slope of }${a}x^2+${b}y^2=${c}\\text{ at }(${x0},${y0})`,
          answer: [ans, ansAlt],
          hint: `Differentiate both sides implicitly, solve for dy/dx, then substitute the given point.`,
          step: `\\begin{aligned}\\frac{d}{dx}[${a}x^2+${b}y^2]&=0\\\\${2*a}x+${2*b}y\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{${a}x}{${b}y}\\\\\\text{slope}&=-\\frac{${num}}{${den}}=${ans}\\end{aligned}`
        };
      }

      // Slot 5: xy=c, find dy/dx — symbolic "-y/x"
      function gen5() {
        const c = (rInt(5)+1)*(rInt(5)+1);
        return {
          latex: `\\text{Find }\\frac{dy}{dx}\\text{ for }xy=${c}`,
          answer: ['-y/x'],
          hint: `Product rule on the left side: d/dx[xy] = y + x·(dy/dx). Right side: d/dx[c] = 0.`,
          step: `\\begin{aligned}\\frac{d}{dx}[xy]&=\\frac{d}{dx}[${c}]\\\\y+x\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{y}{x}\\end{aligned}`
        };
      }

      // Slot 6: x²+xy+y²=c, find dy/dx — symbolic
      function gen6() {
        const c = rInt(8)+3;
        return {
          latex: `\\text{Find }\\frac{dy}{dx}\\text{ for }x^2+xy+y^2=${c}`,
          answer: ['-(2x+y)/(x+2y)', '-(2x+y)/(2y+x)'],
          hint: `Differentiate term by term. The xy term needs product rule: d/dx[xy]=y+x·dy/dx.`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^2+xy+y^2]&=0\\\\2x+(y+x\\tfrac{dy}{dx})+2y\\tfrac{dy}{dx}&=0\\\\(x+2y)\\frac{dy}{dx}&=-(2x+y)\\\\\\frac{dy}{dx}&=-\\frac{2x+y}{x+2y}\\end{aligned}`
        };
      }

      // Slot 7: ax²+bxy=c, slope at constructed point — integer
      function gen7() {
        const a=rInt(2)+1, b=rInt(2)+1, m=rInt(3)+1, x0=rInt(2)+1;
        const y0=m*x0, c=a*x0*x0+b*x0*y0;
        const slopeNum = 2*a*x0+b*y0, slopeDen = b*x0;
        const ans = -(slopeNum/slopeDen);
        return {
          latex: `\\text{Slope of }${a}x^2+${b}xy=${c}\\text{ at }(${x0},${y0})`,
          answer: [String(ans)],
          hint: `The xy term needs product rule. Differentiate the whole equation, collect dy/dx terms, then substitute the given point.`,
          step: `\\begin{aligned}\\frac{d}{dx}[${a}x^2+${b}xy]&=0\\\\${2*a}x+${b}(y+x\\tfrac{dy}{dx})&=0\\\\\\frac{dy}{dx}&=-\\frac{${2*a}x+${b}y}{${b}x}\\\\\\text{slope}&=${ans}\\end{aligned}`
        };
      }

      // Slot 8: x³+y³=c, find dy/dx — symbolic "-x^2/y^2"
      function gen8() {
        const c = (rInt(3)+1)*(rInt(3)+1)*((rInt(3)+1)+(rInt(3)+1));
        return {
          latex: `\\text{Find }\\frac{dy}{dx}\\text{ for }x^3+y^3=${c}`,
          answer: ['-x^2/y^2'],
          hint: `Differentiate both sides. The y³ term gives 3y²·(dy/dx) by chain rule.`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^3+y^3]&=\\frac{d}{dx}[${c}]\\\\3x^2+3y^2\\frac{dy}{dx}&=0\\\\\\frac{dy}{dx}&=-\\frac{x^2}{y^2}\\end{aligned}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_2: Logarithmic Differentiation
  CALC1_SPIRAL["Calc_3_2"] = {
    title: "Logarithmic Differentiation",
    index: 17,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // ── Group A: Direct log_b derivatives ────────────────────────────────────────

      // gen1: d/dx[log_b(x)] — just the formula
      function gen1() {
        const bases = [2, 3, 5, 10];
        const b = bases[rInt(4)];
        return {
          latex: `\\dfrac{d}{dx}[\\log_{${b}} x]`,
          answer: ['1/(x*ln('+b+'))'],
          hint: 'Recall: d/dx[log_b(x)] = 1/(x·ln b). Identify the base b and apply the formula directly.',
          step: `\\dfrac{d}{dx}[\\log_{${b}} x]=\\dfrac{1}{x\\ln ${b}}`
        };
      }

      // gen2: d/dx[log_b(x^n)] — simplify with log rules first, then differentiate
      function gen2() {
        const bases = [2, 3, 5];
        const b = bases[rInt(3)];
        const n = rInt(3)+2;
        return {
          latex: `\\dfrac{d}{dx}[\\log_{${b}}(x^{${n}})]`,
          answer: [''+n+'/(x*ln('+b+'))'],
          hint: 'Log rule first: log_b(x^n) = n·log_b(x). Then differentiate — you just need the basic formula on n·log_b(x).',
          step: `\\log_{${b}}(x^{${n}})=${n}\\log_{${b}} x,\\quad\\dfrac{d}{dx}=\\dfrac{${n}}{x\\ln ${b}}`
        };
      }

      // gen3: d/dx[log_b(ax+c)] — chain rule, linear inside
      function gen3() {
        const bases = [2, 3, 5];
        const b = bases[rInt(3)];
        const a = rInt(3)+2;
        const c = rInt(4)+1;
        return {
          latex: `\\dfrac{d}{dx}[\\log_{${b}}(${a}x+${c})]`,
          answer: [''+a+'/(('+a+'x+'+c+')*ln('+b+'))'],
          hint: `Chain rule for log_b: u'/(u·ln b). Here u = ${a}x+${c}, so u' = ${a}.`,
          step: `\\dfrac{d}{dx}[\\log_{${b}}(${a}x+${c})]=\\dfrac{${a}}{(${a}x+${c})\\ln ${b}}`
        };
      }

      // gen4: d/dx[log_b(x^2+c)] — chain rule, quadratic inside
      function gen4() {
        const bases = [2, 3, 5];
        const b = bases[rInt(3)];
        const c = rInt(4)+1;
        return {
          latex: `\\dfrac{d}{dx}[\\log_{${b}}(x^2+${c})]`,
          answer: ['2x/((x^2+'+c+')*ln('+b+'))'],
          hint: `Chain rule for log_b: u'/(u·ln b). Here u = x²+${c}, so u' = 2x.`,
          step: `\\dfrac{d}{dx}[\\log_{${b}}(x^2+${c})]=\\dfrac{2x}{(x^2+${c})\\ln ${b}}`
        };
      }

      // ── Group B: Logarithmic differentiation — evaluate at a point ───────────────

      // gen5: y = x^(ax), evaluate at x=1 → answer = a
      function gen5() {
        const a = rInt(4)+2;
        return {
          latex: `\\text{Find }\\tfrac{dy}{dx}\\text{ at }x=1\\text{ for }y=x^{${a}x}`,
          answer: [String(a)],
          hint: `Take ln: ln y = ${a}x·ln x. Differentiate implicitly (left gives y'/y), solve for y', substitute x=1.`,
          step: `\\ln y=${a}x\\ln x,\\;\\tfrac{y'}{y}=${a}(\\ln x+1),\\;y'(1)=1\\cdot${a}(0+1)=${a}`
        };
      }

      // gen6: y = x^(a + b/x), evaluate at x=1 → answer = a+b
      function gen6() {
        const a = rInt(3)+1;
        const b = rInt(3)+2;
        const ans = a+b;
        return {
          latex: `\\text{Find }\\tfrac{dy}{dx}\\text{ at }x=1\\text{ for }y=x^{${a}+${b}/x}`,
          answer: [String(ans)],
          hint: `Take ln: ln y = (${a}+${b}/x)·ln x. Use the product rule on the right when differentiating, then substitute x=1.`,
          step: `\\ln y=\\left(${a}+\\tfrac{${b}}{x}\\right)\\ln x,\\;\\tfrac{y'}{y}=-\\tfrac{${b}\\ln x}{x^2}+\\tfrac{${a}+${b}/x}{x};\\;y'(1)=1\\cdot(${a}+${b})=${ans}`
        };
      }

      // gen7: y = x^a · (x+1)^b (b even so answer is integer), evaluate at x=1
      function gen7() {
        const a = rInt(2)+2;
        const b = (rInt(2)+1)*2;
        const yAt1 = Math.pow(2, b);
        const rate = a + b/2;
        const ans = yAt1 * rate;
        return {
          latex: `\\text{Find }\\tfrac{dy}{dx}\\text{ at }x=1\\text{ for }y=x^{${a}}(x+1)^{${b}}`,
          answer: [String(ans)],
          hint: `Take ln: ln y = ${a}·ln x + ${b}·ln(x+1). Differentiate, evaluate at x=1. Note y(1)=2^${b}=${yAt1}.`,
          step: `\\tfrac{y'}{y}=\\tfrac{${a}}{x}+\\tfrac{${b}}{x+1};\\;y'(1)=${yAt1}\\cdot\\left(${a}+\\tfrac{${b}}{2}\\right)=${yAt1}\\cdot${rate}=${ans}`
        };
      }

      // gen8: y = x^a · (x-1)^b, evaluate at x=2 → 2^a·(a/2+b), always integer
      function gen8() {
        const a = rInt(2)+2;
        const b = rInt(2)+2;
        const yAt2 = Math.pow(2, a);
        const rate = a/2 + b;
        const ans = yAt2 * rate;
        return {
          latex: `\\text{Find }\\tfrac{dy}{dx}\\text{ at }x=2\\text{ for }y=x^{${a}}(x-1)^{${b}}`,
          answer: [String(ans)],
          hint: `Take ln: ln y = ${a}·ln x + ${b}·ln(x-1). At x=2: y(2)=2^${a}=${yAt2} and (x-1)=1.`,
          step: `\\tfrac{y'}{y}=\\tfrac{${a}}{x}+\\tfrac{${b}}{x-1};\\;y'(2)=${yAt2}\\cdot\\left(\\tfrac{${a}}{2}+${b}\\right)=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_4: Linear Approximations
  CALC1_SPIRAL["Calc_3_4"] = {
    title: "Linear Approximations",
    index: 18,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // Slot 1: f(x)=x², find L(x) at x=a — symbolic "2ax-a²"
      function gen1() {
        const a = rInt(4)+1;  // a in {1,2,3,4}
        const fa = a*a, dfa = 2*a;
        const b = -(a*a);  // L(x) = 2ax - a²
        const bStr = b < 0 ? String(b) : '+'+b;
        const ans = dfa+'x'+bStr;
        return {
          latex: `\\text{Find } L(x) \\text{ for } f(x)=x^2 \\text{ at } x=${a}`,
          answer: [ans],
          hint: `Find f(${a}) and f\\'(${a}), then plug into L(x)=f(a)+f\\'(a)(x-a).`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^2]\\big|_{x=${a}}&=${dfa}\\\\L(x)&=${fa}+${dfa}(x-${a})\\\\&=${ans}\\end{aligned}`
        };
      }

      // Slot 2: f(x)=x², estimate (a+0.1)² using L — decimal
      function gen2() {
        const a = rInt(4)+1;
        const ans = (a*a + 0.2*a).toFixed(1);
        return {
          latex: `\\text{Use } L(x) \\text{ for } f(x)=x^2 \\text{ at } x=${a} \\text{ to estimate } ${a}.1^2`,
          answer: [ans, (+(ans)).toFixed(2)],
          hint: `Build L(x) for f(x)=x² at x=${a} first, then evaluate it at x=${a}.1.`,
          step: `\\begin{aligned}L(x)&=${2*a}x-${a*a}\\\\L(${a}.1)&=${2*a}(${a}.1)-${a*a}=${ans}\\end{aligned}`
        };
      }

      // Slot 3: f(x)=x³, find L(x) at x=a — symbolic "3a²x - 2a³"
      function gen3() {
        const a = rInt(2)+1;  // a in {1,2} to keep numbers manageable
        const fa = a*a*a, dfa = 3*a*a;
        const b = fa - dfa*a;  // = a³ - 3a³ = -2a³
        const bStr = b < 0 ? String(b) : '+'+b;
        const ans = dfa+'x'+bStr;
        return {
          latex: `\\text{Find } L(x) \\text{ for } f(x)=x^3 \\text{ at } x=${a}`,
          answer: [ans],
          hint: `Find f(${a}) and f\\'(${a}), then plug into L(x)=f(a)+f\\'(a)(x-a).`,
          step: `\\begin{aligned}\\frac{d}{dx}[x^3]\\big|_{x=${a}}&=${dfa}\\\\L(x)&=${fa}+${dfa}(x-${a})\\\\&=${ans}\\end{aligned}`
        };
      }

      // Slot 4: f(x)=√x at x=4, estimate √(4+k) — decimal
      // k in {0.4, 0.8, 1.2, 1.6} → answers {2.1, 2.2, 2.3, 2.4}
      function gen4() {
        const ki = rInt(4)+1;
        const k = (ki*0.4).toFixed(1);
        const xEst = (4 + ki*0.4).toFixed(1);
        const ans = (2 + ki*0.4/4).toFixed(1);
        return {
          latex: `\\text{Estimate } \\sqrt{${xEst}} \\text{ using } L(x) \\text{ for } \\sqrt{x} \\text{ at } x=4`,
          answer: [ans, (+(ans)).toFixed(2)],
          hint: `Find f(4) and f\\'(4) for √x, build L(x)=f(4)+f\\'(4)(x-4), then evaluate at x=${xEst}.`,
          step: `\\begin{aligned}\\frac{d}{dx}[\\sqrt{x}]\\big|_{x=4}&=\\tfrac{1}{4}\\\\L(x)&=2+\\tfrac{x-4}{4}\\\\L(${xEst})&=2+\\tfrac{${k}}{4}=${ans}\\end{aligned}`
        };
      }

      // Slot 5: f(x)=e^x at x=0, find L(x) — always "x+1"
      function gen5() {
        const c = (rInt(5)+1)*10;  // cosmetic variation (shown as context)
        return {
          latex: `\\text{Find } L(x) \\text{ for } f(x)=e^x \\text{ at } x=0`,
          answer: ['x+1', '1+x'],
          hint: `What are f(0) and f\\'(0) for e^x? Plug them into L(x)=f(a)+f\\'(a)(x-a).`,
          step: `\\begin{aligned}\\frac{d}{dx}[e^x]\\big|_{x=0}&=1\\\\L(x)&=1+1\\cdot(x-0)\\\\&=x+1\\end{aligned}`
        };
      }

      // Slot 6: Use L(x)=x+1 to estimate e^(0.h) — decimal, 1-place
      function gen6() {
        const h = rInt(4)+1;  // h in {1,2,3,4}
        const xVal = '0.'+h;
        const ans = (1 + h/10).toFixed(1);
        return {
          latex: `\\text{Use } L(x)=x+1 \\text{ to estimate } e^{0.${h}}`,
          answer: [ans, (+(ans)).toFixed(2)],
          hint: `L(x) is already given. What does evaluating a linear function look like? Substitute the value.`,
          step: `\\begin{aligned}L(x)&=x+1\\\\L(${xVal})&=${xVal}+1=${ans}\\end{aligned}`
        };
      }

      // Slot 7: f(x)=ln(x) at x=1, find L(x) — always "x-1"
      function gen7() {
        return {
          latex: `\\text{Find } L(x) \\text{ for } f(x)=\\ln x \\text{ at } x=1`,
          answer: ['x-1'],
          hint: `What are f(1) and f\\'(1) for ln(x)? Plug them into L(x)=f(a)+f\\'(a)(x-a).`,
          step: `\\begin{aligned}\\frac{d}{dx}[\\ln x]\\big|_{x=1}&=1\\\\L(x)&=0+1\\cdot(x-1)\\\\&=x-1\\end{aligned}`
        };
      }

      // Slot 8: Use L(x)=x-1 to estimate ln(1+h) — decimal, 1-place
      function gen8() {
        const h = rInt(4)+1;  // h in {1,2,3,4}
        const xVal = (1 + h/10).toFixed(1);
        const ans = (h/10).toFixed(1);
        return {
          latex: `\\text{Use } L(x)=x-1 \\text{ to estimate } \\ln(${xVal})`,
          answer: [ans, (+(ans)).toFixed(2)],
          hint: `L(x) is already given. Substitute ${xVal} directly into L(x) and simplify.`,
          step: `\\begin{aligned}L(x)&=x-1\\\\L(${xVal})&=${xVal}-1=${ans}\\end{aligned}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_5: Critical Points and EVT
  CALC1_SPIRAL["Calc_3_5"] = {
    title: "Critical Points and EVT",
    index: 19,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: f(x)=x^2-2bx, find critical number → x=b  (integer)
      function gen1() {
        const b = rInt(5)+1;
        return {
          latex: `\\text{Find the critical number of }f(x)=x^2-${2*b}x`,
          answer: [String(b)],
          hint: `Differentiate f, then set f\\'(x)=0 and solve for x.`,
          step: `f'(x)=2x-${2*b}=0\\;\\Rightarrow\\;x=${b}`
        };
      }

      // gen2: f(x)=x^3-3ax, a in {1,4,9}, positive critical number in {1,2,3}
      function gen2() {
        const xc = rInt(3)+1;          // 1, 2, or 3
        const a  = xc * xc;            // 1, 4, or 9
        return {
          latex: `\\text{Find the positive critical number of }f(x)=x^3-${3*a}x`,
          answer: [String(xc)],
          hint: `Differentiate, then set f\\'(x)=0. You\\'ll need to solve for x² first — then take the positive root.`,
          step: `f'(x)=3x^2-${3*a}=0\\;\\Rightarrow\\;x^2=${a}\\;\\Rightarrow\\;x=${xc}`
        };
      }

      // gen3: abs max VALUE of f(x)=-x^2+2bx on [0,b+1] → max = b^2
      function gen3() {
        const b    = rInt(4)+2;
        const fCp  = b*b;
        const fEnd = -(b+1)*(b+1)+2*b*(b+1);   // = b^2-1
        return {
          latex: `\\text{Find the absolute maximum value of }f(x)=-x^2+${2*b}x\\text{ on }[0,${b+1}]`,
          answer: [String(fCp)],
          hint: `Find the critical number inside the interval by setting f\\'(x)=0, then evaluate f at that point and both endpoints. The largest value wins.`,
          step: `\\begin{aligned}f'(x)&=-2x+${2*b}=0\\\\x&=${b}\\\\f(0)&=0,\\quad f(${b})=${fCp},\\quad f(${b+1})=${fEnd}\\\\\\text{Abs max}&=${fCp}\\end{aligned}`
        };
      }

      // gen4: abs min VALUE of f(x)=x^2-2bx on [0,b+1] → min = -b^2
      function gen4() {
        const b    = rInt(4)+2;
        const fCp  = -(b*b);
        const fEnd = (b+1)*(b+1)-2*b*(b+1);    // = 1-b^2
        return {
          latex: `\\text{Find the absolute minimum value of }f(x)=x^2-${2*b}x\\text{ on }[0,${b+1}]`,
          answer: [String(fCp)],
          hint: `Find the critical number inside the interval by setting f\\'(x)=0, then evaluate f at that point and both endpoints. The smallest value wins.`,
          step: `\\begin{aligned}f'(x)&=2x-${2*b}=0\\\\x&=${b}\\\\f(0)&=0,\\quad f(${b})=${fCp},\\quad f(${b+1})=${fEnd}\\\\\\text{Abs min}&=${fCp}\\end{aligned}`
        };
      }

      // gen5: SVG graph — classify the critical point  (random: max or min, 50/50)
      function gen5() {
        const c     = rInt(5) - 2;          // label: -2 … 2
        const isMax = rInt(2) === 0;
        const W=280, H=150, ax=140, ay=82, sw=78, rise=38;
        // Q control point must be 2×rise away so the actual bezier peak lands exactly rise from axis
        const ctrlPy   = isMax ? ay - 2*rise : ay + 2*rise;
        const actualPy = (ay + ctrlPy) / 2;   // true peak of quadratic bezier
        const pathD    = `M${ax-sw},${ay} Q${ax},${ctrlPy} ${ax+sw},${ay}`;
        const labelY   = isMax ? actualPy-14 : actualPy+18;
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border-radius:6px;background:#f8fafc">`
          + `<line x1="20" y1="${ay}" x2="${W-15}" y2="${ay}" stroke="#bbb" stroke-width="1.5"/>`
          + `<line x1="${ax}" y1="${H-12}" x2="${ax}" y2="8" stroke="#bbb" stroke-width="1.5"/>`
          + `<text x="${W-10}" y="${ay+4}" text-anchor="middle" font-size="11" fill="#aaa">x</text>`
          + `<text x="${ax+5}" y="15" font-size="11" fill="#aaa">y</text>`
          + `<path d="${pathD}" stroke="#2563eb" stroke-width="2.5" fill="none"/>`
          + `<circle cx="${ax}" cy="${actualPy}" r="4" fill="#dc2626"/>`
          + `<line x1="${ax-4}" y1="${ay}" x2="${ax+4}" y2="${ay}" stroke="#555" stroke-width="2"/>`
          + `<text x="${ax}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">x=${c}</text>`
          + `</svg>`;
        const ans     = isMax ? ['max','local max','maximum','local maximum']
                              : ['min','local min','minimum','local minimum'];
        const typeStr = isMax ? 'maximum' : 'minimum';
        const hintStr = `Look at what the curve does on each side of x=${c}. Is the function value there higher or lower than the points around it?`;
        return {
          svg: `<div style="text-align:center;margin-bottom:6px;font-size:15px">`
             + `Classify the critical point at <strong>x = ${c}</strong>:<br>`
             + `<span style="font-size:12px;color:#666">type <em>max</em>, <em>min</em>, or <em>neither</em></span></div>`
             + svg,
          answer: ans,
          hint: hintStr,
          step: `\\text{Local ${typeStr} at }x=${c}.`
        };
      }

      // gen6: SVG graph — classify the critical point  (random: max / min / neither, 1/3 each)
      function gen6() {
        const c    = rInt(5) - 2;
        const type = rInt(3);       // 0=max  1=min  2=neither (inflection)
        const W=280, H=150, ax=140, ay=82, sw=78, rise=38;
        let py, pathD, ans, typeStr, hintStr;

        let ctrlPy, actualPy;
        if (type === 0) {
          ctrlPy  = ay - 2*rise;             // control point 2× away so peak lands at ay-rise
          actualPy= (ay + ctrlPy) / 2;       // = ay - rise
          py      = actualPy;
          pathD   = `M${ax-sw},${ay} Q${ax},${ctrlPy} ${ax+sw},${ay}`;
          ans     = ['max','local max','maximum','local maximum'];
          typeStr = 'maximum';
          hintStr = `Look at what the curve does on each side of x=${c}. Does it change direction there, and which way?`;
        } else if (type === 1) {
          ctrlPy  = ay + 2*rise;
          actualPy= (ay + ctrlPy) / 2;       // = ay + rise
          py      = actualPy;
          pathD   = `M${ax-sw},${ay} Q${ax},${ctrlPy} ${ax+sw},${ay}`;
          ans     = ['min','local min','minimum','local minimum'];
          typeStr = 'minimum';
          hintStr = `Look at what the curve does on each side of x=${c}. Does it change direction there, and which way?`;
        } else {
          actualPy= ay;                       // cubic S-curve passes through (ax, ay)
          py      = ay;
          // S-curve (inflection): same direction throughout, momentary flat tangent at center
          pathD   = `M${ax-sw},${ay+rise} C${ax-sw/2},${ay+rise} ${ax-sw/4},${ay+4} ${ax},${ay} C${ax+sw/4},${ay-4} ${ax+sw/2},${ay-rise} ${ax+sw},${ay-rise}`;
          ans     = ['neither'];
          typeStr = 'neither';
          hintStr = `Does the curve actually change direction at x=${c}, or does it keep going the same way? Trace it carefully from left to right.`;
        }

        const labelY = type === 0 ? actualPy-14 : type === 1 ? actualPy+18 : ay-16;
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto;border-radius:6px;background:#f8fafc">`
          + `<line x1="20" y1="${ay}" x2="${W-15}" y2="${ay}" stroke="#bbb" stroke-width="1.5"/>`
          + `<line x1="${ax}" y1="${H-12}" x2="${ax}" y2="8" stroke="#bbb" stroke-width="1.5"/>`
          + `<text x="${W-10}" y="${ay+4}" text-anchor="middle" font-size="11" fill="#aaa">x</text>`
          + `<text x="${ax+5}" y="15" font-size="11" fill="#aaa">y</text>`
          + `<path d="${pathD}" stroke="#2563eb" stroke-width="2.5" fill="none"/>`
          + `<circle cx="${ax}" cy="${actualPy}" r="4" fill="#dc2626"/>`
          + `<line x1="${ax-4}" y1="${ay}" x2="${ax+4}" y2="${ay}" stroke="#555" stroke-width="2"/>`
          + `<text x="${ax}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">x=${c}</text>`
          + `</svg>`;

        const stepStr = type === 2
          ? `\\text{Neither — the curve continues in the same direction through }x=${c}.`
          : `\\text{Local ${typeStr} at }x=${c}.`;

        return {
          svg: `<div style="text-align:center;margin-bottom:6px;font-size:15px">`
             + `Classify the critical point at <strong>x = ${c}</strong>:<br>`
             + `<span style="font-size:12px;color:#666">type <em>max</em>, <em>min</em>, or <em>neither</em></span></div>`
             + svg,
          answer: ans,
          hint: hintStr,
          step: stepStr
        };
      }

      // gen7: x-value where abs MAX occurs: f(x)=-x^2+2bx on [0,2b]  → x=b
      function gen7() {
        const b = rInt(4)+2;
        return {
          latex: `\\text{At what }x\\text{-value does the abs max of }f(x)=-x^2+${2*b}x\\text{ occur on }[0,${2*b}]?`,
          answer: [String(b)],
          hint: `Use the closed interval method: set f\\'(x)=0 to find the critical number, then evaluate f at that point and both endpoints. Which x-value gives the largest output?`,
          step: `\\begin{aligned}f'&=-2x+${2*b}=0\\\\x&=${b}\\\\f(0)&=0,\\quad f(${b})=${b*b},\\quad f(${2*b})&=0\\\\\\text{Max at }x&=${b}\\end{aligned}`
        };
      }

      // gen8: abs max VALUE of f(x)=-x^2+ax on [0,a], a even  → max = a^2/4  (integer)
      function gen8() {
        const a      = 2*(rInt(4)+2);    // a in {4,6,8,10}
        const maxVal = a*a/4;            // {4,9,16,25}
        return {
          latex: `\\text{Find the absolute maximum value of }f(x)=-x^2+${a}x\\text{ on }[0,${a}]`,
          answer: [String(maxVal)],
          hint: `Find the critical number inside [0,${a}] by setting f\\'(x)=0, then evaluate f there and at both endpoints. Compare all three values.`,
          step: `\\begin{aligned}f'(x)&=-2x+${a}=0\\\\x&=${a/2}\\\\f(0)&=0,\\quad f(${a/2})=${maxVal},\\quad f(${a})&=0\\\\\\text{Abs max}&=${maxVal}\\end{aligned}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_6: First Derivative Test
  CALC1_SPIRAL["Calc_3_6"] = {
    title: "First Derivative Test",
    index: 20,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: f(x)=ax^2+bx — concave up or down? f''=2a, constant sign. Answer always same.
      function gen1() {
        const isUp = rInt(2) === 0;
        const a    = (rInt(3)+1) * (isUp ? 1 : -1);   // a>0 → up, a<0 → down
        const b    = rInt(6) - 3;
        const bStr = b===0?'':b>0?`+${b}`:`${b}`;
        const ans  = isUp ? ['up','concave up'] : ['down','concave down'];
        return {
          latex: `\\text{Is }f(x)=${a}x^2${bStr}x\\text{ concave up or concave down?}`,
          answer: ans,
          hint: `Find f''(x). Is it positive or negative? What does that tell you?`,
          step: `f''(x)=${2*a}${isUp?'>0\\Rightarrow\\text{concave up}':'<0\\Rightarrow\\text{concave down}'}`
        };
      }

      // gen2: f(x)=x^3+ax^2, find inflection x-value → x=-a/3 (integer)
      // a=3k, k in {-3...-1, 1...3} so x=-k in {-3...-1, 1...3}
      function gen2() {
        const k = rInt(3)===0 ? -(rInt(2)+1) : (rInt(2)+1);   // nonzero in {-2,-1,1,2}
        const a = 3*k;
        const xi = -k;                          // inflection x-value
        return {
          latex: `\\text{Find the inflection point x-value of }f(x)=x^3+${a}x^2`,
          answer: [String(xi)],
          hint: `Find f''(x), set it equal to zero, and verify the sign changes.`,
          step: `\\begin{aligned}f''(x)&=6x+${2*a}=0\\\\x&=${xi}\\end{aligned}`
        };
      }

      // gen3: f(x)=x^3-3ax (a=xc^2), classify positive critical point xc by 2nd Deriv Test → local min
      function gen3() {
        const xc = rInt(3)+1;
        const a  = xc*xc;
        return {
          latex: `\\text{Classify }x=${xc}\\text{ for }f(x)=x^3-${3*a}x\\text{ using the 2nd Deriv. Test}`,
          answer: ['min','local min','minimum','local minimum'],
          hint: `Find f''(x) and evaluate it at x=${xc}. Is f''(${xc}) positive or negative? What does that mean?`,
          step: `\\begin{aligned}f'(x)&=3x^2-${3*a},\\;f'(${xc})=0\\\\f''(x)&=6x,\\;f''(${xc})=${6*xc}>0\\\\&\\Rightarrow\\text{local minimum}\\end{aligned}`
        };
      }

      // gen4: f(x)=-x^3+3ax (a=xc^2), classify positive critical point xc → local max
      function gen4() {
        const xc = rInt(3)+1;
        const a  = xc*xc;
        return {
          latex: `\\text{Classify }x=${xc}\\text{ for }f(x)=-x^3+${3*a}x\\text{ using the 2nd Deriv. Test}`,
          answer: ['max','local max','maximum','local maximum'],
          hint: `Find f''(x) and evaluate it at x=${xc}. Is f''(${xc}) positive or negative? What does that mean?`,
          step: `\\begin{aligned}f'(x)&=-3x^2+${3*a},\\;f'(${xc})=0\\\\f''(x)&=-6x,\\;f''(${xc})=${-6*xc}<0\\\\&\\Rightarrow\\text{local maximum}\\end{aligned}`
        };
      }

      // gen5: SVG curve — concave up (U) or concave down (∩)? Random.
      function gen5() {
        const isUp = rInt(2) === 0;
        const W=280, H=130, cx=140;
        const ans = isUp ? ['up','concave up'] : ['down','concave down'];
        // Control point is 2× desired arc so actual midpoint lands at correct position
        const pathD = isUp
          ? `M 35,108 Q ${cx},12 ${W-35},108`    // U shape: starts/ends low, arcs up
          : `M 35,22 Q ${cx},118 ${W-35},22`;    // ∩ shape: starts/ends high, arcs down
        const label = isUp ? 'concave up ∪' : 'concave down ∩';
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:6px auto;border-radius:6px;background:#f8fafc">`
          + `<path d="${pathD}" stroke="#2563eb" stroke-width="2.5" fill="none"/>`
          + `</svg>`;
        return {
          svg: `<div style="text-align:center;margin-bottom:4px;font-size:15px">Is this curve <strong>concave up</strong> or <strong>concave down</strong>?<br>`
             + `<span style="font-size:12px;color:#666">type <em>up</em> or <em>down</em></span></div>${svg}`,
          answer: ans,
          hint: `Does the curve open like a cup (∪) or a cap (∩)?`,
          step: `\\text{${isUp ? 'Concave up — opens like a cup ∪.' : 'Concave down — opens like a cap ∩.'}}`
        };
      }

      // gen6: SVG f'' sign chart — is x=c an inflection point? (yes or no, 50/50)
      function gen6() {
        const c        = rInt(5) - 2;
        const isInfl   = rInt(2) === 0;   // true → sign changes (inflection), false → same sign
        const W=280, H=95, ly=45, cx=140;
        let lSign, rSign, lCol, rCol;
        if (isInfl) {
          const startPos = rInt(2) === 0;   // + → − or − → +
          lSign = startPos ? '+' : '−'; rSign = startPos ? '−' : '+';
          lCol  = startPos ? '#1a7a1a' : '#b03030';
          rCol  = startPos ? '#b03030' : '#1a7a1a';
        } else {
          const allPos = rInt(2) === 0;
          lSign = rSign = allPos ? '+' : '−';
          lCol  = rCol  = allPos ? '#1a7a1a' : '#b03030';
        }
        const ans = isInfl ? ['yes','y'] : ['no','n'];
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:6px auto;border-radius:6px;background:#f8fafc">`
          + `<text x="14" y="${ly+5}" font-size="12" font-style="italic" fill="#555">f″:</text>`
          + `<line x1="32" y1="${ly}" x2="${W-20}" y2="${ly}" stroke="#888" stroke-width="1.5"/>`
          + `<line x1="${cx}" y1="${ly-12}" x2="${cx}" y2="${ly+12}" stroke="#333" stroke-width="2"/>`
          + `<text x="${cx-60}" y="${ly-10}" text-anchor="middle" font-size="26" font-weight="bold" fill="${lCol}">${lSign}</text>`
          + `<text x="${cx+60}" y="${ly-10}" text-anchor="middle" font-size="26" font-weight="bold" fill="${rCol}">${rSign}</text>`
          + `<text x="${cx}" y="${ly+28}" text-anchor="middle" font-size="13" fill="#333">x = ${c}</text>`
          + `</svg>`;
        const stepStr = isInfl
          ? `\\text{f'' changes sign at }x=${c}\\;\\Rightarrow\\;\\text{inflection point. Yes.}`
          : `\\text{f'' does not change sign at }x=${c}\\;\\Rightarrow\\;\\text{not an inflection point. No.}`;
        return {
          svg: `<div style="text-align:center;margin-bottom:4px;font-size:15px">Is <strong>x = ${c}</strong> an inflection point? <span style="font-size:12px;color:#666">(type <em>yes</em> or <em>no</em>)</span></div>${svg}`,
          answer: ans,
          hint: `An inflection point requires f'' to actually change sign. Does it here?`,
          step: stepStr
        };
      }

      // gen7: f(x)=x^3-3bx^2, find inflection x-value → x=b (integer)
      function gen7() {
        const b = rInt(4)+1;
        return {
          latex: `\\text{Find the inflection point x-value of }f(x)=x^3-${3*b}x^2`,
          answer: [String(b)],
          hint: `Find f''(x) and set it equal to zero. Then verify the sign of f'' changes there.`,
          step: `\\begin{aligned}f''(x)&=6x-${6*b}=0\\\\x&=${b}\\end{aligned}`
        };
      }

      // gen8: Given f'(c)=0 and f''(c) value, classify using 2nd Deriv Test → "max" or "min"
      function gen8() {
        const c   = rInt(5) - 2;
        const mag = rInt(4)+1;
        const pos = rInt(2) === 0;           // pos → f''>0 → local min
        const fpp = pos ? mag : -mag;
        const ans = pos ? ['min','local min','minimum','local minimum']
                        : ['max','local max','maximum','local maximum'];
        const typeStr = pos ? 'minimum' : 'maximum';
        return {
          latex: `\\text{If }f'(${c})=0\\text{ and }f''(${c})=${fpp},\\text{ classify }x=${c}`,
          answer: ans,
          hint: `Is f''(${c}) positive or negative? What does that tell you about concavity, and therefore the critical point?`,
          step: `f''(${c})=${fpp}${pos?'>0\\Rightarrow\\text{concave up}':'<0\\Rightarrow\\text{concave down}'}\\;\\Rightarrow\\;\\text{local ${typeStr}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_6_5: Concavity and Second Derivative Test
  CALC1_SPIRAL["Calc_3_6_5"] = {
    title: "Concavity and Second Derivative Test",
    index: 21,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: f(x)=ax^2+bx — concave up or down? f''=2a, constant sign. Answer always same.
      function gen1() {
        const isUp = rInt(2) === 0;
        const a    = (rInt(3)+1) * (isUp ? 1 : -1);   // a>0 → up, a<0 → down
        const b    = rInt(6) - 3;
        const bStr = b===0?'':b>0?`+${b}`:`${b}`;
        const ans  = isUp ? ['up','concave up'] : ['down','concave down'];
        return {
          latex: `\\text{Is }f(x)=${a}x^2${bStr}x\\text{ concave up or concave down?}`,
          answer: ans,
          hint: `Find f''(x). Is it positive or negative? What does that tell you?`,
          step: `f''(x)=${2*a}${isUp?'>0\\Rightarrow\\text{concave up}':'<0\\Rightarrow\\text{concave down}'}`
        };
      }

      // gen2: f(x)=x^3+ax^2, find inflection x-value → x=-a/3 (integer)
      // a=3k, k in {-3...-1, 1...3} so x=-k in {-3...-1, 1...3}
      function gen2() {
        const k = rInt(3)===0 ? -(rInt(2)+1) : (rInt(2)+1);   // nonzero in {-2,-1,1,2}
        const a = 3*k;
        const xi = -k;                          // inflection x-value
        return {
          latex: `\\text{Find the inflection point x-value of }f(x)=x^3+${a}x^2`,
          answer: [String(xi)],
          hint: `Find f''(x), set it equal to zero, and verify the sign changes.`,
          step: `\\begin{aligned}f''(x)&=6x+${2*a}=0\\\\x&=${xi}\\end{aligned}`
        };
      }

      // gen3: f(x)=x^3-3ax (a=xc^2), classify positive critical point xc by 2nd Deriv Test → local min
      function gen3() {
        const xc = rInt(3)+1;
        const a  = xc*xc;
        return {
          latex: `\\text{Classify }x=${xc}\\text{ for }f(x)=x^3-${3*a}x\\text{ using the 2nd Deriv. Test}`,
          answer: ['min','local min','minimum','local minimum'],
          hint: `Find f''(x) and evaluate it at x=${xc}. Is f''(${xc}) positive or negative? What does that mean?`,
          step: `\\begin{aligned}f'(x)&=3x^2-${3*a},\\;f'(${xc})=0\\\\f''(x)&=6x,\\;f''(${xc})=${6*xc}>0\\\\&\\Rightarrow\\text{local minimum}\\end{aligned}`
        };
      }

      // gen4: f(x)=-x^3+3ax (a=xc^2), classify positive critical point xc → local max
      function gen4() {
        const xc = rInt(3)+1;
        const a  = xc*xc;
        return {
          latex: `\\text{Classify }x=${xc}\\text{ for }f(x)=-x^3+${3*a}x\\text{ using the 2nd Deriv. Test}`,
          answer: ['max','local max','maximum','local maximum'],
          hint: `Find f''(x) and evaluate it at x=${xc}. Is f''(${xc}) positive or negative? What does that mean?`,
          step: `\\begin{aligned}f'(x)&=-3x^2+${3*a},\\;f'(${xc})=0\\\\f''(x)&=-6x,\\;f''(${xc})=${-6*xc}<0\\\\&\\Rightarrow\\text{local maximum}\\end{aligned}`
        };
      }

      // gen5: SVG curve — concave up (U) or concave down (∩)? Random.
      function gen5() {
        const isUp = rInt(2) === 0;
        const W=280, H=130, cx=140;
        const ans = isUp ? ['up','concave up'] : ['down','concave down'];
        // Control point is 2× desired arc so actual midpoint lands at correct position
        const pathD = isUp
          ? `M 35,108 Q ${cx},12 ${W-35},108`    // U shape: starts/ends low, arcs up
          : `M 35,22 Q ${cx},118 ${W-35},22`;    // ∩ shape: starts/ends high, arcs down
        const label = isUp ? 'concave up ∪' : 'concave down ∩';
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:6px auto;border-radius:6px;background:#f8fafc">`
          + `<path d="${pathD}" stroke="#2563eb" stroke-width="2.5" fill="none"/>`
          + `</svg>`;
        return {
          svg: `<div style="text-align:center;margin-bottom:4px;font-size:15px">Is this curve <strong>concave up</strong> or <strong>concave down</strong>?<br>`
             + `<span style="font-size:12px;color:#666">type <em>up</em> or <em>down</em></span></div>${svg}`,
          answer: ans,
          hint: `Does the curve open like a cup (∪) or a cap (∩)?`,
          step: `\\text{${isUp ? 'Concave up — opens like a cup ∪.' : 'Concave down — opens like a cap ∩.'}}`
        };
      }

      // gen6: SVG f'' sign chart — is x=c an inflection point? (yes or no, 50/50)
      function gen6() {
        const c        = rInt(5) - 2;
        const isInfl   = rInt(2) === 0;   // true → sign changes (inflection), false → same sign
        const W=280, H=95, ly=45, cx=140;
        let lSign, rSign, lCol, rCol;
        if (isInfl) {
          const startPos = rInt(2) === 0;   // + → − or − → +
          lSign = startPos ? '+' : '−'; rSign = startPos ? '−' : '+';
          lCol  = startPos ? '#1a7a1a' : '#b03030';
          rCol  = startPos ? '#b03030' : '#1a7a1a';
        } else {
          const allPos = rInt(2) === 0;
          lSign = rSign = allPos ? '+' : '−';
          lCol  = rCol  = allPos ? '#1a7a1a' : '#b03030';
        }
        const ans = isInfl ? ['yes','y'] : ['no','n'];
        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:6px auto;border-radius:6px;background:#f8fafc">`
          + `<text x="14" y="${ly+5}" font-size="12" font-style="italic" fill="#555">f″:</text>`
          + `<line x1="32" y1="${ly}" x2="${W-20}" y2="${ly}" stroke="#888" stroke-width="1.5"/>`
          + `<line x1="${cx}" y1="${ly-12}" x2="${cx}" y2="${ly+12}" stroke="#333" stroke-width="2"/>`
          + `<text x="${cx-60}" y="${ly-10}" text-anchor="middle" font-size="26" font-weight="bold" fill="${lCol}">${lSign}</text>`
          + `<text x="${cx+60}" y="${ly-10}" text-anchor="middle" font-size="26" font-weight="bold" fill="${rCol}">${rSign}</text>`
          + `<text x="${cx}" y="${ly+28}" text-anchor="middle" font-size="13" fill="#333">x = ${c}</text>`
          + `</svg>`;
        const stepStr = isInfl
          ? `\\text{f'' changes sign at }x=${c}\\;\\Rightarrow\\;\\text{inflection point. Yes.}`
          : `\\text{f'' does not change sign at }x=${c}\\;\\Rightarrow\\;\\text{not an inflection point. No.}`;
        return {
          svg: `<div style="text-align:center;margin-bottom:4px;font-size:15px">Is <strong>x = ${c}</strong> an inflection point? <span style="font-size:12px;color:#666">(type <em>yes</em> or <em>no</em>)</span></div>${svg}`,
          answer: ans,
          hint: `An inflection point requires f'' to actually change sign. Does it here?`,
          step: stepStr
        };
      }

      // gen7: f(x)=x^3-3bx^2, find inflection x-value → x=b (integer)
      function gen7() {
        const b = rInt(4)+1;
        return {
          latex: `\\text{Find the inflection point x-value of }f(x)=x^3-${3*b}x^2`,
          answer: [String(b)],
          hint: `Find f''(x) and set it equal to zero. Then verify the sign of f'' changes there.`,
          step: `\\begin{aligned}f''(x)&=6x-${6*b}=0\\\\x&=${b}\\end{aligned}`
        };
      }

      // gen8: Given f'(c)=0 and f''(c) value, classify using 2nd Deriv Test → "max" or "min"
      function gen8() {
        const c   = rInt(5) - 2;
        const mag = rInt(4)+1;
        const pos = rInt(2) === 0;           // pos → f''>0 → local min
        const fpp = pos ? mag : -mag;
        const ans = pos ? ['min','local min','minimum','local minimum']
                        : ['max','local max','maximum','local maximum'];
        const typeStr = pos ? 'minimum' : 'maximum';
        return {
          latex: `\\text{If }f'(${c})=0\\text{ and }f''(${c})=${fpp},\\text{ classify }x=${c}`,
          answer: ans,
          hint: `Is f''(${c}) positive or negative? What does that tell you about concavity, and therefore the critical point?`,
          step: `f''(${c})=${fpp}${pos?'>0\\Rightarrow\\text{concave up}':'<0\\Rightarrow\\text{concave down}'}\\;\\Rightarrow\\;\\text{local ${typeStr}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_3_8: Mean Value Theorem
  CALC1_SPIRAL["Calc_3_8"] = {
    title: "Mean Value Theorem",
    index: 22,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: AROC of f(x)=x^2 on [a,b] → (b^2-a^2)/(b-a) = a+b  (always integer)
      function gen1() {
        const a = rInt(4)+1, b = a + rInt(3)+2;   // b > a, gap 2-4
        const ans = a + b;
        return {
          latex: `\\text{Find the average rate of change of }f(x)=x^2\\text{ on }[${a},${b}]`,
          answer: [String(ans)],
          hint: `Plug into \\frac{f(b)-f(a)}{b-a}. Notice how the numerator factors.`,
          step: `\\frac{${b*b}-${a*a}}{${b}-${a}}=\\frac{${b*b-a*a}}{${b-a}}=${ans}`
        };
      }

      // gen2: AROC of f(x)=x^2+cx on [0,b] → (b^2+cb)/b = b+c  (always integer)
      function gen2() {
        const b = rInt(4)+2, c = rInt(4)+1;
        const ans = b + c;
        return {
          latex: `\\text{Find the average rate of change of }f(x)=x^2+${c}x\\text{ on }[0,${b}]`,
          answer: [String(ans)],
          hint: `f(0)=0, so AROC simplifies to f(${b})/${b}. Compute f(${b}) first.`,
          step: `\\frac{f(${b})-f(0)}{${b}-0}=\\frac{${b*b+c*b}}{${b}}=${ans}`
        };
      }

      // gen3: Find c from MVT for f(x)=x^2 on [a,b] → c=(a+b)/2  (integer when a+b even)
      // Ensure a+b even by making both odd or both even.
      function gen3() {
        const parity = rInt(2);                           // 0=both odd, 1=both even
        const a = 2*rInt(3) + (parity===0?1:2);           // odd in {1,3,5} or even in {2,4,6}
        const b = a + 2*(rInt(2)+1);                      // b = a+2 or a+4, same parity
        const aroc = a + b;
        const c    = (a + b) / 2;
        return {
          latex: `\\text{Find }c\\text{ guaranteed by MVT for }f(x)=x^2\\text{ on }[${a},${b}]`,
          answer: [String(c)],
          hint: `Compute the average rate of change first, then set f'(x) equal to it and solve.`,
          step: `\\begin{aligned}m&=\\frac{${b*b}-${a*a}}{${b}-${a}}=${aroc}\\\\f'(x)&=2x=${aroc}\\\\c&=${c}\\end{aligned}`
        };
      }

      // gen4: Find c from MVT for f(x)=x^2+2x on [0,b] → c=b/2  (integer when b even)
      function gen4() {
        const b    = 2*(rInt(3)+1);    // b in {2,4,6}
        const aroc = b + 2;            // (b^2+2b)/b = b+2
        const c    = b / 2;
        return {
          latex: `\\text{Find }c\\text{ guaranteed by MVT for }f(x)=x^2+2x\\text{ on }[0,${b}]`,
          answer: [String(c)],
          hint: `f(0)=0 simplifies the AROC. Then set f'(x)=2x+2 equal to the average rate and solve.`,
          step: `\\begin{aligned}m&=\\frac{${b*b+2*b}}{${b}}=${aroc}\\\\2x+2&=${aroc}\\\\c&=${c}\\end{aligned}`
        };
      }

      // gen5: Rolle's — f(x)=x^2-2ax on [0,2a], f'(c)=0 → c=a  (integer)
      function gen5() {
        const a = rInt(4)+1;
        return {
          latex: `\\text{Find }c\\text{ from Rolle's Theorem for }f(x)=x^2-${2*a}x\\text{ on }[0,${2*a}]`,
          answer: [String(a)],
          hint: `Verify f(0)=f(${2*a}) first. Then set f'(x)=0 and solve — that's your c.`,
          step: `\\begin{aligned}f(0)&=0,\\;f(${2*a})=${4*a*a}-${4*a*a}=0\\;\\checkmark\\\\f'(x)&=2x-${2*a}=0\\\\c&=${a}\\end{aligned}`
        };
      }

      // gen6: Rolle's — f(x)=(x-p)(x-q) on [p,q], c=(p+q)/2  (integer, q-p even)
      function gen6() {
        const p  = rInt(4)+1;
        const q  = p + 2*(rInt(2)+1);    // gap of 2 or 4, same parity → c integer
        const c  = (p + q) / 2;
        return {
          latex: `\\text{Find }c\\text{ from Rolle's Theorem for }f(x)=(x-${p})(x-${q})\\text{ on }[${p},${q}]`,
          answer: [String(c)],
          hint: `f(${p})=f(${q})=0, so Rolle's applies. Expand or use the product rule to find f'(x), then set it to 0.`,
          step: `\\begin{aligned}f(${p})&=f(${q})=0\\;\\checkmark\\\\f'(x)&=2x-${p+q}=0\\\\c&=${c}\\end{aligned}`
        };
      }

      // gen7: Word problem — car travels d miles in t hours, find guaranteed speed (integer mph)
      function gen7() {
        const spd  = (rInt(4)+1)*10;    // speed in {10,20,30,40} — will scale to realistic values
        const hrs  = rInt(2)+2;         // time in {2,3}
        const dist = spd * hrs;
        return {
          latex: `\\text{A car travels ${dist} miles in ${hrs} hours. The MVT guarantees it was going exactly how many mph at some moment?}`,
          answer: [String(spd)],
          hint: `The MVT guarantees the instantaneous speed equaled the average speed at some point. Compute total distance / total time.`,
          step: `\\text{Average speed}=\\frac{${dist}}{${hrs}}=${spd}\\text{ mph}`
        };
      }

      // gen8: Temperature word problem — ΔT over Δt, find guaranteed rate (integer °F/hr)
      function gen8() {
        const rate = rInt(4)+2;         // °F per hour: {2,3,4,5}
        const hrs  = rInt(2)+2;         // hours: {2,3}
        const t1   = 50 + 2*rInt(8);    // starting temp, even number in {50,...,64}
        const t2   = t1 + rate*hrs;
        return {
          latex: `\\text{Temperature rose from ${t1}°F to ${t2}°F over ${hrs} hours. The MVT guarantees it changed at exactly how many °F/hr at some moment?}`,
          answer: [String(rate)],
          hint: `Compute the average rate of temperature change over the interval. The MVT guarantees this rate occurred instantaneously.`,
          step: `\\frac{${t2}-${t1}}{${hrs}}=\\frac{${rate*hrs}}{${hrs}}=${rate}\\text{ °F/hr}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_1: Distance and Area
  CALC1_SPIRAL["Calc_4_1"] = {
    title: "Distance and Area",
    index: 23,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: Left Riemann sum from a table — 3 intervals, unequal widths
      function gen1() {
        const cases = [
          {xs:[0,2,5,8],  fs:[4,6,2,1], ans:32},
          {xs:[1,3,6,10], fs:[5,3,2,4], ans:27},
          {xs:[0,1,4,7],  fs:[3,5,2,1], ans:24},
          {xs:[2,4,6,9],  fs:[2,4,6,3], ans:30},
          {xs:[0,3,5,8],  fs:[6,4,2,5], ans:32},
          {xs:[1,2,5,9],  fs:[4,2,3,1], ans:22},
        ];
        const {xs, fs, ans} = choose(cases);
        const ws = [xs[1]-xs[0], xs[2]-xs[1], xs[3]-xs[2]];
        let parts = [];
        for (let i = 0; i < 3; i++) parts.push(`${fs[i]}(${ws[i]})`);
        return {
          latex:  `\\begin{array}{c|cccc} x & ${xs[0]} & ${xs[1]} & ${xs[2]} & ${xs[3]} \\\\ f(x) & ${fs[0]} & ${fs[1]} & ${fs[2]} & ${fs[3]} \\end{array}\\;\\text{(Left sum)}`,
          answer: [String(ans)],
          hint:   `For a left sum, which endpoint do you use in each subinterval? Width = difference between consecutive x-values.`,
          step:   `${parts.join('+')}=${ans}`
        };
      }

      // gen2: Right Riemann sum from a table — 3 intervals, unequal widths
      function gen2() {
        const cases = [
          {xs:[0,2,5,8],  fs:[4,6,2,1], ans:21},
          {xs:[1,3,6,10], fs:[5,3,2,4], ans:28},
          {xs:[0,1,4,7],  fs:[3,5,2,1], ans:14},
          {xs:[2,4,6,9],  fs:[2,4,6,3], ans:29},
          {xs:[0,3,5,8],  fs:[6,4,2,5], ans:31},
          {xs:[1,2,5,9],  fs:[4,2,3,1], ans:15},
        ];
        const {xs, fs, ans} = choose(cases);
        const ws = [xs[1]-xs[0], xs[2]-xs[1], xs[3]-xs[2]];
        let parts = [];
        for (let i = 0; i < 3; i++) parts.push(`${fs[i+1]}(${ws[i]})`);
        return {
          latex:  `\\begin{array}{c|cccc} x & ${xs[0]} & ${xs[1]} & ${xs[2]} & ${xs[3]} \\\\ f(x) & ${fs[0]} & ${fs[1]} & ${fs[2]} & ${fs[3]} \\end{array}\\;\\text{(Right sum)}`,
          answer: [String(ans)],
          hint:   `For a right sum, which endpoint do you use in each subinterval? Width = difference between consecutive x-values.`,
          step:   `${parts.join('+')}=${ans}`
        };
      }

      // gen3: Left sum f(x)=x on [0,b], n=2 → b²/4 (b even → integer)
      function gen3() {
        const b   = 2 * (rInt(3) + 2);   // b in {4,6,8}
        const dx  = b / 2;
        const ans = 0 * dx + (b / 2) * dx;  // f(0)*dx + f(b/2)*dx
        return {
          latex:  `\\text{Left sum for }f(x)=x\\text{ on }[0,${b}]\\text{ with }n=2`,
          answer: [String(ans)],
          hint:   `Compute Δx = (b-a)/n. Which x-values are the left endpoints of the two subintervals?`,
          step:   `\\Delta x=${dx},\\; f(0)(${dx})+f(${dx})(${dx})=0+${dx}\\cdot${dx}=${ans}`
        };
      }

      // gen4: Right sum f(x)=x on [0,b], n=2 → 3b²/4 (b even → integer)
      function gen4() {
        const b   = 2 * (rInt(3) + 2);   // b in {4,6,8}
        const dx  = b / 2;
        const ans = (b / 2) * dx + b * dx;
        return {
          latex:  `\\text{Right sum for }f(x)=x\\text{ on }[0,${b}]\\text{ with }n=2`,
          answer: [String(ans)],
          hint:   `Compute Δx = (b-a)/n. Which x-values are the right endpoints of the two subintervals?`,
          step:   `\\Delta x=${dx},\\; f(${dx})(${dx})+f(${b})(${dx})=${dx*dx}+${b*dx}=${ans}`
        };
      }

      // gen5: Left sum f(x)=x+c on [0,b], n=2 → cb + b²/4 (b even → integer)
      function gen5() {
        const b   = 2 * (rInt(2) + 2);   // b in {4,6}
        const c   = rInt(3) + 1;          // c in {1,2,3}
        const dx  = b / 2;
        const f   = x => x + c;
        const ans = f(0) * dx + f(dx) * dx;
        return {
          latex:  `\\text{Left sum for }f(x)=x+${c}\\text{ on }[0,${b}]\\text{ with }n=2`,
          answer: [String(ans)],
          hint:   `Compute Δx and the two left endpoints. Evaluate f(x)=x+${c} at each, multiply by Δx, and add.`,
          step:   `\\Delta x=${dx},\\; f(0)(${dx})+f(${dx})(${dx})=${f(0)*dx}+${f(dx)*dx}=${ans}`
        };
      }

      // gen6: Right sum f(x)=x+c on [0,b], n=2 → 3b²/4 + cb (b even → integer)
      function gen6() {
        const b   = 2 * (rInt(2) + 2);   // b in {4,6}
        const c   = rInt(3) + 1;          // c in {1,2,3}
        const dx  = b / 2;
        const f   = x => x + c;
        const ans = f(dx) * dx + f(b) * dx;
        return {
          latex:  `\\text{Right sum for }f(x)=x+${c}\\text{ on }[0,${b}]\\text{ with }n=2`,
          answer: [String(ans)],
          hint:   `Compute Δx and the two right endpoints. Evaluate f(x)=x+${c} at each, multiply by Δx, and add.`,
          step:   `\\Delta x=${dx},\\; f(${dx})(${dx})+f(${b})(${dx})=${f(dx)*dx}+${f(b)*dx}=${ans}`
        };
      }

      // gen7: Left sum f(x)=2x on [0,b], n=3 → 2b²/3 (b div by 3 → integer)
      function gen7() {
        const b   = 3 * (rInt(3) + 1);   // b in {3,6,9}
        const dx  = b / 3;
        const f   = x => 2 * x;
        const pts = [0, dx, 2*dx];
        const ans = pts.reduce((s, x) => s + f(x) * dx, 0);
        return {
          latex:  `\\text{Left sum for }f(x)=2x\\text{ on }[0,${b}]\\text{ with }n=3`,
          answer: [String(ans)],
          hint:   `Compute Δx = b/n. List the three left endpoints, evaluate 2x at each, and multiply each by Δx.`,
          step:   `\\Delta x=${dx},\\; ${pts.map(x=>f(x)+'('+dx+')').join('+')}=${ans}`
        };
      }

      // gen8: Velocity word problem → distance = v*t (area of rectangle)
      function gen8() {
        const v = choose([30, 40, 50, 60]);   // speed in mph
        const t = rInt(3) + 2;               // time in {2,3,4} hours
        const ans = v * t;
        return {
          latex:  `\\text{A car travels at ${v} mph for ${t} hours. What is }\\int_0^{${t}} ${v}\\,dt\\text{?}`,
          answer: [String(ans)],
          hint:   `The integral of a constant over an interval equals the constant times the interval length. What shape is this area?`,
          step:   `\\text{Area of rectangle: }${v}\\times${t}=${ans}\\text{ miles}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_2: Riemann Sums
  CALC1_SPIRAL["Calc_4_2"] = {
    title: "Riemann Sums",
    index: 24,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: Left Riemann sum for f(x)=x on [0,b] with n rects → integer
      function gen1() {
        const cases = [
          {b:4, n:4, dx:1, ans:6},
          {b:4, n:2, dx:2, ans:4},
          {b:6, n:3, dx:2, ans:12},
          {b:6, n:2, dx:3, ans:9},
          {b:8, n:4, dx:2, ans:24},
          {b:6, n:6, dx:1, ans:15},
        ];
        const {b, n, dx, ans} = choose(cases);
        let terms = [];
        for (let i = 0; i < n; i++) terms.push(String(i * dx));
        return {
          latex: `\\text{Left Riemann sum for }f(x)=x\\text{ on }[0,${b}]\\text{ with }n=${n}`,
          answer: [String(ans)],
          hint: `Left sum uses left endpoints. What is Δx for this partition?`,
          step: `\\Delta x=${dx},\\quad L_{${n}}=(${terms.join('+')})\\cdot${dx}=${ans}`
        };
      }

      // gen2: Right Riemann sum for f(x)=x on [0,b] with n rects → integer
      function gen2() {
        const cases = [
          {b:4, n:4, dx:1, ans:10},
          {b:4, n:2, dx:2, ans:12},
          {b:6, n:3, dx:2, ans:24},
          {b:6, n:2, dx:3, ans:27},
          {b:8, n:4, dx:2, ans:40},
          {b:6, n:6, dx:1, ans:21},
        ];
        const {b, n, dx, ans} = choose(cases);
        let terms = [];
        for (let i = 1; i <= n; i++) terms.push(String(i * dx));
        return {
          latex: `\\text{Right Riemann sum for }f(x)=x\\text{ on }[0,${b}]\\text{ with }n=${n}`,
          answer: [String(ans)],
          hint: `Right sum uses right endpoints. What is Δx for this partition?`,
          step: `\\Delta x=${dx},\\quad R_{${n}}=(${terms.join('+')})\\cdot${dx}=${ans}`
        };
      }

      // gen3: Left Riemann sum for f(x)=x^2 on [0,b] with n rects → integer
      function gen3() {
        const cases = [
          {b:3, n:3, dx:1, ans:5},
          {b:4, n:2, dx:2, ans:8},
          {b:4, n:4, dx:1, ans:14},
          {b:5, n:5, dx:1, ans:30},
          {b:6, n:3, dx:2, ans:40},
        ];
        const {b, n, dx, ans} = choose(cases);
        let terms = [];
        for (let i = 0; i < n; i++) terms.push(String((i * dx) * (i * dx)));
        return {
          latex: `\\text{Left Riemann sum for }f(x)=x^2\\text{ on }[0,${b}]\\text{ with }n=${n}`,
          answer: [String(ans)],
          hint: `Left endpoints are the left edges of each subinterval. What is Δx for this partition?`,
          step: `\\Delta x=${dx},\\quad L_{${n}}=(${terms.join('+')})\\cdot${dx}=${ans}`
        };
      }

      // gen4: Right Riemann sum for f(x)=x^2 on [0,b] with n rects → integer
      function gen4() {
        const cases = [
          {b:3, n:3, dx:1, ans:14},
          {b:4, n:2, dx:2, ans:40},
          {b:4, n:4, dx:1, ans:30},
          {b:5, n:5, dx:1, ans:55},
          {b:6, n:3, dx:2, ans:112},
        ];
        const {b, n, dx, ans} = choose(cases);
        let terms = [];
        for (let i = 1; i <= n; i++) terms.push(String((i * dx) * (i * dx)));
        return {
          latex: `\\text{Right Riemann sum for }f(x)=x^2\\text{ on }[0,${b}]\\text{ with }n=${n}`,
          answer: [String(ans)],
          hint: `Right endpoints are the right edges of each subinterval. What is Δx for this partition?`,
          step: `\\Delta x=${dx},\\quad R_{${n}}=(${terms.join('+')})\\cdot${dx}=${ans}`
        };
      }

      // gen5: SVG — identify left / right / midpoint from a diagram
      function gen5() {
        const type = choose(['left', 'right', 'midpoint']);
        const W=320, H=155, lm=42, rm=15, tm=12, bm=30;
        const plotW = W - lm - rm, plotH = H - tm - bm;
        // f(x) = -(x-2)^2 + 5  on [0,4], range [1,5]
        const f  = x => -(x - 2) * (x - 2) + 5;
        const sx = x => lm + (x / 4) * plotW;
        const sy = y => (H - bm) - (y / 6) * plotH;

        // Curve polyline
        let pts = [];
        for (let i = 0; i <= 40; i++) { const x = i * 0.1; pts.push(`${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`); }

        // Rectangle evaluation points
        const evalXs = type === 'left'     ? [0, 1, 2, 3]
                     : type === 'right'    ? [1, 2, 3, 4]
                     :                       [0.5, 1.5, 2.5, 3.5];
        const rw = (plotW / 4).toFixed(1);
        let rects = '';
        for (let i = 0; i < 4; i++) {
          const h  = f(evalXs[i]);
          const rx = sx(i).toFixed(1);
          const ry = sy(h).toFixed(1);
          const rh = ((H - bm) - sy(h)).toFixed(1);
          rects += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#cce0f5" stroke="#1e3a5c" stroke-width="1.2" opacity="0.85"/>`;
        }

        // Axes
        const ax = H - bm;
        let xlbls = '';
        for (let i = 0; i <= 4; i++) xlbls += `<text x="${sx(i).toFixed(1)}" y="${ax + 15}" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">${i}</text>`;

        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto">`
          + rects
          + `<line x1="${lm}" y1="${ax}" x2="${W-rm}" y2="${ax}" stroke="#555" stroke-width="1.5"/>`
          + `<line x1="${lm}" y1="${tm}" x2="${lm}" y2="${ax}" stroke="#555" stroke-width="1.5"/>`
          + `<polyline points="${pts.join(' ')}" fill="none" stroke="#c0392b" stroke-width="2.2"/>`
          + xlbls
          + `</svg>`;

        const desc = type === 'midpoint' ? 'center' : type + ' edge';
        return {
          svg,
          answer: [type],
          hint: `Look at where the height of each rectangle is measured within its subinterval — the left edge, right edge, or center?`,
          step: `\\text{Heights sampled at the ${desc} of each subinterval}\\Rightarrow\\text{${type} Riemann sum.}`
        };
      }

      // gen6: SVG — over/underestimate for increasing linear function
      function gen6() {
        const isLeft = rInt(2) === 0;
        const type   = isLeft ? 'left' : 'right';
        const ans    = isLeft ? 'underestimate' : 'overestimate';
        const W=320, H=155, lm=42, rm=15, tm=12, bm=30;
        const plotW = W - lm - rm, plotH = H - tm - bm;
        // f(x) = x + 1  on [0,4], increasing, range [1,5]
        const f  = x => x + 1;
        const sx = x => lm + (x / 4) * plotW;
        const sy = y => (H - bm) - (y / 6) * plotH;

        // Line (two points suffice)
        const linePts = `${sx(0).toFixed(1)},${sy(f(0)).toFixed(1)} ${sx(4).toFixed(1)},${sy(f(4)).toFixed(1)}`;

        // Rectangle heights
        const evalXs = isLeft ? [0, 1, 2, 3] : [1, 2, 3, 4];
        const rw = (plotW / 4).toFixed(1);
        let rects = '';
        for (let i = 0; i < 4; i++) {
          const h  = f(evalXs[i]);
          const rx = sx(i).toFixed(1);
          const ry = sy(h).toFixed(1);
          const rh = ((H - bm) - sy(h)).toFixed(1);
          rects += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#cce0f5" stroke="#1e3a5c" stroke-width="1.2" opacity="0.85"/>`;
        }

        const ax = H - bm;
        let xlbls = '';
        for (let i = 0; i <= 4; i++) xlbls += `<text x="${sx(i).toFixed(1)}" y="${ax + 15}" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#444">${i}</text>`;

        const svg = `<svg width="${W}" height="${H}" style="display:block;margin:4px auto">`
          + rects
          + `<line x1="${lm}" y1="${ax}" x2="${W-rm}" y2="${ax}" stroke="#555" stroke-width="1.5"/>`
          + `<line x1="${lm}" y1="${tm}" x2="${lm}" y2="${ax}" stroke="#555" stroke-width="1.5"/>`
          + `<polyline points="${linePts}" fill="none" stroke="#c0392b" stroke-width="2.2"/>`
          + xlbls
          + `</svg>`;

        const relation = isLeft ? 'fall below' : 'extend above';
        return {
          svg,
          answer: [ans],
          hint: `f is increasing. Do ${type} rectangle tops sit above the curve or below it on each subinterval?`,
          step: `\\text{f increasing + ${type} sum}\\Rightarrow\\text{rectangles ${relation} the curve}\\Rightarrow\\text{${ans}.}`
        };
      }

      // gen7: Sigma notation  \sum_{i=1}^{n} c*i = c*n(n+1)/2 → integer
      function gen7() {
        const c   = rInt(3) + 1;           // c in {1,2,3}
        const n   = rInt(3) + 4;           // n in {4,5,6}
        const ans = c * n * (n + 1) / 2;
        const coeffStr = c === 1 ? 'i' : `${c}i`;
        return {
          latex: `\\sum_{i=1}^{${n}} ${coeffStr}`,
          answer: [String(ans)],
          hint: `Try factoring the constant out first. Do you remember the closed-form formula for the sum of i from 1 to n?`,
          step: `${c}\\cdot\\frac{${n}\\cdot${n + 1}}{2}=${c}\\cdot${n * (n + 1) / 2}=${ans}`
        };
      }

      // gen8: Verbal over/underestimate — all four combos (inc/dec × left/right)
      function gen8() {
        const isInc  = rInt(2) === 0;
        const isLeft = rInt(2) === 0;
        const dir    = isInc  ? 'increasing' : 'decreasing';
        const type   = isLeft ? 'left'       : 'right';
        // inc+left→under, inc+right→over, dec+left→over, dec+right→under
        const ans    = (isInc === isLeft) ? 'underestimate' : 'overestimate';
        return {
          latex: `\\text{f is ${dir} on }[a,b].\\text{ Is the ${type} Riemann sum an over- or underestimate?}`,
          answer: [ans],
          hint: `Sketch a quick ${dir} curve. For a ${type} sum, are the rectangle tops above or below the curve?`,
          step: `\\text{${dir[0].toUpperCase() + dir.slice(1)} f + ${type} sum}\\Rightarrow\\text{${ans}.}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_3: Basic Integral Rules
  CALC1_SPIRAL["Calc_4_3"] = {
    title: "Basic Integral Rules",
    index: 25,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: Power Rule — ask for the coefficient in the antiderivative
      function gen1() {
        const n   = rInt(4) + 1;          // n in {1,2,3,4}
        const k   = rInt(5) + 1;          // result coefficient
        const a   = k * (n + 1);          // a/(n+1) = k exactly
        return {
          latex:  `\\text{Find }\\displaystyle\\int ${a}x^{${n}}\\,dx.`
                  + `\\text{ What is the coefficient of }x^{${n+1}}\\text{? (Omit }+C)`,
          answer: [String(k)],
          hint:   'Apply the Power Rule: raise the exponent by 1, then divide by the new exponent.',
          step:   `\\int ${a}x^{${n}}\\,dx = \\dfrac{${a}}{${n+1}}x^{${n+1}}+C = ${k}x^{${n+1}}+C`
        };
      }

      // gen2: Definite ∫₀^b ax² dx — integer answer
      function gen2() {
        const k   = rInt(4) + 1;
        const a   = 3 * k;
        const b   = rInt(3) + 1;
        const ans = k * b * b * b;
        return {
          latex:  `\\text{Evaluate }\\displaystyle\\int_0^{${b}} ${a}x^2\\,dx`,
          answer: [String(ans)],
          hint:   'Find the antiderivative using the Power Rule, then apply the bounds.',
          step:   `\\left[\\dfrac{${a}x^3}{3}\\right]_0^{${b}} = ${k}\\cdot${b}^3 = ${ans}`
        };
      }

      // gen3: Definite ∫₁^b ax dx, a even — integer answer
      function gen3() {
        const half = rInt(4) + 1;
        const a    = 2 * half;
        const b    = rInt(4) + 2;
        const ans  = half * (b * b - 1);
        return {
          latex:  `\\text{Evaluate }\\displaystyle\\int_1^{${b}} ${a}x\\,dx`,
          answer: [String(ans)],
          hint:   'The antiderivative of $ax$ is $\\tfrac{a}{2}x^2$. Evaluate at both bounds.',
          step:   `\\left[${half}x^2\\right]_1^{${b}} = ${half}\\cdot${b*b} - ${half}\\cdot 1 = ${ans}`
        };
      }

      // gen4: ∫ke^x dx — symbolic answer "ke^x"
      function gen4() {
        const k = rInt(8) + 2;
        return {
          latex:  `\\text{Find }\\displaystyle\\int ${k}e^x\\,dx.\\text{ (Omit }+C)`,
          answer: [`${k}e^x`],
          hint:   'The function $e^x$ is its own antiderivative.',
          step:   `\\int ${k}e^x\\,dx = ${k}e^x+C`
        };
      }

      // gen5: ∫a sin(x) dx — answer "-acos(x)"
      function gen5() {
        const a = rInt(5) + 2;
        return {
          latex:  `\\text{Find }\\displaystyle\\int ${a}\\sin x\\,dx.\\text{ (Omit }+C)`,
          answer: [`-${a}cos(x)`],
          hint:   'What function differentiates to $\\sin x$? Watch the sign.',
          step:   `\\int ${a}\\sin x\\,dx = -${a}\\cos x+C`
        };
      }

      // gen6: ∫a cos(x) dx — answer "asin(x)"
      function gen6() {
        const a = rInt(5) + 2;
        return {
          latex:  `\\text{Find }\\displaystyle\\int ${a}\\cos x\\,dx.\\text{ (Omit }+C)`,
          answer: [`${a}sin(x)`],
          hint:   'What function differentiates to $\\cos x$?',
          step:   `\\int ${a}\\cos x\\,dx = ${a}\\sin x+C`
        };
      }

      // gen7: Definite ∫₀^b k dx = kb
      function gen7() {
        const k   = rInt(6) + 2;
        const b   = rInt(5) + 2;
        const ans = k * b;
        return {
          latex:  `\\text{Evaluate }\\displaystyle\\int_0^{${b}} ${k}\\,dx`,
          answer: [String(ans)],
          hint:   'The antiderivative of a constant $k$ is $kx$. This is the area of a rectangle.',
          step:   `\\left[${k}x\\right]_0^{${b}} = ${k}\\cdot${b} = ${ans}`
        };
      }

      // gen8: Definite ∫₋b^0 x dx — negative signed area
      function gen8() {
        const b   = choose([2, 4, 6]);
        const ans = -(b * b) / 2;
        return {
          latex:  `\\text{Evaluate }\\displaystyle\\int_{-${b}}^{0} x\\,dx`,
          answer: [String(ans)],
          hint:   'On this interval $x < 0$. What does that mean for the signed area?',
          step:   `\\left[\\dfrac{x^2}{2}\\right]_{-${b}}^{0} = 0 - \\dfrac{${b}^2}{2} = ${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_4: Fundamental Theorem of Calculus
  CALC1_SPIRAL["Calc_4_4"] = {
    title: "Fundamental Theorem of Calculus",
    index: 26,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: ∫[a,b] k dx = k(b-a) — constant function → integer
      function gen1() {
        const k   = rInt(4) + 2;        // k in {2,3,4,5}
        const a   = rInt(3) + 1;        // a in {1,2,3}
        const len = rInt(3) + 2;        // b-a in {2,3,4}
        const b   = a + len;
        const ans = k * len;
        return {
          latex:  `\\int_{${a}}^{${b}} ${k}\\,dx`,
          answer: [String(ans)],
          hint:   `FTC Part 2: find F, then compute F(b)−F(a). Which basic antiderivative rule applies to a constant?`,
          step:   `\\left[${k}x\\right]_{${a}}^{${b}}=${k}(${b})-${k}(${a})=${ans}`
        };
      }

      // gen2: ∫[0,b] x dx = b²/2 — b even → integer
      function gen2() {
        const b   = 2 * (rInt(4) + 1);  // b in {2,4,6,8}
        const ans = b * b / 2;
        return {
          latex:  `\\int_0^{${b}} x\\,dx`,
          answer: [String(ans)],
          hint:   `Power rule for integrals: raise the exponent by 1, divide by the new exponent. What does that give you for x?`,
          step:   `\\left[\\frac{x^2}{2}\\right]_0^{${b}}=\\frac{${b*b}}{2}=${ans}`
        };
      }

      // gen3: ∫[a,b] x dx = (b²-a²)/2 — same parity → integer
      function gen3() {
        const par = rInt(2);
        const a   = 2 * rInt(2) + (par === 0 ? 1 : 2);   // odd {1,3} or even {2,4}
        const b   = a + 2 * (rInt(2) + 1);               // b = a+2 or a+4
        const ans = (b * b - a * a) / 2;
        return {
          latex:  `\\int_{${a}}^{${b}} x\\,dx`,
          answer: [String(ans)],
          hint:   `Same power rule as the previous type. The lower limit here is ${a}, not 0 — does your F(b)−F(a) account for that?`,
          step:   `\\left[\\frac{x^2}{2}\\right]_{${a}}^{${b}}=\\frac{${b*b}}{2}-\\frac{${a*a}}{2}=\\frac{${b*b-a*a}}{2}=${ans}`
        };
      }

      // gen4: ∫[0,b] x² dx = b³/3 — b in {3,6} → integer
      function gen4() {
        const b   = choose([3, 6]);
        const ans = b * b * b / 3;
        return {
          latex:  `\\int_0^{${b}} x^2\\,dx`,
          answer: [String(ans)],
          hint:   `Power rule applies to x². What is the new exponent after integrating, and what do you divide by?`,
          step:   `\\left[\\frac{x^3}{3}\\right]_0^{${b}}=\\frac{${b*b*b}}{3}=${ans}`
        };
      }

      // gen5: ∫[0,b] (x+k) dx = b²/2 + k·b → integer when b even
      function gen5() {
        const b   = 2 * (rInt(3) + 1);  // b in {2,4,6}
        const k   = rInt(4) + 1;        // k in {1,2,3,4}
        const ans = b * b / 2 + k * b;
        return {
          latex:  `\\int_0^{${b}} (x+${k})\\,dx`,
          answer: [String(ans)],
          hint:   `Integrate term by term. Which rule handles x? Which rule handles the constant ${k}?`,
          step:   `\\left[\\frac{x^2}{2}+${k}x\\right]_0^{${b}}=\\frac{${b*b}}{2}+${k*b}=${ans}`
        };
      }

      // gen6: FTC Part 1 — F(x)=∫[0,x] f(t) dt, find F'(c)
      function gen6() {
        const cases = [
          {fTex:'t^2',   c:3, ans:9,  stepTex:`F'(x)=x^2,\\quad F'(3)=9`},
          {fTex:'t^2',   c:4, ans:16, stepTex:`F'(x)=x^2,\\quad F'(4)=16`},
          {fTex:'2t',    c:5, ans:10, stepTex:`F'(x)=2x,\\quad F'(5)=10`},
          {fTex:'2t',    c:6, ans:12, stepTex:`F'(x)=2x,\\quad F'(6)=12`},
          {fTex:'t^2+1', c:3, ans:10, stepTex:`F'(x)=x^2+1,\\quad F'(3)=10`},
          {fTex:'t^2+1', c:4, ans:17, stepTex:`F'(x)=x^2+1,\\quad F'(4)=17`},
        ];
        const {fTex, c, ans, stepTex} = choose(cases);
        return {
          latex:  `\\text{If }F(x)=\\int_0^x ${fTex}\\,dt,\\text{ find }F'(${c}).`,
          answer: [String(ans)],
          hint:   `FTC Part 1 applies here. What does differentiating this integral give you — and at what value do you evaluate it?`,
          step:   stepTex
        };
      }

      // gen7: FTC Part 1 with chain rule — F(x)=∫[0,g(x)] f(t) dt, find F'(c)
      function gen7() {
        const cases = [
          {gTex:'x^2', fTex:'t', c:2, ans:16, stepTex:`F'(x)=x^2\\cdot 2x=2x^3,\\quad F'(2)=16`},
          {gTex:'x^2', fTex:'t', c:1, ans:2,  stepTex:`F'(x)=x^2\\cdot 2x=2x^3,\\quad F'(1)=2`},
          {gTex:'2x',  fTex:'t', c:3, ans:12, stepTex:`F'(x)=(2x)\\cdot 2=4x,\\quad F'(3)=12`},
          {gTex:'2x',  fTex:'t', c:4, ans:16, stepTex:`F'(x)=(2x)\\cdot 2=4x,\\quad F'(4)=16`},
          {gTex:'x^2', fTex:'3', c:2, ans:12, stepTex:`F'(x)=3\\cdot 2x=6x,\\quad F'(2)=12`},
          {gTex:'x^2', fTex:'3', c:3, ans:18, stepTex:`F'(x)=3\\cdot 2x=6x,\\quad F'(3)=18`},
        ];
        const {gTex, fTex, c, ans, stepTex} = choose(cases);
        return {
          latex:  `\\text{If }F(x)=\\int_0^{${gTex}} ${fTex}\\,dt,\\text{ find }F'(${c}).`,
          answer: [String(ans)],
          hint:   `The upper limit is g(x), not plain x — so the chain rule form applies. What is g(x) here?`,
          step:   stepTex
        };
      }

      // gen8: ∫[a,b] (2x+k) dx = [x²+kx] from a to b → integer
      function gen8() {
        const cases = [
          {a:1, b:3, k:2, ans:12},
          {a:1, b:3, k:4, ans:16},
          {a:2, b:4, k:1, ans:14},
          {a:2, b:4, k:3, ans:18},
          {a:1, b:4, k:2, ans:21},
          {a:0, b:3, k:2, ans:15},
        ];
        const {a, b, k, ans} = choose(cases);
        return {
          latex:  `\\int_{${a}}^{${b}} (2x+${k})\\,dx`,
          answer: [String(ans)],
          hint:   `Integrate term by term — two terms. Then apply F(b)−F(a) at the given limits.`,
          step:   `\\left[x^2+${k}x\\right]_{${a}}^{${b}}=(${b*b}+${k*b})-(${a*a}+${k*a})=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_5: Antiderivatives
  CALC1_SPIRAL["Calc_4_5"] = {
    title: "Antiderivatives",
    index: 27,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: Find C — F'(x)=k (constant), F(a)=b → C=b-ka
      function gen1() {
        const k  = rInt(4) + 2;         // k in {2,3,4,5}
        const a  = rInt(3) + 1;         // a in {1,2,3}
        const ct = rInt(5) + 1;         // C in {1,2,3,4,5}
        const b  = k * a + ct;
        return {
          latex:  `\\text{Find }C\\text{ if }F'(x)=${k}\\text{ and }F(${a})=${b}.`,
          answer: [String(ct)],
          hint:   `Which antiderivative rule applies to a constant? Then substitute the given point to solve for C.`,
          step:   `F(x)=${k}x+C,\\quad ${k}(${a})+C=${b},\\quad C=${ct}`
        };
      }

      // gen2: Find C — F'(x)=2x, F(a)=b → C=b-a²
      function gen2() {
        const cases = [
          {a:1, b:4,  ans:3},
          {a:1, b:6,  ans:5},
          {a:2, b:7,  ans:3},
          {a:2, b:9,  ans:5},
          {a:3, b:11, ans:2},
          {a:3, b:14, ans:5},
        ];
        const {a, b, ans} = choose(cases);
        return {
          latex:  `\\text{Find }C\\text{ if }F'(x)=2x\\text{ and }F(${a})=${b}.`,
          answer: [String(ans)],
          hint:   `Power rule applies here. Once you have F(x)=\\ldots+C, what equation does F(${a})=${b} give you?`,
          step:   `F(x)=x^2+C,\\quad ${a*a}+C=${b},\\quad C=${ans}`
        };
      }

      // gen3: Find C — F'(x)=3x², F(a)=b → C=b-a³
      function gen3() {
        const cases = [
          {a:1, b:3,  ans:2},
          {a:1, b:5,  ans:4},
          {a:2, b:10, ans:2},
          {a:2, b:12, ans:4},
          {a:1, b:7,  ans:6},
          {a:2, b:9,  ans:1},
        ];
        const {a, b, ans} = choose(cases);
        return {
          latex:  `\\text{Find }C\\text{ if }F'(x)=3x^2\\text{ and }F(${a})=${b}.`,
          answer: [String(ans)],
          hint:   `Power rule applies to 3x². Once you have F(x), what equation does F(${a})=${b} give you for C?`,
          step:   `F(x)=x^3+C,\\quad ${a*a*a}+C=${b},\\quad C=${ans}`
        };
      }

      // gen4: Find C — F'(x)=2x+k, F(a)=b → C=b-a²-ka
      function gen4() {
        const cases = [
          {a:1, k:2, b:6,  ans:3},
          {a:1, k:3, b:8,  ans:4},
          {a:2, k:1, b:8,  ans:2},
          {a:2, k:2, b:11, ans:3},
          {a:1, k:1, b:7,  ans:5},
          {a:2, k:3, b:11, ans:1},
        ];
        const {a, k, b, ans} = choose(cases);
        return {
          latex:  `\\text{Find }C\\text{ if }F'(x)=2x+${k}\\text{ and }F(${a})=${b}.`,
          answer: [String(ans)],
          hint:   `Antiderivate term by term. Then use F(${a})=${b} to set up an equation for C.`,
          step:   `F(x)=x^2+${k}x+C,\\quad ${a*a}+${k*a}+C=${b},\\quad C=${ans}`
        };
      }

      // gen5: Find F(c) — F'(x)=k, F(0)=d → F(c)=kc+d
      function gen5() {
        const k   = rInt(4) + 2;    // k in {2,3,4,5}
        const d   = rInt(5) + 1;    // C=d in {1,2,3,4,5}
        const c   = rInt(3) + 2;    // c in {2,3,4}
        const ans = k * c + d;
        return {
          latex:  `\\text{Find }F(${c})\\text{ if }F'(x)=${k}\\text{ and }F(0)=${d}.`,
          answer: [String(ans)],
          hint:   `What is the antiderivative of ${k}? Use F(0)=${d} to determine C, then evaluate at x=${c}.`,
          step:   `C=${d},\\quad F(x)=${k}x+${d},\\quad F(${c})=${k*c}+${d}=${ans}`
        };
      }

      // gen6: Find F(c) — F'(x)=2x, F(0)=d → F(c)=c²+d
      function gen6() {
        const d   = rInt(5) + 1;    // C=d in {1,2,3,4,5}
        const c   = rInt(3) + 2;    // c in {2,3,4}
        const ans = c * c + d;
        return {
          latex:  `\\text{Find }F(${c})\\text{ if }F'(x)=2x\\text{ and }F(0)=${d}.`,
          answer: [String(ans)],
          hint:   `What is the antiderivative of 2x? Use F(0)=${d} to determine C, then evaluate at x=${c}.`,
          step:   `C=${d},\\quad F(x)=x^2+${d},\\quad F(${c})=${c*c}+${d}=${ans}`
        };
      }

      // gen7: Find F(c) — F'(x)=3x², F(0)=d → F(c)=c³+d
      function gen7() {
        const d   = rInt(5) + 1;    // C=d in {1,2,3,4,5}
        const c   = rInt(2) + 2;    // c in {2,3}
        const ans = c * c * c + d;
        return {
          latex:  `\\text{Find }F(${c})\\text{ if }F'(x)=3x^2\\text{ and }F(0)=${d}.`,
          answer: [String(ans)],
          hint:   `What is the antiderivative of 3x²? Use F(0)=${d} to determine C, then evaluate at x=${c}.`,
          step:   `C=${d},\\quad F(x)=x^3+${d},\\quad F(${c})=${c*c*c}+${d}=${ans}`
        };
      }

      // gen8: Find F(c) — F'(x)=2x+k, F(0)=d → F(c)=c²+kc+d
      function gen8() {
        const k   = rInt(3) + 1;    // k in {1,2,3}
        const d   = rInt(4) + 1;    // C=d in {1,2,3,4}
        const c   = rInt(2) + 2;    // c in {2,3}
        const ans = c * c + k * c + d;
        return {
          latex:  `\\text{Find }F(${c})\\text{ if }F'(x)=2x+${k}\\text{ and }F(0)=${d}.`,
          answer: [String(ans)],
          hint:   `Antiderivate each term. Use F(0)=${d} to determine C, then evaluate at x=${c}.`,
          step:   `C=${d},\\quad F(x)=x^2+${k}x+${d},\\quad F(${c})=${c*c}+${k*c}+${d}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_6: Displacement, Velocity, Acceleration
  CALC1_SPIRAL["Calc_4_6"] = {
    title: "Displacement, Velocity, Acceleration",
    index: 28,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: Constant velocity, find displacement → k*(b-a)
      function gen1() {
        const k  = rInt(4) + 3;    // k in {3,4,5,6}
        const a  = rInt(2);         // a in {0,1}
        const len = rInt(3) + 2;   // b-a in {2,3,4}
        const b  = a + len;
        const ans = k * len;
        return {
          latex:  `\\text{Find displacement }\\int_{${a}}^{${b}} ${k}\\,dt.`,
          answer: [String(ans)],
          hint:   `For a constant velocity, what shape is the region on a v-t graph? What is its area?`,
          step:   `\\left[${k}t\\right]_{${a}}^{${b}}=${k}(${b})-${k}(${a})=${ans}`
        };
      }

      // gen2: Displacement ∫[0,T] 2t dt = T²
      function gen2() {
        const T   = rInt(3) + 3;   // T in {3,4,5}
        const ans = T * T;
        return {
          latex:  `\\text{Find displacement }\\int_0^{${T}} 2t\\,dt.`,
          answer: [String(ans)],
          hint:   `Displacement = ∫v dt. Which power rule antiderivative applies to 2t?`,
          step:   `\\left[t^2\\right]_0^{${T}}=${ans}`
        };
      }

      // gen3: Displacement ∫[0,T] (2t+k) dt = T²+kT
      function gen3() {
        const k   = rInt(4) + 1;   // k in {1,2,3,4}
        const T   = rInt(2) + 2;   // T in {2,3}
        const ans = T * T + k * T;
        return {
          latex:  `\\text{Find displacement }\\int_0^{${T}} (2t+${k})\\,dt.`,
          answer: [String(ans)],
          hint:   `Power rule for integrals applies to each term. What does raising the exponent by 1 give you for 2t?`,
          step:   `\\left[t^2+${k}t\\right]_0^{${T}}=${T*T}+${k*T}=${ans}`
        };
      }

      // gen4: Find v(T) from a(t)=k and v(0)=v0
      function gen4() {
        const k  = rInt(3) + 2;   // k in {2,3,4}
        const v0 = rInt(4) + 1;   // v0 in {1,2,3,4}
        const T  = rInt(2) + 2;   // T in {2,3}
        const ans = k * T + v0;
        return {
          latex:  `\\text{Given }a(t)=${k}\\text{ and }v(0)=${v0},\\text{ find }v(${T}).`,
          answer: [String(ans)],
          hint:   `Velocity is the antiderivative of acceleration. Which integration rule applies to a constant?`,
          step:   `v(t)=${k}t+C,\\; C=${v0},\\quad v(${T})=${k*T}+${v0}=${ans}`
        };
      }

      // gen5: Find s(T) from a(t)=2, v(0)=v0, s(0)=s0
      function gen5() {
        const v0  = rInt(4) + 1;   // v0 in {1,2,3,4}
        const s0  = rInt(4) + 1;   // s0 in {1,2,3,4}
        const T   = rInt(2) + 2;   // T in {2,3}
        const ans = T * T + v0 * T + s0;
        return {
          latex:  `\\text{Given }a(t)=2,\\; v(0)=${v0},\\; s(0)=${s0},\\text{ find }s(${T}).`,
          answer: [String(ans)],
          hint:   `This takes two integration steps. Starting with a(t) = 2, which rule gives you v(t)?`,
          step:   `v(t)=2t+${v0},\\quad s(t)=t^2+${v0}t+${s0},\\quad s(${T})=${T*T}+${v0*T}+${s0}=${ans}`
        };
      }

      // gen6: Find v(c) from s(t) = t² + at
      function gen6() {
        const a   = rInt(4) + 1;   // a in {1,2,3,4}
        const c   = rInt(3) + 2;   // c in {2,3,4}
        const ans = 2 * c + a;
        return {
          latex:  `\\text{If }s(t)=t^2+${a}t,\\text{ find }v(${c}).`,
          answer: [String(ans)],
          hint:   `v(t)=s'(t). Which differentiation rule applies to this polynomial?`,
          step:   `v(t)=2t+${a},\\quad v(${c})=${2*c}+${a}=${ans}`
        };
      }

      // gen7: Find a(c) from s(t) = t³ + at²
      function gen7() {
        const a   = rInt(3) + 1;   // a in {1,2,3}
        const c   = rInt(2) + 1;   // c in {1,2}
        const ans = 6 * c + 2 * a;
        return {
          latex:  `\\text{If }s(t)=t^3+${a}t^2,\\text{ find }a(${c}).`,
          answer: [String(ans)],
          hint:   `Power rule for derivatives applies here. How many times must you differentiate s(t) to reach a(t)?`,
          step:   `v(t)=3t^2+${2*a}t,\\quad a(t)=6t+${2*a},\\quad a(${c})=${ans}`
        };
      }

      // gen8: Displacement ∫[0,T] (-2t+b) dt = -T²+bT (velocity changes sign)
      function gen8() {
        const cases = [
          {b:6,  T:3, ans:9},
          {b:4,  T:2, ans:4},
          {b:8,  T:3, ans:15},
          {b:6,  T:2, ans:8},
          {b:10, T:4, ans:24},
          {b:8,  T:4, ans:16},
        ];
        const {b, T, ans} = choose(cases);
        return {
          latex:  `\\text{Find displacement }\\int_0^{${T}} (-2t+${b})\\,dt.`,
          answer: [String(ans)],
          hint:   `Displacement = ∫v dt even when v changes sign. Set up the antiderivative and apply FTC at the endpoints.`,
          step:   `\\left[-t^2+${b}t\\right]_0^{${T}}=-${T*T}+${b*T}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // §Calc_4_7_1: FTC Part 1
  CALC1_SPIRAL["Calc_4_7_1"] = {
    title: "FTC Part 1",
    index: 29,
    generators: (function() {
      // ── Display helpers ───────────────────────────────────────────────────────────
      // Leading coefficient: 1→'', -1→'-', else the number as a string
      function fc(a) { if (a===1) return ''; if (a===-1) return '-'; return String(a); }
      // Subsequent term with sign: addT(-2,'x')→' - 2x', addT(3,'')→' + 3', addT(0,'x')→''
      function addT(n, v) {
        if (n===0) return '';
        const s = n>0?'+':'-', abs = Math.abs(n);
        if (abs===1 && v) return ' ' + s + ' ' + v;
        return ' ' + s + ' ' + abs + (v||'');
      }

      // ── Problem generators (section-specific, injected below) ─────────────────────

      // gen1: F(x)=∫[0,x] k dt = kx; find F(c)
      function gen1() {
        const k   = rInt(4) + 2;   // k in {2,3,4,5}
        const c   = rInt(3) + 2;   // c in {2,3,4}
        const ans = k * c;
        return {
          latex:  `\\text{If }F(x)=\\int_0^x ${k}\\,dt,\\text{ find }F(${c}).`,
          answer: [String(ans)],
          hint:   `F(c) = ∫[0,c] f(t) dt. Use FTC Part 2 — what is the antiderivative of ${k}?`,
          step:   `F(${c})=\\left[${k}t\\right]_0^{${c}}=${k}\\cdot${c}=${ans}`
        };
      }

      // gen2: F(x)=∫[0,x] 2t dt = x²; find F(c)
      function gen2() {
        const c   = rInt(4) + 2;   // c in {2,3,4,5}
        const ans = c * c;
        return {
          latex:  `\\text{If }F(x)=\\int_0^x 2t\\,dt,\\text{ find }F(${c}).`,
          answer: [String(ans)],
          hint:   `F(c) = ∫[0,c] 2t dt. Which power rule antiderivative applies to 2t?`,
          step:   `F(${c})=\\left[t^2\\right]_0^{${c}}=${ans}`
        };
      }

      // gen3: F(x)=∫[0,x] (2t+k) dt = x²+kx; find F(c)
      function gen3() {
        const k   = rInt(4) + 1;   // k in {1,2,3,4}
        const c   = rInt(3) + 2;   // c in {2,3,4}
        const ans = c * c + k * c;
        return {
          latex:  `\\text{If }F(x)=\\int_0^x (2t+${k})\\,dt,\\text{ find }F(${c}).`,
          answer: [String(ans)],
          hint:   `Power rule for integrals applies to each term. Which term — 2t or ${k} — gives you the less familiar antiderivative?`,
          step:   `F(${c})=\\left[t^2+${k}t\\right]_0^{${c}}=${c*c}+${k*c}=${ans}`
        };
      }

      // gen4: F(x)=∫[0,x] 3t² dt = x³; find F(c)
      function gen4() {
        const c   = rInt(3) + 2;   // c in {2,3,4}
        const ans = c * c * c;
        return {
          latex:  `\\text{If }F(x)=\\int_0^x 3t^2\\,dt,\\text{ find }F(${c}).`,
          answer: [String(ans)],
          hint:   `Power rule for integrals: raise the exponent by 1, divide by the new exponent. What exponent does 3t² have?`,
          step:   `F(${c})=\\left[t^3\\right]_0^{${c}}=${ans}`
        };
      }

      // gen5: FTC Part 1 — F(x)=∫[0,x] f(t) dt; find F'(c) = f(c)
      function gen5() {
        const cases = [
          {fTex:'t^2',   c:3, ans:9,  stepTex:`F'(3)=f(3)=3^2=9`},
          {fTex:'t^2',   c:4, ans:16, stepTex:`F'(4)=f(4)=4^2=16`},
          {fTex:'2t+1',  c:3, ans:7,  stepTex:`F'(3)=f(3)=2(3)+1=7`},
          {fTex:'2t+1',  c:4, ans:9,  stepTex:`F'(4)=f(4)=2(4)+1=9`},
          {fTex:'t^2+1', c:2, ans:5,  stepTex:`F'(2)=f(2)=4+1=5`},
          {fTex:'t^2+1', c:3, ans:10, stepTex:`F'(3)=f(3)=9+1=10`},
        ];
        const {fTex, c, ans, stepTex} = choose(cases);
        return {
          latex:  `\\text{If }F(x)=\\int_0^x ${fTex}\\,dt,\\text{ find }F'(${c}).`,
          answer: [String(ans)],
          hint:   `FTC Part 1 applies. What does differentiating this integral give you — and at what value do you evaluate it?`,
          step:   stepTex
        };
      }

      // gen6: Chain rule — F(x)=∫[0,x²] f(t) dt; find F'(c)
      function gen6() {
        const cases = [
          {fTex:'t', c:2, ans:16, stepTex:`F'(x)=x^2\\cdot 2x=2x^3,\\quad F'(2)=16`},
          {fTex:'t', c:1, ans:2,  stepTex:`F'(x)=x^2\\cdot 2x=2x^3,\\quad F'(1)=2`},
          {fTex:'2', c:3, ans:12, stepTex:`F'(x)=2\\cdot 2x=4x,\\quad F'(3)=12`},
          {fTex:'2', c:2, ans:8,  stepTex:`F'(x)=2\\cdot 2x=4x,\\quad F'(2)=8`},
          {fTex:'3', c:2, ans:12, stepTex:`F'(x)=3\\cdot 2x=6x,\\quad F'(2)=12`},
          {fTex:'3', c:3, ans:18, stepTex:`F'(x)=3\\cdot 2x=6x,\\quad F'(3)=18`},
        ];
        const {fTex, c, ans, stepTex} = choose(cases);
        return {
          latex:  `\\text{If }F(x)=\\int_0^{x^2} ${fTex}\\,dt,\\text{ find }F'(${c}).`,
          answer: [String(ans)],
          hint:   `The upper limit is x², not plain x — so the chain rule applies. What is g(x) here?`,
          step:   stepTex
        };
      }

      // gen7: Is F increasing or decreasing at x=c? — sign of f(c)
      function gen7() {
        const cases = [
          {fTex:'t-3', c:1, fcVal:-2, ans:'decreasing'},
          {fTex:'t-3', c:5, fcVal:2,  ans:'increasing'},
          {fTex:'2-t', c:1, fcVal:1,  ans:'increasing'},
          {fTex:'2-t', c:4, fcVal:-2, ans:'decreasing'},
          {fTex:'t-2', c:4, fcVal:2,  ans:'increasing'},
          {fTex:'t-2', c:1, fcVal:-1, ans:'decreasing'},
        ];
        const {fTex, c, fcVal, ans} = choose(cases);
        const dir = ans === 'increasing' ? '>' : '<';
        return {
          latex:  `\\text{Is }F(x)=\\int_0^x (${fTex})\\,dt\\text{ increasing or decreasing at }x=${c}?`,
          answer: [ans],
          hint:   `FTC Part 1 connects F's behavior to the sign of its integrand. At t = ${c}, is the integrand positive or negative?`,
          step:   `F'(${c})=f(${c})=${fcVal}${dir}0\\Rightarrow F\\text{ is ${ans} at }x=${c}`
        };
      }

      // gen8: F(x)=∫[k,x] 2t dt = x²-k²; find F(c)
      function gen8() {
        const cases = [
          {k:1, c:3, ans:8},
          {k:2, c:4, ans:12},
          {k:1, c:4, ans:15},
          {k:2, c:5, ans:21},
          {k:3, c:5, ans:16},
          {k:1, c:5, ans:24},
        ];
        const {k, c, ans} = choose(cases);
        return {
          latex:  `\\text{If }F(x)=\\int_{${k}}^x 2t\\,dt,\\text{ find }F(${c}).`,
          answer: [String(ans)],
          hint:   `Power rule for integrals applies here. What changes when the lower limit is ${k} instead of 0?`,
          step:   `F(${c})=\\left[t^2\\right]_{${k}}^{${c}}=${c*c}-${k*k}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

})(window);