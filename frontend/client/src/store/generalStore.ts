import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface generalStoreState {
  bears: number;
  increase: (by: number) => void;
}
export const useGeneralStore = create<generalStoreState>()(
  devtools((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
  }))
);
