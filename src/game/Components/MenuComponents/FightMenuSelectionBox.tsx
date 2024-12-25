// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SelectFightInFightMachineMenu, SetMouseClickControlFightMachine, TurnMouseClickOff } from '../../../stores/UserActions';
import store from '../../../stores';
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../../../stores/UserWebsiteStore';

const Wrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 20%;

     @media only screen and (max-width: 768px) {
    width:50%;
    }
    @media only screen and (max-width: 1000px) {
    width:80%;
    }

`;

const Modal = styled(Box)`
    width: 50%;
    overflow: auto;
    opacity: 0.9;
    background: #2c2c2c;
    border: 5px solid #000000;
    border-radius: 10px;
    
    padding: 30px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;

    justify-content: center;
    align-items: center;

    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 20px;
    }

    h2, h3 {
        font-family: Monospace;
        font-style: bold;
        font-size: 22px;
        color: white;
        line-height: 75%;
    }

    input {
        color: black;
    }

    button{
        width: 90%;
        height: 4vh;
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        width: 30%;
        gap: 20px;
        padding: 20px;

        button{
            width: 90%;
            height: 8vh;
        }
    }
`
const ButtonView = styled(Button)`
    span {
        color: black;
        font-style: bold;
        font-size: 20px;
        font-family:'Cooper Black', sans-serif;
    }

    background-color: #9c341a;
    border-radius: 16px;

    &:hover {
        background-color: #852d17;
    }

    width: 200px;
    height: 60px;
`;

export default function FightMenuSelectionBox(data: any) {
    const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
    const dispatch = useAppDispatch()

    const closeFunction = () => {
        console.log("debug_mouse in close fn fight selectinog box")
        // dispatch(TurnMouseClickOff(false))
        dispatch(SetMouseClickControlFightMachine(false))
    }
    return (
        <Wrapper
            ref={ref}
            onMouseOver={() => {
                dispatch(SetMouseClickControlFightMachine(true))
            }}
            onMouseOut={() => {
                dispatch(SetMouseClickControlFightMachine(false))
            }}
        >
            <Modal>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        store.dispatch(SelectFightInFightMachineMenu(true))
                        dispatch(TurnMouseClickOff(false))
                    }}
                >
                    <span style={{
                        color: 'aliceblue'
                    }}>Fight</span>
                </Button>


                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        dispatch(TurnMouseClickOff(false))
                        store.dispatch(ChangeShowQueueBox(true))
                        store.dispatch(ChangeShowMenuBox(true))
                    }}
                >
                    <span style={{
                        color: 'aliceblue'
                    }}>Bet</span>
                </Button>
            </Modal>
        </Wrapper>
    )
}