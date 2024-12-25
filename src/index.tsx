// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
// import { Web3ReactProvider } from '@web3-react/core'
// import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers'

import './index.scss'
import './PhaserGame'
import App from './App'
import store from './stores'
import muiTheme from './MuiTheme'
import reportWebVitals from './reportWebVitals'
import { ParticleConnectkit } from './landing-page/MintUiDesign/connectkit'

const container = document.getElementById('root')!
const root = createRoot(container)

// function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
//   return new Web3Provider(provider)
// }

root.render(
  <Provider store={store}>
    <ThemeProvider theme={muiTheme}>
      {/* <Web3ReactProvider getLibrary={getLibrary}> */}
      <ParticleConnectkit>
        <App />
      </ParticleConnectkit>
      {/* </Web3ReactProvider> */}
    </ThemeProvider>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
