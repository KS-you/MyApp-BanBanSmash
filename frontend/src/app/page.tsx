'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:8000/login', { email, password })
      localStorage.setItem('userEmail', email)
      router.push('/home')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert('ログイン失敗: ' + (err.response?.data?.detail || err.message))
      } else {
        alert('ログイン失敗（予期しないエラー）')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-200 p-8 rounded-xl w-80 space-y-4 text-center shadow-lg">
        {/* アプリタイトル */}
        <div className="space-y-1 mb-4">
          <div className="text-yellow-400 text-xl font-bold">Bang</div>
          <div className="text-yellow-400 text-xl font-bold">Bang</div>
          <div className="text-red-600 text-xl font-bold">Smash</div>
        </div>

        <h2 className="text-lg font-semibold text-black">ログイン</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>

        <button
          onClick={() => router.push('/signup')}
          className="text-sm text-black underline hover:text-gray-700"
        >
          サインアップはこちら
        </button>
      </div>
    </div>
  )
}