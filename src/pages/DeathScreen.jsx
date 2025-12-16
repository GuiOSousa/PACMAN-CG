import variables from '../events/signal'
import './DeathScreen.css'

export default function DeathScreen() {
    return(
    <div className='DeathScreen'>
        <h1>GAME OVER</h1>
        <h2 className='Score'>Pontuação: {variables.value.score}</h2>
        <a href="/" className='MenuButton'>Voltar ao Menu</a>
    </div>
    )
}