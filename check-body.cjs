const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('dist/instrument.js','utf8'),particles=fs.readFileSync('dist/particles.js','utf8');let marks=0,dots=0,clips=0;
const ctx=new Proxy({clip(){clips++},fillRect(...args){assert.ok(args.every(Number.isFinite));marks++;},createRadialGradient(){return{addColorStop(){}};}},{get:(o,k)=>k in o?o[k]:()=>{}});
const sandbox={ctx,Math,hand:{x:300,y:555},reduced:{matches:false},flowPhase:2000,dot(x,y,r){assert.ok([x,y,r].every(Number.isFinite));dots++;}};
vm.runInNewContext(particles,sandbox);vm.runInNewContext(code.slice(code.indexOf('// A galaxy inhabits'),code.indexOf('function sector(')),sandbox);
for(const origin of [{x:647,y:268},{x:978,y:895}]){const first=sandbox.bodyStreamPoint(origin,0,0),last=sandbox.bodyStreamPoint(origin,1,0);assert.equal(first.x,origin.x);assert.equal(first.y,origin.y);assert.equal(last.x,300);assert.equal(last.y,555);}
for(const reduced of [false,true]){sandbox.reduced.matches=reduced;marks=dots=0;sandbox.drawBodyParticles(1000);assert.ok(marks>1800);assert.ok(dots>400);}
assert.equal(clips,2);console.log('PASS: dense body constellation clipped to silhouette, seven currents ending at left hand, reduced motion.');
