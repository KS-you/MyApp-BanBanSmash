'use client'
import React from 'react'

const ObjectBox = ({ id, name, onDestroy }: { id: number, name: string, onDestroy: (id: number) => void}) => {
  const handleClick = () => {
    const sound = new Audio(name === 'glass' ? '/glass_break.mp3' : '/wood_break.mp3')
    sound.play()
    onDestroy(id)
  }

  return (
    <div
    onClick={handleClick}
    className="absolute bg-gray-100 p-4 cursor-pointer hover:scale-110 transition"
    style={{ top: `${Math.random() * 300}px`, left: `${Math.random() * 300}px` }}
    >
      {name === 'glass' ? 'ガラス' : '木製の箱'}
    </div>
  )
}

export default ObjectBox