(() => {
'use strict';
const seeds=[.31,.62,.45,.77,.23,.56,.39];
let nodes=seeds.map((load,i)=>({id:'worker-'+(i+1),load,queue:8+i*11,latencyMs:70+i*43,throughput:12+i*7,errorRate:i===3?.025:.002,status:'running'}));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
let simulated=true;
function setNodes(input){
 const source=Array.isArray(input)?input:input.nodes;
 if(!Array.isArray(source)||source.length!==7)throw new Error('Se requieren siete nodos.');
 const ids=new Set();
 const next=source.map(n=>{
  if(typeof n.id!=='string'||!n.id||ids.has(n.id))throw new Error('Cada nodo necesita un id unico.');ids.add(n.id);
  const result={id:n.id,status:n.status||'running'};
  if(!['running','idle','offline'].includes(result.status))throw new Error('Estado de nodo invalido.');
  for(const [key,max] of [['load',1],['queue',100000],['latencyMs',60000],['throughput',100000],['errorRate',1]]){
   if(!Number.isFinite(n[key])||n[key]<0||n[key]>max)throw new Error('Metrica invalida: '+key);result[key]=n[key];
  }return result;
 });nodes=next;simulated=false;
}
function snapshot(t){return nodes.map((n,i)=>{
 if(!simulated)return {...n,simulated:false};
 const wave=Math.sin(t*.000065+i*1.71),slow=Math.sin(t*.000039+i*.83);
 return {...n,load:clamp(n.load+wave*.055,0,1),queue:Math.round(Math.max(0,n.queue+slow*5)),latencyMs:Math.round(n.latencyMs*(1+wave*.07)),throughput:Math.max(0,n.throughput*(1+slow*.08)),errorRate:clamp(n.errorRate+wave*.001,0,1),simulated:true};
 });}
globalThis.DAVINCI_WORKERS={snapshot,setNodes};
})();
