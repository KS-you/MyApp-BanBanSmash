'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const MyPage = () => {
	const router = useRouter()

	// 入力フォームステート
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')

	const userId = 4

	// userUpdate
	const handleUpdate = async () => {
			try {
					setLoading(true)
					setMessage('')

					type UpdateUserData = {
						email?: string;
						password?: string;
					};

					const updateData: UpdateUserData = {};
					if (email) updateData.email = email;
					if (password) updateData.password = password;

					if (Object.keys(updateData).length === 0) {
						setMessage('変更する項目を入力してください');
						return;
					}

					await axios.put(
						`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
						updateData
					)
					console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`)
					setMessage('更新しました！')
			} catch (error) {
				console.log(error)
				setMessage('更新に失敗しました')
			} finally {
				setLoading(false)
			}
	}

	// userDelete
	const handleDelete = async () => {
		if (!confirm('本当に退会しますか？')) return
		try {
			setLoading(true)
			setMessage('')
			await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`)
			alert('退会が完了しました、ホームに戻ります。')
			router.push('/')
		} catch (error) {
			console.log(error)
			setMessage('退会に失敗しました。')
		}finally {
			setLoading(false)
		}
	}

	// returnHome
	const handleGoHome = () => {
		router.push('/home')
	}
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
			<div className="bg-gray-300 p-8 rounded shadow-md w-96">
				<h1 className="text-2xl font-bold text-green-600 text-center md-8">マイページ</h1>

			{/* メールアドレス */}
			<div className="mb-4">
				<label className="block md-2 text-black">メールアドレス</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full px-3 py-2 border rounded bg-gray-100 text-black"
					placeholder="example@email.com"
				/>
			</div>
				{/* パスワード */}
				<div className="md-6">
					<label className="block mb-2 text-black">パスワード</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-ful px-3 py-2 border rounded bg-gray-100 text-black"
						placeholder="新しいパスワード"
					/>
				</div>

				{/* 更新ボタン */}
				<button
					onClick={handleUpdate}
					disabled={loading}
					className="w-ful bg-green-600 text-white py-2 rounded mb-4 hover:bg-green-700"
				>
					{loading ? '更新中...' : '更新'}
				</button>

				{/* 退会ボタン */}
				<button
					onClick={handleDelete}
					disabled={loading}
					className="w-ful bg-red-600 text-white py-2 rounded mb-4 hover:bg-red-700"
				>
					{loading ? '処理中...' : '退会'}
				</button>

				{/* ホーム画面遷移ボタン */}
				<button
					onClick={handleGoHome}
					className="w-ful bg-white text-black border py-2 rounded hover:bg-gray-200"
				>
					ホーム画面へ
				</button>

				{/* メッセージ表示 */}
				{message && <p className="text-center mt-4 text-black">{message}</p>}
			</div>
		</div>
	)
}

export default MyPage