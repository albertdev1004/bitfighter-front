// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import { LoadingButton } from '@mui/lab'
import { isNullOrUndefined } from 'util'
import Bootstrap from '../game/scenes/Bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Fab,
  Grid,
  Modal,
  Button,
  Select,
  Tooltip,
  MenuItem,
  Snackbar,
  ImageList,
  InputLabel,
  Typography,
  FormControl,
  TooltipProps,
  ImageListItem,
  tooltipClasses,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import Footer from './Footer'
import phaserGame from '../PhaserGame'
import { registerBitfighter } from '../contract'
import { Loader } from './components/Loader/Loader'
import { ListGameServers } from '../utils/game_server_utils'
import HeroSection from '../revamped/pages/landing/HeroSection'

import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT'
import { CheckIfAcceptableNickName, fetchNFTsFromDB, loginAndAuthenticatePlayer, updateSingleBfInDB } from '../hooks/ApiCaller'

import Chat from '../game/Components/Chat'
import { ATMView } from '../game/Components/ATMView'
import { Tutorials } from '../game/Components/Tutorials'
import { IPlayerData } from '../game/characters/IPlayer'
import { SnowOverlay } from '../game/scenes/SnowOverlay'
import { ServiceView } from '../game/Components/ServiceView'
import { PlayersInfo } from '../game/Components/PlayersInfo'
import { ControlsInfo } from '../game/Components/ControlsInfo'
import NewMenuSideBar from '../game/Components/NewMenuSideBar'
import { EquipView } from '../game/Components/InventoryView/EquipView'
import { QueueAddInfoWindow } from '../game/Components/QueueAddInfoWindow'
import { InventoryView } from '../game/Components/InventoryView/InventoryView'
import { SendingFriendRequest } from '../game/Components/SendingFriendRequest'
import NewWinnersReceipt from '../game/Components/MenuComponents/NewWinnersReceipt'
import NotificationMessageHelper from '../game/Components/NotificationMessageHelper'
import { BroadCastCombiner2 } from '../game/Components/BroadCastInfo2/BroadcastCombiner'
import InGameAssetPurchase from '../game/Components/MenuComponents/InGameAsssetPurchase'
import { ServerListWindow } from '../game/Components/MenuComponents/ServerList/ServerListWindow'
import { ServerListPortable } from '../game/Components/MenuComponents/ServerList/ServerListPortable'
import { BroadcastingAnnouncement } from '../game/Components/BroadcastingInfo/BroadcastingAnnouncement'

import store from '../stores'
import { setPlayerAuthToken } from '../stores/AuthStore'
import { setTotalNFTData, setNFTDetails } from '../stores/BitFighters'
import { SetCurrentGamePlayer, setNickName } from '../stores/PlayerData'
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../stores/UserWebsiteStore'
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../stores/NotificationStore'
import { SetGameLoadingState, SetSelectedGameServerURL, SetShowGameServersList } from '../stores/WebsiteStateStore'

const AttributeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  img {
    width: 24px;
    height: 24px;
  }

  h5 {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 8px;
    text-transform: uppercase;
  }
