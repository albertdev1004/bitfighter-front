// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Popper } from "../Components/Popper";
import { IAction } from "../Components/utils";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../configs";
// import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import Bootstrap from "../scenes/Bootstrap";
import { v4 as uuidv4 } from "uuid";
import store from "../../stores";
import { setInfoButtonClicked, SetPlayerSelected } from "../../stores/PlayerData";
import { FriendButtonClickedInInfoMenu } from "../../stores/UserActions";
import { IPlayerData } from "./IPlayer";
import { isNullOrUndefined } from "util";
import { checkIpad, getSystemInfo } from '../../utils/systemInfo';
import messageSender from "../../utils/websocket_helper";
import Game from "../scenes/Game";
import phaserGame from "../../PhaserGame";
import { SetSpiceChange } from "../../stores/Web3StoreBalances";
import { ChangeShowMenuBox, ChangeShowStatsView, SelectOtherPlayerForStats } from "../../stores/UserWebsiteStore";
import FighterIMenu from "./FighterIMenu"
function convertAttrToKick(val: number) {
  switch (val) {
    case 1:
      return KickPowerMap[1];
    case 2:
      return KickPowerMap[2];
    case 3:
      return KickPowerMap[3];
    case 4:
      return KickPowerMap[4];
    case 5:
      return KickPowerMap[5];
    default:
      return 0;
  }
}

export class BasePlayer {
  scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public playerContainer!: Phaser.GameObjects.Container;
  playerName: Phaser.GameObjects.Text;
  playerLevelText: Phaser.GameObjects.Text;
  actions: IAction;
  value: {
    playerMoved: boolean;
    orientation: string;
  };


  healthReduced!: number;

  chatBubbleActive = false;
  // dialogBubbleText!: string;

  currentBubbleID!: string;
  bubbleIds: Array<string> = [];

  public playerInfoIcon!: Phaser.GameObjects.Image;
  public playerWeb2Icon!: Phaser.GameObjects.Image;
  public playerPFP!: Phaser.GameObjects.Image;
  playerAllData!: IPlayerData;
  // playerNFTDATA!: INFTDataOfConnections;

  buttonStats!: Phaser.GameObjects.Text;
  buttonFriend!: Phaser.GameObjects.Text;
  AllInfoButtonContainer!: Phaser.GameObjects.Container;

  allInfoButtonStateHandler = "";

  //UI Bars
  healthBar!: Phaser.GameObjects.Graphics;
  healthBarBackground!: Phaser.GameObjects.Graphics;
  staminaBarBackground!: Phaser.GameObjects.Graphics;
  staminaBar!: Phaser.GameObjects.Graphics;
  experienceBarBackground!: Phaser.GameObjects.Graphics;
  experienceBar!: Phaser.GameObjects.Graphics;
  //Bar width
  totalActualHealthValue!: number;
  totalActualStaminaValue!: number;
  totalActualExperienceValue!: number;

  //Player Properties
  totalHealthValue: number;
  totalStaminaValue: number;
  totalExperienceValue: number;
  currExperience!: number;
  currentLevel!: number;
  currHealth!: number;
  lastHealth!: number;
  actualLastHealth!: number;
  currStamina!: number;
  lastStamina: number;
  lastXP: number;
  healthAndStaminaBarsEnabled: boolean;
  max_stamina: number;
  max_health: number;
  speed!: number;
  defense!: number;
  punchPower!: number;
  kickPower!: number;
  walk_speed!: number;
  run_speed!: number;
  //
  wallet_address: string | undefined;
  minted_id: number | undefined;
  deadTweenRunning = false;
  nick_name = "";
  extra_data: any = {};

  //Player Statuses
  playerStunned!: boolean;
  //

  playerPopHealthText: Array<{
    text: Phaser.GameObjects.Text;
    animationStarted: boolean;
    startedTime: number;
    index: number;
  }>;

  webSocketConnection: WebSocket;
  public last_position_stored!: {
    x: number;
    y: number;
  };

  public target_position_stored: {
    x: number;
    y: number;
  };

  public server_position_stored = {
    x: 0,
    y: 0,
  };

  public last_server_move_action_id = "";
  public last_server_move_updated_at = 0;

  public teleport_coordinates!: {
    x: number;
    y: number;
  };

  public tween_animation_running = false;
  public tween_anim_running_down = false;
  public moving!: boolean;
  public need_to_move_player = false;
  public teleport = false;

