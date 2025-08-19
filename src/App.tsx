import { useState } from 'react'
import RaceTrack from './component/RaceTrack/RaceTrack'
import GroupRaceTrack from './component/RaceTrack/GroupRaceTrack'
import OpeningModal from './component/Modal/OpeningModal';
function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {/* <button onClick={() => setIsOpen(true)}>Mở</button> */}
      <GroupRaceTrack/>
      <OpeningModal isOpen={isOpen} onClose={()=>setIsOpen(false)}/>
    </div>
  )
}

export default App
