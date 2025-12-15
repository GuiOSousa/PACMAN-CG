import { Routes, Route } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import GameCanvas from './pages/Game';
import Menu from './pages/Menu';
import DeathScreen from './pages/DeathScreen';

export default function App() {
    useSignals()
    return (
    <Routes>
        <Route path="/" element={<Menu/>}/>
        <Route path="/game" element={<GameCanvas/>}/>
        <Route path="/gameOver" element={<DeathScreen/>}/>
    </Routes>
    )
}


