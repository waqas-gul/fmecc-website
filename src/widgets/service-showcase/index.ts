// WS-5 public API (planning/ARCHITECTURE.md §8).
// - ServiceShowcase: the service page showcase section (scene, coverage diagram or gallery).
// - showcaseScenes: loader, poster and text alternative per 3D scene, for any other LazyScene slot
//   (the ProcessSection on Home and About uses `showcaseScenes.tower`). Loaders are client
//   references, so a Server Component may pass them to a client component as props.
export { showcaseScenes, type SceneKey, type ShowcaseScene } from "./model/scenes";
export { ServiceShowcase } from "./ui/ServiceShowcase";
