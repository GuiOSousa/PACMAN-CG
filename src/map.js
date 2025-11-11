// map.js
import Wall from "./objects/wall.js";

class MapNode {
  walls

  constructor(scene) {
    this.scene = scene;
    this.walls = []
  }

  getClosestCell(pos) {
    return [Math.round(pos[0]), Math.round(pos[1])]
  }

  setScene(s) {
    this.scene = s
  }

  isWall(pos) {
    return this.walls.find(p => p[0] == pos[0] && p[2] == pos[1])
  }

  async loadFromImage(url, scale = 1) {
    const img = await this.loadImage(url);

    // cria canvas temporário para leitura de pixels
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const { data } = ctx.getImageData(0, 0, img.width, img.height);

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const i = (y * img.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a === 0) continue; // ignora pixels transparentes

        // Mantém o sistema da imagem: canto superior esquerdo = (0,0)
        const posX = x * scale;
        const posZ = -y * scale; // inverte o eixo Y da imagem

        // vermelho (#ff0000): adiciona Wall
        if (r === 255 && g === 0 && b === 0) {
          this.scene.addObject(new Wall(this.scene.gl, [posX, 0, posZ]));
          this.walls.push([posX, 0, posZ])
        }

        else if (r === 0 && g === 255 && b === 0) {
  if (this.scene.player?.camera) {
    const newPos = [posX, 1.2, posZ]; // 1.2 mantém altura padrão da câmera
    this.scene.player.pos = newPos;
    console.log("Player posicionado em", newPos);
  }
}
      }
    }

    console.log("Mapa carregado:", img.width, "x", img.height);
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

 const Map = new MapNode()
export default Map