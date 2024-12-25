'use client'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Particle imports
import { useModal, useAccount } from '@particle-network/connectkit'

export default function Home() {
  const navigate = useNavigate()
  const { isOpen, setOpen } = useModal()
  const { address, isConnected, isConnecting, isDisconnected, chainId } = useAccount()

  useEffect(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if (isConnected) {
      navigate('/game')
    }
  }, [isConnected])

  return <></>
}
