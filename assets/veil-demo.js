// Augmentor Agent — website (augmentoragent.com)
// Copyright © 2026 Manolo Remiddi
// SPDX-License-Identifier: MIT
// License: MIT — see LICENSE at the repository root.

/* Augmentor · frost veil demo
   A compact WebGL frost sheet (domain-warped fbm + edge band + snowfall)
   with a plain-language status pill that cycles through the real turn
   labels. Falls back to a CSS gradient under reduce-motion / no-WebGL. */
(function () {
  'use strict'

  const root = document.getElementById('veil-demo')
  if (!root) return

  const pill = root.querySelector('.veil-pill .pill-text')
  const labels = [
    'Thinking…',
    'Checking open tabs…',
    'Opening example.com…',
    'Analysing the page…',
    'Clicking…',
    'Typing…',
    'Augmentor · done ✓',
  ]

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- status pill cycle ---- */
  let labelIdx = 0
  function cycleLabel() {
    pill.textContent = labels[labelIdx]
    pill.style.opacity = '0'
    setTimeout(() => { pill.style.opacity = '1' }, 180)
    labelIdx = (labelIdx + 1) % labels.length
    // last label is "done": remove pulsing dot briefly
    pill.parentElement.classList.toggle('done', labelIdx === labels.length - 1)
  }

  /* ---- WebGL frost ---- */
  function startWebGL() {
    const canvas = document.getElementById('veil-canvas')
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true })
    if (!gl) return false

    /* Fragment shader: domain-warped fbm over simplex-ish value noise,
       box-distance edge band, time-driven snowfall, pointer parallax. */
    const frag = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uSeed;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1.,0.)), u.x),
                   mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for(int i=0;i<4;i++){ v += a*noise(p); p = p*2.03 + vec2(11.7,5.3); a *= 0.5; }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        vec2 p = uv * vec2(uRes.x/uRes.y, 1.0);
        float t = uTime * 0.12;

        // pointer parallax to the view + light
        vec2 tilt = (uPointer - 0.5) * 0.35;
        p += tilt;

        // domain warp (two-level)
        vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t),
                      fbm(p + vec2(5.2, 1.3) + t));
        vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7,9.2) + t*0.7),
                      fbm(p + 4.0*q + vec2(8.3,2.8) + t*0.7));
        float f = fbm(p + 4.0*r);

        // heightfield-derived lighting
        float n = fbm(p + 2.0*q + vec2(3.1,6.7) + t);
        float spec = smoothstep(0.55, 0.92, n);      // moving sheen
        float vein = smoothstep(0.74, 0.99, fbm(p*2.0 + 3.0*r));

        // frost colour (emerald ice)
        vec3 deep = vec3(0.016, 0.078, 0.055);
        vec3 mid  = vec3(0.078, 0.42, 0.27);
        vec3 ice  = vec3(0.72, 0.98, 0.86);
        vec3 col = mix(deep, mid, clamp(f*1.4, 0.0, 1.0));
        col = mix(col, ice, spec*0.55);
        col = mix(col, vec3(0.35, 0.86, 0.62), vein*0.30);

        // box-distance edge band (densest at the border, thin centre)
        vec2 d = abs(uv - 0.5);
        float box = max(d.x, d.y) * 2.0;
        float edge = smoothstep(0.70, 0.97, box);
        col = mix(col, vec3(0.09, 0.62, 0.36), edge*0.6);

        // snowfall: a drifting field of soft blobs
        float snow = 0.0;
        for(int i=0;i<3;i++){
          float fi = float(i);
          vec2 sp = vec2(uv.x + sin(uv.y*6.0 + t*2.0 + fi)*0.05 + t*0.02*fi,
                         fract(uv.y*3.0 - t*(0.15+0.06*fi) + fi));
          float d2 = length(sp - 0.5);
          snow += smoothstep(0.13 + fi*0.03, 0.02, d2) * (0.5 + 0.5*fi);
        }
        snow = clamp(snow*0.6, 0.0, 1.0);
        col = mix(col, ice, snow * (0.25 + edge*0.4));

        // centre alpha thin, edges opaque
        float alpha = mix(0.05, 0.78, edge);
        alpha = clamp(alpha + snow*0.15, 0.0, 1.0);

        gl_FragColor = vec4(col, alpha);
      }
    `

    function compile(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s))
        return null
      }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER,
      'attribute vec2 aP; varying vec2 vUv; void main(){ vUv=aP*0.5+0.5; gl_Position=vec4(aP,0.,1.); }')
    const fs = compile(gl.FRAGMENT_SHADER, frag)
    if (!vs || !fs) return false

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aP')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.clearColor(0, 0, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uPointer = gl.getUniformLocation(prog, 'uPointer')

    // low-res for a soft frost texture
    const W = 440, H = 300
    canvas.width = W
    canvas.height = H
    gl.viewport(0, 0, W, H)

    let pointer = [0.5, 0.5]
    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect()
      pointer = [ (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height ]
    })

    gl.uniform2f(uRes, W, H)
    let start = performance.now()
    let raf
    function frame() {
      const t = (performance.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uPointer, pointer[0], pointer[1])
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }
    frame()

    // clean up on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else frame()
    })

    return true
  }

  if (!reduced) {
    const ok = startWebGL()
    if (!ok) {
      // CSS fallback stays: the .veil-demo background gradient already reads as frost
      document.getElementById('veil-canvas').style.display = 'none'
    }
  } else {
    document.getElementById('veil-canvas').style.display = 'none'
  }

  // cycle the labels
  cycleLabel()
  setInterval(cycleLabel, reduced ? 2600 : 1900)
})()
