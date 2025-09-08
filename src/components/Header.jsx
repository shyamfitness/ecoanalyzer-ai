import { Leaf, Search, History, BarChart3 } from 'lucide-react'

const Header = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'analyzer', label: 'Analyze Product', icon: Search },
    { id: 'history', label: 'History', icon: History },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-eco-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="text-eco-600" size={32} />
            <span className="text-xl font-semibold text-gray-800">EcoAnalyzer AI</span>
          </div>
          
          <nav className="flex items-center gap-6">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${ 
                  currentView === id
                    ? 'bg-eco-100 text-eco-700 border border-eco-200'
                    : 'text-gray-600 hover:text-eco-600 hover:bg-eco-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
