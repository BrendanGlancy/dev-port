<h1 align="center">Developer Portfolio</h1>

<p align="center">
  <strong>A modern, interactive portfolio built with SvelteKit featuring a stunning scroll-reactive fluid animation</strong>
</p>

<p align="center">
  <a href="https://brendanglancy.com/">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#technologies">Technologies</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
</p>

---

## Overview

A cutting-edge developer portfolio template that showcases your projects and skills with style. Built with SvelteKit for blazing-fast performance and featuring an interactive fluid simulation that responds to both mouse movement and scroll.

**[View Live Demo →](https://brendanglancy.com/)**

https://github.com/user-attachments/assets/70b0dfe9-0fcc-4219-b5e5-391b6ad58e91

## Features

✨ **Interactive Fluid Animation** - Beautiful scroll-reactive water simulation in the hero section
📱 **Fully Responsive** - Looks great on all devices
🚀 **Lightning Fast** - Built with SvelteKit and Vite for optimal performance
🎮 **Built-in Games** - Includes eMatchi (emoji matching) and Snake
🔗 **GitHub Integration** - Automatically showcases your GitHub projects
🎨 **Modern UI** - Clean, professional design with smooth animations
⚡ **Zero-Config Deploy** - Deploy anywhere with SvelteKit adapters

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BrendanGlancy/dev-port.git
   cd dev-port
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Customization

### Update Your Information

Edit the component files in `src/lib/components/` to customize:
- **Hero Section**: `hero.svelte` - Your name and animated background
- **GitHub Projects**: `github.svelte` - Configure your GitHub username
- **Footer**: `footer.svelte` - Contact information and social links

### Customize the Fluid Animation

The scroll-reactive water animation can be customized in `src/lib/components/hero.svelte`:

```javascript
// Control scroll sensitivity (line 211)
var scroll_yv = (scroll.y - scroll.py) * 0.16; // Increase for faster movement

// Grid resolution (line 36)
var resolution = 100; // Lower = smoother (e.g., 50), Higher = coarser (e.g., 100)

// Particle count (line 41)
var speck_count = 1000; // More particles = denser effect
```

## Technologies

- **[SvelteKit](https://kit.svelte.dev/)** - Web application framework
- **[Svelte 5](https://svelte.dev/)** - UI component framework
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Sveltestrap](https://sveltestrap.js.org/)** - Bootstrap 5 components for Svelte
- **[Svelte FA](https://github.com/Cweili/svelte-fa)** - Font Awesome integration
- **[Neoconfetti](https://www.neoconfetti.com/)** - Confetti animations

## Project Structure

```
dev-port/
├── src/
│   ├── lib/
│   │   └── components/      # Reusable Svelte components
│   ├── routes/              # SvelteKit routes
│   │   ├── +page.svelte    # Home page
│   │   ├── ematchi/        # Emoji matching game
│   │   ├── games/          # Games showcase
│   │   └── snake/          # Snake game
│   ├── app.html            # HTML template
│   └── styles.css          # Global styles
├── static/                  # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Show Your Support

If you find this project useful, please consider giving it a star ⭐️

It helps others discover this template and motivates continued development!

---

<p align="center">Made with ❤️ using SvelteKit</p>
