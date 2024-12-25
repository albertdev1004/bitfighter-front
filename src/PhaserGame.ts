// @ts-nocheck
/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/no-unused-vars: off */

import Phaser from 'phaser'
import Rat from './game/scenes/Rat'
import Game from './game/scenes/Game'
import Bootstrap from './game/scenes/Bootstrap'
import Background from './game/scenes/Background'
import JackPotGame from './game/scenes/JackPotGame'
import MintingGame from './game/scenes/MintingGame'
import BigWinScreen from './game/scenes/BigWinScreen'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  antialias: false,
  backgroundColor: '#111b28',
  pixelArt: true,
  seed: [(Date.now() * Math.random()).toString()],
  scale: {
    parent: 'phaser-container',
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  resolution: window.devicePixelRatio || 1, // Ensures high-DPI rendering
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
    roundPixels: false,
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  disableContextMenu: true,
  autoFocus: true,
  scene: [Bootstrap, Background, MintingGame, Game, JackPotGame, BigWinScreen],
  input: {
    activePointers: 3,
  },
}

const phaserGame = new Phaser.Game(config)
;(window as any).game = phaserGame

export default phaserGame
