import { useSectionUnderlineOnView } from "../hooks/use-section-underline";

import { Button } from "./ui/button";
import { SecondaryButton } from "./ui/SecondaryButton";

// Eliminar el hook problemático y el useRef no utilizado
// import { useGlassCardActiveOnView } from "../hooks/use-section-underline";
// import { useRef } from "react";


const Services = () => {
  // Imágenes de Unsplash relacionadas con cada servicio
  const servicesList = [
    {
      title: 'Branding e Identidad Corporativa',
      description: 'Creamos marcas memorables. Desde el naming y diseño de logotipo hasta el desarrollo de un manual de marca completo que guíe la comunicación visual de tu empresa.',
      icon: '🎨',
      image: '/images/portfolio/services/branding.png'    },
    {
      title: 'Diseño y Desarrollo Web',
      description: 'Construimos sitios web modernos, rápidos y optimizados. Nos especializamos en tecnologías como React/Next.js y NestJS para ofrecer un rendimiento superior.',
      icon: '💻',
      image: '/images/portfolio/services/diseñ_des.png'
    },
    {
      title: 'Desarrollo de Aplicaciones Web y Móviles',
      description: 'Transformamos tus ideas en aplicaciones funcionales y escalables. Desarrollamos soluciones full-stack y serverless adaptadas a tus necesidades específicas.',
      icon: '📱',
      image: '/images/portfolio/services/desarrollo.png'
    },
    {
      title: 'Gestión de Redes Sociales',
      description: 'Maximizamos tu presencia en redes sociales con un estilo único que te convierta en referente en tu nicho. Te guiamos desde la estrategia hasta la gestión de comunidades.',
      icon: '🌐',
      image: '/images/portfolio/services/redes_sociales.png'
    },
    {
      title: 'Publicidad Pagada (Paid Media)',
      description: 'Aumentamos tu visibilidad y generamos leads cualificados a través de campañas efectivas en Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads.',
      icon: '📊',
      image: '/images/portfolio/services/publicidad.png'
    },
    {
      title: 'SEO y Marketing de Contenidos',
      description: 'Mejoramos tu posicionamiento orgánico en buscadores. Creamos contenido relevante, optimizamos tu sitio y construimos enlaces de calidad.',
      icon: '🔍',
      image: '/images/portfolio/services/seo.png'
    },
    {
      title: 'Email Marketing y Automatización',
      description: 'Creamos y gestionamos campañas de email marketing para nutrir leads y fidelizar clientes. Implementamos flujos de automatización con herramientas como HubSpot.',
      icon: '✉️',
      image: '/images/portfolio/services/email_mark.png'
    },
    {
      title: 'Producción Audiovisual',
      description: 'Damos vida a tu marca con contenido visual único y original. Creamos fotografía de producto, videos corporativos, motion graphics y spots publicitarios.',
      icon: '🎬',
      image: '/images/portfolio/services/digital.png'
    },
    {
      title: 'Impresión y Material POP',
      description: 'Complementamos tu estrategia digital con materiales impresos de alta calidad, desde tarjetas de presentación hasta elementos para puntos de venta (POP).',
      icon: '🖨️',
      image: '/images/portfolio/services/pop.png'
    },
    {
      title: 'Mantenimiento y Soporte Web',
      description: 'Ofrecemos servicios de mantenimiento técnico, actualizaciones de contenido y soporte continuo para asegurar el óptimo funcionamiento de tu sitio web.',
      icon: '🛠️',
      image: '/images/portfolio/services/mant_soporte.png'
    },
  ];

  // IMPORTANTE: Mantener este hook (error de "Rendered fewer hooks than expected")
  const underlineRef = useSectionUnderlineOnView<HTMLSpanElement>();

  // Categorías simplificadas
  const categories = [
    { id: "branding", title: "Branding & Web", start: 0, end: 3 },
    { id: "marketing", title: "Marketing Digital", start: 3, end: 7 },
    { id: "produccion", title: "Producción & Soporte", start: 7, end: 10 }
  ];

  return (
    <section id="services" className="py-24 bg-background text-foreground">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-8">
          <span ref={underlineRef} className="section-title-underline">Nuestros Servicios 360° para Impulsar tu Negocio</span>
        </h2>
        <p className="text-center text-foreground opacity-90 mb-16 max-w-4xl mx-auto text-lg md:text-2xl">
          En Avanxia Labs, ofrecemos una gama completa de servicios digitales diseñados para cubrir todas las necesidades de tu negocio online. Desde la creación de tu marca hasta la ejecución de campañas de marketing avanzadas, nuestro equipo multidisciplinario está listo para ayudarte a alcanzar tus objetivos.
        </p>

        {/* Navegación de categorías */}
        <div className="hidden md:flex justify-center mb-14 space-x-12">
          {categories.map((cat) => (
            <a 
              key={cat.id}
              href={`#services-${cat.id}`} 
              className="text-xl font-medium text-foreground hover:text-primary transition-colors"
            >
              {cat.title}
            </a>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 max-w-2xl mx-auto mb-10">
          <SecondaryButton asChild className="w-full sm:w-auto text-center">
            <a className="inline-block w-full text-center whitespace-nowrap" href="#contact">Impulsa tus ventas</a>
          </SecondaryButton>
          <Button asChild className="w-full sm:w-auto text-center px-3">
            <a className="inline-block w-full text-center whitespace-nowrap" href="#pricing">
              Consulta nuestros planes
            </a>
          </Button>
        </div>

        {/* Secciones de servicios por categoría */}
        {categories.map((category) => (
          <div key={category.id} id={`services-${category.id}`} className="mb-16">
            {/* Título de categoría */}
            <h3 className="text-2xl font-bold mb-8 text-center md:text-left pb-2 border-b border-border">
              {category.title}
            </h3>
            
            {/* Grid de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {servicesList.slice(category.start, category.end).map((service, index) => {
                // Imagen siempre a la derecha en desktop
                return (
                  <div 
                    key={`${category.id}-service-${index}`}
                    className="glass-panel relative overflow-hidden h-full"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Contenido */}
                      <div className="w-full md:w-3/5 p-6 flex flex-col justify-center">
                        <div className="text-3xl text-primary mb-3">{service.icon}</div>
                        <h4 className="text-xl font-bold mb-3 text-foreground">{service.title}</h4>
                        <p className="text-base text-foreground/90 leading-relaxed">{service.description}</p>
                      </div>
                      {/* Imagen */}
                      <div className="w-full md:w-2/5 relative h-48 md:h-auto">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 max-w-2xl mx-auto mb-10">
        <SecondaryButton asChild className="w-full sm:w-auto text-center">
          <a className="inline-block w-full text-center whitespace-nowrap" href="#contact">Contacta con nosotros</a>
        </SecondaryButton>
        <Button asChild className="w-full sm:w-auto text-center px-3">
          <a className="inline-block w-full text-center whitespace-nowrap" href="#pricing">
            Consulta nuestros planes
          </a>
        </Button>
      </div>


      </div>
    </section>
  );
};

export default Services;

