// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
// Browser port of Augmentor native nature.py, activity.py, fluid.py and smoke_glow.py.
// Keep constants/equations aligned; tests compare against native-generated fixtures.
export const PANEL={x:193,y:193,w:454,h:604}, WIDTH=840, HEIGHT=990;
const tau=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const BUTTERFLY_COLOURS=['#ed9962','#e8c655','#82be75','#69bdd2','#9990dc','#d68ac0','#e87987','#b9dbb0','#91c7e9'];
export class Swarm {
 constructor(random=Math.random){this.random=random;this.time=0;this.pointer=null;this.colours=BUTTERFLY_COLOURS;this.butterflies=[];this.prepare();}
 prepare(){const r=this.random,p=PANEL;for(let i=0;i<420;i++){
  const home=Math.min(110,7-Math.log(Math.max(1e-12,1-r()))*22),along=r()*2*(p.w+p.h);let x,y;
  if(along<p.w){x=p.x+along;y=p.y-home;}else if(along<p.w+p.h){x=p.x+p.w+home;y=p.y+along-p.w;}else if(along<2*p.w+p.h){x=p.x+p.w-(along-p.w-p.h);y=p.y+p.h+home;}else{x=p.x-home;y=p.y+p.h-(along-2*p.w-p.h);}
  this.butterflies.push({x,y,vx:r()*18-9,vy:r()*18-9,size:.025+r()*.07,colour:this.colours[Math.floor(r()*this.colours.length)],phase:r()*tau,frequency:.7+r()*1.1,home,steering:0});
 }}
 setColours(colours){this.colours=colours.length?colours:BUTTERFLY_COLOURS;this.butterflies.forEach((b,i)=>b.colour=this.colours[i%this.colours.length]);}
 boundary(x,y){const p=PANEL,dx=x-(p.x+p.w/2),dy=y-(p.y+p.h/2),qx=Math.abs(dx)-p.w/2,qy=Math.abs(dy)-p.h/2,sx=dx>=0?1:-1,sy=dy>=0?1:-1;if(qx>0&&qy>0){const len=Math.hypot(qx,qy);return [len,sx*qx/len,sy*qy/len];}return qx>qy?[qx,sx,0]:[qy,0,sy];}
 advance(dt,pointer,gaussian=null){dt=clamp(dt,0,.1);if(!dt)return;this.time+=dt;const [px,py]=pointer;let pvx=0,pvy=0;
  if(this.pointer){pvx=(px-this.pointer[0])/dt;pvy=(py-this.pointer[1])/dt;const speed=Math.hypot(pvx,pvy);if(speed>900){pvx*=900/speed;pvy*=900/speed;}}this.pointer=[px,py];
  const decay=Math.exp(-2.1*dt);for(const b of this.butterflies){let [distance,nx,ny]=this.boundary(b.x,b.y);
   const normalRandom=gaussian?gaussian():Math.sqrt(-2*Math.log(Math.max(1e-12,this.random())))*Math.cos(tau*this.random());
   b.steering=b.steering*Math.exp(-1.3*dt)+normalRandom*32*Math.sqrt(dt);
   const t=this.time*b.frequency+b.phase,normal=-(distance-b.home)*1.5+22*Math.sin(t*1.17),tangent=b.steering+24*Math.sin(t*.73)+12*Math.cos(t*1.61);
   let ax=nx*normal-ny*tangent,ay=ny*normal+nx*tangent,dx=b.x-px,dy=b.y-py,reach=Math.hypot(dx,dy);
   if(reach<105){const weight=(1-reach/105)**2;if(reach<.01){dx=Math.cos(b.phase);dy=Math.sin(b.phase);reach=1;}ax+=dx/reach*1100*weight+pvx*4*weight;ay+=dy/reach*1100*weight+pvy*4*weight;}
   b.vx=(b.vx+ax*dt)*decay;b.vy=(b.vy+ay*dt)*decay;const speed=Math.hypot(b.vx,b.vy);if(speed>230){b.vx*=230/speed;b.vy*=230/speed;}b.x+=b.vx*dt;b.y+=b.vy*dt;
   [distance,nx,ny]=this.boundary(b.x,b.y);if(distance<3||distance>170){const target=distance<3?3:170;b.x+=nx*(target-distance);b.y+=ny*(target-distance);const velocity=b.vx*nx+b.vy*ny;if((distance<3&&velocity<0)||(distance>170&&velocity>0)){b.vx-=1.4*velocity*nx;b.vy-=1.4*velocity*ny;}}
  }
 }
 paint(ctx,large,animated){ctx.save();ctx.globalAlpha=.9;for(const b of this.butterflies){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx)+Math.PI/2);ctx.scale(b.size*(large?3:1),b.size*(large?3:1));const flutter=.35+.65*Math.abs(Math.cos((animated?this.time:0)*(8+b.frequency*3)+b.phase));ctx.fillStyle=b.colour;for(const side of [-1,1]){ctx.save();ctx.scale(side*flutter,1);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(7,-21,25,-16,13,-2);ctx.bezierCurveTo(24,10,5,18,0,2);ctx.fill();ctx.restore();}ctx.restore();}ctx.restore();}
}
export class FlowNoise {
 constructor(random=Math.random){this.values=new Float64Array(128*128);for(const [cells,weight] of [[8,.64],[16,.28],[32,.08]]){const grid=Array.from({length:cells*cells},random);for(let y=0;y<128;y++){const gy=y*cells/128,iy=Math.floor(gy);let fy=gy-iy;fy=fy*fy*(3-2*fy);for(let x=0;x<128;x++){const gx=x*cells/128,ix=Math.floor(gx);let fx=gx-ix;fx=fx*fx*(3-2*fx);const a=grid[iy*cells+ix],b=grid[iy*cells+(ix+1)%cells],c=grid[((iy+1)%cells)*cells+ix],d=grid[((iy+1)%cells)*cells+(ix+1)%cells];this.values[y*128+x]+=weight*((a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy);}}}}
 sample(x,y){let ix=Math.floor(x),iy=Math.floor(y);const fx=x-ix,fy=y-iy;ix&=127;iy&=127;const nx=(ix+1)&127,ny=(iy+1)&127,v=this.values,a=v[iy*128+ix],b=v[iy*128+nx],c=v[ny*128+ix],d=v[ny*128+nx];return (a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy;}
}
export function rgbHsv(rgb){const c=rgb.map(v=>v/255),max=Math.max(...c),min=Math.min(...c),d=max-min;let h=0;if(d)h=(max===c[0]?(c[1]-c[2])/d+(c[1]<c[2]?6:0):max===c[1]?(c[2]-c[0])/d+2:(c[0]-c[1])/d+4)/6;return [h,max?d/max:0,max];}
export function hsvRgb(h,s,v){const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);return [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i%6].map(x=>Math.round(x*255));}
export function emissionPixel(noise,x,y,distance,fade,t,breathPhase,rgb,eruption=null){
 const sample=(x,y)=>noise.sample(x,y),breath=.5-.5*Math.cos(breathPhase),[h,s,v]=rgbHsv(rgb),[red,green,blue]=hsvRgb(h,Math.min(1,s*(.8+.7*breath)),Math.min(1,v*(.86+.14*breath))),breathing=.65+.65*breath;
 let alpha=0,fine=.4,ridge=0;
 if(distance<64){const px=x*.075,py=y*.075,q=sample(px*.43+t*1.65,py*.43-t*.95),r=sample(px*.39-t*1.1+37,py*.39+t*1.45+71),u=px+16*q,w=py+16*r,cloud=sample(u+t*1.7,w-t*2.1);fine=sample(u*1.6-t*2.2+19,w*1.6+t*.85);ridge=Math.max(0,1-Math.abs(cloud+.16*fine-.58)*6)**2;const local=.7+.6*sample(px*.6+t*.8+81,py*.6-t*.5),reach=5+29*q*local;alpha=Math.exp(-1*(distance/reach)**2*1.9)*fade*(.025+.19*cloud+.55*ridge)*breathing*local;}
 let flareLight=0;
 if(eruption){const {side,along,width,crest,intensity}=eruption,p=PANEL,tangent=(side===0||side===2?x:y)-along,normal=[p.y-y,x-p.x-p.w,y-p.y-p.h,p.x-x][side];if(normal>=-2&&Math.abs(tangent)<width*2.5){const height=Math.max(1,crest),fraction=clamp(normal/height,0,1),bend=height*.13*Math.sin(Math.PI*fraction)*(Math.sin(fraction*4.7+t*1.4)+.35*Math.sin(fraction*9.1-t*2.1)),radius=width*.65*Math.sqrt(Math.max(0,1-fraction)),strandWidth=1.6+4.8*(1-fraction)**1.5,left=(tangent-bend-radius)/strandWidth,right=(tangent-bend+radius*.82)/strandWidth,strands=Math.exp(-left*left)+.8*Math.exp(-right*right),cap=Math.exp(-1*(Math.max(0,normal-height)/strandWidth)**2),detail=.65+.35*sample(normal*.18+t*1.7,tangent*.08-t*1.1+23),density=(1-.72*fraction)*Math.exp(-Math.max(0,normal)/160),root=Math.exp(-1*(tangent/(width*.7))**2-(normal/12)**2)*.35;flareLight=(strands*cap*density*detail+root)*intensity*fade;alpha+=flareLight*.75;}}
 if(alpha<.002)return [0,0,0,0];const light=.66+.28*fine+.35*ridge+.4*flareLight,desaturate=flareLight?Math.min(.78,Math.max(0,distance-16)/192):0,grey=(red+green+blue)/3;
 return [...[red,green,blue].map(c=>Math.min(255,Math.floor((c+(grey-c)*desaturate)*light))),Math.min(200,Math.floor(255*alpha))];
}
export class FluidField {
 constructor(w,h){this.w=w;this.h=h;this.dye=null;this.velocity=new Float32Array(w*h*2);this.pointer=null;}
 sample(src,x,y,channels,c){const w=this.w,h=this.h;if(x<0||y<0||x>w-1||y>h-1)return 0;const ix=Math.floor(x),iy=Math.floor(y),jx=Math.min(ix+1,w-1),jy=Math.min(iy+1,h-1),fx=x-ix,fy=y-iy;return ((src[(iy*w+ix)*channels+c]*(1-fx)+src[(iy*w+jx)*channels+c]*fx)*(1-fy)+(src[(jy*w+ix)*channels+c]*(1-fx)+src[(jy*w+jx)*channels+c]*fx)*fy);}
 step(rgba,dt,pointer,distance){const w=this.w,h=this.h,n=w*h,cell=[WIDTH/w,HEIGHT/h],source=new Float32Array(n*4);dt=clamp(dt,.001,.08);for(let i=0;i<n;i++){const a=rgba[i*4+3]/255;for(let c=0;c<3;c++)source[i*4+c]=rgba[i*4+c]/255*a;source[i*4+3]=a;}if(!this.dye)this.dye=source.slice();
  if(this.pointer){const dx=pointer[0]-this.pointer[0],dy=pointer[1]-this.pointer[1],speed=Math.hypot(dx,dy);if(speed>.1&&speed<250){for(let y=0;y<h;y++)for(let x=0;x<w;x++){const wx=(x+.5)*cell[0],wy=(y+.5)*cell[1],along=clamp(((wx-this.pointer[0])*dx+(wy-this.pointer[1])*dy)/(speed*speed),0,1),r2=(wx-this.pointer[0]-along*dx)**2+(wy-this.pointer[1]-along*dy)**2,force=Math.exp(-r2/(2*14**2))*.32,i=(y*w+x)*2;this.velocity[i]+=force*clamp(dx/dt,-700,700)/cell[0];this.velocity[i+1]+=force*clamp(dy/dt,-700,700)/cell[1];}}}this.pointer=pointer.slice();
  const velocity=new Float32Array(n*2),decay=Math.exp(-dt/.5);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,bx=x-dt*this.velocity[i*2],by=y-dt*this.velocity[i*2+1];velocity[i*2]=this.sample(this.velocity,bx,by,2,0)*decay;velocity[i*2+1]=this.sample(this.velocity,bx,by,2,1)*decay;}
  const divergence=new Float32Array(n);let pressure=new Float32Array(n),next=new Float32Array(n);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;divergence[i]=.5*(velocity[(i+1)*2]-velocity[(i-1)*2]+velocity[(i+w)*2+1]-velocity[(i-w)*2+1]);}
  for(let round=0;round<24;round++){next.fill(0);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;next[i]=.25*(pressure[i+1]+pressure[i-1]+pressure[i+w]+pressure[i-w]-divergence[i]);}const old=pressure;pressure=next;next=old;}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(!x||!y||x===w-1||y===h-1){velocity[i*2]=velocity[i*2+1]=0;}else{velocity[i*2]-=.5*(pressure[i+1]-pressure[i-1]);velocity[i*2+1]-=.5*(pressure[i+w]-pressure[i-w]);}}
  const dye=new Float32Array(n*4),result=new Uint8ClampedArray(n*4);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,bx=x-dt*velocity[i*2],by=y-dt*velocity[i*2+1],retention=Math.exp(-dt/(.07+.3*clamp(distance[i]/60,0,1)));for(let c=0;c<4;c++)dye[i*4+c]=this.sample(this.dye,bx,by,4,c)*retention+source[i*4+c]*(1-retention);const a=dye[i*4+3];result[i*4+3]=Math.floor(clamp(a*255,0,255));for(let c=0;c<3;c++)result[i*4+c]=a?Math.floor(clamp(dye[i*4+c]/a*255,0,255)):0;}
  this.dye=dye;this.velocity=velocity;return result;
 }
}
