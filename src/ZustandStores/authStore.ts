import { create } from 'zustand';
import { Empleado } from '../types';
import { persist } from 'zustand/middleware';

interface AuthState {
  loggedIn: boolean;
  user: Empleado;
  login: () => void;
  logout: () => void;
  setUser: (user: Empleado) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      loggedIn: false,
      user: {
        condEmpleado: '',
        nomEmpleado: '',
        apelEmpleado: '',
        correo: '',
        fechaNac: '',
        fechaIngre: ''
      },
      login: () => set({ loggedIn: true }),
      logout: () => set({ loggedIn: false, user: {
        condEmpleado: '',
        nomEmpleado: '',
        apelEmpleado: '',
        correo: '',
        fechaNac: '',
        fechaIngre: ''
        }}),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // nombre del storage en localStorage
      getStorage: () => localStorage, // elige el storage, por defecto es localStorage
    }
  )
);
