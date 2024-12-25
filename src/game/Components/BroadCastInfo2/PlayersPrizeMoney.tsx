// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { Grid } from "@mui/material";
import styled from "styled-components"
import { isNullOrUndefined } from "util";
import { useAppSelector } from "../../../hooks";
import { IQueueCombined } from "../../../stores/UserWebsiteStore";
import { parseWBTCBalanceV2 } from "../../../utils/web3_utils";
import { Col, Row } from "react-bootstrap";


const PrizeTextDiv = styled.div`
    width: 50%;
    height: 100%;
    background-color: #000000a7;
    border: 1px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
`;

const FightPrizeText = styled.div`
    font-size: 1.2vw;
    border: 1px solid #000000;
    background-color: #000000a7;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto; 
`;
const GridItem = styled.div`

`

export function PlayersPrizeMoney() {
    const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
    const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
    let p1_self_bet = 0;
    let p2_self_bet = 0;
    if (combinedQueueData.length > 0) {
        combinedQueueData.map((data: IQueueCombined, index) => {
            if (index > 0) {
                return
            }
            const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
            if (!isNullOrUndefined(tempQueueDetailInfo)) {
                p1_self_bet = tempQueueDetailInfo.win_pot_p1 ? tempQueueDetailInfo.win_pot_p1 : 0;
                p2_self_bet = tempQueueDetailInfo.win_pot_p1 ? tempQueueDetailInfo.win_pot_p2 : 0;
            }
        })
    }
    return (
        <Grid container spacing={0}>
            <Grid item xs={5}>
                <PrizeTextDiv className="prize_text_below_health_bar">
                    <span className="fs-5 user-select-none">
                        {parseWBTCBalanceV2(p1_self_bet.toString())}
                    </span>
                </PrizeTextDiv>
            </Grid>
            <Grid item xs={2}>
                <FightPrizeText className="prize_text_below_health_bar">
                    Fight Prize
                </FightPrizeText>

            </Grid>
            <Grid item xs={5}>
                <PrizeTextDiv className="prize_text_below_health_bar">
                    <span className="fs-5 user-select-none">
                        {parseWBTCBalanceV2(p2_self_bet.toString())}
                    </span>
                </PrizeTextDiv>
            </Grid>
        </Grid>
    )
}