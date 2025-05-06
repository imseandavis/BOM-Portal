'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface BarChartProps {
  title: string
  data: {
    name: string
    data: number[]
  }[]
  categories: string[]
  height?: number
  stacked?: boolean
}

export function BarChart({ title, data, categories, height = 350, stacked = false }: BarChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: stacked,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2
      },
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    theme: {
      mode: 'light'
    }
  }

  const series = data

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={height}
      />
    </div>
  )
} 