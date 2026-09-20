# Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
"""Generate public, synthetic reference values using the real native implementation."""
import json,math,os,sys
from pathlib import Path
os.environ['QT_QPA_PLATFORM']='offscreen'
sys.path.insert(0,str(Path(sys.argv[1]).resolve()/'apps/native'))
import numpy as np
from PySide6.QtCore import QRectF,QPointF,QRect
from PySide6.QtGui import QColor
from PySide6.QtWidgets import QApplication,QWidget
from augmentor_linux.nature import Butterfly,ButterflySwarm
from augmentor_linux.activity import ActivityHalo,FlowNoise
from augmentor_linux.fluid import FluidField
app=QApplication([]);rect=QRectF(193,193,454,604)
noise=FlowNoise();noise.values=[.5+.35*math.sin(i*.073)*math.cos(i*.013) for i in range(128*128)]
coords=[[-1.4,3.75],[127.9,128.1],[64.5,98.03],[0,0],[256.73,-23.46]]
result={'nativeCommit':'30d21cee2a4a9e217b6ea116bc4eeacdff50aaf0','noise':[[x,y,noise.sample(x,y)] for x,y in coords]}
swarm=ButterflySwarm(7);swarm.prepare(rect);swarm.rng.gauss=lambda a,b:0
fields=['x','y','vx','vy','size','phase','frequency','home','steering']
swarm.butterflies=[Butterfly(x,y,vx,vy,.07,QColor('#ed9962'),phase,1.3,18,7) for x,y,vx,vy,phase in [(180,240,8,-4,.2),(660,700,-5,3,2),(400,190,0,90,4),(830,840,85,80,5),(192,300,0,0,1)]]
result['swarm']={'initial':[{k:getattr(b,k) for k in fields} for b in swarm.butterflies],'steps':[]}
for dt,pointer in [(.04,[180,240]),(.08,[200,250]),(.3,[225,265]),(.04,[-10000,-10000])]:
 swarm.advance(dt,rect,QPointF(*pointer));result['swarm']['steps'].append({'dt':dt,'pointer':pointer,'expected':[{k:getattr(b,k) for k in fields} for b in swarm.butterflies]})
class Window(QWidget):
 compact=False
 def surface_rect(self):return QRect(32,32,456,606)
w=Window();w.resize(520,670);halo=ActivityHalo(w);halo.canvas.resize(840,990);halo.noise=noise
class CaptureFluid:
 def step(self,rgba,*args):return rgba
halo.prepare_geometry(rect);result['emission']=[]
for animated,phase,breath,flare in [(False,0,1,None),(True,1.2,.8,None),(True,1.2,.8,{'start':0,'duration':3,'side':0,'position':.5,'width':50,'travel':43})]:
 halo.animated=animated;halo.phase=phase;halo.breath_phase=breath;halo.flare=flare;halo.fluid=CaptureFluid();halo.frame_key=None;halo.render_field(rect,QColor('#a8dfce'));data=bytes(halo.frame.constBits());points=[]
 for index,x,y,d,fade in halo.samples[::47]:
  points.append([x,y,d,fade,list(data[index:index+4])])
 eruption=None
 if flare:
  progress=phase/3;eruption={'side':0,'along':420,'width':50,'crest':2+43*math.sin(progress*math.pi)**.8,'intensity':math.sin(progress*math.pi)**1.3}
 result['emission'].append({'t':phase if animated else 0,'breath':breath if animated else math.pi/2,'eruption':eruption,'pixels':points})
width,height=24,28;rgba=np.array([(i*17+19)%256 for i in range(width*height*4)],dtype=np.uint8).reshape(height,width,4);distance=np.array([i%90 for i in range(width*height)],dtype=np.float32).reshape(height,width);fluid=FluidField();steps=[]
for dt,pointer in [(.04,(420,300)),(.04,(440,312)),(.07,(438,323))]:
 fluid.step(rgba,(0,0),(840/width,990/height),dt,pointer,distance);steps.append({'dt':dt,'pointer':pointer,'dye':fluid.dye.flatten().tolist(),'velocity':fluid.velocity.flatten().tolist()})
result['fluid']={'width':width,'height':height,'steps':steps}
result['hueStops']=[QColor.fromHslF(i/6%1,.8,.55).name() for i in range(7)]
Path(__file__).with_name('native-motion-fixtures.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
print('Generated native butterfly, plasma, flare, fluid and colour fixtures.')
