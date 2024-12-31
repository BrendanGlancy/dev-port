<script>
    import Github from "$lib/components/github.svelte";
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/footer.svelte";
    import Hero from "$lib/components/hero.svelte";

    import "../styles.css";
</script>

<svelte:head>
    <title>Brendan Glancy</title>
    <meta
        name="description"
        content="Brendan Glancy - Experienced Software Developer and System Administrator specializing in full-stack web development, cybersecurity, and IT solutions."
    />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="brendanglancy.com" />
    <meta property="twitter:url" content="https://brendanglancy.com" />
    <meta
        name="twitter:title"
        content="Brendan Glancy | Software Developer & System Administrator"
    />
    <meta
        name="twitter:description"
        content="Explore Brendan Glancy's portfolio, featuring expertise in software development, cybersecurity, and IT administration. Check out his projects, including the emoji matching game, eMatchi."
    />
    <meta name="twitter:image" content="https://brendanglancy.com/og.png" />

    <meta
        property="og:title"
        content="Brendan Glancy | Software Developer & System Administrator"
    />
    <meta
        property="og:description"
        content="Discover Brendan Glancy's work in software development, IT administration, and cybersecurity. Learn about his projects and professional experience."
    />
    <meta property="og:image" content="https://brendanglancy.com/og.png" />
    <meta property="og:url" content="https://brendanglancy.com" />
    <meta property="og:type" content="website" />
</svelte:head>

<Navbar />
<Hero />
<Github id="projects" />
<Footer />
