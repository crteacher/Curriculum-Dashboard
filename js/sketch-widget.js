/**
 * sketch-widget.js  —  SketchWidget
 * Shared interactive graph-sketching widget for Curriculum Dashboard.
 *
 * Usage:
 *   const w = new SketchWidget(svgId, fbId, prob, toolbarEl);
 *
 * prob object:
 *   xMin, xMax, yMin, yMax  — axis bounds
 *   tStep                   — x-axis tick spacing (default 1)
 *   hStep                   — y-axis tick spacing (default 1)
 *   xLabel, yLabel          — axis labels (default 'x', 'y')
 *   tolerance               — normalised hit tolerance 0–1 (default 0.06)
 *   fn                      — optional: answer curve function y=fn(x), drawn after Check
 *   staticFn                — optional: reference curve drawn immediately (e.g. show f while sketching f')
 *   staticColor             — stroke color for staticFn (default '#1e3a5c')
 *   expected                — { keypoints:[{x,y,label}], vertex:[{x,y,label}] }
 *   passThreshold           — minimum correct count for success message (default 2)
 *
 * toolbarEl (optional):
 *   If supplied, [data-sktype] buttons inside that element control activeType.
 *   If omitted, document.querySelectorAll('[data-sktype]') is used (legacy behaviour).
 *
 * Marker types:
 *   'keypoint'  — open circle  (navy)   — general key point
 *   'vertex'    — filled diamond (gold) — extremum / flat tangent (slope forced to 0 in spline)
 *
 * Public methods:
 *   checkSketch()   — grade placed markers against expected
 *   showAnswer()    — overlay correct positions
 *   reset()         — clear markers and start fresh
 *
 * Version history:
 *   2026-10-29  extracted from PC_3_2c_Quadratics_Synthesis_Practice.html;
 *               added toolbarEl scoping, staticFn/staticColor, xLabel/yLabel options
 */

class SketchWidget {
  constructor(svgId, fbId, prob, toolbarEl) {
    this.svgEl  = document.getElementById(svgId);
    this.fbEl   = document.getElementById(fbId);
    this.prob   = prob;
    this.markers = []; this.nextId = 0;
    this.checked = false; this.answered = false;
    this._sketchPath = null;
    this.activeType = 'keypoint';
    this.W=480; this.H=280; this.PL=44; this.PR=22; this.PT=20; this.PB=38;
    this.IW = this.W - this.PL - this.PR;
    this.IH = this.H - this.PT - this.PB;

    // Toolbar scoping: prefer supplied container, fall back to document-wide
    const scope = toolbarEl || document;
    scope.querySelectorAll('[data-sktype]').forEach(b => {
      b.addEventListener('click', () => {
        this.activeType = b.dataset.sktype;
        scope.querySelectorAll('[data-sktype]').forEach(x => x.classList.remove('sk-active'));
        b.classList.add('sk-active');
      });
    });

    this._buildGrid();
  }

  // ── Coordinate transforms ──────────────────────────────────────────────────
  tx(x) { const{xMin,xMax}=this.prob; return this.PL+(x-xMin)/(xMax-xMin)*this.IW; }
  ty(y) { const{yMin,yMax}=this.prob; return this.PT+(yMax-y)/(yMax-yMin)*this.IH; }
  fromSVG(sx,sy) {
    const{xMin,xMax,yMin,yMax}=this.prob;
    return { x: xMin+(sx-this.PL)/this.IW*(xMax-xMin),
             y: yMax-(sy-this.PT)/this.IH*(yMax-yMin) };
  }