  // new animations
  // gassed + lift-off + fall
  gassed_lift_off_fall = false;
  gassed_lift_fall_off_started = 0;
  gassed_lift_off_fallen = false;
  dead = false;
  dead_last_time = 0;
  game: Game;

  playerThoughtBubbles: Array<Phaser.GameObjects.Container> = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    nameOfKey: string,
    // all_data_fighter: IPlayerData,
    otherPlayer: boolean,
    socketConnection: WebSocket,
    nick_name: string,
    wallet_address?: string,
    minted_id?: number,
    max_health?: number,
    max_stamina?: number,
    extra_data?: any,
    popper: Popper
    //level: number;

  ) {

    this.otherPlayer = otherPlayer;
    this.wallet_address = wallet_address;
    this.minted_id = minted_id;
    // console.log("debug_stats --- ", extra_data);
    this.extra_data = extra_data;
    this.nick_name = nick_name;

    this.playerPopHealthText = [];
    this.webSocketConnection = socketConnection;
    this.game = phaserGame.scene.keys.game as Game;
    this.target_position_stored = { x: 0, y: 0 };

    this.scene = scene;
    this.popper = new Popper(this.scene);
    this.healthAndStaminaBarsEnabled = true;
    this.sprite = this.scene.physics.add.sprite(x, y, texture);

    const ismobile = getSystemInfo();

    const tempDict = {
      defense: 0,
      kickpower: 0,
      health: 0,
      stamina: 0,
      speed: 0,
      punchpower: 0,
    };

    //
    this.totalHealthValue = 50;
    this.totalStaminaValue = 50;
    this.totalExperienceValue = 50;
    this.lastHealth = 50;
    this.lastStamina = 50;
    this.lastXP = store.getState().playerDataStore?.playerStats?.xp;
    this.currentLevel = store.getState().playerDataStore?.playerStats?.level;
    this.max_stamina = max_stamina ? max_stamina : 0;
    this.max_health = max_health ? max_health : 0;

    //XP and Level
    //this.xp = 0;
    //this.xpToNextLevel = 5;
    this.level = 9999;

    this.defense = tempDict["defense"];
    this.speed = tempDict["speed"];

    this.kickPower = convertAttrToKick(tempDict["kickpower"]);
    this.punchPower = convertAttrToKick(tempDict["punchpower"]) / 2;

    this.sprite.play(nameOfKey);

    const debugGraphics = this.scene.add.graphics();
    debugGraphics.fillStyle(0xff0000, 0.5); // Red color with 50% transparency
    debugGraphics.fillRect(-50, -50, 100, 100); // Adjust width/height as needed

    this.playerContainer = this.scene.add.container(x, y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20).setDepth(1)
    this.sprite.setPosition(0, 0);
    this.sprite.setOrigin(0.5, 0.5);
    this.playerContainer.add(this.sprite);
    this.scene.physics.world.enable(this.playerContainer);

    this.playerInfoContainer = this.scene.add.container(x, y).setDepth(1)
    this.playerInfoContainer.setPosition(0, -36);
    this.playerContainer.add(this.playerInfoContainer);

    this.healthBar = this.scene.add.graphics();
    this.healthBarBackground = this.scene.add.graphics();
    this.healthBarBorder = this.scene.add.graphics();
    this.staminaBarBackground = this.scene.add.graphics();
    this.staminaBarBorder = this.scene.add.graphics();
    this.staminaBar = this.scene.add.graphics();
    this.experienceBarBackground = this.scene.add.graphics();
    this.experienceBarBorder = this.scene.add.graphics();
    this.experienceBar = this.scene.add.graphics();

    //sound FX are fun
    this.sound_drbitz_spicy01 = this.scene.sound.add("sound-drbitz-spicy01", { volume: 0.4 });
    this.sound_drbitz_spicy02 = this.scene.sound.add("sound-drbitz-spicy02", { volume: 0.4 });
    this.sound_drbitz_spicy03 = this.scene.sound.add("sound-drbitz-spicy03", { volume: 0.4 });
    this.getXPSound = this.scene.sound.add("getXP", { volume: 0.5 });
    this.getLevelSound = this.scene.sound.add("getLevel", { volume: 0.5 });

    this.actions = {
      walking: false,
      running: false,
      kicking: false,
      punching: false,
      idle: false,
      kickStart: false,
      kickEnd: false,
      punchStart: false,
      runStart: false,
      gotHit: false,
      gotHitStart: false,
      gotBackHit: false,
      downAnimPlaying: false,
      showStunnedAnim: false,
      showDeadSprite: false,
    };

    this.value = {
      playerMoved: false,
      orientation: "right",
    };


    this.playerName = this.scene.add.text(0, 0, this.nick_name)
      .setFontFamily("monospace")
      .setFontSize(10)
      .setColor("#fefefe")
      .setOrigin(0.5)
      .setStroke("#2b2b2b", 2)
      .setResolution(2);//need to understand how much memory this really uses
    this.playerName.setPosition(0, 0);
    this.playerName.setOrigin(0.5, 0.5);
    //


    this.playerInfoIcon = this.scene.add
      .image(this.playerName.x + (this.playerName.width / 2) + 5, 0, "info_icon")
      .setScale(0.02)
      .setInteractive()
      .setInteractive(new Phaser.Geom.Circle(40, 5, 15), Phaser.Geom.Circle.Contains)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "info_clicked";
        store.dispatch(SelectOtherPlayerForStats(`${this.wallet_address}_${this.minted_id}`));
        store.dispatch(ChangeShowStatsView(true));
        store.dispatch(ChangeShowMenuBox(true));
      });

    //rename this to this.playerBadge
    this.playerWeb2Icon = this.scene.add
      //if player type is bot then bot badge
      //if player type is guest then n00b badge
      //else, gang badge
      .image(this.playerName.x - (this.playerName.width / 2) - 5, 0, "beginner_icon")

      // .setSize(10, 10);
      .setScale(0.2);

    const levelString = "Lvl:" + (store.getState().playerDataStore?.playerStats?.level || 0).toString();
    const textWidth = levelString.length;
    this.playerLevelText = this.scene.add.text(0, 0, levelString)
      .setFontFamily("monospace")
      .setFontSize(8)
      .setColor("#fefefe")
      .setOrigin(0.5)
      .setStroke("#2b2b2b", 2)
      .setOrigin(1, 0.5)
      .setResolution(2);//need to understand how much memory this really uses
    this.playerLevelText.x -= textWidth * 6;
    this.playerLevelText.y = this.playerWeb2Icon.y - 10;


    this.buttonStats = this.scene.add
      .text(-5, -5, "Stats")
      .setStyle({ backgroundColor: "#f5eddc", borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(10)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "stats_clicked";
        this.buttonStats.setTint(0xff0000);
        store.dispatch(setInfoButtonClicked(true));
        store.dispatch(SetPlayerSelected(this.playerAllData));
        window.setTimeout(() => {
          this.buttonStats.clearTint();
        }, 100);
        // console.log("stats button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        // if (this.allInfoButtonStateHandler === 'friend_clicked') {

        // } else {
        //   this.AllInfoButtonContainer.setVisible(false)
        // }ss
        this.allInfoButtonStateHandler = "";
        // console.log("outside stats button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "stats_clicked";
        // console.log("pointer over stats button --- ", this.allInfoButtonStateHandler);
      });

    this.buttonFriend = this.scene.add
      .text(0, this.buttonStats.height + 4, "Friend")
      .setStyle({ backgroundColor: "#f5eddc", borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(10)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "friend_clicked";
        this.buttonFriend.setTint(0xff0000);
        store.dispatch(FriendButtonClickedInInfoMenu(true));
        store.dispatch(SetPlayerSelected(this.playerAllData));
        window.setTimeout(() => {
          this.buttonFriend.clearTint();
        }, 100);
        // console.log("friend button clicked --- ");
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        // if (this.allInfoButtonStateHandler === 'stats_clicked') {

        // } else {
        //   this.AllInfoButtonContainer.setVisible(false)
        // }
        this.allInfoButtonStateHandler = "";
        // console.log("outside friend button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "friend_clicked";
        // console.log("pointer over friend button --- ", this.allInfoButtonStateHandler);
      });

    // var buttonFight = this.scene.add.dom(0, 0, 'h2', null, "FIGHT")
    // buttonFight.setClassName('test').setDepth(1000000000);

    const buttonStatsDimensions: Phaser.Geom.Rectangle = this.buttonStats.getBounds();
    const buttonGroupHeight = this.buttonStats.height;
    const buttonGroupWidth = Math.max(this.buttonStats.width, this.buttonFriend.width);

    this.buttonStats.setY(buttonStatsDimensions.height + this.buttonStats.y + 10);
    this.buttonStats.setX(this.buttonStats.x + buttonStatsDimensions.width);

    // this.buttonFriend.setY(buttonStatsDimensions.height/2 + this.buttonStats.y + 10)
    // this.buttonFriend.setX(this.buttonStats.x)

    this.AllInfoButtonContainer = this.scene.add.container(this.buttonStats.x - 20, this.buttonStats.y - 20).setDepth(900000);
    const dialogBoxWidth = buttonGroupWidth + 20;
    const dialogBoxHeight = 2 * buttonGroupHeight + 20;

    this.buttonStats.setY(10);
    this.buttonStats.setX(10);

    this.buttonFriend.setY(buttonStatsDimensions.height / 2 + this.buttonStats.y + 10);
    this.buttonFriend.setX(this.buttonStats.x);

    // buttonFight.setY(buttonStatsDimensions.height/2 + this.buttonFriend.y + 10)
    // buttonFight.setX(this.buttonStats.x)

    this.AllInfoButtonContainer.add(this.scene.add.graphics().fillStyle(0xffffff, 0.5).fillRoundedRect(0, 0, dialogBoxWidth, dialogBoxHeight, 3)
      .lineStyle(3, 0x000000, 1)
      .strokeRoundedRect(0, 0, dialogBoxWidth, dialogBoxHeight, 6));

    this.AllInfoButtonContainer.add([this.buttonStats, this.buttonFriend]);
    // console.log("nounds ..", this.AllInfoButtonContainer.getBounds(), this.buttonStats.width)

    this.AllInfoButtonContainer
      // .setInteractive(new Phaser.Geom.Circle(this.AllInfoButtonContainer.getBounds().centerX, this.AllInfoButtonContainer.getBounds().centerY ,40), Phaser.Geom.Circle.Contains)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, dialogBoxWidth, dialogBoxHeight), Phaser.Geom.Rectangle.Contains)
      // .setInteractive(this.AllInfoButtonContainer.getBounds(), Phaser.Geom.Rectangle.Contains)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "container_clicked";
        // console.log("all container clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "container_clicked";
        // console.log("pointer over all container --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {

        this.AllInfoButtonContainer.setVisible(false);
        // console.log("outside all container clicked --- ", this.allInfoButtonStateHandler);
      });

    this.AllInfoButtonContainer.setVisible(false);
    //Apply Guest Tag
    if (this.extra_data.user_type === "web2") {
      this.playerInfoContainer.add(this.playerWeb2Icon);
    }
    //Apply Bot Tag
    //Apply Gang Tag
    this.playerInfoContainer.add(this.playerName);
    if (otherPlayer) {
      this.playerInfoContainer.add(this.playerInfoIcon);
      this.playerContainer.add(this.AllInfoButtonContainer);
    } else {
      this.playerInfoContainer.add([this.healthBarBorder, this.staminaBarBorder, this.experienceBarBorder,
      this.healthBarBackground, this.staminaBarBackground, this.experienceBarBackground,
      this.healthBar, this.staminaBar, this.experienceBar, this.playerLevelText]);

      // const levelString = "Lvl:" + this.level.toString();
      // const textWidth = levelString.length;
      // this.playerLevelText.x = this.playerWeb2Icon.x;

    }


    // this.playerContainer.add(debugGraphics)

    this.EnableHealthBars();

    this.sprite.on("animationstart", (a: Phaser.Animations.Animation, b: any, c: any, d: any) => {
      if (a.key.includes("fly_as_angel")) {
        // console.log("fly_as_angel start tween");
        const start_pos_x = this.playerContainer.x;
        const start_pos_y = this.playerContainer.y;
        this.deadTweenRunning = true;
        this.scene.tweens
          .add({
            targets: this.playerContainer,
            y: this.playerContainer.y - 800,
            x: this.playerContainer.x,
            duration: 6000,
          })
          .on("complete", () => {
            // console.log("fly_as_angel end tween");
            this.playerContainer.x = 500;
            this.playerContainer.y = 500;
            this.deadTweenRunning = false;
            this.BaseUpdate();
            this.sprite.stop();
            this.sprite.play("idle-" + this.wallet_address + "_" + this.minted_id?.toString());
          });
      }
    });
  }

  infoButtonClicked = (value: any) => {
    // console.log(" info button clicked.. ", value);
  };

  private clearDialogBubble(id: string) {
    if (id != this.currentBubbleID) return;
    // this.playerDialogBubble.removeAll(true);
    this.chatBubbleActive = false;
    // this.dialogBubbleText = "";
  }

  removeElementFromArray(element: any) {
    let req_index = -1;
    for (let i = 0; i < this.bubbleIds.length; i++) {
      if (this.bubbleIds[i] === element) {
        req_index = i;
      }
    }
    if (req_index > -1) {
      this.bubbleIds.splice(req_index, 1);
    }
  }


  createNewDialogBox(text: string) {
    const randomID = uuidv4();
    this.currentBubbleID = randomID;
    this.bubbleIds.push(randomID);
    setTimeout(() => {
      this.removeElementFromArray(randomID);
    }, 4000);
    const ntext = text;


    if (ntext === "..." && !this.chatBubbleActive) {
      this.chatBubbleActive = true;
      const playerThoughtBubble = this.scene.add.container(0, -60).setDepth(90000);

      // Create the text with dynamic word wrap and resolution
      const innerText = this.scene.add
        .text(0, 0, text, { wordWrap: { width: 150, useAdvancedWrap: true } })
        .setFontFamily("Arial")
        .setFontSize(12)
        .setColor("#000000")
        .setOrigin(0.5)
        .setResolution(2);

      // Calculate the text width and height dynamically
      const innerTextHeight = innerText.height * innerText.scaleY;
      const innerTextWidth = innerText.width * innerText.scaleX;

      // Ensure 1px padding around the text
      const padding = 12;
      const dialogBoxWidth = innerTextWidth + padding * 2;
      const dialogBoxHeight = innerTextHeight + padding * 2;

      // Adjust the chat bubble image to fit the text with padding
      const bubbleImage = this.scene.add.image(0, 0, "cloud_chat_bubble")
        // .setDisplaySize(dialogBoxWidth, dialogBoxHeight)
        .setAlpha(0.8)
        .setScale(0.5);

      playerThoughtBubble.add(bubbleImage);
      playerThoughtBubble.add(innerText);
      this.playerContainer.add(playerThoughtBubble);
      // Position the text inside the chat bubble
      innerText.setY(bubbleImage.y - bubbleImage.height / 6);

      this.playerThoughtBubbles.push(playerThoughtBubble);

      setTimeout(() => {
        playerThoughtBubble.removeAll(true);
        this.chatBubbleActive = false;
      }, 2000);
      return;
    }

    if (ntext === "..." && this.chatBubbleActive) {
      return;
    }

    for (let i = 0; i < this.playerThoughtBubbles.length; i++) {
      this.playerThoughtBubbles[i].removeAll(true);
    }
    this.chatBubbleActive = false;

    // this.playerPFP = this.scene.add
    //   .image(0, 0, fightersInfo.player1.profile_image)
    //insert PFP before chat so we know who is saying what
    //const chatString = "ME:" + ntext;

    const chatText = this.scene.add
      .text(0, 0, ntext, { wordWrap: { width: 100, useAdvancedWrap: true } })
      .setFontFamily("Arial")
      .setFontSize(10)
      .setColor("#000000")
      .setOrigin(0.5)
      .setResolution(2);

    // set dialogBox slightly larger than the text in it
    const chatTextHeight = chatText.height * chatText.scaleY;
    const chatTextWidth = chatText.width * chatText.scaleX;

    chatText.setY(-chatTextHeight / 2);
    const padding = 2;
    const dialogBoxWidth = chatTextWidth + padding * 2;
    const dialogBoxHeight = chatTextHeight + padding * 2;
    const dialogBoxX = -dialogBoxWidth / 2;
    const dialogBoxY = (-chatTextHeight);
    //const dialogBoxY = chatText.y - chatTextHeight / 2 - chatTextHeight;

    const playerDialogBubble = this.scene.add.container(0, -80).setDepth(90000);
    playerDialogBubble.add(
      this.scene.add.graphics()
        .fillStyle(0xffffff, 0.5)
        .fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
        .lineStyle(1, 0x000000, 1)
        .strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
    );
    // playerDialogBubble.add(chatText);

    this.playerContainer.add(playerDialogBubble);
    const triangle = this.scene.add.graphics();
    triangle.fillStyle(0xffffff, 0.5);
    triangle.lineStyle(.5, 0x000000, .5);
    const triangleHeight = 10;
    const triangleWidth = 12;

    triangle.beginPath();
    triangle.moveTo(dialogBoxX + dialogBoxWidth / 2 - triangleWidth / 2, dialogBoxY + dialogBoxHeight); // Left corner
    triangle.lineTo(dialogBoxX + dialogBoxWidth / 2 + triangleWidth / 2, dialogBoxY + dialogBoxHeight); // Right corner
    triangle.lineTo(dialogBoxX + dialogBoxWidth / 2, dialogBoxY + dialogBoxHeight + triangleHeight); // Bottom center (point)
    triangle.closePath();
    triangle.fillPath();
    triangle.strokePath();
    playerDialogBubble.add([chatText, triangle]);

    const moveUpAnimation = this.scene.tweens.add({
      targets: playerDialogBubble,
      y: -450,
      opacity: 0,
      scale: 0.5,
      duration: 10000,
      paused: true,
    });

    moveUpAnimation.on("complete", () => {
      playerDialogBubble.setPosition(0, 0).setScale(1);
      this.chatBubbleActive = false;
      this.clearDialogBubble(this.currentBubbleID);
      // this.dialogBubbleText = ""
    });
    const bubbleStartY = triangle.y;
    triangle.clear();
    setTimeout(() => {

      triangle.beginPath();
      triangle.moveTo(dialogBoxX + dialogBoxWidth / 2 - triangleWidth / 2, dialogBoxY + dialogBoxHeight); // Left corner
      triangle.lineTo(dialogBoxX + dialogBoxWidth / 2 + triangleWidth / 2, dialogBoxY + dialogBoxHeight); // Right corner
      triangle.lineTo(dialogBoxX + dialogBoxWidth / 2, bubbleStartY + dialogBoxHeight + triangleHeight); // Bottom center (point)
      triangle.closePath();
      triangle.fillPath();
      triangle.strokePath();
      moveUpAnimation.play();

    }, 1200);

    setTimeout(() => {
      playerDialogBubble.removeAll(true);
      // this.clearDialogBubble(randomID)
    }, 8000);
  }

  createThoughtBubbleCloud(text: string) {
    const randomID = uuidv4();
    this.currentBubbleID = randomID;
    // console.log("-in createThoughtBubbleCloud ... -----------", text)
    this.clearDialogBubble(randomID);
    const innerText = this.scene.add
      .text(0, -580, text, { wordWrap: { width: 265, useAdvancedWrap: true } })
      .setFontFamily("monospace")
      .setFontSize(22)
      .setColor("#000000")
      .setOrigin(0.5)
      .setScale(0.5);

    const innerTextHeight = innerText.height;
    const innerTextWidth = innerText.width;

    // innerText.setY(-innerTextHeight / 2);


    setTimeout(() => {
      this.clearDialogBubble(randomID);
    }, 500);
  }



  BaseUpdate(time: any, delta: any) {
    // this.playerContainer.x = this.teleport_coordinates.x;
    // this.playerContainer.y = this.teleport_coordinates.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20;
    // if (this.teleport) {
    //   console.log("in base update .. teleporting ");
    //   this.playerContainer.x = this.teleport_coordinates.x;
    //   this.playerContainer.y = this.teleport_coordinates.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20;
    //   this.teleport = false;
    // }
    this.UpdateStaminaV2();
    this.UpdateHealthV2();
    this.UpdateXPBar()
    this.UpdateLevelText()
    if (this.target_position_stored.x === 0) {
      return;
    }

    if (!isNullOrUndefined(this.target_position_stored)) {
      if (this.gassed_lift_off_fallen) {
        // lying down..
        this.SmoothMovementWhileDown();
      } else {
        this.SmoothMovement();
      }
    }
  }

  EnableHealthBars() {
    if (this.wallet_address != store.getState().web3store.userAddress) {
      return;
    }
    const createBar = (border, background, fill, x, y, value, fillColor) => {
      border.fillStyle(0x111b28, 1).fillRect(x - 1, y - 1, value + 2, 5); // Border
      background.fillStyle(0x222222, 1).fillRect(x, y, value, 3); // Background
      fill.fillStyle(fillColor, 1).fillRect(x, y, value, 3); // Fill
    };
    // Define positions and values
    const x = -25;
    const y = -10;
    createBar(this.healthBarBorder, this.healthBarBackground, this.healthBar, x, y - 8, this.totalHealthValue, 0x32cd32);
    createBar(this.staminaBarBorder, this.staminaBarBackground, this.staminaBar, x, y - 4, this.totalStaminaValue, 0x778afd);
    createBar(this.experienceBarBorder, this.experienceBarBackground, this.experienceBar, x, y, this.totalExperienceValue, 0xFF9900);
    //createBar() is properly setting the experienceBar fill but not health or staminaBar. Why?
    //manually stting it here because i am dumb
    this.healthBar.setY(-18);
    this.staminaBar.setY(-18);
    const temp = (this.totalExperienceValue / 1000) * (store.getState().playerDataStore?.playerStats?.xp || 0)
    // console.log("XP temp1", temp)
    this.experienceBar.clear()
    this.experienceBar.fillStyle(0xFF9900, 1);
    this.experienceBar.fillRect(-25, -10, temp, 3);
    // Add all elements to the playerInfoContainer
    this.playerInfoContainer.add([this.healthBarBorder, this.staminaBarBorder, this.experienceBarBorder,
    this.healthBarBackground, this.staminaBarBackground, this.experienceBarBackground,
    this.healthBar, this.staminaBar, this.experienceBar]);

    this.healthAndStaminaBarsEnabled = true;
  }

  DisableHealthBars() {
    if (this.healthAndStaminaBarsEnabled) return;
    this.playerContainer.remove([this.healthBarBackground, this.staminaBarBackground]);
    this.playerContainer.remove(this.healthBar);
    this.playerContainer.remove(this.staminaBar);
    this.healthAndStaminaBarsEnabled = false;
  }

  UpdateStaminaV2() {

    this.staminaBar.clear();
    let temp = (this.currStamina / this.max_stamina) * 50;
    if (temp > 50) temp = 50;
    this.staminaBar.fillStyle(0x778afd, 1);
    this.staminaBar.fillRect(-25, 4, temp, 3);
  }

  UpdateHealthV2() {
    if (this.currHealth <= 0) this.currHealth = 0;

    this.healthBar.clear();

    let temp = (this.currHealth / this.max_health) * 50;

    if (temp > 50) temp = 50;
    this.healthBar.fillStyle(0x32cd32, 1);
    this.healthBar.fillRect(-25, 0, temp, 3);


  }

  //players level should be tracked and created on server?
  getXPForLevel(level) {
    if (level === 0) return 10; // 10 XP for the first level
    return Math.floor(10 * Math.pow(1.2, level - 1)); // 20% increase for each subsequent level
  }

  UpdateXPBar() {
    // console.log("---debug ... ", this.lastXP, store.getState().playerDataStore?.playerStats?.xp)
    const level = (store.getState().playerDataStore?.playerStats?.level || 0);
    if (!this.otherPlayer) {

      let temp = Math.round((this.totalExperienceValue / this.getXPForLevel(level)) * (store.getState().playerDataStore?.playerStats?.xp || 0));
      temp = temp % 50;
      // console.log("debugxpbar --- ", temp)

      this.experienceBar.clear()
      this.experienceBar.fillStyle(0xFF9900, 1);
      this.experienceBar.fillRect(-25, -10, temp, 3);

      if (store.getState().playerDataStore?.playerStats?.xp != this.lastXP) {
        // console.log("XP lastXP if", this.lastXP, store.getState().playerDataStore?.playerStats?.xp)
        // if (store.getState().playerDataStore?.playerStats?.xp > this.lastXP) {
        const amount = Math.floor(Math.abs(store.getState().playerDataStore?.playerStats?.xp - this.lastXP));
        if (amount > 0) {
          this.popper.PopIt(this.playerContainer, amount, "xp", "#FF9900");
          this.lastXP = store.getState().playerDataStore?.playerStats?.xp;
          this.getXPSound.play({ loop: false });
        }

        // }
      } else {
        // console.log("XP lastXP 0", this.lastXP)
      }

      if (store.getState().web3BalanceStore.spiceChange != 0) {
        this.popper.PopIt(this.playerContainer, store.getState().web3BalanceStore.spiceChange, "spice", "#ff0000");
        store.dispatch(SetSpiceChange(0));
        //play bitz spicy.mp3
        const random = Math.floor(Math.random() * 3) + 1;
        if (random === 1) {
          this.sound_drbitz_spicy01.play({ loop: false });
        } else if (random === 2) {
          this.sound_drbitz_spicy02.play({ loop: false });
        } else {
          this.sound_drbitz_spicy03.play({ loop: false });
        }

      }

    }
  }

  UpdateLevelText() {
    const level = (store.getState().playerDataStore?.playerStats?.level || 0);
    const newLevelString = "Lvl:" + level.toString();
    if (!this.otherPlayer) {
      if (level > this.currentLevel) {
        // console.log("Level ", newLevelString)
        this.currentLevel = level;
        //player has reached a new level
        this.getLevelSound.play({ loop: false });
        this.popper.PopIt(this.playerContainer, level, "level", "#e5ff00");
      }

    }
    this.playerLevelText.setText(newLevelString);
    // const newTextWidth = newLevelString.length;
    // this.playerLevelText.x = this.playerWeb2Icon.x - newTextWidth * 6;
  }


  Teleport(x: number, y: number, orientation: string) {
    this.playerContainer.setX(x);
    this.playerContainer.setY(y);
    this.BaseUpdate();
    messageSender(this.webSocketConnection, this.playerContainer, "move", store.getState().web3store.userAddress, orientation);
    setTimeout(() => {
      messageSender(this.webSocketConnection, this.playerContainer, "moveEnd", store.getState().web3store.userAddress, orientation);
    }, 200);
  }

  TeleportBack(x: number, y: number) {
    this.playerContainer.setX(x);
    this.playerContainer.setY(y);
    this.BaseUpdate();
    messageSender(this.webSocketConnection, this.playerContainer, "move", store.getState().web3store.userAddress, this.value.orientation);
    setTimeout(() => {
      messageSender(this.webSocketConnection, this.playerContainer, "moveEnd", store.getState().web3store.userAddress, this.value.orientation);
    }, 200);
  }

  PopHealthReduced(amount: number, color = "") {
    if (color === "red") {
      this.popper.PopIt(this.playerContainer, amount, "damage", "#ff1a00")
    } else if (color === "green") {
      this.popper.PopIt(this.playerContainer, amount, "hp", "#21ff00")
    } else {
      this.popper.PopIt(this.playerContainer, amount, "damage", "#fefefe")
    }
  }

  SmoothMovement(pos = this.target_position_stored) {

    if (isNullOrUndefined(pos.x)) return;
    if (Math.abs(pos.x - this.playerContainer.x) >= 0.1 || Math.abs(pos.y - this.playerContainer.y) >= 0.1) {
      // this.need_to_move_player = true;
      this.tween_animation_running = true;
      this.moving = true;
    } else {
      // this.need_to_move_player = false;
      this.moving = false;
    }


    try {
      if (isNullOrUndefined(pos.x)) return;

      if (this.need_to_move_player) return;
      let animTime = 400;
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.playerContainer.x), 2) + Math.pow(Math.abs(pos.y - this.playerContainer.y), 2)) < 2) {
        animTime = 20;
      }
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.playerContainer.x), 2) + Math.pow(Math.abs(pos.y - this.playerContainer.y), 2)) < 20) {
        animTime = 100;
      }
      this.scene.tweens
        .add({
          targets: this.playerContainer,
          y: pos.y,
          x: pos.x,
          duration: animTime,
        })
        .on("start", () => {
          this.tween_animation_running = true;
          this.moving = true;
        })
        .on("complete", () => {
          this.tween_animation_running = false;
        });
    } catch (err) {
      // console.log("error_in_line 796 in baseplayer ", err, this.playerContainer, pos);
    }
  }

  SmoothMovementWhileDown(pos = this.target_position_stored) {
    if (isNullOrUndefined(pos.x) || pos.x === 0) return;
    if (Math.abs(pos.x - this.playerContainer.x) >= 0.1 || Math.abs(pos.y - this.playerContainer.y) >= 0.1) {
      this.tween_anim_running_down = true;
    } else {
      this.moving = false;
    }
    try {
      let animTime = 400;
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.playerContainer.x), 2) + Math.pow(Math.abs(pos.y - this.playerContainer.y), 2)) < 2) {
        animTime = 20;
      }
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.playerContainer.x), 2) + Math.pow(Math.abs(pos.y - this.playerContainer.y), 2)) < 20) {
        animTime = 100;
      }
      this.scene.tweens
        .add({
          targets: this.playerContainer,
          y: pos.y,
          x: pos.x,
          duration: animTime,
        })
        .on("start", () => {
          this.tween_anim_running_down = true;
          // this.moving = true;
        })
        .on("complete", () => {
          this.tween_anim_running_down = false;
        });
    } catch (err) {
      // console.log("error_in_line 796 in baseplayer ", err, this.playerContainer, pos);
    }
  }
}
