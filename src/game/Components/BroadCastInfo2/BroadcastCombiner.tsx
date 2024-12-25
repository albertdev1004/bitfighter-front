// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Timer } from "./Timer";
import { LeftHealthBars } from "./LeftHealthBars";
import { RightHealthBars } from "./RightHealthBars";
import { LeftPlayerInfo } from "./LeftPlayerInfo";
import { RightPlayerInfo } from "./RightPlayerInfo";
import { TurnMouseClickOff } from "../../../stores/UserActions";
import { PlayersPrizeMoney } from "./PlayersPrizeMoney";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: inline-block;
    width: 80%;
    position: absolute;
    transform: translate(15%,5%);

   @media (max-width: 768px) and (orientation: landscape) {
       width: 70%;
        transform: translate(25%,5%);

    }
`

export function BroadCastCombiner2() {
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    const dispatch = useAppDispatch()

    return (
        <Wrapper>
            {
                (fightersInfo.preFightStarted) &&
                <div style={{ width: "100%", display: "flex", backgroundColor: "rgba(0, 0, 0, 0)"}}>
                    {/* <BroadcastingAnnouncement /> */}
                    <Col className="col-sm-2">
                        <LeftPlayerInfo />
                    </Col>
                    <Col className="col-16">
                        <div style={{
                            width: "100%",
                            display: "flex",
                        }}>
                            <Col className="col-4-auto" >
                                <LeftHealthBars />
                            </Col>
                            <Col className="col-1">
                                <Timer />
                            </Col>
                            <Col className="col-4-auto">
                                <RightHealthBars />
                            </Col>
                        </div>
                        <div>
                            <div style={{ height: "1vh" }}></div>
                        </div>
                        <div>
                            <PlayersPrizeMoney />
                        </div>
                    </Col>
                    <Col className="col-sm-2">
                        <RightPlayerInfo />
                    </Col>
                </div>

            }
        </Wrapper>
    )
}