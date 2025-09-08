import { useState } from 'react'
import { Search, Filter, Calendar, Leaf, Eye, Trash2 } from 'lucide-react'

const HistoryView = ({ history, onViewResult }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date', 'score', 'name'
  const [filterGrade, setFilterGrade] = useState('all') // 'all', 'Excellent', 'Good', 'Fair', 'Poor'

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-red-600 bg-red-100'
    if (score >= 5) return 'text-yellow-600 bg-yellow-100'
    if (score >= 3) return 'text-blue-600 bg-blue-100'
    return 'text-green-600 bg-green-100'
  }

  const getGradeIcon = (grade) => {
    switch (grade) {
      case 'Excellent': return '🌟'
      case 'Good': return '✅'
      case 'Fair': return '⚠️'
      case 'Poor': return '❌'
      default: return '📊'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter and sort history
  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGrade = filterGrade === 'all' || item.grade === filterGrade
      return matchesSearch && matchesGrade
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.environmentalScore - a.environmentalScore
        case 'name':
          return a.product.name.localeCompare(b.product.name)
        case 'date':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp)
      }
    })

  const averageScore = history.length > 0 
    ? (history.reduce((sum, item) => sum + item.environmentalScore, 0) / history.length).toFixed(1)
    : 0

  const gradeDistribution = history.reduce((acc, item) => {
    acc[item.grade] = (acc[item.grade] || 0) + 1
    return acc
  }, {})

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Analysis History</h3>
          <p className="text-gray-600 mb-6">
            You haven't analyzed any products yet. Start by analyzing a product to see your history here.
          </p>
          <button
            onClick={() => window.location.reload()} // Simple way to go back to analyzer
            className="bg-eco-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-eco-700"
          >
            Start Analyzing Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{history.length}</div>
              <div className="text-sm text-gray-600">Total Analyses</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-eco-100 rounded-lg">
              <Leaf className="text-eco-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{averageScore}</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-1">Best Grade</div>
          <div className="text-lg font-semibold text-gray-800">
            {Object.keys(gradeDistribution).sort().find(grade => gradeDistribution[grade] > 0) || 'None'}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-1">Latest Analysis</div>
          <div className="text-sm font-medium text-gray-800">
            {history.length > 0 ? formatDate(history[0].timestamp) : 'Never'}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            />
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
          
          {/* Grade Filter */}
          <div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              <option value="all">All Grades</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{item.product.name}</h3>
                  <span className="text-sm text-gray-500">
                    {item.product.inputMethod === 'text' && '📝'}
                    {item.product.inputMethod === 'image' && '📸'}
                    {item.product.inputMethod === 'barcode' && '📦'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📍 {item.product.origin}</span>
                  <span>🏷️ {item.product.category}</span>
                  <span>📅 {formatDate(item.timestamp)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 ml-4">
                {/* Score Badge */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-bold ${getScoreColor(item.environmentalScore)}`}>
                    <Leaf size={16} />
                    {item.environmentalScore}/10
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getGradeIcon(item.grade)} {item.grade}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewResult(item)}
                    className="p-2 text-eco-600 hover:bg-eco-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this analysis?')) {
                        // In a real app, this would remove the item from the list
                        alert('Delete functionality would be implemented here')
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

export default HistoryView
