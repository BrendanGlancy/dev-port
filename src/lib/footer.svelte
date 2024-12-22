<script>
</script>

<footer class="footer-container">
    <div class="footer-section">
        <h3>ACKNOWLEDGMENTS</h3>
        <ul>
            <li>
                <strong>Austin Coontz - Penetration Tester</strong> <a href="https://coontzy1.github.io/">↗</a>
                <p>Made him use Neovim</p>
            </li>
            <li>
                <strong>Ethan Tomford</strong> <a href="https://ethantomford.com/">↗</a>
                <p>Helped him cheat on the OSCP</p>
            </li>
            <li>
                <strong>Neovim</strong> <a href="https://neovim.io/">↗</a>
                <p>Helped me steal this template, blazingly fast</p>
            </li>
        </ul>
    </div>
    <div class="footer-section">
        <h3>LINKS</h3>
        <ul>
            <li>
                <strong>OVS Knife Co</strong> <a href="https://www.ovsknife.com/home">↗</a>
                <p>Latest Web Dev</p>
            </li>
            <li>
                <strong>Empire Casting Co</strong> <a href="https://empirecastingco.com/">↗</a>
                <p>Where I work, didn't do the website</p>
            </li>
        </ul>
    </div>
    <div class="footer-section">
        <h3>SOCIAL</h3>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/brendan-glancy/">LinkedIn</a>
            <a href="https://github.com/BrendanGlancy">GitHub</a>
        </div>
    </div>
    <div class="footer-bottom">
        <p>Steal this theme! It's open-source 🐒</p>
        <p>🍴 Forks: 19 ⭐ Stars: 63</p>
    </div>
</footer>

<style>
    .footer-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 2rem;
        background: radial-gradient(circle, #0C1019, #0d1117, #000);
        color: #c9d1d9;
        font-family: sans-serif;
        animation: gradientAnimation 80s infinite;
    }

    .footer-section {
        flex: 1 1 30%;
        margin: 1.5rem;
        padding: 1.5rem;
    }

    .footer-section h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
    }

    .footer-section ul li {
        margin-bottom: 1rem;
    }

    .footer-section ul li p {
        font-size: 0.9rem;
        margin: 0.2rem 0 0;
        color: #8b949e;
    }

    .footer-section .social-links a {
        margin-right: 1rem;
        text-decoration: none;
        color: #c9d1d9;
        font-size: 1.2rem;
    }

    .footer-section .social-links a:hover {
        color: #58a6ff;
    }

    .footer-bottom {
        flex: 1 1 100%;
        text-align: center;
        margin-top: 2rem;
        font-size: 0.9rem;
        color: #8b949e;
    }

    .footer-bottom p {
        margin: 0.5rem 0;
    }

    @keyframes gradientAnimation {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    /* Mobile Styling */
    @media (max-width: 768px) {
        .footer-container {
            flex-direction: column;
            padding: 1rem;
        }

        .footer-section {
            flex: 1 1 100%;
            margin: 1rem 0;
            padding: 1rem;
        }

        .footer-section h3 {
            font-size: 1rem;
        }

        .footer-section ul li p {
            font-size: 0.8rem;
        }

        .footer-section .social-links a {
            font-size: 1rem;
        }

        .footer-bottom {
            margin-top: 1rem;
        }
    }
</style>
