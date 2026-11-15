<script>
    import { experience } from "$lib/data.js";
</script>

<section id="experience" class="section">
    <h2 class="section-title"><span class="num">02.</span> Experience</h2>
    <ol class="timeline">
        {#each experience as job}
            <li>
                <div class="when">{job.date}</div>
                <div class="what">
                    <h3>{job.role} <span>@ {job.company}</span></h3>
                    <p>{job.summary}</p>
                    <ul>
                        {#each job.tags as tag}
                            <li class="chip">{tag}</li>
                        {/each}
                    </ul>
                </div>
            </li>
        {/each}
    </ol>
</section>

<style>
    .timeline {
        list-style: none;
        border-left: 1px solid var(--line-strong);
        margin-left: 0.4rem;
    }

    .timeline > li {
        position: relative;
        display: grid;
        grid-template-columns: 11rem 1fr;
        gap: 1.5rem;
        padding: 0 0 2.75rem 2rem;
    }

    .timeline > li::before {
        content: "";
        position: absolute;
        left: -6px;
        top: 0.45rem;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--bg);
        border: 2px solid var(--accent);
    }

    .timeline > li:first-child::before {
        background: var(--accent);
        box-shadow: 0 0 12px var(--accent);
    }

    .when {
        font-family: var(--mono);
        font-size: 0.85rem;
        color: var(--subtle);
        padding-top: 0.15rem;
    }

    h3 {
        font-size: 1.15rem;
        font-weight: 600;
    }

    h3 span {
        color: var(--accent);
        font-weight: 500;
    }

    p {
        color: var(--muted);
        margin: 0.5rem 0 0.9rem;
        max-width: 65ch;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        list-style: none;
    }

    @media (max-width: 720px) {
        .timeline > li {
            grid-template-columns: 1fr;
            gap: 0.3rem;
            padding-left: 1.5rem;
        }
    }
</style>