  // ── Grid + static curves ───────────────────────────────────────────────────
  _buildGrid() {
    const svg = this.svgEl; svg.innerHTML = '';
    const{xMin,xMax,yMin,yMax} = this.prob;
    const GRID='#ddd', AXIS='rgba(38,49,63,0.55)', NAVY='#1e3a5c';

    // clip path
    const defs=this._el('defs'); const cp=this._el('clipPath'); cp.id='sk-clip-'+this.svgEl.id;
    const cr=this._el('rect');
    cr.setAttribute('x',this.PL); cr.setAttribute('y',this.PT);
    cr.setAttribute('width',this.IW); cr.setAttribute('height',this.IH);
    cp.appendChild(cr); defs.appendChild(cp); svg.appendChild(defs);

    // background
    const bg=this._el('rect');
    bg.setAttribute('x',this.PL); bg.setAttribute('y',this.PT);
    bg.setAttribute('width',this.IW); bg.setAttribute('height',this.IH);
    bg.setAttribute('fill','#fafaf8'); svg.appendChild(bg);

    // grid lines + tick labels
    const tStep = this.prob.tStep || 1;
    for(let x=Math.ceil(xMin/tStep)*tStep; x<=xMax+1e-9; x+=tStep) {
      this._ln(svg, this.tx(x),this.PT, this.tx(x),this.H-this.PB, GRID, 1);
      if(x>=xMin) svg.appendChild(this._txt(x%1===0?x:x.toFixed(1), this.tx(x), this.H-this.PB+14, 10,'#777','Georgia,sans-serif','middle'));
    }
    const hStep = this.prob.hStep || 1;
    for(let y=Math.ceil(yMin/hStep)*hStep; y<=yMax+1e-9; y+=hStep) {
      this._ln(svg, this.PL,this.ty(y), this.W-this.PR,this.ty(y), GRID, 1);
      svg.appendChild(this._txt(y%1===0?y:y.toFixed(1), this.PL-7, this.ty(y)+3.5, 10,'#777','Georgia,sans-serif','end'));
    }

    // axes
    const ay=this.ty(0), ax=this.tx(0);
    if(ay>=this.PT && ay<=this.H-this.PB) this._ln(svg, this.PL,ay, this.W-this.PR,ay, AXIS, 1.8);
    if(ax>=this.PL && ax<=this.W-this.PR) this._ln(svg, ax,this.PT, ax,this.H-this.PB, AXIS, 1.8);
    svg.appendChild(this._txt(this.prob.xLabel||'x', this.W-this.PR+6, (ay>=this.PT&&ay<=this.H-this.PB)?ay+4:this.H-this.PB+4, 11, NAVY,'Georgia,sans-serif','start'));
    svg.appendChild(this._txt(this.prob.yLabel||'y', (ax>=this.PL&&ax<=this.W-this.PR)?ax+4:this.PL+4, this.PT-3, 11, NAVY,'Georgia,sans-serif','start'));

    // marker group on top — must exist before _plotCurve so insertBefore has a valid ref
    this.mg = this._el('g'); svg.appendChild(this.mg);

    // optional reference curve (staticFn) — inserted before mg so it sits underneath markers
    if(this.prob.staticFn) this._plotCurve(this.prob.staticFn, this.prob.staticColor||NAVY, 2.2, 1, false);

    svg.addEventListener('click', e => this._click(e));
  }

  // ── Interaction ────────────────────────────────────────────────────────────
  _click(e) {
    if(this.checked) return;
    const r=this.svgEl.getBoundingClientRect();
    const rx=(e.clientX-r.left)*this.W/r.width, ry=(e.clientY-r.top)*this.H/r.height;
    const hit=this._hit(rx,ry); if(hit!==null){this._rm(hit);return;}
    if(rx<this.PL||rx>this.W-this.PR||ry<this.PT||ry>this.H-this.PB) return;
    let{x,y}=this.fromSVG(rx,ry);
    const{xMin,xMax,yMin,yMax}=this.prob;
    x=Math.max(xMin+.01,Math.min(xMax-.01,x));
    y=Math.max(yMin+.01,Math.min(yMax-.01,y));
    const id=this.nextId++; const sx=this.tx(x), sy=this.ty(y);
    this.markers.push({id,type:this.activeType,mx:x,my:y,svgX:sx,svgY:sy,correct:null});
    this._draw(id,this.activeType,sx,sy); this._sketchFromMarkers();
  }
  _hit(sx,sy){for(const m of this.markers){const dx=m.svgX-sx,dy=m.svgY-sy;if(dx*dx+dy*dy<196)return m.id;}return null;}
  _rm(id){this.markers=this.markers.filter(m=>m.id!==id);const el=this.mg.querySelector('[data-mid="'+id+'"]');if(el)el.remove();this._sketchFromMarkers();}

