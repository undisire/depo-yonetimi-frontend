import { createSharedComposable } from "@vueuse/core";

const _useConfirm = () => {
  const initialProps = {
    title: "Emin misiniz?",
    description: null,
    confirmButtonText: "Evet",
    cancelButtonText: "Hayır",
  };

  const isOpen = ref(false);
  const _props = ref(initialProps);

  const open = (props: object) => {
    _props.value = Object.assign(initialProps, props);
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    open,
    close,
    props: _props,
  };
};

export const useConfirm = createSharedComposable(_useConfirm);
