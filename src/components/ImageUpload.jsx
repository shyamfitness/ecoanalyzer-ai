import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Eye, Loader2 } from 'lucide-react'

const ImageUpload = ({ onAnalysis, isAnalyzing }) => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      
      // Create preview
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

    // Simulate OCR extraction (in real app, you'd use Tesseract.js or similar)
    const mockExtractedData = {
      name: 'Product extracted from image',
      description: 'Product details extracted using OCR technology',
      origin: 'Unknown',
      confidence: 0.85
    }

    await onAnalysis(mockExtractedData)
  }

  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-eco-500 bg-eco-50'
              : 'border-gray-300 hover:border-eco-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Drop image here' : 'Upload Product Image'}
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop an image, or click to select
          </p>
          <p className="text-sm text-gray-400">
            Supports JPEG, PNG, WebP (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-gray-50 rounded-xl p-6">
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Uploaded product"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-700">Image Preview</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>File:</strong> {uploadedImage.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Size:</strong> {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    📝 <strong>OCR Analysis:</strong> We'll extract text from your image to identify the product and analyze its environmental impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-eco-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-eco-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Extracting & Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>
        </div>
      )}
    </div>
  )
