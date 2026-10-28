# Showcase scene posters

`tower-scene.png`, `building-scene.png` and `bollard-scene.png` are still renders of the procedural
3D scenes in `src/widgets/service-showcase/scenes/`, used as their `LazyScene` posters. They are
illustrations generated from code, not photographs, and depict no real FMECC project.

How they were made (repeat whenever a scene's geometry, materials or camera changes):

1. Mount the scene at its finished state, `<Scene progress={1} active tier="high" reducedMotion={false} />`,
   in a 2400 × 3000 px element on a transparent page, and screenshot it with a transparent
   background (headless Chrome over CDP, GPU enabled). The scene's own frame mask fades the edges.
2. Downscale to 1600 × 2000 (Lanczos) and flatten onto navy-950 `#070b14`, the `dark` scheme
   surface the scenes sit on. Transparent WebPs were about 5× larger.
3. Save here as `<scene>-scene.png` and run `npm run images -- --media`.

Use the posters in `scheme="dark"` sections; on another surface the navy-950 background shows.
