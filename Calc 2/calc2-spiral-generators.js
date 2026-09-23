// AUTO-GENERATED — calc2 spiral-review generator bundle
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

  global.CALC2_SPIRAL = {};

  // C2_01: U-Substitution
  CALC2_SPIRAL["C2_01"] = {
    title: "U-Substitution",
    index: 0,
    generators: (function() {
      function norm(s) {
        return s.trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/∞/g, 'inf').replace(/∪/g, 'u');
      }
      function ok(user, acc) { return acc.some(a => norm(user) === norm(a)); }

      // gen1: Identify u — power type
      function gen1() {
        const a = choose([2, 3]);
        const c = choose([1, 2, 3]);
        const n = choose([3, 4, 5]);
        const coeff = a === 2 ? '2x' : '3x^2';
        const deriv = a === 2 ? '2x' : '3x^2';
        return {
          latex: `\\text{For } \\displaystyle\\int ${coeff}\\,(x^{${a}}+${c})^{${n}}\\,dx,\\text{ what should } u \\text{ equal?}`,
          answer: [`x^${a}+${c}`],
          hint: 'Which inner function, when differentiated, appears as a factor in the integrand?',
          step: `u = x^{${a}}+${c},\\quad du = ${a}x^{${a-1}}\\,dx`
        };
      }

      // gen2: ∫_0^(π/2) sin^n(x)·cos(x) dx = 1/(n+1)
      function gen2() {
        const n = choose([1, 2, 3]);
        const den = n + 1;
        const ans = '1/' + den;
        return {
          latex: `\\int_0^{\\pi/2} \\sin^{${n}}x\\cdot\\cos x\\,dx`,
          answer: [ans],
          hint: 'When a power of sine is multiplied by cosine, which function should serve as u?',
          step: `u=\\sin x,\\;du=\\cos x\\,dx\\;\\Rightarrow\\;\\int_0^1 u^{${n}}\\,du=\\left[\\frac{u^{${den}}}{${den}}\\right]_0^1=\\frac{1}{${den}}`
        };
      }

      // gen3: ∫_0^(π/a) sin(ax) dx = 2/a
      function gen3() {
        const a = choose([1, 2, 3]);
        const ans = a === 1 ? '2' : (a === 2 ? '1' : '2/3');
        const upper = a === 1 ? '\\pi' : (a === 2 ? '\\pi/2' : '\\pi/3');
        const argStr = a === 1 ? 'x' : `${a}x`;
        return {
          latex: `\\int_0^{${upper}} \\sin(${argStr})\\,dx`,
          answer: [ans],
          hint: 'When the argument of sine is a linear expression ax, which expression should u equal?',
          step: `u=${argStr},\\;du=${a}\\,dx\\;\\Rightarrow\\;\\left[-\\frac{\\cos(${argStr})}{${a}}\\right]_0^{${upper}}=\\frac{1}{${a}}+\\frac{1}{${a}}=\\frac{2}{${a}}`
        };
      }

      // gen4: ∫_0^1 2x(x²+1)^n dx = (2^(n+1)-1)/(n+1)
      function gen4() {
        const n = choose([1, 2, 3]);
        const num = Math.pow(2, n + 1) - 1;
        const den = n + 1;
        const ans = num === den ? '1' : `${num}/${den}`;
        return {
          latex: `\\int_0^1 2x\\,(x^2+1)^{${n}}\\,dx`,
          answer: [ans],
          hint: 'Which factor is raised to a power and has its derivative present as the other factor?',
          step: `u=x^2+1,\\;du=2x\\,dx\\;\\Rightarrow\\;\\int_1^2 u^{${n}}\\,du=\\left[\\frac{u^{${den}}}{${den}}\\right]_1^2=\\frac{${Math.pow(2,den)}-1}{${den}}=${ans}`
        };
      }

      // gen5: Identify u — exponential type
      function gen5() {
        const n = choose([2, 3]);
        const coeff = n;
        return {
          latex: `\\text{For } \\displaystyle\\int ${coeff}x^{${n-1}}e^{x^{${n}}}\\,dx,\\text{ what should } u \\text{ equal?}`,
          answer: [`x^${n}`],
          hint: 'When the exponent of an exponential is non-linear, which expression in the exponent should u equal?',
          step: `u=x^{${n}},\\quad du=${n}x^{${n-1}}\\,dx`
        };
      }

      // gen6: Odd function over symmetric interval = 0
      function gen6() {
        const a = choose([1, 2, 3]);
        const b = choose([1, 2, 4]);
        const n = choose([2, 4, 6]);
        return {
          latex: `\\int_{-${a}}^{${a}} x\\,(x^2+${b})^{${n}}\\,dx`,
          answer: ['0'],
          hint: 'What does the symmetry of an odd function over a symmetric interval tell you about the integral?',
          step: `x(x^2+${b})^{${n}}\\text{ is odd, so }\\int_{-${a}}^{${a}}(\\text{odd})\\,dx=0`
        };
      }

      // gen7: ∫_1^(e^a) ln(x)/x dx = a²/2
      function gen7() {
        const a = choose([1, 2]);
        const top = a * a;
        const ans = top === 1 ? '1/2' : String(top / 2);
        const upper = a === 1 ? 'e' : `e^{${a}}`;
        return {
          latex: `\\int_1^{${upper}} \\frac{\\ln x}{x}\\,dx`,
          answer: [ans],
          hint: 'Which function in this integrand has its own derivative sitting right next to it as a factor?',
          step: `u=\\ln x,\\;du=\\frac{dx}{x}\\;\\Rightarrow\\;\\int_0^{${a}} u\\,du=\\left[\\frac{u^2}{2}\\right]_0^{${a}}=\\frac{${top}}{2}=${ans}`
        };
      }

      // gen8: ∫_0^(π/4) sin(2x) dx = 1/2
      function gen8() {
        return {
          latex: `\\int_0^{\\pi/4} \\sin(2x)\\,dx`,
          answer: ['1/2'],
          hint: 'Which expression in the argument of sine should serve as u?',
          step: `u=2x,\\;du=2\\,dx\\;\\Rightarrow\\;\\left[-\\frac{\\cos(2x)}{2}\\right]_0^{\\pi/4}=0+\\frac{1}{2}=\\frac{1}{2}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_02: Advanced U-Substitution
  CALC2_SPIRAL["C2_02"] = {
    title: "Advanced U-Substitution",
    index: 1,
    generators: (function() {
      function norm(s) {
        return s.trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/∞/g, 'inf').replace(/∪/g, 'u');
      }
      function ok(user, acc) { return acc.some(a => norm(user) === norm(a)); }

      // gen1: ∫_0^3 x/√(x+1) dx = 8/3   (u=x+1, x=u-1)
      function gen1() {
        return {
          latex: `\\int_0^3 \\frac{x}{\\sqrt{x+1}}\\,dx`,
          answer: ['8/3'],
          hint: 'When u = x+1, how can you rewrite x entirely in terms of u?',
          step: `u=x+1,\\,x=u-1,\\,dx=du\\;\\Rightarrow\\;\\int_1^4\\frac{u-1}{\\sqrt{u}}\\,du=\\left[\\frac{2u^{3/2}}{3}-2u^{1/2}\\right]_1^4=\\frac{8}{3}`
        };
      }

      // gen2: ∫_1^5 x/√(x−1) dx = 28/3  (u=x-1, x=u+1)
      function gen2() {
        return {
          latex: `\\int_1^5 \\frac{x}{\\sqrt{x-1}}\\,dx`,
          answer: ['28/3'],
          hint: 'When u equals x shifted by a constant, how do you express x in terms of u?',
          step: `u=x-1,\\,x=u+1,\\,dx=du\\;\\Rightarrow\\;\\int_0^4(u^{1/2}+u^{-1/2})\\,du=\\left[\\frac{2u^{3/2}}{3}+2u^{1/2}\\right]_0^4=\\frac{28}{3}`
        };
      }

      // gen3: ∫_0^1 x(1-x²)^(1/2) dx = 1/3   (u=1-x²)
      function gen3() {
        return {
          latex: `\\int_0^1 x\\sqrt{1-x^2}\\,dx`,
          answer: ['1/3'],
          hint: 'Which expression under the radical has its derivative appearing as the other factor?',
          step: `u=1-x^2,\\,du=-2x\\,dx\\;\\Rightarrow\\;-\\tfrac{1}{2}\\int_1^0 u^{1/2}\\,du=\\tfrac{1}{2}\\left[\\tfrac{2u^{3/2}}{3}\\right]_0^1=\\frac{1}{3}`
        };
      }

      // gen4: ∫_1^3 2x/(x²+1) dx = ln(5)
      function gen4() {
        return {
          latex: `\\int_1^3 \\frac{2x}{x^2+1}\\,dx`,
          answer: ['ln(5)', 'ln5'],
          hint: 'When the numerator is the derivative of the denominator, which u makes the integrand 1/u?',
          step: `u=x^2+1,\\,du=2x\\,dx\\;\\Rightarrow\\;\\int_2^{10}\\frac{du}{u}=\\ln 10-\\ln 2=\\ln 5`
        };
      }

      // gen5: ∫_2^4 1/(x−1) dx = ln(3)
      function gen5() {
        return {
          latex: `\\int_2^4 \\frac{1}{x-1}\\,dx`,
          answer: ['ln(3)', 'ln3'],
          hint: 'The integrand has the form 1/f(x) where f(x) is linear — what does u equal?',
          step: `u=x-1,\\,du=dx\\;\\Rightarrow\\;\\int_1^3\\frac{du}{u}=\\ln 3-\\ln 1=\\ln 3`
        };
      }

      // gen6: ∫_0^1 (2x+1)/(x²+x+5) dx = ln(7/5)
      function gen6() {
        return {
          latex: `\\int_0^1 \\frac{2x+1}{x^2+x+5}\\,dx`,
          answer: ['ln(7/5)', 'ln7-ln5', 'ln(7)-ln(5)'],
          hint: 'Which expression in the denominator has its derivative in the numerator?',
          step: `u=x^2+x+5,\\,du=(2x+1)dx\\;\\Rightarrow\\;\\int_5^7\\frac{du}{u}=\\ln 7-\\ln 5=\\ln\\tfrac{7}{5}`
        };
      }

      // gen7: Identify u — log type with trig
      function gen7() {
        const choices = [
          { expr: '\\cos(x)', denom: '\\sin(x)+3', ans: 'sin(x)+3', ansAlt: 'sinx+3',
            step: 'u=\\sin(x)+3,\\quad du=\\cos(x)\\,dx' },
          { expr: '\\sin(x)', denom: '\\cos(x)+2', ans: 'cos(x)+2', ansAlt: 'cosx+2',
            step: 'u=\\cos(x)+2,\\quad du=-\\sin(x)\\,dx' },
          { expr: '2\\cos(x)', denom: '\\sin^2(x)+1', ans: 'sin^2(x)+1', ansAlt: 'sin^2x+1',
            step: 'u=\\sin^2(x)+1,\\quad du=2\\sin(x)\\cos(x)\\,dx' }
        ];
        const c = choose(choices);
        return {
          latex: `\\text{For }\\displaystyle\\int\\frac{${c.expr}}{${c.denom}}\\,dx,\\text{ what should } u \\text{ equal?}`,
          answer: [c.ans, c.ansAlt],
          hint: 'Which expression in the denominator has its derivative appearing in the numerator?',
          step: c.step
        };
      }

      // gen8: ∫_0^1 x(1−x)^10 dx = 1/132  (u=1-x)
      function gen8() {
        return {
          latex: `\\int_0^1 x\\,(1-x)^{10}\\,dx`,
          answer: ['1/132'],
          hint: 'When u = 1−x, how can you rewrite x entirely in terms of u?',
          step: `u=1-x,\\,x=1-u,\\,dx=-du\\;\\Rightarrow\\;\\int_0^1(1-u)u^{10}\\,du=\\int_0^1(u^{10}-u^{11})\\,du=\\frac{1}{11}-\\frac{1}{12}=\\frac{1}{132}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_03: Trig Power Reduction
  CALC2_SPIRAL["C2_03"] = {
    title: "Trig Power Reduction",
    index: 2,
    generators: (function() {
      function norm(s) {
        return s.trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/∞/g, 'inf').replace(/\*/g,'');
      }
      function ok(user, acc) { return acc.some(a => norm(user) === norm(a)); }

      // gen1: ∫_0^(π/2) sin^n(x)·cos(x) dx = 1/(n+1),  n∈{1,2,3,4}
      function gen1() {
        const n = choose([1, 2, 3, 4]);
        const den = n + 1;
        return {
          latex: `\\int_0^{\\pi/2} \\sin^{${n}}x\\,\\cos x\\,dx`,
          answer: ['1/' + den],
          hint: 'Which function has its derivative present as the adjacent factor in the integrand?',
          step: `u=\\sin x,\\;du=\\cos x\\,dx\\;\\Rightarrow\\;\\int_0^1 u^{${n}}\\,du=\\frac{1}{${den}}`
        };
      }

      // gen2: ∫_0^(π/2) cos³(x) dx = 2/3
      function gen2() {
        return {
          latex: `\\int_0^{\\pi/2} \\cos^3 x\\,dx`,
          answer: ['2/3'],
          hint: 'When cosine has an odd power, factor out one cosine and rewrite the rest using sin²+cos²=1.',
          step: `\\cos^3 x=(1-\\sin^2 x)\\cos x\\;\\Rightarrow\\;u=\\sin x\\;\\Rightarrow\\;\\int_0^1(1-u^2)du=1-\\tfrac{1}{3}=\\frac{2}{3}`
        };
      }

      // gen3: ∫_0^(π/2) sin³(x)cos²(x) dx = 2/15
      function gen3() {
        return {
          latex: `\\int_0^{\\pi/2} \\sin^3 x\\,\\cos^2 x\\,dx`,
          answer: ['2/15'],
          hint: 'When the power of sine is odd, factor out one sine and rewrite sin² in terms of cos².',
          step: `\\sin^3 x=(1-\\cos^2 x)\\sin x\\;\\Rightarrow\\;u=\\cos x,\\,du=-\\sin x\\,dx\\;\\Rightarrow\\;\\int_0^1(1-u^2)u^2\\,du=\\tfrac{1}{3}-\\tfrac{1}{5}=\\frac{2}{15}`
        };
      }

      // gen4: ∫_0^(π/2) sin²(x) dx = π/4
      function gen4() {
        return {
          latex: `\\int_0^{\\pi/2} \\sin^2 x\\,dx`,
          answer: ['pi/4'],
          hint: 'When an even power of sine appears, which identity rewrites sin² in terms of a double angle?',
          step: `\\sin^2 x=\\frac{1-\\cos(2x)}{2}\\;\\Rightarrow\\;\\left[\\frac{x}{2}-\\frac{\\sin(2x)}{4}\\right]_0^{\\pi/2}=\\frac{\\pi}{4}`
        };
      }

      // gen5: ∫_0^π sin²(x) dx = π/2
      function gen5() {
        return {
          latex: `\\int_0^{\\pi} \\sin^2 x\\,dx`,
          answer: ['pi/2'],
          hint: 'Which power-reduction formula rewrites sin² as a function involving cos(2x)?',
          step: `\\sin^2 x=\\frac{1-\\cos(2x)}{2}\\;\\Rightarrow\\;\\left[\\frac{x}{2}-\\frac{\\sin(2x)}{4}\\right]_0^{\\pi}=\\frac{\\pi}{2}`
        };
      }

      // gen6: ∫_0^(π/2) sin²(x)cos²(x) dx = π/16
      function gen6() {
        return {
          latex: `\\int_0^{\\pi/2} \\sin^2 x\\,\\cos^2 x\\,dx`,
          answer: ['pi/16'],
          hint: 'How can you rewrite sin(x)cos(x) as a single trig function to simplify this integrand?',
          step: `\\sin^2 x\\cos^2 x=\\tfrac{1}{4}\\sin^2(2x)=\\tfrac{1}{4}\\cdot\\tfrac{1-\\cos(4x)}{2}\\;\\Rightarrow\\;\\left[\\frac{x}{8}-\\frac{\\sin(4x)}{32}\\right]_0^{\\pi/2}=\\frac{\\pi}{16}`
        };
      }

      // gen7: ∫_0^(π/2) cos⁴(x) dx = 3π/16
      function gen7() {
        return {
          latex: `\\int_0^{\\pi/2} \\cos^4 x\\,dx`,
          answer: ['3pi/16'],
          hint: 'Which identity for cos² lets you rewrite cos⁴ as a sum of lower-power trig functions?',
          step: `\\cos^4 x=\\left(\\frac{1+\\cos(2x)}{2}\\right)^2=\\frac{3}{8}+\\frac{\\cos(2x)}{2}+\\frac{\\cos(4x)}{8}\\;\\Rightarrow\\;\\left[\\frac{3x}{8}+\\cdots\\right]_0^{\\pi/2}=\\frac{3\\pi}{16}`
        };
      }

      // gen8: ∫_0^(π/2) sin⁴(x)cos³(x) dx = 2/35  (odd cos power)
      function gen8() {
        return {
          latex: `\\int_0^{\\pi/2} \\sin^4 x\\,\\cos^3 x\\,dx`,
          answer: ['2/35'],
          hint: 'When cosine has an odd power, factor out one cosine and rewrite the remaining even power.',
          step: `\\cos^3 x=(1-\\sin^2 x)\\cos x\\;\\Rightarrow\\;u=\\sin x\\;\\Rightarrow\\;\\int_0^1 u^4(1-u^2)\\,du=\\tfrac{1}{5}-\\tfrac{1}{7}=\\frac{2}{35}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_04: Inverse Trig Integrals
  CALC2_SPIRAL["C2_04"] = {
    title: "Inverse Trig Integrals",
    index: 3,
    generators: (function() {
      function norm(s) {
        return s.trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/∞/g, 'inf').replace(/∪/g, 'u');
      }
      function ok(user, acc) { return acc.some(a => norm(user) === norm(a)); }

      // gen1: ∫_0^1 1/(1+x²) dx = π/4
      function gen1() {
        return {
          latex: `\\int_0^1 \\frac{1}{1+x^2}\\,dx`,
          answer: ['pi/4'],
          hint: 'Which standard inverse trig antiderivative applies when the denominator is a sum of 1 and x²?',
          step: `\\left[\\arctan x\\right]_0^1=\\arctan 1-\\arctan 0=\\frac{\\pi}{4}`
        };
      }

      // gen2: ∫_0^√3 1/(1+x²) dx = π/3
      function gen2() {
        return {
          latex: `\\int_0^{\\sqrt{3}} \\frac{1}{1+x^2}\\,dx`,
          answer: ['pi/3'],
          hint: 'What is the antiderivative of 1/(1+x²)? What special angle does the upper limit \u221a3 correspond to in the arctangent?',
          step: `\\left[\\arctan x\\right]_0^{\\sqrt{3}}=\\arctan\\sqrt{3}-0=\\frac{\\pi}{3}`
        };
      }

      // gen3: ∫_0^(1/2) 1/√(1-x²) dx = π/6
      function gen3() {
        return {
          latex: `\\int_0^{1/2} \\frac{1}{\\sqrt{1-x^2}}\\,dx`,
          answer: ['pi/6'],
          hint: 'Which formula gives the antiderivative of 1/√(1-x²), and which angle has sine equal to 1/2?',
          step: `\\left[\\arcsin x\\right]_0^{1/2}=\\arcsin\\tfrac{1}{2}-0=\\frac{\\pi}{6}`
        };
      }

      // gen4: ∫_0^1 1/√(4-x²) dx = π/6
      function gen4() {
        return {
          latex: `\\int_0^1 \\frac{1}{\\sqrt{4-x^2}}\\,dx`,
          answer: ['pi/6'],
          hint: 'When the radicand is a²-x², which inverse trig function appears in the antiderivative?',
          step: `a=2:\\;\\left[\\arcsin\\frac{x}{2}\\right]_0^1=\\arcsin\\frac{1}{2}=\\frac{\\pi}{6}`
        };
      }

      // gen5: ∫_0^2 1/(4+x²) dx = π/8
      function gen5() {
        return {
          latex: `\\int_0^2 \\frac{1}{4+x^2}\\,dx`,
          answer: ['pi/8'],
          hint: 'When the denominator is a²+x², what factor of 1/a appears in front of the arctan result?',
          step: `a=2:\\;\\frac{1}{2}\\left[\\arctan\\frac{x}{2}\\right]_0^2=\\frac{1}{2}\\arctan 1=\\frac{1}{2}\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{8}`
        };
      }

      // gen6: ∫_0^3 1/(9+x²) dx = π/12
      function gen6() {
        return {
          latex: `\\int_0^3 \\frac{1}{9+x^2}\\,dx`,
          answer: ['pi/12'],
          hint: 'When the denominator is 9+x², identify a and recall that the coefficient in front of arctan is 1/a.',
          step: `a=3:\\;\\frac{1}{3}\\left[\\arctan\\frac{x}{3}\\right]_0^3=\\frac{1}{3}\\arctan 1=\\frac{1}{3}\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{12}`
        };
      }

      // gen7: ∫_(-1)^1 1/(1+x²) dx = π/2
      function gen7() {
        return {
          latex: `\\int_{-1}^{1} \\frac{1}{1+x^2}\\,dx`,
          answer: ['pi/2'],
          hint: 'What is the antiderivative of 1/(1+x²), and what is arctan(1) minus arctan(-1)?',
          step: `\\left[\\arctan x\\right]_{-1}^{1}=\\arctan 1-\\arctan(-1)=\\frac{\\pi}{4}-\\left(-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{2}`
        };
      }

      // gen8: Identify a — randomized
      function gen8() {
        const type = choose(['arctan', 'arcsin']);
        if (type === 'arctan') {
          const a = choose([2, 3, 4, 5]);
          const a2 = a * a;
          return {
            latex: `\\text{In }\\displaystyle\\int\\frac{1}{x^2+${a2}}\\,dx=\\frac{1}{a}\\arctan\\!\\left(\\frac{x}{a}\\right)+C,\\text{ find }a.`,
            answer: [String(a)],
            hint: 'Which number, when squared, gives the constant in the denominator?',
            step: `a^2=${a2}\\;\\Rightarrow\\;a=${a}`
          };
        } else {
          const a = choose([3, 4, 5, 6]);
          const a2 = a * a;
          return {
            latex: `\\text{In }\\displaystyle\\int\\frac{1}{\\sqrt{${a2}-x^2}}\\,dx=\\arcsin\\!\\left(\\frac{x}{a}\\right)+C,\\text{ find }a.`,
            answer: [String(a)],
            hint: 'Which number, when squared, gives the constant under the radical?',
            step: `a^2=${a2}\\;\\Rightarrow\\;a=${a}`
          };
        }
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // SKIPPED C2_05 (static)
  // SKIPPED C2_06 (static)
  // SKIPPED C2_07 (static)
  // SKIPPED C2_08 (static)
  // C2_09: Arc Length
  CALC2_SPIRAL["C2_09"] = {
    title: "Arc Length",
    index: 8,
    generators: (function() {

      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_10: Surface Area
  CALC2_SPIRAL["C2_10"] = {
    title: "Surface Area",
    index: 9,
    generators: (function() {

      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_11: Physical Applications
  CALC2_SPIRAL["C2_11"] = {
    title: "Physical Applications",
    index: 10,
    generators: (function() {

      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_12: Moments and Center of Mass
  CALC2_SPIRAL["C2_12"] = {
    title: "Moments and Center of Mass",
    index: 11,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;}
      function frac(n,d){const g=gcd(Math.abs(n),Math.abs(d));const sn=n/g,sd=d/g;return sd===1?String(sn):`${sn}/${sd}`;}

      // gen1: x̄ for f(x)=x on [0,1] → 2/3
      function gen1(){
        return{latex:`\\bar{x}\\text{ for region under }y=x\\text{ on }[0,1]`,
          answer:['2/3'],
          hint:'Which ratio of definite integrals gives the x-coordinate of the centroid for a planar region?',
          step:`\\bar{x}=\\frac{\\int_0^1 x\\cdot x\\,dx}{\\int_0^1 x\\,dx}=\\frac{1/3}{1/2}=\\frac{2}{3}`};}

      // gen2: ȳ for f(x)=x on [0,1] → 1/3
      function gen2(){
        return{latex:`\\bar{y}\\text{ for region under }y=x\\text{ on }[0,1]`,
          answer:['1/3'],
          hint:'How does the integrand for the y-centroid differ from the integrand for the x-centroid?',
          step:`\\bar{y}=\\frac{\\frac{1}{2}\\int_0^1 x^2\\,dx}{\\int_0^1 x\\,dx}=\\frac{1/6}{1/2}=\\frac{1}{3}`};}

      // gen3: x̄ for f(x)=x^2 on [0,1] → 3/4
      function gen3(){
        return{latex:`\\bar{x}\\text{ for region under }y=x^2\\text{ on }[0,1]`,
          answer:['3/4'],
          hint:'For the region under y=x^2, which ratio of integrals over [0,1] gives the x-centroid?',
          step:`\\bar{x}=\\frac{\\int_0^1 x\\cdot x^2\\,dx}{\\int_0^1 x^2\\,dx}=\\frac{1/4}{1/3}=\\frac{3}{4}`};}

      // gen4: ȳ for f(x)=x^2 on [0,1] → 3/10
      function gen4(){
        return{latex:`\\bar{y}\\text{ for region under }y=x^2\\text{ on }[0,1]`,
          answer:['3/10'],
          hint:'The moment about the x-axis involves the square of f(x) — how does that affect the y-centroid?',
          step:`\\bar{y}=\\frac{\\frac{1}{2}\\int_0^1 x^4\\,dx}{\\int_0^1 x^2\\,dx}=\\frac{1/10}{1/3}=\\frac{3}{10}`};}

      // gen5: x̄ for f(x)=h (constant) on [0,b] → b/2
      function gen5(){
        const b=choose([2,4,6]);
        return{latex:`\\bar{x}\\text{ for region under }y=${b===2?2:b}\\text{ on }[0,${b}]`,
          answer:[String(b/2)],
          hint:'For a constant-height rectangle, where does symmetry place the centroid along the x-axis?',
          step:`\\bar{x}=\\frac{\\int_0^{${b}} x\\cdot c\\,dx}{\\int_0^{${b}} c\\,dx}=\\frac{c\\cdot${b}^2/2}{c\\cdot${b}}=\\frac{${b}}{2}=${b/2}`};}

      // gen6: ȳ for f(x)=h (constant) on [0,b] → h/2
      function gen6(){
        const h=choose([2,4,6]);
        return{latex:`\\bar{y}\\text{ for region under }y=${h}\\text{ on }[0,3]`,
          answer:[String(h/2)],
          hint:'For a rectangle of constant height h, where does the centroid lie in the vertical direction?',
          step:`\\bar{y}=\\frac{\\frac{1}{2}\\int_0^3 ${h}^2\\,dx}{\\int_0^3 ${h}\\,dx}=\\frac{${h}^2/2\\cdot3}{${h}\\cdot3}=\\frac{${h}}{2}=${h/2}`};}

      // gen7: x̄ for f(x)=√x on [0,1] → 3/5
      function gen7(){
        return{latex:`\\bar{x}\\text{ for region under }y=\\sqrt{x}\\text{ on }[0,1]`,
          answer:['3/5'],
          hint:'Which two integrals over [0,1] give the x-centroid for the region under y=sqrt(x)?',
          step:`\\bar{x}=\\frac{\\int_0^1 x^{3/2}\\,dx}{\\int_0^1 x^{1/2}\\,dx}=\\frac{2/5}{2/3}=\\frac{3}{5}`};}

      // gen8: ȳ for f(x)=√x on [0,1] → 3/8
      function gen8(){
        return{latex:`\\bar{y}\\text{ for region under }y=\\sqrt{x}\\text{ on }[0,1]`,
          answer:['3/8'],
          hint:'For the region under y=sqrt(x), what does the y-centroid formula produce using the average-height approach?',
          step:`\\bar{y}=\\frac{\\frac{1}{2}\\int_0^1 x\\,dx}{\\int_0^1 x^{1/2}\\,dx}=\\frac{1/4}{2/3}=\\frac{3}{8}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_13: Hyperbolic Functions
  CALC2_SPIRAL["C2_13"] = {
    title: "Hyperbolic Functions",
    index: 12,
    generators: (function() {

      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_14: Integration by Parts
  CALC2_SPIRAL["C2_14"] = {
    title: "Integration by Parts",
    index: 13,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){
        const a=choose([1,2]);const aStr=a===1?'':String(a);
        return{latex:`\\text{For }\\displaystyle\\int xe^{${aStr||''}x}\\,dx,\\text{ which }u\\text{ follows LIATE?}`,answer:['x','u=x'],hint:'In LIATE, which type of function appears first — algebraic or exponential?',step:`u=x,\\quad dv=e^{${aStr||''}x}\\,dx`};
      }
      function gen2(){return{latex:`\\int_0^1 xe^x\\,dx`,answer:['1'],hint:'Which factor should be u so its derivative simplifies the remaining integral?',step:`u=x,\\;dv=e^x\\,dx\\;\\Rightarrow\\;[xe^x-e^x]_0^1=(e-e)-(0-1)=1`};}
      function gen3(){return{latex:`\\int_1^e \\ln x\\,dx`,answer:['1'],hint:'Logarithms top LIATE — what should dv be when only ln x appears?',step:`u=\\ln x,\\;dv=dx\\;\\Rightarrow\\;[x\\ln x-x]_1^e=(e-e)-(0-1)=1`};}
      function gen4(){return{latex:`\\int_0^{\\pi/2}x\\cos x\\,dx`,answer:['pi/2-1','pi/2 - 1'],hint:'Between a polynomial and trig, which is u in LIATE?',step:`u=x,\\;dv=\\cos x\\,dx\\;\\Rightarrow\\;[x\\sin x+\\cos x]_0^{\\pi/2}=\\tfrac{\\pi}{2}-1`};}
      function gen5(){return{latex:`\\int_0^1 x^2e^x\\,dx`,answer:['e-2'],hint:'When the algebraic factor is degree 2, how many IBP applications are needed?',step:`\\text{Tabular: }[x^2e^x-2xe^x+2e^x]_0^1=e-2e+2e-2=e-2`};}
      function gen6(){return{latex:`\\int_0^{\\pi}x\\sin x\\,dx`,answer:['pi'],hint:'Which factor should be u so its derivative disappears?',step:`u=x,\\;dv=\\sin x\\,dx\\;\\Rightarrow\\;[-x\\cos x+\\sin x]_0^{\\pi}=\\pi`};}
      function gen7(){return{latex:`\\int_1^e x\\ln x\\,dx`,answer:['(e^2+1)/4','(e^2 + 1)/4'],hint:'Logarithms rank above algebraic in LIATE — which is u here?',step:`u=\\ln x,\\;dv=x\\,dx\\;\\Rightarrow\\;\\left[\\frac{x^2\\ln x}{2}-\\frac{x^2}{4}\\right]_1^e=\\frac{e^2+1}{4}`};}
      function gen8(){return{latex:`\\text{For }\\displaystyle\\int e^x\\sin x\\,dx,\\text{ how many IBP applications before solving algebraically?}`,answer:['2','twice'],hint:'After one IBP, the new integral resembles the original — what does that suggest?',step:`\\text{Twice: }2\\int e^x\\sin x\\,dx=e^x(\\sin x-\\cos x)\\;\\Rightarrow\\;\\int e^x\\sin x\\,dx=\\tfrac{e^x(\\sin x-\\cos x)}{2}+C`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_15: Trig Substitution
  CALC2_SPIRAL["C2_15"] = {
    title: "Trig Substitution",
    index: 14,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u').replace(/theta/g,'t').replace(/θ/g,'t').replace(/\(/g,'(').replace(/\)/g,')');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      // gen1: substitution for sqrt(a^2-x^2)
      function gen1(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{Which substitution clears }\\sqrt{${a}^2-x^2}\\,?`,
          answer:[`x=${a}sin(t)`,`x=${a}sint`,`x=${a}sin(theta)`],
          hint:'When the integrand contains a radical of the form sqrt(a^2-x^2), which trig identity removes it?',
          step:`x=${a}\\sin\\theta\\Rightarrow\\sqrt{${a}^2-x^2}=\\sqrt{${a}^2(1-\\sin^2\\theta)}=${a}\\cos\\theta`};}

      // gen2: substitution for sqrt(a^2+x^2)
      function gen2(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{Which substitution clears }\\sqrt{${a}^2+x^2}\\,?`,
          answer:[`x=${a}tan(t)`,`x=${a}tant`,`x=${a}tan(theta)`],
          hint:'When the integrand contains a radical of the form sqrt(a^2+x^2), which trig identity is useful?',
          step:`x=${a}\\tan\\theta\\Rightarrow\\sqrt{${a}^2+x^2}=\\sqrt{${a}^2(1+\\tan^2\\theta)}=${a}\\sec\\theta`};}

      // gen3: substitution for sqrt(x^2-a^2)
      function gen3(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{Which substitution clears }\\sqrt{x^2-${a}^2}\\,?`,
          answer:[`x=${a}sec(t)`,`x=${a}sect`,`x=${a}sec(theta)`],
          hint:'When the integrand contains a radical of the form sqrt(x^2-a^2), which trig identity applies?',
          step:`x=${a}\\sec\\theta\\Rightarrow\\sqrt{x^2-${a}^2}=\\sqrt{${a}^2(\\sec^2\\theta-1)}=${a}\\tan\\theta`};}

      // gen4: simplified radical after x=asinθ
      function gen4(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{After }x=${a}\\sin\\theta,\\text{ simplify }\\sqrt{${a}^2-x^2}`,
          answer:[`${a}cos(t)`,`${a}cost`,`${a}costheta`],
          hint:'Which Pythagorean identity involving sine and cosine simplifies the expression under the radical?',
          step:`\\sqrt{${a}^2-${a}^2\\sin^2\\theta}=${a}\\sqrt{1-\\sin^2\\theta}=${a}\\cos\\theta`};}

      // gen5: simplified radical after x=atanθ
      function gen5(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{After }x=${a}\\tan\\theta,\\text{ simplify }\\sqrt{${a}^2+x^2}`,
          answer:[`${a}sec(t)`,`${a}sect`,`${a}sectheta`],
          hint:'Which Pythagorean identity involving tangent and secant simplifies the expression under the radical?',
          step:`\\sqrt{${a}^2+${a}^2\\tan^2\\theta}=${a}\\sqrt{1+\\tan^2\\theta}=${a}\\sec\\theta`};}

      // gen6: simplified radical after x=asecθ
      function gen6(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{After }x=${a}\\sec\\theta,\\text{ simplify }\\sqrt{x^2-${a}^2}`,
          answer:[`${a}tan(t)`,`${a}tant`,`${a}tantheta`],
          hint:'Which Pythagorean identity involving secant and tangent simplifies the expression under the radical?',
          step:`\\sqrt{${a}^2\\sec^2\\theta-${a}^2}=${a}\\sqrt{\\sec^2\\theta-1}=${a}\\tan\\theta`};}

      // gen7: which sub for arcsin result
      function gen7(){
        const a=choose([2,3,4]);
        return{latex:`\\int\\frac{dx}{\\sqrt{${a}^2-x^2}}\\text{ uses substitution }x=\\,?`,
          answer:[`${a}sin(t)`,`${a}sint`,`${a}sinθ`],
          hint:'For an integrand with form 1/sqrt(a^2-x^2), which standard trig substitution leads to arcsin?',
          step:`x=${a}\\sin\\theta\\Rightarrow\\int\\frac{${a}\\cos\\theta\\,d\\theta}{${a}\\cos\\theta}=\\theta+C=\\arcsin\\tfrac{x}{${a}}+C`};}

      // gen8: which sub for arctan result
      function gen8(){
        const a=choose([2,3,4]);
        return{latex:`\\int\\frac{dx}{${a}^2+x^2}\\text{ uses substitution }x=\\,?`,
          answer:[`${a}tan(t)`,`${a}tant`,`${a}tanθ`],
          hint:'For an integrand with form 1/(a^2+x^2), which standard trig substitution leads to arctan?',
          step:`x=${a}\\tan\\theta\\Rightarrow\\int\\frac{${a}\\sec^2\\theta\\,d\\theta}{${a}^2\\sec^2\\theta}=\\frac{1}{${a}}\\theta+C=\\frac{1}{${a}}\\arctan\\tfrac{x}{${a}}+C`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_16: Partial Fraction Decomposition
  CALC2_SPIRAL["C2_16"] = {
    title: "Partial Fraction Decomposition",
    index: 15,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){const pairs=[[1,2],[1,3],[2,3],[1,4],[2,5]];const[a,b]=choose(pairs);const A_den=a-b;const ansStr=A_den===1?'1':A_den===-1?'-1':`1/${A_den}`;return{latex:`\\text{Find }A\\text{: }\\frac{1}{(x-${a})(x-${b})}=\\frac{A}{x-${a}}+\\frac{B}{x-${b}}`,answer:[ansStr,`1/${A_den}`],hint:'What value of x zeroes out the (x−'+a+') factor to isolate A?',step:`\\text{Plug }x=${a}:\\;1=(${a}-${b})A\\;\\Rightarrow\\;A=\\frac{1}{${a-b}}`};}
      function gen2(){const pairs=[[0,2],[1,3],[0,3],[1,4]];const[a,b]=choose(pairs);const B_den=b-a;const ansStr=B_den===1?'1':B_den===-1?'-1':`1/${B_den}`;return{latex:`\\text{Find }B\\text{: }\\frac{1}{(x-${a})(x-${b})}=\\frac{A}{x-${a}}+\\frac{B}{x-${b}}`,answer:[ansStr,`1/${B_den}`],hint:'What value of x zeroes out the (x−'+b+') factor to isolate B?',step:`\\text{Plug }x=${b}:\\;1=(${b}-${a})B\\;\\Rightarrow\\;B=\\frac{1}{${B_den}}`};}
      function gen3(){return{latex:`\\int_2^3\\frac{1}{(x-1)(x+1)}\\,dx`,answer:['(1/2)ln(3/2)','(ln(3/2))/2'],hint:'After decomposing, what antiderivative do each resulting term produce?',step:`\\tfrac{1}{2}[\\ln|x-1|-\\ln|x+1|]_2^3=\\tfrac{1}{2}\\ln\\tfrac{3}{2}`};}
      function gen4(){return{latex:`\\int_0^1\\frac{1}{x^2+3x+2}\\,dx`,answer:['ln(4/3)'],hint:'What is the first step before decomposing a rational integrand?',step:`(x+1)(x+2)\\;\\Rightarrow\\;[\\ln|x+1|-\\ln|x+2|]_0^1=\\ln\\tfrac{4}{3}`};}
      function gen5(){return{latex:`\\text{Find }A\\text{: }\\frac{x}{(x-1)(x-2)}=\\frac{A}{x-1}+\\frac{B}{x-2}`,answer:['-1'],hint:'Which substitution eliminates the B term immediately?',step:`\\text{Plug }x=1:\\;1=(1-2)A\\;\\Rightarrow\\;A=-1`};}
      function gen6(){return{latex:`\\int_1^3\\frac{1}{x(x+2)}\\,dx`,answer:['(1/2)ln(9/5)','(ln(9/5))/2'],hint:'After decomposing 1/(x(x+2)), what simple integrals remain?',step:`\\tfrac{1}{2}[\\ln x-\\ln(x+2)]_1^3=\\tfrac{1}{2}\\ln\\tfrac{9}{5}`};}
      function gen7(){return{latex:`\\text{How many partial fraction terms does }\\frac{1}{(x-1)^2(x+2)}\\text{ require?}`,answer:['3'],hint:'How many terms does a repeated linear factor (x−a)^n contribute?',step:`\\frac{A}{x-1}+\\frac{B}{(x-1)^2}+\\frac{C}{x+2}\\;\\Rightarrow\\;3\\text{ terms}`};}
      function gen8(){return{latex:`\\int_3^5\\frac{x+7}{(x-1)(x+3)}\\,dx`,answer:['ln(3)','ln3'],hint:'Can you decompose the numerator degree-1 integrand directly?',step:`A=2,B=-1\\;\\Rightarrow\\;[2\\ln|x-1|-\\ln|x+3|]_3^5=\\ln 3`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_17: Numerical Methods
  CALC2_SPIRAL["C2_17"] = {
    title: "Numerical Methods",
    index: 16,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){const configs=[{a:0,b:4,n:4},{a:0,b:6,n:3},{a:1,b:5,n:4},{a:0,b:3,n:3}];const{a,b,n}=choose(configs);const dx=(b-a)/n;return{latex:`\\text{For }\\int_${a}^${b}f(x)\\,dx\\text{ with }n=${n}\\text{ subintervals, what is }\\Delta x?`,answer:[String(dx),`${b-a}/${n}`],hint:'How is the subinterval width computed from the endpoints and number of partitions?',step:`\\Delta x=\\frac{${b}-${a}}{${n}}=${dx}`};}
      function gen2(){return{latex:`\\text{Use }M_2\\text{ to approximate }\\int_0^2 x\\,dx\\;(n=2)`,answer:['2'],hint:'Where are the midpoints of the two subintervals on [0,2]?',step:`\\Delta x=1,\\;\\bar x_1=0.5,\\bar x_2=1.5\\;\\Rightarrow\\;M_2=1\\cdot(0.5+1.5)=2`};}
      function gen3(){return{latex:`\\text{Use }T_2\\text{ to approximate }\\int_0^2 x^2\\,dx\\;(n=2)`,answer:['3'],hint:'What is the coefficient pattern for endpoints vs. interior points in the Trapezoidal Rule?',step:`T_2=\\tfrac{1}{2}[f(0)+2f(1)+f(2)]=\\tfrac{1}{2}(0+2+4)=3`};}
      function gen4(){return{latex:`\\text{Use }S_2\\text{ to approximate }\\int_0^2 x^2\\,dx\\;(n=2)`,answer:['8/3'],hint:"What coefficient does the interior point receive in Simpson's Rule with n=2?",step:`S_2=\\tfrac{1}{3}[f(0)+4f(1)+f(2)]=\\tfrac{1}{3}(0+4+4)=\\tfrac{8}{3}\\text{ (exact!)}`};}
      function gen5(){return{latex:`\\text{Use }T_2\\text{ to approximate }\\int_1^3\\frac{1}{x}\\,dx\\;(n=2)`,answer:['7/6'],hint:'After computing Δx and nodes x₀=1, x₁=2, x₂=3, what are f(1), f(2), f(3)?',step:`T_2=\\tfrac{1}{2}[f(1)+2f(2)+f(3)]=\\tfrac{1}{2}\\left(1+1+\\tfrac{1}{3}\\right)=\\tfrac{7}{6}`};}
      function gen6(){return{latex:`\\text{Use }M_2\\text{ to approximate }\\int_0^4 x^2\\,dx\\;(n=2)`,answer:['20'],hint:'With n=2 on [0,4], what are the two midpoints where you evaluate f?',step:`\\Delta x=2,\\;\\bar x_1=1,\\;\\bar x_2=3\\;\\Rightarrow\\;M_2=2(1+9)=20`};}
      function gen7(){const n=choose([4,6,8,10]);return{latex:`T_{${n}}\\text{ requires how many function evaluations?}`,answer:[String(n+1)],hint:'The Trapezoidal Rule uses f at each node x₀,x₁,…,xₙ — how many distinct nodes are there?',step:`T_n\\text{ uses }x_0,\\ldots,x_n:\\;n+1=${n+1}\\text{ evaluations}`};}
      function gen8(){return{latex:`\\text{For the same }n,\\text{ which is more accurate for a smooth function: }T_n\\text{ or }S_n\\text{?}`,answer:['sn','s_n','simpsons',"simpson's"],hint:"Which shape does Simpson's Rule use to approximate the curve — a line or a parabola?",step:`S_n\\text{ error }O(n^{-4})\\text{ vs }T_n\\text{ error }O(n^{-2})\\;\\Rightarrow\\;S_n\\text{ is more accurate}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_18: Improper Integrals
  CALC2_SPIRAL["C2_18"] = {
    title: "Improper Integrals",
    index: 17,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){const configs=[{p:2,verdict:'convergent',val:'1',step:'\\left[-\\frac{1}{x}\\right]_1^\\infty=1'},{p:3,verdict:'convergent',val:'1/2',step:'\\left[-\\frac{1}{2x^2}\\right]_1^\\infty=\\frac{1}{2}'},{p:'1/2',verdict:'divergent',val:null,step:'\\left[2\\sqrt{x}\\right]_1^\\infty\\to\\infty'},{p:1,verdict:'divergent',val:null,step:'\\left[\\ln x\\right]_1^\\infty\\to\\infty'}];const c=choose(configs);const ans=c.verdict==='convergent'?[c.verdict,c.val]:[c.verdict];return{latex:`\\int_1^{\\infty}\\frac{1}{x^{${c.p}}}\\,dx\\quad\\text{(convergent or divergent?)}`,answer:ans.filter(Boolean),hint:'What does the p-integral test say about the threshold value of p for convergence?',step:`${c.step}\\;\\Rightarrow\\;\\textbf{${c.verdict}}`};}
      function gen2(){return{latex:`\\int_0^{\\infty}e^{-x}\\,dx`,answer:['1'],hint:'Replace the upper limit with t and integrate, then take the limit as t goes to infinity.',step:`\\lim_{t\\to\\infty}[-e^{-x}]_0^t=\\lim_{t\\to\\infty}(1-e^{-t})=1`};}
      function gen3(){return{latex:`\\int_1^{\\infty}\\frac{1}{x}\\,dx\\quad\\text{(convergent or divergent?)}`,answer:['divergent'],hint:'What is the antiderivative of 1/x, and what happens as x grows without bound?',step:`\\lim_{t\\to\\infty}[\\ln x]_1^t=\\infty\\;\\Rightarrow\\;\\textbf{divergent}`};}
      function gen4(){return{latex:`\\int_0^1\\frac{1}{\\sqrt{x}}\\,dx`,answer:['2'],hint:'The integrand blows up at x=0 — how do you handle a Type II improper integral?',step:`\\lim_{t\\to 0^+}[2\\sqrt{x}]_t^1=2-0=2`};}
      function gen5(){return{latex:`\\int_{-\\infty}^{0}e^x\\,dx`,answer:['1'],hint:'Replace the lower limit with t and let t go to negative infinity — what is the limit of e^t?',step:`\\lim_{t\\to-\\infty}[e^x]_t^0=1-\\lim_{t\\to-\\infty}e^t=1`};}
      function gen6(){return{latex:`\\int_1^{\\infty}\\frac{1}{x^2}\\,dx`,answer:['1'],hint:'What is the antiderivative of x^(-2), and does the limit at infinity exist?',step:`\\lim_{t\\to\\infty}\\left[-\\frac{1}{x}\\right]_1^t=0+1=1`};}
      function gen7(){return{latex:`\\int_0^{\\infty}xe^{-x}\\,dx`,answer:['1'],hint:'This integral requires integration by parts — which factor should be u?',step:`\\text{IBP: }[-xe^{-x}-e^{-x}]_0^\\infty=(0+0)-(0-1)=1`};}
      function gen8(){return{latex:`\\int_{-\\infty}^{\\infty}\\frac{1}{1+x^2}\\,dx`,answer:['pi'],hint:'What familiar inverse-trig antiderivative appears, and what are its limits as x goes to ±∞?',step:`[\\arctan x]_{-\\infty}^{\\infty}=\\frac{\\pi}{2}-\\left(-\\frac{\\pi}{2}\\right)=\\pi`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_19: Introduction to Differential Equations
  CALC2_SPIRAL["C2_19"] = {
    title: "Introduction to Differential Equations",
    index: 18,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){
        const a=choose([2,3,4,5]),b=choose([1,2,3]);
        return{latex:`\\text{What is the order of }\\quad \\frac{dy}{dx} + ${a}y = ${b}x\\,?`,
          answer:['1'],hint:"What does the order of a differential equation measure about its derivatives?",
          step:`\\text{The highest derivative is }\\frac{dy}{dx}\\text{ (first derivative).}\\\\\\text{Order} = 1`};
      }
      function gen2(){
        const a=choose([1,4,9,16]);
        return{latex:`\\text{What is the order of }\\quad y'' + ${a}y = 0\\,?`,
          answer:['2'],hint:"Which derivative in the equation carries the most primes — what does that count tell you?",
          step:`\\text{The highest derivative is }y''\\text{ (second derivative).}\\\\\\text{Order} = 2`};
      }
      function gen3(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{Does }y = e^{${a}x}\\text{ satisfy }\\;y' - ${a}y = 0\\,? (yes/no)`,
          answer:['yes'],hint:"Does computing the derivative of this function and comparing both sides of the equation reveal a balance?",
          step:`y' = ${a}e^{${a}x},\\quad y'-${a}y = ${a}e^{${a}x}-${a}e^{${a}x}=0\\;\\checkmark`};
      }
      function gen4(){
        const a=choose([1,2,3]),a2=a*a;
        return{latex:`\\text{Does }y = \\cos(${a===1?'':a}x)\\text{ satisfy }\\;y'' + ${a2}y = 0\\,? (yes/no)`,
          answer:['yes'],hint:"What is the second derivative of a cosine function — and how does it relate to cosine itself?",
          step:`y' = -${a}\\sin(${a===1?'':a}x),\\;y'' = -${a2}\\cos(${a===1?'':a}x)\\\\y''+${a2}y = -${a2}\\cos(${a===1?'':a}x)+${a2}\\cos(${a===1?'':a}x)=0\\;\\checkmark`};
      }
      function gen5(){
        return{latex:`\\text{Is }\\;\\frac{dy}{dx} + xy = x^2\\;\\text{ linear or nonlinear?}`,
          answer:['linear'],hint:"Does y appear raised to a power other than 1, or multiplied by itself or its derivative?",
          step:`y\\text{ and }y'\\text{ each appear to the first power — this is a linear first-order DE.}`};
      }
      function gen6(){
        return{latex:`\\text{Is }\\;\\frac{dy}{dx} = y^2\\;\\text{ linear or nonlinear?}`,
          answer:['nonlinear'],hint:"Does y appear raised to a power other than 1, or multiplied by itself or its derivative?",
          step:`y^2\\text{ is degree 2 in }y\\text{ — this is a nonlinear DE.}`};
      }
      function gen7(){
        const a=choose([2,3,4,5]),b=choose([1,2,3]);
        return{latex:`\\text{What is the order of }\\quad y''' - ${a}y' + ${b}y = 0\\,?`,
          answer:['3'],hint:"Scan every term — which term has the most derivatives on y?",
          step:`\\text{The highest derivative is }y'''\\text{ (third derivative).}\\\\\\text{Order} = 3`};
      }
      function gen8(){
        return{latex:`\\text{A general solution }y = Ae^{2x}+Be^{-x}\\text{ has how many arbitrary constants?}`,
          answer:['2'],hint:"How many arbitrary constants appear here — what does that number reveal about the DE's order?",
          step:`A\\text{ and }B\\text{ are two arbitrary constants, so this is the general solution of a second-order DE.}`};
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_20: Direction Fields
  CALC2_SPIRAL["C2_20"] = {
    title: "Direction Fields",
    index: 19,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      // gen1: equilibrium of k(y-a) → y=a
      function gen1(){
        const k=choose([2,3,4]),a=choose([2,3,4,5,6]);
        return{latex:`\\text{Find the equilibrium solution of }\\frac{dy}{dx}=${k}(y-${a})`,
          answer:[String(a)],
          hint:'An equilibrium solution is where dy/dx equals zero — what value of y satisfies that condition?',
          step:`${k}(y-${a})=0\\Rightarrow y=${a}`};}

      // gen2: nonzero equilibrium of y(y-c)
      function gen2(){
        const c=choose([2,3,4,5]);
        return{latex:`\\text{Find the nonzero equilibrium of }\\frac{dy}{dx}=y(y-${c})`,
          answer:[String(c)],
          hint:'Which value of y, other than zero, makes the right-hand side equal zero?',
          step:`y(y-${c})=0\\Rightarrow y=0\\text{ or }y=${c}.\\text{ Nonzero: }y=${c}`};}

      // gen3: y=0 is unstable in y(a-y), a>0
      function gen3(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{For }\\frac{dy}{dx}=y(${a}-y),\\text{ classify the equilibrium }y=0`,
          answer:['unstable'],
          hint:'For nearby solutions with y slightly above 0, does dy/dx push y toward or away from the equilibrium?',
          step:`\\text{For small }y>0:\\;y(${a}-y)>0\\Rightarrow y\\text{ increases away from 0}\\Rightarrow\\text{unstable.}`};}

      // gen4: y=a is stable in y(a-y)
      function gen4(){
        const a=choose([2,3,4,5]);
        return{latex:`\\text{For }\\frac{dy}{dx}=y(${a}-y),\\text{ classify the equilibrium }y=${a}`,
          answer:['stable'],
          hint:'For solutions slightly above or below the equilibrium, does dy/dx push them back toward it?',
          step:`\\text{Above }y=${a}:\\;${a}-y<0\\Rightarrow dy/dx<0.\\;\\text{Below: }dy/dx>0.\\Rightarrow\\text{stable.}`};}

      // gen5: Euler step with constant slope
      function gen5(){
        const a=choose([2,3,4]),y0=choose([1,2,3,5]),h=1;
        return{latex:`\\frac{dy}{dx}=${a},\\;y(0)=${y0},\\;h=1.\\text{ Find }y(1)\\text{ by Euler method.}`,
          answer:[String(y0+a)],
          hint:'In Euler method, each new y equals the old y plus the step size times the current slope — what is the slope here?',
          step:`y(1)=${y0}+1\\cdot${a}=${y0+a}`};}

      // gen6: Euler step: dy/dx=y, y(0)=y0, h=0.5 → 1.5*y0
      function gen6(){
        const y0=choose([2,4,6]);
        return{latex:`\\frac{dy}{dx}=y,\\;y(0)=${y0},\\;h=0.5.\\text{ Find }y(0.5)\\text{ by Euler method.}`,
          answer:[String(1.5*y0)],
          hint:'Euler method uses the current slope to project forward — what slope does dy/dx=y produce at y(0)?',
          step:`y(0.5)=${y0}+0.5\\cdot${y0}=${1.5*y0}`};}

      // gen7: Euler step: dy/dx=-2y, y(0)=c, h=0.5 → 0
      function gen7(){
        const c=choose([2,4,6]);
        return{latex:`\\frac{dy}{dx}=-2y,\\;y(0)=${c},\\;h=0.5.\\text{ Find }y(0.5)\\text{ by Euler method.}`,
          answer:['0'],
          hint:'What does Euler method predict when the slope is proportional to the current y-value and negative?',
          step:`y(0.5)=${c}+0.5\\cdot(-2\\cdot${c})=${c}-${c}=0`};}

      // gen8: Two Euler steps with constant dy/dx=k
      function gen8(){
        const k=choose([2,3,4]),y0=choose([0,1,2]),h=1;
        return{latex:`\\frac{dy}{dx}=${k},\\;y(0)=${y0},\\;h=1.\\text{ Find }y(2)\\text{ using two Euler steps.}`,
          answer:[String(y0+2*k)],
          hint:'When the slope is constant, how does Euler method accumulate change over multiple steps?',
          step:`y(1)=${y0}+${k}=${y0+k},\\quad y(2)=${y0+k}+${k}=${y0+2*k}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_21: Separable Equations
  CALC2_SPIRAL["C2_21"] = {
    title: "Separable Equations",
    index: 20,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){
        const a=choose([1,2,3,4]),y0=choose([1,2,3,4,5]);
        const ans=4*a+y0;
        return{latex:`\\frac{dy}{dx} = ${a===1?'':2*a}x,\\quad y(0)=${y0}.\\quad\\text{Find }y(2).`,
          answer:[String(ans)],hint:"Separate and integrate — the result is a polynomial. Which constant does the initial condition pin down?",
          step:`\\int dy = \\int ${a===1?'':2*a}x\\,dx \\;\\Rightarrow\\; y = ${a}x^2+C.\\\\y(0)=${y0}\\Rightarrow C=${y0}.\\quad y(2)=${a}(4)+${y0}=${ans}`};
      }
      function gen2(){
        const y0=choose([1,2,3]);
        return{latex:`\\frac{dy}{dx} = y,\\quad y(0)=${y0}.\\quad\\text{Find }y(0)\\text{ (state the value)}.`,
          answer:[String(y0)],hint:"What does an initial condition directly tell you about the solution?",
          step:`y(0)=${y0}\\text{ is given directly by the initial condition.}`};
      }
      function gen3(){
        const mult=choose([2,3,4,6]);
        const ans=mult/2;
        const ansStr=Number.isInteger(ans)?String(ans):`${mult}/2`;
        return{latex:`\\frac{dy}{dx} = -y,\\quad y(0)=${mult}.\\quad\\text{Find }y(\\ln 2).`,
          answer:[ansStr, String(ans)],hint:"The solution is exponential decay — what happens to e^{-x} when x = ln 2?",
          step:`y=${mult}e^{-x}.\\quad y(\\ln 2)=${mult}e^{-\\ln 2}=${mult}\\cdot\\tfrac{1}{2}=${ansStr}`};
      }
      function gen4(){
        const c=choose([0,1,2,3]);
        const ans=8+c;
        return{latex:`\\frac{dy}{dx} = 2x,\\quad y(1)=${c}.\\quad\\text{Find }y(3).`,
          answer:[String(ans)],hint:"Is the initial condition at x=0 here — or at a different point that changes how C is found?",
          step:`y=x^2+C.\\quad y(1)=1+C=${c}\\Rightarrow C=${c-1}.\\\\y(3)=9+${c-1}=${ans}`};
      }
      function gen5(){
        return{latex:`\\frac{dy}{dx} = \\cos x,\\quad y(0)=0.\\quad\\text{Find }y\\!\\left(\\tfrac{\\pi}{2}\\right).`,
          answer:['1'],hint:"Which familiar antiderivative comes from cos x — and what is that function at pi/2?",
          step:`y=\\sin x+C.\\quad y(0)=0\\Rightarrow C=0.\\quad y\\!\\left(\\tfrac{\\pi}{2}\\right)=\\sin\\tfrac{\\pi}{2}=1`};
      }
      function gen6(){
        return{latex:`\\frac{dy}{dx} = y^2,\\quad y(0)=1.\\quad\\text{Find }y\\!\\left(\\tfrac{1}{2}\\right).`,
          answer:['2'],hint:"When dy/dx = y^2, which side of the separated form contains y and which contains x?",
          step:`\\int y^{-2}\\,dy=\\int dx\\;\\Rightarrow\\;-y^{-1}=x+C.\\\\y(0)=1\\Rightarrow C=-1.\\;y=\\tfrac{1}{1-x}.\\;y(\\tfrac{1}{2})=2`};
      }
      function gen7(){
        return{latex:`\\frac{dy}{dx} = \\frac{x}{y},\\quad y(0)=2.\\quad\\text{Find }y(\\sqrt{5}).`,
          answer:['3'],hint:"When the variables are separated, which side contains y and which side contains x?",
          step:`y\\,dy=x\\,dx\\;\\Rightarrow\\;\\tfrac{y^2}{2}=\\tfrac{x^2}{2}+C.\\\\y(0)=2\\Rightarrow C=2.\\;y^2=x^2+4.\\;y(\\sqrt{5})=\\sqrt{9}=3`};
      }
      function gen8(){
        const k=choose([2,3,4,5]);
        return{latex:`\\frac{dy}{dx} = ${k}y.\\quad\\text{How many arbitrary constants in the general solution?}`,
          answer:['1'],hint:"How many independent integrations does solving this separable equation require — and what does each introduce?",
          step:`\\text{Separating: }\\ln|y|=${k}x+C_1\\Rightarrow y=Ce^{${k}x}.\\\\\\text{One arbitrary constant }C.`};
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_22: Sequences
  CALC2_SPIRAL["C2_22"] = {
    title: "Sequences",
    index: 21,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){
        const a1=choose([1,2,3,4,5]),d=choose([2,3,4,5]);
        const a5=a1+4*d;
        return{latex:`\\text{Arithmetic sequence: }a_1=${a1},\\;d=${d}.\\quad\\text{Find }a_5.`,
          answer:[String(a5)],hint:"What determines the nth term of an arithmetic sequence — only the starting value, the common difference, or both?",
          step:`a_5=a_1+4d=${a1}+4(${d})=${a5}`};
      }
      function gen2(){
        const a1=choose([1,2,3]),r=choose([2,3]);
        const a4=a1*r*r*r;
        return{latex:`\\text{Geometric sequence: }a_1=${a1},\\;r=${r}.\\quad\\text{Find }a_4.`,
          answer:[String(a4)],hint:"What determines the nth term of a geometric sequence — only the ratio, the starting value, or both together?",
          step:`a_4=a_1\\cdot r^3=${a1}\\cdot ${r}^3=${a4}`};
      }
      function gen3(){
        const k=choose([1,2,3,4,5]);
        return{latex:`\\lim_{n\\to\\infty}\\frac{n}{n+${k}}`,
          answer:['1'],hint:"What happens to a ratio of two polynomials of equal degree as n grows without bound?",
          step:`\\frac{n}{n+${k}}=\\frac{1}{1+${k}/n}\\xrightarrow{n\\to\\infty}\\frac{1}{1+0}=1`};
      }
      function gen4(){
        const a=choose([1,2,3,5]),p=choose([1,2]);
        const pStr=p===1?'n':`n^${p}`;
        return{latex:`\\lim_{n\\to\\infty}\\frac{${a}}{${pStr}}`,
          answer:['0'],hint:"What happens to a fixed number divided by a quantity that grows without bound?",
          step:`\\frac{${a}}{${pStr}}\\to 0\\text{ as }n\\to\\infty`};
      }
      function gen5(){
        const a=choose([1,2,3]),c=choose([2,3,4]);
        const g=(x,y)=>{let a=x,b=y;while(b){[a,b]=[b,a%b];}return a;};
        const gc=g(a,c);
        const ansStr=a/gc===1&&c/gc===1?'1':`${a/gc}/${c/gc}`;
        return{latex:`\\lim_{n\\to\\infty}\\frac{${a}n^2+3n}{${c}n^2+1}`,
          answer:[ansStr, String(a/c)],hint:"Which terms dominate as n grows large — how do the leading-degree terms in numerator and denominator compare?",
          step:`\\frac{${a}n^2+3n}{${c}n^2+1}\\approx\\frac{${a}n^2}{${c}n^2}=\\frac{${a/gc}}{${c/gc}}\\quad(n\\to\\infty)`};
      }
      function gen6(){
        return{latex:`\\text{Does }\\left\\{(-1)^n\\right\\}\\text{ converge or diverge?}`,
          answer:['divergent','diverges'],hint:"Does this sequence approach a single fixed value, or does it keep switching between two values?",
          step:`(-1)^n\\text{ alternates between }1\\text{ and }-1.\\\\\\text{No limit exists — the sequence diverges.}`};
      }
      function gen7(){
        const r_vals=[['1/2','\\tfrac{1}{2}'],['1/3','\\tfrac{1}{3}'],['2/3','\\tfrac{2}{3}']];
        const [rStr,rTex]=choose(r_vals);
        return{latex:`\\text{Does }\\left\\{\\left(${rTex}\\right)^n\\right\\}\\text{ converge or diverge?  If convergent, give the limit.}`,
          answer:['convergent','converges','0'],hint:"When the common ratio satisfies |r| < 1, what does r^n approach as n grows?",
          step:`\\left|${rTex}\\right|<1\\Rightarrow\\left(${rTex}\\right)^n\\to 0.\\quad\\text{Convergent, limit}=0`};
      }
      function gen8(){
        const a1=choose([2,4,6,8,10]),d=choose([2,3,4]);
        const n=choose([3,4,5,6]);
        const an=a1+(n-1)*d;
        return{latex:`\\text{Arithmetic: }a_1=${a1},\\;a_${n}=${an}.\\quad\\text{Find }d.`,
          answer:[String(d)],hint:"What relationship connects the nth term, the starting value, and the common difference of an arithmetic sequence?",
          step:`a_${n}=a_1+(${n}-1)d\\Rightarrow ${an}=${a1}+(${n-1})d\\Rightarrow d=${d}`};
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_23: Series
  CALC2_SPIRAL["C2_23"] = {
    title: "Series",
    index: 22,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      function gen1(){
        const a=choose([1,2,3,4,6]),rn=choose([1,2,1,1,2]),rd=choose([2,3,2,4,3]);
        const num=a*rd, den=rd-rn;
        const g=(x,y)=>{let a=Math.abs(x),b=Math.abs(y);while(b){[a,b]=[b,a%b];}return a;};
        const gc=g(num,den);
        const ansNum=num/gc, ansDen=den/gc;
        const ansStr=ansDen===1?String(ansNum):`${ansNum}/${ansDen}`;
        const rStr=rn===1?`\\tfrac{1}{${rd}}`:`\\tfrac{${rn}}{${rd}}`;
        return{latex:`\\sum_{n=0}^{\\infty} ${a===1?'':a}\\!\\left(${rStr}\\right)^{\\!n}`,
          answer:[ansStr],hint:"Which formula gives the sum of an infinite geometric series — and what two quantities does it require?",
          step:`a=${a},\\;r=${rStr}.\\;|r|<1\\Rightarrow S=\\dfrac{${a}}{1-${rStr}}=${ansStr}`};
      }
      function gen2(){
        const a=choose([1,2,4]);
        const rs=choose([[1,2],[1,3]]);
        const [rn2,rd2]=rs;
        const r3n=rn2**3, r3d=rd2**3;
        const numS=a*(r3d-r3n)*rd2;
        const denS=r3d*(rd2-rn2);
        const g=(x,y)=>{let a=Math.abs(x),b=Math.abs(y);while(b){[a,b]=[b,a%b];}return a;};
        const gc2=g(numS,denS);
        const fN=numS/gc2, fD=denS/gc2;
        const aStr=a===1?'':String(a);
        const rTex=`\\tfrac{${rn2}}{${rd2}}`;
        return{latex:`\\text{Find }S_3\\text{ for }\\displaystyle\\sum_{n=0}^{\\infty}${aStr}\\!\\left(${rTex}\\right)^{\\!n}`,
          answer:[fD===1?String(fN):`${fN}/${fD}`],hint:"The partial sum of a geometric series has a closed-form formula — which quantities go into it?",
          step:`S_3=${a}\\cdot\\dfrac{1-(${rTex})^3}{1-${rTex}}=${fD===1?String(fN):`\\tfrac{${fN}}{${fD}}`}`};
      }
      function gen3(){
        const r=choose([2,3,4]);
        return{latex:`\\text{Does }\\displaystyle\\sum_{n=0}^{\\infty}${r}^n\\text{ converge or diverge?}`,
          answer:['divergent','diverges'],hint:"What condition on the ratio r determines whether a geometric series converges?",
          step:`|r|=${r}\\geq 1\\Rightarrow\\text{the series diverges.}`};
      }
      function gen4(){
        const a=choose([1,2,3]);
        const ans=a*2;
        return{latex:`\\sum_{n=0}^{\\infty} ${a===1?'':a}\\!\\left(\\tfrac{1}{2}\\right)^n`,
          answer:[String(ans)],hint:"Which of the two key parameters of a geometric series controls whether the sum formula applies?",
          step:`a=${a},\\;r=\\tfrac{1}{2}.\\quad S=\\dfrac{${a}}{1-\\tfrac{1}{2}}=${ans}`};
      }
      function gen5(){
        const a1=choose([1,2,3,4,5]),d=choose([1,2,3]);
        const S4=4*a1+6*d;
        return{latex:`\\text{Find }S_4\\text{ for: }${a1}+${a1+d}+${a1+2*d}+\\cdots`,
          answer:[String(S4)],hint:"What is the sum of four consecutive terms of an arithmetic series, given the starting value and common difference?",
          step:`S_4=${a1}+${a1+d}+${a1+2*d}+${a1+3*d}=${S4}`};
      }
      function gen6(){
        const a=choose([3,6,9,12]);
        const num=2*a, den=3;
        const g=(x,y)=>{let a=x,b=y;while(b){[a,b]=[b,a%b];}return a;};
        const gc=g(num,den);
        const ansStr=den/gc===1?String(num/gc):`${num/gc}/${den/gc}`;
        return{latex:`\\sum_{n=0}^{\\infty} ${a}\\!\\left(-\\tfrac{1}{2}\\right)^n`,
          answer:[ansStr],hint:"A negative ratio still works in the geometric series formula — does |r| < 1 hold here?",
          step:`a=${a},\\;r=-\\tfrac{1}{2}.\\;|r|<1.\\;S=\\dfrac{${a}}{\\tfrac{3}{2}}=${ansStr}`};
      }
      function gen7(){
        const a=choose([1,2,3,4,5]),b=choose([1,2,3]);
        return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${a}n}{${b}n+1}\\text{ converge or diverge?}`,
          answer:['divergent','diverges'],hint:"Before testing for convergence, what must be true of the terms themselves for the series to have a chance of converging?",
          step:`\\lim_{n\\to\\infty}\\frac{${a}n}{${b}n+1}=\\frac{${a}}{${b}}\\neq 0\\Rightarrow\\text{diverges by the Divergence Test.}`};
      }
      function gen8(){
        const a=choose([2,4,6,8]),rd=choose([3,4]);
        const num=a*rd, den=rd-1;
        const g=(x,y)=>{let a=x,b=y;while(b){[a,b]=[b,a%b];}return a;};
        const gc=g(num,den);
        const ansStr=den/gc===1?String(num/gc):`${num/gc}/${den/gc}`;
        return{latex:`\\sum_{n=0}^{\\infty} ${a}\\!\\left(\\tfrac{1}{${rd}}\\right)^n`,
          answer:[ansStr],hint:"Which formula gives the exact sum of a convergent geometric series in terms of a and r?",
          step:`a=${a},\\;r=\\tfrac{1}{${rd}}.\\;S=\\dfrac{${a}}{1-\\tfrac{1}{${rd}}}=${ansStr}`};
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_24: Divergence and Integral Tests
  CALC2_SPIRAL["C2_24"] = {
    title: "Divergence and Integral Tests",
    index: 23,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){const a=choose([2,3,5,7]),b=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${a}n+${b}}{n+1}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'What does the Divergence Test say about a series whose terms do not approach zero?',step:`\\lim_{n\\to\\infty}\\frac{${a}n+${b}}{n+1}=${a}\\neq 0\\Rightarrow\\text{diverges by Divergence Test.}`};}
      function gen2(){const p=choose([2,3,4,5]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${p}}}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'For a p-series, what condition on the exponent guarantees convergence?',step:`p=${p}>1\\Rightarrow\\text{convergent }p\\text{-series.}`};}
      function gen3(){const pairs=[[1,2],[1,3],[2,3],[3,4]];const [pn,pd]=choose(pairs);const pStr=`\\tfrac{${pn}}{${pd}}`;return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${pStr}}}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'For a p-series, what boundary value of the exponent separates convergence from divergence?',step:`p=${pStr}\\leq 1\\Rightarrow\\text{divergent }p\\text{-series.}`};}
      function gen4(){const c=choose([2,3,5]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${c}}{n}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'Constant multiples do not affect convergence — what type of series has terms proportional to 1/n?',step:`${c}\\cdot\\sum\\frac{1}{n}\\text{ is }${c}\\times\\text{harmonic series}\\Rightarrow\\text{diverges.}`};}
      function gen5(){const p=choose([2,3,4]);return{latex:`\\text{What does the Divergence Test conclude about }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${p}}}\\text{?}`,answer:['inconclusive'],hint:'The Divergence Test only proves divergence — what happens when the limit of terms equals zero?',step:`\\lim_{n\\to\\infty}\\frac{1}{n^{${p}}}=0\\Rightarrow\\text{Divergence Test is inconclusive.}`};}
      function gen6(){const ans=choose(['convergent','divergent']);const p=ans==='convergent'?choose([3,4,5,3/2]):choose([1,'1/2']);const pDisp=p===3/2?'\\tfrac{3}{2}':(p==='1/2'?'\\tfrac{1}{2}':String(p));return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}n^{-${pDisp}}\\text{ converge or diverge?}`,answer:[ans,ans==='convergent'?'converges':'diverges'],hint:'When written as 1/n^p, what value of p determines whether the series converges or diverges?',step:`n^{-${pDisp}}=\\frac{1}{n^{${pDisp}}},\\; p=${pDisp}${ans==='convergent'?'>1\\Rightarrow\\text{convergent}':'\\leq1\\Rightarrow\\text{divergent}'}`};}
      function gen7(){const p=choose([2,3,4]);return{latex:`\\text{Using the Integral Test, evaluating }\\displaystyle\\int_1^{\\infty}\\frac{1}{x^{${p}}}\\,dx\\text{ shows }\\sum\\frac{1}{n^{${p}}}\\text{ is:}`,answer:['convergent','converges'],hint:'What does the Integral Test say about the link between a series and its associated improper integral?',step:`\\int_1^{\\infty}x^{-${p}}\\,dx=\\left[\\frac{x^{${1-p}}}{${1-p}}\\right]_1^{\\infty}=\\frac{1}{${p-1}}\\Rightarrow\\text{converges.}`};}
      function gen8(){const a=choose([2,3]),b=choose([2,3,4]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${a}^n}{n^{${b}}}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'What condition must the terms of any convergent series satisfy as n grows without bound?',step:`\\lim_{n\\to\\infty}\\frac{${a}^n}{n^{${b}}}=\\infty\\neq 0\\Rightarrow\\text{diverges by Divergence Test.}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_25: Comparison Tests
  CALC2_SPIRAL["C2_25"] = {
    title: "Comparison Tests",
    index: 24,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){const c=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${c}}{n^2+${c}}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Which simpler series has terms that dominate these, and is that comparison series known to converge?',step:`\\frac{${c}}{n^2+${c}}<\\frac{${c}}{n^2}.\\;\\sum\\frac{${c}}{n^2}\\text{ converges }(p=2>1)\\Rightarrow\\text{convergent by DCT.}`};}
      function gen2(){const a=choose([1,2,3]),b=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${a}n+${b}}{n^2+1}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'Which p-series does the dominant behavior of these terms resemble for large n?',step:`\\lim_{n\\to\\infty}\\frac{(${a}n+${b})/(n^2+1)}{1/n}=${a}\\in(0,\\infty).\\;\\sum\\frac{1}{n}\\text{ diverges}\\Rightarrow\\text{divergent by LCT.}`};}
      function gen3(){const a=choose([1,2,3]),b=choose([2,3,4]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${a}}{${b}n^2-1}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'For large n, which familiar p-series matches the growth rate of these terms?',step:`\\lim_{n\\to\\infty}\\frac{${a}/(${b}n^2-1)}{1/n^2}=\\frac{${a}}{${b}}\\in(0,\\infty).\\;\\sum\\frac{1}{n^2}\\text{ converges}\\Rightarrow\\text{convergent by LCT.}`};}
      function gen4(){return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{\\sin^2 n}{n^2}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Since sin squared of n is bounded above by 1, which well-known convergent series provides a valid upper bound?',step:`0\\leq\\frac{\\sin^2 n}{n^2}\\leq\\frac{1}{n^2}.\\;\\sum\\frac{1}{n^2}\\text{ converges}\\Rightarrow\\text{convergent by DCT.}`};}
      function gen5(){return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{\\sqrt{n}+1}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'For large n, which p-series best captures the long-run behavior of 1/(sqrt(n)+1)?',step:`\\lim_{n\\to\\infty}\\frac{1/(\\sqrt{n}+1)}{1/\\sqrt{n}}=1\\in(0,\\infty).\\;\\sum\\frac{1}{\\sqrt{n}}\\text{ diverges }(p=\\tfrac{1}{2}\\leq1)\\Rightarrow\\text{divergent by LCT.}`};}
      function gen6(){return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n\\cdot 2^n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Can you find a convergent geometric series whose terms are larger than these?',step:`\\frac{1}{n\\cdot2^n}\\leq\\frac{1}{2^n}.\\;\\sum\\frac{1}{2^n}\\text{ converges (geometric, }|r|<1)\\Rightarrow\\text{convergent by DCT.}`};}
      function gen7(){const c=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${c}n}{n^3+1}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Which p-series matches the dominant behavior of these terms for large n?',step:`\\lim_{n\\to\\infty}\\frac{${c}n/(n^3+1)}{1/n^2}=${c}\\in(0,\\infty).\\;\\sum\\frac{1}{n^2}\\text{ converges}\\Rightarrow\\text{convergent by LCT.}`};}
      function gen8(){const p=choose([3,4,5]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${p}}+1}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Which familiar p-series provides terms that are larger, serving as a valid upper bound?',step:`\\frac{1}{n^{${p}}+1}<\\frac{1}{n^{${p}}}.\\;\\sum\\frac{1}{n^{${p}}}\\text{ converges }(p=${p}>1)\\Rightarrow\\text{convergent by DCT.}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_26: Alternating Series
  CALC2_SPIRAL["C2_26"] = {
    title: "Alternating Series",
    index: 25,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Does this alternating series satisfy all three conditions of the Alternating Series Test?',step:`b_n=1/n:\\;b_n>0,\\;b_{n+1}<b_n,\\;\\lim_{n\\to\\infty}1/n=0\\Rightarrow\\text{convergent by AST.}`};}
      function gen2(){const p=choose([2,3,4]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n}}{n^{${p}}}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Does bn = 1/n^p satisfy the three conditions of the Alternating Series Test?',step:`b_n=1/n^{${p}}:\\;\\text{positive, decreasing, }\\to0\\Rightarrow\\text{convergent by AST.}`};}
      function gen3(){const a=choose([2,3,4]),b=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}(-1)^n\\frac{${a}n}{${b}n+1}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'Before checking the AST, what must be true of the terms for any series to have a chance at converging?',step:`\\lim_{n\\to\\infty}\\frac{${a}n}{${b}n+1}=\\frac{${a}}{${b}}\\neq0\\Rightarrow\\text{diverges by Divergence Test.}`};}
      function gen4(){const N=choose([3,4,5]);return{latex:`\\text{For }\\displaystyle S=\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n},\\text{ the error }|S-S_{${N}}|\\leq`,answer:[`1/${N+1}`],hint:'How does the Alternating Series Estimation Theorem bound the error of the Nth partial sum?',step:`|S-S_{${N}}|\\leq b_{${N+1}}=\\frac{1}{${N+1}}`};}
      function gen5(){const thresh=choose([1/10,1/100,1/50]);const threshStr=thresh===1/10?'0.1':(thresh===1/100?'0.01':'0.02');const threshTex=thresh===1/10?'\\tfrac{1}{10}':(thresh===1/100?'\\tfrac{1}{100}':'\\tfrac{1}{50}');const N=thresh===1/10?10:(thresh===1/100?100:50);return{latex:`\\text{How many terms of }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n}\\text{ give error }<${threshStr}\\text{?}`,answer:[String(N)],hint:'How does the Alternating Series Estimation bound relate to the smallest adequate partial sum?',step:`b_{N+1}=\\frac{1}{N+1}<${threshTex}\\Rightarrow N+1>${thresh===1/10?10:(thresh===1/100?100:50)}\\Rightarrow N=${N}`};}
      function gen6(){return{latex:`\\text{Is }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n}\\text{ absolutely or conditionally convergent?}`,answer:['conditionally convergent','conditional','conditionally'],hint:'What is the convergence status of the series formed by taking absolute values of all terms?',step:`\\sum|a_n|=\\sum\\frac{1}{n}\\text{ diverges (harmonic)},\\text{ but }\\sum a_n\\text{ converges by AST}\\Rightarrow\\text{conditionally convergent.}`};}
      function gen7(){const p=choose([2,3,4]);return{latex:`\\text{Is }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n^{${p}}}\\text{ absolutely or conditionally convergent?}`,answer:['absolutely convergent','absolute','absolutely'],hint:'Check whether the series with absolute values also converges — what type of series is it?',step:`\\sum|a_n|=\\sum\\frac{1}{n^{${p}}}\\text{ converges }(p=${p}>1)\\Rightarrow\\text{absolutely convergent.}`};}
      function gen8(){const c=choose([1,2,3,4]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n+${c}}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Does bn = 1/(n+c) satisfy the conditions needed for the Alternating Series Test to apply?',step:`b_n=\\frac{1}{n+${c}}:\\;\\text{positive, decreasing, }\\to0\\Rightarrow\\text{convergent by AST.}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_27: Ratio and Root Tests
  CALC2_SPIRAL["C2_27"] = {
    title: "Ratio and Root Tests",
    index: 26,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){const r=choose([2,3,4,5]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=0}^{\\infty}\\frac{n!}{${r}^n}\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'The Ratio Test works well when factorials are present — what does the ratio of consecutive terms simplify to?',step:`L=\\lim_{n\\to\\infty}\\frac{(n+1)!/${r}^{n+1}}{n!/${r}^n}=\\lim_{n\\to\\infty}\\frac{n+1}{${r}}=\\infty>1\\Rightarrow\\text{diverges.}`};}
      function gen2(){const r=choose([2,3,4,5]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=0}^{\\infty}\\frac{${r}^n}{n!}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'When factorials grow faster than exponentials, what does the Ratio Test predict about the limit L?',step:`L=\\lim_{n\\to\\infty}\\frac{${r}^{n+1}/(n+1)!}{${r}^n/n!}=\\lim_{n\\to\\infty}\\frac{${r}}{n+1}=0<1\\Rightarrow\\text{converges.}`};}
      function gen3(){const r=choose([2,3,4]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{${r}^n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Which test handles series where the exponential part dominates, and what limit does it produce here?',step:`L=\\lim_{n\\to\\infty}\\frac{(n+1)/${r}^{n+1}}{n/${r}^n}=\\lim_{n\\to\\infty}\\frac{n+1}{${r}\\cdot n}=\\frac{1}{${r}}<1\\Rightarrow\\text{converges.}`};}
      function gen4(){const c=choose([1,2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{${c}}{n}\\right)^{n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'When the series has an nth power structure, which test extracts the base cleanly?',step:`L=\\lim_{n\\to\\infty}\\sqrt[n]{\\left(\\frac{${c}}{n}\\right)^n}=\\lim_{n\\to\\infty}\\frac{${c}}{n}=0<1\\Rightarrow\\text{converges.}`};}
      function gen5(){const pairs=[[1,2],[1,3],[2,3],[3,4]];const [rn,rd]=choose(pairs);const rTex=`\\tfrac{${rn}}{${rd}}`;return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\left(${rTex}\\right)^{n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'The Root Test is ideal when the entire term is an nth power — what is the nth root of this term?',step:`L=\\lim_{n\\to\\infty}\\sqrt[n]{\\left(${rTex}\\right)^n}=${rTex}<1\\Rightarrow\\text{converges.}`};}
      function gen6(){const p=choose([2,3,4]);return{latex:`\\text{For }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${p}}},\\text{ what does the Ratio Test give?}`,answer:['inconclusive'],hint:'What value of the Ratio Test limit L signals that the test cannot determine convergence or divergence?',step:`L=\\lim_{n\\to\\infty}\\frac{1/(n+1)^{${p}}}{1/n^{${p}}}=\\lim_{n\\to\\infty}\\left(\\frac{n}{n+1}\\right)^{${p}}=1\\Rightarrow\\text{inconclusive.}`};}
      function gen7(){const r=choose([2,3]),k=choose([2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}n^{${k}}\\cdot ${r}^n\\text{ converge or diverge?}`,answer:['divergent','diverges'],hint:'When exponentials dominate polynomials, what does the Ratio Test predict about the ratio limit?',step:`L=\\lim_{n\\to\\infty}\\frac{(n+1)^{${k}}\\cdot ${r}^{n+1}}{n^{${k}}\\cdot ${r}^n}=${r}\\lim_{n\\to\\infty}\\left(\\frac{n+1}{n}\\right)^{${k}}=${r}>1\\Rightarrow\\text{diverges.}`};}
      function gen8(){const k=choose([2,3]);return{latex:`\\text{Does }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n^{${k}}}{2^n}\\text{ converge or diverge?}`,answer:['convergent','converges'],hint:'Between polynomial and exponential growth, which dominates as n increases without bound?',step:`L=\\lim_{n\\to\\infty}\\frac{(n+1)^{${k}}/2^{n+1}}{n^{${k}}/2^n}=\\frac{1}{2}\\lim_{n\\to\\infty}\\left(\\frac{n+1}{n}\\right)^{${k}}=\\frac{1}{2}<1\\Rightarrow\\text{converges.}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_28: Power Series
  CALC2_SPIRAL["C2_28"] = {
    title: "Power Series",
    index: 27,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      // gen1: R for Σ x^n / n^p → R=1 (polynomial denominator)
      function gen1(){
        const p=choose([2,3,4]);
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{x^n}{n^{${p}}}`,
          answer:['1'],
          hint:'When consecutive coefficients have a constant limit ratio, what formula gives the radius of convergence?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{1/(n+1)^{${p}}}{1/n^{${p}}}=\\lim_{n\\to\\infty}\\left(\\frac{n}{n+1}\\right)^{${p}}=1\\Rightarrow R=1`};
      }

      // gen2: R for Σ x^n / n! → R=∞
      function gen2(){
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}`,
          answer:['inf','infinity'],
          hint:'When the denominator is n-factorial, what does the Ratio Test reveal about the radius?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{1/(n+1)!}{1/n!}=\\lim_{n\\to\\infty}\\frac{1}{n+1}=0\\Rightarrow R=\\infty`};
      }

      // gen3: R for Σ n! x^n → R=0
      function gen3(){
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=0}^{\\infty}n!\\,x^n`,
          answer:['0'],
          hint:'When coefficients grow as n-factorial, what does the Ratio Test conclude about the radius?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{(n+1)!}{n!}=\\lim_{n\\to\\infty}(n+1)=\\infty\\Rightarrow R=0`};
      }

      // gen4: R for Σ x^n / r^n → R=r  (centered at 0)
      function gen4(){
        const r=choose([2,3,4,5]);
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^n}{${r}^n}`,
          answer:[String(r)],
          hint:'For a series with coefficients 1/r^n, how does the radius of convergence relate to r?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{1/${r}^{n+1}}{1/${r}^n}=\\frac{1}{${r}}\\Rightarrow R=${r}`};
      }

      // gen5: Sum of Σ (1/r)^n = r/(r-1) via geometric series
      function gen5(){
        const r=choose([2,3,4]);
        const num=r, den=r-1;
        const ansStr=den===1?String(num):`${num}/${den}`;
        return{latex:`\\text{Find the sum: }\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac{1}{${r}}\\right)^n`,
          answer:[ansStr],
          hint:'What closed-form does the infinite geometric power series converge to within its interval of convergence?',
          step:`\\sum_{n=0}^{\\infty}x^n=\\frac{1}{1-x}\\text{ for }|x|<1.\\;x=\\tfrac{1}{${r}}:\\;\\frac{1}{1-\\frac{1}{${r}}}=\\frac{${r}}{${r-1}}=${ansStr}`};
      }

      // gen6: Interval of convergence for Σ x^n / n → [-1,1)
      function gen6(){
        return{latex:`\\text{Find the interval of convergence of }\\displaystyle\\sum_{n=1}^{\\infty}\\frac{x^n}{n}`,
          answer:['[-1,1)','[-1, 1)'],
          hint:'After finding R=1, what additional check determines whether each endpoint belongs to the interval?',
          step:`R=1.\\;x=1:\\sum\\tfrac{1}{n}\\text{ diverges; }x=-1:\\sum\\tfrac{(-1)^n}{n}\\text{ converges (AST).}\\;\\Rightarrow[-1,1)`};
      }

      // gen7: R for Σ (rx)^n = Σ r^n x^n → R=1/r
      function gen7(){
        const r=choose([2,3,4]);
        const ansStr=r===1?'1':`1/${r}`;
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=0}^{\\infty}(${r}x)^n`,
          answer:[ansStr],
          hint:'For a series with coefficients r^n, how does the radius of convergence relate to r?',
          step:`c_n=${r}^n.\\;\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{${r}^{n+1}}{${r}^n}=${r}\\Rightarrow R=\\frac{1}{${r}}`};
      }

      // gen8: R for Σ n x^n → R=1 (via ratio test with n coefficient)
      function gen8(){
        return{latex:`\\text{Find the radius of convergence of }\\displaystyle\\sum_{n=1}^{\\infty}n\\,x^n`,
          answer:['1'],
          hint:'When coefficients are polynomial in n, what does the Ratio Test reveal about the radius?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{n+1}{n}=1\\Rightarrow R=1`};
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // C2_29: Taylor Series
  CALC2_SPIRAL["C2_29"] = {
    title: "Taylor Series",
    index: 28,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[‐‑‒–—]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}

      // gen1: coefficient of x^3 in e^x → 1/6
      function gen1(){
        return{latex:`\\text{Coefficient of }x^3\\text{ in the Maclaurin series for }e^x`,
          answer:['1/6'],
          hint:'For a Maclaurin series, how is the coefficient of x^n related to the nth derivative of f at zero?',
          step:`c_3=\\frac{f^{(3)}(0)}{3!}=\\frac{e^0}{6}=\\frac{1}{6}`};}

      // gen2: coefficient of x^3 in sin(x) → -1/6
      function gen2(){
        return{latex:`\\text{Coefficient of }x^3\\text{ in the Maclaurin series for }\\sin x`,
          answer:['-1/6'],
          hint:'The Maclaurin series for sin(x) has only odd powers — which term contains x^3 and what is its sign?',
          step:`\\sin x=x-\\frac{x^3}{3!}+\\cdots\\Rightarrow c_3=-\\frac{1}{6}`};}

      // gen3: coefficient of x^2 in cos(x) → -1/2
      function gen3(){
        return{latex:`\\text{Coefficient of }x^2\\text{ in the Maclaurin series for }\\cos x`,
          answer:['-1/2'],
          hint:'The Maclaurin series for cos(x) starts with 1 — what is the coefficient of the x^2 term?',
          step:`\\cos x=1-\\frac{x^2}{2!}+\\cdots\\Rightarrow c_2=-\\frac{1}{2}`};}

      // gen4: coefficient of x^4 in cos(x) → 1/24
      function gen4(){
        return{latex:`\\text{Coefficient of }x^4\\text{ in the Maclaurin series for }\\cos x`,
          answer:['1/24'],
          hint:'In the Maclaurin series for cos(x), which factorial appears in the denominator of the x^4 term?',
          step:`\\cos x=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots\\Rightarrow c_4=\\frac{1}{24}`};}

      // gen5: partial sum of e^x (n=0,1,2) at x=1 → 5/2
      function gen5(){
        return{latex:`\\text{Sum of the first three terms }(n=0,1,2)\\text{ of }e^x\\text{ at }x=1`,
          answer:['5/2','2.5'],
          hint:'The Maclaurin series for e^x has terms 1, x, x^2/2! — what do the first three sum to at x=1?',
          step:`1+1+\\frac{1}{2}=\\frac{5}{2}`};}

      // gen6: radius of convergence of sin(x) series → inf
      function gen6(){
        return{latex:`\\text{Radius of convergence of the Maclaurin series for }\\sin x`,
          answer:['inf','infinity'],
          hint:'Based on the Ratio Test applied to the Maclaurin series for sin(x), what is the radius of convergence?',
          step:`\\lim_{n\\to\\infty}\\frac{|x|^{2n+3}/(2n+3)!}{|x|^{2n+1}/(2n+1)!}=\\lim_{n\\to\\infty}\\frac{x^2}{(2n+3)(2n+2)}=0<1\\Rightarrow R=\\infty`};}

      // gen7: coefficient of x^3 in ln(1+x) → 1/3
      function gen7(){
        return{latex:`\\text{Coefficient of }x^3\\text{ in the Maclaurin series for }\\ln(1+x)`,
          answer:['1/3'],
          hint:'The coefficients of ln(1+x) follow an alternating sign pattern — what is the coefficient of x^3?',
          step:`\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots\\Rightarrow c_3=\\frac{1}{3}`};}

      // gen8: radius of convergence of ln(1+x) → 1
      function gen8(){
        return{latex:`\\text{Radius of convergence of the Maclaurin series for }\\ln(1+x)`,
          answer:['1'],
          hint:'The series for ln(1+x) converges at one endpoint but not the other — what is the radius?',
          step:`\\frac{1}{R}=\\lim_{n\\to\\infty}\\frac{1/(n+2)}{1/(n+1)}=1\\Rightarrow R=1`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

})(window);