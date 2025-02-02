export const useToast = () => {
  const { $toast } = useNuxtApp();
  return $toast;
};
