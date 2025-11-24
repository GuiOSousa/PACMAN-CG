import { useSignals } from '@preact/signals-react/runtime';
import GameCanvas from './pages/Game';


export default function App() {
  useSignals()
  return <GameCanvas />;
}


