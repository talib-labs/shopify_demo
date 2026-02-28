import { create } from 'zustand';
import {
  Account,
  AccountSensitive,
  ApiLog,
  Entity,
  ShopifyPaymentToken,
  VerificationSession,
} from '@/types';

interface DemoStore {
  screen: number;
  entity: Entity | null;
  accounts: Account[];
  selectedAccount: Account | null;
  verificationSession: VerificationSession | null;
  sensitiveData: AccountSensitive | null;
  paymentToken: ShopifyPaymentToken | null;
  apiLogs: ApiLog[];
  isLoading: boolean;

  setScreen: (screen: number) => void;
  setEntity: (entity: Entity) => void;
  setAccounts: (accounts: Account[]) => void;
  setSelectedAccount: (account: Account) => void;
  setVerificationSession: (session: VerificationSession) => void;
  setSensitiveData: (data: AccountSensitive) => void;
  setPaymentToken: (token: ShopifyPaymentToken) => void;
  addApiLog: (log: ApiLog) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  screen: 0,
  entity: null,
  accounts: [],
  selectedAccount: null,
  verificationSession: null,
  sensitiveData: null,
  paymentToken: null,
  apiLogs: [],
  isLoading: false,
};

export const useDemoStore = create<DemoStore>((set) => ({
  ...initialState,

  setScreen: (screen) => set({ screen }),
  setEntity: (entity) => set({ entity }),
  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setVerificationSession: (session) => set({ verificationSession: session }),
  setSensitiveData: (data) => set({ sensitiveData: data }),
  setPaymentToken: (token) => set({ paymentToken: token }),
  addApiLog: (log) => set((state) => ({ apiLogs: [...state.apiLogs, log] })),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set(initialState),
}));
