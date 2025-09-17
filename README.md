# 🌱 AI Environmental Impact Analyzer

An **AI-powered full-stack tool** that analyzes product descriptions, images, or barcodes to **compute Environmental Impact Scores (EIS)**.  
Built with **React.js, Vite, Tailwind CSS, and Chart.js**, the platform provides **eco-friendly insights**, generates **visual reports**, and helps consumers make **sustainable purchasing decisions**.

![EcoAnalyzer AI](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-green?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-blue?logo=tailwindcss)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-orange?logo=chartdotjs)

---

## 🚀 Live Demo

**[View Live Application](https://your-demo-link.vercel.app)** *(Coming Soon)*

---

## 📌 Features

✅ **AI-Powered Analysis** – Sophisticated algorithms analyze product information to calculate environmental impact scores  
✅ **Multiple Input Methods** –  
   - 📝 **Text Input** – Enter product name and description  
   - 📸 **Image Upload** – Drag & drop product images with OCR text extraction  
   - 📦 **Barcode Scanner** – Manual barcode entry with product database lookup  
✅ **Smart Categorization** – Automatically categorizes products (Electronics, Clothing, Food, etc.)  
✅ **Origin-Based Impact** – Calculates carbon footprint based on manufacturing country and shipping distance  
✅ **Detailed Breakdown** – Shows impact across Manufacturing, Shipping, Packaging, and End-of-Life  
✅ **Interactive Charts** – Beautiful Doughnut and Bar charts powered by Chart.js  
✅ **Historical Tracking** – View and manage past analyses with search and filtering  
✅ **Smart Recommendations** – Personalized sustainability suggestions  
✅ **Export Reports** – Download analysis results as JSON  
✅ **Responsive Design** – Optimized for desktop and mobile devices  

---

## 🛠️ Tech Stack

| **Category**       | **Technologies Used**              |
|---------------------|-----------------------------------|
| **Frontend**        | React.js 18.3, Vite, JavaScript ES6+ |
| **Styling**        | Tailwind CSS 3.x, Custom Green Theme |
| **Charts**         | Chart.js 4.x, React-ChartJS-2    |
| **Icons**          | Lucide React                      |
| **File Upload**    | React-Dropzone                    |
| **HTTP Client**    | Axios                             |
| **Build Tool**     | Vite                              |
| **Package Manager** | npm                               |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/shyamfitness/ecoanalyzer-ai.git
cd ecoanalyzer-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🎯 Usage

### 1. **Analyze a Product**
   - Choose your input method (Text, Image, or Barcode)
   - Enter product details or upload files
   - Click "Analyze Environmental Impact"
   - Wait for AI processing (2-3 seconds)

### 2. **View Results**
   - See your Environmental Impact Score (0-10 scale)
   - Explore detailed breakdown charts
   - Read personalized recommendations
   - Export or share your results

### 3. **Track History**
   - Navigate to "History" tab
   - Search and filter past analyses
   - Compare different products
   - Track your sustainability progress

---

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Navigation header
│   ├── ProductAnalyzer.jsx  # Main analysis interface
│   ├── ImageUpload.jsx # Drag & drop image upload
│   ├── BarcodeScanner.jsx   # Barcode input component
│   ├── ResultDisplay.jsx    # Analysis results with charts
│   └── HistoryView.jsx # Historical analyses view
├── utils/              # Utility functions
│   └── environmentalCalculator.js  # Core impact calculation logic
├── hooks/              # Custom React hooks
├── services/           # API services
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Tailwind CSS imports
```

---

## 🔬 How It Works

### Environmental Impact Calculation

1. **Product Categorization**: AI analyzes product names/descriptions to categorize items
2. **Material Analysis**: Identifies materials and their environmental impact factors
3. **Manufacturing Impact**: Calculates emissions based on product category and materials
4. **Shipping Impact**: Estimates carbon footprint based on country of origin and distance
5. **Packaging & End-of-Life**: Considers packaging materials and disposal methods
6. **Scoring Algorithm**: Combines all factors into a 0-10 environmental impact score

### Scoring Scale
- **0-3**: Excellent (🌟) - Low environmental impact
- **3-5**: Good (✅) - Moderate impact, sustainable choice
- **5-7**: Fair (⚠️) - Higher impact, consider alternatives
- **7-10**: Poor (❌) - High impact, seek eco-friendly alternatives

---

## 🎨 Key Components

### ProductAnalyzer
- Multi-modal input interface
- Real-time validation
- Loading states and progress indicators

### ResultDisplay
- Interactive Chart.js visualizations
- Detailed impact breakdown
- Personalized recommendations
- Export functionality

### HistoryView
- Search and filtering capabilities
- Sortable analysis history
- Summary statistics
- Quick result preview

---

## 🚀 Future Enhancements

- [ ] **Real AI Integration** - Connect with OpenAI API for advanced NLP
- [ ] **Camera Barcode Scanning** - Implement ZXing/QuaggaJS for live scanning
- [ ] **OCR Text Extraction** - Add Tesseract.js for image text recognition
- [ ] **Backend API** - Node.js/Express server with MongoDB
- [ ] **User Authentication** - Personal accounts and data persistence
- [ ] **Product Database** - Integration with real product APIs
- [ ] **PDF Report Export** - Generate comprehensive sustainability reports
- [ ] **Social Sharing** - Share results on social media
- [ ] **Mobile App** - React Native version
- [ ] **AI Recommendations** - ML-powered product alternatives

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Chart.js** - For beautiful data visualizations
- **Tailwind CSS** - For rapid UI development
- **Lucide React** - For consistent iconography
- **React Dropzone** - For intuitive file uploads
- **Vite** - For lightning-fast development experience

---

## 📞 Contact

**Your Name** - shyamjeesrivastav035@gmail.com

**Project Link**: [https://github.com/shyamfitness/ecoanalyzer-ai](https://github.com/shyamfitness/ecoanalyzer-ai)

---

⭐ **Star this repo if you found it helpful!** ⭐
