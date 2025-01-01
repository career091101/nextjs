'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// チャートデータの型定義
interface ChartData {
  date: string;
  views: number;
  visitors: number;
  engagement: number;
}

interface DashboardChartProps {
  initialData?: ChartData[];
  onFilterChange?: (filter: string) => void;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  initialData = [],
  onFilterChange
}) => {
  // 状態管理
  const [data, setData] = useState<ChartData[]>(initialData);
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [metrics, setMetrics] = useState<string[]>(['views', 'visitors']);

  // フィルター用の期間オプション
  const timeRangeOptions = [
    { value: '7d', label: '過去7日間' },
    { value: '30d', label: '過去30日間' },
    { value: '90d', label: '過去90日間' }
  ];

  // メトリクスのトグル
  const toggleMetric = (metric: string) => {
    setMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // データのフェッチ（実際の実装ではAPIコールを行う）
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: 実際のAPIエンドポイントに置き換える
        // const response = await fetch(`/api/dashboard/stats?range=${timeRange}`);
        // const newData = await response.json();
        // setData(newData);
        
        // モックデータ
        const mockData = Array.from({ length: 7 }, (_, i) => ({
          date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MM/dd'),
          views: Math.floor(Math.random() * 1000),
          visitors: Math.floor(Math.random() * 500),
          engagement: Math.random() * 100
        })).reverse();
        
        setData(mockData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">サイトパフォーマンス</h3>
        <div className="flex gap-4">
          <Select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              onFilterChange?.(e.target.value);
            }}
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            {['views', 'visitors', 'engagement'].map(metric => (
              <Button
                key={metric}
                variant={metrics.includes(metric) ? 'default' : 'outline'}
                onClick={() => toggleMetric(metric)}
                size="sm"
              >
                {metric}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              padding={{ left: 30, right: 30 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {metrics.includes('views') && (
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            )}
            {metrics.includes('visitors') && (
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            )}
            {metrics.includes('engagement') && (
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardChart;