<script>
    import Fa from "svelte-fa";
    import { faEnvelope, faFileLines } from "@fortawesome/free-solid-svg-icons";
    import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
    import { profile, shoutouts } from "$lib/data.js";

    const year = new Date().getFullYear();
</script>

<section id="contact" class="section contact">
    <h2 class="section-title"><span class="num">05.</span> Contact</h2>
    <div class="cta">
        <p class="big">Have a role, a project, or a CTF team that needs another player?</p>
        <p>My inbox is open. I usually reply within a day or two.</p>
        <a class="btn primary" href="mailto:{profile.email}"><Fa icon={faEnvelope} /> Say hello</a>
        <div class="socials">
            <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub"><Fa icon={faGithub} size="lg" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><Fa icon={faLinkedin} size="lg" /></a>
            <a href={profile.resume} target="_blank" rel="noopener" aria-label="Résumé"><Fa icon={faFileLines} size="lg" /></a>
        </div>
    </div>
</section>

<footer>
    <p>
        Shoutouts:
        {#each shoutouts as s, i}
            <a href={s.link} target="_blank" rel="noopener">{s.name}</a>{i < shoutouts.length - 1 ? " · " : ""}
        {/each}
    </p>
    <p>
        © {year} {profile.name} · Built with SvelteKit ·
        <a href="https://github.com/BrendanGlancy/dev-port" target="_blank" rel="noopener">Source</a>
    </p>
</footer>

<style>
    .contact {
        text-align: center;
    }

    .contact .section-title {
        text-align: left;
    }

    .cta {
        max-width: 38rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .big {
        font-size: clamp(1.4rem, 3.5vw, 2rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.3;
    }

    .cta p:not(.big) {
        color: var(--muted);
        margin-bottom: 0.75rem;
    }

    .socials {
        display: flex;
        gap: 1.5rem;
        margin-top: 1.5rem;
    }

    .socials a {
        color: var(--muted);
        transition: color 0.2s, transform 0.2s;
    }

    .socials a:hover {
        color: var(--accent);
        transform: translateY(-2px);
    }

    footer {
        border-top: 1px solid var(--line);
        padding: 2rem 1.25rem;
        text-align: center;
        font-family: var(--mono);
        font-size: 0.8rem;
        color: var(--subtle);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    footer a {
        color: var(--muted);
        text-decoration: none;
    }

    footer a:hover {
        color: var(--accent);
    }
</style>
