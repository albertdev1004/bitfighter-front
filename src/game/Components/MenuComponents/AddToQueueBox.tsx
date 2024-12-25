// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
// import { useAppDispatch, useAppSelector } from "../../hooks"
import * as React from 'react';
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import Switch from '@mui/material/Switch';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import WavesRoundedIcon from '@mui/icons-material/WavesRounded';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SetMouseClickControlFightMachine, TurnMouseClickOff } from '../../../stores/UserActions';
import store from "../../../stores";
import { Col, Row } from 'react-bootstrap';
const GameInfoBox = styled(Box)`
    justify-content: center;  /* Center vertically */
    align-items: center;      /* Center horizontally */
    width: 60%;
    height:36%;
    background: #2c2c2c;
    border: 4px solid #000000;
    border-radius: 10px;
    opacity: 0.9;
     position: fixed;
    //max-height: calc(100vh - 150px); /* Adjust based on the viewport */
    //overflow: visible; /* Allow the content to be visible without scrolling */
   input {
        color: black;
        width: 30%; /* Set desired width of the input */
        border-radius: 5px; /* Rounded corners */
    }
    @media only screen and (max-width: 900px) and (orientation: landscape) {
        width: 80%;
        height:75%;
    }
    @media only screen and (max-height: 900px) and (orientation: portrait) {
        width: 100%;
        height:40%;
        top: 1%;
    }
`
const StyledRow = styled(Row)`
    
`;
const ModalHeader = styled.div`
    color: white;
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    text-align: center; /* Center text horizontally */
      @media only screen and (max-width: 900px) and (orientation: landscape) {
        width: 100%;
        height:100%;
        font-size: 20px;
    }
    @media only screen and (max-height: 900px) and (orientation: portrait) {
        width: 100%;
        height:100%;
        font-size: 20px;
    }
`

const ModalContent = styled.div`

    color: white;
    font-family: 'Cooper Black', sans-serif;
    font-size: 18px;
    text-align: center; /* Center text horizontally */
      @media only screen and (max-width: 900px) and (orientation: landscape) {
        width: 100%;
        height:100%;
        font-size: 16px;
    }
    @media only screen and (max-height: 900px) and (orientation: portrait) {
        width: 100%;
        height:100%;
        font-size: 16px;
    }
`
const DividerLine = styled.hr`
    border: none;
    border-top: 3px solid white; /* Customize the line thickness and color */
    width: 100%;                  /* Adjust the width of the line */
    margin: 1px auto;            /* Center the line and add space around it */
`;
export default function AddToQueueBox(data: IQueueOptions) {
    const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
    const dispatch = useAppDispatch();
    const [dark, setDark] = React.useState<boolean>(false);

    return (
        <div ref={ref} style={{
            display: "flex",
            alignItems: "center", /* Center vertically */
            justifyContent: "center", /* Center horizontally */
            height: "100vh", /* Take full height of the viewport */
        }}
            onMouseOver={() => {
                dispatch(SetMouseClickControlFightMachine(true));
            }}
            onMouseOut={() => {
                dispatch(SetMouseClickControlFightMachine(false));
            }}>
            <GameInfoBox
                sx={{ display: 'grid', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <StyledRow>
                    <ModalHeader>Genesis HQ: Tier 5</ModalHeader>
                </StyledRow>
                <DividerLine />
                <StyledRow>
                    <Col>
                        <ModalContent>Rules: 1v1</ModalContent>
                    </Col>
                    <Col>
                        <ModalContent>Time: 1 min</ModalContent>
                    </Col>
                </StyledRow>
                <StyledRow>
                    <Col>
                        <ModalContent>Min Bet: 0</ModalContent>
                    </Col>
                    <Col>
                        <ModalContent>Max Bet: None</ModalContent>
                    </Col>
                </StyledRow>
                <StyledRow>
                    <Col>
                        <ModalContent>Ante: {(data.ANTE).toLocaleString()} {store.getState().web3store.web3Connected ? "Bits" : "Coins"}</ModalContent>
                    </Col>
                    <Col>
                        <ModalContent>Bet:
                            <input
                                type="number"
                                placeholder='0'
                                onChange={(e) => {
                                    let tempString = e.target.value;
                                    if (e.target.value === "") {
                                        data.setAmount(0);
                                    } else {
                                        if (tempString.startsWith("0") && tempString.length > 1) {
                                            tempString = tempString.slice(1);
                                        }
                                        data.setAmount(parseInt(tempString));

                                    }
                                }}
                            />
                        </ModalContent>
                    </Col>
                </StyledRow>

                <StyledRow className='d-flex justify-content-center'>
                    <Button
                        style={{ width: "70%" }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            data.enterQueue();
                            dispatch(TurnMouseClickOff(false));
                        }}>
                        <ModalContent>Fight!</ModalContent>
                    </Button>
                </StyledRow>
                <StyledRow>
                    <Box display="flex" alignItems="center">
                        {/* Start Decorator Image (Before the Switch) */}
                        {/* <img
                            className='user-select-none'
                            src="bitfgihter_assets/items/coin.gif"
                            alt="Coins"
                            style={{ height: '30px', marginRight: '1px' }} // Adjust image size and spacing
                        /> */}

                        {/* Switch */}
                        {/* <Switch
                            color={dark ? 'primary' : 'secondary'} // Adjust color based on `dark` state
                            checked={dark}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDark(event.target.checked)}
                        /> */}

                        {/* End Decorator Image (After the Switch) */}
                        {/* <img
                            className='user-select-none'
                            src="bitfgihter_assets/items/bit.gif"
                            alt="Bits"
                            style={{ height: '30px', marginLeft: '1px' }} // Adjust image size and spacing
                        /> */}
                        <ModalContent>Total Wager: {(data.ANTE + data.amount).toLocaleString()}</ModalContent>

                    </Box>

                </StyledRow>
            </GameInfoBox>
        </div>
    );
}
