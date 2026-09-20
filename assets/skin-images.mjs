// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
import {IMAGE_LIMIT} from './skin-format.mjs?v=2';
function imageType(bytes){
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 if(bytes.slice(0,8).join()==='137,80,78,71,13,10,26,10')return 'image/png';
 if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
 throw Error('Choose a valid PNG, JPEG or WebP image.');
}
export async function prepareImage(blob,importing=false){
 if(blob.size>(importing?IMAGE_LIMIT:20*1024*1024))throw Error(importing?'The embedded image exceeds 4 MiB.':'Choose an image smaller than 20 MiB.');
 const type=imageType(new Uint8Array(await blob.slice(0,16).arrayBuffer()));
 const bitmap=await createImageBitmap(new Blob([blob],{type}));
 try{
  if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>32000000)throw Error('Choose an image with no more than 32 megapixels.');
  if(importing&&Math.max(bitmap.width,bitmap.height)>1600)throw Error('Shared images must be at most 1600 pixels per side.');
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const ctx=canvas.getContext('2d');ctx.fillStyle='#223038';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const encoded=canvas.toDataURL('image/jpeg',.88).split(',')[1];
  if(atob(encoded).length>IMAGE_LIMIT)throw Error('This image is too complex to fit. Choose a smaller image.');
  return {encoded,width:canvas.width,height:canvas.height};
 }finally{bitmap.close();}
}
