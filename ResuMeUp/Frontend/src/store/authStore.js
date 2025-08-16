import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // Login function
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
          });
          
          const { token, user } = response.data;
          set({ token, user, isLoading: false });
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          toast.success(`Welcome back, Hunter ${user.name}!`);
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Login failed');
          return false;
        }
      },

      // Register function
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password
          });
          
          const { token, user } = response.data;
          set({ token, user, isLoading: false });
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          toast.success(`Welcome to the Guild, ${user.name}!`);
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Registration failed');
          return false;
        }
      },

      // Logout function
      logout: () => {
        set({ user: null, token: null });
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
      },

      // Initialize auth (check if token is valid)
      initializeAuth: () => {
        const { token } = get();
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);