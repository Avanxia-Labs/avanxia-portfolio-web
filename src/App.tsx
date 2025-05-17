// src/App.tsx
import "./App.css";
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import ThemeSwitcher from "./components/ThemeSwitcher";
import PersonalizedGreeting from "./components/PersonalizedGreeting"; 
// import GreetingDemo from "./components/GreetingDemo";

import HomePage from "@/components/pages/routes/HomePage";
import ServicesPage from "@/components/pages/routes/ServicesPage";
import AboutPage from "@/components/pages/routes/AboutPage";
import ContactPage from "@/components/pages/routes/ContactPage";
import PreciosPage from "@/components/pages/routes/Precios";
import ServiceCategoryPage from '@/components/pages/routes/ServiceCategoryPage';

// ── Componentes generales ───────────────────────────────
import Header           from "./components/Header";

// ── Página individual ───────────────────────────────────
import Evemundo         from "./components/pages/Evemundo";
import Gyb from "./components/pages/Gyb";
import Drivers from "./components/pages/Drivers";
import Pool from "./components/pages/Pool";
import Heromatic from "./components/pages/Heromatic";
import Smart from "./components/pages/Smart";
import Autism from "./components/pages/Autism";
import CuatroCaminos from "./components/pages/CuatroCaminos";
import StarCH from "./components/pages/StarCH";
import Hai from "./components/pages/Hai";
import Redentor from "./components/pages/Redentor";
import Incometax from "./components/pages/incometax";
import Apolo from "./components/pages/Apolo";
import Digital from "./components/pages/Digital";
import Dew from "./components/pages/Dew";
import Milenio from "./components/pages/Milenio";
import Engadi from "./components/pages/Engadi";

import { SolutionProvider } from '@/components/configurator/SolutionConfigurator';

// ── Layouts ─────────────────────────────────────────────
function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function PlainLayout() {
  const navigate = useNavigate();

  return (
    <>
      {/* usa los mismos tokens que tu Header principal */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-[#0f172a] text-card-foreground border-b border-border z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12 px-4">
          <button
            onClick={() => {
              // Primero navegamos a la raíz
              navigate('/');
              
              // Luego navegamos directamente al ID del portfolio usando una función que trabaja en ambos móviles y desktop
              const scrollToPortfolio = () => {
                // 1. Asegurarnos que la sección existe
                const portfolioSection = document.getElementById('portfolio');
                if (!portfolioSection) {
                  // Si no existe, intentamos de nuevo en un momento
                  setTimeout(scrollToPortfolio, 100);
                  return;
                }
                
                // 2. Primero ir directamente a la sección portfolio
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
                
                // 3. Después de un momento, ajustar la posición para ver los proyectos
                setTimeout(() => {
                  // Detectar si estamos en móvil
                  const isMobile = window.innerWidth <= 768;
                  
                  // En móvil hacemos un scroll adicional para asegurarnos que los proyectos son visibles
                  if (isMobile) {
                    // Ajuste estándar para móviles - mueve la vista debajo del título
                    window.scrollBy({ top: 150, behavior: 'smooth' });
                    
                    // Segundo ajuste para asegurar que los proyectos sean visibles
                    setTimeout(() => {
                      const projectCards = document.querySelectorAll('#portfolio .swiper-slide, #portfolio [class*="card"]');
                      if (projectCards && projectCards.length > 0) {
                        const firstCard = projectCards[0];
                        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 400);
                  } else {
                    // En desktop, scroll adicional más suave
                    window.scrollBy({ top: 200, behavior: 'smooth' });
                  }
                }, 600);
              };
              
              // Iniciamos la función después de un breve retraso para permitir la carga
              setTimeout(scrollToPortfolio, 300);
            }}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-80"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Empuje para contenido */}
        <Outlet />
    </>
  );
}


// Componente para persistir la ruta y restaurarla tras recargar
function PersistRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  // Guardar la ruta actual en localStorage
  useEffect(() => {
    localStorage.setItem('lastPath', location.pathname);
  }, [location.pathname]);

  // Restaurar la ruta tras recargar
  useEffect(() => {
    const lastPath = localStorage.getItem('lastPath');
    const currentPath = location.pathname;
    
    // Si estamos en la raíz pero había otra ruta guardada, restaurarla
    if (lastPath && lastPath !== '/' && currentPath === '/') {
      navigate(lastPath);
    }
  }, [navigate]); // Solo se ejecuta una vez al montar el componente

  return null; // Este componente no renderiza nada
}

// ── App (sin BrowserRouter porque está en main.tsx) ─────
export default function App() {
  return (
    <SolutionProvider>
      <PersistRoute />
      <PersonalizedGreeting />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/servicios/:categoryId" element={<ServiceCategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/precios" element={<PreciosPage />} />
        </Route>

        {/* Rutas SIN navbar */}
        <Route element={<PlainLayout />}>
          <Route path="/proyectos/evemundo" element={<Evemundo />} />
          <Route path="/proyectos/gyb" element={<Gyb />} />
          <Route path="/proyectos/drivers" element={<Drivers />} />
          <Route path="/proyectos/pool" element={<Pool />} />
          <Route path="/proyectos/heromatic" element={<Heromatic />} />
          <Route path="/proyectos/smart" element={<Smart />} />
          <Route path="/proyectos/autism" element={<Autism />} />
          <Route path="/proyectos/cuatrocaminos" element={<CuatroCaminos />} />
          <Route path="/proyectos/star" element={<StarCH />} />
          <Route path="/proyectos/hai" element={<Hai />} />
          <Route path="/proyectos/incometax" element={<Incometax />} />
          <Route path="/proyectos/redentor" element={<Redentor />} />
          <Route path="/proyectos/apolo" element={<Apolo />} />
          <Route path="/proyectos/digital" element={<Digital />} />
          <Route path="/proyectos/dew" element={<Dew />} />
          <Route path="/proyectos/milenio" element={<Milenio />} />
          <Route path="/proyectos/engadi" element={<Engadi />} />
        </Route>
      </Routes>
    </SolutionProvider>
  );
}
