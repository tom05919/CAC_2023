import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import FileUpload from './FileUpload/FileUpload'

function App() {
  const [count, setCount] = useState(0)

  const [files, setFiles] = useState([{
    name: 'myFile.pdf'
  }])

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p classname="title">Upload file</p>
        <FileUpload files={files} setFiles={setFiles} />
      </div>
    </>
  )
}

export default App
