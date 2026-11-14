(function(){
const assetRoot=new URL(".",document.currentScript.src);
/* Native animated images of the same branded shader: no WebGL or animation-frame dependency. */
window.createSinaOrb=function(canvas){
  const stage=canvas.parentElement;
  const image=new Image();
  image.className='orb-animation';
  image.alt='';
  image.setAttribute('aria-hidden','true');
  stage.setAttribute('role','img');
  stage.setAttribute('aria-label','Sina, a moving circular indigo and cyan orb');
  canvas.classList.add('orb-still');
  canvas.width=canvas.height=320;
  const ctx=canvas.getContext('2d');
  canvas.style.display='none';
  stage.append(image);
  let state='speaking',paused=false,asset='';
  image.onload=()=>{stage.dataset.animation='ready';if(paused)freeze();};
  image.onerror=()=>{stage.dataset.animation='fallback';image.style.display='none';stage.classList.add('orb-fallback');};
  function freeze(){if(image.complete&&image.naturalWidth&&ctx){ctx.clearRect(0,0,320,320);ctx.drawImage(image,0,0,320,320);canvas.style.display='block';image.style.display='none';}}
  function setState(next){state=next;stage.dataset.state=next;const target=next==='working'?'sina-working.gif':'sina-flow.gif';if(asset!==target){asset=target;image.src=new URL(target,assetRoot).href;}if(!paused){canvas.style.display='none';image.style.display='block';}}
  setState(state);
  return {
    setState,
    pause(value){paused=value;stage.classList.toggle('orb-paused',value);if(value)freeze();else{canvas.style.display='none';image.style.display='block';}},
    setMotion(on){this.pause(!on);},
    destroy(){image.remove();},
    snapshot(){return {state,paused,mode:'native-animation',asset,loaded:image.complete&&image.naturalWidth>0};}
  };
};

})();
