import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { userAPI } from '../services/api'
import { BarChart3, TrendingUp, Calendar, Award, ArrowRight } from 'lucide-react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = ({ setCurrentView }) => {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView('login')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await userAPI.getStats()
        if (response.success) {
          setStats(response.stats)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, setCurrentView])

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <Container className="py-12">
        <div className="space-y-6">
          <Skeleton variant="text" className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="card" className="h-32" />
            ))}
          </div>
        </div>
      </Container>
    )
  }

  const gradeData = stats?.gradeDistribution?.map(item => ({
    label: item._id,
    value: item.count
  })) || []

  const categoryData = stats?.categoryDistribution?.map(item => ({
    label: item._id,
    value: item.count
  })) || []

  return (
    <Container className="py-12 md:py-16">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 tracking-tight">Dashboard</h1>
        <p className="text-lg text-zinc-600">Your environmental impact analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card hover className="animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">Total Analyses</p>
              <p className="text-3xl font-bold text-zinc-900">{stats?.totalAnalyses || 0}</p>
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-zinc-900">
                {stats?.averageScore?.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <Award size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">Best Grade</p>
              <p className="text-3xl font-bold text-zinc-900">
                {gradeData[0]?.label || 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-zinc-900">
                {stats?.monthlyTrends?.[0]?.count || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {gradeData.length > 0 && (
          <Card className="animate-slide-up">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6">Grade Distribution</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: gradeData.map(d => d.label),
                  datasets: [{
                    data: gradeData.map(d => d.value),
                    backgroundColor: [
                      '#000000',
                      '#262626',
                      '#525252',
                      '#737373',
                      '#a3a3a3',
                    ],
                    borderWidth: 0,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        )}

        {categoryData.length > 0 && (
          <Card className="animate-slide-up">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6">Category Distribution</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: categoryData.map(d => d.label),
                  datasets: [{
                    label: 'Products',
                    data: categoryData.map(d => d.value),
                    backgroundColor: '#000000',
                    borderRadius: 12,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#e5e5e5',
                      },
                      ticks: {
                        color: '#737373',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: '#737373',
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        )}
      </div>

      <div className="mt-8 animate-slide-up">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setCurrentView('analyzer')}
          className="group"
        >
          Analyze New Product
          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Container>
  )
}

export default Dashboard