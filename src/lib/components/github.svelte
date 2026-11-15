<script>
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import { faStar, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
    import { faGithub } from "@fortawesome/free-brands-svg-icons";
    import { featured, profile } from "$lib/data.js";

    // Live star counts, keyed by "owner/repo". The cards still render if GitHub is unreachable or rate-limited.
    let stars = $state({});

    const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

    onMount(async () => {
        const get = (url) =>
            fetch(url, { headers: { Accept: "application/vnd.github+json" } })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null);
        const repos = await Promise.all(featured.map((p) => get(`https://api.github.com/repos/${p.repo}`)));
        const next = {};
        for (const repo of repos) {
            if (repo?.full_name) next[repo.full_name.toLowerCase()] = repo.stargazers_count;
        }
        stars = next;
    });
</script>

<section id="work" class="section">
    <h2 class="section-title"><span class="num">04.</span> Open source</h2>
    <ul class="projects">
        {#each featured as p}
            {@const count = stars[p.repo.toLowerCase()]}
            <li>
                <a class="project" href={p.link} target="_blank" rel="noopener">
                    <div class="top">
                        <span class="kind">{p.kind}</span>
                        <Fa icon={faArrowUpRightFromSquare} size="sm" />
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div class="meta">
                        <span class="lang"><i data-lang={p.lang}></i>{p.lang}</span>
                        {#if count !== undefined}
                            <span><Fa icon={faStar} size="sm" /> {fmt(count)}</span>
                        {/if}
                    </div>
                </a>
            </li>
        {/each}
    </ul>
    <div class="more">
        <a class="btn" href={profile.github} target="_blank" rel="noopener">
            <Fa icon={faGithub} /> More on GitHub
        </a>
    </div>
</section>

<style>
    .projects {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
        gap: 1.25rem;
    }

    .project {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: clamp(1.25rem, 5vw, 1.6rem);
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--bg-card);
        text-decoration: none;
        transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    }

    .project:active {
        border-color: var(--accent);
    }

    /* Hover lift only on devices that really hover; on touch it would stick after a tap. */
    @media (hover: hover) {
        .project:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            box-shadow: 0 12px 40px -12px rgba(152, 177, 235, 0.25);
        }
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--subtle);
    }

    .kind {
        font-family: var(--mono);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--accent);
    }

    h3 {
        font-size: 1.3rem;
        font-weight: 700;
    }

    p {
        color: var(--muted);
        font-size: 0.95rem;
        flex: 1;
    }

    .meta {
        display: flex;
        justify-content: space-between;
        font-family: var(--mono);
        font-size: 0.8rem;
        color: var(--subtle);
    }

    .meta span {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }

    .lang i {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--subtle);
    }

    .lang i[data-lang="Rust"] { background: #dea584; }
    .lang i[data-lang="JavaScript"] { background: #f1e05a; }

    .more {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        margin-top: clamp(2rem, 6vw, 3rem);
    }
</style>
