import { ArrowLeft, Download, Share, TrendingUp, AlertTriangle } from 'lucide-react'
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
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Result = ({ result, onBackToAnalyzer }) => {
  if (!result) return null

  const rawScore = typeof result.environmentalScore === 'number' ? result.environmentalScore : 0
  const displayScore = Number((rawScore / 10).toFixed(1))

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

  const breakdown = result.breakdown || {}
  const breakdownSections = ['materials', 'shipping', 'packaging', 'endOfLife']

  const doughnutData = {
    labels: ['Materials', 'Shipping', 'Packaging', 'End of Life'],
    datasets: [{
      data: [
        breakdown.materials?.score ?? 0,
        breakdown.shipping?.score ?? 0,
        breakdown.packaging?.score ?? 0,
        breakdown.endOfLife?.score ?? 0,
      ],
      backgroundColor: ['#000000', '#262626', '#525252', '#737373'],
      borderWidth: 0,
    }],
  }

  const barData = {
    labels: ['Materials', 'Shipping', 'Packaging', 'End of Life'],
    datasets: [{
      label: 'Impact Score',
      data: [
        breakdown.materials?.score ?? 0,
        breakdown.shipping?.score ?? 0,
        breakdown.packaging?.score ?? 0,
        breakdown.endOfLife?.score ?? 0,
      ],
      backgroundColor: '#000000',
      borderRadius: 12,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  }

  const handleExport = () => {
    const exportData = {
      product: result.product?.name,
      score: result.environmentalScore,
      grade: result.grade,
      timestamp: result.timestamp || result.createdAt,
      breakdown: result.breakdown,
      recommendations: result.recommendations
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `eco-analysis-${result.product?.name?.replace(/\s+/g, '-') || 'product'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareText = `Eco Analysis for ${result.product?.name}:\nScore: ${displayScore}/10 (${getGradeLabel(result.grade)})\nOrigin: ${result.product?.origin}\nCategory: ${result.product?.category}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Eco Analysis - ${result.product?.name}`,
          text: shareText
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        alert('Summary copied to clipboard!')
      }
    } catch (e) {
      console.error('Share failed', e)
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Summary copied to clipboard!')
      } catch (err) {
        alert('Unable to share or copy. Please try manually.')
      }
    }
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={onBackToAnalyzer}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Analyzer
          </Button>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="primary" onClick={handleShare}>
              <Share size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Results Card */}
        <Card className="animate-slide-up">
          <div className="border-b border-zinc-200 pb-8 mb-8">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">
                  {result.product?.name || 'Product Analysis'}
                </h1>
                <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                  {result.product?.description || 'No description available'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                  <span>📍 {result.product?.origin || 'Unknown'}</span>
                  <span>🏷️ {result.product?.category || 'General'}</span>
                  <span>📱 {result.source || 'text'}</span>
                </div>
              </div>
              
              <div className="text-center flex-shrink-0">
                <div className="inline-flex flex-col items-center gap-2 px-8 py-6 bg-zinc-900 rounded-2xl shadow-lg">
                  <span className="text-5xl font-bold text-white">{displayScore}</span>
                  <span className="text-sm text-zinc-300">/ 10</span>
                </div>
                <div className="mt-4 text-base font-medium text-zinc-700">
                  {getGradeLabel(result.grade)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Impact Breakdown */}
          <div>
            <h3 className="text-2xl font-semibold text-zinc-900 mb-8">Environmental Impact Breakdown</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="text-lg font-medium text-zinc-700 mb-6">Impact Distribution</h4>
                <div className="h-80">
                  <Doughnut data={doughnutData} options={chartOptions} />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-zinc-700 mb-6">Impact Comparison</h4>
                <div className="h-80">
                  <Bar
                    data={barData}
                    options={{
                      ...chartOptions,
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
              </div>
            </div>
            
            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {breakdownSections.map((key) => {
                const section = breakdown[key]
                if (!section) return null
                return (
                  <div key={key} className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-zinc-900 capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <TrendingUp size={16} className="text-zinc-400" />
                    </div>
                    <div className="text-3xl font-bold text-zinc-900 mb-1">{section.score || 0}</div>
                    <div className="text-xs text-zinc-500">
                      {section.weight ? `${(section.weight * 100).toFixed(0)}% weight` : 'N/A'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900">Sustainability Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-zinc-700 leading-relaxed flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Additional Insights */}
        {result.metrics && (
          <Card className="animate-slide-up">
            <h3 className="text-2xl font-semibold text-zinc-900 mb-6">Additional Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-3xl mb-3">🌍</div>
                <div className="font-semibold text-zinc-900 mb-1">Carbon Footprint</div>
                <div className="text-sm text-zinc-600">
                  {result.metrics.carbon?.value || 'N/A'} {result.metrics.carbon?.unit || 'kg CO₂e'}
                </div>
              </div>
              
              <div className="text-center p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-3xl mb-3">💧</div>
                <div className="font-semibold text-zinc-900 mb-1">Water Usage</div>
                <div className="text-sm text-zinc-600">
                  {result.metrics.water?.value || 'N/A'} {result.metrics.water?.unit || 'L'}
                </div>
              </div>
              
              <div className="text-center p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-3xl mb-3">🗑️</div>
                <div className="font-semibold text-zinc-900 mb-1">Waste Generated</div>
                <div className="text-sm text-zinc-600">
                  {result.metrics.waste?.value || 'N/A'} {result.metrics.waste?.unit || 'kg'}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  )
}

export default Result