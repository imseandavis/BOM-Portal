'use client'

import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface AnalyticsChartProps {
  data: number[]
  categories: string[]
  height?: number
}

export function AnalyticsChart({ data, categories, height = 250 }: AnalyticsChartProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const options = {
    chart: {
      type: 'line' as const,
      toolbar: {
        show: false
      },
      background: 'transparent',
      foreColor: theme.palette.text.primary
    },
    colors: [theme.palette.primary.main],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 4,
      colors: [theme.palette.primary.main],
      strokeColors: theme.palette.primary.main,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    theme: {
      mode: isDark ? 'dark' : 'light'
    }
  }

  const series = [
    {
      name: 'Value',
      data
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-4">
      <Chart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  )
} 