'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import ObjectBox from './ObjectBox'
import { jwtDecode } from 'jwt-decode'

type GameObject = {
  id: number
  name: string
  type: 'glass' | 'wood'
}

type NullableGameObject = GameObject | null

type JwtPayload = {
  sub: string
  exp?: number
}

const GameScreen = () => {
  const [objects, setObjects] = useState<NullableGameObject[]>([])
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // JWT ID　obtain
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      console.error("アクセストークンがありません、ログインしてください")
      router.push("/")
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      setUserId(Number(decoded.sub))
    } catch (error) {
      console.error("トークンのデコードに失敗しました", error)
      router.push("/")
    }
  }, [router])

  // Object obtain
  useEffect(() => {
    if (!userId) return

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
        .catch(err => console.log("オブジェクト取得に失敗", err))
    }
  }, [searchParams, userId])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive) {
      interval = setInterval(() => setTime(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  // Click ObjectDestroy
  const handleDestroy = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("アクセストークンがありません、ログインしてください")
        router.push("/")
        return
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/destruction`,
        { object_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      setObjects(prev =>
        prev.map(obj => (obj && obj.id === id ? null : obj))
      )
      setCount(prev => prev + 1)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log("認証に失敗しました、ログインし直してください")
          router.push("/")
        } else {
          console.log("オブジェクトの破壊に失敗しました。", error)
        }
      } else {
        console.log("予期せぬエラー:", error)
      }
    }
  }

  // Object Replenishment
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
      .catch(err => console.log("オブジェクト補充に失敗", err))
    }
  }, [objects, timerActive])

  // GoResult
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
      <button onClick={handleEnd} className="absolute bottom-4 right-4 bg-white  text-red-500 px-4 py-2 rounded shadow-lg">
        終了
      </button>
    </div>
  )
}

export default GameScreen