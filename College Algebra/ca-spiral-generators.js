// AUTO-GENERATED — collegeAlgebra spiral-review generator bundle
(function(global) {

  // ── Shared RNG + array helpers ─────────────────────────────────
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

  function norm(s) { return String(s).replace(/−/g,'-').replace(/\s+/g,'').toLowerCase(); }

  global.CA_SPIRAL = {};

  // CA_1_1: Solving Equations
  CA_SPIRAL["CA_1_1"] = {
    title: "Solving Equations",
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

      // gen1: One-step — x + a = b  →  x = b - a
      function gen1() {
        const a   = rInt(6) + 1;           // a in {1..6}
        const k   = rInt(5) + 1;           // answer x = k in {1..5}
        const b   = a + k;
        return {
          latex:  `x + ${a} = ${b}`,
          answer: [String(k)],
          hint:   `Which operation undoes addition?`,
          step:   `x = ${b} - ${a} = ${k}`
        };
      }

      // gen2: Two-step — ax + b = c  →  x = k
      function gen2() {
        const a   = rInt(3) + 2;           // a in {2,3,4}
        const b   = rInt(4) + 1;           // b in {1..4}
        const k   = rInt(4) + 1;           // answer in {1..4}
        const c   = a * k + b;
        return {
          latex:  `${a}x + ${b} = ${c}`,
          answer: [String(k)],
          hint:   `Two steps needed — which constant do you undo first?`,
          step:   `${a}x = ${c - b},\\quad x = ${k}`
        };
      }

      // gen3: Variables on both sides — ax + b = cx + d  →  x = k
      function gen3() {
        const a   = rInt(3) + 3;           // a in {3,4,5}
        const c   = rInt(2) + 1;           // c in {1,2}  (a > c always)
        const b   = rInt(4) + 1;           // b in {1..4}
        const k   = rInt(4) + 1;           // answer in {1..4}
        const d   = (a - c) * k + b;
        return {
          latex:  `${a}x + ${b} = ${c}x + ${d}`,
          answer: [String(k)],
          hint:   `Collect all x-terms on one side. What do you subtract from both sides first?`,
          step:   `${a - c}x = ${d - b},\\quad x = ${k}`
        };
      }

      // gen4: Distribution — a(bx + c) = d  →  x = k
      function gen4() {
        const a   = rInt(2) + 2;           // a in {2,3}
        const b   = rInt(2) + 1;           // b in {1,2}
        const c   = rInt(3) + 1;           // c in {1..3}
        const k   = rInt(3) + 1;           // answer in {1..3}
        const d   = a * (b * k + c);
        return {
          latex:  `${a}(${b === 1 ? '' : b}x + ${c}) = ${d}`,
          answer: [String(k)],
          hint:   `Distributive property first — what does ${a}(${b === 1 ? '' : b}x + ${c}) expand to?`,
          step:   `${a * b}x + ${a * c} = ${d},\\quad ${a * b}x = ${d - a * c},\\quad x = ${k}`
        };
      }

      // gen5: Distribution + combine — a(x + b) + cx = d  →  x = k
      function gen5() {
        const a   = rInt(2) + 2;           // a in {2,3}
        const c   = rInt(2) + 1;           // c in {1,2}
        const b   = rInt(3) + 1;           // b in {1..3}
        const k   = rInt(3) + 1;           // answer in {1..3}
        const d   = (a + c) * k + a * b;
        return {
          latex:  `${a}(x + ${b}) + ${c}x = ${d}`,
          answer: [String(k)],
          hint:   `Distribute first, then combine like terms. How many x-terms do you have after distributing?`,
          step:   `${a}x + ${a * b} + ${c}x = ${d},\\quad ${a + c}x = ${d - a * b},\\quad x = ${k}`
        };
      }

      // gen6: Division — x/a + b = c  →  x = a*(c - b)
      function gen6() {
        const a   = rInt(3) + 2;           // a in {2,3,4}
        const b   = rInt(3) + 1;           // b in {1..3}
        const k   = rInt(4) + 1;           // c - b = k in {1..4}
        const c   = b + k;
        const ans = a * k;
        return {
          latex:  `\\dfrac{x}{${a}} + ${b} = ${c}`,
          answer: [String(ans)],
          hint:   `Which operation undoes division by ${a}? Apply it to both sides once you've isolated x/${a}.`,
          step:   `\\dfrac{x}{${a}} = ${k},\\quad x = ${ans}`
        };
      }

      // gen7: Number of solutions — text answer
      function gen7() {
        const cases = [
          {latex: `2x + 3 = 9`,             ans: 'one',      step: `2x=6,\\;x=3`},
          {latex: `4x - 5 = 2x + 3`,        ans: 'one',      step: `2x=8,\\;x=4`},
          {latex: `3x + 6 = 3(x + 2)`,      ans: 'infinite', step: `6=6\\;(\\text{always true})`},
          {latex: `2(x + 1) = 2x + 4`,      ans: 'none',     step: `2x+2=2x+4\\Rightarrow 2=4\\;(\\text{false})`},
          {latex: `5x - 7 = 5x + 2`,        ans: 'none',     step: `-7=2\\;(\\text{false})`},
          {latex: `3x + 1 = 3x - 4`,        ans: 'none',     step: `1=-4\\;(\\text{false})`},
          {latex: `4(x + 2) = 4x + 8`,      ans: 'infinite', step: `8=8\\;(\\text{always true})`},
          {latex: `6x + 2 = 3x + 14`,       ans: 'one',      step: `3x=12,\\;x=4`},
        ];
        // fix: case index 1 (2x+1=2x+4) is actually no solution — corrected above
        const {latex, ans, step} = choose(cases);
        return {
          latex:  `\\text{One solution, no solution, or infinite solutions?}\\\\${latex}`,
          answer: [ans],
          hint:   `Simplify both sides fully. What happens to the variable?`,
          step:   step
        };
      }

      // gen8: Multi-step — a(x + b) - cx = d  →  x = k
      function gen8() {
        const a   = rInt(3) + 3;           // a in {3,4,5}
        const c   = rInt(2) + 1;           // c in {1,2}  (a > c so coefficient stays positive)
        const b   = rInt(3) + 1;           // b in {1..3}
        const k   = rInt(3) + 1;           // answer in {1..3}
        const d   = (a - c) * k + a * b;
        return {
          latex:  `${a}(x + ${b}) - ${c}x = ${d}`,
          answer: [String(k)],
          hint:   `Distribute, then combine like terms before isolating x. What is the coefficient of x after combining?`,
          step:   `${a}x + ${a * b} - ${c}x = ${d},\\quad ${a - c}x = ${d - a * b},\\quad x = ${k}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_1_2: Solutions of Linear Equations
  CA_SPIRAL["CA_1_2"] = {
    title: "Solutions of Linear Equations",
    index: 1,
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

      // gen1: Evaluate f(x) = ax + b at x = c
      function gen1() {
        const a   = rInt(4) + 2;       // a in {2,3,4,5}
        const b   = rInt(6) + 1;       // b in {1..6}
        const c   = rInt(4) + 1;       // c in {1..4}
        const ans = a * c + b;
        return {
          latex:  `f(x) = ${a}x + ${b}.\\quad\\text{Find }f(${c}).`,
          answer: [String(ans)],
          hint:   `Substitute x = ${c} into the formula and simplify.`,
          step:   `f(${c}) = ${a}(${c}) + ${b} = ${a*c} + ${b} = ${ans}`
        };
      }

      // gen2: Evaluate f(x) = ax - b at x = c  (output always positive)
      function gen2() {
        const a   = rInt(3) + 3;       // a in {3,4,5}
        const c   = rInt(3) + 2;       // c in {2,3,4}
        const b   = rInt(a * c - 1) + 1;  // b < a*c so answer > 0
        const ans = a * c - b;
        return {
          latex:  `f(x) = ${a}x - ${b}.\\quad\\text{Find }f(${c}).`,
          answer: [String(ans)],
          hint:   `Substitute x = ${c} and be careful with the subtraction.`,
          step:   `f(${c}) = ${a}(${c}) - ${b} = ${a*c} - ${b} = ${ans}`
        };
      }

      // gen3: Is (p, q) a solution to y = ax + b? — yes or no
      function gen3() {
        const a   = rInt(3) + 2;       // a in {2,3,4}
        const b   = rInt(5) + 1;       // b in {1..5}
        const p   = rInt(4) + 1;       // x-coord in {1..4}
        const trueY = a * p + b;
        // 50-50 give correct or offset by 1
        const isYes = (rInt(2) === 0);
        const q   = isYes ? trueY : trueY + 1;
        const ans = isYes ? 'yes' : 'no';
        const check = `${a}(${p}) + ${b} = ${trueY}`;
        return {
          latex:  `\\text{Is }(${p},\\,${q})\\text{ a solution to }y = ${a}x + ${b}\\text{?}`,
          answer: [ans],
          hint:   `Substitute x = ${p} into the right side. Does the result equal ${q}?`,
          step:   isYes
            ? `${check} = ${q}\\;✓\\quad\\text{Yes}`
            : `${check} \\neq ${q}\\quad\\text{No}`
        };
      }

      // gen4: Find the missing y in ordered pair (c, __) for y = ax + b
      function gen4() {
        const a   = rInt(3) + 2;       // a in {2,3,4}
        const b   = rInt(5) + 1;       // b in {1..5}
        const c   = rInt(4) + 1;       // c in {1..4}
        const ans = a * c + b;
        return {
          latex:  `y = ${a}x + ${b}.\\quad\\text{Complete the pair }(${c},\\;\\square).`,
          answer: [String(ans)],
          hint:   `Substitute x = ${c} into the equation to find y.`,
          step:   `y = ${a}(${c}) + ${b} = ${ans}`
        };
      }

      // gen5: Find x given f(x) = k, where f(x) = ax + b
      function gen5() {
        const a   = rInt(3) + 2;       // a in {2,3,4}
        const b   = rInt(5) + 1;       // b in {1..5}
        const k   = rInt(4) + 1;       // answer x = k in {1..4}
        const y   = a * k + b;
        return {
          latex:  `f(x) = ${a}x + ${b}.\\quad\\text{Find }x\\text{ when }f(x) = ${y}.`,
          answer: [String(k)],
          hint:   `Set ${a}x + ${b} = ${y} and solve for x.`,
          step:   `${a}x = ${y - b},\\quad x = ${k}`
        };
      }

      // gen6: Find missing x in ordered pair (__, q) for y = ax + b
      function gen6() {
        const a   = rInt(3) + 2;       // a in {2,3,4}
        const b   = rInt(4) + 1;       // b in {1..4}
        const k   = rInt(4) + 1;       // answer x = k in {1..4}
        const q   = a * k + b;
        return {
          latex:  `y = ${a}x + ${b}.\\quad\\text{Complete the pair }(\\square,\\;${q}).`,
          answer: [String(k)],
          hint:   `Set ${a}x + ${b} = ${q} and solve for x.`,
          step:   `${a}x = ${q - b},\\quad x = ${k}`
        };
      }

      // gen7: Intersection — find x where f(x) = g(x)
      function gen7() {
        const a   = rInt(3) + 3;       // a in {3,4,5}
        const c   = rInt(2) + 1;       // c in {1,2}  (a > c)
        const b   = rInt(4) + 1;       // b in {1..4}
        const k   = rInt(3) + 1;       // answer x = k in {1..3}
        const d   = (a - c) * k + b;
        return {
          latex:  `f(x)=${a}x+${b},\\quad g(x)=${c}x+${d}.\\quad\\text{Find }x\\text{ where }f(x)=g(x).`,
          answer: [String(k)],
          hint:   `Set the two expressions equal and solve. What do you get when you collect x-terms?`,
          step:   `${a}x+${b}=${c}x+${d}\\Rightarrow ${a-c}x=${d-b}\\Rightarrow x=${k}`
        };
      }

      // gen8: Find intersection y-value given f(x) = ax + b, g(x) = cx + d
      function gen8() {
        const a   = rInt(3) + 3;       // a in {3,4,5}
        const c   = rInt(2) + 1;       // c in {1,2}
        const b   = rInt(4) + 1;       // b in {1..4}
        const k   = rInt(3) + 1;       // intersection x = k
        const d   = (a - c) * k + b;
        const yVal = a * k + b;
        return {
          latex:  `f(x)=${a}x+${b},\\quad g(x)=${c}x+${d}.\\quad\\text{Find the }y\\text{-value at intersection.}`,
          answer: [String(yVal)],
          hint:   `Find the x-value where f = g first, then substitute it back into either equation.`,
          step:   `x=${k},\\quad y=${a}(${k})+${b}=${yVal}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_1_3: Interval Notation and Inequalities
  CA_SPIRAL["CA_1_3"] = {
    title: "Interval Notation and Inequalities",
    index: 2,
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

      // gen1: ax + b < c or ≤  →  interval (-inf,k) or (-inf,k]
      function gen1() {
        const a  = rInt(3) + 2;          // {2,3,4}
        const k  = rInt(4) + 2;          // boundary in {2..5}
        const b  = rInt(5) + 1;          // positive shift
        const c  = a * k + b;            // ax+b sym c → ax sym ak → x sym k
        const sym = rInt(2) === 0 ? '<' : '\\leq';
        const rb  = sym === '\\leq' ? ']' : ')';
        return {
          latex:  `${a}x + ${b} ${sym} ${c}`,
          answer: [`(-inf,${k}${rb}`],
          interval: true,
          hint:   'Which bracket type pairs with a strict inequality at the boundary?',
          step:   `${a}x${sym}${c-b},\\quad x${sym}${k}\\quad\\to\\quad(-\\infty,${k}${rb}`
        };
      }

      // gen2: ax + b > c or ≥  →  interval (k,inf) or [k,inf)
      function gen2() {
        const a  = rInt(3) + 2;
        const k  = rInt(4) + 1;          // boundary in {1..4}
        const b  = rInt(5) + 1;
        const c  = a * k + b;            // ax+b sym c → x sym k  (b cancels cleanly)
        const sym = rInt(2) === 0 ? '>' : '\\geq';
        const lb  = sym === '\\geq' ? '[' : '(';
        return {
          latex:  `${a}x + ${b} ${sym} ${c}`,
          answer: [`${lb}${k},inf)`],
          interval: true,
          hint:   'When x must exceed a boundary, which direction does the interval extend toward infinity?',
          step:   `${a}x${sym}${c-b},\\quad x${sym}${k}\\quad\\to\\quad${lb}${k},\\infty)`
        };
      }

      // gen3: Variables on both sides — ax + b sym cx + d  →  x sym k
      function gen3() {
        const a   = rInt(3) + 3;         // {3,4,5}
        const c   = rInt(2) + 1;         // {1,2}, c < a
        const k   = rInt(4) + 1;         // boundary
        const b   = rInt(4) + 1;
        const d   = (a - c) * k + b;     // (a-c)x sym d-b → x sym k
        const sym = rInt(2) === 0 ? '<' : '\\leq';
        const rb  = sym === '\\leq' ? ']' : ')';
        return {
          latex:  `${a}x + ${b} ${sym} ${c}x + ${d}`,
          answer: [`(-inf,${k}${rb}`],
          interval: true,
          hint:   'After combining x-terms on one side, which boundary value results?',
          step:   `${a-c}x${sym}${d-b},\\quad x${sym}${k}\\quad\\to\\quad(-\\infty,${k}${rb}`
        };
      }

      // gen4: Flip the sign — -ax + b > c  →  x < k  (or ≥ → ≤)
      function gen4() {
        const a   = rInt(3) + 2;         // {2,3,4}
        const k   = rInt(3) + 1;         // boundary in {1..3}
        const c   = rInt(4) + 1;
        const b   = a * k + c;           // -ax+b>c → -ax>c-b=-ak → x<k  (after flip)
        const sym = rInt(2) === 0 ? '>' : '\\geq';
        const flip = sym === '>' ? '<' : '\\leq';
        const rb   = sym === '\\geq' ? ']' : ')';
        return {
          latex:  `-${a}x + ${b} ${sym} ${c}`,
          answer: [`(-inf,${k}${rb}`],
          interval: true,
          hint:   'What rule governs the direction of an inequality when dividing by a negative?',
          step:   `-${a}x${sym}${c-b},\\quad x${flip}${k}\\quad\\text{(sign flipped)}\\quad\\to\\quad(-\\infty,${k}${rb}`
        };
      }

      // gen5: Compound strict — lo < bx + c < hi  →  (kL, kR)
      function gen5() {
        const b   = rInt(3) + 2;         // coefficient {2,3,4}
        const c   = rInt(4) + 1;
        const kL  = rInt(3) + 1;
        const kR  = kL + rInt(3) + 2;    // kR > kL
        const lo  = b * kL + c;
        const hi  = b * kR + c;
        return {
          latex:  `${lo} < ${b}x + ${c} < ${hi}`,
          answer: [`(${kL},${kR})`],
          interval: true,
          hint:   'After operating on all three parts equally, what are the two boundary values?',
          step:   `${lo-c}<${b}x<${hi-c},\\quad ${kL}<x<${kR}\\quad\\to\\quad(${kL},${kR})`
        };
      }

      // gen6: Compound inclusive — lo ≤ bx + c ≤ hi  →  [kL, kR]
      function gen6() {
        const b   = rInt(3) + 2;
        const c   = rInt(4) + 1;
        const kL  = rInt(2) + 1;
        const kR  = kL + rInt(3) + 2;
        const lo  = b * kL + c;
        const hi  = b * kR + c;
        return {
          latex:  `${lo} \\leq ${b}x + ${c} \\leq ${hi}`,
          answer: [`[${kL},${kR}]`],
          interval: true,
          hint:   'When both inequality signs include equality, which bracket type appears at both ends?',
          step:   `${lo-c}\\leq${b}x\\leq${hi-c},\\quad ${kL}\\leq x\\leq${kR}\\quad\\to\\quad[${kL},${kR}]`
        };
      }

      // gen7: Is a specific value in the solution set? (yes/no)
      function gen7() {
        const a   = rInt(3) + 2;
        const k   = rInt(4) + 2;
        const b   = rInt(4) + 1;
        const c   = a * k + b;
        const testIn  = rInt(2) === 0;
        const testVal = testIn ? k - 1 : k + 1;
        const ans = testIn ? 'yes' : 'no';
        return {
          latex:  `\\text{Is }x=${testVal}\\text{ in the solution set of }${a}x + ${b} < ${c}?`,
          answer: [ans],
          hint:   'Does the test value keep the inequality true when you check it?',
          step:   `${a}(${testVal})+${b}=${a*testVal+b}\\;${a*testVal+b < c ? '<' : '\\not<'}\\;${c}\\quad\\text{→ ${ans}}`
        };
      }

      // gen8: -ax + b sym cx + d  →  x < k (flip required)
      function gen8() {
        const a   = rInt(2) + 2;         // {2,3}
        const c   = rInt(2) + 1;         // {1,2}
        const k   = rInt(3) + 1;
        const b   = rInt(4) + 3;         // b in {3..6}
        const d   = -(a + c) * k + b;    // boundary = k: b-d = (a+c)*k
        const bMinusD = (a + c) * k;
        const dTeX = d < 0 ? `- ${Math.abs(d)}` : `+ ${d}`;
        const sym  = rInt(2) === 0 ? '>' : '\\geq';
        const flip = sym === '>' ? '<' : '\\leq';
        const rb   = sym === '\\geq' ? ']' : ')';
        return {
          latex:  `-${a}x + ${b} ${sym} ${c}x ${dTeX}`,
          answer: [`(-inf,${k}${rb}`],
          hint:   'After combining x-terms, which rule changes the inequality direction?',
          step:   `${bMinusD}${sym}${a+c}x,\\quad x${flip}${k}\\quad\\text{(flipped)}\\quad\\to\\quad(-\\infty,${k}${rb}`,
          interval: true
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_1_4: Compound Inequalities
  CA_SPIRAL["CA_1_4"] = {
    title: "Compound Inequalities",
    index: 3,
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

      // gen1: AND (separate, strict) — ax < b AND cx > d  →  full interval (kL,kR)
      function gen1() {
        const a  = rInt(3) + 2;        // a in {2,3,4}
        const kR = rInt(3) + 3;        // right boundary in {3..5}
        const kL = rInt(kR - 1) + 1;  // left boundary < right
        const b  = a * kR;             // ax < b  →  x < kR
        const c  = rInt(3) + 2;        // c in {2,3,4}
        const d  = c * kL;             // cx > d  →  x > kL
        return {
          latex:  `${a}x < ${b}\\text{ AND }${c}x > ${d}`,
          answer: [`(${kL},${kR})`],
          interval: true,
          hint:   `In an AND compound inequality, is the solution the intersection or the union of the two separate intervals?`,
          step:   `x<${kR}\\text{ AND }x>${kL}\\Rightarrow(${kL},\\,${kR})`
        };
      }

      // gen2: AND (separate, non-strict) — ax ≤ b AND cx ≥ d  →  full interval [kL,kR]
      function gen2() {
        const a  = rInt(3) + 2;
        const kR = rInt(3) + 3;
        const kL = rInt(kR - 1) + 1;
        const b  = a * kR;             // ax ≤ b  →  x ≤ kR
        const c  = rInt(3) + 2;
        const d  = c * kL;             // cx ≥ d  →  x ≥ kL
        return {
          latex:  `${a}x \\leq ${b}\\text{ AND }${c}x \\geq ${d}`,
          answer: [`[${kL},${kR}]`],
          interval: true,
          hint:   `When both inequalities are non-strict (≤ and ≥), are the boundary points included or excluded?`,
          step:   `x\\leq${kR}\\text{ AND }x\\geq${kL}\\Rightarrow[${kL},\\,${kR}]`
        };
      }

      // gen3: Three-part AND (strict) — lo < ax + b < hi  →  full interval (kL,kR)
      function gen3() {
        const a  = rInt(3) + 2;        // a in {2,3,4}
        const b  = rInt(4) + 1;        // shift in {1..4}
        const kL = rInt(3) + 1;        // left boundary in {1..3}
        const kR = kL + rInt(3) + 2;  // right boundary
        const lo = a * kL + b;
        const hi = a * kR + b;
        return {
          latex:  `${lo} < ${a}x + ${b} < ${hi}`,
          answer: [`(${kL},${kR})`],
          interval: true,
          hint:   `In a three-part inequality, what operation on all three parts releases the middle term?`,
          step:   `${lo-b}<${a}x<${hi-b}\\Rightarrow ${kL}<x<${kR}\\Rightarrow(${kL},\\,${kR})`
        };
      }

      // gen4: Three-part AND with flip — lo < -ax + b < hi  →  full interval (kL,kR)
      // Solution: kL < x < kR — flip both signs when dividing by -a
      function gen4() {
        const a  = rInt(2) + 2;        // a in {2,3}
        const kL = rInt(2) + 1;        // left boundary in {1,2}
        const kR = kL + rInt(2) + 2;  // right boundary
        const b  = a * kR + rInt(3) + 1;  // b > a*kR so lo, hi are positive
        const lo = b - a * kR;         // lo = b - a*kR
        const hi = b - a * kL;         // hi = b - a*kL
        return {
          latex:  `${lo} < -${a}x + ${b} < ${hi}`,
          answer: [`(${kL},${kR})`],
          interval: true,
          hint:   `When dividing all three parts by a negative number, what happens to both inequality signs?`,
          step:   `${lo-b}<-${a}x<${hi-b}\\Rightarrow ${kR}>x>${kL}\\Rightarrow(${kL},\\,${kR})`
        };
      }

      // gen5: OR (strict) — x < kL OR x > kR  →  full union (-inf,kL)u(kR,inf)
      function gen5() {
        const a  = rInt(3) + 2;
        const b  = rInt(4) + 1;
        const kL = rInt(3) + 2;        // left cut in {2..4}
        const kR = kL + rInt(3) + 2;  // right cut
        const cL = a * kL + b;         // ax + b < cL  →  x < kL
        const cR = a * kR + b;         // ax + b > cR  →  x > kR
        return {
          latex:  `${a}x + ${b} < ${cL}\\text{ OR }${a}x + ${b} > ${cR}`,
          answer: [`(-inf,${kL})u(${kR},inf)`],
          interval: true,
          hint:   `An OR inequality joins two separate pieces — does this solution have a gap between them?`,
          step:   `x<${kL}\\text{ OR }x>${kR}\\Rightarrow(-\\infty,${kL})\\cup(${kR},\\infty)`
        };
      }

      // gen6: OR (non-strict) — x ≤ kL OR x ≥ kR  →  full union (-inf,kL]u[kR,inf)
      function gen6() {
        const a  = rInt(3) + 2;
        const b  = rInt(4) + 1;
        const kL = rInt(3) + 2;
        const kR = kL + rInt(3) + 2;
        const cL = a * kL + b;
        const cR = a * kR + b;
        return {
          latex:  `${a}x + ${b} \\leq ${cL}\\text{ OR }${a}x + ${b} \\geq ${cR}`,
          answer: [`(-inf,${kL}]u[${kR},inf)`],
          interval: true,
          hint:   `When the inequalities are ≤ and ≥, are the boundary points part of the solution?`,
          step:   `x\\leq${kL}\\text{ OR }x\\geq${kR}\\Rightarrow(-\\infty,${kL}]\\cup[${kR},\\infty)`
        };
      }

      // gen7: AND three-part — is x = testVal in solution? (yes/no)
      function gen7() {
        const a  = rInt(3) + 2;
        const b  = rInt(4) + 1;
        const kL = rInt(3) + 1;
        const kR = kL + rInt(3) + 2;
        const lo = a * kL + b;
        const hi = a * kR + b;
        // test value: strictly inside (yes) or on boundary or outside (no)
        const cases = [
          {val: kL + 1, ans: 'yes'},   // strictly inside
          {val: kR - 1, ans: 'yes'},   // strictly inside
          {val: kL,     ans: 'no'},    // on strict boundary
          {val: kR,     ans: 'no'},    // on strict boundary
          {val: kL - 1, ans: 'no'},    // outside left
          {val: kR + 1, ans: 'no'},    // outside right
        ].filter(c => c.val > 0);
        const {val, ans} = choose(cases);
        const midVal = a * val + b;
        const inSol = midVal > lo && midVal < hi;
        return {
          latex:  `\\text{Is }x=${val}\\text{ in the solution of }${lo}<${a}x+${b}<${hi}\\text{?}`,
          answer: [ans],
          hint:   `In a strict three-part inequality, what condition must the middle expression satisfy for x to be in the solution?`,
          step:   `${a}(${val})+${b}=${midVal}\\quad${lo}<${midVal}<${hi}\\text{ is }${inSol ? '\\text{TRUE}' : '\\text{FALSE}'}\\quad\\text{→ ${ans}}`
        };
      }

      // gen8: OR — is x = testVal in solution of x < kL OR x > kR? (yes/no)
      function gen8() {
        const a  = rInt(3) + 2;
        const b  = rInt(4) + 1;
        const kL = rInt(3) + 2;
        const kR = kL + rInt(3) + 3;  // wider gap
        const cL = a * kL + b;
        const cR = a * kR + b;
        // test values: outside left (yes), outside right (yes), in the gap (no)
        const cases = [
          {val: kL - 1, ans: 'yes'},   // left of kL → in solution
          {val: kR + 1, ans: 'yes'},   // right of kR → in solution
          {val: kL + 1, ans: 'no'},    // in the gap
          {val: kR - 1, ans: 'no'},    // in the gap
        ].filter(c => c.val > 0);
        const {val, ans} = choose(cases);
        const testExpr = a * val + b;
        return {
          latex:  `\\text{Is }x=${val}\\text{ in the solution of }${a}x+${b}<${cL}\\text{ OR }${a}x+${b}>${cR}\\text{?}`,
          answer: [ans],
          hint:   `For an OR inequality, does a value inside the gap between the two cutoffs belong to the solution?`,
          step:   `${a}(${val})+${b}=${testExpr}:\\quad${testExpr}<${cL}\\text{ is }${testExpr<cL}\\text{; }${testExpr}>${cR}\\text{ is }${testExpr>cR}\\quad\\text{→ ${ans}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_1_5: Applications of Linear Equations
  CA_SPIRAL["CA_1_5"] = {
    title: "Applications of Linear Equations",
    index: 4,
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

      // ── Context pools ────────────────────────────────────────────────────────────
      const TICKET_EVENTS  = ['concert','escape room','comedy show','laser tag session','pottery class'];
      const TICKET_ITEMS   = ['ticket','ticket','pass','ticket','session'];
      const SNACK_ITEMS    = ['boba tea','breakfast burrito','smoothie','slice of pizza','pretzel'];
      const SAVINGS_GOALS  = [
        {item:'a new gaming console', price:200},
        {item:'a concert ticket',     price:120},
        {item:'new shoes',            price:150},
        {item:'a road trip fund',     price:250},
        {item:'a new textbook',       price:100},
      ];
      const CLOTHING       = ['hoodie','graphic tee','cap','jacket','pair of socks'];
      const PLAN_A_NAMES   = ['Gym A','Plan A','Service A','Streaming A','App A'];
      const MONTHS         = ['months','months','months','months'];

      // gen1: Flat fee + per-unit → ax + b = c
      function gen1() {
        const event  = choose(TICKET_EVENTS);
        const item   = TICKET_ITEMS[TICKET_EVENTS.indexOf(event)];
        const a      = rInt(5) + 6;     // price per ticket {6..10}
        const b      = rInt(4) + 3;     // service fee {3..6}
        const k      = rInt(4) + 2;     // answer: # tickets {2..5}
        const c      = a * k + b;
        return {
          text:   `${event.charAt(0).toUpperCase()+event.slice(1)} ${item}s cost $${a} each plus a $${b} order fee. You paid $${c}. How many ${item}s?`,
          answer: [String(k)],
          hint:   `In a flat-fee-plus-per-unit situation, which part of the total cost changes with the quantity?`,
          step:   `${a}x+${b}=${c}\\Rightarrow ${a}x=${c-b}\\Rightarrow x=${k}\\text{ ${item}s}`
        };
      }

      // gen2: Snack + flat fee → ax + b = c  (different context from gen1)
      function gen2() {
        const snack  = choose(SNACK_ITEMS);
        const a      = rInt(4) + 4;     // price per item {4..7}
        const b      = rInt(3) + 2;     // app/delivery fee {2..4}
        const k      = rInt(4) + 2;     // answer {2..5}
        const c      = a * k + b;
        return {
          text:   `Each ${snack} costs $${a}. There's a $${b} delivery fee. You spent $${c}. How many ${snack}s?`,
          answer: [String(k)],
          hint:   `In a cost equation with a per-item rate and a flat fee, which component contains the variable x?`,
          step:   `${a}x+${b}=${c}\\Rightarrow x=${k}\\text{ ${snack}s}`
        };
      }

      // gen3: Consecutive integers → x + (x+1) = c  →  x = (c-1)/2
      function gen3() {
        const k  = rInt(8) + 5;        // smaller integer {5..12}
        const c  = 2 * k + 1;
        return {
          text:   `The sum of two consecutive integers is ${c}. Find the smaller one.`,
          answer: [String(k)],
          hint:   `If the smaller of two consecutive integers is x, how does the larger one relate to x?`,
          step:   `x+(x+1)=${c}\\Rightarrow 2x=${c-1}\\Rightarrow x=${k}`
        };
      }

      // gen4: Perimeter — length = width + d  →  w = (P - 2d)/4
      function gen4() {
        const d  = rInt(4) + 2;        // length exceeds width by {2..5}
        const w  = rInt(5) + 3;        // width {3..7}
        const P  = 4 * w + 2 * d;
        const places = ['dog park','garden bed','basketball court','community pool deck','school hallway'];
        const place  = choose(places);
        return {
          text:   `A rectangular ${place} has a length ${d} ft more than its width. The perimeter is ${P} ft. Find the width.`,
          answer: [String(w)],
          hint:   `For a rectangle where length exceeds width by a known amount, which equation relates perimeter to width?`,
          step:   `2(w+${d})+2w=${P}\\Rightarrow 4w+${2*d}=${P}\\Rightarrow w=${w}\\text{ ft}`
        };
      }

      // gen5: Break-even — ax + b = cx  →  x = b/(c-a) months
      function gen5() {
        const diff = rInt(3) + 2;      // monthly difference {2..4}
        const aRate = rInt(4) + 8;     // cheaper monthly rate {8..11}
        const cRate = aRate + diff;    // pricier but no signup
        const k    = rInt(5) + 4;      // break-even months {4..8}
        const b    = diff * k;         // signup fee
        const pairs = [
          ['Gym A','Gym B'],['Plan A','Plan B'],['Service A','Service B'],
          ['App A','App B'],['Club A','Club B']
        ];
        const [nameA, nameB] = choose(pairs);
        return {
          text:   `${nameA}: $${aRate}/mo + $${b} signup. ${nameB}: $${cRate}/mo, no signup. After how many months is the total cost equal?`,
          answer: [String(k)],
          hint:   `Write a total-cost expression for each plan in terms of months. What equation does "equal total" give you?`,
          step:   `${aRate}x+${b}=${cRate}x\\Rightarrow ${b}=${diff}x\\Rightarrow x=${k}\\text{ months}`
        };
      }

      // gen6: Budget inequality → ax ≤ budget, answer = floor
      function gen6() {
        const clothing = choose(CLOTHING);
        const a   = rInt(6) + 8;       // cost per item {8..13}
        const k   = rInt(5) + 3;       // max items {3..7}
        const rem = rInt(a - 1) + 1;   // leftover {1..a-1}
        const budget = a * k + rem;
        return {
          text:   `You have $${budget}. Each ${clothing} costs $${a}. How many can you buy?`,
          answer: [String(k)],
          hint:   `Write an inequality: cost per item times quantity ≤ budget. Can x be a fraction here?`,
          step:   `${a}x\\leq${budget}\\Rightarrow x\\leq${(budget/a).toFixed(2)}\\Rightarrow\\text{at most }${k}\\text{ ${clothing}s}`
        };
      }

      // gen7: Savings goal → b + ax ≥ target
      function gen7() {
        const goal    = choose(SAVINGS_GOALS);
        const weekly  = (rInt(4) + 3) * 5;   // save {15,20,25,30,35} per week
        const k       = rInt(5) + 3;          // weeks needed {3..7}
        const saved   = rInt(weekly - 1) + 1; // already saved (less than one week's worth so answer is exactly k)
        const target  = saved + weekly * k;
        return {
          text:   `You have $${saved} saved and put away $${weekly} per week. How many weeks until you can afford ${goal.item} ($${target})?`,
          answer: [String(k)],
          hint:   `Which quantity is fixed at the start, and which grows each week? What inequality means "enough to afford it"?`,
          step:   `${saved}+${weekly}x\\geq${target}\\Rightarrow ${weekly}x\\geq${target-saved}\\Rightarrow x\\geq${k}\\text{ weeks}`
        };
      }

      // gen8: Score needed — current + x ≥ target (inequality, fun context)
      function gen8() {
        const perAssign = (rInt(3) + 2) * 10;  // each assignment worth {20,30,40,50}
        const k         = rInt(4) + 1;           // need this many more points {1..4} × perAssign...
        // actually: you've done n assignments, need total points T, what's min on next one?
        const n         = rInt(3) + 2;           // assignments done {2..4}
        const avgPts    = (rInt(3) + 6) * 10;   // average so far {60,70,80,90}
        const current   = n * avgPts;
        const targetAvg = avgPts + (rInt(2) + 1) * 10;  // target average 10 or 20 points higher
        const target    = (n + 1) * targetAvg;
        const minScore  = target - current;
        // keep minScore reasonable (≤ 100)
        if (minScore > 100 || minScore < 10) {
          // fallback to a simpler version
          const curr2   = 240;
          const tgt2    = 300;
          const min2    = 60;
          return {
            text:   `You have ${curr2} total points across 3 assignments. You need at least ${tgt2} points total after 4 assignments. What is the minimum score on the next one?`,
            answer: [String(min2)],
            hint:   `Your current total plus the new score must reach the target. What inequality expresses that?`,
            step:   `240+x\\geq300\\Rightarrow x\\geq60\\text{ points}`
          };
        }
        return {
          text:   `You have ${current} total points across ${n} assignments. You need at least ${target} points total after ${n+1} assignments. What is the minimum score on the next one?`,
          answer: [String(minScore)],
          hint:   `Your current total plus the new score must reach the target. What inequality expresses that?`,
          step:   `${current}+x\\geq${target}\\Rightarrow x\\geq${minScore}\\text{ points}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_1_6: Absolute Value Equations and Inequalities
  CA_SPIRAL["CA_1_6"] = {
    title: "Absolute Value Equations and Inequalities",
    index: 5,
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

      // gen1: |x + b| = k  →  two solutions; accept the larger alone or both
      // (comma-separated, either order)
      function gen1() {
        const b   = rInt(4) + 1;          // b in {1..4}
        const k   = rInt(4) + b + 1;      // k > b so larger solution k-b > 0
        const big = k - b;
        const sml = -(k + b);
        return {
          latex:  `|x + ${b}| = ${k}`,
          answer: [String(big), `${big},${sml}`, `${sml},${big}`],
          hint:   `Distance can't be negative, so split into two cases. What are both solutions?`,
          step:   `x+${b}=${k}\\Rightarrow x=${big};\\quad x+${b}=-${k}\\Rightarrow x=${sml}\\quad\\text{solutions: }${big},\\,${sml}`
        };
      }

      // gen2: |ax + b| = k  →  positive solution (a=2 or 3, solutions are integers)
      function gen2() {
        const a   = rInt(2) + 2;           // a in {2,3}
        const p   = rInt(4) + 1;           // positive solution
        const q   = rInt(4) + 1;           // |negative solution| — distinct from p
        const k   = a * (p + q) / 2;       // This won't be integer in general
        // Cleaner: let solutions be p and -q, then midpoint = (p-q)/2, half-dist = (p+q)/2
        // |x - mid| = half → only works if mid and half are nice
        // Simplest: |ax| = k → x = k/a or -k/a; let k = a*p → solutions p and -p
        const pp  = rInt(4) + 1;
        const kk  = a * pp;
        return {
          latex:  `|${a}x| = ${kk}`,
          answer: [String(pp), `${pp},-${pp}`, `-${pp},${pp}`],
          hint:   `Split into two equations. What are both solutions for x?`,
          step:   `${a}x=${kk}\\Rightarrow x=${pp};\\quad ${a}x=-${kk}\\Rightarrow x=-${pp}\\quad\\text{solutions: }${pp},\\,-${pp}`
        };
      }

      // gen3: |x - p| = q  →  larger solution = p + q  (two distinct integer solutions)
      function gen3() {
        const p   = rInt(4) + 2;           // center {2..5}
        const q   = rInt(4) + 1;           // half-distance {1..4}
        const big = p + q;
        const sml = p - q;                 // could be negative or positive
        return {
          latex:  `|x - ${p}| = ${q}`,
          answer: [String(big), `${big},${sml}`, `${sml},${big}`],
          hint:   `What are the two numbers that sit exactly that distance from the center point?`,
          step:   `x-${p}=${q}\\Rightarrow x=${big};\\quad x-${p}=-${q}\\Rightarrow x=${sml}\\quad\\text{solutions: }${big},\\,${sml}`
        };
      }

      // gen4: c|x + a| + d = e  →  isolate first, larger solution
      function gen4() {
        const c   = rInt(2) + 2;           // coefficient {2,3}
        const a   = rInt(3) + 1;           // shift {1..3}
        const k   = rInt(3) + 2;           // |x+a| = k after isolating
        const d   = rInt(4) + 1;           // constant subtracted
        const e   = c * k + d;
        const big = k - a;
        const sml = -(k + a);
        return {
          latex:  `${c}|x + ${a}| + ${d} = ${e}`,
          answer: [String(big), `${big},${sml}`, `${sml},${big}`],
          hint:   `Before the absolute value can be split, what coefficient outside it must be dealt with?`,
          step:   `${c}|x+${a}|=${e-d}\\Rightarrow|x+${a}|=${k}\\Rightarrow x=${big}\\text{ or }x=${sml}\\quad\\text{solutions: }${big},\\,${sml}`
        };
      }

      // gen5: |x + b| < k  →  full interval (L,R)
      function gen5() {
        const b   = rInt(3) + 1;           // b in {1..3}
        const R   = rInt(4) + 2;           // right boundary {2..5}
        const k   = R + b;
        const L   = -(k + b);              // left boundary (always negative)
        return {
          latex:  `|x + ${b}| < ${k}`,
          answer: [`(${L},${R})`, `${L},${R}`],
          hint:   `Less than absolute value means the expression is bounded — what interval contains all solutions?`,
          interval: true,
          step:   `-${k}<x+${b}<${k}\\Rightarrow${L}<x<${R}\\Rightarrow(${L},\\,${R})`
        };
      }

      // gen6: |ax| < k  →  full interval (-R,R)
      function gen6() {
        const a   = rInt(2) + 2;           // a in {2,3}
        const R   = rInt(3) + 2;           // right boundary {2..4}
        // b = 0, so |ax| < k → -k/a < x < k/a, with k = a*R → x in (-R, R)
        const k   = a * R;
        return {
          latex:  `|${a}x| < ${k}`,
          answer: [`(-${R},${R})`, `-${R},${R}`],
          hint:   `For |ax| < k, the solution is symmetric about zero — what is that symmetric interval?`,
          interval: true,
          step:   `-${k}<${a}x<${k}\\Rightarrow(-${R},\\,${R})`
        };
      }

      // gen7: |x - p| > q  →  full union (-inf,p-q)u(p+q,inf)
      function gen7() {
        const p   = rInt(3) + 2;           // center {2..4}
        const q   = rInt(3) + 2;           // half-distance {2..4}
        const cut = p + q;                 // right cutoff (positive)
        return {
          latex:  `|x - ${p}| > ${q}`,
          answer: [`(-inf,${p-q})u(${cut},inf)`],
          hint:   `Greater-than absolute value means "outside a range" — what union of intervals is the full solution?`,
          interval: true,
          step:   `x-${p}<-${q}\\Rightarrow x<${p-q};\\quad x-${p}>${q}\\Rightarrow x>${cut}\\Rightarrow(-\\infty,${p-q})\\cup(${cut},\\infty)`
        };
      }

      // gen8: How many solutions? "none", "one", or "two"  (conceptual)
      function gen8() {
        const a   = rInt(3) + 1;
        const b   = rInt(4) + 1;
        const cases = [
          {k:  rInt(4)+2, ans: 'two',  note: 'positive right side → two solutions'},
          {k:  0,         ans: 'one',  note: 'zero right side → one solution'},
          {k: -(rInt(3)+1), ans: 'none', note: 'negative right side → no solution'},
        ];
        const {k, ans, note} = choose(cases);
        const kStr = k < 0 ? `(${k})` : String(k);
        return {
          latex:  `\\text{How many solutions does }|${a}x + ${b}| = ${kStr}\\text{ have?}`,
          answer: [ans],
          hint:   `Think about what absolute value means geometrically. Can a distance equal that number?`,
          step:   `\\text{Right side is }${k < 0 ? 'negative' : k === 0 ? 'zero' : 'positive'}\\Rightarrow\\text{${note}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_2_1: Slope and Intercepts
  CA_SPIRAL["CA_2_1"] = {
    title: "Slope and Intercepts",
    index: 6,
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

      // gen1: Slope from two points — integer slope
      function gen1() {
        const x1 = rInt(4) + 1;
        const x2 = x1 + rInt(4) + 1;       // x2 > x1
        const m  = rInt(7) - 3;            // slope in {-3..3}, skip 0
        const adjM = m === 0 ? 1 : m;
        const y1 = rInt(4) + 1;
        const y2 = y1 + adjM * (x2 - x1);
        return {
          latex:  `\\text{Find the slope through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(adjM)],
          hint:   `Which coordinate goes in the numerator of the slope formula, and which in the denominator?`,
          step:   `m=\\dfrac{${y2}-${y1}}{${x2}-${x1}}=\\dfrac{${y2-y1}}{${x2-x1}}=${adjM}`
        };
      }

      // gen2: y-intercept from Ax + By = C  →  ordered pair (0, yI)
      function gen2() {
        const A  = rInt(4) + 2;
        const B  = rInt(3) + 2;
        const yI = rInt(5) + 2;            // y-intercept
        const C  = B * yI;
        return {
          latex:  `\\text{Find the y-intercept of }${A}x + ${B}y = ${C}.`,
          answer: [`(0,${yI})`],
          hint:   `Which variable do you set to zero to find the y-intercept?`,
          step:   `x=0:\\;${B}y=${C}\\Rightarrow y=${yI}\\quad\\text{y-intercept: }(0,${yI})`
        };
      }

      // gen3: x-intercept from Ax + By = C  →  ordered pair (xI, 0)
      function gen3() {
        const A  = rInt(3) + 2;
        const B  = rInt(3) + 2;
        const xI = rInt(5) + 2;            // x-intercept
        const C  = A * xI;
        return {
          latex:  `\\text{Find the x-intercept of }${A}x + ${B}y = ${C}.`,
          answer: [`(${xI},0)`],
          hint:   `Which variable do you set to zero to find the x-intercept?`,
          step:   `y=0:\\;${A}x=${C}\\Rightarrow x=${xI}\\quad\\text{x-intercept: }(${xI},0)`
        };
      }

      // gen4: slope from y = mx + b
      function gen4() {
        const m  = rInt(8) - 4;
        const adjM = m === 0 ? 2 : m;
        const b  = rInt(8) - 4;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `\\text{State the slope of }y = ${adjM}x ${bStr}.`,
          answer: [String(adjM)],
          hint:   `In y = mx + b, which letter represents the slope?`,
          step:   `m = ${adjM}`
        };
      }

      // gen5: y-intercept from y = mx + b  →  ordered pair (0, b)
      function gen5() {
        const m  = rInt(5) - 2;
        const adjM = m === 0 ? 1 : m;
        const b  = rInt(8) - 4;
        const adjB = b === 0 ? 3 : b;
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `\\text{State the y-intercept of }y = ${adjM}x ${bStr}.`,
          answer: [`(0,${adjB})`],
          hint:   `In y = mx + b, which letter gives the y-intercept value?`,
          step:   `b = ${adjB}\\quad\\text{y-intercept: }(0,${adjB})`
        };
      }

      // gen6: slope between two points where one coord is 0
      function gen6() {
        const x2 = rInt(4) + 2;
        const y1 = rInt(5) + 1;
        const m  = rInt(5) - 3;
        const adjM = m === 0 ? 2 : m;
        const y2 = adjM * x2 + y1;
        return {
          latex:  `\\text{Find the slope through }(0,\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(adjM)],
          hint:   `One x-coordinate is 0, which simplifies the denominator. What is rise over run here?`,
          step:   `m=\\dfrac{${y2}-${y1}}{${x2}-0}=\\dfrac{${y2-y1}}{${x2}}=${adjM}`
        };
      }

      // gen7: is slope positive, negative, zero, or undefined? (text)
      function gen7() {
        const cases = [
          {latex: `y = 3x + 2`,   ans: 'positive',  why: 'm=3>0'},
          {latex: `y = -4x + 1`,  ans: 'negative',  why: 'm=-4<0'},
          {latex: `y = 5`,        ans: 'zero',       why: 'horizontal line'},
          {latex: `x = -2`,       ans: 'undefined',  why: 'vertical line'},
          {latex: `y = -x + 3`,   ans: 'negative',  why: 'm=-1<0'},
          {latex: `y = \\frac{2}{3}x - 1`, ans: 'positive', why: 'm=2/3>0'},
        ];
        const {latex, ans, why} = choose(cases);
        return {
          latex:  `\\text{Is the slope of }${latex}\\text{ positive, negative, zero, or undefined?}`,
          answer: [ans],
          hint:   `Look at the coefficient of x. If there is no x, what kind of line is it?`,
          step:   `\\text{${why} → ${ans}}`
        };
      }

      // gen8: slope from two points — negative slope
      function gen8() {
        const x1 = rInt(3) + 1;
        const x2 = x1 + rInt(3) + 2;
        const m  = -(rInt(4) + 1);        // negative slope {-1..-4}
        const y1 = rInt(4) + 4;           // y1 large enough that y2 stays positive
        const y2 = y1 + m * (x2 - x1);
        return {
          latex:  `\\text{Find the slope through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(m)],
          hint:   `In the slope formula, which coordinates belong in the numerator and which in the denominator?`,
          step:   `m=\\dfrac{${y2}-${y1}}{${x2}-${x1}}=\\dfrac{${y2-y1}}{${x2-x1}}=${m}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_2_2: Slope-Intercept and Point-Slope Form
  CA_SPIRAL["CA_2_2"] = {
    title: "Slope-Intercept and Point-Slope Form",
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

      // gen1: y-intercept b from y = mx + b given slope + point
      function gen1() {
        const m  = rInt(5) - 2;
        const adjM = m === 0 ? 2 : m;
        const x1 = rInt(4) + 1;
        const b  = rInt(6) - 3;
        const adjB = b === 0 ? 1 : b;
        const y1 = adjM * x1 + adjB;
        return {
          latex:  `\\text{A line has slope }${adjM}\\text{ and passes through }(${x1},\\,${y1}).\\text{ Find the y-intercept.}`,
          answer: [String(adjB)],
          hint:   `Use point-slope form or substitute the point into y = ${adjM}x + b. What does b equal?`,
          step:   `${y1}=${adjM}(${x1})+b\\Rightarrow b=${adjB}`
        };
      }

      // gen2: slope from Ax + By = C (convert to slope-intercept)
      function gen2() {
        const m  = rInt(5) - 2;
        const adjM = m === 0 ? 2 : m;
        const B  = rInt(3) + 2;
        const A  = -adjM * B;              // Ax + By = C → y = (−A/B)x + C/B
        const b  = rInt(4) + 1;
        const C  = B * b;
        const Aabs = Math.abs(A);
        const Asign = A < 0 ? '-' : '+';
        return {
          latex:  `\\text{Find the slope of }${A}x + ${B}y = ${C}.`,
          answer: [String(adjM)],
          hint:   `Solve for y to get slope-intercept form. What is the coefficient of x?`,
          step:   `${B}y=-${A < 0 ? `(${A})` : A}x+${C}\\Rightarrow y=${adjM}x+${b}\\quad m=${adjM}`
        };
      }

      // gen3: find b given m and a point, via y = mx + b
      function gen3() {
        const m  = rInt(4) - 2;
        const adjM = m === 0 ? 3 : m;
        const x1 = rInt(4) + 1;
        const b  = rInt(6) - 3;
        const adjB = b === 0 ? -2 : b;
        const y1 = adjM * x1 + adjB;
        const bSign = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `\\text{Line through }(${x1},\\,${y1})\\text{ with slope }${adjM}.\\text{ Find }b\\text{ in }y=${adjM}x+b.`,
          answer: [String(adjB)],
          hint:   `Substitute the known x and y values into y = ${adjM}x + b and solve for b.`,
          step:   `${y1}=${adjM}(${x1})+b\\Rightarrow b=${adjB}`
        };
      }

      // gen4: find y-intercept from two points
      function gen4() {
        const m  = rInt(5) - 2;
        const adjM = m === 0 ? 2 : m;
        const x1 = rInt(4) + 1;
        const b  = rInt(6) - 2;
        const adjB = b === 0 ? 3 : b;
        const y1 = adjM * x1 + adjB;
        const x2 = x1 + rInt(3) + 1;
        const y2 = adjM * x2 + adjB;
        return {
          latex:  `\\text{Find the y-intercept of the line through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(adjB)],
          hint:   `Find the slope first, then use either point to find b.`,
          step:   `m=\\frac{${y2-y1}}{${x2-x1}}=${adjM},\\quad b=${adjB}`
        };
      }

      // gen5: evaluate y at a given x using y = mx + b
      function gen5() {
        const m  = rInt(4) - 1;
        const adjM = m === 0 ? 2 : m;
        const b  = rInt(5) - 2;
        const adjB = b === 0 ? 1 : b;
        const x  = rInt(4) + 1;
        const y  = adjM * x + adjB;
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `\\text{For }y = ${adjM}x ${bStr},\\text{ find }y\\text{ when }x = ${x}.`,
          answer: [String(y)],
          hint:   `Substitute x = ${x} directly into the equation and simplify.`,
          step:   `y=${adjM}(${x})${bStr}=${y}`
        };
      }

      // gen6: find x given y on y = mx + b
      function gen6() {
        const m  = rInt(3) + 2;            // positive to keep x positive
        const b  = rInt(4) + 1;
        const k  = rInt(4) + 1;            // answer x = k
        const y  = m * k + b;
        const bStr = `+ ${b}`;
        return {
          latex:  `\\text{For }y = ${m}x + ${b},\\text{ find }x\\text{ when }y = ${y}.`,
          answer: [String(k)],
          hint:   `Set the equation equal to ${y} and solve for x, just like §1.1.`,
          step:   `${y}=${m}x+${b}\\Rightarrow ${m}x=${y-b}\\Rightarrow x=${k}`
        };
      }

      // gen7: slope from point-slope form — read directly
      function gen7() {
        const m  = rInt(7) - 3;
        const adjM = m === 0 ? 2 : m;
        const x1 = rInt(4) + 1;
        const y1 = rInt(4) + 1;
        const mStr = adjM < 0 ? `(${adjM})` : String(adjM);
        return {
          latex:  `\\text{State the slope of the line: }y - ${y1} = ${mStr}(x - ${x1})`,
          answer: [String(adjM)],
          hint:   `In point-slope form, where does the slope appear?`,
          step:   `m = ${adjM}`
        };
      }

      // gen8: find b from two points (slope from scratch)
      function gen8() {
        const m  = rInt(4) - 2;
        const adjM = m === 0 ? 3 : m;
        const b  = rInt(5) - 2;
        const adjB = b === 0 ? 2 : b;
        const x1 = 0;                      // one point is the y-intercept itself
        const y1 = adjB;
        const x2 = rInt(4) + 1;
        const y2 = adjM * x2 + adjB;
        return {
          latex:  `\\text{Find the y-intercept of the line through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(adjB)],
          hint:   `One of these points has x = 0. What does that make its y-value?`,
          step:   `(0,${adjB})\\text{ has }x=0,\\text{ so the y-intercept is }${adjB}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_2_3: Equations from Graphs
  CA_SPIRAL["CA_2_3"] = {
    title: "Equations from Graphs",
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

      // ── SVG graph helper ─────────────────────────────────────────────────────────
      function gridAxesSVG() {
        const W = 220, H = 220, cx = 110, cy = 110, sc = 20;
        let g = '';
        // grid lines
        for (let i = -5; i <= 5; i++) {
          const px = cx + i*sc, py = cy - i*sc;
          g += `<line x1="${px}" y1="5" x2="${px}" y2="${H-5}" stroke="#e0ddd8" stroke-width="1"/>`;
          g += `<line x1="5" y1="${py}" x2="${W-5}" y2="${py}" stroke="#e0ddd8" stroke-width="1"/>`;
        }
        // axes
        g += `<line x1="5" y1="${cy}" x2="${W-10}" y2="${cy}" stroke="#555" stroke-width="1.5"/>`;
        g += `<line x1="${cx}" y1="10" x2="${cx}" y2="${H-5}" stroke="#555" stroke-width="1.5"/>`;
        // arrowheads
        g += `<polygon points="${W-5},${cy} ${W-12},${cy-4} ${W-12},${cy+4}" fill="#555"/>`;
        g += `<polygon points="${cx},5 ${cx-4},12 ${cx+4},12" fill="#555"/>`;
        // tick marks and labels
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          const px = cx + i*sc, py = cy - i*sc;
          g += `<line x1="${px}" y1="${cy-4}" x2="${px}" y2="${cy+4}" stroke="#555" stroke-width="1"/>`;
          g += `<text x="${px}" y="${cy+16}" text-anchor="middle" font-size="10" fill="#777" font-family="sans-serif">${i}</text>`;
          g += `<line x1="${cx-4}" y1="${py}" x2="${cx+4}" y2="${py}" stroke="#555" stroke-width="1"/>`;
          g += `<text x="${cx-8}" y="${py+4}" text-anchor="end" font-size="10" fill="#777" font-family="sans-serif">${i}</text>`;
        }
        g += `<text x="${cx-7}" y="${cy+15}" text-anchor="end" font-size="10" fill="#777" font-family="sans-serif">0</text>`;
        return g;
      }

      function svgWrap(inner, question) {
        const qHtml = `<p style="font-family:sans-serif;font-size:13px;text-align:center;margin-top:6px;color:#1a1a1a">${question}</p>`;
        return `<svg width="220" height="220" viewBox="0 0 220 220" style="display:block;margin:0 auto;background:#fafaf8;border-radius:4px">${inner}</svg>${qHtml}`;
      }

      function markPoint(px, py, label) {
        const cx = 110, cy = 110, sc = 20;
        const sx = cx + px*sc, sy = cy - py*sc;
        let s = `<circle cx="${sx}" cy="${sy}" r="4.2" fill="#1e3a5c"/>`;
        if (label) s += `<text x="${sx+7}" y="${sy-7}" font-size="10" fill="#1e3a5c" font-family="sans-serif">${label}</text>`;
        return s;
      }

      // makeGraph(m, b, question, marks) — marks: optional array of [x, y, label] to circle
      function makeGraph(m, b, question, marks) {
        const cx = 110, cy = 110, sc = 20;
        let g = gridAxesSVG();
        // the line, clipped to x ∈ [-5.5, 5.5]
        const lx1 = -5.5, lx2 = 5.5;
        const ly1 = m*lx1 + b, ly2 = m*lx2 + b;
        g += `<line x1="${cx+lx1*sc}" y1="${cy-ly1*sc}" x2="${cx+lx2*sc}" y2="${cy-ly2*sc}" stroke="#1e3a5c" stroke-width="2.5" stroke-linecap="round"/>`;
        if (marks) marks.forEach(pt => { g += markPoint(pt[0], pt[1], pt[2]); });
        return svgWrap(g, question);
      }

      // makeVerticalGraph(h, question, marks) — for x = h lines, which makeGraph can't represent
      function makeVerticalGraph(h, question, marks) {
        const cx = 110, cy = 110, sc = 20;
        let g = gridAxesSVG();
        g += `<line x1="${cx+h*sc}" y1="10" x2="${cx+h*sc}" y2="210" stroke="#1e3a5c" stroke-width="2.5" stroke-linecap="round"/>`;
        if (marks) marks.forEach(pt => { g += markPoint(pt[0], pt[1], pt[2]); });
        return svgWrap(g, question);
      }

      // gen1: graph → find slope
      function gen1() {
        const m = choose([-3,-2,-1,1,2,3]);
        const b = rInt(7) - 3;
        return {
          svg:    makeGraph(m, b, 'What is the slope of this line?'),
          answer: [String(m)],
          hint:   'Pick two lattice points the line passes through. What is rise over run between them?',
          step:   `\\text{slope} = ${m}`
        };
      }

      // gen2: graph → find y-intercept (ordered pair)
      function gen2() {
        const m = choose([-2,-1,1,2]);
        const b = rInt(9) - 4;
        return {
          svg:    makeGraph(m, b, 'What is the y-intercept of this line? Give an ordered pair.'),
          answer: [`(0,${b})`],
          hint:   'The y-intercept is where the line meets the y-axis — give its coordinates as an ordered pair.',
          step:   `\\text{y-intercept} = (0,${b})`
        };
      }

      // gen3: graph → find x-intercept (ordered pair)
      function gen3() {
        const m = choose([-2,-1,1,2]);
        const k = choose([-2,-1,1,2]);
        const b = -m * k;
        return {
          svg:    makeGraph(m, b, 'What is the x-intercept of this line? Give an ordered pair.'),
          answer: [`(${k},0)`],
          hint:   'The x-intercept is where the line meets the x-axis — give that crossing point as an ordered pair.',
          step:   `\\text{x-intercept} = (${k},0)`
        };
      }

      // gen4: graph, y-intercept marked → write the full equation
      function gen4() {
        const m = choose([-3,-2,-1,1,2,3]);
        const b = rInt(7) - 3;
        const mPart = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
        const bPart = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
        return {
          svg:    makeGraph(m, b, 'Write the equation of this line.', [[0, b, `(0,${b})`]]),
          answer: [`y=${mPart}${bPart}`, `${mPart}${bPart}`],
          hint:   'The y-intercept is marked on the graph — what slope connects it to another point on the line?',
          step:   `y=${mPart}${bPart}`
        };
      }

      // gen5: graph, two marked points (y-intercept not shown) → write the full equation
      function gen5() {
        const m  = choose([-2,-1,1,2]);
        const x1 = choose([-2,-1,1,2]);
        const y1 = rInt(5) - 2;
        const b  = y1 - m * x1;
        const dirs = shuffle([1,-1,2,-2]);
        let x2 = x1 + 1, y2 = m*(x1+1) + b;
        for (const d of dirs) {
          const cx2 = x1 + d, cy2 = m*cx2 + b;
          if (cx2 !== x1 && cx2 !== 0 && Math.abs(cx2) <= 4 && Math.abs(cy2) <= 4) { x2 = cx2; y2 = cy2; break; }
        }
        const mPart  = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
        const bPart  = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
        const x1Term = x1 >= 0 ? `x-${x1}` : `x+${-x1}`;
        const y1Term = y1 >= 0 ? `y-${y1}` : `y+${-y1}`;
        return {
          svg:    makeGraph(m, b, 'Write the equation of this line using the two marked points.',
                             [[x1, y1, `(${x1},${y1})`], [x2, y2, `(${x2},${y2})`]]),
          answer: [`y=${mPart}${bPart}`, `${mPart}${bPart}`],
          hint:   'Two points are marked on the line — what slope do they determine, and where does that place the y-intercept?',
          step:   `m=${m},\\quad ${y1Term}=${m}(${x1Term})\\Rightarrow y=${mPart}${bPart}`
        };
      }

      // gen6: horizontal-line graph → write the equation
      function gen6() {
        const k = rInt(9) - 4;
        const adjK = k === 0 ? 3 : k;
        const x = choose([-3,-2,-1,1,2,3]);
        return {
          svg:    makeGraph(0, adjK, 'Write the equation of this horizontal line.', [[x, adjK, `(${x},${adjK})`]]),
          answer: [`y=${adjK}`],
          hint:   'A horizontal line on this graph has one y-value everywhere — what is it?',
          step:   `y=${adjK}\\text{ for every point on this line}`
        };
      }

      // gen7: vertical-line graph → write the equation
      function gen7() {
        const h = rInt(9) - 4;
        const adjH = h === 0 ? 3 : h;
        const y = choose([-3,-2,-1,1,2,3]);
        return {
          svg:    makeVerticalGraph(adjH, 'Write the equation of this vertical line.', [[adjH, y, `(${adjH},${y})`]]),
          answer: [`x=${adjH}`],
          hint:   'A vertical line on this graph has one x-value everywhere — what is it?',
          step:   `x=${adjH}\\text{ for every point on this line}`
        };
      }

      // gen8: graph with a marked test point → does it lie on the line?
      function gen8() {
        const m = choose([-2,-1,1,2]);
        const x0 = choose([-3,-2,-1,1,2,3]);
        const trueY = rInt(7) - 3;
        const b = trueY - m * x0;
        const isOn = rInt(2) === 0;
        const testY = isOn ? trueY : trueY + choose([1,-1]);
        const ans = isOn ? 'yes' : 'no';
        return {
          svg:    makeGraph(m, b, 'Does the marked point P lie on this line?', [[x0, testY, 'P']]),
          answer: [ans],
          hint:   'Trace the line at that x-value — does the marked point sit on it or off it?',
          step:   `\\text{At }x=${x0}\\text{, the line has }y=${trueY}.\\quad P=(${x0},${testY})\\;${isOn?'\\text{is on the line.}':'\\text{is not on the line.}'}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_2_4: Parallel and Perpendicular Lines
  CA_SPIRAL["CA_2_4"] = {
    title: "Parallel and Perpendicular Lines",
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

      // gen1: identify parallel/perpendicular/neither — integer slopes
      function gen1() {
        const adjM = choose([2, 3, -2, -3, 4, -4]);
        const b1   = rInt(4) + 1;
        const b2   = b1 + rInt(3) + 1;     // different y-intercepts
        const type = rInt(3);              // 0=parallel, 1=perpendicular, 2=neither
        let m2, ans;
        if (type === 0) {
          m2 = adjM; ans = 'parallel';
          return {
            latex: `\\text{Slopes }m_1=${adjM}\\text{ and }m_2=${m2}.\\text{ Parallel, perpendicular, or neither?}`,
            answer: [ans],
            hint:  `When two slopes are equal, what is the relationship between the lines?`,
            step:  `m_1=m_2=${adjM}\\quad\\text{→ parallel}`
          };
        } else if (type === 1) {
          // Only use exact negative-reciprocal integer pairs: product = -1
          const pair = choose([[1,-1],[-1,1]]);
          return {
            latex: `\\text{Slopes }m_1=${pair[0]}\\text{ and }m_2=${pair[1]}.\\text{ Parallel, perpendicular, or neither?}`,
            answer: ['perpendicular'],
            hint:  `Multiply the two slopes together. What product indicates perpendicular lines?`,
            step:  `${pair[0]}\\times${pair[1]}=${pair[0]*pair[1]}=-1\\quad\\text{→ perpendicular}`
          };
        } else {
          m2 = adjM + rInt(2) + 1; ans = 'neither';
          return {
            latex:  `\\text{Slopes }m_1=${adjM}\\text{ and }m_2=${m2}.\\text{ Parallel, perpendicular, or neither?}`,
            answer: [ans],
            hint:   `Are the slopes equal, and do they multiply to −1?`,
            step:   `m_1\\neq m_2,\\; m_1\\cdot m_2=${adjM*m2}\\neq-1\\quad\\text{→ neither}`
          };
        }
      }

      // gen2: perpendicular slope — given a unit-fraction slope (1/n or -1/n), find the integer perp
      function gen2() {
        const n    = rInt(4) + 2;      // denominator: {2,3,4,5}
        const neg  = rInt(2) === 0;    // sign of the given slope
        // given slope: neg ? -1/n : 1/n  →  perp slope is integer: neg ? +n : -n
        const perp = neg ? n : -n;
        const mTeX = neg ? `-\\dfrac{1}{${n}}` : `\\dfrac{1}{${n}}`;
        return {
          latex:  `\\text{What slope is perpendicular to a line with slope }${mTeX}?`,
          answer: [String(perp)],
          hint:   `Perpendicular slopes are negative reciprocals — flip and negate. What integer results?`,
          step:   `m_\\perp = -\\left(${mTeX}\\right)^{-1} = ${perp}`
        };
      }

      // gen3: y-intercept of parallel line through a given point
      function gen3() {
        const m  = rInt(5) - 2;
        const adjM = m === 0 ? 2 : m;
        const b1 = rInt(5) - 2;
        const x1 = rInt(4) + 1;
        const b2 = rInt(6) - 2;
        const adjB2 = b2 === b1 ? b2 + 1 : b2;
        const y1 = adjM * x1 + adjB2;
        return {
          latex:  `\\text{Find the y-intercept of the line parallel to }y=${adjM}x+${b1}\\text{ through }(${x1},\\,${y1}).`,
          answer: [String(adjB2)],
          hint:   `Parallel lines share the same slope. Use that slope and the given point to find b.`,
          step:   `m=${adjM},\\quad ${y1}=${adjM}(${x1})+b\\Rightarrow b=${adjB2}`
        };
      }

      // gen4: y-intercept of perpendicular line through a given point
      // Given line has slope 1/n (fractional) so perp slope = -n (integer) — clean computation
      function gen4() {
        const n    = rInt(3) + 2;      // denominator: {2,3,4}
        const neg  = rInt(2) === 0;    // sign of the given line's slope
        const perpM = neg ? n : -n;    // perpendicular slope (integer)
        const mTeX  = neg ? `-\\dfrac{1}{${n}}` : `\\dfrac{1}{${n}}`;
        const b1    = rInt(4) + 1;     // y-intercept of the given line (shown, not used in calc)
        const x1    = rInt(4) + 1;     // point x-coordinate
        const b2    = rInt(6) - 2;     // y-intercept of the perp line we seek
        const adjB2 = b2 === 0 ? 3 : b2;
        const y1    = perpM * x1 + adjB2;  // point lies on the perpendicular line
        const b2Str = adjB2 < 0 ? `(${adjB2})` : String(adjB2);
        return {
          latex:  `\\text{Find the y-intercept of the line perpendicular to }y=${mTeX}x+${b1}\\text{ through }(${x1},\\,${y1}).`,
          answer: [String(adjB2)],
          hint:   `Perpendicular slopes are negative reciprocals — which slope does the given line's slope lead to?`,
          step:   `m_\\perp=${perpM},\\quad ${y1}=${perpM}(${x1})+b\\Rightarrow b=${adjB2}`
        };
      }

      // gen5: are two lines parallel? (yes/no) — given full equations
      function gen5() {
        const m  = rInt(4) - 1;
        const adjM = m === 0 ? 2 : m;
        const b1 = rInt(4) + 1;
        const isParallel = rInt(2) === 0;
        const b2 = isParallel ? b1 + rInt(3) + 1 : b1;
        const m2 = isParallel ? adjM : adjM + rInt(2) + 1;
        const b2Str = b2 < 0 ? `- ${Math.abs(b2)}` : `+ ${b2}`;
        const m2Str = m2 < 0 ? `(${m2})` : String(m2);
        const ans = isParallel ? 'yes' : 'no';
        return {
          latex:  `\\text{Are }y=${adjM}x+${b1}\\text{ and }y=${m2Str}x${b2Str}\\text{ parallel?}`,
          answer: [ans],
          hint:   `Two lines are parallel if and only if they have the same slope. Compare the coefficients of x.`,
          step:   isParallel
            ? `\\text{Both have slope }${adjM}\\text{ → yes}`
            : `\\text{Slopes }${adjM}\\neq${m2}\\text{ → no}`
        };
      }

      // gen6: parallel or perpendicular — from Ax + By = C form
      function gen6() {
        const m  = rInt(3) + 2;           // positive integer slope
        const B  = rInt(2) + 2;
        const A  = -m * B;
        const C1 = rInt(5) + 2;
        const C2 = rInt(5) + 3;
        const type = rInt(2) === 0 ? 'parallel' : 'perpendicular';
        const m2 = type === 'parallel' ? m : -1;  // perp only works cleanly when m=1
        const adjM = type === 'parallel' ? m : 1;
        // For clean perpendicular: use slopes 1 and -1
        const mA = 1; const mB = -1;
        const bA = rInt(4) + 1; const bB = rInt(4) + 2;
        const ans = 'perpendicular';
        return {
          latex:  `\\text{Are }y=${mA}x+${bA}\\text{ and }y=${mB}x+${bB}\\text{ parallel, perpendicular, or neither?}`,
          answer: [ans],
          hint:   `Compare slopes. Are they equal, negative reciprocals, or neither?`,
          step:   `${mA}\\times(${mB})=${mA*mB}=-1\\quad\\text{→ perpendicular}`
        };
      }

      // gen7: find the slope of a parallel line through origin
      function gen7() {
        const m  = rInt(6) - 3;
        const adjM = m === 0 ? 2 : m;
        const b  = rInt(4) + 1;
        return {
          latex:  `\\text{A line parallel to }y=${adjM}x+${b}\\text{ passes through the origin. What is its y-intercept?}`,
          answer: ['0'],
          hint:   `Parallel lines share the same slope. The origin is the point (0, 0) — what is b there?`,
          step:   `m=${adjM},\\text{ passes through }(0,0)\\Rightarrow b=0`
        };
      }

      // gen8: neither — confirm slopes don't match and don't multiply to -1
      function gen8() {
        const m1 = rInt(3) + 2;           // {2,3,4}
        const m2 = m1 + rInt(2) + 1;      // different, not negative reciprocal
        const b1 = rInt(4) + 1;
        const b2 = rInt(4) + 2;
        return {
          latex:  `\\text{Slopes }m_1=${m1}\\text{ and }m_2=${m2}.\\text{ Parallel, perpendicular, or neither?}`,
          answer: ['neither'],
          hint:   `Which property of the slopes reveals whether lines are parallel, perpendicular, or neither?`,
          step:   `${m1}\\neq${m2},\\quad ${m1}\\times${m2}=${m1*m2}\\neq-1\\quad\\text{→ neither}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_3_1: Inputs and Outputs
  CA_SPIRAL["CA_3_1"] = {
    title: "Inputs and Outputs",
    index: 10,
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

      // gen1: f(x) = ax + b, find f(c)
      function gen1() {
        const a = rInt(4) + 2, b = rInt(6) - 2, c = rInt(5) + 1;
        const adjB = b === 0 ? 1 : b;
        const ans = a * c + adjB;
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `f(x)=${a}x${bStr}.\\quad\\text{Find }f(${c}).`,
          answer: [String(ans)],
          hint:   `Replace every x with ${c} and simplify.`,
          step:   `f(${c})=${a}(${c})${bStr}=${a*c}${bStr}=${ans}`
        };
      }

      // gen2: g(x) = x² + b, find g(c)
      function gen2() {
        const b = rInt(5) + 1, c = rInt(4) + 2;
        const ans = c * c + b;
        return {
          latex:  `g(x)=x^2+${b}.\\quad\\text{Find }g(${c}).`,
          answer: [String(ans)],
          hint:   `Square the input first, then add ${b}.`,
          step:   `g(${c})=${c}^2+${b}=${c*c}+${b}=${ans}`
        };
      }

      // gen3: h(x) = ax² + b, find h(c)
      function gen3() {
        const a = rInt(2) + 2, b = rInt(5) + 1, c = rInt(3) + 2;
        const ans = a * c * c + b;
        return {
          latex:  `h(x)=${a}x^2+${b}.\\quad\\text{Find }h(${c}).`,
          answer: [String(ans)],
          hint:   `Apply the exponent before multiplying by ${a}.`,
          step:   `h(${c})=${a}(${c})^2+${b}=${a*c*c}+${b}=${ans}`
        };
      }

      // gen4: f(x) = ax + b, find x given f(x) = k
      function gen4() {
        const a = rInt(4) + 2, b = rInt(5) + 1;
        const x = rInt(5) + 1;
        const k = a * x + b;
        const bStr = `+ ${b}`;
        return {
          latex:  `f(x)=${a}x+${b}.\\quad\\text{If }f(x)=${k},\\text{ find }x.`,
          answer: [String(x)],
          hint:   `Set the formula equal to ${k} and solve for x as in §1.1.`,
          step:   `${a}x+${b}=${k}\\Rightarrow ${a}x=${k-b}\\Rightarrow x=${x}`
        };
      }

      // gen5: evaluate at a negative input — f(x) = ax + b, find f(-c)
      function gen5() {
        const a = rInt(3) + 2, b = rInt(5) + 2, c = rInt(3) + 1;
        const ans = -a * c + b;
        const bStr = `+ ${b}`;
        return {
          latex:  `f(x)=${a}x+${b}.\\quad\\text{Find }f(-${c}).`,
          answer: [String(ans)],
          hint:   `Substitute x = -${c}. Watch the sign when multiplying.`,
          step:   `f(-${c})=${a}(-${c})+${b}=${-a*c}+${b}=${ans}`
        };
      }

      // gen6: g(x) = x² - ax, find g(c) (c positive, answer positive)
      function gen6() {
        const a = rInt(3) + 1, c = rInt(3) + a + 1;  // c > a so ans > 0
        const ans = c * c - a * c;
        return {
          latex:  `g(x)=x^2-${a}x.\\quad\\text{Find }g(${c}).`,
          answer: [String(ans)],
          hint:   `Substitute x = ${c} into both terms separately, then combine.`,
          step:   `g(${c})=${c}^2-${a}(${c})=${c*c}-${a*c}=${ans}`
        };
      }

      // gen7: f(x) = ax - b, find x given f(x) = k
      function gen7() {
        const a = rInt(3) + 2, b = rInt(4) + 1;
        const x = rInt(4) + 2;
        const k = a * x - b;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{If }f(x)=${k},\\text{ find }x.`,
          answer: [String(x)],
          hint:   `Set the formula equal to ${k}, add ${b} to both sides, then divide.`,
          step:   `${a}x-${b}=${k}\\Rightarrow ${a}x=${k+b}\\Rightarrow x=${x}`
        };
      }

      // gen8: simple composition — f(g(c)) where f(x)=ax+b, g(x)=cx+d
      function gen8() {
        const a = rInt(2) + 2, b = rInt(3) + 1;
        const c2 = rInt(2) + 1, d = rInt(3) + 1;
        const x = rInt(3) + 1;
        const inner = c2 * x + d;
        const ans = a * inner + b;
        return {
          latex:  `f(x)=${a}x+${b},\\quad g(x)=${c2}x+${d}.\\quad\\text{Find }f(g(${x})).`,
          answer: [String(ans)],
          hint:   `Evaluate the inner function g(${x}) first, then use that result as the input to f.`,
          step:   `g(${x})=${c2}(${x})+${d}=${inner},\\quad f(${inner})=${a}(${inner})+${b}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_3_2: Domain and Range
  CA_SPIRAL["CA_3_2"] = {
    title: "Domain and Range",
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

      // gen1: excluded value from denominator — f(x) = k/(x - a)
      function gen1() {
        const a = rInt(6) + 1;
        const k = rInt(4) + 2;
        return {
          latex:  `\\text{What value of }x\\text{ is excluded from the domain of }f(x)=\\dfrac{${k}}{x-${a}}\\text{?}`,
          answer: [String(a)],
          hint:   `What value makes the denominator equal zero?`,
          step:   `x-${a}=0\\Rightarrow x=${a}\\text{ is excluded}`
        };
      }

      // gen2: excluded value — f(x) = k/(x + a)
      function gen2() {
        const a = rInt(5) + 1;
        const k = rInt(4) + 2;
        return {
          latex:  `\\text{What value of }x\\text{ is excluded from the domain of }f(x)=\\dfrac{${k}}{x+${a}}\\text{?}`,
          answer: [String(-a)],
          hint:   `Set the denominator equal to zero and solve for x.`,
          step:   `x+${a}=0\\Rightarrow x=-${a}\\text{ is excluded}`
        };
      }

      // gen3: minimum domain value from sqrt(x - a)
      function gen3() {
        const a = rInt(6) + 1;
        return {
          latex:  `\\text{What is the smallest value in the domain of }f(x)=\\sqrt{x-${a}}\\text{?}`,
          answer: [String(a)],
          hint:   `The expression inside a square root must be greater than or equal to zero. What does that give you?`,
          step:   `x-${a}\\geq 0\\Rightarrow x\\geq${a}\\quad\\text{minimum: }${a}`
        };
      }

      // gen4: minimum domain value from sqrt(ax - b)
      function gen4() {
        const a = rInt(3) + 2;
        const k = rInt(4) + 1;   // minimum x = k
        const b = a * k;
        return {
          latex:  `\\text{What is the smallest value in the domain of }h(x)=\\sqrt{${a}x-${b}}\\text{?}`,
          answer: [String(k)],
          hint:   `Set the radicand greater than or equal to zero and solve for x.`,
          step:   `${a}x-${b}\\geq 0\\Rightarrow x\\geq${k}\\quad\\text{minimum: }${k}`
        };
      }

      // gen5: is x = c in the domain of f(x) = k/(x - a)?  yes/no
      function gen5() {
        const a    = rInt(5) + 2;
        const k    = rInt(4) + 2;
        const isIn = rInt(2) === 0;
        const c    = isIn ? a + rInt(3) + 1 : a;
        const ans  = isIn ? 'yes' : 'no';
        return {
          latex:  `\\text{Is }x=${c}\\text{ in the domain of }f(x)=\\dfrac{${k}}{x-${a}}\\text{?}`,
          answer: [ans],
          hint:   `Check whether x = ${c} makes the denominator zero.`,
          step:   isIn
            ? `x-${a}=${c-a}\\neq 0\\quad\\text{→ yes}`
            : `x-${a}=0\\quad\\text{→ excluded → no}`
        };
      }

      // gen6: is x = c in the domain of sqrt(x - a)?  yes/no
      function gen6() {
        const a    = rInt(5) + 2;
        const isIn = rInt(2) === 0;
        const c    = isIn ? a + rInt(4) : a - rInt(3) - 1;
        const ans  = isIn ? 'yes' : 'no';
        return {
          latex:  `\\text{Is }x=${c}\\text{ in the domain of }f(x)=\\sqrt{x-${a}}\\text{?}`,
          answer: [ans],
          hint:   `Check whether x = ${c} makes the radicand negative.`,
          step:   isIn
            ? `${c}-${a}=${c-a}\\geq 0\\quad\\text{→ yes}`
            : `${c}-${a}=${c-a}<0\\quad\\text{→ not in domain → no}`
        };
      }

      // gen7: minimum value in range of f(x) = x² + k
      function gen7() {
        const k = rInt(6) - 3;
        const adjK = k === 0 ? 1 : k;
        const kStr = adjK < 0 ? `- ${Math.abs(adjK)}` : `+ ${adjK}`;
        return {
          latex:  `\\text{What is the minimum value in the range of }f(x)=x^2${kStr}\\text{?}`,
          answer: [String(adjK)],
          hint:   `The smallest x² can be is 0. What does that make f(x)?`,
          step:   `x^2\\geq 0\\Rightarrow f(x)\\geq${adjK}\\quad\\text{minimum range value: }${adjK}`
        };
      }

      // gen8: is y = k in the range of f(x) = x² + b ?  (range is [b, ∞))
      function gen8() {
        const b    = rInt(5) + 1;                      // min of range: 1–5
        const isIn = rInt(2) === 0;
        // in-range: k ≥ b+1; out-of-range: k ≤ b-1
        const k    = isIn ? b + rInt(4) + 1 : b - rInt(3) - 1;
        const ans  = isIn ? 'yes' : 'no';
        return {
          latex:  `\\text{Is }y=${k}\\text{ in the range of }f(x)=x^2+${b}\\text{?}`,
          answer: [ans],
          hint:   `A parabola x\u00b2 + b has a minimum output, reached at x = 0. What is that minimum in terms of b, and how does the target value compare to it?`,
          step:   isIn
            ? `\\text{Range: }[${b},\\infty).\\quad ${k}\\geq ${b}\\quad\\text{\u2192 yes}`
            : `\\text{Range: }[${b},\\infty).\\quad ${k}<${b}\\quad\\text{\u2192 no}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_3_3: Function Notation and Operations
  CA_SPIRAL["CA_3_3"] = {
    title: "Function Notation and Operations",
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

      // gen1–4: is this set of ordered pairs a function? (yes/no)
      // gen1: yes — all x distinct
      function gen1() {
        const xs = [1,2,3,4], ys = xs.map(() => rInt(8)+1);
        const pairs = xs.map((x,i) => `(${x},${ys[i]})`).join(',\\;');
        return {
          latex:  `\\text{Is this a function? }\\{${pairs}\\}`,
          answer: ['yes'],
          hint:   `Check whether any x-value appears more than once with a different y-value.`,
          step:   `\\text{All x-values are distinct → each x has exactly one output → yes}`
        };
      }

      // gen2: no — one x repeated with different y
      function gen2() {
        const badX = rInt(4)+1;
        const y1 = rInt(6)+1, y2 = y1 + rInt(4)+1;
        const other1 = badX+1, other2 = badX+2;
        const yo1 = rInt(6)+1, yo2 = rInt(6)+1;
        const pairs = `(${badX},${y1}),\\;(${other1},${yo1}),\\;(${other2},${yo2}),\\;(${badX},${y2})`;
        return {
          latex:  `\\text{Is this a function? }\\{${pairs}\\}`,
          answer: ['no'],
          hint:   `Look for any x-value that appears more than once. Do the y-values match?`,
          step:   `\\text{x}=${badX}\\text{ maps to both }${y1}\\text{ and }${y2}\\text{ → not a function → no}`
        };
      }

      // gen3: yes — repeated y is fine (different x)
      function gen3() {
        const sharedY = rInt(6)+3;
        const pairs = `(1,${sharedY}),\\;(2,${sharedY+1}),\\;(3,${sharedY}),\\;(4,${sharedY+2})`;
        return {
          latex:  `\\text{Is this a function? }\\{${pairs}\\}`,
          answer: ['yes'],
          hint:   `The same y-value appearing for different x-values is allowed. What matters is the x-values.`,
          step:   `\\text{All x-values are distinct — repeating a y is fine → yes}`
        };
      }

      // gen4: no — same x, different y, hidden in a longer list
      function gen4() {
        const badX = rInt(3)+2;
        const y1 = rInt(5)+2, y2 = y1+rInt(3)+1;
        const pairs = `(1,${rInt(5)+1}),\\;(${badX},${y1}),\\;(${badX+2},${rInt(5)+1}),\\;(${badX},${y2})`;
        return {
          latex:  `\\text{Is this a function? }\\{${pairs}\\}`,
          answer: ['no'],
          hint:   `Scan through all x-values. Does any x appear twice with a different y?`,
          step:   `\\text{x}=${badX}\\text{ appears twice with different outputs → no}`
        };
      }

      // gen5: evaluate from a table — find f(c)
      function gen5() {
        const xs = [1,2,3,4,5];
        const ys = xs.map(() => rInt(10)+2);
        const c  = xs[rInt(5)];
        const ans = ys[xs.indexOf(c)];
        const tableRows = xs.map((x,i)=>`${x} \\to ${ys[i]}`).join(',\\quad');
        return {
          latex:  `\\text{Given the table }${tableRows}.\\quad\\text{Find }f(${c}).`,
          answer: [String(ans)],
          hint:   `Find x = ${c} in the table and read off the corresponding output.`,
          step:   `f(${c})=${ans}`
        };
      }

      // gen6: how many outputs does a function allow per input?
      function gen6() {
        return {
          latex:  `\\text{A function allows at most how many outputs per input?}`,
          answer: ['1'],
          hint:   `Recall the definition of a function — what is the key restriction?`,
          step:   `\\text{Exactly one output per input — the answer is 1}`
        };
      }

      // gen7: is y = ax + b a function? (always yes for non-vertical lines)
      function gen7() {
        const a = rInt(4) + 1, b = rInt(4) + 1;
        return {
          latex:  `\\text{Is }y = ${a}x + ${b}\\text{ a function?}`,
          answer: ['yes'],
          hint:   `For any value of x, how many values does this equation give for y?`,
          step:   `\\text{For every x there is exactly one y → yes}`
        };
      }

      // gen8: is x = c a function? (always no — vertical line)
      function gen8() {
        const c = rInt(6) + 1;
        return {
          latex:  `\\text{Is }x = ${c}\\text{ a function?}`,
          answer: ['no'],
          hint:   `What kind of line is x = ${c}? What does the vertical line test say about it?`,
          step:   `x=${c}\\text{ is a vertical line — one input maps to infinitely many outputs → no}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_3_4: Increasing, Decreasing, Positive, Negative
  CA_SPIRAL["CA_3_4"] = {
    title: "Increasing, Decreasing, Positive, Negative",
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

      // gen1: find the x-intercept of f(x) = ax - b  (where sign changes)
      function gen1() {
        const a = rInt(4) + 2, k = rInt(5) + 2;
        const b = a * k;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{Find the x-value where }f(x)=0.`,
          answer: [String(k)],
          hint:   `Set the function equal to zero and solve — this is the boundary between positive and negative.`,
          step:   `${a}x-${b}=0\\Rightarrow x=${k}`
        };
      }

      // gen2: find the x-intercept of f(x) = ax + b  (b negative in context, boundary positive)
      function gen2() {
        const a = rInt(3) + 2, k = rInt(4) + 2;
        const b = -a * k;   // f(x) = ax + b = ax - a*k, zero at x=k... wait
        // f(x) = ax + b = 0 → x = -b/a = k → b = -a*k
        const bAbs = a * k;
        return {
          latex:  `g(x)=${a}x-${bAbs}.\\quad\\text{Where is }g\\text{ positive?}`,
          answer: [String(k)],
          hint:   `Find the zero first, then consider which side the positive slope puts the positive values.`,
          step:   `${a}x-${bAbs}=0\\Rightarrow x=${k};\\quad\\text{positive slope → positive for }x>${k}`
        };
      }

      // gen3: f(x) = -ax + b, zero at x = k, negative for x > k
      function gen3() {
        const a = rInt(3) + 2, k = rInt(4) + 2;
        const b = a * k;
        return {
          latex:  `f(x)=-${a}x+${b}.\\quad\\text{Find the x-value where }f(x)=0.`,
          answer: [String(k)],
          hint:   `Set the function equal to zero and solve for x.`,
          step:   `-${a}x+${b}=0\\Rightarrow x=${k}`
        };
      }

      // gen4: is f positive or negative at x = c? (pos/neg text)
      function gen4() {
        const a = rInt(3) + 2, b = rInt(5) + 2;
        const k = rInt(4) + 1;   // zero at x = k
        const c = rInt(2) === 0 ? k + rInt(3) + 1 : k - rInt(3) - 1;
        const val = a * c - a * k;   // f(c) = a*(c-k) since f(x)=a(x-k)
        const ans = val > 0 ? 'positive' : 'negative';
        const bVal = a * k;
        return {
          latex:  `f(x)=${a}x-${bVal}.\\quad\\text{Is }f\\text{ positive or negative at }x=${c}?`,
          answer: [ans],
          hint:   `Substitute x = ${c} and check whether the result is above or below zero.`,
          step:   `f(${c})=${a}(${c})-${bVal}=${a*c-bVal}\\;${val>0?'>':'<'}\\;0\\quad\\text{→ ${ans}}`
        };
      }

      // gen5: is f increasing or decreasing? (for linear function — slope tells all)
      function gen5() {
        const a = rInt(4) - 2;
        const adjA = a === 0 ? 3 : a;
        const b = rInt(6) - 3;
        const adjB = b === 0 ? 1 : b;
        const ans = adjA > 0 ? 'increasing' : 'decreasing';
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `\\text{Is }f(x)=${adjA}x${bStr}\\text{ increasing or decreasing?}`,
          answer: [ans],
          hint:   `Look at the slope. What does a positive slope tell you about the direction of the graph?`,
          step:   `\\text{Slope }=${adjA}\\;${adjA>0?'>':'<'}\\;0\\quad\\text{→ ${ans}}`
        };
      }

      // gen6: find x-intercept of -ax + b (negative slope line)
      function gen6() {
        const a = rInt(3) + 2, k = rInt(4) + 3;
        const b = a * k;
        return {
          latex:  `h(x)=-${a}x+${b}.\\quad\\text{Where is }h\\text{ negative? Enter the boundary x-value.}`,
          answer: [String(k)],
          hint:   `Find the zero of h first. With a negative slope, which side of the zero is negative?`,
          step:   `-${a}x+${b}=0\\Rightarrow x=${k};\\quad\\text{negative slope → negative for }x>${k}`
        };
      }

      // gen7: evaluate f at two points and determine sign of each
      function gen7() {
        const a = rInt(3) + 2, k = rInt(3) + 3;
        const b = a * k;
        const cBelow = k - rInt(2) - 1;
        const cAbove = k + rInt(2) + 1;
        const pick   = rInt(2) === 0;
        const c      = pick ? cBelow : cAbove;
        const val    = a * c - b;
        const ans    = val > 0 ? 'positive' : 'negative';
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{Is }f(${c})\\text{ positive or negative?}`,
          answer: [ans],
          hint:   `Substitute x = ${c} into f(x) and check the sign of the result.`,
          step:   `f(${c})=${a}(${c})-${b}=${val}\\;${val>0?'>':'<'}\\;0\\quad\\text{→ ${ans}}`
        };
      }

      // gen8: f(x) = ax + b, at what x does it cross zero?
      function gen8() {
        const a = rInt(4) + 2, k = rInt(5) + 2;
        const b = a * k;
        const bStr = `- ${b}`;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{At what x-value does f change from negative to positive?}`,
          answer: [String(k)],
          hint:   `A function changes sign at its zero. What x makes f(x) = 0?`,
          step:   `${a}x-${b}=0\\Rightarrow x=${k}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_3_5: Inverse Functions
  CA_SPIRAL["CA_3_5"] = {
    title: "Inverse Functions",
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

      // gen1: find f⁻¹(k) for f(x) = ax + b — answer is the input that gives k
      function gen1() {
        const a = rInt(3) + 2, b = rInt(5) + 1;
        const x = rInt(5) + 2;
        const k = a * x + b;
        return {
          latex:  `f(x)=${a}x+${b}.\\quad\\text{Find }f^{-1}(${k}).`,
          answer: [String(x)],
          hint:   `The inverse undoes f. What input to f gives the output ${k}?`,
          step:   `${a}x+${b}=${k}\\Rightarrow x=${x}`
        };
      }

      // gen2: f⁻¹(f(c)) = c — inverse property
      function gen2() {
        const a = rInt(3) + 2, b = rInt(4) + 1;
        const c = rInt(6) + 2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `f(x)=${a}x+${b}.\\quad\\text{Find }f^{-1}(f(${c})).`,
          answer: [String(c)],
          hint:   `What does applying f then f-inverse to any number always give you?`,
          step:   `f^{-1}(f(x))=x\\text{ for all }x,\\text{ so }f^{-1}(f(${c}))=${c}`
        };
      }

      // gen3: f(f⁻¹(k)) = k — forward version
      function gen3() {
        const a = rInt(3) + 2, b = rInt(4) + 1;
        const k = rInt(8) + 3;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{Find }f(f^{-1}(${k})).`,
          answer: [String(k)],
          hint:   `What does applying f-inverse then f to any number always produce?`,
          step:   `f(f^{-1}(x))=x\\text{ for all }x,\\text{ so }f(f^{-1}(${k}))=${k}`
        };
      }

      // gen4: constant term of f⁻¹(x) for f(x) = x + b
      function gen4() {
        const b = rInt(7) + 2;
        return {
          latex:  `f(x)=x+${b}.\\quad\\text{If }f^{-1}(x)=x+c,\\text{ what is }c?`,
          answer: [String(-b)],
          hint:   `Swap x and y in f, then solve for y. What constant appears?`,
          step:   `y=x+${b}\\Rightarrow x=y+${b}\\Rightarrow y=x-${b},\\text{ so }c=-${b}`
        };
      }

      // gen5: find f⁻¹(k) for f(x) = ax - b
      function gen5() {
        const a = rInt(3) + 2, b = rInt(4) + 2;
        const x = rInt(4) + 2;
        const k = a * x - b;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{Find }f^{-1}(${k}).`,
          answer: [String(x)],
          hint:   `Set f(x) equal to ${k} and solve — you are working backwards from the output.`,
          step:   `${a}x-${b}=${k}\\Rightarrow ${a}x=${k+b}\\Rightarrow x=${x}`
        };
      }

      // gen6: does f(x) = ax + b have an inverse? (always yes for non-zero slope)
      function gen6() {
        const a = (rInt(3) + 1) * (rInt(2) === 0 ? 1 : -1);
        const b = rInt(5) + 1;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `\\text{Does }f(x)=${a}x+${b}\\text{ have an inverse function?  Enter yes or no.}`,
          answer: ['yes'],
          hint:   `A linear function with non-zero slope always passes the horizontal line test. What does that mean for inverses?`,
          step:   `\\text{Non-zero slope → one-to-one → inverse exists → yes}`
        };
      }

      // gen7: find f⁻¹(0) — what x maps to 0?
      function gen7() {
        const a = rInt(3) + 2;
        const k = rInt(4) + 1;
        const b = a * k;
        return {
          latex:  `f(x)=${a}x-${b}.\\quad\\text{Find }f^{-1}(0).`,
          answer: [String(k)],
          hint:   `f-inverse of 0 is the input that makes f equal to 0. What equation does that give?`,
          step:   `${a}x-${b}=0\\Rightarrow x=${k}`
        };
      }

      // gen8: find f⁻¹(k) for f(x) = x - b  (slope 1)
      function gen8() {
        const b = rInt(6) + 2;
        const x = rInt(5) + 3;
        const k = x - b;
        return {
          latex:  `f(x)=x-${b}.\\quad\\text{Find }f^{-1}(${k}).`,
          answer: [String(x)],
          hint:   `What input to f produces the output ${k}?`,
          step:   `x-${b}=${k}\\Rightarrow x=${x}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_0: Binomials and Factoring Review
  CA_SPIRAL["CA_4_0"] = {
    title: "Binomials and Factoring Review",
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

      // gen1: (x+a)(x+b), both positive — find constant term a*b
      function gen1() {
        const a = rInt(6) + 1, b = rInt(6) + 1;
        return {
          latex:  `(x+${a})(x+${b}).\\quad\\text{Find the constant term.}`,
          answer: [String(a * b)],
          hint:   'Which letter of FOIL produces the constant term?',
          step:   `\\text{Last terms: }${a}\\cdot${b}=${a*b}`
        };
      }

      // gen2: (x+a)(x+b), both positive — find x-coefficient a+b
      function gen2() {
        const a = rInt(5) + 1, b = rInt(5) + 1;
        return {
          latex:  `(x+${a})(x+${b}).\\quad\\text{Find the coefficient of }x.`,
          answer: [String(a + b)],
          hint:   'Which two letters of FOIL produce terms that still contain x?',
          step:   `\\text{Outer + Inner: }${a}x+${b}x=${a+b}x`
        };
      }

      // gen3: (x+a)(x-b), mixed signs — find constant term (-a*b)
      function gen3() {
        const a = rInt(5) + 2, b = rInt(5) + 2;
        const c = -a * b;
        return {
          latex:  `(x+${a})(x-${b}).\\quad\\text{Find the constant term.}`,
          answer: [String(c)],
          hint:   'What is the sign when a positive number multiplies a negative number?',
          step:   `\\text{Last terms: }${a}\\cdot(-${b})=${c}`
        };
      }

      // gen4: (x-a)(x+a) difference of squares — find constant term (-a²)
      function gen4() {
        const a = rInt(6) + 2;
        return {
          latex:  `(x-${a})(x+${a}).\\quad\\text{Find the constant term.}`,
          answer: [String(-(a * a))],
          hint:   'Do these two binomials fit the difference-of-squares pattern?',
          step:   `x^2-${a}^2=x^2-${a*a};\\quad\\text{constant: }-${a*a}`
        };
      }

      // gen5: (x+a)² perfect square — find the middle coefficient 2a
      function gen5() {
        const a = rInt(6) + 2;
        return {
          latex:  `(x+${a})^2.\\quad\\text{Find the coefficient of }x.`,
          answer: [String(2 * a)],
          hint:   'Does this fit the perfect-square trinomial pattern?',
          step:   `(x+${a})^2=x^2+${2*a}x+${a*a};\\quad\\text{coefficient: }${2*a}`
        };
      }

      // gen6: (x-a)² perfect square — find the constant term a²
      function gen6() {
        const a = rInt(6) + 2;
        return {
          latex:  `(x-${a})^2.\\quad\\text{Find the constant term.}`,
          answer: [String(a * a)],
          hint:   'Does squaring a binomial fit a named pattern?',
          step:   `(x-${a})^2=x^2-${2*a}x+${a*a};\\quad\\text{constant: }${a*a}`
        };
      }

      // gen7: (ax+b)(cx+d), leading coeffs > 1 — find the x² coefficient
      function gen7() {
        const a = rInt(3) + 2, c = rInt(3) + 2;
        const b = rInt(4) + 1, d = rInt(4) + 1;
        return {
          latex:  `(${a}x+${b})(${c}x+${d}).\\quad\\text{Find the coefficient of }x^2.`,
          answer: [String(a * c)],
          hint:   'Which FOIL product contains x\xb2?',
          step:   `\\text{First: }${a}x\\cdot${c}x=${a*c}x^2`
        };
      }

      // gen8: (ax+b)(cx-d) — find the constant term (-b*d)
      function gen8() {
        const b = rInt(5) + 1, d = rInt(5) + 1;
        const a = rInt(3) + 1, c = rInt(3) + 1;
        const constant = -b * d;
        return {
          latex:  `(${a}x+${b})(${c}x-${d}).\\quad\\text{Find the constant term.}`,
          answer: [String(constant)],
          hint:   'Which letter of FOIL produces the constant term?',
          step:   `\\text{Last: }${b}\\cdot(-${d})=${constant}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_1: Solving by Factoring
  CA_SPIRAL["CA_4_1"] = {
    title: "Solving by Factoring",
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

      // gen1: trinomial, both roots negative → ask for larger (less negative) root
      function gen1() {
        const r1 = -(rInt(4) + 1), r2 = -(rInt(4) + 1);  // both negative
        const b = -(r1 + r2), c = r1 * r2;
        const larger = Math.max(r1, r2);
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Find the larger root.}`,
          answer: [String(larger)],
          hint:   'What pair of numbers multiplies to the constant term and adds to the x-coefficient?',
          step:   `(x${r1<0?`+${Math.abs(r1)}`:`-${r1}`})(x${r2<0?`+${Math.abs(r2)}`:`-${r2}`})=0\\Rightarrow x=${r1}\\text{ or }x=${r2}`
        };
      }

      // gen2: trinomial, mixed signs → ask for positive root
      function gen2() {
        const rPos = rInt(4) + 2;
        const rNeg = -(rInt(3) + 1);
        const b = -(rPos + rNeg), c = rPos * rNeg;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Find the positive root.}`,
          answer: [String(rPos)],
          hint:   'What does a negative constant term tell you about the signs of the two roots?',
          step:   `(x-${rPos})(x+${Math.abs(rNeg)})=0\\Rightarrow x=${rPos}\\text{ or }x=${rNeg}`
        };
      }

      // gen3: difference of squares — find positive root
      function gen3() {
        const k = rInt(5) + 2;
        return {
          latex:  `x^2-${k*k}=0.\\quad\\text{Find the positive root.}`,
          answer: [String(k)],
          hint:   'Does the left side fit a special factoring pattern involving two perfect squares?',
          step:   `(x+${k})(x-${k})=0\\Rightarrow x=${k}\\text{ or }x=-${k}`
        };
      }

      // gen4: GCF factoring ax²+bx=0 — find the non-zero root
      function gen4() {
        const k = rInt(6) + 2;
        const sign = rInt(2) === 0 ? 1 : -1;
        const adjK = sign * k;
        const bStr = adjK < 0 ? `- ${Math.abs(adjK)}` : `+ ${adjK}`;
        return {
          latex:  `x^2${bStr}x=0.\\quad\\text{Find the non-zero root.}`,
          answer: [String(-adjK)],
          hint:   'What factor do both terms on the left share?',
          step:   `x(x${bStr})=0\\Rightarrow x=0\\text{ or }x=${-adjK}`
        };
      }

      // gen5: trinomial, both roots positive → ask for smaller root
      function gen5() {
        const r1 = rInt(4) + 1, r2 = rInt(4) + 1;
        const b = -(r1 + r2), c = r1 * r2;
        const smaller = Math.min(r1, r2);
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Find the smaller root.}`,
          answer: [String(smaller)],
          hint:   'What pair of numbers multiplies to the constant term and adds to the x-coefficient?',
          step:   `(x-${r1})(x-${r2})=0\\Rightarrow x=${r1}\\text{ or }x=${r2}`
        };
      }

      // gen6: already factored form (x-a)(x+b)=0 — find the larger root
      function gen6() {
        const a = rInt(5) + 1;
        const b = rInt(5) + 1;
        const larger = Math.max(a, -b);
        return {
          latex:  `(x-${a})(x+${b})=0.\\quad\\text{Find the larger root.}`,
          answer: [String(larger)],
          hint:   'The equation is already factored. What does the Zero Product Property let you conclude?',
          step:   `x-${a}=0\\Rightarrow x=${a};\\quad x+${b}=0\\Rightarrow x=-${b}`
        };
      }

      // gen7: move term to standard form first, then factor
      function gen7() {
        const r1 = rInt(4) + 1, r2 = rInt(3) + 2;
        // x² = (r1+r2)x - r1*r2  →  x² - (r1+r2)x + r1*r2 = 0
        const sumR = r1 + r2, prodR = r1 * r2;
        return {
          latex:  `x^2=${sumR}x-${prodR}.\\quad\\text{Find the larger root.}`,
          answer: [String(Math.max(r1, r2))],
          hint:   'What form must a quadratic equation be in before you can factor it?',
          step:   `x^2-${sumR}x+${prodR}=0\\Rightarrow(x-${r1})(x-${r2})=0\\Rightarrow x=${r1}\\text{ or }x=${r2}`
        };
      }

      // gen8: trinomial with negative root asked (mixed sign, ask for negative root)
      function gen8() {
        const rPos = rInt(4) + 2;
        const rNeg = -(rInt(3) + 1);
        const b = -(rPos + rNeg), c = rPos * rNeg;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Find the negative root.}`,
          answer: [String(rNeg)],
          hint:   'What pair of numbers multiplies to the constant term and adds to the x-coefficient?',
          step:   `(x-${rPos})(x+${Math.abs(rNeg)})=0\\Rightarrow x=${rPos}\\text{ or }x=${rNeg}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_2: Graphing Quadratics
  CA_SPIRAL["CA_4_2"] = {
    title: "Graphing Quadratics",
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

      // ── SVG parabola helper ───────────────────────────────────────────────────────
      function makeParabola(a, h, k, question) {
        const W = 220, H = 220, cx = 110, cy = 110, sc = 20;
        let g = '';
        // grid lines
        for (let i = -5; i <= 5; i++) {
          const px = cx + i*sc, py = cy - i*sc;
          g += `<line x1="${px}" y1="5" x2="${px}" y2="${H-5}" stroke="#e0ddd8" stroke-width="1"/>`;
          g += `<line x1="5" y1="${py}" x2="${W-5}" y2="${py}" stroke="#e0ddd8" stroke-width="1"/>`;
        }
        // axes
        g += `<line x1="5" y1="${cy}" x2="${W-10}" y2="${cy}" stroke="#555" stroke-width="1.5"/>`;
        g += `<line x1="${cx}" y1="10" x2="${cx}" y2="${H-5}" stroke="#555" stroke-width="1.5"/>`;
        g += `<polygon points="${W-5},${cy} ${W-12},${cy-4} ${W-12},${cy+4}" fill="#555"/>`;
        g += `<polygon points="${cx},5 ${cx-4},12 ${cx+4},12" fill="#555"/>`;
        // tick marks and labels
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          const px = cx + i*sc, py = cy - i*sc;
          g += `<line x1="${px}" y1="${cy-4}" x2="${px}" y2="${cy+4}" stroke="#555" stroke-width="1"/>`;
          g += `<text x="${px}" y="${cy+16}" text-anchor="middle" font-size="10" fill="#777" font-family="sans-serif">${i}</text>`;
          g += `<line x1="${cx-4}" y1="${py}" x2="${cx+4}" y2="${py}" stroke="#555" stroke-width="1"/>`;
          g += `<text x="${cx-8}" y="${py+4}" text-anchor="end" font-size="10" fill="#777" font-family="sans-serif">${i}</text>`;
        }
        g += `<text x="${cx-7}" y="${cy+15}" text-anchor="end" font-size="10" fill="#777" font-family="sans-serif">0</text>`;
        // parabola as polyline
        let pts = [];
        for (let xi = -5.5; xi <= 5.51; xi += 0.1) {
          const yi = a*(xi-h)*(xi-h) + k;
          pts.push(`${(cx+xi*sc).toFixed(1)},${(cy-yi*sc).toFixed(1)}`);
        }
        g += `<polyline points="${pts.join(' ')}" fill="none" stroke="#1e3a5c" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
        // vertex dot
        const vx = cx + h*sc, vy = cy - k*sc;
        g += `<circle cx="${vx}" cy="${vy}" r="4" fill="#c0392b" stroke="#fff" stroke-width="1.5"/>`;
        const qHtml = `<p style="font-family:sans-serif;font-size:13px;text-align:center;margin-top:6px;color:#1a1a1a">${question}</p>`;
        return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;background:#fafaf8;border-radius:4px">${g}</svg>${qHtml}`;
      }

      // gen1: graph → find vertex x-coordinate (red dot)
      function gen1() {
        const h = rInt(7) - 3;
        const k = rInt(5) - 2;
        return {
          svg:    makeParabola(1, h, k, 'What is the x-coordinate of the vertex? (red dot)'),
          answer: [String(h)],
          hint:   'The red dot marks the vertex. Read the x-value on the grid directly below or above it.',
          step:   `\\text{vertex x} = ${h}`
        };
      }

      // gen2: graph → find vertex y-coordinate (red dot)
      function gen2() {
        const h = rInt(5) - 2;
        const k = rInt(7) - 3;
        return {
          svg:    makeParabola(1, h, k, 'What is the y-coordinate of the vertex? (red dot)'),
          answer: [String(k)],
          hint:   'The red dot marks the vertex. Read the y-value on the grid directly left or right of it.',
          step:   `\\text{vertex y} = ${k}`
        };
      }

      // gen3: graph → opening direction
      function gen3() {
        const a = choose([1, -1]);
        const h = rInt(5) - 2;
        const k = rInt(5) - 2;
        const ans = a > 0 ? 'up' : 'down';
        return {
          svg:    makeParabola(a, h, k, 'Does this parabola open up or down?'),
          answer: [ans],
          hint:   'Look at the arms of the parabola from the vertex. Do they go upward or downward?',
          step:   `a=${a}\\;${a>0?'>':'<'}\\;0\\quad\\Rightarrow\\quad\\text{opens ${ans}}`
        };
      }

      // gen4: standard form → axis of symmetry (b always even for integer answer)
      function gen4() {
        const bHalf = rInt(4) + 1;
        const b     = choose([-1, 1]) * 2 * bHalf;
        const c     = rInt(5) + 1;
        const axis  = -b / 2;
        const bStr  = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `f(x)=x^2${bStr}x+${c}.\\quad\\text{Find the axis of symmetry.}`,
          answer: [String(axis)],
          hint:   'What is the relationship between the axis of symmetry and the vertex?',
          step:   `x=-\\frac{${b}}{2(1)}=${axis}`
        };
      }

      // gen5: vertex form → y-intercept
      function gen5() {
        const h   = choose([-3, -2, -1, 1, 2, 3]);
        const k   = rInt(7) - 3;
        const yInt = h*h + k;
        const inner = h > 0 ? `(x-${h})` : `(x+${Math.abs(h)})`;
        const kStr  = k >= 0 ? `+${k}` : `${k}`;
        const inner0 = h > 0 ? `(0-${h})` : `(0+${Math.abs(h)})`;
        return {
          latex:  `f(x)=${inner}^2${kStr}.\\quad\\text{Find the y-intercept.}`,
          answer: [String(yInt)],
          hint:   'What is true about the x-value at every y-intercept?',
          step:   `f(0)=${inner0}^2${kStr}=${h*h}${kStr}=${yInt}`
        };
      }

      // gen6: standard form → vertex x-coordinate (b even)
      function gen6() {
        const bHalf = rInt(4) + 1;
        const b     = choose([-1, 1]) * 2 * bHalf;
        const c     = rInt(5) + 1;
        const vx    = -b / 2;
        const bStr  = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `f(x)=x^2${bStr}x+${c}.\\quad\\text{Find the x-coordinate of the vertex.}`,
          answer: [String(vx)],
          hint:   'What formula gives the x-coordinate of the vertex of a parabola?',
          step:   `h=-\\frac{${b}}{2}=${vx}`
        };
      }

      // gen7: standard form → vertex y-coordinate (b even, c chosen so answer is clean)
      function gen7() {
        const bHalf = rInt(3) + 1;
        const b     = choose([-1, 1]) * 2 * bHalf;
        const vx    = -b / 2;
        const vy    = rInt(5) - 2;
        const c     = vy + bHalf * bHalf;   // vy = c − bHalf² → c = vy + bHalf²
        const bStr  = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr  = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `f(x)=x^2${bStr}x${cStr}.\\quad\\text{Find the y-coordinate of the vertex.}`,
          answer: [String(vy)],
          hint:   'What two coordinates define the vertex?',
          step:   `h=${vx},\\quad k=f(${vx})=${vy}`
        };
      }

      // gen8: max or min?
      function gen8() {
        const a    = choose([-3, -2, -1, 1, 2, 3]);
        const b    = choose([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c    = choose([-3, -2, -1, 1, 2, 3]);
        const ans  = a > 0 ? 'min' : 'max';
        const bStr = b < 0 ? `- ${Math.abs(b)}x` : `+ ${b}x`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `f(x)=${a}x^2${bStr}${cStr}.\\quad\\text{Does the vertex give a max or min?}`,
          answer: [ans],
          hint:   'What does the sign of the leading coefficient tell you about which way the parabola opens?',
          step:   `a=${a}\\;${a>0?'>':'<'}\\;0\\quad\\Rightarrow\\quad\\text{opens ${a>0?'up':'down'}}\\Rightarrow\\text{${ans}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_3: Completing the Square
  CA_SPIRAL["CA_4_3"] = {
    title: "Completing the Square",
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

      // gen1: x² = k² → positive root
      function gen1() {
        const k = rInt(5) + 2;
        return {
          latex:  `x^2=${k*k}.\\quad\\text{Find the positive solution.}`,
          answer: [String(k)],
          hint:   'What operation is the inverse of squaring?',
          step:   `x=\\pm${k}\\quad\\text{positive solution: }${k}`
        };
      }

      // gen2: (x - h)² = k² → larger root = h + k
      function gen2() {
        const h = rInt(5) + 1, k = rInt(4) + 1;
        return {
          latex:  `(x-${h})^2=${k*k}.\\quad\\text{Find the larger root.}`,
          answer: [String(h + k)],
          hint:   'What operation reverses squaring a binomial?',
          step:   `x-${h}=\\pm${k}\\Rightarrow x=${h+k}\\text{ or }x=${h-k}`
        };
      }

      // gen3: (x + h)² = k² → smaller root = −h − k
      function gen3() {
        const h = rInt(4) + 1, k = rInt(4) + 1;
        return {
          latex:  `(x+${h})^2=${k*k}.\\quad\\text{Find the smaller root.}`,
          answer: [String(-h - k)],
          hint:   'What operation reverses squaring a binomial?',
          step:   `x+${h}=\\pm${k}\\Rightarrow x=${-h+k}\\text{ or }x=${-h-k}`
        };
      }

      // gen4: what value completes the square? (b/2)²  — b even
      function gen4() {
        const half = rInt(4) + 1;
        const b    = 2 * half * choose([-1, 1]);
        const term = half * half;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `\\text{What value completes the square for }x^2${bStr}x\\,+\\,?`,
          answer: [String(term)],
          hint:   'What value involving the x-coefficient transforms x² + bx into a perfect square trinomial?',
          step:   `\\left(\\frac{${b}}{2}\\right)^2=${half}^2=${term}`
        };
      }

      // gen5: (x - h)² = 0 → double root = h
      function gen5() {
        const h = rInt(6) + 1;
        return {
          latex:  `(x-${h})^2=0.\\quad\\text{Find the solution.}`,
          answer: [String(h)],
          hint:   'If (expression)² = 0, how many values of x satisfy that?',
          step:   `x-${h}=0\\Rightarrow x=${h}\\text{ (double root)}`
        };
      }

      // gen6: (x + h)² = k² → larger root = −h + k
      function gen6() {
        const h = rInt(3) + 1, k = rInt(4) + h + 1;  // k > h so larger root is positive
        return {
          latex:  `(x+${h})^2=${k*k}.\\quad\\text{Find the larger root.}`,
          answer: [String(-h + k)],
          hint:   'What operation reverses squaring a binomial?',
          step:   `x+${h}=\\pm${k}\\Rightarrow x=${-h+k}\\text{ or }x=${-h-k}`
        };
      }

      // gen7: x² + bx = c → what is the RHS after completing the square?
      function gen7() {
        const half = rInt(3) + 1;
        const b    = 2 * half * choose([-1, 1]);
        const c    = rInt(5) + 1;
        const rhs  = c + half * half;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `x^2${bStr}x=${c}.\\quad\\text{After completing the square, the right side becomes?}`,
          answer: [String(rhs)],
          hint:   'What does the completing-the-square identity say about x² + bx?',
          step:   `x^2${bStr}x+${half*half}=${c}+${half*half}=${rhs}`
        };
      }

      // gen8: solve by completing the square → find larger root (integer roots design)
      function gen8() {
        const r1 = rInt(4) + 1, r2 = -(rInt(3) + 1);  // r1 positive, r2 negative
        const b  = -(r1 + r2), c = r1 * r2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Solve by completing the square. Find the larger root.}`,
          answer: [String(r1)],
          hint:   'After applying the identity, what form does the left side take?',
          step:   `\\text{Roots: }${r1}\\text{ and }${r2};\\quad\\text{larger}=${r1}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_4: The Quadratic Formula
  CA_SPIRAL["CA_4_4"] = {
    title: "The Quadratic Formula",
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

      // gen1: compute discriminant D = b²−4ac  (a=1 for simplicity)
      function gen1() {
        const b = rInt(7) - 3, c = rInt(7) - 3;
        const adjB = b === 0 ? 2 : b, adjC = c === 0 ? 1 : c;
        const D = adjB*adjB - 4*adjC;
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        const cStr = adjC < 0 ? `- ${Math.abs(adjC)}` : `+ ${adjC}`;
        return {
          latex:  `f(x)=x^2${bStr}x${cStr}.\\quad\\text{Find the discriminant.}`,
          answer: [String(D)],
          hint:   'Which expression inside the quadratic formula — computed before any square root — determines the nature of the roots?',
          step:   `D=${adjB}^2-4(1)(${adjC})=${adjB*adjB}-${4*adjC}=${D}`
        };
      }

      // gen2: D > 0 → how many real solutions? "two"
      function gen2() {
        const r1 = rInt(4) + 1, r2 = -(rInt(3) + 1);
        const b = -(r1+r2), c = r1*r2;  // D = (r1-r2)² > 0 always when r1≠r2
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        const D = b*b - 4*c;
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{How many real solutions? Enter one, two, or none.}`,
          answer: ['two'],
          hint:   'What does the sign of b² − 4ac tell you about the number of real solutions?',
          step:   `D=${D}>0\\quad\\Rightarrow\\quad\\text{two real solutions}`
        };
      }

      // gen3: D = 0 → "one" solution
      function gen3() {
        const h = rInt(5) + 2;          // x² − 2hx + h² = (x−h)², D=0
        const b = -2*h, c = h*h;
        return {
          latex:  `x^2-${2*h}x+${h*h}=0.\\quad\\text{How many real solutions?}`,
          answer: ['one'],
          hint:   'What does a discriminant of exactly zero tell you about the ± in the formula?',
          step:   `D=(${b})^2-4(${c})=${b*b}-${4*c}=0\\quad\\Rightarrow\\quad\\text{one solution}`
        };
      }

      // gen4: D < 0 → "none"
      function gen4() {
        // x² + bx + c where c > b²/4  (always no real roots)
        const b = rInt(4) - 2;
        const minC = Math.floor(b*b/4) + 2;  // ensure D < 0
        const c = minC + rInt(3);
        const D = b*b - 4*c;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : (b === 0 ? '' : `+ ${b}`);
        const xTerm = b === 0 ? '' : `${bStr}x`;
        return {
          latex:  `x^2${xTerm}+${c}=0.\\quad\\text{How many real solutions?}`,
          answer: ['none'],
          hint:   'What does a negative value under the square root mean for real solutions?',
          step:   `D=${b*b}-${4*c}=${D}<0\\quad\\Rightarrow\\quad\\text{no real solutions}`
        };
      }

      // gen5: use quadratic formula → larger root (integer roots)
      function gen5() {
        const r1 = rInt(4) + 2, r2 = -(rInt(3) + 1);
        const b = -(r1+r2), c = r1*r2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        const sqrtD = Math.abs(r1 - r2);
        return {
          latex:  `x^2${bStr}x${cStr}=0.\\quad\\text{Use the quadratic formula. Find the larger root.}`,
          answer: [String(r1)],
          hint:   'Which part of the quadratic formula controls the size of each solution?',
          step:   `x=\\frac{${-b}\\pm${sqrtD}}{2}\\Rightarrow x=${r1}\\text{ or }x=${r2}`
        };
      }

      // gen6: use quadratic formula → smaller root (integer roots)
      function gen6() {
        const r1 = rInt(4) + 1, r2 = rInt(3) + r1 + 1;  // both positive, r2 > r1
        const b = -(r1+r2), c = r1*r2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const sqrtD = r2 - r1;
        return {
          latex:  `x^2${bStr}x+${c}=0.\\quad\\text{Use the quadratic formula. Find the smaller root.}`,
          answer: [String(r1)],
          hint:   'The formula gives two results. Which branch of ± produces the smaller one?',
          step:   `x=\\frac{${-b}\\pm${sqrtD}}{2}\\Rightarrow x=${r2}\\text{ or }x=${r1}`
        };
      }

      // gen7: double root (D=0) → find the one solution = h
      function gen7() {
        const h = rInt(6) + 1;
        const b = -2*h, c = h*h;
        return {
          latex:  `x^2-${2*h}x+${h*h}=0.\\quad\\text{Find the solution (double root).}`,
          answer: [String(h)],
          hint:   'When the discriminant equals zero, what happens to the ± in the formula?',
          step:   `x=\\frac{${2*h}\\pm 0}{2}=${h}`
        };
      }

      // gen8: compute discriminant with a ≠ 1
      function gen8() {
        const a = rInt(2) + 2;   // a ∈ {2, 3}
        const b = rInt(6) - 3;
        const adjB = b === 0 ? 2 : b;
        const c = rInt(4) + 1;
        const D = adjB*adjB - 4*a*c;
        const bStr = adjB < 0 ? `- ${Math.abs(adjB)}` : `+ ${adjB}`;
        return {
          latex:  `f(x)=${a}x^2${bStr}x+${c}.\\quad\\text{Find the discriminant.}`,
          answer: [String(D)],
          hint:   'How does a leading coefficient other than 1 affect the 4ac term?',
          step:   `D=${adjB}^2-4(${a})(${c})=${adjB*adjB}-${4*a*c}=${D}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_4_5: Quadratic Inequalities
  CA_SPIRAL["CA_4_5"] = {
    title: "Quadratic Inequalities",
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

      // gen1: f(x) = (x-r1)(x-r2) < 0 (opens up) — find larger boundary root
      function gen1() {
        const r1 = rInt(4) + 1, r2 = r1 + rInt(3) + 1;
        return {
          latex:  `(x-${r1})(x-${r2})<0.\\quad\\text{Find the larger boundary value.}`,
          answer: [String(r2)],
          hint:   'A parabola can only change sign at its zeros — what are they?',
          step:   `\\text{Zeros at }x=${r1}\\text{ and }x=${r2};\\quad\\text{larger boundary: }${r2}`
        };
      }

      // gen2: is x = c a solution to (x-r1)(x-r2) < 0?
      function gen2() {
        const r1 = rInt(3) + 1, r2 = r1 + rInt(3) + 2;
        const inside = rInt(2) === 0;
        const c = inside
          ? r1 + rInt(r2 - r1 - 1) + 1   // strictly between
          : r2 + rInt(3) + 1;             // outside (above r2)
        const val = (c - r1) * (c - r2);
        const ans = val < 0 ? 'yes' : 'no';
        return {
          latex:  `(x-${r1})(x-${r2})<0.\\quad\\text{Is }x=${c}\\text{ a solution?}`,
          answer: [ans],
          hint:   'What does it mean for a value to be a solution to an inequality?',
          step:   `(${c}-${r1})(${c}-${r2})=${c-r1}\\cdot${c-r2}=${val}\\;${val<0?'<':'>'}\\;0\\quad\\text{→ ${ans}}`
        };
      }

      // gen3: (x-r1)(x-r2) > 0 — find smaller boundary (outside roots, opens up)
      function gen3() {
        const r1 = -(rInt(3) + 1), r2 = rInt(3) + 1;
        return {
          latex:  `(x-${r1})(x-${r2})>0.\\quad\\text{Find the smaller boundary value.}`,
          answer: [String(r1)],
          hint:   'For a parabola opening upward, where is it positive relative to its zeros?',
          step:   `\\text{Zeros at }x=${r1}\\text{ and }x=${r2};\\quad\\text{smaller boundary: }${r1}`
        };
      }

      // gen4: x² + bx + c < 0 (opens up, integer roots) — find left boundary
      function gen4() {
        const r1 = rInt(3) + 1, r2 = r1 + rInt(3) + 1;
        const b = -(r1 + r2), c = r1 * r2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return {
          latex:  `x^2${bStr}x+${c}<0.\\quad\\text{Find the left boundary of the solution interval.}`,
          answer: [String(r1)],
          hint:   'For a parabola opening upward, where is it negative relative to its zeros?',
          step:   `(x-${r1})(x-${r2})<0\\Rightarrow\\text{solution: }(${r1},${r2});\\quad\\text{left boundary: }${r1}`
        };
      }

      // gen5: sign at a test value — positive or negative?
      function gen5() {
        const r1 = rInt(3) + 1, r2 = r1 + rInt(3) + 2;
        const c  = r1 + rInt(r2 - r1 - 1) + 1;   // strictly between roots
        const val = (c - r1) * (c - r2);
        return {
          latex:  `f(x)=(x-${r1})(x-${r2}).\\quad\\text{Is }f(${c})\\text{ positive or negative?}`,
          answer: ['negative'],
          hint:   'Is the test point inside or outside the roots?',
          step:   `f(${c})=(${c-r1})(${c-r2})=${val}<0\\quad\\text{→ negative}`
        };
      }

      // gen6: test value outside the roots — positive or negative?
      function gen6() {
        const r1 = rInt(3) + 1, r2 = r1 + rInt(3) + 2;
        const c  = r2 + rInt(3) + 1;   // outside, above r2
        const val = (c - r1) * (c - r2);
        return {
          latex:  `f(x)=(x-${r1})(x-${r2}).\\quad\\text{Is }f(${c})\\text{ positive or negative?}`,
          answer: ['positive'],
          hint:   'Is the test point inside or outside the roots?',
          step:   `f(${c})=(${c-r1})(${c-r2})=${val}>0\\quad\\text{→ positive}`
        };
      }

      // gen7: x² + bx + c > 0 (opens up) — find right boundary
      function gen7() {
        const r1 = -(rInt(2) + 1), r2 = rInt(3) + 1;
        const b = -(r1 + r2), c = r1 * r2;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const cStr = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
        return {
          latex:  `x^2${bStr}x${cStr}>0.\\quad\\text{Find the right boundary of the solution.}`,
          answer: [String(r2)],
          hint:   'For a parabola opening upward, which region satisfies > 0?',
          step:   `(x-${r1})(x-${r2})>0\\Rightarrow\\text{solution: }(-\\infty,${r1})\\cup(${r2},\\infty);\\quad\\text{right boundary: }${r2}`
        };
      }

      // gen8: is x = c a solution to f(x) ≥ 0? (boundary point, always yes)
      function gen8() {
        const r1 = rInt(3) + 1, r2 = r1 + rInt(3) + 2;
        const c  = choose([r1, r2]);   // boundary point itself
        return {
          latex:  `(x-${r1})(x-${r2})\\geq 0.\\quad\\text{Is }x=${c}\\text{ a solution?}`,
          answer: ['yes'],
          hint:   'Does a non-strict inequality include its boundary points?',
          step:   `f(${c})=(${c}-${r1})(${c}-${r2})=0\\geq 0\\quad\\text{→ yes (boundary included)}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_5_1: Complex Numbers
  CA_SPIRAL["CA_5_1"] = {
    title: "Complex Numbers",
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

      // gen1: √(-k²) → coefficient of i
      function gen1() {
        const k = rInt(8) + 2;
        return {
          latex:  `\\sqrt{-${k*k}}.\\quad\\text{Simplify. What is the coefficient of }i?`,
          answer: [String(k)],
          hint:   'What does the imaginary unit i equal?',
          step:   `\\sqrt{-${k*k}}=\\sqrt{${k*k}}\\cdot i=${k}i`
        };
      }

      // gen2: i² = ?
      function gen2() {
        return {
          latex:  `i^2 = \\,?`,
          answer: ['-1'],
          hint:   'What is the definition of i²?',
          step:   `i^2=-1\\text{ (by definition)}`
        };
      }

      // gen3: i⁴ = ?
      function gen3() {
        return {
          latex:  `i^4 = \\,?`,
          answer: ['1'],
          hint:   'Can i⁴ be written as a power of i²?',
          step:   `i^4=(i^2)^2=(-1)^2=1`
        };
      }

      // gen4: x² + k² = 0 → imaginary coefficient k
      function gen4() {
        const k = rInt(7) + 2;
        return {
          latex:  `x^2+${k*k}=0.\\quad\\text{Find the positive imaginary solution's coefficient of }i.`,
          answer: [String(k)],
          hint:   'What type of number results from the square root of a negative?',
          step:   `x^2=-${k*k}\\Rightarrow x=\\pm\\sqrt{-${k*k}}=\\pm${k}i`
        };
      }

      // gen5: (a+bi)+(c+di) → real part
      function gen5() {
        const a = rInt(8) - 3, b = rInt(6) + 1;
        const c = rInt(8) - 3, d = rInt(6) + 1;
        const bStr = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        const dStr = d < 0 ? `- ${Math.abs(d)}` : `+ ${d}`;
        const aStr = a < 0 ? `(${a}` : `(${a}`;
        return {
          latex:  `(${a}+${b}i)+(${c}+${d}i).\\quad\\text{Find the real part of the sum.}`,
          answer: [String(a + c)],
          hint:   'Which parts of a complex number combine with which?',
          step:   `\\text{Real: }${a}+${c}=${a+c}`
        };
      }

      // gen6: (a+bi)-(c+di) → imaginary coefficient
      function gen6() {
        const a = rInt(6) + 2, b = rInt(6) + 2;
        const c = rInt(4) + 1, d = rInt(4) + 1;
        return {
          latex:  `(${a}+${b}i)-(${c}+${d}i).\\quad\\text{Find the imaginary coefficient.}`,
          answer: [String(b - d)],
          hint:   'When subtracting complex numbers, what happens to every term in the second number?',
          step:   `\\text{Imaginary: }${b}-${d}=${b-d}`
        };
      }

      // gen7: quadratic with D<0 → real part of solutions (b even, a=1)
      function gen7() {
        const h = rInt(5) + 1;          // real part = -h
        const k = rInt(4) + 1;          // imaginary coeff = k
        // x² + 2hx + (h²+k²) = 0  →  solutions: -h ± ki
        const b2 = 2 * h, c = h*h + k*k;
        return {
          latex:  `x^2+${b2}x+${c}=0.\\quad\\text{Find the real part of the solutions.}`,
          answer: [String(-h)],
          hint:   'In a complex number a + bi, which part is the real part?',
          step:   `D=${b2*b2}-4(${c})=${b2*b2-4*c}<0;\\quad x=\\frac{-${b2}\\pm${2*k}i}{2}=${-h}\\pm${k}i`
        };
      }

      // gen8: which power of i equals -i? (i³)
      function gen8() {
        const n = choose([3, 7, 11]);   // all ≡ 3 mod 4
        return {
          latex:  `i^{${n}} = \\,?\\quad\\text{Enter the integer coefficient (the number in front of }i\\text{).}`,
          answer: ['-1'],
          hint:   'At what period do the powers of i repeat?',
          step:   `${n}\\bmod 4=3\\Rightarrow i^{${n}}=i^3=-i;\\quad\\text{coefficient: }-1`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_5_2: Multiplying and Dividing Complex Numbers
  CA_SPIRAL["CA_5_2"] = {
    title: "Multiplying and Dividing Complex Numbers",
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

      // gen1: (a+bi)(c+di) → real part ac−bd
      function gen1() {
        const a = rInt(4)+1, b = rInt(4)+1, c = rInt(4)+1, d = rInt(4)+1;
        const real = a*c - b*d;
        return {
          latex:  `(${a}+${b}i)(${c}+${d}i).\\quad\\text{Find the real part of the product.}`,
          answer: [String(real)],
          hint:   'Which FOIL products combine to give the real part after replacing i²?',
          step:   `\\text{F}+\\text{L: }${a*c}+${b*d}(-1)=${real}`
        };
      }

      // gen2: (a+bi)(c+di) → imaginary coefficient ad+bc
      function gen2() {
        const a = rInt(4)+1, b = rInt(4)+1, c = rInt(4)+1, d = rInt(4)+1;
        const imag = a*d + b*c;
        return {
          latex:  `(${a}+${b}i)(${c}+${d}i).\\quad\\text{Find the imaginary coefficient.}`,
          answer: [String(imag)],
          hint:   'Which FOIL products combine to give the imaginary part?',
          step:   `\\text{O}+\\text{I: }${a*d}i+${b*c}i=${imag}i`
        };
      }

      // gen3: conjugate of a+bi — what is the imaginary part of the conjugate?
      function gen3() {
        const a = rInt(6)+1, b = rInt(6)+1;
        return {
          latex:  `\\text{What is the imaginary coefficient of the conjugate of }${a}+${b}i\\,?`,
          answer: [String(-b)],
          hint:   'How does a conjugate differ from the original complex number?',
          step:   `\\text{Conjugate of }${a}+${b}i\\text{ is }${a}-${b}i;\\quad\\text{imaginary coefficient: }-${b}`
        };
      }

      // gen4: (a+bi)(a−bi) = a²+b² — find the real product
      function gen4() {
        const a = rInt(5)+1, b = rInt(5)+1;
        return {
          latex:  `(${a}+${b}i)(${a}-${b}i).\\quad\\text{Find the product.}`,
          answer: [String(a*a + b*b)],
          hint:   'Does this pair fit the conjugate product pattern?',
          step:   `${a}^2+${b}^2=${a*a}+${b*b}=${a*a+b*b}`
        };
      }

      // gen5: (a+bi)² → real part a²−b²
      function gen5() {
        const a = rInt(4)+2, b = rInt(4)+1;
        const real = a*a - b*b;
        return {
          latex:  `(${a}+${b}i)^2.\\quad\\text{Find the real part.}`,
          answer: [String(real)],
          hint:   'What does squaring a binomial look like when the second term involves i?',
          step:   `(${a})^2+(${b}i)^2=${a*a}+${b*b}(-1)=${real}`
        };
      }

      // gen6: (a+bi)² → imaginary coefficient 2ab
      function gen6() {
        const a = rInt(4)+1, b = rInt(4)+1;
        const imag = 2*a*b;
        return {
          latex:  `(${a}+${b}i)^2.\\quad\\text{Find the imaginary coefficient.}`,
          answer: [String(imag)],
          hint:   'Which term in the FOIL expansion of a square produces the imaginary part?',
          step:   `2\\cdot${a}\\cdot${b}i=${imag}i`
        };
      }

      // gen7: division (p+qi)/(a+bi) → real part of result (designed for integer output)
      function gen7() {
        const a = rInt(3)+1, b = rInt(3)+1;   // denominator
        const m = rInt(4)+1, n = rInt(4)-2;   // intended result m+ni
        const p = m*a - n*b, q = m*b + n*a;   // numerator = (m+ni)(a+bi)
        const denom = a*a + b*b;
        return {
          latex:  `\\frac{${p}+${q}i}{${a}+${b}i}.\\quad\\text{Find the real part of the quotient.}`,
          answer: [String(m)],
          hint:   'What do you multiply by to clear i from the denominator?',
          step:   `\\text{Multiply by }\\frac{${a}-${b}i}{${a}-${b}i};\\quad\\text{real part: }${m}`
        };
      }

      // gen8: division (p+qi)/(a+bi) → imaginary coefficient of result
      function gen8() {
        const a = rInt(3)+1, b = rInt(3)+1;
        const m = rInt(4)+1, n = rInt(3)+1;
        const p = m*a - n*b, q = m*b + n*a;
        return {
          latex:  `\\frac{${p}+${q}i}{${a}+${b}i}.\\quad\\text{Find the imaginary coefficient of the quotient.}`,
          answer: [String(n)],
          hint:   'What is the conjugate of the denominator, and what does multiplying by it accomplish?',
          step:   `\\text{Multiply by }\\frac{${a}-${b}i}{${a}-${b}i};\\quad\\text{imaginary coefficient: }${n}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_6_1: Exponent Rules
  CA_SPIRAL["CA_6_1"] = {
    title: "Exponent Rules",
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

      // gen1: product rule — find the resulting exponent
      function gen1() {
        const x = rInt(7) + 2, y = rInt(7) + 2;
        return {
          latex:  `x^{${x}} \\cdot x^{${y}}.\\quad\\text{Find the resulting exponent.}`,
          answer: [String(x + y)],
          hint:   'What does the product rule say about exponents with the same base?',
          step:   `x^{${x}+${y}}=x^{${x+y}}`
        };
      }

      // gen2: quotient rule — find the resulting exponent
      function gen2() {
        const y = rInt(5) + 1, diff = rInt(6) + 1;
        const x = y + diff;
        return {
          latex:  `\\frac{x^{${x}}}{x^{${y}}}.\\quad\\text{Find the resulting exponent.}`,
          answer: [String(diff)],
          hint:   'What does the quotient rule say about dividing powers with the same base?',
          step:   `x^{${x}-${y}}=x^{${diff}}`
        };
      }

      // gen3: power of a power — find the resulting exponent
      function gen3() {
        const x = rInt(5) + 2, y = rInt(4) + 2;
        return {
          latex:  `(x^{${x}})^{${y}}.\\quad\\text{Find the resulting exponent.}`,
          answer: [String(x * y)],
          hint:   'What does the power-of-a-power rule say?',
          step:   `x^{${x}\\cdot${y}}=x^{${x*y}}`
        };
      }

      // gen4: evaluate 2^n
      function gen4() {
        const n = rInt(5) + 2;
        const val = Math.pow(2, n);
        return {
          latex:  `2^{${n}} = \\,?`,
          answer: [String(val)],
          hint:   'What does an exponent mean in terms of repeated multiplication?',
          step:   `2^{${n}}=${val}`
        };
      }

      // gen5: fractional exponent — perfect cube root
      function gen5() {
        const r = rInt(4) + 2;   // root value 2–5
        const base = r * r * r;
        return {
          latex:  `${base}^{1/3}.\\quad\\text{Evaluate.}`,
          answer: [String(r)],
          hint:   'What does an exponent of 1/3 mean in terms of roots?',
          step:   `\\sqrt[3]{${base}}=${r}`
        };
      }

      // gen6: fractional exponent a^(m/n) — (sqrt or cbrt)^m
      function gen6() {
        const r = rInt(3) + 2;        // root value 2–4
        const m = rInt(3) + 2;        // power 2–4
        const base = r * r;           // perfect square
        const val  = Math.pow(r, m);
        return {
          latex:  `${base}^{${m}/2}.\\quad\\text{Evaluate.}`,
          answer: [String(val)],
          hint:   'In a fractional exponent m/n, what role does the denominator play?',
          step:   `(\\sqrt{${base}})^{${m}}=${r}^{${m}}=${val}`
        };
      }

      // gen7: negative exponent — find the resulting integer exponent after combining
      function gen7() {
        const a = rInt(5) + 2, b = rInt(5) + 2;   // x^a / x^b where b > a
        const exp = a - (a + b);                   // = -b  (negative result)
        const top = a, bot = a + b;
        return {
          latex:  `\\frac{x^{${top}}}{x^{${bot}}}.\\quad\\text{Find the resulting exponent.}`,
          answer: [String(top - bot)],
          hint:   'What does a negative result from the quotient rule mean for the base?',
          step:   `x^{${top}-${bot}}=x^{${top-bot}}`
        };
      }

      // gen8: combine product and quotient — find net exponent
      function gen8() {
        const a = rInt(4)+2, b = rInt(4)+2, c = rInt(3)+1;
        const net = a + b - c;
        return {
          latex:  `\\frac{x^{${a}}\\cdot x^{${b}}}{x^{${c}}}.\\quad\\text{Find the resulting exponent.}`,
          answer: [String(net)],
          hint:   'Can the product and quotient rules be combined in one expression?',
          step:   `x^{${a}+${b}-${c}}=x^{${net}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_6_2: Simplifying Radicals
  CA_SPIRAL["CA_6_2"] = {
    title: "Simplifying Radicals",
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

      // gen1: √(k²) = k  — find integer value
      function gen1() {
        const k = rInt(8) + 2;
        return {
          latex:  `\\sqrt{${k*k}}.\\quad\\text{Evaluate.}`,
          answer: [String(k)],
          hint:   'Can the number under the radical be written as a perfect square?',
          step:   `\\sqrt{${k}^2}=${k}`
        };
      }

      // gen2: √(x^(2n)) = x^n — find the exponent
      function gen2() {
        const n = rInt(5) + 2;
        return {
          latex:  `\\sqrt{x^{${2*n}}}.\\quad\\text{Find the exponent of }x\\text{ in the simplified form.}`,
          answer: [String(n)],
          hint:   'How does the exponent rule for fractional powers relate to a square root?',
          step:   `x^{${2*n}\\cdot\\frac{1}{2}}=x^{${n}}`
        };
      }

      // gen3: √(a²·k) → coefficient a
      function gen3() {
        const a = rInt(6) + 2;
        const k = choose([2, 3, 5, 6, 7]);   // non-perfect-square remainders
        return {
          latex:  `\\sqrt{${a*a}\\cdot${k}}.\\quad\\text{Find the integer that comes out of the radical.}`,
          answer: [String(a)],
          hint:   'Which factor inside the radical is a perfect square?',
          step:   `\\sqrt{${a}^2}\\cdot\\sqrt{${k}}=${a}\\sqrt{${k}}`
        };
      }

      // gen4: ³√(k³) = k — evaluate
      function gen4() {
        const k = rInt(5) + 2;
        return {
          latex:  `\\sqrt[3]{${k*k*k}}.\\quad\\text{Evaluate.}`,
          answer: [String(k)],
          hint:   'Can the number under the radical be written as a perfect cube?',
          step:   `\\sqrt[3]{${k}^3}=${k}`
        };
      }

      // gen5: √(x^(2n)) expressed as fractional exponent — find exponent (same as gen2 variant)
      function gen5() {
        const n = rInt(4) + 3;   // n = 3..6, so power = 6..12
        return {
          latex:  `\\sqrt[3]{x^{${3*n}}}.\\quad\\text{Find the exponent of }x.`,
          answer: [String(n)],
          hint:   'What does the denominator of a fractional exponent represent?',
          step:   `x^{${3*n}\\cdot\\frac{1}{3}}=x^{${n}}`
        };
      }

      // gen6: √(a²·b²) = ab — evaluate with numbers
      function gen6() {
        const a = rInt(5) + 2, b = rInt(4) + 2;
        return {
          latex:  `\\sqrt{${a*a}\\cdot${b*b}}.\\quad\\text{Evaluate.}`,
          answer: [String(a * b)],
          hint:   'Does the product rule for radicals let you split this into two separate roots?',
          step:   `\\sqrt{${a*a}}\\cdot\\sqrt{${b*b}}=${a}\\cdot${b}=${a*b}`
        };
      }

      // gen7: coefficient when simplifying √(n²·k·x²) — numeric coefficient only
      function gen7() {
        const a = rInt(5) + 2;
        const k = choose([2, 3, 5, 7]);
        return {
          latex:  `\\sqrt{${a*a*k}x^2}.\\quad\\text{What integer coefficient comes out of the radical?}`,
          answer: [String(a)],
          hint:   'Which part of the radicand is a perfect square that can be factored out?',
          step:   `\\sqrt{${a}^2\\cdot${k}}\\cdot\\sqrt{x^2}=${a}x\\sqrt{${k}};\\quad\\text{integer: }${a}`
        };
      }

      // gen8: x^n = (√x)^m — find m given n and the root
      function gen8() {
        const root = choose([2, 3]);
        const exp  = (rInt(4) + 2) * root;   // multiple of root so result is integer
        const result = exp / root;
        const rootLabel = root === 2 ? '\\sqrt' : '\\sqrt[3]';
        return {
          latex:  `${rootLabel}{x^{${exp}}}.\\quad\\text{Find the exponent of }x.`,
          answer: [String(result)],
          hint:   'What fractional exponent equals a square or cube root?',
          step:   `x^{${exp}\\cdot\\frac{1}{${root}}}=x^{${result}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_6_3: Exponential Functions
  CA_SPIRAL["CA_6_3"] = {
    title: "Exponential Functions",
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

      // gen1: identify initial value a from y = a·b^x
      function gen1() {
        const a = rInt(8) + 2;
        const b = choose([2, 3, 4, 5]);
        return {
          latex:  `y = ${a} \\cdot ${b}^x.\\quad \\text{What is the initial value?}`,
          answer: [String(a)],
          hint:   'What does the initial value represent in an exponential model?',
          step:   `a = ${a}`
        };
      }

      // gen2: identify base b from y = a·b^x
      function gen2() {
        const a = rInt(7) + 2;
        const b = choose([2, 3, 4, 5, 6]);
        return {
          latex:  `y = ${a} \\cdot ${b}^x.\\quad \\text{What is the base (multiplier)?}`,
          answer: [String(b)],
          hint:   'Which parameter in an exponential model controls the repeated multiplication?',
          step:   `b = ${b}`
        };
      }

      // gen3: evaluate y = a·b^x at small x — integer result
      function gen3() {
        const b = choose([2, 3]);
        const x = rInt(3) + 1;   // x = 1,2,3
        const a = rInt(5) + 1;
        const val = a * Math.pow(b, x);
        return {
          latex:  `y = ${a} \\cdot ${b}^x \\text{ at } x = ${x}.\\quad \\text{Find } y.`,
          answer: [String(val)],
          hint:   'In an exponential model, how do the base and exponent combine to give the output?',
          step:   `y=${a}\\cdot${b}^{${x}}=${a}\\cdot${Math.pow(b,x)}=${val}`
        };
      }

      // gen4: growth or decay — b > 1 or 0 < b < 1
      function gen4() {
        const isGrowth = Math.random() < 0.5;
        const b = isGrowth ? choose([2, 3, 4, 5]) : choose([2, 3, 4]);  // decay uses 1/b display
        const bLabel = isGrowth ? String(b) : `\\tfrac{1}{${b}}`;
        const answer = isGrowth ? 'growth' : 'decay';
        return {
          latex:  `y = a \\cdot \\left(${bLabel}\\right)^x.\\quad \\text{Is this growth or decay?}`,
          answer: [answer],
          hint:   'Does a base greater than 1 make an exponential output grow or shrink?',
          step:   isGrowth ? `b=${b}>1\\Rightarrow\\text{growth}` : `b=\\tfrac{1}{${b}}<1\\Rightarrow\\text{decay}`
        };
      }

      // gen5: doublings — a·2^x at x given, small enough for integer
      function gen5() {
        const a = rInt(5) + 1;
        const x = rInt(3) + 1;
        const val = a * Math.pow(2, x);
        return {
          latex:  `\\text{A quantity starts at ${a} and doubles each step. Find the value after ${x} step(s).}`,
          answer: [String(val)],
          hint:   'What is the base in a model where the quantity doubles each period?',
          step:   `${a}\\cdot2^{${x}}=${a}\\cdot${Math.pow(2,x)}=${val}`
        };
      }

      // gen6: triplings — a·3^x
      function gen6() {
        const a = rInt(4) + 1;
        const x = rInt(2) + 1;   // x = 1 or 2
        const val = a * Math.pow(3, x);
        return {
          latex:  `\\text{A quantity starts at ${a} and triples each step. Find the value after ${x} step(s).}`,
          answer: [String(val)],
          hint:   'What is the base in an exponential model where the quantity triples per period?',
          step:   `${a}\\cdot3^{${x}}=${a}\\cdot${Math.pow(3,x)}=${val}`
        };
      }

      // gen7: halving decay — start at a·2^x power of 2, halve x times
      function gen7() {
        const x = rInt(3) + 1;   // 1,2,3
        const a = Math.pow(2, x) * (rInt(5) + 1);   // ensure integer result
        const val = a / Math.pow(2, x);
        return {
          latex:  `\\text{A quantity starts at ${a} and halves each step. Find the value after ${x} step(s).}`,
          answer: [String(val)],
          hint:   'What fraction represents halving as an exponential base?',
          step:   `${a}\\cdot\\left(\\tfrac{1}{2}\\right)^{${x}}=\\dfrac{${a}}{${Math.pow(2,x)}}=${val}`
        };
      }

      // gen8: y-intercept — what is y when x=0
      function gen8() {
        const a = rInt(9) + 2;
        const b = choose([2, 3, 4, 5]);
        return {
          latex:  `y = ${a} \\cdot ${b}^x.\\quad \\text{What is the value of } y \\text{ when } x = 0?`,
          answer: [String(a)],
          hint:   'What is the value of any non-zero base raised to the power 0?',
          step:   `y=${a}\\cdot${b}^0=${a}\\cdot1=${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_6_4: Graphing Exponential Functions
  CA_SPIRAL["CA_6_4"] = {
    title: "Graphing Exponential Functions",
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

      // gen1: y-intercept of y = a·b^x
      function gen1() {
        const a = rInt(9) + 2;
        const b = choose([2, 3, 4, 5]);
        return {
          latex:  `y = ${a} \\cdot ${b}^x.\\quad \\text{What is the } y\\text{-intercept?}`,
          answer: [String(a)],
          hint:   'What is the y-intercept of an exponential function in terms of its parameters?',
          step:   `x=0:\\;y=${a}\\cdot${b}^0=${a}\\cdot1=${a}`
        };
      }

      // gen2: next-step — multiply current y by b
      function gen2() {
        const b = choose([2, 3, 4]);
        const x0 = rInt(3) + 1;
        const y0 = (rInt(4) + 1) * b;   // y0 divisible by b so y1 is clean
        const y1 = y0 * b;
        return {
          latex:  `y = a\\cdot${b}^x \\text{ passes through }(${x0},\\,${y0}).\\quad \\text{Find }y\\text{ at }x=${x0+1}.`,
          answer: [String(y1)],
          hint:   'In an exponential function, what happens to the output each time the input increases by 1?',
          step:   `${y0}\\cdot${b}=${y1}`
        };
      }

      // gen3: growth or decay — text answer
      function gen3() {
        const isGrowth = Math.random() < 0.5;
        const b = isGrowth ? choose([2, 3, 4, 5]) : choose([2, 3, 4]);
        const bLabel = isGrowth ? String(b) : `\\tfrac{1}{${b}}`;
        const answer = isGrowth ? 'growth' : 'decay';
        return {
          latex:  `y = a \\cdot \\left(${bLabel}\\right)^x.\\quad \\text{Is this growth or decay?}`,
          answer: [answer],
          hint:   'How does the size of the base determine whether an exponential curve rises or falls?',
          step:   isGrowth ? `b=${b}>1\\Rightarrow\\text{growth}` : `b=\\tfrac{1}{${b}}<1\\Rightarrow\\text{decay}`
        };
      }

      // gen4: horizontal asymptote — always 0
      function gen4() {
        const a = rInt(8) + 2;
        const b = choose([2, 3, 5]);
        return {
          latex:  `y = ${a}\\cdot${b}^x.\\quad \\text{What is the horizontal asymptote? (Enter the }y\\text{-value.)}`,
          answer: ['0'],
          hint:   'What is the horizontal asymptote of an exponential function?',
          step:   `y=0\\text{ (the }x\\text{-axis)}`
        };
      }

      // gen5: evaluate at x=0 — confirms y-intercept = a
      function gen5() {
        const a = rInt(8) + 2;
        const b = choose([2, 3, 4]);
        return {
          latex:  `y = ${a}\\cdot${b}^x.\\quad \\text{Find }y\\text{ when }x=0.`,
          answer: [String(a)],
          hint:   'What is the value of any non-zero base raised to the power zero?',
          step:   `y=${a}\\cdot${b}^0=${a}\\cdot1=${a}`
        };
      }

      // gen6: table value — evaluate at x=1,2,3
      function gen6() {
        const a = rInt(5) + 1;
        const b = choose([2, 3]);
        const x = rInt(3) + 1;
        const val = a * Math.pow(b, x);
        return {
          latex:  `y = ${a}\\cdot${b}^x.\\quad \\text{Find }y\\text{ when }x = ${x}.`,
          answer: [String(val)],
          hint:   'What does the exponent in an exponential expression tell you to do with the base?',
          step:   `y=${a}\\cdot${b}^{${x}}=${a}\\cdot${Math.pow(b,x)}=${val}`
        };
      }

      // gen7: find b from two consecutive table values y1 = y0·b
      function gen7() {
        const b = choose([2, 3, 4, 5]);
        const y0 = (rInt(4) + 1);
        const y1 = y0 * b;
        return {
          latex:  `\\text{An exponential function has }y(0)=${y0}\\text{ and }y(1)=${y1}.\\quad\\text{What is the base }b?`,
          answer: [String(b)],
          hint:   'What is the ratio of consecutive outputs in an exponential function?',
          step:   `b=\\frac{${y1}}{${y0}}=${b}`
        };
      }

      // gen8: which is larger for big x — exponential vs linear
      function gen8() {
        const c = rInt(8) + 2;
        const b = choose([2, 3]);
        const x = rInt(3) + 4;   // x = 4..6
        const expVal = Math.pow(b, x);
        const linVal = c * x;
        return {
          latex:  `\\text{At }x=${x},\\text{ which is larger: }${b}^x\\text{ or }${c}x?`,
          answer: [String(b) + '^x'],
          hint:   'How does exponential growth compare to linear growth for large inputs?',
          step:   `${b}^{${x}}=${expVal},\\quad ${c}\\cdot${x}=${linVal};\\quad ${expVal}>$${linVal}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_1: Sets and Notation
  CA_SPIRAL["CA_S_1"] = {
    title: "Sets and Notation",
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

      function fact(n) { let v=1; for(let i=2;i<=n;i++) v*=i; return v; }
      function C(n,r) {
        if(r<0||r>n) return 0;
        let v=1; for(let i=0;i<r;i++) v*=(n-i); return Math.round(v/fact(r));
      }

      // gen1: ordered partition into 2 labeled groups → C(n, k)
      function gen1() {
        const k = rInt(3)+2;           // k = 2..4
        const rest = rInt(3)+k+1;      // ensure rest > k
        const n = k + rest;
        const val = C(n, k);
        const dest1 = choose(['Washington DC','Chicago','the museum','the lab','Team A']);
        const dest2 = dest1 === 'Team A' ? 'Team B' : 'home';
        return {
          latex:  `${n}\\text{ people split into a group of }${k}\\text{ (${dest1}) and }${rest}\\text{ (${dest2}). How many ways?}`,
          answer: [String(val)],
          hint:   'When groups have distinct labels, which formula counts ways to assign people to one specific group?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen2: ordered partition into 3 labeled groups → C(n,a)×C(n-a,b)
      function gen2() {
        const a = rInt(2)+2, b = rInt(2)+2;   // a,b = 2..3
        const c = rInt(2)+1;                   // c = 1..2
        const n = a+b+c;
        const val = C(n,a)*C(n-a,b);          // ×C(c,c)=1
        return {
          latex:  `${n}\\text{ people → Team A (}${a}\\text{), Team B (}${b}\\text{), Team C (}${c}\\text{). How many ways?}`,
          answer: [String(val)],
          hint:   'For labeled groups, how do you count the ways to fill each group in sequence?',
          step:   `C(${n},${a})\\times C(${n-a},${b})=${C(n,a)}\\times${C(n-a,b)}=${val}`
        };
      }

      // gen3: unordered partition into 2 equal groups → C(n, n/2) / 2
      function gen3() {
        const r = rInt(3)+2;    // group size r = 2..4
        const n = 2*r;
        const val = C(n,r)/2;
        return {
          latex:  `${n}\\text{ people split into 2 unlabeled groups of }${r}. \\text{ How many ways?}`,
          answer: [String(val)],
          hint:   'When two groups are interchangeable, how does that change the count compared to labeled groups?',
          step:   `\\dfrac{C(${n},${r})}{2!}=\\dfrac{${C(n,r)}}{2}=${val}`
        };
      }

      // gen4: ordered vs unordered — text answer
      function gen4() {
        const labeled = Math.random() < 0.5;
        const scenario = labeled
          ? choose(['splitting into a red team and a blue team',
                    'assigning people to Group A and Group B',
                    'splitting into a morning shift and an evening shift'])
          : choose(['splitting into two equal teams for a game',
                    'dividing into two study groups with no labels',
                    'forming two anonymous committees']);
        return {
          latex:  `\\text{Is "${scenario}" an ordered or unordered partition?}`,
          answer: [labeled ? 'ordered' : 'unordered'],
          hint:   'Do the groups have distinct identities, or are they interchangeable?',
          step:   labeled ? `\\text{Groups are labeled}\\Rightarrow\\text{ordered}`
                          : `\\text{Groups are interchangeable}\\Rightarrow\\text{unordered}`
        };
      }

      // gen5: C(n, k) — first factor in an ordered 2-group partition
      function gen5() {
        const k = rInt(3)+2, rest = rInt(3)+k;
        const n = k+rest;
        const val = C(n,k);
        return {
          latex:  `\\text{${n} people split into labeled groups of ${k} and ${rest}. What is the number of ways?}`,
          answer: [String(val)],
          hint:   'For two labeled groups, how many ways can you choose who goes in the smaller group?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen6: unordered — 3 equal groups of 2 → C(6,2)×C(4,2)/3!
      function gen6() {
        const n = 6, r = 2, m = 3;
        const ordered = C(6,2)*C(4,2)*C(2,2);
        const val = ordered/fact(m);
        return {
          latex:  `6\\text{ people split into 3 unlabeled pairs. How many ways?}`,
          answer: [String(val)],
          hint:   'After counting ordered arrangements of equal groups, what do you divide by to remove duplicates?',
          step:   `\\dfrac{C(6,2)\\times C(4,2)\\times C(2,2)}{3!}=\\dfrac{${ordered}}{6}=${val}`
        };
      }

      // gen7: ordered — how many ways given C(n,k) directly
      function gen7() {
        const k1 = rInt(2)+2, k2 = rInt(2)+2;
        const n = k1+k2+rInt(2)+1;
        const k3 = n-k1-k2;
        const val = C(n,k1)*C(n-k1,k2);
        return {
          latex:  `C(${n},${k1})\\times C(${n-k1},${k2})\\times C(${k3},${k3}).\\quad\\text{Evaluate.}`,
          answer: [String(val)],
          hint:   'What does each factor in this product represent in a partition into labeled groups?',
          step:   `${C(n,k1)}\\times${C(n-k1,k2)}\\times 1=${val}`
        };
      }

      // gen8: unordered 2 groups, unequal sizes — just C(n,k)/2 for equal split variant
      function gen8() {
        const r = rInt(2)+3;   // r = 3 or 4
        const n = 2*r;
        const ordered = C(n,r);
        const val = ordered/2;
        return {
          latex:  `\\text{In how many ways can }${n}\\text{ students be split into 2 equal, unlabeled groups of }${r}?`,
          answer: [String(val)],
          hint:   'How many times does each unlabeled split appear in the labeled count?',
          step:   `\\dfrac{C(${n},${r})}{2}=\\dfrac{${ordered}}{2}=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_2: Set Operations
  CA_SPIRAL["CA_S_2"] = {
    title: "Set Operations",
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

      // Utility: generate a pool of distinct integers and split into two overlapping sets
      function makeSets(totalSize, overlapSize, extraA, extraB) {
        const pool = [];
        for (let i = 1; i <= 20; i++) pool.push(i);
        shuffle(pool);
        const overlap  = pool.slice(0, overlapSize);
        const onlyA    = pool.slice(overlapSize, overlapSize + extraA);
        const onlyB    = pool.slice(overlapSize + extraA, overlapSize + extraA + extraB);
        const A = overlap.concat(onlyA).sort((a,b)=>a-b);
        const B = overlap.concat(onlyB).sort((a,b)=>a-b);
        return { A, B, overlap, onlyA, onlyB };
      }

      function setStr(arr) { return '\\{' + arr.join(',') + '\\}'; }

      // gen1: |A ∪ B|
      function gen1() {
        const ov = rInt(2)+1, eA = rInt(3)+1, eB = rInt(3)+1;
        const {A, B, overlap, onlyA, onlyB} = makeSets(ov+eA+eB, ov, eA, eB);
        const union = Array.from(new Set([...A,...B])).sort((a,b)=>a-b);
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Find }|A\\cup B|.`,
          answer: [String(union.length)],
          hint:   'Which operation combines all elements from both sets?',
          step:   `A\\cup B=${setStr(union)},\\;|A\\cup B|=${union.length}`
        };
      }

      // gen2: |A ∩ B|
      function gen2() {
        const ov = rInt(3)+1, eA = rInt(3)+1, eB = rInt(3)+1;
        const {A, B, overlap} = makeSets(ov+eA+eB, ov, eA, eB);
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Find }|A\\cap B|.`,
          answer: [String(overlap.length)],
          hint:   'Which operation keeps only elements that appear in both sets?',
          step:   `A\\cap B=${setStr(overlap.sort((a,b)=>a-b))},\\;|A\\cap B|=${overlap.length}`
        };
      }

      // gen3: is element in A ∪ B?
      function gen3() {
        const ov = rInt(2)+1, eA = rInt(2)+1, eB = rInt(2)+1;
        const {A, B, overlap, onlyA, onlyB} = makeSets(ov+eA+eB, ov, eA, eB);
        const union = Array.from(new Set([...A,...B])).sort((a,b)=>a-b);
        const isIn  = Math.random() < 0.5;
        // pick a number guaranteed inside or outside union
        let elem;
        if (isIn) {
          elem = choose(union);
        } else {
          // find a number NOT in union
          for (let k = 21; k <= 30; k++) { if (!union.includes(k)) { elem = k; break; } }
        }
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Is }${elem}\\in A\\cup B?`,
          answer: [isIn ? 'yes' : 'no'],
          hint:   'What does it mean for an element to belong to a union?',
          step:   isIn ? `${elem}\\in A\\cup B\\Rightarrow\\text{yes}` : `${elem}\\notin A\\cup B\\Rightarrow\\text{no}`
        };
      }

      // gen4: |complement| given U and A
      function gen4() {
        const uSize = rInt(4)+6;   // U has 6..9 elements
        const aSize = rInt(uSize-2)+1;   // A ⊆ U, |A| = 1..uSize-1
        const pool = []; for (let i=1; i<=20; i++) pool.push(i); shuffle(pool);
        const U = pool.slice(0,uSize).sort((a,b)=>a-b);
        const A = U.slice(0,aSize);
        const compSize = uSize - aSize;
        return {
          latex:  `U=${setStr(U)},\\;A=${setStr(A)}.\\quad\\text{Find }|A'|.`,
          answer: [String(compSize)],
          hint:   'Which operation gives all elements of the universal set that are NOT in a given set?',
          step:   `|A'|=|U|-|A|=${uSize}-${aSize}=${compSize}`
        };
      }

      // gen5: |A \ B| (set subtraction)
      function gen5() {
        const ov = rInt(2)+1, eA = rInt(3)+2, eB = rInt(2)+1;
        const {A, B, onlyA} = makeSets(ov+eA+eB, ov, eA, eB);
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Find }|A\\setminus B|.`,
          answer: [String(onlyA.length)],
          hint:   'Which set operation subtracts one set from another?',
          step:   `A\\setminus B=${setStr(onlyA.sort((a,b)=>a-b))},\\;|A\\setminus B|=${onlyA.length}`
        };
      }

      // gen6: are sets disjoint? (A ∩ B = ∅)
      function gen6() {
        const disjoint = Math.random() < 0.5;
        const pool = []; for(let i=1;i<=20;i++) pool.push(i); shuffle(pool);
        let A, B;
        if (disjoint) {
          A = pool.slice(0,4).sort((a,b)=>a-b);
          B = pool.slice(4,8).sort((a,b)=>a-b);
        } else {
          const shared = pool[0];
          A = [shared, ...pool.slice(1,4)].sort((a,b)=>a-b);
          B = [shared, ...pool.slice(5,8)].sort((a,b)=>a-b);
        }
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Are }A\\text{ and }B\\text{ disjoint?}`,
          answer: [disjoint ? 'yes' : 'no'],
          hint:   'What must be true about the intersection of two disjoint sets?',
          step:   disjoint ? `A\\cap B=\\emptyset\\Rightarrow\\text{yes}` : `A\\cap B\\neq\\emptyset\\Rightarrow\\text{no}`
        };
      }

      // gen7: find |A ∪ B| when told |A|, |B|, |A ∩ B| (inclusion-exclusion preview)
      function gen7() {
        const aOnly = rInt(4)+1, bOnly = rInt(4)+1, both = rInt(3)+1;
        const aSize = aOnly+both, bSize = bOnly+both, unionSize = aOnly+bOnly+both;
        return {
          latex:  `|A|=${aSize},\\;|B|=${bSize},\\;|A\\cap B|=${both}.\\quad\\text{Find }|A\\cup B|.`,
          answer: [String(unionSize)],
          hint:   'How are the sizes of a union and intersection related to the sizes of the two sets?',
          step:   `|A\\cup B|=${aSize}+${bSize}-${both}=${unionSize}`
        };
      }

      // gen8: complement of complement = original — what is |(A')'|
      function gen8() {
        const pool = []; for(let i=1;i<=20;i++) pool.push(i); shuffle(pool);
        const uSize = rInt(4)+5;
        const aSize = rInt(uSize-2)+1;
        const U = pool.slice(0,uSize).sort((a,b)=>a-b);
        const A = U.slice(0,aSize);
        return {
          latex:  `U=${setStr(U)},\\;A=${setStr(A)}.\\quad\\text{What is }|(A')'|?`,
          answer: [String(aSize)],
          hint:   'What is the relationship between a set and the complement of its complement?',
          step:   `(A')'=A,\\;|(A')'|=|A|=${aSize}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_3: Subsets and Supersets
  CA_SPIRAL["CA_S_3"] = {
    title: "Subsets and Supersets",
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

      function setStr(arr) { return '\\{' + arr.join(',') + '\\}'; }

      // gen1: Is A ⊆ B? — randomly decide yes or no
      function gen1() {
        const pool = []; for(let i=1;i<=15;i++) pool.push(i); shuffle(pool);
        const isSubset = Math.random() < 0.5;
        const B = pool.slice(0, 6).sort((a,b)=>a-b);
        let A;
        if (isSubset) {
          const sz = rInt(3)+1;
          A = B.slice(0, sz).sort((a,b)=>a-b);
        } else {
          // A has one element guaranteed not in B
          A = [B[0], B[1], pool[6]].sort((a,b)=>a-b);
        }
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Is }A\\subseteq B?`,
          answer: [isSubset ? 'yes' : 'no'],
          hint:   'What must be true about every element of A for A to be a subset of B?',
          step:   isSubset ? `\\text{All elements of }A\\text{ are in }B\\Rightarrow\\text{yes}`
                           : `\\text{An element of }A\\text{ is missing from }B\\Rightarrow\\text{no}`
        };
      }

      // gen2: Is A ⊆ B where A = ∅? (always yes)
      function gen2() {
        const pool = []; for(let i=1;i<=12;i++) pool.push(i); shuffle(pool);
        const B = pool.slice(0,4).sort((a,b)=>a-b);
        return {
          latex:  `A=\\emptyset,\\;B=${setStr(B)}.\\quad\\text{Is }A\\subseteq B?`,
          answer: ['yes'],
          hint:   'Which set is a subset of every set?',
          step:   `\\emptyset\\subseteq\\text{any set}\\Rightarrow\\text{yes}`
        };
      }

      // gen3: Is A ⊆ A? (always yes — reflexive)
      function gen3() {
        const pool = []; for(let i=1;i<=12;i++) pool.push(i); shuffle(pool);
        const A = pool.slice(0, rInt(3)+2).sort((a,b)=>a-b);
        return {
          latex:  `A=${setStr(A)}.\\quad\\text{Is }A\\subseteq A?`,
          answer: ['yes'],
          hint:   'Is every set a subset of itself?',
          step:   `A\\subseteq A\\text{ always (reflexive)}\\Rightarrow\\text{yes}`
        };
      }

      // gen4: number of subsets = 2^n
      function gen4() {
        const n = rInt(4)+2;   // n = 2..5
        const count = Math.pow(2, n);
        const pool = ['a','b','c','d','e','f'];
        const A = pool.slice(0,n);
        return {
          latex:  `A=${setStr(A)}.\\quad\\text{How many subsets does }A\\text{ have?}`,
          answer: [String(count)],
          hint:   'How many subsets does a set with n elements have?',
          step:   `2^{${n}}=${count}`
        };
      }

      // gen5: number of subsets from cardinality (numerical set)
      function gen5() {
        const n = rInt(3)+2;   // n = 2..4
        const count = Math.pow(2, n);
        const pool = []; for(let i=1;i<=15;i++) pool.push(i); shuffle(pool);
        const A = pool.slice(0,n).sort((a,b)=>a-b);
        return {
          latex:  `A=${setStr(A)}.\\quad\\text{How many subsets does }A\\text{ have?}`,
          answer: [String(count)],
          hint:   'How many subsets does a set with n elements have?',
          step:   `|A|=${n},\\;2^{${n}}=${count}`
        };
      }

      // gen6: Is A a proper subset of B?
      function gen6() {
        const pool = []; for(let i=1;i<=15;i++) pool.push(i); shuffle(pool);
        const isProper = Math.random() < 0.5;
        const B = pool.slice(0,5).sort((a,b)=>a-b);
        const A = isProper ? B.slice(0, rInt(3)+1).sort((a,b)=>a-b) : [...B];
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)}.\\quad\\text{Is }A\\subset B\\text{ (proper subset)?}`,
          answer: [isProper ? 'yes' : 'no'],
          hint:   'What is the difference between a subset and a proper subset?',
          step:   isProper ? `A\\subseteq B\\text{ and }A\\neq B\\Rightarrow\\text{yes}`
                           : `A=B\\Rightarrow\\text{not a proper subset}\\Rightarrow\\text{no}`
        };
      }

      // gen7: transitivity — if A ⊆ B and B ⊆ C, is A ⊆ C?
      function gen7() {
        const pool = []; for(let i=1;i<=15;i++) pool.push(i); shuffle(pool);
        const C = pool.slice(0,7).sort((a,b)=>a-b);
        const B = C.slice(0,5);
        const A = B.slice(0,3);
        return {
          latex:  `A=${setStr(A)},\\;B=${setStr(B)},\\;C=${setStr(C)}.\\quad A\\subseteq B\\text{ and }B\\subseteq C.\\text{ Is }A\\subseteq C?`,
          answer: ['yes'],
          hint:   'What does the transitive property say about subset relationships?',
          step:   `A\\subseteq B\\subseteq C\\Rightarrow A\\subseteq C\\Rightarrow\\text{yes}`
        };
      }

      // gen8: If A ⊆ B and B ⊆ A, what must be true?
      function gen8() {
        const pool = []; for(let i=1;i<=12;i++) pool.push(i); shuffle(pool);
        const A = pool.slice(0, rInt(3)+2).sort((a,b)=>a-b);
        return {
          latex:  `\\text{If }A\\subseteq B\\text{ and }B\\subseteq A,\\text{ what must be true about }A\\text{ and }B?`,
          answer: ['equal'],
          hint:   'If two sets are each subsets of the other, what does that imply about them?',
          step:   `A\\subseteq B\\text{ and }B\\subseteq A\\Rightarrow A=B\\Rightarrow\\text{equal}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_4: Venn Diagrams
  CA_SPIRAL["CA_S_4"] = {
    title: "Venn Diagrams",
    index: 30,
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

      // Build an SVG Venn diagram with four region counts labeled
      function makeVenn(a, b, c, d, shadeRegion) {
        // shadeRegion: 'onlyA' | 'overlap' | 'onlyB' | 'neither' | 'A' | 'B' | 'Ac' | 'Bc' | 'union' | 'none'
        const W = 340, H = 170;
        const cx1 = 120, cx2 = 220, cy = 85, r = 65;

        // Clip paths for shading regions
        let defs = `<defs>
          <clipPath id="clipA"><circle cx="${cx1}" cy="${cy}" r="${r}"/></clipPath>
          <clipPath id="clipB"><circle cx="${cx2}" cy="${cy}" r="${r}"/></clipPath>
          <clipPath id="clipBox"><rect x="5" y="5" width="${W-10}" height="${H-10}"/></clipPath>
        </defs>`;

        const shade = 'rgba(255,200,0,0.55)';

        let shading = '';
        if (shadeRegion === 'onlyA') {
          shading = `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="${shade}" clip-path="url(#clipBox)"/>
                     <circle cx="${cx2}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.9)"/>`;
        } else if (shadeRegion === 'overlap') {
          shading = `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="${shade}" clip-path="url(#clipB)"/>`;
        } else if (shadeRegion === 'onlyB') {
          shading = `<circle cx="${cx2}" cy="${cy}" r="${r}" fill="${shade}" clip-path="url(#clipBox)"/>
                     <circle cx="${cx1}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.9)"/>`;
        } else if (shadeRegion === 'neither') {
          shading = `<rect x="5" y="5" width="${W-10}" height="${H-10}" fill="${shade}"/>
                     <circle cx="${cx1}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.9)"/>
                     <circle cx="${cx2}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.9)"/>`;
        } else if (shadeRegion === 'union') {
          shading = `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="${shade}"/>
                     <circle cx="${cx2}" cy="${cy}" r="${r}" fill="${shade}"/>`;
        }

        return `<svg width="${W}" height="${H}" style="font-family:sans-serif;display:block;margin:auto">
          ${defs}
          <rect x="5" y="5" width="${W-10}" height="${H-10}" fill="#f9f9f9" stroke="#555" stroke-width="1.5" rx="4"/>
          <text x="${W-12}" y="20" text-anchor="end" font-size="13" fill="#555">U</text>
          ${shading}
          <circle cx="${cx1}" cy="${cy}" r="${r}" fill="none" stroke="#3366cc" stroke-width="2"/>
          <circle cx="${cx2}" cy="${cy}" r="${r}" fill="none" stroke="#cc3300" stroke-width="2"/>
          <text x="72"  y="58" text-anchor="middle" font-size="15" font-weight="bold" fill="#3366cc">A</text>
          <text x="268" y="58" text-anchor="middle" font-size="15" font-weight="bold" fill="#cc3300">B</text>
          <text x="72"  y="${cy+6}" text-anchor="middle" font-size="17" font-weight="bold">${a}</text>
          <text x="170" y="${cy+6}" text-anchor="middle" font-size="17" font-weight="bold">${b}</text>
          <text x="268" y="${cy+6}" text-anchor="middle" font-size="17" font-weight="bold">${c}</text>
          <text x="28"  y="${H-15}" text-anchor="middle" font-size="17" font-weight="bold">${d}</text>
        </svg>`;
      }

      function randRegions() {
        return { a: rInt(8)+1, b: rInt(6)+1, c: rInt(8)+1, d: rInt(6)+1 };
      }

      // gen1: find |A| = a + b
      function gen1() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'none') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">Find |A|.</p>',
          answer: [String(a+b)],
          hint:   'Which regions of the Venn diagram belong to set A?',
          step:   `|A|=\\text{only A}+|A\\cap B|=${a}+${b}=${a+b}`
        };
      }

      // gen2: find |B| = b + c
      function gen2() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'none') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">Find |B|.</p>',
          answer: [String(b+c)],
          hint:   'Which regions of the Venn diagram belong to set B?',
          step:   `|B|=|A\\cap B|+\\text{only B}=${b}+${c}=${b+c}`
        };
      }

      // gen3: find |A ∩ B| = b
      function gen3() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'overlap') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">The shaded region is A &#8745; B. Find |A &#8745; B|.</p>',
          answer: [String(b)],
          hint:   'Which region of the Venn diagram represents the intersection?',
          step:   `|A\\cap B|=${b}`
        };
      }

      // gen4: find |A ∪ B| = a + b + c
      function gen4() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'union') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">The shaded region is A &#8746; B. Find |A &#8746; B|.</p>',
          answer: [String(a+b+c)],
          hint:   'Which regions of the Venn diagram are covered by the union?',
          step:   `|A\\cup B|=${a}+${b}+${c}=${a+b+c}`
        };
      }

      // gen5: find |(A ∪ B)'| = d (the "neither" region)
      function gen5() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'neither') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">The shaded region is (A &#8746; B)&prime;. Find |(A &#8746; B)&prime;|.</p>',
          answer: [String(d)],
          hint:   'Which region of the Venn diagram contains elements in neither set?',
          step:   `|(A\\cup B)'|=${d}`
        };
      }

      // gen6: find |U| = a + b + c + d
      function gen6() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'none') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">Find |U|.</p>',
          answer: [String(a+b+c+d)],
          hint:   'Which regions together make up the entire universal set?',
          step:   `|U|=${a}+${b}+${c}+${d}=${a+b+c+d}`
        };
      }

      // gen7: find |A'| = c + d
      function gen7() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'none') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">Find |A&prime;|.</p>',
          answer: [String(c+d)],
          hint:   'Which regions of the Venn diagram fall outside of set A?',
          step:   `|A'|=\\text{only B}+\\text{neither}=${c}+${d}=${c+d}`
        };
      }

      // gen8: find |A \ B| = a (only A region)
      function gen8() {
        const {a,b,c,d} = randRegions();
        return {
          svg:    makeVenn(a,b,c,d,'onlyA') + '<p style="text-align:center;font-family:sans-serif;font-size:13px;margin-top:4px">The shaded region is A &#8726; B. Find |A &#8726; B|.</p>',
          answer: [String(a)],
          hint:   'Which region represents elements in A but not in B?',
          step:   `|A\\setminus B|=\\text{only A}=${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_5: Inclusion-Exclusion Principle
  CA_SPIRAL["CA_S_5"] = {
    title: "Inclusion-Exclusion Principle",
    index: 31,
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

      // gen1: find |A ∪ B| = |A| + |B| - |A ∩ B|
      function gen1() {
        const both = rInt(6)+1, onlyA = rInt(8)+2, onlyB = rInt(8)+2;
        const A = onlyA+both, B = onlyB+both, AuB = onlyA+both+onlyB;
        return {
          latex:  `|A|=${A},\\;|B|=${B},\\;|A\\cap B|=${both}.\\quad\\text{Find }|A\\cup B|.`,
          answer: [String(AuB)],
          hint:   'Which principle corrects for double-counting the overlap when adding two set sizes?',
          step:   `|A\\cup B|=${A}+${B}-${both}=${AuB}`
        };
      }

      // gen2: find |A ∩ B| = |A| + |B| - |A ∪ B|
      function gen2() {
        const both = rInt(6)+1, onlyA = rInt(8)+2, onlyB = rInt(8)+2;
        const A = onlyA+both, B = onlyB+both, AuB = onlyA+both+onlyB;
        return {
          latex:  `|A\\cup B|=${AuB},\\;|A|=${A},\\;|B|=${B}.\\quad\\text{Find }|A\\cap B|.`,
          answer: [String(both)],
          hint:   'How does the inclusion-exclusion formula rearrange to find the intersection size?',
          step:   `|A\\cap B|=${A}+${B}-${AuB}=${both}`
        };
      }

      // gen3: find |U| given all four region counts
      function gen3() {
        const onlyA = rInt(8)+2, both = rInt(5)+1, onlyB = rInt(8)+2, neither = rInt(6)+2;
        const U = onlyA+both+onlyB+neither;
        const AuB = onlyA+both+onlyB;
        const A = onlyA+both, B = onlyB+both;
        return {
          latex:  `|A|=${A},\\;|B|=${B},\\;|A\\cap B|=${both},\\;\\text{neither}=${neither}.\\quad\\text{Find }|U|.`,
          answer: [String(U)],
          hint:   'How do you find the size of the universal set from a Venn diagram?',
          step:   `|A\\cup B|=${A}+${B}-${both}=${AuB};\\;|U|=${AuB}+${neither}=${U}`
        };
      }

      // gen4: find "only A" = |A| - |A ∩ B|
      function gen4() {
        const both = rInt(6)+1, onlyA = rInt(8)+2;
        const A = onlyA+both;
        return {
          latex:  `|A|=${A},\\;|A\\cap B|=${both}.\\quad\\text{How many elements are in }A\\text{ but not }B?`,
          answer: [String(onlyA)],
          hint:   'What is the name for the region in A that has no elements in common with B?',
          step:   `\\text{only }A=|A|-|A\\cap B|=${A}-${both}=${onlyA}`
        };
      }

      // gen5: find |A ∪ B| when A and B are disjoint
      function gen5() {
        const A = rInt(10)+5, B = rInt(10)+5;
        return {
          latex:  `A\\text{ and }B\\text{ are disjoint.}\\;|A|=${A},\\;|B|=${B}.\\quad\\text{Find }|A\\cup B|.`,
          answer: [String(A+B)],
          hint:   'What is the intersection of two disjoint sets, and how does that simplify inclusion-exclusion?',
          step:   `A\\cap B=\\emptyset,\\;|A\\cup B|=${A}+${B}=${A+B}`
        };
      }

      // gen6: word problem — find people in at least one group
      function gen6() {
        const both = rInt(5)+2, onlyA = rInt(8)+3, onlyB = rInt(8)+3;
        const A = onlyA+both, B = onlyB+both, AuB = onlyA+both+onlyB;
        return {
          latex:  `\\text{In a room: }${A}\\text{ like team A, }${B}\\text{ like team B, }${both}\\text{ like both.}\\quad\\text{How many like at least one team?}`,
          answer: [String(AuB)],
          hint:   'What does "at least one" correspond to in set notation?',
          step:   `|A\\cup B|=${A}+${B}-${both}=${AuB}`
        };
      }

      // gen7: find "neither" = |U| - |A ∪ B|
      function gen7() {
        const onlyA = rInt(6)+2, both = rInt(4)+1, onlyB = rInt(6)+2, neither = rInt(5)+2;
        const A = onlyA+both, B = onlyB+both, AuB = onlyA+both+onlyB, U = AuB+neither;
        return {
          latex:  `|U|=${U},\\;|A|=${A},\\;|B|=${B},\\;|A\\cap B|=${both}.\\quad\\text{How many elements are in neither }A\\text{ nor }B?`,
          answer: [String(neither)],
          hint:   'Which region of the Venn diagram contains elements outside both sets?',
          step:   `|A\\cup B|=${A}+${B}-${both}=${AuB};\\;\\text{neither}=${U}-${AuB}=${neither}`
        };
      }

      // gen8: three-set inclusion-exclusion — find |A ∪ B ∪ C|
      function gen8() {
        // Build from region counts to guarantee integer answer
        const abc=rInt(3)+1, ab=rInt(3)+1, ac=rInt(3)+1, bc=rInt(3)+1;
        const onlyA=rInt(4)+2, onlyB=rInt(4)+2, onlyC=rInt(4)+2;
        const A = onlyA+ab+ac+abc;
        const B = onlyB+ab+bc+abc;
        const C = onlyC+ac+bc+abc;
        const AnB = ab+abc, AnC = ac+abc, BnC = bc+abc;
        const union = onlyA+onlyB+onlyC+ab+ac+bc+abc;
        return {
          latex:  `|A|=${A},\\;|B|=${B},\\;|C|=${C},\\;|A\\cap B|=${AnB},\\;|A\\cap C|=${AnC},\\;|B\\cap C|=${BnC},\\;|A\\cap B\\cap C|=${abc}.\\quad\\text{Find }|A\\cup B\\cup C|.`,
          answer: [String(union)],
          hint:   'How does the three-set inclusion-exclusion principle extend the two-set formula?',
          step:   `${A}+${B}+${C}-${AnB}-${AnC}-${BnC}+${abc}=${union}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_6: Basic Probability
  CA_SPIRAL["CA_S_6"] = {
    title: "Basic Probability",
    index: 32,
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

      function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
      function frac(n, d) {
        if (n === 0) return '0';
        const g = gcd(n, d);
        const rn = n/g, rd = d/g;
        return rd === 1 ? String(rn) : `${rn}/${rd}`;
      }

      // gen1: coin flip — P(heads) or P(tails) = 1/2
      function gen1() {
        const side = Math.random() < 0.5 ? 'heads' : 'tails';
        return {
          latex:  `\\text{Flip a fair coin. Find }P(\\text{${side}}).`,
          answer: ['1/2'],
          hint:   'How many equally likely outcomes does a coin flip have?',
          step:   `P(\\text{${side}})=\\tfrac{1}{2}`
        };
      }

      // gen2: die roll — P(rolling specific n) = 1/6
      function gen2() {
        const n = rInt(6)+1;
        return {
          latex:  `\\text{Roll a fair die. Find }P(\\text{rolling a }${n}).`,
          answer: ['1/6'],
          hint:   'How many equally likely outcomes are there when rolling a fair six-sided die?',
          step:   `P(${n})=\\tfrac{1}{6}`
        };
      }

      // gen3: die roll — P(rolling > k), result varies
      function gen3() {
        const k = rInt(4)+1;   // k = 1..4, so P(>k) has 1..4 outcomes
        const favorable = 6 - k;
        const ans = frac(favorable, 6);
        return {
          latex:  `\\text{Roll a fair die. Find }P(\\text{rolling} > ${k}).`,
          answer: [ans],
          hint:   'How many faces of the die show a number greater than the given value?',
          step:   `\\text{Favorable: }\\{${Array.from({length:favorable},(_,i)=>k+1+i).join(',')}\\};\\;P=${ans}`
        };
      }

      // gen4: die — P(even) = 1/2
      function gen4() {
        const evenOdd = Math.random() < 0.5 ? 'even' : 'odd';
        return {
          latex:  `\\text{Roll a fair die. Find }P(\\text{rolling an ${evenOdd} number}).`,
          answer: ['1/2'],
          hint:   'How many even (or odd) numbers are on a standard six-sided die?',
          step:   `P(\\text{${evenOdd}})=\\tfrac{3}{6}=\\tfrac{1}{2}`
        };
      }

      // gen5: complement on die — P(not k) = 5/6
      function gen5() {
        const k = rInt(6)+1;
        return {
          latex:  `\\text{Roll a fair die. Find }P(\\text{not rolling a }${k}).`,
          answer: ['5/6'],
          hint:   'What does the complement rule say about the probability of NOT getting a result?',
          step:   `P(\\text{not }${k})=1-\\tfrac{1}{6}=\\tfrac{5}{6}`
        };
      }

      // gen6: mutually exclusive on die — P(a or b) = 2/6 = 1/3
      function gen6() {
        const pool = [1,2,3,4,5,6]; shuffle(pool);
        const a = pool[0], b = pool[1];
        return {
          latex:  `\\text{Roll a fair die. Find }P(\\text{rolling a }${a}\\text{ or a }${b}).`,
          answer: ['1/3'],
          hint:   'When two events cannot both occur, how do you find the probability of one or the other?',
          step:   `P(${a}\\text{ or }${b})=\\tfrac{1}{6}+\\tfrac{1}{6}=\\tfrac{2}{6}=\\tfrac{1}{3}`
        };
      }

      // gen7: complement rule given P(A) — find P(A')
      function gen7() {
        // Pick a clean fraction p/q with p < q, gcd=1
        const options = [[1,4],[3,4],[1,3],[2,3],[1,5],[2,5],[3,5],[4,5],[1,8],[3,8],[5,8],[7,8]];
        const [p, q] = choose(options);
        const compN = q - p;
        const ans = frac(compN, q);
        return {
          latex:  `P(A)=\\tfrac{${p}}{${q}}.\\quad\\text{Find }P(A').`,
          answer: [ans],
          hint:   'What must P(A) and P(A\') sum to?',
          step:   `P(A')=1-\\tfrac{${p}}{${q}}=\\tfrac{${compN}}{${q}}${ans !== `${compN}/${q}` ? '='+ans : ''}`
        };
      }

      // gen8: cards — P(King) = 1/13 or P(face card) = 3/13 or P(heart) = 1/4
      function gen8() {
        const which = rInt(3);
        if (which === 0) {
          return {
            latex:  `\\text{Draw one card from a standard 52-card deck. Find }P(\\text{King}).`,
            answer: ['1/13'],
            hint:   'How many Kings are in a standard deck, and how many cards total?',
            step:   `P(\\text{King})=\\tfrac{4}{52}=\\tfrac{1}{13}`
          };
        } else if (which === 1) {
          return {
            latex:  `\\text{Draw one card. Find }P(\\text{face card: J, Q, or K}).`,
            answer: ['3/13'],
            hint:   'How many face cards are in a standard deck?',
            step:   `P(\\text{face})=\\tfrac{12}{52}=\\tfrac{3}{13}`
          };
        } else {
          return {
            latex:  `\\text{Draw one card. Find }P(\\text{drawing a heart}).`,
            answer: ['1/4'],
            hint:   'How many suits are in a standard deck, and how many hearts are there?',
            step:   `P(\\text{heart})=\\tfrac{13}{52}=\\tfrac{1}{4}`
          };
        }
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_7: Multiplication Principle
  CA_SPIRAL["CA_S_7"] = {
    title: "Multiplication Principle",
    index: 33,
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

      // gen1: two independent choices — n1 × n2
      function gen1() {
        const n1 = rInt(6)+2, n2 = rInt(6)+2;
        const items1 = choose(['shirt colors','sandwich types','paint shades','flavors','book genres']);
        const items2 = choose(['pant styles','drink choices','frame styles','toppings','cover types']);
        return {
          latex:  `${n1}\\text{ ${items1}} \\times ${n2}\\text{ ${items2}}.\\quad\\text{How many combinations?}`,
          answer: [String(n1*n2)],
          hint:   'What does the multiplication principle say about consecutive independent choices?',
          step:   `${n1}\\times${n2}=${n1*n2}`
        };
      }

      // gen2: three independent choices — n1 × n2 × n3
      function gen2() {
        const n1 = rInt(4)+2, n2 = rInt(4)+2, n3 = rInt(4)+2;
        return {
          latex:  `\\text{A task has three consecutive choices with }${n1},\\;${n2},\\text{ and }${n3}\\text{ options.}\\quad\\text{How many outcomes?}`,
          answer: [String(n1*n2*n3)],
          hint:   'How many total outcomes arise from three consecutive independent choices?',
          step:   `${n1}\\times${n2}\\times${n3}=${n1*n2*n3}`
        };
      }

      // gen3: coin flips — 2^n
      function gen3() {
        const n = rInt(4)+2;   // n = 2..5
        const val = Math.pow(2, n);
        return {
          latex:  `\\text{A fair coin is flipped }${n}\\text{ times.}\\quad\\text{How many different outcome sequences are possible?}`,
          answer: [String(val)],
          hint:   'How many outcomes does each coin flip contribute to the sequence?',
          step:   `2^{${n}}=${val}`
        };
      }

      // gen4: dice — 6^n
      function gen4() {
        const n = rInt(2)+1;   // n = 1 or 2
        const val = Math.pow(6, n);
        const diceDesc = n === 1 ? 'A fair 6-sided die is rolled' : `${n} fair 6-sided dice are rolled`;
        return {
          latex:  `\\text{${diceDesc}.}\\quad\\text{How many outcomes are in the sample space?}`,
          answer: [String(val)],
          hint:   'How many outcomes does each die contribute to the sample space?',
          step:   `6^{${n}}=${val}`
        };
      }

      // gen5: binary switches — 2^n
      function gen5() {
        const n = rInt(4)+2;   // n = 2..5
        const val = Math.pow(2, n);
        return {
          latex:  `\\text{There are }${n}\\text{ on/off switches.}\\quad\\text{How many different on/off combinations exist?}`,
          answer: [String(val)],
          hint:   'How many states does each on/off switch contribute to the total count?',
          step:   `2^{${n}}=${val}`
        };
      }

      // gen6: ordered selection, no repeats — n×(n-1)×…×(n-r+1)
      function gen6() {
        const n = rInt(5)+6;   // n = 6..10
        const r = rInt(2)+2;   // r = 2 or 3
        let val = 1;
        for (let i = 0; i < r; i++) val *= (n - i);
        const roleNames = r === 2 ? 'President and VP' : 'President, VP, and Treasurer';
        return {
          latex:  `\\text{From }${n}\\text{ people, choose a }${roleNames}\\text{ (order matters, no repeats).}\\quad\\text{How many ways?}`,
          answer: [String(val)],
          hint:   'When the same person cannot fill two roles, how does the number of choices change at each position?',
          step:   Array.from({length:r},(_,i)=>n-i).join('\\times')+'='+val
        };
      }

      // gen7: factorial value — n!
      function gen7() {
        const n = rInt(4)+3;   // n = 3..6
        let val = 1;
        for (let i = 2; i <= n; i++) val *= i;
        return {
          latex:  `\\text{Evaluate }${n}!`,
          answer: [String(val)],
          hint:   'What does the factorial symbol mean in terms of a product of consecutive integers?',
          step:   Array.from({length:n},(_,i)=>n-i).join('\\times')+'='+val
        };
      }

      // gen8: lock / digit combinations — 10^r or variations
      function gen8() {
        const dials = rInt(2)+2;   // 2 or 3 dials
        const digits = rInt(5)+6;  // 6..10 options per dial
        const val = Math.pow(digits, dials);
        return {
          latex:  `\\text{A combination lock has }${dials}\\text{ dials, each showing digits }0\\text{–}${digits-1}.\\quad\\text{How many combinations exist?}`,
          answer: [String(val)],
          hint:   'How does the multiplication principle apply when each dial has the same number of options?',
          step:   `${digits}^{${dials}}=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_8: Permutations and Combinations
  CA_SPIRAL["CA_S_8"] = {
    title: "Permutations and Combinations",
    index: 34,
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

      function fact(n) { let v=1; for(let i=2;i<=n;i++) v*=i; return v; }
      function P(n,r) { let v=1; for(let i=0;i<r;i++) v*=(n-i); return v; }
      function C(n,r) { return P(n,r)/fact(r); }

      // gen1: compute P(n,r)
      function gen1() {
        const n = rInt(5)+5, r = rInt(2)+2;   // n=5..9, r=2..3
        const val = P(n,r);
        return {
          latex:  `\\text{Compute }P(${n},${r}).`,
          answer: [String(val)],
          hint:   'What does P(n,r) count, and what is the formula in terms of descending factors?',
          step:   Array.from({length:r},(_,i)=>n-i).join('\\times')+'='+val
        };
      }

      // gen2: compute C(n,r)
      function gen2() {
        const r = rInt(3)+2;           // r=2..4
        const n = r + rInt(6)+2;       // n=r+2..r+7
        const val = C(n,r);
        return {
          latex:  `\\text{Compute }C(${n},${r}).`,
          answer: [String(val)],
          hint:   'How does C(n,r) relate to P(n,r), and why do we divide by r factorial?',
          step:   `\\frac{${Array.from({length:r},(_,i)=>n-i).join('\\times')}}{${fact(r)}}=${val}`
        };
      }

      // gen3: permutation or combination? — text answer
      function gen3() {
        const scenarios = [
          { q: 'electing a President, VP, and Secretary from a club', a: 'permutation' },
          { q: 'choosing a 3-person committee from a club',          a: 'combination'  },
          { q: 'assigning 1st, 2nd, and 3rd place ribbons',          a: 'permutation' },
          { q: 'selecting 4 books to read (no order)',                a: 'combination'  },
          { q: 'picking a starting lineup with positions assigned',   a: 'permutation' },
          { q: 'choosing 5 players for a team with no assigned roles',a: 'combination'  },
        ];
        const s = choose(scenarios);
        return {
          latex:  `\\text{${s.q} — permutation or combination?}`,
          answer: [s.a],
          hint:   'Does the order in which people are selected change the outcome?',
          step:   `\\text{${s.a[0].toUpperCase()+s.a.slice(1)}: order ${s.a==='permutation'?'matters':'does not matter'}}`
        };
      }

      // gen4: officers word problem → P(n,3)
      function gen4() {
        const n = rInt(5)+7;   // n=7..11
        const val = P(n,3);
        return {
          latex:  `\\text{From }${n}\\text{ people, choose a President, VP, and Treasurer. How many ways?}`,
          answer: [String(val)],
          hint:   'When each position is distinct, does the order of selection matter?',
          step:   `P(${n},3)=${n}\\times${n-1}\\times${n-2}=${val}`
        };
      }

      // gen5: committee word problem → C(n,r)
      function gen5() {
        const r = rInt(2)+2;           // r=2..3
        const n = r + rInt(5)+3;       // n=r+3..r+7
        const val = C(n,r);
        return {
          latex:  `\\text{From }${n}\\text{ people, choose a ${r}-person committee. How many ways?}`,
          answer: [String(val)],
          hint:   'When all selected people have the same role, does the order of selection matter?',
          step:   `C(${n},${r})=\\frac{${Array.from({length:r},(_,i)=>n-i).join('\\times')}}{${fact(r)}}=${val}`
        };
      }

      // gen6: symmetry rule — C(n,r) = C(n, n-r), use smaller side
      function gen6() {
        const r = rInt(3)+2;           // r=2..4
        const n = r + rInt(4)+r+1;     // ensure n-r > r so symmetry is useful
        const smallR = Math.min(r, n-r);
        const val = C(n,r);
        return {
          latex:  `\\text{Compute }C(${n},${n-smallR})\\text{ using the symmetry rule.}`,
          answer: [String(val)],
          hint:   'What does the symmetry rule say about C(n,r) and C(n, n-r)?',
          step:   `C(${n},${n-smallR})=C(${n},${smallR})=\\frac{${Array.from({length:smallR},(_,i)=>n-i).join('\\times')}}{${fact(smallR)}}=${val}`
        };
      }

      // gen7: arrange r books chosen from n on a shelf → P(n,r)
      function gen7() {
        const n = rInt(4)+5, r = rInt(2)+2;
        const val = P(n,r);
        return {
          latex:  `\\text{From }${n}\\text{ books, choose }${r}\\text{ and arrange them in a row. How many arrangements?}`,
          answer: [String(val)],
          hint:   'When both selecting and ordering objects, which counting formula applies?',
          step:   `P(${n},${r})=${Array.from({length:r},(_,i)=>n-i).join('\\times')}=${val}`
        };
      }

      // gen8: C(n,2) — choose a pair, gives triangular-number feel
      function gen8() {
        const n = rInt(8)+5;   // n=5..12
        const val = C(n,2);
        return {
          latex:  `\\text{How many different pairs can be chosen from }${n}\\text{ people?}`,
          answer: [String(val)],
          hint:   'When choosing a group of 2 with no assigned roles, which formula applies?',
          step:   `C(${n},2)=\\frac{${n}\\times${n-1}}{2}=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_9: Further Counting Techniques
  CA_SPIRAL["CA_S_9"] = {
    title: "Further Counting Techniques",
    index: 35,
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

      function fact(n) { let v=1; for(let i=2;i<=n;i++) v*=i; return v; }
      function C(n,r) {
        if(r<0||r>n) return 0;
        let v=1; for(let i=0;i<r;i++) v*=(n-i); return v/fact(r);
      }

      // gen1: exactly k heads in n flips → C(n,k)
      function gen1() {
        const n = rInt(4)+4;          // n = 4..7
        const k = rInt(n-1)+1;        // k = 1..n-1
        const val = C(n,k);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many outcomes have exactly }${k}\\text{ head(s)?}`,
          answer: [String(val)],
          hint:   'Choosing which flips land heads is the same as choosing a subset — which formula counts subsets?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen2: total coin flip outcomes → 2^n
      function gen2() {
        const n = rInt(5)+3;   // n = 3..7
        const val = Math.pow(2,n);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many total outcome sequences exist?}`,
          answer: [String(val)],
          hint:   'How many choices does each flip contribute to the total count?',
          step:   `2^{${n}}=${val}`
        };
      }

      // gen3: at least k heads — direct sum (small n so sum is short)
      function gen3() {
        const n = rInt(2)+4;          // n = 4 or 5
        const k = n - rInt(2)-1;      // k = n-1 or n-2 (so sum has 2-3 terms)
        let val = 0;
        const terms = [];
        for(let i=k; i<=n; i++) { const c=C(n,i); val+=c; terms.push(`C(${n},${i})=${c}`); }
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many outcomes have at least }${k}\\text{ heads?}`,
          answer: [String(val)],
          hint:   'Which cases satisfy "at least k heads," and how do you count each case separately?',
          step:   terms.join('+').replace(/\+C/g,'\\;+\\;C')+'='+val
        };
      }

      // gen4: at least 1 head — complement (2^n - 1)
      function gen4() {
        const n = rInt(4)+3;   // n = 3..6
        const total = Math.pow(2,n);
        const val = total - 1;
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many outcomes have at least 1 head?}`,
          answer: [String(val)],
          hint:   'What is the only outcome with no heads, and how does the complement rule use it?',
          step:   `2^{${n}}-C(${n},0)=${total}-1=${val}`
        };
      }

      // gen5: at least k heads — complement when sum would be long
      function gen5() {
        const n = rInt(3)+5;         // n = 5..7
        const k = 2;                  // at least 2 heads; complement = 0 or 1 heads
        const total = Math.pow(2,n);
        const fewer = C(n,0) + C(n,1);   // 1 + n
        const val = total - fewer;
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many outcomes have at least 2 heads? (Use the complement.)}`,
          answer: [String(val)],
          hint:   'How many outcomes have fewer than 2 heads, and how does that help find the complement?',
          step:   `2^{${n}}-C(${n},0)-C(${n},1)=${total}-1-${n}=${val}`
        };
      }

      // gen6: lattice path — C(r+d, r)
      function gen6() {
        const r = rInt(3)+2, d = rInt(3)+2;   // r,d = 2..4
        const val = C(r+d, r);
        return {
          latex:  `\\text{How many paths go }${r}\\text{ steps right and }${d}\\text{ steps down (no backtracking)?}`,
          answer: [String(val)],
          hint:   'A path has a fixed total number of steps — what are you really choosing among those steps?',
          step:   `C(${r+d},${r})=${val}`
        };
      }

      // gen7: exactly k heads, larger n to use combination formula
      function gen7() {
        const n = rInt(4)+6;    // n = 6..9
        const k = rInt(3)+2;    // k = 2..4
        const val = C(n,k);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. How many outcomes have exactly }${k}\\text{ heads?}`,
          answer: [String(val)],
          hint:   'The positions of the heads form a subset — which formula counts subsets of size k?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen8: lattice path with asymmetric grid
      function gen8() {
        const r = rInt(4)+2, d = rInt(3)+3;   // r=2..5, d=3..5, ensure r≠d
        const val = C(r+d, Math.min(r,d));
        return {
          latex:  `\\text{A grid requires }${r}\\text{ steps right and }${d}\\text{ steps down. How many shortest paths exist?}`,
          answer: [String(val)],
          hint:   'In a shortest path on a grid, every path uses the same total steps — what varies?',
          step:   `C(${r+d},${Math.min(r,d)})=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_10: Partitions
  CA_SPIRAL["CA_S_10"] = {
    title: "Partitions",
    index: 36,
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

      function fact(n) { let v=1; for(let i=2;i<=n;i++) v*=i; return v; }
      function C(n,r) {
        if(r<0||r>n) return 0;
        let v=1; for(let i=0;i<r;i++) v*=(n-i); return Math.round(v/fact(r));
      }

      // gen1: ordered partition into 2 labeled groups → C(n, k)
      function gen1() {
        const k = rInt(3)+2;           // k = 2..4
        const rest = rInt(3)+k+1;      // ensure rest > k
        const n = k + rest;
        const val = C(n, k);
        const dest1 = choose(['Washington DC','Chicago','the museum','the lab','Team A']);
        const dest2 = dest1 === 'Team A' ? 'Team B' : 'home';
        return {
          latex:  `${n}\\text{ people split into a group of }${k}\\text{ (${dest1}) and }${rest}\\text{ (${dest2}). How many ways?}`,
          answer: [String(val)],
          hint:   'When groups have distinct labels, which formula counts ways to assign people to one specific group?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen2: ordered partition into 3 labeled groups → C(n,a)×C(n-a,b)
      function gen2() {
        const a = rInt(2)+2, b = rInt(2)+2;   // a,b = 2..3
        const c = rInt(2)+1;                   // c = 1..2
        const n = a+b+c;
        const val = C(n,a)*C(n-a,b);          // ×C(c,c)=1
        return {
          latex:  `${n}\\text{ people → Team A (}${a}\\text{), Team B (}${b}\\text{), Team C (}${c}\\text{). How many ways?}`,
          answer: [String(val)],
          hint:   'For labeled groups, how do you count the ways to fill each group in sequence?',
          step:   `C(${n},${a})\\times C(${n-a},${b})=${C(n,a)}\\times${C(n-a,b)}=${val}`
        };
      }

      // gen3: unordered partition into 2 equal groups → C(n, n/2) / 2
      function gen3() {
        const r = rInt(3)+2;    // group size r = 2..4
        const n = 2*r;
        const val = C(n,r)/2;
        return {
          latex:  `${n}\\text{ people split into 2 unlabeled groups of }${r}. \\text{ How many ways?}`,
          answer: [String(val)],
          hint:   'When two groups are interchangeable, how does that change the count compared to labeled groups?',
          step:   `\\dfrac{C(${n},${r})}{2!}=\\dfrac{${C(n,r)}}{2}=${val}`
        };
      }

      // gen4: ordered vs unordered — text answer
      function gen4() {
        const labeled = Math.random() < 0.5;
        const scenario = labeled
          ? choose(['splitting into a red team and a blue team',
                    'assigning people to Group A and Group B',
                    'splitting into a morning shift and an evening shift'])
          : choose(['splitting into two equal teams for a game',
                    'dividing into two study groups with no labels',
                    'forming two anonymous committees']);
        return {
          latex:  `\\text{Is "${scenario}" an ordered or unordered partition?}`,
          answer: [labeled ? 'ordered' : 'unordered'],
          hint:   'Do the groups have distinct identities, or are they interchangeable?',
          step:   labeled ? `\\text{Groups are labeled}\\Rightarrow\\text{ordered}`
                          : `\\text{Groups are interchangeable}\\Rightarrow\\text{unordered}`
        };
      }

      // gen5: C(n, k) — first factor in an ordered 2-group partition
      function gen5() {
        const k = rInt(3)+2, rest = rInt(3)+k;
        const n = k+rest;
        const val = C(n,k);
        return {
          latex:  `\\text{${n} people split into labeled groups of ${k} and ${rest}. What is the number of ways?}`,
          answer: [String(val)],
          hint:   'For two labeled groups, how many ways can you choose who goes in the smaller group?',
          step:   `C(${n},${k})=${val}`
        };
      }

      // gen6: unordered — 3 equal groups of 2 → C(6,2)×C(4,2)/3!
      function gen6() {
        const n = 6, r = 2, m = 3;
        const ordered = C(6,2)*C(4,2)*C(2,2);
        const val = ordered/fact(m);
        return {
          latex:  `6\\text{ people split into 3 unlabeled pairs. How many ways?}`,
          answer: [String(val)],
          hint:   'After counting ordered arrangements of equal groups, what do you divide by to remove duplicates?',
          step:   `\\dfrac{C(6,2)\\times C(4,2)\\times C(2,2)}{3!}=\\dfrac{${ordered}}{6}=${val}`
        };
      }

      // gen7: ordered — how many ways given C(n,k) directly
      function gen7() {
        const k1 = rInt(2)+2, k2 = rInt(2)+2;
        const n = k1+k2+rInt(2)+1;
        const k3 = n-k1-k2;
        const val = C(n,k1)*C(n-k1,k2);
        return {
          latex:  `C(${n},${k1})\\times C(${n-k1},${k2})\\times C(${k3},${k3}).\\quad\\text{Evaluate.}`,
          answer: [String(val)],
          hint:   'What does each factor in this product represent in a partition into labeled groups?',
          step:   `${C(n,k1)}\\times${C(n-k1,k2)}\\times 1=${val}`
        };
      }

      // gen8: unordered 2 groups, unequal sizes — just C(n,k)/2 for equal split variant
      function gen8() {
        const r = rInt(2)+3;   // r = 3 or 4
        const n = 2*r;
        const ordered = C(n,r);
        const val = ordered/2;
        return {
          latex:  `\\text{In how many ways can }${n}\\text{ students be split into 2 equal, unlabeled groups of }${r}?`,
          answer: [String(val)],
          hint:   'How many times does each unlabeled split appear in the labeled count?',
          step:   `\\dfrac{C(${n},${r})}{2}=\\dfrac{${ordered}}{2}=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // CA_S_11: Probability with Permutations and Combinations
  CA_SPIRAL["CA_S_11"] = {
    title: "Probability with Permutations and Combinations",
    index: 37,
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

      function fact(n) { let v=1; for(let i=2;i<=n;i++) v*=i; return v; }
      function C(n,r) {
        if(r<0||r>n) return 0;
        let v=1; for(let i=0;i<r;i++) v*=(n-i); return Math.round(v/fact(r));
      }
      function gcd(a,b) { return b===0?a:gcd(b,a%b); }
      function frac(n,d) {
        if(n===0) return '0'; if(n===d) return '1';
        const g=gcd(n,d); return `${n/g}/${d/g}`;
      }

      // gen1: P(exactly k heads in n flips) = C(n,k) / 2^n
      function gen1() {
        const n = rInt(3)+3;        // n = 3..5
        const k = rInt(n-1)+1;      // k = 1..n-1
        const num = C(n,k), den = Math.pow(2,n);
        const ans = frac(num,den);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. Find }P(\\text{exactly }${k}\\text{ head(s)}).`,
          answer: [ans],
          hint:   'Which formula counts the number of sequences with exactly k heads out of n flips?',
          step:   `\\frac{C(${n},${k})}{2^{${n}}}=\\frac{${num}}{${den}}=${ans}`
        };
      }

      // gen2: P(person on committee) = r/n
      function gen2() {
        const n = rInt(7)+6;        // n = 6..12
        const r = rInt(3)+2;        // r = 2..4, r < n
        const ans = frac(r, n);
        return {
          latex:  `\\text{A ${r}-person committee is chosen from ${n} people. What is the probability a specific person is included?}`,
          answer: [ans],
          hint:   'How many of the n spots in the committee could belong to a specific person?',
          step:   `P=\\frac{r}{n}=\\frac{${r}}{${n}}=${ans}`
        };
      }

      // gen3: P(all tails) = 1/2^n
      function gen3() {
        const n = rInt(4)+2;   // n = 2..5
        const den = Math.pow(2,n);
        const ans = frac(1,den);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. Find }P(\\text{all tails}).`,
          answer: [ans],
          hint:   'How many total outcomes are there, and how many result in all tails?',
          step:   `\\frac{1}{2^{${n}}}=${ans}`
        };
      }

      // gen4: P(at least 1 head) = 1 - 1/2^n
      function gen4() {
        const n = rInt(4)+2;   // n = 2..5
        const den = Math.pow(2,n);
        const ans = frac(den-1, den);
        return {
          latex:  `\\text{Flip a coin }${n}\\text{ times. Find }P(\\text{at least 1 head}).`,
          answer: [ans],
          hint:   'Which complement event has only one possible outcome?',
          step:   `1-\\frac{1}{2^{${n}}}=\\frac{${den}-1}{${den}}=${ans}`
        };
      }

      // gen5: P(specific pair on committee of r from n) = r(r-1)/(n(n-1))
      function gen5() {
        const r = rInt(2)+2;        // r = 2 or 3
        const n = rInt(5)+r+3;      // n >= r+3
        const num = r*(r-1), den = n*(n-1);
        const ans = frac(num,den);
        return {
          latex:  `\\text{A ${r}-person committee from ${n}. What is the probability two specific people are both chosen?}`,
          answer: [ans],
          hint:   'How many ways include both specific people, compared to all possible committees?',
          step:   `\\frac{C(${n-2},${r-2})}{C(${n},${r})}=\\frac{${r}(${r}-1)}{${n}(${n}-1)}=\\frac{${num}}{${den}}=${ans}`
        };
      }

      // gen6: P(no repeated digits, 2-digit pin) = 9/10
      function gen6() {
        return {
          latex:  `\\text{A 2-digit PIN is chosen at random (digits 0–9, repetition allowed). Find }P(\\text{no digit repeated}).`,
          answer: ['9/10'],
          hint:   'How many 2-digit PINs have no repeated digit, compared to all possible 2-digit PINs?',
          step:   `\\frac{10\\times 9}{10^2}=\\frac{90}{100}=\\frac{9}{10}`
        };
      }

      // gen7: P(no repeated digits, 3-digit pin) = 18/25
      function gen7() {
        return {
          latex:  `\\text{A 3-digit PIN is chosen at random (digits 0–9, repetition allowed). Find }P(\\text{no digit repeated}).`,
          answer: ['18/25'],
          hint:   'How many 3-digit PINs have all distinct digits, compared to the total number of 3-digit PINs?',
          step:   `\\frac{10\\times 9\\times 8}{10^3}=\\frac{720}{1000}=\\frac{18}{25}`
        };
      }

      // gen8: P(specific person is president from n candidates) = 1/n
      function gen8() {
        const n = rInt(8)+5;   // n = 5..12
        const ans = frac(1,n);
        return {
          latex:  `\\text{A president is chosen at random from ${n} equally qualified candidates. What is the probability a specific person wins?}`,
          answer: [ans],
          hint:   'If every candidate is equally likely, what fraction of outcomes favor one specific person?',
          step:   `P=\\frac{1}{${n}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

})(window);