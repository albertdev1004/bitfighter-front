'use client'

import React, { useEffect, useState } from 'react'

import { ConnectKitProvider, createConfig, useAccount } from '@particle-network/connectkit'
import { useConnect } from '@particle-network/authkit'
import { UserInfo } from '@particle-network/auth-core'
import store from '@/stores'
import { Login, LogOut, SetConnectedNetwork, SetConnectedWeb3, SetConnectionMode, SetConnectKitProcessed, Web2Login, Web2LoginV2 } from '@/stores/Web3Store'
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '@/stores/BitFighters'
import { useAppDispatch } from '@/hooks'
import { checkIfUserSignedMetamask, fetchNFTsFromDB, ListGameServersApiCall, loginAndAuthenticatePlayer, loginAndAuthenticateUser, postUserSignedMessage, randomGenarateBitfightersV2, updateNFTsInDB, UpdateUserNetwork } from '@/hooks/ApiCaller'
import { SignatureMessage, siweSign, Web3LoginV2 } from '../Web3Login'
import { ChangeAuthTOken, ChangeMaticBalance, ChangeValidUserState, ChangewbtcBalance } from '@/stores/UserWebsiteStore'
import { ReaderFunctions } from '@/contract/ReaderFunctions'
import { fetchAllNFTsFromDbEntries } from '@/hooks/FetchNFT'
import { FetchPresaleInfoMintedByUser, getBalances, updateBitfightersMintedCountAndTotal, updateOneKClubMintedCount, updatePresaleMintedCount } from '@/utils/web3_utils'
import { Web2LoginNew } from '../Web2Login'
import { ethers } from 'ethers'
import { isNullOrUndefined } from 'util'
import { SetGameLoadingState, SetGameServersData, SetSelectedRoomId, SetShowGameServersList } from '@/stores/WebsiteStateStore'
import { SetCurrentGamePlayer, SetGameStarted, setNickName } from '@/stores/PlayerData'
import { setPlayerAuthToken } from '@/stores/AuthStore'
import { FetchGameServerConnection, fetchSystemWalletsInfo, ListGameServers } from '@/utils/game_server_utils'
import phaserGame from '@/PhaserGame'
import Bootstrap from '@/game/scenes/Bootstrap'
import AnimatedLoader from '@/revamped/loader/AnimatedLoader'

const { EntryPosition, wallet } = require('@particle-network/connectkit/dist/cjs/exports/plugins/wallet.cjs')
const { authWalletConnectors } = require('@particle-network/connectkit/dist/cjs/exports/connectors/auth.cjs')
const { syncUserInfo } = require("@particle-network/auth-core")
const { solanaWalletConnectors, injected: solaInjected } = require('@particle-network/connectkit/dist/cjs/exports/connectors/solana.cjs')
const { evmWalletConnectors, coinbaseWallet, injected, walletConnect } = require('@particle-network/connectkit/dist/cjs/exports/connectors/evm.cjs')
const {
  mainnet,
  holesky,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  linea,
  lineaSepolia,
  bsc,
  bscTestnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  bob,
  solana,
  solanaTestnet,
  solanaDevnet,
  arbitrumNova,
} = require('@particle-network/connectkit/dist/cjs/exports/chains.cjs')

const projectId = process.env.REACT_APP_PROJECT_ID as string
const clientKey = process.env.REACT_APP_CLIENT_KEY as string
const appId = process.env.REACT_APP_APP_ID as string
const walletConnectProjectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string

if (!projectId || !clientKey || !appId) {
  throw new Error('Please configure the Particle project in .env first!')
}

