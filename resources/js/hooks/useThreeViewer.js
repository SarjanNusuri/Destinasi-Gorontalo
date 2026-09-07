import { useEffect, useRef, useCallback } from "react";

// THREE is loaded globally from CDN in the HTML, but in Vite/React we import it
// We'll dynamically load it since it's not in package.json
let THREE = null;

async function loadThree() {
    if (THREE) return THREE;
    const mod = await import("three");
    THREE = mod;
    return THREE;
}

function matte(THREE, color, opts = {}) {
    return new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        ...opts,
    });
}

function createOrbitControl(THREE, domElement, camera, target, opts = {}) {
    let radius = opts.radius || 14;
    const minR = opts.minRadius || 6;
    const maxR = opts.maxRadius || 30;
    let theta = opts.theta || 0.6;
    let phi = opts.phi || 1.15;
    let isDown = false;
    let lastX = 0;
    let lastY = 0;
    let idle = 0;
    const autoRotate = opts.autoRotate !== false;

    const onDown = (e) => {
        isDown = true;
        lastX = e.clientX;
        lastY = e.clientY;
        idle = 0;
        domElement.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
        isDown = false;
    };
    const onMove = (e) => {
        if (!isDown) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        theta -= dx * 0.006;
        phi -= dy * 0.006;
        phi = Math.max(0.4, Math.min(Math.PI - 0.5, phi));
        idle = 0;
    };
    const onWheel = (e) => {
        e.preventDefault();
        radius += e.deltaY * 0.02;
        radius = Math.max(minR, Math.min(maxR, radius));
        idle = 0;
    };

    domElement.addEventListener("pointerdown", onDown);
    domElement.addEventListener("pointerup", onUp);
    domElement.addEventListener("pointercancel", onUp);
    domElement.addEventListener("pointermove", onMove);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    function update(delta) {
        idle += delta;
        if (autoRotate && idle > 2.2 && !isDown) theta += delta * 0.14;
        camera.position.x =
            target.x + radius * Math.sin(phi) * Math.sin(theta);
        camera.position.z =
            target.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.position.y = target.y + radius * Math.cos(phi);
        camera.lookAt(target.x, target.y, target.z);
    }

    function reset() {
        theta = opts.theta || 0.6;
        phi = opts.phi || 1.15;
        radius = opts.radius || 14;
    }

    function destroy() {
        domElement.removeEventListener("pointerdown", onDown);
        domElement.removeEventListener("pointerup", onUp);
        domElement.removeEventListener("pointercancel", onUp);
        domElement.removeEventListener("pointermove", onMove);
        domElement.removeEventListener("wheel", onWheel);
    }

    return { update, reset, destroy };
}

// Scene builders for each destination type
function buildLakeScene(THREE, config) {
    const g = new THREE.Group();

    // Water surface
    const waterGeo = new THREE.CircleGeometry(9, 48);
    waterGeo.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(
        waterGeo,
        matte(THREE, config.waterColor, {
            transparent: true,
            opacity: 0.92,
            shininess: 80,
        })
    );
    const waterBase = Float32Array.from(waterGeo.attributes.position.array);
    g.add(water);

    // Surrounding hills
    for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const r = 10.5 + Math.random() * 2;
        const hill = new THREE.Mesh(
            new THREE.ConeGeometry(2 + Math.random(), 3 + Math.random() * 2, 6),
            matte(THREE, config.terrainColor)
        );
        hill.position.set(Math.cos(a) * r, 1, Math.sin(a) * r);
        g.add(hill);
    }

    // Boat
    const boat = new THREE.Group();
    boat.add(
        new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.4, 0.6),
            matte(THREE, 0x6b4a2f)
        )
    );
    const fig = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.7, 6),
        matte(THREE, 0xd9a441)
    );
    fig.position.y = 0.5;
    boat.add(fig);
    boat.position.set(-3, 0.5, -2);
    g.add(boat);

    return { group: g, water, waterBase, boat };
}

