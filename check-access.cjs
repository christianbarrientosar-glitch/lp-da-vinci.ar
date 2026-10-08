const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
for(const outcome of ['success','server','limit','network','timeout']){
 const button={disabled:false,textContent:'enviar'},status={textContent:''},attrs={};let submit,resolve,reject,calls=0,resets=0,prevented=0,request;
 const form={action:'https://formspree.io/f/mljgbpwe',reportValidity:()=>true,querySelector:s=>s==='button'?button:status,addEventListener:(n,f)=>submit=f,setAttribute:(k,v)=>attrs[k]=v,reset:()=>resets++};
 const pending=new Promise((a,b)=>{resolve=a;reject=b;});
 vm.runInNewContext(fs.readFileSync('dist/access.js','utf8'),{document:{querySelector:()=>form},fetch:(url,options)=>{calls++;request={url,options};return pending;},FormData:class{},AbortController:class{signal={};abort(){}},setTimeout:()=>1,clearTimeout(){}});
 const event={preventDefault(){prevented++}};const task=submit(event);await submit(event);
 assert.equal(calls,1);assert.equal(prevented,2);assert.equal(button.disabled,true);assert.equal(request.options.headers.Accept,'application/json');assert.equal(request.url,form.action);
 if(outcome==='network')reject(new Error('network'));else if(outcome==='timeout')reject(Object.assign(new Error('timeout'),{name:'AbortError'}));else resolve({ok:outcome==='success',status:outcome==='limit'?429:500});await task;
 assert.equal(button.disabled,false);assert.equal(button.textContent,'enviar');assert.equal(attrs['aria-busy'],'false');assert.equal(resets,outcome==='success'?1:0);assert.ok(status.textContent);if(outcome==='success')assert.match(status.textContent,/Recibimos/);else assert.ok(!status.textContent.includes('Recibimos'));
}
console.log('PASS: inline submission, duplicate prevention, success, server errors, rate limit, network and timeout.');
})().catch(e=>{console.error(e);process.exitCode=1});
