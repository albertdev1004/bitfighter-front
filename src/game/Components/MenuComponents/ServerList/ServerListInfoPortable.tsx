// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Box, Button, FormControl, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isNullOrUndefined } from 'util'
import { Label } from '@mui/icons-material'
import { Container, Row, Col } from 'react-bootstrap'

import './ServerListInfo.css'
import styled from 'styled-components'
import store from '../../../../stores'
import phaserGame from '../../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'
import { useAppSelector } from '../../../../hooks'
import { getEllipsisTxt } from '../../../../utils'
import { SetGameStarted } from '../../../../stores/PlayerData'
import { WaveLoader } from '../../../../landing-page/components/WaveLoader/WaveLoader'
import { FetchGameServerConnection, fetchSystemWalletsInfo, ListGameServers } from '../../../../utils/game_server_utils'
import {
  SetGameLoadingState,
  SetGameServersData,
  SetSelectedRegionofGameServer,
  SetSelectedRoomId,
  SetShowGameServersList,
} from '../../../../stores/WebsiteStateStore'

const ButtonView = styled.button`
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  span {
    color: #a7a5a5;
    // font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black';
    text-transform: uppercase;
  }
  width: 100%;
`

const BoxWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
  }

  p {
    color: #808080;
  }
`

const MyDivider = styled.div`
  border: 1px solid #000000;
  margin-bottom: 10px;
`

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
    justify-content: center;
    align-items: center;
  }
`

export function ServerListInfoPortable() {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const gameServersInfo = useAppSelector((state) => state.websiteStateStore.serversInfo)
  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)
  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)

  const SelectGameServerAndLoadInfo = async (region: string) => {
    store.dispatch(SetGameServersData([]))
    ListGameServers(region)
    store.dispatch(SetSelectedRegionofGameServer(region))
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    // console.log(room_id)
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))
    fetchSystemWalletsInfo()
    startGame()
  }

  const startGame = async () => {
    store.dispatch(SetGameStarted(true))
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
    store.dispatch(SetShowGameServersList(false))
  }

  return (
    <div className='servers-box-portable'>
      <div className='h2-wrapper-portable'>
        <h2 className='text-portable'>World Servers</h2>
      </div>
      {/* <div className='select-wrapper'>
        <Select
          id='demo-simple-select'
          value={gameServerReginoSelected}
          onChange={(event: SelectChangeEvent) => {
            SelectGameServerAndLoadInfo(event.target.value as string)
          }}
          style={{
            width: 'auto',
          }}
        >
          <MenuItem value={'Washington_DC'}>US-East</MenuItem>
          <MenuItem value={'Mumbai'}>India</MenuItem>
          <MenuItem value={'Singapore'}>Singapore</MenuItem>
        </Select>
      </div> */}
      <div className='select-wrapper-portable'>
        {gameServersInfo && gameServersInfo.length > 0 ? (
          gameServersInfo.map((serverinfo, index) => {
            return (
              <p key={index} onClick={() => fetchServerUrlAndConnect(serverinfo.room_id)}>
                {getServerNameForDisplay(serverinfo.region)}
              </p>
            )
          })
        ) : Object.keys(selectedPlayer).length > 0 ? (
          <p>Loading...</p>
        ) : (
          <p>Choose a fighter to load game servers</p>
        )}
        {/* <p key={'Mumbai'}>India</p>
        <p key={'Singapore'}>Singapore</p>
        <p key={'Singapore1'}>Singapore1</p>
        <p key={'Singapore2'}>Singapore2</p>
        <p key={'Singapore3'}>Singapore3</p>
        <p key={'Singapore4'}>Singapore4</p>
        <p key={'Singapore5'}>Singapore5</p>
        <p key={'Singapore6'}>Singapore6</p>
        <p key={'Singapore7'}>Singapore7</p> */}
      </div>

      {/* {gameServersInfo && gameServersInfo.length > 0 ? (
        gameServersInfo.map((serverinfo, index) => {
          return (
            <div key={index} className='server-card'>
              <p>{index + 1}</p>

              <div className='server-info'>
                <p>{`${getServerNameForDisplay(serverinfo.region)} - ${serverinfo.active_users} / 50`}</p>
                <p>{getEllipsisTxt(serverinfo.room_id)}</p>
              </div>

              <div
                onClick={() => {
                  fetchServerUrlAndConnect(serverinfo.room_id)
                }}
                className='primary-btn-component'
              >
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <div className='content'>
                  <span>Connect</span>
                </div>
              </div>
            </div>
          )
        })
      ) : Object.keys(selectedPlayer).length > 0 ? (
        <p>Loading...</p>
      ) : (
        <p>Choose a fighter to load game servers</p>
      )} */}
    </div>
  )
}

function getServerNameForDisplay(region: string) {
  if (region === 'Washington_DC') {
    return 'US_East'
  }
  if (region === 'Mumbai') {
    return 'India'
  }
  if (region === 'Singapore') {
    return 'Singapore'
  }
}