const config = createConfig({
  projectId: projectId,
  clientKey: clientKey,
  appId: appId,
  appearance: {
    recommendedWallets: [
      { walletId: 'metaMask', label: 'Recommended' },
      { walletId: 'coinbaseWallet', label: 'Popular' },
      { walletId: 'okxWallet', label: 'none' },
      { walletId: 'phantom', label: 'none' },
      { walletId: 'trustWallet', label: 'none' },
      { walletId: 'bitKeep', label: 'none' },
      { walletId: 'walletConnect', label: 'none' },
    ],
    theme: {
      // Modal
      '--pcm-overlay-background': 'rgba(0, 0, 0, 0.85)', // Dark, near-black overlay
      '--pcm-overlay-backdrop-filter': 'blur(8px)', // Slightly more intense blur
      '--pcm-modal-box-shadow': '0px 0px 12px rgba(0, 255, 0, 0.5)', // Green glowing shadow for a hacker vibe

      // Background
      '--pcm-body-background': '#001f00', // Dark greenish-black background
      '--pcm-body-background-secondary': '#002800', // Slightly lighter dark green
      '--pcm-body-background-tertiary': '#003300', // Another variation of dark green

      // Foreground
      '--pcm-body-color': '#00ff00', // Bright green text
      '--pcm-body-color-secondary': '#00cc00', // Slightly darker green text
      '--pcm-body-color-tertiary': '#009900', // Even darker green text

      '--pcm-body-action-color': '#00ff00', // Bright green action color
      '--pcm-accent-color': '#00ff00', // Bright green accent color
      '--pcm-focus-color': '#00ff00', // Bright green focus color

      // Button
      '--pcm-button-font-weight': '500',
      '--pcm-button-hover-shadow': '0px 0px 8px rgba(0, 255, 0, 0.5)', // Green glowing shadow on hover
      '--pcm-button-border-color': '#00ff00', // Bright green border for buttons

      // Primary Button
      '--pcm-primary-button-color': '#000000', // Black text on buttons (to contrast bright background)
      '--pcm-primary-button-bankground': '#00ff00', // Bright green background for primary buttons
      '--pcm-primary-button-hover-background': '#00cc00', // Slightly darker green on hover

      // Font
      '--pcm-font-family': `monospace, 'Courier New', Courier, 'Segoe UI', Helvetica, Arial, sans-serif`, // Monospace font for a hacker style

      // Radius
      '--pcm-rounded-sm': '6px', // Keep the original rounded values
      '--pcm-rounded-md': '12px',
      '--pcm-rounded-lg': '18px',
      '--pcm-rounded-xl': '24px',
      '--pcm-rounded-full': '9999px',

      '--pcm-success-color': '#00ff00', // Bright green for success
      '--pcm-warning-color': '#ffcc00', // Yellow for warning
      '--pcm-error-color': '#ff0000', // Red for error

      '--pcm-wallet-lable-color': '#00ff00', // Bright green label color for wallets
    },
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: false,
    connectorsOrder: ['email', 'phone', 'social', 'wallet'],
    language: 'en-US',
    collapsePasskeyButton: true,
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: 'My App' },
      connectorFns: [
        injected({ target: 'metaMask' }),
        injected({ target: 'okxWallet' }),
        injected({ target: 'phantom' }),
        injected({ target: 'trustWallet' }),
        injected({ target: 'bitKeep' }),
        walletConnect({
          showQrModal: false,
        }),
        coinbaseWallet(),
      ],
      multiInjectedProviderDiscovery: true,
    }),

    authWalletConnectors({
      authTypes: [
        'google',
        'apple',
        // 'github',
        'facebook',
        // 'twitter',
        //  'microsoft',
        //  'discord',
        //  'twitch',
        //  'linkedin',
        //  'phone',
        'email',
      ],
      fiatCoin: 'USD',
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1,
        promptPaymentPasswordSettingWhenSign: 1,
      },
    }),

    // solanaWalletConnectors({
    //   connectorFns: [
    //     solaInjected({ target: 'coinbaseWallet' }),
    //     solaInjected({ target: 'okxWallet' }),
    //     solaInjected({ target: 'phantom' }),
    //     solaInjected({ target: 'trustWallet' }),
    //     solaInjected({ target: 'bitKeep' }),
    //   ],
    // }),
  ],
  plugins: [
    wallet({
      entryPosition: 'bottom-right' as EntryPosition,
      visible: true,
      customStyle: {
        supportAddToken: true,
        supportChains: [
          { id: 1, name: 'Ethereum' },
          { id: 5, name: 'Ethereum' },
          { id: 56, name: 'BSC' },
          { id: 97, name: 'BSC' },
        ],
        evmSupportWalletConnect: true,
        supportUIModeSwitch: false,
        supportLanguageSwitch: false,
        priorityTokenAddresses: [''],
        priorityNFTContractAddresses: [''],
        light: {
          colorAccent: '#F23892',
          colorPrimary: '#ffffff',
          colorOnPrimary: '#ffffff',
          primaryButtonBackgroundColors: ['#F23892', '#F23892'],
          primaryButtonTextColor: '#ffffff',
          primaryIconButtonBackgroundColors: ['#dfe9fd', '#dfe9fd'],
          primaryIconTextColor: '#F23892',
          cancelButtonBackgroundColor: '#666666',
          backgroundColors: [
            '#e5e5e5',
            [
              ['#ffffff00', '#ffffff00'],
              ['#ffffff00', '#ffffff00'],
            ],
          ],
          messageColors: ['#7DD5F9', '#ed5d51'],
          borderGlowColors: ['#7bd5f940', '#323233'],
          modalMaskBackgroundColor: '#141430b3',
        },
        dark: {
          colorAccent: '#7DD5F9',
          colorPrimary: '#21213a',
          colorOnPrimary: '#171728',
          primaryButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
          primaryIconButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
          primaryIconTextColor: '#FFFFFF',
          primaryButtonTextColor: '#0A1161',
          cancelButtonBackgroundColor: '#666666',
          backgroundColors: [
            '#14152e',
            [
              ['#e6b1f766', '#e6b1f700'],
              ['#7dd5f94d', '#7dd5f900'],
            ],
          ],
          messageColors: ['#7DD5F9', '#ed5d51'],
          borderGlowColors: ['#7bd5f940', '#323233'],
          modalMaskBackgroundColor: '#141430b3',
        },
      },
    }),
  ],
  chains: [
    // mainnet,
    // solana,
    // solanaTestnet, 
    avalanche,
    bob
  ],
})

