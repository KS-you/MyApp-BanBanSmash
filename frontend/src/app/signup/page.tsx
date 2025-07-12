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
      // ① サインアップAPI呼び出し
      await axios.post('http://localhost:8000/signup', { email, password })

      // ② 成功したら、そのままログインAPIを実行
      await axios.post('http://localhost:8000/login', { email, password })

      // ③ ローカルストレージに保存 & ホームへ遷移
      localStorage.setItem('userEmail', email)
      router.push('/home')

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert('エラー: ' + (err.response?.data?.detail || err.message))
      } else {
        alert('予期しないエラーが発生しました')
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
          className="w-full px-4 py-2 rounded bg-white text-black border"
        />

        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white text-black border"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
        >
          登録してログイン
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