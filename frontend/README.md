# Krida LungVision — Frontend

Next.js 16 frontend application for the AI-powered lung pathology classification system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State**: Zustand
- **Theming**: next-themes

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── research/          # Research paper page
│   └── dashboard/         # Dashboard section
│       ├── page.tsx       # Worklist
│       ├── layout.tsx     # Dashboard layout
│       ├── upload/        # Upload new scan
│       ├── history/       # Case history
│       └── case/[id]/     # Case viewer
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation
│   ├── Hero.tsx          # Landing hero
│   ├── ThemeProvider.tsx # Theme context
│   └── ThemeToggle.tsx   # Dark/Light toggle
├── store/                # State management
│   └── caseStore.ts      # Case store
└── lib/                  # Utilities
    └── utils.ts          # Helper functions
```

## Features

### Pages
- **Landing** (`/`) — Hero section with CTA
- **About** (`/about`) — Project info, tech stack, team
- **Research** (`/research`) — Academic paper presentation
- **Dashboard** (`/dashboard`) — Active case worklist
- **Upload** (`/dashboard/upload`) — Upload new X-ray
- **History** (`/dashboard/history`) — Completed cases
- **Case Viewer** (`/dashboard/case/[id]`) — Detailed analysis with Grad-CAM

### UI Features
- 🌓 Dark/Light/System theme support
- 📱 Responsive mobile-first design
- ⌨️ Keyboard shortcuts (V/R/C)
- 🔔 Toast notifications
- ✨ Smooth animations
- 🎨 Glassmorphism design

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/predict` | Analyze X-ray image |
| `POST /api/gradcam` | Generate heatmap |
| `GET /health` | Health check |

## Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## License

Educational and research purposes only.
