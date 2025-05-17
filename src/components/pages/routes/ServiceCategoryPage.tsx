import React from 'react';
import { useParams } from 'react-router-dom';
import { categoriesData, servicesAndPlansData, ServiceOrPlanItem } from '../../../data/servicesData';
import { Button } from '../../../components/ui/button';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const ServiceCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = categoriesData.find(cat => cat.id === categoryId);

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Categoría no encontrada.</div>;
  }

  const relevantPlans = servicesAndPlansData.filter(
    item => item.type === 'plan' && item.category === category.name
  ).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const relevantServices = servicesAndPlansData.filter(
    item => item.type === 'service' && item.category === category.name
  ).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  
  // Animaciones de Framer Motion
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1],
      },
    }),
  };

  // La función formatPrice ya no es necesaria porque usamos el formato directamente en el JSX

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-16 text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {category.icon && <span className="mr-3">{category.icon}</span>}
            {category.name}
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg leading-8 text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {category.description}
          </motion.p>
        </header>

        {relevantPlans.length > 0 && (
          <section className="mb-16">
            <motion.h2 
              className="text-3xl font-semibold mb-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Paquetes de Servicios
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.3 }}
            >
              {relevantPlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.3 }}
                  className={`relative glass-panel w-full p-8 md:p-10 flex flex-col min-h-[450px] bg-[#1e3a8a]/20 dark:bg-[#1e3a8a]/30 overflow-hidden group shadow-xl transition-all duration-500 border border-border/30 backdrop-blur-md ${plan.isFeatured ? 'border-primary/50 order-first md:order-none' : 'order-none'}`}
                >
                  {plan.isFeatured && (
                    <div className="absolute top-0 inset-x-0">
                      <div className="bg-amber-400 text-amber-950 text-sm font-medium py-1 px-4 rounded-b-lg mx-auto w-fit shadow-sm">
                        Destacado
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                    <p className="text-sm text-foreground/80 mb-4">{plan.shortDescription}</p>
                    {plan.longDescription && <p className="text-xs text-foreground/60 mb-4">{plan.longDescription}</p>}
                    <div className="mt-6 mb-6">
                      <div className="text-3xl font-bold">
                        {plan.price !== null ? `$${plan.price}` : 'Cotizar'}
                        <span className="text-lg ml-1 opacity-70">{plan.priceRange ? `- $${plan.priceRange[1]}` : ''}</span>
                      </div>
                      <div className="text-sm text-foreground/60 mt-1">
                        {plan.priceType === 'único' && plan.duration ? `Pago Único${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                        {plan.priceType === 'mensual' && plan.duration ? `Mensual${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                        {plan.priceType === 'desde' && plan.duration ? `Desde${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                      </div>
                    </div>
                    <ul className="mb-4 space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="primary" className="w-full mt-auto">Más Información</Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {relevantServices.length > 0 && (
          <section className="mb-16">
            <motion.h2 
              className="text-3xl font-semibold mb-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Servicios Individuales Adicionales
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.3 }}
            >
              {relevantServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.3 }}
                  className="relative glass-panel w-full p-8 md:p-10 flex flex-col min-h-[450px] bg-[#1e3a8a]/20 dark:bg-[#1e3a8a]/30 overflow-hidden group shadow-xl transition-all duration-500 border border-border/30 backdrop-blur-md"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                    <p className="text-sm text-foreground/80 mb-4">{service.shortDescription}</p>
                    {service.longDescription && <p className="text-xs text-foreground/60 mb-4">{service.longDescription}</p>}
                    <div className="mt-6 mb-6">
                      <div className="text-3xl font-bold">
                        {service.price !== null ? `$${service.price}` : 'Cotizar'}
                        <span className="text-lg ml-1 opacity-70">{service.priceRange ? `- $${service.priceRange[1]}` : ''}</span>
                      </div>
                      <div className="text-sm text-foreground/60 mt-1">
                        {service.priceType === 'único' && service.duration ? `Pago Único${service.duration ? ` (${service.duration})` : ''}` : ''}
                        {service.priceType === 'mensual' && service.duration ? `Mensual${service.duration ? ` (${service.duration})` : ''}` : ''}
                        {service.priceType === 'desde' && service.duration ? `Desde${service.duration ? ` (${service.duration})` : ''}` : ''}
                      </div>
                    </div>
                    <ul className="mb-4 space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="w-full mt-auto">Consultar Servicio</Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Placeholder for Portfolio Section */}
        <motion.section 
          className="mb-16 py-12 bg-muted/60 dark:bg-muted/30 backdrop-blur-md rounded-2xl border border-border/30 shadow-2xl transition-all duration-500 hover:shadow-[0_10px_60px_-10px_rgba(46,104,255,0.2)] dark:hover:shadow-[0_10px_60px_-10px_rgba(46,104,255,0.15)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-8">Proyectos Relacionados en {category.name}</h2>
            <p className="text-foreground/60 mb-8">
              Aquí mostraremos ejemplos de nuestro trabajo destacado en esta categoría.
            </p>
            {/* Add portfolio items here */}
            <Button size="cta">Ver Portafolio Completo</Button>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section 
          className="py-16 bg-primary text-primary-foreground dark:text-primary-foreground rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-6">¿Interesado en servicios de {category.name}?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Permítenos entender tus necesidades y ofrecerte una solución a medida. ¡Contáctanos para una cotización personalizada!
            </p>
            <Button size="cta" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-semibold">
              Solicitar Cotización Personalizada
            </Button>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default ServiceCategoryPage;
