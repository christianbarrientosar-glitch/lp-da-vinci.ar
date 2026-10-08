const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('dist/instrument.js','utf8');const source=code.slice(code.indexOf('function projectOrbitPoint('),code.indexOf('function orbital3D('));
const sandbox={Math};vm.runInNewContext(source,sandbox);const project=sandbox.projectOrbitPoint;
for(const size of [30,70,140])for(const tilt of [0,.65,1.3])for(const yaw of [0,1,3])for(let j=0;j<64;j++){const a=j/64*Math.PI*2,p=project(Math.cos(a)*size,Math.sin(a)*size,size*.12,tilt,yaw,size*5);assert.ok(Object.values(p).every(Number.isFinite));assert.ok(p.scale>0&&p.scale<2);}
const near=project(10,0,20,0,0,100),far=project(10,0,-20,0,0,100);assert.ok(near.scale>far.scale&&near.x>far.x);
assert.notDeepEqual(project(20,10,0,.65,0,100),project(20,10,0,.65,1,100));
console.log('PASS: 3D orbital perspective, depth ordering inputs and finite desktop/mobile geometry.');

let lines=0;const gradient={addColorStop(){}};const context=new Proxy({createRadialGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{}});
const draw={Math,ctx:context,reduced:{matches:false},flowPhase:1000,line(a,b){assert.ok([a.x,a.y,b.x,b.y].every(Number.isFinite));lines++;},dot(x,y,r){assert.ok([x,y,r].every(Number.isFinite)&&r>0);}};
vm.runInNewContext(code.slice(code.indexOf('function projectOrbitPoint('),code.indexOf('function paintBeyond(')),draw);
for(const reduced of [false,true])for(const status of ['running','idle','offline'])for(let i=0;i<7;i++){draw.reduced.matches=reduced;draw.orbital3D(70,i,{load:.6,status},'#46cfff');}
assert.ok(lines>1000);console.log('PASS: all seven orbital renderers, reduced motion and worker states.');
