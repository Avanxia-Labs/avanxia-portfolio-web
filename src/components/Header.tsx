import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home, // Icon for Inicio
  Briefcase, // Icon for Servicios
  // Tag, // Icon for Precios
  // LayoutGrid, // Icon for Portafolio
  Users, // Icon for Equipo
  // Workflow, // Icon for Proceso
  Mail, // Icon for Contacto
  ChevronDown,
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher'; // Import the new component
import { Button } from './ui/button';
import { categoriesData } from '../data/servicesData';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Filtrar categorías para el menú desplegable (excluir 'featured' y 'all')
const serviceCategories = categoriesData
  .filter(cat => cat.id !== 'featured' && cat.id !== 'all' && cat.displayInMainNav)
  .sort((a, b) => a.order - b.order);

const navLinks = [
  { name: 'Inicio', to: '/', icon: Home },
  { name: 'Servicios', to: '/services', icon: Briefcase, hasDropdown: true },
  { name: 'Sobre Nosotros', to: '/about', icon: Users },
  { name: 'Precios', to: '/precios', icon: Users },
];


  const linkGroup1 = navLinks.slice(0, 3);
  const linkGroup2 = navLinks.slice(3);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
<header className="fixed top-0 left-0 w-full z-[60] bg-card border-b border-border overflow-x-hidden">
  <nav className="w-full max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center overflow-x-hidden">
      <div className="w-[250px] h-auto cursor-pointer">
        <a 
          href="/"
          onClick={(e) => { 
            e.preventDefault(); 
            // Si ya estamos en la página principal, solo desplazamos al hero
            if (window.location.pathname === '/') {
              const heroSection = document.querySelector('#hero');
              if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
              }
            } else {
              // Si estamos en otra página, primero navegamos al home
              navigate('/');
              // Añadimos un pequeño retraso para asegurar que la navegación se completa
              setTimeout(() => {
                const heroSection = document.querySelector('#hero');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }
          }}
        >
          <img
            src="/images/portfolio/proyectos/logo.png"
            alt="Avanxia Labs Logo"
            className="w-full h-auto object-contain"
          />
        </a>
      </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => 
              link.hasDropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger className="group relative flex items-center transition duration-300 pb-1 text-sidebar-foreground hover:text-primary">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.name}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-panel border border-border/30 bg-card/80 backdrop-blur-md dark:bg-card/40 shadow-xl rounded-xl overflow-hidden min-w-[220px] animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1">
                    {serviceCategories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <NavLink 
                          to={`/servicios/${category.id}`}
                          className="flex items-center px-4 py-2.5 w-full text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 text-sm font-medium"
                        >
                          {category.icon && <span className="mr-3 text-lg">{category.icon}</span>}
                          {category.name}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `group relative flex items-center transition duration-300 pb-1
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px]
                    after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out
                    hover:after:scale-x-100 ${
                      isActive ? 'after:scale-x-100 text-primary' : 'text-sidebar-foreground'
                    }`
                  }
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </NavLink>
              )
            )}

            <ThemeSwitcher />
          </div>

          <Button
            size="tight"
            className="hidden md:inline-block font-semibold py-2 px-4 ml-4
                      bg-primary text-primary-foreground"
            asChild
          >
            <NavLink to="/contact">
              Contacto
            </NavLink>
          </Button>



          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitcher />
            <button
              className="text-sidebar-foreground hover:text-primary"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

     <div
  className={`fixed top-0 left-0 bottom-0 z-50 max-w-[90vw] w-full sm:w-64 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden bg-sidebar text-sidebar-foreground ${
    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div className="text-lg font-bold text-foreground">
            Avanxia Labs
          </div>
          <button
            className="text-sidebar-foreground hover:text-primary"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-3 mt-4 flex-grow">
          <div className="space-y-1 mb-4">
            {linkGroup1.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-[--gradient-btn] text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary'
                  }`
                }
              >
                <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.name}
              </NavLink>
            ))}
          </div>

          <hr className="border-border my-2" />

          <div className="space-y-1 mb-4">
            {linkGroup2.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-[--gradient-btn] text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary'
                  }`
                }
              >
                <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.name}
              </NavLink>
            ))}
          </div>

          <hr className="border-border my-2" />

          <NavLink
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-[--gradient-btn] text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary'
              }`
            }
          >
            <Mail className="mr-3 h-5 w-5 flex-shrink-0" />
            Contacto
          </NavLink>

          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
