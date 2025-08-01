'use client'
import React from 'react'

const ObjectBox = ({
  id,
  name,
  type,
  onDestroy,
  index,
}: {
  id: number
  name: string
  type: 'glass' | 'wood'
  onDestroy: (id: number) => void
  index: number
}) => {
  const handleClick = () => {
    let soundPath = ''
    if (name === 'glass') {
      soundPath = '/glass_break.mp3'
    } else {
      soundPath = '/wood_break.mp3'
    }
    const sound = new Audio(soundPath)
    sound.play()
    onDestroy(id)
  }

  const cellWidth = 80
  const cellHeight = 80
  const margin = 10
  const cols = 10
  const x = (index % cols) * (cellWidth + margin)
  const y = Math.floor(index / cols) * (cellHeight + margin)

  return (
    <div
      onClick={handleClick}
      className={`absolute cursor-pointer transition-transform duration-200 hover:scale-110
        ${name === 'glass'
          ? 'bg-blue-200 bg-opacity-40 border-blue-400 rounded-full border-4'
          : 'bg-yellow-900 border-yellow-700 rounded-md border-4 shadow-lg'}
        w-20 h-20 flex items-center justify-center text-white font-bold`}
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
    </div>
  )
}

export default ObjectBox