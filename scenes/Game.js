export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.score = 0;
    this.spawnDelay = 3000;
    this.recolectableDelay = 15000;
    this.lives = 5;
    this.timeElapsed = 0;
    this.cerebroSpawned = false;
    this.playerSpeed = 50; // Reduced speed
  }

  preload() {
    this.load.image("fondo", "../public/assets/background.jpg");
    this.load.image("zombie", "../public/assets/zombie.png");
    this.load.image("zombie2", "../public/assets/zombie2.png");
    this.load.image("zombie3", "../public/assets/zombie3.png");
    this.load.image("zombie4", "../public/assets/zombie4.png");
    this.load.image("zombie5", "../public/assets/zombie5.png");
    this.load.image("zombieGO", "../public/assets/zombieGO.png");
    this.load.image("cerebro", "../public/assets/cerebro.png");
    this.load.image("arbol", "../public/assets/arbol.png");
    this.load.image("roca", "../public/assets/roca.png");
    this.load.image("hueco", "../public/assets/hueco.png");
    this.load.image("mano", "../public/assets/mano.png");
    this.load.image("tronco", "../public/assets/tronco.png");
    this.load.image("cartel", "../public/assets/cartel.png");
    this.load.image("muñeco", "../public/assets/muñeco.png");
  }

  create() {
    this.cielo = this.add.image(400, 300, "fondo");
    this.cielo.setScale(2);

    this.player = this.physics.add.sprite(400, 50, "zombie");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.2);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.8);
    this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.1);

    this.cursor = this.input.keyboard.addKeys('W,A,S,D');

    this.recolectables = this.physics.add.group({ allowGravity: false });
    this.obstacles = this.physics.add.group({ allowGravity: false });

    this.physics.add.overlap(
      this.player,
      this.recolectables,
      this.collectRecolectable,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle,
      null,
      this
    );

    this.recolectableTimer = this.time.addEvent({
      delay: this.recolectableDelay,
      callback: this.createRecolectable,
      callbackScope: this,
      loop: true,
    });
    this.obstacleTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.createObstacle,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 10000,
      callback: this.increaseSpawnRate,
      callbackScope: this,
      loop: true,
    });

    // Crear las imágenes de las vidas
    this.livesImages = [];
    for (let i = 0; i < 5; i++) {
      const lifeImage = this.add.image(600 + i * 40, 32, 'mano').setScale(0.1).setTint(0xffffff);
      this.livesImages.push(lifeImage);
    }

    this.timeText = this.add.text(16, 16, 'Tiempo: 0', { fontFamily: 'Consolas', fontWeight: 'bold', fontSize: '32px', fill: '#000' });

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 50000,
      callback: () => {
        this.cerebroSpawned = true;
      },
      callbackScope: this,
    });
  }

  update() {
    this.player.setVelocityY(this.playerSpeed);

    if (this.cursor.A.isDown) {
      this.player.setVelocityX(-150);
    } else if (this.cursor.D.isDown) {
      this.player.setVelocityX(150);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursor.S.isDown) {
      this.player.setVelocityY(this.playerSpeed + 100); // Move down faster
    } else if (this.cursor.W.isDown) {
      this.player.setVelocityY(this.playerSpeed - 100); // Move up slower
    }

    const markerHeight = 100;

    this.obstacles.children.iterate(obstacle => {
      if (obstacle && obstacle.y < markerHeight) {
        obstacle.destroy();
      }
    });

    this.recolectables.children.iterate(recolectable => {
      if (recolectable && recolectable.y < markerHeight) {
        recolectable.destroy();
      }
    });
  }

  createRecolectable() {
    if (this.timeElapsed >= 50 && this.cerebroSpawned) {
      const x = Phaser.Math.Between(50, 750);
      const y = 600;

      if (this.isPositionFree(x, y, this.recolectables) && this.isPositionFree(x, y, this.obstacles)) {
        const recolectable = this.recolectables.create(x, y, "cerebro");
        recolectable.setVelocityY(-150);
        recolectable.setScale(0.2);
        recolectable.checkWorldBounds = true;
        recolectable.outOfBoundsKill = true;

        recolectable.body.setSize(recolectable.width * 0.7, recolectable.height * 0.7);
        recolectable.body.setOffset(recolectable.width * 0.15, recolectable.height * 0.15);
      }
    }
  }


  createObstacle() {
    const x = Phaser.Math.Between(50, 750);
    const y = 600;
    const obstacleType = Phaser.Math.Between(1, 6);
    let obstacleKey, obstacleScale, obstacle;

    if (this.isPositionFree(x, y, this.recolectables) && this.isPositionFree(x, y, this.obstacles)) {
      if (obstacleType === 1) {
        obstacleKey = 'arbol';
        obstacleScale = 0.5;
      } else if (obstacleType === 2) {
        obstacleKey = 'roca';
        obstacleScale = 0.1;
      } else if (obstacleType === 3) {
        obstacleKey = 'hueco';
        obstacleScale = 0.2;
      } else if (obstacleType === 4) {
        obstacleKey = 'tronco';
        obstacleScale = 0.2;
      } else if (obstacleType === 5) {
        obstacleKey = 'cartel';
        obstacleScale = 0.2;
      } else {
        obstacleKey = 'muñeco';
        obstacleScale = 0.1;
      }

      obstacle = this.obstacles.create(x, y, obstacleKey);
      obstacle.setVelocityY(-150);
      obstacle.setScale(obstacleScale);
      obstacle.checkWorldBounds = true;
      obstacle.outOfBoundsKill = true;

      obstacle.body.setSize(obstacle.width * 0.8, obstacle.height * 0.8);
      obstacle.body.setOffset(obstacle.width * 0.1, obstacle.height * 0.1);
    }
  }

  isPositionFree(x, y, group) {
    const buffer = 100;
    const children = group.getChildren();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (Phaser.Math.Distance.Between(x, y, child.x, child.y) < buffer) {
        return false;
      }
    }
    return true;
  }

  collectRecolectable(player, recolectable) {
    recolectable.destroy();
    if (this.lives < 5) {
      this.lives += 1;
      this.updateLivesDisplay();
      const zombieImages = ['zombie', 'zombie2', 'zombie3', 'zombie4', 'zombie5'];
      this.player.setTexture(zombieImages[5 - this.lives]);
    }
  }

  hitObstacle(player, obstacle) {
    obstacle.destroy();
    if (obstacle.texture.key === 'hueco') {
      this.lives = 0;
      this.player.setVisible(false); // Simulate falling into the hole
    } else {
      this.lives -= 1;
    }
    this.updateLivesDisplay();

    const zombieImages = ['zombie', 'zombie2', 'zombie3', 'zombie4', 'zombie5'];
    if (this.lives > 0) {
      this.player.setTexture(zombieImages[5 - this.lives]);
    } else {
      this.player.setTexture('zombieGO');
      this.physics.pause();
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.start('end-scene', { score: this.timeElapsed });
        },
        callbackScope: this,
      });
    }
  }

  updateTime() {
    this.timeElapsed += 1;
    this.timeText.setText('Tiempo: ' + this.timeElapsed);
  }

  updateLivesDisplay() {
    for (let i = 0; i < this.livesImages.length; i++) {
      if (i < this.lives) {
        this.livesImages[i].clearTint();
      } else {
        this.livesImages[i].setTint(0x555555);
      }
    }
  }

  increaseSpawnRate() {
    if (this.spawnDelay > 800) {
      this.spawnDelay -= 300;
    }
    if (this.recolectableDelay > 5000) {
      this.recolectableDelay -= 2000;
    }
    this.recolectableTimer.remove();
    this.obstacleTimer.remove();
    this.recolectableTimer = this.time.addEvent({
      delay: this.recolectableDelay,
      callback: this.createRecolectable,
      callbackScope: this,
      loop: true,
    });
    this.obstacleTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.createObstacle,
      callbackScope: this,
      loop: true,
    });
  }
}
