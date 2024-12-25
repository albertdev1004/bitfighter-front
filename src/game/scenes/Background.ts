// @ts-nocheck
/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/no-unused-vars: off */

import Phaser from 'phaser'
// import { BackgroundMode } from '../../../types/BackgroundMode'

enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Background extends Phaser.Scene {
  private cloud!: Phaser.Physics.Arcade.Group
  private cloudKey!: string
  private backdropKey!: string

  constructor() {
    super('background')
    console.log("running constructor background.. ")
  }

  preload() {
    this.load.image('bg_bg', 'bitfgihter_assets/landing-page-about-section-bg.webp');
    // this.load.image('bg_bg', 'images/landing-page-about-section-bg.webp');
    console.log("running preload of background.. ")
  }

  create(data: { backgroundMode: BackgroundMode }) {
    // this.cameras.main.setBackgroundColor("background: radial-gradient(50% 50% at 50% 50%, rgba(4, 10, 22, 0.25) 0%, #040a16 100%), url("./ images / landing - page - about - section - bg.webp");")
    // this.cameras.main.setBackgroundColor('#111b28')


    const bg = this.add.image(0, 0, 'bg_bg');
    bg.setOrigin(0, 0); // Start from the top-left corner
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Stretch to fill screen
    bg.setAlpha(0.6)
    // Step 3: Create the gradient overlay using a Graphics object
    // const gradientOverlay = this.add.graphics();
    // const { width: w2, height: h2 } = this.cameras.main;

    // gradientOverlay.fillStyle(0x040a16, 1); // Outer color (in hex format)
    // gradientOverlay.fillRect(0, 0, w2, h2);

    // Create a radial gradient by layering circles
    // for (let i = 0; i < 200; i += 10) {
    //   gradientOverlay.fillStyle(Phaser.Display.Color.GetColor(4, 10, 22, 1 - i / 200));
    //   gradientOverlay.fillCircle(w2 / 2, height / 2, w2 / 2 - i);
    // }

    // gradientOverlay.setAlpha(0.25);

    // const bg = this.add.image(0, 0, 'bg_bg');
    // bg.setOrigin(0, 0); // Start from the top-left corner
    // bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Stretch to fill screen

    // // Step 3: Create the gradient overlay using a Graphics object
    // const gradientOverlay = this.add.graphics();
    // const { width, height } = this.cameras.main;

    // gradientOverlay.fillStyle(0x040a16, 1); // Outer color (in hex format)
    // gradientOverlay.fillRect(0, 0, width, height);

    // // Create a radial gradient by layering circles
    // for (let i = 0; i < 200; i += 10) {
    //   gradientOverlay.fillStyle(Phaser.Display.Color.GetColor(4, 10, 22, 1 - i / 200));
    //   gradientOverlay.fillCircle(width / 2, height / 2, width / 2 - i);
    // }

    // gradientOverlay.setAlpha(0.25);



    // const sceneHeight = this.cameras.main.height * 2
    // const sceneWidth = this.cameras.main.width

    // set texture of images based on the background mode
    // if (data.backgroundMode === BackgroundMode.DAY) {
    //   this.backdropKey = 'backdrop_day'
    //   this.cloudKey = 'cloud_day'
    //   this.cameras.main.setBackgroundColor('#c6eefc')
    // } else {
    //   this.backdropKey = 'backdrop_night'
    //   this.cloudKey = 'cloud_night'
    //   this.cameras.main.setBackgroundColor('#111B28')
    // }

    // Add backdrop image
    // const backdropImage = this.add.image(sceneWidth / 2, sceneHeight / 2, this.backdropKey)
    // const scale = Math.max(sceneWidth / backdropImage.width, sceneHeight / backdropImage.height)
    // console.log(sceneWidth, sceneWidth / backdropImage.width, sceneHeight / backdropImage.height)
    // backdropImage.setScale(scale).setScrollFactor(0)

    // Add sun or moon image
    // const sunMoonImage = this.add.image(sceneWidth / 2, sceneHeight / 2, 'sun_moon')
    // const scale2 = Math.max(sceneWidth / sunMoonImage.width, sceneHeight / sunMoonImage.height)
    // sunMoonImage.setScale(scale2).setScrollFactor(0)

    // Add 24 clouds at random positions and with random speeds
    // const frames = this.textures.get(this.cloudKey).getFrameNames()
    // this.cloud = this.physics.add.group()
    // for (let i = 0; i < 24; i++) {
    // const x = Phaser.Math.RND.between(-sceneWidth * 0.5, sceneWidth * 1.5)
    // const y = Phaser.Math.RND.between(sceneHeight * 0.2, sceneHeight * 0.8)
    // const velocity = Phaser.Math.RND.between(15, 30)

    // this.cloud
    //   .get(x, y, this.cloudKey, frames[i % 6])
    //   .setScale(3)
    //   .setVelocity(velocity, 0)
    // }

    // this.physics.add.staticSprite(400, 500, 'info_icon').setScale(0.4)
    //   .setName("dummyI")
    //   .setInteractive()
    //   .on('pointerdown', (pointer: Phaser.Input.Pointer, a: any) => {    
    //     console.log("objects clicked.. --- ", pointer.position)
    //   })

  }

  // update(t: number, dt: number) {
  //   // this.physics.world.wrap(this.cloud, 500)
  // }
}
