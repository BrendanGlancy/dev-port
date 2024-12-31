<script>
    import { games } from "./games";
    import "../../games.css";
</script>

<svelte:head>
    <title>Cool Math Games</title>
</svelte:head>

<div class="arcade">
    <header>
        <h1>Arcade</h1>
        <p>Play Games in your browser</p>
    </header>
    <div class="game-container">
        {#each games as game}
            <a href={game.link}>
                <div class="game">
                    <p>{game.label}</p>
                </div>
            </a>
        {/each}
    </div>
</div>

<style>
    .game-container {
        display: flex;
        flex-direction: row;
        font-size: min(1vmin, 0.5em);
        justify-content: center;
        gap: 2em;
    }

    .game {
        display: grid;
        width: 40em;
        aspect-ratio: 1;
        border-radius: 2em;
        background: var(--bg-4);
    }

    .game p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 4em;
        font-family: grandstander;
    }

    a {
        text-decoration: none;
        color: #fff;
    }

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: grandstander;
        padding: 2em;
    }
</style>
