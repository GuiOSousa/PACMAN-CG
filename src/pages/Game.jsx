import { useEffect, useRef } from "react";
import Scene from "../gameStrutcures/scene.js";
import Map from "../gameStrutcures/map.js";
import Wall from "../objects/wall.js";
import Enemy from "../entities/enemy1.js";
import './Game.css'
import PlayerCoordinatesDisplay from "../components/PlayerCoordinates.jsx";
import ScoreDisplay from "../components/ScoreDisplay.jsx";
import Floor from "../objects/ground.js";

export default function GameCanvas() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		const gl = canvas.getContext("webgl", { antialias: true });
		if (!gl) {
			return
		}

		function resize() {
			const w = canvas.clientWidth | 0
			const h = canvas.clientHeight | 0

			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w
				canvas.height = h
				gl.viewport(0, 0, w, h)
			}
		}

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		resize();

		const scene = new Scene(gl)
		scene.addEntity(new Enemy(gl, [42, 0, -36], scene))
		
		const floor = new Floor(gl, [0, 0, -121], [121,121])
		scene.addObject(floor);

		Map.setScene(scene);
		Map.loadFromImage("src/assets/map.png", 1);

		let last = performance.now();
		function loop(now) {
			const dt = Math.min((now - last) / 1000, 0.04);
			last = now;
			scene.player.update(dt);
			scene.render(dt);

			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);

		return () => {
			ro.disconnect();
		}
	}, [])

	return (
		<>
		<div className="Displays">
			<PlayerCoordinatesDisplay/>
			<ScoreDisplay/>
		</div>
		<canvas ref={canvasRef} id="c"
		style={{
			width: "100vw",
			height: "100vh",
			display: "block",
		}}
		/>
		</>
	);
}
