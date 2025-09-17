<script>
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import {
        faStar,
        faCodeFork,
        faUpRightFromSquare,
    } from "@fortawesome/free-solid-svg-icons";
    import { faGithub } from "@fortawesome/free-brands-svg-icons";

    let data = [];
    let errorMessage = "";

    async function fetchRepoData() {
        const apiUrl = `https://api.github.com/repos/BrendanGlancy/dev-port`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            data = await response.json();
        } catch (error) {
            errorMessage = "Failed to fetch profile";
            console.log(error);
        }
    }

    onMount(() => {
        fetchRepoData();
    });
</script>

<section>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else}
        <h2>Shoutouts</h2>
        <footer class="footer-container">
            <div class="footer-section">
                <h3>
                    <a
                        href="https://coontzy1.github.io/"
                        target="_blank"
                        rel="noopener"
                        ><strong>Austin Coontz</strong>
                    </a>
                </h3>
            </div>
            <div class="footer-section">
                <h3>
                    <a
                        href="https://ethantomford.com/"
                        target="_blank"
                        rel="noopener"
                        ><strong>Ethan Tomford</strong>
                    </a>
                </h3>
            </div>
            <div class="footer-section">
                <h3>
                    <a href="https://github.com/BrendanGlancy">GitHub</a>
                </h3>
            </div>
        </footer>
    {/if}
</section>

<style>
    h2 {
        display: flex;
        justify-content: center;
        padding: 4rem 0.5rem 0.5rem 0.5rem;
        margin: 0;
        color: #8b949e;
        background: black;
    }

    .footer-container {
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        background: black;
        color: #c9d1d9;
        font-family: sans-serif;
    }

    a {
        color: #8b949e;
        text-decoration: none;
    }

    .footer-section {
        flex: 1 1 25%;
        margin: 1.5rem;
        padding: 1.5rem;
    }

    .footer-section h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    /* Mobile Styling */
    @media (max-width: 768px) {
        .footer-container {
            flex-direction: column;
            padding: 1rem;
        }

        .footer-section {
            flex: 1 1 100%;
            margin: 1rem 0;
            padding: 1rem;
        }

        .footer-section h3 {
            font-size: 1rem;
        }
    }
</style>
