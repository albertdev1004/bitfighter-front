// @ts-nocheck

import phaserGame from "../../PhaserGame";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../configs";
import Game from "../scenes/Game";
export class Popper {
    scene: Phaser.Scene;
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    PopIt(entityContainer: Phaser.GameObjects.Container, value: number, type: string, color: string) {
        let numberSprite: Phaser.GameObjects.Text;
        let numberSize = 12;


        let particleSize = 12;
        let valueDuration = 1000;
        let particleDuration = 2000;
        let particleSprite = "";
        let textToPop = value.toString();
        let initY = entityContainer.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2;
        let yOffset = Math.random() * 30 + 50;


        let xOffset = Math.random() < 0.5
            ? -(Math.random() * 5 + 20)
            : Math.random() * 5 + 20;
        // let apexY = initY;
        const finalY = initY + DEFAULT_SPRITE_DISPLAY_HEIGHT;
        if (type == "spice") {
            particleSprite = "🌶️"
            valueDuration = 2000;
            particleDuration = 4000;
            yOffset = 80;
            particleSize = 18;

        } else if (type == "xp") {
            particleSprite = "⭐"
            yOffset = 70;
            //   valueDuration = 1000;

        } else if (type == "damage") {
            particleSprite = "";
            initY = entityContainer.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2;
            valueDuration = 500;
        } else if (type == "level") {
            xOffset = 0;
            yOffset = 90;
            particleSprite = "✨"
            particleSize = 18;
            numberSize = 20;
            textToPop = "Level Up! " + textToPop + "!";
            valueDuration = 2000;
            particleDuration = 4000;
        }

        try {
            numberSprite = this.scene.add
                .text(entityContainer.x, initY, textToPop)
                //.setFontFamily("monospace")
                .setFontFamily('Cooper Black')
                .setFontSize(numberSize)
                .setColor(color)
                .setOrigin(0.5)
                .setStroke(0x111b28, 2)
                .setDepth(9999)
                .setResolution(2);

            // Create particles as needed
            if (particleSprite != "") {
                const particles: Phaser.GameObjects.Text[] = [];
                for (let i = 0; i < 15; i++) {
                    const particle = this.scene.add
                        .text(entityContainer.x, initY, particleSprite)
                        .setFontFamily("Arial")
                        .setFontSize(particleSize)
                        .setColor("#FFD700")
                        .setOrigin(0.5)
                        .setDepth(9998);
                    particles.push(particle);
                    //Particle Burst
                    this.scene.tweens.add({
                        targets: particle,
                        x: particle.x + Phaser.Math.Between(-50, 50),
                        y: particle.y + Phaser.Math.Between(-50, 50),
                        alpha: { from: 1, to: 0 },
                        scale: { from: 1, to: 0 },
                        duration: particleDuration,
                        onComplete: () => particle.destroy(),
                    });
                }
            }
            this.scene.tweens.add({
                targets: numberSprite,
                y: {
                    from: initY,
                    to: initY - yOffset,
                    duration: valueDuration/2,
                    ease: "Quad.easeIn",
                },
                x: {
                    from: entityContainer.x,
                    to: entityContainer.x + xOffset,
                    duration: valueDuration/2,
                    ease: "Quad.easeIn",
                },
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: numberSprite,
                        y: {
                            from: initY - yOffset,
                            to: finalY,
                            duration: valueDuration / 2,
                            ease: "Quad.easeOut",
                            delay: valueDuration,
                            
                        },
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: numberSprite,
                                y: {
                                    from: finalY,
                                    to: finalY - 10, // Add a small bounce effect
                                    duration: valueDuration / 2,
                                    ease: "Bounce.easeOut",
                                },
                                alpha: { from: 1, to: 0 }, // Fade out
                                duration: valueDuration,
                                onComplete: () => {
                                    numberSprite.destroy();
                                },
                            });
                        },
                    });
                },
            });
            

        } catch (err) {
            // console.log("error in PopXP -->", err);
        }
    }
}