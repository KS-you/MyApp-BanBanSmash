'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ObjectBox from './ObjectBox'

type GameObject = {
  id: number
  name: string
}

const GameScreen = () => {
  const [objects, setObjects] = useState<GameObject[]>([])
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const router = useRouter()
  const userId = 1 // 仮ユーザーの指定


  useEffect(() => {
    axios.get<GameObject[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/objects`)
      .then(res => setObjects(res.data))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive) {
      interval = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  const handleDestroy = (id: number) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/destruction`, { user_id: userId, objet_id: id })
    setObjects(prev => prev.filter(obj => obj.id ! == id))
    setCount(prev => prev + 1)
  }

  useEffect(() => {
    if(objects.length === 0){
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/objects`)
        .then(res => setObjects(res.data))
    }
  }, [objects])

  const handleEnd = () => {
    setTimerActive(false)
    router.push('/home')
  }

  return (
    <div className="relative bg-black p-4 border">
      <div className = "flex justify-between text-white mb-4">
        <div className="text-yellow-300">COUNT: {count}</div>
        <div>TIME: {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}</div>
    </div>
    <div className="relative h-96 bg-gray-800">
      {objects.map(obj => (
          <ObjectBox key={obj.id} id={obj.id} name={obj.name} onDestroy={handleDestroy} />
      ))}
    </div>
    <button onClick={handleEnd} className="mt-4 bg-white text-red-500 px-4 py-2 rounded">
      終了
    </button>
  </div>
  )
}

export default GameScreen