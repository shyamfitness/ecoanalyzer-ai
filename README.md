# 🌱 AI Environmental Impact Analyzer

An **AI-powered full-stack web application** that analyzes product descriptions, images, or barcodes to compute **Environmental Impact Scores (EIS)**. Built with React.js, Node.js, Express, MongoDB, and OpenAI GPT-4, the platform provides eco-friendly insights, generates visual reports, and helps consumers make sustainable purchasing decisions.

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange?logo=openai)

---

## 🚀 Live Demo

**[View Live Application](https://ecoanalyzer-ai.vercel.app/)**

---

## 📌 Features

- **AI-Powered Analysis** – Real OpenAI GPT-4 integration for sophisticated environmental impact analysis
- **Multiple Input Methods**
  - 📝 **Text Input** – Enter product name and description
  - 📸 **Image Upload** – Drag & drop product images with OCR text extraction
  - 📦 **Barcode Scanner** – Manual barcode entry with product database lookup
- **Smart Categorization** – AI automatically categorizes products (Electronics, Clothing, Food, etc.)
- **Origin-Based Impact** – Calculates carbon footprint based on manufacturing country and shipping distance
- **Detailed Breakdown** – Shows impact across Manufacturing, Shipping, Packaging, and End-of-Life
- **Interactive Charts** – Beautiful Doughnut and Bar charts powered by Chart.js
- **Historical Tracking** – View and manage past analyses with search and filtering
- **User Authentication** – Secure user accounts with JWT authentication
- **Data Persistence** – MongoDB database for storing user data and analysis history
- **Smart Recommendations** – Personalized sustainability suggestions from AI
- **Export Reports** – Download analysis results as JSON
- **Responsive Design** – Optimized for desktop and mobile devices

---

## 🛠️ Tech Stack

| **Category**       | **Technologies Used**              |
|---------------------|-----------------------------------|
| **Frontend**        | React.js 19.1, Vite, JavaScript ES6+ |
| **Backend**         | Node.js, Express.js, MongoDB |
| **AI Integration**  | OpenAI GPT-4 API |
| **Authentication**  | JWT, bcryptjs |
| **Styling**        | Tailwind CSS 4.x, Custom Green Theme |
| **Charts**         | Chart.js 4.x, React-ChartJS-2    |
| **Icons**          | Lucide React                      |
| **File Upload**    | React-Dropzone, Multer |
| **OCR**            | Tesseract.js |
| **Barcode Scanning** | Quagga2 |
| **HTTP Client**    | Axios                             |
| **Build Tool**     | Vite                              |
| **Package Manager** | npm                               |

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/shyamfitness/ecoanalyzer-ai.git
cd ecoanalyzer-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (you can copy from `backend/env.example`):

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecoanalyzer
# or for MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecoanalyzer

MONGODB_DB_NAME=ecoanalyzer

# OpenAI API (Required)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Authentication (Required)
JWT_SECRET=your_secure_jwt_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173,http://localhost:4173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd .. # Back to root directory
npm install
```

Create a `.env` file in the root directory (you can copy from `env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Build for Production

```bash
# Build frontend
npm run build

# Start backend in production
cd backend
npm start
```

---

## 🎯 Usage

### 1. Sign Up / Sign In

- Create an account or sign in to save your analysis history
- Your data is securely stored and synced across devices

### 2. Analyze a Product

- Choose your input method (Text, Image, or Barcode)
- Enter product details or upload files
- Click "Analyze Environmental Impact"
- Wait for AI processing (2-5 seconds)

### 3. View Results

- See your Environmental Impact Score (0-10 scale)
- Explore detailed breakdown charts
- Read personalized AI recommendations
- Export or share your results

### 4. Track History

- Navigate to "History" tab
- Search and filter past analyses
- Compare different products
- Track your sustainability progress

---

## 🏗️ Project Structure

```
ecoanalyzer-ai/
├── backend/                 # Node.js/Express backend
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection
│   ├── controllers/         # Request handlers
│   │   ├── analysisController.js
│   │   ├── barcodeController.js
│   │   └── historyController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Analysis.js
│   │   └── Product.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── v1/              # API v1 routes
│   │       ├── analyzeRoutes.js
│   │       ├── barcodeRoutes.js
│   │       ├── historyRoutes.js
│   │       └── index.js
│   ├── services/            # Business logic
│   │   ├── openaiService.js
│   │   ├── ocrService.js
│   │   ├── barcodeService.js
│   │   └── pdfService.js
│   ├── utils/               # Utility functions
│   │   ├── asyncHandler.js
│   │   └── scoringEngine.js
│   ├── server.js            # Main server file
│   ├── package.json
│   └── env.example         # Environment variables template
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Container.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── BarcodeScanner.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── LoginModal.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Analyzer.jsx
│   │   ├── Result.jsx
│   │   ├── History.jsx
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   └── Settings.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Tailwind CSS imports
├── public/                  # Static assets
├── README.md                # This file
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── env.example              # Frontend environment variables template
```

---

## 🔬 How It Works

### AI-Powered Environmental Impact Analysis

1. **Product Categorization**: OpenAI GPT-4 analyzes product names/descriptions to categorize items
2. **Material Analysis**: AI identifies materials and their environmental impact factors
3. **Manufacturing Impact**: Calculates emissions based on product category and materials
4. **Shipping Impact**: Estimates carbon footprint based on country of origin and distance
5. **Packaging & End-of-Life**: Considers packaging materials and disposal methods
6. **Scoring Algorithm**: AI combines all factors into a 0-10 environmental impact score

### Scoring Scale

- **0-3**: Excellent (🌟) - Low environmental impact
- **3-5**: Good (✅) - Moderate impact, sustainable choice
- **5-7**: Fair (⚠️) - Higher impact, consider alternatives
- **7-10**: Poor (❌) - High impact, seek eco-friendly alternatives

---

## 🚀 Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set `VITE_API_URL` environment variable to your backend URL
3. Deploy automatically on push

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `backend/`
4. Configure environment variables (see `backend/env.example`)
5. Deploy

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create a new cluster (Free tier available)
3. Get your connection string
4. Update `MONGODB_URI` in backend environment variables

---

## 🔧 Environment Variables

### Backend (.env)

See `backend/env.example` for a complete template. Required variables:

- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Secure random string for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL(s) for CORS

### Frontend (.env)

See `env.example` for a complete template. Required variables:

- `VITE_API_URL` - Backend API URL

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - For providing the GPT-4 API for intelligent analysis
- **Chart.js** - For beautiful data visualizations
- **Tailwind CSS** - For rapid UI development
- **Lucide React** - For consistent iconography
- **React Dropzone** - For intuitive file uploads
- **Vite** - For lightning-fast development experience
- **MongoDB** - For flexible document storage
- **Express.js** - For robust backend API

---

## 📞 Contact

**Email** - shyamjeesrivastav035@gmail.com

**Project Link**: [https://github.com/shyamfitness/ecoanalyzer-ai](https://github.com/shyamfitness/ecoanalyzer-ai)

---

⭐ **Star this repo if you found it helpful!** ⭐
