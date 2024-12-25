// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { Grid } from 'antd'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { isNullOrUndefined } from 'util'
import { useLocation } from 'react-router-dom'
import { useAccount } from '@particle-network/connectkit'

import Home from './Home'
import Header from './Header'
import { makeid } from '../utils'
import phaserGame from '../PhaserGame'
import NewFighters from './FightersNew'
import { Web2LoginPage } from './Web2LoginPage'
import { fetchSystemWalletsInfo, FetchGameServerConnection } from '../utils/game_server_utils'

import Game from '../game/scenes/Game'
import Bootstrap from '../game/scenes/Bootstrap'
import { FightConfirmationBox } from '../game/Components/FightConfirmationBox'

import OldMintPage from './MintPage'
import MintPage from './MintUiDesign/MintUiManager'
import MintCardsPage from './MintCardsPage/MintCardsPage'

import Footer from '../revamped/components/Footer'
import NavigationBar from '../revamped/components/NavigationBar'
import PageConnectKit from '@/revamped/pages/landing/connectkit'

import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT'
import { fetchNFTsFromDB, ListGameServersApiCall, loginAndAuthenticateUser, loginAndAuthenticatePlayer, randomGenarateBitfightersV2 } from '../hooks/ApiCaller'

import store from '../stores'
import { setPlayerAuthToken } from '../stores/AuthStore'
import { Login, SetConnectedWeb3 } from '../stores/Web3Store'
import { SetGlobalRefCode } from '../stores/MintCardStateStore'
import { setNFTDetails, setTotalNFTData, setNFTLoadedBool } from '../stores/BitFighters'
import { SetSelectedRoomId, SetGameLoadingState, SetShowGameServersList } from '../stores/WebsiteStateStore'
import { setNickName, SetGameStarted, SetMintGameStarted, SetCurrentGamePlayer } from '../stores/PlayerData'
import { ChangePath, ChangeAuthTOken, ChangewbtcBalance, ChangeMaticBalance, ChangeValidUserState } from '../stores/UserWebsiteStore'

/**
 * This is the landing page.
 * @returns
 */
