import Phaser from "phaser";
import HelloWorldScene from "./scenes/HelloWorldScene";

const w = window.innerWidth;
const h = window.innerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
