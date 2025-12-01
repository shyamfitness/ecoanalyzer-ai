import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'

// Pages
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import About from './pages/About'
import Settings from './pages/Settings'
import Result from './pages/Result'

function AppContent() {
  const { user, isAuthenticated } = useAuth()
  const [currentView, setCurrentView] = useState('home')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Load persisted history on first render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ecoanalyzer_history')
      if (savedHistory) {
        setAnalysisHistory(JSON.parse(savedHistory))
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e)
    }
  }, [])

  // Persist history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ecoanalyzer_history', JSON.stringify(analysisHistory))
    } catch (e) {
      console.error('Failed to save history to localStorage', e)
    }
  }, [analysisHistory])

  const handleAnalysisComplete = (result) => {
    const normalized = {
      ...result,
      timestamp: result.timestamp || result.createdAt || new Date().toISOString(),
    }
    setAnalysisResult(normalized)
    setAnalysisHistory(prev => [normalized, ...prev])
    setCurrentView('result')
  }

  const handleDeleteFromHistory = (id) => {
    setAnalysisHistory(prev => prev.filter(item => (item.id || item._id) !== id))
  }

  const handleViewResult = (result) => {
    setAnalysisResult(result)
    setCurrentView('result')
  }

  // Handle login view
  useEffect(() => {
    if (currentView === 'login') {
      setShowLoginModal(true)
    }
  }, [currentView])

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
        {currentView === 'home' && <Home setCurrentView={setCurrentView} />}
        {currentView === 'analyzer' && (
          <Analyzer
            onAnalysisComplete={handleAnalysisComplete}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => setShowLoginModal(true)}
          />
        )}
        {currentView === 'result' && analysisResult && (
          <Result
            result={analysisResult}
            onBackToAnalyzer={() => setCurrentView('analyzer')}
          />
        )}
        {currentView === 'dashboard' && (
          <Dashboard setCurrentView={setCurrentView} />
        )}
        {currentView === 'history' && (
          <History
            history={analysisHistory}
            onViewResult={handleViewResult}
            onDeleteItem={handleDeleteFromHistory}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => {
              setShowLoginModal(true)
              setCurrentView('login')
            }}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'about' && <About />}
        {currentView === 'settings' && <Settings />}
      </main>

      <Footer />

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          if (currentView === 'login') {
            setCurrentView('home')
          }
        }}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App