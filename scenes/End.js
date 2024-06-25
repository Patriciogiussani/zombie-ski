
export default class End extends Phaser.Scene {
  constructor() {
    super("end-scene");
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    const frasesBurlonas = [
      "Sos malooo chee",
      "Sos experto en perder vos",
      "Dedicate a otra cosa",
      "No podes ser tan malo",
      "Segui asi que vas a conseguir un record en perder",
      "Sos re manco",
      "Ponete a laburar mejor",
      "No podes ser tan horrible",
      "Toca reiniciar manco",
      
    ];

    const fraseAleatoria = Phaser.Utils.Array.GetRandom(frasesBurlonas);

    this.add.text(400, 200, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
    this.add.text(400, 300, 'Score: ' + this.finalScore, { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 400, fraseAleatoria, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

   
    this.input.on('pointerdown', () => this.scene.start('hello-world'));
  }
}
