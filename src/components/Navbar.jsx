import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from './ui/Button'
import { Search, History, BarChart3, User, LogOut, Menu, X, Home, Settings } from 'lucide-react'
import { cn } from './utils/cn'

const Navbar = ({ currentView, setCurrentView }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyzer', label: 'Analyze', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  const handleNavClick = (id) => {
    setCurrentView(id)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm' 
        : 'bg-white/60 backdrop-blur-md border-b border-zinc-200/30'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-semibold text-zinc-900 tracking-tight">EcoAnalyzer</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  currentView === id
                    ? 'text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {currentView === id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('settings')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                    'transition-all duration-200',
                    currentView === 'settings'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                  )}
                >
                  <User size={16} />
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout()
                    setCurrentView('home')
                  }}
                  className="p-2"
                >
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentView('login')}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
                    'transition-all duration-200',
                    currentView === id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-zinc-200">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        handleNavClick('settings')
                        setMobileMenuOpen(false)
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
                        'transition-all duration-200',
                        currentView === 'settings'
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                      )}
                    >
                      <Settings size={18} />
                      Settings
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        logout()
                        setCurrentView('home')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setCurrentView('login')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar