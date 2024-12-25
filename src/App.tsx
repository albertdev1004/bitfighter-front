// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import React, { useEffect } from 'react'
import './App.css'
import styled from 'styled-components'
import Landing from './landing-page/Landing'
import LandingPage from './revamped/pages/landing/LandingPage'
import LeaderboardPage from './revamped/pages/leaderboard/LeaderboardPage'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { InvalidUserPage } from './landing-page/InvalidUserPage'
// import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore';
import store from './stores'
// import { Web3Login } from "./landing-page/Web3Login";

import axios from 'axios'
import { ChangeGeoInfo } from './stores/UserGeoStore'
import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore'
import { LoopAllFightsAndUpdate, updateBetInfOfPlayer } from './utils/fight_utils'
// import { LoopAllFightsAndUpdate } from './utils/fight_utils';
import './revamped/css/index.css'
// import DocumentMeta from "react-document-meta";
import { ListGameServers } from './utils/game_server_utils'
import { FetchLeaderBoard, fetchPlayerWalletInfo, UpdateUserNetwork } from './hooks/ApiCaller'
import Leaderboard from './landing-page/Leaderboard'
import FightersNewCenterPart from './landing-page/FightersNewCenterPart'
import { getBalances } from './utils/web3_utils'
import { isNullOrUndefined } from 'util'
import { Web2Login } from './landing-page/Web2Login'
import { Web3Login } from './landing-page/Web3Login'
import { SetConnectedNetwork } from './stores/Web3Store'
import Mixpanel from './mixpanel'

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

function App() {
  const loading = () => <div className='animated fadeIn pt-3 text-center'>Loading...</div>
  const ValidUser = useAppSelector((state) => state.userPathStore.ValidUser)
  const dispatch = useAppDispatch()

  const LoopApiCaller = () => {

  }

  useEffect(() => {

    // Mixpanel.identify(user.id);
    Mixpanel.track('Enter_Website');
    // Mixpanel.people.set({
    //   $name: user.username,
    //   // username: user.username,
    // });
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.style.zIndex = '-5'

    console.log('debug metamask installed --> ', isMetaMaskInstalled())
    dispatch(ChangeMetaMaskInstalled(isMetaMaskInstalled()))

    console.log('debug network  ', localStorage.getItem("network_connected"))
    if (localStorage.getItem("network_connected") && localStorage.getItem("network_connected").length > 0) {
      // 

      store.dispatch(SetConnectedNetwork(localStorage.getItem("network_connected")))
    }




    if (localStorage.getItem('connected_matic_network')) {
      const lastLoginTime = localStorage.getItem('last_web3_login_time')
      console.log('debug------------, ', lastLoginTime)
      // localStorage.setItem("last_web3_login_time", (new Date()).toISOString())
      if (lastLoginTime) {
        console.log('  debug------------  ', lastLoginTime)
        const currTime = new Date().getTime()
        const lastLoginTimeStamp = new Date(lastLoginTime).getTime()

        if (Math.abs(currTime - lastLoginTimeStamp) < 1 * 60 * 1000) {
          console.log('debug_connected matic network..')
          Web3Login()
        }
        // Compare timestamps and return:
        // -1 if timestamp is earlier than last login
        //  0 if timestamps are equal
        //  1 if timestamp is later than last login
        // return currTime.localeCompare(time);
      }
    } else if (localStorage.getItem('web2_wallet_address')) {
      console.log('web2 user login...')
      const web2Address = localStorage.getItem('web2_wallet_address')
      if (web2Address) {
        Web2Login(web2Address)
      }
    } else if (!isNullOrUndefined(localStorage.getItem('web2_email_address')) && localStorage.getItem('web2_email_address') !== '') {
      console.log('web2 email exist login...')
      const web2Address = localStorage.getItem('web2_email_address')
      if (web2Address) {
        Web2Login(web2Address)
      }
    }

    // getGeoInfo();
    LoopApiCaller()
    // FetchLeaderBoard();

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

      // if (store.getState().playerDataStore.gameStarted) {
      // fetch --- 
      UpdateUserNetwork()

      setInterval(() => {
        UpdateUserNetwork()
      }, 10000)

      // }


    }

    return () => {
      // clearInterval(intervalId);
      // clearInterval(intervalId1);
      // clearInterval(intervalId2);
    };
  }, []);

  const HomeRedirect = () => {
    return <Navigate to="/game" />;
  };

  return (
    <Backdrop>
      <BrowserRouter>
        <Leaderboard />
        <React.Suspense fallback={loading()}>
          {ValidUser ? (
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/leaderboard' element={<LeaderboardPage />} />
              <Route path='play' element={<Landing name='play' />} />
              <Route path='game' element={<Landing name='game' />} />
              <Route path='mint' element={<Landing name='mint' />} />
              <Route path='leaderboard' element={<Landing name='leaderboard' />} />
              <Route path='login' element={<Landing name='login' />} />
              {/* Privacy */}
              <Route path='privacy' element={<Landing name='privacy' />} />
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
