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
            const rustscanRepos = [rustscanData].map((repo) => ({
                name: repo.name,
                url: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language,
            }));

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
                url: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language,
            }));

            repos = [...rustscanRepos, ...personalRepos]
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 4);
        } catch (error) {
            errorMessage = `Failed to fetch repositories: ${error.message}`;
            console.error(error);
        }
    }

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
        <h2>Open Projects</h2>
        <div class="header-container">
            <header>
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
                        </div>
                        <div class="tags">
                            <span>
                                {repo.language}
                            </span>
                            <span>
                                <Fa icon={faStar} />
                                {repo.stars}
                            </span>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <h2>NDA'd projects</h2>
        <div class="container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Software Developer</td>
                        <td>LSI</td>
                        <td
                            >Work with Webos, Tizen, etc... to develop a media
                            player</td
                        >
                    </tr>
                    <tr>
                        <td>System Administrator</td>
                        <td>Tekanha</td>
                        <td
                            >Deal with high pressure situations with the goal of
                            keeping production systems up</td
                        >
                    </tr>
                    <tr>
                        <td>Software Developer</td>
                        <td>OVS</td>
                        <td
                            >Create a web presence and portal for a small
                            growing company</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
    {/if}
</section>

<style>
    section {
        background-color: black;
        background: radial-gradient(circle, #121212, black);
        color: #e3e2e1;
        padding: 2rem;
        text-align: center;
        min-height: 40vh;
    }

    a {
        text-decoration: none;
        color: #00bfff;
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

    .container {
        max-width: 1200px;
        margin: 4rem auto;
        text-align: center;
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
        padding: 2rem;
        width: 400px;
        border-radius: 3px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.5rem;
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

    .tags {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        justify-content: space-between;
        color: #888889;
    }

    .error {
        color: red;
        font-size: 1.2rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid #e3e2e1;
    }
</style>
