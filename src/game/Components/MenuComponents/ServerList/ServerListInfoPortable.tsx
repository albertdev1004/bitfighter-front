// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isNullOrUndefined } from 'util'
import { Label } from '@mui/icons-material'
import { Container, Row, Col } from 'react-bootstrap'
import { Box, Button, FormControl, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'

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

const VALID_REGIONS = [
  { name: 'Mumbai', code_name: 'India', lat: 19.076, lon: 72.8777 },
  { name: 'Washington_DC', code_name: 'US_East', lat: 38.8954, lon: -77.0365 },
  { name: 'Singapore', code_name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Frankfurt', code_name: 'Europe', lat: 50.1109, lon: 8.6821 },
  { name: 'Johannesburg', code_name: 'Africa', lat: -26.2041, lon: 28.0473 },
]

function getServerNameForDisplay(region: string) {
  for (let i = 0; i < VALID_REGIONS.length; i++) {
    if (region == VALID_REGIONS[i].name) {
      return VALID_REGIONS[i].code_name
    }
  }
  return region
}

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
      </div>
    </div>
  )
}
