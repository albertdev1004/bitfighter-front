import { Link } from 'react-router-dom'

import { useModal, useAccount } from '@particle-network/connectkit'

import landingPageHeroSectionImg1 from '../../assets/images/landing-page-hero-section-1.webp'
import heroSectionBackground from '../../../assets/landing-page-hero-section-bg.webp'
import heroSectionBackground1 from '../../../assets/landing-page-hero-section-bg-2.webp'
import heroSectionBackground2 from '../../../assets/landing-page-hero-section-bg-3.webp'
import heroSectionBackground3 from '../../../assets/landing-page-hero-section-bg-4.webp'
import { Box } from '@mui/material'
import store from '@/stores'
import { LogOut, SetConnectedNetwork } from '@/stores/Web3Store'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setNFTLoadedBool } from '@/stores/BitFighters'
import { UpdateUserNetwork } from '@/hooks/ApiCaller'
import { useEffect, useState } from 'react'

export default function HeroSection() {

  const dispatch = useAppDispatch();
  const { isOpen, setOpen } = useModal()
  const bgImgs: string[] = [heroSectionBackground, heroSectionBackground1, heroSectionBackground2, heroSectionBackground3]

  const [showConnectBtn, setShowConnectBtn] = useState(true)
  const web2Address = useAppSelector((state) => state.web3store.web2EmailAddress)
  const userAddress = useAppSelector((state) => state.web3store.userAddress)

  useEffect(() => {
    console.log("particle --- ", userAddress, localStorage.getItem('web2_wallet_address'))
    if (userAddress) {
      setShowConnectBtn(false)
    }
  }, [web2Address, userAddress])

  console.log("particle connectBtn --- ", showConnectBtn)


  return (
    <section
      id='home'
      className='hero-section'
      style={{
        background: `radial-gradient(50% 50% at 50% 50%, rgba(4, 10, 22, 0.8) 0%, rgba(4, 10, 22, 0) 75.5%), url('${bgImgs[0]
          }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 75%',
      }}
    >
      <div className='top-fader'></div>
      <div className='container'>
        <img src={landingPageHeroSectionImg1} alt='' />
        <div className='btns-wrapper'>
          <Link to={'/game'} className='primary-btn-component'>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
            <div className='content'>
              <span>Play now</span>
            </div>
          </Link>
          {showConnectBtn && <Box onClick={() => setOpen(true)} className='primary-btn-component'>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
            <div className='content'>
              <span>Connect</span>
            </div>
          </Box>}
        </div>
      </div>
    </section>
  )
}
