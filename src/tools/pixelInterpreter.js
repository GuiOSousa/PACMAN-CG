export default class PixelInterpreter {
	constructor() {}

	static async loadMap(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				const { data } = ctx.getImageData(0, 0, img.width, img.height);

				const pixels = [];
				for (let y = 0; y < img.height; y++) {
					const row = [];
					for (let x = 0; x < img.width; x++) {
						const i = (y * img.width + x) * 4;
						row.push({
							r: data[i],
							g: data[i + 1],
							b: data[i + 2],
							a: data[i + 3],
						});
					}
					pixels.push(row);
				}

				resolve(pixels);
			};

			img.onerror = () => {
				reject(new Error("Erro ao carregar mapa: " + url));
			};
		});
	}

}
