// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { SYSTEM_WALLETS_MAPPING } from './../../../utils/interface';
import phaserGame from "../../../PhaserGame";
import store from "../../../stores";
import { BrewMachinePunched, GameTurnMouseClickOff, OpenAtmView, OpenServiceView, SelectFightInFightMachineMenu, SetMouseClickControlATM, SetMouseClickControlFightMachine, ShowBrewEjectAnimation, ShowBrewEjectAnimationFromServer, ShowMagnetMoveBrew, TurnMouseClickOff } from "../../../stores/UserActions";
import { HitFightMachine } from "../../../stores/UserActions";
import { ChangeShowMenuBox, ChangeShowQueueBox } from "../../../stores/UserWebsiteStore";
import Boundary, { Rect, calculateRect, calculateRectReverse } from "../../Components/Boundary";
import { IKeysInfo } from "../../characters/IPlayer";
import Bootstrap from "../Bootstrap";
import Game from "../Game";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../../configs";
import { roundToNDecimalPlaces } from '../../../utils/web3_utils';
import { checkIpad, getSystemInfo } from '../../../utils/systemInfo';
export class Mine {
  game: Game;
  scene: Phaser.Scene;
  atmBase!: Phaser.Tilemaps.TilemapLayer;
  atmArea!: Phaser.Tilemaps.TilemapLayer;
  atmExt!: Phaser.Tilemaps.TilemapLayer;
  atmRect!: Rect;

  serviceArea!: Phaser.Tilemaps.TilemapLayer;
  serviceMachine1Rect!: Rect;

  brewBase!: Phaser.Tilemaps.TilemapLayer;
  brewArea!: Phaser.Tilemaps.TilemapLayer;
  brewExt!: Phaser.Tilemaps.TilemapLayer;
  brewRect!: Rect;
  bootstrap: Bootstrap;
  brewCanSprite!: Phaser.GameObjects.Image;

  fightMachineBase!: Phaser.Tilemaps.TilemapLayer;
  fightMachineExt!: Phaser.Tilemaps.TilemapLayer;
  fightMachineArea!: Phaser.Tilemaps.TilemapLayer;
  FightMachineRect!: Rect;
  // treasury_balance_text!: Phaser.GameObjects.Text;
  jackpot_balance_text!: Phaser.GameObjects.Text;
  pp5_balance_text!: Phaser.GameObjects.Text;
  pp_pool_text!: Phaser.GameObjects.Text;
  wheelChance!: Phaser.GameObjects.Text;
  prizeDropRate!: Phaser.GameObjects.Text;


