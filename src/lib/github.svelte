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
                .slice(0, 4);
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
                }));
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
        <ul class="container">
            {#each repos as repo}
                <div class="project">
                    <li>
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <strong>{repo.name}</strong>
                        </a>
                        <p>
                            {repo.description || "No description available."}
                        </p>
                        <p>⭐ {repo.stars}</p>
                    </li>
                </div>
            {/each}
        </ul>

        {#if contributions.length > 0}
            <ul class="container">
                {#each contributions as contribution}
                    <div class="project">
                        <li>
                            <strong>{contribution.type}</strong> in
                            <a
                                href={`https://github.com/${contribution.repo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {contribution.repo}
                            </a>
                            <p>Date: {contribution.date}</p>
                            <p>Type: {contribution.type}</p>
                        </li>
                    </div>
                {/each}
            </ul>
        {:else}
            <p>No recent contributions found.</p>
        {/if}
    {/if}
</section>

<style>
    section {
        background-color: #08090a;
        color: #fff;
        overflow: hidden;
    }

    a {
        text-decoration: none;
    }

    .container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        list-style: none;
        padding: 10vw;
    }

    .project {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
        width: 25vw;
        border: 1px solid white;
        border-radius: 1rem;
        padding: 1rem;
        overflow: hidden;
    }
</style>
