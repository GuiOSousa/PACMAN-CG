import variables from "../events/signal"
import "./PlayerCoordinates.css"

const PlayerCoordinatesDisplay = () => {
    const p = variables.value.playerPosition
    
    return(
        <div className="coords">
        <p>{p[0]}, {p[1]}</p>
        </div>
    )
}

export default PlayerCoordinatesDisplay