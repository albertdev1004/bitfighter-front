// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useAppDispatch, useAppSelector } from '../../hooks'
import styled from 'styled-components'
import { Box, Button } from '@mui/material'
import { ShowFightConfirmationBox, TurnMouseClickOff } from '../../stores/UserActions'
import phaserGame from '../../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import store from '../../stores'

const Backdrop = styled.div`
  position: fixed;
  top: 20%;
  left: 28%;
  width: 20%;
  z-index: 10000;
  @media only screen and (max-height: 575.98px) and (orientation: landscape) {
    width: 50%;
    top: 25%;
    left: 2%;
  }
  @media only screen and (orientation: portrait) {
    width: 80%;
    top: 20%;
    left: 12%;
  }
`
const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`
const ModalText = styled.div`
  color: white;
  font-size: 20px;
  white-space: nowrap;
  font-family: 'Cooper Black', sans-serif;
`
const FightConfirmationBoxDiv = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  overflow: auto;
  opacity: 1;
  background: #000000a7;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 30px;
  height: 90%;

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
    color: white;
    margin-top: 10px;
  }

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 21px;
  }
`

export function FightConfirmationBox() {
  const gotFightConfirmationMessage = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationBox)
  const gotFightConfirmationTime = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationTime)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const game = phaserGame.scene.keys.game as Game

  const acceptFightRequest = async () => {
    game.lobbySocketConnection.send(
      JSON.stringify({
        event: 'fight_confirmation_accepted',
        walletAddress: store.getState().web3store.userAddress,
      }),
    )
    bootstrap.play_err_sound()
    store.dispatch(ShowFightConfirmationBox(false))
  }

  const cancelFightRequest = async () => {
    store.dispatch(ShowFightConfirmationBox(false))
  }
  const dispatch = useAppDispatch()

  return (
    <div
      style={{
        zIndex: 999999,
      }}
    >
      {gotFightConfirmationMessage && (
        <Backdrop>
          <Wrapper
            onMouseOver={() => {
              dispatch(TurnMouseClickOff(true))
            }}
            onMouseOut={() => {
              dispatch(TurnMouseClickOff(false))
            }}
          >
            <FightConfirmationBoxDiv>
              <ModalText>It's your turn to play!</ModalText>
              {}
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  dispatch(TurnMouseClickOff(false))
                  acceptFightRequest()
                }}
              >
                <span
                  style={{
                    color: 'aliceblue',
                  }}
                >
                  Ready!?
                </span>
              </Button>
              {}
              <ModalText>{gotFightConfirmationTime}</ModalText>
            </FightConfirmationBoxDiv>
          </Wrapper>
        </Backdrop>
      )}
    </div>
  )
}