function buildCoralScene(THREE, config) {
    const g = new THREE.Group();

    // Underwater dome
    const water = new THREE.Mesh(
        new THREE.SphereGeometry(13, 24, 24),
        new THREE.MeshBasicMaterial({
            color: config.waterColor,
            transparent: true,
            opacity: 0.35,
            side: THREE.BackSide,
        })
    );
    g.add(water);

    // Seabed
    const seabedGeo = new THREE.CircleGeometry(9, 32);
    seabedGeo.rotateX(-Math.PI / 2);
    const seabed = new THREE.Mesh(
        seabedGeo,
        matte(THREE, config.terrainColor)
    );
    seabed.position.y = -2;
    g.add(seabed);

    // Corals
    const coralColors = [0xd9a441, 0xc1603d, 0x2fbfae, 0xe68a6c, 0x6fd6c4];
    for (let i = 0; i < 16; i++) {
        const type = Math.floor(Math.random() * 3);
        const color = coralColors[Math.floor(Math.random() * coralColors.length)];
        let coral;
        if (type === 0)
            coral = new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.4 + Math.random() * 0.5,
                    1 + Math.random(),
                    6
                ),
                matte(THREE, color)
            );
        else if (type === 1)
            coral = new THREE.Mesh(
                new THREE.TorusGeometry(
                    0.5 + Math.random() * 0.3,
                    0.15,
                    6,
                    10
                ),
                matte(THREE, color)
            );
        else
            coral = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.4 + Math.random() * 0.4, 0),
                matte(THREE, color)
            );
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 7;
        coral.position.set(
            Math.cos(a) * r,
            -1.6 + Math.random() * 0.6,
            Math.sin(a) * r
        );
        coral.rotation.set(Math.random(), Math.random(), Math.random());
        g.add(coral);
    }

    // Fish
    const fishGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const fish = new THREE.Mesh(
            new THREE.ConeGeometry(0.18, 0.55, 4),
            matte(
                THREE,
                coralColors[i % coralColors.length]
            )
        );
        fish.rotation.z = Math.PI / 2;
        fish.userData.offset = Math.random() * Math.PI * 2;
        fish.userData.r = 3 + Math.random() * 4;
        fish.userData.speed = 0.4 + Math.random() * 0.5;
        fish.userData.y = -0.5 + Math.random() * 2.5;
        fishGroup.add(fish);
    }
    g.add(fishGroup);

    return { group: g, fishGroup };
}

function buildFortScene(THREE, config) {
    const g = new THREE.Group();

    // Hill base
    const hillBase = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 8.5, 3, 8),
        matte(THREE, config.terrainColor)
    );
    hillBase.position.y = -1.5;
    g.add(hillBase);

    // Tower
    const tower = new THREE.Group();
    const t1 = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 3, 2.2, 10),
        matte(THREE, config.wallColor)
    );
    const t2 = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.6, 2, 10),
        matte(THREE, 0xb9714a)
    );
    t2.position.y = 2.1;
    const t3 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 2.1, 1.8, 10),
        matte(THREE, config.wallColor)
    );
    t3.position.y = 3.95;
    tower.add(t1, t2, t3);
    tower.position.y = 1.1;
    g.add(tower);

    // Flag
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2, 6),
        matte(THREE, 0x3a2a1a)
    );
    pole.position.y = 6;
    g.add(pole);
    const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.6),
        matte(THREE, 0xd9a441, { side: THREE.DoubleSide })
    );
    flag.position.set(0.5, 6.6, 0);

    // Staircase
    for (let i = 0; i < 9; i++) {
        const step = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.25, 0.6),
            matte(THREE, 0xcbb98f)
        );
        step.position.set(3.2 + i * 0.25, -2 + i * 0.28, 2.6 - i * 0.15);
        g.add(step);
    }

    // Trees
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 1.2, 5),
            matte(THREE, 0x5c3f27)
        );
        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(0.7, 1.6, 6),
            matte(THREE, config.terrainColor)
        );
        const r = 8 + Math.random();
        trunk.position.set(Math.cos(a) * r, -1, Math.sin(a) * r);
        leaves.position.set(Math.cos(a) * r, 0.2, Math.sin(a) * r);
        g.add(trunk, leaves);
    }

    return { group: g, flag };
}

function buildWaterfallScene(THREE, config) {
    const g = new THREE.Group();

    // Cliff walls
    const cliff1 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 8, 4),
        matte(THREE, 0x5a4a3a)
    );
    cliff1.position.set(-4, 2, 0);
    g.add(cliff1);
    const cliff2 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 7, 4),
        matte(THREE, 0x4a3a2a)
    );
    cliff2.position.set(4, 1.5, 0);
    g.add(cliff2);

    // Waterfall sheets
    const sheets = [];
    for (let i = 0; i < 3; i++) {
        const sheet = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2 - i * 0.2, 6),
            new THREE.MeshPhongMaterial({
                color: config.waterColor,
                transparent: true,
                opacity: 0.5 - i * 0.1,
                flatShading: true,
            })
        );
        sheet.position.set(i * 0.3 - 0.3, 3, 0.1);
        g.add(sheet);
        sheets.push(sheet);
    }

    // Pool at bottom
    const poolGeo = new THREE.CircleGeometry(4, 32);
    poolGeo.rotateX(-Math.PI / 2);
    const pool = new THREE.Mesh(
        poolGeo,
        matte(THREE, config.waterColor, {
            transparent: true,
            opacity: 0.85,
            shininess: 80,
        })
    );
    pool.position.y = -1.5;
    g.add(pool);

    // Trees around
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = 6 + Math.random() * 3;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.18, 2.4, 5),
            matte(THREE, 0x5c3f27)
        );
        const crown = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.9, 0),
            matte(THREE, config.terrainColor)
        );
        trunk.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        crown.position.set(Math.cos(a) * r, 1.5, Math.sin(a) * r);
        g.add(trunk, crown);
    }

    // Rocks
    for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 2;
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.3, 0),
            matte(THREE, 0x7a7a6a)
        );
        rock.position.set(Math.cos(a) * r, -1.2, Math.sin(a) * r);
        g.add(rock);
    }

    return { group: g, sheets };
}