function WalletInfo() {
  const dispatch = useAppDispatch();
  const { address, chain, status } = useAccount()
  const [web2UserInfo, setweb2UserInfo] = useState()

  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  const [connectedAddresses, setConnectedAddresses] = useState<string[]>([])

  const [web2Loading, setWeb2Loading] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)

  const web3SemiLogOut = async () => {
    store.dispatch(setNFTLoadedBool(false))
    dispatch(LogOut())
    localStorage.removeItem('connected_matic_network')
    localStorage.removeItem('last_web3_login_time')
    localStorage.removeItem('last_logged_out')
    localStorage.removeItem('web2_wallet_address')
    localStorage.removeItem('web2_email_address')
  }

  const handleSelectNetwork = (network: string) => {
    store.dispatch(SetConnectedNetwork(network))
    localStorage.setItem("network_connected", network)
    // console.log("debug .. bf network address ", GetBFContractAddress(), GetGameLogicContractAddress())
    web3SemiLogOut()
    setTimeout(() => {
      UpdateUserNetwork()
    }, 400)

  };

  async function web3_login(address: string) {
    const userMetamaskSigned = await checkIfUserSignedMetamask(address);
    if (!userMetamaskSigned) {
      const signedRes = await siweSign([address], SignatureMessage);
      if (signedRes === "Error") {
        window.alert("Failed Metamask signature. Without that you cannot play.");
        return;
      }
      postUserSignedMessage(address, signedRes);
    }
    localStorage.setItem("connected_matic_network", "10");
    localStorage.setItem("last_web3_login_time", (new Date()).toISOString())

    // if (!validation(address)) {
    //   store.dispatch(ChangeValidUserState(false));
    //   return;
    // }
    store.dispatch(Login(address));
    store.dispatch(Login(address));
    store.dispatch(SetConnectedWeb3(true));
    // store.dispatch(setCardState(PageStates.ProgressState));
    store.dispatch(ChangeValidUserState(true));

    // check if user owns 1k club card - prod

    const auth_token: string = await loginAndAuthenticateUser(address);
    store.dispatch(ChangeAuthTOken(auth_token));

    await UpdateUserNetwork()

    const rc = new ReaderFunctions();
    const fetchTokensOfUserFromSC = await rc.fetchTokenOfUserFromSC();

    let result = await fetchNFTsFromDB(address);
    // console.log("______debug_tokenIds____web2__ ", result.message.length);
    // if mismatch. then call. the update function.
    if (result.message.length !== fetchTokensOfUserFromSC.length) {
      if (
        !(
          store.getState().web3store.userAddress === "0x49d318a4f85936fe49d86c0c5a0633bc27ec480c"
          || store.getState().web3store.userAddress === "0x854b7f5dc5e6a96c076a0fae6d5c8dc334a2dd77"
          // || store.getState().web3store.userAddress === "0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e"
        )
      ) {
        await updateNFTsInDB(address);
      }
    }
    result = await fetchNFTsFromDB(address);

    const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message);
    store.dispatch(setTotalNFTData(result.message));
    store.dispatch(setNFTDetails(dataOfNFTS));
    store.dispatch(setNFTLoadedBool(true));


    await getBalances(store.getState().web3store.userAddress);

    // update nfts infos
    await updateBitfightersMintedCountAndTotal();
    await updatePresaleMintedCount();
    await updateOneKClubMintedCount();
    await FetchPresaleInfoMintedByUser();
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))
    fetchSystemWalletsInfo()
    startGame()
  }

  const startGame = async () => {
    store.dispatch(SetGameStarted(true))
    localStorage.setItem('game_state', 'start')
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
  }

  async function listNftAndStartGame(emailAddress: string) {
    const result = await fetchNFTsFromDB(emailAddress)
    console.log("particle debug ---- bfs 3---", result)
    const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
    console.log("particle debug ---- bfs 4---", dataOfNFTS)
    dispatch(setTotalNFTData(result.message))
    dispatch(setNFTDetails(dataOfNFTS))
    dispatch(setNFTLoadedBool(true))
    dispatch(Login(emailAddress))
    dispatch(SetConnectedWeb3(false))
    dispatch(ChangewbtcBalance('0'))
    dispatch(ChangeMaticBalance('0'))
    // setMintingBool(false)


    //
    const data = result.message[0]

    console.log("particle debug ---- bfs 5---", data)
    store.dispatch(SetShowGameServersList(true))
    store.dispatch(SetCurrentGamePlayer(data))
    store.dispatch(setNickName(data.nick_name))




    const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
    console.log("particle debug ---- bfs 6---", playerAuthToken)
    if (!isNullOrUndefined(playerAuthToken)) {
      store.dispatch(setPlayerAuthToken(playerAuthToken))
      const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, "Washington_DC")
      console.log("particle server list -- ", serverList.data)
      if (serverList && serverList?.data && serverList?.data.length > 0) {
        await fetchServerUrlAndConnect(serverList.data[0].room_id)
      }
    }
  }

  async function syncUser() {

    // setweb2UserInfo()
    if (web2Loading) {
      return
    }
    setWeb2Loading(true)
    try {
      const web2UserDetail = await syncUserInfo()
      // console.log("particle debug 3 ", web2UserDetail)
      let emailAddress = ''
      if (web2UserDetail?.google_email) {
        // google sign in
        emailAddress = web2UserDetail?.google_email
      } else if (web2UserDetail?.facebook_email) {
        // fb sign in
        emailAddress = web2UserDetail?.facebook_email
      } else if (web2UserDetail?.apple_email) {
        // apple sign in
        emailAddress = web2UserDetail?.apple_email
      } else if (web2UserDetail?.email) {
        // email sign in
        emailAddress = web2UserDetail?.email
      }
      // console.log("particle debug 4 ", emailAddress)
      if (emailAddress !== "") {
        setWeb2Loading(true)
        // assuming unique address ... 
        const bfs = await Web2LoginNew(emailAddress)
        console.log("particle debug ---- bfs ---", bfs)
        localStorage.setItem('web2_wallet_address', emailAddress)
        dispatch(Web2LoginV2(""))

        dispatch(SetConnectKitProcessed(true))

        if (bfs && bfs.length == 0) {
          //
          setWeb2Loading(true)
          setTimeout(async () => {
            setWeb2Loading(true)
            // await UpdateUserNetwork()
            const output = await randomGenarateBitfightersV2(emailAddress, ethers.constants.AddressZero, 1, 'web2')
            console.log("particle debug ---- bfs 2---", output)


            if (!isNullOrUndefined(output)) {
              dispatch(Web2LoginV2(emailAddress))
              dispatch(SetConnectionMode("email"))
              setTimeout(() => {
                window.location.reload()
              }, 500)
              // list and start 
              // await listNftAndStartGame(emailAddress)
            }
            setWeb2Loading(false)
          }, 1000)
        } else if (bfs && bfs.length > 0) {
          dispatch(Web2LoginV2(emailAddress))
          dispatch(SetConnectionMode("email"))
        }
      }
    } catch (err) {
      console.error("error syncuser", err)
      // then for sure web3 is connected
      console.log('ParticleConnectkit useeffect -- ', address, chain, status,)
      let selectedChain = ''
      if (chain?.name == "Avalanche") {
        selectedChain = "AVALANCHE"
      }
      if (chain?.name == "BOB") {
        selectedChain = "BOB"
      }
      if (selectedChain == "") {
        setWeb2Loading(false)
        return
      }
      //
      store.dispatch(SetConnectedNetwork(selectedChain))
      localStorage.setItem("network_connected", selectedChain)
      //

      await Web3LoginV2(address)
      dispatch(SetConnectKitProcessed(true))

    } finally {
      setWeb2Loading(false)

      dispatch(SetConnectKitProcessed(true))


    }



  }

  useEffect(() => {
    console.log('ParticleConnectkit useeffect ***-- ', status)
    if (status == 'connecting') {
      setApiLoading(true)
    } else {
      setApiLoading(false)
    }
    syncUser()
    // if (status === 'connected' && address) {
    //   setConnectedAddresses((prevAddresses) => (prevAddresses.includes(address) ? prevAddresses : [...prevAddresses, address]))
    // }
  }, [status, address, chain])



  console.log("useConnect --- debug -- ",)
  return (
    <div>
      {(web2Loading || apiLoading) && <AnimatedLoader />}
    </div>
  )
}

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ConnectKitProvider config={config}>
        {children}
        <WalletInfo />
      </ConnectKitProvider>
    </>
  )
}
