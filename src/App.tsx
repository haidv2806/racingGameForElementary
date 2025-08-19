import { useState } from 'react'
import RaceTrack from './component/RaceTrack/RaceTrack'
import GroupRaceTrack from './component/RaceTrack/GroupRaceTrack'
import OpeningModal from './component/Modal/OpeningModal';
import QuestionModal from './component/Modal/QuestionModal';
function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [type, setType] = useState(1);
  return (
    <div>
      <GroupRaceTrack type={type} onNextStage={() => setType((prev) => prev + 1)}/>
      <OpeningModal isOpen={isOpen} onClose={()=>setIsOpen(false)}/>
    </div>
  )
}

export default App