  // ── Spline through placed markers ──────────────────────────────────────────
  _sketchFromMarkers() {
    const old=this.svgEl.querySelector('#sk-sketch-'+this.svgEl.id); if(old) old.remove();
    if(this.markers.length<2){this._sketchPath=null;return;}
    const pts=[...this.markers].sort((a,b)=>a.mx-b.mx).map(m=>({
      x:m.mx, y:m.my, s:(m.type==='vertex')?0:null
    }));
    // Catmull-Rom slopes: use (p[i+1].y - p[i-1].y) / (p[i+1].x - p[i-1].x)
    // for interior keypoints; endpoints use one-sided difference
    for(let i=0;i<pts.length;i++){
      if(pts[i].s!==null) continue; // vertex already locked to 0
      const L=i>0?pts[i-1]:null, R=i<pts.length-1?pts[i+1]:null;
      if(L&&R) pts[i].s=(R.y-L.y)/(R.x-L.x);
      else if(L) pts[i].s=(pts[i].y-L.y)/(pts[i].x-L.x);
      else if(R) pts[i].s=(R.y-pts[i].y)/(R.x-pts[i].x);
      else pts[i].s=0;
    }
    const{xMin,xMax,yMin,yMax}=this.prob; const path=[];
    const f=pts[0]; path.push([xMin, f.y+f.s*(xMin-f.x)]);
    for(let i=0;i<pts.length-1;i++){
      const p0=pts[i],p1=pts[i+1],dt=p1.x-p0.x; if(Math.abs(dt)<1e-9) continue;
      // Scale slopes by segment length (Catmull-Rom convention) to avoid overshooting
      const s0=p0.s*dt, s1=p1.s*dt;
      for(let j=0;j<=60;j++){
        const t=j/60,h00=2*t**3-3*t**2+1,h10=t**3-2*t**2+t,h01=-2*t**3+3*t**2,h11=t**3-t**2;
        path.push([p0.x+t*dt, h00*p0.y+h10*s0+h01*p1.y+h11*s1]);
      }
    }
    const lp=pts[pts.length-1]; path.push([xMax, lp.y+lp.s*(xMax-lp.x)]);
    // Store math-coordinate path for curve sampling in checkSketch
    this._sketchPath = path;
    const ptStr=path.map(([x,y])=>this.tx(x).toFixed(1)+','+this.ty(Math.max(yMin-.5,Math.min(yMax+.5,y))).toFixed(1)).join(' ');
    const p=this._el('polyline');
    p.setAttribute('id','sk-sketch-'+this.svgEl.id);
    p.setAttribute('points',ptStr);
    p.setAttribute('fill','none'); p.setAttribute('stroke','#7a5c1e'); p.setAttribute('stroke-width','2');
    p.setAttribute('stroke-dasharray','7,4'); p.setAttribute('opacity','.8');
    p.setAttribute('clip-path','url(#sk-clip-'+this.svgEl.id+')'); p.setAttribute('stroke-linejoin','round');
    this.svgEl.insertBefore(p,this.mg);
  }

  // ── Curve-shape sampling ───────────────────────────────────────────────────
  // Interpolate the stored sketch path at a given math x-coordinate.
  _sampleSketch(x) {
    const path=this._sketchPath; if(!path||path.length<2) return null;
    if(x<path[0][0]||x>path[path.length-1][0]) return null;
    for(let i=0;i<path.length-1;i++){
      if(path[i][0]<=x&&x<=path[i+1][0]){
        const dx=path[i+1][0]-path[i][0];
        if(Math.abs(dx)<1e-9) return path[i][1];
        const t=(x-path[i][0])/dx;
        return path[i][1]+t*(path[i+1][1]-path[i][1]);
      }
    }
    return null;
  }

