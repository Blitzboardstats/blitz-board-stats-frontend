import { create } from "zustand";
import { TeamInvitation, invitationApi } from "@/api/invitation";

interface InvitationState {
  invitations: TeamInvitation[];
  isLoading: boolean;
  error: string | null;
}

interface InvitationActions {
  getInvitations: () => Promise<void>;
  sendInvitation: (payload: {
    teamId: string;
    email: string;
    invitationType: string;
    coachRole?: string;
    name: string;
  }) => Promise<void>;
  respondInvitation: (payload: {
    invitationId: string;
    invitationStatus: "accepted" | "declined";
  }) => Promise<void>;
}

export const useInvitationStore = create<InvitationState & InvitationActions>()(
  (set, get) => ({
    invitations: [],
    isLoading: false,
    error: null,

    getInvitations: async () => {
      set({ isLoading: true, error: null });
      try {
        const invitations = await invitationApi.getInvitations();
        set({ invitations, isLoading: false });
      } catch (error: unknown) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    sendInvitation: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        await invitationApi.sendInvitation(payload);
        await get().getInvitations();
      } catch (error: unknown) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    respondInvitation: async (payload) => {
      set({ isLoading: true, error: null });
      console.log("respondInvitation", payload);
      try {
        await invitationApi.respondInvitation(payload);
        await get().getInvitations();
      } catch (error: unknown) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },
  })
);
