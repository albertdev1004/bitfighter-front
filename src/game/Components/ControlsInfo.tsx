// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { TurnMouseClickOff } from "../../stores/UserActions";
import { ChangeShowControls } from "../../stores/UserWebsiteStore";
import { getSystemInfo } from '../../utils/systemInfo';
import { useDetectClickOutside } from "react-detect-click-outside";

const Backdrop = styled.div`
    position: fixed;
    top: calc(10% + 60px);
    left:30%;
    height: 100%;
    width: 30%;
    @media only screen and (max-height: 640px){
        width: 100%;
        left:0%;
    }   
`

const Backdrop2 = styled.div`
    position:fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    // z-index: 1;
`

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    
`

const FightConfirmationBoxDiv = styled(Box)`
    width: 100%;
    overflow: auto;
    opacity: 1;
    background: #000000a7;
    border: 5px solid #000000;
    border-radius: 10px;

    h2 {
        font-family: Monospace;
        font-style: bold;
        color: white;
    }

    span {
        font-family: Monospace;
        font-style: bold;
    }

    .controlsText {
        font-family: Monospace;
        font-style: bold;
        color: white;
        background: rgb(84, 86, 86);
    }
`

export function ControlsInfo() {
    const showControls = useAppSelector((state) => state.userPathStore.showControls)
    const dispatch = useAppDispatch();
    const ismobile = getSystemInfo();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isHardware, setIsHardware] = useState(window.innerWidth <= 640);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsHardware(window.innerWidth <= 640);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    function closeView() {
        localStorage.setItem("saw_controls", "YES")
        if (localStorage.getItem("saw_controls"))
            dispatch(ChangeShowControls(false))
    }
    const ref = useDetectClickOutside({ onTriggered: closeView });

    const View = <Wrapper ref={ref}>
        <FightConfirmationBoxDiv className="text-center">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
            }}>
                <div style={{
                    justifyContent: 'space-around',
                    paddingTop: '2vh',
                }}>
                    <h2 className="fs-3">
                        Controls
                    </h2>

                    <div className="controlsText fs-6">
                        {isHardware ? (
                            <p>B to punch</p>
                        ) : isMobile ? (
                            <p>B to punch</p>
                        ) : (
                            <p>L Click or P to punch</p>
                        )}
                    </div>

                    <div className="controlsText fs-6">
                        {isHardware ? (
                            <p>Y to kick</p>
                        ) : isMobile ? (
                            <p>Y to kick</p>
                        ) : (
                            <p>R Click or K to kick</p>
                        )}
                    </div>

                    <div className="controlsText fs-6">
                        {isHardware ? (
                            <p>Use dpad or onscreen joystick to move</p>
                        ) : isMobile ? (
                            <p>Use onscreen joystick to move</p>
                        ) : (
                            <p>Use W,A,S,D to move</p>
                        )}
                    </div>
                </div>

                <div style={{
                    justifyContent: 'space-around',
                    paddingTop: '2vh',
                }}>
                    <h2 className="fs-3">
                        Features
                    </h2>

                    <div className="controlsText fs-6">
                        {isHardware ? (
                            <p>Red button on bottom left corner to chat</p>
                        ) : isMobile ? (
                            <p>Red button on bottom left corner to chat</p>
                        ) : (
                            <p>Press Enter to open chat Window</p>
                        )}

                    </div>
                    <div className="controlsText fs-6">
                        <p>Join a fight by attacking the Fight machine!</p>
                    </div>
                    <div className="controlsText fs-6">
                        <p>Smash rats for coins</p>
                    </div>
                    <div className="controlsText fs-6">
                        <p>Bet on fights and win!</p>
                    </div>

                </div>

                <div style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingTop: '4vh',
                    paddingBottom: "2vh"
                }}>
                </div>
            </div>
        </FightConfirmationBoxDiv>
    </Wrapper>
    return (
        <div
            onMouseOver={() => {
                dispatch(TurnMouseClickOff(true))
            }}
            onMouseOut={() => {
                dispatch(TurnMouseClickOff(false))
            }}
            style={{
                zIndex: 5
            }}
        >
            {
                showControls &&
                <div>
                    {
                        !getSystemInfo() ?
                            <Backdrop>
                                {View}
                            </Backdrop> :
                            <Backdrop2>
                                {View}
                            </Backdrop2>
                    }
                </div>
            }
        </div>
    )
}