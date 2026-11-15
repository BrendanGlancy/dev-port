<script>
    import { onMount } from "svelte";
    import { profile } from "$lib/data.js";

    const links = [
        { href: "#about", label: "About" },
        { href: "#experience", label: "Experience" },
        { href: "#pipeline", label: "AI Workflow" },
        { href: "#work", label: "Work" },
        { href: "#contact", label: "Contact" },
    ];

    let scrolled = $state(false);
    let open = $state(false);

    onMount(() => {
        const onScroll = () => (scrolled = window.scrollY > 40);
        onScroll();
        const onKey = (e) => {
            if (e.key === "Escape") open = false;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("keydown", onKey);
        };
    });
</script>

<nav class:scrolled class:open aria-label="Main">
    <div class="inner">
        <a class="logo" href="#hero" onclick={() => (open = false)}>BG<span>_</span></a>
        <button
            class="toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="nav-links"
            onclick={() => (open = !open)}
        >
            <span></span><span></span>
        </button>
        <ul id="nav-links">
            {#each links as link}
                <li><a href={link.href} onclick={() => (open = false)}>{link.label}</a></li>
            {/each}
            <li>
                <a class="resume" href={profile.resume} target="_blank" rel="noopener">Résumé</a>
            </li>
        </ul>
    </div>
</nav>

<style>
    nav {
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 50;
        transition: background 0.3s, border-color 0.3s;
        border-bottom: 1px solid transparent;
    }

    nav.scrolled,
    nav.open {
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(12px);
        border-bottom-color: var(--line);
    }

    .inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0.9rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        font-family: var(--mono);
        font-weight: 500;
        text-decoration: none;
        color: var(--fg);
        font-size: 1.1rem;
    }

    .logo span {
        color: var(--accent);
        animation: blink 1.1s steps(1) infinite;
    }

    @keyframes blink {
        50% { opacity: 0; }
    }

    ul {
        display: flex;
        gap: 2rem;
        list-style: none;
        align-items: center;
    }

    ul a {
        text-decoration: none;
        color: var(--muted);
        font-size: 0.92rem;
        transition: color 0.2s;
    }

    ul a:hover {
        color: var(--fg);
    }

    .resume {
        border: 1px solid var(--accent);
        color: var(--accent) !important;
        padding: 0.35rem 0.9rem;
        border-radius: 999px;
    }

    .toggle {
        display: none;
        background: none;
        border: 0;
        width: 44px;
        height: 44px;
        position: relative;
        cursor: pointer;
    }

    .toggle span {
        position: absolute;
        left: 11px;
        right: 11px;
        height: 2px;
        background: var(--fg);
        transition: transform 0.25s;
    }

    .toggle span:first-child { top: 17px; }
    .toggle span:last-child { top: 25px; }
    .open .toggle span:first-child { transform: translateY(4px) rotate(45deg); }
    .open .toggle span:last-child { transform: translateY(-4px) rotate(-45deg); }

    @media (max-width: 720px) {
        .toggle {
            display: block;
        }

        ul {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 0;
            padding: 0.5rem 1.25rem 1.25rem;
            background: rgba(0, 0, 0, 0.92);
            border-bottom: 1px solid var(--line);
        }

        .open ul {
            display: flex;
        }

        ul li {
            width: 100%;
        }

        ul a {
            display: block;
            padding: 0.8rem 0;
            font-size: 1.05rem;
        }

        .resume {
            display: inline-block !important;
            margin-top: 0.5rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .logo span { animation: none; }
    }
</style>
