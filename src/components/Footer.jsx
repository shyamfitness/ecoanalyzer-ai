import Container from './ui/Container'

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-lg font-semibold text-zinc-900">EcoAnalyzer</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              AI-powered environmental impact analysis for sustainable decisions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-zinc-900 mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-zinc-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-zinc-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 text-center text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} EcoAnalyzer AI. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer