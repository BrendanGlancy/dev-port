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
    let nav;

    onMount(() => {
        const onScroll = () => (scrolled = window.scrollY > 40);
        onScroll();
        const onKey = (e) => {
            if (e.key === "Escape") open = false;
        };
        // Tapping anywhere outside the open menu dismisses it.
        const onOutside = (e) => {
            if (open && !nav.contains(e.target)) open = false;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("keydown", onKey);
        document.addEventListener("click", onOutside);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("keydown", onKey);
            document.removeEventListener("click", onOutside);
        };
    });
</script>

<nav bind:this={nav} class:scrolled class:open aria-label="Main">
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
                <a class="resume" href={profile.resume} target="_blank" rel="noopener" onclick={() => (open = false)}>Résumé</a>
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
        padding-top: env(safe-area-inset-top);
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
        /* Links are 44px tall for touch; the smaller padding keeps the bar the same height. */
        padding: 0.4rem var(--gutter-r) 0.4rem var(--gutter-l);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        display: inline-flex;
        align-items: center;
        min-width: 44px;
        min-height: 44px;
        font-family: var(--mono);
        font-weight: 400;
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
        display: inline-flex;
        align-items: center;
        min-height: 44px;
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
        position: relative;
        display: inline-block;
        min-height: 0;
        line-height: 1.25;
        padding: 0.35rem 0.9rem;
        border-radius: 999px;
    }

    /* Invisible 44px-tall hit area around the pill. */
    .resume::after {
        content: "";
        position: absolute;
        inset: -8px 0;
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
            margin-right: -11px; /* line the bars up with the page gutter */
        }

        /* Blurring a fixed bar over a scrolling page / animating canvas is costly on phone GPUs. */
        nav.scrolled,
        nav.open {
            background: rgba(0, 0, 0, 0.92);
            backdrop-filter: none;
        }

        nav.open {
            background: rgba(0, 0, 0, 0.97);
        }

        ul {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 0;
            padding: 0.5rem var(--gutter-r) 1.25rem var(--gutter-l);
            background: rgba(0, 0, 0, 0.97); /* near-opaque: hero text must not read through the menu */
            border-bottom: 1px solid var(--line);
            /* Short / landscape screens: scroll inside the menu instead of running off-screen. */
            max-height: calc(100vh - 100% - env(safe-area-inset-top));
            max-height: calc(100dvh - 100% - env(safe-area-inset-top));
            overflow-y: auto;
            overscroll-behavior: contain;
            align-items: stretch;
        }

        .open ul {
            display: flex;
        }

        ul li {
            width: 100%;
        }

        ul a {
            display: flex;
            padding: 0.8rem 0;
            font-size: 1.05rem;
        }

        .resume {
            display: inline-flex !important;
            min-height: 44px;
            line-height: inherit;
            padding: 0.35rem 1.1rem;
            margin-top: 0.5rem;
        }
    }

    /* Landscape phones: two columns so the whole menu fits without scrolling. */
    @media (max-width: 720px) and (max-height: 480px) {
        .open ul {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1.5rem;
        }

        ul a {
            padding: 0.4rem 0;
        }

        .resume {
            margin-top: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .logo span { animation: none; }
    }
</style>
