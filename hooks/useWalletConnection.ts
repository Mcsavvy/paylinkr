"use client";
import { create } from "zustand";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  accountType: string | null;
  userId: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  accountType: null,
  userId: null,
  loading: false,
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await signOut({ redirect: false });
    set({ isConnected: false, address: null, accountType: null, userId: null });
  }
}));

export function useWalletConnection() {
  const { data: session, status } = useSession();
  const { setLoading, ...state } = useWalletStore();
  
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    
    setLoading(false);
    
    if (session && session.user) {
      useWalletStore.setState({
        isConnected: true,
        address: session.user.walletAddress as string,
        accountType: session.user.accountType as string,
        userId: session.user.id as string
      });
    } else {
      useWalletStore.setState({
        isConnected: false,
        address: null,
        accountType: null,
        userId: null
      });
    }
  }, [session, status, setLoading]);
  
  return { ...state, loading: status === "loading" || state.loading };
}
