// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
// Mirrors the native 0.2.9 augmentor_linux.skins contract; verified against its importer.
export const LIMIT=6*1024*1024, IMAGE_LIMIT=4*1024*1024;
export const ranges={hue:[0,359],accent_hue:[0,359],brightness:[-15,15],accent_brightness:[-15,15],saturation:[0,100],opacity:[35,100]};
export const roles=['heading','link','emphasis','keyword','string','number','name','comment','operator'];
export const base={theme:'dark',hue:190,brightness:0,accent_hue:160,accent_brightness:0,saturation:48,opacity:85,animation:true,flares:true,effect:'plasma',background:'none',background_image:'',format_colours:{}};
export const presets={Futuristic:base,'Blossom lake':{...base,hue:205,accent_hue:20,opacity:100,effect:'butterflies-large',background:'blossom-lake',format_colours:{heading:'#f0b69b',link:'#a9cbd4',emphasis:'#fff0e3'}}};
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function documentFor(name,appearance){
 const result={format:'augmentor-skin',version:appearance.background==='uploaded'?2:1,name,appearance:structuredClone(appearance)};
 return validate(result);
}
export function validate(data){
 if(!object(data)||Object.keys(data).sort().join()!==['appearance','format','name','version'].join()||data.format!=='augmentor-skin'||![1,2].includes(data.version))throw Error('Choose an Augmentor skin file (version 1 or 2).');
 if(typeof data.name!=='string'||!data.name.trim()||[...data.name].length>80||/[\u0000-\u001f]/.test(data.name))throw Error('Use a skin name of 1–80 characters.');
 if(!object(data.appearance))throw Error('The skin has no appearance settings.');
 const v={background:'none',background_image:'',...data.appearance};
 if(Object.keys(v).sort().join()!==Object.keys(base).sort().join())throw Error('The skin has missing or unsupported settings.');
 for(const [k,[lo,hi]] of Object.entries(ranges))if(!Number.isInteger(v[k])||v[k]<lo||v[k]>hi)throw Error(`${k} must be a whole number from ${lo} to ${hi}.`);
 if(typeof v.animation!=='boolean'||typeof v.flares!=='boolean')throw Error('Motion settings must be true or false.');
 if(!['light','dark'].includes(v.theme)||!['plasma','butterflies','butterflies-large','none'].includes(v.effect)||!['none','blossom-lake','uploaded'].includes(v.background))throw Error('Unsupported theme, effect or background.');
 if(typeof v.background_image!=='string')throw Error('Invalid image data.');
 if(v.background==='uploaded'){
  if(data.version!==2||!v.background_image||v.background_image.length>Math.floor(IMAGE_LIMIT*4/3)+4||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v.background_image))throw Error('Invalid or oversized background image.');
 }else if(v.background_image)throw Error('Unexpected image data.');
 if(!object(v.format_colours)||Object.entries(v.format_colours).some(([k,c])=>!roles.includes(k)||typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)))throw Error('Formatting colours must be supported roles with #RRGGBB values.');
 return {...structuredClone(data),name:data.name.trim(),appearance:structuredClone(v)};
}
export function serialize(name,appearance){
 const text=JSON.stringify(documentFor(name,appearance),null,2)+'\n';
 if(new TextEncoder().encode(text).length>LIMIT)throw Error('The skin exceeds the 6 MiB import limit.');
 return text;
}
export function filename(name){return (name.trim().replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,65)||'my-skin')+'.augmentor-skin.json';}
export function hslHex(h,s,l){
 s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};
 return '#'+f(0)+f(8)+f(4);
}
export function palette(v){
 const dark=v.theme==='dark',sat=v.saturation,l=Math.max(2.5,Math.min(99,(dark?12:92)+v.brightness/1.5)),scenic=v.background!=='none';
 return {panel:hslHex(v.hue,sat*.5625,l),accent:hslHex(v.accent_hue,sat,Math.max(15,Math.min(90,(dark?73:30)+v.accent_brightness/1.5))),bubble:hslHex(v.hue,sat*(.23/.48),Math.min(99.5,l+(dark?9:4.5))),text:scenic?(dark?'#fff0e3':'#243840'):(dark?'#edf3f3':'#152b2c'),muted:'#879493'};
}
export function formatDefaults(v){
 const p=palette(v),code=v.theme==='dark'?['#c4a7ff','#a6da95','#f5a97f','#8bd5ef','#a5adcb','#ed8796']:['#6639ba','#236b35','#9a4600','#005c85','#596579','#a82c46'];
 return Object.fromEntries(roles.map((role,i)=>[role,i<2?p.accent:i===2?(v.theme==='dark'?'#edf3f3':'#152b2c'):code[i-3]]));
}
export function sliderGradient(key,v){
 if(key==='hue'||key==='accent_hue')return `linear-gradient(90deg,${Array.from({length:7},(_,i)=>hslHex(i*60%360,80,55)).join(',')})`;
 if(key==='saturation')return `linear-gradient(90deg,#999999,${hslHex(v.accent_hue,100,50)})`;
 if(key==='opacity')return `linear-gradient(90deg,rgba(127,150,150,.2353),${palette(v).accent})`;
 return 'linear-gradient(90deg,#232326,#ffffff)';
}
