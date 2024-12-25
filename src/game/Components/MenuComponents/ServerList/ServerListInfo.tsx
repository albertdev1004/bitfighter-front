// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Box, Button, FormControl, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useAppSelector } from '../../../../hooks'
import './ServerListInfo.css'
import { getEllipsisTxt } from '../../../../utils'
import { FetchGameServerConnection, fetchSystemWalletsInfo, ListGameServers } from '../../../../utils/game_server_utils'
import store from '../../../../stores'
import {
  SetGameLoadingState,
  SetGameServersData,
  SetSelectedRegionofGameServer,
  SetSelectedRoomId,
  SetShowGameServersList,
} from '../../../../stores/WebsiteStateStore'
import { SetGameStarted } from '../../../../stores/PlayerData'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../../PhaserGame'



const VALID_REGIONS = [
  { name: "Mumbai", code_name: "India", lat: 19.0760, lon: 72.8777 },
  { name: "Washington_DC", code_name: "US_East", lat: 38.8954, lon: -77.0365 },
  { name: "Singapore", code_name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Frankfurt", code_name: "Europe", lat: 50.1109, lon: 8.6821 },
  { name: "Johannesburg", code_name: "Africa", lat: -26.2041, lon: 28.0473 }
];

function getServerNameForDisplay(region: string) {
  for (let i = 0; i < VALID_REGIONS.length; i++) {
    if (region == VALID_REGIONS[i].name) {
      return VALID_REGIONS[i].code_name
    }
  }
  return region
}

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert to radians

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const findNearestServer = (playerLat, playerLon, regions) => {
  let nearestRegion = null;
  let minDistance = Infinity;

  regions.forEach(region => {
    const distance = haversine(playerLat, playerLon, region.lat, region.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestRegion = region;
    }
  });

  return nearestRegion;
};

export function ServerListInfo() {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const gameServersInfo = useAppSelector((state) => state.websiteStateStore.serversInfo)

  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)
  const selectedPlayerName = useAppSelector((state) => state.playerDataStore.nick_name)

  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  console.log('game servers info --', gameServersInfo)

  // console.log("debug_selected_player ", selectedPlayer)
  const SelectGameServerAndLoadInfo = async (region: string) => {
    store.dispatch(SetGameServersData([]))
    ListGameServers(region)
    console.log('in SelectGameServerAndLoadInfo', region)
    store.dispatch(SetSelectedRegionofGameServer(region))
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
    store.dispatch(SetShowGameServersList(false))
  }


  return (
    <div className='servers-box'>
      <div className='h2-wrapper'>
        <h2 className='text'>World Servers</h2>

        <h2 className='text-stroke'>World Servers</h2>

        <h2 className='text-shadow'>World Servers</h2>
      </div>

      <p className='top-desc'>Please connect to your nearest world server for best experience</p>

      <div className='select-wrapper'>
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
          <MenuItem value={'Johannesburg'}>Africa</MenuItem>
          <MenuItem value={'Frankfurt'}>Europe</MenuItem>
        </Select>
      </div>

      {gameServersInfo && gameServersInfo.length > 0 && selectedPlayerName != "" ? (
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
      )}
    </div>
  )
}






