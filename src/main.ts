import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import MenuScene from "./scenes/MenuScene";
import LoadingScreenScene from "./scenes/LoadingScreenScene";

const w = window.innerWidth;
const h = window.innerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: [GameScene],
    // scene: [GameScene, LoadingScreenScene, MenuScene],
};

export default new Phaser.Game(config);
