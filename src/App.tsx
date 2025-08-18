import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import RaceTrack from './component/RaceTrack'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      <RaceTrack />
      <RaceTrack />
      <RaceTrack />
      <RaceTrack />
    </div>
  )
}

export default App
