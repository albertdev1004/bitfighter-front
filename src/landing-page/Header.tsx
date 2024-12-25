// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Row, Col, Container } from 'react-bootstrap'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import { Fab, Tooltip } from '@mui/material'
import Person from '@mui/icons-material/Person'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import { MenuBook, Telegram, YouTube } from '@mui/icons-material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import phaserGame from '../PhaserGame'
import Game from '../game/scenes/Game'
import { Web3Login } from './Web3Login'
import { getEllipsisTxt } from '../utils'
import { getSystemInfo } from '../utils/systemInfo'
import { useAppDispatch, useAppSelector } from '../hooks'

import store from '../stores'
import { LogOut } from '../stores/Web3Store'
import { setNFTLoadedBool } from '../stores/BitFighters'
import { SetLeaderBoardOpen } from '../stores/WebsiteStateStore'
import { SetMouseClickControlHeader } from '../stores/UserActions'
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../stores/UserWebsiteStore'

import '../App.css'

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  font-family: 'Cooper Black', sans-serif;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`

const NavBar = styled.div`
  user-select: none;
  position: relative;
  margin: auto;
  padding: 0;
  left: 0;
  font-family: 'Cooper Black', sans-serif;
`

const PageLink = styled.div`
  font-size: 18px;
  user-select: none;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Cooper Black', sans-serif;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`

const StyledFab = styled(Fab)`
  &:hover {
    color: #1ea2df;
  }
`

