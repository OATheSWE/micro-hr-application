'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { employeesApi } from '@/lib/api/employees'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Chart } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalEmployees: number
  totalDepartments: number
  averageSalary: number
  recentHires: number
}

interface DepartmentStat {
  department: string
  count: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    recentHires: 0
  })
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get all employees to calculate accurate stats
        const employeesResponse = await employeesApi.getEmployees()
        const departmentResponse = await employeesApi.getDepartmentStats()

        const employees = employeesResponse.employees
        const totalEmployees = employeesResponse.total
        
        // Calculate unique departments
        const uniqueDepartments = new Set(employees.map(emp => emp.department))
        const totalDepartments = uniqueDepartments.size
        
        // Calculate average salary
        const averageSalary = employees.length > 0 
          ? Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length)
          : 0
        
        // Calculate recent hires (last 30 days)
        const recentHires = employees.filter(emp => {
          const hireDate = new Date(emp.created_at)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return hireDate > thirtyDaysAgo
        }).length

        setStats({
          totalEmployees,
          totalDepartments,
          averageSalary,
          recentHires
        })
        setDepartmentStats(departmentResponse)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-employee':
        router.push('/admin/employees?action=add')
        break
      case 'view-employees':
        router.push('/admin/employees')
        break
      case 'generate-report':
        // TODO: Implement report generation
        console.log('Generate report clicked')
        break
      case 'schedule-meeting':
        // TODO: Implement meeting scheduling
        console.log('Schedule meeting clicked')
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.recentHires}`,
      changeType: 'positive',
      description: 'recent hires'
    },
    {
      name: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'bg-green-500',
      change: `${stats.totalDepartments}`,
      changeType: 'positive',
      description: 'active departments'
    },
    {
      name: 'Average Salary',
      value: `$${stats.averageSalary.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive',
      description: 'from last month'
    },
  ]

  const chartData = departmentStats.map(dept => ({
    label: dept.department,
    value: dept.count,
    color: 'bg-blue-500'
  }))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your HR system</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.3 + index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{card.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">{card.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          <Chart 
            data={chartData}
            title="Department Distribution"
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New employee hired</p>
                    <p className="text-xs text-gray-500">John Doe joined Engineering team</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Salary updated</p>
                    <p className="text-xs text-gray-500">Jane Smith's salary increased</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Department created</p>
                    <p className="text-xs text-gray-500">New Marketing department added</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { action: 'add-employee', icon: UserPlus, text: 'Add Employee' },
                { action: 'view-employees', icon: Users, text: 'View All Employees' },
                { action: 'generate-report', icon: BarChart3, text: 'Generate Report' },
                { action: 'schedule-meeting', icon: Calendar, text: 'Schedule Meeting' }
              ].map((item, index) => (
                <motion.div
                  key={item.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.9 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center h-12 w-full"
                    onClick={() => handleQuickAction(item.action)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 