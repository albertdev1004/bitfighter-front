// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import React, { useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { isNullOrUndefined } from 'util'
import { Route, BrowserRouter, Routes, Navigate, useNavigate } from 'react-router-dom'

import './App.css'
import './revamped/css/index.css'

import { useAppDispatch, useAppSelector } from './hooks'
import { FetchLeaderBoard, fetchPlayerWalletInfo, UpdateUserNetwork } from './hooks/ApiCaller'

import { getBalances } from './utils/web3_utils'
import { ListGameServers } from './utils/game_server_utils'
import { LoopAllFightsAndUpdate, updateBetInfOfPlayer } from './utils/fight_utils'

import { Web2Login } from './landing-page/Web2Login'
import { Web3Login } from './landing-page/Web3Login'

import LandingPage from './revamped/pages/landing/LandingPage'
import LeaderboardPage from './revamped/pages/leaderboard/LeaderboardPage'

import Landing from './landing-page/Landing'
import Leaderboard from './landing-page/Leaderboard'
import { InvalidUserPage } from './landing-page/InvalidUserPage'
import FightersNewCenterPart from './landing-page/FightersNewCenterPart'

import store from './stores'
import { ChangeGeoInfo } from './stores/UserGeoStore'
import { SetConnectedNetwork } from './stores/Web3Store'
import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore'

const Backdrop = styled.div`
  display: content;
  position: absolute;
  height: 100%;
  width: 100%;
`

declare global {
  interface Window {
    ethereum?: any
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

const loading = () => <div className='animated fadeIn pt-3 text-center'>Loading...</div>

function App() {
  const dispatch = useAppDispatch()

  const ValidUser = useAppSelector((state) => state.userPathStore.ValidUser)
  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.style.zIndex = '-5'
    dispatch(ChangeMetaMaskInstalled(isMetaMaskInstalled()))
    // if (localStorage.getItem('network_connected') && localStorage.getItem('network_connected').length > 0) {
    //   store.dispatch(SetConnectedNetwork(localStorage.getItem('network_connected')))
    // }
    // if (localStorage.getItem('connected_matic_network')) {
    //   const lastLoginTime = localStorage.getItem('last_web3_login_time')
    //   if (lastLoginTime) {
    //     const currTime = new Date().getTime()
    //     const lastLoginTimeStamp = new Date(lastLoginTime).getTime()
    //     if (Math.abs(currTime - lastLoginTimeStamp) < 1 * 60 * 1000) {
    //       Web3Login()
    //     }
    //     // Compare timestamps and return:
    //     // -1 if timestamp is earlier than last login
    //     //  0 if timestamps are equal
    //     //  1 if timestamp is later than last login
    //     // return currTime.localeCompare(time);
    //   }
    // } else if (localStorage.getItem('web2_wallet_address')) {
    //   const web2Address = localStorage.getItem('web2_wallet_address')
    //   if (web2Address) {
    //     Web2Login(web2Address)
    //   }
    // } else if (!isNullOrUndefined(localStorage.getItem('web2_email_address')) && localStorage.getItem('web2_email_address') !== '') {
    //   const web2Address = localStorage.getItem('web2_email_address')
    //   if (web2Address) {
    //     Web2Login(web2Address)
    //   }
    // }
    //server should push this. client should not call for it
    FetchLeaderBoard()
    const intervalId = setInterval(() => {
      FetchLeaderBoard()
    }, 60000)
    LoopAllFightsAndUpdate()
    const intervalId1 = setInterval(() => {
      LoopAllFightsAndUpdate()
    }, 10000)
    UpdateUserNetwork()
    setInterval(() => {
      UpdateUserNetwork()
    }, 10000)
    if (store.getState().web3store.web3Connected) {
      getBalances(store.getState().web3store.userAddress)
      const intervalId2 = setInterval(() => {
        getBalances(store.getState().web3store.userAddress)
      }, 20000)
      UpdateUserNetwork()
      setInterval(() => {
        UpdateUserNetwork()
      }, 10000)
    }

    return () => { }
  }, [])
  const ForceRedirectHome = () => {
    // const navigate = useNavigate();

    // useEffect(() => {
    //   // Check if the page was reloaded
    //   if (window.performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    //     navigate('/'); // Redirect to the home page
    //   }
    // }, [navigate]);

    // return null; // Render nothing
  };

  return (
    <Backdrop>
      <BrowserRouter>
        <Leaderboard />
        <React.Suspense fallback={loading()}>
          {/* <ForceRedirectHome /> */}
          {ValidUser ? (
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/leaderboard' element={<LeaderboardPage />} />
              <Route path='play' element={<Landing name='play' />} />
              <Route path='game' element={<Landing name='game' />} />
              <Route path='mint' element={<Landing name='mint' />} />
              <Route path='contest' element={<Landing name='contest' />} />
              <Route path='leaderboard' element={<Landing name='leaderboard' />} />
              <Route path='login' element={<Landing name='login' />} />
            </Routes>
          ) : (
            <InvalidUserPage />
          )}
        </React.Suspense>
      </BrowserRouter>
    </Backdrop>
  )
}

export default App
