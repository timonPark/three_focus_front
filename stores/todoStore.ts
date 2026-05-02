import { create } from 'zustand'

type TodoStore = {
  quickAddValue: string
  setQuickAddValue: (value: string) => void
}

export const useTodoStore = create<TodoStore>((set) => ({
  quickAddValue: '',
  setQuickAddValue: (quickAddValue) => set({ quickAddValue }),
}))
