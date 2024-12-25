// @ts-nocheck
// import { isNullOrUndefined } from "util";
import { fetchPlayerWalletInfo } from "../../hooks/ApiCaller";
import phaserGame from "../../PhaserGame";
import store from "../../stores";
import { SetFocussedOnChat, ShowChatWindow } from "../../stores/UserActions";
import { IKeysInfo } from "../characters/IPlayer";
import Game from "../scenes/Game";
import { BasePlayer } from "./BasePlayer";
export default class KeyControls {
  game: Game;
  keys: IKeysInfo;
  onKeysChange = false;

  previousButtonStates = []
  previousAxisState = {
    x: { negative: false, positive: false },
    y: { negative: false, positive: false }
  };

  constructor() {
    this.game = phaserGame.scene.keys.game as Game;
    this.addControls();

    // this.previousButtonStates = []
    // this.directionState = []


    this.keys = {
      keyA: {
        pressed: false,
        double_pressed: false,
      },
      keyD: {
        pressed: false,
        double_pressed: false,
      },
      keyS: {
        pressed: false,
      },
      keyW: {
        pressed: false,
      },
      keyP: {
        pressed: false,
      },
      keyK: {
        pressed: false,
      },
      leftShift: {
        pressed: false,
      },
      keyBlock: {
        pressed: false,
      },
      keyQ: {
        pressed: false,
        time_last_pressed: 1,
        time_last_lifted: 1,
      },
      lastKey: "",
    };


  }

  keyQCodeDownHandler() {
    if (store.getState().assetStore.in_hand_brew && this.keys.keyQ.time_last_lifted && new Date().getTime() - this.keys.keyQ.time_last_lifted > 100) {
      this.keys.keyQ.pressed = true;
    }
    console.log("keyQCodeDownHandler---", store.getState().assetStore)

    if (store.getState().assetStore.semiEquippedBrewCount > 0) {
      const temp = this.game.otherPlayers.get(store.getState().web3store.player_id);
      if (temp?.gameObject) {
        this.keys.keyQ.time_last_lifted = new Date().getTime();
        this.game.lobbySocketConnection.send(
          JSON.stringify({
            event: "equip_brew",
            walletAddress: store.getState().web3store.userAddress,
            minted_id: temp.minted_id,
          })
        );
      }
      return
    }

    if (store.getState().assetStore.equippedBrewCount > 0 && new Date().getTime() - this.keys.keyQ.time_last_lifte > 1000) {
      const temp = this.game.otherPlayers.get(store.getState().web3store.player_id);
      if (temp?.gameObject) {
        this.keys.keyQ.time_last_lifted = 0;
        this.game.lobbySocketConnection.send(
          JSON.stringify({
            event: "brew_used",
            walletAddress: store.getState().web3store.userAddress,
            minted_id: temp.minted_id,
          })
        );
        setTimeout(() => {
          fetchPlayerWalletInfo()
        }, 1000)
      }
      return
    }
  }




  handleKeyPress(keyName: string, timeLimit: number = 300) {
    const currentTime = new Date().getTime();
    if (
      this.keys[keyName].time_last_lifted &&
      currentTime - this.keys[keyName].time_last_lifted <= timeLimit ||
      this.keys.leftShift.pressed
    ) {
      this.keys[keyName].double_pressed = true;
    }

    this.onKeysChange = true;
    this.keys[keyName].pressed = true;
    this.keys.lastKey = keyName;
  }
  handleKeyUp(keyName: string) {
    this.keys[keyName].pressed = false;
    this.keys[keyName].time_last_lifted = new Date().getTime();

    // Reset the double-pressed flag only when the key is released
    this.keys[keyName].double_pressed = false;
    this.keys.lastKey = "";
  }
  //Key Down Listener
  keyWPressDown() {
    this.handleKeyPress("keyW");
  }
  keySPressDown() {
    this.handleKeyPress("keyS");
  }
  keyAPressDown() {
    this.handleKeyPress("keyA");
  }
  keyDPressDown() {
    this.handleKeyPress("keyD");
  }
  keyPPressDown() {
    this.handleKeyPress("keyP", true); // Skipping double press check for KeyP
  }
  keyKPressDown() {
    this.handleKeyPress("keyK", true); // Skipping double press check for KeyK
  }
  //Key Up Listener
  KeyDPressedUp() {
    this.handleKeyUp("keyD", true); // Track time when KeyD is released
  }
  KeyAPressedUp() {
    this.handleKeyUp("keyA", true); // Track time when KeyA is released
  }
  KeyWPressedUp() {
    this.handleKeyUp("keyW");
  }
  KeySPressedUp() {
    this.handleKeyUp("keyS");
  }
  KeyPPressedUp() {
    this.handleKeyUp("keyP");
  }
  KeyKPressedUp() {
    this.handleKeyUp("keyK");
  }

