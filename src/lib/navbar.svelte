<script>
</script>

<div class="container">
    <div class="menuHeader">
        <nav class="menu">
            <ul class="menuContent">
                <li class="menuHeader">
                    <a href="/home">Home</a>
                </li>
                <li class="menuHeader">
                    <a href="#projects">Projects</a>
                </li>
                <li class="menuHeader">
                    <a href="#socials">Socials</a>
                </li>
                <li class="menuHeader">
                    <a href="https://www.linkedin.com/in/brendan-glancy/">LinkedIn</a>
                </li>
                <li class="menuHeader">
                </li>
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
                font-family: var(--font-sans);
                color: var(--primary-dark);
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
            border: 2px solid white;

            a {
                font-weight: 700;

                &:hover {
                    color: #888889;
                }
            }

            &:after {
                content: "";
                position: absolute;
                z-index: -1;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--primary-dark);
                opacity: 50%;
                border-radius: 1rem;
            }
        }

        ul {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4rem;
        }
    }
</style>
