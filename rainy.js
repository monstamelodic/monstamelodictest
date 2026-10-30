(() => {
const bottles=[...document.querySelectorAll('[data-note]')],dialog=document.querySelector('#note-dialog'),content=document.querySelector('#note-content');let current=0,opener=null;
function fill(index){current=index;content.replaceChildren(document.querySelector('#note-'+bottles[index].dataset.note).content.cloneNode(true));document.querySelector('#note-number').textContent=`0${index+1} / 0${bottles.length}`;document.querySelector('#previous-note').disabled=index===0;document.querySelector('#next-note').disabled=index===bottles.length-1;bottles.forEach((b,i)=>b.classList.toggle('is-open',i===index));dialog.scrollTop=0;}
bottles.forEach((b,index)=>b.addEventListener('click',()=>{opener=b;fill(index);dialog.showModal();}));
document.querySelector('#close-note').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{bottles.forEach(b=>b.classList.remove('is-open'));opener?.focus();});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
document.querySelector('#previous-note').addEventListener('click',()=>{if(current>0){fill(current-1);document.querySelector('#close-note').focus();}});document.querySelector('#next-note').addEventListener('click',()=>{if(current<bottles.length-1){fill(current+1);document.querySelector('#close-note').focus();}});
document.querySelector('#motion-toggle').addEventListener('click',e=>{const off=document.body.classList.toggle('motion-off');e.currentTarget.setAttribute('aria-pressed',String(!off));e.currentTarget.textContent=off?'Motion off':'Motion on';});
const compass=document.querySelector('#nautical-compass'),needle=document.querySelector('#compass-needle');let lastPoint=null,raf=0;
function aim(){raf=0;if(!lastPoint)return;const r=compass.getBoundingClientRect();const dx=lastPoint.x-(r.left+r.width/2),dy=lastPoint.y-(r.top+r.height/2);if(Math.hypot(dx,dy)>2)needle.style.transform=`rotate(${Math.atan2(dy,dx)*180/Math.PI+90}deg)`;}
window.addEventListener('pointermove',e=>{lastPoint={x:e.clientX,y:e.clientY};if(!raf)raf=requestAnimationFrame(aim);},{passive:true});
window.addEventListener('pointerdown',e=>{lastPoint={x:e.clientX,y:e.clientY};aim();},{passive:true});
window.addEventListener('scroll',()=>{if(lastPoint&&!raf)raf=requestAnimationFrame(aim);},{passive:true});
})();