  keyEnterPressDown() {
    if (this.game.enter_pressed) {
      store.dispatch(SetFocussedOnChat(false));
      store.dispatch(ShowChatWindow(false));
      this.game.enter_pressed = false;
    } else {
      store.dispatch(SetFocussedOnChat(true));
      store.dispatch(ShowChatWindow(true));
      this.game.enter_pressed = true;
    }
  }

  KeyQPressedUp() {
    this.keys.keyQ.pressed = false;
    // console.log("debugQ released", store.getState().assetStore.equippedBrewCount, this.keys.keyQ.time_last_lifted);
    if (store.getState().assetStore.in_hand_brew) {
      this.keys.keyQ.time_last_lifted = new Date().getTime();
    }
  }


  // Call the method for each key press up



  addControls() {
    this.game.input.keyboard.on("keydown", (event: { code: string }) => {
      // console.log("keydown--",event.code)
      switch (event.code) {
        case "KeyB":
          this.keys.keyBlock.pressed = true;
          break;
        case "ShiftLeft":
          this.keys.leftShift.pressed = true;
          break;
        case "KeyD":
          this.keyDPressDown()
          break;
        case "KeyA":
          this.keyAPressDown()
          break;
        case "KeyW":
          this.keyWPressDown()
          break;
        case "KeyS":
          this.keySPressDown()
          break;
        case "KeyP":
          this.keyPPressDown()
          break;
        case "KeyK":
          this.keyKPressDown()
          break;
        case "KeyQ":
          this.keyQCodeDownHandler()
          break;
        case "Enter":
          this.keyEnterPressDown()
          break;
      }
    });



    this.game.input.keyboard.on("keyup", (event: { code: string }) => {
      switch (event.code) {
        case "KeyB":
          this.keys.keyBlock.pressed = false;
          break;
        case "ShiftLeft":
          this.keys.leftShift.pressed = false;
          break;
        case "KeyQ":
          this.KeyQPressedUp()
          break;
        case "KeyD":
          this.KeyDPressedUp()
          break;
        case "KeyA":
          this.KeyAPressedUp()
          break;
        case "KeyW":
          this.KeyWPressedUp()
          break;
        case "KeyS":
          this.KeySPressedUp()
          break;
        case "KeyP":
          this.KeyPPressedUp()
          break;
        case "KeyK":
          this.KeyKPressedUp()
          break;
      }
    });


    // Gamepad Input
    window.addEventListener("gamepadconnected", (e: GamepadEvent) => {
      console.log("Gamepad connected at index " + e.gamepad.index);
      this.gameLoop(); // Start game loop
    });

    window.addEventListener("gamepaddisconnected", (e: GamepadEvent) => {
      console.log("Gamepad disconnected from index " + e.gamepad.index);
    });

  }



  gameLoop() {
    // requestAnimationFrame(this.gameLoop);
    requestAnimationFrame(() => this.gameLoop());
    // Poll for gamepad state
    const gamepads = navigator.getGamepads();

    if (gamepads[0]) {
      this.handleGamepadInput(gamepads[0]);
    }
  }

