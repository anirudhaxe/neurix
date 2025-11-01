import Logo from '@/assets/crx.svg'
import { useState } from 'react'

function App() {
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  return (
    <div className="fixed right-0 bottom-0 m-5 z-[100] flex items-end font-sans select-none leading-none">
      {show && (
        <div className="bg-white text-gray-800 rounded-lg shadow-lg w-max h-min py-2 px-4 mr-2 transition-opacity duration-300 opacity-100">
          <h1>HELLO CRXJS</h1>
        </div>
      )}
      <button 
        className="flex justify-center w-10 h-10 rounded-full shadow-md cursor-pointer border-none bg-[#288cd7] hover:bg-[#1e6aa3]" 
        onClick={toggle}
      >
        <img src={Logo} alt="CRXJS logo" className="p-1" />
      </button>
    </div>
  )
}

export default App
