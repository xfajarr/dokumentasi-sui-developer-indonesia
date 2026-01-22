# Repository Guidelines

## Project Structure & Module Organization
- `docs/` contains the workshop documentation (MD/MDX content).
- `src/` contains React/TypeScript components and Docusaurus theme customizations.
- `static/` holds public assets copied directly into the build output.
- `docusaurus.config.ts`, `sidebars.ts`, and `tailwind.config.ts` define site configuration, navigation, and styling.
- `build/` is generated output (do not edit by hand).

## Build, Test, and Development Commands
- `yarn`: install dependencies (Node.js >= 20 required).
- `yarn start`: run the local Docusaurus dev server with live reload.
- `yarn build`: generate the production static site into `build/`.
- `yarn serve`: serve the `build/` directory locally for verification.
- `yarn clear`: clear Docusaurus cache if builds act unexpectedly.
- `yarn typecheck`: run TypeScript type checking.

## Coding Style & Naming Conventions
- Use TypeScript/React with existing file and component patterns in `src/`.
- Keep indentation consistent with surrounding files (most project files use 2 spaces).
- Use descriptive component and file names (e.g., `HeroSection.tsx`, `custom.css`).
- No formatter is enforced in tooling; follow current style and avoid reformatting unrelated lines.

## Testing Guidelines
- No automated test runner is configured for this repo.
- If you add tests in the future, document the framework and add a script in `package.json`.
- For content changes, validate locally with `yarn start` and `yarn build`.

## Commit & Pull Request Guidelines
- Commit messages mostly follow a conventional style (`feat:`, `fix:`, `docs:`, `refactor:`). Use that pattern when possible.
- Keep commits focused on a single change or topic.
- PRs should include a concise description, note any affected sections in `docs/`, and include screenshots for visual UI changes.

## Configuration Tips
- Docusaurus configuration lives in `docusaurus.config.ts` and `sidebars.ts`.
- Static assets should go in `static/` and be referenced with root-relative paths (e.g., `/img/logo.png`).
