(() => {
'use strict';
const scene=document.querySelector('.scene'),image=scene.querySelector('img');
const canvas=document.createElement('canvas');canvas.className='instrument';canvas.tabIndex=0;canvas.setAttribute('role','slider');canvas.setAttribute('aria-label','Galileo. Arrastrá el telescopio o usá izquierda y derecha para cambiar el sector. Arriba y abajo cambian la apertura. Los agentes procesan la observación y Art crea.');canvas.setAttribute('aria-valuemin','-65');canvas.setAttribute('aria-valuemax','37');scene.append(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
const source=new Image();source.src='leonardo-cosmos.png';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const MIN=-1.13,MAX=.65,STEP=(MAX-MIN)/6;
const sectors=[{name:'Política',color:'#edb46c'},{name:'Economía',color:'#80d8b4'},{name:'Social',color:'#86c9ef'},{name:'Marcas',color:'#d8a0e7'},{name:'Legal',color:'#e6d5ad'},{name:'Escucha social',color:'#fa9caa'}];
const pivot={x:714,y:280},hand={x:300,y:555};
let scrollExpansion=0,beyond=false,angleBeyond=false,scrollBeyond=false,flowPhase=0,completed=false;
const SPAN=MAX-MIN,PERIOD=SPAN*2;
function normalAngle(value){return MIN+((value-MIN)%PERIOD+PERIOD)%PERIOD;}
function observationAngle(value){const a=normalAngle(value);return a>MAX?MIN+(a-MAX):a;}
function syncRealm(){
 const next=angleBeyond||scrollBeyond;if(next===beyond)return;
 beyond=next;scene.dataset.beyond=String(beyond);document.body.dataset.beyond=String(beyond);
 document.dispatchEvent(new CustomEvent('davinci:realm',{detail:beyond}));
}
function setAim(value){target=value;angleBeyond=normalAngle(value)>MAX+1e-9;syncRealm();}
let angle=-.20,target=angle,aperture=.17,targetAperture=.17,scale=1,dx=0,dy=0,frame=0,last=0,drag=null,mode=-1,previous=0,blend=1;
// A galaxy inhabits Leonardo's silhouette and converges on his left writing hand.
const bodyOutline=[[531,230],[620,204],[716,211],[753,282],[777,266],[852,251],[878,340],[937,431],[975,575],[961,660],[1010,710],[1050,786],[1138,1017],[580,1023],[459,814],[405,654],[356,736],[320,708],[331,611],[300,580],[278,554],[281,517],[310,503],[414,472],[465,406],[520,380],[543,325]];
const bodyStars=(globalThis.DAVINCI_PARTICLES||[]).flatMap(([x,y],i)=>Array.from({length:3},(_,j)=>({x:x+Math.sin(i*7.13+j*2.4)*11,y:y+Math.cos(i*5.71+j*1.7)*11,phase:i*2.399+j*1.3,size:.45+(i+j)%4*.25})));
const bodyPalette=['#82dfff','#bfa2ff','#ffd4a1','#a9eddf','#eef6ff'];
const bodySources=[{x:647,y:268},{x:828,y:319},{x:866,y:487},{x:727,y:589},{x:831,y:736},{x:625,y:839},{x:978,y:895}];
function bodyStreamPoint(origin,u,lane){
 const v=1-u,p1={x:origin.x*.35+620*.65,y:origin.y>.65*1024?640:430},p2={x:440,y:470+lane*7};
 return {x:v*v*v*origin.x+3*v*v*u*p1.x+3*v*u*u*p2.x+u*u*u*hand.x,y:v*v*v*origin.y+3*v*v*u*p1.y+3*v*u*u*p2.y+u*u*u*hand.y};
}
function drawBodyParticles(t){
 ctx.save();ctx.beginPath();bodyOutline.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
 ctx.fillStyle='rgba(3,9,24,.30)';ctx.fillRect(275,200,880,824);
 const clock=reduced.matches?0:flowPhase*.0012;
 for(const [x,y,r,tone] of [[672,445,200,'#607aff'],[769,704,280,'#526bd6'],[486,530,140,'#38c3de'],[660,300,110,'#d7a3ff']]){
  const fog=ctx.createRadialGradient(x,y,0,x,y,r);fog.addColorStop(0,tone+'50');fog.addColorStop(.45,tone+'25');fog.addColorStop(1,tone+'00');ctx.fillStyle=fog;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 for(let i=0;i<bodyStars.length;i++){
  const p=bodyStars[i],wave=reduced.matches?0:Math.sin(clock+p.phase);
  ctx.fillStyle=bodyPalette[i%5];ctx.globalAlpha=.24+(i%5)*.09+wave*.06;
  ctx.fillRect(p.x+wave*2,p.y+(reduced.matches?0:Math.cos(clock*.8+p.phase)*2),p.size,p.size);
 }
 // Seven streams bind head, raised arm, chest, robes and knee to the writing hand.
 bodySources.forEach((origin,lane)=>{
  const tone=bodyPalette[lane%5];ctx.strokeStyle=tone+'35';ctx.lineWidth=.55;
  for(let strand=0;strand<3;strand++){
   ctx.globalAlpha=.6;ctx.beginPath();for(let j=0;j<=32;j++){const u=j/32,p=bodyStreamPoint(origin,u,lane-3),spread=Math.sin(u*Math.PI)*(strand-1)*14;const x=p.x+spread,y=p.y+Math.sin(u*9+lane+clock)*Math.sin(u*Math.PI)*6;j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  }
  for(let j=0;j<62;j++){
   const u=(j/62+(reduced.matches?0:clock*(.055+lane*.003)))%1,p=bodyStreamPoint(origin,u,lane-3);
   const sway=Math.sin(u*Math.PI)*Math.sin(j*2.4+clock)*10;
   ctx.globalAlpha=.30+Math.sin(u*Math.PI)*.42;ctx.fillStyle=j%9===0?'#fff6df':tone;
   dot(p.x+sway,p.y+sway*.35,.65+(j%4)*.3);
  }
 });
 // The constellation concentrates into the tip that turns observation into art.
 const glow=ctx.createRadialGradient(hand.x,hand.y,0,hand.x,hand.y,28);glow.addColorStop(0,'rgba(255,225,173,.65)');glow.addColorStop(.3,'rgba(127,219,255,.22)');glow.addColorStop(1,'rgba(127,219,255,0)');ctx.globalAlpha=1;ctx.fillStyle=glow;dot(hand.x,hand.y,28);
 ctx.restore();
}
function sector(a){return Math.max(0,Math.min(5,Math.floor((a-MIN)/STEP)));}
function updateMode(){const next=sector(observationAngle(angle));if(next!==mode){previous=mode<0?next:mode;mode=next;blend=reduced.matches?1:0;canvas.setAttribute('aria-valuetext',sectors[mode].name+'; datos procesados por agentes y convertidos en creación.');}if(beyond)canvas.setAttribute('aria-valuetext','Lado oscuro. Segui girando el haz para volver a Leonardo desde el otro limite. Home recupera la escena.');canvas.setAttribute('aria-valuenow',Math.round(observationAngle(angle)*180/Math.PI));}
function resize(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);const mobile=r.width<700;scale=Math.min(r.width/(mobile?1160:1536),r.height/1024);dx=(r.width-(mobile?1160:1536)*scale)/2-(mobile?50*scale:0);dy=(r.height-1024*scale)/2;Object.assign(image.style,{left:dx+'px',top:dy+'px',width:1536*scale+'px',height:1024*scale+'px'});paint(0);}
function point(e){const r=canvas.getBoundingClientRect();return{x:(r.width-(e.clientX-r.left)-dx)/scale,y:(e.clientY-r.top-dy)/scale};}
let pointerAngle=null;
function aim(p){const raw=Math.atan2(p.y-pivot.y,p.x-pivot.x);
 if(pointerAngle===null){if(!beyond)setAim(raw);}else setAim(target+Math.atan2(Math.sin(raw-pointerAngle),Math.cos(raw-pointerAngle)));
 pointerAngle=raw;if(reduced.matches)start();}
function line(a,b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
function dot(x,y,r){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
// Six distinct visual data signatures. No labels or rendered text.
function dataGlyph(kind,x,y,size,t){ctx.save();ctx.translate(x,y);ctx.scale(size/100,size/100);ctx.lineWidth=1.5;const phase=reduced.matches?0:t*.00035;
if(kind===0){for(let ring=0;ring<3;ring++)for(let i=0;i<9+ring*4;i++){const a=Math.PI+i/(8+ring*4)*Math.PI;dot(Math.cos(a)*(22+ring*12),Math.sin(a)*(22+ring*12),2.4);}line({x:-48,y:8},{x:48,y:8});}
if(kind===1){for(let i=0;i<7;i++){const x=-40+i*12,y=22-i*7+Math.sin(i+phase)*7;line({x,y:y-14},{x,y:y+14});ctx.strokeRect(x-3,y-5,6,10);}line({x:-45,y:40},{x:45,y:40});}
if(kind===2){const pts=Array.from({length:7},(_,i)=>({x:Math.cos(i*2.4)*36,y:Math.sin(i*2.4)*36}));pts.forEach((p,i)=>{line(p,pts[(i+2)%7]);dot(p.x,p.y,3.5)});}
if(kind===3){for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*Math.PI/3+phase*.1);ctx.strokeRect(-25,-25,50,50);ctx.restore();}dot(0,0,5);}
if(kind===4){for(let i=0;i<3;i++){ctx.strokeRect(-38+i*8,-35+i*9,62,70);}for(let i=0;i<4;i++)line({x:-15,y:-13+i*11},{x:25-i*3,y:-13+i*11});}
if(kind===5){ctx.beginPath();for(let i=0;i<=70;i++){const x=i/70*90-45,y=Math.sin(i*.5+phase)*Math.sin(i/70*Math.PI)*24;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);ctx.stroke();}
ctx.restore();}
function observation(t){ctx.save();for(let k=0;k<6;k++){const a=MIN+k*STEP,b=a+STEP,tone=sectors[k].color;ctx.strokeStyle=tone+(k===mode?'d0':'40');ctx.lineWidth=k===mode?2:1;ctx.beginPath();ctx.arc(pivot.x,pivot.y,280,a+.012,b-.012);ctx.stroke();line({x:pivot.x+266*Math.cos(a),y:pivot.y+266*Math.sin(a)},{x:pivot.x+294*Math.cos(a),y:pivot.y+294*Math.sin(a)});ctx.fillStyle=tone;const mid=(a+b)/2;ctx.globalAlpha=k===mode?1:.4;dataGlyph(k,pivot.x+245*Math.cos(mid),pivot.y+245*Math.sin(mid),44,t);}ctx.globalAlpha=1;ctx.restore();}
function brain(t,tone){
ctx.save();const clock=reduced.matches?0:t*.00016,activity=(aperture-.12)/.3;
const glow=ctx.createRadialGradient(635,264,10,635,264,142);glow.addColorStop(0,tone+'55');glow.addColorStop(.55,tone+'18');glow.addColorStop(1,tone+'00');ctx.fillStyle=glow;ctx.fillRect(490,115,290,300);
// A local model constellation: input router, three specialist models, output synthesis.
const router={x:673,y:270},models=[{x:627,y:223},{x:591,y:269},{x:629,y:312}],output={x:573,y:307};
function link(a,b,id,active){ctx.strokeStyle=active?tone+'b0':tone+'40';ctx.lineWidth=active?1.35:.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x-15,a.y,b.x+15,b.y,b.x,b.y);ctx.stroke();if(active){const u=reduced.matches?.5:(clock*2+id*.17)%1,v=1-u;const x=v*v*v*a.x+3*v*v*u*(a.x-15)+3*v*u*u*(b.x+15)+u*u*u*b.x;const y=v*v*v*a.y+3*v*v*u*a.y+3*v*u*u*b.y+u*u*u*b.y;ctx.fillStyle='#fff';ctx.shadowColor=tone;ctx.shadowBlur=10;ctx.fillRect(x-2,y-1.4,4,2.8);ctx.shadowBlur=0;}}
link(pivot,router,0,true);models.forEach((model,i)=>{link(router,model,i+1,i===mode%3||activity>.6);link(model,output,i+5,i===mode%3||activity>.6)});
ctx.strokeStyle=tone+'35';ctx.lineWidth=.65;ctx.beginPath();ctx.ellipse(635,266,101,86,-.18,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(635,266,110,94,-.18,clock,clock+Math.PI*1.15);ctx.stroke();
models.forEach((model,i)=>{
 const active=i===mode%3;ctx.save();ctx.translate(model.x,model.y);
 ctx.fillStyle='#0b1529a0';ctx.strokeStyle=active?tone+'ef':tone+'70';ctx.lineWidth=active?1.25:.8;
 ctx.shadowColor=tone;ctx.shadowBlur=active?13:0;
 // Each model is a stack of learned layers, rather than an isolated neuron.
 for(let layer=2;layer>=0;layer--){const d=layer*4;ctx.beginPath();ctx.moveTo(-19,-9+d);ctx.lineTo(0,-19+d);ctx.lineTo(19,-9+d);ctx.lineTo(0,1+d);ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.shadowBlur=0;ctx.fillStyle=active?'#fff4df':tone;
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){ctx.globalAlpha=active?.4+.6*(.5+.5*Math.sin(clock*8+row+col)):.3;dot(-8+col*7,-10+row*4,1.2)}ctx.globalAlpha=1;
 ctx.beginPath();ctx.arc(0,0,28,-Math.PI/2,clock+i+Math.PI*.7);ctx.stroke();ctx.restore();
});
// The agent router coordinates models and merges their responses before acting.
for(const [n,rad] of [[router,10],[output,9]]){ctx.strokeStyle=tone;ctx.fillStyle='#101e2ee0';ctx.beginPath();for(let j=0;j<=6;j++){const a=j*Math.PI/3-Math.PI/2;j?ctx.lineTo(n.x+Math.cos(a)*rad,n.y+Math.sin(a)*rad):ctx.moveTo(n.x+Math.cos(a)*rad,n.y+Math.sin(a)*rad)}ctx.fill();ctx.stroke();ctx.fillStyle='#fff';dot(n.x,n.y,2.4);}
// Instructions are emitted through the shoulder to Leonardo's LEFT hand.
const path=[output,{x:550,y:352},{x:510,y:411},{x:445,y:459},{x:370,y:492},hand];path.forEach((n,i)=>{if(i)link(path[i-1],n,9+i,true)});
ctx.restore();}
function creation(kind,alpha,t){if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;const tone=sectors[kind].color;ctx.translate(155,565);ctx.strokeStyle=tone;ctx.fillStyle=tone;ctx.shadowColor=tone;ctx.shadowBlur=12;
// Art composes one output from the selected information, not a gallery of unrelated objects.
ctx.lineWidth=1;ctx.save();ctx.rotate(-.12);ctx.strokeRect(-110,-125,220,270);ctx.restore();dataGlyph(kind,0,-15,164,t);ctx.shadowBlur=0;for(let i=0;i<4;i++){ctx.globalAlpha=alpha*.45;ctx.strokeRect(-87+i*45,95,27,3+(kind+i)%5*4);}ctx.globalAlpha=alpha;ctx.beginPath();ctx.ellipse(0,-15,105,105,angle*.2,0,Math.PI*2);ctx.stroke();
for(let i=0;i<15;i++){const phase=reduced.matches?.5:(t*.00028+i*.067)%1;const x=hand.x-155-phase*145,y=hand.y-565+Math.sin(phase*Math.PI*2+i)*phase*20;ctx.globalAlpha=alpha*(1-phase);dot(x,y,1.5+(i%3)*.5);}ctx.restore();}
function flowIntensity(){const manual=Math.max(0,Math.min(1,(aperture-.12)/.30));return manual+(1-manual)*scrollExpansion;}
function drawFlow(halfAngle,reach,color){
 const intensity=flowIntensity(),count=Math.round(28+intensity*132);
 const length=Math.min(reach,1200),inner=Math.min(60,length*.08),travel=Math.max(1,length-inner);
 const phase=reduced.matches?0:flowPhase;
 ctx.save();ctx.fillStyle=color;
 for(let i=0;i<count;i++){
  const distance=inner+((i*71.37-phase)%travel+travel)%travel;
  const direction=Math.sin(i*8.13)*halfAngle;
  const fade=Math.min(1,(distance-inner)/45)*Math.min(1,(length-distance)/90);
  ctx.globalAlpha=(.20+intensity*.20)*fade;
  dot(Math.cos(direction)*distance,Math.sin(direction)*distance,.8+(i%3)*.35+intensity*.4);
  if(!reduced.matches&&intensity>.2){ctx.strokeStyle=color;ctx.lineWidth=.5;ctx.globalAlpha=.09*intensity*fade;line({x:Math.cos(direction)*distance,y:Math.sin(direction)*distance},{x:Math.cos(direction)*(distance+2+intensity*8),y:Math.sin(direction)*(distance+2+intensity*8)});}
 }ctx.restore();
}
const nebulaColors=['#a375ff','#46cfff','#f266cf','#ffb875','#5b82ff','#57e3c4','#df82ff'];
const nebulaCenters=[[-.34,-.29],[.27,-.33],[-.12,.04],[.36,.14],[-.35,.32],[.12,.36],[.02,-.37]];
function nebulas(r,workers){
 const time=reduced.matches?0:flowPhase*.0012;
 ctx.save();ctx.fillStyle='#070418';ctx.fillRect(-r.width/2,-r.height/2,r.width,r.height);
 ctx.globalCompositeOperation='screen';
 nebulaCenters.forEach(([x,y],i)=>{
  const load=workers?.[i]?.load??.4,activity=workers?.[i]?.status==='offline'?.25:1;
  for(let cloud=0;cloud<3;cloud++){
   const phase=i*1.7+cloud*2.1;
   const cx=x*r.width+Math.sin(time+phase)*r.width*.035+cloud*r.width*.025;
   const cy=y*r.height+Math.cos(time*.8+phase)*r.height*.04;
   const radius=Math.min(r.width,r.height)*(.20+cloud*.07+load*.07);
   const fog=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
   fog.addColorStop(0,nebulaColors[i]+(cloud===0?'65':'35'));fog.addColorStop(.35,nebulaColors[(i+cloud)%7]+'28');fog.addColorStop(1,nebulaColors[i]+'00');
   ctx.globalAlpha=activity;ctx.fillStyle=fog;ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);
  }
 });ctx.restore();
}
// A deterministic cloud of ink fragments; no per-frame random flicker.
const darkDust=Array.from({length:3600},(_,i)=>({u:(i*.61803398875)%1,v:(i*.754877666)%1,phase:i*2.399,size:.45+(i%5)*.24}));
function darkArt(r,workers){
 const intensity=flowIntensity(),clock=reduced.matches?0:flowPhase*.003;
 const count=Math.round((r.width<700?1100:2200)*(1+intensity*.6));
 const width=r.width,height=r.height;
 ctx.save();ctx.fillStyle='#edf3ff';
 for(let i=0;i<count;i++){
  const p=darkDust[i],worker=workers?.[i%7],load=worker?.load??.4;
  const moving=!reduced.matches&&(!worker||worker.status==='running');
  const time=moving?clock*(.6+load*.6):0;
  const x=(p.u-.5)*width+Math.sin(p.v*13+time+p.phase*.03)*width*.065;
  const y=((p.v+time*(.028+load*.024))%1-.5)*height+Math.sin(p.u*15-time*.8)*height*.045;
  const alpha=(.13+(i%7)*.034)*(worker?.status==='offline'?.2:1);
  ctx.globalAlpha=alpha*(1.3+intensity*.3);ctx.fillStyle=i%5===0?'#fff6ed':nebulaColors[i%7];
  if(i%11===0){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3+p.size*4,y-2-p.size*2);ctx.lineTo(x+1,y+4+p.size*2);ctx.closePath();ctx.fill();}
  else ctx.fillRect(x,y,p.size,p.size*(i%4===0?3.5:1));
 }
 ctx.globalAlpha=1;
 // Long calligraphic currents drift through the seven worker regions.
 for(let strand=0;strand<30;strand++){
  ctx.strokeStyle=nebulaColors[strand%7]+'65';ctx.lineWidth=strand%6===0?1.15:.45;
  ctx.beginPath();
  for(let j=0;j<=64;j++){
   const u=j/64,x=(u-.5)*width*1.2;
   const y=Math.sin(u*7+strand*.29+clock*.55)*height*(.09+strand%4*.025)+(strand/29-.5)*height*.85+Math.sin(u*19-clock+strand)*height*.018;
   j?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }ctx.stroke();
 }
 // Broken architectural planes interleave with the organic brushwork.
 for(let i=0;i<18;i++){
  const x=(((i*.618)%1)-.5)*width,y=(((i*.381)%1)-.5)*height;
  const span=Math.min(width,height)*(.045+i%4*.02),drift=reduced.matches?0:Math.sin(clock*.6+i)*span*.09;
  ctx.strokeStyle=nebulaColors[i%7]+'60';ctx.lineWidth=.55;ctx.beginPath();ctx.moveTo(x-span,y+drift);ctx.lineTo(x,y-span*.8);ctx.lineTo(x+span*.8,y+span*.2+drift);ctx.lineTo(x+span*.3,y+span);ctx.stroke();
 }
 ctx.restore();
}
function projectOrbitPoint(x,y,z,tilt,yaw,focal){
 const cy=Math.cos(yaw),sy=Math.sin(yaw),ct=Math.cos(tilt),st=Math.sin(tilt);
 const rx=x*cy+z*sy,rz=z*cy-x*sy;
 const ry=y*ct-rz*st,depth=y*st+rz*ct;
 const perspective=focal/(focal-depth);
 return {x:rx*perspective,y:ry*perspective,z:depth,scale:perspective};
}
function orbital3D(size,index,worker,tone){
 const active=worker.status==='running',motion=reduced.matches||!active?0:flowPhase*.0015;
 const tilt=.65+Math.sin(motion*.7+index)*.48,yaw=motion*(.6+worker.load*.6)+index*.73;
 const segments=[],sparks=[],focal=size*5;
 for(let ring=0;ring<5;ring++){
  const radius=size*(.65+ring*.17),spin=motion*(ring%2?-.6:.8)+ring*.37;
  let previous;
  for(let j=0;j<=48;j++){
   const a=j/48*Math.PI*2+spin,ripple=1+.09*Math.sin(a*(3+index%3)+ring);
   const point=projectOrbitPoint(Math.cos(a)*radius*ripple,Math.sin(a)*radius*ripple,Math.sin(a*2+ring)*size*.12,tilt+ring*.26,yaw,focal);
   if(previous)segments.push({a:previous,b:point,z:(previous.z+point.z)/2,ring});previous=point;
   if(j<48&&j%8===0)sparks.push({point,ring});
  }
 }
 const hole=index===0||index===3||index===5;
 if(hole){let previous;for(let j=0;j<=64;j++){const a=j/64*Math.PI*2+motion;const point=projectOrbitPoint(Math.cos(a)*size*.59,Math.sin(a)*size*.59,0,1.23+Math.sin(motion*.6+index)*.18,yaw,focal);if(previous)segments.push({a:previous,b:point,z:(previous.z+point.z)/2,disc:true});previous=point;}}
 function pass(front){
  ctx.strokeStyle=tone;
  for(const s of segments){if((s.z>=0)!==front)continue;ctx.strokeStyle=s.disc&&front?'#ffe2bb':tone;ctx.globalAlpha=(s.disc?(front?.9:.2):(front?.55:.16))*(worker.status==='offline'?.25:1);ctx.lineWidth=(s.disc?(front?1.5:.65):(front?.75:.45))*(s.a.scale+s.b.scale)/2;line(s.a,s.b);}
  for(const {point,ring} of sparks){if((point.z>=0)!==front)continue;ctx.globalAlpha=front?.85:.22;ctx.fillStyle=ring%2?tone:'#ffe8cf';const radius=(1+worker.load)*point.scale;ctx.fillRect(point.x-radius/2,point.y-radius/2,radius,radius);}
 }
 ctx.save();pass(false);
 const core=size*(hole?.27:.13),halo=ctx.createRadialGradient(0,0,core*.5,0,0,core*3);
 halo.addColorStop(0,tone+'10');halo.addColorStop(.4,tone+'80');halo.addColorStop(1,tone+'00');ctx.globalAlpha=1;ctx.fillStyle=halo;dot(0,0,core*3);
 ctx.fillStyle=hole?'#020109':tone+'35';dot(0,0,core);
 ctx.strokeStyle=tone+'d0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,core*1.05,0,Math.PI*2);ctx.stroke();
 pass(true);
 ctx.restore();
}
function paintBeyond(r,t){
// Distributed white geometry breathes slowly; scrolling still opens the field.
ctx.save();ctx.translate(r.width/2,r.height/2);
const reach=Math.hypot(r.width,r.height),opening=aperture+(Math.PI-aperture)*scrollExpansion;
const clock=reduced.matches?0:t*.00009;
const workers=globalThis.DAVINCI_WORKERS?.snapshot(reduced.matches?0:t);
nebulas(r,workers);
const glow=ctx.createRadialGradient(0,0,0,0,0,reach);
glow.addColorStop(0,'rgba(255,255,255,.85)');glow.addColorStop(.3,'rgba(255,255,255,.18)');glow.addColorStop(1,'rgba(255,255,255,0)');
ctx.save();ctx.rotate(observationAngle(angle)+Math.PI);ctx.fillStyle=glow;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,reach,-opening,opening);ctx.closePath();ctx.fill();drawFlow(opening,reach,'#fff');ctx.restore();
darkArt(r,workers);
const centers=nebulaCenters;
centers.forEach(([x,y],i)=>{
 const worker=workers?.[i]||{load:.4,queue:20,latencyMs:100,throughput:20,errorRate:0,status:'running'};
 const active=worker.status==='running',phase=i*1.71,tone=nebulaColors[i];
 const speed=.65+Math.min(worker.throughput,100)/180;
 const breath=reduced.matches||!active?0:Math.sin(clock*speed+phase);
 const pressure=Math.min(worker.queue/150,1),latency=Math.min(worker.latencyMs/1000,1);
 const strength=worker.status==='offline'?.2:worker.status==='idle'?.55:1;
 ctx.save();ctx.globalAlpha=strength;
 const size=Math.min(r.width,r.height)*(.08+(i%3)*.02+worker.load*.035)*(1+breath*(.004+worker.load*.009));
 ctx.save();ctx.translate(x*r.width+breath*(1+pressure),y*r.height+(reduced.matches||!active?0:Math.cos(clock*.7+phase)*(1+latency)));
 ctx.rotate(i*.67+scrollExpansion*(i%2?-.35:.35)+breath*(.006+worker.load*.008));
 orbital3D(size,i,worker,tone);
 ctx.restore();ctx.restore();
});
ctx.restore();
}
function paint(t){if(completed||!scale)return;const r=scene.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);if(beyond){paintBeyond(r,t);return;}ctx.save();ctx.translate(dx,dy);ctx.scale(scale,scale);drawBodyParticles(t);const tone=sectors[Math.max(0,mode)].color;observation(t);
// A circular field can open all the way to 360 degrees without tangent singularities.
ctx.save();ctx.translate(pivot.x,pivot.y);ctx.rotate(observationAngle(angle));
const halfAngle=aperture+(Math.PI-aperture)*scrollExpansion;
const reach=Math.hypot(r.width,r.height)/scale+800;
const whiten=scrollExpansion*scrollExpansion;
const channels=[1,3,5].map(i=>Math.round(parseInt(tone.slice(i,i+2),16)*(1-whiten)+255*whiten));
const beamColor=channels.join(',');
const beam=ctx.createRadialGradient(0,0,0,0,0,reach);
beam.addColorStop(0,'rgba('+beamColor+','+(.25+scrollExpansion*.28)+')');
beam.addColorStop(.7,'rgba('+beamColor+','+(.10+scrollExpansion*.18)+')');
beam.addColorStop(1,'rgba('+beamColor+',0)');
ctx.fillStyle=beam;ctx.strokeStyle='rgba('+beamColor+','+(.48-scrollExpansion*.25)+')';ctx.lineWidth=.8;
ctx.beginPath();if(scrollExpansion<1)ctx.moveTo(0,0);
ctx.arc(0,0,reach,-halfAngle,halfAngle);ctx.closePath();ctx.fill();ctx.stroke();
// Density and inward speed follow the observed aperture.
drawFlow(halfAngle,reach,'rgb('+beamColor+')');ctx.restore();
if(source.complete&&source.naturalWidth){ctx.save();ctx.translate(pivot.x,pivot.y);ctx.rotate(observationAngle(angle)+.20);ctx.translate(-pivot.x,-pivot.y);ctx.beginPath();ctx.moveTo(709,276);ctx.lineTo(866,226);ctx.lineTo(881,223);ctx.lineTo(888,269);ctx.lineTo(720,293);ctx.closePath();ctx.clip();ctx.drawImage(source,0,0);ctx.restore();}
brain(t,tone);creation(previous,1-blend,t);creation(mode,blend,t);ctx.restore();}
function animate(t){if(completed)return;const dt=Math.min(60,t-last||16);last=t;if(!reduced.matches)flowPhase+=dt*(beyond?.16+flowIntensity()*.20:.018+flowIntensity()*.085);angle+=(target-angle)*Math.min(1,dt*.009);aperture+=(targetAperture-aperture)*Math.min(1,dt*.009);updateMode();blend=Math.min(1,blend+dt/850);paint(t);frame=requestAnimationFrame(animate);}
function start(){cancelAnimationFrame(frame);if(completed)return;last=0;if(reduced.matches||document.hidden){angle=target;aperture=targetAperture;updateMode();blend=1;paint(0);}else frame=requestAnimationFrame(animate);}
canvas.addEventListener('pointerdown',e=>{const p=point(e);if(!beyond&&(p.x<pivot.x-40||Math.hypot(p.x-pivot.x,p.y-pivot.y)>650||p.y>650))return;drag=e.pointerId;canvas.setPointerCapture(drag);canvas.focus({preventScroll:true});canvas.classList.add('dragging');aim(p);e.preventDefault();});canvas.addEventListener('pointermove',e=>{const p=point(e);canvas.style.cursor=beyond||(p.x>pivot.x-40&&p.y<650)?'grab':'default';if(e.pointerId===drag)aim(p);});function end(){drag=null;pointerAngle=null;canvas.classList.remove('dragging')}canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){setAim(-.20);targetAperture=.17;}else if(e.key==='ArrowLeft')setAim(target+.08);else if(e.key==='ArrowRight')setAim(target-.08);else targetAperture=Math.max(.12,Math.min(.42,targetAperture+(e.key==='ArrowUp'?.025:-.025)));if(reduced.matches)start();});document.addEventListener('davinci:scroll',e=>{scrollExpansion=e.detail;const observation=observationAngle(target),margin=Math.max(0,Math.min(MAX-observation,observation-MIN));scrollBeyond=scrollExpansion>0&&aperture+(Math.PI-aperture)*scrollExpansion>margin;syncRealm();if(reduced.matches)paint(0);});
document.addEventListener('davinci:complete',()=>{completed=true;cancelAnimationFrame(frame);canvas.tabIndex=-1;});
new ResizeObserver(resize).observe(scene);source.onload=()=>paint(0);image.addEventListener('load',resize);reduced.addEventListener('change',start);document.addEventListener('visibilitychange',start);updateMode();resize();start();
})();
