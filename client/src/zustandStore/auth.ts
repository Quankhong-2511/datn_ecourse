import { TUser } from 'types/user';
import { create } from 'zustand';

export type TLoadingAuth = 'update-user' | '';
export type TAuthModal = 'login' | 'register' | 'changePassword' | 'forgot' | '';
type TAuthStore = {
  loading: TLoadingAuth;
  currentUser: TUser;
  saveCurrentUser: (user: TUser) => void;
  logout: () => void;
  modalAuth: TAuthModal;
  setModalAuth: (open: TAuthModal) => void;
};

const authStore = create<TAuthStore>((set) => ({
  loading: '',
  currentUser: {},
  modalAuth: '',
  setModalAuth: (open: TAuthModal) => set({ modalAuth: open }),
  saveCurrentUser: (user: TUser) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    set({ currentUser: user });
  },
  logout: () => {
    localStorage.clear();
    set({ currentUser: {} });
  },
}));

export default authStore;
