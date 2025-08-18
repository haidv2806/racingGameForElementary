import { useState } from 'react'
import RaceTrack from './component/RaceTrack'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      <RaceTrack trackID={1}/>
      <RaceTrack trackID={2}/>
      <RaceTrack trackID={3}/>
      <RaceTrack trackID={4}/>
    </div>
  )
}

export default App
