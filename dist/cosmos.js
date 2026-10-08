(() => {
'use strict';
const canvas=document.getElementById('cosmos'),ctx=canvas.getContext('2d');if(!ctx)return;
const motion=matchMedia('(prefers-reduced-motion: reduce)');let w,h,stars=[],frame=0,px=0,py=0,ox=0,oy=0,completed=false;
function paint(t){ctx.clearRect(0,0,w,h);ox+=(px-ox)*.025;oy+=(py-oy)*.025;for(const s of stars){ctx.globalAlpha=motion.matches?.45:.35+Math.sin(t*.0005+s.p)*.22;ctx.fillStyle='#dfc08b';ctx.beginPath();ctx.arc(s.x+ox*s.d,s.y+oy*s.d,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}
function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);let seed=1519;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};stars=Array.from({length:Math.min(170,Math.round(w/9))},()=>({x:random()*w,y:random()*h,r:.3+random()*1.1,p:random()*6.28,d:.2+random()*.8}));if(motion.matches)paint(0)}
function animate(t){if(completed)return;paint(t);frame=requestAnimationFrame(animate)}function start(){cancelAnimationFrame(frame);if(completed)return;if(motion.matches||document.hidden)paint(0);else frame=requestAnimationFrame(animate)}
document.addEventListener('davinci:complete',()=>{completed=true;cancelAnimationFrame(frame)});
addEventListener('resize',resize,{passive:true});addEventListener('pointermove',e=>{if(!motion.matches){px=(e.clientX/w-.5)*16;py=(e.clientY/h-.5)*16}},{passive:true});document.addEventListener('visibilitychange',start);motion.addEventListener('change',start);resize();start();
})();
