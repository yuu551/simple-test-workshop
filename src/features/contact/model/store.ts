import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContactFormData } from './validation';

interface ContactFormStore {
  submitSuccess: boolean;
  setSubmitSuccess: (success: boolean) => void;
  savedData: Partial<ContactFormData> | null;
  setSavedData: (data: Partial<ContactFormData>) => void;
  clearSavedData: () => void;
  resetStore: () => void;
}

export const useContactFormStore = create<ContactFormStore>()(
  persist(
    (set) => ({
      submitSuccess: false,
      setSubmitSuccess: (success) => set({ submitSuccess: success }),
      savedData: null,
      setSavedData: (data) => set({ savedData: data }),
      clearSavedData: () => set({ savedData: null }),
      resetStore: () => set({ 
        submitSuccess: false,
        savedData: null
      }),
    }),
    {
      name: 'contact-form-storage',
      partialize: (state) => ({ savedData: state.savedData }),
    }
  )
);