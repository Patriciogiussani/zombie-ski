// Start.js
export default class Start extends Phaser.Scene {
    constructor() {
      super({ key: 'Start' });
    }
  
    preload() {
      // Cargar las imágenes necesarias
     
      this.load.image('title', './public/assets/titulo.png'); // Reemplaza 'assets/title.png' con la ruta de tu imagen de título
      this.load.image('startButton', './public/assets/start.png'); // Reemplaza 'assets/startButton.png' con la ruta de tu imagen de botón
    }
  
    create() {

      
      // Agregar la imagen de título
      this.add.image(400, 200, 'title').setOrigin(0.5, 0.5);
  
      // Crear el botón de inicio
      const startButton = this.add.image(400, 400, 'startButton').setOrigin(0.5, 0.5).setInteractive();
  
      // Añadir el evento de clic al botón de inicio
      startButton.on('pointerdown', () => {
        this.scene.start('Game'); // Cambiar a la escena del juego
      });
    }
  }
  