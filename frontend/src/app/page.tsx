'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
  setErrorMessage('')

  if (!email || !password) {
    setErrorMessage('メールアドレスとパスワードを入力してください。')
    return
  }

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password })
    localStorage.setItem('userEmail', email)
    router.push('/home')
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail
      // エラー表示
      console.log('エラーレスポンス detail:', detail)

      if (typeof detail === 'string' && detail === 'メールアドレスまたはパスワードが間違っています。') {
        setErrorMessage('メールアドレスまたはパスワードが違います。')
      } else {
        setErrorMessage('ログイン中にエラーが発生しました。')
      }
    } else {
      setErrorMessage('予期しないエラーが発生しました。')
    }
  }
}

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-400 p-8 rounded-xl w-80 space-y-4 text-center shadow-lg">
        {/* アプリタイトル */}
        <div className="relative p-6 w-60 mx-auto rounded-lg pb-16">
          <div className="absolute top-2 left-6 text-yellow-300 text-xl font-bold">Bang</div>
          <div className="absolute top-9 right-28 text-yellow-300 text-xl font-bold">Bang</div>
          <div className="absolute top-16 right-10 text-red-600 text-xl font-bold">Smash</div>
          <Image src="/explosion_effect.png" alt="Explosion" width={50} height={50} className="absolute top-20 left-2" />
          <Image src="/explosion_effect.png" alt="Explosion" width={50} height={50} className="absolute top-0 right-0" />
        </div>

        <h2 className="text-lg font-semibold text-black mt-12">ログイン</h2>

        {errorMessage && <p className='text-red-600 text-sm'>{errorMessage}</p>}

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