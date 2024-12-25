// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface NotificationStore {
  successNotificationBool: boolean,
  successNotificationMessage: string,

  failureNotificationBool: boolean,
  failureNotificationMessage: string

  newLevelNotificationBool: boolean,
  newLevelNotificationMessage: string

  rewardNotificationBool: boolean,
  rewardNotificationMessage: string
}

const initialState: NotificationStore = {
  successNotificationBool: false,
  successNotificationMessage: "",
  failureNotificationBool: false,
  failureNotificationMessage: "",
  newLevelNotificationBool: false,
  newLevelNotificationMessage: "",
  rewardNotificationBool: false,
  rewardNotificationMessage: ""
}

export const NotificationStore = createSlice({
  name: 'notification_store',
  initialState,
  reducers: {
    //Happy message
    SetSuccessNotificationBool: (state: { successNotificationBool: boolean; }, action: PayloadAction<boolean>) => {
      state.successNotificationBool = action.payload;
      // console.log("mouse clikced? ", action.payload)
    },
    SetSuccessNotificationMessage: (state: { successNotificationMessage: string; }, action: PayloadAction<string>) => {
      state.successNotificationMessage = action.payload;
    },
    //Sad message
    SetFailureNotificationBool: (state: { failureNotificationBool: boolean; }, action: PayloadAction<boolean>) => {
 
      state.failureNotificationBool = action.payload;
    },
    SetFailureNotificationMessage: (state: { failureNotificationMessage: string; }, action: PayloadAction<string>) => {
      state.failureNotificationMessage = action.payload;
    },
    //Message when you reach a new level
    SetNewLevelNotificationBool: (state: { newLevelNotificationBool: boolean; }, action: PayloadAction<boolean>) => {
      state.newLevelNotificationBool = action.payload;
    },
    SetNewLevelNotificationMessage: (state: { newLevelNotificationMessage: string; }, action: PayloadAction<string>) => {
      state.newLevelNotificationMessage = action.payload;
    },
    //Message when you receive a reward
    SetRewardNotificationBool: (state: { rewardNotificationBool: boolean; }, action: PayloadAction<boolean>) => {
      state.rewardNotificationBool = action.payload;
    },
    SetRewardNotificationMessage: (state: { rewardNotificationMessage: string; }, action: PayloadAction<string>) => {
      state.rewardNotificationMessage = action.payload;
    },
  },
})

export const { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } = NotificationStore.actions

export default NotificationStore.reducer