`

const StyledKeyboardArrowLeftIcon = styled(KeyboardArrowLeftIcon)``

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} placement='top' arrow />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      paddingTop: '10px',
      paddingRight: '15px',
      border: '1px solid #dadde9',
      backgroundColor: '#f5f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    [`& .${tooltipClasses.arrow}`]: {
      '&:before': {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
  }),
)

function NewFighters(isGuest: boolean) {
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3Network = useAppSelector((state) => state.web3store.web3Network)
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  const connectionMode = useAppSelector((state) => state.web3store.connectionMode)
  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)
  const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const web2EmailAddress = useAppSelector((state) => state.web3store.web2EmailAddress)
  const ProfilemenuClicked = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const connectKitProcessed = useAppSelector((state) => state.web3store.connectKitProcessed)
  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)

  const [isLoading, setIsLoading] = useState(false)
  const [formNickNameame, setFormNickName] = useState('')
  const [formLuckyNumber, setFormLuckyNumber] = useState(1)
  const [registerProcessRunning, setRegisterProcessRunning] = useState(false)
  const [playerSelectedBool, setPlayerSelectedBool] = useState(false)
  const [playerSelected, setPlayerSelected] = useState<IPlayerData>()
  const [cardSelected, setCardSelected] = useState('')

  const isExecutingRef = useRef(false)

  const handlePlayerSelection = async (data: IPlayerData) => {
    // console.log('--player selected.. data ', data)
    setPlayerSelected(data)
    setPlayerSelectedBool(true)

    store.dispatch(SetShowGameServersList(true))
    store.dispatch(SetCurrentGamePlayer(data))
    store.dispatch(setNickName(data.nick_name))

    setCardSelected(data.data.image)
    bootstrap.play_select_sound()

    // console.log('--player selected.. calling login ')
    const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
    if (!isNullOrUndefined(playerAuthToken)) {
      store.dispatch(setPlayerAuthToken(playerAuthToken))
      ListGameServers(gameServerReginoSelected)
    }
  }

  function CommonToolTip({ data, indexkey }) {
    return (
      <HtmlTooltip
        key={indexkey}
        title={
          <React.Fragment>
            {data.data.attributes.map((attr: { trait_type: any; value: any }, index) => {
              return attr.trait_type === 'Defense' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/diamond_icon.png' alt='.' />
                  <h5>Defense: {attr.value} </h5>
                </AttributeInfo>
              ) : attr.trait_type === 'Health' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/heart_icon.png' alt='.' />
                  <h5>Health: {attr.value} </h5>
                </AttributeInfo>
              ) : attr.trait_type === 'Kick' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/kick_icon.png' alt='.' />
                  <h5>Kick: {attr.value} </h5>
                </AttributeInfo>
              ) : attr.trait_type === 'Punch' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/punch_icon.png' alt='.' />
                  <h5>Punch: {attr.value} </h5>
                </AttributeInfo>
              ) : attr.trait_type === 'Speed' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/flash_icon.png' alt='.' />
                  <h5>Speed: {attr.value} </h5>
                </AttributeInfo>
              ) : attr.trait_type === 'Stamina' ? (
                <AttributeInfo key={`${attr.trait_type}-${index}`}>
                  <img src='bitfgihter_assets/icons/water_drop_icon.png' alt='.' />
                  <h5>Stamina: {attr.value} </h5>
                </AttributeInfo>
              ) : (
                <div key={`${attr.trait_type}-${index}`}></div>
              )
            })}
          </React.Fragment>
        }
      >
        <div className='player-card'>
          <img
            src={`${data.data.first_frame_image}`}
            alt={'Hero'}
            loading='lazy'
            onClick={() => {
              console.log('select card ')
              handlePlayerSelection(data)
            }}
          />

          <h4>{data?.nick_name !== '' ? data?.nick_name : '?'}</h4>
        </div>
      </HtmlTooltip>
    )
  }

  const registerFormValidate = async () => {
    setRegisterProcessRunning(true)

    if (!(formLuckyNumber > 0 && formLuckyNumber < 100)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Lucky Number should be 0-100'))
      setRegisterProcessRunning(false)
      return
    }

    if (!(formNickNameame.length > 0 && formNickNameame.length < 13)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Nick name should be of length 1-12'))
      setRegisterProcessRunning(false)
      return
    }

    if (playerSelected && playerSelected?.minted_id === 0) {
      return
    }

    if (!playerSelected) {
      return
    }

    // check if acceptable nick name
    const data = await CheckIfAcceptableNickName(formNickNameame)
    // console.log('---debug_nick_name_validate---', data)
    if (!data) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Choose other Nick Name. This one is taken'))
      setRegisterProcessRunning(false)
      return
    }

    // update in smart contract. and then update the db
    // then fetch data from db
    // and udate the UI

    const registered = await registerBitfighter(formNickNameame, formLuckyNumber, playerSelected?.minted_id)
    if (registered.error === 1) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage(registered.message + '\n' + registered.error_data))
    } else {
      await updateSingleBfInDB(store.getState().web3store.userAddress, playerSelected.minted_id)
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      // console.log('dataofnfts -- ', dataOfNFTS)

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))

      // console.log('--dataofnfts-', playerSelected.minted_id)

      for (let i = 0; i < result.message.length; i++) {
        // console.log('--dataofnfts-', playerSelected.minted_id, result.message[i].minted_id)
        if (playerSelected.minted_id === result.message[i].minted_id) {
          store.dispatch(SetCurrentGamePlayer(result.message[i]))
        }
      }
    }

    setRegisterProcessRunning(false)
  }

  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextmenu)

    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu)
    }
  }, [])

  useEffect(() => {
    if (bitFighterNFTData.length > 0) {
      // store.dispatch(SetShowGameServersList(true));
    }

    if (!gameStarted && userAddress !== '') {
      setTimeout(() => {
        store.dispatch(SetShowGameServersList(true))
      }, 1000)
    } else {
      store.dispatch(SetShowGameServersList(false))
    }

    // // console.log("--------- in fightersnew -- ", selectedPlayer)
    // if (selectedPlayer)

    window.addEventListener('beforeunload', beforeUnloadFun)
    function beforeUnloadFun() {
      localStorage.setItem('last_logged_out', new Date().getTime().toString())
    }

    return () => {
      // beforeUnloadFun()
      window.removeEventListener('beforeunload', beforeUnloadFun)
    }
  }, [])

  async function CommonWeb2Flow(address) {
    console.log('debug ---CommonWeb2Flow -- ', address)
    await UpdateUserNetwork()
    const result = await fetchNFTsFromDB(address)
    const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
    dispatch(setTotalNFTData(result.message))
    dispatch(setNFTDetails(dataOfNFTS))
    dispatch(setNFTLoadedBool(true))
    dispatch(Login(address))
    dispatch(SetConnectedWeb3(false))
    dispatch(ChangewbtcBalance('0'))
    dispatch(ChangeMaticBalance('0'))

    console.log('debug --- result', result)
    console.log('data of nft', dataOfNFTS)
    if (result?.message.length > 0 && dataOfNFTS.length) {
      const data = result.message[0]
      if (data) {
        store.dispatch(SetShowGameServersList(true))
        store.dispatch(SetCurrentGamePlayer(data))
        store.dispatch(setNickName(data.nick_name))

        const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
        if (!isNullOrUndefined(playerAuthToken)) {
          store.dispatch(setPlayerAuthToken(playerAuthToken))
          const serverList = await ListGameServersApiCall(address, 'Washington_DC')
          if (serverList && serverList?.data && serverList?.data.length > 0) {
            await fetchServerUrlAndConnect(serverList.data[0].room_id)
          }
        } else {
          console.error('failed in authenticating ')
        }
      } else {
        console.error('failed in loading player')
      }
    } else {
      console.error('check this errror')
    }
  }

  async function checkAndDirectPlayer() {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    if (!userAddress) {
      setIsLoading(false)
      return
    }

    console.log('running checkAndDirectPlayer', userAddress)
    try {
      await CommonWeb2Flow(userAddress)
    } catch (err) {
      console.error('running loading some erro', err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    console.log('useEffect fighters new .. running ', userAddress)
    if (userAddress && connectionMode == 'email' && web2EmailAddress && !isLoading && !gameStarted) {
      checkAndDirectPlayer()
    } else if (connectKitProcessed && web2EmailAddress == '' && !isLoading && !gameStarted) {
      freePlayerFlow()
    }
  }, [userAddress, web2EmailAddress, connectKitProcessed, connectionMode])

  async function freePlayerFlow() {
    if (isExecutingRef.current || isLoading) {
      return // Prevent re-execution
    }

    isExecutingRef.current = true
    // if (isLoading) {
    //   return
    // }
    if (gameStarted) {
      return
    }
    setIsLoading(true)
    console.log('executing freePlayerFlow', connectKitProcessed, web2EmailAddress)
    if (connectKitProcessed && web2EmailAddress == '') {
      console.log('executing freePlayerFlow 1')
      let address = localStorage.getItem('web2_wallet_address')
      console.log('executing freePlayerFlow 2 ', address)
      if (isNullOrUndefined(address) || address === '') {
        const randomId = uuidv4()
        localStorage.setItem('web2_wallet_address', randomId)
        address = randomId
      }
      console.log('executing freePlayerFlow 3 ', address)
      const bfs = await Web2LoginNew(address)
      console.log('executing freePlayerFlow 4 ', bfs)
      if (bfs && bfs.length == 0) {
        console.log('executing freePlayerFlow 5 ', bfs)
        const output = await randomGenarateBitfightersV2(address, ethers.constants.AddressZero, 1, 'web2')
        // await randomGenarateDripBitfightersV2(address, ethers.constants.AddressZero, 1, 'web2')
      }
      try {
        await CommonWeb2Flow(address)
      } catch (err) {
        console.error('error in comon web2 flow in freePlayerFlow', err)
      } finally {
        //
        setIsLoading(false)
      }

      // dispatch(Web2LoginV2(address))
      setIsLoading(false)
    }

    setIsLoading(false)
    isExecutingRef.current = false
  }

  useEffect(() => {
    // if (connectKitProcessed && web2EmailAddress)
    // freePlayerFlow()
  }, [])

  const joinAsGuest = async () => {
    const web2Address = localStorage.getItem('web2_wallet_address')
    let web2Id = makeid(50)
    if (web2Address) {
      web2Id = web2Address
    }
    dispatch(Login(web2Id))
    dispatch(ChangeValidUserState(true))
    const auth_token: string = await loginAndAuthenticateUser(web2Id)
    dispatch(ChangeAuthTOken(auth_token))
    localStorage.setItem('web2_wallet_address', web2Id)
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

      if (isGuest.isGuest) {
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
      } else {
        dispatch(ChangewbtcBalance('0'))
        dispatch(ChangeMaticBalance('0'))
        // setMintingBool(false)
        const data = result.message
        store.dispatch(SetShowGameServersList(true))
        store.dispatch(SetCurrentGamePlayer(data))
        store.dispatch(setNickName(data.nick_name))
        const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, 'Washington_DC', 'create')
      }
    }
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))
    fetchSystemWalletsInfo()
    startGame()
  }

  const startGame = async () => {
    if (gameStarted) {
      return
    }
    store.dispatch(SetGameStarted(true))
    localStorage.setItem('game_state', 'start')
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
  }

  return gameStarted ? (
    <>
      <div style={{ height: '100%', display: 'flex' }}>
        <NotificationMessageHelper />
        <Loader />

        <>
          <NotificationMessageHelper />
          <div>{ProfilemenuClicked && <NewMenuSideBar />}</div>
          <Tutorials />
          <ControlsInfo />

          <InventoryView />
          <EquipView />
          <BroadCastCombiner2 />
          <ATMView />
          <ServiceView />
          <InGameAssetPurchase />
          <BroadcastingAnnouncement />
          <Chat />
          <PlayersInfo />
          <QueueAddInfoWindow />
          <NewWinnersReceipt />
          <SendingFriendRequest />
          <Footer />

          <Box>
            <Fab
              size='small'
              sx={{
                position: 'absolute',
                top: ShowMenuBoxRedux ? 50 : 10,
                right: 10,
                width: '20px',
                height: '20px',
              }}
              color={'red'}
            >
              {ShowMenuBoxRedux ? (
                <ChevronRightIcon
                  onClick={() => {
                    store.dispatch(ChangeShowMenuBox(false))
                    // store.dispatch(ChangeShowQueueBox(false));
                  }}
                  style={{
                    fontSize: '16px',
                  }}
                />
              ) : (
                <StyledKeyboardArrowLeftIcon
                  onClick={() => {
                    store.dispatch(ChangeShowMenuBox(true))
                    // store.dispatch(ChangeShowQueueBox(false));
                  }}
                  style={{
                    fontSize: '16px',
                  }}
                />
              )}
            </Fab>
          </Box>
        </>
      </div>
    </>
  ) : (
    <>
      {isLoading ? (
        <AnimatedLoader />
      ) : (
        <>
          <NotificationMessageHelper />
          <Loader />
          <div className='container'>
            <div className='game-player-selection-component'>
              {cardSelected !== '' ? (
                <div className='selected-player-box'>
                  <div className='floating-content'>
                    <img src={cardSelected} alt='' />

                    <h4>
                      {playerSelected?.minted_id ? (playerSelected.minted_id > 0 ? playerSelected?.minted_id : '') : ''} .{' '}
                      {selectedPlayer.nick_name !== '' ? selectedPlayer.nick_name : '?'}
                    </h4>
                  </div>

                  <img src='/floating-light.png' alt='' className='floating-light-img' />
                </div>
              ) : (
                <> </>
              )}
              {cardSelected !== '' && selectedPlayer.nick_name === '' ? (
                <div className='player-register-form'>
                  <h2>Register Your Fighter</h2>

                  <div className='input-part'>
                    <label htmlFor='nick_name'>Name:</label>

                    <input
                      id='nick_name'
                      type='text'
                      placeholder='up to 12 letters'
                      value={formNickNameame}
                      onChange={(e) => {
                        setFormNickName(e.target.value)
                      }}
                      required
                    />
                  </div>

                  <div className='input-part'>
                    <label htmlFor='lucky_number'>Lucky #:</label>

                    <input
                      id='lucky_number'
                      type='text'
                      placeholder='(1-100)'
                      onChange={(e) => {
                        setFormLuckyNumber(parseInt(e.target.value))
                      }}
                      required
                    />
                  </div>

                  {!registerProcessRunning ? (
                    <div
                      onClick={() => {
                        registerFormValidate()
                      }}
                      className='primary-btn-component'
                    >
                      <span className='dot'></span>
                      <span className='dot'></span>
                      <span className='dot'></span>
                      <span className='dot'></span>

                      <div className='content'>
                        <span>Submit</span>
                      </div>
                    </div>
                  ) : (
                    <div className='primary-btn-component'>
                      <span className='dot'></span>
                      <span className='dot'></span>
                      <span className='dot'></span>
                      <span className='dot'></span>

                      <div className='content'>
                        <span>Submitting...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className='two-parts'>
                <div className='players-box'>
                  <div className='h2-wrapper'>
                    <h2 className='text'>Select Fighter</h2>

                    <h2 className='text-stroke'>Select Fighter</h2>

                    <h2 className='text-shadow'>Select Fighter</h2>
                  </div>

                  {bitFighterNFTData.length == 0 && loggedInUserWalletAddress !== '' && bitfightersLoadedBool ? (
                    <>
                      <p>No Bit Fighters detected in this wallet</p>

                      <Link to={'/mint'} className='primary-btn-component'>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>

                        <div className='content'>
                          <span>Mint</span>
                        </div>
                      </Link>
                    </>
                  ) : bitFighterNFTData.length == 0 && loggedInUserWalletAddress !== '' && !bitfightersLoadedBool ? (
                    <>
                      <p>Loading...</p>
                    </>
                  ) : loggedInUserWalletAddress === '' ? (
                    <>
                      <p>Checking for Bit Fighters...</p>
                    </>
                  ) : (
                    <>
                      <div className='player-cards-wrapper'>
                        {bitFightersTotalData.map((data, index) => {
                          return <CommonToolTip key={index} data={data} indexkey={index} />
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className='portable-box'>
                  <div className='selected-player-box-portable'>
                    <div className='floating-content-portable'>
                      <img src={cardSelected} alt='' />
                      <h4>
                        {playerSelected?.minted_id ? (playerSelected.minted_id > 0 ? playerSelected?.minted_id : '') : ''} .{' '}
                        {selectedPlayer.nick_name !== '' ? selectedPlayer.nick_name : '?'}
                      </h4>
                    </div>
                    <img src='floating-light.png' alt='' className='floating-light-img-portable' />
                  </div>
                  <div className='portable-serverlists'>
                    <ServerListPortable />
                  </div>
                </div>
                <ServerListWindow />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default NewFighters
