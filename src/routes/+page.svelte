<script>
    import Navbar from "$lib/components/navbar.svelte";
    import Hero from "$lib/components/hero.svelte";
    import About from "$lib/components/about.svelte";
    import Experience from "$lib/components/experience.svelte";
    import Pipeline from "$lib/components/pipeline.svelte";
    import Github from "$lib/components/github.svelte";
    import Footer from "$lib/components/footer.svelte";
    import { profile } from "$lib/data.js";

    import "../styles.css";

    const title = `${profile.name} | ${profile.role}`;
    const description =
        "Brendan Glancy is a software engineer in Ohio working across full-stack web, systems programming in C and Rust, and security. Open-source contributor to RustScan and developer-portfolio.";
    const image = `https://github.com/${profile.githubUser}.png?size=600`;
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="theme-color" content="#000000" />
    <link rel="canonical" href="https://brendanglancy.com/" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://brendanglancy.com/" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    {@html `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.role,
        url: "https://brendanglancy.com/",
        sameAs: [profile.github, profile.linkedin],
        alumniOf: "The University of Akron",
    })}</script>`}
</svelte:head>

<Navbar />
<main>
    <Hero />
    <About />
    <Experience />
    <Pipeline />
    <Github />
</main>
<Footer />
