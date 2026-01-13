import { create } from "zustand";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */

export type RoomRole = "host" | "participant";

export interface ChatMessage {
  scheduleId: string;
  occurrenceId: string;
  senderId: string;
  senderName: string;
  text: string;
  timeStamp: number;
  createdAt: string;
  meta?: {
    userRole?: string | null;
    platformId?: string | null;
  };
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  scheduleId: string;
  occurrenceId: string;
  question: string;
  createdBy: string;
  createdAt: number;
  isActive: boolean;
  options: PollOption[];
}

export interface HandRaise {
  userId: string;
  username: string;
  raisedAt: number;
}

/* ---------------------------------------------
   STORE STATE
--------------------------------------------- */

interface RoomState {
  /* -------- ROLE -------- */
  role: RoomRole | null;

  /* -------- LIVEKIT -------- */
  livekit: {
    token: string | null;
    url: string | null;
  };

  /* -------- CHAT -------- */
  messages: ChatMessage[];

  /* -------- POLLS -------- */
  polls: Record<string, Poll>;

  /* -------- HAND RAISE -------- */
  handsRaised: Record<string, HandRaise>;

  /* -------- ROLE -------- */
  setRole: (role: RoomRole) => void;

  /* -------- LIVEKIT -------- */
  setLivekitAuth: (token: string, url: string) => void;

  /* -------- CHAT -------- */
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;

  /* -------- POLLS -------- */
  addPoll: (poll: Poll) => void;
  updatePoll: (poll: Partial<Poll> & { id: string }) => void;
  clearPolls: () => void;

  /* -------- HAND RAISE -------- */
  setHandRaised: (userId: string, username: string) => void;
  removeHandRaised: (userId: string) => void;
  clearHands: () => void;

  /* -------- RESET -------- */
  resetRoom: () => void;
}

/* ---------------------------------------------
   STORE IMPLEMENTATION
--------------------------------------------- */

export const useRoomStore = create<RoomState>((set, get) => ({
  /* -------- STATE -------- */

  role: null,

  livekit: {
    token: null,
    url: null,
  },

  messages: [],

  polls: {},

  handsRaised: {},

  /* -------- ROLE -------- */

  setRole: (role) => set({ role }),

  /* -------- LIVEKIT -------- */

  setLivekitAuth: (token, url) =>
    set({
      livekit: { token, url },
    }),

  /* -------- CHAT -------- */

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  clearMessages: () => set({ messages: [] }),

  /* -------- POLLS -------- */

  addPoll: (poll) =>
    set((state) => ({
      polls: {
        ...state.polls,
        [poll.id]: poll,
      },
    })),

  updatePoll: (poll) =>
    set((state) => {
      const existing = state.polls[poll.id];
      if (!existing) return state;

      return {
        polls: {
          ...state.polls,
          [poll.id]: {
            ...existing,
            ...poll,
          },
        },
      };
    }),

  clearPolls: () => set({ polls: {} }),

  /* -------- HAND RAISE -------- */

  setHandRaised: (userId, username) =>
    set((state) => ({
      handsRaised: {
        ...state.handsRaised,
        [userId]: {
          userId,
          username,
          raisedAt: Date.now(),
        },
      },
    })),

  removeHandRaised: (userId) =>
    set((state) => {
      const next = { ...state.handsRaised };
      delete next[userId];
      return { handsRaised: next };
    }),

  clearHands: () => set({ handsRaised: {} }),

  /* -------- RESET -------- */

  resetRoom: () =>
    set({
      role: null,
      livekit: { token: null, url: null },
      messages: [],
      polls: {},
      handsRaised: {},
    }),
}));
