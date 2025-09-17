<script>
    let mouseEntered = false;
</script>

<main id="hero" class:entered={mouseEntered}>
    <h2>Brendan Glancy</h2>
    <table
        class:entered={mouseEntered}
        on:mouseenter={() => (mouseEntered = true)}
        on:mouseleave={() => (mouseEntered = false)}
    >
        <thead>
            <tr class:entered={mouseEntered}>
                <th>Bench</th>
            </tr>
        </thead>
        <tbody>
            <tr class:entered={mouseEntered}>
                <td>425 Lbs</td>
            </tr>
        </tbody>
    </table>
</main>

<style>
    main {
        background: linear-gradient(27deg, #2b2b2b, black, black);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(50vh);
    }

    main.entered {
        background:
            url("/physique.png") no-repeat center center,
            radial-gradient(circle, #313136, black, black);
        background-size: contain, cover;
        background-blend-mode: normal;
    }

    h2 {
        color: #bfbfbf;
        font-size: 3rem;
        margin: 0;
    }

    table {
        margin: 1rem 0;
        padding: 0.5rem;
    }

    table.entered {
        color: #bfbfbf;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 1.5rem; /* Smaller font size for mobile */
            text-align: center;
        }
    }
</style>
