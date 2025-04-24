import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ClickType } from '@/types/clickType';

const useClickStore = defineStore('clickStore', () => {
  const clicks = ref<ClickType[]>([]);
  const addClick = (clickData: ClickType): void => {
    clicks.value.push(clickData);
  };

  watch(
    clicks,
    (newClicks: ClickType[]) => {
      localStorage.setItem('polygonClicks', JSON.stringify(newClicks));
    }
  );

  return {
    clicks,
    addClick,
  };
});

export default useClickStore;
