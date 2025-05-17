// import { useSectionUnderlineOnView } from "../hooks/use-section-underline";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { servicesAndPlansData, ServiceOrPlanItem } from "../data/servicesData";

const Pricing = () => {

  // Si ya no es necesario un visualOrder manual, esta línea se puede eliminar.

  // Animación escalonada
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, // controla el delay entre tarjetas
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
      delay: i * 0.2, // delay específico por tarjeta
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1],
    },
  }),
};



  const referencePrices = [
    { service: 'Tarifa por Hora (General)', range: '$40 - $200+' },
    { service: 'SEO (Retainer Mensual)', range: '$1,000 - $7,500+' },
    { service: 'Publicidad PPC (Retainer Mensual, sin incluir presupuesto)', range: '$1,500 - $10,000+' },
    { service: 'Marketing de Contenidos (Retainer Mensual)', range: '$1,800 - $12,000+' },
    { service: 'Gestión Redes Sociales (Retainer Mensual)', range: '$1,000 - $3,500+' },
    { service: 'Email Marketing (Retainer Mensual)', range: '$1,500 - $7,500+' },
    { service: 'Desarrollo Web (Proyecto)', range: '$2,500 - $150,000+' },
    { service: 'Diseño de Landing Page (Proyecto)', range: '$800 - $5,000+' },
  ];

  // Filtrar solo los planes
  const plans: ServiceOrPlanItem[] = servicesAndPlansData.filter(item => item.type === 'plan');
  // Opcional: ordenar por isFeatured primero
  const orderedPlans = [
    ...plans.filter(plan => plan.isFeatured),
    ...plans.filter(plan => !plan.isFeatured)
  ];


  return (
    <section id="pricing" className="py-20 bg-background text-foreground dark:bg-background dark:text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">Pricing Plans</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span>Elige el plan perfecto para tu negocio</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            El servicio de <strong>Branding e Identidad Corporativa</strong> se cotiza por separado. Consulta por descuentos en servicios adicionales al contratar planes superiores.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport= {{ once: false, amount: 0.3 }   }     
          >
        {orderedPlans.map((plan, i) => (
          <motion.div
            key={plan.id}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            className={`relative glass-panel overflow-hidden group shadow-xl transition-all duration-500 ${plan.isFeatured ? 'border-primary/50 order-first md:order-none' : 'order-none'}`}
          >
            {plan.isFeatured && (
              <div className="absolute top-0 inset-x-0">
                <div className="bg-amber-400 text-amber-950 text-sm font-medium py-1 px-4 rounded-b-lg mx-auto w-fit shadow-sm">
                  Destacado
                </div>
              </div>
            )}
            <div className="relative z-10 p-6 pt-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-foreground/60 h-12">{plan.shortDescription}</p>
              {plan.longDescription && <p className="text-xs text-gray-500 mb-2">{plan.longDescription}</p>}
              <div className="mt-6 mb-6">
                <div className="text-3xl font-bold">
                  {plan.price !== null ? `$${plan.price}` : 'Cotizar'}
                  <span className="text-lg ml-1 opacity-70">{plan.priceRange ? `- $${plan.priceRange[1]}` : ''}</span>
                </div>
                <div className="text-sm text-foreground/60 mt-1">
                  {plan.priceType === 'único' && plan.duration ? `Pago Único${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                  {plan.priceType === 'mensual' && plan.duration ? `Mensual${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                  {plan.priceType === 'desde' && plan.duration ? `Desde${plan.duration ? ` (${plan.duration})` : ''}` : ''}
                  {/* Ajusta la lógica de priceNote según necesidad */}
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
              <Button variant="secondary" className="w-full mt-auto">Añadir a Solución</Button>
            </div>
          </motion.div>
        ))}
        </motion.div> {/* Cierre del motion.div de la línea 70 */}

        <motion.div
          className="mt-24 max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-8">
            <span className="section-title-underline">Planes y Precios</span>
          </h2>
          <h3 className="text-2xl font-semibold text-center mb-6">Tabla de Precios de Referencia (Mercado Norteamericano)</h3>
          <p className="text-center font-semibold text-gray-600 mb-8 max-w-3xl mx-auto">
            Esta tabla muestra rangos orientativos basados en nuestro análisis. Los precios finales dependerán de la complejidad y alcance específico de cada proyecto.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-[0_10px_60px_-10px_rgba(46,104,255,0.3)]">
            <table className="w-full divide-y divide-border text-sm md:text-base">
              <thead>
                <tr className="bg-muted/60 backdrop-blur-lg text-left text-foreground font-semibold">
                  <th className="py-4 px-6">Tipo de Servicio</th>
                  <th className="py-4 px-6 text-right">Rango Orientativo (USD)</th>
                </tr>
              </thead>
              <tbody>
                {referencePrices.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-primary/10 transition-colors duration-300"
                  >
                    <td className="py-4 px-6 text-foreground font-medium">
                      {item.service}
                    </td>
                    <td className="py-4 px-6 text-right text-primary font-bold">
                      {item.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-foreground/50 mt-6 italic">
            *Contáctanos para una cotización personalizada.
          </p>
        </motion.div>
      </div>
    </section> 
    );
};

export default Pricing;
