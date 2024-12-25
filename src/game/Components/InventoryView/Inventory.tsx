// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Box, Button, Grid } from '@mui/material'
import { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { useAppSelector } from '../../../hooks'
import Game from '../../scenes/Game'
import phaserGame from '../../../PhaserGame'
import store from '../../../stores'
import { useAssetsApi } from '../../../hooks/ApiCaller'
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from '../../../stores/NotificationStore'
import { SetEquippedBrewCount } from '../../../stores/AssetStore'
import { SetMouseClickControlInventory } from '../../../stores/UserActions'

import brew from '../../../assets/bitfgihter_assets/brew/brew.png'
import emptybrew from '../../../assets/bitfgihter_assets/brew/empty-brew.png'

const Bag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background: #dfeefc;
  border: 1px solid #000000;
  opacity: 0.9;
  background-color: #3b3b3b;
  padding: 6px;
  span {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }
  h2,
  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 100%;
  }
  width: 100%;
  @media (max-width: 768px) {
    h2,
    h3 {
      font-size: 12px;
    }
  }
`

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background: #dfeefc;
  border: 1px solid #000000;
  opacity: 0.9;
  background-color: #3b3b3b;
  padding: 2px;
  span {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }
  h2,
  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }
  &:hover {
    background-color: #852d17;
  }
  width: 100%;
`
const ButtonGroupView = styled.div`
  border: 1px solid #000000;
  background-color: #3b3b3b;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  button {
    width: 100px;
    background-color: #9c341a;
    color: aliceblue;
    border-radius: 5px;
    &:hover {
      background-color: #852d17;
    }
  }

  @media (max-width: 768px) {
    button {
      width: 30px; /* Adjust to fit smaller screens */
      font-size: 8px;
      minwidth: 30px;
    }
  }
`

const ItemInfo = styled.div`
  font-family: 'Arial', sans-serif;
  font-size: 12px;
  color: white;
  text-align: left; /* Align the text to the right */
  padding-right: 2px;
  // padding-left: 2px;
  @media (max-width: 768px) {
    font-size: 8px;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap; /* Ensures the message doesn't overlap */
  }
`

export function Inventory(data: any) {
  const brewArr = []
  const nonBrewArrMap: any[] = []
  const emptyArray = []
  for (let i = 0; i < data.assetsInfo.length; i++) {
    const tempAsset = data.assetsInfo[i]
    for (let j = 0; j < tempAsset.active_assets; j++) {
      brewArr.push(0)
    }
  }
  for (let i = 0; i < 9 - (brewArr.length + nonBrewArrMap.length); i++) {
    emptyArray.push(0)
  }
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  return (
    <div
      style={{
        height: '100%',
        width: '112px',
        display: 'flex',
        position: 'fixed', // Fixed position to stay relative to the screen
        top: `${ShowMenuBoxRedux ? '117px' : '68px'}`, // Center vertically
        left: '3px', // Center horizontally
        // transform: 'translate(-50%, -20%)', // Adjust to make the top-left corner centered
        zIndex: 1000, // Ensure the inventory is on top
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Bag>
              <h2> Inventory </h2>
            </Bag>
          </Grid>
          {brewArr.map((el, index) => (
            <Grid item xs={4} key={index}>
              <Item>
                <img
                  src={brew}
                  alt='.'
                  height='35'
                  width='15'
                  onMouseDown={() => {
                    data.setShowButtonGroupBool(!data.showButtonGroupBool)
                  }}
                  key={uuidv4()}
                />
              </Item>
            </Grid>
          ))}
          {nonBrewArrMap.map((el) => (
            <Grid item xs={4} key={uuidv4()}>
              <Item>
                <img src={emptybrew} alt='.' height='35' width='15' />
              </Item>
            </Grid>
          ))}
          {emptyArray.map(() => (
            <Grid item xs={4} key={uuidv4()}>
              <Item>
                <img
                  style={{
                    height: '35px',
                    width: '15px',
                  }}
                  height='35'
                  width='15'
                  alt=''
                />
              </Item>
            </Grid>
          ))}
        </Grid>
        {data.showButtonGroupBool && (
          <ButtonGroupView>
            <Box sx={{ flexGrow: 1 }} style={{ padding: '2px' }}>
              <Grid container spacing={2} style={{ padding: '2px' }}>
                {/* Left side with buttons */}
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Button
                        variant='contained'
                        color='info'
                        style={{ minWidth: '50px' }}
                        onClick={async (event: any) => {
                          event.preventDefault()
                          await data.useBrew()
                          data.setShowButtonGroupBool(false)
                        }}
                      >
                        Use
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant='contained'
                        color='info'
                        style={{ minWidth: '50px' }}
                        onClick={async (event: any) => {
                          event.preventDefault()
                          await data.equipBrew()
                          data.setShowButtonGroupBool(false)
                        }}
                      >
                        Equip
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <ItemInfo>Drink brew to heal your fighter</ItemInfo>
                </Grid>
              </Grid>
            </Box>
          </ButtonGroupView>
        )}
      </Box>
    </div>
  )
}
