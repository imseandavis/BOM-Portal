'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LineChartProps {
  title: string
  data: {
    name: string
    data: number[]
  }[]
  categories: string[]
  height?: number
  width?: number | string
}

export function LineChart({ 
  title, 
  data, 
  categories, 
  height = 350,
  width = '100%'
}: LineChartProps) {
  const { theme } = useTheme()

  const options: ApexOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      background: 'transparent',
      foreColor: theme === 'dark' ? '#fff' : '#000'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    },
    grid: {
      borderColor: theme === 'dark' ? '#374151' : '#e0e0e0',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        rotateAlways: false,
        style: {
          colors: theme === 'dark' ? '#fff' : '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#64748b'
        }
      }
    },
    theme: {
      mode: theme as 'light' | 'dark'
    }
  }

  const series = data

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <Chart
        options={options}
        series={series}
        type="line"
        height={height}
        width={width}
      />
    </div>
  )
} 