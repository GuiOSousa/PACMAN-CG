import variables from "../events/signal"
import "./PlayerCoordinates.css"

const ScoreDisplay = () => {
    const score = variables.value.score
    
    return(
        <div className="coords">
        <p>Score: {score}</p>
        </div>
    )
}

export default ScoreDisplay