<script>
    import Github from "$lib/github.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Footer from "$lib/footer.svelte";
</script>

<svelte:head>
    <title>Brendan Glancy</title>
</svelte:head>

<main>
    <p>Hello, I'm</p>
    <h2>Brendan Glancy</h2>
    <h2 class="dark-gray">I use Neovim btw</h2>
</main>
<Navbar />
<Github />
<Footer />

<style>
    /* Apply a black gradient background */
    :global(body) {
        margin: 0;
        padding: 0;
        height: 100%; /* Full height for body */
        font-family:
            "Nter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            "Fira Sans",
            "Droid Sans",
            "Helvetica Neue",
            sans-serif;
    }

    main {
        background: radial-gradient(circle, #0d0c0e, #3a014f, #3d7c88, #0d4680);
        background-size: 400% 400%;
        animation: gradientAnimation 80s infinite;

        display: flex;
        flex-direction: column;
        height: calc(100vh - 80px - 88px);
        justify-content: center;
        align-items: center;
    }

    h2 {
        color: white;
        font-size: 4rem;
        margin: 0;
        text-align: left;
        width: 100%;
        max-width: 600px;
    }

    .dark-gray {
        color: #888889;
    }

    p {
        color: #7feaff;
        text-align: left;
        font-size: 1.5rem;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 2rem; /* Smaller font size for mobile */
            text-align: center;
        }

        p {
            font-size: 1rem;
        }
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
</style>
