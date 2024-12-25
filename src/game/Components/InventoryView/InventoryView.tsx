import { useState } from 'react'
import styled from 'styled-components'
import { useDetectClickOutside } from 'react-detect-click-outside'

import Game from '../../scenes/Game'
import { Inventory } from './Inventory'
import phaserGame from '../../../PhaserGame'

import { parseWBTCBalanceV3 } from '../../../utils/web3_utils'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { fetchPlayerWalletInfo, useAssetsApi } from '../../../hooks/ApiCaller'

import store from '../../../stores'
import { SetMouseClickControlInventory } from '../../../stores/UserActions'
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore'

const StyledButton = styled.button`
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0.1)
    border: none;
    cursor: pointer;
    border-radius: 5px; 
    width: 100%
`

const MoneyBagIcon = styled.img`
  position: static;
  height: 25px;
  width: 25px;
  @media only screen and (max-height: 575.98px) and (orientation: landscape) {
    width: 25px;
    height: 25px;
  }
`

const Backdrop = styled.div`
  position: fixed;
  margin: 0.5%;
`

const WrapperSecondDiv = styled.div`
  position: fixed;
  height: 50%;
  width: 80vw;
  overflow-y: auto;
  top: 35%;
  left: 5%;
`

const WrapperThirdDiv = styled.div`
  position: fixed;
  left: 8%;
  top: 7%;
`

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  width: 110px;
  background-color: #3b3b3b;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  gap: 1%;
  @media only screen and (max-height: 575.98px) and (orientation: landscape) {
    width: 100px;
    height: 50px;
  }
`

const BitsView = styled.div`
  span {
    font-family: 'Cooper Black', sans-serif;
    font-size: 1.1em;
    color: white;
  }
  h2,
  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-size: 1.5em;
    color: white;
    line-height: 75%;
  }
  h6 {
    font-family: 'Cooper Black', sans-serif;
    color: aliceblue;
    font-weight: 500;
    font-size: 15px;
    text-align: left;
    margin-top: 6px;
  }
  width: 100%;
`

const PosNumberHighlight = styled.div`
  font-family: 'Cooper Black', sans-serif;
  font-style: bold;
  font-size: 2.5em;
  color: #3fe038;
  font-family: Monospace;
  text-shadow: -1px -1px 0 #111b28, 1px -1px 0 #111b28, -1px 1px 0 #111b28, 1px 1px 0 #111b28; /* Four shadows to create a stroke effect */
`

const NegNumberHighlight = styled.div`
  font-family: 'Cooper Black', sans-serif;
  font-style: bold;
  font-size: 2.5em;
  color: red;
  font-family: Monospace;
  text-shadow: -1px -1px 0 #111b28, 1px -1px 0 #111b28, -1px 1px 0 #111b28, 1px 1px 0 #111b28; /* Same stroke effect as above */
