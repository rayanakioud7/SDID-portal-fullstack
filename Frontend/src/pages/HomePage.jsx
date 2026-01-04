import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import MoroccanPattern from "../components/MoroccanPattern"; 
import Navbar from '../components/Navbar';

// --- 1. 3D TILT COMPONENT ---
const TiltCard = ({ children, className, glowColor = "cyan" }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotation({ x: rotateX, y: rotateY });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setOpacity(0);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out transform-gpu ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
      }}
    >
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${rotation.y * 10 + 50}% ${rotation.x * -10 + 50}%, ${glowColor === 'cyan' ? 'rgba(34,211,238,0.1)' : 'rgba(59,130,246,0.1)'}, transparent 40%)`,
          opacity: opacity
        }}
      />
      {children}
    </div>
  );
};

// --- 2. FLOATING ICONS ---
const FloatingItem = ({ style, type }) => {
  const renderIcon = () => {
    switch (type) {
      case "math": return <path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z" />;
      case "graph": return <path d="M4 16v1.5h16V16a3 3 0 00-3-3h-3.5a3 3 0 01-3-3v-1h2a3 3 0 003-3V4.5a3 3 0 00-3-3h-3a3 3 0 00-3 3V6a3 3 0 003 3h2v1a3 3 0 01-3 3H7a3 3 0 00-3 3z" />;
      case "code": return <path d="M8 5L3 12l5 7M16 5l5 7-5 7" fill="none" stroke="currentColor" strokeWidth="2" />;
      default: return <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .75c.735-.183 1.507-.312 2.25-.312 1.463 0 2.86.405 4.05 1.115.682.405 1.373.805 2.075 1.192.456.252.975.252 1.43 0 .702-.387 1.393-.787 2.075-1.192a9.713 9.713 0 014.05-1.115 9.735 9.735 0 012.25.312.75.75 0 001-.75V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v13.542a.75.75 0 01-1.5 0V4.533z" />;
    }
  };
  return (
    <div className="absolute animate-float-up text-blue-400 pointer-events-none" style={style}>
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full opacity-40">
        {renderIcon()}
      </svg>
    </div>
  );
};

function HomePage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "Meets Innovation";

  // --- AUTH CHECKER ---
  // Set this to TRUE to see it go to Modules
  // Set this to FALSE to see it go to Login
  const isUserLoggedIn = false; 

  const handleProtectedNavigation = (destination) => {
    console.log("Checking Login Status:", isUserLoggedIn); // Debug log
    if (isUserLoggedIn) {
      navigate(destination);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const items = useMemo(() => {
    const types = ["book", "math", "graph", "code"];
    return [...Array(20)].map((_, i) => {
      const size = 20 + Math.random() * 40;
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * -20;
      const left = Math.random() * 100;
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        id: i, type,
        style: {
          left: `${left}%`, width: `${size}px`, height: `${size}px`,
          animationDuration: `${duration}s`, animationDelay: `${delay}s`,
          "--target-opacity": 0.1 + Math.random() * 0.2,
        },
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden font-sans text-white flex flex-col">
      
      {/* Backgrounds */}
      <MoroccanPattern rotate={true} />
      <div className="absolute inset-0 overflow-hidden z-0">
        {items.map((item) => <FloatingItem key={item.id} style={item.style} type={item.type} />)}
      </div>

      {/* Navbar */}
      <Navbar />
       
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 flex-grow flex flex-col justify-center items-center text-center -mt-10">
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight">
          Data Science <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {typedText}
          </span>
          <span className="animate-pulse text-cyan-400">_</span>
        </h1>

        <p className="text-xl text-blue-100/60 max-w-2xl mb-16 font-light leading-relaxed">
           The intelligent workspace for SDID students. 
           Access your curriculum, run algorithms, and track real-time analytics.
        </p>

        {/* --- THE 3 PILLARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          
          {/* Card 1: MODULES */}
          {/* NOTE: We use DIV here, not Link. The onClick handles the routing. */}
          <div onClick={() => handleProtectedNavigation('/modules')} className="block h-full cursor-pointer">
            <TiltCard className="h-full p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl group hover:border-cyan-500/50 transition-colors">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-cyan-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Modules</h3>
                <p className="text-sm text-gray-400 mb-4">Access structured datasets & PDFs.</p>
                <div className="w-full space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                   <div className="h-2 w-3/4 bg-slate-700 rounded-full mx-auto"></div>
                   <div className="h-2 w-1/2 bg-slate-700 rounded-full mx-auto"></div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 2: PROJECTS */}
          <div onClick={() => handleProtectedNavigation('/modules')} className="block h-full cursor-pointer">
            <TiltCard className="h-full p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-colors">
               <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Projects</h3>
                <p className="text-sm text-gray-400 mb-4">Submit algorithms & pipelines.</p>
                <div className="w-full bg-black/40 rounded p-3 text-left text-[10px] font-mono text-green-400 opacity-60 group-hover:opacity-100 transition-opacity">
                   <p>{`> git push origin main`}</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 3: ANALYTICS */}
          <div onClick={() => handleProtectedNavigation('/modules')} className="block h-full cursor-pointer">
            <TiltCard className="h-full p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl group hover:border-purple-500/50 transition-colors">
               <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Analytics</h3>
                <p className="text-sm text-gray-400 mb-4">Track your performance trajectory.</p>
                <div className="flex items-end justify-center gap-1 h-8 w-full opacity-50 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 bg-purple-500 h-4 rounded-t"></div>
                   <div className="w-2 bg-purple-500 h-8 rounded-t"></div>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>

      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-white/20 text-xs">SDID • 2026</p>
      </footer>

    </div>
  );
}

export default HomePage;