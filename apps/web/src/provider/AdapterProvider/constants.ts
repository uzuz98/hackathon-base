// @ts-nocheck
'use client'
import { Coin98WalletAdapter } from '@coin98t/wallet-adapter-coin98'
import { RamperWalletAdapter } from '@coin98t/wallet-adapter-ramper'
import { BLOCKCHAINS_DATA } from '@coin98t/wallet-adapter-react'
// import { matic, solana, viction, type ChainInfo } from '@coin98t/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'

export const chainsSupported = [BLOCKCHAINS_DATA.solana, BLOCKCHAINS_DATA.ethereum]

export const walletsSupported = [Coin98WalletAdapter, RamperWalletAdapter]
export const defaultChains: ChainInfo[] = ['solana', 'viction', 'matic']
export const DynamicWalletModalC98 = dynamic(
  async () => (await import('@coin98t/wallet-adapter-react-ui')).WalletModalC98,
  { ssr: false },
)