`

export function InventoryView() {
  const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game

  const assetsInfo = useAppSelector((state) => state.assetStore.assets)
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  const changeInBalance = useAppSelector((state) => state.web3BalanceStore.changeInBalance)
  const userBalanceInfo = useAppSelector((state) => state.web3BalanceStore.balanceInfoUser)
  const changeInCoinBool = useAppSelector((state) => state.web3BalanceStore.coin_changed.changed)
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance)
  const changeInBalanceBool = useAppSelector((state) => state.web3BalanceStore.changeBalanceShowBool)

  const [lastEquipTime, setLastequipTime] = useState(0)
  const [inventoryState, setInventoryState] = useState('basic')
  const [showButtonGroupBool, setShowButtonGroupBool] = useState(false)

  function closeView() {
    // console.log('debug_inventory... clicked outside')
    setInventoryState('basic')
  }

  const ref = useDetectClickOutside({ onTriggered: closeView })

  // console.log('----------inventoryState----', inventoryState)

  async function useBrew() {
    if (store.getState().websiteStateStore.showing_jackpot_wheel) {
      return
    }
    // console.log("debug_equip_brew...", data)
    if (new Date().getTime() - lastEquipTime <= 5 * 1000) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Wait 5 seconds before drinking again'))
      setShowButtonGroupBool(true)
      setInventoryState(inventoryState)
      return
    }
    setLastequipTime(new Date().getTime())
    store.dispatch(SetMouseClickControlInventory(false))

    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
    // return
    const res = await useAssetsApi('brew')
    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)
    if (res) {
      // fetchPlayerLatestStats()
      fetchPlayerWalletInfo()
      setTimeout(() => {
        game.lobbySocketConnection.send(
          JSON.stringify({
            event: 'brew_used',
            walletAddress: store.getState().web3store.userAddress,
            force: true,
          }),
        )
      }, 1000)
    } else {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage('Failed to use Brew'))
      }, 300)
    }
    setShowButtonGroupBool(true)
    setInventoryState('basic')
  }

  async function equipBrew() {
    if (store.getState().websiteStateStore.showing_jackpot_wheel) {
      return
    }
    // console.log('debug_equip_brew...')
    if (new Date().getTime() - lastEquipTime <= 5 * 1000) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Wait 5 seconds before equip again'))

      setShowButtonGroupBool(true)
      setInventoryState(inventoryState)
      return
    }
    setLastequipTime(new Date().getTime())
    store.dispatch(SetMouseClickControlInventory(false))

    setShowButtonGroupBool(true)
    setInventoryState(inventoryState)

    if (store.getState().assetStore.equippedBrewCount > 0) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Not Allowed'))
    } else {
      const res = await useAssetsApi('brew')
      if (res) {
        // store.dispatch(SetEquippedBrewCount(store.getState().assetStore.equippedBrewCount + 1))
        // send an message to
        const temp = game.otherPlayers.get(store.getState().web3store.player_id)
        if (temp?.gameObject) {
          game.lobbySocketConnection.send(
            JSON.stringify({
              event: 'semi_equip_brew',
              walletAddress: store.getState().web3store.userAddress,
              minted_id: temp.minted_id,
            }),
          )
        }
      } else {
        setTimeout(() => {
          store.dispatch(SetFailureNotificationBool(true))
          store.dispatch(SetFailureNotificationMessage('Failed to Equip Brew'))
        }, 300)
      }
    }

    setShowButtonGroupBool(true)
    setInventoryState('basic')
  }

  return (
    <div ref={ref}>
      <Backdrop
        onMouseOver={() => {
          if (inventoryState === 'inventory_view') dispatch(SetMouseClickControlInventory(true))
        }}
        onMouseOut={() => {
          dispatch(SetMouseClickControlInventory(false))
        }}
      >
        <Wrapper>
          <div
            style={{
              display: 'flex',
              position: 'relative',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <StyledButton
              onClick={() => {
                if (store.getState().websiteStateStore.showing_jackpot_wheel) {
                  return
                }
                if (
                  fightersInfo.fightStarted &&
                  (fightersInfo.player1.walletAddress === store.getState().web3store.userAddress ||
                    fightersInfo.player2.walletAddress === store.getState().web3store.userAddress)
                ) {
                  store.dispatch(SetFailureNotificationBool(true))
                  store.dispatch(SetFailureNotificationMessage('You had your chance to equip before the fight!'))
                  return
                }
                setInventoryState('inventory_view')
              }}
            >
              <MoneyBagIcon className='user-select-none' src='assets/money-bag.png' alt='Cinque Terre' />
            </StyledButton>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: `2%`,
                height: '50%',
                alignItems: 'center',
              }}
            >
              <img className='user-select-none' src='bitfgihter_assets/items/bit.gif' alt='Cinque Terre' height='70%'></img>
              <BitsView>
                {/*Bits: */}
                <h6 className='user-select-none'>{store.getState().web3store.web3Connected ? parseWBTCBalanceV3(web2_credit_balance) : 0}</h6>
              </BitsView>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: `2%`,
                height: '50%',
                width: '200%',
                alignItems: 'center',
              }}
            >
              <img className='user-select-none' src='bitfgihter_assets/items/coin.gif' alt='Cinque Terre' height='70%'></img>
              <BitsView>
                {/*Coins: */}
                <h6 className='user-select-none'>
                  {store.getState().web3store.web3Connected
                    ? userBalanceInfo.web2_coins.toLocaleString()
                    : (web2_credit_balance / 100 + userBalanceInfo.web2_coins).toLocaleString()}{' '}
                </h6>
              </BitsView>
            </div>
          </div>
        </Wrapper>

        <WrapperSecondDiv>
          {inventoryState === 'inventory_view' ? (
            <div style={{ width: '100%', height: '50%' }}>
              <Inventory
                lastEquipTime={lastEquipTime}
                setLastequipTime={setLastequipTime}
                assetsInfo={assetsInfo}
                useBrew={useBrew}
                equipBrew={equipBrew}
                showButtonGroupBool={showButtonGroupBool}
                setShowButtonGroupBool={setShowButtonGroupBool}
              />
            </div>
          ) : (
            <></>
          )}
        </WrapperSecondDiv>

        <WrapperThirdDiv>
          <div>
            {changeInBalanceBool ? (
              <>
                {parseInt(changeInBalance) > 0 ? (
                  <PosNumberHighlight>+{parseWBTCBalanceV3(parseInt(changeInBalance))}</PosNumberHighlight>
                ) : (
                  <NegNumberHighlight>{parseWBTCBalanceV3(parseInt(changeInBalance))}</NegNumberHighlight>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            {changeInCoinBool ? (
              <>
                {parseInt(store.getState().web3BalanceStore.coin_changed.amount) > 0 ? (
                  <PosNumberHighlight>{store.getState().web3BalanceStore.coin_changed.amount}</PosNumberHighlight>
                ) : (
                  <NegNumberHighlight>{store.getState().web3BalanceStore.coin_changed.amount}</NegNumberHighlight>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </WrapperThirdDiv>
      </Backdrop>
    </div>
  )
}