declare global {
  interface Window {
    // @ts-ignore: Ignore the error for this specific line
    ethereum?: any
    game?: Game
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

function Header() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game
  const deadline = new Date(2023, 8, 3, 23, 59, 0)

  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  // console.log('debug___header', ethers.utils.getAddress('0x583f89D1d1777C475877919C616F562C2830d57A'))
  const HistoryPath = useAppSelector((state) => state.userPathStore.path)
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const currentServerLatency = useAppSelector((state) => state.metaInfoStore.net_speed)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  const totalConnections = useAppSelector((state) => state.metaInfoStore.total_connections)
  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)

  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const getTime = () => {
    const time = deadline.getTime() - Date.now()
    setHours(Math.floor(time / (1000 * 60 * 60)))
    setMinutes(Math.floor((time / 1000 / 60) % 60))
    setSeconds(Math.floor((time / 1000) % 60))
  }

  const web3LogOut = async () => {
    if (window.confirm('You sure you want to Logout? ')) {
      store.dispatch(setNFTLoadedBool(false))
      Object.keys(localStorage).forEach((key) => {
        // console.log('localstorage debug .. ', key)
        localStorage.removeItem(key)
      })
      dispatch(LogOut())
      localStorage.removeItem('connected_matic_network')
      localStorage.removeItem('last_web3_login_time')
      localStorage.removeItem('last_logged_out')
      localStorage.removeItem('web2_wallet_address')
      localStorage.removeItem('web2_email_address')
      localStorage.removeItem('saw_controls')
      // console.log('logged out ')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  const dropItemListener = (name: string) => {
    // console.log('debug_dropItemListener')
    game.lobbySocketConnection.send(
      JSON.stringify({
        event: 'drop_admin_item',
        walletAddress: store.getState().web3store.userAddress,
        item_id: name,
      }),
    )
  }

  return (
    <div
      style={{ height: 'auto' }}
      onMouseOver={() => {
        dispatch(SetMouseClickControlHeader(true))
      }}
      onMouseOut={() => {
        dispatch(SetMouseClickControlHeader(false))
      }}
    >
      {((HistoryPath == 'gamePlay' && location.pathname.includes('game') && ShowMenuBoxRedux) ||
        (HistoryPath != 'gamePlay' && !location.pathname.includes('game')) ||
        HistoryPath != 'gamePlay') && (
        <nav className='navbar navbar-expand-sm navbar-dark py-0 navbar-custom' style={{ backgroundColor: '#111B28' /*backgroundColor: "#262626",*/ }}>
          <button className='navbar-toggler m-1' type='button' data-bs-toggle='collapse' data-bs-target='.dual-collapse-left'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <button className='navbar-toggler m-1' type='button' data-bs-toggle='collapse' data-bs-target='.dual-collapse-right'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='navbar-collapse collapse flex-grow-0 dual-collapse-left'>
            <ul className='navbar-nav align-items-center'>
              <li className='nav-item mx-1 my-2' key={uuidv4()}>
                <Link className='nav-link' to='/'>
                  <div className='cooper-black-tab user-select-none'>Home</div>
                </Link>
              </li>
              <li className='nav-item mx-1 my-2' key={uuidv4()}>
                <Link className='nav-link' to='/game'>
                  <div className='cooper-black-tab user-select-none'>Game</div>
                </Link>
              </li>
              <li className='nav-item mx-1 my-2' key={uuidv4()}>
                <Link className='nav-link' to='/mint'>
                  <div className='cooper-black-tab user-select-none'>Mint</div>
                </Link>
              </li>
              <li className='nav-item mx-1 my-2' key={uuidv4()}>
                <Link className='nav-link' to='https://joepegs.com/collections/avalanche/bit-fighters-gen-0' target='_blank'>
                  <div className='cooper-black-tab user-select-none'>Marketplace</div>
                </Link>
              </li>
              <li className='nav-item mx-1 my-2' key={uuidv4()}>
                <Link
                  className='nav-link'
                  to='/leaderboard'
                  onClick={(event) => {
                    event.preventDefault()
                    store.dispatch(SetLeaderBoardOpen(true))
                  }}
                >
                  <div className='cooper-black-tab user-select-none'>Leaderboard</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className='navbar-collapse collapse flex-grow-0 dual-collapse-right ms-auto mb-lg-0'>
            <ul className='navbar-nav align-items-center' style={{ marginTop: '0px', marginBottom: '0px' }}>
              <li className='nav-item mx-2 my-3' key={50}>
                <Tooltip title='Read our WhitePaper'>
                  <div style={{ color: '#eee' }}>
                    <a href='https://bitfighters.gitbook.io/readme/' target='_blank'>
                      <MenuBook color='secondary' />
                    </a>
                  </div>
                </Tooltip>
              </li>
              <li className='nav-item mx-2 my-3' key={5}>
                <Tooltip title='Follow Us on Twitter'>
                  <div style={{ color: '#eee' }}>
                    <a href='https://twitter.com/Bit_Fighters' target='_blank'>
                      <TwitterIcon color='primary' />
                    </a>
                  </div>
                </Tooltip>
              </li>
              <li className='nav-item mx-2 my-3' key={uuidv4()}>
                <Tooltip title='Follow Us on Telegram'>
                  <a href='https://t.me/+ThxhkzeHFNA3Mjdh' target='_blank'>
                    <Telegram color='primary' />
                  </a>
                </Tooltip>
              </li>
              <li className='nav-item mx-2 my-3' key={7}>
                <Tooltip title='Hang out at our Discord!'>
                  <div>
                    <a href='https://discord.gg/jhrZ2dDuFz' target='_blank'>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' width='22px' height='22px'>
                        <path
                          fill='#7884CB'
                          d='M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z'
                        />
                      </svg>
                    </a>
                  </div>
                </Tooltip>
              </li>
              <li className='nav-item mx-2 my-3' key={900}>
                <Tooltip title='Subscribe to our Channel!'>
                  <div style={{ color: '#E82A60' }}>
                    <a href='https://www.youtube.com/channel/UCdvCCG7rNJqGcTGnFZaXt_Q' target='_blank'>
                      <YouTube
                        color='secondary'
                        style={{
                          color: '#CC0000',
                        }}
                      />
                    </a>
                  </div>
                </Tooltip>
              </li>
              <li className='nav-item mx-2 my-3' key={9}>
                <Tooltip title='Check out our Instagram!'>
                  <div style={{ color: '#E82A60' }}>
                    <a href='https://www.instagram.com/p/CgukMgEJniM/' target='_blank'>
                      <InstagramIcon
                        color='secondary'
                        style={{
                          color: '#EE698F',
                        }}
                      />
                    </a>
                  </div>
                </Tooltip>
              </li>
              <>
                {userAddress !== '' ? (
                  <div style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', width: '50px', height: '60px' }}>
                    {HistoryPath === 'gamePlay' ? (
                      <li className='nav-item mx-2 my-2 navbar-left dropdown' key={uuidv4()}>
                        <div>
                          <a
                            href='#'
                            onClick={() => {
                              // console.log('clicking on profile pic ', ShowMenuBoxRedux)
                              store.dispatch(ChangeShowMenuBox(!ShowMenuBoxRedux))
                              store.dispatch(ChangeShowQueueBox(false))
                            }}
                          >
                            <img
                              src={selectedPlayer.data.profile_image}
                              className='rounded-circle w-75 h-75'
                              alt='.'
                              style={{
                                objectFit: 'contain',
                              }}
                            ></img>
                            <ArrowDropDownIcon color='action'></ArrowDropDownIcon>
                          </a>
                        </div>
                      </li>
                    ) : (
                      <div className='nav-item navbar-left my-2 dropdown w-100 h-100' key={uuidv4()}>
                        <a className='nav-link dropdown-toggle w-100 h-100' href='#' id='navbarDropdown' role='button' data-toggle='dropdown'>
                          {bitFightersTotalData.length > 0 && bitFightersTotalData[0].data && bitFightersTotalData[0].data.profile_image ? (
                            <img
                              src={bitFightersTotalData[0].data.profile_image}
                              className='rounded-circle w-75 h-75'
                              alt='Cinque Terre'
                              style={{
                                objectFit: 'contain',
                              }}
                            ></img>
                          ) : (
                            <img
                              src={parisImgUrl}
                              className='rounded-circle w-75 h-75'
                              alt='Cinque Terre'
                              style={{
                                objectFit: 'contain',
                              }}
                            ></img>
                          )}
                        </a>
                        <ul
                          style={{ position: 'absolute', right: '1%' }}
                          className='dropdown-menu dropdown-menu-end'
                          aria-labelledby='navbarDropdown'
                          onClick={(event) => event.preventDefault()}
                        >
                          <li onClick={(event) => event.preventDefault()}>
                            <a className='dropdown-item' href='#'>
                              {' '}
                              Connected Wallet{' '}
                            </a>
                          </li>
                          <li onClick={(event) => event.preventDefault()}>
                            <a className='dropdown-item' href='#' key={2}>
                              <span style={{ color: 'red' }}>{getEllipsisTxt(userAddress)}</span>{' '}
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', marginRight: '0px', marginTop: '0px' }} className='m-2'>
                    <button type='button' className='btn btn-outline-info' onClick={() => Web3Login()}>
                      Connect
                    </button>
                  </div>
                )}
              </>
              {userAddress !== '' ? (
                <div className='m-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button type='button' className='btn btn-outline-danger' onClick={() => web3LogOut()}>
                    LogOut
                  </button>
                </div>
              ) : (
                <li className='nav-item'></li>
              )}
              <li className='nav-item' key={999999999} />
              {HistoryPath === 'gamePlay' ? (
                <>
                  <li className='nav-item' key={uuidv4()} style={{ justifyContent: 'center', lineHeight: 4 }}>
                    <Tooltip title='Server Latency' style={{ color: 'grey' }}>
                      <NetworkCheckIcon />
                    </Tooltip>
                  </li>
                  <li className='nav-item' key={uuidv4()} style={{ color: 'grey', lineHeight: 4 }}>
                    {currentServerLatency.toString() + 'ms'}
                  </li>
                  <li className='nav-item' key={uuidv4()} style={{ color: 'grey', lineHeight: 4 }}>
                    <div>
                      <Tooltip title='Online Players' style={{ color: 'grey' }}>
                        <Person />
                      </Tooltip>
                      {totalConnections.toString()}
                    </div>
                  </li>
                  {((store.getState().web3store.web3Connected &&
                    (ethers.utils.getAddress(store.getState().web3store.userAddress) == ethers.utils.getAddress('0xB4c2D38ca5382b565cb9e8F849Da42d8E441B59e') || // 0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e
                      ethers.utils.getAddress(store.getState().web3store.userAddress) ==
                        ethers.utils.getAddress('0x583f89D1d1777C475877919C616F562C2830d57A'))) ||
                    store.getState().web3store.userAddress === '6f7f2b33-cf3a-4a45-a3c3-476a66915a26') && (
                    <li className='nav-item' key={uuidv4()} style={{ color: 'grey', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                      <li className='nav-item' key={uuidv4()}>
                        <Link className='nav-link' to='/game'>
                          <li className='dropdown'>
                            <div className='cooper-black-tab'>SUPER ADMIN MENU &#9662;</div>
                            <ul className='dropdown-menu'>
                              <li>
                                <a href='#' onClick={() => dropItemListener('admin_coin')}>
                                  Drop 10 Coins
                                </a>
                              </li>
                              <li>
                                <a
                                  href='#'
                                  onClick={() =>
                                    game.lobbySocketConnection.send(
                                      JSON.stringify({
                                        event: 'drop_admin_item',
                                        walletAddress: store.getState().web3store.userAddress,
                                        room_id: 'lobby',
                                        message: 'brew',
                                        item_id: 'admin_brew',
                                      }),
                                    )
                                  }
                                >
                                  Drop a Brew
                                </a>
                              </li>
                              <li>
                                <a
                                  href='#'
                                  onClick={() =>
                                    game.lobbySocketConnection.send(
                                      JSON.stringify({
                                        event: 'drop_admin_item',
                                        walletAddress: store.getState().web3store.userAddress,
                                        room_id: 'lobby',
                                        message: 'bit',
                                        item_id: 'admin_bit',
                                      }),
                                    )
                                  }
                                >
                                  Drop a Bit
                                </a>
                              </li>
                            </ul>
                          </li>
                        </Link>
                      </li>
                    </li>
                  )}
                </>
              ) : (
                <></>
              )}
              <li key={uuidv4()}>
                <div style={{ width: 5 }}></div>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </div>
  )
}

export default Header
