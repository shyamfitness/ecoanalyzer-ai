import { useState } from 'react'
import { Scan, Search, Loader2 } from 'lucide-react'

const BarcodeScanner = ({ onAnalysis, isAnalyzing }) => {
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scanMode, setScanMode] = useState('manual') // 'manual' or 'camera'

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!barcodeInput.trim()) {
      alert('Please enter a barcode number')
      return
    }

    // Simulate API call to get product info from barcode
    const mockProductData = {
      name: `Product for barcode ${barcodeInput}`,
      description: 'Product information retrieved from barcode database',
      origin: 'China', // This would come from the API
      barcode: barcodeInput,
      brand: 'Sample Brand',
      category: 'Electronics'
    }

    await onAnalysis(mockProductData)
  }

  const handleCameraScan = () => {
    // In a real implementation, this would open camera and use a library like ZXing
    alert('Camera barcode scanning would be implemented here using a library like ZXing or QuaggaJS')
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setScanMode('manual')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
            scanMode === 'manual'
              ? 'border-eco-500 bg-eco-50 text-eco-700'
              : 'border-gray-300 hover:border-eco-300'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setScanMode('camera')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
            scanMode === 'camera'
              ? 'border-eco-500 bg-eco-50 text-eco-700'
              : 'border-gray-300 hover:border-eco-300'
          }`}
        >
          Camera Scan
        </button>
      </div>

      {scanMode === 'manual' ? (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Enter barcode number (e.g., 1234567890123)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              🔍 <strong>Barcode Lookup:</strong> We'll search our database and external APIs to find product information and calculate environmental impact.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isAnalyzing || !barcodeInput.trim()}
            className="w-full bg-eco-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-eco-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Looking up product...
              </>
            ) : (
              'Lookup & Analyze'
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-xl p-8 mb-6">
            <Scan className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Camera Barcode Scanner
            </h3>
            <p className="text-gray-500 mb-6">
              Point your camera at the product barcode to scan automatically
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800">
                🚧 <strong>Feature Coming Soon:</strong> Camera scanning will be implemented using ZXing or QuaggaJS library for real-time barcode detection.
              </p>
            </div>
            
            <button
              onClick={handleCameraScan}
              className="bg-eco-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-eco-700"
            >
              Start Camera Scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BarcodeScanner
