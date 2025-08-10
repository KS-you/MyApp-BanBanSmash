'use client'
import { useSearchParams, useRouter } from 'next/navigation'

const ResultPage = () => {
  const searchParams = useSearchParams()
  const count = searchParams.get('count') || '0'
  const time = searchParams.get('time') || '0'


// ランクは暫定、今後修正
const rank = (() => {
  const c = Number(count)
  if (c >= 100) return 'S'
  if (c >= 50) return 'A'
  if (c >= 30) return 'B'
  if (c >= 15) return 'C'
  else return 'ランク外'
})()

  const router = useRouter()

  const handleEnd = () => {
    router.push('/home')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl mb-8">リザルト</h1>

      <div className="space-y-6 w-80">
        {/* オブジェクト破壊数 */}
        <div className="flex items-center justify-between">
          <span className="text-yellow-300">オブジェクト破壊数</span>
          <div className="bg-gray-300 text-black px-4 py-2 rounded">
            {count}
          </div>
        </div>

        {/* プレイ時間 */}
        <div className="flex items-center justify-between">
          <span>プレイ時間</span>
          <div className="bg-gray-300 text-black px-4 py-2 rounded">
            {Math.floor(Number(time) / 60).toString().padStart(2, '0')}:
            {(Number(time) % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* ランク */}
      <div className="flex item-center justify-between">
        <span className="text-green-500">ランク</span>
        <div className="bg-gray-300 text-black px-4 py-2 rounded">
          {rank}
        </div>
      </div>
    </div>

    <button
      onClick={handleEnd}
      className="mt-10 px-8 py-3 bg-gray-300 text-black rounded"
      >
        ホーム画面へ
      </button>
  </div>
  )
}

export default ResultPage