// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import RefreshIcon from '@mui/icons-material/Refresh'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Button, ButtonGroup, Fab, Tab, Tabs } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import MyLogView from './MenuComponents/MyLogView'
import MyStatsView from './MenuComponents/MyStatsView'
import FriendsList from './MenuComponents/FriendsList'
import MyChartView from './MenuComponents/MyChartView'
import MyQuestView from './MenuComponents/MyQuestView'
import QueueListV2 from './MenuComponents/QueueListV2'
import OtherStatsView from './MenuComponents/OtherStatsView'
import PendingRequests from './MenuComponents/PendingRequests'
import GangView, { MyGangView } from './MenuComponents/GangView'
import SentFriendRequests from './MenuComponents/SentFriendRequest'

import { getEllipsisTxt } from '../../utils'
import { updateBetInfOfPlayer } from '../../utils/fight_utils'

import { useAppDispatch, useAppSelector } from '../../hooks'

import store from '../../stores'
import { LogOut } from '../../stores/Web3Store'
import { setNFTLoadedBool } from '../../stores/BitFighters'
import { SetMouseClickControlProfileWindow, TurnMouseClickOff } from '../../stores/UserActions'
import {
  ChangeShowGangView,
  ChangeShowQuestsView,
  ChangeShowSettingsView,
  ChangeShowQueueBox,
  ChangeShowStatsView,
  ChangeShowLog,
} from '../../stores/UserWebsiteStore'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface ListViewerData {
  main: string
  sequence: number
  subdata: string
}

