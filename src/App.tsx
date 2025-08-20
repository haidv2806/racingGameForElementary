import { useState, useEffect } from 'react'
import GroupRaceTrack from './component/RaceTrack/GroupRaceTrack'
import OpeningModal from './component/Modal/OpeningModal';

let bgMusic: HTMLAudioElement;

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [type, setType] = useState(1);

  useEffect(() => {
    if (!bgMusic) {
      bgMusic = new Audio("/theme.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.1;
    }

    const playMusic = () => {
      bgMusic.play().catch(err => console.log("Không thể phát nhạc:", err));
      document.removeEventListener("click", playMusic);
    };

    document.addEventListener("click", playMusic);
    return () => document.removeEventListener("click", playMusic);
  }, []);

  return (
    <div>
      <GroupRaceTrack type={type} onNextStage={() => setType((prev) => prev + 1)}/>
      <OpeningModal isOpen={isOpen} onClose={()=>setIsOpen(false)}/>
    </div>
  )
}

export default App
