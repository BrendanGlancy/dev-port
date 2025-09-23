<script>
    (function (w) {
        var canvas, ctx;
        var mouse = {
            x: 0,
            y: 0,
            px: 0,
            py: 0,
            down: false,
        };
        // need to be a multiple of resolution
        var canvas_width = 500;
        var canvas_height = 500;
        var resolution = 10;
        var pen_size = 40;

        var num_cols = canvas_width / resolution;
        var num_row = canvas_width / resolution;
        var speck_count = 5000;

        var vec_cells = [];
        var particles = [];

        function init() {
            canvas = document.getElementById("c");
            ctx = canvas.getContext("2d");
            canvas.width = canvas_width;
            canvas.height = canvas_height;

            for (i = 0; i < speck_count; i++) {
                particles.push(
                    new particle(
                        Math.random() * canvas_width,
                        Math.random * canvas_height,
                    ),
                );
            }

            for (col = 0; col < num_cols; col++) {
                vec_cells[col] = [];

                for (row = 0; row < num_row; row++) {
                    var cell_data = new cell(
                        col * resolution,
                        row * resolution,
                        resolution,
                    );
                    vec_cells[col][row] = cell_data;

                    vec_cells[col][row].col = col;
                    vec_cells[col][row].row = row;
                }
            }

            for (col = 0; col < num_cols; col++) {
                for (row = 0; row < num_row; row++) {
                    cell_data = vec_cells[col][row];

                    var row_up = row - 1 >= 0 ? row - 1 : num_row - 1;
                    var col_left = col - 1 >= 0 ? col - 1 : num_cols - 1;
                    var col_right = col + 1 < num_cols ? col + 1 : 0;

                    // refs to the cell and row above
                    var up = vec_cells[col][row_up];
                    var left = vec_cells[col_left][row];
                    var up_left = vec_cells[col_left][row_up];
                    var up_right = vec_cells[col_right][row_up];

                    // set the current cells up, left, up_left, and up_right attributes to the neighboring cells
                    cell_data.up = up;
                    cell_data.left = left;
                    cell_data.up_left = up_left;
                    cell_data.up_right = up_right;

                    // Set the neighboring cell's opposite attributes to point to the current cell
                    up.down = vec_cells[col][row];
                    left.right = vec_cells[col][row];
                    up_left.down_right = vec_cells[col][row];
                    up_right.down_right = vec_cells[col][row];
                }
            }

            w.addEventListener("mousedown", mouse_down_handler);
            w.addEventListener("touchstart", touch_start_handler);

            w.addEventListener("mouseup", mouse_up_handler);
            w.addEventListener("touchend", touch_end_handler);

            w.addEventListener("mousemove", mouse_move_handler);
            w.addEventListener("touchmove", touch_move_handler);

            w.onload = draw;
        }

        function update_particle() {
            for (i = 0; i < particle.length; i++) {
                var p = particles[i];

                if (
                    p.x >= 0 &&
                    p.x < canvas_width &&
                    p.y >= 0 &&
                    p.y < canvas_height
                ) {
                    var col = parseInt(p.x / resolution);
                    var row = parseInt(p.y / resolution);
                    var cell_data = vec_cells[col][row];

                    // These values are percentages, distance across the cell a particle is positioned
                    var ax = (p.x % resolution) / resolution;
                    var ay = (p.y % resolution) / resolution;

                    /*
                        eg: 100% - 75% = 25%,
                        multiply that value by the cells velocity,
                        then by 0.05 to greatly reduce the overall change in velocity
                        then add that value to the particles velocity in each axis

                        this is done so that the change is velocity is incrementatlly made as the particle reaches the end of it's path across the cell
                    */
                    p.xv += (1 - ax) * cell_data.xv * 0.05;
                    p.yv += (1 - ay) * cell_data.yv * 0.05;

                    p.xv += (1 - ax) * cell_data.right.xv * 0.05;
                    p.yv += (1 - ay) * cell_data.right.yv * 0.05;

                    p.xv += (1 - ax) * cell_data.down.xv * 0.05;
                    p.yv += (1 - ay) * cell_data.down.yv * 0.05;

                    p.x += p.xv;
                    p.y += p.yv;

                    // distance between old position of particle and its new position
                    var dx = p.px - p.x;
                    var dy = p.py - p.y;

                    // a^2 + b^2 = c^2
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var limit = Math.random() * 0.5;

                    if (dist > limit) {
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.px, p.py);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);

                        /*
                         draw a line from the particles current coordindates to the same coords
                         creates a shimmering effect while the particles aren't moving
                        */
                        ctx.lineTo(p.x + limit, p.y + limit);
                        ctx.stroke();
                    }

                    // update the prev x and y coords to new ones for next loop
                    p.px = p.x;
                    p.py = p.y
                } else {
                    // if the particles x and y are out of bonds
                    p.x = p.px = Math.random() * canvas_width;
                    p.y = p.py = Math.random() * canvas_height;

                    p.xv = 0;
                    p.yv = 0;
                }

                p.xv *= 0.5;
                p.yv *= 0.5;
            }
        }
    })();

    // ego
    let mouseEntered = $state(false);

    let bench = $state(425);
    let weight = $state(210);
    let heightIn = $state(72);
    let credit = $state(795);

    function handleEnter() {
        mouseEntered = true;
        bench += 15;
        weight += 15;
        heightIn += 1;
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

<div class="hero-container" class:entered={mouseEntered}>
    <main id="hero">
        <canvas id="c"></canvas>
        <h2>Brendan Glancy</h2>
    </main>
    <div
        class="stats-grid"
        class:entered={mouseEntered}
        onmouseenter={handleEnter}
        onmouseleave={handleLeave}
        role="table"
    >
        <div class="stat">
            <span class="label">Bench</span>
            <span class="value">{bench} Lbs</span>
        </div>
        <div class="stat">
            <span class="label">Weight</span>
            <span class="value">{weight} Lbs</span>
        </div>
        <div class="stat">
            <span class="label">Height</span>
            <span class="value">{fmtHeight(heightIn)}</span>
        </div>
        <div class="stat">
            <span class="label">Credit</span>
            <span class="value">{credit}</span>
        </div>
    </div>
</div>

<style>
    .hero-container {
        background: black;
        position: relative;
        overflow: hidden;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(50vh);
        position: relative;
    }

    canvas {
        position: absolute;
        margin: auto;
        width: 500px;
        height: 500px;
        pointer-events: none;
        border: 2px solid white;
    }

    .hero-container.entered {
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

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        justify-content: center;
        align-items: center;
        color: black;
    }

    .stats-grid.entered {
        color: #bfbfbf;
    }

    .stat {
        padding: 1rem 1.5rem;
        text-align: center;
    }

    .label {
        display: block;
        font-size: 0.9rem;
        color: #aaa;
    }

    .value {
        font-size: 1.5rem;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 1.5rem; /* Smaller font size for mobile */
            text-align: center;
        }
    }
</style>
