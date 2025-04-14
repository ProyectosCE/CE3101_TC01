import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserInfo {
  nombreCompleto: string;
  cedula: string;
}

type State = {
  isLoggedIn: boolean;
  username: string | null;
  userInfo: UserInfo | null;
}

type Actions = {
  login: (username: string, userInfo: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      isLoggedIn: false,
      username: null,
      userInfo: null,
      login: (username, userInfo) =>
        set((state) => {
          state.isLoggedIn = true;
          state.username = username;
          state.userInfo = userInfo;
        }),
      logout: () =>
        set((state) => {
          state.isLoggedIn = false;
          state.username = null;
          state.userInfo = null;
        }),
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
