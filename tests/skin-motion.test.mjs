// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {Swarm,FlowNoise,FluidField,emissionPixel} from '../assets/skin-motion.mjs';
import {hslHex,sliderGradient,presets,palette,formatDefaults} from '../assets/skin-format.mjs';
const native=JSON.parse(readFileSync(new URL('./native-motion-fixtures.json',import.meta.url)));
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
const noise=new FlowNoise();noise.values=Float64Array.from({length:128*128},(_,i)=>.5+.35*Math.sin(i*.073)*Math.cos(i*.013));
test('smooth field sampling matches native across wrapped and negative coordinates',()=>{for(const [x,y,expected] of native.noise)near(noise.sample(x,y),expected);});
test('420 butterflies use native cursor wake, flight, timestep clamp and boundary reflection',()=>{const swarm=new Swarm();assert.equal(swarm.butterflies.length,420);swarm.butterflies=structuredClone(native.swarm.initial);for(const step of native.swarm.steps){swarm.advance(step.dt,step.pointer,()=>0);for(let i=0;i<step.expected.length;i++)for(const [key,value] of Object.entries(step.expected[i]))near(swarm.butterflies[i][key],value);}});
test('static plasma, breathing plasma and solar-arch flare match native emission',()=>{for(const frame of native.emission)for(const [x,y,d,fade,expected] of frame.pixels){const actual=emissionPixel(noise,x,y,d,fade,frame.t,frame.breath,[168,223,206],frame.eruption);for(let i=0;i<4;i++)near(actual[i],expected[i],1);}});
test('fluid transport and pressure projection match native float32 fields',()=>{const {width:w,height:h,steps}=native.fluid,field=new FluidField(w,h),source=Uint8ClampedArray.from({length:w*h*4},(_,i)=>(i*17+19)%256),distance=Float32Array.from({length:w*h},(_,i)=>i%90);for(const step of steps){field.step(source,step.dt,step.pointer,distance);for(let i=0;i<field.dye.length;i++)near(field.dye[i],step.dye[i],.000002);for(let i=0;i<field.velocity.length;i++)near(field.velocity[i],step.velocity[i],.000002);}});
test('native colour bars and text palettes respond to selected settings',()=>{assert.deepEqual(Array.from({length:7},(_,i)=>hslHex(i*60%360,80,55)),native.hueStops);const v={...presets.Futuristic,accent_hue:280};assert.equal(sliderGradient('saturation',v),`linear-gradient(90deg,#999999,${hslHex(280,100,50)})`);assert.ok(sliderGradient('opacity',v).includes(palette(v).accent));assert.equal(formatDefaults(v).keyword,'#c4a7ff');assert.equal(formatDefaults({...v,theme:'light'}).string,'#236b35');});
