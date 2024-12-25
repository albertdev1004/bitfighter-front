/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import JoystickController from 'joystick-controller'
import { checkIpad } from '../../utils/systemInfo'

class Joystick {
  public static outerRadius: number = 50
  public static innerRadius: number = 35
  public static isTouched: boolean = false
  private static staticJoystick: any
  private static buttons: any

  public static MoveController(listener: any) {
    this.staticJoystick = new JoystickController(
      {
        maxRange: 80,
        level: 10,
        radius: Joystick.outerRadius,
        joystickRadius: Joystick.innerRadius,
        opacity: 1,
        leftToRight: false,
        bottomToUp: true,
        containerClass: 'joystick-container',
        controllerClass: 'joystick-controller',
        joystickClass: 'joystick',
        dynamicPosition: true,
        distortion: true,
        mouseClickButton: 'MIDDLE',
        hideContextMenu: false,
        zIndex: 1,
      },
      (data: any) => {
        Joystick.isTouched = true
        listener(data)
      },
    )
  }

  public static ShootController(scene: Phaser.Scene, orientation: string, listener: any) {
    const width = scene.sys.game.canvas.clientWidth
    const height = scene.sys.game.canvas.clientHeight
    const isIpad = checkIpad()

    this.buttons = []

    const punch = scene.add.image(0, 0, 'joyA').setOrigin(0.5).setScrollFactor(0)
    punch.setScale(50 / punch.displayHeight).setAlpha(0.8)
    punch.x = width * 0.8 - punch.displayWidth * 0.5
    punch.y = height * 0.84 - punch.displayHeight * 0.5
    punch.setInteractive()
    punch.addListener(Phaser.Input.Events.POINTER_DOWN, () => {
      listener({ punch: true, kick: false })
    })

    const punch1 = scene.add.image(0, 0, 'joyA').setOrigin(0.5).setScrollFactor(0)
    punch1.setScale(50 / punch1.displayHeight).setAlpha(0.8)
    punch1.x = width * 0.8 - punch1.displayWidth * 0.5
    punch1.y = height * 0.84 - punch1.displayHeight * 0.5
    punch1.setInteractive()
    punch1.addListener(Phaser.Input.Events.POINTER_DOWN, () => {
      listener({ punch1: true, kick1: false })
    })

    const kick = scene.add.image(0, 0, 'joyB').setOrigin(0.5).setScrollFactor(0)
    kick.setScale(50 / kick.displayHeight).setAlpha(0.8)
    kick.x = punch.x + Math.floor(kick.displayWidth * 1.1)
    kick.y = punch.y
    kick.setInteractive()
    kick.addListener(Phaser.Input.Events.POINTER_DOWN, () => {
      listener({ punch: false, kick: true })
    })

    const kick1 = scene.add.image(0, 0, 'joyB').setOrigin(0.5).setScrollFactor(0)
    kick1.setScale(50 / kick1.displayHeight).setAlpha(0.8)
    kick1.x = punch1.x + Math.floor(kick1.displayWidth * 1.1)
    kick1.y = punch1.y
    kick1.setInteractive()
    kick1.addListener(Phaser.Input.Events.POINTER_DOWN, () => {
      listener({ punch1: false, kick1: true })
    })

    this.buttons.push(punch)
    this.buttons.push(kick)
    this.buttons.push(punch1)
    this.buttons.push(kick1)

    if (orientation == 'portrait') {
      this.buttons[0].x = width * (isIpad ? 0.68 : 0.85) - this.buttons[0].displayWidth * 1
      this.buttons[0].y = height * (isIpad ? 0.68 : 0.92) + this.buttons[0].displayHeight * 0.5

      this.buttons[1].x = width * (isIpad ? 0.68 : 0.85)
      this.buttons[1].y = this.buttons[0].y - this.buttons[1].displayHeight * 1

      this.buttons[2].x = width * (isIpad ? 0.68 : 0.85) - this.buttons[2].displayWidth * 1
      this.buttons[2].y = height * (isIpad ? 0.68 : 0.92) - this.buttons[2].displayHeight * 1.5

      this.buttons[3].x = width * (isIpad ? 0.68 : 0.85) - this.buttons[3].displayWidth * 2
      this.buttons[3].y = this.buttons[2].y + this.buttons[3].displayHeight * 1
    } else {
      this.buttons[0].x = width * (isIpad ? 0.68 : 0.9) - this.buttons[0].displayWidth * 1
      this.buttons[0].y = height * (isIpad ? 0.7 : 0.94) - this.buttons[0].displayHeight * 0.5

      this.buttons[1].x = this.buttons[0].x + Math.floor(this.buttons[1].displayWidth * 1.1)
      this.buttons[1].y = this.buttons[0].y
    }
  }
  public static destroy() {
    if (this.staticJoystick) this.staticJoystick!.destroy()
    if (this.buttons) {
      this.buttons.forEach((btn: any) => {
        if (btn) btn.destroy(true)
      })
    }
  }
}

export default Joystick
