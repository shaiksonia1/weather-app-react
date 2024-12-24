import Weather from './Weather'
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gap-5 flex-col bg-blue-950">
      <Weather />
      <Weather />
    </div>
  )
}

export default App
