/* The same circular orb as the material study, with a small controller for the buyer mockup. */
window.createSinaOrb=function(canvas){
const fragment=`precision highp float;
varying vec2 uv;uniform float t,blend,energy,day,folds,work,phase;uniform vec3 deepColor,signalColor,lightColor;uniform vec2 pointer;uniform vec2 resolution;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
vec3 navy,cyan,ice;
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec2 k=vec2(37.,17.);float a=hash(i.xy+k*i.z),b=hash(i.xy+vec2(1.,0.)+k*i.z),c=hash(i.xy+vec2(0.,1.)+k*i.z),d=hash(i.xy+vec2(1.,1.)+k*i.z);float e=hash(i.xy+k*(i.z+1.)),g=hash(i.xy+vec2(1.,0.)+k*(i.z+1.)),h=hash(i.xy+vec2(0.,1.)+k*(i.z+1.)),j=hash(i.xy+vec2(1.,1.)+k*(i.z+1.));return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,v=0.;for(int i=0;i<3;i++){v+=a*noise3(p);p=p*2.03+vec3(3.7,1.2,2.8);a*=.5;}return v;}
vec3 turn(vec3 p){p.xy=rot(-.22*work+sin(t*.2)*.05)*p.xy;p.xz=rot(.24*sin(t*.22)+phase*.68+pointer.x*.15)*p.xz;p.yz=rot(-.34+phase*.27+pointer.y*.12)*p.yz;return p;}
void main(){
 navy=deepColor;cyan=signalColor;ice=lightColor;vec2 p=uv*1.36;float breath=1.+.012*sin(t*.9)+energy*.025;p/=breath;p-=pointer*.025;
 float r=length(p),a=atan(p.y,p.x);float R=.76;float edge=smoothstep(R+.004,R-.004,r);vec3 bg=mix(vec3(.0196078,.035294,.078431),vec3(.972549,.980392,.988235),day);
 float halo=exp(-max(r-R,0.)*18.)*smoothstep(.65,.86,r)*(.035+.035*blend)*(1.-day);float shadow=exp(-pow((r-.77)/.095,2.))*.045*day;vec3 col=bg+cyan*halo-vec3(shadow);
 if(r<R+.003){float z=sqrt(max(0.,1.-r*r/(R*R)));vec3 n=vec3(p/R,z);vec3 q=turn(n);
 vec3 drift=q*2.+vec3(phase*.3,-phase*.24,phase*.14);
 vec3 warp=q+work*.6*vec3(sin(q.y*2.8+phase),sin(q.z*3.-phase*.9),sin(q.x*2.6+phase*.7));
 float rolling=fbm(warp*2.6+vec3(0.,-phase*.3,phase*.18));
 float flow=sin(warp.x*3.1+warp.y*2.2+t*.27)+.5*sin(warp.z*4.-warp.y*3.+t*.2);
 flow=mix(flow,(rolling-.43)*7.+.4*sin(warp.y*3.+phase),work*.9);float lit=.5+.5*dot(n,normalize(vec3(-.6,.8,1.)));
 vec3 body=mix(navy*.8,cyan*.70,smoothstep(-1.,1.5,flow));body*=.58+.42*lit;body=mix(body,ice*.65,pow(smoothstep(.35,1.6,flow),3.)*(.18+work*.25));body+=ice*.09*pow(max(dot(n,normalize(vec3(-.5,.75,1.))),0.),6.);
 col=mix(body,navy*.14,blend*(.68-work*.32));
 vec3 light=vec3(0.);float opacity=0.;
 // Three connected-looking folds: the brand's three leaning strokes become ribbons in depth.
 for(int i=0;i<26;i++){float zz=-1.+float(i)/25.*2.;float interior=sqrt(max(0.,1.-zz*zz));vec3 v=turn(vec3(p/R,zz));
 float domain=1.-smoothstep(.94,1.04,length(v));float bend=.40*sin(v.y*2.8+v.z*2.5+t*.35+phase*.6)+.10*sin(v.y*5.-t*.25);
 float line=v.x-.32*v.y-bend;float ridge=0.;float rim=0.;
 for(int j=0;j<3;j++){float k=float(j)-1.;float off=k*(.35+.08*sin(v.z*2.+t*.2));float d=abs(line-off);float width=.055+.035*(.5+.5*sin(v.y*4.+zz*3.+float(j)));
 ridge+=exp(-d*d/(width*width))*mix(.5,1.,folds);rim+=exp(-pow((d-width*.8)/.014,2.))*.28;}
 float depth=.2+.8*(zz*.5+.5);float side=.35+.65*smoothstep(-.9,.9,v.x+v.y*.1);float signal=(ridge*.075+rim*.065)*domain*depth*side;
 light+=mix(cyan,ice,pow(clamp(rim,0.,1.),.6)*.8)*signal;opacity+=signal;
 }
 col+=light*(.24+blend*1.7)*(1.+energy*.65);
 float sf=q.x-.32*q.y-.40*sin(q.y*2.8+q.z*2.5+t*.35+phase*.6)-.10*sin(q.y*5.-t*.25);float trim=0.;
 for(int j=0;j<3;j++){float off=(float(j)-1.)*(.35+.08*sin(q.z*2.+t*.2));trim+=exp(-pow((sf-off-.055)/.018,2.));}
 col+=mix(cyan,ice,.6)*trim*blend*.26*(.2+.8*z)*(.5+.5*smoothstep(-.4,.7,q.x+q.y))*(1.-day*.5);col=mix(col,mix(cyan*.18,navy*.22,.7),clamp(opacity*.05,0.,.1)*(1.-blend));
 float fres=pow(1.-z,4.);float arc=.35+.65*smoothstep(-.8,.8,n.x*.7+n.y*.65);col+=mix(cyan,ice,arc*.6)*fres*arc*(.10+blend*.43)*(1.-day*.5);
 // Keep the brand pigments dominant; shade the material without shifting toward teal.
 float brandAccent=clamp(pow(clamp(opacity*1.5,0.,1.),1.1)+trim*.18+.08*smoothstep(.3,1.,flow),0.,.98);
 col=mix(navy,cyan,brandAccent)*(.78+.22*lit);
 col+=cyan*trim*.035;
 float grain=(hash(gl_FragCoord.xy)-.5)*mix(.042,.018,blend);col+=grain*(.4+.6*z);
 col=mix(bg+cyan*halo,col,edge);
 }gl_FragColor=vec4(col,1.-smoothstep(R-.004,R+.004,r));
}`;
const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=position;gl_Position=vec4(position,0.,1.);}`;
function renderer(canvas){const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true,preserveDrawingBuffer:true});if(!gl){canvas.dataset.error='WebGL unavailable';return ()=>{};}function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);let buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);let loc=gl.getAttribLocation(prog,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);const u={};for(const key of ['t','blend','energy','day','folds','work','phase','pointer','resolution','deepColor','signalColor','lightColor'])u[key]=gl.getUniformLocation(prog,key);return (time,b,e,d,f,px,py,w=0,ph=0,pal=palettes[palette])=>{gl.useProgram(prog);gl.viewport(0,0,canvas.width,canvas.height);for(const [k,v] of Object.entries({t:time,blend:b,energy:e,day:d,folds:f,work:w,phase:ph}))gl.uniform1f(u[k],v);for(const [key,colour] of Object.entries({deepColor:pal.deep,signalColor:pal.signal,lightColor:pal.light}))gl.uniform3fv(u[key],colour);gl.uniform2f(u.pointer,px,py);gl.uniform2f(u.resolution,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLES,0,6);};}
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const palettes=[
 {name:'Axmed',deep:'#261C7A',signal:'#0CC4FF',light:'#DCF7FF',tag:'Brand',desc:'The original navy and cyan.'},
 {name:'Ocean',deep:'#102B56',signal:'#009EC2',light:'#D2F4FF',tag:'Blue family',desc:'Deeper ink. Quieter cyan.'},
 {name:'Lagoon',deep:'#073E48',signal:'#21B9AF',light:'#D5F8E9',tag:'Exploration',desc:'Petrol and mineral teal.'},
 {name:'Sage',deep:'#253D36',signal:'#86AF91',light:'#E5EBCF',tag:'Exploration',desc:'Earthy, warm and composed.'},
 {name:'Cobalt',deep:'#111D64',signal:'#437AF3',light:'#CFECFF',tag:'Exploration',desc:'A sharper electric blue.'},
 {name:'Copper',deep:'#493027',signal:'#DE9265',light:'#F6DFC0',tag:'Exploration',desc:'Warm bronze and soft cream.'}
].map(p=>({...p,hex:p.signal,deep:rgb(p.deep),signal:rgb(p.signal),light:rgb(p.light)}));

let palette=0,state='speaking',time=0,phase=0,work=0,previous=0,raf=0,paused=false,motionOn=true,frames=0;
const paint=renderer(canvas);
if(canvas.dataset.error){canvas.hidden=true;canvas.parentElement.classList.add('orb-fallback');}
function advance(now){const dt=Math.min((now-previous)/1000||0,.25);previous=now;if(!paused){const target=state==='working'?1:state==='speaking'?.3:state==='listening'?.14:.06;work+=((motionOn?target:0)-work)*(1-Math.exp(-dt*4));if(motionOn){time+=dt;phase+=dt*(state==='working'?1.15:state==='speaking'?.78:state==='listening'?.35:.22);}const level=!motionOn?0:state==='speaking'?Math.pow(Math.max(0,Math.sin(time*7.)),2)*(.5+.5*Math.sin(time*1.4)):state==='working'?.22:0;paint(time,.42,level,1,1,0,0,motionOn?work:0,phase,palettes[palette]);frames++;canvas.parentElement.classList.toggle('motion-off',!motionOn);}}
function frame(now){if(now-previous>=22)advance(now);raf=requestAnimationFrame(frame);}
raf=requestAnimationFrame(frame);
// Embedded previews may throttle animation frames; a timer keeps playback making progress.
const watchdog=setInterval(()=>{const now=performance.now();if(now-previous>180)advance(now);},100);
return {setState(s){state=s;canvas.parentElement.dataset.state=s;},setPalette(i){palette=Math.max(0,Math.min(palettes.length-1,i));},setMotion(on){motionOn=on;},pause(p){paused=p;canvas.parentElement.classList.toggle('orb-paused',p);previous=performance.now();},destroy(){cancelAnimationFrame(raf);clearInterval(watchdog);},drawAt(t,s='speaking'){paused=true;const w=s==='working'?1:.3;paint(t,.42,.15,1,1,0,0,w,t*(s==='working'?1.15:.78),palettes[palette]);},snapshot(){return {state,work,phase,time,frames,motionOn,fallback:!!canvas.dataset.error};}};
};
