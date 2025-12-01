import { useEffect, useRef, useState } from 'react'
import { Scan, Loader2 } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import { cn } from './utils/cn'

const BarcodeScanner = ({ onAnalysis, isAnalyzing, isAuthenticated, onLoginRequired }) => {
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scanMode, setScanMode] = useState('manual')
  const videoRef = useRef(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!barcodeInput.trim()) {
      alert('Please enter a barcode number')
      return
    }

    if (!isAuthenticated) {
      onLoginRequired()
      return
    }

    const mockProductData = {
      name: `Product for barcode ${barcodeInput}`,
      description: 'Product information retrieved from barcode database',
      origin: 'China',
      barcode: barcodeInput,
      brand: 'Sample Brand',
      category: 'Electronics'
    }

    await onAnalysis(mockProductData)
  }

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCameraScan = async () => {
    if (isCameraActive) return
    try {
      setIsCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      try {
        const Quagga = (await import('@ericblade/quagga2')).default
        await Quagga.init({
          inputStream : {
            type : 'LiveStream',
            target: videoRef.current,
            constraints: { facingMode: 'environment' }
          },
          decoder : {
            readers : ['ean_reader','ean_8_reader','code_128_reader','upc_reader','upc_e_reader']
          }
        })
        Quagga.start()
        Quagga.onDetected(async (data) => {
          const code = data?.codeResult?.code
          if (code) {
            Quagga.stop()
            if (videoRef.current && videoRef.current.srcObject) {
              videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            }
            setIsCameraActive(false)
            const mockProductData = {
              name: `Product for barcode ${code}`,
              description: 'Product information retrieved from barcode database',
              origin: 'China',
              barcode: code,
              brand: 'Sample Brand',
              category: 'Electronics'
            }
            await onAnalysis(mockProductData)
          }
        })
      } catch (err) {
        console.warn('Quagga2 not available, manual entry only', err)
        alert('Live camera scanning is unavailable on this device. Please use manual entry.')
      }
    } catch (e) {
      console.error('Camera access failed', e)
      alert('Unable to access camera. Please allow permissions or use manual entry.')
      setIsCameraActive(false)
    }
  }

  return (
    <Card>
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setScanMode('manual')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200',
            scanMode === 'manual'
              ? 'border-zinc-900 bg-zinc-50 shadow-sm'
              : 'border-zinc-200 hover:border-zinc-400'
          )}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setScanMode('camera')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200',
            scanMode === 'camera'
              ? 'border-zinc-900 bg-zinc-50 shadow-sm'
              : 'border-zinc-200 hover:border-zinc-400'
          )}
        >
          Camera Scan
        </button>
      </div>

      {scanMode === 'manual' ? (
        <form onSubmit={handleManualSubmit} className="space-y-6">
          <Input
            label="Barcode Number"
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Enter barcode number (e.g., 1234567890123)"
          />
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-700">
              🔍 <strong>Barcode Lookup:</strong> We'll search our database and external APIs to find product information and calculate environmental impact.
            </p>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isAnalyzing || !barcodeInput.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Looking up product...
              </>
            ) : (
              'Lookup & Analyze'
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="bg-zinc-50 rounded-2xl p-12 mb-6 border border-zinc-200">
            <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scan size={40} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Camera Barcode Scanner
            </h3>
            <p className="text-zinc-600 mb-8">
              Point your camera at the product barcode to scan automatically
            </p>
            
            {isCameraActive && (
              <div className="flex justify-center mb-6">
                <video 
                  ref={videoRef} 
                  className="w-full max-w-md rounded-xl border-2 border-zinc-200 shadow-sm" 
                  muted 
                  playsInline 
                />
              </div>
            )}
            
            <Button
              variant="primary"
              size="lg"
              onClick={handleCameraScan}
              disabled={isCameraActive}
              className="w-full"
            >
              {isCameraActive ? 'Scanning...' : 'Start Camera Scan'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default BarcodeScanner