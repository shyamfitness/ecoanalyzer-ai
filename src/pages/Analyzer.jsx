import { useState } from 'react'
import { Type, Camera, Scan, Loader2, Sparkles } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import BarcodeScanner from '../components/BarcodeScanner'
import { analysisAPI } from '../services/api'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

const Analyzer = ({ onAnalysisComplete, isAuthenticated, onLoginRequired }) => {
  const [inputMethod, setInputMethod] = useState('text')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [origin, setOrigin] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const inputMethods = [
    { id: 'text', label: 'Text Input', icon: Type },
    { id: 'image', label: 'Upload Image', icon: Camera },
    { id: 'barcode', label: 'Scan Barcode', icon: Scan },
  ]

  const handleTextAnalysis = async () => {
    if (!productName.trim()) {
      alert('Please enter a product name')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await analysisAPI.analyzeText({
        name: productName,
        description: productDescription,
        origin: origin || 'Unknown'
      })
      
      if (response.success) {
        onAnalysisComplete(response.analysis)
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      if (error.response?.status === 401) {
        onLoginRequired()
      } else {
        alert('Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageAnalysis = async (imageFile, extractedData) => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('name', extractedData.name)
      formData.append('description', extractedData.description)
      formData.append('origin', extractedData.origin)

      const response = await analysisAPI.analyzeImage(formData)
      
      if (response.success) {
        onAnalysisComplete(response.analysis)
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      if (error.response?.status === 401) {
        onLoginRequired()
      } else {
        alert('Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBarcodeAnalysis = async (barcodeData) => {
    setIsAnalyzing(true)
    try {
      const response = await analysisAPI.analyzeBarcode({
        barcode: barcodeData.barcode,
        name: barcodeData.name,
        description: barcodeData.description,
        origin: barcodeData.origin
      })
      
      if (response.success) {
        onAnalysisComplete(response.analysis)
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      if (error.response?.status === 401) {
        onLoginRequired()
      } else {
        alert('Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 mb-6">
            <Sparkles size={16} className="text-zinc-600" />
            <span className="text-sm font-medium text-zinc-700">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Analyze Product Impact
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto">
            Get comprehensive environmental impact scores and actionable recommendations
          </p>
        </div>

        {/* Method Selection */}
        <Card className="mb-8 animate-slide-up">
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Choose Input Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputMethods.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setInputMethod(id)}
                className={`
                  flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200
                  ${inputMethod === id
                    ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center transition-colors
                  ${inputMethod === id ? 'bg-zinc-900' : 'bg-zinc-100'}
                `}>
                  <Icon size={24} className={inputMethod === id ? 'text-white' : 'text-zinc-600'} />
                </div>
                <span className="font-medium text-zinc-900">{label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Input Forms */}
        {isAnalyzing ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-zinc-900 mb-4" size={40} />
              <p className="text-zinc-900 font-medium text-lg mb-2">Analyzing product...</p>
              <p className="text-sm text-zinc-500">This may take a few seconds</p>
            </div>
          </Card>
        ) : (
          <>
            {inputMethod === 'text' && (
              <Card className="animate-slide-up">
                <div className="space-y-6">
                  <Input
                    label="Product Name *"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., iPhone 15, Nike Air Max, Samsung TV"
                  />
                  
                  <Textarea
                    label="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Additional details about the product, materials, features..."
                    rows={8}
                  />
                  
                  <Input
                    label="Country of Origin (Optional)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g., China, USA, Germany"
                  />
                  
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleTextAnalysis}
                    disabled={!productName.trim()}
                    className="w-full"
                  >
                    Analyze Environmental Impact
                  </Button>
                </div>
              </Card>
            )}

            {inputMethod === 'image' && (
              <div className="animate-slide-up">
                <ImageUpload 
                  onAnalysis={handleImageAnalysis}
                  isAnalyzing={isAnalyzing}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={onLoginRequired}
                />
              </div>
            )}

            {inputMethod === 'barcode' && (
              <div className="animate-slide-up">
                <BarcodeScanner 
                  onAnalysis={handleBarcodeAnalysis}
                  isAnalyzing={isAnalyzing}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={onLoginRequired}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export default Analyzer