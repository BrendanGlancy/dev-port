<script>
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import { faStar, faCodeFork } from "@fortawesome/free-solid-svg-icons";

    import Loading from "$lib/components/loading.svelte";

    let repos = [];
    let userData = {};
    let contributions = [];
    let errorMessage = "";

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    // Fetch GitHub User Data
    async function fetchUserData() {
        const username = "brendanglancy";
        const apiUrl = `https://api.github.com/users/${username}`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            userData = await response.json();
        } catch (error) {
            errorMessage = `Failed to fetch user profile: ${error.message}`;
            console.error(error);
        }
    }

    async function fetchGithub() {
        const username = "brendanglancy";
        const apiUrl = `https://api.github.com/users/${username}/repos`;
        const apiRustscan = `https://api.github.com/repos/bee-san/RustScan`;

        try {
            // Fetch RustScan repositories
            const responseRustscan = await fetch(apiRustscan, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!responseRustscan.ok) {
                throw new Error(
                    `Error fetching RustScan repos: ${responseRustscan.status}`,
                );
            }

            const rustscanData = await responseRustscan.json();

            const rustscanRepos = [rustscanData]
                .map((repo) => ({
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    date: repo.pushed_at,
                    language: repo.language,
                }));

            // Fetch personal repositories
            const responsePersonal = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!responsePersonal.ok) {
                throw new Error(
                    `Error fetching personal repos: ${responsePersonal.status}`,
                );
            }

            const personalData = await responsePersonal.json();

            const personalRepos = personalData.map((repo) => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                date: repo.pushed_at,
                language: repo.language,
            }));

            console.log(rustscanRepos);
            // Combine and sort both repository lists
            repos = [...rustscanRepos, ...personalRepos]
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 4);
        } catch (error) {
            errorMessage = `Failed to fetch repositories: ${error.message}`;
            console.error(error);
        }
    }

    // Fetch All Data on Mount
    onMount(() => {
        fetchUserData();
        fetchGithub();
    });
</script>

<section id="projects">
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if repos.length === 0}
        <Loading />
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
                            <span>Last updated: {formatDate(repo.date)}</span>
                        </div>
                    </li>
                {/each}
            </ul>
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
        padding: 2rem;
        width: 400px;
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

    .error {
        color: red;
        font-size: 1.2rem;
    }
</style>
