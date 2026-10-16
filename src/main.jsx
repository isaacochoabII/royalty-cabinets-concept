import React, {Component, Suspense, lazy, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const DesktopHero = lazy(() => import('./DesktopHero.jsx'));
class HeroBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}
function useMotionProfile(){
 const [profile,setProfile]=useState({enabled:false,mobile:true});
 useEffect(()=>{
  const wide=matchMedia('(min-width: 900px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setProfile({enabled:!reduced.matches,mobile:!wide.matches});
  update();wide.addEventListener('change',update);reduced.addEventListener('change',update);
  return()=>{wide.removeEventListener('change',update);reduced.removeEventListener('change',update);};
 },[]);
 return profile;
}
function App(){
  const {enabled:supported,mobile}=useMotionProfile();
  const [failed,setFailed]=useState(false),[ready,setReady]=useState(false),[paused,setPaused]=useState(false);
  const section=useRef(null),stage=useRef(null);
  const animated=supported&&!failed;
  useEffect(()=>{if(!supported){setReady(false);setPaused(false);const intro=section.current?.querySelector('.hero-intro');if(intro){intro.style.opacity='1';intro.style.transform='none';intro.inert=false;}section.current?.style.setProperty('--arrival',0);}},[supported]);
  return <>
    <header className="site-header"><a className="logo" href="#home"><img src={`${import.meta.env.BASE_URL}assets/logo.png`} width="361" height="81" alt="Royalty Cabinets"/></a><nav aria-label="Main navigation"><a href="#spaces">The possibilities</a><a href="#work">Our work</a><a href="#approach">Our approach</a></nav><a className="header-cta" href="#contact">Start your project <span>↗</span></a></header>
    <main>
      <section id="home" ref={section} className={`hero-scroll ${animated&&ready?'is-3d':''}`} aria-label="Royalty Cabinets introduction">
        <div className="hero-stage" ref={stage}>
          <div className={`photo-fallback ${animated&&ready?'is-hidden':''}`}><img src={`${import.meta.env.BASE_URL}assets/hero.jpg`} alt="A completed kitchen from Royalty Cabinets’ website" fetchPriority="high"/><div className="photo-shade"/></div>
          {animated&&<HeroBoundary onFailure={()=>setFailed(true)}><Suspense fallback={null}><DesktopHero key={mobile?'mobile':'desktop'} mobile={mobile} section={section} stage={stage} paused={paused} onReady={()=>setReady(true)} onFailure={()=>setFailed(true)}/></Suspense></HeroBoundary>}
          <div className="hero-intro"><p className="eyebrow">ROYALTY CABINETS · GREATER MONCTON</p><h1>Considered.<br/><em>To the last detail.</em></h1><p className="intro-note">Beautiful spaces begin with thoughtful choices.<br/>Let’s bring yours together.</p><a href="#spaces" className="quiet-link">Explore the possibilities <span>↗</span></a></div>
          <div className="hero-arrival" aria-hidden="true"><p className="eyebrow">FROM INDIVIDUAL DETAILS. TO EVERYDAY LIFE.</p><h2>A space.<br/><em>Entirely yours.</em></h2></div>
          <div className="hero-bottom"><div><span className="phase-label">01 / A FEW BEAUTIFUL DETAILS</span><div className="progress-line"><i/></div></div><span className="scroll-caption">{animated&&ready?'SCROLL TO BRING IT TOGETHER ↓':'CABINET SUPPLY & PROFESSIONAL INSTALLATION'}</span>{animated&&ready&&<button className="motion-toggle" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'}</button>}</div>
          {animated&&ready&&<span className="scene-caption">ILLUSTRATIVE KITCHEN CONCEPT</span>}
        </div>
      </section>
      <section id="spaces" className="section spaces"><p className="eyebrow">01 / THE POSSIBILITIES</p><div className="intro-grid"><h2>Beautiful to look at.<br/><em>Better to live in.</em></h2><div><p>A kitchen for slow Sundays. A bathroom that brings a little calm. Storage that makes everything feel in place.</p><p>We help you select and supply the right cabinets, then bring your space together with professional installation.</p></div></div><div className="space-grid">{[['kitchen','Kitchens'],['bathroom','Bathrooms'],['custom','Custom spaces']].map(([key,label],i)=><a href="#contact" className="space-card" key={key}><div className="space-image"><img src={`${import.meta.env.BASE_URL}assets/${key}.jpg`} alt={`${label} from the Royalty Cabinets website`} loading="lazy" width="450" height="400"/></div><div className="space-label"><span><small>0{i+1}</small>{label}</span><span>↗</span></div></a>)}</div></section>
      <section id="work" className="section work"><div className="work-heading"><div><p className="eyebrow">02 / REAL SPACES, REAL POSSIBILITIES</p><h2>Make room<br/><em>for your life.</em></h2></div><a className="quiet-link" href="https://royaltycabinets.ca/gallery/" target="_blank" rel="noreferrer">Explore the gallery ↗</a></div><figure><img src={`${import.meta.env.BASE_URL}assets/project2.jpg`} alt="White kitchen cabinets and an island from Royalty Cabinets’ gallery" loading="lazy" width="1440" height="1080"/><figcaption><span>A place for the everyday.</span><span>FROM THE ROYALTY GALLERY</span></figcaption></figure></section>
      <section id="approach" className="section approach"><p className="eyebrow">03 / EXPERTISE THAT BRINGS IT TOGETHER</p><h2>From your first idea<br/><em>to the final detail.</em></h2><div className="steps">{[['Let’s talk.','Tell us about your space and what you have in mind. Begin with a free, no-obligation estimate.'],['Find your fit.','Select and order through our cabinet manufacturing partners—or let us install cabinets you’ve already purchased.'],['Feel at home.','Professional preparation, assembly, and installation, with attention to the details that keep your project moving.']].map(([title,copy],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><a className="quiet-link" href="https://royaltycabinets.ca/installation/" target="_blank" rel="noreferrer">Installation for homeowners, contractors & multi-unit projects ↗</a></section>
      <section id="contact" className="section contact"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Let’s bring<br/><em>your vision home.</em></h2><a className="estimate" href="https://royaltycabinets.ca/estimates/" target="_blank" rel="noreferrer">Request a free estimate <span>↗</span></a><div className="contact-details"><a href="tel:+15068751527">(506) 875-1527</a><span>571 Ferdinand BLVD<br/>Dieppe, NB · E1A 0N7</span></div></section>
    </main><footer><img src={`${import.meta.env.BASE_URL}assets/logo.png`} width="361" height="81" alt="Royalty Cabinets"/><span>GREATER MONCTON, NEW BRUNSWICK</span><span>WEBSITE EXPERIENCE CONCEPT</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
