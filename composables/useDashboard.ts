import { createSharedComposable, useLocalStorage } from "@vueuse/core";

const _useDashboard = () => {
  const isMainSidebarSlideoverOpen = useLocalStorage("app.sidebar", true);
  const theme = useLocalStorage("app.theme", "light");

  return {
    isMainSidebarSlideoverOpen,
    theme,
  };
};

export const useDashboard = createSharedComposable(_useDashboard);
