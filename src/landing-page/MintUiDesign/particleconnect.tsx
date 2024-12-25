'use client'

import { ConnectKitProvider, createConfig } from '@particle-network/connectkit'
import { authWalletConnectors } from '@particle-network/connectkit/auth'
import { mainnet, solana } from '@particle-network/connectkit/chains'
import { evmWalletConnectors } from '@particle-network/connectkit/evm'
import { injected as solaInjected, solanaWalletConnectors } from '@particle-network/connectkit/solana'
import { wallet, EntryPosition } from '@particle-network/connectkit/wallet'
import React from 'react'

// //Retrived from https://dashboard.particle.network
const projectId = '7e01506f-0f4e-4b2e-8ec5-9ca08fd85a0f' as string
const clientKey = 'cDf0LBXyupFgPK3INz6sZf6XFrRsoq1cm3L4un6R' as string
const appId = '17b765df-ce7b-4f49-a253-e8efd318b496' as string
const walletConnectProjectId = '0x082fc809C1acB2D121C335Fb6f59D2851a1C27b6' as string

if (!projectId || !clientKey || !appId) {
  throw new Error('Please configure the Particle project in .env first!')
}

const config = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    // Optional, collection of properties to alter the appearance of the connection modal
    // Optional, label and sort wallets (to be shown in the connection modal)
    recommendedWallets: [
      { walletId: 'metaMask', label: 'Recommended' },
      { walletId: 'coinbaseWallet', label: 'popular' },
    ],
    splitEmailAndPhone: false, // Optional, displays Email and phone number entry separately
    collapseWalletList: false, // Optional, hide wallet list behind a button
    hideContinueButton: false, // Optional, remove "Continue" button underneath Email or phone number entry
    connectorsOrder: ['email', 'phone', 'social', 'wallet'], //  Optional, sort connection methods (index 0 will be placed at the top)
    language: 'en-US', // Optional, also supported ja-JP, zh-CN, zh-TW, and ko-KR
    mode: 'light', // Optional, changes theme between light, dark, or auto (which will change it based on system settings)
    theme: {
      '--pcm-accent-color': '#ff4d4f',
      // ... other options
    },
    logo: 'https://...',
    filterCountryCallingCode: (countries) => {
      // Optional, whitelist or blacklist phone numbers from specific countries
      return countries.filter((item) => item === 'US')
    },
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: 'My App', icon: '', description: '', url: '' }, // Optional, this is Metadata used by WalletConnect and Coinbase
      walletConnectProjectId: 'Replace with your WalletConnect Project ID', // optional, retrieved from https://cloud.walletconnect.com
    }),
    authWalletConnectors({
      // Optional, configure this if you're using social logins
      authTypes: ['email', 'google', 'apple', 'twitter', 'github'], // Optional, restricts the types of social logins supported
      fiatCoin: 'USD', // Optional, also supports CNY, JPY, HKD, INR, and KRW
      promptSettingConfig: {
        // Optional, changes the frequency in which the user is asked to set a master or payment password
        // 0 = Never ask
        // 1 = Ask once
        // 2 = Ask always, upon every entry
        // 3 = Force the user to set this password
        promptMasterPasswordSettingWhenLogin: 1,
        promptPaymentPasswordSettingWhenSign: 1,
      },
    }),
    solanaWalletConnectors(), // Optional, you need to configure it when using Solana
  ],
  plugins: [
    wallet({
      // Optional configurations for the attached embedded wallet modal
      entryPosition: EntryPosition.BR, // Alters the position in which the modal button appears upon login
      visible: true, // Dictates whether or not the wallet modal is included/visible or not
    }),
  ],
  chains: [mainnet, solana],
})

// Export ConnectKitProvider to be used within your index or layout file (or use createConfig directly within those files).
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>
}
