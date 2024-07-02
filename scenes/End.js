export default class End extends Phaser.Scene {
  constructor() {
    super("end-scene");
  }

  init(data) {
    this.finalScore = data.score;
  }

  preload() {
    this.load.image("perdiste", "./public/assets/perdiste.png"); 
    this.load.image("record", "./public/assets/record.png"); 
    this.load.image("restart", "./public/assets/restart.png"); 
    this.load.image("fondo2", "./public/assets/fondo2.png");
  }

  create() {
    this.cielo = this.add.tileSprite(400, 300, 800, 600, "fondo");

    const frasesBurlonas = [
      "¡Mirá, el zombi part-time! ¡Te estás desarmando, capo!",
"¡Pero mirá quién habla de perder la cabeza!",
"¡Me parece que ese brazo no te hacía falta, eh!",
"¡mirá quién se quedó sin pie! ¡Espero que no te haga falta!",
"¡Uy, ahí va otra pierna!",
"¡Ahí va la mano! ¡Ya ni para saludos estás!",
"¡Si seguís así, te vamos a tener que pegar con cinta scotch!",
"¡Te estás cayendo más veces que mi conexión a internet!",
"¡Si esquiar fuera un arte, vos serías un garabato!",
"¡Si seguís así, te vamos a tener que cambiar de deporte!",
"¡Bueno, al menos ahora sos más liviano para esquiar!",
"¡Ya entendimos que te gusta el riesgo!",
"¡Tu habilidad para esquiar es como tu estabilidad, ¡nula!",
"¡Tus reflejos son tan rápidos como un domingo a la mañana!",
"¡Esquiar no es lo tuyo, pero desarmarte lo hacés bárbaro!",
"¡Esquiar no es lo tuyo",
"¡Si te caes otra vez, te vamos a tener que pegar con Poxipol!",
"¡¿Pero qué haces?! ¡Otra vez al suelo!",
"¡Menos mal que sos un zombi!",
"¡Mirá cómo se cae, papá! ¡Ya ni gracia da!",
"¡Si te cayeras menos, esto sería más aburrido!",
"¡No sabíamos que eras tan aficionado al suelo!",
"¡Mejor tomate un break!",
"¡Dejá de caerte, ¡que nos vamos a quedar sin partes!",
"¡Tus caídas tienen más episodios que 'Los Simpson'!",
    ];

    const fraseAleatoria = Phaser.Utils.Array.GetRandom(frasesBurlonas);

    this.add.image(400, 150, 'perdiste').setOrigin(0.5).setScale(1); 
    this.add.image(350, 300, 'record').setOrigin(0.5).setScale(0.7); 
    this.add.text(450, 300, this.finalScore, { fontFamily: 'Consolas', fontSize: '48px', fontWeight: 'bold', fill: '#000000' }).setOrigin(0.5);

    this.add.text(400, 400, fraseAleatoria, { fontFamily: 'Consolas', fontSize: '24px', fontWeight: 'bold', fill: '#000000' }).setOrigin(0.5);

    const restartButton = this.add.image(400, 500, 'restart').setOrigin(0.5).setScale(0.3).setInteractive();
    restartButton.on('pointerdown', () => this.scene.start('Game'));
  }
}
