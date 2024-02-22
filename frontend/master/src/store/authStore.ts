import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    devtools((set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        set({ isAuthenticated: true });
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    })),
    {
      name: "authStore",
    }
  )
);

export default useAuthStore;
