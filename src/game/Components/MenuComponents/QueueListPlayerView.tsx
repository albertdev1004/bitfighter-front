// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { v4 as uuidv4 } from 'uuid';
import store from "../../../stores";
import CloseIcon from '@mui/icons-material/Close';
import { getEllipsisTxt } from "../../../utils";
import phaserGame from '../../../PhaserGame';
import Game from '../../scenes/Game';
import Bootstrap from '../../scenes/Bootstrap';
import { useAppSelector } from '../../../hooks';
import { isNullOrUndefined } from 'util';
import styled from 'styled-components';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, css, Divider, Grid, InputBase, ListItemAvatar, ListItemButton } from '@mui/material';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
import { Row, Col, Container } from 'react-bootstrap';

function lotsOfStringGenrator() {
    const arr: string[] = []
    for (let i = 0; i < 100; i++) {
        arr.push(uuidv4())
    }
    return arr;
}

const BetInfoView = styled.div`

    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 30%;
      padding: 0px 0px 0px 0px;
    
    h3 {
        // margin-top: 5px;
        font-family: Monospace;
        font-style: bold;
        font-size: 12px;
        color: white;
        display: flex;
        align-items: center;
        gap: 20%;
    }

    span {
        background-color: #63a595;
        border-radius: 8px;
        padding: 0px;
        padding: 0px 4px 0px 4px;
        display: flex;

        justifyContent: center;
        alignItems: center;
        verticalAlign: middle;

        font-family: Monospace;
        font-style: bold;
        font-size: 12px;
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        h3 {
            font-size: 8px;
        }

        span {
            border-radius: 2px;
            padding: 0px 4px 0px 4px;
            font-size: 12px;

            justifyContent: center;
            alignItems: center;
            verticalAlign: middle;
        }
    }

    @media only screen and (orientation: portrait) {
        h3 {
            font-size: 6px;
        }

        span {
            border-radius: 1px;
              padding: 0px 0px 0px 0px;
            font-size: 6px;
        }
    }
`

const FormInputView = styled.div`

    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;

    margin: 2px;
    padding: 0px 0px 0px 0px;

    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 12px;
    }

    h3 {
        // margin-top: 5px;
        font-family: Monospace;
        font-style: bold;
        font-size: 12px;
        color: white;
        display: flex;
        align-items: center;

        span {
            background-color: #63a595;
            border-radius: 10px;
            padding: 10px;
            display: flex;

            font-family: Monospace;
            font-style: bold;
            font-size: 14px;
        }
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        h3 {
            font-size: 8px;
        }

        span {
            font-size: 8px;
        }
    }

    @media only screen and (orientation: portrait) {
        h3 {
            font-size: 6px;
        }

        span {
            font-size: 6px;
        }
    }
`
const ImageView = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 4px solid #000000;
    background-color: #232323;
    width: 100%;
    height: 80px;
    max-height: 80px;
    position: relative;
    gap: 5px;

    img{
        border: 1px solid #000000;
        width: 4vw;
    }
    span{
        font-size: 12px;
    }
    @media only screen and (max-width: 1000px) {
        height: 50px;
        border: 2px solid #000000;
        img{
            width: 7vw;
        }

        span{
            font-size: 0.75rem;
        }
    }
    @media only screen and (orientation: portrait) {
        img{
           width: 4vw;
        }

        span{
            font-size: 10px;
        }
    }
`

const BackDrop = styled.div`
    width: 100%;
`

const InputTextField = styled(InputBase)`
     border-radius: 1px 1px 10px 10px;
    background-color: #31bca3;
    border: 2x solid #000000;
  
   padding: 1px;
    @media only screen and (max-width: 640px) {
        border: 1px solid #000000;
        width: 100%;
        height: 40%;
    }
`
const BetText = styled.div`
    font-family: 'Cooper Black', sans-serif;
    padding: 4px;
    color: #31bca3;
    font-size: 1w;
    @media only screen and (max-width: 640px) {
    padding: 2px;
    font-size:1.5vw;
    }
`
const BetBox = styled.div`
    font-family: 'Cooper Black', sans-serif;
    color: white;
   font-size:1vw;
    @media only screen and (max-width: 640px) {
    font-size: 2vw;
  
}
`
const WalletText = styled.div`
color: grey;
   font-size: 9px;
   align:left;
`
const BetButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
`
const StyledImage = styled.img`
  width: 100px;
  height: 100px;
`;
interface QueueWindowInfo {
    player_id: string;
    profile_image: string,
    nick_name: string,
    wallet: string,
    fight_id: string,
    total_bet: number,
    p1_total_bet: number,
    p2_total_bet: number,
    extra_data: any
}

