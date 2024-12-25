// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import store from "../../stores";
import { ChangeWebSocketConnectedTime } from "../../stores/UserWebsiteStore";
import { ActionManager } from "../ActionManager";
import {
  basicCollisionAndMovementPlayerV3,
  basicCollisionWithBoundaryAndPlayer,
} from "../controls/movement";
import { BasePlayer } from "./BasePlayer";
import { IKeysInfo, INFTDataOfConnections, IPlayerData } from "./IPlayer";
import { v4 as uuidv4 } from "uuid";

export interface IOtherPlayer {
  sprite?: Phaser.Physics.Arcade.Sprite;
  wallet_address: string;
  moving?: boolean;
  kicking?: boolean;
  punching?: boolean;
  kickStart?: boolean;
  punchStart?: boolean;
  kickStartTime?: number;
  punchStartTime?: number;

  selfKicking?: boolean;
  selfPunching?: boolean;

  lastKickTime: number;
  lastPunchTime: number;

  runStart?: boolean;
  running?: boolean;
  runEnd?: boolean;

  hasBrewInHand?: boolean;
  showEquipAnimationStarted?: boolean;
  // showEquipAnimationRunning?: boolean,

  movedLastFrame?: boolean;
  runLastFrame?: boolean;

  sprite_url?: string;
  profile_image: string;
  gameObject?: OtherPlayer;
  nick_name: string;
  setupDone: boolean;
  // all_data: any,
  x: number;
  y: number;
  gotHit?: boolean;
  gotBackHit?: boolean;

  blocked?: boolean;

  minted_id: string;
  stunned?: boolean;
  stunnedStarted?: boolean;
  max_stamina?: number;
  max_health?: number;

  winningStarted?: boolean;
  winning?: boolean;

  losingStarted?: boolean;
  loosing?: boolean;
  movementAbility?: string;

  drinkStarted?: boolean;
  drinking?: boolean;

  showBrewDropFrame?: boolean;

  dead?: boolean;
  deadStarted?: boolean;

  orientation?: string;
  extra_data?: INFTDataOfConnections;

  defense?: number;
  punchpower?: number;
  kickpower?: number;
  speed?: number;
  stamina?: number;
  health?: number;
  all_aps?: any;

  user_type?: string;

  // // new animations
  // // gassed + lift-off + fall
  // gassed_lift_off_fall?: boolean,
}

export class OtherPlayer extends BasePlayer {
  private playContainerBody: Phaser.Physics.Arcade.Body;
  myWalletAddress = "";
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    nick_name: string,
    // all_data_fighter: IPlayerData,
    socketConnection: WebSocket,
    otherPlayer: boolean,
    wallet_address?: string,
    minted_id?: number,
    max_health?: number,
    max_stamina?: number,
    extra_data?: any
  ) {
    console.log("debug stats otherp ", extra_data);
    console.log("otherplayer_create ", otherPlayer, max_health, max_stamina);
    super(
      scene,
      x,
      y,
      texture,
      id,
      otherPlayer,
      socketConnection,
      nick_name,
      wallet_address,
      minted_id,
      max_health,
      max_stamina,
      extra_data
    );
    this.playContainerBody = this.playerContainer
      .body as Phaser.Physics.Arcade.Body;
    if (wallet_address) {
      this.myWalletAddress = wallet_address;
    }
  }

  DestroyGameObject() {
    this.sprite.destroy();
    this.playerContainer.destroy();
  }

  DecreaseHealthValue(amount: number, oldNumber: number, color = "") {
    // if (amount >= 100) return;
    this.healthBar.clear();
    const temp =
      this.totalHealthValue + (amount - this.totalActualHealthValue) / 2;
    this.healthReduced = 2 * (this.lastHealth - temp);

    // const tempActualHealthReduced = this.actualLastHealth - amount;
    const tempActualHealthReduced = oldNumber - amount;
    console.log(
      "health other player ",
      amount,
      this.actualLastHealth,
      tempActualHealthReduced
    );
    this.actualLastHealth -= tempActualHealthReduced;
    // console.log("health other player ", this.healthReduced, this.totalActualHealthValue - amount)
    // if (this.totalActualHealthValue - amount > 0) {
    //   var rounded = Math.round(this.totalActualHealthValue - amount * 10) / 10;
    //   this.PopHealthReduced(rounded);
    // }
    if (tempActualHealthReduced > 0) {
      const rounded = Math.round(tempActualHealthReduced * 10) / 10;
      this.PopHealthReduced(rounded, color);
    }

    // if (this.healthReduced > 0) {
    //   var rounded = Math.round(this.healthReduced * 10) / 10
    //   this.PopHealthReduced(rounded);
    // }
    this.lastHealth = temp;
    if (amount < 70 && amount >= 30) {
      this.healthBar.fillStyle(0xebb925, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    } else if (amount < 30) {
      this.healthBar.fillStyle(0xbf392f, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    } else {
      this.healthBar.fillStyle(0x32cd32, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    }
  }

  update(time: any, delta: any) {
 
    if (
      !this.game.lobbySocketConnected &&
      store.getState().web3store.userAddress === this.myWalletAddress
    ) {
      console.log("not connected. with game server.");
      if (store.getState().userPathStore.websocketConnectedTime === 0) {
        store.dispatch(ChangeWebSocketConnectedTime(new Date().getTime()));
      } else if (
        new Date().getTime() -
        store.getState().userPathStore.websocketConnectedTime >
        5000
      ) {
        if (
          window.confirm(
            "You have been disconnected from server. Please refresh to connect."
          )
        ) {
          store.dispatch(ChangeWebSocketConnectedTime(0));
          window.location.reload();
          store.dispatch(ChangeWebSocketConnectedTime(0));
        } else {
          store.dispatch(ChangeWebSocketConnectedTime(0));
        }
        // window.location.reload()
      }
      return;
    }

    if (this.deadTweenRunning) {
      return;
    }

    this.BaseUpdate(time, delta);

    // if (
    //   this.server_position_stored.x > 0 &&
    //   this.server_position_stored.y > 0 &&
    //   new Date().getTime() - this.last_server_move_updated_at > 500 &&
    //   (Math.abs(this.playerContainer.x - this.server_position_stored.x) > 0.1 ||
    //     Math.abs(this.playerContainer.y - this.server_position_stored.y) > 0.1) &&
    //   ActionManager.moveActionQueue[ActionManager.moveActionQueue.length - 1]
    //     .action_id === this.last_server_move_action_id
    // ) {
    //   console.log(
    //     "server correction-- distance -- ",
    //     Math.abs(this.playerContainer.x - this.server_position_stored.x),
    //     Math.abs(this.playerContainer.y - this.server_position_stored.y)
    //   );
    //   this.playerContainer.x = this.server_position_stored.x;
    //   this.playerContainer.y = this.server_position_stored.y;
    // }
  }
}
