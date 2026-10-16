import React, {useEffect, useMemo, useRef, useState, createContext, useContext} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const clamp=THREE.MathUtils.clamp;
const ease=(p,a,b)=>{const t=clamp((p-a)/(b-a),0,1);return t*t*t*(t*(t*6-15)+10);};
const lerp=THREE.MathUtils.lerp;

const LowDetail=createContext(false);
function Box({size,position=[0,0,0],material,radius=.015,rotation=[0,0,0],castShadow=true}){
  const low=useContext(LowDetail);
  const geometry=useMemo(()=>low?new THREE.BoxGeometry(...size):new RoundedBoxGeometry(...size,2,radius),[size[0],size[1],size[2],radius,low]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} position={position} rotation={rotation} material={material} castShadow={castShadow} receiveShadow/>;
}
function Handle({x,y,z,material,vertical=false}){
 return <group><Box size={vertical?[.024,.42,.032]:[.34,.024,.032]} position={[x,y,z]} material={material} radius={.009}/>{[-1,1].map(i=><Box key={i} size={[.024,.024,.045]} position={[x+(vertical?0:i*.135),y+(vertical?i*.17:0),z-.025]} material={material} radius={.006}/>)}</group>;
}
function Faucet({material}){
 const curve=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,.48,0),new THREE.Vector3(0,.6,.10),new THREE.Vector3(0,.54,.27),new THREE.Vector3(0,.4,.29)]),[]);
 const geometry=useMemo(()=>new THREE.TubeGeometry(curve,32,.023,10,false),[curve]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} material={material} castShadow/>;
}
function Scene({progress,section,paused,onReady,onFailure,mobile}){
 const {gl,scene,invalidate,camera,size}=useThree();
 const kitchen=useRef(),panels=useRef([]),materials=useRef([]),running=useRef(true),pause=useRef(paused),timelineState=useRef({p:0});

 const palette=useMemo(()=>({
  ivory:new THREE.MeshStandardMaterial({color:'#e5e1d8',roughness:.46}),
  charcoal:new THREE.MeshStandardMaterial({color:'#292927',roughness:.42}),
  stone:new THREE.MeshStandardMaterial({color:'#eeece5',roughness:.25,metalness:.03}),
  brass:new THREE.MeshStandardMaterial({color:'#c8aa65',metalness:.82,roughness:.27}),
  steel:new THREE.MeshStandardMaterial({color:'#bbbdb8',metalness:.8,roughness:.33}),
  dark:new THREE.MeshStandardMaterial({color:'#171817',roughness:.3}),
  wall:new THREE.MeshStandardMaterial({color:'#bbb7ae',roughness:.95}),
  floor:new THREE.MeshStandardMaterial({color:'#96928a',roughness:.9}),
  glass:new THREE.MeshStandardMaterial({color:'#141716',metalness:.25,roughness:.12}),
 }),[]);
 const originalColors=useMemo(()=>Object.values(palette).map(m=>m.color.clone()),[palette]);
 const panelMats=useMemo(()=>['#68665e','#e5e1d8','#b7a98c'].map(color=>new THREE.MeshStandardMaterial({color,roughness:.36})),[]);
 const panelGold=useMemo(()=>new THREE.MeshStandardMaterial({color:'#b49352',metalness:.8,roughness:.3}),[]);
 const panelColors=useMemo(()=>['#68665e','#e5e1d8','#b7a98c'].map(c=>new THREE.Color(c)),[]);
 const finalColor=useMemo(()=>new THREE.Color('#e5e1d8'),[]);
 useEffect(()=>{
  let target;
  if(!mobile){const pmrem=new THREE.PMREMGenerator(gl),room=new RoomEnvironment();target=pmrem.fromScene(room,.02);scene.environment=target.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();}
  else {palette.brass.metalness=.3;palette.steel.metalness=.25;panelGold.metalness=.3;}
  scene.background=new THREE.Color('#1b1b1a');
  materials.current=Object.values(palette);
  const lost=e=>{e.preventDefault();onFailure();};gl.domElement.addEventListener('webglcontextlost',lost);
  onReady();invalidate();
  return()=>{scene.environment=null;target?.dispose();Object.values(palette).forEach(m=>m.dispose());panelMats.forEach(m=>m.dispose());panelGold.dispose();gl.domElement.removeEventListener('webglcontextlost',lost);};
 },[]);
 useEffect(()=>{
  const io=new IntersectionObserver(([entry])=>{running.current=entry.isIntersecting;if(entry.isIntersecting)invalidate();});
  io.observe(section.current);return()=>io.disconnect();
 },[]);
 useEffect(()=>{
  const state=timelineState.current;
  const trigger=gsap.to(state,{p:1,ease:'none',scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:mobile?.45:.85,invalidateOnRefresh:true},onUpdate:()=>{section.current.dataset.progress=state.p.toFixed(3);if(!pause.current){progress.current=state.p;if(running.current)invalidate();}}});
  const intro=section.current.querySelector('.hero-intro'),arrival=section.current.querySelector('.hero-arrival'),bar=section.current.querySelector('.progress-line i'),phase=section.current.querySelector('.phase-label');
  const original=trigger.eventCallback('onUpdate');
  trigger.eventCallback('onUpdate',()=>{original();if(pause.current)return;const p=state.p;intro.inert=p>.34;section.current.style.setProperty('--arrival',ease(p,.74,.96));intro.style.opacity=1-ease(p,.13,.33);intro.style.transform=`translateY(${-ease(p,.13,.33)*35}px)`;arrival.style.opacity=ease(p,.75,.94);arrival.style.transform=`translateY(${(1-ease(p,.75,.94))*20}px)`;arrival.setAttribute('aria-hidden',String(p<.75));bar.style.width=`${p*100}%`;phase.textContent=p<.3?'01 / A FEW BEAUTIFUL DETAILS':p<.72?'02 / EVERYTHING COMES TOGETHER':'03 / A PLACE TO CALL YOURS';});
  const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
  const resize=new ResizeObserver(()=>ScrollTrigger.refresh());resize.observe(section.current);
  return()=>{cancelAnimationFrame(refresh);resize.disconnect();trigger.scrollTrigger?.kill();trigger.kill();};
 },[]);
 useEffect(()=>{pause.current=paused;if(!paused){progress.current=timelineState.current.p;invalidate();}},[paused]);
 useFrame(()=>{
  const p=progress.current,reveal=ease(p,.28,.67),travel=ease(p,.1,.63),cameraMove=ease(p,.32,.94);
  if(mobile){
   const fit=Math.max(1,.48/(size.width/size.height));
   camera.position.set(lerp(0,8,cameraMove)*fit,lerp(1.4,6,cameraMove)*fit,lerp(11,23,ease(p,.02,.48))*fit);
   camera.lookAt(0,lerp(1.35,.8,cameraMove),lerp(0,-.3,cameraMove));
  }else{camera.position.set(lerp(0,6.3,cameraMove),lerp(1.35,4.15,cameraMove),lerp(9.6,9.1,cameraMove));camera.lookAt(lerp(0,-.05,cameraMove),lerp(1.05,.65,cameraMove),lerp(0,-.35,cameraMove));}
  panels.current.forEach((panel,i)=>{
   const t=ease(p,.10+i*.045,.49+i*.045);
   panel.position.set(lerp(mobile?-1.12+i*1.12:.65+i*1.38,-2.4+i*1.2,t),lerp((mobile?.05:1.2)+(i===1?.16:0),-.04,t),lerp(0,-1.035,t));
   panel.rotation.set(lerp(-.025,0,t),lerp([-.28,.12,.32][i],0,t),lerp([-.025,.015,-.02][i],0,t));
   panelMats[i].color.copy(panelColors[i]).lerp(finalColor,t);
   panel.scale.set(lerp(.92,1.14,t),lerp(i===1?2.25:2,1.35,t),1);
  });
  kitchen.current.visible=reveal>.001;
  kitchen.current.position.y=lerp(-.12,0,reveal);
  materials.current.forEach((m,i)=>{m.transparent=false;m.opacity=1;m.depthWrite=true;m.color.copy(originalColors[i]).multiplyScalar(.015+.985*reveal);m.envMapIntensity=reveal*.7;});
 });
 return <LowDetail.Provider value={mobile}>
  <ambientLight intensity={mobile?1:.5}/><directionalLight position={[-3,7,6]} intensity={2.4} color="#fff3dc" castShadow={!mobile} shadow-mapSize={[1024,1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0005} shadow-normalBias={.025}/><directionalLight position={[5,4,-2]} intensity={2} color="#fffdf6"/>
  {[0,1,2].map(i=><group key={i} ref={el=>panels.current[i]=el}><Box size={[1,1,.065]} material={panelMats[i]} radius={.014}/><Box size={[.35,.012,.03]} position={[0,.40,.052]} material={panelGold} radius={.006}/></group>)}
  <group ref={kitchen}>
   <Box size={[9,.1,7.4]} position={[0,-.84,.45]} material={palette.floor}/>
   <Box size={[8.6,4.7,.12]} position={[0,1.45,-2.27]} material={palette.wall}/>
   <Box size={[5.15,1.35,.045]} position={[-.6,1.34,-2.18]} material={palette.stone}/>
   <Box size={[4.85,1.42,1.12]} position={[-.6,-.02,-1.62]} material={palette.charcoal}/>
   <Box size={[5.05,.095,1.28]} position={[-.6,.74,-1.56]} material={palette.stone}/>
   <Box size={[4.8,.14,.9]} position={[-.6,-.76,-1.66]} material={palette.dark}/>
   <Box size={[1.14,1.35,.065]} position={[1.2,-.04,-1.035]} material={palette.ivory}/>
   {[-2.4,-1.2,0,1.2].map(x=><Handle key={x} x={x} y={.5} z={-.97} material={palette.brass}/>)}
   {[-2.4,-1.2,1.2].map(x=><group key={x}><Box size={[1.16,1.2,.68]} position={[x,2.25,-1.82]} material={palette.ivory}/><Box size={[1.12,1.16,.045]} position={[x,2.25,-1.455]} material={palette.ivory}/><Handle x={x} y={1.78} z={-1.4} material={palette.brass}/></group>)}
   <Box size={[.55,1.25,.4]} position={[0,2.48,-1.96]} material={palette.ivory}/><Box size={[1.06,.22,.8]} position={[0,1.9,-1.76]} material={palette.ivory}/><Box size={[.95,.025,.68]} position={[0,1.775,-1.73]} material={palette.dark}/>
   <Box size={[.95,.028,.65]} position={[0,.805,-1.57]} material={palette.glass}/>
   {[-.24,.24].flatMap(x=>[-1.38,-1.76].map(z=><mesh key={`${x}${z}`} position={[x,.823,z]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.105,.114,32]}/><meshStandardMaterial color="#62635d" roughness={.4} transparent opacity={1}/></mesh>))}
   <Box size={[.73,.016,.49]} position={[-2.2,.794,-1.52]} material={palette.steel}/><Box size={[.62,.018,.38]} position={[-2.2,.805,-1.52]} material={palette.dark}/><group position={[-2.2,.8,-1.93]}><Faucet material={palette.brass}/></group>
   <Box size={[1.3,3.53,1.23]} position={[2.65,.99,-1.6]} material={palette.charcoal}/>
   <Box size={[.625,2.36,.075]} position={[2.325,1.48,-.935]} material={palette.steel}/><Box size={[.625,2.36,.075]} position={[2.975,1.48,-.935]} material={palette.steel}/><Box size={[1.275,.94,.075]} position={[2.65,-.215,-.935]} material={palette.steel}/>
   <Handle x={2.57} y={1.14} z={-.86} material={palette.steel} vertical/><Handle x={2.73} y={1.14} z={-.86} material={palette.steel} vertical/>
   <Box size={[3.5,1.4,1.3]} position={[-.3,-.03,1.14]} material={palette.charcoal}/><Box size={[3.68,.12,1.48]} position={[-.3,.74,1.14]} material={palette.stone}/><Box size={[3.3,.14,1.1]} position={[-.3,-.77,1.14]} material={palette.dark}/>
   {Array.from({length:mobile?12:30},(_,i)=><Box key={i} size={[.035,1.3,.025]} position={[-1.97+i*(mobile?.30:.115),-.03,1.802]} material={palette.charcoal} radius={.005} castShadow={false}/>)}
   {[-1.2,.5].map(x=><group key={x}><Box size={[.024,1.5,.024]} position={[x,3.23,.9]} material={palette.dark}/><mesh position={[x,2.43,.9]} castShadow><sphereGeometry args={[.19,24,12,0,Math.PI*2,0,Math.PI/2]}/><primitive attach="material" object={palette.brass}/></mesh></group>)}
  </group>
 </LowDetail.Provider>;
}
export default function DesktopHero(props){
 const progress=useRef(0);
 return <div className="webgl-layer" aria-hidden="true"><Canvas shadows={!props.mobile} frameloop="demand" dpr={props.mobile?1:[1,1.5]} camera={{position:[0,1.35,9.6],fov:37,near:.1,far:40}} gl={{antialias:true,alpha:false,powerPreference:props.mobile?'low-power':'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.95;}} fallback={<div className="webgl-unavailable">Kitchen preview</div>}><Scene {...props} progress={progress}/></Canvas></div>;
}
