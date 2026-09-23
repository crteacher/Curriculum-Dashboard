// AUTO-GENERATED — preCalc spiral-review generator bundle
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

  global.PRECALC_SPIRAL = {};

  // PC_1_1: Introduction to Functions
  PRECALC_SPIRAL["PC_1_1"] = {
    title: "Introduction to Functions",
    index: 0,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[−‐]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){const a=choose([1,2,-1]);const b=choose([3,-2,4,-3]);const c=choose([1,-1,2,-2]);const x=choose([2,3,-1,-2,0]);const val=a*x*x+b*x+c;const aStr=a===1?'':(a===-1?'-':String(a));const bStr=b>0?`+${b}x`:(b<0?`${b}x`:'');const cStr=c>0?`+${c}`:(c<0?String(c):'');return{latex:`\\text{If } f(x)=${aStr}x^2${bStr}${cStr},\\text{ find } f(${x}).`,answer:[String(val)],hint:'What operation replaces the variable in function notation?',step:`f(${x})=${a}(${x})^2${b>0?'+':''}${b}(${x})${c>=0?'+':''}${c}=${val}`};}
      function gen2(){const xs=[0,1,2,3];const ys=xs.map(()=>choose([-5,-4,-3,-2,-1,1,2,3,4,5]));const idx=rInt(4);const rows=xs.map((x,i)=>`f(${x})=${ys[i]}`).join(',\\;');return{latex:`\\text{Given }${rows},\\text{ find }f(${xs[idx]}).`,answer:[String(ys[idx])],hint:'Read the output value directly from the given values.',step:`f(${xs[idx]})=${ys[idx]}\\text{ (given)}`};}
      function gen3(){const a=choose([2,3,-2,-3]);const b=choose([-5,-3,-1,1,3,5]);const x=choose([-3,-2,-1,0,1,2,3]);const val=Math.abs(a*x+b);const bStr=b>=0?`+${b}`:String(b);return{latex:`\\text{If }f(x)=|${a}x${bStr}|,\\text{ find }f(${x}).`,answer:[String(val)],hint:'Evaluate inside the absolute value first, then take the magnitude.',step:`f(${x})=|${a}(${x})${bStr}|=|${a*x}${bStr}|=${val}`};}
      function gen4(){const isFn=choose([true,false]);let xs,ys,dupX=null;if(isFn){xs=shuffle([1,2,3,4,5]).slice(0,4);ys=xs.map(()=>rInt(9)-4);}else{const pool=shuffle([1,2,3,4,5]).slice(0,3);dupX=pool[0];xs=[pool[0],pool[1],pool[2],dupX];const y1=rInt(9)-4;let y2=rInt(9)-4;while(y2===y1)y2=rInt(9)-4;ys=[y1,rInt(9)-4,rInt(9)-4,y2];}const table=`\\begin{array}{c|${'c'.repeat(xs.length)}}x & ${xs.join(' & ')}\\\\\\hline f(x) & ${ys.join(' & ')}\\end{array}`;return{latex:`\\text{Does this table represent a function?}\\\\[6pt]${table}`,answer:[isFn?'yes':'no'],hint:'Does any input value (x) appear more than once with a different output?',step:isFn?'\\text{Each input value appears exactly once}\\Rightarrow\\text{yes}':`x=${dupX}\\text{ appears twice with different outputs}\\Rightarrow\\text{no}`};}
      function gen5(){const a=choose([-3,-2,-1,1,2,3]);const b=rInt(9)-4;return{latex:`\\text{A graph passes through the point }(${a},\\,${b}).\\text{ Find }f(${a}).`,answer:[String(b)],hint:'What does a point on the graph tell you about the value of f there?',step:`\\text{The point }(${a},${b})\\text{ means }f(${a})=${b}.`};}
      function gen6(){const m=choose([2,3,4,5]);const b=choose([1,-1,3,-2]);const bStr=b>=0?`+${b}`:String(b);return{latex:`\\text{If }f(x)=${m}x${bStr},\\text{ find }f(a+h).`,answer:[`${m}a+${m}h${bStr}`,`${m}(a+h)${bStr}`],hint:'What gets substituted in place of the variable in the formula?',step:`f(a+h)=${m}(a+h)${bStr}=${m}a+${m}h${bStr}`};}
      function gen7(){const isFn=choose([true,false]);let pts,dupX=null;if(isFn){const xs=shuffle([-2,-1,0,1,2,3]).slice(0,3);pts=xs.map(x=>({x,y:rInt(9)-4}));}else{dupX=choose([-2,-1,0,1,2]);const y1=rInt(9)-4;let y2=rInt(9)-4;while(y2===y1)y2=rInt(9)-4;pts=[{x:dupX,y:y1},{x:dupX+1,y:rInt(9)-4},{x:dupX,y:y2}];}const display=pts.map(p=>`(${p.x},${p.y})`).join(',\\;');return{latex:`\\text{A graph passes through }${display}.\\text{ Could this be the graph of a function?}`,answer:[isFn?'yes':'no'],hint:'Does any x-value on the graph correspond to more than one y-value?',step:isFn?'\\text{Every x-value appears once}\\Rightarrow\\text{yes}':`x=${dupX}\\text{ has two different y-values}\\Rightarrow\\text{no}`};}
      function gen8(){const fail=choose([true,false]);const crossings=fail?choose([2,3]):1;return{latex:`\\text{A vertical line crosses a graph }${crossings}\\text{ time(s). Is the graph a function? (yes/no)}`,answer:[fail?'no':'yes'],hint:'What does the vertical line test say about functions?',step:fail?`${crossings}\\text{ crossings}\\Rightarrow\\text{one input has two outputs}\\Rightarrow\\text{no}`:`1\\text{ crossing at every vertical line}\\Rightarrow\\text{yes}`};}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_1_1b: Library of Functions & One-to-One
  PRECALC_SPIRAL["PC_1_1b"] = {
    title: "Library of Functions & One-to-One",
    index: 1,
    generators: (function() {
      function gen1(){
        const fns=[
          {latex:'f(x)=x^2',name:'squaring',step:'\\text{The squaring (quadratic) parent function}'},
          {latex:'f(x)=\\sqrt{x}',name:'square root',step:'\\text{The square root parent function}'},
          {latex:'f(x)=|x|',name:'absolute value',step:'\\text{The absolute value parent function}'},
          {latex:'f(x)=\\dfrac{1}{x}',name:'reciprocal',step:'\\text{The reciprocal parent function}'},
          {latex:'f(x)=x^3',name:'cubing',step:'\\text{The cubing (cubic) parent function}'},
          {latex:'f(x)=x',name:'identity',step:'\\text{The identity (linear) parent function}'},
          {latex:'f(x)=\\sqrt[3]{x}',name:'cube root',step:'\\text{The cube root parent function}'}
        ];
        const f=choose(fns);
        return{latex:`\\text{Name the parent function: }${f.latex}`,answer:[f.name],hint:'What is the standard name for this basic function shape?',step:f.step};
      }
      function gen2(){
        const cases=[
          {latex:'f(x)=x^2',is1to1:false,step:'\\text{Horizontal line }y=1\\text{ hits }(-1,1)\\text{ and }(1,1)\\Rightarrow\\text{not 1-to-1}'},
          {latex:'f(x)=x^3',is1to1:true,step:'\\text{Every horizontal line hits the graph exactly once}\\Rightarrow\\text{1-to-1}'},
          {latex:'f(x)=|x|',is1to1:false,step:'\\text{Horizontal line }y=2\\text{ hits }(-2,2)\\text{ and }(2,2)\\Rightarrow\\text{not 1-to-1}'},
          {latex:'f(x)=\\sqrt{x}',is1to1:true,step:'\\text{Square root is strictly increasing}\\Rightarrow\\text{1-to-1}'},
          {latex:'f(x)=x',is1to1:true,step:'\\text{Identity is strictly increasing}\\Rightarrow\\text{1-to-1}'},
          {latex:'f(x)=\\sqrt[3]{x}',is1to1:true,step:'\\text{Cube root is strictly increasing everywhere}\\Rightarrow\\text{1-to-1}'},
          {latex:'f(x)=\\dfrac{1}{x}',is1to1:true,step:'\\text{Each output 1/x is achieved by exactly one input}\\Rightarrow\\text{1-to-1}'}
        ];
        const c=choose(cases);
        return{latex:`\\text{Is }${c.latex}\\text{ one-to-one? (yes/no)}`,answer:[c.is1to1?'yes':'no'],hint:'Apply the horizontal line test.',step:c.step};
      }
      function gen3(){
        /* Canonical parent-function graph — name it */
        const cases=[
          {fn:x=>x*x,xMin:-2.5,xMax:2.5,yMin:0,yMax:4,
           name:'squaring',alts:['quadratic','parabola','x^2']},
          {fn:x=>x*x*x,xMin:-1.6,xMax:1.6,yMin:-3,yMax:3,
           name:'cubing',alts:['cubic','x^3']},
          {fn:x=>Math.abs(x),xMin:-3,xMax:3,yMin:0,yMax:3,
           name:'absolute value',alts:['abs value','abs','|x|']},
          {fn:x=>Math.sqrt(x),xMin:0,xMax:4,yMin:0,yMax:2.5,
           name:'square root',alts:['sqrt']},
          {fn:x=>x,xMin:-3,xMax:3,yMin:-3,yMax:3,
           name:'identity',alts:['linear','line']},
          {fn:x=>Math.cbrt(x),xMin:-3,xMax:3,yMin:-2,yMax:2,
           name:'cube root',alts:['cbrt']},
          {fn:x=>1/x,xMin:-3,xMax:3,yMin:-3,yMax:3,
           name:'reciprocal',alts:['1/x']}
        ];
        const c=choose(cases);
        const svg=makeSVG(c.fn,c.xMin,c.xMax,c.yMin,c.yMax);
        return{
          html:`<p class="prob-q">Name this parent function.</p>${svg}`,
          answer:[c.name,...c.alts],
          hint:'What is this shape called, and what basic function produces it?',
          stepHtml:`This is the graph of the <em>${c.name}</em> parent function.`
        };
      }
      function gen4(){
        const cases=[
          {latex:'f(x)=x^2',range:'[0,inf)',step:'\\text{Output is always }\\geq 0:\\;[0,\\infty)'},
          {latex:'f(x)=\\sqrt{x}',range:'[0,inf)',step:'\\text{Output is always }\\geq 0:\\;[0,\\infty)'},
          {latex:'f(x)=|x|',range:'[0,inf)',step:'\\text{Output is always }\\geq 0:\\;[0,\\infty)'},
          {latex:'f(x)=x^3',range:'(-inf,inf)',step:'\\text{All real numbers: }(-\\infty,\\infty)'},
          {latex:'f(x)=\\dfrac{1}{x}',range:'(-inf,0)u(0,inf)',step:'\\text{Output is never 0: }(-\\infty,0)\\cup(0,\\infty)'},
          {latex:'f(x)=\\sqrt[3]{x}',range:'(-inf,inf)',step:'\\text{Output spans all reals: }(-\\infty,\\infty)'}
        ];
        const c=choose(cases);
        return{latex:`\\text{State the range of }${c.latex}`,answer:[c.range],hint:'What set of outputs is achievable?',step:c.step};
      }
      function gen5(){
        const x=choose([-2,-1,1,2,4,9]);
        const fns=[
          {expr:v=>`${v*v}`,latex:'f(x)=x^2',step:v=>`f(${v})=(${v})^2=${v*v}`},
          {expr:v=>v>=0?`${Math.sqrt(v)}`:'undefined',latex:'f(x)=\\sqrt{x}',step:v=>v>=0?`f(${v})=\\sqrt{${v}}=${Math.sqrt(v)}`:'\\text{undefined}'},
          {expr:v=>`${Math.abs(v)}`,latex:'f(x)=|x|',step:v=>`f(${v})=|${v}|=${Math.abs(v)}`},
          {expr:v=>`${v*v*v}`,latex:'f(x)=x^3',step:v=>`f(${v})=(${v})^3=${v*v*v}`}
        ];
        const f=choose(fns.filter(fn=>fn.expr(x)!=='undefined'&&Number.isInteger(parseFloat(fn.expr(x)))));
        const val=f.expr(x);
        return{latex:`\\text{If }${f.latex},\\text{ find }f(${x}).`,answer:[val],hint:'Substitute the value into the function.',step:f.step(x)};
      }
      function gen6(){
        const cases=[
          {domain:'[0,\\infty)',fn:['square root'],step:'\\text{Domain }[0,\\infty)\\text{ matches the square root function}'},
          {domain:'(-\\infty,\\infty)',fn:['squaring','cubing','absolute value','identity','cube root'],step:'\\text{Domain }(-\\infty,\\infty)\\text{ matches squaring, cubing, absolute value, identity, and cube root}'},
          {domain:'(-\\infty,0)\\cup(0,\\infty)',fn:['reciprocal'],step:'\\text{The reciprocal function excludes }x=0'}
        ];
        const c=choose(cases);
        return{latex:`\\text{Which parent function has domain }${c.domain}?`,answer:c.fn,hint:'Which function has a natural restriction on its inputs?',step:c.step};
      }
      function gen7(){
        const cases=[
          {desc:'\\text{a U-shaped parabola opening upward}',passes:false,step:'\\text{A horizontal line crosses both arms}\\Rightarrow\\text{fails HLT}'},
          {desc:'\\text{a V-shaped absolute value graph}',passes:false,step:'\\text{Horizontal lines above the vertex cross both sides}\\Rightarrow\\text{fails HLT}'},
          {desc:'\\text{the graph of }f(x)=x^3',passes:true,step:'\\text{Cubic is strictly increasing}\\Rightarrow\\text{passes HLT}'},
          {desc:'\\text{a strictly increasing curve through the origin}',passes:true,step:'\\text{Strictly increasing means no repeated outputs}\\Rightarrow\\text{passes HLT}'}
        ];
        const c=choose(cases);
        return{latex:`\\text{Does }${c.desc}\\text{ pass the horizontal line test? (yes/no)}`,answer:[c.passes?'yes':'no'],hint:'Can a horizontal line ever cross this graph more than once?',step:c.step};
      }
      function gen8(){
        const all1to1=['x^3','\\sqrt{x}','x','\\dfrac{1}{x}','\\sqrt[3]{x}'];
        const notAll=['x^2','|x|'];
        const n=choose([1,2,3]);
        const picked1=shuffle(all1to1).slice(0,n);
        const picked0=shuffle(notAll).slice(0,Math.min(2,3-n));
        const combined=shuffle([...picked1,...picked0]);
        return{
          latex:`\\text{How many of these are 1-to-1? }${combined.map(f=>`f(x)=${f}`).join(',\\;')}`,
          answer:[String(picked1.length)],
          hint:'For each function, is it strictly increasing or strictly decreasing across its whole domain — or does it behave differently on separate intervals (like $1/x$)?',
          step:`\\text{The 1-to-1 functions: }${picked1.map(f=>`f(x)=${f}`).join(',\\;')}\\Rightarrow ${picked1.length}`
        };
      }

      /* ── graph-based generators (gen9–gen11) ────────────────────────────── */
      function gen9(){
        /* Show SVG of a parent function — does it pass HLT? */
        const cases=[
          {fn:x=>x*x,xMin:-2.5,xMax:2.5,yMin:0,yMax:4,passes:false,
           name:'squaring',stepTxt:'The parabola opens upward — any horizontal line y>0 crosses it twice. Fails HLT: not 1-to-1.'},
          {fn:x=>x*x*x,xMin:-1.6,xMax:1.6,yMin:-3,yMax:3,passes:true,
           name:'cubic',stepTxt:'The cubic is strictly increasing — every horizontal line crosses it exactly once. Passes HLT: 1-to-1.'},
          {fn:x=>Math.abs(x),xMin:-3,xMax:3,yMin:0,yMax:3,passes:false,
           name:'absolute value',stepTxt:'The V-shape means any horizontal line y>0 crosses it twice. Fails HLT: not 1-to-1.'},
          {fn:x=>Math.sqrt(x),xMin:0,xMax:4,yMin:0,yMax:2.5,passes:true,
           name:'square root',stepTxt:'Square root is strictly increasing on its domain. Passes HLT: 1-to-1.'},
          {fn:x=>x,xMin:-3,xMax:3,yMin:-3,yMax:3,passes:true,
           name:'identity',stepTxt:'A non-horizontal line passes HLT: 1-to-1.'},
          {fn:x=>Math.cbrt(x),xMin:-3,xMax:3,yMin:-2,yMax:2,passes:true,
           name:'cube root',stepTxt:'Cube root is strictly increasing everywhere. Passes HLT: 1-to-1.'},
          {fn:x=>1/x,xMin:-3,xMax:3,yMin:-3,yMax:3,passes:true,
           name:'reciprocal',stepTxt:'Each output 1/x is achieved by exactly one input. Passes HLT: 1-to-1.'}
        ];
        const c=choose(cases);
        const svg=makeSVG(c.fn,c.xMin,c.xMax,c.yMin,c.yMax);
        return{
          html:`<p class="prob-q">Does this graph pass the horizontal line test? (yes/no)</p>${svg}`,
          answer:[c.passes?'yes':'no'],
          hint:'Imagine dragging a horizontal line across the graph. Does it ever hit the curve more than once?',
          stepHtml:`<em>${c.name}:</em> ${c.stepTxt}`
        };
      }
      function gen10(){
        /* Table of values — is the function 1-to-1? */
        const cases=[
          {rows:[[-2,4],[-1,1],[0,0],[1,1],[2,4]],is1to1:false,
           stepTxt:'Output 4 appears for x=−2 and x=2; output 1 appears for x=−1 and x=1. Not 1-to-1.'},
          {rows:[[0,0],[1,1],[4,2],[9,3]],is1to1:true,
           stepTxt:'Every output is unique. One-to-one (matches √x).'},
          {rows:[[-1,-1],[0,0],[1,1],[2,8],[3,27]],is1to1:true,
           stepTxt:'Every output is unique. One-to-one (matches x³).'},
          {rows:[[-2,5],[-1,3],[0,3],[1,5],[2,9]],is1to1:false,
           stepTxt:'Output 5 appears for x=−2 and x=1; output 3 appears for x=−1 and x=0. Not 1-to-1.'},
          {rows:[[1,5],[2,3],[3,1],[4,-1],[5,-3]],is1to1:true,
           stepTxt:'Outputs are strictly decreasing and all unique. One-to-one.'},
          {rows:[[-3,2],[-1,0],[1,2],[3,6]],is1to1:false,
           stepTxt:'Output 2 appears for x=−3 and x=1. Not 1-to-1.'},
          {rows:[[0,1],[1,3],[2,9],[3,27]],is1to1:true,
           stepTxt:'All outputs are unique (exponential growth). One-to-one.'}
        ];
        const c=choose(cases);
        const rows=c.rows.map(([x,y])=>`<tr><td>${x}</td><td>${y}</td></tr>`).join('');
        const tbl=`<table class="tbl-1to1"><thead><tr><th>x</th><th>y</th></tr></thead><tbody>${rows}</tbody></table>`;
        return{
          html:`<p class="prob-q">Is this function one-to-one based on the table? (yes/no)</p>${tbl}`,
          answer:[c.is1to1?'yes':'no'],
          hint:'Check: does any output value appear more than once?',
          stepHtml:c.stepTxt
        };
      }
      function gen11(){
        /* Transformed graph — identify the parent function */
        const cases=[
          {fn:x=>(x-1)*(x-1)+0.5,xMin:-1.5,xMax:3,yMin:0,yMax:4,
           parent:'squaring',alts:['quadratic','parabola'],
           stepTxt:'The U-shape with vertex shifted to (1, 0.5) is a transformed squaring function.'},
          {fn:x=>Math.sqrt(x+1)-0.5,xMin:-1,xMax:3.5,yMin:-0.5,yMax:2,
           parent:'square root',alts:['sqrt'],
           stepTxt:'This curve starts at (−1, −0.5) and curves right — a shifted square root.'},
          {fn:x=>-(x*x),xMin:-2.5,xMax:2.5,yMin:-4,yMax:0.2,
           parent:'squaring',alts:['quadratic','parabola'],
           stepTxt:'A downward-opening U is a reflected squaring function.'},
          {fn:x=>(x+1)*(x+1)*(x+1)-1,xMin:-2.5,xMax:1.2,yMin:-3,yMax:3,
           parent:'cubing',alts:['cubic'],
           stepTxt:'The S-shape shifted to (−1, −1) is a transformed cubing function.'},
          {fn:x=>Math.abs(x-1)-1,xMin:-2,xMax:3.5,yMin:-1,yMax:2.5,
           parent:'absolute value',alts:['abs value','abs'],
           stepTxt:'The V-shape with vertex at (1, −1) is a transformed absolute value function.'},
          {fn:x=>2*Math.cbrt(x),xMin:-3,xMax:3,yMin:-3,yMax:3,
           parent:'cube root',alts:['cbrt'],
           stepTxt:'The S-curve through the origin, stretched vertically, is a transformed cube root.'},
          {fn:x=>Math.sqrt(-(x-1)),xMin:-3,xMax:1,yMin:0,yMax:2.5,
           parent:'square root',alts:['sqrt'],
           stepTxt:'This curve reflects the square root over the y-axis and shifts right — still a square root.'},
          {fn:x=>x-1.5,xMin:-2,xMax:3,yMin:-3,yMax:2,
           parent:'identity',alts:['linear','line'],
           stepTxt:'A shifted diagonal line is a transformed identity (linear) function.'}
        ];
        const c=choose(cases);
        const svg=makeSVG(c.fn,c.xMin,c.xMax,c.yMin,c.yMax);
        return{
          html:`<p class="prob-q">Which parent function does this graph resemble? (name it)</p>${svg}`,
          answer:[c.parent,...c.alts],
          hint:'Ignore shifts and reflections — focus on the overall shape.',
          stepHtml:c.stepTxt
        };
      }

      /* ── card engine ────────────────────────────────────────────────────── */
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11];
    })()
  };

  // PC_1_2a: Domain, Range & Interval Notation
  PRECALC_SPIRAL["PC_1_2a"] = {
    title: "Domain, Range & Interval Notation",
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

      function gen1(){
        const a=choose([-5,-3,-2,-1,1,2,3,5]);
        const ans=`(-inf,${a})u(${a},inf)`;
        const neg=-a, term=neg>=0?`+${neg}`:`-${-neg}`;
        return{
          latex:`\\text{Domain of }f(x)=\\dfrac{1}{x${neg>=0?'+'+neg:neg}}`,
          answer:[ans],
          hint:'Which x-value makes the denominator equal to zero?',
          step:`x-${a}=0\\Rightarrow x=${a}.\\quad\\text{Domain: }(-\\infty,${a})\\cup(${a},\\infty)`
        };
      }

      function gen2(){
        const a=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const ans=`[${a},inf)`;
        const neg=-a, term=neg>=0?`+${neg}`:`${neg}`;
        return{
          latex:`\\text{Domain of }f(x)=\\sqrt{x${neg>0?'+'+neg:neg===0?'':neg}}`,
          answer:[ans],
          hint:'What inequality must the radicand satisfy for a square root to exist?',
          step:`x${neg>0?'+'+neg:neg===0?'':neg}\\geq 0\\Rightarrow x\\geq ${a}.\\quad\\text{Domain: }[${a},\\infty)`
        };
      }

      function gen3(){
        // sqrt(a*x + b) with integer boundary: boundary = -b/a must be integer
        const data=[
          {a:2,b:-6,bnd:3},{a:3,b:-9,bnd:3},{a:2,b:-4,bnd:2},{a:3,b:6,bnd:-2},
          {a:2,b:8,bnd:-4},{a:4,b:-8,bnd:2},{a:5,b:-15,bnd:3},{a:2,b:-10,bnd:5}
        ];
        const d=choose(data);
        const ans=`[${d.bnd},inf)`;
        const bSign=d.b>=0?`+${d.b}`:`${d.b}`;
        return{
          latex:`\\text{Domain of }f(x)=\\sqrt{${d.a}x${bSign}}`,
          answer:[ans],
          hint:'What is the boundary x-value that makes the radicand exactly zero?',
          step:`${d.a}x${bSign}\\geq 0\\Rightarrow x\\geq ${d.bnd}.\\quad\\text{Domain: }[${d.bnd},\\infty)`
        };
      }

      function gen4(){
        const a=choose([-5,-4,-3,-2,-1,0,1,2,3]);
        const len=choose([2,3,4,5,6]);
        const b=a+len;
        const ans=`[${a},${b})`;
        return{
          latex:`\\text{Write in interval notation: }${a}\\leq x < ${b}`,
          answer:[ans],
          hint:'Which bracket type includes an endpoint and which excludes it?',
          step:`[${a},${b})`
        };
      }

      function gen5(){
        const a=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const ans=`(-inf,${a})`;
        return{
          latex:`\\text{Write in interval notation: }x < ${a}`,
          answer:[ans],
          hint:'Which endpoint notation matches a strict inequality with no lower bound?',
          step:`(-\\infty,${a})`
        };
      }

      function gen6(){
        const a=choose([1,2,3,4,5,6]);
        const ans=`(${a},inf)`;
        return{
          latex:`\\text{Domain of }f(x)=\\dfrac{1}{\\sqrt{x-${a}}}`,
          answer:[ans],
          hint:'Why must the radicand be strictly positive rather than just non-negative here?',
          step:`x-${a}>0\\Rightarrow x>${a}.\\quad\\text{Domain: }(${a},\\infty)`
        };
      }

      function gen7(){
        const a=choose([-4,-3,-2,-1,0,1,2]);
        const gap=choose([3,4,5,6]);
        const b=a+gap;
        const ans=`(-inf,${a}]u(${b},inf)`;
        return{
          latex:`\\text{Write in interval notation: }x\\leq ${a}\\text{ or }x > ${b}`,
          answer:[ans],
          hint:'How should a union of two non-overlapping intervals be written?',
          step:`(-\\infty,${a}]\\cup(${b},\\infty)`
        };
      }

      function gen8(){
        const pairs=[[1,4],[2,5],[-1,3],[-2,2],[-3,1],[1,6],[2,7],[-2,4]];
        const [lo,hi]=choose(pairs);
        const ans=`(-inf,${lo})u(${lo},${hi})u(${hi},inf)`;
        const s1=lo>=0?`-${lo}`:`+${-lo}`;
        const s2=hi>=0?`-${hi}`:`+${-hi}`;
        return{
          latex:`\\text{Domain of }f(x)=\\dfrac{1}{(x${s1})(x${s2})}`,
          answer:[ans],
          hint:'How many values must be excluded when the denominator has two distinct zeros?',
          step:`\\text{Exclude }x=${lo},\\,x=${hi}.\\quad(-\\infty,${lo})\\cup(${lo},${hi})\\cup(${hi},\\infty)`
        };
      }

      function domainRangeGraph(x1,y1,x2,y2,ttl){
        const W=340,H=190,padL=45,padR=25,padT=24,padB=34;
        const xlo=Math.min(x1,0)-1, xhi=Math.max(x2,0)+1;
        const ylo=Math.min(y1,0)-1, yhi=Math.max(y2,0)+1;
        const xs=(W-padL-padR)/(xhi-xlo), ys=(H-padT-padB)/(yhi-ylo);
        const px=x=>padL+(x-xlo)*xs, py=y=>H-padB-(y-ylo)*ys;
        const ax=py(0), ay=px(0);
        const p1x=px(x1),p1y=py(y1),p2x=px(x2),p2y=py(y2);
        const lx1=p1y<ax?p1y-8:p1y+16, lx2=p2y<ax?p2y-8:p2y+16;
        const ly1x=p1x<ay?p1x-8:p1x+8, ly1a=p1x<ay?'end':'start';
        const ly2x=p2x<ay?p2x-8:p2x+8, ly2a=p2x<ay?'end':'start';
        return `<div style="text-align:center;margin:0.25rem 0 0.5rem"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`+
      `<rect width="${W}" height="${H}" fill="#fafaf8" rx="6"/>`+
      `<text x="${W/2}" y="15" text-anchor="middle" font-size="11" font-family="sans-serif" font-weight="bold" fill="#1e3a5c">${ttl}</text>`+
      `<line x1="${padL-15}" y1="${ax}" x2="${W-padR+15}" y2="${ax}" stroke="#888" stroke-width="1.3"/>`+
      `<line x1="${ay}" y1="${padT-4}" x2="${ay}" y2="${H-padB+10}" stroke="#888" stroke-width="1.3"/>`+
      `<path d="M${p1x},${p1y} L${p2x},${p2y}" fill="none" stroke="#1e3a5c" stroke-width="2.5" stroke-linecap="round"/>`+
      `<line x1="${p1x}" y1="${p1y}" x2="${p1x}" y2="${ax}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p2x}" y1="${p2y}" x2="${p2x}" y2="${ax}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p1x}" y1="${p1y}" x2="${ay}" y2="${p1y}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p2x}" y1="${p2y}" x2="${ay}" y2="${p2y}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<circle cx="${p1x}" cy="${p1y}" r="4.5" fill="#7a5c1e"/>`+
      `<circle cx="${p2x}" cy="${p2y}" r="4.5" fill="#7a5c1e"/>`+
      `<text x="${p1x}" y="${lx1}" text-anchor="middle" font-size="10.5" font-family="sans-serif" fill="#333">${x1}</text>`+
      `<text x="${p2x}" y="${lx2}" text-anchor="middle" font-size="10.5" font-family="sans-serif" fill="#333">${x2}</text>`+
      `<text x="${ly1x}" y="${p1y+4}" text-anchor="${ly1a}" font-size="10.5" font-family="sans-serif" fill="#333">${y1}</text>`+
      `<text x="${ly2x}" y="${p2y+4}" text-anchor="${ly2a}" font-size="10.5" font-family="sans-serif" fill="#333">${y2}</text>`+
      `</svg></div>`;
      }

      function gen9(){
        const x1=choose([-4,-3,-2,-1]);
        const x2=x1+choose([3,4,5,6]);
        const y1=choose([-3,-2,-1,0,1]);
        const y2=y1+choose([3,4,5,6]);
        const ans=`[${x1},${x2}]`;
        return{
          svg: domainRangeGraph(x1,y1,x2,y2,'y = f(x)') +
            '<p style="font-size:14px;font-family:sans-serif;color:#333;margin-top:6px">State the domain of the function graphed above.</p>',
          answer:[ans],
          hint:'Which x-values does the graph actually cover, from leftmost to rightmost point?',
          step:`\\text{Domain: the graph spans }x=${x1}\\text{ to }x=${x2}.\\quad[${x1},${x2}]`
        };
      }

      function gen10(){
        const x1=choose([-4,-3,-2,-1]);
        const x2=x1+choose([3,4,5,6]);
        const y1=choose([-3,-2,-1,0,1]);
        const y2=y1+choose([3,4,5,6]);
        const ans=`[${y1},${y2}]`;
        return{
          svg: domainRangeGraph(x1,y1,x2,y2,'y = g(x)') +
            '<p style="font-size:14px;font-family:sans-serif;color:#333;margin-top:6px">State the range of the function graphed above.</p>',
          answer:[ans],
          hint:'Which y-values does the graph actually cover, from lowest to highest point?',
          step:`\\text{Range: the graph spans }y=${y1}\\text{ to }y=${y2}.\\quad[${y1},${y2}]`
        };
      }

      function domainRangeGraphCurve(x1,y1,x2,y2,ttl){
        const W=340,H=190,padL=45,padR=25,padT=24,padB=34;
        const xlo=Math.min(x1,0)-1, xhi=Math.max(x2,0)+1;
        const ylo=Math.min(y1,0)-1, yhi=Math.max(y2,0)+1;
        const xs=(W-padL-padR)/(xhi-xlo), ys=(H-padT-padB)/(yhi-ylo);
        const px=x=>padL+(x-xlo)*xs, py=y=>H-padB-(y-ylo)*ys;
        const ax=py(0), ay=px(0);
        const p1x=px(x1),p1y=py(y1),p2x=px(x2),p2y=py(y2);
        const c1x=p1x+(p2x-p1x)*0.4, c2x=p1x+(p2x-p1x)*0.6;
        const lx1=p1y<ax?p1y-8:p1y+16, lx2=p2y<ax?p2y-8:p2y+16;
        const ly1x=p1x<ay?p1x-8:p1x+8, ly1a=p1x<ay?'end':'start';
        const ly2x=p2x<ay?p2x-8:p2x+8, ly2a=p2x<ay?'end':'start';
        return `<div style="text-align:center;margin:0.25rem 0 0.5rem"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`+
      `<rect width="${W}" height="${H}" fill="#fafaf8" rx="6"/>`+
      `<text x="${W/2}" y="15" text-anchor="middle" font-size="11" font-family="sans-serif" font-weight="bold" fill="#1e3a5c">${ttl}</text>`+
      `<line x1="${padL-15}" y1="${ax}" x2="${W-padR+15}" y2="${ax}" stroke="#888" stroke-width="1.3"/>`+
      `<line x1="${ay}" y1="${padT-4}" x2="${ay}" y2="${H-padB+10}" stroke="#888" stroke-width="1.3"/>`+
      `<path d="M${p1x},${p1y} C${c1x},${p1y} ${c2x},${p2y} ${p2x},${p2y}" fill="none" stroke="#1e3a5c" stroke-width="2.5" stroke-linecap="round"/>`+
      `<line x1="${p1x}" y1="${p1y}" x2="${p1x}" y2="${ax}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p2x}" y1="${p2y}" x2="${p2x}" y2="${ax}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p1x}" y1="${p1y}" x2="${ay}" y2="${p1y}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<line x1="${p2x}" y1="${p2y}" x2="${ay}" y2="${p2y}" stroke="#b7b7b7" stroke-width="1" stroke-dasharray="3,3"/>`+
      `<circle cx="${p1x}" cy="${p1y}" r="4.5" fill="#7a5c1e"/>`+
      `<circle cx="${p2x}" cy="${p2y}" r="4.5" fill="#7a5c1e"/>`+
      `<text x="${p1x}" y="${lx1}" text-anchor="middle" font-size="10.5" font-family="sans-serif" fill="#333">${x1}</text>`+
      `<text x="${p2x}" y="${lx2}" text-anchor="middle" font-size="10.5" font-family="sans-serif" fill="#333">${x2}</text>`+
      `<text x="${ly1x}" y="${p1y+4}" text-anchor="${ly1a}" font-size="10.5" font-family="sans-serif" fill="#333">${y1}</text>`+
      `<text x="${ly2x}" y="${p2y+4}" text-anchor="${ly2a}" font-size="10.5" font-family="sans-serif" fill="#333">${y2}</text>`+
      `</svg></div>`;
      }

      function gen11(){
        const x1=choose([-4,-3,-2,-1]);
        const x2=x1+choose([3,4,5,6]);
        const y1=choose([-3,-2,-1,0,1]);
        const y2=y1+choose([3,4,5,6]);
        const ans=`[${x1},${x2}]`;
        return{
          svg: domainRangeGraphCurve(x1,y1,x2,y2,'y = p(x)') +
            '<p style="font-size:14px;font-family:sans-serif;color:#333;margin-top:6px">State the domain of the function graphed above.</p>',
          answer:[ans],
          hint:'Looking left to right, where does the curve begin and where does it end?',
          step:`\\text{Domain: the graph spans }x=${x1}\\text{ to }x=${x2}.\\quad[${x1},${x2}]`
        };
      }

      function gen12(){
        const x1=choose([-4,-3,-2,-1]);
        const x2=x1+choose([3,4,5,6]);
        const y1=choose([-3,-2,-1,0,1]);
        const y2=y1+choose([3,4,5,6]);
        const ans=`[${y1},${y2}]`;
        return{
          svg: domainRangeGraphCurve(x1,y1,x2,y2,'y = q(x)') +
            '<p style="font-size:14px;font-family:sans-serif;color:#333;margin-top:6px">State the range of the function graphed above.</p>',
          answer:[ans],
          hint:'Looking bottom to top, what is the lowest point and what is the highest point on the curve?',
          step:`\\text{Range: the graph spans }y=${y1}\\text{ to }y=${y2}.\\quad[${y1},${y2}]`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11, gen12];
    })()
  };

  // PC_1_2b: Piecewise Functions
  PRECALC_SPIRAL["PC_1_2b"] = {
    title: "Piecewise Functions",
    index: 3,
    generators: (function() {
      function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[−‐]/g,'-').replace(/∞/g,'inf').replace(/∪/g,'u');}
      function ok(user,acc){return acc.some(a=>norm(user)===norm(a));}
      function gen1(){const cut=choose([0,1,2,-1]);const m=choose([2,3,-1,-2]);const b=choose([1,-1,2,-2]);const xBelow=cut-choose([1,2]);const val=m*xBelow+b;return{latex:`f(x)=\\begin{cases}${m}x${b>=0?'+'+b:b} & x<${cut}\\\\ x^2 & x\\geq ${cut}\\end{cases}\\quad f(${xBelow})=?`,answer:[String(val)],hint:'Which condition does the input satisfy, and which formula does that select?',step:`${xBelow}<${cut},\\text{ so }f(${xBelow})=${m}(${xBelow})${b>=0?'+'+b:b}=${val}`};}
      function gen2(){const cut=choose([0,1,2,-1]);const m=choose([2,3,-1,-2]);const b=choose([1,-1,2,-2]);const xAbove=cut+choose([1,2]);const val=xAbove*xAbove;return{latex:`f(x)=\\begin{cases}${m}x${b>=0?'+'+b:b} & x<${cut}\\\\ x^2 & x\\geq ${cut}\\end{cases}\\quad f(${xAbove})=?`,answer:[String(val)],hint:'Which condition does the input satisfy, and which formula does that select?',step:`${xAbove}\\geq${cut},\\text{ so }f(${xAbove})=(${xAbove})^2=${val}`};}
      function gen3(){const cut=choose([0,1,2,3,-1]);const m=choose([2,3,4]);const c=choose([1,-1,2,-2]);const valAtBoundary=cut*cut+c;return{latex:`f(x)=\\begin{cases}${m}x & x<${cut}\\\\ x^2${c>=0?'+'+c:c} & x\\geq ${cut}\\end{cases}\\quad f(${cut})=?`,answer:[String(valAtBoundary)],hint:'The boundary value belongs to the piece whose condition includes that exact number.',step:`${cut}\\geq${cut},\\text{ so use }x^2${c>=0?'+'+c:c}:\\;(${cut})^2${c>=0?'+'+c:c}=${valAtBoundary}`};}
      function gen4(){const cut=choose([1,2,3,-1]);const cont=choose([true,false]);const rightLimit=cut*cut;const actualM=cont?rightLimit/cut:rightLimit/cut+choose([1,2]);return{latex:`f(x)=\\begin{cases}${actualM}x & x<${cut}\\\\ x^2 & x\\geq ${cut}\\end{cases}\\text{ Continuous at }x=${cut}? (yes/no)`,answer:[cont?'yes':'no'],hint:'Do the values from each piece agree at the boundary point?',step:cont?`\\lim_{x\\to${cut}^-}=${actualM}\\cdot${cut}=${actualM*cut},\\;f(${cut})=${cut*cut}\\Rightarrow\\text{equal}\\Rightarrow\\text{yes}`:`\\lim_{x\\to${cut}^-}=${actualM*cut}\\neq f(${cut})=${cut*cut}\\Rightarrow\\text{not continuous}\\Rightarrow\\text{no}`};}
      function gen5(){
        var svg='<svg viewBox="0 0 230 195" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:190px;margin:.4rem 0">'
          +'<line x1="15" y1="155" x2="213" y2="155" stroke="#bbb" stroke-width="1"/>'+'<polygon points="213,155 208,151 208,159" fill="#bbb"/>'+'<line x1="105" y1="189" x2="105" y2="60" stroke="#bbb" stroke-width="1"/>'+'<polygon points="105,60 101,66 109,66" fill="#bbb"/>'+'<line x1="21" y1="152" x2="21" y2="158" stroke="#ccc" stroke-width="1"/><text x="21" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−3</text>'+'<line x1="49" y1="152" x2="49" y2="158" stroke="#ccc" stroke-width="1"/><text x="49" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−2</text>'+'<line x1="77" y1="152" x2="77" y2="158" stroke="#ccc" stroke-width="1"/><text x="77" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−1</text>'+'<line x1="133" y1="152" x2="133" y2="158" stroke="#ccc" stroke-width="1"/><text x="133" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">1</text>'+'<line x1="161" y1="152" x2="161" y2="158" stroke="#ccc" stroke-width="1"/><text x="161" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">2</text>'+'<line x1="189" y1="152" x2="189" y2="158" stroke="#ccc" stroke-width="1"/><text x="189" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">3</text>'+'<line x1="102" y1="183" x2="108" y2="183" stroke="#ccc" stroke-width="1"/><text x="100" y="186" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">−1</text>'+'<line x1="102" y1="127" x2="108" y2="127" stroke="#ccc" stroke-width="1"/><text x="100" y="130" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">1</text>'+'<line x1="102" y1="99" x2="108" y2="99" stroke="#ccc" stroke-width="1"/><text x="100" y="102" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">2</text>'+'<line x1="102" y1="71" x2="108" y2="71" stroke="#ccc" stroke-width="1"/><text x="100" y="74" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">3</text>'
          +'<line x1="49" y1="71" x2="133" y2="155" stroke="#1e3a5c" stroke-width="2.5"/>'
          +'<circle cx="49" cy="71" r="4" fill="#1e3a5c"/>'
          +'<circle cx="133" cy="155" r="4" fill="white" stroke="#1e3a5c" stroke-width="2"/>'
          +'<line x1="133" y1="71" x2="189" y2="71" stroke="#1e3a5c" stroke-width="2.5"/>'
          +'<circle cx="133" cy="71" r="4" fill="#1e3a5c"/>'
          +'<circle cx="189" cy="71" r="4" fill="#1e3a5c"/>'
          +'</svg>';
        return{
          html:'<p style="font-size:15px;margin-bottom:.5rem">State the <strong>domain</strong> of the function shown.</p>'+svg,
          answer:['[-2,3]','[-2, 3]'],
          hint:'Domain: trace left to right on the x-axis — note where the graph starts and ends.',
          step:'\text{Graph spans }x=-2\text{ to }x=3,\text{ so Domain}=[-2,3]'
        };
      }
      function gen6(){const x=choose([-3,-2,2,3,5]);const val=x<-1?x+5:(x<=2?x*x:2*x-1);const piece=x<-1?`x+5\\text{ (since }x<-1)`:(x<=2?`x^2\\text{ (since }-1\\leq x\\leq 2)`:`2x-1\\text{ (since }x>2)`);return{latex:`f(x)=\\begin{cases}x+5 & x<-1\\\\ x^2 & -1\\leq x\\leq 2\\\\ 2x-1 & x>2\\end{cases}\\quad f(${x})=?`,answer:[String(val)],hint:'Which boundary does the input fall between, and what piece does that activate?',step:`\\text{Use }${piece};\\;f(${x})=${val}`};}
      function gen7(){const a=choose([2,3,4,5]);const b=choose([1,-1,2,-2]);const vNeg=a*(-1)+b;const vZero=1;return{latex:`f(x)=\\begin{cases}${a}x${b>=0?'+'+b:b} & x<0\\\\ x^2+1 & x\\geq 0\\end{cases}\\quad f(-1)+f(0)=?`,answer:[String(vNeg+vZero)],hint:'Evaluate each input using the correct piece, then add the results.',step:`f(-1)=${a}(-1)$${b>=0?'+'+b:b}=${vNeg},\\;f(0)=0+1=1;\\;$${vNeg}+1=${vNeg+1}`};}
      function gen8(){
        var svg='<svg viewBox="0 0 230 195" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:190px;margin:.4rem 0">'
          +'<line x1="15" y1="155" x2="213" y2="155" stroke="#bbb" stroke-width="1"/>'+'<polygon points="213,155 208,151 208,159" fill="#bbb"/>'+'<line x1="105" y1="189" x2="105" y2="60" stroke="#bbb" stroke-width="1"/>'+'<polygon points="105,60 101,66 109,66" fill="#bbb"/>'+'<line x1="21" y1="152" x2="21" y2="158" stroke="#ccc" stroke-width="1"/><text x="21" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−3</text>'+'<line x1="49" y1="152" x2="49" y2="158" stroke="#ccc" stroke-width="1"/><text x="49" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−2</text>'+'<line x1="77" y1="152" x2="77" y2="158" stroke="#ccc" stroke-width="1"/><text x="77" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">−1</text>'+'<line x1="133" y1="152" x2="133" y2="158" stroke="#ccc" stroke-width="1"/><text x="133" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">1</text>'+'<line x1="161" y1="152" x2="161" y2="158" stroke="#ccc" stroke-width="1"/><text x="161" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">2</text>'+'<line x1="189" y1="152" x2="189" y2="158" stroke="#ccc" stroke-width="1"/><text x="189" y="170" font-size="9" text-anchor="middle" font-family="sans-serif" fill="#888">3</text>'+'<line x1="102" y1="183" x2="108" y2="183" stroke="#ccc" stroke-width="1"/><text x="100" y="186" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">−1</text>'+'<line x1="102" y1="127" x2="108" y2="127" stroke="#ccc" stroke-width="1"/><text x="100" y="130" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">1</text>'+'<line x1="102" y1="99" x2="108" y2="99" stroke="#ccc" stroke-width="1"/><text x="100" y="102" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">2</text>'+'<line x1="102" y1="71" x2="108" y2="71" stroke="#ccc" stroke-width="1"/><text x="100" y="74" font-size="9" text-anchor="end" font-family="sans-serif" fill="#888">3</text>'
          +'<line x1="21" y1="127" x2="105" y2="127" stroke="#1e3a5c" stroke-width="2.5"/>'
          +'<circle cx="21" cy="127" r="4" fill="#1e3a5c"/>'
          +'<circle cx="105" cy="127" r="4" fill="white" stroke="#1e3a5c" stroke-width="2"/>'
          +'<line x1="105" y1="183" x2="189" y2="99" stroke="#1e3a5c" stroke-width="2.5"/>'
          +'<circle cx="105" cy="183" r="4" fill="#1e3a5c"/>'
          +'<circle cx="189" cy="99" r="4" fill="#1e3a5c"/>'
          +'</svg>';
        return{
          html:'<p style="font-size:15px;margin-bottom:.5rem">State the <strong>range</strong> of the function shown.</p>'+svg,
          answer:['[-1,2]','[-1, 2]'],
          hint:'Range: trace bottom to top on the y-axis — note which y-values the graph reaches.',
          step:'\text{Graph reaches }y=-1\text{ to }y=2,\text{ so Range}=[-1,2]'
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_1_3: Graph Properties of Functions
  PRECALC_SPIRAL["PC_1_3"] = {
    title: "Graph Properties of Functions",
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

      // Shared graph-drawing helper. f: JS function of x. Draws a numbered coordinate
      // grid + curve from actual sampled values, so the picture and the computed
      // answer always agree. No points are labeled on the graph -- read values
      // straight off the grid, the way you would on paper.
      function graphSVG(f,xMin,xMax,opts){
        opts=opts||{};
        xMin=Math.floor(xMin); xMax=Math.ceil(xMax);
        const W=480,H=300,padL=32,padR=14,padT=14,padB=26;
        const plotW=W-padL-padR, plotH=H-padT-padB, n=60;
        const pts=[]; let yMin=Infinity,yMax=-Infinity;
        for(let i=0;i<=n;i++){
          const x=xMin+(xMax-xMin)*i/n, y=f(x);
          pts.push([x,y]);
          if(y<yMin)yMin=y; if(y>yMax)yMax=y;
        }
        const yPad=Math.max((yMax-yMin)*0.15,0.8);
        yMin=Math.floor(yMin-yPad); yMax=Math.ceil(yMax+yPad);
        const sx=plotW/(xMax-xMin), sy=plotH/(yMax-yMin);
        const px=x=>padL+(x-xMin)*sx, py=y=>padT+(yMax-y)*sy;
        const axisY=Math.max(padT,Math.min(H-padB,py(0)));
        const axisX=Math.max(padL,Math.min(W-padR,px(0)));
        function niceStep(range){ if(range<=12) return 1; if(range<=24) return 2; return 5; }
        const xStep=niceStep(xMax-xMin), yStep=niceStep(yMax-yMin);

        let svg=`<svg width="480" height="300" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
        svg+=`<rect width="${W}" height="${H}" fill="#fcfcfb" rx="6"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          const X=px(gx).toFixed(1);
          svg+=`<line x1="${X}" y1="${padT}" x2="${X}" y2="${H-padB}" stroke="#ececea" stroke-width="1"/>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          const Y=py(gy).toFixed(1);
          svg+=`<line x1="${padL}" y1="${Y}" x2="${W-padR}" y2="${Y}" stroke="#ececea" stroke-width="1"/>`;
        }
        svg+=`<line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="#999" stroke-width="1.3"/>`;
        svg+=`<line x1="${axisX}" y1="${padT}" x2="${axisX}" y2="${H-padB}" stroke="#999" stroke-width="1.3"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          if(gx===0) continue;
          const X=px(gx).toFixed(1);
          svg+=`<text x="${X}" y="${H-padB+11}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="middle">${gx}</text>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          if(gy===0) continue;
          const Y=py(gy).toFixed(1);
          svg+=`<text x="${padL-5}" y="${(parseFloat(Y)+3).toFixed(1)}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="end">${gy}</text>`;
        }
        if(opts.title){
          svg+=`<text x="${padL}" y="11" font-size="10.5" font-family="sans-serif" fill="#555" font-weight="bold">${opts.title}</text>`;
        }
        const poly=pts.map(p=>px(p[0]).toFixed(1)+','+py(p[1]).toFixed(1)).join(' ');
        svg+=`<polyline points="${poly}" fill="none" stroke="#1e3a5c" stroke-width="2.4" stroke-linejoin="round"/>`;
        svg+='</svg>';
        return svg;
      }

      function gen1(){
        // Upward parabola: positive/negative intervals from two x-intercepts.
        const r1=choose([-4,-3,-2,-1]);
        const r2=r1+choose([3,4,5,6]);
        const f=x=>(x-r1)*(x-r2);
        const svg=graphSVG(f,r1-2,r2+2);
        return{
          svg:svg,
          q:'Where is the function positive? Give your answer in interval notation.',
          answer:[`(-inf,${r1})u(${r2},inf)`,`(${r2},inf)u(-inf,${r1})`],
          hint:"Between and outside the two x-intercepts on the grid, where does the curve sit relative to the x-axis?",
          step:`(x-${r1})(x-${r2})=0\\text{ at }x=${r1},${r2}\\text{; opens upward}\\Rightarrow\\text{negative between the roots, positive outside}\\Rightarrow(-\\infty,${r1})\\cup(${r2},\\infty)`
        };
      }

      function gen2(){
        // Upward parabola: increasing/decreasing from the vertex.
        const h=choose([-3,-2,-1,0,1,2,3]);
        const k=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const f=x=>(x-h)*(x-h)+k;
        const svg=graphSVG(f,h-3,h+3);
        return{
          svg:svg,
          q:'Where is the function decreasing? Give your answer in interval notation.',
          answer:[`(-inf,${h})`],
          hint:'Find the vertex on the grid — which side of it does the curve fall as you scan left to right?',
          step:`\\text{Vertex at }x=${h}\\text{; opens upward}\\Rightarrow\\text{decreasing left of the vertex}\\Rightarrow(-\\infty,${h})`
        };
      }

      function gen3(){
        // Downward parabola: positive/negative intervals from two x-intercepts.
        const r1=choose([-3,-2,-1]);
        const r2=r1+choose([3,4,5]);
        const f=x=>-(x-r1)*(x-r2);
        const svg=graphSVG(f,r1-2,r2+2);
        return{
          svg:svg,
          q:'Where is the function negative? Give your answer in interval notation.',
          answer:[`(-inf,${r1})u(${r2},inf)`,`(${r2},inf)u(-inf,${r1})`],
          hint:'Read the two x-intercepts off the grid — outside of them, is the curve above or below the x-axis?',
          step:`-(x-${r1})(x-${r2})=0\\text{ at }x=${r1},${r2}\\text{; opens downward}\\Rightarrow\\text{negative outside the roots}\\Rightarrow(-\\infty,${r1})\\cup(${r2},\\infty)`
        };
      }

      function gen4(){
        // V-shape (absolute value): local minimum.
        const h=choose([-3,-2,-1,0,1,2,3]);
        const k=choose([-4,-3,-2,-1,0,1,2,3]);
        const a=choose([1,2]);
        const f=x=>a*Math.abs(x-h)+k;
        const svg=graphSVG(f,h-3,h+3);
        return{
          svg:svg,
          q:'What is the global minimum of the function?',
          answer:[String(k)],
          hint:'Find the lowest point on the grid — what height (y-value) does it reach?',
          step:`\\text{Vertex of the V at }(${h},${k})\\text{ is the lowest point on the whole graph}\\Rightarrow\\text{global minimum}=${k}`
        };
      }

      function gen5(){
        // Line: positive/negative interval from its x-intercept.
        const m=choose([-3,-2,-1,1,2,3]);
        const root=choose([-3,-2,-1,0,1,2,3]);
        const b=-m*root;
        const f=x=>m*x+b;
        const svg=graphSVG(f,root-4,root+4);
        const ans=m>0?`(${root},inf)`:`(-inf,${root})`;
        return{
          svg:svg,
          q:'Where is the function positive? Give your answer in interval notation.',
          answer:[ans],
          hint:'Read the x-intercept off the grid — which side of it lies above the horizontal axis?',
          step:`f(x)=${fc(m)}x${addT(b,'')}\\text{; crosses zero at }x=${root}\\text{; slope is }${m>0?'positive':'negative'}\\Rightarrow\\text{positive on }${ans}`
        };
      }

      function gen6(){
        // Downward parabola: increasing/decreasing from the peak.
        const h=choose([-3,-2,-1,0,1,2,3]);
        const k=choose([-3,-2,-1,0,1,2,3,4]);
        const f=x=>-(x-h)*(x-h)+k;
        const svg=graphSVG(f,h-3,h+3);
        return{
          svg:svg,
          q:'Where is the function increasing? Give your answer in interval notation.',
          answer:[`(-inf,${h})`],
          hint:'Find the peak on the grid — which side does the curve climb up to reach it?',
          step:`\\text{Vertex at }x=${h}\\text{; opens downward}\\Rightarrow\\text{increasing left of the peak}\\Rightarrow(-\\infty,${h})`
        };
      }

      function gen7(){
        // Upward parabola: absolute minimum value.
        const h=choose([-2,-1,0,1,2]);
        const k=choose([-3,-2,-1,0,1,2,3]);
        const f=x=>(x-h)*(x-h)+k;
        const svg=graphSVG(f,h-3,h+3);
        return{
          svg:svg,
          q:'What is the global minimum of the function?',
          answer:[String(k)],
          hint:"This curve's lowest point never repeats — what y-value does the grid show it reaching?",
          step:`\\text{Vertex at }(${h},${k})\\text{; opens upward}\\Rightarrow\\text{global minimum}=${k}`
        };
      }

      function gen8(){
        // Line: ARC over a stated interval (equals the slope).
        const m=choose([-3,-2,-1,1,2,3]);
        const b=choose([-3,-2,-1,0,1,2,3]);
        const p=choose([-3,-2,-1,0,1]);
        const q=p+choose([2,3,4]);
        const f=x=>m*x+b;
        const fp=f(p), fq=f(q);
        const svg=graphSVG(f,p-1.5,q+1.5,{title:`Average rate of change from x = ${p} to x = ${q}`});
        return{
          svg:svg,
          q:`What is the average rate of change of the function from x = ${p} to x = ${q}?`,
          answer:[String(m)],
          hint:'What single number describes the steepness of a line between two points on the grid?',
          step:`\\text{ARC}=\\dfrac{${fq}-(${fp})}{${q}-(${p})}=\\dfrac{${fq-fp}}{${q-p}}=${m}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_1_4: Function Combinations & Composition
  PRECALC_SPIRAL["PC_1_4"] = {
    title: "Function Combinations & Composition",
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

      function gen1(){
        // (f+g)(a) where f(x)=m*x+n, g(x)=p*x+q
        const m=choose([-3,-2,-1,1,2,3]);
        const n=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const p=choose([-3,-2,-1,1,2,3]);
        const q=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const a=choose([-3,-2,-1,0,1,2,3]);
        const fa=m*a+n, ga=p*a+q;
        const ans=fa+ga;
        const nS=n>=0?`+${n}`:`${n}`, qS=q>=0?`+${q}`:`${q}`;
        return{
          latex:`f(x)=${fc(m)}x${n!==0?nS:''},\\;g(x)=${fc(p)}x${q!==0?qS:''}.\\quad(f+g)(${a})=`,
          answer:[String(ans)],
          hint:'What arithmetic operation on f(a) and g(a) gives (f+g)(a)?',
          step:`f(${a})=${fa},\\;g(${a})=${ga}.\\quad(f+g)(${a})=${fa}+${ga}=${ans}`
        };
      }

      function gen2(){
        // (f-g)(a) where f(x)=x^2+c, g(x)=x+d
        const c=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const d=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const a=choose([-3,-2,-1,0,1,2,3]);
        const fa=a*a+c, ga=a+d;
        const ans=fa-ga;
        const cS=c>=0?`+${c}`:`${c}`, dS=d>=0?`+${d}`:`${d}`;
        return{
          latex:`f(x)=x^2${c!==0?cS:''},\\;g(x)=x${d!==0?dS:''}.\\quad(f-g)(${a})=`,
          answer:[String(ans)],
          hint:'What is the difference of the two function values at this input?',
          step:`f(${a})=${fa},\\;g(${a})=${ga}.\\quad(f-g)(${a})=${fa}-(${ga})=${ans}`
        };
      }

      function gen3(){
        // (fg)(a) where f(x)=x+a_coef, g(x)=x+b_coef; small values so product is manageable
        const p=choose([-3,-2,-1,0,1,2,3]);
        const q=choose([-3,-2,-1,0,1,2,3]);
        const a=choose([-2,-1,0,1,2,3]);
        const fa=a+p, ga=a+q;
        const ans=fa*ga;
        const pS=p>=0?`+${p}`:`${p}`, qS=q>=0?`+${q}`:`${q}`;
        return{
          latex:`f(x)=x${p!==0?pS:''},\\;g(x)=x${q!==0?qS:''}.\\quad(fg)(${a})=`,
          answer:[String(ans)],
          hint:'Which operation on f(a) and g(a) gives the product (fg)(a)?',
          step:`f(${a})=${fa},\\;g(${a})=${ga}.\\quad(fg)(${a})=${fa}\\cdot ${ga}=${ans}`
        };
      }

      function gen4(){
        // (f∘g)(a) where f(x)=x^2+c, g(x)=m*x+b
        const c=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const m=choose([-2,-1,1,2,3]);
        const b=choose([-3,-2,-1,0,1,2,3]);
        const a=choose([-2,-1,0,1,2,3]);
        const ga=m*a+b;
        const ans=ga*ga+c;
        const cS=c>=0?`+${c}`:`${c}`, bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=x^2${c!==0?cS:''},\\;g(x)=${fc(m)}x${b!==0?bS:''}.\\quad(f\\circ g)(${a})=`,
          answer:[String(ans)],
          hint:'In f(g(a)), which function receives the original input a?',
          step:`g(${a})=${ga},\\;f(${ga})=(${ga})^2${c!==0?addT(c,''):''}=${ans}`
        };
      }

      function gen5(){
        // (g∘f)(a) where f(x)=m*x+b, g(x)=x^2
        const m=choose([-2,-1,1,2,3]);
        const b=choose([-3,-2,-1,0,1,2,3]);
        const a=choose([-2,-1,0,1,2,3]);
        const fa=m*a+b;
        const ans=fa*fa;
        const bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\;g(x)=x^2.\\quad(g\\circ f)(${a})=`,
          answer:[String(ans)],
          hint:'In g(f(a)), which function receives the original input a?',
          step:`f(${a})=${fa},\\;g(${fa})=(${fa})^2=${ans}`
        };
      }

      function gen6(){
        // (f∘g)(a) where f(x)=2x+1, g(x)=x-b; both linear
        const b=choose([-4,-3,-2,-1,1,2,3,4]);
        const a=choose([-3,-2,-1,0,1,2,3,4]);
        const ga=a-b;
        const ans=2*ga+1;
        const bS=b>=0?`-${b}`:`+${-b}`;
        return{
          latex:`f(x)=2x+1,\\;g(x)=x${bS}.\\quad(f\\circ g)(${a})=`,
          answer:[String(ans)],
          hint:'In f(g(a)), what value is passed as input to the outer function?',
          step:`g(${a})=${ga},\\;f(${ga})=2(${ga})+1=${ans}`
        };
      }

      function gen7(){
        // (f+g)(a) where f(x)=x^2, g(x)=-x+c
        const c=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const a=choose([-3,-2,-1,0,1,2,3]);
        const fa=a*a, ga=-a+c;
        const ans=fa+ga;
        const cS=c>=0?`+${c}`:`${c}`;
        return{
          latex:`f(x)=x^2,\\;g(x)=-x${c!==0?cS:''}.\\quad(f+g)(${a})=`,
          answer:[String(ans)],
          hint:'What is the sum of the two function values at this specific input?',
          step:`f(${a})=${fa},\\;g(${a})=${ga}.\\quad(f+g)(${a})=${fa}+${ga}=${ans}`
        };
      }

      function gen8(){
        // (f/g)(a) where f(x)=a*x+b, g(x)=c (nonzero constant) — answer = integer
        const m=choose([-3,-2,-1,1,2,3]);
        const b=choose([-6,-4,-2,0,2,4,6]);
        const divisor=choose([-2,-1,1,2]);
        // choose x so that m*x+b is divisible by divisor
        // m*x+b = divisor*k => pick x s.t. m*x+b divisible
        const x_vals=[-3,-2,-1,0,1,2,3].filter(x=>((m*x+b)%divisor===0));
        if(x_vals.length===0){
          // fallback
          const fa_=2, x_=3, ans_=2;
          return{
            latex:`f(x)=2x,\\;g(x)=x.\\quad\\left(\\dfrac{f}{g}\\right)(${x_})=`,
            answer:[String(ans_)],
            hint:'What is the ratio of f(a) to g(a) at the given input?',
            step:`\\dfrac{f(${x_})}{g(${x_})}=\\dfrac{${fa_*x_}}{${x_}}=${ans_}`
          };
        }
        const x=choose(x_vals);
        const fa=m*x+b, ga=divisor;
        const ans=fa/divisor;
        const bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\;g(x)=${divisor}.\\quad\\left(\\dfrac{f}{g}\\right)(${x})=`,
          answer:[String(ans)],
          hint:'What is the ratio of f(a) to g(a) at the given input?',
          step:`\\dfrac{f(${x})}{g(${x})}=\\dfrac{${fa}}{${divisor}}=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_1_5: Transformations of Functions
  PRECALC_SPIRAL["PC_1_5"] = {
    title: "Transformations of Functions",
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

      function gen1(){
        const h=choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const k=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        return{
          latex:`y=(x${hS})^2${k!==0?kS:''}\\quad\\text{Horizontal shift: how many units right?}`,
          answer:[String(h)],
          hint:'In y=f(x-h)+k, what does h represent as a horizontal shift?',
          step:`h=${h},\\text{ so the graph shifts right }${h}\\text{ unit${Math.abs(h)===1?'':'s'}}`
        };
      }

      function gen2(){
        const h=choose([1,2,3,4,5,6]);
        const k=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const kS=k>=0?`-${k}`:`+${-k}`;
        return{
          latex:`y=\\sqrt{x+${h}}${k!==0?kS:''}\\quad\\text{Horizontal shift left: how many units?}`,
          answer:[String(h)],
          hint:'What does adding h inside the function do to the graph horizontally?',
          step:`+${h}\\text{ inside }\\Rightarrow\\text{shift left }${h}\\text{ unit${h===1?'':'s'}}`
        };
      }

      function gen3(){
        const h=choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const k=choose([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        return{
          latex:`y=|x${hS}|${kS}\\quad\\text{Vertical shift: how many units?}`,
          answer:[String(Math.abs(k))],
          hint:'What does adding or subtracting a constant outside the function do vertically?',
          step:`${k>0?`+${k}\\text{ outside }\\Rightarrow\\text{up }${k}`:`${k}\\text{ outside }\\Rightarrow\\text{down }${-k}`}\\text{ unit${Math.abs(k)===1?'':'s'}}`
        };
      }

      function gen4(){
        const a=choose([-3,-2,-1,1,2,3]);
        const h=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const k=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        const aS=a===1?'':a===-1?'-':String(a);
        return{
          latex:`y=${aS}(x${hS})^2${k!==0?kS:''}\\quad\\text{Vertex }x\\text{-coordinate}=`,
          answer:[String(h)],
          hint:'What is the x-coordinate of the vertex in vertex form?',
          step:`\\text{Vertex form }a(x-h)^2+k\\Rightarrow h=${h}`
        };
      }

      function gen5(){
        const a=choose([2,3,4,5,6]);
        const fns=['x^2','|x|','\\sqrt{x}','x^3'];
        const fn=choose(fns);
        return{
          latex:`y=${a}${fn.startsWith('\\')?'\\cdot ':' \\cdot '}${fn}\\quad\\text{Vertical stretch factor}=`,
          answer:[String(a)],
          hint:'By what factor are all y-values multiplied in y=af(x)?',
          step:`\\text{Leading coefficient }a=${a}\\Rightarrow\\text{vertical stretch by }${a}`
        };
      }

      function gen6(){
        const h=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const k=choose([-3,-2,-1,0,1,2,3,4,5,6]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        return{
          latex:`y=-(x${hS})^2${k!==0?kS:''}\\quad\\text{Absolute maximum}=`,
          answer:[String(k)],
          hint:'At which y-value does the vertex of a downward-opening parabola sit?',
          step:`\\text{Vertex at }(${h},${k}),\\text{ opens down}\\Rightarrow\\text{max}=${k}`
        };
      }

      function gen7(){
        const a=choose([-3,-2,-1,1,2,3]);
        const h=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const k=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        const aS=a===1?'':a===-1?'-':String(a);
        return{
          latex:`y=${aS}(x${hS})^2${k!==0?kS:''}\\quad\\text{Vertex }y\\text{-coordinate}=`,
          answer:[String(k)],
          hint:'What is the y-coordinate of the vertex in vertex form?',
          step:`\\text{Vertex form }a(x-h)^2+k\\Rightarrow k=${k}`
        };
      }

      function gen8(){
        const a=choose([2,3,4]);
        const h=choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const k=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const hS=h>=0?`-${h}`:`+${-h}`;
        const kS=k>=0?`+${k}`:`${k}`;
        return{
          latex:`y=${a}(x${hS})^2${k!==0?kS:''}\\quad\\text{Vertical stretch factor}=`,
          answer:[String(a)],
          hint:'Which coefficient controls the vertical stretch in vertex form?',
          step:`\\text{Leading factor }a=${a}\\Rightarrow\\text{vertical stretch by }${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_1_7: Inverse Functions
  PRECALC_SPIRAL["PC_1_7"] = {
    title: "Inverse Functions",
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

      function gen1(){
        // Evaluate f^{-1}(v) where f(x)=m*x+b. f^{-1}(x)=(x-b)/m.
        // Pick answer k, then v = m*k+b, so f^{-1}(v)=k.
        const m=choose([-3,-2,2,3,4]);
        const b=choose([-6,-4,-3,-2,-1,0,1,2,3,4,6]);
        const k=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const v=m*k+b;
        const bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\quad f^{-1}(${v})=`,
          answer:[String(k)],
          hint:'If f maps k to v, what does f-inverse map v to?',
          step:`f(${k})=${m}(${k})${b!==0?addT(b,''):''}=${v},\\text{ so }f^{-1}(${v})=${k}`
        };
      }

      function gen2(){
        // f^{-1}(f(a)) = a. Just state it directly.
        const m=choose([-3,-2,2,3]);
        const b=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const a=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\quad f^{-1}(f(${a}))=`,
          answer:[String(a)],
          hint:'What does the cancellation property of inverse functions guarantee?',
          step:`f^{-1}(f(x))=x\\text{ for all }x,\\text{ so }f^{-1}(f(${a}))=${a}`
        };
      }

      function gen3(){
        // Table: given f table, find f^{-1}(target)
        const tables=[
          {xs:[1,2,3,4,5],ys:[3,7,11,15,19]},
          {xs:[0,1,2,3,4],ys:[2,5,8,11,14]},
          {xs:[-2,-1,0,1,2],ys:[-5,-2,1,4,7]},
          {xs:[1,2,3,4,5],ys:[-4,-1,2,5,8]},
          {xs:[0,1,2,3,4],ys:[10,7,4,1,-2]},
        ];
        const t=choose(tables);
        const i=rInt(t.xs.length);
        const target=t.ys[i];
        const table=`\\begin{array}{c|${'c'.repeat(t.xs.length)}}x & ${t.xs.join(' & ')}\\\\\\hline f(x) & ${t.ys.join(' & ')}\\end{array}`;
        return{
          latex:`${table}\\\\[8pt]f^{-1}(${target})=`,
          answer:[String(t.xs[i])],
          hint:'If f inverse reverses f, which x-row pairs with the given output?',
          step:`f(${t.xs[i]})=${target},\\text{ so }f^{-1}(${target})=${t.xs[i]}`
        };
      }

      function gen4(){
        // One-to-one yes/no
        const cases=[
          {desc:'f(x)=3x-5',is_oto:true,step:'\\text{Linear with nonzero slope: strictly increasing}\\Rightarrow\\text{one-to-one}'},
          {desc:'f(x)=x^2',is_oto:false,step:'f(2)=f(-2)=4\\Rightarrow\\text{not one-to-one}'},
          {desc:'f(x)=|x|',is_oto:false,step:'f(3)=f(-3)=3\\Rightarrow\\text{not one-to-one}'},
          {desc:'f(x)=x^3',is_oto:true,step:'\\text{Strictly increasing on all reals}\\Rightarrow\\text{one-to-one}'},
          {desc:'f(x)=2',is_oto:false,step:'\\text{Constant function: every input maps to }2\\Rightarrow\\text{not one-to-one}'},
          {desc:'f(x)=\\sqrt{x}',is_oto:true,step:'\\text{Strictly increasing for }x\\geq 0\\Rightarrow\\text{one-to-one}'},
        ];
        const c=choose(cases);
        return{
          latex:`\\text{Is }${c.desc}\\text{ one-to-one? (yes/no)}`,
          answer:[c.is_oto?'yes':'no'],
          hint:'Does the graph pass the Horizontal Line Test?',
          step:c.step
        };
      }

      function gen5(){
        // Verify inverse: f(g(a))=? where f(x)=m*x+b, g=(x-b)/m. Answer = a.
        const m=choose([-3,-2,2,3,4]);
        const b=choose([-6,-4,-2,0,2,4,6]);
        const a=choose([-3,-2,-1,0,1,2,3]);
        const bS=b>=0?`+${b}`:`${b}`;
        const neg_b=-b;
        const neg_bS=neg_b>=0?`+${neg_b}`:`${neg_b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\;g(x)=\\dfrac{x${neg_b!==0?neg_bS:''}}{${m}}.\\quad f(g(${a}))=`,
          answer:[String(a)],
          hint:'What must f(g(x)) equal if f and g are inverses of each other?',
          step:`g(${a})=\\dfrac{${a}${neg_b!==0?neg_bS:''}}{${m}}=${(a+neg_b)/m},\\;f\\!\\left(${(a+neg_b)/m}\\right)=${m}\\cdot${(a+neg_b)/m}${b!==0?addT(b,''):''}=${a}`
        };
      }

      function gen6(){
        // f(x)=x^2+k, domain x>=0. f^{-1}(x)=sqrt(x-k).
        // v = n^2+k, answer = n (non-negative integer).
        const k=choose([-4,-3,-2,-1,0,1,2,3]);
        const n=choose([1,2,3,4]);
        const v=n*n+k;
        const kS=k>=0?`+${k}`:`${k}`;
        return{
          latex:`f(x)=x^2${k!==0?kS:''},\\;x\\geq 0.\\quad f^{-1}(${v})=`,
          answer:[String(n)],
          hint:'What non-negative x satisfies f(x) equal to the given value?',
          step:`f(${n})=${n}^2${k!==0?addT(k,''):''}=${v},\\;x\\geq 0,\\text{ so }f^{-1}(${v})=${n}`
        };
      }

      function gen7(){
        // Given f(a)=b, what is f^{-1}(b)?
        const m=choose([-3,-2,2,3]);
        const b=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const a=choose([-3,-2,-1,0,1,2,3]);
        const fa=m*a+b;
        const bS=b>=0?`+${b}`:`${b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\;\\text{and }f(${a})=${fa}.\\quad f^{-1}(${fa})=`,
          answer:[String(a)],
          hint:'If the function sends a to fa, which direction does the inverse send fa?',
          step:`f(${a})=${fa}\\Rightarrow f^{-1}(${fa})=${a}`
        };
      }

      function gen8(){
        // f(x)=mx+b, compute f^{-1}(v) for explicit v — different m from gen1 pool
        const m=choose([2,3,4,5]);
        const b=choose([-8,-6,-4,-2,0,2,4,6,8]);
        const k=choose([-3,-2,-1,0,1,2,3]);
        const v=m*k+b;
        const bS=b>=0?`+${b}`:`${b}`;
        const inv_bS=(-b)>=0?`+${-b}`:`${-b}`;
        return{
          latex:`f(x)=${fc(m)}x${b!==0?bS:''},\\quad f^{-1}(x)=\\dfrac{x${-b!==0?inv_bS:''}}{${m}}.\\quad f^{-1}(${v})=`,
          answer:[String(k)],
          hint:'What x-value does the inverse formula assign to this input?',
          step:`f^{-1}(${v})=\\dfrac{${v}${-b!==0?inv_bS:''}}{${m}}=\\dfrac{${v-b}}{${m}}=${k}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_2_1: Lines & Linear Functions
  PRECALC_SPIRAL["PC_2_1"] = {
    title: "Lines & Linear Functions",
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

      function gen1(){
        // Slope from two points — answer is integer m
        const m = choose([-3,-2,-1,1,2,3]);
        const x1 = choose([-3,-2,-1,0,1,2]);
        const dx = choose([-3,-2,-1,1,2,3]);
        const x2 = x1 + dx;
        const y1 = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const y2 = y1 + m * dx;
        const rise = y2 - y1;
        const riseS = rise >= 0 ? String(rise) : `(${rise})`;
        const dxS  = dx  >= 0 ? String(dx)  : `(${dx})`;
        return {
          latex: `\\text{Find the slope through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).`,
          answer: [String(m)],
          hint: 'What does slope measure as a ratio of vertical to horizontal change between two points?',
          step: `m=\\dfrac{${y2}-${y1}}{${x2}-${x1}}=\\dfrac{${riseS}}{${dxS}}=${m}`
        };
      }

      function gen2(){
        // Find y-intercept b given slope m and a point on the line
        const m = choose([-3,-2,-1,1,2,3]);
        const x0 = choose([-3,-2,-1,1,2,3]);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const y0 = m * x0 + b;
        const bS = b >= 0 ? `+${b}` : `${b}`;
        return {
          latex: `\\text{Line: slope }m=${m},\\text{ passes through }(${x0},\\,${y0}).\\text{ Find }b.`,
          answer: [String(b)],
          hint: 'In slope-intercept form, what does the constant b represent geometrically?',
          step: `${y0}=${m}(${x0})+b,\\quad b=${y0}-${m*x0}=${b}`
        };
      }

      function gen3(){
        // Parallel slope — equal slopes
        const m = choose([-4,-3,-2,-1,1,2,3,4]);
        return {
          latex: `\\text{A line has slope }m=${m}.\\text{ What is the slope of a parallel line?}`,
          answer: [String(m)],
          hint: 'What slope relationship must parallel lines always share?',
          step: `\\text{Parallel lines have equal slopes, so }m_{\\parallel}=${m}`
        };
      }

      function gen4(){
        // Perpendicular slope — given fractional slope 1/n or -1/n, answer is integer
        const n = choose([2,3,4,5]);
        const sign = choose([1,-1]);
        const perpSlope = -sign * n;
        const givenFrac = sign === 1 ? `\\dfrac{1}{${n}}` : `-\\dfrac{1}{${n}}`;
        const perpS = perpSlope >= 0 ? String(perpSlope) : `${perpSlope}`;
        return {
          latex: `\\text{A line has slope }m=${givenFrac}.\\text{ What is the slope of a perpendicular line?}`,
          answer: [String(perpSlope)],
          hint: 'What is the slope relationship between two perpendicular lines?',
          step: `\\text{Perp. slope} = -\\dfrac{1}{${givenFrac}} = ${perpS}`
        };
      }

      function gen5(){
        // Slope from standard form Ax + By = C
        const m = choose([-3,-2,-1,1,2,3]);
        const b = choose([-5,-4,-3,-1,0,1,3,5]);
        let latex_eq;
        if (m > 0) {
          // Form: mx - y = -b  (positive leading coefficient)
          const Aterm = m === 1 ? 'x' : `${m}x`;
          latex_eq = `${Aterm} - y = ${-b}`;
        } else {
          // Form: |m|x + y = b  (positive leading coefficient)
          const A = -m;
          const Aterm = A === 1 ? 'x' : `${A}x`;
          latex_eq = `${Aterm} + y = ${b}`;
        }
        const bS = b !== 0 ? addT(b, '') : '';
        return {
          latex: `\\text{Find slope: }${latex_eq}`,
          answer: [String(m)],
          hint: 'Which form of a line equation displays slope most directly?',
          step: `y=${fc(m)}x${bS},\\quad m=${m}`
        };
      }

      function gen6(){
        // Evaluate y = mx + b at x = a
        const m = choose([-3,-2,-1,1,2,3]);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const a = choose([-3,-2,-1,0,1,2,3]);
        const y = m * a + b;
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        return {
          latex: `y=${fc(m)}x${bS}.\\quad\\text{Find }y\\text{ when }x=${a}.`,
          answer: [String(y)],
          hint: 'What output does slope-intercept form produce for a given value of x?',
          step: `y=${m}(${a})${b !== 0 ? addT(b,'') : ''}=${y}`
        };
      }

      function gen7(){
        // Point-slope form given — find the y-intercept b
        const m = choose([-3,-2,-1,1,2,3]);
        const x1 = choose([-3,-2,-1,0,1,2,3]);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const y1 = m * x1 + b;
        // Build "y - y1 = m(x - x1)" display
        const lhs = y1 === 0 ? 'y' : (y1 > 0 ? `y-${y1}` : `y+${-y1}`);
        const rhs_x = x1 === 0 ? 'x' : (x1 > 0 ? `x-${x1}` : `x+${-x1}`);
        const bS = b !== 0 ? addT(b, '') : '';
        return {
          latex: `${lhs}=${fc(m)}(${rhs_x}).\\quad\\text{Find }b.`,
          answer: [String(b)],
          hint: 'What is the y-coordinate of the point where a non-vertical line crosses the y-axis?',
          step: `y=${fc(m)}x${bS},\\text{ so }b=${b}`
        };
      }

      function gen8(){
        // Missing y-coordinate given slope and one point
        const m = choose([-3,-2,-1,1,2,3]);
        const x1 = choose([-3,-2,-1,0,1,2]);
        const dx = choose([-3,-2,-1,1,2,3]);
        const x2 = x1 + dx;
        const y1 = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const y2 = y1 + m * dx;
        const lhsY = y1 === 0 ? 'y' : (y1 > 0 ? `y-${y1}` : `y+${-y1}`);
        return {
          latex: `\\text{Slope }m=${m},\\text{ through }(${x1},\\,${y1})\\text{ and }(${x2},\\,y).\\quad y=`,
          answer: [String(y2)],
          hint: 'Given slope and one endpoint, what does rise over run reveal about the second point?',
          step: `${m}=\\dfrac{${lhsY}}{${x2}-${x1}},\\quad ${lhsY}=${m*dx},\\quad y=${y2}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_2_2: Graphing Linear Equations
  PRECALC_SPIRAL["PC_2_2"] = {
    title: "Graphing Linear Equations",
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

      // Shared graph-drawing helper. f: JS function of x. Draws a numbered coordinate
      // grid + curve from actual sampled values, so the picture and the computed
      // answer always agree. No points are labeled on the graph -- read values
      // straight off the grid, the way you would on paper.
      // opts.yRange: [yMin,yMax] to force a fixed vertical range instead of
      // auto-fitting to the sampled curve (needed for flat/steep special cases
      // like horizontal lines, where auto-fit would squash the grid).
      function graphSVG(f,xMin,xMax,opts){
        opts=opts||{};
        xMin=Math.floor(xMin); xMax=Math.ceil(xMax);
        const W=480,H=300,padL=32,padR=14,padT=14,padB=26;
        const plotW=W-padL-padR, plotH=H-padT-padB, n=60;
        const pts=[]; let yMin=Infinity,yMax=-Infinity;
        for(let i=0;i<=n;i++){
          const x=xMin+(xMax-xMin)*i/n, y=f(x);
          pts.push([x,y]);
          if(y<yMin)yMin=y; if(y>yMax)yMax=y;
        }
        if(opts.yRange){
          yMin=opts.yRange[0]; yMax=opts.yRange[1];
        } else {
          const yPad=Math.max((yMax-yMin)*0.15,0.8);
          yMin=Math.floor(yMin-yPad); yMax=Math.ceil(yMax+yPad);
        }
        const sx=plotW/(xMax-xMin), sy=plotH/(yMax-yMin);
        const px=x=>padL+(x-xMin)*sx, py=y=>padT+(yMax-y)*sy;
        const axisY=Math.max(padT,Math.min(H-padB,py(0)));
        const axisX=Math.max(padL,Math.min(W-padR,px(0)));
        function niceStep(range){ if(range<=12) return 1; if(range<=24) return 2; return 5; }
        const xStep=niceStep(xMax-xMin), yStep=niceStep(yMax-yMin);

        let svg=`<svg width="480" height="300" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
        svg+=`<rect width="${W}" height="${H}" fill="#fcfcfb" rx="6"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          const X=px(gx).toFixed(1);
          svg+=`<line x1="${X}" y1="${padT}" x2="${X}" y2="${H-padB}" stroke="#ececea" stroke-width="1"/>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          const Y=py(gy).toFixed(1);
          svg+=`<line x1="${padL}" y1="${Y}" x2="${W-padR}" y2="${Y}" stroke="#ececea" stroke-width="1"/>`;
        }
        svg+=`<line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="#999" stroke-width="1.3"/>`;
        svg+=`<line x1="${axisX}" y1="${padT}" x2="${axisX}" y2="${H-padB}" stroke="#999" stroke-width="1.3"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          if(gx===0) continue;
          const X=px(gx).toFixed(1);
          svg+=`<text x="${X}" y="${H-padB+11}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="middle">${gx}</text>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          if(gy===0) continue;
          const Y=py(gy).toFixed(1);
          svg+=`<text x="${padL-5}" y="${(parseFloat(Y)+3).toFixed(1)}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="end">${gy}</text>`;
        }
        if(opts.title){
          svg+=`<text x="${padL}" y="11" font-size="10.5" font-family="sans-serif" fill="#555" font-weight="bold">${opts.title}</text>`;
        }
        const poly=pts.map(p=>px(p[0]).toFixed(1)+','+py(p[1]).toFixed(1)).join(' ');
        svg+=`<polyline points="${poly}" fill="none" stroke="#1e3a5c" stroke-width="2.4" stroke-linejoin="round"/>`;
        svg+='</svg>';
        return svg;
      }

      // Vertical line x = h (graphSVG can't represent this -- it only plots y=f(x)).
      function vertGraphSVG(h,opts){
        opts=opts||{};
        const xMin=h-4, xMax=h+4, yMin=-4, yMax=4;
        const W=480,H=300,padL=32,padR=14,padT=14,padB=26;
        const plotW=W-padL-padR, plotH=H-padT-padB;
        const sx=plotW/(xMax-xMin), sy=plotH/(yMax-yMin);
        const px=x=>padL+(x-xMin)*sx, py=y=>padT+(yMax-y)*sy;
        const axisY=Math.max(padT,Math.min(H-padB,py(0)));
        const axisX=Math.max(padL,Math.min(W-padR,px(0)));
        const xStep=1, yStep=1;
        let svg=`<svg width="480" height="300" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
        svg+=`<rect width="${W}" height="${H}" fill="#fcfcfb" rx="6"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          const X=px(gx).toFixed(1);
          svg+=`<line x1="${X}" y1="${padT}" x2="${X}" y2="${H-padB}" stroke="#ececea" stroke-width="1"/>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          const Y=py(gy).toFixed(1);
          svg+=`<line x1="${padL}" y1="${Y}" x2="${W-padR}" y2="${Y}" stroke="#ececea" stroke-width="1"/>`;
        }
        svg+=`<line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="#999" stroke-width="1.3"/>`;
        svg+=`<line x1="${axisX}" y1="${padT}" x2="${axisX}" y2="${H-padB}" stroke="#999" stroke-width="1.3"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          if(gx===0) continue;
          const X=px(gx).toFixed(1);
          svg+=`<text x="${X}" y="${H-padB+11}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="middle">${gx}</text>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          if(gy===0) continue;
          const Y=py(gy).toFixed(1);
          svg+=`<text x="${padL-5}" y="${(parseFloat(Y)+3).toFixed(1)}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="end">${gy}</text>`;
        }
        if(opts.title){
          svg+=`<text x="${padL}" y="11" font-size="10.5" font-family="sans-serif" fill="#555" font-weight="bold">${opts.title}</text>`;
        }
        const X=px(h).toFixed(1);
        svg+=`<line x1="${X}" y1="${padT}" x2="${X}" y2="${H-padB}" stroke="#1e3a5c" stroke-width="2.4" stroke-linejoin="round"/>`;
        svg+='</svg>';
        return svg;
      }

      // Two lines on one grid (navy + gold, matching the course palette) -- for
      // parallel/perpendicular reads and for reading an intersection point.
      function twoLineGraphSVG(f1,f2,xMin,xMax,opts){
        opts=opts||{};
        xMin=Math.floor(xMin); xMax=Math.ceil(xMax);
        const W=480,H=300,padL=32,padR=14,padT=14,padB=26;
        const plotW=W-padL-padR, plotH=H-padT-padB, n=60;
        const pts1=[],pts2=[]; let yMin=Infinity,yMax=-Infinity;
        for(let i=0;i<=n;i++){
          const x=xMin+(xMax-xMin)*i/n;
          const y1=f1(x), y2=f2(x);
          pts1.push([x,y1]); pts2.push([x,y2]);
          if(y1<yMin)yMin=y1; if(y1>yMax)yMax=y1;
          if(y2<yMin)yMin=y2; if(y2>yMax)yMax=y2;
        }
        const yPad=Math.max((yMax-yMin)*0.15,0.8);
        yMin=Math.floor(yMin-yPad); yMax=Math.ceil(yMax+yPad);
        const sx=plotW/(xMax-xMin), sy=plotH/(yMax-yMin);
        const px=x=>padL+(x-xMin)*sx, py=y=>padT+(yMax-y)*sy;
        const axisY=Math.max(padT,Math.min(H-padB,py(0)));
        const axisX=Math.max(padL,Math.min(W-padR,px(0)));
        function niceStep(range){ if(range<=12) return 1; if(range<=24) return 2; return 5; }
        const xStep=niceStep(xMax-xMin), yStep=niceStep(yMax-yMin);

        let svg=`<svg width="480" height="300" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
        svg+=`<rect width="${W}" height="${H}" fill="#fcfcfb" rx="6"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          const X=px(gx).toFixed(1);
          svg+=`<line x1="${X}" y1="${padT}" x2="${X}" y2="${H-padB}" stroke="#ececea" stroke-width="1"/>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          const Y=py(gy).toFixed(1);
          svg+=`<line x1="${padL}" y1="${Y}" x2="${W-padR}" y2="${Y}" stroke="#ececea" stroke-width="1"/>`;
        }
        svg+=`<line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="#999" stroke-width="1.3"/>`;
        svg+=`<line x1="${axisX}" y1="${padT}" x2="${axisX}" y2="${H-padB}" stroke="#999" stroke-width="1.3"/>`;
        for(let gx=Math.ceil(xMin/xStep)*xStep; gx<=xMax; gx+=xStep){
          if(gx===0) continue;
          const X=px(gx).toFixed(1);
          svg+=`<text x="${X}" y="${H-padB+11}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="middle">${gx}</text>`;
        }
        for(let gy=Math.ceil(yMin/yStep)*yStep; gy<=yMax; gy+=yStep){
          if(gy===0) continue;
          const Y=py(gy).toFixed(1);
          svg+=`<text x="${padL-5}" y="${(parseFloat(Y)+3).toFixed(1)}" font-size="9" font-family="sans-serif" fill="#999" text-anchor="end">${gy}</text>`;
        }
        if(opts.title){
          svg+=`<text x="${padL}" y="11" font-size="10.5" font-family="sans-serif" fill="#555" font-weight="bold">${opts.title}</text>`;
        }
        const poly1=pts1.map(p=>px(p[0]).toFixed(1)+','+py(p[1]).toFixed(1)).join(' ');
        const poly2=pts2.map(p=>px(p[0]).toFixed(1)+','+py(p[1]).toFixed(1)).join(' ');
        svg+=`<polyline points="${poly1}" fill="none" stroke="#1e3a5c" stroke-width="2.4" stroke-linejoin="round"/>`;
        svg+=`<polyline points="${poly2}" fill="none" stroke="#7a5c1e" stroke-width="2.4" stroke-linejoin="round"/>`;
        svg+='</svg>';
        return svg;
      }

      function gen1(){
        // Read slope from a graphed line.
        const m=choose([-4,-3,-2,-1,1,2,3,4]);
        const b=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const f=x=>m*x+b;
        const svg=graphSVG(f,-5,5);
        return{
          svg:svg,
          q:'What is the slope of this line?',
          answer:[String(m)],
          hint:'Pick two grid points the line passes through — what ratio of rise to run connects them?',
          step:`\\text{Two grid points on the line give }m=\\dfrac{\\text{rise}}{\\text{run}}=${m}`
        };
      }

      function gen2(){
        // Read y-intercept as an ordered pair.
        const m=choose([-3,-2,-1,1,2,3]);
        const b=choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const f=x=>m*x+b;
        const svg=graphSVG(f,-5,5);
        return{
          svg:svg,
          q:'What is the y-intercept of this line? Give it as an ordered pair.',
          answer:[`(0,${b})`,`(0, ${b})`],
          hint:'Where does the line cross the vertical axis on the grid?',
          step:`\\text{The line crosses the y-axis at }y=${b}\\Rightarrow(0,${b})`
        };
      }

      function gen3(){
        // Read x-intercept as an ordered pair. Choose m and k (the x-intercept)
        // so b works out to an integer and the point sits cleanly on the grid.
        const m=choose([-3,-2,-1,1,2,3]);
        const k=choose([-4,-3,-2,-1,1,2,3,4]);
        const b=-m*k;
        const f=x=>m*x+b;
        const svg=graphSVG(f,Math.min(-5,k-3),Math.max(5,k+3));
        return{
          svg:svg,
          q:'What is the x-intercept of this line? Give it as an ordered pair.',
          answer:[`(${k},0)`,`(${k}, 0)`],
          hint:'Where does the line cross the horizontal axis on the grid?',
          step:`\\text{The line crosses the x-axis at }x=${k}\\Rightarrow(${k},0)`
        };
      }

      function gen4(){
        // Evaluate y at a given x, read straight off the plotted line.
        const m=choose([-3,-2,-1,1,2,3]);
        const b=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const a=choose([-3,-2,-1,1,2,3]);
        const y=m*a+b;
        const f=x=>m*x+b;
        const svg=graphSVG(f,-5,5,{title:`Find y when x = ${a}`});
        return{
          svg:svg,
          q:`What is y when x = ${a}?`,
          answer:[String(y)],
          hint:'Trace up or down from that x-value on the grid until you hit the line — what height do you land on?',
          step:`\\text{At }x=${a}\\text{, the line has height }y=${y}`
        };
      }

      function gen5(){
        // Horizontal line -> equation.
        const k=choose([-4,-3,-2,-1,1,2,3,4]);
        const svg=graphSVG(x=>k,-5,5,{yRange:[-5,5]});
        return{
          svg:svg,
          q:'What is the equation of this horizontal line?',
          answer:[`y=${k}`],
          hint:'A horizontal line has the same height everywhere — what single y-value does this one sit at?',
          step:`\\text{Every point on this line has }y=${k}\\Rightarrow y=${k}`
        };
      }

      function gen6(){
        // Vertical line -> equation.
        const h=choose([-4,-3,-2,-1,1,2,3,4]);
        const svg=vertGraphSVG(h,{});
        return{
          svg:svg,
          q:'What is the equation of this vertical line?',
          answer:[`x=${h}`],
          hint:'A vertical line has the same x-value everywhere — what single x-value does this one sit at?',
          step:`\\text{Every point on this line has }x=${h}\\Rightarrow x=${h}`
        };
      }

      function gen7(){
        // Two graphed lines -- parallel? (yes/no)
        const m1=choose([-3,-2,-1,1,2,3]);
        const b1=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const isParallel=choose([true,false]);
        let m2,b2;
        if(isParallel){
          m2=m1;
          b2=b1+choose([-4,-3,-2,-1,1,2,3,4]);
        } else {
          const others=[-3,-2,-1,1,2,3].filter(v=>v!==m1);
          m2=choose(others);
          b2=choose([-4,-3,-2,-1,0,1,2,3,4]);
        }
        const f1=x=>m1*x+b1, f2=x=>m2*x+b2;
        const svg=twoLineGraphSVG(f1,f2,-5,5);
        const ans=isParallel?'yes':'no';
        return{
          svg:svg,
          q:'Do these two lines look parallel? (yes/no)',
          answer:[ans],
          hint:'What visual relationship must two parallel lines maintain across the whole grid?',
          step:isParallel
            ?`\\text{Both lines have the same slope}\\Rightarrow\\text{parallel}`
            :`\\text{The lines have different slopes}\\Rightarrow\\text{not parallel}`
        };
      }

      function gen8(){
        // Two graphed lines -- perpendicular? (yes/no)
        const m1=choose([-3,-2,-1,1,2,3]);
        const b1=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const b2=choose([-4,-3,-2,-1,0,1,2,3,4]);
        const isPerp=choose([true,false]);
        const perpM2=-1/m1;
        let m2;
        if(isPerp){
          m2=perpM2;
        } else {
          const others=[-3,-2,-1,1,2,3].filter(v=>v!==m1 && v!==perpM2);
          m2=choose(others);
        }
        const f1=x=>m1*x+b1, f2=x=>m2*x+b2;
        const svg=twoLineGraphSVG(f1,f2,-5,5);
        const ans=isPerp?'yes':'no';
        const m2Latex=isPerp?`-\\dfrac{1}{${m1}}`:String(m2);
        return{
          svg:svg,
          q:'Do these two lines look perpendicular, crossing at a right angle? (yes/no)',
          answer:[ans],
          hint:'What must be true about two slopes for their lines to cross at a right angle?',
          step:isPerp
            ?`${m1}\\cdot\\left(${m2Latex}\\right)=-1\\Rightarrow\\text{perpendicular}`
            :`${m1}\\cdot(${m2})=${m1*m2}\\neq-1\\Rightarrow\\text{not perpendicular}`
        };
      }

      function gen9(){
        // Two graphed lines with different slopes, constructed to cross at a
        // chosen lattice point -- read the intersection straight off the grid.
        const ix=choose([-3,-2,-1,0,1,2,3]);
        const iy=choose([-3,-2,-1,0,1,2,3]);
        const slopes=[-3,-2,-1,1,2,3];
        const m1=choose(slopes);
        const others=slopes.filter(v=>v!==m1);
        const m2=choose(others);
        const b1=iy-m1*ix, b2=iy-m2*ix;
        const f1=x=>m1*x+b1, f2=x=>m2*x+b2;
        const svg=twoLineGraphSVG(f1,f2,Math.min(-5,ix-3),Math.max(5,ix+3));
        return{
          svg:svg,
          q:'At what point do these two lines intersect? Give your answer as an ordered pair.',
          answer:[`(${ix},${iy})`,`(${ix}, ${iy})`],
          hint:'Which single point lies on both lines at once — where do the two graphs actually cross?',
          step:`\\text{Both lines pass through }(${ix},${iy})\\text{, the one point common to both}\\Rightarrow(${ix},${iy})`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9];
    })()
  };

  // PC_2_3: Modeling with Linear Functions
  PRECALC_SPIRAL["PC_2_3"] = {
    title: "Modeling with Linear Functions",
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

      function gen1(){
        // Evaluate a linear model f(x)=mx+b at x=a — given as a word problem context
        const m = choose([2,3,4,5,6]);
        const b = choose([5,10,15,20,25,30]);
        const a = choose([1,2,3,4,5,6,8,10]);
        const ans = m * a + b;
        const bS = b > 0 ? `+${b}` : `${b}`;
        return {
          latex: `f(x)=${m}x${bS}.\\quad f(${a})=`,
          answer: [String(ans)],
          hint: 'What does a linear model output for a specific value of x?',
          step: `f(${a})=${m}(${a})${addT(b,'')}=${m*a}+${b}=${ans}`
        };
      }

      function gen2(){
        // Identify rate of change (slope) from a model description
        const m = choose([2,3,4,5,6,8,10]);
        const b = choose([5,10,15,20,25,50,100]);
        const bS = b > 0 ? `+${b}` : `${b}`;
        return {
          latex: `C(x)=${m}x${bS}.\\quad\\text{Rate of change}=`,
          answer: [String(m)],
          hint: 'In a linear model, which coefficient describes how the output changes per unit of input?',
          step: `\\text{In }C(x)=mx+b,\\text{ the rate of change is the slope }m=${m}`
        };
      }

      function gen3(){
        // Identify fixed cost / initial value (y-intercept) from a model
        const m = choose([2,3,4,5,6,8,10]);
        const b = choose([5,10,15,20,25,50,100]);
        const bS = b > 0 ? `+${b}` : `${b}`;
        return {
          latex: `C(x)=${m}x${bS}.\\quad\\text{Fixed cost (initial value)}=`,
          answer: [String(b)],
          hint: 'In a linear model C(x) = mx + b, what does b represent when the input is zero?',
          step: `\\text{At }x=0:\\;C(0)=${b}.\\text{ The fixed cost is }b=${b}`
        };
      }

      function gen4(){
        // Find x such that f(x) = target (integer)
        const m = choose([2,3,4,5]);
        const b = choose([0,5,10,15,20]);
        const k = choose([1,2,3,4,5,6,8,10]); // the answer x=k
        const target = m * k + b;
        const bS = b > 0 ? `+${b}` : (b === 0 ? '' : `${b}`);
        return {
          latex: `C(x)=${m}x${bS}.\\quad\\text{Find }x\\text{ so that }C(x)=${target}.`,
          answer: [String(k)],
          hint: 'If a linear model gives a specific output, what input x produces that value?',
          step: `${m}x${bS}=${target},\\quad ${m}x=${target-b},\\quad x=${k}`
        };
      }

      function gen5(){
        // Intersection of two linear models (break-even) — integer x answer
        // Pick x* (intersection), y*, and slopes m1 > m2, compute intercepts
        const xStar = choose([2,3,4,5,6,8,10]);
        const yStar = choose([10,15,20,25,30,40,50]);
        const m1 = choose([4,5,6,8]);
        const m2 = choose([1,2,3]);
        if (m1 === m2) m2 = 1; // avoid parallel
        const b1 = yStar - m1 * xStar;
        const b2 = yStar - m2 * xStar;
        const b1S = b1 >= 0 ? `+${b1}` : `${b1}`;
        const b2S = b2 >= 0 ? `+${b2}` : `${b2}`;
        return {
          latex: `C_1(x)=${m1}x${b1S},\\quad C_2(x)=${m2}x${b2S}.\\quad\\text{Find }x\\text{ where }C_1=C_2.`,
          answer: [String(xStar)],
          hint: 'What does the intersection point of two linear models represent?',
          step: `${m1}x${b1S}=${m2}x${b2S},\\quad ${m1-m2}x=${b2-b1},\\quad x=${xStar}`
        };
      }

      function gen6(){
        // Rate of change (slope) from two data points
        const m = choose([2,3,4,5,6]);
        const x1 = choose([0,1,2,3]);
        const dx = choose([1,2,3,4,5]);
        const x2 = x1 + dx;
        const y1 = choose([5,10,15,20,25]);
        const y2 = y1 + m * dx;
        return {
          latex: `\\text{Points: }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).\\quad\\text{Rate of change}=`,
          answer: [String(m)],
          hint: 'How is the rate of change of a linear model computed from two data points?',
          step: `m=\\dfrac{${y2}-${y1}}{${x2}-${x1}}=\\dfrac{${y2-y1}}{${dx}}=${m}`
        };
      }

      function gen7(){
        // Build model from two points, then predict at a new x (integer)
        const m = choose([2,3,4,5]);
        const b = choose([0,5,10,15,20]);
        const x1 = 0, y1 = b;
        const x2 = choose([2,4,5,10]);
        const y2 = m * x2 + b;
        const xNew = choose([3,6,8,12,15].filter(v => v !== x2));
        const ans = m * xNew + b;
        const bS = b > 0 ? `+${b}` : (b === 0 ? '' : `${b}`);
        return {
          latex: `\\text{Linear model through }(${x1},\\,${y1})\\text{ and }(${x2},\\,${y2}).\\quad f(${xNew})=`,
          answer: [String(ans)],
          hint: 'Once you identify the slope and initial value of a linear model, what does it predict?',
          step: `m=${m},\\;b=${b}.\\;f(x)=${m}x${bS}.\\;f(${xNew})=${m}(${xNew})${b>0?addT(b,''):''}=${ans}`
        };
      }

      function gen8(){
        // Break-even: Revenue R(x)=p*x vs Cost C(x)=m*x+b → find x where R=C (integer)
        const xStar = choose([5,10,15,20,25]);
        let p = choose([8,10,12,15,20]);      // price per unit (revenue slope)
        let m = choose([2,3,4,5]);            // variable cost per unit
        if (p <= m) { p = m + 2; }            // ensure p > m
        const b = (p - m) * xStar;           // fixed cost so that R(x*)=C(x*)
        return {
          latex: `R(x)=${p}x,\\quad C(x)=${m}x+${b}.\\quad\\text{Break-even quantity }x=`,
          answer: [String(xStar)],
          hint: 'When does a revenue model equal the cost model?',
          step: `${p}x=${m}x+${b},\\quad ${p-m}x=${b},\\quad x=${xStar}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_2_4: Linear Models from Data
  PRECALC_SPIRAL["PC_2_4"] = {
    title: "Linear Models from Data",
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

      function gen1(){
        // Positive or negative correlation from r-value
        const rVals = [-0.95,-0.88,-0.75,-0.62,-0.51,0.53,0.67,0.80,0.91,0.97];
        const r = choose(rVals);
        const rStr = r.toFixed(2);
        const ans = r > 0 ? 'positive' : 'negative';
        return {
          latex: `r = ${rStr}.\\quad\\text{Is the correlation positive or negative?}`,
          answer: [ans],
          hint: 'What does the sign of the correlation coefficient r tell you about the data trend?',
          step: `r=${rStr}${r>0?'>0':' < 0'},\\text{ so correlation is }\\textbf{${ans}}`
        };
      }

      function gen2(){
        // Strong or weak from |r| — use clear cases (no moderate zone)
        const strongVals = [0.82, 0.88, 0.91, 0.95, 0.97, -0.80, -0.87, -0.93, -0.96];
        const weakVals   = [0.08, 0.12, 0.19, 0.24, 0.27, -0.10, -0.15, -0.22, -0.28];
        const isStrong = choose([true, false]);
        const r = isStrong ? choose(strongVals) : choose(weakVals);
        const rStr = r.toFixed(2);
        const ans = isStrong ? 'strong' : 'weak';
        return {
          latex: `r = ${rStr}.\\quad\\text{Is the linear association strong or weak?}`,
          answer: [ans],
          hint: 'When the absolute value of r is close to 1, how strong is the linear association?',
          step: `|r|=${Math.abs(r).toFixed(2)}${isStrong ? '\\approx 1\\Rightarrow\\textbf{strong}' : '\\approx 0\\Rightarrow\\textbf{weak}'}`
        };
      }

      function gen3(){
        // Which of two r-values indicates stronger correlation?
        // Pick two r-values with clearly different |r|
        const pairs = [
          [0.3, 0.85], [0.15, 0.72], [0.4, 0.92], [0.25, 0.80],
          [-0.9, -0.3], [-0.78, -0.2], [0.6, -0.95], [0.12, -0.88]
        ];
        const [r1, r2] = choose(pairs);
        const stronger = Math.abs(r1) > Math.abs(r2) ? r1 : r2;
        const r1Str = r1.toFixed(2), r2Str = r2.toFixed(2);
        const strongerStr = stronger.toFixed(2);
        return {
          latex: `r_1=${r1Str}\\text{ and }r_2=${r2Str}.\\text{ Which indicates a stronger correlation?}`,
          answer: [strongerStr, String(stronger)],
          hint: 'Between two r-values, which magnitude is closest to 1?',
          step: `|r_1|=${Math.abs(r1).toFixed(2)},\\;|r_2|=${Math.abs(r2).toFixed(2)}.\\;\\text{Stronger: }r=${strongerStr}`
        };
      }

      function gen4(){
        // Read slope from regression equation y = ax + b (slope is decimal, 1 dp)
        const slopes = [1.2, 1.5, 1.8, 2.3, 2.5, 3.1, -0.8, -1.4, -2.1, -3.5, 0.6, 4.2];
        const a = choose(slopes);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5,6,8,10]);
        const aStr = a.toFixed(1);
        const bS  = b >= 0 ? `+${b}` : `${b}`;
        return {
          latex: `\\hat{y}=${aStr}x${bS}.\\quad\\text{Slope}=`,
          answer: [aStr, String(a)],
          hint: 'In a regression equation written as y-hat = ax + b, which number is the slope?',
          step: `\\text{In }\\hat{y}=ax+b,\\text{ slope }a=${aStr}`
        };
      }

      function gen5(){
        // Read y-intercept from regression equation (integer b for clarity)
        const slopes = [1.2, 1.5, 2.0, 2.5, 3.0, -0.5, -1.5, -2.0, 0.8];
        const a = choose(slopes);
        const b = choose([-8,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,8,10,12]);
        const aStr = a.toFixed(1);
        const bS  = b >= 0 ? `+${b}` : `${b}`;
        return {
          latex: `\\hat{y}=${aStr}x${bS}.\\quad\\text{y-intercept}=`,
          answer: [String(b), `(0,${b})`, `(0, ${b})`],
          hint: 'In a regression equation written as y-hat = ax + b, which number is the y-intercept?',
          step: `\\text{In }\\hat{y}=ax+b,\\text{ y-intercept }b=${b}`
        };
      }

      function gen6(){
        // Predict from regression — use integer slope and intercept so answer is integer
        const a = choose([2,3,4,5,6,-1,-2,-3]);
        const b = choose([0,2,4,5,6,8,10,12,15,20]);
        const x = choose([1,2,3,4,5,6,8,10]);
        const yHat = a * x + b;
        const bS = b > 0 ? `+${b}` : (b === 0 ? '' : `${b}`);
        return {
          latex: `\\hat{y}=${a}x${bS}.\\quad\\text{Predicted }\\hat{y}\\text{ when }x=${x}:`,
          answer: [String(yHat)],
          hint: 'What does the regression equation give as predicted output for a specific x-value?',
          step: `\\hat{y}=${a}(${x})${b !== 0 ? addT(b,'') : ''}=${yHat}`
        };
      }

      function gen7(){
        // Negative slope in regression → direction of trend
        const negSlopes = [-0.8, -1.2, -1.5, -2.0, -2.5, -3.1, -0.6, -4.0];
        const a = choose(negSlopes);
        const b = choose([5,10,15,20,25,30,50,100]);
        const aStr = a.toFixed(1);
        return {
          latex: `\\hat{y}=${aStr}x+${b}.\\quad\\text{Direction of correlation: positive or negative?}`,
          answer: ['negative'],
          hint: 'If the regression slope is negative, what direction does the data trend show?',
          step: `\\text{Slope }${aStr}<0\\Rightarrow\\text{negative correlation (y decreases as x increases)}`
        };
      }

      function gen8(){
        // Strong or weak — given r near 0 or near ±1 (different pool from gen2)
        const strongVals = [0.85, 0.90, 0.93, 0.98, -0.84, -0.90, -0.94, -0.99];
        const weakVals   = [0.05, 0.09, 0.14, 0.20, -0.07, -0.11, -0.18, -0.23];
        const isStrong = choose([true, false]);
        const r = isStrong ? choose(strongVals) : choose(weakVals);
        const rStr = r.toFixed(2);
        const ans = isStrong ? 'strong' : 'weak';
        return {
          latex: `r = ${rStr}.\\quad\\text{Is this a strong or weak linear association?}`,
          answer: [ans],
          hint: 'What does an r-value near zero indicate about the linear relationship in the data?',
          step: `|r|=${Math.abs(r).toFixed(2)}${isStrong ? '\\text{ (near 1)}\\Rightarrow\\textbf{strong}' : '\\text{ (near 0)}\\Rightarrow\\textbf{weak}'}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_1: Complex Numbers
  PRECALC_SPIRAL["PC_3_1"] = {
    title: "Complex Numbers",
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

      // Helper: format a complex number as a string  e.g. fmtC(3,-2) -> "3-2i"
      function fmtC(re, im) {
        if (im === 0) return String(re);
        const iStr = Math.abs(im) === 1 ? 'i' : `${Math.abs(im)}i`;
        if (re === 0) return im < 0 ? `-${iStr}` : iStr;
        return im < 0 ? `${re}-${iStr}` : `${re}+${iStr}`;
      }

      function gen1(){
        // Power of i — answer cycles mod 4
        const n = choose([3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,25,30,33]);
        const cycle = ['1','i','-1','-i'];   // index = n % 4, but i^0=1
        const r = n % 4;                      // 0→1, 1→i, 2→-1, 3→-i
        const ans = cycle[r];
        return {
          latex: `i^{${n}} = `,
          answer: [ans],
          hint: 'What is the period of the repeating cycle of powers of i?',
          step: `i^{${n}}:\\;${n}\\div 4\\text{ has remainder }${r},\\text{ so }i^{${n}}=i^{${r===0?4:r}}=${ans}`
        };
      }

      function gen2(){
        // Add complex numbers
        const a=choose([-4,-3,-2,-1,1,2,3,4]), b=choose([-4,-3,-2,-1,1,2,3,4]);
        const c=choose([-4,-3,-2,-1,1,2,3,4]), d=choose([-4,-3,-2,-1,1,2,3,4]);
        const re=a+c, im=b+d;
        return {
          latex: `(${fmtC(a,b)})+(${fmtC(c,d)})=`,
          answer: [fmtC(re,im)],
          hint: 'For complex addition, which parts of two complex numbers combine with each other?',
          step: `(${a}+${c})+(${b}+${d})i=${fmtC(re,im)}`
        };
      }

      function gen3(){
        // Subtract complex numbers
        const a=choose([-4,-3,-2,-1,1,2,3,4]), b=choose([-4,-3,-2,-1,1,2,3,4]);
        const c=choose([-4,-3,-2,-1,1,2,3,4]), d=choose([-4,-3,-2,-1,1,2,3,4]);
        const re=a-c, im=b-d;
        return {
          latex: `(${fmtC(a,b)})-(${fmtC(c,d)})=`,
          answer: [fmtC(re,im)],
          hint: 'In complex subtraction, how does a minus sign distribute across real and imaginary parts?',
          step: `(${a}-${c})+(${b}-${d})i=${fmtC(re,im)}`
        };
      }

      function gen4(){
        // Multiply (a+bi)(c+di)
        const a=choose([-3,-2,-1,1,2,3]), b=choose([-3,-2,-1,1,2,3]);
        const c=choose([-3,-2,-1,1,2,3]), d=choose([-3,-2,-1,1,2,3]);
        const re=a*c - b*d, im=a*d + b*c;
        return {
          latex: `(${fmtC(a,b)})(${fmtC(c,d)})=`,
          answer: [fmtC(re,im)],
          hint: 'When multiplying complex numbers, what does i-squared equal that simplifies the result?',
          step: `\\text{FOIL: }(${a*c})+(${a*d}+${b*c})i+${b*d}i^2=(${a*c}-${b*d})+(${a*d+b*c})i=${fmtC(re,im)}`
        };
      }

      function gen5(){
        // Conjugate
        const a=choose([-4,-3,-2,-1,0,1,2,3,4]), b=choose([-4,-3,-2,-1,1,2,3,4]);
        return {
          latex: `\\text{Conjugate of }${fmtC(a,b)}=`,
          answer: [fmtC(a,-b)],
          hint: 'What does the conjugate of a complex number change compared to the original?',
          step: `\\overline{${fmtC(a,b)}}=${fmtC(a,-b)}`
        };
      }

      function gen6(){
        // (a+bi)(a-bi) = a^2 + b^2  (real result)
        const a=choose([1,2,3,4,5]), b=choose([1,2,3,4,5]);
        const ans = a*a + b*b;
        return {
          latex: `(${fmtC(a,b)})(${fmtC(a,-b)})=`,
          answer: [String(ans)],
          hint: 'What real number does the product of a complex number and its conjugate always give?',
          step: `a^2+b^2=${a}^2+${b}^2=${ans}`
        };
      }

      function gen7(){
        // Divide: pick clean quotient q, divisor d, compute dividend=q*d
        const quotients=[[2,1],[1,2],[3,1],[1,3],[2,3],[3,2],[2,-1],[1,-2],[3,-1]];
        const divisors =[[1,1],[1,-1],[2,1],[2,-1],[1,2],[1,-2]];
        const [qa,qb]=choose(quotients);
        const [dc,dd]=choose(divisors);
        const na=qa*dc - qb*dd,  nb=qa*dd + qb*dc;
        const d2=dc*dc + dd*dd;
        return {
          latex: `\\dfrac{${fmtC(na,nb)}}{${fmtC(dc,dd)}}=`,
          answer: [fmtC(qa,qb)],
          hint: 'Which property of the conjugate clears the imaginary part from a denominator?',
          step: `\\dfrac{${fmtC(na,nb)}}{${fmtC(dc,dd)}}\\cdot\\dfrac{${fmtC(dc,-dd)}}{${fmtC(dc,-dd)}}=\\dfrac{\\ldots}{${d2}}=${fmtC(qa,qb)}`
        };
      }

      function gen8(){
        // Solve x^2 + k = 0 where k is a perfect square → ±sqrt(k)i
        const sqrts=[1,2,3,4,5];
        const n=choose(sqrts);   // sqrt(k)
        const k=n*n;
        const posAns = n===1 ? 'i' : `${n}i`;
        const negAns = n===1 ? '-i' : `-${n}i`;
        return {
          latex: `\\text{Solve }x^2+${k}=0.\\text{ Enter one solution.}`,
          answer: [posAns, negAns],
          hint: 'When the discriminant is negative, what type of numbers are the solutions?',
          step: `x^2=-${k},\\;x=\\pm\\sqrt{-${k}}=\\pm${posAns}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_2a: Quadratic Functions — Vertex & Factored Forms
  PRECALC_SPIRAL["PC_3_2a"] = {
    title: "Quadratic Functions \u2014 Vertex & Factored Forms",
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

      function gen1(){
        // Read vertex (h, k) from vertex form a(x-h)^2 + k
        const a  = choose([-3,-2,-1,1,2,3]);
        const h  = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const k  = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const hS = h >= 0 ? `-${h}` : `+${-h}`;   // sign inside (x-h)
        return {
          latex: `f(x)=${fc(a)}(x${hS})^2${k!==0?addT(k,''):''},\\quad\\text{vertex}=`,
          answer: [`(${h},${k})`, `(${h}, ${k})`],
          hint: 'In vertex form, what ordered pair names the highest or lowest point of the parabola?',
          step: `\\text{Vertex form }a(x-h)^2+k:\\;h=${h},\\;k=${k}.\\;\\text{Vertex}=(${h},${k})`
        };
      }

      function gen2(){
        // Zeros from factored form f(x) = a(x-r1)(x-r2)
        const a  = choose([-2,-1,1,2]);
        const r1 = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const r2vals = [-5,-4,-3,-2,-1,0,1,2,3,4,5].filter(v => v !== r1);
        const r2 = choose(r2vals);
        const r1S = r1 >= 0 ? `-${r1}` : `+${-r1}`;
        const r2S = r2 >= 0 ? `-${r2}` : `+${-r2}`;
        const aS  = fc(a);
        // Sort zeros for display
        const z1 = Math.min(r1,r2), z2 = Math.max(r1,r2);
        return {
          latex: `f(x)=${aS}(x${r1S})(x${r2S}),\\quad\\text{zeros}=`,
          answer: [`${z1},${z2}`, `${z2},${z1}`, `${z1}, ${z2}`, `${z2}, ${z1}`],
          hint: 'In factored form, what x-values make each linear factor equal to zero?',
          step: `x${r1S}=0\\Rightarrow x=${r1};\\quad x${r2S}=0\\Rightarrow x=${r2}`
        };
      }

      function gen3(){
        // y-intercept from standard form ax^2+bx+c → (0, c)
        const a = choose([-3,-2,-1,1,2,3]);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const c = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `f(x)=${fc(a)}x^2${bS}x${cS},\\quad\\text{y-intercept}=`,
          answer: [`(0,${c})`, `(0, ${c})`],
          hint: 'What do all x-terms contribute to a polynomial when x equals zero?',
          step: `f(0)=${c}.\\;\\text{y-intercept}=(0,${c})`
        };
      }

      function gen4(){
        // Does parabola open up or down?
        const a = choose([-4,-3,-2,-1,1,2,3,4]);
        const b = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const c = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        const ans = a > 0 ? 'up' : 'down';
        return {
          latex: `f(x)=${fc(a)}x^2${bS}x${cS}.\\quad\\text{Parabola opens: up or down?}`,
          answer: [ans],
          hint: 'What does the sign of the leading coefficient reveal about the orientation of the parabola?',
          step: `a=${a}${a>0?'>0\\Rightarrow\\text{opens up}':'<0\\Rightarrow\\text{opens down}'}`
        };
      }

      function gen5(){
        // Vertex x-coordinate from standard form: x = -b/(2a), integer answer
        // Guarantee integer: pick h and a, then choose b = -2*a*h
        const a = choose([-2,-1,1,2]);
        const h = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const b = -2 * a * h;
        const c = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `f(x)=${fc(a)}x^2${bS}x${cS}.\\quad\\text{x-coordinate of vertex}=`,
          answer: [String(h)],
          hint: 'What do the coefficients a and b together determine about the horizontal position of the vertex?',
          step: `x=-\\dfrac{b}{2a}=-\\dfrac{${b}}{2(${a})}=${h}`
        };
      }

      function gen6(){
        // Full vertex (h, k) from standard form — ordered pair answer
        // Same setup as gen5, then k = f(h)
        const a = choose([-2,-1,1,2]);
        const h = choose([-3,-2,-1,0,1,2,3]);
        const b = -2 * a * h;
        const c = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const k = a * h * h + b * h + c;
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `f(x)=${fc(a)}x^2${bS}x${cS}.\\quad\\text{vertex}=`,
          answer: [`(${h},${k})`, `(${h}, ${k})`],
          hint: 'How are the x-coordinate and the minimum or maximum value of the function related to the vertex?',
          step: `h=-\\dfrac{b}{2a}=${h};\\quad k=f(${h})=${a}(${h})^2${bS}(${h})${cS}=${k}.\\;\\text{Vertex}=(${h},${k})`
        };
      }

      function gen7(){
        // Zeros from vertex form: a(x-h)^2 - n^2 = 0 → x = h ± n (integers)
        const a = choose([-2,-1,1,2]);
        const h = choose([-3,-2,-1,0,1,2,3]);
        const n = choose([1,2,3,4]);
        const k = -a * n * n;   // ensures (x-h)^2 = n^2 exactly, regardless of |a|, so zeros are always h±n
        const hS = h >= 0 ? `-${h}` : `+${-h}`;
        const z1 = h - n, z2 = h + n;
        const kS = k > 0 ? `+${k}` : `${k}`;
        return {
          latex: `f(x)=${fc(a)}(x${hS})^2${kS},\\quad\\text{zeros}=`,
          answer: [`${z1},${z2}`, `${z2},${z1}`, `${z1}, ${z2}`, `${z2}, ${z1}`],
          hint: 'What two x-values are symmetric about the vertex of a parabola with real zeros?',
          step: `${fc(a)}(x-${h})^2=${-k},\\;(x-${h})^2=${-k/a},\\;x-${h}=\\pm${n},\\;x=${z1}\\text{ or }x=${z2}`
        };
      }

      function gen8(){
        // y-intercept from factored form: evaluate at x=0 → a*(-r1)*(-r2) = a*r1*r2
        const a  = choose([-2,-1,1,2]);
        const r1 = choose([-4,-3,-2,-1,1,2,3,4]);
        const r2vals = [-4,-3,-2,-1,1,2,3,4].filter(v => v !== r1);
        const r2 = choose(r2vals);
        const yint = a * (-r1) * (-r2);   // f(0) = a(0-r1)(0-r2)
        const r1S = r1 >= 0 ? `-${r1}` : `+${-r1}`;
        const r2S = r2 >= 0 ? `-${r2}` : `+${-r2}`;
        return {
          latex: `f(x)=${fc(a)}(x${r1S})(x${r2S}),\\quad\\text{y-intercept}=`,
          answer: [`(0,${yint})`, `(0, ${yint})`],
          hint: 'What does each factor in factored form simplify to when x equals zero?',
          step: `f(0)=${fc(a)}(0${r1S})(0${r2S})=${a}\\cdot(${-r1})\\cdot(${-r2})=${yint}.\\;\\text{y-intercept}=(0,${yint})`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_2b: Quadratics — Completing the Square
  PRECALC_SPIRAL["PC_3_2b"] = {
    title: "Quadratics \u2014 Completing the Square",
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

      function fmtC(re, im) {
        if (im === 0) return String(re);
        const iStr = Math.abs(im) === 1 ? 'i' : `${Math.abs(im)}i`;
        if (re === 0) return im < 0 ? `-${iStr}` : iStr;
        return im < 0 ? `${re}-${iStr}` : `${re}+${iStr}`;
      }

      function gen1(){
        // Complete the square — find h (x-coord of vertex); b must be even for integer h
        const b = choose([-8,-6,-4,-2,2,4,6,8]);
        const c = choose([-8,-6,-4,-2,-1,0,1,2,4,6,8]);
        const h = -b / 2;
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `f(x)=x^2${bS}x${cS}.\\quad\\text{Vertex x-coord }h=`,
          answer: [String(h)],
          hint: 'In completing the square, what value of x makes the squared binomial equal to zero?',
          step: `x^2${bS}x${cS}=\\left(x+\\tfrac{${b}}{2}\\right)^2+\\ldots,\\;h=${h}`
        };
      }

      function gen2(){
        // Complete the square — find k (min/max value); b even for integer k
        const b = choose([-8,-6,-4,-2,2,4,6,8]);
        const c = choose([-8,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,8]);
        const h = -b / 2;
        const k = c - (b / 2) * (b / 2);
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `f(x)=x^2${bS}x${cS}.\\quad\\text{Minimum/maximum value }k=`,
          answer: [String(k)],
          hint: 'When a quadratic is written in vertex form, what does k represent about the output?',
          step: `k=c-\\left(\\tfrac{b}{2}\\right)^2=${c}-\\left(\\tfrac{${b}}{2}\\right)^2=${c}-${(b/2)*(b/2)}=${k}`
        };
      }

      function gen3(){
        // Quadratic formula — two integer roots; ask for larger root
        // Pick r1 < r2 (integers), build x^2 - (r1+r2)x + r1*r2 = 0
        const r1 = choose([-5,-4,-3,-2,-1,0,1,2,3]);
        const r2vals = [-4,-3,-2,-1,0,1,2,3,4,5].filter(v => v > r1);
        const r2 = choose(r2vals);
        const bcoef = -(r1 + r2);
        const ccoef = r1 * r2;
        const bS = bcoef !== 0 ? (bcoef > 0 ? `+${bcoef}` : `${bcoef}`) : '';
        const cS = ccoef !== 0 ? (ccoef > 0 ? `+${ccoef}` : `${ccoef}`) : '';
        return {
          latex: `x^2${bS}x${cS}=0.\\quad\\text{Larger zero}=`,
          answer: [String(r2)],
          hint: 'Among the two real zeros of a quadratic, which value lies furthest to the right?',
          step: `x=\\dfrac{${-bcoef}\\pm\\sqrt{${bcoef*bcoef}-4(${ccoef})}}{2}=\\dfrac{${-bcoef}\\pm${r2-r1}}{2}:\\;x=${r1}\\text{ or }x=${r2}`
        };
      }

      function gen4(){
        // Quadratic formula — complex roots; ask for root with positive imaginary part
        // x^2 - 2p*x + (p^2 + q^2) = 0 → roots p ± qi
        const p = choose([-2,-1,0,1,2]);
        const q = choose([1,2,3]);
        const bcoef = -2 * p;
        const ccoef = p * p + q * q;
        const bS = bcoef !== 0 ? (bcoef > 0 ? `+${bcoef}` : `${bcoef}`) : '';
        return {
          latex: `x^2${bS}x+${ccoef}=0.\\quad\\text{Root with positive imaginary part}=`,
          answer: [fmtC(p, q)],
          hint: 'When the discriminant is negative, what form do the two conjugate solutions take?',
          step: `\\Delta=${bcoef*bcoef}-4(${ccoef})=${-4*q*q}<0.\\;x=\\dfrac{${-bcoef}\\pm${2*q}i}{2}=${fmtC(p,q)}\\text{ or }${fmtC(p,-q)}`
        };
      }

      function gen5(){
        // Discriminant sign → count real roots: "0", "1", "2"
        const cases = [
          // Two real roots (Δ > 0)
          {a:1,b:3,c:-10,disc:49,count:'2'},
          {a:1,b:-5,c:6,disc:1,count:'2'},
          {a:1,b:1,c:-6,disc:25,count:'2'},
          {a:2,b:-3,c:-2,disc:25,count:'2'},
          // One real root (Δ = 0)
          {a:1,b:-4,c:4,disc:0,count:'1'},
          {a:1,b:6,c:9,disc:0,count:'1'},
          {a:4,b:-4,c:1,disc:0,count:'1'},
          // Zero real roots (Δ < 0)
          {a:1,b:2,c:5,disc:-16,count:'0'},
          {a:1,b:0,c:4,disc:-16,count:'0'},
          {a:2,b:1,c:3,disc:-23,count:'0'},
        ];
        const {a,b,c,disc,count} = choose(cases);
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        const aS = a !== 1 ? `${a}` : '';
        return {
          latex: `${aS}x^2${bS}x${cS}=0.\\quad\\text{Number of real solutions}=`,
          answer: [count],
          hint: 'What does the sign of the discriminant tell you about the number of real solutions?',
          step: `\\Delta=b^2-4ac=${b*b}-4(${a})(${c})=${disc}${disc>0?' > 0\\Rightarrow 2\\text{ real roots}':disc===0?' = 0\\Rightarrow 1\\text{ repeated root}':' < 0\\Rightarrow 0\\text{ real roots}'}`
        };
      }

      function gen6(){
        // Factor to find zeros — pick two integer roots, build standard form (a=1), ask smaller zero
        const r1 = choose([-5,-4,-3,-2,-1,0,1,2,3]);
        const r2vals = [-4,-3,-2,-1,0,1,2,3,4,5].filter(v => v !== r1);
        const r2 = choose(r2vals);
        const bcoef = -(r1 + r2);
        const ccoef = r1 * r2;
        const bS = bcoef !== 0 ? (bcoef > 0 ? `+${bcoef}` : `${bcoef}`) : '';
        const cS = ccoef !== 0 ? (ccoef > 0 ? `+${ccoef}` : `${ccoef}`) : '';
        const smaller = Math.min(r1, r2);
        return {
          latex: `x^2${bS}x${cS}=0.\\quad\\text{Smaller zero}=`,
          answer: [String(smaller)],
          hint: 'In a factorable quadratic, what x-values make each linear factor equal to zero?',
          step: `(x-${r1})(x-${r2})=0\\Rightarrow x=${r1}\\text{ or }x=${r2}.\\;\\text{Smaller: }${smaller}`
        };
      }

      function gen7(){
        // Solve ax^2 + bx = 0 → x=0 or x=-b/a (a=1 for integer)
        const b = choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const bS = b > 0 ? `+${b}` : `${b}`;
        return {
          latex: `x^2${bS}x=0.\\quad\\text{Non-zero solution}=`,
          answer: [String(-b)],
          hint: 'What common factor in a quadratic with no constant term reveals both solutions immediately?',
          step: `x(x${bS})=0\\Rightarrow x=0\\text{ or }x=${-b}`
        };
      }

      function gen8(){
        // Solve via vertex form: a(x-h)^2 - n^2 = 0, find smaller zero
        // Works for a=1: (x-h)^2 = n^2, x = h ± n
        const h = choose([-3,-2,-1,0,1,2,3]);
        const n = choose([1,2,3,4]);
        const k = -(n * n);
        const hS = h >= 0 ? `-${h}` : `+${-h}`;
        const kS = k < 0 ? `${k}` : `+${k}`;
        const z1 = h - n, z2 = h + n;
        return {
          latex: `(x${hS})^2${kS}=0.\\quad\\text{Smaller zero}=`,
          answer: [String(z1)],
          hint: 'When a squared binomial equals a positive number, what two values does the binomial itself take?',
          step: `(x-${h})^2=${n*n},\\;x-${h}=\\pm${n},\\;x=${z1}\\text{ or }x=${z2}.\\;\\text{Smaller: }${z1}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_3: Quadratic Applications & Parametric Intro
  PRECALC_SPIRAL["PC_3_3"] = {
    title: "Quadratic Applications & Parametric Intro",
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

      function gen1(){
        // Evaluate x(t) = a*t + b at t = t0 → integer
        const a = choose([-3,-2,-1,1,2,3,4,5]);
        const b = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const t0 = choose([-2,-1,0,1,2,3,4,5]);
        const x = a * t0 + b;
        const bS = b !== 0 ? (b > 0 ? `+${b}` : `${b}`) : '';
        return {
          latex: `x(t)=${a}t${bS}.\\quad x(${t0})=`,
          answer: [String(x)],
          hint: 'What does a parametric component equation output for a specific value of t?',
          step: `x(${t0})=${a}(${t0})${bS}=${x}`
        };
      }

      function gen2(){
        // Evaluate y(t) = c*t + d at t = t0 → integer
        const c = choose([-3,-2,-1,1,2,3,4,5]);
        const d = choose([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
        const t0 = choose([-2,-1,0,1,2,3,4,5]);
        const y = c * t0 + d;
        const dS = d !== 0 ? (d > 0 ? `+${d}` : `${d}`) : '';
        return {
          latex: `y(t)=${c}t${dS}.\\quad y(${t0})=`,
          answer: [String(y)],
          hint: 'What output does a parametric component equation give for a specific value of t?',
          step: `y(${t0})=${c}(${t0})${dS}=${y}`
        };
      }

      function gen3(){
        // Eliminate parameter from linear: x=a*t, y=b*t → y=(b/a)x → slope b/a (integer)
        const a = choose([1,2,3]);
        const b = choose([2,3,4,6]).filter(v => v % a === 0 && v !== a);
        const slope = (b.length ? b[rInt(b.length)] : 2*a) / a;
        // safe choice: just pick slope directly
        const sl = choose([2,3,4,5]);
        const ax = choose([1,2,3]);
        const ay = sl * ax;
        return {
          latex: `x=${ax}t,\\quad y=${ay}t.\\quad\\text{Slope of }y\\text{ vs }x=`,
          answer: [String(sl)],
          hint: 'When you eliminate the parameter t from two linear parametrics, what type of equation relates y and x?',
          step: `t=\\dfrac{x}{${ax}},\\;y=${ay}\\cdot\\dfrac{x}{${ax}}=${sl}x.\\;\\text{Slope}=${sl}`
        };
      }

      function gen4(){
        // Given y(t)=t^2+c and x(t)=t-1, find y when x=x0 → integer
        // x=t-1 → t=x+1; y=(x+1)^2+c
        const c = choose([-4,-3,-2,-1,0,1,2,3,4]);
        const x0 = choose([-2,-1,0,1,2,3]);
        const t0 = x0 + 1;
        const y0 = t0 * t0 + c;
        const cS = c !== 0 ? (c > 0 ? `+${c}` : `${c}`) : '';
        return {
          latex: `x=t-1,\\quad y=t^2${cS}.\\quad\\text{Find }y\\text{ when }x=${x0}.`,
          answer: [String(y0)],
          hint: 'In parametric equations, what role does t play as a bridge between x and y?',
          step: `x=${x0}\\Rightarrow t=${t0}.\\;y=(${t0})^2${cS}=${y0}`
        };
      }

      function gen5(){
        // Ball height at time t: y(t) = -16t^2 + vy*t + h0  (integer result)
        // Pick vy divisible by 8 and t0 small integer
        const vy = choose([32,48,64,80]);
        const h0 = choose([0,10,16,20,48]);
        const t0 = choose([1,2,3]);
        const y = -16 * t0 * t0 + vy * t0 + h0;
        const h0S = h0 > 0 ? `+${h0}` : '';
        return {
          latex: `y(t)=-16t^2+${vy}t${h0S}.\\quad\\text{Height at }t=${t0}\\text{ sec}=`,
          answer: [String(y)],
          hint: 'What does the vertical position function give when you know the time elapsed?',
          step: `y(${t0})=-16(${t0})^2+${vy}(${t0})${h0S}=${-16*t0*t0}+${vy*t0}${h0>0?'+'+h0:''}=${y}`
        };
      }

      function gen6(){
        // When does ball hit ground (y=0)? — design for integer t via factoring
        // Use: -16t^2 + vy*t + h0 = 0 → t^2 - (vy/16)t - h0/16 = 0
        // Pick scenarios with nice factoring:
        const scenarios = [
          {vy:32,h0:0, t_land:2,   tex:'-16t^2+32t'},
          {vy:48,h0:0, t_land:3,   tex:'-16t^2+48t'},
          {vy:64,h0:0, t_land:4,   tex:'-16t^2+64t'},
          {vy:48,h0:64,t_land:4,   tex:'-16t^2+48t+64'},
          {vy:64,h0:80,t_land:5,   tex:'-16t^2+64t+80'},
          {vy:48,h0:128,t_land:5.5,tex:null},  // skip non-integer
          {vy:80,h0:0, t_land:5,   tex:'-16t^2+80t'},
        ].filter(s => Number.isInteger(s.t_land));
        const s = choose(scenarios);
        return {
          latex: `y(t)=${s.tex}=0.\\quad\\text{Landing time }t=`,
          answer: [String(s.t_land)],
          hint: 'What does y equal when the ball has returned to the ground?',
          step: `${s.tex}=0,\\;-16t(t-${s.t_land})=0\\text{ (or factor similarly)},\\;t=${s.t_land}\\text{ sec}`
        };
      }

      function gen7(){
        // Max height: y = -16t^2 + vy*t + h0, max at t* = vy/32
        // Integer max height when vy divisible by 8
        const vy = choose([32,48,64,80]);
        const h0 = choose([0,10,16,20,36]);
        const tStar_num = vy, tStar_den = 32;
        const g = gcd(tStar_num, tStar_den);
        const tN = tStar_num / g, tD = tStar_den / g;
        const maxH = Math.round(-16 * (vy/32) * (vy/32) + vy * (vy/32) + h0);
        const h0S = h0 > 0 ? `+${h0}` : '';
        return {
          latex: `y(t)=-16t^2+${vy}t${h0S}.\\quad\\text{Maximum height}=`,
          answer: [String(maxH)],
          hint: 'At what type of point on the vertical position curve does the ball reach its highest point?',
          step: `t^*=\\dfrac{${vy}}{32}=${tD===1?tN:`\\frac{${tN}}{${tD}}`}.\\;y(t^*)=${maxH}`
        };
      }

      function gen8(){
        // Horizontal distance when ball lands: x = vx * t_land
        const vx = choose([2,3,4,5,6,8,10]);
        const vy = choose([32,48,64,80]);
        // h0=0 for simplicity: lands at t = vy/16
        const t_land = vy / 16;
        const x_land = vx * t_land;
        return {
          latex: `x=${vx}t,\\quad y=-16t^2+${vy}t.\\quad\\text{Horizontal distance when }y=0:`,
          answer: [String(x_land)],
          hint: 'Once you know the landing time, what does the horizontal component give you?',
          step: `y=0\\Rightarrow t=${t_land}\\text{ sec}.\\;x=${vx}(${t_land})=${x_land}`
        };
      }

      function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;}
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_4: Polynomial Functions
  PRECALC_SPIRAL["PC_3_4"] = {
    title: "Polynomial Functions",
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

      function gen1(){
        // Degree of a polynomial given in standard or factored form
        const degs = [
          {expr:'3x^4-2x^2+x-7',   deg:4},
          {expr:'-x^5+4x^3-1',     deg:5},
          {expr:'2x^3+x^2-5x+8',   deg:3},
          {expr:'x^6-3x^4+2',      deg:6},
          {expr:'-4x^2+7x-1',      deg:2},
          {expr:'5x^7-x^3+2x',     deg:7},
          {expr:'x^4-x^3+x^2-x+1', deg:4},
          {expr:'-2x^3+6',         deg:3},
        ];
        const {expr,deg} = choose(degs);
        return {
          latex: `f(x)=${expr}.\\quad\\text{Degree}= \\underline{\\quad}`,
          answer: [String(deg)],
          hint: 'What is the degree of a polynomial function?',
          step: `\\text{Highest power of }x\\text{ is }x^{${deg}},\\text{ so degree}=${deg}`
        };
      }

      function gen2(){
        // Leading coefficient of a polynomial
        const polys = [
          {expr:'3x^4-2x^2+1',    lc:3},
          {expr:'-5x^3+x-7',      lc:-5},
          {expr:'2x^5+4x^2-x',    lc:2},
          {expr:'-x^4+3x^2-2',    lc:-1},
          {expr:'7x^2-3x+6',      lc:7},
          {expr:'-3x^6+x^4-2x',   lc:-3},
          {expr:'4x^3-x^2+5x-1',  lc:4},
          {expr:'-2x^5+8x-9',     lc:-2},
        ];
        const {expr,lc} = choose(polys);
        return {
          latex: `f(x)=${expr}.\\quad\\text{Leading coefficient}= \\underline{\\quad}`,
          answer: [String(lc)],
          hint: 'Which coefficient in a polynomial corresponds to the highest-degree term?',
          step: `\\text{Leading term is }${lc}x^n,\\text{ so leading coefficient}=${lc}`
        };
      }

      function gen3(){
        // Multiplicity of a specific zero from factored form
        const cases = [
          {expr:'(x-2)^3(x+1)',        zero:2,   mult:3},
          {expr:'(x+3)^2(x-1)^4',      zero:-3,  mult:2},
          {expr:'5(x-1)^2(x+2)',        zero:1,   mult:2},
          {expr:'(x+4)^3(x-2)^2(x+1)', zero:-4,  mult:3},
          {expr:'-2(x-3)^4(x+1)',       zero:3,   mult:4},
          {expr:'(x+5)(x-2)^3',         zero:-5,  mult:1},
          {expr:'3(x-1)^2(x+3)^2',      zero:-3,  mult:2},
          {expr:'(x-4)^5(x+2)',          zero:4,   mult:5},
        ];
        const {expr,zero,mult} = choose(cases);
        const zeroS = zero >= 0 ? `x=${zero}` : `x=${zero}`;
        return {
          latex: `f(x)=${expr}.\\quad\\text{Multiplicity of zero at }${zeroS}= \\underline{\\quad}`,
          answer: [String(mult)],
          hint: 'In factored form, what does the exponent on a factor tell you about that zero?',
          step: `\\text{Factor }(x${zero>=0?'-':'+'}${Math.abs(zero)})\\text{ appears to the power }${mult},\\text{ so multiplicity}=${mult}`
        };
      }

      function gen4(){
        // How many distinct real zeros from factored form
        const cases = [
          {expr:'(x-1)(x+2)(x-3)',              count:3},
          {expr:'(x+1)^2(x-4)',                  count:2},
          {expr:'(x-2)^3(x+1)^2(x-5)',           count:3},
          {expr:'(x+3)^4(x-1)',                  count:2},
          {expr:'2(x-1)(x-2)(x-3)(x+4)',         count:4},
          {expr:'(x-1)^2(x+2)^2',               count:2},
          {expr:'-3(x+2)(x-3)(x+5)(x-1)',        count:4},
          {expr:'(x-2)^3(x+4)^2(x-1)',           count:3},
        ];
        const {expr,count} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{Number of distinct real zeros}= \\underline{\\quad}`,
          answer: [String(count)],
          hint: 'In factored form, how many different values of r appear as zeros?',
          step: `\\text{Distinct factors: count unique values of }r.\\;\\text{Answer: }${count}`
        };
      }

      function gen5(){
        // End behavior as x→+∞: "up" if a_n > 0, else "down"
        const cases = [
          {lc:3,  deg:4, inf:  'up',   neginf:'up'},
          {lc:-2, deg:4, inf:  'down', neginf:'down'},
          {lc:2,  deg:5, inf:  'up',   neginf:'down'},
          {lc:-1, deg:5, inf:  'down', neginf:'up'},
          {lc:4,  deg:6, inf:  'up',   neginf:'up'},
          {lc:-3, deg:3, inf:  'down', neginf:'up'},
          {lc:1,  deg:7, inf:  'up',   neginf:'down'},
          {lc:-5, deg:2, inf:  'down', neginf:'down'},
        ];
        const {lc,deg,inf,neginf} = choose(cases);
        const lcS = lc < 0 ? `${lc}` : `${lc}`;
        return {
          latex: `f(x)=${lcS}x^{${deg}}+\\cdots\\quad\\text{As }x\\to+\\infty,\\;f(x)\\to`,
          answer: [inf, (inf==='up'?'+inf':'-inf'), (inf==='up'?'+\\infty':'-\\infty')],
          hint: 'For large positive x, which part of the polynomial dominates, and what is its sign?',
          step: `\\text{Leading term }${lcS}x^{${deg}}:\\;${lcS}>0?\\text{ }${lc>0?'yes':'no'}\\text{, }${lc}${lc>0?'>0':'<0'},\\text{ degree }${deg%2===0?'even':'odd'}.\\;f\\to${inf==='up'?'+\\infty':'-\\infty'}`
        };
      }

      function gen6(){
        // End behavior as x→-∞
        const cases = [
          {lc:3,  deg:4, neginf:'up'},
          {lc:-2, deg:4, neginf:'down'},
          {lc:2,  deg:5, neginf:'down'},
          {lc:-1, deg:5, neginf:'up'},
          {lc:4,  deg:6, neginf:'up'},
          {lc:-3, deg:3, neginf:'up'},
          {lc:1,  deg:7, neginf:'down'},
          {lc:-5, deg:2, neginf:'down'},
        ];
        const {lc,deg,neginf} = choose(cases);
        return {
          latex: `f(x)=${lc}x^{${deg}}+\\cdots\\quad\\text{As }x\\to-\\infty,\\;f(x)\\to`,
          answer: [neginf, (neginf==='up'?'+inf':'-inf')],
          hint: 'As x becomes very large and negative, does the parity of the degree affect the sign of the leading term?',
          step: `\\text{Degree }${deg}\\text{ is }${deg%2===0?'even':'odd'},\\text{ leading coeff }${lc}${lc>0?'>0':' < 0'}.\\;f\\to${neginf==='up'?'+\\infty':'-\\infty'}`
        };
      }

      function gen7(){
        // y-intercept from factored form: evaluate at x=0
        const cases = [
          {expr:'(x-1)(x+2)(x-3)', yint: (-1)*(2)*(-3)},
          {expr:'2(x-1)(x+3)',      yint: 2*(-1)*(3)},
          {expr:'-(x+2)(x-2)',      yint: -(2)*(-2)},
          {expr:'(x+1)(x+2)(x+3)', yint: (1)*(2)*(3)},
          {expr:'-3(x-1)(x+1)',    yint: -3*(-1)*(1)},
          {expr:'(x-2)(x+5)',       yint: (-2)*(5)},
          {expr:'2(x-3)(x+3)',      yint: 2*(-3)*(3)},
          {expr:'(x+4)(x-1)(x-2)', yint: (4)*(-1)*(-2)},
        ];
        const {expr,yint} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{y-intercept}= \\underline{\\quad}`,
          answer: [`(0,${yint})`, `(0, ${yint})`],
          hint: 'What does each factor in factored form simplify to when x equals zero?',
          step: `f(0)=${expr.replace(/x/g,'(0)')}=${yint}.\\;\\text{y-intercept: }(0,${yint})`
        };
      }

      function gen8(){
        // Maximum number of turning points for a given degree
        const degs = [2,3,4,5,6,7];
        const deg = choose(degs);
        const tp = deg - 1;
        return {
          latex: `\\text{Degree }${deg}\\text{ polynomial.}\\quad\\text{Maximum turning points}= \\underline{\\quad}`,
          answer: [String(tp)],
          hint: 'How is the maximum number of turning points of a polynomial related to its degree?',
          step: `\\text{Max turning points} = \\text{degree} - 1 = ${deg} - 1 = ${tp}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_5: Graphing Polynomial Functions
  PRECALC_SPIRAL["PC_3_5"] = {
    title: "Graphing Polynomial Functions",
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

      function gen1(){
        // Cross or touch at a zero — odd multiplicity crosses, even touches
        const cases = [
          {expr:'(x-2)^3(x+1)',   zero:2,  mult:3, beh:'crosses'},
          {expr:'(x+3)^2(x-1)',   zero:-3, mult:2, beh:'touches'},
          {expr:'(x-1)^4(x+2)',   zero:1,  mult:4, beh:'touches'},
          {expr:'(x-4)(x+2)^3',   zero:4,  mult:1, beh:'crosses'},
          {expr:'(x+1)^2(x-3)^2', zero:-1, mult:2, beh:'touches'},
          {expr:'(x-2)^5(x+1)',   zero:2,  mult:5, beh:'crosses'},
          {expr:'2(x+3)^3(x-1)',  zero:-3, mult:3, beh:'crosses'},
          {expr:'(x-1)^2(x+4)^4', zero:1,  mult:2, beh:'touches'},
        ];
        const {expr,zero,mult,beh} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{At }x=${zero},\\text{ graph crosses or touches?}`,
          answer: [beh],
          hint: 'What does the parity of a zero\'s multiplicity reveal about the graph\'s behavior there?',
          step: `\\text{Multiplicity of }x=${zero}\\text{ is }${mult}\\text{ (${mult%2===1?'odd':'even'})}\\Rightarrow\\text{graph }${beh}`
        };
      }

      function gen2(){
        // y-intercept from factored form f(x) = a(x-r1)^m1 (x-r2)^m2 ...
        const cases = [
          {expr:'(x-1)^2(x+2)',          yint: (-1)**2*(2)},
          {expr:'2(x-3)(x+1)^2',         yint: 2*(-3)*(1)**2},
          {expr:'-(x+2)^2(x-1)',          yint: -(2**2)*(-1)},
          {expr:'(x-2)^3(x+1)',           yint: (-2)**3*(1)},
          {expr:'3(x-1)(x+3)^2',          yint: 3*(-1)*(3)**2},
          {expr:'-2(x+1)^2(x-2)',         yint: -2*(1)**2*(-2)},
          {expr:'(x+3)(x-1)^2(x+2)',      yint: (3)*(-1)**2*(2)},
          {expr:'(x-4)^2(x+2)^2',         yint: (-4)**2*(2)**2},
        ];
        const {expr,yint} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{y-intercept}=`,
          answer: [`(0,${yint})`, `(0, ${yint})`],
          hint: 'What does each factor simplify to when x equals zero?',
          step: `f(0)=${expr.replace(/x/g,'(0)')}=${yint}.\\;\\text{y-intercept: }(0,${yint})`
        };
      }

      function gen3(){
        // End behavior as x→+∞
        const cases = [
          {lc:2,  deg:3, ans:'up',   label:'odd,pos'},
          {lc:-1, deg:3, ans:'down', label:'odd,neg'},
          {lc:3,  deg:4, ans:'up',   label:'even,pos'},
          {lc:-2, deg:4, ans:'down', label:'even,neg'},
          {lc:1,  deg:5, ans:'up',   label:'odd,pos'},
          {lc:-3, deg:5, ans:'down', label:'odd,neg'},
          {lc:4,  deg:6, ans:'up',   label:'even,pos'},
          {lc:-1, deg:6, ans:'down', label:'even,neg'},
        ];
        const {lc,deg,ans} = choose(cases);
        return {
          latex: `f(x)=${lc}x^{${deg}}+\\cdots\\quad\\text{As }x\\to+\\infty:\\;`,
          answer: [ans, (ans==='up'?'+inf':'-inf')],
          hint: 'For very large positive x, which term of the polynomial controls the output?',
          step: `\\text{Leading term }${lc}x^{${deg}}.\\;${lc}>0?\\text{pos}:\\text{neg},\\;\\text{degree }${deg}.\\;f\\to${ans==='up'?'+\\infty':'-\\infty'}`
        };
      }

      function gen4(){
        // End behavior as x→-∞
        const cases = [
          {lc:2,  deg:3, ans:'down'},
          {lc:-1, deg:3, ans:'up'},
          {lc:3,  deg:4, ans:'up'},
          {lc:-2, deg:4, ans:'down'},
          {lc:1,  deg:5, ans:'down'},
          {lc:-3, deg:5, ans:'up'},
          {lc:4,  deg:6, ans:'up'},
          {lc:-1, deg:6, ans:'down'},
        ];
        const {lc,deg,ans} = choose(cases);
        return {
          latex: `f(x)=${lc}x^{${deg}}+\\cdots\\quad\\text{As }x\\to-\\infty:\\;`,
          answer: [ans, (ans==='up'?'+inf':'-inf')],
          hint: 'For large negative x, does the degree being odd or even change the sign of the leading term?',
          step: `\\text{Leading term }${lc}x^{${deg}}.\\;\\text{Degree }${deg%2===0?'even':'odd'}:\\;f\\to${ans==='up'?'+\\infty':'-\\infty'}`
        };
      }

      function gen5(){
        // Sign of f(x) at a test point between zeros — positive or negative
        // Use degree-2 factored form for simplicity
        const r1 = choose([-4,-3,-2,-1]);
        const r2 = choose([1,2,3,4]);
        const a  = choose([-2,-1,1,2]);
        // test point between r1 and r2
        const test = Math.round((r1 + r2) / 2);
        const val = a * (test - r1) * (test - r2);
        const ans = val > 0 ? 'positive' : 'negative';
        const r1S = r1 >= 0 ? `-${r1}` : `+${-r1}`;
        const r2S = r2 >= 0 ? `-${r2}` : `+${-r2}`;
        return {
          latex: `f(x)=${fc(a)}(x${r1S})(x${r2S}).\\quad\\text{Is }f(${test})\\text{ positive or negative?}`,
          answer: [ans],
          hint: 'What does the sign of each factor at a test point tell you about the function\'s value there?',
          step: `f(${test})=${fc(a)}(${test}${r1S})(${test}${r2S})=${val}${val>0?'>0':' < 0'}\\Rightarrow\\text{${ans}}`
        };
      }

      function gen6(){
        // Minimum possible degree from zeros and multiplicities
        const cases = [
          {desc:'zeros at x=1 (mult 2) and x=-3 (mult 1)', min:3},
          {desc:'zeros at x=0 (mult 3) and x=2 (mult 2)', min:5},
          {desc:'zeros at x=-1 (mult 2) and x=4 (mult 2)', min:4},
          {desc:'zeros at x=1 (mult 4) and x=-2 (mult 1) and x=3 (mult 1)', min:6},
          {desc:'zeros at x=0 (mult 1) and x=-1 (mult 3)', min:4},
          {desc:'zeros at x=2 (mult 2) and x=-2 (mult 2) and x=1 (mult 1)', min:5},
        ];
        const {desc,min} = choose(cases);
        return {
          latex: `\\text{${desc}.}\\quad\\text{Min degree}=`,
          answer: [String(min)],
          hint: 'How do the multiplicities of all known zeros combine to give a lower bound on the degree?',
          step: `\\text{Sum of multiplicities}=${min}\\Rightarrow\\text{min degree}=${min}`
        };
      }

      function gen7(){
        // Number of distinct x-intercepts from factored form
        const cases = [
          {expr:'(x-1)^2(x+3)(x-2)',          n:3},
          {expr:'x^2(x-4)^3',                  n:2},
          {expr:'(x+1)(x-1)(x+2)(x-3)',        n:4},
          {expr:'(x-2)^4(x+1)^2',             n:2},
          {expr:'3(x-1)(x+2)(x-3)(x+4)',       n:4},
          {expr:'(x-5)^3(x+5)^3',             n:2},
          {expr:'(x-1)^2(x+2)^2(x-3)',         n:3},
        ];
        const {expr,n} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{Number of distinct x-intercepts}=`,
          answer: [String(n)],
          hint: 'In factored form, how many different zero-values does the function have?',
          step: `\\text{Distinct factors (by zero value): }${n}`
        };
      }

      function gen8(){
        // Cross or touch — different pool from gen1, focuses on even multiplicity
        const cases = [
          {expr:'-3(x-1)^2(x+2)',    zero:-2, mult:1, beh:'crosses'},
          {expr:'(x+3)^4(x-2)^3',   zero:-3, mult:4, beh:'touches'},
          {expr:'(x-5)^2(x+1)^3',   zero:5,  mult:2, beh:'touches'},
          {expr:'(x-1)^3(x+4)^2',   zero:-4, mult:2, beh:'touches'},
          {expr:'(x+2)^5(x-3)',      zero:-2, mult:5, beh:'crosses'},
          {expr:'4(x-2)^2(x+3)^4',  zero:2,  mult:2, beh:'touches'},
          {expr:'(x-6)(x+1)^4',     zero:6,  mult:1, beh:'crosses'},
        ];
        const {expr,zero,mult,beh} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{At }x=${zero},\\text{ graph crosses or touches?}`,
          answer: [beh],
          hint: 'Does an even or odd multiplicity cause the graph to change sign at that zero?',
          step: `\\text{Multiplicity at }x=${zero}\\text{ is }${mult}\\text{ (${mult%2===1?'odd':'even'})}\\Rightarrow\\text{graph }${beh}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_3_6: Rational Functions
  PRECALC_SPIRAL["PC_3_6"] = {
    title: "Rational Functions",
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

      function gen1(){
        // Domain: one excluded x (linear denominator x - a)
        const a = choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const numCoeffs = [[1,3],[2,-1],[3,2],[-1,4],[1,0],[2,1]];
        const [nc,nd] = choose(numCoeffs);
        const ncS = nc===1?'':String(nc), ndS = nd>=0?(nd===0?'':`+${nd}`):`${nd}`;
        const aS  = a >= 0 ? `-${a}` : `+${-a}`;
        return {
          latex: `f(x)=\\dfrac{${ncS}x${ndS}}{x${aS}}.\\quad\\text{Excluded x-value}=`,
          answer: [String(a)],
          hint: 'What x-value makes the denominator of a rational function equal to zero?',
          step: `\\text{Set }x${aS}=0:\\;x=${a}.\\;\\text{Domain: all reals except }x=${a}`
        };
      }

      function gen2(){
        // Domain: two excluded x-values (quadratic denominator)
        // Use (x-a)(x-b) in denominator, a < b
        const a = choose([-5,-4,-3,-2,-1]);
        const bvals = [1,2,3,4,5].filter(v => v !== -a);
        const b = choose(bvals);
        const aS = a >= 0 ? `-${a}` : `+${-a}`;
        const bS = b >= 0 ? `-${b}` : `+${-b}`;
        const smaller = Math.min(a,b), larger = Math.max(a,b);
        return {
          latex: `f(x)=\\dfrac{x+1}{(x${aS})(x${bS})}.\\quad\\text{Excluded values (smaller,larger)}=`,
          answer: [`${smaller},${larger}`, `${smaller}, ${larger}`],
          hint: 'When a denominator has two linear factors, how many x-values are excluded from the domain?',
          step: `x${aS}=0\\Rightarrow x=${a};\\quad x${bS}=0\\Rightarrow x=${b}.\\;\\text{Excluded: }${smaller},${larger}`
        };
      }

      function gen3(){
        // Vertical asymptote — after confirming no cancellation
        const a = choose([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const aS = a >= 0 ? `-${a}` : `+${-a}`;
        // numerator is a constant or non-canceling linear
        const num = choose([1,2,3,4,5,6]);
        return {
          latex: `f(x)=\\dfrac{${num}}{x${aS}}.\\quad\\text{Vertical asymptote: }x=`,
          answer: [String(a)],
          hint: 'Where does a rational function have a vertical asymptote when the denominator is zero?',
          step: `\\text{Denominator }x${aS}=0\\Rightarrow x=${a}.\\;\\text{No cancellation, so VA at }x=${a}`
        };
      }

      function gen4(){
        // Horizontal asymptote: deg(num) < deg(den) → y = 0
        const denDegs = [
          {num:'3x+1',     den:'x^2-4',       ha:0},
          {num:'2x-5',     den:'x^2+x+1',     ha:0},
          {num:'x^2-1',    den:'x^3+2x',      ha:0},
          {num:'4',        den:'x^2-9',       ha:0},
          {num:'x+3',      den:'x^3-8',       ha:0},
          {num:'2x^2+1',   den:'x^4-1',       ha:0},
        ];
        const {num,den,ha} = choose(denDegs);
        return {
          latex: `f(x)=\\dfrac{${num}}{${den}}.\\quad\\text{Horizontal asymptote: }y=`,
          answer: ['0'],
          hint: 'When the numerator degree is less than the denominator degree, what value does f approach at infinity?',
          step: `\\text{deg(num) < deg(den)}\\Rightarrow y=0`
        };
      }

      function gen5(){
        // Horizontal asymptote: deg(num) = deg(den) → y = ratio of leading coefficients (integer)
        const cases = [
          {num:'2x+3',    den:'x-1',      ha:2},
          {num:'3x^2-1',  den:'x^2+4',    ha:3},
          {num:'-4x+2',   den:'2x+1',     ha:-2},
          {num:'6x^2+x',  den:'2x^2-3',   ha:3},
          {num:'-3x^2+1', den:'x^2-x+2',  ha:-3},
          {num:'5x-1',    den:'x+3',      ha:5},
          {num:'4x^2-x',  den:'2x^2+1',   ha:2},
          {num:'-6x+1',   den:'3x-2',     ha:-2},
        ];
        const {num,den,ha} = choose(cases);
        return {
          latex: `f(x)=\\dfrac{${num}}{${den}}.\\quad\\text{Horizontal asymptote: }y=`,
          answer: [String(ha)],
          hint: 'When numerator and denominator have equal degrees, what ratio determines the horizontal asymptote?',
          step: `\\text{Equal degrees: }y=\\dfrac{\\text{leading coeff of num}}{\\text{leading coeff of den}}=${ha}`
        };
      }

      function gen6(){
        // Hole: (x-a) cancels from both numerator and denominator
        const a = choose([-4,-3,-2,-1,1,2,3,4]);
        const b = choose([-4,-3,-2,-1,1,2,3,4].filter(v => v !== a));
        const aS = a >= 0 ? `-${a}` : `+${-a}`;
        const bS_num = b >= 0 ? `-${b}` : `+${-b}`;
        // f(x) = (x-a)(x-b) / ((x-a)(x-c)) for some c ≠ a, b
        const c = choose([-4,-3,-2,-1,1,2,3,4].filter(v => v !== a && v !== b));
        const cS = c >= 0 ? `-${c}` : `+${-c}`;
        return {
          latex: `f(x)=\\dfrac{(x${aS})(x${bS_num})}{(x${aS})(x${cS})}.\\quad\\text{Hole at }x=`,
          answer: [String(a)],
          hint: 'When a factor cancels between numerator and denominator, what type of discontinuity remains?',
          step: `(x${aS})\\text{ cancels}\\Rightarrow\\text{removable discontinuity (hole) at }x=${a}`
        };
      }

      function gen7(){
        // No horizontal asymptote: deg(num) > deg(den)
        const cases = [
          {num:'x^2+3x',  den:'x+1',   ans:'none'},
          {num:'x^3-1',   den:'x^2+2', ans:'none'},
          {num:'2x^2+x',  den:'x-3',   ans:'none'},
          {num:'x^4-x',   den:'x^3+1', ans:'none'},
          {num:'3x^3+2',  den:'x^2-1', ans:'none'},
        ];
        const {num,den,ans} = choose(cases);
        return {
          latex: `f(x)=\\dfrac{${num}}{${den}}.\\quad\\text{Horizontal asymptote: }y=`,
          answer: ['none','dne','does not exist'],
          hint: 'When the numerator degree exceeds the denominator degree, does a horizontal asymptote exist?',
          step: `\\text{deg(num) > deg(den)}\\Rightarrow\\text{no horizontal asymptote}`
        };
      }

      function gen8(){
        // VA or hole? Given f with a shared factor
        const a = choose([-3,-2,-1,1,2,3]);
        const b = choose([-3,-2,-1,1,2,3].filter(v => v !== a));
        const aS = a >= 0 ? `-${a}` : `+${-a}`;
        const bS = b >= 0 ? `-${b}` : `+${-b}`;
        // If isHole: numerator has (x-a), denominator has (x-a)(x-b) → hole at a, VA at b
        // If isVA: numerator has (x-b), denominator has (x-a)(x-b) → VA at a (no cancellation), hole at b
        const isHole = choose([true, false]);
        const zeroInQ = isHole ? a : a;   // always asking about a
        const ans = isHole ? 'hole' : 'va';
        let num_expr, den_expr;
        if (isHole) {
          // (x-a) cancels → hole at a
          num_expr = `(x${aS})(x${bS})`;
          den_expr = `(x${aS})^2(x${bS})`;
          // Actually simpler: num=(x-a), den=(x-a)(x-b) → hole at a (since factor cancels)
          num_expr = `(x${aS})`;
          den_expr = `(x${aS})(x${bS})`;
        } else {
          // x=a is a genuine VA (no cancellation in numerator)
          num_expr = `1`;
          den_expr = `(x${aS})(x${bS})`;
        }
        return {
          latex: `f(x)=\\dfrac{${num_expr}}{${den_expr}}.\\quad\\text{At }x=${a}:\\text{ VA or hole?}`,
          answer: [ans, (isHole?'removable':'vertical asymptote')],
          hint: 'Does canceling common factors between numerator and denominator change what happens at that x-value?',
          step: isHole
            ? `(x${aS})\\text{ cancels}\\Rightarrow\\text{hole at }x=${a}`
            : `(x${aS})\\text{ does not cancel}\\Rightarrow\\text{vertical asymptote at }x=${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_4_1: Exponential Functions
  PRECALC_SPIRAL["PC_4_1"] = {
    title: "Exponential Functions",
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

      function gen1(){
        // Growth or decay identification
        const cases = [
          {expr:'3^x',                       bStr:'3',    ans:'growth'},
          {expr:'(0.5)^x',                   bStr:'0.5',  ans:'decay'},
          {expr:'e^{-x}',                    bStr:'1/e',  ans:'decay'},
          {expr:'5\\cdot 2^x',               bStr:'2',    ans:'growth'},
          {expr:'4\\cdot(0.8)^x',            bStr:'0.8',  ans:'decay'},
          {expr:'e^x',                       bStr:'e',    ans:'growth'},
          {expr:'\\left(\\tfrac{1}{3}\\right)^x', bStr:'1/3', ans:'decay'},
          {expr:'10^x',                      bStr:'10',   ans:'growth'},
          {expr:'0.9^x',                     bStr:'0.9',  ans:'decay'},
          {expr:'6\\cdot(0.75)^x',           bStr:'0.75', ans:'decay'},
        ];
        const {expr, bStr, ans} = choose(cases);
        return {
          latex: `f(x)=${expr}.\\quad\\text{Growth or decay?}`,
          answer: [ans],
          hint: 'For f(x)=ab^x, what threshold for b separates growth from decay?',
          step: `b=${bStr}${ans==='growth'?'>1\\Rightarrow\\text{growth}':'<1\\Rightarrow\\text{decay}'}`
        };
      }

      function gen2(){
        // Evaluate a·b^x at x=x0 → integer
        const a = choose([1, 2, 3, 4, 5]);
        const b = choose([2, 3]);
        const x0 = choose([0, 1, 2, 3]);
        const val = a * Math.pow(b, x0);
        return {
          latex: `f(x)=${a}\\cdot${b}^x.\\quad f(${x0})=`,
          answer: [String(val)],
          hint: 'What does a function\'s formula give when you know the input?',
          step: `f(${x0})=${a}\\cdot${b}^{${x0}}=${a}\\cdot${Math.pow(b,x0)}=${val}`
        };
      }

      function gen3(){
        // Initial value a from f(x)=a·b^x
        const a = choose([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const b = choose([2, 3, 4, 5]);
        return {
          latex: `f(x)=${a}\\cdot${b}^x.\\quad\\text{Initial value}=`,
          answer: [String(a)],
          hint: 'Which coefficient in an exponential function equals the output at x=0?',
          step: `f(0)=${a}\\cdot${b}^0=${a}\\cdot1=${a}`
        };
      }

      function gen4(){
        // Product law: b^m · b^n = b^(m+n) → integer result
        const b = choose([2, 3]);
        const m = rInt(3) + 1;   // 1–3
        const n = rInt(3) + 1;   // 1–3
        const total = m + n;
        const val = Math.pow(b, total);
        return {
          latex: `${b}^{${m}}\\cdot${b}^{${n}}=`,
          answer: [String(val), `${b}^{${total}}`],
          hint: 'When multiplying powers with the same base, how do the exponents combine?',
          step: `${b}^{${m}}\\cdot${b}^{${n}}=${b}^{${m}+${n}}=${b}^{${total}}=${val}`
        };
      }

      function gen5(){
        // Power law: (b^m)^n = b^(mn) → integer result
        const b = choose([2, 3]);
        const m = rInt(3) + 1;   // 1–3
        const n = rInt(2) + 1;   // 1–2 (keep manageable)
        const mn = m * n;
        const val = Math.pow(b, mn);
        return {
          latex: `(${b}^{${m}})^{${n}}=`,
          answer: [String(val), `${b}^{${mn}}`],
          hint: 'When a power is raised to another power, what happens to the two exponents?',
          step: `(${b}^{${m}})^{${n}}=${b}^{${m}\\cdot${n}}=${b}^{${mn}}=${val}`
        };
      }

      function gen6(){
        // Quotient law: b^m / b^n = b^(m-n) → integer (m > n)
        const b = choose([2, 3]);
        const n = rInt(3) + 1;          // smaller: 1–3
        const extra = rInt(3) + 1;      // additional: 1–3
        const m = n + extra;
        const diff = extra;
        const val = Math.pow(b, diff);
        return {
          latex: `\\dfrac{${b}^{${m}}}{${b}^{${n}}}=`,
          answer: [String(val), `${b}^{${diff}}`],
          hint: 'When dividing powers with the same base, how do the exponents combine?',
          step: `${b}^{${m}-${n}}=${b}^{${diff}}=${val}`
        };
      }

      function gen7(){
        // Find b from f(0)=a and f(1)=a·b
        const a = choose([1, 2, 3, 4, 5]);
        const b = choose([2, 3, 4, 5]);
        const f1 = a * b;
        return {
          latex: `f(x)=a\\cdot b^x,\\;f(0)=${a},\\;f(1)=${f1}.\\quad b=`,
          answer: [String(b)],
          hint: 'Given consecutive exponential outputs, what ratio between them reveals the base?',
          step: `b=\\dfrac{f(1)}{f(0)}=\\dfrac{${f1}}{${a}}=${b}`
        };
      }

      function gen8(){
        // Annual compound interest A=P(1+r)^t → integer result
        const cases = [
          {P:1000, rStr:'0.10', rDisp:'10\\%', t:1, A:1100},
          {P:1000, rStr:'0.10', rDisp:'10\\%', t:2, A:1210},
          {P:1000, rStr:'0.20', rDisp:'20\\%', t:2, A:1440},
          {P:500,  rStr:'0.20', rDisp:'20\\%', t:1, A:600},
          {P:2000, rStr:'0.05', rDisp:'5\\%',  t:1, A:2100},
          {P:400,  rStr:'0.25', rDisp:'25\\%', t:1, A:500},
          {P:1000, rStr:'0.10', rDisp:'10\\%', t:3, A:1331},
          {P:600,  rStr:'0.50', rDisp:'50\\%', t:1, A:900},
        ];
        const {P, rDisp, t, A} = choose(cases);
        return {
          latex: `A=P(1+r)^t,\\;P=${P},\\;r=${rDisp},\\;t=${t}\\text{ yr}.\\quad A=`,
          answer: [String(A), `\\$${A}`],
          hint: 'In the compound interest formula, which quantities are given and which is unknown?',
          step: `A=${P}(1${rDisp.includes('10')?'+0.10':rDisp.includes('20')?'+0.20':rDisp.includes('5')?'+0.05':rDisp.includes('25')?'+0.25':'+0.50'})^{${t}}=${A}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_4_2: Graphing Exponential Functions
  PRECALC_SPIRAL["PC_4_2"] = {
    title: "Graphing Exponential Functions",
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

      function gen1(){
        // HA of y = a·b^x + k → answer is k
        const b = choose([2, 3, 4, 5]);
        const a = choose([1, 2, 3, -1, -2, -3]);
        const k = choose([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const aS = a === 1 ? '' : (a === -1 ? '-' : `${a}\\cdot`);
        const kS = k >= 0 ? `+${k}` : `${k}`;
        return {
          latex: `f(x)=${aS}${b}^x${kS}.\\quad\\text{Horizontal asymptote: }y=`,
          answer: [String(k)],
          hint: 'As x→±∞, the exponential term b^x approaches zero — what does the function approach?',
          step: `b^x\\to 0\\text{ as }x\\to-\\infty,\\text{ so }f(x)\\to${k}.\\;\\text{HA: }y=${k}`
        };
      }

      function gen2(){
        // y-intercept of f(x) = a·b^(x+h) + k (h≥1 so b^h is integer)
        const b = choose([2, 3]);
        const h = choose([1, 2]);
        const a = choose([1, 2, 3]);
        const k = choose([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]);
        const bh = Math.pow(b, h);
        const yint = a * bh + k;
        const hS = h === 1 ? '+1' : `+${h}`;
        const kS = k >= 0 ? `+${k}` : `${k}`;
        const aS = a === 1 ? '' : `${a}\\cdot`;
        return {
          latex: `f(x)=${aS}${b}^{x${hS}}${kS}.\\quad\\text{y-intercept}=`,
          answer: [`(0,${yint})`, `(0, ${yint})`],
          hint: 'At the y-intercept the graph crosses the vertical axis — what is x at that moment?',
          step: `f(0)=${a}\\cdot${b}^{${h}}${kS}=${a}\\cdot${bh}${kS}=${yint}.\\;(0,${yint})`
        };
      }

      function gen3(){
        // Horizontal shift: f(x) = b^(x-h) — how many units right?
        const b = choose([2, 3, 4, 5]);
        const h = choose([1, 2, 3, 4, 5]);
        return {
          latex: `f(x)=${b}^{x-${h}}.\\quad\\text{Shift right by how many units?}`,
          answer: [String(h)],
          hint: 'In f(x)=b^(x−h), what role does h play in the horizontal position of the graph?',
          step: `(x-${h})\\Rightarrow\\text{graph of }y=${b}^x\\text{ shifted right }${h}\\text{ unit(s)}`
        };
      }

      function gen4(){
        // Increasing or decreasing?
        // b > 1 always; sign of leading coefficient determines inc/dec
        const b = choose([2, 3, 4, 5]);
        const aSign = choose([-1, 1]);
        const expr = aSign === 1 ? `${b}^x` : `-${b}^x`;
        const ans = aSign === 1 ? 'increasing' : 'decreasing';
        return {
          latex: `f(x)=${expr}.\\quad\\text{Increasing or decreasing?}`,
          answer: [ans],
          hint: 'Does reflecting y=b^x across the x-axis reverse the direction the graph travels?',
          step: `b=${b}>1,\\text{ leading coefficient }${aSign>0?'positive → increasing':'negative → decreasing'}`
        };
      }

      function gen5(){
        // Range of f(x) = a·b^x + k (a > 0 only for clean interval format)
        const b = choose([2, 3, 4, 5]);
        const k = choose([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]);
        const kS = k >= 0 ? `+${k}` : `${k}`;
        return {
          latex: `f(x)=${b}^x${kS}.\\quad\\text{Range}=`,
          answer: [`(${k},inf)`, `(${k},+inf)`, `y>${k}`],
          hint: 'Since b^x is always positive, how does adding a constant k change the output range?',
          step: `b^x>0\\Rightarrow${b}^x${kS}>${k}.\\;\\text{Range: }(${k},\\infty)`
        };
      }

      function gen6(){
        // Find b from f(0)=a and f(2)=a·b^2 (model context)
        const a = choose([1, 2, 3, 4, 5]);
        const b = choose([2, 3, 4, 5]);
        const f2 = a * Math.pow(b, 2);
        return {
          latex: `f(t)=a\\cdot b^t.\\;f(0)=${a},\\;f(2)=${f2}.\\quad b=`,
          answer: [String(b)],
          hint: 'Given two data points on an exponential model, what operation on their ratio gives b?',
          step: `b^2=\\dfrac{f(2)}{f(0)}=\\dfrac{${f2}}{${a}}=${b*b}\\Rightarrow b=\\sqrt{${b*b}}=${b}`
        };
      }

      function gen7(){
        // Find a from f(x)=a·b^x given f(n)=val
        const a = choose([2, 3, 4, 5, 6]);
        const b = choose([2, 3]);
        const n = choose([2, 3]);
        const fn = a * Math.pow(b, n);
        const bn = Math.pow(b, n);
        return {
          latex: `f(x)=a\\cdot${b}^x.\\;f(${n})=${fn}.\\quad a=`,
          answer: [String(a)],
          hint: 'In f(x)=a·b^x, which value does the coefficient a represent at x=0?',
          step: `${fn}=a\\cdot${b}^{${n}}=a\\cdot${bn}\\Rightarrow a=${fn}\\div${bn}=${a}`
        };
      }

      function gen8(){
        // y-intercept of reflected/shifted: f(x) = -a·b^x + k
        const b = choose([2, 3, 4, 5]);
        const k = choose([4, 5, 6, 7, 8, 9, 10]);
        const a = choose([1, 2, 3]);
        const yint = k - a;  // f(0) = -a·b^0 + k = -a + k
        const kS = `+${k}`;
        return {
          latex: `f(x)=-${a}\\cdot${b}^x${kS}.\\quad\\text{y-intercept}=`,
          answer: [`(0,${yint})`, `(0, ${yint})`],
          hint: 'At the y-intercept, what does b^0 simplify to regardless of b?',
          step: `f(0)=-${a}\\cdot${b}^0+${k}=-${a}+${k}=${yint}.\\;(0,${yint})`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_4_3: Logarithmic Functions
  PRECALC_SPIRAL["PC_4_3"] = {
    title: "Logarithmic Functions",
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

      function gen4str(b){
        // Returns LaTeX log notation string for base b
        return b === 10 ? '\\log' : `\\log_{${b}}`;
      }

      function gen1(){
        // log↔exp: log_b(c)=n → find c=b^n (integer)
        const b = choose([2, 3, 5, 10]);
        const n = choose([2, 3, 4]);
        const c = Math.pow(b, n);
        const logStr = gen4str(b);
        return {
          latex: `${logStr}(x)=${n}.\\quad x=`,
          answer: [String(c)],
          hint: 'A logarithm equation log_b(x)=n is equivalent to what exponential equation?',
          step: `${logStr}(x)=${n}\\Leftrightarrow${b}^{${n}}=x=${c}`
        };
      }

      function gen2(){
        // Evaluate log_b(b^n) = n directly (inverse property)
        const b = choose([2, 3, 4, 5, 10]);
        const n = choose([-2, -1, 0, 1, 2, 3, 4, 5]);
        const logStr = gen4str(b);
        return {
          latex: `${logStr}(${b}^{${n}})=`,
          answer: [String(n)],
          hint: 'What is the relationship between a logarithm and its own base raised to a power?',
          step: `${logStr}(${b}^{${n}})=${n}\\quad(\\text{inverse property: }\\log_b(b^x)=x)`
        };
      }

      function gen3(){
        // Evaluate log base 10 or ln: log(10^n) = n, ln(e^n) = n
        const useLn = choose([true, false]);
        const n = choose([-2, -1, 1, 2, 3, 4]);
        if (useLn) {
          const expr = n === 1 ? 'e' : (n === -1 ? '\\tfrac{1}{e}' : `e^{${n}}`);
          return {
            latex: `\\ln(${expr})=`,
            answer: [String(n)],
            hint: 'Since ln is the logarithm base e, what does ln(e^n) equal?',
            step: `\\ln(e^{${n}})=${n}`
          };
        } else {
          const val = Math.pow(10, n);
          const expr = n >= 0 ? String(val) : `\\tfrac{1}{${Math.pow(10,-n)}}`;
          return {
            latex: `\\log(${expr})=`,
            answer: [String(n)],
            hint: 'Since log means log base 10, what does log(10^n) equal?',
            step: `\\log(10^{${n}})=${n}`
          };
        }
      }

      function gen4(){
        // Product rule evaluation: log_b(b^m · b^n) = m + n (integer)
        const b = choose([2, 3, 5, 10]);
        const m = rInt(3) + 1;   // 1–3
        const n = rInt(3) + 1;   // 1–3
        const bm = Math.pow(b, m), bn = Math.pow(b, n);
        const logStr = gen4str(b);
        return {
          latex: `${logStr}(${bm}\\cdot${bn})=`,
          answer: [String(m + n)],
          hint: 'The product rule converts multiplication inside a log to what operation outside?',
          step: `${logStr}(${bm})+${logStr}(${bn})=${m}+${n}=${m+n}`
        };
      }

      function gen5(){
        // Power rule: given log_b(x)=c, find log_b(x^p) = p·c
        const b = choose([2, 3, 5, 10]);
        const c = choose([2, 3, 4]);
        const p = choose([2, 3, 4]);
        const logStr = gen4str(b);
        return {
          latex: `${logStr}(x)=${c}.\\quad${logStr}(x^{${p}})=`,
          answer: [String(p * c)],
          hint: 'The power rule moves an exponent inside a log to what position outside?',
          step: `${logStr}(x^{${p}})=${p}\\cdot${logStr}(x)=${p}\\cdot${c}=${p*c}`
        };
      }

      function gen6(){
        // Domain of f(x) = log_b(x - k) → x > k, enter k
        const b = choose([2, 3, 5, 10]);
        const k = choose([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const logStr = gen4str(b);
        const kS = k >= 0 ? `-${k}` : `+${-k}`;
        // Boundary: x - k > 0 → x > k
        return {
          latex: `f(x)=${logStr}(x${kS}).\\quad\\text{Domain: }x>`,
          answer: [String(k)],
          hint: 'The argument of a logarithm must be positive — what inequality does that create for x?',
          step: `x${kS}>0\\Rightarrow x>${k}.\\;\\text{Domain: }(${k},\\infty)`
        };
      }

      function gen7(){
        // Condense: log(m) + log(n) = log(mn) = integer (base 10, mn = 10^k)
        const cases = [
          {a:4,   b:25,  prod:100,  ans:2},
          {a:2,   b:50,  prod:100,  ans:2},
          {a:5,   b:20,  prod:100,  ans:2},
          {a:8,   b:125, prod:1000, ans:3},
          {a:4,   b:250, prod:1000, ans:3},
          {a:40,  b:25,  prod:1000, ans:3},
          {a:2,   b:500, prod:1000, ans:3},
          {a:20,  b:50,  prod:1000, ans:3},
        ];
        const {a, b, prod, ans} = choose(cases);
        return {
          latex: `\\log(${a})+\\log(${b})=`,
          answer: [String(ans)],
          hint: 'The product rule allows two logs with the same base to merge — what is log(mn) when mn is a power of 10?',
          step: `\\log(${a}\\cdot${b})=\\log(${prod})=\\log(10^{${ans}})=${ans}`
        };
      }

      function gen8(){
        // Evaluate using inverse: b^(log_b(x)) = x or log_b(b^x) at a specific value
        // Use: log_b(b^n) = n but with b^n written out explicitly
        const b = choose([2, 3, 5, 10]);
        const n = choose([1, 2, 3, 4]);
        const logStr = gen4str(b);
        // Ask: b^(log_b(val)) = val
        const val = Math.pow(b, n);  // val = b^n
        return {
          latex: `${b}^{${logStr}(${val})}=`,
          answer: [String(val)],
          hint: 'The exponential and logarithmic functions are inverses — what does b^(log_b x) always equal?',
          step: `b^{\\log_b x}=x,\\text{ so }${b}^{${logStr}(${val})}=${val}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_4_5: Exponential & Logarithmic Equations
  PRECALC_SPIRAL["PC_4_5"] = {
    title: "Exponential & Logarithmic Equations",
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

      function gen1(){
        // Same-base: b^(ax+c) = b^(dx+e) → ax+c = dx+e → integer x
        const b = choose([2, 3, 5]);
        const cases = {
          2: [
            {lhs:'2x+1', rhs:'x+5',  x:4, step:'2x+1=x+5\\Rightarrow x=4'},
            {lhs:'3x-1', rhs:'x+5',  x:3, step:'3x-1=x+5\\Rightarrow 2x=6\\Rightarrow x=3'},
            {lhs:'2x',   rhs:'x+4',  x:4, step:'2x=x+4\\Rightarrow x=4'},
            {lhs:'4x-2', rhs:'2x+4', x:3, step:'4x-2=2x+4\\Rightarrow 2x=6\\Rightarrow x=3'},
            {lhs:'3x+1', rhs:'x+7',  x:3, step:'3x+1=x+7\\Rightarrow 2x=6\\Rightarrow x=3'},
          ],
          3: [
            {lhs:'2x-1', rhs:'x+3',  x:4, step:'2x-1=x+3\\Rightarrow x=4'},
            {lhs:'3x',   rhs:'x+6',  x:3, step:'3x=x+6\\Rightarrow 2x=6\\Rightarrow x=3'},
            {lhs:'2x+2', rhs:'x+6',  x:4, step:'2x+2=x+6\\Rightarrow x=4'},
            {lhs:'4x-3', rhs:'x+3',  x:2, step:'4x-3=x+3\\Rightarrow 3x=6\\Rightarrow x=2'},
            {lhs:'3x-2', rhs:'2x+1', x:3, step:'3x-2=2x+1\\Rightarrow x=3'},
          ],
          5: [
            {lhs:'2x+1', rhs:'x+4',  x:3, step:'2x+1=x+4\\Rightarrow x=3'},
            {lhs:'3x-1', rhs:'x+5',  x:3, step:'3x-1=x+5\\Rightarrow 2x=6\\Rightarrow x=3'},
            {lhs:'2x',   rhs:'x+3',  x:3, step:'2x=x+3\\Rightarrow x=3'},
          ],
        };
        const {lhs, rhs, x, step} = choose(cases[b]);
        return {
          latex: `${b}^{${lhs}}=${b}^{${rhs}}.\\quad x=`,
          answer: [String(x)],
          hint: 'When two exponentials with the same base are equal, what must be true of their exponents?',
          step: `${step}`
        };
      }

      function gen2(){
        // Rewrite and solve: 4^x=8 → 2^(2x)=2^3 → x=3/2 (fraction answers OK)
        const cases = [
          {lhs:'4^x',     rhs:'8',   setup:'2^{2x}=2^3',   eq:'2x=3',   ans:['3/2','1.5']},
          {lhs:'9^x',     rhs:'27',  setup:'3^{2x}=3^3',   eq:'2x=3',   ans:['3/2','1.5']},
          {lhs:'25^x',    rhs:'125', setup:'5^{2x}=5^3',   eq:'2x=3',   ans:['3/2','1.5']},
          {lhs:'8^x',     rhs:'4',   setup:'2^{3x}=2^2',   eq:'3x=2',   ans:['2/3']},
          {lhs:'27^x',    rhs:'9',   setup:'3^{3x}=3^2',   eq:'3x=2',   ans:['2/3']},
          {lhs:'4^{x+1}', rhs:'8^x', setup:'2^{2x+2}=2^{3x}', eq:'2x+2=3x', ans:['2']},
          {lhs:'9^{x+1}', rhs:'27^x',setup:'3^{2x+2}=3^{3x}', eq:'2x+2=3x', ans:['2']},
        ];
        const {lhs, rhs, setup, eq, ans} = choose(cases);
        return {
          latex: `${lhs}=${rhs}.\\quad x=`,
          answer: ans,
          hint: 'When bases differ but share a common base, rewriting both sides as that base does what to the equation?',
          step: `${setup}\\Rightarrow${eq}\\Rightarrow x=${ans[0]}`
        };
      }

      function gen3(){
        // Solve log_b(ax+c)=d → ax+c=b^d → integer x
        const cases = [
          {logStr:'\\log_2',  b:2, lhs:'3x+1', d:4, rhs:16, ax:3, c:1, x:5},
          {logStr:'\\log_2',  b:2, lhs:'2x-2', d:3, rhs:8,  ax:2, c:-2,x:5},
          {logStr:'\\log_3',  b:3, lhs:'2x-3', d:3, rhs:27, ax:2, c:-3,x:15},
          {logStr:'\\log_3',  b:3, lhs:'x+6',  d:2, rhs:9,  ax:1, c:6, x:3},
          {logStr:'\\log_5',  b:5, lhs:'2x+1', d:2, rhs:25, ax:2, c:1, x:12},
          {logStr:'\\log_4',  b:4, lhs:'x-2',  d:2, rhs:16, ax:1, c:-2,x:18},
          {logStr:'\\log',    b:10,lhs:'x+2',  d:3, rhs:1000,ax:1,c:2, x:998},
          {logStr:'\\ln',     b:'e',lhs:'x-1', d:0, rhs:1,  ax:1, c:-1,x:2},
        ];
        const {logStr, b, lhs, d, rhs, ax, c, x} = choose(cases);
        const dDisp = (b==='e') ? `\\ln(1)=0` : `${logStr}(${rhs})=${d}`;
        return {
          latex: `${logStr}(${lhs})=${d}.\\quad x=`,
          answer: [String(x)],
          hint: 'A logarithmic equation log_b(expr)=d converts to what exponential statement?',
          step: `${lhs}=${b}^{${d}}=${rhs}\\Rightarrow x=${x}`
        };
      }

      function gen4(){
        // log(x)+log(x-k)=m → x(x-k)=10^m → x^2-kx-10^m=0; all 4 cases verified to factor cleanly
        const cases = [
          {k:3,  m:1, goodX:5},
          {k:9,  m:1, goodX:10},
          {k:15, m:2, goodX:20},
          {k:21, m:2, goodX:25},
        ];
        const {k, m, goodX} = choose(cases);
        const rhs10 = Math.pow(10, m);
        return {
          latex: `\\log(x)+\\log(x-${k})=${m}.\\quad x=`,
          answer: [String(goodX)],
          hint: 'When combining logs leads to a quadratic, why might one solution be rejected?',
          step: `x(x-${k})=10^{${m}}\\Rightarrow x^2-${k}x-${rhs10}=0\\Rightarrow x=${goodX}\\text{ (reject negative, log undefined)}`
        };
      }

      function gen5(){
        // Solve e^(kx) = e^n → kx = n → integer x
        const n = choose([2, 3, 4, 6, 8, 9, 10]);
        const kVals = [1,2,3,4].filter(k => n % k === 0);
        const k = choose(kVals);
        const x = n / k;
        const lhsExp = k === 1 ? `x` : `${k}x`;
        return {
          latex: `e^{${lhsExp}}=e^{${n}}.\\quad x=`,
          answer: [String(x)],
          hint: 'When two exponentials with base e are equal, what does that tell you about their exponents?',
          step: `${lhsExp}=${n}\\Rightarrow x=${x}`
        };
      }

      function gen6(){
        // log_b(x) = log_b(c) → x = c
        const b = choose([2, 3, 5, 10]);
        const c = choose([2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 25]);
        const logStr = b === 10 ? '\\log' : `\\log_{${b}}`;
        return {
          latex: `${logStr}(x)=${logStr}(${c}).\\quad x=`,
          answer: [String(c)],
          hint: 'If two logarithms with the same base are equal, what can you conclude about their arguments?',
          step: `\\log_b(A)=\\log_b(B)\\Rightarrow A=B,\\text{ so }x=${c}`
        };
      }

      function gen7(){
        // Solve b^t = c for t where c is a power of b → integer t
        const b = choose([2, 3, 5]);
        const t = choose([2, 3, 4, 5]);
        const c = Math.pow(b, t);
        const P = choose([1, 2, 3, 4, 5]);
        const A = P * c;
        return {
          latex: `${P}\\cdot${b}^t=${A}.\\quad t=`,
          answer: [String(t)],
          hint: 'After dividing both sides by the coefficient, how do you read t from a power equation?',
          step: `${b}^t=${A}/${P}=${c}=${b}^{${t}}\\Rightarrow t=${t}`
        };
      }

      function gen8(){
        // log_b(x) - log_b(x-c) = 1 → x/(x-c) = b → integer x
        const cases = [
          {b:3, c:2, x:3,  logStr:'\\log_3'},
          {b:5, c:4, x:5,  logStr:'\\log_5'},
          {b:7, c:6, x:7,  logStr:'\\log_7'},
          {b:3, c:6, x:9,  logStr:'\\log_3'},
          {b:2, c:6, x:12, logStr:'\\log_2'},
          {b:5, c:20,x:25, logStr:'\\log_5'},
        ];
        const {b, c, x, logStr} = choose(cases);
        return {
          latex: `${logStr}(x)-${logStr}(x-${c})=1.\\quad x=`,
          answer: [String(x)],
          hint: 'The quotient rule allows two logs to combine — what equation does log_b(A/B)=1 produce?',
          step: `${logStr}\\!\\left(\\dfrac{x}{x-${c}}\\right)=1\\Rightarrow\\dfrac{x}{x-${c}}=${b}\\Rightarrow x=${x}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_5_1: Angles and Their Measure
  PRECALC_SPIRAL["PC_5_1"] = {
    title: "Angles and Their Measure",
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

      function gen1(){
        // Degrees to radians → "npi/m" or "npi" answer
        const cases = [
          {deg:30,  rad:'\\dfrac{\\pi}{6}',    ans:['pi/6']},
          {deg:45,  rad:'\\dfrac{\\pi}{4}',    ans:['pi/4']},
          {deg:60,  rad:'\\dfrac{\\pi}{3}',    ans:['pi/3']},
          {deg:90,  rad:'\\dfrac{\\pi}{2}',    ans:['pi/2']},
          {deg:120, rad:'\\dfrac{2\\pi}{3}',   ans:['2pi/3']},
          {deg:135, rad:'\\dfrac{3\\pi}{4}',   ans:['3pi/4']},
          {deg:150, rad:'\\dfrac{5\\pi}{6}',   ans:['5pi/6']},
          {deg:180, rad:'\\pi',                ans:['pi']},
          {deg:210, rad:'\\dfrac{7\\pi}{6}',   ans:['7pi/6']},
          {deg:240, rad:'\\dfrac{4\\pi}{3}',   ans:['4pi/3']},
          {deg:270, rad:'\\dfrac{3\\pi}{2}',   ans:['3pi/2']},
          {deg:300, rad:'\\dfrac{5\\pi}{3}',   ans:['5pi/3']},
          {deg:315, rad:'\\dfrac{7\\pi}{4}',   ans:['7pi/4']},
          {deg:330, rad:'\\dfrac{11\\pi}{6}',  ans:['11pi/6']},
          {deg:360, rad:'2\\pi',               ans:['2pi']},
        ];
        const {deg, rad, ans} = choose(cases);
        return {
          latex: `${deg}^\\circ\\text{ in radians}=`,
          answer: ans,
          hint: 'What is the radian equivalent of 180°, and how does your angle relate to that?',
          step: `${deg}^\\circ\\cdot\\dfrac{\\pi}{180}=${rad}`
        };
      }

      function gen2(){
        // Radians to degrees → integer
        const cases = [
          {rad:'\\dfrac{\\pi}{6}',    deg:30},
          {rad:'\\dfrac{\\pi}{4}',    deg:45},
          {rad:'\\dfrac{\\pi}{3}',    deg:60},
          {rad:'\\dfrac{\\pi}{2}',    deg:90},
          {rad:'\\dfrac{2\\pi}{3}',   deg:120},
          {rad:'\\dfrac{3\\pi}{4}',   deg:135},
          {rad:'\\dfrac{5\\pi}{6}',   deg:150},
          {rad:'\\pi',                deg:180},
          {rad:'\\dfrac{7\\pi}{6}',   deg:210},
          {rad:'\\dfrac{4\\pi}{3}',   deg:240},
          {rad:'\\dfrac{3\\pi}{2}',   deg:270},
          {rad:'\\dfrac{5\\pi}{3}',   deg:300},
          {rad:'\\dfrac{7\\pi}{4}',   deg:315},
          {rad:'\\dfrac{11\\pi}{6}',  deg:330},
          {rad:'2\\pi',               deg:360},
        ];
        const {rad, deg} = choose(cases);
        return {
          latex: `${rad}\\text{ rad in degrees}=`,
          answer: [String(deg), `${deg}^\\circ`],
          hint: 'What is the degree equivalent of π radians, and how does your angle relate to π?',
          step: `${rad}\\cdot\\dfrac{180}{\\pi}=${deg}^\\circ`
        };
      }

      function gen3(){
        // Arc length s = rθ → "npi" answer
        const cases = [
          {r:3,  tStr:'\\dfrac{\\pi}{3}',   sStr:'\\pi',    ans:['pi']},
          {r:6,  tStr:'\\dfrac{2\\pi}{3}',  sStr:'4\\pi',   ans:['4pi']},
          {r:4,  tStr:'\\dfrac{3\\pi}{4}',  sStr:'3\\pi',   ans:['3pi']},
          {r:10, tStr:'\\dfrac{\\pi}{5}',   sStr:'2\\pi',   ans:['2pi']},
          {r:5,  tStr:'\\pi',               sStr:'5\\pi',   ans:['5pi']},
          {r:6,  tStr:'\\dfrac{\\pi}{2}',   sStr:'3\\pi',   ans:['3pi']},
          {r:8,  tStr:'\\dfrac{\\pi}{4}',   sStr:'2\\pi',   ans:['2pi']},
          {r:12, tStr:'\\dfrac{5\\pi}{6}',  sStr:'10\\pi',  ans:['10pi']},
          {r:9,  tStr:'\\dfrac{2\\pi}{3}',  sStr:'6\\pi',   ans:['6pi']},
        ];
        const {r, tStr, sStr, ans} = choose(cases);
        return {
          latex: `r=${r}\\text{ m},\\;\\theta=${tStr}\\text{ rad}.\\quad s=r\\theta=`,
          answer: ans,
          hint: 'In s=rθ, what unit must θ be in, and which quantity is being multiplied together?',
          step: `s=${r}\\cdot${tStr}=${sStr}\\text{ m}`
        };
      }

      function gen4(){
        // Coterminal in degrees: find positive coterminal in [0,360)
        const cases = [
          {given:400,  ans:40},
          {given:480,  ans:120},
          {given:510,  ans:150},
          {given:540,  ans:180},
          {given:450,  ans:90},
          {given:600,  ans:240},
          {given:-30,  ans:330},
          {given:-60,  ans:300},
          {given:-90,  ans:270},
          {given:-120, ans:240},
          {given:-150, ans:210},
          {given:-45,  ans:315},
        ];
        const {given, ans} = choose(cases);
        const n = Math.round((ans - given) / 360);
        const nStr = n > 0 ? `+${n}` : `${n}`;
        return {
          latex: `\\text{Positive coterminal with }${given}^\\circ\\text{ in }[0°,360°)=`,
          answer: [String(ans), `${ans}^\\circ`],
          hint: 'Coterminal angles differ by full rotations — how many degrees is one full rotation?',
          step: `${given}^\\circ${nStr}\\cdot360^\\circ=${ans}^\\circ`
        };
      }

      function gen5(){
        // Linear speed v = rω → integer
        const r = choose([2, 3, 4, 5, 6, 8, 10]);
        const omega = choose([2, 3, 4, 5, 6]);
        const v = r * omega;
        return {
          latex: `r=${r}\\text{ m},\\;\\omega=${omega}\\text{ rad/s}.\\quad v=r\\omega=`,
          answer: [String(v), `${v}\\text{ m/s}`],
          hint: 'Linear speed and angular speed are related by what geometric property of the rotating object?',
          step: `v=${r}\\cdot${omega}=${v}\\text{ m/s}`
        };
      }

      function gen6(){
        // Reference angle in degrees → 30, 45, or 60
        const cases = [
          {angle:'120^\\circ', ref:60},
          {angle:'135^\\circ', ref:45},
          {angle:'150^\\circ', ref:30},
          {angle:'210^\\circ', ref:30},
          {angle:'225^\\circ', ref:45},
          {angle:'240^\\circ', ref:60},
          {angle:'300^\\circ', ref:60},
          {angle:'315^\\circ', ref:45},
          {angle:'330^\\circ', ref:30},
        ];
        const {angle, ref} = choose(cases);
        return {
          latex: `\\text{Reference angle of }${angle}=`,
          answer: [String(ref), `${ref}^\\circ`],
          hint: 'A reference angle is the acute angle between the terminal side and the nearest segment of which axis?',
          step: `\\text{Nearest }x\\text{-axis direction: reference angle}=${ref}^\\circ`
        };
      }

      function gen7(){
        // Coterminal in radians: find positive coterminal with negative angle
        const cases = [
          {given:'-\\dfrac{\\pi}{6}',   ans:'11pi/6', ansStr:'\\dfrac{11\\pi}{6}'},
          {given:'-\\dfrac{\\pi}{4}',   ans:'7pi/4',  ansStr:'\\dfrac{7\\pi}{4}'},
          {given:'-\\dfrac{\\pi}{3}',   ans:'5pi/3',  ansStr:'\\dfrac{5\\pi}{3}'},
          {given:'-\\dfrac{\\pi}{2}',   ans:'3pi/2',  ansStr:'\\dfrac{3\\pi}{2}'},
          {given:'-\\dfrac{2\\pi}{3}',  ans:'4pi/3',  ansStr:'\\dfrac{4\\pi}{3}'},
          {given:'-\\dfrac{3\\pi}{4}',  ans:'5pi/4',  ansStr:'\\dfrac{5\\pi}{4}'},
          {given:'-\\dfrac{5\\pi}{6}',  ans:'7pi/6',  ansStr:'\\dfrac{7\\pi}{6}'},
        ];
        const {given, ans, ansStr} = choose(cases);
        return {
          latex: `\\text{Positive coterminal with }${given}\\text{ in }[0,2\\pi)=`,
          answer: [ans],
          hint: 'What is one full rotation measured in radians, and how does adding it change a negative angle?',
          step: `${given}+2\\pi=${ansStr}`
        };
      }

      function gen8(){
        // Find radius from s and θ: r = s/θ → integer
        const cases = [
          {sStr:'\\pi',    tStr:'\\dfrac{\\pi}{3}',   r:3},
          {sStr:'4\\pi',   tStr:'\\dfrac{2\\pi}{3}',   r:6},
          {sStr:'3\\pi',   tStr:'\\dfrac{\\pi}{2}',    r:6},
          {sStr:'2\\pi',   tStr:'\\dfrac{\\pi}{4}',    r:8},
          {sStr:'5\\pi',   tStr:'\\pi',                r:5},
          {sStr:'3\\pi',   tStr:'\\dfrac{3\\pi}{4}',   r:4},
          {sStr:'6\\pi',   tStr:'\\dfrac{2\\pi}{3}',   r:9},
          {sStr:'10\\pi',  tStr:'\\dfrac{5\\pi}{6}',   r:12},
        ];
        const {sStr, tStr, r} = choose(cases);
        return {
          latex: `s=${sStr}\\text{ m},\\;\\theta=${tStr}\\text{ rad}.\\quad r=`,
          answer: [String(r)],
          hint: 'In s=rθ, if both arc length and angle are known, what does that allow you to determine?',
          step: `r=\\dfrac{s}{\\theta}=\\dfrac{${sStr}}{${tStr}}=${r}\\text{ m}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_5_2: Unit Circle: Sine and Cosine
  PRECALC_SPIRAL["PC_5_2"] = {
    title: "Unit Circle: Sine and Cosine",
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

      // Unit circle table — (aStr, sinAns[], cosAns[], sinD, cosD)
      const UC = [
        {aStr:'0',                 sinAns:['0'],                          cosAns:['1'],
         sinD:'0',                            cosD:'1'},
        {aStr:'\\dfrac{\\pi}{6}', sinAns:['1/2'],                        cosAns:['sqrt(3)/2','sqrt3/2'],
         sinD:'\\dfrac{1}{2}',               cosD:'\\dfrac{\\sqrt{3}}{2}'},
        {aStr:'\\dfrac{\\pi}{4}', sinAns:['sqrt(2)/2','sqrt2/2'],        cosAns:['sqrt(2)/2','sqrt2/2'],
         sinD:'\\dfrac{\\sqrt{2}}{2}',       cosD:'\\dfrac{\\sqrt{2}}{2}'},
        {aStr:'\\dfrac{\\pi}{3}', sinAns:['sqrt(3)/2','sqrt3/2'],        cosAns:['1/2'],
         sinD:'\\dfrac{\\sqrt{3}}{2}',       cosD:'\\dfrac{1}{2}'},
        {aStr:'\\dfrac{\\pi}{2}', sinAns:['1'],                          cosAns:['0'],
         sinD:'1',                            cosD:'0'},
        {aStr:'\\dfrac{2\\pi}{3}',sinAns:['sqrt(3)/2','sqrt3/2'],        cosAns:['-1/2'],
         sinD:'\\dfrac{\\sqrt{3}}{2}',       cosD:'-\\dfrac{1}{2}'},
        {aStr:'\\dfrac{3\\pi}{4}',sinAns:['sqrt(2)/2','sqrt2/2'],        cosAns:['-sqrt(2)/2','-sqrt2/2'],
         sinD:'\\dfrac{\\sqrt{2}}{2}',       cosD:'-\\dfrac{\\sqrt{2}}{2}'},
        {aStr:'\\dfrac{5\\pi}{6}',sinAns:['1/2'],                        cosAns:['-sqrt(3)/2','-sqrt3/2'],
         sinD:'\\dfrac{1}{2}',               cosD:'-\\dfrac{\\sqrt{3}}{2}'},
        {aStr:'\\pi',             sinAns:['0'],                          cosAns:['-1'],
         sinD:'0',                            cosD:'-1'},
        {aStr:'\\dfrac{7\\pi}{6}',sinAns:['-1/2'],                       cosAns:['-sqrt(3)/2','-sqrt3/2'],
         sinD:'-\\dfrac{1}{2}',              cosD:'-\\dfrac{\\sqrt{3}}{2}'},
        {aStr:'\\dfrac{5\\pi}{4}',sinAns:['-sqrt(2)/2','-sqrt2/2'],      cosAns:['-sqrt(2)/2','-sqrt2/2'],
         sinD:'-\\dfrac{\\sqrt{2}}{2}',      cosD:'-\\dfrac{\\sqrt{2}}{2}'},
        {aStr:'\\dfrac{4\\pi}{3}',sinAns:['-sqrt(3)/2','-sqrt3/2'],      cosAns:['-1/2'],
         sinD:'-\\dfrac{\\sqrt{3}}{2}',      cosD:'-\\dfrac{1}{2}'},
        {aStr:'\\dfrac{3\\pi}{2}',sinAns:['-1'],                         cosAns:['0'],
         sinD:'-1',                           cosD:'0'},
        {aStr:'\\dfrac{5\\pi}{3}',sinAns:['-sqrt(3)/2','-sqrt3/2'],      cosAns:['1/2'],
         sinD:'-\\dfrac{\\sqrt{3}}{2}',      cosD:'\\dfrac{1}{2}'},
        {aStr:'\\dfrac{7\\pi}{4}',sinAns:['-sqrt(2)/2','-sqrt2/2'],      cosAns:['sqrt(2)/2','sqrt2/2'],
         sinD:'-\\dfrac{\\sqrt{2}}{2}',      cosD:'\\dfrac{\\sqrt{2}}{2}'},
        {aStr:'\\dfrac{11\\pi}{6}',sinAns:['-1/2'],                      cosAns:['sqrt(3)/2','sqrt3/2'],
         sinD:'-\\dfrac{1}{2}',              cosD:'\\dfrac{\\sqrt{3}}{2}'},
      ];

      function gen1(){
        // Evaluate sin at unit circle angle
        const uc = choose(UC);
        return {
          latex: `\\sin\\!\\left(${uc.aStr}\\right)=`,
          answer: uc.sinAns,
          hint: 'On the unit circle, which coordinate of the terminal point gives sin(θ)?',
          step: `\\sin\\!\\left(${uc.aStr}\\right)=${uc.sinD}`
        };
      }

      function gen2(){
        // Evaluate cos at unit circle angle
        const uc = choose(UC);
        return {
          latex: `\\cos\\!\\left(${uc.aStr}\\right)=`,
          answer: uc.cosAns,
          hint: 'On the unit circle, which coordinate of the terminal point gives cos(θ)?',
          step: `\\cos\\!\\left(${uc.aStr}\\right)=${uc.cosD}`
        };
      }

      function gen3(){
        // Pythagorean identity: given sin(θ) and quadrant, find cos(θ)
        const cases = [
          {sinStr:'\\dfrac{3}{5}',   quad:'II',  cosAns:['-4/5'],   cosStr:'-\\dfrac{4}{5}'},
          {sinStr:'\\dfrac{5}{13}',  quad:'I',   cosAns:['12/13'],  cosStr:'\\dfrac{12}{13}'},
          {sinStr:'-\\dfrac{5}{13}', quad:'III', cosAns:['-12/13'], cosStr:'-\\dfrac{12}{13}'},
          {sinStr:'-\\dfrac{3}{5}',  quad:'III', cosAns:['-4/5'],   cosStr:'-\\dfrac{4}{5}'},
          {sinStr:'\\dfrac{8}{17}',  quad:'I',   cosAns:['15/17'],  cosStr:'\\dfrac{15}{17}'},
          {sinStr:'-\\dfrac{8}{17}', quad:'IV',  cosAns:['15/17'],  cosStr:'\\dfrac{15}{17}'},
          {sinStr:'\\dfrac{4}{5}',   quad:'II',  cosAns:['-3/5'],   cosStr:'-\\dfrac{3}{5}'},
          {sinStr:'-\\dfrac{12}{13}',quad:'IV',  cosAns:['5/13'],   cosStr:'\\dfrac{5}{13}'},
        ];
        const {sinStr, quad, cosAns, cosStr} = choose(cases);
        return {
          latex: `\\sin\\theta=${sinStr},\\;\\theta\\text{ in Q${quad}}.\\quad\\cos\\theta=`,
          answer: cosAns,
          hint: 'Which identity connects sin²θ and cos²θ, and what does the quadrant tell you about sign?',
          step: `\\cos^2\\theta=1-\\left(${sinStr}\\right)^2\\Rightarrow\\cos\\theta=${cosStr}\\;(\\text{Q${quad}})`
        };
      }

      function gen4(){
        // Even/odd properties: evaluate sin/cos at negative angle
        const cases = [
          {fn:'cos', angle:'-\\dfrac{\\pi}{3}',  posAStr:'\\dfrac{\\pi}{3}',  ans:['1/2'],                    ansD:'\\dfrac{1}{2}'},
          {fn:'sin', angle:'-\\dfrac{\\pi}{6}',  posAStr:'\\dfrac{\\pi}{6}',  ans:['-1/2'],                   ansD:'-\\dfrac{1}{2}'},
          {fn:'cos', angle:'-\\dfrac{\\pi}{4}',  posAStr:'\\dfrac{\\pi}{4}',  ans:['sqrt(2)/2','sqrt2/2'],    ansD:'\\dfrac{\\sqrt{2}}{2}'},
          {fn:'sin', angle:'-\\dfrac{\\pi}{3}',  posAStr:'\\dfrac{\\pi}{3}',  ans:['-sqrt(3)/2','-sqrt3/2'],  ansD:'-\\dfrac{\\sqrt{3}}{2}'},
          {fn:'cos', angle:'-\\dfrac{\\pi}{6}',  posAStr:'\\dfrac{\\pi}{6}',  ans:['sqrt(3)/2','sqrt3/2'],    ansD:'\\dfrac{\\sqrt{3}}{2}'},
          {fn:'cos', angle:'-\\pi',              posAStr:'\\pi',               ans:['-1'],                     ansD:'-1'},
          {fn:'sin', angle:'-\\dfrac{\\pi}{2}',  posAStr:'\\dfrac{\\pi}{2}',  ans:['-1'],                     ansD:'-1'},
          {fn:'cos', angle:'-\\dfrac{\\pi}{2}',  posAStr:'\\dfrac{\\pi}{2}',  ans:['0'],                      ansD:'0'},
          {fn:'sin', angle:'-\\dfrac{\\pi}{4}',  posAStr:'\\dfrac{\\pi}{4}',  ans:['-sqrt(2)/2','-sqrt2/2'],  ansD:'-\\dfrac{\\sqrt{2}}{2}'},
        ];
        const {fn, angle, posAStr, ans, ansD} = choose(cases);
        const rule = fn==='cos'
          ? `\\cos(-\\theta)=\\cos\\theta\\Rightarrow\\cos\\!\\left(${posAStr}\\right)=${ansD}`
          : `\\sin(-\\theta)=-\\sin\\theta\\Rightarrow-\\sin\\!\\left(${posAStr}\\right)=${ansD}`;
        return {
          latex: `\\${fn}\\!\\left(${angle}\\right)=`,
          answer: ans,
          hint: 'Cosine is even and sine is odd — what does each property say about f(−θ)?',
          step: rule
        };
      }

      function gen5(){
        // Sign of sin/cos in quadrant → "positive" or "negative"
        const cases = [
          {fn:'sin', quad:'III', sign:'negative'},
          {fn:'cos', quad:'II',  sign:'negative'},
          {fn:'sin', quad:'IV',  sign:'negative'},
          {fn:'cos', quad:'IV',  sign:'positive'},
          {fn:'sin', quad:'I',   sign:'positive'},
          {fn:'cos', quad:'I',   sign:'positive'},
          {fn:'sin', quad:'II',  sign:'positive'},
          {fn:'cos', quad:'III', sign:'negative'},
        ];
        const {fn, quad, sign} = choose(cases);
        return {
          latex: `\\text{Sign of }\\${fn}\\theta\\text{ in Quadrant }${quad}=`,
          answer: [sign],
          hint: 'ASTC names the quadrant where each function is positive — what does each letter stand for?',
          step: `\\text{ASTC: Q${quad} → }\\${fn}\\text{ is }${sign}`
        };
      }

      function gen6(){
        // Identify quadrant from sign of sin and cos
        const cases = [
          {cond:'\\sin\\theta<0,\\;\\cos\\theta>0', quad:'IV', step:'x>0,\\;y<0\\Rightarrow\\text{QIV}'},
          {cond:'\\sin\\theta>0,\\;\\cos\\theta<0', quad:'II', step:'x<0,\\;y>0\\Rightarrow\\text{QII}'},
          {cond:'\\sin\\theta<0,\\;\\cos\\theta<0', quad:'III',step:'x<0,\\;y<0\\Rightarrow\\text{QIII}'},
          {cond:'\\sin\\theta>0,\\;\\cos\\theta>0', quad:'I',  step:'x>0,\\;y>0\\Rightarrow\\text{QI}'},
        ];
        const {cond, quad, step} = choose(cases);
        return {
          latex: `${cond}.\\quad\\text{Quadrant}=`,
          answer: [quad, `Q${quad}`],
          hint: 'On the coordinate plane, what sign of x corresponds to cos>0, and what sign of y to sin>0?',
          step
        };
      }

      function gen7(){
        // Evaluate sin/cos at multiples of π/2 → integer answers
        const cases = [
          {fn:'sin', angle:'0',                 ans:'0'},
          {fn:'sin', angle:'\\dfrac{\\pi}{2}',  ans:'1'},
          {fn:'sin', angle:'\\pi',              ans:'0'},
          {fn:'sin', angle:'\\dfrac{3\\pi}{2}', ans:'-1'},
          {fn:'cos', angle:'0',                 ans:'1'},
          {fn:'cos', angle:'\\dfrac{\\pi}{2}',  ans:'0'},
          {fn:'cos', angle:'\\pi',              ans:'-1'},
          {fn:'cos', angle:'\\dfrac{3\\pi}{2}', ans:'0'},
          {fn:'sin', angle:'2\\pi',             ans:'0'},
          {fn:'cos', angle:'2\\pi',             ans:'1'},
        ];
        const {fn, angle, ans} = choose(cases);
        return {
          latex: `\\${fn}\\!\\left(${angle}\\right)=`,
          answer: [ans],
          hint: 'At multiples of π/2 the terminal point lands on an axis — what are those special coordinates?',
          step: `\\text{Terminal point at }${angle}:\\;\\${fn}=${ans}`
        };
      }

      function gen8(){
        // Reference angle in radians → "pi/n" answer
        const cases = [
          {angle:'\\dfrac{2\\pi}{3}',  ref:'pi/3',  refD:'\\dfrac{\\pi}{3}'},
          {angle:'\\dfrac{5\\pi}{6}',  ref:'pi/6',  refD:'\\dfrac{\\pi}{6}'},
          {angle:'\\dfrac{7\\pi}{4}',  ref:'pi/4',  refD:'\\dfrac{\\pi}{4}'},
          {angle:'\\dfrac{5\\pi}{3}',  ref:'pi/3',  refD:'\\dfrac{\\pi}{3}'},
          {angle:'\\dfrac{4\\pi}{3}',  ref:'pi/3',  refD:'\\dfrac{\\pi}{3}'},
          {angle:'\\dfrac{3\\pi}{4}',  ref:'pi/4',  refD:'\\dfrac{\\pi}{4}'},
          {angle:'\\dfrac{7\\pi}{6}',  ref:'pi/6',  refD:'\\dfrac{\\pi}{6}'},
          {angle:'\\dfrac{5\\pi}{4}',  ref:'pi/4',  refD:'\\dfrac{\\pi}{4}'},
        ];
        const {angle, ref, refD} = choose(cases);
        return {
          latex: `\\text{Reference angle of }${angle}=`,
          answer: [ref],
          hint: 'Reference angle: acute angle to the nearest x-axis — which quadrant holds your angle?',
          step: `\\text{Reference angle}=${refD}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_5_3: Unit Circle: Other Trig Functions
  PRECALC_SPIRAL["PC_5_3"] = {
    title: "Unit Circle: Other Trig Functions",
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

      function gen1(){
        // Evaluate tan at unit circle angle → integer, fraction, or sqrt
        const cases = [
          {aStr:'0',                 ans:['0'],                          ansD:'0'},
          {aStr:'\\dfrac{\\pi}{4}', ans:['1'],                          ansD:'1'},
          {aStr:'\\dfrac{\\pi}{3}', ans:['sqrt(3)','sqrt3'],            ansD:'\\sqrt{3}'},
          {aStr:'\\dfrac{\\pi}{6}', ans:['sqrt(3)/3','1/sqrt(3)'],      ansD:'\\dfrac{\\sqrt{3}}{3}'},
          {aStr:'\\pi',             ans:['0'],                          ansD:'0'},
          {aStr:'\\dfrac{3\\pi}{4}',ans:['-1'],                         ansD:'-1'},
          {aStr:'\\dfrac{2\\pi}{3}',ans:['-sqrt(3)','-sqrt3'],           ansD:'-\\sqrt{3}'},
          {aStr:'\\dfrac{5\\pi}{6}',ans:['-sqrt(3)/3','-1/sqrt(3)'],    ansD:'-\\dfrac{\\sqrt{3}}{3}'},
          {aStr:'\\dfrac{5\\pi}{3}',ans:['-sqrt(3)','-sqrt3'],           ansD:'-\\sqrt{3}'},
          {aStr:'\\dfrac{7\\pi}{4}',ans:['-1'],                         ansD:'-1'},
          {aStr:'\\dfrac{5\\pi}{4}',ans:['1'],                          ansD:'1'},
          {aStr:'\\dfrac{7\\pi}{6}',ans:['sqrt(3)/3','1/sqrt(3)'],      ansD:'\\dfrac{\\sqrt{3}}{3}'},
        ];
        const {aStr, ans, ansD} = choose(cases);
        return {
          latex: `\\tan\\!\\left(${aStr}\\right)=`,
          answer: ans,
          hint: 'Tangent equals sin divided by cos — what are sin and cos at this angle?',
          step: `\\tan\\!\\left(${aStr}\\right)=${ansD}`
        };
      }

      function gen2(){
        // Evaluate sec or csc at clean unit circle angles → integer or fraction
        const cases = [
          {fn:'sec', aStr:'\\dfrac{\\pi}{3}',  ans:['2'],             ansD:'2'},
          {fn:'sec', aStr:'\\dfrac{2\\pi}{3}', ans:['-2'],            ansD:'-2'},
          {fn:'sec', aStr:'0',                 ans:['1'],             ansD:'1'},
          {fn:'sec', aStr:'\\pi',             ans:['-1'],             ansD:'-1'},
          {fn:'csc', aStr:'\\dfrac{\\pi}{2}', ans:['1'],              ansD:'1'},
          {fn:'csc', aStr:'\\dfrac{3\\pi}{2}',ans:['-1'],             ansD:'-1'},
          {fn:'csc', aStr:'\\dfrac{\\pi}{6}', ans:['2'],              ansD:'2'},
          {fn:'csc', aStr:'\\dfrac{5\\pi}{6}',ans:['2'],              ansD:'2'},
          {fn:'csc', aStr:'\\dfrac{7\\pi}{6}',ans:['-2'],             ansD:'-2'},
          {fn:'csc', aStr:'\\dfrac{11\\pi}{6}',ans:['-2'],            ansD:'-2'},
          {fn:'sec', aStr:'\\dfrac{4\\pi}{3}',ans:['-2'],             ansD:'-2'},
          {fn:'sec', aStr:'\\dfrac{5\\pi}{3}',ans:['2'],              ansD:'2'},
        ];
        const {fn, aStr, ans, ansD} = choose(cases);
        const recip = fn==='sec' ? 'cos' : 'sin';
        return {
          latex: `\\${fn}\\!\\left(${aStr}\\right)=`,
          answer: ans,
          hint: 'Sec and csc are reciprocals of cos and sin respectively — what is the base function at this angle?',
          step: `\\${fn}=\\dfrac{1}{\\${recip}}\\Rightarrow\\${fn}\\!\\left(${aStr}\\right)=${ansD}`
        };
      }

      function gen3(){
        // Pythagorean identity: 1+tan²θ=sec²θ; given tan, find sec (→ integer)
        const cases = [
          {tanStr:'1',                  tanSq:'1', secSq:'2', sec:'sqrt(2)',     secD:'\\sqrt{2}',     quad:'I'},
          {tanStr:'\\sqrt{3}',          tanSq:'3', secSq:'4', sec:'2',           secD:'2',             quad:'I'},
          {tanStr:'\\dfrac{1}{2}',      tanSq:'1/4',secSq:'5/4',sec:'sqrt(5)/2',secD:'\\dfrac{\\sqrt{5}}{2}',quad:'I'},
          {tanStr:'\\dfrac{3}{4}',      tanSq:'9/16',secSq:'25/16',sec:'5/4',   secD:'\\dfrac{5}{4}', quad:'I'},
        ];
        const {tanStr, secSq, sec, secD, quad} = choose(cases);
        return {
          latex: `\\tan\\theta=${tanStr},\\;\\theta\\text{ in Q${quad}}.\\quad\\sec\\theta=`,
          answer: [sec],
          hint: 'Which Pythagorean identity connects tan²θ and sec²θ, and what sign does sec have in Q' + quad + '?',
          step: `\\sec^2\\theta=1+\\tan^2\\theta=1+(${tanStr})^2=${secSq}+1\\Rightarrow\\sec\\theta=${secD}`
        };
      }

      function gen4(){
        // Given sin and cos in a quadrant, find tan = sin/cos → fraction or integer
        const cases = [
          {sinStr:'\\dfrac{3}{5}',  cosStr:'\\dfrac{4}{5}',  quad:'I',   ans:['3/4'],  ansD:'\\dfrac{3}{4}'},
          {sinStr:'\\dfrac{3}{5}',  cosStr:'-\\dfrac{4}{5}', quad:'II',  ans:['-3/4'], ansD:'-\\dfrac{3}{4}'},
          {sinStr:'-\\dfrac{3}{5}', cosStr:'-\\dfrac{4}{5}', quad:'III', ans:['3/4'],  ansD:'\\dfrac{3}{4}'},
          {sinStr:'-\\dfrac{3}{5}', cosStr:'\\dfrac{4}{5}',  quad:'IV',  ans:['-3/4'], ansD:'-\\dfrac{3}{4}'},
          {sinStr:'\\dfrac{5}{13}', cosStr:'\\dfrac{12}{13}',quad:'I',   ans:['5/12'], ansD:'\\dfrac{5}{12}'},
          {sinStr:'-\\dfrac{5}{13}',cosStr:'\\dfrac{12}{13}',quad:'IV',  ans:['-5/12'],ansD:'-\\dfrac{5}{12}'},
          {sinStr:'\\dfrac{8}{17}', cosStr:'\\dfrac{15}{17}',quad:'I',   ans:['8/15'], ansD:'\\dfrac{8}{15}'},
          {sinStr:'-\\dfrac{8}{17}',cosStr:'-\\dfrac{15}{17}',quad:'III',ans:['8/15'], ansD:'\\dfrac{8}{15}'},
        ];
        const {sinStr, cosStr, quad, ans, ansD} = choose(cases);
        return {
          latex: `\\sin\\theta=${sinStr},\\;\\cos\\theta=${cosStr}.\\quad\\tan\\theta=`,
          answer: ans,
          hint: 'Tangent is defined as a ratio of which two trig functions?',
          step: `\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=\\dfrac{${sinStr}}{${cosStr}}=${ansD}`
        };
      }

      function gen5(){
        // Sign of tan/cot/sec/csc in quadrant → "positive" or "negative"
        const cases = [
          {fn:'tan', quad:'II',  sign:'negative'},
          {fn:'tan', quad:'III', sign:'positive'},
          {fn:'tan', quad:'IV',  sign:'negative'},
          {fn:'cot', quad:'II',  sign:'negative'},
          {fn:'cot', quad:'III', sign:'positive'},
          {fn:'sec', quad:'II',  sign:'negative'},
          {fn:'sec', quad:'III', sign:'negative'},
          {fn:'sec', quad:'IV',  sign:'positive'},
          {fn:'csc', quad:'II',  sign:'positive'},
          {fn:'csc', quad:'III', sign:'negative'},
          {fn:'csc', quad:'IV',  sign:'negative'},
          {fn:'tan', quad:'I',   sign:'positive'},
        ];
        const {fn, quad, sign} = choose(cases);
        return {
          latex: `\\text{Sign of }\\${fn}\\theta\\text{ in Quadrant }${quad}=`,
          answer: [sign],
          hint: 'Use ASTC to identify which functions are positive, and recall that tan=sin/cos — what signs are sin and cos in Q' + quad + '?',
          step: `\\text{ASTC: Q${quad} → }\\${fn}\\text{ is }${sign}`
        };
      }

      function gen6(){
        // Where is tan (or csc) undefined → "pi/2" or "pi" etc.
        const cases = [
          {question:'\\tan\\theta\\text{ undefined nearest to }\\theta=0',       ans:['pi/2'], ansD:'\\dfrac{\\pi}{2}', reason:'\\cos(\\pi/2)=0'},
          {question:'\\tan\\theta\\text{ undefined nearest to }\\theta=\\pi',    ans:['pi/2','3pi/2'], ansD:'\\dfrac{3\\pi}{2}', reason:'\\cos(3\\pi/2)=0'},
          {question:'\\csc\\theta\\text{ undefined at }\\theta=',                ans:['pi','2pi','0'], ansD:'\\pi\\text{ or }0', reason:'\\sin\\pi=0'},
          {question:'\\sec\\theta\\text{ undefined nearest to }\\theta=\\pi/4',  ans:['pi/2'], ansD:'\\dfrac{\\pi}{2}', reason:'\\cos(\\pi/2)=0'},
        ];
        // Simplify to direct questions
        const simpleCases = [
          {latex:'\\tan\\theta\\text{ is undefined when }\\cos\\theta=0.\\;\\text{Smallest positive }\\theta=',
           ans:['pi/2'], step:'\\cos(\\pi/2)=0\\Rightarrow\\tan\\text{ undefined at }\\pi/2'},
          {latex:'\\csc\\theta\\text{ is undefined when }\\sin\\theta=0.\\;\\text{Smallest positive }\\theta>0\\text{ is }\\theta=',
           ans:['pi'],   step:'\\sin(\\pi)=0\\Rightarrow\\csc\\text{ undefined at }\\pi'},
          {latex:'\\sec\\theta\\text{ is undefined when }\\cos\\theta=0.\\;\\text{Second smallest positive }\\theta=',
           ans:['3pi/2'], step:'\\cos(3\\pi/2)=0\\Rightarrow\\sec\\text{ undefined at }3\\pi/2'},
          {latex:'\\cot\\theta\\text{ is undefined when }\\sin\\theta=0.\\;\\text{Smallest positive }\\theta>0=',
           ans:['pi'],   step:'\\sin(\\pi)=0\\Rightarrow\\cot\\text{ undefined at }\\pi'},
        ];
        const {latex, ans, step} = choose(simpleCases);
        return {
          latex,
          answer: ans,
          hint: 'A trig function is undefined when its denominator equals zero — what is the denominator for this function?',
          step
        };
      }

      function gen7(){
        // Evaluate cot at unit circle angle → integer or fraction
        const cases = [
          {aStr:'\\dfrac{\\pi}{4}', ans:['1'],                       ansD:'1'},
          {aStr:'\\dfrac{\\pi}{3}', ans:['sqrt(3)/3','1/sqrt(3)'],   ansD:'\\dfrac{\\sqrt{3}}{3}'},
          {aStr:'\\dfrac{\\pi}{6}', ans:['sqrt(3)','sqrt3'],          ansD:'\\sqrt{3}'},
          {aStr:'\\dfrac{3\\pi}{4}',ans:['-1'],                       ansD:'-1'},
          {aStr:'\\dfrac{2\\pi}{3}',ans:['-sqrt(3)/3','-1/sqrt(3)'], ansD:'-\\dfrac{\\sqrt{3}}{3}'},
          {aStr:'\\dfrac{5\\pi}{6}',ans:['-sqrt(3)','-sqrt3'],         ansD:'-\\sqrt{3}'},
          {aStr:'\\dfrac{5\\pi}{4}',ans:['1'],                        ansD:'1'},
          {aStr:'\\dfrac{4\\pi}{3}',ans:['sqrt(3)/3','1/sqrt(3)'],   ansD:'\\dfrac{\\sqrt{3}}{3}'},
          {aStr:'\\dfrac{7\\pi}{4}',ans:['-1'],                       ansD:'-1'},
        ];
        const {aStr, ans, ansD} = choose(cases);
        return {
          latex: `\\cot\\!\\left(${aStr}\\right)=`,
          answer: ans,
          hint: 'Cotangent is the reciprocal of tangent — what is tan at this angle?',
          step: `\\cot=\\dfrac{\\cos}{\\sin}\\Rightarrow\\cot\\!\\left(${aStr}\\right)=${ansD}`
        };
      }

      function gen8(){
        // Pythagorean identity: given csc, find cot via 1+cot²=csc²
        const cases = [
          {cscStr:'2',           cscSq:'4', cotSq:'3', cot:'sqrt(3)', cotD:'\\sqrt{3}',           quad:'I'},
          {cscStr:'-2',          cscSq:'4', cotSq:'3', cot:'-sqrt(3)',cotD:'-\\sqrt{3}',           quad:'IV'},
          {cscStr:'\\dfrac{5}{4}', cscSq:'25/16', cotSq:'9/16', cot:'3/4', cotD:'\\dfrac{3}{4}', quad:'I'},
          {cscStr:'\\dfrac{13}{5}',cscSq:'169/25',cotSq:'144/25',cot:'12/5',cotD:'\\dfrac{12}{5}',quad:'I'},
        ];
        const {cscStr, cscSq, cotSq, cot, cotD, quad} = choose(cases);
        return {
          latex: `\\csc\\theta=${cscStr},\\;\\theta\\text{ in Q${quad}}.\\quad\\cot\\theta=`,
          answer: [cot],
          hint: 'Which Pythagorean identity relates cot²θ and csc²θ?',
          step: `1+\\cot^2\\theta=\\csc^2\\theta=${cscSq}\\Rightarrow\\cot^2\\theta=${cotSq}\\Rightarrow\\cot\\theta=${cotD}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_5_3b: Triangle Definition of Trig Functions
  PRECALC_SPIRAL["PC_5_3b"] = {
    title: "Triangle Definition of Trig Functions",
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

      function gen1(){
        // 3-4-5 (or scaled) triangle: find sin
        const scale = choose([1, 2, 3]);
        const o3 = 3*scale, a4 = 4*scale, h5 = 5*scale;
        const which = choose(['A','B']);  // angle A: opp=3s, adj=4s; angle B: opp=4s,adj=3s
        const o = which==='A' ? o3 : a4;
        const a = which==='A' ? a4 : o3;
        const sinFrac = which==='A' ? `\\dfrac{3}{5}` : `\\dfrac{4}{5}`;
        const ans = which==='A' ? ['3/5'] : ['4/5'];
        return {
          latex: `\\text{Right triangle: opp}=${o},\\;\\text{adj}=${a},\\;\\text{hyp}=${h5}.\\quad\\sin\\theta=`,
          answer: ans,
          hint: 'SOH: sin equals opposite over what?',
          step: `\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}=\\dfrac{${o}}{${h5}}=${sinFrac}`
        };
      }

      function gen2(){
        // 5-12-13 triangle: find cos or tan → fraction
        const scale = choose([1, 2]);
        const s5=5*scale, s12=12*scale, s13=13*scale;
        const which = choose(['A','B']); // A: opp=5s,adj=12s; B: opp=12s,adj=5s
        const o = which==='A' ? s5 : s12;
        const a = which==='A' ? s12 : s5;
        const fn = choose(['cos','tan']);
        const cosFrac = which==='A' ? `\\dfrac{12}{13}` : `\\dfrac{5}{13}`;
        const tanFrac  = which==='A' ? `\\dfrac{5}{12}`  : `\\dfrac{12}{5}`;
        const cosAns   = which==='A' ? ['12/13'] : ['5/13'];
        const tanAns   = which==='A' ? ['5/12']  : ['12/5'];
        return {
          latex: `\\text{Right triangle: opp}=${o},\\;\\text{adj}=${a},\\;\\text{hyp}=${s13}.\\quad\\${fn}\\theta=`,
          answer: fn==='cos' ? cosAns : tanAns,
          hint: fn==='cos' ? 'CAH: cos equals adjacent over what?' : 'TOA: tan equals opposite over what?',
          step: fn==='cos'
            ? `\\cos\\theta=\\dfrac{\\text{adj}}{\\text{hyp}}=\\dfrac{${a}}{${s13}}=${cosFrac}`
            : `\\tan\\theta=\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{${o}}{${a}}=${tanFrac}`
        };
      }

      function gen3(){
        // Special triangle: evaluate trig function at 30°, 45°, or 60°
        const cases = [
          {fn:'sin', deg:'30', ans:['1/2'],                         ansD:'\\dfrac{1}{2}'},
          {fn:'cos', deg:'30', ans:['sqrt(3)/2','sqrt3/2'],          ansD:'\\dfrac{\\sqrt{3}}{2}'},
          {fn:'tan', deg:'30', ans:['sqrt(3)/3','1/sqrt(3)'],        ansD:'\\dfrac{\\sqrt{3}}{3}'},
          {fn:'sin', deg:'45', ans:['sqrt(2)/2','sqrt2/2'],          ansD:'\\dfrac{\\sqrt{2}}{2}'},
          {fn:'cos', deg:'45', ans:['sqrt(2)/2','sqrt2/2'],          ansD:'\\dfrac{\\sqrt{2}}{2}'},
          {fn:'tan', deg:'45', ans:['1'],                            ansD:'1'},
          {fn:'sin', deg:'60', ans:['sqrt(3)/2','sqrt3/2'],          ansD:'\\dfrac{\\sqrt{3}}{2}'},
          {fn:'cos', deg:'60', ans:['1/2'],                          ansD:'\\dfrac{1}{2}'},
          {fn:'tan', deg:'60', ans:['sqrt(3)','sqrt3'],              ansD:'\\sqrt{3}'},
        ];
        const {fn, deg, ans, ansD} = choose(cases);
        return {
          latex: `\\${fn}(${deg}^\\circ)=`,
          answer: ans,
          hint: 'Which special right triangle (45-45-90 or 30-60-90) has this angle, and what are its exact side ratios?',
          step: `\\${fn}(${deg}^\\circ)=${ansD}`
        };
      }

      function gen4(){
        // Find angle from trig ratio (special values only) → 30, 45, or 60
        const cases = [
          {fn:'sin', valStr:'\\dfrac{1}{2}',             ans:['30'], step:'\\sin(30^\\circ)=\\dfrac{1}{2}'},
          {fn:'cos', valStr:'\\dfrac{1}{2}',             ans:['60'], step:'\\cos(60^\\circ)=\\dfrac{1}{2}'},
          {fn:'tan', valStr:'1',                         ans:['45'], step:'\\tan(45^\\circ)=1'},
          {fn:'sin', valStr:'\\dfrac{\\sqrt{2}}{2}',     ans:['45'], step:'\\sin(45^\\circ)=\\dfrac{\\sqrt{2}}{2}'},
          {fn:'cos', valStr:'\\dfrac{\\sqrt{3}}{2}',     ans:['30'], step:'\\cos(30^\\circ)=\\dfrac{\\sqrt{3}}{2}'},
          {fn:'sin', valStr:'\\dfrac{\\sqrt{3}}{2}',     ans:['60'], step:'\\sin(60^\\circ)=\\dfrac{\\sqrt{3}}{2}'},
          {fn:'tan', valStr:'\\sqrt{3}',                 ans:['60'], step:'\\tan(60^\\circ)=\\sqrt{3}'},
          {fn:'tan', valStr:'\\dfrac{\\sqrt{3}}{3}',     ans:['30'], step:'\\tan(30^\\circ)=\\dfrac{\\sqrt{3}}{3}'},
        ];
        const {fn, valStr, ans, step} = choose(cases);
        return {
          latex: `\\${fn}\\theta=${valStr},\\;0°<\\theta<90°.\\quad\\theta=`,
          answer: ans,
          hint: 'Which special angle (30°, 45°, or 60°) has a trig function matching this exact value?',
          step
        };
      }

      function gen5(){
        // Given cos=a/h and h, find the adjacent side → integer
        const cases = [
          {cos:'3/5',  h:15, a:9},
          {cos:'4/5',  h:20, a:16},
          {cos:'5/13', h:26, a:10},
          {cos:'12/13',h:26, a:24},
          {cos:'8/17', h:34, a:16},
          {cos:'15/17',h:34, a:30},
        ];
        const {cos, h, a} = choose(cases);
        return {
          latex: `\\cos\\theta=${cos},\\;h=${h}.\\quad\\text{Adjacent side}=`,
          answer: [String(a)],
          hint: 'CAH says cos = adjacent/hypotenuse — if you know both the ratio and the hypotenuse, what does that give you?',
          step: `\\text{adj}=\\cos\\theta\\cdot h=${cos}\\cdot${h}=${a}`
        };
      }

      function gen6(){
        // Find hypotenuse from legs using Pythagorean theorem → Pythagorean triple
        const triples = [
          [3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25]
        ];
        const [a, b, c] = choose(triples);
        return {
          latex: `\\text{Right triangle legs: }${a}\\text{ and }${b}.\\quad\\text{Hypotenuse}=`,
          answer: [String(c)],
          hint: 'The Pythagorean theorem relates the three sides of a right triangle — what is the formula?',
          step: `c=\\sqrt{${a}^2+${b}^2}=\\sqrt{${a*a+b*b}}=${c}`
        };
      }

      function gen7(){
        // Evaluate combination of special angle values → fraction or integer
        const cases = [
          {expr:'\\sin(30^\\circ)+\\cos(60^\\circ)',               ans:['1'],    step:'\\dfrac{1}{2}+\\dfrac{1}{2}=1'},
          {expr:'\\sin(60^\\circ)-\\cos(30^\\circ)',               ans:['0'],    step:'\\dfrac{\\sqrt{3}}{2}-\\dfrac{\\sqrt{3}}{2}=0'},
          {expr:'\\tan(45^\\circ)\\cdot\\cos(60^\\circ)',          ans:['1/2'],  step:'1\\cdot\\dfrac{1}{2}=\\dfrac{1}{2}'},
          {expr:'\\sin^2(30^\\circ)+\\cos^2(30^\\circ)',           ans:['1'],    step:'\\left(\\dfrac{1}{2}\\right)^2+\\left(\\dfrac{\\sqrt{3}}{2}\\right)^2=\\dfrac{1}{4}+\\dfrac{3}{4}=1'},
          {expr:'\\cos(45^\\circ)\\cdot\\cos(45^\\circ)',          ans:['1/2'],  step:'\\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{\\sqrt{2}}{2}=\\dfrac{2}{4}=\\dfrac{1}{2}'},
          {expr:'2\\sin(30^\\circ)\\cos(30^\\circ)',               ans:['sqrt(3)/2','sqrt3/2'], step:'2\\cdot\\dfrac{1}{2}\\cdot\\dfrac{\\sqrt{3}}{2}=\\dfrac{\\sqrt{3}}{2}'},
          {expr:'\\tan(30^\\circ)\\cdot\\tan(60^\\circ)',          ans:['1'],    step:'\\dfrac{\\sqrt{3}}{3}\\cdot\\sqrt{3}=1'},
        ];
        const {expr, ans, step} = choose(cases);
        return {
          latex: `${expr}=`,
          answer: ans,
          hint: 'What are the exact values of each trig function at these special angles?',
          step
        };
      }

      function gen8(){
        // Find opposite side from hyp and angle (30° or 60°) → integer
        const cases = [
          {h:10, deg:30, o:5,  fn:'sin', ansD:'\\dfrac{1}{2}', oStr:'5'},
          {h:16, deg:30, o:8,  fn:'sin', ansD:'\\dfrac{1}{2}', oStr:'8'},
          {h:14, deg:30, o:7,  fn:'sin', ansD:'\\dfrac{1}{2}', oStr:'7'},
          {h:20, deg:30, o:10, fn:'sin', ansD:'\\dfrac{1}{2}', oStr:'10'},
          {h:10, deg:60, a:5,  fn:'cos', ansD:'\\dfrac{1}{2}', aStr:'5',  askAdj:true},
          {h:18, deg:60, a:9,  fn:'cos', ansD:'\\dfrac{1}{2}', aStr:'9',  askAdj:true},
          {h:24, deg:60, a:12, fn:'cos', ansD:'\\dfrac{1}{2}', aStr:'12', askAdj:true},
        ];
        const c = choose(cases);
        if (c.askAdj) {
          return {
            latex: `\\text{Right triangle: hyp}=${c.h},\\;\\theta=60^\\circ.\\quad\\text{Adjacent side}=`,
            answer: [String(c.a)],
            hint: 'CAH: cos(60°) = adjacent / hypotenuse — what is cos(60°)?',
            step: `\\text{adj}=h\\cdot\\cos(60^\\circ)=${c.h}\\cdot${c.ansD}=${c.a}`
          };
        } else {
          return {
            latex: `\\text{Right triangle: hyp}=${c.h},\\;\\theta=30^\\circ.\\quad\\text{Opposite side}=`,
            answer: [String(c.o)],
            hint: 'SOH: sin(30°) = opposite / hypotenuse — what is sin(30°)?',
            step: `\\text{opp}=h\\cdot\\sin(30^\\circ)=${c.h}\\cdot${c.ansD}=${c.o}`
          };
        }
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_5_4: Right Triangle Applications
  PRECALC_SPIRAL["PC_5_4"] = {
    title: "Right Triangle Applications",
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

      function gen1(){
        // Elevation 45°: height = horizontal distance → integer
        const d = choose([20, 30, 40, 50, 60, 80, 100]);
        return {
          latex: `\\text{Horizontal distance }${d}\\text{ m, elevation angle }45^\\circ.\\;h=`,
          answer: [String(d)],
          hint: 'At a 45° elevation angle, how does the height compare to the horizontal distance?',
          step: `h=${d}\\cdot\\tan(45^\\circ)=${d}\\cdot1=${d}\\text{ m}`
        };
      }

      function gen2(){
        // Right triangle: hyp=2k, angle=30°, find opposite = k
        const k = choose([5, 6, 7, 8, 9, 10, 12, 15]);
        const h = 2 * k;
        return {
          latex: `\\text{Right triangle: hyp}=${h},\\;\\theta=30^\\circ.\\;\\text{Opposite side}=`,
          answer: [String(k)],
          hint: 'SOH: sin(30°) = opposite / hypotenuse — what is the exact value of sin(30°)?',
          step: `\\text{opp}=${h}\\cdot\\sin(30^\\circ)=${h}\\cdot\\dfrac{1}{2}=${k}`
        };
      }

      function gen3(){
        // Right triangle: hyp=2k, angle=60°, find adjacent = k (cos 60° = 1/2)
        const k = choose([5, 6, 7, 8, 9, 10, 12, 15]);
        const h = 2 * k;
        return {
          latex: `\\text{Right triangle: hyp}=${h},\\;\\theta=60^\\circ.\\;\\text{Adjacent side}=`,
          answer: [String(k)],
          hint: 'CAH: cos(60°) = adjacent / hypotenuse — what is the exact value of cos(60°)?',
          step: `\\text{adj}=${h}\\cdot\\cos(60^\\circ)=${h}\\cdot\\dfrac{1}{2}=${k}`
        };
      }

      function gen4(){
        // Given opposite and 30° angle, find hyp = 2·opp
        const o = choose([4, 5, 6, 7, 8, 9, 10, 12]);
        const h = 2 * o;
        return {
          latex: `\\text{Right triangle: opp}=${o},\\;\\theta=30^\\circ.\\;\\text{Hypotenuse}=`,
          answer: [String(h)],
          hint: 'sin(30°) = opposite / hypotenuse — rearrange to find the hypotenuse from the opposite side.',
          step: `\\sin(30^\\circ)=\\dfrac{\\text{opp}}{\\text{hyp}}\\Rightarrow\\text{hyp}=\\dfrac{${o}}{1/2}=${h}`
        };
      }

      function gen5(){
        // Given adjacent and 60° angle, find hyp = 2·adj (cos 60° = 1/2)
        const a = choose([4, 5, 6, 7, 8, 9, 10, 12]);
        const h = 2 * a;
        return {
          latex: `\\text{Right triangle: adj}=${a},\\;\\theta=60^\\circ.\\;\\text{Hypotenuse}=`,
          answer: [String(h)],
          hint: 'CAH at 60°: cos(60°) = adjacent / hypotenuse — if adj and the ratio are both known, what does that give?',
          step: `\\cos(60^\\circ)=\\dfrac{\\text{adj}}{\\text{hyp}}\\Rightarrow\\text{hyp}=\\dfrac{${a}}{1/2}=${h}`
        };
      }

      function gen6(){
        // Depression 45°: horizontal distance = height → integer
        const h = choose([25, 30, 35, 40, 50, 60, 75, 100]);
        return {
          latex: `\\text{Height }${h}\\text{ m, angle of depression }45^\\circ.\\;\\text{Horizontal distance}=`,
          answer: [String(h)],
          hint: 'Depression and elevation angles form equal alternate interior angles — at 45°, what is tan(45°)?',
          step: `\\tan(45^\\circ)=\\dfrac{h}{d}=1\\Rightarrow d=h=${h}\\text{ m}`
        };
      }

      function gen7(){
        // Kite string and 30°: height = L·sin(30°) = L/2 → integer
        const L = choose([20, 30, 40, 50, 60, 80, 100, 120]);
        const height = L / 2;
        return {
          latex: `\\text{String length }${L}\\text{ m at }30^\\circ\\text{ elevation.}\\;\\text{Height above ground}=`,
          answer: [String(height)],
          hint: 'The string is the hypotenuse and the height is the opposite side — which trig ratio connects them at 30°?',
          step: `h=${L}\\cdot\\sin(30^\\circ)=${L}\\cdot\\dfrac{1}{2}=${height}\\text{ m}`
        };
      }

      function gen8(){
        // Given sin or tan ratio, find the angle (30°, 45°, or 60°) → integer
        const cases = [
          {setup:'\\sin\\theta=\\dfrac{1}{2}',             ans:['30'], step:'\\sin(30^\\circ)=\\dfrac{1}{2}\\Rightarrow\\theta=30^\\circ'},
          {setup:'\\cos\\theta=\\dfrac{1}{2}',             ans:['60'], step:'\\cos(60^\\circ)=\\dfrac{1}{2}\\Rightarrow\\theta=60^\\circ'},
          {setup:'\\tan\\theta=1',                         ans:['45'], step:'\\tan(45^\\circ)=1\\Rightarrow\\theta=45^\\circ'},
          {setup:'\\sin\\theta=\\dfrac{\\sqrt{3}}{2}',     ans:['60'], step:'\\sin(60^\\circ)=\\dfrac{\\sqrt{3}}{2}\\Rightarrow\\theta=60^\\circ'},
          {setup:'\\cos\\theta=\\dfrac{\\sqrt{3}}{2}',     ans:['30'], step:'\\cos(30^\\circ)=\\dfrac{\\sqrt{3}}{2}\\Rightarrow\\theta=30^\\circ'},
          {setup:'\\tan\\theta=\\sqrt{3}',                 ans:['60'], step:'\\tan(60^\\circ)=\\sqrt{3}\\Rightarrow\\theta=60^\\circ'},
        ];
        const {setup, ans, step} = choose(cases);
        return {
          latex: `${setup},\\;0°<\\theta<90°.\\quad\\theta=`,
          answer: ans,
          hint: 'Match this value to the known trig values for the three special angles — which angle gives that ratio?',
          step
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_6_0: Graphing Trigonometric Functions — Overview
  PRECALC_SPIRAL["PC_6_0"] = {
    title: "Graphing Trigonometric Functions \u2014 Overview",
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

      function gen1(){
        // Amplitude: y = A·sin(Bx) + D → |A|
        const A = choose([2, 3, 4, 5, 6, -2, -3, -4, -5]);
        const B = choose([1, 2, 3, 4]);
        const D = choose([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
        const aStr = A < 0 ? `${A}` : String(A);
        const dStr = D >= 0 ? `+${D}` : String(D);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=${aStr}\\${fn}(${B}x)${D===0?'':dStr}.\\quad\\text{Amplitude}=`,
          answer: [String(Math.abs(A))],
          hint: 'Amplitude measures half the total height of the wave — how does that relate to the coefficient in front of sin or cos?',
          step: `|A|=|${A}|=${Math.abs(A)}`
        };
      }

      function gen2(){
        // Period: y = sin(Bx) → 2π/B
        const cases = [
          {B:1,  period:'2\\pi',           ans:['2pi']},
          {B:2,  period:'\\pi',            ans:['pi']},
          {B:3,  period:'\\dfrac{2\\pi}{3}',ans:['2pi/3']},
          {B:4,  period:'\\dfrac{\\pi}{2}', ans:['pi/2']},
          {B:6,  period:'\\dfrac{\\pi}{3}', ans:['pi/3']},
        ];
        const {B, period, ans} = choose(cases);
        const A = choose([1, 2, 3, -1, -2]);
        const aStr = A === 1 ? '' : (A === -1 ? '-' : `${A}`);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=${aStr}\\${fn}(${B}x).\\quad\\text{Period}=`,
          answer: ans,
          hint: 'The period is the horizontal distance for one full cycle — which part of B(x) controls that length?',
          step: `T=\\dfrac{2\\pi}{|B|}=\\dfrac{2\\pi}{${B}}=${period}`
        };
      }

      function gen3(){
        // Phase shift: y = A·sin(B(x - C)) + D → C value
        const cases = [
          {C:'\\dfrac{\\pi}{4}',  cAns:'pi/4',  cSign:'-', expr:'x-\\dfrac{\\pi}{4}'},
          {C:'\\dfrac{\\pi}{3}',  cAns:'pi/3',  cSign:'-', expr:'x-\\dfrac{\\pi}{3}'},
          {C:'\\dfrac{\\pi}{2}',  cAns:'pi/2',  cSign:'-', expr:'x-\\dfrac{\\pi}{2}'},
          {C:'\\dfrac{\\pi}{6}',  cAns:'pi/6',  cSign:'-', expr:'x-\\dfrac{\\pi}{6}'},
          {C:'-\\dfrac{\\pi}{4}', cAns:'-pi/4', cSign:'+', expr:'x+\\dfrac{\\pi}{4}'},
          {C:'-\\dfrac{\\pi}{3}', cAns:'-pi/3', cSign:'+', expr:'x+\\dfrac{\\pi}{3}'},
          {C:'-\\dfrac{\\pi}{2}', cAns:'-pi/2', cSign:'+', expr:'x+\\dfrac{\\pi}{2}'},
        ];
        const {C, cAns, expr} = choose(cases);
        const A = choose([1, 2, 3]);
        const aStr = A === 1 ? '' : String(A);
        const fn = choose(['sin','cos']);
        const D = choose([0, 1, 2, -1, -2]);
        const dStr = D === 0 ? '' : (D > 0 ? `+${D}` : String(D));
        return {
          latex: `y=${aStr}\\${fn}(${expr})${dStr}.\\quad\\text{Phase shift}=`,
          answer: [cAns],
          hint: 'Phase shift is the horizontal offset of the graph — what value of x makes the argument of sin/cos equal to zero?',
          step: `\\text{Argument}=${expr}=0\\Rightarrow x=${C}`
        };
      }

      function gen4(){
        // Vertical shift (midline): y = A·sin(Bx) + D → D
        const A = choose([1, 2, 3, 4, 5]);
        const B = choose([1, 2, 3]);
        const D = choose([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const dStr = D > 0 ? `+${D}` : String(D);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=${A}\\${fn}(${B}x)${dStr}.\\quad\\text{Midline: }y=`,
          answer: [String(D)],
          hint: 'The midline is the horizontal axis the wave oscillates around — which parameter in A·sin(Bx)+D sets that level?',
          step: `\\text{Vertical shift }D=${D}\\Rightarrow\\text{midline }y=${D}`
        };
      }

      function gen5(){
        // Max value: y = A·sin(Bx) + D → D + |A|
        const A = choose([2, 3, 4, 5, 6]);
        const B = choose([1, 2, 3]);
        const D = choose([-3, -2, -1, 0, 1, 2, 3, 4, 5]);
        const fn = choose(['sin','cos']);
        const dStr = D === 0 ? '' : (D > 0 ? `+${D}` : String(D));
        const maxVal = D + A;
        return {
          latex: `y=${A}\\${fn}(${B}x)${dStr}.\\quad\\text{Maximum value}=`,
          answer: [String(maxVal)],
          hint: 'The maximum occurs when sin/cos = 1 — how does that combine with amplitude and vertical shift?',
          step: `\\text{max}=D+|A|=${D}+${A}=${maxVal}`
        };
      }

      function gen6(){
        // Min value: y = A·sin(Bx) + D → D - |A|
        const A = choose([2, 3, 4, 5, 6]);
        const B = choose([1, 2, 3]);
        const D = choose([-1, 0, 1, 2, 3, 4, 5, 6]);
        const fn = choose(['sin','cos']);
        const dStr = D === 0 ? '' : (D > 0 ? `+${D}` : String(D));
        const minVal = D - A;
        return {
          latex: `y=${A}\\${fn}(${B}x)${dStr}.\\quad\\text{Minimum value}=`,
          answer: [String(minVal)],
          hint: 'The minimum occurs when sin/cos = −1 — how does that combine with amplitude and vertical shift?',
          step: `\\text{min}=D-|A|=${D}-${A}=${minVal}`
        };
      }

      function gen7(){
        // Find B given period T → B = 2π/T (integer or fraction)
        const cases = [
          {T:'\\pi',              B:'2',   bAns:['2']},
          {T:'\\dfrac{\\pi}{2}', B:'4',   bAns:['4']},
          {T:'2\\pi',             B:'1',   bAns:['1']},
          {T:'\\dfrac{2\\pi}{3}',B:'3',   bAns:['3']},
          {T:'4\\pi',             B:'\\dfrac{1}{2}', bAns:['1/2']},
          {T:'\\dfrac{\\pi}{3}', B:'6',   bAns:['6']},
        ];
        const {T, B, bAns} = choose(cases);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=A\\${fn}(Bx).\\;\\text{Period}=${T}.\\quad B=`,
          answer: bAns,
          hint: 'Period T and B are inversely related through 2π — if T is known, what operation gives B?',
          step: `B=\\dfrac{2\\pi}{T}=\\dfrac{2\\pi}{${T}}=${B}`
        };
      }

      function gen8(){
        // Applied model: max height = D + A
        const A = choose([10, 15, 20, 25, 30]);
        const D = choose([15, 20, 25, 30, 35, 40]);
        const maxH = D + A;
        const desc = choose([
          {context:'tide model', unit:'m', fn:'\\sin'},
          {context:'Ferris wheel', unit:'m', fn:'\\cos'},
          {context:'temperature model', unit:'°F', fn:'\\sin'},
        ]);
        return {
          latex: `h(t)=${A}\\${desc.fn}(Bt)+${D}.\\quad\\text{Maximum value of }h=`,
          answer: [String(maxH)],
          hint: 'In an applied sinusoidal model, what is the highest output possible given amplitude and midline?',
          step: `\\text{max}=${D}+${A}=${maxH}\\text{ ${desc.unit}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_6_1: Graphing Sine and Cosine — Extended
  PRECALC_SPIRAL["PC_6_1"] = {
    title: "Graphing Sine and Cosine \u2014 Extended",
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

      function gen1(){
        // Factor y = A·sin(Bx + C) to find phase shift = -C/B
        const cases = [
          {expr:'\\sin(2x-\\pi)',        ps:'\\dfrac{\\pi}{2}',  psAns:['pi/2'],   step:'\\sin(2(x-\\pi/2))'},
          {expr:'\\sin(2x+\\pi)',        ps:'-\\dfrac{\\pi}{2}', psAns:['-pi/2'],  step:'\\sin(2(x+\\pi/2))'},
          {expr:'\\sin(3x-\\pi)',        ps:'\\dfrac{\\pi}{3}',  psAns:['pi/3'],   step:'\\sin(3(x-\\pi/3))'},
          {expr:'2\\cos(2x-\\pi/2)',     ps:'\\dfrac{\\pi}{4}',  psAns:['pi/4'],   step:'2\\cos(2(x-\\pi/4))'},
          {expr:'\\sin(4x-\\pi)',        ps:'\\dfrac{\\pi}{4}',  psAns:['pi/4'],   step:'\\sin(4(x-\\pi/4))'},
          {expr:'3\\sin(2x+\\pi/2)',     ps:'-\\dfrac{\\pi}{4}', psAns:['-pi/4'],  step:'3\\sin(2(x+\\pi/4))'},
          {expr:'\\cos(3x+\\pi)',        ps:'-\\dfrac{\\pi}{3}', psAns:['-pi/3'],  step:'\\cos(3(x+\\pi/3))'},
        ];
        const {expr, ps, psAns, step} = choose(cases);
        return {
          latex: `y=${expr}.\\quad\\text{Phase shift}=`,
          answer: psAns,
          hint: 'To read the phase shift from A·sin(Bx+C), rewrite it in the form A·sin(B(x−?)) by factoring out B from the argument.',
          step: `${step}\\Rightarrow\\text{phase shift}=${ps}`
        };
      }

      function gen2(){
        // Amplitude from graph: max and min given → amplitude = (max - min) / 2
        const A = choose([2, 3, 4, 5, 6]);
        const D = choose([-3, -2, -1, 0, 1, 2, 3]);
        const maxV = D + A, minV = D - A;
        return {
          latex: `\\text{Graph max}=${maxV},\\;\\text{min}=${minV}.\\quad\\text{Amplitude}=`,
          answer: [String(A)],
          hint: 'Amplitude is half the total vertical span of the wave — what is half the difference between max and min?',
          step: `A=\\dfrac{\\text{max}-\\text{min}}{2}=\\dfrac{${maxV}-(${minV})}{2}=${A}`
        };
      }

      function gen3(){
        // Midline from graph: max and min given → midline = (max + min) / 2
        const A = choose([2, 3, 4, 5, 6]);
        const D = choose([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
        const maxV = D + A, minV = D - A;
        return {
          latex: `\\text{Graph max}=${maxV},\\;\\text{min}=${minV}.\\quad\\text{Midline: }y=`,
          answer: [String(D)],
          hint: 'The midline is centered halfway between max and min — what is the average of those two values?',
          step: `D=\\dfrac{\\text{max}+\\text{min}}{2}=\\dfrac{${maxV}+(${minV})}{2}=${D}`
        };
      }

      function gen4(){
        // Find B from period (same as §6.0 gen7 but varied)
        const cases = [
          {T:'2',  B:'\\pi',            bAns:['pi']},
          {T:'4',  B:'\\dfrac{\\pi}{2}',bAns:['pi/2']},
          {T:'1',  B:'2\\pi',           bAns:['2pi']},
          {T:'3',  B:'\\dfrac{2\\pi}{3}',bAns:['2pi/3']},
          {T:'8',  B:'\\dfrac{\\pi}{4}',bAns:['pi/4']},
        ];
        const {T, B, bAns} = choose(cases);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=A\\${fn}(Bx).\\;\\text{Period}=${T}.\\quad B=`,
          answer: bAns,
          hint: 'Period T and the coefficient B are connected by 2π — if T is the period, how do you find B?',
          step: `B=\\dfrac{2\\pi}{T}=\\dfrac{2\\pi}{${T}}=${B}`
        };
      }

      function gen5(){
        // Range max of y = A·sin(Bx) + D → D + A (given A, D)
        const A = choose([3, 4, 5, 6, 7]);
        const D = choose([-2, -1, 0, 1, 2, 3, 4, 5]);
        const fn = choose(['sin','cos']);
        const dStr = D === 0 ? '' : (D > 0 ? `+${D}` : String(D));
        return {
          latex: `y=${A}\\${fn}(x)${dStr}.\\quad\\text{Max value}=`,
          answer: [String(D + A)],
          hint: 'The range of A·sin(x)+D runs from D−|A| to D+|A| — what is the upper boundary?',
          step: `\\text{max}=${D}+${A}=${D+A}`
        };
      }

      function gen6(){
        // Period from description: given B = fraction → period = 2π/B
        const cases = [
          {B:'0.5', Bstr:'0.5', period:'4\\pi', ans:['4pi']},
          {B:'2',   Bstr:'2',   period:'\\pi',  ans:['pi']},
          {B:'0.25',Bstr:'0.25',period:'8\\pi', ans:['8pi']},
          {B:'3',   Bstr:'3',   period:'\\dfrac{2\\pi}{3}', ans:['2pi/3']},
        ];
        const {Bstr, period, ans} = choose(cases);
        const fn = choose(['sin','cos']);
        return {
          latex: `y=A\\${fn}(${Bstr}x).\\quad\\text{Period}=`,
          answer: ans,
          hint: 'Period equals 2π divided by the coefficient of x — what is 2π divided by this particular B?',
          step: `T=\\dfrac{2\\pi}{${Bstr}}=${period}`
        };
      }

      function gen7(){
        // Does y = A·sin(Bx) pass through (0, 0)? → yes
        // Does y = A·cos(Bx) pass through (0, A)? → yes, so y-intercept = A
        const fn = choose(['sin','cos']);
        const A = choose([2, 3, 4, 5, 6]);
        const B = choose([1, 2, 3]);
        if (fn === 'sin') {
          return {
            latex: `y=${A}\\sin(${B}x).\\quad\\text{y-intercept}=`,
            answer: ['0', '(0,0)'],
            hint: 'What does sin(0) equal, and how does that give you the y-intercept of A·sin(Bx)?',
            step: `y(0)=${A}\\sin(0)=${A}\\cdot0=0\\Rightarrow(0,0)`
          };
        } else {
          return {
            latex: `y=${A}\\cos(${B}x).\\quad\\text{y-intercept}=`,
            answer: [String(A), `(0,${A})`],
            hint: 'What does cos(0) equal, and how does that give you the y-intercept of A·cos(Bx)?',
            step: `y(0)=${A}\\cos(0)=${A}\\cdot1=${A}\\Rightarrow(0,${A})`
          };
        }
      }

      function gen8(){
        // Write equation from graph: max, min, period given → identify A, D, B, write B value
        const A = choose([2, 3, 4, 5]);
        const D = choose([1, 2, 3, 4, 5]);
        const maxV = D + A, minV = D - A;
        const cases = [
          {T:4, B:'\\dfrac{\\pi}{2}', bAns:['pi/2']},
          {T:6, B:'\\dfrac{\\pi}{3}', bAns:['pi/3']},
          {T:2, B:'\\pi',             bAns:['pi']},
        ];
        const {T, B, bAns} = choose(cases);
        return {
          latex: `\\text{Graph: max}=${maxV},\\;\\text{min}=${minV},\\;\\text{period}=${T}.\\quad B=`,
          answer: bAns,
          hint: 'Given the period, find B — how do you obtain B from the period of a sinusoidal function?',
          step: `A=${A},\\;D=${D},\\;B=\\dfrac{2\\pi}{${T}}=${B}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_6_2: Graphing Other Trig Functions
  PRECALC_SPIRAL["PC_6_2"] = {
    title: "Graphing Other Trig Functions",
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

      function gen1(){
        // Period of y = A·tan(Bx) → π/B
        const cases = [
          {B:1, period:'\\pi',            ans:['pi']},
          {B:2, period:'\\dfrac{\\pi}{2}',ans:['pi/2']},
          {B:3, period:'\\dfrac{\\pi}{3}',ans:['pi/3']},
          {B:4, period:'\\dfrac{\\pi}{4}',ans:['pi/4']},
          {B:6, period:'\\dfrac{\\pi}{6}',ans:['pi/6']},
        ];
        const {B, period, ans} = choose(cases);
        const A = choose([1, 2, 3, -1]);
        const aStr = A === 1 ? '' : (A === -1 ? '-' : String(A));
        return {
          latex: `y=${aStr}\\tan(${B}x).\\quad\\text{Period}=`,
          answer: ans,
          hint: 'The period of tangent differs from sine — what is the base period of tan(x), and how does B scale it?',
          step: `T=\\dfrac{\\pi}{|B|}=\\dfrac{\\pi}{${B}}=${period}`
        };
      }

      function gen2(){
        // First positive VA of y = tan(x) → "pi/2"
        // Or VA of y = tan(Bx) → π/(2B)
        const cases = [
          {expr:'\\tan(x)',  va:'\\dfrac{\\pi}{2}', ans:['pi/2']},
          {expr:'\\tan(2x)', va:'\\dfrac{\\pi}{4}', ans:['pi/4']},
          {expr:'\\tan(3x)', va:'\\dfrac{\\pi}{6}', ans:['pi/6']},
          {expr:'\\tan(4x)', va:'\\dfrac{\\pi}{8}', ans:['pi/8']},
        ];
        const {expr, va, ans} = choose(cases);
        return {
          latex: `y=${expr}.\\quad\\text{Smallest positive VA at }x=`,
          answer: ans,
          hint: 'Tangent is undefined wherever cos = 0 — what is the smallest positive angle at which cos equals zero?',
          step: `\\text{VA where }\\cos(\\text{arg})=0.\\;\\text{First: }x=${va}`
        };
      }

      function gen3(){
        // Period of y = A·csc(Bx) or sec(Bx) → 2π/B
        const cases = [
          {fn:'csc', B:1, period:'2\\pi',            ans:['2pi']},
          {fn:'csc', B:2, period:'\\pi',             ans:['pi']},
          {fn:'sec', B:1, period:'2\\pi',            ans:['2pi']},
          {fn:'sec', B:2, period:'\\pi',             ans:['pi']},
          {fn:'csc', B:0.5, period:'4\\pi',          ans:['4pi']},
          {fn:'sec', B:3, period:'\\dfrac{2\\pi}{3}',ans:['2pi/3']},
        ];
        const {fn, B, period, ans} = choose(cases);
        const bStr = B === 0.5 ? '0.5' : String(B);
        return {
          latex: `y=\\${fn}(${bStr}x).\\quad\\text{Period}=`,
          answer: ans,
          hint: 'Secant and cosecant share their period with their parent functions cos and sin — what is the base period of sin and cos?',
          step: `T=\\dfrac{2\\pi}{|B|}=\\dfrac{2\\pi}{${bStr}}=${period}`
        };
      }

      function gen4(){
        // VA of y = tan(x + C) after factoring: x + C = π/2 → x = π/2 - C
        const cases = [
          {C:'\\dfrac{\\pi}{3}',  va:'\\dfrac{\\pi}{6}',  ans:['pi/6'],  cAns:'pi/3'},
          {C:'\\dfrac{\\pi}{4}',  va:'\\dfrac{\\pi}{4}',  ans:['pi/4'],  cAns:'pi/4'},
          {C:'\\dfrac{\\pi}{6}',  va:'\\dfrac{\\pi}{3}',  ans:['pi/3'],  cAns:'pi/6'},
          {C:'-\\dfrac{\\pi}{6}', va:'\\dfrac{2\\pi}{3}', ans:['2pi/3'], cAns:'-pi/6'},
        ];
        const {C, va, ans} = choose(cases);
        return {
          latex: `y=\\tan\\!\\left(x+${C}\\right).\\quad\\text{Smallest positive VA at }x=`,
          answer: ans,
          hint: 'A horizontal shift moves all VAs by the same offset — what is the unshifted VA of this function closest to the origin?',
          step: `x+${C}=\\dfrac{\\pi}{2}\\Rightarrow x=${va}`
        };
      }

      function gen5(){
        // Increasing or decreasing: tan(Bx) → increasing; -tan(Bx) → decreasing
        const neg = choose([true, false]);
        const B = choose([1, 2, 3]);
        const expr = neg ? `-\\tan(${B}x)` : `\\tan(${B}x)`;
        const ans = neg ? 'decreasing' : 'increasing';
        return {
          latex: `y=${expr}.\\quad\\text{Increasing or decreasing on each period?}`,
          answer: [ans],
          hint: 'Tangent without a negative sign increases through each period — how does a negative coefficient change that?',
          step: `\\tan\\text{ is naturally increasing; negative coefficient flips it → }${ans}`
        };
      }

      function gen6(){
        // VA of y = cot(x) → first positive VA at x = π
        // Or smallest positive: cot(x) VA at x = π (n=1 case)
        const cases = [
          {expr:'\\cot(x)',  va:'\\pi',             ans:['pi']},
          {expr:'\\cot(2x)', va:'\\dfrac{\\pi}{2}', ans:['pi/2']},
          {expr:'\\cot(3x)', va:'\\dfrac{\\pi}{3}', ans:['pi/3']},
        ];
        const {expr, va, ans} = choose(cases);
        return {
          latex: `y=${expr}.\\quad\\text{Smallest positive VA at }x=`,
          answer: ans,
          hint: 'Cotangent has VAs where sin = 0 — what is the smallest positive angle at which sin equals zero?',
          step: `\\text{VA where }\\sin(\\text{arg})=0.\\;\\text{First positive: }x=${va}`
        };
      }

      function gen7(){
        // y = A·csc(x) + D: find the minimum positive value in the range (D + |A|, above midline)
        const A = choose([2, 3, 4, 5]);
        const D = choose([0, 1, 2, 3, 4, 5]);
        const minAbove = D + A;   // csc ≥ 1, so A·csc + D ≥ D + A
        const maxBelow = D - A;   // lower part of range
        const dStr = D === 0 ? '' : `+${D}`;
        return {
          latex: `y=${A}\\csc(x)${dStr}.\\quad\\text{Minimum positive-side output (above midline)}=`,
          answer: [String(minAbove)],
          hint: 'Since |csc x| ≥ 1, what is the smallest value A·csc(x) can take when it is positive?',
          step: `A\\cdot\\csc\\text{ min positive}=${A}\\cdot1+${D}=${minAbove}`
        };
      }

      function gen8(){
        // Period of y = tan(Bx + C) = π/B (shift doesn't change period)
        const cases = [
          {B:2, C:'\\pi/4', period:'\\dfrac{\\pi}{2}', ans:['pi/2']},
          {B:3, C:'\\pi/6', period:'\\dfrac{\\pi}{3}', ans:['pi/3']},
          {B:1, C:'\\pi/3', period:'\\pi',             ans:['pi']},
          {B:4, C:'\\pi/4', period:'\\dfrac{\\pi}{4}', ans:['pi/4']},
        ];
        const {B, C, period, ans} = choose(cases);
        return {
          latex: `y=2\\tan(${B}x+${C}).\\quad\\text{Period}=`,
          answer: ans,
          hint: 'A phase shift changes where the graph starts, but does it affect the width of each period?',
          step: `T=\\dfrac{\\pi}{|B|}=\\dfrac{\\pi}{${B}}=${period}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_6_4: Inverse Trigonometric Functions
  PRECALC_SPIRAL["PC_6_4"] = {
    title: "Inverse Trigonometric Functions",
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

      function gen1(){
        // Evaluate arcsin at standard values → radian answer "pi/n"
        const cases = [
          {val:'\\dfrac{1}{2}',              ans:['pi/6'],  ansD:'\\dfrac{\\pi}{6}'},
          {val:'\\dfrac{\\sqrt{2}}{2}',      ans:['pi/4'],  ansD:'\\dfrac{\\pi}{4}'},
          {val:'\\dfrac{\\sqrt{3}}{2}',      ans:['pi/3'],  ansD:'\\dfrac{\\pi}{3}'},
          {val:'1',                          ans:['pi/2'],  ansD:'\\dfrac{\\pi}{2}'},
          {val:'0',                          ans:['0'],     ansD:'0'},
          {val:'-\\dfrac{1}{2}',             ans:['-pi/6'], ansD:'-\\dfrac{\\pi}{6}'},
          {val:'-\\dfrac{\\sqrt{2}}{2}',     ans:['-pi/4'], ansD:'-\\dfrac{\\pi}{4}'},
          {val:'-\\dfrac{\\sqrt{3}}{2}',     ans:['-pi/3'], ansD:'-\\dfrac{\\pi}{3}'},
          {val:'-1',                         ans:['-pi/2'], ansD:'-\\dfrac{\\pi}{2}'},
        ];
        const {val, ans, ansD} = choose(cases);
        return {
          latex: `\\arcsin\\!\\left(${val}\\right)=`,
          answer: ans,
          hint: 'arcsin outputs the angle in [−π/2, π/2] whose sine equals the input — which special angle has that sine value?',
          step: `\\arcsin\\!\\left(${val}\\right)=${ansD}`
        };
      }

      function gen2(){
        // Evaluate arccos at standard values → radian answer
        const cases = [
          {val:'1',                          ans:['0'],     ansD:'0'},
          {val:'\\dfrac{\\sqrt{3}}{2}',      ans:['pi/6'],  ansD:'\\dfrac{\\pi}{6}'},
          {val:'\\dfrac{\\sqrt{2}}{2}',      ans:['pi/4'],  ansD:'\\dfrac{\\pi}{4}'},
          {val:'\\dfrac{1}{2}',              ans:['pi/3'],  ansD:'\\dfrac{\\pi}{3}'},
          {val:'0',                          ans:['pi/2'],  ansD:'\\dfrac{\\pi}{2}'},
          {val:'-\\dfrac{1}{2}',             ans:['2pi/3'], ansD:'\\dfrac{2\\pi}{3}'},
          {val:'-\\dfrac{\\sqrt{2}}{2}',     ans:['3pi/4'], ansD:'\\dfrac{3\\pi}{4}'},
          {val:'-\\dfrac{\\sqrt{3}}{2}',     ans:['5pi/6'], ansD:'\\dfrac{5\\pi}{6}'},
          {val:'-1',                         ans:['pi'],    ansD:'\\pi'},
        ];
        const {val, ans, ansD} = choose(cases);
        return {
          latex: `\\arccos\\!\\left(${val}\\right)=`,
          answer: ans,
          hint: 'arccos outputs the angle in [0, π] whose cosine equals the input — which special angle has that cosine value?',
          step: `\\arccos\\!\\left(${val}\\right)=${ansD}`
        };
      }

      function gen3(){
        // Evaluate arctan at standard values → radian answer
        const cases = [
          {val:'0',              ans:['0'],      ansD:'0'},
          {val:'1',              ans:['pi/4'],   ansD:'\\dfrac{\\pi}{4}'},
          {val:'\\sqrt{3}',      ans:['pi/3'],   ansD:'\\dfrac{\\pi}{3}'},
          {val:'\\dfrac{\\sqrt{3}}{3}', ans:['pi/6'], ansD:'\\dfrac{\\pi}{6}'},
          {val:'-1',             ans:['-pi/4'],  ansD:'-\\dfrac{\\pi}{4}'},
          {val:'-\\sqrt{3}',     ans:['-pi/3'],  ansD:'-\\dfrac{\\pi}{3}'},
          {val:'-\\dfrac{\\sqrt{3}}{3}',ans:['-pi/6'],ansD:'-\\dfrac{\\pi}{6}'},
        ];
        const {val, ans, ansD} = choose(cases);
        return {
          latex: `\\arctan\\!\\left(${val}\\right)=`,
          answer: ans,
          hint: 'arctan outputs the angle in (−π/2, π/2) whose tangent equals the input — which special angle has that tangent value?',
          step: `\\arctan\\!\\left(${val}\\right)=${ansD}`
        };
      }

      function gen4(){
        // sin(arcsin(x)) = x identity
        const cases = [
          {val:'\\dfrac{3}{5}',  ans:['3/5']},
          {val:'\\dfrac{5}{13}', ans:['5/13']},
          {val:'0.4',            ans:['0.4']},
          {val:'0.7',            ans:['0.7']},
          {val:'-\\dfrac{4}{5}', ans:['-4/5']},
          {val:'\\dfrac{1}{3}',  ans:['1/3']},
        ];
        const {val, ans} = choose(cases);
        return {
          latex: `\\sin(\\arcsin(${val}))=`,
          answer: ans,
          hint: 'sin and arcsin are inverse functions — what does f(f⁻¹(x)) always equal?',
          step: `\\sin(\\arcsin(x))=x\\Rightarrow${val}`
        };
      }

      function gen5(){
        // arcsin(sin(θ)) for θ outside [-π/2, π/2] → reference angle with adjusted sign
        const cases = [
          {theta:'\\dfrac{7\\pi}{6}', sinVal:'-\\dfrac{1}{2}', ans:['-pi/6'], ansD:'-\\dfrac{\\pi}{6}'},
          {theta:'\\dfrac{5\\pi}{6}', sinVal:'\\dfrac{1}{2}',  ans:['pi/6'],  ansD:'\\dfrac{\\pi}{6}'},
          {theta:'\\dfrac{4\\pi}{3}', sinVal:'-\\dfrac{\\sqrt{3}}{2}', ans:['-pi/3'], ansD:'-\\dfrac{\\pi}{3}'},
          {theta:'\\dfrac{2\\pi}{3}', sinVal:'\\dfrac{\\sqrt{3}}{2}',  ans:['pi/3'],  ansD:'\\dfrac{\\pi}{3}'},
          {theta:'\\dfrac{3\\pi}{4}', sinVal:'\\dfrac{\\sqrt{2}}{2}',  ans:['pi/4'],  ansD:'\\dfrac{\\pi}{4}'},
          {theta:'\\dfrac{5\\pi}{4}', sinVal:'-\\dfrac{\\sqrt{2}}{2}', ans:['-pi/4'], ansD:'-\\dfrac{\\pi}{4}'},
        ];
        const {theta, sinVal, ans, ansD} = choose(cases);
        return {
          latex: `\\arcsin\\!\\left(\\sin\\left(${theta}\\right)\\right)=`,
          answer: ans,
          hint: 'arcsin outputs in [−π/2, π/2] — if the angle is outside that range, what angle inside gives the same sine?',
          step: `\\sin(${theta})=${sinVal},\\quad\\arcsin(${sinVal})=${ansD}`
        };
      }

      function gen6(){
        // Composition: cos(arcsin(a/c)) using Pythagorean triple triangle
        const triples = [
          {o:3, h:5, a:4, oStr:'3', hStr:'5', aStr:'4'},
          {o:5, h:13, a:12, oStr:'5', hStr:'13', aStr:'12'},
          {o:8, h:17, a:15, oStr:'8', hStr:'17', aStr:'15'},
          {o:4, h:5, a:3, oStr:'4', hStr:'5', aStr:'3'},
          {o:12, h:13, a:5, oStr:'12', hStr:'13', aStr:'5'},
        ];
        const {o, h, a, oStr, hStr, aStr} = choose(triples);
        return {
          latex: `\\cos\\!\\left(\\arcsin\\dfrac{${oStr}}{${hStr}}\\right)=`,
          answer: [`${aStr}/${hStr}`],
          hint: 'Draw a right triangle with the arcsin argument as opp/hyp — what is the adjacent side, and which trig ratio gives cos?',
          step: `\\text{opp}=${oStr},\\;\\text{hyp}=${hStr}\\Rightarrow\\text{adj}=${aStr}.\\;\\cos=\\dfrac{${aStr}}{${hStr}}`
        };
      }

      function gen7(){
        // Composition: tan(arccos(a/c)) using Pythagorean triple
        const triples = [
          {a:4, h:5, o:3, aStr:'4', hStr:'5', oStr:'3'},
          {a:12, h:13, o:5, aStr:'12', hStr:'13', oStr:'5'},
          {a:15, h:17, o:8, aStr:'15', hStr:'17', oStr:'8'},
          {a:3, h:5, o:4, aStr:'3', hStr:'5', oStr:'4'},
          {a:5, h:13, o:12, aStr:'5', hStr:'13', oStr:'12'},
        ];
        const {a, h, o, aStr, hStr, oStr} = choose(triples);
        return {
          latex: `\\tan\\!\\left(\\arccos\\dfrac{${aStr}}{${hStr}}\\right)=`,
          answer: [`${oStr}/${aStr}`],
          hint: 'Draw a right triangle with the arccos argument as adj/hyp — what is the opposite side, and which ratio gives tan?',
          step: `\\text{adj}=${aStr},\\;\\text{hyp}=${hStr}\\Rightarrow\\text{opp}=${oStr}.\\;\\tan=\\dfrac{${oStr}}{${aStr}}`
        };
      }

      function gen8(){
        // sin(arctan(o/a)) using Pythagorean triple → o/h
        const triples = [
          {o:3, a:4, h:5, oStr:'3', aStr:'4', hStr:'5'},
          {o:5, a:12, h:13, oStr:'5', aStr:'12', hStr:'13'},
          {o:8, a:15, h:17, oStr:'8', aStr:'15', hStr:'17'},
          {o:7, a:24, h:25, oStr:'7', aStr:'24', hStr:'25'},
        ];
        const {o, a, h, oStr, aStr, hStr} = choose(triples);
        return {
          latex: `\\sin\\!\\left(\\arctan\\dfrac{${oStr}}{${aStr}}\\right)=`,
          answer: [`${oStr}/${hStr}`],
          hint: 'Draw a right triangle with the arctan argument as opp/adj — once you have all three sides, what does sin equal?',
          step: `\\text{opp}=${oStr},\\;\\text{adj}=${aStr}\\Rightarrow\\text{hyp}=${hStr}.\\;\\sin=\\dfrac{${oStr}}{${hStr}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_6_5: Triangles with Inverse Trig
  PRECALC_SPIRAL["PC_6_5"] = {
    title: "Triangles with Inverse Trig",
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

      function gen1(){
        // Equal legs → angle = 45°
        const side = choose([3, 4, 5, 6, 7, 8, 10]);
        return {
          latex: `\\text{Right triangle, both legs}=${side}.\\quad\\theta=\\arctan\\!\\left(\\dfrac{${side}}{${side}}\\right)=`,
          answer: ['45', '45deg'],
          hint: 'When both legs are equal, what is the ratio opp/adj, and which special angle has that tangent value?',
          step: `\\arctan(1)=45^\\circ`
        };
      }

      function gen2(){
        // arcsin(1/2) context → 30°
        const h = choose([10, 12, 14, 16, 18, 20]);
        const o = h / 2;
        return {
          latex: `\\text{Right triangle: opp}=${o},\\;\\text{hyp}=${h}.\\quad\\theta=\\arcsin\\!\\left(\\dfrac{${o}}{${h}}\\right)=`,
          answer: ['30', '30deg'],
          hint: 'Which special angle has a sine equal to 1/2, and what is the sine ratio here?',
          step: `\\arcsin\\!\\left(\\dfrac{${o}}{${h}}\\right)=\\arcsin\\!\\left(\\dfrac{1}{2}\\right)=30^\\circ`
        };
      }

      function gen3(){
        // arccos(1/2) context → 60°
        const h = choose([10, 12, 14, 16, 18, 20]);
        const a = h / 2;
        return {
          latex: `\\text{Right triangle: adj}=${a},\\;\\text{hyp}=${h}.\\quad\\theta=\\arccos\\!\\left(\\dfrac{${a}}{${h}}\\right)=`,
          answer: ['60', '60deg'],
          hint: 'Which special angle has a cosine equal to 1/2, and what is the cosine ratio here?',
          step: `\\arccos\\!\\left(\\dfrac{${a}}{${h}}\\right)=\\arccos\\!\\left(\\dfrac{1}{2}\\right)=60^\\circ`
        };
      }

      function gen4(){
        // Composition: tan(arcsin(1/2)) = tan(30°) = sqrt(3)/3
        // and similar clean compositions using special angles
        const cases = [
          {expr:'\\tan(\\arcsin(\\tfrac{1}{2}))',  ans:['sqrt(3)/3','1/sqrt(3)'], step:'\\arcsin(1/2)=30^\\circ,\\;\\tan30^\\circ=\\dfrac{\\sqrt{3}}{3}'},
          {expr:'\\sin(\\arccos(\\tfrac{1}{2}))',  ans:['sqrt(3)/2','sqrt3/2'],   step:'\\arccos(1/2)=60^\\circ,\\;\\sin60^\\circ=\\dfrac{\\sqrt{3}}{2}'},
          {expr:'\\cos(\\arctan(1))',               ans:['sqrt(2)/2','sqrt2/2'],   step:'\\arctan(1)=45^\\circ,\\;\\cos45^\\circ=\\dfrac{\\sqrt{2}}{2}'},
          {expr:'\\sin(\\arctan(1))',               ans:['sqrt(2)/2','sqrt2/2'],   step:'\\arctan(1)=45^\\circ,\\;\\sin45^\\circ=\\dfrac{\\sqrt{2}}{2}'},
          {expr:'\\cos(\\arcsin(\\tfrac{1}{2}))',   ans:['sqrt(3)/2','sqrt3/2'],   step:'\\arcsin(1/2)=30^\\circ,\\;\\cos30^\\circ=\\dfrac{\\sqrt{3}}{2}'},
          {expr:'\\tan(\\arccos(\\tfrac{1}{2}))',   ans:['sqrt(3)','sqrt3'],       step:'\\arccos(1/2)=60^\\circ,\\;\\tan60^\\circ=\\sqrt{3}'},
        ];
        const {expr, ans, step} = choose(cases);
        return {
          latex: `${expr}=`,
          answer: ans,
          hint: 'Which special angle does the inverse trig function return, and what does the outer trig function equal at that angle?',
          step
        };
      }

      function gen5(){
        // sin(arctan(o/a)) using Pythagorean triple → o/h
        const triples = [
          {o:3, a:4, h:5},
          {o:5, a:12, h:13},
          {o:8, a:15, h:17},
          {o:7, a:24, h:25},
          {o:4, a:3, h:5},
        ];
        const {o, a, h} = choose(triples);
        return {
          latex: `\\sin\\!\\left(\\arctan\\dfrac{${o}}{${a}}\\right)=`,
          answer: [`${o}/${h}`],
          hint: 'Draw a right triangle with opp/adj matching the arctan argument — once you have all three sides, what does sin equal?',
          step: `\\text{opp}=${o},\\;\\text{adj}=${a}\\Rightarrow\\text{hyp}=${h}.\\;\\sin=\\dfrac{${o}}{${h}}`
        };
      }

      function gen6(){
        // cos(arctan(o/a)) using Pythagorean triple → a/h
        const triples = [
          {o:3, a:4, h:5},
          {o:5, a:12, h:13},
          {o:8, a:15, h:17},
          {o:7, a:24, h:25},
        ];
        const {o, a, h} = choose(triples);
        return {
          latex: `\\cos\\!\\left(\\arctan\\dfrac{${o}}{${a}}\\right)=`,
          answer: [`${a}/${h}`],
          hint: 'Draw a right triangle matching the arctan ratio — after finding the hypotenuse, what does cos equal?',
          step: `\\text{opp}=${o},\\;\\text{adj}=${a}\\Rightarrow\\text{hyp}=${h}.\\;\\cos=\\dfrac{${a}}{${h}}`
        };
      }

      function gen7(){
        // arctan(-1) or arctan(-sqrt3) in degrees → -45 or -60
        const cases = [
          {val:'-1',         ans:['-45'],  step:'\\arctan(-1)=-45^\\circ'},
          {val:'-\\sqrt{3}', ans:['-60'],  step:'\\arctan(-\\sqrt{3})=-60^\\circ'},
          {val:'\\sqrt{3}',  ans:['60'],   step:'\\arctan(\\sqrt{3})=60^\\circ'},
          {val:'-\\dfrac{\\sqrt{3}}{3}', ans:['-30'], step:'\\arctan(-\\sqrt{3}/3)=-30^\\circ'},
        ];
        const {val, ans, step} = choose(cases);
        return {
          latex: `\\arctan(${val})\\text{ in degrees}=`,
          answer: ans,
          hint: 'arctan is an odd function — a negative input gives a negative angle in (−90°, 90°).',
          step
        };
      }

      function gen8(){
        // Complement: one angle in right triangle + other = 90°
        const A = choose([30, 45, 60]);
        const B = 90 - A;
        return {
          latex: `\\text{Right triangle, one angle }${A}^\\circ.\\quad\\text{Other non-right angle}=`,
          answer: [String(B), `${B}deg`],
          hint: 'The two non-right angles in a right triangle sum to a specific total — what is that total in degrees?',
          step: `90^\\circ-${A}^\\circ=${B}^\\circ`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_7_1: Basic Trig Identities
  PRECALC_SPIRAL["PC_7_1"] = {
    title: "Basic Trig Identities",
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

      function gen1(){
        // cos(-θ) = cos(θ): evaluate at special angle
        const cases = [
          {theta:'-\\dfrac{\\pi}{6}', ans:['sqrt(3)/2','sqrt3/2'], step:'\\cos(-\\pi/6)=\\cos(\\pi/6)=\\dfrac{\\sqrt{3}}{2}'},
          {theta:'-\\dfrac{\\pi}{4}', ans:['sqrt(2)/2','sqrt2/2'], step:'\\cos(-\\pi/4)=\\cos(\\pi/4)=\\dfrac{\\sqrt{2}}{2}'},
          {theta:'-\\dfrac{\\pi}{3}', ans:['1/2'],                 step:'\\cos(-\\pi/3)=\\cos(\\pi/3)=\\dfrac{1}{2}'},
          {theta:'-\\dfrac{2\\pi}{3}',ans:['-1/2'],                step:'\\cos(-2\\pi/3)=\\cos(2\\pi/3)=-\\dfrac{1}{2}'},
          {theta:'-\\dfrac{3\\pi}{4}',ans:['-sqrt(2)/2','-sqrt2/2'],step:'\\cos(-3\\pi/4)=\\cos(3\\pi/4)=-\\dfrac{\\sqrt{2}}{2}'},
        ];
        const {theta, ans, step} = choose(cases);
        return {
          latex: `\\cos\\!(${theta})=`,
          answer: ans,
          hint: 'Cosine is an even function — how does that affect cos(−θ) compared to cos(θ)?',
          step
        };
      }

      function gen2(){
        // sin(-θ) = -sin(θ): evaluate at special angle
        const cases = [
          {theta:'-\\dfrac{\\pi}{6}', ans:['-1/2'],                  step:'\\sin(-\\pi/6)=-\\sin(\\pi/6)=-\\dfrac{1}{2}'},
          {theta:'-\\dfrac{\\pi}{4}', ans:['-sqrt(2)/2','-sqrt2/2'], step:'\\sin(-\\pi/4)=-\\sin(\\pi/4)=-\\dfrac{\\sqrt{2}}{2}'},
          {theta:'-\\dfrac{\\pi}{3}', ans:['-sqrt(3)/2','-sqrt3/2'], step:'\\sin(-\\pi/3)=-\\sin(\\pi/3)=-\\dfrac{\\sqrt{3}}{2}'},
          {theta:'-\\dfrac{\\pi}{2}', ans:['-1'],                    step:'\\sin(-\\pi/2)=-\\sin(\\pi/2)=-1'},
          {theta:'-\\dfrac{5\\pi}{6}',ans:['-1/2'],                  step:'\\sin(-5\\pi/6)=-\\sin(5\\pi/6)=-\\dfrac{1}{2}'},
        ];
        const {theta, ans, step} = choose(cases);
        return {
          latex: `\\sin\\!(${theta})=`,
          answer: ans,
          hint: 'Sine is an odd function — how does a negative input change the output compared to the positive angle?',
          step
        };
      }

      function gen3(){
        // tan(-θ) = -tan(θ): evaluate at special angle
        const cases = [
          {theta:'-\\dfrac{\\pi}{6}', ans:['-sqrt(3)/3','-1/sqrt(3)','-sqrt3/3'], step:'\\tan(-\\pi/6)=-\\tan(\\pi/6)=-\\dfrac{\\sqrt{3}}{3}'},
          {theta:'-\\dfrac{\\pi}{4}', ans:['-1'],                               step:'\\tan(-\\pi/4)=-\\tan(\\pi/4)=-1'},
          {theta:'-\\dfrac{\\pi}{3}', ans:['-sqrt(3)','-sqrt3'],                step:'\\tan(-\\pi/3)=-\\tan(\\pi/3)=-\\sqrt{3}'},
          {theta:'-\\dfrac{5\\pi}{6}',ans:['sqrt(3)/3','1/sqrt(3)','sqrt3/3'], step:'\\tan(-5\\pi/6)=-\\tan(5\\pi/6)=\\dfrac{\\sqrt{3}}{3}'},
        ];
        const {theta, ans, step} = choose(cases);
        return {
          latex: `\\tan\\!(${theta})=`,
          answer: ans,
          hint: 'Tangent is an odd function — how does a negative input change the sign of the output?',
          step
        };
      }

      function gen4(){
        // sin^2(θ) = 1 - cos^2(θ): given cos(θ), find sin^2(θ)
        const cases = [
          {cos:'\\dfrac{3}{5}', cos2:'9/25', sin2:'16/25'},
          {cos:'\\dfrac{4}{5}', cos2:'16/25', sin2:'9/25'},
          {cos:'\\dfrac{5}{13}',cos2:'25/169',sin2:'144/169'},
          {cos:'\\dfrac{12}{13}',cos2:'144/169',sin2:'25/169'},
          {cos:'\\dfrac{8}{17}',cos2:'64/289', sin2:'225/289'},
          {cos:'\\dfrac{15}{17}',cos2:'225/289',sin2:'64/289'},
        ];
        const {cos, cos2, sin2} = choose(cases);
        return {
          latex: `\\cos\\theta=${cos}.\\quad\\sin^2\\!\\theta=`,
          answer: [sin2],
          hint: 'The Pythagorean identity connects sin² and cos² — knowing cos(θ) gives you cos²(θ), which gives sin²(θ)?',
          step: `\\sin^2\\!\\theta=1-\\cos^2\\!\\theta=1-${cos2}=${sin2}`
        };
      }

      function gen5(){
        // sec^2(θ) = 1 + tan^2(θ): given tan(θ), find sec^2(θ)
        const cases = [
          {tan:'\\dfrac{3}{4}', tan2:'9/16',   sec2:'25/16'},
          {tan:'\\dfrac{4}{3}', tan2:'16/9',   sec2:'25/9'},
          {tan:'\\dfrac{5}{12}',tan2:'25/144', sec2:'169/144'},
          {tan:'\\dfrac{12}{5}',tan2:'144/25', sec2:'169/25'},
          {tan:'\\dfrac{7}{24}',tan2:'49/576', sec2:'625/576'},
          {tan:'2',             tan2:'4',      sec2:'5'},
        ];
        const {tan, tan2, sec2} = choose(cases);
        return {
          latex: `\\tan\\theta=${tan}.\\quad\\sec^2\\!\\theta=`,
          answer: [sec2],
          hint: 'One Pythagorean identity links sec² and tan² — which form connects those two functions?',
          step: `\\sec^2\\!\\theta=1+\\tan^2\\!\\theta=1+${tan2}=${sec2}`
        };
      }

      function gen6(){
        // csc^2(θ) = 1 + cot^2(θ): given cot(θ), find csc^2(θ)
        const cases = [
          {cot:'\\dfrac{4}{3}', cot2:'16/9',   csc2:'25/9'},
          {cot:'\\dfrac{3}{4}', cot2:'9/16',   csc2:'25/16'},
          {cot:'\\dfrac{12}{5}',cot2:'144/25', csc2:'169/25'},
          {cot:'\\dfrac{5}{12}',cot2:'25/144', csc2:'169/144'},
          {cot:'\\dfrac{24}{7}',cot2:'576/49', csc2:'625/49'},
          {cot:'3',             cot2:'9',      csc2:'10'},
        ];
        const {cot, cot2, csc2} = choose(cases);
        return {
          latex: `\\cot\\theta=${cot}.\\quad\\csc^2\\!\\theta=`,
          answer: [csc2],
          hint: 'One Pythagorean identity links csc² and cot² — which form connects those two functions?',
          step: `\\csc^2\\!\\theta=1+\\cot^2\\!\\theta=1+${cot2}=${csc2}`
        };
      }

      function gen7(){
        // Given sin(θ) in QI (Pythagorean triple), find cos(θ)
        const triples = [
          {s:'3/5', c:'4/5'},
          {s:'4/5', c:'3/5'},
          {s:'5/13', c:'12/13'},
          {s:'12/13', c:'5/13'},
          {s:'8/17', c:'15/17'},
          {s:'15/17', c:'8/17'},
          {s:'7/25', c:'24/25'},
        ];
        const {s, c} = choose(triples);
        const [sn,sd] = s.split('/');
        return {
          latex: `\\sin\\theta=\\dfrac{${sn}}{${sd}},\\;\\theta\\text{ in QI}.\\quad\\cos\\theta=`,
          answer: [c],
          hint: 'Use sin²(θ)+cos²(θ)=1 — once you know sin²(θ), what does that give cos(θ) in QI?',
          step: `\\cos\\theta=\\sqrt{1-\\left(\\dfrac{${sn}}{${sd}}\\right)^2}=\\dfrac{${c.split('/')[0]}}{${c.split('/')[1]}}`
        };
      }

      function gen8(){
        // Given tan(θ) = opp/adj in QI, find sin(θ) using Pythagorean triple
        const triples = [
          {o:3, a:4, h:5},
          {o:4, a:3, h:5},
          {o:5, a:12, h:13},
          {o:12, a:5, h:13},
          {o:8, a:15, h:17},
          {o:7, a:24, h:25},
        ];
        const {o, a, h} = choose(triples);
        return {
          latex: `\\tan\\theta=\\dfrac{${o}}{${a}},\\;\\theta\\text{ in QI}.\\quad\\sin\\theta=`,
          answer: [`${o}/${h}`],
          hint: 'Draw a right triangle with opp/adj equal to the tangent ratio — once the hypotenuse is found, what does sin equal?',
          step: `\\text{opp}=${o},\\;\\text{adj}=${a}\\Rightarrow\\text{hyp}=${h}.\\;\\sin\\theta=\\dfrac{${o}}{${h}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_7_2: Sum and Difference Identities
  PRECALC_SPIRAL["PC_7_2"] = {
    title: "Sum and Difference Identities",
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

      function gen1(){
        // sin(A)cos(B) + cos(A)sin(B) = sin(A+B): give A and B in degrees, ask for A+B
        const cases = [
          {A:45, B:30, sum:75},
          {A:30, B:45, sum:75},
          {A:60, B:15, sum:75},
          {A:30, B:60, sum:90},
          {A:45, B:45, sum:90},
          {A:15, B:60, sum:75},
          {A:60, B:30, sum:90},
        ];
        const {A, B, sum} = choose(cases);
        return {
          latex: `\\sin(${A}^\\circ)\\cos(${B}^\\circ)+\\cos(${A}^\\circ)\\sin(${B}^\\circ)=\\sin(\\square^\\circ).\\quad\\square=`,
          answer: [String(sum)],
          hint: 'The pattern sin(A)cos(B)+cos(A)sin(B) matches the sine sum formula — what single angle does it equal?',
          step: `\\sin(${A}^\\circ+${B}^\\circ)=\\sin(${sum}^\\circ)`
        };
      }

      function gen2(){
        // cos(A)cos(B) - sin(A)sin(B) = cos(A+B)
        const cases = [
          {A:45, B:30, sum:75},
          {A:30, B:45, sum:75},
          {A:60, B:15, sum:75},
          {A:30, B:60, sum:90},
          {A:45, B:45, sum:90},
        ];
        const {A, B, sum} = choose(cases);
        return {
          latex: `\\cos(${A}^\\circ)\\cos(${B}^\\circ)-\\sin(${A}^\\circ)\\sin(${B}^\\circ)=\\cos(\\square^\\circ).\\quad\\square=`,
          answer: [String(sum)],
          hint: 'The pattern cos(A)cos(B)−sin(A)sin(B) matches the cosine sum formula — what single angle does it equal?',
          step: `\\cos(${A}^\\circ+${B}^\\circ)=\\cos(${sum}^\\circ)`
        };
      }

      function gen3(){
        // cos(A)cos(B) + sin(A)sin(B) = cos(A-B): ask for |A-B|
        const cases = [
          {A:75, B:30, diff:45},
          {A:90, B:45, diff:45},
          {A:75, B:45, diff:30},
          {A:60, B:30, diff:30},
          {A:90, B:60, diff:30},
          {A:105, B:60, diff:45},
        ];
        const {A, B, diff} = choose(cases);
        return {
          latex: `\\cos(${A}^\\circ)\\cos(${B}^\\circ)+\\sin(${A}^\\circ)\\sin(${B}^\\circ)=\\cos(\\square^\\circ).\\quad\\square=`,
          answer: [String(diff)],
          hint: 'The pattern cos(A)cos(B)+sin(A)sin(B) matches the cosine difference formula — what single angle does it equal?',
          step: `\\cos(${A}^\\circ-${B}^\\circ)=\\cos(${diff}^\\circ)`
        };
      }

      function gen4(){
        // Condense sin(Ax)cos(Bx) - cos(Ax)sin(Bx) = sin((A-B)x): ask for coefficient A-B
        const cases = [
          {A:5, B:2, diff:3},
          {A:7, B:3, diff:4},
          {A:4, B:1, diff:3},
          {A:6, B:2, diff:4},
          {A:8, B:5, diff:3},
          {A:9, B:4, diff:5},
        ];
        const {A, B, diff} = choose(cases);
        return {
          latex: `\\sin(${A}x)\\cos(${B}x)-\\cos(${A}x)\\sin(${B}x)=\\sin(\\square\\cdot x).\\quad\\square=`,
          answer: [String(diff)],
          hint: 'The pattern sin(A)cos(B)−cos(A)sin(B) = sin(A−B) — what is A minus B here?',
          step: `\\sin((${A}-${B})x)=\\sin(${diff}x)`
        };
      }

      function gen5(){
        // Condense cos(Ax)cos(Bx) - sin(Ax)sin(Bx) = cos((A+B)x): ask for A+B
        const cases = [
          {A:3, B:2, sum:5},
          {A:4, B:3, sum:7},
          {A:2, B:1, sum:3},
          {A:5, B:2, sum:7},
          {A:3, B:4, sum:7},
          {A:1, B:2, sum:3},
        ];
        const {A, B, sum} = choose(cases);
        return {
          latex: `\\cos(${A}x)\\cos(${B}x)-\\sin(${A}x)\\sin(${B}x)=\\cos(\\square\\cdot x).\\quad\\square=`,
          answer: [String(sum)],
          hint: 'The pattern cos(A)cos(B)−sin(A)sin(B) = cos(A+B) — what is A plus B here?',
          step: `\\cos((${A}+${B})x)=\\cos(${sum}x)`
        };
      }

      function gen6(){
        // Condense cos(Ax)cos(Bx) + sin(Ax)sin(Bx) = cos((A-B)x): ask for |A-B|
        const cases = [
          {A:5, B:2, diff:3},
          {A:6, B:3, diff:3},
          {A:7, B:4, diff:3},
          {A:8, B:5, diff:3},
          {A:5, B:1, diff:4},
          {A:6, B:2, diff:4},
        ];
        const {A, B, diff} = choose(cases);
        return {
          latex: `\\cos(${A}x)\\cos(${B}x)+\\sin(${A}x)\\sin(${B}x)=\\cos(\\square\\cdot x).\\quad\\square=`,
          answer: [String(diff)],
          hint: 'The pattern cos(A)cos(B)+sin(A)sin(B) = cos(A−B) — what is A minus B here?',
          step: `\\cos((${A}-${B})x)=\\cos(${diff}x)`
        };
      }

      function gen7(){
        // Cofunction: sin(π/2 - x) = cos(x). Evaluate at special angle.
        const cases = [
          {x:'\\dfrac{\\pi}{6}', val:'\\dfrac{\\sqrt{3}}{2}', ans:['sqrt(3)/2','sqrt3/2']},
          {x:'\\dfrac{\\pi}{4}', val:'\\dfrac{\\sqrt{2}}{2}', ans:['sqrt(2)/2','sqrt2/2']},
          {x:'\\dfrac{\\pi}{3}', val:'\\dfrac{1}{2}',         ans:['1/2']},
          {x:'\\dfrac{\\pi}{2}', val:'0',                     ans:['0']},
          {x:'\\dfrac{2\\pi}{3}',val:'-\\dfrac{1}{2}',        ans:['-1/2']},
        ];
        const {x, val, ans} = choose(cases);
        return {
          latex: `\\sin\\!\\left(\\dfrac{\\pi}{2}-${x}\\right)=`,
          answer: ans,
          hint: 'A cofunction identity says sin(π/2−x) equals one of the other trig functions of x — which one?',
          step: `\\sin\\!\\left(\\dfrac{\\pi}{2}-${x}\\right)=\\cos\\!\\left(${x}\\right)=${val}`
        };
      }

      function gen8(){
        // cos(π + x) = -cos(x). Evaluate at special angle.
        const cases = [
          {x:'\\dfrac{\\pi}{6}', negval:'-\\dfrac{\\sqrt{3}}{2}', ans:['-sqrt(3)/2','-sqrt3/2']},
          {x:'\\dfrac{\\pi}{4}', negval:'-\\dfrac{\\sqrt{2}}{2}', ans:['-sqrt(2)/2','-sqrt2/2']},
          {x:'\\dfrac{\\pi}{3}', negval:'-\\dfrac{1}{2}',         ans:['-1/2']},
          {x:'\\dfrac{\\pi}{2}', negval:'0',                      ans:['0']},
          {x:'0',                negval:'-1',                     ans:['-1']},
        ];
        const {x, negval, ans} = choose(cases);
        return {
          latex: `\\cos\\!\\left(\\pi+${x}\\right)=`,
          answer: ans,
          hint: 'cos(π + x) can be expanded using the sum identity — what are the values of cos(π) and sin(π)?',
          step: `\\cos(\\pi+${x})=-\\cos(${x})=${negval}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_7_3: Double and Half Angle Identities
  PRECALC_SPIRAL["PC_7_3"] = {
    title: "Double and Half Angle Identities",
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

      function gen3(){
        // Evaluate sin(2x) at a special angle
        const cases = [
          {x:'\\dfrac{\\pi}{6}', ans:['sqrt(3)/2','sqrt3/2'], step:'2\\sin(\\pi/6)\\cos(\\pi/6)=2\\cdot\\tfrac{1}{2}\\cdot\\tfrac{\\sqrt{3}}{2}=\\dfrac{\\sqrt{3}}{2}'},
          {x:'\\dfrac{\\pi}{4}', ans:['1'],                   step:'2\\sin(\\pi/4)\\cos(\\pi/4)=2\\cdot\\tfrac{\\sqrt{2}}{2}\\cdot\\tfrac{\\sqrt{2}}{2}=1'},
          {x:'\\dfrac{\\pi}{3}', ans:['sqrt(3)/2','sqrt3/2'], step:'2\\sin(\\pi/3)\\cos(\\pi/3)=2\\cdot\\tfrac{\\sqrt{3}}{2}\\cdot\\tfrac{1}{2}=\\dfrac{\\sqrt{3}}{2}'},
          {x:'\\dfrac{\\pi}{2}', ans:['0'],                   step:'2\\sin(\\pi/2)\\cos(\\pi/2)=2\\cdot1\\cdot0=0'},
        ];
        const {x, ans, step} = choose(cases);
        return {
          latex: `\\sin\\!(2\\cdot${x})=`,
          answer: ans,
          hint: 'Apply sin(2x) = 2sin(x)cos(x) at this angle — what are sin and cos at this special value?',
          step
        };
      }

      function gen4(){
        // Evaluate cos(2x) at a special angle
        const cases = [
          {x:'\\dfrac{\\pi}{6}', ans:['1/2'],  step:'\\cos^2(\\pi/6)-\\sin^2(\\pi/6)=\\tfrac{3}{4}-\\tfrac{1}{4}=\\dfrac{1}{2}'},
          {x:'\\dfrac{\\pi}{4}', ans:['0'],    step:'\\cos^2(\\pi/4)-\\sin^2(\\pi/4)=\\tfrac{1}{2}-\\tfrac{1}{2}=0'},
          {x:'\\dfrac{\\pi}{3}', ans:['-1/2'], step:'\\cos^2(\\pi/3)-\\sin^2(\\pi/3)=\\tfrac{1}{4}-\\tfrac{3}{4}=-\\dfrac{1}{2}'},
          {x:'\\dfrac{\\pi}{2}', ans:['-1'],   step:'\\cos^2(\\pi/2)-\\sin^2(\\pi/2)=0-1=-1'},
        ];
        const {x, ans, step} = choose(cases);
        return {
          latex: `\\cos\\!(2\\cdot${x})=`,
          answer: ans,
          hint: 'Apply cos(2x) = cos²(x)−sin²(x) at this angle — what are cos and sin at this special value?',
          step
        };
      }

      function gen1(){
        // sin(2x) from Pythagorean triple: sin(x)=o/h, cos(x)=a/h → sin(2x) = 2·o·a/h²
        const triples = [
          {o:3, a:4, h:5, sin2x:'24/25'},
          {o:4, a:3, h:5, sin2x:'24/25'},
          {o:5, a:12, h:13, sin2x:'120/169'},
          {o:8, a:15, h:17, sin2x:'240/289'},
          {o:7, a:24, h:25, sin2x:'336/625'},
        ];
        const {o, a, h, sin2x} = choose(triples);
        return {
          latex: `\\sin x=\\dfrac{${o}}{${h}},\\;\\cos x=\\dfrac{${a}}{${h}}.\\quad\\sin(2x)=`,
          answer: [sin2x],
          hint: 'Double angle formula: sin(2x) = 2sin(x)cos(x) — multiply the two given values by 2.',
          step: `2\\cdot\\dfrac{${o}}{${h}}\\cdot\\dfrac{${a}}{${h}}=\\dfrac{${2*o*a}}{${h*h}}=${sin2x}`
        };
      }

      function gen2(){
        // cos(2x) from Pythagorean triple: cos²x - sin²x
        const triples = [
          {o:3, a:4, h:5, cos2x:'7/25'},
          {o:4, a:3, h:5, cos2x:'7/25'},
          {o:5, a:12, h:13, cos2x:'119/169'},
          {o:12, a:5, h:13, cos2x:'-119/169'},
          {o:8, a:15, h:17, cos2x:'161/289'},
          {o:15, a:8, h:17, cos2x:'-161/289'},
        ];
        const {o, a, h, cos2x} = choose(triples);
        return {
          latex: `\\sin x=\\dfrac{${o}}{${h}},\\;\\cos x=\\dfrac{${a}}{${h}}.\\quad\\cos(2x)=`,
          answer: [cos2x],
          hint: 'Double angle formula: cos(2x) = cos²(x)−sin²(x) — square each value and subtract.',
          step: `\\left(\\dfrac{${a}}{${h}}\\right)^2-\\left(\\dfrac{${o}}{${h}}\\right)^2=\\dfrac{${a*a}-${o*o}}{${h*h}}=${cos2x}`
        };
      }

      function gen5(){
        // cos(2x) using alternate form 1 - 2sin²x
        const triples = [
          {o:3, h:5, sin2:'9/25', cos2x:'7/25'},
          {o:4, h:5, sin2:'16/25', cos2x:'-7/25'},
          {o:5, h:13, sin2:'25/169', cos2x:'119/169'},
          {o:12, h:13, sin2:'144/169', cos2x:'-119/169'},
          {o:8, h:17, sin2:'64/289', cos2x:'161/289'},
        ];
        const {o, h, sin2, cos2x} = choose(triples);
        return {
          latex: `\\sin x=\\dfrac{${o}}{${h}}.\\quad\\cos(2x)=1-2\\sin^2x=`,
          answer: [cos2x],
          hint: 'cos(2x) = 1−2sin²(x) — once you square the given sin value, what does the formula give?',
          step: `1-2\\cdot\\dfrac{${o*o}}{${h*h}}=1-\\dfrac{${2*o*o}}{${h*h}}=${cos2x}`
        };
      }

      function gen6(){
        // tan(2x) = 2tan(x) / (1 - tan²(x)): clean fraction answers
        const cases = [
          {tanStr:'\\dfrac{1}{2}', tan:0.5, tan2:'4/3'},
          {tanStr:'\\dfrac{1}{3}', tan:1/3, tan2:'3/4'},
          {tanStr:'2',             tan:2,   tan2:'-4/3'},
          {tanStr:'3',             tan:3,   tan2:'-3/4'},
          {tanStr:'\\dfrac{2}{3}', tan:2/3, tan2:'12/5'},
          {tanStr:'\\dfrac{3}{4}', tan:0.75,tan2:'24/7'},
        ];
        const {tanStr, tan2} = choose(cases);
        return {
          latex: `\\tan x=${tanStr}.\\quad\\tan(2x)=`,
          answer: [tan2],
          hint: 'tan(2x) = 2tan(x)/(1−tan²(x)) — with the given tan value plugged in, what does the fraction simplify to?',
          step: `\\tan(2x)=\\dfrac{2\\cdot${tanStr}}{1-${tanStr}^2}=${tan2}`
        };
      }

      function gen7(){
        // Half angle sin(x/2): given cos(x), find sin(x/2) where result is clean
        const cases = [
          {cosStr:'\\dfrac{1}{2}',  cosVal:0.5,  quadInfo:'x\\text{ in QI}', sign:'+', ans:['1/2'],          step:'\\sqrt{\\dfrac{1-1/2}{2}}=\\sqrt{\\dfrac{1}{4}}=\\dfrac{1}{2}'},
          {cosStr:'-\\dfrac{1}{2}', cosVal:-0.5, quadInfo:'x\\text{ in QII}',sign:'+', ans:['sqrt(3)/2','sqrt3/2'],step:'\\sqrt{\\dfrac{1+1/2}{2}}=\\sqrt{\\dfrac{3}{4}}=\\dfrac{\\sqrt{3}}{2}'},
          {cosStr:'0',              cosVal:0,    quadInfo:'x\\text{ in QI}',  sign:'+', ans:['sqrt(2)/2','sqrt2/2'],step:'\\sqrt{\\dfrac{1-0}{2}}=\\sqrt{\\dfrac{1}{2}}=\\dfrac{\\sqrt{2}}{2}'},
          {cosStr:'\\dfrac{\\sqrt{3}}{2}', cosVal:0.866, quadInfo:'x\\text{ in QI}', sign:'+', ans:['sqrt(2-sqrt(3))/2'], step:'\\sqrt{\\dfrac{1-\\sqrt{3}/2}{2}}=\\sqrt{\\dfrac{2-\\sqrt{3}}{4}}'},
        ];
        // Only use the clean cases (first three)
        const cleanCases = cases.slice(0,3);
        const {cosStr, quadInfo, ans, step} = choose(cleanCases);
        return {
          latex: `\\cos x=${cosStr},\\;${quadInfo},\\;\\tfrac{x}{2}\\text{ in QI}.\\quad\\sin\\!\\dfrac{x}{2}=`,
          answer: ans,
          hint: 'sin(x/2) = +√((1−cos x)/2) — with the given cos value, what does the expression under the radical become?',
          step
        };
      }

      function gen8(){
        // Half angle cos(x/2): given cos(x), find cos(x/2) where result is clean
        const cases = [
          {cosStr:'\\dfrac{1}{2}',  quadInfo:'x\\text{ in QI}', ans:['sqrt(3)/2','sqrt3/2'], step:'\\sqrt{\\dfrac{1+1/2}{2}}=\\sqrt{\\dfrac{3}{4}}=\\dfrac{\\sqrt{3}}{2}'},
          {cosStr:'-\\dfrac{1}{2}', quadInfo:'x\\text{ in QII}',ans:['1/2'],                 step:'\\sqrt{\\dfrac{1-1/2}{2}}=\\sqrt{\\dfrac{1}{4}}=\\dfrac{1}{2}'},
          {cosStr:'0',              quadInfo:'x\\text{ in QI}',  ans:['sqrt(2)/2','sqrt2/2'],step:'\\sqrt{\\dfrac{1+0}{2}}=\\sqrt{\\dfrac{1}{2}}=\\dfrac{\\sqrt{2}}{2}'},
          {cosStr:'-1',             quadInfo:'x=\\pi',           ans:['0'],                  step:'\\sqrt{\\dfrac{1+(-1)}{2}}=\\sqrt{0}=0'},
        ];
        const {cosStr, quadInfo, ans, step} = choose(cases);
        return {
          latex: `\\cos x=${cosStr},\\;${quadInfo},\\;\\tfrac{x}{2}\\text{ in QI}.\\quad\\cos\\!\\dfrac{x}{2}=`,
          answer: ans,
          hint: 'cos(x/2) = +√((1+cos x)/2) — with the given cos value, what does the expression under the radical become?',
          step
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_7_5: Solving Trig Equations
  PRECALC_SPIRAL["PC_7_5"] = {
    title: "Solving Trig Equations",
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

      function gen1(){
        // cos(θ) = k > 0: two solutions (QI and QIV)
        const cases = [
          {kStr:'\\dfrac{1}{2}',           a:'pi/3',   b:'5pi/3',  aD:'\\dfrac{\\pi}{3}',   bD:'\\dfrac{5\\pi}{3}'},
          {kStr:'\\dfrac{\\sqrt{2}}{2}',   a:'pi/4',   b:'7pi/4',  aD:'\\dfrac{\\pi}{4}',   bD:'\\dfrac{7\\pi}{4}'},
          {kStr:'\\dfrac{\\sqrt{3}}{2}',   a:'pi/6',   b:'11pi/6', aD:'\\dfrac{\\pi}{6}',   bD:'\\dfrac{11\\pi}{6}'},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        return {
          latex: `\\cos\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Cosine is positive in QI and QIV — what angles in those quadrants have this cosine value?',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen2(){
        // cos(θ) = k < 0: two solutions (QII and QIII)
        const cases = [
          {kStr:'-\\dfrac{1}{2}',          a:'2pi/3',  b:'4pi/3',  aD:'\\dfrac{2\\pi}{3}',  bD:'\\dfrac{4\\pi}{3}'},
          {kStr:'-\\dfrac{\\sqrt{2}}{2}',  a:'3pi/4',  b:'5pi/4',  aD:'\\dfrac{3\\pi}{4}',  bD:'\\dfrac{5\\pi}{4}'},
          {kStr:'-\\dfrac{\\sqrt{3}}{2}',  a:'5pi/6',  b:'7pi/6',  aD:'\\dfrac{5\\pi}{6}',  bD:'\\dfrac{7\\pi}{6}'},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        return {
          latex: `\\cos\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Cosine is negative in QII and QIII — what angles in those quadrants have this cosine value?',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen3(){
        // sin(θ) = k > 0: two solutions (QI and QII)
        const cases = [
          {kStr:'\\dfrac{1}{2}',           a:'pi/6',   b:'5pi/6',  aD:'\\dfrac{\\pi}{6}',   bD:'\\dfrac{5\\pi}{6}'},
          {kStr:'\\dfrac{\\sqrt{2}}{2}',   a:'pi/4',   b:'3pi/4',  aD:'\\dfrac{\\pi}{4}',   bD:'\\dfrac{3\\pi}{4}'},
          {kStr:'\\dfrac{\\sqrt{3}}{2}',   a:'pi/3',   b:'2pi/3',  aD:'\\dfrac{\\pi}{3}',   bD:'\\dfrac{2\\pi}{3}'},
          {kStr:'1',                        a:'pi/2',   b:'pi/2',   aD:'\\dfrac{\\pi}{2}',   bD:'\\dfrac{\\pi}{2}'},
        ];
        const chosen = choose(cases.slice(0,3)); // skip the k=1 edge case for two-solution format
        const {kStr, a, b, aD, bD} = chosen;
        return {
          latex: `\\sin\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Sine is positive in QI and QII — what angles in those quadrants have this sine value?',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen4(){
        // sin(θ) = k < 0: two solutions (QIII and QIV)
        const cases = [
          {kStr:'-\\dfrac{1}{2}',          a:'7pi/6',  b:'11pi/6', aD:'\\dfrac{7\\pi}{6}',  bD:'\\dfrac{11\\pi}{6}'},
          {kStr:'-\\dfrac{\\sqrt{2}}{2}',  a:'5pi/4',  b:'7pi/4',  aD:'\\dfrac{5\\pi}{4}',  bD:'\\dfrac{7\\pi}{4}'},
          {kStr:'-\\dfrac{\\sqrt{3}}{2}',  a:'4pi/3',  b:'5pi/3',  aD:'\\dfrac{4\\pi}{3}',  bD:'\\dfrac{5\\pi}{3}'},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        return {
          latex: `\\sin\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Sine is negative in QIII and QIV — what angles in those quadrants have this sine value?',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen5(){
        // tan(θ) = k > 0: two solutions (QI and QIII)
        const cases = [
          {kStr:'1',              a:'pi/4',   b:'5pi/4',  aD:'\\dfrac{\\pi}{4}',   bD:'\\dfrac{5\\pi}{4}'},
          {kStr:'\\sqrt{3}',      a:'pi/3',   b:'4pi/3',  aD:'\\dfrac{\\pi}{3}',   bD:'\\dfrac{4\\pi}{3}'},
          {kStr:'\\dfrac{\\sqrt{3}}{3}', a:'pi/6', b:'7pi/6', aD:'\\dfrac{\\pi}{6}', bD:'\\dfrac{7\\pi}{6}'},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        return {
          latex: `\\tan\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Tangent is positive in QI and QIII — once you have the QI solution, add π to get the second.',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen6(){
        // tan(θ) = k < 0: two solutions (QII and QIV)
        const cases = [
          {kStr:'-1',              a:'3pi/4',  b:'7pi/4',  aD:'\\dfrac{3\\pi}{4}',  bD:'\\dfrac{7\\pi}{4}'},
          {kStr:'-\\sqrt{3}',      a:'2pi/3',  b:'5pi/3',  aD:'\\dfrac{2\\pi}{3}',  bD:'\\dfrac{5\\pi}{3}'},
          {kStr:'-\\dfrac{\\sqrt{3}}{3}', a:'5pi/6', b:'11pi/6', aD:'\\dfrac{5\\pi}{6}', bD:'\\dfrac{11\\pi}{6}'},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        return {
          latex: `\\tan\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{Both solutions}=`,
          answer: [a + ',' + b],
          hint: 'Tangent is negative in QII and QIV — in which quadrant does arctan give its result, and how do you reach the other?',
          step: `\\theta=${aD}\\text{ and }\\theta=${bD}`
        };
      }

      function gen7(){
        // cos(θ) = 0 or ±1: one or two edge-case solutions
        const cases = [
          {kStr:'0',  answers:['pi/2','3pi/2'], a:'pi/2', b:'3pi/2', aD:'\\dfrac{\\pi}{2}', bD:'\\dfrac{3\\pi}{2}'},
          {kStr:'1',  answers:['0'],            a:'0',    b:null,    aD:'0',               bD:null},
          {kStr:'-1', answers:['pi'],           a:'pi',   b:null,    aD:'\\pi',            bD:null},
        ];
        const {kStr, a, b, aD, bD} = choose(cases);
        const ans = b ? [a + ',' + b] : [a];
        const stepPart = bD ? `${aD}\\text{ and }${bD}` : aD;
        return {
          latex: `\\cos\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{All solutions}=`,
          answer: ans,
          hint: 'Look at the unit circle — at how many points does the x-coordinate equal this value, and where are they?',
          step: `\\theta=${stepPart}`
        };
      }

      function gen8(){
        // sin(θ) = 0 or ±1 edge case
        const cases = [
          {kStr:'0',  a:'0,pi',     aD:'0\\text{ and }\\pi'},
          {kStr:'1',  a:'pi/2',     aD:'\\dfrac{\\pi}{2}'},
          {kStr:'-1', a:'3pi/2',    aD:'\\dfrac{3\\pi}{2}'},
        ];
        const {kStr, a, aD} = choose(cases);
        return {
          latex: `\\sin\\theta=${kStr},\\;\\theta\\in[0,2\\pi).\\quad\\text{All solutions}=`,
          answer: [a],
          hint: 'Look at the unit circle — at how many points does the y-coordinate equal this value, and where are they?',
          step: `\\theta=${aD}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_1: Law of Sines
  PRECALC_SPIRAL["PC_8_1"] = {
    title: "Law of Sines",
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

      function gen1(){
        // Find third angle C = 180 - A - B
        const cases = [
          {A:30, B:60,  C:90},
          {A:45, B:45,  C:90},
          {A:45, B:60,  C:75},
          {A:30, B:120, C:30},
          {A:60, B:80,  C:40},
          {A:35, B:65,  C:80},
          {A:50, B:70,  C:60},
        ];
        const {A, B, C} = choose(cases);
        return {
          latex: `A=${A}^\\circ,\\;B=${B}^\\circ.\\quad C=`,
          answer: [String(C)],
          hint: 'The three interior angles of any triangle sum to 180° — if you know two, what must the third be?',
          step: `C=180^\\circ-${A}^\\circ-${B}^\\circ=${C}^\\circ`
        };
      }

      function gen2(){
        // Law of Sines: A=30°, B=90°, given a, find b = 2a
        const a = choose([3, 4, 5, 6, 7, 8]);
        const b = 2 * a;
        return {
          latex: `A=30^\\circ,\\;B=90^\\circ,\\;a=${a}.\\quad b=`,
          answer: [String(b)],
          hint: 'Law of Sines: each side is proportional to the sine of its opposite angle — what does a/sin(A) equal here?',
          step: `\\dfrac{b}{\\sin90^\\circ}=\\dfrac{${a}}{\\sin30^\\circ}\\Rightarrow b=\\dfrac{${a}}{1/2}=${b}`
        };
      }

      function gen3(){
        // A=90°, B=30°, given a (opp 90°), find b (opp 30°) = a/2
        const a = choose([6, 8, 10, 12, 14, 16]);
        const b = a / 2;
        return {
          latex: `A=90^\\circ,\\;B=30^\\circ,\\;a=${a}.\\quad b=`,
          answer: [String(b)],
          hint: 'Law of Sines: each side is proportional to the sine of its opposite angle — what does a/sin(A) equal here?',
          step: `\\dfrac{b}{\\sin30^\\circ}=\\dfrac{${a}}{\\sin90^\\circ}\\Rightarrow b=\\dfrac{${a}\\cdot1/2}{1}=${b}`
        };
      }

      function gen4(){
        // A=30°, B=120°, given a, find b = a√3
        const a = choose([2, 3, 4, 5, 6]);
        return {
          latex: `A=30^\\circ,\\;B=120^\\circ,\\;a=${a}.\\quad b=`,
          answer: [String(a)+'sqrt(3)', String(a)+'sqrt3'],
          hint: 'Law of Sines connects all sides to their opposite sines — which common ratio does a/sin(30°) give here?',
          step: `b=\\dfrac{${a}\\cdot\\sin120^\\circ}{\\sin30^\\circ}=\\dfrac{${a}\\cdot\\sqrt{3}/2}{1/2}=${a}\\sqrt{3}`
        };
      }

      function gen5(){
        // AAS: A=30°, B=60°, C=90°, given c, find a = c/2
        const c = choose([6, 8, 10, 12, 14, 16]);
        const a = c / 2;
        return {
          latex: `A=30^\\circ,\\;B=60^\\circ,\\;C=90^\\circ,\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'Once all angles are known, the Law of Sines gives any side — what ratio does c/sin(C) provide here?',
          step: `\\dfrac{a}{\\sin30^\\circ}=\\dfrac{${c}}{\\sin90^\\circ}\\Rightarrow a=\\dfrac{${c}\\cdot1/2}{1}=${a}`
        };
      }

      function gen6(){
        // A=45°, B=45°, C=90°, given a (opp 45°), find c (opp 90°) = a√2
        const a = choose([3, 4, 5, 6, 7]);
        return {
          latex: `A=45^\\circ,\\;B=45^\\circ,\\;C=90^\\circ,\\;a=${a}.\\quad c=`,
          answer: [String(a)+'sqrt(2)', String(a)+'sqrt2'],
          hint: 'Once all three angles are known, the Law of Sines lets you find any side — what is the ratio a/sin(45°) here?',
          step: `\\dfrac{c}{\\sin90^\\circ}=\\dfrac{${a}}{\\sin45^\\circ}\\Rightarrow c=\\dfrac{${a}}{\\sqrt{2}/2}=${a}\\sqrt{2}`
        };
      }

      function gen7(){
        // SSA ambiguous case: A=30°, b=10, vary a; answer is "0", "1", or "2"
        const cases = [
          {a:4,  b:10, ans:'0', reason:'a=4<h=5'},
          {a:5,  b:10, ans:'1', reason:'a=5=h=5'},
          {a:7,  b:10, ans:'2', reason:'h=5<a=7<b=10'},
          {a:12, b:10, ans:'1', reason:'a=12\\geq b=10'},
        ];
        const {a, b, ans, reason} = choose(cases);
        return {
          latex: `A=30^\\circ,\\;b=${b},\\;a=${a}.\\quad\\text{Number of triangles}=`,
          answer: [ans],
          hint: 'In SSA with acute angle A, the number of triangles depends on how a compares to h=b·sin(A) — what is h here?',
          step: `h=b\\sin A=${b}\\cdot\\tfrac{1}{2}=5.\\;${reason}\\Rightarrow${ans}\\text{ triangle(s)}`
        };
      }

      function gen8(){
        // SSA ambiguous case: A=30°, b=12, vary a; answer is "0", "1", or "2"
        const cases = [
          {a:5,  b:12, ans:'0', reason:'a=5<h=6'},
          {a:6,  b:12, ans:'1', reason:'a=6=h=6'},
          {a:9,  b:12, ans:'2', reason:'h=6<a=9<b=12'},
          {a:14, b:12, ans:'1', reason:'a=14\\geq b=12'},
        ];
        const {a, b, ans, reason} = choose(cases);
        return {
          latex: `A=30^\\circ,\\;b=${b},\\;a=${a}.\\quad\\text{Number of triangles}=`,
          answer: [ans],
          hint: 'In SSA with acute angle A, the number of triangles depends on how a compares to h=b·sin(A) — what is h here?',
          step: `h=b\\sin A=${b}\\cdot\\tfrac{1}{2}=6.\\;${reason}\\Rightarrow${ans}\\text{ triangle(s)}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_2: Law of Cosines
  PRECALC_SPIRAL["PC_8_2"] = {
    title: "Law of Cosines",
    index: 38,
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

      function gen1(){
        // SAS with A=90° → Pythagorean triple
        const cases = [
          {b:3, c:4, a:5},
          {b:5, c:12, a:13},
          {b:8, c:15, a:17},
          {b:6, c:8, a:10},
          {b:9, c:12, a:15},
        ];
        const {b, c, a} = choose(cases);
        return {
          latex: `A=90^\\circ,\\;b=${b},\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'At A=90°, cos(A)=0, so the Law of Cosines reduces to the Pythagorean theorem — what is a²=b²+c² here?',
          step: `a^2=${b}^2+${c}^2=${b*b}+${c*c}=${a*a}\\Rightarrow a=${a}`
        };
      }

      function gen2(){
        // SAS with A=60°: (b=3,c=8,a=7) or (b=5,c=8,a=7)
        const cases = [
          {b:3, c:8, a:7},
          {b:5, c:8, a:7},
          {b:8, c:3, a:7},
          {b:8, c:5, a:7},
        ];
        const {b, c, a} = choose(cases);
        return {
          latex: `A=60^\\circ,\\;b=${b},\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'In the Law of Cosines with A=60°, cos(60°)=1/2 — what does 2bc·cos(60°) equal, and what is a²?',
          step: `a^2=${b}^2+${c}^2-2\\cdot${b}\\cdot${c}\\cdot\\tfrac{1}{2}=${b*b}+${c*c}-${b*c}=${a*a}\\Rightarrow a=${a}`
        };
      }

      function gen3(){
        // SAS with A=120°: (b=3,c=5,a=7) or (b=7,c=8,a=13)
        const cases = [
          {b:3, c:5, a:7},
          {b:5, c:3, a:7},
          {b:7, c:8, a:13},
          {b:8, c:7, a:13},
        ];
        const {b, c, a} = choose(cases);
        return {
          latex: `A=120^\\circ,\\;b=${b},\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'In the Law of Cosines with A=120°, cos(120°)=−1/2 — how does that change the sign of the 2bc·cos(A) term?',
          step: `a^2=${b}^2+${c}^2-2\\cdot${b}\\cdot${c}\\cdot(-\\tfrac{1}{2})=${b*b}+${c*c}+${b*c}=${a*a}\\Rightarrow a=${a}`
        };
      }

      function gen4(){
        // SSS: find angle C in a Pythagorean triple → 90°
        const cases = [
          {a:3, b:4, c:5},
          {a:5, b:12, c:13},
          {a:8, b:15, c:17},
          {a:6, b:8, c:10},
        ];
        const {a, b, c} = choose(cases);
        return {
          latex: `a=${a},\\;b=${b},\\;c=${c}.\\quad\\text{Angle }C\\text{ (degrees)}=`,
          answer: ['90'],
          hint: 'Rearranged Law of Cosines: cos(C)=(a²+b²−c²)/(2ab) — compute this fraction for the given sides.',
          step: `\\cos C=\\dfrac{${a*a}+${b*b}-${c*c}}{2\\cdot${a}\\cdot${b}}=\\dfrac{0}{${2*a*b}}=0\\Rightarrow C=90^\\circ`
        };
      }

      function gen5(){
        // SSS: find angle B in (3,7,8) or (5,7,8) → 60°
        const cases = [
          {a:3, b:7, c:8,  num:24, den:48},
          {a:5, b:7, c:8,  num:40, den:80},
          {a:3, b:7, c:8,  num:24, den:48},
        ];
        const {a, b, c, num, den} = choose(cases);
        return {
          latex: `a=${a},\\;b=${b},\\;c=${c}.\\quad\\text{Angle }B\\text{ (degrees)}=`,
          answer: ['60'],
          hint: 'Rearranged Law of Cosines: cos(B)=(a²+c²−b²)/(2ac) — which standard angle has cosine 1/2?',
          step: `\\cos B=\\dfrac{${a*a}+${c*c}-${b*b}}{2\\cdot${a}\\cdot${c}}=\\dfrac{${num}}{${den}}=\\dfrac{1}{2}\\Rightarrow B=60^\\circ`
        };
      }

      function gen6(){
        // SSS: find angle A in (3,5,7) or (7,8,13) → 120°
        const cases = [
          {a:7,  b:3,  c:5,  num:-15, den:30},
          {a:13, b:7,  c:8,  num:-56, den:112},
          {a:7,  b:5,  c:3,  num:-15, den:30},
        ];
        const {a, b, c, num, den} = choose(cases);
        return {
          latex: `a=${a},\\;b=${b},\\;c=${c}.\\quad\\text{Angle }A\\text{ (degrees)}=`,
          answer: ['120'],
          hint: 'Rearranged Law of Cosines: cos(A)=(b²+c²−a²)/(2bc) — which standard angle has cosine −1/2?',
          step: `\\cos A=\\dfrac{${b*b}+${c*c}-${a*a}}{2\\cdot${b}\\cdot${c}}=\\dfrac{${num}}{${den}}=-\\dfrac{1}{2}\\Rightarrow A=120^\\circ`
        };
      }

      function gen7(){
        // SAS with A=90°: larger Pythagorean triples
        const cases = [
          {b:7, c:24, a:25},
          {b:20, c:21, a:29},
          {b:9, c:40, a:41},
          {b:12, c:35, a:37},
        ];
        const {b, c, a} = choose(cases);
        return {
          latex: `A=90^\\circ,\\;b=${b},\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'At A=90°, cos(A)=0, so the Law of Cosines reduces to the Pythagorean theorem — what is a²=b²+c² here?',
          step: `a^2=${b}^2+${c}^2=${b*b}+${c*c}=${a*a}\\Rightarrow a=${a}`
        };
      }

      function gen8(){
        // SAS with A=120°: (b=7,c=8,a=13)
        const cases = [
          {b:7,  c:8,  a:13},
          {b:8,  c:7,  a:13},
          {b:3,  c:5,  a:7},
          {b:5,  c:3,  a:7},
        ];
        const {b, c, a} = choose(cases);
        return {
          latex: `A=120^\\circ,\\;b=${b},\\;c=${c}.\\quad a=`,
          answer: [String(a)],
          hint: 'In the Law of Cosines with A=120°, cos(120°)=−1/2 — how does that change the sign of the 2bc·cos(A) term?',
          step: `a^2=${b}^2+${c}^2+${b}\\cdot${c}=${b*b}+${c*c}+${b*c}=${a*a}\\Rightarrow a=${a}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_3: Polar Coordinates
  PRECALC_SPIRAL["PC_8_3"] = {
    title: "Polar Coordinates",
    index: 39,
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

      function gen1(){
        // Polar → Cartesian: find x = r·cos(θ)
        const cases = [
          {r:2, th:'\\dfrac{\\pi}{3}',   x:'1',          xAns:['1']},
          {r:4, th:'\\dfrac{\\pi}{3}',   x:'2',          xAns:['2']},
          {r:2, th:'\\dfrac{\\pi}{6}',   x:'\\sqrt{3}',  xAns:['sqrt(3)','sqrt3']},
          {r:4, th:'\\dfrac{\\pi}{6}',   x:'2\\sqrt{3}', xAns:['2sqrt(3)','2sqrt3']},
          {r:4, th:'\\dfrac{\\pi}{2}',   x:'0',          xAns:['0']},
          {r:5, th:'0',                  x:'5',          xAns:['5']},
          {r:6, th:'\\dfrac{\\pi}{3}',   x:'3',          xAns:['3']},
          {r:6, th:'\\pi',               x:'-6',         xAns:['-6']},
        ];
        const {r, th, x, xAns} = choose(cases);
        return {
          latex: `\\text{Polar point }\\left(${r},\\,${th}\\right).\\quad x=`,
          answer: xAns,
          hint: 'The Cartesian x-coordinate of a polar point is x = r·cos(θ) — what is cos(θ) at this angle?',
          step: `x=${r}\\cos\\!\\left(${th}\\right)=${x}`
        };
      }

      function gen2(){
        // Polar → Cartesian: find y = r·sin(θ)
        const cases = [
          {r:2, th:'\\dfrac{\\pi}{6}',   y:'1',          yAns:['1']},
          {r:4, th:'\\dfrac{\\pi}{6}',   y:'2',          yAns:['2']},
          {r:2, th:'\\dfrac{\\pi}{3}',   y:'\\sqrt{3}',  yAns:['sqrt(3)','sqrt3']},
          {r:4, th:'\\dfrac{\\pi}{3}',   y:'2\\sqrt{3}', yAns:['2sqrt(3)','2sqrt3']},
          {r:4, th:'\\dfrac{\\pi}{2}',   y:'4',          yAns:['4']},
          {r:5, th:'0',                  y:'0',          yAns:['0']},
          {r:6, th:'\\dfrac{\\pi}{6}',   y:'3',          yAns:['3']},
          {r:6, th:'\\pi',               y:'0',          yAns:['0']},
        ];
        const {r, th, y, yAns} = choose(cases);
        return {
          latex: `\\text{Polar point }\\left(${r},\\,${th}\\right).\\quad y=`,
          answer: yAns,
          hint: 'The Cartesian y-coordinate of a polar point is y = r·sin(θ) — what is sin(θ) at this angle?',
          step: `y=${r}\\sin\\!\\left(${th}\\right)=${y}`
        };
      }

      function gen3(){
        // Cartesian → Polar: find r = √(x²+y²) using Pythagorean triples
        const cases = [
          {x:3,  y:4,  r:5,          rAns:['5']},
          {x:5,  y:12, r:13,         rAns:['13']},
          {x:8,  y:15, r:17,         rAns:['17']},
          {x:1,  y:1,  r:'\\sqrt{2}',rAns:['sqrt(2)','sqrt2']},
          {x:4,  y:3,  r:5,          rAns:['5']},
          {x:12, y:5,  r:13,         rAns:['13']},
        ];
        const {x, y, r, rAns} = choose(cases);
        return {
          latex: `\\text{Cartesian point }(${x},\\,${y}).\\quad r=`,
          answer: rAns,
          hint: 'The polar radius r = √(x²+y²) — what is the distance from the origin to this point?',
          step: `r=\\sqrt{${x}^2+${y}^2}=\\sqrt{${x*x+y*y}}=${r}`
        };
      }

      function gen4(){
        // Cartesian → Polar: find θ in QI (standard angle)
        const cases = [
          {x:1,     y:1,     th:'\\dfrac{\\pi}{4}', ans:['pi/4']},
          {x:'\\sqrt{3}', y:1,  th:'\\dfrac{\\pi}{6}', ans:['pi/6']},
          {x:1, y:'\\sqrt{3}',  th:'\\dfrac{\\pi}{3}', ans:['pi/3']},
          {x:0,     y:3,     th:'\\dfrac{\\pi}{2}', ans:['pi/2']},
          {x:5,     y:0,     th:'0',                ans:['0']},
        ];
        const {x, y, th, ans} = choose(cases);
        return {
          latex: `\\text{Cartesian point }(${x},\\,${y}).\\quad\\theta=`,
          answer: ans,
          hint: 'For a point in QI, θ = arctan(y/x) — which standard angle has that tangent ratio here?',
          step: `\\theta=\\arctan\\!\\left(\\dfrac{${y}}{${x}}\\right)=${th}`
        };
      }

      function gen5(){
        // Cartesian → Polar: find θ in QII or QIV (requires adjustment)
        const cases = [
          {x:'-1',          y:'1',           th:'\\dfrac{3\\pi}{4}', ans:['3pi/4'],   quad:'QII'},
          {x:'-\\sqrt{3}',  y:'1',           th:'\\dfrac{5\\pi}{6}', ans:['5pi/6'],   quad:'QII'},
          {x:'-1',          y:'\\sqrt{3}',   th:'\\dfrac{2\\pi}{3}', ans:['2pi/3'],   quad:'QII'},
          {x:'1',           y:'-1',          th:'\\dfrac{7\\pi}{4}', ans:['7pi/4'],   quad:'QIV'},
          {x:'\\sqrt{3}',   y:'-1',          th:'\\dfrac{11\\pi}{6}',ans:['11pi/6'],  quad:'QIV'},
          {x:'-3',          y:'0',           th:'\\pi',              ans:['pi'],      quad:'neg x'},
        ];
        const {x, y, th, ans, quad} = choose(cases);
        return {
          latex: `\\text{Cartesian point }(${x},\\,${y}).\\quad\\theta\\in[0,2\\pi)=`,
          answer: ans,
          hint: 'arctan(y/x) only gives a QI or QIV angle — for points not in QI, which quadrant is this, and how must θ be adjusted?',
          step: `\\text{Point in }${quad}.\\;\\theta=${th}`
        };
      }

      function gen6(){
        // Negative r: (-r, θ) is equivalent to (r, θ+π); find the positive-r form angle
        const cases = [
          {r:2, th:'\\dfrac{\\pi}{4}', newTh:'\\dfrac{5\\pi}{4}', ans:['5pi/4']},
          {r:3, th:'\\dfrac{\\pi}{6}', newTh:'\\dfrac{7\\pi}{6}', ans:['7pi/6']},
          {r:4, th:'\\dfrac{\\pi}{3}', newTh:'\\dfrac{4\\pi}{3}', ans:['4pi/3']},
          {r:5, th:'0',                newTh:'\\pi',              ans:['pi']},
          {r:2, th:'\\dfrac{2\\pi}{3}',newTh:'\\dfrac{5\\pi}{3}', ans:['5pi/3']},
        ];
        const {r, th, newTh, ans} = choose(cases);
        return {
          latex: `\\text{Convert }(-${r},\\,${th})\\text{ to positive }r\\text{ form: }(${r},\\,\\square).\\quad\\square=`,
          answer: ans,
          hint: 'A negative r means going in the opposite direction — what angle do you get by adding π to the given θ?',
          step: `(-${r},\\,${th})\\equiv(${r},\\,${th}+\\pi)=(${r},\\,${newTh})`
        };
      }

      function gen7(){
        // r = a·cos(θ): find radius of the circle it represents (= a/2)
        const cases = [
          {a:4,  radius:2,  rAns:['2']},
          {a:6,  radius:3,  rAns:['3']},
          {a:8,  radius:4,  rAns:['4']},
          {a:10, radius:5,  rAns:['5']},
          {a:2,  radius:1,  rAns:['1']},
        ];
        const {a, radius, rAns} = choose(cases);
        return {
          latex: `r=${a}\\cos\\theta\\text{ represents a circle.}\\quad\\text{Radius}=`,
          answer: rAns,
          hint: 'r=a·cosθ describes a circle — what is the radius of this circle in terms of a?',
          step: `r^2=${a}r\\cos\\theta\\Rightarrow x^2+y^2=${a}x\\Rightarrow(x-${a/2})^2+y^2=${radius}^2.\\;\\text{Radius}=${radius}`
        };
      }

      function gen8(){
        // r = a·sin(θ): find radius of the circle (= a/2)
        const cases = [
          {a:4,  radius:2,  rAns:['2']},
          {a:6,  radius:3,  rAns:['3']},
          {a:8,  radius:4,  rAns:['4']},
          {a:10, radius:5,  rAns:['5']},
          {a:2,  radius:1,  rAns:['1']},
        ];
        const {a, radius, rAns} = choose(cases);
        return {
          latex: `r=${a}\\sin\\theta\\text{ represents a circle.}\\quad\\text{Radius}=`,
          answer: rAns,
          hint: 'r=a·sinθ describes a circle — what is the radius of this circle in terms of a?',
          step: `r^2=${a}r\\sin\\theta\\Rightarrow x^2+y^2=${a}y\\Rightarrow x^2+(y-${a/2})^2=${radius}^2.\\;\\text{Radius}=${radius}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_4: Polar Coordinate Graphs
  PRECALC_SPIRAL["PC_8_4"] = {
    title: "Polar Coordinate Graphs",
    index: 40,
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

      function gen1(){
        // r = k: circle centered at origin, radius = k
        const k = choose([2, 3, 4, 5, 6, 7, 8]);
        return {
          latex: `r=${k}.\\quad\\text{Radius of this circle}=`,
          answer: [String(k)],
          hint: 'r = k is a circle centered at the origin — what is its radius?',
          step: `r=${k}\\Rightarrow\\text{radius}=${k}`
        };
      }

      function gen2(){
        // Rose r = a·cos(nθ), n odd: petals = n
        const cases = [
          {a:2, n:3, petals:3},
          {a:3, n:3, petals:3},
          {a:4, n:3, petals:3},
          {a:2, n:5, petals:5},
          {a:3, n:5, petals:5},
          {a:2, n:7, petals:7},
        ];
        const {a, n, petals} = choose(cases);
        return {
          latex: `r=${a}\\cos(${n}\\theta).\\quad\\text{Number of petals}=`,
          answer: [String(petals)],
          hint: 'A rose curve r = a·cos(nθ) has n petals when n is odd — how many petals does this rose have?',
          step: `n=${n}\\text{ is odd}\\Rightarrow${n}\\text{ petals}`
        };
      }

      function gen3(){
        // Rose r = a·cos(nθ), n even: petals = 2n
        const cases = [
          {a:2, n:2, petals:4},
          {a:3, n:2, petals:4},
          {a:5, n:2, petals:4},
          {a:2, n:4, petals:8},
          {a:3, n:4, petals:8},
          {a:1, n:6, petals:12},
        ];
        const {a, n, petals} = choose(cases);
        return {
          latex: `r=${a}\\cos(${n}\\theta).\\quad\\text{Number of petals}=`,
          answer: [String(petals)],
          hint: 'A rose curve r = a·cos(nθ) has 2n petals when n is even — how many petals does this rose have?',
          step: `n=${n}\\text{ is even}\\Rightarrow 2\\cdot${n}=${petals}\\text{ petals}`
        };
      }

      function gen4(){
        // Rose r = a·sin(nθ), n odd: petals = n
        const cases = [
          {a:2, n:3, petals:3},
          {a:4, n:3, petals:3},
          {a:2, n:5, petals:5},
          {a:3, n:5, petals:5},
          {a:1, n:9, petals:9},
        ];
        const {a, n, petals} = choose(cases);
        return {
          latex: `r=${a}\\sin(${n}\\theta).\\quad\\text{Number of petals}=`,
          answer: [String(petals)],
          hint: 'A rose curve r = a·sin(nθ) has n petals when n is odd — how many petals does this rose have?',
          step: `n=${n}\\text{ is odd}\\Rightarrow${n}\\text{ petals}`
        };
      }

      function gen5(){
        // Rose r = a·sin(nθ), n even: petals = 2n
        const cases = [
          {a:2, n:2, petals:4},
          {a:5, n:2, petals:4},
          {a:3, n:4, petals:8},
          {a:2, n:4, petals:8},
          {a:2, n:6, petals:12},
        ];
        const {a, n, petals} = choose(cases);
        return {
          latex: `r=${a}\\sin(${n}\\theta).\\quad\\text{Number of petals}=`,
          answer: [String(petals)],
          hint: 'A rose curve r = a·sin(nθ) has 2n petals when n is even — how many petals does this rose have?',
          step: `n=${n}\\text{ is even}\\Rightarrow 2\\cdot${n}=${petals}\\text{ petals}`
        };
      }

      function gen6(){
        // Cardioid r = a(1+cosθ): max r = 2a at θ=0
        const a = choose([1, 2, 3, 4, 5, 6]);
        const max = 2 * a;
        return {
          latex: `r=${a}(1+\\cos\\theta).\\quad\\text{Maximum value of }r=`,
          answer: [String(max)],
          hint: 'A cardioid r = a(1+cosθ) reaches its maximum when cosθ = 1 — what is r at that point?',
          step: `\\theta=0:\\;r=${a}(1+1)=${a}\\cdot2=${max}`
        };
      }

      function gen7(){
        // Cardioid r = a(1−cosθ): max r = 2a at θ=π
        const a = choose([1, 2, 3, 4, 5, 6]);
        const max = 2 * a;
        return {
          latex: `r=${a}(1-\\cos\\theta).\\quad\\text{Maximum value of }r=`,
          answer: [String(max)],
          hint: 'A cardioid r = a(1−cosθ) reaches its maximum when cosθ = −1 — what is r at that point?',
          step: `\\theta=\\pi:\\;r=${a}(1-(-1))=${a}\\cdot2=${max}`
        };
      }

      function gen8(){
        // Limaçon r = a + b·cosθ (a > b): evaluate at θ = π gives r = a − b
        const cases = [
          {a:5, b:3, minR:2},
          {a:6, b:2, minR:4},
          {a:7, b:3, minR:4},
          {a:8, b:5, minR:3},
          {a:5, b:1, minR:4},
          {a:9, b:4, minR:5},
          {a:6, b:4, minR:2},
        ];
        const {a, b, minR} = choose(cases);
        return {
          latex: `r=${a}+${b}\\cos\\theta.\\quad r\\text{ at }\\theta=\\pi:\\;r=`,
          answer: [String(minR)],
          hint: 'In r = a + b·cosθ, cos(π) = −1 — what is r at θ = π?',
          step: `r=${a}+${b}\\cos\\pi=${a}+${b}\\cdot(-1)=${a}-${b}=${minR}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_5: Conic Sections
  PRECALC_SPIRAL["PC_8_5"] = {
    title: "Conic Sections",
    index: 41,
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

      function gen1(){
        // Ellipse x²/a² + y²/b² = 1: find a (larger value)
        const cases = [
          {a2:25, b2:9,  a:5, b:3},
          {a2:49, b2:16, a:7, b:4},
          {a2:36, b2:16, a:6, b:4},
          {a2:100,b2:64, a:10,b:8},
          {a2:169,b2:25, a:13,b:5},
        ];
        const {a2, b2, a, b} = choose(cases);
        return {
          latex: `\\dfrac{x^2}{${a2}}+\\dfrac{y^2}{${b2}}=1.\\quad a=`,
          answer: [String(a)],
          hint: 'In an ellipse x²/a²+y²/b²=1, a is the square root of the larger denominator — which denominator is larger?',
          step: `a=\\sqrt{${a2}}=${a}`
        };
      }

      function gen2(){
        // Ellipse: find c where c² = a² - b² (Pythagorean triples)
        const cases = [
          {a2:25,  b2:16, c:3,  a:5,  b:4},
          {a2:25,  b2:9,  c:4,  a:5,  b:3},
          {a2:169, b2:25, c:12, a:13, b:5},
          {a2:169, b2:144,c:5,  a:13, b:12},
          {a2:100, b2:64, c:6,  a:10, b:8},
        ];
        const {a2, b2, c, a, b} = choose(cases);
        return {
          latex: `\\dfrac{x^2}{${a2}}+\\dfrac{y^2}{${b2}}=1.\\quad c=`,
          answer: [String(c)],
          hint: 'For an ellipse c²=a²−b² — if you compute the difference of the two denominators, what is its square root?',
          step: `c=\\sqrt{${a2}-${b2}}=\\sqrt{${a2-b2}}=${c}`
        };
      }

      function gen3(){
        // Parabola x² = 4py: find p
        const cases = [
          {rhs:4,  p:1},
          {rhs:8,  p:2},
          {rhs:12, p:3},
          {rhs:16, p:4},
          {rhs:20, p:5},
          {rhs:24, p:6},
        ];
        const {rhs, p} = choose(cases);
        return {
          latex: `x^2=${rhs}y.\\quad p=`,
          answer: [String(p)],
          hint: 'A parabola x²=4py has p = coefficient÷4 — what is the right-hand side coefficient divided by 4?',
          step: `4p=${rhs}\\Rightarrow p=${p}`
        };
      }

      function gen4(){
        // Parabola y² = 4px: find focus x-coordinate = p
        const cases = [
          {rhs:4,  p:1},
          {rhs:8,  p:2},
          {rhs:12, p:3},
          {rhs:20, p:5},
          {rhs:28, p:7},
        ];
        const {rhs, p} = choose(cases);
        return {
          latex: `y^2=${rhs}x.\\quad\\text{Focus }x\\text{-coordinate}=`,
          answer: [String(p)],
          hint: 'A parabola y²=4px has its focus at (p,0) — what is 4p here, and therefore what is p?',
          step: `4p=${rhs}\\Rightarrow p=${p},\\;\\text{focus}=(${p},0)`
        };
      }

      function gen5(){
        // Hyperbola x²/a² - y²/b² = 1: find c where c² = a² + b²
        const cases = [
          {a2:9,  b2:16, c:5,  label:'3,4,5'},
          {a2:16, b2:9,  c:5,  label:'4,3,5'},
          {a2:25, b2:144,c:13, label:'5,12,13'},
          {a2:144,b2:25, c:13, label:'12,5,13'},
          {a2:64, b2:36, c:10, label:'8,6,10'},
        ];
        const {a2, b2, c} = choose(cases);
        return {
          latex: `\\dfrac{x^2}{${a2}}-\\dfrac{y^2}{${b2}}=1.\\quad c=`,
          answer: [String(c)],
          hint: 'For a hyperbola c²=a²+b² — if you add the two denominators, what is the square root of that sum?',
          step: `c=\\sqrt{${a2}+${b2}}=\\sqrt{${a2+b2}}=${c}`
        };
      }

      function gen6(){
        // Hyperbola x²/a² - y²/b² = 1: find positive asymptote slope = b/a
        const cases = [
          {a2:9,  b2:16, slope:'4/3', a:3, b:4},
          {a2:16, b2:9,  slope:'3/4', a:4, b:3},
          {a2:4,  b2:9,  slope:'3/2', a:2, b:3},
          {a2:9,  b2:4,  slope:'2/3', a:3, b:2},
          {a2:1,  b2:4,  slope:'2',   a:1, b:2},
          {a2:4,  b2:1,  slope:'1/2', a:2, b:1},
          {a2:9,  b2:1,  slope:'1/3', a:3, b:1},
        ];
        const {a2, b2, slope, a, b} = choose(cases);
        return {
          latex: `\\dfrac{x^2}{${a2}}-\\dfrac{y^2}{${b2}}=1.\\quad\\text{Positive asymptote slope}=`,
          answer: [slope],
          hint: 'Hyperbola asymptotes are y = ±(b/a)x — what are a and b from the denominators here?',
          step: `a=${a},\\;b=${b},\\;\\text{slope}=\\dfrac{b}{a}=${slope}`
        };
      }

      function gen7(){
        // Circle x² + y² = r²: find radius
        const r = choose([2, 3, 4, 5, 6, 7, 8, 10, 12, 13]);
        const r2 = r * r;
        return {
          latex: `x^2+y^2=${r2}.\\quad\\text{Radius}=`,
          answer: [String(r)],
          hint: 'A circle x²+y²=r² has radius equal to the square root of the right-hand side — what is √' + r2 + '?',
          step: `r=\\sqrt{${r2}}=${r}`
        };
      }

      function gen8(){
        // Identify conic type
        const cases = [
          {eq:`x^2+y^2=25`,       type:'circle',    ans:['circle']},
          {eq:`\\dfrac{x^2}{16}+\\dfrac{y^2}{9}=1`,  type:'ellipse',   ans:['ellipse']},
          {eq:`\\dfrac{x^2}{9}-\\dfrac{y^2}{16}=1`,  type:'hyperbola', ans:['hyperbola']},
          {eq:`x^2=12y`,           type:'parabola',  ans:['parabola']},
          {eq:`y^2=8x`,            type:'parabola',  ans:['parabola']},
          {eq:`\\dfrac{x^2}{25}+\\dfrac{y^2}{4}=1`,  type:'ellipse',   ans:['ellipse']},
          {eq:`\\dfrac{y^2}{4}-\\dfrac{x^2}{9}=1`,   type:'hyperbola', ans:['hyperbola']},
          {eq:`x^2+y^2=49`,       type:'circle',    ans:['circle']},
        ];
        const {eq, type, ans} = choose(cases);
        return {
          latex: `${eq}.\\quad\\text{Conic type}=`,
          answer: ans,
          hint: 'Look at the signs of the squared terms and whether both variables are squared — what conic does that pattern match?',
          step: `\\text{${type}}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

  // PC_8_6: Parametric Equations
  PRECALC_SPIRAL["PC_8_6"] = {
    title: "Parametric Equations",
    index: 42,
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

      function gen1(){
        // Circle x=r·cos(t), y=r·sin(t): find radius
        const r = choose([2, 3, 4, 5, 6, 7, 8, 10]);
        return {
          latex: `x=${r}\\cos t,\\;y=${r}\\sin t.\\quad\\text{Radius}=`,
          answer: [String(r)],
          hint: 'x=r·cos(t) and y=r·sin(t) trace a circle — what value of r gives x²+y²=r²?',
          step: `x^2+y^2=${r}^2\\cos^2t+${r}^2\\sin^2t=${r}^2\\Rightarrow\\text{radius}=${r}`
        };
      }

      function gen2(){
        // Ellipse x=a·cos(t), y=b·sin(t): find a (the larger semi-axis)
        const cases = [
          {a:5, b:3},
          {a:4, b:2},
          {a:6, b:4},
          {a:7, b:5},
          {a:10,b:6},
          {a:3, b:1},
        ];
        const {a, b} = choose(cases);
        return {
          latex: `x=${a}\\cos t,\\;y=${b}\\sin t.\\quad a\\text{ (semi-major axis)}=`,
          answer: [String(a)],
          hint: 'x=a·cos(t) and y=b·sin(t) trace an ellipse — which coefficient is the larger semi-axis length?',
          step: `\\dfrac{x^2}{${a*a}}+\\dfrac{y^2}{${b*b}}=1,\\;a=${a}`
        };
      }

      function gen3(){
        // Evaluate: x = at + b, find x when t = k
        const cases = [
          {a:2, b:1,  k:3,  x:7},
          {a:3, b:2,  k:4,  x:14},
          {a:4, b:-1, k:2,  x:7},
          {a:5, b:0,  k:3,  x:15},
          {a:2, b:3,  k:5,  x:13},
          {a:3, b:-2, k:3,  x:7},
          {a:6, b:1,  k:2,  x:13},
        ];
        const {a, b, k, x} = choose(cases);
        const bStr = b >= 0 ? '+' + b : String(b);
        return {
          latex: `x=${a}t${bStr}.\\quad x\\text{ when }t=${k}:\\;x=`,
          answer: [String(x)],
          hint: 'To find x at a specific t, replace t with that number in the x equation — what does x equal when t=' + k + '?',
          step: `x=${a}(${k})${bStr}=${x}`
        };
      }

      function gen4(){
        // Evaluate: y = t² + c, find y when t = k
        const cases = [
          {c:1,  k:2, y:5},
          {c:3,  k:3, y:12},
          {c:-1, k:4, y:15},
          {c:2,  k:3, y:11},
          {c:0,  k:4, y:16},
          {c:5,  k:2, y:9},
          {c:-4, k:3, y:5},
        ];
        const {c, k, y} = choose(cases);
        const cStr = c >= 0 ? '+' + c : String(c);
        return {
          latex: `y=t^2${cStr}.\\quad y\\text{ when }t=${k}:\\;y=`,
          answer: [String(y)],
          hint: 'To find y at a specific t, replace t with that number in the y equation — what does y equal when t=' + k + '?',
          step: `y=${k}^2${cStr}=${k*k}${cStr}=${y}`
        };
      }

      function gen5(){
        // Shifted circle x=h+r·cos(t), y=k+r·sin(t): find radius
        const cases = [
          {h:2,  k:3,  r:4},
          {h:-1, k:5,  r:3},
          {h:3,  k:-2, r:5},
          {h:0,  k:4,  r:6},
          {h:1,  k:-3, r:7},
          {h:2,  k:0,  r:2},
        ];
        const {h, k, r} = choose(cases);
        const hStr = h >= 0 ? String(h) : '(' + h + ')';
        const kStr = k >= 0 ? '+' + k : String(k);
        return {
          latex: `x=${hStr}+${r}\\cos t,\\;y=${k}+${r}\\sin t.\\quad\\text{Radius}=`,
          answer: [String(r)],
          hint: 'x=h+r·cos(t) and y=k+r·sin(t) trace a circle centered at (h,k) — what is the radius coefficient?',
          step: `\\text{Center}=(${h},${k}),\\;\\text{radius}=${r}`
        };
      }

      function gen6(){
        // Eliminate parameter (linear): x=at+b, y=ct+d; given x find y
        const cases = [
          {a:2, b:1, c:3, d:-2, xGiven:5,  t:2, yResult:4},
          {a:2, b:1, c:3, d:-2, xGiven:7,  t:3, yResult:7},
          {a:3, b:0, c:2, d:1,  xGiven:6,  t:2, yResult:5},
          {a:3, b:0, c:2, d:1,  xGiven:9,  t:3, yResult:7},
          {a:1, b:2, c:4, d:-1, xGiven:5,  t:3, yResult:11},
          {a:2, b:-2,c:3, d:1,  xGiven:4,  t:3, yResult:10},
        ];
        const {a, b, c, d, xGiven, t, yResult} = choose(cases);
        const bStr = b >= 0 ? '+' + b : String(b);
        const dStr = d >= 0 ? '+' + d : String(d);
        return {
          latex: `x=${a}t${bStr},\\;y=${c}t${dStr}.\\quad y\\text{ when }x=${xGiven}:\\;y=`,
          answer: [String(yResult)],
          hint: 'To eliminate the parameter, find t from the x equation — what does t equal when x=' + xGiven + '?',
          step: `t=\\dfrac{${xGiven}-(${b})}{${a}}=${t},\\;y=${c}(${t})${dStr}=${yResult}`
        };
      }

      function gen7(){
        // Eliminate parameter (quadratic): x=t+a, y=t²+b; given x find y
        const cases = [
          {a:1, b:2, xGiven:3,  t:2, yResult:6},
          {a:2, b:1, xGiven:5,  t:3, yResult:10},
          {a:0, b:3, xGiven:4,  t:4, yResult:19},
          {a:1, b:0, xGiven:4,  t:3, yResult:9},
          {a:3, b:1, xGiven:6,  t:3, yResult:10},
          {a:2, b:-1,xGiven:4,  t:2, yResult:3},
        ];
        const {a, b, xGiven, t, yResult} = choose(cases);
        const aStr = a >= 0 ? '-' + a : '+' + Math.abs(a);
        const bStr = b >= 0 ? '+' + b : String(b);
        return {
          latex: `x=t+${a},\\;y=t^2${bStr}.\\quad y\\text{ when }x=${xGiven}:\\;y=`,
          answer: [String(yResult)],
          hint: 'Since x=t+' + a + ', find t from x=' + xGiven + ' — what does y=t²' + (b>=0?'+':'') + b + ' equal at that t?',
          step: `t=${xGiven}${aStr}=${t},\\;y=${t}^2${bStr}=${yResult}`
        };
      }

      function gen8(){
        // Evaluate on a circle: x=r·cos(t), y=r·sin(t); find x at special angle
        const cases = [
          {r:4, tStr:'0',                 xVal:4,  yVal:0,  ask:'x', ans:4},
          {r:6, tStr:'\\dfrac{\\pi}{2}',  xVal:0,  yVal:6,  ask:'y', ans:6},
          {r:5, tStr:'\\pi',              xVal:-5, yVal:0,  ask:'x', ans:-5},
          {r:3, tStr:'\\dfrac{\\pi}{2}',  xVal:0,  yVal:3,  ask:'x', ans:0},
          {r:8, tStr:'0',                 xVal:8,  yVal:0,  ask:'y', ans:0},
          {r:4, tStr:'\\pi',              xVal:-4, yVal:0,  ask:'y', ans:0},
        ];
        const {r, tStr, ask, ans} = choose(cases);
        return {
          latex: `x=${r}\\cos t,\\;y=${r}\\sin t.\\quad ${ask}\\text{ at }t=${tStr}:\\;${ask}=`,
          answer: [String(ans)],
          hint: 'At this special angle, what does ' + (ask === 'x' ? 'cos' : 'sin') + '(t) equal — and therefore what is ' + ask + '?',
          step: `${ask}=${r}\\cdot${ask === 'x' ? '\\cos' : '\\sin'}\\!\\left(${tStr}\\right)=${ans}`
        };
      }
      return [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];
    })()
  };

})(window);