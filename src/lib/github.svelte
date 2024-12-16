<script>
    import { onMount } from "svelte";

    let repos = [];
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
            console.log("Fetched Data:", data); // Debug fetched data

            repos = data
                .map((repo) => ({
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    stars: repo.stargazers_count,
                }))
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 3);
            console.log("Mapped Repos:", repos); // Debug mapped repos
        } catch (error) {
            errorMessage = "Failed to fetch repositories.";
            console.error("Fetch error:", error);
        }
    }

    onMount(() => {
        fetchGithub();
    });
</script>

<section>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if repos.length === 0}
        <p>Loading repositories...</p>
    {:else}
        <div class="container">
            <ul>
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
                                {repo.description ||
                                    "No description available."}
                            </p>
                            <p>⭐ {repo.stars}</p>
                        </li>
                    </div>
                {/each}
            </ul>
        </div>
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
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        row-gap: 1rem;
    }

    .project {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-basis: calc(100% / 2 - 1rem);
        justify-content: space-between;
        gap: 1rem;
        border: 1px solid white;
        border-radius: 1rem;
        padding: 1rem;
        overflow: hidden;
    }
</style>
