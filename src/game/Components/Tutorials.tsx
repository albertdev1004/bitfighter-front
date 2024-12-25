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
    left: 30%;
    height: 80%;
    width: 40%;
    //z-index: 1;
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
    background: #000000;
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
        color: white;
    }

    .controlsText {
        font-family: Monospace;
        font-style: bold;
        color: white;
        background: rgb(84, 86, 86);
    }
`

export function Tutorials() {
    // const showControls = useAppSelector((state) => state.userPathStore.showFightTutorials)
    // console.log
    const showControls = false
    const dispatch = useAppDispatch();
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
    const View = <Wrapper>
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
                        Want to fight me?
                    </h2>

                    <br />
                    <br />

                    <span>
                        Let's meet in the ring. I' ll kick your ass.
                    </span>
                    <br />
                    <br />

                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                        <span>
                            You have to go to the fight machine.
                        </span>
                        <div>
                            <img src={'/assets/goLeft.webp'} alt="Left" />
                        </div>


                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                        <span>
                            and
                        </span>
                        <div>
                            <img src={'/assets/hitThis.webp'} alt="Left" />
                        </div>


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