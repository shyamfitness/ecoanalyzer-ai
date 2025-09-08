import { useState } from 'react'
import Header from './components/Header'
import ProductAnalyzer from './components/ProductAnalyzer'
import ResultDisplay from './components/ResultDisplay'
import HistoryView from './components/HistoryView'
import { Leaf } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('analyzer')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
    setAnalysisHistory(prev => [result, ...prev])
    setCurrentView('result')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="text-eco-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-800">
              AI Environmental Impact Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze products to compute Environmental Impact Scores and make sustainable purchasing decisions
          </p>
        </div>

        {currentView === 'analyzer' && (
          <ProductAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        )}
        
        {currentView === 'result' && analysisResult && (
          <ResultDisplay result={analysisResult} onBackToAnalyzer={() => setCurrentView('analyzer')} />
        )}
        
        {currentView === 'history' && (
          <HistoryView 
            history={analysisHistory} 
            onViewResult={(result) => {
              setAnalysisResult(result)
              setCurrentView('result')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
