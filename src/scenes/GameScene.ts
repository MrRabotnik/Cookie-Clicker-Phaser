import Phaser from "phaser";
import ScoreLabel from "../ScoreLabel/scoreLabel";
import BombSpawner from "../BombSpawner/bombSpawner";

export default class GameScene extends Phaser.Scene {
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars!: Phaser.Physics.Arcade.Group;
    private scoreLabel!: ScoreLabel;
    private bombSpawner!: BombSpawner;
    private gameOver: boolean = false;

    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    createPlayer(): Phaser.Physics.Arcade.Sprite {
        const player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        return player;
    }

    createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, "ground").setScale(2).refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        return platforms;
    }

    update() {
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up?.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    createStars(): Phaser.Physics.Arcade.Group {
        const stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        stars.children.iterate((child: any) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        return stars;
    }

    collectStar(player: Phaser.Physics.Arcade.Sprite, star: any) {
        star.disableBody(true, true);
        this.scoreLabel.add(10);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child: any) => {
                child.enableBody(true, child.x, 0, true, true);
            });
        }

        this.bombSpawner.spawn(player.x);
    }

    createScoreLabel(x: number, y: number, score: number): ScoreLabel {
        const style = { fontSize: "32px", fill: "#000" };
        const label = new ScoreLabel(this, x, y, score, style);

        this.add.existing(label);

        return label;
    }

    hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Image) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.gameOver = true;
    }

    create() {
        this.add.image(400, 300, "sky");

        this.platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();

        this.scoreLabel = this.createScoreLabel(16, 16, 0);
        this.bombSpawner = new BombSpawner(this, "bomb");

        const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(bombsGroup, this.platforms);
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, undefined, this);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
}
