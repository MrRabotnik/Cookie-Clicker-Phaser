import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super("hello-world");
    }

    preload() {
        this.load.setBaseURL("https://labs.phaser.io");

        this.load.image("sky", "assets/skies/space3.png");
        this.load.image("logo", "assets/sprites/phaser3-logo.png");
        this.load.image("red", "assets/particles/red.png");
    }

    create() {
        // Get the game width and height
        const { width, height } = this.scale;

        // Add the sky image and set it to full width and height
        const sky = this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(width, height);

        // Add particles
        const particles = this.add.particles("red");

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: "ADD",
        });

        // Add the logo with physics and set properties
        const logo = this.physics.add.image(width / 2, height / 2, "logo");

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        // Make particles follow the logo
        emitter.startFollow(logo);
    }
}
