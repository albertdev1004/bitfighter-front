// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { enableMapSet } from 'immer'
import { configureStore } from '@reduxjs/toolkit'

import AuthStore from './AuthStore'
import AssetStore from './AssetStore'
import userGeoStore from './UserGeoStore'
import FightInfoStore from './FightsStore'
import playerDataStore from './PlayerData'
import chatMessageStore from './ChatStore'
import web3storeReducer from './Web3Store'
import MetaInfoStore from './MetaInfoStore'
import counterReducer from './CounterStore'
import textEditorReducer from './TextStore'
import bitfighterReducer from './BitFighters'
import userpathStore from './UserWebsiteStore'
import userActionsDataStore from './UserActions'
import web3StoreBalance from './Web3StoreBalances'
import NotificationStore from './NotificationStore'
import QueueDetailedInfo from './QueueDetailedInfo'
import WebsiteStateStore from './WebsiteStateStore'
import MintCardStateStore from './MintCardStateStore'

enableMapSet()

const store = configureStore({
  reducer: {
    authStore: AuthStore,
    assetStore: AssetStore,
    geoStore: userGeoStore,
    counter: counterReducer,
    editor: textEditorReducer,
    web3store: web3storeReducer,
    chatStore: chatMessageStore,
    userPathStore: userpathStore,
    metaInfoStore: MetaInfoStore,
    bitFighters: bitfighterReducer,
    fightInfoStore: FightInfoStore,
    playerDataStore: playerDataStore,
    web3BalanceStore: web3StoreBalance,
    notificatinoStore: NotificationStore,
    queueDetailedInfo: QueueDetailedInfo,
    websiteStateStore: WebsiteStateStore,
    mintCardStateStore: MintCardStateStore,
    userActionsDataStore: userActionsDataStore,
  },
  // Temporary disable serialize check for redux as we store MediaStream in ComputerStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
