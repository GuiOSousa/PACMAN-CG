import variables from "../events/signal"
import "./PlayerCoordinates.css"

const ScoreDisplay = () => {
    const score = variables.value.score
    const difficulty = variables.value.difficulty
    
    return(
        <div className="coords">
        <p>Pontuação: {score}</p>
        <p>Dificuldade: {difficulty}</p>
        </div>
    )
}

export default ScoreDisplay