export default function QueueListPlayerView(queueWindowData: QueueWindowInfo) {
    const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
    const playersBetInfo = useAppSelector((state) => state.userPathStore.playersBetInfo)
    const chatting = useAppSelector((state) => state.userActionsDataStore.focussedOnChat)

    const game = phaserGame.scene.keys.game as Game
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    console.log("debug_chatting", chatting)

    let required_bet_info_index = -1;
    for (let i = 0; i < playersBetInfo.length; i++) {
        if (queueWindowData.fight_id === playersBetInfo[i].fight_id) {
            required_bet_info_index = i;
        }
        console.log("debug_bets___", playersBetInfo[required_bet_info_index])
    }

    const deleteUserFromQueue = async () => {
        console.log("delete user from queue pressed..")
        game.lobbySocketConnection.send(JSON.stringify({
            event: "delete_queue",
            walletAddress: store.getState().web3store.userAddress
        }))
        bootstrap.play_snap_sound()
    }

    const onChangeBetAmount = (e: any, fight_id: string, player_id: string) => {
        console.log("debug_bet_ui_view_writing_bet ", e.target.value, typeof e.target.value)
        let tempBet = 0
        if (e.target.value !== "") {
            tempBet = parseInt(e.target.value)
        }
        queueWindowData.extra_data.setBetOnPlayer(tempBet)
        queueWindowData.extra_data.setBetLastEdit(true)
        queueWindowData.extra_data.setFightIdSelected(fight_id)
        queueWindowData.extra_data.setPlayerSelected(player_id)
    }

    const onChangeTipAmount = (e: any, fight_id: string, player_id: string) => {
        console.log("debug_bet_ui_view_writing_tip ", e.target.value)
        let tempTip = 0
        if (e.target.value !== "") {
            tempTip = parseInt(e.target.value)
        }
        if (tempTip > 99) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Upto 100"))
            return
        }
        queueWindowData.extra_data.setTipOnPlayer(tempTip)
        queueWindowData.extra_data.setBetLastEdit(false)
        queueWindowData.extra_data.setFightIdSelected(fight_id)
        queueWindowData.extra_data.setPlayerSelected(player_id)
    }


    useEffect(() => {
        console.log("debug_bet_ui_view", queueWindowData.extra_data.betOnPlayer)
    }, [queueWindowData.extra_data.betOnPlayer])

    return (

        <div className="w-100 d-flex-row" style={{ border: "2px solid #000000", borderRadius: "5px", paddingBottom: '5px' }}>
            {
                queueWindowData.profile_image == "" ? <ImageView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src={queueWindowData.profile_image !== "" ? queueWindowData.profile_image : "/new_assets/questionGIF.gif"}
                        alt="Hero"
                        style={{
                            margin: "0",
                            display: "block",
                            height: '100%'
                            
                        }}
                    />
                </ImageView> : <ImageView>

                    <img
                        src={queueWindowData.profile_image !== "" ? queueWindowData.profile_image : "/new_assets/questionGIF.gif"}
                        alt="Hero"
                        style={{
                            margin: "0",
                            display: "block",
                            height: '100%'
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "flex-start",
                            justifyContent: "center"
                        }}
                    >
                        <span
                            style={{
                                color: "aliceblue",
                            }}
                        >
                            {queueWindowData.nick_name}
                        </span>
                        <WalletText>
                            {getEllipsisTxt(queueWindowData.wallet)}
                        </WalletText>
                    </div>

                    {
                        (queueWindowData.wallet === store.getState().web3store.userAddress) ?
                            <div style={{
                                position: "relative",
                                height: '100%'
                            }}>
                                <CloseIcon
                                    style={{ color: 'red', padding: '2px', position: 'absolute', alignItems: 'flex-start' }}
                                    onClick={() => {
                                        console.log("pressed close icon")
                                        deleteUserFromQueue()
                                    }}
                                />
                            </div>
                            :
                            <></>
                    }

                </ImageView>

            }
            <div className='w-100'>
                <BetInfoView style={{ alignContent: "center", justifyContent: "center" }}>
                    <Row className='w-100'>
                        <Col className='w-50' style={{ display: "flex", alignContent: "flex-start", justifyContent: "flex-start", gap: "5px", margin: '5px' }}>
                            {
                                Object.keys(queueDetailsInfo).length && queueDetailsInfo[queueWindowData.fight_id] ?
                                    queueWindowData.player_id == "p1" ? (
                                        <>
                                            <BetText>
                                                Total Bet:
                                            </BetText>
                                            <BetBox>
                                                {parseWBTCBalanceV3(queueDetailsInfo[queueWindowData.fight_id]["total_rough_bet_p1"] + queueDetailsInfo[queueWindowData.fight_id]["self_bet_p1"])}
                                            </BetBox>

                                        </>
                                    ) :
                                        (
                                            <>
                                                <BetText>
                                                    Total Bet:
                                                </BetText>
                                                <BetBox>
                                                    {parseWBTCBalanceV3(queueDetailsInfo[queueWindowData.fight_id]["total_rough_bet_p2"] + queueDetailsInfo[queueWindowData.fight_id]["self_bet_p2"])}
                                                </BetBox>
                                            </>
                                        ) :
                                    (
                                        <>
                                            <BetText> Total Bet </BetText>
                                            <BetBox>{0}</BetBox>
                                        </>
                                    )
                            }
                        </Col>
                        <Col className='w-50' style={{ display: "flex", alignContent: "flex-start", justifyContent: "flex-start", gap: "5px" }}>
                            {
                                required_bet_info_index > -1 && !isNullOrUndefined(playersBetInfo) && queueWindowData.player_id == "p1" && playersBetInfo[required_bet_info_index].player_bet_on === queueWindowData.wallet ? (
                                    <>
                                        <BetText>My Bet:</BetText>
                                        <BetBox>
                                            {parseWBTCBalanceV3(playersBetInfo[required_bet_info_index].bet_amount)}
                                        </BetBox>
                                    </>
                                ) :
                                    required_bet_info_index > -1 && !isNullOrUndefined(playersBetInfo) && queueWindowData.player_id == "p2" && playersBetInfo[required_bet_info_index].player_bet_on === queueWindowData.wallet ? (
                                        <>
                                            <BetText>My Bet:</BetText>
                                            <BetBox>
                                                {parseWBTCBalanceV3(playersBetInfo[required_bet_info_index].bet_amount)}
                                            </BetBox>
                                        </>
                                    ) : (
                                        <>
                                            <BetText> My Bet:</BetText>
                                            <BetBox>{0} </BetBox>
                                        </>
                                    )
                            }
                        </Col>
                    </Row>
                </BetInfoView>
            </div>
            <div className='w-100'>
                <FormInputView>
                    <Row className='w-100'>
                        <Col className='w-50' style={{ display: "flex", flexDirection: "column", alignContent: "flex-start", justifyContent: "flex-start", gap: "1px" }}>
                            <BetText>
                                Bet:
                            </BetText>
                            <InputTextField
                                className='p-1'
                                type='number'
                                autoFocus={
                                    !chatting &&
                                    queueWindowData.extra_data.fight_id_selected === queueWindowData.fight_id
                                    && queueWindowData.wallet === queueWindowData.extra_data.player_id_selected
                                    && queueWindowData.extra_data.last_edit_bet
                                }
                                value={
                                    queueWindowData.wallet === queueWindowData.extra_data.player_id_selected ?
                                        queueWindowData.extra_data.bet_amount :
                                        0
                                }
                                onChange={(e) => {
                                    onChangeBetAmount(e, queueWindowData.fight_id, queueWindowData.wallet)
                                }}
                            />
                        </Col>
                        <Col className='w-50' style={{ display: "flex", flexDirection: "column", alignContent: "flex-start", justifyContent: "flex-start", gap: "1px" }}>
                            <BetText>
                                Tip%:
                            </BetText>
                            <InputTextField
                                className='p-1'
                                type='number'
                                autoFocus={
                                    !chatting &&
                                    queueWindowData.extra_data.fight_id_selected === queueWindowData.fight_id
                                    && queueWindowData.wallet === queueWindowData.extra_data.player_id_selected
                                    && !queueWindowData.extra_data.last_edit_bet
                                }
                                value={
                                    queueWindowData.wallet === queueWindowData.extra_data.player_id_selected ?
                                        queueWindowData.extra_data.tip_amount :
                                        0
                                }
                                onChange={(e) => {
                                    onChangeTipAmount(e, queueWindowData.fight_id, queueWindowData.wallet)
                                }}
                            />
                        </Col>
                    </Row>
                </FormInputView>
            </div>
            <BetButtonDiv>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{
                        width: '50%',
                        borderRadius: '5px',
                        justifyContent: 'center',
                        height: '12px',
                        padding: '10px'
                    }}
                    onClick={queueWindowData.extra_data.addBetToFightPlayer}
                >
                    {queueWindowData.extra_data.betState}
                </Button>
            </BetButtonDiv>
        </div >
    )
}