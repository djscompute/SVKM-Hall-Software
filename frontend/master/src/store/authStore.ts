import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isAuthenticated: false,
  login: (email, password) => {
    set({ isAuthenticated: true });
  },
  logout: () => {
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
