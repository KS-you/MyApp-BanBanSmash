'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
  setErrorMessage('')

  if (!email || !password) {
    setErrorMessage('メールアドレスとパスワードを入力してください。')
    return
  }
  try {
    await axios.post('http://localhost:8000/signup', { email, password })
    await axios.post('http://localhost:8000/login', { email, password })
    localStorage.setItem('userEmail', email)
    router.push('/home')
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail

      if (typeof detail === 'string') {
        if (detail === 'メールアドレスの形式が正しくありません。') {
          setErrorMessage('メールアドレスの形式が間違っています。')
        } else if (detail === 'このメールアドレスはすでに登録されています。') {
          setErrorMessage('そのメールアドレスはすでに登録されています。')
        } else if (detail === 'パスワードは6文字以上で入力してください。') {
          setErrorMessage('パスワードは6文字以上で入力してください。')
        } else {
          setErrorMessage('登録中にエラーが発生しました。')
        }
      } else if (Array.isArray(detail)) {
        const first = detail[0]
        if (first?.loc?.includes('email')) {
          setErrorMessage('メールアドレスの形式が間違っています。')
        } else if (first?.loc?.includes('password') && first?.type === 'string_too_short') {
          setErrorMessage('パスワードは6文字以上で入力してください。')
        } else {
          setErrorMessage('登録中にエラーが発生しました。')
        }
      } else {
        setErrorMessage('登録中にエラーが発生しました。')
      }
    } else {
      setErrorMessage('予期しないエラーが発生しました。')
    }
  }
}

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-400 p-8 rounded-xl w-80 space-y-4 text-center shadow-lg">
        <h2 className="text-xl font-bold text-black">サインアップ</h2>

        {errorMessage && <p className='text-red-600 text-sm'>{errorMessage}</p>}

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