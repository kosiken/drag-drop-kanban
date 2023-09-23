import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import KanbanSection from './KanbanSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-row">
      <KanbanSection title="Todo today" />
    </div>
  )
}

export default App
