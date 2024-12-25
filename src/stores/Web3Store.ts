// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface Web3Store {
  userAddress: string;
  loggedIn: boolean;
  web3Connected: boolean;
  web3Network: string;
  web2EmailAddress: string;
  minted_id: number;
  player_id: string;

  connectKitProcessed: boolean;
  connectionMode: string;
}

const initialState: Web3Store = {
  userAddress: "",
  loggedIn: false,
  web3Connected: false,
  web2EmailAddress: "",
  minted_id: 0,
  player_id: "",
  web3Network: "",
  connectKitProcessed: false,
  connectionMode: ''
}

export const web3StoreSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    Login: (state: { userAddress: string; loggedIn: boolean }, action: PayloadAction<string>) => {
      state.userAddress = action.payload;
      state.loggedIn = true;
    },

    SetConnectedNetwork: (state: { web3Network: string; }, action: PayloadAction<string>) => {
      state.web3Network = action.payload;
    },

    SetMintedIdForGame: (state: { minted_id: number; }, action: PayloadAction<number>) => {
      state.minted_id = action.payload;
    },

    SetPlayerIdForGame: (state: { player_id: string; }, action: PayloadAction<string>) => {
      state.player_id = action.payload;
    },

    LogOut: (state: { userAddress: string; loggedIn: boolean },) => {
      state.userAddress = "";
      state.loggedIn = false;
    },
    SetConnectedWeb3: (state: { web3Connected: boolean }, action: PayloadAction<boolean>) => {
      state.web3Connected = action.payload;
    },

    Web2Login: (state: { web2EmailAddress: string }, action: PayloadAction<string>) => {
      state.web2EmailAddress = action.payload;
    },

    Web2LoginV2: (state: { web2EmailAddress: string }, action: PayloadAction<string>) => {
      state.web2EmailAddress = action.payload;
    },

    SetConnectKitProcessed: (state: { web2EmailAddress: string }, action: PayloadAction<boolean>) => {
      state.connectKitProcessed = action.payload;
    },


    SetConnectionMode: (state: { connectionMode: string }, action: PayloadAction<string>) => {
      state.connectionMode = action.payload;
    },

  },
})

export const { Login, LogOut, SetConnectionMode, SetConnectedWeb3, Web2LoginV2, Web2Login, SetMintedIdForGame, SetPlayerIdForGame, SetConnectedNetwork, SetConnectKitProcessed } =
  web3StoreSlice.actions

export default web3StoreSlice.reducer
