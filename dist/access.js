(() => {
'use strict';
const form=document.querySelector('.access-form');if(!form)return;
const button=form.querySelector('button'),status=form.querySelector('.access-status');
let sending=false;
form.addEventListener('submit',async event=>{
 event.preventDefault();if(sending||!form.reportValidity())return;
 sending=true;button.disabled=true;button.textContent='enviando';status.textContent='';form.setAttribute('aria-busy','true');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});
  if(!response.ok){status.textContent=response.status===429?'Demasiados intentos. Esper? un momento y volv? a enviar.':'No se pudo enviar. Intent? nuevamente.';return;}
  form.reset();status.textContent='Gracias. Recibimos tu solicitud.';
 }catch(error){status.textContent=error.name==='AbortError'?'No pudimos confirmar el env?o. Intent? nuevamente en un momento.':'No se pudo conectar. Revis? tu conexi?n e intent? nuevamente.';}
 finally{clearTimeout(timeout);sending=false;button.disabled=false;button.textContent='enviar';form.setAttribute('aria-busy','false');}
});
})();
