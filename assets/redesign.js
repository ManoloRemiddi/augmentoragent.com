/* Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT */
(() => {
  'use strict';
  const canvas = document.querySelector('#atmosphere');
  const ctx = canvas.getContext('2d', {alpha: true});
  const smoke = document.createElement('canvas'); smoke.width=144; smoke.height=96;
  const smokeCtx=smoke.getContext('2d'); const smokePixels=smokeCtx.createImageData(144,96);
  const toggle = document.querySelector('#motion');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !preference.matches, manual = false;
  let width = 0, height = 0, raf = 0, last = 0, phase = 0, previousScroll = scrollY, scrollImpulse = 0;
  const pointer = {x: -2000, y: -2000};
  const clouds = Array.from({length: 9}, (_, i) => ({x: .15 + (i * .173) % .8, y: (i * .267) % 1, dx: 0, dy: 0, i}));
  const particles = Array.from({length: 48}, (_, i) => ({x: (i * .6180339) % 1, y: (i * .4142135) % 1, dx: 0, dy: 0}));
  function resize() {
    width = innerWidth; height = innerHeight;
    // Half-resolution atmosphere, independent of device pixel ratio.
    canvas.width = Math.ceil(width * .5); canvas.height = Math.ceil(height * .5);
    draw(0);
  }
  function draw(dt) {
    if (!ctx) return;
    phase += dt;
    // A low-resolution evolving density field, smoothly enlarged into smoke.
    // Folded waves add structure; the pointer parts the cloud and scroll stirs it.
    const data=smokePixels.data, t=phase*.23;
    for(let y=0;y<96;y++)for(let x=0;x<144;x++){
      const u=x/144,v=y/96,px=pointer.x/width,py=pointer.y/height;
      const distance=Math.hypot(u-px,(v-py)*height/width);
      const push=enabled?Math.exp(-distance*distance*35):0;
      const a=u+.065*Math.sin(v*9+t)+push*(u-px)*.8;
      const b=v+.055*Math.cos(u*8-t)-scrollImpulse*.00005;
      const wave=(Math.sin(a*11+b*4+t)+Math.sin(b*13-a*5-t*.7)+.5*Math.sin(a*24+b*16+t*.6))/2.5;
      const envelope=Math.exp(-Math.pow((u-.78)/.42,2)-Math.pow((v-.4)/.65,2))*.9+Math.exp(-Math.pow((u-.08)/.3,2)-Math.pow((v-.9)/.35,2))*.6;
      const folds=Math.exp(-Math.pow((wave+.12*Math.sin(b*7+t))/.24,2));
      const density=Math.max(0,(.22+wave*.2+folds*.38)*envelope)*(1-push*.5);
      const offset=(y*144+x)*4;
      data[offset]=116+folds*45; data[offset+1]=92+Math.sin(a*3+t)*25+folds*35; data[offset+2]=210+folds*35; data[offset+3]=Math.min(105,density*155);
    }
    smokeCtx.putImageData(smokePixels,0,0);
    ctx.setTransform(.5, 0, 0, .5, 0, 0); ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';
    ctx.imageSmoothingEnabled=true;ctx.drawImage(smoke,0,0,width,height);
    const active = enabled && dt > 0;
    clouds.forEach(c => {
      const baseX = c.x * width + Math.sin(phase * .17 + c.i) * 65;
      const baseY = c.y * height + Math.cos(phase * .13 + c.i * 2) * 55;
      if (active) {
        const vx = baseX + c.dx - pointer.x, vy = baseY + c.dy - pointer.y;
        const distance = Math.hypot(vx, vy), force = Math.max(0, 1 - distance / 380);
        c.dx += ((vx / (distance || 1)) * force * 100 - c.dx * .7) * dt;
        c.dy += ((vy / (distance || 1)) * force * 100 - c.dy * .7 + scrollImpulse * .09) * dt;
      }
      const x = baseX + c.dx, y = baseY + c.dy;
      const r = Math.min(width * .38, 420) + Math.sin(phase * .3 + c.i) * 25;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      const rgb = c.i % 3 === 0 ? '103,157,213' : c.i % 3 === 1 ? '134,84,200' : '166,105,183';
      gradient.addColorStop(0, `rgba(${rgb},.11)`); gradient.addColorStop(.35, `rgba(${rgb},.06)`); gradient.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = gradient; ctx.fillRect(x-r, y-r, r*2, r*2);
    });
    particles.slice(0, width < 700 ? 24 : 48).forEach((p, i) => {
      const bx = p.x * width, by = (p.y * height + phase * (2 + i % 4)) % height;
      if (active) {
        const vx = bx + p.dx - pointer.x, vy = by + p.dy - pointer.y;
        const d = Math.hypot(vx, vy), f = Math.max(0, 1 - d / 180);
        p.dx += ((vx/(d||1))*f*140-p.dx*.8)*dt;
        p.dy += ((vy/(d||1))*f*140-p.dy*.8+scrollImpulse*.2)*dt;
      }
      ctx.fillStyle = `rgba(205,194,247,${.14 + .16 * (1 + Math.sin(phase + i)) / 2})`;
      ctx.beginPath(); ctx.arc(bx+p.dx, by+p.dy, i%5===0?1.5:.7, 0, Math.PI*2); ctx.fill();
    });
    scrollImpulse *= .9;
  }
  function frame(now) {
    raf = 0;
    if (!enabled || document.hidden) return;
    if (now-last >= 32) { const dt = Math.min((now-last)/1000,.05); last=now; draw(dt); }
    raf=requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf=0;
    toggle.textContent=enabled?'Motion on':'Motion off'; toggle.setAttribute('aria-pressed',String(enabled));
    document.body.classList.toggle('motion-off',!enabled || document.hidden);
    if(!enabled || document.hidden) document.querySelector('#skin-film')?.pause();
    if(enabled&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}
    else draw(0);
  }
  toggle.addEventListener('click',()=>{manual=true;enabled=!enabled;sync();});
  preference.addEventListener('change',()=>{if(!manual){enabled=!preference.matches;sync();}});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pointermove',e=>{if(enabled){pointer.x=e.clientX;pointer.y=e.clientY;}},{passive:true});
  document.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-2000;});
  window.addEventListener('scroll',()=>{if(enabled)scrollImpulse=Math.max(-500,Math.min(500,scrollImpulse+(scrollY-previousScroll)*2));previousScroll=scrollY;},{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
    const compact=button.dataset.view==='compact';
    document.querySelector('#expanded').hidden=compact;document.querySelector('#compact').hidden=!compact;
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('#state-description').innerHTML=compact?'Out of the way.<br>Still in the flow.':'Room for the conversation.<br>Light around the work.';
  }));
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const source=document.getElementById(button.dataset.copy),status=document.getElementById('copy-status');
    try{await navigator.clipboard.writeText(source.value);status.textContent='Installation prompt copied. Paste it into your coding assistant.';}
    catch{source.focus();source.select();status.textContent='Select and copy the highlighted prompt with Ctrl+C (or Command+C).';}
  }));
  const film=document.querySelector('#skin-film'),filmButton=document.querySelector('#skin-play');
  const films={futuristic:{src:'assets/futuristic-animation.webm',poster:'assets/desktop-futuristic.png',label:'Futuristic native desktop with plasma activity'},blossom:{src:'assets/desktop-skin-animation.webm',poster:'assets/desktop-voice-butterflies.png',label:'Blossom lake native desktop with butterfly activity'}};
  document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{
    const choice=films[button.dataset.film];film.pause();film.src=choice.src;film.poster=choice.poster;film.setAttribute('aria-label',choice.label);film.load();filmButton.textContent='Play skin animation';
    document.querySelectorAll('[data-film]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  filmButton?.addEventListener('click',async()=>{
    if(!film.paused){film.pause();return;}
    try{await film.play();}catch{filmButton.textContent='Use video controls to play';}
  });
  film?.addEventListener('play',()=>{filmButton.textContent='Pause skin animation';});
  film?.addEventListener('pause',()=>{filmButton.textContent='Play skin animation';});
  resize();sync();
})();
