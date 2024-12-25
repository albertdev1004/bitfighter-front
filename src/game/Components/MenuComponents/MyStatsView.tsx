// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
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
const label = { inputProps: { 'aria-label': 'Switch demo' } };
export default function MyStatsView(data: any) {
  const game = phaserGame.scene.keys.game as Game;
  const [playerData, setPlayerData] = useState<IAttributes>();
  const [isSwitchOn, setIsSwitchOn] = useState(false); // Controls the switch state
  const [isButtonOn, setIsButtonOn] = useState(false); // Controls the PK button state (On/Off)
  const [cooldown, setCooldown] = useState(0); // Tracks the cooldown time
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false); // Disable the safety switch

  const startCooldown = () => {
    setCooldown(30); // Start the countdown from 30 seconds
    //setIsSwitchDisabled(true); // Disable the safety switch during cooldown

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsButtonOn(false); // After cooldown, reset PK Mode to "Off"
          setIsSwitchOn(false); // Turn the safety switch back to "Off"
          setIsSwitchDisabled(false); // Re-enable the safety switch after cooldown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle the safety switch toggle
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    // If the switch is toggled off while PK Mode is on, start cooldown
    if (!checked && isButtonOn) {
      startCooldown(); // Begin cooldown and disable the button
    }
    setIsSwitchOn(checked);
  };

  // Handle the PK Mode button click
  const handleToggleButtonClick = () => {
    // Only allow toggling the button if the switch is on
    if (isButtonOn && cooldown === 0) {
      // If the button is "On" and toggled "Off", start cooldown
      startCooldown();
    } else if (isSwitchOn && !isButtonOn) {
      // Turn PK Mode "On" only if the switch is active
      setIsButtonOn(true);
      setIsSwitchOn(false);
      setIsSwitchDisabled(true); // Disable the safety switch when PK Mode is turned on
    }
  };
  // const temp = (this.totalExperienceValue / 1000) * (store.getState().playerDataStore?.playerStats?.xp || 0)

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

        <div style={{ position: 'relative' }}>
          <StatusText>
            Name: {!isNullOrUndefined(playerData) && !isNullOrUndefined(playerData?.all_aps) && Object.keys(playerData).length > 0 && playerData?.nickName}
          </StatusText>
          <StatusText>Level: {store.getState().playerDataStore?.playerStats?.level || 0} _        XP: {store.getState().playerDataStore?.playerStats?.xp || 0}</StatusText>
          <StatusText>XP to Level: {store.getState().playerDataStore?.playerStats?.xpToNextLevel || 0} </StatusText>
          {/* <StatusText>Total XP: {store.getState().playerDataStore?.playerStats?.xp || 0} </StatusText> */}
          <StatusText>
            <Switch
              checked={isSwitchOn}
              onChange={handleSwitchChange}
              disabled={isSwitchDisabled || cooldown > 0} // Disable the switch if PK Mode is on or during cooldown
              color="primary"
            />
            PK Mode:{' '}
            <ToggleButton
              value="web"
              disabled={cooldown > 0} // Disable the button during cooldown or if the switch is off
              onClick={handleToggleButtonClick}
              style={{
                backgroundColor: isButtonOn ? 'red' : '', // Red when "On"
                color: isButtonOn ? 'white' : '', // Optional color change when "On"
              }}
            >
              {cooldown > 0 ? cooldown : isButtonOn ? 'On' : 'Off'} {/* Display countdown or "On"/"Off" */}
            </ToggleButton>
          </StatusText>
          <br />
        </div>


        <table style={{
          width: `100%`,
          backgroundColor: 'black'
        }}>
          {
            (!isNullOrUndefined(playerData) && Object.keys(playerData).length > 0) ?
              <tbody>
                <tr key={uuidv4()}>
                  <td>AP</td>
                  <td>Attribute</td>
                  <td>Value</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.defense}</td>
                  <td>Defense</td>
                  <td>{playerData.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.punchpower}</td>
                  <td>Punch</td>
                  <td>{playerData.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.kickpower}</td>
                  <td>Kick</td>
                  <td>{playerData.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.speed}</td>
                  <td>Speed</td>
                  <td>{playerData.speed}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.health}</td>
                  <td>Health</td>
                  <td>{playerData.health}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.stamina}</td>
                  <td>Stamina</td>
                  <td>{playerData.stamina}</td>
                </tr>
              </tbody>
              :
              <>

              </>
          }
        </table>
      </div>
    </div>
  )
}