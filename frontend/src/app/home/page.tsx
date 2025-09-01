'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
    } else {
      setUserEmail(email)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-400 p-8 rounded-xl w-80 text-center shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-black">ホーム</h2>
        <p className="text-sm text-white">ようこそ {userEmail} さん</p>

        <button
          onClick={() => router.push('/game?start=true')}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          ゲームスタート
        </button>

        <button
          onClick={() => router.push('/mypage')}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          マイページ
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('userEmail')
            router.push('/')
          }}
          className="w-full bg-white text-black border py-2 rounded hover:bg-gray-100"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}