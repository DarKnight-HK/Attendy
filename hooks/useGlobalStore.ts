import { getCurrentUser, getStudents } from "@/lib/appwrite";
import { getCurrentDay } from "@/lib/utils";
import { create } from "zustand";

interface Store {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: any;
  setUser: (value: any) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  currentDay: number;
  setCurrentDay: (value: number) => void;
  presentStudents: any[];
  setPresentStudents: (value: any[]) => void;
  absentStudents: any[];
  setAbsentStudents: (value: any[]) => void;
}

export const useGlobalStore = create<Store>()((set) => ({
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  user: getCurrentUser()
    .then((user) => {
      if (user) {
        set({ user: user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      set({ isLoading: false });
    }),
  setUser: (value) => {
    set({ user: value });
  },
  currentDay: getCurrentDay(),
  setCurrentDay: (value: number) => set({ currentDay: value }),
  presentStudents: [],
  setPresentStudents: (value: any[]) => set({ presentStudents: value }),
  absentStudents: [],
  setAbsentStudents: (value: any[]) => set({ absentStudents: value }),
}));
