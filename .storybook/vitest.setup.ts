import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';
import { beforeEach } from 'vitest';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Zustand ストア状態のクリア
beforeEach(async () => {
  // ContactFormストアをクリア
  try {
    const { useContactFormStore } = await import('../src/features/contact/model/store');
    // Zustandストアの状態をリセット
    useContactFormStore.getState().resetStore();
    // persistストレージもクリア
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('contact-form-storage');
    }
  } catch (error) {
    // エラーが発生しても継続
    console.warn('Failed to reset Zustand store:', error);
  }
});