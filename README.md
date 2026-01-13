# 🌟 Newton-AI

> AI-powered physics simulation playground using Google Gemini and Matter.js

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6.svg" alt="TypeScript">
</p>

## ✨ Features

🤖 **AI-Powered Generation** - Describe physics scenarios in natural language, watch AI create them  
⚡ **Real-time Physics** - Powered by Matter.js for accurate 2D physics simulation  
📊 **Live Measurements** - Track velocity, acceleration, energy, and momentum in real-time  
🎓 **Educational Tools** - Object inspector, physics dashboard, and interactive controls  
💾 **Save & Load** - Save your favorite simulations to local storage  
🎨 **Modern UI** - Built with React 19, TailwindCSS, and Radix UI components  
📈 **Visualization** - Beautiful charts and graphs using Recharts  
🧪 **Well-Tested** - Comprehensive test suite with Vitest  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or pnpm 8+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/TattvaAI/Newton-AI.git
cd Newton-AI

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# VITE_GEMINI_API_KEY=your_api_key_here
```

### Running the App

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🎮 Usage

1. **Enter a prompt** describing your physics scenario:
   - "Create a bouncing ball"
   - "Two objects colliding at different speeds"
   - "A pendulum swinging back and forth"

2. **Watch AI generate** the physics simulation in real-time

3. **Interact with controls**:
   - ⏯️ Play/Pause simulation
   - 🔄 Reset to initial state
   - 🗑️ Clear all objects
   - 💾 Save simulation
   - 📊 Toggle physics dashboard

4. **Inspect objects** - Click on any object to view its properties

5. **Analyze physics** - Open the dashboard to see real-time measurements

## 🏗️ Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components (Radix)
│   └── controls/    # Simulation controls
├── features/        # Feature modules
│   ├── education/   # Educational tools
│   ├── export/      # Export functionality
│   └── measurements/# Physics measurements
├── hooks/           # Custom React hooks
├── lib/            # Core libraries
│   ├── ai/         # AI integration (Gemini)
│   ├── calculations/# Physics calculations
│   └── physics.ts  # Matter.js wrapper
├── types/          # TypeScript types
└── constants/      # App constants
```

## 🧪 Tech Stack

**Frontend Framework**
- React 19.2 with TypeScript
- Vite 7.2 for blazing-fast builds

**Physics Engine**
- Matter.js 0.20 - 2D physics simulation

**AI Integration**
- Google Generative AI (Gemini Flash)

**UI Components**
- TailwindCSS 4.1 for styling
- Radix UI for accessible components
- Lucide React for icons
- Recharts for data visualization

**Testing**
- Vitest 4.0 for unit tests
- Testing Library for component tests
- Happy DOM for fast DOM testing

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Your Google Gemini API key
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🎯 Keyboard Shortcuts

- `Space` - Play/Pause simulation
- `R` - Reset simulation
- `C` - Clear all objects
- `S` - Save simulation
- `D` - Toggle debug mode

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm test` | Run test suite |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:coverage` | Generate coverage report |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Matter.js](https://brm.io/matter-js/) - Physics engine
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Recharts](https://recharts.org/) - Data visualization

## 🐛 Known Issues

- Export feature currently in development
- Debug mode placeholder needs implementation

## 🗺️ Roadmap

- [ ] Complete export functionality (PNG, GIF, Video)
- [ ] Add dark/light theme toggle
- [ ] Implement Web Workers for better performance
- [ ] Multi-model AI support (Claude, GPT-4)
- [ ] Collaboration features (share simulations)
- [ ] Mobile app version

## 📧 Contact

**TattvaAI** - [GitHub](https://github.com/TattvaAI/Newton-AI)

---

<p align="center">Made with ❤️ and ⚛️ physics</p>
