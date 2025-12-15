import { useEffect, useRef } from "react";
import Scene from "../gameStrutcures/scene.js";
import Map from "../gameStrutcures/map.js";
import Wall from "../objects/wall.js";
import Enemy from "../entities/enemy1.js";
import './Game.css'
import PlayerCoordinatesDisplay from "../components/PlayerCoordinates.jsx";
import ScoreDisplay from "../components/ScoreDisplay.jsx";
import Floor from "../objects/ground.js";
import Crystal from "../objects/crystal.js";
import CrystalController from "../gameStrutcures/crystalController.js";
import RouteGhost from "../entities/routeGhost.js";
import { GameEvents } from "../events/events.js";
import { useNavigate } from "react-router-dom";
import variables from "../events/signal.js";

export default function GameCanvas() {
	const canvasRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const onGameOver = () => {
			navigate("/gameOver");
		};

		async function loadGame() {
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
			scene.addEntity(new Enemy(gl, [42, 1, -36], scene))

			const routes = [
				[[49, 1, -57], [49, 1, -80], [43, 1, -80], [43, 1, -72], [41, 1, -72], [41, 1, -80], [37, 1, -80], [37, 1, -68], [48, 1, -68], [48, 1, -66] [37, 1, -66], [37, 1, -57],],
				[[70, 1, -69], [114, 1, -69], [114, 1, -85], [103, 1, -85], [103, 1, -88], [119, 1, -88], [119, 1, -91], [108, 1, -91], [108, 1, -102], [101, 1, -102], [101, 1, -93], [97, 1, -93], [97, 1, -93], [97, 1, -81], [103, 1, -81], [103, 1, -75], [98, 1, -75], [98, 1, -70], [94, 1, -70], [94, 1, -76], [78, 1, -76], [78, 1, -75], [75, 1, -75], [75, 1, -81], [70, 1, -81]]
			]
			routes.forEach(r => {
				scene.addEntity(new RouteGhost(gl, r[0], scene, r))
			})
			
			const floor = new Floor(gl, [0, 0, -121], [121,121])
			scene.addObject(floor);

			Map.setScene(scene);
			await Map.loadFromImage("/assets/map.png", 1);

			const cc = new CrystalController(scene)
			cc.addCrystals()

			let last = performance.now();
			function loop(now) {
				const dt = Math.min((now - last) / 1000, 0.04);
				last = now;
				scene.process(dt);

				requestAnimationFrame(loop);
			}
			requestAnimationFrame(loop);

			window.addEventListener(GameEvents.GAME_OVER, onGameOver)
			variables.value.score = 0

			return () => {
				ro.disconnect();
			}
		}

		loadGame()
	}, [navigate])

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
