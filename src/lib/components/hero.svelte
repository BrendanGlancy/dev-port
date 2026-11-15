<script>
    import { onMount } from "svelte";
    import { profile } from "$lib/data.js";
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
        // Mobile browsers fire resize when the URL bar shows/hides; only rebuild on a real size change.
        if (rect.width === canvas_width && rect.height === canvas_height && vec_cells.length) return;
        canvas_width = rect.width;
        canvas_height = rect.height;

        // Keep particle density roughly constant instead of packing the desktop count
        // into a phone-sized canvas: ~500 on a 390x844 phone, 1000 from ~650k px² up.
        speck_count = Math.max(300, Math.min(1000, Math.round((canvas_width * canvas_height) / 650)));

        // Render at device resolution so the 1px strokes stay sharp on retina screens.
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas_width * dpr);
        canvas.height = Math.round(canvas_height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 1;

        initalizeGrid();
    }

    var raf = 0;
    var visible = true;
    var observer = null;
    var reduced_motion = false;

    function start() {
        if (raf || reduced_motion) return;
        scroll.py = scroll.y; // don't replay scrolling that happened while paused
        raf = requestAnimationFrame(draw);
    }

    function stop() {
        cancelAnimationFrame(raf);
        raf = 0;
    }

    function init() {
        canvas = document.getElementById("c");
        container = document.querySelector(".hero-container");
        ctx = canvas.getContext("2d");

        resizeCanvas();
        scroll.y = scroll.py = window.scrollY;

        window.addEventListener("resize", resizeCanvas);
        // Listen on the hero only and stay passive, so taps and page scrolling keep working on touch devices.
        container.addEventListener("mousemove", mouse_move_handler);
        container.addEventListener("mouseleave", mouse_up_handler);
        container.addEventListener("touchstart", touch_start_handler, { passive: true });
        container.addEventListener("touchmove", touch_move_handler, { passive: true });
        container.addEventListener("touchend", touch_end_handler);
        container.addEventListener("touchcancel", touch_end_handler);
        window.addEventListener("scroll", scroll_handler, { passive: true });

        if (reduced_motion) {
            // One still frame of the particle field, no animation loop.
            draw_frame();
            return;
        }

        // Only animate while the hero is on screen.
        observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            visible ? start() : stop();
        });
        observer.observe(container);
        start();
    }

    function teardown() {
        stop();
        if (observer) observer.disconnect();
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("scroll", scroll_handler);
        if (!container) return;
        container.removeEventListener("mousemove", mouse_move_handler);
        container.removeEventListener("mouseleave", mouse_up_handler);
        container.removeEventListener("touchstart", touch_start_handler);
        container.removeEventListener("touchmove", touch_move_handler);
        container.removeEventListener("touchend", touch_end_handler);
        container.removeEventListener("touchcancel", touch_end_handler);
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
                var col = Math.floor(p.x / resolution);
                var row = Math.floor(p.y / resolution);

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

                // All particles go into one path, stroked once per frame (see draw_frame).
                if (dist > limit) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.px, p.py);
                } else {
                    ctx.moveTo(p.x, p.y);

                    /*
                     draw a line from the particles current coordindates to the same coords
                     creates a shimmering effect while the particles aren't moving
                    */
                    ctx.lineTo(p.x + limit, p.y + limit);
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
            if (Math.abs(p.xv) < 1e-6) p.xv = 0;
            if (Math.abs(p.yv) < 1e-6) p.yv = 0;
        }
    }

    function draw() {
        draw_frame();
        raf = visible ? requestAnimationFrame(draw) : 0;
    }

    function draw_frame() {
        var mouse_xv = mouse.x - mouse.px;
        var mouse_yv = mouse.y - mouse.py;
        // Clamp so a fling-scroll can't blow up the simulation.
        var scroll_yv = Math.max(-8, Math.min(8, (scroll.y - scroll.py) * 0.19));

        for (let i = 0; i < vec_cells.length; i++) {
            var cell_datas = vec_cells[i];
            for (let j = 0; j < cell_datas.length; j++) {
                var cell_data = cell_datas[j];
                // A stationary pointer adds nothing; skip the per-cell distance test.
                if (mouse.down && (mouse_xv !== 0 || mouse_yv !== 0)) {
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
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        ctx.strokeStyle = "#98b1eb";
        ctx.beginPath();
        update_particle();
        ctx.stroke();

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

        // Snap negligible motion to exactly zero. Otherwise an idle fluid decays into
        // subnormal floats (~1e-322) that never reach zero, and subnormal math is
        // very slow on many x86 CPUs: the page gets slower the longer it sits idle.
        if (Math.abs(cell_data.xv) < 1e-6) cell_data.xv = 0;
        if (Math.abs(cell_data.yv) < 1e-6) cell_data.yv = 0;
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

    function set_pointer(x, y, reset) {
        var rect = canvas.getBoundingClientRect();
        if (reset) {
            mouse.px = x - rect.left;
            mouse.py = y - rect.top;
        } else {
            mouse.px = mouse.x;
            mouse.py = mouse.y;
        }
        mouse.x = x - rect.left;
        mouse.y = y - rect.top;
    }

    function mouse_up_handler() {
        mouse.down = false;
    }

    function mouse_move_handler(e) {
        set_pointer(e.clientX, e.clientY, !mouse.down);
        mouse.down = true; // hovering stirs the fluid
    }

    function touch_start_handler(e) {
        set_pointer(e.touches[0].clientX, e.touches[0].clientY, true);
        mouse.down = true;
    }

    function touch_move_handler(e) {
        set_pointer(e.touches[0].clientX, e.touches[0].clientY, false);
    }

    function touch_end_handler(e) {
        if (!e.touches.length) mouse.down = false;
    }

    function scroll_handler(e) {
        scroll.py = scroll.y;
        scroll.y = window.scrollY || window.pageYOffset;
    }

    onMount(() => {
        reduced_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        init();
        return teardown;
    });
</script>

<header class="hero-container" id="hero">
    <canvas id="c" aria-hidden="true"></canvas>
    <div class="hero-content">
        <p class="eyebrow">{profile.role} · {profile.location}</p>
        <h1>{profile.name}</h1>
        <p class="tagline">{profile.tagline}</p>
        <div class="cta">
            <a class="btn primary" href="#work">See my work</a>
            <a class="btn" href={profile.resume} target="_blank" rel="noopener">Résumé</a>
            <a class="btn" href="#contact">Get in touch</a>
        </div>
    </div>
    <a class="scroll-hint" href="#about" aria-label="Scroll to about">
        <span></span>
    </a>
</header>

<style>
    .hero-container {
        background: var(--bg);
        position: relative;
        overflow: hidden;
        display: flex;
        /* min-height, not height: on short / landscape phones the hero grows to fit its
           content instead of clipping the buttons. */
        min-height: 100vh;
        min-height: 100svh;
    }

    canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        /* Vertical scrolling and pinch-zoom stay with the browser; drags still stir the fluid. */
        touch-action: pan-y pinch-zoom;
    }

    .hero-content {
        position: relative;
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        /* Top clears the fixed nav, bottom clears the scroll hint. */
        padding: calc(4.75rem + env(safe-area-inset-top)) var(--gutter-r) 5.25rem var(--gutter-l);
        pointer-events: none; /* let the pointer reach the canvas */
        z-index: 2;
    }

    .eyebrow {
        font-family: var(--mono);
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 1rem;
        text-wrap: balance;
    }

    h1 {
        color: var(--fg);
        font-size: clamp(2.6rem, 9vw, 6rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1;
        text-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
    }

    .tagline {
        max-width: 38rem;
        margin-top: 1.25rem;
        font-size: clamp(1rem, 2.4vw, 1.2rem);
        line-height: 1.6;
        color: var(--muted);
        text-shadow: 0 0 20px rgba(0, 0, 0, 1);
        text-wrap: balance;
    }

    .cta {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 2rem;
        pointer-events: auto;
    }

    .scroll-hint {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 26px;
        height: 42px;
        border: 2px solid var(--line-strong);
        border-radius: 14px;
        z-index: 2;
    }

    .scroll-hint span {
        position: absolute;
        top: 8px;
        left: 50%;
        width: 4px;
        height: 8px;
        margin-left: -2px;
        border-radius: 2px;
        background: var(--accent);
        animation: wheel 1.8s ease-in-out infinite;
    }

    /* Extend the hint's tap area to 44px without changing how it looks. */
    .scroll-hint::before {
        content: "";
        position: absolute;
        inset: -3px -11px;
    }

    /* Landscape phones: no room for the hint; tighten the vertical rhythm. */
    @media (max-height: 480px) {
        .hero-content {
            padding-top: calc(4rem + env(safe-area-inset-top));
            padding-bottom: 1.5rem;
        }

        .scroll-hint {
            display: none;
        }

        h1 {
            font-size: clamp(2.6rem, 7vw, 4rem);
        }

        .tagline {
            margin-top: 0.9rem;
        }

        .cta {
            margin-top: 1.4rem;
        }
    }

    @keyframes wheel {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(14px); }
    }

    @media (prefers-reduced-motion: reduce) {
        .scroll-hint span { animation: none; }
    }
</style>
