import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { servicesAndPlansData, categoriesData, ServiceOrPlanItem } from '../data/servicesData';
import { cn } from '../lib/utils';

const SolutionsPage = () => {
  // Estado para la categoría seleccionada, default: featured
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  
  // Ordenar categorías según su orden definido
  const sortedCategories = useMemo(() => {
    return [...categoriesData].sort((a, b) => a.order - b.order);
  }, []);


  // Filtrar items según la categoría seleccionada y ordenarlos por campo order
  const filteredItems = useMemo(() => {
    let items: ServiceOrPlanItem[];
    // Filtrado según categoría seleccionada
    if (selectedCategory === 'all') {
      items = [...servicesAndPlansData];
    } else if (selectedCategory === 'featured') {
      items = servicesAndPlansData.filter(item => item.isFeatured);
    } else {
      const selectedCategoryObj = categoriesData.find(cat => cat.id === selectedCategory);
      
      // Si encontramos la categoría, filtramos por su nombre exacto
      if (selectedCategoryObj) {
        const categoryName = selectedCategoryObj.name;
        items = servicesAndPlansData.filter(item => {
          // Verificamos si hay coincidencia por categoría
          const categoryMatch = item.category === categoryName || 
                              item.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
          return categoryMatch;
        });
      } else {
        items = [];
      }
    }
    
    // Ordenamiento: primero por order si existe, luego servicios antes que planes, luego alfabético
    return items.sort((a, b) => {
      // 1. Ordenar por campo order si ambos lo tienen
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // 2. Items con order van primero
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      
      // 3. Destacados primero
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // 4. Servicios antes que planes
      if (a.type !== b.type) {
        return a.type === 'service' ? -1 : 1;
      }
      
      // 5. Orden alfabético por nombre
      return a.name.localeCompare(b.name);
    });
  }, [selectedCategory]);

  // Animación para el contenedor de tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <section id="solutions" className="py-16 min-h-screen bg-background text-foreground">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">Nuestras Soluciones</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Soluciones a medida para tu negocio
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explora nuestra gama completa de servicios y planes diseñados para impulsar tu presencia digital y maximizar el impacto de tu marca.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 p-4">
            <nav className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2">
                {sortedCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10",
                        selectedCategory === category.id
                          ? "bg-primary/15 text-primary font-medium border-l-4 border-primary"
                          : "text-foreground/80"
                      )}
                    >
                      {category.name}
                      {category.icon && <span className="ml-2">{category.icon}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                {sortedCategories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-foreground/70">
                {sortedCategories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>

            {/* Grid of cards */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategory} // Para que la animación se reinicie al cambiar categoría
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className={cn(
                      "flex flex-col h-full relative glass-panel overflow-hidden group shadow-xl transition-all duration-500",
                      item.isFeatured && "border-primary/50 bg-primary/5"
                    )}
                  >
                    {item.isFeatured && (
                      <div className="absolute top-0 inset-x-0">
                        <div className="bg-amber-400 text-amber-950 text-sm font-medium py-1 px-4 rounded-b-lg mx-auto w-fit shadow-sm">
                          Destacado
                        </div>
                      </div>
                    )}
                    <div className="relative z-10 p-6 flex flex-col flex-grow">
                      {/* Badge para diferenciar visualmente servicio vs plan */}
                      <div className="mb-3">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          item.type === 'service' 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        )}>
                          {item.type === 'service' ? 'Servicio' : 'Paquete'}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                      <p className="text-sm text-foreground/60 mb-4">{item.shortDescription}</p>
                      
                      {/* Precio solo si existe */}
                      {item.price !== undefined && (
                        <div className="mt-2 mb-4">
                          <div className="text-3xl font-bold">
                            {item.price !== null ? `$${item.price}` : 'Cotizar'}
                            <span className="text-lg ml-1 opacity-70">
                              {item.priceRange ? `- $${item.priceRange[1]}` : ''}
                            </span>
                          </div>
                          <div className="text-sm text-foreground/60 mt-1">
                            {item.priceType === 'único' && `Pago Único${item.duration ? ` (${item.duration})` : ''}`}
                            {item.priceType === 'mensual' && `Mensual${item.duration ? ` (${item.duration})` : ''}`}
                            {item.priceType === 'desde' && `Desde${item.duration ? ` (${item.duration})` : ''}`}
                          </div>
                        </div>
                      )}

                      {/* Características */}
                      {item.features && item.features.length > 0 && (
                        <ul className="mb-4 space-y-2 flex-grow">
                          {item.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Botón siempre al final */}
                      <div className="mt-auto pt-4">
                        <Button variant="secondary" className="w-full">
                          Añadir a Solución
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-foreground/60">
                  No hay servicios o planes disponibles en esta categoría.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsPage;
