import { ArrowLeft, Download, Share, Leaf, TrendingUp, AlertTriangle } from 'lucide-react'
import { Doughnut, Bar } from 'react-chartjs-2'
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ResultDisplay = ({ result, onBackToAnalyzer }) => {
  if (!result) return null

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

  // Chart data for impact breakdown
  const doughnutData = {
    labels: ['Manufacturing', 'Shipping', 'Packaging', 'End of Life'],
    datasets: [
      {
        data: [
          result.breakdown.manufacturing.score,
          result.breakdown.shipping.score,
          result.breakdown.packaging.score,
          result.breakdown.endOfLife.score,
        ],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: ['Manufacturing', 'Shipping', 'Packaging', 'End of Life'],
    datasets: [
      {
        label: 'Impact Score',
        data: [
          result.breakdown.manufacturing.score,
          result.breakdown.shipping.score,
          result.breakdown.packaging.score,
          result.breakdown.endOfLife.score,
        ],
        backgroundColor: ['#ef444420', '#f9731620', '#eab30820', '#22c55e20'],
        borderColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  const handleExport = () => {
    // Simulate export functionality
    const exportData = {
      product: result.product.name,
      score: result.environmentalScore,
      grade: result.grade,
      timestamp: result.timestamp,
      breakdown: result.breakdown,
      recommendations: result.recommendations
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `eco-analysis-${result.product.name.replace(/\\s+/g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToAnalyzer}
          className="flex items-center gap-2 text-eco-600 hover:text-eco-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Analyzer
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={16} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-eco-600 text-white rounded-lg hover:bg-eco-700">
            <Share size={16} />
            Share Results
          </button>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-eco-500 to-eco-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{result.product.name}</h1>
              <p className="text-eco-100 mb-4">{result.product.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span>📍 Origin: {result.product.origin}</span>
                <span>🏷️ Category: {result.product.category}</span>
                <span>📱 Method: {result.product.inputMethod}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(result.environmentalScore)} text-gray-800`}>
                <Leaf size={20} />
                {result.environmentalScore}/10
              </div>
              <div className="mt-2 text-eco-100">
                {getGradeIcon(result.grade)} {result.grade}
              </div>
            </div>
          </div>
        </div>
        
        {/* Impact Breakdown */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Environmental Impact Breakdown</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Doughnut Chart */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Impact Distribution</h4>
              <div className="h-64">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            </div>
            
            {/* Bar Chart */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Impact Comparison</h4>
              <div className="h-64">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
          
          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <TrendingUp size={16} className="text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{value.score}</div>
                <div className="text-sm text-gray-500">{value.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="text-eco-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Sustainability Recommendations</h3>
        </div>
        
        <div className="grid gap-3">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-eco-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-eco-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🌍</div>
            <div className="font-semibold text-gray-800">Carbon Footprint</div>
            <div className="text-sm text-gray-600 mt-1">{result.totalImpact} kg CO₂e</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">♻️</div>
            <div className="font-semibold text-gray-800">Recyclability</div>
            <div className="text-sm text-gray-600 mt-1">Analysis based on materials</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🏭</div>
            <div className="font-semibold text-gray-800">Manufacturing</div>
            <div className="text-sm text-gray-600 mt-1">Primary impact source</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultDisplay
