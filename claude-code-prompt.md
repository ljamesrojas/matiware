Read `CLAUDE.md` and `hardware-explorer-plan.md` in this folder from top to bottom before writing any code. Follow the rules in `CLAUDE.md` for the whole project.

Then build **Phase 1 only** (section 10 of the plan) of the Hardware Explorer: a React + TypeScript + Vite app with a 3D Desktop PC (React Three Fiber) that students can rotate, explode and click to learn about each part.

Requirements:
- Match the approved "Bench" theme in section 11 exactly (colors, Geist / Geist Mono fonts, radius, shadows) and the layout in section 4: header, sidebar with device tiles and a numbered parts list, center stage with a floating dock, and a floating inspector card. Include the mobile layout with the bottom sheet.
- Use the part list, codes, connections and card content in section 8 as the data. Keep all content in `src/data/`, not inside components.
- Build all 3D parts from primitives in code, following the shape notes in section 8 and the scene look in section 9. Don't download 3D models.
- Implement every interaction in section 5, including Isolate, Labels, Beginner / Advanced, "Connects to" navigation, Previous / Next, keyboard support and reduced motion.
- Use the folder structure in section 12.

Work step by step: set up the project and theme first, then the layout, then the 3D model, then the interactions.

Important:
- **Do not commit or push anything.** When the work is ready, tell me which files to commit and give me the `git add` and `git commit -m "..."` commands to run myself. No `Co-Authored-By` line or mention of Claude in the commit messages.
- When Phase 1 is done, run the dev server, fix any console errors, then **stop** and give me the Phase 1 summary in the format from `CLAUDE.md`. Wait for me to say "continue" before starting Phase 2.
