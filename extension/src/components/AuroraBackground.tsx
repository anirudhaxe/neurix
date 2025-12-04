import { useEffect, useRef } from 'react'

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      const width = parent?.clientWidth || 400
      const height = parent?.clientHeight || 600
      
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0

    const animate = () => {
      const { width, height } = canvas
      
      // Clear canvas
      ctx.fillStyle = '#0C1232'
      ctx.fillRect(0, 0, width, height)

      // Create aurora waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        
        const hue = 200 + i * 20
        const opacity = 0.03 + Math.sin(time * 0.001 + i) * 0.02
        
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0)`)
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 50%, ${opacity})`)
        gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`)

        ctx.fillStyle = gradient
        
        // Draw flowing wave
        ctx.moveTo(0, height)
        
        for (let x = 0; x <= width; x += 5) {
          const y = height * 0.3 + 
                   Math.sin((x * 0.01) + (time * 0.001) + (i * 2)) * 50 +
                   Math.sin((x * 0.02) + (time * 0.002) + (i * 3)) * 30
          
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()
      }

      time += 16
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}