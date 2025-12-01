import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import { Sparkles, Shield, Zap, Globe, Target, Users } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
              About EcoAnalyzer
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Empowering sustainable decisions through AI-powered environmental impact analysis.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-12 animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Our Mission</h2>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  EcoAnalyzer AI is designed to help consumers and businesses make informed 
                  environmental decisions by providing comprehensive, AI-powered analysis of 
                  product environmental impact.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  We believe that transparency and data-driven insights are essential for building 
                  a more sustainable future. Our platform combines advanced AI technology with 
                  rigorous environmental science to deliver accurate, actionable recommendations.
                </p>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Analysis',
                description: 'Leveraging GPT-4 to extract and analyze product environmental signals with precision.',
              },
              {
                icon: Shield,
                title: 'Data-Driven Insights',
                description: 'Comprehensive scoring across manufacturing, shipping, packaging, and end-of-life.',
              },
              {
                icon: Zap,
                title: 'Instant Results',
                description: 'Get detailed environmental impact assessments in seconds, not days.',
              },
              {
                icon: Globe,
                title: 'Global Perspective',
                description: 'Consider origin-based shipping impacts and international sustainability standards.',
              },
            ].map((feature, index) => (
              <Card key={index} hover className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card className="mb-12 animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-zinc-900 mb-6">How It Works</h2>
                <div className="space-y-6">
                  {[
                    {
                      step: '1',
                      title: 'Input Product Information',
                      description: 'Enter product details via text, upload an image, or scan a barcode.',
                    },
                    {
                      step: '2',
                      title: 'AI Analysis',
                      description: 'Our AI extracts environmental signals and calculates impact across multiple dimensions.',
                    },
                    {
                      step: '3',
                      title: 'Get Results',
                      description: 'Receive detailed scores, breakdowns, and personalized recommendations.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-zinc-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default About