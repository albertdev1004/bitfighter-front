// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { IKeysInfo } from "../characters/IPlayer";
import Boundary from "../Components/Boundary";
import { rectangularCollision } from "../Components/utils";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT, DEFAULT_SPRITE_DISPLAY_WIDTH, DEFAULT_SPRITE_DISPLAY_WIDTH_2 } from "../configs";

const DEFAULT_SPRITE_DISPLAY_WIDTH_1 = DEFAULT_SPRITE_DISPLAY_WIDTH - 40;
const DEFAULT_SPRITE_DISPLAY_HEIGHT_1 = DEFAULT_SPRITE_DISPLAY_HEIGHT + 20;

function playerCollision(boundary: Boundary, player: any, velocity: number) {
    return (
        rectangularCollision(boundary, { x: player.x, y: player.y - velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(boundary, { x: player.x + DEFAULT_SPRITE_DISPLAY_WIDTH_1 / 2, y: player.y - velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(boundary, { x: player.x - DEFAULT_SPRITE_DISPLAY_WIDTH_1 / 2, y: player.y - velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
    );
}

export function rectangularCollisionWithRectange(rectangle1: Boundary, rectangle2: Boundary) {
    // console.log("in rectangularCollision ", rectangle1, rectangle2 )
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        (rectangle1.position.x <= rectangle2.position.x + rectangle2.width) &&
        (rectangle1.position.y + rectangle1.height >= rectangle2.position.y) &&
        (rectangle1.position.y <= rectangle2.position.y + rectangle2.height)
    )
}

export function basicCollisionAndMovementPlayerV3(totalBoundaries: any[], tempPos: { x: number, y: number }, delta: number, keyInfo: IKeysInfo, walk_speed: number, run_speed: number) {
    // move and update pos
    // console.log("in basicCollisionAndMovementPlayerV3")
    let normalizer = 0;
    if (keyInfo.keyA.pressed) normalizer += 1;
    if (keyInfo.keyD.pressed) normalizer += 1;
    if (keyInfo.keyS.pressed) normalizer += 1;
    if (keyInfo.keyW.pressed) normalizer += 1;
    let speed = walk_speed;
    let evetMovement = "move";

    if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
        speed = run_speed
        evetMovement = "running"
    }
    let velocity = speed;
    if (normalizer > 1) {
        velocity = speed / Math.sqrt(normalizer);
    }
    const playerRequiredBox = new Boundary(
        {
            x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_2 / 2 + 20,
            y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 5,
        },
        (DEFAULT_SPRITE_DISPLAY_WIDTH_2 - 30),
        10
    )

    const calculatedSpeed = 0.06 * delta * velocity;
    // console.log("velocity -- ", velocity, calculatedSpeed)
    if (keyInfo.keyA.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            const bdy = totalBoundaries[i]
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x - 3 * velocity,
                        y: playerRequiredBox.position.y
                    }
                })
            ) {
                // console.log("collision on A")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.x -= calculatedSpeed;
        }
    } if (keyInfo.keyD.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x + 3 * velocity,
                        y: playerRequiredBox.position.y
                    }
                })
            ) {
                // console.log("collision on D")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.x += calculatedSpeed;
        }
    } if (keyInfo.keyS.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y + 3 * velocity
                    }
                })
            ) {
                // console.log("collision on S")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.y += calculatedSpeed;
        }
    } if (keyInfo.keyW.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y - 3 * velocity
                    }
                })
            ) {
                // console.log("collision on W ", totalBoundaries[i])
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.y -= calculatedSpeed;
        }
    }

    return {
        event: evetMovement,
        pos: tempPos,
        calculatedSpeed,
    }
}

export function basicCollisionWithBoundaryAndPlayer(totalBoundaries: any[], tempPos: { x: number, y: number }, delta: number, keyInfo: IKeysInfo, p2Pos: { x: number, y: number }, walk_speed: number, run_speed: number) {
    // move and update pos
    // console.log("in basicCollisionWithBoundaryAndPlayer")
    let normalizer = 0;
    if (keyInfo.keyA.pressed) normalizer += 1;
    if (keyInfo.keyD.pressed) normalizer += 1;
    if (keyInfo.keyS.pressed) normalizer += 1;
    if (keyInfo.keyW.pressed) normalizer += 1;
    let speed = walk_speed;
    let evetMovement = "move";

    if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
        speed = run_speed
        evetMovement = "running"
    }
    let velocity = speed;
    if (normalizer > 1) {
        velocity = speed / Math.sqrt(normalizer);
    }
    const playerRequiredBox = new Boundary(
        {
            x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_2 / 2 + 4,
            y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 5,
        },
        (DEFAULT_SPRITE_DISPLAY_WIDTH_2 - 10),
        10
    )

    const player2RequiredBox = new Boundary(
        {
            x: p2Pos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_2 / 2 + 4,
            y: p2Pos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 5,
        },
        (DEFAULT_SPRITE_DISPLAY_WIDTH_2 - 10),
        10
    )

    // console.log(playerRequiredBox.position, player2RequiredBox.position)

    const calculatedSpeed = 0.06 * delta * velocity;
    // console.log("velocity -- ", velocity, calculatedSpeed, playerRequiredBox.position.x - 2* velocity, player2RequiredBox.position.x)
    if (keyInfo.keyA.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x - 5 * velocity,
                        y: playerRequiredBox.position.y
                    }
                }) ||
                rectangularCollisionWithRectange(player2RequiredBox, {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x - 3 * velocity,
                        y: playerRequiredBox.position.y
                    }
                })
            ) {
                // console.log("collision on A")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.x -= calculatedSpeed;
        }
    } if (keyInfo.keyD.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x + 5 * velocity,
                        y: playerRequiredBox.position.y
                    }
                }) ||
                rectangularCollisionWithRectange(player2RequiredBox, {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x + 3 * velocity,
                        y: playerRequiredBox.position.y
                    }
                })
            ) {
                // console.log("collision on D")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.x += calculatedSpeed;
        }
    } if (keyInfo.keyS.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y + 5 * velocity
                    }
                }) ||
                rectangularCollisionWithRectange(player2RequiredBox, {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y + 3 * velocity
                    }
                })
            ) {
                // console.log("collision on S")
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.y += calculatedSpeed;
        }
    } if (keyInfo.keyW.pressed) {
        let playerMoving = true;
        for (let i = 0; i < totalBoundaries.length; i++) {
            if (
                rectangularCollisionWithRectange(totalBoundaries[i], {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y - 5 * velocity
                    }
                }) ||
                rectangularCollisionWithRectange(player2RequiredBox, {
                    ...playerRequiredBox, position: {
                        x: playerRequiredBox.position.x,
                        y: playerRequiredBox.position.y - 3 * velocity
                    }
                })
            ) {
                // console.log("collision on W ", totalBoundaries[i])
                playerMoving = false;
                break;
            }
        }
        if (playerMoving) {
            tempPos.y -= calculatedSpeed;
        }
    }

    return {
        event: evetMovement,
        pos: tempPos,
        calculatedSpeed,
    }
}


export function checkIfNearOtherplayer(p1Pos: { x: number, y: number }, p2Pos: { x: number, y: number }) {

    const p1Box = new Boundary(
        {
            x: p1Pos.x - DEFAULT_SPRITE_DISPLAY_WIDTH,
            y: p1Pos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT,
        },
        40,
        40
    )

    const p2Box = new Boundary(
        {
            x: p2Pos.x - DEFAULT_SPRITE_DISPLAY_WIDTH,
            y: p2Pos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT,
        },
        40,
        40
    )

    return rectangularCollisionWithRectange(p1Box, p2Box)
}