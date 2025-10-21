<script>
    import { onMount } from "svelte";
    /**
      1. var scroll_yv = (scroll.y - scroll.py) * 0.5;
        - The 0.5 multiplier dampens the scroll velocity
        - Increase this to make water move faster (e.g., 1.0 or 2.0)
        - Decrease this to make it slower (e.g., 0.2 or 0.3)
      2. if (Math.abs(scroll_yv) > 0.01)
        - The 0.01 threshold determines how sensitive it is to small scrolls
        - Lower this to respond to gentler scrolling
      3. The wave offset multiplier * 0.5
        - Controls the horizontal wave intensity
        - Increase for more dramatic side-to-side motion
      4. cell_data.xv *= 0.99; cell_data.yv *= 0.99;
        - These are the existing velocity decay values
        - They make the water slow down over time
        - Lower values (e.g., 0.95) = faster slowdown
        - Higher values (e.g., 0.995) = water flows longer
     */

    var canvas, ctx, container;
    var mouse = {
        x: 0,
        y: 0,
        px: 0,
        py: 0,
        down: false,
    };
    var scroll = {
        y: 0,
        py: 0,
    };
    // need to be a multiple of resolution
    var canvas_width = 500;
    var canvas_height = 500;
    var resolution = 20;
    var pen_size = 50;

    var num_cols = 0;
    var num_rows = 0;
    var speck_count = 1000;

    var vec_cells = [];
    var particles = [];

    function initalizeGrid() {
        vec_cells = [];
        particles = [];

        num_cols = Math.floor(canvas_width / resolution);
        num_rows = Math.floor(canvas_height / resolution);

        for (let i = 0; i < speck_count; i++) {
            particles.push(
                new particle(
                    Math.random() * canvas_width,
                    Math.random() * canvas_height,
                ),
            );
        }

        for (let col = 0; col < num_cols; col++) {
            vec_cells[col] = [];

            for (let row = 0; row < num_rows; row++) {
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

        for (let col = 0; col < num_cols; col++) {
            for (let row = 0; row < num_rows; row++) {
                cell_data = vec_cells[col][row];

                var row_up = row - 1 >= 0 ? row - 1 : num_rows - 1;
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
                up_right.down_left = vec_cells[col][row];
            }
        }
    }

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas_width = rect.width;
        canvas_height = rect.height;

        canvas.width = canvas_width;
        canvas.height = canvas_height;

        initalizeGrid();
    }

    function init() {
        canvas = document.getElementById("c");
        container = document.querySelector(".hero-container");
        ctx = canvas.getContext("2d");

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);

        window.addEventListener("mousedown", mouse_down_handler);
        window.addEventListener("touchstart", touch_start_handler);

        window.addEventListener("mouseup", mouse_up_handler);
        window.addEventListener("touchend", touch_end_handler);

        window.addEventListener("mousemove", mouse_move_handler);
        window.addEventListener("touchmove", touch_move_handler);

        window.addEventListener("scroll", scroll_handler);

        requestAnimationFrame(draw);
    }

    function update_particle() {
        for (let i = 0; i < particles.length; i++) {
            var p = particles[i];

            if (
                p.x >= 0 &&
                p.x < canvas_width &&
                p.y >= 0 &&
                p.y < canvas_height
            ) {
                var col = parseInt(p.x / resolution);
                var row = parseInt(p.y / resolution);

                col = Math.min(col, num_cols - 1);
                row = Math.min(row, num_rows - 1);

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
                p.py = p.y;
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

    function draw() {
        var mouse_xv = mouse.x - mouse.px;
        var mouse_yv = mouse.y - mouse.py;
        var scroll_yv = (scroll.y - scroll.py) * 0.19;

        for (let i = 0; i < vec_cells.length; i++) {
            var cell_datas = vec_cells[i];
            for (let j = 0; j < cell_datas.length; j++) {
                var cell_data = cell_datas[j];
                if (mouse.down) {
                    change_cell_velocity(
                        cell_data,
                        mouse_xv,
                        mouse_yv,
                        pen_size,
                    );
                }

                // Apply scroll velocity to create wave effect
                if (Math.abs(scroll_yv) > 0.01) {
                    // Create horizontal wave pattern based on cell position
                    var wave_offset = Math.sin((cell_data.x / canvas_width) * Math.PI * 2 + scroll.y * 0.01) * 0.5;
                    cell_data.xv += wave_offset * scroll_yv;
                    cell_data.yv += scroll_yv;
                }

                update_pressure(cell_data);
            }
        }

        // clears the canvas every time a new frame is drawn so the particles can move
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#98b1eb";
        update_particle();

        // updates the cell velocity for every cell
        for (let i = 0; i < vec_cells.length; i++) {
            cell_datas = vec_cells[i];

            for (let j = 0; j < cell_datas.length; j++) {
                cell_data = cell_datas[j];
                update_velocity(cell_data);
            }
        }

        mouse.px = mouse.x;
        mouse.py = mouse.y;
        scroll.py = scroll.y;

        requestAnimationFrame(draw);
    }

    function change_cell_velocity(cell_data, mvelX, mvelY, pen_size) {
        var dx = cell_data.x - mouse.x;
        var dy = cell_data.y - mouse.y;
        var dist = Math.sqrt(dy * dy + dx * dx);

        // if the distance is less than the radius..
        if (dist < pen_size) {
            // if the distance is very small, set it to pen_size
            if (dist < 4) {
                dist = pen_size;
            }

            var power = pen_size / dist;
            cell_data.xv += mvelX * power;
            cell_data.yv += mvelY * power;
        }
    }

    function update_pressure(cell_data) {
        // calculates the collective pressure on the X axis by summing the surrounding velocities
        var pressure_x =
            cell_data.up_left.xv * 0.5 + // divide in half because it's diagonal
            cell_data.left.xv +
            cell_data.down_left.xv * 0.5 -
            cell_data.up_right.xv * 0.5 -
            cell_data.right.xv -
            cell_data.down_right.xv * 0.5;

        var pressure_y =
            cell_data.up_left.yv * 0.5 + // divide in half because it's diagonal
            cell_data.up.yv +
            cell_data.up_right.yv * 0.5 -
            cell_data.down_left.yv * 0.5 -
            cell_data.down.yv -
            cell_data.down_right.yv * 0.5;

        cell_data.pressure = (pressure_x + pressure_y) * 0.25;
    }

    function update_velocity(cell_data) {
        cell_data.xv +=
            (cell_data.up_left.pressure * 0.5 +
                cell_data.left.pressure +
                cell_data.down_left.pressure * 0.5 -
                cell_data.up_right.pressure * 0.5 -
                cell_data.right.pressure -
                cell_data.down_right.pressure * 0.5) *
            0.25;

        cell_data.yv +=
            (cell_data.up_left.pressure * 0.5 +
                cell_data.up.pressure +
                cell_data.up_right.pressure * 0.5 -
                cell_data.down_left.pressure * 0.5 -
                cell_data.down.pressure -
                cell_data.down_right.pressure * 0.5) *
            0.25;

        // this slowly decreases the cell's velocity over time so that the fluid stops it it's left alone
        cell_data.xv *= 0.99;
        cell_data.yv *= 0.99;
    }

    function cell(x, y, res) {
        this.x = x;
        this.y = y;

        this.r = res;

        this.col = 0;
        this.row = 0;

        this.xv = 0;
        this.yv = 0;

        this.pressure = 0;
    }

    function particle(x, y) {
        this.x = this.px = x;
        this.y = this.py = y;
        this.xv = this.yv = 0;
    }

    function mouse_down_handler(e) {
        e.preventDefault();
        mouse.down = true;
    }

    function mouse_up_handler(e) {
        mouse.down = false;
    }

    function touch_start_handler(e) {
        e.preventDefault();
        var rect = canvas.getBoundingClientRect();
        mouse.x = mouse.px = e.touches[0].pageX - rect.left; // set both previous and current coordinates
        mouse.y = mouse.py = e.touches[0].pageY - rect.top;
        mouse.down = true;
    }

    function touch_end_handler(e) {
        if (!e.touches) mouse.down = false;
    }

    function mouse_move_handler(e) {
        e.preventDefault();
        mouse.px = mouse.x;
        mouse.py = mouse.y;

        mouse.x = e.offsetX || e.layerX;
        mouse.y = e.offsetY || e.layerY;
    }

    function touch_move_handler(e) {
        e.preventDefault();
        mouse.px = mouse.x;
        mouse.py = mouse.y;

        var rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].pageX - rect.left;
        mouse.y = e.touches[0].pageY - rect.top;
    }

    function scroll_handler(e) {
        scroll.py = scroll.y;
        scroll.y = window.scrollY || window.pageYOffset;
    }

    onMount(() => {
        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;

        window.Fluid = {
            initalize: init,
        };

        Fluid.initalize();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("scroll", scroll_handler);
        };
    });
</script>

<div class="hero-container">
    <canvas id="c"></canvas>
    <h2 id="hero">Brendan Glancy</h2>
</div>

<style>
    .hero-container {
        background: black;
        position: relative;
        overflow: hidden;
        height: 100vh;
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    h2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        color: white;
        font-size: 3rem;
        margin: 0;
        pointer-events: none; /* Allows mouse interactions to pass through to canvas */
    }
</style>