  // Sample sketch against fn at N evenly-spaced x-values.
  // Returns {hits, total, frac, pass} or null if fn/path unavailable.
  // curveTolerance (prob field, default 0.25): fraction of yRange allowed as error per point.
  // curvePassFrac  (prob field, default 0.60): fraction of sample points that must pass.
  _checkCurve() {
    const{fn,xMin,xMax,yMin,yMax}=this.prob;
    if(!fn||!this._sketchPath||this._sketchPath.length<2) return null;
    const yRange=yMax-yMin;
    const tol=yRange*(this.prob.curveTolerance!=null?this.prob.curveTolerance:0.25);
    const needed=this.prob.curvePassFrac!=null?this.prob.curvePassFrac:0.60;
    const N=16; let hits=0,total=0;
    for(let i=1;i<=N;i++){
      const x=xMin+i/(N+1)*(xMax-xMin);
      const ey=fn(x); if(!isFinite(ey)||ey<yMin-yRange||ey>yMax+yRange) continue;
      const sy=this._sampleSketch(x); if(sy===null) continue;
      total++;
      if(Math.abs(sy-ey)<=tol) hits++;
    }
    if(total===0) return null;
    return{hits,total,frac:hits/total,pass:(hits/total)>=needed};
  }

  // ── Marker rendering ───────────────────────────────────────────────────────
  _draw(id,type,sx,sy,state) {
    const NAVY='#1e3a5c',GOLD='#7a5c1e',HIT='#3f7a52',MISS='#b3413a',ANS='rgba(30,58,92,0.28)';
    const g=this._el('g'); g.setAttribute('data-mid',id); g.style.cursor='pointer';
    let el;
    if(type==='keypoint'){
      el=this._el('circle'); el.setAttribute('cx',sx); el.setAttribute('cy',sy); el.setAttribute('r',7);
      el.setAttribute('fill','white');
      el.setAttribute('stroke',state==='hit'?HIT:state==='miss'?MISS:state==='answer'?ANS:NAVY);
      el.setAttribute('stroke-width',2.2);
    } else {
      const r=8; el=this._el('polygon');
      el.setAttribute('points',sx+','+(sy-r)+' '+(+sx+r)+','+sy+' '+sx+','+(+sy+r)+' '+(sx-r)+','+sy);
      el.setAttribute('fill',state==='hit'?HIT:state==='miss'?MISS:state==='answer'?ANS:GOLD);
    }
    g.appendChild(el); this.mg.appendChild(g);
  }

  // ── Grading ────────────────────────────────────────────────────────────────
  checkSketch() {
    if(this.checked) return; this.checked=true;
    const{expected}=this.prob;
    const xRange=this.prob.xMax-this.prob.xMin, yRange=this.prob.yMax-this.prob.yMin;
    const tol=this.prob.tolerance||0.06;
    const tm={keypoints:'keypoint',vertex:'vertex'};
    let correct=0,total=0; const results=[];
    for(const[key,pts] of Object.entries(expected)){
      const mt=tm[key];
      for(const ep of pts){
        total++;
        const cands=this.markers.filter(m=>m.type===mt);
        let best=Infinity,bestId=null;
        for(const m of cands){
          const dx=(m.mx-ep.x)/xRange, dy=(m.my-ep.y)/yRange;
          const d=Math.sqrt(dx*dx+dy*dy); if(d<best){best=d;bestId=m.id;}
        }
        const hit=best<=tol;
        if(hit){correct++;const m=this.markers.find(m=>m.id===bestId);if(m)m.correct=true;}
        results.push({key,ep,hit});
      }
    }
    for(const m of this.markers) if(m.correct===null) m.correct=false;
    // Check curve shape BEFORE _curve() removes the sketch
    const curveResult=this._checkCurve();
    this.mg.innerHTML='';
    for(const m of this.markers) this._draw(m.id,m.type,m.svgX,m.svgY,m.correct===true?'hit':'miss');
    this._curve(); this._showFB(results,correct,total,curveResult);
  }

  showAnswer() {
    if(!this.checked) this.checkSketch(); if(this.answered) return; this.answered=true;
    const tm={keypoints:'keypoint',vertex:'vertex'}; let aid=10000;
    for(const[key,pts] of Object.entries(this.prob.expected))
      for(const ep of pts) this._draw(aid++,tm[key],this.tx(ep.x),this.ty(ep.y),'answer');
  }

