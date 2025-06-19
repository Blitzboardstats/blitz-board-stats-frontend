import { create } from "zustand";
import { guardianApi } from "@/api/guardian";

export interface Guardian {
  _id: string;
  email: string;
  name: string;
  relationshipId: string;
  createdAt: string;
}

interface GuardianState {
  guardians: Guardian[];
  isLoading: boolean;
  error: string | null;
}

interface GuardianActions {
  // Get all guardians for a player
  getGuardians: () => Promise<void>;

  // Add a new guardian
  addGuardian: (guardianEmail: string) => Promise<Guardian | null>;

  // Remove a guardian
  removeGuardian: (relationshipId: string) => Promise<boolean>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useGuardianStore = create<GuardianState & GuardianActions>()(
  (set, get) => ({
    // Initial state
    guardians: [],
    isLoading: false,
    error: null,

    // Get all guardians
    getGuardians: async () => {
      set({ isLoading: true, error: null });
      try {
        const guardians = await guardianApi.getGuardians();
        set({ guardians, isLoading: false });
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Failed to fetch guardians";
        set({ error: errorMessage, isLoading: false });
      }
    },

    // Add a new guardian
    addGuardian: async (guardianEmail: string) => {
      set({ isLoading: true, error: null });
      try {
        const newGuardian = await guardianApi.addGuardian(guardianEmail);
        set((state) => ({
          guardians: [...state.guardians, newGuardian],
          isLoading: false,
        }));
        return newGuardian;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Failed to add guardian";
        set({ error: errorMessage, isLoading: false });
        return null;
      }
    },

    // Remove a guardian
    removeGuardian: async (relationshipId: string) => {
      set({ isLoading: true, error: null });
      try {
        await guardianApi.removeGuardian(relationshipId);
        set((state) => ({
          guardians: state.guardians.filter(
            (g) => g.relationshipId !== relationshipId
          ),
          isLoading: false,
        }));
        return true;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Failed to remove guardian";
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },

    // State management
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  })
);
