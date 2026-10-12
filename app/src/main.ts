import * as THREE from 'three'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<main id="game">
  <div id="world"></div><header><strong>♛ &nbsp;THE SCENE</strong><span>MUSIC SQUARE <small>Lagos · evening</small></span><button id="audio">♪ OFF</button></header>
  <aside id="route" hidden>↗ &nbsp; CITY STUDIO <small>Walk to the violet door</small></aside>
  <section id="panel" hidden><small>IN REACH</small><button id="close" aria-label="Close">×</button><h2 id="title"></h2><p id="copy"></p><button id="action"></button><button id="save" hidden>Save preview</button></section>
  <div id="toast" role="status"></div><footer><span>W A S D &nbsp; MOVE &nbsp; · &nbsp; DRAG TO LOOK</span><button id="desk">✦ &nbsp; DESK <small>Find your next move ↗</small></button></footer>
  <div id="pad"><div id="stick"></div></div>
</main>`

const world = document.querySelector<HTMLDivElement>('#world')!
const scene = new THREE.Scene()
scene.background = new THREE.Color('#181d27')
scene.fog = new THREE.Fog('#181d27', 30, 75)
const camera = new THREE.PerspectiveCamera(56, 1, .1, 100)
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
world.appendChild(renderer.domElement)
const material = (color: string, emissive = '#000000') => new THREE.MeshStandardMaterial({ color, roughness: .88, emissive })
const stone = material('#3a4149'), dark = material('#252732'), wall = material('#aa9481'), gold = material('#d3a563', '#34210d'), violet = material('#9872dc', '#34205b')
function box(w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o
}
function sign(label:string,w:number,h:number,x:number,y:number,z:number) {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256
  const c=canvas.getContext('2d')!;c.fillStyle='#171821';c.fillRect(0,0,1024,256);c.fillStyle='#f6e8d4';c.font='bold 100px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(label,512,135)
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace
  const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));o.position.set(x,y,z);scene.add(o)
}
scene.add(new THREE.HemisphereLight('#d9e3ef','#5b4338',2))
const sun=new THREE.DirectionalLight('#ffd2a2',2.2);sun.position.set(-8,16,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;scene.add(sun)
box(46,.2,44,stone,0,-.15,0)
for(let x=-22;x<23;x+=2)box(.025,.01,44,wall,x,-.04,0)
for(let z=-21;z<22;z+=2)box(46,.01,.025,wall,0,-.04,z)
box(25,7,4,dark,0,3.5,-19);box(22,5,.2,wall,0,2.5,-16.9);box(23,.6,5,dark,0,4.2,-16)
sign('MUSIC SQUARE',12,1.5,-2,4.85,-13.44)
for(let i=0;i<6;i++){const x=-9+i*3.5;box(2.6,2.7,.1,dark,x,1.5,-16.76);box(2,2.2,.1,i%2?violet:gold,x,1.5,-16.69)}
box(12,.7,4,dark,-5,.35,-11);box(12,.2,.15,gold,-5,.78,-8.95)
for(const x of [-10,0])box(1,2.5,.9,dark,x,2,-9.5)
for(const x of [-8,-5,-2]){const light=new THREE.PointLight('#ffbf74',3,9);light.position.set(x,4,-10);scene.add(light)}
box(3,3.1,1.6,dark,-7.5,1.55,1);box(2.7,1.8,.1,violet,-7.5,1.9,1.85);sign('LISTEN HERE',2.5,.55,-7.5,1.65,1.92)
const ring=new THREE.Mesh(new THREE.TorusGeometry(.8,.05,8,40),violet);ring.rotation.x=Math.PI/2;ring.position.set(-7.5,.02,3);scene.add(ring)
box(10,5.5,4,dark,13,2.75,-12);box(3.2,4.2,.15,violet,12,2.1,-9.92);sign('CITY STUDIO',7,1.1,13,4.7,-9.9)
for(const [x,z] of [[-16,-2],[17,3]]){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.2,.3,3,7),material('#594238'));trunk.position.set(x,1.5,z);scene.add(trunk);for(let i=0;i<4;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(1.5,3,5),material('#25483c'));leaf.position.set(x+(i-1.5)*.35,3.4,z);leaf.rotation.z=(i-1.5)*.24;scene.add(leaf)}}
for(const [x,z] of [[-12,6],[2,2],[6,8]])box(3,.55,1.2,wall,x,.28,z)

const avatar=new THREE.Group();scene.add(avatar)
function part(g:THREE.BufferGeometry,m:THREE.Material,x:number,y:number,z:number){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;avatar.add(o);return o}
part(new THREE.CapsuleGeometry(.38,.75,4,8),material('#d8ab68'),0,1.4,0)
part(new THREE.SphereGeometry(.32,10,8),material('#704437'),0,2.35,0)
part(new THREE.SphereGeometry(.34,10,8),material('#1c1920'),0,2.55,-.04)
const legs=[part(new THREE.CapsuleGeometry(.13,.7,3,7),violet,-.2,.55,0),part(new THREE.CapsuleGeometry(.13,.7,3,7),violet,.2,.55,0)]
avatar.position.set(-5,0,5)
const keys=new Set<string>();let yaw=0,drag=false,lastX=0,touchX=0,touchY=0
addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();if(e.key.toLowerCase()==='e'&&near)open(near)})
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()))
world.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag=true;lastX=e.clientX;world.setPointerCapture(e.pointerId)}})
world.addEventListener('pointermove',e=>{if(drag){yaw+=(e.clientX-lastX)*.004;lastX=e.clientX}})
world.addEventListener('pointerup',()=>drag=false)
const pad=document.querySelector<HTMLDivElement>('#pad')!,stick=document.querySelector<HTMLDivElement>('#stick')!
function padMove(e:PointerEvent){const r=pad.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.max(1,Math.hypot(dx,dy)),s=Math.min(1,d/43);touchX=dx/d*s;touchY=-dy/d*s;stick.style.transform=`translate(${touchX*35}px,${-touchY*35}px)`}
pad.addEventListener('pointerdown',e=>{pad.setPointerCapture(e.pointerId);padMove(e)});pad.addEventListener('pointermove',e=>{if(pad.hasPointerCapture(e.pointerId))padMove(e)})
for(const name of ['pointerup','pointercancel'])pad.addEventListener(name,()=>{touchX=touchY=0;stick.style.transform='translate(0,0)'})
const panel=document.querySelector<HTMLElement>('#panel')!,title=document.querySelector<HTMLElement>('#title')!,copy=document.querySelector<HTMLElement>('#copy')!,action=document.querySelector<HTMLButtonElement>('#action')!,save=document.querySelector<HTMLButtonElement>('#save')!,route=document.querySelector<HTMLElement>('#route')!,toast=document.querySelector<HTMLElement>('#toast')!
let near:'kiosk'|'studio'|null=null,saved=false,playing=false,audio:AudioContext|undefined,timer:number|undefined
function message(s:string){toast.textContent=s;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3200)}
function open(kind:'kiosk'|'studio'|'desk'){panel.hidden=false;panel.dataset.kind=kind;save.hidden=kind!=='kiosk'
  if(kind==='kiosk'){title.textContent='Listening station';copy.textContent='Original synthesized preview. No track audio downloads before you choose play.';action.textContent=playing?'Stop preview':'Play preview';action.onclick=()=>{playing?stop():play();action.textContent=playing?'Stop preview':'Play preview'};save.textContent=saved?'Saved ✓':'Save preview';save.onclick=()=>{saved=true;save.textContent='Saved ✓';message('Preview saved for this session')}}
  if(kind==='studio'){title.textContent='City Studio';copy.textContent='You reached the studio door. A creation workstation follows in the next milestone.';action.textContent='Mark visited';action.onclick=()=>{message('City Studio visited');panel.hidden=true}}
  if(kind==='desk'){title.textContent='Desk · next moves';copy.textContent=saved?'Your preview is saved. Walk to City Studio to explore the next creative space.':'The listening station is to your left. Try a preview, then walk to City Studio.';action.textContent='Show route';action.onclick=()=>{route.hidden=false;panel.hidden=true;message('Follow the violet studio door')}}}
document.querySelector('#close')!.addEventListener('click',()=>panel.hidden=true)
document.querySelector('#desk')!.addEventListener('click',()=>open('desk'))
document.querySelector('#audio')!.addEventListener('click',()=>playing?stop():message('Choose Play at the kiosk to start audio'))
function play(){audio??=new AudioContext();void audio.resume();playing=true;let step=0;const notes=[220,261.63,329.63,392,329.63,261.63,196,246.94];const note=()=>{if(!audio||!playing)return;const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=notes[step++%notes.length];g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.075,audio.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.27);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.3)};note();timer=setInterval(note,350);document.querySelector('#audio')!.textContent='♪ ON'}
function stop(){playing=false;clearInterval(timer);document.querySelector('#audio')!.textContent='♪ OFF'}
addEventListener('pagehide',stop)
function resize(){camera.aspect=world.clientWidth/world.clientHeight;camera.updateProjectionMatrix();renderer.setSize(world.clientWidth,world.clientHeight)}addEventListener('resize',resize);resize()
let previous=performance.now(),total=0
function frame(){requestAnimationFrame(frame);const now=performance.now(),dt=Math.min((now-previous)/1000,.05);previous=now;total+=dt
 const f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0)+touchY,s=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+touchX,mag=Math.hypot(f,s)
 if(mag>.05){const a=Math.atan2(s,f)+yaw,k=Math.min(1,mag)*dt*4.5;avatar.position.x=THREE.MathUtils.clamp(avatar.position.x+Math.sin(a)*k,-12,18);avatar.position.z=THREE.MathUtils.clamp(avatar.position.z-Math.cos(a)*k,-13,15);avatar.rotation.y=a;legs[0].rotation.x=Math.sin(total*11)*.4;legs[1].rotation.x=-legs[0].rotation.x}else legs[0].rotation.x=legs[1].rotation.x=0
 camera.position.lerp(avatar.position.clone().add(new THREE.Vector3(Math.sin(yaw)*9,6.5,Math.cos(yaw)*9)),1-Math.exp(-5*dt));camera.lookAt(avatar.position.x,2,avatar.position.z)
 const next=avatar.position.distanceTo(new THREE.Vector3(-7.5,0,2))<4?'kiosk':avatar.position.distanceTo(new THREE.Vector3(12,0,-8))<4?'studio':null
 if(next!==near){near=next;if(near)open(near);else if(panel.dataset.kind!=='desk')panel.hidden=true}
 renderer.render(scene,camera)}frame()
