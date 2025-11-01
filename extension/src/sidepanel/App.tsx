import crxLogo from '@/assets/crx.svg'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import HelloWorld from '@/components/HelloWorld'

export default function App() {
  return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img 
          src={viteLogo} 
          className="h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" 
          alt="Vite logo" 
        />
      </a>
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        <img 
          src={reactLogo} 
          className="h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] motion-safe:logo-spin" 
          alt="React logo" 
        />
      </a>
      <a href="https://crxjs.dev/vite-plugin" target="_blank" rel="noreferrer">
        <img 
          src={crxLogo} 
          className="h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#f2bae4aa]" 
          alt="crx logo" 
        />
      </a>
      <HelloWorld msg="Vite + React + CRXJS" />
    </div>
  )
}
