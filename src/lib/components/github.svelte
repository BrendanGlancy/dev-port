<script>
    import { onMount } from "svelte";

    import Fa from "svelte-fa";
    import { faStar, faCodeFork } from "@fortawesome/free-solid-svg-icons";

    let repos = [];
    let userData = [];
    let contributions = [];
    let errorMessage = "";

    async function fetchUserData() {
        let username = "brendanglancy";
        const apiUrl = `https://api.github.com/users/${username}`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            userData = await response.json();
        } catch (error) {
            errorMessage = "Failed to fetch profile";
        }
    }

    async function fetchGithub() {
        let username = "brendanglancy";
        const apiUrl = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

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
                    forks: repo.forks_count,
                    date: repo.pushed_at,
                    language: repo.language,
                }))
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 3);
        } catch (error) {
            errorMessage = "Failed to fetch repositories.";

            console.error("fetch failed: ", error);
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
        fetchUserData();
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
        <div class="header-container">
            <header>
                <h2>Recent Projects</h2>
                <div class="profile">
                    <img src={userData.avatar_url} alt="Profile" />
                    <div class="user">
                        {userData.login}
                        <a
                            href="https://github.com/brendanglancy"
                            target="_blank">https://github.com/brendanglancy</a
                        >
                    </div>
                </div>
            </header>
        </div>
        <div class="container">
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
                            <span>
                                {repo.language}
                            </span>
                            <span>
                                <Fa icon={faStar} />
                                {repo.stars}
                            </span>
                            <span>
                                <Fa icon={faCodeFork} />
                                {repo.forks}
                            </span>
                        </div>
                        <div class="footer">
                            <span>Last updated: {repo.date}</span>
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
        background: radial-gradient(circle, #0e1311, #0d1117, #000);
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
        font-size: 18px;
        margin-bottom: 1rem;
        color: #bfbfbf;
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

    header {
        max-width: 1200px;
        margin: auto;
        text-align: left;

        .user {
            display: flex;
            flex-direction: column;
        }
    }

    .profile {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .profile img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        margin: 10px;
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
        color: #888889;
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

    .error {
        color: red;
        font-size: 1.2rem;
    }
</style>