export interface ListViewerDataWrapper {
  data: ListViewerData
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className='container w-100 h-100'
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

function TabPanel2(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className='container w-100 p-0'
    >
      {value === index && <div className='d-flex w-100 h-100'> {children} </div>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function a11yProps2(index: number) {
  return {
    id: `simple-tab2-${index}`,
    'aria-controls': `simple-tabpanel2-${index}`,
  }
}

function a11yProps3(index: number) {
  return {
    id: `simple-tab2-${index}`,
    'aria-controls': `simple-tabpanel2-${index}`,
  }
}

const Backdrop = styled.div`
  position: fixed;
  right: 0%;
  height: 100%;
  width: 25%;
  z-index: 100;
  overflow-y: scroll;
  margin: auto;
  @media only screen and (max-width: 775.98px) and (orientation: landscape) {
    width: 65%;
  }

  @media only screen and (max-width: 650px) and (orientation: landscape) {
    width: 65%;
  }

  @media only screen and (orientation: portrait) {
    width: 65%;
  }
`

const Wrapper = styled.div`
  position: relative;
  right: 0%;
  display: flex;
  flex-direction: column;
  opacity: 0.85;
  justify-content: 'center';
  width: auto;
  background: #2c2c2c;
  align-items: center;
  border-radius: 10px;
`

const MenuBox = styled(Box)`
  width: 100%;
`
const ButtonGroupStyled = styled(ButtonGroup)`
  width: 100%; /* Ensure the button group takes full width */
  display: flex;
  padding: 2px;
  flex-direction: row;
`
const ButtonStyled = styled(Button)``
const ButtonText = styled.div`
  font-size: calc(1px + 1vw);
`

const MenuBoxHeader = styled.div`
  position: relative;
  background: #000000a7;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 775.98px) and (orientation: landscape) {
    button {
      width: 80%; /* Adjust width as necessary */
      font-size: 0.8rem; /* Reduce font size */
      padding: 5px 10px; /* Adjust padding */
    }
  }
`

const TabsBoxHeader = styled.div`
  position: relative;
  background: #000000a7;
  height: 24px;
`

const TabsSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 1800px;
`

const TextWrapper = styled.div`
  color: aliceblue;
  font-family: Monospace;
`

export default function NewMenuSideBar() {
  const dispatch = useAppDispatch()

  const showLog = useAppSelector((state) => state.userPathStore.ShowLog)
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const showGangView = useAppSelector((state) => state.userPathStore.ShowGangView)
  const showStatsBox = useAppSelector((state) => state.userPathStore.ShowStatsView)
  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const showQuestsView = useAppSelector((state) => state.userPathStore.ShowQuestsView)
  const showQueueBoxRedux = useAppSelector((state) => state.userPathStore.ShowQueueBox)
  const showSettingsView = useAppSelector((state) => state.userPathStore.showSettingsView)

  const [value, setValue] = React.useState(1)
  const [value2, setValue2] = React.useState(0)
  const [value3, setValue3] = React.useState(0)
  const [logChart, setLogChart] = React.useState(0)

  // console.log('-- debug showmenubox ', ShowMenuBoxRedux, showQueueBoxRedux, showStatsBox, showLog)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.log('debug handleChange----', newValue)
    setValue(newValue)
  }

  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue)
  }

  const handleChange3 = (event: React.SyntheticEvent, newValue: number) => {
    setValue3(newValue)
  }

  const handleLogTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setLogChart(newValue)
  }

  return (
    <Backdrop>
      {ShowMenuBoxRedux && (
        <Wrapper
          onMouseOver={() => {
            dispatch(SetMouseClickControlProfileWindow(true))
          }}
          onMouseOut={() => {
            dispatch(SetMouseClickControlProfileWindow(false))
          }}
        >
          <TextWrapper className='fs-6 text-center' style={{ color: '#BF8B8B', fontSize: '20px' }}>
            {store.getState().web3store.web3Connected ? 'Connected:' : 'Welcome '}
            {store.getState().web3store.web3Connected ? getEllipsisTxt(userAddress) : 'Guest!'}
          </TextWrapper>
          {/* <TextWrapper className='fs-6 text-center' style={{ color: '#BF8B8B', fontSize: '18px' }}>
            {store.getState().web3store.web3Connected ? getEllipsisTxt(userAddress) : 'Guest!'}
          </TextWrapper> */}
          <MenuBoxHeader>
            <ButtonGroupStyled>
              <ButtonStyled
                variant='outlined'
                color='secondary'
                onClick={() => {
                  store.dispatch(ChangeShowQueueBox(true))
                  store.dispatch(ChangeShowStatsView(false))
                  store.dispatch(ChangeShowLog(false))
                  store.dispatch(ChangeShowGangView(false))
                  store.dispatch(ChangeShowQuestsView(false))
                  store.dispatch(ChangeShowSettingsView(false))
                }}
              >
                <ButtonText>Game</ButtonText>
              </ButtonStyled>
              <ButtonStyled
                variant='outlined'
                color='secondary'
                onClick={() => {
                  store.dispatch(ChangeShowQueueBox(false))
                  store.dispatch(ChangeShowGangView(true))
                  store.dispatch(ChangeShowStatsView(false))
                  store.dispatch(ChangeShowLog(false))
                  store.dispatch(ChangeShowQuestsView(false))
                  store.dispatch(ChangeShowSettingsView(false))
                }}
              >
                <ButtonText>Gang</ButtonText>
              </ButtonStyled>
              <ButtonStyled
                variant='outlined'
                color='secondary'
                onClick={() => {
                  store.dispatch(ChangeShowQueueBox(false))
                  store.dispatch(ChangeShowStatsView(true))
                  store.dispatch(ChangeShowLog(false))
                  store.dispatch(ChangeShowGangView(false))
                  store.dispatch(ChangeShowQuestsView(false))
                  store.dispatch(ChangeShowSettingsView(false))
                }}
              >
                <ButtonText>Status</ButtonText>
              </ButtonStyled>
            </ButtonGroupStyled>
          </MenuBoxHeader>
          <MenuBoxHeader>
            <ButtonGroupStyled>
              <ButtonStyled
                variant='outlined'
                color='secondary'
                onClick={() => {
                  store.dispatch(ChangeShowQueueBox(false))
                  store.dispatch(ChangeShowStatsView(false))
                  store.dispatch(ChangeShowLog(false))
                  store.dispatch(ChangeShowGangView(false))
                  store.dispatch(ChangeShowQuestsView(true))
                  store.dispatch(ChangeShowSettingsView(true))
                }}
              >
                <ButtonText>Quests</ButtonText>
              </ButtonStyled>
              <ButtonStyled
                variant='outlined'
                color='secondary'
                onClick={() => {
                  store.dispatch(ChangeShowQueueBox(false))
                  store.dispatch(ChangeShowStatsView(false))
                  store.dispatch(ChangeShowLog(true))
                  store.dispatch(ChangeShowGangView(false))
                  store.dispatch(ChangeShowQuestsView(false))
                  store.dispatch(ChangeShowSettingsView(false))
                }}
              >
                <ButtonText>Log</ButtonText>
              </ButtonStyled>
            </ButtonGroupStyled>
          </MenuBoxHeader>
          {showQueueBoxRedux ? (
            <TabsSection>
              <TabsBoxHeader>
                <Tabs
                  aria-label='basic tabs example 2'
                  centered
                  style={{ fontSize: '8px', minHeight: '24px' }}
                  onChange={handleChange2}
                  value={value2}
                  textColor='secondary'
                  indicatorColor='secondary'
                >
                  <Tab
                    label='Queue'
                    {...a11yProps2(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                  <Tab
                    label='Play Now!'
                    {...a11yProps2(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                </Tabs>
              </TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabPanel2 value={value2} index={0}>
                  <QueueListV2 />
                </TabPanel2>
                <TabPanel2 value={value2} index={1} style={{ color: 'white' }}>
                  Hit the fight machine to join the queue!
                </TabPanel2>
              </MenuBox>
            </TabsSection>
          ) : showStatsBox ? (
            <TabsSection>
              <TabsBoxHeader>
                <Tabs
                  aria-label='basic tabs example'
                  centered
                  style={{ fontSize: '8px', minHeight: '24px' }}
                  onChange={(e, newValue) => {
                    // console.log("debug handleChange----", newValue)
                    setValue(newValue)
                  }}
                  value={value}
                  textColor='secondary'
                  indicatorColor='secondary'
                >
                  <Tab
                    label='Scanner'
                    {...a11yProps(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                  <Tab
                    label='My Status'
                    {...a11yProps(1)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                </Tabs>
              </TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabPanel value={value} index={0}>
                  <OtherStatsView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MyStatsView />
                </TabPanel>
              </MenuBox>
            </TabsSection>
          ) : showGangView ? (
            <TabsSection>
              <TabsBoxHeader>
                <Tabs
                  aria-label='basic tabs example'
                  centered
                  style={{ fontSize: '8px', minHeight: '24px' }}
                  onChange={(e, newValue) => {
                    // console.log("debug handleChange----", newValue)
                    setValue(newValue)
                  }}
                  value={value}
                  textColor='secondary'
                  indicatorColor='secondary'
                >
                  <Tab
                    label='SYSTEM'
                    {...a11yProps(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                  <Tab
                    label='MY GANG'
                    {...a11yProps(1)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                </Tabs>
              </TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabPanel value={value} index={0}>
                  <GangView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MyGangView />
                </TabPanel>
              </MenuBox>
            </TabsSection>
          ) : showQuestsView ? (
            <TabsSection>
              <TabsBoxHeader>
                <Tabs
                  aria-label='basic tabs example'
                  centered
                  style={{ fontSize: '8px', minHeight: '24px' }}
                  onChange={(e, newValue) => {
                    // console.log("debug handleChange----", newValue)
                    setValue(newValue)
                  }}
                  value={value}
                  textColor='secondary'
                  indicatorColor='secondary'
                >
                  <Tab
                    label='To Do'
                    {...a11yProps(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                  <Tab
                    label='Done'
                    {...a11yProps(1)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                </Tabs>
              </TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabPanel value={value} index={0}>
                  <MyQuestView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MyQuestView />
                </TabPanel>
              </MenuBox>
            </TabsSection>
          ) : showLog ? (
            <TabsSection>
              <TabsBoxHeader>
                <Tabs
                  aria-label='basic tabs example 2'
                  centered
                  style={{ fontSize: '8px', minHeight: '24px' }}
                  onChange={handleChange3}
                  value={value3}
                  textColor='secondary'
                  indicatorColor='secondary'
                >
                  <Tab
                    className='fs-6'
                    label='Transactions'
                    {...a11yProps3(0)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                  <Tab
                    className='fs-6'
                    label='Chart'
                    {...a11yProps3(1)}
                    sx={{
                      padding: '2px 4px', // Adjust padding here
                      minHeight: '24px', // Adjust height here
                      fontSize: '12px', // Optionally adjust font size
                    }}
                  />
                </Tabs>
              </TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabPanel value={value3} index={0}>
                  <MyLogView key={'mylogview'} />
                </TabPanel>
                <TabPanel value={value3} index={1}>
                  <MyChartView key={'mychartview'} />
                </TabPanel>
              </MenuBox>
            </TabsSection>
          ) : (
            <TabsSection>
              <TabsBoxHeader></TabsBoxHeader>
              <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}></MenuBox>
            </TabsSection>
          )}
        </Wrapper>
      )}
    </Backdrop>
  )
}
