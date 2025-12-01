import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Search, Eye, Trash2, Calendar, Filter } from 'lucide-react'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { analysisAPI } from '../services/api'
import { cn } from '../components/utils/cn'

const History = ({ history, onViewResult, onDeleteItem, isAuthenticated, onLoginRequired, setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [filterGrade, setFilterGrade] = useState('all')
  const [loading, setLoading] = useState(false)
  const [backendHistory, setBackendHistory] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      loadBackendHistory()
    }
  }, [isAuthenticated])

  const loadBackendHistory = async () => {
    setLoading(true)
    try {
      const response = await analysisAPI.getHistory({ page: 1, limit: 50 })
      if (response.success) {
        setBackendHistory(response.items || [])
      } else {
        console.error('Failed to load history:', response.error)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
      // If it's a 401, the auth context will handle it
      if (error.response?.status === 401) {
        // User will be logged out by the interceptor
        return
      }
    } finally {
      setLoading(false)
    }
  }

  const getGradeLabel = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'Excellent'
      case 'B':
        return 'Good'
      case 'C':
        return 'Fair'
      case 'D':
      case 'E':
        return 'Poor'
      default:
        return grade || 'Unknown'
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const allHistory = isAuthenticated && backendHistory.length > 0 ? backendHistory : history

  const filteredHistory = allHistory
    .filter(item => {
      const matchesSearch = item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGrade = filterGrade === 'all' || getGradeLabel(item.grade) === filterGrade
      return matchesSearch && matchesGrade
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.environmentalScore || 0) - (a.environmentalScore || 0)
        case 'name':
          return (a.product?.name || '').localeCompare(b.product?.name || '')
        case 'date':
        default:
          return new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0)
      }
    })

  const averageScore = allHistory.length > 0 
    ? (allHistory.reduce((sum, item) => sum + (item.environmentalScore || 0), 0) / allHistory.length / 10).toFixed(1)
    : 0

  if (!isAuthenticated) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={Calendar}
          title="Sign In Required"
          description="Sign in to save and track your analysis history."
          action={
            <Button variant="primary" onClick={onLoginRequired}>
              Sign In
            </Button>
          }
        />
      </Container>
    )
  }

  if (loading) {
    return (
      <Container className="py-12">
        <div className="space-y-6">
          <Skeleton variant="text" className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="card" className="h-24" />
            ))}
          </div>
        </div>
      </Container>
    )
  }

  if (allHistory.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={Calendar}
          title="No Analysis History"
          description="You haven't analyzed any products yet. Start by analyzing a product to see your history here."
          action={
            <Button variant="primary" onClick={() => setCurrentView('analyzer')}>
              Start Analyzing Products
            </Button>
          }
        />
      </Container>
    )
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 tracking-tight">Analysis History</h1>
          <p className="text-lg text-zinc-600">View and manage your past analyses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card hover className="animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-900">{allHistory.length}</div>
                <div className="text-sm text-zinc-600">Total Analyses</div>
              </div>
            </div>
          </Card>
          
          <Card hover className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-900">{averageScore}</div>
                <div className="text-sm text-zinc-600">Avg Score</div>
              </div>
            </div>
          </Card>
          
          <Card hover className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div>
              <div className="text-sm text-zinc-600 mb-1">Best Grade</div>
              <div className="text-lg font-semibold text-zinc-900">
                {getGradeLabel(allHistory[0]?.grade) || 'None'}
              </div>
            </div>
          </Card>
          
          <Card hover className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div>
              <div className="text-sm text-zinc-600 mb-1">Latest</div>
              <div className="text-sm font-medium text-zinc-900">
                {formatDate(allHistory[0]?.timestamp || allHistory[0]?.createdAt)}
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 text-zinc-400" size={20} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-zinc-400" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white text-zinc-900"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white text-zinc-900"
            >
              <option value="all">All Grades</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.map((item, index) => {
            const rawScore = item.environmentalScore || 0
            const displayScore = (rawScore / 10).toFixed(1)
            
            return (
              <Card
                key={item.id || item._id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-zinc-900 truncate">
                        {item.product?.name || 'Unknown Product'}
                      </h3>
                    </div>
                    
                    <p className="text-zinc-600 mb-4 line-clamp-2">
                      {item.product?.description || 'No description'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                      <span>📍 {item.product?.origin || 'Unknown'}</span>
                      <span>🏷️ {item.product?.category || 'General'}</span>
                      <span>📅 {formatDate(item.timestamp || item.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl">
                        <span className="text-lg font-bold text-white">{displayScore}</span>
                        <span className="text-xs text-zinc-300">/10</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1.5">
                        {getGradeLabel(item.grade)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewResult(item)}
                        title="View Details"
                        className="p-2"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this analysis?')) {
                            onDeleteItem?.(item.id || item._id)
                            if (isAuthenticated) {
                              analysisAPI.deleteAnalysis(item.id || item._id).catch(console.error)
                            }
                          }
                        }}
                        title="Delete"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredHistory.length === 0 && allHistory.length > 0 && (
          <Card>
            <EmptyState
              icon={Search}
              title="No Results Found"
              description="Try adjusting your search terms or filters."
            />
          </Card>
        )}
      </div>
    </Container>
  )
}

export default History