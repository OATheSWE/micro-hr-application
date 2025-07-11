import React from 'react'
import { cn } from '@/lib/utils'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface ChartProps {
  data: ChartData[]
  title?: string
  className?: string
}

const Chart: React.FC<ChartProps> = ({ data, title, className }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          const color = item.color || 'bg-blue-500'
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={cn("w-3 h-3 rounded-full mr-3", color)}></div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full transition-all duration-300", color)}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Chart } 