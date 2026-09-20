// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
import {presets,ranges,roles,LIMIT,validate,serialize,filename,palette} from './skin-format.mjs?v=1';
import {prepareImage} from './skin-images.mjs?v=1';
const $=id=>document.getElementById(id),status=$('status'),download=$('download');
let appearance=structuredClone(presets.Futuristic),uploaded='',operation=0,busy=false,previewMotion=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const titles={hue:'Panel colour',accent_hue:'Accent colour',brightness:'Panel brightness',accent_brightness:'Accent brightness',saturation:'Saturation',opacity:'Opacity'};
for(const key of ['hue','brightness','accent_hue','accent_brightness','saturation','opacity']){
 const label=document.createElement('label');label.className='slider-label';label.htmlFor=key;label.textContent=titles[key];
 const output=document.createElement('output');output.id=key+'-value';output.htmlFor=key;label.append(output);
 const input=document.createElement('input');input.type='range';input.id=key;[input.min,input.max]=ranges[key];input.step='1';
 input.addEventListener('input',()=>{appearance[key]=Number(input.value);render();});$('sliders').append(label,input);
}
for(const role of roles){const label=document.createElement('label');label.textContent=role;const input=document.createElement('input');input.type='color';input.id='colour-'+role;input.setAttribute('aria-label',role+' colour');input.addEventListener('input',()=>{appearance.format_colours[role]=input.value;render();});label.append(input);$('format-colours').append(label);}
for(let i=0;i<36;i++){const wing=document.createElement('span');wing.textContent='✦';const angle=i*Math.PI*2/36;wing.style.left=(50+48*Math.cos(angle))+'%';wing.style.top=(50+47*Math.sin(angle))+'%';wing.style.setProperty('--delay',-(i%9)/2+'s');$('preview-effect').append(wing);}
function say(message,error=false){status.textContent=message;status.classList.toggle('error',error);}
function sync(){
 for(const key of Object.keys(ranges))$(key).value=appearance[key];
 for(const key of ['theme','effect','background'])$(key).value=appearance[key];
 for(const key of ['animation','flares'])$(key).checked=appearance[key];
 $('background').querySelector('[value="uploaded"]').disabled=!uploaded;
 $('remove-image').disabled=!uploaded;render();
}
function render(){
 const v=appearance,p=palette(v),box=$('agent-preview'),effect=$('preview-effect');
 box.style.setProperty('--panel',p.panel);box.style.setProperty('--agent-accent',p.accent);box.style.setProperty('--agent-text',p.text);box.style.setProperty('--agent-muted',p.muted);box.style.opacity=v.opacity/100;
 const backdrop=box.querySelector('.preview-background');
 backdrop.style.backgroundImage=v.background==='blossom-lake'?'url("assets/skins/blossom-lake.png")':v.background==='uploaded'?`url("data:image/jpeg;base64,${v.background_image}")`:'none';
 backdrop.hidden=v.background==='none';
 box.querySelector('h3').style.color=v.format_colours.heading||p.accent;box.querySelector('em').style.color=v.format_colours.emphasis||p.text;box.querySelector('a').style.color=v.format_colours.link||p.accent;
 const defaults={heading:p.accent,link:p.accent,emphasis:p.text,keyword:'#c3a4e2',string:'#aad29b',number:'#eac38f',name:'#a8ccdf',comment:'#93a59d',operator:'#dbcfdf'};
 for(const role of roles){const input=$('colour-'+role);if(document.activeElement!==input)input.value=v.format_colours[role]||defaults[role];const code=box.querySelector(`[data-code="${role}"]`);if(code)code.style.color=v.format_colours[role]||defaults[role];}
 for(const key of Object.keys(ranges))$(key+'-value').textContent=v[key]+(['opacity','saturation'].includes(key)?'%':'');
 effect.className=v.effect+(v.flares?' flares':'')+(v.animation&&previewMotion?' moving':'');effect.hidden=v.effect==='none';effect.style.setProperty('--glow',p.accent);
 for(const wing of effect.children)wing.hidden=!v.effect.startsWith('butterflies');
 $('preview-motion').textContent='Preview motion '+(previewMotion?'on':'off');$('preview-motion').setAttribute('aria-pressed',String(previewMotion));
 try{const text=serialize($('skin-name').value,v);$('skin-json').value=text;const size=new TextEncoder().encode(text).length;$('export-size').textContent=(size<1024?size+' bytes':(size/1024).toFixed(1)+' KiB')+' · image included when selected';download.disabled=busy;say(busy?'Preparing your image…':'Ready to download.');}
 catch(error){download.disabled=true;$('skin-json').value='';say(error.message,true);}
}
function usePreset(name){operation++;busy=false;appearance=structuredClone(presets[name]);uploaded='';$('image-file').value='';$('image-status').textContent='No uploaded image.';$('skin-name').value='My '+name;$('preset').value=name;sync();}
$('preset').addEventListener('change',()=>usePreset($('preset').value));
for(const b of document.querySelectorAll('[data-preset]'))b.addEventListener('click',()=>{usePreset(b.dataset.preset);$('studio').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});
for(const key of ['theme','effect'])$(key).addEventListener('change',()=>{appearance[key]=$(key).value;render();});
for(const key of ['animation','flares'])$(key).addEventListener('change',()=>{appearance[key]=$(key).checked;render();});
$('skin-name').addEventListener('input',render);$('background').addEventListener('change',()=>{appearance.background=$('background').value;appearance.background_image=appearance.background==='uploaded'?uploaded:'';render();});
$('remove-image').addEventListener('click',()=>{operation++;busy=false;uploaded='';appearance.background='none';appearance.background_image='';$('image-file').value='';$('image-status').textContent='No uploaded image.';sync();});
$('reset-colours').addEventListener('click',()=>{appearance.format_colours={};render();});
$('preview-motion').addEventListener('click',()=>{previewMotion=!previewMotion;render();});
reduced.addEventListener('change',()=>{if(reduced.matches){previewMotion=false;render();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const video of document.querySelectorAll('video'))video.pause();previewMotion=false;render();}});
$('controls').addEventListener('submit',event=>event.preventDefault());
$('image-file').addEventListener('change',async()=>{
 const file=$('image-file').files[0];if(!file)return;const current=++operation;busy=true;render();
 try{const image=await prepareImage(file);if(current!==operation)return;uploaded=image.encoded;appearance.background='uploaded';appearance.background_image=uploaded;$('image-status').textContent=`Prepared ${image.width} × ${image.height} · stays in this browser.`;busy=false;sync();}
 catch(error){if(current===operation){busy=false;render();say(error.message,true);$('image-file').value='';}}
});
$('skin-file').addEventListener('change',async()=>{
 const file=$('skin-file').files[0];if(!file)return;const current=++operation;busy=true;render();
 try{
  if(file.size>LIMIT)throw Error('Choose a skin smaller than 6 MiB.');
  const doc=validate(JSON.parse(await file.text()));
  if(doc.appearance.background==='uploaded'){
   const bytes=Uint8Array.from(atob(doc.appearance.background_image),c=>c.charCodeAt(0));
   const image=await prepareImage(new Blob([bytes]),true);doc.appearance.background_image=image.encoded;
  }
  if(current!==operation)return;appearance=doc.appearance;uploaded=appearance.background_image;$('skin-name').value=doc.name;$('image-file').value='';$('image-status').textContent=uploaded?'Embedded image loaded from your skin.':'No uploaded image.';busy=false;sync();say('Skin imported into this draft. Your installed agent is unchanged.');
 }catch(error){if(current===operation){busy=false;render();say('Could not import: '+error.message,true);}}
 finally{if(current===operation)$('skin-file').value='';}
});
download.addEventListener('click',()=>{
 try{if(busy)throw Error('Wait for your image to finish.');const text=serialize($('skin-name').value,appearance),url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=filename($('skin-name').value);a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);say('Skin downloaded. Open Colors & skins → Import… in Augmentor Desktop.');}
 catch(error){say(error.message,true);}
});
sync();
