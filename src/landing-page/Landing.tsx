// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import Home from './Home'
import Header from './Header'
import { useLocation } from 'react-router-dom'
import phaserGame from '../PhaserGame'
import Bootstrap from '../game/scenes/Bootstrap'
import Game from '../game/scenes/Game'
import MintPage from './MintUiDesign/MintUiManager'
import OldMintPage from './MintPage'
import { useAppDispatch, useAppSelector } from '../hooks'
import store from '../stores'
import { ChangeAuthTOken, ChangeMaticBalance, ChangePath, ChangeValidUserState, ChangewbtcBalance } from '../stores/UserWebsiteStore'
import { FightConfirmationBox } from '../game/Components/FightConfirmationBox'
import { Web2LoginPage } from './Web2LoginPage'
import styled from 'styled-components'
import { SetCurrentGamePlayer, SetGameStarted, SetMintGameStarted, setNickName } from '../stores/PlayerData'
import MintCardsPage from './MintCardsPage/MintCardsPage'
import { SetGlobalRefCode } from '../stores/MintCardStateStore'
import { isNullOrUndefined } from 'util'
import NewFighters from './FightersNew'
import { Grid } from 'antd'
import { Row } from 'react-bootstrap'
import NavigationBar from '../revamped/components/NavigationBar'
import Footer from '../revamped/components/Footer'
import { useEffect } from 'react'
import { Web2Login } from './Web2Login'
import { makeid } from '../utils'
import { Login, SetConnectedWeb3 } from '../stores/Web3Store'
import { fetchNFTsFromDB, ListGameServersApiCall, loginAndAuthenticatePlayer, loginAndAuthenticateUser, randomGenarateBitfightersV2 } from '../hooks/ApiCaller'
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT'
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '../stores/BitFighters'
import { SetGameLoadingState, SetSelectedRoomId, SetShowGameServersList } from '../stores/WebsiteStateStore'
import { ethers } from 'ethers'
import { setPlayerAuthToken } from '../stores/AuthStore'
import { FetchGameServerConnection, fetchSystemWalletsInfo } from '../utils/game_server_utils'
import PrivacyPolicy from './PrivacyPolicy'
import NotificationMessageHelper from '../game/Components/NotificationMessageHelper'