  // ── Answer curve (drawn after Check) ──────────────────────────────────────
  _curve() {
    const{fn}=this.prob; if(!fn) return;
    this._plotCurve(fn,'#1e3a5c',2.5,0.6,true);
  }

  _plotCurve(fn,color,width,opacity,removeSketch) {
    if(removeSketch){const sk=this.svgEl.querySelector('#sk-sketch-'+this.svgEl.id);if(sk)sk.remove();}
    const{xMin,xMax,yMin,yMax}=this.prob; const N=300; const pts=[];
    for(let i=0;i<=N;i++){
      const x=xMin+i/N*(xMax-xMin), y=fn(x);
      if(y<yMin-2||y>yMax+2) continue;
      pts.push(this.tx(x).toFixed(1)+','+this.ty(Math.max(yMin-.5,Math.min(yMax+.5,y))).toFixed(1));
    }
    const p=this._el('polyline'); p.setAttribute('points',pts.join(' '));
    p.setAttribute('fill','none'); p.setAttribute('stroke',color);
    p.setAttribute('stroke-width',width); p.setAttribute('opacity',opacity);
    p.setAttribute('clip-path','url(#sk-clip-'+this.svgEl.id+')');
    p.setAttribute('stroke-linejoin','round');
    this.svgEl.insertBefore(p,this.mg);
  }

  // ── Feedback ───────────────────────────────────────────────────────────────
  _showFB(results,correct,total,curveResult) {
    const kl={keypoints:'Key Point',vertex:'Vertex'};
    let html='<div style="margin-bottom:.4rem;font-weight:700;color:#1e3a5c">'+correct+'/'+total+' key features identified</div>';
    for(const r of results)
      html+='<div class="sk-feat '+(r.hit?'hit':'miss')+'"><span>'+(r.hit?'✓':'✗')+'</span><span><strong>'+kl[r.key]+':</strong> '+r.ep.label+'</span></div>';
    // Curve shape row — only shown when fn is defined and sketch has ≥2 markers
    if(curveResult!==null){
      const pct=Math.round(curveResult.frac*100);
      if(curveResult.pass)
        html+='<div class="sk-feat hit"><span>✓</span><span><strong>Curve shape:</strong> '+curveResult.hits+'/'+curveResult.total+' sampled points match ('+pct+'%)</span></div>';
      else
        html+='<div class="sk-feat miss"><span>✗</span><span><strong>Curve shape:</strong> only '+curveResult.hits+'/'+curveResult.total+' sampled points within tolerance ('+pct+'%) — adjust your curve</span></div>';
    }
    // "Well done" requires all expected markers AND curve shape (if checkable)
    const threshold=this.prob.passThreshold!=null?this.prob.passThreshold:total;
    const curveOk=curveResult===null||curveResult.pass;
    if(correct>=threshold&&curveOk)
      html+='<div style="margin-top:.45rem;color:#3f7a52;font-weight:700">✓ Well done!</div>';
    else if(correct>=threshold&&!curveOk)
      html+='<div style="margin-top:.45rem;color:#b3413a;font-weight:700">Markers correct — but adjust the curve shape.</div>';
    this.fbEl.innerHTML=html;
  }

  reset() {
    this.markers=[]; this.nextId=0; this.checked=false; this.answered=false;
    this._sketchPath=null; this.fbEl.innerHTML=''; this._buildGrid();
  }

  // ── SVG helpers ────────────────────────────────────────────────────────────
  _el(t){return document.createElementNS('http://www.w3.org/2000/svg',t);}
  _ln(p,x1,y1,x2,y2,s,w){const l=this._el('line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('stroke',s);l.setAttribute('stroke-width',w);p.appendChild(l);return l;}
  _txt(text,x,y,size,fill,family,anchor){const t=this._el('text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('font-size',size);t.setAttribute('fill',fill);t.setAttribute('font-family',family);if(anchor)t.setAttribute('text-anchor',anchor);t.textContent=text;return t;}
}
