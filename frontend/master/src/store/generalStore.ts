import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface generalStoreState {
  bears: number;
  increase: (by: number) => void; 

  loginToast: boolean;
  setLoginToastFalse: () => void
  setLoginToastTrue: () => void
}
export const useGeneralStore = create<generalStoreState>()(
  persist(
  devtools((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),

    loginToast: false,
    setLoginToastFalse: () => set({loginToast: false}),
    setLoginToastTrue: () => set({loginToast: true}),
  })),{
    name: "generalStore"
  })
);
