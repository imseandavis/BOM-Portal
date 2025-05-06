'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface PieChartProps {
  title: string
  series: number[]
  labels: string[]
  height?: number
}

export function PieChart({ 
  title, 
  series, 
  labels, 
  height = 350 
}: PieChartProps) {
  const { theme } = useTheme()

  const options = {
    chart: {
      type: 'pie' as const,
      background: 'transparent'
    },
    labels,
    theme: {
      mode: theme as 'light' | 'dark'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      show: false
    },
    legend: {
      labels: {
        colors: theme === 'dark' ? '#fff' : '#000'
      }
    },
    tooltip: {
      theme: theme as 'light' | 'dark'
    },
    colors: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#6366F1'
    ]
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <Chart
        options={options}
        series={series}
        type="pie"
        height={height}
      />
    </div>
  )
} 