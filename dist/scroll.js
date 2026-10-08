(() => {
'use strict';
const story=document.querySelector('.scroll-story'),stage=document.querySelector('.observatory'),scene=document.querySelector('.scene'),light=document.querySelector('.scroll-light'),svg=light.querySelector('svg'),circle=svg.querySelector('circle'),finale=document.querySelector('.white-finale'),brand=document.querySelector('header');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let frame=0,locked=false;
if(typeof history!=='undefined')history.scrollRestoration='manual';
if(typeof scrollTo==='function')scrollTo(0,0);
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const x=clamp(n);return x*x*(3-2*x)};
function render(){frame=0;
 const rect=stage.getBoundingClientRect(),sceneRect=scene.getBoundingClientRect(),image=scene.querySelector('img'),instrument=scene.querySelector('canvas');
 const travel=Math.max(1,story.offsetHeight-stage.offsetHeight);
 const progress=locked?1:clamp(-story.getBoundingClientRect().top/travel);
 const expand=smooth((progress-.02)/.55);
 document.dispatchEvent(new CustomEvent('davinci:scroll',{detail:expand}));
 const journey=locked||scene.dataset.beyond==='true'?progress:0;
 let bloom=smooth((journey-.42)/.3),bleach=smooth((journey-.63)/.13),reveal=smooth((journey-.77)/.12);

 if(!locked&&reveal>=.98){
  locked=true;bloom=bleach=reveal=1;
  document.body.dataset.finaleLocked='true';scene.inert=true;
  finale.style.pointerEvents='auto';
  document.dispatchEvent(new CustomEvent('davinci:complete'));
 }
 // The light blooms from the viewport center, independently of the telescope direction.
 const radius=Math.hypot(rect.width,rect.height)*1.2*bloom;
 svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
 circle.setAttribute('cx',rect.width/2);circle.setAttribute('cy',rect.height/2);
 circle.setAttribute('r',radius);
 light.style.opacity=String(bloom*.9);
 finale.style.opacity=String(bleach);finale.style.visibility=bleach>0?'visible':'hidden';
 finale.style.clipPath='none';
 finale.querySelector('p').style.opacity=String(reveal);
 finale.querySelector('p').style.transform=reduced.matches?'none':`translateY(${(1-reveal)*16}px)`;
 const form=finale.querySelector('.access-form');
 if(form){form.style.opacity=String(reveal);form.inert=reveal<.98;form.style.pointerEvents=reveal>=.98?'auto':'none';}
 if(brand)brand.style.opacity=String(1-smooth((progress-.45)/.2));
 // Once revealed, the form remains available until the page is reloaded.
}

function schedule(){if(!frame)frame=requestAnimationFrame(render)}
document.addEventListener('davinci:realm',schedule);
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
scene.querySelector('img').addEventListener('load',schedule);
scene.addEventListener('pointermove',schedule,{passive:true});scene.addEventListener('keydown',schedule);
reduced.addEventListener('change',schedule);render();
})();
