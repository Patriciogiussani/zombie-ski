export default class Start extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });
  }

  preload() {
   
    this.load.image('title', './public/assets/titulo.png');
    this.load.image('startButton', './public/assets/start.png');
    this.load.video('video', './public/assets/video.mp4', 'loadeddata', false, true);
    this.load.audio('startMusic', './public/assets/musica2.mp3');
  }

  create() {

    this.startMusic = this.sound.add('startMusic');
        this.startMusic.play({ loop: true });

    
    const video = this.add.video(400, 300, 'video');
    video.setAlpha(0.3).play(true).setLoop(true); 


    this.add.image(400, 200, 'title').setOrigin(0.5, 0.5);

   
    const startButton = this.add.image(400, 400, 'startButton').setOrigin(0.5, 0.5).setInteractive();

   
    startButton.on('pointerdown', () => {
      this.scene.start('Game'); 
    });
  }
}
