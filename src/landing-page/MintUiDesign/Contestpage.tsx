// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

// import { useAccount } from '@particle-network/connectkit'
import { ConnectButton } from '@particle-network/connectkit'

import { ParticleConnectkit } from './connectkit'

export default function ContestPage() {
  // const { isConnected } = useAccount()

  return (
    <>
      <ParticleConnectkit>
        <ConnectButton />
        {/* {isConnected && alert("Connected")}
        {!isConnected && alert("Not Connected!")}
        {isConnected ? <h1>Not Connected!</h1> : <h1>Not Connected!</h1>} */}
      </ParticleConnectkit>
    </>
  )
}
