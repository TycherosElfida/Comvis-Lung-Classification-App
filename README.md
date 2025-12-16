<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch" alt="PyTorch">
  <img src="https://img.shields.io/badge/DenseNet121-CNN-blueviolet?style=for-the-badge" alt="DenseNet121">
</p>

# 🫁 Krida LungVision

**AI-Powered Multi-Pathology Lung Classification System**

A production-ready medical imaging application that detects **13 different lung pathologies** from Chest X-Ray images using deep learning. Features an enterprise-grade hospital workflow with real-time AI triage, Explainable AI (Grad-CAM) visualization, and a modern glassmorphism UI.

> 🎓 **Computer Vision Final Project** — Kelompok 1

---

## ✨ Key Features

### 🏥 Clinical Workflow
- **AI-Powered Triage** — Automatic urgency classification (Critical/Moderate/Routine)
- **Worklist Management** — Dashboard for pending, verified, and rejected cases
- **Radiologist Verification Loop** — Human-in-the-loop confirmation system
- **Case History** — Complete audit trail of all analyzed scans

### 🧠 AI & Machine Learning
- **Multi-Label Classification** — Detects 13 concurrent pathologies simultaneously
- **DenseNet121 Architecture** — Fine-tuned on NIH ChestX-ray14 dataset (112,120 images)
- **ONNX Runtime Inference** — Production-optimized for <50ms prediction time
- **Real AUC Score: 0.6794** — Validated performance metrics

### 🔍 Explainable AI (XAI)
- **Grad-CAM Heatmaps** — Visualize model attention on X-ray regions
- **Interactive Comparison** — Side-by-side slider for original vs. heatmap
- **Per-Pathology Analysis** — Generate heatmaps for specific findings

### 💻 Modern UI/UX
- **Glassmorphism Design** — Premium dark mode interface
- **Dark/Light Mode Toggle** — System preference support
- **Responsive Design** — Mobile-first with collapsible sidebar
- **Keyboard Shortcuts** — V (Verify), R (Reject), C (Compare)
- **Toast Notifications** — Rich feedback for all actions

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | FastAPI, Python 3.11+, Uvicorn |
| **AI/ML** | PyTorch, ONNX Runtime, DenseNet121, Grad-CAM |
| **State** | Zustand (client-side persistence) |
| **UI Components** | shadcn/ui, Lucide Icons, Sonner (toasts) |

---

## 📁 Project Structure

```
Comvis-Lung-Classification-App/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # API entry point
│   │   ├── config.py          # Configuration & constants
│   │   ├── inference.py       # DenseNet121 inference engine
│   │   └── gradcam.py         # Grad-CAM implementation
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx           # Landing page (Hero)
│   │   ├── layout.tsx         # Root layout with ThemeProvider
│   │   ├── about/             # About page with team info
│   │   ├── research/          # Research paper page
│   │   └── dashboard/         # Protected dashboard
│   │       ├── page.tsx       # Worklist
│   │       ├── upload/        # Upload new scan
│   │       ├── history/       # Case history
│   │       ├── case/[id]/     # Case viewer with XAI
│   │       └── layout.tsx     # Dashboard sidebar
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Hero.tsx           # Landing page hero
│   │   ├── ThemeProvider.tsx  # Dark/light mode
│   │   └── ThemeToggle.tsx    # Theme switcher
│   ├── store/                 # Zustand state management
│   │   └── caseStore.ts       # Case management store
│   └── lib/                   # Utilities
│
├── models/                     # ML Model Files
│   └── densenet121_chest_xray.onnx
│
├── notebooks/                  # Training notebooks
│   └── Final_Project.ipynb
│
└── README.md                   # This file
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/TycherosElfida/Comvis-Lung-Classification-App.git
cd Comvis-Lung-Classification-App
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🚀 Usage

### Quick Start
1. Open `http://localhost:3000` in your browser
2. Click **Launch App** or navigate to `/dashboard`
3. Click **New Scan** to upload a chest X-ray image
4. Enter patient information and click **Analyze with AI**
5. View predictions and urgency classification
6. Click on a case to view details and generate Grad-CAM heatmaps
7. **Verify** or **Reject** the AI diagnosis

### Keyboard Shortcuts (Case Viewer)
| Key | Action |
|-----|--------|
| `V` | Verify AI diagnosis |
| `R` | Reject case for manual review |
| `C` | Toggle comparison mode |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/predict` | Analyze chest X-ray |
| `POST` | `/api/gradcam` | Generate Grad-CAM heatmap |

---

## 🎯 Pathologies Detected

The model classifies the following 13 lung conditions:

| ID | Pathology | ID | Pathology |
|----|-----------|----|-----------| 
| 1 | Atelectasis | 8 | Nodule |
| 2 | Cardiomegaly | 9 | Pleural Thickening |
| 3 | Consolidation | 10 | Pneumonia |
| 4 | Edema | 11 | Pneumothorax |
| 5 | Effusion | 12 | Emphysema |
| 6 | Hernia | 13 | Fibrosis |
| 7 | Infiltration | | |

---

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| **Architecture** | DenseNet121 (ImageNet pretrained) |
| **Dataset** | NIH ChestX-ray14 (112,120 images) |
| **Mean AUC** | 0.6794 |
| **Input Size** | 224 × 224 pixels |
| **Inference Time** | <50ms (ONNX Runtime) |

---

## 👥 Development Team

**Kelompok 1** — Computer Vision Final Project

| Name | Student ID |
|------|-----------|
| Steven | 412022006 |
| Steven Felizio | 412023011 |
| Sanders Keane Dylan | 412023020 |
| Bintang Talenta Putra | 412023022 |

---

## 📄 License

This project is for **educational and research purposes only**. 

> ⚠️ **Disclaimer**: This application is NOT intended for clinical use and should NOT be used as a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for medical decisions.

---

## 🔗 Links

- **Repository**: [GitHub](https://github.com/TycherosElfida/Comvis-Lung-Classification-App.git)
- **Research Paper**: Available at `/research` page

---

<p align="center">
  Made with ❤️ for Computer Vision Course
</p>
