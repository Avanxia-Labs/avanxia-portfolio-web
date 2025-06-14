// =================================================================
// 1. IMPORTS
// =================================================================
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { serviceAddons, servicesData, ServicePlan, ServiceAddon } from '@/data/servicesData';
import { categoriesData } from '@/data/categoriesData';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

// =================================================================
// 2. DEFINICIÓN DE TIPOS
// =================================================================
type FormFields = {
  selectedAddonIds: string[];
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  plan: string;
  service: string;
  message: string;
};

// =================================================================
// 3. COMPONENTE PRINCIPAL
// =================================================================
export const ContactForm = () => {
  // -----------------------------------------------------------------
  // A. ESTADOS Y REFERENCIAS
  // -----------------------------------------------------------------
  const location = useLocation();
  const initialItems: (ServicePlan | ServiceAddon)[] = location.state?.selectedItems ?? [];
  const underlineRef = useRef<HTMLSpanElement | null>(null);

  const [selectedList, setSelectedList] = useState(initialItems);
  const [formData, setFormData] = useState<FormFields>({
    selectedAddonIds: [],
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    plan: '',
    service: '',
    message: '',
  });

  // -----------------------------------------------------------------
  // B. DATOS DERIVADOS Y CÁLCULOS
  // -----------------------------------------------------------------
  const total = (() => {
    if (selectedList.length > 0) {
      return selectedList.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0), 0);
    }
    let base = (() => {
      const p = servicesData.find(i => i.id === formData.plan) || servicesData.find(i => i.id === formData.service);
      return p && typeof p.price === 'number' ? p.price : 0;
    })();
    if (!location.state?.selectedItems?.length && formData.selectedAddonIds.length) {
      base += formData.selectedAddonIds.reduce((s, id) => {
        const a = serviceAddons.find(x => x.id === id);
        return s + (a && typeof a.price === 'number' ? a.price : 0);
      }, 0);
    }
    return base;
  })();

  const fadeSlide = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const plansAll = servicesData.filter(i => i.type === 'plan');
  const filteredPlans = plansAll.filter(p => p.categoryId === formData.category);
  
  const availableAddons: ServiceAddon[] = formData.category
    ? serviceAddons.filter(a => (Array.isArray(a.categoryId) ? a.categoryId.includes(formData.category) : a.categoryId === formData.category) && (a.type === 'addon' || a.type === 'bonus'))
    : [];

  const categoryAddons = availableAddons.filter(a => a.type === 'addon');
  const categoryBonuses = availableAddons.filter(a => a.type === 'bonus');

  const selectedPlan = formData.plan ? servicesData.find(p => p.id === formData.plan) : null;
  const selectedCategory = formData.category ? categoriesData.find(c => c.id === formData.category) : null;

  // -----------------------------------------------------------------
  // C. MANEJADORES DE EVENTOS Y EFECTOS
  // -----------------------------------------------------------------
  const handleRemove = (id: string) => {
    setSelectedList(list => list.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (formData.category) {
      setFormData(f => ({ ...f, plan: '', service: '', selectedAddonIds: [] }));
    }
  }, [formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'plan' ? { service: '' } : {}),
      ...(name === 'service' ? { plan: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || (selectedList.length === 0 && (!formData.category || (!formData.plan && !formData.service)))) {
      alert('Por favor, completa los campos obligatorios y/o selección de plan/servicio.');
      return;
    }

    let mergedListToSend: (ServicePlan | ServiceAddon)[] = [];
    let categoryToSend = formData.category;
    let planToSend = formData.plan;

    if (selectedList.length > 0) {
      // CASO A: Vengo de otra página con una selección hecha (el "carrito")
      mergedListToSend = selectedList;
      const itemBase = selectedList.find(item => (item as ServicePlan).type === 'plan' || (item as ServicePlan).type === 'servicio') as (ServicePlan | undefined);
      if (itemBase) {
        categoryToSend = itemBase.categoryId;
        planToSend = itemBase.id;
      }
    } else {
      // CASO B: El usuario selecciona todo desde este formulario
      const baseItem = servicesData.find(i => i.id === formData.plan) || servicesData.find(i => i.id === formData.service);
      if (baseItem) {
        mergedListToSend.push(baseItem);
        categoryToSend = baseItem.categoryId;
        planToSend = baseItem.id;
      }

      // 1. Añadir los Add-ons que el usuario seleccionó
      formData.selectedAddonIds.forEach(addonId => {
        const foundAddon = serviceAddons.find(a => a.id === addonId);
        if (foundAddon) {
          mergedListToSend.push(foundAddon);
        }
      });
      
      // ✅ LA SOLUCIÓN: 2. Añadir los Bonos que corresponden a la categoría, automáticamente
      const bonusesForCategory = serviceAddons.filter(addon => 
          addon.type === 'bonus' &&
          (Array.isArray(addon.categoryId)
            ? addon.categoryId.includes(categoryToSend)
            : addon.categoryId === categoryToSend)
      );
      mergedListToSend.push(...bonusesForCategory);
    }
    
    const totalToSend = mergedListToSend.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0), 0);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedList: mergedListToSend,
          total: totalToSend,
          category: categoryToSend,
          plan: planToSend,
        }),
      });

      if (!res.ok) throw new Error('Error en la petición');
      alert('Mensaje enviado. ¡Gracias!');
      setSelectedList([]);
      setFormData({ selectedAddonIds: [], name: '', email: '', phone: '', company: '', category: '', plan: '', service: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Hubo un error al enviar. Intenta de nuevo más tarde.');
    }
  };


  // -----------------------------------------------------------------
  // D. RENDERIZADO DEL COMPONENTE
  // -----------------------------------------------------------------
  return (
    <section id="contact" className="py-20 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-8">
          <span ref={underlineRef} className="section-title-underline">Hablemos de tu Proyecto</span>
        </h2>
        <p className="text-center mb-12 max-w-3xl mx-auto text-[rgba(var(--color-foreground),0.7)]">
          Estamos listos para escuchar tus ideas y ayudarte a encontrar la solución digital perfecta para tu negocio.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* ---- COLUMNA IZQUIERDA: FORMULARIO ---- */}
          <div className="flex justify-center md:justify-end">
            <motion.div
              className="glass-panel p-6 md:p-8 rounded-2xl shadow-lg border border-[rgb(var(--color-border))] w-full max-w-lg"
              initial={fadeSlide.initial}
              whileInView={fadeSlide.whileInView}
              transition={fadeSlide.transition}
              viewport={{ once: false, amount: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-[rgb(var(--color-primary))]">Inicia tu Proyecto</h3>

              {/* === VISTA 1: "CARRITO" === */}
              {selectedList.length > 0 ? (
                <div className="mb-6">
                  <p className="font-medium mb-2">Tu Selección:</p>
                  <ul className="list-none space-y-2 text-sm">
                    {selectedList.map(it => (
                      <li key={it.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span>- {it.name}</span>
                          <button type="button" onClick={() => handleRemove(it.id)} className="text-red-400 hover:text-red-600" aria-label={`Eliminar ${it.name}`}>×</button>
                        </div>
                        <span className="font-semibold">{typeof it.price === 'number' ? `$ ${it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : it.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <label className="block text-sm font-medium">Total (aproximado):</label>
                    <input type="text" readOnly value={`$ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`} className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border cursor-not-allowed"/>
                  </div>
                </div>
              ) : (
                /* === VISTA 2: FORMULARIO DE SELECCIÓN === */
                <div className="mb-6 space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium">Categoría *</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border">
                      <option value="">Elige una categoría</option>
                      {categoriesData.map(cat => (<option key={cat.id} value={cat.id}>{cat.name2}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium">Plan *</label>
                    <select id="plan" name="plan" disabled={!formData.category} value={formData.plan} onChange={handleChange} className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border">
                      <option value="">Selecciona un plan</option>
                      {filteredPlans.map(p => (<option key={p.id} value={p.id}>{p.name} — ${typeof p.price === 'number' ? p.price.toLocaleString('en-US') : p.price}</option>))}
                    </select>
                    {selectedPlan && selectedCategory && (<div className="mt-3 text-right"><Link to={`/servicios/${selectedCategory.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline">Ver detalles de "{selectedPlan.name}"<ArrowUpRight className="w-4 h-4" /></Link></div>)}
                  </div>
                  {(categoryAddons.length > 0 || categoryBonuses.length > 0) && (
                    <div className="space-y-5 pt-2">
                      {categoryAddons.length > 0 && (
                        <div>
                          <p className="font-medium text-[rgb(var(--color-foreground))] mb-3">Add-ons Opcionales:</p>
                          <ul className="space-y-3">
                            {categoryAddons.map(addon => (
                              <li key={addon.id} className="flex justify-between items-start gap-4">
                                <label className="flex items-start gap-2 cursor-pointer text-sm">
                                  <input type="checkbox" checked={formData.selectedAddonIds.includes(addon.id)} onChange={() => { setFormData(f => ({...f, selectedAddonIds: f.selectedAddonIds.includes(addon.id) ? f.selectedAddonIds.filter(x => x !== addon.id) : [...f.selectedAddonIds, addon.id]}));}} className="form-checkbox h-5 w-5 mt-0.5 flex-shrink-0 accent-primary border-primary checked:accent-primary"/>
                                  <span>{addon.name}</span>
                                </label>
                                <span className="text-sm font-semibold text-right flex-shrink-0">{typeof addon.price === 'number' ? `$${addon.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : addon.price}<br /><span className="text-xs font-normal opacity-70">USD</span></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {categoryBonuses.length > 0 && (
                        <div>
                          <p className="font-medium text-[rgb(var(--color-foreground))] mb-3">Bonos Incluidos:</p>
                          <ul className="space-y-3">
                            {categoryBonuses.map(bonus => (
                              <li key={bonus.id} className="flex justify-between items-start gap-4">
                                <label className="flex items-start gap-2 cursor-not-allowed text-sm opacity-80">
                                  <input type="checkbox" checked={true} disabled={true} className="form-checkbox h-5 w-5 mt-0.5 flex-shrink-0 accent-primary border-primary checked:accent-primary"/>
                                  <span>{bonus.name}</span>
                                </label>
                                <span className="text-sm font-semibold text-right flex-shrink-0 opacity-80">{bonus.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* === FORMULARIO DE CONTACTO === */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {selectedList.length === 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Total (aproximado):</label>
                    <input type="text" readOnly value={`$ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`} placeholder="Total aproximado" className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border cursor-not-allowed"/>
                  </div>
                )}
                {[
                  { id: 'name', label: 'Nombre *', type: 'text', placeholder: 'Nombre completo' },
                  { id: 'email', label: 'Correo Electrónico *', type: 'email', placeholder: 'Correo electrónico' },
                  { id: 'phone', label: 'Teléfono (Opcional)', type: 'tel', placeholder: 'Teléfono' },
                  { id: 'company', label: 'Empresa (Opcional)', type: 'text', placeholder: 'Empresa' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium">{label}</label>
                    <input id={id} name={id} type={type} value={formData[id as keyof Omit<FormFields, 'category' | 'plan' | 'service'>] as string} onChange={handleChange} placeholder={placeholder} className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border" required={label.endsWith('*')}/>
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium">¿En qué podemos ayudarte? *</label>
                  <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Déjanos tu mensaje" className="mt-2 w-full px-4 py-3 bg-[rgb(var(--color-card))] rounded-lg border" required/>
                </div>
                <button type="submit" className="w-full py-3 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))] text-white font-semibold rounded-lg transition">Enviar Mensaje</button>
              </form>
            </motion.div>
          </div>

          {/* ---- COLUMNA DERECHA: INFO VISUAL ---- */}
          <div className="flex justify-center md:justify-start">
            <div className="space-y-6 w-full max-w-lg">
              <motion.div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-[rgb(var(--color-border))] w-full" initial={fadeSlide.initial} whileInView={fadeSlide.whileInView} transition={fadeSlide.transition} viewport={{ once: false, amount: 0.2 }}>
                <video src="/videos/avanxia_hq_fixed.webm" className="w-full h-auto object-cover" autoPlay muted loop playsInline/>
              </motion.div>
              <motion.div className="mt-6 space-y-4 w-full" initial={fadeSlide.initial} whileInView={fadeSlide.whileInView} transition={{ ...fadeSlide.transition, delay: 0.2 }} viewport={{ once: false, amount: 0.2 }}>
                {[
                  { icon: <Phone className="w-6 h-6 text-[rgb(var(--color-secondary))]" />, label: 'Telefono', content: (<><span>Celular: +52 1 220 283 4673</span><br /><span>Oficina: +52 722 957 0084 / 85</span></>), note: 'Horario de atención 9:30am – 6:00pm' },
                  { icon: <Mail className="w-6 h-6 text-[rgb(var(--color-secondary))]" />, label: 'Correo Electrónico', content: (<a href="mailto:info@avanxia.com" className="hover:underline">info@avanxia.com</a>), note: '' },
                  { icon: <MapPin className="w-6 h-6 text-[rgb(var(--color-secondary))]" />, label: 'Ubicación', content: (<span>307 Local 10-B, Miguel Alemán , colonia San Mateo Otzacatipan, CP. 50220 Toluca Edo. Mex.</span>), note: '' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-lg shadow-sm border border-[rgb(var(--color-border))] flex items-start gap-4">
                    {item.icon}
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <div className="mt-1">{item.content}</div>
                      {item.note && <p className="text-xs text-[rgba(var(--color-foreground),0.6)]">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};