  handleGamepadInput(pad) {
    const buttonMappings = {
      0: "A",
      1: "B",
      2: "X",
      3: "Y",
      4: "LB",   // Left Bumper
      5: "RB",   // Right Bumper
      6: "LT",   // Left Trigger
      7: "RT",   // Right Trigger
      8: "Back", // Back Button
      9: "Start",// Start Button
      10: "LS",  // Left Stick Button
      11: "RS"   // Right Stick Button
    };

    // Initialize previousButtonStates if not done
    if (this.previousButtonStates.length === 0) {
      this.previousButtonStates = pad.buttons.map(button => button.pressed);
    }

    // Handle button inputs (detect key down and key up)
    pad.buttons.forEach((button, index) => {
      const currentState = button.pressed;
      const previousState = this.previousButtonStates[index];

      if (currentState && !previousState) {
        // Key down event
        console.log(`${buttonMappings[index] || `Button ${index}`} is pressed`);
        this.handleButtonDown(index);  // Call the appropriate action based on button
      } else if (!currentState && previousState) {
        // Key up event
        console.log(`${buttonMappings[index] || `Button ${index}`} is released`);
        this.handleButtonUp(index);    // Handle button release logic here
      }

      // Update previous button state
      this.previousButtonStates[index] = currentState;
    });


    const threshold = 0.5;

    const keyMap = {
      x: {
        negative: {
          press: () => this.keyAPressDown(),  // Left (A key)
          release: () => this.KeyAPressedUp()
        },
        positive: {
          press: () => this.keyDPressDown(),  // Right (D key)
          release: () => this.KeyDPressedUp()
        }
      },
      y: {
        negative: {
          press: () => this.keyWPressDown(),  // Up (W key)
          release: () => this.KeyWPressedUp()
        },
        positive: {
          press: () => this.keySPressDown(),  // Down (S key)
          release: () => this.KeySPressedUp()
        }
      }
    };



    // Handle the x-axis movement (left-right)
    if (pad.axes[0] < -threshold) {
      if (!this.previousAxisState.x.negative) {
        keyMap.x.negative.press();
        this.previousAxisState.x.negative = true;
      }
      this.previousAxisState.x.positive = false; // Ensure the positive direction is not active
    } else if (pad.axes[0] > threshold) {
      if (!this.previousAxisState.x.positive) {
        keyMap.x.positive.press();
        this.previousAxisState.x.positive = true;
      }
      this.previousAxisState.x.negative = false; // Ensure the negative direction is not active
    } else {
      // Axis is in neutral zone
      if (this.previousAxisState.x.negative) {
        keyMap.x.negative.release();
        this.previousAxisState.x.negative = false;
      }
      if (this.previousAxisState.x.positive) {
        keyMap.x.positive.release();
        this.previousAxisState.x.positive = false;
      }
    }

    // Handle the y-axis movement (up-down)
    if (pad.axes[1] < -threshold) {
      if (!this.previousAxisState.y.negative) {
        keyMap.y.negative.press();
        this.previousAxisState.y.negative = true;
      }
      this.previousAxisState.y.positive = false; // Ensure the positive direction is not active
    } else if (pad.axes[1] > threshold) {
      if (!this.previousAxisState.y.positive) {
        keyMap.y.positive.press();
        this.previousAxisState.y.positive = true;
      }
      this.previousAxisState.y.negative = false; // Ensure the negative direction is not active
    } else {
      // Axis is in neutral zone
      if (this.previousAxisState.y.negative) {
        keyMap.y.negative.release();
        this.previousAxisState.y.negative = false;
      }
      if (this.previousAxisState.y.positive) {
        keyMap.y.positive.release();
        this.previousAxisState.y.positive = false;
      }
    }
  }

  handleButtonDown(index: number) {
    switch (index) {
      case 3: // Y
        this.keyKPressDown();
        break;
      case 1: // B
        this.keyPPressDown();
        break;


      case 12: // up
        this.keyWPressDown()
        break

      case 13: // down
        this.keySPressDown()
        break

      case 14: // up
        this.keyAPressDown()
        break

      case 15: // up
        this.keyDPressDown()
        break
    }
  }

  handleButtonUp(index: number) {
    switch (index) {
      case 3: // Y
        this.KeyKPressedUp()
        break;
      case 1: // B
        this.KeyPPressedUp()
        break;

      case 12: // up
        this.KeyWPressedUp()
        break

      case 13: // down
        this.KeySPressedUp()
        break

      case 14: // up
        this.KeyAPressedUp()
        break

      case 15: // up
        this.KeyDPressedUp()
        break
    }
  }




}