const Landing = () => {
  let View
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { isConnected } = useAccount()
  const HistoryPath = useAppSelector((state) => state.userPathStore.path)
  const mintGameStarted = useAppSelector((state) => state.playerDataStore.mintGameStarted)
  const game = phaserGame.scene.keys.game as Game
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  /**
   * If the user clicks the play button, the user goes to the game directly.
   */
  const joinAsGuest = async () => {
    // Get from the web2Address from local storage.
    const web2Address = localStorage.getItem('web2_wallet_address')
    let web2Id = makeid(50)
    if (web2Address) {
      web2Id = web2Address
    }

    // Login using this address
    dispatch(Login(web2Id))
    dispatch(ChangeValidUserState(true))

    // Get the auth token from the server and set this token to the local storage.
    const auth_token: string = await loginAndAuthenticateUser(web2Id)
    dispatch(ChangeAuthTOken(auth_token))
    localStorage.setItem('debug--web2_wallet_address', web2Id)

    // Generate random bitfighter for this user.
    const output = await randomGenarateBitfightersV2(web2Id, ethers.constants.AddressZero, 1, 'web2')

    if (!isNullOrUndefined(output)) {
      const result = await fetchNFTsFromDB(web2Id)
      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      dispatch(setTotalNFTData(result.message))
      dispatch(setNFTDetails(dataOfNFTS))
      dispatch(setNFTLoadedBool(true))
      dispatch(Login(web2Id))
      dispatch(SetConnectedWeb3(false))
      dispatch(ChangewbtcBalance('0'))
      dispatch(ChangeMaticBalance('0'))
      const data = result.message[0]
      store.dispatch(SetShowGameServersList(true))
      store.dispatch(SetCurrentGamePlayer(data))
      store.dispatch(setNickName(data.nick_name))
      const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
      if (!isNullOrUndefined(playerAuthToken)) {
        store.dispatch(setPlayerAuthToken(playerAuthToken))
        const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, 'Singapore', 'create')
        if (serverList && serverList?.data && serverList?.data.length > 0) {
          await fetchServerUrlAndConnect(serverList.data[0].room_id)
        }
      }
    }
  }

  /**
   * Get the server url by the server rood id and connect to the server url.
   * @param room_id Server room id
   */
  const fetchServerUrlAndConnect = async (room_id: string) => {
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))
    fetchSystemWalletsInfo()
    startGame()
  }

  /**
   * Start Game when the user and the server are ready.
   */
  const startGame = async () => {
    store.dispatch(SetGameStarted(true))
    localStorage.setItem('game_state', 'start')
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
  }

  /**
   * Join and go in game
   */
  async function joinDirectlyToGame() {
    await joinAsGuest()
  }

  // useEffect(() => {
  //   joinDirectlyToGame()
  // }, [])

  // useEffect(() => {
  //   if (location.pathname == "/game")
  //     joinDirectlyToGame()
  // }, [location])

  if (
    HistoryPath === 'gamePlay' &&
    (location.pathname === '/' || location.pathname === '/mint' || location.pathname === '/contest' || location.pathname === '/presale')
  ) {
    if (window.confirm('Are you sure?') == true) {
      if (bootstrap) {
        bootstrap.pauseGame()
        if (game.lobbySocketConnection) {
          game.closeLobbySocketConnection()
        }
        bootstrap.launchBackGroundNight()
        if (location.pathname === '/mint') {
          View = <MintPage />
        } else if (location.pathname === '/contest') {
          View = <PageConnectKit />
        }
      }
      store.dispatch(ChangePath(location.pathname))
      store.dispatch(SetGameStarted(false))
      // setTimeout(() => {
      window.location.reload()
      // }, 500)
    } else {
      store.dispatch(ChangePath('gamePlay'))
      store.dispatch(SetGameStarted(true))
    }
  } else if (HistoryPath === 'minting-game' && location.pathname !== '/mint') {
    bootstrap.pauseMintingGame()
    store.dispatch(ChangePath(location.pathname))
    store.dispatch(SetMintGameStarted(false))
  } else if (location.pathname === '/contest') {
    View = <PageConnectKit />
  } else {
    if (location.pathname === '/play' || location.pathname === '/') {
      View = <NewFighters />
    } else if (location.pathname.includes('/login')) {
      View = <Web2LoginPage />
      dispatch(SetGameStarted(false))
    } else if (location.pathname.includes('/game')) {
      // console.log('GamePlay 2', isConnected)
      // if (isConnected) {
      //   console.log('Metamask is connected.')
      //   View = <NewFighters isGuest={false} />
      // } else {
      //   console.log('Metamask is not connected yet.')
      //   View = <NewFighters isGuest={true} />
      // }
      View = <NewFighters />
    } else if (location.pathname.includes('/mint')) {
      const allMetaElements = document.getElementsByTagName('meta')
      for (let i = 0; i < allMetaElements.length; i++) {
        if (allMetaElements[i].getAttribute('name') === 'description') {
          allMetaElements[i].setAttribute('description', 'Use my ref code to join my gang and dominate the cities with me!')
          allMetaElements[i].setAttribute('title', 'Bit Fighters')
          allMetaElements[i].setAttribute('og:description', 'Use my ref code to join my gang and dominate the cities with me!')
          allMetaElements[i].setAttribute('og:title', 'Bit Fighters')
          break
        }
      }
      const url = new URL(window.location.href)
      const global_ref_code = url.searchParams.get('ref_code')
      if (global_ref_code) {
        store.dispatch(SetGlobalRefCode(global_ref_code))
      }
      View = <MintCardsPage />
    } else {
      View = (
        <div style={{ color: 'aliceblue' }}>
          <h1>404 Page does not exist</h1>
        </div>
      )
      dispatch(SetGameStarted(false))
    }
  }

  return (
    <>
      {HistoryPath === 'gamePlay' ? (
        <div className='main-landing w-100 h-100'>
          <div style={{ display: 'flex', flexDirection: 'column' }} className='h-100'>
            <Row>
              <Header />
            </Row>
            <Row className='flex-grow-1'>
              <div>
                <FightConfirmationBox />
                {View}
              </div>
            </Row>
          </div>
        </div>
      ) : mintGameStarted ? (
        <>
          <div className=' main-landing w-100 '>{View}</div>
        </>
      ) : (
        <div className='revamped-wrapper'>
          <NavigationBar />
          <FightConfirmationBox />
          <div className='revamped-other-page'>{View}</div>
          <Footer />
        </div>
      )}
    </>
  )
}
export default Landing
