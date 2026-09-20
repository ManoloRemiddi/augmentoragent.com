// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
import {presets,ranges,roles,LIMIT,validate,serialize,filename,formatDefaults,sliderGradient} from './skin-format.mjs?v=2';
import {prepareImage} from './skin-images.mjs?v=2';
import {NativePreview} from './skin-preview.mjs?v=2';
const $=id=>document.getElementById(id),status=$('status'),download=$('download');
let appearance=structuredClone(presets.Futuristic),uploaded='',operation=0,busy=false,previewMotion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const preview=new NativePreview($('preview-stage'));
const titles={hue:'Panel colour',accent_hue:'Accent colour',brightness:'Panel brightness',accent_brightness:'Accent brightness',saturation:'Saturation',opacity:'Opacity'};
for(const key of ['hue','brightness','accent_hue','accent_brightness','saturation','opacity']){
 const label=document.createElement('label');label.className='slider-label';label.htmlFor=key;label.textContent=titles[key];
 const output=document.createElement('output');output.id=key+'-value';output.htmlFor=key;label.append(output);
 const input=document.createElement('input');input.type='range';input.id=key;[input.min,input.max]=ranges[key];input.step='1';
 input.addEventListener('input',()=>{appearance[key]=Number(input.value);render();});$('sliders').append(label,input);
}
for(const role of roles){const label=document.createElement('label');label.textContent=role;const input=document.createElement('input');input.type='color';input.id='colour-'+role;input.setAttribute('aria-label',role+' colour');input.addEventListener('input',()=>{appearance.format_colours[role]=input.value;render();});label.append(input);$('format-colours').append(label);}
function say(message,error=false){status.textContent=message;status.classList.toggle('error',error);}
function sync(){
 for(const key of Object.keys(ranges))$(key).value=appearance[key];
 for(const key of ['theme','effect','background'])$(key).value=appearance[key];
 for(const key of ['animation','flares'])$(key).checked=appearance[key];
 $('background').querySelector('[value="uploaded"]').disabled=!uploaded;
 $('remove-image').disabled=!uploaded;render();
}
function render(){
 const v=appearance,box=$('agent-preview');
 preview.update(v,previewMotion);
 const defaults=formatDefaults(v);
 for(const role of roles){const colour=v.format_colours[role]||defaults[role],input=$('colour-'+role);if(document.activeElement!==input)input.value=colour;const code=box.querySelector(`[data-code="${role}"]`);if(code)code.style.color=colour;}
 for(const heading of box.querySelectorAll('h3,h4'))heading.style.color=v.format_colours.heading||defaults.heading;
 for(const emphasis of box.querySelectorAll('.preview-transcript em,.preview-transcript p strong'))emphasis.style.color=v.format_colours.emphasis||defaults.emphasis;box.querySelector('a').style.color=v.format_colours.link||defaults.link;
 for(const key of Object.keys(ranges)){$(key+'-value').textContent=v[key]+(['opacity','saturation'].includes(key)?'%':'');$(key).style.setProperty('--range-gradient',sliderGradient(key,v));}
 $('preview-motion').disabled=!v.animation;$('preview-motion').textContent=!v.animation?'Motion disabled':previewMotion?'Pause motion':'Play motion';$('preview-motion').setAttribute('aria-pressed',String(previewMotion&&v.animation));
 $('preview-flare').disabled=!(previewMotion&&v.animation&&v.flares&&v.effect==='plasma');
 try{const text=serialize($('skin-name').value,v);$('skin-json').value=text;const size=new TextEncoder().encode(text).length;$('export-size').textContent=(size<1024?size+' bytes':(size/1024).toFixed(1)+' KiB')+' · image included when selected';download.disabled=busy;say(busy?'Preparing your image…':'Ready to download.');}
 catch(error){download.disabled=true;$('skin-json').value='';say(error.message,true);}
}
function usePreset(name){operation++;busy=false;appearance=structuredClone(presets[name]);uploaded='';$('image-file').value='';$('image-status').textContent='No uploaded image.';$('skin-name').value='My '+name;$('preset').value=name;sync();}
$('preset').addEventListener('change',()=>usePreset($('preset').value));
for(const key of ['theme','effect'])$(key).addEventListener('change',()=>{appearance[key]=$(key).value;render();});
for(const key of ['animation','flares'])$(key).addEventListener('change',()=>{appearance[key]=$(key).checked;render();});
$('skin-name').addEventListener('input',render);$('background').addEventListener('change',()=>{appearance.background=$('background').value;appearance.background_image=appearance.background==='uploaded'?uploaded:'';render();});
$('remove-image').addEventListener('click',()=>{operation++;busy=false;uploaded='';appearance.background='none';appearance.background_image='';$('image-file').value='';$('image-status').textContent='No uploaded image.';sync();});
$('reset-colours').addEventListener('click',()=>{appearance.format_colours={};render();});
$('preview-flare').addEventListener('click',()=>preview.triggerFlare());
$('preview-motion').addEventListener('click',()=>{previewMotion=!previewMotion;render();});
reduced.addEventListener('change',()=>{if(reduced.matches){previewMotion=false;render();}});
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
