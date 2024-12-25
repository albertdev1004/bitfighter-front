// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import * as React from 'react';
import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


import styled from 'styled-components';
import { isNullOrUndefined } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../../hooks';
import phaserGame from '../../../PhaserGame';
import store from '../../../stores';
import Game from '../../scenes/Game';

interface IAttributes {
    defense?: number,
    punchpower?: number,
    kickpower?: number,
    speed?: number,
    stamina?: number,
    health?: number,
    nickName?: string,
    all_aps?: any;
}

const ColoredH1 = styled.div`
  padding: 1px;
  margin: 1px;
  h2, h3 {
    font-family: Monospace;
    // font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }
`
const StatusText = styled.div`
  width: 100%;
  color: white;
`;
const YourStatusText = styled.div`
  font-size: 2wv;
  width: 100%;
  color: white;
`;
const td = styled.div`
  font-size: 1px;
  width: 100%;
  color: red;
`;
const label = { inputProps: { 'aria-label': 'Switch demo' } };

export function MyGangView(data: any) {
    return (
        <div>
            <StatusText>
                Create your gang here
            </StatusText>
        </div>
    )
}

export default function GangView(data: any) {
    const game = phaserGame.scene.keys.game as Game;
    const [playerData, setPlayerData] = useState<IAttributes>();

    useEffect(() => {
        const pdata: IAttributes = {}
        const arr = Array.from(game.otherPlayers.keys());
        for (let i = 0; i < arr.length; i++) {
            const otherPlayer = game.otherPlayers.get(arr[i])
            if (otherPlayer?.wallet_address === store.getState().web3store.userAddress) {
                pdata.defense = otherPlayer.gameObject?.extra_data?.defense;
                pdata.health = otherPlayer.gameObject?.max_health;
                pdata.kickpower = otherPlayer.gameObject?.extra_data?.kickpower;
                pdata.punchpower = otherPlayer.gameObject?.extra_data?.punchpower;
                pdata.stamina = otherPlayer.gameObject?.max_stamina;
                pdata.speed = otherPlayer.gameObject?.extra_data?.speed;
                pdata.nickName = otherPlayer.nick_name;
                pdata.all_aps = otherPlayer.all_aps;
            }
        }
        setPlayerData(pdata);
    }, [])

    return (
        <div>
            <div key={uuidv4()} style={{
                // color: '#C1D5EE',
            }}>
                <table style={{ position: 'relative' }}>
                    <tbody>
                        <StatusText>
                            Gang: Promo       
                            <br />
                            Leader: Dr. Bitz
                            <br />
                            Members: 11
                            <br />
                             Your Title: Fighter   
                        </StatusText>
                        <YourStatusText>Your Rewards: 0<ButtonGroup variant="contained" aria-label="Basic button group">
                            <Button>Claim</Button>
                        </ButtonGroup> </YourStatusText>
                        {/* <YourStatusText>Rank: 100      Loyalty Rank: 100</YourStatusText> */}
                        <YourStatusText>Your Claimed Rewards: 0</YourStatusText>
                        <br />
                        <ButtonGroup
                            variant="contained"
                            aria-label="Basic button group"
                            orientation="vertical"
                            justification="center"
                        >
                            {/* <Button>Pay Tribute</Button> */}
                            {/* <Button
                                color="error"
                            >Switch Gangs</Button> */}
                        </ButtonGroup>
                    </tbody>
                </table>
                <br />
                <table style={{
    width: '100%',
    backgroundColor: 'black',
    borderCollapse: 'collapse', // Ensure borders don't double up
}}>
    {
        (!isNullOrUndefined(playerData) && Object.keys(playerData).length > 0) ?
            <tbody>
                <tr key={uuidv4()} style={{ borderBottom: '1px solid white' }}>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Rank</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Title</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Member</td>
                </tr>
                <tr key={uuidv4()} style={{ borderBottom: '1px solid white' }}>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>1</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Doctor</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Dr. Bitz</td>
                </tr>
                <tr key={uuidv4()} style={{ borderBottom: '1px solid white' }}>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>2</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>Fighter</td>
                    <td style={{
                        padding: '8px', 
                        border: '1px solid white', 
                        color: 'white'
                    }}>{!isNullOrUndefined(playerData) && !isNullOrUndefined(playerData?.all_aps) && Object.keys(playerData).length > 0 && playerData?.nickName}</td>
                </tr>
                {/* Repeat for other rows */}
            </tbody>
            :
            <></>
    }
</table>

            </div>
        </div>
    )
}

