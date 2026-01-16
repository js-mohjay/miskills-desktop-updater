import { create } from "zustand";

interface UnmuteState {
  requested: boolean;
  approved: boolean;

  setRequested: (v: boolean) => void;
  setApproved: (v: boolean) => void;
  reset: () => void;
}

export const useUnmuteStore = create<UnmuteState>((set) => ({
  requested: false,
  approved: false,

  setRequested: (v) => set({ requested: v }),
  setApproved: (v) => set({ approved: v }),

  reset: () => set({ requested: false, approved: false }),
}));
