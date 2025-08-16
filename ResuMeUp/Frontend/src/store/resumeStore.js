import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  templates: [
    {
      id: 'shadow-hunter',
      name: 'Shadow Hunter',
      description: 'Elite template for senior professionals',
      rank: 'S-Rank',
      preview: '/templates/shadow-hunter.jpg'
    },
    {
      id: 'iron-warrior',
      name: 'Iron Warrior', 
      description: 'Bold template for leadership roles',
      rank: 'A-Rank',
      preview: '/templates/iron-warrior.jpg'
    },
    {
      id: 'assassin-blade',
      name: 'Assassin Blade',
      description: 'Sleek template for tech professionals',
      rank: 'B-Rank', 
      preview: '/templates/assassin-blade.jpg'
    }
  ],
  isLoading: false,

  // Fetch all resumes
  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/resumes`);
      set({ resumes: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch resumes');
    }
  },

  // Create new resume
  createResume: async (resumeData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/resumes`, resumeData);
      const newResume = response.data;
      
      set(state => ({
        resumes: [...state.resumes, newResume],
        currentResume: newResume,
        isLoading: false
      }));
      
      toast.success('Resume forged successfully!');
      return newResume._id;
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to create resume');
      return null;
    }
  },

  // Update resume
  updateResume: async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/resumes/${id}`, updates);
      const updatedResume = response.data;
      
      set(state => ({
        resumes: state.resumes.map(resume => 
          resume._id === id ? updatedResume : resume
        ),
        currentResume: state.currentResume?._id === id ? updatedResume : state.currentResume
      }));
      
      toast.success('Resume updated!');
    } catch (error) {
      toast.error('Failed to update resume');
    }
  },

  // Delete resume
  deleteResume: async (id) => {
    try {
      await axios.delete(`${API_URL}/resumes/${id}`);
      
      set(state => ({
        resumes: state.resumes.filter(resume => resume._id !== id)
      }));
      
      toast.success('Resume deleted!');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  },

  // Set current resume for editing
  setCurrentResume: (resume) => {
    set({ currentResume: resume });
  },

  // Duplicate resume
  duplicateResume: async (id) => {
    const resume = get().resumes.find(r => r._id === id);
    if (resume) {
      const duplicatedData = {
        ...resume,
        title: `${resume.title} (Copy)`,
        _id: undefined
      };
      return get().createResume(duplicatedData);
    }
  }
}));