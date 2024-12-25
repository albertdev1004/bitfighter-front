// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import Phaser from 'phaser'
import { UpdateUserNetwork } from '../../hooks/ApiCaller'
import store from '../../stores'

import { SetGameStarted } from '../../stores/PlayerData'
import { ShowWinnerCardAtFightEnd } from '../../stores/UserWebsiteStore'
import { SetShowingJackpotWheel } from '../../stores/WebsiteStateStore'

import selectMusicPath from 'url:../../assets/bitfgihter_assets/sounds/select_sound.mp3'
import bgImage from 'url:../../assets/bitfgihter_assets/landing-page-about-section-bg.webp'
import infoIcon from 'url:../../assets/bitfgihter_assets/info_icon.png'
import beginnerIcon from 'url:../../assets/bitfgihter_assets/player/beginner.png'
import joyA from 'url:../../assets/bitfgihter_assets/joystick/joyA.png'
import joyB from 'url:../../assets/bitfgihter_assets/joystick/joyB.png'
import brewCan from 'url:../../assets/bitfgihter_assets/brew/BREW.png'
import getXP from 'url:../../assets/bitfgihter_assets/sounds/soundFX/getXP.mp3'
import getLevel from 'url:../../assets/bitfgihter_assets/sounds/soundFX/getLevel.mp3'
// Continue importing other assets similarly...

// Spritesheets and Maps
import ratSpritesheet from '../../assets/bitfgihter_assets/rat.png'
import smokeScreen from '../../assets/bitfgihter_assets/FX/smokeScreen.png'
import ratGibs from '../../assets/bitfgihter_assets/FX/ratGibs.png'
import hqSpriteSheet from 'url:../../assets/new_assets/map/HQ_Sprite_Sheet_Extruded.png'
import xmasSpriteSheet from '../../assets/new_assets/map/xMas_Sprite_Sheet_Extruded.png'

import buttonHoverPath from 'url:../../assets/bitfgihter_assets/sounds/buttonHover.wav'
import buttonDownPath from 'url:../../assets/bitfgihter_assets/sounds/buttonDown.mp3'
import cloud_chat_bubble from 'url:../../assets/bitfgihter_assets/cloud_chat_bubble.png'

import uhOhSound from 'url:../../assets/bitfgihter_assets/sounds/rats/uhOh.mp3'
import ratDie1Sound from 'url:../../assets/bitfgihter_assets/sounds/rats/ratDie1.mp3'
import ratDie2Sound from 'url:../../assets/bitfgihter_assets/sounds/rats/ratDie2.mp3'
import ratDie3Sound from 'url:../../assets/bitfgihter_assets/sounds/rats/ratDie3.mp3'
import ratDie4Sound from 'url:../../assets/bitfgihter_assets/sounds/rats/ratDie4.mp3'

// Dr. Bitz Voices
import jackpotSpin from 'url:../../assets/bitfgihter_assets/sounds/drBitz/jackpotSpin.mp3'
import drBitzTooBad from 'url:../../assets/bitfgihter_assets/sounds/drBitz/tooBad.mp3'
import congratulations from 'url:../../assets/bitfgihter_assets/sounds/drBitz/congratulations.mp3'

// Music
import jackpotMusic from 'url:../../assets/bitfgihter_assets/sounds/gameMusic/jackpotMusic.mp3'

// Sound FX
import jackpotWheelSpinSFX from 'url:../../assets/bitfgihter_assets/sounds/soundFX/jackpotWheelSpinSFX.mp3'
import errMusic from 'url:../../assets/bitfgihter_assets/sounds/err_sound.mp3'

// Fight Sound FX
import hit01Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit01.mp3'
import hit02Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit02.mp3'
import hit03Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit03.mp3'
import hit04Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit04.mp3'
import hit05Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit05.mp3'
import hit06Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit06.mp3'
import hit07Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit07.mp3'
import hit08Sound from 'url:../../assets/bitfgihter_assets/sounds/soundFX/fight/hit08.mp3'

// Coin Sounds
import coinGet from 'url:../../assets/bitfgihter_assets/sounds/soundFX/coinGet.mp3'
import coinDrop from 'url:../../assets/bitfgihter_assets/sounds/soundFX/coinDrop.mp3'

// Fight Tracks
import fightMusic1 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Ayumi.mp3'
import fightMusic2 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/BullDancer.mp3'
import fightMusic3 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Deeper.mp3'
import fightMusic4 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Destined.mp3'
import fightMusic5 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Detroit.mp3'
import fightMusic6 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Haiba.mp3'
import fightMusic7 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Maji_Break.mp3'
import fightMusic8 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/penguins_on_ice.mp3'
import fightMusic9 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/run_with_me.mp3'
import fightMusic10 from 'url:../../assets/bitfgihter_assets/sounds/new_fight_tracks/Wolfpack.mp3'

