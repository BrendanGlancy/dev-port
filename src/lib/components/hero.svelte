<script>
    let mouseEntered = false;

    let bench = 425;
    let weight = 210;
    let heightIn = 72;
    let credit = 800;

    function handleEnter() {
        mouseEntered = true;
        bench += 10;
        weight += 5;
        height += 1;
        credit += 10;
    }

    function handleLeave() {
        mouseEntered = false;
    }

    const fmtHeight = (inches) => {
        const ft = Math.floor(inches / 12);
        const inch = inches % 12;
        return `${ft}'${inch}`;
    };
</script>

<main id="hero" class:entered={mouseEntered}>
    <h2>Brendan Glancy</h2>
    <table
        class:entered={mouseEntered}
        on:mouseenter={handleEnter}
        on:mouseleave={handleLeave}
    >
        <thead>
            <tr>
                <th>Bench</th>
            </tr>
            <tr>
                <th>Weight</th>
            </tr>
            <tr>
                <th>Height</th>
            </tr>
            <tr>
                <th>Credit Score</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{bench} Lbs</td>
            </tr>
            <tr>
                <td>{weight} Lbs</td>
            </tr>
            <tr>
                <td>{fmtHeight(heightIn)}</td>
            </tr>
            <tr>
                <td>{credit}</td>
            </tr>
        </tbody>
    </table>
</main>

<style>
    main {
        background: black;
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
