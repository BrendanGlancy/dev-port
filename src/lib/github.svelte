<script>
    import { onMount } from "svelte";

    let repos = [];
    let contributions = [];
    let errorMessage = "";

    async function fetchGithub() {
        let username = "brendanglancy";
        const apiUrl = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            console.log("Response:", response); // Debug the response

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            repos = data
                .map((repo) => ({
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    stars: repo.stargazers_count,
                }))
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 3);
        } catch (error) {
            errorMessage = "Failed to fetch repositories.";
        }
    }

    async function fetchContributions() {
        let username = "brendanglancy";
        const apiContributions = `https://api.github.com/users/${username}/events/public`;

        try {
            const response = await fetch(apiContributions, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            contributions = data
                .filter((event) =>
                    ["PushEvent", "PullRequestEvent", "IssueEvent"].includes(
                        event.type,
                    ),
                )
                .map((event) => ({
                    type: event.type,
                    repo: event.repo.name,
                    date: event.created_at,
                }))
                .slice(0, 9);
        } catch (error) {
            errorMessage = "Failed to fetch contributions";
            console.error("fetch failed: ", error);
        }
    }

    onMount(() => {
        fetchGithub();
        fetchContributions();
    });
</script>

<section>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if repos.length === 0}
        <p>Loading repositories...</p>
    {:else}
        <div class="container">
            <header>
                <h2>Recent Projects</h2>
            </header>
            <ul class="projects">
                {#each repos as repo}
                    <li class="project">
                        <div class="project-header">
                            <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <strong>{repo.name}</strong>
                            </a>
                            <p class="repo-url">{repo.homepage || repo.url}</p>
                        </div>
                        <p class="description">
                            {repo.description || "No description available."}
                        </p>
                        <div class="tags">
                            <span>⭐ {repo.stars}</span>
                            <span>🔗 {repo.forks}</span>
                        </div>
                        <div class="footer">
                            <span>Last updated: {repo.updated_at}</span>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="container contributions">
            <header>
                <h2>Recent Contributions</h2>
            </header>
            {#if contributions.length > 0}
                <ul class="projects">
                    {#each contributions as contribution}
                        <li class="project">
                            <div class="project-header">
                                <strong>{contribution.type}</strong>
                                <a
                                    href={`https://github.com/${contribution.repo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {contribution.repo}
                                </a>
                            </div>
                            <p class="description">
                                Date: {contribution.date}
                            </p>
                            <div class="footer">
                                <p>Type: {contribution.type}</p>
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="no-contributions">No recent contributions found.</p>
            {/if}
        </div>
    {/if}
</section>

<style>
    section {
        background-color: #08090a;
        color: #fff;
        padding: 2rem;
        text-align: center;
    }

    a {
        text-decoration: none;
        color: #00bfff;
    }

    .container {
        max-width: 1200px;
        margin: 2rem auto;
        text-align: center;
    }

    header h2 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #fff;
    }

    .projects {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .project {
        background: #1a1b1f;
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1.5rem;
        width: 300px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
        text-align: left;
    }

    .project:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    .project-header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .repo-url {
        font-size: 0.9rem;
        color: #aaa;
    }

    .description {
        font-size: 0.9rem;
        color: #ccc;
        margin: 0.5rem 0;
    }

    .tags {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        justify-content: space-between;
    }

    .footer {
        font-size: 0.8rem;
        color: #666;
        text-align: right;
    }

    .no-contributions {
        color: #ccc;
        font-size: 1rem;
    }

    .contributions-section {
        background-color: #0d1117;
        color: white;
        padding: 2rem;
        text-align: center;
    }

    .heatmap {
        display: flex;
        justify-content: center;
        gap: 2px;
    }

    .week {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .day {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: #161b22;
        transition: transform 0.2s ease-in-out;
    }

    .day:hover {
        transform: scale(1.2);
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }

    .error {
        color: red;
        font-size: 1.2rem;
    }
</style>
