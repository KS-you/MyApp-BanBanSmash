'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import ObjectBox from './ObjectBox'

type GameObject = {
  id: number
  name: string
  type: 'glass' | 'wood'
}

type NullableGameObject = GameObject | null

const GameScreen = () => {
  const [objects, setObjects] = useState<NullableGameObject[]>([])
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = 1 // 仮ユーザーの指定

  useEffect(() => {
    const shouldStart = searchParams.get('start') === 'true'
    if (shouldStart) {
      axios.get<GameObject[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/objects`)
        .then(res => {
          const data: GameObject[] = res.data
          const filtered = data.filter(obj => {
            const t = obj.type.toLowerCase()
            return t === 'glass' || t === 'wood'
          })
          if (filtered.length === 0) console.warn('表示対象オブジェクトが見つかりません')
          const shuffled = filtered.sort(() => 0.5 - Math.random())
          // 初期はすべて配置（空白なし）
          setObjects(shuffled.slice(0, 30))
          setTimerActive(true)
        })
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive) {
      interval = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  const handleDestroy = (id: number) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/destruction`, {
      user_id: userId,
      object_id: id,
    })
    setObjects(prev =>
      prev.map(obj => (obj && obj.id === id ? null : obj))
    )
    setCount(prev => prev + 1)
  }

  useEffect(() => {
    if (timerActive && objects.every(obj => obj === null)) {
      axios.get<GameObject[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/objects`)
      .then(res => {
        const data: GameObject[] = res.data
        const filtered = data.filter(obj => {
          const t = obj.type.toLowerCase()
          return t === 'glass' || t === 'wood'
        })
        if (filtered.length === 0) console.warn('補充対象オブジェクトが見つかりません')
        const shuffled = filtered.sort(() => 0.5 - Math.random())
        setObjects(shuffled.slice(0, 30))
      })
    }
  }, [objects, timerActive])

  const handleEnd = () => {
    setTimerActive(false)
    router.push(`/result?count=${count}&time=${time}`)
  }

  return (
    <div className="relative bg-black p-4 border">
      <div className = "flex justify-between text-white mb-4">
        <div className="text-yellow-300">COUNT: {count}</div>
        <div>TIME: {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}</div>
      </div>
      <div className="relative h-[600px] bg-gray-800 flex justify-center items-center">
        <div className="grid grid-cols-10 gap-3 justify-center"
          style={{ placeItems: 'center', height: '100%' }}
        >
          {objects.map((obj, i) => {
            if (obj) {
              return (
                <ObjectBox
                  key={obj.id}
                  id={obj.id}
                  name={obj.name}
                  type={obj.type}
                  // index={obj.index}
                  onDestroy={handleDestroy}
                />
              )
            } else {
              return (
                <div key={`empty-${i}`} className="w-full h-full" />
              )
            }
          })}
        </div>
      </div>
      <button onClick={handleEnd} className="mt-4 bg-white text-red-500 px-4 py-2 rounded">
        終了
      </button>
    </div>
  )
}

export default GameScreen