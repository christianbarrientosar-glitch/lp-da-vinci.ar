const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('dist/instrument.js','utf8');
function run(reduced,width,height){
 const documentEvents={},arcs=[],rotations=[];let marks=0,lastMarks=0; const events={},attributes={},gradient={addColorStop(){}};
 const context=new Proxy({clearRect(){lastMarks=marks;marks=0;rotations.length=0},fillRect(){marks++},arc(...args){arcs.push(args)},rotate(a){rotations.push(a)}}, {get(o,k){if(k.startsWith('create'))return()=>gradient;if(k in o)return o[k];return()=>{}},set(o,k,v){o[k]=v;return true}});
 const canvas={className:'',style:{},classList:{add(){},remove(){}},setAttribute(k,v){attributes[k]=v},getContext(){return context},getBoundingClientRect(){return{left:0,top:0,width,height}},addEventListener(k,f){events[k]=f},setPointerCapture(){},focus(){doc.activeElement=canvas}};
 const image={style:{},addEventListener(){}};
 const scene={dataset:{},querySelector(){return image},append(){},getBoundingClientRect(){return{width,height}}};
 const label={setAttribute(){},innerHTML:''};
 const doc={dispatchEvent(){},body:{dataset:{}},hidden:false,querySelector(s){return s==='.scene'?scene:s==='.creation'?label:{append(){}}},createElement(s){return s==='canvas'?canvas:{className:'',textContent:'',style:{}}},addEventListener(name,fn){documentEvents[name]=fn}};
 let scheduled;const media={matches:reduced,addEventListener(){}};
 const sandbox={CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},document:doc,Image:class{complete=true;naturalWidth=1536},matchMedia:()=>media,devicePixelRatio:1,ResizeObserver:class{observe(){}},requestAnimationFrame(f){scheduled=f;return 1},cancelAnimationFrame(){},Math};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/workers.js','utf8'),sandbox);vm.runInContext(code,sandbox);
 function tick(count=100){for(let i=0;i<count;i++)if(scheduled)scheduled(i*16);}
 const mobile=width<700,virtualWidth=mobile?1160:1536;
 const scale=Math.min(width/virtualWidth,height/1024),dx=(width-virtualWidth*scale)/2-(mobile?50*scale:0),dy=(height-1024*scale)/2;
 assert.equal(documentEvents['davinci:formation'],undefined);const directions=[-.9817,-.685,-.3883,-.0917,.205,.5017],expected=['Política','Economía','Social','Marcas','Legal','Escucha social'];
 directions.forEach((a,i)=>{const e={pointerId:1,clientX:width-(dx+(714+300*Math.cos(a))*scale),clientY:dy+(280+300*Math.sin(a))*scale,preventDefault(){}};events.pointerdown(e);tick();assert.match(attributes['aria-valuetext'],new RegExp(expected[i]));events.pointerup(e);});
 events.keydown({key:'Home',preventDefault(){}});tick();assert.equal(Number(attributes['aria-valuenow']),-11);
 // A full turn crosses the dark arc and returns to the normal scene from its opposite edge.
 for(const key of ['ArrowLeft','ArrowRight']){
  events.keydown({key:'Home',preventDefault(){}});tick();let entered=false,returned=false;
  for(let i=0;i<90;i++){events.keydown({key,preventDefault(){}});tick(20);if(scene.dataset.beyond==='true')entered=true;else if(entered){returned=true;break;}}
  assert.ok(entered&&returned,'full turn must enter darkness and return on either direction');
 }
 const dark={pointerId:1,clientX:width-(dx+(714+300*Math.cos(.9))*scale),clientY:dy+(280+300*Math.sin(.9))*scale,preventDefault(){}};
 events.keydown({key:'Home',preventDefault(){}});tick();events.pointerdown(dark);tick();assert.equal(scene.dataset.beyond,'true');assert.ok(marks>1000,'darkness has a dense field of fragments');arcs.length=0;documentEvents['davinci:scroll']({detail:1});tick();assert.ok(arcs.length>0&&arcs.every(a=>a.every(Number.isFinite)));assert.ok(arcs.some(a=>a[2]>500&&Math.abs(a[4]-a[3]-Math.PI*2)<1e-8));documentEvents['davinci:scroll']({detail:0});events.pointerup(dark);events.keydown({key:'Home',preventDefault(){}});tick();assert.equal(scene.dataset.beyond,'false');
 events.keydown({key:'Home',preventDefault(){}});tick();
 for(const a of [.9,1.6,2.35,2.45]){const e={pointerId:1,clientX:width-(dx+(714+300*Math.cos(a))*scale),clientY:dy+(280+300*Math.sin(a))*scale,preventDefault(){}};if(a===.9)events.pointerdown(e);else events.pointermove(e);tick();assert.equal(scene.dataset.beyond,String(a<2.43));if(a===2.45)events.pointerup(e);}
 // Dark beam must rotate in the same direction as the pointer, after the opposite-side turn.
 events.keydown({key:'Home',preventDefault(){}});tick();let beamBefore;
 for(const a of [.8,1.0]){const e={pointerId:1,clientX:width-(dx+(714+300*Math.cos(a))*scale),clientY:dy+(280+300*Math.sin(a))*scale,preventDefault(){}};rotations.length=0;if(a===.8)events.pointerdown(e);else events.pointermove(e);tick();const beam=rotations[0];if(a===.8)beamBefore=beam;else {assert.ok(beam>beamBefore,'dark beam follows increasing pointer angle');events.pointerup(e);}}
 for(const a of [.65,.75,.60,-1.13,-1.23,-1.08]){events.keydown({key:'Home',preventDefault(){}});tick();const e={pointerId:1,clientX:width-(dx+(714+300*Math.cos(a))*scale),clientY:dy+(280+300*Math.sin(a))*scale,preventDefault(){}};events.pointerdown(e);tick();assert.equal(scene.dataset.beyond,String(a< -1.13||a>.65));events.pointerup(e);}events.keydown({key:'Home',preventDefault(){}});tick();
 if(reduced){for(let i=0;i<14;i++)events.keydown({key:'ArrowDown',preventDefault(){}});arcs.length=0;events.keydown({key:'ArrowDown',preventDefault(){}});const sparse=arcs.length;for(let i=0;i<14;i++)events.keydown({key:'ArrowUp',preventDefault(){}});arcs.length=0;events.keydown({key:'ArrowUp',preventDefault(){}});assert.ok(arcs.length>sparse,'wider aperture adds particles');}
 events.keydown({key:'ArrowUp',preventDefault(){}});assert.equal(events.wheel,undefined); tick();
 documentEvents['davinci:scroll']({detail:.02});tick();assert.equal(scene.dataset.beyond,'false','small scroll widens normal observation before crossing its limit');
 arcs.length=0;documentEvents['davinci:scroll']({detail:1});tick();assert.equal(scene.dataset.beyond,'true');assert.ok(arcs.some(a=>a[2]>500&&Math.abs(a[4]-a[3]-Math.PI*2)<1e-8));assert.ok(arcs.every(a=>a.every(Number.isFinite)));documentEvents['davinci:scroll']({detail:0});tick();assert.equal(scene.dataset.beyond,'false');assert.equal(attributes.role,'slider');assert.equal(attributes['aria-valuemin'],'-65');
}
run(false,1440,940);run(true,720,480);run(false,720,455);run(false,390,754);run(true,390,754);
const html=fs.readFileSync('dist/index.html','utf8');for(const name of ['leonardo-essential.png','leonardo-cosmos.png','instrument.js','cosmos.js','style.css'])assert.ok(fs.existsSync('dist/'+name));assert.ok(html.includes('instrument.js'));assert.ok(html.includes('action="https://formspree.io/f/mljgbpwe"'));assert.ok(html.includes('type="email" name="email"'));assert.ok(html.includes('method="POST"'));assert.ok(html.includes('autocomplete="email"'));assert.ok(html.includes('required'));
assert.ok(!code.includes('fillText')); const visible=html.split('<body>')[1].split('</body>')[0].replace(/<[^>]*>/g,'').trim(); assert.equal(visible,'da-vinci.arwhistlistenviar'); console.log('PASS: six sectors, keyboard, drag, aperture, reduced motion, assets, and access form markup.');

const workerContext=vm.createContext({Math});vm.runInContext(fs.readFileSync('dist/workers.js','utf8'),workerContext);
const workers=workerContext.DAVINCI_WORKERS,first=workers.snapshot(0),later=workers.snapshot(60000);
assert.equal(first.length,7);assert.equal(new Set(first.map(n=>n.id)).size,7);assert.notEqual(first[0].load,later[0].load);
for(const n of later){assert.ok(n.simulated);assert.ok(n.load>=0&&n.load<=1);assert.ok(n.queue>=0&&n.latencyMs>=0&&n.throughput>=0);}
const real=first.map(n=>({...n,load:.8,status:'offline'}));workers.setNodes({nodes:real});assert.ok(workers.snapshot(0).every(n=>!n.simulated&&n.load===.8));assert.deepEqual(workers.snapshot(0),workers.snapshot(60000));
assert.throws(()=>workers.setNodes({nodes:real.map((n,i)=>({...n,load:i===3?NaN:.4}))}));assert.ok(workers.snapshot(0).every(n=>n.load===.8));
console.log('PASS: seven simulated worker identities, metric ranges, replacement and atomic validation.');
