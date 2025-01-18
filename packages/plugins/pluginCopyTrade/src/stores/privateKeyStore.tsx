import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// type imports

// constant imports

interface KeyStoreProps {
  privateKey: string;
  setPrivateKey: (privateKey: string | undefined) => void;
}

const STATE_DEFAULT = {
  privateKey: '',
};

export const useKeyStore = create<KeyStoreProps>()(
  devtools((set) => ({
    ...STATE_DEFAULT,

    // Set state
    setPrivateKey: (privateKey) => set({ privateKey }),
  }))
);
