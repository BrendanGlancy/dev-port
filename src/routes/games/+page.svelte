<script>
    import { games } from "./games";
    import "../../styles.css";
</script>

<svelte:head>
    <title>Cool Math Games</title>
</svelte:head>

<div class="game-container">
    {#each games as game}
        <a href={game.link}>
            <div class="game">
                <p>{game.label}</p>
            </div>
        </a>
    {/each}
</div>

<style>
    .game-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: min(1vmin, 0.5em);
        gap: 2em;
        height: 100%;
    }

    .game {
        display: grid;
        grid-template-columns: repeat(var(--size), 1fr);
        grid-template-rows: repeat(var(--size), 1fr);
        grid-gap: 1em;
        width: 80em;
        aspect-ratio: 1;
        perspective: 100vw;
        border-radius: 2em;
        background: var(--bg-2);
    }

    p {
        display: flex;
        justify-content: center;
        align-items: center;
        font: grandstander;
        font-size: 4em;
    }

    a {
        text-decoration: none;
        color: #ccc;
    }
</style>
