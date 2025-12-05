import { useEffect, useRef } from 'react'

export default function GeometricPatternBackground() {
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
      ctx.fillStyle = '#0a1929'
      ctx.fillRect(0, 0, width, height)

      // Draw geometric pattern
      const gridSize = 40
      const lineWidth = 0.5
      
      ctx.strokeStyle = 'rgba(77, 181, 207, 0.1)'
      ctx.lineWidth = lineWidth

      // Draw grid with subtle animation
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        
        // Add subtle glow effect
        if (Math.sin(time * 0.001 + x * 0.01) > 0.5) {
          ctx.strokeStyle = 'rgba(77, 181, 207, 0.2)'
        } else {
          ctx.strokeStyle = 'rgba(77, 181, 207, 0.05)'
        }
        
        ctx.stroke()
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        
        // Add subtle glow effect
        if (Math.sin(time * 0.001 + y * 0.01) > 0.5) {
          ctx.strokeStyle = 'rgba(77, 181, 207, 0.15)'
        } else {
          ctx.strokeStyle = 'rgba(77, 181, 207, 0.03)'
        }
        
        ctx.stroke()
      }

      // Draw diagonal lines for more complexity
      ctx.strokeStyle = 'rgba(77, 181, 207, 0.03)'
      ctx.lineWidth = lineWidth * 0.5

      for (let i = -height; i < width; i += gridSize * 2) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + height, height)
        ctx.stroke()
      }

      for (let i = 0; i < width + height; i += gridSize * 2) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i - height, height)
        ctx.stroke()
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