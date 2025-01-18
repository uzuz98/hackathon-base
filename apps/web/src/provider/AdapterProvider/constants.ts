// @ts-nocheck
'use client'
import { Coin98WalletAdapter } from '@coin98-com/wallet-adapter-coin98'
import { BLOCKCHAINS_DATA } from '@coin98-com/wallet-adapter-react'
import { matic, solana, viction, type ChainInfo } from '@coin98-com/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'

export const chainsSupported = [BLOCKCHAINS_DATA.ethereum]

export const walletsSupported = [Coin98WalletAdapter]
export const defaultChains: ChainInfo[] = [viction]
export const DynamicWalletModalC98 = dynamic(
  async () => (await import('@coin98-com/wallet-adapter-react-ui')).WalletModalC98,
  { ssr: false },
)