function buildScene(THREE, config) {
    switch (config.type) {
        case "lake":
            return buildLakeScene(THREE, config);
        case "coral":
            return buildCoralScene(THREE, config);
        case "fort":
            return buildFortScene(THREE, config);
        case "waterfall":
            return buildWaterfallScene(THREE, config);
        default:
            return buildLakeScene(THREE, config);
    }
}

export function useThreeViewer(canvasRef, wrapRef, sceneConfig) {
    const stateRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !wrapRef.current || !sceneConfig) return;

        let disposed = false;

        async function init() {
            const THREE = await loadThree();
            if (disposed) return;

            const canvas = canvasRef.current;
            const wrap = wrapRef.current;
            const renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(sceneConfig.fogColor, 0.018);

            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
            const target = new THREE.Vector3(0, 2, 0);
            const control = createOrbitControl(THREE, canvas, camera, target, {
                radius: 16,
                theta: 0.7,
                phi: 1.1,
                minRadius: 8,
                maxRadius: 26,
            });

            // Lighting
            scene.add(
                new THREE.HemisphereLight(0xbfe9e0, 0x081a20, 1.0)
            );
            const key = new THREE.DirectionalLight(0xffe9c2, 1.15);
            key.position.set(10, 16, 8);
            scene.add(key);

            // Build scene
            const sceneData = buildScene(THREE, sceneConfig);
            scene.add(sceneData.group);

            // Resize handler
            function resize() {
                const w = wrap.clientWidth;
                const h = wrap.clientHeight;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
            window.addEventListener("resize", resize);
            resize();

            // Animation loop
            const clock = new THREE.Clock();
            function animate() {
                rafRef.current = requestAnimationFrame(animate);
                const delta = clock.getDelta();
                const t = clock.getElapsedTime();
                resize();
                control.update(delta);

                // Animate water
                if (sceneData.water && sceneData.waterBase) {
                    const arr = sceneData.water.geometry.attributes.position
                        .array;
                    for (let i = 0; i < arr.length / 3; i++) {
                        const x = sceneData.waterBase[i * 3];
                        const z = sceneData.waterBase[i * 3 + 2];
                        arr[i * 3 + 1] =
                            Math.sin(x * 0.4 + t) * 0.08 +
                            Math.cos(z * 0.4 + t * 0.8) * 0.08;
                    }
                    sceneData.water.geometry.attributes.position.needsUpdate = true;
                }

                // Animate boat
                if (sceneData.boat) {
                    sceneData.boat.position.y =
                        0.5 + Math.sin(t * 1.5) * 0.05;
                }

                // Animate fish
                if (sceneData.fishGroup) {
                    sceneData.fishGroup.children.forEach((f) => {
                        const a = t * f.userData.speed + f.userData.offset;
                        f.position.set(
                            Math.cos(a) * f.userData.r,
                            f.userData.y + Math.sin(a * 2) * 0.2,
                            Math.sin(a) * f.userData.r
                        );
                        f.rotation.y = -a + Math.PI / 2;
                    });
                }

                // Animate waterfall sheets
                if (sceneData.sheets) {
                    sceneData.sheets.forEach((s, i) => {
                        s.position.y =
                            3 + Math.sin(t * 2 + i) * 0.15;
                        s.material.opacity =
                            0.4 + Math.sin(t * 3 + i * 0.5) * 0.1;
                    });
                }

                // Animate flag
                if (sceneData.flag) {
                    sceneData.flag.rotation.y = Math.sin(t * 3) * 0.15;
                }

                renderer.render(scene, camera);
            }
            animate();

            stateRef.current = { renderer, scene, camera, control, resize };
        }

        init();

        return () => {
            disposed = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (stateRef.current) {
                stateRef.current.control.destroy();
                stateRef.current.renderer.dispose();
                window.removeEventListener(
                    "resize",
                    stateRef.current.resize
                );
            }
        };
    }, [canvasRef, wrapRef, sceneConfig]);

    const resetView = useCallback(() => {
        if (stateRef.current) stateRef.current.control.reset();
    }, []);

    return { resetView };
}