  goLeftSprite!: Phaser.GameObjects.Image;
  hitFightMachineArrow!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.game = phaserGame.scene.keys.game as Game;
    this.scene = scene;
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  }

  init() {
    this.game.map = this.scene.make.tilemap({
      key: "Mine.json",
      tileHeight: 16,
      tileWidth: 16
    })
    const isMobile = getSystemInfo();

    const margin = 1;
    const spacing = 2;

    const tileMap = this.game.map.addTilesetImage("Mine", "mine_sprite_sheet", 16, 16, margin, spacing);
    let layerNum = 0;
    const _1_floor = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const _2_walls = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const _3_wallDecor = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    const doorsOpen = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const doorsClosed = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const displayScreen_4 = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    //Service Desk
    const serviceSign = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.serviceArea = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.serviceArea.setDepth(-1)
    const serviceDesk = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const serviceMachine1Up = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const serviceMachine1down = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const serviceMachine2Up = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const serviceMachine2down = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.serviceMachine1Rect = calculateRectReverse(this.game.map, this.serviceArea);
    //Fight Arena
    this.game.stageArea = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    //Mint o Matics
    const MoMTunnel = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const MoM1 = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const MoM2 = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const MoM3 = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const MoMDoor = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    //Pipes
    const leftVertPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const rightVertPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const leftTopPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const centerPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const momBox = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const leftVertPipe = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const leftPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const leftPipeLow = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const rightVertPipesLow = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const MoMvertPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const backPipes = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    //Fight Machine
    this.fightMachineBase = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.fightMachineExt = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.fightMachineArea = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.fightMachineArea.setDepth(-1)
    this.fightMachineExt.setDepth(1)
    this.FightMachineRect = calculateRectReverse(this.game.map, this.fightMachineArea);

    //Brew Machine
    this.brewBase = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.brewExt = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.brewArea = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.brewArea.setDepth(-1)
    this.brewRect = calculateRectReverse(this.game.map, this.brewArea);

    //ATM
    this.atmBase = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.atmExt = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.atmArea = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    this.atmArea.setDepth(-1)
    this.atmRect = calculateRectReverse(this.game.map, this.atmArea);

    const propsLow = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const propsMid = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    const boxesLow = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const boxesMid = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;
    const boxesHigh = this.game.map.createLayer(layerNum, tileMap); layerNum += 1;

    const wallCollisionLayer = this.game.map.createLayer(layerNum, tileMap, 0, 0); layerNum += 1;
    const stageCollisionLayer = this.game.map.createLayer(layerNum, tileMap, 0, 0); layerNum += 1;

    wallCollisionLayer.setDepth(-1)
    stageCollisionLayer.setDepth(-1)
    console.log('layerNum+1 ', layerNum)

    const stageX: number[] = []
    const stageY: number[] = []
    this.game.stageArea.forEachTile(_tile => {
      if (_tile.index !== -1) {
        // console.log(_tile)
        stageX.push(_tile.x * 16)
        stageY.push(_tile.y * 16)
      }
    })

    const screenXY: Array<{ x: number, y: number }> = []
    const screenX: number[] = []
    const screenY: number[] = []
    displayScreen_4.forEachTile(_tile => {
      if (_tile.index !== -1 && _tile.index > 0) {
        // console.log("debug_displayScreen_4 ", _tile.index, _tile.x, _tile.y)
        screenXY.push({
          x: _tile.x * 16,
          y: _tile.y * 16
        })
        screenX.push(_tile.x * 16)
        screenY.push(_tile.y * 16)
      }
    })

    this.game.displayScreenCenter = {
      x: Math.round(Math.min(...screenX) - 10),
      y: Math.round(Math.min(...screenY) + 20)
    }


    // const scale = (Math.min(this.scene.scale.width / 1024, this.scene.scale.height / 768));
    // this.scene.cameras.main.zoom = scale;
    // this.treasury_balance_text = this.scene.add
    //   .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y, "")
    //   // .setStyle({ backgroundColor: "#f5eddc", borderRadius: 5 })
    //   .setColor("#fff")
    //   .setPadding(2)
    //   .setInteractive()
    //   .setFontFamily("monospace")
    //   .setFontSize(14)aaa

    this.jackpot_balance_text = this.scene.add
      .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y, "")
      .setColor("#fff")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(14)
      .setResolution(2);
    this.wheelChance = this.scene.add
      .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y + 20, "")
      .setColor("#fff")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(14)
      .setResolution(2);
    this.pp5_balance_text = this.scene.add
      .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y + 40, "")
      .setColor("#fff")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(14)
      .setResolution(2);
    this.pp_pool_text = this.scene.add
      .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y + 60, "")
      .setColor("#fff")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(14)
      .setResolution(2);
    this.prizeDropRate = this.scene.add
      .text(this.game.displayScreenCenter.x, this.game.displayScreenCenter.y + 80, "")
      .setColor("#fff")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(14)
      .setResolution(2);

    const minXStage = Math.min(...stageX)
    const minYStage = Math.min(...stageY)

    const maxXStage = Math.max(...stageX)
    const maxYStage = Math.max(...stageY)

    this.game.centerCoordinatesStage = {
      x: Math.round((minXStage + maxXStage) / 2),
      y: Math.round((minYStage + maxYStage) / 2)
    }


    const temp1: Array<Boundary> = [];

    stageCollisionLayer.forEachTile(_tile => {
      if (_tile.index !== -1) {

        this.game.boundaries.push(
          new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16)
        )

        temp1.push(
          new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16)
        )
      }
    })

    const temp2: Array<Boundary> = [];

    wallCollisionLayer.forEachTile(_tile => {
      if (_tile.index !== -1) {
        this.game.boundaries.push(
          new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16)
        )

        temp2.push(
          new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16)
        )
      }
    })

    // wallCollisionLayer.setDepth(-1000);
    // stageCollisionLayer.setDepth(-1000);

    const fightMachineOverlapRect = calculateRect(this.game.map, this.fightMachineArea);

    this.game.fightMachineOverlapText = this.scene.add
      .text(0, 0, '', { font: '128px Courier' })
      .setOrigin(0.5)
      .setStyle({ backgroundColor: '#f5eddc', borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setScale(0.1)
    const pointX = Math.round(fightMachineOverlapRect.leftY + fightMachineOverlapRect.width / 2)
    const pointY = Math.round(fightMachineOverlapRect.leftX + fightMachineOverlapRect.height / 2)
    this.game.fightMachineOverlapText.setX(pointX)
    this.game.fightMachineOverlapText.setY(pointY - 60)
    this.game.fightMachineOverlapText.setText([
      'Punch/Kick to enter the fight.'
    ]);
    this.game.fightMachineOverlapText.setVisible(true)
    this.game.fightMachineOverlapText.setDepth(-1)
    console.log("--***------fightMachineOverLapArea ", this.game.fightMachineOverlapText)

    console.log("inner boundary -- ", temp1);
    console.log("outer boundary -- ", temp2);
    const scaleValue = isMobile ? 1 : 2;

    this.hitFightMachineArrow = this.scene.add.image(380, 360, "hit_box_tutorial")
      .setDepth(90000)
      .setScale(scaleValue);
    
    this.goLeftSprite = this.scene.add.image(800, 300, "go_left_tutorial")
      .setDepth(90000)
      .setScale(scaleValue);

    this.scene.tweens.add({
      targets: [this.goLeftSprite, this.hitFightMachineArrow],
      alpha: 0,         // Go to alpha 0 (fully transparent)
      duration: 500,
      ease: 'Sine',    // Duration of the fade out (in milliseconds)
      yoyo: true,      // After fade out, fade back in
      repeat: -1       // Repeat forever
    });


  }

  update(keysInfo: IKeysInfo) {
    this.updateSystemWalletText()
    const tempMyPlayer = this.game.otherPlayers.get(store.getState().web3store.player_id)

    if (tempMyPlayer?.gameObject) {

      //ATM Machine
      if (
        (tempMyPlayer.gameObject.playerContainer.x > this.atmRect.leftX
          && tempMyPlayer.gameObject.playerContainer.x < this.atmRect.leftX + this.atmRect.width)
        && ((tempMyPlayer.gameObject.playerContainer.y > this.atmRect.leftY
          && tempMyPlayer.gameObject.playerContainer.y < this.atmRect.leftY + this.atmRect.height))
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed)) {
          // overlap with atm
          console.log("overlap atm and kick");
          this.atmExt.setDepth(-1)
          setTimeout(() => {
            store.dispatch(OpenAtmView(!store.getState().userActionsDataStore.openAtmView));
            this.atmExt.setDepth(1)
            this.bootstrap.play_button_press_sound()
          }, 500)
        }
      } else {
        store.dispatch(OpenAtmView(false));
        store.dispatch(SetMouseClickControlATM(false))
        // store.dispatch(TurnMouseClickOff(false))
      }

      //Service Desk
      if (
        (tempMyPlayer.gameObject.playerContainer.x > this.serviceMachine1Rect.leftX
          && tempMyPlayer.gameObject.playerContainer.x < this.serviceMachine1Rect.leftX + this.serviceMachine1Rect.width)
        && ((tempMyPlayer.gameObject.playerContainer.y > this.serviceMachine1Rect.leftY
          && tempMyPlayer.gameObject.playerContainer.y < this.serviceMachine1Rect.leftY + this.serviceMachine1Rect.height))
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed) && (tempMyPlayer.orientation === "left")) {
          // this.serviceExt.setDepth(-1)
          setTimeout(() => {
            // this.serviceExt.setDepth(1)
            store.dispatch(OpenServiceView(true));

           // store.dispatch(OpenServiceView(!store.getState().userActionsDataStore.openServiceView));
            this.bootstrap.play_button_press_sound()
          }, 500)
        }
      } else if (tempMyPlayer.orientation === "right") {
        store.dispatch(OpenServiceView(false));
      }

      //Brew Machine
      if (
        (tempMyPlayer.gameObject.playerContainer.x > this.brewRect.leftX
          && tempMyPlayer.gameObject.playerContainer.x < this.brewRect.leftX + this.brewRect.width)
        && ((tempMyPlayer.gameObject.playerContainer.y > this.brewRect.leftY
          && tempMyPlayer.gameObject.playerContainer.y < this.brewRect.leftY + this.brewRect.height))
      ) {
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed) && (tempMyPlayer.orientation === "left")) {
          console.log("overlap brew and kick", store.getState().userActionsDataStore.brewMachinePunched);
          this.brewExt.setDepth(-1)
          setTimeout(() => {
            store.dispatch(BrewMachinePunched(!store.getState().userActionsDataStore.brewMachinePunched))
            this.brewExt.setDepth(1)
            this.bootstrap.play_button_press_sound()
          }, 500)
        }
      } else {
        store.dispatch(BrewMachinePunched(false))
      }
      // console.log("-collision_with--",((tempMyPlayer.gameObject.playerContainer.x > this.game.fightMachineOverlapRectReverse.leftX &&tempMyPlayer.gameObject.playerContainer.x < this.game.fightMachineOverlapRectReverse.leftX + this.game.fightMachineOverlapRectReverse.width )
      //   && (tempMyPlayer.gameObject.playerContainer.y > this.game.fightMachineOverlapRectReverse.leftY && tempMyPlayer.gameObject.playerContainer.y < this.game.fightMachineOverlapRectReverse.leftY + this.game.fightMachineOverlapRectReverse.height ) 
      // ), tempMyPlayer.orientation, keysInfo.keyK.pressed || keysInfo.keyP.pressed)
      if ((tempMyPlayer.gameObject.playerContainer.x > this.FightMachineRect.leftX && tempMyPlayer.gameObject.playerContainer.x < this.FightMachineRect.leftX + this.FightMachineRect.width)
        && (tempMyPlayer.gameObject.playerContainer.y > this.FightMachineRect.leftY && tempMyPlayer.gameObject.playerContainer.y < this.FightMachineRect.leftY + this.FightMachineRect.height)
      ) {
        // onGameUI = true;
        if ((keysInfo.keyK.pressed || keysInfo.keyP.pressed) && (tempMyPlayer.orientation === "left")) {
          let check = false;
          store.getState().userPathStore.CombinedQueueData.map(_data => {
            if (_data.p1_wallet === store.getState().web3store.userAddress || _data.p2_wallet === store.getState().web3store.userAddress) {
              check = true
            }
          })
          // add more checks here.
          if (store.getState().queueDetailedInfo.added_to_queue_pool) {
            check = true
          }
          // console.log("collision_with checking if in queue ", check)
          if (!check) {
            if (!store.getState().userActionsDataStore.hitFightMachine) {
              this.game.lobbySocketConnection.send(JSON.stringify({
                event: "fight_machine_button_press",
                walletAddress: store.getState().web3store.userAddress,
              }))
              this.fightMachineExt.setDepth(-1)
              setTimeout(() => {
                this.fightMachineExt.setDepth(1)
                store.dispatch(HitFightMachine(!store.getState().userActionsDataStore.hitFightMachine))
                store.dispatch(SelectFightInFightMachineMenu(false))
                this.bootstrap.play_button_press_sound()
              }, 500)
            } else {
              store.dispatch(HitFightMachine(!store.getState().userActionsDataStore.hitFightMachine))
              store.dispatch(SelectFightInFightMachineMenu(false))
              store.dispatch(ChangeShowQueueBox(false))
              store.dispatch(ChangeShowMenuBox(false))
            }
          } else {
            store.dispatch(ChangeShowQueueBox(!store.getState().userPathStore.ShowQueueBox))
            store.dispatch(ChangeShowMenuBox(!store.getState().userPathStore.ShowMenuBox))

            store.dispatch(SelectFightInFightMachineMenu(false))
          }
        }
      } else {
        this.game.fightMachineOverlapText.setDepth(-1);
        store.dispatch(HitFightMachine(false));
        store.dispatch(SelectFightInFightMachineMenu(false))
        store.dispatch(SetMouseClickControlFightMachine(false))
      }
    }


    // console.log("debug_onmouse ", onGameUI)
    // if (onGameUI) {
    //   store.dispatch(GameTurnMouseClickOff(true))
    // } 
    // if (!onGameUI) {
    //   store.dispatch(GameTurnMouseClickOff(false))
    // }

    if (store.getState().userActionsDataStore.showBrewEjectAnimation) {
      this.game.lobbySocketConnection.send(JSON.stringify({
        event: "eject_brew",
        walletAddress: store.getState().web3store.userAddress,
        x: (this.brewRect.leftX + this.brewRect.width / 2),
        y: (this.brewRect.leftY + this.brewRect.height / 2),
      }))
      store.dispatch(ShowBrewEjectAnimation(false))
    }

    // if (store.getState().userActionsDataStore.showBrewEjectAnimationFromServer) {
    //   store.dispatch(ShowBrewEjectAnimationFromServer(false))
    //   this.brewCanSprite = this.scene.add.image(
    //     (this.brewRect.leftX + this.brewRect.width/2), 
    //     (this.brewRect.leftY + this.brewRect.height/2), 
    //     "brew-can"
    //   )
    //   this.brewCanSprite.setDisplaySize(7, 14)
    //   console.log("brew-- ", this.brewCanSprite.x, this.brewCanSprite.y)
    //   this.brewCanSprite.setDepth(this.brewCanSprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT/2)
    //   this.scene.tweens.add({
    //     targets: this.brewCanSprite,
    //     x: { from: this.brewCanSprite.x, to: this.brewCanSprite.x - 25 - 25 * Math.random(), duration: 500, ease: 'Power1' },
    //     y: { from: this.brewCanSprite.y, to: this.brewCanSprite.y + 10 + 10 * Math.random(), duration: 500, ease: 'Sine.easeInOut' }
    //   }).once("complete", () => {
    //     //
    //   })

    // }

    if (store.getState().userActionsDataStore.magnet_move_brew.state) {
      // store.dispatch(ShowMagnetMoveBrew({
      //   state: false,
      //   x: 0,
      //   y: 0,
      // }))
      // const data = store.getState().userActionsDataStore.magnet_move_brew;
      // this.scene.tweens.add({
      //   targets: this.brewCanSprite,
      //   x: { from: this.brewCanSprite.x, to: data.x, duration: 500, ease: 'Power1' },
      //   y: { from: this.brewCanSprite.y, to: data.y, duration: 500, ease: 'Power1' }
      // }).once("complete", () => {
      //   //
      //   this.brewCanSprite.destroy()
      // })
    }
    // */


    // Tutorials
    if (store.getState().userPathStore.showFightTutorials) {
      //
      this.goLeftSprite.setDepth(99999)
      this.hitFightMachineArrow.setDepth(99999)
    } else {
      //
      this.goLeftSprite.setDepth(-100)
      this.hitFightMachineArrow.setDepth(-100)
    }

  }


  updateSystemWalletText() {
    const data = store.getState().websiteStateStore.system_wallets_info
    // let treasuryText = "Treasury: 0"
    let jpText = "Jackpot: 0"
    let wheelChanceText = "Wheel Chance: 0%"
    let ppText = "Prize Pool: 0"
    let ppPoolText = "Today's Rewards: 0"
    //let prizeDropRateText = "Prize Drops per Hour: 0"
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === SYSTEM_WALLETS_MAPPING.JackPot5) {
        jpText = `Jackpot: ${(roundToNDecimalPlaces(data[i].value / 100)).toLocaleString()} Bits`
      }
      if (data[i].index === SYSTEM_WALLETS_MAPPING.PRIZE_DROP_AMOUNT) {
        ppPoolText = `Today's Rewards: ${(roundToNDecimalPlaces(data[i].value / 100)).toLocaleString()} Bits`
      }
      if (data[i].index === SYSTEM_WALLETS_MAPPING.JACKPOT_PROBABILITY_INFO) {
        let chance = roundToNDecimalPlaces(data[i].value);
        if (chance > 100) chance = 100
        wheelChanceText = `Wheel Chance: ${chance} %`
      }
      if (data[i].index === SYSTEM_WALLETS_MAPPING.PrizePool5) {
        ppText = `Prize Pool: ${(roundToNDecimalPlaces(data[i].value / 100)).toLocaleString()} Bits`
      }
      // if (data[i].index === SYSTEM_WALLETS_MAPPING.JACKPOT_PROBABILITY_INFO) {
      // prizeDropRateText = `Prize Drops per Hour: 5`
      // }
    }
    // this.treasury_balance_text.text = treasuryText
    this.pp5_balance_text.text = ppText;
    this.jackpot_balance_text.text = jpText;
    this.wheelChance.text = wheelChanceText;
    this.pp_pool_text.text = ppPoolText;
    // this.prizeDropRate.text = prizeDropRateText;
  }
}