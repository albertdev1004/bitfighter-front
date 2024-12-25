// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import { useAppDispatch, useAppSelector } from '../../hooks'
import styled from 'styled-components'
import { LinearProgress } from '@mui/material'
import { useState } from 'react'
import { approveWBTC2, checkAllowance, depositMoneyToWalletV2 } from '../../contract'
import store from '../../stores'
import ServiceViewBox from './MenuComponents/ServiceViewBox'
import { convertWBTCToBigIntWithDecimlas, getBalances } from '../../utils/web3_utils'
import SuccessSnackBarHelper from '../../landing-page/SuccessSnackBarHelper'
import ErrSnackBarHelper from '../../landing-page/ErrSnackBarHelper'
import { fetchPlayerWalletInfo, redeemPlayerBalance, updateWalletBalanceWithWeb3 } from '../../hooks/ApiCaller'
import { isNullOrUndefined } from 'util'
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from '../../stores/NotificationStore'
import { ethers } from 'ethers'
import { GetGameLogicContractAddress } from '../../contract/gamelogic_constants'
import { setCardState } from '../../stores/MintCardStateStore'
import { OpenServiceView, SetMouseClickControlATM, TurnMouseClickOff } from '../../stores/UserActions'
import { useDetectClickOutside } from 'react-detect-click-outside'

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    color: #00000;
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
  }
`
const ProgressBar = styled(LinearProgress)`
  width: 360px;
`
const Backdrop = styled.div`
  position: fixed;
  top: 20%;
  left: 30%;
  width: 40%;
  // max-height: 40%;
  // max-width: 60%;
  /* Portrait mode: Adjusting font size */
  @media only screen and (orientation: portrait) {
    top: 12%;
    left: 2%;
    width: 40%;
  }
`
const vertical = 'bottom'
const horizontal = 'center'

export function ServiceView() {
  const openServiceView = useAppSelector((state) => state.userActionsDataStore.openServiceView)
  const [amount, setAmount] = useState(0)
  const [addMoneyBool, setaddToQueueBool] = useState(false)
  const [adMoneyState, setAddMoneyState] = useState('')
  const dispatch = useAppDispatch()
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [errsnackBarOpen, setErrSnackBarOpen] = useState(false)
  const [successSnackBarMessage, setSuccessSnackBarMessage] = useState('')
  const [errSnackBarMessage, setErrSnackBarMessage] = useState('')
  const handleClose = () => {
    setSnackBarOpen(false)
  }
  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false)
  }
  // const { height } = Utils();
  // const game = phaserGame.scene.keys.game as Game
  // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const closeDialogMenu = () => {
    // console.log("click happened .. ")
    if (store.getState().userActionsDataStore.openServiceView) {
      dispatch(OpenServiceView(false))
      // dispatch(OpenAtmView(false))
    }
  }
  const closeFunction = () => {
    // console.log("debug_mouse in close fn atmview")
    // store.dispatch(BrewMachinePunched(false))
    dispatch(TurnMouseClickOff(false))
  }

  const ref = useDetectClickOutside({ onTriggered: closeFunction })

  return (
    <div className='atm-box' style={{ zIndex: 99 }}>
      {openServiceView && (
        <div
          ref={ref}
          onMouseOver={() => {
            dispatch(SetMouseClickControlATM(true))
          }}
          onMouseOut={() => {
            dispatch(SetMouseClickControlATM(false))
          }}
        >
          {/* <SuccessSnackBarHelper 
                        open= {snackBarOpen}
                        message={successSnackBarMessage}
                        handleClose={handleClose}
                        />
                        <ErrSnackBarHelper 
                            open= {errsnackBarOpen}
                            message={errSnackBarMessage}
                            handleClose={errSnackBarHandleClose}
                        /> */}
          <Backdrop>
            <ServiceViewBox closeFunction={closeDialogMenu} setAmount={setAmount} amount={amount} />
            {addMoneyBool && (
              <ProgressBarWrapper>
                <h3> {adMoneyState} </h3>
                <ProgressBar color='primary' />
              </ProgressBarWrapper>
            )}
          </Backdrop>
        </div>
      )}
    </div>
  )
}
