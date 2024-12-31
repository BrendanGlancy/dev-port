<script>
    import { onMount } from "svelte";

    let scrolled = false;
    let isMobile = false;
    let scrolledPastHero = false;

    const handleScroll = () => {
        scrolled = window.scrollY > 50;

        const heroHeight = document.getElementById("hero").offsetHeight;
        scrolledPastHero = window.scrollY > heroHeight;
    };

    const updateIsMobile = () => {
        isMobile = window.innerWidth <= 738;
    };

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", updateIsMobile);

        updateIsMobile();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateIsMobile);
        };
    });
</script>

<div class="container {isMobile || scrolledPastHero ? 'hidden' : ''}">
    <div class="menuHeader">
        <nav class="menu {scrolled ? 'scrolled' : ''}">
            <ul class="menuContent">
                <li class="menuHeader">
                    <a href="#hero">Home</a>
                </li>
                <li class="menuHeader">
                    <a href="#projects">Projects</a>
                </li>
                <li class="menuHeader">
                    <a href="/games">Games</a>
                </li>
                <li class="menuHeader">
                    <a href="https://www.linkedin.com/in/brendan-glancy/"
                        >LinkedIn</a
                    >
                </li>
                <li class="menuHeader"></li>
            </ul>
        </nav>
    </div>
</div>

<style>
    .container {
        position: fixed;
        top: 0;
        z-index: 10;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        width: 100vw;
        max-width: 100vw;
        color: white;

        &:not(.hidden) {
            transition: transform, cubic-bezier(0.4, 0, 0.2, 1), 300ms;
            transform: translateY(0%);
        }

        .menuHeader {
            display: flex;
            flex-direction: row;

            a {
                display: flex;
                align-items: center;
                margin: 1rem;

                font-weight: 600;
                text-decoration: none;
            }
        }

        .menu {
            display: flex;
            justify-content: space-between;
            margin: 1rem auto;
            border-radius: 1rem;
            position: relative;
            border-radius: 1rem;
            opacity: 60%;

            a {
                font-weight: 700;
                color: white;
            }
        }

        ul {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 6rem;
        }
    }

    .container.hidden {
        display: none;
    }
</style>
