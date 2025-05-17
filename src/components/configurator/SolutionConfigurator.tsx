import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { ServiceOrPlanItem } from '@/data/servicesData'; // Asumiendo alias @/ para src/

interface SolutionContextType {
  selectedItems: ServiceOrPlanItem[];
  addItemToSolution: (item: ServiceOrPlanItem) => void;
  removeItemFromSolution: (itemId: string) => void;
  clearSolution: () => void;
  totalInitialInvestment: number;
  totalMonthlyInvestment: number;
  isItemInSolution: (itemId: string) => boolean;
}

const SolutionContext = createContext<SolutionContextType | undefined>(undefined);

export const SolutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<ServiceOrPlanItem[]>([]);

  const addItemToSolution = useCallback((item: ServiceOrPlanItem) => {
    setSelectedItems(prevItems => {
      if (prevItems.find(i => i.id === item.id)) {
        return prevItems; // Evitar duplicados
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItemFromSolution = useCallback((itemId: string) => {
    setSelectedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const clearSolution = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isItemInSolution = useCallback((itemId: string) => {
    return selectedItems.some(item => item.id === itemId);
  }, [selectedItems]);

  const { totalInitialInvestment, totalMonthlyInvestment } = useMemo(() => {
    let initial = 0;
    let monthly = 0;

    selectedItems.forEach(item => {
      if (item.priceType === 'único') {
        initial += item.price || 0;
      } else if (item.priceType === 'mensual') {
        monthly += item.price || 0;
      } else if (item.priceType === 'mensual-desde') {
        monthly += item.price || 0; // Sumar el base para 'mensual-desde'
      } else if (item.priceType === 'desde' && item.price) {
        initial += item.price; // Sumar el base para 'desde' como único por ahora
      } else if (item.priceType === 'desde' && item.priceRange) {
        initial += item.priceRange[0]; // Sumar el mínimo del rango como único
      }
      // 'cotizar' no se suma
    });

    return { totalInitialInvestment: initial, totalMonthlyInvestment: monthly };
  }, [selectedItems]);

  return (
    <SolutionContext.Provider value={{
      selectedItems,
      addItemToSolution,
      removeItemFromSolution,
      clearSolution,
      totalInitialInvestment,
      totalMonthlyInvestment,
      isItemInSolution
    }}>
      {children}
    </SolutionContext.Provider>
  );
};

export const useSolution = () => {
  const context = useContext(SolutionContext);
  if (context === undefined) {
    throw new Error('useSolution must be used within a SolutionProvider');
  }
  return context;
};

// El componente SolutionConfigurator podría ser simplemente un alias para SolutionProvider
// o un componente que usa SolutionProvider internamente si necesita su propia UI.
// Por ahora, podemos considerar que la lógica principal reside en SolutionProvider.
// Si se necesita un componente exportado con este nombre específico:
// const SolutionConfigurator: React.FC<{ children: ReactNode }> = ({ children }) => {
//   return <SolutionProvider>{children}</SolutionProvider>;
// };
// export default SolutionConfigurator; 