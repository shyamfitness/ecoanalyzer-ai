import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import { ArrowRight, Sparkles, BarChart3, Camera, Scan, Zap, Shield, Globe } from 'lucide-react'

const Home = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-white" />
        <Container className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 mb-8 animate-fade-in">
              <Sparkles size={16} className="text-zinc-600" />
              <span className="text-sm font-medium text-zinc-700">AI-Powered Sustainability Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 mb-6 tracking-tight animate-slide-up">
              Make informed
              <br />
              <span className="text-zinc-500">environmental decisions</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Analyze products instantly with AI to understand their environmental impact. 
              Get detailed scores, breakdowns, and actionable recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button
                size="lg"
                variant="primary"
                onClick={() => setCurrentView('analyzer')}
                className="group"
              >
                Start Analyzing
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setCurrentView('about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                How it works
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                Three simple ways to analyze any product's environmental impact
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: 'Image Upload',
                  description: 'Upload product images and extract information using advanced OCR technology.',
                  color: 'bg-zinc-900',
                },
                {
                  icon: Scan,
                  title: 'Barcode Scan',
                  description: 'Scan barcodes to instantly retrieve product data and environmental metrics.',
                  color: 'bg-zinc-900',
                },
                {
                  icon: BarChart3,
                  title: 'AI Analysis',
                  description: 'Get comprehensive environmental impact scores powered by GPT-4 analysis.',
                  color: 'bg-zinc-900',
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  hover
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-stone-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                Why choose EcoAnalyzer
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Instant Results',
                  description: 'Get comprehensive analysis in seconds',
                },
                {
                  icon: Shield,
                  title: 'AI-Powered',
                  description: 'Advanced GPT-4 technology for accuracy',
                },
                {
                  icon: Globe,
                  title: 'Global Impact',
                  description: 'Consider origin-based shipping impacts',
                },
                {
                  icon: BarChart3,
                  title: 'Detailed Insights',
                  description: 'Complete breakdown across all factors',
                },
              ].map((benefit, index) => (
                <Card key={index} hover className="text-center">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <benefit.icon size={24} className="text-zinc-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-zinc-900 text-white border-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join thousands making sustainable choices with data-driven insights.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setCurrentView('analyzer')}
                className="bg-white text-zinc-900 hover:bg-zinc-100"
              >
                Analyze Your First Product
              </Button>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Home