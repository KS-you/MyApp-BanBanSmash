'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:8000/signup', { email, password })
      alert('登録成功！ログインしてください。')
      router.push('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert('登録失敗: ' + (err.response?.data?.detail || err.message))
      } else {
        alert('登録失敗（予期しないエラー）')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-200 p-8 rounded-xl w-80 space-y-4 text-center shadow-lg">
        <h2 className="text-xl font-bold text-black">サインアップ</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
        >
          登録する
        </button>

        <button
          onClick={() => router.push('/')}
          className="text-sm text-black underline hover:text-gray-700"
        >
          ログイン画面に戻る
        </button>
      </div>
    </div>
  )
}