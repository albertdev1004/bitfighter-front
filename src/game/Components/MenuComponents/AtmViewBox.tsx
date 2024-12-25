// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import styled from 'styled-components'
import { Box } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { parseWBTCBalanceV2, parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { getEllipsisTxt } from '../../../utils';
import store from '../../../stores';
import { unmountComponentAtNode } from 'react-dom';
import { useEffect } from 'react';

const Wrapper = styled.div`
    display: flex;
    position: relative;
    width: 55vw;
    overflow: auto;
    left: -8vw;

    
`

const TableWrapper = styled.div`

    th, td {
        border: 2px solid #000;
    }
    th {
        font-size: 20px;
    }
    td {
        font-size: 30px;
        color: blue;
    }
    input::placeholder {
        font-size: 20px;
    }
  
    padding-bottom: 20px;

    /* Landscape mode: Adjusting font size */
    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        td {
            font-size: 15px;
        }
        th {
            font-size: 10px;
        }
        padding-bottom: 5px;
    }

    /* Portrait mode: Adjusting font size */
    @media only screen and (orientation: portrait) {
     
        td {
            font-size: 8px; /* Adjust as needed */
        }
        th {
            font-size: 8px; /* Adjust as needed */
        }
        span {
            font-size: 18px;
        }
        h2 {
            font-size: 1px;
        }
        input::placeholder {
            font-size: 10px;
        }
         
    }
`

const ATMBOX = styled(Box)`
    position: relative;
    width: 30vw;

    overflow: auto;
    opacity: 0.8;
    background: #def0ee;
    border: 15px solid #fa6931;
    border-radius: 10px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto; 
    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 20px;
      
    }
    h2 {
        font-family: Monospace;
        font-style: bold;
        font-size: 34px;
        color: black;
    }
    input:focus {
        outline: none;
    }

    / Bit Boy 640x480 mode: Adjusting input width and font sizes */
    @media only screen and (max-height: 480px) {
    width: 50vw;
    height: 50vh;
        span {
            font-size: 20px;
        }
        h2 {
            font-size: 17px;
        }
       
    }

   /* Landscape mode: Adjusting input width and font sizes */
    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
    width: 50vw;
    height: 70vh;
        span {
            font-size: 20px;
        }
        h2 {
            font-size: 17px;
        }
       
    }

    /* Portrait mode: Adjusting input width and font sizes */
    @media only screen and (orientation: portrait) {
    width: 80vw;
     height: 40vh;
   left: -18vw;
        span {
            font-size: 28px; 
            text-align: center;
        }
        h2 {
            font-size: 15px; 
        }
     
    }
`
const ResponsiveInput = styled.input`
  width: 200px; /* Default width for landscape */

  @media only screen and (orientation: portrait) {
    width: 50px; /* Width for portrait mode */
  }
`;
interface IQueueOptions {
    amount: number;
    closeFunction: any,
    setAmount: any,
    AddMoneyToWallet: any,
    RemoveFromWallet: any
    // enterQueue: any
}

export default function AtmViewBox(data: IQueueOptions) {
    const wbtcBalance = useAppSelector((state) => state.web3BalanceStore.wbtcBalance);
    const betBalance = useAppSelector((state) => state.web3BalanceStore.betBalance);
    const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance);
    return (
        <ATMBOX>
            <h1 className='text-center'>
                ATM
            </h1>
            <span style={{ color: 'red', fontSize: '14px', fontWeight: 600 }}>
                {store.getState().web3store.web3Connected ? '' : 'No Wallet Detected!'}
            </span>
            <TableWrapper>
                <table style={{
                    width: '100%'
                }}>
                    <thead>
                        <tr>
                            <th>
                                {store.getState().web3store.web3Connected
                                    ? `Connected Wallet: ${getEllipsisTxt(store.getState().web3store.userAddress)}`
                                    : 'Welcome!'}
                            </th>
                            <th>{store.getState().web3store.web3Connected ? 'In game' : ''}</th>
                            <th>{store.getState().web3store.web3Connected ? 'Amount to Transfer' : 'Connect to Transfer'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {store.getState().web3store.web3Connected
                                    ? parseWBTCBalanceV2(wbtcBalance)
                                    : 'Connect a Wallet'}
                            </td>
                            <td>
                                {store.getState().web3store.web3Connected
                                    ? parseWBTCBalanceV2(web2_credit_balance)
                                    : ''}
                            </td>
                            <td>
                                {store.getState().web3store.web3Connected ? (
                                    <ResponsiveInput
                                        type="number"
                                        placeholder="Enter Bits"
                                        value={data.amount}
                                        onChange={(e) => data.setAmount(e.target.value)}
                                    />
                                ) : (
                                    ''
                                )}
                            </td>

                        </tr>
                    </tbody>
                </table>

            </TableWrapper>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center", gap: "30px" }} className='m-3'>
                <button
                    style={{
                        backgroundColor: '#75c850',
                        borderRadius: "10px",
                        height: "35px",
                        width: "150px"
                    }}
                    onClick={() => data.AddMoneyToWallet()}
                >
                    <span className="fs-5" style={{
                        color: 'aliceblue'
                    }}>Deposit</span>
                </button>
                <button
                    style={{
                        backgroundColor: '#af3708',
                        borderRadius: "10px",
                        height: "35px",
                        width: "150px"
                    }}
                    onClick={() => data.RemoveFromWallet()}
                >
                    <span className="fs-5" style={{
                        color: 'aliceblue'
                    }}>Withdraw</span>
                </button>
            </div>
            <div className='text-center'>
                <h6>
                    {store.getState().web3store.web3Connected ? '40 bit fee on all withdraws.' : 'Connect Wallet to Use ATM'}

                </h6>
            </div>
        </ATMBOX>
    )
}