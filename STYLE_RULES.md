# Reglas de Estilo y Compatibilidad para Avanxia Portfolio Web

## Regla de Compatibilidad con Tema Claro/Oscuro

### Descripción
Todos los componentes DEBEN utilizar las variables CSS y tokens del tema para garantizar la compatibilidad con los modos claro y oscuro.

### Aplicación
- **Nunca usar colores directos**: En lugar de valores hexadecimales o RGB directos, siempre usar variables de tema como `text-foreground`, `bg-background`, etc.
- **Usar clases con soporte para temas**: Utilizar clases como `text-foreground`, `bg-background`, `text-primary`, `bg-primary`, etc.
- **Opacidades temáticas**: Para las opacidades, usar la notación de barra como `text-foreground/70` para texto con 70% de opacidad.
- **Transiciones suaves**: Incluir siempre transiciones en los cambios de color/modo para una experiencia más fluida.

### Ejemplos

✅ **Correcto**:
```tsx
<div className="bg-background text-foreground">
  <h2 className="text-primary font-bold">Título</h2>
  <p className="text-foreground/70">Texto con opacidad</p>
</div>
```

❌ **Incorrecto**:
```tsx
<div className="bg-white text-black dark:bg-slate-800">
  <h2 className="text-blue-600 font-bold">Título</h2>
  <p className="text-gray-700">Texto con opacidad</p>
</div>
```

## Regla de Cohesión de Componentes

### Descripción
Todos los componentes de UI deben mantener una cohesión visual con el resto de la aplicación y respetar los patrones de diseño establecidos.

### Aplicación
- **Glass Panel para Tarjetas**: Usar la clase `glass-panel` para tarjetas y paneles.
- **Sombras Consistentes**: Usar `shadow-xl`, `shadow-2xl` con moderación.
- **Animaciones**: Utilizar Framer Motion para micro-interacciones y transiciones.
- **Bordes Redondeados**: Preferir `rounded-2xl` para componentes principales.
- **Efectos Hover**: Incluir siempre efectos hover suaves en elementos interactivos.

### Tokens Esenciales a Utilizar
- **Colores Principales**: `primary`, `secondary`, `background`, `foreground`, `muted`
- **Estados**: `hover:`, `focus:`, `active:`, `disabled:`
- **Espaciado**: Seguir la escala de espaciado de Tailwind (p-4, m-2, etc.)
- **Responsive**: Utilizar prefijos `sm:`, `md:`, `lg:`, `xl:` para diseño responsive

## Normas Específicas para Componentes

### Menús Desplegables (Dropdowns)
- Deben usar la clase `glass-panel`
- Incluir animaciones de entrada/salida
- Bordes sutiles con `border-border/30`
- Aplicar `backdrop-blur-md` para transparencia
- Incluir efecto hover en cada ítem

### Tarjetas y Paneles
- Usar componentes de la clase `glass-panel`
- Implementar animaciones con Framer Motion
- Asegurar espaciado interno consistente (p-6)
- Efecto de elevación en hover
