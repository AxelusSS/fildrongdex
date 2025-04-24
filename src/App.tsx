import { useState } from "react";
import TrainerForm from "./components/TrainerForm";
import GameScreen from "./components/GameScreen";
import { Trainer } from "./types/trainer";

function App() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200">
      {!gameStarted ? (
        <TrainerForm
          trainers={trainers}
          setTrainers={setTrainers}
          onStart={() => setGameStarted(true)}
        />
      ) : (
        <GameScreen trainers={trainers} />
      )}
    </div>
  );
}

export default App;
