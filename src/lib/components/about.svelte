<script>
    import { about, security, profile } from "$lib/data.js";
</script>

<section id="about" class="section">
    <h2 class="section-title"><span class="num">01.</span> About</h2>
    <div class="grid">
        <div class="bio">
            {#each about as para}
                <p>{para}</p>
            {/each}
        </div>
        <aside class="card">
            <img
                src="https://github.com/{profile.githubUser}.png?size=240"
                alt="Portrait of {profile.name}"
                width="96"
                height="96"
                loading="lazy"
            />
            <dl>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
                <dt>Education</dt>
                <dd>B.S. Computer Information Systems, University of Akron</dd>
                <dt>Also</dt>
                <dd>Tech Elevator full-stack bootcamp (1,000+ hrs)</dd>
            </dl>
        </aside>
    </div>

    <div class="sec">
        <h3>Security &amp; CTFs</h3>
        <div class="stats">
            {#each security as s}
                {#if s.link}
                    <a class="stat" href={s.link} target="_blank" rel="noopener">
                        <strong>{s.stat}</strong><span>{s.label}</span>
                    </a>
                {:else}
                    <div class="stat"><strong>{s.stat}</strong><span>{s.label}</span></div>
                {/if}
            {/each}
        </div>
    </div>
</section>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 3rem;
        align-items: center;
    }

    .bio p {
        color: var(--fg);
        font-size: clamp(1.2rem, 2.2vw, 1.5rem);
        line-height: 1.6;
        letter-spacing: -0.01em;
        max-width: 34ch;
    }

    .card {
        background: var(--bg-card);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.5rem;
    }

    .card img {
        border-radius: 50%;
        border: 2px solid var(--accent);
        margin-bottom: 1rem;
    }

    dt {
        font-family: var(--mono);
        font-size: 0.75rem;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-top: 0.8rem;
    }

    dd {
        color: var(--fg);
        font-size: 0.95rem;
    }

    h3 {
        font-size: 0.85rem;
        font-family: var(--mono);
        font-weight: 500;
        color: var(--subtle);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.8rem;
    }

    .sec {
        margin-top: 3.5rem;
    }

    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1.25rem;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--bg-raised);
        text-decoration: none;
        transition: border-color 0.2s;
    }

    a.stat:hover {
        border-color: var(--accent);
    }

    .stat strong {
        font-size: 1.5rem;
        color: var(--accent);
    }

    .stat span {
        color: var(--muted);
        font-size: 0.9rem;
    }

    @media (max-width: 820px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
