export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.score = 0;
    this.spawnDelay = 2000;
    this.recolectableDelay = 15000;
    this.lives = 5;
    this.timeElapsed = 0;
    this.cerebroSpawned = false;
    this.playerSpeed = 50; 
    this.avalancheDirection = 1; 
  }

  preload() {
    this.load.image("fondo", "./public/assets/fondo2.png");
    this.load.image("zombie1", "./public/assets/zombie.png");
    this.load.image("zombie2", "./public/assets/zombie2.png");
    this.load.image("zombie3", "./public/assets/zombie3.png");
    this.load.image("zombie4", "./public/assets/zombie4.png");
    this.load.image("zombie5", "./public/assets/zombie5.png");
    this.load.image("zombieGO", "./public/assets/zombieGO.png");
    this.load.image("cerebro", "./public/assets/cerebro.png");
    this.load.image("arbol", "./public/assets/arbol.png");
    this.load.image("roca", "./public/assets/roca.png");
    this.load.image("hueco", "./public/assets/hueco.png");
    this.load.image("mano", "./public/assets/mano.png");
    this.load.image("tronco", "./public/assets/tronco.png");
    this.load.image("cartel", "./public/assets/cartel.png");
    this.load.image("avalancha", "./public/assets/avalanchaE.png");
    this.load.image("tiempo", "./public/assets/tiempo.png");
  }

  create() {
    this.cielo = this.add.tileSprite(400, 300, 800, 600, "fondo");

    
   
    this.avalancha = this.add.image(400, -150, "avalancha");
    this.avalancha.setScale(1.5);
    

    this.player = this.physics.add.sprite(400, 300, "zombie1");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.9);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.8);
    this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.1);

    this.cursor = this.input.keyboard.addKeys('W,A,S,D');

    this.recolectables = this.physics.add.group({ allowGravity: false });
    this.obstacles = this.physics.add.group({ allowGravity: false });

    this.physics.add.overlap(this.player, this.recolectables, this.collectRecolectable, null, this);
    this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.collider(this.player, this.avalancha, this.hitAvalanche, null, this); 
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

    this.livesImages = [];
    for (let i = 0; i < 5; i++) {
      const lifeImage = this.add.image(600 + i * 40, 32, 'mano').setScale(0.1).setTint(0xffffff);
      this.livesImages.push(lifeImage);
    }

    this.timeImage = this.add.image(16, 16, 'tiempo').setOrigin(0, 0).setScale(0.5);
    this.timeText = this.add.text(136, 25, this.formatTime(this.timeElapsed), { fontFamily: 'Consolas', fontSize: '32px', fill: '#000000' });

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
    if (this.cursor.W.isDown) {
      this.player.setVelocityY(-100 + this.playerSpeed);
    } else if (this.cursor.S.isDown) {
      this.player.setVelocityY(150 + this.playerSpeed);
    } else {
      this.player.setVelocityY(this.playerSpeed); 
    }

    if (this.cursor.A.isDown) {
      this.player.setVelocityX(-100);
    } else if (this.cursor.D.isDown) {
      this.player.setVelocityX(100);
    } else {
      this.player.setVelocityX(0);
    }

    this.cielo.tilePositionY += 1;

    const markerHeight = 100;

    this.obstacles.children.iterate(obstacle => {
      if (obstacle && obstacle.y < markerHeight) {
        obstacle.y -= 10;
        obstacle.destroy();
      }
    });

    this.recolectables.children.iterate(recolectable => {
      if (recolectable && recolectable.y < markerHeight) {
        recolectable.y -= 10;
        recolectable.destroy();
      }
    });

 
    this.avalancha.y += Math.sin(this.time.now / 500) * 0.5;
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
    const obstacleType = Phaser.Math.Between(1, 5);
    let obstacleKey, obstacleScale, obstacle;

    if (this.isPositionFree(x, y, this.recolectables) && this.isPositionFree(x, y, this.obstacles)) {
      if (obstacleType === 1) {
        obstacleKey = 'arbol';
        obstacleScale = 0.6;
      } else if (obstacleType === 2) {
        obstacleKey = 'roca';
        obstacleScale = 0.8;
      } else if (obstacleType === 3) {
        obstacleKey = 'hueco';
        obstacleScale = 0.3;
      } else if (obstacleType === 4) {
        obstacleKey = 'tronco';
        obstacleScale = 0.6;
      } else {
        obstacleKey = 'cartel';
        obstacleScale = 0.4;
      }

      obstacle = this.obstacles.create(x, y, obstacleKey);
      obstacle.setVelocityY(-150);
      obstacle.setScale(obstacleScale);
      obstacle.checkWorldBounds = true;
      obstacle.outOfBoundsKill = true;

      obstacle.body.setSize(obstacle.width * 0.7, obstacle.height * 0.7); 
      obstacle.body.setOffset(obstacle.width * 0.15, obstacle.height * 0.15);
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
      const zombieImages = ['zombie1', 'zombie2', 'zombie3', 'zombie4', 'zombie5'];
      this.player.setTexture(zombieImages[5 - this.lives]);
    }
  }

  hitObstacle(player, obstacle) {
    obstacle.destroy();
    if (obstacle.texture.key === 'hueco') {
      this.lives = 0;
      this.player.setVisible(false);
    } else {
      this.lives -= 1;
    }
    this.updateLivesDisplay();

    const zombieImages = ['zombie1', 'zombie2', 'zombie3', 'zombie4', 'zombie5'];
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

  hitAvalanche(player, avalanche) {
    this.lives = 0;
    this.player.setVisible(false);
    this.updateLivesDisplay();
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

  updateTime() {
    this.timeElapsed += 1;
    this.timeText.setText(this.formatTime(this.timeElapsed));
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
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
   
    if (this.spawnDelay > 300) {
      this.spawnDelay -= 400;  
    } else if (this.spawnDelay > 50) {
      this.spawnDelay -= 50;   
    }
    if (this.recolectableDelay > 3500) {
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
