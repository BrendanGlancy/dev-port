<script>
    import { pipeline } from "$lib/data.js";
</script>

<section id="pipeline" class="section">
    <h2 class="section-title"><span class="num">03.</span> AI-assisted workflow</h2>
    <p class="lede">{pipeline.intro}</p>

    <ol class="stages">
        {#each pipeline.stages as stage, i}
            <li>
                <span class="step">{String(i + 1).padStart(2, "0")}</span>
                <h3>{stage.name}</h3>
                <p>{stage.desc}</p>
            </li>
        {/each}
    </ol>

    <ul class="principles">
        {#each pipeline.principles as p}
            <li>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
            </li>
        {/each}
    </ul>
</section>

<style>
    .lede {
        color: var(--muted);
        font-size: 1.05rem;
        max-width: 65ch;
        margin-bottom: 2.5rem;
    }

    .stages {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
    }

    .stages li {
        padding: 1.2rem 1.1rem;
        border: 1px solid var(--line);
        border-top: 2px solid var(--accent);
        border-radius: 12px;
        background: var(--bg-card);
    }

    .step {
        font-family: var(--mono);
        font-size: 0.75rem;
        color: var(--accent);
    }

    h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0.3rem 0 0.4rem;
    }

    .stages p {
        color: var(--muted);
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .principles {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
        gap: 1.5rem;
        margin-top: 2.5rem;
    }

    .principles li {
        border-left: 2px solid var(--accent);
        padding-left: 1rem;
    }

    h4 {
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
    }

    .principles p {
        color: var(--muted);
        font-size: 0.9rem;
    }

    @media (max-width: 900px) {
        .stages {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 520px) {
        .stages {
            grid-template-columns: 1fr;
        }
    }
</style>
