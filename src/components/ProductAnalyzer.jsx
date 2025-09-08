import { useState } from 'react'
import { Upload, Type, Camera, Scan, Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import BarcodeScanner from './BarcodeScanner'
import { calculateEnvironmentalImpact } from '../utils/environmentalCalculator'

const ProductAnalyzer = ({ onAnalysisComplete }) => {
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
      const result = await calculateEnvironmentalImpact({
        name: productName,
        description: productDescription,
        origin: origin || 'Unknown',
        inputMethod: 'text'
      })
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageAnalysis = async (extractedData) => {
    setIsAnalyzing(true)
    try {
      const result = await calculateEnvironmentalImpact({
        ...extractedData,
        inputMethod: 'image'
      })
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBarcodeAnalysis = async (barcodeData) => {
    setIsAnalyzing(true)
    try {
      const result = await calculateEnvironmentalImpact({
        ...barcodeData,
        inputMethod: 'barcode'
      })
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Input Method Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Analysis Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputMethods.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setInputMethod(id)}
                className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  inputMethod === id
                    ? 'border-eco-500 bg-eco-50 text-eco-700'
                    : 'border-gray-200 hover:border-eco-300 hover:bg-gray-50'
                }`}
              >
                <Icon size={24} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Method */}
        {inputMethod === 'text' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., iPhone 15, Nike Air Max, Samsung TV"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description (Optional)
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Additional details about the product, materials, features..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Origin (Optional)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., China, USA, Germany"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleTextAnalysis}
              disabled={isAnalyzing || !productName.trim()}
              className="w-full bg-eco-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-eco-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                'Analyze Environmental Impact'
              )}
            </button>
          </div>
        )}

        {/* Image Upload Method */}
        {inputMethod === 'image' && (
          <ImageUpload 
            onAnalysis={handleImageAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Barcode Scanner Method */}
        {inputMethod === 'barcode' && (
          <BarcodeScanner 
            onAnalysis={handleBarcodeAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}
      </div>
    </div>
  )
}

export default ProductAnalyzer
