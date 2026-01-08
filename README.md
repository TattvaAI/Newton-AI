# 🌌 Newton-AI: Generative Physics Lab

**AI-Powered Physics Simulation Playground**

Transform natural language into real-time 2D physics simulations. Powered by Google Gemini 3 AI and Matter.js, Newton-AI lets you create, experiment, and explore physics concepts through simple text prompts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TattvaAI/Newton-AI&env=VITE_GEMINI_API_KEY)

---

## ✨ Features

### 🤖 AI-Powered Generation
- **Gemini 3 Pro**: Highest quality physics code generation (150 requests/day)
- **Gemini 3 Flash**: Fast generation with higher rate limits (1,000 requests/day)
- **Self-Healing**: Automatic error detection and code correction
- **Natural Language**: Describe physics experiments in plain English

### ⚛️ Advanced Physics
- **Matter.js Engine**: Production-grade 2D physics simulation
- **Real-time Rendering**: Smooth 60 FPS animations
- **Interactive**: Drag and manipulate objects with mouse
- **Bounded World**: Automatic wall creation and resize handling

### 🎨 Professional UI
- **Cyberpunk Aesthetic**: Sleek dark theme with cyan accents
- **Real-time HUD**: Live FPS, object count, and system stats
- **Toast Notifications**: User feedback for all operations
- **Keyboard Shortcuts**: Quick access to common actions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/TattvaAI/Newton-AI.git
cd Newton-AI

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# VITE_GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
```

Visit `http://localhost:5173` and start creating!

---

## 🎮 Usage

### Creating Simulations

Simply type what you want to see:
- "create bouncing balls"
- "stack of falling boxes"  
- "pendulum with chains"
- "solar system simulation"
- "Newton's cradle"

Press **Enter** or click **Generate** to watch AI bring it to life!

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause/Play simulation |
| `R` | Reset world (clear all objects) |
| `D` | Toggle debug wireframe mode |

### Model Selection

Toggle between AI models in the top-right:
- **PRO**: Best quality, complex physics (150/day limit)
- **FLASH**: Fast generation, simple experiments (1,000/day limit)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TattvaAI/Newton-AI&env=VITE_GEMINI_API_KEY)

1. Click the button above
2. Add your `VITE_GEMINI_API_KEY`
3. Deploy!

See [DEPLOY.md](DEPLOY.md) for more deployment options.

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Matter.js** - Excellent 2D physics engine
- **Google Gemini** - Powerful AI code generation  
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling

---

**⭐ Star this repo if you found it useful!**

Built with ❤️ by [TattvaAI](https://github.com/TattvaAI)