const Landing = () => {
  const dispatch = useAppDispatch()
  const HistoryPath = useAppSelector((state) => state.userPathStore.path)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const location = useLocation()
  const mintGameStarted = useAppSelector((state) => state.playerDataStore.mintGameStarted)
  // console.log("in Landing ..", props, location);
  const game = phaserGame.scene.keys.game as Game
  let View
  console.log('current path 1', HistoryPath, location.pathname, HistoryPath === 'minting-game' && location.pathname !== '/mint')

  const joinAsGuest = async () => {
    const web2Address = localStorage.getItem('web2_wallet_address')
    console.log('debug_joinAsGuest as guest clicked..in /game ', web2Address)
    let web2Id = makeid(50)
    if (web2Address) {
      web2Id = web2Address
    }

    dispatch(Login(web2Id))
    dispatch(ChangeValidUserState(true))
    const auth_token: string = await loginAndAuthenticateUser(web2Id)
    dispatch(ChangeAuthTOken(auth_token))
    localStorage.setItem('debug--web2_wallet_address', web2Id)
    // setTimeout(async () => {
    const output = await randomGenarateBitfightersV2(web2Id, ethers.constants.AddressZero, 1, 'web2')
    console.log('--debugoutput .. ', output)
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


      //
      const data = result.message[0]
      store.dispatch(SetShowGameServersList(true))
      store.dispatch(SetCurrentGamePlayer(data))
      store.dispatch(setNickName(data.nick_name))

      console.log("#######debug#########", data)

      //
      // Washington_DC

      // store.dispatch(SetGameServersData(serverList.data));

      // await FetchGameServerConnection()

      const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
      if (!isNullOrUndefined(playerAuthToken)) {
        store.dispatch(setPlayerAuthToken(playerAuthToken))

        const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, "Singapore", 'create')
        console.log("--debug--serverlist--", serverList, serverList && serverList?.data && serverList?.data.length > 0)
        if (serverList && serverList?.data && serverList?.data.length > 0) {
          await fetchServerUrlAndConnect(serverList.data[0].room_id)
        }

        // ListGameServers(gameServerReginoSelected)
      }

    }
    // }, 10)
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    console.log(room_id)
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))

    fetchSystemWalletsInfo()
    startGame()
    // setTimeout(() => {
    //   startGame()
    // }, 2000)
  }

  const startGame = async () => {
    // event.preventDefault();
    console.log('debug_startGame----')
    store.dispatch(SetGameStarted(true))
    localStorage.setItem('game_state', 'start')
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
  }

  // join and go in game
  async function joinDirectlyToGame() {
    await joinAsGuest()
  }

  // useEffect(() => {
  //   joinDirectlyToGame()
  // }, [])

  // useEffect(() => {
  //   console.log("debug--", location.pathname)
  //   if (location.pathname == "/game")
  //     joinDirectlyToGame()
  // }, [location])

  if (
    HistoryPath === 'gamePlay' &&
    (location.pathname === '/play' ||
      location.pathname === '/' ||
      location.pathname === '/mint' ||
      // location.pathname === "/leaderboard" ||
      location.pathname === '/presale')
  ) {
    if (window.confirm('Are you sure?') == true) {
      if (bootstrap) {
        bootstrap.pauseGame()
        if (game.lobbySocketConnection) game.closeLobbySocketConnection()
        bootstrap.launchBackGroundNight()
        if (location.pathname === '/play' || location.pathname === '/') {
          View = <Home />
        } else if (location.pathname === '/mint') {
          console.log(location.pathname)
          View = <MintPage />
        }
      }
      store.dispatch(ChangePath(location.pathname))
      store.dispatch(SetGameStarted(false))
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      console.log('no no no..')
      // var bodyHtml = document.querySelector('body');
      // console.log("bodyhtml ", bodyHtml);
      store.dispatch(ChangePath('gamePlay'))
      store.dispatch(SetGameStarted(true))
    }
  } else if (HistoryPath === 'minting-game' && location.pathname !== '/mint') {
    bootstrap.pauseMintingGame()
    store.dispatch(ChangePath(location.pathname))
    store.dispatch(SetMintGameStarted(false))
  }
  // else if (HistoryPath === "gamePlay"  && location.pathname === "/game") {
  //   View = <GameView />
  // }
  else {
    if (location.pathname === '/play' || location.pathname === '/') {
      View = <Home />
      dispatch(SetGameStarted(false))
    } else if (location.pathname.includes('/login')) {
      // console.log("debug.. -", location.pathname);
      View = <Web2LoginPage />
      dispatch(SetGameStarted(false))
    } else if (location.pathname.includes('/game')) {
      // console.log("debug.. -", location.pathname);
      // View = <Fighters />;
      View = <NewFighters />
      // dispatch(setGameStarted(false));
    } else if (location.pathname.includes('/privacy')) {
      View = <PrivacyPolicy />
    } else if (location.pathname.includes('/mint')) {
      const allMetaElements = document.getElementsByTagName('meta')
      console.log('meta -- ', allMetaElements)
      for (let i = 0; i < allMetaElements.length; i++) {
        console.log('---meta', allMetaElements[i].getAttribute('name'))
        if (allMetaElements[i].getAttribute('name') === 'description') {
          //make necessary changes
          console.log('meta 1 -- ', allMetaElements[i])
          // Use my ref code to join my gang and dominate the cities with me!
          // store.dispatch(SetMetaTagDescription())
          allMetaElements[i].setAttribute('description', 'Use my ref code to join my gang and dominate the cities with me!')
          allMetaElements[i].setAttribute('title', 'Bit Fighters')
          allMetaElements[i].setAttribute('og:description', 'Use my ref code to join my gang and dominate the cities with me!')
          allMetaElements[i].setAttribute('og:title', 'Bit Fighters')
          break
        }
      }
      const url = new URL(window.location.href)
      const global_ref_code = url.searchParams.get('ref_code')
      console.log('debug.. -', location.pathname, window.location.href, 'ref -', global_ref_code)
      if (global_ref_code) {
        store.dispatch(SetGlobalRefCode(global_ref_code))
      }

      View = <MintCardsPage />
    }
    // else if (location.pathname.includes("/leaderboard")) {
    //   View = (
    //     <div>
    //       <Leaderboard />
    //       {/* <h1 style={{
    //         color: 'aliceblue'
    //       }}>Page Under Construction</h1> */}
    //     </div>
    //   );
    // }
    else {
      View = (
        <div
          style={{
            color: 'aliceblue',
          }}
        >
          <h1>404 Page does not exist</h1>
        </div>
      )
      dispatch(SetGameStarted(false))
    }
    //  else if (location.pathname === "/game"){
    //   View = <GameView />
    // }
  }

  console.log('current path 2 path___', HistoryPath, location.pathname)

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
      ) : mintGameStarted ?
        <>
          <div className=' main-landing w-100 '>
            {/* <NavigationBar /> */}
            {View}
            {/* <Footer /> */}
          </div>
        </> : (
          <div className='revamped-wrapper'>
            <NotificationMessageHelper />
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
