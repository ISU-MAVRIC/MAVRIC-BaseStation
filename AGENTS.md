# AGENTS.md

## Cursor Cloud specific instructions

This is the **MAVRIC Base Station** — an Electron + Svelte desktop GUI for controlling a Mars rover (ISU-MAVRIC). See `README.md` for project overview and basic setup steps.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `yarn` |
| Lint (prettier) | `npx prettier --check "**/*.{js,ts,tsx,jsx,svelte,css,scss,md,json,html}"` |
| Build | `yarn build` |
| Dev (Electron + Rollup) | `yarn electron-dev` |

### Non-obvious notes

- **No lockfile**: `yarn.lock` is gitignored; `yarn` will resolve fresh each time.
- **Node version**: Must use Node.js 18.18.2 (pinned in `.nvmrc`). Use `nvm use` to switch.
- **Electron on headless/container**: Electron requires a display server. The Cloud VM provides X11 on `:1` (`DISPLAY=:1`). D-Bus and GPU errors in the terminal are expected and harmless.
- **No automated test suite**: The project has no unit/integration tests. CI checks are: prettier formatting, Electron build/launch smoke test, and LF line-ending enforcement.
- **ROS not required**: The GUI connects to a ROS rover via WebSocket (`ws://192.168.1.10:9090`). It launches and is fully navigable without a rover connection; some pages show loading/placeholder states.
- **Map tiles**: The Leaflet map on the Autonomous Debug page requires offline tile files in `public/tiles/`. These are not in the repo and are downloaded separately from CyBox. The map renders as grey without them.
- **Dev server port**: The Rollup dev server runs on `http://localhost:8080`. Electron loads from this URL in dev mode.
