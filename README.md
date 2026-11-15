<h1 align="center">Brendan Glancy — Developer Portfolio</h1>

<p align="center">
  <strong>My personal site, built with SvelteKit and a hand-written fluid simulation that reacts to your cursor, touch and scroll.</strong>
</p>

<p align="center">
  <a href="https://brendanglancy.com/">Live site</a> •
  <a href="#whats-on-the-site">What's on the site</a> •
  <a href="#getting-started">Getting started</a> •
  <a href="#make-it-yours">Make it yours</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
</p>

---

https://github.com/user-attachments/assets/70b0dfe9-0fcc-4219-b5e5-391b6ad58e91

## About me

I'm a software engineer in Akron–Canton, Ohio. I work across full-stack web development, systems programming in C, C++ and Rust, and security.

- **DeliverThat** (2026 – present): full-stack development on production systems.
- **LSI Digital** (2025 – 2026): built a video plugin that plays one video in sync across multiple **LG webOS** and **Samsung Tizen** screens that share nothing but a local network. Screens find each other over UDP and elect a leader, agree on an NTP-corrected clock, and start playback at a scheduled timestamp, within about a millisecond of each other's clocks.
- **Open source:** I added compile-time UDP probe payloads to [RustScan](https://github.com/bee-san/RustScan/pull/643) (20k+ ★), and an EmailJS contact section to [developer-portfolio](https://github.com/1hanzla100/developer-portfolio/pull/30) (800+ ★).
- **AI-assisted workflow:** a development workflow I designed in which AI agents carry work from idea to reviewed, tested code, and an engineer makes the decisions.
- **Security:** top 2% in picoCTF 2022, Hack The Box global rank #534, BuckeyeCTF, and the CTF and Cyber Defense clubs at the University of Akron.

## What's on the site

| Section | What it shows |
| --- | --- |
| **Hero** | Name and tagline over an interactive fluid simulation. Hovering, touching or scrolling stirs the particles. |
| **About** | Bio, education, and CTF results. |
| **Experience** | A timeline: DeliverThat, LSI Digital, Tekahna, OVS Knife Co., Canton Regional Chamber of Commerce. |
| **AI-assisted workflow** | A high-level view of how I use AI agents to go from idea to shipped code. |
| **Open source** | RustScan and developer-portfolio contributions, with live star counts from the GitHub API. |
| **Contact** | Email, GitHub, LinkedIn and résumé links. |

Other details:

- **Accessibility:** respects `prefers-reduced-motion`, has visible focus styles, and the mobile nav works without blocking page scroll.
- **SEO:** Open Graph and Twitter cards, plus a `schema.org/Person` JSON-LD block.
- **Fast:** the home page is prerendered and uses no UI framework beyond Svelte.

## Getting started

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/BrendanGlancy/dev-port.git
cd dev-port
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## Make it yours

All of the site's text lives in **`src/lib/data.js`**: profile, bio, experience, workflow overview, featured projects, CTF stats and shoutouts. Edit that file and the page updates; you don't need to touch the components.

To tune the fluid animation, edit these values in `src/lib/components/hero.svelte`:

| Variable | Effect |
| --- | --- |
| `scroll_yv` multiplier in `draw()` | How strongly scrolling pushes the fluid |
| `resolution` | Grid cell size. Lower is smoother but heavier. |
| `speck_count` | Number of particles (drops to 400 under reduced motion) |
| `cell_data.xv *= 0.99` in `update_velocity()` | How long the fluid keeps moving after you stop |

## Project structure

```
src/
├── lib/
│   ├── data.js                 # all site content
│   └── components/
│       ├── hero.svelte         # fluid simulation + intro
│       ├── navbar.svelte
│       ├── about.svelte        # bio, CTF stats
│       ├── experience.svelte   # timeline
│       ├── pipeline.svelte     # AI-assisted workflow
│       ├── github.svelte       # open-source cards with live stars
│       └── footer.svelte       # contact + footer
├── routes/
│   └── +page.svelte            # home page
└── styles.css                  # design tokens + shared styles
```

## Built with

[SvelteKit](https://kit.svelte.dev/) · [Svelte 5](https://svelte.dev/) · [Vite](https://vitejs.dev/) · [Svelte FA](https://github.com/Cweili/svelte-fa) · [Fira Code](https://github.com/tonsky/FiraCode)

---

<p align="center">If this helped you build your own portfolio, a ⭐️ is appreciated.</p>
