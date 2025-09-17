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
        z-index: 10;
        width: 100vw;

        &:not(.hidden) {
            transform: translateY(0%);
        }

        .menuHeader {
            display: flex;
            flex-direction: row;

            a {
                display: flex;
                text-decoration: none;
            }
        }

        .menu {
            display: flex;
            justify-content: center;
            margin: 1rem auto;

            a {
                color: white;
            }
        }

        ul {
            display: flex;
            flex-direction: row;
            gap: 6rem;
        }
    }

    .container.hidden {
        display: none;
    }
</style>
