# Matware

An interactive 3D explorer that teaches what is inside computing devices. Rotate a desktop PC, laptop or smartphone, pull it apart, and click any part to learn what it is, what it does, and what it connects to.

Built for IT students learning computer hardware.

## Features

- **Three devices:** desktop PC, laptop and smartphone, each built from simple 3D shapes.
- **Explode view:** a slider pulls every part away from the case so you can see the layout.
- **Part cards:** definition, main function, specs, signs of failure and connected parts.
- **Beginner / Advanced:** switch between plain explanations and the technical terms.
- **Flow mode:** watch data and power move between parts, step by step.
- **Test yourself:**
  - *Identify:* name the highlighted part.
  - *Assemble:* put the device back together in a working order.
  - *Troubleshoot:* find the faulty part from the symptoms.
- **Compare:** see the same kind of part (memory, storage, cooling…) side by side across devices, at the same size or true scale.
- **Works offline:** installable as an app, and it keeps working without internet after the first visit.
- **Phone friendly:** a bottom sheet replaces the side panel on small screens.

## Run it locally

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built app locally |
| `npm run typecheck` | Type-check only |

## Controls

| Action | Mouse | Touch |
|---|---|---|
| Rotate | Drag | One-finger drag |
| Zoom | Scroll | Pinch |
| Pan | Right-drag | Two-finger drag |
| Select a part | Click | Tap |
| Close / go back | Esc | Close button |

## Tech stack

- [React 18](https://react.dev/) + TypeScript, built with [Vite](https://vitejs.dev/)
- [three.js](https://threejs.org/) through [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://drei.docs.pmnd.rs/)
- [Zustand](https://zustand.docs.pmnd.rs/) for app state
- CSS Modules with theme tokens in `src/theme.css`
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for the offline cache
- [Geist](https://vercel.com/font) fonts and [Lucide](https://lucide.dev/) icons

## Project structure

```
src/
  data/         Learning content: devices, parts, flows, quizzes, troubleshooting
  models/       3D models for each device, built from primitives
  components/
    viewer/     3D scene, camera, labels, flow and compare layers
    inspector/  Part card, device overview and mobile bottom sheet
    layout/     Header, sidebar, parts list, menus
    quiz/       Identify, Assemble and Troubleshoot modes
    landing/    Landing page illustration
  pages/        Landing page and explorer
  store/        App state and quiz logic
```

All learning text lives in `src/data/`. To fix or extend a part's description, edit the device file there; no component code needs to change.

## Deploy

The repo includes a `netlify.toml`. On [Netlify](https://www.netlify.com/), import the repo and the build settings fill in automatically (`npm run build`, publish `dist`). Any static host works, since the app uses hash routes and relative paths.

## Author

Made by **Lawrenze James Rojas**, BSIT student at Gordon College.
Portfolio: [ljrojas.vercel.app](https://ljrojas.vercel.app/)

## License

[MIT](LICENSE)