// Boop Music
import boopMusic from 'url:../../assets/bitfgihter_assets/sounds/boop01.mp3'

// DrBitz FX
import soundDrbitzReady from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/ready.mp3'
import fightStartMusic from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/fight01.mp3'
import soundDrbitzYouwin from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/youWin.mp3'
import soundDrbitzYoulose from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/youLose.mp3'
import soundDrbitzSpicy01 from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/spicy01.mp3'
import soundDrbitzSpicy02 from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/spicy02.mp3'
import soundDrbitzSpicy03 from 'url:../../assets/bitfgihter_assets/sounds/soundFX/drBitz/spicy03.mp3'

// Miscellaneous Sounds
import snapSound from 'url:../../assets/bitfgihter_assets/sounds/snap01.mp3'
import buttonPressSound from 'url:../../assets/bitfgihter_assets/sounds/button01.mp3'
import canOpenSound from 'url:../../assets/bitfgihter_assets/sounds/brewCanOpen.mp3'
import drBitzSuccessSound from 'url:../../assets/bitfgihter_assets/sounds/Success.mp3'

// Swing Sounds
import swingSound1 from 'url:../../assets/bitfgihter_assets/sounds/swing01.mp3'
import swingSound2 from 'url:../../assets/bitfgihter_assets/sounds/swing02.mp3'
import swingSound3 from 'url:../../assets/bitfgihter_assets/sounds/swing03.mp3'
import swingSound4 from 'url:../../assets/bitfgihter_assets/sounds/swing04.mp3'

// Button Sounds (using variables for button paths)
import buttonHover from 'url:../../assets/bitfgihter_assets/sounds/buttonHover.wav'
import buttonDown from 'url:../../assets/bitfgihter_assets/sounds/buttonDown.mp3'

// Coin Atlas
import silverCoinImage from 'url:../../assets/bitfgihter_assets/silver_coin.png'

// Jackpot Assets
import jackpotTriangleImage from 'url:../../assets/bitfgihter_assets/jackpot_assets/triangle.png'
import jackpotBfImage from 'url:../../assets/bitfgihter_assets/jackpot_assets/bf.png'

// Tutorial Images
import goLeftTutorialImage from 'url:../../assets/assets/goLeft.webp'
import hitBoxTutorialImage from 'url:../../assets/assets/hitThis.webp'

import drBitz from 'url:../../assets/bitfgihter_assets/jackpot_assets/bitz.png'

import silverCoinJson from '../../assets/bitfgihter_assets/silver_coin.json'
import hqJSON from '../../assets/new_assets/map/HQ.json'

console.log('hq_map json location ', hqJSON, silverCoinJson)

// const hqJSON = require('../../assets/new_assets/map/HQ.json');
// const silverCoinJson = require("../../assets/bitfgihter_assets/silver_coin.json");

enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Bootstrap extends Phaser.Scene {
  select_music!: Phaser.Sound.BaseSound
  err_music!: Phaser.Sound.BaseSound
  snap_sound!: Phaser.Sound.BaseSound
  button_press_sound!: Phaser.Sound.BaseSound
  dr_bits_success_sound!: Phaser.Sound.BaseSound
  button_hover_sound!: Phaser.Sound.BaseSound
  button_down_sound!: Phaser.Sound.BaseSound
  can_open_sound!: Phaser.Sound.BaseSound
  dr_bits_tooBad_sound!: Phaser.Sound.BaseSound
  uhOh_sound!: Phaser.Sound.BaseSound
  ratDie1_sound!: Phaser.Sound.BaseSound
  ratDie2_sound!: Phaser.Sound.BaseSound
  ratDie3_sound!: Phaser.Sound.BaseSound
  ratDie4_sound!: Phaser.Sound.BaseSound

  constructor() {
    super('bootstrap')
    console.log('running constructor bootstrap.. ')
  }

  preload() {
    console.log('running preload of bootstrap.. ')

    this.load.image('bg_bg', bgImage)

    this.load.image('info_icon', infoIcon)
    this.load.image('beginner_icon', beginnerIcon)
    this.load.image('joyA', joyA)
    this.load.image('joyB', joyB)
    this.load.image('brew-can', brewCan)
    this.load.audio('getXP', getXP)
    this.load.audio('getLevel', getLevel)
    this.load.audio('select_music', selectMusicPath)

    // Spritesheets
    this.load.spritesheet('rat', ratSpritesheet, { frameWidth: 52, frameHeight: 40 })
    this.load.spritesheet('smokeScreen', smokeScreen, { frameWidth: 150, frameHeight: 200 })
    this.load.spritesheet('ratGibs', ratGibs, { frameWidth: 150, frameHeight: 200 })

    // Maps and Sprites
    this.load.tilemapTiledJSON('hq.json', hqJSON)
    // this.load.json('temp_hq_map', hqJSON);
    this.load.image('hq_sprite_sheet', hqSpriteSheet)

    this.load.image('xmas_sprite_sheet', xmasSpriteSheet)

    this.load.image('cloud_chat_bubble', cloud_chat_bubble)

    this.load.audio('uhOh_sound', uhOhSound)
    this.load.audio('ratDie1_sound', ratDie1Sound)
    this.load.audio('ratDie2_sound', ratDie2Sound)
    this.load.audio('ratDie3_sound', ratDie3Sound)
    this.load.audio('ratDie4_sound', ratDie4Sound)
    // load Rat Sprites

    // load Dr. Bitz Voices
    // Dr. Bitz Voices
    this.load.audio('jackpotSpin', jackpotSpin)
    this.load.audio('dr_bits_tooBad_sound', drBitzTooBad)
    this.load.audio('congratulations', congratulations)

    // Music
    this.load.audio('jackpotMusic', jackpotMusic)

    // Sound FX
    this.load.audio('jackpotWheelSpinSFX', jackpotWheelSpinSFX)
    this.load.audio('err_music', errMusic)

    // Fight Sound FX
    this.load.audio('hit01-sound', hit01Sound)
    this.load.audio('hit02-sound', hit02Sound)
    this.load.audio('hit03-sound', hit03Sound)
    this.load.audio('hit04-sound', hit04Sound)
    this.load.audio('hit05-sound', hit05Sound)
    this.load.audio('hit06-sound', hit06Sound)
    this.load.audio('hit07-sound', hit07Sound)
    this.load.audio('hit08-sound', hit08Sound)

    // Coin Sounds
    this.load.audio('coinGet', coinGet)
    this.load.audio('coinDrop', coinDrop)

    // fight tracks
    // Fight Tracks
    this.load.audio('fight-music-1', fightMusic1)
    this.load.audio('fight-music-2', fightMusic2)
    this.load.audio('fight-music-3', fightMusic3)
    this.load.audio('fight-music-4', fightMusic4)
    this.load.audio('fight-music-5', fightMusic5)
    this.load.audio('fight-music-6', fightMusic6)
    this.load.audio('fight-music-7', fightMusic7)
    this.load.audio('fight-music-8', fightMusic8)
    this.load.audio('fight-music-9', fightMusic9)
    this.load.audio('fight-music-10', fightMusic10)

    // Boop Music
    this.load.audio('boop-music', boopMusic)

    // DrBitz FX
    this.load.audio('sound-drbitz-ready', soundDrbitzReady)
    this.load.audio('fight-start-music', fightStartMusic)
    this.load.audio('sound-drbitz-youwin', soundDrbitzYouwin)
    this.load.audio('sound-drbitz-youlose', soundDrbitzYoulose)
    this.load.audio('sound-drbitz-spicy01', soundDrbitzSpicy01)
    this.load.audio('sound-drbitz-spicy02', soundDrbitzSpicy02)
    this.load.audio('sound-drbitz-spicy03', soundDrbitzSpicy03)

    // Miscellaneous Sounds
    this.load.audio('snap-sound', snapSound)
    this.load.audio('button-press-sound', buttonPressSound)
    this.load.audio('can-open-sound', canOpenSound)
    this.load.audio('dr_bits_success_sound', drBitzSuccessSound)

    this.load.audio('button_hover', buttonHoverPath)
    this.load.audio('button_down', buttonDownPath)

    // Swing Sounds
    this.load.audio('swing-sound-1', swingSound1)
    this.load.audio('swing-sound-2', swingSound2)
    this.load.audio('swing-sound-3', swingSound3)
    this.load.audio('swing-sound-4', swingSound4)

    // Button Sounds
    this.load.audio('button_hover', buttonHover)
    this.load.audio('button_down', buttonDown)

    // Coins
    this.load.atlas('silver_coin', silverCoinImage, silverCoinJson)

    this.load.image('bitz', drBitz)

    // Jackpot Assets
    this.load.image('jackpot_triangle', jackpotTriangleImage)
    this.load.image('jackpot_bf', jackpotBfImage)

    // Tutorial Images
    this.load.image('go_left_tutorial', goLeftTutorialImage)
    this.load.image('hit_box_tutorial', hitBoxTutorialImage)

    this.load.on('complete', () => {
      console.log('running All assets loaded.')
    })

    this.load.on('filecomplete', (key) => {
      console.log(`runnnig Asset loaded: ${key}`)
    })

    this.load.on('loaderror', (file) => {
      console.error(`running Failed to load: ${file.key}`)
    })
  }

  async readFileAsync(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = reject

      reader.readAsDataURL(file)
    })
  }

  init() {
    // const dispatch = useAppDispatch();
    // this.network = new Network()
  }
  get_Rat_Sheet() {
    return 'rat_sheet'
  }
  //Rat Sounds
  play_uhOh_sound() {
    this.uhOh_sound.play({ loop: false })
  }
  play_ratDie1_sound() {
    this.ratDie1_sound.play({ loop: false })
  }
  play_ratDie2_sound() {
    this.ratDie2_sound.play({ loop: false })
  }
  play_ratDie3_sound() {
    this.ratDie3_sound.play({ loop: false })
  }
  play_ratDie4_sound() {
    this.ratDie4_sound.play({ loop: false })
  }
  //Menu Sounds
  play_select_sound() {
    try {
      this.select_music.play({ loop: false })
    } catch (err) {
      console.log('error ', err)
    }
  }

  play_err_sound() {
    this.err_music.play({ loop: false })
  }

  play_snap_sound() {
    this.snap_sound.play({ loop: false })
  }

  play_button_press_sound() {
    console.log('pressed play_button_press_sound')
    if (this.button_press_sound.isPlaying) return
    this.button_press_sound.play({ loop: false })
  }

  play_can_open_sound() {
    this.can_open_sound.play({ loop: false })
  }

  create() {
    console.log('running create of bootstrap.. ')
    try {
      this.launchBackground(BackgroundMode.NIGHT)
      this.select_music = this.sound.add('select_music', { volume: 0.2 })
      this.err_music = this.sound.add('button_hover')
      this.snap_sound = this.sound.add('snap-sound')
      this.can_open_sound = this.sound.add('can-open-sound', { volume: 0.05 })
      //Rats
      this.uhOh_sound = this.sound.add('uhOh_sound', { volume: 0.25 })
      this.ratDie1_sound = this.sound.add('ratDie1_sound', { volume: 0.25 })
      this.ratDie2_sound = this.sound.add('ratDie2_sound', { volume: 0.25 })
      this.ratDie3_sound = this.sound.add('ratDie3_sound', { volume: 0.25 })
      this.ratDie4_sound = this.sound.add('ratDie4_sound', { volume: 0.25 })
      //Dr Bitz
      this.dr_bits_tooBad_sound = this.sound.add('dr_bits_tooBad_sound', { volume: 0.5 })
      this.dr_bits_success_sound = this.sound.add('dr_bits_success_sound')
      // this.button_hover_sound = this.sound.add('button_hover', {volume: 0.4})
      this.button_press_sound = this.sound.add('button-press-sound')
      this.button_hover_sound = this.sound.add('select_music', { volume: 0.2 })
      this.button_down_sound = this.sound.add('button_down', { volume: 0.5 })
    } catch (err) {
      console.error('running error in create bootstrap == ', err)
    }
  }

  play_dr_bits_success_sound() {
    if (this.dr_bits_success_sound.isPlaying) return
    this.dr_bits_success_sound.play({ loop: false })
  }
  play_dr_bits_too_bad_sound() {
    if (this.dr_bits_tooBad_sound.isPlaying) return
    this.dr_bits_tooBad_sound.play({ loop: false })
  }
  play_button_hover_sound() {
    if (this.button_hover_sound.isPlaying) return
    this.button_hover_sound.play({ loop: false })
  }

  play_button_down_sound() {
    console.log('in play button down sound ')
    if (this.button_down_sound.isPlaying) return
    this.button_down_sound.play({ loop: false })
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode: BackgroundMode.NIGHT })
  }

  /**
   * Launch Game using the current game player info.
   * @param data - Current Game Player Info.
   */
  async launchGame(data: any) {
    UpdateUserNetwork()
    setTimeout(() => {
      this.pauseBackground()
      this.pauseJackPot()
      this.scene.launch('game', {
        data,
        key: 'hq_map',
      })
    }, 100)
  }

  async launchMintingGame(data: any) {
    console.log('minting launchMintingGame --- ', data)
    setTimeout(() => {
      this.pauseBackground()
      this.pauseGame()
      this.scene.launch('minting'), data
    }, 100)
  }

  async launchJackPotGame() {
    setTimeout(() => {
      this.pauseBackground()
      // this.pauseGame()
      store.dispatch(ShowWinnerCardAtFightEnd(false))
      store.dispatch(SetShowingJackpotWheel(true))
      this.scene.launch('jackpot')
    }, 100)
  }

  async launchBigWinScreenGame() {
    setTimeout(() => {
      this.pauseBackground()
      // this.pauseGame();
      this.scene.launch('big_win_screen')
    }, 100)
  }

  async pauseMintingGame() {
    this.scene.stop('minting')
  }

  pauseBackground() {
    this.scene.stop('background')
  }

  pauseGame() {
    console.log('in pause...')
    this.scene.stop('game')
  }

  pauseJackPot() {
    store.dispatch(SetShowingJackpotWheel(false))
  }

  launchBackGroundNight() {
    this.launchBackground(BackgroundMode.NIGHT)
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
