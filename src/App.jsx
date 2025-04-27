import { useState } from 'react'
import { Book } from './components/Book'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <Canvas shadows camera={{ position:  [-0.5, 1, 4], fov: 45 }}>
        <OrbitControls />
        <Environment preset="studio"></Environment>

        <ambientLight intensity={1} />
        <Book/>
      </Canvas>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
