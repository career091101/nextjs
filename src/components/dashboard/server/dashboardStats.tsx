// frontend/components/dashboard/server/dashboardStats.tsx
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Users, FileText, Eye, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';

// 統計データの型定義
interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalUsers: number;
  postsGrowth: number;
  viewsGrowth: number;
  lastUpdated: Date;
}

// データ取得関数（実際のAPIコールに置き換える）
async function fetchDashboardStats(): Promise<DashboardStats> {
  // TODO: 実際のAPIエンドポイントからデータを取得する
  return {
    totalPosts: 150,
    totalViews: 25000,
    totalUsers: 1200,
    postsGrowth: 12.5,
    viewsGrowth: 8.3,
    lastUpdated: new Date(),
  };
}

// 成長率インジケーターコンポーネント
function GrowthIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      {Math.abs(value)}%
    </span>
  );
}

// 統計カードコンポーネント
function StatCard({
  title,
  value,
  growth,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  growth?: number;
  icon: any;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
        {growth !== undefined && <GrowthIndicator value={growth} />}
      </div>
    </Card>
  );
}

// メイン統計コンポーネント
export default async function DashboardStats() {
  const stats = await fetchDashboardStats();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div>Loading posts stats...</div>}>
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            growth={stats.postsGrowth}
            icon={FileText}
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading views stats...</div>}>
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            growth={stats.viewsGrowth}
            icon={Eye}
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading users stats...</div>}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
          />
        </Suspense>

        <Suspense fallback={<div>Loading update time...</div>}>
          <StatCard
            title="Last Updated"
            value={formatDistance(stats.lastUpdated, new Date(), { addSuffix: true })}
            icon={Clock}
          />
        </Suspense>
      </div>

      <div className="text-sm text-muted-foreground text-right">
        Last updated: {stats.lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}

// エラーバウンダリーコンポーネント
export function DashboardStatsError() {
  return (
    <div className="rounded-lg bg-destructive/10 p-6 text-center">
      <p className="text-destructive">Failed to load dashboard statistics</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-sm text-primary hover:underline"
      >
        Retry
      </button>
    </div>
  );
}