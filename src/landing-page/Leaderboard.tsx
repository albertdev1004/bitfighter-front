// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import Modal from '@mui/material/Modal';
import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import store from '../stores';
import { LeaderBoardData, SetLeaderBoardOpen } from '../stores/WebsiteStateStore';
import { getEllipsisTxt } from '../utils';
import { parseWBTCBalanceV2, parseWBTCBalanceV3 } from '../utils/web3_utils';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import { FN_PRIZES } from '../revamped/pages/leaderboard/FightNightTable';

const CenteredModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
 
`;
const ModalBoxWrapper = styled.div`
    background: #111B28;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;

    transform: 'translate(-50%, -50%)',

    h2 {
        font-family:'Cooper Black', sans-serif;
        font-style: bold;
        font-size: 40px;
        color: aliceblue;
        line-height: 75%;
    }

    h3 {
        font-family:'Cooper Black', sans-serif;
        font-style: bold;
        font-size: 30px;
        color: grey;
        line-height: 75%;
        padding-bottom: 10px;
    }
`

const Mytable = styled.table`
  font-family: sans-serif;
  box-shadow: 0 0 80px rgba(255, 255, 255, 0.2);
  font-size: 1vw;
  thead, tbody {
    display: table;
  width: 70vh;
     table-layout: fixed;
          @media only screen and (max-width: 775.98px) and (orientation: landscape) {
     width: 80vh;
    }
  }
  th, td {
    padding: 2px;
    text-align: center;
      overflow: hidden; /* Hides the overflowed content */
  text-overflow: ellipsis; /* Adds an ellipsis (...) for overflowed text */
  white-space: nowrap;
  }
  th {
    font-size: 0.9em; /* Font size for the table headers */
  }
  td {
    font-size: 0.9em; /* Smaller font size for table cells */
  }
  thead tr {
    background-color: #333;
    color: #fff;
  }
  tbody {
    display: block;
   max-height: 70vh;
    overflow-y: auto;
    
  }
  tbody tr {
    display: table;
    width: 70vh;
    table-layout: fixed; /* Ensures the columns have equal width */
         table-layout: fixed;
          @media only screen and (max-width: 775.98px) and (orientation: landscape) {
     width: 80vh;
    }
  }
  tbody tr:nth-child(even) {
    background-color: #333;
  }
`;

function Leaderboard() {

    const leaderboardOpen = useAppSelector((state) => state.websiteStateStore.leaderboardOpen);
    const leaderboardData = useAppSelector((state) => state.websiteStateStore.leaderboardData);

    // console.log("leader_debug", leaderboardData)

    const handleModalClose = () => {
        // console.log("handle modal close in leaderboard..")
        store.dispatch(SetLeaderBoardOpen(false))
    };
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    return (
        <CenteredModal
            open={leaderboardOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalBoxWrapper>
                <TabContext value={value} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"

                        sx={{
                            backgroundColor: '#111B28',
                            width: '100%',
                            justifyContent: 'center',
                            display: 'flex'
                        }}
                    >
                        <Tab value="1" label="All time" sx={{
                            fontWeight: 700,
                            fontSize: '16px'

                        }} />
                        <Tab value="2" label="Fight Night" sx={{
                            fontWeight: 700,
                            fontSize: '16x'
                        }} />
                    </Tabs>
                    <TabPanel value="1" sx={{ padding: '0px' }}>
                        <Mytable style={{ backgroundColor: 'black', overflowX: 'auto', padding: '0px' }}>
                            <thead>
                                <tr>
                                    <th>#Rank</th>
                                    {/* <th>Wallet</th> */}
                                    <th>Player</th>
                                    <th>Win</th>
                                    <th>Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.data.map((data: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {/* <td>{getEllipsisTxt(data.user_wallet_address)}</td> */}
                                        <td>{data.player_alias}</td>
                                        <td>{data.fights_won_count}</td>
                                        <td>{data.fights_lost_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Mytable>
                    </TabPanel>

                    <TabPanel value="2" sx={{
                        padding: '0px'
                    }}><Mytable style={{
                        backgroundColor: 'black',
                        overflowX: 'auto',
                        padding: '0px'
                    }}>
                            <thead>
                                <tr>
                                    <th>#Rank</th>
                                    {/* <th>Wallet</th> */}
                                    <th>Player</th>
                                    <th>Win</th>
                                    <th>Loss</th>
                                    <th>Prize</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    leaderboardData.tournament_data.map((data: any, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {/* <td>{getEllipsisTxt(data.user_wallet_address)}</td> */}
                                                <td>{data.player_alias}</td>
                                                <td>{data.wins_count}</td>
                                                <td>{data.loss_count}</td>
                                                <td>SPICE</td>
                                                <td>{FN_PRIZES[index]}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Mytable>
                    </TabPanel>
                </TabContext>
            </ModalBoxWrapper>
        </CenteredModal >
    );
}

export default Leaderboard;