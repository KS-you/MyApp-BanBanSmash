'use client'
import React from 'react'

const ObjectBox = ({
  id,
  name,
  onDestroy,
}: {
  id: number
  name: string
  onDestroy: (id: number) => void
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

  return (
    <div
      onClick={handleClick}
      className="absolute bg-gray-100 p-4 cursor-pointer hover:scale-110 transition"
      style={{
        top: `${100 + Math.random() * 400}px`,
        left: `${200 + Math.random() * 600}px`,
      }}
    >
      {name === 'glass' ? 'ガラス' : '木製の箱'}
    </div>
  )
}

export default ObjectBox