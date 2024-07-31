const GRIDSIZE = 50;
const WIDTH = Math.floor(window.innerWidth / GRIDSIZE) * GRIDSIZE;
const HEIGHT = Math.floor(window.innerHeight / GRIDSIZE) * GRIDSIZE;
let game;

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO, 
        backgroundColor: "#E2E7F2", 
        scale: {
            mode: Phaser.Scale.FIT, 
            autoCenter: Phaser.Scale.CENTER_BOTH, 
            width: WIDTH, 
            height: HEIGHT, 
            resolution: window.devicePixelRatio || 1,
        }, 
        pixelArt: true, 
        physics: {
            default: "arcade", 
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: GameScene
    }
    game = new Phaser.Game(gameConfig)
    window.focus();
}

class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.key = key;
        this.score = 0;
        this.gameOverFlag = false;
    }
    preload() {
        // Minji
        this.load.image("still_01", "assets/Minji/Minji Still 1.png");
        this.load.image("still_02", "assets/Minji/Minji Still 2.png");
        this.load.image("walkright_01", "assets/Minji/Minji Walking Right 1.png");
        this.load.image("walkright_02", "assets/Minji/Minji Walking Right 2.png");
        this.load.image("walkleft_01", "assets/Minji/Minji Walking Left 1.png");
        this.load.image("walkleft_02", "assets/Minji/Minji Walking Left 2.png");
        this.load.image("jumpright_01", "assets/Minji/Minji Running Right.png");
        this.load.image("jumpright_02", "assets/Minji/Minji Jumping Right Down 2.png");
        this.load.image("jumpleft_01", "assets/Minji/Minji Running Left.png");
        this.load.image("jumpleft_02", "assets/Minji/Minji Jumping Left Down 2.png");

        // Collectables 
        this.load.image("apple", "assets/Collectables/Apple.png");
        this.load.image("avocado", "assets/Collectables/Avocado.png");
        this.load.image("blueberry", "assets/Collectables/Blueberry.png");
        this.load.image("cherries", "assets/Collectables/Cherries.png");
        this.load.image("kiwi", "assets/Collectables/Kiwi.png");
        this.load.image("lemon", "assets/Collectables/Lemon.png");
        this.load.image("nut", "assets/Collectables/Nut.png");
        this.load.image("orange", "assets/Collectables/Orange.png");
        this.load.image("pear", "assets/Collectables/Pear.png");
        this.load.image("strawberry", "assets/Collectables/Strawberry.png");
        this.load.image("basket", "assets/Collectables/Basket.png");

        // Background Object
        this.load.image("log", "assets/Background Objects/Log.png");
        this.load.image("cloud_01", "assets/Background Objects/Clouds 1.png");
        this.load.image("ground", "assets/Background Objects/Ground.png");
    }

    addFruitAbove(log) {
        const y = log.y - log.displayHeight / 2 - 50;
        const fruitTypes = ['apple', 'avocado', 'blueberry', 'cherries', 'kiwi', 'lemon', 'nut', 'orange', 'pear', 'strawberry'];
        const fruitType = Phaser.Math.RND.pick(fruitTypes);

        const fruit = this.physics.add.sprite(log.x, y, fruitType).setDepth(0);
        this.physics.add.collider(fruit, log);
        this.physics.add.overlap(this.minji, fruit, this.collectFruits, null, this);
    }

    collectFruits(minji, fruit) {
        fruit.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText(`${this.score}`);

        if (this.score == 100) {
            this.gameOver();
        }
    }

    create() {
        // Background 
        this.ground = this.physics.add.image(game.config.width / 2, 750, "ground").setImmovable(true);
        this.cloudGroup = this.physics.add.group({immovable: true, allowGravity: false});
        for (let i = 0; i < 5; i++) {
            let cloudX = Phaser.Math.Between(0, game.config.width);
            let cloudY = Phaser.Math.Between(35, HEIGHT - 330 - 35);
            this.cloudGroup.create(cloudX, cloudY, "cloud_01");
        }

        // Score
        this.gameInfo = this.add.text(20, 30, "Help Minji collect 100 fruits! Refresh the page to restart the game.", {
            fontSize: '24px',
            fill: '#000000'
        }).setScrollFactor(0);
        this.gameInfo.setDepth(1);
        this.basketIcon = this.add.image(40, 100, "basket").setScale(0.5);
        this.basketIcon.setDepth(1);
        this.basketIcon.setScrollFactor(0);
        this.scoreText = this.add.text(75, 90, '0', {
            fontSize: '24px',
            fill: '#000000'
        }).setScrollFactor(0);
        this.scoreText.setDepth(1);

        // Platforms
        this.startingLog = this.physics.add.image(WIDTH / 2, 550, "log").setImmovable(true);
        this.staticLogs = this.physics.add.staticGroup();
        for (let i = 0; i < 7; i++) {
            const x = Phaser.Math.Between(100, WIDTH - 50);
            const y = HEIGHT - 325 - (i * 150);
            const staticLog = this.staticLogs.create(x, y, "log");
            staticLog.setImmovable(true);
            const body = staticLog.body;
            body.updateFromGameObject();
        }

        // Minji
        this.minji = this.physics.add.sprite(game.config.width / 2, 485, "still_01");
        this.minji.setGravityY(275);
        this.minji.setBounce(0.2);
        this.minji.setDepth(1);
        this.minji.body.checkCollision.up = false;
        this.minji.body.checkCollision.left = false;
        this.minji.body.checkCollision.right = false;

        // Movement Animations
        this.anims.create({
            key: 'idle right',
            frames: [{ key: 'still_01' }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'idle left',
            frames: [{ key: 'still_02' }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'walk right',
            frames: [
                {key: 'still_01'},
                {key: 'walkright_01'},
                {key: 'walkright_02'},
            ], 
            frameRate: 6, 
            repeat: -1
        });

        this.anims.create({
            key: 'walk left',
            frames: [
                {key: 'still_02'},
                {key: 'walkleft_01'},
                {key: 'walkleft_02'},
            ],
            frameRate: 6, 
            repeat: -1,
        });

        this.anims.create({
            key: 'jump right',
            frames: [
                {key: 'jumpright_01'},
                {key: 'jumpright_02'},
                {key: 'jumpright_01'},
            ], 
            frameRate: 6, 
            repeat: 1
        });

        this.anims.create({
            key: 'jump left',
            frames: [
                {key: 'jumpleft_01'},
                {key: 'jumpleft_02'},
                {key: 'jumpleft_01'},
            ], 
            frameRate: 6, 
            repeat: 1
        });

        // Camera 
        this.cameras.main.startFollow(this.minji, true, 0.1, 0.1);
        
        // Colliders
        this.physics.add.collider(this.minji, this.ground);
        this.physics.add.collider(this.startingLog, this.minji);
        this.physics.add.collider(this.staticLogs, this.minji);

        // Setting Up Levels
        this.setupLevel();
    
        // Setting Up Cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Clouds
        this.cloudGroup.children.iterate(cloud => {
            if (cloud.y > this.cameras.main.scrollY + this.cameras.main.height) {
                cloud.y = this.cameras.main.scrollY - cloud.height;
                cloud.x = Phaser.Math.Between(0, game.config.width);
            }
        });

        // Platforms
        this.staticLogs.children.iterate(staticLog => {
            if (staticLog.y > this.cameras.main.scrollY + this.cameras.main.height) {
                staticLog.y = this.cameras.main.scrollY - staticLog.height;
                staticLog.x = Phaser.Math.Between(0, game.config.width);
                staticLog.body.updateFromGameObject();
                this.addFruitAbove(staticLog);
            }
        });

        // Walking
        if (this.cursors.left.isDown) {
            this.minji.facing = 'left';
            this.minji.setVelocityX(-150);
            if (this.minji.body.touching.down) {
                this.minji.anims.play('walk left', true);
            }
        } else if (this.cursors.right.isDown) {
            this.minji.facing = 'right';
            this.minji.setVelocityX(150);
            if (this.minji.body.touching.down) {
                this.minji.anims.play('walk right', true);
            }
        } else {
            this.minji.setVelocityX(0);
            if (this.minji.facing === 'left') {
                this.minji.anims.play('idle left', true);
            } else {
                this.minji.anims.play('idle right', true); 
            }
        }
    
        // Jumping
        if (this.cursors.up.isDown && this.minji.body.touching.down) {
            this.minji.setVelocityY(-330);
            if (this.minji.facing === 'left') {
                this.minji.anims.play('jump left', true);
            } else if (this.minji.facing === 'right') {
                this.minji.anims.play('jump right', true);
            }
        }
    }
    setupLevel() {}
    
    gameOver() {
        if (this.gameOverFlag) return;
        this.gameOverFlag = true;
        this.scoreText = this.add.text(20, 150, "Congratulations! You've completed the game!", {
            fontSize: '30px',
            fill: '#000000'
        }).setScrollFactor(0);
        this.scoreText.setDepth(1);

        // Restarting Game
        this.time.delayedCall(5000, () => {
            this.scene.restart();
        });
    }
}