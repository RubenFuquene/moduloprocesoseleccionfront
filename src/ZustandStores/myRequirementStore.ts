import { create } from 'zustand';
import { Requerimiento } from '../types';
import { persist } from 'zustand/middleware';

// Definir el tipo de estado para la tienda
interface RequerimientosState {
  requerimientos: Requerimiento[];
  addRequerimiento: (requerimiento: Requerimiento) => void;
  removeRequerimiento: (id: number) => void;
  clearState: () => void;
}

// Crear la tienda
export const useMyRequirementStore = create(
  // Configurar persistencia en el LocalStorage
  persist<RequerimientosState>(
    (set) => ({
      requerimientos: [],
      // Método para agregar un requerimiento
      addRequerimiento: (requerimiento) =>
        set((state) => {
          // Verificar si el requerimiento ya existe en el estado
          const exists = state.requerimientos.some(
            (req) => req.consecrequerimiento === requerimiento.consecrequerimiento
          );

          // Si el requerimiento no existe, se agrega al estado
          if (!exists) {
            return {
              requerimientos: [...state.requerimientos, requerimiento],
            };
          }

          // Si el requerimiento ya existe, no cambia el estado
          return state;
        }),
      // Método para remover un requerimiento por su ID
      removeRequerimiento: (id) =>
        set((state) => ({
          requerimientos: state.requerimientos.filter((req) => req.consecrequerimiento !== id),
        })),
      
      // Método para limpiar todos los estados
      clearState: () =>
        set(() => ({
          requerimientos: [], // Limpiar todos los requerimientos
        })),
    }),
    {
      name: 'requerimientos-storage', // nombre del storage en localStorage
      getStorage: () => localStorage, // elige el storage, por defecto es localStorage
    }
  )
);
