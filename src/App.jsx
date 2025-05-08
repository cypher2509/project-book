import { useState } from 'react'
import { Book } from './components/Book'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { atom, useAtom } from "jotai";
import { pages } from './components/pages.jsx'

import './App.css'
export const pageAtom = atom(0);

function App() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useAtom(pageAtom);

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <Canvas shadows camera={{ position:  [-0.5, 1, 4], fov: 45 }}>
        <OrbitControls />
        <Environment preset="apartment"></Environment>

        <ambientLight intensity={0.5} />
        <Book/>
      </Canvas>
      <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
          </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
