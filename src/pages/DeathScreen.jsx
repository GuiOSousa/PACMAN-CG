import variables from '../events/signal'
import './DeathScreen.css'

export default function DeathScreen() {
    return(
    <div className='DeathScreen'>
        <h1>GAME OVER</h1>
        <h2>Score: {variables.value.score}</h2>
        <a href="/" className='PlayButton'>Voltar ao Menu</a>
    </div>
    )
}