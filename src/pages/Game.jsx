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
				[[70, 1, -69], [114, 1, -69], [114, 1, -85], [103, 1, -85], [103, 1, -88], [119, 1, -88], [119, 1, -91], [108, 1, -91], [108, 1, -102], [101, 1, -102], [101, 1, -93], [97, 1, -93], [97, 1, -93], [97, 1, -81], [103, 1, -81], [103, 1, -75], [98, 1, -75], [98, 1, -70], [94, 1, -70], [94, 1, -76], [78, 1, -76], [78, 1, -75], [75, 1, -75], [75, 1, -81], [70, 1, -81]],
				[[27, 1, -97], [27, 1, -75], [4, 1, -75], [4, 1, -92], [21, 1, -92], [21, 1, -81], [10, 1, -81], [10, 1, -86], [14, 1, -86], [14, 1, -84], [17, 1, -84], [17, 1, -88], [8, 1, -88], [8, 1, -79], [23, 1, -79], [23, 1, -94], [2, 1, -94], [2, 1, -73], [26, 1, -73], [26, 1, -76], [27, 1, -76], [27, 1, -97], [23, 1, -97], [23, 1, -113], [5, 1, -113], [5, 1, -101], [17, 1, -101], [17, 1, -107], [11, 1, -107], [11, 1, -104], [8, 1, -104], [8, 1, -110], [20, 1, -110], [20, 1, -98], [2, 1, -98], [2, 1, -116], [27, 1, -116]],
				[[42, 1, -109], [42, 1, -105], [46, 1, -105], [46, 1, -102], [39, 1, -102], [39, 1, -112], [43, 1, -112], [43, 1, -115], [36, 1, -115], [36, 1, -97], [47, 1, -97], [47, 1, -94], [53, 1, -94], [53, 1, -92], [63, 1, -92], [63, 1, -104], [60, 1, -100], [57, 1, -100], [57, 1, -115], [50, 1, -115], [50, 1, -113], [54, 1, -113], [54, 1, -102], [47, 1, -102], [50, 1, -105], [50, 1, -109]],
				[[2, 1, -1], [2, 1, -27], [13, 1, -27], [13, 1, -39], [16, 1, -29], [16, 1, -25], [5, 1, -25], [5, 1, -22], [10, 1, -22], [10, 1, -19], [7, 1, -19], [7, 1, -16], [10, 1, -16], [10, 1, -13], [7, 1, -13], [7, 1, -9], [10, 1, -9], [10, 1, -5], [13, 1, -5], [13, 1, -21], [35, 1, -21], [35, 1, -17], [32, 1, -17], [32, 1, -19], [17, 1, -19], [17, 1, -5], [20, 1, -5], [20, 1, -15], [22, 1, -15], [22, 1, -2], [25, 1, -2], [25, 1, -15], [41, 1, -15], [41, 1, -2], [36, 1, -2], [36, 1, -8], [29, 1, -8], [29, 1, -1]],
				[[70, 1, -41], [70, 1, -45], [72, 1, -45], [72, 1, -53], [70, 1, -53], [70, 1, -60], [75, 1 ,-60], [75, 1, -63], [70, 1, -63], [70, 1, -67], [90, 1, -67], [90, 1, -64], [93, 1, -67], [115, 1, -67], [115, 1, -64], [118, 1, -64], [118, 1, -61], [113, 1, -61], [113, 1, -59], [105, 1, -59], [105, 1, -60], [103, 1, -60], [103, 1, -60], [103, 1, -56], [118, 1, -56], [118, 1, -53], [113, 1, -53], [113, 1, -47], [115, 1, -47], [115, 1, -49], [118, 1, -49], [118, 1, -44], [109, 1, -44], [109, 1, -42], [104, 1, -42], [104, 1, -46], [100, 1, -46], [100, 1, -45], [98, 1, -45], [98, 1, -47], [93, 1, -47], [93, 1, -50], [91, 1, -50], [91, 1, -55], [88, 1, -55], [88, 1, -48], [91, 1, -41], [91, 1, -44], [87, 1, -44], [87, 1, -44], [87, 1, -41], [82, 1, -41], [82, 1, -43], [70, 1, -43], [79, 1, -43], [79, 1, -41]],
				[[68, 1, -18], [68, 1, -20], [70, 1, -20], [70, 1, -23], [73, 1, -23], [73, 1, -29], [71, 1, -35], [79, 1, -35], [79, 1, -33], [77, 1, -33], [77, 1, -30], [82, 1, -30], [82, 1, -35], [91, 1, -35], [91, 1, -32], [86, 1, -32], [86, 1, -30], [91, 1, -30], [91, 1, -24], [89, 1, -24], [89, 1, -27], [86, 1, -27], [86, 1, -21], [91, 1, -21], [91, 1, -18], [83, 1, -18], [83, 1, -21], [77, 1, -21], [77, 1, -18]],
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
