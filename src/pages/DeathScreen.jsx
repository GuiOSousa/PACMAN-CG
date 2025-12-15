import variables from '../events/signal'
import './Menu.css'

export default function DeathScreen() {
    return(
    <div className='Menu'>
        <h1>GAME OVER</h1>
        <p>Score: {variables.value.score}</p>
        <a href="/" className='PlayButton'>Voltar ao Menu</a>
    </div>
    )
}