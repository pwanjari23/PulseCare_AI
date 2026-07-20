import { useUiStore } from '../stores/ui.store';

export const useModal = (modalName) => {
  const { modalState, openModal, closeModal } = useUiStore();
  
  const isOpen = !!modalState[modalName];
  const open = () => openModal(modalName);
  const close = () => closeModal(modalName);

  return {
    isOpen,
    open,
    close,
  };
};

export default useModal;
