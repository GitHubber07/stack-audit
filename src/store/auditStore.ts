import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed' | '';

export interface ToolSpend {
  id: string; // e.g. 'cursor', 'copilot', 'claude', 'chatgpt'
  plan: string;
  monthlySpend: number | '';
  seats: number | '';
}

export interface AuditState {
  teamSize: number | '';
  useCase: UseCase;
  tools: ToolSpend[];
  email: string;
  companyName: string;
  role: string;
  setTeamSize: (size: number | '') => void;
  setUseCase: (useCase: UseCase) => void;
  addOrUpdateTool: (tool: ToolSpend) => void;
  removeTool: (toolId: string) => void;
  setLeadDetails: (details: { email: string; companyName?: string; role?: string }) => void;
  resetForm: () => void;
}

const initialState = {
  teamSize: '' as const,
  useCase: '' as const,
  tools: [],
  email: '',
  companyName: '',
  role: '',
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      ...initialState,
      setTeamSize: (size) => set({ teamSize: size }),
      setUseCase: (useCase) => set({ useCase }),
      addOrUpdateTool: (tool) =>
        set((state) => {
          const exists = state.tools.find((t) => t.id === tool.id);
          if (exists) {
            return {
              tools: state.tools.map((t) => (t.id === tool.id ? tool : t)),
            };
          }
          return { tools: [...state.tools, tool] };
        }),
      removeTool: (toolId) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== toolId),
        })),
      setLeadDetails: (details) => set((state) => ({ ...state, ...details })),
      resetForm: () => set(initialState),
    }),
    {
      name: 'audit-storage', // name of the item in the storage (must be unique)
    }
  )
);
