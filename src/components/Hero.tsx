import { useCallback, useEffect, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import { Button } from "@/components/ui/button.tsx";

// Hook simple para detectar mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const Hero = () => {
  const [init, setInit] = useState(false);
  const isMobile = useIsMobile();
  const particlesRef = useRef<Container | null>(null);
  const handleParticlesLoaded = useCallback(async (container?: Container): Promise<void> => {
    particlesRef.current = container ?? null;
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Opciones de interactividad según dispositivo
  const interactivity = isMobile
    ? {
        events: {
          onClick: { enable: true, mode: "repulse" },
          onTap: { enable: true, mode: "repulse" },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 80, duration: 1.2 }, // reacción más suave y lenta en mobile
        },
      }
    : {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 70, duration: 5.2 }, // reacción más suave y lenta en desktop
        },
      };

  return (
    <section id="hero" className="w-full bg-gray-900 text-white py-20 relative overflow-hidden">
      {/* Partículas como background solo si el engine está listo */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={handleParticlesLoaded}
          options={{
            fullScreen: { enable: false },
            background: {
              color: { value: "#101828" },
            },
            fpsLimit: 120,
            interactivity,
            particles: {
              color: { value: "#00e0ff" },
              links: {
                color: "#00e0ff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 2,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: { enable: true, width: 800 },
                value: 80,
              },
              opacity: { value: 0.8 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 pt-10 md:pt-0 flex flex-col md:flex-row items-center justify-between gap-10 relative z-30 max-w-screen-xl">
        {/* Texto a la izquierda */}
        <div className="flex-1 text-center md:text-left z-30 relative">
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold mb-6 leading-snug sm:leading-tight">
          Avanza con Avanxia <span className="text-blue-400">Tu Negocio Listo para la Nueva Era Digital</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
          Marketing digital, diseño impactante, desarrollo web y apps con tecnología de punta para tu ventaja competitiva en la era de la IA. <span className="relative inline-block align-middle px-1.5 border-b-2 border-blue-400" style={{padding:'0.1em 0.4em'}}> <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-liquid-gradient">
              Somos tu socio confiable hacia el futuro
              </span>
            </span>
          </p>
          <Button size="tight" asChild>
            <a href="#contact">Cotiza tu Proyecto Gratis</a>
          </Button>
        </div>
        {/* Video a la derecha en desktop, visible en todos los tamaños, con recorte visual y mayor tamaño */}
        <div
          className="flex-1 w-full max-w-2xl flex items-center justify-center -mt-[12%] md:mt-0 relative z-10"
        >
          <div className="aspect-square w-[260px] sm:w-[320px] md:w-[440px] lg:w-[560px] flex items-center justify-center overflow-hidden relative z-10">
            <video
              src="/videos/avanxia_hq_fixed.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center rounded-full"
              style={{ zIndex: 0, position: 'relative' }}
            />
          </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
