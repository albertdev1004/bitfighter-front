// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IPlayerStats {
  user_wallet_address: string;
  fights_count: number;
  fights_won_count: number;
  fights_lost_count: number;
  bits_bet_won: number;
  bits_bet_lost: number;
  bits_bet_total: number;
  player_alias: string;
  xp: number;
  level: number;
  brews_purchased_count: number;
  brews_used_count: number;
  brew_used_count: number;
  rats_killed_count: number;
  messages_sent_count: number;
  created_at: string; // Or Date if you want to parse the date
  updated_at: string; // Or Date if you want to parse the date
}


interface PlayersData {
  nick_name: string,
  info_button_clicked: boolean,
  player_selected_all_info: any,
  current_game_player_info: any,

  gameStarted: boolean;
  mintGameStarted: boolean;
  mintingGameNftQuantity: number;

  xp: number;
  level: number;
  xpToNextLevel: number;


  playerStats: IPlayerStats;
}

const initialState: PlayersData = {
  nick_name: "",
  xp: 0,
  level: 0,
  xpToNextLevel: 0,
  info_button_clicked: false,
  player_selected_all_info: {},
  current_game_player_info: {},

  gameStarted: false,
  mintGameStarted: false,
  mintingGameNftQuantity: 0,


  playerStats: null
}

export const playerDataCollection = createSlice({
  name: 'playerDataCollection',
  initialState,
  reducers: {
    //Player Properties
    setNickName: (state: { nick_name: string; }, action: PayloadAction<string>) => {
      state.nick_name = action.payload;
    },

    SetPlayerStats: (state: { playerStats: number; }, action: PayloadAction<number>) => {
      state.playerStats = action.payload;
    },

    //Other stuff
    setInfoButtonClicked: (state: { info_button_clicked: boolean; }, action: PayloadAction<boolean>) => {
      state.info_button_clicked = action.payload;
    },
    SetPlayerSelected: (state: { player_selected_all_info: any; }, action: PayloadAction<any>) => {
      state.player_selected_all_info = action.payload;
    },

    SetCurrentGamePlayer: (state: { current_game_player_info: any; }, action: PayloadAction<any>) => {
      state.current_game_player_info = action.payload;
    },

    SetGameStarted: (state: { gameStarted: boolean; }, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },

    SetMintGameStarted: (state: { mintGameStarted: boolean; }, action: PayloadAction<boolean>) => {
      state.mintGameStarted = action.payload;
    },

    SetMintGameQuantity: (state: { mintingGameNftQuantity: number; }, action: PayloadAction<number>) => {
      state.mintingGameNftQuantity = action.payload;
    },

    // clearPlayerSelected: (state: { info_button_clicked: boolean; }, action: PayloadAction<boolean>) => {
    //   state.info_button_clicked = action.payload;
    // },
  },
})

export const { setNickName,
  setXP,
  setLevel,
  setXpToNextLevel,
  setInfoButtonClicked,
  SetPlayerSelected,
  SetCurrentGamePlayer,
  SetGameStarted,
  SetMintGameStarted,
  SetMintGameQuantity,

  SetPlayerStats
} =
  playerDataCollection.actions

export default playerDataCollection.reducer
