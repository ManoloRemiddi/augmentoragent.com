// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
// Fixed native 520 × 670 window, including its 192px exterior activity canvas.
import {PANEL as P,WIDTH,HEIGHT,Swarm,FlowNoise,FluidField,emissionPixel,rgbHsv,hsvRgb,BUTTERFLY_COLOURS} from './skin-motion.mjs?v=2';
import {palette,hslHex} from './skin-format.mjs?v=2';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
export function lighter(hex,factor){let [h,s,v]=rgbHsv(rgb(hex));v*=factor;if(v>1){s=Math.max(0,s-(v-1));v=1;}return '#'+hsvRgb(h,s,v).map(x=>x.toString(16).padStart(2,'0')).join('');}
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
export class NativePreview {
 constructor(stage){
  this.stage=stage;this.world=stage.querySelector('.native-world');this.canvas=stage.querySelector('canvas');this.ctx=this.canvas.getContext('2d');const ratio=Math.min(2,window.devicePixelRatio||1);this.canvas.width=WIDTH*ratio;this.canvas.height=HEIGHT*ratio;this.ctx.scale(ratio,ratio);this.foliage=stage.querySelector('.preview-foliage');this.foliage.width=456*ratio;this.foliage.height=606*ratio;this.fx=this.foliage.getContext('2d');this.fx.scale(ratio,ratio);
  this.swarm=new Swarm();this.noise=new FlowNoise();this.pointer=[-10000,-10000];this.phase=0;this.breath=Math.random()*Math.PI*2;this.period=4.5+Math.random()*3.5;this.visible=false;this.last=0;this.frame=0;
  this.texture=canvas(Math.ceil(WIDTH/4),Math.ceil(HEIGHT/4));this.tx=this.texture.getContext('2d');this.smoke=canvas(Math.ceil(P.w/4),Math.ceil(P.h/4));this.sx=this.smoke.getContext('2d');this.prepareGeometry();
  new ResizeObserver(()=>{this.world.style.transform=`scale(${stage.clientWidth/WIDTH})`;}).observe(stage);
  new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.schedule();}).observe(stage);
  document.addEventListener('visibilitychange',()=>this.schedule());
  stage.addEventListener('pointermove',e=>{const r=this.world.getBoundingClientRect();this.pointer=[(e.clientX-r.left)*WIDTH/r.width,(e.clientY-r.top)*HEIGHT/r.height];});
  stage.addEventListener('pointerleave',()=>{this.pointer=[-10000,-10000];this.swarm.pointer=null;this.fluid.pointer=null;});
  document.fonts.ready.then(()=>this.draw(0));
 }
 prepareGeometry(){
  const w=this.texture.width,h=this.texture.height;this.samples=[];this.outer=[];this.glyphs=[];this.distance=new Float32Array(w*h);this.fluid=new FluidField(w,h);
  const distance=(x,y)=>{const dx=Math.abs(x-P.x-P.w/2)-(P.w/2-20),dy=Math.abs(y-P.y-P.h/2)-(P.h/2-20);return Math.hypot(Math.max(dx,0),Math.max(dy,0))+Math.min(Math.max(dx,dy),0)-20;};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const px=(x+.5)*WIDTH/w,py=(y+.5)*HEIGHT/h,d=distance(px,py);this.distance[y*w+x]=Math.max(0,d);if(d>=-4&&d<192){const item=[(y*w+x)*4,px,py,Math.max(0,d),Math.min(1,Math.max(0,Math.min(px,py,WIDTH-px,HEIGHT-py)/20))];(d<64?this.samples:this.outer).push(item);}}
  const symbols='0123456789ABCDEF+-*/<>=&|#%$!:.,';for(let y=3;y<HEIGHT;y+=8)for(let x=3;x<WIDTH;x+=7){const d=distance(x+3,y+4);if(d>1&&d<23){const seed=this.noise.sample(x*1.7,y*1.3);this.glyphs.push([x,y,d,symbols[Math.floor(seed*1000)%symbols.length],seed]);}}
 }
 update(appearance,motion){
  const changed=this.v?.effect!==appearance.effect;this.v=structuredClone(appearance);this.motion=motion&&appearance.animation;
  if(changed){this.fluid=new FluidField(this.texture.width,this.texture.height);this.flare=null;}
  const p=palette(appearance),box=this.stage.querySelector('article'),scenic=appearance.background!=='none';
  for(const [key,value] of Object.entries({panel:p.panel,'agent-accent':p.accent,'agent-text':p.text,'agent-muted':p.muted,'user-bubble':p.bubble,field:lighter(p.panel,appearance.theme==='dark'?1.25:1/1.05),'glass-opacity':Math.round(255*appearance.opacity/100)/255,'code-background':appearance.theme==='dark'?'#202733':'#edf1f7','transcript-background':scenic?`rgba(${rgb(p.panel).join(',')},${appearance.theme==='dark'?155/255:205/255})`:'transparent'}))box.style.setProperty('--'+key,value);
  box.classList.toggle('scenic',scenic);
  const source=appearance.background==='blossom-lake'?new URL('./skins/blossom-lake.png',import.meta.url).href:appearance.background==='uploaded'?`data:image/jpeg;base64,${appearance.background_image}`:'';
  box.querySelector('.preview-background').style.backgroundImage=source?`url("${source}")`:'none';
  if(source!==this.source){this.source=source;this.updateImagePalette(source,appearance.background);}
  this.draw(0);this.schedule();
 }
 async updateImagePalette(source,type){
  if(!source){this.swarm.setColours(BUTTERFLY_COLOURS);return;}
  try{
   let colours;
   if(type==='blossom-lake')colours=await (await fetch(new URL('./skins/blossom-palette.json',import.meta.url))).json();
   else{const image=new Image();image.src=source;await image.decode();const scale=48/Math.max(image.width,image.height),c=canvas(Math.max(1,Math.round(image.width*scale)),Math.max(1,Math.round(image.height*scale))),ctx=c.getContext('2d');ctx.drawImage(image,0,0,c.width,c.height);const bytes=ctx.getImageData(0,0,c.width,c.height).data,bins=new Map();for(let i=0;i<bytes.length;i+=4){const [r,g,b]=bytes.slice(i,i+3),key=[r,g,b].map(x=>Math.floor(x/40)).join(','),bucket=bins.get(key)||[0,0,0,0];bucket[0]++;bucket[1]+=r;bucket[2]+=g;bucket[3]+=b;bins.set(key,bucket);}colours=[...bins.values()].sort((a,b)=>{for(let i=0;i<4;i++)if(a[i]!==b[i])return b[i]-a[i];return 0;}).slice(0,9).map(([n,...sum])=>{const c=sum.map(x=>Math.round(x/n)/255),max=Math.max(...c),min=Math.min(...c),l=(max+min)/2,d=max-min,s=d?d/(1-Math.abs(2*l-1)):0;let h=0;if(d)h=(max===c[0]?((c[1]-c[2])/d+6)%6:max===c[1]?(c[2]-c[0])/d+2:(c[0]-c[1])/d+4)*60;return hslHex(h,s*100,clamp(l,.56,.78)*100);});}
   if(source===this.source){this.swarm.setColours(colours);this.draw(0);}
  }catch{if(source===this.source)this.swarm.setColours(BUTTERFLY_COLOURS);}
 }
 running(){return this.v&&this.visible&&!document.hidden&&this.motion;}
 schedule(){cancelAnimationFrame(this.frame);this.last=0;if(this.running())this.frame=requestAnimationFrame(t=>this.tick(t));}
 tick(now){if(!this.running())return;if(!this.last)this.last=now-40;if(now-this.last>=40){const dt=Math.min(.1,(now-this.last)/1000);this.last=now;this.phase+=dt;this.breath+=Math.PI*2*dt/this.period;if(this.breath>=Math.PI*2){this.breath%=Math.PI*2;this.period=4.5+Math.random()*3.5;}if(this.flare&&this.phase-this.flare.start>=this.flare.duration)this.flare=null;if(this.v.flares&&this.v.effect==='plasma'&&!this.flare&&Math.random()<-Math.expm1(Math.log(.97)*dt))this.triggerFlare();if(this.v.flares&&this.v.effect.startsWith('butterflies'))this.swarm.advance(dt,this.pointer);this.draw(dt);}this.frame=requestAnimationFrame(t=>this.tick(t));}
 triggerFlare(){if(!this.v?.flares||this.v.effect!=='plasma'||!this.motion)return;const roll=Math.random();this.flare={start:this.phase,duration:2.2+Math.random()*1.8,side:Math.floor(Math.random()*4),position:.12+Math.random()*.76,width:35+Math.random()*30,travel:roll<.9?28+Math.random()*15:45+(192*.86-45)*((roll-.9)/.1)**2};}
 draw(dt){
  if(!this.v)return;const ctx=this.ctx,v=this.v,p=palette(v);ctx.clearRect(0,0,WIDTH,HEIGHT);this.paintVoice(p.accent);
  this.fx.clearRect(0,0,456,606);if(v.effect.startsWith('butterflies')&&v.background==='none')this.paintFoliage(p.accent);
  if(!v.flares||v.effect==='none')return;
  if(v.effect.startsWith('butterflies')){this.swarm.paint(ctx,v.effect==='butterflies-large',this.motion);return;}
  const t=this.motion?this.phase:0;this.paintSmoke(p.accent,t,this.motion?this.breath:1);
  let eruption=null;if(this.flare&&this.motion){const f=this.flare,progress=(this.phase-f.start)/f.duration;if(progress>=0&&progress<1)eruption={side:f.side,along:f.side%2?P.y+P.h*f.position:P.x+P.w*f.position,width:f.width,crest:2+f.travel*Math.sin(progress*Math.PI)**.8,intensity:Math.sin(progress*Math.PI)**1.3};}
  const data=new Uint8ClampedArray(this.texture.width*this.texture.height*4),tint=rgb(p.accent),pixels=eruption?this.samples.concat(this.outer.filter(([,x,y])=>[P.y-y,x-P.x-P.w,y-P.y-P.h,P.x-x][eruption.side]>0&&Math.abs((eruption.side%2?y:x)-eruption.along)<eruption.width*2.5)):this.samples;
  for(const [i,x,y,d,fade] of pixels)data.set(emissionPixel(this.noise,x,y,d,fade,t,this.motion?this.breath:Math.PI/2,tint,eruption),i);
  const rendered=this.motion?this.fluid.step(data,dt||.04,this.pointer,this.distance):data;this.tx.putImageData(new ImageData(rendered,this.texture.width,this.texture.height),0,0);
  ctx.save();ctx.beginPath();ctx.rect(0,0,WIDTH,HEIGHT);ctx.roundRect(P.x,P.y,P.w,P.h,20);ctx.clip('evenodd');ctx.drawImage(this.texture,0,0,WIDTH,HEIGHT);ctx.font='7px "Native Mono"';ctx.fillStyle=lighter(p.accent,1.2);ctx.textBaseline='top';
  for(const [x,y,d,symbol,seed] of this.glyphs){const alpha=Math.max(0,this.noise.sample(x*.035+t*.8,y*.035-t*1.1+53)-.48)*.7*(1-d/25);if(alpha<.015)continue;ctx.globalAlpha=Math.min(.3,alpha);ctx.fillText(symbol,x+1.5*Math.sin(t*(.23+seed*.3)+seed*31),y+1.2*Math.sin(t*(.17+seed*.2)+seed*47));}ctx.restore();
 }
 paintSmoke(accent,t,breath){
  const w=this.smoke.width,h=this.smoke.height,data=new Uint8ClampedArray(w*h*4),tint=rgb(lighter(accent,1.28));
  const lobes=Array.from({length:3},(_,i)=>[.40*Math.sin(t*(.17+i*.043)+i*2.3),.34*Math.cos(t*(.13+i*.037)+i*2.7),.48+.13*Math.sin(t*.21+i*1.8),.48+.14*Math.cos(t*.19+i*2.1),.60+.17*Math.sin(t*.37+i)]);
  for(let row=0;row<h;row++)for(let col=0;col<w;col++){const x=-1+2*col/(w-1),y=-1+2*row/(h-1),u=x+.20*Math.sin(y*3.2+t*.41)+.10*Math.sin(x*2.7-y*2.1-t*.29),v=y+.17*Math.sin(x*3.8-t*.33)+.09*Math.cos(y*3.1+x*1.7+t*.51);let density=0;for(const [px,py,sx,sy,weight] of lobes)density+=Math.exp(-1*((u-px)/sx)**2-((v-py)/sy)**2)*weight;const wave=(Math.sin(u*4.1+v*2.7+t*.67)+Math.sin(v*4.7-u*2.3-t*.53)+.5*Math.sin(u*7.1+v*5.3-t*.81))/2.5,cloud=clamp(density-.16+.19*wave,0,1.6)/1.6,folds=Math.exp(-1*((wave+.12*Math.sin(v*3+t*.31))/.21)**2)*cloud;let edge=clamp((1-Math.abs(x))/.24,0,1)*clamp((1-Math.abs(y))/.24,0,1);edge=edge*edge*(3-2*edge);const alpha=clamp((cloud**1.25*.39+folds*.20)*edge*(.73+.20*Math.sin(breath)+.07*Math.sin(t*.71)),0,.62),light=.76+.23*cloud+.20*folds,i=(row*w+col)*4;for(let c=0;c<3;c++)data[i+c]=Math.min(255,Math.floor(tint[c]*light));data[i+3]=Math.floor(alpha*255);}
  this.sx.putImageData(new ImageData(data,w,h),0,0);const ctx=this.ctx;ctx.save();ctx.beginPath();ctx.roundRect(P.x,P.y,P.w,P.h,20);ctx.clip();ctx.drawImage(this.smoke,P.x,P.y,P.w,P.h);ctx.restore();
 }
 paintFoliage(accent){const ctx=this.fx;ctx.save();ctx.translate(-192,-192);ctx.beginPath();ctx.roundRect(P.x,P.y,P.w,P.h,20);ctx.clip();ctx.globalAlpha=.10;ctx.fillStyle=ctx.strokeStyle=accent;ctx.lineWidth=1.2;for(const mirror of [false,true]){ctx.save();ctx.translate(mirror?P.x+P.w:P.x,P.y+P.h);if(mirror)ctx.scale(-1,1);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(65,-25,18,-125,95,-205);ctx.fill();ctx.stroke();for(let i=0;i<7;i++){ctx.save();ctx.translate(18+i*8,-22-i*24);ctx.rotate((i%2?-40:20)*Math.PI/180);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(5,-26,30,-28,38,-12);ctx.bezierCurveTo(25,0,9,9,0,0);ctx.fill();ctx.stroke();ctx.restore();}ctx.restore();}ctx.restore();}
 paintVoice(accent){const phase=this.motion?this.phase:0,radius=8.8+(phase?.5*Math.sin(phase*2):0),path=[];for(let i=0;i<=96;i++){const angle=i*Math.PI*2/96,r=radius*(1+.065*Math.sin(3*angle+phase*.85)+.035*Math.cos(2*angle-phase));path.push(`${i?'L':'M'}${14+r*Math.cos(angle)},${14+r*Math.sin(angle)}`);}this.stage.querySelector('#voice-shape').setAttribute('d',path.join(' ')+'Z');this.stage.querySelector('#voice-orb').style.color=accent;}
}
