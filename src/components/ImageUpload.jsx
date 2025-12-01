import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Eye, Loader2 } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import { cn } from './utils/cn'

const ImageUpload = ({ onAnalysis, isAnalyzing, isAuthenticated, onLoginRequired }) => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const removeImage = () => {
    setUploadedImage(null)
    setPreview(null)
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return

    if (!isAuthenticated) {
      onLoginRequired()
      return
    }

    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const { data } = await worker.recognize(uploadedImage)
      await worker.terminate()

      const extractedText = data?.text || ''
      const firstLine = extractedText.split('\n').map(t => t.trim()).find(Boolean) || 'Product from image'

      const ocrData = {
        name: firstLine.slice(0, 60),
        description: extractedText.slice(0, 500),
        origin: 'Unknown',
        confidence: data?.confidence ? data.confidence / 100 : 0.8
      }

      await onAnalysis(uploadedImage, ocrData)
    } catch (err) {
      console.warn('OCR failed or Tesseract not available, using fallback', err)
      const fallbackData = {
        name: 'Product extracted from image',
        description: 'OCR unavailable; using fallback metadata for analysis',
        origin: 'Unknown',
        confidence: 0.5
      }
      await onAnalysis(uploadedImage, fallbackData)
    }
  }

  return (
    <Card>
      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer',
            'transition-all duration-300',
            isDragActive
              ? 'border-zinc-900 bg-zinc-50 scale-[1.02]'
              : 'border-zinc-300 hover:border-zinc-600 hover:bg-zinc-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Upload size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">
            {isDragActive ? 'Drop image here' : 'Upload Product Image'}
          </h3>
          <p className="text-zinc-600 mb-2">
            Drag and drop an image, or click to select
          </p>
          <p className="text-sm text-zinc-500">
            Supports JPEG, PNG, WebP (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
            <button
              onClick={removeImage}
              className="absolute top-4 right-4 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Uploaded product"
                  className="w-40 h-40 object-cover rounded-xl border-2 border-zinc-200 shadow-sm"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={18} className="text-zinc-600" />
                  <span className="font-medium text-zinc-900">Image Preview</span>
                </div>
                <p className="text-sm text-zinc-600 mb-2">
                  <strong>File:</strong> {uploadedImage.name}
                </p>
                <p className="text-sm text-zinc-600 mb-4">
                  <strong>Size:</strong> {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                <div className="bg-white border border-zinc-200 rounded-xl p-4">
                  <p className="text-sm text-zinc-700">
                    📝 <strong>OCR Analysis:</strong> We'll extract text from your image to identify the product and analyze its environmental impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Extracting & Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ImageUpload