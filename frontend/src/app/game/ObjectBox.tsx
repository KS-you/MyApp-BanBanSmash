'use client'
import React from 'react'

const ObjectBox = ({
  id,
  name,
  onDestroy,
}: {
  id: number
  name: string
  type: 'glass' | 'wood'
  onDestroy: (id: number) => void
  // index: number
}) => {
  const handleClick = () => {
    const sound = new Audio(name === 'glass' ? '/glass_break.mp3' : '/wood_break.mp3')
    sound.play()
    onDestroy(id)
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-transform duration-200 hover:scale-110
        ${name === 'glass'
          ? 'bg-blue-200 bg-opacity-40 border-blue-400 rounded-full border-4'
          : 'bg-yellow-900 border-yellow-700 rounded-md border-4 shadow-lg'}
        w-20 h-20`}
    />
  )
}

export default ObjectBox