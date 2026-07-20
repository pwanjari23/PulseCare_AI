import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  pageLoading: false,
  modalState: {}, // mapping e.g. { 'loginModal': true }
  drawerState: {}, // mapping e.g. { 'notificationsDrawer': true }

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebar: (isOpen) => set({ sidebarOpen: isOpen }),
  
  setPageLoading: (loading) => set({ pageLoading: loading }),

  openModal: (modalName) => set((state) => ({
    modalState: { ...state.modalState, [modalName]: true }
  })),

  closeModal: (modalName) => set((state) => ({
    modalState: { ...state.modalState, [modalName]: false }
  })),

  openDrawer: (drawerName) => set((state) => ({
    drawerState: { ...state.drawerState, [drawerName]: true }
  })),

  closeDrawer: (drawerName) => set((state) => ({
    drawerState: { ...state.drawerState, [drawerName]: false }
  })),
}));

export default useUiStore;
