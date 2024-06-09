import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
}

interface AuthActions {
  login: (email: string, password: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    devtools((set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        set({ isAuthenticated: true, user: { email: email } });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    })),
    {
      name: "authManagerStore",
    }
  )
);

export default useAuthStore;
