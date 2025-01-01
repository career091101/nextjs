import { Suspense } from 'react'
import DashboardStats from '@/components/dashboard/server/dashboardStats'
import DashboardChart from '@/components/dashboard/client/dashboardChart'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  Settings,
  Activity,
  ExternalLink
} from 'lucide-react'

// ローディングフォールバックコンポーネント
const StatsLoading = () => (
  <div className="h-[200px] w-full animate-pulse bg-gray-200 rounded-lg" />
)

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      {/* クイックアクションセクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            新規投稿を作成
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText size={16} />
            下書き一覧
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            設定
          </Button>
        </div>
      </section>

      {/* 統計情報セクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">統計情報</h2>
        <Suspense fallback={<StatsLoading />}>
          <DashboardStats />
        </Suspense>
      </section>

      {/* アクティビティチャートセクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">アクティビティ分析</h2>
        <Card className="p-6">
          <DashboardChart />
        </Card>
      </section>

      {/* 最近のアクティビティログ */}
      <section>
        <h2 className="text-xl font-semibold mb-4">最近のアクティビティ</h2>
        <Card>
          <div className="p-4">
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <Activity size={16} />
                  <span>{activity.message}</span>
                  <span className="text-gray-400">{activity.time}</span>
                  {activity.link && (
                    <a
                      href={activity.link}
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      詳細 <ExternalLink size={12} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  )
}

// モックアクティビティデータ
const recentActivities = [
  {
    message: '新しい記事「Next.js 14の新機能」が公開されました',
    time: '5分前',
    link: '/posts/nextjs-14-features'
  },
  {
    message: 'プロフィール情報が更新されました',
    time: '1時間前'
  },
  {
    message: 'コメント返信が3件追加されました',
    time: '2時間前',
    link: '/posts/comments'
  },
  {
    message: 'バックアップが正常に完了しました',
    time: '3時間前'
  }
]